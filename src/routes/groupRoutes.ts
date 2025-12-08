import { Router } from 'express';
import Group from '../models/Group';

const router = Router();

// Get all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json({ success: true, groups });
  } catch (error: any) {
    res.status(500).json({ success: false, error: (error && error.message) || String(error) });
  }
});

// Get group by ID
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    res.json({ success: true, group });
  } catch (error: any) {
    res.status(500).json({ success: false, error: (error && error.message) || String(error) });
  }
});

export default router;
