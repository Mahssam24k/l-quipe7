const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Voir les avertissements d\'un membre')
    .addUserOption(option => option.setName('membre').setDescription('Membre à vérifier').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const target = interaction.options.getUser('membre');
      const warnings = client.userWarnings.get(target.id) || [];

      if (warnings.length === 0) {
        return await interaction.editReply({ content: `✅ ${target.tag} n'a aucun avertissement.` });
      }

      const embed = new EmbedBuilder()
        .setTitle(`⚠️ Avertissements de ${target.tag}`)
        .setColor('#FFA500')
        .setDescription(warnings.map((w, i) => `**${i + 1}.** ${w.reason}\n*Par ${w.moderator} le ${new Date(w.date).toLocaleDateString()}*`).join('\n\n'))
        .setFooter({ text: `Total: ${warnings.length}/3` });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in warns command:', error);
      await interaction.editReply({ content: '❌ Erreur lors de la récupération des avertissements.' });
    }
  }
};