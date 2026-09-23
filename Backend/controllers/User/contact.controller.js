import { contactModel } from "../../models/Contact.model.js";
import { sendContactEmail } from "../../services/emailjs.service.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, faq, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject and message are required.",
      });
    }

    const contact = await contactModel.create({
      name,
      email,
      faq: faq || "",
      subject,
      message,
    });

    try {
      await sendContactEmail({
        name: contact.name,
        email: contact.email,
        faq: contact.faq,
        subject: contact.subject,
        message: contact.message,
      });

      contact.emailStatus = "sent";
      contact.emailSentAt = new Date();

      await contact.save();

      return res.status(201).json({
        success: true,
        message: "Message sent successfully.",
        data: contact,
      });
    } catch (emailError) {
      contact.emailStatus = "failed";

      await contact.save();

      console.error("EmailJS Error:", emailError.message);

      return res.status(503).json({
        success: false,
        message:
          "Your message was saved, but we could not send the notification email. Please try again later.",
        data: {
          contactId: contact._id,
          emailStatus: contact.emailStatus,
        },
      });
    }
  } catch (error) {
    console.error("Contact creation error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong.",
    });
  }
};