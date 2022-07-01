const { DisTube } = require('distube')
const Discord = require("discord.js");
const { Client, Intents } = require('discord.js');
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_VOICE_STATES
  ],
  partials: [
    "MESSAGE",
    "CHANNEL",
    "GUILD_MEMBER"
  ],
  allowedMentions: {
    parse: [ ],
    repliedUser: false,
  }
});
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')

client.distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: false,
  emitAddSongWhenCreatingQueue: true,
  emitAddListWhenCreatingQueue: true,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin()
  ],
  youtubeDL: false
})

const config = require('./config.json');
client.emotes = config.emoji
client.commands = new Discord.Collection();
client.slash = new Discord.Collection();
client.aliases = new Discord.Collection();
require('discord-logs')(client);
require('colors');
require('./slash.js');
["handlers", "events", "slash"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});
process.on('unhandledRejection', (reason, p) => {
  console.log(' [antiCrash] :: Unhandled Rejection/Catch');
  console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log(' [antiCrash] :: Uncaught Exception/Catch');
  console.log(err, origin);
}) 
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)');
  console.log(err, origin);
});
process.on('multipleResolves', (type, promise, reason) => {
  console.log(' [antiCrash] :: Multiple Resolves');
  console.log(type, promise, reason);
});
process.on('Missing Permissions', (type, promise, reason) => {
  console.log(' [antiCrash] :: Permissions insuffisantes !');
  console.log(type, promise, reason);
});
  
  const status = queue =>

  `> Volume: \`${queue.volume}%\`\n> Filter: \`${queue.filters.join(', ') || 'Off'}\`\n> Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'Toute la file' : 'Ce son') : 'Off'
  }\`\n> Lecture automatique: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
  .on('playSong', (queue, song) =>
  queue.textChannel.send({
    embeds: [new Discord.MessageEmbed()
      .setColor('#099b1e')
      .setTitle(`<a:DiscordMusic:972869414850527333> Lecture`)
      .setDescription(`Vous écoutez **${song.name}**\n${status(queue)}\n> Source: ${song.source.replace('youtube', '<:youtube:972867378234933328>').replace('soundcloud', '<:soundcl:972868351187615815>').replace('spotify', '<:7370_Spotify:972868724958855179>')}\n[Cliquez ici pour la télécharger](${song.streamURL})\n\n**__Informations:__\n[Ajouter le bot](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&permissions=7&scope=bot%20applications.commands)\n[Contacter l'owner en l'ajoutant en ami](https://discord.gg/uWR8PvAP)\n[Rejoindre le serveur support](https://discord.gg/qH2Dn3TV)**`)
      .setThumbnail(song.thumbnail)
      .setFooter(`Bot Musique gratuit 24/7`)
      


    ]
  })
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.success} | J'ai ajouté ${song.name} - \`${song.formattedDuration}\` à la liste de ${song.user}`
    )
    
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `${client.emotes.success} | Ajouté \`${playlist.name}\` (${
        playlist.songs.length
      } musiques) a la file\n${status(queue)}\n*Si le résultat n'est pas pertinent, utilisez la commande ultraplay*`
    )
  )
  .on('error', (channel, e) => {
    channel.send(`${client.emotes.error} | Une erreur s'est produite`)
    console.error(e)
  })
  .on('empty', channel => channel.send(':pill: Salon vocal vide... je le quitte.'))
  .on('searchNoResult', (message, query) =>
    message.channel.send(`${client.emotes.error} | Aucun résultat pour \`${query}\`!`)
  )
  .on('finish', queue => queue.textChannel.send('File de musique terminé!'))


  client.on('interactionCreate', async interaction => {
   



    if(interaction.isSelectMenu()){
    if(interaction.customId.startsWith('select-menu')){
     
        //delete interaction
        interaction.update({
          components: [],
          content: `J'ajoute la playlist sélectionné a la file...`
        })
        const string = interaction.values[0]
        const memberss = await interaction.guild.members.fetch(interaction.user.id)
        client.distube.play(memberss.voice.channel, string, {
          member: memberss,
          textChannel: interaction.channel,
          interaction
        })
      
    }
  }
  })





client.login(config.token);