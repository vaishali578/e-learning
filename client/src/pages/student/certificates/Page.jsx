import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAward, FiSearch, FiBookOpen, FiActivity, FiTrendingUp } from 'react-icons/fi';
import CertificateCard from '@/features/certificates/components/CertificateCard';

const mockCertificates = [
  {
    id: 'c1',
    courseTitle: 'Complete MERN Stack Course',
    issuedAt: '2025-11-12T10:00:00Z',
    issuedBy: 'E-Learning',
    thumbnail: '', // Uses default icon
    fileUrl: '/certs/c1.pdf',
  },
  {
    id: 'c2',
    courseTitle: 'React Performance Optimization',
    issuedAt: '2025-09-22T10:00:00Z',
    issuedBy: 'E-Learning',
    thumbnail: '', // Uses default icon
    fileUrl: '/certs/c2.pdf',
  },
];

const CertificatesPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate API call to fetch student certificates
    setLoading(true);
    const load = async () => {
      try {
        await new Promise((r) => setTimeout(r, 400));
        setCertificates(mockCertificates);
      } catch (err) {
        setError('Failed to load certificates');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleView = (cert) => {
    if (cert.fileUrl) window.open(cert.fileUrl, '_blank');
  };

  const handleDownload = (cert) => {
    if (cert.fileUrl) {
      const a = document.createElement('a');
      a.href = cert.fileUrl;
      a.download = `${cert.courseTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  // Filtered certificates based on search query
  const filteredCertificates = certificates.filter((c) =>
    c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics calculation
  const totalCertificates = certificates.length;
  const latestCertificate =
    certificates.length > 0
      ? [...certificates].sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt))[0]
      : null;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            My Certificates <FiAward className="text-blue-500" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Download or view certificates you have earned by completing courses.
          </p>
        </div>

        {/* Search Filter */}
        {certificates.length > 0 && (
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#1f2337] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-white transition"
            />
          </div>
        )}
      </div>

      {/* Stats Cards Section */}
      {!loading && !error && certificates.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#1f2337] border border-gray-100 dark:border-gray-800/80 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-400">
              <FiAward size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Total Earned</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{totalCertificates}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1f2337] border border-gray-100 dark:border-gray-800/80 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
              <FiTrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Verification</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">100% Secure</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1f2337] border border-gray-100 dark:border-gray-800/80 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl text-purple-600 dark:text-purple-400">
              <FiActivity size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Latest Award</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1 truncate max-w-[180px]">
                {latestCertificate ? latestCertificate.courseTitle : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <span className="w-9 h-9 rounded-full border-3 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading your certificates...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div>
          {certificates.length === 0 ? (
            <div className="bg-white dark:bg-[#1f2337] border border-gray-100 dark:border-gray-800/60 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-sm">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBookOpen size={30} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No certificates yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
                Once you complete your enrolled courses, your verified completion certificates will be generated here.
              </p>
              <button
                onClick={() => navigate('/student/explore-courses')}
                className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-sm hover:shadow-blue-500/20"
              >
                Explore Courses
              </button>
            </div>
          ) : filteredCertificates.length === 0 ? (
            <div className="bg-white dark:bg-[#1f2337] border border-gray-100 dark:border-gray-800/60 rounded-2xl p-8 text-center max-w-md mx-auto shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No certificates matched "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs text-blue-600 hover:underline font-semibold"
              >
                Clear Search Query
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertificates.map((c) => (
                <CertificateCard
                  key={c.id}
                  certificate={c}
                  onView={handleView}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
