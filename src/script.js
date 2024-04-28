document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Show loading status on the button
    const searchButton = document.querySelector('#search_button')
    searchButton.value = 'Loading...'
    // Call OpenLibrary API
    const userInput = e.target.search_item.value;
    fetch(`https://openlibrary.org/search.json?q=${userInput}`)
      .then((res) => res.json())
      .then((data) => {
        const searchCount = document.querySelector('#search-count')
        // Display the number of books found
        searchCount.textContent = data.numFound
        // Unhide the search results section
        const searchResultsSection = document.querySelector("#search-results");
        searchResultsSection.classList.remove("hidden");
        // Empty the books container
        const booksContainer = document.querySelector("#books-found");
        booksContainer.innerHTML = ''
        // Change status of the button
        searchButton.value = 'Search'
        // Scroll to the search results section
        searchResultsSection.scrollIntoView({ behavior: "smooth" });

        data.docs.forEach((book) => {
          const bookCard = document.createElement("li");
          bookCard.classList.add("book-card");
          const publishYears = book.publish_year
          bookCard.innerHTML = `
                <div id="cover-container">
                    <img
                        src=${ // Show cover not found image if the book has no cover id
                          book.cover_i ? `http://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : './assets/cover-not-found.png'
                        }
                        alt="book cover"
                        id="book-cover"
                    />
                </div>
                <div id="book-details">
                    <p>
                    <span id="book-title">${book.title}</span> by
                    <span id="author">${  // If author_name has no value show Unknown
                      // if author_name has multiple authors, convert the array to strings seperated by commas else show the single author
                      book.author_name ? typeof book.author_name === 'object' ? book.author_name.join(", "): book.author_name :"Unknown" 
                    }</span>
                    </p>

                    <p>
                    <span id="pages">${
                      book.number_of_pages_median ? book.number_of_pages_median : "Unknown"
                    }</span> pages .
                    <span id="pub-year">${
                      typeof book.publish_year === 'object' ? book.publish_year[publishYears.length - 1] : book.publish_year
                    }</span>
                    </p>
                    <p id="overview">${
                      book.first_sentence ? book.first_sentence + '..' : "Excerpt not available"
                    }</p>
                </div>
                `;
          booksContainer.appendChild(bookCard);
        });
      })
      .catch((error) => console.log(error));
    form.reset();
  });
});
