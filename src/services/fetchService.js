/**
 * 
 * @param {string} url - base url + route to send the request
 * @param {object} payload - data to send
 * @returns {object} response from the server
 */
export default async function FetchService(url, payload) {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const { ok, status } = res;

        const content_length = res.headers.get("Content-Length");
        if (content_length == 0) {
            return { ok, status, responseType: null, responseData: null };
        }

        const content_type = res.headers.get("Content-Type");
        if (content_type && content_type.includes("application/json")) {
            const data = await res.json();
            return { ok, status, responseType: "json", responseData: data };
        } else {
            const data = await res.text();
            return { ok, status, responseType: "text", responseData: data };
        }
    } catch (error) {
        return { ok: false, status: 500, responseType: "text", responseData: error.message };
    }
}