using System.Collections.Generic;
using System.IO;
using System.Linq;
using GosuArena.Entities;

namespace GosuArena.Services
{
    public class FileBotRepository
    {
        private readonly string _botDirectory;

        public FileBotRepository(string botDirectory)
        {
            _botDirectory = botDirectory;
        }

        public IList<Bot> GetAll()
        {
            var id = int.MaxValue;

            var files = Directory.GetFiles(_botDirectory, "*.js");

            var bots = files.Select(LoadBot).ToList();

            // Initialize ids of all bots
            foreach (var bot in bots)
            {
                bot.Id = id--;
            }

            return bots;
        }

        private Bot LoadBot(string path)
        {
            var name = Path.GetFileNameWithoutExtension(path);
            var isDemoBot = false;

            if (name.StartsWith("demo."))
            {
                name = name.Substring("demo.".Length);
                isDemoBot = true;
            }

            return new Bot
            {
                Name = name,
                Script = File.ReadAllText(path),
                IsDemoBot = isDemoBot,
                IsTrainer = true
            };
        }
    }
}