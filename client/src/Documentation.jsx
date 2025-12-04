import React from 'react';
import { Link } from 'react-router-dom';

// --- LINKI DO OBRAZKÓW (Zdefiniowane tutaj dla porządku) ---
const DIAGRAM_WDROZENIA = "https://mermaid.ink/img/pako:eNp1kMtOwzAQRX_F8qoSdWzSPOqCJQsWbFmwQ21m0jQ1PCLbqaKIf2fcpCBFxTpznxl75g401AloqFiv3w00lo7OH_nhzK5td-x3e7a773Yf3Ovbbnt4O2x3zO14uD_t2d9-cs_dfr9vuR_Xv9wH93rghuF4PH4x1xNzO34c3tnt9vByHI788Pw63Ln72_uW_e9xfOTeb9zw6cgPAz8MP9wwtv1v-KOCsqA0eqQUGmrcqEcqHEr0zqBm3iPVynl4JvRIteY8Uu29R2rgPVKD75EaI4_UGHukJtgjNcEeqUn2SE2xR2oqe6Smukdqhv9IzQRFaiYoUjNBkZoJitRMUKRmgiI1ExSpmaBIzQRFaiYoUjPBf5Ga_P9fpF4semdgKS2txMIqdMwoWEMrMFHhgk3oBFbWCiysFVhYK7CwVmBhrcDCWoGFtQILawUW1gosrBVYWCuwsFagWCtQrBUo1goUawWKtQLFWoFirUCxVqBYK1CsFSjWChRrBcp3Bcp3Bcp3Bcp3Bcp3Bcp3BcrPlQorrzxW3gqsvBVYeSuw8lZg5a3AyluBlbcCK28FVt4KrLwVWHkrsPJWoLwVKOstDek7yl-Aff7T4Q?type=png";

const DIAGRAM_MODELU = "https://mermaid.ink/img/pako:eNpVkMtuwyAQRX_FzKpS1Y_Y86hLl01X3bRD7WDAJgYLGORR1Cj_Xgw0iSLFmXvPnRkG5EwJyJBZp14M1KY-Wd_y3Zhc3W5Y77Zsd9etPrhX1257eNtvd8zteLg_7VjffnDP3X6_b7kf17_cB_d64IbhcDycmeuJuR0_Du_sdnt4OQ6HfH_6dbhx97f3Lfvf43jPvV-54dORHwZ-GH64YWz73_BHBWVAYXRISTTUuFCPVDgU6Z1BzbxHqpXzSE3okWrtPFLtvUdq4D1Sg--RGiOP1Bh7pCbYIzXBHqlJ9khNsUdqKnuuprpHaob_SM0ERWomKFIzQZGaCYrUTFCkZoIiNRMUqZmgSM0ERWomKFIzwX-Rmvy_JFIvFr0zsJSWVmJmFTpmFKyZFZio8IJOYA2twMpagZW1AitrBVbWCqysFVhZK7CyVmBlrcDKWoGVtQIrC8VageKtQPFWoHgrULwVKN4KFG8FircCxVuB4q1A8VageCtQvBUo1goUawWKtQLFWoFirUCxVqBYK1CsFSjWChRrBYq1AsVagfJzBcp3Bcp3Bcp3Bcp3Bcp3Bcp3BcrPlQorrzxW3gqsvBVYeSuw8lZg5a3AyluBlbcCK28FVt4KrLwVWHkrsPJWoLwVKOstDek7yl9J2-Hp?type=png";

const DIAGRAM_PRZYPADKOW = "https://mermaid.ink/img/pako:eNplkU1PwzAMhv9K5HMbaN14QMKJS4cRmDQ4cHEr89C0aVw5bVL_OylbB8RJi-_rsZ_4HGipM9BQsV6_G2gsPTo_8sOaXdvv2O_2bHff7T6417fd9vB22O6Y2_Fwf9qzv_3knrv9ft9yP65_uQ_u9cANw_F4_GKuJ-Z2_Di8s9vt4eU4HPnh-XW4c_e39y373-P4yL3fuOHTkR8Gfhh-uGFs-9_wRwVlQWn0SCk01LhQj1Q4lOidQc28R6qV88hM6JFq7TxS7b1HauA9UoPvkRojj9QYe6Qm2CM1wR6pSfZITbFHaip7pKa6R2qG_0jNBEVqJihSM0GRmgmK1ExQpGaCIjUTFKmZoEjNBEVqJihSM0F_kZr8_1-kXix6Z2ApLa3Ewip0zChYQyswUeGCNXQCK2sFFtYKLKwVWFgrsLBWYGGtwMJagYW1AgtrBRbWCiysFVhYK7CwVmBhrUCxVqBYK1CsFSjWChRrBYq1AsVagWKtQLFWoFgrUKwVKNYKlJ8rUE609Jg5WjKwCis1lq6whiZ6Wqyw8lZg5a3AyluBlbcCK28FVt4KrLwVWHkrsPJWYOWtwMpbgZW3AitvBVbeCqy8FShvBcpbgbLW0pC-o_wF2Nc9XQ?type=png";

function Documentation() {
    return (
        <div style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '40px', lineHeight: '1.8', color: '#333', background: '#fff' }}>

            {/* Przycisk powrotu */}
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
                        src={DIAGRAM_WDROZENIA}
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
                        src={DIAGRAM_MODELU}
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
                        src={DIAGRAM_PRZYPADKOW}
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