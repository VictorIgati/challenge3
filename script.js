document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const filmsList = document.getElementById('films');
    const movieDetails = document.getElementById('movie-details');
    const buyTicketButton = document.getElementById('buy-ticket');
    let currentMovie = null;

    // Fetch all movies and display them in the list
    fetch('https://db-five-murex.vercel.app/films')
        .then(response => response.json())
        .then(movies => {
            movies.forEach(movie => {
                const li = document.createElement('li');
                li.textContent = movie.title;
                li.classList.add('film', 'item');
                li.dataset.id = movie.id;
                filmsList.appendChild(li);
            });
            // Load the first movie by default
            loadMovie(movies[0].id);
        });

    // Add click event listener to the film list
    filmsList.addEventListener('click', (event) => {
        if (event.target.matches('.film.item')) {
            const movieId = event.target.dataset.id;
            loadMovie(movieId);
        }
    });

    // Add click event listener to the buy ticket button
    buyTicketButton.addEventListener('click', () => {
        if (currentMovie && currentMovie.tickets_sold < currentMovie.capacity) {
            currentMovie.tickets_sold++;
            updateMovieDetails();
            updateServer();
        }
    });

    // Load movie details by ID
    function loadMovie(id) {
        fetch(`https://db-five-murex.vercel.app/films/${id}`)
            .then(response => response.json())
            .then(movie => {
                currentMovie = movie;
                updateMovieDetails();
                highlightActiveMovie(id);
            });
    }

    // Update the movie details in the DOM
    function updateMovieDetails() {
        const poster = document.getElementById('poster');
        const title = document.getElementById('title');
        const runtime = document.getElementById('runtime');
        const showtime = document.getElementById('showtime');
        const availableTickets = document.getElementById('available-tickets');
        const description = document.getElementById('description');

        // Update movie information
        poster.innerHTML = `<img src="${currentMovie.poster}" alt="${currentMovie.title} Poster">`;
        title.textContent = currentMovie.title;
        runtime.textContent = `Runtime: ${currentMovie.runtime} minutes`;
        showtime.textContent = `Showtime: ${currentMovie.showtime}`;
        availableTickets.textContent = `Available Tickets: ${currentMovie.capacity - currentMovie.tickets_sold}`;
        description.textContent = currentMovie.description;

        // Update buy ticket button state
        if (currentMovie.tickets_sold >= currentMovie.capacity) {
            buyTicketButton.textContent = 'Sold Out';
            buyTicketButton.disabled = true;
        } else {
            buyTicketButton.textContent = 'Buy Ticket';
            buyTicketButton.disabled = false;
        }
    }

    // Highlight the active movie in the list
    function highlightActiveMovie(id) {
        const movieItems = document.querySelectorAll('.film.item');
        movieItems.forEach(item => {
            if (item.dataset.id === id) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Update the server with the new number of tickets sold
    function updateServer() {
        fetch(`https://db-five-murex.vercel.app/films/${currentMovie.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tickets_sold: currentMovie.tickets_sold,
            }),
        });
    }
});