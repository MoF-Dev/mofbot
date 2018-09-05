module.exports = {
    name: 'roles',
    description: 'Displays roles target user has.',
    args: true,
    usage: '<user>',
    execute(message, args) {
        if(!message.mentions.users)return;
        user = message.mentions.members.first();
        roles = ""
        for(var i=0;i < user._roles.length;i++){
            myRole = message.guild.roles.get(user._roles[i]);
            roles += `${myRole}, `
        }
        roles = roles.substring(0, roles.length - 2);
        message.channel.send(`User ${user.user} has role(s): ${roles}`)
    }
}