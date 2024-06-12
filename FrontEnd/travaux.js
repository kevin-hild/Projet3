async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    console.log(works);

    // Fonction pour afficher les travaux
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

    // Afficher tous les travaux par défaut
    displayWorks(works);

    // Ajouter un gestionnaire d'événement pour chaque bouton de catégorie
    async function getCategories() {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();
        console.log(categories);

        const sectionElement = document.querySelector(".categories");

        // Ajouter le bouton "Tous"
        const allButton = document.createElement("button");
        allButton.classList.add("bouton_filtre", "filtre_actif");
        allButton.innerText = "Tous";
        sectionElement.appendChild(allButton);

        // Ajouter un événement de clic pour le bouton "Tous"
        allButton.addEventListener('click', function() {
            handleButtonClick(this);
            displayWorks(works); // Afficher tous les travaux
        });

        // Fonction pour gérer les clics sur les boutons
        function handleButtonClick(button) {
            const buttons = document.querySelectorAll('.bouton_filtre');
            buttons.forEach(bouton_filtre => {
                bouton_filtre.classList.remove('filtre_actif');
            });
            button.classList.add('filtre_actif');
        }

        // Ajouter les autres boutons de catégories
        categories.forEach(categorie => {
            const btnElement = document.createElement("button");
            btnElement.classList.add("bouton_filtre");
            btnElement.innerText = categorie.name;

            btnElement.addEventListener('click', function() {
                handleButtonClick(this);
                // Filtrer les travaux pour inclure uniquement ceux de la catégorie spécifiée
                const filteredWorks = works.filter(work => work.categoryId === categorie.id);
                displayWorks(filteredWorks); // Afficher les travaux filtrés
            });

            sectionElement.appendChild(btnElement);
        });
    }

    getCategories();
}

getWorks();

    // const boutonFiltreTous = document.querySelector(".bouton_0")

    // boutonFiltreTous.addEventListener("click", function() {
    //    document.querySelector(".gallery").innerHTML = "";
    //    getWorks()
    //    const clearFiltres = document.querySelectorAll(".bouton_filtre")
    //    clearFiltres.forEach(filtre => {
    //         filtre.classList.remove("work")
    //    })
    //    boutonFiltreTous.classList.add("work")
       
    // });


    // const boutonFiltreObjets = document.querySelector(".bouton_1")

    // boutonFiltreObjets.addEventListener("click", function() {
    //     const travauxFiltre = travaux.filtre(function(work) {
    //         return work.categoryId == 1;
    //     });
    //     document.querySelector(".gallery").innerHTML = "";
    //     getWorks(travauxFiltre);
    //     const clearFiltres = document.querySelectorAll(".bouton_filtre")
    //     clearFiltres.forEach(filtre => {
    //         filtre.classList.remove("bouton_filtre")
    //     })
    //     boutonFiltreObjets.classList.add("bouton_filtre")
    
    // });
 
       
     
    // const boutonFiltreObjets = document.querySelector(".bouton_1")

    // boutonFiltreObjets.addEventListener("click", function() {
    //     const objetFiltre = objet.filtre(function (works) {
    //         return works.categoryId == 1
    //     });
    // })


    
   // btnElement.addEventListener("click", () => {
    // btnElement.style.backgroundColor = "#1D6154"
    // btnElement.style.color = "white"
    // });  








