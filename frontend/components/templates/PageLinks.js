import Link from "next/link";

const PageLinks = ({links}) => {
  return (
    <>
      <div className="grid md:grid-cols-3 gap-2 my-4 mx-2">
        {links.map((link, index) => (
          <Link href={link.href} key={index}>
            <div key={index} className="btn-purple mt-2">
              {link.label}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default PageLinks;
