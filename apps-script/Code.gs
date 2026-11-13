/**
 * Sutrayaan · Google Sheets back end
 *
 * 1. Leads tab: receives quote requests from the demo sites and sutrayaan.com,
 *    emails the owner, and serves a privacy-safe list to each demo's tracker page.
 * 2. Pipeline tab: Sutrayaan's own sales pipeline (outreach + inbound). Audit requests
 *    from sutrayaan.com are added automatically. Changing a Stage fills in the
 *    next action and its due date.
 * 3. Summary tab: counts by stage and source, reply rate, and what is due today.
 * 4. Bigin (Zoho CRM): audit requests from sutrayaan.com also become a company, contact and deal
 *    in Bigin, at the "Audit requested" stage. The sheet and email alert stay as the backup.
 *    Setup: see "Bigin connection" near the end of this file.
 *
 * Setup: paste over everything in Extensions → Apps Script, save, choose
 * setupPipeline in the toolbar and click Run once (approve access), then
 * Deploy → Manage deployments → Edit → Version: New version → Deploy.
 */
const SHEET_NAME = 'Leads';
const ALERT_EMAIL = '';            // leave blank to email the sheet owner
const BUSINESS = 'Sutrayaan demo site';   // used when a site does not send its name
const HEADERS = ['Ref','Received','Status','Type','Process','Name','Company','Email','Phone','City',
                 'Material','Quantity','Needed by','Description','Drawings','NDA','First response','Updated','Site'];
const STATUSES = ['New','Contacted','Quoted','Won','Lost'];
const DEMO_SITES = ['meru','polyvasa','orvella','boxworks'];   // only these have public trackers

// ---------- Pipeline settings ----------
const P_NAME = 'Pipeline';
const P_HEADERS = ['ID','Added','Company','Industry','City','Website','Contact','Role','LinkedIn','Email','Phone',
                   'Source','Fit (1-5)','Hook (one problem we spotted)','Demo to send','Stage','Channel',
                   'Last contact','Next action','Due','Deal value (₹)','Notes','Ref'];
const P = {};  P_HEADERS.forEach((h, i) => P[h] = i + 1);   // column numbers by header
const STAGES = ['Researched','Contacted','Follow-up 1 sent','Follow-up 2 sent','Replied','Audit requested',
                'Audit sent','Call booked','Proposal sent','Won','Lost','Not now'];
const SOURCES = ['LinkedIn','Email','Visit','Phone','Website (inbound)','Referral','Google','Event','Other'];
const INDUSTRIES = ['CNC and engineering','Plastics','Chemicals','Packaging','Other'];
const CHANNELS = ['LinkedIn','Email','WhatsApp','Phone','Visit'];
const DEMOS = ['meru.sutrayaan.com','polyvasa.sutrayaan.com','orvella.sutrayaan.com','boxworks.sutrayaan.com'];
// What happens when a Stage is chosen: [next action, days until due, stamp "Last contact"?]
const NEXT = {
  'Researched':       ['Send first message (Day 0)', 0, false],
  'Contacted':        ['Send follow-up 1 (Day 3)', 3, true],
  'Follow-up 1 sent': ['Send follow-up 2 (Day 7)', 4, true],
  'Follow-up 2 sent': ['No reply? Mark Not now', 7, true],
  'Replied':          ['Offer the free audit', 1, true],
  'Audit requested':  ['Send the audit (within 24 h)', 1, false],
  'Audit sent':       ['Ask for a 15-minute call', 2, true],
  'Call booked':      ['Prepare a fixed quote', 2, true],
  'Proposal sent':    ['Follow up on the proposal', 3, true],
  'Won':              ['Book the plant visit', 3, true],
  'Lost':             ['', null, true],
  'Not now':          ['Check back', 90, false]
};
const STAGE_COLOURS = {
  'Researched':'#F1F3F4','Contacted':'#E8EAF6','Follow-up 1 sent':'#E8EAF6','Follow-up 2 sent':'#E8EAF6',
  'Replied':'#FFF3D6','Audit requested':'#FFE7B3','Audit sent':'#FFE7B3','Call booked':'#D9F0E3',
  'Proposal sent':'#D9F0E3','Won':'#B7E1C7','Lost':'#F4D7D5','Not now':'#ECECEC'
};

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#DDEDEA');
  } else if (sh.getLastColumn() < HEADERS.length) {
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold').setBackground('#DDEDEA');
  }
  return sh;
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
// Trim, cap length, and stop values being read as spreadsheet formulas.
function clean_(v, n) {
  let s = String(v == null ? '' : v).trim().slice(0, n || 500);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}
