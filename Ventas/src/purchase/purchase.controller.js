'use strict'

import Category from '../category/category.model.js'
import { encrypt, checkPassword, checkUpdate, checkUpdateCategory } from '../utils/validator.js'
import { tokenSign, verifyToken } from '../helpers/generateToken.js'
import Product from '../product/product.model.js'
import User from '../user/user.model.js'
import Cart from '../cart/cart.model.js'
import Purchase from './purchase.model.js'


export const compra = async (req, res) => {
    try {        
        const token = req.headers.authorization.split(' ')[1];        
        const decodedToken = await verifyToken(token);
        
        if (decodedToken) {            
            const userId = decodedToken._id;
        
        const cart = await Cart.findOne({ user: userId })
        if (!cart) {
            return res.status(404).send({ message: 'Cart not found' });
        }
        
        let total = 0;
        cart.products.forEach(item => {
            total += item.price * item.quantity;
        });

        // Crear la factura de compra
        const purchase = new Purchase({
            user: userId,
            products: cart.products,
            total
        });
        
        await purchase.save();        
        await Cart.deleteOne({ _id: cart._id });
        
        return res.status(200).send({ message: 'Invoice generated successfully', purchase });
        } else {
            
            return res.status(401).send({ message: 'Token inválido' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error removing product from cart' });
    }
};