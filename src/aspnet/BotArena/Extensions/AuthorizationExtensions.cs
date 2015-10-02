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
    }
}