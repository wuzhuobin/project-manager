const Project = require('../../lib/project');

describe("project", () => {

	const project = new Project(TOKEN);
	const organization = "philips-internal";
	const number = 93;

	test("getProjectId", async () => {

		const id = await project.getProjectId(organization, number);
		expect(id).toBe("PN_kwDOA20Mnc0z2Q");
	});

	test("getProjectFields", async () => {

		const fields = await project.getProjectFields(organization, number);
		console.log(fields);
	})
});