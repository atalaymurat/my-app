import TableTemplate from "../templates/TableTemplate";

const CompanyTable = ({ companies }) => {
  return (
 <div>
      <div className="overflow-hidden my-2 text-stone-300 px-2 py-2 w-full mx-auto">
        {companies &&
          companies.map((co, index) => (
            <div className="grid grid-cols-3 gap-1 mb-4 border border-stone-500" key={index}>
              <div className="col-span-3 border-b border-stone-500 px-2 py-1 font-bold bg-stone-500 text-black text-lg capitalize">
                {co.title}
              </div>

              <div className="col-span-2 row-span-3 px-1 py-1 min-h-24">
                <div className="text-xs">{co.itemCode}</div>
                <div className="text-xs capitalize">{co.vatTitle}</div>
                <div className="text-xs">{co.vd} {co.vatNo}</div>
                <div className="text-xs">{co.tcNo}</div>
                {co.domains.map(( dom, index) => (
                  <div key={index} className="text-sm w-full overflow-hidden text-stone-400">
                    {dom}
                  </div>
                ))}
                {co.emails.map(( em, index) => (
                  <div key={index} className="text-sm w-full overflow-hidden text-stone-400">
                    {em}
                  </div>
                ))}
              </div>

              <div className="col-span-1 row-span-3 flex flex-col px-2 py-1">
                <div className="text-xs font-semibold text-stone-500">
                  iletisim
                </div>
                <div className="text-xs font-semibold flex flex-wrap items-center gap-1 overflow-hidden">
                  {co.addresses[0].line1} <div className="text-xs">{co.addresses[0].line2}</div>
                </div>
                <div className="text-lg font-semibold flex flex-wrap items-center gap-2 overflow-hidden">
                  {co.addresses[0].city} <div className="text-sm capitalize">{co.addresses[0].district} {co.addresses[0].country}</div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <pre className="text-xs text-stone-400">
        {JSON.stringify(companies, null, 2)}  
        </pre>
    </div>

  );
};

export default CompanyTable;
