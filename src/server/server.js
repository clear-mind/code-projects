const express = require("express");
const path = require("path");
const app = express();
const cors = require('cors');
const shell = require('shelljs');
const bodyParser = require('body-parser');
const public = path.join(__dirname, "../../build");
const store = require("../cli/utils/store");
const projects = require("../cli/utils/projects");

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/ping", function(req, res) {
    return res.send("pong");
});

app.get("/projects", function(req, res) {
    console.log("projects");
    const packages = store.get("packages");
    res.json(projects.checkProjectsLocation(packages));
});

app.post("/push", function(req, res) {
    console.log("push");
    const {name} = req.body;
    const code = shell.exec(`projects push ${name}`).code;
    if (code !== 0) {
        return res.status(500).send({ error: 'failed moving folder' })
    }
    const packages = store.get("packages");
    res.json(projects.checkProjectsLocation(packages));
});

app.post("/pull", function(req, res) {
    console.log("pull");
    const {name} = req.body;
    const code = shell.exec(`projects pull ${name}`).code;
    if (code !== 0) {
        return res.status(500).send({ error: 'failed moving folder' })
    }
    const packages = store.get("packages");
    res.json(projects.checkProjectsLocation(packages));
});

app.get("/", function(req, res) {
    res.sendFile(path.join(public, "index.html"));
}); 

app.get("/static/css/main.d487e92b.css", function(req, res) {
    res.sendFile(path.join(public, "static/css/main.d487e92b.css"));
}); 

app.get("/static/js/main.e353153c.js", function(req, res) {
    res.sendFile(path.join(public, "static/js/main.e353153c.js"));
}); 

app.use('static', express.static('../../build/static'))

const listen = () => {
    const port = process.env.PORT || 8080;
    app.listen(port, () => console.log(`Server listening on port ${port}!`));
}

// listen();

module.exports = {
    listen: listen
}

