export function ajoutListenersAvis() {
    const piecesElements = document.querySelectorAll(".fiches article button");
  
    for (let i = 0; i < piecesElements.length; i++) {
      piecesElements[i].addEventListener("click", async function (event) {
        const id = event.target.dataset.id;
        //using the comments from the API
        const reponse = await fetch("http://localhost:8081/pieces/" + id + "/avis");
        const avis = await reponse.json();
        // checking if comments are present
        const avisElement = event.target.parentElement.querySelector(".avis-element");
        // if yes, remove them (2nde click)
        if (avisElement) {
          avisElement.remove();
        } else {
          // if not, show comments
          const pieceElement = event.target.parentElement;
          afficherAvis(pieceElement, avis);
        }
      });
    }
  }
        //showing comments from the API
  export function afficherAvis(pieceElement, avis) {
    const avisElement = document.createElement("div");
    avisElement.classList.add("avis-element");
  
    for (let i = 0; i < avis.length; i++) {
      const avisParUtilisateur = document.createElement("p");
      avisParUtilisateur.innerHTML = `<b>${avis[i].utilisateur}:</b> ${avis[i].commentaire}`;
      avisElement.appendChild(avisParUtilisateur);
    }
    pieceElement.appendChild(avisElement);
  }
  
        //add comments to the API
export function ajoutListenerEnvoyerAvis() {
  const formulaireAvis = document.querySelector(".formulaire-avis");
  formulaireAvis.addEventListener("submit", function (event) {
  event.preventDefault();
  // Création de l’objet du nouvel avis.
  const avis = {
      pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
      utilisateur: event.target.querySelector("[name=utilisateur]").value,
      commentaire: event.target.querySelector("[name=commentaire]").value,
      nbEtoiles: parseInt(event.target.querySelector("[name=nbEtoiles]").value)
  };
  // we create the payload
  const chargeUtile = JSON.stringify(avis);
  fetch("http://localhost:8081/avis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile
  });
  });
  
}

export async function afficherGraphiqueAvis() {
  // checking how many comments by products and the appreciation
  try{
  const avis = await fetch("http://localhost:8081/avis").then(avis => avis.json());
  const nb_commentaires = [0, 0, 0, 0, 0];

  for (let commentaire of avis) {
      nb_commentaires[commentaire.nbEtoiles - 1]++;
  }
  // the leftside label of the chart
  const labels = ["5", "4", "3", "2", "1"];
  // details of the chart
  const data = {
      labels: labels,
      datasets: [{
          label: "Étoiles attribuées",
          data: nb_commentaires.reverse(),
          backgroundColor: "rgb(234 88 12)",
      }],
  };
  // how to build the chart
  const config = {
      type: "bar",
      data: data,
      options: {
          indexAxis: "y",
      },
  };
  // we put it in the DOM
  const graphiqueAvis = new Chart(
      document.querySelector("#graphique-avis"),
      config,
  );

  //Comments charts
  // getting all products from the localstorage
  const piecesJSON = window.localStorage.getItem("pieces");
  //const pieces = piecesJSON ? JSON.parse(piecesJSON) : [] 
  const pieces = JSON.parse(piecesJSON)
  
  let nbCommentairesDispo = 0;
  let nbCommentairesNonDispo = 0;
  //if(pieces.length > 0){
  for (let i = 0; i < avis.length; i++) {
      const piece = pieces.find(p => p.id === avis[i].pieceId);

      if (piece) {
          if (piece.disponibilite) {
              nbCommentairesDispo++;
          } else {
              nbCommentairesNonDispo++;
          }
      }
  }
  const labelsDispo = ["Disponibles", "Non dispo."];
  const dataDispo = {
      labels: labelsDispo,
      datasets: [{
          label: "Nombre de commentaires",
          data: [nbCommentairesDispo, nbCommentairesNonDispo],
          backgroundColor: "rgb(234 88 12)",
      }],
  };
  const configDispo = {
      type: "bar",
      data: dataDispo,
  };
  console.log(dataDispo);
  new Chart(
      document.querySelector("#graphique-dispo"),
      configDispo,
  );
} catch (error) {
    console.error('Error fetching data:', error);
  }
}
