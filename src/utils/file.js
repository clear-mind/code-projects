const glob = require("glob");
const fs = require("fs");
const ncp = require("ncp").ncp;
const rimraf = require("rimraf");
const mv = require("mv");

const fileRead = path => {
    return fs.readFileSync(path).toString();
};

const jsonRead = path => {
    return JSON.parse(fileRead(path));
};

const removeFolder = path => {
    console.log("path ->", path);
    return rimraf.sync(path);
};

const makeDir = path => {
    return fs.mkdirSync(path);
};

const fileJsonWrite = (path, json) => {
    return fs.writeFileSync(path, JSON.stringify(json || {}, null, 2));
};

const copyFolder = (source, destination) => {
    return new Promise((resolve, reject) => {
        console.log("source ->", source);
        console.log("destination ->", destination);

        ncp(source, destination, function(err) {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
};

const moveFolder = (source, destination) => {
    return new Promise((resolve, reject) => {
        return mv(source, destination, {},  () => {
            resolve(true);
        });
    });
};

const allPackages = cwd => {
    return new Promise((resolve, reject) => {
        glob("*/package.json", { cwd }, function(er, files) {
            if (er) return reject(er);
            resolve(
                files
                    .map(file => {
                        const packagePath = `${cwd}/${file}`.replace(
                                "package.json",
                                ""
                            ),
                            packageJson = jsonRead(`${cwd}/${file}`);

                        return {
                            name: packageJson.name,
                            path: packagePath,
                            version: packageJson.version,
                            dependencies: Object.keys(
                                packageJson.dependencies || {}
                            )
                        };
                    })
                    .filter(p => p.name)
            );
        });
    });
};

const devPackages = async cwd => {
    const packages = await allPackages(cwd),
        packagesNames = packages.map(p => p.name);

    return packages.map(p => {
        p.dependencies = p.dependencies.filter(
            d => packagesNames.indexOf(d) >= 0
        );
        return p;
    });
};

const getPackage = async cwd => {
    return jsonRead(`${cwd}/package.json`);
};
const writePackage = async (cwd, content) => {
    return fileJsonWrite(`${cwd}/package.json`, content);
};
const folderExists = folder => {
    return fs.existsSync(folder);
};

module.exports = {
    allPackages,
    devPackages,
    getPackage,
    writePackage,
    removeFolder,
    makeDir,
    copyFolder,
    fileJsonWrite,
    folderExists,
    moveFolder
};
