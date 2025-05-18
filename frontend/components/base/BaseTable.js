import TableTemplate from "../templates/TableTemplate";

const BaseTable = ({ baseProducts }) => {
  return (
    <div>
      <TableTemplate
        title="Firmalar"
        data={baseProducts}
        columns={[
          { key: "title", label: "Tanim" },
          { key: "model", label: "Model", className: "hidden md:block"},
          { key: "make", label: "Marka" },
        ]}
      />
    </div>
  );
};

export default BaseTable;
