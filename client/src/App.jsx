import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_BOOKS_ADVANCED = gql`
  query GetBooksAdvanced($searchTerm: String!, $searchYear: Int!) {
    books(
      where: {
        OR: [
          { title_CONTAINS: $searchTerm },
          { author_SOME: { name_CONTAINS: $searchTerm } },
          { genres_SOME: { name_CONTAINS: $searchTerm } },
          { year_IN: [$searchYear] }
        ]
      }
    ) {
      title
      year
      description
      author { name }
      genres { name }
      reviews { rating, text, authorName }
      currentBorrower { username }
      
      # NOWOŚĆ: Pobieramy rekomendacje wyliczone przez graf
      recommended {
        title
        author { name }
      }
    }
  }
`;

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);

    const isNumeric = /^\d+$/.test(searchTerm) && searchTerm.length > 0;
    const searchYear = isNumeric ? parseInt(searchTerm, 10) : -1;

    const { loading, error, data } = useQuery(GET_BOOKS_ADVANCED, {
        variables: { searchTerm, searchYear }
    });

    const isAvailable = (book) => !book.currentBorrower || book.currentBorrower.length === 0;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: '#2c3e50' }}>🔎 Biblioteka Grafowa + AI Rekomendacje</h1>
                <input
                    type="text"
                    placeholder="Szukaj po tytule, autorze, gatunku lub roku..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '12px 20px', width: '100%', maxWidth: '500px', fontSize: '16px', borderRadius: '25px', border: '2px solid #3498db', outline: 'none' }}
                />
            </div>

            {loading && <p style={{textAlign: 'center'}}>Przeszukiwanie grafu...</p>}
            {error && <p style={{color: 'red', textAlign: 'center'}}>Błąd: {error.message}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                {data && data.books.map((book, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedBook(book)}
                        style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', cursor: 'pointer', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'relative' }}
                    >
                        <div style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', background: isAvailable(book) ? '#d4edda' : '#f8d7da', color: isAvailable(book) ? '#155724' : '#721c24' }}>
                            {isAvailable(book) ? 'DOSTĘPNA' : 'WYPOŻYCZONA'}
                        </div>
                        <h3 style={{ margin: '15px 0 10px 0', color: '#2c3e50' }}>{book.title}</h3>
                        <p style={{ margin: '5px 0', color: '#555' }}>✍️ {book.author.map(a => a.name).join(', ')}</p>
                        <p style={{ margin: '5px 0', color: '#888', fontSize: '0.9em' }}>📅 {book.year}</p>
                    </div>
                ))}
            </div>

            {selectedBook && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setSelectedBook(null)}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', maxWidth: '500px', width: '90%', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>

                        <button onClick={() => setSelectedBook(null)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'transparent', fontSize: '24px', cursor: 'pointer' }}>✖</button>

                        <h2 style={{ marginTop: 0 }}>{selectedBook.title}</h2>
                        <div style={{ margin: '20px 0', padding: '15px', background: isAvailable(selectedBook) ? '#e6fffa' : '#fff5f5', borderRadius: '8px' }}>
                            <strong>Status: </strong>
                            {isAvailable(selectedBook)
                                ? <span style={{ color: 'green', fontWeight: 'bold' }}>Dostępna</span>
                                : <span style={{ color: 'red', fontWeight: 'bold' }}>Wypożyczona przez: {selectedBook.currentBorrower[0]?.username}</span>
                            }
                        </div>
                        <p><strong>Autor:</strong> {selectedBook.author.map(a => a.name).join(', ')}</p>
                        <p><strong>Rok:</strong> {selectedBook.year}</p>
                        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

                        {/* SEKCJA REKOMENDACJI */}
                        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #6c5ce7' }}>
                            <h3 style={{ marginTop: 0, color: '#6c5ce7' }}>💡 Czytelnicy polecają też:</h3>
                            {selectedBook.recommended.length === 0 ? (
                                <p style={{ fontSize: '0.9em', color: '#666' }}>Brak wystarczających danych do rekomendacji.</p>
                            ) : (
                                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                    {selectedBook.recommended.map((rec, i) => (
                                        <li key={i} style={{ marginBottom: '5px' }}>
                                            <strong>{rec.title}</strong> <span style={{color: '#888'}}>({rec.author.map(a=>a.name).join(", ")})</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

                        <h3>⭐ Recenzje ({selectedBook.reviews.length})</h3>
                        <ul style={{ listStyle: 'none', padding: 0, maxHeight: '150px', overflowY: 'auto' }}>
                            {selectedBook.reviews.map((rev, i) => (
                                <li key={i} style={{ marginBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>
                                    <strong>{rev.authorName}</strong>: {rev.text}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setSelectedBook(null)} style={{ width: '100%', padding: '12px', marginTop: '15px', background: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Zamknij</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;