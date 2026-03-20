import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HOMEPAGE_STATS } from '@/const';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function HeroSection() {
  return (
    <section
      className="relative w-full h-screen md:h-[85vh] flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(15, 79, 75, 0.9) 0%, rgba(27, 127, 121, 0.9) 100%), 
                     repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)`,
      }}
    >
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'loop' }}
          className="absolute -top-1/2 -right-1/2 w-full h-full opacity-10"
        >
          <div className="w-96 h-96 bg-bocra-golden-yellow rounded-full blur-3xl" />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container text-center text-white max-w-3xl"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="inline-block px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
            <span className="text-xs font-medium text-white">Botswana's Communications Regulator</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
        >
          Connecting Botswana. Protecting Citizens. Regulating the Future.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-white/85 mb-8 leading-relaxed max-w-2xl mx-auto"
        >
          BOCRA is mandated to regulate telecommunications, broadcasting, postal, and internet services in Botswana in the public interest — making communications accessible, fair, and secure for every citizen.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button
            className="bg-white text-bocra-teal hover:bg-white/90 font-semibold px-8 py-6 text-base"
            onClick={() => (window.location.href = '/complaints')}
          >
            File a Complaint
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-base"
            onClick={() => (window.location.href = '/licensing')}
          >
            Apply for Licence
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {HOMEPAGE_STATS.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-4 md:p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-colors"
            >
              <div className="text-2xl md:text-3xl font-bold text-bocra-golden-yellow mb-2">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-white/80">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-white/60">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-white/60 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
