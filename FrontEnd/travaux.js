async function getWorks() {
  const reponse = await fetch("http://localhost:5678/api/works");          
  const works = await reponse.json();
  console.log(works)

for (let i = 0; i < works.length; i++) {
    const work = works[i];

    const sectionImage = document.querySelector(".gallery");
    const figureElement = document.createElement("figure");

    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title

    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = work.title

    sectionImage.appendChild(figureElement);
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figcaptionElement);

  }

}
getWorks()

async function getCategories() {
  const reponse = await fetch("http://localhost:5678/api/categories")
  const categories = await reponse.json();
  console.log(categories)

  
  for(let i = 0; i < categories.length; i++) {
    const categorie = categories[i];

    const sectionElement = document.querySelector(".categories");

    const btnElement = document.createElement("button");
    btnElement.classList.add("bouton_filtre");
    btnElement.innerText = categorie.name;

    sectionElement.appendChild(btnElement);
  
  }

}
getCategories()

