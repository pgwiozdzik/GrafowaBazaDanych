import React from 'react';
import { Link } from 'react-router-dom';

// --- IMPORTY OBRAZKÓW ---
import imgWdrozenie from './assets/wdrozenie.png';
import imgModel from './assets/model.png';
import imgPrzypadki from './assets/przypadki.png';

function Documentation() {
    // Proste style dla czytelności
    const styles = {
        container: {
            fontFamily: '"Inter", "Segoe UI", sans-serif',
            maxWidth: '900px',
            margin: '0 auto',
            padding: '40px 20px',
            color: '#333',
            lineHeight: '1.6',
            backgroundColor: '#fff'
        },
        header: {
            borderBottom: '1px solid #eaeaea',
            paddingBottom: '20px',
            marginBottom: '40px'
        },
        backLink: {
            display: 'inline-block',
            marginBottom: '20px',
            color: '#0070f3',
            textDecoration: 'none',
            fontWeight: '600'
        },
        section: {
            marginBottom: '60px'
        },
        h2: {
            fontSize: '24px',
            borderLeft: '4px solid #0070f3',
            paddingLeft: '15px',
            marginTop: '0',
            marginBottom: '20px'
        },
        h3: {
            fontSize: '18px',
            color: '#444',
            marginTop: '25px',
            marginBottom: '10px'
        },
        imgContainer: {
            border: '1px solid #eaeaea',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            marginBottom: '10px',
            background: '#fafafa'
        },
        img: {
            maxWidth: '100%',
            height: 'auto'
        },
        caption: {
            fontSize: '13px',
            color: '#666',
            textAlign: 'center',
            marginTop: '5px',
            fontStyle: 'italic'
        },
        codeBlock: {
            background: '#f5f5f5',
            padding: '15px',
            borderRadius: '5px',
            fontFamily: 'monospace',
            fontSize: '13px',
            overflowX: 'auto',
            border: '1px solid #eee'
        },
        list: {
            paddingLeft: '20px'
        }
    };

    return (
        <div style={styles.container}>

            <Link to="/" style={styles.backLink}>← Powrót do aplikacji</Link>

            <header style={styles.header}>
                <h1 style={{ margin: 0, fontSize: '32px' }}>Instrukcja i Dokumentacja</h1>
                <p style={{ color: '#666', fontSize: '18px', marginTop: '10px' }}>
                    System Biblioteczny "Knowledge Graph"
                </p>
            </header>

            {/* --- SPIS TREŚCI --- */}
            <nav style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '40px' }}>
                <h3 style={{ marginTop: 0 }}>Spis treści:</h3>
                <ul style={{ marginBottom: 0 }}>
                    <li><a href="#o-projekcie">1. O co chodzi w tym projekcie?</a></li>
                    <li><a href="#schematy">2. Jak to wygląda "pod maską"? (Schematy)</a></li>
                    <li><a href="#funkcje">3. Co można robić w aplikacji?</a></li>
                    <li><a href="#technologia">4. Jakie technologie wykorzystano?</a></li>
                </ul>
            </nav>

            {/* --- 1. O PROJEKCIE --- */}
            <section id="o-projekcie" style={styles.section}>
                <h2 style={styles.h2}>1. O co chodzi w tym projekcie?</h2>
                <p>
                    To aplikacja biblioteki, która działa inaczej niż tradycyjne systemy. Zamiast zwykłych tabel (jak w Excelu),
                    używamy <strong>grafu</strong>. Wyobraź sobie, że każda książka, autor i czytelnik to kropka na tablicy,
                    a my łączymy te kropki sznurkami (relacjami).
                </p>
                <p>
                    Dzięki temu system potrafi robić mądre rzeczy, np. podpowiadać:
                    <em>"Skoro Jan czytał Wiedźmina i Hobbita, a Ty czytasz Wiedźmina, to może Hobbit też Ci się spodoba?"</em>.
                </p>
            </section>

            {/* --- 2. SCHEMATY --- */}
            <section id="schematy" style={styles.section}>
                <h2 style={styles.h2}>2. Jak to wygląda "pod maską"?</h2>

                <h3 style={styles.h3}>A. Jak elementy łączą się ze sobą?</h3>
                <p>Tu widać architekturę. Przeglądarka łączy się z chmurą, gdzie działa nasz serwer i baza danych.</p>
                <div style={styles.imgContainer}>
                    <img src={imgWdrozenie} alt="Architektura" style={styles.img} />
                </div>
                <p style={styles.caption}>Rys 1. Schemat działania w chmurze (Railway + Neo4j Aura).</p>

                <h3 style={styles.h3}>B. Jak zapisujemy dane?</h3>
                <p>
                    Nie mamy tabel "Książki" i "Wypożyczenia". Mamy węzły (Książka, Autor) i strzałki.
                    Gdy wypożyczasz książkę, tworzymy strzałkę <code>BORROWED</code> od Ciebie do książki.
                </p>
                <div style={styles.imgContainer}>
                    <img src={imgModel} alt="Model Danych" style={styles.img} />
                </div>
                <p style={styles.caption}>Rys 2. Model grafowy. Strzałki pokazują relacje.</p>

                <h3 style={styles.h3}>C. Co może robić użytkownik?</h3>
                <div style={styles.imgContainer}>
                    <img src={imgPrzypadki} alt="Diagram Przypadków" style={styles.img} />
                </div>
                <p style={styles.caption}>Rys 3. Funkcje dla gościa i zalogowanego użytkownika.</p>
            </section>

            {/* --- 3. FUNKCJE --- */}
            <section id="funkcje" style={styles.section}>
                <h2 style={styles.h2}>3. Co można robić w aplikacji?</h2>

                <h3 style={styles.h3}>Dla każdego (Gość)</h3>
                <ul style={styles.list}>
                    <li><strong>Szukanie:</strong> Możesz wpisać tytuł, autora, gatunek lub rok. System przeszuka wszystko naraz.</li>
                    <li><strong>Podgląd:</strong> Kliknij w książkę, żeby zobaczyć opis i recenzje.</li>
                    <li><strong>Rekomendacje:</strong> Zobaczysz sekcję "Inni czytali też...", generowaną na żywo.</li>
                </ul>

                <h3 style={styles.h3}>Dla zalogowanych (Admin/Czytelnik)</h3>
                <ul style={styles.list}>
                    <li><strong>Wypożyczanie:</strong> Kliknij przycisk "Wypożycz". Książka zostanie przypisana do Ciebie (zmieni się status).</li>
                    <li><strong>Zwrot:</strong> Oddaj książkę jednym kliknięciem.</li>
                    <li><strong>Dodawanie książek:</strong> Użyj przycisku na górze, by dodać nową pozycję. Autor i Gatunek stworzą się automatycznie.</li>
                    <li><strong>Usuwanie:</strong> Możesz usunąć książkę z bazy (przycisk w szczegółach książki).</li>
                </ul>
            </section>

            {/* --- 4. TECHNOLOGIA --- */}
            <section id="technologia" style={styles.section}>
                <h2 style={styles.h2}>4. Jakie technologie wykorzystano?</h2>
                <p>Projekt używa nowoczesnego zestawu narzędzi zwanego <strong>GRAND Stack</strong>:</p>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                    <tbody>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>GraphQL</td>
                        <td style={{ padding: '10px' }}>Język do komunikacji z bazą. Pobieramy tylko to, co potrzebne.</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>React</td>
                        <td style={{ padding: '10px' }}>Budowa interfejsu (strona działa szybko, bez przeładowań).</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>Neo4j</td>
                        <td style={{ padding: '10px' }}>Grafowa baza danych. To serce systemu.</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>Railway</td>
                        <td style={{ padding: '10px' }}>Chmura, w której "żyje" nasza aplikacja.</td>
                    </tr>
                    </tbody>
                </table>

                <h3 style={{ marginTop: '30px', fontSize: '16px' }}>Przykład struktury danych (Kod):</h3>
                <p>Tak definiujemy węzły w systemie:</p>
                <div style={styles.codeBlock}>
                    {`type Book @node {
  title: String!
  year: Int
  
  # Relacje (Strzałki w grafie)
  author: [Author!]! @relationship(type: "WROTE", direction: IN)
  genres: [Genre!]! @relationship(type: "BELONGS_TO", direction: OUT)
  
  # Logika rekomendacji (Cypher)
  recommended: [Book!]! @cypher(statement: "MATCH (this)<-[:BORROWED]-(u)-[:BORROWED]->(other) RETURN other")
}`}
                </div>
            </section>

            <footer style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #eee', color: '#999', fontSize: '14px', textAlign: 'center' }}>
                &copy; 2025 Piotr Gwioździk
            </footer>
        </div>
    );
}

export default Documentation;