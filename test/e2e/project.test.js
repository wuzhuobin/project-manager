const Project = require("../../lib/project");

describe("e2e", () => {
  jest.setTimeout(10000);
  describe("Project", () => {
    describe("legacy", () => {
      const organization = "philips-internal";
      const number = 93;
      const projectId = "PN_kwDOA20Mnc0z2Q";
      const project = new Project(null, TOKEN);
      project.setOrignization(organization);
      project.setProjectNumber(number);

      test("getProjectId", async () => {
        const id = await project.getProjectId();
        expect(id).toBe(projectId);
      });

      test("getProjectFieldCount", async () => {
        const count = await project.getProjectFieldCount();
        expect(count).toBe(12);
      });

      test("getProjectItemCount", async () => {
        const count = await project.getProjectItemCount();
        expect(count).toBe(104);
      });

      test("getProjectItems", async () => {
        const project = new Project(projectId, TOKEN);
        project.setOrignization(organization);
        project.setProjectNumber(number);

        const items = await project.getProjectItems();
        expect(items.length).toBe(104);
        expect(items).toContainEqual({
          id: "PNI_lADOA20Mnc0z2c4AA9kB",
          title: "What is ECDSA for ECC keys?",
          content: {
            __typename: "Issue",
            id: "I_kwDOGPV02s49YTyQ",
            number: 1,
            url: "https://github.com/philips-internal/libscep/issues/1",
          },
        });
      });

      test("get100ProjectItemFieldValuesOfItemsByIds", async () => {
        const fields = await project.get100ProjectItemFieldValuesOfItemsByIds([
          "PNI_lADOA20Mnc0z2c4AFtBg",
        ]);
        expect(fields).toHaveLength(1);
        expect(fields[0]).toEqual(
          expect.arrayContaining([
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
          ])
        );
      });

      test("groupProjectItemsByStatus", async () => {
        const project = new Project(projectId, TOKEN);
        project.setOrignization(organization);
        project.setProjectNumber(number);

        const fields = await project.getProjectFields();
        const group = project.makeStatusGroup(fields);

        const items = await (
          await project.getProjectItems()
        ).filter((id, index) => index < 100);
        const ids = items.map((item) => item.id);
        const fieldValuesArray =
          await project.get100ProjectItemFieldValuesOfItemsByIds(ids);
        const itemsFieldValues = items.map((item, index) => {
          return {
            ...item,
            fieldValues: fieldValuesArray[index],
          };
        });
        project.groupProjectItemsByStatus(itemsFieldValues, group);
        for (let key in group) {
          expect(group[key].items.length).toBeDefined();
          console.log(
            "key: %s, name: %s, length: %d",
            key,
            group[key].name,
            group[key].items.length
          );
        }
      });

      test("groupProjectItemsBySprint", async () => {
        const project = new Project(projectId, TOKEN);
        project.setOrignization(organization);
        project.setProjectNumber(number);

        const fields = await project.getProjectFields();
        const group = project.makeSprintGroup(fields);

        const items = await project.getProjectItems();
        const ids = items
          .map((item) => item.id)
          .filter((id, index) => index < 100);
        const fieldValuesArray =
          await project.get100ProjectItemFieldValuesOfItemsByIds(ids);
        const itemsFieldValues = ids.map((id, index) => {
          return {
            id,
            fieldValues: fieldValuesArray[index],
          };
        });

        project.groupProjectItemsBySprint(itemsFieldValues, group);
        console.log("iterations");
        for (let key in group.iterations) {
          expect(group.iterations[key].items.length).toBeDefined();
          console.log(
            "key: %s, title: %s, length: %d",
            key,
            group.iterations[key].title,
            group.iterations[key].items.length
          );
        }

        console.log("completed iterations");
        for (let key in group.completedIterations) {
          expect(group.completedIterations[key].items.length).toBeDefined();
          console.log(
            "key: %s, title: %s, length: %d",
            key,
            group.completedIterations[key].title,
            group.completedIterations[key].items.length
          );
        }
      });
    });

    const user = "wuzhuobin";
    const number = 1;
    const projectId = "PN_kwHOAQRINs4AAnY_";
    const project = new Project(null, TOKEN);
    project.setUser(user);
    project.setProjectNumber(number);
    project.setProjectId(projectId);
    test("getProjectId", async () => {
      const id = await project.getProjectId();
      expect(id).toBe(projectId);
    });

    test("_execute", async () => {
      expect.assertions(1);
      try {
        await project._execute();
      } catch (e) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(e.message).not.toBeNull();
      }
    });

    test("getProjectFieldCount", async () => {
      const count = await project.getProjectFieldCount();
      expect(count).toBe(10);
    });

    test("getProjectFields", async () => {
      const fields = await project.getProjectFields();
      expect(fields.length).toBe(10);
      expect(fields).toEqual([
        {
          id: "MDE2OlByb2plY3ROZXh0RmllbGQxMzU4MDU5",
          name: "Title",
          settings: JSON.parse("null"),
        },
        {
          id: "MDE2OlByb2plY3ROZXh0RmllbGQxMzU4MDYw",
          name: "Assignees",
          settings: JSON.parse("null"),
        },
        {
          id: "MDE2OlByb2plY3ROZXh0RmllbGQxMzU4MDYx",
          name: "Status",
          settings: JSON.parse(
            '{"options":[{"id":"5d1a4113","name":"Others","name_html":"Others"},{"id":"f75ad846","name":"Todo","name_html":"Todo"},{"id":"47fc9ee4","name":"In Progress","name_html":"In Progress"},{"id":"98236657","name":"Done","name_html":"Done"}]}'
          ),
        },
        {
          id: "MDE2OlByb2plY3ROZXh0RmllbGQxMzU4MDYy",
          name: "Labels",
          settings: JSON.parse("null"),
        },
        {
          id: "MDE2OlByb2plY3ROZXh0RmllbGQxMzU4MDYz",
          name: "Linked Pull Requests",
          settings: JSON.parse("null"),
        },
        {
          id: "MDE2OlByb2plY3ROZXh0RmllbGQxMzU4MDY0",
          name: "Reviewers",
          settings: JSON.parse("null"),
        },
        {
          id: "MDE2OlByb2plY3ROZXh0RmllbGQxMzU4MDY1",
          name: "Repository",
          settings: JSON.parse("null"),
        },
        {
          id: "MDE2OlByb2plY3ROZXh0RmllbGQxMzU4MDY2",
          name: "Milestone",
          settings: JSON.parse("null"),
        },
        {
          id: "MDE2OlByb2plY3ROZXh0RmllbGQxNTMxNjY2",
          name: "Sprint",
          settings: JSON.parse(
            '{"configuration":{"duration":14,"start_day":3,"iterations":[],"completed_iterations":[{"id":"e32c7736","title":"Sprint 3","duration":14,"start_date":"2021-12-29","title_html":"Sprint 3"},{"id":"c96bbd0b","title":"Sprint 2","duration":14,"start_date":"2021-12-15","title_html":"Sprint 2"},{"id":"8cef9a6d","title":"Sprint 1","duration":14,"start_date":"2021-12-01","title_html":"Sprint 1"}]}}'
          ),
        },
        {
          id: "MDE2OlByb2plY3ROZXh0RmllbGQxNTMxNjY3",
          name: "Story Point",
          settings: JSON.parse("null"),
        },
      ]);
    });

    test("getProjectItems", async () => {
      const items = await project.getProjectItems();
      expect(items.length).toBe(5);
      expect(items).toEqual([
        {
          id: "PNI_lADOAQRINs4AAnY_zgAeyXs",
          title: "Test issue 1",
          content: {
            __typename: "Issue",
            id: "I_kwDOGubbrc5DDGUb",
            number: 1,
            url: "https://github.com/wuzhuobin/project-manager/issues/1",
          },
        },
        {
          id: "PNI_lADOAQRINs4AAnY_zgAeyX8",
          title: "Test issue 2",
          content: {
            __typename: "Issue",
            id: "I_kwDOGubbrc5DDGWs",
            number: 2,
            url: "https://github.com/wuzhuobin/project-manager/issues/2",
          },
        },
        {
          id: "PNI_lADOAQRINs4AAnY_zgAeyY4",
          title: "Test issue 3",
          content: {
            __typename: "Issue",
            id: "I_kwDOGubbrc5DDGci",
            number: 3,
            url: "https://github.com/wuzhuobin/project-manager/issues/3",
          },
        },
        {
          id: "PNI_lADOAQRINs4AAnY_zgAeyZk",
          title: "Test issue 4",
          content: {
            __typename: "Issue",
            id: "I_kwDOGubbrc5DDGen",
            number: 4,
            url: "https://github.com/wuzhuobin/project-manager/issues/4",
          },
        },
        {
          id: "PNI_lADOAQRINs4AAnY_zgAey4A",
          title: "Test issue 4",
          content: {
            __typename: "Issue",
            id: "I_kwDOGubbrc5DDJSR",
            number: 5,
            url: "https://github.com/wuzhuobin/project-manager/issues/5",
          },
        },
      ]);
    });

    test("sumOfStoryPointsByItemsFieldValues", async () => {
      const items = await (
        await project.getProjectItems()
      ).filter((id, index) => index < 100);
      const ids = items.map((item) => item.id);
      const fieldValuesArray =
        await project.get100ProjectItemFieldValuesOfItemsByIds(ids);
      const itemsFieldValues = items.map((item, index) => {
        return {
          ...item,
          fieldValues: fieldValuesArray[index],
        };
      });
      const sumOfStoryPoints =
        project.sumOfStoryPointByItemsFieldValues(itemsFieldValues);
      expect(sumOfStoryPoints).toBe(49);
    });
  });
});
