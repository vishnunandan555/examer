import React from 'react';
import { Info, BookOpen } from 'lucide-react';

export default function SyllabusNotice({ activeTab, onOpenSyllabusModal }) {
  return (
    <div
      className="card"
      style={{
        padding: '0.65rem 0.95rem',
        marginBottom: '0.85rem',
        backgroundColor: 'var(--bg-overlay)',
        borderLeft: '3px solid var(--accent-blue)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '0.74rem',
        color: 'var(--text-muted)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
        <Info size={14} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
        <span>
          {activeTab === 'cn' && (
            <>
              <strong>KTU S5 CN Syllabus Verified:</strong> 6 restored high-yield topics (Hamming Code, Dijkstra, Congestion Control, UDP/TCP header fields) are restored to Core/Optional. For standalone SNMP, refer to Kurose & Ross (Ch 9) text notes.
            </>
          )}
          {activeTab === 'daa' && (
            <>
              <strong>KTU S5 DAA Syllabus Verified:</strong> Recurrences, AVL Trees, Disjoint Sets, Greedy (Knapsack, MST), Dynamic Programming (MCM, Floyd-Warshall), Branch & Bound (TSP), and P/NP classes are fully mapped.
            </>
          )}
          {activeTab === 'dsa' && (
            <>
              <strong>KTU S3 DSA Syllabus Verified:</strong> Linear & non-linear structures (Stacks, Queues, Linked Lists, Trees, Heaps) and all 6 core sorting algorithms are curated for immediate exam clearance.
            </>
          )}
        </span>
      </div>

      <button
        onClick={onOpenSyllabusModal}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--accent-blue)',
          fontSize: '0.72rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: 0
        }}
      >
        <BookOpen size={12} /> View Syllabus Details
      </button>
    </div>
  );
}
