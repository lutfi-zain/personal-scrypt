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
Follow step in the [AWS Profile configuration guide](switch%20profile%20aws%20configure.md)

</details>

<details>
<summary>Stored Procedure Downloader</summary>
# Stored Procedure Downloader

This script downloads all stored procedures from a specified MSSQL database and saves them into a folder named after the database. Each stored procedure is saved as a separate `.sql` file.

## Prerequisites

- Node.js installed on your machine.
- Sequelize ORM for Node.js.
- MSSQL database with stored procedures.

## Setup

1. Clone the repository or download the script.
2. Ensure you have Node.js installed. You can download it from [Node.js](https://nodejs.org/).
3. Install the required Node.js packages:

    ```sh
    npm install sequelize
    npm install tedious
    ```

4. Update the database connection configuration in the script with your database credentials:

    ```javascript
    const sequelize = new Sequelize('database', 'username', 'password', {
        host: 'localhost',
        dialect: 'mssql',
    });
    ```

## Usage

1. Open a terminal or command prompt.
2. Navigate to the directory where [`download_all_sp.js`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FD%3A%2FSiloam%2Fgithub_personal%2Fpersonal-scrypt%2Fdownload_all_sp.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%223434e071-071a-47e4-8a95-ee7d4a49e829%22%5D "d:\Siloam\github_personal\personal-scrypt\download_all_sp.js") is located.
3. Run the script using Node.js:

    ```sh
    node download_all_sp.js
    ```

4. The script will create a folder named after the database and save each stored procedure as a separate `.sql` file in that folder.

## Script Details

### download_all_sp.js

This script connects to an MSSQL database, retrieves all stored procedures from the [`dbo`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FD%3A%2FSiloam%2Fgithub_personal%2Fpersonal-scrypt%2Fdownload_all_sp.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A25%2C%22character%22%3A53%7D%7D%5D%2C%223434e071-071a-47e4-8a95-ee7d4a49e829%22%5D "Go to definition") schema, and writes each stored procedure to a separate `.sql` file in a folder named after the database.

### Database Connection Configuration

Update the following section in the script with your database credentials:

```javascript
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mssql',
});
```

### Folder Creation

The script ensures that a folder named after the database exists in the current directory. If the folder does not exist, it is created.

### Query Stored Procedures

The script queries the `INFORMATION_SCHEMA.ROUTINES` table to retrieve all stored procedures in the [`dbo`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FD%3A%2FSiloam%2Fgithub_personal%2Fpersonal-scrypt%2Fdownload_all_sp.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A25%2C%22character%22%3A53%7D%7D%5D%2C%223434e071-071a-47e4-8a95-ee7d4a49e829%22%5D "Go to definition") schema:

```sql
SELECT ROUTINE_NAME, ROUTINE_DEFINITION
FROM INFORMATION_SCHEMA.ROUTINES
WHERE ROUTINE_TYPE = 'PROCEDURE' AND ROUTINE_SCHEMA = 'dbo'
```

### Write Stored Procedures to Files

Each stored procedure is written to a separate `.sql` file in the folder named after the database. If the [`ROUTINE_DEFINITION`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FD%3A%2FSiloam%2Fgithub_personal%2Fpersonal-scrypt%2Fdownload_all_sp.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A35%2C%22character%22%3A48%7D%7D%5D%2C%223434e071-071a-47e4-8a95-ee7d4a49e829%22%5D "Go to definition") is `NULL`, a placeholder comment `'-- No definition available'` is written to the file.

### Error Handling and Cleanup

Errors are caught and logged. The database connection is closed in the [`finally`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FD%3A%2FSiloam%2Fgithub_personal%2Fpersonal-scrypt%2Fdownload_all_sp.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A43%2C%22character%22%3A6%7D%7D%5D%2C%223434e071-071a-47e4-8a95-ee7d4a49e829%22%5D "Go to definition") block to ensure it is always closed, even if an error occurs.

## Example Output

After running the script, you will find a folder named after the database in the same location as the script. Each stored procedure will be saved as a `.sql` file within this folder:

```
database_name/
├── procedure1.sql
├── procedure2.sql
├── procedure3.sql
...
```
</details>

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Profile

You can find more information about the author of this project on their GitHub profile: [Lutfi Zain](https://github.com/lutfi-zain).
