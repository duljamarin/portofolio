// Geometry for polyline paths: cumulative length, point at a distance,
// distance of a point on the path, and the gaps a path leaves between boxes.
// All lengths are Euclidean per segment, which equals the Manhattan length for
// the axis-aligned paths used in the "How I build" diagram.

export type Pt = { x: number; y: number };
export type Rect = { x: number; y: number; w: number; h: number };
export type Run = { start: number; end: number };

const EPS = 1e-6;

export type Path = {
  points: Pt[];
  /** lengthTo[i] = path length from points[0] to points[i] */
  lengthTo: number[];
  total: number;
};

const segLen = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);

export function buildPath(points: Pt[]): Path {
  const lengthTo = [0];
  for (let i = 1; i < points.length; i++) lengthTo.push(lengthTo[i - 1] + segLen(points[i - 1], points[i]));
  return { points, lengthTo, total: lengthTo[lengthTo.length - 1] };
}

export function pointAt(path: Path, d: number): Pt {
  const { points, lengthTo, total } = path;
  const dist = Math.max(0, Math.min(total, d));
  for (let i = 1; i < points.length; i++) {
    if (dist <= lengthTo[i] + EPS) {
      const len = lengthTo[i] - lengthTo[i - 1];
      const t = len > 0 ? (dist - lengthTo[i - 1]) / len : 0;
      const a = points[i - 1];
      const b = points[i];
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
  }
  return points[points.length - 1];
}

/** Distance along the path to the first place it passes through `p`. */
export function distanceTo(path: Path, p: Pt): number {
  const { points, lengthTo } = path;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const len = lengthTo[i] - lengthTo[i - 1];
    const cross = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
    if (Math.abs(cross) > EPS * Math.max(1, len)) continue;
    const t = len > 0 ? ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / (len * len) : 0;
    if (t >= -EPS && t <= 1 + EPS) return lengthTo[i - 1] + t * len;
  }
  throw new Error(`Point (${p.x}, ${p.y}) is not on the path`);
}

/** Liang-Barsky: the [t0, t1] part of segment a->b inside rect, or null. */
function clip(a: Pt, b: Pt, r: Rect): [number, number] | null {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  let t0 = 0;
  let t1 = 1;
  const edges: Array<[number, number]> = [
    [-dx, a.x - r.x],
    [dx, r.x + r.w - a.x],
    [-dy, a.y - r.y],
    [dy, r.y + r.h - a.y],
  ];
  for (const [p, q] of edges) {
    if (Math.abs(p) < EPS) {
      if (q < 0) return null;
    } else {
      const t = q / p;
      if (p < 0) t0 = Math.max(t0, t);
      else t1 = Math.min(t1, t);
    }
  }
  return t0 < t1 - EPS ? [t0, t1] : null;
}

/** Stretches of the path that lie outside every rect, as distance runs. */
export function gapRuns(path: Path, rects: Rect[]): Run[] {
  const runs: Run[] = [];
  const { points, lengthTo } = path;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const len = lengthTo[i] - lengthTo[i - 1];
    if (len <= 0) continue;
    const inside = rects
      .map((r) => clip(a, b, r))
      .filter((iv): iv is [number, number] => iv !== null)
      .map(([t0, t1]) => [lengthTo[i - 1] + t0 * len, lengthTo[i - 1] + t1 * len] as [number, number])
      .sort((x, y) => x[0] - y[0]);
    let cursor = lengthTo[i - 1];
    const pushRun = (start: number, end: number) => {
      if (end - start <= EPS) return;
      const last = runs[runs.length - 1];
      if (last && Math.abs(last.end - start) <= EPS) last.end = end;
      else runs.push({ start, end });
    };
    for (const [s, e] of inside) {
      pushRun(cursor, s);
      cursor = Math.max(cursor, e);
    }
    pushRun(cursor, lengthTo[i]);
  }
  return runs;
}

/** Polyline vertices covering [start, end] on the path, corners included. */
export function runPoints(path: Path, run: Run): Pt[] {
  const pts = [pointAt(path, run.start)];
  path.lengthTo.forEach((c, i) => {
    if (c > run.start + EPS && c < run.end - EPS) pts.push(path.points[i]);
  });
  pts.push(pointAt(path, run.end));
  return pts;
}

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
