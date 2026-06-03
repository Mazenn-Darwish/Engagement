using System.Net.Http.Json;
using System.Text.Json.Serialization;
using INV.Models;

namespace INV.Services;

public class MusicSearchService(HttpClient http)
{
    public async Task<List<SongSearchResult>> SearchAsync(string query)
    {
        try
        {
            var url = $"https://itunes.apple.com/search?term={Uri.EscapeDataString(query)}&media=music&entity=song&limit=6";
            var response = await http.GetFromJsonAsync<ItunesResponse>(url);
            return response?.Results
                .Where(r => !string.IsNullOrEmpty(r.TrackName))
                .Select(r => new SongSearchResult(r.TrackName!, r.ArtistName ?? "", r.ArtworkUrl100))
                .ToList() ?? [];
        }
        catch
        {
            return [];
        }
    }
}

internal sealed class ItunesResponse
{
    [JsonPropertyName("results")]
    public List<ItunesTrack> Results { get; set; } = [];
}

internal sealed class ItunesTrack
{
    [JsonPropertyName("trackName")]    public string? TrackName    { get; set; }
    [JsonPropertyName("artistName")]   public string? ArtistName   { get; set; }
    [JsonPropertyName("artworkUrl100")] public string? ArtworkUrl100 { get; set; }
}
