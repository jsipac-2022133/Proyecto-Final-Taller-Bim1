'use strict'

import express from 'express'
import { checkAuth, checkRoleAuth } from '../middleware/auth.js'
import { addToCart, removeFromCart } from './cart.controller.js'

const api=express.Router()

api.post('/addToCart', checkAuth, addToCart)
api.delete('/deleteFromCart/:productId', checkAuth, removeFromCart)

export default api