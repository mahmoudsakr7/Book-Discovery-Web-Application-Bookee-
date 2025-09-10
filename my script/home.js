//declaring inputs and html elements as variables 
let homeBooksSection = document.getElementById("home-books");
let bookCard = document.getElementById('book-card');

//declaring array contains some categories to put it as a parameter in the API link
let myCategories = ["Science Fiction", "Fantasy", "Romance", "Mystery", "Thriller", "Horror",
    "Historical Fiction", "Biography", "Autobiography", "Self-Help", "Business", "Finance", "Cooking",
    "Travel", "Health", "Fitness", "Psychology", "Philosophy", "Technology", "Computer Science", "Programming",
    "Mathematics", "Physics", "Chemistry", "Biology", "Engineering", "Art", "Photography", , "Poetry", "Drama",
    "Education", "Law", "Politics", "Religion", "Spirituality", "Parenting", "Gardening", "Sports", "True Crime",
    "Young Adult", "Comics", "Short Stories", "Anthology", "Classic Literature"];

// this function used for putting random categories in an (randomBooks) array 
let randomBooks = [];
async function getRandomBooks() {
    let numberOfBooks = 20;
    let seenIds = new Set();

    for (let i = 0; i < myCategories.length; i++) {

        let randomCategory = myCategories[Math.floor(Math.random() * myCategories.length)];
        let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${randomCategory}&orderBy=newest&maxResults=2`);

        if (response.ok) {
            let json = await response.json();
            if (json.items) {
                for (item of json.items) {
                    if (!seenIds.has(item.id)) {
                        seenIds.add(item.id);
                        randomBooks.push({
                            bookName: item.volumeInfo.title,
                            bookImage: item.volumeInfo.imageLinks.smallThumbnail || "This book has no image",
                            BookPreview: item.volumeInfo.previewLink,
                            bookDescription: item.volumeInfo.description || "This book has no description",
                        })
                    }
                }
                if (randomBooks.length === numberOfBooks) {
                    break;
                }
            }
        }
        else if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
    displayRandomBooks(randomBooks);
}
// function used to retrieve random books from google API
getRandomBooks();

//function used to display books on the home page 
//first declare the array to put the books in it and declare it global
function displayRandomBooks(books) {
    for (let i = 0; i < books.length; i++) {

        homeBooksSection.innerHTML += `
        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12 books-row">
            <div class="card card-hover shadow-sm h-75" onclick="showRandomBooksDialog(${i})">

            <img src ="${books[i].bookImage}" alt = "image doesn't exist" class="card-img-top h-75  overflow-hidden" >

                <div class="card-body">
                    <p class="fw-bold fs-5 fs-md-7 fs-lg-10">${books[i].bookName}</p>
                </div>
                <div class="card-footer d-flex justify-content-between align align-items-center bg-white ">
                    <span class="text-success fw-semibold">free</span>
                    <button class="btn bg-none"><i class="fa-solid fa-maximize"></i></button>
                </div>
            </div >
        </div >`;
    }
}

//declaring html elements as variables to handle the random books dialog dialog 
let randomBookDialog = document.getElementById("random-book-dialog");
let randomBookdialogTitle = document.getElementById('random-book-dialog-title');
let randomBookdialogDescription = document.getElementById('random-book-dialog-description');
let randomBookdialogImg = document.getElementById('random-book-dialog-img');
let randomBookpreviewBtn = document.getElementById('random-book-preview-btn');
let randomBookcloseBtn = document.getElementById('random-book-close-btn');

// function used to when the user click or a book's card the dialog appears to present the book's details (name-image-description-preview link)
function showRandomBooksDialog(index) {

    let retrievedBooks = randomBooks[index];

    randomBookdialogTitle.innerHTML = retrievedBooks.bookName;
    randomBookdialogDescription.innerHTML = retrievedBooks.bookDescription;
    randomBookdialogImg.src = retrievedBooks.bookImage;
    randomBookpreviewBtn.addEventListener('click', () => {
        window.open(retrievedBooks.BookPreview, "_blank");
    });
    randomBookDialog.showModal();
}

//functionn used to close the dialog
randomBookcloseBtn.addEventListener('click', () => {
    randomBookDialog.close();
});
//function used to story the category name in local storage to call it in the category page
function openCategoryPage(categoryName) {
    localStorage.setItem("selectedCategory", categoryName);
    window.open('category.html', "_self");
}
//declaring html elements as variables to handle the search
let bookSearch = document.getElementById('book-search');
let searchResultSection = document.getElementById('search-result');
//function used to retrieve searched books from google API
async function searchBook() {
    const maxLength = 20;
    let results = [];
    if (bookSearch.value != "") {
        let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookSearch.value}`);
        if (response.ok) {
            let json = await response.json();
            if (json.items) {
                for (item of json.items) {
                    results.push({
                        bookName: item.volumeInfo.title,
                        bookImage: item.volumeInfo.imageLinks.smallThumbnail || "This book has no image",
                        BookPreview: item.volumeInfo.previewLink,
                    });
                }
            }
            searchResultSection.innerHTML = "";
            searchResultSection.style.display = "block";
            for (let i = 0; i < results.length; i++) {
                if (results[i].bookName.length > maxLength) {
                    results[i].bookName = results[i].bookName.substring(0, maxLength) + "...";
                }
                if (bookSearch.value === "") {
                    searchResultSection.innerHTML = "";
                }
                searchResultSection.innerHTML += `
            <div class="d-flex align-items-center p-2 border-bottom border-1 border-light" 
            onclick="window.open('${results[i].BookPreview}', '_blank')">
                        <i class="fa-solid fa-magnifying-glass text-white opacity-50 px-2"></i>
                        <img src="${results[i].bookImage}" class="rounded-3 overflow-hidden img-fluid"
                            alt="image doesn't exist">
                        <p class="text-white m-0 px-2 fw-semibold">${results[i].bookName}</p>
                    </div>`
            }

        }
        else if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} `);
        }
    }
    else if (bookSearch.value == "") {
        searchResultSection.innerHTML = "";
        searchResultSection.style.display = "none";
    }
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            bookSearch.blur();
            searchResultSection.innerHTML = "";
            searchResultSection.style.display = "none";
        }
    });
}