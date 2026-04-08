import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import BrandName from '../components/BrandName';

interface FAQ {
  question: string;
  answer: ReactNode;
  answerText: string; // For SEO structured data
}

const faqs: FAQ[] = [
  {
    question: "What is Real Builder?",
    answer: (
      <>
        <BrandName />{' '}is a premier construction academy in Portugal dedicated to transforming individuals with basic or no experience into certified, job-ready construction professionals. We focus on intensive, hands-on training to meet the high demand of the modern construction industry.
      </>
    ),
    answerText: "Real Builder is a premier construction academy in Portugal dedicated to transforming individuals with basic or no experience into certified, job-ready construction professionals. We focus on intensive, hands-on training to meet the high demand of the modern construction industry."
  },
  {
    question: "How does the certification process work?",
    answer: "Our certification process is divided into levels (RB1, RB2, RB3). You start with foundational safety and basic skills, progressing to specialized techniques in areas like plumbing, electrical work, carpentry, and masonry. Each level requires passing rigorous practical exams.",
    answerText: "Our certification process is divided into levels (RB1, RB2, RB3). You start with foundational safety and basic skills, progressing to specialized techniques in areas like plumbing, electrical work, carpentry, and masonry. Each level requires passing rigorous practical exams."
  },
  {
    question: "Do I need prior construction experience to join?",
    answer: "No prior experience is required for our foundational RB1 courses. We welcome anyone with the right mindset, physical readiness, and willingness to learn. We provide all the necessary tools and knowledge from day one.",
    answerText: "No prior experience is required for our foundational RB1 courses. We welcome anyone with the right mindset, physical readiness, and willingness to learn. We provide all the necessary tools and knowledge from day one."
  },
  {
    question: "What is the job placement rate after graduation?",
    answer: (
      <>
        We are proud of our 93% job placement rate. Thanks to our strong partnerships with leading construction companies across Portugal, our certified{' '}<BrandName withAcademy={false} />s have direct pathways to high-paying, stable employment immediately after graduation.
      </>
    ),
    answerText: "We are proud of our 93% job placement rate. Thanks to our strong partnerships with leading construction companies across Portugal, our certified Real Builders have direct pathways to high-paying, stable employment immediately after graduation."
  },
  {
    question: "Are the courses taught in English or Portuguese?",
    answer: "To accommodate a diverse range of students, including locals and expatriates, our high-intensity, on-site learning programs are available in both Portuguese and English.",
    answerText: "To accommodate a diverse range of students, including locals and expatriates, our high-intensity, on-site learning programs are available in both Portuguese and English."
  },
  {
    question: "How long does it take to get certified?",
    answer: "The initial RB1 certification (Getting Started) typically takes between 1 to 4 weekends, depending on the specific course track. Advanced certifications (RB2 and RB3) require additional specialized training modules.",
    answerText: "The initial RB1 certification (Getting Started) typically takes between 1 to 4 weekends, depending on the specific course track. Advanced certifications (RB2 and RB3) require additional specialized training modules."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    // SEO Enhancements
    document.title = "Frequently Asked Questions | Real Builder Construction Academy";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Find answers to frequently asked questions about Real Builder, the premier construction academy in Portugal. Learn about our courses, certification, and job placement.");
    }

    // JSON-LD Structured Data for FAQ
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answerText
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      // Cleanup
      document.title = "Real Builder";
      if (metaDescription) {
        metaDescription.setAttribute("content", "Real Builder Construction Academy");
      }
      document.head.removeChild(script);
    };
  }, []);

  return (
    <main className="pt-20 min-h-screen bg-[#0a0a0a]">
      <section className="py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Frequently Asked <span className="text-[#FFB800]">Questions</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Everything you need to know about the Real Builder academy, our courses, and your future career in construction.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border ${openIndex === index ? 'border-[#FFB800]/50 bg-[#111315]' : 'border-white/10 bg-[#111315]/50'} rounded-2xl overflow-hidden transition-colors duration-300`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
                >
                  <span className={`font-bold text-lg md:text-xl ${openIndex === index ? 'text-[#FFB800]' : 'text-white'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${openIndex === index ? 'rotate-180 text-[#FFB800]' : ''}`} 
                    size={24} 
                  />
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 md:px-8 pb-6 md:pb-8 text-gray-400 text-base md:text-lg leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
