import { motion } from 'framer-motion';
import { useAuth0 } from '@auth0/auth0-react';
import { CheckCircle2, Circle, ArrowRight, MessageSquare, RefreshCw, AlertCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardContext, DashboardProvider, Module } from '../../contexts';
import DreamFlow from '../../components/DreamFlow';

function DashboardContent() {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const firstName = user?.given_name || 'there';

  // Use Dashboard context instead of dummy data
  const {
    startingScore,
    startingScoreDate,
    currentScore,
    currentScoreDate,
    modulesCompleted,
    modulesToComplete,
    showFinalAssessment,
    announcements,
    loading,
    error
  } = useDashboardContext();

  // Map context modules to include status for compatibility with existing UI
  const mapModuleWithStatus = (module: Module, status: 'done' | 'not-started') => ({
    ...module,
    status
  });

  const completedModulesWithStatus = modulesCompleted.map(m => mapModuleWithStatus(m, 'done'));
  const modulesToStartWithStatus = modulesToComplete.map(m => mapModuleWithStatus(m, 'not-started'));

  // Add sample TOEFL modules for demonstration
  const sampleTOEFLModule1 = {
    title: "TOEFL: Writing Question 1",
    description: "Master the TOEFL Writing Task 1 - Integrated Writing. Learn how to effectively read an academic passage, listen to a lecture, and write a coherent response that demonstrates your ability to synthesize information from multiple sources.",
    videoUrl: "https://vimeo.com/981374557/52c7d357b3?share=copy", // TOEFL Writing tutorial video
    botIframeUrl: "https://app.vectorshift.ai/chatbots/deployed/67c28ce25d6b7f0ba2b47803"
  };

  const sampleTOEFLModule2 = {
    title: "TOEFL: Writing Question 2",
    description: "Master the TOEFL Writing Task 2 - Independent Writing. Learn how to develop your ideas, organize your thoughts, and write a well-structured essay that demonstrates your ability to express and support your opinions effectively.",
    videoUrl: "https://www.youtube.com/embed/8DaTKVBqUNs", // TOEFL Writing Task 2 tutorial video
    botIframeUrl: "https://app.vectorshift.ai/chatbots/deployed/67c28ce25d6b7f0ba2b47803"
  };

  // For now, always use the sample TOEFL modules to demonstrate the functionality
  const finalDreamFlowModules = [sampleTOEFLModule1, sampleTOEFLModule2];

  const handleCourseComplete = () => {
    console.log('Course completed!');
    // Navigate to assessment page after course completion
    navigate('/assessment');
  };

  // Modular icon generator for module status
  function getModuleStatusIcon(status: 'done' | 'in-progress' | 'not-started') {
    if (status === 'done') {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    if (status === 'in-progress') {
      return <Circle className="w-5 h-5 text-yellow-500 animate-pulse" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#c5a8de]" />
              <span className="text-lg text-gray-600">Loading your dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load dashboard</h2>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {firstName}!
          </h1>
          <p className="text-xl text-gray-600">
            Let's get you started with your professional certification journey.
          </p>
        </motion.div>

        {/* Score Progress Section */}
        {(startingScore !== null || currentScore !== null) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Starting Score */}
            {startingScore !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Starting Score
                </h2>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#c5a8de] mb-4">{startingScore}</div>
                  <div className="text-gray-600 text-lg">Initial Assessment</div>
                  <div className="text-sm text-gray-500 mt-2">
                    Your baseline score when you started
                  </div>
                  {startingScoreDate && (
                    <div className="text-xs text-gray-400 mt-3">
                      Assessed: {startingScoreDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Current Score */}
            {currentScore !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Current Score
                </h2>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-4">{currentScore}</div>
                  <div className="text-gray-600 text-lg">Latest Assessment</div>
                  {startingScore !== null && (
                    <div className="mt-4">
                      <div className={`text-lg font-medium ${
                        currentScore > startingScore ? 'text-green-600' : 
                        currentScore < startingScore ? 'text-red-500' : 'text-gray-600'
                      }`}>
                        {currentScore > startingScore ? '+' : ''}{currentScore - startingScore} points
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {currentScore > startingScore ? 'Great progress!' : 
                         currentScore < startingScore ? 'Keep practicing!' : 'Steady performance'}
                      </div>
                    </div>
                  )}
                  {currentScoreDate && (
                    <div className="text-xs text-gray-400 mt-3">
                      Assessed: {currentScoreDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* General Announcements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            General Announcements
          </h2>
          <div className="max-h-80 overflow-y-auto">
            {announcements.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No announcements at this time</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((announcement) => (
                    <div
                      key={announcement.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        announcement.type === 'general' ? 'border-blue-500 bg-blue-50' :
                        announcement.type === 'account' ? 'border-green-500 bg-green-50' :
                        announcement.type === 'support' ? 'border-yellow-500 bg-yellow-50' :
                        'border-gray-500 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {announcement.name}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          announcement.type === 'general' ? 'bg-blue-100 text-blue-800' :
                          announcement.type === 'account' ? 'bg-green-100 text-green-800' :
                          announcement.type === 'support' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">
                        {announcement.message}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Learning Modules - DreamFlow Section */}
        {finalDreamFlowModules.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Learning Modules
                </h2>
                <p className="text-gray-600">
                  Progress through your certification modules with interactive content and guided tutorials.
                </p>
              </div>
              <div className="p-4">
                <DreamFlow 
                  modules={finalDreamFlowModules} 
                  onComplete={handleCourseComplete}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Final Assessment Section */}
        {showFinalAssessment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-8 mb-8 text-white"
          >
            <h2 className="text-2xl font-semibold mb-4">
              🎉 Ready for Final Assessment!
            </h2>
            <p className="text-green-100 mb-6">
              Congratulations! You've completed all required modules and are ready to take your final assessment.
            </p>
            <button
              onClick={() => navigate('/assessment')}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-all flex items-center gap-2"
            >
              Start Final Assessment
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Main Dashboard Grid - Implementation from image */}
        <div className="grid grid-cols-1 gap-8">
          {/* Need Help? */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Need help/support from our trusted experts?
            </h2>
            <a 
              href="https://calendly.com/notefulljoseph/toefl-course-help" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-[#c5a8de] text-white py-4 rounded-lg font-medium hover:bg-[#b399d6] transition-all flex items-center justify-center gap-2 mb-4"
            >
              <Calendar className="w-5 h-5" />
              Book A Meeting Calendly
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Wrapper component that provides the Dashboard context
export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
