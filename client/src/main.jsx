import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Klient i Cache są w Core (główny import)
import { ApolloClient, InMemoryCache } from '@apollo/client';
// Provider to komponent Reactowy -> importujemy z /react
import { ApolloProvider } from '@apollo/client/react';
// Logika: Jeśli jesteśmy na produkcji (Railway), użyj zmiennej środowiskowej.
// Jeśli testujesz u siebie lokalnie, użyj localhost.
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

const client = new ApolloClient({
    uri: apiUrl,
    cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>,
)