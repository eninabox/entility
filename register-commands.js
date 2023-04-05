const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const dotenv = require("dotenv");

dotenv.config();
const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;

const commands = [
    {
        name: "yimpact",
        description: "Disconnects you from voicechat after a defined period of time.",
        options: [
            {
                name: "time",
                type: 3,
                description: "The time for the yimpact countdown (format: HH:mm)",
                required: true,
            }
        ],
    },
];

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        console.log("star refereshing application (/) commands!");
        
        await rest.put(Routes.applicationCommands(clientId),{
            body: commands,
        });

        console.log("Successfully reloaded application (/) commands!");
    } catch (error) {
        console.error(error);
    }
})();