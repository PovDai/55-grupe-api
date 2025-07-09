const kingBooksEl = document.getElementById("king-books");

fetch("https://stephen-king-api.onrender.com/api/books")
    .then((atsakymas) => atsakymas.json())
  .then((duomenys) => {
    console.log(duomenys);

    duomenys.data.forEach((book) => {
      kingBooksEl.insertAdjacentHTML(
        "beforeend",
        `<tr>
                <td>${book.Title}</td>
                <td>${book.Year}</td>
                <td>${book.Publisher}</td>
                <td>${book.ISBN}</td>
                <td>${book.Pages}</td>
                <td>${book.Notes[0]}</td>
                <td>${book.created_at}</td>
                <td>${book.villains.length}</td>
        
        
            </tr>`
      );
    });
  })
  .catch((error) => console.log(error));
 