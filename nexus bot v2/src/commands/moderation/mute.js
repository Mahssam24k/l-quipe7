const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Rendre muet un membre')
    .addUserOption(option => option.setName('membre').setDescription('Membre à rendre muet').setRequired(true))
    .addIntegerOption(option => option.setName('duree').setDescription('Durée en minutes').setRequired(true))
    .addStringOption(option => option.setName('raison').setDescription('Raison du mute'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const target = interaction.options.getUser('membre');
      const duration = interaction.options.getInteger('duree');
      const reason = interaction.options.getString('raison') || 'Aucune raison fournie';

      const member = await interaction.guild.members.fetch(target.id);
      
      if (!member.moderatable) {
        return await interaction.editReply({ content: '❌ Je ne peux pas rendre muet ce membre.' });
      }

      await member.timeout(duration * 60 * 1000, reason);
      await interaction.editReply({ content: `✅ ${target.tag} a été rendu muet pour ${duration} minutes. Raison : ${reason}` });
    } catch (error) {
      console.error('Error in mute command:', error);
      await interaction.editReply({ content: '❌ Erreur lors du mute.' });
    }
  }
};