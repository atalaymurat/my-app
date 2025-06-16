import { formPrice } from "@/lib/helpers";

const ConfigurationTable = ({ variants }) => {
  return (
    <div>
      <div className="overflow-hidden my-2 text-stone-300 px-2 py-2 w-full mx-auto">
        {variants &&
          variants.map((item, index) => (
            <div
              className="grid grid-cols-3 gap-1 mb-4 border border-stone-500"
              key={index}
            >
              <div className="col-span-3 border-b border-stone-500 px-2 py-1 font-bold bg-stone-500 text-black text-lg">
                {item.title}
              </div>

              <div className="col-span-2 row-span-3 px-1 py-1 min-h-24">
                {item.options.map((op, index) => (
                  <div
                    key={index}
                    className="text-sm w-full overflow-hidden text-stone-400"
                  >
                    {op.title}
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-2">
                <div className="text-sm flex flex-row gap-2 font-semibold text-stone-400 items-end">
                  <div className="text-xs text-stone-500">Created from: </div>
                  <div>{item.createdFromMaster && "Master"}</div>
                </div>
                <div className="text-sm flex flex-row gap-2 font-semibold text-stone-400 items-end">
                  <div className="text-xs text-stone-500">Durumu: </div>
                  <div>{item.condition}</div>
                </div>
                <div className="text-sm flex flex-row gap-2 font-semibold text-stone-400 items-end">
                  <div className="text-xs text-stone-500">Yil: </div>
                  <div>{item.year}</div>
                </div>
                <div className="text-sm flex flex-row gap-2 font-semibold text-stone-400 items-end">
                  <div className="text-xs text-stone-500">Marka: </div>
                  <div>{item.make}</div>
                </div>
                <div className="text-sm flex flex-row gap-2 font-semibold text-stone-400 items-end">
                  <div className="text-xs text-stone-500">AsItIs / Config: </div>
                  <div>{item.productVariant}</div>
                </div>
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
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ConfigurationTable;
