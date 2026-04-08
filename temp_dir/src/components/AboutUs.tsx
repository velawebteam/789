import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import BrandName from './BrandName';

const Counter = ({ from, to, duration = 2, suffix = '' }: { from: number, to: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        
        // easeOutQuart easing function
        const easeOut = 1 - Math.pow(1 - progress, 4);
        
        setCount(Math.floor(easeOut * (to - from) + from));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} translate="no" className="notranslate">
      {count}{suffix}
    </span>
  );
};

export default function AboutUs() {
  return (
    <section id="about" className="py-32 bg-[#0a0a0a] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-gray-400 text-base leading-relaxed space-y-4"
          >
            <h2 className="text-2xl font-black text-white tracking-tight uppercase mb-6">
              ABOUT <BrandName />
            </h2>
            <p className="text-white font-bold">
              To become a <BrandName /> is more than a profession.
            </p>
            <p className="text-[#FFB800] italic font-semibold">
              It is a mindset. A statement. A way of life.
            </p>
            <p>
              <BrandName /> is about taking your career, your income, and your personal standards to the next level.
            </p>
            <p className="text-white font-bold">
              To earn more, you must become more.
            </p>
            <p>
              This is your opportunity to unlock your real potential — starting tomorrow — and build a stronger future.
            </p>
            <p className="text-white font-bold">
              By joining <BrandName />, you become part of something that has never existed before:
            </p>
            <p className="text-[#FFB800] font-bold">
              A new generation of construction professionals.
            </p>
            <p className="italic">
              Intelligent. Business-minded. Physically strong. Mentally sharp.
            </p>
            <p className="text-white font-bold">
              You are not just a worker.
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-[#FFB800] font-black text-xl uppercase">
                YOU ARE A <BrandName />.
              </p>
              <p><BrandName /> is a new standard of personality.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 sm:gap-6"
          >
            <div className="bg-[#111315] border border-white/5 rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center text-center group hover:border-[#FFB800]/30 transition-colors duration-300">
              <div className="text-3xl sm:text-5xl font-black text-white mb-1 sm:mb-2 group-hover:text-[#FFB800] transition-colors duration-300">
                <Counter from={0} to={20} suffix="+" />
              </div>
              <div className="text-gray-500 text-[10px] sm:text-xs font-bold tracking-widest uppercase">COURSES</div>
            </div>
            
            <div className="bg-[#111315] border border-white/5 rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center text-center group hover:border-[#FFB800]/30 transition-colors duration-300 sm:translate-y-8">
              <div className="text-3xl sm:text-5xl font-black text-white mb-1 sm:mb-2 group-hover:text-[#FFB800] transition-colors duration-300">
                <Counter from={0} to={300} suffix="+" />
              </div>
              <div className="text-gray-500 text-[10px] sm:text-xs font-bold tracking-widest uppercase">GRADUATES</div>
            </div>
            
            <div className="bg-[#111315] border border-white/5 rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center text-center group hover:border-[#FFB800]/30 transition-colors duration-300">
              <div className="text-3xl sm:text-5xl font-black text-white mb-1 sm:mb-2 group-hover:text-[#FFB800] transition-colors duration-300">
                <Counter from={0} to={93} suffix="%" />
              </div>
              <div className="text-gray-500 text-[10px] sm:text-xs font-bold tracking-widest uppercase">JOB RATE</div>
            </div>

            <div className="bg-[#111315] border border-white/5 rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center text-center group hover:border-[#FFB800]/30 transition-colors duration-300 sm:translate-y-8">
              <div className="text-3xl sm:text-5xl font-black text-white mb-1 sm:mb-2 group-hover:text-[#FFB800] transition-colors duration-300">
                <Counter from={0} to={15} suffix="+" />
              </div>
              <div className="text-gray-500 text-[10px] sm:text-xs font-bold tracking-widest uppercase">PARTNERS</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
