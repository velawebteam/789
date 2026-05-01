import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MobileCollapsibleProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export default function MobileCollapsible({ title, children, defaultExpanded = false }: MobileCollapsibleProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b border-white/5 lg:border-none">
      {/* Mobile Header - only visible on small screens */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full lg:hidden py-8 px-6 flex items-center justify-between group transition-all"
      >
        <h2 className="text-xl font-black text-white tracking-tight uppercase group-hover:text-[#FFB800] transition-colors text-left pr-4">
          {title}
        </h2>
        <div className={`p-2 rounded-full border transition-all ${isExpanded ? 'bg-[#FFB800] border-[#FFB800] text-black rotate-180' : 'bg-white/5 border-white/10 text-gray-400 group-hover:text-white'}`}>
          <ChevronDown size={20} />
        </div>
      </button>

      {/* Desktop View / Mobile Expanded View */}
      <div className="hidden lg:block">
        {children}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden lg:hidden"
          >
            <div className="pb-12">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
