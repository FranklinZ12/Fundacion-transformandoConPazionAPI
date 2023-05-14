import { response } from "express";
import { ModeloUsuario } from "../models/Usuario.js";
import bcrypt from 'bcryptjs';
import { generarJWT } from "../helpers/jwt.js";
import { enviarEmailDeVerificacion } from "../helpers/email.js";
import jwt from 'jsonwebtoken';

const crearUsuario = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        let usuario = await ModeloUsuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: `Usuario existente con el correo ${email}`
            });
        }
        usuario = new ModeloUsuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        //Generar token de verificación de email
        const emailVerificationToken = await generarJWT(usuario.id, usuario.name, '1h');

        //Asignar el token de verificación al usuario
        usuario.emailVerificationToken = emailVerificationToken; 
        await usuario.save(); //Guardar el usuario con el token de verificación
        //Enviar email de verificación
        const emailEnviado = await enviarEmailDeVerificacion(usuario.email, usuario.name, emailVerificationToken);
        if (!emailEnviado) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al enviar el email de verificación',
            });
        }

        res.status(201).json({
            ok: true,
            uid: usuario._id,
            name: usuario.name,
            token: token,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor, verifique los datos',
        });
    }
}

const loginUsuario = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        const usuario = await ModeloUsuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: `Usuario no existente con el correo ${email}`
            });
        };

        //confirmar los passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        };

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario._id,
            name: usuario.name,
            token: token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor, verifique los datos',
        });
    }
}

const revalidarToken = async (req, res = response) => {
    const { uid, name } = req;

    //generar nuevo token
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token
    });
}

const verificarEmail = async (req, res = response) => {
    const { token } = req.params;
    try {
        const { uid, name, exp } = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await ModeloUsuario.findById(uid);
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no existente'
            });
        }
        if (usuario.isEmailVerified) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo electrónico ya ha sido verificado'
            });
        }
        if (new Date(exp * 1000) < new Date()) {
            return res.status(400).json({
                ok: false,
                msg: 'El token ha expirado'
            });
        }
        usuario.isEmailVerified = true;
        await usuario.save();
        res.json({
            ok: true,
            msg: 'Correo electrónico verificado'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al verificar el correo electrónico'
        });
    }
}
export { crearUsuario, loginUsuario, revalidarToken, enviarEmailDeVerificacion, verificarEmail };