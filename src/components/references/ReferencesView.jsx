import React from 'react';
import { BookOpen, FileText, Download, Award, ShieldCheck, Check } from 'lucide-react';

export default function ReferencesView({ lastUpdatedDisplay }) {
  const references = [
    {
      code: 'PCCST501',
      title: 'Computer Networks (S5 Theory)',
      credits: '4 Credits • 60 ESE Marks • 40 CIE Marks',
      textbooks: [
        'Behrouz A. Forouzan, Data Communications and Networking with TCP/IP Protocol Suite, 6th Edition, McGraw Hill (Book 1: Ch 1-9)',
        'W. Richard Stevens, Bill Fenner, Andrew M. Rudoff, UNIX Network Programming, Volume 1: The Sockets Networking API, 3rd Edition, Addison-Wesley (Book 2)',
        'Christian Benvenuti, Understanding Linux Network Internals, O\'Reilly (Book 3: Ch 14)'
      ],
      pdfPath: 'docs/syllabus/S5 CSE CN.pdf',
      color: 'var(--accent-red)'
    },
    {
      code: 'PCCST502',
      title: 'Design and Analysis of Algorithms (S5 Theory)',
      credits: '4 Credits • 60 ESE Marks • 40 CIE Marks',
      textbooks: [
        'Ellis Horowitz, Sartaj Sahni and Sanguthevar Rajasekaran, Computer Algorithms / C++, 2nd Edition, Universities Press',
        'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein, Introduction to Algorithms, 3rd Edition, PHI Learning',
        'Sara Baase and Allen Van Gelder, Computer Algorithms - Introduction to Design and Analysis, 3rd Edition, Pearson Education'
      ],
      pdfPath: 'docs/syllabus/S5 CSE DAA.pdf',
      color: 'var(--accent-peach)'
    },
    {
      code: 'PCCST303',
      title: 'Data Structures and Algorithms (S3 Supply)',
      credits: '4 Credits • 60 ESE Marks • 40 CIE Marks',
      textbooks: [
        'Ellis Horowitz, Sartaj Sahni, Susan Anderson-Freed, Fundamentals of Data Structures in C, 2nd Edition, Universities Press',
        'Seymour Lipschutz, Data Structures with C (Schaum\'s Outline Series), McGraw Hill',
        'Richard F. Gilberg, Behrouz A. Forouzan, Data Structures: A Pseudocode Approach with C, Cengage Learning'
      ],
      pdfPath: 'docs/syllabus/S3 CSE DSA.pdf',
      color: 'var(--accent-green)'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0 }}>
              <BookOpen size={18} color="var(--accent-purple)" /> Official KTU Course Syllabi & Textbooks
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '0.2rem 0 0' }}>
              Core reference materials, course evaluation standards, and official syllabus textbooks for S5 & S3 courses.
            </p>
          </div>
          <span className="badge badge-optional mono">LAST UPDATED: {lastUpdatedDisplay}</span>
        </div>

        {/* Exam Pattern Note */}
        <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-overlay)', borderRadius: '6px', borderLeft: '3px solid var(--accent-blue)', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text-main)' }}>End Semester Examination (ESE) Pattern (60 Marks • 2.5 Hours):</strong>
          <ul style={{ margin: '0.35rem 0 0 1.15rem', padding: 0 }}>
            <li><strong>Part A (24 Marks):</strong> 8 compulsory short-answer questions (2 questions per module, 3 marks each).</li>
            <li><strong>Part B (36 Marks):</strong> 4 module sections (Modules 1 to 4). Each module contains 2 questions (9 marks each), answer any 1 question per module.</li>
          </ul>
        </div>
      </div>

      {/* Subject Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {references.map((ref) => (
          <div
            key={ref.code}
            className="card"
            style={{ padding: '1.15rem', borderLeft: `4px solid ${ref.color}`, backgroundColor: 'var(--bg-surface)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem', gap: '0.4rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{ref.title}</h4>
                <span className="badge badge-module mono" style={{ fontSize: '0.65rem', marginTop: '0.2rem' }}>{ref.code}</span>
              </div>
              <span className="badge badge-optional mono" style={{ fontSize: '0.62rem', flexShrink: 0 }}>{ref.credits}</span>
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>Prescribed Textbooks:</span>
              <ul style={{ margin: '0.25rem 0 0.65rem 1rem', padding: 0, fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                {ref.textbooks.map((b, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>{b}</li>
                ))}
              </ul>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.55rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <code style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{ref.pdfPath}</code>
              <span className="badge badge-core" style={{ fontSize: '0.62rem' }}>Verified Syllabus</span>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Exams Note */}
      <div className="card" style={{ padding: '1rem', backgroundColor: 'var(--bg-overlay)' }}>
        <h4 style={{ margin: '0 0 0.35rem', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <FileText size={14} color="var(--accent-blue)" /> Upcoming Examinations (Syllabi Ingestion Queue)
        </h4>
        <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-dim)', lineHeight: 1.45 }}>
          As you collect the course syllabi for <strong>S3 Mathematics (MAT203)</strong>, <strong>Machine Learning Theory (CST307-T)</strong>, <strong>Microcontrollers (CST309)</strong>, <strong>Data Analytics (CST311)</strong>, and <strong>S3 EE/Ethics (HUT200)</strong>, paste their module contents here and their full checklist sections will be instantly activated.
        </p>
      </div>
    </div>
  );
}
