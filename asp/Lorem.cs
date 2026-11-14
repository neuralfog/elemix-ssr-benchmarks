using System.Text;

namespace asp;

public record LoremItem(int Index, string Text);

public static class Lorem {
    public const string Text =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

    public static string Nest(int depth) {
        var sb = new StringBuilder();
        for (var i = 0; i < depth; i++) {
            sb.Append("<div class=\"node\"><p class=\"para\">");
            sb.Append(i);
            sb.Append(": ");
            sb.Append(Text);
            sb.Append("</p>");
        }
        for (var i = 0; i < depth; i++) {
            sb.Append("</div>");
        }
        return sb.ToString();
    }
}
