#!/usr/bin/env python3
"""One-off import of the 8 Contra case studies into src/content/projects/en/.

Run: python3 scripts/import_contra.py
A second run overwrites the same files. Standard library only.
"""
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "content", "projects", "en")
ASSETS = os.path.join(ROOT, "public", "assets", "projects")
CONTRA = "https://contra.com/p/"
IMG = "https://media.contra.com/image/upload/fl_progressive/q_auto:best/{uid}.webp"
VID = "https://media.contra.com/video/upload/fl_progressive/q_auto:best,w_700/{uid}.{ext}"
UA = {"User-Agent": "Mozilla/5.0 (lepoher.co import script)"}

# Data that the Contra page does not give: taken from the Carrd page on 2026-09-28.
PROJECTS = [
    dict(slug="evaboot", name="Evaboot", client="Evaboot", order=1, featured=True,
         contra="sllAZU3M-scaling-evaboot-from-dollar1-m-to-dollar2-m-arr-with-bubble",
         logo="/assets/images/image30.png", result="From $1M to $2M+", resultLabel="ARR",
         links=[{"label": "Website", "url": "https://evaboot.com/"}],
         useCases=["no-code-exit", "interfaces-on-a-new-stack", "marketing-site-migration"],
         images=[{"src": "/assets/videos/video01.mp4", "alt": "User dashboard"},
                 {"src": "/assets/images/image06.jpg", "alt": "Admin dashboard"},
                 {"src": "/assets/images/image20.jpg", "alt": "Stripe integration"}],
         highlights=[
             {"text": "Evaboot had reached $1M ARR but faced challenges scaling due to technical debt and operational bottlenecks. JB, one of the founders, was deeply involved in development, limiting his ability to focus on growth.", "image": "/assets/videos/video01.mp4", "caption": "User dashboard"},
             {"text": "Evaboot needed to scale from $1M to $2M ARR but was struggling with a Bubble app burdened by technical debt, ongoing bugs, and security concerns. JB's involvement in app development made it difficult for him to prioritize strategic business tasks.", "image": "/assets/images/image06.jpg", "caption": "Admin dashboard"},
             {"text": "Over the course of a year, I worked closely with JB to take over the technical management of the app. This included refactoring the codebase to eliminate technical debt, resolving critical bugs, enhancing security, improving the user experience, and integrating third-party tools like Stripe and Segment. These efforts allowed JB to delegate technical responsibilities and focus on scaling the business.", "image": "/assets/images/image20.jpg", "caption": "Stripe integration"},
             {"text": "By optimizing the app and streamlining operations, Evaboot successfully reached its goal of $2M ARR. The technical improvements enabled the company to grow efficiently, while JB could concentrate on strategic growth initiatives.", "image": "", "caption": ""},
         ],
         quote={"text": "Gautier expertly used Bubble.io to support our projects, delivering effective solutions and overcoming obstacles. Impressed by their precision and ability to handle project challenges, we trust in their skills and will use them again for future Bubble.io projects.", "who": "JB Jézéquel", "role": "Co-Founder, Evaboot"}),
    dict(slug="disko-leads", name="Disko Leads", client="Disko Leads", order=2, featured=True,
         contra="7XZENP72-connecting-bubble-with-a-google-chrome-extension",
         logo="/assets/images/image31.png", result="From 0 to $3k", resultLabel="MRR",
         links=[], useCases=[],
         images=[{"src": "/assets/images/image21.jpg", "alt": "User dashboard"},
                 {"src": "/assets/images/image05.jpg", "alt": "Pricing page"},
                 {"src": "/assets/images/image03.jpg", "alt": "Chrome extension"}],
         highlights=[
             {"text": "Disko Leads, founded by Johary, aimed to create an app that could extract and enrich the profiles of users who liked or commented on LinkedIn posts, generating valuable lead data for businesses.", "image": "/assets/images/image21.jpg", "caption": "User dashboard"},
             {"text": "Johary needed a solution that would allow users to extract and enrich LinkedIn profiles from any post, generate detailed CSVs, and manage credits and payments efficiently. The project had to be completed from scratch and delivered quickly.", "image": "/assets/images/image03.jpg", "caption": "Chrome extension"},
             {"text": "Over three weeks, I developed a chrome extension and a web app using Bubble.io and JavaScript. The extension added a button to LinkedIn posts, which redirected users to the Disko Leads platform. There, users could apply filters (e.g., industry, role, company size) and generate enriched CSVs with public LinkedIn information, enhanced through RapidAPI. The platform also handled user credits, payments (via Stripe), CSV management, and provided an admin interface for overseeing users and exports. Additionally, I integrated SendGrid for emails and Google Sheets for data visualization.", "image": "/assets/images/image05.jpg", "caption": "Pricing page"},
             {"text": "The app successfully launched, going from 0 to $3k MRR in a short period. Users benefited from a streamlined lead extraction process, and Disko Leads now had a scalable platform for managing both users and data exports.", "image": "", "caption": ""},
         ],
         quote={"text": "Working with Gautier on our SaaS project was an exceptional experience. His mastery of Bubble.io allowed us to quickly bring our vision to life, and the final product exceeded our expectations. Highly recommended!", "who": "Johary Randria", "role": "Founder, Disko Leads"}),
    dict(slug="folderly", name="Folderly", client="Folderly", order=3, featured=True,
         contra="rMAU733P-developing-folderlys-bubble-app-from-0-to-600-users",
         logo="/assets/images/image32.png", result="$1.6M+", resultLabel="ARR, backed by Google Startups",
         links=[{"label": "Product Hunt", "url": "https://www.producthunt.com/products/folderly#outreach-academy-by-folderly/"},
                {"label": "Google Startups", "url": "https://blog.google/around-the-globe/google-europe/25-new-startup-recipients-of-the-ukraine-support-fund/"}],
         useCases=[],
         images=[{"src": "/assets/images/image18.jpg", "alt": "Landing hero"},
                 {"src": "/assets/images/image04.jpg", "alt": "Mobile version"},
                 {"src": "/assets/images/image09.jpg", "alt": "Tablet version"},
                 {"src": "/assets/images/image26.jpg", "alt": "Laptop version"}],
         highlights=[
             {"text": "Folderly, a B2B email deliverability SaaS, sought to develop the Outreach Academy, a comprehensive, free course designed for professionals using cold email to drive sales.", "image": "/assets/images/image18.jpg", "caption": "Landing hero"},
             {"text": "Folderly needed a fully responsive, user-friendly platform for delivering their course content across multiple devices. The platform required robust functionality, including customizable modules, lessons, tests, and autonomous content management for admins. Seamless integration with tools like HubSpot and SendGrid was essential for enhancing user engagement and automating processes.", "image": "/assets/images/image04.jpg", "caption": "Mobile version"},
             {"text": "Within three weeks, I developed and delivered a fully responsive and bug-free application that worked flawlessly on desktop, tablet, and mobile devices. The platform included a flexible course system where admins could easily add, edit, and manage content. I also integrated HubSpot for marketing automation and SendGrid for email communications, ensuring a smooth experience for both administrators and users.", "image": "/assets/images/image26.jpg", "caption": "Laptop version"},
             {"text": "Folderly's Outreach Academy launched successfully, attracting more than 600 students in the first few weeks. The platform empowered admins to manage course content autonomously and engage effectively with users. The project was delivered on time, fully functional, and positioned as a valuable free resource for sales professionals using cold email.", "image": "", "caption": ""},
         ],
         quote={"text": "I'd like to highlight the incredible experience we've had. The intuitive interface and robust features have significantly simplified our email management.", "who": "Inna Ozymai", "role": "Sales, Belkins Data Enrich"}),
    dict(slug="fleetnova", name="Fleetnova", client="Automotive recycling group", order=4,
         contra="QEkXbAbv-building-a-marketplace-for-second-hand-auto-parts-with-bubble",
         logo="", useCases=["internal-applications"]),
    dict(slug="camarage", name="Camarage", client="Camarage", order=5,
         contra="m26vFMLv-migrating-a-1000-user-app-from-code-to-bubble",
         logo="/assets/images/image34.png"),
    dict(slug="eco-insight", name="Eco'Insight", client="Automotive recycling group", order=6,
         contra="eZU2FPM7-streamlining-multi-actor-recycling-operations-with-bubble",
         logo="", useCases=["internal-applications"]),
    dict(slug="eco-link", name="Eco'link", client="Automotive recycling group", order=7,
         contra="MmEbmmlR-streamlining-dealership-onboarding-with-bubble",
         logo="", useCases=["internal-applications"]),
    dict(slug="clean-car", name="Clean Car", client="Clean Car", order=8,
         contra="l3XmWqBY-launching-a-bubble-app-on-app-store-and-google-play",
         logo="/assets/images/image14.png"),
    dict(slug="price-writers", name="Price Writers", client="Price Writers", order=9, logo="/assets/images/image15.png"),
    dict(slug="betc", name="BETC", client="BETC", order=10, logo="/assets/images/image16.png"),
    dict(slug="protech", name="Protech", client="Protech", order=11, logo="/assets/images/image11.png"),
]

