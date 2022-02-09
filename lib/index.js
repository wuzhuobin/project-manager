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

  const items = await project.getProjectItems();
  const itemsGroupPer100 = Util.arrayToEvery100Arrays(items);
  const itemsFieldValuesGroupsPer100 = await Promise.all(
    itemsGroupPer100.map(async (items) => {
      const ids = items.map((item) => item.id);
      const fieldValuesArray =
        await project.get100ProjectItemFieldValuesOfItemsByIds(ids);
      const itemsFieldValues = items.map((item, index) => {
        return {
          ...item,
          fieldValues: fieldValuesArray[index],
        };
      });
      return itemsFieldValues;
    })
  );
  const itemsFieldValues = itemsFieldValuesGroupsPer100.reduce(
    (previousValue, currentValue) => {
      return previousValue.concat(currentValue);
    }
  );

  const statusGroup = project.makeStatusGroup(fields);
  project.groupProjectItemsByStatus(itemsFieldValues, statusGroup);
  for (const status in statusGroup) {
    statusGroup[status].sumOfStoryPoint =
      project.sumOfStoryPointByItemsFieldValues(statusGroup[status].items);
  }
  const statusGroupHtml = Render.projectItemsByStatus(statusGroup);
  core.setOutput("statusGroupHtml", statusGroupHtml);

  const sprintGroup = project.makeSprintGroup(fields);
  project.groupProjectItemsBySprint(itemsFieldValues, sprintGroup);
  // core.setOutput()

  core.setOutput("isSuccess", true);

  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
}

try {
  run();
} catch (error) {
  core.setFailed(error.message);
}
