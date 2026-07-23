import { contactModel } from "../models/Contact.model.js";

export const createContact = async (req, res) => {
  try {
    const contact = await contactModel.create(req.body);
    res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