function today_(plusDays) {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  if (plusDays) d.setDate(d.getDate() + plusDays);
  return d;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const sh = sheet_();

    if (d.action === 'status') {
      if (STATUSES.indexOf(d.status) < 0) return json_({ ok: false, error: 'bad status' });
      const refs = sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), 1).getValues().map(r => r[0]);
      const i = refs.indexOf(String(d.ref));
      if (i < 0) return json_({ ok: false, error: 'not found' });
      const row = i + 2, now = new Date();
      if (DEMO_SITES.indexOf(String(sh.getRange(row, 19).getValue() || 'meru')) < 0) return json_({ ok: false, error: 'not found' });
      sh.getRange(row, 3).setValue(d.status);
      sh.getRange(row, 18).setValue(now);
      if (d.status !== 'New' && !sh.getRange(row, 17).getValue()) sh.getRange(row, 17).setValue(now);
      return json_({ ok: true });
    }

    if (d.website) return json_({ ok: true, ref: 'RFQ-0' });           // spam trap
    if (!clean_(d.name) || !clean_(d.company)) return json_({ ok: false, error: 'missing fields' });

    const now = new Date();
    const site = clean_(d.site || 'meru', 40);
    const ref = 'RFQ-' + Utilities.formatDate(now, 'Asia/Kolkata', 'yyMMdd') + '-' + Math.floor(100 + Math.random() * 900);
    const files = Array.isArray(d.files) ? d.files.map(f => clean_(f, 120)).join(', ') : '';
    sh.appendRow([ref, now, 'New', clean_(d.type, 60), clean_(d.process, 60), clean_(d.name, 100), clean_(d.company, 120),
                  clean_(d.email, 120), clean_(d.phone, 40), clean_(d.city, 80), clean_(d.material, 80), clean_(d.qty, 80),
                  clean_(d.neededBy, 20), clean_(d.desc, 2000), files, d.nda ? 'Yes' : 'No', '', now, site]);

    let crmNote = '';
    if (site === 'sutrayaan') {
      try { addInbound_(d, ref); } catch (err) { console.error(err); }
      crmNote = addToBigin_(d, ref);   // never throws; returns a line for the alert email
    }

    const to = ALERT_EMAIL || Session.getEffectiveUser().getEmail();
    const body = [
      'New request ' + ref, '',
      'Company: ' + clean_(d.company), 'Name: ' + clean_(d.name),
      'Email: ' + clean_(d.email), 'Phone: ' + String(d.phone || '').trim().slice(0, 40), 'City: ' + clean_(d.city), '',
      'Type: ' + clean_(d.type), 'Process / industry: ' + clean_(d.process), 'Material / problem: ' + clean_(d.material),
      'Quantity: ' + clean_(d.qty), 'Needed by: ' + clean_(d.neededBy), '',
      'Details: ' + clean_(d.desc, 2000), 'Drawings: ' + (files || '—'), 'NDA requested: ' + (d.nda ? 'Yes' : 'No'), '',
      site === 'sutrayaan' ? 'Added to your Pipeline tab as "Audit requested".' : '',
      crmNote,
      'Open the sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
    ].join('\n');
    MailApp.sendEmail(to, 'New request ' + ref + ' · ' + clean_(d.company, 60) + ' · ' + (clean_(d.brand, 60) || BUSINESS), body);
    return json_({ ok: true, ref: ref });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Public list for the demo trackers: latest 50 for one demo site, no emails or phone numbers, first names only.
// Sutrayaan's own audit requests are never served here.
function doGet(e) {
  const want = String((e && e.parameter && e.parameter.site) || 'meru');
  if (DEMO_SITES.indexOf(want) < 0) return json_({ ok: true, leads: [] });
  const sh = sheet_();
  const n = sh.getLastRow() - 1;
  if (n < 1) return json_({ ok: true, leads: [] });
  const rows = sh.getRange(2, 1, n, HEADERS.length).getValues().filter(r => r[0] && String(r[18] || 'meru') === want).slice(-50).reverse();
  const leads = rows.map(r => ({ site: String(r[18] || 'meru'),
    ref: r[0], createdAt: r[1] instanceof Date ? r[1].toISOString() : String(r[1]), status: r[2],
    type: r[3], process: r[4], name: String(r[5]).split(' ')[0], company: r[6], city: r[9],
    material: r[10], qty: r[11], desc: String(r[13]).slice(0, 160),
    files: r[14] ? String(r[14]).split(', ') : [], nda: r[15] === 'Yes'
  }));
  return json_({ ok: true, leads: leads });
}

// ======================= Pipeline =======================

function pipeline_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(P_NAME) || setupPipeline();
}

function nextId_(sh) {
  const n = sh.getLastRow() - 1;
  let max = 0;
  if (n > 0) sh.getRange(2, P['ID'], n, 1).getValues().forEach(r => {
    const m = String(r[0]).match(/^P-(\d+)$/); if (m) max = Math.max(max, +m[1]);
  });
  return 'P-' + String(max + 1).padStart(3, '0');
}

