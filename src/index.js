import './sass/main.scss';
import './css/styles.css';
import Notiflix from 'notiflix';
import NewsApiService from './news-service';
import articlesTpl from './templates/photo-card.hbs';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
  searchForm: document.querySelector('.search-form'),
  articlesContainer: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
}

const newsApiService = new NewsApiService();
refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreButton.addEventListener('click', onLoadMore);

let screenHits = 0;

loadButtonHide();
function onSearch(e) {
  e.preventDefault();
  newsApiService.query = e.currentTarget.elements.searchQuery.value;
  
  newsApiService.resetPage();
  loadButtonHide();
  newsApiService.fetchArticles().then(({ hits, totalHits }) => {
    loadButtonShow();
    clearArticlesContainer();
    
    screenHits = 0;
    screenHits += hits.length;
    if (totalHits === 0) {
      loadButtonHide();
      return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
    appendArticlesMarkup(hits);
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    const { height: cardHeight } = document
      .querySelector(".gallery")
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  });
}

function onLoadMore() {
  newsApiService.fetchArticles().then(({ hits, totalHits }) => {
    appendArticlesMarkup(hits);
    const { height: cardHeight } = document
      .querySelector(".gallery")
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
    screenHits += hits.length;
    if (screenHits >= totalHits) {
      loadButtonHide();
      Notiflix.Notify.warning('We are sorry, but you have reached the end of search results.');
    }
  });
}

function appendArticlesMarkup(hits) {
  refs.articlesContainer.insertAdjacentHTML('beforeend', articlesTpl(hits));
  new SimpleLightbox('.gallery a');
  
}

function clearArticlesContainer() {
  refs.articlesContainer.innerHTML = '';
}

function loadButtonHide() {
  refs.loadMoreButton.classList.add('is-hidden');
}

function loadButtonShow() {
  refs.loadMoreButton.classList.remove('is-hidden');
}

