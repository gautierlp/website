#!/usr/bin/env python3
"""One-off copy of the 4 case-study drafts from the freelance repository.

Run: python3 scripts/import_use_cases.py
The drafts stay the source; run again after they change.
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.expanduser("~/projects/personal/freelance/docs/case-studies")
OUT = os.path.join(ROOT, "src", "content", "use-cases", "en")

USE_CASES = [
    dict(slug="no-code-exit", file="01-no-code-exit.md", name="The no-code exit", order=1,
         summary="A B2B SaaS leaves Bubble for Django: the full map of the app, and the data moved with no downtime.",
         result="200k", resultLabel="users migrated, no downtime", projects=["evaboot"]),
    dict(slug="interfaces-on-a-new-stack", file="02-interfaces-on-a-new-stack.md", name="The API, the CLI and the MCP server", order=2,
         summary="A product gets its public interfaces on the new stack: an MCP server, a CLI, an LLM agent.",
         result="36", resultLabel="MCP tools in production", projects=["evaboot"]),
    dict(slug="marketing-site-migration", file="03-marketing-site-migration.md", name="The marketing site migration", order=3,
         summary="A nine-language site moves off WordPress to Astro and Sanity in two weeks, no downtime.",
         result="100", resultLabel="Lighthouse performance and SEO", projects=["evaboot"]),
    dict(slug="internal-applications", file="04-internal-applications-industrial-group.md", name="Internal applications", order=4,
         summary="Three internal applications for the same industrial group, one a year, all still in use.",
         result="3", resultLabel="internal apps, same client", projects=["fleetnova", "eco-insight", "eco-link"]),
]


def split_draft(text):
    title = re.match(r"# (.+)", text).group(1).strip()
    body = text[text.index("## Situation"):]
    return title, body


def frontmatter(fields):
    return "---\n" + "\n".join(f"{k}: {json.dumps(v, ensure_ascii=False)}" for k, v in fields.items()) + "\n---\n"


def main():
    os.makedirs(OUT, exist_ok=True)
    for u in USE_CASES:
        with open(os.path.join(SRC, u["file"]), encoding="utf-8") as f:
            title, body = split_draft(f.read())
        fields = {"name": u["name"], "title": title, "summary": u["summary"], "result": u["result"],
                  "resultLabel": u["resultLabel"], "projects": u["projects"], "order": u["order"], "status": "draft"}
        with open(os.path.join(OUT, u["slug"] + ".md"), "w", encoding="utf-8") as f:
            f.write(frontmatter(fields) + "\n" + body)
        print(u["slug"])


if __name__ == "__main__":
    main()
