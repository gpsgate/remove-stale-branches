import * as github from "@actions/github";
import * as core from "@actions/core";
import { removeStaleBranches } from "./removeStaleBranches";
import { DEFAULT_MESSAGE } from "./messages";

export const DEFAULT_PROTECTED_BRANCHES = "^(master|main)$";

async function run(): Promise<void> {
  const githubToken = core.getInput("github_token", { required: true });
  const octokit = github.getOctokit(githubToken);
  const isDryRun = core.getBooleanInput("dry_run", { required: false });
  const protectedOrganizationName = core.getInput("exempt-organization", {
    required: false,
  });
  const protectedBranchesRegex =
    core.getInput("exempt-branches-regex", { required: false }) ||
    DEFAULT_PROTECTED_BRANCHES;
  const protectedAuthorsRegex = core.getInput("exempt-authors-regex", {
    required: false,
  });
  const staleCommentMessage =
    core.getInput("stale-branch-message", { required: false }) ||
    DEFAULT_MESSAGE;
  const daysBeforeBranchStale =
    Number.parseInt(
      core.getInput("days-before-branch-stale", { required: false })
    ) || 90;
  const daysBeforeBranchDelete =
    Number.parseInt(
      core.getInput("days-before-branch-delete", { required: false })
    ) || 7;
  const operationsPerRun =
    Number.parseInt(core.getInput("operations-per-run", { required: false })) ||
    10;

  return removeStaleBranches(octokit, {
    isDryRun,
    repo: github.context.repo,
    daysBeforeBranchStale,
    daysBeforeBranchDelete,
    staleCommentMessage,
    protectedBranchesRegex,
    protectedAuthorsRegex,
    protectedOrganizationName,
    operationsPerRun,
  });
}

run();
