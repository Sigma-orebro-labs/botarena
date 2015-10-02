using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using GosuArena.Infrastructure;
using Microsoft.Ajax.Utilities;

namespace GosuArena.Entities
{
    public class User
    {
        public User()
        {
            JoinDate = DateTime.Now;
            Bots = new List<Bot>();
        }

        public int Id { get; set; }
        public string Username { get; set; }
        public string HashedPassword { get; set; }
        public bool IsApiAccessAllowed { get; set; }
        public string ApiKey { get; set; }
        public int ApiRequestCount { get; set; }
        public DateTime JoinDate { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public IList<Bot> Bots { get; set; }
        public string Email { get; set; }

        public void SetPassword(string plainTextPassword)
        {
            HashedPassword = Hash(plainTextPassword);
        }

        public bool IsPasswordValid(string plainTextPassword)
        {
            return Hash(plainTextPassword) == HashedPassword;
        }

        private static string Hash(string plainTextPassword)
        {
            return Md5Hash.Hash(plainTextPassword);
        }

        public bool IsAuthorized(string postedApiKey)
        {
            var hasApiKey = !ApiKey.IsNullOrWhiteSpace();
            var isApiKeyMatch = ApiKey == postedApiKey;

            return IsApiAccessAllowed && hasApiKey && isApiKeyMatch;
        }

        public static bool IsAdmin(string username)
        {
            return Admins.Contains(username);
        }

        public static IEnumerable<string> Admins
        {
            get
            {
                yield return "erikojebo";
                yield return "gosuarenatrainer";
            }
        }
    }
}