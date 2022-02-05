const Render = require("../../lib/render");

describe("Render", () => {
  test("projectItemsByStatus", () => {
    const testStatusGroup = {
      98236657: {
        name: "🏁Done🏁",
        items: [
          "PNI_lADOA20Mnc0z2c4AFIkf",
          "PNI_lADOA20Mnc0z2c4AFQWj",
          "PNI_lADOA20Mnc0z2c4AFYIT",
          "PNI_lADOA20Mnc0z2c4AFYIX",
          "PNI_lADOA20Mnc0z2c4AFt0H",
          "PNI_lADOA20Mnc0z2c4AFz1V",
        ],
      },
      "85617f5a": {
        name: ":hammer:Others:hammer:",
        items: ["PNI_lADOA20Mnc0z2c4ACZsm", "PNI_lADOA20Mnc0z2c4AFtBg"],
      },
      "9c41f080": {
        name: ":scroll:Backlog:scroll:",
        items: [
          "PNI_lADOA20Mnc0z2c4AByni",
          "PNI_lADOA20Mnc0z2c4ABzyI",
          "PNI_lADOA20Mnc0z2c4AB3ol",
        ],
      },
      f75ad846: {
        name: "🚩Todo🚩",
        items: [
          "PNI_lADOA20Mnc0z2c4AES6Z",
          "PNI_lADOA20Mnc0z2c4AEpPF",
          "PNI_lADOA20Mnc0z2c4AEpqD",
          "PNI_lADOA20Mnc0z2c4AEprf",
          "PNI_lADOA20Mnc0z2c4AEpr0",
          "PNI_lADOA20Mnc0z2c4AEwNi",
          "PNI_lADOA20Mnc0z2c4AE2_H",
          "PNI_lADOA20Mnc0z2c4AFBIu",
        ],
      },
      "47fc9ee4": {
        name: "🐝In Progress🐝",
        items: [],
      },
    };

    const rendering = Render.projectItemsByStatus(testStatusGroup);
    expect(rendering).toBeDefined();
  });
});
