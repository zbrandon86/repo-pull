'use strict';

const pullUrl = `https://api.github.com/search/repositories`;

function listenForm(){
  $('form').submit(event => {
    event.preventDefault();
    const searchName = $('#user-handle').val();

    pullRepo(searchName);
    
    console.log('listen ran');
  })
}

function displayData(responseJson){
  $('#results-list').empty();
  const results = responseJson.items.map((item, index) => htmlResults(item));
  $('#results-list').html(results);

  $('#results').removeClass('hidden');
}

function htmlResults(result) {
  return `
    <div>
      <h2>
      <a class="js-result-name" href="${result.html_url}" target="_blank">${result.name}</a> by <a class="js-user-name" href="${result.owner.html_url}" target="_blank">${result.owner.login}</a></h2>
      <p>Number of watchers: <span class="js-watchers-count">${result.watchers_count}</span></p>
      <p>Number of open issues: <span class="js-issues-count">${result.open_issues}</span></p>
    </div>
  `;
}


function queryParam(param){
  const queryItems = Object.keys(param)
  .map(key => `${key}=${param[key]}`)
  return queryItems.join('&');
}

function pullRepo(searchId){
  const params = {
    q: `${searchId} in:description`,
    per_page: 5
  };
  const queryStr = queryParam(params)
  const url = pullUrl + '?' + queryStr;

  console.log(url);
  const options = {
    headers: new Headers({
      Accept: 'application/vnd.github.v3+json'})
    
  };


fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayData(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}


$(listenForm);