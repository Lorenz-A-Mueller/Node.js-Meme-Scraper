import fs from 'node:fs';
import fetch from 'node-fetch';

let pageString = '';

fetch('https://memegen-link-examples-upleveled.netlify.app/')
  .then((res) => res.text())
  .then((text) => {
    try {
      pageString = JSON.stringify(text);
      console.log(pageString);

      // look for https://api.memegen.link/images...........jpg

      let jpgArray = pageString.match(
        /https:\/\/api\.memegen\.link\/images(.)*?\.jpg/g,
      );
      console.log(jpgArray); // contains the pics twice (for some reason)

      // get rid of every other element
      jpgArray = jpgArray.filter((element, index) => {
        return index % 2 === 0;
      });
      jpgArray = jpgArray.slice(0, 10); // get first 10 elements
      console.log(jpgArray);

      // save the images

      for (let i = 0; i < 10; i++) {
        const filename = 'memes/image_no_' + [i + 1] + '.jpg'; // create filename
        console.log(filename);
        console.log(jpgArray[i]);
        fetch(jpgArray[i])
          .then((response) => {
            response.body.pipe(fs.createWriteStream(filename));
          })
          .catch(() => {
            throw new Error('Cannot download memes');
          });
      }
    } catch {
      throw new Error('Cannot load data from URL');
    }
  })
  .catch(() => {
    throw new Error('Could not find URL');
  });
