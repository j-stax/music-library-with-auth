const apiEndpoint = "http://localhost:8000/api";

async function addUser(user) {
    const response = await fetch(`${apiEndpoint}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })

    if (response.ok) {
        return response.status;
    }
    else {
        return response.json();
    }
}

async function loginUser(user) {
    const response = await fetch(`${apiEndpoint}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })

    if (response.ok) {
        const tokenResponse = await response.json();
        // Store JWT in local storage
        window.localStorage.setItem("token", tokenResponse.token);
        
        return response.status;
    }
    else {
        return response.json();
    }
}

async function getSongs() {
    // Get JWT from local storage
    const token = window.localStorage.getItem("token");

    const response = await fetch(`${apiEndpoint}/songs`, {
        headers: { "X-Auth": token }
    });

    window.localStorage.setItem("token", token);

    return response.json();
}

async function getSongsByFilter(filter, filterVal) {
    // Get JWT from local storage
    const token = window.localStorage.getItem("token");

    let response;
    
    if (filter === "artist") {
        response = await fetch(`${apiEndpoint}/songs?artist=${filterVal}`, {
            headers: { "X-Auth": token }
        });
    }
    else {
        response = await fetch(`${apiEndpoint}/songs?genre=${filterVal}`, {
            headers: { "X-Auth": token }
        });
    }

    window.localStorage.setItem("token", token);

    return response.json();
}

async function getSong(songId) {
    const token = window.localStorage.getItem("token");

    const response = await fetch(`${apiEndpoint}/songs/${songId}`, {
        headers: { "X-Auth": token }
    });

    window.localStorage.setItem("token", token);

    return response;
}

async function addSong(song) {
    const token = window.localStorage.getItem("token");

    const response = await fetch(`${apiEndpoint}/songs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Auth": token
        },
        body: JSON.stringify(song),
    })
    
    window.localStorage.setItem("token", token);

    if (response.ok) {
        return response.status;
    }
    else {
        return response.json();
    }
}

async function editSong(songId, songDetails) {
    const token = window.localStorage.getItem("token");

    const response = await fetch(`${apiEndpoint}/songs/${songId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Auth": token
        },
        body: JSON.stringify(songDetails),
    })

    window.localStorage.setItem("token", token);

    if (response.ok) {
        return response.body;
    }
    else {
        console.log(response);
        return response.json();
    }
}

async function deleteSong(songId) {
    const token = window.localStorage.getItem("token");

    const response = await fetch(`${apiEndpoint}/songs/${songId}`, {
        method: "DELETE",
        headers: { "X-Auth": token }
    })

    window.localStorage.setItem("token", token);

    if (response.ok) {
        return response.body;
    }
    else {
        console.log(response);
        return response.json();
    }
}

function logout() {
    window.localStorage.clear();
}

export {
    addUser,
    loginUser,
    getSongs,
    getSongsByFilter,
    getSong,
    addSong,
    editSong,
    deleteSong,
    logout
}