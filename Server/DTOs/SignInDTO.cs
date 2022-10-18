using System.ComponentModel.DataAnnotations;

namespace ToDo.DTOs
{
    public partial class SignInDTO
    {
        [Required]
        public string? Id { get; set; }
        [Required]
        public string? Password { get; set; }
    }
    
}
