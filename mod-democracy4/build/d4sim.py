# -*- coding: utf-8 -*-
"""Simulador de Democracy 4 a partir de los archivos del juego (data/simulation) más el mod.

Los archivos del juego no se incluyen en el repositorio (son de Positech): se pasan con la variable de entorno
D4_BASE=<carpeta data/simulation del juego>. Se usa para calibrar el arranque del mod contra datos reales.

Modelo (el mismo que describen los CSV del juego):
- cada variable (simulation.csv) vale la suma de los efectos que recibe, recortada a [min, max];
- un efecto es (origen, destino, fórmula de x = valor del origen, inercia N = promedio de los últimos N turnos);
- las políticas aportan efectos si están activas (x = nivel); las situaciones calculan su valor con sus causas y,
  si están activas (umbrales de inicio y fin), aportan sus efectos.
"""
import csv, math, os, re, sys

sys.path.insert(0, os.path.dirname(__file__))

FUNCS = {'__builtins__': {}, 'min': min, 'max': max, 'abs': abs, 'sqrt': math.sqrt}


class _Env(dict):
    """Las fórmulas pueden nombrar otras variables (p. ej. Liberal_perc): se leen del estado actual."""
    def __init__(self, getter):
        super().__init__()
        self.getter = getter

    def __missing__(self, k):
        v = self.getter(k) if self.getter else None
        return 0.0 if v is None else v


def compile_formula(f):
    f = f.strip()
    if not f:
        return None
    src = f.replace('^', '**')
    try:
        code = compile(src, '<f>', 'eval')
    except SyntaxError:
        return None

    def ev(x, env=None, _c=code):
        try:
            loc = _Env(env)
            loc['x'] = x
            v = eval(_c, FUNCS, loc)
            if isinstance(v, complex):
                v = v.real
            return float(v)
        except (ZeroDivisionError, OverflowError, ValueError, TypeError, NameError):
            return 0.0
    return ev


class Edge:
    __slots__ = ('src', 'dst', 'f', 'inertia', 'text', 'owner')

    def __init__(self, src, dst, text, inertia, owner):
        self.src, self.dst, self.text, self.owner = src, dst, text, owner
        self.inertia = max(1, int(float(inertia))) if inertia not in (None, '') else 1
        self.f = compile_formula(text)


def parse_effect(s):
    parts = [p.strip() for p in s.split(',')]
    if len(parts) < 2 or not parts[0]:
        return None
    return parts[0], parts[1], (parts[2] if len(parts) > 2 else '')


def read_csv(path):
    with open(path, encoding='utf-8-sig', errors='replace') as fh:
        return [r for r in csv.reader(fh)]


class Model:
    def __init__(self, base_dir, mod_dir=None, mission=None):
        self.vars = {}        # nombre -> (def, min, max)
        self.edges = []
        self.policies = {}    # nombre -> lista de Edge
        self.situations = {}  # nombre -> dict(start, stop, default, causes, effects)
        self._load_sim(os.path.join(base_dir, 'simulation.csv'))
        self._load_policies(os.path.join(base_dir, 'policies.csv'))
        self._load_situations(os.path.join(base_dir, 'situations.csv'))
        if mod_dir:
            sim = os.path.join(mod_dir, 'data/simulation')
            self._load_policies(os.path.join(sim, 'policies.csv'))
            self._load_situations(os.path.join(sim, 'situations.csv'))
            if mission:
                self._load_overrides(os.path.join(mod_dir, 'data/missions', mission, 'overrides'))

    # ---------------------------------------------------------------- carga
    def _load_sim(self, path):
        for r in read_csv(path):
            if len(r) < 8 or r[0] != '#' or not r[1]:
                continue
            name = r[1]
            try:
                self.vars[name] = (float(r[3] or 0), float(r[4] or 0), float(r[5] or 1))
            except ValueError:
                self.vars[name] = (0.0, 0.0, 1.0)
            rest = r[8:]
            seps = [i for i, c in enumerate(rest) if c.strip() == '#']
            if seps:
                inputs = rest[:seps[0]] if seps[0] > 0 else []
                after = rest[seps[0] + 1:]
                s2 = [i for i, c in enumerate(after) if c.strip() == '#']
                if s2:
                    inputs = inputs + after[:s2[0]]
                    outputs = after[s2[0] + 1:]
                else:
                    outputs = after
            else:
                inputs, outputs = [], rest
            for c in inputs:
                e = parse_effect(c)
                if e:
                    self.edges.append(Edge(e[0], name, e[1], e[2], 'sim:' + name))
            for c in outputs:
                e = parse_effect(c)
                if e:
                    self.edges.append(Edge(name, e[0], e[1], e[2], 'sim:' + name))

    def _load_policies(self, path):
        for r in read_csv(path):
            if len(r) < 22 or r[0] != '#' or not r[1]:
                continue
            name = r[1]
            try:
                i = r.index('#Effects')
            except ValueError:
                continue
            effs = []
            for c in r[i + 1:]:
                e = parse_effect(c)
                if e:
                    effs.append(Edge(name, e[0], e[1], e[2], 'pol:' + name))
            self.policies[name] = effs

    def _load_situations(self, path):
        for r in read_csv(path):
            if len(r) < 12 or r[0] != '#' or not r[1]:
                continue
            name = r[1]
            try:
                start, stop = float(r[6]), float(r[7])
            except ValueError:
                continue
            rest = r[12:]
            try:
                sep = [c.strip() for c in rest].index('#')
            except ValueError:
                sep = len(rest)
            causes, effects, default = [], [], 0.0
            prereq_pol = ''
            for c in rest[:sep]:
                e = parse_effect(c)
                if not e:
                    continue
                if e[0] == '_prereq_':
                    prereq_pol = e[1]
                    continue
                if e[0] == '_default_':
                    f = compile_formula(e[1])
                    default = f(0.0, None) if f else 0.0
                else:
                    causes.append(Edge(e[0], name, e[1], e[2], 'sitc:' + name))
            for c in rest[sep + 1:]:
                e = parse_effect(c)
                if e:
                    effects.append(Edge(name, e[0], e[1], e[2], 'sit:' + name))
            self.situations[name] = dict(start=start, stop=stop, default=default, causes=causes, effects=effects,
                                         positive=r[5].strip() == '1', prereq=r[3].strip() or prereq_pol)

    def _load_overrides(self, folder):
        self.overrides = []
        if not os.path.isdir(folder):
            return
        for f in sorted(os.listdir(folder)):
            t = open(os.path.join(folder, f), encoding='utf-8-sig').read()
            g = lambda k: re.search(k + r'\s*=\s*"?([^"\n]*)"?', t).group(1).strip()
            self.overrides.append((g('HostName'), g('TargetName'), g('Equation'), g('Inertia')))

    def apply_overrides(self, add_missing=True):
        all_edges = self.all_edges()
        for host, tgt, eq, inertia in getattr(self, 'overrides', []):
            hit = [e for e in all_edges if e.src == host and e.dst == tgt]
            for e in hit:
                e.text, e.f, e.inertia = eq, compile_formula(eq), max(1, int(float(inertia or 1)))
            if not hit and add_missing:
                self.edges.append(Edge(host, tgt, eq, inertia, 'override'))

    def all_edges(self):
        out = list(self.edges)
        for v in self.policies.values():
            out += v
        for s in self.situations.values():
            out += s['causes'] + s['effects']
        return out


