import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

// --- ZAPYTANIA ---

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

const BORROW_BOOK = gql`
  mutation Borrow($bookTitle: String!, $username: String!) {
    updateBooks(
      where: { title_IN: [$bookTitle] }
      update: {
        currentBorrower: {
          connect: [ { where: { node: { username_IN: [$username] } } } ]
        }
      }
    ) {
      books { title }
    }
  }
`;

const RETURN_BOOK = gql`
  mutation Return($bookTitle: String!, $username: String!) {
    updateBooks(
      where: { title_IN: [$bookTitle] }
      update: {
        currentBorrower: {
          disconnect: [ { where: { node: { username_IN: [$username] } } } ]
        }
      }
    ) {
      books { title }
    }
  }
`;

const CREATE_BOOK = gql`
  mutation CreateBook($title: String!, $year: Int!, $desc: String!, $author: String!, $genre: String!) {
    createBooks(input: [
      {
        title: $title
        year: $year
        description: $desc
        author: {
          create: { node: { name: $author } }
        }
        genres: {
          create: { node: { name: $genre } }
        }
      }
    ]) {
      books { title }
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($title: String!) {
    deleteBooks(where: { title_IN: [$title] }) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);

    const [currentUser, setCurrentUser] = useState(null);
    const [usernameInput, setUsernameInput] = useState("");

    const [showAddForm, setShowAddForm] = useState(false);
    const [newBook, setNewBook] = useState({ title: "", author: "", year: "", genre: "", desc: "" });

    const isNumeric = /^\d+$/.test(searchTerm) && searchTerm.length > 0;
    const searchYear = isNumeric ? parseInt(searchTerm, 10) : -1;

    const { loading, error, data, refetch } = useQuery(GET_BOOKS_ADVANCED, {
        variables: { searchTerm, searchYear }
    });

    const [registerUser] = useMutation(REGISTER_USER);

    // POPRAWKA: Wyciągamy 'loading' jako 'isCreating'
    // Dzięki temu wiemy, kiedy trwa wysyłanie danych do serwera
    const [createBookMutation, { loading: isCreating }] = useMutation(CREATE_BOOK, {
        onCompleted: () => {
            refetch();
            setShowAddForm(false);
            alert("Dodano książkę!");
        },
        onError: (err) => alert("Błąd dodawania: " + err.message)
    });

    // Tutaj też wyciągamy stan usuwania, żeby zablokować kosz
    const [deleteBookMutation, { loading: isDeleting }] = useMutation(DELETE_BOOK, {
        onCompleted: () => { refetch(); alert("Usunięto książkę!"); }
    });

    const [borrowBook] = useMutation(BORROW_BOOK, {
        onCompleted: () => { refetch(); alert("Wypożyczono!"); setSelectedBook(null); },
        onError: (err) => alert("Błąd: " + err.message)
    });

    const [returnBook] = useMutation(RETURN_BOOK, {
        onCompleted: () => { refetch(); alert("Zwrócono!"); setSelectedBook(null); },
        onError: (err) => alert("Błąd: " + err.message)
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!usernameInput) return;
        try {
            await registerUser({ variables: { username: usernameInput } }).catch(() => {});
            setCurrentUser(usernameInput);
            alert(`Witaj, ${usernameInput}!`);
        } catch (err) { console.error(err); }
    };

    const handleBorrow = async () => {
        if (!currentUser) return alert("Musisz się zalogować!");
        await borrowBook({ variables: { bookTitle: selectedBook.title, username: currentUser } });
    };

    const handleReturn = async () => {
        await returnBook({ variables: { bookTitle: selectedBook.title, username: currentUser } });
    };

    const handleCreateBook = async (e) => {
        e.preventDefault();
        // Dodatkowe zabezpieczenie: jeśli już wysyłamy, ignoruj kliknięcia
        if (isCreating) return;

        if (!newBook.title || !newBook.author) return alert("Wypełnij tytuł i autora");
        await createBookMutation({
            variables: {
                title: newBook.title,
                year: parseInt(newBook.year) || 2025,
                desc: newBook.desc,
                author: newBook.author,
                genre: newBook.genre || "Inne"
            }
        });
        setNewBook({ title: "", author: "", year: "", genre: "", desc: "" });
    };

    const handleDeleteBook = async (e, title) => {
        e.stopPropagation();
        if (isDeleting) return; // Zabezpieczenie usuwania
        if (!currentUser) return alert("Zaloguj się, aby usuwać!");
        if (window.confirm(`Czy na pewno usunąć książkę "${title}"?`)) {
            await deleteBookMutation({ variables: { title } });
        }
    };

    const isAvailable = (book) => !book.currentBorrower || book.currentBorrower.length === 0;
    const isBorrowedByMe = (book) => book.currentBorrower && book.currentBorrower.some(u => u.username === currentUser);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>

            {/* GÓRNY PASEK */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    style={{ background: '#6c5ce7', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {showAddForm ? '❌ Anuluj dodawanie' : '➕ Dodaj Książkę'}
                </button>

                {currentUser ? (
                    <div style={{ background: '#d1ecf1', color: '#0c5460', padding: '10px 20px', borderRadius: '20px' }}>
                        👤 <strong>{currentUser}</strong>
                        <button onClick={() => setCurrentUser(null)} style={{ marginLeft: '10px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#0c5460' }}>Wyloguj</button>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} style={{ display: 'flex', gap: '5px' }}>
                        <input placeholder="Login" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>Login</button>
                    </form>
                )}
            </div>

            {/* FORMULARZ DODAWANIA */}
            {showAddForm && (
                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '2px solid #6c5ce7' }}>
                    <h3>Nowa Książka</h3>
                    <form onSubmit={handleCreateBook} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input placeholder="Tytuł" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} style={{ padding: '8px' }} required disabled={isCreating} />
                        <input placeholder="Autor" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} style={{ padding: '8px' }} required disabled={isCreating} />
                        <input placeholder="Gatunek" value={newBook.genre} onChange={e => setNewBook({...newBook, genre: e.target.value})} style={{ padding: '8px' }} disabled={isCreating} />
                        <input placeholder="Rok" type="number" value={newBook.year} onChange={e => setNewBook({...newBook, year: e.target.value})} style={{ padding: '8px' }} disabled={isCreating} />
                        <input placeholder="Krótki opis" value={newBook.desc} onChange={e => setNewBook({...newBook, desc: e.target.value})} style={{ gridColumn: '1 / -1', padding: '8px' }} disabled={isCreating} />

                        {/* PRZYCISK ZAPISU - ZMIENIONY */}
                        <button
                            type="submit"
                            disabled={isCreating} // Wyłącza przycisk
                            style={{
                                gridColumn: '1 / -1',
                                padding: '10px',
                                background: isCreating ? '#95a5a6' : '#27ae60', // Zmiana koloru na szary
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: isCreating ? 'not-allowed' : 'pointer' // Kursor zakazu
                            }}
                        >
                            {isCreating ? "⏳ Zapisywanie..." : "💾 Zapisz w Grafie"}
                        </button>
                    </form>
                </div>
            )}

            {/* WYSZUKIWARKA */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: '#2c3e50' }}>🔎 Biblioteka Grafowa</h1>
                <input
                    type="text"
                    placeholder="Szukaj..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '12px 20px', width: '100%', maxWidth: '500px', fontSize: '16px', borderRadius: '25px', border: '2px solid #3498db', outline: 'none' }}
                />
            </div>

            {loading && <p style={{textAlign: 'center'}}>Ładowanie...</p>}
            {error && <p style={{color: 'red', textAlign: 'center'}}>Błąd: {error.message}</p>}

            {/* LISTA KSIĄŻEK */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                {data && data.books.map((book, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedBook(book)}
                        style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', cursor: 'pointer', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'relative' }}
                    >
                        {/* PRZYCISK USUWANIA - TEŻ ZABLOKOWANY PODCZAS AKCJI */}
                        {currentUser && (
                            <button
                                onClick={(e) => handleDeleteBook(e, book.title)}
                                disabled={isDeleting}
                                style={{ position: 'absolute', bottom: '10px', right: '10px', background: isDeleting ? '#ccc' : '#e74c3c', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Usuń książkę"
                            >
                                🗑️
                            </button>
                        )}

                        <div style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', background: isAvailable(book) ? '#d4edda' : '#f8d7da', color: isAvailable(book) ? '#155724' : '#721c24' }}>
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
                            {isAvailable(selectedBook) ? <span style={{ color: 'green', fontWeight: 'bold' }}>Dostępna</span> : <span style={{ color: 'red', fontWeight: 'bold' }}>Wypożyczona</span>}
                            <div style={{ marginTop: '15px' }}>
                                {!currentUser ? <small>Zaloguj się, aby wypożyczyć.</small> : isAvailable(selectedBook) ?
                                    <button onClick={handleBorrow} style={{ width: '100%', background: '#27ae60', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Wypożycz</button> :
                                    isBorrowedByMe(selectedBook) ? <button onClick={handleReturn} style={{ width: '100%', background: '#e67e22', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Zwróć</button> : <span>Niedostępna</span>
                                }
                            </div>
                        </div>
                        <p><strong>Autor:</strong> {selectedBook.author.map(a => a.name).join(', ')}</p>
                        <p><strong>Rok:</strong> {selectedBook.year}</p>
                        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #6c5ce7', marginTop: '20px' }}>
                            <h3 style={{ marginTop: 0, color: '#6c5ce7', fontSize: '1rem' }}>💡 Rekomendacje:</h3>
                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                {selectedBook.recommended.map((rec, i) => <li key={i}><strong>{rec.title}</strong></li>)}
                            </ul>
                        </div>
                        <button onClick={() => setSelectedBook(null)} style={{ width: '100%', padding: '12px', marginTop: '15px', background: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Zamknij</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;