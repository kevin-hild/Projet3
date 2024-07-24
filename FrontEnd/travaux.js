// Initialisation des variables globales
let categories = []
let works = []
let token = localStorage.getItem('token')

// Fonction asynchrone pour récupérer les catégories et les Photos depuis l'API
async function fetchArrays() {
    const response = await fetch("http://localhost:5678/api/categories");
    categories = await response.json();
    
    const response2 = await fetch("http://localhost:5678/api/works");
    works = await response2.json();
}

// Fonction principale pour initialiser les différentes fonctionnalités de la page
async function init() {
    await fetchArrays();
    getCategories();
    displayWorks(works);
    displayThumbnails(works);
    setupEditionMode();
    setupBackToMainModal();
    setupAddPhoto();
    closeModal("close");
    closeModal("close2");
    setupFormListeners();
}

init()

// Fonction pour afficher les Photos dans la galerie
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

// Fonction pour créer et afficher les boutons de filtrage par catégorie
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

// Fonction pour afficher les miniatures des Photos dans la galerie modale
function displayThumbnails(works) {
    const modalGalery = document.querySelector(".modal-galery");
    modalGalery.innerHTML = ''; // Vider la galerie modale

    const btnValider = document.querySelector(".btnValider")
    btnValider.style.display = "none"

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

        trashIcon.addEventListener("click", async function(event) {
            event.preventDefault()
            const workId = this.dataset.id;
            await deleteWork(workId);
        });

        container.appendChild(thumbnailElement);
        container.appendChild(trashIconWrapper);
        modalGalery.appendChild(container);
    });
}

// Fonction asynchrone pour supprimer une Photos de l'API et mettre à jour les affichages
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

// Fonction pour configurer le mode édition
function setupEditionMode() {
    const editionModeElement = document.getElementById('edition_mode');
    const loginElement = document.getElementById("login");
    const token = window.localStorage.getItem("token");
    const modifyButtons = document.querySelectorAll(".btn-modif");
    const modifyIcons = document.querySelectorAll(".modif-icon");
    const mainModal = document.getElementById("myModal");

    const closeModal2 = document.querySelector(".close2");
    closeModal2.style.display = ("none");

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

// Fonction pour configurer la fermeture de la modale en fonction de la classe CSS
function closeModal(elementClassName) {
    const modal = document.getElementById("myModal");
    const btn = document.querySelector(".btn-modif");
    const span = document.getElementsByClassName(elementClassName)[0];

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
            initModal();
        }
    }
};

// Fonction pour envoyer une nouvelle photo à l'API
async function envoiPhoto(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const category = document.getElementById("category-select").value;
    const photoInput = document.getElementById("image-uploadee");
    const photo = photoInput.files[0];

    // Validation des champs
    if (!title || !category || !photo) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    // Création du FormData pour envoyer les données
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", photo);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            const newWork = await response.json();
            works.push(newWork);
            displayWorks(works);
            displayThumbnails(works);

            // Afficher le message de validation
            const validationMessage = document.getElementById("validationMessage");
            if (validationMessage) {
                validationMessage.style.display = "block";
                setTimeout(() => {
                    validationMessage.style.display = "none";
                }, 10000);
            }
        } else {
            console.error("Erreur lors de l'ajout du projet :", response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout du projet :", error);
    }
}

