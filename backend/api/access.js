import { Router } from 'express';
const router = Router();
import {User, Team, Event} from '../schemas.js';   //recupero dei modelli
import CryptoJS from 'crypto-js';
import passport, { ensureAuthenticated } from '../auth.js';

router.get("/profile", ensureAuthenticated, (req, res, next) => {
    return res.json({ success: true, message: 'User is authenticated' });
});


router.post("/login", (req, res, next) => {
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

// Logout API - risponde con JSON
router.post('/logout', (req, res) => {
    req.logout();
    res.json({ message: 'Logout successful' });
});
  

export default router;