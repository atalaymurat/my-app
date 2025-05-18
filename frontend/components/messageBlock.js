export default function MessageBlock({ message }) {
  if (message) {
    return (
      <div className="my-4">
        <div
          className={
            message.type === "error"
              ? "bg-red-200 border-l-4 border-red-600 text-red-800 p-4"
              : "bg-green-200 border-l-4 border-green-600 text-green-800 p-4"
          }
          role="alert"
        >
          <p className="font-bold">
            {message.type === "error" ? "Hata !" : "Bilgilendirme ..."}
          </p>
          <p>{message.text}</p>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
