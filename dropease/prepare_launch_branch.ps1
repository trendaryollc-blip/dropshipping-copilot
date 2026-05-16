Param(
  [string]$BranchName = "launch-ready",
  [string]$CommitMessage = "chore: prepare project for launch (tests, README, Firestore mock, CI)"
)

Write-Host "Creating branch '$BranchName' and committing prepared changes..."

git fetch origin
git checkout -b $BranchName
git add -A
git commit -m $CommitMessage

Write-Host "Branch created and changes committed. To push and open a PR run:" -ForegroundColor Green
Write-Host "git push -u origin $BranchName"
