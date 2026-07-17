# Permanent Project Safety Instructions

These rules apply universally to all agents performing coding, debugging, or configuration tasks in this workspace.

## 1. Project Path Validation
* **Rule**: Before executing any terminal command, read operation, or edit, verify the current working directory (CWD) and active project path.
* **Verified Active Project Folder**: `/Users/emelerturk/Site_Local/BLACK PRINCESS& WHITE PRINCE`
* **Boundary Constraint**: Work only inside the verified active project folder. Stop and ask for clarification immediately if the active file or project path is uncertain.

## 2. Directory and File Safeguards
* **Rule**: Never modify backup, archived, copied, legacy, experimental, or debug files unless explicitly approved.
* **Rule**: Never modify generated vendor libraries unless the task explicitly requires it.
* **Rule**: When multiple files match a task, report all candidates first and wait for approval before choosing one.
* **Rule**: Do not refactor, reorganize, reformat, or clean unrelated code unless explicitly requested. Keep changes as small and localized as possible.

## 3. Workflow Protocol
* **Rule**: Always follow the "inspect, report, plan, approve, execute" cycle.
  1. **Inspection**: Inspect files first to understand the landscape.
  2. **Reporting**: Report findings and layout considerations.
  3. **Planning**: Propose a structured, minimal, and explicit implementation plan.
  4. **Approval**: Wait for explicit user approval before editing.
  5. **Selective Editing**: Modify only the specific files approved for the active task.
* **Rule**: Before making any edits, identify exactly which files will be modified and explain why each file is required for the task.

## 4. Git and Deployment Restrictions
* **Rule**: Restrict destructive and state-changing actions.
  - **No Unapproved Reverts**: Do not use `git checkout`, `git restore`, `git reset`, or other destructive commands on files/branches without explicit approval.
  - **No Unapproved Commits**: Do not run `git commit` without separate explicit approval.
  - **No Unapproved Pushes**: Do not run `git push` without separate explicit approval.
  - **No Unapproved Deployments**: Do not deploy the code or run production build bundles without separate explicit approval.

## 5. Verification and Integrity
* **Rule**: Validate all changes transparently and verify test status honestly.
  - After making changes, show syntax/test results (e.g. via Node.js compiler syntax checkers), the `git diff` summary, and the `git status`.
  - Never claim a test or verification passed if the testing tool could not actually be run in the current environment (e.g. browser subagents failing on macOS due to OS restrictions).
