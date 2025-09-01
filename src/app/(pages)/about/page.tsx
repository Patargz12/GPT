import Navbar from "@/app/components/shared/navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />
      <div className="pt-16 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About DotaGPT</h1>
          <p className="text-lg text-gray-300">
            DotaGPT is your AI-powered Dota 2 assistant, designed to help new
            players learn the game and improve their skills.
          </p>
        </div>
      </div>
    </div>
  );
}
