/* exported data */

var previousDataJSON = localStorage.getItem('ajax-project-local-storage');

var data = {
  nextEntryID: 1,
  favorites: [],
  selectedID: null,
  view: 'home-page',
  lastView: null,
  lastSearch: null
};

if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}

window.addEventListener('beforeunload', function (event) {
  data.view = 'home-page';
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('ajax-project-local-storage', dataJSON);
});
