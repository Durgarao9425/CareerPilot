import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SparklesIcon, DocumentTextIcon, ChartBarIcon, EnvelopeIcon,
  ArrowRightIcon, CheckIcon, StarIcon,
} from '@heroicons/react/24/outline';

const features = [
  { icon: SparklesIcon, title: 'AI-Powered Writing', desc: 'Generate professional summaries, descriptions, and achievements instantly with Gemini AI.', color: 'from-violet-500 to-purple-600' },
  { icon: ChartBarIcon, title: 'ATS Score Analyzer', desc: 'Know exactly how your resume performs against any job description with keyword matching.', color: 'from-emerald-500 to-teal-600' },
  { icon: DocumentTextIcon, title: '4 Premium Templates', desc: 'Modern, Professional, Minimal, and Creative templates with live preview.', color: 'from-blue-500 to-indigo-600' },
  { icon: EnvelopeIcon, title: 'Cover Letter Generator', desc: 'Generate tailored cover letters for any job in seconds.', color: 'from-rose-500 to-pink-600' },
];

const testimonials = [
  { name: 'Sarah M.', role: 'Software Engineer', text: 'Got my dream job at Google after using CareerPilot AI. The ATS analyzer was a game changer!', stars: 5 },
  { name: 'James K.', role: 'Product Manager', text: 'The AI-generated summaries are incredibly professional. Saved me hours of writing.', stars: 5 },
  { name: 'Priya S.', role: 'Data Scientist', text: 'Beautiful templates and the PDF export is flawless. Highly recommend!', stars: 5 },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-surface-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-surface-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg">
              CareerPilot <span className="gradient-text">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-surface-400 hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="btn-primary btn-sm">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0 bg-mesh opacity-40" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm mb-8">
              <SparklesIcon className="w-4 h-4" />
              Powered by Gemini AI
            </div>

            <h1 className="text-5xl sm:text-7xl font-black font-display leading-tight mb-6">
              Build Resumes That{' '}
              <span className="gradient-text">Get You Hired</span>
            </h1>
            <p className="text-xl text-surface-400 max-w-2xl mx-auto mb-10 text-balance">
              AI-powered resume builder with ATS optimization, beautiful templates, cover letter generation, and interview prep — all in one platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary btn-xl group">
                Start Building for Free
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="btn-outline btn-xl border-surface-700 text-surface-300 hover:border-primary-500 hover:text-white">
                Sign In
              </Link>
            </div>

            <p className="text-sm text-surface-600 mt-6">No credit card required · Free forever plan</p>
          </motion.div>

          {/* Hero Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-16 relative"
          >
            <div className="relative mx-auto max-w-4xl">
              <div className="glass-dark rounded-3xl p-4 shadow-2xl border border-white/5">
                <div className="bg-surface-900 rounded-2xl overflow-hidden">
                  {/* Fake browser bar */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-800">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-danger-500" />
                      <div className="w-3 h-3 rounded-full bg-warning-500" />
                      <div className="w-3 h-3 rounded-full bg-success-500" />
                    </div>
                    <div className="flex-1 bg-surface-800 rounded-lg px-3 py-1 text-xs text-surface-500 text-center">
                      careerpilot.ai/builder
                    </div>
                  </div>
                  {/* Fake dashboard */}
                  <div className="p-6 flex gap-4 min-h-64">
                    {/* Sidebar preview */}
                    <div className="w-40 bg-surface-950 rounded-xl p-3 space-y-2">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-lg bg-primary-600" />
                        <div className="h-3 bg-surface-700 rounded flex-1" />
                      </div>
                      {[1,2,3,4,5].map((i) => (
                        <div key={i} className="flex items-center gap-2 px-2 py-2 rounded-lg">
                          <div className="w-3 h-3 bg-surface-700 rounded" />
                          <div className="h-2.5 bg-surface-700 rounded flex-1" style={{ width: `${[70, 85, 65, 75, 60][i-1]}%` }} />
                        </div>
                      ))}
                    </div>
                    {/* Content preview */}
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-3">
                        {[
                          { v: '12', l: 'Resumes', c: 'from-primary-500 to-primary-600' },
                          { v: '8', l: 'ATS Reports', c: 'from-emerald-500 to-teal-600' },
                          { v: '5', l: 'Cover Letters', c: 'from-rose-500 to-pink-600' },
                        ].map(({ v, l, c }) => (
                          <div key={l} className="flex-1 bg-surface-900 border border-surface-800 rounded-xl p-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c} mb-2`} />
                            <p className="text-white font-bold">{v}</p>
                            <p className="text-xs text-surface-500">{l}</p>
                          </div>
                        ))}
                      </div>
                      {/* Resume grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {[1,2,3,4].map((i) => (
                          <div key={i} className="bg-surface-900 border border-surface-800 rounded-xl p-3">
                            <div className="h-16 bg-gradient-to-br from-primary-900/40 to-surface-800 rounded-lg mb-2" />
                            <div className="h-2.5 bg-surface-700 rounded w-3/4 mb-1" />
                            <div className="h-2 bg-surface-800 rounded w-1/2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-primary-500/20 blur-3xl rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display mb-4">Everything You Need to Land Your Dream Job</h2>
            <p className="text-surface-400 max-w-xl mx-auto">A complete career toolkit powered by cutting-edge AI technology</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-dark rounded-2xl p-6 border border-surface-800/60 hover:border-primary-500/40 hover:shadow-glow transition-all duration-300 cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold font-display mb-2">{f.title}</h3>
                <p className="text-surface-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-surface-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-3">Loved by Job Seekers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-dark rounded-2xl p-6 border border-surface-800/60 hover:border-primary-500/40 hover:shadow-glow transition-all duration-300 cursor-default"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <StarIcon key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-surface-300 text-sm mb-4 leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-surface-500">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-dark rounded-3xl p-12 border border-primary-500/20 relative overflow-hidden shadow-glow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-purple-600/10" />
            <div className="relative">
              <h2 className="text-4xl font-black font-display mb-4">Ready to Get Hired?</h2>
              <p className="text-surface-400 mb-8">Join thousands of professionals who landed their dream jobs with CareerPilot AI</p>
              <Link to="/register" className="btn-primary btn-xl inline-flex group">
                Start for Free Today
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center justify-center gap-6 mt-8 text-xs text-surface-600">
                {['No credit card', 'Free plan available', 'Cancel anytime'].map((item) => (
                  <span key={item} className="flex items-center gap-1">
                    <CheckIcon className="w-3 h-3 text-success-500" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-800 py-8 px-6 text-center text-surface-600 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
            <SparklesIcon className="w-3 h-3 text-white" />
          </div>
          <span className="font-display font-bold text-surface-400">CareerPilot AI</span>
        </div>
        <p>© {new Date().getFullYear()} CareerPilot AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
