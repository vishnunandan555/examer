import React from 'react';
import { BookOpen, FileText, CheckCircle2, GraduationCap, Calendar, Award } from 'lucide-react';

export default function ReferencesView({ lastUpdatedDisplay }) {
  const references = [
    {
      code: 'PCCST501',
      title: 'Computer Networks',
      type: 'S5 Theory',
      examDate: 'Nov 23, 2026',
      credits: '4 Credits',
      evaluation: '60 ESE • 40 CIE Marks',
      textbooks: [
        'Behrouz A. Forouzan, Data Communications & Networking with TCP/IP Protocol Suite, McGraw Hill (SIE 2017)',
        'W. Richard Stevens, Bill Fenner, Andrew M. Rudoff, UNIX Network Programming, Vol 1: Sockets API, 3/e, Pearson',
        'Sameer Seth, M. Ajaykumar Venkatesulu, TCP/IP Architecture, Design, & Implementation in Linux, Wiley'
      ],
      pdfName: 'S5 CSE CN.pdf',
      color: 'var(--accent-red)'
    },
    {
      code: 'MAT203',
      title: 'Mathematics-3 (Discrete / Probability)',
      type: 'S3 Supply',
      examDate: 'Nov 24, 2026',
      credits: '4 Credits',
      evaluation: '60 ESE • 40 CIE Marks',
      textbooks: [
        'Devore J. L, Probability and Statistics for Engineering and the Sciences, 9th edition, Cengage Learning, 2016',
        'Sheldon M. Ross, Introduction to Probability Models, 13th edition, Academic Press, 2024'
      ],
      pdfName: 'S3 Mathematics.pdf',
      color: 'var(--accent-yellow)'
    },
    {
      code: 'PCCST502',
      title: 'Design and Analysis of Algorithms',
      type: 'S5 Theory',
      examDate: 'Nov 27, 2026',
      credits: '4 Credits',
      evaluation: '60 ESE • 40 CIE Marks',
      textbooks: [
        'T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 4th edition, PHI / MIT Press',
        'Ellis Horowitz, Sartaj Sahni, Sanguthevar Rajasekaran, Fundamentals of Computer Algorithms, Universities Press',
        'Sara Baase and Allen Van Gelder, Computer Algorithms - Introduction to Design & Analysis, Pearson Education'
      ],
      pdfName: 'S5 CSE DAA.pdf',
      color: 'var(--accent-peach)'
    },
    {
      code: 'PCCST303',
      title: 'Data Structures and Algorithms',
      type: 'S3 Supply',
      examDate: 'Nov 30, 2026',
      credits: '4 Credits',
      evaluation: '60 ESE • 40 CIE Marks',
      textbooks: [
        'Ellis Horowitz, Sartaj Sahni, Susan Anderson-Freed, Fundamentals of Data Structures in C, Universities Press',
        'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein, Introduction to Algorithms, PHI'
      ],
      pdfName: 'S3 CSE DSA.pdf',
      color: 'var(--accent-green)'
    },
    {
      code: 'CST307-T',
      title: 'Machine Learning',
      type: 'S5 Theory',
      examDate: 'Dec 01, 2026',
      credits: '4 Credits',
      evaluation: '60 ESE • 40 CIE Marks',
      textbooks: [
        'Ethem Alpaydin, Introduction to Machine Learning, 4th edition, MIT Press, 2020',
        'Mohammed J. Zaki, Wagner Meira, Data Mining and Analysis: Fundamental Concepts & Algorithms, Cambridge Univ Press',
        'Christopher Bishop, Neural Networks for Pattern Recognition, Oxford University Press, 1998'
      ],
      pdfName: 'S5 CSE ML.pdf',
      color: 'var(--accent-blue)'
    },
    {
      code: 'CST309',
      title: 'Microcontrollers & Embedded Systems',
      type: 'S5 Theory',
      examDate: 'Dec 04, 2026',
      credits: '4 Credits',
      evaluation: '60 ESE • 40 CIE Marks',
      textbooks: [
        'Joseph Yiu, The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors, 3rd edition, Newnes - Elsevier, 2014',
        'Carmine Noviello, Mastering STM32, 2nd edition, Leanpub, 2022'
      ],
      pdfName: 'S5 CSE MC.pdf',
      color: 'var(--accent-purple)'
    },
    {
      code: 'CST311',
      title: 'Data Analytics',
      type: 'S5 Theory',
      examDate: 'Dec 07, 2026',
      credits: '4 Credits',
      evaluation: '60 ESE • 40 CIE Marks',
      textbooks: [
        'Christian Heumann and Michael Schomaker, Introduction to Statistics and Data Analysis, 1st edition, Springer, 2016',
        'Jiawei Han and Micheline Kamber, Data Mining: Concepts and Techniques, 3rd edition, Elsevier, 2012'
      ],
      pdfName: 'S5 CSE DA.pdf',
      color: 'var(--accent-cyan)'
    },
    {
      code: 'HUT200',
      title: 'Engineering Economics & Ethics',
      type: 'S3 Supply',
      examDate: 'Dec 08, 2026',
      credits: '3 Credits',
      evaluation: '60 ESE • 40 CIE Marks',
      textbooks: [
        'Geetika, Piyali Ghosh and Chodhury, Managerial Economics, Tata McGraw Hill, 2015',
        'H. G. Thuesen, W. J. Fabrycky, Engineering Economy, PHI, 1966',
        'R. Paneerselvam, Engineering Economics, PHI, 2012'
      ],
      pdfName: 'S3 CSE EE.pdf',
      color: 'var(--accent-pink)'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. Header Banner */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.65rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0 }}>
              <BookOpen size={18} color="var(--accent-purple)" /> Official KTU Course Syllabi & Textbooks
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '0.2rem 0 0' }}>
              Official curriculum textbooks and evaluation standards across all 8 S5 Regular & S3 Supply examination courses.
            </p>
          </div>
          <span className="badge badge-optional mono">UPDATED: {lastUpdatedDisplay}</span>
        </div>

        {/* Exam Pattern Note */}
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: 'var(--bg-overlay)',
            borderRadius: '6px',
            borderLeft: '3px solid var(--accent-blue)',
            fontSize: '0.76rem',
            color: 'var(--text-muted)'
          }}
        >
          <strong style={{ color: 'var(--text-main)' }}>End Semester Examination (ESE) Pattern (60 Marks • 2.5 Hours):</strong>
          <ul style={{ margin: '0.35rem 0 0 1.15rem', padding: 0 }}>
            <li>
              <strong>Part A (24 Marks):</strong> 8 compulsory short-answer questions (2 questions per module, 3 marks each).
            </li>
            <li>
              <strong>Part B (36 Marks):</strong> 4 module sections (Modules 1 to 4). Each module contains 2 questions (9 marks each), answer any 1 question per module.
            </li>
          </ul>
        </div>
      </div>

      {/* 2. Standardized Uniform Reference Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1rem'
        }}
      >
        {references.map((ref) => (
          <div
            key={ref.code}
            className="card card-hover"
            style={{
              padding: '1.15rem',
              borderTop: `3px solid ${ref.color}`,
              backgroundColor: 'var(--bg-surface)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '320px'
            }}
          >
            {/* Top Meta Bar: Code & Type on Left, Credits Badge on Right */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.45rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span
                    className="badge badge-module mono"
                    style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.45rem' }}
                  >
                    {ref.code}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    {ref.type}
                  </span>
                </div>

                <span
                  className="badge mono"
                  style={{
                    fontSize: '0.66rem',
                    padding: '0.15rem 0.45rem',
                    backgroundColor: 'rgba(250, 204, 21, 0.1)',
                    color: 'var(--accent-yellow)',
                    border: '1px solid rgba(250, 204, 21, 0.25)',
                    fontWeight: 700,
                    flexShrink: 0
                  }}
                >
                  {ref.credits}
                </span>
              </div>

              {/* Title Block with Uniform Height */}
              <div style={{ minHeight: '2.5rem', marginBottom: '0.65rem' }}>
                <h4
                  style={{
                    margin: 0,
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    lineHeight: 1.3
                  }}
                  title={ref.title}
                >
                  {ref.title}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.2rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-peach)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Calendar size={11} /> {ref.examDate}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>•</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    {ref.evaluation}
                  </span>
                </div>
              </div>

              {/* Prescribed Textbooks Section */}
              <div
                style={{
                  padding: '0.65rem',
                  backgroundColor: 'var(--bg-overlay)',
                  borderRadius: '5px',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '0.75rem'
                }}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  Prescribed Textbooks:
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '1.1rem',
                    fontSize: '0.73rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.45
                  }}
                >
                  {ref.textbooks.map((b, i) => (
                    <li key={i} style={{ marginBottom: i === ref.textbooks.length - 1 ? 0 : '0.35rem' }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Footer: Clean PDF Link & Verified Badge */}
            <div
              style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '0.6rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: 'auto'
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                <FileText size={13} color="var(--accent-purple)" />
                <span className="mono">{ref.pdfName}</span>
              </span>

              <span
                className="badge badge-core mono"
                style={{
                  fontSize: '0.62rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  flexShrink: 0
                }}
              >
                <CheckCircle2 size={11} /> Verified KTU Syllabus
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
