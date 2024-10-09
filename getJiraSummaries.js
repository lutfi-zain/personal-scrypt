const axios = require("axios");

// Get Jira email and API token from environment variables
const jiraEmail = process.env.JIRA_EMAIL;
const jiraApiToken = process.env.JIRA_API_TOKEN;
const jiraBaseUrl = process.env.JIRA_BASE_URL;

// Function to fetch the summary of a Jira issue using Jira's REST API
const getJiraSummary = async (issueKey) => {
  const issueUrl = `${jiraBaseUrl}/${issueKey}`;

  try {
    const response = await axios.get(issueUrl, {
      auth: {
        username: jiraEmail,
        password: jiraApiToken,
      },
    });
    const summary = response.data.fields.summary;
    return summary;
  } catch (error) {
    console.error(`Failed to fetch summary for ${issueKey}:`, error.message);
    return null;
  }
};

// Function to process a list of Jira issue keys
const processJiraLinks = async (issueKeys) => {
  const summaries = await Promise.all(issueKeys.map(getJiraSummary));
  summaries.forEach((summary, index) => {
    console.log(`- ${issueKeys[index]}: ${summary}`);
  });
};

// Example usage
const issueKeys = [
  "KIA-274",
  "KIA-282",
  "KIA-366",
  "KIA-298",
  "KIA-376",
  "KIA-318",
  "POTP-2218",
  "KIA-424",
];

processJiraLinks(issueKeys);

/**
 * Author: Annisa
 * https://github.com/a-sftn
 */