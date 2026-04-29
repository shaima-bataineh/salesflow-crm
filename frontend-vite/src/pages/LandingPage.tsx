import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { CheckCircle, Users, BarChart3, Shield } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
    const [showDemo, setShowDemo] = useState(false);


  const features = [
    {
      icon: Users,
      title: "Leads Management",
      description: "Organize and manage all your leads in one place.",
    },
    {
      icon: BarChart3,
      title: "Deals Tracking",
      description: "Track deals and monitor your sales pipeline easily.",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Control permissions across your team securely.",
    },
    {
      icon: CheckCircle,
      title: "Secure Authentication",
      description: "JWT-based authentication keeps your data protected.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 bg-clip-text text-transparent">
            SalesFlow
          </h1>

          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 
            text-white font-medium shadow-md hover:shadow-lg hover:scale-105 
            transition-all duration-300"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero */}
<section className="
relative
min-h-screen
flex items-center
justify-center
overflow-hidden
text-white
pt-24
">

  {/* Background Gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-teal-600 to-green-600"></div>

  {/* Glow Effects */}
  <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-400 opacity-20 rounded-full blur-3xl"></div>
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-300 opacity-20 rounded-full blur-3xl"></div>

  {/* Content */}
  <div className="relative max-w-4xl mx-auto px-6 text-center">

    <h2 className="text-5xl md:text-6xl font-bold leading-tight">
      Transform Your Sales Process with{" "}
      <span className="
        bg-gradient-to-r from-white via-emerald-100 to-white
        bg-clip-text text-transparent
      ">
        SalesFlow
      </span>
    </h2>

    <p className="mt-6 text-lg text-emerald-100 max-w-2xl mx-auto">
      The modern CRM built to streamline your workflow,
      boost productivity, and accelerate growth.
    </p>

    <div className="mt-10 flex justify-center gap-6 flex-wrap">

      <button
        onClick={() => navigate("/login")}
        className="
        px-10 py-4 rounded-xl text-lg font-semibold 
        bg-white text-emerald-600
        shadow-2xl hover:scale-105 hover:shadow-white/30
        transition-all duration-300
        "
      >
        Start Free Trial
      </button>

      <button
        onClick={() => navigate("/login")}
        className="
        px-10 py-4 rounded-xl text-lg font-semibold 
        border border-white/40
        hover:bg-white/10 transition-all duration-300
        "
      >
        View Demo
      </button>

    </div>

    <p className="mt-6 text-sm text-emerald-200">
      No credit card required • Free 14-day trial • Cancel anytime
    </p>

  </div>

</section>

      {/* Features */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-gray-800">
            Powerful Features for Modern Teams
          </h3>

          <p className="mt-4 text-gray-500">
            Everything you need to manage your sales pipeline efficiently
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-white border border-emerald-100 
                shadow-md hover:shadow-2xl hover:-translate-y-2 
                transition-all duration-300"
              >
                <div className="flex justify-center mb-5">
                  <feature.icon
                    size={36}
                    className="text-emerald-500"
                  />
                </div>

                <h4 className="text-xl font-semibold mb-2">
                  {feature.title}
                </h4>

                <p className="text-gray-500 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-28 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          
          <div>
            <h3 className="text-3xl font-bold mb-8">
              Why Teams Choose SalesFlow
            </h3>

            <div className="space-y-6">
              {[
                "Manage Leads Easily",
                "Track Deals Efficiently",
                "Role-Based Access Control",
                "Enterprise-Grade Security",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <CheckCircle className="text-emerald-500 mt-1" />
                  <p className="text-gray-700 font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-2xl border border-emerald-100">
            <img
              src="/dashboard-preview.png"
              alt="Dashboard Preview"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 text-center bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-4xl font-bold">
            Ready to Grow Faster?
          </h3>

          <p className="mt-4 text-emerald-100">
            Join thousands of successful teams using SalesFlow
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-10 px-10 py-4 rounded-xl font-semibold text-emerald-600 
            bg-white hover:bg-gray-100 shadow-xl hover:scale-105 transition-all duration-300"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-center">
        <p className="text-lg font-semibold text-white">SalesFlow</p>
        <p className="mt-2 text-sm">
          Modern CRM built for growing sales teams.
        </p>
        <p className="mt-6 text-xs">
          © 2026 SalesFlow. All rights reserved.
        </p>
      </footer>

    </div>
  );
}