const Render = {
  projectItemsByStatus: function (statusGroup) {
    let tbody = "";
    for (const status in statusGroup) {
      let items = statusGroup[status].items
        .map(
          (item) => `<a href="${item.content.url}">#${item.content.number}</a>`
        )
        .join("<br/>");
      tbody += `<tr>
    <td>${statusGroup[status].name}</td>
    <td>${statusGroup[status].items.length}</td>
    <td>?</td>
    <td>${items}</td>
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
