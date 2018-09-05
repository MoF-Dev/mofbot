module.exports = {
    name: 'ping',
    description: 'Pings bot to check if it\'s online',
    usage:'',
    cooldown: 5,
    execute(message, args) {
        message.channel.send('Pong.');
    },
};