module.exports = {
  async handleSelect(interaction, client) {
    try {
      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply({ content: `Vous avez sélectionné : ${interaction.values.join(', ')}` });
    } catch (error) {
      console.error('Error handling select:', error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: '❌ Une erreur est survenue.', ephemeral: true });
      }
    }
  }
};