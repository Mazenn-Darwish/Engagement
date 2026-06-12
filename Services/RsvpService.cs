using Microsoft.JSInterop;
using INV.Models;

namespace INV.Services;

public class RsvpService(IJSRuntime js)
{
    private const string WebhookUrl = "https://script.google.com/macros/s/AKfycbxdztj6hVbv5g6jI9exXrESUBTGmNE4yy8hbEFYJOv7NfQHsodKPLlhDCMc7S7jw7RT/exec";

    public async Task<bool> SubmitAsync(RsvpModel model)
    {
        try
        {
            var payload = new
            {
                type       = "rsvp",
                fullName   = model.FullName,
                email      = model.Email,
                attending  = model.Attending,
                guestCount = model.Attending == "yes" ? model.GuestCount : 0,
                note       = model.Note ?? ""
            };
            return await js.InvokeAsync<bool>("postToSheet", WebhookUrl, payload);
        }
        catch
        {
            return false;
        }
    }
}
