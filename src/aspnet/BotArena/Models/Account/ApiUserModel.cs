using GosuArena.Entities;

namespace GosuArena.Models.Account
{
    public class ApiUserModel
    {
        public ApiUserModel(User user)
        {
            Id = user.Id;
            Username = user.Username;
            Email = user.Email;
        }

        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
    }
}