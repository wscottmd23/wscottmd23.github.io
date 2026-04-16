/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Printer, 
  GraduationCap, 
  Stethoscope, 
  Award, 
  BookOpen, 
  Users, 
  Briefcase, 
  ChevronDown, 
  ChevronUp,
  ArrowUpDown,
  ExternalLink,
  Heart,
  Sun,
  Moon,
  Download,
  Menu,
  X,
  Linkedin,
  Globe,
  Twitter,
  Instagram,
  Facebook,
  Link
} from 'lucide-react';

// Data imports
import personal from './data/personal.json';
import educationData from './data/education.json';
import trainingData from './data/training.json';
import licenses from './data/licenses.json';
import certifications from './data/certifications.json';
import researchData from './data/research.json';
import qiData from './data/qi.json';
import presentations from './data/presentations.json';
import publications from './data/publications.json';
import leadershipData from './data/leadership.json';
import teachingData from './data/teaching.json';
import honors from './data/honors.json';
import interests from './data/interests.json';
import memberships from './data/memberships.json';
import grants from './data/grants.json';
import profilePic from './assets/images/profile.jpg';

type SortOrder = 'asc' | 'desc';

const renderHighlightedText = (text: string) => {
  let highlighted = text;
  const nameVariations = [
    'Scott WJ',
    'Scott, W.',
    'Scott, W,',
    'Scott W.',
    'Scott W,',
    'Scott W '
  ];
  
  nameVariations.forEach(variation => {
    const escaped = variation.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'g');
    highlighted = highlighted.replace(regex, '<strong>$1</strong>');
  });
  
  return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
};

