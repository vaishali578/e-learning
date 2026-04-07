import React, { useEffect, useState } from 'react';
import CertificateCard from '@/features/certificates/components/CertificateCard';

const mockCertificates = [
  {
    id: 'c1',
    courseTitle: 'Complete MERN Stack Course',
    issuedAt: '2025-11-12T10:00:00Z',
    issuedBy: 'Globus E-Learning',
    thumbnail: '/assets/images/landing/cert-thumb-1.jpg',
    fileUrl: '/certs/c1.pdf',
  },
  {
    id: 'c2',
    courseTitle: 'React Performance Optimization',
    issuedAt: '2025-09-22T10:00:00Z',
    issuedBy: 'Globus E-Learning',
    thumbnail: '/assets/images/landing/cert-thumb-2.jpg',
    fileUrl: '/certs/c2.pdf',
  },
];

const CertificatesPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    // TODO: replace mock with real API call to fetch student certificates
    setLoading(true);
    const load = async () => {
      try {
        // placeholder delay to simulate load
        await new Promise((r) => setTimeout(r, 300));
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
    // open in new tab
    if (cert.fileUrl) window.open(cert.fileUrl, '_blank');
  };

  const handleDownload = (cert) => {
    // quick download link
    if (cert.fileUrl) {
      const a = document.createElement('a');
      a.href = cert.fileUrl;
      a.download = `${cert.courseTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Certificates</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Download or view certificates you have earned.</p>
      </div>

      {loading && <div className="text-sm text-gray-500 dark:text-gray-400">Loading certificates…</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {!loading && !error && (
        <div>
          {certificates.length === 0 ? (
            <div className="bg-white dark:bg-[#1f2337] rounded-xl p-6 text-center">
              <div className="text-gray-500 dark:text-gray-400">You don't have any certificates yet. Complete courses to earn certificates.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((c) => (
                <CertificateCard key={c.id} certificate={c} onView={handleView} onDownload={handleDownload} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
