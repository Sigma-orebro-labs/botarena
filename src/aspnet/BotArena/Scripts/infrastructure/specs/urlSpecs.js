///<reference path="~/Scripts/_references.js" />

describe("Url helper", function () {

    beforeEach(function() {
        gosuArena.url.baseUrl = "/BotArena/";
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
});