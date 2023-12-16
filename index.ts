import express, { json } from 'express';
import Router from './app/Routes/Routes';
import env from './Env';


const app = express();

const { PORT } = env;

app.use(json());

app.use('/api',Router)

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
