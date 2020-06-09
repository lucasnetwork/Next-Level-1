import express from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import {celebrate,Joi} from 'celebrate'

import PointsController from './controllers/PointsController'
import ItensController from './controllers/ItensController'

const routes = express.Router()
const upload = multer(multerConfig)
const itensController = new ItensController
const pointsController = new PointsController
routes.get('/itens',itensController.index)

routes.get('/points',pointsController.index)
routes.post(
	"/points",upload.single("image"),
	celebrate({
		body:Joi.object().keys({
			name:Joi.string().required(),
			email:Joi.string().required().email(),
			whatsaap:Joi.number().required(),
			latitude:Joi.number().required(),
			longitude:Joi.number().required(),
			city:Joi.string().required(),
			uf:Joi.string().required().max(2),
			itens:Joi.string().required()
		})
	},{
		abortEarly:false
	}) ,pointsController.create)

routes.get('/points/:id',pointsController.show)
export default routes;
`
{
	"name":"Mercado b",
	"email":"Contato@imperatriz.com.br",
	"whatsaap":"12345678",
	"latitude":"23.190",
	"longitude":"-21.3321",
	"city":"imperatriz",
	"uf":"MA",
	"itens":[
		1
	]
}

`