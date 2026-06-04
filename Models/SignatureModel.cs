using System.ComponentModel.DataAnnotations;

namespace INV.Models;

public class SignatureModel
{
    [Required(ErrorMessage = "Please enter your name")]
    public string GuestName { get; set; } = "";

    public string SignatureData { get; set; } = ""; // base64 PNG, set from canvas before submit
}
