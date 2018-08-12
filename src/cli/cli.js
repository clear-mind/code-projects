const path = require("path");
const opn = require("opn");
const toArr = require("./utils/utils").toArr;
const toSize = require("./utils/utils").toSize;
const log = require("./utils/log");
const file = require("./utils/file");
const store = require("./utils/store");
const projects = require("./utils/projects");
const server = require("../server/server");

let err, packages, response;

const scan = async dir => {
    let packages;

    log.log(`Scanning projects path... `);
    [err, packages] = await toArr(file.devPackages(dir));
    if (err) return log.errorAndExit(`error reading packages in ${dir}`);
    log.log(`✓`);

    log.log(`Saving configuration... `);
    store.set("packages", packages);
    log.log(`✓`);

    log.log(packages.length + " packages scanned", true);
};

const pull = async (dir, projectName) => {
    let package, storagePath, inStorage, inOrigin;

    log.log(`Reading packages... `);
    packages = store.get("packages");
    log.log(`✓`);

    log.log(`Finding "${projectName}"... `);
    packages = packages.filter(package => package.name === projectName);
    if (packages.length === 0)
        return log.errorAndExit(`error finding package ${projectName}`);
    log.log(`✓`);

    log.log(`Locating project... `);
    package = packages[0];
    inOrigin = file.folderExists(package.path);
    if (inOrigin) return log.errorAndExit(`package already in projects`);
    log.log(`✓`);

    log.log(`Locating storage... `);
    storagePath = projects.getStoragePath(package.path);
    inStorage = file.folderExists(storagePath);
    if (!inStorage) return log.errorAndExit(`couldn't find project in ${storagePath}`);
    log.log(`✓`);

    log.log(`Moving project... `);
    [err, packages] = await toArr(file.moveFolder(storagePath, package.path));
    if (err) return log.errorAndExit(`error moving project`);
    log.log(`✓`);
};

const push = async (dir, projectName) => {
    let package, storagePath, inStorage, inOrigin;

    log.log(`Reading packages... `);
    packages = store.get("packages");
    log.log(`✓`);

    log.log(`Finding "${projectName}"... `);
    packages = packages.filter(package => package.name === projectName);
    if (packages.length === 0)
        return log.errorAndExit(`error finding package ${projectName}`);
    log.log(`✓`);

    log.log(`Locating storage... `);
    package = packages[0];
    storagePath = projects.getStoragePath(package.path);
    inStorage = file.folderExists(storagePath);
    if (inStorage) return log.errorAndExit(`package already in storage`);
    log.log(`✓`);

    log.log(`Locating project... `);
    inOrigin = file.folderExists(package.path);
    if (!inOrigin) return log.errorAndExit(`couldn't find project in ${package.path}`);
    log.log(`✓`);

    log.log(`Moving project... `);
    [err, packages] = await toArr(file.moveFolder(package.path, storagePath));
    if (err) return log.errorAndExit(`error moving project`);
    log.log(`✓`);
};

const list = async () => {
    log.log(`Reading packages... `);
    packages = store.get("packages");
    log.log(`✓`);

    packages.forEach((package, index) => {
        log.log(
            index + 1 + ". \t " + toSize(package.name, 30) + " " + package.path,
            true
        );
    });
};

const open = async () => {

    log.log(`Opening chrome... `);
    opn('http://localhost:8080');
    log.log(`✓`);

    server.listen();
};

module.exports = {
    scan,
    pull,
    push,
    list,
    open,
};
