
import TableTemplate from "../templates/TableTemplate";

const CompanyTable = ({ companies }) => {
  return (
    <div>
      <TableTemplate
        title="Firmalar"
        data={companies}
        columns={[
          { key: "customTitle", label: "Firma", imageKey: "favicon" },
          { key: "userDomains", label: "Web", className: "hidden md:block", type:"array" },
          { key: "addresses", label: "Address", type:'objectArray', subFields: ['city', 'country'] },
        ]}
      />
      {/* Add your table implementation here */}
    </div>
  );
};

export default CompanyTable;
