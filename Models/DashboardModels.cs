using System.Text.Json.Serialization;

namespace INV.Models;

public class AnalyticsRow
{
    [JsonPropertyName("Timestamp")]     public string Timestamp { get; set; } = "";
    [JsonPropertyName("IP Address")]    public string IP        { get; set; } = "";
    [JsonPropertyName("City")]          public string City      { get; set; } = "";
    [JsonPropertyName("Region")]        public string Region    { get; set; } = "";
    [JsonPropertyName("Country")]       public string Country   { get; set; } = "";
    [JsonPropertyName("ISP / Network")] public string ISP       { get; set; } = "";
    [JsonPropertyName("Device")]        public string Device    { get; set; } = "";
    [JsonPropertyName("OS")]            public string OS        { get; set; } = "";
    [JsonPropertyName("Model")]         public string Model     { get; set; } = "";
    [JsonPropertyName("Browser")]       public string Browser   { get; set; } = "";
    [JsonPropertyName("Screen")]        public string Screen    { get; set; } = "";
}

public class RsvpRow
{
    [JsonPropertyName("Timestamp")]   public string Timestamp  { get; set; } = "";
    [JsonPropertyName("Full Name")]   public string FullName   { get; set; } = "";
    [JsonPropertyName("Attending")]   public string Attending  { get; set; } = "";
    [JsonPropertyName("Guest Count")] public string GuestCount { get; set; } = "";
    [JsonPropertyName("Note")]        public string Note       { get; set; } = "";
}

public class SongRow
{
    [JsonPropertyName("Timestamp")]     public string Timestamp { get; set; } = "";
    [JsonPropertyName("Guest Name")]    public string GuestName { get; set; } = "";
    [JsonPropertyName("Song Title")]    public string SongTitle { get; set; } = "";
    [JsonPropertyName("Artist")]        public string Artist    { get; set; } = "";
    [JsonPropertyName("Why This Song")] public string Note      { get; set; } = "";
}

public class BlessingRow
{
    [JsonPropertyName("Timestamp")]  public string Timestamp { get; set; } = "";
    [JsonPropertyName("Guest Name")] public string GuestName { get; set; } = "";
    [JsonPropertyName("Message")]    public string Message   { get; set; } = "";
}

public class GuestbookRow
{
    [JsonPropertyName("Timestamp")]              public string Timestamp     { get; set; } = "";
    [JsonPropertyName("Guest Name")]             public string GuestName     { get; set; } = "";
    [JsonPropertyName("Signature (base64 PNG)")] public string SignatureData { get; set; } = "";
}
