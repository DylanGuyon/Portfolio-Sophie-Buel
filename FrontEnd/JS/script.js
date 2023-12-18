async function getWorks(){
    const res = await fetch('http://localhost:5678/api/works');
    const works = await res.json();

    // Utilisation d'une boucle for. 
    // Dans ta boucle for créer une constante pour work 

    

    for(let work of works){
        const projet = `<figure>
        <img src="${work.imageUrl}" alt="Abajour Tahina">
        <figcaption>${work.title}</figcaption>
    </figure>`
    

    const affichage = document.querySelector('.gallery').insertAdjacentHTML('beforeend', projet)
    const btnTrier = document.querySelector('.sort-button');
    const btnTous = document.querySelector('.tous-button');
    const galleryContainer = document.getElementById('gallery-container');
    

    // Tous

    btnTous.addEventListener("click", function() {
        const projetTous = works;
        console.log(projetTous);

        galleryContainer.innerHTML = '';

        projetTous.forEach(function(allWorks){
            const projetAll = `<figure>
                <img src="${allWorks.imageUrl}" alt="${allWorks.title}">
                <figcaption>${allWorks.title}</figcaption>
            </figure>`;
            galleryContainer.insertAdjacentHTML('beforeend', projetAll);
        });
    })
    }
}

getWorks();

async function generateModalImages(){
    const res3 = await fetch('http://localhost:5678/api/works');
    const modalimg = await res3.json();

    for(let work2 of modalimg){
        const projet3 = `<figure class="modal-img">
        <img src="${work2.imageUrl}"  id="${work2.id}" alt="Abajour Tahina">
        <button class="trash-button">
            <i class="fa-solid fa-trash-can" style="color: #ffffff;"></i>
        </button>
        </figure>`

        const affichage3 = document.querySelector('.modal-galery').insertAdjacentHTML('beforeend', projet3)
    }
}

generateModalImages()

function deleteImage(imageId) {
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:5678/api/works/${imageId}`,
        headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
            Authorization: `Bearer ${myToken}`,
        },
        success: function (data) {
            const imageElement = document.getElementById(imageId);
            if (imageElement) {
                imageElement.parentNode.remove(); 
            }
        },
        error: function (error) {
            console.error('Erreur lors de la suppression de l\'image', error);
        }
    });
}

$(function () {
    $(document).on("click", ".trash-button", function (event) {
        var imageId = $(this).closest('figure').find('img').attr('id');
        deleteImage(imageId);
        event.stopPropagation();
        return false;
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const addWorkForm = document.querySelector('.add-workform');
    const imageInput = document.getElementById('imageInput');
    const addImgLabel = document.querySelector('.addImgLabel');

    imageInput.addEventListener('change', function () {
        if (imageInput.files.length > 0) {
            const formData = new FormData();
            formData.append('image', imageInput.files[0]);
    
            // Afficher la prévisualisation de l'image
            const reader = new FileReader();
            reader.onload = function (e) {
                const labelimg = `<img src="${e.target.result}" class="imgDisplay">`;
                const affichage5 = document.querySelector('.addImgLabel').insertAdjacentHTML('beforeend', labelimg);
                addImgLabel.querySelector('p').innerHTML = '';
                addImgLabel.style.backgroundColor = '#E8F1F7';
            };
            reader.readAsDataURL(imageInput.files[0]);
    
        } else {
            addImgLabel.innerHTML = `<p>+ Ajouter photo</p>`;
        }
    });

    addWorkForm.addEventListener('submit', async function (event) {
        event.preventDefault(); 

        const formData = new FormData(addWorkForm);
        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${myToken}`,
                },
                body: formData,
            });

            if (response.ok) {
                const newWork = await response.json();

                // Ajouter la nouvelle image à la galerie
                const newWorkElement = document.createElement('figure');
                newWorkElement.innerHTML = `
                    <img src="${newWork.imageUrl}" alt="${newWork.title}">
                    <figcaption>${newWork.title}</figcaption>
                `;
                galleryContainer.appendChild(newWorkElement);

                // Réinitialiser le formulaire
                addWorkForm.reset();

            } else {
                console.error('Erreur lors de l\'ajout de l\'image');
            }
        } catch (error) {
            console.error('Erreur de réseau', error);
        }
    });
});

