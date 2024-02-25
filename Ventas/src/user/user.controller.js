'use strict'
import Usuario from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { tokenSign, verifyToken } from '../helpers/generateToken.js'

export const test=(req,res)=>{
    return res.send('Hello World')
}

//MOSTRAR
export const getAllUsers=async(req,res)=>{
    try {
        let usuarios=await Usuario.find()
        if(usuarios.length===0) return res.status(404).send({message: 'No hay usuarios que mostrar'})
        return res.send({usuarios})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error al obtener usuarios'})
    }
}


//REGISTRAR
export const register=async(req,res)=>{
    try {
        let data=req.body
        data.password=await encrypt(data.password)
        if(data.email.includes('@kinal.org')) data.role='ADMIN'
        if(!data.email.includes('@kinal.org')) data.role='CLIENT'

        let user=new Usuario(data)
        await user.save()

        return res.send({message: 'Registered Successfully'})

    } catch (error) {
        console.error(error)
        return res.satus(500).send({message: 'Error registering user', error})
    }
}

//LOGIN
export const login=async(req,res)=>{
    try {
        let {username, password}=req.body
        let user=await Usuario.findOne({username})
        const tokenSession=await tokenSign(user)

        if(user && await checkPassword(password, user.password)){
            let loggerUser={
                username: user.username,
                name: user.name,
                role: user.role,
                tokenSession
            }

            return res.send({message: `Welcome ${user.name}`, loggerUser})
        }
        return res.status(404).send({message: 'User or password incorrect'})

    } catch (error) {
        console.error(error)
        return res.satus(500).send({message: 'Error login in', error})
    }
}

export const updateMyAccount=async(req,res)=>{
    try {        
        const token = req.headers.authorization.split(' ')[1];        
        const decodedToken = await verifyToken(token);
        
        if (decodedToken) {            
            const userId = decodedToken._id;            
            const data = req.body;    
            
            const updateUser = await Usuario.findOneAndUpdate(
                { _id: userId }, 
                data, 
                { new: true } 
            );
            
            if (!updateUser) {
                return res.status(404).send({ message: 'Usuario no encontrado o no actualizado' });
            }            
            return res.send({ message: 'Usuario actualizado exitosamente', updateUser });

        } else {            
            return res.status(401).send({ message: 'Token inválido' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al actualizar usuario', error });
    }
}


export const deleteMyAccount = async (req, res) => {
    try {        
        const token = req.headers.authorization.split(' ')[1];        
        const decodedToken = await verifyToken(token);
        
        if (decodedToken) {            
            const userId = decodedToken._id;           
            const deletedUser = await Usuario.findByIdAndDelete(userId);
            
            if (!deletedUser) {
                return res.status(404).send({ message: 'Usuario no encontrado o no eliminado' });
            }            
            return res.send({ message: 'Usuario eliminado exitosamente' });
        } else {            
            return res.status(401).send({ message: 'Token inválido' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al eliminar usuario', error });
    }
};