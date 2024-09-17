# Personal Script for Work Life Quality

<details>
<summary>github_all.js</summary>

### GitHub Repository Manager

This script provides an interactive command-line interface (CLI) to manage GitHub repositories. It allows you to clone all repositories from an organization, hard reset all repositories to a specific branch, search repositories with a keyword, list local repositories and perform actions, and search local repositories by keyword and perform actions.

### Prerequisites

- Node.js installed on your machine.
- GitHub CLI (`gh`) installed and authenticated. You can install it from [GitHub CLI](https://cli.github.com/).

### Installation

1. Clone this repository or download the script file `github_all.js`.
2. Ensure you have Node.js installed. You can download it from [Node.js](https://nodejs.org/).
3. Ensure you have GitHub CLI installed and authenticated. You can follow the instructions from [GitHub CLI](https://cli.github.com/).

### Usage

1. Open a terminal or command prompt.
2. Navigate to the directory where `github_all.js` is located.
3. Run the script using Node.js:

```sh
node github_all.js
```

4. Follow the interactive prompts to perform various actions.

### Features

1. Clone all repositories from an organization

- Prompts for the organization name.
- Clones all repositories from the specified organization.
- Hard reset all repositories to a specific branch

2. Prompts for the branch name.

- Hard resets all local repositories in the current directory to the specified branch.
- Search repositories with a keyword

3. Prompts for a keyword.

- Searches for repositories in the specified organization that contain the keyword.
- Optionally clones the found repositories.
- List local repositories and perform actions

4. Lists all local repositories in the current directory.

- Prompts to reset to a specific branch, fetch the latest changes, or remove the node_modules folder.
- Search local repositories by keyword and perform actions

5. Prompts for a keyword.

- Lists local repositories in the current directory that contain the keyword.
- Prompts to reset to a specific branch, fetch the latest changes, or remove the node_modules folder.

6. Exit

- Exits the script.
</details>

<details>
<summary>get_all_secret.js</summary>

### AWS Secrets Manager Retrieval Script

This script retrieves all secrets from AWS Secrets Manager and writes each secret to a separate `.json` file. It provides two methods for retrieving secrets: using the AWS CLI and using the AWS SDK.

### Prerequisites

- Node.js installed on your machine
- AWS CLI installed and configured with appropriate permissions
- AWS SDK for Node.js (`aws-sdk` package)

### Setup

1. Clone the repository or download the script.
2. Ensure you have the necessary AWS credentials configured. You can configure your AWS credentials using the AWS CLI:

   ```sh
   aws configure
   ```

3. Install the required Node.js packages:
   ```sh
   npm install aws-sdk
   ```

### Usage

#### Using AWS CLI

To use the AWS CLI method, uncomment the getAllAWSSecretsWithCli function call at the end of the script and specify the output format ('json' or 'env'):

```javascript
// Uncomment the function you want to use and specify the output format ('json' or 'env')
getAllAWSSecretsWithCli('json');
// getAllAWSSecretsWithCli('env');
// getAllAWSSecretsWithSdk('json');
// getAllAWSSecretsWithSdk('env');
```

#### Using AWS SDK
To use the AWS SDK method, uncomment the getAllAWSSecretsWithSdk function call at the end of the script and specify the output format ('json' or 'env'):

```javascript
// Uncomment the function you want to use and specify the output format ('json' or 'env')
// getAllAWSSecretsWithCli('json');
// getAllAWSSecretsWithCli('env');
// getAllAWSSecretsWithSdk('json');
getAllAWSSecretsWithSdk('env');
```

#### Running The Script
Run the script using Node.js:
```sh
node get_all_secret.js
```
</details>

<details>
<summary>Switch Profile AWS Configuration</summary>
### AWS Profile Configuration Guide
Follow step in the AWS Profile configuration guide
</details>
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Profile

You can find more information about the author of this project on their GitHub profile: [Lutfi Zain](https://github.com/lutfi-zain).
