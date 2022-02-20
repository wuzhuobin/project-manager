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
    {
      value: "0b16fa06",
      projectField: {
        id: "MDE2OlByb2plY3ROZXh0RmllbGQyMzcyMDE=",
        name: "Sprint",
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
    {
      id: "MDE2OlByb2plY3ROZXh0RmllbGQyMzcyMDE=",
      name: "Sprint",
      settings: JSON.parse(
        '{"width":156,"configuration":{"duration":20,"start_day":2,"iterations":[],"completed_iterations":[{"id":"39857db5","title":"Sprint 3","duration":20,"start_date":"2022-01-01","title_html":"Sprint 3"},{"id":"0b16fa06","title":"Sprint 2","duration":16,"start_date":"2021-12-16","title_html":"Sprint 2"},{"id":"48a795a4","title":"Sprint 1","duration":50,"start_date":"2021-10-27","title_html":"Sprint 1"}]}}'
      ),
    },
    {
      id: "MDE2OlByb2plY3ROZXh0RmllbGQ0MTg2OTg=",
      name: "Linked Pull Requests",
      settings: JSON.parse("null"),
    },
  ];
  const testItems = [
    {
      id: "PNI_lADOA20Mnc0z2c4AByoE",
      title: "Providing apis for generating CSR",
      content: {
        __typename: "Issue",
        id: "I_kwDOGPV02s4-eq_M",
        number: 12,
        url: "https://github.com/philips-internal/libscep/issues/12",
      },
    },
    {
      id: "PNI_lADOA20Mnc0z2c4ABD7t",
      title: "What is CMS(older version is PKCS #7)?",
      content: {
        __typename: "Issue",
        id: "I_kwDOGPV02s49lDf-",
        number: 2,
        url: "https://github.com/philips-internal/libscep/issues/2",
      },
    },
    {
      id: "PNI_lADOA20Mnc0z2c4AB5ll",
      title: "Implement renew functions in scep",
      content: {
        __typename: "Issue",
        id: "I_kwDOGPV02s4-nM2-",
        number: 21,
        url: "https://github.com/philips-internal/libscep/issues/21",
      },
    },
    {
      id: "PNI_lADOA20Mnc0z2c4AB4FM",
      title: "Figure out a way to build the SecMgr easily",
      content: {
        __typename: "Issue",
        id: "I_kwDOGPV02s4-lfyG",
        number: 20,
        url: "https://github.com/philips-internal/libscep/issues/20",
      },
    },
    {
      id: "PNI_lADOA20Mnc0z2c4AB5o5",
      title:
        "component tests for demonstrating the GetCA->Enrolment->Renewal is working",
      content: {
        __typename: "Issue",
        id: "I_kwDOGPV02s4-nSEY",
        number: 24,
        url: "https://github.com/philips-internal/libscep/issues/24",
      },
    },
  ];
  const testAssigness = [
    [],
    [
      {
        name: "Ares.Zhao",
        login: "AresZhaoLei",
      },
      {
        name: "Linus Deng",
        login: "amelonpie",
      },
    ],
    [
      {
        name: "wuzhuobin",
        login: "wuzhuobin",
      },
      {
        name: null,
        login: "ruixiaoli",
      },
    ],
    [
      {
        name: "He Quan Liang",
        login: "Stevenson-1320",
      },
      {
        name: null,
        login: "NickNingCH",
      },
    ],
    [
      {
        name: "wuzhuobin",
        login: "wuzhuobin",
      },
    ],
  ];
  const project = new Project(null, null, true);
  project.setOrignization(organization);
  project.setProjectNumber(number);

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

  test("makeSprintGroup", () => {
    const group = project.makeSprintGroup(testFields);
    expect(group).toHaveProperty(
      "completedIterations",
      "0b16fa06",
      "title",
      "Sprint 2"
    );
    expect(group).toHaveProperty(
      "completedIterations",
      "0b16fa06",
      "items",
      []
    );
  });

  test("groupProjectItemsByStatus", () => {
    const group = project.makeStatusGroup(testFields);
    const items = [{ id: testItemId, fieldValues: testItemFieldValues }];
    project.groupProjectItemsByStatus(items, group);
    expect(group).toHaveProperty("85617f5a", "items", [testItemId]);
  });

  test("groupProjectItemsBySprint", () => {
    const group = project.makeSprintGroup(testFields);
    const items = [{ id: testItemId, fieldValues: testItemFieldValues }];
    project.groupProjectItemsBySprint(items, group);
    expect(group).toHaveProperty("completedIterations", "0b16fa06", "items", [
      testItemId,
    ]);
  });

  test("makeItemsWithAssignees", () => {
    const itemsWIthAssignees = Project.makeItemsWithAssignees(
      testItems,
      testAssigness
    );
    expect(itemsWIthAssignees).toEqual([
      {
        id: "PNI_lADOA20Mnc0z2c4AByoE",
        title: "Providing apis for generating CSR",
        content: {
          __typename: "Issue",
          id: "I_kwDOGPV02s4-eq_M",
          number: 12,
          url: "https://github.com/philips-internal/libscep/issues/12",
          assignees: [],
        },
      },
      {
        id: "PNI_lADOA20Mnc0z2c4ABD7t",
        title: "What is CMS(older version is PKCS #7)?",
        content: {
          __typename: "Issue",
          id: "I_kwDOGPV02s49lDf-",
          number: 2,
          url: "https://github.com/philips-internal/libscep/issues/2",
          assignees: [
            { name: "Ares.Zhao", login: "AresZhaoLei" },
            { name: "Linus Deng", login: "amelonpie" },
          ],
        },
      },
      {
        id: "PNI_lADOA20Mnc0z2c4AB5ll",
        title: "Implement renew functions in scep",
        content: {
          __typename: "Issue",
          id: "I_kwDOGPV02s4-nM2-",
          number: 21,
          url: "https://github.com/philips-internal/libscep/issues/21",
          assignees: [
            { name: "wuzhuobin", login: "wuzhuobin" },
            { name: null, login: "ruixiaoli" },
          ],
        },
      },
      {
        id: "PNI_lADOA20Mnc0z2c4AB4FM",
        title: "Figure out a way to build the SecMgr easily",
        content: {
          __typename: "Issue",
          id: "I_kwDOGPV02s4-lfyG",
          number: 20,
          url: "https://github.com/philips-internal/libscep/issues/20",
          assignees: [
            { name: "He Quan Liang", login: "Stevenson-1320" },
            { name: null, login: "NickNingCH" },
          ],
        },
      },
      {
        id: "PNI_lADOA20Mnc0z2c4AB5o5",
        title:
          "component tests for demonstrating the GetCA->Enrolment->Renewal is working",
        content: {
          __typename: "Issue",
          id: "I_kwDOGPV02s4-nSEY",
          number: 24,
          url: "https://github.com/philips-internal/libscep/issues/24",
          assignees: [{ name: "wuzhuobin", login: "wuzhuobin" }],
        },
      },
    ]);
  });

  test("makeItemsWithNumbersOfTrackingSubtasks", () => {
    const itemsWithNumbersOfTrackingSubtasks =
      Project.makeItemsWithNumbersOfTrackingSubtasks(testItems, [
        [2, 21], // 12
        [20], // 2
        [], // 21
        [], //20
        [], // 24
      ]);
    expect(itemsWithNumbersOfTrackingSubtasks[0]).toHaveProperty(
      "content",
      "numbersOfTrackingSubtasks",
      [2, 21]
    );
    expect(itemsWithNumbersOfTrackingSubtasks[1]).toHaveProperty(
      "content",
      "numbersOfTrackingSubtasks",
      [20]
    );
    expect(itemsWithNumbersOfTrackingSubtasks[2]).toHaveProperty(
      "content",
      "numbersOfTrackingSubtasks",
      []
    );
    expect(itemsWithNumbersOfTrackingSubtasks[3]).toHaveProperty(
      "content",
      "numbersOfTrackingSubtasks",
      []
    );
    expect(itemsWithNumbersOfTrackingSubtasks[4]).toHaveProperty(
      "content",
      "numbersOfTrackingSubtasks",
      []
    );
  });

  test("groupProjectItemsByAssignee", () => {
    const itemsWIthAssignees = Project.makeItemsWithAssignees(
      testItems,
      testAssigness
    );
    const group = project.groupProjectItemsByAssignee(itemsWIthAssignees);
    expect(group).toEqual({
      AresZhaoLei: {
        name: "Ares.Zhao",
        login: "AresZhaoLei",
        items: [
          {
            id: "PNI_lADOA20Mnc0z2c4ABD7t",
            title: "What is CMS(older version is PKCS #7)?",
            content: {
              __typename: "Issue",
              id: "I_kwDOGPV02s49lDf-",
              number: 2,
              url: "https://github.com/philips-internal/libscep/issues/2",
              assignees: [
                {
                  name: "Ares.Zhao",
                  login: "AresZhaoLei",
                },
                {
                  name: "Linus Deng",
                  login: "amelonpie",
                },
              ],
            },
          },
        ],
      },
      amelonpie: {
        name: "Linus Deng",
        login: "amelonpie",
        items: [
          {
            id: "PNI_lADOA20Mnc0z2c4ABD7t",
            title: "What is CMS(older version is PKCS #7)?",
            content: {
              __typename: "Issue",
              id: "I_kwDOGPV02s49lDf-",
              number: 2,
              url: "https://github.com/philips-internal/libscep/issues/2",
              assignees: [
                {
                  name: "Ares.Zhao",
                  login: "AresZhaoLei",
                },
                {
                  name: "Linus Deng",
                  login: "amelonpie",
                },
              ],
            },
          },
        ],
      },
      wuzhuobin: {
        name: "wuzhuobin",
        login: "wuzhuobin",
        items: [
          {
            id: "PNI_lADOA20Mnc0z2c4AB5ll",
            title: "Implement renew functions in scep",
            content: {
              __typename: "Issue",
              id: "I_kwDOGPV02s4-nM2-",
              number: 21,
              url: "https://github.com/philips-internal/libscep/issues/21",
              assignees: [
                {
                  name: "wuzhuobin",
                  login: "wuzhuobin",
                },
                {
                  name: null,
                  login: "ruixiaoli",
                },
              ],
            },
          },
          {
            id: "PNI_lADOA20Mnc0z2c4AB5o5",
            title:
              "component tests for demonstrating the GetCA->Enrolment->Renewal is working",
            content: {
              __typename: "Issue",
              id: "I_kwDOGPV02s4-nSEY",
              number: 24,
              url: "https://github.com/philips-internal/libscep/issues/24",
              assignees: [
                {
                  name: "wuzhuobin",
                  login: "wuzhuobin",
                },
              ],
            },
          },
        ],
      },
      ruixiaoli: {
        name: null,
        login: "ruixiaoli",
        items: [
          {
            id: "PNI_lADOA20Mnc0z2c4AB5ll",
            title: "Implement renew functions in scep",
            content: {
              __typename: "Issue",
              id: "I_kwDOGPV02s4-nM2-",
              number: 21,
              url: "https://github.com/philips-internal/libscep/issues/21",
              assignees: [
                {
                  name: "wuzhuobin",
                  login: "wuzhuobin",
                },
                {
                  name: null,
                  login: "ruixiaoli",
                },
              ],
            },
          },
        ],
      },
      "Stevenson-1320": {
        name: "He Quan Liang",
        login: "Stevenson-1320",
        items: [
          {
            id: "PNI_lADOA20Mnc0z2c4AB4FM",
            title: "Figure out a way to build the SecMgr easily",
            content: {
              __typename: "Issue",
              id: "I_kwDOGPV02s4-lfyG",
              number: 20,
              url: "https://github.com/philips-internal/libscep/issues/20",
              assignees: [
                {
                  name: "He Quan Liang",
                  login: "Stevenson-1320",
                },
                {
                  name: null,
                  login: "NickNingCH",
                },
              ],
            },
          },
        ],
      },
      NickNingCH: {
        name: null,
        login: "NickNingCH",
        items: [
          {
            id: "PNI_lADOA20Mnc0z2c4AB4FM",
            title: "Figure out a way to build the SecMgr easily",
            content: {
              __typename: "Issue",
              id: "I_kwDOGPV02s4-lfyG",
              number: 20,
              url: "https://github.com/philips-internal/libscep/issues/20",
              assignees: [
                {
                  name: "He Quan Liang",
                  login: "Stevenson-1320",
                },
                {
                  name: null,
                  login: "NickNingCH",
                },
              ],
            },
          },
        ],
      },
    });
  });

  test("groupProjectItemsByTrackingSubtasks", () => {
    const itemsWithNumbersOfTrackingSubtasks =
      Project.makeItemsWithNumbersOfTrackingSubtasks(testItems, [
        [2, 21], // 12
        [20], // 2
        [], // 21
        [], //20
        [], // 24
      ]);

    const itemsWithNumbersOfTrackingSubtasksCopied = JSON.parse(
      JSON.stringify(itemsWithNumbersOfTrackingSubtasks)
    );

    itemsWithNumbersOfTrackingSubtasksCopied[0].content.trackingSubtasks = [
      itemsWithNumbersOfTrackingSubtasksCopied[1],
      itemsWithNumbersOfTrackingSubtasksCopied[2],
    ];
    itemsWithNumbersOfTrackingSubtasksCopied[1].content.trackingSubtasks = [
      itemsWithNumbersOfTrackingSubtasksCopied[3],
    ];
    itemsWithNumbersOfTrackingSubtasksCopied[2].content.trackingSubtasks = [];
    itemsWithNumbersOfTrackingSubtasksCopied[3].content.trackingSubtasks = [];
    itemsWithNumbersOfTrackingSubtasksCopied[4].content.trackingSubtasks = [];
    const expectedGroup = [
      itemsWithNumbersOfTrackingSubtasksCopied[0],
      itemsWithNumbersOfTrackingSubtasksCopied[4],
    ];

    const group = project.groupProjectItemsByTrackingSubtasks(
      itemsWithNumbersOfTrackingSubtasks
    );

    expect(group).toEqual(expectedGroup);
  });

  test("extractNumbersOfTrackingSubtasksFromBody() should return expected array", () => {
    const body = "Test issue 6\r\n- [x] #1 \r\n- [ ] #5 [X] #191";
    const numbers = project.extractNumbersOfTrackingSubtasksFromBody(body);
    expect(numbers).toEqual([1, 5, 191]);
  });

  test("extractNumbersOfTrackingSubtasksFromBody should return emptry array when there is no sub tasks", () => {
    const body = "Test issue 6\r\n- [x ] #1 \r\n- [ ] #a5 [s] #191";
    const numbers = project.extractNumbersOfTrackingSubtasksFromBody(body);
    expect(numbers).toHaveLength(0);
  });
});
