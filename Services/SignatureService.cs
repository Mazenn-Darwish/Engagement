using Microsoft.JSInterop;
using INV.Models;

namespace INV.Services;

public class SignatureService(IJSRuntime js)
{
    private const string WebhookUrl = "https://script.google.com/macros/s/AKfycbxdztj6hVbv5g6jI9exXrESUBTGmNE4yy8hbEFYJOv7NfQHsodKPLlhDCMc7S7jw7RT/exec";

    public async Task<bool> SubmitAsync(SignatureModel model)
    {
        try
        {
            var payload = new
            {
                type      = "signature",
                guestName = model.GuestName,
                signature = model.SignatureData
            };
            return await js.InvokeAsync<bool>("postToSheet", WebhookUrl, payload);
        }
        catch
        {
            return false;
        }
    }
}
