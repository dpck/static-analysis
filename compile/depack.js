#!/usr/bin/env node
             
const path = require('path');
const fs = require('fs');
const os = require('os');
const _module = require('module');
const stream = require('stream');             
const r = (a, b = 0, e = !1) => {
  if (0 === b && !e) {
    return a;
  }
  a = a.split("\n", e ? b + 1 : void 0);
  return e ? a[a.length - 1] : a.slice(b).join("\n");
}, u = (a, b = !1) => r(a, 2 + (b ? 1 : 0)), v = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const w = os.homedir;
const x = /\s+at.*(?:\(|\s)(.*)\)?/, y = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, A = w(), B = a => {
  const {pretty:b = !1, ignoredModules:e = ["pirates"]} = {}, m = e.join("|"), k = new RegExp(y.source.replace("IGNORED_MODULES", m));
  return a.replace(/\\/g, "/").split("\n").filter(f => {
    f = f.match(x);
    if (null === f || !f[1]) {
      return !0;
    }
    f = f[1];
    return f.includes(".app/Contents/Resources/electron.asar") || f.includes(".app/Contents/Resources/default_app.asar") ? !1 : !k.test(f);
  }).filter(f => f.trim()).map(f => b ? f.replace(x, (l, c) => l.replace(c, c.replace(A, "~"))) : f).join("\n");
};
function C(a, b, e = !1) {
  return function(m) {
    var k = v(arguments), {stack:f} = Error();
    const l = r(f, 2, !0), c = (f = m instanceof Error) ? m.message : m;
    k = [`Error: ${c}`, ...null !== k && a === k || e ? [b] : [l, b]].join("\n");
    k = B(k);
    return Object.assign(f ? m : Error(), {message:c, stack:k});
  };
}
;function D(a) {
  var {stack:b} = Error();
  const e = v(arguments);
  b = u(b, a);
  return C(e, b, a);
}
;async function E(a, b, e) {
  const m = D(!0);
  if ("function" != typeof a) {
    throw Error("Function must be passed.");
  }
  if (!a.length) {
    throw Error(`Function${a.name ? ` ${a.name}` : ""} does not accept any arguments.`);
  }
  return await new Promise((k, f) => {
    const l = (d, g) => d ? (d = m(d), f(d)) : k(e || g);
    let c = [l];
    Array.isArray(b) ? c = [...b, l] : 1 < Array.from(arguments).length && (c = [b, l]);
    a(...c);
  });
}
;const F = fs.createReadStream, G = fs.lstat;
const H = async a => {
  try {
    return await E(G, a);
  } catch (b) {
    return null;
  }
};
const I = path.dirname, J = path.join, K = path.parse, L = path.relative, M = path.resolve;
const O = async(a, b) => {
  b && (b = I(b), a = J(b, a));
  var e = await H(a);
  b = a;
  let m = !1;
  if (!e) {
    if (b = await N(a), !b) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (e.isDirectory()) {
      e = !1;
      let k;
      a.endsWith("/") || (k = b = await N(a), e = !0);
      if (!k) {
        b = await N(J(a, "index"));
        if (!b) {
          throw Error(`${e ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        m = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? L("", b) : b, g:m};
}, N = async a => {
  a = `${a}.js`;
  let b = await H(a);
  b || (a = `${a}x`);
  if (b = await H(a)) {
    return a;
  }
};
const P = _module.builtinModules;
const Q = stream.Writable;
const R = (a, b) => {
  b.once("error", e => {
    a.emit("error", e);
  });
  return b;
};
class S extends Q {
  constructor(a) {
    const {binary:b = !1, rs:e = null, ...m} = a || {}, {f:k = D(!0), proxyError:f} = a || {}, l = (c, d) => k(d);
    super(m);
    this.a = [];
    this.b = new Promise((c, d) => {
      this.on("finish", () => {
        let g;
        b ? g = Buffer.concat(this.a) : g = this.a.join("");
        c(g);
        this.a = [];
      });
      this.once("error", g => {
        if (-1 == g.stack.indexOf("\n")) {
          l`${g}`;
        } else {
          const h = B(g.stack);
          g.stack = h;
          f && l`${g}`;
        }
        d(g);
      });
      e && R(this, e).pipe(this);
    });
  }
  _write(a, b, e) {
    this.a.push(a);
    e();
  }
  get c() {
    return this.b;
  }
}
const aa = async a => {
  ({c:a} = new S({rs:a, f:D(!0)}));
  return await a;
};
async function T(a) {
  a = F(a);
  return await aa(a);
}
;function U(a, b) {
  var e = ["q", "from"];
  const m = [];
  b.replace(a, (k, ...f) => {
    k = f.slice(0, f.length - 2).reduce((l, c, d) => {
      d = e[d];
      if (!d || void 0 === c) {
        return l;
      }
      l[d] = c;
      return l;
    }, {});
    m.push(k);
  });
  return m;
}
;const ba = /^ *import(?:\s+(?:[^\s,]+)\s*,?)?(?:\s*{(?:[^}]+)})?\s+from\s+(['"])(.+?)\1/gm, ca = /^ *import\s+(?:.+?\s*,\s*)?\*\s+as\s+.+?\s+from\s+(['"])(.+?)\1/gm, da = /^ *import\s+(['"])(.+?)\1/gm, ea = /^ *export\s+(?:{[^}]+?}|\*)\s+from\s+(['"])(.+?)\1/gm, fa = a => [ba, ca, da, ea].reduce((b, e) => {
  e = U(e, a).map(m => m.from);
  return [...b, ...e];
}, []);
let V;
const W = async(a, b, e = {}) => {
  V || ({root:V} = K(process.cwd()));
  const {fields:m, soft:k = !1} = e;
  var f = J(a, "node_modules", b);
  f = J(f, "package.json");
  const l = await H(f);
  if (l) {
    a = await ha(f, m);
    if (void 0 === a) {
      throw Error(`The package ${L("", f)} does export the module.`);
    }
    if (!a.entryExists && !k) {
      throw Error(`The exported module ${a.main} in package ${b} does not exist.`);
    }
    const {entry:c, version:d, packageName:g, main:h, entryExists:n, ...p} = a;
    return {entry:L("", c), packageJson:L("", f), ...d ? {version:d} : {}, packageName:g, ...h ? {hasMain:!0} : {}, ...n ? {} : {entryExists:!1}, ...p};
  }
  if (a == V && !l) {
    throw Error(`Package.json for module ${b} not found.`);
  }
  return W(J(M(a), ".."), b, e);
}, ha = async(a, b = []) => {
  const e = await T(a);
  let m, k, f, l, c;
  try {
    ({module:m, version:k, name:f, main:l, ...c} = JSON.parse(e)), c = b.reduce((g, h) => {
      g[h] = c[h];
      return g;
    }, {});
  } catch (g) {
    throw Error(`Could not parse ${a}.`);
  }
  a = I(a);
  b = m || l;
  if (!b) {
    if (!await H(J(a, "index.js"))) {
      return;
    }
    b = l = "index.js";
  }
  a = J(a, b);
  let d;
  try {
    ({path:d} = await O(a)), a = d;
  } catch (g) {
  }
  return {entry:a, version:k, packageName:f, main:!m && l, entryExists:!!d, ...c};
};
const X = a => /^[./]/.test(a), Y = async(a, b, e, m, k = null) => {
  const f = D(), l = I(a);
  b = b.map(async c => {
    if (P.includes(c)) {
      return {internal:c};
    }
    if (/^[./]/.test(c)) {
      try {
        var {path:d} = await O(c, a);
        return {entry:d, package:k};
      } catch (g) {
      }
    } else {
      {
        let [n, p, ...q] = c.split("/");
        !n.startsWith("@") && p ? (q = [p, ...q], p = n) : p = n.startsWith("@") ? `${n}/${p}` : n;
        d = {name:p, paths:q.join("/")};
      }
      const {name:g, paths:h} = d;
      if (h) {
        const {packageJson:n, packageName:p} = await W(l, g);
        c = I(n);
        ({path:c} = await O(J(c, h)));
        return {entry:c, package:p};
      }
    }
    try {
      const {entry:g, packageJson:h, version:n, packageName:p, hasMain:q, ...t} = await W(l, c, {fields:m});
      return p == k ? (console.warn("[static-analysis] Skipping package %s that imports itself in %s", p, a), null) : {entry:g, packageJson:h, version:n, name:p, ...q ? {hasMain:q} : {}, ...t};
    } catch (g) {
      if (e) {
        return null;
      }
      throw f(g);
    }
  });
  return (await Promise.all(b)).filter(Boolean);
}, Z = async(a, b = {}, {nodeModules:e = !0, shallow:m = !1, soft:k = !1, fields:f = [], package:l} = {}) => {
  if (a in b) {
    return [];
  }
  b[a] = 1;
  var c = await T(a), d = fa(c);
  c = ia(c);
  d = e ? d : d.filter(X);
  c = e ? c : c.filter(X);
  let g;
  try {
    const h = await Y(a, d, k, f, l), n = await Y(a, c, k, f, l);
    n.forEach(p => {
      p.required = !0;
    });
    g = [...h, ...n];
  } catch (h) {
    throw h.message = `${a}\n [!] ${h.message}`, h;
  }
  l = g.map(h => ({...h, from:a}));
  return await g.filter(({entry:h}) => h && !(h in b)).reduce(async(h, {entry:n, hasMain:p, packageJson:q, name:t, package:ja}) => {
    if (q && m) {
      return h;
    }
    h = await h;
    t = (await Z(n, b, {nodeModules:e, shallow:m, soft:k, fields:f, package:t || ja})).map(z => ({...z, from:z.from ? z.from : n, ...!z.packageJson && p ? {hasMain:p} : {}}));
    return [...h, ...t];
  }, l);
}, ia = a => U(/(?:^|[^\w\d_])require\(\s*(['"])(.+?)\1\s*\)/gm, a).map(b => b.from);
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
  const e = D();
  a = Array.isArray(a) ? a : [a];
  a = await Promise.all(a.map(async d => {
    ({path:d} = await O(d));
    return d;
  }));
  const {nodeModules:m = !0, shallow:k = !1, soft:f = !1, fields:l = []} = b;
  let c;
  try {
    const d = {};
    c = await a.reduce(async(g, h) => {
      g = await g;
      h = await Z(h, d, {nodeModules:m, shallow:k, soft:f, fields:l});
      g.push(...h);
      return g;
    }, []);
  } catch (d) {
    throw e(d);
  }
  return c.filter(({internal:d, entry:g}, h) => d ? c.findIndex(({internal:n}) => n == d) == h : c.findIndex(({entry:n}) => g == n) == h).map(d => {
    const g = d.entry, h = d.internal, n = c.filter(({internal:p, entry:q}) => {
      if (h) {
        return h == p;
      }
      if (g) {
        return g == q;
      }
    }).map(({from:p}) => p).filter((p, q, t) => t.indexOf(p) == q);
    return {...d, from:n};
  }).map(({package:d, ...g}) => d ? {package:d, ...g} : g);
}, _sort:a => {
  const b = [], e = [], m = [], k = [], f = [], l = [];
  a.forEach(({packageJson:c, hasMain:d, name:g, entry:h, internal:n}) => {
    if (n) {
      return f.push(n);
    }
    c && d ? e.push(c) : c && b.push(c);
    h && d ? m.push(h) : h && k.push(h);
    g && l.push(g);
  });
  return {commonJsPackageJsons:e, packageJsons:b, commonJs:m, js:k, internals:f, deps:l};
}};


//# sourceMappingURL=depack.js.map