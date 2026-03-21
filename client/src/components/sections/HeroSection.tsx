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
      className="relative flex h-screen w-full items-center justify-center overflow-hidden md:h-[85vh]"
      style={{
        background: `linear-gradient(135deg, rgba(15, 79, 75, 0.9) 0%, rgba(27, 127, 121, 0.9) 100%),
                     repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'loop' }}
          className="absolute -right-1/2 -top-1/2 h-full w-full opacity-10"
        >
          <div className="h-96 w-96 rounded-full bg-bocra-golden-yellow blur-3xl" />
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container max-w-3xl text-center text-white"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <div className="inline-block rounded-full border border-white/20 bg-white/15 px-4 py-2 backdrop-blur-sm">
            <span className="text-xs font-medium text-white">
              Botswana&apos;s Communications Regulator
            </span>
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
        >
          Connecting Botswana. Protecting Citizens. Regulating the Future.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl"
        >
          BOCRA is mandated to regulate telecommunications, broadcasting,
          postal, and internet services in Botswana in the public interest,
          making communications accessible, fair, and secure for every
          citizen.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            className="bg-white px-8 py-6 text-base font-semibold text-bocra-teal hover:bg-white/90"
            onClick={() => (window.location.href = '/services/complaints')}
          >
            File a Complaint
          </Button>
          <Button
            variant="outline"
            className="border-white px-8 py-6 text-base font-semibold text-white hover:bg-white/10"
            onClick={() => (window.location.href = '/services/licensing')}
          >
            Apply for Licence
          </Button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
        >
          {HOMEPAGE_STATS.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm transition-colors hover:bg-white/15 md:p-6"
            >
              <div className="mb-2 text-2xl font-bold text-bocra-golden-yellow md:text-3xl">
                {stat.value}
              </div>
              <div className="text-xs text-white/80 md:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-white/60">Scroll to explore</span>
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 p-2">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-1 rounded-full bg-white/60"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
