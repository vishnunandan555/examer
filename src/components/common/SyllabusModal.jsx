import React from 'react';
import { BookOpen, FileText } from 'lucide-react';

export default function SyllabusModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.5rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.8)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <BookOpen size={16} color="var(--accent-purple)" /> KTU Course Syllabi & Pedagogical Structure
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '0.2rem'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.8rem' }}>
          {/* CN Syllabus */}
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-overlay)', borderRadius: '6px', borderLeft: '3px solid var(--accent-red)' }}>
            <h4 style={{ margin: '0 0 0.35rem', color: 'var(--accent-red)', fontSize: '0.9rem' }}>
              Computer Networks (PCCST501) • KTU S5 CSE
            </h4>
            <p style={{ margin: '0 0 0.4rem', color: 'var(--text-muted)' }}>
              <strong>Modules:</strong> Module 1 (Layering, Physical, Framing, Flow Control), Module 2 (Sliding Window, MAC, CSMA/CD, Ethernet, Bridges), Module 3 (Network Layer, Routing, Distance Vector, Link State, Subnetting, IPv4/IPv6), Module 4 (Transport & Application: TCP/UDP, Flow/Congestion Control, DNS, HTTP, SMTP, SNMP).
            </p>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Source Syllabus: <code style={{ color: 'var(--text-main)' }}>docs/syllabus/S5 CSE CN.pdf</code>
            </span>
          </div>

          {/* DAA Syllabus */}
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-overlay)', borderRadius: '6px', borderLeft: '3px solid var(--accent-peach)' }}>
            <h4 style={{ margin: '0 0 0.35rem', color: 'var(--accent-peach)', fontSize: '0.9rem' }}>
              Design and Analysis of Algorithms (PCCST502) • KTU S5 CSE
            </h4>
            <p style={{ margin: '0 0 0.4rem', color: 'var(--text-muted)' }}>
              <strong>Modules:</strong> Module 1 (Asymptotic Notations, Recurrences, Substitution, Master Theorem, AVL Trees), Module 2 (Disjoint Sets, Graph Traversals BFS/DFS, Divide & Conquer), Module 3 (Greedy Approach: Knapsack, MST Kruskal/Prim, Dijkstra; Dynamic Programming: Matrix Chain, Floyd-Warshall), Module 4 (Backtracking & Branch/Bound: N-Queens, TSP; Complexity: P, NP, NP-Complete).
            </p>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Source Syllabus: <code style={{ color: 'var(--text-main)' }}>docs/syllabus/S5 CSE DAA.pdf</code>
            </span>
          </div>

          {/* S3 DSA Syllabus */}
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-overlay)', borderRadius: '6px', borderLeft: '3px solid var(--accent-green)' }}>
            <h4 style={{ margin: '0 0 0.35rem', color: 'var(--accent-green)', fontSize: '0.9rem' }}>
              Data Structures and Algorithms (PCCST303) • KTU S3 CSE Supply
            </h4>
            <p style={{ margin: '0 0 0.4rem', color: 'var(--text-muted)' }}>
              <strong>Modules:</strong> Module 1 (Arrays, Stacks, Infix/Postfix Evaluation, Queues, Circular/Priority Queues), Module 2 (Singly/Doubly/Circular Linked Lists, Memory Allocation), Module 3 (Trees, Binary Trees, Traversals, BST, Binary Heaps), Module 4 (Sorting: Selection, Insertion, Bubble, Merge, Quick, Heap, Radix; Searching & Hash Tables).
            </p>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Source Syllabus: <code style={{ color: 'var(--text-main)' }}>docs/syllabus/S3 CSE DSA.pdf</code>
            </span>
          </div>

          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-active)', borderRadius: '6px' }}>
            <h5 style={{ margin: '0 0 0.25rem', fontSize: '0.78rem', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <FileText size={13} /> Pedagogical Analysis & Action Plan
            </h5>
            <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Full course alignment breakdown and syllabus gap report is documented at <code style={{ color: 'var(--text-main)' }}>docs/SYLLABUS_ANALYSIS_AND_STUDY_PLAN.md</code>.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--bg-active)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-main)',
              padding: '0.4rem 0.85rem',
              borderRadius: '5px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
