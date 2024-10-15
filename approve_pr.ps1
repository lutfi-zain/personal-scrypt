# Define the path to the PR list file
$prListPath = "prlist.txt"

# Regular expression to match any URL
$urlPattern = "(https?://[^\s]+)"

# Read the file and extract lines that contain URLs
$prLinks = Get-Content $prListPath | ForEach-Object {
    if ($_ -match $urlPattern) {
        $matches[0]
    }
}

# Save the cleaned URLs back to the file
$prLinks | Set-Content $prListPath

# Approve each PR using GitHub CLI
foreach ($link in $prLinks) {
    Write-Host "Approving PR: $link"
    gh pr review $link --approve
}