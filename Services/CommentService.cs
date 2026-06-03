using System.Net.Http.Json;
using INV.Models;

namespace INV.Services;

public class CommentService(HttpClient http)
{
    // Paste your Google Apps Script Web App URL here to save to Google Sheets.
    // Leave as-is and submissions still succeed locally (no data persisted to a sheet).
    private const string WebhookUrl = "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec";

    private static bool IsConfigured =>
        !WebhookUrl.Contains("1QhJfs-GgZuBUDpLUWRrsLkRhBAYDCIjJWwnWJkQENxEaqpWMuTDlNQDw");

    public async Task<bool> SubmitAsync(CommentModel model)
    {
        if (!IsConfigured) return true; // demo mode — UI works, nothing saved remotely

        try
        {
            var payload = new
            {
                type      = "blessing",
                guestName = model.GuestName,
                message   = model.Message
            };
            var response = await http.PostAsJsonAsync(WebhookUrl, payload);
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }
}
