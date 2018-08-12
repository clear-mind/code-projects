const Configstore = require('configstore');

let conf = new Configstore('domino');

const init = (name) => {
    conf = new Configstore(name);
}

const set = (key, value) => {
    conf.set(key, value);
}

const get = (key) => {
    return conf.get(key);
}

const remove = (key) => {
    conf.delete(key);
}

module.exports = {
    init,
    set,
    get,
    remove,
}