# Touch

This is a monorepo with SDAL Touch app node.js server and Angular client.

## Development

Clone the repo

Run server with ts-node

```bash
cd server
yarn install --frozen-lockfile
yarn dev
```

Run client with Angular cli

```bash
cd client
yarn install --frozen-lockfile
yarn start
```

After installing deps you can run `Ctrl+Shift+B` in VS Code to run both server and client for development.

After client app is build it will automatically be opened at <http://localhost:4200>. Any changes in code will immediately run recompiling.

## Docker

Building Docker image

```bash
yarn --cwd server build
yarn --cwd client build
docker build -t sdal-touch .
```
