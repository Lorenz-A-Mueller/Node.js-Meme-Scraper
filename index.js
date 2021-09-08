import fs from 'node:fs';
import fetch from 'node-fetch';

let pageString = '';

fetch('https://memegen-link-examples-upleveled.netlify.app/')
  .then((res) => res.text())
  .then((text) => {
    try {
      pageString = JSON.stringify(text);
      console.log(pageString);
      let jpgArray = pageString.match(
        /https:\/\/api\.memegen\.link\/images(.)*?\.jpg/g,
      );
      console.log(jpgArray); // why doubled?

      jpgArray = jpgArray.filter((element, index) => {
        return index % 2 === 0;
      });
      console.log(jpgArray);

      jpgArray = jpgArray.slice(0, 10); // it contains 10 pics now

      console.log(jpgArray);

      // save the images

      for (let i = 0; i < 10; i++) {
        let filename = 'memes/image_no_' + [i + 1] + '.jpg'; // create filename
        console.log(filename);
        console.log('memes/image.jpg');
        console.log(jpgArray[i]);
        fetch(jpgArray[i]).then((response) => {
          response.body.pipe(fs.createWriteStream(filename));
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
