const popup = document.querySelector(".popup");
const popupOverlay = document.querySelector(".popup-overlay");
const addButton = document.getElementById("popup-button");
const cancelButton = document.getElementById("cancel-button");
const closeButton = document.getElementById("close-popup");
const submitButton = document.getElementById("submit-button");
const bookForm = document.getElementById("book-form");
const container = document.querySelector(".container");
const titleInput = document.getElementById("book-title");
const authorInput = document.getElementById("book-author");
const descriptionInput = document.getElementById("book-description");

addButton.addEventListener("click", function () {
    openPopup();
});

function closePopup() {
    popup.classList.remove("active");
    popupOverlay.classList.remove("active");
    setTimeout(() => {
        popup.style.display = "none";
        popupOverlay.style.display = "none";
    }, 300);
}

function openPopup() {
    popup.style.display = "block";
    popupOverlay.style.display = "flex";
    setTimeout(() => {
        popup.classList.add("active");
        popupOverlay.classList.add("active");
    }, 10);
    setTimeout(() => {
        titleInput.focus();
    }, 350);
}

cancelButton.addEventListener("click", closePopup);
closeButton.addEventListener("click", closePopup);

popupOverlay.addEventListener("click", function (e) {
    if (e.target === popupOverlay) {
        closePopup();
    }
});

popup.addEventListener("click", function (e) {
    e.stopPropagation();
});

bookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
});

function addBook() {
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const description = descriptionInput.value.trim();

    if (title && author && description) {
        const bookCard = document.createElement("div");
        bookCard.className = "sub-container";
        bookCard.innerHTML = `
            <div class="book-header">
                <h2>${escapeHtml(title)}</h2>
            </div>
            <h6 class="author">${escapeHtml(author)}</h6>
            <p class="description">${escapeHtml(description)}</p>
            <button class="delete-btn">Delete</button>
        `;

        const deleteBtn = bookCard.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", function () {
            bookCard.style.animation = "fadeOut 0.3s ease";
            setTimeout(() => {
                bookCard.remove();
            }, 300);
        });

        bookCard.style.opacity = "0";
        bookCard.style.transform = "translateY(20px)";
        container.appendChild(bookCard);

        setTimeout(() => {
            bookCard.style.transition = "all 0.3s ease";
            bookCard.style.opacity = "1";
            bookCard.style.transform = "translateY(0)";
        }, 10);

        titleInput.value = "";
        authorInput.value = "";
        descriptionInput.value = "";
        closePopup();
    }
}

const existingDeleteButtons = document.querySelectorAll(".sub-container .delete-btn");
existingDeleteButtons.forEach(function(button) {
    button.addEventListener("click", function () {
        const bookCard = button.closest(".sub-container");
        bookCard.style.animation = "fadeOut 0.3s ease";
        setTimeout(() => {
            bookCard.remove();
        }, 300);
    });
});

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

const style = document.createElement("style");
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
`;
document.head.appendChild(style);

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && popupOverlay.classList.contains("active")) {
        closePopup();
    }
});
