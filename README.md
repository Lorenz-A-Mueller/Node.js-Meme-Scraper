# Node.js Meme-Scraper

## Functionality:

- The program asks for a template first. If no template is required, the program will fetch the first 10 meme pictures from 'https://memegen-link-examples-upleveled.netlify.app/' and save them to a directory "memes" inside the current directory. "Memes" is created first if it doesn't exist yet.
- If a template is entered, the program will request top-text and bottom-text next.. It will then fetch the corresponding template with the added text add save it to the folder "memes" with a generic filename.
