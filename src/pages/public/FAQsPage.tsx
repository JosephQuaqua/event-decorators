import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import {
  Reveal,
  EmptyState,
  ErrorState,
} from '../../components/ui/Section';
import { useFAQs } from '../../lib/hooks';
import { PEXEL_IMAGES } from '../../lib/constants';
import { cn } from '../../lib/utils';

// ===========================================================================
// FAQsPage
// ===========================================================================

export function FAQsPage() {
  const { data: faqs, isLoading, isError } = useFAQs();
  const [openId, setOpenId] = useState<string | null>(null);

  // Group FAQs by category
  const grouped = useMemo(() => {
    if (!faqs) return [];
    const map = new Map<string, typeof faqs>();
    faqs.forEach((faq) => {
      const cat = faq.category ?? 'General';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(faq);
    });
    return Array.from(map.entries());
  }, [faqs]);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <PageHeader
        eyebrow="Good to Know"
        title="Frequently Asked Questions"
        description="Find answers to the most common questions about our services, packages, booking process, and more."
        bgImage={PEXEL_IMAGES.planning}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'FAQs' },
        ]}
      />

      <section className="section-padding bg-ivory-100">
        <div className="container-luxury">
          {isLoading ? (
            <div className="mx-auto max-w-3xl space-y-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState />
          ) : !faqs || faqs.length === 0 ? (
            <EmptyState
              icon={<MessageCircle className="h-8 w-8" />}
              title="No FAQs available"
              description="Check back soon for answers to common questions."
            />
          ) : (
            <div className="mx-auto max-w-4xl space-y-12">
              {grouped.map(([category, items], catIdx) => (
                <div key={category}>
                  <Reveal delay={catIdx * 100}>
                    <div className="mb-6 flex items-center gap-3">
                      <span className="h-px w-8 bg-gold-500" />
                      <h2 className="font-serif text-2xl font-semibold text-charcoal-900">
                        {category}
                      </h2>
                    </div>
                  </Reveal>
                  <div className="space-y-4">
                    {items.map((faq, idx) => {
                      const isOpen = openId === faq.id;
                      return (
                        <Reveal key={faq.id} delay={catIdx * 100 + idx * 50}>
                          <div
                            className={cn(
                              'overflow-hidden rounded-2xl border bg-white shadow-luxury transition-all duration-300',
                              isOpen
                                ? 'border-gold-500'
                                : 'border-ivory-200'
                            )}
                          >
                            <button
                              type="button"
                              onClick={() => toggle(faq.id)}
                              className="flex w-full items-center justify-between gap-4 p-6 text-left"
                              aria-expanded={isOpen}
                            >
                              <span className="font-serif text-lg font-semibold text-charcoal-900">
                                {faq.question}
                              </span>
                              <ChevronRight
                                className={cn(
                                  'h-5 w-5 flex-shrink-0 text-gold-600 transition-transform duration-300',
                                  isOpen && 'rotate-90'
                                )}
                              />
                            </button>
                            <div
                              className={cn(
                                'grid transition-all duration-300',
                                isOpen
                                  ? 'grid-rows-[1fr] opacity-100'
                                  : 'grid-rows-[0fr] opacity-0'
                              )}
                            >
                              <div className="overflow-hidden">
                                <p className="px-6 pb-6 text-sm leading-relaxed text-charcoal-500">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Reveal>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Still have questions callout */}
          <Reveal>
            <div className="mx-auto mt-16 max-w-3xl rounded-2xl bg-white p-8 text-center shadow-luxury md:p-12">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700">
                <MessageCircle className="h-7 w-7 text-gold-300" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-charcoal-900">
                Still Have Questions?
              </h3>
              <p className="mt-3 text-charcoal-500">
                Our team is happy to help. Reach out and we'll get you the
                answers you need.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/contact" className="btn-primary">
                  Contact Us
                </Link>
                <Link to="/book" className="btn-outline">
                  <Heart className="h-4 w-4" />
                  Book Your Event
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default FAQsPage;
