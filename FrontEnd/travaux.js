async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    console.log(works);

    function displayWorks(filteredWorks) {
        const sectionImage = document.querySelector(".gallery");
        sectionImage.innerHTML = ''; // Vider la galerie

        filteredWorks.forEach(work => {
            const figureElement = document.createElement("figure");

            const imageElement = document.createElement("img");
            imageElement.src = work.imageUrl;
            imageElement.alt = work.title;

            const figcaptionElement = document.createElement("figcaption");
            figcaptionElement.innerText = work.title;

            sectionImage.appendChild(figureElement);
            figureElement.appendChild(imageElement);
            figureElement.appendChild(figcaptionElement);
        });
    }

    displayWorks(works);

    async function getCategories() {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();
        console.log(categories);

        const sectionElement = document.querySelector(".categories");

        const allButton = document.createElement("button");
        allButton.classList.add("bouton_filtre", "filtre_actif");
        allButton.innerText = "Tous";
        sectionElement.appendChild(allButton);

        allButton.addEventListener('click', function() {
            handleButtonClick(this);
            displayWorks(works);
        });

        function handleButtonClick(button) {
            const buttons = document.querySelectorAll('.bouton_filtre');
            buttons.forEach(bouton_filtre => {
                bouton_filtre.classList.remove('filtre_actif');
            });
            button.classList.add('filtre_actif');
        }

        categories.forEach(categorie => {
            const btnElement = document.createElement("button");
            btnElement.classList.add("bouton_filtre");
            btnElement.innerText = categorie.name;

            btnElement.addEventListener('click', function() {
                handleButtonClick(this);
                const filteredWorks = works.filter(work => work.categoryId === categorie.id);
                displayWorks(filteredWorks);
            });

            sectionElement.appendChild(btnElement);
        });
    }

    getCategories();

    function displayThumbnails(works) {
        const modalGallery = document.querySelector(".modal-gallery");
        modalGallery.innerHTML = ''; // Vider la galerie modale

        works.forEach(work => {
            const thumbnailElement = document.createElement("img");
            thumbnailElement.src = work.imageUrl;
            thumbnailElement.alt = work.title;
            thumbnailElement.classList.add("thumbnail");

            modalGallery.appendChild(thumbnailElement);
        });
    }

    displayThumbnails(works);
}

getWorks();

document.addEventListener("DOMContentLoaded", function() {
    const editionModeElement = document.getElementById('edition_mode');
    const loginElement = document.getElementById("login");
    const token = window.localStorage.getItem("token");

    if (token) {
        console.log("Token présent dans le stockage local");

        loginElement.innerHTML = '<a href="index.html" id="logout-link">logout</a>';
        const logoutLink = document.getElementById("logout-link");

        logoutLink.addEventListener("click", function(event) {
            event.preventDefault();
            window.localStorage.removeItem("token");
            window.location.replace("index.html");
        });

        editionModeElement.style.display = 'flex';
    } else {
        editionModeElement.style.display = 'none';
        document.body.style.paddingTop = '0';
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("myModal");
    const btn = document.querySelector(".btn-modif");
    const span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});
