using System.Text.RegularExpressions;
using DataAnnotationsExtensions;

namespace GosuArena.Extensions
{
    public static class ValidationExtensions
    {
        public static bool IsValidEmail(this string input)
        {
            return new EmailAttribute().IsValid(input);
        }

        public static bool IsValidHexColorCode(this string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return false;
            }

            return Regex.IsMatch(input, "^#([a-fA-F0-9]{3}){1,2}$");
        }
    }
}