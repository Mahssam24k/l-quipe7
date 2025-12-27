const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannir un membre')
    .addUserOption(option => option.setName('membre').setDescription('Membre à bannir').setRequired(true))
    .addStringOption(option => option.setName('raison').setDescription('Raison du ban'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const target = interaction.options.getUser('membre');
      const reason = interaction.options.getString('raison') || 'Aucune raison fournie';

      const member = await interaction.guild.members.fetch(target.id);
      
      if (!member.bannable) {
        return await interaction.editReply({ content: '❌ Je ne peux pas bannir ce membre.' });
      }

      await member.ban({ reason });
      await interaction.editReply({ content: `✅ ${target.tag} a été banni. Raison : ${reason}` });
    } catch (error) {
      console.error('Error in ban command:', error);
      await interaction.editReply({ content: '❌ Erreur lors du bannissement.' });
    }
  }
};