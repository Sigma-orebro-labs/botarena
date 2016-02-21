using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace GosuArena.Models.Commander
{
    public class GameModel
    {
        public GameModel(string id)
        {
            Id = id;
            Name = id;
            LastPingTime = DateTime.Now;
        }

        public static GameModel CreateCopyForUser(GameModel gameModel, int userId)
        {
            var copyForUser = new GameModel(gameModel.Id);

            if (gameModel.Bots != null)
            {
                copyForUser.Bots = gameModel.Bots.Where(x => x.UserId == userId).ToList();
            }

            return copyForUser;
        }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("bots")]
        public List<CommanderBotModel> Bots { get; set; }

        [JsonProperty("lastPingTime")]
        public DateTime LastPingTime { get; set; }
    }
}