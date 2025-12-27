const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulser un membre')
    .addUserOption(option => option.setName('membre').setDescription('Membre à expulser').setRequired(true))
    .addStringOption(option => option.setName('raison').setDescription('Raison de l\'expulsion'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const target = interaction.options.getUser('membre');
      const reason = interaction.options.getString('raison') || 'Aucune raison fournie';

      const member = await interaction.guild.members.fetch(target.id);
      
      if (!member.kickable) {
        return await interaction.editReply({ content: '❌ Je ne peux pas expulser ce membre.' });
      }

      await member.kick(reason);
      await interaction.editReply({ content: `✅ ${target.tag} a été expulsé. Raison : ${reason}` });
    } catch (error) {
      console.error('Error in kick command:', error);
      await interaction.editReply({ content: '❌ Erreur lors de l\'expulsion.' });
    }
  }
};