using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.Localization.Dto
{
    public class CreateOrUpdateLanguageInput
    {
        [Required]
        public ApplicationLanguageEditDto Language { get; set; }
    }
}