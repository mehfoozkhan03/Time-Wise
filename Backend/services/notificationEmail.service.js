const EMAILJS_URL = "https://api.emailjs.com/api/v1.0/email/send";
let warnedMissingConfiguration = false;

export const hasNotificationEmailConfiguration = () => Boolean(
  (process.env.EMAILJS_NOTIFICATION_SERVICE_ID || process.env.EMAILJS_SERVICE_ID)
  && process.env.EMAILJS_NOTIFICATION_TEMPLATE_ID
  && process.env.EMAILJS_PUBLIC_KEY
  && process.env.EMAILJS_PRIVATE_KEY,
);

export const sendNotificationEmail = async ({ recipient, title, message, appUrl }) => {
  const serviceId = process.env.EMAILJS_NOTIFICATION_SERVICE_ID || process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_NOTIFICATION_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const accessToken = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !accessToken || !recipient?.email) {
    if (!warnedMissingConfiguration) {
      console.warn("Notification email delivery is paused: configure the notification EmailJS template and keys.");
      warnedMissingConfiguration = true;
    }
    return false;
  }

  const response = await fetch(EMAILJS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken,
      template_params: {
        to_email: recipient.email,
        to_name: `${recipient.firstName || ""} ${recipient.lastName || ""}`.trim(),
        notification_title: title,
        notification_message: message,
        subject: title,
        app_url: appUrl,
      },
    }),
  });

  if (!response.ok) throw new Error(`EmailJS notification error (${response.status}): ${await response.text()}`);
  return true;
};
