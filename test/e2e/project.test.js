const Project = require("../../lib/project");

describe("e2e", () => {
  jest.setTimeout(10000);
  describe("Project", () => {
    const organization = "philips-internal";
    const number = 93;
    const project = new Project(organization, number, TOKEN);

    test("_execute", async () => {
      expect.assertions(1);
      try {
        await project._execute();
      } catch (e) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(e.message).not.toBeNull();
      }
    });

    test("getProjectId", async () => {
      const id = await project.getProjectId();
      expect(id).toBe("PN_kwDOA20Mnc0z2Q");
    });

    test("getProjectFieldCount", async () => {
      const count = await project.getProjectFieldCount();
      expect(count).toBe(12);
    });

    test("getProjectFields", async () => {
      const fields = await project.getProjectFields();
      expect(fields.length).toBe(12);
    });

    test("getProjectItemCount", async () => {
      const count = await project.getProjectItemCount();
      expect(count).toBe(104);
    });

    test("getProjectItems", async () => {
      const items = await project.getProjectItems();
      expect(items.length).toBe(104);
      expect(items).toContainEqual({
        id: "PNI_lADOA20Mnc0z2c4AA9kB",
        title: "What is ECDSA for ECC keys?",
        content: {
          __typename: "Issue",
          id: "I_kwDOGPV02s49YTyQ",
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
      const fields = await project.getProjectFields();
      const group = project.makeStatusGroup(fields);

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
});
