export function BuilderStrip() {
  return (
    <div className="w-full max-w-3xl mx-auto mt-5 flex flex-row gap-2 items-center rounded-3xl bg-neutral-900 text-[15px] font-mono text-white px-6 py-2"
      style={{ boxShadow: '0 2px 12px #0002'}}>
      <span className="inline-block w-2 h-2 mr-2 rounded-full bg-green-400 animate-pulse"></span>
      <span className="select-none">
        deploy: <span className="text-green-300 font-semibold">garden@v1.0</span> • flowers seeded anonymously
      </span>
    </div>
  );
}
