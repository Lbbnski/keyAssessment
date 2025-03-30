import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import BASE_PATH from './util/connector.ts';
import {isLoggedIn} from './util/user.ts';
import {BrowserRouter} from 'react-router-dom';

let headers;

if (isLoggedIn()) {
  headers = {authorization: JSON.parse(localStorage.getItem('token')||'').jwtTokens.accessToken}
}

const client = new ApolloClient({
  uri: BASE_PATH,
  cache: new InMemoryCache(),
  headers: headers
})

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <ApolloProvider client={client}>
        <App/>
      </ApolloProvider>
    </StrictMode>
  </BrowserRouter>)
