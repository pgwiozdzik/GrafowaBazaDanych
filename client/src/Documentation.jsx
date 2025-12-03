import React from 'react';
import { Link } from 'react-router-dom';

function Documentation() {
    return (
        <div style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '40px', lineHeight: '1.8', color: '#333', background: '#fff' }}>

            <div style={{ marginBottom: '30px' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#2980b9', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    ← Wróć do aplikacji
                </Link>
            </div>

            <header style={{ borderBottom: '2px solid #eee', paddingBottom: '30px', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '36px', color: '#2c3e50', marginBottom: '10px' }}>Dokumentacja Systemu Bibliotecznego</h1>
                <p style={{ color: '#7f8c8d', fontSize: '18px' }}>
                    Projekt typu <em>Proof of Concept</em> z wykorzystaniem grafowej bazy danych Neo4j, GraphQL oraz architektury Cloud-Native.
                </p>
            </header>

            {/* --- 1. ROZWIĄZANIE TECHNOLOGICZNE --- */}
            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ color: '#2c3e50', borderLeft: '5px solid #3498db', paddingLeft: '15px', marginTop: '0' }}>1. Opis Rozwiązania Technologicznego</h2>
                <p>Projekt realizuje nowoczesne podejście do tworzenia aplikacji internetowych, spełniając kryteria punktowe za zaawansowane technologie (10 pkt):</p>

                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    <li style={{ background: '#f8f9fa', padding: '15px', marginBottom: '10px', borderRadius: '8px', borderLeft: '4px solid #27ae60' }}>
                        <strong>Architektura SPA (Single Page Application):</strong> Klient napisany w bibliotece <strong>React</strong> (z użyciem Vite) działa jako dynamiczna strona, która nie wymaga przeładowywania przy nawigacji. Komunikacja z serwerem odbywa się w tle.
                    </li>
                    <li style={{ background: '#f8f9fa', padding: '15px', marginBottom: '10px', borderRadius: '8px', borderLeft: '4px solid #8e44ad' }}>
                        <strong>Interfejs GraphQL:</strong> Zamiast klasycznego REST API, zastosowano <strong>GraphQL</strong>. Pozwala to na precyzyjne pobieranie tylko potrzebnych danych w jednym zapytaniu (np. pobranie książki wraz z autorem, statusem wypożyczenia i rekomendacjami naraz), co eliminuje problem <em>over-fetching</em>.
                    </li>
                    <li style={{ background: '#f8f9fa', padding: '15px', marginBottom: '10px', borderRadius: '8px', borderLeft: '4px solid #e67e22' }}>
                        <strong>Wdrożenie w Chmurze (Cloud):</strong>
                        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                            <li><strong>Baza Danych:</strong> Neo4j AuraDB (DBaaS - Database as a Service).</li>
                            <li><strong>Aplikacja:</strong> Railway (Platform as a Service), zapewniające środowisko CI/CD dla Node.js oraz hostingu plików statycznych Reacta.</li>
                        </ul>
                    </li>
                </ul>
            </section>

            {/* --- 2. BAZA DANYCH --- */}
            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ color: '#2c3e50', borderLeft: '5px solid #3498db', paddingLeft: '15px' }}>2. Funkcjonalności Bazy Danych (Neo4j)</h2>
                <p>
                    Siłą projektu jest wykorzystanie natywnej bazy grafowej. W przeciwieństwie do baz relacyjnych (SQL), gdzie dane łączone są kosztownymi operacjami JOIN, tutaj relacje są "obywatelami pierwszej kategorii".
                </p>

                <h3 style={{ color: '#2980b9', marginTop: '30px' }}>2.1. Model Danych (Graf)</h3>
                <p>Baza składa się z następujących węzłów (Nodes) i krawędzi (Relationships):</p>

                <div style={{ background: '#2d3436', color: '#dfe6e9', padding: '20px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '14px', overflowX: 'auto' }}>
                    {`(:User {username})`} <br/>
                    {`(:Book {title, year, description})`} <br/>
                    {`(:Author {name})`} <br/>
                    {`(:Genre {name})`} <br/>
                    {`(:Review {rating, text})`} <br/>
                    <br/>
                    {`RELACJE:`} <br/>
                    {`(:User)-[:BORROWED]->(:Book)`} <span style={{color:'#74b9ff'}}>// Kluczowa relacja wypożyczenia</span> <br/>
                    {`(:Author)-[:WROTE]->(:Book)`} <br/>
                    {`(:Book)-[:BELONGS_TO]->(:Genre)`} <br/>
                    {`(:Review)-[:HAS_REVIEW]->(:Book)`}
                </div>

                <h3 style={{ color: '#2980b9', marginTop: '30px' }}>2.2. Logika Biznesowa w Grafie</h3>
                <p>Logika aplikacji została przeniesiona do warstwy bazy danych:</p>
                <ul style={{ paddingLeft: '20px' }}>
                    <li style={{ marginBottom: '15px' }}>
                        <strong>Dostępność Książki:</strong> System nie przechowuje flagi <code>isAvailable</code>. Dostępność jest determinowana dynamicznie poprzez sprawdzenie, czy istnieje krawędź wychodząca <code>:BORROWED</code> od jakiegokolwiek użytkownika do danej książki.
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                        <strong>Silnik Rekomendacji (Collaborative Filtering):</strong> System generuje rekomendacje w czasie rzeczywistym, wykonując zapytanie Cypher. Algorytm szuka użytkowników, którzy wypożyczyli "tę" książkę, a następnie sprawdza, co "jeszcze" wypożyczyli.
                        <div style={{ background: '#ecf0f1', padding: '10px', borderRadius: '4px', marginTop: '5px', fontSize: '13px', fontFamily: 'monospace', border: '1px solid #bdc3c7' }}>
                            MATCH (this)&lt;-[:BORROWED]-(u:User)-[:BORROWED]-&gt;(other:Book)<br/>
                            WHERE other &lt;&gt; this<br/>
                            RETURN other LIMIT 3
                        </div>
                    </li>
                </ul>
            </section>

            {/* --- 3. APLIKACJA --- */}
            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ color: '#2c3e50', borderLeft: '5px solid #3498db', paddingLeft: '15px' }}>3. Funkcjonalności Aplikacji (Frontend)</h2>

                <h3 style={{ color: '#2980b9' }}>3.1. Zarządzanie Księgozbiorem (CRUD)</h3>
                <p>
                    Aplikacja umożliwia <strong>dodawanie nowych książek</strong>. Dzięki zastosowaniu mutacji GraphQL <code>connectOrCreate</code>, system automatycznie sprawdza, czy dany Autor lub Gatunek już istnieje. Jeśli tak – tworzy tylko nową krawędź. Jeśli nie – tworzy nowy węzeł. Zapobiega to duplikacji danych.
                    Zalogowany użytkownik może również <strong>usuwać książki</strong>, co kaskadowo usuwa ich relacje.
                </p>

                <h3 style={{ color: '#2980b9' }}>3.2. Wypożyczenia i Zwroty</h3>
                <p>
                    Proces wypożyczenia to operacja grafowa: utworzenie krawędzi <code>:BORROWED</code> między węzłem zalogowanego użytkownika a węzłem książki. Zwrot to usunięcie tej krawędzi. Aplikacja w czasie rzeczywistym reaguje na zmiany, blokując możliwość wypożyczenia książki, która posiada aktywną relację wypożyczenia.
                </p>

                <h3 style={{ color: '#2980b9' }}>3.3. Zaawansowane Wyszukiwanie</h3>
                <p>
                    Wyszukiwarka obsługuje filtrowanie po wielu atrybutach jednocześnie. Wpisanie frazy przeszukuje (logika OR):
                </p>
                <ul style={{ paddingLeft: '20px' }}>
                    <li>Tytuły książek (operator <code>_CONTAINS</code>)</li>
                    <li>Nazwy autorów (przechodzenie po relacji <code>:WROTE</code>)</li>
                    <li>Nazwy gatunków (przechodzenie po relacji <code>:BELONGS_TO</code>)</li>
                    <li>Rok wydania (konwersja tekstu na liczbę)</li>
                </ul>
            </section>

            {/* --- 4. DIAGRAMY --- */}
            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ color: '#2c3e50', borderLeft: '5px solid #3498db', paddingLeft: '15px' }}>4. Schemat Wdrożenia</h2>
                <p>
                    Aplikacja działa w architekturze rozproszonej. Kod źródłowy przechowywany jest na GitHubie, który jest połączony z platformą Railway.
                </p>
                <div style={{ textAlign: 'center', margin: '40px 0', padding: '20px', background: '#fdfdfd', border: '1px dashed #ccc' }}>
                    <strong>[Diagram Wdrożenia]</strong><br/><br/>
                    [Przeglądarka Klienta] <br/>
                    ↕ (HTTPS / GraphQL) <br/>
                    [Serwer Node.js (Railway)] <br/>
                    ↕ (Bolt Protocol / Neo4j Driver) <br/>
                    [Neo4j AuraDB (Chmura)]
                </div>
            </section>

            <footer style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #eee', color: '#95a5a6', fontSize: '14px', textAlign: 'center' }}>
                &copy; 2025 Jan Kowalski - Projekt Zaliczeniowy
            </footer>
        </div>
    );
}

export default Documentation;