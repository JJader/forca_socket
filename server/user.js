let users = [];

function userJoin(id, userName, room) {
    const user = { id, userName, room };
    users.push(user);
    return user;
}

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

function removeCurrentUser(id) {
    const index = users.findIndex(u => u.id === id);
    
    if (index >= 0) {
        return users.splice(index, 1)[0];
    }

}


module.exports = {
    userJoin,
    getCurrentUser,
    removeCurrentUser
}