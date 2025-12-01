require('dotenv').config();
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const session = driver.session();

const seedQuery = `
    // Opcjonalnie: Wyczyść bazę przed dodaniem (odkomentuj jeśli chcesz resetować)
    // MATCH (n) DETACH DELETE n;

    CREATE (sapkowski:Author {name: "Andrzej Sapkowski"})
    CREATE (tolkien:Author {name: "J.R.R. Tolkien"})

    CREATE (wiedzmin:Book {title: "Ostatnie Życzenie", year: 1993})
    CREATE (krew:Book {title: "Krew Elfów", year: 1994})
    CREATE (hobbit:Book {title: "Hobbit", year: 1937})

    CREATE (fantasy:Genre {name: "Fantasy"})
    CREATE (przygoda:Genre {name: "Przygoda"})

    // KRAWĘDZIE
    CREATE (sapkowski)-[:WROTE]->(wiedzmin)
    CREATE (sapkowski)-[:WROTE]->(krew)
    CREATE (tolkien)-[:WROTE]->(hobbit)

    CREATE (wiedzmin)-[:BELONGS_TO]->(fantasy)
    CREATE (krew)-[:BELONGS_TO]->(fantasy)
    CREATE (hobbit)-[:BELONGS_TO]->(fantasy)
    CREATE (hobbit)-[:BELONGS_TO]->(przygoda)
`;

async function seed() {
    try {
        console.log("🌱 Rozpoczynam dodawanie danych...");
        await session.run(seedQuery);
        console.log("✅ Dane zostały dodane pomyślnie!");
    } catch (error) {
        console.error("❌ Błąd podczas dodawania danych:", error);
    } finally {
        await session.close();
        await driver.close();
    }
}

seed();