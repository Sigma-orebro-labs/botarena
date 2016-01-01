using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using GosuArena.Controllers;
using GosuArena.Controllers.Api;
using GosuArena.Entities;
using GosuArena.Models.Match;
using NUnit.Framework;
using WeenyMapper;

namespace BotArena.Tests.Controllers
{
    [TestFixture]
    public class BotApiControllerSpecs
    {
        private BotsController _controller;
        private InMemoryRepository _repository;
        private User _user;
        private Bot _bot;
        private HttpRequestMessage _request;

        [SetUp]
        public void SetUp()
        {
            _repository = new InMemoryRepository();

            _request = new HttpRequestMessage();
            
            _controller = new BotsController(_repository)
            {
                Request = _request, 
                Configuration = new HttpConfiguration()
            };

            _user = new User
            {
                Id = 1,
                IsApiAccessAllowed = true,
                ApiKey = "12345",
                ApiRequestCount = 1
            };

            _repository.Insert(_user);

            _bot = new Bot
            {
                Id = 2,
                UserId = _user.Id,
                Script = "Original script"
            };

            _repository.Insert(_bot);
        }

        [Test]
        public void Getting_non_existing_bot_returns_404()
        {
            ShouldThrow(HttpStatusCode.NotFound, () => _controller.Get(9999));
        }

        [Test]
        public void Putting_non_existing_bot_returns_404()
        {
            ShouldThrow(HttpStatusCode.NotFound, () => _controller.Put(new ApiBotModel { Id = 9999 }));
        }

        [Test]
        public void Getting_with_an_invalid_api_key_returns_401()
        {
            _controller.Request.Headers.Add("Authorization", "GosuArenaApiKey 000000");

            ShouldThrow(HttpStatusCode.Unauthorized, () => _controller.Get(_bot.Id));
        }

        [Test]
        public void Putting_with_an_invalid_api_key_returns_401()
        {
            _controller.Request.Headers.Add("Authorization", "GosuArenaApiKey 000000");

            ShouldThrow(HttpStatusCode.Unauthorized, () => _controller.Put(new ApiBotModel { Id = _bot.Id }));
        }

        [Test]
        public void Getting_without_supplying_auth_header_returns_401()
        {
            ShouldThrow(HttpStatusCode.Unauthorized, () => _controller.Get(_bot.Id));
        }
        
        [Test]
        public void Putting_without_supplying_auth_header_returns_401()
        {
            ShouldThrow(HttpStatusCode.Unauthorized, () => _controller.Put(new ApiBotModel { Id = _bot.Id }));
        }

        [Test]
        public void Getting_with_the_correct_api_key_returns_script()
        {
            _controller.Request.Headers.Add("Authorization", "GosuArenaApiKey 12345");

            var actual = _controller.Get(_bot.Id);

            Assert.AreEqual("Original script", actual.Script);
        }

        [Test]
        public void Putting_with_an_invalid_api_key_increments_request_counter_for_author_of_specified_bot()
        {
            _controller.Request.Headers.Add("Authorization", "GosuArenaApiKey 000000");

            try
            {
                _controller.Put(new ApiBotModel { Id = _bot.Id });
            }
            catch (Exception)
            {
            }

            AssertApiRequestCount(2, _user);
        }

        [Test]
        public void Getting_with_an_invalid_api_key_increments_request_counter_for_author_of_specified_bot()
        {
            _controller.Request.Headers.Add("Authorization", "GosuArenaApiKey 000000");

            try
            {
                _controller.Get(_bot.Id);
            }
            catch (Exception)
            {
            }
            
            AssertApiRequestCount(2, _user);
        }

        [Test]
        public void Authorized_put_for_existing_bot_updates_script()
        {
            _controller.Request.Headers.Add("Authorization", "GosuArenaApiKey 12345");

            _controller.Put(new ApiBotModel{ Id = _bot.Id, Script = "new script"});

            var actualScript = _repository.Find<Bot>()
                .Where(x => x.Id == _bot.Id)
                .Select(x => x.Script)
                .ExecuteScalar<string>();

            Assert.AreEqual("new script", actualScript);
        }

        private void ShouldThrow(HttpStatusCode statusCode, Action action)
        {
            try
            {
                action();
            }
            catch (HttpResponseException e)
            {
                Assert.AreEqual(statusCode, e.Response.StatusCode);
                return;
            }

            Assert.Fail();
        }

        private void AssertApiRequestCount(int expectedApiRequestCount, User user)
        {
            var actualRequestCount = _repository.Find<User>()
                .Where(x => x.Id == user.Id)
                .Select(x => x.ApiRequestCount).ExecuteScalar<int>();

            Assert.AreEqual(expectedApiRequestCount, actualRequestCount);
        }
    }
}