import fetch from 'node-fetch';

fetch('https://memegen-link-examples-upleveled.netlify.app/')
  .then((res) => res.text())
  .then((text) => {
    try {
      console.log(JSON.stringify(text));
    } catch (err) {
      console.log(err);
    }
  });
