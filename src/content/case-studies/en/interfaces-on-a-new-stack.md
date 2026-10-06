---
kind: "use-case"
name: "The API, the CLI and the MCP server"
title: "36 tools, 40 commands, four releases: a product's interfaces built on its new stack"
summary: "A product gets its public interfaces on the new stack: an MCP server, a CLI, an LLM agent."
intro: "A product gets its public interfaces on the new stack: an MCP server, a CLI, an LLM agent."
client: "B2B SaaS, lead extraction"
clientPage: "evaboot"
result: "36"
resultLabel: "MCP tools in production"
stats: [{"value": "36", "label": "MCP tools in production"}]
cover: {"src": "/assets/projects/evaboot/yeozsoqcr93m15jqq47s.webp", "alt": "The product's admin logs screen"}
when: "August 2026"
order: 2
status: "live"
review: "Drafted on 2026-09-30: the heading sentences. Check them, then delete this line."
---

## Situation | The product needed the layer users and machines touch.

The core was rebuilt, with a public API underneath, built mostly by the backend
engineer. The product needed the layer users and machines touch: a way for AI agents
to use it, a command line for power users, and an agent of its own on the data source.

## Task | Ship those interfaces without a second engineer.

Build and ship those interfaces on the new stack, with coding agents, without a
second engineer.

## Actions | An MCP server, a CLI and an agent.

- Built an MCP server that exposes the product to AI clients: 36 tools, across reads,
  writes, asynchronous jobs and extractions.
- Built a CLI of 40 commands, and shipped it through a release pipeline four times in
  one week (August 2026), each release verified end to end on a real machine.
- Built an LLM agent on the product's data source, with streamed answers and rate
  handling.
- Tested the whole surface against production with a real key: 35 of 36 MCP tools
  passed; the last one was left untested only because of its credit cost.
- Opened and merged pull requests on the core repository along the way, each one
  reviewed.

## Results | The MCP server and the CLI are in production.

- MCP server live in production (August 2026).
- CLI at v0.3.1 in production, installable with one command.
- Agent tools merged and deployed.

## What you get

An MCP server, a CLI and an agent on top of your API, in production, released
through a pipeline and reviewed like the rest of your code. One person builds and
ships that layer next to your backend engineer.
