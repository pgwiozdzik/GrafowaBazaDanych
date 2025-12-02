require('dotenv').config();
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const session = driver.session();

const seedQuery = `
    // 1. Użytkownicy
    MERGE (jan:User {username: "JanKowalski"})
    MERGE (anna:User {username: "AnnaNowak"})
    MERGE (tomek:User {username: "TomekZ"})

    // 2. Książki
    MERGE (wiedzmin:Book {title: "Ostatnie Życzenie"}) ON CREATE SET wiedzmin.year = 1993
    MERGE (hobbit:Book {title: "Hobbit"}) ON CREATE SET hobbit.year = 1937
    MERGE (harry:Book {title: "Harry Potter"}) ON CREATE SET harry.year = 1997
    MERGE (cyberiada:Book {title: "Cyberiada"}) ON CREATE SET cyberiada.year = 1965

    // 3. Autorzy i Gatunki (skrótowo)
    MERGE (sapkowski:Author {name: "Andrzej Sapkowski"})-[:WROTE]->(wiedzmin)
    MERGE (tolkien:Author {name: "J.R.R. Tolkien"})-[:WROTE]->(hobbit)
    MERGE (rowling:Author {name: "J.K. Rowling"})-[:WROTE]->(harry)
    MERGE (lem:Author {name: "Stanisław Lem"})-[:WROTE]->(cyberiada)
    
    MERGE (fantasy:Genre {name: "Fantasy"})
    MERGE (wiedzmin)-[:BELONGS_TO]->(fantasy)
    MERGE (hobbit)-[:BELONGS_TO]->(fantasy)
    MERGE (harry)-[:BELONGS_TO]->(fantasy)

    // 4. HISTORIA WYPOŻYCZEŃ (To tworzy rekomendacje!)
    
    // Scenariusz: Jan lubi klasykę fantasy. Przeczytał Wiedźmina i Hobbita.
    MERGE (jan)-[:BORROWED]->(wiedzmin)
    MERGE (jan)-[:BORROWED]->(hobbit)

    // Scenariusz: Anna też przeczytała Wiedźmina, ale też Harry'ego Pottera.
    MERGE (anna)-[:BORROWED]->(wiedzmin)
    MERGE (anna)-[:BORROWED]->(harry)

    // Scenariusz: Tomek przeczytał tylko Cyberiadę.
    MERGE (tomek)-[:BORROWED]->(cyberiada)
    
    // WNIOSEK DLA GRAFU:
    // Jeśli wejdziesz w "Ostatnie Życzenie":
    // - Graf pójdzie do Jana -> Jan czytał też Hobbita -> Poleci Hobbita.
    // - Graf pójdzie do Anny -> Anna czytała Harry'ego -> Poleci Harry'ego.
    // - Graf NIE poleci Cyberiady, bo nikt, kto czytał Wiedźmina, nie czytał Cyberiady.
`;

async function seed() {
    try {
        console.log("🌱 Łączę się z bazą Neo4j Aura...");
        await session.run(seedQuery);
        console.log("✅ Dane i relacje rekomendacji zaktualizowane!");
    } catch (error) {
        console.error("❌ Błąd:", error);
    } finally {
        await session.close();
        await driver.close();
    }
}

seed();