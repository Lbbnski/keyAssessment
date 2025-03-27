import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import BASE_PATH from './api/connector.ts';

const client = new ApolloClient({
  uri: BASE_PATH,
  cache: new InMemoryCache()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App/>
    </ApolloProvider>
  </StrictMode>,
)
