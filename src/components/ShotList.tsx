import { Shot } from '../types';

interface Props {
  shots: Shot[];
  onEdit: (shot: Shot) => void;
  onDelete: (id: string) => void;
}

export function ShotList({ shots, onDelete, onEdit }: Props) {
  if (shots.length === 0) {
    return (
      <div className="card p-6 text-center text-stone-500">
        Noch keine Shots erfasst. Füge deinen ersten Shot über das Formular hinzu.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {shots.map((shot) => (
        <article key={shot.id} className="card p-5 space-y-4">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-500">{new Date(shot.date).toLocaleString('de-DE')}</p>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-white">{shot.bean}</h3>
              {shot.roastery && <p className="text-sm text-stone-500">{shot.roastery}</p>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <button className="btn btn-secondary" onClick={() => onEdit(shot)}>
                Bearbeiten
              </button>
              <button className="btn text-red-600 hover:bg-red-50 dark:hover:bg-red-950" onClick={() => onDelete(shot.id)}>
                Löschen
              </button>
            </div>
          </header>
          <div className="grid grid-cols-2 gap-3 text-sm text-stone-700 dark:text-stone-200">
            <div>
              <p className="font-medium">Gramm</p>
              <p>{shot.dose} g</p>
            </div>
            <div>
              <p className="font-medium">Mahlgrad</p>
              <p>{shot.grindSize || '—'}</p>
            </div>
            <div>
              <p className="font-medium">Zeit</p>
              <p>{shot.brewTime} s</p>
            </div>
            <div>
              <p className="font-medium">Output</p>
              <p>{shot.output} ml</p>
            </div>
            <div>
              <p className="font-medium">Temp.</p>
              <p>{shot.temperature} °C</p>
            </div>
            <div>
              <p className="font-medium">Korb</p>
              <p>{shot.basket}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-stone-600 dark:text-stone-300">
            <span className="badge">Maschine: {shot.machine}</span>
            {shot.tamp && <span className="badge">Tamp: {shot.tamp}</span>}
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <p className="font-medium text-stone-800 dark:text-stone-100">Erwartet</p>
              <p className="text-stone-600 dark:text-stone-300">{shot.expectedProfile || '–'}</p>
            </div>
            <div>
              <p className="font-medium text-stone-800 dark:text-stone-100">Wahrgenommen</p>
              <p className="text-stone-600 dark:text-stone-300">{shot.tastingNotes || '–'}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {shot.tastingTags.map((tag) => (
                  <span className="badge" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
