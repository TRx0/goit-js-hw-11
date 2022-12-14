import Notiflix from 'notiflix';
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const refs = {
input: document.querySelector('input'),
form: document.querySelector('.search-form'),
loadButton: document.querySelector('.load-more'),
gallery: document.querySelector('.gallery'),
alert: document.querySelector('.alert')
}

const BASE_URL = "https://pixabay.com/api/";

refs.form.addEventListener('submit', (onFormSubmit));
refs.loadButton.addEventListener('click', (onLoadMoreBtn))

let isAlertVisible = false;
let nameSearch = refs.input.value;
let lightbox;
let currentPage = 1;
let perPage = 40;
const totalPages = 500 / perPage;



refs.loadButton.classList.add('invisible');


async function fetchImages() {
    try {
        const response = await axios.get(`${BASE_URL}?key=29309322-ee9bc20eed6bcd222e62c0560&image_type=photo&orientation=horizontal&safesearch=true&q=${nameSearch}&page=${currentPage}&per_page=${perPage}`);
         const arrayImages = await response.data.hits;
       
         if(arrayImages.length === 0) {
            Notiflix.Notify.warning(
            "Sorry, there are no images matching your search query. Please try again.")
        } if (arrayImages.length !== 0) {
            refs.loadButton.classList.remove('invisible')
            refs.loadButton.classList.remove('none');
        } if(currentPage === Math.ceil(response.data.totalHits / 40)){
            toggleAlertPopup()
            refs.loadButton.classList.add('none');
        }
        return {arrayImages,
            totalHits: response.data.totalHits,}       
        
    } catch(error) {
        console.log(error)
    }
}

    
function onFormSubmit(e) {    
e.preventDefault()
    currentPage = 1;
  refs.gallery.innerHTML = '';
  nameSearch = refs.input.value;
  nameSearch;
  
//   refs.loadButton.classList.add('invisible')

  fetchImages() 
    .then(images => {
      insertMarkup(images);
      currentPage += 1;
    }).catch(error => (console.log(error)))
    
 
    lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionPosition: 'bottom',
        captionDelay: 250,
    });
}



function onLoadMoreBtn(){
    // if (totalPages <= currentPage) {
    // refs.loadButton.classList.add('invisible');
    // toggleAlertPopup();
    // }
    
    nameSearch = refs.input.value;

    fetchImages() 
    .then(images => {
      insertMarkup(images);   
      currentPage += 1;})
    .catch(error => (console.log(error)))
}


const createMarkup = img => `
  <div class="photo-card">
         <a href="${img.largeImageURL}" class="gallery_link">
          <img class="gallery__image" src="${img.webformatURL}" alt="${img.tags}" width="370px" loading="lazy" />
          </a>
        <div class="info">
              <p class="info-item">
              <b>Likes<br>${img.likes}</b>
              </p>
              <p class="info-item">
              <b>Views<br>${img.views}</b>
              </p>
              <p class="info-item">
              <b>Comments<br>${img.comments}</b>
              </p>
              <p class="info-item">
              <b>Downloads<br>${img.downloads}</b>
              </p>
        </div>
    </div>
`; 


function generateMarkup(  { arrayImages, totalHits }) {
    if (currentPage === 1) {
        Notiflix.Notify.success(`Hoooray! We found ${totalHits} images!`);
    }
    return arrayImages.reduce((acc, img) => acc + createMarkup(img), "") 
};


function insertMarkup(arrayImages) {
    const result = generateMarkup(arrayImages);   
    refs.gallery.insertAdjacentHTML('beforeend', result);

 lightbox.refresh();
};


function toggleAlertPopup() {
    if (isAlertVisible) {
      return;
    }
    isAlertVisible = true;
    refs.alert.classList.add("is-visible");
    setTimeout(() => {
      refs.alert.classList.remove("is-visible");
      isAlertVisible = false;
    }, 2000);
};
