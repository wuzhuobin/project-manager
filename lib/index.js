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
        await project.getProjectItemFirst100FieldValuesOfItemsByIds(ids);
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

  const commentIds = items.map((item) => item.content.id);
  const bodies = await project.getCommentsBody(commentIds);
  const numbers = bodies.map((body) =>
    project.extractNumbersOfTrackingSubtasksFromBody(body)
  );
  const itemsFieldvaluesWithNumbersOfTrackingSubtasks =
    project.makeItemsWithNumbersOfTrackingSubtasks(itemsFieldValues, numbers);
  const itemsFieldvaluesWithTrackingSubtasks =
    project.groupProjectItemsByTrackingSubtasks(
      itemsFieldvaluesWithNumbersOfTrackingSubtasks
    );

  const sprintGroup = project.makeSprintGroup(fields);

  const statusGroup = project.makeStatusGroup(fields);
  project.groupProjectItemsByStatus(
    itemsFieldvaluesWithTrackingSubtasks,
    statusGroup
  );
  for (const status in statusGroup) {
    statusGroup[status].sprintGroup = JSON.parse(JSON.stringify(sprintGroup));
    project.groupProjectItemsBySprint(
      statusGroup[status].items,
      statusGroup[status].sprintGroup
    );
    for (const group in statusGroup[status].sprintGroup) {
      for (const sprint in statusGroup[status].sprintGroup[group]) {
        statusGroup[status].sprintGroup[group][sprint].sumOfStoryPoint =
          project.sumOfStoryPointByItemsFieldValuesWithTrackingSubtasks(
            statusGroup[status].sprintGroup[group][sprint].items
          );
      }
    }
    statusGroup[status].sumOfStoryPoint =
      project.sumOfStoryPointByItemsFieldValuesWithTrackingSubtasks(
        statusGroup[status].items
      );
  }
  core.setOutput("statusGroupHtml", Render.projectItemsByStatus(statusGroup));
  core.setOutput(
    "statusGroupWithSprintGroupHtml",
    Render.projectItemsByStatus(statusGroup, true)
  );

  const assignees = await project.getAssignablesFirst100Assignees(
    items.map((item) => item.content.id)
  );
  const itemsWithAssignees = project.makeItemsWithAssignees(
    itemsFieldvaluesWithTrackingSubtasks,
    assignees
  );
  const assigneeGroup = project.groupProjectItemsByAssignee(itemsWithAssignees);
  for (const assignee in assigneeGroup) {
    assigneeGroup[assignee].sprintGroup = JSON.parse(
      JSON.stringify(sprintGroup)
    );
    project.groupProjectItemsBySprint(
      assigneeGroup[assignee].items,
      assigneeGroup[assignee].sprintGroup
    );
    assigneeGroup[assignee].sumOfStoryPoint =
      project.sumOfStoryPointByItemsFieldValuesWithTrackingSubtasks(
        assigneeGroup[assignee].items
      );
    for (const group in assigneeGroup[assignee].sprintGroup) {
      for (const sprint in assigneeGroup[assignee].sprintGroup[group]) {
        assigneeGroup[assignee].sprintGroup[group][sprint].sumOfStoryPoint =
          project.sumOfStoryPointByItemsFieldValuesWithTrackingSubtasks(
            assigneeGroup[assignee].sprintGroup[group][sprint].items
          );
      }
    }
  }

  core.setOutput(
    "assigneeGroupHtml",
    Render.projectItemsByAssignee(assigneeGroup)
  );
  core.setOutput(
    "assigneeGroupWithSprintGroupHtml",
    Render.projectItemsByAssignee(assigneeGroup, true)
  );

  project.groupProjectItemsBySprint(
    itemsFieldvaluesWithTrackingSubtasks,
    sprintGroup
  );
  for (const group in sprintGroup) {
    for (const sprint in sprintGroup[group]) {
      sprintGroup[group][sprint].sumOfStoryPoint =
        project.sumOfStoryPointByItemsFieldValuesWithTrackingSubtasks(
          sprintGroup[group][sprint].items
        );
    }
  }
  core.setOutput("sprintGroupHtml", Render.projectItemsBySprint(sprintGroup));

  core.setOutput("isSuccess", true);

  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
}

try {
  run();
} catch (error) {
  core.setFailed(error.message);
}
