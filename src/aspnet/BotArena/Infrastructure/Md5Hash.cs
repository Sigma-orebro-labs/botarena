using System;
using System.Security.Cryptography;
using System.Text;

namespace GosuArena.Infrastructure
{
    public class Md5Hash
    {
        public static string Hash(string plainText)
        {
            var md5Hasher = new MD5CryptoServiceProvider();

            byte[] plainBytes = Encoding.ASCII.GetBytes(plainText);
            byte[] hashedBytes = md5Hasher.ComputeHash(plainBytes);

            return BitConverter.ToString(hashedBytes);
        }
    }
}