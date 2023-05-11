import { Router } from 'express';
import { crearUsuario, loginUsuario, revalidarToken } from '../controllers/auth.js';
import { check } from 'express-validator';
import validarCampos from '../middlewares/validar-campos.js';
import validarJWT from '../middlewares/validar-jwt.js';

const router = Router();

router.post('/api/auth/new',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('lastname', 'El apellido es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres o mas').isLength({ min: 6 }),
        validarCampos,
    ],
    crearUsuario
);

router.post('/api/auth/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres o mas').isLength({ min: 6 }),
        validarCampos,
    ],
    loginUsuario);

router.get('/api/auth/renew', validarJWT, revalidarToken);


export default router;