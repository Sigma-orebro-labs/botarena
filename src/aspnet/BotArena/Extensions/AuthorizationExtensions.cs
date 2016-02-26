using System.Security.Principal;
using GosuArena.Entities;

namespace GosuArena.Extensions
{
    public static class AuthorizationExtensions
    {
        public static bool IsAdmin(this IPrincipal user)
        {
            return User.IsAdmin(user.Identity.Name);
        }

        public static int UserId(this IPrincipal user)
        {
            return int.Parse(user.Identity.Name);
        }

        public static int TryGetUserId(this IPrincipal user)
        {
            int id;

            int.TryParse(user.Identity.Name, out id);

            return id;
        }
    }
}