async function generateModalCategories(){
    const res4 = await fetch('http://localhost:5678/api/categories');
    const modalcat = await res4.json();

    for(let work3 of modalcat){
        const projet4 = `<option class="selectCategoryElement" id="${work3.name}" value="${work3.id}">${work3.name}</option>`

        const affichage4 = document.querySelector('.selectCategory').insertAdjacentHTML('beforeend', projet4)
    }
}

generateModalCategories()

async function generateButtons(){
    const res2 = await fetch('http://localhost:5678/api/categories');
    const categories = await res2.json();

    for(let category of categories){
        const projet2 = `<div class="filters-button" id="button-${category.id}">
        <p>${category.name}</p>
        </div>`

        const affichage2 = document.querySelector('.filters').insertAdjacentHTML('beforeend', projet2)

        // Sélectionnez tous les boutons avec la classe commune
    const filterButtons = document.querySelectorAll('.filters-button');

    // Ajoutez un gestionnaire d'événements à chaque bouton
    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            // Obtenez l'ID à partir du bouton cliqué
            const categoryIdToFilter = parseInt(button.id.split('-')[1]);

            // Filtrer et afficher les éléments correspondants
            filterWorksByCategory(categoryIdToFilter);
        });
    });
    }  
}

async function filterWorksByCategory(categoryId) {
    const res = await fetch('http://localhost:5678/api/works');
    const works = await res.json();

    // Filtrer les éléments en fonction de la catégorie
    const filteredWorks = works.filter(function (work) {
        return work.categoryId === categoryId;
    });

    // Effacer le contenu actuel de la galerie
    const galleryContainer = document.getElementById('gallery-container');
    galleryContainer.innerHTML = '';

    // Ajouter les nouvelles images filtrées à la galerie
    filteredWorks.forEach(function (filteredWork) {
        const projetFiltre = `<figure>
            <img src="${filteredWork.imageUrl}" alt="${filteredWork.title}">
            <figcaption>${filteredWork.title}</figcaption>
        </figure>`;
        galleryContainer.insertAdjacentHTML('beforeend', projetFiltre);
    });
}

generateButtons()


// récupération du token de connexion
const myToken = localStorage.getItem('token');

function userConnected() {
    if(myToken === localStorage.token){
        const logout = document.querySelector('.logIn');
        logout.innerHTML = '<a href="#">logout</a>';

        logout.addEventListener("click", (event) => { 
            event.preventDefault();          
            localStorage.removeItem("token");
            location.reload();
        });

        const banner = document.querySelector('.headband');
        banner.classList.add('active');

        const filtres = document.querySelector('.filters');
        filtres.classList.add('inactive');

        const modify = document.querySelector('.btntest');
        modify.classList.add('active');
    }
}

userConnected();

document.addEventListener('DOMContentLoaded', function () {

    var modalBtn = document.querySelector('.btntest');

    var modal = document.getElementById('modal-container');

    var closeModalBtn = document.querySelector('.close-modal');
    var closeModalBtn2 = document.querySelector('.close-modal2');

    var addPhotoBtn = document.querySelector('.add-picture');

    var returnModalBtn = document.querySelector('.return');

    modalBtn.addEventListener('click', function () {
        modal.classList.add('active')
        document.body.style.overflow = 'hidden'; // Pour empêcher le défilement de la page lorsque la modal est ouverte
    });

    closeModalBtn.addEventListener('click', function () {
        modal.classList.remove('active')
        document.body.style.overflow = 'auto'; // Rétablissement du défilement de la page lorsque la modal est fermée
    });

    closeModalBtn2.addEventListener('click', function () {
        modal.classList.remove('active')
        document.body.style.overflow = 'auto'; // Rétablissement du défilement de la page lorsque la modal est fermée
    });

    // Ferme la modale si l'utilisateur clique en dehors de la modale
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.classList.remove('active')
            document.body.style.overflow = 'auto';
        }
    });
    
    addPhotoBtn.addEventListener('click', function() {
        const modalgalery = document.querySelector('.modal-1');
        const modaladdimage = document.querySelector('.modal-2');
        modalgalery.classList.add('inactive');
        modaladdimage.classList.add('active');
    })

    returnModalBtn.addEventListener('click', function(){
        const modalgalery2 = document.querySelector('.modal-1');
        const modaladdimage2 = document.querySelector('.modal-2');
        modalgalery2.classList.remove('inactive');
        modaladdimage2.classList.remove('active');
    })
});