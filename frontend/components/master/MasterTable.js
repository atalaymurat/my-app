import { formPrice } from "@/lib/helpers";

const CONDITION = {
  new:         { label: "Yeni",       cls: "text-emerald-400 bg-emerald-900/20 border-emerald-800/40" },
  used:        { label: "İkinci El",  cls: "text-amber-400  bg-amber-900/20  border-amber-800/40"  },
  refurbished: { label: "Yenilenmiş", cls: "text-sky-400    bg-sky-900/20    border-sky-800/40"    },
};

function ProductImage({ src, alt }) {
  return (
    <div className="w-16 sm:w-20 flex-shrink-0 self-stretch bg-stone-800 overflow-hidden flex items-center justify-center">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <svg className="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )}
    </div>
  );
}

function VariantPill({ variant, currency }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-stone-800 border border-stone-700/60 rounded-lg min-w-0">
      <span className="text-[11px] font-medium text-stone-300 truncate max-w-[80px] sm:max-w-none">
        {variant.modelType}
      </span>
      {variant.priceList > 0 && (
        <span className="text-[10px] text-stone-500 whitespace-nowrap flex-shrink-0">
          {formPrice(variant.priceList)} {currency}
        </span>
      )}
    </div>
  );
}

function CardActions({ item, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-0.5 flex-shrink-0">
      <button onClick={() => onEdit?.(item)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:text-sky-400 hover:bg-stone-800 transition-colors"
        title="Düzenle">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
        </svg>
      </button>
      <button onClick={() => onDelete?.(item)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:text-red-400 hover:bg-stone-800 transition-colors"
        title="Sil">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>
    </div>
  );
}

function ProductCard({ item, onEdit, onDelete }) {
  const condition = CONDITION[item.condition];
  const variants = item.variants ?? [];
  const visibleMobile  = variants.slice(0, 2);
  const visibleDesktop = variants.slice(0, 4);
  const extraMobile    = variants.length - 2;
  const extraDesktop   = variants.length - 4;

  return (
    <div className="flex items-stretch border border-stone-700/60 rounded-xl overflow-hidden bg-stone-900/50 hover:border-stone-600 transition-colors">
      <ProductImage src={item.image} alt={item.title} />

      <div className="flex-1 min-w-0 flex flex-col gap-1.5 p-2.5">
        {/* Title + Actions */}
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-bold text-stone-100 leading-tight truncate">
            {item.title}
          </p>
          <CardActions item={item} onEdit={onEdit} onDelete={onDelete} />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-1.5">
          {item.caption && (
            <span className="text-[11px] text-stone-500">{item.caption}</span>
          )}
          {condition && (
            <span className={`text-[10px] font-semibold px-1.5 py-px rounded border ${condition.cls}`}>
              {condition.label}
            </span>
          )}
          {item.currency && (
            <span className="text-[10px] font-mono text-stone-600">{item.currency}</span>
          )}
        </div>

        {/* Variants — mobile: 2, sm+: 4 */}
        {variants.length > 0 && (
          <>
            <div className="flex flex-wrap gap-1 sm:hidden">
              {visibleMobile.map((v, i) => <VariantPill key={i} variant={v} currency={item.currency} />)}
              {extraMobile > 0 && (
                <span className="flex items-center px-2 py-1 text-[10px] text-stone-500 bg-stone-800 border border-stone-700/60 rounded-lg">
                  +{extraMobile}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-wrap gap-1">
              {visibleDesktop.map((v, i) => <VariantPill key={i} variant={v} currency={item.currency} />)}
              {extraDesktop > 0 && (
                <span className="flex items-center px-2 py-1 text-[10px] text-stone-500 bg-stone-800 border border-stone-700/60 rounded-lg">
                  +{extraDesktop}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function BrandGroup({ name, logo, items, onEdit, onDelete }) {
  return (
    <div className="mb-4">
      {/* Marka başlığı */}
      <div className="flex items-center gap-2 px-1 mb-2">
        {logo && (
          <img src={logo} alt={name} className="w-5 h-5 object-contain opacity-80" />
        )}
        <span className="text-xs font-bold uppercase tracking-widest text-stone-500">{name}</span>
        <span className="text-[10px] text-stone-700 font-medium">{items.length}</span>
        <div className="flex-1 h-px bg-stone-800" />
      </div>

      {/* Ürün kartları */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {items.map((item) => (
          <ProductCard key={item._id} item={item} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}

const MasterTable = ({ masterProducts, onEdit, onDelete }) => {
  // Marka adına göre grupla (sıralı)
  const groups = masterProducts.reduce((acc, item) => {
    const key = item.make?.name || "Diğer";
    if (!acc[key]) acc[key] = { name: key, logo: item.make?.logo || null, items: [] };
    acc[key].items.push(item);
    return acc;
  }, {});

  const sorted = Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="px-2 py-2">
      {sorted.map((group) => (
        <BrandGroup
          key={group.name}
          name={group.name}
          logo={group.logo}
          items={group.items}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default MasterTable;
