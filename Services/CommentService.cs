using System.Net.Http.Json;
using INV.Models;

namespace INV.Services;

public class CommentService(HttpClient http)
{
    // TODO: Same Google Apps Script Web App URL as SongService
    private const string WebhookUrl = "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec";

    public async Task<bool> SubmitAsync(CommentModel model)
    {
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
