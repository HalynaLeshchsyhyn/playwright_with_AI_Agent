---
name: github-mcp
description: 'Perform GitHub operations using the GitHub MCP server. Use when: "create branch", "push files to GitHub", "commit to GitHub", "create pull request", "create PR", "merge PR", "list branches", "create issue", "search repositories", "get file from GitHub", "update PR", "request review", "list repos".'
argument-hint: 'Describe the GitHub operation to perform: owner/repo, branch name, files to push, PR title/base/head, etc.'
---

# GitHub Operations via MCP

## When to Use

- Create a branch in a GitHub repository
- Push (commit) one or more files to a GitHub branch in a single commit
- Create, update, or merge a pull request
- Create or update a GitHub issue
- Search repositories, pull requests, or users
- Read file contents from a GitHub repository
- Request a Copilot code review on a PR

---

## Prerequisites

Before any GitHub operation:
1. **Ensure the GitHub MCP server is running** — see the section below.
2. **Load tools** — always call `tool_search` to load the required GitHub MCP tools before using them.
3. **Know the repo** — confirm `owner` (GitHub username or org) and `repo` (repository name).
4. **Know the branch** — confirm source branch (default: `main`) and target branch name.

> The GitHub MCP server is configured in `.vscode/mcp.json` as:
> ```json
> "github": { "type": "http", "url": "https://api.githubcopilot.com/mcp/" }
> ```

---

## Step 0 — Ensure the GitHub MCP Server Is Running

Before calling any `mcp_github_*` tool, verify the server is active. If a tool call returns
`"Tool ... is currently disabled by the user"` or `"Tool not found"`, the server is not running.

### How to detect

Attempt any lightweight call (e.g. `tool_search` with `"github list repositories"`).
If it fails with a disabled/not-found error, the server must be started first.

### How to start the server (VS Code UI)

1. Open the Command Palette: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
2. Type **"MCP: List Servers"** and press Enter
3. Find **`github`** in the list
4. Click **Start** (if stopped) or **Restart** (if in error state)
5. Wait for the status indicator to turn green / show "Running"
6. Return to the chat and retry the operation

### How to verify the server config exists

Check that `.vscode/mcp.json` contains the GitHub server entry:

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

If the entry is missing, add it and save the file, then follow the UI steps above.

### Troubleshooting

| Symptom | Fix |
|---|---|
| `"disabled by the user"` error | Enable via MCP panel → github → Start |
| `"Tool not found"` after tool_search | Server not running — start it via MCP panel |
| Server starts but tools still fail | Sign out and sign back into GitHub in VS Code (`Ctrl+Shift+P` → "GitHub: Sign Out") |
| `mcp.json` missing | Create `.vscode/mcp.json` with the config block above |

> **Note:** The GitHub MCP server uses your active VS Code GitHub session for authentication.
> You must be signed into GitHub in VS Code for it to work.

---

## Available Tools (load with `tool_search` before use)

| Tool | Purpose |
|---|---|
| `mcp_github_search_repositories` | Find repos by name/topic/language |
| `mcp_github_create_branch` | Create a new branch from an existing one |
| `mcp_github_list_branches` | List all branches in a repo |
| `mcp_github_push_files` | Push multiple files in a single commit |
| `mcp_github_get_file_contents` | Read a file or directory from a repo |
| `mcp_github_create_pull_request`* | Create a new pull request |
| `mcp_github_search_pull_requests` | Search PRs by query |
| `mcp_github_update_pull_request` | Update PR title, body, state, reviewers |
| `mcp_github_merge_pull_request` | Merge a PR (merge/squash/rebase) |
| `mcp_github_issue_write` | Create or update an issue |
| `mcp_github_list_releases` | List releases in a repo |
| `mcp_github_request_copilot_review` | Request a Copilot review on a PR |

> *`mcp_github_create_pull_request` — use `tool_search` with "github pull request create" to load it.

---

## Procedure

### Workflow A — Create Branch + Push Files + Open PR

This is the standard flow for committing local workspace changes to GitHub.

#### Step 0 — Verify server is running

Call `tool_search` with `"github list repositories"`. If it succeeds, the server is up.
If it fails, follow **"Step 0 — Ensure the GitHub MCP Server Is Running"** above before continuing.

