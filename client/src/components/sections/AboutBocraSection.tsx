import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { REGULATORY_AREAS } from '@/const';
import { Card } from '@/components/ui/card';

export default function AboutBocraSection() {
  return (
    <section className="w-full bg-bocra-light-grey py-14 md:py-20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2"
          >
            <div className="mb-4">
              <span className="text-xs font-semibold text-bocra-teal uppercase tracking-widest">
                OUR MANDATE
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-bocra-text-primary mb-6">
              Regulating Botswana's Communications for the Public Good
            </h2>
            <div className="space-y-4 text-bocra-text-secondary leading-relaxed">
              <p>
                The Botswana Communications Regulatory Authority (BOCRA) is a statutory body established to regulate the telecommunications, broadcasting, postal, and internet sectors in Botswana. Our mission is to ensure that all citizens have access to reliable, affordable, and secure communications services.
              </p>
              <p>
                We work to create a competitive market environment that encourages innovation, protects consumer rights, and promotes the development of Botswana's digital infrastructure. By setting standards, managing spectrum, and resolving disputes, we ensure that the communications industry serves the public interest.
              </p>
              <p>
                Our regulatory framework is designed to balance the interests of service providers, consumers, and the broader economy, creating an environment where communications services are accessible to all Batswana.
              </p>
            </div>
            <a
              href="/about"
              className="inline-flex items-center gap-2 text-bocra-teal font-semibold mt-6 hover:gap-3 transition-all"
            >
              Learn More About BOCRA
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              {REGULATORY_AREAS.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="p-4 border-l-4 border-bocra-teal bg-white hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-bocra-text-primary mb-2">{area.title}</h3>
                    <p className="text-sm text-bocra-text-secondary">{area.description}</p>
                  </Card>
                </motion.div>
              ))}
              <a
                href="/services"
                className="inline-flex items-center gap-2 text-bocra-teal font-semibold mt-4 hover:gap-3 transition-all"
              >
                View All Services
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
