// interface ArrProps {
//   id: number;
//   parentId: number | null;
// }
const arr = [
  {
    id: 1,
    parentId: null,
  },
  {
    id: 2,
    parentId: 1,
  },
  {
    id: 3,
    parentId: 2,
  },
  {
    id: 4,
    parentId: null,
  },
  {
    id: 5,
    parentId: 2,
  },
  {
    id: 6,
    parentId: 3,
  },
  {
    id: 7,
    parentId: 3,
  },
  {
    id: 8,
    parentId: 4,
  },
  {
    id: 9,
    parentId: 5,
  },
  {
    id: 10,
    parentId: 2,
  },
  {
    id: 11,
    parentId: 4,
  },
];

const gettedId = 9;

const helperLopp = (arr, list) => {
  arr.map((element) => {
    checkChildrenRecursive(element.id, list, gettedId);
  });
};
const checkChildrenRecursive = (parentId, list, gettedId) => {
  let result = true; // Initialize the result as true

  for (const child of list) {
    if (child.parentId === parentId) {
      if (child.id === gettedId) {
        result = false; // If gettedId is found, set the result to false
        break; // Stop the loop
      } else {
        // Recursively check the children and update the result
        result = result && checkChildrenRecursive(child.id, list, gettedId);
      }
    }
  }

  return result;
};
console.log('result', checkChildrenRecursive(11, arr, 2));
