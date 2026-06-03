using System.Net.Http.Json;
using INV.Models;

namespace INV.Services;

public class CommentService(HttpClient http)
{
    // Paste your Google Apps Script Web App URL here to save to Google Sheets.
    // Leave as-is and submissions still succeed locally (no data persisted to a sheet).
    private const string WebhookUrl = "https://script.google.com/macros/s/1ulhW1fyq6tGiWwxRYStHzdnkrJXOpGtsvYHWS9zbKd5Kt2H2yc4hos6x/exec";

    private static bool IsConfigured =>
        !WebhookUrl.Contains("1ulhW1fyq6tGiWwxRYStHzdnkrJXOpGtsvYHWS9zbKd5Kt2H2yc4hos6x");

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
