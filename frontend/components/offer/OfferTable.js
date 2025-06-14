import { formPrice, localeDate } from "@/lib/helpers";

const OfferTable = ({ offers }) => {
  return (
    <div>
      <div className="overflow-hidden my-2 text-stone-300 px-2 py-2 w-full">
        {offers &&
          offers.map((off, index) => {
            const lastVersion = off.versions[off.versions.length - 1];
            return (
              <div
                className="grid grid-flow-col grid-rows-3 gap-1 mb-4"
                key={index}
              >
                <div className="col-span-3 flex flex-row border px-2 py-1 font-semibold w-full bg-stone-500 text-black">
                  <div className="text-black">{off.docCode}</div>
                  <div className="text-gray-800 ml-auto text-sm">
                    {localeDate(lastVersion.docDate)}
                  </div>
                </div>
                <div className="col-span-3 row-span-4 border px-2 py-1">
                  <div className="text-lg font-semibold capitalize">
                    {off.company?.customTitle} / {off.company?.addresses[0].city}
                  </div>
                  <div className="text-sm text-stone-400">
                    {off.versions[off.versions.length - 1].lineItems?.map(
                      (item, idx) => (
                        <div key={idx} className="text-xs">
                          {item.title} -- {formPrice(item.priceNet)}{" "}
                          {item.currencyNet}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="col-span-1 row-span-5 border flex flex-col px-2 py-1">
                  <div className="grid grid-cols-2 text-sm">
                    <div className="text-xs">Liste</div>
                    <div className="text-sm">
                      {formPrice(lastVersion.priceListTotal?.value)}{" "}
                      {lastVersion.priceListTotal?.currency}
                    </div>
                    <div className="text-xs">Net</div>
                    <div className="text-sm">
                      {formPrice(lastVersion.priceNetTotal?.value)}{" "}
                      {lastVersion.priceNetTotal?.currency}
                    </div>
                    <div className="text-xs">KDV</div>
                    <div className="text-sm">
                      {formPrice(lastVersion.priceVat?.value)}{" "}
                      {lastVersion.priceVat?.currency}
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-purple-500 mt-auto ml-auto">
                    {formPrice(lastVersion.priceGrandTotal?.value)}{" "}
                    {lastVersion.priceGrandTotal?.currency}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default OfferTable;
