const { Router } = require('express');
const usuariosModelo = require('../dao/models/usuarios.model')
const crypto = require('crypto');

const router = Router();

router.get('/', (req, res) => {
    let { error, message } = req.query;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('login', { error, message });
});

router.post('/', async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        res.status(400).redirect('/api/login?error=Complete todos los datos'); 
        return;
    }

    password = crypto.createHmac("sha256", "codercoder123").update(password).digest("hex");

    let usuario = await usuariosModelo.findOne({ email, password });

    if (!usuario) {
        res.status(401).redirect(`/api/login?error=credenciales incorrectas`); 
        return;
    }

    req.session.usuario = {
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
    };

    res.redirect('/home');
});

module.exports = router;