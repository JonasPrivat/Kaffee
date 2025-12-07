import { useRef, useState } from 'react';
import type { Shot } from '../types';

type DatePreset = 'all' | 'today' | 'week' | 'month' | 'custom';

export interface DateRange {
  preset: DatePreset;
  from?: string;
  to?: string;
}

interface Props {
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
  onExportPdf: () => void;
  onExportJson: () => void;
  onImportJson: (file: File, mode: 'merge' | 'replace') => void;
  canExportPdf: boolean;
  canExportJson: boolean;
}

export function ExportPanel({ range, onRangeChange, onExportJson, onExportPdf, onImportJson, canExportJson, canExportPdf }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [mode, setMode] = useState<'merge' | 'replace'>('merge');

  const presets: { key: DatePreset; label: string }[] = [
    { key: 'today', label: 'Heute' },
    { key: 'week', label: 'Woche' },
    { key: 'month', label: 'Monat' },
    { key: 'all', label: 'Alles' }
  ];

  function triggerImport() {
    inputRef.current?.click();
  }

  return (
    <div className="card p-5 space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-stone-500">Export</p>
          <h3 className="text-lg font-semibold">PDF & Sicherungen</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
          Import-Modus:
          <select className="w-36" value={mode} onChange={(e) => setMode(e.target.value as 'merge' | 'replace')}>
            <option value="merge">Ergänzen</option>
            <option value="replace">Ersetzen</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.key}
            type="button"
            onClick={() => onRangeChange({ preset: preset.key })}
            className={`btn btn-secondary ${range.preset === preset.key ? 'ring-2 ring-accent/60' : ''}`}
          >
            {preset.label}
          </button>
        ))}
        <button
          className={`btn btn-secondary ${range.preset === 'custom' ? 'ring-2 ring-accent/60' : ''}`}
          type="button"
          onClick={() => onRangeChange({ preset: 'custom', from: range.from, to: range.to })}
        >
          Benutzerdefiniert
        </button>
        {range.preset === 'custom' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={range.from || ''}
              onChange={(e) => onRangeChange({ ...range, from: e.target.value })}
            />
            <span className="text-sm text-stone-500">bis</span>
            <input
              type="date"
              value={range.to || ''}
              onChange={(e) => onRangeChange({ ...range, to: e.target.value })}
            />
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          className="btn btn-primary"
          type="button"
          onClick={onExportPdf}
          disabled={!canExportPdf}
          title={canExportPdf ? 'PDF aus dem Zeitraum erstellen' : 'Keine Einträge im Zeitraum'}
        >
          PDF erzeugen
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={onExportJson}
          disabled={!canExportJson}
          title={canExportJson ? 'Alle Shots als JSON herunterladen' : 'Kein Datensatz vorhanden'}
        >
          Daten exportieren (JSON)
        </button>
        <button className="btn btn-secondary" type="button" onClick={triggerImport}>
          Daten importieren (JSON)
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onImportJson(file, mode);
              event.target.value = '';
            }
          }}
        />
      </div>
    </div>
  );
}
