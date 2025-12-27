const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tempban')
    .setDescription('Bannir temporairement un membre')
    .addUserOption(option => option.setName('membre').setDescription('Membre à bannir').setRequired(true))
    .addIntegerOption(option => option.setName('duree').setDescription('Durée en heures').setRequired(true))
    .addStringOption(option => option.setName('raison').setDescription('Raison du ban'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const target = interaction.options.getUser('membre');
      const duration = interaction.options.getInteger('duree');
      const reason = interaction.options.getString('raison') || 'Aucune raison fournie';

      const member = await interaction.guild.members.fetch(target.id);
      
      if (!member.bannable) {
        return await interaction.editReply({ content: '❌ Je ne peux pas bannir ce membre.' });
      }

      await member.ban({ reason: `${reason} (Durée: ${duration}h)` });
      await interaction.editReply({ content: `✅ ${target.tag} a été banni pour ${duration}h. Raison : ${reason}` });

      setTimeout(async () => {
        try {
          await interaction.guild.members.unban(target.id);
        } catch (error) {
          console.error('Error unbanning user:', error);
        }
      }, duration * 60 * 60 * 1000);
    } catch (error) {
      console.error('Error in tempban command:', error);
      await interaction.editReply({ content: '❌ Erreur lors du bannissement temporaire.' });
    }
  }
};