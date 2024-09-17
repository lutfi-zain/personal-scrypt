const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

async function getAllAWSSecretsWithCli(outputFormat = 'json') {
    try {
        console.log("Getting all AWS Secrets with CLI");

        // Ensure the "secrets" directory exists
        const secretsDir = path.join(__dirname, 'secrets');
        if (!fs.existsSync(secretsDir)) {
            fs.mkdirSync(secretsDir);
        }

        let secretsList = [];
        let nextToken = null;

        // List all secrets using AWS CLI with pagination
        do {
            const listSecretsCommand = `aws secretsmanager list-secrets --region ap-southeast-3 ${nextToken ? `--next-token ${nextToken}` : ''}`;
            const listSecretsResponse = await execCommand(listSecretsCommand);
            const parsedResponse = JSON.parse(listSecretsResponse);
            secretsList = secretsList.concat(parsedResponse.SecretList);
            nextToken = parsedResponse.NextToken;
        } while (nextToken);

        if (secretsList.length === 0) {
            console.log("No secrets found");
            return null;
        }

        const secrets = {};

        for (const secret of secretsList) {
            if (secret.Name) {
                try {
                    console.log("Retrieving secret for ", secret.Name);
                    const getSecretValueCommand = `aws secretsmanager get-secret-value --secret-id ${secret.Name} --region ap-southeast-3`;
                    const getSecretValueResponse = await execCommand(getSecretValueCommand);
                    const secretValue = JSON.parse(getSecretValueResponse).SecretString;

                    if (secretValue) {
                        // Parse JSON from secret string
                        const secretValueJson = JSON.parse(secretValue);
                        secrets[secret.Name] = secretValueJson;

                        // Write each secret to a file
                        const filePath = path.join(secretsDir, `${secret.Name}.${outputFormat}`);
                        if (outputFormat === 'json') {
                            fs.writeFileSync(filePath, JSON.stringify(secretValueJson, null, 2));
                        } else if (outputFormat === 'env') {
                            const envContent = Object.entries(secretValueJson)
                                .map(([key, value]) => `${key}=${value}`)
                                .join('\n');
                            fs.writeFileSync(filePath, envContent);
                        }
                        console.log(`Secret ${secret.Name} written to ${filePath}`);
                    }
                } catch (error) {
                    console.log(`Error retrieving secret ${secret.Name}: ${error}`);
                }
            }
        }

        console.log("All AWS Secrets retrieved successfully");
        return secrets;
    } catch (error) {
        console.log(JSON.stringify(error), " <<<< err on getting all AWS Secrets");
        return null;
    }
}

async function getAllAWSSecretsWithSdk(outputFormat = 'json') {
    try {
        console.log("Getting all AWS Secrets with SDK");

        // Ensure the "secrets" directory exists
        const secretsDir = path.join(__dirname, 'secrets');
        if (!fs.existsSync(secretsDir)) {
            fs.mkdirSync(secretsDir);
        }

        AWS.config.update({
            region: 'ap-southeast-3',
        });
        const secretsManager = new AWS.SecretsManager();
        const secrets = {};

        let secretsList = [];
        let nextToken = null;

        // List all secrets with pagination
        do {
            const listSecretsResponse = await secretsManager.listSecrets({ NextToken: nextToken }).promise();
            secretsList = secretsList.concat(listSecretsResponse.SecretList);
            nextToken = listSecretsResponse.NextToken;
        } while (nextToken);

        if (secretsList.length === 0) {
            console.log("No secrets found");
            return null;
        }

        for (const secret of secretsList) {
            if (secret.Name) {
                try {
                    console.log("Retrieving secret for ", secret.Name);
                    const getSecretValueResponse = await secretsManager.getSecretValue({ SecretId: secret.Name }).promise();
                    const secretValue = getSecretValueResponse.SecretString;

                    if (secretValue) {
                        // Parse JSON from secret string
                        const secretValueJson = JSON.parse(secretValue);
                        secrets[secret.Name] = secretValueJson;

                        // Write each secret to a file
                        const filePath = path.join(secretsDir, `${secret.Name}.${outputFormat}`);
                        if (outputFormat === 'json') {
                            fs.writeFileSync(filePath, JSON.stringify(secretValueJson, null, 2));
                        } else if (outputFormat === 'env') {
                            const envContent = Object.entries(secretValueJson)
                                .map(([key, value]) => `${key}=${value}`)
                                .join('\n');
                            fs.writeFileSync(filePath, envContent);
                        }
                        console.log(`Secret ${secret.Name} written to ${filePath}`);
                    }
                } catch (error) {
                    console.log(`Error retrieving secret ${secret.Name}: ${error}`);
                }
            }
        }

        console.log("All AWS Secrets retrieved successfully");
        return secrets;
    } catch (error) {
        console.log(JSON.stringify(error), " <<<< err on getting all AWS Secrets");
        return null;
    }
}

function execCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`exec error: ${error}`);
                return;
            }
            if (stderr) {
                reject(`stderr: ${stderr}`);
                return;
            }
            resolve(stdout);
        });
    });
}

// Uncomment the function you want to use and specify the output format ('json' or 'env')
// getAllAWSSecretsWithCli('json');
// getAllAWSSecretsWithCli('env');
// getAllAWSSecretsWithSdk('json');
getAllAWSSecretsWithSdk('env');