import express from 'express';

import { auth } from '../middleware/AuthMiddleware.js';
import { authorize } from "../middleware/Allowrole.middleware.js";

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
router.get('/',authorize("user", "admin"), getAllEvents);

// Get single event
router.get('/:id',authorize("user", "admin"), getEventById);

// Create event
router.post('/',authorize("user", "admin"), createEvent);

// Update event
router.put('/:id',authorize("user", "admin") ,updateEvent);

// Delete event
router.delete('/:id',authorize("user", "admin"), deleteEvent);

export default router;
