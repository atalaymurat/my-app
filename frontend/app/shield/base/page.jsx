import PageLinks from "@/components/templates/PageLinks";

const BaseIndex = async () => {
  return (
    <div className="text-white">
      <PageLinks links={[{ href: "/shield/base/new", label: "New Base" }]} />
      <pre className="text-white">
      </pre>
    </div>
  );
};

export default BaseIndex;
