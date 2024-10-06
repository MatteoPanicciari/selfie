//----------------------------------------------------------------------------------------------------------------------------------------------------
//IMPOSTAZIONE INIZIALE EXPRESS
const express = require("express")                       //gestione di tutta l'app (middleware, routes, richieste HTTP)
const app = express()

app.set("view engine", "ejs");                      //Imposta EJS come view engine
app.use(express.json());                            //Permette dei payload ti tipo json nelle richieste e risposte HTTP
app.use(express.urlencoded({ extended: true }));    //Permette dei payload ti tipo URL nelle richieste e risposte HTTP
app.use(express.static("public"));                  //Rende accessibili al browser i file statici all'interno di public
//----------------------------------------------------------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------------------------------------------------------
//IMPOSTAZIONE ROUTES API
const eventRoutes = require('./routes/events');     //Importa le route da events.js
app.use('/api', eventRoutes);                       //tutte le routes definite in events.js saranno annidate sotto /api
//----------------------------------------------------------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------------------------------------------------------
//IMPOSTAZIONE COOKIE DI SESSIONE
//express-session genera un cookie da inviare al browser di chi si collega per la prima volta, il cookie contiene un id della sessione da utilizzare per nuove connessioni
const expressSession = require("express-session");
app.use(
    expressSession({
        secret: "yourSecretKey",        //firma dei cookie della sessione DEBUG: da cambiare in qualcosa di complesso in teoria
        resave: false,                  //se va risalvata la sessione ogni volta anche se non è stata modificata
        saveUninitialized: false,       //salva solo le sessioni che contengono effettivamente dati
        cookie: { secure: false },      //se fosse true, i cookie verrebbero inviati solo per HTTPs
    })
);
//----------------------------------------------------------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------------------------------------------------------
//CONNESSIONE AL DATABASE E RECUPERO MODELLI
const mongoose = require("mongoose")

//nell'uri c'è il link del cluster e anche l'indirizzamento al database giusto "/selfie"
const uri = "mongodb+srv://matteopanicciari:p4PmhXtwmXgTvBFi@cluster0.mv96qkb.mongodb.net/selfie?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri);
mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));
mongoose.connection.on("reconnected", () => console.log("Reconnected to MongoDB"));
mongoose.connection.on("disconnected", () => console.log("Disconnected from MongoDB"));
mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err));

const {User, Team, Event} = require('./schemas');   //recupero dei modelli
//----------------------------------------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------------------------------------
//SET PASSPORT
const passport = require("passport")                     //gestione autenticazione
const LocalStrategy = require("passport-local").Strategy //strategia utilizzata per il login, in questo caso è local, cioè il solito username e password, ma potrebbe essere anche il login attraverso google, github, facebook...    

app.use(passport.initialize());
app.use(passport.session());

//se viene trovato l'username e la password corrisponde, chiamiamo done (null, user), altrimenti (null, false, error_message) o done(err)
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username });

            if (!user){
                console.log("incorrect username");
                return done(null, false, { message: "Incorrect username or password." });      //username errato
            }
            if (password == user.password) {
                console.log("incorrect password");
                return done(null, false, { message: "Incorrect username or password." });  //password errata
            }
            console.log("accesso gg");
            return done(null, user);      //autenticazione riuscita
        } catch (err) {
            console.log("altro errore nell'accesso");
            return done(err);     //altri errori
        }
    })
);

//Serializzazione: appena l'utente inserisce bene le credenziali, passport si salva l'id in modo da ricordarlo successivamente e non salvarsi altre informazioni
passport.serializeUser((user, done) => {
    done(null, user._id); // serializza l'id utente
});

//Deserializzazione: quando l'app ha bisogno delle informazioni dell'utente, chiama questa per farsi restituire l'ogegtto user e ricavare info utili
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user); //chiama done(), funzione di passport che gestisce success/error o fail
    } catch (err) {
        done(err); // Handle errors during deserialization
    }
});

// middleware per mantenere l'autenticazione dell'utente, se non è autenticato, lo mandiamo al login
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next(); // User is authenticated
    }
    res.redirect("/login"); // Redirect if not authenticated
};
//----------------------------------------------------------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------------------------------------------------------
//SET DI TUTTE LE ROUTES
app.get("/", ensureAuthenticated, async (req, res) => {
    res.render("home", {
        content: "Welcome to your blog!",
        username: "nome da cambiare",
    });
});

app.get("/login", (req, res) => {
    res.render("login", { username: req.user ? req.user.username : null });
});  
  
app.post("/login", passport.authenticate("local", {
    successRedirect: "/calendar", // Redirect after successful login DEBUG:DA CAMBIARE IN HOME
    failureRedirect: "/login", // Redirect after failed login
    //failureFlash: true, // Enable flash messages
}));

app.get("/signup", async (req, res) => {
    res.render("signup", { username: req.user ? req.user.username : null });
});

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
        const newUser = new User({
            username, password
        });
    
        await newUser.save();
        
        req.login(newUser, (err) => {
            if (err) {
              return res.status(500).send("Error during login after registration.");
            }
            res.redirect("/"); // Redirect after successful registration
        });
    }
    catch(error){
        console.error("Error during registration:", error);
        res.status(500).send("Registration failed.");
    }
});

app.get("/calendar", ensureAuthenticated, (req, res) => {
    res.render("calendar", {userId : req.session.passport.user});
});

app.get("/note", ensureAuthenticated, (req, res) => {
    res.render("newPage");
});

app.get("/attivita", ensureAuthenticated, (req, res) => {
    res.render("newPage");
});

app.get("/pomodoro", ensureAuthenticated, (req, res) => {
    res.render("newPage");
});  

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        // Successo: reindirizza l'utente dopo il logout
        res.redirect('/login');
    });
});
//----------------------------------------------------------------------------------------------------------------------------------------------------
  

// Listen on default port 3000
app.listen(3000, () => {
    console.log("Server running on port 3000");
});