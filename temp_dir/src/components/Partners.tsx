import { Building2, Wrench, HardHat, Truck, ShieldCheck, Zap } from 'lucide-react';

export default function Partners() {
  return (
    <section id="partners" className="py-16 md:py-32 bg-[#15181b] relative border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Trusted <span className="text-[#FFB800]">Partners</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We collaborate with industry leaders to provide our students with the best tools, materials, and job opportunities.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Partner 1 */}
          <div className="bg-[#1a1d21] rounded-xl p-6 border border-white/5 flex flex-col items-center justify-center gap-4 hover:border-[#FFB800]/30 transition-colors group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#FFB800] group-hover:bg-[#FFB800]/10 transition-colors">
              <Building2 size={24} />
            </div>
            <span className="text-gray-300 text-sm font-bold text-center">Construction<br/>Firms</span>
          </div>

          {/* Partner 2 */}
          <div className="bg-[#1a1d21] rounded-xl p-6 border border-white/5 flex flex-col items-center justify-center gap-4 hover:border-[#FFB800]/30 transition-colors group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#FFB800] group-hover:bg-[#FFB800]/10 transition-colors">
              <Wrench size={24} />
            </div>
            <span className="text-gray-300 text-sm font-bold text-center">Tool<br/>Manufacturers</span>
          </div>

          {/* Partner 3 */}
          <div className="bg-[#1a1d21] rounded-xl p-6 border border-white/5 flex flex-col items-center justify-center gap-4 hover:border-[#FFB800]/30 transition-colors group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#FFB800] group-hover:bg-[#FFB800]/10 transition-colors">
              <HardHat size={24} />
            </div>
            <span className="text-gray-300 text-sm font-bold text-center">Safety<br/>Equipment</span>
          </div>

          {/* Partner 4 */}
          <div className="bg-[#1a1d21] rounded-xl p-6 border border-white/5 flex flex-col items-center justify-center gap-4 hover:border-[#FFB800]/30 transition-colors group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#FFB800] group-hover:bg-[#FFB800]/10 transition-colors">
              <Truck size={24} />
            </div>
            <span className="text-gray-300 text-sm font-bold text-center">Material<br/>Suppliers</span>
          </div>

          {/* Partner 5 */}
          <div className="bg-[#1a1d21] rounded-xl p-6 border border-white/5 flex flex-col items-center justify-center gap-4 hover:border-[#FFB800]/30 transition-colors group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#FFB800] group-hover:bg-[#FFB800]/10 transition-colors">
              <ShieldCheck size={24} />
            </div>
            <span className="text-gray-300 text-sm font-bold text-center">Insurance<br/>Providers</span>
          </div>

          {/* Partner 6 */}
          <div className="bg-[#1a1d21] rounded-xl p-6 border border-white/5 flex flex-col items-center justify-center gap-4 hover:border-[#FFB800]/30 transition-colors group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#FFB800] group-hover:bg-[#FFB800]/10 transition-colors">
              <Zap size={24} />
            </div>
            <span className="text-gray-300 text-sm font-bold text-center">Energy<br/>Solutions</span>
          </div>
        </div>
      </div>
    </section>
  );
}
