require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
  {
    name: "purge",
    description: "Deletes a specified amount of messages",
    options: [
      {
        name: "amount",
        description: "Enter the amount of messages you want to delete",
        type: ApplicationCommandOptionType.Number,
        required: true
      }
    ]
  },
  {
    name: "whois",
    description: "Displays info about a specific user",
    options: [
      {
        name: "user",
        description: "Choose a user to display info about",
        type: ApplicationCommandOptionType.User,
        required: true
      }
    ]
  }
];

const rest = new REST({ version: "10" }).setToken(`${process.env.TOKEN}`);

(async () => {
  try {
    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.GUILD_ID // Use only GUILD_ID
      ),
      { body: commands }
    );

    console.log("Slash commands were registered successfully!");
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();
