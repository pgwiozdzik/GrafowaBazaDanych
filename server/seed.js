require('dotenv').config();
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const session = driver.session();

const seedQuery = `
    MERGE (jan:User {username: "JanKowalski"})
    MERGE (anna:User {username: "AnnaNowak"})
    MERGE (tomek:User {username: "TomekZ"})
    MERGE (kasia:User {username: "KasiaW"})
    MERGE (piotr:User {username: "PiotrG"})

    MERGE (wiedzmin:Book {title: "Ostatnie Życzenie"}) 
    SET wiedzmin.year = 1993, wiedzmin.description = "Zbiór opowiadań wprowadzający w świat Wiedźmina Geralta z Rivii."
    
    MERGE (krew:Book {title: "Krew Elfów"}) 
    SET krew.year = 1994, krew.description = "Pierwsza część sagi o Wiedźminie. Ciri rozpoczyna szkolenie w Kaer Morhen."

    MERGE (hobbit:Book {title: "Hobbit"}) 
    SET hobbit.year = 1937, hobbit.description = "Opowieść o podróży Bilbo Bagginsa w celu odzyskania skarbu strzeżonego przez smoka."

    MERGE (wladca:Book {title: "Władca Pierścieni: Drużyna Pierścienia"}) 
    SET wladca.year = 1954, wladca.description = "Epicka powieść o walce dobra ze złem w Śródziemiu i wyprawie z Jedynym Pierścieniem."

    MERGE (harry:Book {title: "Harry Potter i Kamień Filozoficzny"}) 
    SET harry.year = 1997, harry.description = "Początek przygód młodego czarodzieja, który trafia do Szkoły Magii i Czarodziejstwa w Hogwarcie."

    MERGE (cyberiada:Book {title: "Cyberiada"}) 
    SET cyberiada.year = 1965, cyberiada.description = "Humorystyczne opowiadania o robotach konstruktorach: Trurlu i Klapaucjuszu."

    MERGE (solaris:Book {title: "Solaris"}) 
    SET solaris.year = 1961, solaris.description = "Najsłynniejsze dzieło Lema o kontakcie z obcą inteligencją na stacji kosmicznej."

    MERGE (diuna:Book {title: "Diuna"}) 
    SET diuna.year = 1965, diuna.description = "Saga o polityce, religii i ekologii na pustynnej planecie Arrakis."

    MERGE (zbrodnia:Book {title: "Zbrodnia i kara"}) 
    SET zbrodnia.year = 1866, zbrodnia.description = "Psychologiczne studium morderstwa i odkupienia win w XIX-wiecznym Petersburgu."

    MERGE (lalka:Book {title: "Lalka"}) 
    SET lalka.year = 1890, lalka.description = "Realistyczna powieść o miłości Stanisława Wokulskiego do Izabeli Łęckiej na tle Warszawy."

    MERGE (sapkowski:Author {name: "Andrzej Sapkowski"})
    MERGE (tolkien:Author {name: "J.R.R. Tolkien"})
    MERGE (rowling:Author {name: "J.K. Rowling"})
    MERGE (lem:Author {name: "Stanisław Lem"})
    MERGE (herbert:Author {name: "Frank Herbert"})
    MERGE (dostojewski:Author {name: "Fiodor Dostojewski"})
    MERGE (prus:Author {name: "Bolesław Prus"})

    MERGE (sapkowski)-[:WROTE]->(wiedzmin)
    MERGE (sapkowski)-[:WROTE]->(krew)
    MERGE (tolkien)-[:WROTE]->(hobbit)
    MERGE (tolkien)-[:WROTE]->(wladca)
    MERGE (rowling)-[:WROTE]->(harry)
    MERGE (lem)-[:WROTE]->(cyberiada)
    MERGE (lem)-[:WROTE]->(solaris)
    MERGE (herbert)-[:WROTE]->(diuna)
    MERGE (dostojewski)-[:WROTE]->(zbrodnia)
    MERGE (prus)-[:WROTE]->(lalka)
    
    MERGE (fantasy:Genre {name: "Fantasy"})
    MERGE (scifi:Genre {name: "Sci-Fi"})
    MERGE (klasyka:Genre {name: "Klasyka"})

    MERGE (wiedzmin)-[:BELONGS_TO]->(fantasy)
    MERGE (krew)-[:BELONGS_TO]->(fantasy)
    MERGE (hobbit)-[:BELONGS_TO]->(fantasy)
    MERGE (wladca)-[:BELONGS_TO]->(fantasy)
    MERGE (harry)-[:BELONGS_TO]->(fantasy)
    MERGE (cyberiada)-[:BELONGS_TO]->(scifi)
    MERGE (solaris)-[:BELONGS_TO]->(scifi)
    MERGE (diuna)-[:BELONGS_TO]->(scifi)
    MERGE (zbrodnia)-[:BELONGS_TO]->(klasyka)
    MERGE (lalka)-[:BELONGS_TO]->(klasyka)

    MERGE (jan)-[:BORROWED]->(wiedzmin)
    MERGE (jan)-[:BORROWED]->(krew)
    MERGE (jan)-[:BORROWED]->(hobbit)

    MERGE (anna)-[:BORROWED]->(harry)
    MERGE (anna)-[:BORROWED]->(hobbit)
    MERGE (anna)-[:BORROWED]->(wladca)

    MERGE (tomek)-[:BORROWED]->(cyberiada)
    MERGE (tomek)-[:BORROWED]->(solaris)
    MERGE (tomek)-[:BORROWED]->(diuna)

    MERGE (kasia)-[:BORROWED]->(zbrodnia)
    MERGE (kasia)-[:BORROWED]->(lalka)
    MERGE (kasia)-[:BORROWED]->(wiedzmin)

    MERGE (piotr)-[:BORROWED]->(diuna)
    MERGE (piotr)-[:BORROWED]->(wladca)
`;

async function seed() {
    try {
        console.log("Database connection established");
        await session.run(seedQuery);
        console.log("Data seeded successfully");
    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        await session.close();
        await driver.close();
    }
}

seed();