import TableTemplate from "../templates/TableTemplate";

const OptionTable = ({ options }) => {
  return (
    <div>
      <TableTemplate
        title="Firmalar"
        data={options}
        columns={[
          { key: "title", label: "Tanim" },
          { key: "description", label: "Aciklama", className: "hidden md:block"},
          { key: "priceList", label: "Liste Fiyati", type: "price" },
        ]}
      />
    </div>
  );
};

export default OptionTable;
