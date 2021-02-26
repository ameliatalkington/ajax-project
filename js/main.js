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

$favorites.addEventListener('click', function () {
  $modal.className = 'modal hidden';
  isOpen = false;
  $home.className = 'home hidden';
  $searchResults.className = 'search-results hidden';
  $selection.className = 'selection hidden';
  $userFavorites.className = 'user-favorites';
  removeAllChildNodes($favoritesRow);
  addFavoritesEntries(data.entries);
});

$downArrow.addEventListener('click', function () {
  if (isOpen) {
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
  $home.className = 'home hidden';
  $searchResults.className = 'search-results';
});

function timeoutFunction() {
  var data = $searchValues.value.split(' ').join('&');
  sendData(data);
}

function sendData(value) {
  xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://openaccess-api.clevelandart.org/api/artworks/?q=' + value);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    getFirst10Entries(xhr.response.data);
  });
  xhr.send();
}

function getFirst10Entries(data) {
  dataArray = [];
  if (data.length >= 10) {
    for (var i = 0; i < 10; i++) {
      appendEntry(data[i]);
      loadSearch(data[i]);
      renderSelectionData(data[i]);
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
  object.setEntryNum = data.nextEntryNum;

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
      $like.style.color = 'lightgray';
      $likeModal.className = 'like-modal';
    } else {
      $like.style.color = 'red';
      data.entries.push(object);
      data.nextEntryNum++;
    }
  });

  $cancel.addEventListener('click', function () {
    $userFavorites.className = 'user-favorites hidden';
    $likeModal.className = 'like-modal hidden';
    $like.style.color = 'red';
  });

  $yes.addEventListener('click', function () {
    for (var j = 0; j < data.entries.length; j++) {
      if (data.entries[j].title === object.title) {
        data.entries.splice(j, 1);
        $likeModal.className = 'like-modal hidden';
        $selection.className = 'selection hidden';
        $userFavorites.className = 'user-favorites';
        removeAllChildNodes($favoritesRow);
        addFavoritesEntries(data.entries);
      }
    }
  });
}

function reset() {
  removeAllChildNodes($row);
  removeAllChildNodes($entries);
  removeAllChildNodes($selectionContainer);
}

function addFavoritesEntries(arrayOfObjects) {

  for (var i = 0; i < arrayOfObjects.length; i++) {
    var $newCol = document.createElement('div');
    var $newImg = document.createElement('img');
    $newCol.setAttribute('class', 'col-full col-half');
    $newCol.appendChild($newImg);
    $newImg.setAttribute('src', arrayOfObjects[i].image);
    $newImg.setAttribute('alt', arrayOfObjects[i].title);
    $favoritesRow.appendChild($newCol);
  }

}
