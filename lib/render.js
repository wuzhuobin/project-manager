function itemToLink(item) {
  return `<a href="${item.content.url}">#${item.content.number}</a>`;
}

function itemsToUnorderList(items) {
  return `<ul>
    ${items.map((item) => `<li>${itemToLink(item)}</li>`).join("\n")}
  </ul>`;
}

const FIX_HEADER =
  "<th>Total Number</th><th>Total Story Point</th><th>Items</th>";
function renderingTable(header, body) {
  return `<table>
        <tbody>
            ${header}
            ${body}
        </tbody>
    </table>`;
}

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
            <td>${itemsToUnorderList(sprint.items)}</td>
        </tr>`;
        })
        .join("\n");
    }
    return groupHtml;
  }

  return renderingTable(
    `<tr>
      <th colspan="2">Sprint</th>
      ${FIX_HEADER}
    </tr>`,
    `${group(sprintGroup.iterations, "Iterating")}
     ${group(sprintGroup.completedIterations, "Completed")}`
  );
}

function projectItemsByStatus(statusGroup, withSprintGroup = false) {
  let body = "";
  for (const status in statusGroup) {
    body += `<tr>
          <td>${statusGroup[status].name}</td>
          <td>${statusGroup[status].items.length}</td>
          <td>${statusGroup[status].sumOfStoryPoint}</td>
          <td>${
            withSprintGroup
              ? itemsToUnorderList(statusGroup[status].items)
              : projectItemsBySprint(statusGroup[status].sprintGroup)
          }</td>
      </tr>`;
  }
  return renderingTable(
    `<tr>
        <th>Status</th>
        ${FIX_HEADER}
      </tr>`,
    `${body}`
  );
}

function projectItemsByStatusWithSprintGroup(statusGroup) {
  let body = "";
  let statusGroupHeader = "";
  for (const status in statusGroup) {
    const sprintGroup = statusGroup[status].sprintGroup;
    if (statusGroupHeader === "") {
      for (const group in sprintGroup) {
        for (const sprint in sprintGroup[group]) {
          statusGroupHeader += `<th>${sprintGroup[group][sprint].title}</th>`;
        }
      }
    }
    let sprintGroupHtml = "";
    for (const group in sprintGroup) {
      for (const sprint in sprintGroup[group]) {
        sprintGroupHtml += `<td>${sprintGroup[group][sprint].sumOfStoryPoint}</td>`;
      }
    }
    body += `<tr>
          <td>${statusGroup[status].name}</td>
          ${sprintGroupHtml}
          <td>${statusGroup[status].items.length}</td>
          <td>${statusGroup[status].sumOfStoryPoint}</td>
          <td>${itemsToUnorderList(statusGroup[status].items)}</td>
      </tr>`;
  }
  return renderingTable(
    `<tr>
        <th>Status</th>
        ${statusGroupHeader}
        ${FIX_HEADER}
    </tr>`,
    `${body}`
  );
}

function projectItemsByAssignee(assigneeGroup, withSprintGroup = false) {
  let body = "";
  for (const assignee in assigneeGroup) {
    const name = assigneeGroup[assignee].name;
    body += `<tr>
          <td>@${assignee} ${name && `(${name})`}</td>
          <td>${assigneeGroup[assignee].items.length}</td>
          <td>${assigneeGroup[assignee].sumOfStoryPoint}</td>
          <td>${
            withSprintGroup
              ? itemsToUnorderList(assigneeGroup[assignee].items)
              : projectItemsBySprint(assigneeGroup[assignee].sprintGroup)
          }</td>
      </tr>`;
  }
  return renderingTable(
    `<tr>
        <th>Assignee</th>
        ${FIX_HEADER}
    </tr>`,
    `${body}`
  );
}
const Render = {
  projectItemsBySprint,
  projectItemsByStatus,
  projectItemsByStatusWithSprintGroup,
  projectItemsByAssignee,
};
module.exports = Render;
