module.exports = {
  async handleButton(interaction, client) {
    const { customId } = interaction;

    try {
      if (customId === 'open_ticket') {
        await interaction.deferReply({ ephemeral: true });

        const guild = interaction.guild;
        const member = interaction.member;

        const existingChannel = guild.channels.cache.find(
          ch => ch.name === `ticket-${member.user.username.toLowerCase()}` && ch.type === 0
        );

        if (existingChannel) {
          return await interaction.editReply({ content: '❌ Vous avez déjà un ticket ouvert !' });
        }

        const ticketChannel = await guild.channels.create({
          name: `ticket-${member.user.username}`,
          type: 0,
          permissionOverwrites: [
            { id: guild.id, deny: ['ViewChannel'] },
            { id: member.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] }
          ]
        });

        const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
        const closeButton = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('close_ticket')
            .setLabel('🔒 Fermer le ticket')
            .setStyle(ButtonStyle.Danger)
        );

        await ticketChannel.send({
          content: `${member}, votre ticket a été créé !`,
          components: [closeButton]
        });

        await interaction.editReply({ content: `✅ Ticket créé : ${ticketChannel}` });
      }

      if (customId === 'close_ticket') {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.channel.name.startsWith('ticket-')) {
          return await interaction.editReply({ content: '❌ Cette commande ne fonctionne que dans un ticket.' });
        }

        await interaction.editReply({ content: '🔒 Fermeture du ticket dans 3 secondes...' });
        setTimeout(async () => {
          await interaction.channel.delete();
        }, 3000);
      }
    } catch (error) {
      console.error('Error handling button:', error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: '❌ Une erreur est survenue.', ephemeral: true });
      } else {
        await interaction.editReply({ content: '❌ Une erreur est survenue.' });
      }
    }
  }
};