import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Importujemy główne elementy z Core
import { ApolloClient, InMemoryCache } from '@apollo/client';
// Importujemy Provider z Reacta
import { ApolloProvider } from '@apollo/client/react';
// Importujemy Link HTTP z odpowiedniego podkatalogu (zgodnie z package.json)
import { HttpLink } from '@apollo/client/link/http';

// Pobieramy adres API (z Railway lub localhost)
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

// Tworzymy Link ręcznie
const httpLink = new HttpLink({
    uri: apiUrl,
});

const client = new ApolloClient({
    // Zamiast "uri: apiUrl", dajemy "link: httpLink"
    link: httpLink,
    cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>,
)