module.exports = {
    name: 'prune',
    description: 'Prunes messages.',
    args: true,
    usage: '<number of messages to delete>',
    execute(message, args) {
       const amount = parseInt(args[0]) +1;
       if(!message.author.id === '88868020700594176'){
            return
       }
       if (isNaN(amount)) {
           return message.reply('that doesn\'t seem to be a valid number.' );
       } else if (amount <= 1 || amount > 100) {
           return message.reply('you need to input a number between 1 and 99');
       }
       message.channel.bulkDelete(amount, true).catch(err => {
           console.log(err);
           message.channel.send('There was an error pruning messages from this channel.');
       });
    },
};