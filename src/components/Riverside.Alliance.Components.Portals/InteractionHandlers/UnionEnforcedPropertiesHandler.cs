using Discord;
using Discord.Interactions;
using Republic.Embeds;

namespace Republic.Portals.InteractionHandlers
{
	[RequireUserPermission(GuildPermission.Administrator)]
	public class UnionReference : InteractionModuleBase<SocketInteractionContext>, IUnionReusedMetadataCommandsBase
	{
		// Define the help reference and help embed as properties
		public string HelpReference => """
                                        `/teleport {channel}`
                                        Opens a portal from current channel to provided rxChannel.
                                        Alias: `!tp`, `!teleport`, `!portal`
                                        `/exclude`
                                        Exclude a channel for being read only.
                                        `/logchannel {channel}`
                                        Sets the channel where the bot logs information.
                                        """;

		public Embed HelpEmbed => new HelpEmbed("Portals bot", "v1.0", HelpReference, 793688107077468171).Build();
		public Embed PingEmbed => new PingEmbed(Context.Client.Latency).Build();

		// /ping - dummy command to handle ping and pong and gives us the client latency
		[SlashCommand("ping", "Pings the system latency")]
		public async Task HandlePingAsync()
		{
			await RespondAsync(embed: PingEmbed, ephemeral: true);
		}

		[SlashCommand("help", "Displays help message")]
		public async Task HandleHelpAsync()
		{
			await RespondAsync(embed: HelpEmbed, ephemeral: true);
		}
	}
}
