require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const { Neo4jGraphQL } = require('@neo4j/graphql');
const neo4j = require('neo4j-driver');

// 1. Definicja Modelu
// ZMIANA: Dodano "@node" do każdego typu, aby naprawić błąd w nowej wersji biblioteki

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
    
    author: [Author!]! @relationship(type: "WROTE", direction: IN)
    genres: [Genre!]! @relationship(type: "BELONGS_TO", direction: OUT)
    reviews: [Review!]! @relationship(type: "HAS_REVIEW", direction: IN)
    currentBorrower: [User!]! @relationship(type: "BORROWED", direction: IN)

    # --- NOWOŚĆ: LOGIKA GRAFOWA ---
    # To pole wykonuje analizę grafu w czasie rzeczywistym!
    # Szukamy użytkowników, którzy wypożyczyli TĘ książkę, a potem sprawdzamy, co JESZCZE czytali.
    recommended: [Book!]! @cypher(statement: """
      MATCH (this)<-[:BORROWED]-(u:User)-[:BORROWED]->(other:Book)
      WHERE other <> this
      RETURN other
      LIMIT 3
    """)
  }
`;


const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

async function startServer() {
    try {
        const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
        const schema = await neoSchema.getSchema();

        const server = new ApolloServer({
            schema,
            cache: "bounded",
            // NAPRAWA CORS:
            cors: {
                origin: "*",      // Pozwól każdemu
                credentials: false // Wyłącz credentials (to naprawi konflikt z gwiazdką)
            }
        });

        const port = process.env.PORT || 3000;
        const { url } = await server.listen({ port });
        console.log(`🚀 Serwer gotowy pod adresem ${url}`);

    } catch (error) {
        console.error("❌ BŁĄD KRYTYCZNY STARTU SERWERA:", error);
    }
}

startServer();