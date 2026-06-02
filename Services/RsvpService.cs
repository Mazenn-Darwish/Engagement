using System.Net.Http.Json;
using INV.Models;

namespace INV.Services;

public class RsvpService(HttpClient http)
{
    // TODO: Replace with your deployed Google Apps Script Web App URL
    private const string WebhookUrl = "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec";

    public async Task<bool> SubmitAsync(RsvpModel model)
    {
        try
        {
            var payload = new
            {
                fullName = model.FullName,
                email    = model.Email,
                attending  = model.Attending,
                guestCount = model.Attending == "yes" ? model.GuestCount : 0,
                note = model.Note ?? ""
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
