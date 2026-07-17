import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Package, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import {
  Reveal,
  EmptyState,
  ErrorState,
} from '../../components/ui/Section';
import { useRentalCategories, useRentalItems } from '../../lib/hooks';
import { PEXEL_IMAGES } from '../../lib/constants';
import { cn, formatCurrency, getAvailability } from '../../lib/utils';

// ===========================================================================
// RentalsPage
// ===========================================================================

export function RentalsPage() {
  const { data: categories, isLoading: catLoading } = useRentalCategories();
  const [activeCategory, setActiveCategory] = useState('all');
  const { data: items, isLoading, isError } = useRentalItems(activeCategory);

  return (
    <>
      <PageHeader
        eyebrow="Equipment & Rentals"
        title="Rental Inventory"
        description="Browse our full inventory of premium event equipment available for rent — from tables and chairs to lighting, draping, and decor pieces."
        bgImage={PEXEL_IMAGES.decor}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Rentals' },
        ]}
      />

      <section className="section-padding bg-ivory-100">
        <div className="container-luxury">
          {/* Category filters */}
          <Reveal>
            <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={cn(
                  'rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300',
                  activeCategory === 'all'
                    ? 'bg-gold-500 text-white shadow-gold'
                    : 'border border-ivory-300 bg-white text-charcoal-700 hover:border-gold-500 hover:text-gold-600'
                )}
              >
                All Items
              </button>
              {!catLoading &&
                categories?.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.slug)}
                    className={cn(
                      'rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300',
                      activeCategory === cat.slug
                        ? 'bg-gold-500 text-white shadow-gold'
                        : 'border border-ivory-300 bg-white text-charcoal-700 hover:border-gold-500 hover:text-gold-600'
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
            </div>
          </Reveal>

          {/* Items grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-80 w-full rounded-2xl" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState />
          ) : !items || items.length === 0 ? (
            <EmptyState
              icon={<Package className="h-8 w-8" />}
              title="No rental items found"
              description="Try selecting a different category or check back later."
            />
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, idx) => {
                const { available, status } = getAvailability(
                  item.stock,
                  item.reserved_quantity
                );
                return (
                  <Reveal key={item.id} delay={idx * 60}>
                    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ivory-200 bg-white shadow-luxury transition-all duration-300 hover:shadow-gold">
                      {/* Image */}
                      <div className="relative h-52 overflow-hidden">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-ivory-200 text-charcoal-400">
                            <Package className="h-12 w-12" />
                          </div>
                        )}
                        {/* Availability badge */}
                        <div className="absolute right-3 top-3">
                          {status === 'in-stock' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                              <CheckCircle2 className="h-3 w-3" />
                              {available} Available
                            </span>
                          )}
                          {status === 'low-stock' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                              <AlertCircle className="h-3 w-3" />
                              Only {available} Left
                            </span>
                          )}
                          {status === 'out-of-stock' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                              <AlertCircle className="h-3 w-3" />
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Body */}
                      <div className="flex flex-1 flex-col p-6">
                        {item.category?.name && (
                          <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                            {item.category.name}
                          </span>
                        )}
                        <h3 className="mt-1 font-serif text-lg font-semibold text-charcoal-900">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-500">
                            {item.description}
                          </p>
                        )}
                        <div className="mt-4 flex items-end justify-between border-t border-ivory-200 pt-4">
                          <div>
                            {item.price_per_unit ? (
                              <>
                                <div className="text-xs text-charcoal-500">Rental Price</div>
                                <div className="font-serif text-xl font-semibold text-gold-600">
                                  {formatCurrency(Number(item.price_per_unit))}
                                </div>
                              </>
                            ) : (
                              <div className="text-sm text-charcoal-500">
                                Price on request
                              </div>
                            )}
                          </div>
                          <div className="text-right text-sm">
                            <div className="text-charcoal-500">Stock: {item.stock}</div>
                            <div
                              className={cn(
                                'font-semibold',
                                status === 'in-stock' && 'text-emerald-600',
                                status === 'low-stock' && 'text-amber-600',
                                status === 'out-of-stock' && 'text-rose-600'
                              )}
                            >
                              {available} available
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}

          {/* Custom rental quote callout */}
          <Reveal>
            <div className="mt-16 overflow-hidden rounded-2xl bg-emerald-700 p-8 text-center shadow-luxury md:p-12">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600/50">
                <Package className="h-7 w-7 text-gold-300" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-white md:text-3xl">
                Need Something Custom?
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-ivory-200">
                Looking for specific items not listed here? We can source
                specialty equipment and decor for your event. Request a custom
                rental quote and we'll make it happen.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/quote" className="btn-primary">
                  <Heart className="h-4 w-4" />
                  Request a Custom Quote
                </Link>
                <Link
                  to="/contact"
                  className="btn-outline border-ivory-300 text-ivory-100 hover:bg-ivory-100 hover:text-charcoal-900"
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default RentalsPage;
