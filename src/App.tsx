import { useEffect, useMemo, useState } from 'react';
import { FilterBar } from './components/FilterBar';
import { ExportPanel, type DateRange } from './components/ExportPanel';
import { ShotForm } from './components/ShotForm';
import { ShotList } from './components/ShotList';
import { Overview } from './components/Overview';
import { useLocalStorage } from './hooks';
import { Shot, ShotImportFile } from './types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function buildDateRange(range: DateRange): { from?: Date; to?: Date } {
  const now = new Date();
  switch (range.preset) {
    case 'today': {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return { from: start, to: end };
    }
    case 'week': {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      end.setHours(23, 59, 59, 999);
      return { from: start, to: end };
    }
    case 'month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return { from: start, to: end };
    }
    case 'custom': {
      const from = range.from ? new Date(range.from) : undefined;
      const to = range.to ? new Date(range.to) : undefined;
      if (to) {
        to.setHours(23, 59, 59, 999);
      }
      return { from, to };
    }
    default:
      return {};
  }
}

function filterByRange(shots: Shot[], range: DateRange) {
  const { from, to } = buildDateRange(range);
  return shots.filter((shot) => {
    const shotDate = new Date(shot.date);
    if (from && shotDate < from) return false;
    if (to && shotDate > to) return false;
    return true;
  });
}

function download(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportJson(shots: Shot[]) {
  const payload: ShotImportFile = {
    version: 1,
    shots
  };
  download(JSON.stringify(payload, null, 2), 'espresso-shots.json', 'application/json');
}

function exportPdf(shots: Shot[], range: DateRange) {
  const doc = new jsPDF();
  const { from, to } = buildDateRange(range);
  const headline = 'Espresso Shots';
  const subtitle = range.preset === 'all'
    ? 'Alle Einträge'
    : `Zeitraum: ${from ? from.toLocaleDateString('de-DE') : '—'} bis ${to ? to.toLocaleDateString('de-DE') : '—'}`;

  doc.setFontSize(18);
  doc.text(headline, 14, 18);
  doc.setFontSize(12);
  doc.text(subtitle, 14, 26);

  autoTable(doc, {
    startY: 32,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [249, 115, 22] },
    head: [['Datum', 'Kaffee', 'Rösterei', 'Dose (g)', 'Zeit (s)', 'Output', 'Temp', 'Maschine', 'Notes']],
    body: shots.map((shot) => [
      new Date(shot.date).toLocaleString('de-DE'),
      shot.bean,
      shot.roastery || '—',
      `${shot.dose}`,
      `${shot.brewTime}`,
      `${shot.output}`,
      `${shot.temperature}°C`,
      shot.machine,
      `${shot.tastingNotes}`
    ])
  });

  doc.save('espresso-shots.pdf');
}

function useDarkMode() {
  const [enabled, setEnabled] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', enabled);
  }, [enabled]);

  return { enabled, toggle: () => setEnabled((prev) => !prev) } as const;
}

export default function App() {
  const [shots, setShots] = useLocalStorage<Shot[]>('espresso-shots', []);
  const [editing, setEditing] = useState<Shot | null>(null);
  const [search, setSearch] = useState('');
  const [machineFilter, setMachineFilter] = useState('');
  const [sort, setSort] = useState<'desc' | 'asc'>('desc');
  const [range, setRange] = useState<DateRange>({ preset: 'all' });
  const { enabled: darkMode, toggle: toggleDarkMode } = useDarkMode();

  const machines = useMemo(() => {
    const defaults = ['La Marzocco', 'Gaggia Classic', 'Breville', 'Rocket Appartamento'];
    const unique = new Set<string>([...defaults, ...shots.map((shot) => shot.machine)].filter(Boolean));
    return Array.from(unique);
  }, [shots]);

  const filteredShots = useMemo(() => {
    return shots
      .filter((shot) => {
        const term = search.toLowerCase();
        const haystack = `${shot.bean} ${shot.roastery ?? ''}`.toLowerCase();
        const matchesSearch = haystack.includes(term);
        const matchesMachine = machineFilter ? shot.machine === machineFilter : true;
        return matchesSearch && matchesMachine;
      })
      .sort((a, b) => (sort === 'desc' ? +new Date(b.date) - +new Date(a.date) : +new Date(a.date) - +new Date(b.date)));
  }, [machineFilter, search, shots, sort]);

  const displayShots = useMemo(() => filterByRange(filteredShots, range), [filteredShots, range]);

  const hasShotsInView = displayShots.length > 0;

  function handleSave(shot: Shot) {
    setShots((prev) => {
      const exists = prev.find((entry) => entry.id === shot.id);
      if (exists) {
        return prev.map((entry) => (entry.id === shot.id ? shot : entry));
      }
      return [shot, ...prev];
    });
    setEditing(null);
  }

  function handleDelete(id: string) {
    setShots((prev) => prev.filter((shot) => shot.id !== id));
  }

  async function handleImport(file: File, mode: 'merge' | 'replace') {
    const text = await file.text();
    try {
      const data = JSON.parse(text) as ShotImportFile;
      if (data.version !== 1 || !Array.isArray(data.shots)) {
        throw new Error('Ungültiges Format');
      }
      const merged = mode === 'replace' ? data.shots : [...shots, ...data.shots];
      const normalized = merged.map((shot) => ({
        ...shot,
        id: shot.id || crypto.randomUUID()
      }));
      setShots(normalized);
    } catch (error) {
      alert('Import fehlgeschlagen. Bitte gültige JSON-Datei verwenden.');
      console.error(error);
    }
  }

  function handleExportPdf() {
    if (!hasShotsInView) {
      alert('Keine Shots im gewählten Zeitraum. Bitte Filter anpassen.');
      return;
    }
    exportPdf(displayShots, range);
  }

  function handleExportJson() {
    if (!shots.length) {
      alert('Keine Shots zum Exportieren vorhanden.');
      return;
    }
    exportJson(shots);
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-stone-500">Espresso Diary</p>
          <h1 className="text-3xl font-bold">Minimalistisches Espresso-Tagebuch</h1>
          <p className="text-stone-600 dark:text-stone-300 mt-2">
            Erfasse Shots, vergleiche Extraktionen und exportiere Daten als PDF oder JSON.
          </p>
        </div>
        <button className="btn btn-secondary" type="button" onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      <ShotForm onSave={handleSave} editing={editing} machines={machines} onCancelEdit={() => setEditing(null)} />
      <Overview shots={shots} visibleShots={displayShots} />
      <FilterBar
        search={search}
        onSearch={setSearch}
        machine={machineFilter}
        onMachineChange={setMachineFilter}
        sort={sort}
        onSortChange={setSort}
        machineOptions={machines}
      />
      <ExportPanel
        range={range}
        onRangeChange={setRange}
        onExportPdf={handleExportPdf}
        onExportJson={handleExportJson}
        onImportJson={handleImport}
        canExportPdf={hasShotsInView}
        canExportJson={shots.length > 0}
      />
      <ShotList shots={displayShots} onDelete={handleDelete} onEdit={setEditing} />
    </main>
  );
}
