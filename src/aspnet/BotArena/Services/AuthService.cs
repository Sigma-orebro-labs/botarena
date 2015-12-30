using System;
using System.Linq;
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
            if (!IsValid(username, password))
            {
                return false;
            }

            FormsAuthentication.SetAuthCookie(username, rememberMe);

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

        private bool IsValid(string username, string password)
        {
            var user = _repository.Find<User>()
                .Where(x => x.Username == username)
                .ExecuteList()
                .FirstOrDefault();

            if (user == null)
                return false;

            return user.IsPasswordValid(password);
        }
    }
}