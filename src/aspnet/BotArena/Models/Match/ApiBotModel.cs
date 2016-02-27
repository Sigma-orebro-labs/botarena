using System;
using GosuArena.Entities;

namespace GosuArena.Models.Match
{
    public class ApiBotModel
    {
        public ApiBotModel()
        {
        }

        public ApiBotModel(Bot bot)
        {
            Id = bot.Id;
            Name = bot.Name;
            AuthorUsername = bot.AuthorUsername;
            Script = bot.Script;
            IsPublic = bot.IsPublic;
            CreatedDate = bot.CreatedDate;
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string AuthorUsername { get; set; }
        public string Script { get; set; }
        public bool IsPublic { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}