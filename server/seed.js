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

    // 2. Książki i Autorzy (tworzymy zmienne wiedzmin i hobbit)
    MERGE (wiedzmin:Book {title: "Ostatnie Życzenie"})
    ON CREATE SET wiedzmin.year = 1993
    
    MERGE (hobbit:Book {title: "Hobbit"})
    ON CREATE SET hobbit.year = 1937

    MERGE (sapkowski:Author {name: "Andrzej Sapkowski"})
    MERGE (sapkowski)-[:WROTE]->(wiedzmin)
    
    MERGE (tolkien:Author {name: "J.R.R. Tolkien"})
    MERGE (tolkien)-[:WROTE]->(hobbit)

    // 3. Recenzje
    // POPRAWKA: Przekazujemy DALEJ obie zmienne (wiedzmin ORAZ hobbit)
    // Dzięki temu 'hobbit' nie zniknie z pamięci.
    WITH wiedzmin, hobbit
    
    MERGE (recenzja1:Review {authorName: "Krytyk123", bookTitle: "Ostatnie Życzenie"})
    SET recenzja1.rating = 5, 
        recenzja1.text = "Fantastyczna książka, polecam każdemu!"
    MERGE (recenzja1)-[:HAS_REVIEW]->(wiedzmin)

    // 4. Wypożyczenie
    // Teraz 'hobbit' jest nadal dostępny, bo przekazaliśmy go wyżej
    WITH hobbit
    MATCH (jan:User {username: "JanKowalski"})
    MERGE (jan)-[:BORROWED]->(hobbit)
`;

async function seed() {
    try {
        console.log("🌱 Łączę się z bazą Neo4j Aura...");
        await session.run(seedQuery);
        console.log("✅ Dane zostały zaktualizowane pomyślnie!");
    } catch (error) {
        console.error("❌ Błąd podczas seedowania:", error);
    } finally {
        await session.close();
        await driver.close();
    }
}

seed();