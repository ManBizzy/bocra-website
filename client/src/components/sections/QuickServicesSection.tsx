import { motion } from 'framer-motion';
import { QUICK_SERVICES } from '@/const';
import * as Icons from 'lucide-react';
import { Card } from '@/components/ui/card';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function QuickServicesSection() {
  return (
    <section className="w-full bg-white py-6 md:py-8 border-b border-bocra-border">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="container"
      >
        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-2 md:pb-0 md:grid md:grid-cols-6">
          {QUICK_SERVICES.map((service) => {
            const IconComponent = Icons[service.icon as keyof typeof Icons] as React.ComponentType<{ className: string }>;
            
            return (
              <motion.a
                key={service.id}
                href={service.href}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="flex-shrink-0 md:flex-shrink"
              >
                <Card className="p-4 md:p-6 text-center hover:shadow-lg hover:border-bocra-teal transition-all duration-200 cursor-pointer h-full flex flex-col items-center justify-center min-w-[140px] md:min-w-0">
                  {IconComponent && (
                    <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-bocra-teal mb-3" />
                  )}
                  <p className="text-xs md:text-sm font-medium text-bocra-text-primary text-center leading-tight">
                    {service.label}
                  </p>
                </Card>
              </motion.a>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
