import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl max-w-md w-full space-y-4">
        <div className="w-16 h-16 bg-emerald-50 text-[#105634] rounded-2xl flex items-center justify-center mx-auto text-2xl font-black font-heading border border-emerald-100">
          404
        </div>
        <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">Page Not Found</h2>
        <p className="text-slate-500 text-xs leading-relaxed">
          The merchant page or route you are attempting to access does not exist or has been relocated.
        </p>
        <Link
          href="/"
          className="inline-block w-full py-3 bg-[#105634] hover:bg-[#0e3e26] text-white font-bold rounded-2xl text-xs transition-all shadow-md font-heading"
        >
          Return to Portal
        </Link>
      </div>
    </div>
  );
}
