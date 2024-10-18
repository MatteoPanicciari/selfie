import { Router } from 'express';
const router = Router();
import {User, Team, Event} from '../schemas.js';   //recupero dei modelli
import CryptoJS from 'crypto-js';
import { ensureAuthenticated } from '../auth.js'

//Route per ottenere tutti gli eventi di un utente
router.get('/user/:userId/:skey', ensureAuthenticated, async (req, res) => {
    const userId = req.params.userId;
    const skey = req.params.skey;

    if(skey == CryptoJS.MD5(userId+'prova').toString()){
        try {
            const user = await User.findById(userId);
            
            const userTeamIds = user.hisTeams;
    
            //Trova tutti gli eventi collegati agli id in userTeamIds
            const events = await Event.find({
                ofTeam: { $in: userTeamIds }
            });
    
            res.status(200).json(events);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }else{
        res.status(403).json({ message: "Risorsa non accessibile da qui" });
    }
    
});

export default router;