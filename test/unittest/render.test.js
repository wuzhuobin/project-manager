const Render = require("../../lib/render");

describe("Render", () => {
  test("projectItemsByStatus", () => {
    const testStatusGroup = {
      98236657: {
        name: "🏁Done🏁",
        items: [
          {
            id: "PNI_lADOA20Mnc0z2c4AA9kB",
            title: "What is ECDSA for ECC keys?",
            content: {
              __typename: "Issue",
              id: "I_kwDOGPV02s49YTyQ",
              number: 1,
              url: "https://github.com/philips-internal/libscep/issues/1",
            },
            fieldValues: [
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
            ],
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
            fieldValues: [
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
            ],
          },
          {
            id: "PNI_lADOA20Mnc0z2c4ABMVU",
            title: "What is PKCS #10 ?",
            content: {
              __typename: "Issue",
              id: "I_kwDOGPV02s49zaRo",
              number: 3,
              url: "https://github.com/philips-internal/libscep/issues/3",
            },
            fieldValues: [
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
            ],
          },
        ],
        sumOfStoryPoint: 20,
      },
      "85617f5a": {
        name: ":hammer:Others:hammer:",
        items: [
          {
            id: "PNI_lADOA20Mnc0z2c4ABMVZ",
            title: "How is the workflow of SCEP client and server?",
            content: {
              __typename: "Issue",
              id: "I_kwDOGPV02s49zaR6",
              number: 4,
              url: "https://github.com/philips-internal/libscep/issues/4",
            },
            fieldValues: [],
          },
          {
            id: "PNI_lADOA20Mnc0z2c4ABMVc",
            title: "How is the the http transaction of SCEP?",
            content: {
              __typename: "Issue",
              id: "I_kwDOGPV02s49zaSS",
              number: 5,
              url: "https://github.com/philips-internal/libscep/issues/5",
            },
            fieldValues: [],
          },
          {
            id: "PNI_lADOA20Mnc0z2c4ABMy9",
            title:
              "How to deploy the openxpki server or IX-certificate in docker environment",
            content: {
              __typename: "Issue",
              id: "I_kwDOGPV02s493sgl",
              number: 6,
              url: "https://github.com/philips-internal/libscep/issues/6",
            },
            fieldValues: [],
          },
        ],
        sumOfStoryPoint: 10,
      },
      "9c41f080": {
        name: ":scroll:Backlog:scroll:",
        items: [],
      },
      f75ad846: {
        name: "🚩Todo🚩",
        items: [],
        sumOfStoryPoint: 0,
      },
      "47fc9ee4": {
        name: "🐝In Progress🐝",
        items: [],
        sumOfStoryPoint: 0,
      },
    };

    const rendering = Render.projectItemsByStatus(testStatusGroup);
    expect(rendering).toBeDefined();
  });

  test("projectItemsBySprint", () => {
    const testSprintGroup = {
      iterations: {},
      completedIterations: {
        e32c7736: {
          id: "e32c7736",
          title: "Sprint 3",
          duration: 14,
          start_date: "2021-12-29",
          title_html: "Sprint 3",
          items: [
            {
              id: "PNI_lADOAQRINs4AAnY_zgAeyZk",
              title: "Test issue 4",
              content: {
                __typename: "Issue",
                id: "I_kwDOGubbrc5DDGen",
                number: 4,
                url: "https://github.com/wuzhuobin/project-manager/issues/4",
              },
              fieldValues: [
                {
                  value: "Test issue 4",
                  projectField: {
                    id: "MDE2OlByb2plY3ROZXh0RmllbGQxMzU4MDU5",
                    name: "Title",
                  },
                },
                {
                  value: "98236657",
                  projectField: {
                    id: "MDE2OlByb2plY3ROZXh0RmllbGQxMzU4MDYx",
                    name: "Status",
                  },
                },
                {
                  value: "e32c7736",
                  projectField: {
                    id: "MDE2OlByb2plY3ROZXh0RmllbGQxNTMxNjY2",
                    name: "Sprint",
                  },
                },
                {
                  value: "5",
                  projectField: {
                    id: "MDE2OlByb2plY3ROZXh0RmllbGQxNTMxNjY3",
                    name: "Story Point",
                  },
                },
              ],
            },
            {
              id: "PNI_lADOAQRINs4AAnY_zgAey4A",
              title: "Test issue 5",
              content: {
                __typename: "Issue",
                id: "I_kwDOGubbrc5DDJSR",
                number: 5,
                url: "https://github.com/wuzhuobin/project-manager/issues/5",
              },
              fieldValues: [
                {
                  value: "Test issue 5",
                  projectField: {
                    id: "MDE2OlByb2plY3ROZXh0RmllbGQxMzU4MDU5",
                    name: "Title",
                  },
                },
                {
                  value: "5d1a4113",
                  projectField: {
                    id: "MDE2OlByb2plY3ROZXh0RmllbGQxMzU4MDYx",
                    name: "Status",
                  },
                },
                {
                  value: "e32c7736",
                  projectField: {
                    id: "MDE2OlByb2plY3ROZXh0RmllbGQxNTMxNjY2",
                    name: "Sprint",
                  },
                },
              ],
            },
          ],
          sumOfStoryPoint: 5,
        },
        c96bbd0b: {
          id: "c96bbd0b",
          title: "Sprint 2",
          duration: 14,
          start_date: "2021-12-15",
          title_html: "Sprint 2",
          items: [
            {
              id: "PNI_lADOAQRINs4AAnY_zgAeyY4",
              title: "Test issue 3",
              content: {
                __typename: "Issue",
                id: "I_kwDOGubbrc5DDGci",
                number: 3,
                url: "https://github.com/wuzhuobin/project-manager/issues/3",
              },
              fieldValues: [
                {
                  value: "Test issue 3",
                  projectField: {
                    id: "MDE2OlByb2plY3ROZXh0RmllbGQxMzU4MDU5",
                    name: "Title",
                  },
                },
                {
                  value: "47fc9ee4",
                  projectField: {
                    id: "MDE2OlByb2plY3ROZXh0RmllbGQxMzU4MDYx",
                    name: "Status",
                  },
                },
                {
                  value: "c96bbd0b",
                  projectField: {
                    id: "MDE2OlByb2plY3ROZXh0RmllbGQxNTMxNjY2",
                    name: "Sprint",
                  },
                },
                {
                  value: "3",
                  projectField: {
                    id: "MDE2OlByb2plY3ROZXh0RmllbGQxNTMxNjY3",
                    name: "Story Point",
                  },
                },
              ],
            },
          ],
          sumOfStoryPoint: 3,
        },
        "8cef9a6d": {
          id: "8cef9a6d",
          title: "Sprint 1",
          duration: 14,
          start_date: "2021-12-01",
          title_html: "Sprint 1",
          items: [
            {
              id: "PNI_lADOAQRINs4AAnY_zgAeyX8",
              title: "Test issue 2",
              content: {
                __typename: "Issue",
                id: "I_kwDOGubbrc5DDGWs",
                number: 2,
                url: "https://github.com/wuzhuobin/project-manager/issues/2",
              },
              fieldValues: [
                {
                  value: "Test issue 2",
                  projectField: {
                    id: "MDE2OlByb2plY3ROZXh0RmllbGQxMzU4MDU5",
                    name: "Title",
                  },
                },
                {
                  value: "f75ad846",
                  projectField: {
                    id: "MDE2OlByb2plY3ROZXh0RmllbGQxMzU4MDYx",
                    name: "Status",
                  },
                },
                {
                  value: "8cef9a6d",
                  projectField: {
                    id: "MDE2OlByb2plY3ROZXh0RmllbGQxNTMxNjY2",
                    name: "Sprint",
                  },
                },
                {
                  value: "8",
                  projectField: {
                    id: "MDE2OlByb2plY3ROZXh0RmllbGQxNTMxNjY3",
                    name: "Story Point",
                  },
                },
              ],
            },
          ],
          sumOfStoryPoint: 8,
        },
      },
    };

    const rendering = Render.projectItemsBySprint(testSprintGroup);
    expect(rendering).toBeDefined();
  });

  test("projectItemsByAssignee", () => {
    const group = {
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
        sumOfStoryPoint: 4,
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
        sumOfStoryPoint: 10,
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
        sumOfStoryPoint: 14,
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
        sumOfStoryPoint: 1,
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
        sumOfStoryPoint: 1,
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
        sumOfStoryPoint: 1,
      },
    };

    const rendering = Render.projectItemsByAssignee(group);
    console.log(rendering);
    expect(rendering).toBeDefined();
  });
});
