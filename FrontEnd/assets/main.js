/*
Récupère le formulaire "modaleMesProjets", puis empêche le rechargement.
*/
const form = document.getElementById("modaleMesProjets")
form.addEventListener('submit', function(event) {
  debugger
  event.preventDefault();
})

/*
Récupère les images à partir de l'API avec la fonction fetch, puis met à jour
la galerie dans l'index HTML enfin affiche les images et leurs titres.
*/
let images = [];
let imagesCourantes = [];

async function recuperationImages() {
    const reponse = await fetch("http://localhost:5678/api/works");
    return await reponse.json();
}

function galerieImages(emplacementGallery) {
    const galerie = document.querySelector(emplacementGallery);
    galerie.replaceChildren();
    for (imagesIndex = 0; imagesIndex < imagesCourantes.length; imagesIndex++) {
        const element=imagesCourantes[imagesIndex];

        const figure = document.createElement("figure");
        figure.setAttribute("class", "classeFigure");
        galerie.appendChild(figure);

        const img = document.createElement("img");
        img.setAttribute("class", "classeImg");
        img.src = element["imageUrl"];
        figure.appendChild(img);

        const figCaption = document.createElement("figcaption");
        figCaption.setAttribute("class", "classeFigCaption");
        figure.appendChild(figCaption);

        const titre = document.createElement("p");
        titre.setAttribute("class", "classTitre");
        titre.innerText = element["title"];
        figure.appendChild(titre);
    }
}

async function updateGallery(emplacementGallery) {
    images = await recuperationImages()
    imagesCourantes = images;
    galerieImages(emplacementGallery)
}

updateGallery(".gallery");

/*
Récupère les catégories à partir de l'API avec la fonction fetch, crée des boutons
dans l'index HTML, puis ajoute un addEventListener pour permettre de filtrer
les images en fonction de la catégorie sélectionnée enfin met à jour la galerie.
*/
async function recuperationCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    return await reponse.json();
}

function filtrage(categorie, emplacementGallery) {
    let imagesTemporaires = [];
    let imagesIndex = 0;
    for (imagesIndex = 0; imagesIndex < images.length; imagesIndex++) {
        const element = images[imagesIndex];
        /*
        Si la catégorie et le nom de element === categorie alors ajoute l'image dans
        le tableau imagesTemporaires.
        */
        if (element["category"]["name"] === categorie) {
            imagesTemporaires.push(element);
        }
    }
    imagesCourantes = imagesTemporaires;
    galerieImages(emplacementGallery)
}

/*
Permet la création dynamique des boutons pour les catégories, le bouton Tous est crée
indépendamment.
*/

async function categoriesAffichage(emplacementGallery) {
    const conteneurCategories = document.querySelector(".category");
    const categories = await recuperationCategories();
    let categoriesIndex = 0;
    const boutonTous = document.createElement("button");
    boutonTous.setAttribute("class", "classBoutonTous");
    boutonTous.innerText = "Tous";
    conteneurCategories.appendChild(boutonTous);

    boutonTous.addEventListener('click', function() {
        imagesCourantes = images;
        galerieImages(emplacementGallery)
    })

    for (categoriesIndex = 0; categoriesIndex < categories.length; categoriesIndex++) {
        const element = categories[categoriesIndex];
        
        const boutonCategories = document.createElement("button");
        boutonCategories.setAttribute("class", "classBoutonCategories");
        conteneurCategories.appendChild(boutonCategories);
        boutonCategories.innerText = element["name"];
        console.log(boutonCategories);

        boutonCategories.addEventListener('click', function() {
            filtrage(element['name'], emplacementGallery);
        })
    }
}

categoriesAffichage(".gallery")

/*
Vérifie si mon token est bien présent dans le sessionStorage, si présent des actions
s'effectuent comme remplacer le login en déconnexion.
*/

