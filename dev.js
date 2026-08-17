for (let index = 1; index <= 10; index++) {
  console.log(`The number ${index}`);
}

const add = (a, b) => a + b;

const multi = (a, b) => a * b;
console.log(add(1, 10));
console.log(multi(1, 10));

const users = [
  {
    id: 1,
    name: "Ahmed",
    age: 26,
    isActive: true,
    hobbies: ["Reading", "Writng"],
  },
  {
    id: 2,
    name: "samar",
    age: 8,
    isActive: false,
    hobbies: ["programing", "Writng"],
  },
  {
    id: 3,
    name: "Momen",
    age: 21,
    isActive: true,
    hobbies: ["Reading", "driving"],
  },
];
const names = users.map((u) => u.name);
console.log(names);
//---------------------------------------------------------------------------
const Ages = users.map((u) => u.age);
console.log(Ages);
//-------------------------------------------------------------------------
const active = users.find((u) => u.isActive === true);
console.log(active.name);
//------------------------------------------------------------------
const adult = users.filter((u) => u.age > 18);
const namesAdults = adult.map((u) => u.name);
console.log(namesAdults);
//-------------------------------------------------------------------
const DataJson = JSON.stringify(users);
console.log(DataJson);
//----------------------------------------------------------------------
console.log(JSON.parse(DataJson));
