import express from 'express';
import dotenv from "dotenv";
import router from './routes/auth.js';
import dbConnection from './database/config.js';
// import allowCors from './allowCors.js';
import cors from "cors";


//VARIABLES DE ENTORNO
dotenv.config();

//ACTIVACIÓN DE EXPRESS
const app = express();

//Base de datos
dbConnection();

//ACTIVACIÓN DE CORS
// app.use(cors({
//     origin: whiteList,
// }
// ));
// app.use(allowCors);
app.use(cors({
    origin: ['https://fundacion-transformando-con-pazion.vercel.app','https://fundacion-transformando-con-pazion-ieyy85za5-franklinz12.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}
))
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});

// Directorio Público
app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json());

app.use(router);

//CONFIGURACIÓN DE SERVIDOR
app.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});