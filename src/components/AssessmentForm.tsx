import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  CheckCircle, 
  Clock, 
  Star, 
  TrendingUp, 
  ArrowRight, 
  RefreshCw
} from 'lucide-react';
import { submitAssessment, type AssessmentSubmission } from '../services/api';
import { useCourseContext } from '../contexts/useCourseContext';

interface AssessmentFormData {
  test_number: string;
  homework_completed: string;
  followed_toefl_timing: string;
  essay_question_1: string;
  essay_question_1_word_count: string;
  essay_question_2: string;
  essay_question_2_word_count: string;
}

interface FormErrors {
  [key: string]: string;
}

interface AssessmentFormProps {
  testName?: string;
  onSubmit?: (answers: Record<string, string | string[]>) => void;
  onSuccess?: () => void;
  showHeader?: boolean;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ 
  testName = 'TOEFL Writing Assessment',
  onSubmit,
  onSuccess,
  showHeader = true
}) => {
  const { user } = useAuth0();
  const { currentTest } = useCourseContext();

  const [form, setForm] = useState<AssessmentFormData>({
    test_number: testName,
    homework_completed: '',
    followed_toefl_timing: '',
    essay_question_1: '',
    essay_question_1_word_count: '',
    essay_question_2: '',
    essay_question_2_word_count: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Update test_number when testName prop changes
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      test_number: testName
    }));
  }, [testName]);

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Word counting function
  const countWords = (text: string): number => {
    if (!text || text.trim() === '') return 0;
    return text.trim().split(/\s+/).length;
  };

  // Update word count for specific essay
  const updateWordCount = (essayField: string, text: string) => {
    const wordCount = countWords(text);
    const wordCountField = essayField === 'essay_question_1' 
      ? 'essay_question_1_word_count' 
      : 'essay_question_2_word_count';
    
    setForm(prev => ({
      ...prev,
      [wordCountField]: wordCount.toString()
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    // No required field validation needed since personal info is handled in background
    // All other fields are marked as required in HTML
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare the data for API submission using user data from Auth0
      const assessmentData: AssessmentSubmission = {
        first_name: user?.given_name || '',
        last_name: user?.family_name || '',
        email: user?.email || '',
        test_number: form.test_number,
        homework_completed: form.homework_completed,
        followed_toefl_timing: form.followed_toefl_timing,
        essay_question_1: form.essay_question_1,
        essay_question_1_word_count: form.essay_question_1_word_count,
        essay_question_2: form.essay_question_2,
        essay_question_2_word_count: form.essay_question_2_word_count,
      };

      // Submit to API
      const response = await submitAssessment(
        currentTest?.id || 'default-test-id', // testId
        user?.sub || '', // userId 
        assessmentData
      );
      
      console.log('Assessment submitted successfully:', response);
      setSubmitted(true);
      
      // Call parent onSubmit if provided (only form data, personal info handled in background)
      if (onSubmit) {
        onSubmit({
          test_number: form.test_number,
          homework_completed: form.homework_completed,
          followed_toefl_timing: form.followed_toefl_timing,
          essay_question_1: form.essay_question_1,
          essay_question_1_word_count: form.essay_question_1_word_count,
          essay_question_2: form.essay_question_2,
          essay_question_2_word_count: form.essay_question_2_word_count,
        });
      }
      
      // Call onSuccess callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Something went wrong. Please try again or contact support.';
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
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
          Thank you for your submission. We'll review your assessment and send your score and feedback to your email within 24-48 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {testName}
          </h2>
          <p className="text-gray-600">
            Submit your TOEFL writing test for professional evaluation and feedback.
          </p>
        </motion.div>
      )}

      {/* Assessment Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hidden Test Information - Auto-populated */}
          <input
            name="test_number"
            type="hidden"
            value={form.test_number}
          />

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
              htmlFor="homework_completed"
            >
              <CheckCircle className="w-4 h-4 text-gray-400" />
              Did you complete your full homework since your last test submission? *
            </label>
            <input
              id="homework_completed"
              name="homework_completed"
              type="text"
              value={form.homework_completed}
              onChange={handleChange}
              placeholder="Yes, 100%."
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
              htmlFor="followed_toefl_timing"
            >
              <Clock className="w-4 h-4 text-gray-400" />
              Did you complete this practice test according to strict TOEFL timing? *
            </label>
            <input
              id="followed_toefl_timing"
              name="followed_toefl_timing"
              type="text"
              value={form.followed_toefl_timing}
              onChange={handleChange}
              placeholder="Yes, I followed TOEFL timing and conditions strictly."
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
              onBlur={(e) => updateWordCount('essay_question_1', e.target.value)}
              placeholder="[Your essay text here]"
              rows={6}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-vertical"
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
              onBlur={(e) => updateWordCount('essay_question_2', e.target.value)}
              placeholder="[Your essay text here]"
              rows={6}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-vertical"
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
                Essay 1 Word Count (Auto-calculated)
              </label>
              <input
                id="essay_question_1_word_count"
                name="essay_question_1_word_count"
                type="number"
                min="0"
                value={form.essay_question_1_word_count}
                readOnly
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                htmlFor="essay_question_2_word_count"
              >
                <TrendingUp className="w-4 h-4 text-gray-400" />
                Essay 2 Word Count (Auto-calculated)
              </label>
              <input
                id="essay_question_2_word_count"
                name="essay_question_2_word_count"
                type="number"
                min="0"
                value={form.essay_question_2_word_count}
                readOnly
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
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
  );
};

export default AssessmentForm;
