import fs from 'node:fs';
import chalk from 'chalk';
import logUpdate from 'log-update';
import fetch from 'node-fetch';
import readline from 'readline-sync';

let progValue = 0;
let progBlockRepeat = 0;

// create directory "memes" if it does not exist yet

if (!fs.existsSync('memes')) {
  fs.mkdirSync('memes');
}
// Show name of program and ask for a template

console.log(chalk.red.bold.bgBlue(`\nNode.js Meme Scraper\n\n`));
const template = readline.question(
  `Press Enter to download 10 memes or type in a template\n`,
);

// get custom Meme if template was entered

if (template) {
  let topText = readline.question(`Enter the top text\n`);
  let bottomText = readline.question(`Enter the bottom text\n`);
  topText = topText.replace(/ /g, '_'); // website will convert underscore into whitespace
  bottomText = bottomText.replace(/ /g, '_');

  const url = `https://api.memegen.link/images/${template}/${topText}/${bottomText}`;
  const customFilename = `memes/custom_${template}_${topText}_${bottomText}.png`;
  fetch(url)
    .then((response) => {
      response.body.pipe(fs.createWriteStream(customFilename));
    })
    .catch(() => {
      throw new Error("Couldn't download your meme. Sorry!");
    });

  // no template entered (get 10 memes from site)
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
        // jpgArray contains the pictures twice, so get rid of every other element
        jpgArray = jpgArray.filter((element, index) => {
          return index % 2 === 0;
        });
        jpgArray = jpgArray.slice(0, 10); // get first 10 elements

        // save the images

        for (let i = 0; i < 10; i++) {
          const filename = 'memes/image_no_' + [i + 1] + '.jpg'; // create filename

          progValue += 1;
          progBlockRepeat = '█' + '|█'.repeat(progValue - 1);
          // console.log(`Creating File: ${filename}`);
          logUpdate(
            chalk.red.bold(
              `\nProgress: ${progBlockRepeat} ${progValue * 10}% `,
            ),
          );

          if (i === 9) {
            console.log(chalk.red.bold.bgBlue(`\nDownload complete!\n`));
            console.log('Saved 10 files to "/memes"\n');
          }

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
