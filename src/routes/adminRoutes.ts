import { Router } from 'express';
import Group from '../models/Group';

const router = Router();

// Create a new group
router.post('/group', async (req, res) => {
  try {
    const { name, color, colorCode, description, maxCapacity, order } = req.body;
    const group = await Group.create({ name, color, colorCode, description, maxCapacity, order });
    res.status(201).json({ success: true, group });
  } catch (error: any) {
    res.status(500).json({ success: false, error: (error && error.message) || String(error) });
  }
});

// Update a group
router.put('/group/:id', async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    res.json({ success: true, group });
  } catch (error: any) {
    res.status(500).json({ success: false, error: (error && error.message) || String(error) });
  }
});

// Deactivate a group
router.patch('/group/:id/deactivate', async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    res.json({ success: true, group });
  } catch (error: any) {
    res.status(500).json({ success: false, error: (error && error.message) || String(error) });
  }
});

export default router;
