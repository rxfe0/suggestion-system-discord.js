const {EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits} = require('discord.js')
const suggestionSetup = require('../../models/suggestionSetup')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('remove-suggest')
    .setDescription('Removes suggestions from this server!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const embed = new EmbedBuilder()
        .setColor('Orange')

        suggestionSetup.findOne({GuildId: interaction.guild.id}, async (err, data) => {
            if (err) throw err;

            if (!data) {
                return interaction.reply({embeds: [embed.setDescription(`Suggestions are not set up in this server!`)], ephemeral: true})
            }

            if (data) {
                interaction.reply({embeds: [embed.setDescription(`Successfully removed this server's suggestions!`)]})

                await suggestionSetup.findOneAndDelete({GuildId: interaction.guild.id, data})
            }
        })
    }
}