"""Extract the editorial content from the legacy blog into clean JSON.

The legacy site is plain HTML.  We keep the article body, normalise a few
legacy helper classes, add heading IDs, and generate a table of contents so
the new Astro site can render the same content without carrying across the
old layout or inline CSS.
"""

from __future__ import annotations

import html
import json
import re
import unicodedata
from pathlib import Path

from lxml import html as lxml_html
from lxml import etree

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "source-blog" / "blog"
OUT = Path(__file__).resolve().parents[1] / "src" / "data" / "articles.json"

# Editorial metadata that is nicer to hand-curate than to derive from the old
# (sometimes very long) meta descriptions.
META = {
    "cara-setting-google-spreadsheet-dan-mengambil-sheet-id": {
        "category": "Automation",
        "excerpt": "Membuat spreadsheet, mengatur akses, dan mengambil Sheet ID/GID untuk n8n dan workflow automation.",
        "cover": "google-sheets-setup.webp",
        "featured": False,
    },
    "mengenal-dasar-generative-ai": {
        "category": "AI Fundamentals",
        "excerpt": "LLM, token, context window, embeddings, dan hallucination — fondasi yang perlu dipahami sebelum membangun apa pun dengan AI.",
        "cover": "generative-ai-basics.webp",
        "featured": True,
    },
    "membuat-dashboard-live-monitoring-server-ubuntu": {
        "category": "Server Monitoring",
        "excerpt": "Membangun console monitoring real-time untuk CPU, RAM, disk, jaringan, dan keamanan server dengan Node.js + Apache.",
        "cover": "server-watch-dashboard.webp",
        "featured": True,
    },
    "cara-instalasi-llm-server-spek-kecil": {
        "category": "AI Local LLM",
        "excerpt": "Menjalankan model AI lokal di VPS kecil tanpa GPU — cara memilih model yang muat dan tetap responsif.",
        "cover": "llm-server-spek-kecil.webp",
        "featured": True,
    },
    "cara-instalasi-openclaw-di-ubuntu": {
        "category": "AI Assistant",
        "excerpt": "Memasang AI assistant pribadi di Ubuntu dan menjalankannya sebagai layanan yang selalu aktif.",
        "cover": "openclaw-ubuntu-blog-cover.webp",
        "featured": False,
    },
    "cara-membuat-lagu-ai-suno-spotify": {
        "category": "AI Music",
        "excerpt": "Dari konsep dan lirik hingga distribusi Spotify — workflow lengkap merilis lagu AI.",
        "cover": "suno-ai.webp",
        "featured": True,
    },
    "workflow-membuat-film-cinematic-dengan-ai": {
        "category": "AI Filmmaking",
        "excerpt": "Dari premis dan storyboard hingga color grading: workflow 12 langkah membuat film dengan AI.",
        "cover": "cinematic-ai.webp",
        "featured": True,
    },
    "membangun-ai-automation-dengan-n8n": {
        "category": "AI Automation",
        "excerpt": "Menghubungkan LLM, Telegram, Google Sheets, dan API dalam workflow automation yang siap produksi.",
        "cover": "n8n.webp",
        "featured": False,
    },
}


def repair_mojibake(value: str) -> str:
    """Repair the double-encoded UTF-8 found in several legacy pages."""
    if not any(marker in value for marker in ("â€", "â†", "Ã", "Â")):
        return value
    for encoding in ("cp1252", "latin-1"):
        try:
            repaired = value.encode(encoding).decode("utf-8")
        except (UnicodeEncodeError, UnicodeDecodeError):
            continue
        if repaired.count("â") < value.count("â"):
            return repaired
    return value


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    value = re.sub(r"[^\w\s-]", "", value.lower())
    return re.sub(r"[-\s]+", "-", value).strip("-")


def text_of(node) -> str:
    return re.sub(r"\s+", " ", " ".join(node.itertext())).strip()


