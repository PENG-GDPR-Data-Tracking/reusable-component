let counter = 0;

const call = url => {
  const callCounter = counter++;
  document.querySelector('#log').innerHTML += `Call id:${callCounter}, ${url}<br>`;

  // Using fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  fetch(url)
    // fetch(url, { mode: 'no-cors' })
    .then(res => res.text())
    .then(text => {
      document.querySelector('#log').innerHTML += `Response id:${callCounter}, url: ${url}, responseBody: ${text}<br>`;
    })
} 