// Audit requests from sutrayaan.com become pipeline rows automatically.
function addInbound_(d, ref) {
  const sh = pipeline_();
  const site = (String(d.desc || '').match(/Current website:\s*([^·\n]+)/) || [])[1] || '';
  const row = new Array(P_HEADERS.length).fill('');
  row[P['ID'] - 1] = nextId_(sh);
  row[P['Added'] - 1] = new Date();
  row[P['Company'] - 1] = clean_(d.company, 120);
  row[P['Industry'] - 1] = INDUSTRIES.indexOf(d.process) >= 0 ? d.process : clean_(d.process, 60);
  row[P['Website'] - 1] = clean_(site.trim() === 'none' ? '' : site, 200);
  row[P['Contact'] - 1] = clean_(d.name, 100);
  row[P['Email'] - 1] = clean_(d.email, 120);
  row[P['Phone'] - 1] = clean_(d.phone, 40);
  row[P['Source'] - 1] = 'Website (inbound)';
  row[P['Hook (one problem we spotted)'] - 1] = 'They said: ' + clean_(d.material, 80);
  row[P['Stage'] - 1] = 'Audit requested';
  row[P['Next action'] - 1] = NEXT['Audit requested'][0];
  row[P['Due'] - 1] = today_(1);
  row[P['Notes'] - 1] = clean_(d.type, 60);
  row[P['Ref'] - 1] = ref;
  sh.appendRow(row);
}

// When you change a Stage, fill in the next action and due date. When you add a company, give it an ID.
function onEdit(e) {
  try {
    const sh = e.range.getSheet();
    if (sh.getName() !== P_NAME || e.range.getRow() < 2) return;
    const r0 = e.range.getRow(), nRows = e.range.getNumRows();
    const c0 = e.range.getColumn(), c1 = c0 + e.range.getNumColumns() - 1;
    for (let r = r0; r < r0 + nRows; r++) {
      if (c0 <= P['Company'] && P['Company'] <= c1 && sh.getRange(r, P['Company']).getValue()) {
        if (!sh.getRange(r, P['ID']).getValue()) sh.getRange(r, P['ID']).setValue(nextId_(sh));
        if (!sh.getRange(r, P['Added']).getValue()) sh.getRange(r, P['Added']).setValue(new Date());
        if (!sh.getRange(r, P['Stage']).getValue()) {
          sh.getRange(r, P['Stage']).setValue('Researched');
          sh.getRange(r, P['Next action']).setValue(NEXT['Researched'][0]);
          sh.getRange(r, P['Due']).setValue(today_(0));
        }
      }
      if (c0 <= P['Stage'] && P['Stage'] <= c1) {
        const rule = NEXT[sh.getRange(r, P['Stage']).getValue()];
        if (!rule) continue;
        sh.getRange(r, P['Next action']).setValue(rule[0]);
        sh.getRange(r, P['Due']).setValue(rule[1] == null ? '' : today_(rule[1]));
        if (rule[2]) sh.getRange(r, P['Last contact']).setValue(today_(0));
      }
    }
  } catch (err) { console.error(err); }
}

