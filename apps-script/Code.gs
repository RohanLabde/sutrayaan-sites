/**
 * Sutrayaan · website inquiry tracker (Google Sheets)
 * Receives quote requests from the website, saves each as a row,
 * emails the owner, and serves a privacy-safe list to the tracker page.
 *
 * Setup: paste into Extensions → Apps Script of the Google Sheet,
 * then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 */
const SHEET_NAME = 'Leads';
const ALERT_EMAIL = '';            // leave blank to email the sheet owner
const BUSINESS = 'Meru Precision (demo)';
const HEADERS = ['Ref','Received','Status','Type','Process','Name','Company','Email','Phone','City',
                 'Material','Quantity','Needed by','Description','Drawings','NDA','First response','Updated'];
const STATUSES = ['New','Contacted','Quoted','Won','Lost'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#DDEDEA');
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
      sh.getRange(row, 3).setValue(d.status);
      sh.getRange(row, 18).setValue(now);
      if (d.status !== 'New' && !sh.getRange(row, 17).getValue()) sh.getRange(row, 17).setValue(now);
      return json_({ ok: true });
    }

    if (d.website) return json_({ ok: true, ref: 'RFQ-0' });           // spam trap
    if (!clean_(d.name) || !clean_(d.company)) return json_({ ok: false, error: 'missing fields' });

    const now = new Date();
    const ref = 'RFQ-' + Utilities.formatDate(now, 'Asia/Kolkata', 'yyMMdd') + '-' + Math.floor(100 + Math.random() * 900);
    const files = Array.isArray(d.files) ? d.files.map(f => clean_(f, 120)).join(', ') : '';
    sh.appendRow([ref, now, 'New', clean_(d.type, 60), clean_(d.process, 60), clean_(d.name, 100), clean_(d.company, 120),
                  clean_(d.email, 120), clean_(d.phone, 40), clean_(d.city, 80), clean_(d.material, 80), clean_(d.qty, 80),
                  clean_(d.neededBy, 20), clean_(d.desc, 2000), files, d.nda ? 'Yes' : 'No', '', now]);

    const to = ALERT_EMAIL || Session.getEffectiveUser().getEmail();
    const body = [
      'New quote request ' + ref, '',
      'Company: ' + clean_(d.company), 'Name: ' + clean_(d.name),
      'Email: ' + clean_(d.email), 'Phone: ' + clean_(d.phone), 'City: ' + clean_(d.city), '',
      'Type: ' + clean_(d.type), 'Process: ' + clean_(d.process), 'Material: ' + clean_(d.material),
      'Quantity: ' + clean_(d.qty), 'Needed by: ' + clean_(d.neededBy), '',
      'Part: ' + clean_(d.desc, 2000), 'Drawings: ' + (files || '—'), 'NDA requested: ' + (d.nda ? 'Yes' : 'No'), '',
      'Open the sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
    ].join('\n');
    MailApp.sendEmail(to, 'New quote request ' + ref + ' · ' + clean_(d.company, 60) + ' · ' + BUSINESS, body);
    return json_({ ok: true, ref: ref });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Public list for the demo tracker: latest 50, no emails or phone numbers, first names only.
function doGet() {
  const sh = sheet_();
  const n = sh.getLastRow() - 1;
  if (n < 1) return json_({ ok: true, leads: [] });
  const rows = sh.getRange(2, 1, n, HEADERS.length).getValues().slice(-50).reverse();
  const leads = rows.filter(r => r[0]).map(r => ({
    ref: r[0], createdAt: r[1] instanceof Date ? r[1].toISOString() : String(r[1]), status: r[2],
    type: r[3], process: r[4], name: String(r[5]).split(' ')[0], company: r[6], city: r[9],
    material: r[10], qty: r[11], desc: String(r[13]).slice(0, 160),
    files: r[14] ? String(r[14]).split(', ') : [], nda: r[15] === 'Yes'
  }));
  return json_({ ok: true, leads: leads });
}
