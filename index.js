import express from 'express';
import dotenv from "dotenv";
import router from './routes/auth.js';
import dbConnection from './database/config.js';
import cors from "cors";


//VARIABLES DE ENTORNO
dotenv.config();

//ACTIVACIÓN DE EXPRESS
const app = express();

//Base de datos
dbConnection();

//ACTIVACIÓN DE CORS
app.use(cors({
    origin: 'https://fundacion-transformando-con-pazion.vercel.app',
    "options":{
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    }
}
));

// Directorio Público
app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://fundacion-transformando-con-pazion.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.use(router);

//CONFIGURACIÓN DE SERVIDOR
app.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});