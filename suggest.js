const { ActionRowBuilder } = require('@discordjs/builders');
const {SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, SlashCommandAttachmentOption} = require('discord.js')
const SuggestionSchema = require('../../models/suggestion')
const suggestionSetup = require('../../models/suggestionSetup')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Makes a suggestion of your choice and sents it in the suggestions channel!')
    .addStringOption(option => 
        option.setName('description')
        .setDescription('What is your suggestion?')
        .setRequired(true)
    ),

    async execute(interaction) {
        const {options, guildId, member, user, guild} = interaction;

        const description = options.getString('description')

        const channel = guild.channels.cache.get('900238237010903090')

        const embed = new EmbedBuilder()
        .setColor('Orange')
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({dynamic: true})})
        .addFields(
            {name: 'Suggestion:', value: description, inline: false},
            {name: 'Status:', value: 'Pending...', inline: false},
        )
        .setTimestamp();

        const errEmbed = new EmbedBuilder()
        .setColor('Orange')
        .setDescription("Suggestions are not set up in this server!")

        const embedd = new EmbedBuilder()
        .setColor('Orange')
        .setDescription('Successfully sent the suggestion in the suggestions channel!')

        suggestionSetup.findOne({GuildId: interaction.guild.id}, async (err, data) => {
            if (err) throw err;

            if (!data) {
                return interaction.reply({embeds: [errEmbed], ephemeral: true})
            }

            if (data) {
                const suggestionChannel = interaction.guild.channels.cache.get(data.ChannelId);

                const buttons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('suggest-accept').setLabel('Accept').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId('suggest-decline').setLabel('Decline').setStyle(ButtonStyle.Danger),
                );
        
                try {
                    const m = await suggestionChannel.send({embeds: [embed], components: [buttons], fetchReply: true});
                    await interaction.reply({embeds: [embedd], ephemeral: true})
        
                    SuggestionSchema.create({
                        GuildId: guildId, MessageId: m.id, Details: [
                            {
                                MemberID: member.id,
                                Suggestion: description
                            }
                        ]
                    });
        
                } catch (err) {
                    console.log(err)
                }
            }
        })
    }
}