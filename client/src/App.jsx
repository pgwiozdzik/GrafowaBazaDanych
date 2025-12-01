import { useQuery, gql } from '@apollo/client';

// Zapytanie GraphQL - to tu dzieje się magia grafowa
const GET_BOOKS = gql`
  query GetBooks {
    books {
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

function App() {
    const { loading, error, data } = useQuery(GET_BOOKS);

    if (loading) return <p>Ładowanie danych...</p>;
    if (error) return <p style={{color: 'red'}}>Błąd: {error.message}</p>;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>📚 Biblioteka PoC (Neo4j + GraphQL)</h1>
            {data.books.length === 0 && <p>Brak książek w bazie.</p>}

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {data.books.map((book, index) => (
                    <div key={index} style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '16px',
                        width: '250px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>{book.title}</h2>
                        <p>📅 Rok: {book.year}</p>

                        <p><strong>✍️ Autor:</strong><br/>
                            {book.author.map(a => a.name).join(', ')}
                        </p>

                        <div style={{ marginTop: '10px' }}>
                            {book.genres.map(g => (
                                <span key={g.name} style={{
                                    background: '#e0f2f1',
                                    color: '#00695c',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    marginRight: '5px'
                                }}>
                  {g.name}
                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;