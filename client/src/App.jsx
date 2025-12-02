import React, { useState } from 'react';
import { gql } from '@apollo/client';
// Importujemy useQuery z podkatalogu react (zgodnie z naprawą builda)
import { useQuery } from '@apollo/client/react';

// ZAAWANSOWANE ZAPYTANIE
// Poprawka: Używamy składni `_SOME` dla pól, które są tablicami (autorzy, gatunki)
const GET_BOOKS_ADVANCED = gql`
  query GetBooksAdvanced($searchTerm: String!) {
    books(
      where: {
        OR: [
          { title_CONTAINS: $searchTerm },
          { author_SOME: { name_CONTAINS: $searchTerm } },
          { genres_SOME: { name_CONTAINS: $searchTerm } }
        ]
      }
    ) {
      title
      year
      description
      author {
        name
      }
      genres {
        name
      }
      reviews {
        rating
        text
        authorName
      }
      # Pamiętamy, że to teraz tablica [User!]!
      currentBorrower {
        username
      }
    }
  }
`;

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);

    const { loading, error, data } = useQuery(GET_BOOKS_ADVANCED, {
        variables: { searchTerm: searchTerm }
    });

    // Funkcja sprawdzająca dostępność (dla tablicy)
    const isAvailable = (book) => !book.currentBorrower || book.currentBorrower.length === 0;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>

            {/* NAGŁÓWEK */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: '#2c3e50' }}>🔎 Biblioteka Grafowa</h1>
                <input
                    type="text"
                    placeholder="Szukaj po tytule, autorze lub gatunku..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '12px 20px', width: '100%', maxWidth: '500px',
                        fontSize: '16px', borderRadius: '25px', border: '2px solid #3498db', outline: 'none'
                    }}
                />
                <p style={{ fontSize: '0.9em', color: '#666' }}>Kliknij w książkę, aby zobaczyć szczegóły</p>
            </div>

            {/* LISTA WYNIKÓW */}
            {loading && <p style={{textAlign: 'center'}}>Przeszukiwanie grafu...</p>}
            {error && <p style={{color: 'red', textAlign: 'center'}}>Błąd: {error.message}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                {data && data.books.map((book, index) => (
                    <div
                        key={index}
                        // TO JEST KLUCZOWE: Obsługa kliknięcia
                        onClick={() => setSelectedBook(book)}
                        style={{
                            border: '1px solid #ddd', borderRadius: '10px', padding: '20px',
                            cursor: 'pointer', // Kursor rączki sugeruje klikalność
                            background: 'white', transition: 'transform 0.2s',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'relative'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {/* Status Dostępności */}
                        <div style={{
                            position: 'absolute', top: '10px', right: '10px',
                            padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold',
                            background: isAvailable(book) ? '#d4edda' : '#f8d7da',
                            color: isAvailable(book) ? '#155724' : '#721c24'
                        }}>
                            {isAvailable(book) ? 'DOSTĘPNA' : 'WYPOŻYCZONA'}
                        </div>

                        <h3 style={{ margin: '15px 0 10px 0', color: '#2c3e50' }}>{book.title}</h3>
                        <p style={{ margin: '5px 0', color: '#555' }}>✍️ {book.author.map(a => a.name).join(', ')}</p>
                        <p style={{ margin: '5px 0', color: '#888', fontSize: '0.9em' }}>📅 {book.year}</p>

                        <div style={{ marginTop: '10px' }}>
                            {book.genres.map(g => (
                                <span key={g.name} style={{ background: '#eee', fontSize: '0.8em', padding: '2px 6px', borderRadius: '4px', marginRight: '5px' }}>
                        {g.name}
                    </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL (OKNO SZCZEGÓŁÓW) */}
            {selectedBook && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }} onClick={() => setSelectedBook(null)}>

                    <div style={{
                        background: 'white', padding: '30px', borderRadius: '12px', maxWidth: '500px', width: '90%',
                        position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }} onClick={e => e.stopPropagation()}>

                        <button
                            onClick={() => setSelectedBook(null)}
                            style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'transparent', fontSize: '24px', cursor: 'pointer', fontWeight: 'bold' }}
                        >✖</button>

                        <h2 style={{ marginTop: 0, paddingRight: '30px' }}>{selectedBook.title}</h2>

                        <div style={{ margin: '20px 0', padding: '15px', background: isAvailable(selectedBook) ? '#e6fffa' : '#fff5f5', borderRadius: '8px' }}>
                            <strong>Status: </strong>
                            {isAvailable(selectedBook)
                                ? <span style={{ color: 'green', fontWeight: 'bold' }}>Dostępna do wypożyczenia</span>
                                : <span style={{ color: 'red', fontWeight: 'bold' }}>
                    Wypożyczona przez: {selectedBook.currentBorrower[0]?.username}
                  </span>
                            }
                        </div>

                        <p><strong>Autor:</strong> {selectedBook.author.map(a => a.name).join(', ')}</p>
                        <p><strong>Gatunki:</strong> {selectedBook.genres.map(g => g.name).join(', ')}</p>
                        <p><strong>Opis:</strong> {selectedBook.description || "Brak opisu."}</p>

                        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

                        <h3>⭐ Recenzje ({selectedBook.reviews.length})</h3>
                        {selectedBook.reviews.length === 0 ? (
                            <p style={{ color: '#999', fontStyle: 'italic' }}>Brak recenzji dla tej pozycji.</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
                                {selectedBook.reviews.map((rev, i) => (
                                    <li key={i} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <strong>{rev.authorName || "Anonim"}</strong>
                                            <span style={{ color: '#f1c40f' }}>{'★'.repeat(rev.rating)}</span>
                                        </div>
                                        <p style={{ margin: '0', fontSize: '0.95em', color: '#444' }}>{rev.text}</p>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <button
                            onClick={() => setSelectedBook(null)}
                            style={{ width: '100%', padding: '12px', marginTop: '15px', background: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}
                        >
                            Zamknij
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;