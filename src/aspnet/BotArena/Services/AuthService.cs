using System;
using System.Linq;
using System.Net.Http;
using System.Security.Principal;
using System.Web;
using System.Web.Security;
using GosuArena.Entities;
using WeenyMapper;

namespace GosuArena.Services
{
    public class AuthService
    {
        private readonly Repository _repository = new Repository();

        public bool TryLogin(string username, string password, bool rememberMe)
        {
            var user = GetUserByCredentials(username, password);

            if (user == null)
            {
                return false;
            }

            FormsAuthentication.SetAuthCookie(user.Id.ToString(), rememberMe);

            _repository.Update<User>()
                .Set(x => x.LastLoginDate, DateTime.Now)
                .Where(x => x.Username == username)
                .Execute();

            return true;
        }

        public void LogOff()
        {
            FormsAuthentication.SignOut();
        }

        private User GetUserByCredentials(string username, string password)
        {
            var user = _repository.Find<User>()
                .Where(x => x.Username == username)
                .ExecuteList()
                .FirstOrDefault();

            if (user == null)
                return null;

            return user.IsPasswordValid(password) ? user : null;
        }

        public User GetUser(string username)
        {
            return _repository
                .Find<User>()
                .Where(x => x.Username == username)
                .Execute();
        }

        public User GetUser(int id)
        {
            return _repository
                .Find<User>()
                .Where(x => x.Id == id)
                .Execute();
        }
    }
}