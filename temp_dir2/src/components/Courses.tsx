import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useRef, useEffect } from 'react';

const COURSES_LIST = [
  { 
    name: "Tiles & Tiling",
    mastery: [
      "Surface preparation mastery",
      "Precision cutting & layout planning",
      "Grouting & sealing techniques",
      "Pattern design & installation",
      "Waterproofing for wet areas"
    ]
  },
  { 
    name: "Plastering / Microcement",
    mastery: [
      "Smooth surface finishing",
      "Decorative texture creation",
      "Micro cement application",
      "Crack repair & restoration",
      "Color mixing & matching"
    ]
  },
  { 
    name: "Professional Cleaning",
    mastery: [
      "Post-construction cleaning protocols",
      "Industrial cleaning equipment",
      "Surface-specific treatments",
      "Safety & chemical handling",
      "Quality inspection standards"
    ]
  },
  { 
    name: "Construction Assistant",
    mastery: [
      "Site organization & safety",
      "Tool maintenance & handling",
      "Material preparation & mixing",
      "Basic structural support",
      "Waste management & efficiency"
    ]
  },
  { 
    name: "Masonry / Plastering",
    mastery: [
      "Brick & block laying techniques",
      "Mortar mixing & application",
      "Structural wall construction",
      "Exterior rendering & finishing",
      "Leveling & alignment precision"
    ]
  },
  { 
    name: "Drywall (Pladur)",
    mastery: [
      "Professional partition wall installation",
      "Ceiling system techniques",
      "Fire-resistant & soundproof solutions",
      "Proper joint finishing & taping",
      "Industry-standard safety practices"
    ]
  },
  { 
    name: "Framing",
    mastery: [
      "Timber & metal stud framing",
      "Structural load calculations",
      "Door & window opening headers",
      "Roof truss installation",
      "Wall squaring & bracing"
    ]
  },
  { 
    name: "Steel Work",
    mastery: [
      "Steel cutting & welding techniques",
      "Structural steel assembly",
      "Metal framework construction",
      "Safety equipment & protocols",
      "Blueprint reading for steel structures"
    ]
  },
  { 
    name: "Stock Management / Logistics",
    mastery: [
      "Inventory control systems",
      "Supply chain coordination",
      "Material handling & storage",
      "Delivery scheduling & tracking",
      "Procurement & vendor relations"
    ]
  }
];

export default function Courses() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const courses = COURSES_LIST;

  // Triplicate courses for seamless infinite scrolling
  const infiniteCourses = [...courses, ...courses, ...courses];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Initialize scroll position to the middle set to allow scrolling left immediately
    const initScroll = () => {
      const children = container.children;
      if (children.length >= courses.length) {
        const singleSetWidth = (children[courses.length] as HTMLElement).offsetLeft - (children[0] as HTMLElement).offsetLeft;
        container.scrollLeft = singleSetWidth;
      }
    };
    
    // Small delay to ensure rendering is complete
    setTimeout(initScroll, 100);

    const handleScroll = () => {
      const children = container.children;
      if (children.length < courses.length * 2) return;
      
      const singleSetWidth = (children[courses.length] as HTMLElement).offsetLeft - (children[0] as HTMLElement).offsetLeft;
      
      // Jump forward if we scroll too far left (into the first half of the first set)
      if (container.scrollLeft < singleSetWidth * 0.5) {
        container.style.scrollSnapType = 'none';
        container.scrollLeft += singleSetWidth;
        container.style.scrollSnapType = 'x mandatory';
      }
      // Jump backward if we scroll too far right (into the second half of the third set)
      else if (container.scrollLeft > singleSetWidth * 2.5) {
        container.style.scrollSnapType = 'none';
        container.scrollLeft -= singleSetWidth;
        container.style.scrollSnapType = 'x mandatory';
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [courses.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstItem = container.children[0] as HTMLElement;
      if (!firstItem) return;
      
      // Calculate exact scroll amount based on item width + gap
      const secondItem = container.children[1] as HTMLElement;
      const scrollAmount = secondItem ? secondItem.offsetLeft - firstItem.offsetLeft : firstItem.offsetWidth + 16;
      
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const openNotifyMe = () => {
    window.dispatchEvent(new CustomEvent('openNotifyMe'));
  };

  return (
    <section id="courses" className="pt-16 md:pt-32 pb-8 bg-[#15181b] relative border-t border-white/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight uppercase">
            OUR COURSES
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Master the skills that build the world
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-[#1a1d21] border border-white/10 text-white p-3 rounded-full hover:bg-[#FFB800] hover:text-black hover:border-[#FFB800] transition-colors shadow-xl"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-[#1a1d21] border border-white/10 text-white p-3 rounded-full hover:bg-[#FFB800] hover:text-black hover:border-[#FFB800] transition-colors shadow-xl"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 px-4 -mx-4 no-scrollbar"
          >
            {infiniteCourses.map((course, index) => (
              <div 
                key={index} 
                onClick={openNotifyMe}
                className="bg-gradient-to-br from-[#1a1d21] to-[#111315] rounded-xl p-6 border border-white/5 hover:border-[#FFB800]/30 hover:bg-[#1e2125] transition-all cursor-pointer group min-w-[260px] sm:min-w-[300px] snap-start flex-shrink-0 flex flex-col justify-between h-[240px] relative overflow-hidden"
              >
                {/* Background Number */}
                <div className="absolute top-4 right-4 text-white/5 font-black text-6xl group-hover:text-white/10 transition-colors select-none">
                  {String((index % courses.length) + 1).padStart(2, '0')}
                </div>

                {/* Normal Content */}
                <div className="relative z-10 group-hover:opacity-0 transition-opacity duration-300">
                  <div className="text-[#FFB800] text-[10px] font-bold tracking-widest uppercase mb-3">Certification</div>
                  <h3 className="text-white font-bold text-xl leading-tight w-4/5 group-hover:text-[#FFB800] transition-colors">{course.name}</h3>
                </div>

                {/* Hover Content (Mastery) */}
                <div className="absolute inset-0 z-20 p-6 bg-[#1a1d21] flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="text-[#FFB800] text-[10px] font-bold tracking-widest uppercase mb-3">What you'll master:</div>
                  <ul className="space-y-2">
                    {course.mastery.map((item, i) => (
                      <li key={i} className="text-white text-xs flex items-start gap-2">
                        <span className="text-[#FFB800] mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative z-10 flex items-center gap-2 text-gray-500 text-sm font-semibold group-hover:text-white transition-colors mt-4 uppercase">
                  Notify Me <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
