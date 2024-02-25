'user strict'

import express from "express"
import { test, register, getAllUsers, login, updateMyAccount, deleteMyAccount } from "./user.controller.js"
import { checkAuth, checkRoleAuth } from "../middleware/auth.js"

const api=express.Router()

api.get('/test', test)
api.post('/register', register)
api.post('/login',login)
api.put('/updateMyAcount',updateMyAccount)
api.delete('/deleteMyAccount', deleteMyAccount)
api.get('/select', getAllUsers)

export default api