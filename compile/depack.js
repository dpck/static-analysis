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
}, v = (a, b = !1) => t(a, 2 + (b ? 1 : 0)), w = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:y} = os;
const z = /\s+at.*(?:\(|\s)(.*)\)?/, A = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, D = y(), E = a => {
  const {pretty:b = !1, ignoredModules:d = ["pirates"]} = {}, m = d.join("|"), l = new RegExp(A.source.replace("IGNORED_MODULES", m));
  return a.replace(/\\/g, "/").split("\n").filter(e => {
    e = e.match(z);
    if (null === e || !e[1]) {
      return !0;
    }
    e = e[1];
    return e.includes(".app/Contents/Resources/electron.asar") || e.includes(".app/Contents/Resources/default_app.asar") ? !1 : !l.test(e);
  }).filter(e => e.trim()).map(e => b ? e.replace(z, (n, f) => n.replace(f, f.replace(D, "~"))) : e).join("\n");
};
function F(a, b, d = !1) {
  return function(m) {
    var l = w(arguments), {stack:e} = Error();
    const n = t(e, 2, !0), f = (e = m instanceof Error) ? m.message : m;
    l = [`Error: ${f}`, ...null !== l && a === l || d ? [b] : [n, b]].join("\n");
    l = E(l);
    return Object.assign(e ? m : Error(), {message:f, stack:l});
  };
}
;function G(a) {
  var {stack:b} = Error();
  const d = w(arguments);
  b = v(b, a);
  return F(d, b, a);
}
;function H(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function I(a, b, d) {
  const m = G(!0);
  if ("function" !== typeof a) {
    throw Error("Function must be passed.");
  }
  const {length:l} = a;
  if (!l) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((e, n) => {
    const f = (c, h) => c ? (c = m(c), n(c)) : e(d || h);
    let k = [f];
    Array.isArray(b) ? (b.forEach((c, h) => {
      H(l, h);
    }), k = [...b, f]) : 1 < Array.from(arguments).length && (H(l, 0), k = [b, f]);
    a(...k);
  });
}
;const {createReadStream:J, lstat:K} = fs;
const L = async a => {
  try {
    return await I(K, a);
  } catch (b) {
    return null;
  }
};
const {dirname:M, join:N, relative:O, resolve:P} = path;
const R = async(a, b) => {
  b && (b = M(b), a = N(b, a));
  var d = await L(a);
  b = a;
  let m = !1;
  if (!d) {
    if (b = await Q(a), !b) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (d.isDirectory()) {
      d = !1;
      let l;
      a.endsWith("/") || (l = b = await Q(a), d = !0);
      if (!l) {
        b = await Q(N(a, "index"));
        if (!b) {
          throw Error(`${d ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        m = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? O("", b) : b, h:m};
}, Q = async a => {
  a = `${a}.js`;
  let b = await L(a);
  b || (a = `${a}x`);
  if (b = await L(a)) {
    return a;
  }
};
const {builtinModules:S} = _module;
const {Writable:T} = stream;
const aa = (a, b) => {
  b.once("error", d => {
    a.emit("error", d);
  });
  return b;
};
class ba extends T {
  constructor(a) {
    const {binary:b = !1, rs:d = null, ...m} = a || {}, {f:l = G(!0), proxyError:e} = a || {}, n = (f, k) => l(k);
    super(m);
    this.a = [];
    this.b = new Promise((f, k) => {
      this.on("finish", () => {
        let c;
        b ? c = Buffer.concat(this.a) : c = this.a.join("");
        f(c);
        this.a = [];
      });
      this.once("error", c => {
        if (-1 == c.stack.indexOf("\n")) {
          n`${c}`;
        } else {
          const h = E(c.stack);
          c.stack = h;
          e && n`${c}`;
        }
        k(c);
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
  ({c:a} = new ba({rs:a, f:G(!0)}));
  return await a;
};
async function U(a) {
  a = J(a);
  return await ca(a);
}
;function V(a, b) {
  var d = ["q", "from"];
  const m = [];
  b.replace(a, (l, ...e) => {
    l = e.slice(0, e.length - 2).reduce((n, f, k) => {
      k = d[k];
      if (!k || void 0 === f) {
        return n;
      }
      n[k] = f;
      return n;
    }, {});
    m.push(l);
  });
  return m;
}
;const da = /^ *import(?:\s+(?:[^\s,]+)\s*,?)?(?:\s*{(?:[^}]+)})?\s+from\s+(['"])(.+?)\1/gm, ea = /^ *import\s+(?:.+?\s*,\s*)?\*\s+as\s+.+?\s+from\s+(['"])(.+?)\1/gm, fa = /^ *import\s+(['"])(.+?)\1/gm, ha = /^ *export\s+(?:{[^}]+?}|\*)\s+from\s+(['"])(.+?)\1/gm, ia = a => [da, ea, fa, ha].reduce((b, d) => {
  d = V(d, a).map(m => m.from);
  return [...b, ...d];
}, []);
const W = async(a, b, d = {}) => {
  const {fields:m, soft:l = !1} = d;
  var e = N(a, "node_modules", b);
  e = N(e, "package.json");
  const n = await L(e);
  if (n) {
    a = await ja(e, m);
    if (void 0 === a) {
      throw Error(`The package ${O("", e)} does export the module.`);
    }
    if (!a.entryExists && !l) {
      throw Error(`The exported module ${a.main} in package ${b} does not exist.`);
    }
    const {entry:f, version:k, packageName:c, main:h, entryExists:p, ...g} = a;
    return {entry:O("", f), packageJson:O("", e), ...k ? {version:k} : {}, packageName:c, ...h ? {hasMain:!0} : {}, ...p ? {} : {entryExists:!1}, ...g};
  }
  if ("/" == a && !n) {
    throw Error(`Package.json for module ${b} not found.`);
  }
  return W(N(P(a), ".."), b, d);
}, ja = async(a, b = []) => {
  const d = await U(a);
  let m, l, e, n, f;
  try {
    ({module:m, version:l, name:e, main:n, ...f} = JSON.parse(d)), f = b.reduce((c, h) => {
      c[h] = f[h];
      return c;
    }, {});
  } catch (c) {
    throw Error(`Could not parse ${a}.`);
  }
  a = M(a);
  b = m || n;
  if (!b) {
    if (!await L(N(a, "index.js"))) {
      return;
    }
    b = n = "index.js";
  }
  a = N(a, b);
  let k;
  try {
    ({path:k} = await R(a)), a = k;
  } catch (c) {
  }
  return {entry:a, version:l, packageName:e, main:!m && n, entryExists:!!k, ...f};
};
const X = a => /^[./]/.test(a), Y = async(a, b, d, m, l = null) => {
  const e = G(), n = M(a);
  b = b.map(async f => {
    if (S.includes(f)) {
      return {internal:f};
    }
    if (/^[./]/.test(f)) {
      try {
        var {path:k} = await R(f, a);
        return {entry:k, package:l};
      } catch (c) {
      }
    } else {
      {
        let [p, g, ...q] = f.split("/");
        !p.startsWith("@") && g ? (q = [g, ...q], g = p) : g = p.startsWith("@") ? `${p}/${g}` : p;
        k = {name:g, paths:q.join("/")};
      }
      const {name:c, paths:h} = k;
      if (h) {
        const {packageJson:p, packageName:g} = await W(n, c);
        f = M(p);
        ({path:f} = await R(N(f, h)));
        return {entry:f, package:g};
      }
    }
    try {
      const {entry:c, packageJson:h, version:p, packageName:g, hasMain:q, ...r} = await W(n, f, {fields:m});
      return g == l ? (console.warn("[static-analysis] Skipping package %s that imports itself in %s", g, a), null) : {entry:c, packageJson:h, version:p, name:g, ...q ? {hasMain:q} : {}, ...r};
    } catch (c) {
      if (d) {
        return null;
      }
      throw e(c);
    }
  });
  return (await Promise.all(b)).filter(Boolean);
}, Z = async(a, b = {}, {nodeModules:d = !0, shallow:m = !1, soft:l = !1, fields:e = [], g:n = {}, mergeSameNodeModules:f = !0, package:k} = {}) => {
  if (a in b) {
    return [];
  }
  b[a] = 1;
  var c = await U(a), h = ia(c);
  c = ka(c);
  h = d ? h : h.filter(X);
  c = d ? c : c.filter(X);
  try {
    const g = await Y(a, h, l, e, k), q = await Y(a, c, l, e, k);
    q.forEach(r => {
      r.required = !0;
    });
    var p = [...g, ...q];
  } catch (g) {
    throw g.message = `${a}\n [!] ${g.message}`, g;
  }
  k = f ? p.map(g => {
    const {name:q, version:r, required:x} = g;
    if (q && r) {
      const u = `${q}:${r}${x ? "-required" : ""}`, B = n[u];
      if (B) {
        return B;
      }
      n[u] = g;
    }
    return g;
  }) : p;
  p = k.map(g => ({...g, from:a}));
  return await k.filter(({entry:g}) => g && !(g in b)).reduce(async(g, {entry:q, hasMain:r, packageJson:x, name:u, package:B}) => {
    if (x && m) {
      return g;
    }
    g = await g;
    u = (await Z(q, b, {nodeModules:d, shallow:m, soft:l, fields:e, package:u || B, g:n, mergeSameNodeModules:f})).map(C => ({...C, from:C.from ? C.from : q, ...!C.packageJson && r ? {hasMain:r} : {}}));
    return [...g, ...u];
  }, p);
}, ka = a => V(/(?:^|[^\w\d_])require\(\s*(['"])(.+?)\1\s*\)/gm, a).map(b => b.from);
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
  const d = G();
  a = Array.isArray(a) ? a : [a];
  a = await Promise.all(a.map(async c => {
    ({path:c} = await R(c));
    return c;
  }));
  const {nodeModules:m = !0, shallow:l = !1, soft:e = !1, fields:n = [], mergeSameNodeModules:f = !0} = b;
  let k;
  try {
    const c = {};
    k = await a.reduce(async(h, p) => {
      h = await h;
      p = await Z(p, c, {nodeModules:m, shallow:l, soft:e, fields:n, mergeSameNodeModules:f});
      h.push(...p);
      return h;
    }, []);
  } catch (c) {
    throw d(c);
  }
  return k.filter(({internal:c, entry:h}, p) => c ? k.findIndex(({internal:g}) => g == c) == p : k.findIndex(({entry:g}) => h == g) == p).map(c => {
    const {entry:h, internal:p} = c, g = k.filter(({internal:q, entry:r}) => {
      if (p) {
        return p == q;
      }
      if (h) {
        return h == r;
      }
    }).map(({from:q}) => q).filter((q, r, x) => x.indexOf(q) == r);
    return {...c, from:g};
  }).map(({package:c, ...h}) => c ? {package:c, ...h} : h);
}, _sort:a => {
  const b = [], d = [], m = [], l = [], e = [], n = [];
  a.forEach(({packageJson:f, hasMain:k, name:c, entry:h, internal:p}) => {
    if (p) {
      return e.push(p);
    }
    f && k ? d.push(f) : f && b.push(f);
    h && k ? m.push(h) : h && l.push(h);
    c && n.push(c);
  });
  return {commonJsPackageJsons:d, packageJsons:b, commonJs:m, js:l, internals:e, deps:n};
}};


//# sourceMappingURL=depack.js.map