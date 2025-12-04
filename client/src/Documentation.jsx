import React from 'react';
import { Link } from 'react-router-dom';

// --- IMPORTY OBRAZKÓW ---
import imgWdrozenie from './assets/wdrozenie.png';
import imgModel from './assets/model.png';
import imgPrzypadki from './assets/przypadki.png';

function Documentation() {
    // Styl dla bloków kodu
    const codeBlockStyle = {
        background: '#2d3436',
        color: '#dfe6e9',
        padding: '15px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '13px',
        overflowX: 'auto',
        lineHeight: '1.4',
        whiteSpace: 'pre'
    };

    return (
        <div style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', maxWidth: '1000px', margin: '0 auto', padding: '40px', lineHeight: '1.8', color: '#333', background: '#fff' }}>

            {/* --- NAWIGACJA --- */}
            <div style={{ marginBottom: '30px' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#2980b9', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    ← Wróć do aplikacji
                </Link>
            </div>

            <header style={{ borderBottom: '2px solid #eee', paddingBottom: '30px', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '36px', color: '#2c3e50', marginBottom: '10px' }}>Dokumentacja Projektu</h1>
                <p style={{ color: '#7f8c8d', fontSize: '18px' }}>
                    System biblioteczny oparty o grafową bazę danych Neo4j & Knowledge Graph
                </p>
            </header>

            {/* ========================================================================================== */}
            {/* CZĘŚĆ 1: DIAGRAMY WIZUALNE */}
            {/* ========================================================================================== */}

            <section style={{ marginBottom: '80px' }}>
                <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px', marginBottom: '30px' }}>
                    Część I: Schematy Wizualne
                </h2>

                <div style={{ display: 'grid', gap: '60px' }}>
                    {/* Diagram 1 */}
                    <div>
                        <h3 style={{ color: '#2980b9' }}>1. Architektura Wdrożenia</h3>
                        <div style={{ textAlign: 'center', padding: '10px', border: '1px solid #eee', borderRadius: '8px', background: '#fcfcfc' }}>
                            <img src={imgWdrozenie} alt="Diagram Wdrożenia" style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
                        </div>
                        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                            Schemat przedstawia przepływ danych w architekturze chmurowej: od klienta (przeglądarka), przez serwer aplikacji na Railway, aż do bazy danych Neo4j AuraDB.
                        </p>
                    </div>

                    {/* Diagram 2 */}
                    <div>
                        <h3 style={{ color: '#2980b9' }}>2. Model Danych (Graf)</h3>
                        <div style={{ textAlign: 'center', padding: '10px', border: '1px solid #eee', borderRadius: '8px', background: '#fcfcfc' }}>
                            <img src={imgModel} alt="Diagram Modelu" style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
                        </div>
                        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                            Wizualizacja węzłów (User, Book, Author, Genre, Review) oraz relacji między nimi. Centralnym punktem grafu jest węzeł Książki.
                        </p>
                    </div>

                    {/* Diagram 3 */}
                    <div>
                        <h3 style={{ color: '#2980b9' }}>3. Przypadki Użycia</h3>
                        <div style={{ textAlign: 'center', padding: '10px', border: '1px solid #eee', borderRadius: '8px', background: '#fcfcfc' }}>
                            <img src={imgPrzypadki} alt="Diagram Przypadków" style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
                        </div>
                        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                            Podział funkcjonalności na rolę Gościa (odczyt, wyszukiwanie) oraz Zalogowanego Użytkownika (edycja, wypożyczanie).
                        </p>
                    </div>
                </div>
            </section>


            {/* ========================================================================================== */}
            {/* CZĘŚĆ 2: SZCZEGÓŁOWA DOKUMENTACJA TECHNICZNA */}
            {/* ========================================================================================== */}

            <section>
                <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px', marginBottom: '30px' }}>
                    Część II: Szczegółowa Specyfikacja Techniczna
                </h2>

                {/* 1. PRZEGLĄD */}
                <article style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: '#2c3e50', borderLeft: '5px solid #27ae60', paddingLeft: '15px' }}>1. Przegląd Projektu</h3>
                    <p><strong>Nazwa:</strong> Knowledge Graph - System Zarządzania Siecią Wiedzy</p>
                    <p>
                        Projekt to aplikacja webowa typu SPA (Single Page Application), która demonstruje przewagę grafowych baz danych nad relacyjnymi w kontekście zarządzania złożonymi powiązaniami.
                        System umożliwia dynamiczne tworzenie węzłów, zarządzanie relacjami wypożyczeń oraz generowanie rekomendacji w czasie rzeczywistym.
                    </p>
                    <h4>Główne funkcjonalności:</h4>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                        <li><strong>Zarządzanie Węzłami (CRUD):</strong> Dodawanie i usuwanie książek, które automatycznie tworzy lub aktualizuje powiązane węzły autorów i gatunków.</li>
                        <li><strong>Relacje Wypożyczeń:</strong> Proces wypożyczenia to nie zmiana atrybutu, ale utworzenie fizycznej krawędzi w grafie.</li>
                        <li><strong>Silnik Rekomendacji:</strong> Algorytm <em>Collaborative Filtering</em> zaimplementowany w języku Cypher.</li>
                        <li><strong>Wyszukiwanie Hybrydowe:</strong> Jednoczesne przeszukiwanie wielu typów węzłów.</li>
                    </ul>
                </article>

                {/* 2. ARCHITEKTURA */}
                <article style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: '#2c3e50', borderLeft: '5px solid #27ae60', paddingLeft: '15px' }}>2. Architektura Systemu</h3>
                    <p>
                        System został zaprojektowany w architekturze mikrousługowej, wykorzystując rozwiązania Cloud-Native.
                        Frontend komunikuje się z backendem wyłącznie poprzez zapytania GraphQL, co eliminuje problem nadmiarowości danych (over-fetching).
                    </p>
                    <ul>
                        <li><strong>Warstwa Prezentacji:</strong> React (Vite) - Odpowiada za interfejs użytkownika i wizualizację danych.</li>
                        <li><strong>Warstwa API:</strong> Apollo Server - Tłumaczy zapytania GraphQL na język zapytań grafowych Cypher.</li>
                        <li><strong>Warstwa Danych:</strong> Neo4j AuraDB - Bezserwerowa baza danych przechowująca strukturę grafu.</li>
                    </ul>
                </article>

                {/* 3. MODEL DANYCH */}
                <article style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: '#2c3e50', borderLeft: '5px solid #27ae60', paddingLeft: '15px' }}>3. Model Danych i Schema</h3>

                    <p>
                        Poniżej przedstawiono definicję typów GraphQL, która jest bezpośrednio mapowana na węzły i relacje w bazie Neo4j.
                        Użycie dyrektyw takich jak <code>@relationship</code> pozwala na automatyczne generowanie resolverów bazy danych.
                    </p>

                    <h4>Definicja Typów GraphQL (schema.js):</h4>
                    <div style={codeBlockStyle}>
                        {`type User @node {
  username: String!
  borrowedBooks: [Book!]! @relationship(type: "BORROWED", direction: OUT)
}

type Book @node {
  title: String!
  year: Int
  description: String
  
  # Relacje wychodzące i przychodzące
  author: [Author!]! @relationship(type: "WROTE", direction: IN)
  genres: [Genre!]! @relationship(type: "BELONGS_TO", direction: OUT)
  reviews: [Review!]! @relationship(type: "HAS_REVIEW", direction: IN)
  currentBorrower: [User!]! @relationship(type: "BORROWED", direction: IN)

  # Pola obliczane dynamicznie (Cypher)
  recommended: [Book!]! @cypher(
    statement: "MATCH (this)<-[:BORROWED]-(u:User)-[:BORROWED]->(other:Book) WHERE other <> this RETURN other LIMIT 3",
    columnName: "other"
  )
}

type Author @node {
  name: String!
  books: [Book!]! @relationship(type: "WROTE", direction: OUT)
}`}
                    </div>
                </article>

                {/* 4. INTERFEJS */}
                <article style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: '#2c3e50', borderLeft: '5px solid #27ae60', paddingLeft: '15px' }}>4. Interfejs i API</h3>

                    <p>
                        Aplikacja wykorzystuje klienta <strong>Apollo Client</strong> do zarządzania stanem i cache'owaniem zapytań.
                        Dzięki temu interfejs jest responsywny i ogranicza liczbę zapytań sieciowych.
                    </p>

                    <h4>Kluczowe operacje API:</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '14px' }}>
                        <thead>
                        <tr style={{ background: '#ecf0f1' }}>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Operacja</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Typ</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Opis</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr><td style={{padding:'8px', border:'1px solid #ddd'}}>GET_BOOKS_ADVANCED</td><td style={{padding:'8px', border:'1px solid #ddd'}}>Query</td><td style={{padding:'8px', border:'1px solid #ddd'}}>Pobiera książki z filtrowaniem OR (tytuł, autor, rok).</td></tr>
                        <tr><td style={{padding:'8px', border:'1px solid #ddd'}}>CREATE_BOOK</td><td style={{padding:'8px', border:'1px solid #ddd'}}>Mutation</td><td style={{padding:'8px', border:'1px solid #ddd'}}>Tworzy książkę oraz (jeśli nie istnieją) autora i gatunek (operacja atomowa).</td></tr>
                        <tr><td style={{padding:'8px', border:'1px solid #ddd'}}>BORROW_BOOK</td><td style={{padding:'8px', border:'1px solid #ddd'}}>Mutation</td><td style={{padding:'8px', border:'1px solid #ddd'}}>Tworzy relację <code>:BORROWED</code> między użytkownikiem a książką.</td></tr>
                        </tbody>
                    </table>
                </article>

                {/* 5. WYRÓŻNIAJĄCE ROZWIĄZANIA */}
                <article style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: '#2c3e50', borderLeft: '5px solid #27ae60', paddingLeft: '15px' }}>5. Wyróżniające rozwiązania technologiczne</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#8e44ad' }}>✨ 1. GraphQL & Apollo</h4>
                            <p style={{ fontSize: '14px' }}>Zastosowanie silnie typowanego języka zapytań pozwala na precyzyjne definiowanie kontraktu między klientem a serwerem oraz automatyczną generację dokumentacji.</p>
                        </div>
                        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#2980b9' }}>✨ 2. React SPA</h4>
                            <p style={{ fontSize: '14px' }}>Brak przeładowań strony. Stan aplikacji (np. zalogowany użytkownik, wyniki wyszukiwania) jest przechowywany lokalnie w pamięci przeglądarki.</p>
                        </div>
                        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#27ae60' }}>✨ 3. Neo4j AuraDB (Cloud)</h4>
                            <p style={{ fontSize: '14px' }}>Baza danych działająca w modelu DBaaS. Zapewnia wysoką dostępność, automatyczne kopie zapasowe i szyfrowaną transmisję danych (Bolt+s).</p>
                        </div>
                        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#e67e22' }}>✨ 4. Logika w Grafie</h4>
                            <p style={{ fontSize: '14px' }}>Przeniesienie logiki biznesowej (rekomendacje, dostępność) bezpośrednio do zapytań bazodanowych, co odciąża serwer aplikacji.</p>
                        </div>
                    </div>
                </article>

                {/* 6. STRUKTURA KATALOGÓW */}
                <article style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: '#2c3e50', borderLeft: '5px solid #27ae60', paddingLeft: '15px' }}>6. Struktura Katalogów Projektu</h3>
                    <div style={codeBlockStyle}>
                        {`projekt/
├── backend/
│   ├── index.js                  # Główny plik serwera Apollo
│   ├── .env                      # Konfiguracja połączenia z Neo4j AuraDB
│   └── package.json              # Zależności backendu (@neo4j/graphql)
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx              # Punkt wejściowy aplikacji React
│   │   ├── App.jsx               # Główna logika widoków i routingu
│   │   ├── Documentation.jsx     # Komponent dokumentacji (ten plik)
│   │   └── assets/               # Zasoby statyczne (diagramy UML)
│   ├── vite.config.js            # Konfiguracja buildera Vite
│   └── package.json              # Zależności frontendu (@apollo/client)
`}
                    </div>
                </article>

                <footer style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #eee', color: '#95a5a6', fontSize: '14px', textAlign: 'center' }}>
                    &copy; 2025 Piotr Gwioździk
                </footer>

            </section>
        </div>
    );
}

export default Documentation;