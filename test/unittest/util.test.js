const Util = require("../../lib/util");
describe("util", () => {
  test("arrayToEvery100ArraysWith4Arrays", () => {
    const testArray = [];
    for (let i = 0; i < 304; ++i) {
      testArray.push(i);
    }

    const testArrays = Util.arrayToEvery100Arrays(testArray);
    expect(testArrays).toHaveLength(4);
    expect(testArrays[0]).toHaveLength(100);
    expect(testArrays[3]).toEqual(testArray.slice(300, 304));
  });

  test("arrayToEvery100ArraysWith1Array", () => {
    const testArray = [];
    for (let i = 0; i < 99; ++i) {
      testArray.push(i);
    }

    const testArrays = Util.arrayToEvery100Arrays(testArray);
    expect(testArrays).toHaveLength(1);
    expect(testArrays[0]).toHaveLength(99);
  });
});
