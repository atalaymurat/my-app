export default function FormSaveButton({ isSubmitting }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="mt-6 mb-8 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-600 hover:border-stone-400 bg-stone-900 hover:bg-stone-800 text-sm font-semibold text-stone-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Kaydediyor...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Kaydet
        </>
      )}
    </button>
  );
}
