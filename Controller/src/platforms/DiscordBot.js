import {Client, Intents} from 'discord.js';

class DiscordBot {
    // Token: OTk0OTcxNDQyNDQzNzE4Njk2.GSsZ5k.U3p_wQfOQxXIMtiPkELlG9UJkWeZ4o46EFD45o
    constructor() {

        this.bot = new Client({

            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]

        });

        return;
    }

    login() {

        this.bot.login("OTk0OTcxNDQyNDQzNzE4Njk2.GSsZ5k.U3p_wQfOQxXIMtiPkELlG9UJkWeZ4o46EFD45o");
        
        return;
    }

    sendFeedback(text) {

        this.bot.channels.cache.get("994969568617451601").send({
            content: "\u200B",
            embeds: [{
                color: "0xFFEB3C",
                title: "New Feedback",
                description: text,
                footer: {
                    text: "© uSay!t | All rights reserved",
                }
            }]
        });
        
        return;
    }

}

export default DiscordBot;