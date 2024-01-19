import {
    ajoutListenersAvis,
    ajoutListenerEnvoyerAvis,
    afficherGraphiqueAvis,
    afficherAvis,
} from "./avis.js";

//if offline, we can get back the datas from localstorage
let pieces = window.localStorage.getItem("pieces");

if (!pieces) {
    // getting datas from API
    const reponse = await fetch("http://localhost:8081/pieces/");
    pieces = await reponse.json();
    // transform files in json files
    const valeurPieces = JSON.stringify(pieces);
    // store datas into the localstorage
    window.localStorage.setItem("pieces", valeurPieces);
} else {
    pieces = JSON.parse(pieces);
}

    //Generates all products
function genererPieces(pieces) {
    for (let i = 0; i < pieces.length; i++) {
        const article = pieces[i];
        // Getting the element in the DOM
        const sectionFiches = document.querySelector(".fiches");
        // we create an article for each product
        const pieceElement = document.createElement("article");
        pieceElement.classList.add("article");
        pieceElement.dataset.id = pieces[i].id;

        // We create all the details of the product (image, name, price, availabilities, etc.)
        const imageElement = document.createElement("img");
        imageElement.style.width = "30%";
        imageElement.src = article.image;
        const nomElement = document.createElement("h3");
        nomElement.style.fontWeight = "bold";
        nomElement.style.textTransform = "uppercase";
        nomElement.innerText = article.nom;
        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;
        const categorieElement = document.createElement("p");
        categorieElement.innerText = article.categorie ?? "(aucune catégorie)";
        const descriptionElement = document.createElement("p");
        descriptionElement.innerText =
            article.description ?? "Pas de description pour le moment.";
        const stockElement = document.createElement("p");
        stockElement.innerText = article.disponibilite
            ? "En stock"
            : "Rupture de stock";
        //Comments section
        const avisBouton = document.createElement("button");
        avisBouton.classList.add("p_btn");
        avisBouton.dataset.id = article.id;
        avisBouton.textContent = "Afficher les avis";
        
        // we connect the all the article details to the DOM
        sectionFiches.appendChild(pieceElement);
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(stockElement);
        pieceElement.appendChild(avisBouton);
    }
    ajoutListenersAvis();
}
    //We connect comments from the api to the right products
genererPieces(pieces);
for (let i = 0; i < pieces.length; i++) {
    const id = pieces[i].id;
    const avisJSON = window.localStorage.getItem(`avis-piece-${id}`);
    const avis = JSON.parse(avisJSON);
    if (avis !== null) {
        const pieceElement = document.querySelector(`article[data-id="${id}"]`);
    }
}

    //Filter button creations
        //button filter: lowest to highest
const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a, b) {
        return a.prix - b.prix;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
});
        //button filter: afordable (less than 35eur)
const boutonFiltrer = document.querySelector(".btn-filtrer");
boutonFiltrer.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= 35;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
});

        //button filter: highest to lowest
const boutonDecroissant = document.querySelector(".btn-decroissant");
boutonDecroissant.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a, b) {
        return b.prix - a.prix;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
});
        //button filter: products with no description
const boutonNoDescription = document.querySelector(".btn-nodesc");
boutonNoDescription.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.description;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
});

//Affordable and available section:
        //Affordable section
const noms = pieces.map((piece) => piece.nom);
for (let i = pieces.length - 1; i >= 0; i--) {
    if (pieces[i].prix > 35) {
        noms.splice(i, 1);
    }
}
const abordableTitle = document.createElement("h2");
abordableTitle.innerText = "Pièces abordables";
abordableTitle.style.fontWeight = "bold"; 
abordableTitle.style.textTransform = "uppercase"; 
        // List creation
const abordablesElements = document.createElement("ul");
        //put the name products to the list
for (let i = 0; i < noms.length; i++) {
    const nomElement = document.createElement("li");
    nomElement.innerText = `\u25A0 ${noms[i]}`;
    abordablesElements.appendChild(nomElement);
}
document.querySelector(".abordables").appendChild(abordableTitle);
document.querySelector(".abordables").appendChild(abordablesElements);


//max price search
const inputPrixMax = document.querySelector("#prix-max");
inputPrixMax.addEventListener("input", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= inputPrixMax.value;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
});

// update datas for the localstorage
const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function () {
    window.localStorage.removeItem("pieces");
});

//Affordable and available section:
        //available section
const nomsDisponibles = pieces.map((piece) => piece.nom);
const prixDisponibles = pieces.map((piece) => piece.prix);

for (let i = pieces.length - 1; i >= 0; i--) {
    if (pieces[i].disponibilite === false) {
        nomsDisponibles.splice(i, 1);
        prixDisponibles.splice(i, 1);
    }
}
const disponiblesElement = document.createElement("ul");
for (let i = 0; i < nomsDisponibles.length; i++) {
    const nomElement = document.createElement("li");
    nomElement.innerText = `\u25A0 ${nomsDisponibles[i]} - ${prixDisponibles[i]} €`;
    disponiblesElement.appendChild(nomElement);
}
const disponibleTitle = document.createElement("h2");
disponibleTitle.innerText = "Pièces disponibles:";
disponibleTitle.style.fontWeight = "bold";
disponibleTitle.style.textTransform = "uppercase";
document.querySelector(".disponibles").appendChild(disponibleTitle);
document.querySelector(".disponibles").appendChild(disponiblesElement);


await afficherGraphiqueAvis();

ajoutListenerEnvoyerAvis();
