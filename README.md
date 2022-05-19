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

После сборки клиентского приложения автоматически откроется браузер по адресу <http://localhost:4200>. Любые изменения в коде клиента или сервера немедленно приведут к перекомпиляции.

Для сборки Docker-образа

```bash
yarn --cwd server build
yarn --cwd client build
docker build -t sdal-touch .
```
