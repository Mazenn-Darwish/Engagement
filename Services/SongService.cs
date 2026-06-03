using System.Net.Http.Json;
using INV.Models;

namespace INV.Services;

public class SongService(HttpClient http)
{
    // TODO: Same Google Apps Script Web App URL as RsvpService
    private const string WebhookUrl = "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec";

    public async Task<bool> SubmitAsync(SongModel model)
    {
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
