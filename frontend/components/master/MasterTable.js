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
                {item.title}
              </div>

              <div className="col-span-2 row-span-3 px-1 py-1 min-h-24">
                <div className="grid grid-cols-2 gap-1">
                  <div className="flex flex-row space-x-2 items-baseline">
                    <div className="text-xs font-semibold text-stone-500">
                      Marka
                    </div>
                    <div className="capitalize"> {item.make}</div>
                  </div>
                  <div className="flex flex-row space-x-2 items-baseline">
                    <div className="text-xs font-semibold text-stone-500">
                      Model
                    </div>
                    <div className="capitalize"> {item.model}</div>
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
                      Konfigurasyon
                    </div>
                    <div className="capitalize">
                      {item.productVariant === "configurable" ? "Gerekli" : "Gerekli Degil"}
                    </div>
                  </div>
                  <div className="flex flex-row space-x-2 items-baseline">
                    <div className="text-xs font-semibold text-stone-500">
                      Satilabilir
                    </div>
                    <div className="capitalize">
                      {item.productVariant === "asItIs" ? "Evet" : "Hayir"}
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-stone-500">
                    Aciklamalar
                  </div>
                  <div className="whitespace-pre-line"> {item.description}</div>
                </div>
              </div>


              <div className="col-span-1 row-span-3 flex flex-col px-2 py-1">
                <div className="text-xs font-semibold text-stone-500">
                  Liste Fiyati
                </div>
                <div className="text-lg font-semibold flex flex-wrap items-center gap-2 my-auto overflow-hidden">
                  {formPrice(item.priceList.value)}{" "}
                  <div className="text-sm">{item.priceList.currency}</div>
                </div>
                <div className="text-xs font-semibold text-stone-500">
                  Net Fiyati
                </div>
                <div className="text-lg font-semibold flex flex-wrap items-center gap-2 my-auto overflow-hidden">
                  {formPrice(item.priceNet.value)}{" "}
                  <div className="text-sm">{item.priceNet.currency}</div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MasterTable;
