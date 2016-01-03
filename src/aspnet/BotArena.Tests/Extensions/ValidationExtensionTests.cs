using System;
using GosuArena.Extensions;
using NUnit.Framework;

namespace BotArena.Tests.Extensions
{
    [TestFixture]
    public class ValidationExtensionTests
    {
        [Test]
        public void Can_validate_hex_color_codes()
        {
            AssertColorHexCodeValidation("#abc", expected: true);
            AssertColorHexCodeValidation("#a2c", expected: true);
            AssertColorHexCodeValidation("#a2C", expected: true);
            AssertColorHexCodeValidation("#123", expected: true);
            AssertColorHexCodeValidation("#fff", expected: true);
            AssertColorHexCodeValidation("#CED", expected: true);
            AssertColorHexCodeValidation("#abadcc", expected: true);
            AssertColorHexCodeValidation("#c1c1c1", expected: true);
            AssertColorHexCodeValidation("#122344", expected: true);
            AssertColorHexCodeValidation("#ABCDEF", expected: true);
            AssertColorHexCodeValidation("#C8C9C6", expected: true);
            AssertColorHexCodeValidation("#A6b9C6", expected: true);

            AssertColorHexCodeValidation("#A6b9C", expected: false);
            AssertColorHexCodeValidation("#GFF", expected: false);
            AssertColorHexCodeValidation("#GFF123", expected: false);
            AssertColorHexCodeValidation("#GF", expected: false);
            AssertColorHexCodeValidation("#12", expected: false);
            AssertColorHexCodeValidation("#1234", expected: false);
            AssertColorHexCodeValidation("", expected: false);
            AssertColorHexCodeValidation(null, expected: false);
            AssertColorHexCodeValidation("  ", expected: false);
            AssertColorHexCodeValidation("abc", expected: false);
            AssertColorHexCodeValidation("abc123", expected: false);
            AssertColorHexCodeValidation("123abc", expected: false);
        }

        private void AssertColorHexCodeValidation(string input, bool expected)
        {
            Assert.AreEqual(expected, input.IsValidHexColorCode(), "Input: " + input);
        }
    }
}