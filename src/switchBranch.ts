import { getInput, setFailed } from '@actions/core';
import { context, getOctokit } from '@actions/github';

export const switchBranch = async (correctBaseBranch?: string) => {
  if (!correctBaseBranch) {
    setFailed('Need a correct base branch to switch');
  }

  const githubToken = getInput('githubToken', { required: true });
  const octokit = getOctokit(githubToken);
  const payload = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: Number(context.payload.pull_request?.number),
  };

  await octokit.rest.pulls.update({
    ...payload,
    base: correctBaseBranch,
  });
};
