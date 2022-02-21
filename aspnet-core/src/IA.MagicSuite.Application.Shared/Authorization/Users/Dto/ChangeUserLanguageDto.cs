using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.Authorization.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}