BLOCK = re.compile(r'<div class="bn-block-content" data-content-type="(\w+)"([^>]*)>')
INLINE = re.compile(r'<div class="bn-inline-content">(.*?)</div>', re.S)


def attr(attrs, name):
    m = re.search(name + r'="([^"]*)"', attrs)
    return html.unescape(m.group(1)) if m else ""


def inline_to_md(fragment):
    """Keep bold, italic and links. Drop every other tag."""
    s = re.sub(r"<strong>(.*?)</strong>", r"**\1**", fragment, flags=re.S)
    s = re.sub(r"<em>(.*?)</em>", r"*\1*", s, flags=re.S)
    s = re.sub(r'<a [^>]*href="([^"]*)"[^>]*>(.*?)</a>', r"[\2](\1)", s, flags=re.S)
    s = re.sub(r"<br\s*/?>", " ", s)
    s = re.sub(r"<[^>]+>", "", s)
    return html.unescape(re.sub(r"\s+", " ", s)).strip()


def heading_text(text):
    return text.capitalize() if text.isupper() else text


def read_meta(page):
    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', page, re.S)
    article = json.loads(m.group(1))["@graph"][0]
    return {"title": article.get("headline", ""), "summary": article.get("description", "")}


def blocks_to_markdown(page, slug):
    """Return (markdown, assets). assets: [{url, path}] to download."""
    out, assets = [], []
    matches = list(BLOCK.finditer(page))
    for i, m in enumerate(matches):
        kind, attrs = m.group(1), m.group(2)
        end = matches[i + 1].start() if i + 1 < len(matches) else len(page)
        seg = page[m.end():end]
        inline = INLINE.search(seg)
        text = inline_to_md(inline.group(1)) if inline else ""
        if kind == "heading":
            level = int(attr(attrs, "data-level") or "2")
            out.append("#" * level + " " + heading_text(text.replace("**", "")))
        elif kind == "paragraph":
            if text:
                out.append(text)
        elif kind == "bulletListItem":
            out.append("- " + text)
        elif kind == "divider":
            out.append("---")
        elif kind == "image":
            uid, name = attr(attrs, "data-uid"), attr(attrs, "data-name") or "image"
            local = f"/assets/projects/{slug}/{uid}.webp"
            assets.append({"url": IMG.format(uid=uid), "path": local})
            out.append(f"![{name}]({local})")
        elif kind == "video":
            uid = attr(attrs, "data-uid")
            mp4, poster = f"/assets/projects/{slug}/{uid}.mp4", f"/assets/projects/{slug}/{uid}.webp"
            assets.append({"url": VID.format(uid=uid, ext="mp4"), "path": mp4})
            assets.append({"url": VID.format(uid=uid, ext="webp"), "path": poster})
            out.append(f'<video controls muted playsinline src="{mp4}" poster="{poster}"></video>')
    return "\n\n".join(out) + "\n", assets


