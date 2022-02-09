const axios = require("axios").default;

class Project {
  static URL = "https://api.github.com/graphql";

  constructor(projectId, token) {
    this.projectId = projectId;
    if (token) {
      this.githubApiConfig = {
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
      };
    } else {
      this.githubApiConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

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
    if (token) {
      this.githubApiConfig.headers.Authorization = `token ${token}`;
    } else {
      this.githubApiConfig.headers = { "Content-Type": "application/json" };
    }
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
    const data = JSON.stringify({
      query,
      variables,
    });
    const respose = await axios.post(Project.URL, data, this.githubApiConfig);
    if (respose.data.errors) {
      const message = JSON.stringify(respose.data.errors, null, 2);
      throw new Error(message);
    }
    return respose.data;
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
    return data.data[this.organization ? "organization" : "user"].projectNext
      .id;
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
      return data.data.organization.projectNext.fields.totalCount;
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
    return data.data.node.fields.totalCount;
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
      afterCursor = data.data.node.fields.pageInfo.endCursor;
      shouldContinue = data.data.node.fields.pageInfo.hasNextPage;
      fields.push(...data.data.node.fields.nodes);
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
      return data.data.organization.projectNext.items.totalCount;
    }

    const projectItemCount = `query projectFieldName($id: ID!){
      node(id: $id) {
        ... on ProjectNext {
          ${itemsCount}
        }
      }
    }`;
    const data = await this._execute(projectItemCount);
    return data.data.node.items.totalCount;
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
      afterCursor = data.data.node.items.pageInfo.endCursor;
      shouldContinue = data.data.node.items.pageInfo.hasNextPage;
      items.push(...data.data.node.items.nodes);
    }
    return items;
  }

  async get100ProjectItemFieldValuesOfItemsByIds(ids) {
    const projectItemFieldValuesOfItemsByIds = `
      query projectItemFieldValuesOfItemsByIds($ids: [ID!]! $first: Int!)
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

    const data = await this._execute(projectItemFieldValuesOfItemsByIds, {
      ids,
      first: 100,
    });
    return data.data.nodes.map((node) => {
      return node.fieldValues.nodes;
    });
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

  sumOfStoryPointByItemsFieldValues(itemsFieldValues) {
    let sumOfStoryPoints = 0;
    for (let item of itemsFieldValues) {
      const storyPointsField = item.fieldValues.find(
        (fieldValue) => fieldValue.projectField.name === this.storyPoint
      );
      if (storyPointsField) {
        sumOfStoryPoints += parseInt(storyPointsField.value);
      }
    }
    return sumOfStoryPoints;
  }

  async getProjectItemsLegacy() {
    const projectItems = (
      noAfter = true
    ) => `query projectItems($login: String! $number: Int! $first: Int! ${
      noAfter ? "" : "$after: String!"
    }){
        ${this.organization ? "organization" : "user"}(login: $login){
          projectNext(number: $number) {
            items(first: $first ${noAfter ? "" : "after: $after"}) {
              edges {
                cursor
              }
              nodes {
                id
                title
                content {
                  __typename
                  ... on Issue {
                    id
                  }
                  ... on PullRequest {
                    id
                  }
                }
              }
            }
          }
        }
      }`;

    const items = [];
    let afterCursor = null;
    const count = await this.getProjectItemCount();
    for (let i = 0; i < count; i += 100) {
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
      const edges = data.data.organization.projectNext.items.edges;
      afterCursor = edges[edges.length - 1].cursor;
      items.push(...data.data.organization.projectNext.items.nodes);
    }

    return items;
  }
}

module.exports = Project;
