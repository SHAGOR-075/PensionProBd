import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Shield, 
  Users, 
  FileText, 
  Award, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  Globe,
  Sun,
  Moon
} from 'lucide-react';

const Homepage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(newLang);
  };

  const features = [
    {
      icon: Shield,
      title: t('secure_reliable'),
      description: t('secure_reliable_desc'),
      color: 'text-bd-green-600 bg-bd-green-100 dark:bg-bd-green-900/20'
    },
    {
      icon: Clock,
      title: t('fast_processing'),
      description: t('fast_processing_desc'),
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
    },
    {
      icon: Users,
      title: t('expert_support'),
      description: t('expert_support_desc'),
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
    },
    {
      icon: FileText,
      title: t('digital_documents'),
      description: t('digital_documents_desc'),
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
    }
  ];

  const stats = [
    { number: '50,000+', label: t('pension_holders'), icon: Users },
    { number: '95%', label: t('success_rate'), icon: TrendingUp },
    { number: '24/7', label: t('support_available'), icon: Clock },
    { number: '100%', label: t('secure_platform'), icon: Shield }
  ];

  const testimonials = [
    {
      name: 'আব্দুল করিম',
      designation: t('retired_officer'),
      message: t('testimonial_1'),
      rating: 5
    },
    {
      name: 'ফাতেমা খাতুন',
      designation: t('former_teacher'),
      message: t('testimonial_2'),
      rating: 5
    },
    {
      name: 'মোহাম্মদ রহিম',
      designation: t('ex_bank_employee'),
      message: t('testimonial_3'),
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-lg border-b-4 border-bd-green-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-bd-green-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">BD</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-bd-green-700 dark:text-bd-green-400">
                  {t('app_title')}
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {t('app_subtitle')}
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-bd-green-600 transition-colors">
                {t('features')}
              </a>
              <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-bd-green-600 transition-colors">
                {t('about')}
              </a>
              <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-bd-green-600 transition-colors">
                {t('contact')}
              </a>
              
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={t('change_language')}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {i18n.language === 'en' ? '🇺🇸 EN' : '🇧🇩 বাং'}
                </span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={t('toggle_theme')}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/pension/login')}
                  className="px-4 py-2 text-bd-green-600 border border-bd-green-600 rounded-lg hover:bg-bd-green-50 dark:hover:bg-bd-green-900/20 transition-colors"
                >
                  {t('login')}
                </button>
                <button
                  onClick={() => navigate('/pension/register')}
                  className="px-4 py-2 bg-bd-green-600 text-white rounded-lg hover:bg-bd-green-700 transition-colors"
                >
                  {t('register')}
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Globe className="w-5 h-5" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-bd-green-50 to-bd-green-100 dark:from-gray-800 dark:to-gray-900 py-20 transition-colors duration-300">
        <div className="absolute inset-0 bd-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  {t('hero_title_1')}
                  <span className="text-bd-green-600"> {t('hero_title_2')}</span>
                  <br />
                  {t('hero_title_3')}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('hero_description')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/pension/register')}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-bd-green-600 text-white rounded-lg hover:bg-bd-green-700 transition-colors shadow-lg"
                >
                  <span className="font-semibold">{t('start_application')}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/pension/login')}
                  className="flex items-center justify-center space-x-2 px-8 py-4 border-2 border-bd-green-600 text-bd-green-600 rounded-lg hover:bg-bd-green-50 dark:hover:bg-bd-green-900/20 transition-colors"
                >
                  <span className="font-semibold">{t('login_dashboard')}</span>
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-bd-green-600">50K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('pension_holders')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bd-green-600">95%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('success_rate')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bd-green-600">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('support')}</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-bd-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{t('quick_application')}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('submit_minutes')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{t('realtime_tracking')}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('monitor_progress')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{t('secure_process')}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('bank_level_security')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {t('why_choose_title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('why_choose_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-bd-green-600 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center text-white">
                  <div className="flex justify-center mb-4">
                    <Icon className="w-12 h-12" />
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-bd-green-100">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {t('testimonials_title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('testimonials_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  "{testimonial.message}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.designation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('contact_title')}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  {t('contact_desc')}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-bd-green-600 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{t('phone_support')}</div>
                    <div className="text-gray-600 dark:text-gray-400">+880-2-9123456</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-bd-green-600 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{t('email_support')}</div>
                    <div className="text-gray-600 dark:text-gray-400">support@pensionprobd.gov.bd</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-bd-green-600 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{t('office_address')}</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {t('office_location')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t('send_message')}
              </h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('full_name')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                    placeholder={t('enter_full_name')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('email_address')}
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                    placeholder={t('enter_email')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('message')}
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                    placeholder={t('enter_message')}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-bd-green-600 text-white rounded-lg hover:bg-bd-green-700 transition-colors font-semibold"
                >
                  {t('send_message')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-bd-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">BD</span>
                </div>
                <div>
                  <div className="font-bold text-lg">{t('app_title')}</div>
                  <div className="text-sm text-gray-400">{t('digital_bangladesh')}</div>
                </div>
              </div>
              <p className="text-gray-400">
                {t('footer_desc')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('quick_links')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t('home')}</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">{t('features')}</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">{t('about')}</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">{t('contact')}</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('services')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t('pension_application')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('status_tracking')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('document_management')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('support')}</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('contact_info')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>+880-2-9123456</li>
                <li>support@pensionprobd.gov.bd</li>
                <li>{t('bangladesh_secretariat')}</li>
                <li>{t('dhaka_bangladesh')}</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {t('app_title')}. {t('all_rights_reserved')} {t('govt_title')}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;