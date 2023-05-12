import express from 'express';
import dotenv from "dotenv";
import router from './routes/auth.js';
import dbConnection from './database/config.js';
import cors from "cors";


//VARIABLES DE ENTORNO
dotenv.config();

//ACTIVACIÓN DE EXPRESS
const app = express();

//ACTIVACIÓN DE CORS
app.use(cors());

//Base de datos
dbConnection();

// app.use(cors({
//     origin: ['https://fundacion-transformando-con-pazion.vercel.app','https://fundacion-transformando-con-pazion-ieyy85za5-franklinz12.vercel.app'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     preflightContinue: true,
//     optionsSuccessStatus: 204,
// }
// ))
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', 'https://fundacion-transformando-con-pazion.vercel.app');
//     if (req.method === 'OPTIONS') {
//         res.status(200).send();
//     } else {
//         next();
//     }
// });

//Lectura y parseo del body
app.use(express.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
app.options('*', cors());
app.use(router);

//CONFIGURACIÓN DE SERVIDOR
app.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});