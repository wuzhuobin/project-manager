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

  static PROJECT_FIELD_NAME = `query projectFieldName($organization: String! $number: Int!){
    organization(login: $organization) {
      projectNext(number: $number) {
        fields(first: 100) {
          nodes {
            name
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
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      },
    };

    this.storyPoint = "Story Point";
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


  async _execute(query) {
    const data = JSON.stringify({
      query,
      variables: { organization: this.organization, number: this.projectNumber }
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
    const data = await this._execute(Project.PROJECT_FIELD_NAME);
    return data.data.organization.projectNext.fields.nodes.map(node => node.name);
  }

  // async _getProjectFields(organization, number) {
  //   const data = JSON.stringify({
  //     query: Project.PROJECT_FIELD,
  //     variables: { "organization": organization, "number": number }
  //   });
  //   const respose = await axios.post(this.url, data, this.githubApiConfig);
  //   return respose.data;
  // }

  // async getProjectFields(organization, number) {
  //   const data = await this._getProjectFields(organization, number);
  //   return data.data.organization.projectNext.fields;
  // }

};

module.exports = Project;