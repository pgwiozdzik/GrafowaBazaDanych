require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const { Neo4jGraphQL } = require('@neo4j/graphql');
const neo4j = require('neo4j-driver');

// 1. Definicja Modelu (Schema)
const typeDefs = `
  type User @node {
    username: String!
    borrowedBooks: [Book!]! @relationship(type: "BORROWED", direction: OUT)
  }

  type Review @node {
    rating: Int!
    text: String
    authorName: String
    book: [Book!]! @relationship(type: "HAS_REVIEW", direction: OUT)
  }

  type Author @node {
    name: String!
    books: [Book!]! @relationship(type: "WROTE", direction: OUT)
  }

  type Genre @node {
    name: String!
    books: [Book!]! @relationship(type: "BELONGS_TO", direction: IN)
  }

  type Book @node {
    title: String!
    year: Int
    isbn: String
    description: String
    
    # Relacje
    author: [Author!]! @relationship(type: "WROTE", direction: IN)
    genres: [Genre!]! @relationship(type: "BELONGS_TO", direction: OUT)
    reviews: [Review!]! @relationship(type: "HAS_REVIEW", direction: IN)
    
    # Kto wypożyczył (lista, bo biblioteka tego wymaga)
    currentBorrower: [User!]! @relationship(type: "BORROWED", direction: IN)

    # --- REKOMENDACJE (Logika Grafowa) ---
    # Zapytanie Cypher w jednej linii, żeby uniknąć błędów formatowania
    recommended: [Book!]! @cypher(statement: "MATCH (this)<-[:BORROWED]-(u:User)-[:BORROWED]->(other:Book) WHERE other <> this RETURN other LIMIT 3")
  }
`;

// 2. Konfiguracja połączenia z Neo4j
// Używamy tylko URI i Auth, bo 'neo4j+s' w .env samo włącza szyfrowanie
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

async function startServer() {
    try {
        const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

        // Czekamy na wygenerowanie schematu
        const schema = await neoSchema.getSchema();

        // 3. Start Serwera Apollo
        const server = new ApolloServer({
            schema,
            cache: "bounded", // Zabezpieczenie pamięci
            // Prosty CORS - pozwala wszystkim
            cors: true
        });

        const port = process.env.PORT || 3000;
        const { url } = await server.listen({ port });
        console.log(`🚀 Serwer gotowy pod adresem ${url}`);

    } catch (error) {
        console.error("❌ BŁĄD KRYTYCZNY STARTU SERWERA:");
        // Wypisujemy dokładny błąd, żeby wiedzieć co poszło nie tak
        console.error(JSON.stringify(error, null, 2));
    }
}

startServer();