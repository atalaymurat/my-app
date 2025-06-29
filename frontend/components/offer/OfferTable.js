import { formPrice, localeDate } from "@/lib/helpers";

const OfferTable = ({ offers }) => {
  return (
    <div>
      <div className="overflow-hidden my-2 text-stone-300 px-2 py-2 w-full">
        {offers &&
          offers.map((off, index) => {
            const lastVersion = off.versions[off.versions.length - 1];
            return (
              <div className="grid grid-cols-2 gap-1 mb-4 border-b" key={index}>
                <div className="col-span-4 flex flex-row border px-2 py-1 font-semibold w-full bg-stone-500 text-black">
                  <div className="text-black">{off.docCode}</div>
                  <div className="text-gray-800 ml-auto text-sm">
                    {localeDate(lastVersion.docDate)}
                  </div>
                </div>
                <div className="col-span-4 border px-2 py-1">
                  <div className="text-lg font-semibold capitalize">
                    {off.company?.title} / {off.company?.addresses[0].city}
                  </div>
                </div>

                <div className="col-span-3 text-sm text-stone-400">
                  {lastVersion.lineItems?.map((item, idx) => (
                    <div key={idx} className="text-sm capitalize">
                      <div className="text-md font-semibold">{item.title}</div>
                      <div className="text-md font-semibold text-purple-500">
                        {formPrice(item.priceNet)} {item.currencyNet} x{" "}
                        {item.quantity} = {formPrice(item.priceNetTotal?.value)}{" "}
                        {item.priceNetTotal?.currency}
                      </div>
                      <div className="text-xs">Model Yili: {item.year}</div>
                      <div className="white-space-preline">{item.desc}</div>
                      <div className="white-space-preline">{item.notes}</div>
                    </div>
                  ))}
                </div>

                <div className="col-span-1 flex flex-col px-2 py-1">
                  <div className="grid grid-cols-3 text-sm ">
                    <div className="text-xs">Liste</div>
                    <div className="text-sm col-span-2 justify-self-end">
                      {formPrice(lastVersion.priceListTotal?.value)}{" "}
                      {lastVersion.priceListTotal?.currency}
                    </div>
                    <div className="text-xs">Net</div>
                    <div className="text-sm col-span-2 justify-self-end">
                      {formPrice(lastVersion.priceNetTotal?.value)}{" "}
                      {lastVersion.priceNetTotal?.currency}
                    </div>
                    <div className="text-xs">KDV</div>
                    <div className="text-sm col-span-2 justify-self-end">
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
