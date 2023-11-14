
import { ajoutListenersAvis } from "./avis.js";
// getting datas from json file
fetch("pieces-autos.json")
  .then(response => response.json())
  .then(pieces => {
    genererPieces(pieces);
   

    // sort selection
    const sortButton = document.querySelector(".btn-trier");
    sortButton.addEventListener("click", function () {
      // stock datas in a new list according to the price the lowest to the highest
      const sortedPieces = Array.from(pieces);
      sortedPieces.sort(function (a, b) {
        return a.prix - b.prix;
      });
      document.querySelector(".fiches").textContent = "";
      genererPieces(sortedPieces);
    });

    // filter selection
    const filterButton = document.querySelector(".btn-filtrer");
    filterButton.addEventListener("click", function () {
      const filteredPieces = pieces.filter(function (piece) {
        return piece.prix <= 35;
      });
      document.querySelector(".fiches").textContent = "";
      genererPieces(filteredPieces);
    });

    // description filter
    const descriptionButton = document.querySelector(".btn-description");
    descriptionButton.addEventListener("click", function () {
      const piecesWithDescription = pieces.filter(function (piece) {
        return piece.description;
      });
      document.querySelector(".fiches").textContent = "";
      genererPieces(piecesWithDescription);
    });

    // sort selection DESC
    const sortButtonDesc = document.querySelector(".btn-trier-desc");
    sortButtonDesc.addEventListener("click", function () {
      // stock datas in a new list according to the price the highest to the lowest
      const sortedPieces = Array.from(pieces);
      sortedPieces.sort(function (a, b) {
        return b.prix - a.prix;
      });
      document.querySelector(".fiches").textContent = "";
      genererPieces(sortedPieces);
    });

    // get all piece which price is lower thant 35eur
    const noms = pieces.map((piece) => piece.nom);
    for (let i = pieces.length - 1; i >= 0; i--) {
      if (pieces[i].prix > 35) {
        noms.splice(i, 1);
      }
    }
    // create an affordable list
    const pElement = document.createElement("p");
    pElement.innerText = "Pièces abordables";
    const abordablesElements = document.createElement("ul");
    // add name to the list
    for (let i = 0; i < noms.length; i++) {
      const nomElement = document.createElement("li");
      nomElement.innerText = noms[i];
      abordablesElements.appendChild(nomElement);

      document.querySelector(".abordables").appendChild(pElement).appendChild(abordablesElements);
    }

    // define name and price for the available list
    const nomsDiponibles = pieces.map((piece) => piece.nom);
    const prixDisponibles = pieces.map((piece) => piece.prix);

    for (let i = pieces.length - 1; i >= 0; i--) {
      if (pieces[i].disponibilité === false) {
        nomsDiponibles.splice(i, 1);
        prixDisponibles.splice(i, 1);
      }
    }
    const disponibliteElement = document.createElement("ul");
    // add name and price to the list
    for (let i = 0; i < nomsDiponibles.length; i++) {
      const nomElement = document.createElement("li");
      nomElement.innerText = `${nomsDiponibles[i]} - ${prixDisponibles[i]} € `;
      disponibliteElement.appendChild(nomElement);
    }
    const pElementDisponible = document.createElement("p");
    pElementDisponible.innerText = "Pièces disponibles";
    document
      .querySelector(".disponibles")
      .appendChild(pElementDisponible)
      .appendChild(disponibliteElement);

    // range bar
    const inputPrixMax = document.querySelector("#prix-max");
    inputPrixMax.addEventListener("input", function () {
      const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= inputPrixMax.value;
      });
      document.querySelector(".fiches").textContent = "";
      genererPieces(piecesFiltrees);
    });
    
  })
  
  .catch(error => {
    // Gérer les erreurs éventuelles ici
    console.error("Erreur lors de la récupération des données:", error);
  });

function genererPieces(pieces) {
  for (let i = 0; i < pieces.length; i++) {
    // creation of the different elements we will need
    const article = pieces[i];

    // getting the fiche section from the DOM
    const sectionFiches = document.querySelector(".fiches");

    // Element creation section:
    // create piece element:
    const pieceElement = document.createElement("article");
    // create img element:
    const imageElement = document.createElement("img");
    imageElement.src = article.image;
    // create h2 element for name:
    const nomElement = document.createElement("h2");
    nomElement.innerText = article.nom;
    // create p element for price:
    const prixElement = document.createElement("p");
    // if price is under 35: € above: €€€
    prixElement.innerText = `Prix: ${article.prix} €  (${article.prix < 35 ? "€" : "€€€"})`;
    // create p element for category:
    const categorieElement = document.createElement("p");
    // if there is no category instead of having " undefined" we put ?? "(aucune catégorie)"
    categorieElement.innerText = article.categorie ?? "(aucune catégorie)";
    // description element
    const descriptionElement = document.createElement("p");
    descriptionElement.innerText =
      article.description ?? "(Pas de description pour le moment.)";
    // availability element
    const disponibiliteElement = document.createElement("p");
    disponibiliteElement.innerText = article.disponibilité ? "en stock" : "Rupture de stock";
      //Opinion button
      const avisBouton = document.createElement("button");
      avisBouton.dataset.id = article.id;
      avisBouton.textContent = "Afficher les avis";

    sectionFiches.appendChild(pieceElement);
    pieceElement.appendChild(imageElement);
    pieceElement.appendChild(nomElement);
    pieceElement.appendChild(prixElement);
    pieceElement.appendChild(categorieElement);
    pieceElement.appendChild(descriptionElement);
    pieceElement.appendChild(disponibiliteElement);
    pieceElement.appendChild(avisBouton);
  }
   // Ajout de la fonction ajoutListenersAvis
      ajoutListenersAvis();
}
