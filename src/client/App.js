import React, { Component } from "react";
import "./App.css";
import classNames from "classnames";
import * as api from "./api/api";

class App extends Component {
    state = {
        projects: []
    };

    componentDidMount() {
        api.fetchProjects().then(projects => this.setState({ projects }));
    }

    click = project => {
        if (project.inProjects) {
            api.pushProject(project).then(projects =>
                this.setState({ projects })
            );
        } else {
            api.pullProject(project).then(projects =>
                this.setState({ projects })
            );
        }
    };

    renderProject(project) {
        const { inProjects } = project;

        return (
            <div
                key={project.id}
                className={classNames(["project", { green: inProjects }])}
                onClick={() => this.click(project)}
            >
                <div className="title">{project.name}</div>
                <div className="version">{project.version}</div>
            </div>
        );
    }

    render() {
        const { projects } = this.state;

        return (
            <div className="App">
                <div className="projects">
                    {projects.map(project => this.renderProject(project))}
                </div>
            </div>
        );
    }
}

export default App;
