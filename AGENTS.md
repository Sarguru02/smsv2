# Agent Instructions

## Git Workflow

**NEVER commit changes.** The user will handle all git commits. Do not mutate the git repository state (no git add, git commit, etc).

## Terminal Commands

Never use `| tail` or `| head` - run commands directly in terminal so the user can see output in real-time. Use command_status to check results after.

Always use `git --no-pager` for git commands that produce output (e.g. `git --no-pager diff`, `git --no-pager log`). The default pager will hang.

## GitHub Issues

Always write issue body to a `.md` file first, then use `gh issue create --body-file`. Do not pass the body inline — long bodies break in the shell.

```bash
# Write body to temp file, then:
git issue create --title "Issue Title" --body-file /tmp/issue-body.md
```
