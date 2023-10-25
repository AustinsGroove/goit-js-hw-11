import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { renderGallery } from './render';
import { imageSearchService } from './searchService';

Notiflix.Notify.init({
  width: '300px',
  position: 'right-top',
  distance: '20px',
  borderRadius: '10px',
  opacity: 1,
  timeout: 5000,
});

const elements = {
  form: document.querySelector('form.search-form'),
  gallery: document.querySelector('ul.gallery'),
  loadMoreBtn: document.querySelector('button.load-more'),
  endNotify: document.querySelector('p.end-notify'),
};

elements.form.addEventListener('submit', searchHandler);
elements.loadMoreBtn.addEventListener('click', loadMoreHandler);

let searchParameter;
let lightbox;
let totalHits;
let page = 1;
let perPage = 40;

async function searchHandler(event) {
  event.preventDefault();
  newSearch();
  searchParameter = event.currentTarget.elements.searchQuery.value.trim();
  if (!searchParameter) {
    console.log('Please enter your search query!');
    Notiflix.Notify.failure('Please enter your search query!');
    return;
  }
  try {
    const response = await imageSearchService(searchParameter);
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

async function loadMoreHandler() {
  elements.loadMoreBtn.classList.add('hidden');
  page += 1;
  try {
    const response = await imageSearchService(searchParameter);
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

function newSearch() {
  page = 1;
  if (!elements.loadMoreBtn.classList.contains('hidden')) {
    elements.loadMoreBtn.classList.add('hidden');
  }
  if (!elements.endNotify.classList.contains('hidden')) {
    elements.endNotify.classList.add('hidden');
  }
  elements.gallery.innerHTML = '';
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

export { elements, page, perPage };
