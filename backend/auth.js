import passport from 'passport';
import LocalStrategy from 'passport-local';
import { User } from './schemas.js'; // Modello utente

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
export const ensureAuthenticated = (req, res, next) => {
    console.log('EnsureAutheticated');
    if (req.isAuthenticated()) {
      return next(); // User is authenticated, mandiamo al prossimo middleware
    } else {
        return res.json({ success: false, message: 'User is not authenticated' });
    }
};

export default passport;