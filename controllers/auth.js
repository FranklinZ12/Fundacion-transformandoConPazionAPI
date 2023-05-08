import { response } from "express";
import { ModeloUsuario } from "../models/Usuario.js";
import bcrypt from 'bcryptjs';
import { generarJWT } from "../helpers/jwt.js";

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

export { crearUsuario, loginUsuario, revalidarToken };