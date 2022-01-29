const Project = require("../../lib/project");
jest.mock("axios");
const axios = require("axios").default;

describe("Project", () => {
  const organization = "philips-internal";
  const number = 93;
  const testItemId = "PNI_lADOA20Mnc0z2c4AFtBg";
  const testItemFieldValues = [
    {
      value: "Summary of the first phrase",
      projectField: {
        id: "MDE2OlByb2plY3ROZXh0RmllbGQ5NTk0OA==",
        name: "Title",
      },
    },
    {
      value: "85617f5a",
      projectField: {
        id: "MDE2OlByb2plY3ROZXh0RmllbGQ5NTk1MA==",
        name: "Status",
      },
    },
    {
      value: "e1a62df9",
      projectField: {
        id: "MDE2OlByb2plY3ROZXh0RmllbGQxODc5NDM=",
        name: "Priority",
      },
    },
  ];
  const testFields = [
    {
      id: "MDE2OlByb2plY3ROZXh0RmllbGQ5NTk1MA==",
      name: "Status",
      settings: JSON.parse(
        '{"width":153,"options":[{"id":"85617f5a","name":":hammer:Others:hammer:","name_html":"<g-emoji class=\\"g-emoji\\" alias=\\"hammer\\" fallback-src=\\"https://github.githubassets.com/images/icons/emoji/unicode/1f528.png\\">🔨</g-emoji>Others<g-emoji class=\\"g-emoji\\" alias=\\"hammer\\" fallback-src=\\"https://github.githubassets.com/images/icons/emoji/unicode/1f528.png\\">🔨</g-emoji>"},{"id":"9c41f080","name":":scroll:Backlog:scroll:","name_html":"<g-emoji class=\\"g-emoji\\" alias=\\"scroll\\" fallback-src=\\"https://github.githubassets.com/images/icons/emoji/unicode/1f4dc.png\\">📜</g-emoji>Backlog<g-emoji class=\\"g-emoji\\" alias=\\"scroll\\" fallback-src=\\"https://github.githubassets.com/images/icons/emoji/unicode/1f4dc.png\\">📜</g-emoji>"},{"id":"f75ad846","name":"🚩Todo🚩","name_html":"<g-emoji class=\\"g-emoji\\" alias=\\"triangular_flag_on_post\\" fallback-src=\\"https://github.githubassets.com/images/icons/emoji/unicode/1f6a9.png\\">🚩</g-emoji>Todo<g-emoji class=\\"g-emoji\\" alias=\\"triangular_flag_on_post\\" fallback-src=\\"https://github.githubassets.com/images/icons/emoji/unicode/1f6a9.png\\">🚩</g-emoji>"},{"id":"47fc9ee4","name":"🐝In Progress🐝","name_html":"<g-emoji class=\\"g-emoji\\" alias=\\"bee\\" fallback-src=\\"https://github.githubassets.com/images/icons/emoji/unicode/1f41d.png\\">🐝</g-emoji>In Progress<g-emoji class=\\"g-emoji\\" alias=\\"bee\\" fallback-src=\\"https://github.githubassets.com/images/icons/emoji/unicode/1f41d.png\\">🐝</g-emoji>"},{"id":"98236657","name":"🏁Done🏁","name_html":"<g-emoji class=\\"g-emoji\\" alias=\\"checkered_flag\\" fallback-src=\\"https://github.githubassets.com/images/icons/emoji/unicode/1f3c1.png\\">🏁</g-emoji>Done<g-emoji class=\\"g-emoji\\" alias=\\"checkered_flag\\" fallback-src=\\"https://github.githubassets.com/images/icons/emoji/unicode/1f3c1.png\\">🏁</g-emoji>"}]}'
      ),
    },
    {
      id: "MDE2OlByb2plY3ROZXh0RmllbGQ5NTk1MQ==",
      name: "Labels",
      settings: JSON.parse('{"width":288}'),
    },
    {
      id: "MDE2OlByb2plY3ROZXh0RmllbGQxODc5NDM=",
      name: "Priority",
      settings: JSON.parse(
        '{"width":139,"options":[{"id":"d025e06c","name":"❗High❗","name_html":"<g-emoji class=\\"g-emoji\\" alias=\\"exclamation\\" fallback-src=\\"https://github.githubassets.com/images/icons/emoji/unicode/2757.png\\">❗</g-emoji>High<g-emoji class=\\"g-emoji\\" alias=\\"exclamation\\" fallback-src=\\"https://github.githubassets.com/images/icons/emoji/unicode/2757.png\\">❗</g-emoji>"},{"id":"e056cb71","name":"❕Medium❕","name_html":"<g-emoji class=\\"g-emoji\\" alias=\\"grey_exclamation\\" fallback-src=\\"https://github.githubassets.com/images/icons/emoji/unicode/2755.png\\">❕</g-emoji>Medium<g-emoji class=\\"g-emoji\\" alias=\\"grey_exclamation\\" fallback-src=\\"https://github.githubassets.com/images/icons/emoji/unicode/2755.png\\">❕</g-emoji>"},{"id":"5e1391e6","name":"❓Low❓","name_html":"<g-emoji class=\\"g-emoji\\" alias=\\"question\\" fallback-src=\\"https://github.githubassets.com/images/icons/emoji/unicode/2753.png\\">❓</g-emoji>Low<g-emoji class=\\"g-emoji\\" alias=\\"question\\" fallback-src=\\"https://github.githubassets.com/images/icons/emoji/unicode/2753.png\\">❓</g-emoji>"},{"id":"e1a62df9","name":"📍None📍","name_html":"<g-emoji class=\\"g-emoji\\" alias=\\"round_pushpin\\" fallback-src=\\"https://github.githubassets.com/images/icons/emoji/unicode/1f4cd.png\\">📍</g-emoji>None<g-emoji class=\\"g-emoji\\" alias=\\"round_pushpin\\" fallback-src=\\"https://github.githubassets.com/images/icons/emoji/unicode/1f4cd.png\\">📍</g-emoji>"}]}'
      ),
    },
    {
      id: "MDE2OlByb2plY3ROZXh0RmllbGQxODgwMTM=",
      name: "Story Point",
      settings: JSON.parse('{"width":119}'),
    },
  ];
  const project = new Project(organization, number);

  test("getProjectId", async () => {
    axios.post.mockResolvedValue({
      data: {
        data: {
          organization: {
            projectNext: {
              id: "PN_kwDOA20Mnc0z2Q",
            },
          },
        },
      },
    });
    const id = await project.getProjectId();
    expect(id).toBe("PN_kwDOA20Mnc0z2Q");
  });

  test("makeStatusGroup", () => {
    const group = project.makeStatusGroup(testFields);
    expect(group).toHaveProperty("85617f5a", "name", ":hammer:Others:hammer:");
    expect(group).toHaveProperty("85617f5a", "items", []);
  });

  test("groupProjectItemsByStatus", () => {
    const group = project.makeStatusGroup(testFields);
    const items = [{ id: testItemId, fieldValues: testItemFieldValues }];
    project.groupProjectItemsByStatus(items, group);
    expect(group["85617f5a"].items).toContainEqual(testItemId);
  });
});
