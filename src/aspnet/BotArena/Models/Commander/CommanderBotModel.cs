using Newtonsoft.Json;

namespace GosuArena.Models.Commander
{
    public class CommanderBotModel
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("health")]
        public int Health { get; set; }

        [JsonProperty("events")]
        public string[] Events { get; set; }
    }
}