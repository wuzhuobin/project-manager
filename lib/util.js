function arrayToEvery100Arrays(array) {
  const arrays = [];
  for (let i = 0; i < array.length; i += 100) {
    arrays.push(array.slice(i, i + 100));
  }
  return arrays;
}
module.exports.arrayToEvery100Arrays = arrayToEvery100Arrays;
