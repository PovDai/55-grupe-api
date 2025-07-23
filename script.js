// Gauname reikiamus DOM elementus:
// - Lentelę, kurioje bus rodomos knygos
// - Įkrovimo indikatorių
// - Pagrindinę lentelės struktūrą
const kingBooksEl = document.getElementById("king-books");
const loaderEl = document.getElementById("loader");
const tableEl = document.getElementById("table");

// Sukuriame modalinį langą, kuris bus naudojamas antagonistų informacijos rodymui
const modalWindow = document.createElement("div");
modalWindow.id = "modal"; // Suteikiame modalui ID

// Sukuriame mygtuką modalinio lango uždarymui
const closeBtn = document.createElement("div");
closeBtn.classList.add("close-modal"); // Pridedame CSS klasę
closeBtn.textContent = "x"; // Uždarymo mygtuko tekstas

// Sukuriame turinio konteinerį modalui
const contentEl = document.createElement("div");
contentEl.classList.add("api-content"); // Pridedame CSS klasę

// Sudedame modalų elementus kartu
modalWindow.appendChild(closeBtn);
modalWindow.appendChild(contentEl);

// Pradžioje rodome įkrovimo indikatorių ir paslepiam lentelę
tableEl.classList.add("hide");
loaderEl.classList.add("show");

// Gauname Stephen King knygų duomenis iš API
fetch("https://stephen-king-api.onrender.com/api/books")
  .then((resp) => resp.json()) // Konvertuojame atsakymą į JSON formatą
  .then((data) => {
    // Kai duomenys gauti:
    loaderEl.classList.remove("show"); // Paslepiam įkrovimo indikatorių
    tableEl.classList.remove("hide"); // Rodome lentelę
    
    // Kiekvienai knygai sukuriam lentelės eilutę
    data.data.forEach((book) => {
      kingBooksEl.insertAdjacentHTML(
        "beforeend", // Įterpiame prieš paskutinį vaiką
        `<tr data-bookid="${book.id}"> <!-- Kiekvienai eilutei priskiriame knygos ID -->
                <td>${book.Title}</td>
                <td>${book.Year}</td>
                <td>${book.Publisher}</td>
                <td>${book.ISBN}</td>
                <td>${book.Pages}</td>
                <td>${
                  book.Notes[0] ? book.Notes.join("; ") : "No additional notes"
                }</td> <!-- Jei yra pastabos, sujungiame jas su kabliataškiu -->
            </tr>`
      );
    });
  })
  .catch((error) => console.log(error)); // Klaidos atveju išvedame į konsolę

// Pridedame paspaudimo event listenerį knygų lentelėje
kingBooksEl.addEventListener("click", (e) => {
  const tr = e.target.parentElement; // Gauname paspaustą eilutę
  const villainsRowEl = document.getElementById("villains-row"); // Tikriname, ar jau yra rodomi antagonistai
  
  // Jei yra rodomi kitos knygos antagonistai, pašaliname juos
  if (villainsRowEl && villainsRowEl != tr) {
    kingBooksEl.removeChild(villainsRowEl);
  }
  
  // Jei paspausta ne ant jau atidarytos eilutės su antagonistais
  if (villainsRowEl != tr) {
    const bid = tr.dataset.bookid; // Gauname knygos ID iš duomenų atributo
    
    // Gauname konkrečios knygos antagonistus iš API
    fetch("https://stephen-king-api.onrender.com/api/book/" + bid)
      .then((res) => res.json())
      .then((data) => {
        // Įterpiame naują eilutę su antagonistais po paspaustos eilutės
        tr.insertAdjacentHTML(
          "afterend",
          `<tr id="villains-row">
            <td colspan="2">${data.data.Title}</td>
            <td colspan="4">${data.data.villains
              .map((villain) => `<a href="${villain.url}">${villain.name}</a>`)
              .join("<br/>")}</td> <!-- Kiekvienam antagonistui sukuriam nuorodą -->
          </tr>`
        );
        
        // Gauname visas nuorodas antagonistų eilutėje
        const links = Array.from(document.getElementsByTagName("a"));
        
        // Pridedame paspaudimo event listenerį kiekvienai nuorodai
        links && links.forEach((link) => {
          link.addEventListener("click", (e) => {
            e.stopPropagation(); // Sustabdome evento plitimą
            e.preventDefault(); // Sustabdome numatytąjį nuorodos veikimą
            
            // Gauname paspausto antagonisto duomenis
            fetch(e.target.href)
              .then((res) => res.json())
              .then((data) => {
                // Užpildome modalinio lango turinį
                contentEl.innerHTML = `
                  <h2>${data.data.name}</h2>
                  <p>${data.data.status}</p>
                  <ul>${data.data.books
                    .map((book) => `<li>${book.title}</li>`)
                    .join("")}</ul> <!-- Kiekvienai knygai sukuriam sąrašo elementą -->
                `;
                
                // Rodome modalinį langą
                document.body.appendChild(modalWindow);
              });
          });
        });
      })
      .catch((err) => console.log(err)); // Klaidos atveju išvedame į konsolę
  }
});
