const {PermissionFlagsBits, EmbedBuilder} = require('discord.js');
const SuggestionSchema = require('../../models/suggestion');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        const {member, guildId, customId, message} = interaction;

        if(!interaction.isButton()) return;

        const embedd = new EmbedBuilder()
        .setColor('Orange')

        if (customId == 'suggest-accept' || customId == 'suggest-decline') {
            if (!member.permissions.has(PermissionFlagsBits.Administrator))

                return interaction.reply({embeds: [embedd.setDescription('You do not have permission to use that button!')], ephemeral: true})

                SuggestionSchema.findOne({GuildId: guildId, MessageId: message.id}, async(err, data) => {
                    if (err) throw err;

                    if (!data)
                        return interaction.reply({embeds: [embedd.setDescription('No data was found, please contact `rxfe#1198`!')], ephemeral: true})

                    const embed = message.embeds[0];

                    if (!embed)
                        return interaction.reply({embeds: [embedd.setDescription('No embed was found, please contact `rxfe#1198`!')], ephemeral: true})

                    switch (customId) {
                        case 'suggest-accept':
                            embed.data.fields[1] = {name: 'Status:', value: 'Accepted!'}
                            const AcceptedEmbed = EmbedBuilder.from(embed);

                            message.edit({embeds: [AcceptedEmbed]});
                            interaction.reply({embeds: [embedd.setDescription('Successfully accepted the suggestion!')], ephemeral: true})
                            break;
                        case 'suggest-decline':
                            embed.data.fields[1] = {name: 'Status:', value: 'Declined!'}
                            const DeclinedEmbed = EmbedBuilder.from(embed);

                            message.edit({embeds: [DeclinedEmbed]});
                            interaction.reply({embeds: [embedd.setDescription('Successfully declined the suggestion!')], ephemeral: true})
                    }
                })
        }
    }
}
