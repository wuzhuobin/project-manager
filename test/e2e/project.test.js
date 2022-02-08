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
        const itemsFieldValues =
          await project.get100ProjectItemFieldValuesOfItemsByIds(ids);
        const itemsFieldValuesWithId = items.map((item, index) => {
          return {
            ...item,
            fieldValues: itemsFieldValues[index],
          };
        });
        project.groupProjectItemsByStatus(itemsFieldValuesWithId, group);
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
        const itemsFieldValues =
          await project.get100ProjectItemFieldValuesOfItemsByIds(ids);
        const itemsFieldValuesWithId = ids.map((id, index) => {
          return {
            id,
            fieldValues: itemsFieldValues[index],
          };
        });

        project.groupProjectItemsBySprint(itemsFieldValuesWithId, group);
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
    });
  });
});
