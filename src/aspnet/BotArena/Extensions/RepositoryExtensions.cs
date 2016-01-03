using GosuArena.Entities;
using WeenyMapper;

namespace GosuArena.Extensions
{
    public static class RepositoryExtensions
    {
        public static int GetUserId(this Repository repository, string username)
        {
            return repository
                .Find<User>()
                .Select(x => x.Id)
                .Where(x => x.Username == username)
                .ExecuteScalar<int>();
        }
    }
}