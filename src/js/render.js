import { elements } from './index';

export function renderGallery(itemsArray) {
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
