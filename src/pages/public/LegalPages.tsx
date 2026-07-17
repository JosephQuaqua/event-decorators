import { Link } from 'react-router-dom';
import { Shield, FileText, Mail, Phone } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Reveal } from '../../components/ui/Section';
import { PEXEL_IMAGES } from '../../lib/constants';

// ---------------------------------------------------------------------------
// Contact info
// ---------------------------------------------------------------------------
const CONTACT_EMAIL = 'hello@eventdecorators.lr';
const CONTACT_PHONE = '+231 77 123 4567';

// ===========================================================================
// PrivacyPage
// ===========================================================================

const PRIVACY_SECTIONS = [
  {
    title: '1. Information We Collect',
    body: 'We collect information that you provide directly to us when you submit a booking request, request a quotation, or contact us through our website. This may include your name, email address, phone number, event details, and any additional information you choose to share. We also automatically collect certain technical data such as your IP address, browser type, and usage patterns through cookies and similar technologies.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'We use the information we collect to process your booking and quotation requests, communicate with you about your event, provide our services, send important updates, and improve our website and offerings. We may also use your information to send you promotional materials about our services, but only with your consent. You can opt out of promotional communications at any time.',
  },
  {
    title: '3. Information Sharing',
    body: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business — such as hosting providers and communication tools — but only under strict confidentiality agreements. We may also disclose information when required by law or to protect our legal rights.',
  },
  {
    title: '4. Data Security',
    body: 'We implement appropriate technical, administrative, and physical security measures designed to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    title: '5. Cookies',
    body: 'Our website uses cookies to enhance your browsing experience, analyze site traffic, and understand how visitors use our site. Cookies are small files stored on your device. You can choose to disable cookies through your browser settings, though some features of our website may not function properly without them.',
  },
  {
    title: '6. Your Rights',
    body: 'You have the right to access, correct, update, or request deletion of your personal information. You may also object to or restrict certain processing of your data. To exercise any of these rights, please contact us using the information provided at the end of this policy. We will respond to your request within a reasonable timeframe.',
  },
  {
    title: '7. Third-Party Links',
    body: 'Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.',
  },
  {
    title: '8. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically to stay informed about how we protect your information.',
  },
];

export function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="Your privacy is important to us. This policy explains how we collect, use, and protect your personal information."
        bgImage={PEXEL_IMAGES.about}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Privacy Policy' },
        ]}
      />

      <section className="section-padding bg-ivory-100">
        <div className="container-luxury">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700">
                  <Shield className="h-6 w-6 text-gold-300" />
                </div>
                <div>
                  <p className="text-sm text-charcoal-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </Reveal>

            <div className="space-y-8">
              {PRIVACY_SECTIONS.map((section, idx) => (
                <Reveal key={idx} delay={idx * 50}>
                  <div className="rounded-2xl border border-ivory-200 bg-white p-6 shadow-luxury md:p-8">
                    <h2 className="font-serif text-xl font-semibold text-charcoal-900">
                      {section.title}
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-charcoal-600">
                      {section.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Contact */}
            <Reveal>
              <div className="mt-8 rounded-2xl bg-emerald-700 p-8 text-center text-white shadow-luxury">
                <h3 className="font-serif text-xl font-semibold">
                  Contact Us About Privacy
                </h3>
                <p className="mt-3 text-sm text-ivory-200">
                  If you have any questions about this Privacy Policy, please
                  reach out to us:
                </p>
                <div className="mt-4 flex flex-col items-center justify-center gap-3 text-sm sm:flex-row sm:gap-6">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center gap-2 text-ivory-100 transition-colors hover:text-gold-300"
                  >
                    <Mail className="h-4 w-4" />
                    {CONTACT_EMAIL}
                  </a>
                  <a
                    href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 text-ivory-100 transition-colors hover:text-gold-300"
                  >
                    <Phone className="h-4 w-4" />
                    {CONTACT_PHONE}
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Link to terms */}
            <div className="mt-8 text-center">
              <Link
                to="/terms"
                className="text-sm font-semibold text-gold-600 hover:text-gold-700"
              >
                View our Terms & Conditions →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ===========================================================================
// TermsPage
// ===========================================================================

const TERMS_SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing and using the Event Decorators website, you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should not use our website or services. Your continued use of the website constitutes acceptance of any updates or modifications to these terms.',
  },
  {
    title: '2. Services',
    body: 'Event Decorators provides event management services for weddings, parties, graduations, corporate events, and all ceremonies — including but not limited to event planning, decoration, catering, custom cakes and pastries, tailoring, venue sourcing, photography, floral design, equipment rentals, and day-of coordination. All services are subject to availability and are offered in accordance with applicable laws and regulations in the Republic of Liberia.',
  },
  {
    title: '3. Booking and Quotation Requests',
    body: 'Submitting a booking request or quotation request through our website does not constitute a confirmed booking. All requests are subject to review and acceptance by our team. A booking is only confirmed once both parties have agreed to the terms, services, and pricing in writing. We reserve the right to decline any request at our discretion.',
  },
  {
    title: '4. Pricing and Payment',
    body: 'All prices are quoted in Liberian Dollars (LRD) and are subject to change without notice. We do not process online payments through this website. Payment arrangements, including deposits, installment schedules, and final payments, will be agreed upon directly between Event Decorators and the client. A deposit may be required to secure a booking date.',
  },
  {
    title: '5. Cancellation and Refunds',
    body: 'Cancellation policies will be outlined in your service agreement or quotation. Generally, deposits are non-refundable. Cancellations made within 30 days of the event date may be subject to additional charges. Refunds, if applicable, will be processed according to the terms agreed upon in your individual service contract.',
  },
  {
    title: '6. Client Responsibilities',
    body: 'Clients are responsible for providing accurate and complete information when submitting booking requests. Clients must ensure they have the necessary permissions for any venue, materials, or content used in their event. Clients are also responsible for any damage to rental equipment caused by their guests during the event.',
  },
  {
    title: '7. Intellectual Property',
    body: 'All content on this website — including text, graphics, logos, images, and design elements — is the property of Event Decorators and is protected by intellectual property laws. You may not reproduce, distribute, or use any content from this website without our prior written consent. Event photographs may be used by Event Decorators for promotional purposes unless otherwise agreed in writing.',
  },
  {
    title: '8. Limitation of Liability',
    body: 'Event Decorators shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our website or services. Our total liability for any claim arising from our services shall not exceed the amount paid by the client for the specific service in question. We are not responsible for circumstances beyond our reasonable control, including acts of nature, venue failures, or third-party vendor issues.',
  },
  {
    title: '9. Governing Law',
    body: 'These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of Liberia. Any disputes arising from or relating to these terms shall be subject to the exclusive jurisdiction of the courts located in Monrovia, Montserrado County, Republic of Liberia.',
  },
  {
    title: '10. Changes to Terms',
    body: 'We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to this website. Your continued use of the website after any changes constitutes acceptance of the revised terms. We encourage you to review this page periodically.',
  },
];

