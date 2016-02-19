using System.Reflection;

namespace GosuArena.Infrastructure
{
    public class Environment
    {
        public static string VersionIdentifier => Assembly.GetExecutingAssembly().GetName().Version.ToString().Replace(".", "");
    }
}