import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  SparklesIcon,
  HandRaisedIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../contexts/ThemeContext";
import hero from "../img/hero.jpg";
import mission from "../img/avatar.jpg";
// --- Refined Components for a Minimal & Modern Look ---

const Section = ({ children, className = "" }) => (
  <section className={`py-24 sm:py-32 ${className}`}>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      {children}
    </div>
  </section>
);

const SectionTitle = ({ children, subtitle }) => {
  const { theme } = useTheme();
  return (
    <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
      <h2
        className={`text-3xl md:text-4xl font-bold tracking-tight ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {children}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-lg leading-relaxed ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

const Feature = ({ icon, title, children }) => {
  const { theme } = useTheme();
  return (
    <div className="text-center">
      <div
        className={`flex items-center justify-center h-16 w-16 rounded-full mx-auto mb-6 border ${
          theme === "dark"
            ? "bg-red-900 text-red-300 border-red-800"
            : "bg-red-50 text-red-600 border-red-100"
        }`}
      >
        {icon}
      </div>
      <h3
        className={`text-xl font-semibold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {title}
      </h3>
      <p
        className={`mt-2 ${
          theme === "dark" ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {children}
      </p>
    </div>
  );
};

const FAQItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  return (
    <div
      className={`border-b ${
        theme === "dark" ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center py-5 text-left text-lg font-medium ${
          theme === "dark" ? "text-gray-200" : "text-gray-800"
        } hover:text-red-600 transition-colors`}
      >
        <span>{q}</span>
        <ChevronDownIcon
          className={`h-5 w-5 ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          } transition-transform duration-300 ${
            isOpen ? "transform rotate-180 text-red-600" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p
            className={`pb-5 pt-1 leading-relaxed ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({ text, author, location, avatar }) => {
  const { theme } = useTheme();
  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      } p-8 rounded-xl shadow-sm border ${
        theme === "dark" ? "border-gray-700" : "border-gray-100"
      }`}
    >
      <img
        src={avatar}
        alt={author}
        className={`w-16 h-16 rounded-full mx-auto mb-5 border-2 ${
          theme === "dark" ? "border-gray-700" : "border-white"
        } ring-2 ${
          theme === "dark" ? "ring-red-900" : "ring-red-100"
        } object-cover`}
      />
      <p
        className={`italic leading-relaxed text-lg ${
          theme === "dark" ? "text-gray-200" : "text-gray-700"
        }`}
      >
        "{text}"
      </p>
      <div className="mt-5">
        <p
          className={`font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {author}
        </p>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {location}
        </p>
      </div>
    </div>
  );
};

const StatCard = ({ number, label, icon }) => {
  const { theme } = useTheme();
  return (
    <div
      className={`p-6 rounded-xl shadow-sm text-center ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div
        className={`flex items-center justify-center h-16 w-16 rounded-full mx-auto mb-4 ${
          theme === "dark"
            ? "bg-blue-900 text-blue-300"
            : "bg-blue-50 text-blue-600"
        }`}
      >
        {icon}
      </div>
      <p
        className={`text-4xl font-bold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {number}
      </p>
      <p
        className={`mt-2 text-lg ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {label}
      </p>
    </div>
  );
};

// --- Main HomePage Component ---

const HomePage = () => {
  const { theme } = useTheme();

  const faqs = [
    {
      q: "How do I register as a donor?",
      a: "Simply click the 'Become a Donor' button and fill out our secure registration form. It only takes a few minutes to become a potential lifesaver!",
    },
    {
      q: "Is my personal information safe?",
      a: "Absolutely. We prioritize your privacy with end-to-end encryption and strict data protection policies. Your information is only shared with verified recipients upon your consent.",
    },
    {
      q: "How often can I donate blood?",
      a: "Healthy individuals can typically donate whole blood every 90 days. This ensures your own well-being while allowing you to contribute regularly.",
    },
    {
      q: "What happens after I request blood?",
      a: "Once you submit a request, our system matches you with available donors in your area. Donors are notified and can choose to accept your request, initiating direct communication.",
    },
    {
      q: "Can I donate if I have a medical condition?",
      a: "Eligibility varies based on the condition. We recommend consulting with a healthcare professional or checking our detailed eligibility guidelines before attempting to donate.",
    },
  ];

  return (
    <div
      className={`min-h-screen font-sans ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      {/* Hero Section */}
      <div className="relative text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={hero}
            alt="A blood drop"
            className="w-full h-[700px] object-cover rounded-md shadow-lg"
          />

          <div className="absolute inset-0 bg-red-900/70 dark:bg-red-950/80 backdrop-brightness-75"></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md">
            The Gift of Life, Simplified.
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-red-100 dark:text-red-200 drop-shadow-sm">
            We connect compassionate donors with patients in urgent need across
            Bangladesh, creating a powerful network of hope and support.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-bold rounded-full text-white bg-red-600 hover:bg-red-500 transition transform hover:scale-105 shadow-lg"
            >
              Become a Donor <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/donors"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-white/50 dark:border-white/20 text-base font-bold rounded-full text-white bg-white/10 dark:bg-white/5 backdrop-blur-sm hover:bg-white/20 transition"
            >
              Find a Donor
            </Link>
          </div>
        </div>
      </div>

      {/* Impact Statistics Section */}
      <Section className={`${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <SectionTitle subtitle="See the real-world impact of our community.">
          Our Impact in Numbers
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <StatCard
            number="15,000+"
            label="Lives Touched"
            icon={<HeartIcon className="h-8 w-8" />}
          />
          <StatCard
            number="5,000+"
            label="Registered Donors"
            icon={<UserGroupIcon className="h-8 w-8" />}
          />
          <StatCard
            number="98%"
            label="Requests Fulfilled"
            icon={<CheckBadgeIcon className="h-8 w-8" />}
          />
        </div>
      </Section>

      {/* How It Works Section */}
      <Section className={`${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <SectionTitle subtitle="We've streamlined the process to make it as easy as possible.">
          A Simple Path to Saving a Life
        </SectionTitle>
        <div className="grid md:grid-cols-3 gap-x-8 gap-y-12 max-w-6xl mx-auto">
          <Feature
            icon={<UserGroupIcon className="h-8 w-8" />}
            title="1. Register"
          >
            Create a secure profile with your blood type and availability.
          </Feature>
          <Feature
            icon={<HeartIcon className="h-8 w-8" />}
            title="2. Search or Request"
          >
            Find available donors or post an urgent request to the community.
          </Feature>
          <Feature
            icon={<ShieldCheckIcon className="h-8 w-8" />}
            title="3. Connect & Donate"
          >
            Our platform facilitates safe communication to coordinate the
            donation.
          </Feature>
        </div>
      </Section>

      {/* Our Mission Section */}
      <Section className={`${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="prose prose-lg max-w-none">
            <h2
              className={`text-3xl font-bold tracking-tight !mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Our Mission: A Healthier Bangladesh
            </h2>
            <p
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              In a country of millions, no one should suffer due to a shortage
              of blood. Our mission is to bridge the gap between donors and
              recipients through a seamless, technology-driven platform. We are
              committed to building a proactive community of volunteers
              dedicated to saving lives, one donation at a time.
            </p>
          </div>
          <div className="p-4">
            <img
              src={mission}
              alt="A diverse group of smiling people"
              className="rounded-2xl shadow-lg opacity-70"
            />
          </div>
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section className={`${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <SectionTitle subtitle="Real stories from our community members.">
          Voices of Hope
        </SectionTitle>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <TestimonialCard
            text="This platform connected me with a donor in minutes. I am forever grateful for this life-saving service."
            author="Anika Rahman"
            location="Dhaka"
            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
          />
          <TestimonialCard
            text="A seamless experience from start to finish. Proud to be a registered donor and help save lives in my city."
            author="Farhan Ahmed"
            location="Chittagong"
            avatar="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop"
          />
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className={`${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <SectionTitle subtitle="Have questions? We've got answers.">
          Frequently Asked Questions
        </SectionTitle>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, i) => (
            <FAQItem key={i} {...faq} />
          ))}
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section className="bg-red-700 text-center">
        <SparklesIcon className="h-12 w-12 text-red-200 mx-auto" />
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
          Ready to Be a Hero?
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-red-100 dark:text-red-200">
          Your decision to donate can bring hope and healing to someone in their
          most vulnerable moment. Become a part of our lifesaving mission today.
        </p>
        <div className="mt-8">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-bold rounded-full text-red-700 bg-white hover:bg-red-50 transition transform hover:scale-105 shadow-lg"
          >
            Register as a Donor
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default HomePage;
