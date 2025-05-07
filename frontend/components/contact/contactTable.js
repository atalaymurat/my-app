import { localeDate } from "@/lib/helpers";
import UserAvatar from "../UserAvatar";

const ContactTable = ({ contacts }) => {
  return (
    <div>
      <div className="text-2xl font-bold py-4">Kişiler</div>
      {/* Table Header */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-black text-white border-b py-2 px-2 rounded-t-xl font-semibold">
        <div>İsim</div>
        <div className="hidden md:block">Email</div>
        <div className="block">Telefon</div>
      </div>
      {/* Table Content */}
      <div>
        {contacts.map((item, index) => (
          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-2 border-b py-2 px-2"
            key={index}
          >
            <div>
              <div className="flex flex-row items-center">
                <div className="mr-2">
                  <UserAvatar name={item.name} />
                </div>
                <div className="flex flex-col">
                  <div>{item.name}</div>
                  <div className="text-xs">{localeDate(item.createdAt)}</div>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              {item.emails.map((email, index) => (
                <div key={index} className="border-b border-gray-300">
                  <div>
                    {email.address} {email.isPrimary && <span>(*)</span>}
                  </div>
                  <div className="text-xs">caption</div>
                </div>
              ))}
            </div>

            <div className="">
              {item.phones.map((phone, index) => (
                <div key={index} className="border-b border-gray-300">
                  <a href={`tel:${phone.number}`}>{phone.number}</a>
                  <div className="text-xs">{phone.type}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Add your table implementation here */}
    </div>
  );
};

export default ContactTable;
