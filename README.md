# daily-drawing-prompt

This project display a daily drawing prompt. The content is extracted from <a href="https://www.simpledailydrawing.com/">Simple Daily Drawing</a> and stored in this repository. The app uses Sveltekit for the frontend, which loads the prompt from a json file deployed with the frontend. The content is added by the extractor script via Github Actions.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```