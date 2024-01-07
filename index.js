const Discord = require("discord.js");
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const config = require('./config');

const bot = new Discord.Client({ intents: 3276799 });
let sendEmbed = true; // Variable pour activer/désactiver l'envoi de l'embed
let reminderInterval = null; // Variable pour stocker l'identifiant de l'intervalle

bot.login(process.env.TOKEN);

app.listen(PORT, () => {
  console.log(`Le bot est en cours de lancement sur le port ${PORT}`);
});

bot.on('ready', () => {
  const channel = bot.channels.cache.get('1163902591768477776');
  if (!channel) return console.error('Le salon spécifié est introuvable.');
  
  channel.send('Le bot est maintenant connecté ! <@510818650307952640>');
  console.log(`Connecté en tant que ${bot.user.tag}`);

  const status = [
    { name: 'je ne comprends pas ta question', type: Discord.ActivityType.Listening },
    { name: 'désolé, mais tu as tort', type: Discord.ActivityType.Watching },
    { name: "'n'hésitez pas à me solliciter !", type: Discord.ActivityType.Playing },
  ];

  setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    bot.user.setActivity(status[random]);
  }, 3600000);
});

bot.on('messageCreate', (message) => {
  const channel = bot.channels.cache.get('1151478201823023214');
  const now = new Date(new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }));

  if (message.content.startsWith(config.prefix + "pushgit") && message.guild && !message.author.bot) {
    message.delete();
    sendReminder(channel, now);
  }

  if ([1, 2, 3, 4, 5].includes(now.getDay()) && sendEmbed) {
    const specifiedHours = [10, 12, 15, 17].includes(now.getHours());

    if (specifiedHours && lastHour !== now.getHours()) {
      sendReminder(channel, now);
    }
  }
});

bot.on('messageCreate', (message) => {
  if (message.content.startsWith(config.prefix + "status")) {
    sendEmbed = !sendEmbed;
    lastHour = null;
    message.channel.send(`L'envoi de l'embed est maintenant ${sendEmbed ? 'activé' : 'désactivé'}.`);
    console.log(`Le statut de la commande est maintenant ${sendEmbed ? 'activé' : 'désactivé'}.`);
  }
});

function sendReminder(channel, now) {
  const messagesaupiff = [
    "Si je ne pousse pas sur Git, je ne rends pas service à mon code, tu comprends ?. Rappele-toi, de ne pas oublier de pousser !",
  
    "Ferme ton poste, sinon tu n'auras pas toute mon attention à 100%. Git est le seul écran qui devrait captiver toute ta concentration à 100% ! Alors, n'oublie pas de pousser.",
  
    "Si tu as des questions sur Git, demande-moi. Si je ne comprends pas ta question, c'est probablement que je ne comprends pas ta question. Mais tel n'est pas la question, oublie pas de pousser !",
  
    "Mes chers développeurs, rappelez-vous que c'est moi, Vivet, qui vous dit : tenez-vous droit, même dans le monde virtuel du code. En entreprise, le code se doit d'avoir une posture impeccable ! Cela inclut le rappel essentiel de ne pas oublier de pousser ! (mmhh j'aurai du dire ça à ma femme..)",
  
    "Pousser sur Git, c'est comme survivre dans un couloir : c'est ma clé du succès ! Alors, ne laisse pas ton code mourir dans l'oubli du couloir local. Partage-le avec moi pour que je m'approprie toutes tes idées, que je les pille et que je devienne très, très riche. Donc, n'oublie pas de pousser !!",
  
    "Désolé, mais si tu n'utilises pas Git, tu as tort. Comme je l'ai dit un jour, utilise tes 2 mains, ça ira plus vite. Cela n'a aucun sens ? Je sais. Mais tu sais ce qui a aucun sens babouin pousse cassette ? Tu es atteint d'une logorrhée et à ton âge c'est grave. C'est une diarrhée verbale ! Pour y remédier, oublie pas de pousser toutes les 2 heures !",
  ]; // Remplacez cela par votre liste de messages


  const randomMessage = messagesaupiff[Math.floor(Math.random() * messagesaupiff.length)];

  const embedMessage = new Discord.MessageEmbed()
    .setColor('#3498db')
    .setTitle(`<a:rappel:1185911636565954620> Rappel Quotidien à ${now.getHours()}h ! <a:rappel:1185911636565954620>`)
    .setDescription(randomMessage)
    .setAuthor({
      name: `${bot.user.username}`,
      iconURL: `${bot.user.displayAvatarURL()}`
    })
    .setFooter({
      text: `${channel.guild.name} - ${now.toLocaleString("fr-FR")}`,
      iconURL: channel.guild.iconURL({ dynamic: true, format: 'png', size: 1024 })
    });

  channel.send({ embeds: [embedMessage] });
  channel.send('<@&1192744421201035374>');

  console.log(`Rappel quotidien envoyé à ` + now);
}

bot.on('messageCreate', (message) => {
  if (message.content.startsWith(config.prefix + "status")) {
    sendEmbed = !sendEmbed;

    if (!sendEmbed && reminderInterval) {
      clearInterval(reminderInterval);
      reminderInterval = null;
    }

    message.channel.send(`L'envoi de l'embed est maintenant ${sendEmbed ? 'activé' : 'désactivé'}.`);
    console.log(`Le statut de la commande est maintenant ${sendEmbed ? 'activé' : 'désactivé'}.`);
  }
});

bot.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'say' && message.member.permissions.has('ADMINISTRATOR')) {
    const userMessage = args.join(' ');

    if (!userMessage) {
      return message.channel.send('Veuillez écrire un message.');
    }

    message.delete();
    message.channel.send(userMessage);
  }
});

bot.on('messageCreate', (message) => {
  if (message.content === '!ping') {
    const embed = new Discord.MessageEmbed()
      .setTitle('Ping')
      .setDescription('Pong!')
      .setColor('#0099ff');

    message.channel.send({ embeds: [embed] });
  }
});
