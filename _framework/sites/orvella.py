API = "https://script.google.com/macros/s/AKfycbyYwGXasel1oc08exteRvWOB1FTzNsU_Z9-euF3ASVmri06roiDyTP0OJnD5GO4TkK19Q/exec"

COA = ('<div class="feature coa"><div class="ft-head"><b>Certificate of Analysis</b><span>Sample COA</span></div>'
       '<div class="meta"><span>Product: Tetrabutylammonium bromide</span><span>CAS: 1643-19-2</span><span>Batch: OFC/TB/2610/118</span><span>Mfg: Oct 2026 · Retest: Oct 2028</span></div>'
       '<div class="table-wrap"><table><thead><tr><th>Parameter</th><th>Specification</th><th>Result</th></tr></thead><tbody>'
       '<tr><td>Appearance</td><td>White crystalline powder</td><td class="pass">Complies</td></tr>'
       '<tr><td>Assay (titration)</td><td class="num">≥ 99.0%</td><td class="num pass">99.6%</td></tr>'
       '<tr><td>Water (KF)</td><td class="num">≤ 0.5%</td><td class="num pass">0.21%</td></tr>'
       '<tr><td>Melting point</td><td class="num">102–106 °C</td><td class="num pass">103.8 °C</td></tr>'
       '<tr><td>Bromide content</td><td class="num">24.4–25.0%</td><td class="num pass">24.78%</td></tr>'
       '</tbody></table></div>'
       '<div class="sig"><span>Released by QC · ISO 9001:2015</span><div class="stamp">QC<br>PASSED</div></div></div>')

