using Discord;
using Republic.Common;

// ReSharper disable All
namespace Republic.Embeds;

public class HelpEmbed(string botName, string botVersion, string botHelpReference, ulong botCreatorId) : IEmbedProvider
{
	public Embed Build()
	{
		string description = $"""
							Made with ❤️ by <@{botCreatorId}>
							## Commands Reference
							{botHelpReference}
							""";
		var embed = new EmbedBuilder()
			.WithAuthor($"{botName} {botVersion}")
			.WithDescription(description)
			.WithColor(Color.Green)
			.WithFooter("# Glory to CPP");
		return embed.Build();
	}
}