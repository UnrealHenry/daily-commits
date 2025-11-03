# Daily GitHub Commits

Automatically maintain your GitHub contribution streak with daily commits featuring random quotes and interesting facts.

## Features

- **Automated Daily Commits**: Uses GitHub Actions to commit every day
- **Random Content**: Alternates between inspirational quotes and interesting facts
- **Zero Maintenance**: Runs entirely in the cloud, no local setup required
- **Customizable**: Easy to modify schedule and content

## Setup Instructions

### 1. Create a New GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Name your repository (e.g., `daily-commits`)
3. Make it **Public** or **Private** (your choice)
4. **Do NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

### 2. Push This Code to Your Repository

```bash
cd daily-github-commits
git init
git add .
git commit -m "Initial commit: Setup daily commit automation"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

### 3. Enable GitHub Actions

1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. If prompted, click "I understand my workflows, go ahead and enable them"
4. The workflow will now run automatically every day at 9:00 AM UTC

### 4. Test the Automation

To test without waiting for the scheduled time:

1. Go to your repository on GitHub
2. Navigate to "Actions" tab
3. Click on "Daily Commit" workflow
4. Click "Run workflow" dropdown
5. Click the green "Run workflow" button

You should see a new commit appear in your repository within a minute!

## How It Works

1. **Scheduled Execution**: GitHub Actions runs the workflow every day at 9:00 AM UTC
2. **Content Generation**: The script fetches either a random quote or fact from free APIs
3. **File Update**: New content is added to `daily-content.md` with timestamp
4. **Automatic Commit**: Changes are committed and pushed automatically

## Customization

### Change the Schedule

Edit `.github/workflows/daily-commit.yml` and modify the cron schedule:

```yaml
schedule:
  - cron: '0 9 * * *'  # Daily at 9:00 AM UTC
```

Cron format: `minute hour day month weekday`

Examples:
- `0 0 * * *` - Midnight UTC
- `0 12 * * *` - Noon UTC
- `0 */6 * * *` - Every 6 hours
- `0 9 * * 1-5` - 9 AM UTC, Monday-Friday only

### Modify Content Type

Edit `commit.js`:
- Change `Math.random() > 0.5` to `Math.random() > 0.7` for more quotes
- Change it to `Math.random() > 0.3` for more facts
- Set to `true` for only quotes or `false` for only facts

### Use Different APIs

The script currently uses:
- **Quotes**: [Quotable API](https://api.quotable.io/)
- **Facts**: [Useless Facts API](https://uselessfacts.jsph.pl/)

You can modify the `fetchQuote()` or `fetchFact()` functions to use different APIs.

## Local Testing

Test the script locally before pushing:

```bash
cd daily-github-commits
node commit.js
```

This will generate content and update the file locally.

## Troubleshooting

### Workflow Not Running

- Check the "Actions" tab is enabled in your repository settings
- Ensure the repository is not empty (has at least one commit)
- Verify the workflow file is in `.github/workflows/` directory

### Permission Errors

If you see permission errors:
1. Go to Settings → Actions → General
2. Under "Workflow permissions"
3. Select "Read and write permissions"
4. Save

### API Failures

The script will exit with an error if API calls fail. GitHub Actions will show the error in the workflow logs.

## License

MIT

## Contributing

Feel free to fork and customize for your needs!
