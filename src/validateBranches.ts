import { getInput, info } from '@actions/core';

interface Args {
  currentBranch: string;
  baseBranch: string;
}

interface ReturnValues {
  isValid: boolean;
  correctBaseBranch?: string;
}

export const validateBranches = ({ currentBranch, baseBranch }: Args): ReturnValues => {
  const mainBranch = getInput('mainBranch');
  const devBranch = getInput('devBranch');
  const featureBranch = getInput('featureBranch');
  const releaseBranch = getInput('releaseBranch');
  const hotfixBranch = getInput('hotfixBranch');
  const prefixSeparator = getInput('prefixSeparator');

  const currentBranchPrefix = currentBranch.split(prefixSeparator)[0];
  const baseBranchPrefix = baseBranch.split(prefixSeparator)[0];

  if (currentBranchPrefix === featureBranch) {
    const isValid = [devBranch, featureBranch].includes(baseBranchPrefix);
    return {
      isValid,
      correctBaseBranch: isValid ? undefined : devBranch,
    };
  }

  if ([releaseBranch, hotfixBranch].includes(currentBranchPrefix)) {
    const isValid = baseBranch === mainBranch;
    return {
      isValid,
      correctBaseBranch: isValid ? undefined : mainBranch,
    };
  }

  return { isValid: true };
};
