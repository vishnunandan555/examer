import React, { useState } from 'react';
import { FolderTree, Download, Copy, Check, FileText } from 'lucide-react';
import { downloadCSV, copyToClipboard } from '../../utils/exportUtils';

export default function DatasetsView({
  appData,
  playlists,
  lastUpdatedDisplay
}) {
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    copyToClipboard(text, () => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  const datasets = [
    {
      name: 'Computer_Networks_Study_Portions.csv',
      path: 'data/processed/Computer_Networks_Study_Portions.csv',
      badge: '172 ROWS',
      accentColor: 'var(--accent-red)',
      desc: 'Curated study portions for S5 Computer Networks (PCCST501), classified into Modules 1 to 4 with core and optional badges.',
      rows: playlists.cn
    },
    {
      name: 'S5_DAA_Study_Portions.csv',
      path: 'data/processed/S5_DAA_Study_Portions.csv',
      badge: '164 ROWS',
      accentColor: 'var(--accent-peach)',
      desc: 'Standalone study playlist specifically for the S5 DAA Theory exam (Nov 27), including recurrences, AVL trees, and greedy/DP.',
      rows: playlists.daa.filter((v) => v.Status !== 'Removed')
    },
    {
      name: 'S3_DSA_Study_Portions.csv',
      path: 'data/processed/S3_DSA_Study_Portions.csv',
      badge: '163 ROWS',
      accentColor: 'var(--accent-green)',
      desc: 'Standalone study playlist specifically for S3 DSA Supply (Nov 30), focusing on Stacks, Queues, Trees, Heaps, and Sorting.',
      rows: playlists.dsa.filter((v) => v.Status !== 'Removed')
    },
    {
      name: 'Data_Structures_and_Algorithms_Study_Portions.csv',
      path: 'data/processed/Data_Structures_and_Algorithms_Study_Portions.csv',
      badge: '172 ROWS',
      accentColor: 'var(--accent-blue)',
      desc: 'Combined master study list for both S3 DSA and S5 DAA, classified by module, core/optional status, and YouTube links.',
      rows: playlists.dsaAll.filter((v) => v.Status !== 'Removed')
    },
    {
      name: 'Computer_Networks_Removed_Portions.csv',
      path: 'data/processed/Computer_Networks_Removed_Portions.csv',
      badge: '8 ROWS',
      accentColor: 'var(--accent-red)',
      desc: 'All eliminated CN videos (isolated GATE PYQ snippets, syllabus intro) with detailed reasons for removal.',
      rows: playlists.cn.filter((v) => v.Status === 'Removed')
    },
    {
      name: 'Data_Structures_and_Algorithms_Removed_Portions.csv',
      path: 'data/processed/Data_Structures_and_Algorithms_Removed_Portions.csv',
      badge: '28 ROWS',
      accentColor: 'var(--accent-peach)',
      desc: 'All eliminated DSA/DAA videos (excessive placement problems, LeetCode questions, multistage graphs) with reasons.',
      rows: playlists.dsaAll.filter((v) => v.Status === 'Removed')
    }
  ];

  return (
    <div>
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0 }}>
              <FolderTree size={18} color="var(--accent-blue)" /> Curated Datasets & Refined Directory
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '0.2rem 0 0' }}>
              All filtered CSV datasets have been systematically compiled with pedagogical classification, YouTube links, and KTU module mappings, organized into clean subdirectories:
            </p>
          </div>
          <span className="badge badge-optional mono">LAST UPDATED: {lastUpdatedDisplay}</span>
        </div>

        {/* Dataset Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '0.85rem' }}>
          {datasets.map((ds) => (
            <div
              key={ds.name}
              className="card"
              style={{
                padding: '0.9rem',
                borderLeft: `4px solid ${ds.accentColor}`,
                backgroundColor: 'var(--bg-overlay)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem', gap: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.82rem', wordBreak: 'break-all' }}>{ds.name}</span>
                <span className="badge badge-optional mono" style={{ fontSize: '0.62rem', flexShrink: 0 }}>{ds.badge}</span>
              </div>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.73rem', margin: '0 0 0.65rem', lineHeight: 1.4 }}>
                {ds.desc}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.45rem' }}>
                <code style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{ds.path}</code>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    onClick={() => handleCopy(ds.path, ds.name)}
                    title="Copy path"
                    style={{
                      background: 'none',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-dim)',
                      borderRadius: '3px',
                      padding: '0.15rem 0.35rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.68rem'
                    }}
                  >
                    {copiedKey === ds.name ? <Check size={11} color="var(--accent-green)" /> : <Copy size={11} />}
                  </button>
                  <button
                    onClick={() => downloadCSV(ds.name, ds.rows)}
                    title="Download CSV"
                    style={{
                      backgroundColor: 'var(--bg-active)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-main)',
                      borderRadius: '3px',
                      padding: '0.15rem 0.45rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.68rem',
                      fontWeight: 600
                    }}
                  >
                    <Download size={11} /> CSV
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Markdown Documentation Reference */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '0 0 0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FileText size={15} color="var(--accent-blue)" /> Comprehensive Study Plan Documentation
        </h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '0 0 0.75rem' }}>
          A complete markdown breakdown is available at <code>docs/SYLLABUS_ANALYSIS_AND_STUDY_PLAN.md</code> with full course syllabus descriptions, pedagogical filtering criteria, and day-by-day exam roadmaps.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-overlay)', padding: '0.55rem 0.85rem', borderRadius: '5px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.5rem' }}>
          <code style={{ fontSize: '0.78rem', color: 'var(--accent-blue)' }}>docs/SYLLABUS_ANALYSIS_AND_STUDY_PLAN.md</code>
          <button
            onClick={() => handleCopy('docs/SYLLABUS_ANALYSIS_AND_STUDY_PLAN.md', 'doc_plan')}
            style={{
              backgroundColor: 'var(--bg-active)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-main)',
              borderRadius: '4px',
              padding: '0.25rem 0.55rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.72rem'
            }}
          >
            {copiedKey === 'doc_plan' ? <Check size={12} color="var(--accent-green)" /> : <Copy size={12} />}
            <span>{copiedKey === 'doc_plan' ? 'Copied' : 'Copy Path'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