// Run once from the Apps Script toolbar. Safe to run again: it keeps your rows.
function setupPipeline() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(P_NAME);
  if (!sh) sh = ss.insertSheet(P_NAME);
  const lastCol = P_HEADERS.length;
  sh.getRange(1, 1, 1, lastCol).setValues([P_HEADERS]).setFontWeight('bold').setFontColor('#FFFFFF')
    .setBackground('#1C1F4A').setVerticalAlignment('middle').setWrap(true);
  sh.setFrozenRows(1); sh.setFrozenColumns(3); sh.setRowHeight(1, 36);
  if (sh.getMaxColumns() > lastCol) sh.deleteColumns(lastCol + 1, sh.getMaxColumns() - lastCol);
  if (sh.getMaxRows() < 1000) sh.insertRowsAfter(sh.getMaxRows(), 1000 - sh.getMaxRows());
  const widths = { 'ID':60,'Added':90,'Company':200,'Industry':140,'City':100,'Website':170,'Contact':130,'Role':110,
    'LinkedIn':150,'Email':170,'Phone':120,'Source':130,'Fit (1-5)':60,'Hook (one problem we spotted)':280,
    'Demo to send':170,'Stage':130,'Channel':100,'Last contact':95,'Next action':210,'Due':90,'Deal value (₹)':100,'Notes':240,'Ref':110 };
  P_HEADERS.forEach((h, i) => sh.setColumnWidth(i + 1, widths[h] || 120));

  const body = n => sh.getRange(2, P[n], sh.getMaxRows() - 1, 1);
  const list = (vals) => SpreadsheetApp.newDataValidation().requireValueInList(vals, true).setAllowInvalid(true).build();
  body('Stage').setDataValidation(list(STAGES));
  body('Source').setDataValidation(list(SOURCES));
  body('Industry').setDataValidation(list(INDUSTRIES));
  body('Channel').setDataValidation(list(CHANNELS));
  body('Demo to send').setDataValidation(list(DEMOS));
  body('Fit (1-5)').setDataValidation(SpreadsheetApp.newDataValidation().requireNumberBetween(1, 5).setAllowInvalid(false).build());
  ['Added','Last contact','Due'].forEach(n => body(n).setNumberFormat('dd mmm'));
  body('Deal value (₹)').setNumberFormat('[$₹]#,##0');
  body('Hook (one problem we spotted)').setWrap(true); body('Notes').setWrap(true);

  // Colours: stage chips, overdue in red, high-fit companies in bold.
  const rules = [];
  const all = sh.getRange(2, 1, sh.getMaxRows() - 1, lastCol);
  const col = c => String.fromCharCode(64 + c);
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($' + col(P['Due']) + '2<>"",$' + col(P['Due']) + '2<TODAY(),$' + col(P['Stage']) + '2<>"Won",$' + col(P['Stage']) + '2<>"Lost")')
    .setFontColor('#B3261E').setBold(true).setRanges([body('Due'), body('Next action')]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($' + col(P['Due']) + '2=TODAY(),$' + col(P['Stage']) + '2<>"Won",$' + col(P['Stage']) + '2<>"Lost")')
    .setFontColor('#9A5B00').setBold(true).setRanges([body('Due'), body('Next action')]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThanOrEqualTo(4)
    .setBold(true).setFontColor('#1C1F4A').setRanges([body('Fit (1-5)')]).build());
  Object.keys(STAGE_COLOURS).forEach(s => rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo(s).setBackground(STAGE_COLOURS[s]).setRanges([body('Stage')]).build()));
  sh.setConditionalFormatRules(rules);
  all.setVerticalAlignment('top');
  if (!sh.getFilter()) sh.getRange(1, 1, sh.getMaxRows(), lastCol).createFilter();

  setupSummary_();
  ss.setActiveSheet(sh);
  return sh;
}

function setupSummary_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName('Summary');
  if (!s) s = ss.insertSheet('Summary');
  s.clear();
  const c = n => String.fromCharCode(64 + P[n]);
  const rng = n => P_NAME + '!' + c(n) + '2:' + c(n);
  const stage = rng('Stage'), src = rng('Source'), due = rng('Due'), last = rng('Last contact');
  const repliedPlus = ['Replied','Audit requested','Audit sent','Call booked','Proposal sent','Won'];

  s.getRange('A1').setValue('Sutrayaan pipeline').setFontSize(16).setFontWeight('bold').setFontColor('#1C1F4A');
  s.getRange('A2').setFormula('="Updated "&TEXT(NOW(),"dd mmm yyyy, h:mm am/pm")').setFontColor('#555A80');

  const kpis = [
    ['Companies in pipeline', '=COUNTA(' + rng('Company') + ')'],
    ['Reached (beyond Researched)', '=COUNTA(' + stage + ')-COUNTIF(' + stage + ',"Researched")'],
    ['Replied or further', '=' + repliedPlus.map(x => 'COUNTIF(' + stage + ',"' + x + '")').join('+')],
    ['Reply rate', '=IFERROR(B6/(B5-COUNTIF(' + src + ',"Website (inbound)")-COUNTIF(' + src + ',"Referral")),0)'],
    ['Contacted in the last 7 days', '=COUNTIFS(' + last + ',">="&(TODAY()-7))'],
    ['Due today or overdue', '=COUNTIFS(' + due + ',"<="&TODAY(),' + due + ',"<>",' + stage + ',"<>Won",' + stage + ',"<>Lost")'],
    ['Won', '=COUNTIF(' + stage + ',"Won")'],
    ['Won value (₹)', '=SUMIFS(' + rng('Deal value (₹)') + ',' + stage + ',"Won")']
  ];
  s.getRange(4, 1, kpis.length, 2).setValues(kpis);
  s.getRange('B7').setNumberFormat('0%'); s.getRange('B11').setNumberFormat('[$₹]#,##0');
  s.getRange(4, 1, kpis.length, 1).setFontColor('#555A80');
  s.getRange(4, 2, kpis.length, 1).setFontWeight('bold').setFontSize(13);

  s.getRange('D3').setValue('By stage').setFontWeight('bold');
  s.getRange(4, 4, STAGES.length, 2).setValues(STAGES.map((x, i) => [x, '=COUNTIF(' + stage + ',D' + (4 + i) + ')']));

  s.getRange('G3:J3').setValues([['By source', 'Companies', 'Replied+', 'Won']]).setFontWeight('bold');
  s.getRange(4, 7, SOURCES.length, 4).setValues(SOURCES.map((x, i) => {
    const r = 4 + i;
    return [x, '=COUNTIF(' + src + ',G' + r + ')',
      '=' + repliedPlus.map(st => 'COUNTIFS(' + src + ',G' + r + ',' + stage + ',"' + st + '")').join('+'),
      '=COUNTIFS(' + src + ',G' + r + ',' + stage + ',"Won")'];
  }));

  const t = 4 + Math.max(STAGES.length, SOURCES.length) + 2;
  s.getRange(t, 1).setValue('Due today or overdue').setFontWeight('bold').setFontSize(13).setFontColor('#1C1F4A');
  s.getRange(t + 1, 1, 1, 5).setValues([['Company', 'Stage', 'Next action', 'Due', 'Channel']]).setFontWeight('bold');
  s.getRange(t + 2, 1).setFormula('=IFERROR(SORT(FILTER({' + [rng('Company'), stage, rng('Next action'), due, rng('Channel')].join(',') + '},' +
    due + '<>"",' + due + '<=TODAY(),' + stage + '<>"Won",' + stage + '<>"Lost"),4,TRUE),"Nothing due. Good.")');
  s.getRange(t + 2, 4, 200, 1).setNumberFormat('dd mmm');
  s.setColumnWidth(1, 230); s.setColumnWidth(3, 230); s.setColumnWidth(4, 150); s.setColumnWidth(7, 150);
  s.setFrozenRows(2);
}


