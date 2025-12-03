import React from 'react';
import { Link } from 'react-router-dom';

function Documentation() {
    return (
        <div style={{ fontFamily: '"Segoe UI", sans-serif', maxWidth: '800px', margin: '0 auto', padding: '40px', lineHeight: '1.6', color: '#333' }}>

            <div style={{ marginBottom: '30px' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#2980b9', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    ← Wróć do aplikacji
                </Link>
            </div>

            <header style={{ borderBottom: '2px solid #eee', paddingBottom: '20px', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '36px', color: '#2c3e50', marginBottom: '10px' }}>Dokumentacja Projektu</h1>
                <p style={{ color: '#7f8c8d', fontSize: '18px' }}>System biblioteczny oparty o grafową bazę danych Neo4j</p>
            </header>

            <section style={{ marginBottom: '40px' }}>
                <h2 style={{ color: '#2c3e50', borderLeft: '4px solid #3498db', paddingLeft: '15px' }}>1. Cel Projektu</h2>
                <p>
                    Celem projektu było stworzenie aplikacji typu <em>Proof of Concept</em> (PoC) demonstrującej przewagę
                    grafowych baz danych nad relacyjnymi w kontekście systemów rekomendacji i złożonych relacji między danymi.
                </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h2 style={{ color: '#2c3e50', borderLeft: '4px solid #3498db', paddingLeft: '15px' }}>2. Architektura (GRAND Stack)</h2>
                <ul style={{ listStyleType: 'circle', paddingLeft: '20px' }}>
                    <li style={{ marginBottom: '10px' }}><strong>G</strong>raphQL - Język zapytań API.</li>
                    <li style={{ marginBottom: '10px' }}><strong>R</strong>eact - Frontend (Vite).</li>
                    <li style={{ marginBottom: '10px' }}><strong>A</strong>pollo - Klient i Serwer GraphQL.</li>
                    <li style={{ marginBottom: '10px' }}><strong>N</strong>eo4j Database - Grafowa baza danych (AuraDB).</li>
                    <li style={{ marginBottom: '10px' }}><strong>D</strong>atabase - Przechowywanie danych w chmurze.</li>
                </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h2 style={{ color: '#2c3e50', borderLeft: '4px solid #3498db', paddingLeft: '15px' }}>3. Model Danych (Węzły i Krawędzie)</h2>
                <p>W bazie danych nie występują tabele. Dane są reprezentowane jako graf:</p>
                {/* ZMIANA: Użycie bezpiecznych stringów dla strzałek */}
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e1e4e8', fontFamily: 'monospace' }}>
                    {"(:User)-[:BORROWED]->(:Book)"}<br/>
                    {"(:Author)-[:WROTE]->(:Book)"}<br/>
                    {"(:Book)-[:BELONGS_TO]->(:Genre)"}<br/>
                    {"(:Review)-[:HAS_REVIEW]->(:Book)"}
                </div>
                <p style={{ marginTop: '15px' }}>
                    Kluczową cechą jest relacja <strong>BORROWED</strong>. Dostępność książki nie jest atrybutem węzła (kolumną),
                    lecz wynika dynamicznie z istnienia (lub braku) krawędzi łączącej użytkownika z książką.
                </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h2 style={{ color: '#2c3e50', borderLeft: '4px solid #3498db', paddingLeft: '15px' }}>4. Funkcjonalności</h2>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    <li style={{ marginBottom: '10px' }}><strong>CRUD Książek:</strong> Dodawanie i usuwanie węzłów w grafie.</li>
                    <li style={{ marginBottom: '10px' }}><strong>Wypożyczenia:</strong> Tworzenie i usuwanie krawędzi <code>:BORROWED</code>.</li>
                    <li style={{ marginBottom: '10px' }}><strong>Silnik Rekomendacji:</strong> Wykorzystanie algorytmu grafowego ("Kto czytał to, czytał też...") realizowanego w czasie rzeczywistym przez zapytanie Cypher.</li>
                    <li style={{ marginBottom: '10px' }}><strong>Wyszukiwanie:</strong> Zaawansowane filtrowanie po wielu atrybutach węzłów.</li>
                </ul>
            </section>

            <footer style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #eee', color: '#95a5a6', fontSize: '14px', textAlign: 'center' }}>
                &copy; 2025 Projekt Zaliczeniowy - Chmury Obliczeniowe
            </footer>
        </div>
    );
}

export default Documentation;