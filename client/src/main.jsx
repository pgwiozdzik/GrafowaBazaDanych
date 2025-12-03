import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Dodajemy BrowserRouter
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

const httpLink = new HttpLink({
    uri: apiUrl,
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            {/* OWIJAMY W ROUTER */}
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ApolloProvider>
    </React.StrictMode>,
)