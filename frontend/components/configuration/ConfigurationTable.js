import { formPrice } from "@/lib/helpers";

const ConfigurationTable = ({ configurations }) => {
  return (
    <div>
      <div className="overflow-hidden my-2 text-stone-300 px-2 py-2 w-full">
        {configurations &&
          configurations.map((conf, index) => (
            <div className="grid grid-flow-col grid-rows-3 gap-1 mb-4" key={index}>
              <div className="col-span-3  border px-2 py-1 font-semibold">{conf.title}</div>
              <div className="col-span-3 row-span-4 border px-1 py-1">
                {conf.options.map((op, index) => (
                  <div key={index} className="text-xs ">
                    {op.title}
                  </div>
                ))}
              </div>

              <div className="col-span-1 row-span-5 border flex flex-col px-2 py-1">
                <div className="text-sm font-semibold text-stone-500">Liste Fiyati</div>
                <div>
                  <div className="text-xs">
                    {formPrice(conf.priceList.value)} {conf.priceList.currency}{" "}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ConfigurationTable;
