const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Retirer le mute d\'un membre')
    .addUserOption(option => option.setName('membre').setDescription('Membre à unmute').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const target = interaction.options.getUser('membre');
      const member = await interaction.guild.members.fetch(target.id);
      
      if (!member.moderatable) {
        return await interaction.editReply({ content: '❌ Je ne peux pas unmute ce membre.' });
      }

      await member.timeout(null);
      await interaction.editReply({ content: `✅ ${target.tag} n'est plus muet.` });
    } catch (error) {
      console.error('Error in unmute command:', error);
      await interaction.editReply({ content: '❌ Erreur lors du unmute.' });
    }
  }
};