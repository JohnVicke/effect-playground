import { Collection } from "discord.js";
import { pingCommand } from "./ping";

export function getCommands() {
  const discordCommands = new Collection();
  discordCommands.set(pingCommand.cmd.name, pingCommand.cmd);
  return discordCommands;
}