function vérifierToken() {

    let token = sessionStorage.getItem("token");
    console.log(token)
  
    if (token) {
        const login = document.getElementById("login")
        const deconnexion = document.createElement("a")
        deconnexion.innerText = "Déconnexion";
        deconnexion.setAttribute("class", "deconnexion");
        deconnexion.setAttribute("style", "cursor: pointer")
        /*
        Va permettre de remplacer le connexion par déconnexion.
        */
        login.parentNode.replaceChild(deconnexion, login);

        deconnexion.addEventListener('click', function() {
            if (deconnexion) {
                sessionStorage.removeItem("token")
                location.reload();
            }
        })

        const modeEdition = document.querySelector(".modeEdition")
        const modificationImageProfile = document.querySelector(".modificationImageProfile")
        const modificationTexteIntroduction = document.querySelector(".modificationTexteIntroduction")
        const modificationImageProjets = document.querySelector(".modificationImageProjets")

        modeEdition.style.display = "flex"
        modificationImageProfile.style.display = "flex"
        modificationTexteIntroduction.style.display = "flex"
        modificationImageProjets.style.display = "flex"

      console.log("Le token est présent !");
    } else {
      console.log("Le token n'est pas présent !");
    }
}

vérifierToken()

/*
Supprime simplement les boutons de catégories si l'utilisateur est connecté.
*/


function supprimerCategories() {

    let token = sessionStorage.getItem("token");

    if (token) {
        const categories = document.querySelector(".category")
        categories.style.display = "none"
    }
}

supprimerCategories()

/*
Permet d'ouvrire la modale des projets via un événement clic qui applique une class
provoquant l'ouverture de la modale, mais également la fermeture cependant via un autre
évenement clic via la croix. 
*/

function ouvertureEtFermetureModaleMesProjets() {
    const boutonModifierMesProjets = document.querySelector(".modificationImageProjets")
    const arrierePlanGris = document.querySelector(".arrierePlanGris")
    const modaleMesProjets = document.getElementById("modaleMesProjets")

    boutonModifierMesProjets.addEventListener('click', function(event) {
      event.preventDefault();
        if (!arrierePlanGris.classList.contains("ouvertureModales") || !modaleMesProjets.classList.contains("modaleMesProjetsOuverte")) {
            arrierePlanGris.classList.toggle('ouvertureModales')
            modaleMesProjets.classList.toggle('ouvertureModales')
        }
        }
    )
    const croixDeFermetureMesProjets = document.querySelector(".croixFermetureModales")
    
    croixDeFermetureMesProjets.addEventListener('click', function(event){
      event.preventDefault();
        arrierePlanGris.classList.toggle('ouvertureModales')
        modaleMesProjets.classList.toggle('ouvertureModales')
    })
}

ouvertureEtFermetureModaleMesProjets()

// -------------------------------------------------------------------------
// Réutilisation des images affichées sur le site, mais ici elles sont injectées
// dans la madole pour permettre suppression.
// -------------------------------------------------------------------------

function galerieImagesModale(emplacementGallery) {
    const galerie = document.querySelector(emplacementGallery);
    /*
    Permet de vider la galerie en supprimant les enfants.
    */
    galerie.replaceChildren();
    for (let imagesIndex = 0; imagesIndex < imagesCourantes.length; imagesIndex++) {
        const element = imagesCourantes[imagesIndex];

        const figure = document.createElement("figure");
        figure.setAttribute("class", "classeFigure");
        galerie.appendChild(figure);

        const conteneurImages = document.createElement("div");
        conteneurImages.setAttribute("class", "conteneurImages");
        figure.appendChild(conteneurImages);

        const img = document.createElement("img");
        img.setAttribute("class", "classeImg");
        img.src = element["imageUrl"];
        conteneurImages.appendChild(img);

        const supprimerPhoto = document.createElement("button");
        supprimerPhoto.setAttribute("class", "supprimerPhoto");

        const image = document.createElement("img");
        image.setAttribute("src", "assets/icons/poubelle.png");

        supprimerPhoto.appendChild(image);
        conteneurImages.appendChild(supprimerPhoto);

        if (imagesIndex === 0) {
          const deplacerPhoto = document.createElement("button");
          deplacerPhoto.setAttribute("class", "deplacerPhoto");
  
          const imageDeplacerPhoto = document.createElement("img");
          imageDeplacerPhoto.setAttribute("src", "assets/icons/option-de-deplacement.png");
  
          deplacerPhoto.appendChild(imageDeplacerPhoto);
          conteneurImages.appendChild(deplacerPhoto);
        }

        const figCaption = document.createElement("figcaption");
        figCaption.setAttribute("class", "classeFigCaption");
        figure.appendChild(figCaption);

        const titre = document.createElement("p");
        titre.setAttribute("class", "classTitre");
        titre.innerText = element["title"];
        figCaption.appendChild(titre);

        let token = JSON.parse (sessionStorage.getItem("token"));
        console.log(token)

        supprimerPhoto.addEventListener("click", async (event) => {
          event.preventDefault();
          const imageId = element["id"];
          
          try {
            const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              }
            });
        
            /*
            Sert à vérifier si la requête HTTP a été réussie c'est à dire (200).
            */
            if (response.ok) {
              console.log('L\'image a été supprimée avec succès.');
              figure.remove();
              await updateGallery(".gallery");
              await updateGalleryModale(emplacementGallery);
            } else {
              console.log('Une erreur s\'est produite lors de la suppression de l\'image.');
            }
          } catch (error) {
            console.log('Une erreur s\'est produite lors de la requête DELETE:', error);
          }
        });
    }
}

