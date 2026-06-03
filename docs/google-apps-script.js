/**
 * Google Apps Script — RSVP webhook
 *
 * Setup:
 *  1. Go to https://script.google.com and create a new project.
 *  2. Open or create a Google Sheet; paste this script into the editor.
 *  3. Click Deploy → New deployment → Web app.
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  4. Copy the deployment URL and paste it into Services/RsvpService.cs (WebhookUrl).
 *  5. Re-deploy after any code change (use "Manage deployments" → edit the existing one).
 */

const RSVP_SHEET     = 'RSVPs';
const SONG_SHEET     = 'Songs';
const BLESSING_SHEET = 'Blessings';
const RSVP_HEADERS = ['Timestamp', 'Full Name', 'Email', 'Attending', 'Guests', 'Note'];
const SONG_HEADERS = ['Timestamp', 'Guest Name', 'Song Title', 'Artist', 'Why This Song'];

// Keep old name as alias so any existing code still works
const SHEET_NAME = RSVP_SHEET;
const HEADERS    = RSVP_HEADERS;

function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);

        if (data.type === 'blessing') {
            const sheet = getOrCreateNamedSheet(BLESSING_SHEET, ['Timestamp', 'Guest Name', 'Message']);
            sheet.appendRow([new Date().toLocaleString(), data.guestName || '', data.message || '']);
            return jsonResponse({ success: true, type: 'blessing' });
        }

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

        const sheet = getOrCreateNamedSheet(RSVP_SHEET, RSVP_HEADERS);

        sheet.appendRow([
            new Date().toLocaleString(),
            data.fullName  || '',
            data.email     || '',
            data.attending === 'yes' ? 'Yes' : 'No',
            data.attending === 'yes' ? (Number(data.guestCount) || 1) : 0,
            data.note      || ''
        ]);

        return jsonResponse({ success: true });
    } catch (err) {
        return jsonResponse({ success: false, error: err.message });
    }
}

// Handles browser CORS OPTIONS preflight and can be used to health-check the URL
function doGet() {
    return jsonResponse({ status: 'ok', message: 'RSVP webhook is live.' });
}

function getOrCreateSheet() {
    return getOrCreateNamedSheet(RSVP_SHEET, RSVP_HEADERS);
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
