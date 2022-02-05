const axios = require("axios").default;

class Project {
  static URL = "https://api.github.com/graphql";

  constructor(organization, projectNumber, token) {
    this.organization = organization;
    this.projectNumber = projectNumber;
    this.githubApiConfig = {
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
    };

    this.storyPoint = "Story Point";
    this.status = "Status";
    this.sprint = "Sprint";
  }

  setOrignization(organization) {
    this.organization = organization;
  }

  setProjectNumber(projectNumber) {
    this.projectNumber = projectNumber;
  }

  setToken(token) {
    this.githubApiConfig.headers.Authorization = `token ${token}`;
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
      organization: this.organization,
      number: this.projectNumber,
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
    const projectIds = `query projectIds($organization: String! $number: Int!){
      organization(login: $organization){
        projectNext(number: $number) {
          id
        }
      }
    }`;
    const data = await this._execute(projectIds);
    return data.data.organization.projectNext.id;
  }

  async getProjectFieldCount() {
    const projectFieldCount = `query projectFieldCount($organization: String! $number: Int!){
      organization(login: $organization){
        projectNext(number: $number) {
          fields {
            totalCount
          }
        }
      }
    }`;
    const data = await this._execute(projectFieldCount);
    return data.data.organization.projectNext.fields.totalCount;
  }

  async getProjectFields() {
    const projectFields = (
      noAfter = true
    ) => `query projectFields($organization: String! $number: Int! $first: Int! ${
      noAfter ? "" : "$after: String!"
    }){
      organization(login: $organization) {
        projectNext(number: $number) {
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
      afterCursor =
        data.data.organization.projectNext.fields.pageInfo.endCursor;
      shouldContinue =
        data.data.organization.projectNext.fields.pageInfo.hasNextPage;
      fields.push(...data.data.organization.projectNext.fields.nodes);
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
    const projectItemCount = `query projectFieldName($organization: String! $number: Int!){
      organization(login: $organization) {
        projectNext(number: $number) {
          items {
            totalCount
          }
        }
      }
    }`;

    const data = await this._execute(projectItemCount);
    return data.data.organization.projectNext.items.totalCount;
  }

  async getProjectItems() {
    const projectItems = (
      noAfter = true
    ) => `query projectItems($organization: String! $number: Int! $first: Int! ${
      noAfter ? "" : "$after: String!"
    }){
        organization(login: $organization){
          projectNext(number: $number) {
            items(first: $first ${noAfter ? "" : "after: $after"}) {
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
      afterCursor = data.data.organization.projectNext.items.pageInfo.endCursor;
      shouldContinue =
        data.data.organization.projectNext.items.pageInfo.hasNextPage;
      items.push(...data.data.organization.projectNext.items.nodes);
    }
    return items;
  }

  async get100ProjectItemFieldValuesOfItemsByIds(ids) {
    const projectItemFieldValuesOfItemsByIds = `query projectItemFieldValuesOfItemsByIds($ids: [ID!]! $first: Int!)
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

  groupProjectItemsByStatus(itemsFieldValuesWithId, statusGroup) {
    for (let item of itemsFieldValuesWithId) {
      const statusField = item.fieldValues.find(
        (fieldValue) => fieldValue.projectField.name === this.status
      );
      if (statusField) {
        statusGroup[statusField.value].items.push(item.id);
      }
    }
    return statusGroup;
  }

  groupProjectItemsBySprint(itemsFieldValuesWithId, sprintGroup) {
    for (let item of itemsFieldValuesWithId) {
      const sprintField = item.fieldValues.find(
        (fieldValue) => fieldValue.projectField.name === this.sprint
      );
      if (sprintField) {
        if (sprintGroup.iterations[sprintField.value]) {
          sprintGroup.iterations[sprintField.value].items.push(item.id);
        } else if (sprintGroup.completedIterations[sprintField.value]) {
          sprintGroup.completedIterations[sprintField.value].items.push(
            item.id
          );
        }
      }
    }
  }

  async getProjectItemsLegacy() {
    const projectItems = (
      noAfter = true
    ) => `query projectItems($organization: String! $number: Int! $first: Int! ${
      noAfter ? "" : "$after: String!"
    }){
        organization(login: $organization){
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