def ownerkind(e):
    return e.owner.split(':')[0]


class Sim:
    """Simulación por turnos. policy: nombre -> nivel (sólo las activas). fixed: variables que maneja el motor."""

    def __init__(self, model, policy, fixed=None, init=None, init_sit=None):
        self.m = model
        self.add_default = True
        self.policy = dict(policy)
        self.fixed = dict(fixed or {})
        self.hist = {}                     # nombre -> lista de valores (más viejo primero)
        self.active = {}
        for n, (d, lo, hi) in model.vars.items():
            v = (init or {}).get(n, d)
            self.hist[n] = [v]
        for n, s in model.situations.items():
            v, a = (init_sit or {}).get(n, (s['default'], False))
            self.hist[n] = [v]
            self.active[n] = a
        for n, v in self.fixed.items():
            self.hist[n] = [v]

    def val(self, name, back=0):
        if name in self.policy:
            return self.policy[name]
        h = self.hist.get(name)
        if not h:
            return None
        return h[max(0, len(h) - 1 - back)]

    def eff(self, e):
        n = e.inertia
        vals = []
        for b in range(n):
            x = self.val(e.src, b)
            if x is None:
                return None
            vals.append(e.f(x, self.val) if e.f else 0.0)
        return sum(vals) / len(vals)

    def step(self, contrib=None):
        m = self.m
        inc = {n: (d if self.add_default else 0.0) for n, (d, lo, hi) in m.vars.items()}
        sit_inc = {n: s['default'] for n, s in m.situations.items()}
        def add(e, table):
            v = self.eff(e)
            if v is None:
                return
            if e.dst in table:
                table[e.dst] += v
                if contrib is not None:
                    contrib.setdefault(e.dst, []).append((e.owner + '>' + e.src, v))
        for e in m.edges:
            add(e, inc)
        for p, effs in m.policies.items():
            if p in self.policy:
                for e in effs:
                    add(e, inc)
        for n, s in m.situations.items():
            if s['prereq'] and s['prereq'] not in self.policy:
                sit_inc[n] = 0.0
                continue
            for e in s['causes']:
                add(e, sit_inc)
            if self.active.get(n):
                for e in s['effects']:
                    add(e, inc)
        for n, (d, lo, hi) in m.vars.items():
            if n in self.fixed:
                self.hist[n].append(self.fixed[n])
            else:
                self.hist[n].append(max(lo, min(hi, inc[n])))
        for n, s in m.situations.items():
            v = max(0.0, min(1.0, sit_inc[n]))
            self.hist[n].append(v)
            if not self.active[n] and v >= s['start']:
                self.active[n] = True
            elif self.active[n] and v <= s['stop']:
                self.active[n] = False
