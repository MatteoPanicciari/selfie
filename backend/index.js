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
//IMPOSTAZIONE ROUTES API
import eventRoutes from './api/events.js';          //Importa le route da events.js
app.use('/api/events', eventRoutes);                //tutte le routes definite in events.js saranno annidate sotto /api/events
//import authRoutes from './api/auth.js';             //Importa le route da auth.js
//app.use('/api/auth', authRoutes);                   //tutte le routes definite in events.js saranno annidate sotto /api/auth
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
import passport from 'passport';                    //gestione autenticazione
import LocalStrategy from 'passport-local'          //strategia utilizzata per il login, in questo caso è local, cioè il solito username e password, ma potrebbe essere anche il login attraverso google, github, facebook...    

app.use(passport.initialize());
app.use(passport.session());

//se viene trovato l'username e la password corrisponde, chiamiamo done (null, user), altrimenti (null, false, error_message) o done(err)
passport.use(
    //il done ritorna al passport.authenticate le informazioni sull'autenticazione
    new LocalStrategy(async (username, password, done) => {
        console.log('LocalStrategy');
        try {
            const user = await User.findOne({ username });
            if(!user){
                console.log("incorrect username");
                return done(null, false, { message: "Incorrect username or password." });      //username errato
            }
            if(password != user.cryptedPassword) {
                console.log("incorrect password");
                return done(null, false, { message: "Incorrect username or password." });  //password errata
            }
            console.log("Accesso Effettuato");
            return done(null, user);      //autenticazione riuscita
        } catch (err) {
            console.log("Altro errore nell'accesso");
            return done(err);     //altri errori
        }
    })
);

//Serializzazione: appena l'utente inserisce bene le credenziali, passport si salva l'id in modo da ricordarlo successivamente e non salvarsi altre informazioni
passport.serializeUser((userId, done) => {
    console.log('Serialize');
    done(null, userId); // serializza l'id utente
});

//Deserializzazione: quando l'app ha bisogno delle informazioni dell'utente, chiama questa per farsi restituire l'oggetto user e ricavare info utili
passport.deserializeUser(async (id, done) => {
    console.log('Deserialize');
    try {
        const user = await User.findById(id);
        done(null, user); //chiama done(), funzione di passport che gestisce success/error o fail
    } catch (err) {
        done(err); // Handle errors during deserialization
    }
});

// middleware per mantenere l'autenticazione dell'utente, se non è autenticato, lo mandiamo al login
const ensureAuthenticated = (req, res, next) => {
    console.log('EnsureAutheticated');
    if (req.isAuthenticated()) {
      return next(); // User is authenticated, mandiamo al prossimo middleware
    }
    res.redirect("/api/auth/login"); // Redirect if not authenticated
};
//----------------------------------------------------------------------------------------------------------------------------------------------------


//DEBUG: da togliere e mettere in auth.js  
app.post("/api/auth/login", (req, res, next) => {
    //DEBUG: riscritta per comprensione, guardare i push precedenti per la versione minimizzata carina
    const passportAuthenticate = passport.authenticate("local", function(err, user, info) {
        console.log('Passport Authenticated');
        if(err) return res.status(500).json({ success: false, message: 'Errore del server.' });
        if(!user) return res.status(401).json({ success: false, message: info });
        req.logIn(user, (err) => {  //richiamo di serializeUser()
            console.log('logIn');
            if (err) {
                return res.status(500).json({ success: false, message: 'Login fallito.' });
            }
            return res.status(200).json({ success: true, message: 'Login riuscito.', user });
        });
    });

    passportAuthenticate(req, res, next);
});


// Listen on default port 3000
app.listen(3000, () => {
    console.log("Server running on port 3000");
});