using System.Text.Json;
using INV.Models;
using Microsoft.JSInterop;

namespace INV.Services;

public class DashboardService(IJSRuntime js)
{
    private const string BaseUrl = "https://script.google.com/macros/s/AKfycbxdztj6hVbv5g6jI9exXrESUBTGmNE4yy8hbEFYJOv7NfQHsodKPLlhDCMc7S7jw7RT/exec";

    public Task<List<AnalyticsRow>?> GetAnalyticsAsync(string key) => FetchAsync<AnalyticsRow>("analytics", key);
    public Task<List<RsvpRow>?> GetRsvpsAsync(string key)          => FetchAsync<RsvpRow>("rsvps", key);
    public Task<List<SongRow>?> GetSongsAsync(string key)          => FetchAsync<SongRow>("songs", key);
    public Task<List<BlessingRow>?> GetBlessingsAsync(string key)  => FetchAsync<BlessingRow>("blessings", key);
    public Task<List<GuestbookRow>?> GetGuestbookAsync(string key) => FetchAsync<GuestbookRow>("guestbook", key);

    private async Task<List<T>?> FetchAsync<T>(string sheet, string key)
    {
        try
        {
            var url  = $"{BaseUrl}?key={Uri.EscapeDataString(key)}&sheet={sheet}";
            var json = await js.InvokeAsync<string?>("fetchSheetData", url);
            if (string.IsNullOrEmpty(json) || json.TrimStart().StartsWith("{\"error\""))
                return null;
            return JsonSerializer.Deserialize<List<T>>(json);
        }
        catch { return null; }
    }
}