SITE = {
  "slug": "orvella", "api": API,
  "name": "Orvella Fine Chemicals", "short": "Orvella", "brand_sub": "FINE CHEMICALS · TALOJA MIDC",
  "meta": "Phase-transfer catalysts, quaternary ammonium salts and pharma intermediates, Taloja MIDC, Maharashtra.",
  "logo": '<svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true"><path d="M19 2.5l14.3 8.25v16.5L19 35.5 4.7 27.25v-16.5z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M19 10l7.8 4.5v9L19 28l-7.8-4.5v-9z" fill="var(--accent)"/></svg>',
  "favicon": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 38 38'><rect width='38' height='38' rx='5' fill='#0E2233'/><path d='M19 7l10.4 6v12L19 31l-10.4-6V13z' fill='#5DB4F0'/></svg>",
  "radius": "4px",
  "fonts": {"url": "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap",
            "display": '"IBM Plex Sans","Segoe UI",system-ui,sans-serif', "body": '"IBM Plex Sans","Segoe UI",system-ui,sans-serif', "mono": '"IBM Plex Mono",ui-monospace,Menlo,Consolas,monospace'},
  "palette": {
    "light": {"paper":"#F3F6F8","panel":"#FFFFFF","ink":"#0E2233","ink-2":"#4A5E6E","line":"#CFD9E0","accent":"#0A6BA8","accent-ink":"#FFFFFF","accent-soft":"#DDECF6","stamp":"#B8460F","ok":"#1F7A4D","warn":"#9A6400","banner":"#0E2233","banner-ink":"#E3ECF2"},
    "dark":  {"paper":"#0A1520","panel":"#0F1E2B","ink":"#E3ECF2","ink-2":"#9DB0BF","line":"#22384A","accent":"#5DB4F0","accent-ink":"#04213A","accent-soft":"#12324A","stamp":"#F08A55","ok":"#66C996","warn":"#E8B04B","banner":"#050B11","banner-ink":"#CFDCE6"},
    "img": {"img-ink":"#F2F7FA","img-ink-2":"#C4D3DE","img-shade":"#081420","img-accent":"#7FC8F5"}},
  "images": {
    "hero":"1765218933298-dc55fdfb517a", "tanks":"1786532852011-443cba5dc9fe", "silos":"1589725971211-7e86a631e2c2",
    "pipette":"1614935151651-0bea6508db6b", "bench":"1602052577122-f73b9710adba", "tube":"1639772823849-6efbd173043c",
    "vial":"1582560475093-ba66accbc424", "laptop":"1581093577421-f561a654a353", "drums":"1558617867-659c667b6809",
    "drums2":"1572002034205-06479bac537b", "sacks":"1785900976288-31f0f42a7364"},
  "nav": {"products": "Products", "quality": "Quality & Plant", "cta": "Request a quote"},
  "hero": {"alt": "Stainless steel process piping in a chemical plant", "eyebrow": "Fine chemicals · Taloja MIDC, India",
           "h1": "Fine chemicals. Consistent, batch after batch.", "p": "Phase-transfer catalysts, quaternary ammonium salts and intermediates for pharma and agro.",
           "cta": "Request a quote", "cta2": "View products", "badges": ["COA with every batch", "Samples in 5 days", "Exports to 22 countries"]},
  "stats": [["24 yrs","since 2002"],["38","products"],["2,400 MT","annual capacity"],["22","export countries"],["99.5%","batch pass rate"]],
  "marquee": {"label": "Exporting to", "items": ["Germany","Netherlands","USA","Japan","South Korea","Brazil","Turkey","Egypt","Vietnam","Bangladesh","UAE"]},
  "products": {"eyebrow": "What we make", "h2": "Three product families.", "cards": [
    {"img":"tube","alt":"Chemist holding a test tube of liquid","title":"Phase-transfer catalysts","line":"TBAB, TEBA, TBAHS and custom quats.","chips":["≥ 99% assay","Powder & solution"]},
    {"img":"vial","alt":"Sample being pipetted into a vial","title":"Pharma intermediates","line":"Made to your spec under change control.","chips":["DMF support","Impurity profile"]},
    {"img":"bench","alt":"Analytical laboratory bench","title":"Custom synthesis","line":"Gram-scale R&D to multi-tonne production.","chips":["Confidential","Tech transfer"]}]},
  "industries": {"h2": "Serving five industries.", "items": [["medical","Pharmaceuticals"],["leaf","Agrochemicals"],["drop","Personal care"],["brush","Paints & coatings"],["chain","Polymers"]]},
  "plant": {"img":"silos","alt":"Bulk storage silos","eyebrow":"Inside the plant","h2":"Multipurpose plant with zero liquid discharge.","nums":[["14","reactors"],["6 KL","largest reactor"],["ZLD","effluent plant"]],"cta":"See our quality system"},
  "qhome": {"img":"pipette","alt":"Analyst pipetting samples in the QC lab","caption":"QC lab · HPLC and GC analysis","h2":"Every batch tested. Every result on paper.",
            "ticks":["COA and SDS (GHS) with every dispatch","Retained samples kept for 2 years","Change control on every specification"]},
  "certs": [["ISO","9001"],["ISO","14001"],["ISO","45001"],["REACH","PRE-REG"]],
  "steps": {"h2": "Enquiry to delivery in four steps.", "items": [["Tell us the product","Name or CAS number, grade and quantity."],["Quote & documents","Price, TDS and SDS within 24 hours."],["Sample approval","Sample with COA in 5 working days."],["Supply","Scheduled batches, FOB Nhava Sheva."]]},
  "cta_band": "Need a price or a sample? We reply within 24 hours.",
  "pp": {"img":"tanks","h1":"Products and grades.","p":"Search by name or CAS number. Ask us for anything not listed.",
         "table_eyebrow":"Catalogue","table_title":"Regular products.",
         "table": {"head":["Product","CAS No.","Grade","Assay","Pack"], "rows":[
           ["Tetrabutylammonium bromide (TBAB)","1643-19-2","Tech / Pharma","≥ 99.0%","25 kg HDPE drum"],
           ["Benzyltriethylammonium chloride (TEBA)","56-37-1","Tech","≥ 98.0%","25 kg drum"],
           ["Tetrabutylammonium hydrogen sulfate (TBAHS)","32503-27-8","Pharma","≥ 99.0%","25 kg drum"],
           ["Cetyltrimethylammonium bromide (CTAB)","57-09-0","Tech / AR","≥ 99.0%","25 kg bag"],
           ["Triethyl citrate","77-93-0","Pharma (USP)","≥ 99.0%","200 kg drum"],
           ["Benzyl alcohol","100-51-6","IP / BP","≥ 99.5%","210 kg drum"]]},
         "feature": COA,
         "groups": [{"eyebrow":"Documents","h2":"Paperwork ready for your regulatory team.","chips":["COA every batch","SDS (GHS, 16 sections)","TDS","Method of analysis","Stability data","Halal & Kosher on request"]},
                    {"eyebrow":"Packing","chips":["25 kg HDPE drum","25 kg bag with liner","200 kg drum","1,000 L IBC","Palletised, shrink-wrapped","UN-approved packing"]}],
         "minis_eyebrow":"Order sizes","minis_h2":"From a 100 g sample to full container loads.",
         "minis":[["100 g","Samples","5 working days"],["25 kg","Trial orders","from stock"],["20 MT","Container loads","FCL by sea"],["24 h","Quote turnaround","with TDS & SDS"]],
         "split": {"img":"drums","alt":"Industrial drums ready for dispatch","eyebrow":"Export-ready","h2":"Packed, labelled and documented for export.","ticks":["40 km from Nhava Sheva (JNPT) port","GHS labels and UN packing for regulated goods","FOB, CIF or DAP terms"]},
         "cta":"Tell us the CAS number. We quote within 24 hours."},
  "qp": {"img":"laptop","h1":"Tested before it ships.","p":"In-house QC lab, documented methods, retained samples.",
         "steps":[["Raw material","Every lot tested against its specification."],["In process","Reaction monitored by HPLC and GC."],["Release","COA signed by QC before dispatch."]],
         "eq_eyebrow":"QC lab","eq_h2":"Analytical instruments.",
         "eq": {"head":["Instrument","Qty","Used for"],"rows":[["HPLC","3","Assay and related substances"],["Gas chromatograph","2","Residual solvents, purity"],["Karl Fischer titrator","2","Water content"],["UV-Vis spectrophotometer","1","Identification, colour"],["Melting point apparatus","2","Identity and purity checks"]]},
         "plant_h2":"Plant in Taloja MIDC, Navi Mumbai.","plant_img":"drums2","plant_alt":"Drums in the finished goods warehouse","plant_caption":"Finished goods warehouse",
         "minis":[["14","Reactors","SS316 and glass-lined"],["6 KL","Largest reactor","multipurpose"],["2","Dryers","vacuum tray and FBD"],["ZLD","Effluent","zero liquid discharge"]],
         "cta":"Need our quality documents or audit pack?"},
  "about": {"img":"hero","h1":"Started with one reactor in 2002.","p":"Chemists by training, exporters by reputation.",
            "timeline":[["2002","First 2 KL reactor in Taloja."],["2009","First export order, to Germany."],["2017","QC lab upgraded, ZLD plant commissioned."],["2026","14 reactors, 38 products, 22 countries."]],
            "vendor":[["Legal name","Orvella Fine Chemicals Pvt. Ltd.",True],["Address","Taloja MIDC, Navi Mumbai 410208",True],["GSTIN","27XXXXXXXXXXXZX",True],["IEC","XXXXXXXXXX",True],["Documents","Company profile, ISO certificates, site master file, questionnaire",False]],
            "careers_img":"laptop","careers_alt":"Chemist working in the lab","careers_h2":"Hiring QC chemists and a production officer.","careers_ticks":["B.Sc. / M.Sc. Chemistry","Company transport from Panvel","Training on HPLC and GC"]},
  "form": {"h1":"Request a quote or sample.","p":"Tell us the product, grade and quantity. We reply within 24 hours.",
           "types":["Price quote","Sample request","TDS / SDS / COA documents","Custom synthesis enquiry"],
           "proc_label":"Product","proc_options":["Select a product","TBAB · 1643-19-2","TEBA · 56-37-1","TBAHS · 32503-27-8","CTAB · 57-09-0","Triethyl citrate · 77-93-0","Benzyl alcohol · 100-51-6","Other (write below)"],
           "city_label":"Delivery city / port","city_ph":"Hamburg, Germany",
           "material_label":"Grade","material_options":["Not sure","Technical","Pharma (IP / BP / USP)","AR / lab grade","Custom spec"],
           "qty_label":"Quantity","qty_ph":"500 kg per month",
           "extras":[{"id":"pack","label":"Packing","options":["Not sure","25 kg drum","25 kg bag","200 kg drum","1,000 L IBC"]},
                     {"id":"app","label":"Application","ph":"Alkylation catalyst, API step 3…"}],
           "desc_label":"Notes","desc_required":False,"desc_ph":"Specification, impurity limits, documents needed, target price…",
           "files_label":"Specification or documents","files_hint":"PDF, Word or Excel","files_accept":".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg",
           "check_label":"Send me your NDA before I share our specification",
           "aside_img":"sacks","aside_alt":"Bagged product stacked for dispatch","trust_h":"Confidential by default","trust_p":"Custom synthesis projects run under NDA, with restricted access."},
  "contact": {"email":"export@orvella.example","phone":"+91 22 0000 0000","hours":"Mon–Sat, 9:30 am – 6:00 pm IST"},
  "footer_line": "Fine chemicals since 2002. Taloja MIDC, Navi Mumbai.",
  "foot_certs": ["ISO 9001:2015","ISO 14001:2015","ISO 45001:2018"],
  "doc_no": "DOC NO. OFC-WEB-001 · REV A",
  "js": {"docsType":"TDS / SDS / COA documents","qtyError":"Enter a quantity, for example 500 kg.","descRequired":False,
         "descError":"","docsDone":"We will email the documents within one working day.",
         "quoteDone":"Our team will reply with price and documents within 24 hours.","procLabel":"Product","materialLabel":"Grade",
         "examples":[
           {"ref":"RFQ-EXAMPLE-301","type":"Sample request","process":"TBAB · 1643-19-2","material":"Pharma (IP / BP / USP)","qty":"1 kg sample","name":"Kenji","company":"Hoshino Pharma (example)","city":"Osaka, Japan","desc":"Packing: 25 kg drum · API intermediate","status":"New","hoursAgo":6},
           {"ref":"RFQ-EXAMPLE-300","type":"Price quote","process":"Triethyl citrate · 77-93-0","material":"Pharma (IP / BP / USP)","qty":"5 MT a quarter","name":"Ana","company":"Lumen Coatings (example)","city":"São Paulo, Brazil","desc":"CIF Santos","status":"Quoted","hoursAgo":72}]},
}
