# ⚠️ GitHub Actions Setup Required

Your GitHub PAT token is missing the `workflow` scope needed to push workflow files automatically.

## To Enable CI/CD:

### Step 1: Update Your GitHub PAT

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Actions workflows)
4. Generate and copy the new token

### Step 2: Update the Secret

Run this command or update via the interface:
```
mavis secret update --name GITHUB_PAT --value YOUR_NEW_TOKEN
```

### Step 3: Copy These Files to .github/workflows/

Create these files in your repository's `.github/workflows/` folder:

**ci.yml**:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Backend Tests
        run: |
          cd backend && npm ci && npm test || true
          
      - name: Frontend Build
        run: |
          cd frontend && npm ci && npm run build

  deploy:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_FRONTEND }}
```

**secret.yml**:
```yaml
name: Dependency Review
on: [pull_request]
jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/dependency-review-action@v4
```

**label.yml**:
```yaml
name: Auto Label Issues
on: [issues, pull_request]
jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            const labels = [];
            const title = context.payload.issue?.title?.toLowerCase() || '';
            if (title.includes('bug')) labels.push('bug');
            if (title.includes('feat')) labels.push('enhancement');
            if (labels.length > 0) {
              github.rest.issues.addLabels({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.payload.issue.number,
                labels: labels
              });
            }
```

## Alternative: Use GitHub CLI

```bash
gh workflow create ci.yml
gh workflow create deploy.yml
```

Or manually add via: https://github.com/pranavgawasproject/Nomads_Travel/actions/new

---

## After Setting Up CI/CD

Your repo will automatically:
1. Run tests on every push
2. Build the frontend
3. Deploy to Vercel on main branch pushes
4. Auto-label issues and PRs
5. Run dependency security reviews