// ======================= Bigin connection (Zoho, India data centre) =======================
//
// One-time setup (keys never leave your Google account):
//  1. In the Zoho API Console (api-console.zoho.in) create a Self Client.
//  2. Apps Script → Project Settings → Script properties → add ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET.
//  3. In the Self Client, "Generate Code" with scope
//       ZohoBigin.modules.ALL,ZohoBigin.settings.READ,ZohoBigin.users.READ
//     and add it as script property ZOHO_GRANT_CODE (it expires in the minutes you chose).
//  4. Run zohoConnect from the toolbar. It swaps the code for a long-lived key, finds your
//     pipeline, and logs what it found. Then run zohoTest to send one test deal.

const ZOHO = { accounts: 'https://accounts.zoho.in', api: 'https://www.zohoapis.in/bigin/v2' };
const BIGIN_STAGE_NEW = 'Audit requested';

function props_() { return PropertiesService.getScriptProperties(); }
// Phone for Bigin: digits and a leading + only (the sheet's apostrophe guard would make Zoho reject it).
function phone_(v) { const s = String(v == null ? '' : v).trim(); return (s.charAt(0) === '+' ? '+' : '') + s.replace(/\D/g, '').slice(0, 15); }

function zohoConnect() {
  const p = props_(), id = p.getProperty('ZOHO_CLIENT_ID'), secret = p.getProperty('ZOHO_CLIENT_SECRET'), code = p.getProperty('ZOHO_GRANT_CODE');
  if (!id || !secret || !code) throw new Error('Add ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET and ZOHO_GRANT_CODE in Project Settings → Script properties first.');
  const r = UrlFetchApp.fetch(ZOHO.accounts + '/oauth/v2/token', { method: 'post', muteHttpExceptions: true,
    payload: { grant_type: 'authorization_code', client_id: id.trim(), client_secret: secret.trim(), code: code.trim() } });
  const j = JSON.parse(r.getContentText() || '{}');
  if (!j.refresh_token) throw new Error('Zoho did not return a key. Reply was: ' + r.getContentText() + '  (Grant codes expire quickly: generate a new one and run again.)');
  p.setProperty('ZOHO_REFRESH_TOKEN', j.refresh_token);
  p.deleteProperty('ZOHO_GRANT_CODE');
  CacheService.getScriptCache().put('zoho_access', j.access_token, 3000);
  console.log('Connected to Bigin. Long-lived key saved.');
  zohoDiscover_();
}

function zohoToken_() {
  const cache = CacheService.getScriptCache(), hit = cache.get('zoho_access');
  if (hit) return hit;
  const p = props_(), rt = p.getProperty('ZOHO_REFRESH_TOKEN');
  if (!rt) throw new Error('Bigin is not connected yet (run zohoConnect).');
  const r = UrlFetchApp.fetch(ZOHO.accounts + '/oauth/v2/token', { method: 'post', muteHttpExceptions: true,
    payload: { grant_type: 'refresh_token', refresh_token: rt, client_id: p.getProperty('ZOHO_CLIENT_ID').trim(), client_secret: p.getProperty('ZOHO_CLIENT_SECRET').trim() } });
  const j = JSON.parse(r.getContentText() || '{}');
  if (!j.access_token) throw new Error('Could not refresh the Bigin key: ' + r.getContentText());
  cache.put('zoho_access', j.access_token, 3000);
  return j.access_token;
}

