const Discord  = require("discord.js")
const bot = new Discord.Client({intents: 3276799})
const config = require('./config')
const express = require('express');
const { EmbedBuilder } = require("@discordjs/builders");
const app = express();
const PORT = process.env.PORT || 3000;

// Faire un facemath de citation (tournoi) || votez la meilleur citation, un 1vs1

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



const messagesaupiff = [
  "Si je ne pousse pas sur Git, je ne rends pas service à mon code, tu comprends ?. Rappelez-toi, de ne pas oublier de pousser !",

  "Ferme ton poste, sinon tu n'auras pas toute mon attention à 100%. Git est le seul écran qui devrait captiver toute ta concentration à 100% ! Alors, n'oublie pas de pousser.",

  "Si tu as des questions sur Git, demande-moi. Si je ne comprends pas ta question, c'est probablement que je ne comprends pas ta question. Mais tel n'est pas la question, oublie pas de pousser !",

  "Mes chers développeurs, rappelez-vous que c'est moi, Vivet, qui vous dit : tenez-vous droit, même dans le monde virtuel du code. En entreprise, le code se doit d'avoir une posture impeccable ! Cela inclut le rappel essentiel de ne pas oublier de pousser ! (mmhh j'aurai du dire ça à ma femme..)",

  "Pousser sur GitLab, c'est comme survivre dans un couloir : c'est ma clé du succès ! Alors, ne laisse pas ton code mourir dans l'oubli du couloir local. Partage-le avec moi pour que je m'approprie toutes tes idées, que je les pille et que je devienne très, très riche. Donc, n'oublie pas de pousser !!",

  "Désolé, mais si tu n'utilises pas Git, tu as tort. Comme je l'ai dit un jour, utilise tes 2 mains, ça ira plus vite. Cela n'a aucun sens ? Je sais. Mais tu sais ce qui a aucun sens babouin pousse cassette ? Tu es atteint d'une logorrhée et à ton âge c'est grave. C'est une diarrhée verbale ! En tout cas oublie pas de pousser !",
];

let sendEmbed = true; // Variable pour activer/désactiver l'envoi de l'embed
let reminderInterval; // Variable pour stocker l'identifiant de l'intervalle

bot.on('messageCreate', (message) => {
  const channel = bot.channels.cache.get('1151478201823023214');

  // Obtenez la date et l'heure actuelles
  const now = new Date();

  // Vérifiez si le jour est un lundi, mardi, mercredi, jeudi ou vendredi
  const weekDays = [1, 2, 3, 4, 5].includes(now.getDay());

  // Vérifiez si l'heure est entre 8h et 17h
  const workingHours = now.getHours() >= 8 && now.getHours() < 22;
  
  // Sélectionnez un message aléatoire parmi la liste
  const randomMessage = messagesaupiff[Math.floor(Math.random() * messagesaupiff.length)];

  // Si c'est un jour de semaine, dans les heures de travail et le nombre de semaines écoulées est pair, envoyez le message
  if (weekDays && workingHours && sendEmbed && !reminderInterval) {

    // Démarrez un intervalle qui se répète toutes les 10 secondes
    reminderInterval = setInterval(async () => {

      // Créez un nouvel embed avec le message sélectionné
      const embedMessage = new Discord.EmbedBuilder()
        .setColor('#3498db')
        .setTitle('<a:rappel:1185911636565954620> Rappel Quotidien <a:rappel:1185911636565954620>')
        .setDescription(randomMessage)
        .setAuthor({
          name: `${bot.user.username}`,
          iconURL: `${bot.user.displayAvatarURL()}`
        })  
        .setFooter({
          text: `${message.guild.name} - ${new Date().toLocaleString()}`,
          iconURL: message.guild.iconURL({ dynamic: true, format: 'png', size: 1024 })
        });

      // Envoyez l'embed dans le canal spécifié
      await channel.send({ embeds: [embedMessage] });
      channel.send('@everyone');

      console.log(`Rappel quotidien envoyé à ` + now);
    }, 10000); // 10 secondes
  }
});

// Commande pour désactiver l'envoi de l'embed

bot.on('messageCreate', (message) => {
  if (message.content.startsWith(config.prefix + "status")) {
    sendEmbed = !sendEmbed;

    // Arrêtez l'intervalle si l'envoi est désactivé
    if (!sendEmbed && reminderInterval) {
      clearInterval(reminderInterval);
      reminderInterval = null; // réinitialise, remet le compteur à zéro
    }

    message.channel.send(`L'envoi de l'embed est maintenant ${sendEmbed ? 'activé' : 'désactivé'}.`);
    console.log(`Le status de la commande est maintenant ${sendEmbed ? 'activé' : 'désactivé'}.`);
  }
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