#### Step 1 — Discover the repo

```
tool_search: "github list repositories"
mcp_github_search_repositories(query: "user:<owner>")
```

Confirm `owner` and `repo` values.

#### Step 2 — Create the branch

```
tool_search: "github create branch"
mcp_github_create_branch(
  owner: "<owner>",
  repo:  "<repo>",
  branch: "<new-branch>",
  from_branch: "main"          // source branch; omit to use repo default
)
```

#### Step 3 — Read file content

Use `read_file` (workspace tool) to get the current content of each file to push.
Read all needed files in **parallel** before calling `push_files`.

#### Step 4 — Push all files in one commit

```
tool_search: "github push files commit"
mcp_github_push_files(
  owner:   "<owner>",
  repo:    "<repo>",
  branch:  "<new-branch>",
  message: "<commit message>",
  files: [
    { path: "relative/path/file.ts", content: "<file content>" },
    { path: "another/file.ts",       content: "<file content>" },
    ...
  ]
)
```

**Important:**
- `path` is relative to the repo root (e.g. `tests/ui/signup.spec.ts`)
- `content` is the full plain-text file content (not base64)
- All files land in one commit — batch as many as possible
- New files are created; existing files are updated automatically

#### Step 5 — Create the pull request

```
tool_search: "github pull request create"
mcp_github_create_pull_request(   // or mcp_io_github_git_create_pull_request
  owner: "<owner>",
  repo:  "<repo>",
  title: "<PR title>",
  head:  "<new-branch>",
  base:  "main",
  body:  "<PR description>"
)
```

---

### Workflow B — Create / Update an Issue

```
tool_search: "github issues create update"
mcp_github_issue_write(
  method: "create",              // or "update"
  owner:  "<owner>",
  repo:   "<repo>",
  title:  "<issue title>",
  body:   "<issue description>",
  labels: ["bug", "enhancement"] // optional
)
```

For updates, also provide `issue_number` and the fields to change.

---

### Workflow C — Search Pull Requests

```
tool_search: "github search pull requests"
mcp_github_search_pull_requests(
  query: "repo:<owner>/<repo> is:open",
  owner: "<owner>",
  repo:  "<repo>"
)
```

Common query patterns:
- `is:open` / `is:closed` / `is:merged`
- `base:main` — PRs targeting `main`
- `head:<branch>` — PRs from a specific branch
- `author:<username>` — PRs by a specific author

---

### Workflow D — Merge a Pull Request

```
tool_search: "github merge pull request"
mcp_github_merge_pull_request(
  owner:        "<owner>",
  repo:         "<repo>",
  pullNumber:   <PR number>,
  merge_method: "squash"   // "merge" | "squash" | "rebase"
)
```

> ⚠️ Merging a PR is irreversible. Confirm PR number and base branch before proceeding.

---

### Workflow E — Request Copilot Review

```
tool_search: "github copilot review pull request"
mcp_github_request_copilot_review(
  owner:      "<owner>",
  repo:       "<repo>",
  pullNumber: <PR number>
)
```

---

### Workflow F — Read a File from GitHub

```
tool_search: "github get file contents"
mcp_github_get_file_contents(
  owner: "<owner>",
  repo:  "<repo>",
  path:  "path/to/file.ts",
  ref:   "main"              // branch, tag, or commit SHA (optional)
)
```

---

## Commit Message Conventions

Use this format for commit messages when pushing files:

```
<type>: <short summary>

<optional body — list of changes>
```

Types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`

Examples:
```
feat: add API test suite for user endpoints

- Add tests/api/user.api.spec.ts (TC-API-007 to TC-API-014)
- Add tests/api/support/UserApiClient.ts
- Add tests/fixtures/api.fixture.ts
```

```
refactor: move pages/ to project root

- Move tests/pages/ → pages/
- Update tests/fixtures/ecom.fixture.ts import paths
```

---

## Safety Rules

- **Never force-push** or reset branches via the API — use `push_files` which creates safe commits.
- **Confirm before merging** — always state the PR number and base branch to the user before calling `merge_pull_request`.
- **Do not push secrets** — check file contents for API keys, passwords, or tokens before pushing.
- Deleting branches or closing PRs requires explicit user confirmation.
