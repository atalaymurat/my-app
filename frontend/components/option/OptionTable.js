import { formPrice } from "@/lib/helpers";

const OptionTable = ({ options, onEdit, onDelete }) => {
  return (
    <div className="px-2 py-2 grid grid-cols-1 lg:grid-cols-2 gap-3">
      {options && options.map((item) => (
        <div key={item._id} className="border border-stone-700 rounded-xl overflow-hidden bg-stone-950/80 flex group hover:border-stone-600 transition-colors">

          {/* Görsel */}
          <div className="w-20 shrink-0 bg-stone-900 border-r border-stone-800 flex items-center justify-center overflow-hidden">
            {item.image
              ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              : (
                <div className="flex flex-col items-center gap-1 p-2">
                  <svg className="w-6 h-6 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[9px] text-stone-700 font-bold uppercase tracking-wider">Görsel Yok</span>
                </div>
              )
            }
          </div>

          {/* İçerik */}
          <div className="flex-1 min-w-0 px-3 py-3 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-bold text-stone-100 text-sm truncate capitalize">{item.title}</p>
                {item.make?.name && (
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">{item.make.name}</span>
                )}
              </div>
              {/* Actions */}
              <div className="flex gap-1 shrink-0">
                <button onClick={() => onEdit?.(item)}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.5-6.5M3 21h4l11-11-4-4L3 17v4z" />
                  </svg>
                </button>
                <button onClick={() => onDelete?.(item)}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-red-900/50 text-stone-400 hover:text-red-400 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 011-1h4a1 1 0 011 1m-7 0H5m14 0h-2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Açıklama */}
            {item.description && (
              <p className="text-xs text-stone-500 mt-1 line-clamp-1">{item.description}</p>
            )}

            {/* Fiyatlar */}
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-xs">
              {item.priceList > 0 && (
                <span><span className="text-stone-600">Liste </span><span className="text-stone-300 font-medium">{formPrice(item.priceList)} {item.currency}</span></span>
              )}
              {item.priceOffer > 0 && (
                <span><span className="text-amber-700">Teklif </span><span className="text-amber-400 font-medium">{formPrice(item.priceOffer)} {item.currency}</span></span>
              )}
              {item.priceNet > 0 && (
                <span><span className="text-emerald-800">Net </span><span className="text-emerald-500 font-medium">{formPrice(item.priceNet)} {item.currency}</span></span>
              )}
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default OptionTable;
