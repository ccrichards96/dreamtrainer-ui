import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Check,
  ChevronRight,
  Users,
  Trophy,
  Target,
  Zap,
  ArrowRight,
  Play,
  MessageCircle,
} from "lucide-react";
import VideoModal from "../../components/modals/VideoModal";

export default function Home() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-50 to-teal-100"
    >
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-blue-50 via-[#e6d8f5] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-[#e6d8f5] rounded-full px-4 py-2 mb-6">
                <Zap className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">AI-Powered Training</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Turn Your Dreams Into{" "}
                <span className="bg-gradient-to-r from-blue-600 to-[#c5a8de] bg-clip-text text-transparent">
                  Reality
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Personalized AI coaching that adapts to your goals, tracks your progress, and guides
                you to success. Join thousands who've already achieved their dreams.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-gradient-to-r from-blue-600 to-[#c5a8de] text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-[#b399d6] transition-all duration-200 transform hover:scale-105 font-semibold text-lg flex items-center justify-center group"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200 font-semibold text-lg flex items-center justify-center group"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-red-400"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-400"></div>
                  </div>
                  <span>10,000+ success stories</span>
                </div>
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span>4.9/5 rating</span>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <button
                  onClick={() => navigate("/blog")}
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Read our latest insights →
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mr-4">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Goal Achievement</h3>
                    <p className="text-gray-600 text-sm">Track your progress daily</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Weekly Progress</span>
                    <span className="text-sm font-semibold text-green-600">+24%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full w-3/4 transition-all duration-1000"></div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">85</div>
                      <div className="text-xs text-gray-500">Days Active</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#c5a8de]">12</div>
                      <div className="text-xs text-gray-500">Goals Met</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">98%</div>
                      <div className="text-xs text-gray-500">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#c5a8de] rounded-2xl transform rotate-6"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#c5a8de] to-pink-600 rounded-2xl transform -rotate-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-[#c5a8de] bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform combines personalized coaching, progress tracking, and
              community support to help you achieve any goal.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Smart Goal Setting",
                description:
                  "AI analyzes your objectives and creates a personalized roadmap with achievable milestones.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Users,
                title: "Expert Coaching",
                description:
                  "Get guidance from certified coaches and AI trainers available 24/7 to support your journey.",
                color: "from-[#c5a8de] to-pink-500",
              },
              {
                icon: Trophy,
                title: "Progress Tracking",
                description:
                  "Real-time analytics and insights help you stay motivated and adjust your strategy as needed.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Zap,
                title: "AI-Powered Insights",
                description:
                  "Machine learning algorithms provide personalized recommendations to optimize your performance.",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: MessageCircle,
                title: "Community Support",
                description:
                  "Connect with like-minded individuals and share your journey with our supportive community.",
                color: "from-indigo-500 to-[#c5a8de]",
              },
              {
                icon: Check,
                title: "Guaranteed Results",
                description:
                  "Follow our proven system and see measurable progress within 30 days, or get your money back.",
                color: "from-teal-500 to-green-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Success Stories from Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-[#c5a8de] bg-clip-text text-transparent">
                Community
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              See how Dream Trainer has transformed lives and helped people achieve their biggest
              goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Entrepreneur",
                content:
                  "Dream Trainer helped me launch my startup in 6 months. The AI coaching was like having a mentor available 24/7.",
                rating: 5,
                avatar: "from-pink-400 to-red-400",
              },
              {
                name: "Michael Chen",
                role: "Fitness Enthusiast",
                content:
                  "Lost 40 pounds and completed my first marathon. The progress tracking kept me motivated every day.",
                rating: 5,
                avatar: "from-blue-400 to-cyan-400",
              },
              {
                name: "Emily Rodriguez",
                role: "Student",
                content:
                  "Improved my grades from C to A+ in one semester. The personalized study plans were game-changing.",
                rating: 5,
                avatar: "from-green-400 to-emerald-400",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${testimonial.avatar} rounded-full mr-4`}
                  ></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your goals and budget. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$29",
                period: "per month",
                description: "Perfect for getting started with goal achievement",
                features: [
                  "AI Goal Setting",
                  "Basic Progress Tracking",
                  "Community Access",
                  "Mobile App",
                  "Email Support",
                ],
                popular: false,
              },
              {
                name: "Pro",
                price: "$79",
                period: "per month",
                description: "Advanced features for serious goal achievers",
                features: [
                  "Everything in Starter",
                  "Personal AI Coach",
                  "Advanced Analytics",
                  "Priority Support",
                  "Custom Meal Plans",
                  "Weekly Check-ins",
                ],
                popular: true,
              },
              {
                name: "Elite",
                price: "$149",
                period: "per month",
                description: "Ultimate package with personal coaching",
                features: [
                  "Everything in Pro",
                  "1-on-1 Human Coach",
                  "Custom Training Plans",
                  "24/7 Phone Support",
                  "VIP Community Access",
                  "Quarterly Reviews",
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border transition-all duration-300 transform hover:-translate-y-2 ${plan.popular ? "border-[#c5a8de] shadow-xl scale-105" : "border-gray-200 hover:border-[#c5a8de] hover:shadow-lg"} bg-white`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-[#c5a8de] text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${plan.popular ? "bg-gradient-to-r from-blue-600 to-[#c5a8de] text-white hover:from-blue-700 hover:to-[#b399d6]" : "border-2 border-gray-300 text-gray-700 hover:border-[#c5a8de] hover:text-[#c5a8de]"}`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-[#c5a8de]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 w-full">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Turn Your Dreams Into Reality?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful individuals who've already achieved their goals with Dream
            Trainer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 font-semibold text-lg flex items-center justify-center group">
              Start Free Trial
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold text-lg">
              Schedule Demo
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-4">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title="Dream Trainer Demo"
        description="See how our AI-powered platform can help you achieve your goals faster than ever before."
        videoUrl="" // Replace with actual demo video URL
      />
    </motion.div>
  );
}
