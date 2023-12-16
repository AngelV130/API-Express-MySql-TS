import express, {Request, Response } from 'express'
import ControllerPrueba from '../Controllers/ControllerPrueba';

const Router = express.Router()

Router.get('/', ControllerPrueba.index);

Router.post('/', (_req: Request, res: Response) => {
    res.status(200)
    res.send('Guardar Datos');
});

export default Router