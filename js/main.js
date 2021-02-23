var $searchValues = document.querySelector('#search');
var xhr = new XMLHttpRequest();
var requestInfo = {
  apikey: '&apikey=e7ef368c-c731-4658-8d3c-1adc7227b386',
  classification: 'person'
};
var timeout;

// xhr.open('GET', 'https://api.harvardartmuseums.org/object?page=1&apikey=e7ef368c-c731-4658-8d3c-1adc7227b386');
// xhr.responseType = 'json';
// xhr.addEventListener('load', function () {
//   // dataEntries(xhr.response.info.next);
// });
// xhr.send();


$searchValues.addEventListener('keyup', function() {
  clearTimeout(timeout);
  console.log(event.target.value);
  timeout = setTimeout(timeoutFunction, 500);
});

function timeoutFunction() {
  //send xml request
};




// function dataEntries(url) {
//   xhr = new XMLHttpRequest();
//   xhr.open('GET', url);
//   xhr.responseType = 'json';
//   xhr.send();
//   xhr.addEventListener('load', function () {
//     console.log(xhr.response);
//   });
// }
