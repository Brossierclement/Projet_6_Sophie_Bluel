// Récupération des données API :

let images = [];
// Permet de garder en stock "let images", les modifications sont uniquement sur "ImagesCourantes".
let imagesCourantes = [];

async function recuperationImages() {
    const reponse = await fetch("http://localhost:5678/api/works");
    return await reponse.json();
}

// async function recuperationImages(callback) {
//     const reponse = await fetch("http://localhost:5678/api/works");
//     const resultat = await reponse.json();
//     callback(resultat);
// }

// recuperationImages(exemple)
// function exemple(donnees) {
//     console.log(donnees)
//     images = donnees;
//     galerieImages()
// }

function galerieImages() {
    const galerie = document.querySelector(".gallery");
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

async function updateGallery() {
    images = await recuperationImages()
    imagesCourantes = images;
    galerieImages()
}

updateGallery();

// -------------------------------------------------------------------------

async function recuperationCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    return await reponse.json();
}

function filtrage(categorie) {
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
    galerieImages()
}

async function categoriesAffichage() {
    const conteneurCategories = document.querySelector(".category");
    const categories = await recuperationCategories();
    let categoriesIndex = 0;
    const boutonTous = document.createElement("button");
    boutonTous.setAttribute("class", "classBoutonTous");
    boutonTous.innerText = "Tous";
    conteneurCategories.appendChild(boutonTous);

    boutonTous.addEventListener('click', function() {
        imagesCourantes = images;
        galerieImages()
    })

    for (categoriesIndex = 0; categoriesIndex < categories.length; categoriesIndex++) {
        const element = categories[categoriesIndex];
        
        const boutonCategories = document.createElement("button");
        boutonCategories.setAttribute("class", "classBoutonCategories");
        conteneurCategories.appendChild(boutonCategories);
        boutonCategories.innerText = element["name"];
        console.log(boutonCategories);

        boutonCategories.addEventListener('click', function() {
            filtrage(element['name']);
        })
    }
}

categoriesAffichage()

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

function ouvertureModaleMesProjets() {
    let boutonModifierMesProjets = document.querySelector(".modificationImageProjets")

    boutonModifierMesProjets.addEventListener('click', function() {
        document.querySelector('.arrierePlanGris').style.display = 'block'
        document.querySelector(".modaleMesProjets").style.display = 'block'
    })
}

ouvertureModaleMesProjets()

function fermetureModaleMesProjets() {
    let croixDeFermetureMesProjets = document.querySelector(".mesProjetsFermeture")

    croixDeFermetureMesProjets.addEventListener('click', function(){
        document.querySelector(".arrierePlanGris").style.display = 'none'
        document.querySelector(".modaleMesProjets").style.display = 'none'
    })
}

fermetureModaleMesProjets()