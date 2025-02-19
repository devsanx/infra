using Discord;
using Discord.Commands;
using Discord.Interactions;
using Discord.WebSocket;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Riverside.Alliance.Private;

namespace Riverside.Alliance.Components.Portals;

public class BotService(DiscordSocketClient discordSocketClient,
	InteractionService interactionService,
	InteractionHandler interactionHandler,
	CommandService commandService,
	CommandHandler commandHandler,
	IConfiguration configuration) : IHostedService
{
	public async Task StartAsync(CancellationToken cancellationToken)
	{
		CustomBotLogger customBotLogger = new();
		await interactionHandler.InitializeAsync();
		await commandHandler.InstallCommandsAsync();

		interactionService.Log += customBotLogger.BotLogger;
		commandService.Log += customBotLogger.BotLogger;
		discordSocketClient.Log += customBotLogger.BotLogger;

		discordSocketClient.Ready += async () =>
		{
			_ = Task.Run(async () =>
			{
				// Setting up slash commands and context commands
				ulong guildId = Constants.GuildId;
				var guild = discordSocketClient.GetGuild(guildId);
				await guild.BulkOverwriteApplicationCommandAsync(new ApplicationCommandProperties[]
				{
					AddContextCommand().Build()
				});
				await interactionService.RegisterCommandsToGuildAsync(guildId);
			}, cancellationToken);
			await Task.CompletedTask;
		};

		// Starting discord socket client
		await discordSocketClient.LoginAsync(TokenType.Bot, Constants.BotToken);
		await discordSocketClient.StartAsync();

		// Setting bot's activity
		await discordSocketClient.SetGameAsync(configuration["RichPresence:CustomMessage"],
			null, ActivityType.CustomStatus);
	}

	public async Task StopAsync(CancellationToken cancellationToken)
	{
		// Stops the discord socket client instance and logs out (graceful shutdown).
		await discordSocketClient.LogoutAsync();
		await discordSocketClient.StopAsync();
	}

	private static MessageCommandBuilder AddContextCommand()
	{
		// Create a context command named "Open Portal"
		var guildMessageCommand = new MessageCommandBuilder()
			.WithName("Open Portal")
			.WithContextTypes(InteractionContextType.Guild, InteractionContextType.PrivateChannel);
		return guildMessageCommand;
	}
}