using Microsoft.JSInterop;
using INV.Models;

namespace INV.Services;

public class SongService(IJSRuntime js)
{
    private const string WebhookUrl = "https://script.google.com/macros/s/AKfycbxdztj6hVbv5g6jI9exXrESUBTGmNE4yy8hbEFYJOv7NfQHsodKPLlhDCMc7S7jw7RT/exec";

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
            return await js.InvokeAsync<bool>("postToSheet", WebhookUrl, payload);
        }
        catch
        {
            return false;
        }
    }
}
