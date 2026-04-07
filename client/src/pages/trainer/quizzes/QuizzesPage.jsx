import React, { useState } from 'react';
import { FiPlus, FiClock, FiCheckSquare, FiSearch, FiFilter, FiMoreVertical, FiPlayCircle, FiBarChart2 } from 'react-icons/fi';

const TrainerQuizzesPage = () => {
  const [activeTab, setActiveTab] = useState('All');

  const quizzes = [
    {
      id: 1,
      title: 'React Fundamentals Assessment',
      course: 'Advanced React & Redux',
      questions: 20,
      avgScore: 82,
      timeLimit: '30 mins',
      status: 'Active',
    },
    {
      id: 2,
      title: 'Node.js Express Authentication',
      course: 'Fullstack Node.js Bootcamp',
      questions: 15,
      avgScore: 65,
      timeLimit: '20 mins',
      status: 'Active',
    },
    {
      id: 3,
      title: 'UI/UX Fundamentals',
      course: 'UI/UX Masterclass',
      questions: 10,
      avgScore: 91,
      timeLimit: '15 mins',
      status: 'Draft',
    },
    {
      id: 4,
      title: 'Python Pandas Final Quiz',
      course: 'Python for Data Science',
      questions: 35,
      avgScore: 74,
      timeLimit: '60 mins',
      status: 'Closed',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quizzes & Tests</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Design assessments and track student quiz performances natively.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
          <FiPlus size={18} />
          Create Quiz
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1e2035] p-5 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FiCheckSquare size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Quizzes</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">18</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1e2035] p-5 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center">
            <FiPlayCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Quizzes</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">12</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1e2035] p-5 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <FiBarChart2 size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Avg Class Score</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">78%</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-[#1e2035] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">

          <div className="flex bg-gray-100 dark:bg-[#151624] p-1 rounded-lg w-full sm:w-auto">
            {['All', 'Active', 'Draft', 'Closed'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === tab
                    ? 'bg-white dark:bg-[#2a2c44] text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search quizzes..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-[#151624] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="p-2 border border-gray-200 dark:border-white/10 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <FiFilter size={18} />
            </button>
          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1a1c2e] border-b border-gray-200 dark:border-white/10">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quiz Title</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Duration</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg Score</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {quizzes.map(quiz => (
                <tr key={quiz.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0">
                        <FiCheckSquare className="text-indigo-500 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{quiz.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                          {quiz.course} &bull; {quiz.questions} Qs
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                      <FiClock className="text-gray-400" />
                      {quiz.timeLimit}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${quiz.avgScore >= 80 ? 'text-green-600 dark:text-green-400' :
                          quiz.avgScore >= 70 ? 'text-orange-500 dark:text-orange-400' : 'text-red-500 dark:text-red-400'
                        }`}>
                        {quiz.avgScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full
                      ${quiz.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : ''}
                      ${quiz.status === 'Draft' ? 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400' : ''}
                      ${quiz.status === 'Closed' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : ''}
                    `}>
                      {quiz.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                      <FiMoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State placeholder */}
          {quizzes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                <FiCheckSquare size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No quizzes found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">You haven't created any assessments yet, or none match your current filters.</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                Create Quiz
              </button>
            </div>
          )}
        </div>

        {/* Pagination placeholder */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Showing 1 to 4 of 4 results</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 rounded border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrainerQuizzesPage;
