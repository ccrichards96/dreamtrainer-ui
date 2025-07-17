import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth0 } from '@auth0/auth0-react';
import { CheckCircle2, Circle, ArrowRight, Calendar, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const firstName = user?.given_name || 'there';

  // Dummy modules for demonstration
  type ModuleStatus = 'not-started' | 'in-progress' | 'done';
  type Module = { id: string; title: string; status: ModuleStatus };
  // Dummy data for demonstration
  const modules: Module[] = [
    { id: 'mod1', title: 'Diagnostic Test', status: 'done' },
    { id: 'mod2', title: 'Reading Skills Practice', status: 'in-progress' },
    { id: 'mod3', title: 'Listening Skills Practice', status: 'not-started' },
    { id: 'mod4', title: 'Speaking Skills Practice', status: 'not-started' },
    { id: 'mod5', title: 'Writing Skills Practice', status: 'not-started' },
    { id: 'mod6', title: 'Full TOEFL Practice Test', status: 'not-started' },
    { id: 'mod7', title: 'Review & Test Strategies', status: 'not-started' }
  ];
  const completedModules = modules.filter((m) => m.status === 'done');
  const modulesToStart = modules.filter((m) => m.status !== 'done');

  // Modular icon generator for module status
  function getModuleStatusIcon(status: ModuleStatus) {
    if (status === 'done') {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    if (status === 'in-progress') {
      return <Circle className="w-5 h-5 text-yellow-500 animate-pulse" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
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


        {/* Modules Grid*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
            {/* Modules Completed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Modules Completed
              </h2>
              <ul className="pl-0 text-gray-700">
                {completedModules.length === 0 ? (
                  <li className="list-none">No modules completed yet.</li>
                ) : (
                  completedModules.map((mod) => (
                    <li key={mod.id} className="flex items-center gap-3 mb-2 list-none">
                      {getModuleStatusIcon(mod.status)}
                      <span>{mod.title}</span>
                    </li>
                  ))
                )}
              </ul>
            </motion.div>

            {/* Modules To Start */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Modules To Start
              </h2>
              <ul className="pl-0 text-gray-700">
                {modulesToStart.length === 0 ? (
                  <li className="list-none">All modules started!</li>
                ) : (
                  modulesToStart.map((mod) => (
                    <li key={mod.id} className="flex items-center gap-3 mb-2 list-none">
                      {getModuleStatusIcon(mod.status)}
                      <span>{mod.title}</span>
                      {mod.status === 'in-progress' && (
                        <span className="ml-2 text-xs text-yellow-600 bg-yellow-100 rounded px-2 py-0.5">In Progress</span>
                      )}
                      {mod.status === 'not-started' && (
                        <span className="ml-2 text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5">Not Started</span>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
        </div>


        {/* Main Dashboard Grid - Implementation from image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Connect Your Tools Section */}
          {/* Need Help? */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Need help?
            </h2>
            <button className="w-full bg-[#c5a8de] text-white py-4 rounded-lg font-medium hover:bg-[#b399d6] transition-all flex items-center justify-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5" />
              Chat with us
            </button>
            <a href="#" className="text-[#c5a8de] hover:text-[#b399d6] transition-all text-center block">
              Video tutorials
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
