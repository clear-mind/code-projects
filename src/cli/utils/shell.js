const {spawn} = require('child_process');

const run = (command, cwd) => {

    return new Promise((resolve, reject) => {
        let output = '', error = '';

        const args = command.split(' ').filter(arg => arg),
            verb = args.shift();

        const child = spawn(verb, args, {cwd});

        child.on('exit', function (code) {
            if (code === 1) {
                reject(error);
            } else {
                resolve(output);
            }
        });

        child.stdout.on('data', (data) => {
            output += `\n${data}`;
            process.stdout.write(data.toString());
        });

        child.stderr.on('data', (data) => {
            error += `\n${data}`;
            process.stdout.write(data.toString());
        });
    });
}


module.exports = {
    run,
}