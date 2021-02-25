/* exported data */

var previousDataJSON = localStorage.getItem('ajax-project-local-storage');

var data = {
  entries: [],
  nextEntryNum: 1
};

if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}

window.addEventListener('beforeunload', function (event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('ajax-project-local-storage', dataJSON);
});
