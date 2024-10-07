//----------------------------------------------------------------------------------------------------------------------------------------------------
//IMPOSTAZIONE INIZIALE EXPRESS
import express, { json, urlencoded } from "express";                       //gestione di tutta l'app (middleware, routes, richieste HTTP)
const app = express();
import cors from "cors";

app.use(cors());                            //Imposta automaticamente l'header della risposta iniziale che il server da ad un client di un altro dominio
app.use(json());                            //Permette dei payload ti tipo json nelle richieste e risposte HTTP
app.use(urlencoded({ extended: true }));    //Permette dei payload ti tipo URL nelle richieste e risposte HTTP
//----------------------------------------------------------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------------------------------------------------------
//IMPOSTAZIONE ROUTES API
import eventRoutes from './routes/events.js';                 //Importa le route da events.js
app.use('/api/events', eventRoutes);                       //tutte le routes definite in events.js saranno annidate sotto /api
//----------------------------------------------------------------------------------------------------------------------------------------------------


// Listen on default port 3000
app.listen(3000, () => {
    console.log("Server running on port 3000");
});