function zohoFetch_(method, path, body) {
  const opt = { method: method, muteHttpExceptions: true, contentType: 'application/json',
                headers: { Authorization: 'Zoho-oauthtoken ' + zohoToken_() } };
  if (body) opt.payload = JSON.stringify(body);
  const r = UrlFetchApp.fetch(ZOHO.api + path, opt), code = r.getResponseCode(), text = r.getContentText();
  if (code === 204) return {};
  if (code >= 300) throw new Error('Bigin ' + method.toUpperCase() + ' ' + path + ' → ' + code + ': ' + text.slice(0, 500));
  return text ? JSON.parse(text) : {};
}

// Finds the team pipeline (prefers one named "Sales"), its sub-pipeline and stages; saves the ids.
function zohoDiscover_() {
  const p = props_();
  const lay = zohoFetch_('get', '/settings/layouts?module=Pipelines');
  const layouts = lay.layouts || [];
  console.log('Pipelines found: ' + layouts.map(l => l.name + ' (' + l.id + ')').join(', '));
  const pick = layouts.find(l => /sales/i.test(l.name)) || layouts[0];
  if (!pick) throw new Error('No pipeline found in Bigin.');
  p.setProperty('ZOHO_PIPELINE_ID', String(pick.id));
  p.setProperty('ZOHO_PIPELINE_NAME', pick.name);
  const f = zohoFetch_('get', '/settings/fields?module=Pipelines');
  const field = n => (f.fields || []).find(x => x.api_name === n);
  const sub = field('Sub_Pipeline'), stage = field('Stage');
  const subVals = sub && sub.pick_list_values ? sub.pick_list_values.map(v => v.display_value || v.actual_value) : [];
  const ours = subVals.find(v => v.indexOf(pick.name) === 0) || subVals[0] || '';
  p.setProperty('ZOHO_SUB_PIPELINE', ours);
  console.log('Using pipeline "' + pick.name + '", sub-pipeline "' + ours + '". All sub-pipelines: ' + subVals.join(', '));
  if (stage && stage.pick_list_values) console.log('Stages Bigin knows: ' + stage.pick_list_values.map(v => v.display_value).join(' | '));
}

function biginFindOrCreate_(module, field, value, record) {
  if (value) {
    try {
      const s = zohoFetch_('get', '/' + module + '/search?criteria=' + encodeURIComponent('(' + field + ':equals:' + value + ')'));
      if (s.data && s.data[0]) return s.data[0].id;
    } catch (e) { console.warn('Search skipped: ' + e.message); }
  }
  const c = zohoFetch_('post', '/' + module, { data: [record] });
  const row = c.data && c.data[0];
  if (!row || row.status !== 'success') throw new Error('Could not create ' + module + ': ' + JSON.stringify(c).slice(0, 400));
  return row.details.id;
}

// Adds one website enquiry to Bigin. Never throws: returns a line for the alert email.
function addToBigin_(d, ref) {
  const p = props_();
  if (!p.getProperty('ZOHO_REFRESH_TOKEN')) return '';
  try {
    const company = clean_(d.company, 120), name = clean_(d.name, 100);
    const parts = name.split(/\s+/), last = parts.length > 1 ? parts.pop() : (parts[0] || 'Unknown'), first = parts.join(' ');
    const accountId = biginFindOrCreate_('Accounts', 'Account_Name', company, { Account_Name: company });
    const email = clean_(d.email, 120);
    const contactId = biginFindOrCreate_('Contacts', 'Email', email, {
      First_Name: first, Last_Name: last, Email: email || undefined, Mobile: phone_(d.phone) || undefined,
      Account_Name: { id: accountId } });
    const close = new Date(); close.setDate(close.getDate() + 14);
    const deal = { Deal_Name: company + ' · ' + (clean_(d.type, 60) || 'Website enquiry'), Stage: BIGIN_STAGE_NEW,
      Pipeline: { id: p.getProperty('ZOHO_PIPELINE_ID'), name: p.getProperty('ZOHO_PIPELINE_NAME') },
      Closing_Date: Utilities.formatDate(close, 'Asia/Kolkata', 'yyyy-MM-dd'),
      Account_Name: { id: accountId }, Contact_Name: { id: contactId },
      Description: [ref, 'Industry: ' + clean_(d.process, 60), 'Biggest problem: ' + clean_(d.material, 80), clean_(d.desc, 800)].join('\n') };
    const sub = p.getProperty('ZOHO_SUB_PIPELINE'); if (sub) deal.Sub_Pipeline = sub;
    const res = zohoFetch_('post', '/Pipelines', { data: [deal] });
    const row = res.data && res.data[0];
    if (!row || row.status !== 'success') throw new Error(JSON.stringify(res).slice(0, 400));
    return 'Added to Bigin as a deal at "' + BIGIN_STAGE_NEW + '".';
  } catch (err) {
    console.error(err);
    return 'Bigin sync FAILED (the sheet and this email have everything): ' + String(err.message || err).slice(0, 300);
  }
}

