// const { formatters } = require("stylelint");

var $searchValues = document.querySelector('#search');
var xhr = new XMLHttpRequest();
var $entries = document.querySelector('.entries');
var timeout;
var $form = document.querySelector('form');
var $home = document.querySelector('.home');
var $searchResults = document.querySelector('.search-results');
var $row = document.querySelector('.row');
var $entriesArray = $entries.childNodes;
var $imagesArray = $row.childNodes;
var $headerTitle = document.querySelector('.title');
var $selection = document.querySelector('.selection');
var $selectionContainer = document.querySelector('.selection-container');
var dataArray = [];
var $downArrow = document.querySelector('.down-arrow');
var $modal = document.querySelector('.modal');
var isOpen = false;
var $favorites = document.querySelector('.favorites');
var $userFavorites = document.querySelector('.user-favorites');
var $favoritesRow = document.querySelector('.favorites-row');
var $favoritesImages = $favoritesRow.childNodes;
var $likeModal = document.querySelector('.like-modal');
var $cancel = document.querySelector('.cancel');
var $yes = document.querySelector('.yes');
var $loaders = document.querySelectorAll('.loader');
var $loaderPage = document.querySelector('.loader-page');
var $back = document.querySelector('.back-button');

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
  addFavoritesEntries(data.entries);
});

$downArrow.addEventListener('click', function () {
  if (isOpen || $userFavorites.className === 'user-favorites' || $likeModal.className === 'like-modal') {
    $modal.className = 'modal hidden';
    isOpen = false;
  } else {
    $modal.className = 'modal';
    isOpen = true;
  }
});

$favoritesRow.addEventListener('click', function () {
  for (var n = 0; n < $favoritesImages.length; n++) {
    if (event.target === $favoritesImages[n].firstChild) {
      data.lastView = data.view;
      data.view = 'selection-page';
      $userFavorites.className = 'user-favorites hidden';
      $selection.className = 'selection';
      renderSelection(data.entries[n]);
      var $like = document.querySelector('.heart');
      $like.style.color = 'red';
    }
  }
});

$row.addEventListener('click', function () {
  for (var n = 0; n < $imagesArray.length; n++) {
    if (event.target === $imagesArray[n].firstChild) {
      data.lastView = data.view;
      data.view = 'selection-page';
      $searchResults.className = 'search-results hidden';
      $userFavorites.className = 'user-favorites hidden';
      $selection.className = 'selection';
      renderSelection(dataArray[n]);
    }
  }
});

$entries.addEventListener('click', function () {
  for (var v = 0; v < $entriesArray.length; v++) {
    if (event.target === $entriesArray[v].firstChild) {
      data.lastView = data.view;
      data.view = 'selection-page';
      $home.className = 'home hidden';
      $userFavorites.className = 'user-favorites hidden';
      $selection.className = 'selection';
      renderSelection(dataArray[v]);
    }
  }
});

$headerTitle.addEventListener('click', function () {
  $form.reset();
  reset();
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
  var userData = $searchValues.value.split(' ').join('&');
  data.lastSearch = userData;
  sendData(userData);
}

function sendData(value) {
  xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://openaccess-api.clevelandart.org/api/artworks/?q=' + value);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    getFirst20Entries(xhr.response.data);
  });
  $loaders[0].className = 'loader';
  $loaders[1].className = 'loader';
  $loaderPage.className = 'loader-page';
  xhr.send();
}

function getFirst20Entries(data) {
  $loaders[0].className = 'loader hidden';
  $loaders[1].className = 'loader hidden';
  $loaderPage.className = 'loader-page hidden';
  dataArray = [];
  var length = 20;
  if (data.length >= 20) {
    for (var i = 0; i < length; i++) {
      if (data[i].images !== null) {
        appendEntry(data[i]);
        loadSearch(data[i]);
        renderSelectionData(data[i]);
      } else {
        length++;
      }
    }
  } else {
    for (var j = 0; j < data.length; j++) {
      appendEntry(data[j]);
      loadSearch(data[j]);
      renderSelectionData(data[j]);
    }
  }
}

function appendEntry(dataObject) {
  var $newSuggestion = document.createElement('div');
  var $h3 = document.createElement('h3');
  $newSuggestion.setAttribute('class', 'entry');
  var textContent = '';

  if (dataObject.title !== null) {
    textContent = dataObject.title;
  }
  if (dataObject.creators.length > 0) {
    textContent = textContent + ', ' + dataObject.creators[0].description;
  }
  if (dataObject.department !== null) {
    textContent = textContent + ', ' + dataObject.department;
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

function loadSearch(dataObject) {
  var $newCol = document.createElement('div');
  var $newImg = document.createElement('img');
  $newCol.setAttribute('class', 'col-half col-quarter');
  $newCol.appendChild($newImg);

  if (dataObject.images !== null) {
    $newImg.setAttribute('src', dataObject.images.web.url);
    $newImg.setAttribute('alt', dataObject.title);
  } else {
    $newImg.setAttribute('src', 'images/placeholder-image.jpg');
    $newImg.setAttribute('alt', dataObject.title);
  }

  $row.appendChild($newCol);
}

function renderSelectionData(dataObject) {
  var newObject = {
    image: '',
    title: '',
    artist: '',
    description: ''
  };
  if (dataObject.images !== null) {
    newObject.image = dataObject.images.web.url;
  } else {
    newObject.image = 'images/placeholder-image.jpg';
  }
  newObject.title = dataObject.title;
  if (dataObject.creators.length > 0) {
    newObject.artist = dataObject.creators[0].description;
  }
  newObject.description = dataObject.wall_description;
  dataArray.push(newObject);
}

function renderSelection(object) {
  removeAllChildNodes($selectionContainer);

  var $newImg = document.createElement('img');
  var $title = document.createElement('h3');
  var $like = document.createElement('i');
  var $artist = document.createElement('h4');
  var $description = document.createElement('p');

  $newImg.setAttribute('src', object.image);
  $title.textContent = object.title;
  $artist.textContent = object.artist;
  $description.textContent = object.description;
  $like.setAttribute('class', 'fas fa-heart heart');

  $selectionContainer.appendChild($newImg);
  $selectionContainer.appendChild($like);
  $selectionContainer.appendChild($title);
  $selectionContainer.appendChild($artist);
  $selectionContainer.appendChild($description);

  $like.addEventListener('click', function () {
    if ($like.style.color === 'red') {
      $likeModal.className = 'like-modal';
      data.selectedID = object.entryID;
    } else {
      $like.style.color = 'red';
      object.entryID = data.nextEntryID;
      data.entries.push(object);
      data.nextEntryID++;
    }
  });

  $cancel.addEventListener('click', function () {
    $likeModal.className = 'like-modal hidden';
  });
}

$yes.addEventListener('click', function () {
  for (var j = 0; j < data.entries.length; j++) {
    if (data.entries[j].entryID === data.selectedID) {
      data.entries.splice(j, 1);
    }
  }
  removeAllChildNodes($favoritesRow);
  addFavoritesEntries(data.entries);
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
  for (var i = 0; i < arrayOfObjects.length; i++) {
    var $newCol = document.createElement('div');
    var $newImg = document.createElement('img');
    $newCol.setAttribute('class', 'col-half-fav col-quarter');
    $newCol.appendChild($newImg);
    $newImg.setAttribute('src', arrayOfObjects[i].image);
    $newImg.setAttribute('alt', arrayOfObjects[i].title);
    $favoritesRow.appendChild($newCol);
  }
}
