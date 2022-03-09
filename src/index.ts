import { info, setFailed } from '@actions/core';
import { context } from '@actions/github';

import { bgColors, colors, styles } from './const';
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

    info(`${colors.yellow}👀 This PR tries to merge into ${baseBranch} from ${currentBranch}`);
    info(`${colors.yellow}   Let me check if it's heading to right direction... 🤔`);

    const { isValid, correctBaseBranch } = validateBranches({
      currentBranch,
      baseBranch,
    });

    if (isValid) {
      info(`${colors.green}✅ It is heading to right direction 👍`);
      return;
    }

    info(`${colors.red}🚫 The PR is heading to wrong direction.`);
    info(`${colors.yellow}   Switching base branch...🎯`);

    await switchBranch(correctBaseBranch);

    info(
      `${colors.green}✅ Base branch switched from ${colors.white}${bgColors.red}${styles.bold}${baseBranch}${styles.default}${colors.green} to ${colors.white}${bgColors.green}${styles.bold}${correctBaseBranch}${styles.default} 🎉`,
    );
  } catch (error: any) {
    setFailed(error.message);
  }
})();
