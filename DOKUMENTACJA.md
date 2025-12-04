# Dokumentacja Techniczna
**Projekt zaliczeniowy: System biblioteczny oparty na grafowej bazie danych Neo4j**

---

## Spis treści
1. [Cel i zakres projektu](#1-cel-i-zakres-projektu)
2. [Architektura systemu i wdrożenie](#2-architektura-systemu-i-wdrożenie)
3. [Model danych (Graf)](#3-model-danych-graf)
4. [Specyfikacja funkcjonalna](#4-specyfikacja-funkcjonalna)
5. [Stos technologiczny (GRAND Stack)](#5-stos-technologiczny-grand-stack)
6. [Instrukcja obsługi systemu](#6-instrukcja-obsługi-systemu)

---

## 1. Cel i zakres projektu

Przedmiotem projektu jest implementacja aplikacji internetowej typu *Proof of Concept* (PoC), demonstrującej praktyczne zastosowanie grafowych baz danych w systemach informatycznych. 

Głównym celem było odejście od relacyjnego modelu danych na rzecz struktury węzłów i krawędzi, co pozwala na efektywniejsze modelowanie złożonych relacji (m.in. systemów rekomendacji) oraz elastyczne zarządzanie schematem danych. Aplikacja symuluje działanie nowoczesnego systemu bibliotecznego z funkcjami społecznościowymi.

---

## 2. Architektura systemu i wdrożenie

System został zaprojektowany w architekturze klient-serwer, wykorzystując model chmurowy (Cloud Computing). Komunikacja między warstwami odbywa się za pośrednictwem protokołu HTTP/HTTPS z wykorzystaniem języka zapytań GraphQL.

![Diagram Wdrożenia](client/src/assets/wdrozenie.png)
*Rys. 1. Diagram wdrożenia w architekturze chmurowej (Railway + Neo4j AuraDB).*

### Komponenty systemu:
* **Warstwa Klienta (Frontend):** Aplikacja SPA (Single Page Application) zbudowana w oparciu o bibliotekę React. Odpowiada za interakcję z użytkownikiem i dynamiczne renderowanie widoków bez przeładowywania strony. Hosting plików statycznych realizowany jest przez platformę Railway.
* **Warstwa Aplikacji (Backend):** Serwer Node.js zintegrowany z Apollo Server. Pełni rolę pośrednika (API Gateway), tłumacząc zapytania GraphQL na zapytania bazodanowe Cypher. Zapewnia walidację danych i obsługę błędów.
* **Warstwa Danych (Database):** Neo4j AuraDB – grafowa baza danych działająca w modelu DBaaS (Database as a Service). Przechowuje strukturę węzłów i relacji. Komunikacja z backendem odbywa się przez szyfrowany protokół Bolt+s.

---

## 3. Model danych (Graf)

W przeciwieństwie do systemów RDBMS, projekt nie wykorzystuje tabel ani kluczy obcych. Dane modelowane są jako graf skierowany, składający się z węzłów (Nodes) oraz relacji (Relationships).

![Diagram Modelu Danych](client/src/assets/model.png)
*Rys. 2. Schemat logiczny bazy danych. Widoczne typy węzłów oraz kierunki relacji.*

### Kluczowe elementy modelu:
* **Węzły:** `Book` (Książka), `Author` (Autor), `Genre` (Gatunek), `User` (Użytkownik), `Review` (Recenzja).
* **Relacja `:BORROWED`:** Określa stan wypożyczenia. Istnienie krawędzi między użytkownikiem a książką oznacza, że dany egzemplarz jest niedostępny. Usunięcie krawędzi jest równoznaczne ze zwrotem książki.
* **Relacja `:WROTE` oraz `:BELONGS_TO`:** Definiują metadane książki, umożliwiając nawigację po grafie (np. znalezienie wszystkich książek danego autora).
* **Relacja `:HAS_REVIEW`:** Łączy książkę z opiniami użytkowników.

---

## 4. Specyfikacja funkcjonalna

System realizuje funkcjonalności podzielone według ról aktorów: Gościa (użytkownik niezalogowany) oraz Użytkownika (zalogowany czytelnik/administrator).

![Diagram Przypadków Użycia](client/src/assets/przypadki.png)
*Rys. 3. Diagram przypadków użycia (UML Use Case Diagram).*

### Szczegółowy opis funkcji:

1.  **Zaawansowane wyszukiwanie (Full-Text Search):** Implementacja filtrowania hybrydowego (operator logiczny OR) umożliwia jednoczesne przeszukiwanie zasobów po tytule, autorze, gatunku lub roku wydania w jednym pasku wyszukiwania.
2.  **System Rekomendacji (Collaborative Filtering):** Aplikacja wykorzystuje algorytm grafowy zaimplementowany w języku Cypher. System analizuje ścieżki w grafie: `(Book)<-[:BORROWED]-(User)-[:BORROWED]->(OtherBook)`, aby sugerować pozycje wypożyczane przez użytkowników o podobnych preferencjach.
3.  **Zarządzanie zasobami (CRUD):**
    * Dodawanie książek z automatyczną deduplikacją autorów i gatunków (użycie mutacji `connectOrCreate`).
    * Kaskadowe usuwanie węzłów wraz z przyległymi relacjami (sprzątanie grafu).
4.  **Obsługa wypożyczeń:** Transakcyjne tworzenie i usuwanie krawędzi `:BORROWED` w grafie, co natychmiast zmienia status dostępności zasobu dla wszystkich użytkowników.

---

## 5. Stos technologiczny (GRAND Stack)

Projekt został zrealizowany przy użyciu zestawu technologii GRAND (GraphQL, React, Apollo, Neo4j Database), co zapewnia wysoką skalowalność i elastyczność.

| Warstwa | Technologia | Opis zastosowania |
| :--- | :--- | :--- |
| **API / Query Language** | GraphQL | Umożliwia deklaratywne pobieranie danych, eliminując zjawiska *over-fetching* i *under-fetching*. Stanowi kontrakt między frontendem a backendem. |
| **Frontend** | React (Vite) | Biblioteka JavaScript do budowy interfejsów użytkownika w modelu komponentowym. Zapewnia responsywność aplikacji (SPA). |
| **Backend** | Apollo Server | Serwer GraphQL obsługujący żądania, autoryzację oraz integrację z bazą danych poprzez bibliotekę `@neo4j/graphql`. |
| **Baza Danych** | Neo4j AuraDB | Bezserwerowa, natywna baza grafowa dostępna w chmurze. Obsługuje protokół Bolt+s (szyfrowany). |

### Przykład definicji schematu (GraphQL Schema):

Poniższy kod definiuje strukturę węzła Książki oraz logikę rekomendacji obliczaną po stronie bazy (dyrektywa `@cypher`):

```graphql
type Book @node {
  title: String!
  year: Int
  
  # Relacje zdefiniowane za pomocą dyrektywy @relationship
  author: [Author!]! @relationship(type: "WROTE", direction: IN)
  genres: [Genre!]! @relationship(type: "BELONGS_TO", direction: OUT)
  
  # Pole obliczane dynamicznie (Cypher Query)
  # Wyszukuje książki powiązane przez wspólnych czytelników
  recommended: [Book!]! @cypher(
    statement: """
      MATCH (this)<-[:BORROWED]-(u:User)-[:BORROWED]->(other:Book)
      WHERE other <> this
      RETURN other LIMIT 3
    """,
    columnName: "other"
  )
}
```
## 6. Instrukcja obsługi systemu

Poniższa instrukcja opisuje kroki niezbędne do realizacji kluczowych scenariuszy użycia w aplikacji.

### 6.1. Logowanie i Rejestracja
W systemie PoC zastosowano uproszczony model autoryzacji.
1.  W prawym górnym rogu ekranu zlokalizuj pole **"Nazwa użytkownika"**.
2.  Wpisz dowolny identyfikator (np. swoje imię).
3.  Kliknij przycisk **"Zaloguj"**.
4.  Spowoduje to utworzenie węzła Użytkownika w grafie (jeśli nie istnieje) lub zalogowanie do istniejącego konta. Od tego momentu system rozpoznaje Cię jako aktywnego użytkownika.

### 6.2. Wyszukiwanie zasobów
1.  Skorzystaj z paska wyszukiwania w centralnej części ekranu.
2.  Wpisz szukaną frazę (np. *"Sapkowski"*, *"Fantasy"* lub *"1993"*).
3.  System automatycznie przefiltruje widoczne zasoby, przeszukując jednocześnie węzły typu Książka, Autor oraz Gatunek (logika `OR`).

### 6.3. Wypożyczanie i zwrot książek
1.  Zaloguj się do systemu.
2.  Kliknij na kafel wybranej książki, aby otworzyć okno szczegółów (Modal).
3.  Sprawdź sekcję statusu:
    * Jeśli status to **Dostępna** (kolor zielony), kliknij przycisk **"Wypożycz"**. System utworzy relację `:BORROWED` w bazie danych, a status zmieni się na **Wypożyczona** (kolor czerwony).
    * Jeśli książkę wypożyczyłeś Ty, zobaczysz przycisk **"Zwróć"**. Kliknięcie go usunie relację i przywróci dostępność książki.

### 6.4. Dodawanie nowych pozycji (CRUD)
1.  Kliknij przycisk **"Dodaj nową książkę"** w lewym górnym rogu.
2.  Wypełnij formularz (Tytuł, Autor, Gatunek, Rok, Opis).
3.  Zatwierdź przyciskiem **"Zapisz w bazie"**.
    * *Uwaga: Jeśli podany Autor lub Gatunek już istnieje w grafie, system nie utworzy duplikatu węzła, lecz połączy nową książkę z istniejącym węzłem (zastosowanie mutacji `connectOrCreate`).*

### 6.5. Usuwanie pozycji
1.  Upewnij się, że jesteś zalogowany.
2.  Otwórz szczegóły książki, którą chcesz usunąć (klikając w jej kafel).
3.  Na dole okna kliknij czerwony przycisk **"Usuń tę książkę (Admin)"**.
4.  Potwierdź operację w oknie dialogowym przeglądarki. Książka oraz jej wszystkie powiązania (relacje do autorów, wypożyczeń, recenzji) zostaną trwale usunięte z grafu.