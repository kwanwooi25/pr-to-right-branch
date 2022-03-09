import { getInput } from '@actions/core';
import { context, getOctokit } from '@actions/github';

interface Args {
  from: string;
  to?: string;
}

export const switchBranch = async ({ from, to }: Args) => {
  if (to) {
    throw new Error('Need a correct base branch to switch');
  }

  const repoToken = getInput('repoToken', { required: true });
  const octokit = getOctokit(repoToken);
  const payload = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: Number(context.payload.pull_request?.number),
  };

  await octokit.rest.pulls.update({
    ...payload,
    base: to,
  });

  await octokit.rest.pulls.createReviewComment({
    ...payload,
    body:
      '🚫 This PR was heading to wrong direction. Base branch switched from `' +
      from +
      '` to `' +
      to +
      '` automatically. 🤗',
  });
};
