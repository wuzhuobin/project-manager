const Project = require("../../lib/project");

describe("e2e", () => {
  jest.setTimeout(10000);
  describe.each([{ useAxios: true }, { useAxios: false }])(
    "Project",
    ({ useAxios }) => {
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

        test("getProjectItems", async () => {
          const project = new Project(projectId, TOKEN);
          project.setOrignization(organization);
          project.setProjectNumber(number);

          const items = await project.getProjectItems();
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

        test("getProjectItemFirst100FieldValuesOfItemsByIds", async () => {
          const fields =
            await project.getProjectItemFirst100FieldValuesOfItemsByIds([
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
            await project.getProjectItemFirst100FieldValuesOfItemsByIds(ids);
          const itemsFieldValues = items.map((item, index) => {
            return {
              ...item,
              fieldValues: fieldValuesArray[index],
            };
          });
          project.groupProjectItemsByStatus(itemsFieldValues, group);
          for (let key in group) {
            expect(group[key].items.length).toBeDefined();
            // console.log(
            //   "key: %s, name: %s, length: %d",
            //   key,
            //   group[key].name,
            //   group[key].items.length
            // );
          }
        });

        test("groupProjectItemsBySprint", async () => {
          const project = new Project(projectId, TOKEN);
          project.setOrignization(organization);
          project.setProjectNumber(number);

          const fields = await project.getProjectFields();
          const group = project.makeSprintGroup(fields);

          const items = await (
            await project.getProjectItems()
          ).filter((item, index) => index < 100);
          const ids = items.map((item) => item.id);
          const fieldValuesArray =
            await project.getProjectItemFirst100FieldValuesOfItemsByIds(ids);
          const itemsFieldValues = items.map((item, index) => {
            return {
              ...item,
              fieldValues: fieldValuesArray[index],
            };
          });

          project.groupProjectItemsBySprint(itemsFieldValues, group);
          // console.log("iterations");
          for (let key in group.iterations) {
            expect(group.iterations[key].items.length).toBeDefined();
            // console.log(
            //   "key: %s, title: %s, length: %d",
            //   key,
            //   group.iterations[key].title,
            //   group.iterations[key].items.length
            // );
          }

          // console.log("completed iterations");
          for (let key in group.completedIterations) {
            expect(group.completedIterations[key].items.length).toBeDefined();
            // console.log(
            //   "key: %s, title: %s, length: %d",
            //   key,
            //   group.completedIterations[key].title,
            //   group.completedIterations[key].items.length
            // );
          }
        });
      });
      describe(`useAxios=${useAxios}`, () => {
        const user = "wuzhuobin";
        const number = 1;
        const projectId = "PN_kwHOAQRINs4AAnY_";
        const project = new Project(null, TOKEN, useAxios);
        project.setUser(user);
        project.setProjectNumber(number);
        project.setProjectId(projectId);
        test("getProjectId", async () => {
          const id = await project.getProjectId();
          expect(id).toBe(projectId);
        });

        test("getProjectItemCount", async () => {
          const count = await project.getProjectItemCount();
          expect(count).toBe(9);
        });

        test.skip("_execute", async () => {
          await expect(project._execute()).rejects.toThrowError();
        });

        test("getProjectFieldCount", async () => {
          const count = await project.getProjectFieldCount();
          expect(count).toBe(10);
        });

        test("getProjectFields", async () => {
          const fields = await project.getProjectFields();
          expect(fields).toEqual([
            {
              id: "MDE2OlByb2plY3ROZXh0RmllbGQxMzU4MDU5",
              name: "Title",
              settings: JSON.parse('{"width":336}'),
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
              settings: JSON.parse('{"width":116}'),
            },
          ]);
        });

        test("getProjectItems", async () => {
          const items = await project.getProjectItems();
          expect(items).toHaveLength(9);
          expect(items).toEqual(
            expect.arrayContaining([
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
                title: "Test issue 5",
                content: {
                  __typename: "Issue",
                  id: "I_kwDOGubbrc5DDJSR",
                  number: 5,
                  url: "https://github.com/wuzhuobin/project-manager/issues/5",
                },
              },
            ])
          );
        });

        test("getProjectItemFirst100FieldValuesOfItemsByIds", async () => {
          const fields =
            await project.getProjectItemFirst100FieldValuesOfItemsByIds([
              "PNI_lADOAQRINs4AAnY_zgAeyXs",
              "PNI_lADOAQRINs4AAnY_zgAeyX8",
            ]);
          expect(fields).toHaveLength(2);
          expect(fields).toEqual([
            [
              {
                value: "Test issue 1",
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
                value: "20",
                projectField: {
                  id: "MDE2OlByb2plY3ROZXh0RmllbGQxNTMxNjY3",
                  name: "Story Point",
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
            [
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
          ]);
        });

        test("getAssignableFirst100Assignees", async () => {
          const assignableIds = ["I_kwDOGubbrc5DDGUb", "I_kwDOGubbrc5DDGWs"];
          const assigness = await project.getAssignableFirst100Assignees(
            assignableIds
          );
          expect(assigness).toEqual([
            [
              {
                name: "wuzhuobin",
                login: "wuzhuobin",
              },
            ],
            [],
          ]);
        });

        test("sumOfStoryPointByItemsFieldValues", async () => {
          const items = await (
            await project.getProjectItems()
          ).filter((id, index) => index < 100);
          const ids = items.map((item) => item.id);
          const fieldValuesArray =
            await project.getProjectItemFirst100FieldValuesOfItemsByIds(ids);
          const itemsFieldValues = items.map((item, index) => {
            return {
              ...item,
              fieldValues: fieldValuesArray[index],
            };
          });
          const sumOfStoryPoint =
            project.sumOfStoryPointByItemsFieldValues(itemsFieldValues);
          expect(sumOfStoryPoint).toBe(47);
        });

        test("groupProjectItemsByStatus", async () => {
          const fields = await project.getProjectFields();
          const group = project.makeStatusGroup(fields);

          const items = await (
            await project.getProjectItems()
          ).filter((id, index) => index < 100);
          const ids = items.map((item) => item.id);
          const fieldValuesArray =
            await project.getProjectItemFirst100FieldValuesOfItemsByIds(ids);
          const itemsFieldValues = items.map((item, index) => {
            return {
              ...item,
              fieldValues: fieldValuesArray[index],
            };
          });
          project.groupProjectItemsByStatus(itemsFieldValues, group);
          expect(group["5d1a4113"].name).toBe("Others");
          expect(group["5d1a4113"].items).toHaveLength(1);
          expect(group["f75ad846"].name).toBe("Todo");
          expect(group["f75ad846"].items).toHaveLength(3);
          expect(group["47fc9ee4"].name).toBe("In Progress");
          expect(group["47fc9ee4"].items).toHaveLength(2);
          expect(group["98236657"].name).toBe("Done");
          expect(group["98236657"].items).toHaveLength(3);
        });

        test("groupProjectItemsBySprint", async () => {
          const fields = await project.getProjectFields();
          const group = project.makeSprintGroup(fields);

          const items = await (
            await project.getProjectItems()
          ).filter((item, index) => index < 100);
          const ids = items.map((item) => item.id);
          const fieldValuesArray =
            await project.getProjectItemFirst100FieldValuesOfItemsByIds(ids);
          const itemsFieldValues = items.map((item, index) => {
            return {
              ...item,
              fieldValues: fieldValuesArray[index],
            };
          });

          project.groupProjectItemsBySprint(itemsFieldValues, group);
          expect(group.iterations).toEqual({});
          expect(group.completedIterations["e32c7736"].title).toBe("Sprint 3");
          expect(group.completedIterations["e32c7736"].items).toHaveLength(5);
          expect(group.completedIterations["c96bbd0b"].title).toBe("Sprint 2");
          expect(group.completedIterations["c96bbd0b"].items).toHaveLength(2);
          expect(group.completedIterations["8cef9a6d"].title).toBe("Sprint 1");
          expect(group.completedIterations["8cef9a6d"].items).toHaveLength(2);
        });
      });
    }
  );
});
