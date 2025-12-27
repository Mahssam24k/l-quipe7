const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Gérer le système de tickets')
    .addSubcommand(subcommand =>
      subcommand
        .setName('panel')
        .setDescription('Créer un panel de tickets'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: false });

    try {
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === 'panel') {
        const embed = new EmbedBuilder()
          .setTitle('🎫 Système de tickets')
          .setDescription('Besoin d\'aide ? Cliquez sur le bouton ci-dessous pour ouvrir un ticket.\n\nUn membre du staff vous répondra dès que possible.')
          .setColor('#00FF00')
          .addFields(
            { name: '📝 Comment ça marche ?', value: '1. Cliquez sur le bouton\n2. Un salon privé sera créé\n3. Expliquez votre problème\n4. Attendez la réponse du staff' }
          )
          .setFooter({ text: 'Support disponible 24/7' })
          .setTimestamp();

        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('open_ticket')
            .setLabel('📩 Ouvrir un ticket')
            .setStyle(ButtonStyle.Success)
            .setEmoji('🎫')
        );

        await interaction.channel.send({ embeds: [embed], components: [button] });
        await interaction.editReply({ content: '✅ Panel de tickets créé avec succès dans ce salon !' });
      }
    } catch (error) {
      console.error('Error in ticket command:', error);
      await interaction.editReply({ content: '❌ Une erreur est survenue.' });
    }
  }
};