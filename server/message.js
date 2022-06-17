function formatMessage(username, text){
    return{
        username,
        text,
    }
}

function is_repeated_letter(letra='', palavra=""){
    return palavra.indexOf(letra) != -1
}

module.exports = {
    formatMessage,
    is_repeated_letter,
}