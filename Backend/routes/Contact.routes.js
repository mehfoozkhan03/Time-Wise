import express from "express";
import { createContact } from "../controllers/contactController.js";

const contactRoute = express.Router();

contactRoute.post("/", createContact);

export { contactRoute };
