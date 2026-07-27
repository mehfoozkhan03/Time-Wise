import express from 'express';
import { createContact } from '../controllers/contact.controller.js';

const contactRoute = express.Router();

contactRoute.post('/', createContact);

export { contactRoute };
