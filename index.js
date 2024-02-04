const Discord  = require("discord.js")
const bot = new Discord.Client({intents: 3276799})
const config = require('./config')
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


bot.login(process.env.TOKEN)


app.listen(PORT, () => {
  console.log(`Le bot est en cours de lancement sur le port ${PORT}`);
});



bot.on('ready', () => {
  
  const channel = bot.channels.cache.get('1163902591768477776');
  if (!channel) return console.error('Le salon spécifié est introuvable.');
  channel.send('Le bot est maintenant connecté ! <@510818650307952640>');
    console.log(`Connecté en tant que ${bot.user.tag}`);

    

    let status = [
      {
        name: 'je ne comprends pas ta question',
        type: Discord.ActivityType.Listening,
      },
      {
        name: 'désolé, mais tu as tort',
        type: Discord.ActivityType.Watching,
      },
      {
        name: "'n'hésitez pas à me solliciters !",
        type: Discord.ActivityType.Playing,
      },
    
      
    ]
    
  setInterval(() =>{
    let random = Math.floor(Math.random() * status.length);
    bot.user.setActivity(status[random]);
  },3600000);
  
});



bot.on('messageCreate', (message) => {
  if (message.author.bot) return; // Ne répondez pas aux messages des bots
  if (!message.content.startsWith(config.prefix)) return; // Vérifiez s'il commence par le préfixe

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'say') {
    // Vérifiez si l'utilisateur est un administrateur
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply('Seuls les administrateurs sont autorisés à utiliser cette commande.');
    } 

    // Récupère le message de l'utilisateur, en excluant le préfixe
    const userMessage = args.join(' ');
    if (!userMessage) {
      return message.channel.send('Veuillez écrire un message.');
    }

    // Supprime la commande de l'utilisateur
    message.delete();
  
    // Envoie le message personnalisé de l'utilisateur
    message.channel.send(userMessage);
  }
});


bot.on('messageCreate', (message) => {
  if (message.content === '!ping') {
    const embed = new Discord.EmbedBuilder()
      .setTitle('Ping')
      .setDescription('Pong!')
      .setColor('#0099ff');

    message.channel.send({ embeds: [embed] });
  }

    
});



// Au lieu d'utiliser setTimeout, j'utilise setInterval. setInterval permet d'exécuter une fonction à intervalles réguliers, tandis que setTimeout ne l'exécute qu'une seule fois (évite l'envoi de plein de message à la foi). Cela permet d'éviter de réinitialiser la temporisation à chaque message créé.

// Stockage de l'identifiant de l'intervalle : J'ai ajouté une variable reminderInterval pour stocker l'identifiant de l'intervalle créé par setInterval. Cela nous permet de le manipuler plus tard, notamment pour l'arrêter lorsque l'envoi de l'embed est désactivé.
