import React from 'react';
import { Link } from 'react-router-dom';

function Documentation() {
    return (
        <div style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '40px', lineHeight: '1.8', color: '#333', background: '#fff' }}>

            {/* Przycisk powrotu */}
            <div style={{ marginBottom: '30px' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#2980b9', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    ← Wróć do aplikacji
                </Link>
            </div>

            {/* Nagłówek */}
            <header style={{ borderBottom: '2px solid #eee', paddingBottom: '30px', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '36px', color: '#2c3e50', marginBottom: '10px' }}>Dokumentacja Systemu Bibliotecznego</h1>
                <p style={{ color: '#7f8c8d', fontSize: '18px' }}>
                    Projekt typu <em>Proof of Concept</em> z wykorzystaniem grafowej bazy danych Neo4j, GraphQL oraz architektury Cloud-Native.
                </p>
            </header>

            {/* --- 1. ARCHITEKTURA --- */}
            <section style={{ marginBottom: '60px' }}>
                <h2 style={{ color: '#2c3e50', borderLeft: '5px solid #3498db', paddingLeft: '15px', marginTop: '0' }}>1. Architektura i Wdrożenie</h2>
                <p>
                    Projekt został zrealizowany w oparciu o nowoczesny stos technologiczny <strong>GRAND</strong> (GraphQL, React, Apollo, Neo4j Database).
                    Aplikacja działa w modelu klient-serwer, gdzie warstwa prezentacji (SPA) komunikuje się z warstwą logiczną poprzez zapytania GraphQL,
                    a całość danych przechowywana jest w strukturze grafowej w chmurze.
                </p>

                <ul style={{ marginBottom: '20px' }}>
                    <li><strong>Frontend:</strong> React + Vite (Hosting plików statycznych na Railway).</li>
                    <li><strong>Backend:</strong> Node.js + Apollo Server (Wdrożenie CI/CD na Railway).</li>
                    <li><strong>Baza Danych:</strong> Neo4j AuraDB (Chmura DBaaS).</li>
                </ul>

                {/* DIAGRAM WDROŻENIA */}
                <div style={{ textAlign: 'center', margin: '30px 0', padding: '10px', border: '1px solid #eee', borderRadius: '8px', background: '#fcfcfc' }}>
                    <img
                        src="/client/public/diagram_wdrozenia.png"
                        alt="Diagram Wdrożenia"
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
                    />
                    <p style={{ fontSize: '13px', color: '#7f8c8d', marginTop: '10px', fontStyle: 'italic' }}>
                        Rys. 1. Diagram wdrożenia przedstawiający komunikację między warstwami w chmurze.
                    </p>
                </div>
            </section>

            {/* --- 2. BAZA DANYCH --- */}
            <section style={{ marginBottom: '60px' }}>
                <h2 style={{ color: '#2c3e50', borderLeft: '5px solid #3498db', paddingLeft: '15px' }}>2. Model Danych (Graf)</h2>
                <p>
                    Kluczową cechą projektu jest odejście od tabelarycznego modelu relacyjnego na rzecz modelu grafowego.
                    Węzeł <strong>Book</strong> stanowi centralny punkt (Hub), do którego zbiegają się relacje od autorów, gatunków oraz recenzji.
                </p>
                <p>
                    Dostępność książki jest realizowana dynamicznie poprzez relację <code>:BORROWED</code>. Jeśli krawędź między użytkownikiem a książką istnieje,
                    książka jest uznawana za wypożyczoną. Brak tej krawędzi oznacza dostępność.
                </p>

                {/* DIAGRAM MODELU */}
                <div style={{ textAlign: 'center', margin: '30px 0', padding: '10px', border: '1px solid #eee', borderRadius: '8px', background: '#fcfcfc' }}>
                    <img
                        src="/client/public/diagram_modelu.png"
                        alt="Diagram Modelu Danych"
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
                    />
                    <p style={{ fontSize: '13px', color: '#7f8c8d', marginTop: '10px', fontStyle: 'italic' }}>
                        Rys. 2. Schemat węzłów i krawędzi w bazie Neo4j. Widoczne relacje :WROTE, :BORROWED, :HAS_REVIEW.
                    </p>
                </div>
            </section>

            {/* --- 3. PRZYPADKI UŻYCIA --- */}
            <section style={{ marginBottom: '60px' }}>
                <h2 style={{ color: '#2c3e50', borderLeft: '5px solid #3498db', paddingLeft: '15px' }}>3. Funkcjonalności Systemu</h2>
                <p>
                    Aplikacja rozróżnia dwa poziomy dostępu: Gościa oraz Zalogowanego Użytkownika.
                    Uwierzytelnianie jest uproszczone na potrzeby PoC (podanie nazwy użytkownika tworzy węzeł w grafie).
                </p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    <li><strong>Wyszukiwanie (Guest):</strong> Zaawansowane filtrowanie po tytule, autorze lub roku (operator OR).</li>
                    <li><strong>Rekomendacje (Guest):</strong> System analizuje historię wypożyczeń innych użytkowników, aby sugerować podobne pozycje.</li>
                    <li><strong>Wypożyczanie/Zwrot (User):</strong> Tworzenie i usuwanie krawędzi w grafie w czasie rzeczywistym.</li>
                    <li><strong>Zarządzanie (User):</strong> Dodawanie i usuwanie książek (operacje kaskadowe na grafie).</li>
                </ul>

                {/* DIAGRAM PRZYPADKÓW UŻYCIA */}
                <div style={{ textAlign: 'center', margin: '30px 0', padding: '10px', border: '1px solid #eee', borderRadius: '8px', background: '#fcfcfc' }}>
                    <img
                        src="/client/public/diagram_przypadkow.png"
                        alt="Diagram Przypadków Użycia"
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
                    />
                    <p style={{ fontSize: '13px', color: '#7f8c8d', marginTop: '10px', fontStyle: 'italic' }}>
                        Rys. 3. Diagram przypadków użycia UML prezentujący uprawnienia aktorów.
                    </p>
                </div>
            </section>

            <footer style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #eee', color: '#95a5a6', fontSize: '14px', textAlign: 'center' }}>
                &copy; 2025 Piotr Gwioździk
            </footer>
        </div>
    );
}

export default Documentation;