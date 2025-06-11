import { formPrice } from "@/lib/helpers";

const OfferTable = ({ offers }) => {
  return (
    <div>
      <div className="overflow-hidden my-2 text-stone-300 px-2 py-2 w-full">
        {offers &&
          offers.map((off, index) => (
            <div className="grid grid-flow-col grid-rows-3 gap-1 mb-4" key={index}>
              <div className="col-span-3  border px-2 py-1 font-semibold">{off.title}</div>
              <div className="col-span-3 row-span-4 border px-1 py-1">
                {off.configurations.map((item, index) => (
                  <div key={index} className="text-xs ">
                    {item.title}
                  </div>
                ))}
              </div>

              <div className="col-span-1 row-span-5 border flex flex-col px-2 py-1">
                <div className="text-sm font-semibold text-stone-500">Liste Fiyati</div>
                <div>
                  <div className="text-xs">
                    {formPrice(off.priceList.value)} {off.priceList.currency}{" "}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OfferTable;
