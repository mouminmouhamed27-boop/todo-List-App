const { GoogleGenAI } = require("@google/genai");
const taskService = require("./taskService");

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const tools = [
  {
    functionDeclarations: [
      {
        name: "get_my_tasks",
        description: "Get the logged-in user's tasks",
        parameters: {
          type: "object",
          properties: {},
        },
      },

      {
        name: "get_pending_tasks",
        description: "Get the logged-in user's incomplete tasks",
        parameters: {
          type: "object",
          properties: {},
        },
      },

      {
        name: "get_completed_tasks",
        description: "Get the logged-in user's completed tasks",
        parameters: {
          type: "object",
          properties: {},
        },
      },

      {
        name: "create_task",
        description: "Create a new task for the logged-in user",
        parameters: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Task title",
            },
            description: {
              type: "string",
              description: "Task description",
            },
          },
          required: ["title"],
        },
      },

      {
        name: "update_task",
        description: "Update one of the logged-in user's tasks",
        parameters: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Task id",
            },
            title: {
              type: "string",
            },
            description: {
              type: "string",
            },
            completed: {
              type: "boolean",
            },
          },
          required: ["id"],
        },
      },

      {
        name: "delete_task",
        description: "Delete one of the logged-in user's tasks",
        parameters: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Task id",
            },
          },
          required: ["id"],
        },
      },
    ],
  },
];

async function executeTool(name, args, userId) {
  switch (name) {
    case "get_my_tasks":
      return await taskService.getAll(userId);

    case "get_pending_tasks": {
      const tasks = await taskService.getAll(userId);

      return tasks.filter((task) => !task.completed);
    }

    case "get_completed_tasks": {
      const tasks = await taskService.getAll(userId);

      return tasks.filter((task) => task.completed);
    }

    case "create_task":
      return await taskService.create(userId, {
        title: args.title,
        description: args.description || "",
      });

    case "update_task":
      return await taskService.update(userId, args.id, {
        ...(args.title !== undefined && {
          title: args.title,
        }),

        ...(args.description !== undefined && {
          description: args.description,
        }),

        ...(args.completed !== undefined && {
          completed: args.completed,
        }),
      });

    case "delete_task":
      return await taskService.remove(userId, args.id);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function askAssistant(userId, question) {
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: question,
        },
      ],
    },
  ];

  while (true) {
    const response = await client.models.generateContent({
      model: "gemini-3.6-flash",
      contents,

      config: {
        systemInstruction: `
You are an AI assistant inside a task management application.

Rules:
- You help the currently logged-in user manage their tasks.
- Never assume tasks that you have not retrieved.
- Use tools when you need task information or need to modify tasks.
- Never invent task IDs.
- Never access another user's tasks.
- Respond clearly in Arabic.
`,
        tools,
      },
    });

    const functionCalls = response.functionCalls || [];

    if (!functionCalls.length) {
      return response.text;
    }

    // Add Gemini's response to the conversation
    contents.push(response.candidates[0].content);

    const functionResponseParts = [];

    for (const call of functionCalls) {
      const args = call.args || {};

      console.log("Gemini requested tool:", call.name);
      console.log("Arguments:", args);

      const result = await executeTool(call.name, args, userId);

      functionResponseParts.push({
        functionResponse: {
          name: call.name,
          response: {
            result,
          },
        },
      });
    }

    // Send tool results back to Gemini
    contents.push({
      role: "tool",
      parts: functionResponseParts,
    });
  }
}

module.exports = {
  askAssistant,
};
