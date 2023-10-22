import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const elements = {
  form: document.querySelector('form.search-form'),
  gallery: document.querySelector('ul.gallery'),
};

elements.form.addEventListener('submit', searchHandler);

async function searchHandler(event) {
  event.preventDefault();
  const serchParameter = event.currentTarget.elements.searchQuery.value;
  try {
    const response = await imageSearchService(serchParameter);
    const itemsArray = response.hits;
    console.log(itemsArray);
    if (!itemsArray.length) {
      console.log(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    renderGallery(itemsArray);
  } catch (error) {
    console.log(error);
  }
}

function imageSearchService(serchParameter) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '40203420-04db41a8a9312c45ba95b8564';
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: serchParameter,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });
  return fetch(`${BASE_URL}?${searchParams}`).then(response => {
    console.log(response);
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
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
  elements.gallery.innerHTML = markup;
  const lightbox = new SimpleLightbox('ul.gallery .gallery-link');
}
