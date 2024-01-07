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


let sendEmbed = true; // Variable pour activer/désactiver l'envoi de l'embed
let lastHour; // Variable pour stocker la dernière heure à laquelle le rappel a été envoyé

bot.on('messageCreate', (message) => {
  const channel = bot.channels.cache.get('1151478201823023214');

  // Obtenez la date et l'heure actuelles en respectant le fuseau horaire français (UTC+1)
  const now = new Date(new Date().toLocaleString("fr-FR", {timeZone: "Europe/Paris"}));

  if (message.content.startsWith(config.prefix + "pushgit") && message.guild && !message.author.bot) {
    message.delete();
    // Commande manuelle pour envoyer l'embed
    sendReminder(channel, now);
  }

  if ([1, 2, 3, 4, 5].includes(now.getDay()) && sendEmbed && now.getDay() !== 0 && now.getDay() !== 6) {
    // Correction GPT3 : le rappel ne sera envoyé que si le jour de la semaine est du lundi au vendredi, sendEmbed est activé, et le jour actuel n'est ni samedi (0) ni dimanche (6). Cela devrait résoudre le problème que vous avez rencontré.
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

  const embedMessage = new Discord.EmbedBuilder()
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
  channel.send(`${mentionnedrole}`);

  lastHour = now.getHours();
  console.log(`Rappel quotidien envoyé à ` + now);
}


const fs = require('fs');
const roleId = '1192744421201035374';
const addEmoji = '✅';
const removeEmoji = '❌';
const reactionsFile = './reactionsData.json';

// Charge les données des réactions à partir du fichier JSON
let reactionsData = {};
try {
  reactionsData = JSON.parse(fs.readFileSync(reactionsFile, 'utf8'));
} catch (err) {
  console.error('Erreur lors du chargement des données des réactions :', err);
}

bot.on('messageCreate', async (message) => {
  if (message.content.startsWith(config.prefix + "addrole") && message.guild && !message.author.bot) {
    message.delete();
    const mentionedRole = await message.guild.roles.fetch(roleId).catch(console.error);

    const channelId = message.channel.id;
    let messageId = reactionsData[channelId];

    // Vérifie si le salon a déjà un message avec réactions
    if (!messageId) {
      // S'il n'y en a pas, envoie un nouveau message
      const embedMessage = {
        color: 0xF3AD53,
        title: `Ajout de rôle ${mentionedRole.name}`,
        description: `Clique sur ${addEmoji} pour ajouter le rôle\n Clique sur ${removeEmoji} pour retirer le rôle.\n\n**Rôle** : ${mentionedRole.name}\n\n(*tu peux le retirer ou l'ajouter à tout moment*)`,
      };

      const embedMessageObject = await message.channel.send({ embeds: [embedMessage] });

      messageId = embedMessageObject.id;
      reactionsData[channelId] = messageId;

      await embedMessageObject.react(addEmoji);
      await embedMessageObject.react(removeEmoji);
    }

    const filter = (reaction, user) => [addEmoji, removeEmoji].includes(reaction.emoji.name) && user.id === message.author.id;
    const collector = bot.channels.cache.get(channelId).messages.fetch(messageId)
      .then((msg) => msg.createReactionCollector({ filter }));

    collector.on('collect', async (reaction) => {
      const member = message.guild.members.cache.get(message.author.id);
      const reactingUser = reaction.users.cache.filter(user => !user.bot).first();

      if (reaction.emoji.name === addEmoji) {
        member.roles.add(roleId);
        handleReaction(message, mentionedRole, reactingUser, true);
      } else if (reaction.emoji.name === removeEmoji) {
        member.roles.remove(roleId);
        handleReaction(message, mentionedRole, reactingUser, false);
      }

      await reaction.users.remove(message.author.id);
    });

    // Sauvegarde les données des réactions dans le fichier JSON
    saveReactionsData();
  }
});

// Fonction pour gérer la réaction
async function handleReaction(message, mentionedRole, reactingUser, isAdd) {
  if (reactingUser) {
    const action = isAdd ? 'ajouté' : 'retiré';
    console.log(`Le rôle ${mentionedRole.name} a été ${action} à ${reactingUser.username}`);
    const replyMessage = await message.channel.send(`${reactingUser.toString()}, Le rôle **${mentionedRole.name}** vous a été ${action} avec succès.`);

    setTimeout(() => {
      replyMessage.delete().catch(console.error);
    }, 5000);
  } else {
    const action = isAdd ? 'ajouté' : 'retiré';
    console.log(`Le rôle ${mentionedRole.name} a été ${action}.`);
  }
}

// Fonction pour sauvegarder les données des réactions dans le fichier JSON
function saveReactionsData() {
  fs.writeFile(reactionsFile, JSON.stringify(reactionsData, null, 2), (err) => {
    if (err) {
      console.error('Erreur lors de la sauvegarde des données des réactions :', err);
    } else {
      console.log('Données des réactions sauvegardées avec succès.');
    }
  });
}




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
