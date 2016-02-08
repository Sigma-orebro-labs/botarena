using GosuArena.Entities;

namespace GosuArena.Models.Match
{
    public class ApiBotCreateModel
    {
        public string Name { get; set; }
        public string ColorHexCode { get; set; }
        public string ClassName { get; set; }
        public string Weapon { get; set; }
        public string[] Equipment { get; set; }
        public string[] Powerups { get; set; }
    }
}