export function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        description="Please read these terms carefully before using our website or engaging our services."
        bgImage={PEXEL_IMAGES.about}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Terms & Conditions' },
        ]}
      />

      <section className="section-padding bg-ivory-100">
        <div className="container-luxury">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700">
                  <FileText className="h-6 w-6 text-gold-300" />
                </div>
                <div>
                  <p className="text-sm text-charcoal-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </Reveal>

            <div className="space-y-8">
              {TERMS_SECTIONS.map((section, idx) => (
                <Reveal key={idx} delay={idx * 50}>
                  <div className="rounded-2xl border border-ivory-200 bg-white p-6 shadow-luxury md:p-8">
                    <h2 className="font-serif text-xl font-semibold text-charcoal-900">
                      {section.title}
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-charcoal-600">
                      {section.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Governing law callout */}
            <Reveal>
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <h3 className="font-serif text-lg font-semibold text-emerald-800">
                  Governed by the Laws of the Republic of Liberia
                </h3>
                <p className="mt-2 text-sm text-emerald-700">
                  These terms are subject to the jurisdiction of the courts of
                  Monrovia, Montserrado County, Republic of Liberia.
                </p>
              </div>
            </Reveal>

            {/* Contact */}
            <Reveal>
              <div className="mt-8 rounded-2xl bg-emerald-700 p-8 text-center text-white shadow-luxury">
                <h3 className="font-serif text-xl font-semibold">
                  Questions About Our Terms?
                </h3>
                <p className="mt-3 text-sm text-ivory-200">
                  If you have any questions about these Terms & Conditions,
                  please contact us:
                </p>
                <div className="mt-4 flex flex-col items-center justify-center gap-3 text-sm sm:flex-row sm:gap-6">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center gap-2 text-ivory-100 transition-colors hover:text-gold-300"
                  >
                    <Mail className="h-4 w-4" />
                    {CONTACT_EMAIL}
                  </a>
                  <a
                    href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 text-ivory-100 transition-colors hover:text-gold-300"
                  >
                    <Phone className="h-4 w-4" />
                    {CONTACT_PHONE}
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Link to privacy */}
            <div className="mt-8 text-center">
              <Link
                to="/privacy"
                className="text-sm font-semibold text-gold-600 hover:text-gold-700"
              >
                View our Privacy Policy →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default TermsPage;
