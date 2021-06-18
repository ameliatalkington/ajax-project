// const { formatters } = require("stylelint");

const $searchValues = document.querySelector('#search');
const $entries = document.querySelector('.entries');
let timeout;
const $form = document.querySelector('form');
const $home = document.querySelector('.home');
const $searchResults = document.querySelector('.search-results');
const $row = document.querySelector('.row');
const $entriesArray = $entries.childNodes;
const $imagesArray = $row.childNodes;
const $headerTitle = document.querySelector('.title');
const $selection = document.querySelector('.selection');
const $selectionContainer = document.querySelector('.selection-container');
const $downArrow = document.querySelector('.down-arrow');
const $modal = document.querySelector('.modal');
let isOpen = false;
const dataArray = [];
const $favorites = document.querySelector('.favorites');
const $menuSearch = document.querySelector('.menu-search');
const $userFavorites = document.querySelector('.user-favorites');
const $favoritesRow = document.querySelector('.favorites-row');
const $favoritesImages = $favoritesRow.childNodes;
const $likeModal = document.querySelector('.like-modal');
const $cancel = document.querySelector('.cancel');
const $yes = document.querySelector('.yes');
const $loaders = document.querySelectorAll('.loader');
const $loaderPage = document.querySelector('.loader-page');
const $back = document.querySelector('.back-button');
const $noResults = document.querySelector('.no-results');
const $okButton = document.querySelector('.ok');

$okButton.addEventListener('click', function () {
  $form.reset();
  reset();
  $home.className = 'home';
  $noResults.className = 'no-results hidden';
});

$back.addEventListener('click', function () {
  if (data.lastView === 'favorites-page') {
    $selection.className = 'selection hidden';
    $userFavorites.className = 'user-favorites';
    data.lastView = data.view;
    data.view = 'favorites-page';
  } else if (data.lastView === 'home-page') {
    $selection.className = 'selection hidden';
    $home.className = 'home';
    data.lastView = data.view;
    data.view = 'home-page';
  } else if (data.lastView === 'search-results-page') {
    $selection.className = 'selection hidden';
    $searchResults.className = 'search-results';
    data.lastView = data.view;
    data.view = 'search-results-page';
  }
});

$favorites.addEventListener('click', function () {
  removeAllChildNodes($favoritesRow);
  data.lastView = data.view;
  data.view = 'favorites-page';
  $modal.className = 'modal hidden';
  isOpen = false;
  $home.className = 'home hidden';
  $searchResults.className = 'search-results hidden';
  $selection.className = 'selection hidden';
  $userFavorites.className = 'user-favorites';
  addFavoritesEntries(data.favorites);
});

$menuSearch.addEventListener('click', function () {
  dataArray.length = 0;
  data.lastView = data.view;
  data.view = 'home-page';
  $modal.className = 'modal hidden';
  isOpen = false;
  $form.reset();
  reset();
  $home.className = 'home';
  $searchResults.className = 'search-results hidden';
  $selection.className = 'selection hidden';
  $userFavorites.className = 'user-favorites hidden';
});

$downArrow.addEventListener('click', function () {
  if (isOpen || $likeModal.className === 'like-modal' || $noResults.className === 'no-results') {
    $modal.className = 'modal hidden';
    isOpen = false;
  } else {
    $modal.className = 'modal';
    isOpen = true;
  }
});

$favoritesRow.addEventListener('click', function () {
  for (let a = 0; a < $favoritesImages.length; a++) {
    if (event.target === $favoritesImages[a].firstChild) {
      data.lastView = data.view;
      data.view = 'selection-page';
      $userFavorites.className = 'user-favorites hidden';
      $selection.className = 'selection';
      renderSelection(data.favorites[a]);
      const $like = document.querySelector('.heart');
      $like.style.color = 'red';
    }
  }
});

$row.addEventListener('click', function () {
  for (let b = 0; b < $imagesArray.length; b++) {
    if (event.target === $imagesArray[b].firstChild) {
      data.lastView = data.view;
      data.view = 'selection-page';
      $searchResults.className = 'search-results hidden';
      $userFavorites.className = 'user-favorites hidden';
      $selection.className = 'selection';
      renderSelection(dataArray[b]);
      const $like = document.querySelector('.heart');
      for (let c = 0; c < data.favorites.length; c++) {
        if (dataArray[b].image === data.favorites[c].image) {
          $like.style.color = 'red';
        }
      }
    }
  }
});

$entries.addEventListener('click', function () {
  for (let d = 0; d < $entriesArray.length; d++) {
    if (event.target === $entriesArray[d].firstChild) {
      data.lastView = data.view;
      data.view = 'selection-page';
      $home.className = 'home hidden';
      $userFavorites.className = 'user-favorites hidden';
      $selection.className = 'selection';
      renderSelection(dataArray[d]);
      const $like = document.querySelector('.heart');
      for (let e = 0; e < data.favorites.length; e++) {
        if (dataArray[d].image === data.favorites[e].image) {
          $like.style.color = 'red';
        }
      }
    }
  }
});

$headerTitle.addEventListener('click', function () {
  dataArray.length = 0;
  reset();
  $form.reset();
  data.lastView = data.view;
  data.view = 'home-page';
  $modal.className = 'modal hidden';
  $home.className = 'home';
  $searchResults.className = 'search-results hidden';
});

$searchValues.addEventListener('keyup', function () {
  clearTimeout(timeout);
  reset();
  timeout = setTimeout(timeoutFunction, 500);
});

$form.addEventListener('submit', function () {
  event.preventDefault();
  data.lastView = data.view;
  data.view = 'search-results-page';
  $home.className = 'home hidden';
  $searchResults.className = 'search-results';
});

