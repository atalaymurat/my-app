import TableTemplate from "../templates/TableTemplate";

const ContactTable = ({ contacts }) => {
  return (
    <div>
      <TableTemplate
        title="Kisiler Temp"
        data={contacts}
        columns={[
          { key: "uName", label: "isim" },
          { key: "uEmails", label: "Email", className: "hidden md:block", type:"array" },
          { key: "uPhones", label: "Telefon", type:'array', format:"phone" },
        ]}
      />
      {/* Add your table implementation here */}
    </div>
  );
};

export default ContactTable;