async function updateGalleryModale(emplacementGallery) {
    images = await recuperationImages()
    imagesCourantes = images;
    galerieImagesModale(emplacementGallery)
}

updateGalleryModale(".mesProjetsBody");

// -------------------------------------------------------------------------

function validiteForme() {
  /*
  Return est une instruction qui permet de renvoyer une valeur.
  Si conditions remplies : true.
  Si conditions non remplies : false.
  Permet également d'utiliser le résultat de la fonction dans une autre partie du code.
  */
  return document.getElementById("file").files[0] !== undefined &&
         document.getElementById("ajouteTonTitre").value !== "" &&
         document.getElementById("menuDeroulantCategories").options[document.getElementById("menuDeroulantCategories").selectedIndex].text !== ""
}

function activationDuBoutonValider() {
  const boutonValider = document.querySelector(".boutonValider")
  const messageErreur = document.querySelector(".messageErreur")
  if (validiteForme()) {
    messageErreur.textContent = ""
        boutonValider.style.backgroundColor = "#1D6154"
        boutonValider.disabled = false
  } else {
    messageErreur.textContent = "Veuillez remplir tous les champs !"
    console.log(messageErreur)
    boutonValider.style.backgroundColor = "#A7A7A7"
    boutonValider.disabled = true
  }
}

function resetInputs() {
  const imageVoulantEtreAjoutee = document.getElementById("file");
  const titreDeImage = document.getElementById("ajouteTonTitre");
  const categorieDeImage = document.getElementById("menuDeroulantCategories");
  const previewImage = document.getElementById('previewImage');
  const defaultImage = document.getElementById('defaultImage');
  const personnalisationInputImage = document.querySelector('.personnalisationInputImage');
  const precisionPoids = document.querySelector('.precisionPoids');

  imageVoulantEtreAjoutee.value = "";
  titreDeImage.value = "";
  categorieDeImage.selectedIndex = 0;
  previewImage.src = "";
  previewImage.style.display = 'none';
  defaultImage.style.display = 'block';
  personnalisationInputImage.style.display = 'inline-block';
  precisionPoids.style.display = 'block';
  activationDuBoutonValider()
}

function ouvertureEtFermetureModaleAjouterImages() {
    const boutonAjouter = document.querySelector(".boutonAjouter");
    const arrierePlanGris = document.querySelector(".arrierePlanGris")
    const modaleAjouterImages = document.getElementById("modaleAjouterImages");
    const modaleMesProjets = document.getElementById("modaleMesProjets")
    const croixDeFermetureAjouterImages = modaleAjouterImages.querySelector(".croixFermetureModales");
  
    boutonAjouter.addEventListener('click', function(event) {
      event.preventDefault();
      if (!modaleAjouterImages.classList.contains("ouvertureModales")) {
        modaleAjouterImages.classList.toggle("ouvertureModales");
        modaleMesProjets.classList.toggle("ouvertureModales")
      }
    });
  
    croixDeFermetureAjouterImages.addEventListener('click', function(event) {
      event.preventDefault();
      modaleAjouterImages.classList.toggle('ouvertureModales');
      arrierePlanGris.classList.toggle("ouvertureModales")
      resetInputs()
    });

    const flecheRetour = document.querySelector(".flecheRetour")

    flecheRetour.addEventListener('click', function(event) {
        event.preventDefault();
        modaleAjouterImages.classList.toggle("ouvertureModales")
        modaleMesProjets.classList.toggle("ouvertureModales")
        resetInputs()
    })
  }
  
  ouvertureEtFermetureModaleAjouterImages();

/*
Récupère les catégories, puis met à jour de manière dynamique dans un menu déroulant.
*/

async function recuperationCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    return await reponse.json();
}

