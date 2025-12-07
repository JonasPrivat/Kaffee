interface Props {
  search: string;
  onSearch: (value: string) => void;
  machine: string;
  onMachineChange: (value: string) => void;
  sort: 'desc' | 'asc';
  onSortChange: (value: 'desc' | 'asc') => void;
  machineOptions: string[];
}

export function FilterBar({ search, onSearch, machine, onMachineChange, sort, onSortChange, machineOptions }: Props) {
  return (
    <div className="card p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-3">
        <input
          className="w-64"
          placeholder="Suche nach Sorte oder Rösterei"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        <select className="w-48" value={machine} onChange={(e) => onMachineChange(e.target.value)}>
          <option value="">Alle Maschinen</option>
          {machineOptions.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-stone-600 dark:text-stone-300">Sortierung</span>
        <button
          className="btn btn-secondary"
          onClick={() => onSortChange(sort === 'desc' ? 'asc' : 'desc')}
          type="button"
        >
          {sort === 'desc' ? 'Neueste zuerst' : 'Älteste zuerst'}
        </button>
      </div>
    </div>
  );
}
