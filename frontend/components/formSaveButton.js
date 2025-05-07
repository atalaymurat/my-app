export default function FormSaveButton({isSubmitting}) {
  return (
    <>
      <button
        type="submit"
        className={`btn-submit mt-4 mb-8 w-full ${
          isSubmitting && "bg-red-500 text-white"
        } `}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Kaydediyor..." : "Kaydet"}
      </button>
    </>
  );
}
