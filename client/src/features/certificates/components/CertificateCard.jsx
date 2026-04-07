import React from 'react';

const CertificateCard = ({ certificate, onView, onDownload }) => {
  const { courseTitle, issuedAt, issuedBy, thumbnail } = certificate;

  return (
    <div className="bg-white dark:bg-[#1f2337] rounded-xl shadow p-4 flex flex-col">
      <div className="flex items-center gap-4">
        <div className="w-20 h-14 bg-gray-100 dark:bg-[#0b0d17] rounded overflow-hidden flex-shrink-0">
          {thumbnail ? (
            <img src={thumbnail} alt={courseTitle} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">Cert</div>
          )}
        </div>

        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{courseTitle}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Issued by {issuedBy}</div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(issuedAt).toLocaleDateString()}</div>
          <div className="mt-2 flex gap-2 justify-end">
            <button aria-label="View Certificate" onClick={() => onView?.(certificate)} className="px-3 py-1 bg-white dark:bg-[#11121a] border border-gray-200 dark:border-[#222436] text-xs rounded text-gray-700 dark:text-gray-100">View</button>
            <button aria-label="Download Certificate" onClick={() => onDownload?.(certificate)} className="px-3 py-1 bg-blue-600 text-white text-xs rounded">Download</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
