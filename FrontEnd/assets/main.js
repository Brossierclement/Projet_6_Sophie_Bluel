const form = document.getElementById("modaleMesProjets")
console.log(form)
form.addEventListener('submit', function(event) {
  debugger
  console.log(event)
  event.preventDefault();
})

// Récupération des données API :

let images = [];
// Permet de garder en stock "let images", les modifications sont uniquement sur "ImagesCourantes".
let imagesCourantes = [];

async function recuperationImages() {
    const reponse = await fetch("http://localhost:5678/api/works");
    return await reponse.json();
}

function galerieImages(emplacementGallery) {
    const galerie = document.querySelector(emplacementGallery);
    galerie.replaceChildren();
    for (imagesIndex = 0; imagesIndex < imagesCourantes.length; imagesIndex++) {
        // Récupére l'objet à l'index "imagesIndex" dans la liste image.
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

// -------------------------------------------------------------------------
// Récupère les différentes catégories fournies par l'api, puis ensuite les 
// utiliser pour filtrer les différentes images.
// -------------------------------------------------------------------------

async function recuperationCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    return await reponse.json();
}

function filtrage(categorie, emplacementGallery) {
    let imagesTemporaires = [];
    let categorieIndex = 0;
    for (categorieIndex = 0; categorieIndex < images.length; categorieIndex++) {
        const element = images[categorieIndex];
        if (element["category"]["name"] === categorie) {
            imagesTemporaires.push(element);
        }
    }
    imagesCourantes = imagesTemporaires;
    console.log(imagesTemporaires);
    galerieImages(emplacementGallery)
}

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

// -------------------------------------------------------------------------
// Verifie si le token est bien présent dans la session et applique le fait de
// pouvoir voir des éléments uniquement s'il s'agit de l'utilisatrice.
// -------------------------------------------------------------------------

function vérifierToken() {

    let token = sessionStorage.getItem("token");
    console.log(token)
  
    if (token) {
        const login = document.getElementById("login")
        const deconnexion = document.createElement("a")
        deconnexion.innerText = "Déconnexion";
        deconnexion.setAttribute("class", "deconnexion");
        deconnexion.setAttribute("style", "cursor: pointer")
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

      console.log("Le token est valide !");
    } else {
      console.log("Le token est invalide ou n'existe pas !");
    }
}

vérifierToken()

// -------------------------------------------------------------------------
// Sert simplement à cacher les boutons catégories si l'utilisatrice est connectée.
// -------------------------------------------------------------------------


function supprimerCategories() {

    let token = sessionStorage.getItem("token");

    if (token) {
        const categories = document.querySelector(".category")
        categories.style.display = "none"
    }
}

supprimerCategories()

// -------------------------------------------------------------------------
// Permet d'ouvrir la première modale "Mes projets".
// -------------------------------------------------------------------------

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
          console.log(imageId)
          console.log("Test")
          
          try {
            // l'api pose problem, je dois faire un truc je reviens
            const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              }
            });
        
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
    });

    const flecheRetour = document.querySelector(".flecheRetour")

    flecheRetour.addEventListener('click', function(event) {
        event.preventDefault();
        modaleAjouterImages.classList.toggle("ouvertureModales")
        modaleMesProjets.classList.toggle("ouvertureModales")
    })
  }
  
  ouvertureEtFermetureModaleAjouterImages();

// -------------------------------------------------------------------------
// Récupère les catégories fournies par l'api pour qu'elles soient prisent en
// compte dans un menu déroulant de la modale "Ajout d'une photo".
// -------------------------------------------------------------------------

async function recuperationCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    return await reponse.json();
}

recuperationCategories()
.then(categories => {
    const menuDeroulant = document.getElementById('menuDeroulantCategories')

    const optionVide = document.createElement('option');
    optionVide.value = ""
    optionVide.textContent = ""
    menuDeroulant.appendChild(optionVide)
    categories.forEach(categorie => {
        const options = document.createElement('option')
        options.value = categorie.id
        options.textContent = categorie.name
        menuDeroulant.appendChild(options)
    })
})

// -------------------------------------------------------------------------
// Permet de prévisualiser l'image que nous souhaitons ajouter dans la galerie
// -------------------------------------------------------------------------

function previsualisationDesPhotos() {
const fileInput = document.getElementById('file');
const previewImage = document.getElementById('previewImage');
const defaultImage = document.getElementById('defaultImage');

fileInput.addEventListener('change', function(event) {
  const file = event.target.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();

    reader.onload = function() {
      previewImage.src = reader.result;
      previewImage.style.display = 'block';
      defaultImage.style.display = 'none';
      fileInput.style.display = 'none';
      document.querySelector('.personnalisationInputImage').style.display = 'none';
      document.querySelector('.precisionPoids').style.display = 'none';
    };

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

// -------------------------------------------------------------------------

async function envoyerImage() {
  let token = JSON.parse (sessionStorage.getItem("token"));
  const formData = new FormData()
  formData.append("image", document.getElementById("file").files[0])
  formData.append("title", document.getElementById("ajouteTonTitre").value)
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

function validiteForme() {
  return document.getElementById("file").files[0] !== undefined &&
         document.getElementById("ajouteTonTitre").value !== "" &&
         document.getElementById("menuDeroulantCategories").options[document.getElementById("menuDeroulantCategories").selectedIndex].text !== ""
}

function activationDuBoutonValider() {
  const boutonValider = document.querySelector(".boutonValider")
  if (validiteForme()) {
        boutonValider.style.backgroundColor = "#1D6154"
        boutonValider.disabled = false
  } else {
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

  imageVoulantEtreAjoutee.value = ""; // Réinitialise la valeur du champ de fichier
  titreDeImage.value = ""; // Réinitialise la valeur du champ de titre
  categorieDeImage.selectedIndex = 0; // Réinitialise la sélection du champ de catégorie
  previewImage.src = "";
  previewImage.style.display = 'none';
  defaultImage.style.display = 'block';
  personnalisationInputImage.style.display = 'inline-block'; // Réaffiche le bouton d'insertion d'image
  precisionPoids.style.display = 'block';
}

const modaleAjouterImages = document.getElementById("modaleAjouterImages");

modaleAjouterImages.addEventListener('submit', async function(event) {
  console.log("test")
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
