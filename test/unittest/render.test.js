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
      },
      "9c41f080": {
        name: ":scroll:Backlog:scroll:",
        items: [],
      },
      f75ad846: {
        name: "🚩Todo🚩",
        items: [],
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
