//DEFINIR ESQUEMAS
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const UsuarioSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    emailVerificationToken: {
        type: String,
        default: null
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    }
});
const ModeloUsuario = model('Usuario', UsuarioSchema);

export { ModeloUsuario };