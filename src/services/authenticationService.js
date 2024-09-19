/**
 * 
 * @param {string} url - base url + route to send the request
 * @param {object} payload - data to send
 * @returns {object} response from the server
 */
export default async function AuthenticationService(url, payload) {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const { status } = res;

        if (status == 200) {
            if (Number(res.headers.get("Content-Length")) == 0) {
                // if the response is empty
                // successful signup does not return any data
                return { status: 200 };
            }
            const data = await res.json();
            return { status, data };
        }

        if (!res.ok) {
            if ('type' in res && 'message' in res) {
                const { type, message } = await res.json();
                return { status, type, message };
            }
            return { status, type: res.type, message: res.message || res.statusText };
        }
    } catch (err) {
        return { status: 500, type: "server", message: err.message };
    }
}


/**
 * 
 * @param {string} token - jwt token
 * @description store jwt token in browser storage 
 */
function saveToken(token) {
    sessionStorage.setItem("CurrentUser", token);
}

function savePassResetToken(token) {
    sessionStorage.setItem("PassResetToken", token);
}

function getToken() {
    return sessionStorage.getItem("CurrentUser");
}

function getPassResetToken() {
    return sessionStorage.getItem("PassResetToken");
}

function removeToken() {
    sessionStorage.removeItem("CurrentUser");
}

function removePassResetToken() {
    sessionStorage.removeItem("PassResetToken");
}

export { saveToken, savePassResetToken, getToken, getPassResetToken, removeToken, removePassResetToken }