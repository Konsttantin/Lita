export default function makeUniqueByProp(arr, prop) {
  const propsArray = Array.from(new Set(arr.map(obj => obj[prop])));

  return propsArray.map(p => arr.find(obj => obj[prop] === p));
}
