import { motion } from 'framer-motion';
import { Shield, Clock, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getLoginUrl } from '@/const';

const features = [
  {
    icon: Shield,
    title: 'Secure Portal',
    description: 'Your data is encrypted and protected. Login with email verification.',
  },
  {
    icon: Clock,
    title: 'Track in Real Time',
    description: 'Submit a complaint or licence application and track its status live.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Works perfectly on any device, anywhere in Botswana.',
  },
];

export default function PortalHighlightSection() {
  return (
    <section className="w-full bg-gradient-to-r from-bocra-teal to-bocra-forest-green py-14 md:py-20 text-white">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need, Online</h2>
        <p className="text-lg text-white/90 mb-12 max-w-2xl mx-auto">
          No more queues. File complaints, apply for licences, search domain registrations, and track your applications — all from your phone or computer.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-colors">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-bocra-golden-yellow" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/80">{feature.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Button
            className="bg-white text-bocra-teal hover:bg-white/90 font-semibold px-8 py-6 text-base"
            onClick={() => (window.location.href = getLoginUrl())}
          >
            Access Citizen Portal
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