recuperationCategories()
/*
Traite la valeur RESOLUE d'une promesse, comme celle de la ligne 398.
*/
.then(categories => {
    const menuDeroulant = document.getElementById('menuDeroulantCategories')

    const optionVide = document.createElement('option');
    optionVide.value = ""
    optionVide.textContent = ""
    menuDeroulant.appendChild(optionVide)
    /*
    ForEach parcours chaque élément du tableau catégories et éxécute des opérations
    spécifiques pour chaque catégorie créant des options dans le menu déroulant.
    */
    categories.forEach(categorie => {
        const options = document.createElement('option')
        options.value = categorie.id
        options.textContent = categorie.name
        menuDeroulant.appendChild(options)
    })
})

/*
Permet d'avoir un aperçu de l'image que l'utilisateur souhaite utiliser.
*/

function previsualisationDesPhotos() {
const fileInput = document.getElementById('file');
const previewImage = document.getElementById('previewImage');
const defaultImage = document.getElementById('defaultImage');

/*
Dès l'instant que l'utilisateur sélectionne un fichier via le champ d'entrée
la fonction rappel sera exécutée.
*/
fileInput.addEventListener('change', function(event) {
  const file = event.target.files[0];

  /*
  Vérifie si le fichier existe et si son type commence par image/.
  */
  if (file && file.type.startsWith('image/')) {
    /*
    FileReader permet de lire le contenu du fichier sélectionné.
    */
    const reader = new FileReader();

    reader.onload = function() {
      previewImage.src = reader.result;
      previewImage.style.display = 'block';
      defaultImage.style.display = 'none';
      fileInput.style.display = 'none';
      document.querySelector('.personnalisationInputImage').style.display = 'none';
      document.querySelector('.precisionPoids').style.display = 'none';
    };

    /*
    Permet de lire le fichier en tant qu'URL, utilisable pour l'affichage de l'image.
    */
    reader.readAsDataURL(file);
  } else {
    previewImage.src = "";
    previewImage.style.display = 'none';
    defaultImage.style.display = 'block';
    fileInput.style.display = 'inline-block';
  }
});

const modaleAjouterImages = document.getElementById("modaleAjouterImages")
const croixDeFermetureAjouterImages = modaleAjouterImages.querySelector(".croixFermetureModales");

croixDeFermetureAjouterImages.addEventListener('click', function() {
    previewImage.src = ""
    previewImage.style.display = "none"
    defaultImage.style.display = "block"
    fileInput.value = ""
    document.querySelector('.personnalisationInputImage').style.display = 'inline-block';
    document.querySelector('.precisionPoids').style.display = 'block';
})
}

previsualisationDesPhotos()

/*
Prépare les données d'une image et d'autres champs, puis d'envoyer ces données vers le serveur
via la requête POST tout en vérifiant si le token est bon.
*/

async function envoyerImage() {
  let token = JSON.parse (sessionStorage.getItem("token"));
  /*
  New formData est un objet FormData vide qui va servir à stocker les informations du formulaire,
  même les champs.
  Utilité : collecte et organise les données d'un formulaire de façon appropriée, facilitant également
  l'envoi.
  */
  const formData = new FormData()
  formData.append("image", document.getElementById("file").files[0])
  formData.append("title", document.getElementById("ajouteTonTitre").value)
  /*
  Permet de transmettre la valeur sélectionné du selected au formulaire.
  */
  formData.append("category", document.getElementById("menuDeroulantCategories").options[document.getElementById("menuDeroulantCategories").selectedIndex].value)
  const reponse = await fetch("http://localhost:5678/api/works", {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`,
      },
      body: formData
  });
  return reponse;
};

const modaleAjouterImages = document.getElementById("modaleAjouterImages");

modaleAjouterImages.addEventListener('submit', async function(event) {
  event.preventDefault()
  if(validiteForme()) {
    await envoyerImage()
    await updateGallery(".gallery");
    await updateGalleryModale(".mesProjetsBody");
    resetInputs();
  }
})

const imageVoulantEtreAjoutee = document.getElementById("file")
const titreDeImage = document.getElementById("ajouteTonTitre")
const categorieDeImage = document.getElementById("menuDeroulantCategories")

imageVoulantEtreAjoutee.addEventListener('change', function() {
  activationDuBoutonValider()
})

titreDeImage.addEventListener('change', function() {
  activationDuBoutonValider()
})

categorieDeImage.addEventListener('change', function() {
  activationDuBoutonValider()
})
