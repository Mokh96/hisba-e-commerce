interface ArrProps {
  id: number;
  parentId: number | null;
}

export const checkChildrenRecursive = (
  parentId: number,
  list: ArrProps[],
  gettedId: number,
): boolean => {
  let result = true; // Initialize the result as true

  for (const child of list) {
    if (child.parentId === parentId) {
      if (child.id === gettedId) {
        result = false; // If gettedId is found, set the result to false
        break; // Stop the loop
      } else {
        result = result && checkChildrenRecursive(child.id, list, gettedId);
      }
    }
  }

  return result;
};
