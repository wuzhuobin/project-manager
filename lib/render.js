function itemUrlAndNumberToLink(url, number) {
  return `<a href="${url}">#${number}</a>`;
}
const FIX_HEADER =
  "<th>Total Number</th><th>Total Story Point</th><th>Items</th>";
function projectItemsBySprint(sprintGroup) {
  function group(group, groupName) {
    const length = Object.keys(group).length;
    let groupHtml;
    if (length === 0) {
      groupHtml = `<th rowspan="1">${groupName}</th><td></td><td></td><td></td><td></td>`;
    } else {
      groupHtml = Object.entries(group)
        .map(([, sprint], index) => {
          return `<tr>
            ${
              index === 0
                ? `<th rowspan="${length}">${groupName}</th>`
                : "<br/>"
            }
            <td>${sprint.title}</td>
            <td>${sprint.items.length}</td>
            <td>${sprint.sumOfStoryPoint}</td>
            <td>${sprint.items
              .map((item) =>
                itemUrlAndNumberToLink(item.content.url, item.content.number)
              )
              .join("<br/>")}</td>
        </tr>`;
        })
        .join("\n");
    }
    return groupHtml;
  }

  let rendering = `<table>
        <tbody>
            <tr>
                <th colspan="2">Sprint</th>
                ${FIX_HEADER}
            </tr>
            ${group(sprintGroup.iterations, "Iterating")}
            ${group(sprintGroup.completedIterations, "Completed")}
        </tbody>
    </table>`;
  return rendering;
}
function projectItemsByStatus(statusGroup) {
  let content = "";
  for (const status in statusGroup) {
    content += `<tr>
          <td>${statusGroup[status].name}</td>
          <td>${statusGroup[status].items.length}</td>
          <td>${statusGroup[status].sumOfStoryPoint}</td>
          <td>${statusGroup[status].items
            .map((item) =>
              itemUrlAndNumberToLink(item.content.url, item.content.number)
            )
            .join("<br/>")}</td>
      </tr>`;
  }
  let rendering = `<table>
        <tbody>
            <tr>
                <th>Status</th>
                ${FIX_HEADER}
            </tr>
            ${content}
        </tbody>
    </table>`;
  return rendering;
}
function projectItemsByStatusWithSprintGroupLegacy(statusGroup, sprintGroup) {
  let content = "";
  for (const status in statusGroup) {
    let sprintGroupHtml = "";
    for (const group in sprintGroup) {
      for (const sprint in sprintGroup[group]) {
        sprintGroupHtml += `<td>${statusGroup[status].sprintGroup[group][sprint].sumOfStoryPoint}</td>`;
      }
    }
    content += `<tr>
          <td>${statusGroup[status].name}</td>
          ${sprintGroupHtml}
          <td>${statusGroup[status].items.length}</td>
          <td>${statusGroup[status].sumOfStoryPoint}</td>
          <td>${statusGroup[status].items
            .map((item) =>
              itemUrlAndNumberToLink(item.content.url, item.content.number)
            )
            .join("<br/>")}</td>
      </tr>`;
  }
  let statusGroupHeader = "";
  for (const group in sprintGroup) {
    for (const sprint in sprintGroup[group]) {
      statusGroupHeader += `<th>${sprintGroup[group][sprint].title}</th>`;
    }
  }
  let rendering = `<table>
        <tbody>
            <tr>
                <th>Status</th>
                ${statusGroupHeader}
                ${FIX_HEADER}
            </tr>
            ${content}
        </tbody>
    </table>`;
  return rendering;
}
function projectItemsByStatusWithSprintGroup(statusGroup) {
  let content = "";
  for (const status in statusGroup) {
    const sprintGroupHtml = projectItemsBySprint(
      statusGroup[status].sprintGroup
    );
    content += `<tr>
          <td>${statusGroup[status].name}</td>
          <td>${sprintGroupHtml}</td>
          <td>${statusGroup[status].items.length}</td>
          <td>${statusGroup[status].sumOfStoryPoint}</td>
          <td>${statusGroup[status].items
            .map((item) =>
              itemUrlAndNumberToLink(item.content.url, item.content.number)
            )
            .join("<br/>")}</td>
      </tr>`;
  }
  let rendering = `<table>
        <tbody>
            <tr>
                <th>Status</th>
                <th>Sprint</th>
                ${FIX_HEADER}
            </tr>
            ${content}
        </tbody>
    </table>`;
  return rendering;
}
function projectItemsByAssignee(assigneeGroup) {
  let content = "";
  for (const assignee in assigneeGroup) {
    const name = assigneeGroup[assignee].name;
    content += `<tr>
          <td>@${assignee} ${name && `(${name})`}</td>
          <td>${assigneeGroup[assignee].items.length}</td>
          <td>${assigneeGroup[assignee].sumOfStoryPoint}</td>
          <td>${assigneeGroup[assignee].items
            .map((item) =>
              itemUrlAndNumberToLink(item.content.url, item.content.number)
            )
            .join("<br/>")}</td>
      </tr>`;
  }
  let rendering = `<table>
        <tbody>
            <tr>
                <th>Assignee</th>
                ${FIX_HEADER}
            </tr>
            ${content}
        </tbody>
    <table>`;
  return rendering;
}
const Render = {
  projectItemsBySprint,
  projectItemsByStatus,
  projectItemsByStatusWithSprintGroupLegacy,
  projectItemsByStatusWithSprintGroup,
  projectItemsByAssignee,
};
module.exports = Render;
