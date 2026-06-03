using System.ComponentModel.DataAnnotations;

namespace INV.Models;

public class CommentModel
{
    [Required(ErrorMessage = "Please enter your name.")]
    public string GuestName { get; set; } = "";

    [Required(ErrorMessage = "Please leave a message.")]
    [MaxLength(200, ErrorMessage = "Please keep your message under 200 characters.")]
    public string Message { get; set; } = "";
}
