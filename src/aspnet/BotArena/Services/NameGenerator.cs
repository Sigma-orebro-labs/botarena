﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace GosuArena.Services
{
    public class NameGenerator
    {
        private static string[] _names =
        {
            "Acamar",
            "Achernar",
            "Achird",
            "Acrab",
            "Akrab",
            "Elakrab",
            "Graffias",
            "Acrux",
            "Acubens",
            "Adhafera",
            "Adhara",
            "Ain",
            "Aladfar",
            "Alamak",
            "Alathfar",
            "Alaraph",
            "Albaldah",
            "Albali",
            "Albireo",
            "Alchiba",
            "Alcor",
            "Alcyone",
            "Aldebaran",
            "Alderamin",
            "Aldhafera",
            "Aldhanab",
            "Aldhibain",
            "Aldib",
            "Al Fawaris",
            "Alfecca Meridiana",
            "Alfirk",
            "Algedi",
            "Al Giedi",
            "Algenib",
            "Algieba",
            "Algol",
            "Algorab",
            "Alhajoth",
            "Alhena",
            "Alioth",
            "Alkaid",
            "Al Kurud",
            "Al Kalb al Rai",
            "Alkalurops",
            "Al Kaphrah",
            "Alkes",
            "Alkurah",
            "Almach",
            "Al Minliar al Asad",
            "Al Nair",
            "Alnasl",
            "Alnilam",
            "Alnitak",
            "Alniyat",
            "Al Niyat",
            "Alphard",
            "Alphecca",
            "Alpheratz",
            "Alrai",
            "Alrami",
            "Alrischa",
            "Alsafi",
            "Alsciaukat",
            "Alshain",
            "Alshat",
            "Altair",
            "Altais",
            "Altarf",
            "Alterf",
            "Al Thalimain",
            "Aludra",
            "Alula Australis",
            "Alula Borealis",
            "Alwaid",
            "Alya",
            "Alzir",
            "Ancha",
            "Angetenar",
            "Ankaa",
            "Antares",
            "Arcturus",
            "Arich",
            "Arkab",
            "Armus",
            "Arneb",
            "Arrakis",
            "Alrakis",
            "Elrakis",
            "Ascella",
            "Asellus Australis",
            "Asellus Borealis",
            "Asellus Primus",
            "Asellus Secundus",
            "Asellus Tertius",
            "Askella",
            "Aspidiske",
            "Asterion",
            "Asterope",
            "Atik",
            "Atlas",
            "Atria",
            "Auva",
            "Avior",
            "Azaleh",
            "Azelfafage",
            "Azha",
            "Azmidiske",
            "Baham",
            "Baten Kaitos",
            "Becrux",
            "Mimosa",
            "Beid",
            "Bellatrix",
            "Benetnasch",
            "Betelgeuse",
            "Betria",
            "Biham",
            "Botein",
            "Brachium",
            "Bunda",
            "Canopus",
            "Capella",
            "Caph",
            "Castor",
            "Cebalrai",
            "Celaeno",
            "Chara",
            "Cheleb",
            "Chertan",
            "Chort",
            "Chow",
            "Cor Caroli",
            "Cursa",
            "Dabih",
            "Decrux",
            "Deneb",
            "Deneb Algedi",
            "Deneb Dulfim",
            "Deneb el Okab",
            "Deneb Kaitos",
            "Deneb Kaitos Schemali",
            "Denebola",
            "Dheneb",
            "Diadem",
            "Diphda",
            "Dnoces",
            "Dschubba",
            "Dubhe",
            "Duhr",
            "Edasich",
            "Electra",
            "Elmuthalleth",
            "Elnath",
            "Enif",
            "Errai",
            "Etamin",
            "Eltanin",
            "Fomalhaut",
            "Fum al Samakah",
            "Furud",
            "Gacrux",
            "Garnet Star",
            "Gatria",
            "Gemma",
            "Gianfar",
            "Giedi",
            "Gienah Gurab",
            "Gienah",
            "Girtab",
            "Gomeisa",
            "Gorgonea Tertia",
            "Grumium",
            "Hadar",
            "Haedus",
            "Haldus",
            "Hamal",
            "Ras Hammel",
            "Hassaleh",
            "Head of Hydrus",
            "Heka",
            "Heze",
            "Hoedus (I)",
            "Hoedus II",
            "Homam",
            "Hyadum I",
            "Hyadum II",
            "Hydrobius",
            "Jabbah",
            "Kabdhilinan",
            "Kaffaljidhma",
            "Kajam",
            "Kastra",
            "Kaus Australis",
            "Kaus Borealis",
            "Kaus Media",
            "Keid",
            "Kitalpha",
            "Kochab",
            "Kornephoros",
            "Kraz",
            "Rukbah",
            "Rucbah",
            "Ksora",
            "Kuma",
            "La Superba",
            "Lesath",
            "Lucida Anseris",
            "Maasym",
            "Mahasim",
            "Maia",
            "Marfark",
            "Marfik",
            "Markab",
            "Matar",
            "Mebsuta",
            "Media",
            "Megrez",
            "Meissa",
            "Mekbuda",
            "Menchib",
            "Menkab",
            "Menkalinan",
            "Menkar",
            "Menkent",
            "Menkib",
            "Merak",
            "Merga",
            "Merope",
            "Mesarthim",
            "Miaplacidus",
            "Minchir",
            "Minelava",
            "Minkar",
            "Mintaka",
            "Mira",
            "Mirach",
            "Miram",
            "Mirfak",
            "Mirzam",
            "Misam",
            "Mizar",
            "Mothallah",
            "Muliphein",
            "Muphrid",
            "Mufrid",
            "Murzim",
            "Muscida",
            "Nair Al Saif",
            "Naos",
            "Nash",
            "Nashira",
            "Navi",
            "Nekkar",
            "Nembus",
            "Nihal",
            "Nunki",
            "Nusakan",
            "Okul",
            "Peacock",
            "Phact",
            "Phad",
            "Phecda",
            "Phekda",
            "Pherkad",
            "Pherkard",
            "Pleione",
            "Polaris",
            "Cynosure",
            "north star",
            "pole star",
            "lodestar",
            "Polaris Australis",
            "Pollux",
            "Porrima",
            "Praecipua",
            "Procyon",
            "Propus",
            "Pulcherrima",
            "Izar",
            "Rana",
            "Ras Algethi",
            "Ras Alhague",
            "Ras Elased Australis",
            "Rasalas",
            "Rastaban",
            "Ras Thaoum",
            "Regor",
            "Regulus",
            "Rigel",
            "Rigil Kentaurus",
            "Rijl al Awwa",
            "Rotanev",
            "Ruchba",
            "Rukbat",
            "Sabik",
            "Sadachbia",
            "Sadalbari",
            "Sadalmelik",
            "Sadalsuud",
            "Sadatoni",
            "Sadr",
            "Saiph",
            "Salm",
            "Sargas",
            "Sarin",
            "Sarir",
            "Sceptrum",
            "Scheat",
            "Scheddi",
            "Schedir",
            "Schedar",
            "Segin[citation needed]",
            "Seginus",
            "Sham",
            "Shaula",
            "Sheliak",
            "Sheratan",
            "Sinistra",
            "Sirius",
            "Dog Star",
            "Situla",
            "Skat",
            "Spica",
            "Azimech",
            "Sterope",
            "Sualocin",
            "Subra",
            "Suhail",
            "Sulafat",
            "Syrma",
            "Tabit",
            "Talitha Australis",
            "Talitha Borealis",
            "Tania Australis",
            "Tania Borealis",
            "Tarazet",
            "Tarazed",
            "Taygeta",
            "Tegmen",
            "Tegmine",
            "Terebellum",
            "Tejat Posterior",
            "Tejat Prior",
            "Thabit",
            "Theemin",
            "Beemin",
            "Thuban",
            "Tien Kwan",
            "Torcularis Septentrionalis",
            "Tureis",
            "Tyl",
            "Unuk or Unukalhai",
            "Vega",
            "Vindemiatrix",
            "Wasat",
            "Wazn",
            "Wezen",
            "Yed Prior",
            "Yed Posterior",
            "Yildun",
            "Zaniah",
            "Zaurak",
            "Zaurac",
            "Zavijava",
            "Zosma",
            "Zuben-el-Akrab",
            "Zuben-el-Akribi",
            "Zubenelgenubi",
            "Zuben-el-genubi",
            "Lanx Australis",
            "Zubeneschamali",
            "Zuben-el-schemali",
            "Lanx Borealis",
            "Eridanus",
            "Cassiopeia",
            "Scorpius",
            "Crux",
            "Cancer",
            "Leo",
            "Canis Major",
            "Taurus",
            "Lyra",
            "Andromeda",
            "Virgo",
            "Sagittarius",
            "Aquarius",
            "Cygnus",
            "Corvus",
            "Ursa Major",
            "Cepheus",
            "Grus",
            "Draco",
            "Corona Australis",
            "Capricornus",
            "Perseus",
            "Pegasus",
            "Auriga",
            "Gemini",
            "Columba",
            "Bootes",
            "Crater",
            "Orion",
            "Hydra",
            "Corona Borealis",
            "Pisces",
            "Lynx",
            "Aquila",
            "Serpens",
            "Phoenix",
            "Boötes",
            "Lepus",
            "Carina",
            "Canes Venatici",
            "Triangulum Australe",
            "Puppis",
            "Cetus",
            "Aries",
            "Libra",
            "Ophiuchus",
            "Delphinus",
            "Coma Berenices",
            "Triangulum",
            "Piscis Austrinus",
            "Canis Minor",
            "Centaurus",
            "Hydrus",
            "Hercules",
            "Equuleus",
            "Ursa Minor",
            "Vulpecula",
            "Pavo",
            "Octans",
            "Leo Minor",
            "Vela",
            "Sagitta"
        };

        private static string[] _greekNumbers = new[]
        {
            "Alfa",
            "Beta",
            "Gamma",
            "Delta",
            "Epsilon",
            "Zeta",
            "Eta",
            "Theta",
            "Jota",
            "Kappa",
            "Lambda",
            "My",
            "Ny",
            "Xi",
            "Omikron",
            "Pi",
            "Rho",
            "Sigma",
            "Tau",
            "Ypsilon",
            "Fi",
            "Chi",
            "Psi",
            "Omega"
        };

        private readonly Random _random;

        public NameGenerator()
        {
            _random = new Random();
        }

        public NameGenerator(Random random)
        {
            _random = random;
        }

        public string GenerateUnique(IEnumerable<string> takenNames)
        {
            var takenNamesArray = takenNames.ToArray();

            var randomName = _names[_random.Next(_names.Length)];
            var randomGreekNumeral = _greekNumbers[_random.Next(_greekNumbers.Length)];

            if (!takenNamesArray.Contains(randomName))
                return randomName;

            randomName = $"{randomName} {randomGreekNumeral}";

            if (!takenNamesArray.Contains(randomName))
                return randomName;

            randomName += " ";

            while (takenNamesArray.Contains(randomName))
            {
                randomName += _random.Next(10).ToString();
            }

            return randomName;
        }
    }
}