function timeoutFunction() {
  const userData = $searchValues.value.split(' ').join('+');
  data.lastSearch = userData;
  sendData(userData);
}

function sendData(value) {
  fetch(`https://api.artic.edu/api/v1/artworks/search?q=${value}&limit=20`)
    .then(res => res.json())
    .then(data => getFirst20Entries(data.data));
}

function getFirst20Entries(data) {
  $loaders[0].className = 'loader hidden';
  $loaders[1].className = 'loader hidden';
  $loaderPage.className = 'loader-page hidden';

  if (data.length) {
    for (let f = 0; f < data.length; f++) {
      let imageURL = '';
      fetch(`https://api.artic.edu/api/v1/artworks/${data[f].id}`)
        .then(res => res.json())
        .then(dataId => {
          fetch(`https://api.artic.edu/api/v1/artworks/${dataId.data.id}?fields=id,title,image_id`)
            .then(res => res.json())
            .then(data => {
              imageURL = `${data.config.iiif_url}/${data.data.image_id}/full/843,/0/default.jpg`;
              appendEntry(dataId.data);
              loadSearch(dataId.data, imageURL);
              renderSelectionData(dataId, imageURL);
            });
        });
    }
  } else {
    $home.className = 'home hidden';
    $noResults.className = 'no-results';
  }
}

function appendEntry(dataObject) {
  const $newSuggestion = document.createElement('div');
  const $h3 = document.createElement('h3');
  $newSuggestion.setAttribute('class', 'entry');
  let textContent = '';

  if (dataObject.title !== null) {
    textContent = dataObject.title;
  }
  if (dataObject.artist_title) {
    textContent = textContent + ', ' + dataObject.artist_title;
  }
  if (dataObject.medium_display !== null) {
    textContent = textContent + ', ' + dataObject.medium_display;
  }

  $h3.textContent = textContent;

  $newSuggestion.appendChild($h3);
  $entries.appendChild($newSuggestion);
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function loadSearch(dataObject, imageURL) {
  const $newCol = document.createElement('div');
  const $newImg = document.createElement('img');
  $newCol.setAttribute('class', 'col-half col-quarter');
  $newCol.appendChild($newImg);
  $newImg.style.cursor = 'pointer';

  if (dataObject.images !== null) {
    $newImg.setAttribute('src', imageURL);
    $newImg.setAttribute('alt', dataObject.title);
  } else {
    $newImg.setAttribute('src', 'images/placeholder-image.jpg');
    $newImg.setAttribute('alt', dataObject.title);
  }

  $row.appendChild($newCol);
}

function renderSelectionData(dataObject, imageURL) {
  const newObject = {
    image: '',
    title: '',
    artist: '',
    exhibitionHistory: ''
  };
  if (imageURL) {
    newObject.image = imageURL;
  } else {
    newObject.image = 'images/placeholder-image.jpg';
  }
  newObject.title = dataObject.data.title;
  if (dataObject.data.artist_title) {
    newObject.artist = dataObject.data.artist_title;
  }
  newObject.exhibitionHistory = dataObject.data.exhibition_history;

  dataArray.push(newObject);
}

function renderSelection(object) {
  removeAllChildNodes($selectionContainer);

  const $newImg = document.createElement('img');
  const $title = document.createElement('h3');
  const $like = document.createElement('i');
  const $artist = document.createElement('h4');
  const $exhibitionHistory = document.createElement('p');

  $newImg.setAttribute('src', object.image);
  $title.textContent = object.title;
  $artist.textContent = object.artist;
  $exhibitionHistory.textContent = object.exhibitionHistory;
  $like.setAttribute('class', 'fas fa-heart heart');
  $like.style.cursor = 'pointer';

  $selectionContainer.appendChild($newImg);
  $selectionContainer.appendChild($like);
  $selectionContainer.appendChild($title);
  $selectionContainer.appendChild($artist);
  $selectionContainer.appendChild($exhibitionHistory);

  $like.addEventListener('click', function () {
    if ($like.style.color === 'red') {
      $likeModal.className = 'like-modal';
      data.selectedID = object.entryID;
    } else {
      $like.style.color = 'red';
      object.entryID = data.nextEntryID;
      data.favorites.push(object);
      data.nextEntryID++;
    }
  });

  $cancel.addEventListener('click', function () {
    $likeModal.className = 'like-modal hidden';
  });
}

$yes.addEventListener('click', function () {
  for (let g = 0; g < data.favorites.length; g++) {
    if (data.favorites[g].entryID === data.selectedID) {
      data.favorites.splice(g, 1);
    }
  }
  removeAllChildNodes($favoritesRow);
  addFavoritesEntries(data.favorites);
  $likeModal.className = 'like-modal hidden';
  $selection.className = 'selection hidden';
  $userFavorites.className = 'user-favorites';
});

function reset() {
  removeAllChildNodes($row);
  removeAllChildNodes($entries);
  removeAllChildNodes($selectionContainer);
}

function addFavoritesEntries(arrayOfObjects) {
  for (let h = 0; h < arrayOfObjects.length; h++) {
    const $newCol = document.createElement('div');
    const $newImg = document.createElement('img');
    $newImg.style.cursor = 'pointer';
    $newCol.setAttribute('class', 'col-half-fav col-quarter');
    $newCol.appendChild($newImg);
    $newImg.setAttribute('src', arrayOfObjects[h].image);
    $newImg.setAttribute('alt', arrayOfObjects[h].title);
    $favoritesRow.appendChild($newCol);
  }
}
