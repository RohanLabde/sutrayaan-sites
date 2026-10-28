API = "https://script.google.com/macros/s/AKfycbyYwGXasel1oc08exteRvWOB1FTzNsU_Z9-euF3ASVmri06roiDyTP0OJnD5GO4TkK19Q/exec"

# Regular slotted container (RSC) dieline at 1:2 scale for a 300 x 200 x 250 mm box.
DIE = ('<div class="feature dieline"><div class="ft-head"><b>RSC dieline · 300 × 200 × 250 mm</b><span>5-ply · BC flute</span></div>'
  '<svg viewBox="0 0 566 304" role="img" aria-label="Flat dieline of a regular slotted carton with four panels, glue flap and top and bottom flaps">'
  '<path class="cut" d="M20 98 L38 92 V215 L20 209 Z"/>'
  '<path class="cut" d="M38 40 H186 V90 H190 V40 H286 V90 H290 V40 H436 V90 H440 V40 H538 V265 H440 V215 H436 V265 H290 V215 H286 V265 H190 V215 H186 V265 H38 Z"/>'
  '<path class="crease" d="M38 90 H538 M38 215 H538 M188 90 V215 M288 90 V215 M438 90 V215"/>'
  '<text class="lbl" x="113" y="158" text-anchor="middle">L · 300</text><text class="lbl" x="238" y="158" text-anchor="middle">W · 200</text>'
  '<text class="lbl" x="363" y="158" text-anchor="middle">L · 300</text><text class="lbl" x="488" y="158" text-anchor="middle">W · 200</text>'
  '<text class="lbl2" x="113" y="70" text-anchor="middle">top flap</text><text class="lbl2" x="113" y="245" text-anchor="middle">bottom flap</text>'
  '<text class="lbl2" x="29" y="160" text-anchor="middle" transform="rotate(-90 29 160)">glue</text>'
  '<path class="dim" d="M547 90 V215 M543 90 H551 M543 215 H551"/><text class="lbl" x="560" y="152" text-anchor="middle" transform="rotate(-90 560 152)">H · 250</text>'
  '<path class="dim" d="M38 280 H188 M38 276 V284 M188 276 V284"/><text class="lbl2" x="113" y="298" text-anchor="middle">L = 300 mm</text>''<path class="cut" d="M400 290 H420" style="fill:none"/><text class="lbl2" x="425" y="294">cut</text><path class="crease" d="M460 290 H480"/><text class="lbl2" x="485" y="294">crease</text>'
  '</svg><span class="muted" style="font-size:.88rem">We send a dieline like this with every new-box quote, for your approval before production.</span></div>')

