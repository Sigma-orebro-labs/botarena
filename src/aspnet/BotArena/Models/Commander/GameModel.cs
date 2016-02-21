using System.Collections.Generic;
using Newtonsoft.Json;

namespace GosuArena.Models.Commander
{
    public class GameModel
    {
        public GameModel(string id)
        {
            Id = id;
            Name = id;
        }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("bots")]
        public List<CommanderBotModel> Bots { get; set; }
    }
}