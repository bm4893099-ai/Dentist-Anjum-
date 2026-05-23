import { CheckCircle, Heart, Zap, Users, Clock, Shield } from 'lucide-react';

const whyUs = [
  { icon: Zap, text: 'Painless, modern treatment techniques' },
  { icon: Shield, text: 'Fully sterilized, ISO-certified clinic' },
  { icon: Users, text: 'Experienced team of certified dentists' },
  { icon: Clock, text: 'Flexible appointment scheduling' },
  { icon: Heart, text: 'Patient comfort is our top priority' },
  { icon: CheckCircle, text: 'Affordable pricing with EMI options' },
];

const team = [
  { name: 'Dr. Anjum Malik', role: 'Chief Dental Surgeon', speciality: 'Orthodontics & Cosmetics' },
  { name: 'Dr. Sara Ahmed', role: 'Dental Specialist', speciality: 'Root Canal & Implants' },
  { name: 'Dr. Usman Khan', role: 'Pediatric Dentist', speciality: 'Children & Family Care' },
];

export default function AboutSection() {
  return (
    <section id="about" className="section-padding bg-white overflow-hidden">
      <div className="container-max">
        {/* Top: About + Why Us */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left visual */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-teal-100">
              <div className="aspect-[4/3] bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-600 flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="w-24 h-24 rounded-3xl bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <svg viewBox="0 0 80 80" className="w-12 h-12 text-white" fill="currentColor">
                      <path d="M40 4C26 4,8 16,8 32C8 48,20 52,24 64C28 76,30.5 80,35 80C39.5 80,40 68,40 68C40 68,40.5 80,45 80C49.5 80,52 76,56 64C60 52,72 48,72 32C72 16,54 4,40 4Z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Anjum Dentist</h3>
                  <p className="text-teal-100 text-sm font-medium">Est. 2009 · Karachi, Pakistan</p>

                  <div className="grid grid-cols-3 gap-4 mt-8">
                    {[['5K+', 'Patients'], ['15+', 'Years'], ['98%', 'Satisfaction']].map(([val, lbl]) => (
                      <div key={lbl} className="bg-white/15 rounded-2xl py-3 px-2 border border-white/20">
                        <p className="text-white font-black text-xl">{val}</p>
                        <p className="text-teal-100 text-xs font-medium">{lbl}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-amber-400 rounded-2xl px-5 py-4 shadow-xl shadow-amber-200/50">
              <p className="text-amber-900 font-black text-2xl leading-none">15+</p>
              <p className="text-amber-800 text-xs font-bold mt-0.5">Years of Excellence</p>
            </div>

            {/* Decorative ring */}
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full border-4 border-teal-200 opacity-60" />
          </div>

          {/* Right content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-4 py-1.5 mb-5">
              <Heart className="w-3.5 h-3.5 text-teal-600 fill-teal-600" />
              <span className="text-teal-700 text-xs font-bold tracking-wide uppercase">About Our Clinic</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight">
              Trusted Dental Care{' '}
              <span className="text-gradient-teal">Since 2009</span>
            </h2>

            <p className="text-slate-500 text-lg leading-relaxed mb-4">
              At <span className="text-teal-600 font-semibold">Anjum Dentist</span>, we believe a healthy smile is the foundation of confidence.
              For over 15 years, we have been delivering world-class dental care in the heart of Karachi — combining the latest dental technology with warmth, precision, and genuine care.
            </p>

            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              Our clinic is built on one promise: <span className="text-slate-800 font-semibold">your comfort, our commitment</span>.
              From routine cleanings to complete smile transformations, every treatment is personalized to you.
            </p>

            {/* Why choose us */}
            <div className="grid sm:grid-cols-2 gap-3">
              {whyUs.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 transition-colors duration-200">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4.5 h-4.5 text-teal-600" size={18} />
                  </div>
                  <span className="text-slate-700 text-sm font-semibold">{text}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a href="#appointment" className="btn-primary">
                Meet Our Team <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-black text-slate-900 mb-3">
            Meet Our <span className="text-gradient-teal">Expert Team</span>
          </h3>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Our board-certified dental professionals bring decades of combined expertise and an unwavering dedication to your smile.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {team.map(({ name, role, speciality }) => (
            <div key={name} className="card-premium p-6 text-center group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 border-2 border-teal-200 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                <Users className="w-9 h-9 text-teal-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">{name}</h4>
              <p className="text-teal-600 text-sm font-semibold mt-1">{role}</p>
              <p className="text-slate-400 text-xs mt-1 font-medium">{speciality}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
