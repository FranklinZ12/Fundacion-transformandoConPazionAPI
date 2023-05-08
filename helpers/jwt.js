import jwt from 'jsonwebtoken';

const generarJWT = (uid, name) => {
    return new Promise((resolve, reject) => {
        const payload = {
            uid,
            name
        };
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('Error al generar el token');
            } else {
                resolve(token);
            }
        });
    });
}

export { generarJWT };