import "./FAQItem.css";

function FAQItem({ faq, open, onToggle }) {
  return (
    <div className={`faq ${open ? "active" : ""}`}>
      <div className="question" onClick={onToggle}>
        <span className="questionText">{faq.question}</span>

        <span className="icon">{open ? "-" : "+"}</span>
      </div>

      <div className={`answer ${open ? "show" : ""}`}>{faq.answer}</div>
    </div>
  );
}

export default FAQItem;
