using Discord.Interactions;
using Discord.WebSocket;
using Serilog;
using System.Reflection;

namespace Republic.Portals;

public class InteractionHandler(
	DiscordSocketClient discordSocketClient,
	IServiceProvider serviceProvider,
	InteractionService interactionService)
{
	public async Task InitializeAsync()
	{
		await interactionService.AddModulesAsync(assembly: Assembly.GetEntryAssembly(), serviceProvider);
		discordSocketClient.InteractionCreated += DiscordSocketClientOnInteractionCreated;
	}

	private async Task DiscordSocketClientOnInteractionCreated(SocketInteraction arg)
	{
		try
		{
			SocketInteractionContext context = new(discordSocketClient, arg);
			await interactionService.ExecuteCommandAsync(context, serviceProvider);
		}
		catch (Exception ex)
		{
			Log.Error("Error executing interaction command. Reason: {error}", ex.Message);
		}
	}
}