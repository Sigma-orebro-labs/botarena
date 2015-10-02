using System;
using System.ComponentModel.DataAnnotations;
using System.Runtime.ConstrainedExecution;

namespace GosuArena.Entities
{
    public class Bot
    {
        public Bot()
        {
            CreatedDate = DateTime.Now;
            IsPublic = true;
        }

        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        [StringLength(255, ErrorMessage = "Bot name is too long")]
        public string Name { get; set; }

        public string Script { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsTrainer { get; set; }
        public bool IsDemoBot { get; set; }
        public bool IsPublic { get; set; }

        public string AuthorUsername
        {
            get
            {
                return User != null ? User.Username : "";
            }
        }

        public bool IsWrittenByUser
        {
            get
            {
                return User != null;
            }
        }

        public bool CanBeEdited
        {
            get
            {
                return !IsTrainer;
            }
        }

        public bool IsAuthorized(string apiKey)
        {
            return User.IsAuthorized(apiKey);
        }
    }
}