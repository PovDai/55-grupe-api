const kingBooksEl = document.getElementById("king-books")
const loaderDOM = document.querySelector('.loader');
const tableDOM = document.getElementById('table')

tableDOM.classList.add('hide');

loaderDOM.classList.add('show');




fetch("https://stephen-king-api.onrender.com/api/books")
  .then((atsakymas) => atsakymas.json())
  .then((duomenys) => {
    console.log(duomenys);

    tableDOM.classList.remove('hide');

    loaderDOM.classList.remove('show');

    duomenys.data.forEach((book) => {
      kingBooksEl.insertAdjacentHTML(
        "beforeend",
        `<tr data-bookid-"${book.id}">
                <td>${book.Title}</td>
                <td>${book.Year}</td>
                <td>${book.Publisher}</td>
                <td>${book.ISBN}</td>
                <td>${book.Pages}</td>
                <td>${book.Notes[0]}</td>
                <td>${book.created_at}</td>
                <td>${book.villains.length}</td>
                <td>${book.Notes[0] ? book.Notes.join('; '):'No notes'}</td>
            </tr>`
      );
    });
  })
  .catch((error) => console.log(error));
kingBooksEl.addEventListener('click', e => {
  console.log(e.target.parentElement.dataset.bookid);
  const bid=e.target.parentElement.dataset.bookid
fetch("https://stephen-king-api.onrender.com/api/books"+bid).then
})