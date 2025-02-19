using Republic.Embeds;
using Discord;

namespace Republic
{
	public interface IUnionReusedMetadataCommandsBase
	{
		Task HandlePingAsync();
		Task HandleHelpAsync();

		string HelpReference { get; }
		Embed HelpEmbed { get; }
		Embed PingEmbed { get; }
	}

}
