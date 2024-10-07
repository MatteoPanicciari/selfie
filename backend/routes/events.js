import { Router } from 'express';
const router = Router();

//Route per ottenere tutti gli eventi
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    res.json("Eventi di "+userId);    
});
//Route per ottenere tutti gli eventi
router.get('/', async (req, res) => {
    const userId = req.params.userId;

    res.json("Eventi di "+userId);    
});

export default router;