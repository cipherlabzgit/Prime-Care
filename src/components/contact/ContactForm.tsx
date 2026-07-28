import { useState } from "react";
import type { FormEvent } from "react";
import { useToast } from "../../context/ToastContext";
import { contactSubjects } from "../../data/contactData";
import { USER_MESSAGES } from "../../utils/userMessages";
import Button from "../ui/Button";

const inputClass =
  "w-full rounded-2xl border border-slate-300/90 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-60";

const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700";

function ContactForm() {
  const { showToast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState<string>(contactSubjects[0]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    if (!message.trim()) {
      setError("Please enter your message.");
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 900));
      setSuccess(
        "Thank you for contacting PremierCare. Our team will respond within one business day.",
      );
      showToast(USER_MESSAGES.contactSuccess);
      setFullName("");
      setEmail("");
      setPhone("");
      setSubject(contactSubjects[0]);
      setMessage("");
    } catch {
      setError(USER_MESSAGES.contactFailed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} aria-label="Contact form">
      <div className="contact-form__grid">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            className={inputClass}
            value={fullName}
            disabled={submitting}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            className={inputClass}
            value={email}
            disabled={submitting}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className="contact-form__grid mt-4">
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            className={inputClass}
            value={phone}
            disabled={submitting}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            required
          />
        </div>
        <div>
          <label htmlFor="contact-subject" className={labelClass}>
            Subject <span className="text-red-500">*</span>
          </label>
          <select
            id="contact-subject"
            className={inputClass}
            value={subject}
            disabled={submitting}
            onChange={(e) => setSubject(e.target.value)}
          >
            {contactSubjects.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="contact-message" className={labelClass}>
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          className={`${inputClass} min-h-[9rem] resize-y`}
          value={message}
          disabled={submitting}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help you today?"
          required
        />
      </div>

      {error ? (
        <p className="contact-form__feedback contact-form__feedback--error" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="contact-form__feedback contact-form__feedback--success" role="status">
          {success}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="accent"
        fullWidth
        disabled={submitting}
        className="mt-5 py-3.5 font-bold shadow-lg"
      >
        {submitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}

export default ContactForm;
