export default function HeroSection() {
  return (
    <section className="relative z-10 px-4 py-20 text-center">
      <h1 className="text-balance mb-6 text-6xl font-bold tracking-tight text-black">
        Process Hierarchical Graphs with Precision
      </h1>

      <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
        Transform your API ideas into powerful graph processing solutions. Analyze hierarchies, detect cycles, and validate graph structures with ease.
      </p>

      {/* CTA Buttons */}
      <div className="mb-4 flex justify-center">
        <button
          type="button"
          onClick={() =>
            document
              .getElementById('dashboard')
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
          className="rounded-md bg-black px-10 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
        >
          Test the API ↓
        </button>
      </div>
    </section>
  );
}