def frontmatter(fields):
    lines = ["---"]
    for key, value in fields.items():
        lines.append(f"{key}: {json.dumps(value, ensure_ascii=False)}")
    lines.append("---")
    return "\n".join(lines) + "\n"


def fetch(url):
    """Fetch a URL. On an HTTP error, retry once after 5 seconds, then let it raise."""
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
            return r.read()
    except urllib.error.HTTPError as e:
        print(f"  fetch failed ({e.code}) for {url}, retrying in 5s", file=sys.stderr)
        time.sleep(5)
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
            return r.read()


def download(assets):
    for a in assets:
        target = os.path.join(ROOT, "public", a["path"].lstrip("/"))
        os.makedirs(os.path.dirname(target), exist_ok=True)
        if os.path.exists(target):
            continue
        with open(target, "wb") as f:
            f.write(fetch(a["url"]))
        print("  downloaded", a["path"])


def build_entry(p):
    fields = {
        "name": p["name"], "client": p["client"], "logo": p.get("logo", ""),
        "summary": "", "result": p.get("result", ""), "resultLabel": p.get("resultLabel", ""),
        "links": p.get("links", []), "useCases": p.get("useCases", []),
        "featured": p.get("featured", False), "order": p["order"], "status": "draft",
        "images": p.get("images", []), "highlights": p.get("highlights", []),
    }
    if "quote" in p:
        fields["quote"] = p["quote"]
    body = ""
    if "contra" in p:
        page = fetch(CONTRA + p["contra"]).decode("utf-8")
        meta = read_meta(page)
        fields["summary"] = meta["summary"] or meta["title"] or p["name"]
        fields["status"] = "live"
        body, assets = blocks_to_markdown(page, p["slug"])
        download(assets)
        body = f"# {meta['title']}\n\n" + body
    else:
        fields["summary"] = p["name"]
    return frontmatter(fields) + "\n" + body


def main():
    os.makedirs(OUT, exist_ok=True)
    for p in PROJECTS:
        print(p["slug"])
        with open(os.path.join(OUT, p["slug"] + ".md"), "w", encoding="utf-8") as f:
            f.write(build_entry(p))
    print("done:", len(PROJECTS), "files")


if __name__ == "__main__":
    main()
