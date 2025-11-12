import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Target,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  ArrowRight,
  Rocket,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import {
  submitAssessment,
  type AssessmentSubmission,
} from "../../services/api";
import { useCourseContext } from "../../contexts/useCourseContext";

interface AssessmentForm {
  first_name: string;
  last_name: string;
  email: string;
  test_number: string;
  homework_completed: string;
  followed_toefl_timing: string;
  essay_question_1: string;
  essay_question_1_word_count: string;
  essay_question_2: string;
  essay_question_2_word_count: string;
}

interface FormErrors {
  first_name: string;
  last_name: string;
  email: string;
  [key: string]: string;
}

export default function Assessment() {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const { currentTest } = useCourseContext();

  const [form, setForm] = useState<AssessmentForm>({
    first_name: user?.given_name || "",
    last_name: user?.family_name || "",
    email: user?.email || "",
    test_number: "",
    homework_completed: "",
    followed_toefl_timing: "",
    essay_question_1: "",
    essay_question_1_word_count: "",
    essay_question_2: "",
    essay_question_2_word_count: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      first_name: "",
      last_name: "",
      email: "",
    };

    if (!form.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!form.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the data for API submission
      const assessmentData: AssessmentSubmission = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        test_number: form.test_number,
        homework_completed: form.homework_completed,
        followed_toefl_timing: form.followed_toefl_timing,
        essay_question_1: form.essay_question_1,
        essay_question_1_word_count: form.essay_question_1_word_count,
        essay_question_2: form.essay_question_2,
        essay_question_2_word_count: form.essay_question_2_word_count,
      };

      // Submit to API
      await submitAssessment(
        currentTest?.id || "default-test-id", // testId
        user?.sub || "", // userId
        assessmentData,
      );

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting assessment:", error);

      // Show user-friendly error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again or contact support.";

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Assessment Submitted Successfully!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your submission. Refresh your dashboard in 15 minutes, and you'll see your score appear. And, we'll send your personal feedback to your email within 48 hours.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-[#c5a8de] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#b399d6] transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
              <Rocket className="w-8 h-8 text-[#c5a8de]" />
              TOEFL Writing Assessment
            </h1>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
          <p className="text-xl text-gray-600">
            Submit your TOEFL writing test for professional evaluation and
            feedback.
          </p>
        </motion.div>

        {/* Assessment Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                  htmlFor="first_name"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  First Name *
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="John"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#c5a8de] focus:border-transparent transition-all ${
                    errors.first_name ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                  htmlFor="last_name"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  Last Name *
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#c5a8de] focus:border-transparent transition-all ${
                    errors.last_name ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                htmlFor="email"
              >
                <Mail className="w-4 h-4 text-gray-400" />
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="johndoe@email.com"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#c5a8de] focus:border-transparent transition-all ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                We'll send your score and feedback to this email address
              </p>
            </div>

            {/* Test Information */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                htmlFor="test_number"
              >
                <Target className="w-4 h-4 text-gray-400" />
                What Writing Test is This? *
              </label>
              <input
                id="test_number"
                name="test_number"
                type="text"
                value={form.test_number}
                onChange={handleChange}
                placeholder="Test 1"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c5a8de] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                htmlFor="homework_completed"
              >
                <CheckCircle className="w-4 h-4 text-gray-400" />
                Did you complete your full homework since your last test
                submission? *
              </label>
              <input
                id="homework_completed"
                name="homework_completed"
                type="text"
                value={form.homework_completed}
                onChange={handleChange}
                placeholder="Yes, 100%."
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c5a8de] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                htmlFor="followed_toefl_timing"
              >
                <Clock className="w-4 h-4 text-gray-400" />
                Did you complete this practice test according to strict TOEFL
                timing? *
              </label>
              <input
                id="followed_toefl_timing"
                name="followed_toefl_timing"
                type="text"
                value={form.followed_toefl_timing}
                onChange={handleChange}
                placeholder="Yes, I followed TOEFL timing and conditions strictly."
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c5a8de] focus:border-transparent transition-all"
              />
            </div>

            {/* Essay Questions */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                htmlFor="essay_question_1"
              >
                <Star className="w-4 h-4 text-gray-400" />
                Enter Your Answer for Essay Question 1 *
              </label>
              <textarea
                id="essay_question_1"
                name="essay_question_1"
                value={form.essay_question_1}
                onChange={handleChange}
                placeholder="[Your essay text here]"
                rows={6}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c5a8de] focus:border-transparent transition-all resize-vertical"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                htmlFor="essay_question_2"
              >
                <Star className="w-4 h-4 text-gray-400" />
                Enter Your Answer for Essay Question 2 *
              </label>
              <textarea
                id="essay_question_2"
                name="essay_question_2"
                value={form.essay_question_2}
                onChange={handleChange}
                placeholder="[Your essay text here]"
                rows={6}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c5a8de] focus:border-transparent transition-all resize-vertical"
              />
            </div>

            {/* Word Counts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                  htmlFor="essay_question_1_word_count"
                >
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  Essay 1 Word Count *
                </label>
                <input
                  id="essay_question_1_word_count"
                  name="essay_question_1_word_count"
                  type="number"
                  min="0"
                  value={form.essay_question_1_word_count}
                  onChange={handleChange}
                  placeholder="350"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c5a8de] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                  htmlFor="essay_question_2_word_count"
                >
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  Essay 2 Word Count *
                </label>
                <input
                  id="essay_question_2_word_count"
                  name="essay_question_2_word_count"
                  type="number"
                  min="0"
                  value={form.essay_question_2_word_count}
                  onChange={handleChange}
                  placeholder="300"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c5a8de] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#c5a8de] hover:bg-[#b399d6] disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Submitting Assessment...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    Submit Assessment
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
