function Openmenu(){
    document.querySelector(".sidenavbar").style.left = "0";
    document.body.style.overflow = "hidden"; 
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.style.display = "block";
}

function Closemenu(){
    document.querySelector(".sidenavbar").style.left = "-100%";
    document.body.style.overflow = "auto";
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.style.display = "none";
}

// Products filtering (Collection.html)
document.addEventListener("DOMContentLoaded", function(){
    const searchInput = document.getElementById("product-search");
    const colorCheckboxes = document.querySelectorAll(".color-filter");
    const productCards = document.querySelectorAll(".product-card");
    const noResults = document.getElementById("no-results");
    const sortSelect = document.getElementById("sort-select");
    const resultsCount = document.getElementById("results-count");

    if (!searchInput || !productCards.length) {
        return;
    }

    function debounce(fn, delay){
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...args), delay);
        };
    }

    function updateResultsCount(count){
        if (resultsCount){
            resultsCount.textContent = count + " result" + (count === 1 ? "" : "s");
        }
    }

    function readStateFromUrl(){
        const params = new URLSearchParams(window.location.search);
        const q = params.get("q");
        const colors = (params.get("colors") || "").split(",").filter(Boolean);
        const sort = params.get("sort");

        if (q != null) searchInput.value = q;
        if (colors.length){
            colorCheckboxes.forEach(cb => cb.checked = colors.includes(cb.value));
        }
        if (sort && sortSelect){
            sortSelect.value = sort;
        }
    }

    function writeStateToUrl(q, colors, sort){
        const params = new URLSearchParams(window.location.search);
        if (q) params.set("q", q); else params.delete("q");
        if (colors.length) params.set("colors", colors.join(",")); else params.delete("colors");
        if (sort && sort !== "relevance") params.set("sort", sort); else params.delete("sort");
        const newUrl = window.location.pathname + "?" + params.toString();
        window.history.replaceState({}, "", newUrl);
    }

    function sortCards(cards, sortValue){
        const sorted = [...cards];
        if (sortValue === "name-asc"){
            sorted.sort((a,b) => a.getAttribute("data-title").localeCompare(b.getAttribute("data-title")));
        } else if (sortValue === "name-desc"){
            sorted.sort((a,b) => b.getAttribute("data-title").localeCompare(a.getAttribute("data-title")));
        } else if (sortValue === "color"){
            sorted.sort((a,b) => a.getAttribute("data-color").localeCompare(b.getAttribute("data-color")));
        }
        return sorted;
    }

    function applyFilters(){
        const query = searchInput.value.trim().toLowerCase();
        const activeColors = Array.from(colorCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        const sortValue = sortSelect ? sortSelect.value : "relevance";

        let visibleCount = 0;
        productCards.forEach(card => {
            const title = (card.getAttribute("data-title") || "").toLowerCase();
            const color = (card.getAttribute("data-color") || "").toLowerCase();

            const matchesSearch = query === "" || title.includes(query);
            const matchesColor = activeColors.length === 0 ? true : activeColors.includes(color);

            const shouldShow = matchesSearch && matchesColor;
            card.style.display = shouldShow ? "" : "none";
            if (shouldShow) visibleCount++;
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? "" : "none";
        }

        updateResultsCount(visibleCount);
        writeStateToUrl(query, activeColors, sortValue);

        // Apply sorting to visible cards
        const grid = document.getElementById("products-grid");
        if (grid && sortValue !== "relevance"){
            const visibleCards = Array.from(productCards).filter(c => c.style.display !== "none");
            const sorted = sortCards(visibleCards, sortValue);
            sorted.forEach(c => grid.appendChild(c));
        }
    }

    readStateFromUrl();

    searchInput.addEventListener("input", debounce(applyFilters, 200));
    colorCheckboxes.forEach(cb => cb.addEventListener("change", applyFilters));
    if (sortSelect) sortSelect.addEventListener("change", applyFilters);
    applyFilters();
});

// Global enhancements: theme toggle, back-to-top, contact form
document.addEventListener("DOMContentLoaded", function(){
    const themeToggle = document.getElementById("theme-toggle");
    const backToTop = document.getElementById("back-to-top");
    const contactForm = document.getElementById("contact-form");
    const contactStatus = document.getElementById("contact-status");

    try{
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") document.body.classList.add("dark-mode");
    }catch(e){}

    if (themeToggle){
        const setIcon = () => {
            themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
        };
        setIcon();
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            try{
                localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
            }catch(e){}
            setIcon();
        });
    }

    if (backToTop){
        window.addEventListener("scroll", () => {
            backToTop.style.display = window.scrollY > 300 ? "flex" : "none";
        });
        backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    if (contactForm && contactStatus){
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("contact-name").value.trim();
            const email = document.getElementById("contact-email").value.trim();
            const message = document.getElementById("contact-message").value.trim();
            if (!name || !email || !message){
                contactStatus.textContent = "Please fill in all fields.";
                contactStatus.style.color = "red";
                return;
            }
            contactStatus.textContent = "Thanks! We received your message.";
            contactStatus.style.color = "green";
            contactForm.reset();
        });
    }
});