const Project = require('../../lib/project');

describe("project", () => {

	const project = new Project(TOKEN);

	test("getProjectId", async () => {
		const organization = "philips-internal";
		const number = 93;

		const id = await project.getProjectId(organization, number);
		expect(id).toBe("PN_kwDOA20Mnc0z2Q");
	});
});