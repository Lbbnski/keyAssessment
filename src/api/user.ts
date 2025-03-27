import {gql} from '@apollo/client';

export const LOGIN_JWT = gql`
    mutation LoginJWT($username: String!, $password: String!, $deviceKind: JwtDeviceKindKind!) {
        loginJWT(input: { username: $username, password: $password, deviceKind: $deviceKind }) {
            token
            user {
                id
                name
                email
            }
        }
    }
`;


export const isLoggedIn = () => {
  return localStorage.getItem('token') !== null;
}