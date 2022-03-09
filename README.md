# Check branches on PR

- This action makes sure the current branch tries to merge into the right base branch on pull request
- **What's right** is based on [git-flow branching strategy](https://nvie.com/posts/a-successful-git-branching-model/)

## Inputs

| Name              | Required | Description                                | Default     |
| ----------------- | -------- | ------------------------------------------ | ----------- |
| `githubToken`     | ✅       | Github Token that has access to repository | -           |
| `mainBranch`      |          | Branch name for production releases        | `"main"`    |
| `devBranch`       |          | Branch name for development                | `"develop"` |
| `featureBranch`   |          | Branch name prefix for feature             | `"feature"` |
| `releaseBranch`   |          | Branch name prefix for release             | `"release"` |
| `hotfixBranch`    |          | Branch name prefix for hotfix              | `"hotfix"`  |
| `prefixSeparator` |          | Branch name prefix separator               | `"/"`       |

## Example usage

```yaml
on: [pull_request]

jobs:
  check_branches_on_pr:
    runs-on: ubuntu-latest
    name: Check Branches on PR
    steps:
      - name: Check Branches on PR
        uses: kwanwooi25/pr-to-right-branch@v0.1
        with:
          githubToken: ${{ secrets.GITHUB_TOKEN }}
```
