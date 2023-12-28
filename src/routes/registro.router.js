const { Router } = require('express');
const usuariosModelo = require('../dao/models/usuarios.model')
const crypto = require('crypto');
const router = Router();

router.get('/', async (req, res) => {
    let { errorMessage } = req.query;
    let { message } = req.query;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('registro', { errorMessage, message });
});

router.post('/', async (req, res) => {
    let { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        res.status(400).redirect('/api/registro?errorMessage=Complete todos los datos');
        return;
    }

    let regMail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regMail.test(email)) {
        res.status(400).redirect('/api/registro?errorMessage=Mail con formato incorrecto...!!!');
        return;
    }

    let existe = await usuariosModelo.findOne({ email });

    if (existe) {
        res.status(400).redirect(`/api/registro?errorMessage=Existen usuarios con email ${email} en la BD`);
        return;
    }

    let rol = 'usuario';

    if (email === 'adminCoder@coder.com' && password === 'coder123') {
        rol = 'administrador';
    }

    password = crypto.createHmac("sha256", "codercoder123").update(password).digest("hex");

    try {
        let usuario = await usuariosModelo.create({ nombre, email, password, rol });
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json({ success: true, message: 'Usuario creado correctamente', usuario });
        res.redirect(`/api/login?message=Usuario ${email} registrado correctamente`);
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error inesperado' });
        res.redirect('/api/registro?error=Error inesperado. Reintente en unos minutos');
    }
});

module.exports = router;