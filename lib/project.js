const axios = require("axios").default;

class Project {
  static PROJECT_ID = `query projectId($organization: String! $number: Int!){
    organization(login: $organization){
      projectNext(number: $number) {
        id
      }
    }
  }`;

  static PROJECT_FIELD_COUNT = `query projectFieldCount($organization: String! $number: Int!){
    organization(login: $organization){
      projectNext(number: $number) {
        fields {
          totalCount
        }
      }
    }
  }`;

  static PROJECT_FIELD_NAME = `query projectFieldName($organization: String! $number: Int! $first: Int!){
    organization(login: $organization) {
      projectNext(number: $number) {
        fields(first: $first) {
          nodes {
            name
          }
        }
      }
    }
  }`;

  static PROJECT_ITEM_COUNT = `query projectFieldName($organization: String! $number: Int!){
    organization(login: $organization) {
      projectNext(number: $number) {
        items {
          totalCount
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
    this.statue = "Statue"
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

  setStatue(statue) {
    this.statue = statue;
  }

  async _execute(query, variables) {
    const defaultVariables = { organization: this.organization, number: this.projectNumber };
    variables = { ...defaultVariables, ...variables };
    const data = JSON.stringify({
      query,
      variables,
    });
    const respose = await axios.post(Project.URL, data, this.githubApiConfig);
    return respose.data;
  }

  async getProjectId() {
    const data = await this._execute(Project.PROJECT_ID);
    return data.data.organization.projectNext.id;
  }

  async getProjectFieldCount() {
    const data = await this._execute(Project.PROJECT_FIELD_COUNT);
    return data.data.organization.projectNext.fields.totalCount;
  }

  async getProjectFieldName() {
    const names = [];
    const count = await this.getProjectFieldCount();
    for (let i = 0; i < count; i += 100) {
      const data = await this._execute(Project.PROJECT_FIELD_NAME, { first: i + 100 });
      names.push(
        ...data.data.organization.projectNext.fields.nodes.map((node) => {
          return node.name;
        })
      );
    }
    return names;
  }

  async getProjectItemCount() {
    const data = await this._execute(Project.PROJECT_ITEM_COUNT);
    return data.data.organization.projectNext.items.totalCount;
  }

}

module.exports = Project;
