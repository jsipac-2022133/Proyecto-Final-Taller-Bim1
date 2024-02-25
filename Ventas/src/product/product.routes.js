'use strict'
import express from 'express'
import { addProduct, deleteProduct, getAllProducts, searchProduct, updateProduct } from './product.controller.js'
import { checkAuth, checkRoleAuth } from "../middleware/auth.js"

const api=express.Router()

api.post('/addNewProduct', checkAuth, checkRoleAuth('ADMIN'), addProduct)
api.get('/selectProducts', checkAuth, getAllProducts)
api.put('/updateProduct/:id', checkAuth, checkRoleAuth('ADMIN'), updateProduct)
api.delete('/deleteProduct/:id', checkAuth, checkRoleAuth('ADMIN'), deleteProduct)
api.post('/search', checkAuth, searchProduct)

export default api