param(
    [Parameter(Mandatory=$true)]
    [string]$Message
)


function Invoke-Check {
    param(
        [string]$Name,
        [scriptblock]$Command
    )

    Write-Host "`nRunning $Name..." -ForegroundColor Cyan
    & $Command

    if($LASTEXITCODE -ne 0){
        Write-Host "`n$Name failed. Fix the issues above, then run ship again." -ForegroundColor Red
        Write-Host "Nothing was committed or pushed." -ForegroundColor Yellow
        exit 1
    }
    Write-Host "$Name passed." -ForegroundColor Green
}





$ErrorActionPreference = "Stop"

# --------------------------------------------------
# Step 1: Verify repository
# --------------------------------------------------

git rev-parse --is-inside-work-tree | Out-Null

$currentBranch = git branch --show-current

if ($currentBranch -ne "main") {
    Write-Host "You must start from main. Current branch: $currentBranch" -ForegroundColor Red
    exit 1
}

$status = git status --porcelain

if (-not $status) {
    Write-Host "No changes to ship." -ForegroundColor Yellow
    exit 1
}

if((npm pk get scripts.lint) -eq "{}"){
    Write-Host "No lint script found in package.json. Add one before shipping." -ForegroundColor Red
    exit 1
}

Invoke-Check "Next.js type generation" { npx next typegen }
Invoke-Check "Type check"              { npx tsc --noEmit }
Invoke-Check "Lint (0 warnings allowed)" { npm run lint -- --max-warnings=0 }



# --------------------------------------------------
# Step 2: Update main
# --------------------------------------------------

Write-Host "`nUpdating main..." -ForegroundColor Cyan

git pull --ff-only origin main

# --------------------------------------------------
# Step 3: Generate branch name
# --------------------------------------------------

$branchName = $Message.ToLower() `
    -replace '[^a-z0-9\s-]', '' `
    -replace '\s+', '-' `
    -replace '-+', '-'

$branchName = $branchName.Trim('-')

if ($branchName.Length -gt 50) {
    $branchName = $branchName.Substring(0, 50).Trim('-')
}

$branchName = "work/$branchName"

Write-Host "Creating branch: $branchName" -ForegroundColor Cyan

git switch -c $branchName

# --------------------------------------------------
# Step 4: Commit changes
# --------------------------------------------------

Write-Host "`nStaging changes..." -ForegroundColor Cyan

git add .

Write-Host "`nChanges to commit:" -ForegroundColor Cyan

git status --short

Write-Host "`nCreating commit..." -ForegroundColor Cyan

git commit -m $Message

# --------------------------------------------------
# Step 5: Push branch
# --------------------------------------------------

Write-Host "`nPushing branch..." -ForegroundColor Cyan

git push -u origin $branchName

# --------------------------------------------------
# Step 6: Create Pull Request
# --------------------------------------------------

Write-Host "`nCreating Pull Request..." -ForegroundColor Cyan

$prUrl = gh pr create `
    --base main `
    --head $branchName `
    --title $Message `
    --body "Automated PR created by .scripts/ship.ps1."

Write-Host "`nPull Request created:" -ForegroundColor Green
Write-Host $prUrl

# --------------------------------------------------
# Step 7: Wait for CI
# --------------------------------------------------
Write-Host "`nWaiting for CI..." -ForegroundColor Cyan

# Give GitHub a moment to register the checks
Start-Sleep -Seconds 10

gh pr checks $branchName --watch

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nCI failed. PR left open: $prUrl" -ForegroundColor Red
    Write-Host "You are currently on: $branchName" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nCI passed." -ForegroundColor Green

# --------------------------------------------------
# Step 8: Check mergeability
# --------------------------------------------------

Write-Host "`nChecking for merge conflicts..." -ForegroundColor Cyan

$mergeable = gh pr view $branchName --json mergeable --jq ".mergeable"

if ($mergeable -eq "CONFLICTING") {
    Write-Host "`nMerge conflict detected." -ForegroundColor Red
    Write-Host "The PR was not merged." -ForegroundColor Yellow
    Write-Host "Resolve the conflict manually, then merge the PR." -ForegroundColor Yellow
    exit 1
}

if ($mergeable -eq "UNKNOWN") {
    Write-Host "`nGitHub has not finished determining mergeability." -ForegroundColor Yellow
    Write-Host "The PR was not merged automatically." -ForegroundColor Yellow
    exit 1
}

Write-Host "No merge conflicts detected." -ForegroundColor Green

# --------------------------------------------------
# Step 9: Ask before merge
# --------------------------------------------------

$merge = Read-Host "`nMerge this PR now? (y/N)"

if ($merge -ne "y") {
    Write-Host "`nPR left open." -ForegroundColor Yellow
    Write-Host "You are currently on: $branchName" -ForegroundColor Yellow
    exit 0
}

# --------------------------------------------------
# Step 10: Merge PR
# --------------------------------------------------

Write-Host "`nMerging PR..." -ForegroundColor Cyan

gh pr merge $branchName `
    --squash `
    --delete-branch

Write-Host "`nPR merged successfully." -ForegroundColor Green

# --------------------------------------------------
# Step 11: Return to main
# --------------------------------------------------

Write-Host "`nReturning to main..." -ForegroundColor Cyan

git switch main

git pull --ff-only origin main

Write-Host "`nDone." -ForegroundColor Green
Write-Host "Current branch: $(git branch --show-current)" -ForegroundColor Cyan