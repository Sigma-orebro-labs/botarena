using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

namespace GosuArena.Infrastructure.Graphics
{
    public class ImageRenderer
    {
        public void RenderNameImageToStream(string name, string colorHexCode, Stream stream)
        {
            const int desiredFontSize = 40;
            const int fontOutlineThickness = 4;
            const double outlineColorTweakFactor = 0.5;
            const double upperGradiantColorTweakFactor = 1.2;
            const double lowerGradiantColorTweakFactor = 0.6;
            const int imageWidth = 300;
            const int imageHeight = 70;
            const string fontFamily = "Verdana";

            if (!colorHexCode.StartsWith("#"))
            {
                colorHexCode = "#" + colorHexCode;
            }

            var actualFontSize = GetMaxFontSizeForString(name, fontFamily, desiredFontSize, imageWidth, imageHeight);
            var font = new Font(fontFamily, actualFontSize);

            using (var bitMapImage = new Bitmap(imageWidth, imageHeight, PixelFormat.Format32bppArgb))
            using (var graphics = System.Drawing.Graphics.FromImage(bitMapImage))
            {
                var graphicsPath = new GraphicsPath();
                
                var stringFormat = new StringFormat(StringFormatFlags.NoClip)
                {
                    Alignment = StringAlignment.Center,
                    LineAlignment = StringAlignment.Far
                };

                var baseColor = ColorTranslator.FromHtml(colorHexCode);
                var outlineColor = ScaleColor(baseColor, outlineColorTweakFactor);
                var outlinePen = new Pen(outlineColor, fontOutlineThickness);

                // Rectangle for font to repeat gradient for each line
                var gradientRectangle = new Rectangle(0, bitMapImage.Height - font.Height, bitMapImage.Width, font.Height);

                var gradientBrush = new LinearGradientBrush(gradientRectangle,
                        ScaleColor(baseColor, upperGradiantColorTweakFactor),
                        ScaleColor(baseColor, lowerGradiantColorTweakFactor),
                        90);

                graphicsPath.AddString(
                    name,
                    font.FontFamily,
                    (int)font.Style,
                    actualFontSize,
                    new Rectangle(0, 0, bitMapImage.Width, bitMapImage.Height),
                    stringFormat);

                graphics.SmoothingMode = SmoothingMode.AntiAlias;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

                graphics.DrawPath(outlinePen, graphicsPath);
                graphics.FillPath(gradientBrush, graphicsPath);

                bitMapImage.Save(stream, ImageFormat.Png);
            }
        }

        private int GetMaxFontSizeForString(string s, string fontFamily, int maxFontSize, int targetAreaWidth, int targetAreaHeight)
        {
            // Create a large bitmap area just to find out what would be the actual
            // required size for the string to fit, using the given font
            using (var bitMapImage = new Bitmap(800, 300, PixelFormat.Format32bppArgb))
            using (var graphics = System.Drawing.Graphics.FromImage(bitMapImage))
            {
                const int minAllowedFontSize = 10;

                for (var fontSize = maxFontSize; fontSize > minAllowedFontSize; fontSize--)
                {
                    var font = new Font(fontFamily, fontSize);
                    var sizeF = graphics.MeasureString(s, font);

                    if (sizeF.Width <= targetAreaWidth && sizeF.Height <= targetAreaHeight)
                    {
                        return fontSize;
                    }
                }

                return minAllowedFontSize;
            }
        }

        private Size MeasureRenderedSize(string s, Font font)
        {
            // Create a large bitmap area just to find out what would be the actual
            // required size for the string to fit, using the given font
            using (var bitMapImage = new Bitmap(800, 300, PixelFormat.Format32bppArgb))
            using (var graphics = System.Drawing.Graphics.FromImage(bitMapImage))
            {
                var sizeF = graphics.MeasureString(s, font);
                return new Size((int)Math.Ceiling(sizeF.Width), (int)Math.Ceiling(sizeF.Height));
            }
        }

        private static Color ScaleColor(Color color, double factor)
        {
            return Color.FromArgb(255, Scale(color.R, factor), Scale(color.G, factor), Scale(color.B, factor));
        }

        private static int Scale(int value, double factor)
        {
            return Math.Min((int)(value * factor), 255);
        }
    }
}