const core = require("@actions/core");
const github = require("@actions/github");
const Project = require("./project");
const Render = require("./render");

async function run() {
  const organization = core.getInput("organization");
  core.notice("organization: " + organization);
  const projectNumber = Number.parseInt(core.getInput("projectNumber"));
  core.notice("projectNumber: " + projectNumber);

  const token = core.getInput("token");
  const project = new Project(null, token);
  project.setOrignization(organization);
  project.setProjectNumber(projectNumber);

  const fields = await project.getProjectFields();
  const statusGroup = project.makeStatusGroup(fields);

  const items = await project.getProjectItems();
  const ids = items.map((item) => item.id).filter((id, index) => index < 100);
  const itemsFieldValues =
    await project.get100ProjectItemFieldValuesOfItemsByIds(ids);
  const itemsFieldValuesWithId = ids.map((id, index) => {
    return {
      id,
      fieldValues: itemsFieldValues[index],
    };
  });
  project.groupProjectItemsByStatus(itemsFieldValuesWithId, statusGroup);
  const statusGroupHtml = Render.projectItemsByStatus(statusGroup);
  core.info(statusGroupHtml);
  console.log(statusGroupHtml);

  core.setOutput("isSuccess", true);

  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
}

try {
  run();
} catch (error) {
  core.setFailed(error.message);
}