// Sends one test enquiry to Bigin and logs the result. Delete the test deal in Bigin afterwards.
function zohoTest() {
  const line = addToBigin_({ company: 'Bigin test (delete me)', name: 'Test Rohan', email: '', phone: '',
    type: 'Free website audit', process: 'CNC and engineering', material: 'Too few enquiries', desc: 'Test from Apps Script' }, 'RFQ-TEST');
  console.log(line || 'Bigin is not connected yet: run zohoConnect first.');
}


// ======================= One-time import: Pipeline tab → Bigin =======================
// Run importShortlistToBigin from the toolbar. Each open company in the Pipeline tab becomes a company,
// a contact (a placeholder "Owner (to find)" when we don't know a name yet: Bigin needs one per deal)
// and a deal at the same stage, plus a task for the next action.
// It writes the deal id into "Bigin ID" and the task result into "Bigin task", so it is safe to run again:
// rows already sent are skipped, failed rows are retried, and existing companies are reused.

function biginCreate_(module, full, minimal) {
  try {
    const r = zohoFetch_('post', '/' + module, { data: [full] });
    const row = r.data && r.data[0];
    if (row && row.status === 'success') return row.details.id;
    throw new Error(JSON.stringify(r).slice(0, 300));
  } catch (e) {
    if (!minimal) throw e;
    console.warn(module + ': retrying with fewer fields (' + String(e.message).slice(0, 160) + ')');
    const r = zohoFetch_('post', '/' + module, { data: [minimal] });
    const row = r.data && r.data[0];
    if (row && row.status === 'success') return row.details.id;
    throw new Error(module + ' failed: ' + JSON.stringify(r).slice(0, 300));
  }
}

// Zoho search needs ( ) , and \ escaped inside a criteria value.
function biginSearchId_(module, field, value) {
  if (!value) return null;
  const esc = String(value).replace(/([(),\\])/g, '\\$1');
  try {
    const s = zohoFetch_('get', '/' + module + '/search?criteria=' + encodeURIComponent('(' + field + ':equals:' + esc + ')'));
    return s.data && s.data[0] ? s.data[0].id : null;
  } catch (e) { console.warn('Search in ' + module + ' failed for "' + value + '": ' + String(e.message).slice(0, 120)); return null; }
}

// Bigin links a task to a deal differently from Zoho CRM. Try the known shapes once, remember the one that works.
function biginTask_(dealId, subject, due) {
  const p = props_();
  const shapes = {
    related:  { Subject: subject, Due_Date: due, Related_To: { id: dealId }, $related_module: 'Pipelines' },
    relatedM: { Subject: subject, Due_Date: due, Related_To: { id: dealId, module: { api_name: 'Pipelines' } } },
    whatDeals:{ Subject: subject, Due_Date: due, What_Id: { id: dealId }, $se_module: 'Deals' },
    plain:    { Subject: subject, Due_Date: due }
  };
  const known = p.getProperty('BIGIN_TASK_SHAPE');
  const order = known ? [known] : ['related', 'relatedM', 'whatDeals', 'plain'];
  let last;
  for (const k of order) {
    try {
      const id = biginCreate_('Tasks', shapes[k]);
      if (!known) { p.setProperty('BIGIN_TASK_SHAPE', k); console.log('Bigin tasks: using the "' + k + '" link style.'); }
      return k === 'plain' ? 'yes (not linked to the deal)' : 'yes';
    } catch (e) { last = e; }
  }
  throw last;
}

