import React from 'react';
import { BookOpen, FileText, CheckCircle2 } from 'lucide-react';

export default function ReferencesView({ lastUpdatedDisplay }) {
  const references = [
    {
      code: 'PCCST501',
      title: 'Computer Networks (S5 Theory)',
      examDate: 'Nov 23, 2026',
      credits: '4 Credits • 60 ESE Marks • 40 CIE Marks',
      textbooks: [
        'Behrouz A. Forouzan, Data Communications and Networking with TCP/IP Protocol Suite, McGraw Hill (SIE 2017)',
        'W. Richard Stevens, Bill Fenner, Andrew M. Rudoff, UNIX Network Programming, Vol 1: Sockets API, 3/e, Pearson',
        'Sameer Seth, M. Ajaykumar Venkatesulu, TCP/IP Architecture, Design, and Implementation in Linux, Wiley'
      ],
      pdfPath: 'docs/syllabus/S5 CSE CN.pdf',
      color: 'var(--accent-red)'
    },
    {
      code: 'MAT203',
      title: 'Mathematics-3 (Discrete Structures / Prob) (S3 Supply)',
      examDate: 'Nov 24, 2026',
      credits: '4 Credits • 60 ESE Marks • 40 CIE Marks',
      textbooks: [
        'Devore J. L, Probability and Statistics for Engineering and the Sciences, 9th edition, Cengage Learning, 2016',
        'Sheldon M. Ross, Introduction to Probability Models, 13th edition, Academic Press, 2024'
      ],
      pdfPath: 'docs/syllabus/S3 CSE Mathematics-3 (Group A).pdf',
      color: 'var(--accent-yellow)'
    },
    {
      code: 'PCCST502',
      title: 'Design and Analysis of Algorithms (S5 Theory)',
      examDate: 'Nov 27, 2026',
      credits: '4 Credits • 60 ESE Marks • 40 CIE Marks',
      textbooks: [
        'T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 4th edition, PHI / MIT Press',
        'Ellis Horowitz, Sartaj Sahni, Sanguthevar Rajasekaran, Fundamentals of Computer Algorithms, Universities Press',
        'Sara Baase and Allen Van Gelder, Computer Algorithms - Introduction to Design & Analysis, Pearson Education'
      ],
      pdfPath: 'docs/syllabus/S5 CSE DAA.pdf',
      color: 'var(--accent-peach)'
    },
    {
      code: 'PCCST303',
      title: 'Data Structures and Algorithms (S3 Supply)',
      examDate: 'Nov 30, 2026',
      credits: '4 Credits • 60 ESE Marks • 40 CIE Marks',
      textbooks: [
        'Ellis Horowitz, Sartaj Sahni, Susan Anderson-Freed, Fundamentals of Data Structures in C, Universities Press',
        'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein, Introduction to Algorithms, PHI'
      ],
      pdfPath: 'docs/syllabus/S3 CSE DSA.pdf',
      color: 'var(--accent-green)'
    },
    {
      code: 'CST307-T',
      title: 'Machine Learning (S5 Theory)',
      examDate: 'Dec 1, 2026',
      credits: '4 Credits • 60 ESE Marks • 40 CIE Marks',
      textbooks: [
        'Ethem Alpaydin, Introduction to Machine Learning, 4th edition, MIT Press, 2020',
        'Mohammed J. Zaki, Wagner Meira, Data Mining and Analysis: Fundamental Concepts & Algorithms, Cambridge Univ Press',
        'Christopher Bishop, Neural Networks for Pattern Recognition, Oxford University Press, 1998'
      ],
      pdfPath: 'docs/syllabus/S5 CSE ML.pdf',
      color: 'var(--accent-blue)'
    },
    {
      code: 'CST309',
      title: 'Microcontroller and Embedded Systems (S5 Theory)',
      examDate: 'Dec 4, 2026',
      credits: '4 Credits • 60 ESE Marks • 40 CIE Marks',
      textbooks: [
        'Joseph Yiu, The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors, 3rd edition, Newnes - Elsevier, 2014',
        'Carmine Noviello, Mastering STM32, 2nd edition, Leanpub, 2022'
      ],
      pdfPath: 'docs/syllabus/S5 CSE MC.pdf',
      color: 'var(--accent-purple)'
    },
    {
      code: 'CST311',
      title: 'Data Analytics (S5 Theory)',
      examDate: 'Dec 7, 2026',
      credits: '4 Credits • 60 ESE Marks • 40 CIE Marks',
      textbooks: [
        'Christian Heumann and Michael Schomaker, Introduction to Statistics and Data Analysis, 1st edition, Springer, 2016',
        'Jiawei Han and Micheline Kamber, Data Mining: Concepts and Techniques, 3rd edition, Elsevier, 2012'
      ],
      pdfPath: 'docs/syllabus/S5 CSE DA.pdf',
      color: 'var(--accent-cyan)'
    },
    {
      code: 'HUT200',
      title: 'Engineering Economics & Ethics (S3 Supply)',
      examDate: 'Dec 8, 2026',
      credits: '3 Credits • 60 ESE Marks • 40 CIE Marks',
      textbooks: [
        'Geetika, Piyali Ghosh and Chodhury, Managerial Economics, Tata McGraw Hill, 2015',
        'H. G. Thuesen, W. J. Fabrycky, Engineering Economy, PHI, 1966',
        'R. Paneerselvam, Engineering Economics, PHI, 2012'
      ],
      pdfPath: 'docs/syllabus/S3 CSE EE.pdf',
      color: '#ec4899'
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
              Official curriculum textbooks and evaluation standards across all 8 S5 Regular & S3 Supply examination courses.
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
                <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.25rem', alignItems: 'center' }}>
                  <span className="badge badge-module mono" style={{ fontSize: '0.65rem' }}>{ref.code}</span>
                  <span className="badge badge-critical mono" style={{ fontSize: '0.62rem' }}>{ref.examDate}</span>
                </div>
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
              <span className="badge badge-core" style={{ fontSize: '0.62rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <CheckCircle2 size={10} /> Verified KTU Syllabus
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
