using System.Collections.Generic;
using System.Linq;
using GosuArena.Entities;

namespace GosuArena.Models.Controls
{
    public class QuickMatchSetupModel
    {
        public QuickMatchSetupModel()
        {
            Bots = new List<Bot>();
            PreselectedBots = new List<Bot>();
        }

        public string Title { get; set; }
        public string InfoMessage { get; set; }
        public IList<Bot> Bots { get; set; }
        public IList<Bot> PreselectedBots { get; set; }
        public bool ShouldOpenNewTab { get; set; }
        public bool IsTraining { get; set; }
        
        public IList<Bot> SelectableBots
        {
            get
            {
                return Bots.Where(bot => PreselectedBots.All(preselected => preselected.Id != bot.Id)).ToList();
            }
        }
    }
}