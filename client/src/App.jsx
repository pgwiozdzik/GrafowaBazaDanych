import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
// IMPORTY ROUTERA
import { Routes, Route, Link } from 'react-router-dom';
import Documentation from './Documentation'; // Import podstrony

// --- ZAPYTANIA I MUTACJE (BEZ ZMIAN) ---
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

// --- GŁÓWNY WIDOK BIBLIOTEKI (To co było wcześniej w App) ---
function LibraryView() {
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
    const [createBookMutation, { loading: isCreating }] = useMutation(CREATE_BOOK, {
        onCompleted: () => { refetch(); setShowAddForm(false); alert("Dodano nową pozycję do katalogu."); },
        onError: (err) => alert(err.message)
    });
    const [deleteBookMutation, { loading: isDeleting }] = useMutation(DELETE_BOOK, {
        onCompleted: () => { refetch(); alert("Pozycja została usunięta."); setSelectedBook(null); }
    });
    const [borrowBook] = useMutation(BORROW_BOOK, {
        onCompleted: () => { refetch(); alert("Zarejestrowano wypożyczenie."); setSelectedBook(null); },
        onError: (err) => alert(err.message)
    });
    const [returnBook] = useMutation(RETURN_BOOK, {
        onCompleted: () => { refetch(); alert("Zarejestrowano zwrot."); setSelectedBook(null); },
        onError: (err) => alert(err.message)
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!usernameInput) return;
        try {
            await registerUser({ variables: { username: usernameInput } }).catch(() => {});
            setCurrentUser(usernameInput);
        } catch (err) { console.error(err); }
    };

    const handleBorrow = async () => {
        if (!currentUser) return alert("Wymagane logowanie.");
        await borrowBook({ variables: { bookTitle: selectedBook.title, username: currentUser } });
    };

    const handleReturn = async () => {
        await returnBook({ variables: { bookTitle: selectedBook.title, username: currentUser } });
    };

    const handleCreateBook = async (e) => {
        e.preventDefault();
        if (isCreating) return;
        if (!newBook.title || !newBook.author) return alert("Tytuł i autor są wymagane.");
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

    const handleDeleteBook = async (title) => {
        if (isDeleting) return;
        if (!currentUser) return alert("Wymagane uprawnienia.");
        if (window.confirm(`Czy na pewno usunąć "${title}" z bazy danych?`)) {
            await deleteBookMutation({ variables: { title } });
        }
    };

    const isAvailable = (book) => !book.currentBorrower || book.currentBorrower.length === 0;
    const isBorrowedByMe = (book) => book.currentBorrower && book.currentBorrower.some(u => u.username === currentUser);

    return (
        <div style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', color: '#333', background: '#fdfdfd', minHeight: '100vh' }}>

            {/* HEADER */}
            <header style={{ backgroundColor: '#2c3e50', color: '#ecf0f1', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Piotr Gwioździk</div>
                    <div style={{ color: '#bdc3c7' }}>Przetwarzanie danych w chmurach obliczeniowych • Informatyka Stosowana • 2025</div>
                </div>

                {/* LINK DO DOKUMENTACJI (ROUTER LINK) */}
                <Link
                    to="/docs"
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '13px', border: '1px solid rgba(255,255,255,0.2)', transition: 'background 0.2s' }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                >
                    Dokumentacja Projektu
                </Link>
            </header>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        style={{ background: '#34495e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                    >
                        {showAddForm ? 'Anuluj' : 'Dodaj nową książkę'}
                    </button>

                    {currentUser ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ color: '#7f8c8d' }}>Zalogowany jako: <strong style={{ color: '#2c3e50' }}>{currentUser}</strong></span>
                            <button onClick={() => setCurrentUser(null)} style={{ background: 'transparent', border: '1px solid #bdc3c7', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', color: '#7f8c8d', fontSize: '12px' }}>Wyloguj</button>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} style={{ display: 'flex', gap: '10px' }}>
                            <input placeholder="Nazwa użytkownika" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #bdc3c7', fontSize: '14px' }} />
                            <button type="submit" style={{ background: '#27ae60', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Zaloguj</button>
                        </form>
                    )}
                </div>

                {showAddForm && (
                    <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px', marginBottom: '40px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#2c3e50' }}>Dodaj nową pozycję</h3>
                        <form onSubmit={handleCreateBook} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontSize: '12px', marginBottom: '5px', color: '#7f8c8d' }}>Tytuł</label>
                                <input value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} style={{ padding: '10px', border: '1px solid #dfe6e9', borderRadius: '4px' }} required disabled={isCreating} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontSize: '12px', marginBottom: '5px', color: '#7f8c8d' }}>Autor</label>
                                <input value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} style={{ padding: '10px', border: '1px solid #dfe6e9', borderRadius: '4px' }} required disabled={isCreating} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontSize: '12px', marginBottom: '5px', color: '#7f8c8d' }}>Gatunek</label>
                                <input value={newBook.genre} onChange={e => setNewBook({...newBook, genre: e.target.value})} style={{ padding: '10px', border: '1px solid #dfe6e9', borderRadius: '4px' }} disabled={isCreating} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontSize: '12px', marginBottom: '5px', color: '#7f8c8d' }}>Rok wydania</label>
                                <input type="number" value={newBook.year} onChange={e => setNewBook({...newBook, year: e.target.value})} style={{ padding: '10px', border: '1px solid #dfe6e9', borderRadius: '4px' }} disabled={isCreating} />
                            </div>
                            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontSize: '12px', marginBottom: '5px', color: '#7f8c8d' }}>Opis</label>
                                <input value={newBook.desc} onChange={e => setNewBook({...newBook, desc: e.target.value})} style={{ padding: '10px', border: '1px solid #dfe6e9', borderRadius: '4px' }} disabled={isCreating} />
                            </div>

                            <button
                                type="submit"
                                disabled={isCreating}
                                style={{ gridColumn: '1 / -1', padding: '12px', background: isCreating ? '#bdc3c7' : '#2980b9', color: 'white', border: 'none', borderRadius: '4px', cursor: isCreating ? 'not-allowed' : 'pointer', fontWeight: 'bold', marginTop: '10px' }}
                            >
                                {isCreating ? "Przetwarzanie..." : "Zapisz w bazie"}
                            </button>
                        </form>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h1 style={{ color: '#2c3e50', fontSize: '32px', marginBottom: '10px' }}>Katalog Biblioteczny</h1>
                    <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>Przeszukuj zasoby bazy grafowej</p>
                    <input
                        type="text"
                        placeholder="Szukaj po tytule, autorze, gatunku lub roku..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '15px 25px', width: '100%', maxWidth: '600px', fontSize: '16px', borderRadius: '30px', border: '1px solid #dfe6e9', outline: 'none', boxShadow: '0 2px 15px rgba(0,0,0,0.05)' }}
                    />
                </div>

                {loading && <p style={{textAlign: 'center', color: '#7f8c8d'}}>Pobieranie danych...</p>}
                {error && <p style={{color: '#c0392b', textAlign: 'center'}}>Błąd systemu: {error.message}</p>}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
                    {data && data.books.map((book, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedBook(book)}
                            style={{
                                border: '1px solid #eee',
                                borderRadius: '8px',
                                padding: '25px',
                                cursor: 'pointer',
                                background: 'white',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                                position: 'relative',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.02)'; }}
                        >
                            <div style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                borderRadius: '15px',
                                fontSize: '11px',
                                fontWeight: '600',
                                marginBottom: '15px',
                                background: isAvailable(book) ? '#e6fff0' : '#fff0f0',
                                color: isAvailable(book) ? '#27ae60' : '#c0392b',
                                border: `1px solid ${isAvailable(book) ? '#b8e6ca' : '#fadbd8'}`
                            }}>
                                {isAvailable(book) ? 'DOSTĘPNA' : 'WYPOŻYCZONA'}
                            </div>
                            <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '18px' }}>{book.title}</h3>
                            <p style={{ margin: '0 0 5px 0', color: '#34495e', fontSize: '14px' }}>{book.author.map(a => a.name).join(', ')}</p>
                            <p style={{ margin: '0', color: '#95a5a6', fontSize: '13px' }}>{book.year}</p>
                        </div>
                    ))}
                </div>

                {selectedBook && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' }} onClick={() => setSelectedBook(null)}>
                        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', maxWidth: '600px', width: '90%', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                            <button onClick={() => setSelectedBook(null)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'transparent', fontSize: '24px', cursor: 'pointer', color: '#95a5a6' }}>&times;</button>

                            <h2 style={{ marginTop: 0, marginBottom: '5px', color: '#2c3e50' }}>{selectedBook.title}</h2>
                            <p style={{ marginTop: 0, color: '#7f8c8d' }}>{selectedBook.author.map(a => a.name).join(', ')}, {selectedBook.year}</p>

                            <div style={{ margin: '30px 0', padding: '25px', background: isAvailable(selectedBook) ? '#f0fdf4' : '#fff5f5', borderRadius: '8px', border: `1px solid ${isAvailable(selectedBook) ? '#dcfce7' : '#fee2e2'}` }}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                                    <span style={{ fontSize: '14px', color: '#555' }}>Status pozycji:</span>
                                    {isAvailable(selectedBook)
                                        ? <span style={{ color: '#16a085', fontWeight: 'bold' }}>Dostępna</span>
                                        : <span style={{ color: '#c0392b', fontWeight: 'bold' }}>Wypożyczona</span>
                                    }
                                </div>

                                {!isAvailable(selectedBook) && (
                                    <div style={{ marginBottom: '15px', fontSize: '13px', color: '#c0392b' }}>
                                        Obecnie u użytkownika: <strong>{selectedBook.currentBorrower[0]?.username}</strong>
                                    </div>
                                )}

                                <div>
                                    {!currentUser ? (
                                        <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.5)', borderRadius: '4px', fontSize: '13px', color: '#7f8c8d' }}>Zaloguj się, aby zarządzać wypożyczeniem.</div>
                                    ) : isAvailable(selectedBook) ? (
                                        <button onClick={handleBorrow} style={{ width: '100%', background: '#27ae60', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                                            Wypożycz
                                        </button>
                                    ) : isBorrowedByMe(selectedBook) ? (
                                        <button onClick={handleReturn} style={{ width: '100%', background: '#e67e22', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                                            Zwróć do biblioteki
                                        </button>
                                    ) : (
                                        <button disabled style={{ width: '100%', background: '#bdc3c7', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'not-allowed', fontWeight: 'bold', fontSize: '14px' }}>
                                            Niedostępna
                                        </button>
                                    )}
                                </div>
                            </div>

                            <p style={{ lineHeight: '1.6', color: '#34495e', fontSize: '15px' }}>{selectedBook.description || "Brak opisu dla tej pozycji."}</p>

                            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #9b59b6', marginTop: '30px' }}>
                                <h4 style={{ marginTop: 0, marginBottom: '10px', color: '#8e44ad' }}>Rekomendacje czytelnicze</h4>
                                {selectedBook.recommended.length === 0 ? (
                                    <p style={{ fontSize: '13px', color: '#95a5a6', margin: 0 }}>Brak danych do wygenerowania rekomendacji.</p>
                                ) : (
                                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                        {selectedBook.recommended.map((rec, i) => (
                                            <li key={i} style={{ marginBottom: '5px', color: '#34495e', fontSize: '14px' }}>{rec.title}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div style={{ marginTop: '30px' }}>
                                <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>Recenzje czytelników</h4>
                                {selectedBook.reviews.length === 0 ? (
                                    <p style={{ fontStyle: 'italic', color: '#95a5a6', fontSize: '14px' }}>Brak recenzji.</p>
                                ) : (
                                    <ul style={{ listStyle: 'none', padding: 0, maxHeight: '150px', overflowY: 'auto' }}>
                                        {selectedBook.reviews.map((rev, i) => (
                                            <li key={i} style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                                <div style={{display:'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '5px'}}>
                                                    <span>{rev.authorName}</span>
                                                    <span style={{color: '#f1c40f'}}>Ocena: {rev.rating}/5</span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>{rev.text}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                                <button onClick={() => setSelectedBook(null)} style={{ flex: 1, padding: '12px', background: 'transparent', color: '#34495e', border: '1px solid #bdc3c7', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Zamknij</button>

                                {currentUser && (
                                    <button
                                        onClick={() => handleDeleteBook(selectedBook.title)}
                                        disabled={isDeleting}
                                        style={{ flex: 1, background: isDeleting ? '#fab1a0' : '#e74c3c', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: isDeleting ? 'not-allowed' : 'pointer', fontWeight: '600' }}
                                    >
                                        {isDeleting ? "Usuwanie..." : "Usuń pozycję"}
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- KOMPONENT APP Z ROUTINGIEM ---
function App() {
    return (
        <Routes>
            <Route path="/" element={<LibraryView />} />
            <Route path="/docs" element={<Documentation />} />
        </Routes>
    );
}

export default App;