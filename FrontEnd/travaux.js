let categories = []
let works = []
let token = localStorage.getItem('token')

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
    displayThumbnails(works);
    setupEditionMode();
    setupBackToMainModal();
    setupAddPhoto();
    closeModal();
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

    const selectElement = document.querySelector("#category-select");
    if (selectElement) {
        categories.forEach(categorie => {
            const optionElement = document.createElement("option");
            optionElement.value = categorie.id;
            optionElement.innerText = categorie.name;
            selectElement.appendChild(optionElement);
        });
    }
}

function displayThumbnails(works) {
    const modalGalery = document.querySelector(".modal-galery");
    modalGalery.innerHTML = ''; // Vider la galerie modale

    works.forEach(work => {
        const container = document.createElement("div");
        container.classList.add("thumbnail-container");

        const thumbnailElement = document.createElement("img");
        thumbnailElement.src = work.imageUrl;
        thumbnailElement.alt = work.title;
        thumbnailElement.classList.add("thumbnail");

        const trashIcon = document.createElement("i");
        const trashIconWrapper = document.createElement("span")
        trashIcon.classList.add("fa", "fa-trash");
        trashIcon.dataset.id = work.id;
        trashIconWrapper.classList.add("trash-icon");
        trashIconWrapper.appendChild(trashIcon)

        trashIcon.addEventListener("click", async function() {
            const workId = this.dataset.id;
            await deleteWork(workId);
        });

        container.appendChild(thumbnailElement);
        container.appendChild(trashIconWrapper);
        modalGalery.appendChild(container);
    });
}

async function deleteWork(workId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        works = works.filter(work => work.id !== workId);
        displayWorks(works);
        displayThumbnails(works);
    } else {
        console.error("Erreur lors de la suppression du projet :", response.statusText);
    }
}

function setupEditionMode() {
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
};

function closeModal() {
    const modal = document.getElementById("myModal");
    const btn = document.querySelector(".btn-modif");
    const span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
        initModal()
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            // resetModalContent(); // Réinitialisation du contenu de la modal
        }
    }
};

function setupAddPhoto() {
    const boutonAjoutPhoto = document.querySelector(".addImageButton");
    const formChamp = document.querySelector(".form-champ");
    let click = 0;
    boutonAjoutPhoto.addEventListener("click", function modale2(event) {
        event.preventDefault();
        click++

        // Supprimer le contenu de la section suppression
        const sectionSuppression = document.querySelector(".cadre-suppression");
        sectionSuppression.innerHTML = "";

        // Mettre à jour le bouton pour valider l'ajout de photo
        boutonAjoutPhoto.innerHTML = "Valider";
        boutonAjoutPhoto.classList.add("bouton-ajout-photo-gris");
        boutonAjoutPhoto.classList.remove("addImageButton");

        // Mettre à jour le titre de la modale
        const titreModale = document.querySelector(".galerie-photo");
        titreModale.innerHTML = "Ajout photo";
        const arrowBack = document.querySelector(".back-to-main-modal");
        arrowBack.style.display = "block";

        // Afficher la div form-champ
        formChamp.style.display = 'block';

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

        browseAjoutPhoto.addEventListener("click", function(event) {
            event.preventDefault();
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
                    console.log(photoInput.files[0])
                    const img = document.createElement("img");
                    img.src = e.target.result;
                    img.classList.add("preview-image");
                    cadreAjoutPhoto.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
    });

    boutonAjoutPhoto.addEventListener("click", function envoiPhoto(event) {
    event.preventDefault();

    // Vérifier si tous les champs sont remplis
    const title = document.getElementById("title");
    const category = document.getElementById("category-select");
    // console.log(photoInput)
    if (title && category && photoInput) {
        // Créer un objet FormData pour envoyer les données du formulaire
        const formData = new FormData();
        formData.append("title", title.value);
        formData.append("category", category.value);
        formData.append("image", photoInput.files[0]);
        console.log(formData)
        // Envoyer les données au serveur
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
        .then(response => response.json())
        .then(newWork => {
            // Ajouter le nouveau projet à la liste des travaux et afficher
            works.push(newWork);
            displayWorks(works);
            displayThumbnails(works);

            // Réinitialiser le formulaire
            addPhotoForm.reset();
            const modal = document.getElementById("myModal");
            modal.style.display = "none";
        })
        .catch(error => {
            console.error("Erreur lors de l'ajout du projet :", error);
        });
    } else {
        alert("Veuillez remplir tous les champs et sélectionner une image.");
    }
    })
});
}

function setupBackToMainModal() {
    const btnBack = document.querySelector(".back-to-main-modal");

    btnBack.addEventListener("click", function(event) {
        event.preventDefault();
        
        initModal();
    });
};

function initModal() {
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

    const contenuModale = document.querySelector(".cadre-suppression");
    const ajoutPhoto = document.createElement("div");
    ajoutPhoto.classList.add("modal-galery");
    contenuModale.appendChild(ajoutPhoto);

    // Cacher la flèche de retour
    const btnBack = document.querySelector(".back-to-main-modal");
    btnBack.style.display = "none";

    const modalImage = document.querySelector(".cadre-ajout-photo");
    modalImage.style.display = 'none';
    displayThumbnails(works);
    console.log(works)
}

// function updateButtonColor() {
//     const title = document.getElementById("title");
//     const category = document.getElementById("category-select");
//     const photoInput = document.getElementById("image-uploadee");
//     const boutonColorChange = document.querySelector(".bouton-ajout-photo-gris");

//     if (title.value && category.value && photoInput.files.length > 0) {
//         boutonColorChange.style.backgroundColor = "#1D6154";
//     } else {
//         boutonColorChange.style.backgroundColor = "";
//     }
// }