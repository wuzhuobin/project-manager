const Render = {
  projectItemsByStatus: function (statusGroup) {
    let tbody = "";
    for (const status in statusGroup) {
      tbody += `<tr>
    <td>${statusGroup[status].name}</td>
    <td>${statusGroup[status].items.length}</td>
    <td>${statusGroup[status].sumOfStoryPoint}</td>
    <td>${statusGroup[status].items
      .map(
        (item) => `<a href="${item.content.url}">#${item.content.number}</a>`
      )
      .join("<br/>")}</td>
</tr>`;
    }
    let rendering = `<table>
    <thead>
        <tr>
            <th>Status</th>
            <th>Total Number</th>
            <th>Total Story Point</th>
            <th>Items</th>
        </tr>
    </thead>
    <tbody>
        ${tbody}
    </tbody>
</table>`;
    return rendering;
  },
};
module.exports = Render;
