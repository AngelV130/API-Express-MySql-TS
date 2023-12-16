import PruebaModel from "../Models/Prueba"
import { Response, Request } from "express"

export default class ControllerPrueba {
    static async index(_req:Request,res:Response){
        try {
            const prueba = new PruebaModel()
            const sqlRes = await prueba.select(["id","nombre"]).where("id","=",1).execute()
            res.status(200)
            res.send({
                status: 200,
                msj: "Query Satisfactoria",
                data: sqlRes
            })
        } catch (error) {
            console.log(error)
            res.status(400)
            res.send({
                status: 400,
                msj: error
            })
        }
    }
}