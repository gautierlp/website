import os, sys, unittest
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))
import import_contra as ic

FIXTURE = os.path.join(os.path.dirname(__file__), "fixtures", "contra-sample.html")


class ConverterTest(unittest.TestCase):
    def setUp(self):
        with open(FIXTURE, encoding="utf-8") as f:
            self.html = f.read()

    def test_summary_and_title_come_from_ld_json(self):
        meta = ic.read_meta(self.html)
        self.assertEqual(meta["title"], "Sample title")
        self.assertEqual(meta["summary"], "A short summary.")

    def test_cover_id_comes_from_ld_json_image(self):
        meta = ic.read_meta(self.html)
        self.assertEqual(meta["cover"], "vfsv5mkpw30atiyquyfq")

    def test_blocks_become_markdown(self):
        md, assets = ic.blocks_to_markdown(self.html, "sample")
        self.assertIn("## Introduction", md)
        self.assertIn("First paragraph with **bold** and [a link](https://example.com).", md)
        self.assertIn("- **Item**: detail.", md)
        self.assertIn("### Core Challenges", md)
        self.assertIn("\n---\n", md)

    def test_media_paths_are_local(self):
        md, assets = ic.blocks_to_markdown(self.html, "sample")
        self.assertIn("![shot.png](/assets/projects/sample/img123.webp)", md)
        self.assertIn('<video controls muted playsinline src="/assets/projects/sample/vid456.mp4" poster="/assets/projects/sample/vid456.webp"></video>', md)
        urls = sorted(a["url"] for a in assets)
        self.assertEqual(urls, [
            "https://media.contra.com/image/upload/fl_progressive/q_auto:best/img123.webp",
            "https://media.contra.com/video/upload/fl_progressive/q_auto:best,w_700/vid456.mp4",
            "https://media.contra.com/video/upload/fl_progressive/q_auto:best,w_700/vid456.webp",
        ])

    def test_frontmatter_is_valid_yaml_via_json_strings(self):
        text = ic.frontmatter({"name": "A \"quoted\" name", "order": 3, "featured": True, "links": [{"label": "Site", "url": "https://x.y"}]})
        self.assertTrue(text.startswith("---\n"))
        self.assertIn('name: "A \\"quoted\\" name"', text)
        self.assertIn("order: 3\n", text)
        self.assertIn("featured: true\n", text)
        self.assertIn('links: [{"label": "Site", "url": "https://x.y"}]', text)


if __name__ == "__main__":
    unittest.main()
