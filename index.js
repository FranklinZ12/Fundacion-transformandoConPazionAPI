import express from 'express';
import dotenv from "dotenv";
import router from './routes/auth.js';
import dbConnection from './database/config.js';
import cors from "cors";
import {readdir} from "fs/promises";
import { join } from 'path';


//VARIABLES DE ENTORNO
dotenv.config();

//ACTIVACIÓN DE EXPRESS
const app = express();

//Base de datos
dbConnection();

//ACTIVACIÓN DE CORS
app.use(cors());

// Directorio Público
app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json());

async function addRoutes(app) {
    const files = await readdir(join(process.cwd(), "routes"));
    const routes = files.map((file) => import(`./routes/${file}`));
    const resolvedRoutes = await Promise.all(routes);
    resolvedRoutes.forEach((route) => app.use("/", route.default));
}

addRoutes(app).catch((err) => {
    console.error(err);
    process.exit(1);
});


app.use(router);

//CONFIGURACIÓN DE SERVIDOR
app.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});