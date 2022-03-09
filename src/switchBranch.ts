import { getInput, setFailed } from '@actions/core';
import { context, getOctokit } from '@actions/github';

interface Args {
  from: string;
  to?: string;
}

export const switchBranch = async ({ from, to }: Args) => {
  if (!to) {
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
    base: to,
  });

  const reviewBody =
    '🚫 This PR was heading to wrong direction. Base branch switched from`' +
    from +
    '` to `' +
    to +
    '` automatically. 🤗';

  await octokit.rest.pulls.createReview({
    ...payload,
    body: reviewBody,
  });
};
