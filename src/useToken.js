// import { useState } from 'react';

// export default function useToken() {
//     const getToken = () => {
//         const tokenString = sessionStorage.getItem('token');
//         const userToken = JSON.parse(tokenString);
//         return userToken?.token
//       };
//       const [token, setToken] = useState(getToken());

//       const saveToken = userToken => {
//         sessionStorage.setItem('token', JSON.stringify(userToken));
//         setToken(userToken.token);
//       };
    
//       return {
//         setToken: saveToken,
//         token
//       }
// }

import React, { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        return userToken?.token;
    };

    // Adjust this logic for testing purposes
    const [token, setToken] = useState(getToken() || 'mockToken'); // Provide a mock token or null

    const saveToken = userToken => {
        sessionStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.token);
    };

    return {
        setToken: saveToken,
        token
    };
}
