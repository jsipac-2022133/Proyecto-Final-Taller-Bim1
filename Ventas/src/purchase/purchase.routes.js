'use strict'

import express from 'express'
import { checkAuth, checkRoleAuth } from '../middleware/auth.js'
import { compra } from './purchase.controller.js'

const api=express.Router()

api.get('/compra', checkAuth, compra)

export default api