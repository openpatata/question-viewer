An experimental GitHub Pages frontend for the `openpatata`
written question data.

## Development

1. Fork and clone the repo locally

2. Grab the latest questions dump from GitHub:

   ```sh
   git clone --branch export --depth 1 https://github.com/openpatata/openpatata-data.git build
   ```

3. Install all of our dependencies:

  ```sh
  npm install
  ```

4. Run the dev server:

  ```sh
  npm run watch
  ```

5. Hack away!

## Deployment

```sh
env NODE_ENV=production npm run build
npm run deploy
```

## License

AGPL v3.
