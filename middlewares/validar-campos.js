import { response } from 'express';
import { validationResult } from 'express-validator';

const validarCampos = (req, res = response, next) => {
    //manejo de errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errores: errores.mapped()
        });
    }
    next();
}

export default validarCampos;