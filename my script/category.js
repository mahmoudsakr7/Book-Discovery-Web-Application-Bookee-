document.addEventListener("DOMContentLoaded", () => {
    let selectedCategory = localStorage.getItem("selectedCategory");

    if (selectedCategory) {
        getcategoryBooks(selectedCategory);
    }
});
//declaring html elements as variables to present category books
let categorySection = document.getElementById('category');
let categoryTitle = document.getElementById('category-name');
// function used to display selected category books
let categoryBooks = [];
async function getcategoryBooks(categoryName) {
    console.log('MY FUNCTOIN WORKS AS EXPECTED');
    localStorage.getItem("selectedCategory", categoryName);
    let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${categoryName}&orderBy=newest&maxResults=20`);
    if (response.ok) {
        json = await response.json();
        if (json.items) {
            for (item of json.items) {
                categoryBooks.push({
                    bookName: item.volumeInfo.title,
                    bookImage: item.volumeInfo.imageLinks.smallThumbnail || "This book has no image",
                    BookPreview: item.volumeInfo.previewLink,
                    bookDescription: item.volumeInfo.description || "This book has no description",
                });
            }
        }
        categorySection.innerHTML = "";
        categoryTitle.innerHTML = localStorage.getItem("selectedCategory");
        for (let i = 0; i < categoryBooks.length; i++) {
            categorySection.innerHTML += `
        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12 books-row">
            <div class="card card-hover shadow-sm h-75"
            onclick="ShowCategoryBooksDialog(${i})">
                <img src="${categoryBooks[i].bookImage}" alt="image doesn't exist" class="card-img-top h-75  overflow-hidden">
                <div class="card-body">
                    <p class="fw-bold fs-5 fs-md-7 fs-lg-10">${categoryBooks[i].bookName}</p>
                </div>
                <div class="card-footer d-flex justify-content-between align align-items-center bg-white ">
                    <span class="text-success fw-semibold">free</span>
                    <button class="btn bg-none"><i class="fa-solid fa-maximize"></i></button>
                </div>
            </div>
        </div>`;
        }
    }
    else if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} `);
    }
}
//declaring html elements as variables to handle the random books dialog dialog 
let categoryBookDialog = document.getElementById("category-book-dialog");
let categoryBookdialogTitle = document.getElementById('category-book-dialog-title');
let categoryBookdialogDescription = document.getElementById('category-book-dialog-description');
let categoryBookdialogImg = document.getElementById('category-book-dialog-img');
let categoryBookpreviewBtn = document.getElementById('category-book-preview-btn');
let categoryBookcloseBtn = document.getElementById('category-book-close-btn');

function ShowCategoryBooksDialog(index) {
    let retrievedBooks = categoryBooks[index];

    categoryBookdialogTitle.innerHTML = retrievedBooks.bookName;
    categoryBookdialogDescription.innerHTML = retrievedBooks.bookDescription;
    categoryBookdialogImg.src = retrievedBooks.bookImage;
    categoryBookpreviewBtn.addEventListener('click', () => {
        window.open(retrievedBooks.BookPreview, "_blank");
    });
    categoryBookDialog.showModal();
}


categoryBookcloseBtn.addEventListener('click', () => {
    localStorage.getItem("selectedCategory", categoryName);
    categoryBookDialog.close();
})

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