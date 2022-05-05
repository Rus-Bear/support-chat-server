const Chat = require("../../models/Chat");
const usersOnline = []

function joinUser(id, userInfo) {
    const currentUser = { id , userInfo };

    if (usersOnline.findIndex(e => e.userInfo.email === userInfo.email) === -1) {
        usersOnline.push(currentUser);
    }

    return {currentUser};
}

function getCurrentUser(id) {
    return usersOnline.find((currentUser) => currentUser.id === id);
}

const addModerMessageToDB = async (joinedModerRoom, text) => {
    await Chat.updateOne({'userInfo.email': joinedModerRoom}, {$push: { messages: {username: 'Поддержка', text} }})
}

const addClientMessageToDB = async (userInfo, text) => {
    const dbChat = await Chat.findOne({'userInfo.email': userInfo.email})

    if (!dbChat) {
        return await Chat.create({
            userInfo,
            messages: [{
                username: (userInfo.firstname + ' ' + userInfo.lastname), text
            }]
        })
    } else {
        await Chat.updateOne({'userInfo.email': userInfo.email}, {$push: { messages: {username: (userInfo.firstname + ' ' + userInfo.lastname), text} }})
    }
}

function disconnectClient(id) {
    const index = usersOnline.findIndex((currentUser) => currentUser.id === id);

    if (index !== -1) {
        const currentUser = usersOnline.splice(index, 1)[0];
        return currentUser
    }
}

module.exports = {joinUser, getCurrentUser, disconnectClient, addModerMessageToDB, addClientMessageToDB}