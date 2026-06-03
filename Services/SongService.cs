using System.Net.Http.Json;
using INV.Models;

namespace INV.Services;

public class SongService(HttpClient http)
{
    // Paste your Google Apps Script Web App URL here to save to Google Sheets.
    // Leave as-is and submissions still succeed locally (no data persisted to a sheet).
    private const string WebhookUrl = "https://script.google.com/macros/s/AKfycbyxotZMy71jckm8ZlDYArNT2T6I_D5kgS4ilGwm-MUkwmDnoUVJqV3UjiRMdvCOxDWO/exec";

    private static bool IsConfigured =>
        !WebhookUrl.Contains("YOUR_SCRIPT_ID_HERE");

    public async Task<bool> SubmitAsync(SongModel model)
    {
        if (!IsConfigured) return true; // demo mode — UI works, nothing saved remotely

        try
        {
            var payload = new
            {
                type      = "song",
                guestName = model.GuestName,
                songTitle = model.SongTitle,
                artist    = model.Artist,
                note      = model.Note ?? ""
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
