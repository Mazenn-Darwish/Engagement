using System.ComponentModel.DataAnnotations;

namespace INV.Models;

public class SongModel
{
    [Required(ErrorMessage = "Please enter your name.")]
    public string GuestName { get; set; } = "";

    [Required(ErrorMessage = "Please enter the song title.")]
    public string SongTitle { get; set; } = "";

    [Required(ErrorMessage = "Please enter the artist name.")]
    public string Artist { get; set; } = "";

    public string? Note { get; set; }
}
