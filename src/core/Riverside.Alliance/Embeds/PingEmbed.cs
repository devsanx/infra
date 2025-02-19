using Discord;
using Republic.Common;

namespace Republic.Embeds;

public class PingEmbed(int ping) : IEmbedProvider
{
	public Embed Build() => new EmbedBuilder()
		.WithTitle("Pong!")
		.WithDescription($"Latency: `{ping} ms`")
		.WithColor(Color.Blue)
		.Build();
}