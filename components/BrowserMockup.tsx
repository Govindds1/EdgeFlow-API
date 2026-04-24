'use client';

import { useEffect, useState } from 'react';
import { Play, AlertCircle, CheckCircle, XCircle, Maximize2, Minimize2 } from 'lucide-react';

type ActiveTab = 'Dashboard' | 'API Tester' | 'History' | 'Settings';

export default function BrowserMockup() {
  const [input, setInput] = useState('[\n  "A->B", \n  "A->C", \n  "B->D", \n  "C->E", \n  "E->F", \n  "X->Y", \n  "Y->Z", \n  "Z->X", \n  "G->H", \n  "G->H", \n  "hello"\n]');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('Dashboard');
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!isMaximized) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('gp-dashboard-maximized');
    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.classList.remove('gp-dashboard-maximized');
    };
  }, [isMaximized]);

  const hierarchies = Array.isArray(results?.hierarchies) ? results.hierarchies : [];

  const handleProcess = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      // Validate input is proper JSON
      const parsedData = JSON.parse(input);
      
      if (!Array.isArray(parsedData)) {
        throw new Error('Input must be a JSON array');
      }

      const res = await fetch('/api/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: parsedData }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'API Processing Failed');
      }

      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON format. Please ensure it is a valid string array.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={
          isMaximized
            ? 'fixed inset-0 z-50 w-screen h-screen'
            : 'relative w-full max-w-4xl'
        }
      >
        {/* macOS Window Container */}
        <div
          className={
            isMaximized
              ? 'h-full w-full rounded-none border border-gray-300 bg-gray-900 shadow-none'
              : 'rounded-lg border border-gray-300 bg-gray-900 shadow-2xl'
          }
          style={
            isMaximized ? undefined : { boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }
          }
        >
        {/* Top Bar */}
        <div className="relative flex items-center bg-gray-800 px-4 py-3 border-b border-gray-700">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>

          <span className="absolute left-1/2 -translate-x-1/2 text-xs text-gray-400">
            GraphProcessor — Dashboard
          </span>

          <button
            type="button"
            onClick={() => setIsMaximized((v) => !v)}
            className="ml-auto h-8 w-8 inline-flex items-center justify-center rounded bg-gray-900 text-gray-300 border border-gray-700 hover:bg-gray-800 hover:text-white transition relative z-[1001]"
            aria-label={isMaximized ? 'Minimize dashboard' : 'Maximize dashboard'}
            title={isMaximized ? 'Minimize' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>

        {/* Dashboard Content */}
        <div
          className={
            isMaximized
              ? 'flex h-[calc(100vh-3rem)] overflow-hidden bg-gray-950'
              : 'flex h-[32rem] overflow-hidden bg-gray-950'
          }
        >
          {/* Sidebar */}
          <div className="w-48 border-r border-gray-800 bg-gray-900 p-4">
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Menu
              </h3>
              <div className="space-y-2">
                {(['Dashboard', 'API Tester', 'History', 'Settings'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActiveTab(item)}
                    className={
                      item === activeTab
                        ? 'w-full text-left rounded px-3 py-2 text-sm text-white bg-gray-800 border border-gray-700 transition'
                        : 'w-full text-left rounded px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 cursor-pointer transition'
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          {activeTab === 'History' || activeTab === 'Settings' ? (
            <div className="flex flex-1 items-center justify-center bg-gray-950">
              <div className="text-center px-10">
                <div className="text-sm font-semibold text-white">
                  {activeTab} — Under Construction
                </div>
                <div className="mt-2 text-xs text-gray-500 max-w-sm">
                  This section is coming soon. For now, use the API processor in Dashboard / API Tester.
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 overflow-hidden">
              {/* Left Column - Input */}
              <div className="w-1/2 border-r border-gray-800 overflow-y-auto p-6 flex flex-col">
                <h2 className="mb-4 text-sm font-semibold text-white">Input</h2>
                <label className="block mb-3 text-xs text-gray-400">JSON Graph Array</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full flex-1 min-h-[200px] rounded bg-gray-800 p-3 font-mono text-xs text-gray-200 border border-gray-700 placeholder-gray-600 focus:outline-none focus:border-blue-500"
                  spellCheck="false"
                />
                
                {error && (
                  <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-xs">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleProcess}
                  disabled={loading}
                  className="mt-4 w-full flex items-center justify-center gap-2 rounded bg-black px-4 py-3 text-sm font-medium text-white hover:bg-gray-900 transition disabled:opacity-50"
                >
                  <Play className="h-4 w-4" />
                  {loading ? 'Processing...' : 'Process Nodes'}
                </button>
              </div>

              {/* Right Column - Output */}
              <div className="w-1/2 overflow-y-auto p-6 bg-gray-950">
                <h2 className="mb-4 text-sm font-semibold text-white">Output</h2>

                {!results ? (
                  <div className="flex items-center justify-center h-48 text-gray-500">
                    <p className="text-xs">Results will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="rounded bg-gray-800 p-4 border border-gray-700">
                      <h3 className="mb-3 text-xs font-semibold text-white uppercase">Summary</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="text-2xl font-bold text-white">{results.summary.total_trees}</div>
                          <div className="text-xs text-gray-500">Total Trees</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">{results.summary.total_cycles}</div>
                          <div className="text-xs text-gray-500">Total Cycles</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">{results.summary.largest_tree_root || '-'}</div>
                          <div className="text-xs text-gray-500">Largest Root</div>
                        </div>
                      </div>
                    </div>

                    {/* Hierarchies */}
                    <div className="rounded bg-gray-800 p-4 border border-gray-700">
                      <h3 className="mb-3 text-xs font-semibold text-white uppercase">Hierarchies</h3>
                      <div className="space-y-3">
                        {hierarchies.map((h: any, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-gray-300 border-b border-gray-700 pb-3 last:border-0 last:pb-0">
                            <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                            <div className="w-full overflow-hidden">
                              <div className="font-medium text-white mb-1">
                                Root: {h.root} {h.has_cycle ? <span className="text-yellow-500 ml-2">(Cycle Detected)</span> : <span className="text-blue-400 ml-2">(Depth: {h.depth})</span>}
                              </div>
                              <div className="bg-gray-900 p-2 rounded overflow-x-auto">
                                <pre className="text-[10px] text-gray-400">
                                  {JSON.stringify(h.tree, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Duplicate Edges */}
                    <div className="rounded bg-gray-800 p-4 border border-gray-700">
                      <h3 className="mb-3 text-xs font-semibold text-white uppercase">Duplicate Edges</h3>
                      {results?.duplicate_edges?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {results?.duplicate_edges?.map((edge: string, i: number) => (
                            <span key={i} className="flex items-center gap-1 bg-yellow-900/30 text-yellow-500 px-2 py-1 rounded text-xs border border-yellow-700/50">
                              <AlertCircle className="h-3 w-3" />
                              {edge}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">No duplicate edges found</p>
                      )}
                    </div>

                    {/* Invalid Entries */}
                    <div className="rounded bg-gray-800 p-4 border border-gray-700">
                      <h3 className="mb-3 text-xs font-semibold text-white uppercase">Invalid Entries</h3>
                      {results?.invalid_entries?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {results?.invalid_entries?.map((entry: string, i: number) => (
                            <span key={i} className="flex items-center gap-1 bg-red-900/30 text-red-400 px-2 py-1 rounded text-xs border border-red-700/50">
                              <XCircle className="h-3 w-3" />
                              {entry}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">No invalid entries found</p>
                      )}
                    </div>

                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  );
}