import { useState } from "react";

import "./ContactForm.css";
import { Feedback } from "../../../pages/FeedBack";

function ContactForm() {
  const questions = [
    "What is your return policy?",
    "Do you offer customer support?",
    "How long does shipping take?",
    "Can I cancel my order?",
    "How can I contact support?",
  ];

  const answers = [
    "You can return any product within 30 days of purchase.",
    "Yes, 24/7 customer support is available via email and chat.",
    "Our standard delivery time is between 3-7 business days.",
    "Yes, you can update or cancel your order before it is dispatched.",
    "You can contact us through email, phone, or the contact form below.",
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    faq: "",
    subject: "",
    message: "",
  });

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [errors, setErrors] = useState({});

  const [modal, setModal] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
  });

  const [touched, setTouched] = useState({});

  const [isSubmitted, setIsSubmitted] = useState(false);

  const closeModal = () =>
    setModal({ open: false, type: "", title: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Remove error while typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (name === "faq") {
      setSelectedAnswer(value !== "" ? answers[Number(value)] : "");
    }
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Enter a valid email address";

    if (!formData.subject.trim()) newErrors.subject = "Subject is required";

    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const submit = (e) => {
    e.preventDefault();

    setIsSubmitted(true);

    if (!validate()) return;

    console.log(formData);

    setFormData({
      name: "",
      email: "",
      faq: "",
      subject: "",
      message: "",
    });

    setSelectedAnswer("");

    setErrors({});
    setTouched({});
    setIsSubmitted(false);

    setModal({
      open: true,
      type: "success",
      title: "Message Sent!",
      message: "Thank you for reaching out. We'll get back to you soon.",
    });
  };

  return (
    <div className="formPart">
      <form onSubmit={submit} noValidate>
        <div className="inputs">
          <div className="input_group">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() =>
                setTouched((prev) => ({
                  ...prev,
                  name: true,
                }))
              }
            />
            {(touched.name || isSubmitted) && errors.name && (
              <p className="form_error">{errors.name}</p>
            )}
          </div>

          <div className="input_group">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() =>
                setTouched((prev) => ({
                  ...prev,
                  email: true,
                }))
              }
            />
            {(touched.email || isSubmitted) && errors.email && (
              <p className="form_error">{errors.email}</p>
            )}
          </div>
        </div>

        <select name="faq" value={formData.faq} onChange={handleChange}>
          <option value="">Select Question (Optional)</option>
          {questions.map((question, index) => (
            <option key={index} value={index}>
              {question}
            </option>
          ))}
        </select>

        <p className="faqAnswer">{selectedAnswer}</p>

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          onBlur={() =>
            setTouched((prev) => ({
              ...prev,
              subject: true,
            }))
          }
        />
        {(touched.subject || isSubmitted) && errors.subject && (
          <p className="form_error">{errors.subject}</p>
        )}

        <textarea
          rows="6"
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          onBlur={() =>
            setTouched((prev) => ({
              ...prev,
              message: true,
            }))
          }
        />
        {errors.message && <p className="form_error">{errors.message}</p>}

        <button type="submit" className="btn">
          Send Message
        </button>
      </form>

      <Feedback
        isOpen={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
      />
    </div>
  );
}

export default ContactForm;
