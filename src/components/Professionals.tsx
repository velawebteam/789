import { MapPin, Star, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import Map from './Map';
import BrandName from './BrandName';

export default function Professionals() {
  const [activeFilter, setActiveFilter] = useState('All Professions');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const professions = ['All Professions', 'Electrician', 'Plumber', 'Carpenter', 'Mason', 'Painter', 'Roofer', 'Welder', 'Tiler'];

  const trainingImages = [
    "https://lh3.googleusercontent.com/d/1or_VmB1l6vgMna1kvO8qKdNQgjX-0DE6",
    "https://lh3.googleusercontent.com/d/1yk-FDB_hW--OjTJMjhJ1fZFNpx5wIzLH",
    "https://lh3.googleusercontent.com/d/1pjygJuSQ4ynVRlvOBDQTWSAMmrk9rzsx"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % trainingImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="professionals" className="py-16 md:py-32 bg-[#111315] relative border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight notranslate" translate="no">
            Certified Professionals <span className="text-[#FFB800]">Near You</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Browse our network of certified <BrandName withAcademy /> across Portugal. Each professional has completed our rigorous certification program.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {professions.map((prof) => (
            <button 
              key={prof}
              onClick={() => setActiveFilter(prof)}
              className={`${
                activeFilter === prof 
                  ? 'bg-[#FFB800] text-black' 
                  : 'bg-[#1a1d21] text-gray-300 border border-white/10 hover:bg-white/5'
              } px-6 py-2 rounded-full text-sm font-bold transition-colors`}
            >
              {prof}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Panel */}
          <div className="bg-[#1a1d21] rounded-2xl border border-white/10 p-2 relative overflow-hidden flex flex-col h-[300px] md:h-[400px] lg:h-[450px]">
            <div className="absolute inset-0 z-0">
              <Map />
            </div>

            <div className="absolute bottom-0 right-0 z-10 p-4 bg-[#1a1d21] rounded-tl-2xl border-t border-l border-white/10 min-w-[140px]">
              <div className="text-gray-400 text-xs font-bold mb-2">Certificate Levels</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-300"><span className="w-2 h-2 rounded-full bg-green-500"></span> RB1</div>
                <div className="flex items-center gap-2 text-xs text-gray-300"><span className="w-2 h-2 rounded-full bg-blue-500"></span> RB2</div>
                <div className="flex items-center gap-2 text-xs text-gray-300"><span className="w-2 h-2 rounded-full bg-[#FFB800]"></span> RB3</div>
              </div>
            </div>
          </div>

          {/* List Panel */}
          <div className="bg-[#1a1d21] rounded-2xl border border-white/10 p-6 flex flex-col h-[300px] md:h-[400px] lg:h-[450px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg">Builders in Lisbon</h3>
              <span className="text-gray-400 text-xs">8 professionals</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* Builder 1 */}
              <div className="bg-[#222529] rounded-xl p-4 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#332b1a] text-[#FFB800] flex items-center justify-center font-bold">J</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-bold text-sm">João Silva</h4>
                      <span className="bg-blue-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">RB2</span>
                    </div>
                    <div className="text-[#FFB800] text-xs font-semibold">Electrician</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-[#FFB800] text-xs font-bold">
                        <Star size={10} className="fill-current mr-1" /> 4.8
                      </div>
                      <div className="text-gray-500 text-xs">5y</div>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-gray-500 text-[10px] font-bold uppercase tracking-wider border border-white/10 px-2 py-1 rounded">
                  <Lock size={10} /> COMING SOON
                </button>
              </div>

              {/* Builder 2 */}
              <div className="bg-[#222529] rounded-xl p-4 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#332b1a] text-[#FFB800] flex items-center justify-center font-bold">M</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-bold text-sm">Miguel Santos</h4>
                      <span className="bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">RB1</span>
                    </div>
                    <div className="text-[#FFB800] text-xs font-semibold">Plumber</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-[#FFB800] text-xs font-bold">
                        <Star size={10} className="fill-current mr-1" /> 4.5
                      </div>
                      <div className="text-gray-500 text-xs">3y</div>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-gray-500 text-[10px] font-bold uppercase tracking-wider border border-white/10 px-2 py-1 rounded">
                  <Lock size={10} /> COMING SOON
                </button>
              </div>

              {/* Builder 3 */}
              <div className="bg-[#222529] rounded-xl p-4 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#332b1a] text-[#FFB800] flex items-center justify-center font-bold">P</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-bold text-sm">Pedro Ferna...</h4>
                      <span className="bg-blue-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">RB2</span>
                    </div>
                    <div className="text-[#FFB800] text-xs font-semibold">Mason</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-[#FFB800] text-xs font-bold">
                        <Star size={10} className="fill-current mr-1" /> 4.7
                      </div>
                      <div className="text-gray-500 text-xs">7y</div>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-gray-500 text-[10px] font-bold uppercase tracking-wider border border-white/10 px-2 py-1 rounded">
                  <Lock size={10} /> COMING SOON
                </button>
              </div>

              {/* Builder 4 */}
              <div className="bg-[#222529] rounded-xl p-4 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#332b1a] text-[#FFB800] flex items-center justify-center font-bold">R</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-bold text-sm">Rui Pereira</h4>
                      <span className="bg-blue-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">RB2</span>
                    </div>
                    <div className="text-[#FFB800] text-xs font-semibold">Roofer</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-[#FFB800] text-xs font-bold">
                        <Star size={10} className="fill-current mr-1" /> 4.9
                      </div>
                      <div className="text-gray-500 text-xs">6y</div>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-gray-500 text-[10px] font-bold uppercase tracking-wider border border-white/10 px-2 py-1 rounded">
                  <Lock size={10} /> COMING SOON
                </button>
              </div>

              {/* Builder 5 */}
              <div className="bg-[#222529] rounded-xl p-4 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#332b1a] text-[#FFB800] flex items-center justify-center font-bold">A</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-bold text-sm">Ana Costa</h4>
                      <span className="bg-[#FFB800] text-black text-[8px] font-bold px-1.5 py-0.5 rounded">RB3</span>
                    </div>
                    <div className="text-[#FFB800] text-xs font-semibold">Welder</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-[#FFB800] text-xs font-bold">
                        <Star size={10} className="fill-current mr-1" /> 4.9
                      </div>
                      <div className="text-gray-500 text-xs">8y</div>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-gray-500 text-[10px] font-bold uppercase tracking-wider border border-white/10 px-2 py-1 rounded">
                  <Lock size={10} /> COMING SOON
                </button>
              </div>

              {/* Builder 6 */}
              <div className="bg-[#222529] rounded-xl p-4 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#332b1a] text-[#FFB800] flex items-center justify-center font-bold">C</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-bold text-sm">Carlos Silva</h4>
                      <span className="bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">RB1</span>
                    </div>
                    <div className="text-[#FFB800] text-xs font-semibold">Carpenter</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-[#FFB800] text-xs font-bold">
                        <Star size={10} className="fill-current mr-1" /> 4.6
                      </div>
                      <div className="text-gray-500 text-xs">2y</div>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-gray-500 text-[10px] font-bold uppercase tracking-wider border border-white/10 px-2 py-1 rounded">
                  <Lock size={10} /> COMING SOON
                </button>
              </div>

              {/* Builder 7 */}
              <div className="bg-[#222529] rounded-xl p-4 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#332b1a] text-[#FFB800] flex items-center justify-center font-bold">S</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-bold text-sm">Sofia Martins</h4>
                      <span className="bg-blue-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">RB2</span>
                    </div>
                    <div className="text-[#FFB800] text-xs font-semibold">Painter</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-[#FFB800] text-xs font-bold">
                        <Star size={10} className="fill-current mr-1" /> 4.7
                      </div>
                      <div className="text-gray-500 text-xs">4y</div>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-gray-500 text-[10px] font-bold uppercase tracking-wider border border-white/10 px-2 py-1 rounded">
                  <Lock size={10} /> COMING SOON
                </button>
              </div>

              {/* Builder 8 */}
              <div className="bg-[#222529] rounded-xl p-4 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#332b1a] text-[#FFB800] flex items-center justify-center font-bold">T</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-bold text-sm">Tiago Mendes</h4>
                      <span className="bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">RB1</span>
                    </div>
                    <div className="text-[#FFB800] text-xs font-semibold">Plumber</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-[#FFB800] text-xs font-bold">
                        <Star size={10} className="fill-current mr-1" /> 4.4
                      </div>
                      <div className="text-gray-500 text-xs">1y</div>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-gray-500 text-[10px] font-bold uppercase tracking-wider border border-white/10 px-2 py-1 rounded">
                  <Lock size={10} /> COMING SOON
                </button>
              </div>
            </div>
          </div>

          {/* Image Panel */}
          <div className="bg-[#1a1d21] rounded-2xl border border-white/10 overflow-hidden relative h-[300px] md:h-[400px] lg:h-[450px]">
            {trainingImages.map((img, index) => (
              <img 
                key={img}
                src={img} 
                alt={`Builder in training ${index + 1}`} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                } ${
                  index === 2 ? 'object-top' : 
                  index === 1 ? 'object-top md:object-center' : 
                  'object-center'
                }`}
                referrerPolicy="no-referrer"
              />
            ))}
            <div className="absolute bottom-4 right-4 text-black font-black text-xs bg-white/80 px-2 py-1 rounded backdrop-blur-sm z-10">
              BUILDERS UNDER TRAINING
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