// Fonction pour configurer l'ajout d'une nouvelle photo
function setupAddPhoto() {
    const boutonAjoutPhoto = document.querySelector(".addImageButton");
    const formChamp = document.querySelector(".form-champ");

    if (boutonAjoutPhoto) {
        boutonAjoutPhoto.addEventListener("click", function modale2(event) {
            event.preventDefault();

            boutonAjoutPhoto.style.display = "none";
            document.getElementById("title").value = "";
            document.getElementById("category-select").value = "";

            const btnValider = document.querySelector(".btnValider");
            btnValider.style.display = "block";

            const sectionSuppression = document.querySelector(".cadre-suppression");
            if (sectionSuppression) {
                sectionSuppression.innerHTML = "";
            }

            const closeModal1 = document.querySelector(".close");
            if (closeModal1) {
                closeModal1.style.display = "none";
            }

            const closeModal2 = document.querySelector(".close2");
            if (closeModal2) {
                closeModal2.style.display = "block";
            }

            const titreModale = document.querySelector(".galerie-photo");
            if (titreModale) {
                titreModale.innerHTML = "Ajout photo";
            }

            const arrowBack = document.querySelector(".back-to-main-modal");
            if (arrowBack) {
                arrowBack.style.display = "block";
            }

            formChamp.style.display = "block";

            const contenuModale = document.querySelector(".cadre-suppression");
            if (contenuModale) {
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
                            imageAjoutPhoto.style.display = "none";
                            browseAjoutPhoto.style.display = "none";
                            texteAjoutPhoto.style.display = "none";
                            const img = document.createElement("img");
                            img.src = e.target.result;
                            img.classList.add("preview-image");
                            cadreAjoutPhoto.appendChild(img);
                        };
                        reader.readAsDataURL(file);
                    }
                });

                // Ajout de l'événement envoi d'une Photo
                if (btnValider) {
                    btnValider.addEventListener("click", envoiPhoto);
                } else {
                    console.error("btnValider is not found");
                }
            }
        });
    }
}

// Fonction pour configurer le retour à la modale principale
function setupBackToMainModal() {
    const btnBack = document.querySelector(".back-to-main-modal");

    btnBack.addEventListener("click", function(event) {
        event.preventDefault();
        initModal();
    });
};

// Fonction pour réinitialiser le contenu et l'affichage de la modale
function initModal() {
    // Réinitialiser le formulaire
    const formChamp = document.querySelector(".form-champ");
    const boutonAjoutPhoto = document.querySelector(".addImageButton");
    const btnValider = document.querySelector(".btnValider");
    document.getElementById("title").value = "";
    document.getElementById("category-select").value = "";

    // Réinitialiser le bouton de couleur
    btnValider.style.backgroundColor = "";

    // Vérifiez si les éléments existent avant de les manipuler
    if (formChamp && boutonAjoutPhoto) {
        boutonAjoutPhoto.style.display = "block";
        formChamp.style.display = 'none';
    }

    const closeModal2 = document.querySelector(".close2");
    const closeModal1 = document.querySelector(".close");

    // Vérifiez si les éléments existent avant de les manipuler
    if (closeModal2 && closeModal1) {
        closeModal2.style.display = "none";
        closeModal1.style.display = "block";
    }

    // Mettre à jour le titre de la modale
    const titreModale = document.querySelector(".galerie-photo");
    if (titreModale) {
        titreModale.innerHTML = "Galerie photo";
    }

    // Réinitialiser le contenu de la modale
    const contenuModale = document.querySelector(".cadre-suppression");
    if (contenuModale) {
        contenuModale.innerHTML = ''; // Vider le contenu de la modale
        const ajoutPhoto = document.createElement("div");
        ajoutPhoto.classList.add("modal-galery");
        contenuModale.appendChild(ajoutPhoto);
    }

    // Cacher la flèche de retour
    const btnBack = document.querySelector(".back-to-main-modal");
    if (btnBack) {
        btnBack.style.display = "none";
    }

    // Afficher les miniatures dans la galerie modale
    displayThumbnails(works);
    console.log(works);
}

// Fonction pour mettre à jour la couleur du bouton de validation en fonction des champs du formulaire
function updateButtonColor() {
    const title = document.getElementById("title").value;
    const category = document.getElementById("category-select").value;
    const photo = document.getElementById("image-uploadee").files[0];
    const btnValider = document.querySelector(".btnValider");

    if (title && category && photo) {
        btnValider.style.backgroundColor = "#1D6154";
    } else {
        btnValider.style.backgroundColor = ""; //  mettre la couleur par défaut
    }
}

// Fonction pour configurer les écouteurs d'événements des champs du formulaire
function setupFormListeners() {
    const titleField = document.getElementById("title");
    const categoryField = document.getElementById("category-select");
    const photoField = document.getElementById("image-uploadee");

    if (titleField) titleField.addEventListener("input", updateButtonColor);
    if (categoryField) categoryField.addEventListener("change", updateButtonColor);
    if (photoField) photoField.addEventListener("change", updateButtonColor);
}

// Afficher un message de validation pendant 10 secondes
const validationMessage = document.getElementById("validationMessage");
validationMessage.style.display = "block";
setTimeout(() => {
    validationMessage.style.display = "none";
}, 10000);
