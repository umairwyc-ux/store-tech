import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, showToast } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    showToast('Your message has been received! Our support team will contact you within 2 business hours.');
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const faqs = [
    {
      q: 'Are all smartphones sold by Veltrix PTA approved?',
      a: 'Yes, 100%. Every cellular device comes with official dual-SIM PTA duty settled. You receive the authentic PTA verification code and warranty card in the box.',
    },
    {
      q: 'How long does delivery take to cities outside Lahore and Karachi?',
      a: 'Deliveries to Islamabad, Rawalpindi, Faisalabad, Multan, Sialkot, and Peshawar arrive within 1–2 days. Remote cities and towns typically take 2–3 business days via TCS or Leopard Express.',
    },
    {
      q: 'How does Cash on Delivery (COD) work?',
      a: 'You can select Cash on Delivery at checkout for orders up to Rs. 50,000. Simply hand the cash to the courier rider upon inspecting the sealed box.',
    },
    {
      q: 'How do I submit payment proof for Bank Transfer or JazzCash?',
      a: 'During checkout, when you select Bank Transfer, JazzCash, or Easypaisa, you can input your Transaction ID (TID) or upload your screenshot directly. Our finance team verifies this in the admin console before dispatching.',
    },
    {
      q: 'What is your return & warranty claim policy?',
      a: 'We offer a 7-day replacement warranty for any dead-on-arrival or manufacturing defect. For extended brand warranty (1 year), our Lahore and Karachi service centers facilitate direct replacement.',
    },
  ];

  const cleanWaNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">
            Get In Touch
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Contact Veltrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Have questions about an upcoming order, specifications, or corporate bulk purchasing? We're here to assist.
          </p>
        </div>

        {/* Contact Info & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                Fulfillment & Headquarters
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 text-slate-600">
                  <MapPin className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Flagship Store & Warehouse:</strong>
                    <span>{settings.storeAddress}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-600">
                  <Phone className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Phone Support Helpline:</strong>
                    <span>{settings.contactNumber} / UAN (042) 111-786-786</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-600">
                  <Mail className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Email Inquiries:</strong>
                    <span>{settings.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-600">
                  <Clock className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Operating Hours:</strong>
                    <span>Monday – Saturday: 10:00 AM – 9:00 PM PKT</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Box */}
              <div className="pt-4 border-t border-slate-100">
                <a
                  href={`https://wa.me/${cleanWaNumber}?text=Hello%20Store%20Tech%20Support`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chat on WhatsApp ({settings.whatsappNumber})</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-2">Send us a Message</h2>
            <p className="text-xs text-slate-500 mb-6">
              Fill in the form below and our tech specialist will respond right away.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tariq@gmail.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Product Inquiry">Product Inquiry</option>
                    <option value="Order Tracking">Order Tracking & Status</option>
                    <option value="Payment Proof Submission">Payment Proof Verification</option>
                    <option value="Warranty Claim">Warranty Claim / Replacement</option>
                    <option value="Corporate / Bulk Order">Corporate / Bulk Purchase</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or provide order ID..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 bg-slate-900 hover:bg-cyan-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500">
              Clear answers regarding our shipping, verification, and PTA warranty process.
            </p>
          </div>

          <div className="divide-y divide-slate-100 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-900 hover:text-cyan-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-cyan-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed animate-in fade-in duration-150">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
