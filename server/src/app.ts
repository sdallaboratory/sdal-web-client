import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { container } from 'tsyringe';
import AppRouter from './router/touch.router';
import { environment } from './environment';

const app = express();
const router = container.resolve(AppRouter);

app.use(express.static('../client/dist/touch/'));
app.use(morgan('tiny'));
app.use(cors());
app.use('/api', router.routes);

app.listen(environment.PORT, () => {
    console.log(`Server listening on port ${environment.PORT}...`)
});
