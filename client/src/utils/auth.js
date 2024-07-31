import {baseUrl} from "./constants";

function getResponseData(res) {
    if (!res.ok) {
        return res.text().then(text => {throw new Error(text)})
    }
    return res.json();
}

export async function registerUser(userInfo) {
    const response = await fetch(`${baseUrl}/signup`,
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userInfo)
    });
    return getResponseData(response);
}

export async function loginUser(userInfo) {
    const response = await fetch(`${baseUrl}/signin`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userInfo)
    });
    console.log(response);
    return getResponseData(response);
}



export function refreshToken(access, refresh) {
    return fetch(`${baseUrl}/Auth/refreshToken`,{
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${access}`
        },
        body: JSON.stringify({
            accessToken: access,
            refreshToken: refresh
        })
    })
        .then((res) => {
            return getResponseData(res);
        });
}