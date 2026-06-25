import express from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getEvents);                                          // Public
router.post('/', protect, requireRole('admin'), createEvent);        // Admin only
router.put('/:id', protect, requireRole('admin'), updateEvent);      // Admin only
router.delete('/:id', protect, requireRole('admin'), deleteEvent);   // Admin only

export default router;
