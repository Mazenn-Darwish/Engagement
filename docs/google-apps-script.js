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

const SONG_SHEET      = 'Songs';
const BLESSING_SHEET  = 'Blessings';
const GUESTBOOK_SHEET = 'Guestbook';
const ANALYTICS_SHEET = 'Analytics';

const SONG_HEADERS      = ['Timestamp', 'Guest Name', 'Song Title', 'Artist', 'Why This Song'];
const BLESSING_HEADERS  = ['Timestamp', 'Guest Name', 'Message'];
const GUESTBOOK_HEADERS = ['Timestamp', 'Guest Name', 'Signature (base64 PNG)'];
const ANALYTICS_HEADERS = ['Timestamp'];

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
            sheet.appendRow([new Date().toLocaleString()]);
            return jsonResponse({ success: true, type: 'visit' });
        }

        return jsonResponse({ success: false, error: 'Unknown type: ' + (data.type || 'none') });

    } catch (err) {
        return jsonResponse({ success: false, error: err.message });
    }
}

// Handles CORS OPTIONS preflight and can be used to health-check the URL
function doGet() {
    return jsonResponse({ status: 'ok', message: 'Webhook is live.' });
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
