require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const { Neo4jGraphQL } = require('@neo4j/graphql');
const neo4j = require('neo4j-driver');

// 1. Definicja Modelu
// ZMIANA: Dodano "@node" do każdego typu, aby naprawić błąd w nowej wersji biblioteki
const typeDefs = `
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
    author: [Author!]! @relationship(type: "WROTE", direction: IN)
    genres: [Genre!]! @relationship(type: "BELONGS_TO", direction: OUT)
  }
`;

// 2. Konfiguracja połączenia
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// Funkcja startująca serwer
async function startServer() {
    try {
        const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
        const schema = await neoSchema.getSchema();

        // ZMIANA TUTAJ: Dodajemy konfigurację CORS
        const server = new ApolloServer({
            schema,
            cors: {
                origin: "*",        // Pozwól na dostęp zewsząd
                credentials: true   // Pozwól na przesyłanie nagłówków
            }
        });

        const port = process.env.PORT || 3000;
        const { url } = await server.listen({ port });
        console.log(`🚀 Serwer gotowy pod adresem ${url}`);

    } catch (error) {
        console.error("❌ BŁĄD KRYTYCZNY STARTU SERWERA:");
        if (Array.isArray(error)) {
            error.forEach((e, index) => {
                console.error(`Błąd #${index + 1}:`, JSON.stringify(e, null, 2));
            });
        } else {
            console.error(JSON.stringify(error, null, 2));
        }
    }
}

startServer();