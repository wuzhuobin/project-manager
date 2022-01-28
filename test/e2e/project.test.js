const Project = require("../../lib/project");

describe("e2e", () => {
  describe("Project", () => {
    const organization = "philips-internal";
    const number = 93;
    const project = new Project(organization, number, TOKEN);

    test("getProjectId", async () => {
      const id = await project.getProjectId();
      expect(id).toBe("PN_kwDOA20Mnc0z2Q");
    });

    test("getProjectFieldCount", async () => {
      const count = await project.getProjectFieldCount();
      expect(count).toBe(12);
    });

    test("getProjectFields", async () => {
      const fields = await project.getProjectFields();
      expect(fields.length).toBe(12);
    });

    test("getProjectItemCount", async () => {
      const count = await project.getProjectItemCount();
      expect(count).toBe(104);
    });

    test("getProjectItems", async () => {
      const items = await project.getProjectItems();
      expect(items.length).toEqual(104);
    });
  });
});
