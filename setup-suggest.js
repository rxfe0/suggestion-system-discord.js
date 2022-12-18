const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ChannelType} = require('discord.js')
const suggestionSetup = require('../../models/suggestionSetup')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setup-suggest')
    .setDescription('Sets up the suggestions for this server!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => 
        option.setName('channel')
        .setDescription('In which channel do you want to set up suggestions?')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

    async execute(interaction) {
        const {options, channel} = interaction;

        const embed = new EmbedBuilder()
        .setColor('Orange');

        const suggestChannel = options.getChannel('channel')

        suggestionSetup.findOne({ GuildId: interaction.guild.id}, async (err, data) => {
            if (err) throw err;

            if (!data) {
                
                interaction.reply({embeds: [embed.setDescription(`Successfully set up this server's suggestions!`)]})

                suggestionSetup.create({
                    GuildId: interaction.guild.id,
                    ChannelId: suggestChannel.id
                })
            }

            if (data) {
                interaction.reply({embeds: [embed.setDescription(`Successfully set up this server's suggestions!`)]})

                await suggestionSetup.findOneAndDelete({GuildId: interaction.guild.id, data})

                suggestionSetup.create({
                    GuildId: interaction.guild.id,
                    ChannelId: suggestChannel.id
                })
            }
        })
    }
}