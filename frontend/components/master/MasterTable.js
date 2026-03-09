import { formPrice } from "@/lib/helpers";
const MasterTable = ({ masterProducts }) => {
  return (
    <div>
      <div className="overflow-hidden my-2 text-stone-300 px-2 py-2 w-full mx-auto">
        {masterProducts &&
          masterProducts.map((item, index) => (
            <div
              className="grid grid-cols-3 gap-1 mb-4 border border-stone-500"
              key={index}
            >
              <div className="col-span-3 capitalize border-b border-stone-500 px-2 py-1 font-bold bg-stone-500 text-black text-lg">
                {item.make.name} {item.title}
              </div>

              <div className="col-span-2 row-span-3 px-1 py-1 min-h-24">
                <div className="grid grid-cols-2 gap-1">
                  <div className="flex flex-row space-x-2 items-baseline">
                    <div className="text-xs font-semibold text-stone-500">
                      Marka
                    </div>
                    <div className="capitalize"> {item.make.name}</div>
                  </div>
                  <div className="flex flex-row space-x-2 items-baseline">
                    <div className="text-xs font-semibold text-stone-500">
                      Durumu
                    </div>
                    <div className="capitalize"> {item.condition}</div>
                  </div>
                  <div className="flex flex-row space-x-2 items-baseline">
                    <div className="text-xs font-semibold text-stone-500">
                      Yil
                    </div>
                    <div className="capitalize"> {item.year}</div>
                  </div>
                  <div className="flex flex-row space-x-2 items-baseline">
                    <div className="text-xs font-semibold text-stone-500">
                      Kategori
                    </div>
                    <div className="whitespace-pre-line"> {item.caption}</div>
                  </div>
                </div>
              </div>

              <div className="col-span-1 row-span-3 flex flex-col px-2 py-1">
                RIGHT
              </div>
              <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2">
                {item.variants.map((variant, index) => (
                  <div className="px-2 py-1 flex flex-col border border-gray-400 ">
                    <div>{variant.modelType}</div>
                    <div className="text-xs font-semibold text-stone-500 flex flex-row gap-2 items-center">
                      Liste Fiyati
                      <div className="text-lg font-semibold flex flex-wrap items-center gap-2 my-auto overflow-hidden">
                        {formPrice(variant.priceList)}{" "}
                        <div className="text-sm">{item.currency}</div>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-stone-500 flex flex-row gap-2 items-center">
                      Teklif Fiyati
                      <div className="text-lg font-semibold flex flex-wrap items-center gap-2 my-auto overflow-hidden">
                        {formPrice(variant.priceOffer)}{" "}
                        <div className="text-sm">{item.currency}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MasterTable;
