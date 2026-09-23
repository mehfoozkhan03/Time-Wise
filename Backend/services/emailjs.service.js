const EMAILJS_URL = "https://api.emailjs.com/api/v1.0/email/send";

export const sendContactEmail = async (contactData) => {
  const response = await fetch(EMAILJS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY,
      template_params: {
        user_name: contactData.name,
        user_email: contactData.email,
        question: contactData.faq || "General Question",
        subject: contactData.subject,
        message: contactData.message,
        support_email: process.env.SUPPORT_EMAIL,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`EmailJS Error: ${error}`);
  }

  return true;
};