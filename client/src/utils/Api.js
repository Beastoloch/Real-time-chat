import {baseUrl} from "./constants";


class Api {
    constructor() {
        this._baseUrl = baseUrl;
    }

    _getResponseData(res) {
        if (!res.ok) {
            return res.text().then(text => {throw new Error(text)});
        }
        return res.json();
    }

    async getRooms(jwt, userId){
        const response = await fetch(`${this._baseUrl}/rooms/list/${userId}`,
            {
                method: 'GET',
                headers: {
                    authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                }
            });
        return this._getResponseData(response);
    }

    async getNames(jwt, userIds){
        const response = await fetch(`${this._baseUrl}/users/getUsers/users`,
            {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({users: userIds})
            });
        return this._getResponseData(response);
    }

    async getMessages(jwt){
        const response = await fetch(`${this._baseUrl}/messages/`,
            {
                method: 'GET',
                headers: {
                    authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                }
            });
        return this._getResponseData(response);
    }

    addUser(roomId, userId, jwt) {
        return fetch(`${this._baseUrl}/rooms/${roomId}/${userId}`, {
            method: 'PUT',
            headers: {
                authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                return this._getResponseData(res);
            });
    }

    kickUser(roomId, userId, jwt) {
        return fetch(`${this._baseUrl}/rooms/${roomId}/${userId}`, {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                return this._getResponseData(res);
            });
    }

    async getUserInfo(jwt){
        const response = await fetch(`${this._baseUrl}/users/me`,
            {
                method: 'GET',
                headers: {
                    authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                }
            });
        return this._getResponseData(response);
    }

    async createRoom(name, owner, jwt) {
        const response = await fetch(`${this._baseUrl}/rooms/create`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, owner})
        });
        return this._getResponseData(response);
    }

    async getCurrentRoom(id, jwt) {
        const response = await fetch(`${this._baseUrl}/rooms/${id}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            }
        });
        return this._getResponseData(response);
    }
}

const api = new Api();

export default api;