export default function App() {
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [activeSection, setActiveSection] = useState('education');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [200, 280], [0, 1]);
  const headerY = useTransform(scrollY, [200, 280], [15, 0]);
  const headerScale = useTransform(scrollY, [200, 280], [1.1, 1]);

  const activeSections = useMemo(() => {
    const available = [];
    if (educationData.length > 0) available.push({ id: 'education', label: 'Education', icon: GraduationCap });
    if (trainingData.length > 0) available.push({ id: 'training', label: 'Postgraduate Training', icon: Stethoscope });
    if (licenses.length > 0 || certifications.length > 0) available.push({ id: 'certifications', label: 'Licenses & Certifications', icon: Award });
    if (memberships.length > 0) available.push({ id: 'memberships', label: 'Memberships', icon: Users });
    if (researchData.length > 0) available.push({ id: 'research', label: 'Research Experience', icon: BookOpen });
    if (grants.length > 0) available.push({ id: 'grants', label: 'Research Grants', icon: Award });
    if (qiData.length > 0) available.push({ id: 'qi', label: 'Quality Improvement', icon: Heart });
    if (leadershipData.length > 0) available.push({ id: 'leadership', label: 'Leadership', icon: Users });
    if (teachingData.length > 0) available.push({ id: 'teaching', label: 'Teaching', icon: Briefcase });
    if (presentations.length > 0) available.push({ id: 'presentations', label: 'Presentations', icon: ExternalLink });
    if (honors.length > 0) available.push({ id: 'honors', label: 'Honors & Awards', icon: Award });
    if (interests.length > 0) available.push({ id: 'interests', label: 'Interests', icon: Heart });
    if (publications.length > 0) available.push({ id: 'publications', label: 'Bibliography', icon: BookOpen });
    return available;
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      if (activeSections.length === 0) return;

      // Check if we are at the bottom of the page
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      
      if (isBottom) {
        setActiveSection(activeSections[activeSections.length - 1].id);
        return;
      }

      let currentActive = activeSections[0].id;
      for (const section of activeSections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Offset to trigger slightly before the section hits the very top
          if (rect.top <= 150) {
            currentActive = section.id;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSections]);

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const sortItems = <T extends { sort_date?: string }>(items: T[]) => {
    return [...items].sort((a, b) => {
      const dateA = a.sort_date ? new Date(a.sort_date).getTime() : 0;
      const dateB = b.sort_date ? new Date(b.sort_date).getTime() : 0;
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  const sortedEducation = useMemo(() => sortItems(educationData), [sortOrder]);
  const sortedTraining = useMemo(() => sortItems(trainingData), [sortOrder]);
  const sortedResearch = useMemo(() => sortItems(researchData), [sortOrder]);
  const sortedLeadership = useMemo(() => sortItems(leadershipData), [sortOrder]);
  const sortedTeaching = useMemo(() => sortItems(teachingData), [sortOrder]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Adjust scroll position for mobile header offset
      const headerOffset = window.innerWidth < 1024 ? 80 : 0;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-border flex flex-col lg:grid lg:grid-cols-[320px_1fr] gap-[1px] transition-colors duration-300 cv-container">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-bg/95 backdrop-blur-md border-b border-border p-4 flex items-center justify-between transition-colors duration-300 print:hidden min-h-[65px]">
        <motion.div 
          className="flex flex-col truncate pr-4"
          style={{ 
            opacity: headerOpacity,
            y: headerY,
            scale: headerScale,
            transformOrigin: 'left center'
          }}
        >
          <h1 className="text-sm font-extrabold tracking-tight text-text-main leading-tight truncate">{personal.name}</h1>
          <p className="text-[10px] text-accent font-medium uppercase tracking-wider truncate">{personal.title}</p>
        </motion.div>
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center justify-center w-8 h-8 bg-card border border-border rounded-lg text-text-main hover:border-accent/50 transition-all shadow-sm"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          <button 
            onClick={toggleSort}
            className="flex items-center justify-center w-8 h-8 bg-card border border-border rounded-lg text-text-main hover:border-accent/50 transition-all shadow-sm"
            aria-label="Toggle Sort"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-center w-8 h-8 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all shadow-sm"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 z-40 bg-bg/95 backdrop-blur-md border-t border-border overflow-y-auto print:hidden"
          >
            <nav className="p-4 pb-20">
              <ul className="space-y-1">
                {activeSections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => {
                        scrollToSection(section.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                        activeSection === section.id 
                          ? 'bg-card text-accent border border-border shadow-sm' 
                          : 'text-text-dim hover:bg-card hover:text-text-main border border-transparent'
                      }`}
                    >
                      <section.icon className="w-4 h-4" />
                      {section.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="bg-bg p-8 lg:p-12 flex flex-col gap-10 lg:h-screen lg:sticky lg:top-0 overflow-y-auto transition-colors duration-300 print:hidden">
        <div className="flex flex-col">
          <div className="w-[160px] h-[160px] rounded-[32px] bg-gradient-to-br from-accent to-[#C084FC] mb-6 overflow-hidden shrink-0 p-[2px]">
             <img 
              src={profilePic} 
              alt={personal.name} 
              className="w-full h-full object-cover rounded-[30px]"
              // TWEAK POSITION HERE: 
              // The first value is horizontal (50% is center). 
              // The second value is vertical (0% is top, 50% is center, 100% is bottom). 
              // Lowering the second value (e.g., to 10% or 20%) moves the image down to show more of the top/forehead.
              style={{ objectPosition: '50% 15%' }}
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-[2.25rem] font-extrabold tracking-tight text-text-main leading-[1.1]">{personal.name}</h1>
          <p className="text-accent font-medium text-base mt-1">{personal.title}</p>
        </div>
        
        <div className="flex flex-col gap-3 text-[0.8125rem] text-text-dim">
          {personal.email && (
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 shrink-0" />
              <a href={`mailto:${personal.email}`} className="hover:text-accent transition-colors break-all">{personal.email}</a>
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 shrink-0" />
              <span>{personal.phone}</span>
            </div>
          )}

          <div className="pt-6 mt-2 border-t border-border flex flex-col gap-1.5">
            <p className="text-base font-bold text-text-main leading-tight">{personal.institution}</p>
            {personal.department && <p className="text-sm text-text-dim leading-snug">{personal.department}</p>}
          </div>

          <div className="pt-6 mt-2 border-t border-border flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.1em] text-accent font-bold mb-1">Office Contact</p>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(personal.office_address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="leading-relaxed hover:text-accent transition-colors"
              >
                {personal.office_address.split(', ').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 shrink-0" />
              <span>{personal.office_phone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Printer className="w-4 h-4 shrink-0" />
              <span>Fax: {personal.office_fax}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 shrink-0" />
              <a href={`mailto:${personal.office_email}`} className="hover:text-accent transition-colors break-all">{personal.office_email}</a>
            </div>
          </div>

          {/* Social & Professional Links */}
          {(personal.linkedin || personal.orcid || personal.researchgate || personal.nih || personal.twitter || personal.instagram || personal.facebook) && (
            <div className="pt-6 mt-2 border-t border-border flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.1em] text-accent font-bold mb-1">Links</p>
              {personal.linkedin && (
                <div className="flex items-center gap-2.5">
                  <Linkedin className="w-4 h-4 shrink-0" />
                  <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors truncate">LinkedIn</a>
                </div>
              )}
              {personal.orcid && (
                <div className="flex items-center gap-2.5">
                  <Link className="w-4 h-4 shrink-0" />
                  <a href={personal.orcid} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors truncate">ORCID</a>
                </div>
              )}
              {personal.researchgate && (
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 shrink-0" />
                  <a href={personal.researchgate} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors truncate">ResearchGate</a>
                </div>
              )}
              {personal.nih && (
                <div className="flex items-center gap-2.5">
                  <Link className="w-4 h-4 shrink-0" />
                  <a href={personal.nih} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors truncate">NIH</a>
                </div>
              )}
              {personal.twitter && (
                <div className="flex items-center gap-2.5">
                  <Twitter className="w-4 h-4 shrink-0" />
                  <a href={personal.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors truncate">Twitter</a>
                </div>
              )}
              {personal.instagram && (
                <div className="flex items-center gap-2.5">
                  <Instagram className="w-4 h-4 shrink-0" />
                  <a href={personal.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors truncate">Instagram</a>
                </div>
              )}
              {personal.facebook && (
                <div className="flex items-center gap-2.5">
                  <Facebook className="w-4 h-4 shrink-0" />
                  <a href={personal.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors truncate">Facebook</a>
                </div>
              )}
            </div>
          )}
        </div>

        <nav className="hidden lg:block">
          <ul className="space-y-1">
            {activeSections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                    activeSection === section.id 
                      ? 'bg-card text-accent border border-border shadow-sm' 
                      : 'text-text-dim hover:bg-card hover:text-text-main border border-transparent'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button 
          onClick={() => window.print()}
          className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </aside>

      {/* Main Content */}
      <main className="bg-bg p-8 md:p-12 lg:p-16 overflow-hidden transition-colors duration-300">
        <div className="max-w-4xl w-full flex flex-col gap-12">
          {/* Print Header (Only visible when printing) */}
          <div className="hidden print:block print-header">
            <h1>{personal.name}</h1>
            <div className="print-title">{personal.title}</div>
            <div className="print-contact">
              {(personal.phone || personal.email) && (
                <div>
                  <strong>Personal Contact:</strong><br />
                  {personal.phone && <>Phone: {personal.phone}<br /></>}
                  {personal.email && <>Email: {personal.email}</>}
                </div>
              )}
              <div className={personal.phone || personal.email ? "text-right" : "text-left"}>
                <strong>Office Contact:</strong><br />
                {personal.office_address.split(', ').map((line, i) => (
                  <span key={i}>{line}<br /></span>
                ))}
                Phone: {personal.office_phone} | Fax: {personal.office_fax}<br />
                Email: {personal.office_email}
              </div>
            </div>
          </div>

        <div className="flex justify-between items-center print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-accent">Curriculum Vitae</h2>
            <a 
              href="/assets/PAS_2026_additional_data.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#e49542] text-white rounded-xl text-sm font-bold hover:bg-[#e49542]/90 shadow-sm transition-colors w-fit"
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              PAS 2026 Additional Data
            </a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center justify-center w-9 h-9 bg-card border border-border rounded-xl text-text-main hover:border-accent/50 transition-all shadow-sm"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button 
              onClick={toggleSort}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-xs font-semibold text-text-main hover:border-accent/50 transition-all shadow-sm"
            >
              <ArrowUpDown className="w-3 h-3" />
              Sort: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </button>
          </div>
        </div>

        <div className="space-y-16">
          {/* Education */}
          {educationData.length > 0 && (
            <section id="education" className="scroll-mt-12">
              <h3 className="text-xs uppercase tracking-[0.1em] text-accent font-bold mb-8 flex items-center gap-3 after:content-[''] after:h-[1px] after:flex-grow after:bg-border">
                <GraduationCap className="w-4 h-4" />
                Education
              </h3>
              <div className="flex flex-col gap-8">
                {sortedEducation.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 print-entry"
                  >
                    <div className="font-mono text-[0.8125rem] text-text-dim print-entry-date">{item.years}</div>
                    <div className="print-entry-content">
                      <h4 className="font-semibold text-base text-text-main mb-1">{item.degree}</h4>
                      <p className="text-accent text-[0.8125rem]">{item.institution}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Training */}
          {sortedTraining.length > 0 && (
            <section id="training" className="scroll-mt-12">
              <h3 className="text-xs uppercase tracking-[0.1em] text-accent font-bold mb-8 flex items-center gap-3 after:content-[''] after:h-[1px] after:flex-grow after:bg-border">
                <Stethoscope className="w-4 h-4" />
                Postgraduate Training
              </h3>
              <div className="flex flex-col gap-8">
                {sortedTraining.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 print-entry"
                  >
                    <div className="font-mono text-[0.8125rem] text-text-dim print-entry-date">{item.years}</div>
                    <div className="print-entry-content">
                      <h4 className="font-semibold text-base text-text-main mb-1">{item.title}</h4>
                      <p className="text-accent text-[0.8125rem] mb-1.5">{item.institution}</p>
                      {item.details && (
                        <ul className="space-y-1">
                          {item.details.map((detail, dIdx) => (
                            <li key={dIdx} className="text-sm text-text-dim leading-relaxed flex gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Licenses & Certifications */}
          {(licenses.length > 0 || certifications.length > 0) && (
            <section id="certifications" className="scroll-mt-12">
              <h3 className="text-xs uppercase tracking-[0.1em] text-accent font-bold mb-8 flex items-center gap-3 after:content-[''] after:h-[1px] after:flex-grow after:bg-border">
                <Award className="w-4 h-4" />
                Licenses & Certifications
              </h3>
              
              <div className="space-y-10">
                {licenses.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-text-dim mb-4">Licensure and Registration</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="py-3 pr-4 font-semibold text-text-main">License Name</th>
                            <th className="py-3 px-4 font-semibold text-text-main">Issue Date</th>
                            <th className="py-3 pl-4 font-semibold text-text-main">Expiration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {licenses.map((license, idx) => (
                            <tr key={idx} className="hover:bg-card/50 transition-colors">
                              <td className="py-4 pr-4 font-medium text-text-main">{license.name}</td>
                              <td className="py-4 px-4 text-text-dim">{license.issue_date}</td>
                              <td className="py-4 pl-4 text-text-dim">{license.expiration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {certifications.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-text-dim mb-4">Certifications</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="py-3 pr-4 font-semibold text-text-main">Certification Name</th>
                            <th className="py-3 px-4 font-semibold text-text-main">Issuer</th>
                            <th className="py-3 px-4 font-semibold text-text-main">Issue Date</th>
                            <th className="py-3 pl-4 font-semibold text-text-main">Expiration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {certifications.map((cert, idx) => (
                            <tr key={idx} className="hover:bg-card/50 transition-colors">
                              <td className="py-4 pr-4 font-medium text-text-main">{cert.name}</td>
                              <td className="py-4 px-4 text-text-dim">{cert.issuer}</td>
                              <td className="py-4 px-4 text-text-dim">{cert.issue_date}</td>
                              <td className="py-4 pl-4 text-text-dim">{cert.expiration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Memberships */}
          {memberships.length > 0 && (
            <section id="memberships" className="scroll-mt-12">
              <h3 className="text-xs uppercase tracking-[0.1em] text-accent font-bold mb-8 flex items-center gap-3 after:content-[''] after:h-[1px] after:flex-grow after:bg-border">
                <Users className="w-4 h-4" />
                Memberships
              </h3>
              <div className="flex flex-col gap-8">
                {memberships.map((membership, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 print-entry"
                  >
                    <div className="font-mono text-[0.8125rem] text-text-dim print-entry-date">{membership.dates}</div>
                    <div className="print-entry-content">
                      <h4 className="font-semibold text-base text-text-main mb-1">{membership.organization}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Research */}
          {sortedResearch.length > 0 && (
            <section id="research" className="scroll-mt-12">
              <h3 className="text-xs uppercase tracking-[0.1em] text-accent font-bold mb-8 flex items-center gap-3 after:content-[''] after:h-[1px] after:flex-grow after:bg-border">
                <BookOpen className="w-4 h-4" />
                Research Experience
              </h3>
              <div className="flex flex-col gap-8">
                {sortedResearch.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 print-entry"
                  >
                    <div className="font-mono text-[0.8125rem] text-text-dim print-entry-date">{item.dates}</div>
                    <div className="print-entry-content">
                      <h4 className="font-semibold text-base text-text-main mb-1">{item.role}</h4>
                      <p className="text-text-main font-medium text-[0.8125rem] mb-1">{item.group}</p>
                      <p className="text-accent text-[0.8125rem] mb-2">{item.institution}</p>
                      {item.bullets && (
                        <ul className="space-y-1">
                          {item.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="text-sm text-text-dim leading-relaxed flex gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Grants */}
          {grants.length > 0 && (
            <section id="grants" className="scroll-mt-12">
              <h3 className="text-xs uppercase tracking-[0.1em] text-accent font-bold mb-8 flex items-center gap-3 after:content-[''] after:h-[1px] after:flex-grow after:bg-border">
                <Award className="w-4 h-4" />
                Research Grants
              </h3>
              <div className="space-y-6">
                {grants.map((grant, idx) => (
                  <div key={idx} className="bg-card border border-border p-6 rounded-2xl shadow-sm print:p-0 print:border-none print:shadow-none print:bg-transparent print-entry">
                    <div className="hidden print:block print-entry-date">{grant.dates}</div>
                    <div className="print-entry-content">
                      <div className="flex justify-between items-start mb-4 print:mb-1">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-accent font-bold block mb-1 print:hidden">{grant.status} | {grant.type}</span>
                          <h4 className="text-base font-bold text-text-main print:text-[11pt]">{grant.title}</h4>
                          <div className="hidden print:block text-[10pt] text-black mt-1">
                            {grant.source} | {grant.type} | Role: {grant.role}
                          </div>
                          <div className="hidden print:block text-[10pt] text-gray-600">
                            Direct Funds: {grant.funds}
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-bg border border-border text-text-main text-xs font-bold rounded-lg print:hidden">{grant.grant_type}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs print:hidden">
                        <div>
                          <p className="text-text-dim mb-1 uppercase tracking-wider font-semibold">Source</p>
                          <p className="font-medium text-text-main">{grant.source}</p>
                        </div>
                        <div>
                          <p className="text-text-dim mb-1 uppercase tracking-wider font-semibold">Role</p>
                          <p className="font-medium text-text-main">{grant.role}</p>
                        </div>
                        <div>
                          <p className="text-text-dim mb-1 uppercase tracking-wider font-semibold">Dates</p>
                          <p className="font-medium text-text-main">{grant.dates}</p>
                        </div>
                        <div>
                          <p className="text-text-dim mb-1 uppercase tracking-wider font-semibold">Funds</p>
                          <p className="font-medium text-text-main">{grant.funds}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* QI */}
          {qiData.length > 0 && (
            <section id="qi" className="scroll-mt-12">
              <h3 className="text-xs uppercase tracking-[0.1em] text-accent font-bold mb-8 flex items-center gap-3 after:content-[''] after:h-[1px] after:flex-grow after:bg-border">
                <Heart className="w-4 h-4" />
                Quality Improvement
              </h3>
              <div className="flex flex-col gap-8">
                {qiData.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 print-entry"
                  >
                    <div className="font-mono text-[0.8125rem] text-text-dim print-entry-date">{item.dates}</div>
                    <div className="print-entry-content">
                      <h4 className="font-semibold text-base text-text-main mb-1">{item.role}</h4>
                      <p className="text-text-main font-medium text-[0.8125rem] mb-1">{item.project}</p>
                      <p className="text-accent text-[0.8125rem] mb-2">{item.institution}</p>
                      {item.bullets && (
                        <ul className="space-y-1">
                          {item.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="text-sm text-text-dim leading-relaxed flex gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Leadership */}
          {sortedLeadership.length > 0 && (
            <section id="leadership" className="scroll-mt-12">
              <h3 className="text-xs uppercase tracking-[0.1em] text-accent font-bold mb-8 flex items-center gap-3 after:content-[''] after:h-[1px] after:flex-grow after:bg-border">
                <Users className="w-4 h-4" />
                Leadership
              </h3>
              <div className="flex flex-col gap-8">
                {sortedLeadership.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 print-entry"
                  >
                    <div className="font-mono text-[0.8125rem] text-text-dim print-entry-date">{item.years}</div>
                    <div className="print-entry-content">
                      <h4 className="font-semibold text-base text-text-main mb-1">{item.role}</h4>
                      <p className="text-accent text-[0.8125rem] mb-1.5">{item.location}</p>
                      {item.bullets && (
                        <ul className="space-y-1">
                          {item.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="text-sm text-text-dim leading-relaxed flex gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Teaching */}
          {sortedTeaching.length > 0 && (
            <section id="teaching" className="scroll-mt-12">
              <h3 className="text-xs uppercase tracking-[0.1em] text-accent font-bold mb-8 flex items-center gap-3 after:content-[''] after:h-[1px] after:flex-grow after:bg-border">
                <Briefcase className="w-4 h-4" />
                Teaching Positions
              </h3>
              <div className="flex flex-col gap-8">
                {sortedTeaching.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 print-entry"
                  >
                    <div className="font-mono text-[0.8125rem] text-text-dim print-entry-date">{item.dates}</div>
                    <div className="print-entry-content">
                      <h4 className="font-semibold text-base text-text-main mb-1">{item.role}</h4>
                      <p className="text-accent text-[0.8125rem] mb-1.5">{item.institution}</p>
                      {item.bullets && (
                        <ul className="space-y-1">
                          {item.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="text-sm text-text-dim leading-relaxed flex gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Presentations */}
          {presentations.length > 0 && (
            <section id="presentations" className="scroll-mt-12">
              <h3 className="text-xs uppercase tracking-[0.1em] text-accent font-bold mb-8 flex items-center gap-3 after:content-[''] after:h-[1px] after:flex-grow after:bg-border">
                <ExternalLink className="w-4 h-4" />
                Peer-Reviewed Presentations
              </h3>
              <div className="space-y-10">
                {presentations.map((group, gIdx) => (
                  <div key={gIdx}>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-text-main mb-4">{group.category}</h4>
                    <ol className="space-y-2">
                      {group.items.map((item, iIdx) => (
                        <li key={iIdx} className="text-sm text-text-dim leading-relaxed pl-4 border-l border-border">
                          {renderHighlightedText(item)}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Honors */}
          {honors.length > 0 && (
            <section id="honors" className="scroll-mt-12">
              <h3 className="text-xs uppercase tracking-[0.1em] text-accent font-bold mb-8 flex items-center gap-3 after:content-[''] after:h-[1px] after:flex-grow after:bg-border">
                <Award className="w-4 h-4" />
                Honors & Awards
              </h3>
              <div className="space-y-6">
                {honors.map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-start print-entry">
                    <div className="font-mono text-[0.8125rem] text-text-dim w-[100px] shrink-0 print-entry-date">{item.year}</div>
                    <div className="text-sm font-medium text-text-main print-entry-content">{item.award}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <section id="interests" className="scroll-mt-12">
              <h3 className="text-xs uppercase tracking-[0.1em] text-accent font-bold mb-8 flex items-center gap-3 after:content-[''] after:h-[1px] after:flex-grow after:bg-border">
                <Heart className="w-4 h-4" />
                Personal Interests
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {interests.map((interest, idx) => (
                  <span key={idx} className="bg-card px-3 py-1.5 rounded-lg text-xs border border-border text-text-main text-center">
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Bibliography */}
          {publications.length > 0 && (
            <section id="publications" className="scroll-mt-12">
              <h3 className="text-xs uppercase tracking-[0.1em] text-accent font-bold mb-8 flex items-center gap-3 after:content-[''] after:h-[1px] after:flex-grow after:bg-border">
                <BookOpen className="w-4 h-4" />
                Bibliography
              </h3>
              <div className="space-y-6">
                <ol className="space-y-3">
                  {publications.map((publication, idx) => (
                    <li key={idx} className="text-sm text-text-dim leading-relaxed pl-4 border-l border-border">
                      {renderHighlightedText(publication)}
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}
        </div>

        <footer className="mt-8 pt-8 border-t border-border flex justify-between items-center print:hidden">
            <p className="text-text-dim text-[0.8125rem]">© {new Date().getFullYear()} {personal.name}. All rights reserved.</p>
            <div className="flex items-center gap-2 text-[0.75rem] text-[#10B981]">
              <span className="w-2 h-2 bg-[#10B981] rounded-full"></span>
              AVAILABLE FOR PROJECTS
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
