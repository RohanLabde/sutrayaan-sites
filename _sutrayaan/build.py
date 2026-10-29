"""Builds sutrayaan.com from templates.

Usage:  python3 _sutrayaan/build.py            (draft: pages carry noindex)
        python3 _sutrayaan/build.py --live     (for sutrayaan.com: indexable, plus sitemap and robots)

Output goes to sutrayaan/ (the Render publish folder). Shared styles and scripts
live in sutrayaan/assets/ and are edited directly there.
"""
import hashlib, pathlib, sys
from jinja2 import Environment, FileSystemLoader, select_autoescape

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "_sutrayaan"
OUT = ROOT / "sutrayaan"
LIVE = "--live" in sys.argv

WA = "https://wa.me/919967555168?text=Hi%20Sutrayaan%2C%20I%27d%20like%20a%20free%20website%20audit."
WA_ICON = "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"

NAV = [("work", "Work", "/work/"), ("services", "Services", "/services/"), ("about", "About", "/about/"), ("contact", "Contact", "/contact/")]

PAGES = [
    dict(key="home", path="/", tpl="home.html.j2",
         title="Sutrayaan · Websites for Manufacturers in Mumbai",
         desc="Websites and enquiry tracking for Indian manufacturers. CNC, plastics, chemicals and packaging. Free website audit in 24 hours."),
    dict(key="work", path="/work/", tpl="work.html.j2",
         title="Manufacturing Website Examples · Sutrayaan",
         desc="Live demo websites for CNC, plastics, chemicals and packaging companies, each with a working quote form and enquiry tracker."),
    dict(key="services", path="/services/", tpl="services.html.j2",
         title="Website Packages and Prices · Sutrayaan",
         desc="Factory websites from ₹30,000, enquiry tracking and monthly care. Fixed quotes, and you own your domain and site."),
    dict(key="audit", path="/audit/", tpl="audit.html.j2",
         title="Free Website Audit for Manufacturers · Sutrayaan",
         desc="Get a free review of your factory's website in 24 hours, with three fixes that bring in more enquiries."),
    dict(key="audit", path="/audit/sample/", tpl="audit_sample.html.j2",
         title="Sample Website Audit for a Manufacturer · Sutrayaan",
         desc="See a full example of Sutrayaan's free website audit: scores, 13 checks, and three fixes with a fixed price."),
    dict(key="about", path="/about/", tpl="about.html.j2",
         title="About Sutrayaan · Mumbai",
         desc="Sutrayaan connects Indian manufacturers to their buyers with websites and enquiry systems built in their industry's language."),
    dict(key="contact", path="/contact/", tpl="contact.html.j2",
         title="Contact Sutrayaan · WhatsApp and Email",
         desc="WhatsApp +91 99675 55168 or email rohan@sutrayaan.com. Serving Mumbai, Thane, Navi Mumbai, Palghar, Bhiwandi and Pune."),
]

DEMOS = [
    dict(name="Meru Precision Components", host="meru.sutrayaan.com", industry="CNC machining", place="Thane",
         img="1666634157070-6fd830fb5672", kicker="Precision engineering · Thane", headline="CNC components, made to ±0.005 mm.",
         cta="Send a drawing", btn_bg="#43B4A6", btn_ink="#06201C",
         shows=["Spec tables with tolerances and materials", "A dimensioned engineering drawing", "Drawing upload on the quote form"],
         try_="Attach a drawing to a quote request, then find it in the tracker."),
    dict(name="Polyvasa Moulding Works", host="polyvasa.sutrayaan.com", industry="Plastic injection moulding", place="Vasai",
         img="1730705788367-dbd288c40ee7", kicker="Injection moulding · Vasai", headline="Moulded parts that fit first time.",
         cta="Send a part drawing", btn_bg="#7C9CFF", btn_ink="#0A1230",
         shows=["Press range by tonnage, from 80 T to 650 T", "An in-house tool room", "A quote form that asks about the mould"],
         try_="Ask for a quote that needs a new mould, then find it in the tracker."),
    dict(name="Orvella Fine Chemicals", host="orvella.sutrayaan.com", industry="Specialty chemicals", place="Taloja MIDC",
         img="1765218933298-dc55fdfb517a", kicker="Fine chemicals · Taloja MIDC", headline="Fine chemicals. Consistent, batch after batch.",
         cta="Request a quote", btn_bg="#5DB4F0", btn_ink="#04213A",
         shows=["A product catalogue with CAS numbers", "A sample Certificate of Analysis", "Requests for samples and SDS"],
         try_="Request an SDS for a product from the catalogue."),
    dict(name="Bhiwandi Boxworks", host="boxworks.sutrayaan.com", industry="Corrugated packaging", place="Bhiwandi",
         img="1766040923580-16ad32fae8b4", kicker="Corrugated packaging · Bhiwandi", headline="Boxes that protect your product and your brand.",
         cta="Get box pricing", btn_bg="#FF7A3D", btn_ink="#2A0E00",
         shows=["Box styles and board grades", "A box dieline with dimensions", "A quote form with box size, ply and print colours"],
         try_="Price a 5-ply box with two-colour print."),
]
for d in DEMOS:
    d["try"] = d.pop("try_")

