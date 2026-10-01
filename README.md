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

## No login or pricing

This repository is designed as a free, self-hosted/open-source tool. There is **no account, login, subscription, or payment system required**.

If you later want to turn it into a commercial SaaS, you can add authentication and a hosted pricing layer separately without changing the open-source CLI.

## Requirements

- Node.js 18+
- npm

## Important: install dependencies first

If you see `vite is not recognized` or `concurrently is not recognized`, it means the project dependencies have not been installed yet. Run `npm install` once inside the project folder.

On Windows, you can double-click `setup-windows.bat`. On Linux/macOS, run `./setup-linux.sh`.

## Run on Linux

```bash
git clone https://github.com/YOUR-USERNAME/security-health-checker.git
cd security-health-checker
npm install
```

### Web app

Development mode:

```bash
npm run dev:all
```

Then open `http://localhost:5173`.

Production-style local run:

```bash
npm run build
node server.js
```

Then open `http://localhost:4000`.

### CLI

After `npm install`, run:

```bash
npm run scan -- https://example.com
```

Or install the local package command:

```bash
npm link
security-health-checker https://example.com
```


## Responsible use

Use the scanner only against systems you own or have permission to assess. The tool is intended for defensive visibility and configuration checking.
