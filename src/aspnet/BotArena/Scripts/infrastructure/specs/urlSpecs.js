///<reference path="~/Scripts/_references.js" />

describe("Url helper", function () {

    beforeEach(function() {
        gosuArena.url.baseUrl = "/BotArena/";
        gosuArena.url.cacheBustingFragment = '12345';
    });

    it("adds base url to relative part to create absolute url", function () {
        var url = gosuArena.url.createAbsolute("api/botimagename/");

        expect(url).toBe("/BotArena/api/botimagename/");
    });

    it("strips leading slash of relative part", function () {
        var url = gosuArena.url.createAbsolute("/api/botimagename/");

        expect(url).toBe("/BotArena/api/botimagename/");
    });

    it("adds query parameters to the url when specified", function () {
        var url = gosuArena.url.createAbsolute("/api/botimagename", { name: "turnbot"});

        expect(url).toBe("/BotArena/api/botimagename?name=turnbot");
    });

    it("encodes query parameters", function () {
        var url = gosuArena.url.createAbsolute("/api/botimagename", { name: "turn bot" });

        expect(url).toBe("/BotArena/api/botimagename?name=turn%20bot");
    });

    it("can add multiple query parameters", function () {
        var url = gosuArena.url.createAbsolute("/api/botimagename", { name: "turnbot", colorHexCode: "ffaabb" });

        expect(url).toBe("/BotArena/api/botimagename?name=turnbot&colorHexCode=ffaabb");
    });

    it("adds version parameter when creating cache busting url", function () {
        var url = gosuArena.url.createAbsoluteWithCacheBusting("/api/botimagename/");

        expect(url).toBe("/BotArena/api/botimagename?v=12345");
    });

    it("adds version parameter when creating cache busting url using query string parameters", function () {
        var url = gosuArena.url.createAbsoluteWithCacheBusting("/api/botimagename", { name: "turnbot", colorHexCode: "ffaabb" });

        expect(url).toBe("/BotArena/api/botimagename?name=turnbot&colorHexCode=ffaabb&v=12345");
    });

    it("adds version parameter using ampersand when creating cache busting url from relative url with query string", function () {
        var url = gosuArena.url.createAbsoluteWithCacheBusting("/api/botimagename?name=foo");

        expect(url).toBe("/BotArena/api/botimagename?name=foo&v=12345");
    });
});