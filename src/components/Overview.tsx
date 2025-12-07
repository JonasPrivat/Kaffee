import { Shot } from '../types';

type Props = {
  shots: Shot[];
  visibleShots: Shot[];
};

function sortByDate(shots: Shot[]) {
  return [...shots].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function Overview({ shots, visibleShots }: Props) {
  const total = shots.length;
  const inView = visibleShots.length;
  const latest = sortByDate(shots)[0];

  return (
    <section className="card p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <p className="text-sm uppercase tracking-wide text-stone-500">Übersicht</p>
        <h2 className="text-xl font-semibold">Aktuelle Sammlung</h2>
        <p className="text-stone-600 dark:text-stone-300">
          {inView > 0
            ? `${inView} Einträge im gewählten Zeitraum sichtbar`
            : 'Kein Eintrag im gewählten Zeitraum. Bitte Filter anpassen oder neuen Shot speichern.'}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 w-full md:w-auto">
        <div className="stat">
          <p className="stat-label">Gesamt</p>
          <p className="stat-value">{total}</p>
          <p className="stat-hint">Shots gespeichert</p>
        </div>
        <div className="stat">
          <p className="stat-label">Gefiltert</p>
          <p className="stat-value">{inView}</p>
          <p className="stat-hint">aktuell sichtbar</p>
        </div>
        <div className="stat col-span-2 md:col-span-1">
          <p className="stat-label">Zuletzt gespeichert</p>
          {latest ? (
            <div className="space-y-0.5">
              <p className="stat-value text-base">{latest.bean || 'Ohne Titel'}</p>
              <p className="stat-hint">{new Date(latest.date).toLocaleString('de-DE')}</p>
              <p className="stat-hint">{latest.machine || 'Unbekannte Maschine'}</p>
            </div>
          ) : (
            <p className="stat-hint">Noch kein Shot erfasst</p>
          )}
        </div>
      </div>
    </section>
  );
}
