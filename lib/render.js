const Render = {
  projectItemsBySprint: function (sprintGroup) {
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
            <td>?</td>
            <td>?</td>
            <td>?</td>
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
                <th>Total Number</th>
                <th>Total Story Point</th>
                <th>Items</th>
            </tr>
            ${group(sprintGroup.iterations, "Iterating")}
            ${group(sprintGroup.completedIterations, "Completed")}
        </tbody>
    </table>`;
    return rendering;
  },
  projectItemsByStatus: function (statusGroup) {
    let content = "";
    for (const status in statusGroup) {
      content += `<tr>
          <td>${statusGroup[status].name}</td>
          <td>${statusGroup[status].items.length}</td>
          <td>${statusGroup[status].sumOfStoryPoint}</td>
          <td>${statusGroup[status].items
            .map(
              (item) =>
                `<a href="${item.content.url}">#${item.content.number}</a>`
            )
            .join("<br/>")}</td>
      </tr>`;
    }
    let rendering = `<table>
        <tbody>
            <tr>
                <th>Status</th>
                <th>Total Number</th>
                <th>Total Story Point</th>
                <th>Items</th>
            </tr>
            ${content}
        </tbody>
    </table>`;
    return rendering;
  },
};
module.exports = Render;
