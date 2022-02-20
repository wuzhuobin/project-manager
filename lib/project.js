const axios = require("axios").default;
const github = require("@actions/github");
class Project {
  constructor(projectId, token, useAxios = false) {
    this.projectId = projectId;
    this.token = token;
    this.useAxios = useAxios;
    this.storyPoint = "Story Point";
    this.status = "Status";
    this.sprint = "Sprint";
  }

  setProjectId(projectId) {
    this.projectId = projectId;
  }

  setOrignization(organization) {
    this.organization = organization;
    this.user = undefined;
  }

  setUser(user) {
    this.user = user;
    this.organization = undefined;
  }

  setProjectNumber(projectNumber) {
    this.projectNumber = projectNumber;
  }

  setToken(token) {
    this.token = token;
  }

  setStoryPoint(storyPoint) {
    this.storyPoint = storyPoint;
  }

  setStatus(status) {
    this.status = status;
  }

  setSprint(sprint) {
    this.sprint = sprint;
  }

  async _execute(query, variables) {
    const defaultVariables = {
      login: this.organization ? this.organization : this.user,
      number: this.projectNumber,
      id: this.projectId,
    };
    variables = { ...defaultVariables, ...variables };

    let result;
    if (this.useAxios) {
      const data = JSON.stringify({
        query,
        variables,
      });

      const url = "https://api.github.com/graphql";
      const respose = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.token ? `token ${this.token}` : undefined,
        },
      });
      if (respose.data.errors) {
        const message = JSON.stringify(respose.data.errors, null, 2);
        throw new Error(message);
      }
      result = respose.data.data;
    } else {
      const octokit = github.getOctokit(this.token || "");
      result = await octokit.graphql(query, variables);
    }
    return result;
  }

  async getProjectId() {
    const projectIds = `
      query projectIds($login: String! $number: Int!){
        ${this.organization ? "organization" : "user"}(login: $login){
          projectNext(number: $number) {
            id
          }
        }
      }
    `;
    const data = await this._execute(projectIds);
    return data[this.organization ? "organization" : "user"].projectNext.id;
  }

  async getProjectFieldCount() {
    const fieldCount = `
      fields {
        totalCount
      }
    `;
    // legacy
    if (!this.projectId) {
      const projectFieldCount = `
        query projectFieldCount($login: String! $number: Int!){
          ${this.organization ? "organization" : "user"}(login: $login){
            projectNext(number: $number) {
              ${fieldCount}
            }
          }
        }`;
      const data = await this._execute(projectFieldCount);
      return data.organization.projectNext.fields.totalCount;
    }
    const projectFieldCount = `
      query projectFieldCount($id: ID!){
        node(id: $id) {
          ... on ProjectNext {
            ${fieldCount}
          }
        }
      }
    `;
    const data = await this._execute(projectFieldCount);
    return data.node.fields.totalCount;
  }

  async getProjectFields() {
    const projectFields = (
      noAfter = true
    ) => `query projectFields($id: ID! $first: Int! ${
      noAfter ? "" : "$after: String!"
    }){
      node(id: $id) {
        ... on ProjectNext {
          fields(first: $first ${noAfter ? "" : "after: $after"}) {
            nodes {
              id
              name
              settings
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      }
    }`;
    const fields = [];
    let afterCursor = null;
    for (let shouldContinue = true; shouldContinue; ) {
      let data = null;
      if (afterCursor === null) {
        data = await this._execute(projectFields(), {
          first: 100,
        });
      } else {
        data = await this._execute(projectFields(false), {
          first: 100,
          after: afterCursor,
        });
      }
      afterCursor = data.node.fields.pageInfo.endCursor;
      shouldContinue = data.node.fields.pageInfo.hasNextPage;
      fields.push(...data.node.fields.nodes);
    }
    fields.map((field) => {
      field.settings = JSON.parse(field.settings);
      return field;
    });
    return fields;
  }

  static _makeOptionGroup(fields, groupName) {
    const options = fields.find((field) => field.name === groupName).settings
      .options;

    const group = {};
    for (let optoin of options) {
      group[optoin.id] = {
        name: optoin.name,
        items: [],
      };
    }
    return group;
  }

  makeStatusGroup(fields) {
    return Project._makeOptionGroup(fields, this.status);
  }

  makeSprintGroup(fields) {
    const configuration = fields.find((field) => field.name === this.sprint)
      .settings.configuration;
    const iterations = {};
    for (let sprint of configuration.iterations) {
      iterations[sprint.id] = sprint;
      iterations[sprint.id].items = [];
    }

    const completedIterations = {};
    for (let sprint of configuration.completed_iterations) {
      completedIterations[sprint.id] = sprint;
      completedIterations[sprint.id].items = [];
    }

    const group = {
      iterations,
      completedIterations,
    };
    return group;
  }

  static makeItemsWithAssignees(items, assignees) {
    return items.map((item, index) => {
      item.content.assignees = assignees[index];
      return item;
    });
  }

  static makeItemsWithNumbersOfTrackingSubtasks(items, numbersOfSubtasks) {
    return items.map((item, index) => {
      item.content.numbersOfTrackingSubtasks = numbersOfSubtasks[index];
      return item;
    });
  }

  async getProjectItemCount() {
    // legacy
    const itemsCount = `
              items {
                totalCount
              }
    `;
    if (!this.projectId) {
      const projectItemCount = `
        query projectFieldName($login: String! $number: Int!){
          ${this.organization ? "organization" : "user"}(login: $login) {
            projectNext(number: $number) {
              ${itemsCount}
            }
          }
        }
      `;

      const data = await this._execute(projectItemCount);
      return data.organization.projectNext.items.totalCount;
    }

    const projectItemCount = `query projectFieldName($id: ID!){
      node(id: $id) {
        ... on ProjectNext {
          ${itemsCount}
        }
      }
    }`;
    const data = await this._execute(projectItemCount);
    return data.node.items.totalCount;
  }

  async getProjectItems() {
    const projectItems = (
      noAfter = true
    ) => `query projectItems($id: ID! $first: Int! ${
      noAfter ? "" : "$after: String!"
    }){
        node(id: $id){
          ... on ProjectNext {
            items(first: $first ${noAfter ? "" : "after: $after"}) {
              nodes {
                id
                title
                content {
                  __typename
                  ... on Issue {
                    id
                    number
                    url
                  }
                  ... on PullRequest {
                    id
                    number
                    url
                  }
                }
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
          }
        }
      }`;
    const items = [];
    let afterCursor = null;
    for (let shouldContinue = true; shouldContinue; ) {
      let data = null;
      if (afterCursor === null) {
        data = await this._execute(projectItems(), {
          first: 100,
        });
      } else {
        data = await this._execute(projectItems(false), {
          first: 100,
          after: afterCursor,
        });
      }
      afterCursor = data.node.items.pageInfo.endCursor;
      shouldContinue = data.node.items.pageInfo.hasNextPage;
      items.push(...data.node.items.nodes);
    }
    return items;
  }

  async getProjectItemFirst100FieldValuesOfItemsByIds(ids) {
    const projectItemFirst100FieldValuesOfItemsByIds = `
      query projectItemFirst100FieldValuesOfItemsByIds($ids: [ID!]! $first: Int!)
      {
        nodes(ids: $ids)
        {
          ... on ProjectNextItem{
            fieldValues(first: $first){
              nodes {
                value
                projectField {
                  id
                  name
                }
              }
            }
          }
        }
      }`;

    const data = await this._execute(
      projectItemFirst100FieldValuesOfItemsByIds,
      {
        ids,
        first: 100,
      }
    );
    return data.nodes.map((node) => {
      return node.fieldValues.nodes;
    });
  }

  async getAssignablesFirst100Assignees(ids) {
    const assignablesFirst100Assignees = `
      query assignablesFirst100Assignees($ids: [ID!]! $first: Int!) {
        nodes(ids: $ids) {
          ... on Assignable {
            assignees(first: $first) {
              nodes{
                name
                login
              }
            }
          }
        }
      }
    `;
    let assignees = [];
    for (let i = 0; i < ids.length; i += 100) {
      const subIds = ids.slice(i, i + 100);
      const data = await this._execute(assignablesFirst100Assignees, {
        ids: subIds,
        first: 100,
      });

      assignees = assignees.concat(
        data.nodes.map((node) => node.assignees.nodes)
      );
    }
    return assignees;
  }

  async getCommentsBody(ids) {
    const commentsBody = `
      query commentsBody($ids: [ID!]!) {
        nodes(ids: $ids) {
          ... on Comment {
            body
          }
        }
      }
    `;
    let bodies = [];
    for (let i = 0; i < ids.length; i += 100) {
      const subIds = ids.slice(i, i + 100);
      const data = await this._execute(commentsBody, {
        ids: subIds,
      });

      bodies = bodies.concat(data.nodes.map((node) => node.body));
    }
    return bodies;
  }

  groupProjectItemsByStatus(itemsFieldValues, statusGroup) {
    for (let item of itemsFieldValues) {
      const statusField = item.fieldValues.find(
        (fieldValue) => fieldValue.projectField.name === this.status
      );
      if (statusField) {
        statusGroup[statusField.value].items.push(item);
      }
    }
    return statusGroup;
  }

  groupProjectItemsBySprint(itemsFieldValues, sprintGroup) {
    for (let item of itemsFieldValues) {
      const sprintField = item.fieldValues.find(
        (fieldValue) => fieldValue.projectField.name === this.sprint
      );
      if (sprintField) {
        if (sprintGroup.iterations[sprintField.value]) {
          sprintGroup.iterations[sprintField.value].items.push(item.id);
        } else if (sprintGroup.completedIterations[sprintField.value]) {
          sprintGroup.completedIterations[sprintField.value].items.push(item);
        }
      }
    }
  }

  groupProjectItemsByAssignee(itemsWithAssignees) {
    let assigneesStr = itemsWithAssignees
      .map((item) => item.content.assignees)
      .reduce((acc, assignee) => acc.concat(...assignee))
      .map((assignee) => JSON.stringify(assignee));
    const set = [...new Set(assigneesStr)].map((assignee) =>
      JSON.parse(assignee)
    );
    const group = {};
    for (let assignee of set) {
      group[assignee.login] = assignee;
      group[assignee.login].items = [];
    }
    for (let item of itemsWithAssignees) {
      const assignees = item.content.assignees;
      for (let assignee of assignees) {
        group[assignee.login].items.push(item);
      }
    }
    return group;
  }

  groupProjectItemsByTrackingSubtasks(itemsWithNumbersOfTrackingSubtasks) {
    const subtasksSet = new Set();
    for (let item of itemsWithNumbersOfTrackingSubtasks) {
      item.content.trackingSubtasks = [];
      for (let number of item.content.numbersOfTrackingSubtasks) {
        subtasksSet.add(number);
        item.content.trackingSubtasks.push(
          itemsWithNumbersOfTrackingSubtasks.find(
            (item) => item.content.number === number
          )
        );
      }
    }
    const itemsWithNumbersOfTrackingSubtasksFitered =
      itemsWithNumbersOfTrackingSubtasks.filter(
        (item) => !subtasksSet.has(item.content.number)
      );
    return itemsWithNumbersOfTrackingSubtasksFitered;
  }

  sumOfStoryPointByItemsFieldValues(itemsFieldValues) {
    let sumOfStoryPoint = 0;
    for (let item of itemsFieldValues) {
      const storyPointsField = item.fieldValues.find(
        (fieldValue) => fieldValue.projectField.name === this.storyPoint
      );
      if (storyPointsField) {
        sumOfStoryPoint += parseInt(storyPointsField.value);
      }
    }
    return sumOfStoryPoint;
  }

  extractNumbersOfTrackingSubtasksFromBody(body) {
    const issueRegex = /\[[ xX]\] #\d+/g;
    const matches = body.match(issueRegex);
    if (!matches || matches.length <= 0) {
      return [];
    }
    const numbers = matches.map((match) => parseInt(match.match(/\d+/)[0]));

    return numbers;
  }
}

module.exports = Project;
