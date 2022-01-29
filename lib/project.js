const axios = require("axios").default;

class Project {
  static PROJECT_ITEMS = `query($organization: String! $number: Int! $first: Int!){
    organization(login: $organization){
      projectNext(number: $number) {
        items(first: $first) {
          nodes {
            databaseId
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
  }

  setOrignization(organization) {
    this.organization = organization;
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
      throw respose.data.errors;
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
    ) => `query projectFieldNamesFirst100($organization: String! $number: Int! $first: Int! ${
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

  makeStatusGroup(fields) {
    const options = fields.filter((field) => field.name === this.status)[0]
      .settings.options;

    const statusGroup = {};
    for (let optoin of options) {
      statusGroup[optoin.id] = {
        name: optoin.name,
        items: [],
      };
    }
    return statusGroup;
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

  async get100ProjectFieldsOfItemsByIds(ids) {
    const projectFieldsOfItemsByIds = `query projectFieldsOfItemsByIds($ids: [ID!]! $first: Int!)
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

    const data = await this._execute(projectFieldsOfItemsByIds, {
      ids,
      first: 100,
    });
    return data.data.nodes.map((node) => node.fieldValues.nodes);
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
