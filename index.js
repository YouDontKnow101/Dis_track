const { Client, GatewayIntentBits, EmbedBuilder, Discord } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const token = "";
const PremiumRoleId = "";
const FreeChannel = "";
const PremiumChannel = "";
const LogChannel = "";

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.channelId === FreeChannel && message.content.includes("fbclid")) {
    const embed = new EmbedBuilder()
      .setColor("#ED4245")
      .setTitle(`Warning ${message.author.tag}.`);
    client.channels.cache.get(LogChannel).send({ embeds: [embed] });

    const embed1 = new EmbedBuilder()
      .setColor("#FFFFFF")
      .setDescription(
        `**Content:** \`${message.content}\`\n\n**Channel:** <#${message.channelId}>`
      )
      .setTimestamp(Date.now());
    client.channels.cache.get(LogChannel).send({ embeds: [embed1] });
  }
});

client.on("messageCreate", async (message) => {
  if (
    message.channelId === PremiumChannel &&
    message.content.includes("fbclid")
  ) {
    const member = message.member;
    if (member) {
      try {
        const premiumRole = member.guild.roles.cache.get(PremiumRoleId);
        if (premiumRole && member.roles.cache.has(PremiumRoleId)) {
          await member.roles.remove(premiumRole);
          console.log(`Premium role removed from user ${member.user.tag}`);

          const embed = new EmbedBuilder()
            .setColor("#57F287")
            .setTitle(
              `Premium Role successfully removed from ${message.author.tag}.`
            );
          client.channels.cache.get(LogChannel).send({ embeds: [embed] });
        }
      } catch (error) {
        console.error(
          `Failed to remove premium role from user ${member.user.tag}: ${error}`
        );
      }
    }

    const user = message.author;
    if (user) {
      try {
        const dmChannel = await user.createDM();
        const embed = new EmbedBuilder()
          .setColor("#57F287")
          .setTitle("Premium Role Revoked");
        await dmChannel.send({ embeds: [embed] });
        const embed1 = new EmbedBuilder()
          .setColor("#FFFFFF")
          .setDescription(
            `**Hello ${user.username}, You've lost access to your Premium Role. Please feel free to get in touch with a server moderator or administrator thought <#1061014192733290627> if you think this was an error. Thank you!\n\nFrom Unlocker Team**`
          );
        await dmChannel.send({ embeds: [embed1] });
      } catch (error) {
        console.error(`Failed to send DM to user ${user.tag}: ${error}`);
      }
    }

    const embed = new EmbedBuilder()
      .setColor("#FFFFFF")
      .setDescription(
        `**Content:** \`${message.content}\`\n\n**Channel:** <#${message.channelId}>`
      )
      .setTimestamp(Date.now());
    client.channels.cache.get(LogChannel).send({ embeds: [embed] });
  }
});

client.login(token);
