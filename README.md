# Security Health Checker

A defensive website security health checker for authorized security and configuration checks.

It provides a web dashboard and a Linux-friendly CLI for checking common website security settings without exploitation or intrusive penetration testing.

## What it checks

- HTTPS availability
- SSL/TLS certificate information
- HTTP → HTTPS redirect behavior
- Security headers
- Cookie security flags
- Basic DNS information
- Basic performance indicators
- Security score, issues, and recommendations
- PDF report generation
- Security Audit checks

> **Authorized use only:** Scan only websites that you own or have explicit permission to assess. This tool does not perform exploitation, brute force, or intrusive penetration testing.

---

## Quick Start — Linux / Kali Linux

### 1. Check that Git is installed

Most Kali installations already include Git. Test it with:

```bash
git --version
```

If Git is available, continue.

### 2. Clone the project

Replace `YOUR-USERNAME` with the GitHub account that owns the repository:

```bash
git clone https://github.com/YOUR-USERNAME/security-health-checker.git
```

Then enter the project directory:

```bash
cd security-health-checker
```

### 3. Make the launcher executable

```bash
chmod +x setup-linux.sh run.sh
```

### 4. Start the tool

```bash
./run.sh
```

That's it. **You do not need to run `npm install`, install Node.js with `apt`, or run `sudo apt full-upgrade` just to use this project.**

When setup finishes, open this address in your browser:

```text
http://localhost:5173
```

The local API runs on:

```text
http://localhost:4000
```

Press `Ctrl+C` in the terminal when you want to stop the tool.

---

## What happens on the first run?

The Linux launcher is designed for users who may not already have Node.js installed.

On the first run, `./run.sh`:

1. Detects your Linux CPU architecture.
2. Downloads a compatible Node.js 22.x runtime into the project's `.runtime/` folder.
3. Does **not** install Node.js into the operating system.
4. Does **not** use `apt` to install Node.js or npm.
5. Installs the project's npm packages locally using the downloaded runtime.
6. Starts the web dashboard and API.

The portable runtime remains inside the project so you can reuse it on later runs.

### Requirements for the first run

Your Linux system needs:

- Git — to clone the repository
- `curl` — to download the portable Node.js runtime
- `tar` — to extract it
- `python3` — used by the setup script to select the Node.js 22.x release
- Internet access — required on the first setup and when downloading npm packages

You **do not need system Node.js or npm**.

---

## Start the tool again

After the first successful setup:

```bash
cd security-health-checker
./run.sh
```

If the local runtime and dependencies are already present, setup will reuse them instead of installing them again.

---

## CLI usage

The project also includes a command-line scanner.

Run:

```bash
./.runtime/node/bin/node cli/index.js https://example.com
```

Or:

```bash
./.runtime/node/bin/npm run scan -- https://example.com
```

Replace `https://example.com` with a website you own or are authorized to assess.

---

## Windows

Windows users can use the included:

```text
setup-windows.bat
```

The Windows workflow uses the existing Windows Node.js/npm setup.

---

## Project structure

```text
security-health-checker/
├── cli/                 # Command-line scanner
├── server/              # Local API/server
├── scripts/             # Utility scripts
├── src/                 # Web application source
├── setup-linux.sh       # Linux portable setup
├── run.sh               # Linux launcher
├── setup-windows.bat    # Windows setup
├── package.json         # Project dependencies and scripts
└── README.md            # Documentation
```

The following are generated locally and should not be committed to GitHub:

```text
.runtime/
node_modules/
```

They are already covered by `.gitignore`.

---

## Troubleshooting

### `Permission denied` when running `./run.sh`

Run:

```bash
chmod +x setup-linux.sh run.sh
./run.sh
```

### `curl: command not found`

The launcher needs `curl` to download the portable Node.js runtime. Install `curl` using your normal Linux package manager, then run `./run.sh` again.

### The browser does not open automatically

Open this manually:

```text
http://localhost:5173
```

### Port 5173 or 4000 is already in use

Another application may already be using the required port. Stop that application or change the project's development/server configuration before starting the tool again.

### Setup fails while downloading Node.js

Check your internet connection and try:

```bash
./run.sh
```

The setup script downloads the portable runtime from the official Node.js distribution service.

---

## GitHub setup

If you are publishing this project yourself:

1. Create a GitHub repository named `security-health-checker`.
2. Upload/push the project files.
3. Keep `.runtime/` and `node_modules/` out of the repository.
4. Update the clone command in this README if your GitHub username or repository name is different.

Example:

```bash
git clone https://github.com/YOUR-USERNAME/security-health-checker.git
cd security-health-checker
chmod +x setup-linux.sh run.sh
./run.sh
```

---

## Responsible use

This project is intended for defensive security visibility and configuration checking.

Only use it against systems that you own or have explicit permission to assess. Do not use it to bypass security controls, perform unauthorized scanning, brute force accounts, exploit vulnerabilities, or access systems without authorization.

## License

Add the project's license here if you choose to distribute it under a specific open-source license.
