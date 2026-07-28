import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-4">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold font-heading">
          404
        </div>
        <h2 className="text-2xl font-bold font-heading text-slate-800">Page Not Found</h2>
        <p className="text-slate-500 text-xs font-body">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block w-full py-2.5 bg-[#10b981] hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
