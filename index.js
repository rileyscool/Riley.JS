const quickdb = require(`quick.db`);
const discord = require(`discord.js`);
const fs = require(`fs`);
const embeds = require(`./embeds.js`);

function init( {
  client,
  commandsDirectory,
  eventsDirectory,
  prefix,
}) {
  if (!client) throw "You need to provide a client in the init() function!";

  client.riley = this;

  // Event Handler
  if (eventsDirectory) {
    if (!fs.existsSync(eventsDirectory)) {
      throw "The provided events directory is invalid!";
    }
    for (const file of fs.readdirSync(eventsDirectory)) {
      client.on(file.split(".js")[0], (...args) => {
        const event = require(eventsDirectory + file);
        event.execute(client, ...args);
      });
    }
  }

  // Command Handler
  if (commandsDirectory) {
    client.commands = new Map();
    client.commands.aliases = new Map();
    if (!fs.existsSync(commandsDirectory)) {
      throw "The provided commands directory is invalid!\n"+commandsDirectory;
    }
    for (const file of fs.readdirSync(commandsDirectory)) {
      const command = require(commandsDirectory + file);
      if (client.commands.get(command.name)) {
        throw "You used the same command name multiple times!";
      } else {
        client.commands.set(command.name, command);
        for (const alias of command.aliases) {
          if (
            client.commands.get(alias) ||
            client.commands.aliases.get(alias)
          ) {
            throw "You set an alias as an already used command name!";
          } else {
            client.commands.aliases.set(alias, command);
          }
        }
      }
    }
    if (!prefix) {
      throw "You need to provide a prefix!";
    }
    client.on("messageCreate", (message) => {
      if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        if (
          client.commands.get(command) ||
          client.commands.aliases.get(command)
        ) {
          var cmd =
          client.commands.get(command) || client.commands.aliases.get(command);
          if (cmd.permission == null) {
            return cmd.execute(client, message, args);
          } else
          if (cmd.permission == "DEV" || cmd.permission == "Developer") {
            if (client.devs.includes(message.member.id)) {
              return cmd.execute(client, message, args);
            }
          } else
          if (message.member.permissions.has(cmd.permission)) {
            return cmd.execute(client, message, args);
          }
          message.channel.send({
            embeds: [embeds.InvalidPermissions.setAuthor({
              name: message.author.tag, iconURL: message.author.avatarURL()})],
          });
        }
      }
    });
  }

  client.on(`ready`,
    () => {
      console.log(`Riley.JS has logged in as ${client.user.tag}`);
    });
}

module.exports = {
  init,
  embeds,
};
