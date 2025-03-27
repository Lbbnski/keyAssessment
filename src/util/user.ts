import {gql} from '@apollo/client';

export const LOGIN_JWT = gql`
    mutation Auth($username: String!, $password: String!, $deviceKind: JwtDeviceKindKind!) {
        Auth{
            loginJwt(
                input: { email: $username, password: $password, deviceKind: $deviceKind }) {
                jwtTokens {
                    accessToken
                    refreshToken
                }
                clientMutationId
            }
        }
    }
`;

export const LOGOUT_JWT = gql`
    mutation Auth($clientMutationId: String!) {
        Auth {
            logoutJwt( input: {clientMutationId: $clientMutationId}) {
                clientMutationId
            }
        }
    }
`;


export const isLoggedIn = () => {
  return localStorage.getItem('token') !== null;
}

export const setLoggedIn = (token: string) => {
  localStorage.setItem('token', token);
}

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

export const checkAuth = () => {
  const location = window.location.href;
  if (location.includes('login') && isLoggedIn()) {
    window.location.href = '/';
  } else if (!location.includes('login') && !isLoggedIn()) {
    window.location.href = '/login';
  }
}