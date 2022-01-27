const Project = require("../../lib/project");

describe("e2e", () => {
  describe("project", () => {
    const organization = "philips-internal";
    const number = 93;
    const project = new Project(organization, number, TOKEN);

    test("getProjectId", async () => {
      const id = await project.getProjectId(organization, number);
      expect(id).toBe("PN_kwDOA20Mnc0z2Q");
    });

    test("getProjectFieldCount", async () => {
      const count = await project.getProjectFieldCount(organization, number);
      expect(count).toBe(12);
    });

    test("getProjectFieldName", async () => {
      const names = await project.getProjectFieldName(organization, number);
      expect(names).toEqual([
        "Title",
        "Assignees",
        "Status",
        "Labels",
        "Repository",
        "Milestone",
        "Priority",
        "Story Point",
        "Comment",
        "Sprint",
        "Linked Pull Requests",
        "Reviewers",
      ]);
    });
  });
});
