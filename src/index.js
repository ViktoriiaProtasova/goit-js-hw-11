import Notiflix from 'notiflix';
import { fetchImages } from './fetchImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('input');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let limit = 40;
let lightbox = null;

formEl.addEventListener('submit', handleSubmitForm);
loadMoreBtn.addEventListener('click', handlePagination);

async function handleSubmitForm(event) {
  event.preventDefault();

  if (inputEl.value.trim() === '') {
    clearMarkup();
    hideLoadMoreButton();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  try {
    page = 1;
    clearMarkup();
    const data = await fetchImages(inputEl.value, page, limit);

    if (data.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      galleryMarkup(data.hits);
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      showLoadMoreButton();
    }
  } catch (error) {
    Notiflix.Notify.failure('Sorry, something went wrong. Try again later.');
  }
}

async function handlePagination() {
  try {
    page += 1;
    const data = await fetchImages(inputEl.value, page, limit);
    galleryMarkup(data.hits);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (page * limit >= data.total) {
      hideLoadMoreButton();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    Notiflix.Notify.failure('Sorry, something went wrong. Try again later.');
  }
}

function galleryMarkup(fetchedImages) {
  const markup = fetchedImages
    .map(
      image => `
        <div style="flex-basis: 360px; border-bottom-right-radius: 2px; border-bottom-left-radius: 2px; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.54);
  -webkit-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.54);
  -moz-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.54);">
          <a class="gallery-link" href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" style="display: block; width: 100%; height: 220px"></a>
          <ul style="display: flex; list-style: none; justify-content: space-evenly; padding-left: 0">
            <li style="text-align: center; height: 50px"><b>Likes</b><p>${image.likes}</p></li>
            <li style="text-align: center; height: 50px"><b>Views</b><p>${image.views}</p></li>
            <li style="text-align: center; height: 50px"><b>Comments</b><p>${image.comments}</p></li>
            <li style="text-align: center; height: 50px"><b>Downloads</b><p>${image.downloads}</p></li>
          </ul>
        </div>
      `
    )
    .join('');

  galleryContainer.style.display = 'flex';
  galleryContainer.style.justifyContent = 'center';
  galleryContainer.style.flexWrap = 'wrap';
  galleryContainer.style.columnGap = '20px';
  galleryContainer.style.rowGap = '20px';
  galleryContainer.innerHTML += markup;

  refreshLightbox();
}

function clearMarkup() {
  galleryContainer.innerHTML = '';
}

function showLoadMoreButton() {
  loadMoreBtn.style.display = 'block';
}

function hideLoadMoreButton() {
  loadMoreBtn.style.display = 'none';
}

function refreshLightbox() {
  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.gallery-link', {
      captionDelay: 250,
      animationSlide: false,
    });
  }
}
