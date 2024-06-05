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

