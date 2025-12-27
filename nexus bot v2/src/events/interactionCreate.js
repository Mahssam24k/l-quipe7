const buttonHandler = require('../handlers/buttonHandler');
const selectHandler = require('../handlers/selectHandler');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error('Error executing command:', error);
        const reply = { content: '❌ Une erreur est survenue.', ephemeral: true };
        if (interaction.replied || interaction.deferred) {
          await interaction.editReply(reply);
        } else {
          await interaction.reply(reply);
        }
      }
    }

    if (interaction.isButton()) {
      await buttonHandler.handleButton(interaction, client);
    }

    if (interaction.isStringSelectMenu()) {
      await selectHandler.handleSelect(interaction, client);
    }
  }
};