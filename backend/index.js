//----------------------------------------------------------------------------------------------------------------------------------------------------
//IMPOSTAZIONE INIZIALE EXPRESS
import express, { json, urlencoded } from 'express';                       //gestione di tutta l'app (middleware, routes, richieste HTTP)
const app = express();
import cors from 'cors';

app.use(cors({                              //Imposta automaticamente l'header della risposta iniziale che il server da ad un client di un altro dominio
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use(json());                            //Permette dei payload ti tipo json nelle richieste e risposte HTTP
app.use(urlencoded({ extended: true }));    //Permette dei payload ti tipo URL nelle richieste e risposte HTTP
//----------------------------------------------------------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------------------------------------------------------
//CONNESSIONE AL DATABASE E RECUPERO MODELLI
import mongoose from 'mongoose';

//nell'uri c'è il link del cluster e anche l'indirizzamento al database giusto "/selfie"
const uri = 'mongodb+srv://matteopanicciari:p4PmhXtwmXgTvBFi@cluster0.mv96qkb.mongodb.net/selfie?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(uri);
mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));
mongoose.connection.on("reconnected", () => console.log("Reconnected to MongoDB"));
mongoose.connection.on("disconnected", () => console.log("Disconnected from MongoDB"));
mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err));

import {User, Team, Event} from './schemas.js';   //recupero dei modelli
//----------------------------------------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------------------------------------
//IMPOSTAZIONE COOKIE DI SESSIONE   DEBUG: da capire come portarlo su angular
//express-session genera un cookie da inviare al browser di chi si collega per la prima volta, il cookie contiene un id della sessione da utilizzare per nuove connessioni
import expressSession from 'express-session';
app.use(
    expressSession({
        secret: "yourSecretKey",        //firma dei cookie della sessione DEBUG: da cambiare in qualcosa di complesso in teoria
        resave: false,                  //se va risalvata la sessione ogni volta anche se non è stata modificata
        saveUninitialized: false,       //salva solo le sessioni che contengono effettivamente dati
        cookie: {
            secure: false,              //se fosse true, i cookie verrebbero inviati solo per HTTPs
            httpOnly: true,
            maxAge: 1000*60*60          //durata massima della sessione: 1 ora
        }
    })
);
//----------------------------------------------------------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------------------------------------------------------
//SET PASSPORT
import passport, { ensureAuthenticated } from './auth.js'; // Importa passport e ensureAuthenticated
import LocalStrategy from 'passport-local'          //strategia utilizzata per il login, in questo caso è local, cioè il solito username e password, ma potrebbe essere anche il login attraverso google, github, facebook...

app.use(passport.initialize());
app.use(passport.session());
//----------------------------------------------------------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------------------------------------------------------
//IMPOSTAZIONE ROUTES API
import eventRoutes from './api/events.js';          //Importa le route da events.js
app.use('/api/events', eventRoutes);                //tutte le routes definite in events.js saranno annidate sotto /api/events
import authRoutes from './api/access.js';             //Importa le route da auth.js
app.use('/api/auth', authRoutes);                   //tutte le routes definite in events.js saranno annidate sotto /api/auth
//----------------------------------------------------------------------------------------------------------------------------------------------------


// Listen on default port 3000
app.listen(3000, () => {
    console.log("Server running on port 3000");
});