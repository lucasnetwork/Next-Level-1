import {Request,Response} from 'express'
import knex from '../database/connection'


class PointsController{
    async index(request:Request,response:Response){
        const {city,uf,itens} = request.query
        const parsedItens = String(itens)
                .split(',')
                .map(item =>Number(item.trim()))
        const points = await knex('points')
            .join('point_itens','points.id','=', 'point_itens.point_id')
            .whereIn('point_itens.item_id',parsedItens)
            .where('city',String(city))
            .where('uf',String(uf))
            .distinct()
            .select('points.*')
            console.log(points)

            const serializedPoints = points.map(point =>{
                return{
                    ...point,
                    image_url:`http://129.168.1.12:3333/uploads/${point.image}`
                }
            })
        
        return response.json(serializedPoints)
    }       

    //SERIALIZALÇAO
    //api transforms
    async show(request:Request,response:Response){
        const {id} = request.params

        const point = await knex('points').where('id', id).first();

        if(!point){
            return response.status(400).json({message:'Point not found'})
        }
        const serializedPoint = {
                ...point,
                image_url:`http://129.168.1.12:3333/uploads/${point.image}`,
            }
        const itens = await knex('itens')
            .join('point_itens','itens.id', '=', 'point_itens.item_id')
            .where('point_itens.point_id',id)
            .select('itens.title')
        return response.json({point:serializedPoint,itens})
    }
    async create (request:Request,response:Response){
        const {
            name,
            email,
            whatsaap,
            latitude,
            longitude,
            city,
            uf,
            itens
        } = request.body
        const trx = await knex.transaction()
        const point ={
            image: request.file.filename,
            name,
            email,
            whatsaap,
            latitude,
            longitude,
            city,
            uf
        }
        const insertedIds = await trx('points').insert(point)
        const point_id = insertedIds[0]
        const pointItens = itens
            .split(',')
            .map((item:string) => Number(item.trim()))
            .map((item_id: number) => {
            return{
                item_id,
                point_id
            }
        })
        console.log(pointItens)
    
        await trx('point_itens').insert(pointItens)
        await trx.commit()
        return response.json({
            id:point_id,
            ...point
        })
    }
}

export default PointsController