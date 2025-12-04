import React from 'react';
import { Link } from 'react-router-dom';

// --- IMPORTY OBRAZKÓW ---
import imgWdrozenie from './assets/wdrozenie.png';
import imgModel from './assets/model.png';
import imgPrzypadki from './assets/przypadki.png';

function Documentation() {
    // Style dla sekcji i nagłówków
    const styles = {
        container: {
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            maxWidth: '960px',
            margin: '0 auto',
            padding: '40px 20px',
            color: '#2c3e50',
            lineHeight: '1.6',
            backgroundColor: '#fff'
        },
        header: {
            borderBottom: '2px solid #ecf0f1',
            paddingBottom: '20px',
            marginBottom: '40px'
        },
        backLink: {
            display: 'inline-block',
            marginBottom: '20px',
            color: '#2980b9',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '14px'
        },
        section: {
            marginBottom: '60px'
        },
        h2: {
            fontSize: '22px',
            borderLeft: '5px solid #2980b9',
            paddingLeft: '15px',
            marginTop: '0',
            marginBottom: '25px',
            color: '#2c3e50'
        },
        h3: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#34495e',
            marginTop: '30px',
            marginBottom: '15px'
        },
        h4: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#2c3e50',
            marginTop: '20px',
            marginBottom: '10px'
        },
        imgContainer: {
            border: '1px solid #dfe6e9',
            borderRadius: '4px',
            padding: '15px',
            textAlign: 'center',
            marginBottom: '15px',
            background: '#fdfdfd'
        },
        img: {
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
            margin: '0 auto'
        },
        caption: {
            fontSize: '12px',
            color: '#7f8c8d',
            textAlign: 'center',
            marginTop: '8px',
            fontStyle: 'italic'
        },
        codeBlock: {
            background: '#2d3436',
            color: '#dfe6e9',
            padding: '15px',
            borderRadius: '6px',
            fontFamily: 'Consolas, monospace',
            fontSize: '13px',
            overflowX: 'auto',
            lineHeight: '1.4',
            border: '1px solid #b2bec3'
        },
        list: {
            paddingLeft: '20px',
            marginBottom: '15px'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '15px',
            fontSize: '14px'
        },
        th: {
            border: '1px solid #bdc3c7',
            padding: '10px',
            background: '#ecf0f1',
            textAlign: 'left'
        },
        td: {
            border: '1px solid #bdc3c7',
            padding: '10px'
        },
        stepBox: {
            background: '#f8f9fa',
            borderLeft: '4px solid #7f8c8d',
            padding: '15px',
            marginBottom: '15px',
            fontSize: '14px'
        }
    };

    return (
        <div style={styles.container}>

            <Link to="/" style={styles.backLink}>← Powrót do systemu</Link>

            <header style={styles.header}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>Dokumentacja Techniczna</h1>
                <p style={{ color: '#7f8c8d', fontSize: '16px', margin: 0 }}>
                    Projekt zaliczeniowy: System biblioteczny oparty na grafowej bazie danych Neo4j
                </p>
            </header>

            {/* --- SPIS TREŚCI --- */}
            <nav style={{ background: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '50px', border: '1px solid #e1e4e8' }}>
                <h3 style={{ marginTop: 0, fontSize: '16px' }}>Spis treści</h3>
                <ul style={{ marginBottom: 0, fontSize: '14px' }}>
                    <li><a href="#cel-projektu" style={{color: '#2980b9'}}>1. Cel i zakres projektu</a></li>
                    <li><a href="#architektura" style={{color: '#2980b9'}}>2. Architektura systemu i diagram wdrożenia</a></li>
                    <li><a href="#model-danych" style={{color: '#2980b9'}}>3. Model danych (Graf)</a></li>
                    <li><a href="#funkcjonalnosci" style={{color: '#2980b9'}}>4. Specyfikacja funkcjonalna</a></li>
                    <li><a href="#technologia" style={{color: '#2980b9'}}>5. Stos technologiczny (GRAND Stack)</a></li>
                    <li><a href="#instrukcja" style={{color: '#2980b9'}}>6. Instrukcja obsługi systemu</a></li>
                </ul>
            </nav>

            {/* --- 1. CEL PROJEKTU --- */}
            <section id="cel-projektu" style={styles.section}>
                <h2 style={styles.h2}>1. Cel i zakres projektu</h2>
                <p>
                    Przedmiotem projektu jest implementacja aplikacji internetowej typu <em>Proof of Concept</em> (PoC), demonstrującej praktyczne zastosowanie grafowych baz danych w systemach informatycznych.
                    Głównym celem było odejście od relacyjnego modelu danych na rzecz struktury węzłów i krawędzi, co pozwala na efektywniejsze modelowanie złożonych relacji (m.in. systemów rekomendacji).
                </p>
            </section>

            {/* --- 2. ARCHITEKTURA --- */}
            <section id="architektura" style={styles.section}>
                <h2 style={styles.h2}>2. Architektura systemu i wdrożenie</h2>
                <p>
                    System został zaprojektowany w architekturze klient-serwer, wykorzystując model chmurowy (Cloud Computing).
                    Komunikacja między warstwami odbywa się za pośrednictwem protokołu HTTP/HTTPS z wykorzystaniem języka zapytań GraphQL.
                </p>

                <div style={styles.imgContainer}>
                    <img src={imgWdrozenie} alt="Diagram Wdrożenia" style={styles.img} />
                </div>
                <p style={styles.caption}>Rys. 1. Diagram wdrożenia w architekturze chmurowej (Railway + Neo4j AuraDB).</p>

                <h3 style={styles.h3}>Komponenty systemu:</h3>
                <ul style={styles.list}>
                    <li><strong>Warstwa Klienta (Frontend):</strong> Aplikacja SPA (Single Page Application) zbudowana w oparciu o bibliotekę React. Odpowiada za interakcję z użytkownikiem i dynamiczne renderowanie widoków.</li>
                    <li><strong>Warstwa Aplikacji (Backend):</strong> Serwer Node.js zintegrowany z Apollo Server. Pełni rolę pośrednika (API Gateway), tłumacząc zapytania GraphQL na zapytania bazodanowe Cypher.</li>
                    <li><strong>Warstwa Danych (Database):</strong> Neo4j AuraDB – grafowa baza danych działająca w modelu DBaaS (Database as a Service), przechowująca strukturę węzłów i relacji.</li>
                </ul>
            </section>

            {/* --- 3. MODEL DANYCH --- */}
            <section id="model-danych" style={styles.section}>
                <h2 style={styles.h2}>3. Model danych (Graf)</h2>
                <p>
                    W przeciwieństwie do systemów RDBMS, projekt nie wykorzystuje tabel ani kluczy obcych.
                    Dane modelowane są jako graf skierowany, składający się z węzłów (Nodes) oraz relacji (Relationships).
                </p>

                <div style={styles.imgContainer}>
                    <img src={imgModel} alt="Diagram Modelu Danych" style={styles.img} />
                </div>
                <p style={styles.caption}>Rys. 2. Schemat logiczny bazy danych. Widoczne typy węzłów oraz kierunki relacji.</p>

                <h3 style={styles.h3}>Kluczowe elementy modelu:</h3>
                <ul style={styles.list}>
                    <li><strong>Węzły:</strong> <code>Book</code> (Książka), <code>Author</code> (Autor), <code>Genre</code> (Gatunek), <code>User</code> (Użytkownik), <code>Review</code> (Recenzja).</li>
                    <li><strong>Relacja <code>:BORROWED</code>:</strong> Określa stan wypożyczenia. Istnienie krawędzi między użytkownikiem a książką oznacza, że dany egzemplarz jest niedostępny.</li>
                    <li><strong>Relacja <code>:WROTE</code> oraz <code>:BELONGS_TO</code>:</strong> Definiują metadane książki, umożliwiając nawigację po grafie.</li>
                </ul>
            </section>

            {/* --- 4. FUNKCJONALNOŚCI --- */}
            <section id="funkcjonalnosci" style={styles.section}>
                <h2 style={styles.h2}>4. Specyfikacja funkcjonalna</h2>
                <p>
                    System realizuje funkcjonalności podzielone według ról aktorów: Gościa (użytkownik niezalogowany) oraz Użytkownika (zalogowany czytelnik/administrator).
                </p>

                <div style={styles.imgContainer}>
                    <img src={imgPrzypadki} alt="Diagram Przypadków Użycia" style={styles.img} />
                </div>
                <p style={styles.caption}>Rys. 3. Diagram przypadków użycia (UML Use Case Diagram).</p>

                <h3 style={styles.h3}>Szczegółowy opis funkcji:</h3>
                <ul style={styles.list}>
                    <li><strong>Zaawansowane wyszukiwanie (Full-Text Search):</strong> Implementacja filtrowania hybrydowego (operator logiczny OR) umożliwia jednoczesne przeszukiwanie zasobów po tytule, autorze, gatunku lub roku wydania.</li>
                    <li><strong>System Rekomendacji (Collaborative Filtering):</strong> Aplikacja wykorzystuje algorytm grafowy zaimplementowany w języku Cypher. System analizuje ścieżki w grafie: <code>(Book)&lt;-[:BORROWED]-(User)-[:BORROWED]-&gt;(OtherBook)</code>, aby sugerować pozycje wypożyczane przez użytkowników o podobnych preferencjach.</li>
                    <li><strong>Zarządzanie zasobami (CRUD):</strong>
                        <ul>
                            <li>Dodawanie książek z automatyczną deduplikacją autorów (użycie mutacji <code>connectOrCreate</code>).</li>
                            <li>Kaskadowe usuwanie węzłów wraz z przyległymi relacjami.</li>
                        </ul>
                    </li>
                    <li><strong>Obsługa wypożyczeń:</strong> Transakcyjne tworzenie i usuwanie krawędzi <code>:BORROWED</code> w grafie, co natychmiast zmienia status dostępności zasobu.</li>
                </ul>
            </section>

            {/* --- 5. TECHNOLOGIA --- */}
            <section id="technologia" style={styles.section}>
                <h2 style={styles.h2}>5. Stos technologiczny (GRAND Stack)</h2>
                <p>
                    Projekt został zrealizowany przy użyciu zestawu technologii GRAND (GraphQL, React, Apollo, Neo4j Database), co zapewnia wysoką skalowalność i elastyczność.
                </p>

                <table style={styles.table}>
                    <thead>
                    <tr>
                        <th style={styles.th}>Warstwa</th>
                        <th style={styles.th}>Technologia</th>
                        <th style={styles.th}>Opis zastosowania</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td style={styles.td}><strong>API / Query Language</strong></td>
                        <td style={styles.td}>GraphQL</td>
                        <td style={styles.td}>Umożliwia deklaratywne pobieranie danych, eliminując zjawiska <em>over-fetching</em> i <em>under-fetching</em>. Stanowi kontrakt między frontendem a backendem.</td>
                    </tr>
                    <tr>
                        <td style={styles.td}><strong>Frontend</strong></td>
                        <td style={styles.td}>React (Vite)</td>
                        <td style={styles.td}>Biblioteka JavaScript do budowy interfejsów użytkownika w modelu komponentowym. Zapewnia responsywność aplikacji (SPA).</td>
                    </tr>
                    <tr>
                        <td style={styles.td}><strong>Backend</strong></td>
                        <td style={styles.td}>Apollo Server</td>
                        <td style={styles.td}>Serwer GraphQL obsługujący żądania, autoryzację oraz integrację z bazą danych poprzez bibliotekę <code>@neo4j/graphql</code>.</td>
                    </tr>
                    <tr>
                        <td style={styles.td}><strong>Baza Danych</strong></td>
                        <td style={styles.td}>Neo4j AuraDB</td>
                        <td style={styles.td}>Bezserwerowa, natywna baza grafowa dostępna w chmurze. Obsługuje protokół Bolt+s (szyfrowany).</td>
                    </tr>
                    </tbody>
                </table>

                <h3 style={{ marginTop: '30px', fontSize: '16px' }}>Przykład definicji schematu (GraphQL Schema):</h3>
                <p>Poniższy kod definiuje strukturę węzła Książki oraz logikę rekomendacji obliczaną po stronie bazy:</p>

                <div style={styles.codeBlock}>
                    {`type Book @node {
  title: String!
  year: Int
  
  # Relacje zdefiniowane za pomocą dyrektywy @relationship
  author: [Author!]! @relationship(type: "WROTE", direction: IN)
  genres: [Genre!]! @relationship(type: "BELONGS_TO", direction: OUT)
  
  # Pole obliczane dynamicznie (Cypher Query)
  # Wyszukuje książki powiązane przez wspólnych czytelników
  recommended: [Book!]! @cypher(
    statement: """
      MATCH (this)<-[:BORROWED]-(u:User)-[:BORROWED]->(other:Book)
      WHERE other <> this
      RETURN other LIMIT 3
    """,
    columnName: "other"
  )
}`}
                </div>
            </section>

            {/* --- 6. INSTRUKCJA OBSŁUGI --- */}
            <section id="instrukcja" style={styles.section}>
                <h2 style={styles.h2}>6. Instrukcja obsługi systemu</h2>
                <p>
                    Poniższa instrukcja opisuje kroki niezbędne do realizacji kluczowych scenariuszy użycia w aplikacji.
                </p>

                <h4 style={styles.h4}>6.1. Logowanie i Rejestracja</h4>
                <div style={styles.stepBox}>
                    W systemie PoC zastosowano uproszczony model autoryzacji. W prawym górnym rogu ekranu znajduje się pole <strong>"Nazwa użytkownika"</strong>.
                    Wpisanie dowolnego identyfikatora i kliknięcie <strong>"Zaloguj"</strong> powoduje utworzenie węzła Użytkownika w grafie (jeśli nie istnieje) lub zalogowanie do istniejącego konta.
                </div>

                <h4 style={styles.h4}>6.2. Wyszukiwanie zasobów</h4>
                <div style={styles.stepBox}>
                    Pasek wyszukiwania znajduje się w centralnej części ekranu. System obsługuje zapytania wielokryterialne.
                    Wpisanie frazy (np. <em>"Sapkowski"</em>, <em>"Fantasy"</em> lub <em>"1993"</em>) automatycznie filtruje widoczne zasoby, przeszukując węzły typu Książka, Autor oraz Gatunek.
                </div>

                <h4 style={styles.h4}>6.3. Wypożyczanie książek</h4>
                <div style={styles.stepBox}>
                    1. Zaloguj się do systemu.<br/>
                    2. Kliknij na kafel wybranej książki, aby otworzyć okno szczegółów.<br/>
                    3. Jeśli status książki to <span style={{color: 'green', fontWeight: 'bold'}}>Dostępna</span>, kliknij przycisk <strong>"Wypożycz"</strong>.<br/>
                    4. System utworzy relację w bazie danych, a status zmieni się na <span style={{color: 'red', fontWeight: 'bold'}}>Wypożyczona</span>.
                </div>

                <h4 style={styles.h4}>6.4. Dodawanie nowych pozycji (CRUD)</h4>
                <div style={styles.stepBox}>
                    1. Kliknij przycisk <strong>"Dodaj nową książkę"</strong> w lewym górnym rogu.<br/>
                    2. Wypełnij formularz (Tytuł, Autor, Gatunek, Rok).<br/>
                    3. Zatwierdź przyciskiem <strong>"Zapisz w bazie"</strong>.<br/>
                    <em>Uwaga: Jeśli podany Autor lub Gatunek już istnieje w grafie, system nie utworzy duplikatu, lecz połączy nową książkę z istniejącym węzłem.</em>
                </div>
            </section>

            <footer style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #bdc3c7', color: '#7f8c8d', fontSize: '13px', textAlign: 'center' }}>
                &copy; 2025 Piotr Gwioździk
            </footer>
        </div>
    );
}

export default Documentation;