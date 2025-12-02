import React, { useState } from 'react';
import { gql } from '@apollo/client';
// Pamiętaj o imporcie z '/react' (tak jak ustaliliśmy wcześniej)
import { useQuery, useMutation } from '@apollo/client/react';// Zapytanie GraphQL - to tu dzieje się magia grafowa

// 1. POBIERANIE (Z obsługą wyszukiwania po tytule)
const GET_BOOKS = gql`
  query GetBooks($title: String) {
    books(where: { title_CONTAINS: $title }) {
      title
      year
      author {
        name
      }
      genres {
        name
      }
    }
  }
`;

// 2. TWORZENIE (Dodawanie książki i łączenie z autorem)
// Zwróć uwagę na składnię 'connectOrCreate' - to siła grafów!
// Jeśli autor istnieje -> połącz. Jeśli nie -> stwórz go.
const CREATE_BOOK = gql`
  mutation CreateBook($title: String!, $year: Int!, $authorName: String!) {
    createBooks(
      input: [
        {
          title: $title
          year: $year
          author: {
            connectOrCreate: {
              where: { node: { name: $authorName } }
              onCreate: { node: { name: $authorName } }
            }
          }
        }
      ]
    ) {
      books {
        title
      }
    }
  }
`;

function App() {
    // Stan dla wyszukiwarki
    const [searchTerm, setSearchTerm] = useState("");

    // Stan dla formularza dodawania
    const [newTitle, setNewTitle] = useState("");
    const [newAuthor, setNewAuthor] = useState("");
    const [newYear, setNewYear] = useState("");

    // Hooki GraphQL
    const { loading, error, data, refetch } = useQuery(GET_BOOKS, {
        variables: { title: searchTerm } // Przekazujemy wpisany tekst do zapytania
    });

    const [createBook] = useMutation(CREATE_BOOK, {
        onCompleted: () => {
            // Po dodaniu wyczyść formularz i odśwież listę
            setNewTitle("");
            setNewAuthor("");
            setNewYear("");
            refetch();
        }
    });

    const handleAddBook = (e) => {
        e.preventDefault();
        if (!newTitle || !newAuthor) return;

        createBook({
            variables: {
                title: newTitle,
                year: parseInt(newYear) || 2025,
                authorName: newAuthor
            }
        });
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
                <h1 style={{ color: '#333' }}>📚 Biblioteka Grafowa</h1>

                {/* WYSZUKIWARKA */}
                <input
                    type="text"
                    placeholder="🔍 Szukaj tytułu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '10px', width: '100%', maxWidth: '400px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
            </header>

            {/* FORMULARZ DODAWANIA */}
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h3>➕ Dodaj nową książkę</h3>
                <form onSubmit={handleAddBook} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        placeholder="Tytuł"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        style={{ padding: '8px' }}
                    />
                    <input
                        placeholder="Autor"
                        value={newAuthor}
                        onChange={e => setNewAuthor(e.target.value)}
                        style={{ padding: '8px' }}
                    />
                    <input
                        placeholder="Rok"
                        type="number"
                        value={newYear}
                        onChange={e => setNewYear(e.target.value)}
                        style={{ padding: '8px', width: '80px' }}
                    />
                    <button type="submit" style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Dodaj do Grafu
                    </button>
                </form>
            </div>

            {/* LISTA KSIĄŻEK */}
            {loading && <p>Ładowanie grafu...</p>}
            {error && <p style={{color: 'red'}}>Błąd: {error.message}</p>}

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {data && data.books.map((book, index) => (
                    <div key={index} style={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        padding: '16px',
                        width: '250px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        background: 'white'
                    }}>
                        <h2 style={{ fontSize: '1.2rem', margin: '0 0 5px 0' }}>{book.title}</h2>
                        <small style={{ color: '#666' }}>Rok: {book.year}</small>

                        <p style={{ margin: '10px 0' }}>
                            <strong>✍️ Autor:</strong><br/>
                            {book.author.map(a => a.name).join(', ') || "Nieznany"}
                        </p>

                        {/* Wyświetlamy gatunki tylko jeśli istnieją */}
                        {book.genres && book.genres.length > 0 && (
                            <div style={{ marginTop: '10px' }}>
                                {book.genres.map(g => (
                                    <span key={g.name} style={{
                                        background: '#e0f2f1',
                                        color: '#00695c',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '0.75rem',
                                        marginRight: '5px'
                                    }}>
                    {g.name}
                  </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
