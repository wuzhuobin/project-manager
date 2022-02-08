const core = require("@actions/core");
const github = require("@actions/github");
const Project = require("./project");
const Render = require("./render");
const Util = require("./util");

async function run() {
  const organization = core.getInput("organization");
  core.notice("organization: " + organization);
  const user = core.getInput("user");
  core.notice("user: " + user);
  const projectNumber = Number.parseInt(core.getInput("projectNumber"));
  core.notice("projectNumber: " + projectNumber);
  const projectId = core.getInput("projectId");
  core.notice("projectId: " + projectId);

  const token = core.getInput("token");
  const project = new Project(projectId, token);
  if (organization) {
    project.setOrignization(organization);
  } else {
    project.setUser(user);
  }
  project.setProjectNumber(projectNumber);
  if (!projectId) {
    project.setProjectId(await project.getProjectId());
    core.notice("projectId: " + project.projectId);
  }

  const fields = await project.getProjectFields();
  const statusGroup = project.makeStatusGroup(fields);

  const items = await project.getProjectItems();
  const itemsGroupPer100 = Util.arrayToEvery100Arrays(items);
  const itemsFieldValuesWithIdGroupsPer100 = itemsGroupPer100.map(
    async (items) => {
      const ids = items.map((item) => item.id);
      const itemsFieldValues =
        await project.get100ProjectItemFieldValuesOfItemsByIds(ids);
      const itemsFieldValuesWithId = items.map((item, index) => {
        return {
          ...item,
          fieldValues: itemsFieldValues[index],
        };
      });
      return itemsFieldValuesWithId;
    }
  );
  core.info(await itemsFieldValuesWithIdGroupsPer100);
  const itemsFieldValuesWithId =
    await itemsFieldValuesWithIdGroupsPer100.reduce(
      (previousValue, currentValue) => {
        core.info(previousValue);
        return previousValue.concat(currentValue);
      }
    );

  project.groupProjectItemsByStatus(itemsFieldValuesWithId, statusGroup);
  const statusGroupHtml = Render.projectItemsByStatus(statusGroup);

  core.setOutput("isSuccess", true);
  core.setOutput("issueContent", statusGroupHtml);

  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
}

try {
  run();
} catch (error) {
  core.setFailed(error.message);
}