def clean_article(body):
    # Legacy table of contents and "back to home" button are replaced by the
    # new site's reading UI.
    for node in body.xpath('.//div[contains(@class,"toc")]'):
        node.drop_tree()
    for node in body.xpath(".//center"):
        node.drop_tree()

    # Convert legacy callout blocks.
    for node in body.xpath('.//div[contains(@class,"card")]'):
        node.set("class", "callout")
        node.tag = "aside"

    for node in body.xpath('.//ul[contains(@class,"question-list")]'):
        node.set("class", "clean-list")
    for node in body.xpath('.//ul[contains(@class,"stack-list")]'):
        node.set("class", "clean-list")

    # Normalise tables, links and code blocks.
    for node in body.xpath(".//table"):
        node.set("class", "data-table")
    for node in body.xpath(".//a"):
        href = node.get("href") or ""
        if href.startswith("http") and "nanjarbudiman.com" not in href:
            node.set("target", "_blank")
            node.set("rel", "noopener noreferrer")
        if href in {"/", "index.html"}:
            node.drop_tree()
    for node in body.xpath(".//pre"):
        node.set("class", "code-block")
        if len(node) == 0:
            code = etree.SubElement(node, "code")
            code.text = node.text
            node.text = ""

    # Remove presentational attributes left over from the old theme.
    for node in body.xpath(".//*[@class]"):
        cls = node.get("class", "")
        keep = [c for c in cls.split() if c in {"callout", "clean-list", "data-table", "code-block", "demo-btn"}]
        if keep:
            node.set("class", " ".join(keep))
        else:
            node.attrib.pop("class", None)

    # Stable, human-readable anchors for every section and subsection.
    used: dict[str, int] = {}
    toc = []
    for node in body.xpath(".//h2|.//h3"):
        label = text_of(node)
        if not label:
            continue
        base = slugify(label)
        count = used.get(base, 0)
        used[base] = count + 1
        anchor = base if count == 0 else f"{base}-{count + 1}"
        node.set("id", anchor)
        if node.tag == "h2":
            toc.append({"label": label, "id": anchor, "level": 2})

    # A stray link-only paragraph from the old footer.
    for p in body.xpath(".//p"):
        if not text_of(p):
            p.drop_tree()

    return body, toc


def main() -> None:
    articles = []
    for index_file in sorted(SOURCE.glob("*/index.html")):
        slug = index_file.parent.name
        raw = index_file.read_text(encoding="utf-8", errors="replace")
        raw = repair_mojibake(raw)
        doc = lxml_html.fromstring(raw)
        body = doc.xpath('//main[contains(@class,"article")]')
        if not body:
            raise RuntimeError(f"No article body found in {index_file}")
        body = body[0]
        h1 = text_of(doc.xpath("//h1")[0])
        meta_description = (doc.xpath('//meta[@name="description"]/@content') or [""])[0]
        published = re.search(r'"datePublished"\s*:\s*"([^"]+)"', raw)
        date = published.group(1) if published else "2026-01-01"

        cover = META.get(slug, {}).get("cover", f"{slug}.webp")
        category = META.get(slug, {}).get("category")
        if not category:
            badge = doc.xpath('//span[contains(@class,"badge")]/text()')
            category = badge[0].strip() if badge else "Journal"

        body, toc = clean_article(body)
        inner = "".join(
            etree.tostring(child, encoding="unicode", method="html")
            for child in body
        )
        # `lxml` serialises non-ASCII safely, but normalise entities that came
        # from the old theme.
        inner = inner.replace("<center>", "").replace("</center>", "")

        plain = re.sub(r"<[^>]+>", " ", inner)
        plain = html.unescape(re.sub(r"\s+", " ", plain)).strip()
        words = len(plain.split())
        reading_time = max(3, round(words / 210))

        article = {
            "slug": slug,
            "title": h1,
            "description": META.get(slug, {}).get("excerpt") or meta_description,
            "metaDescription": meta_description,
            "category": category,
            "date": date,
            "cover": cover,
            "featured": META.get(slug, {}).get("featured", False),
            "readingTime": reading_time,
            "wordCount": words,
            "toc": toc,
            "html": inner,
        }
        articles.append(article)

    articles.sort(key=lambda item: item["date"], reverse=True)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(articles, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(articles)} articles to {OUT}")
    for article in articles:
        print(f"  {article['date']}  {article['readingTime']:>2} min  {article['title']}")


if __name__ == "__main__":
    main()
