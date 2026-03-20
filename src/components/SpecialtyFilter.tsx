import React from 'react';
import { SpecialtyCode } from './history/types';
import { SPECIALTIES } from './history/mockData';
import { cn } from '../lib/utils';
import { 
  Stethoscope, 
  Activity, 
  Smile, 
  Scissors, 
  Baby, 
  Pill, 
  ShieldCheck,
  Grid
} from 'lucide-react';

const specialtyIcons: Record<SpecialtyCode, React.ReactNode> = {
  ORTHO: <Smile className="w-4 h-4" />,
  ENDO: <Activity className="w-4 h-4" />,
  PROSTHO: <ShieldCheck className="w-4 h-4" />,
  PERIO: <Stethoscope className="w-4 h-4" />,
  OS: <Scissors className="w-4 h-4" />,
  PEDO: <Baby className="w-4 h-4" />,
  OM: <Pill className="w-4 h-4" />,
  GEN: <Grid className="w-4 h-4" />,
};

interface SpecialtyFilterProps {
  selectedId: string | 'all';
  onSelect: (id: string | 'all') => void;
}

export const SpecialtyFilter: React.FC<SpecialtyFilterProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onSelect('all')}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 border",
          selectedId === 'all' 
            ? "bg-primary text-primary-foreground border-primary" 
            : "bg-background text-muted-foreground border-input hover:border-primary/50"
        )}
      >
        All Procedures
      </button>
      {SPECIALTIES.map((spec) => (
        <button
          key={spec.id}
          onClick={() => onSelect(spec.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 border",
            selectedId === spec.id 
              ? "bg-primary text-primary-foreground border-primary" 
              : "bg-background text-muted-foreground border-input hover:border-primary/50"
          )}
        >
          {specialtyIcons[spec.code]}
          {spec.name}
        </button>
      ))}
    </div>
  );
};

export const getSpecialtyIcon = (code: SpecialtyCode) => specialtyIcons[code] || <Grid className="w-4 h-4" />;