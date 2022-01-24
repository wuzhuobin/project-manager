const axios = require('axios').default;


class Project {
  constructor(token) {
    this.url = 'https://api.github.com/graphql';
    this.githubApiConfig = {
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  async getProjectId(organization, number) {
    const data = JSON.stringify({
      query: `query($organization: String! $number: Int!){
        organization(login: $organization){
          projectNext(number: $number) {
            id
          }
        }
      }`,
      variables: { "organization": organization, "number": number }
    });
    const respose = await axios.post(this.url, data, this.githubApiConfig);
    return respose.data.data.organization.projectNext.id;
  }
};

module.exports = Project;