using System.ComponentModel.DataAnnotations;

namespace INV.Models;

public class RsvpModel
{
    [Required(ErrorMessage = "Please enter your full name.")]
    public string FullName { get; set; } = "";

    [Required]
    public string Attending { get; set; } = "yes";

    [Range(1, 10, ErrorMessage = "Please enter a number between 1 and 10.")]
    public int GuestCount { get; set; } = 1;

    public string? Note { get; set; }
}
