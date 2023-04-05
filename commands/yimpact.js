const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require('fs');

// Read the current count from the file
let count = 0;
try {
  count = parseInt(fs.readFileSync('yimpact-count.txt', 'utf8'));
} catch (err) {
  console.error(err);
}

function writeCount(interaction) {
    try {
      fs.writeFileSync('yimpact-count.txt', count.toString());
      interaction.client.user.setActivity(`${count} sweet dreams~`);
    } catch (err) {
      console.error(err);
    }
  }

function sendMessage(channel, embed) {
  channel.send({ embeds: [embed], ephemeral: true });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("yimpact")
    .setDescription("Start a yimpact countdown.")
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("The time for the yimpact countdown (e.g., 8:33)")
        .setRequired(true)
    ),
  async execute(interaction) {
    const time = interaction.options.getString('time');
    const [hours, minutes] = time.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Oops! Something went wrong!")
            .setDescription("Invalid time format. \nPlease use the following format 'hours:minutes'.\n Hour count must be between 0-24, and min count must be between 0-59.\n(example: 1:10)")
        ],
        ephemeral: true
      });
      return;
    }

    const member = interaction.member;
    if (!member.voice.channel) {
        interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Oops! Something went wrong!")
                .setDescription("You must be in a voice channel to use this command.")
            ],
            ephemeral: true
          });
      return;
    }

    if (interaction.client.timers.has(member.id)) {
      clearTimeout(interaction.client.timers.get(member.id));
      interaction.client.timers.delete(member.id);
      interaction.reply({
        embeds: [
            new EmbedBuilder()
              .setTitle("You replaced an old timer!")
              .addFields([
                { name: "Time remaining", value: `${hours} hours ${minutes} minutes` },
              ])
          ],
          ephemeral: true
      });
    } else {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                  .setTitle("Countdown Started!")
                  .addFields([
                    { name: "Time remaining", value: `${hours} hours ${minutes} minutes` },
                  ])
              ],
              ephemeral: true
          });
    }

    const timer = setTimeout(async () => {
      if (member.voice.channel) {
        try {
          await member.voice.setChannel(null);
          count++;
          writeCount();
          sendMessage(

            interaction.channel,
            new EmbedBuilder()
                  .setTitle(`${member.displayName} has gone to bed! Sweet dreams ~`)
          );
        } catch (error) {
          console.error(error);
          sendMessage(
            interaction.channel,
            new EmbedBuilder()
                  .setDescription(`**Error:** ${member.displayName} has discovered a glitch! Please report this to En 🤔...`)
          );
        }
      } else {
        //nothing happens!
      }
      interaction.client.timers.delete(member.id);
    }, hours * 60 * 60 * 1000 + minutes * 60 * 1000);
  },
};
