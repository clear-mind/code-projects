const server = "http://localhost:8080";

export const fetchProjects = () => {
    return fetch(server + "/projects").then(response => response.json());
};

export const pushProject = project => {
    const options = {
        method: "POST",
        body: JSON.stringify(project),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    };
    return fetch(server + "/push", options).then(response => response.json());
};

export const pullProject = project => {
    const options = {
        method: "POST",
        body: JSON.stringify(project),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    };
    return fetch(server + "/pull", options).then(response => response.json());
};
