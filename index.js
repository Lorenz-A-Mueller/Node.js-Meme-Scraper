import fs from 'node:fs';
import chalk from 'chalk';
import fetch from 'node-fetch';
import readline from 'readline-sync';

let answerArray = [];

// create directory "memes" if it does not exist yet

if (!fs.existsSync('memes')) {
  fs.mkdirSync('memes');
}
console.log(chalk.red.bold.bgBlue(`\nNode.js Meme Scraper\n\n`));
const answer = readline.question(
  `Press Enter to download 10 memes.\nYou can also enter three words to create a custom meme. (Format: top, bottom, meme-template)\n`,
);

// stretch goal

if (answer) {
  answerArray = answer.split(' ');
  console.log(answerArray);

  if (answerArray[1] && answerArray[2]) {
    const url = `https://api.memegen.link/images/${answerArray[2]}/${answerArray[0]}/${answerArray[1]}`;
    const customFilename = `memes/custom_${answerArray[0]}_${answerArray[1]}_${answerArray[2]}.png`;
    fetch(url)
      .then((response) => {
        response.body.pipe(fs.createWriteStream(customFilename));
      })
      .catch(() => {
        throw new Error("Couldn't download your meme. Sorry!");
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
        // jpgArray contains the pics twice (for some reason)

        // get rid of every other element
        jpgArray = jpgArray.filter((element, index) => {
          return index % 2 === 0;
        });
        jpgArray = jpgArray.slice(0, 10); // get first 10 elements

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
