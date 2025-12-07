import { useEffect, useMemo, useState } from 'react';
import type { BasketSize, Shot } from '../types';

type Props = {
  onSave: (shot: Shot) => void;
  onCancelEdit: () => void;
  machines: string[];
  editing?: Shot | null;
};

const basketOptions: { label: string; value: BasketSize }[] = [
  { label: '1er', value: '1er' },
  { label: '2er', value: '2er' }
];

const tastingTagOptions = ['süß', 'säurebetont', 'schokoladig', 'bitter', 'nussig', 'balanciert'];

function parseTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

const emptyShot: Shot = {
  id: '',
  date: new Date().toISOString(),
  bean: '',
  roastery: '',
  dose: 18,
  grindSize: '',
  tamp: '',
  brewTime: 28,
  output: 36,
  temperature: 93,
  machine: '',
  basket: '2er',
  tastingNotes: '',
  tastingTags: [],
  expectedProfile: ''
};

export function ShotForm({ onSave, editing, machines, onCancelEdit }: Props) {
  const [shot, setShot] = useState<Shot>(emptyShot);
  const [customMachine, setCustomMachine] = useState('');

  useEffect(() => {
    if (editing) {
      setShot(editing);
      setCustomMachine('');
    } else {
      setShot({ ...emptyShot, id: '', date: new Date().toISOString() });
      setCustomMachine('');
    }
  }, [editing]);

  const machineOptions = useMemo(() => {
    const combined = new Set([...(machines || []), customMachine].filter(Boolean));
    return Array.from(combined);
  }, [machines, customMachine]);

  function updateField<K extends keyof Shot>(key: K, value: Shot[K]) {
    setShot((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const id = shot.id || crypto.randomUUID();
    const machineValue = customMachine || shot.machine || machineOptions[0] || 'Unbekannt';
    onSave({ ...shot, id, machine: machineValue, tastingTags: parseTags(shot.tastingTags.join(',')) });
    setShot({ ...emptyShot, id: '', date: new Date().toISOString(), machine: machineValue });
    setCustomMachine('');
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-stone-500">Neuer Shot</p>
          <h2 className="text-xl font-semibold">Shot erfassen</h2>
        </div>
        {editing && (
          <button className="btn btn-secondary" type="button" onClick={onCancelEdit}>
            Neu anlegen
          </button>
        )}
      </div>
      <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="date">Datum / Uhrzeit</label>
          <input
            id="date"
            type="datetime-local"
            value={new Date(shot.date).toISOString().slice(0, 16)}
            onChange={(e) => updateField('date', new Date(e.target.value).toISOString())}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="bean">Kaffeesorte / Blend</label>
          <input
            id="bean"
            value={shot.bean}
            onChange={(e) => updateField('bean', e.target.value)}
            placeholder="z. B. Ethiopia Guji"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="roastery">Rösterei (optional)</label>
          <input id="roastery" value={shot.roastery || ''} onChange={(e) => updateField('roastery', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="dose">Gramm Kaffee</label>
            <input
              id="dose"
              type="number"
              min={0}
              step={0.1}
              value={shot.dose}
              onChange={(e) => updateField('dose', Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="grind">Mahlgrad</label>
            <input id="grind" value={shot.grindSize} onChange={(e) => updateField('grindSize', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="tamp">Tamp (1–10 oder Freitext)</label>
            <input id="tamp" value={shot.tamp || ''} onChange={(e) => updateField('tamp', e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="basket">Korbgröße</label>
            <div className="flex gap-3">
              {basketOptions.map((option) => (
                <label key={option.value} className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="radio"
                    name="basket"
                    value={option.value}
                    checked={shot.basket === option.value}
                    onChange={(e) => updateField('basket', e.target.value as BasketSize)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="brewTime">Bezugszeit (Sekunden)</label>
            <input
              id="brewTime"
              type="number"
              min={0}
              step={0.1}
              value={shot.brewTime}
              onChange={(e) => updateField('brewTime', Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="output">Output (ml oder g)</label>
            <input
              id="output"
              type="number"
              min={0}
              step={0.1}
              value={shot.output}
              onChange={(e) => updateField('output', Number(e.target.value))}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="temp">Wassertemperatur (°C)</label>
            <input
              id="temp"
              type="number"
              min={80}
              max={100}
              value={shot.temperature}
              onChange={(e) => updateField('temperature', Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="machine">Maschine</label>
            <select
              id="machine"
              value={shot.machine}
              onChange={(e) => updateField('machine', e.target.value)}
              className="w-full"
            >
              <option value="">Auswählen…</option>
              {machineOptions.map((machine) => (
                <option key={machine} value={machine}>
                  {machine}
                </option>
              ))}
            </select>
            <input
              className="mt-2"
              placeholder="Eigene Maschine hinzufügen"
              value={customMachine}
              onChange={(e) => setCustomMachine(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="expected">Erwartetes Geschmacksprofil</label>
          <textarea
            id="expected"
            rows={2}
            value={shot.expectedProfile}
            onChange={(e) => updateField('expectedProfile', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="tasting">Geschmacksprofil (wahrgenommen)</label>
          <textarea
            id="tasting"
            rows={2}
            value={shot.tastingNotes}
            onChange={(e) => updateField('tastingNotes', e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {tastingTagOptions.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`badge ${shot.tastingTags.includes(tag) ? 'bg-accent text-white' : ''}`}
                onClick={() =>
                  updateField(
                    'tastingTags',
                    shot.tastingTags.includes(tag)
                      ? shot.tastingTags.filter((t) => t !== tag)
                      : [...shot.tastingTags, tag]
                  )
                }
              >
                {tag}
              </button>
            ))}
          </div>
          <input
            className="mt-2"
            placeholder="Eigene Tags, kommasepariert"
            value={shot.tastingTags.filter((tag) => !tastingTagOptions.includes(tag)).join(', ')}
            onChange={(e) => updateField('tastingTags', [...shot.tastingTags.filter((tag) => tastingTagOptions.includes(tag)), ...parseTags(e.target.value)])}
          />
        </div>
        <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
          {editing && (
            <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
              Abbrechen
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {editing ? 'Shot aktualisieren' : 'Shot speichern'}
          </button>
        </div>
      </form>
    </div>
  );
}
