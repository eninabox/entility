const { Client, Intents, Collection, Options } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const dotenv = require("dotenv");


dotenv.config();
const token = process.env.BOT_TOKEN;
const fs = require("fs");
//update stats
let count = 0;
try {
  count = parseInt(fs.readFileSync('yimpact-count.txt', 'utf8'));
} catch (err) {
  console.error(err);
}

const client = new Client({ intents: 32767 });
client.commands = new Collection();
client.timers = new Map();

const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log("YIMPACT is online!");
  client.user.setActivity(`over ${count} sweet dreams~`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(token);