PACKAGES = [
    dict(name="Website", price="From ₹30,000", ready="2–3 weeks",
         items=["6–8 pages written in your industry's terms", "Product and capability pages", "Quote form with drawing or file upload",
                "Works on every phone", "Google Business Profile set up", "Domain and hosting set up in your company's name"]),
    dict(name="Enquiry tracker", price="From ₹10,000", offer="Free with a website · launch offer", ready="3–5 days",
         items=["Every enquiry saved to your Google Sheet", "Instant email alert", "Status from New to Won", "Monthly enquiry report"]),
    dict(name="Monthly care", price="From ₹3,000 a month", ready="Ongoing",
         items=["Text and photo updates", "Backups and uptime checks", "Monthly report and a 30-minute call"]),
    dict(name="CRM and automation", price="Ask us", soon=True, ready="Ask us",
         items=["CRM set up for your sales team", "WhatsApp alerts", "Quote templates"]),
]

CHECKS = [
    ("Loads in under 3 seconds on 4G", "Fail", "7.8 seconds. The home page banner image alone is 4.2 MB."),
    ("Readable on a phone without zooming", "Fail", "The site is a desktop layout shrunk to fit. Body text renders at about 9 px."),
    ("One tap to call or WhatsApp", "Partial", "The phone number is shown as an image, so it can't be tapped."),
    ("Products and capabilities listed", "Fail", "One line: \u201call types of precision CNC turned components\u201d. No part examples."),
    ("Machine list", "Fail", "Not shown. Buyers can't tell your capacity or largest job size."),
    ("Materials and tolerances", "Fail", "Not mentioned anywhere on the site."),
    ("Certifications shown", "Partial", "\u201cISO certified\u201d in the footer, with no certificate number or scope."),
    ("Quote form", "Fail", "None. Only an email address on the Contact page."),
    ("Drawing upload", "Fail", "Not possible without a quote form."),
    ("Secure site (https)", "Pass", "Certificate is valid."),
    ("Google Business Profile", "Partial", "Listed, but 3 photos, no opening hours and the wrong category (\u201cHardware store\u201d)."),
    ("Found for \u201cCNC machining Thane\u201d", "Fail", "Not on the first two pages of Google results."),
    ("Same address and phone everywhere", "Partial", "The website and Google profile show different phone numbers."),
]

FIXES = [
    dict(title="Show what you make, and how well",
         why="Buyers shortlist suppliers in minutes. If they can't see parts, materials, tolerances and machines, they move to the next site.",
         do="A capabilities page with your machine list, materials, tolerances and industries served, plus 8\u201310 photos of real parts from one plant visit.",
         impact="High", time="2 weeks"),
    dict(title="Replace the email address with a quote form",
         why="Engineers send drawings. With only an email address, many never write, and the ones who do wait days for a reply.",
         do="A quote form with drawing upload and a WhatsApp button. Every request lands in your Google Sheet with an instant alert, so nothing is missed.",
         impact="High", time="3\u20135 days"),
    dict(title="Fix your Google Business Profile",
         why="Many buyers search \u201cCNC machining near me\u201d and call straight from Google Maps without opening a website.",
         do="Correct the category to \u201cMachine shop\u201d, add hours, services and 20 plant photos, match the phone number with your website, and ask five customers for reviews.",
         impact="Medium", time="2 days"),
]


def main():
    ver = hashlib.md5(((OUT / "assets/site.css").read_bytes() + (OUT / "assets/site.js").read_bytes())).hexdigest()[:8]
    env = Environment(loader=FileSystemLoader(str(SRC / "templates")), autoescape=select_autoescape(["j2", "html"]), trim_blocks=False)
    for p in PAGES:
        html = env.get_template(p["tpl"]).render(page=p, checks=CHECKS, fixes=FIXES, nav=NAV, demos=DEMOS, packages=PACKAGES, wa=WA, wa_icon=WA_ICON, ver=ver, indexable=LIVE)
        out = OUT / p["path"].strip("/") / "index.html" if p["path"] != "/" else OUT / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(html)
        print(f"built {out.relative_to(ROOT)}  ({len(html)//1024} KB)")
    robots = OUT / "robots.txt"; sitemap = OUT / "sitemap.xml"
    if LIVE:
        robots.write_text("User-agent: *\nAllow: /\nSitemap: https://sutrayaan.com/sitemap.xml\n")
        sitemap.write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
                           "".join(f"  <url><loc>https://sutrayaan.com{p['path']}</loc></url>\n" for p in PAGES) + "</urlset>\n")
    else:
        robots.write_text("User-agent: *\nDisallow: /\n")
        sitemap.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