function importShortlistToBigin() {
  const p = props_();
  if (!p.getProperty('ZOHO_REFRESH_TOKEN')) throw new Error('Bigin is not connected yet (run zohoConnect).');
  const sh = pipeline_();
  const ensureCol = name => {
    const head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    let c = head.indexOf(name) + 1;
    if (!c) { c = sh.getLastColumn() + 1; sh.getRange(1, c).setValue(name).setFontWeight('bold').setFontColor('#FFFFFF').setBackground('#1C1F4A'); }
    return c;
  };
  const idCol = ensureCol('Bigin ID'), taskCol = ensureCol('Bigin task');
  const n = sh.getLastRow() - 1;
  if (n < 1) { console.log('Pipeline tab is empty.'); return; }
  const width = Math.max(idCol, taskCol, P_HEADERS.length);
  const rows = sh.getRange(2, 1, n, width).getValues();
  const v = (r, h) => String(r[P[h] - 1] == null ? '' : r[P[h] - 1]).replace(/^'/, '').trim();
  const day = d => Utilities.formatDate(d instanceof Date ? d : new Date(), 'Asia/Kolkata', 'yyyy-MM-dd');
  let sent = 0, tasks = 0, skipped = 0, failed = 0;
  rows.forEach((r, i) => {
    const company = v(r, 'Company'), stage = v(r, 'Stage');
    if (!company) return;
    const idCell = String(r[idCol - 1] || ''), taskCell = String(r[taskCol - 1] || '');
    if (idCell === 'sent by website form' || /delete me/i.test(company) || stage === 'Won' || stage === 'Lost') { skipped++; return; }
    if (v(r, 'Source') === 'Website (inbound)' && v(r, 'Ref')) { sh.getRange(i + 2, idCol).setValue('sent by website form'); skipped++; return; }
    let dealId = /^\d{6,}$/.test(idCell) ? idCell : '';
    try {
      if (!dealId) {
        const web = v(r, 'Website').replace(/\s*\(.*\)\s*$/, '');
        const about = [v(r, 'Industry') && 'Industry: ' + v(r, 'Industry'), v(r, 'City') && 'City: ' + v(r, 'City'), v(r, 'Notes')].filter(Boolean).join('\n');
        const accountId = biginSearchId_('Accounts', 'Account_Name', company) || biginCreate_('Accounts',
          { Account_Name: company, Website: /\./.test(web) ? 'https://' + web.replace(/^https?:\/\//, '') : undefined, Description: about },
          { Account_Name: company });
        const person = v(r, 'Contact');
        let first = '', last = 'Owner (to find)', title = 'Find on LinkedIn';
        if (person) { const parts = person.split(/\s+/); last = parts.length > 1 ? parts.pop() : parts[0]; first = parts.join(' '); title = v(r, 'Role'); }
        const email = v(r, 'Email');
        const contactId = (email && biginSearchId_('Contacts', 'Email', email)) || biginCreate_('Contacts',
          { First_Name: first || undefined, Last_Name: last, Title: title || undefined, Email: email || undefined,
            Mobile: phone_(v(r, 'Phone')) || undefined, Account_Name: { id: accountId } },
          { Last_Name: last, Account_Name: { id: accountId } });
        const close = new Date(); close.setDate(close.getDate() + 30);
        const deal = { Deal_Name: company + ' · Website', Stage: stage || 'Researched',
          Pipeline: { id: p.getProperty('ZOHO_PIPELINE_ID'), name: p.getProperty('ZOHO_PIPELINE_NAME') },
          Closing_Date: day(close), Account_Name: { id: accountId }, Contact_Name: { id: contactId },
          Description: ['Hook: ' + v(r, 'Hook (one problem we spotted)'), 'Demo to send: ' + v(r, 'Demo to send'),
                        'Channel: ' + v(r, 'Channel'), 'Fit: ' + v(r, 'Fit (1-5)') + '/5', 'Pipeline ID: ' + v(r, 'ID')].join('\n') };
        const amount = Number(r[P['Deal value (₹)'] - 1]); if (amount) deal.Amount = amount;
        const sub = p.getProperty('ZOHO_SUB_PIPELINE'); if (sub) deal.Sub_Pipeline = sub;
        dealId = biginCreate_('Pipelines', deal);
        sh.getRange(i + 2, idCol).setValue(dealId);
        sent++;
      } else { skipped++; }
      const next = v(r, 'Next action');
      if (next && !/^yes/.test(taskCell)) {
        try {
          const due = r[P['Due'] - 1];
          sh.getRange(i + 2, taskCol).setValue(biginTask_(dealId, next + ' · ' + company, day(due)));
          tasks++;
        } catch (e) { sh.getRange(i + 2, taskCol).setValue('FAILED: ' + String(e.message).slice(0, 160)); console.warn('Task not created for ' + company + ': ' + String(e.message).slice(0, 200)); }
      }
      Utilities.sleep(250);
    } catch (e) {
      failed++;
      sh.getRange(i + 2, idCol).setValue('FAILED: ' + String(e.message).slice(0, 180));
      console.error(company + ': ' + e.message);
    }
  });
  console.log('Done. New deals: ' + sent + ' · tasks created: ' + tasks + ' · already there or skipped: ' + skipped + ' · failed: ' + failed + '.');
}
