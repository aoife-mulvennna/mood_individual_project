import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function useToken() {
    const getToken = () => {
        return sessionStorage.getItem('token');
    };

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        sessionStorage.setItem('token', userToken);
        setToken(userToken);
    };

    const getUserInfo = () => {
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            return decoded;
        } catch (e) {
            console.error("Invalid token", e);
            return null;
        }
    };

    return {
        setToken: saveToken,
        token,
        getUserInfo,
    };
}

