# Security Health Checker

An open-source, defensive website security health checker. It provides a web dashboard and a Linux-friendly CLI for safe, non-invasive checks.

## What it checks

- HTTPS availability
- SSL/TLS certificate information
- HTTP → HTTPS redirect behavior
- Security headers
- Cookie security flags
- Basic DNS information
- Basic performance indicators
- Security score, issues and recommendations
- PDF report generation
- Security Audit endpoint for the configured audit checks

> Only scan websites you own or are explicitly authorized to audit. This tool does not perform exploitation, brute force, or intrusive penetration testing.

## No system Node.js/npm required on Linux

The Linux launcher uses a **project-local portable Node.js runtime**. It does not install Node.js with `apt`, does not modify the system Node.js installation, and does not require `sudo` for the project setup.

On the first run, it downloads a compatible Node.js 22.x runtime into `.runtime/` and installs the project's npm dependencies locally.

## Run on Linux/Kali

```bash
git clone https://github.com/YOUR-USERNAME/security-health-checker.git
cd security-health-checker
chmod +x setup-linux.sh run.sh
./run.sh
```

Then open:

```text
http://localhost:5173
```

The API runs on:

```text
http://localhost:4000
```

### After the first setup

The portable Node.js runtime is kept inside the project. You can start the tool again with:

```bash
cd security-health-checker
./run.sh
```

No `npm install` command is needed manually.

## CLI

The CLI uses the same local Node.js runtime:

```bash
./.runtime/node/bin/node cli/index.js https://example.com
```

Or, after running `./run.sh` in the same shell environment, you can use the project's npm script:

```bash
./.runtime/node/bin/npm run scan -- https://example.com
```

## Requirements

A normal Linux installation should already have these basic utilities. The launcher checks for them:

- `curl`
- `tar`
- `python3`
- Internet access on the first run (to download Node.js and npm packages)

**No system Node.js/npm installation is required.**

## Windows

`setup-windows.bat` remains available for Windows users. Windows users can use their installed Node.js/npm or the existing Windows setup workflow.

## GitHub

Create a public repository named `security-health-checker`, push this project, and replace `YOUR-USERNAME` above with your GitHub username.

## Responsible use

Use the scanner only against systems you own or have permission to assess. The tool is intended for defensive visibility and configuration checking.
