import React, { useState } from 'react';
import { 
  Stethoscope, 
  Layers, 
  Image as ImageIcon, 
  Maximize2, 
  Zap, 
  Save,
  ChevronRight,
  ChevronDown,
  Info,
  Brain
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import DiagnosticCoPilot from '../ai/DiagnosticCoPilot';

const teeth = Array.from({ length: 32 }, (_, i) => i + 1);

const ClinicalModule: React.FC = () => {
  const [activeView, setActiveView] = useState<'chart' | 'imaging' | 'ai'>('chart');
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  const toothStatuses: Record<number, string> = {
    3: 'Cavity',
    8: 'Crown',
    14: 'Missing',
    19: 'Filling',
    30: 'Implant',
  };

  const getStatusColor = (id: number) => {
    const status = toothStatuses[id];
    switch (status) {
      case 'Cavity': return 'bg-red-500';
      case 'Crown': return 'bg-amber-500';
      case 'Missing': return 'bg-gray-300';
      case 'Filling': return 'bg-blue-500';
      case 'Implant': return 'bg-emerald-500';
      default: return 'bg-indigo-100 hover:bg-indigo-200';
    }
  };

  const images = [
    { id: 1, title: 'Panoramic OPG', date: '2024-03-15', type: 'X-Ray', url: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ea589c7d-893f-43eb-bb39-e5aab3e5dd47/dental-imaging-viewer-82b4dddd-1773966207792.webp' },
    { id: 2, title: 'Left Bitewing', date: '2024-03-15', type: 'Bitewing', url: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ea589c7d-893f-43eb-bb39-e5aab3e5dd47/dental-imaging-viewer-82b4dddd-1773966207792.webp' },
    { id: 3, title: 'Intraoral - Upper Right', date: '2024-01-10', type: 'Photo', url: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ea589c7d-893f-43eb-bb39-e5aab3e5dd47/dental-imaging-viewer-82b4dddd-1773966207792.webp' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinical Charting</h1>
          <p className="text-gray-500">Interactive odontogram and diagnostic imaging.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveView('chart')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-all",
              activeView === 'chart' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Odontogram
          </button>
          <button 
            onClick={() => setActiveView('imaging')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-all",
              activeView === 'imaging' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Imaging & DICOM
          </button>
          <button 
            onClick={() => setActiveView('ai')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2",
              activeView === 'ai' ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Brain className="w-4 h-4" /> Diagnostic AI
          </button>
        </div>
      </div>

      {activeView === 'chart' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Chart */}
          <Card className="lg:col-span-8">
            <CardContent className="p-8">
              <div className="space-y-12">
                {/* Upper Arch */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase text-center">Upper Arch (Maxilla)</p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {teeth.slice(0, 16).map((num) => (
                      <button
                        key={num}
                        onClick={() => setSelectedTooth(num)}
                        className={cn(
                          "w-10 h-14 rounded-md flex flex-col items-center justify-center transition-all border",
                          selectedTooth === num ? "border-indigo-600 ring-2 ring-indigo-100" : "border-transparent",
                          getStatusColor(num)
                        )}
                      >
                        <span className={cn(
                          "text-[10px] font-bold",
                          toothStatuses[num] ? "text-white" : "text-indigo-600"
                        )}>{num}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lower Arch */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase text-center">Lower Arch (Mandible)</p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {teeth.slice(16, 32).reverse().map((num) => (
                      <button
                        key={num}
                        onClick={() => setSelectedTooth(num)}
                        className={cn(
                          "w-10 h-14 rounded-md flex flex-col items-center justify-center transition-all border",
                          selectedTooth === num ? "border-indigo-600 ring-2 ring-indigo-100" : "border-transparent",
                          getStatusColor(num)
                        )}
                      >
                        <span className={cn(
                          "text-[10px] font-bold",
                          toothStatuses[num] ? "text-white" : "text-indigo-600"
                        )}>{num}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <img src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/ea589c7d-893f-43eb-bb39-e5aab3e5dd47/dental-odontogram-chart-127070d3-1773966207932.webp" alt="Odontogram" className="max-w-md w-full rounded-2xl border border-gray-100" />
                </div>
              </div>

              <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
                {['Healthy', 'Cavity', 'Crown', 'Missing', 'Filling', 'Implant'].map((status) => (
                  <div key={status} className="flex items-center gap-2 whitespace-nowrap">
                    <div className={cn("w-3 h-3 rounded-full", getStatusColor(status === 'Healthy' ? 100 : status === 'Cavity' ? 3 : status === 'Crown' ? 8 : status === 'Missing' ? 14 : status === 'Filling' ? 19 : 30))} />
                    <span className="text-xs text-gray-600">{status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tooth Details Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardContent className="p-6">
                {selectedTooth ? (
                  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">Tooth #{selectedTooth}</h3>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedTooth(null)}>Clear</Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Status</label>
                        <select className="w-full bg-gray-50 border-gray-200 rounded-lg text-sm p-2">
                          <option>Healthy</option>
                          <option selected={toothStatuses[selectedTooth] === 'Cavity'}>Cavity (Caries)</option>
                          <option selected={toothStatuses[selectedTooth] === 'Crown'}>Existing Crown</option>
                          <option selected={toothStatuses[selectedTooth] === 'Filling'}>Existing Filling</option>
                          <option selected={toothStatuses[selectedTooth] === 'Missing'}>Missing</option>
                          <option selected={toothStatuses[selectedTooth] === 'Implant'}>Implant</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Surfaces</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['M', 'O', 'D', 'B', 'L'].map(s => (
                            <Button key={s} variant="outline" size="sm" className="h-8 text-xs">{s}</Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Clinical Notes</label>
                        <textarea 
                          className="w-full bg-gray-50 border-gray-200 rounded-lg text-sm p-3 min-h-[100px]"
                          placeholder="Enter observations..."
                        />
                      </div>

                      <Button className="w-full bg-indigo-600 gap-2">
                        <Save className="w-4 h-4" /> Save Updates
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400 mx-auto">
                      <Info className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">No Tooth Selected</p>
                      <p className="text-xs text-gray-500 px-4">Select a tooth from the chart to view details and history.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-indigo-900 text-white overflow-hidden shadow-xl ring-4 ring-indigo-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold">Diagnostic Insight</h4>
                </div>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  AI detected structural irregularities in #3 and #14 bitewing radiographs.
                </p>
                <Button 
                  className="w-full mt-4 bg-white text-indigo-900 hover:bg-indigo-50 font-bold"
                  onClick={() => setActiveView('ai')}
                >
                  Run Full AI Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeView === 'imaging' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Imaging Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 px-1">Patient Gallery</h3>
            <div className="space-y-2">
              {images.map((img) => (
                <button
                  key={img.id}
                  className="w-full p-3 border border-gray-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                      <img src={img.url} alt="Thumb" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{img.title}</p>
                      <p className="text-[10px] text-gray-500">{img.date} \\u2022 {img.type}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500" />
                  </div>
                </button>
              ))}
            </div>
            <Button variant="outline" className="w-full border-dashed border-gray-300 gap-2 h-12">
              <Layers className="w-4 h-4" /> Upload DICOM
            </Button>
          </div>

          {/* Main Viewer */}
          <Card className="lg:col-span-9 overflow-hidden bg-black shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium">DICOM Viewer - Panoramic OPG</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white"><Maximize2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white"><Save className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="relative aspect-video flex items-center justify-center bg-[#0a0a0a]">
              <img 
                src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/ea589c7d-893f-43eb-bb39-e5aab3e5dd47/dental-imaging-viewer-82b4dddd-1773966207792.webp" 
                alt="DICOM Viewer" 
                className="max-w-full h-full object-contain"
              />
              
              {/* Toolbar */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center gap-6">
                {['Brightness', 'Contrast', 'Invert', 'Measure', 'Zoom'].map(tool => (
                  <button key={tool} className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-wider">
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeView === 'ai' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <DiagnosticCoPilot />
          <div className="mt-6 flex justify-center">
            <Button variant="ghost" onClick={() => setActiveView('chart')} className="text-gray-500 text-xs font-bold uppercase">
              Return to Clinical Chart
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ClinicalModule;