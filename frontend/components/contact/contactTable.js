import UserAvatar from "../UserAvatar";
import PhoneNumber from "../PhoneNumber";
import ensureMinElements from "@/utils/ensureMinElements";

const ContactTable = ({ contacts }) => {
  const minItems = ensureMinElements(contacts, 10);
  return (
    <div className="overflow-hidden my-2 text-stone-300">
      <div className="text-2xl font-bold py-4" >Kişiler</div>
      {/* Table Header */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-black text-stone-200 border-b py-2 px-2 rounded-t-xl font-semibold">
        <div>İsim</div>
        <div className="hidden md:block">Email</div>
        <div className="block">Telefon</div>
      </div>
      {/* Table Content */}
      <div>
        {minItems.map((item, index) => (
          <div
            className="h-19 grid grid-cols-2 md:grid-cols-3 gap-2 border-b py-2 px-2 text-stone-300"
            key={index}
          >
            <div>
              <div className="flex flex-row items-center overflow-hidden">
                <div className="mr-2">
                  <UserAvatar name={item.name ? item.name : null} />
                </div>
                <div className="flex flex-col font-semibold text-stone-200 text-lg capitalize">
                  <div>{item.name}</div>
                </div>
              </div>
            </div>

            <div className="hidden md:block text-sm overflow-hidden">
              {item.emails?.slice(0, 3).map((email, index) => (
                <div key={index} className="text-stone-400 text-nowrap">
                  <div>{email}</div>
                </div>
              ))}
            </div>

            <div className="text-sm overflow-hidden">
              {item.phones?.slice(0, 3).map((phone, index) => (
                <div key={index} className="text-nowrap">
                  <PhoneNumber number={phone} textSize="text-sm" />
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
