#!/usr/bin/env node
             
const path = require('path');
const fs = require('fs');
const os = require('os');
const _module = require('module');
const stream = require('stream');             
const t = (a, b = 0, d = !1) => {
  if (0 === b && !d) {
    return a;
  }
  a = a.split("\n", d ? b + 1 : void 0);
  return d ? a[a.length - 1] : a.slice(b).join("\n");
}, u = (a, b = !1) => t(a, 2 + (b ? 1 : 0)), v = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const x = os.homedir;
const y = /\s+at.*(?:\(|\s)(.*)\)?/, z = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, B = x(), C = a => {
  const {pretty:b = !1, ignoredModules:d = ["pirates"]} = {}, l = d.join("|"), k = new RegExp(z.source.replace("IGNORED_MODULES", l));
  return a.replace(/\\/g, "/").split("\n").filter(e => {
    e = e.match(y);
    if (null === e || !e[1]) {
      return !0;
    }
    e = e[1];
    return e.includes(".app/Contents/Resources/electron.asar") || e.includes(".app/Contents/Resources/default_app.asar") ? !1 : !k.test(e);
  }).filter(e => e.trim()).map(e => b ? e.replace(y, (m, f) => m.replace(f, f.replace(B, "~"))) : e).join("\n");
};
function D(a, b, d = !1) {
  return function(l) {
    var k = v(arguments), {stack:e} = Error();
    const m = t(e, 2, !0), f = (e = l instanceof Error) ? l.message : l;
    k = [`Error: ${f}`, ...null !== k && a === k || d ? [b] : [m, b]].join("\n");
    k = C(k);
    return Object.assign(e ? l : Error(), {message:f, stack:k});
  };
}
;function F(a) {
  var {stack:b} = Error();
  const d = v(arguments);
  b = u(b, a);
  return D(d, b, a);
}
;async function G(a, b, d) {
  const l = F(!0);
  if ("function" != typeof a) {
    throw Error("Function must be passed.");
  }
  if (!a.length) {
    throw Error(`Function${a.name ? ` ${a.name}` : ""} does not accept any arguments.`);
  }
  return await new Promise((k, e) => {
    const m = (h, c) => h ? (h = l(h), e(h)) : k(d || c);
    let f = [m];
    Array.isArray(b) ? f = [...b, m] : 1 < Array.from(arguments).length && (f = [b, m]);
    a(...f);
  });
}
;const H = fs.createReadStream, I = fs.lstat;
const J = async a => {
  try {
    return await G(I, a);
  } catch (b) {
    return null;
  }
};
const K = path.dirname, L = path.join, M = path.parse, N = path.relative, O = path.resolve;
const Q = async(a, b) => {
  b && (b = K(b), a = L(b, a));
  var d = await J(a);
  b = a;
  let l = !1;
  if (!d) {
    if (b = await P(a), !b) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (d.isDirectory()) {
      d = !1;
      let k;
      a.endsWith("/") || (k = b = await P(a), d = !0);
      if (!k) {
        b = await P(L(a, "index"));
        if (!b) {
          throw Error(`${d ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        l = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? N("", b) : b, h:l};
}, P = async a => {
  a = `${a}.js`;
  let b = await J(a);
  b || (a = `${a}x`);
  if (b = await J(a)) {
    return a;
  }
};
const R = _module.builtinModules;
const S = stream.Writable;
const aa = (a, b) => {
  b.once("error", d => {
    a.emit("error", d);
  });
  return b;
};
class ba extends S {
  constructor(a) {
    const {binary:b = !1, rs:d = null, ...l} = a || {}, {f:k = F(!0), proxyError:e} = a || {}, m = (f, h) => k(h);
    super(l);
    this.a = [];
    this.b = new Promise((f, h) => {
      this.on("finish", () => {
        let c;
        b ? c = Buffer.concat(this.a) : c = this.a.join("");
        f(c);
        this.a = [];
      });
      this.once("error", c => {
        if (-1 == c.stack.indexOf("\n")) {
          m`${c}`;
        } else {
          const n = C(c.stack);
          c.stack = n;
          e && m`${c}`;
        }
        h(c);
      });
      d && aa(this, d).pipe(this);
    });
  }
  _write(a, b, d) {
    this.a.push(a);
    d();
  }
  get c() {
    return this.b;
  }
}
const ca = async a => {
  ({c:a} = new ba({rs:a, f:F(!0)}));
  return await a;
};
async function T(a) {
  a = H(a);
  return await ca(a);
}
;function U(a, b) {
  var d = ["q", "from"];
  const l = [];
  b.replace(a, (k, ...e) => {
    k = e.slice(0, e.length - 2).reduce((m, f, h) => {
      h = d[h];
      if (!h || void 0 === f) {
        return m;
      }
      m[h] = f;
      return m;
    }, {});
    l.push(k);
  });
  return l;
}
;const da = /^ *import(?:\s+(?:[^\s,]+)\s*,?)?(?:\s*{(?:[^}]+)})?\s+from\s+(['"])(.+?)\1/gm, ea = /^ *import\s+(?:.+?\s*,\s*)?\*\s+as\s+.+?\s+from\s+(['"])(.+?)\1/gm, fa = /^ *import\s+(['"])(.+?)\1/gm, ha = /^ *export\s+(?:{[^}]+?}|\*)\s+from\s+(['"])(.+?)\1/gm, ia = a => [da, ea, fa, ha].reduce((b, d) => {
  d = U(d, a).map(l => l.from);
  return [...b, ...d];
}, []);
let V;
const W = async(a, b, d = {}) => {
  V || ({root:V} = M(process.cwd()));
  const {fields:l, soft:k = !1} = d;
  var e = L(a, "node_modules", b);
  e = L(e, "package.json");
  const m = await J(e);
  if (m) {
    a = await ja(e, l);
    if (void 0 === a) {
      throw Error(`The package ${N("", e)} does export the module.`);
    }
    if (!a.entryExists && !k) {
      throw Error(`The exported module ${a.main} in package ${b} does not exist.`);
    }
    const {entry:f, version:h, packageName:c, main:n, entryExists:p, ...g} = a;
    return {entry:N("", f), packageJson:N("", e), ...h ? {version:h} : {}, packageName:c, ...n ? {hasMain:!0} : {}, ...p ? {} : {entryExists:!1}, ...g};
  }
  if (a == V && !m) {
    throw Error(`Package.json for module ${b} not found.`);
  }
  return W(L(O(a), ".."), b, d);
}, ja = async(a, b = []) => {
  const d = await T(a);
  let l, k, e, m, f;
  try {
    ({module:l, version:k, name:e, main:m, ...f} = JSON.parse(d)), f = b.reduce((c, n) => {
      c[n] = f[n];
      return c;
    }, {});
  } catch (c) {
    throw Error(`Could not parse ${a}.`);
  }
  a = K(a);
  b = l || m;
  if (!b) {
    if (!await J(L(a, "index.js"))) {
      return;
    }
    b = m = "index.js";
  }
  a = L(a, b);
  let h;
  try {
    ({path:h} = await Q(a)), a = h;
  } catch (c) {
  }
  return {entry:a, version:k, packageName:e, main:!l && m, entryExists:!!h, ...f};
};
const X = a => /^[./]/.test(a), Y = async(a, b, d, l, k = null) => {
  const e = F(), m = K(a);
  b = b.map(async f => {
    if (R.includes(f)) {
      return {internal:f};
    }
    if (/^[./]/.test(f)) {
      try {
        var {path:h} = await Q(f, a);
        return {entry:h, package:k};
      } catch (c) {
      }
    } else {
      {
        let [p, g, ...q] = f.split("/");
        !p.startsWith("@") && g ? (q = [g, ...q], g = p) : g = p.startsWith("@") ? `${p}/${g}` : p;
        h = {name:g, paths:q.join("/")};
      }
      const {name:c, paths:n} = h;
      if (n) {
        const {packageJson:p, packageName:g} = await W(m, c);
        f = K(p);
        ({path:f} = await Q(L(f, n)));
        return {entry:f, package:g};
      }
    }
    try {
      const {entry:c, packageJson:n, version:p, packageName:g, hasMain:q, ...r} = await W(m, f, {fields:l});
      return g == k ? (console.warn("[static-analysis] Skipping package %s that imports itself in %s", g, a), null) : {entry:c, packageJson:n, version:p, name:g, ...q ? {hasMain:q} : {}, ...r};
    } catch (c) {
      if (d) {
        return null;
      }
      throw e(c);
    }
  });
  return (await Promise.all(b)).filter(Boolean);
}, Z = async(a, b = {}, {nodeModules:d = !0, shallow:l = !1, soft:k = !1, fields:e = [], g:m = {}, mergeSameNodeModules:f = !0, package:h} = {}) => {
  if (a in b) {
    return [];
  }
  b[a] = 1;
  var c = await T(a), n = ia(c);
  c = ka(c);
  n = d ? n : n.filter(X);
  c = d ? c : c.filter(X);
  try {
    const g = await Y(a, n, k, e, h), q = await Y(a, c, k, e, h);
    q.forEach(r => {
      r.required = !0;
    });
    var p = [...g, ...q];
  } catch (g) {
    throw g.message = `${a}\n [!] ${g.message}`, g;
  }
  h = f ? p.map(g => {
    var q = g.name, r = g.version;
    const w = g.required;
    if (q && r) {
      q = `${q}:${r}${w ? "-required" : ""}`;
      if (r = m[q]) {
        return r;
      }
      m[q] = g;
    }
    return g;
  }) : p;
  p = h.map(g => ({...g, from:a}));
  return await h.filter(({entry:g}) => g && !(g in b)).reduce(async(g, {entry:q, hasMain:r, packageJson:w, name:E, package:la}) => {
    if (w && l) {
      return g;
    }
    g = await g;
    E = (await Z(q, b, {nodeModules:d, shallow:l, soft:k, fields:e, package:E || la, g:m, mergeSameNodeModules:f})).map(A => ({...A, from:A.from ? A.from : q, ...!A.packageJson && r ? {hasMain:r} : {}}));
    return [...g, ...E];
  }, p);
}, ka = a => U(/(?:^|[^\w\d_])require\(\s*(['"])(.+?)\1\s*\)/gm, a).map(b => b.from);
/*

 static-analysis: Performs RegEx Static Analysis On JavaScript Programs To Find Out All Dependencies That Stem From The Given Files.

 Copyright (C) 2019 Art Deco

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
module.exports = {_staticAnalysis:async(a, b = {}) => {
  const d = F();
  a = Array.isArray(a) ? a : [a];
  a = await Promise.all(a.map(async c => {
    ({path:c} = await Q(c));
    return c;
  }));
  const {nodeModules:l = !0, shallow:k = !1, soft:e = !1, fields:m = [], mergeSameNodeModules:f = !0} = b;
  let h;
  try {
    const c = {};
    h = await a.reduce(async(n, p) => {
      n = await n;
      p = await Z(p, c, {nodeModules:l, shallow:k, soft:e, fields:m, mergeSameNodeModules:f});
      n.push(...p);
      return n;
    }, []);
  } catch (c) {
    throw d(c);
  }
  return h.filter(({internal:c, entry:n}, p) => c ? h.findIndex(({internal:g}) => g == c) == p : h.findIndex(({entry:g}) => n == g) == p).map(c => {
    const n = c.entry, p = c.internal, g = h.filter(({internal:q, entry:r}) => {
      if (p) {
        return p == q;
      }
      if (n) {
        return n == r;
      }
    }).map(({from:q}) => q).filter((q, r, w) => w.indexOf(q) == r);
    return {...c, from:g};
  }).map(({package:c, ...n}) => c ? {package:c, ...n} : n);
}, _sort:a => {
  const b = [], d = [], l = [], k = [], e = [], m = [];
  a.forEach(({packageJson:f, hasMain:h, name:c, entry:n, internal:p}) => {
    if (p) {
      return e.push(p);
    }
    f && h ? d.push(f) : f && b.push(f);
    n && h ? l.push(n) : n && k.push(n);
    c && m.push(c);
  });
  return {commonJsPackageJsons:d, packageJsons:b, commonJs:l, js:k, internals:e, deps:m};
}};


//# sourceMappingURL=depack.js.map