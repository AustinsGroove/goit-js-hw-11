import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios').default;

const elements = {
  form: document.querySelector('form.search-form'),
  gallery: document.querySelector('ul.gallery'),
  loadMoreBtn: document.querySelector('button.load-more'),
  endNotify: document.querySelector('p.end-notify'),
};

let serchParameter;
let lightbox;
let totalHits;
let page = 1;
let perPage = 40;

elements.form.addEventListener('submit', searchHandler);
elements.loadMoreBtn.addEventListener('click', loadMoreFn);

Notiflix.Notify.init({
  width: '300px',
  position: 'right-top',
  distance: '20px',
  borderRadius: '10px',
  opacity: 1,
  timeout: 5000,
});

async function searchHandler(event) {
  event.preventDefault();
  page = 1;
  if (!elements.loadMoreBtn.classList.contains('hidden')) {
    elements.loadMoreBtn.classList.add('hidden');
  }
  if (!elements.endNotify.classList.contains('hidden')) {
    elements.endNotify.classList.add('hidden');
  }
  elements.gallery.innerHTML = '';
  serchParameter = event.currentTarget.elements.searchQuery.value;
  try {
    const response = await imageSearchService(serchParameter);
    const itemsArray = response.hits;
    totalHits = response.totalHits;
    if (totalHits) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    if (!itemsArray.length) {
      console.log(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    renderGallery(itemsArray);
    lightbox = new SimpleLightbox('ul.gallery .gallery-link');
    loadMoreBtnAdd();
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(`${error}`);
  }
}

async function loadMoreFn() {
  elements.loadMoreBtn.classList.add('hidden');
  page += 1;
  try {
    const response = await imageSearchService(serchParameter);
    const itemsArray = response.hits;
    totalHits = response.totalHits;
    renderGallery(itemsArray);
    lightbox.refresh();
    loadMoreBtnAdd();
    smoothScrollGallery();
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(`${error}`);
  }
}

function imageSearchService(serchParameter) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '40203420-04db41a8a9312c45ba95b8564';
  const searchParams = {
    key: API_KEY,
    q: serchParameter,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: perPage,
    page,
  };
  return axios
    .get(BASE_URL, {
      params: searchParams,
    })
    .then(response => {
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
}

function renderGallery(itemsArray) {
  const markup = itemsArray
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <li class="gallery-item">
            <a class="gallery-link" href="${largeImageURL}">
                <div class="photo-card">
                    <img class="gallery-image" src=${webformatURL} alt=${tags} loading="lazy" />
                    <div class="info">
                        <p class="info-item"><b>Likes</b><br>${likes}</p>
                        <p class="info-item"><b>Views</b><br>${views}</p>
                        <p class="info-item"><b>Comments</b><br>${comments}</p>
                        <p class="info-item"><b>Downloads</b><br>${downloads}</p>
                    </div>
                </div>
            </a>
        </li>
      `
    )
    .join('');
  elements.gallery.insertAdjacentHTML('beforeend', markup);
}

function loadMoreBtnAdd() {
  const totalPages = Math.ceil(totalHits / perPage);
  if (totalPages > page) {
    elements.loadMoreBtn.classList.remove('hidden');
  } else {
    elements.endNotify.classList.remove('hidden');
  }
}

function smoothScrollGallery() {
  const { height } = elements.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}
