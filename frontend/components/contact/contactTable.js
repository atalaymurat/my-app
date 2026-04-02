const genderIcon = (gender) => {
  if (gender === "male") return "♂";
  if (gender === "female") return "♀";
  return "";
};

const ContactTable = ({ contacts, onEdit, onDelete }) => {
  return (
    <div className="px-2 py-2 grid grid-cols-1 lg:grid-cols-2 gap-3">
      {contacts && contacts.map((co, index) => (
        <div key={index} className="border border-stone-600 rounded-lg overflow-hidden text-stone-300">

          {/* Başlık */}
          <div className="bg-stone-700 px-3 py-2 flex items-center justify-between">
            <span className="font-bold text-white capitalize">
              {genderIcon(co.uGender)} {co.uName}
            </span>
            <div className="flex items-center gap-2">
              {co.uImage && (
                <img src={co.uImage} alt={co.uName} className="w-8 h-8 rounded-full object-cover" />
              )}
              <button onClick={() => onEdit?.(co)} className="text-stone-400 hover:text-blue-400 transition cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                </svg>
              </button>
              <button onClick={() => onDelete?.(co)} className="text-stone-400 hover:text-red-400 transition cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-3 py-2 space-y-2">

            {/* Telefon & Email */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {co.uPhones?.map((phone, i) => (
                <a key={i} href={`tel:${phone}`} className="text-stone-300">{phone}</a>
              ))}
              {co.uEmails?.map((em, i) => (
                <a key={i} href={`mailto:${em}`} className="text-stone-400 truncate max-w-[180px]">{em}</a>
              ))}
            </div>

            {/* Firma */}
            {co.uCompany && (
              <div className="text-xs text-stone-500 border-t border-stone-700 pt-2">
                {co.uCompany?.title || co.uCompany}
              </div>
            )}

          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactTable;
