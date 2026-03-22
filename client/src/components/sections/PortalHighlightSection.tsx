import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getLoginUrl } from '@/const';

const featureHighlights = [
  'Secure portal access',
  'Licence verification',
  'Complaint tracking',
] as const;

export default function PortalHighlightSection() {
  return (
    <section className="w-full bg-gradient-to-r from-bocra-teal to-bocra-forest-green py-10 text-white md:py-14">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container text-center"
      >
        <h2 className="mb-4 text-3xl font-bold text-black md:text-4xl">
          One BOCRA View for Citizens and Staff
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-lg text-black">
          Sign in to verify licence holders, review complaint activity, and
          use the same Supabase-backed demo accounts that feed the admin queue.
        </p>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          {featureHighlights.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-black backdrop-blur-sm"
            >
              {item}
            </span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Button
            className="bg-white px-8 py-6 text-base font-semibold text-bocra-teal hover:bg-white/90"
            onClick={() => (window.location.href = getLoginUrl())}
          >
            Open Portal
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
