using System.Text.Json;
using System.Text.Json.Serialization;
using INV.Models;

namespace INV.Services;

public class MusicSearchService(HttpClient http)
{
    private const string ScriptUrl =
        "https://script.google.com/macros/s/AKfycbxdztj6hVbv5g6jI9exXrESUBTGmNE4yy8hbEFYJOv7NfQHsodKPLlhDCMc7S7jw7RT/exec";

    public async Task<List<SongSearchResult>> SearchAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query)) return [];

        try
        {
            var url  = $"{ScriptUrl}?action=musicSearch&q={Uri.EscapeDataString(query)}";
            var json = await http.GetStringAsync(url);
            var resp = JsonSerializer.Deserialize<MusicSearchResponse>(json);

            if (resp is not { Success: true }) return [];

            return resp.Results
                .Where(r => !string.IsNullOrEmpty(r.TrackName))
                .Select(r => new SongSearchResult(r.TrackName!, r.ArtistName ?? "", r.ArtworkUrl100))
                .ToList();
        }
        catch
        {
            return [];
        }
    }
}

internal sealed class MusicSearchResponse
{
    [JsonPropertyName("success")] public bool              Success { get; set; }
    [JsonPropertyName("results")] public List<ItunesTrack> Results { get; set; } = [];
    [JsonPropertyName("message")] public string?           Message { get; set; }
}

internal sealed class ItunesTrack
{
    [JsonPropertyName("trackName")]     public string? TrackName     { get; set; }
    [JsonPropertyName("artistName")]    public string? ArtistName    { get; set; }
    [JsonPropertyName("artworkUrl100")] public string? ArtworkUrl100 { get; set; }
}
