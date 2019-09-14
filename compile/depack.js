#!/usr/bin/env node
             
const path = require('path');
const fs = require('fs');
const os = require('os');
const _module = require('module');
const stream = require('stream');             
const r = (a, b = 0, f = !1) => {
  if (0 === b && !f) {
    return a;
  }
  a = a.split("\n", f ? b + 1 : void 0);
  return f ? a[a.length - 1] : a.slice(b).join("\n");
}, u = (a, b = !1) => r(a, 2 + (b ? 1 : 0)), v = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:w} = os;
const x = /\s+at.*(?:\(|\s)(.*)\)?/, y = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, A = w(), B = a => {
  const {pretty:b = !1, ignoredModules:f = ["pirates"]} = {}, l = f.join("|"), k = new RegExp(y.source.replace("IGNORED_MODULES", l));
  return a.replace(/\\/g, "/").split("\n").filter(g => {
    g = g.match(x);
    if (null === g || !g[1]) {
      return !0;
    }
    g = g[1];
    return g.includes(".app/Contents/Resources/electron.asar") || g.includes(".app/Contents/Resources/default_app.asar") ? !1 : !k.test(g);
  }).filter(g => g.trim()).map(g => b ? g.replace(x, (m, c) => m.replace(c, c.replace(A, "~"))) : g).join("\n");
};
function C(a, b, f = !1) {
  return function(l) {
    var k = v(arguments), {stack:g} = Error();
    const m = r(g, 2, !0), c = (g = l instanceof Error) ? l.message : l;
    k = [`Error: ${c}`, ...null !== k && a === k || f ? [b] : [m, b]].join("\n");
    k = B(k);
    return Object.assign(g ? l : Error(), {message:c, stack:k});
  };
}
;function D(a) {
  var {stack:b} = Error();
  const f = v(arguments);
  b = u(b, a);
  return C(f, b, a);
}
;function E(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function F(a, b, f) {
  const l = D(!0);
  if ("function" !== typeof a) {
    throw Error("Function must be passed.");
  }
  const {length:k} = a;
  if (!k) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((g, m) => {
    const c = (d, h) => d ? (d = l(d), m(d)) : g(f || h);
    let e = [c];
    Array.isArray(b) ? (b.forEach((d, h) => {
      E(k, h);
    }), e = [...b, c]) : 1 < Array.from(arguments).length && (E(k, 0), e = [b, c]);
    a(...e);
  });
}
;const {createReadStream:G, lstat:H} = fs;
const I = async a => {
  try {
    return await F(H, a);
  } catch (b) {
    return null;
  }
};
const {dirname:J, join:K, relative:L, resolve:M} = path;
const O = async(a, b) => {
  b && (b = J(b), a = K(b, a));
  var f = await I(a);
  b = a;
  let l = !1;
  if (!f) {
    if (b = await N(a), !b) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (f.isDirectory()) {
      f = !1;
      let k;
      a.endsWith("/") || (k = b = await N(a), f = !0);
      if (!k) {
        b = await N(K(a, "index"));
        if (!b) {
          throw Error(`${f ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        l = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? L("", b) : b, g:l};
}, N = async a => {
  a = `${a}.js`;
  let b = await I(a);
  b || (a = `${a}x`);
  if (b = await I(a)) {
    return a;
  }
};
const {builtinModules:P} = _module;
const {Writable:Q} = stream;
const R = (a, b) => {
  b.once("error", f => {
    a.emit("error", f);
  });
  return b;
};
class S extends Q {
  constructor(a) {
    const {binary:b = !1, rs:f = null, ...l} = a || {}, {f:k = D(!0), proxyError:g} = a || {}, m = (c, e) => k(e);
    super(l);
    this.a = [];
    this.b = new Promise((c, e) => {
      this.on("finish", () => {
        let d;
        b ? d = Buffer.concat(this.a) : d = this.a.join("");
        c(d);
        this.a = [];
      });
      this.once("error", d => {
        if (-1 == d.stack.indexOf("\n")) {
          m`${d}`;
        } else {
          const h = B(d.stack);
          d.stack = h;
          g && m`${d}`;
        }
        e(d);
      });
      f && R(this, f).pipe(this);
    });
  }
  _write(a, b, f) {
    this.a.push(a);
    f();
  }
  get c() {
    return this.b;
  }
}
const T = async a => {
  ({c:a} = new S({rs:a, f:D(!0)}));
  return await a;
};
async function U(a) {
  a = G(a);
  return await T(a);
}
;function V(a, b) {
  var f = ["q", "from"];
  const l = [];
  b.replace(a, (k, ...g) => {
    k = g.slice(0, g.length - 2).reduce((m, c, e) => {
      e = f[e];
      if (!e || void 0 === c) {
        return m;
      }
      m[e] = c;
      return m;
    }, {});
    l.push(k);
  });
  return l;
}
;const aa = /^ *import(?:\s+(?:[^\s,]+)\s*,?)?(?:\s*{(?:[^}]+)})?\s+from\s+(['"])(.+?)\1/gm, ba = /^ *import\s+(?:.+?\s*,\s*)?\*\s+as\s+.+?\s+from\s+(['"])(.+?)\1/gm, ca = /^ *import\s+(['"])(.+?)\1/gm, da = /^ *export\s+(?:{[^}]+?}|\*)\s+from\s+(['"])(.+?)\1/gm, ea = a => [aa, ba, ca, da].reduce((b, f) => {
  f = V(f, a).map(l => l.from);
  return [...b, ...f];
}, []);
const W = async(a, b, f = {}) => {
  const {fields:l, soft:k = !1} = f;
  var g = K(a, "node_modules", b);
  g = K(g, "package.json");
  const m = await I(g);
  if (m) {
    a = await fa(g, l);
    if (void 0 === a) {
      throw Error(`The package ${L("", g)} does export the module.`);
    }
    if (!a.entryExists && !k) {
      throw Error(`The exported module ${a.main} in package ${b} does not exist.`);
    }
    const {entry:c, version:e, packageName:d, main:h, entryExists:n, ...p} = a;
    return {entry:L("", c), packageJson:L("", g), ...e ? {version:e} : {}, packageName:d, ...h ? {hasMain:!0} : {}, ...n ? {} : {entryExists:!1}, ...p};
  }
  if ("/" == a && !m) {
    throw Error(`Package.json for module ${b} not found.`);
  }
  return W(K(M(a), ".."), b, f);
}, fa = async(a, b = []) => {
  const f = await U(a);
  let l, k, g, m, c;
  try {
    ({module:l, version:k, name:g, main:m, ...c} = JSON.parse(f)), c = b.reduce((d, h) => {
      d[h] = c[h];
      return d;
    }, {});
  } catch (d) {
    throw Error(`Could not parse ${a}.`);
  }
  a = J(a);
  b = l || m;
  if (!b) {
    if (!await I(K(a, "index.js"))) {
      return;
    }
    b = m = "index.js";
  }
  a = K(a, b);
  let e;
  try {
    ({path:e} = await O(a)), a = e;
  } catch (d) {
  }
  return {entry:a, version:k, packageName:g, main:!l && m, entryExists:!!e, ...c};
};
const X = a => /^[./]/.test(a), Y = async(a, b, f, l, k = null) => {
  const g = D(), m = J(a);
  b = b.map(async c => {
    if (P.includes(c)) {
      return {internal:c};
    }
    if (/^[./]/.test(c)) {
      try {
        var {path:e} = await O(c, a);
        return {entry:e, package:k};
      } catch (d) {
      }
    } else {
      {
        let [n, p, ...q] = c.split("/");
        !n.startsWith("@") && p ? (q = [p, ...q], p = n) : p = n.startsWith("@") ? `${n}/${p}` : n;
        e = {name:p, paths:q.join("/")};
      }
      const {name:d, paths:h} = e;
      if (h) {
        const {packageJson:n, packageName:p} = await W(m, d);
        c = J(n);
        ({path:c} = await O(K(c, h)));
        return {entry:c, package:p};
      }
    }
    try {
      const {entry:d, packageJson:h, version:n, packageName:p, hasMain:q, ...t} = await W(m, c, {fields:l});
      return p == k ? (console.warn("[static-analysis] Skipping package %s that imports itself in %s", p, a), null) : {entry:d, packageJson:h, version:n, name:p, ...q ? {hasMain:q} : {}, ...t};
    } catch (d) {
      if (f) {
        return null;
      }
      throw g(d);
    }
  });
  return (await Promise.all(b)).filter(Boolean);
}, Z = async(a, b = {}, {nodeModules:f = !0, shallow:l = !1, soft:k = !1, fields:g = [], package:m} = {}) => {
  if (a in b) {
    return [];
  }
  b[a] = 1;
  var c = await U(a), e = ea(c);
  c = ha(c);
  e = f ? e : e.filter(X);
  c = f ? c : c.filter(X);
  let d;
  try {
    const h = await Y(a, e, k, g, m), n = await Y(a, c, k, g, m);
    n.forEach(p => {
      p.required = !0;
    });
    d = [...h, ...n];
  } catch (h) {
    throw h.message = `${a}\n [!] ${h.message}`, h;
  }
  m = d.map(h => ({...h, from:a}));
  return await d.filter(({entry:h}) => h && !(h in b)).reduce(async(h, {entry:n, hasMain:p, packageJson:q, name:t, package:ia}) => {
    if (q && l) {
      return h;
    }
    h = await h;
    t = (await Z(n, b, {nodeModules:f, shallow:l, soft:k, fields:g, package:t || ia})).map(z => ({...z, from:z.from ? z.from : n, ...!z.packageJson && p ? {hasMain:p} : {}}));
    return [...h, ...t];
  }, m);
}, ha = a => V(/(?:^|[^\w\d_])require\(\s*(['"])(.+?)\1\s*\)/gm, a).map(b => b.from);
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
  const f = D();
  a = Array.isArray(a) ? a : [a];
  a = await Promise.all(a.map(async e => {
    ({path:e} = await O(e));
    return e;
  }));
  const {nodeModules:l = !0, shallow:k = !1, soft:g = !1, fields:m = []} = b;
  let c;
  try {
    const e = {};
    c = await a.reduce(async(d, h) => {
      d = await d;
      h = await Z(h, e, {nodeModules:l, shallow:k, soft:g, fields:m});
      d.push(...h);
      return d;
    }, []);
  } catch (e) {
    throw f(e);
  }
  return c.filter(({internal:e, entry:d}, h) => e ? c.findIndex(({internal:n}) => n == e) == h : c.findIndex(({entry:n}) => d == n) == h).map(e => {
    const {entry:d, internal:h} = e, n = c.filter(({internal:p, entry:q}) => {
      if (h) {
        return h == p;
      }
      if (d) {
        return d == q;
      }
    }).map(({from:p}) => p).filter((p, q, t) => t.indexOf(p) == q);
    return {...e, from:n};
  }).map(({package:e, ...d}) => e ? {package:e, ...d} : d);
}, _sort:a => {
  const b = [], f = [], l = [], k = [], g = [], m = [];
  a.forEach(({packageJson:c, hasMain:e, name:d, entry:h, internal:n}) => {
    if (n) {
      return g.push(n);
    }
    c && e ? f.push(c) : c && b.push(c);
    h && e ? l.push(h) : h && k.push(h);
    d && m.push(d);
  });
  return {commonJsPackageJsons:f, packageJsons:b, commonJs:l, js:k, internals:g, deps:m};
}};


//# sourceMappingURL=depack.js.map