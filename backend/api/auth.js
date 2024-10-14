//DEBUG: ora sbagliato, è giusto quello che c'è in index.js

import { Router } from 'express';
const router = Router();
import {User, Team, Event} from '../schemas.js';   //recupero dei modelli
import CryptoJS from 'crypto-js';

// Login API - risponde con JSON
app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) return next(err);
        if(!user) {
            return res.status(401).json({ message: info.message }); // Login fallito, risposta JSON
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({ message: 'Login successful', user: user.username }); // Login riuscito, risponde JSON
        });
    })(req, res, next);
});

// Logout API - risponde con JSON
app.post('/logout', (req, res) => {
    req.logout();
    res.json({ message: 'Logout successful' });
});
  

export default router;