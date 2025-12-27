const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avertir un membre')
    .addUserOption(option => option.setName('membre').setDescription('Membre à avertir').setRequired(true))
    .addStringOption(option => option.setName('raison').setDescription('Raison de l\'avertissement').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const target = interaction.options.getUser('membre');
      const reason = interaction.options.getString('raison');

      const warnings = client.userWarnings.get(target.id) || [];
      warnings.push({ reason, date: new Date(), moderator: interaction.user.tag });
      client.userWarnings.set(target.id, warnings);

      await interaction.editReply({ content: `⚠️ ${target.tag} a reçu un avertissement (${warnings.length}/3). Raison : ${reason}` });

      if (warnings.length >= 3) {
        const member = await interaction.guild.members.fetch(target.id);
        if (member.bannable) {
          await member.ban({ reason: '3 avertissements atteints' });
          await interaction.followUp({ content: `🔨 ${target.tag} a été banni automatiquement (3 avertissements).`, ephemeral: true });
          client.userWarnings.delete(target.id);
        }
      }
    } catch (error) {
      console.error('Error in warn command:', error);
      await interaction.editReply({ content: '❌ Erreur lors de l\'avertissement.' });
    }
  }
};