using System.Security.Principal;
using GosuArena.Entities;
using GosuArena.Extensions;
using Yahoo.Yui.Compressor;

namespace GosuArena.Models.Match
{
    public class BotModel
    {
        public BotModel(Bot bot)
        {
            Id = bot.Id;
            Name = bot.Name;
            IsTrainer = bot.IsTrainer;
            IsDemoBot = bot.IsDemoBot;
            AuthorUsername = bot.AuthorUsername;
            UserId = bot.UserId;
            Script = bot.Script;
        }

        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public bool IsTrainer { get; set; }
        public bool IsDemoBot { get; set; }
        public string AuthorUsername { get; set; }
        public string Script { get; set; }
        public int TeamId { get; set; }

        public string GetScriptToRender(IPrincipal user)
        {
            var isBotWrittenByCurrentUser = user.UserId() == UserId;
            var shouldRenderPlainScript = isBotWrittenByCurrentUser || IsTrainer || IsDemoBot;

            var compressor = new JavaScriptCompressor();

            return shouldRenderPlainScript ? Script : compressor.Compress(Script);
        }
    }
}