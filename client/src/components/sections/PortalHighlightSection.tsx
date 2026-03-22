import { motion } from 'framer-motion';
import { Clock, Shield, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getLoginUrl } from '@/const';

const features = [
  {
    icon: Shield,
    title: 'Secure Portal Access',
    description:
      'Sign in with a BOCRA account and load role-based dashboard views for citizens and admins.',
  },
  {
    icon: Clock,
    title: 'Licence Verification',
    description:
      'Search the mirrored BOCRA licence register in the portal instead of downloading the source workbook first.',
  },
  {
    icon: Smartphone,
    title: 'Complaint Tracking',
    description:
      'File a complaint, then monitor its progress from the same dashboard used for verification and follow-up.',
  },
];

export default function PortalHighlightSection() {
  return (
    <section className="w-full bg-gradient-to-r from-bocra-teal to-bocra-forest-green py-14 text-white md:py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          One BOCRA View for Citizens and Staff
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-lg text-white/90">
          Sign in to verify licence holders, review complaint activity, and
          use the same Supabase-backed demo accounts that feed the admin queue.
        </p>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="border-white/20 bg-white/10 p-6 text-white backdrop-blur-sm transition-colors hover:bg-white/15">
                  <Icon className="mx-auto mb-4 h-12 w-12 text-bocra-golden-yellow" />
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-white/80">{feature.description}</p>
                </Card>
              </motion.div>
            );
          })}
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
