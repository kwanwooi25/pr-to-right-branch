import { info, setFailed } from '@actions/core';
import { context } from '@actions/github';

import { switchBranch } from './switchBranch';
import { validateBranches } from './validateBranches';

declare const process: {
  env: {
    GITHUB_HEAD_REF: string;
    GITHUB_BASE_REF: string;
  };
};

(async () => {
  try {
    if (context.eventName !== 'pull_request' || !context.payload.pull_request) {
      setFailed('🚫 This action is only available for pull requests.');
    }

    const currentBranch = process.env.GITHUB_HEAD_REF;
    const baseBranch = process.env.GITHUB_BASE_REF;

    info(`This PR tries to merge into ${baseBranch} from ${currentBranch}`);
    info(`Let me check if it's heading to right direction... 🤔`);

    const { isValid, correctBaseBranch } = validateBranches({
      currentBranch,
      baseBranch,
    });

    if (isValid) {
      info(`✅ This PR is heading to right direction 👍`);
      return;
    }

    info(`
      🚫 This PR is heading to wrong direction.
      Switching base branch...🎯
    `);

    await switchBranch({
      from: baseBranch,
      to: correctBaseBranch,
    });

    info(`✅ Base branch switched to ${correctBaseBranch} 👍`);
  } catch (error: any) {
    setFailed(error.message);
  }
})();
