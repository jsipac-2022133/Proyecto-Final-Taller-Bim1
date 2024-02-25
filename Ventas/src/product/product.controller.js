'use strict'
import Category from '../category/category.model.js'
import {checkUpdateCategory} from '../utils/validator.js'
import Product from './product.model.js'

//AGREGAR PRODUCTO
export const addProduct=async(req,res)=>{
    try {
        let data=req.body

        let category=await Category.findOne({_id: data.category})
        if(!category) return res.status(404).send({message: 'Category not found'})

        let product=new Product(data)
        await product.save()
        return res.send({message: 'Product saved successfully'})

    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error saving product'})
    }
}


//MOSTRAR
export const getAllProducts = async (req, res) => {
    try {
        let products = await Product.find().populate('category'); 
        if (products.length === 0) return res.status(404).send({ message: 'No hay productos que mostrar' });
        return res.send({ products });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al obtener productos' });
    }
}


//ACTUALIZAR
export const updateProduct=async(req,res)=>{
    try {
        let {id}=req.params
        let data=req.body

        let update=checkUpdateCategory(data,id)
        if(!update) return res.status(400).send({message: 'Have submitted data that cannot be update or missing data'})

        let updatedProduct=await Product.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        ).populate('category', ['name'])

        if(!updatedProduct) return res.status(404).send({message: 'Product not found and not updated'})
        return res.send({message: 'Product updated successfully', updatedProduct})
        
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating product'})
    }
}

//ELIMINAR
export const deleteProduct=async(req,res)=>{
    try {
        let {id}=req.params

        let deletedProduct=await Product.deleteOne({_id: id})
        if(deletedProduct.deleteCount==0) return res.status(404).send({message: 'Product not found and not deleted'})
        return res.send({message: 'Deleted product successfully'})

    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deleting product'})
    }
}

//BUSCAR
export const searchProduct=async(req,res)=>{
    try {
        let {search} =req.body
        
        let products=await Product.find(
            {name: search}
        ).populate('category', ['name'])

        if(products.length==0) return res.status(404).send({message: 'Product not found'})
        return res.send({message: 'Product found', products})    

    } catch (error) {
        console.error(error)
    }
}




















