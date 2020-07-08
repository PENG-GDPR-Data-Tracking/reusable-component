console.log('hi from app.js');

let counter = 0;
const callAndLog = url => {
  const callCounter = counter++;
  document.querySelector('#log').innerHTML += `Call id:${callCounter}, ${url}<br>`;

  // Using fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  fetch(url)
    .then(res => res.text())
    .then(text => {
      document.querySelector('#log').innerHTML += `Response id:${callCounter}, url: ${url}, responseBody: ${text}<br>`;
    })
}

const test = url => {
  const howManyTimes = 1000;
  const promises = [];
  const singleTest = () => fetch(url);

  const t0 = performance.now();

  for (i = 0; i < howManyTimes; i++) {
    promises.push(singleTest());
  }

  Promise.all(promises)
    .then(() => {
      const t1 = performance.now();
      console.log(`Calling fetch ${howManyTimes} times took ${t1 - t0} milliseconds.`)
    })
    .catch(console.err);

}


