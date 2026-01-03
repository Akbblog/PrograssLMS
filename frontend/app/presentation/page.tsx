export default function PresentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
          Progress LMS
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          Transforming Education with Digital Learning
        </p>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Complete School Management System
          </h2>
          <p className="text-slate-600 mb-6">
            Manage students, teachers, academics, attendance, and more with our comprehensive LMS platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </a>
            <a
              href="/about"
              className="bg-slate-200 text-slate-800 px-6 py-3 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
