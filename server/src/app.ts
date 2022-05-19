import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { container } from 'tsyringe';
import AppRouter from './router/touch.router';
import { environment } from './environment';
import path from 'path';

const app = express();
const router = container.resolve(AppRouter);

const clientPath = path.resolve(__dirname, '../../client/dist/touch/')
app.use(express.static(clientPath));

console.log('Serving static files at', clientPath);

app.use(morgan('tiny'));
app.use(cors());
app.use('/api', router.routes);
app.get('*',  (req, res) => {
    res.redirect('/')
  });

app.listen(environment.PORT, () => {
    console.log('Server listening on port', environment.PORT)
});
