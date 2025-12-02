import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

// --- ZAPYTANIA (QUERIES) ---

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
      recommended { title, author { name } }
    }
  }
`;

// --- MUTACJE ---

const REGISTER_USER = gql`
  mutation Register($username: String!) {
    createUsers(input: [{ username: $username }]) {
      users { username }
    }
  }
`;

// POPRAWKA: Usunięto "{ equals: ... }". Używamy prostego przypisania "title: $bookTitle"
const BORROW_BOOK = gql`
  mutation Borrow($bookTitle: String!, $username: String!) {
    updateBooks(
      where: { title: $bookTitle }
      update: {
        currentBorrower: {
          connect: [
            { 
              where: { node: { username: $username } } 
            }
          ]
        }
      }
    ) {
      books { title }
    }
  }
`;

// POPRAWKA: Usunięto "{ equals: ... }"
const RETURN_BOOK = gql`
  mutation Return($bookTitle: String!, $username: String!) {
    updateBooks(
      where: { title: $bookTitle }
      update: {
        currentBorrower: {
          disconnect: [
            { 
              where: { node: { username: $username } } 
            }
          ]
        }
      }
    ) {
      books { title }
    }
  }
`;

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);

    const [currentUser, setCurrentUser] = useState(null);
    const [usernameInput, setUsernameInput] = useState("");

    const isNumeric = /^\d+$/.test(searchTerm) && searchTerm.length > 0;
    const searchYear = isNumeric ? parseInt(searchTerm, 10) : -1;

    const { loading, error, data, refetch } = useQuery(GET_BOOKS_ADVANCED, {
        variables: { searchTerm, searchYear }
    });

    const [registerUser] = useMutation(REGISTER_USER);

    const [borrowBook] = useMutation(BORROW_BOOK, {
        onCompleted: () => {
            refetch();
            alert("Sukces! Wypożyczono książkę (dodano krawędź).");
            setSelectedBook(null);
        },
        onError: (err) => alert("Błąd wypożyczania: " + err.message)
    });

    const [returnBook] = useMutation(RETURN_BOOK, {
        onCompleted: () => {
            refetch();
            alert("Sukces! Zwrócono książkę (usunięto krawędź).");
            setSelectedBook(null);
        },
        onError: (err) => alert("Błąd zwrotu: " + err.message)
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!usernameInput) return;
        try {
            await registerUser({ variables: { username: usernameInput } }).catch(() => {});
            setCurrentUser(usernameInput);
            alert(`Witaj, ${usernameInput}!`);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBorrow = async () => {
        if (!currentUser) return alert("Musisz się zalogować!");
        await borrowBook({
            variables: { bookTitle: selectedBook.title, username: currentUser }
        });
    };

    const handleReturn = async () => {
        await returnBook({
            variables: { bookTitle: selectedBook.title, username: currentUser }
        });
    };

    const isAvailable = (book) => !book.currentBorrower || book.currentBorrower.length === 0;
    const isBorrowedByMe = (book) => book.currentBorrower && book.currentBorrower.some(u => u.username === currentUser);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>

            {/* PASEK GÓRNY: LOGOWANIE */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', alignItems: 'center', gap: '10px' }}>
                {currentUser ? (
                    <div style={{ background: '#d1ecf1', color: '#0c5460', padding: '10px 20px', borderRadius: '20px' }}>
                        👤 Zalogowany jako: <strong>{currentUser}</strong>
                        <button
                            onClick={() => setCurrentUser(null)}
                            style={{ marginLeft: '10px', background: 'transparent', border: '1px solid #0c5460', borderRadius: '4px', cursor: 'pointer', color: '#0c5460' }}
                        >Wyloguj</button>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} style={{ display: 'flex', gap: '5px' }}>
                        <input
                            placeholder="Twoja nazwa użytkownika"
                            value={usernameInput}
                            onChange={e => setUsernameInput(e.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                            Zaloguj / Utwórz konto
                        </button>
                    </form>
                )}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: '#2c3e50' }}>🔎 Biblioteka Grafowa</h1>
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
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {selectedBook && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setSelectedBook(null)}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', maxWidth: '500px', width: '90%', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedBook(null)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'transparent', fontSize: '24px', cursor: 'pointer' }}>✖</button>

                        <h2 style={{ marginTop: 0 }}>{selectedBook.title}</h2>

                        <div style={{ margin: '20px 0', padding: '20px', background: isAvailable(selectedBook) ? '#e6fffa' : '#fff5f5', borderRadius: '8px', border: '1px solid #ddd' }}>
                            <strong>Status: </strong>
                            {isAvailable(selectedBook)
                                ? <span style={{ color: 'green', fontWeight: 'bold' }}>Dostępna</span>
                                : <span style={{ color: 'red', fontWeight: 'bold' }}>Wypożyczona przez: {selectedBook.currentBorrower[0]?.username}</span>
                            }

                            <div style={{ marginTop: '15px' }}>
                                {!currentUser ? (
                                    <small style={{color: '#666'}}>Zaloguj się, aby wypożyczyć.</small>
                                ) : isAvailable(selectedBook) ? (
                                    <button onClick={handleBorrow} style={{ background: '#27ae60', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', width: '100%' }}>
                                        📚 Wypożycz teraz
                                    </button>
                                ) : isBorrowedByMe(selectedBook) ? (
                                    <button onClick={handleReturn} style={{ background: '#e67e22', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', width: '100%' }}>
                                        ↩️ Zwróć książkę
                                    </button>
                                ) : (
                                    <span style={{ color: '#c0392b' }}>Niedostępna (Ktoś inny ją czyta)</span>
                                )}
                            </div>
                        </div>

                        <p><strong>Autor:</strong> {selectedBook.author.map(a => a.name).join(', ')}</p>
                        <p><strong>Rok:</strong> {selectedBook.year}</p>

                        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #6c5ce7', marginTop: '20px' }}>
                            <h3 style={{ marginTop: 0, color: '#6c5ce7', fontSize: '1rem' }}>💡 Rekomendacje:</h3>
                            {selectedBook.recommended.length === 0 ? (
                                <p style={{ fontSize: '0.9em', color: '#666' }}>Brak wystarczających danych.</p>
                            ) : (
                                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                    {selectedBook.recommended.map((rec, i) => (
                                        <li key={i}><strong>{rec.title}</strong></li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />
                        <h3>Recenzje</h3>
                        <ul style={{ listStyle: 'none', padding: 0, maxHeight: '100px', overflowY: 'auto' }}>
                            {selectedBook.reviews.map((rev, i) => (
                                <li key={i} style={{ marginBottom: '10px' }}><strong>{rev.authorName}</strong>: {rev.text}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;