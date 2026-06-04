/**
 * Google Apps Script — engagement website webhook
 *
 * Setup:
 *  1. Go to https://script.google.com and create a new project.
 *  2. Open or create a Google Sheet; paste this script into the editor.
 *  3. Click Deploy → New deployment → Web app.
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  4. Copy the deployment URL and paste it into each Service file (WebhookUrl).
 *  5. Re-deploy after any code change (Manage deployments → edit existing one).
 *
 * Sheets created automatically:
 *   Songs      — song suggestions
 *   Blessings  — comments / messages
 *   Guestbook  — drawn signatures (base64 PNG)
 *   Analytics  — one row per page visit (timestamp only)
 */

// ── Admin key — CHANGE THIS before deploying, then use it to log in to /dashboard ──
const ADMIN_KEY = '1uR-PA1lp3ZfrILnYUymQJnmNw-tcYvjlU8HBw2s-sJRgr76F7uozOGJb';

const SONG_SHEET      = 'Songs';
const BLESSING_SHEET  = 'Blessings';
const GUESTBOOK_SHEET = 'Guestbook';
const ANALYTICS_SHEET = 'Analytics';

const SONG_HEADERS      = ['Timestamp', 'Guest Name', 'Song Title', 'Artist', 'Why This Song'];
const BLESSING_HEADERS  = ['Timestamp', 'Guest Name', 'Message'];
const GUESTBOOK_HEADERS = ['Timestamp', 'Guest Name', 'Signature (base64 PNG)'];
const ANALYTICS_HEADERS = ['Timestamp', 'IP Address', 'City', 'Region', 'Country', 'ISP / Network', 'Device', 'OS', 'Model', 'Browser', 'Screen'];

function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);

        if (data.type === 'song') {
            const sheet = getOrCreateNamedSheet(SONG_SHEET, SONG_HEADERS);
            sheet.appendRow([
                new Date().toLocaleString(),
                data.guestName || '',
                data.songTitle || '',
                data.artist    || '',
                data.note      || ''
            ]);
            return jsonResponse({ success: true, type: 'song' });
        }

        if (data.type === 'blessing') {
            const sheet = getOrCreateNamedSheet(BLESSING_SHEET, BLESSING_HEADERS);
            sheet.appendRow([new Date().toLocaleString(), data.guestName || '', data.message || '']);
            return jsonResponse({ success: true, type: 'blessing' });
        }

        if (data.type === 'signature') {
            const sheet = getOrCreateNamedSheet(GUESTBOOK_SHEET, GUESTBOOK_HEADERS);
            sheet.appendRow([new Date().toLocaleString(), data.guestName || '', data.signature || '']);
            return jsonResponse({ success: true, type: 'signature' });
        }

        if (data.type === 'visit') {
            const sheet = getOrCreateNamedSheet(ANALYTICS_SHEET, ANALYTICS_HEADERS);
            sheet.appendRow([
                new Date().toLocaleString(),
                data.ip         || '',
                data.city       || '',
                data.region     || '',
                data.country    || '',
                data.isp        || '',
                data.deviceType || '',
                data.os         || '',
                data.model      || '',
                data.browser    || '',
                data.screenSize || ''
            ]);
            return jsonResponse({ success: true, type: 'visit' });
        }

        return jsonResponse({ success: false, error: 'Unknown type: ' + (data.type || 'none') });

    } catch (err) {
        return jsonResponse({ success: false, error: err.message });
    }
}

// Authenticated data reader for the /dashboard page
function doGet(e) {
    const key   = (e.parameter && e.parameter.key)   || '';
    const sheet = (e.parameter && e.parameter.sheet) || '';

    if (!key || !sheet) {
        return jsonResponse({ status: 'ok', message: 'Webhook is live.' });
    }

    if (key !== ADMIN_KEY) {
        return jsonResponse({ error: 'Unauthorized' });
    }

    const sheetMap = {
        analytics: ANALYTICS_SHEET,
        songs:     SONG_SHEET,
        blessings: BLESSING_SHEET,
        guestbook: GUESTBOOK_SHEET
    };

    const name = sheetMap[sheet];
    if (!name) return jsonResponse({ error: 'Unknown sheet: ' + sheet });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(name);
    if (!sh || sh.getLastRow() < 2) {
        return ContentService.createTextOutput('[]').setMimeType(ContentService.MimeType.JSON);
    }

    const data    = sh.getDataRange().getValues();
    const headers = data[0].map(String);
    const rows    = data.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = (row[i] == null) ? '' : String(row[i]); });
        return obj;
    });

    return ContentService
        .createTextOutput(JSON.stringify(rows))
        .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateNamedSheet(name, headers) {
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    let   sheet = ss.getSheetByName(name);

    if (!sheet) {
        sheet = ss.insertSheet(name);
        const header = sheet.getRange(1, 1, 1, headers.length);
        header.setValues([headers]);
        header.setFontWeight('bold');
        header.setBackground('#2d5a27');
        header.setFontColor('#f5efe6');
        sheet.setFrozenRows(1);
        sheet.setColumnWidth(1, 160);
        sheet.setColumnWidth(2, 180);
        sheet.setColumnWidth(3, 220);
    }

    return sheet;
}

function jsonResponse(obj) {
    return ContentService
        .createTextOutput(JSON.stringify(obj))
        .setMimeType(ContentService.MimeType.JSON);
}
