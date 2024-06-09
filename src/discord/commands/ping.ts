import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const pingCommand = {
  cmd: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  execute: async (interaction: ChatInputCommandInteraction) => {
    await interaction.followUp("pong!");
  },
};
