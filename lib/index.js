const core = require("@actions/core");
const github = require("@actions/github");
const Project = require("./project");

async function run() {
  const organization = core.getInput("organization");
  core.notice("organization: " + organization);
  const projectNumber = Number.parseInt(core.getInput("projectNumber"));
  core.notice("projectNumber: " + projectNumber);

  const token = core.getInput("token");
  const p = new Project(null, token);
  p.setOrignization(organization);
  p.setProjectNumber(projectNumber);
  const projectId = await p.getProjectId();
  core.notice("projectId: " + projectId);

  core.setOutput("isSuccess", true);

  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
}

try {
  run();
} catch (error) {
  core.setFailed(error.message);
}
