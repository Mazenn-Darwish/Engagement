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

const SHEET_NAME = 'RSVPs';
const HEADERS    = ['Timestamp', 'Full Name', 'Email', 'Attending', 'Guests', 'Note'];

function doPost(e) {
    try {
        const data  = JSON.parse(e.postData.contents);
        const sheet = getOrCreateSheet();

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
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    let   sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
        const header = sheet.getRange(1, 1, 1, HEADERS.length);
        header.setValues([HEADERS]);
        header.setFontWeight('bold');
        header.setBackground('#1a1410');
        header.setFontColor('#e8d5b0');
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