SITE = {
  "slug": "boxworks", "api": API,
  "name": "Bhiwandi Boxworks", "short": "Boxworks", "brand_sub": "CORRUGATED PACKAGING · BHIWANDI",
  "meta": "Corrugated boxes, printed cartons and export packaging, Bhiwandi, Maharashtra.",
  "logo": '<svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true"><path d="M19 3l15 8v16l-15 8-15-8V11z" fill="var(--accent)"/><path d="M4 11l15 8 15-8M19 19v16" fill="none" stroke="var(--accent-ink)" stroke-width="2"/></svg>',
  "favicon": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 38 38'><path d='M19 3l15 8v16l-15 8-15-8V11z' fill='#D9480F'/><path d='M4 11l15 8 15-8M19 19v16' fill='none' stroke='#fff' stroke-width='2'/></svg>",
  "radius": "2px",
  "fonts": {"url": "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Work+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap",
            "display": '"Bricolage Grotesque","Segoe UI",system-ui,sans-serif', "body": '"Work Sans","Segoe UI",system-ui,sans-serif', "mono": '"DM Mono",ui-monospace,Menlo,Consolas,monospace'},
  "palette": {
    "light": {"paper":"#EFE7DA","panel":"#FFFCF7","ink":"#1B1712","ink-2":"#5E5547","line":"#D9CBB5","accent":"#D9480F","accent-ink":"#FFFFFF","accent-soft":"#FBE3D6","stamp":"#9C2F0B","ok":"#2E7D32","warn":"#9A6200","banner":"#1B1712","banner-ink":"#EFE6D8"},
    "dark":  {"paper":"#15120E","panel":"#1E1A15","ink":"#F1E9DC","ink-2":"#B5A894","line":"#3A3228","accent":"#FF7A3D","accent-ink":"#2A0E00","accent-soft":"#3A2216","stamp":"#FF9A6E","ok":"#79C57E","warn":"#E8B04B","banner":"#0B0907","banner-ink":"#E4DACB"},
    "img": {"img-ink":"#FFF8EE","img-ink-2":"#E3D5C1","img-shade":"#120E0A","img-accent":"#FFB088"}},
  "images": {
    "hero":"1766040923580-16ad32fae8b4", "stack":"1624137527136-66e631bdaa0e", "warehouse":"1769355104335-acef3aa4c9b6",
    "partitions":"1700165644892-3dd6b67b25bc", "flute":"1696764190824-bcdb5c8278d3", "press":"1503694978374-8a2fa686963a",
    "rollers":"1758183961426-88d64eb5f787", "workers":"1727517786578-ff2bb896b852", "conveyor":"1693031630157-7ecc8d06de63",
    "mono":"1607166452427-7e4477079cb9", "printed":"1757940059959-662478f87b72"},
  "nav": {"products": "Packaging", "quality": "Quality & Plant", "cta": "Get box pricing"},
  "hero": {"alt": "Stacks of corrugated boxes sealed with tape", "eyebrow": "Corrugated packaging · Bhiwandi, India",
           "h1": "Boxes that protect your product and your brand.", "p": "Corrugated boxes, printed cartons and export packaging for FMCG, pharma and e-commerce.",
           "cta": "Get box pricing", "cta2": "Our packaging", "badges": ["Dieline in 48 hours", "Up to 4-colour print", "FSC certified board"]},
  "stats": [["16 yrs","since 2010"],["9,000 MT","board a year"],["25 lakh","boxes a month"],["150+","brands served"],["48 h","sample lead time"]],
  "marquee": {"label": "Packaging for", "items": ["FMCG","Pharma","E-commerce","Electronics","Spices","Dairy","Agro exports","Auto spares","Home care","Footwear"]},
  "products": {"eyebrow": "What we make", "h2": "Three kinds of packaging.", "cards": [
    {"img":"stack","alt":"Stacked brown corrugated boxes","title":"Corrugated boxes","line":"3, 5 and 7-ply shipping cartons, any size.","chips":["BF 16–28","A, B, C, E flute"]},
    {"img":"printed","alt":"Printed fruit cartons stacked high","title":"Printed cartons","line":"Flexo and litho-laminated boxes in your brand colours.","chips":["Up to 4 colours","Food-safe inks"]},
    {"img":"partitions","alt":"Corrugated boxes with partitions","title":"Partitions & inserts","line":"Dividers, pads and die-cut inserts that stop breakage.","chips":["Custom die-cut","Bottle & jar fits"]}]},
  "industries": {"h2": "Packing for five sectors.", "items": [["cart","FMCG & retail"],["medical","Pharma"],["box","E-commerce"],["chip","Electronics"],["food","Food & spices"]]},
  "plant": {"img":"conveyor","alt":"Corrugation line conveyor","eyebrow":"Inside the plant","h2":"Fully automatic 5-ply line. Delivery across Mumbai and Pune.","nums":[["1","5-ply auto line"],["3","flexo printers"],["8","delivery trucks"]],"cta":"See our plant"},
  "qhome": {"img":"flute","alt":"Close-up of corrugated board","caption":"Board check · flute and GSM","h2":"Every batch tested for strength.",
            "ticks":["Burst, BCT and edge-crush tests in-house","GSM and moisture checked on every reel","Test report with every delivery"]},
  "certs": [["ISO","9001"],["FSC","CoC"],["ISO","14001"],["FOOD","SAFE INK"]],
  "steps": {"h2": "From size to supply in four steps.", "items": [["Share your size","Box size, ply and print. Or send your product."],["Dieline & price","Dieline and price within 48 hours."],["Sample approval","Plain or printed sample in 3–5 days."],["Supply","Monthly schedule, delivered to your warehouse."]]},
  "cta_band": "Tell us the size. Get box pricing in 48 hours.",
  "pp": {"img":"rollers","h1":"What we can make.","p":"Box styles, board grades, printing and finishing.",
         "table_eyebrow":"Box styles","table_title":"Styles and limits.",
         "table": {"head":["Style","Board","Max size","Print","MOQ"], "rows":[
           ["Regular slotted (RSC)","3 / 5 / 7-ply","1,800 × 1,200 mm sheet","Up to 4-colour flexo","500 boxes"],
           ["Die-cut / mailer","3 / 5-ply, E or B flute","1,400 × 1,000 mm","Up to 4-colour flexo","1,000 boxes"],
           ["Litho-laminated","E / F flute + art paper","1,020 × 720 mm","CMYK offset","2,000 boxes"],
           ["Heavy-duty export","7-ply, BC + C","1,800 × 1,200 mm","1–2 colour","300 boxes"],
           ["Partitions & pads","3-ply","as required","Plain","1,000 sets"]]},
         "feature": DIE,
         "groups": [{"eyebrow":"Board grades","h2":"Paper and flute to match the load.","chips":["Kraft 120–300 GSM","Duplex board","BF 16 / 18 / 20 / 24 / 28","A flute","B flute","C flute","E flute","BC double wall"]},
                    {"eyebrow":"Finishing","chips":["Flexo print","Varnish","Window patching","Stitching","Folder-gluing","Handholes","Water-resistant coating"]}],
         "minis_eyebrow":"Order sizes","minis_h2":"From 500 boxes to monthly contracts.",
         "minis":[["500","Minimum order","plain RSC"],["3–5 d","Samples","plain or printed"],["7–10 d","Production","repeat orders"],["Weekly","Scheduled supply","to your warehouse"]],
         "split": {"img":"warehouse","alt":"Warehouse with cardboard boxes and packaging supplies","eyebrow":"Delivery","h2":"Our own trucks, across Mumbai, Thane and Pune.","ticks":["Buffer stock held for contract customers","Palletised and stretch-wrapped","Same-week repeat orders"]},
         "cta":"Send your box size. We reply with a dieline and price in 48 hours."},
  "qp": {"img":"press","h1":"Strength, tested in-house.","p":"Board and box tests to IS and TAPPI methods.",
         "steps":[["Paper","GSM, BF and moisture checked on every reel."],["Board","Flute, ply bond and edge-crush on every run."],["Box","Compression and drop tests on new designs."]],
         "eq_eyebrow":"Testing lab","eq_h2":"Testing equipment.",
         "eq": {"head":["Equipment","Qty","Used for"],"rows":[["Bursting strength tester","2","Board burst (kg/cm²)"],["Box compression tester","1","Stacking strength (BCT)"],["Edge crush tester","1","ECT"],["Cobb tester","1","Water absorption"],["Moisture meter","3","Paper and board moisture"]]},
         "plant_h2":"60,000 sq ft in Bhiwandi.","plant_img":"workers","plant_alt":"Workers operating converting machinery","plant_caption":"Converting hall · printing and die-cutting",
         "minis":[["1","5-ply automatic line","1.8 m wide"],["3","Flexo printer-slotters","up to 4 colours"],["2","Die-cutters","rotary and flatbed"],["1","Folder-gluer","auto feed"]],
         "cta":"Need our test reports or audit pack?"},
  "about": {"img":"hero","h1":"A semi-automatic line in 2010. Fully automatic today.","p":"Family-run, close to Mumbai's biggest warehouse belt.",
            "timeline":[["2010","Started with a semi-automatic 3-ply line."],["2015","First printer-slotter, first FMCG contract."],["2021","Fully automatic 5-ply plant. FSC certified."],["2026","25 lakh boxes a month, 150+ brands."]],
            "vendor":[["Legal name","Bhiwandi Boxworks Pvt. Ltd.",True],["Address","Bhiwandi, Thane 421302",True],["GSTIN","27XXXXXXXXXXXZX",True],["Udyam","UDYAM-MH-00-0000000",True],["Documents","Company profile, FSC and ISO certificates, test reports",False]],
            "careers_img":"workers","careers_alt":"Workers in the converting hall","careers_h2":"Hiring machine operators and a print supervisor.","careers_ticks":["Day and night shifts","PF, ESIC and canteen","Training on flexo printing"]},
  "form": {"h1":"Get pricing for your boxes.","p":"Share the size and quantity. We reply with a dieline and price within 48 hours.",
           "types":["Quote for boxes","Sample request","Packaging redesign","Vendor registration documents"],
           "proc_label":"Box style","proc_options":["Not sure","Regular slotted (RSC)","Die-cut / mailer","Litho-laminated","Heavy-duty export","Partitions & inserts"],
           "city_label":"Delivery location","city_ph":"Bhiwandi warehouse, Thane",
           "material_label":"Ply","material_options":["Not sure","3-ply","5-ply","7-ply"],
           "qty_label":"Monthly quantity","qty_ph":"20,000 boxes a month",
           "extras":[{"id":"size","label":"Box size (L × W × H, mm)","ph":"300 × 200 × 250"},
                     {"id":"print","label":"Printing","options":["Not sure","Plain","1 colour","2 colours","4 colours","Litho / CMYK"]},
                     {"id":"product","label":"Product to be packed","ph":"6 × 1 L oil bottles, 9 kg","full":True}],
           "desc_label":"Notes","desc_required":False,"desc_ph":"Stacking height, export or domestic, current problems with breakage…",
           "files_label":"Artwork or photos","files_hint":"PDF, AI, CDR or photos of the current box","files_accept":".pdf,.ai,.cdr,.eps,.png,.jpg,.jpeg",
           "check_label":"Send me a physical sample before the first order",
           "aside_img":"mono","aside_alt":"Plain mono carton","trust_h":"Artwork stays confidential","trust_p":"Your print plates and dies are stored for you and used only on your orders."},
  "contact": {"email":"orders@boxworks.example","phone":"+91 2522 000 000","hours":"Mon–Sat, 9:00 am – 7:00 pm"},
  "footer_line": "Corrugated and printed packaging since 2010. Bhiwandi, Maharashtra.",
  "foot_certs": ["ISO 9001:2015","FSC Chain of Custody","ISO 14001:2015"],
  "doc_no": "DIELINE NO. BBW-WEB-001 · REV A",
  "js": {"docsType":"Vendor registration documents","qtyError":"Enter how many boxes you need each month.","descRequired":False,
         "descError":"","docsDone":"We will email the vendor pack within one working day.",
         "quoteDone":"We will send a dieline and price within 48 hours.","procLabel":"Style","materialLabel":"Ply",
         "examples":[
           {"ref":"RFQ-EXAMPLE-401","type":"Quote for boxes","process":"Regular slotted (RSC)","material":"5-ply","qty":"30,000 a month","name":"Imran","company":"Spice Route Foods (example)","city":"Bhiwandi, Thane","desc":"Box size: 400 × 300 × 250 · Printing: 2 colours","status":"New","hoursAgo":3},
           {"ref":"RFQ-EXAMPLE-400","type":"Sample request","process":"Die-cut / mailer","material":"3-ply","qty":"8,000 a month","name":"Priya","company":"Kalaa Footwear (example)","city":"Mumbai","desc":"E-commerce mailer, 1 colour","status":"Quoted","hoursAgo":60}]},
}
