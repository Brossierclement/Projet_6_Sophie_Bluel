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

function supprimerCategories() {

    let token = sessionStorage.getItem("token");

    if (token) {
        const categories = document.querySelector(".category")
        categories.style.display = "none"
    }
}

supprimerCategories()

// -------------------------------------------------------------------------

function ouvertureEtFermetureModaleMesProjets() {
    const boutonModifierMesProjets = document.querySelector(".modificationImageProjets")
    const arrierePlanGris = document.querySelector(".arrierePlanGris")
    const modaleMesProjets = document.getElementById("modaleMesProjets")

    boutonModifierMesProjets.addEventListener('click', function() {
        if (!arrierePlanGris.classList.contains("ouvertureModales") || !modaleMesProjets.classList.contains("modaleMesProjetsOuverte")) {
            arrierePlanGris.classList.toggle('ouvertureModales')
            modaleMesProjets.classList.toggle('ouvertureModales')
        }
        }
    )
    const croixDeFermetureMesProjets = document.querySelector(".croixFermetureModales")
    
    croixDeFermetureMesProjets.addEventListener('click', function(){
        arrierePlanGris.classList.toggle('ouvertureModales')
        modaleMesProjets.classList.toggle('ouvertureModales')
    })
}

ouvertureEtFermetureModaleMesProjets()

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

        const figCaption = document.createElement("figcaption");
        figCaption.setAttribute("class", "classeFigCaption");
        figure.appendChild(figCaption);

        const titre = document.createElement("p");
        titre.setAttribute("class", "classTitre");
        titre.innerText = element["title"];
        figCaption.appendChild(titre);
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
  
    boutonAjouter.addEventListener('click', function() {
      if (!modaleAjouterImages.classList.contains("ouvertureModales")) {
        modaleAjouterImages.classList.toggle("ouvertureModales");
        modaleMesProjets.classList.toggle("ouvertureModales")
      }
    });
  
    croixDeFermetureAjouterImages.addEventListener('click', function() {
      modaleAjouterImages.classList.toggle('ouvertureModales');
      arrierePlanGris.classList.toggle("ouvertureModales")
    });

    const flecheRetour = document.querySelector(".flecheRetour")

    flecheRetour.addEventListener('click', function() {
        modaleAjouterImages.classList.toggle("ouvertureModales")
        modaleMesProjets.classList.toggle("ouvertureModales")
    })
  }
  
  ouvertureEtFermetureModaleAjouterImages();

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
        options.value = categorie.value
        options.textContent = categorie.name
        menuDeroulant.appendChild(options)
    })
})

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