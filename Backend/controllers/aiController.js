const aiService = require("../services/aiService");

async function askAI(req, res, next) {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const answer = await aiService.askAssistant(req.user.id, question.trim());

    res.json({
      success: true,
      data: {
        answer,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.status === 429 && error.code === "credit_balance_exhausted") {
      return res.status(503).json({
        success: false,
        message: "AI service is unavailable because API credits are exhausted.",
      });
    }

    next(error);
  }
}

module.exports = {
  askAI,
};
