const { exec } = require("child_process");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

// Function to execute shell commands
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { shell: true }, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Function to clone all repositories from an organization
async function cloneAllReposFromOrg(org) {
  try {
    // Fetch the list of repositories
    const reposListCommand = `gh repo list ${org} --json name --jq ".[].name"`;
    const repos = await executeCommand(reposListCommand);
    const repoNames = repos.split("\n").filter(Boolean);

    // Clone each repository
    for (const repo of repoNames) {
      const cloneCommand = `gh repo clone ${org}/${repo}`;
      console.log(`Cloning ${repo}...`);
      await executeCommand(cloneCommand);
      console.log(`${repo} cloned successfully.`);
    }
  } catch (error) {
    console.error(error);
  }
}

// Function to hard reset all repositories to a specific branch
async function hardResetAllReposToBranch(branch) {
  try {
    // Read the list of directories in the current working directory
    const directories = fs
      .readdirSync(process.cwd(), { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const repo of directories) {
      const repoPath = path.join(process.cwd(), repo);
      const resetCommand = `cd ${repoPath} && git fetch origin && git reset --hard origin/${branch}`;
      console.log(`Resetting ${repo} to branch ${branch}...`);
      await executeCommand(resetCommand);
      console.log(`${repo} reset to branch ${branch} successfully.`);
    }
  } catch (error) {
    console.error(error);
    mainMenu();
  }
}

// Function to search repositories with a keyword
async function searchReposWithKeyword(org, keyword) {
  try {
    const searchCommand = `gh repo list ${org} --json name --jq ".[].name"`;
    const repos = await executeCommand(searchCommand);
    const repoNames = repos.split("\n").filter(Boolean);

    // Filter repositories by keyword
    const filteredRepoNames = repoNames.filter((repo) =>
      repo.includes(keyword)
    );

    if (filteredRepoNames.length === 0) {
      console.log(`No repositories found with keyword "${keyword}".`);
      return;
    }

    console.log(`Found repositories with keyword "${keyword}":`);
    filteredRepoNames.forEach((repo) => console.log(repo));

    // Ask if the user wants to clone all searched repositories
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      "Do you want to clone all these repositories? (y/n): ",
      async (answer) => {
        if (answer.toLowerCase() === "y") {
          for (const repo of filteredRepoNames) {
            const cloneCommand = `gh repo clone ${org}/${repo}`;
            console.log(`Cloning ${repo}...`);
            await executeCommand(cloneCommand);
            console.log(`${repo} cloned successfully.`);
          }
        } else {
          console.log("No repositories were cloned.");
        }
        rl.close();
        mainMenu();
      }
    );
  } catch (error) {
    console.error(error);
    mainMenu();
  }
}

// Function to remove node_modules folder in all searched local repositories
async function removeNodeModules(filteredDirectories) {
  try {
    for (const repo of filteredDirectories) {
      const repoPath = path.join(process.cwd(), repo, "node_modules");
      if (fs.existsSync(repoPath)) {
        console.log(`Removing node_modules in ${repo}...`);
        await fs.promises.rm(repoPath, { recursive: true, force: true });
        console.log(`node_modules removed in ${repo}.`);
      } else {
        console.log(`No node_modules folder found in ${repo}.`);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Function to list local folder repositories and ask for action
async function listLocalReposByKeyword(keyword) {
  try {
    // Read the list of directories in the current working directory
    const directories = fs
      .readdirSync(process.cwd(), { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    // Filter directories by keyword
    const filteredDirectories = directories.filter((repo) =>
      repo.includes(keyword)
    );

    if (filteredDirectories.length === 0) {
      console.log(`No local repositories found with keyword "${keyword}".`);
      return;
    }

    console.log(`Local repositories with keyword "${keyword}":`);
    filteredDirectories.forEach((repo) => console.log(repo));

    // Ask if the user wants to reset, fetch, or remove node_modules
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      "Do you want to reset to a specific branch, fetch the latest changes, or remove node_modules? (r=reset; f=fetch; d=delete node_modules): ",
      async (action) => {
        if (action.toLowerCase() === "r") {
          rl.question("Enter the branch name to reset to: ", async (branch) => {
            for (const repo of filteredDirectories) {
              const repoPath = path.join(process.cwd(), repo);
              const resetCommand = `cd ${repoPath} && git fetch origin && git reset --hard origin/${branch}`;
              console.log(`Resetting ${repo} to branch ${branch}...`);
              await executeCommand(resetCommand);
              console.log(`${repo} reset to branch ${branch} successfully.`);
            }
            rl.close();
            mainMenu();
          });
        } else if (action.toLowerCase() === "f") {
          for (const repo of filteredDirectories) {
            const repoPath = path.join(process.cwd(), repo);
            const fetchCommand = `cd ${repoPath} && git fetch origin`;
            console.log(`Fetching latest changes for ${repo}...`);
            await executeCommand(fetchCommand);
            console.log(`${repo} fetched successfully.`);
          }
          rl.close();
          mainMenu();
        } else if (action.toLowerCase() === "d") {
          await removeNodeModules(filteredDirectories);
          rl.close();
          mainMenu();
        } else {
          console.log("Invalid action. Please try again.");
          rl.close();
          mainMenu();
        }
      }
    );
  } catch (error) {
    console.error(error);
    mainMenu();
  }
}

// Interactive CLI menu using readline
function mainMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("What do you want to do?");
  console.log("1. Clone all repositories from organization");
  console.log("2. Hard reset all repositories to specific branch");
  console.log("3. Search repositories with keyword");
  console.log("4. List local repositories and perform actions");
  console.log("5. Search local repositories by keyword and perform actions");
  console.log("6. Exit");

  rl.question("Enter your choice: ", async (choice) => {
    switch (choice) {
      case "1":
        rl.question("Enter the organization name: ", async (org) => {
          await cloneAllReposFromOrg(org);
          rl.close();
          mainMenu();
        });
        return;
      case "2":
        rl.question("Enter the branch name to reset to: ", async (branch) => {
          await hardResetAllReposToBranch(branch);
          rl.close();
          mainMenu();
        });
        return;
      case "3":
        rl.question("Enter the keyword to search for: ", async (keyword) => {
          await searchReposWithKeyword("siloamhospitals", keyword);
          rl.close();
          mainMenu();
        });
        return;
      case "4":
        await listLocalReposByKeyword("");
        break;
      case "5":
        rl.question("Enter the keyword to search for: ", async (keyword) => {
          await listLocalReposByKeyword(keyword);
        });
        return;
      case "6":
        console.log("Goodbye!");
        rl.close();
        process.exit(0);
        return;
      default:
        console.log("Invalid choice. Please try again.");
    }

    // Show the menu again after an action is completed
    rl.close();
    mainMenu();
  });
}

// Start the interactive menu
mainMenu();
