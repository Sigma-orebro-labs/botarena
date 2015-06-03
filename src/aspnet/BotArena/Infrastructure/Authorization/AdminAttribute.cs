using System.Web.Mvc;
using GosuArena.Entities;

namespace GosuArena.Infrastructure.Authorization
{
    public class AdminAttribute : AuthorizeAttribute
    {
        public AdminAttribute()
        {
            Users = string.Join(",", User.Admins);
        }
    }
}