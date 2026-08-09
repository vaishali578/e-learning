import React from 'react';
import { FiAward, FiDownload, FiEye, FiCalendar, FiUser } from 'react-icons/fi';

const CertificateCard = ({ certificate, onView, onDownload }) => {
  const { courseTitle, issuedAt, issuedBy, thumbnail } = certificate;

  return (
    <div className="group relative bg-white dark:bg-[#1f2337] rounded-2xl border border-gray-100 dark:border-gray-800/60 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Decorative Glow Background on Hover */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500 pointer-events-none" />

      <div>
        {/* Certificate Badge & Image Row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-blue-100/50 dark:border-blue-900/30">
            {thumbnail ? (
              <img src={thumbnail} alt={courseTitle} className="w-full h-full object-cover" />
            ) : (
              <FiAward size={28} className="text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
            Verified
          </span>
        </div>

        {/* Certificate Title & Details */}
        <div className="space-y-2">
          <h4 className="font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {courseTitle}
          </h4>
          
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <FiUser size={13} className="shrink-0 text-gray-400 dark:text-gray-500" />
              <span>Issued by <span className="font-medium text-gray-700 dark:text-gray-300">{issuedBy}</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <FiCalendar size={13} className="shrink-0 text-gray-400 dark:text-gray-500" />
              <span>{new Date(issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center gap-2">
        <button
          onClick={() => onView?.(certificate)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-[#11121a] hover:bg-gray-100 dark:hover:bg-gray-800/80 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-xl border border-gray-200/50 dark:border-gray-800 transition"
          aria-label="View Certificate"
        >
          <FiEye size={14} />
          View
        </button>
        <button
          onClick={() => onDownload?.(certificate)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow-blue-500/20 transition"
          aria-label="Download Certificate"
        >
          <FiDownload size={14} />
          Download
        </button>
      </div>
    </div>
  );
};

export default CertificateCard;
