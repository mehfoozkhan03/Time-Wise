import express from 'express';

import { auth } from '../middleware/AuthMiddleware.js';

import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/calendar.controller.js';

const router = express.Router();

router.use(auth);

// Get all events
router.get('/', getAllEvents);

// Get single event
router.get('/:id', getEventById);

// Create event
router.post('/', createEvent);

// Update event
router.put('/:id', updateEvent);

// Delete event
router.delete('/:id', deleteEvent);

export default router;
