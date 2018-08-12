const colors = require('colors');

let start = true;

const log = (message, oneLiner = false) => {
    if (!start  || oneLiner) {
        console.log((message + '').green);
    } else {
        process.stdout.write(message + ' ');
    }

    start = !start;

    if (oneLiner) {
        start = true;
    }
}

const error = (message) => {

    if (!start) {
        console.log('Failed'.red);
    }

    console.log((message + '').red);
    start = true;
}

/*
1 - Catchall for general errors
2 - Misuse of shell builtins (according to Bash documentation)
126 - Command invoked cannot execute
127 - “command not found”
128 - Invalid argument to exit
128+n - Fatal error signal “n”
130 - Script terminated by Control-C
255\* - Exit status out of range
*/

const errorAndExit = (message, code = 1) => {

    if (!start) {
        console.log('Failed'.red);
    }

    console.log((message + '').red);
    start = true;
    process.exit(code);
}


module.exports = {
    log: log,
    error: error,
}