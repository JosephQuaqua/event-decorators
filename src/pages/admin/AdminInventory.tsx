import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Plus, Pencil } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useRentalItems, useRentalCategories } from '../../lib/hooks';
import { Spinner } from '../../components/ui/Section';
import { AdminTable, AdminPageHeader, type AdminColumn } from '../../components/ui/AdminTable';
import { cn, formatCurrency, getAvailability, slugify } from '../../lib/utils';
import type { RentalItem } from '../../types';

// ---------------------------------------------------------------------------
// Add / Edit modal
// ---------------------------------------------------------------------------

interface ItemModalProps {
  item: RentalItem | null;
  onClose: () => void;
}

function ItemModal({ item, onClose }: ItemModalProps) {
  const queryClient = useQueryClient();
  const { data: categories = [] } = useRentalCategories();
  const isEdit = !!item;

  const [name, setName] = useState(item?.name ?? '');
  const [categoryId, setCategoryId] = useState(item?.category_id ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? '');
  const [pricePerUnit, setPricePerUnit] = useState(item?.price_per_unit ?? 0);
  const [stock, setStock] = useState(item?.stock ?? 0);
  const [reserved, setReserved] = useState(item?.reserved_quantity ?? 0);
  const [condition, setCondition] = useState(item?.condition ?? 'good');
  const [storageLocation, setStorageLocation] = useState(item?.storage_location ?? '');
  const [isActive, setIsActive] = useState(item?.is_active ?? true);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name,
        slug: slugify(name),
        category_id: categoryId || null,
        description: description || null,
        image_url: imageUrl || null,
        price_per_unit: pricePerUnit,
        stock,
        reserved_quantity: reserved,
        condition: condition || 'good',
        storage_location: storageLocation || null,
        is_active: isActive,
      };
      if (isEdit) {
        const { error } = await supabase
          .from('rental_items')
          .update(payload)
          .eq('id', item!.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('rental_items').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-items'] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-luxury">
        <div className="sticky top-0 flex items-center justify-between border-b border-ivory-200 bg-white px-6 py-4">
          <h2 className="font-serif text-2xl font-medium text-charcoal-900">
            {isEdit ? 'Edit Item' : 'Add Rental Item'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-charcoal-500 hover:bg-ivory-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label-field" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="col-span-2">
              <label className="label-field" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="input-field"
              >
                <option value="">— None —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label-field" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field" htmlFor="image">
                Image URL
              </label>
              <input
                id="image"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field" htmlFor="price">
                Price / Unit (LRD)
              </label>
              <input
                id="price"
                type="number"
                min={0}
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Number(e.target.value))}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field" htmlFor="stock">
                Stock
              </label>
              <input
                id="stock"
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field" htmlFor="reserved">
                Reserved
              </label>
              <input
                id="reserved"
                type="number"
                min={0}
                value={reserved}
                onChange={(e) => setReserved(Number(e.target.value))}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field" htmlFor="condition">
                Condition
              </label>
              <select
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="input-field"
              >
                <option value="new">New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
            <div>
              <label className="label-field" htmlFor="storage">
                Storage Location
              </label>
              <input
                id="storage"
                type="text"
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-charcoal-700">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-ivory-300 text-gold-500 focus:ring-gold-500"
                />
                Active
              </label>
            </div>
          </div>

          {saveMutation.isError && (
            <p className="text-sm text-rose-600">
              Error: {(saveMutation.error as Error)?.message}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button
              type="button"
              disabled={saveMutation.isPending || !name.trim()}
              onClick={() => saveMutation.mutate()}
              className="btn-primary"
            >
              {saveMutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AdminInventory
// ---------------------------------------------------------------------------

export function AdminInventory() {
  const { data: items = [], isLoading } = useRentalItems();
  const [editing, setEditing] = useState<RentalItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const columns: AdminColumn[] = [
    { key: 'name', header: 'Item' },
    { key: 'category', header: 'Category' },
    { key: 'stock', header: 'Stock' },
    { key: 'available', header: 'Available' },
    { key: 'price', header: 'Price / Unit' },
    { key: 'condition', header: 'Condition' },
    { key: 'actions', header: '' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Rental Inventory"
        description="Manage rental items, stock levels, and pricing."
        action={
          <button type="button" onClick={() => setShowAdd(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> Add Item
          </button>
        }
      />

      <AdminTable
        columns={columns}
        data={items}
        renderCell={(item, col) => {
          const { available, status } = getAvailability(item.stock, item.reserved_quantity);
          switch (col.key) {
            case 'name':
              return (
                <div>
                  <p className="font-medium text-charcoal-900">{item.name}</p>
                </div>
              );
            case 'category':
              return item.category?.name ?? '—';
            case 'stock':
              return item.stock;
            case 'available':
              return (
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-medium',
                    status === 'out-of-stock'
                      ? 'bg-rose-100 text-rose-700'
                      : status === 'low-stock'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  )}
                >
                  {available}
                </span>
              );
            case 'price':
              return formatCurrency(item.price_per_unit);
            case 'condition':
              return (
                <span className="rounded-full bg-ivory-100 px-2.5 py-1 text-xs font-medium text-charcoal-700">
                  {item.condition}
                </span>
              );
            case 'actions':
              return (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditing(item);
                  }}
                  className="rounded-lg p-2 text-charcoal-500 hover:bg-ivory-100"
                  aria-label="Edit item"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              );
            default:
              return null;
          }
        }}
      />

      {showAdd && <ItemModal item={null} onClose={() => setShowAdd(false)} />}
      {editing && <ItemModal item={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

export default AdminInventory;
