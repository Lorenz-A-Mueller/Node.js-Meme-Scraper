import fs from 'node:fs';
import fetch from 'node-fetch';

// stretch goal

if (process.argv[2]) {
  if (process.argv[3] && process.argv[4]) {
    const url = `https://api.memegen.link/images/${process.argv[4]}/${process.argv[2]}/${process.argv[3]}`;
    const customFilename = `memes/custom_${process.argv[4]}_${process.argv[2]}_${process.argv[3]}.png`;
    fetch(url).then((response) => {
      response.body.pipe(fs.createWriteStream(customFilename));
    });
  } else {
    console.log('Please give 3 inputs!');
  }

  // default program
} else {
  let pageString = '';

  fetch('https://memegen-link-examples-upleveled.netlify.app/')
    .then((res) => res.text())
    .then((text) => {
      try {
        pageString = JSON.stringify(text);

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
          console.log(`Creating File: ${filename}`);
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
}
