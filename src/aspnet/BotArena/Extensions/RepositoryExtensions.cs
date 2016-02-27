using System.Collections;
using System.Collections.Generic;
using System.Linq;
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

        public static IList<Bot> GetBotsByNames(this Repository repository, IEnumerable<string> names)
        {
            var nameList = names.ToList();

            return repository
                .Find<Bot>()
                .Select(x => x.Id, x => x.Name, x => x.UserId)
                .Where(x => nameList.Contains(x.Name))
                .ExecuteList();
        }

        public static Bot GetBotById(this Repository repository, int botId)
        {
            return repository.Find<Bot>().Where(x => x.Id == botId).Execute();
        }
    }
}