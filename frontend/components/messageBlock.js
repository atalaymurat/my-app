export default function MessageBlock({ message }) {
  if (message) {
    return (
      <>
        <div
          className={
            message.type === "error"
              ? "bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
              : "bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
          }
          role="alert"
        >
          <p className="font-bold">
            {message.type === "error" ? "Hata !" : "Bilgilendirme ..."}
          </p>
          <p>{message.text}</p>
        </div>
      </>
    );
  } else {
    return null;
  }
}
