const shell = require("./shell");
const file = require("./file");
const toArr = require("./utils").toArr;
const log = require("./log");

let err, response;

const whoNeedsThisPackages = (name, config) => {
    return config.filter(p => p.dependencies.indexOf(name) >= 0);
};

const installForPath = (cmd, cwd) => {
    return shell.run(cmd, cwd);
};

const upgradePackageJson = async (cwd, name, version) => {
    const p = await file.getPackage(cwd);
    p.dependencies[name] = version;
    await file.writePackage(cwd, p);
};

const injectForPath = async (source, name, version, dest) => {
    [err, response] = await toArr(upgradePackageJson(dest, name, "*"));
    if (err) return log.error(`error updating package at ${dest}`);

    let p = `${dest}node_modules/${name}`;
    file.removeFolder(p);

    [err, response] = await toArr(file.copyFolder(`${source}/public`, p));
    if (err) return log.error(`error copying to ${p}`);
};

const getStoragePath = projectPath => {
    return projectPath.replace("/projects/", "/projects/_projects/");
};

const getProjectsPath = projectPath => {
    const parts = projectPath.replace(/\/$/gi, "").split("/");

    parts.pop();

    return parts.join("/");
};

module.exports = {
    whoNeedsThisPackages,
    installForPath,
    upgradePackageJson,
    injectForPath,
    getStoragePath,
    getProjectsPath
};
 