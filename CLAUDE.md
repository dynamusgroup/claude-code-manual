# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-file static HTML reference guide — **"Manual Claude Code — Boas Práticas para Iniciantes"** — written in Brazilian Portuguese. No build system, package manager, or dependencies exist.

## File Structure

The entire project lives in `manual-claude-code.html`:

- **Hero** — title banner with badge and subtitle
- **TOC** (`.toc`) — 10-item navigation grid linking to section anchors
- **10 numbered `<section>` elements** — each with a `.section-header` (icon + title + subtitle) followed by cards, tables, code blocks, or tip boxes
- **Footer**

## CSS Conventions

All colors are defined as CSS custom properties in `:root` — never use raw hex values inline. Key tokens:

| Variable | Role |
|---|---|
| `--bg`, `--surface`, `--surface2` | Background layers |
| `--accent` (orange), `--accent2` (purple), `--accent3` (blue) | Brand accents |
| `--green`, `--red`, `--yellow` | Semantic status colors |
| `--text`, `--muted` | Foreground text |
| `--code-bg`, `--border` | Code blocks and borders |

## Reusable Component Patterns

- **`.tip.tip-{green|yellow|blue|red|purple}`** — alert box with icon + `<h4>` + `<p>`
- **`.badge.badge-{green|yellow|blue|purple|red}`** — inline pill label
- **`.card`** — surface card inside a `.grid`
- **`.grid-2` / `.grid-3`** — responsive auto-fill grids (minmax 300px / 240px)
- **`.table-wrap > table.cmd-table`** — styled command reference table
- **`.file-tree`** — monospace directory listing with `.ft-{dir|file|spec|env|doc|comment}` spans
- **Icon colors**: `.icon-{orange|purple|blue|green|red|yellow}` applied to `.section-icon`

## Content Language

All user-visible text is in **Brazilian Portuguese (pt-BR)**. Keep new content in pt-BR.

## No Build Steps

Open `manual-claude-code.html` directly in a browser to preview. There is no server, bundler, or test suite.
