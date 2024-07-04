let categories = []
let works = []

async function fetchArrays(){
    const response = await fetch("http://localhost:5678/api/categories");
    categories = await response.json();
    
    const response2 = await fetch("http://localhost:5678/api/works");
    works = await response2.json();
    
}

async function init() {
    await fetchArrays();
    getCategories();
    displayWorks(works);
    displayThumbnails(works)
}

init()

function displayWorks(filteredWorks) {
    const sectionImage = document.querySelector(".galery");
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

function getCategories() {

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

function displayThumbnails(works) {
    const modalGalery = document.querySelector(".modal-galery");
    modalGalery.innerHTML = ''; // Vider la galerie modale

    works.forEach(work => {
        const thumbnailElement = document.createElement("img");
        thumbnailElement.src = work.imageUrl;
        thumbnailElement.alt = work.title;
        thumbnailElement.classList.add("thumbnail");

        modalGalery.appendChild(thumbnailElement);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const editionModeElement = document.getElementById('edition_mode');
    const loginElement = document.getElementById("login");
    const token = window.localStorage.getItem("token");
    const modifyButtons = document.querySelectorAll(".btn-modif");
    const modifyIcons = document.querySelectorAll(".modif-icon");
    const mainModal = document.getElementById("myModal");

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
        modifyButtons.forEach(button => button.style.display = 'block');
        modifyIcons.forEach(icon => icon.style.display = 'inline');
    } else {
        editionModeElement.style.display = 'none';
        document.body.style.paddingTop = '0';
        modifyButtons.forEach(button => button.style.display = 'none');
        modifyIcons.forEach(icon => icon.style.display = 'none');
    }

    modifyButtons.forEach(button => {
        button.addEventListener("click", function() {
            if (token) {
                mainModal.style.display = "block";
            } else {
                alert("Vous devez être connecté pour modifier.");
            }
        });
    });

    modifyIcons.forEach(icon => {
        icon.addEventListener("click", function() {
            if (token) {
                mainModal.style.display = "block";
            } else {
                alert("Vous devez être connecté pour modifier.");
            }
        });
    });

    closeMainModal.onclick = function() {
        mainModal.style.display = "none";
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
        // resetModalContent();  // Réinitialisation du contenu de la modal
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            // resetModalContent(); // Réinitialisation du contenu de la modal
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const boutonAjoutPhoto = document.querySelector(".addImageButton");
    const formChamp = document.querySelector(".form-champ");

    boutonAjoutPhoto.addEventListener("click", function(event) {
        event.preventDefault();

        // Supprimer le contenu de la section suppression
        const sectionSuppression = document.querySelector(".cadre-suppression");    // .modal-galery
        sectionSuppression.innerHTML = "";
        // sectionSuppression.style.display = 'none';

        // Mettre à jour le bouton pour valider l'ajout de photo
        boutonAjoutPhoto.innerHTML = "Valider";
        boutonAjoutPhoto.classList.add("bouton-ajout-photo-gris");
        boutonAjoutPhoto.classList.remove("addImageButton");

        // Mettre à jour le titre de la modale
        const titreModale = document.querySelector(".galerie-photo");
        titreModale.innerHTML = "Ajout photo";
        const arrowBack = document.querySelector(".back-to-main-modal");
        arrowBack.style.display = "block";

        // Ajouter les éléments pour le chargement de photo
        const contenuModale = document.querySelector(".cadre-suppression");
        const cadreAjoutPhoto = document.createElement("div");
        cadreAjoutPhoto.classList.add("cadre-ajout-photo");
        contenuModale.appendChild(cadreAjoutPhoto);

        const imageAjoutPhoto = document.createElement("i");
        imageAjoutPhoto.classList.add("fa-regular", "fa-image");
        cadreAjoutPhoto.appendChild(imageAjoutPhoto);

        const browseAjoutPhoto = document.createElement("button");
        browseAjoutPhoto.textContent = "+ Ajouter photo";
        cadreAjoutPhoto.appendChild(browseAjoutPhoto);

        const photoInput = document.createElement("input");
        photoInput.type = "file";
        photoInput.accept = "image/jpeg,image/png";
        photoInput.id = "image-uploadee";
        photoInput.style.display = "none";
        cadreAjoutPhoto.appendChild(photoInput);

        const texteAjoutPhoto = document.createElement("p");
        texteAjoutPhoto.innerText = "jpg, png: 4mo max";
        cadreAjoutPhoto.appendChild(texteAjoutPhoto);

        browseAjoutPhoto.addEventListener("click", function() {
            photoInput.click();
        });

        photoInput.addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imageAjoutPhoto.style.display = 'none';
                    browseAjoutPhoto.style.display = 'none';
                    texteAjoutPhoto.style.display = 'none';

                    const img = document.createElement("img");
                    img.src = e.target.result;
                    img.classList.add("preview-image");
                    cadreAjoutPhoto.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });

        // Afficher la div form-champ
        formChamp.style.display = 'block';
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const btnBack = document.querySelector(".back-to-main-modal");

    btnBack.addEventListener("click", function(event) {
        event.preventDefault();

        // Réinitialiser le formulaire
        const formChamp = document.querySelector(".form-champ");
        formChamp.style.display = 'none';

        // Mettre à jour le bouton ajouter photo
        const boutonAjoutPhoto = document.querySelector(".bouton-ajout-photo-gris");
        boutonAjoutPhoto.innerHTML = "Ajouter une photo";
        boutonAjoutPhoto.classList.add("addImageButton");
        boutonAjoutPhoto.classList.remove("bouton-ajout-photo-gris");

        // Réinitialiser le titre de la modale
        const titreModale = document.querySelector(".galerie-photo");
        titreModale.innerHTML = "Galerie photo";

        // Cacher la flèche de retour
        btnBack.style.display = "none";
        // btnBack.classList.remove(".carde-ajout-photo");

        const contenuModale = document.querySelector(".cadre-suppression");
        const ajoutPhoto = document.createElement("div");
        ajoutPhoto.classList.add("modal-galery");
        contenuModale.appendChild(ajoutPhoto);

        const modalImage = document.querySelector(".cadre-ajout-photo");
        modalImage.style.display = 'none';
        displayThumbnails(works);
    });
});


