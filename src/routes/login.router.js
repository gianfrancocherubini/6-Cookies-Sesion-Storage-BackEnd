const { Router } = require('express');
const usuariosModelo = require('../dao/models/usuarios.model')
const crypto = require('crypto');

const router=Router()


router.get('/',(req,res)=>{

    let {error, message}=req.query

    res.setHeader('Content-Type','text/html')
    res.status(200).render('login', {error, message})
})


router.post('/', async(req, res)=>{

    let {email, password}=req.body
    if(!email || !password){
        return res.redirect('/api/login?error=Complete todos los datos')
    }

    password=crypto.createHmac("sha256", "codercoder123").update(password).digest("hex")

    let usuario=await usuariosModelo.findOne({email, password})
    if(!usuario){
        return res.redirect(`/api/login?error=credenciales incorrectas`)
    }
    
    req.session.usuario={
        nombre:usuario.nombre, 
        email:usuario.email,
        rol: usuario.rol
    }

    res.redirect('/home')

})

module.exports = router ;