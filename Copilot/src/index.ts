import 'dotenv/config';
import * as fs from "fs";
import {
  Client,
  IntentsBitField,
  Events,
  GuildMemberRoleManager,
  PermissionFlagsBits,
  TextChannel,
  Message,
  EmbedBuilder,
  ChatInputCommandInteraction,
  APIEmbedField,
} from "discord.js";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildModeration,
  ],
});

// Global error handlers to prevent crashes
process.on('unhandledRejection', (error: Error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught exception:', error);
});

// Discord client error handlers
client.on('error', (error) => {
  console.error('Discord client error:', error);
});

client.on('shardError', (error) => {
  console.error('A websocket connection encountered an error:', error);
});

client.on(Events.ClientReady, () => {
  console.log("The bot is online.");
});

let count: number;
let lastUserId: string | null;

// Load counting data
try {
  const data = JSON.parse(fs.readFileSync("counting.json").toString());
  count = data.count;
  lastUserId = data.lastUserId;
} catch {
  count = 0;
  lastUserId = null;
}

client.on(Events.MessageCreate, async (message) => {
  try {
    if (message.author.bot) return;
    if (message.channelId === "754969003176362025") {
      if (isNaN(parseInt(message.content.charAt(0)))) return;
      if (parseInt(message.content) !== count + 1) {
        count = 0;
        await message.react("❌");
        await message.channel.send(
          `<@${message.author.id}> **Wrong number!** The next number is ${count + 1}`
        );
        return;
      } else if (message.author.id === lastUserId) {
        await message.react("❌");
        await message.channel.send(
          `<@${lastUserId}> **Don't count twice in a row!** The next number is ${count + 1}`
        );
        return;
      }

      count++;
      lastUserId = message.author.id;
      fs.writeFileSync("counting.json", JSON.stringify({ count, lastUserId }));
      await message.react("☑️");
    }
  } catch (error) {
    console.error('Error in MessageCreate event:', error);
  }
});

client.on(Events.GuildMemberAdd, async (member) => {
  try {
    const role = member.guild.roles.cache.get("720365286217482410");
    if (role) {
      await member.roles.add(role);
    } else {
      console.error('Role not found');
    }
  } catch (error) {
    console.error('Error in GuildMemberAdd event:', error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isCommand() && interaction.commandName === "purge") {
      const purgeAmountOption = interaction.options.get("amount");
      const purgeAmount = purgeAmountOption !== null ? Number(purgeAmountOption.value) : undefined;
      const roleIDs = ['963126531515908146', '911879842906144778'];
      const channel = interaction.channel;
      const memberRoles = interaction.member?.roles as GuildMemberRoleManager;
      const memberPermissions = interaction.member?.permissions;
      
      // @ts-ignore
      if ((memberRoles && roleIDs.some(roleID => memberRoles.cache.has(roleID))) || memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        if (!purgeAmount || purgeAmount < 1 || purgeAmount > 100) {
          await interaction.reply({
            content: "You need to input a number between 1 and 100",
            ephemeral: true,
          });
          return;
        }
        if (!(channel instanceof TextChannel)) {
          await interaction.reply({
            content: "This command can only be used in text channels",
            ephemeral: true,
          });
          return;
        }
        
        const fetchedMessages = await channel.messages.fetch({ limit: purgeAmount });
        await channel.bulkDelete(fetchedMessages);

        await interaction.reply({
          content: "The messages have been purged successfully",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'You do not have permission to use this command',
          ephemeral: true,
        });
        return;
      }
    }
  } catch (error) {
    console.error('Error in purge command:', error);
    if (interaction.isCommand() && !interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: 'An error occurred while executing this command.',
        ephemeral: true,
      }).catch(console.error);
    }
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;
    
    const { commandName, options, guild } = interaction;
    console.log(commandName);
    
    if (commandName === 'whois') {
      const whoisUser = guild?.members?.resolve(options.getUser("user", true));
      
      if (!whoisUser) {
        await interaction.reply({
          content: 'User not found.',
          ephemeral: true,
        });
        return;
      }
      
      const date = new Date();
      const roles = whoisUser.roles.cache.filter(role => role.name !== '@everyone').map(role => `<@&${role.id}>`).join(', ') || 'None';
      const roleCount = whoisUser.roles.cache.size - 1;
      
      const embedWhois = new EmbedBuilder()
        .setAuthor({ 
          name: `${whoisUser.user.tag}`, 
          iconURL: whoisUser.user.avatarURL() || undefined 
        })
        .setDescription(`${whoisUser}`)
        .addFields({
          name: "Joined At",
          value: `${whoisUser.joinedAt?.toLocaleDateString()} at ${whoisUser.joinedAt?.toLocaleTimeString([], {hour12: true})}`,
          inline: true,
        })
        .addFields({
          name: "Created At",
          value: `${whoisUser.user.createdAt.toLocaleDateString()} at ${whoisUser.user.createdAt.toLocaleTimeString([], {hour12: true})}`,
          inline: true,
        }) 
        .addFields({
          name: `Roles (${roleCount})`,
          value: roles,
          inline: false,
        } as APIEmbedField)
        .setThumbnail(whoisUser.user.avatarURL())
        .setFooter({text: `User ID: ${whoisUser.id} | Today at ${date.toLocaleTimeString([], {hour12: true})}`})
        .setColor("#5865f2");
    
      await interaction.reply({embeds: [embedWhois]});
    }
  } catch (error) {
    console.error('Error in whois command:', error);
    if (interaction.isChatInputCommand() && !interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: 'An error occurred while executing this command.',
        ephemeral: true,
      }).catch(console.error);
    }
  }
});

// Login with error handling
client.login(process.env.TOKEN).catch((error) => {
  console.error('Failed to login:', error);
  process.exit(1);
});
