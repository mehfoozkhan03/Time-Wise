# Employee notification email setup

The notification page supports instant email, a daily digest, and a weekly digest. Configure a dedicated EmailJS notification template before enabling email delivery:

1. Keep the existing EmailJS service and public/private keys in the backend environment.
2. Create a notification template with its **To Email** field set to `{{to_email}}`.
3. Use `{{to_name}}`, `{{notification_title}}`, `{{notification_message}}`, and `{{app_url}}` in the template body. `{{subject}}` is also provided.
4. Set `EMAILJS_NOTIFICATION_TEMPLATE_ID` to that template's ID. `EMAILJS_NOTIFICATION_SERVICE_ID` may be set to override the service ID; otherwise `EMAILJS_SERVICE_ID` is used.
5. Set `FRONTEND_URL` to the deployed TimeWise URL so email links point to the correct site.

Email delivery is sent by the backend, and never exposes EmailJS credentials to the browser. If the notification template ID or recipient address is unavailable, the backend logs the delivery issue and retains instant messages for retry.
