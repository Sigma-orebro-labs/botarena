using System.Collections.Generic;
using GosuArena.Services;
using NUnit.Framework;

namespace BotArena.Tests.Services
{
    [TestFixture]
    public class NameGeneratorTests
    {
        [Test]
        public void Generating_thousands_of_names_yields_no_duplicates()
        {
            var generator = new NameGenerator();
            var names = new List<string>(10000);

            for (int i = 0; i < 10000; i++)
            {
                var name = generator.GenerateUnique(names);

                Assert.IsFalse(names.Contains(name));

                names.Add(name);
            }

            Assert.AreEqual(10000, names.Count);
        }
    }
}