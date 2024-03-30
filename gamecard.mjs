const hi = () => (g) => g;
var Zf = /* @__PURE__ */ ((g) => (g.Class = "class", g.Factory = "factory", g.Instance = "instance", g))(Zf || {}), ml = /* @__PURE__ */ ((g) => (g.Transient = "transient", g.Request = "request", g.Singleton = "singleton", g))(ml || {});
class lO {
  constructor(f) {
    this.services = f, this.singletons = /* @__PURE__ */ new Map();
  }
  get(f) {
    return this.getService(f, /* @__PURE__ */ new Map(), !1);
  }
  findTaggedServiceIdentifiers(f) {
    return Array.from(this.services).filter(([, h]) => h.tags.indexOf(f) >= 0).map(([h]) => h);
  }
  getService(f, h, _) {
    const w = this.findServiceDataOrThrow(f, _);
    if (w.scope === ml.Singleton && this.singletons.has(f))
      return this.singletons.get(f);
    if (w.scope === ml.Request && h.has(f))
      return h.get(f);
    let M;
    if (w.type === Zf.Instance)
      M = w.instance;
    else if (w.type === Zf.Class) {
      const C = this.getDependencies(w.dependencies, h);
      M = new w.class(...C);
    } else
      M = w.factory({
        get: (C) => this.getService(C, h, !0),
        findTaggedServiceIdentifiers: (C) => this.findTaggedServiceIdentifiers(C)
      });
    return w.scope === ml.Singleton ? this.singletons.set(f, M) : w.scope === ml.Request && h.set(f, M), M;
  }
  findServiceDataOrThrow(f, h) {
    const _ = this.services.get(f);
    if (!_)
      throw new Error(`Service not registered for: ${f.name}`);
    if (!h && _.isPrivate)
      throw new Error(`The ${f.name} service has been registered as private and can not be directly get from the container`);
    return _;
  }
  getDependencies(f, h) {
    const _ = new Array();
    for (const w of f)
      _.push(this.getService(w, h, !0));
    return _;
  }
}
const uO = "design:paramtypes", oO = (g, f) => {
  const h = Reflect.getMetadata(uO, g) || [];
  if (h.length < g.length)
    throw new Error(`Service not decorated: ${[
      ...f,
      g.name
    ].join(" -> ")}`);
  return h;
}, v1 = (g) => {
  const f = Object.getPrototypeOf(g.prototype).constructor;
  if (f !== Object)
    return f;
}, h1 = (g, f = []) => {
  const h = oO(g, f);
  if (h.length > 0)
    return h;
  const _ = v1(g);
  return _ ? h1(_, [
    ...f,
    g.name
  ]) : [];
}, m1 = (g) => {
  if (g.length > 0)
    return g.length;
  const f = v1(g);
  return f ? m1(f) : 0;
};
class rC {
  constructor() {
    this.isPrivate = !1, this.tags = [];
  }
  public() {
    return this.isPrivate = !1, this;
  }
  private() {
    return this.isPrivate = !0, this;
  }
  addTag(f) {
    return this.tags = [
      ...this.tags,
      f
    ], this;
  }
  asTransient() {
    return this.scope = ml.Transient, this;
  }
  asSingleton() {
    return this.scope = ml.Singleton, this;
  }
  asInstancePerRequest() {
    return this.scope = ml.Request, this;
  }
}
class aC extends rC {
  constructor(f) {
    super(), this.newable = f, this.scope = ml.Transient, this.dependencies = [], this.autowire = !0;
  }
  withDependencies(f) {
    return this.dependencies = f, this.autowire = !1, this;
  }
  asTransient() {
    return super.asTransient();
  }
  asSingleton() {
    return super.asSingleton();
  }
  asInstancePerRequest() {
    return super.asInstancePerRequest();
  }
  setDependencyInformationIfNotExist(f, h) {
    const _ = h.autowire && this.autowire;
    if (!_ && m1(this.newable) > this.dependencies.length)
      throw new Error(`Dependencies must be provided for non autowired services. Service with missing dependencies: ${f.name}`);
    _ && (this.dependencies = h1(this.newable));
  }
  build(f) {
    return this.setDependencyInformationIfNotExist(this.newable, f), {
      tags: this.tags,
      isPrivate: this.isPrivate,
      scope: this.scope,
      type: Zf.Class,
      class: this.newable,
      dependencies: this.dependencies,
      autowire: this.autowire
    };
  }
  static createBuildable(f) {
    const h = new aC(f);
    return {
      instance: h,
      build: (_) => h.build(_)
    };
  }
}
class iC extends rC {
  constructor(f) {
    super(), this.factory = f, this.scope = ml.Transient;
  }
  asTransient() {
    return super.asTransient();
  }
  asSingleton() {
    return super.asSingleton();
  }
  asInstancePerRequest() {
    return super.asInstancePerRequest();
  }
  build() {
    return {
      tags: this.tags,
      isPrivate: this.isPrivate,
      scope: this.scope,
      type: Zf.Factory,
      factory: this.factory,
      dependencies: []
    };
  }
  static createBuildable(f) {
    const h = new iC(f);
    return {
      instance: h,
      build: () => h.build()
    };
  }
}
class lC extends rC {
  constructor(f) {
    super(), this.instance = f, this.scope = ml.Singleton;
  }
  build() {
    return {
      tags: this.tags,
      isPrivate: this.isPrivate,
      scope: this.scope,
      type: Zf.Instance,
      instance: this.instance,
      dependencies: []
    };
  }
  static createBuildable(f) {
    const h = new lC(f);
    return {
      instance: h,
      build: () => h.build()
    };
  }
}
class uC {
  constructor(f) {
    this.identifier = f;
  }
  useClass(f) {
    const h = aC.createBuildable(f);
    return this.buildable = h, h.instance;
  }
  use(f) {
    return this.useClass(f);
  }
  useInstance(f) {
    const h = lC.createBuildable(f);
    return this.buildable = h, h.instance;
  }
  useFactory(f) {
    const h = iC.createBuildable(f);
    return this.buildable = h, h.instance;
  }
  build(f) {
    if (this.buildable === void 0)
      throw new Error(`Service ${this.identifier.name} registration is not completed. Use .registerAndUse(${this.identifier.name}) instead of .register(${this.identifier.name}) to use it directly or set any other registration use`);
    return this.buildable.build(f);
  }
  static createBuildable(f) {
    const h = new uC(f);
    return {
      instance: h,
      build: (_) => h.build(_)
    };
  }
}
const sO = (g, f, h) => {
  const _ = new Array();
  for (const w of f.dependencies)
    h.has(w) || _.push(w.name);
  if (_.length > 0)
    throw new Error(`Service not registered for the following dependencies of ${g.name}: ${_.join(", ")}`);
}, y1 = (g, f, h, _ = []) => {
  for (const w of f.dependencies) {
    if (g === w)
      throw new Error(`Circular dependency detected: ${[
        g.name,
        ..._,
        g.name
      ].join(" -> ")}`);
    const M = h.get(w);
    M.dependencies.length > 0 && y1(g, M, h, [
      ..._,
      w.name
    ]);
  }
}, Jb = (g, f) => {
  for (const [h, _] of g)
    f(h, _, g);
}, cO = (g) => {
  Jb(g, sO), Jb(g, y1);
};
class fO {
  constructor() {
    this.buildables = /* @__PURE__ */ new Map();
  }
  register(f) {
    if (this.buildables.has(f))
      throw new Error(`A service identified as ${f.name} has been already registered. You need to unregister it before you can register it again.`);
    const h = uC.createBuildable(f);
    return this.buildables.set(f, h), h.instance;
  }
  unregister(f) {
    if (!this.buildables.has(f))
      throw new Error(`There is no service registered as ${f.name}.`);
    this.buildables.delete(f);
  }
  isRegistered(f) {
    return this.buildables.has(f);
  }
  registerAndUse(f) {
    return this.register(f).use(f);
  }
  build({ autowire: f = !0 } = {}) {
    const h = /* @__PURE__ */ new Map();
    for (const [_, w] of this.buildables) {
      const M = w.build({
        autowire: f
      });
      h.set(_, M);
    }
    return cO(h), new lO(h);
  }
}
var e1 = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function dO(g) {
  return g && g.__esModule && Object.prototype.hasOwnProperty.call(g, "default") ? g.default : g;
}
/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var t1;
(function(g) {
  (function(f) {
    var h = typeof globalThis == "object" ? globalThis : typeof e1 == "object" ? e1 : typeof self == "object" ? self : typeof this == "object" ? this : me(), _ = w(g);
    typeof h.Reflect < "u" && (_ = w(h.Reflect, _)), f(_, h), typeof h.Reflect > "u" && (h.Reflect = g);
    function w(J, ie) {
      return function(_e, ee) {
        Object.defineProperty(J, _e, {
          configurable: !0,
          writable: !0,
          value: ee
        }), ie && ie(_e, ee);
      };
    }
    function M() {
      try {
        return Function("return this;")();
      } catch {
      }
    }
    function C() {
      try {
        return (0, eval)("(function() { return this; })()");
      } catch {
      }
    }
    function me() {
      return M() || C();
    }
  })(function(f, h) {
    var _ = Object.prototype.hasOwnProperty, w = typeof Symbol == "function", M = w && typeof Symbol.toPrimitive < "u" ? Symbol.toPrimitive : "@@toPrimitive", C = w && typeof Symbol.iterator < "u" ? Symbol.iterator : "@@iterator", me = typeof Object.create == "function", J = {
      __proto__: []
    } instanceof Array, ie = !me && !J, _e = {
      // create an object in dictionary mode (a.k.a. "slow" mode in v8)
      create: me ? function() {
        return Cr(/* @__PURE__ */ Object.create(null));
      } : J ? function() {
        return Cr({
          __proto__: null
        });
      } : function() {
        return Cr({});
      },
      has: ie ? function(T, N) {
        return _.call(T, N);
      } : function(T, N) {
        return N in T;
      },
      get: ie ? function(T, N) {
        return _.call(T, N) ? T[N] : void 0;
      } : function(T, N) {
        return T[N];
      }
    }, ee = Object.getPrototypeOf(Function), de = typeof Map == "function" && typeof Map.prototype.entries == "function" ? Map : hn(), ve = typeof Set == "function" && typeof Set.prototype.entries == "function" ? Set : Sr(), ke = typeof WeakMap == "function" ? WeakMap : La(), ot = w ? Symbol.for("@reflect-metadata:registry") : void 0, st = or(), It = Br(st);
    function $e(T, N, F, Z) {
      if (q(F)) {
        if (!Zn(T))
          throw new TypeError();
        if (!cn(N))
          throw new TypeError();
        return En(T, N);
      } else {
        if (!Zn(T))
          throw new TypeError();
        if (!Ve(N))
          throw new TypeError();
        if (!Ve(Z) && !q(Z) && !We(Z))
          throw new TypeError();
        return We(Z) && (Z = void 0), F = vn(F), Xe(T, N, F, Z);
      }
    }
    f("decorate", $e);
    function He(T, N) {
      function F(Z, he) {
        if (!Ve(Z))
          throw new TypeError();
        if (!q(he) && !In(he))
          throw new TypeError();
        se(T, N, Z, he);
      }
      return F;
    }
    f("metadata", He);
    function mt(T, N, F, Z) {
      if (!Ve(F))
        throw new TypeError();
      return q(Z) || (Z = vn(Z)), se(T, N, F, Z);
    }
    f("defineMetadata", mt);
    function je(T, N, F) {
      if (!Ve(N))
        throw new TypeError();
      return q(F) || (F = vn(F)), ct(T, N, F);
    }
    f("hasMetadata", je);
    function yt(T, N, F) {
      if (!Ve(N))
        throw new TypeError();
      return q(F) || (F = vn(F)), Ft(T, N, F);
    }
    f("hasOwnMetadata", yt);
    function nt(T, N, F) {
      if (!Ve(N))
        throw new TypeError();
      return q(F) || (F = vn(F)), Ot(T, N, F);
    }
    f("getMetadata", nt);
    function an(T, N, F) {
      if (!Ve(N))
        throw new TypeError();
      return q(F) || (F = vn(F)), Oe(T, N, F);
    }
    f("getOwnMetadata", an);
    function Rn(T, N) {
      if (!Ve(T))
        throw new TypeError();
      return q(N) || (N = vn(N)), Pe(T, N);
    }
    f("getMetadataKeys", Rn);
    function Xt(T, N) {
      if (!Ve(T))
        throw new TypeError();
      return q(N) || (N = vn(N)), O(T, N);
    }
    f("getOwnMetadataKeys", Xt);
    function jt(T, N, F) {
      if (!Ve(N))
        throw new TypeError();
      if (q(F) || (F = vn(F)), !Ve(N))
        throw new TypeError();
      q(F) || (F = vn(F));
      var Z = Wn(
        N,
        F,
        /*Create*/
        !1
      );
      return q(Z) ? !1 : Z.OrdinaryDeleteMetadata(T, N, F);
    }
    f("deleteMetadata", jt);
    function En(T, N) {
      for (var F = T.length - 1; F >= 0; --F) {
        var Z = T[F], he = Z(N);
        if (!q(he) && !We(he)) {
          if (!cn(he))
            throw new TypeError();
          N = he;
        }
      }
      return N;
    }
    function Xe(T, N, F, Z) {
      for (var he = T.length - 1; he >= 0; --he) {
        var St = T[he], Ct = St(N, F, Z);
        if (!q(Ct) && !We(Ct)) {
          if (!Ve(Ct))
            throw new TypeError();
          Z = Ct;
        }
      }
      return Z;
    }
    function ct(T, N, F) {
      var Z = Ft(T, N, F);
      if (Z)
        return !0;
      var he = Yn(N);
      return We(he) ? !1 : ct(T, he, F);
    }
    function Ft(T, N, F) {
      var Z = Wn(
        N,
        F,
        /*Create*/
        !1
      );
      return q(Z) ? !1 : vt(Z.OrdinaryHasOwnMetadata(T, N, F));
    }
    function Ot(T, N, F) {
      var Z = Ft(T, N, F);
      if (Z)
        return Oe(T, N, F);
      var he = Yn(N);
      if (!We(he))
        return Ot(T, he, F);
    }
    function Oe(T, N, F) {
      var Z = Wn(
        N,
        F,
        /*Create*/
        !1
      );
      if (!q(Z))
        return Z.OrdinaryGetOwnMetadata(T, N, F);
    }
    function se(T, N, F, Z) {
      var he = Wn(
        F,
        Z,
        /*Create*/
        !0
      );
      he.OrdinaryDefineOwnMetadata(T, N, F, Z);
    }
    function Pe(T, N) {
      var F = O(T, N), Z = Yn(T);
      if (Z === null)
        return F;
      var he = Pe(Z, N);
      if (he.length <= 0)
        return F;
      if (F.length <= 0)
        return he;
      for (var St = new ve(), Ct = [], Ge = 0, te = F; Ge < te.length; Ge++) {
        var Ce = te[Ge], oe = St.has(Ce);
        oe || (St.add(Ce), Ct.push(Ce));
      }
      for (var ce = 0, it = he; ce < it.length; ce++) {
        var Ce = it[ce], oe = St.has(Ce);
        oe || (St.add(Ce), Ct.push(Ce));
      }
      return Ct;
    }
    function O(T, N) {
      var F = Wn(
        T,
        N,
        /*create*/
        !1
      );
      return F ? F.OrdinaryOwnMetadataKeys(T, N) : [];
    }
    function K(T) {
      if (T === null)
        return 1;
      switch (typeof T) {
        case "undefined":
          return 0;
        case "boolean":
          return 2;
        case "string":
          return 3;
        case "symbol":
          return 4;
        case "number":
          return 5;
        case "object":
          return T === null ? 1 : 6;
        default:
          return 6;
      }
    }
    function q(T) {
      return T === void 0;
    }
    function We(T) {
      return T === null;
    }
    function Je(T) {
      return typeof T == "symbol";
    }
    function Ve(T) {
      return typeof T == "object" ? T !== null : typeof T == "function";
    }
    function gt(T, N) {
      switch (K(T)) {
        case 0:
          return T;
        case 1:
          return T;
        case 2:
          return T;
        case 3:
          return T;
        case 4:
          return T;
        case 5:
          return T;
      }
      var F = N === 3 ? "string" : N === 5 ? "number" : "default", Z = Nn(T, M);
      if (Z !== void 0) {
        var he = Z.call(T, F);
        if (Ve(he))
          throw new TypeError();
        return he;
      }
      return wt(T, F === "default" ? "number" : F);
    }
    function wt(T, N) {
      if (N === "string") {
        var F = T.toString;
        if (jn(F)) {
          var Z = F.call(T);
          if (!Ve(Z))
            return Z;
        }
        var he = T.valueOf;
        if (jn(he)) {
          var Z = he.call(T);
          if (!Ve(Z))
            return Z;
        }
      } else {
        var he = T.valueOf;
        if (jn(he)) {
          var Z = he.call(T);
          if (!Ve(Z))
            return Z;
        }
        var St = T.toString;
        if (jn(St)) {
          var Z = St.call(T);
          if (!Ve(Z))
            return Z;
        }
      }
      throw new TypeError();
    }
    function vt(T) {
      return !!T;
    }
    function Yt(T) {
      return "" + T;
    }
    function vn(T) {
      var N = gt(
        T,
        3
        /* String */
      );
      return Je(N) ? N : Yt(N);
    }
    function Zn(T) {
      return Array.isArray ? Array.isArray(T) : T instanceof Object ? T instanceof Array : Object.prototype.toString.call(T) === "[object Array]";
    }
    function jn(T) {
      return typeof T == "function";
    }
    function cn(T) {
      return typeof T == "function";
    }
    function In(T) {
      switch (K(T)) {
        case 3:
          return !0;
        case 4:
          return !0;
        default:
          return !1;
      }
    }
    function Tn(T, N) {
      return T === N || T !== T && N !== N;
    }
    function Nn(T, N) {
      var F = T[N];
      if (F != null) {
        if (!jn(F))
          throw new TypeError();
        return F;
      }
    }
    function _n(T) {
      var N = Nn(T, C);
      if (!jn(N))
        throw new TypeError();
      var F = N.call(T);
      if (!Ve(F))
        throw new TypeError();
      return F;
    }
    function yr(T) {
      return T.value;
    }
    function gr(T) {
      var N = T.next();
      return N.done ? !1 : N;
    }
    function Fn(T) {
      var N = T.return;
      N && N.call(T);
    }
    function Yn(T) {
      var N = Object.getPrototypeOf(T);
      if (typeof T != "function" || T === ee || N !== ee)
        return N;
      var F = T.prototype, Z = F && Object.getPrototypeOf(F);
      if (Z == null || Z === Object.prototype)
        return N;
      var he = Z.constructor;
      return typeof he != "function" || he === T ? N : he;
    }
    function Lr() {
      var T;
      !q(ot) && typeof h.Reflect < "u" && !(ot in h.Reflect) && typeof h.Reflect.defineMetadata == "function" && (T = Jn(h.Reflect));
      var N, F, Z, he = new ke(), St = {
        registerProvider: Ct,
        getProvider: te,
        setProvider: oe
      };
      return St;
      function Ct(ce) {
        if (!Object.isExtensible(St))
          throw new Error("Cannot add provider to a frozen registry.");
        switch (!0) {
          case T === ce:
            break;
          case q(N):
            N = ce;
            break;
          case N === ce:
            break;
          case q(F):
            F = ce;
            break;
          case F === ce:
            break;
          default:
            Z === void 0 && (Z = new ve()), Z.add(ce);
            break;
        }
      }
      function Ge(ce, it) {
        if (!q(N)) {
          if (N.isProviderFor(ce, it))
            return N;
          if (!q(F)) {
            if (F.isProviderFor(ce, it))
              return N;
            if (!q(Z))
              for (var Dt = _n(Z); ; ) {
                var Kt = gr(Dt);
                if (!Kt)
                  return;
                var er = yr(Kt);
                if (er.isProviderFor(ce, it))
                  return Fn(Dt), er;
              }
          }
        }
        if (!q(T) && T.isProviderFor(ce, it))
          return T;
      }
      function te(ce, it) {
        var Dt = he.get(ce), Kt;
        return q(Dt) || (Kt = Dt.get(it)), q(Kt) && (Kt = Ge(ce, it), q(Kt) || (q(Dt) && (Dt = new de(), he.set(ce, Dt)), Dt.set(it, Kt))), Kt;
      }
      function Ce(ce) {
        if (q(ce))
          throw new TypeError();
        return N === ce || F === ce || !q(Z) && Z.has(ce);
      }
      function oe(ce, it, Dt) {
        if (!Ce(Dt))
          throw new Error("Metadata provider not registered.");
        var Kt = te(ce, it);
        if (Kt !== Dt) {
          if (!q(Kt))
            return !1;
          var er = he.get(ce);
          q(er) && (er = new de(), he.set(ce, er)), er.set(it, Dt);
        }
        return !0;
      }
    }
    function or() {
      var T;
      return !q(ot) && Ve(h.Reflect) && Object.isExtensible(h.Reflect) && (T = h.Reflect[ot]), q(T) && (T = Lr()), !q(ot) && Ve(h.Reflect) && Object.isExtensible(h.Reflect) && Object.defineProperty(h.Reflect, ot, {
        enumerable: !1,
        configurable: !1,
        writable: !1,
        value: T
      }), T;
    }
    function Br(T) {
      var N = new ke(), F = {
        isProviderFor: function(Ce, oe) {
          var ce = N.get(Ce);
          return q(ce) ? !1 : ce.has(oe);
        },
        OrdinaryDefineOwnMetadata: Ct,
        OrdinaryHasOwnMetadata: he,
        OrdinaryGetOwnMetadata: St,
        OrdinaryOwnMetadataKeys: Ge,
        OrdinaryDeleteMetadata: te
      };
      return st.registerProvider(F), F;
      function Z(Ce, oe, ce) {
        var it = N.get(Ce), Dt = !1;
        if (q(it)) {
          if (!ce)
            return;
          it = new de(), N.set(Ce, it), Dt = !0;
        }
        var Kt = it.get(oe);
        if (q(Kt)) {
          if (!ce)
            return;
          if (Kt = new de(), it.set(oe, Kt), !T.setProvider(Ce, oe, F))
            throw it.delete(oe), Dt && N.delete(Ce), new Error("Wrong provider for target.");
        }
        return Kt;
      }
      function he(Ce, oe, ce) {
        var it = Z(
          oe,
          ce,
          /*Create*/
          !1
        );
        return q(it) ? !1 : vt(it.has(Ce));
      }
      function St(Ce, oe, ce) {
        var it = Z(
          oe,
          ce,
          /*Create*/
          !1
        );
        if (!q(it))
          return it.get(Ce);
      }
      function Ct(Ce, oe, ce, it) {
        var Dt = Z(
          ce,
          it,
          /*Create*/
          !0
        );
        Dt.set(Ce, oe);
      }
      function Ge(Ce, oe) {
        var ce = [], it = Z(
          Ce,
          oe,
          /*Create*/
          !1
        );
        if (q(it))
          return ce;
        for (var Dt = it.keys(), Kt = _n(Dt), er = 0; ; ) {
          var Fi = gr(Kt);
          if (!Fi)
            return ce.length = er, ce;
          var ni = yr(Fi);
          try {
            ce[er] = ni;
          } catch (mi) {
            try {
              Fn(Kt);
            } finally {
              throw mi;
            }
          }
          er++;
        }
      }
      function te(Ce, oe, ce) {
        var it = Z(
          oe,
          ce,
          /*Create*/
          !1
        );
        if (q(it) || !it.delete(Ce))
          return !1;
        if (it.size === 0) {
          var Dt = N.get(oe);
          q(Dt) || (Dt.delete(ce), Dt.size === 0 && N.delete(Dt));
        }
        return !0;
      }
    }
    function Jn(T) {
      var N = T.defineMetadata, F = T.hasOwnMetadata, Z = T.getOwnMetadata, he = T.getOwnMetadataKeys, St = T.deleteMetadata, Ct = new ke(), Ge = {
        isProviderFor: function(te, Ce) {
          var oe = Ct.get(te);
          return q(oe) ? he(te, Ce).length ? (q(oe) && (oe = new ve(), Ct.set(te, oe)), oe.add(Ce), !0) : !1 : oe.has(Ce);
        },
        OrdinaryDefineOwnMetadata: N,
        OrdinaryHasOwnMetadata: F,
        OrdinaryGetOwnMetadata: Z,
        OrdinaryOwnMetadataKeys: he,
        OrdinaryDeleteMetadata: St
      };
      return Ge;
    }
    function Wn(T, N, F) {
      var Z = st.getProvider(T, N);
      if (!q(Z))
        return Z;
      if (F) {
        if (st.setProvider(T, N, It))
          return It;
        throw new Error("Illegal state.");
      }
    }
    function hn() {
      var T = {}, N = [], F = (
        /** @class */
        function() {
          function Ge(te, Ce, oe) {
            this._index = 0, this._keys = te, this._values = Ce, this._selector = oe;
          }
          return Ge.prototype["@@iterator"] = function() {
            return this;
          }, Ge.prototype[C] = function() {
            return this;
          }, Ge.prototype.next = function() {
            var te = this._index;
            if (te >= 0 && te < this._keys.length) {
              var Ce = this._selector(this._keys[te], this._values[te]);
              return te + 1 >= this._keys.length ? (this._index = -1, this._keys = N, this._values = N) : this._index++, {
                value: Ce,
                done: !1
              };
            }
            return {
              value: void 0,
              done: !0
            };
          }, Ge.prototype.throw = function(te) {
            throw this._index >= 0 && (this._index = -1, this._keys = N, this._values = N), te;
          }, Ge.prototype.return = function(te) {
            return this._index >= 0 && (this._index = -1, this._keys = N, this._values = N), {
              value: te,
              done: !0
            };
          }, Ge;
        }()
      ), Z = (
        /** @class */
        function() {
          function Ge() {
            this._keys = [], this._values = [], this._cacheKey = T, this._cacheIndex = -2;
          }
          return Object.defineProperty(Ge.prototype, "size", {
            get: function() {
              return this._keys.length;
            },
            enumerable: !0,
            configurable: !0
          }), Ge.prototype.has = function(te) {
            return this._find(
              te,
              /*insert*/
              !1
            ) >= 0;
          }, Ge.prototype.get = function(te) {
            var Ce = this._find(
              te,
              /*insert*/
              !1
            );
            return Ce >= 0 ? this._values[Ce] : void 0;
          }, Ge.prototype.set = function(te, Ce) {
            var oe = this._find(
              te,
              /*insert*/
              !0
            );
            return this._values[oe] = Ce, this;
          }, Ge.prototype.delete = function(te) {
            var Ce = this._find(
              te,
              /*insert*/
              !1
            );
            if (Ce >= 0) {
              for (var oe = this._keys.length, ce = Ce + 1; ce < oe; ce++)
                this._keys[ce - 1] = this._keys[ce], this._values[ce - 1] = this._values[ce];
              return this._keys.length--, this._values.length--, Tn(te, this._cacheKey) && (this._cacheKey = T, this._cacheIndex = -2), !0;
            }
            return !1;
          }, Ge.prototype.clear = function() {
            this._keys.length = 0, this._values.length = 0, this._cacheKey = T, this._cacheIndex = -2;
          }, Ge.prototype.keys = function() {
            return new F(this._keys, this._values, he);
          }, Ge.prototype.values = function() {
            return new F(this._keys, this._values, St);
          }, Ge.prototype.entries = function() {
            return new F(this._keys, this._values, Ct);
          }, Ge.prototype["@@iterator"] = function() {
            return this.entries();
          }, Ge.prototype[C] = function() {
            return this.entries();
          }, Ge.prototype._find = function(te, Ce) {
            if (!Tn(this._cacheKey, te)) {
              this._cacheIndex = -1;
              for (var oe = 0; oe < this._keys.length; oe++)
                if (Tn(this._keys[oe], te)) {
                  this._cacheIndex = oe;
                  break;
                }
            }
            return this._cacheIndex < 0 && Ce && (this._cacheIndex = this._keys.length, this._keys.push(te), this._values.push(void 0)), this._cacheIndex;
          }, Ge;
        }()
      );
      return Z;
      function he(Ge, te) {
        return Ge;
      }
      function St(Ge, te) {
        return te;
      }
      function Ct(Ge, te) {
        return [
          Ge,
          te
        ];
      }
    }
    function Sr() {
      var T = (
        /** @class */
        function() {
          function N() {
            this._map = new de();
          }
          return Object.defineProperty(N.prototype, "size", {
            get: function() {
              return this._map.size;
            },
            enumerable: !0,
            configurable: !0
          }), N.prototype.has = function(F) {
            return this._map.has(F);
          }, N.prototype.add = function(F) {
            return this._map.set(F, F), this;
          }, N.prototype.delete = function(F) {
            return this._map.delete(F);
          }, N.prototype.clear = function() {
            this._map.clear();
          }, N.prototype.keys = function() {
            return this._map.keys();
          }, N.prototype.values = function() {
            return this._map.keys();
          }, N.prototype.entries = function() {
            return this._map.entries();
          }, N.prototype["@@iterator"] = function() {
            return this.keys();
          }, N.prototype[C] = function() {
            return this.keys();
          }, N;
        }()
      );
      return T;
    }
    function La() {
      var T = 16, N = _e.create(), F = Z();
      return (
        /** @class */
        function() {
          function te() {
            this._key = Z();
          }
          return te.prototype.has = function(Ce) {
            var oe = he(
              Ce,
              /*create*/
              !1
            );
            return oe !== void 0 ? _e.has(oe, this._key) : !1;
          }, te.prototype.get = function(Ce) {
            var oe = he(
              Ce,
              /*create*/
              !1
            );
            return oe !== void 0 ? _e.get(oe, this._key) : void 0;
          }, te.prototype.set = function(Ce, oe) {
            var ce = he(
              Ce,
              /*create*/
              !0
            );
            return ce[this._key] = oe, this;
          }, te.prototype.delete = function(Ce) {
            var oe = he(
              Ce,
              /*create*/
              !1
            );
            return oe !== void 0 ? delete oe[this._key] : !1;
          }, te.prototype.clear = function() {
            this._key = Z();
          }, te;
        }()
      );
      function Z() {
        var te;
        do
          te = "@@WeakMap@@" + Ge();
        while (_e.has(N, te));
        return N[te] = !0, te;
      }
      function he(te, Ce) {
        if (!_.call(te, F)) {
          if (!Ce)
            return;
          Object.defineProperty(te, F, {
            value: _e.create()
          });
        }
        return te[F];
      }
      function St(te, Ce) {
        for (var oe = 0; oe < Ce; ++oe)
          te[oe] = Math.random() * 255 | 0;
        return te;
      }
      function Ct(te) {
        return typeof Uint8Array == "function" ? typeof crypto < "u" ? crypto.getRandomValues(new Uint8Array(te)) : typeof msCrypto < "u" ? msCrypto.getRandomValues(new Uint8Array(te)) : St(new Uint8Array(te), te) : St(new Array(te), te);
      }
      function Ge() {
        var te = Ct(T);
        te[6] = te[6] & 79 | 64, te[8] = te[8] & 191 | 128;
        for (var Ce = "", oe = 0; oe < T; ++oe) {
          var ce = te[oe];
          (oe === 4 || oe === 6 || oe === 8) && (Ce += "-"), ce < 16 && (Ce += "0"), Ce += ce.toString(16).toLowerCase();
        }
        return Ce;
      }
    }
    function Cr(T) {
      return T.__ = void 0, delete T.__, T;
    }
  });
})(t1 || (t1 = {}));
class Pn {
  static _instance;
  _builder;
  _container;
  constructor() {
    this._builder = new fO();
  }
  static get instance() {
    return (this._instance == null || this._instance == null) && (this._instance = new Pn()), this._instance;
  }
  static addTransient(f, h) {
    return this.instance.addTransient(f, h);
  }
  static addScoped(f, h) {
    return this.instance.addScoped(f, h);
  }
  static addSingleton(f, h) {
    return this.instance.addSingleton(f, h);
  }
  static build() {
    this.instance.build();
  }
  addTransient(f, h) {
    if (this.isInitialized())
      throw Error("The inyector is already initialized.");
    return this.register(f, h).asTransient(), this;
  }
  addScoped(f, h) {
    if (this.isInitialized())
      throw Error("The inyector is already initialized.");
    return this.register(f, h).asInstancePerRequest(), this;
  }
  addSingleton(f, h) {
    if (this.isInitialized())
      throw Error("The inyector is already initialized.");
    return this.register(f, h).asSingleton(), this;
  }
  build() {
    if (this.isInitialized())
      throw Error("The inyector is already initialized.");
    this._container = this._builder.build();
  }
  static get(f) {
    return this._instance.get(f);
  }
  get(f) {
    if (!this.isInitialized())
      throw Error("The inyector is not initialized.");
    return this._container.get(f);
  }
  register(f, h) {
    return h == null ? this._builder.registerAndUse(f) : this._builder.register(h).use(f);
  }
  isInitialized() {
    return !(this._container == null || this._container == null);
  }
}
var pO = Object.defineProperty, vO = Object.getOwnPropertyDescriptor, hO = (g, f, h, _) => {
  for (var w = _ > 1 ? void 0 : _ ? vO(f, h) : f, M = g.length - 1, C; M >= 0; M--)
    (C = g[M]) && (w = (_ ? C(f, h, w) : C(w)) || w);
  return _ && w && pO(f, h, w), w;
};
let pv = class {
  _show = !1;
  logRed(g, ...f) {
    this.log("\x1B[31m%s\x1B[0m", g, ...f);
  }
  logGreen(g, ...f) {
    this.log("\x1B[32m%s\x1B[0m", g, ...f);
  }
  logYellow(g, ...f) {
    this.log("\x1B[33m%s\x1B[0m", g, ...f);
  }
  logBlue(g, ...f) {
    this.log("\x1B[34m%s\x1B[0m", g, ...f);
  }
  logMagenta(g, ...f) {
    this.log("\x1B[35m%s\x1B[0m", g, ...f);
  }
  logCyan(g, ...f) {
    this.log("\x1B[36m%s\x1B[0m", g, ...f);
  }
  logWhite(g, ...f) {
    this.log("\x1B[97m%s\x1B[0m", g, ...f);
  }
  logGray(g, ...f) {
    this.log("\x1B[37m%s\x1B[0m", g, ...f);
  }
  logEvent(g, ...f) {
    this.logGreen(g, f);
  }
  logValidation(g, ...f) {
    this.log("\x1B[92m%s\x1B[0m", g, ...f);
  }
  logInfo(g, ...f) {
    this.log("\x1B[34m%s\x1B[0m", g, ...f);
  }
  logError(g, ...f) {
    this.log("\x1B[31m%s\x1B[0m", g, ...f);
  }
  showLogs(g) {
    this._show = g;
  }
  log(g = "\x1B[31m%s\x1B[0m", f, ...h) {
    this._show && console.info(g, f, ...h);
  }
};
pv = hO([
  hi()
], pv);
var mO = Object.defineProperty, yO = Object.getOwnPropertyDescriptor, gO = (g, f, h, _) => {
  for (var w = _ > 1 ? void 0 : _ ? yO(f, h) : f, M = g.length - 1, C; M >= 0; M--)
    (C = g[M]) && (w = (_ ? C(f, h, w) : C(w)) || w);
  return _ && w && mO(f, h, w), w;
};
let n1 = class extends pv {
  log_OnInit(g, ...f) {
    this.logMagenta(g, f);
  }
  log_OnDestroy(g, ...f) {
    this.logYellow(g, f);
  }
  log_OnChange(g, ...f) {
    this.logBlue(g, f);
  }
  log_Render(g, ...f) {
    this.logCyan(g, f);
  }
};
n1 = gO([
  hi()
], n1);
class Jf {
  _id;
  get id() {
    return this._id;
  }
  constructor(f) {
    this._id = f;
  }
  equals(f) {
    return f == null ? !1 : this === f ? !0 : f instanceof this.constructor ? this.id.equals(f.id) : !1;
  }
  clone() {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}
class ji {
  _value;
  constructor(f) {
    this._value = f;
  }
  static newGuid() {
    return new ji(crypto.randomUUID());
  }
  static parse(f) {
    if (!f)
      throw new Error("Invalid guid");
    if (f.length !== 36)
      throw new Error("Invalid guid");
    if (f[8] !== "-" || f[13] !== "-" || f[18] !== "-" || f[23] !== "-")
      throw new Error("Invalid guid");
    return new ji(f);
  }
  toString() {
    return this._value;
  }
  equals(f) {
    return f == null ? !1 : this._value === f._value;
  }
}
class qu {
  _entities;
  constructor() {
    this._entities = /* @__PURE__ */ new Map();
  }
  static create() {
    return new qu();
  }
  static createFrom(f) {
    const h = new qu();
    return f.forEach((_) => {
      h.set(_);
    }), h;
  }
  contains(f) {
    return this._entities.has(f.toString());
  }
  getAll() {
    return Array.from(this._entities.values()).map((f) => f.clone());
  }
  getFirst() {
    const f = this._entities.values().next().value;
    return f ? f.clone() : null;
  }
  getById(f) {
    const h = this._entities.get(f.toString());
    return h ? h.clone() : null;
  }
  getByIdOrThrow(f) {
    const h = this._entities.get(f.toString());
    if (!h)
      throw new Error(`Entity with id ${f} not found`);
    return h.clone();
  }
  find(f) {
    const h = Array.from(this._entities.values()).find(f);
    return h ? h.clone() : null;
  }
  findOrThrow(f) {
    const h = Array.from(this._entities.values()).find(f);
    if (!h)
      throw new Error("Entity not found");
    return h.clone();
  }
  filter(f) {
    return Array.from(this._entities.values()).filter(f).map((_) => _.clone());
  }
  set(f) {
    const h = this._entities.get(f.id.toString());
    return this._entities.set(f.id.toString(), f), !h;
  }
  setAll(f) {
    f.forEach((h) => {
      this.set(h);
    });
  }
  remove(f) {
    return this._entities.get(f.toString()) ? (this._entities.delete(f.toString()), !0) : !1;
  }
  clear() {
    this._entities.clear();
  }
  get size() {
    return this._entities.size;
  }
}
class SO {
  name;
  static create;
}
class mv extends SO {
  _id;
  get id() {
    return this._id;
  }
  _payload;
  get payload() {
    return this._payload;
  }
  _occurredOn;
  get occurredOn() {
    return this._occurredOn;
  }
  constructor(f) {
    super(), this._id = ji.newGuid(), this._occurredOn = /* @__PURE__ */ new Date(), this._payload = f;
  }
}
class oC {
  _handler;
  get handler() {
    return this._handler;
  }
  _unsubscribeHandler;
  _hasUnsubscribed = !1;
  constructor(f, h) {
    this._handler = f, this._unsubscribeHandler = h;
  }
  static create(f, h) {
    return new oC(f, h);
  }
  unsubscribe() {
    this._hasUnsubscribed || (this._unsubscribeHandler(), this._hasUnsubscribed = !0);
  }
  invoke(f) {
    this._handler(f);
  }
}
class sC {
  _subscriptions;
  constructor() {
    this._subscriptions = [];
  }
  publish(f) {
    for (const h of this._subscriptions)
      h.invoke(f);
  }
  subscribe(f, h) {
    const _ = (M) => M instanceof f, w = oC.create((M) => {
      _(M) && h(M);
    }, this.unsubscribe.bind(this, h));
    return this._subscriptions.push(w), w;
  }
  subscribeTo(f, h, _) {
    const w = (M) => typeof h == "string" ? M.payload === h : typeof h == "object" ? Object.hasOwn(h, M.payload) : M.payload instanceof h;
    return this.subscribe(f, (M) => {
      w(M) && _(M);
    });
  }
  subscribeToKeys(f, h, _, w) {
    const M = (C) => Object.entries(_).every((me) => C.payload.hasOwnProperty(me[0]) && C.payload[me[0]] === _.get(me[0]));
    return this.subscribeTo(f, h, (C) => {
      M(C) && w(C);
    });
  }
  unsubscribe(f) {
    this._subscriptions = this._subscriptions.filter((h) => h.handler !== f);
  }
}
class CO {
}
class cC extends sC {
  static create() {
    return new cC();
  }
}
class uc extends mv {
  static create(f) {
    return new uc(f);
  }
}
var EO = Object.defineProperty, _O = Object.getOwnPropertyDescriptor, bO = (g, f, h, _) => {
  for (var w = _ > 1 ? void 0 : _ ? _O(f, h) : f, M = g.length - 1, C; M >= 0; M--)
    (C = g[M]) && (w = (_ ? C(f, h, w) : C(w)) || w);
  return _ && w && EO(f, h, w), w;
};
let X0 = class {
  constructor(g) {
    this._logger = g, this._entities = /* @__PURE__ */ new Map(), this._singlesEntities = /* @__PURE__ */ new Map(), this._eventBus = cC.create();
  }
  _entities;
  _singlesEntities;
  _eventBus;
  subscribe(g, f) {
    return this._eventBus.subscribe(g, f);
  }
  subscribeTo(g, f, h) {
    return this._eventBus.subscribeTo(g, f, h);
  }
  subscribeToKeys(g, f, h, _) {
    return this._eventBus.subscribeToKeys(g, f, h, _);
  }
  set(g, f) {
    let h = f?.name ?? g.constructor.name;
    this._entities.has(h) || this._entities.set(h, /* @__PURE__ */ new Map()), this._entities.get(h).set(g.id, g.clone());
    const _ = uc.create(g.clone());
    this._eventBus.publish(_), this._logger.logCyan("State updated (Set):", h, g);
  }
  setSingle(g, f) {
    const h = f?.name ?? g.constructor.name;
    this._singlesEntities.set(h, g.clone());
    const _ = uc.create(g.clone());
    this._eventBus.publish(_), this._logger.logCyan("State updated (SetSingle)", h, g);
  }
  get(g) {
    return this._singlesEntities.get(g.name)?.clone();
  }
  getOrThrow(g) {
    let f = this.get(g);
    if (!f)
      throw new Error(`${g.name} not found`);
    return f.clone();
  }
  getById(g, f) {
    return this._entities.get(g.name)?.get(f)?.clone();
  }
  getByIdOrThrow(g, f) {
    let h = this.getById(g, f);
    if (!h)
      throw new Error(`${g.name} not found`);
    return h.clone();
  }
  getAll(g) {
    if (!this._entities.has(g.name))
      return [];
    let f = [];
    for (let h of this._entities.get(g.name).values())
      f.push(h.clone());
    return f;
  }
  remove(g, f) {
    this._entities.has(g.name) && this._entities.get(g.name).delete(f);
  }
  find(g, f) {
    if (this._entities.has(g.name)) {
      for (let h of this._entities.get(g.name).values())
        if (f(h))
          return h.clone();
    }
  }
  findOrThrow(g, f) {
    let h = this.find(g, f);
    if (!h)
      throw new Error(`${g.name} not found`);
    return h.clone();
  }
  filter(g, f) {
    if (!this._entities.has(g.name))
      return [];
    let h = [];
    for (let _ of this._entities.get(g.name).values())
      f(_) && h.push(_.clone());
    return h;
  }
  filterOrThrow(g, f) {
    let h = this.filter(g, f);
    if (h.length === 0)
      throw new Error(`${g.name} not found`);
    return h;
  }
};
X0 = bO([
  hi()
], X0);
var wO = Object.defineProperty, RO = Object.getOwnPropertyDescriptor, TO = (g, f, h, _) => {
  for (var w = _ > 1 ? void 0 : _ ? RO(f, h) : f, M = g.length - 1, C; M >= 0; M--)
    (C = g[M]) && (w = (_ ? C(f, h, w) : C(w)) || w);
  return _ && w && wO(f, h, w), w;
};
let oc = class {
  _animationsVelocity = 1;
  constructor() {
    this.setVelocity(this._animationsVelocity);
  }
  static create() {
    return new oc();
  }
  setVelocity(g) {
    g < 0.5 && (g = 0.5), g > 3 && (g = 0.5), document.querySelector(":root")?.style?.setProperty("--animations-velocity", `${g}s`);
  }
  addVelocity() {
    this.setVelocity(this.getVelocity() + 0.5);
  }
  getVelocity() {
    const g = document.querySelector(":root")?.style?.getPropertyValue(
      "--animations-velocity"
      /* AnimationsVelocity */
    )?.split("s")[0];
    return g ? parseFloat(g) : 1;
  }
  getAnimationsDuration(g) {
    const f = getComputedStyle(g).animationDuration;
    return f ? parseFloat(f.substring(0, f.length)) : void 0;
  }
};
oc = TO([
  hi()
], oc);
class xO extends X0 {
}
var K0 = { exports: {} }, cv = {}, ly = { exports: {} }, Pt = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var r1;
function DO() {
  if (r1)
    return Pt;
  r1 = 1;
  var g = Symbol.for("react.element"), f = Symbol.for("react.portal"), h = Symbol.for("react.fragment"), _ = Symbol.for("react.strict_mode"), w = Symbol.for("react.profiler"), M = Symbol.for("react.provider"), C = Symbol.for("react.context"), me = Symbol.for("react.forward_ref"), J = Symbol.for("react.suspense"), ie = Symbol.for("react.memo"), _e = Symbol.for("react.lazy"), ee = Symbol.iterator;
  function de(O) {
    return O === null || typeof O != "object" ? null : (O = ee && O[ee] || O["@@iterator"], typeof O == "function" ? O : null);
  }
  var ve = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, ke = Object.assign, ot = {};
  function st(O, K, q) {
    this.props = O, this.context = K, this.refs = ot, this.updater = q || ve;
  }
  st.prototype.isReactComponent = {}, st.prototype.setState = function(O, K) {
    if (typeof O != "object" && typeof O != "function" && O != null)
      throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, O, K, "setState");
  }, st.prototype.forceUpdate = function(O) {
    this.updater.enqueueForceUpdate(this, O, "forceUpdate");
  };
  function It() {
  }
  It.prototype = st.prototype;
  function $e(O, K, q) {
    this.props = O, this.context = K, this.refs = ot, this.updater = q || ve;
  }
  var He = $e.prototype = new It();
  He.constructor = $e, ke(He, st.prototype), He.isPureReactComponent = !0;
  var mt = Array.isArray, je = Object.prototype.hasOwnProperty, yt = {
    current: null
  }, nt = {
    key: !0,
    ref: !0,
    __self: !0,
    __source: !0
  };
  function an(O, K, q) {
    var We, Je = {}, Ve = null, gt = null;
    if (K != null)
      for (We in K.ref !== void 0 && (gt = K.ref), K.key !== void 0 && (Ve = "" + K.key), K)
        je.call(K, We) && !nt.hasOwnProperty(We) && (Je[We] = K[We]);
    var wt = arguments.length - 2;
    if (wt === 1)
      Je.children = q;
    else if (1 < wt) {
      for (var vt = Array(wt), Yt = 0; Yt < wt; Yt++)
        vt[Yt] = arguments[Yt + 2];
      Je.children = vt;
    }
    if (O && O.defaultProps)
      for (We in wt = O.defaultProps, wt)
        Je[We] === void 0 && (Je[We] = wt[We]);
    return {
      $$typeof: g,
      type: O,
      key: Ve,
      ref: gt,
      props: Je,
      _owner: yt.current
    };
  }
  function Rn(O, K) {
    return {
      $$typeof: g,
      type: O.type,
      key: K,
      ref: O.ref,
      props: O.props,
      _owner: O._owner
    };
  }
  function Xt(O) {
    return typeof O == "object" && O !== null && O.$$typeof === g;
  }
  function jt(O) {
    var K = {
      "=": "=0",
      ":": "=2"
    };
    return "$" + O.replace(/[=:]/g, function(q) {
      return K[q];
    });
  }
  var En = /\/+/g;
  function Xe(O, K) {
    return typeof O == "object" && O !== null && O.key != null ? jt("" + O.key) : K.toString(36);
  }
  function ct(O, K, q, We, Je) {
    var Ve = typeof O;
    (Ve === "undefined" || Ve === "boolean") && (O = null);
    var gt = !1;
    if (O === null)
      gt = !0;
    else
      switch (Ve) {
        case "string":
        case "number":
          gt = !0;
          break;
        case "object":
          switch (O.$$typeof) {
            case g:
            case f:
              gt = !0;
          }
      }
    if (gt)
      return gt = O, Je = Je(gt), O = We === "" ? "." + Xe(gt, 0) : We, mt(Je) ? (q = "", O != null && (q = O.replace(En, "$&/") + "/"), ct(Je, K, q, "", function(Yt) {
        return Yt;
      })) : Je != null && (Xt(Je) && (Je = Rn(Je, q + (!Je.key || gt && gt.key === Je.key ? "" : ("" + Je.key).replace(En, "$&/") + "/") + O)), K.push(Je)), 1;
    if (gt = 0, We = We === "" ? "." : We + ":", mt(O))
      for (var wt = 0; wt < O.length; wt++) {
        Ve = O[wt];
        var vt = We + Xe(Ve, wt);
        gt += ct(Ve, K, q, vt, Je);
      }
    else if (vt = de(O), typeof vt == "function")
      for (O = vt.call(O), wt = 0; !(Ve = O.next()).done; )
        Ve = Ve.value, vt = We + Xe(Ve, wt++), gt += ct(Ve, K, q, vt, Je);
    else if (Ve === "object")
      throw K = String(O), Error("Objects are not valid as a React child (found: " + (K === "[object Object]" ? "object with keys {" + Object.keys(O).join(", ") + "}" : K) + "). If you meant to render a collection of children, use an array instead.");
    return gt;
  }
  function Ft(O, K, q) {
    if (O == null)
      return O;
    var We = [], Je = 0;
    return ct(O, We, "", "", function(Ve) {
      return K.call(q, Ve, Je++);
    }), We;
  }
  function Ot(O) {
    if (O._status === -1) {
      var K = O._result;
      K = K(), K.then(function(q) {
        (O._status === 0 || O._status === -1) && (O._status = 1, O._result = q);
      }, function(q) {
        (O._status === 0 || O._status === -1) && (O._status = 2, O._result = q);
      }), O._status === -1 && (O._status = 0, O._result = K);
    }
    if (O._status === 1)
      return O._result.default;
    throw O._result;
  }
  var Oe = {
    current: null
  }, se = {
    transition: null
  }, Pe = {
    ReactCurrentDispatcher: Oe,
    ReactCurrentBatchConfig: se,
    ReactCurrentOwner: yt
  };
  return Pt.Children = {
    map: Ft,
    forEach: function(O, K, q) {
      Ft(O, function() {
        K.apply(this, arguments);
      }, q);
    },
    count: function(O) {
      var K = 0;
      return Ft(O, function() {
        K++;
      }), K;
    },
    toArray: function(O) {
      return Ft(O, function(K) {
        return K;
      }) || [];
    },
    only: function(O) {
      if (!Xt(O))
        throw Error("React.Children.only expected to receive a single React element child.");
      return O;
    }
  }, Pt.Component = st, Pt.Fragment = h, Pt.Profiler = w, Pt.PureComponent = $e, Pt.StrictMode = _, Pt.Suspense = J, Pt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Pe, Pt.cloneElement = function(O, K, q) {
    if (O == null)
      throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + O + ".");
    var We = ke({}, O.props), Je = O.key, Ve = O.ref, gt = O._owner;
    if (K != null) {
      if (K.ref !== void 0 && (Ve = K.ref, gt = yt.current), K.key !== void 0 && (Je = "" + K.key), O.type && O.type.defaultProps)
        var wt = O.type.defaultProps;
      for (vt in K)
        je.call(K, vt) && !nt.hasOwnProperty(vt) && (We[vt] = K[vt] === void 0 && wt !== void 0 ? wt[vt] : K[vt]);
    }
    var vt = arguments.length - 2;
    if (vt === 1)
      We.children = q;
    else if (1 < vt) {
      wt = Array(vt);
      for (var Yt = 0; Yt < vt; Yt++)
        wt[Yt] = arguments[Yt + 2];
      We.children = wt;
    }
    return {
      $$typeof: g,
      type: O.type,
      key: Je,
      ref: Ve,
      props: We,
      _owner: gt
    };
  }, Pt.createContext = function(O) {
    return O = {
      $$typeof: C,
      _currentValue: O,
      _currentValue2: O,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null
    }, O.Provider = {
      $$typeof: M,
      _context: O
    }, O.Consumer = O;
  }, Pt.createElement = an, Pt.createFactory = function(O) {
    var K = an.bind(null, O);
    return K.type = O, K;
  }, Pt.createRef = function() {
    return {
      current: null
    };
  }, Pt.forwardRef = function(O) {
    return {
      $$typeof: me,
      render: O
    };
  }, Pt.isValidElement = Xt, Pt.lazy = function(O) {
    return {
      $$typeof: _e,
      _payload: {
        _status: -1,
        _result: O
      },
      _init: Ot
    };
  }, Pt.memo = function(O, K) {
    return {
      $$typeof: ie,
      type: O,
      compare: K === void 0 ? null : K
    };
  }, Pt.startTransition = function(O) {
    var K = se.transition;
    se.transition = {};
    try {
      O();
    } finally {
      se.transition = K;
    }
  }, Pt.unstable_act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  }, Pt.useCallback = function(O, K) {
    return Oe.current.useCallback(O, K);
  }, Pt.useContext = function(O) {
    return Oe.current.useContext(O);
  }, Pt.useDebugValue = function() {
  }, Pt.useDeferredValue = function(O) {
    return Oe.current.useDeferredValue(O);
  }, Pt.useEffect = function(O, K) {
    return Oe.current.useEffect(O, K);
  }, Pt.useId = function() {
    return Oe.current.useId();
  }, Pt.useImperativeHandle = function(O, K, q) {
    return Oe.current.useImperativeHandle(O, K, q);
  }, Pt.useInsertionEffect = function(O, K) {
    return Oe.current.useInsertionEffect(O, K);
  }, Pt.useLayoutEffect = function(O, K) {
    return Oe.current.useLayoutEffect(O, K);
  }, Pt.useMemo = function(O, K) {
    return Oe.current.useMemo(O, K);
  }, Pt.useReducer = function(O, K, q) {
    return Oe.current.useReducer(O, K, q);
  }, Pt.useRef = function(O) {
    return Oe.current.useRef(O);
  }, Pt.useState = function(O) {
    return Oe.current.useState(O);
  }, Pt.useSyncExternalStore = function(O, K, q) {
    return Oe.current.useSyncExternalStore(O, K, q);
  }, Pt.useTransition = function() {
    return Oe.current.useTransition();
  }, Pt.version = "18.2.0", Pt;
}
var dv = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
dv.exports;
var a1;
function OO() {
  return a1 || (a1 = 1, function(g, f) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var h = "18.2.0", _ = Symbol.for("react.element"), w = Symbol.for("react.portal"), M = Symbol.for("react.fragment"), C = Symbol.for("react.strict_mode"), me = Symbol.for("react.profiler"), J = Symbol.for("react.provider"), ie = Symbol.for("react.context"), _e = Symbol.for("react.forward_ref"), ee = Symbol.for("react.suspense"), de = Symbol.for("react.suspense_list"), ve = Symbol.for("react.memo"), ke = Symbol.for("react.lazy"), ot = Symbol.for("react.offscreen"), st = Symbol.iterator, It = "@@iterator";
      function $e(y) {
        if (y === null || typeof y != "object")
          return null;
        var x = st && y[st] || y[It];
        return typeof x == "function" ? x : null;
      }
      var He = {
        /**
        * @internal
        * @type {ReactComponent}
        */
        current: null
      }, mt = {
        transition: null
      }, je = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, yt = {
        /**
        * @internal
        * @type {ReactComponent}
        */
        current: null
      }, nt = {}, an = null;
      function Rn(y) {
        an = y;
      }
      nt.setExtraStackFrame = function(y) {
        an = y;
      }, nt.getCurrentStack = null, nt.getStackAddendum = function() {
        var y = "";
        an && (y += an);
        var x = nt.getCurrentStack;
        return x && (y += x() || ""), y;
      };
      var Xt = !1, jt = !1, En = !1, Xe = !1, ct = !1, Ft = {
        ReactCurrentDispatcher: He,
        ReactCurrentBatchConfig: mt,
        ReactCurrentOwner: yt
      };
      Ft.ReactDebugCurrentFrame = nt, Ft.ReactCurrentActQueue = je;
      function Ot(y) {
        {
          for (var x = arguments.length, V = new Array(x > 1 ? x - 1 : 0), Y = 1; Y < x; Y++)
            V[Y - 1] = arguments[Y];
          se("warn", y, V);
        }
      }
      function Oe(y) {
        {
          for (var x = arguments.length, V = new Array(x > 1 ? x - 1 : 0), Y = 1; Y < x; Y++)
            V[Y - 1] = arguments[Y];
          se("error", y, V);
        }
      }
      function se(y, x, V) {
        {
          var Y = Ft.ReactDebugCurrentFrame, fe = Y.getStackAddendum();
          fe !== "" && (x += "%s", V = V.concat([
            fe
          ]));
          var et = V.map(function(Ee) {
            return String(Ee);
          });
          et.unshift("Warning: " + x), Function.prototype.apply.call(console[y], console, et);
        }
      }
      var Pe = {};
      function O(y, x) {
        {
          var V = y.constructor, Y = V && (V.displayName || V.name) || "ReactClass", fe = Y + "." + x;
          if (Pe[fe])
            return;
          Oe("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", x, Y), Pe[fe] = !0;
        }
      }
      var K = {
        /**
        * Checks whether or not this composite component is mounted.
        * @param {ReactClass} publicInstance The instance we want to test.
        * @return {boolean} True if mounted, false otherwise.
        * @protected
        * @final
        */
        isMounted: function(y) {
          return !1;
        },
        /**
        * Forces an update. This should only be invoked when it is known with
        * certainty that we are **not** in a DOM transaction.
        *
        * You may want to call this when you know that some deeper aspect of the
        * component's state has changed but `setState` was not called.
        *
        * This will not invoke `shouldComponentUpdate`, but it will invoke
        * `componentWillUpdate` and `componentDidUpdate`.
        *
        * @param {ReactClass} publicInstance The instance that should rerender.
        * @param {?function} callback Called after component is updated.
        * @param {?string} callerName name of the calling function in the public API.
        * @internal
        */
        enqueueForceUpdate: function(y, x, V) {
          O(y, "forceUpdate");
        },
        /**
        * Replaces all of the state. Always use this or `setState` to mutate state.
        * You should treat `this.state` as immutable.
        *
        * There is no guarantee that `this.state` will be immediately updated, so
        * accessing `this.state` after calling this method may return the old value.
        *
        * @param {ReactClass} publicInstance The instance that should rerender.
        * @param {object} completeState Next state.
        * @param {?function} callback Called after component is updated.
        * @param {?string} callerName name of the calling function in the public API.
        * @internal
        */
        enqueueReplaceState: function(y, x, V, Y) {
          O(y, "replaceState");
        },
        /**
        * Sets a subset of the state. This only exists because _pendingState is
        * internal. This provides a merging strategy that is not available to deep
        * properties which is confusing. TODO: Expose pendingState or don't use it
        * during the merge.
        *
        * @param {ReactClass} publicInstance The instance that should rerender.
        * @param {object} partialState Next partial state to be merged with state.
        * @param {?function} callback Called after component is updated.
        * @param {?string} Name of the calling function in the public API.
        * @internal
        */
        enqueueSetState: function(y, x, V, Y) {
          O(y, "setState");
        }
      }, q = Object.assign, We = {};
      Object.freeze(We);
      function Je(y, x, V) {
        this.props = y, this.context = x, this.refs = We, this.updater = V || K;
      }
      Je.prototype.isReactComponent = {}, Je.prototype.setState = function(y, x) {
        if (typeof y != "object" && typeof y != "function" && y != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, y, x, "setState");
      }, Je.prototype.forceUpdate = function(y) {
        this.updater.enqueueForceUpdate(this, y, "forceUpdate");
      };
      {
        var Ve = {
          isMounted: [
            "isMounted",
            "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
          ],
          replaceState: [
            "replaceState",
            "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
          ]
        }, gt = function(y, x) {
          Object.defineProperty(Je.prototype, y, {
            get: function() {
              Ot("%s(...) is deprecated in plain JavaScript React classes. %s", x[0], x[1]);
            }
          });
        };
        for (var wt in Ve)
          Ve.hasOwnProperty(wt) && gt(wt, Ve[wt]);
      }
      function vt() {
      }
      vt.prototype = Je.prototype;
      function Yt(y, x, V) {
        this.props = y, this.context = x, this.refs = We, this.updater = V || K;
      }
      var vn = Yt.prototype = new vt();
      vn.constructor = Yt, q(vn, Je.prototype), vn.isPureReactComponent = !0;
      function Zn() {
        var y = {
          current: null
        };
        return Object.seal(y), y;
      }
      var jn = Array.isArray;
      function cn(y) {
        return jn(y);
      }
      function In(y) {
        {
          var x = typeof Symbol == "function" && Symbol.toStringTag, V = x && y[Symbol.toStringTag] || y.constructor.name || "Object";
          return V;
        }
      }
      function Tn(y) {
        try {
          return Nn(y), !1;
        } catch {
          return !0;
        }
      }
      function Nn(y) {
        return "" + y;
      }
      function _n(y) {
        if (Tn(y))
          return Oe("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", In(y)), Nn(y);
      }
      function yr(y, x, V) {
        var Y = y.displayName;
        if (Y)
          return Y;
        var fe = x.displayName || x.name || "";
        return fe !== "" ? V + "(" + fe + ")" : V;
      }
      function gr(y) {
        return y.displayName || "Context";
      }
      function Fn(y) {
        if (y == null)
          return null;
        if (typeof y.tag == "number" && Oe("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof y == "function")
          return y.displayName || y.name || null;
        if (typeof y == "string")
          return y;
        switch (y) {
          case M:
            return "Fragment";
          case w:
            return "Portal";
          case me:
            return "Profiler";
          case C:
            return "StrictMode";
          case ee:
            return "Suspense";
          case de:
            return "SuspenseList";
        }
        if (typeof y == "object")
          switch (y.$$typeof) {
            case ie:
              var x = y;
              return gr(x) + ".Consumer";
            case J:
              var V = y;
              return gr(V._context) + ".Provider";
            case _e:
              return yr(y, y.render, "ForwardRef");
            case ve:
              var Y = y.displayName || null;
              return Y !== null ? Y : Fn(y.type) || "Memo";
            case ke: {
              var fe = y, et = fe._payload, Ee = fe._init;
              try {
                return Fn(Ee(et));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var Yn = Object.prototype.hasOwnProperty, Lr = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, or, Br, Jn;
      Jn = {};
      function Wn(y) {
        if (Yn.call(y, "ref")) {
          var x = Object.getOwnPropertyDescriptor(y, "ref").get;
          if (x && x.isReactWarning)
            return !1;
        }
        return y.ref !== void 0;
      }
      function hn(y) {
        if (Yn.call(y, "key")) {
          var x = Object.getOwnPropertyDescriptor(y, "key").get;
          if (x && x.isReactWarning)
            return !1;
        }
        return y.key !== void 0;
      }
      function Sr(y, x) {
        var V = function() {
          or || (or = !0, Oe("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", x));
        };
        V.isReactWarning = !0, Object.defineProperty(y, "key", {
          get: V,
          configurable: !0
        });
      }
      function La(y, x) {
        var V = function() {
          Br || (Br = !0, Oe("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", x));
        };
        V.isReactWarning = !0, Object.defineProperty(y, "ref", {
          get: V,
          configurable: !0
        });
      }
      function Cr(y) {
        if (typeof y.ref == "string" && yt.current && y.__self && yt.current.stateNode !== y.__self) {
          var x = Fn(yt.current.type);
          Jn[x] || (Oe('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', x, y.ref), Jn[x] = !0);
        }
      }
      var T = function(y, x, V, Y, fe, et, Ee) {
        var Ke = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: _,
          // Built-in properties that belong on the element
          type: y,
          key: x,
          ref: V,
          props: Ee,
          // Record the component responsible for creating this element.
          _owner: et
        };
        return Ke._store = {}, Object.defineProperty(Ke._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(Ke, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: Y
        }), Object.defineProperty(Ke, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: fe
        }), Object.freeze && (Object.freeze(Ke.props), Object.freeze(Ke)), Ke;
      };
      function N(y, x, V) {
        var Y, fe = {}, et = null, Ee = null, Ke = null, Tt = null;
        if (x != null) {
          Wn(x) && (Ee = x.ref, Cr(x)), hn(x) && (_n(x.key), et = "" + x.key), Ke = x.__self === void 0 ? null : x.__self, Tt = x.__source === void 0 ? null : x.__source;
          for (Y in x)
            Yn.call(x, Y) && !Lr.hasOwnProperty(Y) && (fe[Y] = x[Y]);
        }
        var Vt = arguments.length - 2;
        if (Vt === 1)
          fe.children = V;
        else if (Vt > 1) {
          for (var ln = Array(Vt), tn = 0; tn < Vt; tn++)
            ln[tn] = arguments[tn + 2];
          Object.freeze && Object.freeze(ln), fe.children = ln;
        }
        if (y && y.defaultProps) {
          var un = y.defaultProps;
          for (Y in un)
            fe[Y] === void 0 && (fe[Y] = un[Y]);
        }
        if (et || Ee) {
          var pn = typeof y == "function" ? y.displayName || y.name || "Unknown" : y;
          et && Sr(fe, pn), Ee && La(fe, pn);
        }
        return T(y, et, Ee, Ke, Tt, yt.current, fe);
      }
      function F(y, x) {
        var V = T(y.type, x, y.ref, y._self, y._source, y._owner, y.props);
        return V;
      }
      function Z(y, x, V) {
        if (y == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + y + ".");
        var Y, fe = q({}, y.props), et = y.key, Ee = y.ref, Ke = y._self, Tt = y._source, Vt = y._owner;
        if (x != null) {
          Wn(x) && (Ee = x.ref, Vt = yt.current), hn(x) && (_n(x.key), et = "" + x.key);
          var ln;
          y.type && y.type.defaultProps && (ln = y.type.defaultProps);
          for (Y in x)
            Yn.call(x, Y) && !Lr.hasOwnProperty(Y) && (x[Y] === void 0 && ln !== void 0 ? fe[Y] = ln[Y] : fe[Y] = x[Y]);
        }
        var tn = arguments.length - 2;
        if (tn === 1)
          fe.children = V;
        else if (tn > 1) {
          for (var un = Array(tn), pn = 0; pn < tn; pn++)
            un[pn] = arguments[pn + 2];
          fe.children = un;
        }
        return T(y.type, et, Ee, Ke, Tt, Vt, fe);
      }
      function he(y) {
        return typeof y == "object" && y !== null && y.$$typeof === _;
      }
      var St = ".", Ct = ":";
      function Ge(y) {
        var x = /[=:]/g, V = {
          "=": "=0",
          ":": "=2"
        }, Y = y.replace(x, function(fe) {
          return V[fe];
        });
        return "$" + Y;
      }
      var te = !1, Ce = /\/+/g;
      function oe(y) {
        return y.replace(Ce, "$&/");
      }
      function ce(y, x) {
        return typeof y == "object" && y !== null && y.key != null ? (_n(y.key), Ge("" + y.key)) : x.toString(36);
      }
      function it(y, x, V, Y, fe) {
        var et = typeof y;
        (et === "undefined" || et === "boolean") && (y = null);
        var Ee = !1;
        if (y === null)
          Ee = !0;
        else
          switch (et) {
            case "string":
            case "number":
              Ee = !0;
              break;
            case "object":
              switch (y.$$typeof) {
                case _:
                case w:
                  Ee = !0;
              }
          }
        if (Ee) {
          var Ke = y, Tt = fe(Ke), Vt = Y === "" ? St + ce(Ke, 0) : Y;
          if (cn(Tt)) {
            var ln = "";
            Vt != null && (ln = oe(Vt) + "/"), it(Tt, x, ln, "", function(ad) {
              return ad;
            });
          } else
            Tt != null && (he(Tt) && (Tt.key && (!Ke || Ke.key !== Tt.key) && _n(Tt.key), Tt = F(
              Tt,
              // traverseAllChildren used to do for objects as children
              V + (Tt.key && (!Ke || Ke.key !== Tt.key) ? (
                // eslint-disable-next-line react-internal/safe-string-coercion
                oe("" + Tt.key) + "/"
              ) : "") + Vt
            )), x.push(Tt));
          return 1;
        }
        var tn, un, pn = 0, Nt = Y === "" ? St : Y + Ct;
        if (cn(y))
          for (var Vi = 0; Vi < y.length; Vi++)
            tn = y[Vi], un = Nt + ce(tn, Vi), pn += it(tn, x, V, un, fe);
        else {
          var oo = $e(y);
          if (typeof oo == "function") {
            var us = y;
            oo === us.entries && (te || Ot("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), te = !0);
            for (var rd = oo.call(us), li, os = 0; !(li = rd.next()).done; )
              tn = li.value, un = Nt + ce(tn, os++), pn += it(tn, x, V, un, fe);
          } else if (et === "object") {
            var ss = String(y);
            throw new Error("Objects are not valid as a React child (found: " + (ss === "[object Object]" ? "object with keys {" + Object.keys(y).join(", ") + "}" : ss) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return pn;
      }
      function Dt(y, x, V) {
        if (y == null)
          return y;
        var Y = [], fe = 0;
        return it(y, Y, "", "", function(et) {
          return x.call(V, et, fe++);
        }), Y;
      }
      function Kt(y) {
        var x = 0;
        return Dt(y, function() {
          x++;
        }), x;
      }
      function er(y, x, V) {
        Dt(y, function() {
          x.apply(this, arguments);
        }, V);
      }
      function Fi(y) {
        return Dt(y, function(x) {
          return x;
        }) || [];
      }
      function ni(y) {
        if (!he(y))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return y;
      }
      function mi(y) {
        var x = {
          $$typeof: ie,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: y,
          _currentValue2: y,
          // Used to track how many concurrent renderers this context currently
          // supports within in a single renderer. Such as parallel server rendering.
          _threadCount: 0,
          // These are circular
          Provider: null,
          Consumer: null,
          // Add these to use same hidden class in VM as ServerContext
          _defaultValue: null,
          _globalName: null
        };
        x.Provider = {
          $$typeof: J,
          _context: x
        };
        var V = !1, Y = !1, fe = !1;
        {
          var et = {
            $$typeof: ie,
            _context: x
          };
          Object.defineProperties(et, {
            Provider: {
              get: function() {
                return Y || (Y = !0, Oe("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), x.Provider;
              },
              set: function(Ee) {
                x.Provider = Ee;
              }
            },
            _currentValue: {
              get: function() {
                return x._currentValue;
              },
              set: function(Ee) {
                x._currentValue = Ee;
              }
            },
            _currentValue2: {
              get: function() {
                return x._currentValue2;
              },
              set: function(Ee) {
                x._currentValue2 = Ee;
              }
            },
            _threadCount: {
              get: function() {
                return x._threadCount;
              },
              set: function(Ee) {
                x._threadCount = Ee;
              }
            },
            Consumer: {
              get: function() {
                return V || (V = !0, Oe("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), x.Consumer;
              }
            },
            displayName: {
              get: function() {
                return x.displayName;
              },
              set: function(Ee) {
                fe || (Ot("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", Ee), fe = !0);
              }
            }
          }), x.Consumer = et;
        }
        return x._currentRenderer = null, x._currentRenderer2 = null, x;
      }
      var Sa = -1, yi = 0, Ca = 1, gi = 2;
      function Vr(y) {
        if (y._status === Sa) {
          var x = y._result, V = x();
          if (V.then(function(et) {
            if (y._status === yi || y._status === Sa) {
              var Ee = y;
              Ee._status = Ca, Ee._result = et;
            }
          }, function(et) {
            if (y._status === yi || y._status === Sa) {
              var Ee = y;
              Ee._status = gi, Ee._result = et;
            }
          }), y._status === Sa) {
            var Y = y;
            Y._status = yi, Y._result = V;
          }
        }
        if (y._status === Ca) {
          var fe = y._result;
          return fe === void 0 && Oe(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, fe), "default" in fe || Oe(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, fe), fe.default;
        } else
          throw y._result;
      }
      function Ea(y) {
        var x = {
          // We use these fields to store the result.
          _status: Sa,
          _result: y
        }, V = {
          $$typeof: ke,
          _payload: x,
          _init: Vr
        };
        {
          var Y, fe;
          Object.defineProperties(V, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return Y;
              },
              set: function(et) {
                Oe("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), Y = et, Object.defineProperty(V, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return fe;
              },
              set: function(et) {
                Oe("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), fe = et, Object.defineProperty(V, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return V;
      }
      function Si(y) {
        y != null && y.$$typeof === ve ? Oe("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof y != "function" ? Oe("forwardRef requires a render function but was given %s.", y === null ? "null" : typeof y) : y.length !== 0 && y.length !== 2 && Oe("forwardRef render functions accept exactly two parameters: props and ref. %s", y.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), y != null && (y.defaultProps != null || y.propTypes != null) && Oe("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var x = {
          $$typeof: _e,
          render: y
        };
        {
          var V;
          Object.defineProperty(x, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return V;
            },
            set: function(Y) {
              V = Y, !y.name && !y.displayName && (y.displayName = Y);
            }
          });
        }
        return x;
      }
      var D;
      D = Symbol.for("react.module.reference");
      function ne(y) {
        return !!(typeof y == "string" || typeof y == "function" || y === M || y === me || ct || y === C || y === ee || y === de || Xe || y === ot || Xt || jt || En || typeof y == "object" && y !== null && (y.$$typeof === ke || y.$$typeof === ve || y.$$typeof === J || y.$$typeof === ie || y.$$typeof === _e || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        y.$$typeof === D || y.getModuleId !== void 0));
      }
      function ye(y, x) {
        ne(y) || Oe("memo: The first argument must be a component. Instead received: %s", y === null ? "null" : typeof y);
        var V = {
          $$typeof: ve,
          type: y,
          compare: x === void 0 ? null : x
        };
        {
          var Y;
          Object.defineProperty(V, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return Y;
            },
            set: function(fe) {
              Y = fe, !y.name && !y.displayName && (y.displayName = fe);
            }
          });
        }
        return V;
      }
      function Te() {
        var y = He.current;
        return y === null && Oe(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), y;
      }
      function ht(y) {
        var x = Te();
        if (y._context !== void 0) {
          var V = y._context;
          V.Consumer === y ? Oe("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : V.Provider === y && Oe("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return x.useContext(y);
      }
      function Lt(y) {
        var x = Te();
        return x.useState(y);
      }
      function Et(y, x, V) {
        var Y = Te();
        return Y.useReducer(y, x, V);
      }
      function Qe(y) {
        var x = Te();
        return x.useRef(y);
      }
      function Gn(y, x) {
        var V = Te();
        return V.useEffect(y, x);
      }
      function fn(y, x) {
        var V = Te();
        return V.useInsertionEffect(y, x);
      }
      function dn(y, x) {
        var V = Te();
        return V.useLayoutEffect(y, x);
      }
      function Er(y, x) {
        var V = Te();
        return V.useCallback(y, x);
      }
      function Ci(y, x) {
        var V = Te();
        return V.useMemo(y, x);
      }
      function Ku(y, x, V) {
        var Y = Te();
        return Y.useImperativeHandle(y, x, V);
      }
      function Ht(y, x) {
        {
          var V = Te();
          return V.useDebugValue(y, x);
        }
      }
      function td() {
        var y = Te();
        return y.useTransition();
      }
      function ri(y) {
        var x = Te();
        return x.useDeferredValue(y);
      }
      function Rt() {
        var y = Te();
        return y.useId();
      }
      function Ei(y, x, V) {
        var Y = Te();
        return Y.useSyncExternalStore(y, x, V);
      }
      var yl = 0, Zu, gl, na, rs, $r, as, is;
      function cc() {
      }
      cc.__reactDisabledLog = !0;
      function Ju() {
        {
          if (yl === 0) {
            Zu = console.log, gl = console.info, na = console.warn, rs = console.error, $r = console.group, as = console.groupCollapsed, is = console.groupEnd;
            var y = {
              configurable: !0,
              enumerable: !0,
              value: cc,
              writable: !0
            };
            Object.defineProperties(console, {
              info: y,
              log: y,
              warn: y,
              error: y,
              group: y,
              groupCollapsed: y,
              groupEnd: y
            });
          }
          yl++;
        }
      }
      function Sl() {
        {
          if (yl--, yl === 0) {
            var y = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: q({}, y, {
                value: Zu
              }),
              info: q({}, y, {
                value: gl
              }),
              warn: q({}, y, {
                value: na
              }),
              error: q({}, y, {
                value: rs
              }),
              group: q({}, y, {
                value: $r
              }),
              groupCollapsed: q({}, y, {
                value: as
              }),
              groupEnd: q({}, y, {
                value: is
              })
            });
          }
          yl < 0 && Oe("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var ai = Ft.ReactCurrentDispatcher, Ir;
      function Cl(y, x, V) {
        {
          if (Ir === void 0)
            try {
              throw Error();
            } catch (fe) {
              var Y = fe.stack.trim().match(/\n( *(at )?)/);
              Ir = Y && Y[1] || "";
            }
          return `
` + Ir + y;
        }
      }
      var El = !1, _l;
      {
        var eo = typeof WeakMap == "function" ? WeakMap : Map;
        _l = new eo();
      }
      function to(y, x) {
        if (!y || El)
          return "";
        {
          var V = _l.get(y);
          if (V !== void 0)
            return V;
        }
        var Y;
        El = !0;
        var fe = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var et;
        et = ai.current, ai.current = null, Ju();
        try {
          if (x) {
            var Ee = function() {
              throw Error();
            };
            if (Object.defineProperty(Ee.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(Ee, []);
              } catch (Nt) {
                Y = Nt;
              }
              Reflect.construct(y, [], Ee);
            } else {
              try {
                Ee.call();
              } catch (Nt) {
                Y = Nt;
              }
              y.call(Ee.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (Nt) {
              Y = Nt;
            }
            y();
          }
        } catch (Nt) {
          if (Nt && Y && typeof Nt.stack == "string") {
            for (var Ke = Nt.stack.split(`
`), Tt = Y.stack.split(`
`), Vt = Ke.length - 1, ln = Tt.length - 1; Vt >= 1 && ln >= 0 && Ke[Vt] !== Tt[ln]; )
              ln--;
            for (; Vt >= 1 && ln >= 0; Vt--, ln--)
              if (Ke[Vt] !== Tt[ln]) {
                if (Vt !== 1 || ln !== 1)
                  do
                    if (Vt--, ln--, ln < 0 || Ke[Vt] !== Tt[ln]) {
                      var tn = `
` + Ke[Vt].replace(" at new ", " at ");
                      return y.displayName && tn.includes("<anonymous>") && (tn = tn.replace("<anonymous>", y.displayName)), typeof y == "function" && _l.set(y, tn), tn;
                    }
                  while (Vt >= 1 && ln >= 0);
                break;
              }
          }
        } finally {
          El = !1, ai.current = et, Sl(), Error.prepareStackTrace = fe;
        }
        var un = y ? y.displayName || y.name : "", pn = un ? Cl(un) : "";
        return typeof y == "function" && _l.set(y, pn), pn;
      }
      function Hi(y, x, V) {
        return to(y, !1);
      }
      function nd(y) {
        var x = y.prototype;
        return !!(x && x.isReactComponent);
      }
      function _i(y, x, V) {
        if (y == null)
          return "";
        if (typeof y == "function")
          return to(y, nd(y));
        if (typeof y == "string")
          return Cl(y);
        switch (y) {
          case ee:
            return Cl("Suspense");
          case de:
            return Cl("SuspenseList");
        }
        if (typeof y == "object")
          switch (y.$$typeof) {
            case _e:
              return Hi(y.render);
            case ve:
              return _i(y.type, x, V);
            case ke: {
              var Y = y, fe = Y._payload, et = Y._init;
              try {
                return _i(et(fe), x, V);
              } catch {
              }
            }
          }
        return "";
      }
      var Wt = {}, no = Ft.ReactDebugCurrentFrame;
      function lu(y) {
        if (y) {
          var x = y._owner, V = _i(y.type, y._source, x ? x.type : null);
          no.setExtraStackFrame(V);
        } else
          no.setExtraStackFrame(null);
      }
      function ro(y, x, V, Y, fe) {
        {
          var et = Function.call.bind(Yn);
          for (var Ee in y)
            if (et(y, Ee)) {
              var Ke = void 0;
              try {
                if (typeof y[Ee] != "function") {
                  var Tt = Error((Y || "React class") + ": " + V + " type `" + Ee + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof y[Ee] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw Tt.name = "Invariant Violation", Tt;
                }
                Ke = y[Ee](x, Ee, Y, V, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (Vt) {
                Ke = Vt;
              }
              Ke && !(Ke instanceof Error) && (lu(fe), Oe("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", Y || "React class", V, Ee, typeof Ke), lu(null)), Ke instanceof Error && !(Ke.message in Wt) && (Wt[Ke.message] = !0, lu(fe), Oe("Failed %s type: %s", V, Ke.message), lu(null));
            }
        }
      }
      function Bt(y) {
        if (y) {
          var x = y._owner, V = _i(y.type, y._source, x ? x.type : null);
          Rn(V);
        } else
          Rn(null);
      }
      var ao;
      ao = !1;
      function io() {
        if (yt.current) {
          var y = Fn(yt.current.type);
          if (y)
            return `

Check the render method of \`` + y + "`.";
        }
        return "";
      }
      function ft(y) {
        if (y !== void 0) {
          var x = y.fileName.replace(/^.*[\\\/]/, ""), V = y.lineNumber;
          return `

Check your code at ` + x + ":" + V + ".";
        }
        return "";
      }
      function uu(y) {
        return y != null ? ft(y.__source) : "";
      }
      var xn = {};
      function ra(y) {
        var x = io();
        if (!x) {
          var V = typeof y == "string" ? y : y.displayName || y.name;
          V && (x = `

Check the top-level render call using <` + V + ">.");
        }
        return x;
      }
      function Yr(y, x) {
        if (!(!y._store || y._store.validated || y.key != null)) {
          y._store.validated = !0;
          var V = ra(x);
          if (!xn[V]) {
            xn[V] = !0;
            var Y = "";
            y && y._owner && y._owner !== yt.current && (Y = " It was passed a child from " + Fn(y._owner.type) + "."), Bt(y), Oe('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', V, Y), Bt(null);
          }
        }
      }
      function bl(y, x) {
        if (typeof y == "object") {
          if (cn(y))
            for (var V = 0; V < y.length; V++) {
              var Y = y[V];
              he(Y) && Yr(Y, x);
            }
          else if (he(y))
            y._store && (y._store.validated = !0);
          else if (y) {
            var fe = $e(y);
            if (typeof fe == "function" && fe !== y.entries)
              for (var et = fe.call(y), Ee; !(Ee = et.next()).done; )
                he(Ee.value) && Yr(Ee.value, x);
          }
        }
      }
      function Ln(y) {
        {
          var x = y.type;
          if (x == null || typeof x == "string")
            return;
          var V;
          if (typeof x == "function")
            V = x.propTypes;
          else if (typeof x == "object" && (x.$$typeof === _e || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          x.$$typeof === ve))
            V = x.propTypes;
          else
            return;
          if (V) {
            var Y = Fn(x);
            ro(V, y.props, "prop", Y, y);
          } else if (x.PropTypes !== void 0 && !ao) {
            ao = !0;
            var fe = Fn(x);
            Oe("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", fe || "Unknown");
          }
          typeof x.getDefaultProps == "function" && !x.getDefaultProps.isReactClassApproved && Oe("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function Zt(y) {
        {
          for (var x = Object.keys(y.props), V = 0; V < x.length; V++) {
            var Y = x[V];
            if (Y !== "children" && Y !== "key") {
              Bt(y), Oe("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", Y), Bt(null);
              break;
            }
          }
          y.ref !== null && (Bt(y), Oe("Invalid attribute `ref` supplied to `React.Fragment`."), Bt(null));
        }
      }
      function fc(y, x, V) {
        var Y = ne(y);
        if (!Y) {
          var fe = "";
          (y === void 0 || typeof y == "object" && y !== null && Object.keys(y).length === 0) && (fe += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var et = uu(x);
          et ? fe += et : fe += io();
          var Ee;
          y === null ? Ee = "null" : cn(y) ? Ee = "array" : y !== void 0 && y.$$typeof === _ ? (Ee = "<" + (Fn(y.type) || "Unknown") + " />", fe = " Did you accidentally export a JSX literal instead of a component?") : Ee = typeof y, Oe("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Ee, fe);
        }
        var Ke = N.apply(this, arguments);
        if (Ke == null)
          return Ke;
        if (Y)
          for (var Tt = 2; Tt < arguments.length; Tt++)
            bl(arguments[Tt], y);
        return y === M ? Zt(Ke) : Ln(Ke), Ke;
      }
      var aa = !1;
      function sr(y) {
        var x = fc.bind(null, y);
        return x.type = y, aa || (aa = !0, Ot("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(x, "type", {
          enumerable: !1,
          get: function() {
            return Ot("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: y
            }), y;
          }
        }), x;
      }
      function bi(y, x, V) {
        for (var Y = Z.apply(this, arguments), fe = 2; fe < arguments.length; fe++)
          bl(arguments[fe], Y.type);
        return Ln(Y), Y;
      }
      function dc(y, x) {
        var V = mt.transition;
        mt.transition = {};
        var Y = mt.transition;
        mt.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          y();
        } finally {
          if (mt.transition = V, V === null && Y._updatedFibers) {
            var fe = Y._updatedFibers.size;
            fe > 10 && Ot("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), Y._updatedFibers.clear();
          }
        }
      }
      var Bi = !1, wl = null;
      function pc(y) {
        if (wl === null)
          try {
            var x = ("require" + Math.random()).slice(0, 7), V = g && g[x];
            wl = V.call(g, "timers").setImmediate;
          } catch {
            wl = function(fe) {
              Bi === !1 && (Bi = !0, typeof MessageChannel > "u" && Oe("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var et = new MessageChannel();
              et.port1.onmessage = fe, et.port2.postMessage(void 0);
            };
          }
        return wl(y);
      }
      var Aa = 0, Rl = !1;
      function Tl(y) {
        {
          var x = Aa;
          Aa++, je.current === null && (je.current = []);
          var V = je.isBatchingLegacy, Y;
          try {
            if (je.isBatchingLegacy = !0, Y = y(), !V && je.didScheduleLegacyUpdate) {
              var fe = je.current;
              fe !== null && (je.didScheduleLegacyUpdate = !1, Dl(fe));
            }
          } catch (un) {
            throw za(x), un;
          } finally {
            je.isBatchingLegacy = V;
          }
          if (Y !== null && typeof Y == "object" && typeof Y.then == "function") {
            var et = Y, Ee = !1, Ke = {
              then: function(un, pn) {
                Ee = !0, et.then(function(Nt) {
                  za(x), Aa === 0 ? lo(Nt, un, pn) : un(Nt);
                }, function(Nt) {
                  za(x), pn(Nt);
                });
              }
            };
            return !Rl && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              Ee || (Rl = !0, Oe("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), Ke;
          } else {
            var Tt = Y;
            if (za(x), Aa === 0) {
              var Vt = je.current;
              Vt !== null && (Dl(Vt), je.current = null);
              var ln = {
                then: function(un, pn) {
                  je.current === null ? (je.current = [], lo(Tt, un, pn)) : un(Tt);
                }
              };
              return ln;
            } else {
              var tn = {
                then: function(un, pn) {
                  un(Tt);
                }
              };
              return tn;
            }
          }
        }
      }
      function za(y) {
        y !== Aa - 1 && Oe("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), Aa = y;
      }
      function lo(y, x, V) {
        {
          var Y = je.current;
          if (Y !== null)
            try {
              Dl(Y), pc(function() {
                Y.length === 0 ? (je.current = null, x(y)) : lo(y, x, V);
              });
            } catch (fe) {
              V(fe);
            }
          else
            x(y);
        }
      }
      var xl = !1;
      function Dl(y) {
        if (!xl) {
          xl = !0;
          var x = 0;
          try {
            for (; x < y.length; x++) {
              var V = y[x];
              do
                V = V(!0);
              while (V !== null);
            }
            y.length = 0;
          } catch (Y) {
            throw y = y.slice(x + 1), Y;
          } finally {
            xl = !1;
          }
        }
      }
      var ou = fc, uo = bi, ls = sr, ii = {
        map: Dt,
        forEach: er,
        count: Kt,
        toArray: Fi,
        only: ni
      };
      f.Children = ii, f.Component = Je, f.Fragment = M, f.Profiler = me, f.PureComponent = Yt, f.StrictMode = C, f.Suspense = ee, f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ft, f.cloneElement = uo, f.createContext = mi, f.createElement = ou, f.createFactory = ls, f.createRef = Zn, f.forwardRef = Si, f.isValidElement = he, f.lazy = Ea, f.memo = ye, f.startTransition = dc, f.unstable_act = Tl, f.useCallback = Er, f.useContext = ht, f.useDebugValue = Ht, f.useDeferredValue = ri, f.useEffect = Gn, f.useId = Rt, f.useImperativeHandle = Ku, f.useInsertionEffect = fn, f.useLayoutEffect = dn, f.useMemo = Ci, f.useReducer = Et, f.useRef = Qe, f.useState = Lt, f.useSyncExternalStore = Ei, f.useTransition = td, f.version = h, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(dv, dv.exports)), dv.exports;
}
var i1;
function yv() {
  return i1 || (i1 = 1, process.env.NODE_ENV === "production" ? ly.exports = DO() : ly.exports = OO()), ly.exports;
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l1;
function kO() {
  if (l1)
    return cv;
  l1 = 1;
  var g = yv(), f = Symbol.for("react.element"), h = Symbol.for("react.fragment"), _ = Object.prototype.hasOwnProperty, w = g.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, M = {
    key: !0,
    ref: !0,
    __self: !0,
    __source: !0
  };
  function C(me, J, ie) {
    var _e, ee = {}, de = null, ve = null;
    ie !== void 0 && (de = "" + ie), J.key !== void 0 && (de = "" + J.key), J.ref !== void 0 && (ve = J.ref);
    for (_e in J)
      _.call(J, _e) && !M.hasOwnProperty(_e) && (ee[_e] = J[_e]);
    if (me && me.defaultProps)
      for (_e in J = me.defaultProps, J)
        ee[_e] === void 0 && (ee[_e] = J[_e]);
    return {
      $$typeof: f,
      type: me,
      key: de,
      ref: ve,
      props: ee,
      _owner: w.current
    };
  }
  return cv.Fragment = h, cv.jsx = C, cv.jsxs = C, cv;
}
var fv = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var u1;
function MO() {
  return u1 || (u1 = 1, process.env.NODE_ENV !== "production" && function() {
    var g = yv(), f = Symbol.for("react.element"), h = Symbol.for("react.portal"), _ = Symbol.for("react.fragment"), w = Symbol.for("react.strict_mode"), M = Symbol.for("react.profiler"), C = Symbol.for("react.provider"), me = Symbol.for("react.context"), J = Symbol.for("react.forward_ref"), ie = Symbol.for("react.suspense"), _e = Symbol.for("react.suspense_list"), ee = Symbol.for("react.memo"), de = Symbol.for("react.lazy"), ve = Symbol.for("react.offscreen"), ke = Symbol.iterator, ot = "@@iterator";
    function st(D) {
      if (D === null || typeof D != "object")
        return null;
      var ne = ke && D[ke] || D[ot];
      return typeof ne == "function" ? ne : null;
    }
    var It = g.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function $e(D) {
      {
        for (var ne = arguments.length, ye = new Array(ne > 1 ? ne - 1 : 0), Te = 1; Te < ne; Te++)
          ye[Te - 1] = arguments[Te];
        He("error", D, ye);
      }
    }
    function He(D, ne, ye) {
      {
        var Te = It.ReactDebugCurrentFrame, ht = Te.getStackAddendum();
        ht !== "" && (ne += "%s", ye = ye.concat([
          ht
        ]));
        var Lt = ye.map(function(Et) {
          return String(Et);
        });
        Lt.unshift("Warning: " + ne), Function.prototype.apply.call(console[D], console, Lt);
      }
    }
    var mt = !1, je = !1, yt = !1, nt = !1, an = !1, Rn;
    Rn = Symbol.for("react.module.reference");
    function Xt(D) {
      return !!(typeof D == "string" || typeof D == "function" || D === _ || D === M || an || D === w || D === ie || D === _e || nt || D === ve || mt || je || yt || typeof D == "object" && D !== null && (D.$$typeof === de || D.$$typeof === ee || D.$$typeof === C || D.$$typeof === me || D.$$typeof === J || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      D.$$typeof === Rn || D.getModuleId !== void 0));
    }
    function jt(D, ne, ye) {
      var Te = D.displayName;
      if (Te)
        return Te;
      var ht = ne.displayName || ne.name || "";
      return ht !== "" ? ye + "(" + ht + ")" : ye;
    }
    function En(D) {
      return D.displayName || "Context";
    }
    function Xe(D) {
      if (D == null)
        return null;
      if (typeof D.tag == "number" && $e("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof D == "function")
        return D.displayName || D.name || null;
      if (typeof D == "string")
        return D;
      switch (D) {
        case _:
          return "Fragment";
        case h:
          return "Portal";
        case M:
          return "Profiler";
        case w:
          return "StrictMode";
        case ie:
          return "Suspense";
        case _e:
          return "SuspenseList";
      }
      if (typeof D == "object")
        switch (D.$$typeof) {
          case me:
            var ne = D;
            return En(ne) + ".Consumer";
          case C:
            var ye = D;
            return En(ye._context) + ".Provider";
          case J:
            return jt(D, D.render, "ForwardRef");
          case ee:
            var Te = D.displayName || null;
            return Te !== null ? Te : Xe(D.type) || "Memo";
          case de: {
            var ht = D, Lt = ht._payload, Et = ht._init;
            try {
              return Xe(Et(Lt));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var ct = Object.assign, Ft = 0, Ot, Oe, se, Pe, O, K, q;
    function We() {
    }
    We.__reactDisabledLog = !0;
    function Je() {
      {
        if (Ft === 0) {
          Ot = console.log, Oe = console.info, se = console.warn, Pe = console.error, O = console.group, K = console.groupCollapsed, q = console.groupEnd;
          var D = {
            configurable: !0,
            enumerable: !0,
            value: We,
            writable: !0
          };
          Object.defineProperties(console, {
            info: D,
            log: D,
            warn: D,
            error: D,
            group: D,
            groupCollapsed: D,
            groupEnd: D
          });
        }
        Ft++;
      }
    }
    function Ve() {
      {
        if (Ft--, Ft === 0) {
          var D = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: ct({}, D, {
              value: Ot
            }),
            info: ct({}, D, {
              value: Oe
            }),
            warn: ct({}, D, {
              value: se
            }),
            error: ct({}, D, {
              value: Pe
            }),
            group: ct({}, D, {
              value: O
            }),
            groupCollapsed: ct({}, D, {
              value: K
            }),
            groupEnd: ct({}, D, {
              value: q
            })
          });
        }
        Ft < 0 && $e("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var gt = It.ReactCurrentDispatcher, wt;
    function vt(D, ne, ye) {
      {
        if (wt === void 0)
          try {
            throw Error();
          } catch (ht) {
            var Te = ht.stack.trim().match(/\n( *(at )?)/);
            wt = Te && Te[1] || "";
          }
        return `
` + wt + D;
      }
    }
    var Yt = !1, vn;
    {
      var Zn = typeof WeakMap == "function" ? WeakMap : Map;
      vn = new Zn();
    }
    function jn(D, ne) {
      if (!D || Yt)
        return "";
      {
        var ye = vn.get(D);
        if (ye !== void 0)
          return ye;
      }
      var Te;
      Yt = !0;
      var ht = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var Lt;
      Lt = gt.current, gt.current = null, Je();
      try {
        if (ne) {
          var Et = function() {
            throw Error();
          };
          if (Object.defineProperty(Et.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(Et, []);
            } catch (Ht) {
              Te = Ht;
            }
            Reflect.construct(D, [], Et);
          } else {
            try {
              Et.call();
            } catch (Ht) {
              Te = Ht;
            }
            D.call(Et.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (Ht) {
            Te = Ht;
          }
          D();
        }
      } catch (Ht) {
        if (Ht && Te && typeof Ht.stack == "string") {
          for (var Qe = Ht.stack.split(`
`), Gn = Te.stack.split(`
`), fn = Qe.length - 1, dn = Gn.length - 1; fn >= 1 && dn >= 0 && Qe[fn] !== Gn[dn]; )
            dn--;
          for (; fn >= 1 && dn >= 0; fn--, dn--)
            if (Qe[fn] !== Gn[dn]) {
              if (fn !== 1 || dn !== 1)
                do
                  if (fn--, dn--, dn < 0 || Qe[fn] !== Gn[dn]) {
                    var Er = `
` + Qe[fn].replace(" at new ", " at ");
                    return D.displayName && Er.includes("<anonymous>") && (Er = Er.replace("<anonymous>", D.displayName)), typeof D == "function" && vn.set(D, Er), Er;
                  }
                while (fn >= 1 && dn >= 0);
              break;
            }
        }
      } finally {
        Yt = !1, gt.current = Lt, Ve(), Error.prepareStackTrace = ht;
      }
      var Ci = D ? D.displayName || D.name : "", Ku = Ci ? vt(Ci) : "";
      return typeof D == "function" && vn.set(D, Ku), Ku;
    }
    function cn(D, ne, ye) {
      return jn(D, !1);
    }
    function In(D) {
      var ne = D.prototype;
      return !!(ne && ne.isReactComponent);
    }
    function Tn(D, ne, ye) {
      if (D == null)
        return "";
      if (typeof D == "function")
        return jn(D, In(D));
      if (typeof D == "string")
        return vt(D);
      switch (D) {
        case ie:
          return vt("Suspense");
        case _e:
          return vt("SuspenseList");
      }
      if (typeof D == "object")
        switch (D.$$typeof) {
          case J:
            return cn(D.render);
          case ee:
            return Tn(D.type, ne, ye);
          case de: {
            var Te = D, ht = Te._payload, Lt = Te._init;
            try {
              return Tn(Lt(ht), ne, ye);
            } catch {
            }
          }
        }
      return "";
    }
    var Nn = Object.prototype.hasOwnProperty, _n = {}, yr = It.ReactDebugCurrentFrame;
    function gr(D) {
      if (D) {
        var ne = D._owner, ye = Tn(D.type, D._source, ne ? ne.type : null);
        yr.setExtraStackFrame(ye);
      } else
        yr.setExtraStackFrame(null);
    }
    function Fn(D, ne, ye, Te, ht) {
      {
        var Lt = Function.call.bind(Nn);
        for (var Et in D)
          if (Lt(D, Et)) {
            var Qe = void 0;
            try {
              if (typeof D[Et] != "function") {
                var Gn = Error((Te || "React class") + ": " + ye + " type `" + Et + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof D[Et] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw Gn.name = "Invariant Violation", Gn;
              }
              Qe = D[Et](ne, Et, Te, ye, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (fn) {
              Qe = fn;
            }
            Qe && !(Qe instanceof Error) && (gr(ht), $e("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", Te || "React class", ye, Et, typeof Qe), gr(null)), Qe instanceof Error && !(Qe.message in _n) && (_n[Qe.message] = !0, gr(ht), $e("Failed %s type: %s", ye, Qe.message), gr(null));
          }
      }
    }
    var Yn = Array.isArray;
    function Lr(D) {
      return Yn(D);
    }
    function or(D) {
      {
        var ne = typeof Symbol == "function" && Symbol.toStringTag, ye = ne && D[Symbol.toStringTag] || D.constructor.name || "Object";
        return ye;
      }
    }
    function Br(D) {
      try {
        return Jn(D), !1;
      } catch {
        return !0;
      }
    }
    function Jn(D) {
      return "" + D;
    }
    function Wn(D) {
      if (Br(D))
        return $e("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", or(D)), Jn(D);
    }
    var hn = It.ReactCurrentOwner, Sr = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, La, Cr, T;
    T = {};
    function N(D) {
      if (Nn.call(D, "ref")) {
        var ne = Object.getOwnPropertyDescriptor(D, "ref").get;
        if (ne && ne.isReactWarning)
          return !1;
      }
      return D.ref !== void 0;
    }
    function F(D) {
      if (Nn.call(D, "key")) {
        var ne = Object.getOwnPropertyDescriptor(D, "key").get;
        if (ne && ne.isReactWarning)
          return !1;
      }
      return D.key !== void 0;
    }
    function Z(D, ne) {
      if (typeof D.ref == "string" && hn.current && ne && hn.current.stateNode !== ne) {
        var ye = Xe(hn.current.type);
        T[ye] || ($e('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', Xe(hn.current.type), D.ref), T[ye] = !0);
      }
    }
    function he(D, ne) {
      {
        var ye = function() {
          La || (La = !0, $e("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", ne));
        };
        ye.isReactWarning = !0, Object.defineProperty(D, "key", {
          get: ye,
          configurable: !0
        });
      }
    }
    function St(D, ne) {
      {
        var ye = function() {
          Cr || (Cr = !0, $e("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", ne));
        };
        ye.isReactWarning = !0, Object.defineProperty(D, "ref", {
          get: ye,
          configurable: !0
        });
      }
    }
    var Ct = function(D, ne, ye, Te, ht, Lt, Et) {
      var Qe = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: f,
        // Built-in properties that belong on the element
        type: D,
        key: ne,
        ref: ye,
        props: Et,
        // Record the component responsible for creating this element.
        _owner: Lt
      };
      return Qe._store = {}, Object.defineProperty(Qe._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(Qe, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Te
      }), Object.defineProperty(Qe, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: ht
      }), Object.freeze && (Object.freeze(Qe.props), Object.freeze(Qe)), Qe;
    };
    function Ge(D, ne, ye, Te, ht) {
      {
        var Lt, Et = {}, Qe = null, Gn = null;
        ye !== void 0 && (Wn(ye), Qe = "" + ye), F(ne) && (Wn(ne.key), Qe = "" + ne.key), N(ne) && (Gn = ne.ref, Z(ne, ht));
        for (Lt in ne)
          Nn.call(ne, Lt) && !Sr.hasOwnProperty(Lt) && (Et[Lt] = ne[Lt]);
        if (D && D.defaultProps) {
          var fn = D.defaultProps;
          for (Lt in fn)
            Et[Lt] === void 0 && (Et[Lt] = fn[Lt]);
        }
        if (Qe || Gn) {
          var dn = typeof D == "function" ? D.displayName || D.name || "Unknown" : D;
          Qe && he(Et, dn), Gn && St(Et, dn);
        }
        return Ct(D, Qe, Gn, ht, Te, hn.current, Et);
      }
    }
    var te = It.ReactCurrentOwner, Ce = It.ReactDebugCurrentFrame;
    function oe(D) {
      if (D) {
        var ne = D._owner, ye = Tn(D.type, D._source, ne ? ne.type : null);
        Ce.setExtraStackFrame(ye);
      } else
        Ce.setExtraStackFrame(null);
    }
    var ce;
    ce = !1;
    function it(D) {
      return typeof D == "object" && D !== null && D.$$typeof === f;
    }
    function Dt() {
      {
        if (te.current) {
          var D = Xe(te.current.type);
          if (D)
            return `

Check the render method of \`` + D + "`.";
        }
        return "";
      }
    }
    function Kt(D) {
      {
        if (D !== void 0) {
          var ne = D.fileName.replace(/^.*[\\\/]/, ""), ye = D.lineNumber;
          return `

Check your code at ` + ne + ":" + ye + ".";
        }
        return "";
      }
    }
    var er = {};
    function Fi(D) {
      {
        var ne = Dt();
        if (!ne) {
          var ye = typeof D == "string" ? D : D.displayName || D.name;
          ye && (ne = `

Check the top-level render call using <` + ye + ">.");
        }
        return ne;
      }
    }
    function ni(D, ne) {
      {
        if (!D._store || D._store.validated || D.key != null)
          return;
        D._store.validated = !0;
        var ye = Fi(ne);
        if (er[ye])
          return;
        er[ye] = !0;
        var Te = "";
        D && D._owner && D._owner !== te.current && (Te = " It was passed a child from " + Xe(D._owner.type) + "."), oe(D), $e('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', ye, Te), oe(null);
      }
    }
    function mi(D, ne) {
      {
        if (typeof D != "object")
          return;
        if (Lr(D))
          for (var ye = 0; ye < D.length; ye++) {
            var Te = D[ye];
            it(Te) && ni(Te, ne);
          }
        else if (it(D))
          D._store && (D._store.validated = !0);
        else if (D) {
          var ht = st(D);
          if (typeof ht == "function" && ht !== D.entries)
            for (var Lt = ht.call(D), Et; !(Et = Lt.next()).done; )
              it(Et.value) && ni(Et.value, ne);
        }
      }
    }
    function Sa(D) {
      {
        var ne = D.type;
        if (ne == null || typeof ne == "string")
          return;
        var ye;
        if (typeof ne == "function")
          ye = ne.propTypes;
        else if (typeof ne == "object" && (ne.$$typeof === J || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        ne.$$typeof === ee))
          ye = ne.propTypes;
        else
          return;
        if (ye) {
          var Te = Xe(ne);
          Fn(ye, D.props, "prop", Te, D);
        } else if (ne.PropTypes !== void 0 && !ce) {
          ce = !0;
          var ht = Xe(ne);
          $e("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", ht || "Unknown");
        }
        typeof ne.getDefaultProps == "function" && !ne.getDefaultProps.isReactClassApproved && $e("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function yi(D) {
      {
        for (var ne = Object.keys(D.props), ye = 0; ye < ne.length; ye++) {
          var Te = ne[ye];
          if (Te !== "children" && Te !== "key") {
            oe(D), $e("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", Te), oe(null);
            break;
          }
        }
        D.ref !== null && (oe(D), $e("Invalid attribute `ref` supplied to `React.Fragment`."), oe(null));
      }
    }
    function Ca(D, ne, ye, Te, ht, Lt) {
      {
        var Et = Xt(D);
        if (!Et) {
          var Qe = "";
          (D === void 0 || typeof D == "object" && D !== null && Object.keys(D).length === 0) && (Qe += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Gn = Kt(ht);
          Gn ? Qe += Gn : Qe += Dt();
          var fn;
          D === null ? fn = "null" : Lr(D) ? fn = "array" : D !== void 0 && D.$$typeof === f ? (fn = "<" + (Xe(D.type) || "Unknown") + " />", Qe = " Did you accidentally export a JSX literal instead of a component?") : fn = typeof D, $e("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", fn, Qe);
        }
        var dn = Ge(D, ne, ye, ht, Lt);
        if (dn == null)
          return dn;
        if (Et) {
          var Er = ne.children;
          if (Er !== void 0)
            if (Te)
              if (Lr(Er)) {
                for (var Ci = 0; Ci < Er.length; Ci++)
                  mi(Er[Ci], D);
                Object.freeze && Object.freeze(Er);
              } else
                $e("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              mi(Er, D);
        }
        return D === _ ? yi(dn) : Sa(dn), dn;
      }
    }
    function gi(D, ne, ye) {
      return Ca(D, ne, ye, !0);
    }
    function Vr(D, ne, ye) {
      return Ca(D, ne, ye, !1);
    }
    var Ea = Vr, Si = gi;
    fv.Fragment = _, fv.jsx = Ea, fv.jsxs = Si;
  }()), fv;
}
process.env.NODE_ENV === "production" ? K0.exports = kO() : K0.exports = MO();
var ze = K0.exports;
function NO(g) {
  const { card: f, selected: h, onClick: _ } = g, w = `card ${f.type}-${f.number} ${h ? "selected-card" : ""}`;
  return /* @__PURE__ */ ze.jsx("div", {
    className: w,
    onClick: () => _?.(f)
  });
}
function LO(g) {
  const { card: f, animations: h, score: _ } = g, w = `card ${f.type}-${f.number} ${h?.map((M) => `${M}`).join(" ")}`;
  return /* @__PURE__ */ ze.jsxs(ze.Fragment, {
    children: [
      _ && /* @__PURE__ */ ze.jsx("div", {
        className: w,
        "data-score": _
      }),
      !_ && /* @__PURE__ */ ze.jsx("div", {
        className: w
      })
    ]
  });
}
function AO(g) {
  const { cards: f, selectedCards: h, onCardClick: _ } = g;
  return /* @__PURE__ */ ze.jsx("div", {
    className: "hand",
    children: f.map((w) => /* @__PURE__ */ ze.jsx(NO, {
      card: w,
      selected: h.some((M) => M.id.equals(w.id)),
      onClick: _
    }, w.id.toString()))
  });
}
class ed extends mv {
  static create(f) {
    return new ed(f);
  }
}
var zO = Object.defineProperty, UO = Object.getOwnPropertyDescriptor, PO = (g, f, h, _) => {
  for (var w = _ > 1 ? void 0 : _ ? UO(f, h) : f, M = g.length - 1, C; M >= 0; M--)
    (C = g[M]) && (w = (_ ? C(f, h, w) : C(w)) || w);
  return _ && w && zO(f, h, w), w;
};
let sy = class extends sC {
  static create() {
    return new sy();
  }
};
sy = PO([
  hi()
], sy);
class my extends mv {
  static create(f) {
    return new my(f);
  }
}
class yy extends mv {
  static create(f) {
    return new yy(f);
  }
}
class gy extends mv {
  static create(f) {
    return new gy(f);
  }
}
var jO = Object.defineProperty, FO = Object.getOwnPropertyDescriptor, HO = (g, f, h, _) => {
  for (var w = _ > 1 ? void 0 : _ ? FO(f, h) : f, M = g.length - 1, C; M >= 0; M--)
    (C = g[M]) && (w = (_ ? C(f, h, w) : C(w)) || w);
  return _ && w && jO(f, h, w), w;
};
let cy = class extends sC {
  static create() {
    return new cy();
  }
};
cy = HO([
  hi()
], cy);
class Sy extends Jf {
  _number;
  get number() {
    return this._number;
  }
  _type;
  get type() {
    return this._type;
  }
  constructor(f, h, _) {
    super(f), this._type = h, this._number = _;
  }
  static create(f, h, _) {
    return new Sy(f, h, _);
  }
}
var fy = /* @__PURE__ */ ((g) => (g.Coins = "coins", g.Cups = "cups", g.Swords = "swords", g.Clubs = "clubs", g))(fy || {});
class hl extends Jf {
  _cards;
  _unplayedCards;
  get unplayedCards() {
    return this._unplayedCards.getAll();
  }
  _playedCards;
  get playedCards() {
    return this._playedCards.getAll();
  }
  _handCards;
  get handCards() {
    return this._handCards.getAll();
  }
  _discardedCards;
  get discardedCards() {
    return this._discardedCards.getAll();
  }
  _selectedCards = /* @__PURE__ */ new Set();
  get selectedCards() {
    return this._handCards.getAll().filter((f) => this._selectedCards.has(f.id));
  }
  _lastPlayedCards;
  get lastPlayedCards() {
    return this._lastPlayedCards.getAll();
  }
  _handCardsNumber;
  _maxSelectedCardsNumber;
  get playablesHands() {
    return 5;
  }
  get playablesDiscards() {
    return 3;
  }
  constructor(f, h) {
    super(ji.newGuid()), this._handCardsNumber = f, this._maxSelectedCardsNumber = h, this._cards = qu.create(), this._unplayedCards = qu.create(), this._playedCards = qu.create(), this._discardedCards = qu.create(), this._handCards = qu.create(), this._lastPlayedCards = qu.create();
  }
  init() {
    for (const f of Object.keys(fy))
      for (let h = 0; h < 12; h++)
        this._cards.set(Sy.create(ji.newGuid(), fy[f], h + 1));
    this.shuffle(), this.takeCardsToHand();
  }
  shuffle() {
    this._unplayedCards.clear(), this._playedCards.clear(), this._unplayedCards.clear(), this._discardedCards.clear(), this._selectedCards.clear(), this._lastPlayedCards.clear();
    const f = this._cards.getAll();
    for (let h = f.length - 1; h > 0; h--) {
      const _ = Math.floor(Math.random() * (h + 1));
      [f[h], f[_]] = [
        f[_],
        f[h]
      ];
    }
    this._unplayedCards.setAll(f);
  }
  takeCardsToHand() {
    if (!(this._handCards.size >= this._handCardsNumber))
      for (; this._handCards.size < this._handCardsNumber; ) {
        const h = this._unplayedCards.getFirst();
        if (!h) {
          this.shuffle();
          continue;
        }
        this._unplayedCards.remove(h.id), this._handCards.set(h);
      }
  }
  selectCard(f) {
    if (this._handCards.size !== 0) {
      if (this._selectedCards.has(f.id)) {
        this._selectedCards.delete(f.id);
        return;
      }
      this._selectedCards.size >= this._maxSelectedCardsNumber || this._selectedCards.add(f.id);
    }
  }
  discardSelectedCards() {
    for (const f of this.selectedCards)
      this._handCards.remove(f.id), this._discardedCards.set(f);
    this._selectedCards.clear(), this.takeCardsToHand();
  }
  playSelectedCards() {
    this._lastPlayedCards.clear();
    for (const f of this.selectedCards)
      this._lastPlayedCards.set(f), this._handCards.remove(f.id), this._playedCards.set(f);
    this._selectedCards.clear(), this.takeCardsToHand();
  }
  changeHandCardsNumber(f) {
    this._handCardsNumber = f;
  }
  changeMaxSelectedCardsNumber(f) {
    this._maxSelectedCardsNumber = f;
  }
}
var $n = /* @__PURE__ */ ((g) => (g.None = "None", g.Battle = "Battle", g.Boss = "Boss", g.Shop = "Shop", g.Rest = "Rest", g.Final = "Final", g))($n || {});
class gv extends Jf {
  _x;
  get x() {
    return this._x;
  }
  _y;
  get y() {
    return this._y;
  }
  _children;
  get children() {
    return this._children;
  }
  _type;
  get type() {
    return this._type;
  }
  _isUnknow;
  get isUnknow() {
    return this._isUnknow;
  }
  _position;
  get position() {
    return this._position;
  }
  constructor(f, h, _) {
    super(f), this._x = h, this._y = _, this._children = [], this._isUnknow = !1, this._position = {
      top: Math.floor(Math.random() * 51) + 10,
      left: Math.floor(Math.random() * 51) + 10
    }, this._type = $n.None;
  }
  static create(f, h, _, ...w) {
    return new gv(f, h, _);
  }
  addChild(f) {
    this._children.push(f);
  }
  removeChild(f) {
    this._children = this._children.filter((h) => h !== f);
  }
  hasChild(f) {
    return this._children.some((h) => h.equals(f));
  }
  setType(f) {
    this._type = f;
  }
  setUnknow(f) {
    this._isUnknow = f;
  }
}
class Cy extends gv {
  get type() {
    return $n.Battle;
  }
  _objectiveScore;
  get objectiveScore() {
    return this._objectiveScore;
  }
  _playablesHands;
  get playablesHands() {
    return this._playablesHands;
  }
  _playablesDiscards;
  get playablesDiscards() {
    return this._playablesDiscards;
  }
  //TODO: crear el tipo reward
  _reward;
  get reward() {
    return this._reward;
  }
  constructor(f, h, _, w, M, C, me) {
    super(f, h, _), this._playablesHands = w, this._playablesDiscards = M, this._objectiveScore = C, this._reward = me;
  }
  static create(f, h, _, w, M, C) {
    return new Cy(f, h, _, w, M, C, 0);
  }
}
class dy extends gv {
  get type() {
    return $n.Shop;
  }
  static create(f, h, _) {
    return new dy(f, h, _);
  }
}
class BO {
  static createBattleMapPoint(f, h, _, w, M, C, me) {
    return Cy.create(f, h, _, w, M, C);
  }
  static createShopMapPoint(f, h, _) {
    return dy.create(f, h, _);
  }
  static createShopMapPointFromPoint(f) {
    const h = dy.create(f.id, f.x, f.y);
    return f.children.forEach((_) => {
      h.addChild(_);
    }), h;
  }
}
class sc extends Jf {
  _numberOfPotencialPoints = 10;
  _numberOfLevels = 10;
  _numberOfPaths = 6;
  _minLevelBossPoints = 3;
  _minNumberOfBossPoints = 3;
  _maxNumberOfBossPoints = 5;
  _minLevelRestPoints = 5;
  _minNumberOfRestPoints = 1;
  _maxNumberOfRestPoints = 3;
  _minLevelShopPoints = 2;
  _minNumberOfShopPoints = 2;
  _maxNumberOfShopPoints = 4;
  _levels;
  get levels() {
    return this._levels;
  }
  get points() {
    return this._levels.reduce((f, h) => f.concat(h), []);
  }
  _currentPoint = void 0;
  get currentPoint() {
    return this._currentPoint;
  }
  get currentLevel() {
    return this._currentPoint?.y ?? void 0;
  }
  constructor() {
    super(ji.newGuid()), this._levels = [];
  }
  static create() {
    return new sc();
  }
  isPointAccessible(f) {
    const h = this.points.find((_) => _.id.equals(f.id));
    return h ? !!(!this._currentPoint && h.y === 0 || this._currentPoint?.children.some((_) => _.equals(f.id))) : !1;
  }
  moveToPoint(f) {
    this.isPointAccessible(f) && (this._currentPoint = f);
  }
  generateIsometricMap(f) {
    const h = this._numberOfPotencialPoints, _ = this._numberOfLevels, w = f.playablesHands, M = f.playablesDiscards;
    for (let J = 0; J < _; J++) {
      this.levels.push([]);
      for (let ie = 0; ie < h; ie++) {
        const _e = Cy.create(ji.newGuid(), ie, J, w, M, 100 * (J + 1));
        _e.setType($n.Battle), this._levels[J].push(_e);
      }
    }
    const C = this.selectThreeInitialPoints();
    for (const J of Array.from({
      length: this._numberOfPaths
    }))
      this.generateIsometricMapPath(0, C[this.generateRandomNumberBetween(0, C.length - 1)]);
    this.clearConexionsWithoutChildrens();
    const me = gv.create(ji.newGuid(), 0, _ - 1);
    me.setType($n.Final), this._levels[_ - 1] = [
      me
    ], this._levels[_ - 2].forEach((J) => {
      this.getPointParents(J).length !== 0 && J.addChild(me.id);
    }), this.assignTypeToPoints(), this.hideRandomPoints();
  }
  getPointParents(f) {
    return this.points.filter((h) => h.children.some((_) => _.equals(f.id)));
  }
  selectThreeInitialPoints() {
    const f = [];
    for (; f.length < 3; ) {
      const h = this.generateRandomNumberBetween(0, this._levels[0].length - 1), w = this._levels[0][h];
      f.some((M) => M.x === w.x) || f.some((M) => Math.abs(M.x - w.x) < 2) || w.x === 0 || w.x === this._levels[0].length - 1 || f.push(w);
    }
    return console.log("Initial points", f), f;
  }
  generateIsometricMapPath(f = 0, h) {
    if (h || (h = this._levels[f][this.generateRandomNumberBetween(0, this._levels[f].length - 1)]), f === this._levels.length - 1)
      return;
    const _ = this.randomizeArray(this.getPossibleChildrens(f, h.x));
    for (let M = 0; M < _.length; M++) {
      const C = _[M];
      if (h.children.some((ie) => ie.equals(C.id)))
        continue;
      const me = this._levels[f][h.x - 1];
      if (me && me.children.some((ie) => {
        const _e = this.points.find((ee) => ee.id.equals(ie));
        return _e ? _e.x > C.x : !1;
      }))
        continue;
      const J = this._levels[f][h.x + 1];
      J && J.children.some((ie) => {
        const _e = this.points.find((ee) => ee.id.equals(ie));
        return _e ? _e.x < C.x : !1;
      }) || h.addChild(C.id);
    }
    const w = _[this.generateRandomNumberBetween(0, _.length - 1)];
    this.generateIsometricMapPath(f + 1, w);
  }
  getPossibleChildrens(f, h) {
    const _ = [], w = this._levels[f + 1][h - 1], M = this._levels[f + 1][h + 1], C = this._levels[f + 1][h];
    return w && _.push(w), M && _.push(M), C && _.push(C), _;
  }
  clearConexionsWithoutChildrens() {
    for (let f = this._levels.length - 2; f >= 0; f--)
      for (let h = this._levels[f].length - 1; h >= 0; h--) {
        const _ = this._levels[f][h];
        _.children.length === 0 && this.getPointParents(_).forEach((M) => {
          M.removeChild(_.id);
        });
      }
  }
  clearPointsWithoutChildrens() {
    for (let f = this._levels.length - 1; f >= 0; f--)
      for (let h = this._levels[f].length - 1; h >= 0; h--)
        this._levels[f][h].children.length === 0 && this._levels[f].splice(h, 1);
  }
  assignTypeToPoints() {
    const f = this.generateRandomNumberBetween(this._minNumberOfShopPoints, this._maxNumberOfShopPoints);
    let h = 0;
    for (; h < f; ) {
      const me = this.generateRandomNumberBetween(this._minLevelShopPoints, this._levels.length - 3), J = this.generateRandomNumberBetween(0, this._levels[me].length - 1), ie = this._levels[me][J];
      if (ie.type === $n.Battle && ie.children.length > 0) {
        const _e = BO.createShopMapPointFromPoint(ie);
        this._levels[me][J] = _e, h++;
      }
    }
    const _ = this.generateRandomNumberBetween(this._minNumberOfRestPoints, this._maxNumberOfRestPoints);
    let w = 0;
    for (; w < _; ) {
      const me = this.generateRandomNumberBetween(this._minLevelRestPoints, this._levels.length - 2), J = this.generateRandomNumberBetween(0, this._levels[me].length - 1), ie = this._levels[me][J];
      ie.type === $n.Battle && ie.children.length > 0 && (ie.setType($n.Rest), w++);
    }
    const M = this.generateRandomNumberBetween(this._minNumberOfBossPoints, this._maxNumberOfBossPoints);
    let C = 0;
    for (; C < M; ) {
      const me = this.generateRandomNumberBetween(this._minLevelBossPoints, this._levels.length - 3), J = this.generateRandomNumberBetween(0, this._levels[me].length - 1), ie = this._levels[me][J];
      ie.type === $n.Battle && ie.children.length > 0 && (ie.setType($n.Boss), C++);
    }
  }
  hideRandomPoints() {
    const f = this.points.filter((C) => C.children.length > 0 && C.y > 0), h = Math.round(f.length / 5), _ = Math.round(f.length / 3), w = this.generateRandomNumberBetween(h, _);
    let M = 0;
    for (; M < w; ) {
      const C = this.generateRandomNumberBetween(0, this._levels.length - 2), me = this.generateRandomNumberBetween(0, this._levels[C].length - 1), J = this._levels[C][me];
      J.children.length !== 0 && (J.setUnknow(!0), M++);
    }
  }
  removeEmptyColumns() {
    for (let f = 0; f < this._levels.length; f++) {
      let h = !0;
      for (let _ = 0; _ < this._levels[f].length; _++)
        if (this._levels[_][f].children.length > 0) {
          h = !1;
          break;
        }
      h && this._levels.forEach((_) => {
        _.splice(f, 1);
      });
    }
  }
  generateRandomNumberBetween(f, h) {
    return Math.floor(Math.random() * (h - f + 1)) + f;
  }
  randomizeArray(f) {
    return f.sort(() => Math.random() - 0.5);
  }
}
class iu extends Jf {
  _cardPlays = /* @__PURE__ */ new Map();
  get cardPlays() {
    return Array.from(this._cardPlays.values());
  }
  _score;
  get score() {
    return this._score;
  }
  _objetiveScore;
  get objetiveScore() {
    return this._objetiveScore;
  }
  _remainingActions;
  get remainingActions() {
    return this._remainingActions;
  }
  _remainingDiscards;
  get remainingDiscards() {
    return this._remainingDiscards;
  }
  constructor(f) {
    super(f), this._score = 0, this._objetiveScore = 0, this._remainingActions = 0, this._remainingDiscards = 0;
  }
  static create() {
    return new iu(ji.newGuid());
  }
  setCardPlay(f) {
    this._cardPlays.set(f.name, f);
  }
  init(f) {
    this._objetiveScore = f.objectiveScore, this._remainingActions = f.playablesHands, this._remainingDiscards = f.playablesDiscards;
  }
  run(f) {
    const h = this.findCardPlays(f), _ = this.executeCardPlays(h, f);
    this._remainingActions--;
    const w = _.reduce((C, me) => C + me.points, 0), M = _.reduce((C, me) => C * me.multiplier, 1);
    return this._score += w * M, _;
  }
  downRemainingDiscards() {
    this._remainingDiscards--;
  }
  findCardPlays(f) {
    return Array.from(this._cardPlays.values()).filter((h) => h.isPlayable(f));
  }
  executeCardPlays(f, h) {
    return f.map((_) => _.play(h));
  }
}
var fC = yv();
const Kf = /* @__PURE__ */ dO(fC);
class VO extends Kf.Component {
  _animationsManager;
  constructor(f) {
    super(f), this._animationsManager = Pn.get(oc), this.state = {
      currentAnimation: 0
    };
  }
  componentDidMount() {
    const { cardsScore: f } = this.props;
    if (f.length === 0)
      return;
    const h = setInterval(() => {
      if (f.length === 0) {
        clearInterval(h);
        return;
      }
      this.setState((_) => {
        if (_.currentAnimation === f.length - 1) {
          clearInterval(h), this.props.onScoreAnimationEnd();
          return;
        }
        return {
          ..._,
          currentAnimation: _.currentAnimation + 1
        };
      });
    }, this._animationsManager.getVelocity() * 1e3);
  }
  render() {
    const { cards: f, cardsScore: h } = this.props, { currentAnimation: _ } = this.state;
    return /* @__PURE__ */ ze.jsx("div", {
      className: "move",
      children: f.map((w) => /* @__PURE__ */ ze.jsx(LO, {
        card: w,
        score: h[_]?.cards.some((M) => M.id.equals(w.id)) ? h[_].points : void 0,
        animations: h[_]?.cards.some((M) => M.id.equals(w.id)) ? [
          "score-animation"
        ] : void 0
      }, w.id.toString()))
    });
  }
}
function $O(g) {
  const f = Pn.get(oc), [h, _] = Kf.useState(0), [w, M] = Kf.useState(0), [C, me] = Kf.useState("");
  fC.useEffect(() => {
    if (g.cardsScore.length === 0)
      return;
    const { cardsScore: _e } = g, ee = setInterval(() => {
      if (_e.length === 0) {
        clearInterval(ee);
        return;
      }
      const de = _e[_e.length - 1];
      _((ve) => ve + de.points), M((ve) => ve + de.multiplier), me(de.play), _e.pop(), console.log("cardsScore", _e);
    }, f.getVelocity() * 1e3);
  }, [
    g
  ]);
  const { currentScore: J, objetiveScore: ie } = g;
  return /* @__PURE__ */ ze.jsxs("div", {
    className: "points",
    children: [
      /* @__PURE__ */ ze.jsxs("div", {
        className: "current-points",
        children: [
          J,
          " / ",
          ie
        ]
      }),
      /* @__PURE__ */ ze.jsxs("div", {
        className: "last-game",
        children: [
          "Última jugada: ",
          C
        ]
      }),
      /* @__PURE__ */ ze.jsxs("div", {
        className: "last-game-points",
        children: [
          "Puntos: ",
          h
        ]
      }),
      /* @__PURE__ */ ze.jsxs("div", {
        className: "last-game-multipliers",
        children: [
          "Multiplicador: ",
          w
        ]
      })
    ]
  });
}
function IO(g) {
  const [f, h] = Kf.useState();
  function _(C) {
    console.log("purchaseCardPlay", f, C), !f && (g.onPurchaseCardPlay(C), h(C));
  }
  const { rewards: w, onPurchasedRewards: M } = g;
  return /* @__PURE__ */ ze.jsx(ze.Fragment, {
    children: /* @__PURE__ */ ze.jsx("div", {
      className: "battle-win-content",
      children: /* @__PURE__ */ ze.jsxs("div", {
        className: "battle-rewards",
        children: [
          /* @__PURE__ */ ze.jsx("div", {
            className: "battle-rewards-title",
            children: "Victoria"
          }),
          /* @__PURE__ */ ze.jsx("div", {
            className: "battle-rewards-gold",
            children: "+ 1000$"
          }),
          /* @__PURE__ */ ze.jsx("div", {
            className: "battle-rewards-consumables",
            children: /* @__PURE__ */ ze.jsx("div", {})
          }),
          /* @__PURE__ */ ze.jsx("div", {
            className: "battle-rewards-card-plays",
            children: w.cardPlays.map((C, me) => /* @__PURE__ */ ze.jsx("div", {
              className: `card-plays-reward ${f === C ? "purchased" : ""}`,
              onClick: () => _(C),
              children: C
            }, me))
          }),
          /* @__PURE__ */ ze.jsx("div", {
            className: "battle-rewards-actions",
            children: /* @__PURE__ */ ze.jsx("button", {
              onClick: () => M(),
              children: "Continuar"
            })
          })
        ]
      })
    })
  });
}
var YO = Object.defineProperty, WO = Object.getOwnPropertyDescriptor, GO = (g, f, h, _) => {
  for (var w = _ > 1 ? void 0 : _ ? WO(f, h) : f, M = g.length - 1, C; M >= 0; M--)
    (C = g[M]) && (w = (_ ? C(f, h, w) : C(w)) || w);
  return _ && w && YO(f, h, w), w;
};
let py = class {
  constructor(g, f, h, _, w, M) {
    this._logger = g, this._sceneEventBus = f, this._battleEventBus = h, this._animationsManager = _, this._state = w, this._battleContext = M;
    const C = this._state.subscribeTo(uc, hl, ({ payload: ee }) => {
      this._logger.logInfo("Deck updated", JSON.stringify(ee)), this._deck = ee, this.render();
    });
    this._subscriptions.push(C);
    const me = this._state.subscribeTo(uc, iu, ({ payload: ee }) => {
      this._logger.logInfo("BattleScoreManager updated", JSON.stringify(ee)), this._battleScoreManager = ee, this.render();
    });
    this._subscriptions.push(me);
    const J = this._battleEventBus.subscribeTo(my, Array, ({ payload: ee }) => {
      this._playedCards.push(ee), this.render();
    });
    this._subscriptions.push(J);
    const ie = this._battleEventBus.subscribe(gy, () => {
      this._battleStatus = 2, this._possibleRewards = this._battleContext.generateRewards(), this.render();
    });
    this._subscriptions.push(ie);
    const _e = this._battleEventBus.subscribe(yy, () => {
      this._battleStatus = 3, this.render();
    });
    this._subscriptions.push(_e);
  }
  _root = void 0;
  _deck = void 0;
  _battleScoreManager = void 0;
  _subscriptions = [];
  _playedCards = [];
  _battleStatus = 0;
  _possibleRewards = void 0;
  load(g) {
    this._root = g, this._deck = this._state.getOrThrow(hl), this._battleScoreManager = this._state.getOrThrow(iu), this.render();
  }
  onHandCardClick(g) {
    this._battleContext.selectCard(g);
  }
  onDiscardClick() {
    this._battleContext.discardSelectedCards();
  }
  onPlayClick() {
    this._battleContext.run();
  }
  onScoreAnimationEnd() {
    this.render();
  }
  changeAnimationsVelocity() {
    this._animationsManager.addVelocity(), this.render();
  }
  onRewardsPurchased() {
    this._battleContext.rewardsPurchased();
  }
  onPurchaseCardPlay(g) {
    this._battleContext.purchaseCardPlay(g);
  }
  render() {
    this._root && this._root.render(/* @__PURE__ */ ze.jsxs(ze.Fragment, {
      children: [
        /* @__PURE__ */ ze.jsxs("div", {
          onClick: () => this.changeAnimationsVelocity(),
          children: [
            "Animation velocity (",
            this._animationsManager.getVelocity(),
            ")"
          ]
        }),
        /* @__PURE__ */ ze.jsx("div", {
          children: this._battleScoreManager?.cardPlays.map((g, f) => /* @__PURE__ */ ze.jsxs("div", {
            children: [
              g.name,
              " x",
              g.level
            ]
          }, f))
        }),
        /* @__PURE__ */ ze.jsxs("div", {
          className: "battle-scene",
          children: [
            /* @__PURE__ */ ze.jsxs("div", {
              className: "status",
              children: [
                /* @__PURE__ */ ze.jsxs("div", {
                  className: "hands",
                  children: [
                    "Manos: ",
                    this._battleScoreManager?.remainingActions
                  ]
                }),
                /* @__PURE__ */ ze.jsxs("div", {
                  className: "discards",
                  children: [
                    "Descartes: ",
                    this._battleScoreManager?.remainingDiscards
                  ]
                }),
                /* @__PURE__ */ ze.jsx("div", {
                  className: "gold",
                  children: "Oro: 1000$"
                })
              ]
            }),
            /* @__PURE__ */ ze.jsx($O, {
              cardsScore: this._playedCards || [],
              currentScore: this._battleScoreManager?.score || 0,
              objetiveScore: this._battleScoreManager?.objetiveScore || 0
            }),
            (this._deck?.lastPlayedCards || []).length > 0 && /* @__PURE__ */ ze.jsx(VO, {
              cards: this._deck?.lastPlayedCards || [],
              cardsScore: [],
              onScoreAnimationEnd: () => this.onScoreAnimationEnd()
            }),
            /* @__PURE__ */ ze.jsx("div", {
              className: "run",
              children: /* @__PURE__ */ ze.jsx("button", {
                className: "run-button",
                onClick: () => this.onPlayClick(),
                disabled: this._deck?.selectedCards?.length === 0 || this._battleScoreManager?.remainingActions === 0,
                children: "Jugar"
              })
            }),
            /* @__PURE__ */ ze.jsx("div", {
              className: "discard",
              children: /* @__PURE__ */ ze.jsx("button", {
                className: "discard-button",
                onClick: () => this.onDiscardClick(),
                disabled: this._deck?.selectedCards?.length === 0 || this._battleScoreManager?.remainingDiscards === 0,
                children: "Descartar"
              })
            }),
            /* @__PURE__ */ ze.jsx(AO, {
              cards: this._deck?.handCards || [],
              selectedCards: this._deck?.selectedCards || [],
              onCardClick: (g) => this.onHandCardClick(g)
            }),
            /* @__PURE__ */ ze.jsx("div", {
              className: "battle-win",
              hidden: this._battleStatus !== 2,
              children: /* @__PURE__ */ ze.jsx(IO, {
                rewards: this._possibleRewards || {
                  money: 0,
                  cardPlays: []
                },
                onPurchaseCardPlay: (g) => this.onPurchaseCardPlay(g),
                onPurchasedRewards: () => this.onRewardsPurchased()
              })
            }),
            /* @__PURE__ */ ze.jsx("div", {
              className: "battle-lost",
              hidden: this._battleStatus !== 3,
              children: /* @__PURE__ */ ze.jsx("div", {
                className: "battle-lost-content",
                children: "Perdiste"
              })
            })
          ]
        })
      ]
    }));
  }
  dispose() {
    this._subscriptions.forEach((g) => g.unsubscribe()), this._root = void 0, this._deck = void 0, this._battleScoreManager = void 0, this._battleStatus = 0;
  }
};
py = GO([
  hi()
], py);
var Xu = /* @__PURE__ */ ((g) => (g.Home = "Home", g.Battle = "Battle", g.Map = "Map", g.GameOver = "GameOver", g))(Xu || {}), vv = /* @__PURE__ */ ((g) => (g.Original = "Original", g.Random = "Random", g))(vv || {});
class dC extends hl {
  get name() {
    return "Original deck";
  }
  constructor() {
    super(7, 5);
  }
  static create() {
    return new dC();
  }
}
class pC extends hl {
  get name() {
    return "Random deck";
  }
  constructor() {
    super(5, 3);
  }
  static create() {
    return new pC();
  }
  init() {
    for (const f of Array.from({
      length: 42
    }, (h, _) => _)) {
      const h = fy[Math.floor(Math.random() * 4)], _ = Math.floor(Math.random() * 12) + 1, w = Sy.create(ji.newGuid(), h, _);
      this._cards.set(w);
    }
  }
}
class QO {
  static createDeck(f) {
    switch (f) {
      case vv.Original:
        return dC.create();
      case vv.Random:
        return pC.create();
      default:
        throw new Error("Invalid deck type");
    }
  }
}
var qO = Object.defineProperty, XO = Object.getOwnPropertyDescriptor, KO = (g, f, h, _) => {
  for (var w = _ > 1 ? void 0 : _ ? XO(f, h) : f, M = g.length - 1, C; M >= 0; M--)
    (C = g[M]) && (w = (_ ? C(f, h, w) : C(w)) || w);
  return _ && w && qO(f, h, w), w;
};
let hv = class {
  constructor(g, f) {
    this._sceneEventBus = g, this._gameContext = f;
  }
  _root = void 0;
  load(g) {
    this._root = g;
  }
  startGame(g) {
    this._gameContext.newRun(g);
    const f = ed.create(Xu.Map);
    this._sceneEventBus.publish(f);
  }
  render() {
    this._root && this._root.render(/* @__PURE__ */ ze.jsxs("div", {
      className: "home-scene",
      children: [
        /* @__PURE__ */ ze.jsx("div", {
          className: "title",
          children: /* @__PURE__ */ ze.jsx("h1", {
            children: "Home Scene"
          })
        }),
        /* @__PURE__ */ ze.jsxs("div", {
          className: "actions",
          children: [
            /* @__PURE__ */ ze.jsx("div", {
              className: "deck-cover",
              onClick: () => this.startGame(vv.Original),
              children: "Original"
            }),
            /* @__PURE__ */ ze.jsx("div", {
              className: "deck-cover",
              onClick: () => this.startGame(vv.Random),
              children: "Random"
            })
          ]
        })
      ]
    }));
  }
  dispose() {
  }
};
hv = KO([
  hi()
], hv);
function ZO(g) {
  return /* @__PURE__ */ ze.jsx("div", {
    className: "map-level",
    children: g.children
  });
}
function JO(g) {
  const f = Kf.useRef(null);
  fC.useEffect(() => {
    const { mapPoint: M, points: C } = g;
    if (M.children.length === 0)
      return;
    const me = C.filter((_e) => M.children.some((ee) => ee.equals(_e.id))), J = [];
    for (const _e of me) {
      const ee = _e && document.getElementById(_e.id.toString()), de = ee?.getBoundingClientRect(), ve = f.current, ke = ve?.getBoundingClientRect();
      if (!ee || !de || !ve || !ke)
        return;
      const ot = de.y + de.height - ke.y, st = 0;
      let It, $e;
      ke.x >= de.x ? (It = -(ke.x - de.x), $e = ke.x + ke.width - de.x) : (It = 0, $e = de.x + de.width - ke.x);
      let He, mt;
      const je = ke.height / 2, yt = ot - de.height / 2;
      ke.x >= de.x ? (He = $e - de.width / 2, mt = de.width - ke.width / 2) : (He = ke.width / 2, mt = $e - de.width / 2), J.push({
        width: $e,
        height: ot,
        top: st,
        left: It,
        x: He,
        y: je,
        x1: mt,
        y1: yt
      });
    }
    const ie = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`;
    for (const { width: _e, height: ee, top: de, left: ve, x: ke, y: ot, x1: st, y1: It } of J) {
      const $e = document.createElement("canvas"), He = $e.getContext("2d");
      $e.width = _e, $e.height = ee, $e.style.width = `${_e}px`, $e.style.height = `${ee}px`, $e.style.top = `${de}px`, $e.style.left = `${ve}px`, He.beginPath(), He.lineWidth = 2, He.strokeStyle = ie, g.level % 2 !== 0 && He.setLineDash([
        5,
        5
      ]), He.moveTo(ke, ot), He.lineTo(st, It), He.stroke(), f.current?.appendChild($e);
    }
  }, []);
  function h() {
    if (_.children.length === 0 && _.type !== $n.Final)
      return;
    let M = {};
    _.type === $n.Final && (M.backgroundColor = "#FFEBEE", M.borderColor = "#FFCDD2"), _.type === $n.Battle && (M.backgroundColor = "#ECEFF1", M.borderColor = "#CFD8DC"), _.type === $n.Boss && (M.backgroundColor = "#FFEBEE", M.borderColor = "#FFCDD2"), _.type === $n.Rest && (M.backgroundColor = "#E1F5FE", M.borderColor = "#B3E5FC"), _.type === $n.Shop && (M.backgroundColor = "#FFF8E1", M.borderColor = "#FFECB3"), _.isUnknow && (M.backgroundColor = "#F3E5F5", M.borderColor = "#E1BEE7");
    let C = "map-point-description";
    return (w?.children.some((J) => J.equals(_.id)) || !g.currentPoint && g.mapPoint.y === 0) && (C += " map-point-visitable", M = {}), g.currentPoint?.id.equals(_.id) && (C += " map-point-current", M = {}), /* @__PURE__ */ ze.jsx("div", {
      className: C,
      style: M,
      children: me()
    });
    function me() {
      if (_.isUnknow)
        return /* @__PURE__ */ ze.jsx("span", {
          className: "material-symbols-outlined",
          children: "question_mark"
        });
      if (_.type === $n.Final)
        return /* @__PURE__ */ ze.jsx("span", {
          className: "material-symbols-outlined",
          children: "local_shipping"
        });
      if (_.type === $n.Battle)
        return /* @__PURE__ */ ze.jsx("span", {
          className: "material-symbols-outlined",
          children: "eject"
        });
      if (_.type === $n.Boss)
        return /* @__PURE__ */ ze.jsx("span", {
          className: "material-symbols-outlined",
          children: "dangerous"
        });
      if (_.type === $n.Rest)
        return /* @__PURE__ */ ze.jsx("span", {
          className: "material-symbols-outlined",
          children: "hotel"
        });
      if (_.type === $n.Shop)
        return /* @__PURE__ */ ze.jsx("span", {
          className: "material-symbols-outlined",
          children: "storefront"
        });
    }
  }
  const { mapPoint: _, currentPoint: w } = g;
  return w?.children.some((M) => M.equals(_.id)), g.currentPoint?.id.equals(_.id), /* @__PURE__ */ ze.jsx("div", {
    id: _.id.toString(),
    ref: f,
    className: "map-point",
    style: {
      marginTop: `${_.position.top}px`,
      marginLeft: `${_.position.left}px`
    },
    onClick: g.onClick,
    children: h()
  });
}
var ek = Object.defineProperty, tk = Object.getOwnPropertyDescriptor, nk = (g, f, h, _) => {
  for (var w = _ > 1 ? void 0 : _ ? tk(f, h) : f, M = g.length - 1, C; M >= 0; M--)
    (C = g[M]) && (w = (_ ? C(f, h, w) : C(w)) || w);
  return _ && w && ek(f, h, w), w;
};
let vy = class {
  constructor(g, f, h) {
    this._sceneEventBus = g, this._state = f, this._mapContext = h;
    const _ = this._state.subscribeTo(uc, sc, ({ payload: w }) => {
      this._map = w, this.render();
    });
    this._subscriptions.push(_);
  }
  _map = void 0;
  _root = void 0;
  _subscriptions = [];
  changeCurrentPoint(g) {
    this._mapContext.goToPoint(g);
  }
  load(g) {
    this._root = g, this._map = this._state.getOrThrow(sc), this.render();
  }
  render() {
    if (!this._root || !this._map)
      return;
    const g = this._map;
    this._root.render(/* @__PURE__ */ ze.jsx("div", {
      className: "map-layout",
      children: this._map.levels.map((f, h) => /* @__PURE__ */ ze.jsx(ZO, {
        children: f.map((_) => /* @__PURE__ */ ze.jsx(JO, {
          mapPoint: _,
          level: h,
          lastLevel: g.levels.length - 1,
          currentLevel: g.currentLevel,
          currentPoint: g.currentPoint,
          points: g.points,
          onClick: () => this.changeCurrentPoint(_)
        }, _.id.toString()))
      }, h))
    }));
  }
  dispose() {
    this._subscriptions.forEach((g) => g.unsubscribe());
  }
};
vy = nk([
  hi()
], vy);
var Z0 = { exports: {} }, Ja = {}, uy = { exports: {} }, Q0 = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var o1;
function rk() {
  return o1 || (o1 = 1, function(g) {
    function f(se, Pe) {
      var O = se.length;
      se.push(Pe);
      e:
        for (; 0 < O; ) {
          var K = O - 1 >>> 1, q = se[K];
          if (0 < w(q, Pe))
            se[K] = Pe, se[O] = q, O = K;
          else
            break e;
        }
    }
    function h(se) {
      return se.length === 0 ? null : se[0];
    }
    function _(se) {
      if (se.length === 0)
        return null;
      var Pe = se[0], O = se.pop();
      if (O !== Pe) {
        se[0] = O;
        e:
          for (var K = 0, q = se.length, We = q >>> 1; K < We; ) {
            var Je = 2 * (K + 1) - 1, Ve = se[Je], gt = Je + 1, wt = se[gt];
            if (0 > w(Ve, O))
              gt < q && 0 > w(wt, Ve) ? (se[K] = wt, se[gt] = O, K = gt) : (se[K] = Ve, se[Je] = O, K = Je);
            else if (gt < q && 0 > w(wt, O))
              se[K] = wt, se[gt] = O, K = gt;
            else
              break e;
          }
      }
      return Pe;
    }
    function w(se, Pe) {
      var O = se.sortIndex - Pe.sortIndex;
      return O !== 0 ? O : se.id - Pe.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var M = performance;
      g.unstable_now = function() {
        return M.now();
      };
    } else {
      var C = Date, me = C.now();
      g.unstable_now = function() {
        return C.now() - me;
      };
    }
    var J = [], ie = [], _e = 1, ee = null, de = 3, ve = !1, ke = !1, ot = !1, st = typeof setTimeout == "function" ? setTimeout : null, It = typeof clearTimeout == "function" ? clearTimeout : null, $e = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function He(se) {
      for (var Pe = h(ie); Pe !== null; ) {
        if (Pe.callback === null)
          _(ie);
        else if (Pe.startTime <= se)
          _(ie), Pe.sortIndex = Pe.expirationTime, f(J, Pe);
        else
          break;
        Pe = h(ie);
      }
    }
    function mt(se) {
      if (ot = !1, He(se), !ke)
        if (h(J) !== null)
          ke = !0, Ot(je);
        else {
          var Pe = h(ie);
          Pe !== null && Oe(mt, Pe.startTime - se);
        }
    }
    function je(se, Pe) {
      ke = !1, ot && (ot = !1, It(an), an = -1), ve = !0;
      var O = de;
      try {
        for (He(Pe), ee = h(J); ee !== null && (!(ee.expirationTime > Pe) || se && !jt()); ) {
          var K = ee.callback;
          if (typeof K == "function") {
            ee.callback = null, de = ee.priorityLevel;
            var q = K(ee.expirationTime <= Pe);
            Pe = g.unstable_now(), typeof q == "function" ? ee.callback = q : ee === h(J) && _(J), He(Pe);
          } else
            _(J);
          ee = h(J);
        }
        if (ee !== null)
          var We = !0;
        else {
          var Je = h(ie);
          Je !== null && Oe(mt, Je.startTime - Pe), We = !1;
        }
        return We;
      } finally {
        ee = null, de = O, ve = !1;
      }
    }
    var yt = !1, nt = null, an = -1, Rn = 5, Xt = -1;
    function jt() {
      return !(g.unstable_now() - Xt < Rn);
    }
    function En() {
      if (nt !== null) {
        var se = g.unstable_now();
        Xt = se;
        var Pe = !0;
        try {
          Pe = nt(!0, se);
        } finally {
          Pe ? Xe() : (yt = !1, nt = null);
        }
      } else
        yt = !1;
    }
    var Xe;
    if (typeof $e == "function")
      Xe = function() {
        $e(En);
      };
    else if (typeof MessageChannel < "u") {
      var ct = new MessageChannel(), Ft = ct.port2;
      ct.port1.onmessage = En, Xe = function() {
        Ft.postMessage(null);
      };
    } else
      Xe = function() {
        st(En, 0);
      };
    function Ot(se) {
      nt = se, yt || (yt = !0, Xe());
    }
    function Oe(se, Pe) {
      an = st(function() {
        se(g.unstable_now());
      }, Pe);
    }
    g.unstable_IdlePriority = 5, g.unstable_ImmediatePriority = 1, g.unstable_LowPriority = 4, g.unstable_NormalPriority = 3, g.unstable_Profiling = null, g.unstable_UserBlockingPriority = 2, g.unstable_cancelCallback = function(se) {
      se.callback = null;
    }, g.unstable_continueExecution = function() {
      ke || ve || (ke = !0, Ot(je));
    }, g.unstable_forceFrameRate = function(se) {
      0 > se || 125 < se ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Rn = 0 < se ? Math.floor(1e3 / se) : 5;
    }, g.unstable_getCurrentPriorityLevel = function() {
      return de;
    }, g.unstable_getFirstCallbackNode = function() {
      return h(J);
    }, g.unstable_next = function(se) {
      switch (de) {
        case 1:
        case 2:
        case 3:
          var Pe = 3;
          break;
        default:
          Pe = de;
      }
      var O = de;
      de = Pe;
      try {
        return se();
      } finally {
        de = O;
      }
    }, g.unstable_pauseExecution = function() {
    }, g.unstable_requestPaint = function() {
    }, g.unstable_runWithPriority = function(se, Pe) {
      switch (se) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          se = 3;
      }
      var O = de;
      de = se;
      try {
        return Pe();
      } finally {
        de = O;
      }
    }, g.unstable_scheduleCallback = function(se, Pe, O) {
      var K = g.unstable_now();
      switch (typeof O == "object" && O !== null ? (O = O.delay, O = typeof O == "number" && 0 < O ? K + O : K) : O = K, se) {
        case 1:
          var q = -1;
          break;
        case 2:
          q = 250;
          break;
        case 5:
          q = 1073741823;
          break;
        case 4:
          q = 1e4;
          break;
        default:
          q = 5e3;
      }
      return q = O + q, se = {
        id: _e++,
        callback: Pe,
        priorityLevel: se,
        startTime: O,
        expirationTime: q,
        sortIndex: -1
      }, O > K ? (se.sortIndex = O, f(ie, se), h(J) === null && se === h(ie) && (ot ? (It(an), an = -1) : ot = !0, Oe(mt, O - K))) : (se.sortIndex = q, f(J, se), ke || ve || (ke = !0, Ot(je))), se;
    }, g.unstable_shouldYield = jt, g.unstable_wrapCallback = function(se) {
      var Pe = de;
      return function() {
        var O = de;
        de = Pe;
        try {
          return se.apply(this, arguments);
        } finally {
          de = O;
        }
      };
    };
  }(Q0)), Q0;
}
var q0 = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var s1;
function ak() {
  return s1 || (s1 = 1, function(g) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var f = !1, h = !1, _ = 5;
      function w(T, N) {
        var F = T.length;
        T.push(N), me(T, N, F);
      }
      function M(T) {
        return T.length === 0 ? null : T[0];
      }
      function C(T) {
        if (T.length === 0)
          return null;
        var N = T[0], F = T.pop();
        return F !== N && (T[0] = F, J(T, F, 0)), N;
      }
      function me(T, N, F) {
        for (var Z = F; Z > 0; ) {
          var he = Z - 1 >>> 1, St = T[he];
          if (ie(St, N) > 0)
            T[he] = N, T[Z] = St, Z = he;
          else
            return;
        }
      }
      function J(T, N, F) {
        for (var Z = F, he = T.length, St = he >>> 1; Z < St; ) {
          var Ct = (Z + 1) * 2 - 1, Ge = T[Ct], te = Ct + 1, Ce = T[te];
          if (ie(Ge, N) < 0)
            te < he && ie(Ce, Ge) < 0 ? (T[Z] = Ce, T[te] = N, Z = te) : (T[Z] = Ge, T[Ct] = N, Z = Ct);
          else if (te < he && ie(Ce, N) < 0)
            T[Z] = Ce, T[te] = N, Z = te;
          else
            return;
        }
      }
      function ie(T, N) {
        var F = T.sortIndex - N.sortIndex;
        return F !== 0 ? F : T.id - N.id;
      }
      var _e = 1, ee = 2, de = 3, ve = 4, ke = 5;
      function ot(T, N) {
      }
      var st = typeof performance == "object" && typeof performance.now == "function";
      if (st) {
        var It = performance;
        g.unstable_now = function() {
          return It.now();
        };
      } else {
        var $e = Date, He = $e.now();
        g.unstable_now = function() {
          return $e.now() - He;
        };
      }
      var mt = 1073741823, je = -1, yt = 250, nt = 5e3, an = 1e4, Rn = mt, Xt = [], jt = [], En = 1, Xe = null, ct = de, Ft = !1, Ot = !1, Oe = !1, se = typeof setTimeout == "function" ? setTimeout : null, Pe = typeof clearTimeout == "function" ? clearTimeout : null, O = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function K(T) {
        for (var N = M(jt); N !== null; ) {
          if (N.callback === null)
            C(jt);
          else if (N.startTime <= T)
            C(jt), N.sortIndex = N.expirationTime, w(Xt, N);
          else
            return;
          N = M(jt);
        }
      }
      function q(T) {
        if (Oe = !1, K(T), !Ot)
          if (M(Xt) !== null)
            Ot = !0, Wn(We);
          else {
            var N = M(jt);
            N !== null && hn(q, N.startTime - T);
          }
      }
      function We(T, N) {
        Ot = !1, Oe && (Oe = !1, Sr()), Ft = !0;
        var F = ct;
        try {
          var Z;
          if (!h)
            return Je(T, N);
        } finally {
          Xe = null, ct = F, Ft = !1;
        }
      }
      function Je(T, N) {
        var F = N;
        for (K(F), Xe = M(Xt); Xe !== null && !f && !(Xe.expirationTime > F && (!T || gr())); ) {
          var Z = Xe.callback;
          if (typeof Z == "function") {
            Xe.callback = null, ct = Xe.priorityLevel;
            var he = Xe.expirationTime <= F, St = Z(he);
            F = g.unstable_now(), typeof St == "function" ? Xe.callback = St : Xe === M(Xt) && C(Xt), K(F);
          } else
            C(Xt);
          Xe = M(Xt);
        }
        if (Xe !== null)
          return !0;
        var Ct = M(jt);
        return Ct !== null && hn(q, Ct.startTime - F), !1;
      }
      function Ve(T, N) {
        switch (T) {
          case _e:
          case ee:
          case de:
          case ve:
          case ke:
            break;
          default:
            T = de;
        }
        var F = ct;
        ct = T;
        try {
          return N();
        } finally {
          ct = F;
        }
      }
      function gt(T) {
        var N;
        switch (ct) {
          case _e:
          case ee:
          case de:
            N = de;
            break;
          default:
            N = ct;
            break;
        }
        var F = ct;
        ct = N;
        try {
          return T();
        } finally {
          ct = F;
        }
      }
      function wt(T) {
        var N = ct;
        return function() {
          var F = ct;
          ct = N;
          try {
            return T.apply(this, arguments);
          } finally {
            ct = F;
          }
        };
      }
      function vt(T, N, F) {
        var Z = g.unstable_now(), he;
        if (typeof F == "object" && F !== null) {
          var St = F.delay;
          typeof St == "number" && St > 0 ? he = Z + St : he = Z;
        } else
          he = Z;
        var Ct;
        switch (T) {
          case _e:
            Ct = je;
            break;
          case ee:
            Ct = yt;
            break;
          case ke:
            Ct = Rn;
            break;
          case ve:
            Ct = an;
            break;
          case de:
          default:
            Ct = nt;
            break;
        }
        var Ge = he + Ct, te = {
          id: En++,
          callback: N,
          priorityLevel: T,
          startTime: he,
          expirationTime: Ge,
          sortIndex: -1
        };
        return he > Z ? (te.sortIndex = he, w(jt, te), M(Xt) === null && te === M(jt) && (Oe ? Sr() : Oe = !0, hn(q, he - Z))) : (te.sortIndex = Ge, w(Xt, te), !Ot && !Ft && (Ot = !0, Wn(We))), te;
      }
      function Yt() {
      }
      function vn() {
        !Ot && !Ft && (Ot = !0, Wn(We));
      }
      function Zn() {
        return M(Xt);
      }
      function jn(T) {
        T.callback = null;
      }
      function cn() {
        return ct;
      }
      var In = !1, Tn = null, Nn = -1, _n = _, yr = -1;
      function gr() {
        var T = g.unstable_now() - yr;
        return !(T < _n);
      }
      function Fn() {
      }
      function Yn(T) {
        if (T < 0 || T > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        T > 0 ? _n = Math.floor(1e3 / T) : _n = _;
      }
      var Lr = function() {
        if (Tn !== null) {
          var T = g.unstable_now();
          yr = T;
          var N = !0, F = !0;
          try {
            F = Tn(N, T);
          } finally {
            F ? or() : (In = !1, Tn = null);
          }
        } else
          In = !1;
      }, or;
      if (typeof O == "function")
        or = function() {
          O(Lr);
        };
      else if (typeof MessageChannel < "u") {
        var Br = new MessageChannel(), Jn = Br.port2;
        Br.port1.onmessage = Lr, or = function() {
          Jn.postMessage(null);
        };
      } else
        or = function() {
          se(Lr, 0);
        };
      function Wn(T) {
        Tn = T, In || (In = !0, or());
      }
      function hn(T, N) {
        Nn = se(function() {
          T(g.unstable_now());
        }, N);
      }
      function Sr() {
        Pe(Nn), Nn = -1;
      }
      var La = Fn, Cr = null;
      g.unstable_IdlePriority = ke, g.unstable_ImmediatePriority = _e, g.unstable_LowPriority = ve, g.unstable_NormalPriority = de, g.unstable_Profiling = Cr, g.unstable_UserBlockingPriority = ee, g.unstable_cancelCallback = jn, g.unstable_continueExecution = vn, g.unstable_forceFrameRate = Yn, g.unstable_getCurrentPriorityLevel = cn, g.unstable_getFirstCallbackNode = Zn, g.unstable_next = gt, g.unstable_pauseExecution = Yt, g.unstable_requestPaint = La, g.unstable_runWithPriority = Ve, g.unstable_scheduleCallback = vt, g.unstable_shouldYield = gr, g.unstable_wrapCallback = wt, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(q0)), q0;
}
var c1;
function g1() {
  return c1 || (c1 = 1, process.env.NODE_ENV === "production" ? uy.exports = rk() : uy.exports = ak()), uy.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f1;
function ik() {
  if (f1)
    return Ja;
  f1 = 1;
  var g = yv(), f = g1();
  function h(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++)
      r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var _ = /* @__PURE__ */ new Set(), w = {};
  function M(n, r) {
    C(n, r), C(n + "Capture", r);
  }
  function C(n, r) {
    for (w[n] = r, n = 0; n < r.length; n++)
      _.add(r[n]);
  }
  var me = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), J = Object.prototype.hasOwnProperty, ie = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, _e = {}, ee = {};
  function de(n) {
    return J.call(ee, n) ? !0 : J.call(_e, n) ? !1 : ie.test(n) ? ee[n] = !0 : (_e[n] = !0, !1);
  }
  function ve(n, r, l, o) {
    if (l !== null && l.type === 0)
      return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return o ? !1 : l !== null ? !l.acceptsBooleans : (n = n.toLowerCase().slice(0, 5), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function ke(n, r, l, o) {
    if (r === null || typeof r > "u" || ve(n, r, l, o))
      return !0;
    if (o)
      return !1;
    if (l !== null)
      switch (l.type) {
        case 3:
          return !r;
        case 4:
          return r === !1;
        case 5:
          return isNaN(r);
        case 6:
          return isNaN(r) || 1 > r;
      }
    return !1;
  }
  function ot(n, r, l, o, c, p, S) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = o, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = p, this.removeEmptyString = S;
  }
  var st = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    st[n] = new ot(n, 0, !1, n, null, !1, !1);
  }), [
    [
      "acceptCharset",
      "accept-charset"
    ],
    [
      "className",
      "class"
    ],
    [
      "htmlFor",
      "for"
    ],
    [
      "httpEquiv",
      "http-equiv"
    ]
  ].forEach(function(n) {
    var r = n[0];
    st[r] = new ot(r, 1, !1, n[1], null, !1, !1);
  }), [
    "contentEditable",
    "draggable",
    "spellCheck",
    "value"
  ].forEach(function(n) {
    st[n] = new ot(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), [
    "autoReverse",
    "externalResourcesRequired",
    "focusable",
    "preserveAlpha"
  ].forEach(function(n) {
    st[n] = new ot(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    st[n] = new ot(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), [
    "checked",
    "multiple",
    "muted",
    "selected"
  ].forEach(function(n) {
    st[n] = new ot(n, 3, !0, n, null, !1, !1);
  }), [
    "capture",
    "download"
  ].forEach(function(n) {
    st[n] = new ot(n, 4, !1, n, null, !1, !1);
  }), [
    "cols",
    "rows",
    "size",
    "span"
  ].forEach(function(n) {
    st[n] = new ot(n, 6, !1, n, null, !1, !1);
  }), [
    "rowSpan",
    "start"
  ].forEach(function(n) {
    st[n] = new ot(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var It = /[\-:]([a-z])/g;
  function $e(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(It, $e);
    st[r] = new ot(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(It, $e);
    st[r] = new ot(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), [
    "xml:base",
    "xml:lang",
    "xml:space"
  ].forEach(function(n) {
    var r = n.replace(It, $e);
    st[r] = new ot(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), [
    "tabIndex",
    "crossOrigin"
  ].forEach(function(n) {
    st[n] = new ot(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), st.xlinkHref = new ot("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), [
    "src",
    "href",
    "action",
    "formAction"
  ].forEach(function(n) {
    st[n] = new ot(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function He(n, r, l, o) {
    var c = st.hasOwnProperty(r) ? st[r] : null;
    (c !== null ? c.type !== 0 : o || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (ke(r, l, c, o) && (l = null), o || c === null ? de(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, o = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, o ? n.setAttributeNS(o, r, l) : n.setAttribute(r, l))));
  }
  var mt = g.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, je = Symbol.for("react.element"), yt = Symbol.for("react.portal"), nt = Symbol.for("react.fragment"), an = Symbol.for("react.strict_mode"), Rn = Symbol.for("react.profiler"), Xt = Symbol.for("react.provider"), jt = Symbol.for("react.context"), En = Symbol.for("react.forward_ref"), Xe = Symbol.for("react.suspense"), ct = Symbol.for("react.suspense_list"), Ft = Symbol.for("react.memo"), Ot = Symbol.for("react.lazy"), Oe = Symbol.for("react.offscreen"), se = Symbol.iterator;
  function Pe(n) {
    return n === null || typeof n != "object" ? null : (n = se && n[se] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var O = Object.assign, K;
  function q(n) {
    if (K === void 0)
      try {
        throw Error();
      } catch (l) {
        var r = l.stack.trim().match(/\n( *(at )?)/);
        K = r && r[1] || "";
      }
    return `
` + K + n;
  }
  var We = !1;
  function Je(n, r) {
    if (!n || We)
      return "";
    We = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (r)
        if (r = function() {
          throw Error();
        }, Object.defineProperty(r.prototype, "props", {
          set: function() {
            throw Error();
          }
        }), typeof Reflect == "object" && Reflect.construct) {
          try {
            Reflect.construct(r, []);
          } catch (I) {
            var o = I;
          }
          Reflect.construct(n, [], r);
        } else {
          try {
            r.call();
          } catch (I) {
            o = I;
          }
          n.call(r.prototype);
        }
      else {
        try {
          throw Error();
        } catch (I) {
          o = I;
        }
        n();
      }
    } catch (I) {
      if (I && o && typeof I.stack == "string") {
        for (var c = I.stack.split(`
`), p = o.stack.split(`
`), S = c.length - 1, R = p.length - 1; 1 <= S && 0 <= R && c[S] !== p[R]; )
          R--;
        for (; 1 <= S && 0 <= R; S--, R--)
          if (c[S] !== p[R]) {
            if (S !== 1 || R !== 1)
              do
                if (S--, R--, 0 > R || c[S] !== p[R]) {
                  var k = `
` + c[S].replace(" at new ", " at ");
                  return n.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", n.displayName)), k;
                }
              while (1 <= S && 0 <= R);
            break;
          }
      }
    } finally {
      We = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? q(n) : "";
  }
  function Ve(n) {
    switch (n.tag) {
      case 5:
        return q(n.type);
      case 16:
        return q("Lazy");
      case 13:
        return q("Suspense");
      case 19:
        return q("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = Je(n.type, !1), n;
      case 11:
        return n = Je(n.type.render, !1), n;
      case 1:
        return n = Je(n.type, !0), n;
      default:
        return "";
    }
  }
  function gt(n) {
    if (n == null)
      return null;
    if (typeof n == "function")
      return n.displayName || n.name || null;
    if (typeof n == "string")
      return n;
    switch (n) {
      case nt:
        return "Fragment";
      case yt:
        return "Portal";
      case Rn:
        return "Profiler";
      case an:
        return "StrictMode";
      case Xe:
        return "Suspense";
      case ct:
        return "SuspenseList";
    }
    if (typeof n == "object")
      switch (n.$$typeof) {
        case jt:
          return (n.displayName || "Context") + ".Consumer";
        case Xt:
          return (n._context.displayName || "Context") + ".Provider";
        case En:
          var r = n.render;
          return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
        case Ft:
          return r = n.displayName || null, r !== null ? r : gt(n.type) || "Memo";
        case Ot:
          r = n._payload, n = n._init;
          try {
            return gt(n(r));
          } catch {
          }
      }
    return null;
  }
  function wt(n) {
    var r = n.type;
    switch (n.tag) {
      case 24:
        return "Cache";
      case 9:
        return (r.displayName || "Context") + ".Consumer";
      case 10:
        return (r._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return n = r.render, n = n.displayName || n.name || "", r.displayName || (n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return r;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return gt(r);
      case 8:
        return r === an ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof r == "function")
          return r.displayName || r.name || null;
        if (typeof r == "string")
          return r;
    }
    return null;
  }
  function vt(n) {
    switch (typeof n) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return n;
      case "object":
        return n;
      default:
        return "";
    }
  }
  function Yt(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function vn(n) {
    var r = Yt(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), o = "" + n[r];
    if (!n.hasOwnProperty(r) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var c = l.get, p = l.set;
      return Object.defineProperty(n, r, {
        configurable: !0,
        get: function() {
          return c.call(this);
        },
        set: function(S) {
          o = "" + S, p.call(this, S);
        }
      }), Object.defineProperty(n, r, {
        enumerable: l.enumerable
      }), {
        getValue: function() {
          return o;
        },
        setValue: function(S) {
          o = "" + S;
        },
        stopTracking: function() {
          n._valueTracker = null, delete n[r];
        }
      };
    }
  }
  function Zn(n) {
    n._valueTracker || (n._valueTracker = vn(n));
  }
  function jn(n) {
    if (!n)
      return !1;
    var r = n._valueTracker;
    if (!r)
      return !0;
    var l = r.getValue(), o = "";
    return n && (o = Yt(n) ? n.checked ? "true" : "false" : n.value), n = o, n !== l ? (r.setValue(n), !0) : !1;
  }
  function cn(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u")
      return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function In(n, r) {
    var l = r.checked;
    return O({}, r, {
      defaultChecked: void 0,
      defaultValue: void 0,
      value: void 0,
      checked: l ?? n._wrapperState.initialChecked
    });
  }
  function Tn(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, o = r.checked != null ? r.checked : r.defaultChecked;
    l = vt(r.value != null ? r.value : l), n._wrapperState = {
      initialChecked: o,
      initialValue: l,
      controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null
    };
  }
  function Nn(n, r) {
    r = r.checked, r != null && He(n, "checked", r, !1);
  }
  function _n(n, r) {
    Nn(n, r);
    var l = vt(r.value), o = r.type;
    if (l != null)
      o === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (o === "submit" || o === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? gr(n, r.type, l) : r.hasOwnProperty("defaultValue") && gr(n, r.type, vt(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function yr(n, r, l) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var o = r.type;
      if (!(o !== "submit" && o !== "reset" || r.value !== void 0 && r.value !== null))
        return;
      r = "" + n._wrapperState.initialValue, l || r === n.value || (n.value = r), n.defaultValue = r;
    }
    l = n.name, l !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, l !== "" && (n.name = l);
  }
  function gr(n, r, l) {
    (r !== "number" || cn(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var Fn = Array.isArray;
  function Yn(n, r, l, o) {
    if (n = n.options, r) {
      r = {};
      for (var c = 0; c < l.length; c++)
        r["$" + l[c]] = !0;
      for (l = 0; l < n.length; l++)
        c = r.hasOwnProperty("$" + n[l].value), n[l].selected !== c && (n[l].selected = c), c && o && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + vt(l), r = null, c = 0; c < n.length; c++) {
        if (n[c].value === l) {
          n[c].selected = !0, o && (n[c].defaultSelected = !0);
          return;
        }
        r !== null || n[c].disabled || (r = n[c]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function Lr(n, r) {
    if (r.dangerouslySetInnerHTML != null)
      throw Error(h(91));
    return O({}, r, {
      value: void 0,
      defaultValue: void 0,
      children: "" + n._wrapperState.initialValue
    });
  }
  function or(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null)
          throw Error(h(92));
        if (Fn(l)) {
          if (1 < l.length)
            throw Error(h(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = {
      initialValue: vt(l)
    };
  }
  function Br(n, r) {
    var l = vt(r.value), o = vt(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), o != null && (n.defaultValue = "" + o);
  }
  function Jn(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function Wn(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function hn(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? Wn(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var Sr, La = function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, l, o, c) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, l, o, c);
      });
    } : n;
  }(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n)
      n.innerHTML = r;
    else {
      for (Sr = Sr || document.createElement("div"), Sr.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = Sr.firstChild; n.firstChild; )
        n.removeChild(n.firstChild);
      for (; r.firstChild; )
        n.appendChild(r.firstChild);
    }
  });
  function Cr(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var T = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, N = [
    "Webkit",
    "ms",
    "Moz",
    "O"
  ];
  Object.keys(T).forEach(function(n) {
    N.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), T[r] = T[n];
    });
  });
  function F(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || T.hasOwnProperty(n) && T[n] ? ("" + r).trim() : r + "px";
  }
  function Z(n, r) {
    n = n.style;
    for (var l in r)
      if (r.hasOwnProperty(l)) {
        var o = l.indexOf("--") === 0, c = F(l, r[l], o);
        l === "float" && (l = "cssFloat"), o ? n.setProperty(l, c) : n[l] = c;
      }
  }
  var he = O({
    menuitem: !0
  }, {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0
  });
  function St(n, r) {
    if (r) {
      if (he[n] && (r.children != null || r.dangerouslySetInnerHTML != null))
        throw Error(h(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null)
          throw Error(h(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML))
          throw Error(h(61));
      }
      if (r.style != null && typeof r.style != "object")
        throw Error(h(62));
    }
  }
  function Ct(n, r) {
    if (n.indexOf("-") === -1)
      return typeof r.is == "string";
    switch (n) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Ge = null;
  function te(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var Ce = null, oe = null, ce = null;
  function it(n) {
    if (n = Cs(n)) {
      if (typeof Ce != "function")
        throw Error(h(280));
      var r = n.stateNode;
      r && (r = Ye(r), Ce(n.stateNode, n.type, r));
    }
  }
  function Dt(n) {
    oe ? ce ? ce.push(n) : ce = [
      n
    ] : oe = n;
  }
  function Kt() {
    if (oe) {
      var n = oe, r = ce;
      if (ce = oe = null, it(n), r)
        for (n = 0; n < r.length; n++)
          it(r[n]);
    }
  }
  function er(n, r) {
    return n(r);
  }
  function Fi() {
  }
  var ni = !1;
  function mi(n, r, l) {
    if (ni)
      return n(r, l);
    ni = !0;
    try {
      return er(n, r, l);
    } finally {
      ni = !1, (oe !== null || ce !== null) && (Fi(), Kt());
    }
  }
  function Sa(n, r) {
    var l = n.stateNode;
    if (l === null)
      return null;
    var o = Ye(l);
    if (o === null)
      return null;
    l = o[r];
    e:
      switch (r) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          (o = !o.disabled) || (n = n.type, o = !(n === "button" || n === "input" || n === "select" || n === "textarea")), n = !o;
          break e;
        default:
          n = !1;
      }
    if (n)
      return null;
    if (l && typeof l != "function")
      throw Error(h(231, r, typeof l));
    return l;
  }
  var yi = !1;
  if (me)
    try {
      var Ca = {};
      Object.defineProperty(Ca, "passive", {
        get: function() {
          yi = !0;
        }
      }), window.addEventListener("test", Ca, Ca), window.removeEventListener("test", Ca, Ca);
    } catch {
      yi = !1;
    }
  function gi(n, r, l, o, c, p, S, R, k) {
    var I = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, I);
    } catch (ae) {
      this.onError(ae);
    }
  }
  var Vr = !1, Ea = null, Si = !1, D = null, ne = {
    onError: function(n) {
      Vr = !0, Ea = n;
    }
  };
  function ye(n, r, l, o, c, p, S, R, k) {
    Vr = !1, Ea = null, gi.apply(ne, arguments);
  }
  function Te(n, r, l, o, c, p, S, R, k) {
    if (ye.apply(this, arguments), Vr) {
      if (Vr) {
        var I = Ea;
        Vr = !1, Ea = null;
      } else
        throw Error(h(198));
      Si || (Si = !0, D = I);
    }
  }
  function ht(n) {
    var r = n, l = n;
    if (n.alternate)
      for (; r.return; )
        r = r.return;
    else {
      n = r;
      do
        r = n, r.flags & 4098 && (l = r.return), n = r.return;
      while (n);
    }
    return r.tag === 3 ? l : null;
  }
  function Lt(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null)
        return r.dehydrated;
    }
    return null;
  }
  function Et(n) {
    if (ht(n) !== n)
      throw Error(h(188));
  }
  function Qe(n) {
    var r = n.alternate;
    if (!r) {
      if (r = ht(n), r === null)
        throw Error(h(188));
      return r !== n ? null : n;
    }
    for (var l = n, o = r; ; ) {
      var c = l.return;
      if (c === null)
        break;
      var p = c.alternate;
      if (p === null) {
        if (o = c.return, o !== null) {
          l = o;
          continue;
        }
        break;
      }
      if (c.child === p.child) {
        for (p = c.child; p; ) {
          if (p === l)
            return Et(c), n;
          if (p === o)
            return Et(c), r;
          p = p.sibling;
        }
        throw Error(h(188));
      }
      if (l.return !== o.return)
        l = c, o = p;
      else {
        for (var S = !1, R = c.child; R; ) {
          if (R === l) {
            S = !0, l = c, o = p;
            break;
          }
          if (R === o) {
            S = !0, o = c, l = p;
            break;
          }
          R = R.sibling;
        }
        if (!S) {
          for (R = p.child; R; ) {
            if (R === l) {
              S = !0, l = p, o = c;
              break;
            }
            if (R === o) {
              S = !0, o = p, l = c;
              break;
            }
            R = R.sibling;
          }
          if (!S)
            throw Error(h(189));
        }
      }
      if (l.alternate !== o)
        throw Error(h(190));
    }
    if (l.tag !== 3)
      throw Error(h(188));
    return l.stateNode.current === l ? n : r;
  }
  function Gn(n) {
    return n = Qe(n), n !== null ? fn(n) : null;
  }
  function fn(n) {
    if (n.tag === 5 || n.tag === 6)
      return n;
    for (n = n.child; n !== null; ) {
      var r = fn(n);
      if (r !== null)
        return r;
      n = n.sibling;
    }
    return null;
  }
  var dn = f.unstable_scheduleCallback, Er = f.unstable_cancelCallback, Ci = f.unstable_shouldYield, Ku = f.unstable_requestPaint, Ht = f.unstable_now, td = f.unstable_getCurrentPriorityLevel, ri = f.unstable_ImmediatePriority, Rt = f.unstable_UserBlockingPriority, Ei = f.unstable_NormalPriority, yl = f.unstable_LowPriority, Zu = f.unstable_IdlePriority, gl = null, na = null;
  function rs(n) {
    if (na && typeof na.onCommitFiberRoot == "function")
      try {
        na.onCommitFiberRoot(gl, n, void 0, (n.current.flags & 128) === 128);
      } catch {
      }
  }
  var $r = Math.clz32 ? Math.clz32 : cc, as = Math.log, is = Math.LN2;
  function cc(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (as(n) / is | 0) | 0;
  }
  var Ju = 64, Sl = 4194304;
  function ai(n) {
    switch (n & -n) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return n & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return n & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return n;
    }
  }
  function Ir(n, r) {
    var l = n.pendingLanes;
    if (l === 0)
      return 0;
    var o = 0, c = n.suspendedLanes, p = n.pingedLanes, S = l & 268435455;
    if (S !== 0) {
      var R = S & ~c;
      R !== 0 ? o = ai(R) : (p &= S, p !== 0 && (o = ai(p)));
    } else
      S = l & ~c, S !== 0 ? o = ai(S) : p !== 0 && (o = ai(p));
    if (o === 0)
      return 0;
    if (r !== 0 && r !== o && !(r & c) && (c = o & -o, p = r & -r, c >= p || c === 16 && (p & 4194240) !== 0))
      return r;
    if (o & 4 && (o |= l & 16), r = n.entangledLanes, r !== 0)
      for (n = n.entanglements, r &= o; 0 < r; )
        l = 31 - $r(r), c = 1 << l, o |= n[l], r &= ~c;
    return o;
  }
  function Cl(n, r) {
    switch (n) {
      case 1:
      case 2:
      case 4:
        return r + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return r + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function El(n, r) {
    for (var l = n.suspendedLanes, o = n.pingedLanes, c = n.expirationTimes, p = n.pendingLanes; 0 < p; ) {
      var S = 31 - $r(p), R = 1 << S, k = c[S];
      k === -1 ? (!(R & l) || R & o) && (c[S] = Cl(R, r)) : k <= r && (n.expiredLanes |= R), p &= ~R;
    }
  }
  function _l(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function eo() {
    var n = Ju;
    return Ju <<= 1, !(Ju & 4194240) && (Ju = 64), n;
  }
  function to(n) {
    for (var r = [], l = 0; 31 > l; l++)
      r.push(n);
    return r;
  }
  function Hi(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - $r(r), n[r] = l;
  }
  function nd(n, r) {
    var l = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var o = n.eventTimes;
    for (n = n.expirationTimes; 0 < l; ) {
      var c = 31 - $r(l), p = 1 << c;
      r[c] = 0, o[c] = -1, n[c] = -1, l &= ~p;
    }
  }
  function _i(n, r) {
    var l = n.entangledLanes |= r;
    for (n = n.entanglements; l; ) {
      var o = 31 - $r(l), c = 1 << o;
      c & r | n[o] & r && (n[o] |= r), l &= ~c;
    }
  }
  var Wt = 0;
  function no(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var lu, ro, Bt, ao, io, ft = !1, uu = [], xn = null, ra = null, Yr = null, bl = /* @__PURE__ */ new Map(), Ln = /* @__PURE__ */ new Map(), Zt = [], fc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function aa(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        xn = null;
        break;
      case "dragenter":
      case "dragleave":
        ra = null;
        break;
      case "mouseover":
      case "mouseout":
        Yr = null;
        break;
      case "pointerover":
      case "pointerout":
        bl.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Ln.delete(r.pointerId);
    }
  }
  function sr(n, r, l, o, c, p) {
    return n === null || n.nativeEvent !== p ? (n = {
      blockedOn: r,
      domEventName: l,
      eventSystemFlags: o,
      nativeEvent: p,
      targetContainers: [
        c
      ]
    }, r !== null && (r = Cs(r), r !== null && ro(r)), n) : (n.eventSystemFlags |= o, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
  }
  function bi(n, r, l, o, c) {
    switch (r) {
      case "focusin":
        return xn = sr(xn, n, r, l, o, c), !0;
      case "dragenter":
        return ra = sr(ra, n, r, l, o, c), !0;
      case "mouseover":
        return Yr = sr(Yr, n, r, l, o, c), !0;
      case "pointerover":
        var p = c.pointerId;
        return bl.set(p, sr(bl.get(p) || null, n, r, l, o, c)), !0;
      case "gotpointercapture":
        return p = c.pointerId, Ln.set(p, sr(Ln.get(p) || null, n, r, l, o, c)), !0;
    }
    return !1;
  }
  function dc(n) {
    var r = Pa(n.target);
    if (r !== null) {
      var l = ht(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = Lt(l), r !== null) {
            n.blockedOn = r, io(n.priority, function() {
              Bt(l);
            });
            return;
          }
        } else if (r === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          n.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    n.blockedOn = null;
  }
  function Bi(n) {
    if (n.blockedOn !== null)
      return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var l = uo(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var o = new l.constructor(l.type, l);
        Ge = o, l.target.dispatchEvent(o), Ge = null;
      } else
        return r = Cs(l), r !== null && ro(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function wl(n, r, l) {
    Bi(n) && l.delete(r);
  }
  function pc() {
    ft = !1, xn !== null && Bi(xn) && (xn = null), ra !== null && Bi(ra) && (ra = null), Yr !== null && Bi(Yr) && (Yr = null), bl.forEach(wl), Ln.forEach(wl);
  }
  function Aa(n, r) {
    n.blockedOn === r && (n.blockedOn = null, ft || (ft = !0, f.unstable_scheduleCallback(f.unstable_NormalPriority, pc)));
  }
  function Rl(n) {
    function r(c) {
      return Aa(c, n);
    }
    if (0 < uu.length) {
      Aa(uu[0], n);
      for (var l = 1; l < uu.length; l++) {
        var o = uu[l];
        o.blockedOn === n && (o.blockedOn = null);
      }
    }
    for (xn !== null && Aa(xn, n), ra !== null && Aa(ra, n), Yr !== null && Aa(Yr, n), bl.forEach(r), Ln.forEach(r), l = 0; l < Zt.length; l++)
      o = Zt[l], o.blockedOn === n && (o.blockedOn = null);
    for (; 0 < Zt.length && (l = Zt[0], l.blockedOn === null); )
      dc(l), l.blockedOn === null && Zt.shift();
  }
  var Tl = mt.ReactCurrentBatchConfig, za = !0;
  function lo(n, r, l, o) {
    var c = Wt, p = Tl.transition;
    Tl.transition = null;
    try {
      Wt = 1, Dl(n, r, l, o);
    } finally {
      Wt = c, Tl.transition = p;
    }
  }
  function xl(n, r, l, o) {
    var c = Wt, p = Tl.transition;
    Tl.transition = null;
    try {
      Wt = 4, Dl(n, r, l, o);
    } finally {
      Wt = c, Tl.transition = p;
    }
  }
  function Dl(n, r, l, o) {
    if (za) {
      var c = uo(n, r, l, o);
      if (c === null)
        _c(n, r, o, ou, l), aa(n, o);
      else if (bi(c, n, r, l, o))
        o.stopPropagation();
      else if (aa(n, o), r & 4 && -1 < fc.indexOf(n)) {
        for (; c !== null; ) {
          var p = Cs(c);
          if (p !== null && lu(p), p = uo(n, r, l, o), p === null && _c(n, r, o, ou, l), p === c)
            break;
          c = p;
        }
        c !== null && o.stopPropagation();
      } else
        _c(n, r, o, null, l);
    }
  }
  var ou = null;
  function uo(n, r, l, o) {
    if (ou = null, n = te(o), n = Pa(n), n !== null)
      if (r = ht(n), r === null)
        n = null;
      else if (l = r.tag, l === 13) {
        if (n = Lt(r), n !== null)
          return n;
        n = null;
      } else if (l === 3) {
        if (r.stateNode.current.memoizedState.isDehydrated)
          return r.tag === 3 ? r.stateNode.containerInfo : null;
        n = null;
      } else
        r !== n && (n = null);
    return ou = n, null;
  }
  function ls(n) {
    switch (n) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (td()) {
          case ri:
            return 1;
          case Rt:
            return 4;
          case Ei:
          case yl:
            return 16;
          case Zu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var ii = null, y = null, x = null;
  function V() {
    if (x)
      return x;
    var n, r = y, l = r.length, o, c = "value" in ii ? ii.value : ii.textContent, p = c.length;
    for (n = 0; n < l && r[n] === c[n]; n++)
      ;
    var S = l - n;
    for (o = 1; o <= S && r[l - o] === c[p - o]; o++)
      ;
    return x = c.slice(n, 1 < o ? 1 - o : void 0);
  }
  function Y(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function fe() {
    return !0;
  }
  function et() {
    return !1;
  }
  function Ee(n) {
    function r(l, o, c, p, S) {
      this._reactName = l, this._targetInst = c, this.type = o, this.nativeEvent = p, this.target = S, this.currentTarget = null;
      for (var R in n)
        n.hasOwnProperty(R) && (l = n[R], this[R] = l ? l(p) : p[R]);
      return this.isDefaultPrevented = (p.defaultPrevented != null ? p.defaultPrevented : p.returnValue === !1) ? fe : et, this.isPropagationStopped = et, this;
    }
    return O(r.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = fe);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = fe);
      },
      persist: function() {
      },
      isPersistent: fe
    }), r;
  }
  var Ke = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(n) {
      return n.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Tt = Ee(Ke), Vt = O({}, Ke, {
    view: 0,
    detail: 0
  }), ln = Ee(Vt), tn, un, pn, Nt = O({}, Vt, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: ud,
    button: 0,
    buttons: 0,
    relatedTarget: function(n) {
      return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
    },
    movementX: function(n) {
      return "movementX" in n ? n.movementX : (n !== pn && (pn && n.type === "mousemove" ? (tn = n.screenX - pn.screenX, un = n.screenY - pn.screenY) : un = tn = 0, pn = n), tn);
    },
    movementY: function(n) {
      return "movementY" in n ? n.movementY : un;
    }
  }), Vi = Ee(Nt), oo = O({}, Nt, {
    dataTransfer: 0
  }), us = Ee(oo), rd = O({}, Vt, {
    relatedTarget: 0
  }), li = Ee(rd), os = O({}, Ke, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), ss = Ee(os), ad = O({}, Ke, {
    clipboardData: function(n) {
      return "clipboardData" in n ? n.clipboardData : window.clipboardData;
    }
  }), by = Ee(ad), wy = O({}, Ke, {
    data: 0
  }), id = Ee(wy), ld = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Ev = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, _v = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function bv(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = _v[n]) ? !!r[n] : !1;
  }
  function ud() {
    return bv;
  }
  var $i = O({}, Vt, {
    key: function(n) {
      if (n.key) {
        var r = ld[n.key] || n.key;
        if (r !== "Unidentified")
          return r;
      }
      return n.type === "keypress" ? (n = Y(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? Ev[n.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: ud,
    charCode: function(n) {
      return n.type === "keypress" ? Y(n) : 0;
    },
    keyCode: function(n) {
      return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
    },
    which: function(n) {
      return n.type === "keypress" ? Y(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
    }
  }), Ry = Ee($i), od = O({}, Nt, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), vc = Ee(od), sd = O({}, Vt, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: ud
  }), Ty = Ee(sd), hc = O({}, Ke, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), wv = Ee(hc), ia = O({}, Nt, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Ii = Ee(ia), Qn = [
    9,
    13,
    27,
    32
  ], ui = me && "CompositionEvent" in window, su = null;
  me && "documentMode" in document && (su = document.documentMode);
  var mc = me && "TextEvent" in window && !su, Rv = me && (!ui || su && 8 < su && 11 >= su), so = " ", Tv = !1;
  function xv(n, r) {
    switch (n) {
      case "keyup":
        return Qn.indexOf(r.keyCode) !== -1;
      case "keydown":
        return r.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function yc(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var co = !1;
  function xy(n, r) {
    switch (n) {
      case "compositionend":
        return yc(r);
      case "keypress":
        return r.which !== 32 ? null : (Tv = !0, so);
      case "textInput":
        return n = r.data, n === so && Tv ? null : n;
      default:
        return null;
    }
  }
  function Dy(n, r) {
    if (co)
      return n === "compositionend" || !ui && xv(n, r) ? (n = V(), x = y = ii = null, co = !1, n) : null;
    switch (n) {
      case "paste":
        return null;
      case "keypress":
        if (!(r.ctrlKey || r.altKey || r.metaKey) || r.ctrlKey && r.altKey) {
          if (r.char && 1 < r.char.length)
            return r.char;
          if (r.which)
            return String.fromCharCode(r.which);
        }
        return null;
      case "compositionend":
        return Rv && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var Dv = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function Ov(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!Dv[n.type] : r === "textarea";
  }
  function kv(n, r, l, o) {
    Dt(o), r = ys(r, "onChange"), 0 < r.length && (l = new Tt("onChange", "change", null, l, o), n.push({
      event: l,
      listeners: r
    }));
  }
  var cs = null, fo = null;
  function po(n) {
    Ec(n, 0);
  }
  function vo(n) {
    var r = mo(n);
    if (jn(r))
      return n;
  }
  function Mv(n, r) {
    if (n === "change")
      return r;
  }
  var cd = !1;
  if (me) {
    var fd;
    if (me) {
      var dd = "oninput" in document;
      if (!dd) {
        var Nv = document.createElement("div");
        Nv.setAttribute("oninput", "return;"), dd = typeof Nv.oninput == "function";
      }
      fd = dd;
    } else
      fd = !1;
    cd = fd && (!document.documentMode || 9 < document.documentMode);
  }
  function Lv() {
    cs && (cs.detachEvent("onpropertychange", Av), fo = cs = null);
  }
  function Av(n) {
    if (n.propertyName === "value" && vo(fo)) {
      var r = [];
      kv(r, fo, n, te(n)), mi(po, r);
    }
  }
  function Oy(n, r, l) {
    n === "focusin" ? (Lv(), cs = r, fo = l, cs.attachEvent("onpropertychange", Av)) : n === "focusout" && Lv();
  }
  function ky(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown")
      return vo(fo);
  }
  function My(n, r) {
    if (n === "click")
      return vo(r);
  }
  function zv(n, r) {
    if (n === "input" || n === "change")
      return vo(r);
  }
  function Ny(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var Ua = typeof Object.is == "function" ? Object.is : Ny;
  function fs(n, r) {
    if (Ua(n, r))
      return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null)
      return !1;
    var l = Object.keys(n), o = Object.keys(r);
    if (l.length !== o.length)
      return !1;
    for (o = 0; o < l.length; o++) {
      var c = l[o];
      if (!J.call(r, c) || !Ua(n[c], r[c]))
        return !1;
    }
    return !0;
  }
  function Uv(n) {
    for (; n && n.firstChild; )
      n = n.firstChild;
    return n;
  }
  function Pv(n, r) {
    var l = Uv(n);
    n = 0;
    for (var o; l; ) {
      if (l.nodeType === 3) {
        if (o = n + l.textContent.length, n <= r && o >= r)
          return {
            node: l,
            offset: r - n
          };
        n = o;
      }
      e: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break e;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = Uv(l);
    }
  }
  function jv(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? jv(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function gc() {
    for (var n = window, r = cn(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l)
        n = r.contentWindow;
      else
        break;
      r = cn(n.document);
    }
    return r;
  }
  function Yi(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function Sc(n) {
    var r = gc(), l = n.focusedElem, o = n.selectionRange;
    if (r !== l && l && l.ownerDocument && jv(l.ownerDocument.documentElement, l)) {
      if (o !== null && Yi(l)) {
        if (r = o.start, n = o.end, n === void 0 && (n = r), "selectionStart" in l)
          l.selectionStart = r, l.selectionEnd = Math.min(n, l.value.length);
        else if (n = (r = l.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var c = l.textContent.length, p = Math.min(o.start, c);
          o = o.end === void 0 ? p : Math.min(o.end, c), !n.extend && p > o && (c = o, o = p, p = c), c = Pv(l, p);
          var S = Pv(l, o);
          c && S && (n.rangeCount !== 1 || n.anchorNode !== c.node || n.anchorOffset !== c.offset || n.focusNode !== S.node || n.focusOffset !== S.offset) && (r = r.createRange(), r.setStart(c.node, c.offset), n.removeAllRanges(), p > o ? (n.addRange(r), n.extend(S.node, S.offset)) : (r.setEnd(S.node, S.offset), n.addRange(r)));
        }
      }
      for (r = [], n = l; n = n.parentNode; )
        n.nodeType === 1 && r.push({
          element: n,
          left: n.scrollLeft,
          top: n.scrollTop
        });
      for (typeof l.focus == "function" && l.focus(), l = 0; l < r.length; l++)
        n = r[l], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var Fv = me && "documentMode" in document && 11 >= document.documentMode, oi = null, pd = null, ds = null, vd = !1;
  function Hv(n, r, l) {
    var o = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    vd || oi == null || oi !== cn(o) || (o = oi, "selectionStart" in o && Yi(o) ? o = {
      start: o.selectionStart,
      end: o.selectionEnd
    } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = {
      anchorNode: o.anchorNode,
      anchorOffset: o.anchorOffset,
      focusNode: o.focusNode,
      focusOffset: o.focusOffset
    }), ds && fs(ds, o) || (ds = o, o = ys(pd, "onSelect"), 0 < o.length && (r = new Tt("onSelect", "select", null, r, l), n.push({
      event: r,
      listeners: o
    }), r.target = oi)));
  }
  function Cc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var cu = {
    animationend: Cc("Animation", "AnimationEnd"),
    animationiteration: Cc("Animation", "AnimationIteration"),
    animationstart: Cc("Animation", "AnimationStart"),
    transitionend: Cc("Transition", "TransitionEnd")
  }, hd = {}, md = {};
  me && (md = document.createElement("div").style, "AnimationEvent" in window || (delete cu.animationend.animation, delete cu.animationiteration.animation, delete cu.animationstart.animation), "TransitionEvent" in window || delete cu.transitionend.transition);
  function cr(n) {
    if (hd[n])
      return hd[n];
    if (!cu[n])
      return n;
    var r = cu[n], l;
    for (l in r)
      if (r.hasOwnProperty(l) && l in md)
        return hd[n] = r[l];
    return n;
  }
  var yd = cr("animationend"), Bv = cr("animationiteration"), Vv = cr("animationstart"), $v = cr("transitionend"), Iv = /* @__PURE__ */ new Map(), Yv = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Wi(n, r) {
    Iv.set(n, r), M(r, [
      n
    ]);
  }
  for (var ps = 0; ps < Yv.length; ps++) {
    var fu = Yv[ps], Ly = fu.toLowerCase(), vs = fu[0].toUpperCase() + fu.slice(1);
    Wi(Ly, "on" + vs);
  }
  Wi(yd, "onAnimationEnd"), Wi(Bv, "onAnimationIteration"), Wi(Vv, "onAnimationStart"), Wi("dblclick", "onDoubleClick"), Wi("focusin", "onFocus"), Wi("focusout", "onBlur"), Wi($v, "onTransitionEnd"), C("onMouseEnter", [
    "mouseout",
    "mouseover"
  ]), C("onMouseLeave", [
    "mouseout",
    "mouseover"
  ]), C("onPointerEnter", [
    "pointerout",
    "pointerover"
  ]), C("onPointerLeave", [
    "pointerout",
    "pointerover"
  ]), M("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), M("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), M("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), M("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), M("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), M("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var hs = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Ay = new Set("cancel close invalid load scroll toggle".split(" ").concat(hs));
  function Wv(n, r, l) {
    var o = n.type || "unknown-event";
    n.currentTarget = l, Te(o, r, void 0, n), n.currentTarget = null;
  }
  function Ec(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var o = n[l], c = o.event;
      o = o.listeners;
      e: {
        var p = void 0;
        if (r)
          for (var S = o.length - 1; 0 <= S; S--) {
            var R = o[S], k = R.instance, I = R.currentTarget;
            if (R = R.listener, k !== p && c.isPropagationStopped())
              break e;
            Wv(c, R, I), p = k;
          }
        else
          for (S = 0; S < o.length; S++) {
            if (R = o[S], k = R.instance, I = R.currentTarget, R = R.listener, k !== p && c.isPropagationStopped())
              break e;
            Wv(c, R, I), p = k;
          }
      }
    }
    if (Si)
      throw n = D, Si = !1, D = null, n;
  }
  function on(n, r) {
    var l = r[wd];
    l === void 0 && (l = r[wd] = /* @__PURE__ */ new Set());
    var o = n + "__bubble";
    l.has(o) || (Gv(r, n, 2, !1), l.add(o));
  }
  function Ol(n, r, l) {
    var o = 0;
    r && (o |= 4), Gv(l, n, o, r);
  }
  var Gi = "_reactListening" + Math.random().toString(36).slice(2);
  function ho(n) {
    if (!n[Gi]) {
      n[Gi] = !0, _.forEach(function(l) {
        l !== "selectionchange" && (Ay.has(l) || Ol(l, !1, n), Ol(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[Gi] || (r[Gi] = !0, Ol("selectionchange", !1, r));
    }
  }
  function Gv(n, r, l, o) {
    switch (ls(r)) {
      case 1:
        var c = lo;
        break;
      case 4:
        c = xl;
        break;
      default:
        c = Dl;
    }
    l = c.bind(null, r, l, n), c = void 0, !yi || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (c = !0), o ? c !== void 0 ? n.addEventListener(r, l, {
      capture: !0,
      passive: c
    }) : n.addEventListener(r, l, !0) : c !== void 0 ? n.addEventListener(r, l, {
      passive: c
    }) : n.addEventListener(r, l, !1);
  }
  function _c(n, r, l, o, c) {
    var p = o;
    if (!(r & 1) && !(r & 2) && o !== null)
      e:
        for (; ; ) {
          if (o === null)
            return;
          var S = o.tag;
          if (S === 3 || S === 4) {
            var R = o.stateNode.containerInfo;
            if (R === c || R.nodeType === 8 && R.parentNode === c)
              break;
            if (S === 4)
              for (S = o.return; S !== null; ) {
                var k = S.tag;
                if ((k === 3 || k === 4) && (k = S.stateNode.containerInfo, k === c || k.nodeType === 8 && k.parentNode === c))
                  return;
                S = S.return;
              }
            for (; R !== null; ) {
              if (S = Pa(R), S === null)
                return;
              if (k = S.tag, k === 5 || k === 6) {
                o = p = S;
                continue e;
              }
              R = R.parentNode;
            }
          }
          o = o.return;
        }
    mi(function() {
      var I = p, ae = te(l), le = [];
      e: {
        var re = Iv.get(n);
        if (re !== void 0) {
          var we = Tt, Ne = n;
          switch (n) {
            case "keypress":
              if (Y(l) === 0)
                break e;
            case "keydown":
            case "keyup":
              we = Ry;
              break;
            case "focusin":
              Ne = "focus", we = li;
              break;
            case "focusout":
              Ne = "blur", we = li;
              break;
            case "beforeblur":
            case "afterblur":
              we = li;
              break;
            case "click":
              if (l.button === 2)
                break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              we = Vi;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              we = us;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              we = Ty;
              break;
            case yd:
            case Bv:
            case Vv:
              we = ss;
              break;
            case $v:
              we = wv;
              break;
            case "scroll":
              we = ln;
              break;
            case "wheel":
              we = Ii;
              break;
            case "copy":
            case "cut":
            case "paste":
              we = by;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              we = vc;
          }
          var Ue = (r & 4) !== 0, Bn = !Ue && n === "scroll", U = Ue ? re !== null ? re + "Capture" : null : re;
          Ue = [];
          for (var A = I, H; A !== null; ) {
            H = A;
            var pe = H.stateNode;
            if (H.tag === 5 && pe !== null && (H = pe, U !== null && (pe = Sa(A, U), pe != null && Ue.push(ms(A, pe, H)))), Bn)
              break;
            A = A.return;
          }
          0 < Ue.length && (re = new we(re, Ne, null, l, ae), le.push({
            event: re,
            listeners: Ue
          }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (re = n === "mouseover" || n === "pointerover", we = n === "mouseout" || n === "pointerout", re && l !== Ge && (Ne = l.relatedTarget || l.fromElement) && (Pa(Ne) || Ne[Qi]))
            break e;
          if ((we || re) && (re = ae.window === ae ? ae : (re = ae.ownerDocument) ? re.defaultView || re.parentWindow : window, we ? (Ne = l.relatedTarget || l.toElement, we = I, Ne = Ne ? Pa(Ne) : null, Ne !== null && (Bn = ht(Ne), Ne !== Bn || Ne.tag !== 5 && Ne.tag !== 6) && (Ne = null)) : (we = null, Ne = I), we !== Ne)) {
            if (Ue = Vi, pe = "onMouseLeave", U = "onMouseEnter", A = "mouse", (n === "pointerout" || n === "pointerover") && (Ue = vc, pe = "onPointerLeave", U = "onPointerEnter", A = "pointer"), Bn = we == null ? re : mo(we), H = Ne == null ? re : mo(Ne), re = new Ue(pe, A + "leave", we, l, ae), re.target = Bn, re.relatedTarget = H, pe = null, Pa(ae) === I && (Ue = new Ue(U, A + "enter", Ne, l, ae), Ue.target = H, Ue.relatedTarget = Bn, pe = Ue), Bn = pe, we && Ne)
              t: {
                for (Ue = we, U = Ne, A = 0, H = Ue; H; H = du(H))
                  A++;
                for (H = 0, pe = U; pe; pe = du(pe))
                  H++;
                for (; 0 < A - H; )
                  Ue = du(Ue), A--;
                for (; 0 < H - A; )
                  U = du(U), H--;
                for (; A--; ) {
                  if (Ue === U || U !== null && Ue === U.alternate)
                    break t;
                  Ue = du(Ue), U = du(U);
                }
                Ue = null;
              }
            else
              Ue = null;
            we !== null && gd(le, re, we, Ue, !1), Ne !== null && Bn !== null && gd(le, Bn, Ne, Ue, !0);
          }
        }
        e: {
          if (re = I ? mo(I) : window, we = re.nodeName && re.nodeName.toLowerCase(), we === "select" || we === "input" && re.type === "file")
            var Fe = Mv;
          else if (Ov(re))
            if (cd)
              Fe = zv;
            else {
              Fe = ky;
              var Le = Oy;
            }
          else
            (we = re.nodeName) && we.toLowerCase() === "input" && (re.type === "checkbox" || re.type === "radio") && (Fe = My);
          if (Fe && (Fe = Fe(n, I))) {
            kv(le, Fe, l, ae);
            break e;
          }
          Le && Le(n, re, I), n === "focusout" && (Le = re._wrapperState) && Le.controlled && re.type === "number" && gr(re, "number", re.value);
        }
        switch (Le = I ? mo(I) : window, n) {
          case "focusin":
            (Ov(Le) || Le.contentEditable === "true") && (oi = Le, pd = I, ds = null);
            break;
          case "focusout":
            ds = pd = oi = null;
            break;
          case "mousedown":
            vd = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            vd = !1, Hv(le, l, ae);
            break;
          case "selectionchange":
            if (Fv)
              break;
          case "keydown":
          case "keyup":
            Hv(le, l, ae);
        }
        var Ie;
        if (ui)
          e: {
            switch (n) {
              case "compositionstart":
                var ut = "onCompositionStart";
                break e;
              case "compositionend":
                ut = "onCompositionEnd";
                break e;
              case "compositionupdate":
                ut = "onCompositionUpdate";
                break e;
            }
            ut = void 0;
          }
        else
          co ? xv(n, l) && (ut = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (ut = "onCompositionStart");
        ut && (Rv && l.locale !== "ko" && (co || ut !== "onCompositionStart" ? ut === "onCompositionEnd" && co && (Ie = V()) : (ii = ae, y = "value" in ii ? ii.value : ii.textContent, co = !0)), Le = ys(I, ut), 0 < Le.length && (ut = new id(ut, n, null, l, ae), le.push({
          event: ut,
          listeners: Le
        }), Ie ? ut.data = Ie : (Ie = yc(l), Ie !== null && (ut.data = Ie)))), (Ie = mc ? xy(n, l) : Dy(n, l)) && (I = ys(I, "onBeforeInput"), 0 < I.length && (ae = new id("onBeforeInput", "beforeinput", null, l, ae), le.push({
          event: ae,
          listeners: I
        }), ae.data = Ie));
      }
      Ec(le, r);
    });
  }
  function ms(n, r, l) {
    return {
      instance: n,
      listener: r,
      currentTarget: l
    };
  }
  function ys(n, r) {
    for (var l = r + "Capture", o = []; n !== null; ) {
      var c = n, p = c.stateNode;
      c.tag === 5 && p !== null && (c = p, p = Sa(n, l), p != null && o.unshift(ms(n, p, c)), p = Sa(n, r), p != null && o.push(ms(n, p, c))), n = n.return;
    }
    return o;
  }
  function du(n) {
    if (n === null)
      return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function gd(n, r, l, o, c) {
    for (var p = r._reactName, S = []; l !== null && l !== o; ) {
      var R = l, k = R.alternate, I = R.stateNode;
      if (k !== null && k === o)
        break;
      R.tag === 5 && I !== null && (R = I, c ? (k = Sa(l, p), k != null && S.unshift(ms(l, k, R))) : c || (k = Sa(l, p), k != null && S.push(ms(l, k, R)))), l = l.return;
    }
    S.length !== 0 && n.push({
      event: r,
      listeners: S
    });
  }
  var Sd = /\r\n?/g, zy = /\u0000|\uFFFD/g;
  function Cd(n) {
    return (typeof n == "string" ? n : "" + n).replace(Sd, `
`).replace(zy, "");
  }
  function bc(n, r, l) {
    if (r = Cd(r), Cd(n) !== r && l)
      throw Error(h(425));
  }
  function wc() {
  }
  var Ed = null, pu = null;
  function gs(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var vu = typeof setTimeout == "function" ? setTimeout : void 0, Qv = typeof clearTimeout == "function" ? clearTimeout : void 0, _d = typeof Promise == "function" ? Promise : void 0, bd = typeof queueMicrotask == "function" ? queueMicrotask : typeof _d < "u" ? function(n) {
    return _d.resolve(null).then(n).catch(Uy);
  } : vu;
  function Uy(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function kl(n, r) {
    var l = r, o = 0;
    do {
      var c = l.nextSibling;
      if (n.removeChild(l), c && c.nodeType === 8)
        if (l = c.data, l === "/$") {
          if (o === 0) {
            n.removeChild(c), Rl(r);
            return;
          }
          o--;
        } else
          l !== "$" && l !== "$?" && l !== "$!" || o++;
      l = c;
    } while (l);
    Rl(r);
  }
  function si(n) {
    for (; n != null; n = n.nextSibling) {
      var r = n.nodeType;
      if (r === 1 || r === 3)
        break;
      if (r === 8) {
        if (r = n.data, r === "$" || r === "$!" || r === "$?")
          break;
        if (r === "/$")
          return null;
      }
    }
    return n;
  }
  function Ss(n) {
    n = n.previousSibling;
    for (var r = 0; n; ) {
      if (n.nodeType === 8) {
        var l = n.data;
        if (l === "$" || l === "$!" || l === "$?") {
          if (r === 0)
            return n;
          r--;
        } else
          l === "/$" && r++;
      }
      n = n.previousSibling;
    }
    return null;
  }
  var Ml = Math.random().toString(36).slice(2), wi = "__reactFiber$" + Ml, hu = "__reactProps$" + Ml, Qi = "__reactContainer$" + Ml, wd = "__reactEvents$" + Ml, Py = "__reactListeners$" + Ml, Rd = "__reactHandles$" + Ml;
  function Pa(n) {
    var r = n[wi];
    if (r)
      return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[Qi] || l[wi]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null)
          for (n = Ss(n); n !== null; ) {
            if (l = n[wi])
              return l;
            n = Ss(n);
          }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function Cs(n) {
    return n = n[wi] || n[Qi], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function mo(n) {
    if (n.tag === 5 || n.tag === 6)
      return n.stateNode;
    throw Error(h(33));
  }
  function Ye(n) {
    return n[hu] || null;
  }
  var Nl = [], mn = -1;
  function _t(n) {
    return {
      current: n
    };
  }
  function qt(n) {
    0 > mn || (n.current = Nl[mn], Nl[mn] = null, mn--);
  }
  function Jt(n, r) {
    mn++, Nl[mn] = n.current, n.current = r;
  }
  var Ri = {}, lt = _t(Ri), An = _t(!1), la = Ri;
  function ja(n, r) {
    var l = n.type.contextTypes;
    if (!l)
      return Ri;
    var o = n.stateNode;
    if (o && o.__reactInternalMemoizedUnmaskedChildContext === r)
      return o.__reactInternalMemoizedMaskedChildContext;
    var c = {}, p;
    for (p in l)
      c[p] = r[p];
    return o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = c), c;
  }
  function bn(n) {
    return n = n.childContextTypes, n != null;
  }
  function Fa() {
    qt(An), qt(lt);
  }
  function Ll(n, r, l) {
    if (lt.current !== Ri)
      throw Error(h(168));
    Jt(lt, r), Jt(An, l);
  }
  function Es(n, r, l) {
    var o = n.stateNode;
    if (r = r.childContextTypes, typeof o.getChildContext != "function")
      return l;
    o = o.getChildContext();
    for (var c in o)
      if (!(c in r))
        throw Error(h(108, wt(n) || "Unknown", c));
    return O({}, l, o);
  }
  function Rc(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Ri, la = lt.current, Jt(lt, n), Jt(An, An.current), !0;
  }
  function qv(n, r, l) {
    var o = n.stateNode;
    if (!o)
      throw Error(h(169));
    l ? (n = Es(n, r, la), o.__reactInternalMemoizedMergedChildContext = n, qt(An), qt(lt), Jt(lt, n)) : qt(An), Jt(An, l);
  }
  var _a = null, fr = !1, _s = !1;
  function Td(n) {
    _a === null ? _a = [
      n
    ] : _a.push(n);
  }
  function xd(n) {
    fr = !0, Td(n);
  }
  function ua() {
    if (!_s && _a !== null) {
      _s = !0;
      var n = 0, r = Wt;
      try {
        var l = _a;
        for (Wt = 1; n < l.length; n++) {
          var o = l[n];
          do
            o = o(!0);
          while (o !== null);
        }
        _a = null, fr = !1;
      } catch (c) {
        throw _a !== null && (_a = _a.slice(n + 1)), dn(ri, ua), c;
      } finally {
        Wt = r, _s = !1;
      }
    }
    return null;
  }
  var Al = [], oa = 0, mu = null, yo = 0, sa = [], Ar = 0, Ha = null, _r = 1, qi = "";
  function ba(n, r) {
    Al[oa++] = yo, Al[oa++] = mu, mu = n, yo = r;
  }
  function Dd(n, r, l) {
    sa[Ar++] = _r, sa[Ar++] = qi, sa[Ar++] = Ha, Ha = n;
    var o = _r;
    n = qi;
    var c = 32 - $r(o) - 1;
    o &= ~(1 << c), l += 1;
    var p = 32 - $r(r) + c;
    if (30 < p) {
      var S = c - c % 5;
      p = (o & (1 << S) - 1).toString(32), o >>= S, c -= S, _r = 1 << 32 - $r(r) + c | l << c | o, qi = p + n;
    } else
      _r = 1 << p | l << c | o, qi = n;
  }
  function Tc(n) {
    n.return !== null && (ba(n, 1), Dd(n, 1, 0));
  }
  function Od(n) {
    for (; n === mu; )
      mu = Al[--oa], Al[oa] = null, yo = Al[--oa], Al[oa] = null;
    for (; n === Ha; )
      Ha = sa[--Ar], sa[Ar] = null, qi = sa[--Ar], sa[Ar] = null, _r = sa[--Ar], sa[Ar] = null;
  }
  var wa = null, ca = null, yn = !1, Ba = null;
  function kd(n, r) {
    var l = Ga(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [
      l
    ], n.flags |= 16) : r.push(l);
  }
  function Xv(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, wa = n, ca = si(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, wa = n, ca = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = Ha !== null ? {
          id: _r,
          overflow: qi
        } : null, n.memoizedState = {
          dehydrated: r,
          treeContext: l,
          retryLane: 1073741824
        }, l = Ga(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, wa = n, ca = null, !0) : !1;
      default:
        return !1;
    }
  }
  function xc(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function Dc(n) {
    if (yn) {
      var r = ca;
      if (r) {
        var l = r;
        if (!Xv(n, r)) {
          if (xc(n))
            throw Error(h(418));
          r = si(l.nextSibling);
          var o = wa;
          r && Xv(n, r) ? kd(o, l) : (n.flags = n.flags & -4097 | 2, yn = !1, wa = n);
        }
      } else {
        if (xc(n))
          throw Error(h(418));
        n.flags = n.flags & -4097 | 2, yn = !1, wa = n;
      }
    }
  }
  function Kv(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; )
      n = n.return;
    wa = n;
  }
  function Oc(n) {
    if (n !== wa)
      return !1;
    if (!yn)
      return Kv(n), yn = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !gs(n.type, n.memoizedProps)), r && (r = ca)) {
      if (xc(n))
        throw Zv(), Error(h(418));
      for (; r; )
        kd(n, r), r = si(r.nextSibling);
    }
    if (Kv(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n)
        throw Error(h(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var l = n.data;
            if (l === "/$") {
              if (r === 0) {
                ca = si(n.nextSibling);
                break e;
              }
              r--;
            } else
              l !== "$" && l !== "$!" && l !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        ca = null;
      }
    } else
      ca = wa ? si(n.stateNode.nextSibling) : null;
    return !0;
  }
  function Zv() {
    for (var n = ca; n; )
      n = si(n.nextSibling);
  }
  function Dn() {
    ca = wa = null, yn = !1;
  }
  function Md(n) {
    Ba === null ? Ba = [
      n
    ] : Ba.push(n);
  }
  var kc = mt.ReactCurrentBatchConfig;
  function Ra(n, r) {
    if (n && n.defaultProps) {
      r = O({}, r), n = n.defaultProps;
      for (var l in n)
        r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  var Ti = _t(null), Mc = null, zl = null, Nd = null;
  function Ld() {
    Nd = zl = Mc = null;
  }
  function Ul(n) {
    var r = Ti.current;
    qt(Ti), n._currentValue = r;
  }
  function dr(n, r, l) {
    for (; n !== null; ) {
      var o = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, o !== null && (o.childLanes |= r)) : o !== null && (o.childLanes & r) !== r && (o.childLanes |= r), n === l)
        break;
      n = n.return;
    }
  }
  function ge(n, r) {
    Mc = n, Nd = zl = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (qn = !0), n.firstContext = null);
  }
  function Hn(n) {
    var r = n._currentValue;
    if (Nd !== n)
      if (n = {
        context: n,
        memoizedValue: r,
        next: null
      }, zl === null) {
        if (Mc === null)
          throw Error(h(308));
        zl = n, Mc.dependencies = {
          lanes: 0,
          firstContext: n
        };
      } else
        zl = zl.next = n;
    return r;
  }
  var br = null;
  function Ad(n) {
    br === null ? br = [
      n
    ] : br.push(n);
  }
  function Jv(n, r, l, o) {
    var c = r.interleaved;
    return c === null ? (l.next = l, Ad(r)) : (l.next = c.next, c.next = l), r.interleaved = l, Xi(n, o);
  }
  function Xi(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; )
      n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var Pl = !1;
  function zd(n) {
    n.updateQueue = {
      baseState: n.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: {
        pending: null,
        interleaved: null,
        lanes: 0
      },
      effects: null
    };
  }
  function tr(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = {
      baseState: n.baseState,
      firstBaseUpdate: n.firstBaseUpdate,
      lastBaseUpdate: n.lastBaseUpdate,
      shared: n.shared,
      effects: n.effects
    });
  }
  function Ki(n, r) {
    return {
      eventTime: n,
      lane: r,
      tag: 0,
      payload: null,
      callback: null,
      next: null
    };
  }
  function jl(n, r, l) {
    var o = n.updateQueue;
    if (o === null)
      return null;
    if (o = o.shared, kt & 2) {
      var c = o.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), o.pending = r, Xi(n, l);
    }
    return c = o.interleaved, c === null ? (r.next = r, Ad(o)) : (r.next = c.next, c.next = r), o.interleaved = r, Xi(n, l);
  }
  function Nc(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, _i(n, l);
    }
  }
  function Ud(n, r) {
    var l = n.updateQueue, o = n.alternate;
    if (o !== null && (o = o.updateQueue, l === o)) {
      var c = null, p = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var S = {
            eventTime: l.eventTime,
            lane: l.lane,
            tag: l.tag,
            payload: l.payload,
            callback: l.callback,
            next: null
          };
          p === null ? c = p = S : p = p.next = S, l = l.next;
        } while (l !== null);
        p === null ? c = p = r : p = p.next = r;
      } else
        c = p = r;
      l = {
        baseState: o.baseState,
        firstBaseUpdate: c,
        lastBaseUpdate: p,
        shared: o.shared,
        effects: o.effects
      }, n.updateQueue = l;
      return;
    }
    n = l.lastBaseUpdate, n === null ? l.firstBaseUpdate = r : n.next = r, l.lastBaseUpdate = r;
  }
  function Fl(n, r, l, o) {
    var c = n.updateQueue;
    Pl = !1;
    var p = c.firstBaseUpdate, S = c.lastBaseUpdate, R = c.shared.pending;
    if (R !== null) {
      c.shared.pending = null;
      var k = R, I = k.next;
      k.next = null, S === null ? p = I : S.next = I, S = k;
      var ae = n.alternate;
      ae !== null && (ae = ae.updateQueue, R = ae.lastBaseUpdate, R !== S && (R === null ? ae.firstBaseUpdate = I : R.next = I, ae.lastBaseUpdate = k));
    }
    if (p !== null) {
      var le = c.baseState;
      S = 0, ae = I = k = null, R = p;
      do {
        var re = R.lane, we = R.eventTime;
        if ((o & re) === re) {
          ae !== null && (ae = ae.next = {
            eventTime: we,
            lane: 0,
            tag: R.tag,
            payload: R.payload,
            callback: R.callback,
            next: null
          });
          e: {
            var Ne = n, Ue = R;
            switch (re = r, we = l, Ue.tag) {
              case 1:
                if (Ne = Ue.payload, typeof Ne == "function") {
                  le = Ne.call(we, le, re);
                  break e;
                }
                le = Ne;
                break e;
              case 3:
                Ne.flags = Ne.flags & -65537 | 128;
              case 0:
                if (Ne = Ue.payload, re = typeof Ne == "function" ? Ne.call(we, le, re) : Ne, re == null)
                  break e;
                le = O({}, le, re);
                break e;
              case 2:
                Pl = !0;
            }
          }
          R.callback !== null && R.lane !== 0 && (n.flags |= 64, re = c.effects, re === null ? c.effects = [
            R
          ] : re.push(R));
        } else
          we = {
            eventTime: we,
            lane: re,
            tag: R.tag,
            payload: R.payload,
            callback: R.callback,
            next: null
          }, ae === null ? (I = ae = we, k = le) : ae = ae.next = we, S |= re;
        if (R = R.next, R === null) {
          if (R = c.shared.pending, R === null)
            break;
          re = R, R = re.next, re.next = null, c.lastBaseUpdate = re, c.shared.pending = null;
        }
      } while (!0);
      if (ae === null && (k = le), c.baseState = k, c.firstBaseUpdate = I, c.lastBaseUpdate = ae, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          S |= c.lane, c = c.next;
        while (c !== r);
      } else
        p === null && (c.shared.lanes = 0);
      tl |= S, n.lanes = S, n.memoizedState = le;
    }
  }
  function yu(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null)
      for (r = 0; r < n.length; r++) {
        var o = n[r], c = o.callback;
        if (c !== null) {
          if (o.callback = null, o = l, typeof c != "function")
            throw Error(h(191, c));
          c.call(o);
        }
      }
  }
  var eh = new g.Component().refs;
  function Pd(n, r, l, o) {
    r = n.memoizedState, l = l(o, r), l = l == null ? r : O({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var Lc = {
    isMounted: function(n) {
      return (n = n._reactInternals) ? ht(n) === n : !1;
    },
    enqueueSetState: function(n, r, l) {
      n = n._reactInternals;
      var o = jr(), c = Xn(n), p = Ki(o, c);
      p.payload = r, l != null && (p.callback = l), r = jl(n, p, c), r !== null && (Fr(r, n, c, o), Nc(r, n, c));
    },
    enqueueReplaceState: function(n, r, l) {
      n = n._reactInternals;
      var o = jr(), c = Xn(n), p = Ki(o, c);
      p.tag = 1, p.payload = r, l != null && (p.callback = l), r = jl(n, p, c), r !== null && (Fr(r, n, c, o), Nc(r, n, c));
    },
    enqueueForceUpdate: function(n, r) {
      n = n._reactInternals;
      var l = jr(), o = Xn(n), c = Ki(l, o);
      c.tag = 2, r != null && (c.callback = r), r = jl(n, c, o), r !== null && (Fr(r, n, o, l), Nc(r, n, o));
    }
  };
  function th(n, r, l, o, c, p, S) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(o, p, S) : r.prototype && r.prototype.isPureReactComponent ? !fs(l, o) || !fs(c, p) : !0;
  }
  function nh(n, r, l) {
    var o = !1, c = Ri, p = r.contextType;
    return typeof p == "object" && p !== null ? p = Hn(p) : (c = bn(r) ? la : lt.current, o = r.contextTypes, p = (o = o != null) ? ja(n, c) : Ri), r = new r(l, p), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = Lc, n.stateNode = r, r._reactInternals = n, o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = p), r;
  }
  function rh(n, r, l, o) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, o), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, o), r.state !== n && Lc.enqueueReplaceState(r, r.state, null);
  }
  function Ac(n, r, l, o) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = eh, zd(n);
    var p = r.contextType;
    typeof p == "object" && p !== null ? c.context = Hn(p) : (p = bn(r) ? la : lt.current, c.context = ja(n, p)), c.state = n.memoizedState, p = r.getDerivedStateFromProps, typeof p == "function" && (Pd(n, r, p, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && Lc.enqueueReplaceState(c, c.state, null), Fl(n, l, c, o), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function go(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1)
            throw Error(h(309));
          var o = l.stateNode;
        }
        if (!o)
          throw Error(h(147, n));
        var c = o, p = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === p ? r.ref : (r = function(S) {
          var R = c.refs;
          R === eh && (R = c.refs = {}), S === null ? delete R[p] : R[p] = S;
        }, r._stringRef = p, r);
      }
      if (typeof n != "string")
        throw Error(h(284));
      if (!l._owner)
        throw Error(h(290, n));
    }
    return n;
  }
  function zc(n, r) {
    throw n = Object.prototype.toString.call(r), Error(h(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function ah(n) {
    var r = n._init;
    return r(n._payload);
  }
  function ih(n) {
    function r(U, A) {
      if (n) {
        var H = U.deletions;
        H === null ? (U.deletions = [
          A
        ], U.flags |= 16) : H.push(A);
      }
    }
    function l(U, A) {
      if (!n)
        return null;
      for (; A !== null; )
        r(U, A), A = A.sibling;
      return null;
    }
    function o(U, A) {
      for (U = /* @__PURE__ */ new Map(); A !== null; )
        A.key !== null ? U.set(A.key, A) : U.set(A.index, A), A = A.sibling;
      return U;
    }
    function c(U, A) {
      return U = Gl(U, A), U.index = 0, U.sibling = null, U;
    }
    function p(U, A, H) {
      return U.index = H, n ? (H = U.alternate, H !== null ? (H = H.index, H < A ? (U.flags |= 2, A) : H) : (U.flags |= 2, A)) : (U.flags |= 1048576, A);
    }
    function S(U) {
      return n && U.alternate === null && (U.flags |= 2), U;
    }
    function R(U, A, H, pe) {
      return A === null || A.tag !== 6 ? (A = Bs(H, U.mode, pe), A.return = U, A) : (A = c(A, H), A.return = U, A);
    }
    function k(U, A, H, pe) {
      var Fe = H.type;
      return Fe === nt ? ae(U, A, H.props.children, pe, H.key) : A !== null && (A.elementType === Fe || typeof Fe == "object" && Fe !== null && Fe.$$typeof === Ot && ah(Fe) === A.type) ? (pe = c(A, H.props), pe.ref = go(U, A, H), pe.return = U, pe) : (pe = vf(H.type, H.key, H.props, null, U.mode, pe), pe.ref = go(U, A, H), pe.return = U, pe);
    }
    function I(U, A, H, pe) {
      return A === null || A.tag !== 4 || A.stateNode.containerInfo !== H.containerInfo || A.stateNode.implementation !== H.implementation ? (A = Uu(H, U.mode, pe), A.return = U, A) : (A = c(A, H.children || []), A.return = U, A);
    }
    function ae(U, A, H, pe, Fe) {
      return A === null || A.tag !== 7 ? (A = zu(H, U.mode, pe, Fe), A.return = U, A) : (A = c(A, H), A.return = U, A);
    }
    function le(U, A, H) {
      if (typeof A == "string" && A !== "" || typeof A == "number")
        return A = Bs("" + A, U.mode, H), A.return = U, A;
      if (typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case je:
            return H = vf(A.type, A.key, A.props, null, U.mode, H), H.ref = go(U, null, A), H.return = U, H;
          case yt:
            return A = Uu(A, U.mode, H), A.return = U, A;
          case Ot:
            var pe = A._init;
            return le(U, pe(A._payload), H);
        }
        if (Fn(A) || Pe(A))
          return A = zu(A, U.mode, H, null), A.return = U, A;
        zc(U, A);
      }
      return null;
    }
    function re(U, A, H, pe) {
      var Fe = A !== null ? A.key : null;
      if (typeof H == "string" && H !== "" || typeof H == "number")
        return Fe !== null ? null : R(U, A, "" + H, pe);
      if (typeof H == "object" && H !== null) {
        switch (H.$$typeof) {
          case je:
            return H.key === Fe ? k(U, A, H, pe) : null;
          case yt:
            return H.key === Fe ? I(U, A, H, pe) : null;
          case Ot:
            return Fe = H._init, re(U, A, Fe(H._payload), pe);
        }
        if (Fn(H) || Pe(H))
          return Fe !== null ? null : ae(U, A, H, pe, null);
        zc(U, H);
      }
      return null;
    }
    function we(U, A, H, pe, Fe) {
      if (typeof pe == "string" && pe !== "" || typeof pe == "number")
        return U = U.get(H) || null, R(A, U, "" + pe, Fe);
      if (typeof pe == "object" && pe !== null) {
        switch (pe.$$typeof) {
          case je:
            return U = U.get(pe.key === null ? H : pe.key) || null, k(A, U, pe, Fe);
          case yt:
            return U = U.get(pe.key === null ? H : pe.key) || null, I(A, U, pe, Fe);
          case Ot:
            var Le = pe._init;
            return we(U, A, H, Le(pe._payload), Fe);
        }
        if (Fn(pe) || Pe(pe))
          return U = U.get(H) || null, ae(A, U, pe, Fe, null);
        zc(A, pe);
      }
      return null;
    }
    function Ne(U, A, H, pe) {
      for (var Fe = null, Le = null, Ie = A, ut = A = 0, hr = null; Ie !== null && ut < H.length; ut++) {
        Ie.index > ut ? (hr = Ie, Ie = null) : hr = Ie.sibling;
        var $t = re(U, Ie, H[ut], pe);
        if ($t === null) {
          Ie === null && (Ie = hr);
          break;
        }
        n && Ie && $t.alternate === null && r(U, Ie), A = p($t, A, ut), Le === null ? Fe = $t : Le.sibling = $t, Le = $t, Ie = hr;
      }
      if (ut === H.length)
        return l(U, Ie), yn && ba(U, ut), Fe;
      if (Ie === null) {
        for (; ut < H.length; ut++)
          Ie = le(U, H[ut], pe), Ie !== null && (A = p(Ie, A, ut), Le === null ? Fe = Ie : Le.sibling = Ie, Le = Ie);
        return yn && ba(U, ut), Fe;
      }
      for (Ie = o(U, Ie); ut < H.length; ut++)
        hr = we(Ie, U, ut, H[ut], pe), hr !== null && (n && hr.alternate !== null && Ie.delete(hr.key === null ? ut : hr.key), A = p(hr, A, ut), Le === null ? Fe = hr : Le.sibling = hr, Le = hr);
      return n && Ie.forEach(function(Ql) {
        return r(U, Ql);
      }), yn && ba(U, ut), Fe;
    }
    function Ue(U, A, H, pe) {
      var Fe = Pe(H);
      if (typeof Fe != "function")
        throw Error(h(150));
      if (H = Fe.call(H), H == null)
        throw Error(h(151));
      for (var Le = Fe = null, Ie = A, ut = A = 0, hr = null, $t = H.next(); Ie !== null && !$t.done; ut++, $t = H.next()) {
        Ie.index > ut ? (hr = Ie, Ie = null) : hr = Ie.sibling;
        var Ql = re(U, Ie, $t.value, pe);
        if (Ql === null) {
          Ie === null && (Ie = hr);
          break;
        }
        n && Ie && Ql.alternate === null && r(U, Ie), A = p(Ql, A, ut), Le === null ? Fe = Ql : Le.sibling = Ql, Le = Ql, Ie = hr;
      }
      if ($t.done)
        return l(U, Ie), yn && ba(U, ut), Fe;
      if (Ie === null) {
        for (; !$t.done; ut++, $t = H.next())
          $t = le(U, $t.value, pe), $t !== null && (A = p($t, A, ut), Le === null ? Fe = $t : Le.sibling = $t, Le = $t);
        return yn && ba(U, ut), Fe;
      }
      for (Ie = o(U, Ie); !$t.done; ut++, $t = H.next())
        $t = we(Ie, U, ut, $t.value, pe), $t !== null && (n && $t.alternate !== null && Ie.delete($t.key === null ? ut : $t.key), A = p($t, A, ut), Le === null ? Fe = $t : Le.sibling = $t, Le = $t);
      return n && Ie.forEach(function(rg) {
        return r(U, rg);
      }), yn && ba(U, ut), Fe;
    }
    function Bn(U, A, H, pe) {
      if (typeof H == "object" && H !== null && H.type === nt && H.key === null && (H = H.props.children), typeof H == "object" && H !== null) {
        switch (H.$$typeof) {
          case je:
            e: {
              for (var Fe = H.key, Le = A; Le !== null; ) {
                if (Le.key === Fe) {
                  if (Fe = H.type, Fe === nt) {
                    if (Le.tag === 7) {
                      l(U, Le.sibling), A = c(Le, H.props.children), A.return = U, U = A;
                      break e;
                    }
                  } else if (Le.elementType === Fe || typeof Fe == "object" && Fe !== null && Fe.$$typeof === Ot && ah(Fe) === Le.type) {
                    l(U, Le.sibling), A = c(Le, H.props), A.ref = go(U, Le, H), A.return = U, U = A;
                    break e;
                  }
                  l(U, Le);
                  break;
                } else
                  r(U, Le);
                Le = Le.sibling;
              }
              H.type === nt ? (A = zu(H.props.children, U.mode, pe, H.key), A.return = U, U = A) : (pe = vf(H.type, H.key, H.props, null, U.mode, pe), pe.ref = go(U, A, H), pe.return = U, U = pe);
            }
            return S(U);
          case yt:
            e: {
              for (Le = H.key; A !== null; ) {
                if (A.key === Le)
                  if (A.tag === 4 && A.stateNode.containerInfo === H.containerInfo && A.stateNode.implementation === H.implementation) {
                    l(U, A.sibling), A = c(A, H.children || []), A.return = U, U = A;
                    break e;
                  } else {
                    l(U, A);
                    break;
                  }
                else
                  r(U, A);
                A = A.sibling;
              }
              A = Uu(H, U.mode, pe), A.return = U, U = A;
            }
            return S(U);
          case Ot:
            return Le = H._init, Bn(U, A, Le(H._payload), pe);
        }
        if (Fn(H))
          return Ne(U, A, H, pe);
        if (Pe(H))
          return Ue(U, A, H, pe);
        zc(U, H);
      }
      return typeof H == "string" && H !== "" || typeof H == "number" ? (H = "" + H, A !== null && A.tag === 6 ? (l(U, A.sibling), A = c(A, H), A.return = U, U = A) : (l(U, A), A = Bs(H, U.mode, pe), A.return = U, U = A), S(U)) : l(U, A);
    }
    return Bn;
  }
  var So = ih(!0), lh = ih(!1), bs = {}, ci = _t(bs), ws = _t(bs), Co = _t(bs);
  function gu(n) {
    if (n === bs)
      throw Error(h(174));
    return n;
  }
  function jd(n, r) {
    switch (Jt(Co, r), Jt(ws, n), Jt(ci, bs), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : hn(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = hn(r, n);
    }
    qt(ci), Jt(ci, r);
  }
  function Hl() {
    qt(ci), qt(ws), qt(Co);
  }
  function Ze(n) {
    gu(Co.current);
    var r = gu(ci.current), l = hn(r, n.type);
    r !== l && (Jt(ws, n), Jt(ci, l));
  }
  function xt(n) {
    ws.current === n && (qt(ci), qt(ws));
  }
  var tt = _t(0);
  function On(n) {
    for (var r = n; r !== null; ) {
      if (r.tag === 13) {
        var l = r.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || l.data === "$?" || l.data === "$!"))
          return r;
      } else if (r.tag === 19 && r.memoizedProps.revealOrder !== void 0) {
        if (r.flags & 128)
          return r;
      } else if (r.child !== null) {
        r.child.return = r, r = r.child;
        continue;
      }
      if (r === n)
        break;
      for (; r.sibling === null; ) {
        if (r.return === null || r.return === n)
          return null;
        r = r.return;
      }
      r.sibling.return = r.return, r = r.sibling;
    }
    return null;
  }
  var Va = [];
  function Uc() {
    for (var n = 0; n < Va.length; n++)
      Va[n]._workInProgressVersionPrimary = null;
    Va.length = 0;
  }
  var Pc = mt.ReactCurrentDispatcher, Fd = mt.ReactCurrentBatchConfig, Su = 0, gn = null, Q = null, At = null, rt = !1, xi = !1, Ta = 0, Cu = 0;
  function Sn() {
    throw Error(h(321));
  }
  function Eu(n, r) {
    if (r === null)
      return !1;
    for (var l = 0; l < r.length && l < n.length; l++)
      if (!Ua(n[l], r[l]))
        return !1;
    return !0;
  }
  function Bl(n, r, l, o, c, p) {
    if (Su = p, gn = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, Pc.current = n === null || n.memoizedState === null ? Fy : Hy, n = l(o, c), xi) {
      p = 0;
      do {
        if (xi = !1, Ta = 0, 25 <= p)
          throw Error(h(301));
        p += 1, At = Q = null, r.updateQueue = null, Pc.current = Bd, n = l(o, c);
      } while (xi);
    }
    if (Pc.current = Jc, r = Q !== null && Q.next !== null, Su = 0, At = Q = gn = null, rt = !1, r)
      throw Error(h(300));
    return n;
  }
  function _u() {
    var n = Ta !== 0;
    return Ta = 0, n;
  }
  function $a() {
    var n = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return At === null ? gn.memoizedState = At = n : At = At.next = n, At;
  }
  function fa() {
    if (Q === null) {
      var n = gn.alternate;
      n = n !== null ? n.memoizedState : null;
    } else
      n = Q.next;
    var r = At === null ? gn.memoizedState : At.next;
    if (r !== null)
      At = r, Q = n;
    else {
      if (n === null)
        throw Error(h(310));
      Q = n, n = {
        memoizedState: Q.memoizedState,
        baseState: Q.baseState,
        baseQueue: Q.baseQueue,
        queue: Q.queue,
        next: null
      }, At === null ? gn.memoizedState = At = n : At = At.next = n;
    }
    return At;
  }
  function bu(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function Rs(n) {
    var r = fa(), l = r.queue;
    if (l === null)
      throw Error(h(311));
    l.lastRenderedReducer = n;
    var o = Q, c = o.baseQueue, p = l.pending;
    if (p !== null) {
      if (c !== null) {
        var S = c.next;
        c.next = p.next, p.next = S;
      }
      o.baseQueue = c = p, l.pending = null;
    }
    if (c !== null) {
      p = c.next, o = o.baseState;
      var R = S = null, k = null, I = p;
      do {
        var ae = I.lane;
        if ((Su & ae) === ae)
          k !== null && (k = k.next = {
            lane: 0,
            action: I.action,
            hasEagerState: I.hasEagerState,
            eagerState: I.eagerState,
            next: null
          }), o = I.hasEagerState ? I.eagerState : n(o, I.action);
        else {
          var le = {
            lane: ae,
            action: I.action,
            hasEagerState: I.hasEagerState,
            eagerState: I.eagerState,
            next: null
          };
          k === null ? (R = k = le, S = o) : k = k.next = le, gn.lanes |= ae, tl |= ae;
        }
        I = I.next;
      } while (I !== null && I !== p);
      k === null ? S = o : k.next = R, Ua(o, r.memoizedState) || (qn = !0), r.memoizedState = o, r.baseState = S, r.baseQueue = k, l.lastRenderedState = o;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        p = c.lane, gn.lanes |= p, tl |= p, c = c.next;
      while (c !== n);
    } else
      c === null && (l.lanes = 0);
    return [
      r.memoizedState,
      l.dispatch
    ];
  }
  function Ts(n) {
    var r = fa(), l = r.queue;
    if (l === null)
      throw Error(h(311));
    l.lastRenderedReducer = n;
    var o = l.dispatch, c = l.pending, p = r.memoizedState;
    if (c !== null) {
      l.pending = null;
      var S = c = c.next;
      do
        p = n(p, S.action), S = S.next;
      while (S !== c);
      Ua(p, r.memoizedState) || (qn = !0), r.memoizedState = p, r.baseQueue === null && (r.baseState = p), l.lastRenderedState = p;
    }
    return [
      p,
      o
    ];
  }
  function jc() {
  }
  function Fc(n, r) {
    var l = gn, o = fa(), c = r(), p = !Ua(o.memoizedState, c);
    if (p && (o.memoizedState = c, qn = !0), o = o.queue, xs(Vc.bind(null, l, o, n), [
      n
    ]), o.getSnapshot !== r || p || At !== null && At.memoizedState.tag & 1) {
      if (l.flags |= 2048, wu(9, Bc.bind(null, l, o, c, r), void 0, null), kn === null)
        throw Error(h(349));
      Su & 30 || Hc(l, r, c);
    }
    return c;
  }
  function Hc(n, r, l) {
    n.flags |= 16384, n = {
      getSnapshot: r,
      value: l
    }, r = gn.updateQueue, r === null ? (r = {
      lastEffect: null,
      stores: null
    }, gn.updateQueue = r, r.stores = [
      n
    ]) : (l = r.stores, l === null ? r.stores = [
      n
    ] : l.push(n));
  }
  function Bc(n, r, l, o) {
    r.value = l, r.getSnapshot = o, $c(r) && Ic(n);
  }
  function Vc(n, r, l) {
    return l(function() {
      $c(r) && Ic(n);
    });
  }
  function $c(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var l = r();
      return !Ua(n, l);
    } catch {
      return !0;
    }
  }
  function Ic(n) {
    var r = Xi(n, 1);
    r !== null && Fr(r, n, 1, -1);
  }
  function Yc(n) {
    var r = $a();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: bu,
      lastRenderedState: n
    }, r.queue = n, n = n.dispatch = Zc.bind(null, gn, n), [
      r.memoizedState,
      n
    ];
  }
  function wu(n, r, l, o) {
    return n = {
      tag: n,
      create: r,
      destroy: l,
      deps: o,
      next: null
    }, r = gn.updateQueue, r === null ? (r = {
      lastEffect: null,
      stores: null
    }, gn.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (o = l.next, l.next = n, n.next = o, r.lastEffect = n)), n;
  }
  function Wc() {
    return fa().memoizedState;
  }
  function Ru(n, r, l, o) {
    var c = $a();
    gn.flags |= n, c.memoizedState = wu(1 | r, l, void 0, o === void 0 ? null : o);
  }
  function Zi(n, r, l, o) {
    var c = fa();
    o = o === void 0 ? null : o;
    var p = void 0;
    if (Q !== null) {
      var S = Q.memoizedState;
      if (p = S.destroy, o !== null && Eu(o, S.deps)) {
        c.memoizedState = wu(r, l, p, o);
        return;
      }
    }
    gn.flags |= n, c.memoizedState = wu(1 | r, l, p, o);
  }
  function Gc(n, r) {
    return Ru(8390656, 8, n, r);
  }
  function xs(n, r) {
    return Zi(2048, 8, n, r);
  }
  function Qc(n, r) {
    return Zi(4, 2, n, r);
  }
  function qc(n, r) {
    return Zi(4, 4, n, r);
  }
  function Hd(n, r) {
    if (typeof r == "function")
      return n = n(), r(n), function() {
        r(null);
      };
    if (r != null)
      return n = n(), r.current = n, function() {
        r.current = null;
      };
  }
  function Eo(n, r, l) {
    return l = l != null ? l.concat([
      n
    ]) : null, Zi(4, 4, Hd.bind(null, r, n), l);
  }
  function Xc() {
  }
  function _o(n, r) {
    var l = fa();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && Eu(r, o[1]) ? o[0] : (l.memoizedState = [
      n,
      r
    ], n);
  }
  function Vl(n, r) {
    var l = fa();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && Eu(r, o[1]) ? o[0] : (n = n(), l.memoizedState = [
      n,
      r
    ], n);
  }
  function da(n, r, l) {
    return Su & 21 ? (Ua(l, r) || (l = eo(), gn.lanes |= l, tl |= l, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, qn = !0), n.memoizedState = l);
  }
  function jy(n, r) {
    var l = Wt;
    Wt = l !== 0 && 4 > l ? l : 4, n(!0);
    var o = Fd.transition;
    Fd.transition = {};
    try {
      n(!1), r();
    } finally {
      Wt = l, Fd.transition = o;
    }
  }
  function sn() {
    return fa().memoizedState;
  }
  function Kc(n, r, l) {
    var o = Xn(n);
    if (l = {
      lane: o,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, bo(n))
      Ds(r, l);
    else if (l = Jv(n, r, l, o), l !== null) {
      var c = jr();
      Fr(l, n, o, c), uh(l, r, o);
    }
  }
  function Zc(n, r, l) {
    var o = Xn(n), c = {
      lane: o,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (bo(n))
      Ds(r, c);
    else {
      var p = n.alternate;
      if (n.lanes === 0 && (p === null || p.lanes === 0) && (p = r.lastRenderedReducer, p !== null))
        try {
          var S = r.lastRenderedState, R = p(S, l);
          if (c.hasEagerState = !0, c.eagerState = R, Ua(R, S)) {
            var k = r.interleaved;
            k === null ? (c.next = c, Ad(r)) : (c.next = k.next, k.next = c), r.interleaved = c;
            return;
          }
        } catch {
        } finally {
        }
      l = Jv(n, r, c, o), l !== null && (c = jr(), Fr(l, n, o, c), uh(l, r, o));
    }
  }
  function bo(n) {
    var r = n.alternate;
    return n === gn || r !== null && r === gn;
  }
  function Ds(n, r) {
    xi = rt = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function uh(n, r, l) {
    if (l & 4194240) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, _i(n, l);
    }
  }
  var Jc = {
    readContext: Hn,
    useCallback: Sn,
    useContext: Sn,
    useEffect: Sn,
    useImperativeHandle: Sn,
    useInsertionEffect: Sn,
    useLayoutEffect: Sn,
    useMemo: Sn,
    useReducer: Sn,
    useRef: Sn,
    useState: Sn,
    useDebugValue: Sn,
    useDeferredValue: Sn,
    useTransition: Sn,
    useMutableSource: Sn,
    useSyncExternalStore: Sn,
    useId: Sn,
    unstable_isNewReconciler: !1
  }, Fy = {
    readContext: Hn,
    useCallback: function(n, r) {
      return $a().memoizedState = [
        n,
        r === void 0 ? null : r
      ], n;
    },
    useContext: Hn,
    useEffect: Gc,
    useImperativeHandle: function(n, r, l) {
      return l = l != null ? l.concat([
        n
      ]) : null, Ru(4194308, 4, Hd.bind(null, r, n), l);
    },
    useLayoutEffect: function(n, r) {
      return Ru(4194308, 4, n, r);
    },
    useInsertionEffect: function(n, r) {
      return Ru(4, 2, n, r);
    },
    useMemo: function(n, r) {
      var l = $a();
      return r = r === void 0 ? null : r, n = n(), l.memoizedState = [
        n,
        r
      ], n;
    },
    useReducer: function(n, r, l) {
      var o = $a();
      return r = l !== void 0 ? l(r) : r, o.memoizedState = o.baseState = r, n = {
        pending: null,
        interleaved: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: n,
        lastRenderedState: r
      }, o.queue = n, n = n.dispatch = Kc.bind(null, gn, n), [
        o.memoizedState,
        n
      ];
    },
    useRef: function(n) {
      var r = $a();
      return n = {
        current: n
      }, r.memoizedState = n;
    },
    useState: Yc,
    useDebugValue: Xc,
    useDeferredValue: function(n) {
      return $a().memoizedState = n;
    },
    useTransition: function() {
      var n = Yc(!1), r = n[0];
      return n = jy.bind(null, n[1]), $a().memoizedState = n, [
        r,
        n
      ];
    },
    useMutableSource: function() {
    },
    useSyncExternalStore: function(n, r, l) {
      var o = gn, c = $a();
      if (yn) {
        if (l === void 0)
          throw Error(h(407));
        l = l();
      } else {
        if (l = r(), kn === null)
          throw Error(h(349));
        Su & 30 || Hc(o, r, l);
      }
      c.memoizedState = l;
      var p = {
        value: l,
        getSnapshot: r
      };
      return c.queue = p, Gc(Vc.bind(null, o, p, n), [
        n
      ]), o.flags |= 2048, wu(9, Bc.bind(null, o, p, l, r), void 0, null), l;
    },
    useId: function() {
      var n = $a(), r = kn.identifierPrefix;
      if (yn) {
        var l = qi, o = _r;
        l = (o & ~(1 << 32 - $r(o) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = Ta++, 0 < l && (r += "H" + l.toString(32)), r += ":";
      } else
        l = Cu++, r = ":" + r + "r" + l.toString(32) + ":";
      return n.memoizedState = r;
    },
    unstable_isNewReconciler: !1
  }, Hy = {
    readContext: Hn,
    useCallback: _o,
    useContext: Hn,
    useEffect: xs,
    useImperativeHandle: Eo,
    useInsertionEffect: Qc,
    useLayoutEffect: qc,
    useMemo: Vl,
    useReducer: Rs,
    useRef: Wc,
    useState: function() {
      return Rs(bu);
    },
    useDebugValue: Xc,
    useDeferredValue: function(n) {
      var r = fa();
      return da(r, Q.memoizedState, n);
    },
    useTransition: function() {
      var n = Rs(bu)[0], r = fa().memoizedState;
      return [
        n,
        r
      ];
    },
    useMutableSource: jc,
    useSyncExternalStore: Fc,
    useId: sn,
    unstable_isNewReconciler: !1
  }, Bd = {
    readContext: Hn,
    useCallback: _o,
    useContext: Hn,
    useEffect: xs,
    useImperativeHandle: Eo,
    useInsertionEffect: Qc,
    useLayoutEffect: qc,
    useMemo: Vl,
    useReducer: Ts,
    useRef: Wc,
    useState: function() {
      return Ts(bu);
    },
    useDebugValue: Xc,
    useDeferredValue: function(n) {
      var r = fa();
      return Q === null ? r.memoizedState = n : da(r, Q.memoizedState, n);
    },
    useTransition: function() {
      var n = Ts(bu)[0], r = fa().memoizedState;
      return [
        n,
        r
      ];
    },
    useMutableSource: jc,
    useSyncExternalStore: Fc,
    useId: sn,
    unstable_isNewReconciler: !1
  };
  function wo(n, r) {
    try {
      var l = "", o = r;
      do
        l += Ve(o), o = o.return;
      while (o);
      var c = l;
    } catch (p) {
      c = `
Error generating stack: ` + p.message + `
` + p.stack;
    }
    return {
      value: n,
      source: r,
      stack: c,
      digest: null
    };
  }
  function Os(n, r, l) {
    return {
      value: n,
      source: null,
      stack: l ?? null,
      digest: r ?? null
    };
  }
  function ef(n, r) {
    try {
      console.error(r.value);
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  var By = typeof WeakMap == "function" ? WeakMap : Map;
  function oh(n, r, l) {
    l = Ki(-1, l), l.tag = 3, l.payload = {
      element: null
    };
    var o = r.value;
    return l.callback = function() {
      of || (of = !0, ku = o), ef(n, r);
    }, l;
  }
  function ks(n, r, l) {
    l = Ki(-1, l), l.tag = 3;
    var o = n.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var c = r.value;
      l.payload = function() {
        return o(c);
      }, l.callback = function() {
        ef(n, r);
      };
    }
    var p = n.stateNode;
    return p !== null && typeof p.componentDidCatch == "function" && (l.callback = function() {
      ef(n, r), typeof o != "function" && (ki === null ? ki = /* @__PURE__ */ new Set([
        this
      ]) : ki.add(this));
      var S = r.stack;
      this.componentDidCatch(r.value, {
        componentStack: S !== null ? S : ""
      });
    }), l;
  }
  function sh(n, r, l) {
    var o = n.pingCache;
    if (o === null) {
      o = n.pingCache = new By();
      var c = /* @__PURE__ */ new Set();
      o.set(r, c);
    } else
      c = o.get(r), c === void 0 && (c = /* @__PURE__ */ new Set(), o.set(r, c));
    c.has(l) || (c.add(l), n = Qy.bind(null, n, r, l), r.then(n, n));
  }
  function Vd(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r)
        return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function $d(n, r, l, o, c) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = c, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = Ki(-1, 1), r.tag = 2, jl(l, r, 1))), l.lanes |= 1), n);
  }
  var Vy = mt.ReactCurrentOwner, qn = !1;
  function nr(n, r, l, o) {
    r.child = n === null ? lh(r, null, l, o) : So(r, n.child, l, o);
  }
  function $l(n, r, l, o, c) {
    l = l.render;
    var p = r.ref;
    return ge(r, c), o = Bl(n, r, l, o, p, c), l = _u(), n !== null && !qn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, wr(n, r, c)) : (yn && l && Tc(r), r.flags |= 1, nr(n, r, o, c), r.child);
  }
  function tf(n, r, l, o, c) {
    if (n === null) {
      var p = l.type;
      return typeof p == "function" && !op(p) && p.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = p, pa(n, r, p, o, c)) : (n = vf(l.type, null, o, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (p = n.child, !(n.lanes & c)) {
      var S = p.memoizedProps;
      if (l = l.compare, l = l !== null ? l : fs, l(S, o) && n.ref === r.ref)
        return wr(n, r, c);
    }
    return r.flags |= 1, n = Gl(p, o), n.ref = r.ref, n.return = r, r.child = n;
  }
  function pa(n, r, l, o, c) {
    if (n !== null) {
      var p = n.memoizedProps;
      if (fs(p, o) && n.ref === r.ref)
        if (qn = !1, r.pendingProps = o = p, (n.lanes & c) !== 0)
          n.flags & 131072 && (qn = !0);
        else
          return r.lanes = n.lanes, wr(n, r, c);
    }
    return Ro(n, r, l, o, c);
  }
  function Tu(n, r, l) {
    var o = r.pendingProps, c = o.children, p = n !== null ? n.memoizedState : null;
    if (o.mode === "hidden")
      if (!(r.mode & 1))
        r.memoizedState = {
          baseLanes: 0,
          cachePool: null,
          transitions: null
        }, Jt(Mo, xa), xa |= l;
      else {
        if (!(l & 1073741824))
          return n = p !== null ? p.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = {
            baseLanes: n,
            cachePool: null,
            transitions: null
          }, r.updateQueue = null, Jt(Mo, xa), xa |= n, null;
        r.memoizedState = {
          baseLanes: 0,
          cachePool: null,
          transitions: null
        }, o = p !== null ? p.baseLanes : l, Jt(Mo, xa), xa |= o;
      }
    else
      p !== null ? (o = p.baseLanes | l, r.memoizedState = null) : o = l, Jt(Mo, xa), xa |= o;
    return nr(n, r, c, l), r.child;
  }
  function bt(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function Ro(n, r, l, o, c) {
    var p = bn(l) ? la : lt.current;
    return p = ja(r, p), ge(r, c), l = Bl(n, r, l, o, p, c), o = _u(), n !== null && !qn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, wr(n, r, c)) : (yn && o && Tc(r), r.flags |= 1, nr(n, r, l, c), r.child);
  }
  function Id(n, r, l, o, c) {
    if (bn(l)) {
      var p = !0;
      Rc(r);
    } else
      p = !1;
    if (ge(r, c), r.stateNode === null)
      zr(n, r), nh(r, l, o), Ac(r, l, o, c), o = !0;
    else if (n === null) {
      var S = r.stateNode, R = r.memoizedProps;
      S.props = R;
      var k = S.context, I = l.contextType;
      typeof I == "object" && I !== null ? I = Hn(I) : (I = bn(l) ? la : lt.current, I = ja(r, I));
      var ae = l.getDerivedStateFromProps, le = typeof ae == "function" || typeof S.getSnapshotBeforeUpdate == "function";
      le || typeof S.UNSAFE_componentWillReceiveProps != "function" && typeof S.componentWillReceiveProps != "function" || (R !== o || k !== I) && rh(r, S, o, I), Pl = !1;
      var re = r.memoizedState;
      S.state = re, Fl(r, o, S, c), k = r.memoizedState, R !== o || re !== k || An.current || Pl ? (typeof ae == "function" && (Pd(r, l, ae, o), k = r.memoizedState), (R = Pl || th(r, l, R, o, re, k, I)) ? (le || typeof S.UNSAFE_componentWillMount != "function" && typeof S.componentWillMount != "function" || (typeof S.componentWillMount == "function" && S.componentWillMount(), typeof S.UNSAFE_componentWillMount == "function" && S.UNSAFE_componentWillMount()), typeof S.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof S.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = o, r.memoizedState = k), S.props = o, S.state = k, S.context = I, o = R) : (typeof S.componentDidMount == "function" && (r.flags |= 4194308), o = !1);
    } else {
      S = r.stateNode, tr(n, r), R = r.memoizedProps, I = r.type === r.elementType ? R : Ra(r.type, R), S.props = I, le = r.pendingProps, re = S.context, k = l.contextType, typeof k == "object" && k !== null ? k = Hn(k) : (k = bn(l) ? la : lt.current, k = ja(r, k));
      var we = l.getDerivedStateFromProps;
      (ae = typeof we == "function" || typeof S.getSnapshotBeforeUpdate == "function") || typeof S.UNSAFE_componentWillReceiveProps != "function" && typeof S.componentWillReceiveProps != "function" || (R !== le || re !== k) && rh(r, S, o, k), Pl = !1, re = r.memoizedState, S.state = re, Fl(r, o, S, c);
      var Ne = r.memoizedState;
      R !== le || re !== Ne || An.current || Pl ? (typeof we == "function" && (Pd(r, l, we, o), Ne = r.memoizedState), (I = Pl || th(r, l, I, o, re, Ne, k) || !1) ? (ae || typeof S.UNSAFE_componentWillUpdate != "function" && typeof S.componentWillUpdate != "function" || (typeof S.componentWillUpdate == "function" && S.componentWillUpdate(o, Ne, k), typeof S.UNSAFE_componentWillUpdate == "function" && S.UNSAFE_componentWillUpdate(o, Ne, k)), typeof S.componentDidUpdate == "function" && (r.flags |= 4), typeof S.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof S.componentDidUpdate != "function" || R === n.memoizedProps && re === n.memoizedState || (r.flags |= 4), typeof S.getSnapshotBeforeUpdate != "function" || R === n.memoizedProps && re === n.memoizedState || (r.flags |= 1024), r.memoizedProps = o, r.memoizedState = Ne), S.props = o, S.state = Ne, S.context = k, o = I) : (typeof S.componentDidUpdate != "function" || R === n.memoizedProps && re === n.memoizedState || (r.flags |= 4), typeof S.getSnapshotBeforeUpdate != "function" || R === n.memoizedProps && re === n.memoizedState || (r.flags |= 1024), o = !1);
    }
    return ch(n, r, l, o, p, c);
  }
  function ch(n, r, l, o, c, p) {
    bt(n, r);
    var S = (r.flags & 128) !== 0;
    if (!o && !S)
      return c && qv(r, l, !1), wr(n, r, p);
    o = r.stateNode, Vy.current = r;
    var R = S && typeof l.getDerivedStateFromError != "function" ? null : o.render();
    return r.flags |= 1, n !== null && S ? (r.child = So(r, n.child, null, p), r.child = So(r, null, R, p)) : nr(n, r, R, p), r.memoizedState = o.state, c && qv(r, l, !0), r.child;
  }
  function fh(n) {
    var r = n.stateNode;
    r.pendingContext ? Ll(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Ll(n, r.context, !1), jd(n, r.containerInfo);
  }
  function nf(n, r, l, o, c) {
    return Dn(), Md(c), r.flags |= 256, nr(n, r, l, o), r.child;
  }
  var xu = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0
  };
  function Yd(n) {
    return {
      baseLanes: n,
      cachePool: null,
      transitions: null
    };
  }
  function Wd(n, r, l) {
    var o = r.pendingProps, c = tt.current, p = !1, S = (r.flags & 128) !== 0, R;
    if ((R = S) || (R = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), R ? (p = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), Jt(tt, c & 1), n === null)
      return Dc(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (S = o.children, n = o.fallback, p ? (o = r.mode, p = r.child, S = {
        mode: "hidden",
        children: S
      }, !(o & 1) && p !== null ? (p.childLanes = 0, p.pendingProps = S) : p = Hs(S, o, 0, null), n = zu(n, o, l, null), p.return = r, n.return = r, p.sibling = n, r.child = p, r.child.memoizedState = Yd(l), r.memoizedState = xu, n) : Gd(r, S));
    if (c = n.memoizedState, c !== null && (R = c.dehydrated, R !== null))
      return $y(n, r, S, o, R, c, l);
    if (p) {
      p = o.fallback, S = r.mode, c = n.child, R = c.sibling;
      var k = {
        mode: "hidden",
        children: o.children
      };
      return !(S & 1) && r.child !== c ? (o = r.child, o.childLanes = 0, o.pendingProps = k, r.deletions = null) : (o = Gl(c, k), o.subtreeFlags = c.subtreeFlags & 14680064), R !== null ? p = Gl(R, p) : (p = zu(p, S, l, null), p.flags |= 2), p.return = r, o.return = r, o.sibling = p, r.child = o, o = p, p = r.child, S = n.child.memoizedState, S = S === null ? Yd(l) : {
        baseLanes: S.baseLanes | l,
        cachePool: null,
        transitions: S.transitions
      }, p.memoizedState = S, p.childLanes = n.childLanes & ~l, r.memoizedState = xu, o;
    }
    return p = n.child, n = p.sibling, o = Gl(p, {
      mode: "visible",
      children: o.children
    }), !(r.mode & 1) && (o.lanes = l), o.return = r, o.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [
      n
    ], r.flags |= 16) : l.push(n)), r.child = o, r.memoizedState = null, o;
  }
  function Gd(n, r) {
    return r = Hs({
      mode: "visible",
      children: r
    }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function To(n, r, l, o) {
    return o !== null && Md(o), So(r, n.child, null, l), n = Gd(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function $y(n, r, l, o, c, p, S) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, o = Os(Error(h(422))), To(n, r, S, o)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (p = o.fallback, c = r.mode, o = Hs({
        mode: "visible",
        children: o.children
      }, c, 0, null), p = zu(p, c, S, null), p.flags |= 2, o.return = r, p.return = r, o.sibling = p, r.child = o, r.mode & 1 && So(r, n.child, null, S), r.child.memoizedState = Yd(S), r.memoizedState = xu, p);
    if (!(r.mode & 1))
      return To(n, r, S, null);
    if (c.data === "$!") {
      if (o = c.nextSibling && c.nextSibling.dataset, o)
        var R = o.dgst;
      return o = R, p = Error(h(419)), o = Os(p, o, void 0), To(n, r, S, o);
    }
    if (R = (S & n.childLanes) !== 0, qn || R) {
      if (o = kn, o !== null) {
        switch (S & -S) {
          case 4:
            c = 2;
            break;
          case 16:
            c = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            c = 32;
            break;
          case 536870912:
            c = 268435456;
            break;
          default:
            c = 0;
        }
        c = c & (o.suspendedLanes | S) ? 0 : c, c !== 0 && c !== p.retryLane && (p.retryLane = c, Xi(n, c), Fr(o, n, c, -1));
      }
      return ip(), o = Os(Error(h(421))), To(n, r, S, o);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = qy.bind(null, n), c._reactRetry = r, null) : (n = p.treeContext, ca = si(c.nextSibling), wa = r, yn = !0, Ba = null, n !== null && (sa[Ar++] = _r, sa[Ar++] = qi, sa[Ar++] = Ha, _r = n.id, qi = n.overflow, Ha = r), r = Gd(r, o.children), r.flags |= 4096, r);
  }
  function Qd(n, r, l) {
    n.lanes |= r;
    var o = n.alternate;
    o !== null && (o.lanes |= r), dr(n.return, r, l);
  }
  function rf(n, r, l, o, c) {
    var p = n.memoizedState;
    p === null ? n.memoizedState = {
      isBackwards: r,
      rendering: null,
      renderingStartTime: 0,
      last: o,
      tail: l,
      tailMode: c
    } : (p.isBackwards = r, p.rendering = null, p.renderingStartTime = 0, p.last = o, p.tail = l, p.tailMode = c);
  }
  function qd(n, r, l) {
    var o = r.pendingProps, c = o.revealOrder, p = o.tail;
    if (nr(n, r, o.children, l), o = tt.current, o & 2)
      o = o & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && n.flags & 128)
        e:
          for (n = r.child; n !== null; ) {
            if (n.tag === 13)
              n.memoizedState !== null && Qd(n, l, r);
            else if (n.tag === 19)
              Qd(n, l, r);
            else if (n.child !== null) {
              n.child.return = n, n = n.child;
              continue;
            }
            if (n === r)
              break e;
            for (; n.sibling === null; ) {
              if (n.return === null || n.return === r)
                break e;
              n = n.return;
            }
            n.sibling.return = n.return, n = n.sibling;
          }
      o &= 1;
    }
    if (Jt(tt, o), !(r.mode & 1))
      r.memoizedState = null;
    else
      switch (c) {
        case "forwards":
          for (l = r.child, c = null; l !== null; )
            n = l.alternate, n !== null && On(n) === null && (c = l), l = l.sibling;
          l = c, l === null ? (c = r.child, r.child = null) : (c = l.sibling, l.sibling = null), rf(r, !1, c, l, p);
          break;
        case "backwards":
          for (l = null, c = r.child, r.child = null; c !== null; ) {
            if (n = c.alternate, n !== null && On(n) === null) {
              r.child = c;
              break;
            }
            n = c.sibling, c.sibling = l, l = c, c = n;
          }
          rf(r, !0, l, null, p);
          break;
        case "together":
          rf(r, !1, null, null, void 0);
          break;
        default:
          r.memoizedState = null;
      }
    return r.child;
  }
  function zr(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function wr(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), tl |= r.lanes, !(l & r.childLanes))
      return null;
    if (n !== null && r.child !== n.child)
      throw Error(h(153));
    if (r.child !== null) {
      for (n = r.child, l = Gl(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; )
        n = n.sibling, l = l.sibling = Gl(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function Ji(n, r, l) {
    switch (r.tag) {
      case 3:
        fh(r), Dn();
        break;
      case 5:
        Ze(r);
        break;
      case 1:
        bn(r.type) && Rc(r);
        break;
      case 4:
        jd(r, r.stateNode.containerInfo);
        break;
      case 10:
        var o = r.type._context, c = r.memoizedProps.value;
        Jt(Ti, o._currentValue), o._currentValue = c;
        break;
      case 13:
        if (o = r.memoizedState, o !== null)
          return o.dehydrated !== null ? (Jt(tt, tt.current & 1), r.flags |= 128, null) : l & r.child.childLanes ? Wd(n, r, l) : (Jt(tt, tt.current & 1), n = wr(n, r, l), n !== null ? n.sibling : null);
        Jt(tt, tt.current & 1);
        break;
      case 19:
        if (o = (l & r.childLanes) !== 0, n.flags & 128) {
          if (o)
            return qd(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), Jt(tt, tt.current), o)
          break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, Tu(n, r, l);
    }
    return wr(n, r, l);
  }
  var Ms, Du, Ia, rr;
  Ms = function(n, r) {
    for (var l = r.child; l !== null; ) {
      if (l.tag === 5 || l.tag === 6)
        n.appendChild(l.stateNode);
      else if (l.tag !== 4 && l.child !== null) {
        l.child.return = l, l = l.child;
        continue;
      }
      if (l === r)
        break;
      for (; l.sibling === null; ) {
        if (l.return === null || l.return === r)
          return;
        l = l.return;
      }
      l.sibling.return = l.return, l = l.sibling;
    }
  }, Du = function() {
  }, Ia = function(n, r, l, o) {
    var c = n.memoizedProps;
    if (c !== o) {
      n = r.stateNode, gu(ci.current);
      var p = null;
      switch (l) {
        case "input":
          c = In(n, c), o = In(n, o), p = [];
          break;
        case "select":
          c = O({}, c, {
            value: void 0
          }), o = O({}, o, {
            value: void 0
          }), p = [];
          break;
        case "textarea":
          c = Lr(n, c), o = Lr(n, o), p = [];
          break;
        default:
          typeof c.onClick != "function" && typeof o.onClick == "function" && (n.onclick = wc);
      }
      St(l, o);
      var S;
      l = null;
      for (I in c)
        if (!o.hasOwnProperty(I) && c.hasOwnProperty(I) && c[I] != null)
          if (I === "style") {
            var R = c[I];
            for (S in R)
              R.hasOwnProperty(S) && (l || (l = {}), l[S] = "");
          } else
            I !== "dangerouslySetInnerHTML" && I !== "children" && I !== "suppressContentEditableWarning" && I !== "suppressHydrationWarning" && I !== "autoFocus" && (w.hasOwnProperty(I) ? p || (p = []) : (p = p || []).push(I, null));
      for (I in o) {
        var k = o[I];
        if (R = c?.[I], o.hasOwnProperty(I) && k !== R && (k != null || R != null))
          if (I === "style")
            if (R) {
              for (S in R)
                !R.hasOwnProperty(S) || k && k.hasOwnProperty(S) || (l || (l = {}), l[S] = "");
              for (S in k)
                k.hasOwnProperty(S) && R[S] !== k[S] && (l || (l = {}), l[S] = k[S]);
            } else
              l || (p || (p = []), p.push(I, l)), l = k;
          else
            I === "dangerouslySetInnerHTML" ? (k = k ? k.__html : void 0, R = R ? R.__html : void 0, k != null && R !== k && (p = p || []).push(I, k)) : I === "children" ? typeof k != "string" && typeof k != "number" || (p = p || []).push(I, "" + k) : I !== "suppressContentEditableWarning" && I !== "suppressHydrationWarning" && (w.hasOwnProperty(I) ? (k != null && I === "onScroll" && on("scroll", n), p || R === k || (p = [])) : (p = p || []).push(I, k));
      }
      l && (p = p || []).push("style", l);
      var I = p;
      (r.updateQueue = I) && (r.flags |= 4);
    }
  }, rr = function(n, r, l, o) {
    l !== o && (r.flags |= 4);
  };
  function Ns(n, r) {
    if (!yn)
      switch (n.tailMode) {
        case "hidden":
          r = n.tail;
          for (var l = null; r !== null; )
            r.alternate !== null && (l = r), r = r.sibling;
          l === null ? n.tail = null : l.sibling = null;
          break;
        case "collapsed":
          l = n.tail;
          for (var o = null; l !== null; )
            l.alternate !== null && (o = l), l = l.sibling;
          o === null ? r || n.tail === null ? n.tail = null : n.tail.sibling = null : o.sibling = null;
      }
  }
  function Ur(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, l = 0, o = 0;
    if (r)
      for (var c = n.child; c !== null; )
        l |= c.lanes | c.childLanes, o |= c.subtreeFlags & 14680064, o |= c.flags & 14680064, c.return = n, c = c.sibling;
    else
      for (c = n.child; c !== null; )
        l |= c.lanes | c.childLanes, o |= c.subtreeFlags, o |= c.flags, c.return = n, c = c.sibling;
    return n.subtreeFlags |= o, n.childLanes = l, r;
  }
  function Iy(n, r, l) {
    var o = r.pendingProps;
    switch (Od(r), r.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Ur(r), null;
      case 1:
        return bn(r.type) && Fa(), Ur(r), null;
      case 3:
        return o = r.stateNode, Hl(), qt(An), qt(lt), Uc(), o.pendingContext && (o.context = o.pendingContext, o.pendingContext = null), (n === null || n.child === null) && (Oc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, Ba !== null && (Fs(Ba), Ba = null))), Du(n, r), Ur(r), null;
      case 5:
        xt(r);
        var c = gu(Co.current);
        if (l = r.type, n !== null && r.stateNode != null)
          Ia(n, r, l, o, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!o) {
            if (r.stateNode === null)
              throw Error(h(166));
            return Ur(r), null;
          }
          if (n = gu(ci.current), Oc(r)) {
            o = r.stateNode, l = r.type;
            var p = r.memoizedProps;
            switch (o[wi] = r, o[hu] = p, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                on("cancel", o), on("close", o);
                break;
              case "iframe":
              case "object":
              case "embed":
                on("load", o);
                break;
              case "video":
              case "audio":
                for (c = 0; c < hs.length; c++)
                  on(hs[c], o);
                break;
              case "source":
                on("error", o);
                break;
              case "img":
              case "image":
              case "link":
                on("error", o), on("load", o);
                break;
              case "details":
                on("toggle", o);
                break;
              case "input":
                Tn(o, p), on("invalid", o);
                break;
              case "select":
                o._wrapperState = {
                  wasMultiple: !!p.multiple
                }, on("invalid", o);
                break;
              case "textarea":
                or(o, p), on("invalid", o);
            }
            St(l, p), c = null;
            for (var S in p)
              if (p.hasOwnProperty(S)) {
                var R = p[S];
                S === "children" ? typeof R == "string" ? o.textContent !== R && (p.suppressHydrationWarning !== !0 && bc(o.textContent, R, n), c = [
                  "children",
                  R
                ]) : typeof R == "number" && o.textContent !== "" + R && (p.suppressHydrationWarning !== !0 && bc(o.textContent, R, n), c = [
                  "children",
                  "" + R
                ]) : w.hasOwnProperty(S) && R != null && S === "onScroll" && on("scroll", o);
              }
            switch (l) {
              case "input":
                Zn(o), yr(o, p, !0);
                break;
              case "textarea":
                Zn(o), Jn(o);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof p.onClick == "function" && (o.onclick = wc);
            }
            o = c, r.updateQueue = o, o !== null && (r.flags |= 4);
          } else {
            S = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = Wn(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = S.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof o.is == "string" ? n = S.createElement(l, {
              is: o.is
            }) : (n = S.createElement(l), l === "select" && (S = n, o.multiple ? S.multiple = !0 : o.size && (S.size = o.size))) : n = S.createElementNS(n, l), n[wi] = r, n[hu] = o, Ms(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (S = Ct(l, o), l) {
                case "dialog":
                  on("cancel", n), on("close", n), c = o;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  on("load", n), c = o;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < hs.length; c++)
                    on(hs[c], n);
                  c = o;
                  break;
                case "source":
                  on("error", n), c = o;
                  break;
                case "img":
                case "image":
                case "link":
                  on("error", n), on("load", n), c = o;
                  break;
                case "details":
                  on("toggle", n), c = o;
                  break;
                case "input":
                  Tn(n, o), c = In(n, o), on("invalid", n);
                  break;
                case "option":
                  c = o;
                  break;
                case "select":
                  n._wrapperState = {
                    wasMultiple: !!o.multiple
                  }, c = O({}, o, {
                    value: void 0
                  }), on("invalid", n);
                  break;
                case "textarea":
                  or(n, o), c = Lr(n, o), on("invalid", n);
                  break;
                default:
                  c = o;
              }
              St(l, c), R = c;
              for (p in R)
                if (R.hasOwnProperty(p)) {
                  var k = R[p];
                  p === "style" ? Z(n, k) : p === "dangerouslySetInnerHTML" ? (k = k ? k.__html : void 0, k != null && La(n, k)) : p === "children" ? typeof k == "string" ? (l !== "textarea" || k !== "") && Cr(n, k) : typeof k == "number" && Cr(n, "" + k) : p !== "suppressContentEditableWarning" && p !== "suppressHydrationWarning" && p !== "autoFocus" && (w.hasOwnProperty(p) ? k != null && p === "onScroll" && on("scroll", n) : k != null && He(n, p, k, S));
                }
              switch (l) {
                case "input":
                  Zn(n), yr(n, o, !1);
                  break;
                case "textarea":
                  Zn(n), Jn(n);
                  break;
                case "option":
                  o.value != null && n.setAttribute("value", "" + vt(o.value));
                  break;
                case "select":
                  n.multiple = !!o.multiple, p = o.value, p != null ? Yn(n, !!o.multiple, p, !1) : o.defaultValue != null && Yn(n, !!o.multiple, o.defaultValue, !0);
                  break;
                default:
                  typeof c.onClick == "function" && (n.onclick = wc);
              }
              switch (l) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  o = !!o.autoFocus;
                  break e;
                case "img":
                  o = !0;
                  break e;
                default:
                  o = !1;
              }
            }
            o && (r.flags |= 4);
          }
          r.ref !== null && (r.flags |= 512, r.flags |= 2097152);
        }
        return Ur(r), null;
      case 6:
        if (n && r.stateNode != null)
          rr(n, r, n.memoizedProps, o);
        else {
          if (typeof o != "string" && r.stateNode === null)
            throw Error(h(166));
          if (l = gu(Co.current), gu(ci.current), Oc(r)) {
            if (o = r.stateNode, l = r.memoizedProps, o[wi] = r, (p = o.nodeValue !== l) && (n = wa, n !== null))
              switch (n.tag) {
                case 3:
                  bc(o.nodeValue, l, (n.mode & 1) !== 0);
                  break;
                case 5:
                  n.memoizedProps.suppressHydrationWarning !== !0 && bc(o.nodeValue, l, (n.mode & 1) !== 0);
              }
            p && (r.flags |= 4);
          } else
            o = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(o), o[wi] = r, r.stateNode = o;
        }
        return Ur(r), null;
      case 13:
        if (qt(tt), o = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (yn && ca !== null && r.mode & 1 && !(r.flags & 128))
            Zv(), Dn(), r.flags |= 98560, p = !1;
          else if (p = Oc(r), o !== null && o.dehydrated !== null) {
            if (n === null) {
              if (!p)
                throw Error(h(318));
              if (p = r.memoizedState, p = p !== null ? p.dehydrated : null, !p)
                throw Error(h(317));
              p[wi] = r;
            } else
              Dn(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            Ur(r), p = !1;
          } else
            Ba !== null && (Fs(Ba), Ba = null), p = !0;
          if (!p)
            return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = l, r) : (o = o !== null, o !== (n !== null && n.memoizedState !== null) && o && (r.child.flags |= 8192, r.mode & 1 && (n === null || tt.current & 1 ? ir === 0 && (ir = 3) : ip())), r.updateQueue !== null && (r.flags |= 4), Ur(r), null);
      case 4:
        return Hl(), Du(n, r), n === null && ho(r.stateNode.containerInfo), Ur(r), null;
      case 10:
        return Ul(r.type._context), Ur(r), null;
      case 17:
        return bn(r.type) && Fa(), Ur(r), null;
      case 19:
        if (qt(tt), p = r.memoizedState, p === null)
          return Ur(r), null;
        if (o = (r.flags & 128) !== 0, S = p.rendering, S === null)
          if (o)
            Ns(p, !1);
          else {
            if (ir !== 0 || n !== null && n.flags & 128)
              for (n = r.child; n !== null; ) {
                if (S = On(n), S !== null) {
                  for (r.flags |= 128, Ns(p, !1), o = S.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), r.subtreeFlags = 0, o = l, l = r.child; l !== null; )
                    p = l, n = o, p.flags &= 14680066, S = p.alternate, S === null ? (p.childLanes = 0, p.lanes = n, p.child = null, p.subtreeFlags = 0, p.memoizedProps = null, p.memoizedState = null, p.updateQueue = null, p.dependencies = null, p.stateNode = null) : (p.childLanes = S.childLanes, p.lanes = S.lanes, p.child = S.child, p.subtreeFlags = 0, p.deletions = null, p.memoizedProps = S.memoizedProps, p.memoizedState = S.memoizedState, p.updateQueue = S.updateQueue, p.type = S.type, n = S.dependencies, p.dependencies = n === null ? null : {
                      lanes: n.lanes,
                      firstContext: n.firstContext
                    }), l = l.sibling;
                  return Jt(tt, tt.current & 1 | 2), r.child;
                }
                n = n.sibling;
              }
            p.tail !== null && Ht() > Lo && (r.flags |= 128, o = !0, Ns(p, !1), r.lanes = 4194304);
          }
        else {
          if (!o)
            if (n = On(S), n !== null) {
              if (r.flags |= 128, o = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), Ns(p, !0), p.tail === null && p.tailMode === "hidden" && !S.alternate && !yn)
                return Ur(r), null;
            } else
              2 * Ht() - p.renderingStartTime > Lo && l !== 1073741824 && (r.flags |= 128, o = !0, Ns(p, !1), r.lanes = 4194304);
          p.isBackwards ? (S.sibling = r.child, r.child = S) : (l = p.last, l !== null ? l.sibling = S : r.child = S, p.last = S);
        }
        return p.tail !== null ? (r = p.tail, p.rendering = r, p.tail = r.sibling, p.renderingStartTime = Ht(), r.sibling = null, l = tt.current, Jt(tt, o ? l & 1 | 2 : l & 1), r) : (Ur(r), null);
      case 22:
      case 23:
        return ap(), o = r.memoizedState !== null, n !== null && n.memoizedState !== null !== o && (r.flags |= 8192), o && r.mode & 1 ? xa & 1073741824 && (Ur(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : Ur(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(h(156, r.tag));
  }
  function Xd(n, r) {
    switch (Od(r), r.tag) {
      case 1:
        return bn(r.type) && Fa(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return Hl(), qt(An), qt(lt), Uc(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return xt(r), null;
      case 13:
        if (qt(tt), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null)
            throw Error(h(340));
          Dn();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return qt(tt), null;
      case 4:
        return Hl(), null;
      case 10:
        return Ul(r.type._context), null;
      case 22:
      case 23:
        return ap(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Ls = !1, ar = !1, dh = typeof WeakSet == "function" ? WeakSet : Set, Me = null;
  function xo(n, r) {
    var l = n.ref;
    if (l !== null)
      if (typeof l == "function")
        try {
          l(null);
        } catch (o) {
          Un(n, r, o);
        }
      else
        l.current = null;
  }
  function As(n, r, l) {
    try {
      l();
    } catch (o) {
      Un(n, r, o);
    }
  }
  var ph = !1;
  function vh(n, r) {
    if (Ed = za, n = gc(), Yi(n)) {
      if ("selectionStart" in n)
        var l = {
          start: n.selectionStart,
          end: n.selectionEnd
        };
      else
        e: {
          l = (l = n.ownerDocument) && l.defaultView || window;
          var o = l.getSelection && l.getSelection();
          if (o && o.rangeCount !== 0) {
            l = o.anchorNode;
            var c = o.anchorOffset, p = o.focusNode;
            o = o.focusOffset;
            try {
              l.nodeType, p.nodeType;
            } catch {
              l = null;
              break e;
            }
            var S = 0, R = -1, k = -1, I = 0, ae = 0, le = n, re = null;
            t:
              for (; ; ) {
                for (var we; le !== l || c !== 0 && le.nodeType !== 3 || (R = S + c), le !== p || o !== 0 && le.nodeType !== 3 || (k = S + o), le.nodeType === 3 && (S += le.nodeValue.length), (we = le.firstChild) !== null; )
                  re = le, le = we;
                for (; ; ) {
                  if (le === n)
                    break t;
                  if (re === l && ++I === c && (R = S), re === p && ++ae === o && (k = S), (we = le.nextSibling) !== null)
                    break;
                  le = re, re = le.parentNode;
                }
                le = we;
              }
            l = R === -1 || k === -1 ? null : {
              start: R,
              end: k
            };
          } else
            l = null;
        }
      l = l || {
        start: 0,
        end: 0
      };
    } else
      l = null;
    for (pu = {
      focusedElem: n,
      selectionRange: l
    }, za = !1, Me = r; Me !== null; )
      if (r = Me, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null)
        n.return = r, Me = n;
      else
        for (; Me !== null; ) {
          r = Me;
          try {
            var Ne = r.alternate;
            if (r.flags & 1024)
              switch (r.tag) {
                case 0:
                case 11:
                case 15:
                  break;
                case 1:
                  if (Ne !== null) {
                    var Ue = Ne.memoizedProps, Bn = Ne.memoizedState, U = r.stateNode, A = U.getSnapshotBeforeUpdate(r.elementType === r.type ? Ue : Ra(r.type, Ue), Bn);
                    U.__reactInternalSnapshotBeforeUpdate = A;
                  }
                  break;
                case 3:
                  var H = r.stateNode.containerInfo;
                  H.nodeType === 1 ? H.textContent = "" : H.nodeType === 9 && H.documentElement && H.removeChild(H.documentElement);
                  break;
                case 5:
                case 6:
                case 4:
                case 17:
                  break;
                default:
                  throw Error(h(163));
              }
          } catch (pe) {
            Un(r, r.return, pe);
          }
          if (n = r.sibling, n !== null) {
            n.return = r.return, Me = n;
            break;
          }
          Me = r.return;
        }
    return Ne = ph, ph = !1, Ne;
  }
  function zs(n, r, l) {
    var o = r.updateQueue;
    if (o = o !== null ? o.lastEffect : null, o !== null) {
      var c = o = o.next;
      do {
        if ((c.tag & n) === n) {
          var p = c.destroy;
          c.destroy = void 0, p !== void 0 && As(r, l, p);
        }
        c = c.next;
      } while (c !== o);
    }
  }
  function Us(n, r) {
    if (r = r.updateQueue, r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & n) === n) {
          var o = l.create;
          l.destroy = o();
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function Kd(n) {
    var r = n.ref;
    if (r !== null) {
      var l = n.stateNode;
      switch (n.tag) {
        case 5:
          n = l;
          break;
        default:
          n = l;
      }
      typeof r == "function" ? r(n) : r.current = n;
    }
  }
  function Zd(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, Zd(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[wi], delete r[hu], delete r[wd], delete r[Py], delete r[Rd])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function hh(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function af(n) {
    e:
      for (; ; ) {
        for (; n.sibling === null; ) {
          if (n.return === null || hh(n.return))
            return null;
          n = n.return;
        }
        for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
          if (n.flags & 2 || n.child === null || n.tag === 4)
            continue e;
          n.child.return = n, n = n.child;
        }
        if (!(n.flags & 2))
          return n.stateNode;
      }
  }
  function Do(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6)
      n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = wc));
    else if (o !== 4 && (n = n.child, n !== null))
      for (Do(n, r, l), n = n.sibling; n !== null; )
        Do(n, r, l), n = n.sibling;
  }
  function Di(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6)
      n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (o !== 4 && (n = n.child, n !== null))
      for (Di(n, r, l), n = n.sibling; n !== null; )
        Di(n, r, l), n = n.sibling;
  }
  var wn = null, pr = !1;
  function Ya(n, r, l) {
    for (l = l.child; l !== null; )
      Oo(n, r, l), l = l.sibling;
  }
  function Oo(n, r, l) {
    if (na && typeof na.onCommitFiberUnmount == "function")
      try {
        na.onCommitFiberUnmount(gl, l);
      } catch {
      }
    switch (l.tag) {
      case 5:
        ar || xo(l, r);
      case 6:
        var o = wn, c = pr;
        wn = null, Ya(n, r, l), wn = o, pr = c, wn !== null && (pr ? (n = wn, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : wn.removeChild(l.stateNode));
        break;
      case 18:
        wn !== null && (pr ? (n = wn, l = l.stateNode, n.nodeType === 8 ? kl(n.parentNode, l) : n.nodeType === 1 && kl(n, l), Rl(n)) : kl(wn, l.stateNode));
        break;
      case 4:
        o = wn, c = pr, wn = l.stateNode.containerInfo, pr = !0, Ya(n, r, l), wn = o, pr = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!ar && (o = l.updateQueue, o !== null && (o = o.lastEffect, o !== null))) {
          c = o = o.next;
          do {
            var p = c, S = p.destroy;
            p = p.tag, S !== void 0 && (p & 2 || p & 4) && As(l, r, S), c = c.next;
          } while (c !== o);
        }
        Ya(n, r, l);
        break;
      case 1:
        if (!ar && (xo(l, r), o = l.stateNode, typeof o.componentWillUnmount == "function"))
          try {
            o.props = l.memoizedProps, o.state = l.memoizedState, o.componentWillUnmount();
          } catch (R) {
            Un(l, r, R);
          }
        Ya(n, r, l);
        break;
      case 21:
        Ya(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (ar = (o = ar) || l.memoizedState !== null, Ya(n, r, l), ar = o) : Ya(n, r, l);
        break;
      default:
        Ya(n, r, l);
    }
  }
  function el(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var l = n.stateNode;
      l === null && (l = n.stateNode = new dh()), r.forEach(function(o) {
        var c = Xy.bind(null, n, o);
        l.has(o) || (l.add(o), o.then(c, c));
      });
    }
  }
  function fi(n, r) {
    var l = r.deletions;
    if (l !== null)
      for (var o = 0; o < l.length; o++) {
        var c = l[o];
        try {
          var p = n, S = r, R = S;
          e:
            for (; R !== null; ) {
              switch (R.tag) {
                case 5:
                  wn = R.stateNode, pr = !1;
                  break e;
                case 3:
                  wn = R.stateNode.containerInfo, pr = !0;
                  break e;
                case 4:
                  wn = R.stateNode.containerInfo, pr = !0;
                  break e;
              }
              R = R.return;
            }
          if (wn === null)
            throw Error(h(160));
          Oo(p, S, c), wn = null, pr = !1;
          var k = c.alternate;
          k !== null && (k.return = null), c.return = null;
        } catch (I) {
          Un(c, r, I);
        }
      }
    if (r.subtreeFlags & 12854)
      for (r = r.child; r !== null; )
        mh(r, n), r = r.sibling;
  }
  function mh(n, r) {
    var l = n.alternate, o = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (fi(r, n), Oi(n), o & 4) {
          try {
            zs(3, n, n.return), Us(3, n);
          } catch (Ue) {
            Un(n, n.return, Ue);
          }
          try {
            zs(5, n, n.return);
          } catch (Ue) {
            Un(n, n.return, Ue);
          }
        }
        break;
      case 1:
        fi(r, n), Oi(n), o & 512 && l !== null && xo(l, l.return);
        break;
      case 5:
        if (fi(r, n), Oi(n), o & 512 && l !== null && xo(l, l.return), n.flags & 32) {
          var c = n.stateNode;
          try {
            Cr(c, "");
          } catch (Ue) {
            Un(n, n.return, Ue);
          }
        }
        if (o & 4 && (c = n.stateNode, c != null)) {
          var p = n.memoizedProps, S = l !== null ? l.memoizedProps : p, R = n.type, k = n.updateQueue;
          if (n.updateQueue = null, k !== null)
            try {
              R === "input" && p.type === "radio" && p.name != null && Nn(c, p), Ct(R, S);
              var I = Ct(R, p);
              for (S = 0; S < k.length; S += 2) {
                var ae = k[S], le = k[S + 1];
                ae === "style" ? Z(c, le) : ae === "dangerouslySetInnerHTML" ? La(c, le) : ae === "children" ? Cr(c, le) : He(c, ae, le, I);
              }
              switch (R) {
                case "input":
                  _n(c, p);
                  break;
                case "textarea":
                  Br(c, p);
                  break;
                case "select":
                  var re = c._wrapperState.wasMultiple;
                  c._wrapperState.wasMultiple = !!p.multiple;
                  var we = p.value;
                  we != null ? Yn(c, !!p.multiple, we, !1) : re !== !!p.multiple && (p.defaultValue != null ? Yn(c, !!p.multiple, p.defaultValue, !0) : Yn(c, !!p.multiple, p.multiple ? [] : "", !1));
              }
              c[hu] = p;
            } catch (Ue) {
              Un(n, n.return, Ue);
            }
        }
        break;
      case 6:
        if (fi(r, n), Oi(n), o & 4) {
          if (n.stateNode === null)
            throw Error(h(162));
          c = n.stateNode, p = n.memoizedProps;
          try {
            c.nodeValue = p;
          } catch (Ue) {
            Un(n, n.return, Ue);
          }
        }
        break;
      case 3:
        if (fi(r, n), Oi(n), o & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            Rl(r.containerInfo);
          } catch (Ue) {
            Un(n, n.return, Ue);
          }
        break;
      case 4:
        fi(r, n), Oi(n);
        break;
      case 13:
        fi(r, n), Oi(n), c = n.child, c.flags & 8192 && (p = c.memoizedState !== null, c.stateNode.isHidden = p, !p || c.alternate !== null && c.alternate.memoizedState !== null || (tp = Ht())), o & 4 && el(n);
        break;
      case 22:
        if (ae = l !== null && l.memoizedState !== null, n.mode & 1 ? (ar = (I = ar) || ae, fi(r, n), ar = I) : fi(r, n), Oi(n), o & 8192) {
          if (I = n.memoizedState !== null, (n.stateNode.isHidden = I) && !ae && n.mode & 1)
            for (Me = n, ae = n.child; ae !== null; ) {
              for (le = Me = ae; Me !== null; ) {
                switch (re = Me, we = re.child, re.tag) {
                  case 0:
                  case 11:
                  case 14:
                  case 15:
                    zs(4, re, re.return);
                    break;
                  case 1:
                    xo(re, re.return);
                    var Ne = re.stateNode;
                    if (typeof Ne.componentWillUnmount == "function") {
                      o = re, l = re.return;
                      try {
                        r = o, Ne.props = r.memoizedProps, Ne.state = r.memoizedState, Ne.componentWillUnmount();
                      } catch (Ue) {
                        Un(o, l, Ue);
                      }
                    }
                    break;
                  case 5:
                    xo(re, re.return);
                    break;
                  case 22:
                    if (re.memoizedState !== null) {
                      Jd(le);
                      continue;
                    }
                }
                we !== null ? (we.return = re, Me = we) : Jd(le);
              }
              ae = ae.sibling;
            }
          e:
            for (ae = null, le = n; ; ) {
              if (le.tag === 5) {
                if (ae === null) {
                  ae = le;
                  try {
                    c = le.stateNode, I ? (p = c.style, typeof p.setProperty == "function" ? p.setProperty("display", "none", "important") : p.display = "none") : (R = le.stateNode, k = le.memoizedProps.style, S = k != null && k.hasOwnProperty("display") ? k.display : null, R.style.display = F("display", S));
                  } catch (Ue) {
                    Un(n, n.return, Ue);
                  }
                }
              } else if (le.tag === 6) {
                if (ae === null)
                  try {
                    le.stateNode.nodeValue = I ? "" : le.memoizedProps;
                  } catch (Ue) {
                    Un(n, n.return, Ue);
                  }
              } else if ((le.tag !== 22 && le.tag !== 23 || le.memoizedState === null || le === n) && le.child !== null) {
                le.child.return = le, le = le.child;
                continue;
              }
              if (le === n)
                break e;
              for (; le.sibling === null; ) {
                if (le.return === null || le.return === n)
                  break e;
                ae === le && (ae = null), le = le.return;
              }
              ae === le && (ae = null), le.sibling.return = le.return, le = le.sibling;
            }
        }
        break;
      case 19:
        fi(r, n), Oi(n), o & 4 && el(n);
        break;
      case 21:
        break;
      default:
        fi(r, n), Oi(n);
    }
  }
  function Oi(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var l = n.return; l !== null; ) {
            if (hh(l)) {
              var o = l;
              break e;
            }
            l = l.return;
          }
          throw Error(h(160));
        }
        switch (o.tag) {
          case 5:
            var c = o.stateNode;
            o.flags & 32 && (Cr(c, ""), o.flags &= -33);
            var p = af(n);
            Di(n, p, c);
            break;
          case 3:
          case 4:
            var S = o.stateNode.containerInfo, R = af(n);
            Do(n, R, S);
            break;
          default:
            throw Error(h(161));
        }
      } catch (k) {
        Un(n, n.return, k);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function yh(n, r, l) {
    Me = n, ko(n);
  }
  function ko(n, r, l) {
    for (var o = (n.mode & 1) !== 0; Me !== null; ) {
      var c = Me, p = c.child;
      if (c.tag === 22 && o) {
        var S = c.memoizedState !== null || Ls;
        if (!S) {
          var R = c.alternate, k = R !== null && R.memoizedState !== null || ar;
          R = Ls;
          var I = ar;
          if (Ls = S, (ar = k) && !I)
            for (Me = c; Me !== null; )
              S = Me, k = S.child, S.tag === 22 && S.memoizedState !== null ? Sh(c) : k !== null ? (k.return = S, Me = k) : Sh(c);
          for (; p !== null; )
            Me = p, ko(p), p = p.sibling;
          Me = c, Ls = R, ar = I;
        }
        gh(n);
      } else
        c.subtreeFlags & 8772 && p !== null ? (p.return = c, Me = p) : gh(n);
    }
  }
  function gh(n) {
    for (; Me !== null; ) {
      var r = Me;
      if (r.flags & 8772) {
        var l = r.alternate;
        try {
          if (r.flags & 8772)
            switch (r.tag) {
              case 0:
              case 11:
              case 15:
                ar || Us(5, r);
                break;
              case 1:
                var o = r.stateNode;
                if (r.flags & 4 && !ar)
                  if (l === null)
                    o.componentDidMount();
                  else {
                    var c = r.elementType === r.type ? l.memoizedProps : Ra(r.type, l.memoizedProps);
                    o.componentDidUpdate(c, l.memoizedState, o.__reactInternalSnapshotBeforeUpdate);
                  }
                var p = r.updateQueue;
                p !== null && yu(r, p, o);
                break;
              case 3:
                var S = r.updateQueue;
                if (S !== null) {
                  if (l = null, r.child !== null)
                    switch (r.child.tag) {
                      case 5:
                        l = r.child.stateNode;
                        break;
                      case 1:
                        l = r.child.stateNode;
                    }
                  yu(r, S, l);
                }
                break;
              case 5:
                var R = r.stateNode;
                if (l === null && r.flags & 4) {
                  l = R;
                  var k = r.memoizedProps;
                  switch (r.type) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      k.autoFocus && l.focus();
                      break;
                    case "img":
                      k.src && (l.src = k.src);
                  }
                }
                break;
              case 6:
                break;
              case 4:
                break;
              case 12:
                break;
              case 13:
                if (r.memoizedState === null) {
                  var I = r.alternate;
                  if (I !== null) {
                    var ae = I.memoizedState;
                    if (ae !== null) {
                      var le = ae.dehydrated;
                      le !== null && Rl(le);
                    }
                  }
                }
                break;
              case 19:
              case 17:
              case 21:
              case 22:
              case 23:
              case 25:
                break;
              default:
                throw Error(h(163));
            }
          ar || r.flags & 512 && Kd(r);
        } catch (re) {
          Un(r, r.return, re);
        }
      }
      if (r === n) {
        Me = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, Me = l;
        break;
      }
      Me = r.return;
    }
  }
  function Jd(n) {
    for (; Me !== null; ) {
      var r = Me;
      if (r === n) {
        Me = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, Me = l;
        break;
      }
      Me = r.return;
    }
  }
  function Sh(n) {
    for (; Me !== null; ) {
      var r = Me;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              Us(4, r);
            } catch (k) {
              Un(r, l, k);
            }
            break;
          case 1:
            var o = r.stateNode;
            if (typeof o.componentDidMount == "function") {
              var c = r.return;
              try {
                o.componentDidMount();
              } catch (k) {
                Un(r, c, k);
              }
            }
            var p = r.return;
            try {
              Kd(r);
            } catch (k) {
              Un(r, p, k);
            }
            break;
          case 5:
            var S = r.return;
            try {
              Kd(r);
            } catch (k) {
              Un(r, S, k);
            }
        }
      } catch (k) {
        Un(r, r.return, k);
      }
      if (r === n) {
        Me = null;
        break;
      }
      var R = r.sibling;
      if (R !== null) {
        R.return = r.return, Me = R;
        break;
      }
      Me = r.return;
    }
  }
  var lf = Math.ceil, Ps = mt.ReactCurrentDispatcher, ep = mt.ReactCurrentOwner, Pr = mt.ReactCurrentBatchConfig, kt = 0, kn = null, zn = null, vr = 0, xa = 0, Mo = _t(0), ir = 0, js = null, tl = 0, uf = 0, No = 0, Ou = null, Wr = null, tp = 0, Lo = 1 / 0, nl = null, of = !1, ku = null, ki = null, Il = !1, Yl = null, sf = 0, Ao = 0, cf = null, Mu = -1, Nu = 0;
  function jr() {
    return kt & 6 ? Ht() : Mu !== -1 ? Mu : Mu = Ht();
  }
  function Xn(n) {
    return n.mode & 1 ? kt & 2 && vr !== 0 ? vr & -vr : kc.transition !== null ? (Nu === 0 && (Nu = eo()), Nu) : (n = Wt, n !== 0 || (n = window.event, n = n === void 0 ? 16 : ls(n.type)), n) : 1;
  }
  function Fr(n, r, l, o) {
    if (50 < Ao)
      throw Ao = 0, cf = null, Error(h(185));
    Hi(n, l, o), (!(kt & 2) || n !== kn) && (n === kn && (!(kt & 2) && (uf |= l), ir === 4 && Wa(n, vr)), Hr(n, o), l === 1 && kt === 0 && !(r.mode & 1) && (Lo = Ht() + 500, fr && ua()));
  }
  function Hr(n, r) {
    var l = n.callbackNode;
    El(n, r);
    var o = Ir(n, n === kn ? vr : 0);
    if (o === 0)
      l !== null && Er(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = o & -o, n.callbackPriority !== r) {
      if (l != null && Er(l), r === 1)
        n.tag === 0 ? xd(Ch.bind(null, n)) : Td(Ch.bind(null, n)), bd(function() {
          !(kt & 6) && ua();
        }), l = null;
      else {
        switch (no(o)) {
          case 1:
            l = ri;
            break;
          case 4:
            l = Rt;
            break;
          case 16:
            l = Ei;
            break;
          case 536870912:
            l = Zu;
            break;
          default:
            l = Ei;
        }
        l = up(l, zo.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function zo(n, r) {
    if (Mu = -1, Nu = 0, kt & 6)
      throw Error(h(327));
    var l = n.callbackNode;
    if (Po() && n.callbackNode !== l)
      return null;
    var o = Ir(n, n === kn ? vr : 0);
    if (o === 0)
      return null;
    if (o & 30 || o & n.expiredLanes || r)
      r = df(n, o);
    else {
      r = o;
      var c = kt;
      kt |= 2;
      var p = ff();
      (kn !== n || vr !== r) && (nl = null, Lo = Ht() + 500, Lu(n, r));
      do
        try {
          Wy();
          break;
        } catch (R) {
          Eh(n, R);
        }
      while (!0);
      Ld(), Ps.current = p, kt = c, zn !== null ? r = 0 : (kn = null, vr = 0, r = ir);
    }
    if (r !== 0) {
      if (r === 2 && (c = _l(n), c !== 0 && (o = c, r = np(n, c))), r === 1)
        throw l = js, Lu(n, 0), Wa(n, o), Hr(n, Ht()), l;
      if (r === 6)
        Wa(n, o);
      else {
        if (c = n.current.alternate, !(o & 30) && !rp(c) && (r = df(n, o), r === 2 && (p = _l(n), p !== 0 && (o = p, r = np(n, p))), r === 1))
          throw l = js, Lu(n, 0), Wa(n, o), Hr(n, Ht()), l;
        switch (n.finishedWork = c, n.finishedLanes = o, r) {
          case 0:
          case 1:
            throw Error(h(345));
          case 2:
            Au(n, Wr, nl);
            break;
          case 3:
            if (Wa(n, o), (o & 130023424) === o && (r = tp + 500 - Ht(), 10 < r)) {
              if (Ir(n, 0) !== 0)
                break;
              if (c = n.suspendedLanes, (c & o) !== o) {
                jr(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = vu(Au.bind(null, n, Wr, nl), r);
              break;
            }
            Au(n, Wr, nl);
            break;
          case 4:
            if (Wa(n, o), (o & 4194240) === o)
              break;
            for (r = n.eventTimes, c = -1; 0 < o; ) {
              var S = 31 - $r(o);
              p = 1 << S, S = r[S], S > c && (c = S), o &= ~p;
            }
            if (o = c, o = Ht() - o, o = (120 > o ? 120 : 480 > o ? 480 : 1080 > o ? 1080 : 1920 > o ? 1920 : 3e3 > o ? 3e3 : 4320 > o ? 4320 : 1960 * lf(o / 1960)) - o, 10 < o) {
              n.timeoutHandle = vu(Au.bind(null, n, Wr, nl), o);
              break;
            }
            Au(n, Wr, nl);
            break;
          case 5:
            Au(n, Wr, nl);
            break;
          default:
            throw Error(h(329));
        }
      }
    }
    return Hr(n, Ht()), n.callbackNode === l ? zo.bind(null, n) : null;
  }
  function np(n, r) {
    var l = Ou;
    return n.current.memoizedState.isDehydrated && (Lu(n, r).flags |= 256), n = df(n, r), n !== 2 && (r = Wr, Wr = l, r !== null && Fs(r)), n;
  }
  function Fs(n) {
    Wr === null ? Wr = n : Wr.push.apply(Wr, n);
  }
  function rp(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var l = r.updateQueue;
        if (l !== null && (l = l.stores, l !== null))
          for (var o = 0; o < l.length; o++) {
            var c = l[o], p = c.getSnapshot;
            c = c.value;
            try {
              if (!Ua(p(), c))
                return !1;
            } catch {
              return !1;
            }
          }
      }
      if (l = r.child, r.subtreeFlags & 16384 && l !== null)
        l.return = r, r = l;
      else {
        if (r === n)
          break;
        for (; r.sibling === null; ) {
          if (r.return === null || r.return === n)
            return !0;
          r = r.return;
        }
        r.sibling.return = r.return, r = r.sibling;
      }
    }
    return !0;
  }
  function Wa(n, r) {
    for (r &= ~No, r &= ~uf, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - $r(r), o = 1 << l;
      n[l] = -1, r &= ~o;
    }
  }
  function Ch(n) {
    if (kt & 6)
      throw Error(h(327));
    Po();
    var r = Ir(n, 0);
    if (!(r & 1))
      return Hr(n, Ht()), null;
    var l = df(n, r);
    if (n.tag !== 0 && l === 2) {
      var o = _l(n);
      o !== 0 && (r = o, l = np(n, o));
    }
    if (l === 1)
      throw l = js, Lu(n, 0), Wa(n, r), Hr(n, Ht()), l;
    if (l === 6)
      throw Error(h(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, Au(n, Wr, nl), Hr(n, Ht()), null;
  }
  function Uo(n, r) {
    var l = kt;
    kt |= 1;
    try {
      return n(r);
    } finally {
      kt = l, kt === 0 && (Lo = Ht() + 500, fr && ua());
    }
  }
  function Wl(n) {
    Yl !== null && Yl.tag === 0 && !(kt & 6) && Po();
    var r = kt;
    kt |= 1;
    var l = Pr.transition, o = Wt;
    try {
      if (Pr.transition = null, Wt = 1, n)
        return n();
    } finally {
      Wt = o, Pr.transition = l, kt = r, !(kt & 6) && ua();
    }
  }
  function ap() {
    xa = Mo.current, qt(Mo);
  }
  function Lu(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, Qv(l)), zn !== null)
      for (l = zn.return; l !== null; ) {
        var o = l;
        switch (Od(o), o.tag) {
          case 1:
            o = o.type.childContextTypes, o != null && Fa();
            break;
          case 3:
            Hl(), qt(An), qt(lt), Uc();
            break;
          case 5:
            xt(o);
            break;
          case 4:
            Hl();
            break;
          case 13:
            qt(tt);
            break;
          case 19:
            qt(tt);
            break;
          case 10:
            Ul(o.type._context);
            break;
          case 22:
          case 23:
            ap();
        }
        l = l.return;
      }
    if (kn = n, zn = n = Gl(n.current, null), vr = xa = r, ir = 0, js = null, No = uf = tl = 0, Wr = Ou = null, br !== null) {
      for (r = 0; r < br.length; r++)
        if (l = br[r], o = l.interleaved, o !== null) {
          l.interleaved = null;
          var c = o.next, p = l.pending;
          if (p !== null) {
            var S = p.next;
            p.next = c, o.next = S;
          }
          l.pending = o;
        }
      br = null;
    }
    return n;
  }
  function Eh(n, r) {
    do {
      var l = zn;
      try {
        if (Ld(), Pc.current = Jc, rt) {
          for (var o = gn.memoizedState; o !== null; ) {
            var c = o.queue;
            c !== null && (c.pending = null), o = o.next;
          }
          rt = !1;
        }
        if (Su = 0, At = Q = gn = null, xi = !1, Ta = 0, ep.current = null, l === null || l.return === null) {
          ir = 1, js = r, zn = null;
          break;
        }
        e: {
          var p = n, S = l.return, R = l, k = r;
          if (r = vr, R.flags |= 32768, k !== null && typeof k == "object" && typeof k.then == "function") {
            var I = k, ae = R, le = ae.tag;
            if (!(ae.mode & 1) && (le === 0 || le === 11 || le === 15)) {
              var re = ae.alternate;
              re ? (ae.updateQueue = re.updateQueue, ae.memoizedState = re.memoizedState, ae.lanes = re.lanes) : (ae.updateQueue = null, ae.memoizedState = null);
            }
            var we = Vd(S);
            if (we !== null) {
              we.flags &= -257, $d(we, S, R, p, r), we.mode & 1 && sh(p, I, r), r = we, k = I;
              var Ne = r.updateQueue;
              if (Ne === null) {
                var Ue = /* @__PURE__ */ new Set();
                Ue.add(k), r.updateQueue = Ue;
              } else
                Ne.add(k);
              break e;
            } else {
              if (!(r & 1)) {
                sh(p, I, r), ip();
                break e;
              }
              k = Error(h(426));
            }
          } else if (yn && R.mode & 1) {
            var Bn = Vd(S);
            if (Bn !== null) {
              !(Bn.flags & 65536) && (Bn.flags |= 256), $d(Bn, S, R, p, r), Md(wo(k, R));
              break e;
            }
          }
          p = k = wo(k, R), ir !== 4 && (ir = 2), Ou === null ? Ou = [
            p
          ] : Ou.push(p), p = S;
          do {
            switch (p.tag) {
              case 3:
                p.flags |= 65536, r &= -r, p.lanes |= r;
                var U = oh(p, k, r);
                Ud(p, U);
                break e;
              case 1:
                R = k;
                var A = p.type, H = p.stateNode;
                if (!(p.flags & 128) && (typeof A.getDerivedStateFromError == "function" || H !== null && typeof H.componentDidCatch == "function" && (ki === null || !ki.has(H)))) {
                  p.flags |= 65536, r &= -r, p.lanes |= r;
                  var pe = ks(p, R, r);
                  Ud(p, pe);
                  break e;
                }
            }
            p = p.return;
          } while (p !== null);
        }
        lp(l);
      } catch (Fe) {
        r = Fe, zn === l && l !== null && (zn = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function ff() {
    var n = Ps.current;
    return Ps.current = Jc, n === null ? Jc : n;
  }
  function ip() {
    (ir === 0 || ir === 3 || ir === 2) && (ir = 4), kn === null || !(tl & 268435455) && !(uf & 268435455) || Wa(kn, vr);
  }
  function df(n, r) {
    var l = kt;
    kt |= 2;
    var o = ff();
    (kn !== n || vr !== r) && (nl = null, Lu(n, r));
    do
      try {
        Yy();
        break;
      } catch (c) {
        Eh(n, c);
      }
    while (!0);
    if (Ld(), kt = l, Ps.current = o, zn !== null)
      throw Error(h(261));
    return kn = null, vr = 0, ir;
  }
  function Yy() {
    for (; zn !== null; )
      _h(zn);
  }
  function Wy() {
    for (; zn !== null && !Ci(); )
      _h(zn);
  }
  function _h(n) {
    var r = wh(n.alternate, n, xa);
    n.memoizedProps = n.pendingProps, r === null ? lp(n) : zn = r, ep.current = null;
  }
  function lp(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (l = Xd(l, r), l !== null) {
          l.flags &= 32767, zn = l;
          return;
        }
        if (n !== null)
          n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          ir = 6, zn = null;
          return;
        }
      } else if (l = Iy(l, r, xa), l !== null) {
        zn = l;
        return;
      }
      if (r = r.sibling, r !== null) {
        zn = r;
        return;
      }
      zn = r = n;
    } while (r !== null);
    ir === 0 && (ir = 5);
  }
  function Au(n, r, l) {
    var o = Wt, c = Pr.transition;
    try {
      Pr.transition = null, Wt = 1, Gy(n, r, l, o);
    } finally {
      Pr.transition = c, Wt = o;
    }
    return null;
  }
  function Gy(n, r, l, o) {
    do
      Po();
    while (Yl !== null);
    if (kt & 6)
      throw Error(h(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null)
      return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current)
      throw Error(h(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var p = l.lanes | l.childLanes;
    if (nd(n, p), n === kn && (zn = kn = null, vr = 0), !(l.subtreeFlags & 2064) && !(l.flags & 2064) || Il || (Il = !0, up(Ei, function() {
      return Po(), null;
    })), p = (l.flags & 15990) !== 0, l.subtreeFlags & 15990 || p) {
      p = Pr.transition, Pr.transition = null;
      var S = Wt;
      Wt = 1;
      var R = kt;
      kt |= 4, ep.current = null, vh(n, l), mh(l, n), Sc(pu), za = !!Ed, pu = Ed = null, n.current = l, yh(l), Ku(), kt = R, Wt = S, Pr.transition = p;
    } else
      n.current = l;
    if (Il && (Il = !1, Yl = n, sf = c), p = n.pendingLanes, p === 0 && (ki = null), rs(l.stateNode), Hr(n, Ht()), r !== null)
      for (o = n.onRecoverableError, l = 0; l < r.length; l++)
        c = r[l], o(c.value, {
          componentStack: c.stack,
          digest: c.digest
        });
    if (of)
      throw of = !1, n = ku, ku = null, n;
    return sf & 1 && n.tag !== 0 && Po(), p = n.pendingLanes, p & 1 ? n === cf ? Ao++ : (Ao = 0, cf = n) : Ao = 0, ua(), null;
  }
  function Po() {
    if (Yl !== null) {
      var n = no(sf), r = Pr.transition, l = Wt;
      try {
        if (Pr.transition = null, Wt = 16 > n ? 16 : n, Yl === null)
          var o = !1;
        else {
          if (n = Yl, Yl = null, sf = 0, kt & 6)
            throw Error(h(331));
          var c = kt;
          for (kt |= 4, Me = n.current; Me !== null; ) {
            var p = Me, S = p.child;
            if (Me.flags & 16) {
              var R = p.deletions;
              if (R !== null) {
                for (var k = 0; k < R.length; k++) {
                  var I = R[k];
                  for (Me = I; Me !== null; ) {
                    var ae = Me;
                    switch (ae.tag) {
                      case 0:
                      case 11:
                      case 15:
                        zs(8, ae, p);
                    }
                    var le = ae.child;
                    if (le !== null)
                      le.return = ae, Me = le;
                    else
                      for (; Me !== null; ) {
                        ae = Me;
                        var re = ae.sibling, we = ae.return;
                        if (Zd(ae), ae === I) {
                          Me = null;
                          break;
                        }
                        if (re !== null) {
                          re.return = we, Me = re;
                          break;
                        }
                        Me = we;
                      }
                  }
                }
                var Ne = p.alternate;
                if (Ne !== null) {
                  var Ue = Ne.child;
                  if (Ue !== null) {
                    Ne.child = null;
                    do {
                      var Bn = Ue.sibling;
                      Ue.sibling = null, Ue = Bn;
                    } while (Ue !== null);
                  }
                }
                Me = p;
              }
            }
            if (p.subtreeFlags & 2064 && S !== null)
              S.return = p, Me = S;
            else
              e:
                for (; Me !== null; ) {
                  if (p = Me, p.flags & 2048)
                    switch (p.tag) {
                      case 0:
                      case 11:
                      case 15:
                        zs(9, p, p.return);
                    }
                  var U = p.sibling;
                  if (U !== null) {
                    U.return = p.return, Me = U;
                    break e;
                  }
                  Me = p.return;
                }
          }
          var A = n.current;
          for (Me = A; Me !== null; ) {
            S = Me;
            var H = S.child;
            if (S.subtreeFlags & 2064 && H !== null)
              H.return = S, Me = H;
            else
              e:
                for (S = A; Me !== null; ) {
                  if (R = Me, R.flags & 2048)
                    try {
                      switch (R.tag) {
                        case 0:
                        case 11:
                        case 15:
                          Us(9, R);
                      }
                    } catch (Fe) {
                      Un(R, R.return, Fe);
                    }
                  if (R === S) {
                    Me = null;
                    break e;
                  }
                  var pe = R.sibling;
                  if (pe !== null) {
                    pe.return = R.return, Me = pe;
                    break e;
                  }
                  Me = R.return;
                }
          }
          if (kt = c, ua(), na && typeof na.onPostCommitFiberRoot == "function")
            try {
              na.onPostCommitFiberRoot(gl, n);
            } catch {
            }
          o = !0;
        }
        return o;
      } finally {
        Wt = l, Pr.transition = r;
      }
    }
    return !1;
  }
  function bh(n, r, l) {
    r = wo(l, r), r = oh(n, r, 1), n = jl(n, r, 1), r = jr(), n !== null && (Hi(n, 1, r), Hr(n, r));
  }
  function Un(n, r, l) {
    if (n.tag === 3)
      bh(n, n, l);
    else
      for (; r !== null; ) {
        if (r.tag === 3) {
          bh(r, n, l);
          break;
        } else if (r.tag === 1) {
          var o = r.stateNode;
          if (typeof r.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (ki === null || !ki.has(o))) {
            n = wo(l, n), n = ks(r, n, 1), r = jl(r, n, 1), n = jr(), r !== null && (Hi(r, 1, n), Hr(r, n));
            break;
          }
        }
        r = r.return;
      }
  }
  function Qy(n, r, l) {
    var o = n.pingCache;
    o !== null && o.delete(r), r = jr(), n.pingedLanes |= n.suspendedLanes & l, kn === n && (vr & l) === l && (ir === 4 || ir === 3 && (vr & 130023424) === vr && 500 > Ht() - tp ? Lu(n, 0) : No |= l), Hr(n, r);
  }
  function pf(n, r) {
    r === 0 && (n.mode & 1 ? (r = Sl, Sl <<= 1, !(Sl & 130023424) && (Sl = 4194304)) : r = 1);
    var l = jr();
    n = Xi(n, r), n !== null && (Hi(n, r, l), Hr(n, l));
  }
  function qy(n) {
    var r = n.memoizedState, l = 0;
    r !== null && (l = r.retryLane), pf(n, l);
  }
  function Xy(n, r) {
    var l = 0;
    switch (n.tag) {
      case 13:
        var o = n.stateNode, c = n.memoizedState;
        c !== null && (l = c.retryLane);
        break;
      case 19:
        o = n.stateNode;
        break;
      default:
        throw Error(h(314));
    }
    o !== null && o.delete(r), pf(n, l);
  }
  var wh;
  wh = function(n, r, l) {
    if (n !== null)
      if (n.memoizedProps !== r.pendingProps || An.current)
        qn = !0;
      else {
        if (!(n.lanes & l) && !(r.flags & 128))
          return qn = !1, Ji(n, r, l);
        qn = !!(n.flags & 131072);
      }
    else
      qn = !1, yn && r.flags & 1048576 && Dd(r, yo, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var o = r.type;
        zr(n, r), n = r.pendingProps;
        var c = ja(r, lt.current);
        ge(r, l), c = Bl(null, r, o, n, c, l);
        var p = _u();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, bn(o) ? (p = !0, Rc(r)) : p = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, zd(r), c.updater = Lc, r.stateNode = c, c._reactInternals = r, Ac(r, o, n, l), r = ch(null, r, o, !0, p, l)) : (r.tag = 0, yn && p && Tc(r), nr(null, r, c, l), r = r.child), r;
      case 16:
        o = r.elementType;
        e: {
          switch (zr(n, r), n = r.pendingProps, c = o._init, o = c(o._payload), r.type = o, c = r.tag = Zy(o), n = Ra(o, n), c) {
            case 0:
              r = Ro(null, r, o, n, l);
              break e;
            case 1:
              r = Id(null, r, o, n, l);
              break e;
            case 11:
              r = $l(null, r, o, n, l);
              break e;
            case 14:
              r = tf(null, r, o, Ra(o.type, n), l);
              break e;
          }
          throw Error(h(306, o, ""));
        }
        return r;
      case 0:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : Ra(o, c), Ro(n, r, o, c, l);
      case 1:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : Ra(o, c), Id(n, r, o, c, l);
      case 3:
        e: {
          if (fh(r), n === null)
            throw Error(h(387));
          o = r.pendingProps, p = r.memoizedState, c = p.element, tr(n, r), Fl(r, o, null, l);
          var S = r.memoizedState;
          if (o = S.element, p.isDehydrated)
            if (p = {
              element: o,
              isDehydrated: !1,
              cache: S.cache,
              pendingSuspenseBoundaries: S.pendingSuspenseBoundaries,
              transitions: S.transitions
            }, r.updateQueue.baseState = p, r.memoizedState = p, r.flags & 256) {
              c = wo(Error(h(423)), r), r = nf(n, r, o, l, c);
              break e;
            } else if (o !== c) {
              c = wo(Error(h(424)), r), r = nf(n, r, o, l, c);
              break e;
            } else
              for (ca = si(r.stateNode.containerInfo.firstChild), wa = r, yn = !0, Ba = null, l = lh(r, null, o, l), r.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Dn(), o === c) {
              r = wr(n, r, l);
              break e;
            }
            nr(n, r, o, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Ze(r), n === null && Dc(r), o = r.type, c = r.pendingProps, p = n !== null ? n.memoizedProps : null, S = c.children, gs(o, c) ? S = null : p !== null && gs(o, p) && (r.flags |= 32), bt(n, r), nr(n, r, S, l), r.child;
      case 6:
        return n === null && Dc(r), null;
      case 13:
        return Wd(n, r, l);
      case 4:
        return jd(r, r.stateNode.containerInfo), o = r.pendingProps, n === null ? r.child = So(r, null, o, l) : nr(n, r, o, l), r.child;
      case 11:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : Ra(o, c), $l(n, r, o, c, l);
      case 7:
        return nr(n, r, r.pendingProps, l), r.child;
      case 8:
        return nr(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return nr(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (o = r.type._context, c = r.pendingProps, p = r.memoizedProps, S = c.value, Jt(Ti, o._currentValue), o._currentValue = S, p !== null)
            if (Ua(p.value, S)) {
              if (p.children === c.children && !An.current) {
                r = wr(n, r, l);
                break e;
              }
            } else
              for (p = r.child, p !== null && (p.return = r); p !== null; ) {
                var R = p.dependencies;
                if (R !== null) {
                  S = p.child;
                  for (var k = R.firstContext; k !== null; ) {
                    if (k.context === o) {
                      if (p.tag === 1) {
                        k = Ki(-1, l & -l), k.tag = 2;
                        var I = p.updateQueue;
                        if (I !== null) {
                          I = I.shared;
                          var ae = I.pending;
                          ae === null ? k.next = k : (k.next = ae.next, ae.next = k), I.pending = k;
                        }
                      }
                      p.lanes |= l, k = p.alternate, k !== null && (k.lanes |= l), dr(p.return, l, r), R.lanes |= l;
                      break;
                    }
                    k = k.next;
                  }
                } else if (p.tag === 10)
                  S = p.type === r.type ? null : p.child;
                else if (p.tag === 18) {
                  if (S = p.return, S === null)
                    throw Error(h(341));
                  S.lanes |= l, R = S.alternate, R !== null && (R.lanes |= l), dr(S, l, r), S = p.sibling;
                } else
                  S = p.child;
                if (S !== null)
                  S.return = p;
                else
                  for (S = p; S !== null; ) {
                    if (S === r) {
                      S = null;
                      break;
                    }
                    if (p = S.sibling, p !== null) {
                      p.return = S.return, S = p;
                      break;
                    }
                    S = S.return;
                  }
                p = S;
              }
          nr(n, r, c.children, l), r = r.child;
        }
        return r;
      case 9:
        return c = r.type, o = r.pendingProps.children, ge(r, l), c = Hn(c), o = o(c), r.flags |= 1, nr(n, r, o, l), r.child;
      case 14:
        return o = r.type, c = Ra(o, r.pendingProps), c = Ra(o.type, c), tf(n, r, o, c, l);
      case 15:
        return pa(n, r, r.type, r.pendingProps, l);
      case 17:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : Ra(o, c), zr(n, r), r.tag = 1, bn(o) ? (n = !0, Rc(r)) : n = !1, ge(r, l), nh(r, o, c), Ac(r, o, c, l), ch(null, r, o, !0, n, l);
      case 19:
        return qd(n, r, l);
      case 22:
        return Tu(n, r, l);
    }
    throw Error(h(156, r.tag));
  };
  function up(n, r) {
    return dn(n, r);
  }
  function Ky(n, r, l, o) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ga(n, r, l, o) {
    return new Ky(n, r, l, o);
  }
  function op(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function Zy(n) {
    if (typeof n == "function")
      return op(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === En)
        return 11;
      if (n === Ft)
        return 14;
    }
    return 2;
  }
  function Gl(n, r) {
    var l = n.alternate;
    return l === null ? (l = Ga(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : {
      lanes: r.lanes,
      firstContext: r.firstContext
    }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function vf(n, r, l, o, c, p) {
    var S = 2;
    if (o = n, typeof n == "function")
      op(n) && (S = 1);
    else if (typeof n == "string")
      S = 5;
    else
      e:
        switch (n) {
          case nt:
            return zu(l.children, c, p, r);
          case an:
            S = 8, c |= 8;
            break;
          case Rn:
            return n = Ga(12, l, r, c | 2), n.elementType = Rn, n.lanes = p, n;
          case Xe:
            return n = Ga(13, l, r, c), n.elementType = Xe, n.lanes = p, n;
          case ct:
            return n = Ga(19, l, r, c), n.elementType = ct, n.lanes = p, n;
          case Oe:
            return Hs(l, c, p, r);
          default:
            if (typeof n == "object" && n !== null)
              switch (n.$$typeof) {
                case Xt:
                  S = 10;
                  break e;
                case jt:
                  S = 9;
                  break e;
                case En:
                  S = 11;
                  break e;
                case Ft:
                  S = 14;
                  break e;
                case Ot:
                  S = 16, o = null;
                  break e;
              }
            throw Error(h(130, n == null ? n : typeof n, ""));
        }
    return r = Ga(S, l, r, c), r.elementType = n, r.type = o, r.lanes = p, r;
  }
  function zu(n, r, l, o) {
    return n = Ga(7, n, o, r), n.lanes = l, n;
  }
  function Hs(n, r, l, o) {
    return n = Ga(22, n, o, r), n.elementType = Oe, n.lanes = l, n.stateNode = {
      isHidden: !1
    }, n;
  }
  function Bs(n, r, l) {
    return n = Ga(6, n, null, r), n.lanes = l, n;
  }
  function Uu(n, r, l) {
    return r = Ga(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = {
      containerInfo: n.containerInfo,
      pendingChildren: null,
      implementation: n.implementation
    }, r;
  }
  function Jy(n, r, l, o, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = to(0), this.expirationTimes = to(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = to(0), this.identifierPrefix = o, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function hf(n, r, l, o, c, p, S, R, k) {
    return n = new Jy(n, r, l, R, k), r === 1 ? (r = 1, p === !0 && (r |= 8)) : r = 0, p = Ga(3, null, null, r), n.current = p, p.stateNode = n, p.memoizedState = {
      element: o,
      isDehydrated: l,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null
    }, zd(p), n;
  }
  function Rh(n, r, l) {
    var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: yt,
      key: o == null ? null : "" + o,
      children: n,
      containerInfo: r,
      implementation: l
    };
  }
  function sp(n) {
    if (!n)
      return Ri;
    n = n._reactInternals;
    e: {
      if (ht(n) !== n || n.tag !== 1)
        throw Error(h(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (bn(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(h(171));
    }
    if (n.tag === 1) {
      var l = n.type;
      if (bn(l))
        return Es(n, l, r);
    }
    return r;
  }
  function Th(n, r, l, o, c, p, S, R, k) {
    return n = hf(l, o, !0, n, c, p, S, R, k), n.context = sp(null), l = n.current, o = jr(), c = Xn(l), p = Ki(o, c), p.callback = r ?? null, jl(l, p, c), n.current.lanes = c, Hi(n, c, o), Hr(n, o), n;
  }
  function Vs(n, r, l, o) {
    var c = r.current, p = jr(), S = Xn(c);
    return l = sp(l), r.context === null ? r.context = l : r.pendingContext = l, r = Ki(p, S), r.payload = {
      element: n
    }, o = o === void 0 ? null : o, o !== null && (r.callback = o), n = jl(c, r, S), n !== null && (Fr(n, c, S, p), Nc(n, c, S)), S;
  }
  function mf(n) {
    if (n = n.current, !n.child)
      return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function xh(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var l = n.retryLane;
      n.retryLane = l !== 0 && l < r ? l : r;
    }
  }
  function cp(n, r) {
    xh(n, r), (n = n.alternate) && xh(n, r);
  }
  function Dh() {
    return null;
  }
  var fp = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function yf(n) {
    this._internalRoot = n;
  }
  rl.prototype.render = yf.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null)
      throw Error(h(409));
    Vs(n, r, null, null);
  }, rl.prototype.unmount = yf.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Wl(function() {
        Vs(null, n, null, null);
      }), r[Qi] = null;
    }
  };
  function rl(n) {
    this._internalRoot = n;
  }
  rl.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = ao();
      n = {
        blockedOn: null,
        target: n,
        priority: r
      };
      for (var l = 0; l < Zt.length && r !== 0 && r < Zt[l].priority; l++)
        ;
      Zt.splice(l, 0, n), l === 0 && dc(n);
    }
  };
  function dp(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function gf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function Oh() {
  }
  function eg(n, r, l, o, c) {
    if (c) {
      if (typeof o == "function") {
        var p = o;
        o = function() {
          var I = mf(S);
          p.call(I);
        };
      }
      var S = Th(r, o, n, 0, null, !1, !1, "", Oh);
      return n._reactRootContainer = S, n[Qi] = S.current, ho(n.nodeType === 8 ? n.parentNode : n), Wl(), S;
    }
    for (; c = n.lastChild; )
      n.removeChild(c);
    if (typeof o == "function") {
      var R = o;
      o = function() {
        var I = mf(k);
        R.call(I);
      };
    }
    var k = hf(n, 0, !1, null, null, !1, !1, "", Oh);
    return n._reactRootContainer = k, n[Qi] = k.current, ho(n.nodeType === 8 ? n.parentNode : n), Wl(function() {
      Vs(r, k, l, o);
    }), k;
  }
  function Sf(n, r, l, o, c) {
    var p = l._reactRootContainer;
    if (p) {
      var S = p;
      if (typeof c == "function") {
        var R = c;
        c = function() {
          var k = mf(S);
          R.call(k);
        };
      }
      Vs(r, S, n, c);
    } else
      S = eg(l, r, n, c, o);
    return mf(S);
  }
  lu = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = ai(r.pendingLanes);
          l !== 0 && (_i(r, l | 1), Hr(r, Ht()), !(kt & 6) && (Lo = Ht() + 500, ua()));
        }
        break;
      case 13:
        Wl(function() {
          var o = Xi(n, 1);
          if (o !== null) {
            var c = jr();
            Fr(o, n, 1, c);
          }
        }), cp(n, 1);
    }
  }, ro = function(n) {
    if (n.tag === 13) {
      var r = Xi(n, 134217728);
      if (r !== null) {
        var l = jr();
        Fr(r, n, 134217728, l);
      }
      cp(n, 134217728);
    }
  }, Bt = function(n) {
    if (n.tag === 13) {
      var r = Xn(n), l = Xi(n, r);
      if (l !== null) {
        var o = jr();
        Fr(l, n, r, o);
      }
      cp(n, r);
    }
  }, ao = function() {
    return Wt;
  }, io = function(n, r) {
    var l = Wt;
    try {
      return Wt = n, r();
    } finally {
      Wt = l;
    }
  }, Ce = function(n, r, l) {
    switch (r) {
      case "input":
        if (_n(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; )
            l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var o = l[r];
            if (o !== n && o.form === n.form) {
              var c = Ye(o);
              if (!c)
                throw Error(h(90));
              jn(o), _n(o, c);
            }
          }
        }
        break;
      case "textarea":
        Br(n, l);
        break;
      case "select":
        r = l.value, r != null && Yn(n, !!l.multiple, r, !1);
    }
  }, er = Uo, Fi = Wl;
  var tg = {
    usingClientEntryPoint: !1,
    Events: [
      Cs,
      mo,
      Ye,
      Dt,
      Kt,
      Uo
    ]
  }, jo = {
    findFiberByHostInstance: Pa,
    bundleType: 0,
    version: "18.2.0",
    rendererPackageName: "react-dom"
  }, ng = {
    bundleType: jo.bundleType,
    version: jo.version,
    rendererPackageName: jo.rendererPackageName,
    rendererConfig: jo.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: mt.ReactCurrentDispatcher,
    findHostInstanceByFiber: function(n) {
      return n = Gn(n), n === null ? null : n.stateNode;
    },
    findFiberByHostInstance: jo.findFiberByHostInstance || Dh,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.2.0-next-9e3b772b8-20220608"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Cf = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Cf.isDisabled && Cf.supportsFiber)
      try {
        gl = Cf.inject(ng), na = Cf;
      } catch {
      }
  }
  return Ja.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = tg, Ja.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!dp(r))
      throw Error(h(200));
    return Rh(n, r, null, l);
  }, Ja.createRoot = function(n, r) {
    if (!dp(n))
      throw Error(h(299));
    var l = !1, o = "", c = fp;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = hf(n, 1, !1, null, null, l, !1, o, c), n[Qi] = r.current, ho(n.nodeType === 8 ? n.parentNode : n), new yf(r);
  }, Ja.findDOMNode = function(n) {
    if (n == null)
      return null;
    if (n.nodeType === 1)
      return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(h(188)) : (n = Object.keys(n).join(","), Error(h(268, n)));
    return n = Gn(r), n = n === null ? null : n.stateNode, n;
  }, Ja.flushSync = function(n) {
    return Wl(n);
  }, Ja.hydrate = function(n, r, l) {
    if (!gf(r))
      throw Error(h(200));
    return Sf(null, n, r, !0, l);
  }, Ja.hydrateRoot = function(n, r, l) {
    if (!dp(n))
      throw Error(h(405));
    var o = l != null && l.hydratedSources || null, c = !1, p = "", S = fp;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (p = l.identifierPrefix), l.onRecoverableError !== void 0 && (S = l.onRecoverableError)), r = Th(r, null, n, 1, l ?? null, c, !1, p, S), n[Qi] = r.current, ho(n), o)
      for (n = 0; n < o.length; n++)
        l = o[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [
          l,
          c
        ] : r.mutableSourceEagerHydrationData.push(l, c);
    return new rl(r);
  }, Ja.render = function(n, r, l) {
    if (!gf(r))
      throw Error(h(200));
    return Sf(null, n, r, !1, l);
  }, Ja.unmountComponentAtNode = function(n) {
    if (!gf(n))
      throw Error(h(40));
    return n._reactRootContainer ? (Wl(function() {
      Sf(null, null, n, !1, function() {
        n._reactRootContainer = null, n[Qi] = null;
      });
    }), !0) : !1;
  }, Ja.unstable_batchedUpdates = Uo, Ja.unstable_renderSubtreeIntoContainer = function(n, r, l, o) {
    if (!gf(l))
      throw Error(h(200));
    if (n == null || n._reactInternals === void 0)
      throw Error(h(38));
    return Sf(n, r, l, !1, o);
  }, Ja.version = "18.2.0-next-9e3b772b8-20220608", Ja;
}
var ei = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var d1;
function lk() {
  return d1 || (d1 = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var g = yv(), f = g1(), h = g.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, _ = !1;
    function w(e) {
      _ = e;
    }
    function M(e) {
      if (!_) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        me("warn", e, a);
      }
    }
    function C(e) {
      if (!_) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        me("error", e, a);
      }
    }
    function me(e, t, a) {
      {
        var i = h.ReactDebugCurrentFrame, u = i.getStackAddendum();
        u !== "" && (t += "%s", a = a.concat([
          u
        ]));
        var s = a.map(function(d) {
          return String(d);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var J = 0, ie = 1, _e = 2, ee = 3, de = 4, ve = 5, ke = 6, ot = 7, st = 8, It = 9, $e = 10, He = 11, mt = 12, je = 13, yt = 14, nt = 15, an = 16, Rn = 17, Xt = 18, jt = 19, En = 21, Xe = 22, ct = 23, Ft = 24, Ot = 25, Oe = !0, se = !1, Pe = !1, O = !1, K = !1, q = !0, We = !1, Je = !1, Ve = !0, gt = !0, wt = !0, vt = /* @__PURE__ */ new Set(), Yt = {}, vn = {};
    function Zn(e, t) {
      jn(e, t), jn(e + "Capture", t);
    }
    function jn(e, t) {
      Yt[e] && C("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), Yt[e] = t;
      {
        var a = e.toLowerCase();
        vn[a] = e, e === "onDoubleClick" && (vn.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        vt.add(t[i]);
    }
    var cn = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", In = Object.prototype.hasOwnProperty;
    function Tn(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function Nn(e) {
      try {
        return _n(e), !1;
      } catch {
        return !0;
      }
    }
    function _n(e) {
      return "" + e;
    }
    function yr(e, t) {
      if (Nn(e))
        return C("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Tn(e)), _n(e);
    }
    function gr(e) {
      if (Nn(e))
        return C("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Tn(e)), _n(e);
    }
    function Fn(e, t) {
      if (Nn(e))
        return C("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Tn(e)), _n(e);
    }
    function Yn(e, t) {
      if (Nn(e))
        return C("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Tn(e)), _n(e);
    }
    function Lr(e) {
      if (Nn(e))
        return C("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", Tn(e)), _n(e);
    }
    function or(e) {
      if (Nn(e))
        return C("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", Tn(e)), _n(e);
    }
    var Br = 0, Jn = 1, Wn = 2, hn = 3, Sr = 4, La = 5, Cr = 6, T = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", N = T + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", F = new RegExp("^[" + T + "][" + N + "]*$"), Z = {}, he = {};
    function St(e) {
      return In.call(he, e) ? !0 : In.call(Z, e) ? !1 : F.test(e) ? (he[e] = !0, !0) : (Z[e] = !0, C("Invalid attribute name: `%s`", e), !1);
    }
    function Ct(e, t, a) {
      return t !== null ? t.type === Br : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function Ge(e, t, a, i) {
      if (a !== null && a.type === Br)
        return !1;
      switch (typeof t) {
        case "function":
        case "symbol":
          return !0;
        case "boolean": {
          if (i)
            return !1;
          if (a !== null)
            return !a.acceptsBooleans;
          var u = e.toLowerCase().slice(0, 5);
          return u !== "data-" && u !== "aria-";
        }
        default:
          return !1;
      }
    }
    function te(e, t, a, i) {
      if (t === null || typeof t > "u" || Ge(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case hn:
            return !t;
          case Sr:
            return t === !1;
          case La:
            return isNaN(t);
          case Cr:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function Ce(e) {
      return ce.hasOwnProperty(e) ? ce[e] : null;
    }
    function oe(e, t, a, i, u, s, d) {
      this.acceptsBooleans = t === Wn || t === hn || t === Sr, this.attributeName = i, this.attributeNamespace = u, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = d;
    }
    var ce = {}, it = [
      "children",
      "dangerouslySetInnerHTML",
      // elements (not just inputs). Now that ReactDOMInput assigns to the
      // defaultValue property -- do we need this?
      "defaultValue",
      "defaultChecked",
      "innerHTML",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
      "style"
    ];
    it.forEach(function(e) {
      ce[e] = new oe(e, Br, !1, e, null, !1, !1);
    }), [
      [
        "acceptCharset",
        "accept-charset"
      ],
      [
        "className",
        "class"
      ],
      [
        "htmlFor",
        "for"
      ],
      [
        "httpEquiv",
        "http-equiv"
      ]
    ].forEach(function(e) {
      var t = e[0], a = e[1];
      ce[t] = new oe(t, Jn, !1, a, null, !1, !1);
    }), [
      "contentEditable",
      "draggable",
      "spellCheck",
      "value"
    ].forEach(function(e) {
      ce[e] = new oe(e, Wn, !1, e.toLowerCase(), null, !1, !1);
    }), [
      "autoReverse",
      "externalResourcesRequired",
      "focusable",
      "preserveAlpha"
    ].forEach(function(e) {
      ce[e] = new oe(e, Wn, !1, e, null, !1, !1);
    }), [
      "allowFullScreen",
      "async",
      // on the client side because the browsers are inconsistent. Instead we call focus().
      "autoFocus",
      "autoPlay",
      "controls",
      "default",
      "defer",
      "disabled",
      "disablePictureInPicture",
      "disableRemotePlayback",
      "formNoValidate",
      "hidden",
      "loop",
      "noModule",
      "noValidate",
      "open",
      "playsInline",
      "readOnly",
      "required",
      "reversed",
      "scoped",
      "seamless",
      "itemScope"
    ].forEach(function(e) {
      ce[e] = new oe(e, hn, !1, e.toLowerCase(), null, !1, !1);
    }), [
      "checked",
      // disabled with `removeAttribute`. We have special logic for handling this.
      "multiple",
      "muted",
      "selected"
      // NOTE: if you add a camelCased prop to this list,
    ].forEach(function(e) {
      ce[e] = new oe(e, hn, !0, e, null, !1, !1);
    }), [
      "capture",
      "download"
      // NOTE: if you add a camelCased prop to this list,
    ].forEach(function(e) {
      ce[e] = new oe(e, Sr, !1, e, null, !1, !1);
    }), [
      "cols",
      "rows",
      "size",
      "span"
      // NOTE: if you add a camelCased prop to this list,
    ].forEach(function(e) {
      ce[e] = new oe(e, Cr, !1, e, null, !1, !1);
    }), [
      "rowSpan",
      "start"
    ].forEach(function(e) {
      ce[e] = new oe(e, La, !1, e.toLowerCase(), null, !1, !1);
    });
    var Dt = /[\-\:]([a-z])/g, Kt = function(e) {
      return e[1].toUpperCase();
    };
    [
      "accent-height",
      "alignment-baseline",
      "arabic-form",
      "baseline-shift",
      "cap-height",
      "clip-path",
      "clip-rule",
      "color-interpolation",
      "color-interpolation-filters",
      "color-profile",
      "color-rendering",
      "dominant-baseline",
      "enable-background",
      "fill-opacity",
      "fill-rule",
      "flood-color",
      "flood-opacity",
      "font-family",
      "font-size",
      "font-size-adjust",
      "font-stretch",
      "font-style",
      "font-variant",
      "font-weight",
      "glyph-name",
      "glyph-orientation-horizontal",
      "glyph-orientation-vertical",
      "horiz-adv-x",
      "horiz-origin-x",
      "image-rendering",
      "letter-spacing",
      "lighting-color",
      "marker-end",
      "marker-mid",
      "marker-start",
      "overline-position",
      "overline-thickness",
      "paint-order",
      "panose-1",
      "pointer-events",
      "rendering-intent",
      "shape-rendering",
      "stop-color",
      "stop-opacity",
      "strikethrough-position",
      "strikethrough-thickness",
      "stroke-dasharray",
      "stroke-dashoffset",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-miterlimit",
      "stroke-opacity",
      "stroke-width",
      "text-anchor",
      "text-decoration",
      "text-rendering",
      "underline-position",
      "underline-thickness",
      "unicode-bidi",
      "unicode-range",
      "units-per-em",
      "v-alphabetic",
      "v-hanging",
      "v-ideographic",
      "v-mathematical",
      "vector-effect",
      "vert-adv-y",
      "vert-origin-x",
      "vert-origin-y",
      "word-spacing",
      "writing-mode",
      "xmlns:xlink",
      "x-height"
      // NOTE: if you add a camelCased prop to this list,
    ].forEach(function(e) {
      var t = e.replace(Dt, Kt);
      ce[t] = new oe(t, Jn, !1, e, null, !1, !1);
    }), [
      "xlink:actuate",
      "xlink:arcrole",
      "xlink:role",
      "xlink:show",
      "xlink:title",
      "xlink:type"
      // NOTE: if you add a camelCased prop to this list,
    ].forEach(function(e) {
      var t = e.replace(Dt, Kt);
      ce[t] = new oe(t, Jn, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
    }), [
      "xml:base",
      "xml:lang",
      "xml:space"
      // NOTE: if you add a camelCased prop to this list,
    ].forEach(function(e) {
      var t = e.replace(Dt, Kt);
      ce[t] = new oe(t, Jn, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
    }), [
      "tabIndex",
      "crossOrigin"
    ].forEach(function(e) {
      ce[e] = new oe(e, Jn, !1, e.toLowerCase(), null, !1, !1);
    });
    var er = "xlinkHref";
    ce[er] = new oe("xlinkHref", Jn, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), [
      "src",
      "href",
      "action",
      "formAction"
    ].forEach(function(e) {
      ce[e] = new oe(e, Jn, !1, e.toLowerCase(), null, !0, !0);
    });
    var Fi = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, ni = !1;
    function mi(e) {
      !ni && Fi.test(e) && (ni = !0, C("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function Sa(e, t, a, i) {
      if (i.mustUseProperty) {
        var u = i.propertyName;
        return e[u];
      } else {
        yr(a, t), i.sanitizeURL && mi("" + a);
        var s = i.attributeName, d = null;
        if (i.type === Sr) {
          if (e.hasAttribute(s)) {
            var v = e.getAttribute(s);
            return v === "" ? !0 : te(t, a, i, !1) ? v : v === "" + a ? a : v;
          }
        } else if (e.hasAttribute(s)) {
          if (te(t, a, i, !1))
            return e.getAttribute(s);
          if (i.type === hn)
            return a;
          d = e.getAttribute(s);
        }
        return te(t, a, i, !1) ? d === null ? a : d : d === "" + a ? a : d;
      }
    }
    function yi(e, t, a, i) {
      {
        if (!St(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var u = e.getAttribute(t);
        return yr(a, t), u === "" + a ? a : u;
      }
    }
    function Ca(e, t, a, i) {
      var u = Ce(t);
      if (!Ct(t, u, i)) {
        if (te(t, a, u, i) && (a = null), i || u === null) {
          if (St(t)) {
            var s = t;
            a === null ? e.removeAttribute(s) : (yr(a, t), e.setAttribute(s, "" + a));
          }
          return;
        }
        var d = u.mustUseProperty;
        if (d) {
          var v = u.propertyName;
          if (a === null) {
            var m = u.type;
            e[v] = m === hn ? !1 : "";
          } else
            e[v] = a;
          return;
        }
        var E = u.attributeName, b = u.attributeNamespace;
        if (a === null)
          e.removeAttribute(E);
        else {
          var z = u.type, L;
          z === hn || z === Sr && a === !0 ? L = "" : (yr(a, E), L = "" + a, u.sanitizeURL && mi(L.toString())), b ? e.setAttributeNS(b, E, L) : e.setAttribute(E, L);
        }
      }
    }
    var gi = Symbol.for("react.element"), Vr = Symbol.for("react.portal"), Ea = Symbol.for("react.fragment"), Si = Symbol.for("react.strict_mode"), D = Symbol.for("react.profiler"), ne = Symbol.for("react.provider"), ye = Symbol.for("react.context"), Te = Symbol.for("react.forward_ref"), ht = Symbol.for("react.suspense"), Lt = Symbol.for("react.suspense_list"), Et = Symbol.for("react.memo"), Qe = Symbol.for("react.lazy"), Gn = Symbol.for("react.scope"), fn = Symbol.for("react.debug_trace_mode"), dn = Symbol.for("react.offscreen"), Er = Symbol.for("react.legacy_hidden"), Ci = Symbol.for("react.cache"), Ku = Symbol.for("react.tracing_marker"), Ht = Symbol.iterator, td = "@@iterator";
    function ri(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Ht && e[Ht] || e[td];
      return typeof t == "function" ? t : null;
    }
    var Rt = Object.assign, Ei = 0, yl, Zu, gl, na, rs, $r, as;
    function is() {
    }
    is.__reactDisabledLog = !0;
    function cc() {
      {
        if (Ei === 0) {
          yl = console.log, Zu = console.info, gl = console.warn, na = console.error, rs = console.group, $r = console.groupCollapsed, as = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: is,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        Ei++;
      }
    }
    function Ju() {
      {
        if (Ei--, Ei === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Rt({}, e, {
              value: yl
            }),
            info: Rt({}, e, {
              value: Zu
            }),
            warn: Rt({}, e, {
              value: gl
            }),
            error: Rt({}, e, {
              value: na
            }),
            group: Rt({}, e, {
              value: rs
            }),
            groupCollapsed: Rt({}, e, {
              value: $r
            }),
            groupEnd: Rt({}, e, {
              value: as
            })
          });
        }
        Ei < 0 && C("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Sl = h.ReactCurrentDispatcher, ai;
    function Ir(e, t, a) {
      {
        if (ai === void 0)
          try {
            throw Error();
          } catch (u) {
            var i = u.stack.trim().match(/\n( *(at )?)/);
            ai = i && i[1] || "";
          }
        return `
` + ai + e;
      }
    }
    var Cl = !1, El;
    {
      var _l = typeof WeakMap == "function" ? WeakMap : Map;
      El = new _l();
    }
    function eo(e, t) {
      if (!e || Cl)
        return "";
      {
        var a = El.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      Cl = !0;
      var u = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var s;
      s = Sl.current, Sl.current = null, cc();
      try {
        if (t) {
          var d = function() {
            throw Error();
          };
          if (Object.defineProperty(d.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(d, []);
            } catch ($) {
              i = $;
            }
            Reflect.construct(e, [], d);
          } else {
            try {
              d.call();
            } catch ($) {
              i = $;
            }
            e.call(d.prototype);
          }
        } else {
          try {
            throw Error();
          } catch ($) {
            i = $;
          }
          e();
        }
      } catch ($) {
        if ($ && i && typeof $.stack == "string") {
          for (var v = $.stack.split(`
`), m = i.stack.split(`
`), E = v.length - 1, b = m.length - 1; E >= 1 && b >= 0 && v[E] !== m[b]; )
            b--;
          for (; E >= 1 && b >= 0; E--, b--)
            if (v[E] !== m[b]) {
              if (E !== 1 || b !== 1)
                do
                  if (E--, b--, b < 0 || v[E] !== m[b]) {
                    var z = `
` + v[E].replace(" at new ", " at ");
                    return e.displayName && z.includes("<anonymous>") && (z = z.replace("<anonymous>", e.displayName)), typeof e == "function" && El.set(e, z), z;
                  }
                while (E >= 1 && b >= 0);
              break;
            }
        }
      } finally {
        Cl = !1, Sl.current = s, Ju(), Error.prepareStackTrace = u;
      }
      var L = e ? e.displayName || e.name : "", B = L ? Ir(L) : "";
      return typeof e == "function" && El.set(e, B), B;
    }
    function to(e, t, a) {
      return eo(e, !0);
    }
    function Hi(e, t, a) {
      return eo(e, !1);
    }
    function nd(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function _i(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return eo(e, nd(e));
      if (typeof e == "string")
        return Ir(e);
      switch (e) {
        case ht:
          return Ir("Suspense");
        case Lt:
          return Ir("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case Te:
            return Hi(e.render);
          case Et:
            return _i(e.type, t, a);
          case Qe: {
            var i = e, u = i._payload, s = i._init;
            try {
              return _i(s(u), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function Wt(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case ve:
          return Ir(e.type);
        case an:
          return Ir("Lazy");
        case je:
          return Ir("Suspense");
        case jt:
          return Ir("SuspenseList");
        case J:
        case _e:
        case nt:
          return Hi(e.type);
        case He:
          return Hi(e.type.render);
        case ie:
          return to(e.type);
        default:
          return "";
      }
    }
    function no(e) {
      try {
        var t = "", a = e;
        do
          t += Wt(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function lu(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var u = t.displayName || t.name || "";
      return u !== "" ? a + "(" + u + ")" : a;
    }
    function ro(e) {
      return e.displayName || "Context";
    }
    function Bt(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && C("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case Ea:
          return "Fragment";
        case Vr:
          return "Portal";
        case D:
          return "Profiler";
        case Si:
          return "StrictMode";
        case ht:
          return "Suspense";
        case Lt:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case ye:
            var t = e;
            return ro(t) + ".Consumer";
          case ne:
            var a = e;
            return ro(a._context) + ".Provider";
          case Te:
            return lu(e, e.render, "ForwardRef");
          case Et:
            var i = e.displayName || null;
            return i !== null ? i : Bt(e.type) || "Memo";
          case Qe: {
            var u = e, s = u._payload, d = u._init;
            try {
              return Bt(d(s));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function ao(e, t, a) {
      var i = t.displayName || t.name || "";
      return e.displayName || (i !== "" ? a + "(" + i + ")" : a);
    }
    function io(e) {
      return e.displayName || "Context";
    }
    function ft(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case Ft:
          return "Cache";
        case It:
          var i = a;
          return io(i) + ".Consumer";
        case $e:
          var u = a;
          return io(u._context) + ".Provider";
        case Xt:
          return "DehydratedFragment";
        case He:
          return ao(a, a.render, "ForwardRef");
        case ot:
          return "Fragment";
        case ve:
          return a;
        case de:
          return "Portal";
        case ee:
          return "Root";
        case ke:
          return "Text";
        case an:
          return Bt(a);
        case st:
          return a === Si ? "StrictMode" : "Mode";
        case Xe:
          return "Offscreen";
        case mt:
          return "Profiler";
        case En:
          return "Scope";
        case je:
          return "Suspense";
        case jt:
          return "SuspenseList";
        case Ot:
          return "TracingMarker";
        case ie:
        case J:
        case Rn:
        case _e:
        case yt:
        case nt:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var uu = h.ReactDebugCurrentFrame, xn = null, ra = !1;
    function Yr() {
      {
        if (xn === null)
          return null;
        var e = xn._debugOwner;
        if (e !== null && typeof e < "u")
          return ft(e);
      }
      return null;
    }
    function bl() {
      return xn === null ? "" : no(xn);
    }
    function Ln() {
      uu.getCurrentStack = null, xn = null, ra = !1;
    }
    function Zt(e) {
      uu.getCurrentStack = e === null ? null : bl, xn = e, ra = !1;
    }
    function fc() {
      return xn;
    }
    function aa(e) {
      ra = e;
    }
    function sr(e) {
      return "" + e;
    }
    function bi(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return or(e), e;
        default:
          return "";
      }
    }
    var dc = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function Bi(e, t) {
      dc[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || C("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || C("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function wl(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function pc(e) {
      return e._valueTracker;
    }
    function Aa(e) {
      e._valueTracker = null;
    }
    function Rl(e) {
      var t = "";
      return e && (wl(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function Tl(e) {
      var t = wl(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      or(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var u = a.get, s = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return u.call(this);
          },
          set: function(v) {
            or(v), i = "" + v, s.call(this, v);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var d = {
          getValue: function() {
            return i;
          },
          setValue: function(v) {
            or(v), i = "" + v;
          },
          stopTracking: function() {
            Aa(e), delete e[t];
          }
        };
        return d;
      }
    }
    function za(e) {
      pc(e) || (e._valueTracker = Tl(e));
    }
    function lo(e) {
      if (!e)
        return !1;
      var t = pc(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = Rl(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function xl(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var Dl = !1, ou = !1, uo = !1, ls = !1;
    function ii(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function y(e, t) {
      var a = e, i = t.checked, u = Rt({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return u;
    }
    function x(e, t) {
      Bi("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !ou && (C("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Yr() || "A component", t.type), ou = !0), t.value !== void 0 && t.defaultValue !== void 0 && !Dl && (C("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Yr() || "A component", t.type), Dl = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: bi(t.value != null ? t.value : i),
        controlled: ii(t)
      };
    }
    function V(e, t) {
      var a = e, i = t.checked;
      i != null && Ca(a, "checked", i, !1);
    }
    function Y(e, t) {
      var a = e;
      {
        var i = ii(t);
        !a._wrapperState.controlled && i && !ls && (C("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), ls = !0), a._wrapperState.controlled && !i && !uo && (C("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), uo = !0);
      }
      V(e, t);
      var u = bi(t.value), s = t.type;
      if (u != null)
        s === "number" ? (u === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != u) && (a.value = sr(u)) : a.value !== sr(u) && (a.value = sr(u));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? Ke(a, t.type, u) : t.hasOwnProperty("defaultValue") && Ke(a, t.type, bi(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function fe(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var u = t.type, s = u === "submit" || u === "reset";
        if (s && (t.value === void 0 || t.value === null))
          return;
        var d = sr(i._wrapperState.initialValue);
        a || d !== i.value && (i.value = d), i.defaultValue = d;
      }
      var v = i.name;
      v !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, v !== "" && (i.name = v);
    }
    function et(e, t) {
      var a = e;
      Y(a, t), Ee(a, t);
    }
    function Ee(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        yr(a, "name");
        for (var u = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), s = 0; s < u.length; s++) {
          var d = u[s];
          if (!(d === e || d.form !== e.form)) {
            var v = Wh(d);
            if (!v)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            lo(d), Y(d, v);
          }
        }
      }
    }
    function Ke(e, t, a) {
      (t !== "number" || xl(e.ownerDocument) !== e) && (a == null ? e.defaultValue = sr(e._wrapperState.initialValue) : e.defaultValue !== sr(a) && (e.defaultValue = sr(a)));
    }
    var Tt = !1, Vt = !1, ln = !1;
    function tn(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? g.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || Vt || (Vt = !0, C("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (ln || (ln = !0, C("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !Tt && (C("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), Tt = !0);
    }
    function un(e, t) {
      t.value != null && e.setAttribute("value", sr(bi(t.value)));
    }
    var pn = Array.isArray;
    function Nt(e) {
      return pn(e);
    }
    var Vi;
    Vi = !1;
    function oo() {
      var e = Yr();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var us = [
      "value",
      "defaultValue"
    ];
    function rd(e) {
      {
        Bi("select", e);
        for (var t = 0; t < us.length; t++) {
          var a = us[t];
          if (e[a] != null) {
            var i = Nt(e[a]);
            e.multiple && !i ? C("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, oo()) : !e.multiple && i && C("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, oo());
          }
        }
      }
    }
    function li(e, t, a, i) {
      var u = e.options;
      if (t) {
        for (var s = a, d = {}, v = 0; v < s.length; v++)
          d["$" + s[v]] = !0;
        for (var m = 0; m < u.length; m++) {
          var E = d.hasOwnProperty("$" + u[m].value);
          u[m].selected !== E && (u[m].selected = E), E && i && (u[m].defaultSelected = !0);
        }
      } else {
        for (var b = sr(bi(a)), z = null, L = 0; L < u.length; L++) {
          if (u[L].value === b) {
            u[L].selected = !0, i && (u[L].defaultSelected = !0);
            return;
          }
          z === null && !u[L].disabled && (z = u[L]);
        }
        z !== null && (z.selected = !0);
      }
    }
    function os(e, t) {
      return Rt({}, t, {
        value: void 0
      });
    }
    function ss(e, t) {
      var a = e;
      rd(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !Vi && (C("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), Vi = !0);
    }
    function ad(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? li(a, !!t.multiple, i, !1) : t.defaultValue != null && li(a, !!t.multiple, t.defaultValue, !0);
    }
    function by(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var u = t.value;
      u != null ? li(a, !!t.multiple, u, !1) : i !== !!t.multiple && (t.defaultValue != null ? li(a, !!t.multiple, t.defaultValue, !0) : li(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function wy(e, t) {
      var a = e, i = t.value;
      i != null && li(a, !!t.multiple, i, !1);
    }
    var id = !1;
    function ld(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = Rt({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: sr(a._wrapperState.initialValue)
      });
      return i;
    }
    function Ev(e, t) {
      var a = e;
      Bi("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !id && (C("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Yr() || "A component"), id = !0);
      var i = t.value;
      if (i == null) {
        var u = t.children, s = t.defaultValue;
        if (u != null) {
          C("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (Nt(u)) {
              if (u.length > 1)
                throw new Error("<textarea> can only have at most one child.");
              u = u[0];
            }
            s = u;
          }
        }
        s == null && (s = ""), i = s;
      }
      a._wrapperState = {
        initialValue: bi(i)
      };
    }
    function _v(e, t) {
      var a = e, i = bi(t.value), u = bi(t.defaultValue);
      if (i != null) {
        var s = sr(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      u != null && (a.defaultValue = sr(u));
    }
    function bv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function ud(e, t) {
      _v(e, t);
    }
    var $i = "http://www.w3.org/1999/xhtml", Ry = "http://www.w3.org/1998/Math/MathML", od = "http://www.w3.org/2000/svg";
    function vc(e) {
      switch (e) {
        case "svg":
          return od;
        case "math":
          return Ry;
        default:
          return $i;
      }
    }
    function sd(e, t) {
      return e == null || e === $i ? vc(t) : e === od && t === "foreignObject" ? $i : e;
    }
    var Ty = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, u) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, u);
        });
      } : e;
    }, hc, wv = Ty(function(e, t) {
      if (e.namespaceURI === od && !("innerHTML" in e)) {
        hc = hc || document.createElement("div"), hc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = hc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), ia = 1, Ii = 3, Qn = 8, ui = 9, su = 11, mc = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === Ii) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, Rv = {
      animation: [
        "animationDelay",
        "animationDirection",
        "animationDuration",
        "animationFillMode",
        "animationIterationCount",
        "animationName",
        "animationPlayState",
        "animationTimingFunction"
      ],
      background: [
        "backgroundAttachment",
        "backgroundClip",
        "backgroundColor",
        "backgroundImage",
        "backgroundOrigin",
        "backgroundPositionX",
        "backgroundPositionY",
        "backgroundRepeat",
        "backgroundSize"
      ],
      backgroundPosition: [
        "backgroundPositionX",
        "backgroundPositionY"
      ],
      border: [
        "borderBottomColor",
        "borderBottomStyle",
        "borderBottomWidth",
        "borderImageOutset",
        "borderImageRepeat",
        "borderImageSlice",
        "borderImageSource",
        "borderImageWidth",
        "borderLeftColor",
        "borderLeftStyle",
        "borderLeftWidth",
        "borderRightColor",
        "borderRightStyle",
        "borderRightWidth",
        "borderTopColor",
        "borderTopStyle",
        "borderTopWidth"
      ],
      borderBlockEnd: [
        "borderBlockEndColor",
        "borderBlockEndStyle",
        "borderBlockEndWidth"
      ],
      borderBlockStart: [
        "borderBlockStartColor",
        "borderBlockStartStyle",
        "borderBlockStartWidth"
      ],
      borderBottom: [
        "borderBottomColor",
        "borderBottomStyle",
        "borderBottomWidth"
      ],
      borderColor: [
        "borderBottomColor",
        "borderLeftColor",
        "borderRightColor",
        "borderTopColor"
      ],
      borderImage: [
        "borderImageOutset",
        "borderImageRepeat",
        "borderImageSlice",
        "borderImageSource",
        "borderImageWidth"
      ],
      borderInlineEnd: [
        "borderInlineEndColor",
        "borderInlineEndStyle",
        "borderInlineEndWidth"
      ],
      borderInlineStart: [
        "borderInlineStartColor",
        "borderInlineStartStyle",
        "borderInlineStartWidth"
      ],
      borderLeft: [
        "borderLeftColor",
        "borderLeftStyle",
        "borderLeftWidth"
      ],
      borderRadius: [
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
        "borderTopLeftRadius",
        "borderTopRightRadius"
      ],
      borderRight: [
        "borderRightColor",
        "borderRightStyle",
        "borderRightWidth"
      ],
      borderStyle: [
        "borderBottomStyle",
        "borderLeftStyle",
        "borderRightStyle",
        "borderTopStyle"
      ],
      borderTop: [
        "borderTopColor",
        "borderTopStyle",
        "borderTopWidth"
      ],
      borderWidth: [
        "borderBottomWidth",
        "borderLeftWidth",
        "borderRightWidth",
        "borderTopWidth"
      ],
      columnRule: [
        "columnRuleColor",
        "columnRuleStyle",
        "columnRuleWidth"
      ],
      columns: [
        "columnCount",
        "columnWidth"
      ],
      flex: [
        "flexBasis",
        "flexGrow",
        "flexShrink"
      ],
      flexFlow: [
        "flexDirection",
        "flexWrap"
      ],
      font: [
        "fontFamily",
        "fontFeatureSettings",
        "fontKerning",
        "fontLanguageOverride",
        "fontSize",
        "fontSizeAdjust",
        "fontStretch",
        "fontStyle",
        "fontVariant",
        "fontVariantAlternates",
        "fontVariantCaps",
        "fontVariantEastAsian",
        "fontVariantLigatures",
        "fontVariantNumeric",
        "fontVariantPosition",
        "fontWeight",
        "lineHeight"
      ],
      fontVariant: [
        "fontVariantAlternates",
        "fontVariantCaps",
        "fontVariantEastAsian",
        "fontVariantLigatures",
        "fontVariantNumeric",
        "fontVariantPosition"
      ],
      gap: [
        "columnGap",
        "rowGap"
      ],
      grid: [
        "gridAutoColumns",
        "gridAutoFlow",
        "gridAutoRows",
        "gridTemplateAreas",
        "gridTemplateColumns",
        "gridTemplateRows"
      ],
      gridArea: [
        "gridColumnEnd",
        "gridColumnStart",
        "gridRowEnd",
        "gridRowStart"
      ],
      gridColumn: [
        "gridColumnEnd",
        "gridColumnStart"
      ],
      gridColumnGap: [
        "columnGap"
      ],
      gridGap: [
        "columnGap",
        "rowGap"
      ],
      gridRow: [
        "gridRowEnd",
        "gridRowStart"
      ],
      gridRowGap: [
        "rowGap"
      ],
      gridTemplate: [
        "gridTemplateAreas",
        "gridTemplateColumns",
        "gridTemplateRows"
      ],
      listStyle: [
        "listStyleImage",
        "listStylePosition",
        "listStyleType"
      ],
      margin: [
        "marginBottom",
        "marginLeft",
        "marginRight",
        "marginTop"
      ],
      marker: [
        "markerEnd",
        "markerMid",
        "markerStart"
      ],
      mask: [
        "maskClip",
        "maskComposite",
        "maskImage",
        "maskMode",
        "maskOrigin",
        "maskPositionX",
        "maskPositionY",
        "maskRepeat",
        "maskSize"
      ],
      maskPosition: [
        "maskPositionX",
        "maskPositionY"
      ],
      outline: [
        "outlineColor",
        "outlineStyle",
        "outlineWidth"
      ],
      overflow: [
        "overflowX",
        "overflowY"
      ],
      padding: [
        "paddingBottom",
        "paddingLeft",
        "paddingRight",
        "paddingTop"
      ],
      placeContent: [
        "alignContent",
        "justifyContent"
      ],
      placeItems: [
        "alignItems",
        "justifyItems"
      ],
      placeSelf: [
        "alignSelf",
        "justifySelf"
      ],
      textDecoration: [
        "textDecorationColor",
        "textDecorationLine",
        "textDecorationStyle"
      ],
      textEmphasis: [
        "textEmphasisColor",
        "textEmphasisStyle"
      ],
      transition: [
        "transitionDelay",
        "transitionDuration",
        "transitionProperty",
        "transitionTimingFunction"
      ],
      wordWrap: [
        "overflowWrap"
      ]
    }, so = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      // SVG-related properties
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0
    };
    function Tv(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var xv = [
      "Webkit",
      "ms",
      "Moz",
      "O"
    ];
    Object.keys(so).forEach(function(e) {
      xv.forEach(function(t) {
        so[Tv(t, e)] = so[e];
      });
    });
    function yc(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(so.hasOwnProperty(e) && so[e]) ? t + "px" : (Yn(t, e), ("" + t).trim());
    }
    var co = /([A-Z])/g, xy = /^ms-/;
    function Dy(e) {
      return e.replace(co, "-$1").toLowerCase().replace(xy, "-ms-");
    }
    var Dv = function() {
    };
    {
      var Ov = /^(?:webkit|moz|o)[A-Z]/, kv = /^-ms-/, cs = /-(.)/g, fo = /;\s*$/, po = {}, vo = {}, Mv = !1, cd = !1, fd = function(e) {
        return e.replace(cs, function(t, a) {
          return a.toUpperCase();
        });
      }, dd = function(e) {
        po.hasOwnProperty(e) && po[e] || (po[e] = !0, C(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          fd(e.replace(kv, "ms-"))
        ));
      }, Nv = function(e) {
        po.hasOwnProperty(e) && po[e] || (po[e] = !0, C("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, Lv = function(e, t) {
        vo.hasOwnProperty(t) && vo[t] || (vo[t] = !0, C(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(fo, "")));
      }, Av = function(e, t) {
        Mv || (Mv = !0, C("`NaN` is an invalid value for the `%s` css style property.", e));
      }, Oy = function(e, t) {
        cd || (cd = !0, C("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      Dv = function(e, t) {
        e.indexOf("-") > -1 ? dd(e) : Ov.test(e) ? Nv(e) : fo.test(t) && Lv(e, t), typeof t == "number" && (isNaN(t) ? Av(e, t) : isFinite(t) || Oy(e, t));
      };
    }
    var ky = Dv;
    function My(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var u = e[i];
            if (u != null) {
              var s = i.indexOf("--") === 0;
              t += a + (s ? i : Dy(i)) + ":", t += yc(i, u, s), a = ";";
            }
          }
        return t || null;
      }
    }
    function zv(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var u = i.indexOf("--") === 0;
          u || ky(i, t[i]);
          var s = yc(i, t[i], u);
          i === "float" && (i = "cssFloat"), u ? a.setProperty(i, s) : a[i] = s;
        }
    }
    function Ny(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function Ua(e) {
      var t = {};
      for (var a in e)
        for (var i = Rv[a] || [
          a
        ], u = 0; u < i.length; u++)
          t[i[u]] = a;
      return t;
    }
    function fs(e, t) {
      {
        if (!t)
          return;
        var a = Ua(e), i = Ua(t), u = {};
        for (var s in a) {
          var d = a[s], v = i[s];
          if (v && d !== v) {
            var m = d + "," + v;
            if (u[m])
              continue;
            u[m] = !0, C("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", Ny(e[d]) ? "Removing" : "Updating", d, v);
          }
        }
      }
    }
    var Uv = {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0
      // NOTE: menuitem's close tag should be omitted, but that causes problems.
    }, Pv = Rt({
      menuitem: !0
    }, Uv), jv = "__html";
    function gc(e, t) {
      if (t) {
        if (Pv[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(jv in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && C("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function Yi(e, t) {
      if (e.indexOf("-") === -1)
        return typeof t.is == "string";
      switch (e) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return !1;
        default:
          return !0;
      }
    }
    var Sc = {
      // HTML
      accept: "accept",
      acceptcharset: "acceptCharset",
      "accept-charset": "acceptCharset",
      accesskey: "accessKey",
      action: "action",
      allowfullscreen: "allowFullScreen",
      alt: "alt",
      as: "as",
      async: "async",
      autocapitalize: "autoCapitalize",
      autocomplete: "autoComplete",
      autocorrect: "autoCorrect",
      autofocus: "autoFocus",
      autoplay: "autoPlay",
      autosave: "autoSave",
      capture: "capture",
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      challenge: "challenge",
      charset: "charSet",
      checked: "checked",
      children: "children",
      cite: "cite",
      class: "className",
      classid: "classID",
      classname: "className",
      cols: "cols",
      colspan: "colSpan",
      content: "content",
      contenteditable: "contentEditable",
      contextmenu: "contextMenu",
      controls: "controls",
      controlslist: "controlsList",
      coords: "coords",
      crossorigin: "crossOrigin",
      dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
      data: "data",
      datetime: "dateTime",
      default: "default",
      defaultchecked: "defaultChecked",
      defaultvalue: "defaultValue",
      defer: "defer",
      dir: "dir",
      disabled: "disabled",
      disablepictureinpicture: "disablePictureInPicture",
      disableremoteplayback: "disableRemotePlayback",
      download: "download",
      draggable: "draggable",
      enctype: "encType",
      enterkeyhint: "enterKeyHint",
      for: "htmlFor",
      form: "form",
      formmethod: "formMethod",
      formaction: "formAction",
      formenctype: "formEncType",
      formnovalidate: "formNoValidate",
      formtarget: "formTarget",
      frameborder: "frameBorder",
      headers: "headers",
      height: "height",
      hidden: "hidden",
      high: "high",
      href: "href",
      hreflang: "hrefLang",
      htmlfor: "htmlFor",
      httpequiv: "httpEquiv",
      "http-equiv": "httpEquiv",
      icon: "icon",
      id: "id",
      imagesizes: "imageSizes",
      imagesrcset: "imageSrcSet",
      innerhtml: "innerHTML",
      inputmode: "inputMode",
      integrity: "integrity",
      is: "is",
      itemid: "itemID",
      itemprop: "itemProp",
      itemref: "itemRef",
      itemscope: "itemScope",
      itemtype: "itemType",
      keyparams: "keyParams",
      keytype: "keyType",
      kind: "kind",
      label: "label",
      lang: "lang",
      list: "list",
      loop: "loop",
      low: "low",
      manifest: "manifest",
      marginwidth: "marginWidth",
      marginheight: "marginHeight",
      max: "max",
      maxlength: "maxLength",
      media: "media",
      mediagroup: "mediaGroup",
      method: "method",
      min: "min",
      minlength: "minLength",
      multiple: "multiple",
      muted: "muted",
      name: "name",
      nomodule: "noModule",
      nonce: "nonce",
      novalidate: "noValidate",
      open: "open",
      optimum: "optimum",
      pattern: "pattern",
      placeholder: "placeholder",
      playsinline: "playsInline",
      poster: "poster",
      preload: "preload",
      profile: "profile",
      radiogroup: "radioGroup",
      readonly: "readOnly",
      referrerpolicy: "referrerPolicy",
      rel: "rel",
      required: "required",
      reversed: "reversed",
      role: "role",
      rows: "rows",
      rowspan: "rowSpan",
      sandbox: "sandbox",
      scope: "scope",
      scoped: "scoped",
      scrolling: "scrolling",
      seamless: "seamless",
      selected: "selected",
      shape: "shape",
      size: "size",
      sizes: "sizes",
      span: "span",
      spellcheck: "spellCheck",
      src: "src",
      srcdoc: "srcDoc",
      srclang: "srcLang",
      srcset: "srcSet",
      start: "start",
      step: "step",
      style: "style",
      summary: "summary",
      tabindex: "tabIndex",
      target: "target",
      title: "title",
      type: "type",
      usemap: "useMap",
      value: "value",
      width: "width",
      wmode: "wmode",
      wrap: "wrap",
      // SVG
      about: "about",
      accentheight: "accentHeight",
      "accent-height": "accentHeight",
      accumulate: "accumulate",
      additive: "additive",
      alignmentbaseline: "alignmentBaseline",
      "alignment-baseline": "alignmentBaseline",
      allowreorder: "allowReorder",
      alphabetic: "alphabetic",
      amplitude: "amplitude",
      arabicform: "arabicForm",
      "arabic-form": "arabicForm",
      ascent: "ascent",
      attributename: "attributeName",
      attributetype: "attributeType",
      autoreverse: "autoReverse",
      azimuth: "azimuth",
      basefrequency: "baseFrequency",
      baselineshift: "baselineShift",
      "baseline-shift": "baselineShift",
      baseprofile: "baseProfile",
      bbox: "bbox",
      begin: "begin",
      bias: "bias",
      by: "by",
      calcmode: "calcMode",
      capheight: "capHeight",
      "cap-height": "capHeight",
      clip: "clip",
      clippath: "clipPath",
      "clip-path": "clipPath",
      clippathunits: "clipPathUnits",
      cliprule: "clipRule",
      "clip-rule": "clipRule",
      color: "color",
      colorinterpolation: "colorInterpolation",
      "color-interpolation": "colorInterpolation",
      colorinterpolationfilters: "colorInterpolationFilters",
      "color-interpolation-filters": "colorInterpolationFilters",
      colorprofile: "colorProfile",
      "color-profile": "colorProfile",
      colorrendering: "colorRendering",
      "color-rendering": "colorRendering",
      contentscripttype: "contentScriptType",
      contentstyletype: "contentStyleType",
      cursor: "cursor",
      cx: "cx",
      cy: "cy",
      d: "d",
      datatype: "datatype",
      decelerate: "decelerate",
      descent: "descent",
      diffuseconstant: "diffuseConstant",
      direction: "direction",
      display: "display",
      divisor: "divisor",
      dominantbaseline: "dominantBaseline",
      "dominant-baseline": "dominantBaseline",
      dur: "dur",
      dx: "dx",
      dy: "dy",
      edgemode: "edgeMode",
      elevation: "elevation",
      enablebackground: "enableBackground",
      "enable-background": "enableBackground",
      end: "end",
      exponent: "exponent",
      externalresourcesrequired: "externalResourcesRequired",
      fill: "fill",
      fillopacity: "fillOpacity",
      "fill-opacity": "fillOpacity",
      fillrule: "fillRule",
      "fill-rule": "fillRule",
      filter: "filter",
      filterres: "filterRes",
      filterunits: "filterUnits",
      floodopacity: "floodOpacity",
      "flood-opacity": "floodOpacity",
      floodcolor: "floodColor",
      "flood-color": "floodColor",
      focusable: "focusable",
      fontfamily: "fontFamily",
      "font-family": "fontFamily",
      fontsize: "fontSize",
      "font-size": "fontSize",
      fontsizeadjust: "fontSizeAdjust",
      "font-size-adjust": "fontSizeAdjust",
      fontstretch: "fontStretch",
      "font-stretch": "fontStretch",
      fontstyle: "fontStyle",
      "font-style": "fontStyle",
      fontvariant: "fontVariant",
      "font-variant": "fontVariant",
      fontweight: "fontWeight",
      "font-weight": "fontWeight",
      format: "format",
      from: "from",
      fx: "fx",
      fy: "fy",
      g1: "g1",
      g2: "g2",
      glyphname: "glyphName",
      "glyph-name": "glyphName",
      glyphorientationhorizontal: "glyphOrientationHorizontal",
      "glyph-orientation-horizontal": "glyphOrientationHorizontal",
      glyphorientationvertical: "glyphOrientationVertical",
      "glyph-orientation-vertical": "glyphOrientationVertical",
      glyphref: "glyphRef",
      gradienttransform: "gradientTransform",
      gradientunits: "gradientUnits",
      hanging: "hanging",
      horizadvx: "horizAdvX",
      "horiz-adv-x": "horizAdvX",
      horizoriginx: "horizOriginX",
      "horiz-origin-x": "horizOriginX",
      ideographic: "ideographic",
      imagerendering: "imageRendering",
      "image-rendering": "imageRendering",
      in2: "in2",
      in: "in",
      inlist: "inlist",
      intercept: "intercept",
      k1: "k1",
      k2: "k2",
      k3: "k3",
      k4: "k4",
      k: "k",
      kernelmatrix: "kernelMatrix",
      kernelunitlength: "kernelUnitLength",
      kerning: "kerning",
      keypoints: "keyPoints",
      keysplines: "keySplines",
      keytimes: "keyTimes",
      lengthadjust: "lengthAdjust",
      letterspacing: "letterSpacing",
      "letter-spacing": "letterSpacing",
      lightingcolor: "lightingColor",
      "lighting-color": "lightingColor",
      limitingconeangle: "limitingConeAngle",
      local: "local",
      markerend: "markerEnd",
      "marker-end": "markerEnd",
      markerheight: "markerHeight",
      markermid: "markerMid",
      "marker-mid": "markerMid",
      markerstart: "markerStart",
      "marker-start": "markerStart",
      markerunits: "markerUnits",
      markerwidth: "markerWidth",
      mask: "mask",
      maskcontentunits: "maskContentUnits",
      maskunits: "maskUnits",
      mathematical: "mathematical",
      mode: "mode",
      numoctaves: "numOctaves",
      offset: "offset",
      opacity: "opacity",
      operator: "operator",
      order: "order",
      orient: "orient",
      orientation: "orientation",
      origin: "origin",
      overflow: "overflow",
      overlineposition: "overlinePosition",
      "overline-position": "overlinePosition",
      overlinethickness: "overlineThickness",
      "overline-thickness": "overlineThickness",
      paintorder: "paintOrder",
      "paint-order": "paintOrder",
      panose1: "panose1",
      "panose-1": "panose1",
      pathlength: "pathLength",
      patterncontentunits: "patternContentUnits",
      patterntransform: "patternTransform",
      patternunits: "patternUnits",
      pointerevents: "pointerEvents",
      "pointer-events": "pointerEvents",
      points: "points",
      pointsatx: "pointsAtX",
      pointsaty: "pointsAtY",
      pointsatz: "pointsAtZ",
      prefix: "prefix",
      preservealpha: "preserveAlpha",
      preserveaspectratio: "preserveAspectRatio",
      primitiveunits: "primitiveUnits",
      property: "property",
      r: "r",
      radius: "radius",
      refx: "refX",
      refy: "refY",
      renderingintent: "renderingIntent",
      "rendering-intent": "renderingIntent",
      repeatcount: "repeatCount",
      repeatdur: "repeatDur",
      requiredextensions: "requiredExtensions",
      requiredfeatures: "requiredFeatures",
      resource: "resource",
      restart: "restart",
      result: "result",
      results: "results",
      rotate: "rotate",
      rx: "rx",
      ry: "ry",
      scale: "scale",
      security: "security",
      seed: "seed",
      shaperendering: "shapeRendering",
      "shape-rendering": "shapeRendering",
      slope: "slope",
      spacing: "spacing",
      specularconstant: "specularConstant",
      specularexponent: "specularExponent",
      speed: "speed",
      spreadmethod: "spreadMethod",
      startoffset: "startOffset",
      stddeviation: "stdDeviation",
      stemh: "stemh",
      stemv: "stemv",
      stitchtiles: "stitchTiles",
      stopcolor: "stopColor",
      "stop-color": "stopColor",
      stopopacity: "stopOpacity",
      "stop-opacity": "stopOpacity",
      strikethroughposition: "strikethroughPosition",
      "strikethrough-position": "strikethroughPosition",
      strikethroughthickness: "strikethroughThickness",
      "strikethrough-thickness": "strikethroughThickness",
      string: "string",
      stroke: "stroke",
      strokedasharray: "strokeDasharray",
      "stroke-dasharray": "strokeDasharray",
      strokedashoffset: "strokeDashoffset",
      "stroke-dashoffset": "strokeDashoffset",
      strokelinecap: "strokeLinecap",
      "stroke-linecap": "strokeLinecap",
      strokelinejoin: "strokeLinejoin",
      "stroke-linejoin": "strokeLinejoin",
      strokemiterlimit: "strokeMiterlimit",
      "stroke-miterlimit": "strokeMiterlimit",
      strokewidth: "strokeWidth",
      "stroke-width": "strokeWidth",
      strokeopacity: "strokeOpacity",
      "stroke-opacity": "strokeOpacity",
      suppresscontenteditablewarning: "suppressContentEditableWarning",
      suppresshydrationwarning: "suppressHydrationWarning",
      surfacescale: "surfaceScale",
      systemlanguage: "systemLanguage",
      tablevalues: "tableValues",
      targetx: "targetX",
      targety: "targetY",
      textanchor: "textAnchor",
      "text-anchor": "textAnchor",
      textdecoration: "textDecoration",
      "text-decoration": "textDecoration",
      textlength: "textLength",
      textrendering: "textRendering",
      "text-rendering": "textRendering",
      to: "to",
      transform: "transform",
      typeof: "typeof",
      u1: "u1",
      u2: "u2",
      underlineposition: "underlinePosition",
      "underline-position": "underlinePosition",
      underlinethickness: "underlineThickness",
      "underline-thickness": "underlineThickness",
      unicode: "unicode",
      unicodebidi: "unicodeBidi",
      "unicode-bidi": "unicodeBidi",
      unicoderange: "unicodeRange",
      "unicode-range": "unicodeRange",
      unitsperem: "unitsPerEm",
      "units-per-em": "unitsPerEm",
      unselectable: "unselectable",
      valphabetic: "vAlphabetic",
      "v-alphabetic": "vAlphabetic",
      values: "values",
      vectoreffect: "vectorEffect",
      "vector-effect": "vectorEffect",
      version: "version",
      vertadvy: "vertAdvY",
      "vert-adv-y": "vertAdvY",
      vertoriginx: "vertOriginX",
      "vert-origin-x": "vertOriginX",
      vertoriginy: "vertOriginY",
      "vert-origin-y": "vertOriginY",
      vhanging: "vHanging",
      "v-hanging": "vHanging",
      videographic: "vIdeographic",
      "v-ideographic": "vIdeographic",
      viewbox: "viewBox",
      viewtarget: "viewTarget",
      visibility: "visibility",
      vmathematical: "vMathematical",
      "v-mathematical": "vMathematical",
      vocab: "vocab",
      widths: "widths",
      wordspacing: "wordSpacing",
      "word-spacing": "wordSpacing",
      writingmode: "writingMode",
      "writing-mode": "writingMode",
      x1: "x1",
      x2: "x2",
      x: "x",
      xchannelselector: "xChannelSelector",
      xheight: "xHeight",
      "x-height": "xHeight",
      xlinkactuate: "xlinkActuate",
      "xlink:actuate": "xlinkActuate",
      xlinkarcrole: "xlinkArcrole",
      "xlink:arcrole": "xlinkArcrole",
      xlinkhref: "xlinkHref",
      "xlink:href": "xlinkHref",
      xlinkrole: "xlinkRole",
      "xlink:role": "xlinkRole",
      xlinkshow: "xlinkShow",
      "xlink:show": "xlinkShow",
      xlinktitle: "xlinkTitle",
      "xlink:title": "xlinkTitle",
      xlinktype: "xlinkType",
      "xlink:type": "xlinkType",
      xmlbase: "xmlBase",
      "xml:base": "xmlBase",
      xmllang: "xmlLang",
      "xml:lang": "xmlLang",
      xmlns: "xmlns",
      "xml:space": "xmlSpace",
      xmlnsxlink: "xmlnsXlink",
      "xmlns:xlink": "xmlnsXlink",
      xmlspace: "xmlSpace",
      y1: "y1",
      y2: "y2",
      y: "y",
      ychannelselector: "yChannelSelector",
      z: "z",
      zoomandpan: "zoomAndPan"
    }, Fv = {
      "aria-current": 0,
      // state
      "aria-description": 0,
      "aria-details": 0,
      "aria-disabled": 0,
      // state
      "aria-hidden": 0,
      // state
      "aria-invalid": 0,
      // state
      "aria-keyshortcuts": 0,
      "aria-label": 0,
      "aria-roledescription": 0,
      // Widget Attributes
      "aria-autocomplete": 0,
      "aria-checked": 0,
      "aria-expanded": 0,
      "aria-haspopup": 0,
      "aria-level": 0,
      "aria-modal": 0,
      "aria-multiline": 0,
      "aria-multiselectable": 0,
      "aria-orientation": 0,
      "aria-placeholder": 0,
      "aria-pressed": 0,
      "aria-readonly": 0,
      "aria-required": 0,
      "aria-selected": 0,
      "aria-sort": 0,
      "aria-valuemax": 0,
      "aria-valuemin": 0,
      "aria-valuenow": 0,
      "aria-valuetext": 0,
      // Live Region Attributes
      "aria-atomic": 0,
      "aria-busy": 0,
      "aria-live": 0,
      "aria-relevant": 0,
      // Drag-and-Drop Attributes
      "aria-dropeffect": 0,
      "aria-grabbed": 0,
      // Relationship Attributes
      "aria-activedescendant": 0,
      "aria-colcount": 0,
      "aria-colindex": 0,
      "aria-colspan": 0,
      "aria-controls": 0,
      "aria-describedby": 0,
      "aria-errormessage": 0,
      "aria-flowto": 0,
      "aria-labelledby": 0,
      "aria-owns": 0,
      "aria-posinset": 0,
      "aria-rowcount": 0,
      "aria-rowindex": 0,
      "aria-rowspan": 0,
      "aria-setsize": 0
    }, oi = {}, pd = new RegExp("^(aria)-[" + N + "]*$"), ds = new RegExp("^(aria)[A-Z][" + N + "]*$");
    function vd(e, t) {
      {
        if (In.call(oi, t) && oi[t])
          return !0;
        if (ds.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = Fv.hasOwnProperty(a) ? a : null;
          if (i == null)
            return C("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), oi[t] = !0, !0;
          if (t !== i)
            return C("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), oi[t] = !0, !0;
        }
        if (pd.test(t)) {
          var u = t.toLowerCase(), s = Fv.hasOwnProperty(u) ? u : null;
          if (s == null)
            return oi[t] = !0, !1;
          if (t !== s)
            return C("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, s), oi[t] = !0, !0;
        }
      }
      return !0;
    }
    function Hv(e, t) {
      {
        var a = [];
        for (var i in t) {
          var u = vd(e, i);
          u || a.push(i);
        }
        var s = a.map(function(d) {
          return "`" + d + "`";
        }).join(", ");
        a.length === 1 ? C("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e) : a.length > 1 && C("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e);
      }
    }
    function Cc(e, t) {
      Yi(e, t) || Hv(e, t);
    }
    var cu = !1;
    function hd(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !cu && (cu = !0, e === "select" && t.multiple ? C("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : C("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var md = function() {
    };
    {
      var cr = {}, yd = /^on./, Bv = /^on[^A-Z]/, Vv = new RegExp("^(aria)-[" + N + "]*$"), $v = new RegExp("^(aria)[A-Z][" + N + "]*$");
      md = function(e, t, a, i) {
        if (In.call(cr, t) && cr[t])
          return !0;
        var u = t.toLowerCase();
        if (u === "onfocusin" || u === "onfocusout")
          return C("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), cr[t] = !0, !0;
        if (i != null) {
          var s = i.registrationNameDependencies, d = i.possibleRegistrationNames;
          if (s.hasOwnProperty(t))
            return !0;
          var v = d.hasOwnProperty(u) ? d[u] : null;
          if (v != null)
            return C("Invalid event handler property `%s`. Did you mean `%s`?", t, v), cr[t] = !0, !0;
          if (yd.test(t))
            return C("Unknown event handler property `%s`. It will be ignored.", t), cr[t] = !0, !0;
        } else if (yd.test(t))
          return Bv.test(t) && C("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), cr[t] = !0, !0;
        if (Vv.test(t) || $v.test(t))
          return !0;
        if (u === "innerhtml")
          return C("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), cr[t] = !0, !0;
        if (u === "aria")
          return C("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), cr[t] = !0, !0;
        if (u === "is" && a !== null && a !== void 0 && typeof a != "string")
          return C("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), cr[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return C("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), cr[t] = !0, !0;
        var m = Ce(t), E = m !== null && m.type === Br;
        if (Sc.hasOwnProperty(u)) {
          var b = Sc[u];
          if (b !== t)
            return C("Invalid DOM property `%s`. Did you mean `%s`?", t, b), cr[t] = !0, !0;
        } else if (!E && t !== u)
          return C("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, u), cr[t] = !0, !0;
        return typeof a == "boolean" && Ge(t, a, m, !1) ? (a ? C('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : C('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), cr[t] = !0, !0) : E ? !0 : Ge(t, a, m, !1) ? (cr[t] = !0, !1) : ((a === "false" || a === "true") && m !== null && m.type === hn && (C("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), cr[t] = !0), !0);
      };
    }
    var Iv = function(e, t, a) {
      {
        var i = [];
        for (var u in t) {
          var s = md(e, u, t[u], a);
          s || i.push(u);
        }
        var d = i.map(function(v) {
          return "`" + v + "`";
        }).join(", ");
        i.length === 1 ? C("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", d, e) : i.length > 1 && C("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", d, e);
      }
    };
    function Yv(e, t, a) {
      Yi(e, t) || Iv(e, t, a);
    }
    var Wi = 1, ps = 2, fu = 4, Ly = Wi | ps | fu, vs = null;
    function hs(e) {
      vs !== null && C("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), vs = e;
    }
    function Ay() {
      vs === null && C("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), vs = null;
    }
    function Wv(e) {
      return e === vs;
    }
    function Ec(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Ii ? t.parentNode : t;
    }
    var on = null, Ol = null, Gi = null;
    function ho(e) {
      var t = Bo(e);
      if (t) {
        if (typeof on != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = Wh(a);
          on(t.stateNode, t.type, i);
        }
      }
    }
    function Gv(e) {
      on = e;
    }
    function _c(e) {
      Ol ? Gi ? Gi.push(e) : Gi = [
        e
      ] : Ol = e;
    }
    function ms() {
      return Ol !== null || Gi !== null;
    }
    function ys() {
      if (Ol) {
        var e = Ol, t = Gi;
        if (Ol = null, Gi = null, ho(e), t)
          for (var a = 0; a < t.length; a++)
            ho(t[a]);
      }
    }
    var du = function(e, t) {
      return e(t);
    }, gd = function() {
    }, Sd = !1;
    function zy() {
      var e = ms();
      e && (gd(), ys());
    }
    function Cd(e, t, a) {
      if (Sd)
        return e(t, a);
      Sd = !0;
      try {
        return du(e, t, a);
      } finally {
        Sd = !1, zy();
      }
    }
    function bc(e, t, a) {
      du = e, gd = a;
    }
    function wc(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function Ed(e, t, a) {
      switch (e) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          return !!(a.disabled && wc(t));
        default:
          return !1;
      }
    }
    function pu(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = Wh(a);
      if (i === null)
        return null;
      var u = i[t];
      if (Ed(t, e.type, i))
        return null;
      if (u && typeof u != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof u + "` type.");
      return u;
    }
    var gs = !1;
    if (cn)
      try {
        var vu = {};
        Object.defineProperty(vu, "passive", {
          get: function() {
            gs = !0;
          }
        }), window.addEventListener("test", vu, vu), window.removeEventListener("test", vu, vu);
      } catch {
        gs = !1;
      }
    function Qv(e, t, a, i, u, s, d, v, m) {
      var E = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, E);
      } catch (b) {
        this.onError(b);
      }
    }
    var _d = Qv;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var bd = document.createElement("react");
      _d = function(t, a, i, u, s, d, v, m, E) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var b = document.createEvent("Event"), z = !1, L = !0, B = window.event, $ = Object.getOwnPropertyDescriptor(window, "event");
        function W() {
          bd.removeEventListener(G, qe, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = B);
        }
        var xe = Array.prototype.slice.call(arguments, 3);
        function qe() {
          z = !0, W(), a.apply(i, xe), L = !1;
        }
        var Be, Ut = !1, Mt = !1;
        function P(j) {
          if (Be = j.error, Ut = !0, Be === null && j.colno === 0 && j.lineno === 0 && (Mt = !0), j.defaultPrevented && Be != null && typeof Be == "object")
            try {
              Be._suppressLogging = !0;
            } catch {
            }
        }
        var G = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", P), bd.addEventListener(G, qe, !1), b.initEvent(G, !1, !1), bd.dispatchEvent(b), $ && Object.defineProperty(window, "event", $), z && L && (Ut ? Mt && (Be = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : Be = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(Be)), window.removeEventListener("error", P), !z)
          return W(), Qv.apply(this, arguments);
      };
    }
    var Uy = _d, kl = !1, si = null, Ss = !1, Ml = null, wi = {
      onError: function(e) {
        kl = !0, si = e;
      }
    };
    function hu(e, t, a, i, u, s, d, v, m) {
      kl = !1, si = null, Uy.apply(wi, arguments);
    }
    function Qi(e, t, a, i, u, s, d, v, m) {
      if (hu.apply(this, arguments), kl) {
        var E = Rd();
        Ss || (Ss = !0, Ml = E);
      }
    }
    function wd() {
      if (Ss) {
        var e = Ml;
        throw Ss = !1, Ml = null, e;
      }
    }
    function Py() {
      return kl;
    }
    function Rd() {
      if (kl) {
        var e = si;
        return kl = !1, si = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Pa(e) {
      return e._reactInternals;
    }
    function Cs(e) {
      return e._reactInternals !== void 0;
    }
    function mo(e, t) {
      e._reactInternals = t;
    }
    var Ye = (
      /*                      */
      0
    ), Nl = (
      /*                */
      1
    ), mn = (
      /*                    */
      2
    ), _t = (
      /*                       */
      4
    ), qt = (
      /*                */
      16
    ), Jt = (
      /*                 */
      32
    ), Ri = (
      /*                     */
      64
    ), lt = (
      /*                   */
      128
    ), An = (
      /*            */
      256
    ), la = (
      /*                          */
      512
    ), ja = (
      /*                     */
      1024
    ), bn = (
      /*                      */
      2048
    ), Fa = (
      /*                    */
      4096
    ), Ll = (
      /*                   */
      8192
    ), Es = (
      /*             */
      16384
    ), Rc = bn | _t | Ri | la | ja | Es, qv = (
      /*               */
      32767
    ), _a = (
      /*                   */
      32768
    ), fr = (
      /*                */
      65536
    ), _s = (
      /* */
      131072
    ), Td = (
      /*                       */
      1048576
    ), xd = (
      /*                    */
      2097152
    ), ua = (
      /*                 */
      4194304
    ), Al = (
      /*                */
      8388608
    ), oa = (
      /*               */
      16777216
    ), mu = (
      /*              */
      33554432
    ), yo = (
      // flag logic (see #20043)
      _t | ja | 0
    ), sa = mn | _t | qt | Jt | la | Fa | Ll, Ar = _t | Ri | la | Ll, Ha = bn | qt, _r = ua | Al | xd, qi = h.ReactCurrentOwner;
    function ba(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (mn | Fa)) !== Ye && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === ee ? a : null;
    }
    function Dd(e) {
      if (e.tag === je) {
        var t = e.memoizedState;
        if (t === null) {
          var a = e.alternate;
          a !== null && (t = a.memoizedState);
        }
        if (t !== null)
          return t.dehydrated;
      }
      return null;
    }
    function Tc(e) {
      return e.tag === ee ? e.stateNode.containerInfo : null;
    }
    function Od(e) {
      return ba(e) === e;
    }
    function wa(e) {
      {
        var t = qi.current;
        if (t !== null && t.tag === ie) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || C("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", ft(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var u = Pa(e);
      return u ? ba(u) === u : !1;
    }
    function ca(e) {
      if (ba(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function yn(e) {
      var t = e.alternate;
      if (!t) {
        var a = ba(e);
        if (a === null)
          throw new Error("Unable to find node on an unmounted component.");
        return a !== e ? null : e;
      }
      for (var i = e, u = t; ; ) {
        var s = i.return;
        if (s === null)
          break;
        var d = s.alternate;
        if (d === null) {
          var v = s.return;
          if (v !== null) {
            i = u = v;
            continue;
          }
          break;
        }
        if (s.child === d.child) {
          for (var m = s.child; m; ) {
            if (m === i)
              return ca(s), e;
            if (m === u)
              return ca(s), t;
            m = m.sibling;
          }
          throw new Error("Unable to find node on an unmounted component.");
        }
        if (i.return !== u.return)
          i = s, u = d;
        else {
          for (var E = !1, b = s.child; b; ) {
            if (b === i) {
              E = !0, i = s, u = d;
              break;
            }
            if (b === u) {
              E = !0, u = s, i = d;
              break;
            }
            b = b.sibling;
          }
          if (!E) {
            for (b = d.child; b; ) {
              if (b === i) {
                E = !0, i = d, u = s;
                break;
              }
              if (b === u) {
                E = !0, u = d, i = s;
                break;
              }
              b = b.sibling;
            }
            if (!E)
              throw new Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (i.alternate !== u)
          throw new Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (i.tag !== ee)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function Ba(e) {
      var t = yn(e);
      return t !== null ? kd(t) : null;
    }
    function kd(e) {
      if (e.tag === ve || e.tag === ke)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = kd(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function Xv(e) {
      var t = yn(e);
      return t !== null ? xc(t) : null;
    }
    function xc(e) {
      if (e.tag === ve || e.tag === ke)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== de) {
          var a = xc(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var Dc = f.unstable_scheduleCallback, Kv = f.unstable_cancelCallback, Oc = f.unstable_shouldYield, Zv = f.unstable_requestPaint, Dn = f.unstable_now, Md = f.unstable_getCurrentPriorityLevel, kc = f.unstable_ImmediatePriority, Ra = f.unstable_UserBlockingPriority, Ti = f.unstable_NormalPriority, Mc = f.unstable_LowPriority, zl = f.unstable_IdlePriority, Nd = f.unstable_yieldValue, Ld = f.unstable_setDisableYieldValue, Ul = null, dr = null, ge = null, Hn = !1, br = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function Ad(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return C("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        Ve && (e = Rt({}, e, {
          getLaneLabelMap: jl,
          injectProfilingHooks: Ki
        })), Ul = t.inject(e), dr = t;
      } catch (a) {
        C("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function Jv(e, t) {
      if (dr && typeof dr.onScheduleFiberRoot == "function")
        try {
          dr.onScheduleFiberRoot(Ul, e, t);
        } catch (a) {
          Hn || (Hn = !0, C("React instrumentation encountered an error: %s", a));
        }
    }
    function Xi(e, t) {
      if (dr && typeof dr.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & lt) === lt;
          if (gt) {
            var i;
            switch (t) {
              case zr:
                i = kc;
                break;
              case wr:
                i = Ra;
                break;
              case Ji:
                i = Ti;
                break;
              case Ms:
                i = zl;
                break;
              default:
                i = Ti;
                break;
            }
            dr.onCommitFiberRoot(Ul, e, i, a);
          }
        } catch (u) {
          Hn || (Hn = !0, C("React instrumentation encountered an error: %s", u));
        }
    }
    function Pl(e) {
      if (dr && typeof dr.onPostCommitFiberRoot == "function")
        try {
          dr.onPostCommitFiberRoot(Ul, e);
        } catch (t) {
          Hn || (Hn = !0, C("React instrumentation encountered an error: %s", t));
        }
    }
    function zd(e) {
      if (dr && typeof dr.onCommitFiberUnmount == "function")
        try {
          dr.onCommitFiberUnmount(Ul, e);
        } catch (t) {
          Hn || (Hn = !0, C("React instrumentation encountered an error: %s", t));
        }
    }
    function tr(e) {
      if (typeof Nd == "function" && (Ld(e), w(e)), dr && typeof dr.setStrictMode == "function")
        try {
          dr.setStrictMode(Ul, e);
        } catch (t) {
          Hn || (Hn = !0, C("React instrumentation encountered an error: %s", t));
        }
    }
    function Ki(e) {
      ge = e;
    }
    function jl() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < gn; a++) {
          var i = jy(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function Nc(e) {
      ge !== null && typeof ge.markCommitStarted == "function" && ge.markCommitStarted(e);
    }
    function Ud() {
      ge !== null && typeof ge.markCommitStopped == "function" && ge.markCommitStopped();
    }
    function Fl(e) {
      ge !== null && typeof ge.markComponentRenderStarted == "function" && ge.markComponentRenderStarted(e);
    }
    function yu() {
      ge !== null && typeof ge.markComponentRenderStopped == "function" && ge.markComponentRenderStopped();
    }
    function eh(e) {
      ge !== null && typeof ge.markComponentPassiveEffectMountStarted == "function" && ge.markComponentPassiveEffectMountStarted(e);
    }
    function Pd() {
      ge !== null && typeof ge.markComponentPassiveEffectMountStopped == "function" && ge.markComponentPassiveEffectMountStopped();
    }
    function Lc(e) {
      ge !== null && typeof ge.markComponentPassiveEffectUnmountStarted == "function" && ge.markComponentPassiveEffectUnmountStarted(e);
    }
    function th() {
      ge !== null && typeof ge.markComponentPassiveEffectUnmountStopped == "function" && ge.markComponentPassiveEffectUnmountStopped();
    }
    function nh(e) {
      ge !== null && typeof ge.markComponentLayoutEffectMountStarted == "function" && ge.markComponentLayoutEffectMountStarted(e);
    }
    function rh() {
      ge !== null && typeof ge.markComponentLayoutEffectMountStopped == "function" && ge.markComponentLayoutEffectMountStopped();
    }
    function Ac(e) {
      ge !== null && typeof ge.markComponentLayoutEffectUnmountStarted == "function" && ge.markComponentLayoutEffectUnmountStarted(e);
    }
    function go() {
      ge !== null && typeof ge.markComponentLayoutEffectUnmountStopped == "function" && ge.markComponentLayoutEffectUnmountStopped();
    }
    function zc(e, t, a) {
      ge !== null && typeof ge.markComponentErrored == "function" && ge.markComponentErrored(e, t, a);
    }
    function ah(e, t, a) {
      ge !== null && typeof ge.markComponentSuspended == "function" && ge.markComponentSuspended(e, t, a);
    }
    function ih(e) {
      ge !== null && typeof ge.markLayoutEffectsStarted == "function" && ge.markLayoutEffectsStarted(e);
    }
    function So() {
      ge !== null && typeof ge.markLayoutEffectsStopped == "function" && ge.markLayoutEffectsStopped();
    }
    function lh(e) {
      ge !== null && typeof ge.markPassiveEffectsStarted == "function" && ge.markPassiveEffectsStarted(e);
    }
    function bs() {
      ge !== null && typeof ge.markPassiveEffectsStopped == "function" && ge.markPassiveEffectsStopped();
    }
    function ci(e) {
      ge !== null && typeof ge.markRenderStarted == "function" && ge.markRenderStarted(e);
    }
    function ws() {
      ge !== null && typeof ge.markRenderYielded == "function" && ge.markRenderYielded();
    }
    function Co() {
      ge !== null && typeof ge.markRenderStopped == "function" && ge.markRenderStopped();
    }
    function gu(e) {
      ge !== null && typeof ge.markRenderScheduled == "function" && ge.markRenderScheduled(e);
    }
    function jd(e, t) {
      ge !== null && typeof ge.markForceUpdateScheduled == "function" && ge.markForceUpdateScheduled(e, t);
    }
    function Hl(e, t) {
      ge !== null && typeof ge.markStateUpdateScheduled == "function" && ge.markStateUpdateScheduled(e, t);
    }
    var Ze = (
      /*                         */
      0
    ), xt = (
      /*                 */
      1
    ), tt = (
      /*                    */
      2
    ), On = (
      /*               */
      8
    ), Va = (
      /*              */
      16
    ), Uc = Math.clz32 ? Math.clz32 : Su, Pc = Math.log, Fd = Math.LN2;
    function Su(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (Pc(t) / Fd | 0) | 0;
    }
    var gn = 31, Q = (
      /*                        */
      0
    ), At = (
      /*                          */
      0
    ), rt = (
      /*                        */
      1
    ), xi = (
      /*    */
      2
    ), Ta = (
      /*             */
      4
    ), Cu = (
      /*            */
      8
    ), Sn = (
      /*                     */
      16
    ), Eu = (
      /*                */
      32
    ), Bl = (
      /*                       */
      4194240
    ), _u = (
      /*                        */
      64
    ), $a = (
      /*                        */
      128
    ), fa = (
      /*                        */
      256
    ), bu = (
      /*                        */
      512
    ), Rs = (
      /*                        */
      1024
    ), Ts = (
      /*                        */
      2048
    ), jc = (
      /*                        */
      4096
    ), Fc = (
      /*                        */
      8192
    ), Hc = (
      /*                        */
      16384
    ), Bc = (
      /*                       */
      32768
    ), Vc = (
      /*                       */
      65536
    ), $c = (
      /*                       */
      131072
    ), Ic = (
      /*                       */
      262144
    ), Yc = (
      /*                       */
      524288
    ), wu = (
      /*                       */
      1048576
    ), Wc = (
      /*                       */
      2097152
    ), Ru = (
      /*                            */
      130023424
    ), Zi = (
      /*                             */
      4194304
    ), Gc = (
      /*                             */
      8388608
    ), xs = (
      /*                             */
      16777216
    ), Qc = (
      /*                             */
      33554432
    ), qc = (
      /*                             */
      67108864
    ), Hd = Zi, Eo = (
      /*          */
      134217728
    ), Xc = (
      /*                          */
      268435455
    ), _o = (
      /*               */
      268435456
    ), Vl = (
      /*                        */
      536870912
    ), da = (
      /*                   */
      1073741824
    );
    function jy(e) {
      {
        if (e & rt)
          return "Sync";
        if (e & xi)
          return "InputContinuousHydration";
        if (e & Ta)
          return "InputContinuous";
        if (e & Cu)
          return "DefaultHydration";
        if (e & Sn)
          return "Default";
        if (e & Eu)
          return "TransitionHydration";
        if (e & Bl)
          return "Transition";
        if (e & Ru)
          return "Retry";
        if (e & Eo)
          return "SelectiveHydration";
        if (e & _o)
          return "IdleHydration";
        if (e & Vl)
          return "Idle";
        if (e & da)
          return "Offscreen";
      }
    }
    var sn = -1, Kc = _u, Zc = Zi;
    function bo(e) {
      switch (qn(e)) {
        case rt:
          return rt;
        case xi:
          return xi;
        case Ta:
          return Ta;
        case Cu:
          return Cu;
        case Sn:
          return Sn;
        case Eu:
          return Eu;
        case _u:
        case $a:
        case fa:
        case bu:
        case Rs:
        case Ts:
        case jc:
        case Fc:
        case Hc:
        case Bc:
        case Vc:
        case $c:
        case Ic:
        case Yc:
        case wu:
        case Wc:
          return e & Bl;
        case Zi:
        case Gc:
        case xs:
        case Qc:
        case qc:
          return e & Ru;
        case Eo:
          return Eo;
        case _o:
          return _o;
        case Vl:
          return Vl;
        case da:
          return da;
        default:
          return C("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function Ds(e, t) {
      var a = e.pendingLanes;
      if (a === Q)
        return Q;
      var i = Q, u = e.suspendedLanes, s = e.pingedLanes, d = a & Xc;
      if (d !== Q) {
        var v = d & ~u;
        if (v !== Q)
          i = bo(v);
        else {
          var m = d & s;
          m !== Q && (i = bo(m));
        }
      } else {
        var E = a & ~u;
        E !== Q ? i = bo(E) : s !== Q && (i = bo(s));
      }
      if (i === Q)
        return Q;
      if (t !== Q && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & u) === Q) {
        var b = qn(i), z = qn(t);
        if (
          // one. This works because the bits decrease in priority as you go left.
          b >= z || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          b === Sn && (z & Bl) !== Q
        )
          return t;
      }
      (i & Ta) !== Q && (i |= a & Sn);
      var L = e.entangledLanes;
      if (L !== Q)
        for (var B = e.entanglements, $ = i & L; $ > 0; ) {
          var W = $l($), xe = 1 << W;
          i |= B[W], $ &= ~xe;
        }
      return i;
    }
    function uh(e, t) {
      for (var a = e.eventTimes, i = sn; t > 0; ) {
        var u = $l(t), s = 1 << u, d = a[u];
        d > i && (i = d), t &= ~s;
      }
      return i;
    }
    function Jc(e, t) {
      switch (e) {
        case rt:
        case xi:
        case Ta:
          return t + 250;
        case Cu:
        case Sn:
        case Eu:
        case _u:
        case $a:
        case fa:
        case bu:
        case Rs:
        case Ts:
        case jc:
        case Fc:
        case Hc:
        case Bc:
        case Vc:
        case $c:
        case Ic:
        case Yc:
        case wu:
        case Wc:
          return t + 5e3;
        case Zi:
        case Gc:
        case xs:
        case Qc:
        case qc:
          return sn;
        case Eo:
        case _o:
        case Vl:
        case da:
          return sn;
        default:
          return C("Should have found matching lanes. This is a bug in React."), sn;
      }
    }
    function Fy(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, u = e.pingedLanes, s = e.expirationTimes, d = a; d > 0; ) {
        var v = $l(d), m = 1 << v, E = s[v];
        E === sn ? ((m & i) === Q || (m & u) !== Q) && (s[v] = Jc(m, t)) : E <= t && (e.expiredLanes |= m), d &= ~m;
      }
    }
    function Hy(e) {
      return bo(e.pendingLanes);
    }
    function Bd(e) {
      var t = e.pendingLanes & ~da;
      return t !== Q ? t : t & da ? da : Q;
    }
    function wo(e) {
      return (e & rt) !== Q;
    }
    function Os(e) {
      return (e & Xc) !== Q;
    }
    function ef(e) {
      return (e & Ru) === e;
    }
    function By(e) {
      var t = rt | Ta | Sn;
      return (e & t) === Q;
    }
    function oh(e) {
      return (e & Bl) === e;
    }
    function ks(e, t) {
      var a = xi | Ta | Cu | Sn;
      return (t & a) !== Q;
    }
    function sh(e, t) {
      return (t & e.expiredLanes) !== Q;
    }
    function Vd(e) {
      return (e & Bl) !== Q;
    }
    function $d() {
      var e = Kc;
      return Kc <<= 1, (Kc & Bl) === Q && (Kc = _u), e;
    }
    function Vy() {
      var e = Zc;
      return Zc <<= 1, (Zc & Ru) === Q && (Zc = Zi), e;
    }
    function qn(e) {
      return e & -e;
    }
    function nr(e) {
      return qn(e);
    }
    function $l(e) {
      return 31 - Uc(e);
    }
    function tf(e) {
      return $l(e);
    }
    function pa(e, t) {
      return (e & t) !== Q;
    }
    function Tu(e, t) {
      return (e & t) === t;
    }
    function bt(e, t) {
      return e | t;
    }
    function Ro(e, t) {
      return e & ~t;
    }
    function Id(e, t) {
      return e & t;
    }
    function ch(e) {
      return e;
    }
    function fh(e, t) {
      return e !== At && e < t ? e : t;
    }
    function nf(e) {
      for (var t = [], a = 0; a < gn; a++)
        t.push(e);
      return t;
    }
    function xu(e, t, a) {
      e.pendingLanes |= t, t !== Vl && (e.suspendedLanes = Q, e.pingedLanes = Q);
      var i = e.eventTimes, u = tf(t);
      i[u] = a;
    }
    function Yd(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var u = $l(i), s = 1 << u;
        a[u] = sn, i &= ~s;
      }
    }
    function Wd(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function Gd(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = Q, e.pingedLanes = Q, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, u = e.eventTimes, s = e.expirationTimes, d = a; d > 0; ) {
        var v = $l(d), m = 1 << v;
        i[v] = Q, u[v] = sn, s[v] = sn, d &= ~m;
      }
    }
    function To(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, u = a; u; ) {
        var s = $l(u), d = 1 << s;
        d & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), u &= ~d;
      }
    }
    function $y(e, t) {
      var a = qn(t), i;
      switch (a) {
        case Ta:
          i = xi;
          break;
        case Sn:
          i = Cu;
          break;
        case _u:
        case $a:
        case fa:
        case bu:
        case Rs:
        case Ts:
        case jc:
        case Fc:
        case Hc:
        case Bc:
        case Vc:
        case $c:
        case Ic:
        case Yc:
        case wu:
        case Wc:
        case Zi:
        case Gc:
        case xs:
        case Qc:
        case qc:
          i = Eu;
          break;
        case Vl:
          i = _o;
          break;
        default:
          i = At;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== At ? At : i;
    }
    function Qd(e, t, a) {
      if (br)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var u = tf(a), s = 1 << u, d = i[u];
          d.add(t), a &= ~s;
        }
    }
    function rf(e, t) {
      if (br)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var u = tf(t), s = 1 << u, d = a[u];
          d.size > 0 && (d.forEach(function(v) {
            var m = v.alternate;
            (m === null || !i.has(m)) && i.add(v);
          }), d.clear()), t &= ~s;
        }
    }
    function qd(e, t) {
      return null;
    }
    var zr = rt, wr = Ta, Ji = Sn, Ms = Vl, Du = At;
    function Ia() {
      return Du;
    }
    function rr(e) {
      Du = e;
    }
    function Ns(e, t) {
      var a = Du;
      try {
        return Du = e, t();
      } finally {
        Du = a;
      }
    }
    function Ur(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function Iy(e, t) {
      return e === 0 || e > t ? e : t;
    }
    function Xd(e, t) {
      return e !== 0 && e < t;
    }
    function Ls(e) {
      var t = qn(e);
      return Xd(zr, t) ? Xd(wr, t) ? Os(t) ? Ji : Ms : wr : zr;
    }
    function ar(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var dh;
    function Me(e) {
      dh = e;
    }
    function xo(e) {
      dh(e);
    }
    var As;
    function ph(e) {
      As = e;
    }
    var vh;
    function zs(e) {
      vh = e;
    }
    var Us;
    function Kd(e) {
      Us = e;
    }
    var Zd;
    function hh(e) {
      Zd = e;
    }
    var af = !1, Do = [], Di = null, wn = null, pr = null, Ya = /* @__PURE__ */ new Map(), Oo = /* @__PURE__ */ new Map(), el = [], fi = [
      "mousedown",
      "mouseup",
      "touchcancel",
      "touchend",
      "touchstart",
      "auxclick",
      "dblclick",
      "pointercancel",
      "pointerdown",
      "pointerup",
      "dragend",
      "dragstart",
      "drop",
      "compositionend",
      "compositionstart",
      "keydown",
      "keypress",
      "keyup",
      "input",
      "textInput",
      "copy",
      "cut",
      "paste",
      "click",
      "change",
      "contextmenu",
      "reset",
      "submit"
    ];
    function mh(e) {
      return fi.indexOf(e) > -1;
    }
    function Oi(e, t, a, i, u) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: a,
        nativeEvent: u,
        targetContainers: [
          i
        ]
      };
    }
    function yh(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          Di = null;
          break;
        case "dragenter":
        case "dragleave":
          wn = null;
          break;
        case "mouseover":
        case "mouseout":
          pr = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          Ya.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var i = t.pointerId;
          Oo.delete(i);
          break;
        }
      }
    }
    function ko(e, t, a, i, u, s) {
      if (e === null || e.nativeEvent !== s) {
        var d = Oi(t, a, i, u, s);
        if (t !== null) {
          var v = Bo(t);
          v !== null && As(v);
        }
        return d;
      }
      e.eventSystemFlags |= i;
      var m = e.targetContainers;
      return u !== null && m.indexOf(u) === -1 && m.push(u), e;
    }
    function gh(e, t, a, i, u) {
      switch (t) {
        case "focusin": {
          var s = u;
          return Di = ko(Di, e, t, a, i, s), !0;
        }
        case "dragenter": {
          var d = u;
          return wn = ko(wn, e, t, a, i, d), !0;
        }
        case "mouseover": {
          var v = u;
          return pr = ko(pr, e, t, a, i, v), !0;
        }
        case "pointerover": {
          var m = u, E = m.pointerId;
          return Ya.set(E, ko(Ya.get(E) || null, e, t, a, i, m)), !0;
        }
        case "gotpointercapture": {
          var b = u, z = b.pointerId;
          return Oo.set(z, ko(Oo.get(z) || null, e, t, a, i, b)), !0;
        }
      }
      return !1;
    }
    function Jd(e) {
      var t = Ys(e.target);
      if (t !== null) {
        var a = ba(t);
        if (a !== null) {
          var i = a.tag;
          if (i === je) {
            var u = Dd(a);
            if (u !== null) {
              e.blockedOn = u, Zd(e.priority, function() {
                vh(a);
              });
              return;
            }
          } else if (i === ee) {
            var s = a.stateNode;
            if (ar(s)) {
              e.blockedOn = Tc(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function Sh(e) {
      for (var t = Us(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < el.length && Xd(t, el[i].priority); i++)
        ;
      el.splice(i, 0, a), i === 0 && Jd(a);
    }
    function lf(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = Ou(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var u = e.nativeEvent, s = new u.constructor(u.type, u);
          hs(s), u.target.dispatchEvent(s), Ay();
        } else {
          var d = Bo(i);
          return d !== null && As(d), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Ps(e, t, a) {
      lf(e) && a.delete(t);
    }
    function ep() {
      af = !1, Di !== null && lf(Di) && (Di = null), wn !== null && lf(wn) && (wn = null), pr !== null && lf(pr) && (pr = null), Ya.forEach(Ps), Oo.forEach(Ps);
    }
    function Pr(e, t) {
      e.blockedOn === t && (e.blockedOn = null, af || (af = !0, f.unstable_scheduleCallback(f.unstable_NormalPriority, ep)));
    }
    function kt(e) {
      if (Do.length > 0) {
        Pr(Do[0], e);
        for (var t = 1; t < Do.length; t++) {
          var a = Do[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      Di !== null && Pr(Di, e), wn !== null && Pr(wn, e), pr !== null && Pr(pr, e);
      var i = function(v) {
        return Pr(v, e);
      };
      Ya.forEach(i), Oo.forEach(i);
      for (var u = 0; u < el.length; u++) {
        var s = el[u];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; el.length > 0; ) {
        var d = el[0];
        if (d.blockedOn !== null)
          break;
        Jd(d), d.blockedOn === null && el.shift();
      }
    }
    var kn = h.ReactCurrentBatchConfig, zn = !0;
    function vr(e) {
      zn = !!e;
    }
    function xa() {
      return zn;
    }
    function Mo(e, t, a) {
      var i = Wr(t), u;
      switch (i) {
        case zr:
          u = ir;
          break;
        case wr:
          u = js;
          break;
        case Ji:
        default:
          u = tl;
          break;
      }
      return u.bind(null, t, a, e);
    }
    function ir(e, t, a, i) {
      var u = Ia(), s = kn.transition;
      kn.transition = null;
      try {
        rr(zr), tl(e, t, a, i);
      } finally {
        rr(u), kn.transition = s;
      }
    }
    function js(e, t, a, i) {
      var u = Ia(), s = kn.transition;
      kn.transition = null;
      try {
        rr(wr), tl(e, t, a, i);
      } finally {
        rr(u), kn.transition = s;
      }
    }
    function tl(e, t, a, i) {
      zn && uf(e, t, a, i);
    }
    function uf(e, t, a, i) {
      var u = Ou(e, t, a, i);
      if (u === null) {
        cg(e, t, i, No, a), yh(e, i);
        return;
      }
      if (gh(u, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (yh(e, i), t & fu && mh(e)) {
        for (; u !== null; ) {
          var s = Bo(u);
          s !== null && xo(s);
          var d = Ou(e, t, a, i);
          if (d === null && cg(e, t, i, No, a), d === u)
            break;
          u = d;
        }
        u !== null && i.stopPropagation();
        return;
      }
      cg(e, t, i, null, a);
    }
    var No = null;
    function Ou(e, t, a, i) {
      No = null;
      var u = Ec(i), s = Ys(u);
      if (s !== null) {
        var d = ba(s);
        if (d === null)
          s = null;
        else {
          var v = d.tag;
          if (v === je) {
            var m = Dd(d);
            if (m !== null)
              return m;
            s = null;
          } else if (v === ee) {
            var E = d.stateNode;
            if (ar(E))
              return Tc(d);
            s = null;
          } else
            d !== s && (s = null);
        }
      }
      return No = s, null;
    }
    function Wr(e) {
      switch (e) {
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return zr;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return wr;
        case "message": {
          var t = Md();
          switch (t) {
            case kc:
              return zr;
            case Ra:
              return wr;
            case Ti:
            case Mc:
              return Ji;
            case zl:
              return Ms;
            default:
              return Ji;
          }
        }
        default:
          return Ji;
      }
    }
    function tp(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function Lo(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function nl(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function of(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var ku = null, ki = null, Il = null;
    function Yl(e) {
      return ku = e, ki = cf(), !0;
    }
    function sf() {
      ku = null, ki = null, Il = null;
    }
    function Ao() {
      if (Il)
        return Il;
      var e, t = ki, a = t.length, i, u = cf(), s = u.length;
      for (e = 0; e < a && t[e] === u[e]; e++)
        ;
      var d = a - e;
      for (i = 1; i <= d && t[a - i] === u[s - i]; i++)
        ;
      var v = i > 1 ? 1 - i : void 0;
      return Il = u.slice(e, v), Il;
    }
    function cf() {
      return "value" in ku ? ku.value : ku.textContent;
    }
    function Mu(e) {
      var t, a = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && a === 13 && (t = 13)) : t = a, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function Nu() {
      return !0;
    }
    function jr() {
      return !1;
    }
    function Xn(e) {
      function t(a, i, u, s, d) {
        this._reactName = a, this._targetInst = u, this.type = i, this.nativeEvent = s, this.target = d, this.currentTarget = null;
        for (var v in e)
          if (e.hasOwnProperty(v)) {
            var m = e[v];
            m ? this[v] = m(s) : this[v] = s[v];
          }
        var E = s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1;
        return E ? this.isDefaultPrevented = Nu : this.isDefaultPrevented = jr, this.isPropagationStopped = jr, this;
      }
      return Rt(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = Nu);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = Nu);
        },
        /**
        * We release all dispatched `SyntheticEvent`s after each event loop, adding
        * them back into the pool. This allows a way to hold onto a reference that
        * won't be added back into the pool.
        */
        persist: function() {
        },
        /**
        * Checks if this event should be released back into the pool.
        *
        * @return {boolean} True if this should not be released, false otherwise.
        */
        isPersistent: Nu
      }), t;
    }
    var Fr = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, Hr = Xn(Fr), zo = Rt({}, Fr, {
      view: 0,
      detail: 0
    }), np = Xn(zo), Fs, rp, Wa;
    function Ch(e) {
      e !== Wa && (Wa && e.type === "mousemove" ? (Fs = e.screenX - Wa.screenX, rp = e.screenY - Wa.screenY) : (Fs = 0, rp = 0), Wa = e);
    }
    var Uo = Rt({}, zo, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: pf,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (Ch(e), Fs);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : rp;
      }
    }), Wl = Xn(Uo), ap = Rt({}, Uo, {
      dataTransfer: 0
    }), Lu = Xn(ap), Eh = Rt({}, zo, {
      relatedTarget: 0
    }), ff = Xn(Eh), ip = Rt({}, Fr, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), df = Xn(ip), Yy = Rt({}, Fr, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), Wy = Xn(Yy), _h = Rt({}, Fr, {
      data: 0
    }), lp = Xn(_h), Au = lp, Gy = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    }, Po = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    };
    function bh(e) {
      if (e.key) {
        var t = Gy[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = Mu(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? Po[e.keyCode] || "Unidentified" : "";
    }
    var Un = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function Qy(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = Un[e];
      return i ? !!a[i] : !1;
    }
    function pf(e) {
      return Qy;
    }
    var qy = Rt({}, zo, {
      key: bh,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: pf,
      // Legacy Interface
      charCode: function(e) {
        return e.type === "keypress" ? Mu(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? Mu(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), Xy = Xn(qy), wh = Rt({}, Uo, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    }), up = Xn(wh), Ky = Rt({}, zo, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: pf
    }), Ga = Xn(Ky), op = Rt({}, Fr, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Zy = Xn(op), Gl = Rt({}, Uo, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
      },
      deltaZ: 0,
      // Browsers without "deltaMode" is reporting in raw wheel delta where one
      // notch on the scroll is always +/- 120, roughly equivalent to pixels.
      // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
      // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
      deltaMode: 0
    }), vf = Xn(Gl), zu = [
      9,
      13,
      27,
      32
    ], Hs = 229, Bs = cn && "CompositionEvent" in window, Uu = null;
    cn && "documentMode" in document && (Uu = document.documentMode);
    var Jy = cn && "TextEvent" in window && !Uu, hf = cn && (!Bs || Uu && Uu > 8 && Uu <= 11), Rh = 32, sp = String.fromCharCode(Rh);
    function Th() {
      Zn("onBeforeInput", [
        "compositionend",
        "keypress",
        "textInput",
        "paste"
      ]), Zn("onCompositionEnd", [
        "compositionend",
        "focusout",
        "keydown",
        "keypress",
        "keyup",
        "mousedown"
      ]), Zn("onCompositionStart", [
        "compositionstart",
        "focusout",
        "keydown",
        "keypress",
        "keyup",
        "mousedown"
      ]), Zn("onCompositionUpdate", [
        "compositionupdate",
        "focusout",
        "keydown",
        "keypress",
        "keyup",
        "mousedown"
      ]);
    }
    var Vs = !1;
    function mf(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function xh(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function cp(e, t) {
      return e === "keydown" && t.keyCode === Hs;
    }
    function Dh(e, t) {
      switch (e) {
        case "keyup":
          return zu.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== Hs;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function fp(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function yf(e) {
      return e.locale === "ko";
    }
    var rl = !1;
    function dp(e, t, a, i, u) {
      var s, d;
      if (Bs ? s = xh(t) : rl ? Dh(t, i) && (s = "onCompositionEnd") : cp(t, i) && (s = "onCompositionStart"), !s)
        return null;
      hf && !yf(i) && (!rl && s === "onCompositionStart" ? rl = Yl(u) : s === "onCompositionEnd" && rl && (d = Ao()));
      var v = Lh(a, s);
      if (v.length > 0) {
        var m = new lp(s, t, null, i, u);
        if (e.push({
          event: m,
          listeners: v
        }), d)
          m.data = d;
        else {
          var E = fp(i);
          E !== null && (m.data = E);
        }
      }
    }
    function gf(e, t) {
      switch (e) {
        case "compositionend":
          return fp(t);
        case "keypress":
          var a = t.which;
          return a !== Rh ? null : (Vs = !0, sp);
        case "textInput":
          var i = t.data;
          return i === sp && Vs ? null : i;
        default:
          return null;
      }
    }
    function Oh(e, t) {
      if (rl) {
        if (e === "compositionend" || !Bs && Dh(e, t)) {
          var a = Ao();
          return sf(), rl = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!mf(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return hf && !yf(t) ? null : t.data;
        default:
          return null;
      }
    }
    function eg(e, t, a, i, u) {
      var s;
      if (Jy ? s = gf(t, i) : s = Oh(t, i), !s)
        return null;
      var d = Lh(a, "onBeforeInput");
      if (d.length > 0) {
        var v = new Au("onBeforeInput", "beforeinput", null, i, u);
        e.push({
          event: v,
          listeners: d
        }), v.data = s;
      }
    }
    function Sf(e, t, a, i, u, s, d) {
      dp(e, t, a, i, u), eg(e, t, a, i, u);
    }
    var tg = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0
    };
    function jo(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!tg[e.type] : t === "textarea";
    }
    /**
    * Checks if an event is supported in the current execution environment.
    *
    * NOTE: This will not work correctly for non-generic events such as `change`,
    * `reset`, `load`, `error`, and `select`.
    *
    * Borrows from Modernizr.
    *
    * @param {string} eventNameSuffix Event name, e.g. "click".
    * @return {boolean} True if the event is supported.
    * @internal
    * @license Modernizr 3.0.0pre (Custom Build) | MIT
    */
    function ng(e) {
      if (!cn)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function Cf() {
      Zn("onChange", [
        "change",
        "click",
        "focusin",
        "focusout",
        "input",
        "keydown",
        "keyup",
        "selectionchange"
      ]);
    }
    function n(e, t, a, i) {
      _c(i);
      var u = Lh(t, "onChange");
      if (u.length > 0) {
        var s = new Hr("onChange", "change", null, a, i);
        e.push({
          event: s,
          listeners: u
        });
      }
    }
    var r = null, l = null;
    function o(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function c(e) {
      var t = [];
      n(t, l, e, Ec(e)), Cd(p, t);
    }
    function p(e) {
      MC(e, 0);
    }
    function S(e) {
      var t = Tf(e);
      if (lo(t))
        return e;
    }
    function R(e, t) {
      if (e === "change")
        return t;
    }
    var k = !1;
    cn && (k = ng("input") && (!document.documentMode || document.documentMode > 9));
    function I(e, t) {
      r = e, l = t, r.attachEvent("onpropertychange", le);
    }
    function ae() {
      r && (r.detachEvent("onpropertychange", le), r = null, l = null);
    }
    function le(e) {
      e.propertyName === "value" && S(l) && c(e);
    }
    function re(e, t, a) {
      e === "focusin" ? (ae(), I(t, a)) : e === "focusout" && ae();
    }
    function we(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return S(l);
    }
    function Ne(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function Ue(e, t) {
      if (e === "click")
        return S(t);
    }
    function Bn(e, t) {
      if (e === "input" || e === "change")
        return S(t);
    }
    function U(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || Ke(e, "number", e.value);
    }
    function A(e, t, a, i, u, s, d) {
      var v = a ? Tf(a) : window, m, E;
      if (o(v) ? m = R : jo(v) ? k ? m = Bn : (m = we, E = re) : Ne(v) && (m = Ue), m) {
        var b = m(t, a);
        if (b) {
          n(e, b, i, u);
          return;
        }
      }
      E && E(t, v, a), t === "focusout" && U(v);
    }
    function H() {
      jn("onMouseEnter", [
        "mouseout",
        "mouseover"
      ]), jn("onMouseLeave", [
        "mouseout",
        "mouseover"
      ]), jn("onPointerEnter", [
        "pointerout",
        "pointerover"
      ]), jn("onPointerLeave", [
        "pointerout",
        "pointerover"
      ]);
    }
    function pe(e, t, a, i, u, s, d) {
      var v = t === "mouseover" || t === "pointerover", m = t === "mouseout" || t === "pointerout";
      if (v && !Wv(i)) {
        var E = i.relatedTarget || i.fromElement;
        if (E && (Ys(E) || Tp(E)))
          return;
      }
      if (!(!m && !v)) {
        var b;
        if (u.window === u)
          b = u;
        else {
          var z = u.ownerDocument;
          z ? b = z.defaultView || z.parentWindow : b = window;
        }
        var L, B;
        if (m) {
          var $ = i.relatedTarget || i.toElement;
          if (L = a, B = $ ? Ys($) : null, B !== null) {
            var W = ba(B);
            (B !== W || B.tag !== ve && B.tag !== ke) && (B = null);
          }
        } else
          L = null, B = a;
        if (L !== B) {
          var xe = Wl, qe = "onMouseLeave", Be = "onMouseEnter", Ut = "mouse";
          (t === "pointerout" || t === "pointerover") && (xe = up, qe = "onPointerLeave", Be = "onPointerEnter", Ut = "pointer");
          var Mt = L == null ? b : Tf(L), P = B == null ? b : Tf(B), G = new xe(qe, Ut + "leave", L, i, u);
          G.target = Mt, G.relatedTarget = P;
          var j = null, ue = Ys(u);
          if (ue === a) {
            var De = new xe(Be, Ut + "enter", B, i, u);
            De.target = P, De.relatedTarget = Mt, j = De;
          }
          F1(e, G, j, L, B);
        }
      }
    }
    function Fe(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var Le = typeof Object.is == "function" ? Object.is : Fe;
    function Ie(e, t) {
      if (Le(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var u = 0; u < a.length; u++) {
        var s = a[u];
        if (!In.call(t, s) || !Le(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function ut(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function hr(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function $t(e, t) {
      for (var a = ut(e), i = 0, u = 0; a; ) {
        if (a.nodeType === Ii) {
          if (u = i + a.textContent.length, i <= t && u >= t)
            return {
              node: a,
              offset: t - i
            };
          i = u;
        }
        a = ut(hr(a));
      }
    }
    function Ql(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var u = i.anchorNode, s = i.anchorOffset, d = i.focusNode, v = i.focusOffset;
      try {
        u.nodeType, d.nodeType;
      } catch {
        return null;
      }
      return rg(e, u, s, d, v);
    }
    function rg(e, t, a, i, u) {
      var s = 0, d = -1, v = -1, m = 0, E = 0, b = e, z = null;
      e:
        for (; ; ) {
          for (var L = null; b === t && (a === 0 || b.nodeType === Ii) && (d = s + a), b === i && (u === 0 || b.nodeType === Ii) && (v = s + u), b.nodeType === Ii && (s += b.nodeValue.length), (L = b.firstChild) !== null; )
            z = b, b = L;
          for (; ; ) {
            if (b === e)
              break e;
            if (z === t && ++m === a && (d = s), z === i && ++E === u && (v = s), (L = b.nextSibling) !== null)
              break;
            b = z, z = b.parentNode;
          }
          b = L;
        }
      return d === -1 || v === -1 ? null : {
        start: d,
        end: v
      };
    }
    function C1(e, t) {
      var a = e.ownerDocument || document, i = a && a.defaultView || window;
      if (i.getSelection) {
        var u = i.getSelection(), s = e.textContent.length, d = Math.min(t.start, s), v = t.end === void 0 ? d : Math.min(t.end, s);
        if (!u.extend && d > v) {
          var m = v;
          v = d, d = m;
        }
        var E = $t(e, d), b = $t(e, v);
        if (E && b) {
          if (u.rangeCount === 1 && u.anchorNode === E.node && u.anchorOffset === E.offset && u.focusNode === b.node && u.focusOffset === b.offset)
            return;
          var z = a.createRange();
          z.setStart(E.node, E.offset), u.removeAllRanges(), d > v ? (u.addRange(z), u.extend(b.node, b.offset)) : (z.setEnd(b.node, b.offset), u.addRange(z));
        }
      }
    }
    function SC(e) {
      return e && e.nodeType === Ii;
    }
    function CC(e, t) {
      return !e || !t ? !1 : e === t ? !0 : SC(e) ? !1 : SC(t) ? CC(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function E1(e) {
      return e && e.ownerDocument && CC(e.ownerDocument.documentElement, e);
    }
    function _1(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function EC() {
      for (var e = window, t = xl(); t instanceof e.HTMLIFrameElement; ) {
        if (_1(t))
          e = t.contentWindow;
        else
          return t;
        t = xl(e.document);
      }
      return t;
    }
    function ag(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function b1() {
      var e = EC();
      return {
        focusedElem: e,
        selectionRange: ag(e) ? R1(e) : null
      };
    }
    function w1(e) {
      var t = EC(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && E1(a)) {
        i !== null && ag(a) && T1(a, i);
        for (var u = [], s = a; s = s.parentNode; )
          s.nodeType === ia && u.push({
            element: s,
            left: s.scrollLeft,
            top: s.scrollTop
          });
        typeof a.focus == "function" && a.focus();
        for (var d = 0; d < u.length; d++) {
          var v = u[d];
          v.element.scrollLeft = v.left, v.element.scrollTop = v.top;
        }
      }
    }
    function R1(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = Ql(e), t || {
        start: 0,
        end: 0
      };
    }
    function T1(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : C1(e, t);
    }
    var x1 = cn && "documentMode" in document && document.documentMode <= 11;
    function D1() {
      Zn("onSelect", [
        "focusout",
        "contextmenu",
        "dragend",
        "focusin",
        "keydown",
        "keyup",
        "mousedown",
        "mouseup",
        "selectionchange"
      ]);
    }
    var Ef = null, ig = null, pp = null, lg = !1;
    function O1(e) {
      if ("selectionStart" in e && ag(e))
        return {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      var t = e.ownerDocument && e.ownerDocument.defaultView || window, a = t.getSelection();
      return {
        anchorNode: a.anchorNode,
        anchorOffset: a.anchorOffset,
        focusNode: a.focusNode,
        focusOffset: a.focusOffset
      };
    }
    function k1(e) {
      return e.window === e ? e.document : e.nodeType === ui ? e : e.ownerDocument;
    }
    function _C(e, t, a) {
      var i = k1(a);
      if (!(lg || Ef == null || Ef !== xl(i))) {
        var u = O1(Ef);
        if (!pp || !Ie(pp, u)) {
          pp = u;
          var s = Lh(ig, "onSelect");
          if (s.length > 0) {
            var d = new Hr("onSelect", "select", null, t, a);
            e.push({
              event: d,
              listeners: s
            }), d.target = Ef;
          }
        }
      }
    }
    function M1(e, t, a, i, u, s, d) {
      var v = a ? Tf(a) : window;
      switch (t) {
        case "focusin":
          (jo(v) || v.contentEditable === "true") && (Ef = v, ig = a, pp = null);
          break;
        case "focusout":
          Ef = null, ig = null, pp = null;
          break;
        case "mousedown":
          lg = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          lg = !1, _C(e, i, u);
          break;
        case "selectionchange":
          if (x1)
            break;
        case "keydown":
        case "keyup":
          _C(e, i, u);
      }
    }
    function kh(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var _f = {
      animationend: kh("Animation", "AnimationEnd"),
      animationiteration: kh("Animation", "AnimationIteration"),
      animationstart: kh("Animation", "AnimationStart"),
      transitionend: kh("Transition", "TransitionEnd")
    }, ug = {}, bC = {};
    cn && (bC = document.createElement("div").style, "AnimationEvent" in window || (delete _f.animationend.animation, delete _f.animationiteration.animation, delete _f.animationstart.animation), "TransitionEvent" in window || delete _f.transitionend.transition);
    function Mh(e) {
      if (ug[e])
        return ug[e];
      if (!_f[e])
        return e;
      var t = _f[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in bC)
          return ug[e] = t[a];
      return e;
    }
    var wC = Mh("animationend"), RC = Mh("animationiteration"), TC = Mh("animationstart"), xC = Mh("transitionend"), DC = /* @__PURE__ */ new Map(), OC = [
      "abort",
      "auxClick",
      "cancel",
      "canPlay",
      "canPlayThrough",
      "click",
      "close",
      "contextMenu",
      "copy",
      "cut",
      "drag",
      "dragEnd",
      "dragEnter",
      "dragExit",
      "dragLeave",
      "dragOver",
      "dragStart",
      "drop",
      "durationChange",
      "emptied",
      "encrypted",
      "ended",
      "error",
      "gotPointerCapture",
      "input",
      "invalid",
      "keyDown",
      "keyPress",
      "keyUp",
      "load",
      "loadedData",
      "loadedMetadata",
      "loadStart",
      "lostPointerCapture",
      "mouseDown",
      "mouseMove",
      "mouseOut",
      "mouseOver",
      "mouseUp",
      "paste",
      "pause",
      "play",
      "playing",
      "pointerCancel",
      "pointerDown",
      "pointerMove",
      "pointerOut",
      "pointerOver",
      "pointerUp",
      "progress",
      "rateChange",
      "reset",
      "resize",
      "seeked",
      "seeking",
      "stalled",
      "submit",
      "suspend",
      "timeUpdate",
      "touchCancel",
      "touchEnd",
      "touchStart",
      "volumeChange",
      "scroll",
      "toggle",
      "touchMove",
      "waiting",
      "wheel"
    ];
    function Fo(e, t) {
      DC.set(e, t), Zn(t, [
        e
      ]);
    }
    function N1() {
      for (var e = 0; e < OC.length; e++) {
        var t = OC[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        Fo(a, "on" + i);
      }
      Fo(wC, "onAnimationEnd"), Fo(RC, "onAnimationIteration"), Fo(TC, "onAnimationStart"), Fo("dblclick", "onDoubleClick"), Fo("focusin", "onFocus"), Fo("focusout", "onBlur"), Fo(xC, "onTransitionEnd");
    }
    function L1(e, t, a, i, u, s, d) {
      var v = DC.get(t);
      if (v !== void 0) {
        var m = Hr, E = t;
        switch (t) {
          case "keypress":
            if (Mu(i) === 0)
              return;
          case "keydown":
          case "keyup":
            m = Xy;
            break;
          case "focusin":
            E = "focus", m = ff;
            break;
          case "focusout":
            E = "blur", m = ff;
            break;
          case "beforeblur":
          case "afterblur":
            m = ff;
            break;
          case "click":
            if (i.button === 2)
              return;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            m = Wl;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            m = Lu;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            m = Ga;
            break;
          case wC:
          case RC:
          case TC:
            m = df;
            break;
          case xC:
            m = Zy;
            break;
          case "scroll":
            m = np;
            break;
          case "wheel":
            m = vf;
            break;
          case "copy":
          case "cut":
          case "paste":
            m = Wy;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            m = up;
            break;
        }
        var b = (s & fu) !== 0;
        {
          var z = !b && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", L = P1(a, v, i.type, b, z);
          if (L.length > 0) {
            var B = new m(v, E, null, i, u);
            e.push({
              event: B,
              listeners: L
            });
          }
        }
      }
    }
    N1(), H(), Cf(), D1(), Th();
    function A1(e, t, a, i, u, s, d) {
      L1(e, t, a, i, u, s);
      var v = (s & Ly) === 0;
      v && (pe(e, t, a, i, u), A(e, t, a, i, u), M1(e, t, a, i, u), Sf(e, t, a, i, u));
    }
    var vp = [
      "abort",
      "canplay",
      "canplaythrough",
      "durationchange",
      "emptied",
      "encrypted",
      "ended",
      "error",
      "loadeddata",
      "loadedmetadata",
      "loadstart",
      "pause",
      "play",
      "playing",
      "progress",
      "ratechange",
      "resize",
      "seeked",
      "seeking",
      "stalled",
      "suspend",
      "timeupdate",
      "volumechange",
      "waiting"
    ], og = new Set([
      "cancel",
      "close",
      "invalid",
      "load",
      "scroll",
      "toggle"
    ].concat(vp));
    function kC(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Qi(i, t, void 0, e), e.currentTarget = null;
    }
    function z1(e, t, a) {
      var i;
      if (a)
        for (var u = t.length - 1; u >= 0; u--) {
          var s = t[u], d = s.instance, v = s.currentTarget, m = s.listener;
          if (d !== i && e.isPropagationStopped())
            return;
          kC(e, m, v), i = d;
        }
      else
        for (var E = 0; E < t.length; E++) {
          var b = t[E], z = b.instance, L = b.currentTarget, B = b.listener;
          if (z !== i && e.isPropagationStopped())
            return;
          kC(e, B, L), i = z;
        }
    }
    function MC(e, t) {
      for (var a = (t & fu) !== 0, i = 0; i < e.length; i++) {
        var u = e[i], s = u.event, d = u.listeners;
        z1(s, d, a);
      }
      wd();
    }
    function U1(e, t, a, i, u) {
      var s = Ec(a), d = [];
      A1(d, e, i, a, s, t), MC(d, t);
    }
    function Mn(e, t) {
      og.has(e) || C('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = dR(t), u = H1(e, a);
      i.has(u) || (NC(t, e, ps, a), i.add(u));
    }
    function sg(e, t, a) {
      og.has(e) && !t && C('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= fu), NC(a, e, i, t);
    }
    var Nh = "_reactListening" + Math.random().toString(36).slice(2);
    function hp(e) {
      if (!e[Nh]) {
        e[Nh] = !0, vt.forEach(function(a) {
          a !== "selectionchange" && (og.has(a) || sg(a, !1, e), sg(a, !0, e));
        });
        var t = e.nodeType === ui ? e : e.ownerDocument;
        t !== null && (t[Nh] || (t[Nh] = !0, sg("selectionchange", !1, t)));
      }
    }
    function NC(e, t, a, i, u) {
      var s = Mo(e, t, a), d = void 0;
      gs && (t === "touchstart" || t === "touchmove" || t === "wheel") && (d = !0), e = e, i ? d !== void 0 ? nl(e, t, s, d) : Lo(e, t, s) : d !== void 0 ? of(e, t, s, d) : tp(e, t, s);
    }
    function LC(e, t) {
      return e === t || e.nodeType === Qn && e.parentNode === t;
    }
    function cg(e, t, a, i, u) {
      var s = i;
      if (!(t & Wi) && !(t & ps)) {
        var d = u;
        if (i !== null) {
          var v = i;
          e:
            for (; ; ) {
              if (v === null)
                return;
              var m = v.tag;
              if (m === ee || m === de) {
                var E = v.stateNode.containerInfo;
                if (LC(E, d))
                  break;
                if (m === de)
                  for (var b = v.return; b !== null; ) {
                    var z = b.tag;
                    if (z === ee || z === de) {
                      var L = b.stateNode.containerInfo;
                      if (LC(L, d))
                        return;
                    }
                    b = b.return;
                  }
                for (; E !== null; ) {
                  var B = Ys(E);
                  if (B === null)
                    return;
                  var $ = B.tag;
                  if ($ === ve || $ === ke) {
                    v = s = B;
                    continue e;
                  }
                  E = E.parentNode;
                }
              }
              v = v.return;
            }
        }
      }
      Cd(function() {
        return U1(e, t, a, s);
      });
    }
    function mp(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function P1(e, t, a, i, u, s) {
      for (var d = t !== null ? t + "Capture" : null, v = i ? d : t, m = [], E = e, b = null; E !== null; ) {
        var z = E, L = z.stateNode, B = z.tag;
        if (B === ve && L !== null && (b = L, v !== null)) {
          var $ = pu(E, v);
          $ != null && m.push(mp(E, $, b));
        }
        if (u)
          break;
        E = E.return;
      }
      return m;
    }
    function Lh(e, t) {
      for (var a = t + "Capture", i = [], u = e; u !== null; ) {
        var s = u, d = s.stateNode, v = s.tag;
        if (v === ve && d !== null) {
          var m = d, E = pu(u, a);
          E != null && i.unshift(mp(u, E, m));
          var b = pu(u, t);
          b != null && i.push(mp(u, b, m));
        }
        u = u.return;
      }
      return i;
    }
    function bf(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== ve);
      return e || null;
    }
    function j1(e, t) {
      for (var a = e, i = t, u = 0, s = a; s; s = bf(s))
        u++;
      for (var d = 0, v = i; v; v = bf(v))
        d++;
      for (; u - d > 0; )
        a = bf(a), u--;
      for (; d - u > 0; )
        i = bf(i), d--;
      for (var m = u; m--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = bf(a), i = bf(i);
      }
      return null;
    }
    function AC(e, t, a, i, u) {
      for (var s = t._reactName, d = [], v = a; v !== null && v !== i; ) {
        var m = v, E = m.alternate, b = m.stateNode, z = m.tag;
        if (E !== null && E === i)
          break;
        if (z === ve && b !== null) {
          var L = b;
          if (u) {
            var B = pu(v, s);
            B != null && d.unshift(mp(v, B, L));
          } else if (!u) {
            var $ = pu(v, s);
            $ != null && d.push(mp(v, $, L));
          }
        }
        v = v.return;
      }
      d.length !== 0 && e.push({
        event: t,
        listeners: d
      });
    }
    function F1(e, t, a, i, u) {
      var s = i && u ? j1(i, u) : null;
      i !== null && AC(e, t, i, s, !1), u !== null && a !== null && AC(e, a, u, s, !0);
    }
    function H1(e, t) {
      return e + "__" + (t ? "capture" : "bubble");
    }
    var Qa = !1, yp = "dangerouslySetInnerHTML", Ah = "suppressContentEditableWarning", Ho = "suppressHydrationWarning", zC = "autoFocus", $s = "children", Is = "style", zh = "__html", fg, Uh, gp, UC, Ph, PC, jC;
    fg = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, Uh = function(e, t) {
      Cc(e, t), hd(e, t), Yv(e, t, {
        registrationNameDependencies: Yt,
        possibleRegistrationNames: vn
      });
    }, PC = cn && !document.documentMode, gp = function(e, t, a) {
      if (!Qa) {
        var i = jh(a), u = jh(t);
        u !== i && (Qa = !0, C("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(u), JSON.stringify(i)));
      }
    }, UC = function(e) {
      if (!Qa) {
        Qa = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), C("Extra attributes from the server: %s", t);
      }
    }, Ph = function(e, t) {
      t === !1 ? C("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : C("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, jC = function(e, t) {
      var a = e.namespaceURI === $i ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var B1 = /\r\n?/g, V1 = /\u0000|\uFFFD/g;
    function jh(e) {
      Lr(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(B1, `
`).replace(V1, "");
    }
    function Fh(e, t, a, i) {
      var u = jh(t), s = jh(e);
      if (s !== u && (i && (Qa || (Qa = !0, C('Text content did not match. Server: "%s" Client: "%s"', s, u))), a && Oe))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function FC(e) {
      return e.nodeType === ui ? e : e.ownerDocument;
    }
    function $1() {
    }
    function Hh(e) {
      e.onclick = $1;
    }
    function I1(e, t, a, i, u) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var d = i[s];
          if (s === Is)
            d && Object.freeze(d), zv(t, d);
          else if (s === yp) {
            var v = d ? d[zh] : void 0;
            v != null && wv(t, v);
          } else if (s === $s)
            if (typeof d == "string") {
              var m = e !== "textarea" || d !== "";
              m && mc(t, d);
            } else
              typeof d == "number" && mc(t, "" + d);
          else
            s === Ah || s === Ho || s === zC || (Yt.hasOwnProperty(s) ? d != null && (typeof d != "function" && Ph(s, d), s === "onScroll" && Mn("scroll", t)) : d != null && Ca(t, s, d, u));
        }
    }
    function Y1(e, t, a, i) {
      for (var u = 0; u < t.length; u += 2) {
        var s = t[u], d = t[u + 1];
        s === Is ? zv(e, d) : s === yp ? wv(e, d) : s === $s ? mc(e, d) : Ca(e, s, d, i);
      }
    }
    function W1(e, t, a, i) {
      var u, s = FC(a), d, v = i;
      if (v === $i && (v = vc(e)), v === $i) {
        if (u = Yi(e, t), !u && e !== e.toLowerCase() && C("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
          var m = s.createElement("div");
          m.innerHTML = "<script><\/script>";
          var E = m.firstChild;
          d = m.removeChild(E);
        } else if (typeof t.is == "string")
          d = s.createElement(e, {
            is: t.is
          });
        else if (d = s.createElement(e), e === "select") {
          var b = d;
          t.multiple ? b.multiple = !0 : t.size && (b.size = t.size);
        }
      } else
        d = s.createElementNS(v, e);
      return v === $i && !u && Object.prototype.toString.call(d) === "[object HTMLUnknownElement]" && !In.call(fg, e) && (fg[e] = !0, C("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), d;
    }
    function G1(e, t) {
      return FC(t).createTextNode(e);
    }
    function Q1(e, t, a, i) {
      var u = Yi(t, a);
      Uh(t, a);
      var s;
      switch (t) {
        case "dialog":
          Mn("cancel", e), Mn("close", e), s = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          Mn("load", e), s = a;
          break;
        case "video":
        case "audio":
          for (var d = 0; d < vp.length; d++)
            Mn(vp[d], e);
          s = a;
          break;
        case "source":
          Mn("error", e), s = a;
          break;
        case "img":
        case "image":
        case "link":
          Mn("error", e), Mn("load", e), s = a;
          break;
        case "details":
          Mn("toggle", e), s = a;
          break;
        case "input":
          x(e, a), s = y(e, a), Mn("invalid", e);
          break;
        case "option":
          tn(e, a), s = a;
          break;
        case "select":
          ss(e, a), s = os(e, a), Mn("invalid", e);
          break;
        case "textarea":
          Ev(e, a), s = ld(e, a), Mn("invalid", e);
          break;
        default:
          s = a;
      }
      switch (gc(t, s), I1(t, e, i, s, u), t) {
        case "input":
          za(e), fe(e, a, !1);
          break;
        case "textarea":
          za(e), bv(e);
          break;
        case "option":
          un(e, a);
          break;
        case "select":
          ad(e, a);
          break;
        default:
          typeof s.onClick == "function" && Hh(e);
          break;
      }
    }
    function q1(e, t, a, i, u) {
      Uh(t, i);
      var s = null, d, v;
      switch (t) {
        case "input":
          d = y(e, a), v = y(e, i), s = [];
          break;
        case "select":
          d = os(e, a), v = os(e, i), s = [];
          break;
        case "textarea":
          d = ld(e, a), v = ld(e, i), s = [];
          break;
        default:
          d = a, v = i, typeof d.onClick != "function" && typeof v.onClick == "function" && Hh(e);
          break;
      }
      gc(t, v);
      var m, E, b = null;
      for (m in d)
        if (!(v.hasOwnProperty(m) || !d.hasOwnProperty(m) || d[m] == null))
          if (m === Is) {
            var z = d[m];
            for (E in z)
              z.hasOwnProperty(E) && (b || (b = {}), b[E] = "");
          } else
            m === yp || m === $s || m === Ah || m === Ho || m === zC || (Yt.hasOwnProperty(m) ? s || (s = []) : (s = s || []).push(m, null));
      for (m in v) {
        var L = v[m], B = d?.[m];
        if (!(!v.hasOwnProperty(m) || L === B || L == null && B == null))
          if (m === Is)
            if (L && Object.freeze(L), B) {
              for (E in B)
                B.hasOwnProperty(E) && (!L || !L.hasOwnProperty(E)) && (b || (b = {}), b[E] = "");
              for (E in L)
                L.hasOwnProperty(E) && B[E] !== L[E] && (b || (b = {}), b[E] = L[E]);
            } else
              b || (s || (s = []), s.push(m, b)), b = L;
          else if (m === yp) {
            var $ = L ? L[zh] : void 0, W = B ? B[zh] : void 0;
            $ != null && W !== $ && (s = s || []).push(m, $);
          } else
            m === $s ? (typeof L == "string" || typeof L == "number") && (s = s || []).push(m, "" + L) : m === Ah || m === Ho || (Yt.hasOwnProperty(m) ? (L != null && (typeof L != "function" && Ph(m, L), m === "onScroll" && Mn("scroll", e)), !s && B !== L && (s = [])) : (s = s || []).push(m, L));
      }
      return b && (fs(b, v[Is]), (s = s || []).push(Is, b)), s;
    }
    function X1(e, t, a, i, u) {
      a === "input" && u.type === "radio" && u.name != null && V(e, u);
      var s = Yi(a, i), d = Yi(a, u);
      switch (Y1(e, t, s, d), a) {
        case "input":
          Y(e, u);
          break;
        case "textarea":
          _v(e, u);
          break;
        case "select":
          by(e, u);
          break;
      }
    }
    function K1(e) {
      {
        var t = e.toLowerCase();
        return Sc.hasOwnProperty(t) && Sc[t] || null;
      }
    }
    function Z1(e, t, a, i, u, s, d) {
      var v, m;
      switch (v = Yi(t, a), Uh(t, a), t) {
        case "dialog":
          Mn("cancel", e), Mn("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          Mn("load", e);
          break;
        case "video":
        case "audio":
          for (var E = 0; E < vp.length; E++)
            Mn(vp[E], e);
          break;
        case "source":
          Mn("error", e);
          break;
        case "img":
        case "image":
        case "link":
          Mn("error", e), Mn("load", e);
          break;
        case "details":
          Mn("toggle", e);
          break;
        case "input":
          x(e, a), Mn("invalid", e);
          break;
        case "option":
          tn(e, a);
          break;
        case "select":
          ss(e, a), Mn("invalid", e);
          break;
        case "textarea":
          Ev(e, a), Mn("invalid", e);
          break;
      }
      gc(t, a);
      {
        m = /* @__PURE__ */ new Set();
        for (var b = e.attributes, z = 0; z < b.length; z++) {
          var L = b[z].name.toLowerCase();
          switch (L) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              m.add(b[z].name);
          }
        }
      }
      var B = null;
      for (var $ in a)
        if (a.hasOwnProperty($)) {
          var W = a[$];
          if ($ === $s)
            typeof W == "string" ? e.textContent !== W && (a[Ho] !== !0 && Fh(e.textContent, W, s, d), B = [
              $s,
              W
            ]) : typeof W == "number" && e.textContent !== "" + W && (a[Ho] !== !0 && Fh(e.textContent, W, s, d), B = [
              $s,
              "" + W
            ]);
          else if (Yt.hasOwnProperty($))
            W != null && (typeof W != "function" && Ph($, W), $ === "onScroll" && Mn("scroll", e));
          else if (d && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof v == "boolean") {
            var xe = void 0, qe = v && We ? null : Ce($);
            if (a[Ho] !== !0) {
              if (!($ === Ah || $ === Ho || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              $ === "value" || $ === "checked" || $ === "selected")) {
                if ($ === yp) {
                  var Be = e.innerHTML, Ut = W ? W[zh] : void 0;
                  if (Ut != null) {
                    var Mt = jC(e, Ut);
                    Mt !== Be && gp($, Be, Mt);
                  }
                } else if ($ === Is) {
                  if (m.delete($), PC) {
                    var P = My(W);
                    xe = e.getAttribute("style"), P !== xe && gp($, xe, P);
                  }
                } else if (v && !We)
                  m.delete($.toLowerCase()), xe = yi(e, $, W), W !== xe && gp($, xe, W);
                else if (!Ct($, qe, v) && !te($, W, qe, v)) {
                  var G = !1;
                  if (qe !== null)
                    m.delete(qe.attributeName), xe = Sa(e, $, W, qe);
                  else {
                    var j = i;
                    if (j === $i && (j = vc(t)), j === $i)
                      m.delete($.toLowerCase());
                    else {
                      var ue = K1($);
                      ue !== null && ue !== $ && (G = !0, m.delete(ue)), m.delete($);
                    }
                    xe = yi(e, $, W);
                  }
                  var De = We;
                  !De && W !== xe && !G && gp($, xe, W);
                }
              }
            }
          }
        }
      switch (d && m.size > 0 && a[Ho] !== !0 && UC(m), t) {
        case "input":
          za(e), fe(e, a, !0);
          break;
        case "textarea":
          za(e), bv(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && Hh(e);
          break;
      }
      return B;
    }
    function J1(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function dg(e, t) {
      {
        if (Qa)
          return;
        Qa = !0, C("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function pg(e, t) {
      {
        if (Qa)
          return;
        Qa = !0, C('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function vg(e, t, a) {
      {
        if (Qa)
          return;
        Qa = !0, C("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function hg(e, t) {
      {
        if (t === "" || Qa)
          return;
        Qa = !0, C('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function ew(e, t, a) {
      switch (t) {
        case "input":
          et(e, a);
          return;
        case "textarea":
          ud(e, a);
          return;
        case "select":
          wy(e, a);
          return;
      }
    }
    var Sp = function() {
    }, Cp = function() {
    };
    {
      var tw = [
        "address",
        "applet",
        "area",
        "article",
        "aside",
        "base",
        "basefont",
        "bgsound",
        "blockquote",
        "body",
        "br",
        "button",
        "caption",
        "center",
        "col",
        "colgroup",
        "dd",
        "details",
        "dir",
        "div",
        "dl",
        "dt",
        "embed",
        "fieldset",
        "figcaption",
        "figure",
        "footer",
        "form",
        "frame",
        "frameset",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "head",
        "header",
        "hgroup",
        "hr",
        "html",
        "iframe",
        "img",
        "input",
        "isindex",
        "li",
        "link",
        "listing",
        "main",
        "marquee",
        "menu",
        "menuitem",
        "meta",
        "nav",
        "noembed",
        "noframes",
        "noscript",
        "object",
        "ol",
        "p",
        "param",
        "plaintext",
        "pre",
        "script",
        "section",
        "select",
        "source",
        "style",
        "summary",
        "table",
        "tbody",
        "td",
        "template",
        "textarea",
        "tfoot",
        "th",
        "thead",
        "title",
        "tr",
        "track",
        "ul",
        "wbr",
        "xmp"
      ], HC = [
        "applet",
        "caption",
        "html",
        "table",
        "td",
        "th",
        "marquee",
        "object",
        "template",
        // TODO: Distinguish by namespace here -- for <title>, including it here
        // errs on the side of fewer warnings
        "foreignObject",
        "desc",
        "title"
      ], nw = HC.concat([
        "button"
      ]), rw = [
        "dd",
        "dt",
        "li",
        "option",
        "optgroup",
        "p",
        "rp",
        "rt"
      ], BC = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      Cp = function(e, t) {
        var a = Rt({}, e || BC), i = {
          tag: t
        };
        return HC.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), nw.indexOf(t) !== -1 && (a.pTagInButtonScope = null), tw.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var aw = function(e, t) {
        switch (t) {
          case "select":
            return e === "option" || e === "optgroup" || e === "#text";
          case "optgroup":
            return e === "option" || e === "#text";
          case "option":
            return e === "#text";
          case "tr":
            return e === "th" || e === "td" || e === "style" || e === "script" || e === "template";
          case "tbody":
          case "thead":
          case "tfoot":
            return e === "tr" || e === "style" || e === "script" || e === "template";
          case "colgroup":
            return e === "col" || e === "template";
          case "table":
            return e === "caption" || e === "colgroup" || e === "tbody" || e === "tfoot" || e === "thead" || e === "style" || e === "script" || e === "template";
          case "head":
            return e === "base" || e === "basefont" || e === "bgsound" || e === "link" || e === "meta" || e === "title" || e === "noscript" || e === "noframes" || e === "style" || e === "script" || e === "template";
          case "html":
            return e === "head" || e === "body" || e === "frameset";
          case "frameset":
            return e === "frame";
          case "#document":
            return e === "html";
        }
        switch (e) {
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t !== "h1" && t !== "h2" && t !== "h3" && t !== "h4" && t !== "h5" && t !== "h6";
          case "rp":
          case "rt":
            return rw.indexOf(t) === -1;
          case "body":
          case "caption":
          case "col":
          case "colgroup":
          case "frameset":
          case "frame":
          case "head":
          case "html":
          case "tbody":
          case "td":
          case "tfoot":
          case "th":
          case "thead":
          case "tr":
            return t == null;
        }
        return !0;
      }, iw = function(e, t) {
        switch (e) {
          case "address":
          case "article":
          case "aside":
          case "blockquote":
          case "center":
          case "details":
          case "dialog":
          case "dir":
          case "div":
          case "dl":
          case "fieldset":
          case "figcaption":
          case "figure":
          case "footer":
          case "header":
          case "hgroup":
          case "main":
          case "menu":
          case "nav":
          case "ol":
          case "p":
          case "section":
          case "summary":
          case "ul":
          case "pre":
          case "listing":
          case "table":
          case "hr":
          case "xmp":
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t.pTagInButtonScope;
          case "form":
            return t.formTag || t.pTagInButtonScope;
          case "li":
            return t.listItemTagAutoclosing;
          case "dd":
          case "dt":
            return t.dlItemTagAutoclosing;
          case "button":
            return t.buttonTagInScope;
          case "a":
            return t.aTagInScope;
          case "nobr":
            return t.nobrTagInScope;
        }
        return null;
      }, VC = {};
      Sp = function(e, t, a) {
        a = a || BC;
        var i = a.current, u = i && i.tag;
        t != null && (e != null && C("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = aw(e, u) ? null : i, d = s ? null : iw(e, a), v = s || d;
        if (v) {
          var m = v.tag, E = !!s + "|" + e + "|" + m;
          if (!VC[E]) {
            VC[E] = !0;
            var b = e, z = "";
            if (e === "#text" ? /\S/.test(t) ? b = "Text nodes" : (b = "Whitespace text nodes", z = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : b = "<" + e + ">", s) {
              var L = "";
              m === "table" && e === "tr" && (L += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), C("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", b, m, z, L);
            } else
              C("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", b, m);
          }
        }
      };
    }
    var Bh = "suppressHydrationWarning", Vh = "$", $h = "/$", Ep = "$?", _p = "$!", lw = "style", mg = null, yg = null;
    function uw(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case ui:
        case su: {
          t = i === ui ? "#document" : "#fragment";
          var u = e.documentElement;
          a = u ? u.namespaceURI : sd(null, "");
          break;
        }
        default: {
          var s = i === Qn ? e.parentNode : e, d = s.namespaceURI || null;
          t = s.tagName, a = sd(d, t);
          break;
        }
      }
      {
        var v = t.toLowerCase(), m = Cp(null, v);
        return {
          namespace: a,
          ancestorInfo: m
        };
      }
    }
    function ow(e, t, a) {
      {
        var i = e, u = sd(i.namespace, t), s = Cp(i.ancestorInfo, t);
        return {
          namespace: u,
          ancestorInfo: s
        };
      }
    }
    function Tk(e) {
      return e;
    }
    function sw(e) {
      mg = xa(), yg = b1();
      var t = null;
      return vr(!1), t;
    }
    function cw(e) {
      w1(yg), vr(mg), mg = null, yg = null;
    }
    function fw(e, t, a, i, u) {
      var s;
      {
        var d = i;
        if (Sp(e, null, d.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var v = "" + t.children, m = Cp(d.ancestorInfo, e);
          Sp(null, v, m);
        }
        s = d.namespace;
      }
      var E = W1(e, t, a, s);
      return Rp(u, E), Rg(E, t), E;
    }
    function dw(e, t) {
      e.appendChild(t);
    }
    function pw(e, t, a, i, u) {
      switch (Q1(e, t, a, i), t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          return !!a.autoFocus;
        case "img":
          return !0;
        default:
          return !1;
      }
    }
    function vw(e, t, a, i, u, s) {
      {
        var d = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var v = "" + i.children, m = Cp(d.ancestorInfo, t);
          Sp(null, v, m);
        }
      }
      return q1(e, t, a, i);
    }
    function gg(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function hw(e, t, a, i) {
      {
        var u = a;
        Sp(null, e, u.ancestorInfo);
      }
      var s = G1(e, t);
      return Rp(i, s), s;
    }
    function mw() {
      var e = window.event;
      return e === void 0 ? Ji : Wr(e.type);
    }
    var Sg = typeof setTimeout == "function" ? setTimeout : void 0, yw = typeof clearTimeout == "function" ? clearTimeout : void 0, Cg = -1, $C = typeof Promise == "function" ? Promise : void 0, gw = typeof queueMicrotask == "function" ? queueMicrotask : typeof $C < "u" ? function(e) {
      return $C.resolve(null).then(e).catch(Sw);
    } : Sg;
    function Sw(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function Cw(e, t, a, i) {
      switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && e.focus();
          return;
        case "img": {
          a.src && (e.src = a.src);
          return;
        }
      }
    }
    function Ew(e, t, a, i, u, s) {
      X1(e, t, a, i, u), Rg(e, u);
    }
    function IC(e) {
      mc(e, "");
    }
    function _w(e, t, a) {
      e.nodeValue = a;
    }
    function bw(e, t) {
      e.appendChild(t);
    }
    function ww(e, t) {
      var a;
      e.nodeType === Qn ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && Hh(a);
    }
    function Rw(e, t, a) {
      e.insertBefore(t, a);
    }
    function Tw(e, t, a) {
      e.nodeType === Qn ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function xw(e, t) {
      e.removeChild(t);
    }
    function Dw(e, t) {
      e.nodeType === Qn ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function Eg(e, t) {
      var a = t, i = 0;
      do {
        var u = a.nextSibling;
        if (e.removeChild(a), u && u.nodeType === Qn) {
          var s = u.data;
          if (s === $h)
            if (i === 0) {
              e.removeChild(u), kt(t);
              return;
            } else
              i--;
          else
            (s === Vh || s === Ep || s === _p) && i++;
        }
        a = u;
      } while (a);
      kt(t);
    }
    function Ow(e, t) {
      e.nodeType === Qn ? Eg(e.parentNode, t) : e.nodeType === ia && Eg(e, t), kt(e);
    }
    function kw(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function Mw(e) {
      e.nodeValue = "";
    }
    function Nw(e, t) {
      e = e;
      var a = t[lw], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = yc("display", i);
    }
    function Lw(e, t) {
      e.nodeValue = t;
    }
    function Aw(e) {
      e.nodeType === ia ? e.textContent = "" : e.nodeType === ui && e.documentElement && e.removeChild(e.documentElement);
    }
    function zw(e, t, a) {
      return e.nodeType !== ia || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function Uw(e, t) {
      return t === "" || e.nodeType !== Ii ? null : e;
    }
    function Pw(e) {
      return e.nodeType !== Qn ? null : e;
    }
    function YC(e) {
      return e.data === Ep;
    }
    function _g(e) {
      return e.data === _p;
    }
    function jw(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, u;
      return t && (a = t.dgst, i = t.msg, u = t.stck), {
        message: i,
        digest: a,
        stack: u
      };
    }
    function Fw(e, t) {
      e._reactRetry = t;
    }
    function Ih(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === ia || t === Ii)
          break;
        if (t === Qn) {
          var a = e.data;
          if (a === Vh || a === _p || a === Ep)
            break;
          if (a === $h)
            return null;
        }
      }
      return e;
    }
    function bp(e) {
      return Ih(e.nextSibling);
    }
    function Hw(e) {
      return Ih(e.firstChild);
    }
    function Bw(e) {
      return Ih(e.firstChild);
    }
    function Vw(e) {
      return Ih(e.nextSibling);
    }
    function $w(e, t, a, i, u, s, d) {
      Rp(s, e), Rg(e, a);
      var v;
      {
        var m = u;
        v = m.namespace;
      }
      var E = (s.mode & xt) !== Ze;
      return Z1(e, t, a, v, i, E, d);
    }
    function Iw(e, t, a, i) {
      return Rp(a, e), a.mode & xt, J1(e, t);
    }
    function Yw(e, t) {
      Rp(t, e);
    }
    function Ww(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === Qn) {
          var i = t.data;
          if (i === $h) {
            if (a === 0)
              return bp(t);
            a--;
          } else
            (i === Vh || i === _p || i === Ep) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function WC(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === Qn) {
          var i = t.data;
          if (i === Vh || i === _p || i === Ep) {
            if (a === 0)
              return t;
            a--;
          } else
            i === $h && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function Gw(e) {
      kt(e);
    }
    function Qw(e) {
      kt(e);
    }
    function qw(e) {
      return e !== "head" && e !== "body";
    }
    function Xw(e, t, a, i) {
      var u = !0;
      Fh(t.nodeValue, a, i, u);
    }
    function Kw(e, t, a, i, u, s) {
      if (t[Bh] !== !0) {
        var d = !0;
        Fh(i.nodeValue, u, s, d);
      }
    }
    function Zw(e, t) {
      t.nodeType === ia ? dg(e, t) : t.nodeType === Qn || pg(e, t);
    }
    function Jw(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === ia ? dg(a, t) : t.nodeType === Qn || pg(a, t));
      }
    }
    function eR(e, t, a, i, u) {
      (u || t[Bh] !== !0) && (i.nodeType === ia ? dg(a, i) : i.nodeType === Qn || pg(a, i));
    }
    function tR(e, t, a) {
      vg(e, t);
    }
    function nR(e, t) {
      hg(e, t);
    }
    function rR(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && vg(i, t);
      }
    }
    function aR(e, t) {
      {
        var a = e.parentNode;
        a !== null && hg(a, t);
      }
    }
    function iR(e, t, a, i, u, s) {
      (s || t[Bh] !== !0) && vg(a, i);
    }
    function lR(e, t, a, i, u) {
      (u || t[Bh] !== !0) && hg(a, i);
    }
    function uR(e) {
      C("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function oR(e) {
      hp(e);
    }
    var wf = Math.random().toString(36).slice(2), Rf = "__reactFiber$" + wf, bg = "__reactProps$" + wf, wp = "__reactContainer$" + wf, wg = "__reactEvents$" + wf, sR = "__reactListeners$" + wf, cR = "__reactHandles$" + wf;
    function fR(e) {
      delete e[Rf], delete e[bg], delete e[wg], delete e[sR], delete e[cR];
    }
    function Rp(e, t) {
      t[Rf] = e;
    }
    function Yh(e, t) {
      t[wp] = e;
    }
    function GC(e) {
      e[wp] = null;
    }
    function Tp(e) {
      return !!e[wp];
    }
    function Ys(e) {
      var t = e[Rf];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[wp] || a[Rf], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var u = WC(e); u !== null; ) {
              var s = u[Rf];
              if (s)
                return s;
              u = WC(u);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function Bo(e) {
      var t = e[Rf] || e[wp];
      return t && (t.tag === ve || t.tag === ke || t.tag === je || t.tag === ee) ? t : null;
    }
    function Tf(e) {
      if (e.tag === ve || e.tag === ke)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function Wh(e) {
      return e[bg] || null;
    }
    function Rg(e, t) {
      e[bg] = t;
    }
    function dR(e) {
      var t = e[wg];
      return t === void 0 && (t = e[wg] = /* @__PURE__ */ new Set()), t;
    }
    var QC = {}, qC = h.ReactDebugCurrentFrame;
    function Gh(e) {
      if (e) {
        var t = e._owner, a = _i(e.type, e._source, t ? t.type : null);
        qC.setExtraStackFrame(a);
      } else
        qC.setExtraStackFrame(null);
    }
    function al(e, t, a, i, u) {
      {
        var s = Function.call.bind(In);
        for (var d in e)
          if (s(e, d)) {
            var v = void 0;
            try {
              if (typeof e[d] != "function") {
                var m = Error((i || "React class") + ": " + a + " type `" + d + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[d] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw m.name = "Invariant Violation", m;
              }
              v = e[d](t, d, i, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (E) {
              v = E;
            }
            v && !(v instanceof Error) && (Gh(u), C("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, d, typeof v), Gh(null)), v instanceof Error && !(v.message in QC) && (QC[v.message] = !0, Gh(u), C("Failed %s type: %s", a, v.message), Gh(null));
          }
      }
    }
    var Tg = [], Qh;
    Qh = [];
    var Pu = -1;
    function Vo(e) {
      return {
        current: e
      };
    }
    function va(e, t) {
      if (Pu < 0) {
        C("Unexpected pop.");
        return;
      }
      t !== Qh[Pu] && C("Unexpected Fiber popped."), e.current = Tg[Pu], Tg[Pu] = null, Qh[Pu] = null, Pu--;
    }
    function ha(e, t, a) {
      Pu++, Tg[Pu] = e.current, Qh[Pu] = a, e.current = t;
    }
    var xg;
    xg = {};
    var di = {};
    Object.freeze(di);
    var ju = Vo(di), ql = Vo(!1), Dg = di;
    function xf(e, t, a) {
      return a && Xl(t) ? Dg : ju.current;
    }
    function XC(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function Df(e, t) {
      {
        var a = e.type, i = a.contextTypes;
        if (!i)
          return di;
        var u = e.stateNode;
        if (u && u.__reactInternalMemoizedUnmaskedChildContext === t)
          return u.__reactInternalMemoizedMaskedChildContext;
        var s = {};
        for (var d in i)
          s[d] = t[d];
        {
          var v = ft(e) || "Unknown";
          al(i, s, "context", v);
        }
        return u && XC(e, t, s), s;
      }
    }
    function qh() {
      return ql.current;
    }
    function Xl(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Xh(e) {
      va(ql, e), va(ju, e);
    }
    function Og(e) {
      va(ql, e), va(ju, e);
    }
    function KC(e, t, a) {
      {
        if (ju.current !== di)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        ha(ju, t, e), ha(ql, a, e);
      }
    }
    function ZC(e, t, a) {
      {
        var i = e.stateNode, u = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = ft(e) || "Unknown";
            xg[s] || (xg[s] = !0, C("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var d = i.getChildContext();
        for (var v in d)
          if (!(v in u))
            throw new Error((ft(e) || "Unknown") + '.getChildContext(): key "' + v + '" is not defined in childContextTypes.');
        {
          var m = ft(e) || "Unknown";
          al(u, d, "child context", m);
        }
        return Rt({}, a, d);
      }
    }
    function Kh(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || di;
        return Dg = ju.current, ha(ju, a, e), ha(ql, ql.current, e), !0;
      }
    }
    function JC(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var u = ZC(e, t, Dg);
          i.__reactInternalMemoizedMergedChildContext = u, va(ql, e), va(ju, e), ha(ju, u, e), ha(ql, a, e);
        } else
          va(ql, e), ha(ql, a, e);
      }
    }
    function pR(e) {
      {
        if (!Od(e) || e.tag !== ie)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case ee:
              return t.stateNode.context;
            case ie: {
              var a = t.type;
              if (Xl(a))
                return t.stateNode.__reactInternalMemoizedMergedChildContext;
              break;
            }
          }
          t = t.return;
        } while (t !== null);
        throw new Error("Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    var $o = 0, Zh = 1, Fu = null, kg = !1, Mg = !1;
    function eE(e) {
      Fu === null ? Fu = [
        e
      ] : Fu.push(e);
    }
    function vR(e) {
      kg = !0, eE(e);
    }
    function tE() {
      kg && Io();
    }
    function Io() {
      if (!Mg && Fu !== null) {
        Mg = !0;
        var e = 0, t = Ia();
        try {
          var a = !0, i = Fu;
          for (rr(zr); e < i.length; e++) {
            var u = i[e];
            do
              u = u(a);
            while (u !== null);
          }
          Fu = null, kg = !1;
        } catch (s) {
          throw Fu !== null && (Fu = Fu.slice(e + 1)), Dc(kc, Io), s;
        } finally {
          rr(t), Mg = !1;
        }
      }
      return null;
    }
    var Of = [], kf = 0, Jh = null, em = 0, Mi = [], Ni = 0, Ws = null, Hu = 1, Bu = "";
    function hR(e) {
      return Qs(), (e.flags & Td) !== Ye;
    }
    function mR(e) {
      return Qs(), em;
    }
    function yR() {
      var e = Bu, t = Hu, a = t & ~gR(t);
      return a.toString(32) + e;
    }
    function Gs(e, t) {
      Qs(), Of[kf++] = em, Of[kf++] = Jh, Jh = e, em = t;
    }
    function nE(e, t, a) {
      Qs(), Mi[Ni++] = Hu, Mi[Ni++] = Bu, Mi[Ni++] = Ws, Ws = e;
      var i = Hu, u = Bu, s = tm(i) - 1, d = i & ~(1 << s), v = a + 1, m = tm(t) + s;
      if (m > 30) {
        var E = s - s % 5, b = (1 << E) - 1, z = (d & b).toString(32), L = d >> E, B = s - E, $ = tm(t) + B, W = v << B, xe = W | L, qe = z + u;
        Hu = 1 << $ | xe, Bu = qe;
      } else {
        var Be = v << s, Ut = Be | d, Mt = u;
        Hu = 1 << m | Ut, Bu = Mt;
      }
    }
    function Ng(e) {
      Qs();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        Gs(e, a), nE(e, a, i);
      }
    }
    function tm(e) {
      return 32 - Uc(e);
    }
    function gR(e) {
      return 1 << tm(e) - 1;
    }
    function Lg(e) {
      for (; e === Jh; )
        Jh = Of[--kf], Of[kf] = null, em = Of[--kf], Of[kf] = null;
      for (; e === Ws; )
        Ws = Mi[--Ni], Mi[Ni] = null, Bu = Mi[--Ni], Mi[Ni] = null, Hu = Mi[--Ni], Mi[Ni] = null;
    }
    function SR() {
      return Qs(), Ws !== null ? {
        id: Hu,
        overflow: Bu
      } : null;
    }
    function CR(e, t) {
      Qs(), Mi[Ni++] = Hu, Mi[Ni++] = Bu, Mi[Ni++] = Ws, Hu = t.id, Bu = t.overflow, Ws = e;
    }
    function Qs() {
      Qr() || C("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Gr = null, Li = null, il = !1, qs = !1, Yo = null;
    function ER() {
      il && C("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function rE() {
      qs = !0;
    }
    function _R() {
      return qs;
    }
    function bR(e) {
      var t = e.stateNode.containerInfo;
      return Li = Bw(t), Gr = e, il = !0, Yo = null, qs = !1, !0;
    }
    function wR(e, t, a) {
      return Li = Vw(t), Gr = e, il = !0, Yo = null, qs = !1, a !== null && CR(e, a), !0;
    }
    function aE(e, t) {
      switch (e.tag) {
        case ee: {
          Zw(e.stateNode.containerInfo, t);
          break;
        }
        case ve: {
          var a = (e.mode & xt) !== Ze;
          eR(e.type, e.memoizedProps, e.stateNode, t, a);
          break;
        }
        case je: {
          var i = e.memoizedState;
          i.dehydrated !== null && Jw(i.dehydrated, t);
          break;
        }
      }
    }
    function iE(e, t) {
      aE(e, t);
      var a = xD();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [
        a
      ], e.flags |= qt) : i.push(a);
    }
    function Ag(e, t) {
      {
        if (qs)
          return;
        switch (e.tag) {
          case ee: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case ve:
                var i = t.type;
                t.pendingProps, tR(a, i);
                break;
              case ke:
                var u = t.pendingProps;
                nR(a, u);
                break;
            }
            break;
          }
          case ve: {
            var s = e.type, d = e.memoizedProps, v = e.stateNode;
            switch (t.tag) {
              case ve: {
                var m = t.type, E = t.pendingProps, b = (e.mode & xt) !== Ze;
                iR(s, d, v, m, E, b);
                break;
              }
              case ke: {
                var z = t.pendingProps, L = (e.mode & xt) !== Ze;
                lR(s, d, v, z, L);
                break;
              }
            }
            break;
          }
          case je: {
            var B = e.memoizedState, $ = B.dehydrated;
            if ($ !== null)
              switch (t.tag) {
                case ve:
                  var W = t.type;
                  t.pendingProps, rR($, W);
                  break;
                case ke:
                  var xe = t.pendingProps;
                  aR($, xe);
                  break;
              }
            break;
          }
          default:
            return;
        }
      }
    }
    function lE(e, t) {
      t.flags = t.flags & ~Fa | mn, Ag(e, t);
    }
    function uE(e, t) {
      switch (e.tag) {
        case ve: {
          var a = e.type;
          e.pendingProps;
          var i = zw(t, a);
          return i !== null ? (e.stateNode = i, Gr = e, Li = Hw(i), !0) : !1;
        }
        case ke: {
          var u = e.pendingProps, s = Uw(t, u);
          return s !== null ? (e.stateNode = s, Gr = e, Li = null, !0) : !1;
        }
        case je: {
          var d = Pw(t);
          if (d !== null) {
            var v = {
              dehydrated: d,
              treeContext: SR(),
              retryLane: da
            };
            e.memoizedState = v;
            var m = DD(d);
            return m.return = e, e.child = m, Gr = e, Li = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function zg(e) {
      return (e.mode & xt) !== Ze && (e.flags & lt) === Ye;
    }
    function Ug(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function Pg(e) {
      if (il) {
        var t = Li;
        if (!t) {
          zg(e) && (Ag(Gr, e), Ug()), lE(Gr, e), il = !1, Gr = e;
          return;
        }
        var a = t;
        if (!uE(e, t)) {
          zg(e) && (Ag(Gr, e), Ug()), t = bp(a);
          var i = Gr;
          if (!t || !uE(e, t)) {
            lE(Gr, e), il = !1, Gr = e;
            return;
          }
          iE(i, a);
        }
      }
    }
    function RR(e, t, a) {
      var i = e.stateNode, u = !qs, s = $w(i, e.type, e.memoizedProps, t, a, e, u);
      return e.updateQueue = s, s !== null;
    }
    function TR(e) {
      var t = e.stateNode, a = e.memoizedProps, i = Iw(t, a, e);
      if (i) {
        var u = Gr;
        if (u !== null)
          switch (u.tag) {
            case ee: {
              var s = u.stateNode.containerInfo, d = (u.mode & xt) !== Ze;
              Xw(s, t, a, d);
              break;
            }
            case ve: {
              var v = u.type, m = u.memoizedProps, E = u.stateNode, b = (u.mode & xt) !== Ze;
              Kw(v, m, E, t, a, b);
              break;
            }
          }
      }
      return i;
    }
    function xR(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      Yw(a, e);
    }
    function DR(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return Ww(a);
    }
    function oE(e) {
      for (var t = e.return; t !== null && t.tag !== ve && t.tag !== ee && t.tag !== je; )
        t = t.return;
      Gr = t;
    }
    function nm(e) {
      if (e !== Gr)
        return !1;
      if (!il)
        return oE(e), il = !0, !1;
      if (e.tag !== ee && (e.tag !== ve || qw(e.type) && !gg(e.type, e.memoizedProps))) {
        var t = Li;
        if (t)
          if (zg(e))
            sE(e), Ug();
          else
            for (; t; )
              iE(e, t), t = bp(t);
      }
      return oE(e), e.tag === je ? Li = DR(e) : Li = Gr ? bp(e.stateNode) : null, !0;
    }
    function OR() {
      return il && Li !== null;
    }
    function sE(e) {
      for (var t = Li; t; )
        aE(e, t), t = bp(t);
    }
    function Mf() {
      Gr = null, Li = null, il = !1, qs = !1;
    }
    function cE() {
      Yo !== null && (ab(Yo), Yo = null);
    }
    function Qr() {
      return il;
    }
    function jg(e) {
      Yo === null ? Yo = [
        e
      ] : Yo.push(e);
    }
    var kR = h.ReactCurrentBatchConfig, MR = null;
    function NR() {
      return kR.transition;
    }
    var ll = {
      recordUnsafeLifecycleWarnings: function(e, t) {
      },
      flushPendingUnsafeLifecycleWarnings: function() {
      },
      recordLegacyContextWarning: function(e, t) {
      },
      flushLegacyContextWarning: function() {
      },
      discardPendingWarnings: function() {
      }
    };
    {
      var LR = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & On && (t = a), a = a.return;
        return t;
      }, Xs = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, xp = [], Dp = [], Op = [], kp = [], Mp = [], Np = [], Ks = /* @__PURE__ */ new Set();
      ll.recordUnsafeLifecycleWarnings = function(e, t) {
        Ks.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && xp.push(e), e.mode & On && typeof t.UNSAFE_componentWillMount == "function" && Dp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && Op.push(e), e.mode & On && typeof t.UNSAFE_componentWillReceiveProps == "function" && kp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && Mp.push(e), e.mode & On && typeof t.UNSAFE_componentWillUpdate == "function" && Np.push(e));
      }, ll.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        xp.length > 0 && (xp.forEach(function(L) {
          e.add(ft(L) || "Component"), Ks.add(L.type);
        }), xp = []);
        var t = /* @__PURE__ */ new Set();
        Dp.length > 0 && (Dp.forEach(function(L) {
          t.add(ft(L) || "Component"), Ks.add(L.type);
        }), Dp = []);
        var a = /* @__PURE__ */ new Set();
        Op.length > 0 && (Op.forEach(function(L) {
          a.add(ft(L) || "Component"), Ks.add(L.type);
        }), Op = []);
        var i = /* @__PURE__ */ new Set();
        kp.length > 0 && (kp.forEach(function(L) {
          i.add(ft(L) || "Component"), Ks.add(L.type);
        }), kp = []);
        var u = /* @__PURE__ */ new Set();
        Mp.length > 0 && (Mp.forEach(function(L) {
          u.add(ft(L) || "Component"), Ks.add(L.type);
        }), Mp = []);
        var s = /* @__PURE__ */ new Set();
        if (Np.length > 0 && (Np.forEach(function(L) {
          s.add(ft(L) || "Component"), Ks.add(L.type);
        }), Np = []), t.size > 0) {
          var d = Xs(t);
          C(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, d);
        }
        if (i.size > 0) {
          var v = Xs(i);
          C(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, v);
        }
        if (s.size > 0) {
          var m = Xs(s);
          C(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, m);
        }
        if (e.size > 0) {
          var E = Xs(e);
          M(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, E);
        }
        if (a.size > 0) {
          var b = Xs(a);
          M(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, b);
        }
        if (u.size > 0) {
          var z = Xs(u);
          M(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, z);
        }
      };
      var rm = /* @__PURE__ */ new Map(), fE = /* @__PURE__ */ new Set();
      ll.recordLegacyContextWarning = function(e, t) {
        var a = LR(e);
        if (a === null) {
          C("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!fE.has(e.type)) {
          var i = rm.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], rm.set(a, i)), i.push(e));
        }
      }, ll.flushLegacyContextWarning = function() {
        rm.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(ft(s) || "Component"), fE.add(s.type);
            });
            var u = Xs(i);
            try {
              Zt(a), C(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u);
            } finally {
              Ln();
            }
          }
        });
      }, ll.discardPendingWarnings = function() {
        xp = [], Dp = [], Op = [], kp = [], Mp = [], Np = [], rm = /* @__PURE__ */ new Map();
      };
    }
    function ul(e, t) {
      if (e && e.defaultProps) {
        var a = Rt({}, t), i = e.defaultProps;
        for (var u in i)
          a[u] === void 0 && (a[u] = i[u]);
        return a;
      }
      return t;
    }
    var Fg = Vo(null), Hg;
    Hg = {};
    var am = null, Nf = null, Bg = null, im = !1;
    function lm() {
      am = null, Nf = null, Bg = null, im = !1;
    }
    function dE() {
      im = !0;
    }
    function pE() {
      im = !1;
    }
    function vE(e, t, a) {
      ha(Fg, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== Hg && C("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = Hg;
    }
    function Vg(e, t) {
      var a = Fg.current;
      va(Fg, t), e._currentValue = a;
    }
    function $g(e, t, a) {
      for (var i = e; i !== null; ) {
        var u = i.alternate;
        if (Tu(i.childLanes, t) ? u !== null && !Tu(u.childLanes, t) && (u.childLanes = bt(u.childLanes, t)) : (i.childLanes = bt(i.childLanes, t), u !== null && (u.childLanes = bt(u.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && C("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function AR(e, t, a) {
      zR(e, t, a);
    }
    function zR(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var u = void 0, s = i.dependencies;
        if (s !== null) {
          u = i.child;
          for (var d = s.firstContext; d !== null; ) {
            if (d.context === t) {
              if (i.tag === ie) {
                var v = nr(a), m = Vu(sn, v);
                m.tag = om;
                var E = i.updateQueue;
                if (E !== null) {
                  var b = E.shared, z = b.pending;
                  z === null ? m.next = m : (m.next = z.next, z.next = m), b.pending = m;
                }
              }
              i.lanes = bt(i.lanes, a);
              var L = i.alternate;
              L !== null && (L.lanes = bt(L.lanes, a)), $g(i.return, a, e), s.lanes = bt(s.lanes, a);
              break;
            }
            d = d.next;
          }
        } else if (i.tag === $e)
          u = i.type === e.type ? null : i.child;
        else if (i.tag === Xt) {
          var B = i.return;
          if (B === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          B.lanes = bt(B.lanes, a);
          var $ = B.alternate;
          $ !== null && ($.lanes = bt($.lanes, a)), $g(B, a, e), u = i.sibling;
        } else
          u = i.child;
        if (u !== null)
          u.return = i;
        else
          for (u = i; u !== null; ) {
            if (u === e) {
              u = null;
              break;
            }
            var W = u.sibling;
            if (W !== null) {
              W.return = u.return, u = W;
              break;
            }
            u = u.return;
          }
        i = u;
      }
    }
    function Lf(e, t) {
      am = e, Nf = null, Bg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (pa(a.lanes, t) && Wp(), a.firstContext = null);
      }
    }
    function mr(e) {
      im && C("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (Bg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (Nf === null) {
          if (am === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          Nf = a, am.dependencies = {
            lanes: Q,
            firstContext: a
          };
        } else
          Nf = Nf.next = a;
      }
      return t;
    }
    var Zs = null;
    function Ig(e) {
      Zs === null ? Zs = [
        e
      ] : Zs.push(e);
    }
    function UR() {
      if (Zs !== null) {
        for (var e = 0; e < Zs.length; e++) {
          var t = Zs[e], a = t.interleaved;
          if (a !== null) {
            t.interleaved = null;
            var i = a.next, u = t.pending;
            if (u !== null) {
              var s = u.next;
              u.next = i, a.next = s;
            }
            t.pending = a;
          }
        }
        Zs = null;
      }
    }
    function hE(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, Ig(t)) : (a.next = u.next, u.next = a), t.interleaved = a, um(e, i);
    }
    function PR(e, t, a, i) {
      var u = t.interleaved;
      u === null ? (a.next = a, Ig(t)) : (a.next = u.next, u.next = a), t.interleaved = a;
    }
    function jR(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, Ig(t)) : (a.next = u.next, u.next = a), t.interleaved = a, um(e, i);
    }
    function qa(e, t) {
      return um(e, t);
    }
    var FR = um;
    function um(e, t) {
      e.lanes = bt(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = bt(a.lanes, t)), a === null && (e.flags & (mn | Fa)) !== Ye && mb(e);
      for (var i = e, u = e.return; u !== null; )
        u.childLanes = bt(u.childLanes, t), a = u.alternate, a !== null ? a.childLanes = bt(a.childLanes, t) : (u.flags & (mn | Fa)) !== Ye && mb(e), i = u, u = u.return;
      if (i.tag === ee) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var mE = 0, yE = 1, om = 2, Yg = 3, sm = !1, Wg, cm;
    Wg = !1, cm = null;
    function Gg(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: Q
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function gE(e, t) {
      var a = t.updateQueue, i = e.updateQueue;
      if (a === i) {
        var u = {
          baseState: i.baseState,
          firstBaseUpdate: i.firstBaseUpdate,
          lastBaseUpdate: i.lastBaseUpdate,
          shared: i.shared,
          effects: i.effects
        };
        t.updateQueue = u;
      }
    }
    function Vu(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: mE,
        payload: null,
        callback: null,
        next: null
      };
      return a;
    }
    function Wo(e, t, a) {
      var i = e.updateQueue;
      if (i === null)
        return null;
      var u = i.shared;
      if (cm === u && !Wg && (C("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), Wg = !0), Fx()) {
        var s = u.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), u.pending = t, FR(e, a);
      } else
        return jR(e, u, t, a);
    }
    function fm(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var u = i.shared;
        if (Vd(a)) {
          var s = u.lanes;
          s = Id(s, e.pendingLanes);
          var d = bt(s, a);
          u.lanes = d, To(e, d);
        }
      }
    }
    function Qg(e, t) {
      var a = e.updateQueue, i = e.alternate;
      if (i !== null) {
        var u = i.updateQueue;
        if (a === u) {
          var s = null, d = null, v = a.firstBaseUpdate;
          if (v !== null) {
            var m = v;
            do {
              var E = {
                eventTime: m.eventTime,
                lane: m.lane,
                tag: m.tag,
                payload: m.payload,
                callback: m.callback,
                next: null
              };
              d === null ? s = d = E : (d.next = E, d = E), m = m.next;
            } while (m !== null);
            d === null ? s = d = t : (d.next = t, d = t);
          } else
            s = d = t;
          a = {
            baseState: u.baseState,
            firstBaseUpdate: s,
            lastBaseUpdate: d,
            shared: u.shared,
            effects: u.effects
          }, e.updateQueue = a;
          return;
        }
      }
      var b = a.lastBaseUpdate;
      b === null ? a.firstBaseUpdate = t : b.next = t, a.lastBaseUpdate = t;
    }
    function HR(e, t, a, i, u, s) {
      switch (a.tag) {
        case yE: {
          var d = a.payload;
          if (typeof d == "function") {
            dE();
            var v = d.call(s, i, u);
            {
              if (e.mode & On) {
                tr(!0);
                try {
                  d.call(s, i, u);
                } finally {
                  tr(!1);
                }
              }
              pE();
            }
            return v;
          }
          return d;
        }
        case Yg:
          e.flags = e.flags & ~fr | lt;
        case mE: {
          var m = a.payload, E;
          if (typeof m == "function") {
            dE(), E = m.call(s, i, u);
            {
              if (e.mode & On) {
                tr(!0);
                try {
                  m.call(s, i, u);
                } finally {
                  tr(!1);
                }
              }
              pE();
            }
          } else
            E = m;
          return E == null ? i : Rt({}, i, E);
        }
        case om:
          return sm = !0, i;
      }
      return i;
    }
    function dm(e, t, a, i) {
      var u = e.updateQueue;
      sm = !1, cm = u.shared;
      var s = u.firstBaseUpdate, d = u.lastBaseUpdate, v = u.shared.pending;
      if (v !== null) {
        u.shared.pending = null;
        var m = v, E = m.next;
        m.next = null, d === null ? s = E : d.next = E, d = m;
        var b = e.alternate;
        if (b !== null) {
          var z = b.updateQueue, L = z.lastBaseUpdate;
          L !== d && (L === null ? z.firstBaseUpdate = E : L.next = E, z.lastBaseUpdate = m);
        }
      }
      if (s !== null) {
        var B = u.baseState, $ = Q, W = null, xe = null, qe = null, Be = s;
        do {
          var Ut = Be.lane, Mt = Be.eventTime;
          if (Tu(i, Ut)) {
            if (qe !== null) {
              var G = {
                eventTime: Mt,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: At,
                tag: Be.tag,
                payload: Be.payload,
                callback: Be.callback,
                next: null
              };
              qe = qe.next = G;
            }
            B = HR(e, u, Be, B, t, a);
            var j = Be.callback;
            if (j !== null && // If the update was already committed, we should not queue its
            // callback again.
            Be.lane !== At) {
              e.flags |= Ri;
              var ue = u.effects;
              ue === null ? u.effects = [
                Be
              ] : ue.push(Be);
            }
          } else {
            var P = {
              eventTime: Mt,
              lane: Ut,
              tag: Be.tag,
              payload: Be.payload,
              callback: Be.callback,
              next: null
            };
            qe === null ? (xe = qe = P, W = B) : qe = qe.next = P, $ = bt($, Ut);
          }
          if (Be = Be.next, Be === null) {
            if (v = u.shared.pending, v === null)
              break;
            var De = v, be = De.next;
            De.next = null, Be = be, u.lastBaseUpdate = De, u.shared.pending = null;
          }
        } while (!0);
        qe === null && (W = B), u.baseState = W, u.firstBaseUpdate = xe, u.lastBaseUpdate = qe;
        var at = u.shared.interleaved;
        if (at !== null) {
          var pt = at;
          do
            $ = bt($, pt.lane), pt = pt.next;
          while (pt !== at);
        } else
          s === null && (u.shared.lanes = Q);
        av($), e.lanes = $, e.memoizedState = B;
      }
      cm = null;
    }
    function BR(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function SE() {
      sm = !1;
    }
    function pm() {
      return sm;
    }
    function CE(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u], d = s.callback;
          d !== null && (s.callback = null, BR(d, a));
        }
    }
    var qg = {}, EE = new g.Component().refs, Xg, Kg, Zg, Jg, eS, _E, vm, tS, nS, rS;
    {
      Xg = /* @__PURE__ */ new Set(), Kg = /* @__PURE__ */ new Set(), Zg = /* @__PURE__ */ new Set(), Jg = /* @__PURE__ */ new Set(), tS = /* @__PURE__ */ new Set(), eS = /* @__PURE__ */ new Set(), nS = /* @__PURE__ */ new Set(), rS = /* @__PURE__ */ new Set();
      var bE = /* @__PURE__ */ new Set();
      vm = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          bE.has(a) || (bE.add(a), C("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, _E = function(e, t) {
        if (t === void 0) {
          var a = Bt(e) || "Component";
          eS.has(a) || (eS.add(a), C("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(qg, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(qg);
    }
    function aS(e, t, a, i) {
      var u = e.memoizedState, s = a(i, u);
      {
        if (e.mode & On) {
          tr(!0);
          try {
            s = a(i, u);
          } finally {
            tr(!1);
          }
        }
        _E(t, s);
      }
      var d = s == null ? u : Rt({}, u, s);
      if (e.memoizedState = d, e.lanes === Q) {
        var v = e.updateQueue;
        v.baseState = d;
      }
    }
    var iS = {
      isMounted: wa,
      enqueueSetState: function(e, t, a) {
        var i = Pa(e), u = ka(), s = es(i), d = Vu(u, s);
        d.payload = t, a != null && (vm(a, "setState"), d.callback = a);
        var v = Wo(i, d, s);
        v !== null && (Nr(v, i, s, u), fm(v, i, s)), Hl(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = Pa(e), u = ka(), s = es(i), d = Vu(u, s);
        d.tag = yE, d.payload = t, a != null && (vm(a, "replaceState"), d.callback = a);
        var v = Wo(i, d, s);
        v !== null && (Nr(v, i, s, u), fm(v, i, s)), Hl(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = Pa(e), i = ka(), u = es(a), s = Vu(i, u);
        s.tag = om, t != null && (vm(t, "forceUpdate"), s.callback = t);
        var d = Wo(a, s, u);
        d !== null && (Nr(d, a, u, i), fm(d, a, u)), jd(a, u);
      }
    };
    function wE(e, t, a, i, u, s, d) {
      var v = e.stateNode;
      if (typeof v.shouldComponentUpdate == "function") {
        var m = v.shouldComponentUpdate(i, s, d);
        {
          if (e.mode & On) {
            tr(!0);
            try {
              m = v.shouldComponentUpdate(i, s, d);
            } finally {
              tr(!1);
            }
          }
          m === void 0 && C("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", Bt(t) || "Component");
        }
        return m;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !Ie(a, i) || !Ie(u, s) : !0;
    }
    function VR(e, t, a) {
      var i = e.stateNode;
      {
        var u = Bt(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? C("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", u) : C("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", u)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && C("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", u), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && C("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", u), i.propTypes && C("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", u), i.contextType && C("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", u), i.contextTypes && C("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", u), t.contextType && t.contextTypes && !nS.has(t) && (nS.add(t), C("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", u)), typeof i.componentShouldUpdate == "function" && C("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", u), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && C("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", Bt(t) || "A pure component"), typeof i.componentDidUnmount == "function" && C("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", u), typeof i.componentDidReceiveProps == "function" && C("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", u), typeof i.componentWillRecieveProps == "function" && C("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", u), typeof i.UNSAFE_componentWillRecieveProps == "function" && C("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", u);
        var d = i.props !== a;
        i.props !== void 0 && d && C("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", u, u), i.defaultProps && C("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", u, u), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !Zg.has(t) && (Zg.add(t), C("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", Bt(t))), typeof i.getDerivedStateFromProps == "function" && C("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof i.getDerivedStateFromError == "function" && C("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof t.getSnapshotBeforeUpdate == "function" && C("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", u);
        var v = i.state;
        v && (typeof v != "object" || Nt(v)) && C("%s.state: must be set to an object or null", u), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && C("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", u);
      }
    }
    function RE(e, t) {
      t.updater = iS, e.stateNode = t, mo(t, e), t._reactInternalInstance = qg;
    }
    function TE(e, t, a) {
      var i = !1, u = di, s = di, d = t.contextType;
      if ("contextType" in t) {
        var v = d === null || d !== void 0 && d.$$typeof === ye && d._context === void 0;
        if (!v && !rS.has(t)) {
          rS.add(t);
          var m = "";
          d === void 0 ? m = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof d != "object" ? m = " However, it is set to a " + typeof d + "." : d.$$typeof === ne ? m = " Did you accidentally pass the Context.Provider instead?" : d._context !== void 0 ? m = " Did you accidentally pass the Context.Consumer instead?" : m = " However, it is set to an object with keys {" + Object.keys(d).join(", ") + "}.", C("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", Bt(t) || "Component", m);
        }
      }
      if (typeof d == "object" && d !== null)
        s = mr(d);
      else {
        u = xf(e, t, !0);
        var E = t.contextTypes;
        i = E != null, s = i ? Df(e, u) : di;
      }
      var b = new t(a, s);
      if (e.mode & On) {
        tr(!0);
        try {
          b = new t(a, s);
        } finally {
          tr(!1);
        }
      }
      var z = e.memoizedState = b.state !== null && b.state !== void 0 ? b.state : null;
      RE(e, b);
      {
        if (typeof t.getDerivedStateFromProps == "function" && z === null) {
          var L = Bt(t) || "Component";
          Kg.has(L) || (Kg.add(L), C("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", L, b.state === null ? "null" : "undefined", L));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof b.getSnapshotBeforeUpdate == "function") {
          var B = null, $ = null, W = null;
          if (typeof b.componentWillMount == "function" && b.componentWillMount.__suppressDeprecationWarning !== !0 ? B = "componentWillMount" : typeof b.UNSAFE_componentWillMount == "function" && (B = "UNSAFE_componentWillMount"), typeof b.componentWillReceiveProps == "function" && b.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? $ = "componentWillReceiveProps" : typeof b.UNSAFE_componentWillReceiveProps == "function" && ($ = "UNSAFE_componentWillReceiveProps"), typeof b.componentWillUpdate == "function" && b.componentWillUpdate.__suppressDeprecationWarning !== !0 ? W = "componentWillUpdate" : typeof b.UNSAFE_componentWillUpdate == "function" && (W = "UNSAFE_componentWillUpdate"), B !== null || $ !== null || W !== null) {
            var xe = Bt(t) || "Component", qe = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            Jg.has(xe) || (Jg.add(xe), C(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, xe, qe, B !== null ? `
  ` + B : "", $ !== null ? `
  ` + $ : "", W !== null ? `
  ` + W : ""));
          }
        }
      }
      return i && XC(e, u, s), b;
    }
    function $R(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (C("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", ft(e) || "Component"), iS.enqueueReplaceState(t, t.state, null));
    }
    function xE(e, t, a, i) {
      var u = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== u) {
        {
          var s = ft(e) || "Component";
          Xg.has(s) || (Xg.add(s), C("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        iS.enqueueReplaceState(t, t.state, null);
      }
    }
    function lS(e, t, a, i) {
      VR(e, t, a);
      var u = e.stateNode;
      u.props = a, u.state = e.memoizedState, u.refs = EE, Gg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        u.context = mr(s);
      else {
        var d = xf(e, t, !0);
        u.context = Df(e, d);
      }
      {
        if (u.state === a) {
          var v = Bt(t) || "Component";
          tS.has(v) || (tS.add(v), C("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", v));
        }
        e.mode & On && ll.recordLegacyContextWarning(e, u), ll.recordUnsafeLifecycleWarnings(e, u);
      }
      u.state = e.memoizedState;
      var m = t.getDerivedStateFromProps;
      if (typeof m == "function" && (aS(e, t, m, a), u.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof u.getSnapshotBeforeUpdate != "function" && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && ($R(e, u), dm(e, a, u, i), u.state = e.memoizedState), typeof u.componentDidMount == "function") {
        var E = _t;
        E |= ua, (e.mode & Va) !== Ze && (E |= oa), e.flags |= E;
      }
    }
    function IR(e, t, a, i) {
      var u = e.stateNode, s = e.memoizedProps;
      u.props = s;
      var d = u.context, v = t.contextType, m = di;
      if (typeof v == "object" && v !== null)
        m = mr(v);
      else {
        var E = xf(e, t, !0);
        m = Df(e, E);
      }
      var b = t.getDerivedStateFromProps, z = typeof b == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      !z && (typeof u.UNSAFE_componentWillReceiveProps == "function" || typeof u.componentWillReceiveProps == "function") && (s !== a || d !== m) && xE(e, u, a, m), SE();
      var L = e.memoizedState, B = u.state = L;
      if (dm(e, a, u, i), B = e.memoizedState, s === a && L === B && !qh() && !pm()) {
        if (typeof u.componentDidMount == "function") {
          var $ = _t;
          $ |= ua, (e.mode & Va) !== Ze && ($ |= oa), e.flags |= $;
        }
        return !1;
      }
      typeof b == "function" && (aS(e, t, b, a), B = e.memoizedState);
      var W = pm() || wE(e, t, s, a, L, B, m);
      if (W) {
        if (!z && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function") {
          var xe = _t;
          xe |= ua, (e.mode & Va) !== Ze && (xe |= oa), e.flags |= xe;
        }
      } else {
        if (typeof u.componentDidMount == "function") {
          var qe = _t;
          qe |= ua, (e.mode & Va) !== Ze && (qe |= oa), e.flags |= qe;
        }
        e.memoizedProps = a, e.memoizedState = B;
      }
      return u.props = a, u.state = B, u.context = m, W;
    }
    function YR(e, t, a, i, u) {
      var s = t.stateNode;
      gE(e, t);
      var d = t.memoizedProps, v = t.type === t.elementType ? d : ul(t.type, d);
      s.props = v;
      var m = t.pendingProps, E = s.context, b = a.contextType, z = di;
      if (typeof b == "object" && b !== null)
        z = mr(b);
      else {
        var L = xf(t, a, !0);
        z = Df(t, L);
      }
      var B = a.getDerivedStateFromProps, $ = typeof B == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !$ && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (d !== m || E !== z) && xE(t, s, i, z), SE();
      var W = t.memoizedState, xe = s.state = W;
      if (dm(t, i, s, u), xe = t.memoizedState, d === m && W === xe && !qh() && !pm() && !Pe)
        return typeof s.componentDidUpdate == "function" && (d !== e.memoizedProps || W !== e.memoizedState) && (t.flags |= _t), typeof s.getSnapshotBeforeUpdate == "function" && (d !== e.memoizedProps || W !== e.memoizedState) && (t.flags |= ja), !1;
      typeof B == "function" && (aS(t, a, B, i), xe = t.memoizedState);
      var qe = pm() || wE(t, a, v, i, W, xe, z) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      Pe;
      return qe ? (!$ && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, xe, z), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, xe, z)), typeof s.componentDidUpdate == "function" && (t.flags |= _t), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= ja)) : (typeof s.componentDidUpdate == "function" && (d !== e.memoizedProps || W !== e.memoizedState) && (t.flags |= _t), typeof s.getSnapshotBeforeUpdate == "function" && (d !== e.memoizedProps || W !== e.memoizedState) && (t.flags |= ja), t.memoizedProps = i, t.memoizedState = xe), s.props = i, s.state = xe, s.context = z, qe;
    }
    var uS, oS, sS, cS, fS, DE = function(e, t) {
    };
    uS = !1, oS = !1, sS = {}, cS = {}, fS = {}, DE = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = ft(t) || "Component";
        cS[a] || (cS[a] = !0, C('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function Lp(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & On || Je) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self)) {
          var u = ft(e) || "Component";
          sS[u] || (C('A string ref, "%s", has been found within a strict mode tree. String refs are a source of potential bugs and should be avoided. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', i), sS[u] = !0);
        }
        if (a._owner) {
          var s = a._owner, d;
          if (s) {
            var v = s;
            if (v.tag !== ie)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            d = v.stateNode;
          }
          if (!d)
            throw new Error("Missing owner for string ref " + i + ". This error is likely caused by a bug in React. Please file an issue.");
          var m = d;
          Fn(i, "ref");
          var E = "" + i;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === E)
            return t.ref;
          var b = function(z) {
            var L = m.refs;
            L === EE && (L = m.refs = {}), z === null ? delete L[E] : L[E] = z;
          };
          return b._stringRef = E, b;
        } else {
          if (typeof i != "string")
            throw new Error("Expected ref to be a function, a string, an object returned by React.createRef(), or null.");
          if (!a._owner)
            throw new Error("Element ref was specified as a string (" + i + `) but no owner was set. This could happen for one of the following reasons:
1. You may be adding a ref to a function component
2. You may be adding a ref to a component that was not created inside a component's render method
3. You have multiple copies of React loaded
See https://reactjs.org/link/refs-must-have-owner for more information.`);
        }
      }
      return i;
    }
    function hm(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function mm(e) {
      {
        var t = ft(e) || "Component";
        if (fS[t])
          return;
        fS[t] = !0, C("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function OE(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function kE(e) {
      function t(P, G) {
        if (e) {
          var j = P.deletions;
          j === null ? (P.deletions = [
            G
          ], P.flags |= qt) : j.push(G);
        }
      }
      function a(P, G) {
        if (!e)
          return null;
        for (var j = G; j !== null; )
          t(P, j), j = j.sibling;
        return null;
      }
      function i(P, G) {
        for (var j = /* @__PURE__ */ new Map(), ue = G; ue !== null; )
          ue.key !== null ? j.set(ue.key, ue) : j.set(ue.index, ue), ue = ue.sibling;
        return j;
      }
      function u(P, G) {
        var j = lc(P, G);
        return j.index = 0, j.sibling = null, j;
      }
      function s(P, G, j) {
        if (P.index = j, !e)
          return P.flags |= Td, G;
        var ue = P.alternate;
        if (ue !== null) {
          var De = ue.index;
          return De < G ? (P.flags |= mn, G) : De;
        } else
          return P.flags |= mn, G;
      }
      function d(P) {
        return e && P.alternate === null && (P.flags |= mn), P;
      }
      function v(P, G, j, ue) {
        if (G === null || G.tag !== ke) {
          var De = j0(j, P.mode, ue);
          return De.return = P, De;
        } else {
          var be = u(G, j);
          return be.return = P, be;
        }
      }
      function m(P, G, j, ue) {
        var De = j.type;
        if (De === Ea)
          return b(P, G, j.props.children, ue, j.key);
        if (G !== null && (G.elementType === De || Cb(G, j) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof De == "object" && De !== null && De.$$typeof === Qe && OE(De) === G.type)) {
          var be = u(G, j.props);
          return be.ref = Lp(P, G, j), be.return = P, be._debugSource = j._source, be._debugOwner = j._owner, be;
        }
        var at = P0(j, P.mode, ue);
        return at.ref = Lp(P, G, j), at.return = P, at;
      }
      function E(P, G, j, ue) {
        if (G === null || G.tag !== de || G.stateNode.containerInfo !== j.containerInfo || G.stateNode.implementation !== j.implementation) {
          var De = F0(j, P.mode, ue);
          return De.return = P, De;
        } else {
          var be = u(G, j.children || []);
          return be.return = P, be;
        }
      }
      function b(P, G, j, ue, De) {
        if (G === null || G.tag !== ot) {
          var be = ns(j, P.mode, ue, De);
          return be.return = P, be;
        } else {
          var at = u(G, j);
          return at.return = P, at;
        }
      }
      function z(P, G, j) {
        if (typeof G == "string" && G !== "" || typeof G == "number") {
          var ue = j0("" + G, P.mode, j);
          return ue.return = P, ue;
        }
        if (typeof G == "object" && G !== null) {
          switch (G.$$typeof) {
            case gi: {
              var De = P0(G, P.mode, j);
              return De.ref = Lp(P, null, G), De.return = P, De;
            }
            case Vr: {
              var be = F0(G, P.mode, j);
              return be.return = P, be;
            }
            case Qe: {
              var at = G._payload, pt = G._init;
              return z(P, pt(at), j);
            }
          }
          if (Nt(G) || ri(G)) {
            var rn = ns(G, P.mode, j, null);
            return rn.return = P, rn;
          }
          hm(P, G);
        }
        return typeof G == "function" && mm(P), null;
      }
      function L(P, G, j, ue) {
        var De = G !== null ? G.key : null;
        if (typeof j == "string" && j !== "" || typeof j == "number")
          return De !== null ? null : v(P, G, "" + j, ue);
        if (typeof j == "object" && j !== null) {
          switch (j.$$typeof) {
            case gi:
              return j.key === De ? m(P, G, j, ue) : null;
            case Vr:
              return j.key === De ? E(P, G, j, ue) : null;
            case Qe: {
              var be = j._payload, at = j._init;
              return L(P, G, at(be), ue);
            }
          }
          if (Nt(j) || ri(j))
            return De !== null ? null : b(P, G, j, ue, null);
          hm(P, j);
        }
        return typeof j == "function" && mm(P), null;
      }
      function B(P, G, j, ue, De) {
        if (typeof ue == "string" && ue !== "" || typeof ue == "number") {
          var be = P.get(j) || null;
          return v(G, be, "" + ue, De);
        }
        if (typeof ue == "object" && ue !== null) {
          switch (ue.$$typeof) {
            case gi: {
              var at = P.get(ue.key === null ? j : ue.key) || null;
              return m(G, at, ue, De);
            }
            case Vr: {
              var pt = P.get(ue.key === null ? j : ue.key) || null;
              return E(G, pt, ue, De);
            }
            case Qe:
              var rn = ue._payload, Gt = ue._init;
              return B(P, G, j, Gt(rn), De);
          }
          if (Nt(ue) || ri(ue)) {
            var lr = P.get(j) || null;
            return b(G, lr, ue, De, null);
          }
          hm(G, ue);
        }
        return typeof ue == "function" && mm(G), null;
      }
      function $(P, G, j) {
        {
          if (typeof P != "object" || P === null)
            return G;
          switch (P.$$typeof) {
            case gi:
            case Vr:
              DE(P, j);
              var ue = P.key;
              if (typeof ue != "string")
                break;
              if (G === null) {
                G = /* @__PURE__ */ new Set(), G.add(ue);
                break;
              }
              if (!G.has(ue)) {
                G.add(ue);
                break;
              }
              C("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", ue);
              break;
            case Qe:
              var De = P._payload, be = P._init;
              $(be(De), G, j);
              break;
          }
        }
        return G;
      }
      function W(P, G, j, ue) {
        for (var De = null, be = 0; be < j.length; be++) {
          var at = j[be];
          De = $(at, De, P);
        }
        for (var pt = null, rn = null, Gt = G, lr = 0, Qt = 0, Kn = null; Gt !== null && Qt < j.length; Qt++) {
          Gt.index > Qt ? (Kn = Gt, Gt = null) : Kn = Gt.sibling;
          var ya = L(P, Gt, j[Qt], ue);
          if (ya === null) {
            Gt === null && (Gt = Kn);
            break;
          }
          e && Gt && ya.alternate === null && t(P, Gt), lr = s(ya, lr, Qt), rn === null ? pt = ya : rn.sibling = ya, rn = ya, Gt = Kn;
        }
        if (Qt === j.length) {
          if (a(P, Gt), Qr()) {
            var ta = Qt;
            Gs(P, ta);
          }
          return pt;
        }
        if (Gt === null) {
          for (; Qt < j.length; Qt++) {
            var vi = z(P, j[Qt], ue);
            vi !== null && (lr = s(vi, lr, Qt), rn === null ? pt = vi : rn.sibling = vi, rn = vi);
          }
          if (Qr()) {
            var Ma = Qt;
            Gs(P, Ma);
          }
          return pt;
        }
        for (var Na = i(P, Gt); Qt < j.length; Qt++) {
          var ga = B(Na, P, Qt, j[Qt], ue);
          ga !== null && (e && ga.alternate !== null && Na.delete(ga.key === null ? Qt : ga.key), lr = s(ga, lr, Qt), rn === null ? pt = ga : rn.sibling = ga, rn = ga);
        }
        if (e && Na.forEach(function(Xf) {
          return t(P, Xf);
        }), Qr()) {
          var Qu = Qt;
          Gs(P, Qu);
        }
        return pt;
      }
      function xe(P, G, j, ue) {
        var De = ri(j);
        if (typeof De != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          j[Symbol.toStringTag] === "Generator" && (oS || C("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), oS = !0), j.entries === De && (uS || C("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), uS = !0);
          var be = De.call(j);
          if (be)
            for (var at = null, pt = be.next(); !pt.done; pt = be.next()) {
              var rn = pt.value;
              at = $(rn, at, P);
            }
        }
        var Gt = De.call(j);
        if (Gt == null)
          throw new Error("An iterable object provided no iterator.");
        for (var lr = null, Qt = null, Kn = G, ya = 0, ta = 0, vi = null, Ma = Gt.next(); Kn !== null && !Ma.done; ta++, Ma = Gt.next()) {
          Kn.index > ta ? (vi = Kn, Kn = null) : vi = Kn.sibling;
          var Na = L(P, Kn, Ma.value, ue);
          if (Na === null) {
            Kn === null && (Kn = vi);
            break;
          }
          e && Kn && Na.alternate === null && t(P, Kn), ya = s(Na, ya, ta), Qt === null ? lr = Na : Qt.sibling = Na, Qt = Na, Kn = vi;
        }
        if (Ma.done) {
          if (a(P, Kn), Qr()) {
            var ga = ta;
            Gs(P, ga);
          }
          return lr;
        }
        if (Kn === null) {
          for (; !Ma.done; ta++, Ma = Gt.next()) {
            var Qu = z(P, Ma.value, ue);
            Qu !== null && (ya = s(Qu, ya, ta), Qt === null ? lr = Qu : Qt.sibling = Qu, Qt = Qu);
          }
          if (Qr()) {
            var Xf = ta;
            Gs(P, Xf);
          }
          return lr;
        }
        for (var sv = i(P, Kn); !Ma.done; ta++, Ma = Gt.next()) {
          var au = B(sv, P, ta, Ma.value, ue);
          au !== null && (e && au.alternate !== null && sv.delete(au.key === null ? ta : au.key), ya = s(au, ya, ta), Qt === null ? lr = au : Qt.sibling = au, Qt = au);
        }
        if (e && sv.forEach(function(iO) {
          return t(P, iO);
        }), Qr()) {
          var aO = ta;
          Gs(P, aO);
        }
        return lr;
      }
      function qe(P, G, j, ue) {
        if (G !== null && G.tag === ke) {
          a(P, G.sibling);
          var De = u(G, j);
          return De.return = P, De;
        }
        a(P, G);
        var be = j0(j, P.mode, ue);
        return be.return = P, be;
      }
      function Be(P, G, j, ue) {
        for (var De = j.key, be = G; be !== null; ) {
          if (be.key === De) {
            var at = j.type;
            if (at === Ea) {
              if (be.tag === ot) {
                a(P, be.sibling);
                var pt = u(be, j.props.children);
                return pt.return = P, pt._debugSource = j._source, pt._debugOwner = j._owner, pt;
              }
            } else if (be.elementType === at || Cb(be, j) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof at == "object" && at !== null && at.$$typeof === Qe && OE(at) === be.type) {
              a(P, be.sibling);
              var rn = u(be, j.props);
              return rn.ref = Lp(P, be, j), rn.return = P, rn._debugSource = j._source, rn._debugOwner = j._owner, rn;
            }
            a(P, be);
            break;
          } else
            t(P, be);
          be = be.sibling;
        }
        if (j.type === Ea) {
          var Gt = ns(j.props.children, P.mode, ue, j.key);
          return Gt.return = P, Gt;
        } else {
          var lr = P0(j, P.mode, ue);
          return lr.ref = Lp(P, G, j), lr.return = P, lr;
        }
      }
      function Ut(P, G, j, ue) {
        for (var De = j.key, be = G; be !== null; ) {
          if (be.key === De)
            if (be.tag === de && be.stateNode.containerInfo === j.containerInfo && be.stateNode.implementation === j.implementation) {
              a(P, be.sibling);
              var at = u(be, j.children || []);
              return at.return = P, at;
            } else {
              a(P, be);
              break;
            }
          else
            t(P, be);
          be = be.sibling;
        }
        var pt = F0(j, P.mode, ue);
        return pt.return = P, pt;
      }
      function Mt(P, G, j, ue) {
        var De = typeof j == "object" && j !== null && j.type === Ea && j.key === null;
        if (De && (j = j.props.children), typeof j == "object" && j !== null) {
          switch (j.$$typeof) {
            case gi:
              return d(Be(P, G, j, ue));
            case Vr:
              return d(Ut(P, G, j, ue));
            case Qe:
              var be = j._payload, at = j._init;
              return Mt(P, G, at(be), ue);
          }
          if (Nt(j))
            return W(P, G, j, ue);
          if (ri(j))
            return xe(P, G, j, ue);
          hm(P, j);
        }
        return typeof j == "string" && j !== "" || typeof j == "number" ? d(qe(P, G, "" + j, ue)) : (typeof j == "function" && mm(P), a(P, G));
      }
      return Mt;
    }
    var Af = kE(!0), ME = kE(!1);
    function WR(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = lc(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = lc(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function GR(e, t) {
      for (var a = e.child; a !== null; )
        _D(a, t), a = a.sibling;
    }
    var Ap = {}, Go = Vo(Ap), zp = Vo(Ap), ym = Vo(Ap);
    function gm(e) {
      if (e === Ap)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function NE() {
      var e = gm(ym.current);
      return e;
    }
    function dS(e, t) {
      ha(ym, t, e), ha(zp, e, e), ha(Go, Ap, e);
      var a = uw(t);
      va(Go, e), ha(Go, a, e);
    }
    function zf(e) {
      va(Go, e), va(zp, e), va(ym, e);
    }
    function pS() {
      var e = gm(Go.current);
      return e;
    }
    function LE(e) {
      gm(ym.current);
      var t = gm(Go.current), a = ow(t, e.type);
      t !== a && (ha(zp, e, e), ha(Go, a, e));
    }
    function vS(e) {
      zp.current === e && (va(Go, e), va(zp, e));
    }
    var QR = 0, AE = 1, zE = 1, Up = 2, ol = Vo(QR);
    function hS(e, t) {
      return (e & t) !== 0;
    }
    function Uf(e) {
      return e & AE;
    }
    function mS(e, t) {
      return e & AE | t;
    }
    function qR(e, t) {
      return e | t;
    }
    function Qo(e, t) {
      ha(ol, t, e);
    }
    function Pf(e) {
      va(ol, e);
    }
    function XR(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function Sm(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === je) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || YC(i) || _g(i))
              return t;
          }
        } else if (t.tag === jt && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var u = (t.flags & lt) !== Ye;
          if (u)
            return t;
        } else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e)
          return null;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return null;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return null;
    }
    var Xa = (
      /*   */
      0
    ), Rr = (
      /* */
      1
    ), Kl = (
      /*  */
      2
    ), Tr = (
      /*    */
      4
    ), qr = (
      /*   */
      8
    ), yS = [];
    function gS() {
      for (var e = 0; e < yS.length; e++) {
        var t = yS[e];
        t._workInProgressVersionPrimary = null;
      }
      yS.length = 0;
    }
    function KR(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [
        t,
        i
      ] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var Re = h.ReactCurrentDispatcher, Pp = h.ReactCurrentBatchConfig, SS, jf;
    SS = /* @__PURE__ */ new Set();
    var Js = Q, nn = null, xr = null, Dr = null, Cm = !1, jp = !1, Fp = 0, ZR = 0, JR = 25, X = null, Ai = null, qo = -1, CS = !1;
    function en() {
      {
        var e = X;
        Ai === null ? Ai = [
          e
        ] : Ai.push(e);
      }
    }
    function Se() {
      {
        var e = X;
        Ai !== null && (qo++, Ai[qo] !== e && eT(e));
      }
    }
    function Ff(e) {
      e != null && !Nt(e) && C("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", X, typeof e);
    }
    function eT(e) {
      {
        var t = ft(nn);
        if (!SS.has(t) && (SS.add(t), Ai !== null)) {
          for (var a = "", i = 30, u = 0; u <= qo; u++) {
            for (var s = Ai[u], d = u === qo ? e : s, v = u + 1 + ". " + s; v.length < i; )
              v += " ";
            v += d + `
`, a += v;
          }
          C(`React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`, t, a);
        }
      }
    }
    function ma() {
      throw new Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function ES(e, t) {
      if (CS)
        return !1;
      if (t === null)
        return C("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", X), !1;
      e.length !== t.length && C(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, X, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!Le(e[a], t[a]))
          return !1;
      return !0;
    }
    function Hf(e, t, a, i, u, s) {
      Js = s, nn = t, Ai = e !== null ? e._debugHookTypes : null, qo = -1, CS = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = Q, e !== null && e.memoizedState !== null ? Re.current = r_ : Ai !== null ? Re.current = n_ : Re.current = t_;
      var d = a(i, u);
      if (jp) {
        var v = 0;
        do {
          if (jp = !1, Fp = 0, v >= JR)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          v += 1, CS = !1, xr = null, Dr = null, t.updateQueue = null, qo = -1, Re.current = a_, d = a(i, u);
        } while (jp);
      }
      Re.current = Lm, t._debugHookTypes = Ai;
      var m = xr !== null && xr.next !== null;
      if (Js = Q, nn = null, xr = null, Dr = null, X = null, Ai = null, qo = -1, e !== null && (e.flags & _r) !== (t.flags & _r) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & xt) !== Ze && C("Internal React error: Expected static flag was missing. Please notify the React team."), Cm = !1, m)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return d;
    }
    function Bf() {
      var e = Fp !== 0;
      return Fp = 0, e;
    }
    function UE(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & Va) !== Ze ? t.flags &= ~(mu | oa | bn | _t) : t.flags &= ~(bn | _t), e.lanes = Ro(e.lanes, a);
    }
    function PE() {
      if (Re.current = Lm, Cm) {
        for (var e = nn.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        Cm = !1;
      }
      Js = Q, nn = null, xr = null, Dr = null, Ai = null, qo = -1, X = null, XE = !1, jp = !1, Fp = 0;
    }
    function Zl() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return Dr === null ? nn.memoizedState = Dr = e : Dr = Dr.next = e, Dr;
    }
    function zi() {
      var e;
      if (xr === null) {
        var t = nn.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = xr.next;
      var a;
      if (Dr === null ? a = nn.memoizedState : a = Dr.next, a !== null)
        Dr = a, a = Dr.next, xr = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        xr = e;
        var i = {
          memoizedState: xr.memoizedState,
          baseState: xr.baseState,
          baseQueue: xr.baseQueue,
          queue: xr.queue,
          next: null
        };
        Dr === null ? nn.memoizedState = Dr = i : Dr = Dr.next = i;
      }
      return Dr;
    }
    function jE() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function _S(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function bS(e, t, a) {
      var i = Zl(), u;
      a !== void 0 ? u = a(t) : u = t, i.memoizedState = i.baseState = u;
      var s = {
        pending: null,
        interleaved: null,
        lanes: Q,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: u
      };
      i.queue = s;
      var d = s.dispatch = aT.bind(null, nn, s);
      return [
        i.memoizedState,
        d
      ];
    }
    function wS(e, t, a) {
      var i = zi(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = xr, d = s.baseQueue, v = u.pending;
      if (v !== null) {
        if (d !== null) {
          var m = d.next, E = v.next;
          d.next = E, v.next = m;
        }
        s.baseQueue !== d && C("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), s.baseQueue = d = v, u.pending = null;
      }
      if (d !== null) {
        var b = d.next, z = s.baseState, L = null, B = null, $ = null, W = b;
        do {
          var xe = W.lane;
          if (Tu(Js, xe)) {
            if ($ !== null) {
              var Be = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: At,
                action: W.action,
                hasEagerState: W.hasEagerState,
                eagerState: W.eagerState,
                next: null
              };
              $ = $.next = Be;
            }
            if (W.hasEagerState)
              z = W.eagerState;
            else {
              var Ut = W.action;
              z = e(z, Ut);
            }
          } else {
            var qe = {
              lane: xe,
              action: W.action,
              hasEagerState: W.hasEagerState,
              eagerState: W.eagerState,
              next: null
            };
            $ === null ? (B = $ = qe, L = z) : $ = $.next = qe, nn.lanes = bt(nn.lanes, xe), av(xe);
          }
          W = W.next;
        } while (W !== null && W !== b);
        $ === null ? L = z : $.next = B, Le(z, i.memoizedState) || Wp(), i.memoizedState = z, i.baseState = L, i.baseQueue = $, u.lastRenderedState = z;
      }
      var Mt = u.interleaved;
      if (Mt !== null) {
        var P = Mt;
        do {
          var G = P.lane;
          nn.lanes = bt(nn.lanes, G), av(G), P = P.next;
        } while (P !== Mt);
      } else
        d === null && (u.lanes = Q);
      var j = u.dispatch;
      return [
        i.memoizedState,
        j
      ];
    }
    function RS(e, t, a) {
      var i = zi(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = u.dispatch, d = u.pending, v = i.memoizedState;
      if (d !== null) {
        u.pending = null;
        var m = d.next, E = m;
        do {
          var b = E.action;
          v = e(v, b), E = E.next;
        } while (E !== m);
        Le(v, i.memoizedState) || Wp(), i.memoizedState = v, i.baseQueue === null && (i.baseState = v), u.lastRenderedState = v;
      }
      return [
        v,
        s
      ];
    }
    function xk(e, t, a) {
    }
    function Dk(e, t, a) {
    }
    function TS(e, t, a) {
      var i = nn, u = Zl(), s, d = Qr();
      if (d) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), jf || s !== a() && (C("The result of getServerSnapshot should be cached to avoid an infinite loop"), jf = !0);
      } else {
        if (s = t(), !jf) {
          var v = t();
          Le(s, v) || (C("The result of getSnapshot should be cached to avoid an infinite loop"), jf = !0);
        }
        var m = Km();
        if (m === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        ks(m, Js) || FE(i, t, s);
      }
      u.memoizedState = s;
      var E = {
        value: s,
        getSnapshot: t
      };
      return u.queue = E, Rm(BE.bind(null, i, E, e), [
        e
      ]), i.flags |= bn, Hp(Rr | qr, HE.bind(null, i, E, s, t), void 0, null), s;
    }
    function Em(e, t, a) {
      var i = nn, u = zi(), s = t();
      if (!jf) {
        var d = t();
        Le(s, d) || (C("The result of getSnapshot should be cached to avoid an infinite loop"), jf = !0);
      }
      var v = u.memoizedState, m = !Le(v, s);
      m && (u.memoizedState = s, Wp());
      var E = u.queue;
      if (Vp(BE.bind(null, i, E, e), [
        e
      ]), E.getSnapshot !== t || m || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      Dr !== null && Dr.memoizedState.tag & Rr) {
        i.flags |= bn, Hp(Rr | qr, HE.bind(null, i, E, s, t), void 0, null);
        var b = Km();
        if (b === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        ks(b, Js) || FE(i, t, s);
      }
      return s;
    }
    function FE(e, t, a) {
      e.flags |= Es;
      var i = {
        getSnapshot: t,
        value: a
      }, u = nn.updateQueue;
      if (u === null)
        u = jE(), nn.updateQueue = u, u.stores = [
          i
        ];
      else {
        var s = u.stores;
        s === null ? u.stores = [
          i
        ] : s.push(i);
      }
    }
    function HE(e, t, a, i) {
      t.value = a, t.getSnapshot = i, VE(t) && $E(e);
    }
    function BE(e, t, a) {
      var i = function() {
        VE(t) && $E(e);
      };
      return a(i);
    }
    function VE(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !Le(a, i);
      } catch {
        return !0;
      }
    }
    function $E(e) {
      var t = qa(e, rt);
      t !== null && Nr(t, e, rt, sn);
    }
    function _m(e) {
      var t = Zl();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: Q,
        dispatch: null,
        lastRenderedReducer: _S,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = iT.bind(null, nn, a);
      return [
        t.memoizedState,
        i
      ];
    }
    function xS(e) {
      return wS(_S);
    }
    function DS(e) {
      return RS(_S);
    }
    function Hp(e, t, a, i) {
      var u = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = nn.updateQueue;
      if (s === null)
        s = jE(), nn.updateQueue = s, s.lastEffect = u.next = u;
      else {
        var d = s.lastEffect;
        if (d === null)
          s.lastEffect = u.next = u;
        else {
          var v = d.next;
          d.next = u, u.next = v, s.lastEffect = u;
        }
      }
      return u;
    }
    function OS(e) {
      var t = Zl();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function bm(e) {
      var t = zi();
      return t.memoizedState;
    }
    function Bp(e, t, a, i) {
      var u = Zl(), s = i === void 0 ? null : i;
      nn.flags |= e, u.memoizedState = Hp(Rr | t, a, void 0, s);
    }
    function wm(e, t, a, i) {
      var u = zi(), s = i === void 0 ? null : i, d = void 0;
      if (xr !== null) {
        var v = xr.memoizedState;
        if (d = v.destroy, s !== null) {
          var m = v.deps;
          if (ES(s, m)) {
            u.memoizedState = Hp(t, a, d, s);
            return;
          }
        }
      }
      nn.flags |= e, u.memoizedState = Hp(Rr | t, a, d, s);
    }
    function Rm(e, t) {
      return (nn.mode & Va) !== Ze ? Bp(mu | bn | Al, qr, e, t) : Bp(bn | Al, qr, e, t);
    }
    function Vp(e, t) {
      return wm(bn, qr, e, t);
    }
    function kS(e, t) {
      return Bp(_t, Kl, e, t);
    }
    function Tm(e, t) {
      return wm(_t, Kl, e, t);
    }
    function MS(e, t) {
      var a = _t;
      return a |= ua, (nn.mode & Va) !== Ze && (a |= oa), Bp(a, Tr, e, t);
    }
    function xm(e, t) {
      return wm(_t, Tr, e, t);
    }
    function IE(e, t) {
      if (typeof t == "function") {
        var a = t, i = e();
        return a(i), function() {
          a(null);
        };
      } else if (t != null) {
        var u = t;
        u.hasOwnProperty("current") || C("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(u).join(", ") + "}");
        var s = e();
        return u.current = s, function() {
          u.current = null;
        };
      }
    }
    function NS(e, t, a) {
      typeof t != "function" && C("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([
        e
      ]) : null, u = _t;
      return u |= ua, (nn.mode & Va) !== Ze && (u |= oa), Bp(u, Tr, IE.bind(null, t, e), i);
    }
    function Dm(e, t, a) {
      typeof t != "function" && C("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([
        e
      ]) : null;
      return wm(_t, Tr, IE.bind(null, t, e), i);
    }
    function tT(e, t) {
    }
    var Om = tT;
    function LS(e, t) {
      var a = Zl(), i = t === void 0 ? null : t;
      return a.memoizedState = [
        e,
        i
      ], e;
    }
    function km(e, t) {
      var a = zi(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (ES(i, s))
          return u[0];
      }
      return a.memoizedState = [
        e,
        i
      ], e;
    }
    function AS(e, t) {
      var a = Zl(), i = t === void 0 ? null : t, u = e();
      return a.memoizedState = [
        u,
        i
      ], u;
    }
    function Mm(e, t) {
      var a = zi(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (ES(i, s))
          return u[0];
      }
      var d = e();
      return a.memoizedState = [
        d,
        i
      ], d;
    }
    function zS(e) {
      var t = Zl();
      return t.memoizedState = e, e;
    }
    function YE(e) {
      var t = zi(), a = xr, i = a.memoizedState;
      return GE(t, i, e);
    }
    function WE(e) {
      var t = zi();
      if (xr === null)
        return t.memoizedState = e, e;
      var a = xr.memoizedState;
      return GE(t, a, e);
    }
    function GE(e, t, a) {
      var i = !By(Js);
      if (i) {
        if (!Le(a, t)) {
          var u = $d();
          nn.lanes = bt(nn.lanes, u), av(u), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, Wp()), e.memoizedState = a, a;
    }
    function nT(e, t, a) {
      var i = Ia();
      rr(Ur(i, wr)), e(!0);
      var u = Pp.transition;
      Pp.transition = {};
      var s = Pp.transition;
      Pp.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (rr(i), Pp.transition = u, u === null && s._updatedFibers) {
          var d = s._updatedFibers.size;
          d > 10 && M("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function US() {
      var e = _m(!1), t = e[0], a = e[1], i = nT.bind(null, a), u = Zl();
      return u.memoizedState = i, [
        t,
        i
      ];
    }
    function QE() {
      var e = xS(), t = e[0], a = zi(), i = a.memoizedState;
      return [
        t,
        i
      ];
    }
    function qE() {
      var e = DS(), t = e[0], a = zi(), i = a.memoizedState;
      return [
        t,
        i
      ];
    }
    var XE = !1;
    function rT() {
      return XE;
    }
    function PS() {
      var e = Zl(), t = Km(), a = t.identifierPrefix, i;
      if (Qr()) {
        var u = yR();
        i = ":" + a + "R" + u;
        var s = Fp++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var d = ZR++;
        i = ":" + a + "r" + d.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function Nm() {
      var e = zi(), t = e.memoizedState;
      return t;
    }
    function aT(e, t, a) {
      typeof arguments[3] == "function" && C("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = es(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (KE(e))
        ZE(t, u);
      else {
        var s = hE(e, t, u, i);
        if (s !== null) {
          var d = ka();
          Nr(s, e, i, d), JE(s, t, i);
        }
      }
      e_(e, i);
    }
    function iT(e, t, a) {
      typeof arguments[3] == "function" && C("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = es(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (KE(e))
        ZE(t, u);
      else {
        var s = e.alternate;
        if (e.lanes === Q && (s === null || s.lanes === Q)) {
          var d = t.lastRenderedReducer;
          if (d !== null) {
            var v;
            v = Re.current, Re.current = sl;
            try {
              var m = t.lastRenderedState, E = d(m, a);
              if (u.hasEagerState = !0, u.eagerState = E, Le(E, m)) {
                PR(e, t, u, i);
                return;
              }
            } catch {
            } finally {
              Re.current = v;
            }
          }
        }
        var b = hE(e, t, u, i);
        if (b !== null) {
          var z = ka();
          Nr(b, e, i, z), JE(b, t, i);
        }
      }
      e_(e, i);
    }
    function KE(e) {
      var t = e.alternate;
      return e === nn || t !== null && t === nn;
    }
    function ZE(e, t) {
      jp = Cm = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function JE(e, t, a) {
      if (Vd(a)) {
        var i = t.lanes;
        i = Id(i, e.pendingLanes);
        var u = bt(i, a);
        t.lanes = u, To(e, u);
      }
    }
    function e_(e, t, a) {
      Hl(e, t);
    }
    var Lm = {
      readContext: mr,
      useCallback: ma,
      useContext: ma,
      useEffect: ma,
      useImperativeHandle: ma,
      useInsertionEffect: ma,
      useLayoutEffect: ma,
      useMemo: ma,
      useReducer: ma,
      useRef: ma,
      useState: ma,
      useDebugValue: ma,
      useDeferredValue: ma,
      useTransition: ma,
      useMutableSource: ma,
      useSyncExternalStore: ma,
      useId: ma,
      unstable_isNewReconciler: se
    }, t_ = null, n_ = null, r_ = null, a_ = null, Jl = null, sl = null, Am = null;
    {
      var jS = function() {
        C("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, dt = function() {
        C("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      t_ = {
        readContext: function(e) {
          return mr(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", en(), Ff(t), LS(e, t);
        },
        useContext: function(e) {
          return X = "useContext", en(), mr(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", en(), Ff(t), Rm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", en(), Ff(a), NS(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", en(), Ff(t), kS(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", en(), Ff(t), MS(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", en(), Ff(t);
          var a = Re.current;
          Re.current = Jl;
          try {
            return AS(e, t);
          } finally {
            Re.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", en();
          var i = Re.current;
          Re.current = Jl;
          try {
            return bS(e, t, a);
          } finally {
            Re.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", en(), OS(e);
        },
        useState: function(e) {
          X = "useState", en();
          var t = Re.current;
          Re.current = Jl;
          try {
            return _m(e);
          } finally {
            Re.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", en(), void 0;
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", en(), zS(e);
        },
        useTransition: function() {
          return X = "useTransition", en(), US();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", en(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", en(), TS(e, t, a);
        },
        useId: function() {
          return X = "useId", en(), PS();
        },
        unstable_isNewReconciler: se
      }, n_ = {
        readContext: function(e) {
          return mr(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", Se(), LS(e, t);
        },
        useContext: function(e) {
          return X = "useContext", Se(), mr(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", Se(), Rm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", Se(), NS(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", Se(), kS(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", Se(), MS(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", Se();
          var a = Re.current;
          Re.current = Jl;
          try {
            return AS(e, t);
          } finally {
            Re.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", Se();
          var i = Re.current;
          Re.current = Jl;
          try {
            return bS(e, t, a);
          } finally {
            Re.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", Se(), OS(e);
        },
        useState: function(e) {
          X = "useState", Se();
          var t = Re.current;
          Re.current = Jl;
          try {
            return _m(e);
          } finally {
            Re.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", Se(), void 0;
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", Se(), zS(e);
        },
        useTransition: function() {
          return X = "useTransition", Se(), US();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", Se(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", Se(), TS(e, t, a);
        },
        useId: function() {
          return X = "useId", Se(), PS();
        },
        unstable_isNewReconciler: se
      }, r_ = {
        readContext: function(e) {
          return mr(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", Se(), km(e, t);
        },
        useContext: function(e) {
          return X = "useContext", Se(), mr(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", Se(), Vp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", Se(), Dm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", Se(), Tm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", Se(), xm(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", Se();
          var a = Re.current;
          Re.current = sl;
          try {
            return Mm(e, t);
          } finally {
            Re.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", Se();
          var i = Re.current;
          Re.current = sl;
          try {
            return wS(e, t, a);
          } finally {
            Re.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", Se(), bm();
        },
        useState: function(e) {
          X = "useState", Se();
          var t = Re.current;
          Re.current = sl;
          try {
            return xS(e);
          } finally {
            Re.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", Se(), Om();
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", Se(), YE(e);
        },
        useTransition: function() {
          return X = "useTransition", Se(), QE();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", Se(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", Se(), Em(e, t);
        },
        useId: function() {
          return X = "useId", Se(), Nm();
        },
        unstable_isNewReconciler: se
      }, a_ = {
        readContext: function(e) {
          return mr(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", Se(), km(e, t);
        },
        useContext: function(e) {
          return X = "useContext", Se(), mr(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", Se(), Vp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", Se(), Dm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", Se(), Tm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", Se(), xm(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", Se();
          var a = Re.current;
          Re.current = Am;
          try {
            return Mm(e, t);
          } finally {
            Re.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", Se();
          var i = Re.current;
          Re.current = Am;
          try {
            return RS(e, t, a);
          } finally {
            Re.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", Se(), bm();
        },
        useState: function(e) {
          X = "useState", Se();
          var t = Re.current;
          Re.current = Am;
          try {
            return DS(e);
          } finally {
            Re.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", Se(), Om();
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", Se(), WE(e);
        },
        useTransition: function() {
          return X = "useTransition", Se(), qE();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", Se(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", Se(), Em(e, t);
        },
        useId: function() {
          return X = "useId", Se(), Nm();
        },
        unstable_isNewReconciler: se
      }, Jl = {
        readContext: function(e) {
          return jS(), mr(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", dt(), en(), LS(e, t);
        },
        useContext: function(e) {
          return X = "useContext", dt(), en(), mr(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", dt(), en(), Rm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", dt(), en(), NS(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", dt(), en(), kS(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", dt(), en(), MS(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", dt(), en();
          var a = Re.current;
          Re.current = Jl;
          try {
            return AS(e, t);
          } finally {
            Re.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", dt(), en();
          var i = Re.current;
          Re.current = Jl;
          try {
            return bS(e, t, a);
          } finally {
            Re.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", dt(), en(), OS(e);
        },
        useState: function(e) {
          X = "useState", dt(), en();
          var t = Re.current;
          Re.current = Jl;
          try {
            return _m(e);
          } finally {
            Re.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", dt(), en(), void 0;
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", dt(), en(), zS(e);
        },
        useTransition: function() {
          return X = "useTransition", dt(), en(), US();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", dt(), en(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", dt(), en(), TS(e, t, a);
        },
        useId: function() {
          return X = "useId", dt(), en(), PS();
        },
        unstable_isNewReconciler: se
      }, sl = {
        readContext: function(e) {
          return jS(), mr(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", dt(), Se(), km(e, t);
        },
        useContext: function(e) {
          return X = "useContext", dt(), Se(), mr(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", dt(), Se(), Vp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", dt(), Se(), Dm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", dt(), Se(), Tm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", dt(), Se(), xm(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", dt(), Se();
          var a = Re.current;
          Re.current = sl;
          try {
            return Mm(e, t);
          } finally {
            Re.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", dt(), Se();
          var i = Re.current;
          Re.current = sl;
          try {
            return wS(e, t, a);
          } finally {
            Re.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", dt(), Se(), bm();
        },
        useState: function(e) {
          X = "useState", dt(), Se();
          var t = Re.current;
          Re.current = sl;
          try {
            return xS(e);
          } finally {
            Re.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", dt(), Se(), Om();
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", dt(), Se(), YE(e);
        },
        useTransition: function() {
          return X = "useTransition", dt(), Se(), QE();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", dt(), Se(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", dt(), Se(), Em(e, t);
        },
        useId: function() {
          return X = "useId", dt(), Se(), Nm();
        },
        unstable_isNewReconciler: se
      }, Am = {
        readContext: function(e) {
          return jS(), mr(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", dt(), Se(), km(e, t);
        },
        useContext: function(e) {
          return X = "useContext", dt(), Se(), mr(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", dt(), Se(), Vp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", dt(), Se(), Dm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", dt(), Se(), Tm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", dt(), Se(), xm(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", dt(), Se();
          var a = Re.current;
          Re.current = sl;
          try {
            return Mm(e, t);
          } finally {
            Re.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", dt(), Se();
          var i = Re.current;
          Re.current = sl;
          try {
            return RS(e, t, a);
          } finally {
            Re.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", dt(), Se(), bm();
        },
        useState: function(e) {
          X = "useState", dt(), Se();
          var t = Re.current;
          Re.current = sl;
          try {
            return DS(e);
          } finally {
            Re.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", dt(), Se(), Om();
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", dt(), Se(), WE(e);
        },
        useTransition: function() {
          return X = "useTransition", dt(), Se(), qE();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", dt(), Se(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", dt(), Se(), Em(e, t);
        },
        useId: function() {
          return X = "useId", dt(), Se(), Nm();
        },
        unstable_isNewReconciler: se
      };
    }
    var Xo = f.unstable_now, i_ = 0, zm = -1, $p = -1, Um = -1, FS = !1, Pm = !1;
    function l_() {
      return FS;
    }
    function lT() {
      Pm = !0;
    }
    function uT() {
      FS = !1, Pm = !1;
    }
    function oT() {
      FS = Pm, Pm = !1;
    }
    function u_() {
      return i_;
    }
    function o_() {
      i_ = Xo();
    }
    function HS(e) {
      $p = Xo(), e.actualStartTime < 0 && (e.actualStartTime = Xo());
    }
    function s_(e) {
      $p = -1;
    }
    function jm(e, t) {
      if ($p >= 0) {
        var a = Xo() - $p;
        e.actualDuration += a, t && (e.selfBaseDuration = a), $p = -1;
      }
    }
    function eu(e) {
      if (zm >= 0) {
        var t = Xo() - zm;
        zm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case ee:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case mt:
              var u = a.stateNode;
              u.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function BS(e) {
      if (Um >= 0) {
        var t = Xo() - Um;
        Um = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case ee:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case mt:
              var u = a.stateNode;
              u !== null && (u.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function tu() {
      zm = Xo();
    }
    function VS() {
      Um = Xo();
    }
    function $S(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function ec(e, t) {
      return {
        value: e,
        source: t,
        stack: no(t),
        digest: null
      };
    }
    function IS(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function sT(e, t) {
      return !0;
    }
    function YS(e, t) {
      try {
        var a = sT(e, t);
        if (a === !1)
          return;
        var i = t.value, u = t.source, s = t.stack, d = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === ie)
            return;
          console.error(i);
        }
        var v = u ? ft(u) : null, m = v ? "The above error occurred in the <" + v + "> component:" : "The above error occurred in one of your React components:", E;
        if (e.tag === ee)
          E = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var b = ft(e) || "Anonymous";
          E = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + b + ".");
        }
        var z = m + `
` + d + `

` + ("" + E);
        console.error(z);
      } catch (L) {
        setTimeout(function() {
          throw L;
        });
      }
    }
    var cT = typeof WeakMap == "function" ? WeakMap : Map;
    function c_(e, t, a) {
      var i = Vu(sn, a);
      i.tag = Yg, i.payload = {
        element: null
      };
      var u = t.value;
      return i.callback = function() {
        nD(u), YS(e, t);
      }, i;
    }
    function WS(e, t, a) {
      var i = Vu(sn, a);
      i.tag = Yg;
      var u = e.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var s = t.value;
        i.payload = function() {
          return u(s);
        }, i.callback = function() {
          Eb(e), YS(e, t);
        };
      }
      var d = e.stateNode;
      return d !== null && typeof d.componentDidCatch == "function" && (i.callback = function() {
        Eb(e), YS(e, t), typeof u != "function" && eD(this);
        var m = t.value, E = t.stack;
        this.componentDidCatch(m, {
          componentStack: E !== null ? E : ""
        }), typeof u != "function" && (pa(e.lanes, rt) || C("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", ft(e) || "Unknown"));
      }), i;
    }
    function f_(e, t, a) {
      var i = e.pingCache, u;
      if (i === null ? (i = e.pingCache = new cT(), u = /* @__PURE__ */ new Set(), i.set(t, u)) : (u = i.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(t, u))), !u.has(a)) {
        u.add(a);
        var s = rD.bind(null, e, t, a);
        br && iv(e, a), t.then(s, s);
      }
    }
    function fT(e, t, a, i) {
      var u = e.updateQueue;
      if (u === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        u.add(a);
    }
    function dT(e, t) {
      var a = e.tag;
      if ((e.mode & xt) === Ze && (a === J || a === He || a === nt)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function d_(e) {
      var t = e;
      do {
        if (t.tag === je && XR(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function p_(e, t, a, i, u) {
      if ((e.mode & xt) === Ze) {
        if (e === t)
          e.flags |= fr;
        else {
          if (e.flags |= lt, a.flags |= _s, a.flags &= ~(Rc | _a), a.tag === ie) {
            var s = a.alternate;
            if (s === null)
              a.tag = Rn;
            else {
              var d = Vu(sn, rt);
              d.tag = om, Wo(a, d, rt);
            }
          }
          a.lanes = bt(a.lanes, rt);
        }
        return e;
      }
      return e.flags |= fr, e.lanes = u, e;
    }
    function pT(e, t, a, i, u) {
      if (a.flags |= _a, br && iv(e, u), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        dT(a), Qr() && a.mode & xt && rE();
        var d = d_(t);
        if (d !== null) {
          d.flags &= ~An, p_(d, t, a, e, u), d.mode & xt && f_(e, s, u), fT(d, e, s);
          return;
        } else {
          if (!wo(u)) {
            f_(e, s, u), R0();
            return;
          }
          var v = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = v;
        }
      } else if (Qr() && a.mode & xt) {
        rE();
        var m = d_(t);
        if (m !== null) {
          (m.flags & fr) === Ye && (m.flags |= An), p_(m, t, a, e, u), jg(ec(i, a));
          return;
        }
      }
      i = ec(i, a), Wx(i);
      var E = t;
      do {
        switch (E.tag) {
          case ee: {
            var b = i;
            E.flags |= fr;
            var z = nr(u);
            E.lanes = bt(E.lanes, z);
            var L = c_(E, b, z);
            Qg(E, L);
            return;
          }
          case ie:
            var B = i, $ = E.type, W = E.stateNode;
            if ((E.flags & lt) === Ye && (typeof $.getDerivedStateFromError == "function" || W !== null && typeof W.componentDidCatch == "function" && !db(W))) {
              E.flags |= fr;
              var xe = nr(u);
              E.lanes = bt(E.lanes, xe);
              var qe = WS(E, B, xe);
              Qg(E, qe);
              return;
            }
            break;
        }
        E = E.return;
      } while (E !== null);
    }
    function vT() {
      return null;
    }
    var Ip = h.ReactCurrentOwner, cl = !1, GS, Yp, QS, qS, XS, tc, KS, Fm;
    GS = {}, Yp = {}, QS = {}, qS = {}, XS = {}, tc = !1, KS = {}, Fm = {};
    function Da(e, t, a, i) {
      e === null ? t.child = ME(t, null, a, i) : t.child = Af(t, e.child, a, i);
    }
    function hT(e, t, a, i) {
      t.child = Af(t, e.child, null, i), t.child = Af(t, null, a, i);
    }
    function v_(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && al(s, i, "prop", Bt(a));
      }
      var d = a.render, v = t.ref, m, E;
      Lf(t, u), Fl(t);
      {
        if (Ip.current = t, aa(!0), m = Hf(e, t, d, i, v, u), E = Bf(), t.mode & On) {
          tr(!0);
          try {
            m = Hf(e, t, d, i, v, u), E = Bf();
          } finally {
            tr(!1);
          }
        }
        aa(!1);
      }
      return yu(), e !== null && !cl ? (UE(e, t, u), $u(e, t, u)) : (Qr() && E && Ng(t), t.flags |= Nl, Da(e, t, m, u), t.child);
    }
    function h_(e, t, a, i, u) {
      if (e === null) {
        var s = a.type;
        if (CD(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var d = s;
          return d = qf(s), t.tag = nt, t.type = d, e0(t, s), m_(e, t, d, i, u);
        }
        {
          var v = s.propTypes;
          v && al(v, i, "prop", Bt(s));
        }
        var m = U0(a.type, null, i, t, t.mode, u);
        return m.ref = t.ref, m.return = t, t.child = m, m;
      }
      {
        var E = a.type, b = E.propTypes;
        b && al(b, i, "prop", Bt(E));
      }
      var z = e.child, L = l0(e, u);
      if (!L) {
        var B = z.memoizedProps, $ = a.compare;
        if ($ = $ !== null ? $ : Ie, $(B, i) && e.ref === t.ref)
          return $u(e, t, u);
      }
      t.flags |= Nl;
      var W = lc(z, i);
      return W.ref = t.ref, W.return = t, t.child = W, W;
    }
    function m_(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === Qe) {
          var d = s, v = d._payload, m = d._init;
          try {
            s = m(v);
          } catch {
            s = null;
          }
          var E = s && s.propTypes;
          E && al(E, i, "prop", Bt(s));
        }
      }
      if (e !== null) {
        var b = e.memoizedProps;
        if (Ie(b, i) && e.ref === t.ref && t.type === e.type)
          if (cl = !1, t.pendingProps = i = b, l0(e, u))
            (e.flags & _s) !== Ye && (cl = !0);
          else
            return t.lanes = e.lanes, $u(e, t, u);
      }
      return ZS(e, t, a, i, u);
    }
    function y_(e, t, a) {
      var i = t.pendingProps, u = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || O)
        if ((t.mode & xt) === Ze) {
          var d = {
            baseLanes: Q,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = d, Zm(t, a);
        } else if (pa(a, da)) {
          var z = {
            baseLanes: Q,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = z;
          var L = s !== null ? s.baseLanes : a;
          Zm(t, L);
        } else {
          var v = null, m;
          if (s !== null) {
            var E = s.baseLanes;
            m = bt(E, a);
          } else
            m = a;
          t.lanes = t.childLanes = da;
          var b = {
            baseLanes: m,
            cachePool: v,
            transitions: null
          };
          return t.memoizedState = b, t.updateQueue = null, Zm(t, m), null;
        }
      else {
        var B;
        s !== null ? (B = bt(s.baseLanes, a), t.memoizedState = null) : B = a, Zm(t, B);
      }
      return Da(e, t, u, a), t.child;
    }
    function mT(e, t, a) {
      var i = t.pendingProps;
      return Da(e, t, i, a), t.child;
    }
    function yT(e, t, a) {
      var i = t.pendingProps.children;
      return Da(e, t, i, a), t.child;
    }
    function gT(e, t, a) {
      {
        t.flags |= _t;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var u = t.pendingProps, s = u.children;
      return Da(e, t, s, a), t.child;
    }
    function g_(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= la, t.flags |= xd);
    }
    function ZS(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && al(s, i, "prop", Bt(a));
      }
      var d;
      {
        var v = xf(t, a, !0);
        d = Df(t, v);
      }
      var m, E;
      Lf(t, u), Fl(t);
      {
        if (Ip.current = t, aa(!0), m = Hf(e, t, a, i, d, u), E = Bf(), t.mode & On) {
          tr(!0);
          try {
            m = Hf(e, t, a, i, d, u), E = Bf();
          } finally {
            tr(!1);
          }
        }
        aa(!1);
      }
      return yu(), e !== null && !cl ? (UE(e, t, u), $u(e, t, u)) : (Qr() && E && Ng(t), t.flags |= Nl, Da(e, t, m, u), t.child);
    }
    function S_(e, t, a, i, u) {
      {
        switch (zD(t)) {
          case !1: {
            var s = t.stateNode, d = t.type, v = new d(t.memoizedProps, s.context), m = v.state;
            s.updater.enqueueSetState(s, m, null);
            break;
          }
          case !0: {
            t.flags |= lt, t.flags |= fr;
            var E = new Error("Simulated error coming from DevTools"), b = nr(u);
            t.lanes = bt(t.lanes, b);
            var z = WS(t, ec(E, t), b);
            Qg(t, z);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var L = a.propTypes;
          L && al(L, i, "prop", Bt(a));
        }
      }
      var B;
      Xl(a) ? (B = !0, Kh(t)) : B = !1, Lf(t, u);
      var $ = t.stateNode, W;
      $ === null ? (Bm(e, t), TE(t, a, i), lS(t, a, i, u), W = !0) : e === null ? W = IR(t, a, i, u) : W = YR(e, t, a, i, u);
      var xe = JS(e, t, a, W, B, u);
      {
        var qe = t.stateNode;
        W && qe.props !== i && (tc || C("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", ft(t) || "a component"), tc = !0);
      }
      return xe;
    }
    function JS(e, t, a, i, u, s) {
      g_(e, t);
      var d = (t.flags & lt) !== Ye;
      if (!i && !d)
        return u && JC(t, a, !1), $u(e, t, s);
      var v = t.stateNode;
      Ip.current = t;
      var m;
      if (d && typeof a.getDerivedStateFromError != "function")
        m = null, s_();
      else {
        Fl(t);
        {
          if (aa(!0), m = v.render(), t.mode & On) {
            tr(!0);
            try {
              v.render();
            } finally {
              tr(!1);
            }
          }
          aa(!1);
        }
        yu();
      }
      return t.flags |= Nl, e !== null && d ? hT(e, t, m, s) : Da(e, t, m, s), t.memoizedState = v.state, u && JC(t, a, !0), t.child;
    }
    function C_(e) {
      var t = e.stateNode;
      t.pendingContext ? KC(e, t.pendingContext, t.pendingContext !== t.context) : t.context && KC(e, t.context, !1), dS(e, t.containerInfo);
    }
    function ST(e, t, a) {
      if (C_(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, u = t.memoizedState, s = u.element;
      gE(e, t), dm(t, i, null, a);
      var d = t.memoizedState;
      t.stateNode;
      var v = d.element;
      if (u.isDehydrated) {
        var m = {
          element: v,
          isDehydrated: !1,
          cache: d.cache,
          pendingSuspenseBoundaries: d.pendingSuspenseBoundaries,
          transitions: d.transitions
        }, E = t.updateQueue;
        if (E.baseState = m, t.memoizedState = m, t.flags & An) {
          var b = ec(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return E_(e, t, v, a, b);
        } else if (v !== s) {
          var z = ec(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return E_(e, t, v, a, z);
        } else {
          bR(t);
          var L = ME(t, null, v, a);
          t.child = L;
          for (var B = L; B; )
            B.flags = B.flags & ~mn | Fa, B = B.sibling;
        }
      } else {
        if (Mf(), v === s)
          return $u(e, t, a);
        Da(e, t, v, a);
      }
      return t.child;
    }
    function E_(e, t, a, i, u) {
      return Mf(), jg(u), t.flags |= An, Da(e, t, a, i), t.child;
    }
    function CT(e, t, a) {
      LE(t), e === null && Pg(t);
      var i = t.type, u = t.pendingProps, s = e !== null ? e.memoizedProps : null, d = u.children, v = gg(i, u);
      return v ? d = null : s !== null && gg(i, s) && (t.flags |= Jt), g_(e, t), Da(e, t, d, a), t.child;
    }
    function ET(e, t) {
      return e === null && Pg(t), null;
    }
    function _T(e, t, a, i) {
      Bm(e, t);
      var u = t.pendingProps, s = a, d = s._payload, v = s._init, m = v(d);
      t.type = m;
      var E = t.tag = ED(m), b = ul(m, u), z;
      switch (E) {
        case J:
          return e0(t, m), t.type = m = qf(m), z = ZS(null, t, m, b, i), z;
        case ie:
          return t.type = m = k0(m), z = S_(null, t, m, b, i), z;
        case He:
          return t.type = m = M0(m), z = v_(null, t, m, b, i), z;
        case yt: {
          if (t.type !== t.elementType) {
            var L = m.propTypes;
            L && al(L, b, "prop", Bt(m));
          }
          return z = h_(null, t, m, ul(m.type, b), i), z;
        }
      }
      var B = "";
      throw m !== null && typeof m == "object" && m.$$typeof === Qe && (B = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + m + ". " + ("Lazy element type must resolve to a class or function." + B));
    }
    function bT(e, t, a, i, u) {
      Bm(e, t), t.tag = ie;
      var s;
      return Xl(a) ? (s = !0, Kh(t)) : s = !1, Lf(t, u), TE(t, a, i), lS(t, a, i, u), JS(null, t, a, !0, s, u);
    }
    function wT(e, t, a, i) {
      Bm(e, t);
      var u = t.pendingProps, s;
      {
        var d = xf(t, a, !1);
        s = Df(t, d);
      }
      Lf(t, i);
      var v, m;
      Fl(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var E = Bt(a) || "Unknown";
          GS[E] || (C("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", E, E), GS[E] = !0);
        }
        t.mode & On && ll.recordLegacyContextWarning(t, null), aa(!0), Ip.current = t, v = Hf(null, t, a, u, s, i), m = Bf(), aa(!1);
      }
      if (yu(), t.flags |= Nl, typeof v == "object" && v !== null && typeof v.render == "function" && v.$$typeof === void 0) {
        var b = Bt(a) || "Unknown";
        Yp[b] || (C("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", b, b, b), Yp[b] = !0);
      }
      if (
        // Eventually we'll delete this branch altogether.
        typeof v == "object" && v !== null && typeof v.render == "function" && v.$$typeof === void 0
      ) {
        {
          var z = Bt(a) || "Unknown";
          Yp[z] || (C("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", z, z, z), Yp[z] = !0);
        }
        t.tag = ie, t.memoizedState = null, t.updateQueue = null;
        var L = !1;
        return Xl(a) ? (L = !0, Kh(t)) : L = !1, t.memoizedState = v.state !== null && v.state !== void 0 ? v.state : null, Gg(t), RE(t, v), lS(t, a, u, i), JS(null, t, a, !0, L, i);
      } else {
        if (t.tag = J, t.mode & On) {
          tr(!0);
          try {
            v = Hf(null, t, a, u, s, i), m = Bf();
          } finally {
            tr(!1);
          }
        }
        return Qr() && m && Ng(t), Da(null, t, v, i), e0(t, a), t.child;
      }
    }
    function e0(e, t) {
      {
        if (t && t.childContextTypes && C("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Yr();
          i && (a += `

Check the render method of \`` + i + "`.");
          var u = i || "", s = e._debugSource;
          s && (u = s.fileName + ":" + s.lineNumber), XS[u] || (XS[u] = !0, C("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var d = Bt(t) || "Unknown";
          qS[d] || (C("%s: Function components do not support getDerivedStateFromProps.", d), qS[d] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var v = Bt(t) || "Unknown";
          QS[v] || (C("%s: Function components do not support contextType.", v), QS[v] = !0);
        }
      }
    }
    var t0 = {
      dehydrated: null,
      treeContext: null,
      retryLane: At
    };
    function n0(e) {
      return {
        baseLanes: e,
        cachePool: vT(),
        transitions: null
      };
    }
    function RT(e, t) {
      var a = null;
      return {
        baseLanes: bt(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function TT(e, t, a, i) {
      if (t !== null) {
        var u = t.memoizedState;
        if (u === null)
          return !1;
      }
      return hS(e, Up);
    }
    function xT(e, t) {
      return Ro(e.childLanes, t);
    }
    function __(e, t, a) {
      var i = t.pendingProps;
      UD(t) && (t.flags |= lt);
      var u = ol.current, s = !1, d = (t.flags & lt) !== Ye;
      if (d || TT(u, e) ? (s = !0, t.flags &= ~lt) : (e === null || e.memoizedState !== null) && (u = qR(u, zE)), u = Uf(u), Qo(t, u), e === null) {
        Pg(t);
        var v = t.memoizedState;
        if (v !== null) {
          var m = v.dehydrated;
          if (m !== null)
            return NT(t, m);
        }
        var E = i.children, b = i.fallback;
        if (s) {
          var z = DT(t, E, b, a), L = t.child;
          return L.memoizedState = n0(a), t.memoizedState = t0, z;
        } else
          return r0(t, E);
      } else {
        var B = e.memoizedState;
        if (B !== null) {
          var $ = B.dehydrated;
          if ($ !== null)
            return LT(e, t, d, i, $, B, a);
        }
        if (s) {
          var W = i.fallback, xe = i.children, qe = kT(e, t, xe, W, a), Be = t.child, Ut = e.child.memoizedState;
          return Be.memoizedState = Ut === null ? n0(a) : RT(Ut, a), Be.childLanes = xT(e, a), t.memoizedState = t0, qe;
        } else {
          var Mt = i.children, P = OT(e, t, Mt, a);
          return t.memoizedState = null, P;
        }
      }
    }
    function r0(e, t, a) {
      var i = e.mode, u = {
        mode: "visible",
        children: t
      }, s = a0(u, i);
      return s.return = e, e.child = s, s;
    }
    function DT(e, t, a, i) {
      var u = e.mode, s = e.child, d = {
        mode: "hidden",
        children: t
      }, v, m;
      return (u & xt) === Ze && s !== null ? (v = s, v.childLanes = Q, v.pendingProps = d, e.mode & tt && (v.actualDuration = 0, v.actualStartTime = -1, v.selfBaseDuration = 0, v.treeBaseDuration = 0), m = ns(a, u, i, null)) : (v = a0(d, u), m = ns(a, u, i, null)), v.return = e, m.return = e, v.sibling = m, e.child = v, m;
    }
    function a0(e, t, a) {
      return bb(e, t, Q, null);
    }
    function b_(e, t) {
      return lc(e, t);
    }
    function OT(e, t, a, i) {
      var u = e.child, s = u.sibling, d = b_(u, {
        mode: "visible",
        children: a
      });
      if ((t.mode & xt) === Ze && (d.lanes = i), d.return = t, d.sibling = null, s !== null) {
        var v = t.deletions;
        v === null ? (t.deletions = [
          s
        ], t.flags |= qt) : v.push(s);
      }
      return t.child = d, d;
    }
    function kT(e, t, a, i, u) {
      var s = t.mode, d = e.child, v = d.sibling, m = {
        mode: "hidden",
        children: a
      }, E;
      if (
        // completed, even though it's in an inconsistent state.
        (s & xt) === Ze && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== d
      ) {
        var b = t.child;
        E = b, E.childLanes = Q, E.pendingProps = m, t.mode & tt && (E.actualDuration = 0, E.actualStartTime = -1, E.selfBaseDuration = d.selfBaseDuration, E.treeBaseDuration = d.treeBaseDuration), t.deletions = null;
      } else
        E = b_(d, m), E.subtreeFlags = d.subtreeFlags & _r;
      var z;
      return v !== null ? z = lc(v, i) : (z = ns(i, s, u, null), z.flags |= mn), z.return = t, E.return = t, E.sibling = z, t.child = E, z;
    }
    function Hm(e, t, a, i) {
      i !== null && jg(i), Af(t, e.child, null, a);
      var u = t.pendingProps, s = u.children, d = r0(t, s);
      return d.flags |= mn, t.memoizedState = null, d;
    }
    function MT(e, t, a, i, u) {
      var s = t.mode, d = {
        mode: "visible",
        children: a
      }, v = a0(d, s), m = ns(i, s, u, null);
      return m.flags |= mn, v.return = t, m.return = t, v.sibling = m, t.child = v, (t.mode & xt) !== Ze && Af(t, e.child, null, u), m;
    }
    function NT(e, t, a) {
      return (e.mode & xt) === Ze ? (C("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = rt) : _g(t) ? e.lanes = Cu : e.lanes = da, null;
    }
    function LT(e, t, a, i, u, s, d) {
      if (a)
        if (t.flags & An) {
          t.flags &= ~An;
          var P = IS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return Hm(e, t, d, P);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= lt, null;
          var G = i.children, j = i.fallback, ue = MT(e, t, G, j, d), De = t.child;
          return De.memoizedState = n0(d), t.memoizedState = t0, ue;
        }
      else {
        if (ER(), (t.mode & xt) === Ze)
          return Hm(
            e,
            t,
            d,
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (_g(u)) {
          var v, m, E;
          {
            var b = jw(u);
            v = b.digest, m = b.message, E = b.stack;
          }
          var z;
          m ? z = new Error(m) : z = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var L = IS(z, v, E);
          return Hm(e, t, d, L);
        }
        var B = pa(d, e.childLanes);
        if (cl || B) {
          var $ = Km();
          if ($ !== null) {
            var W = $y($, d);
            if (W !== At && W !== s.retryLane) {
              s.retryLane = W;
              var xe = sn;
              qa(e, W), Nr($, e, W, xe);
            }
          }
          R0();
          var qe = IS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return Hm(e, t, d, qe);
        } else if (YC(u)) {
          t.flags |= lt, t.child = e.child;
          var Be = aD.bind(null, e);
          return Fw(u, Be), null;
        } else {
          wR(t, u, s.treeContext);
          var Ut = i.children, Mt = r0(t, Ut);
          return Mt.flags |= Fa, Mt;
        }
      }
    }
    function w_(e, t, a) {
      e.lanes = bt(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = bt(i.lanes, t)), $g(e.return, t, a);
    }
    function AT(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === je) {
          var u = i.memoizedState;
          u !== null && w_(i, a, e);
        } else if (i.tag === jt)
          w_(i, a, e);
        else if (i.child !== null) {
          i.child.return = i, i = i.child;
          continue;
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          i = i.return;
        }
        i.sibling.return = i.return, i = i.sibling;
      }
    }
    function zT(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && Sm(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function UT(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !KS[e])
        if (KS[e] = !0, typeof e == "string")
          switch (e.toLowerCase()) {
            case "together":
            case "forwards":
            case "backwards": {
              C('"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.', e, e.toLowerCase());
              break;
            }
            case "forward":
            case "backward": {
              C('"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.', e, e.toLowerCase());
              break;
            }
            default:
              C('"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
              break;
          }
        else
          C('%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
    }
    function PT(e, t) {
      e !== void 0 && !Fm[e] && (e !== "collapsed" && e !== "hidden" ? (Fm[e] = !0, C('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (Fm[e] = !0, C('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function R_(e, t) {
      {
        var a = Nt(e), i = !a && typeof ri(e) == "function";
        if (a || i) {
          var u = a ? "array" : "iterable";
          return C("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", u, t, u), !1;
        }
      }
      return !0;
    }
    function jT(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (Nt(e)) {
          for (var a = 0; a < e.length; a++)
            if (!R_(e[a], a))
              return;
        } else {
          var i = ri(e);
          if (typeof i == "function") {
            var u = i.call(e);
            if (u)
              for (var s = u.next(), d = 0; !s.done; s = u.next()) {
                if (!R_(s.value, d))
                  return;
                d++;
              }
          } else
            C('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function i0(e, t, a, i, u) {
      var s = e.memoizedState;
      s === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: i,
        tail: a,
        tailMode: u
      } : (s.isBackwards = t, s.rendering = null, s.renderingStartTime = 0, s.last = i, s.tail = a, s.tailMode = u);
    }
    function T_(e, t, a) {
      var i = t.pendingProps, u = i.revealOrder, s = i.tail, d = i.children;
      UT(u), PT(s, u), jT(d, u), Da(e, t, d, a);
      var v = ol.current, m = hS(v, Up);
      if (m)
        v = mS(v, Up), t.flags |= lt;
      else {
        var E = e !== null && (e.flags & lt) !== Ye;
        E && AT(t, t.child, a), v = Uf(v);
      }
      if (Qo(t, v), (t.mode & xt) === Ze)
        t.memoizedState = null;
      else
        switch (u) {
          case "forwards": {
            var b = zT(t.child), z;
            b === null ? (z = t.child, t.child = null) : (z = b.sibling, b.sibling = null), i0(t, !1, z, b, s);
            break;
          }
          case "backwards": {
            var L = null, B = t.child;
            for (t.child = null; B !== null; ) {
              var $ = B.alternate;
              if ($ !== null && Sm($) === null) {
                t.child = B;
                break;
              }
              var W = B.sibling;
              B.sibling = L, L = B, B = W;
            }
            i0(t, !0, L, null, s);
            break;
          }
          case "together": {
            i0(t, !1, null, null, void 0);
            break;
          }
          default:
            t.memoizedState = null;
        }
      return t.child;
    }
    function FT(e, t, a) {
      dS(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = Af(t, null, i, a) : Da(e, t, i, a), t.child;
    }
    var x_ = !1;
    function HT(e, t, a) {
      var i = t.type, u = i._context, s = t.pendingProps, d = t.memoizedProps, v = s.value;
      {
        "value" in s || x_ || (x_ = !0, C("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var m = t.type.propTypes;
        m && al(m, s, "prop", "Context.Provider");
      }
      if (vE(t, u, v), d !== null) {
        var E = d.value;
        if (Le(E, v)) {
          if (d.children === s.children && !qh())
            return $u(e, t, a);
        } else
          AR(t, u, a);
      }
      var b = s.children;
      return Da(e, t, b, a), t.child;
    }
    var D_ = !1;
    function BT(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (D_ || (D_ = !0, C("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var u = t.pendingProps, s = u.children;
      typeof s != "function" && C("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Lf(t, a);
      var d = mr(i);
      Fl(t);
      var v;
      return Ip.current = t, aa(!0), v = s(d), aa(!1), yu(), t.flags |= Nl, Da(e, t, v, a), t.child;
    }
    function Wp() {
      cl = !0;
    }
    function Bm(e, t) {
      (t.mode & xt) === Ze && e !== null && (e.alternate = null, t.alternate = null, t.flags |= mn);
    }
    function $u(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), s_(), av(t.lanes), pa(a, t.childLanes) ? (WR(e, t), t.child) : null;
    }
    function VT(e, t, a) {
      {
        var i = t.return;
        if (i === null)
          throw new Error("Cannot swap the root fiber.");
        if (e.alternate = null, t.alternate = null, a.index = t.index, a.sibling = t.sibling, a.return = t.return, a.ref = t.ref, t === i.child)
          i.child = a;
        else {
          var u = i.child;
          if (u === null)
            throw new Error("Expected parent to have a child.");
          for (; u.sibling !== t; )
            if (u = u.sibling, u === null)
              throw new Error("Expected to find the previous sibling.");
          u.sibling = a;
        }
        var s = i.deletions;
        return s === null ? (i.deletions = [
          e
        ], i.flags |= qt) : s.push(e), a.flags |= mn, a;
      }
    }
    function l0(e, t) {
      var a = e.lanes;
      return !!pa(a, t);
    }
    function $T(e, t, a) {
      switch (t.tag) {
        case ee:
          C_(t), t.stateNode, Mf();
          break;
        case ve:
          LE(t);
          break;
        case ie: {
          var i = t.type;
          Xl(i) && Kh(t);
          break;
        }
        case de:
          dS(t, t.stateNode.containerInfo);
          break;
        case $e: {
          var u = t.memoizedProps.value, s = t.type._context;
          vE(t, s, u);
          break;
        }
        case mt:
          {
            var d = pa(a, t.childLanes);
            d && (t.flags |= _t);
            {
              var v = t.stateNode;
              v.effectDuration = 0, v.passiveEffectDuration = 0;
            }
          }
          break;
        case je: {
          var m = t.memoizedState;
          if (m !== null) {
            if (m.dehydrated !== null)
              return Qo(t, Uf(ol.current)), t.flags |= lt, null;
            var E = t.child, b = E.childLanes;
            if (pa(a, b))
              return __(e, t, a);
            Qo(t, Uf(ol.current));
            var z = $u(e, t, a);
            return z !== null ? z.sibling : null;
          } else
            Qo(t, Uf(ol.current));
          break;
        }
        case jt: {
          var L = (e.flags & lt) !== Ye, B = pa(a, t.childLanes);
          if (L) {
            if (B)
              return T_(e, t, a);
            t.flags |= lt;
          }
          var $ = t.memoizedState;
          if ($ !== null && ($.rendering = null, $.tail = null, $.lastEffect = null), Qo(t, ol.current), B)
            break;
          return null;
        }
        case Xe:
        case ct:
          return t.lanes = Q, y_(e, t, a);
      }
      return $u(e, t, a);
    }
    function O_(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return VT(e, t, U0(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, u = t.pendingProps;
        if (i !== u || qh() || t.type !== e.type)
          cl = !0;
        else {
          var s = l0(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & lt) === Ye)
            return cl = !1, $T(e, t, a);
          (e.flags & _s) !== Ye ? cl = !0 : cl = !1;
        }
      } else if (cl = !1, Qr() && hR(t)) {
        var d = t.index, v = mR();
        nE(t, v, d);
      }
      switch (t.lanes = Q, t.tag) {
        case _e:
          return wT(e, t, t.type, a);
        case an: {
          var m = t.elementType;
          return _T(e, t, m, a);
        }
        case J: {
          var E = t.type, b = t.pendingProps, z = t.elementType === E ? b : ul(E, b);
          return ZS(e, t, E, z, a);
        }
        case ie: {
          var L = t.type, B = t.pendingProps, $ = t.elementType === L ? B : ul(L, B);
          return S_(e, t, L, $, a);
        }
        case ee:
          return ST(e, t, a);
        case ve:
          return CT(e, t, a);
        case ke:
          return ET(e, t);
        case je:
          return __(e, t, a);
        case de:
          return FT(e, t, a);
        case He: {
          var W = t.type, xe = t.pendingProps, qe = t.elementType === W ? xe : ul(W, xe);
          return v_(e, t, W, qe, a);
        }
        case ot:
          return mT(e, t, a);
        case st:
          return yT(e, t, a);
        case mt:
          return gT(e, t, a);
        case $e:
          return HT(e, t, a);
        case It:
          return BT(e, t, a);
        case yt: {
          var Be = t.type, Ut = t.pendingProps, Mt = ul(Be, Ut);
          if (t.type !== t.elementType) {
            var P = Be.propTypes;
            P && al(P, Mt, "prop", Bt(Be));
          }
          return Mt = ul(Be.type, Mt), h_(e, t, Be, Mt, a);
        }
        case nt:
          return m_(e, t, t.type, t.pendingProps, a);
        case Rn: {
          var G = t.type, j = t.pendingProps, ue = t.elementType === G ? j : ul(G, j);
          return bT(e, t, G, ue, a);
        }
        case jt:
          return T_(e, t, a);
        case En:
          break;
        case Xe:
          return y_(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Vf(e) {
      e.flags |= _t;
    }
    function k_(e) {
      e.flags |= la, e.flags |= xd;
    }
    var M_, u0, N_, L_;
    M_ = function(e, t, a, i) {
      for (var u = t.child; u !== null; ) {
        if (u.tag === ve || u.tag === ke)
          dw(e, u.stateNode);
        else if (u.tag !== de) {
          if (u.child !== null) {
            u.child.return = u, u = u.child;
            continue;
          }
        }
        if (u === t)
          return;
        for (; u.sibling === null; ) {
          if (u.return === null || u.return === t)
            return;
          u = u.return;
        }
        u.sibling.return = u.return, u = u.sibling;
      }
    }, u0 = function(e, t) {
    }, N_ = function(e, t, a, i, u) {
      var s = e.memoizedProps;
      if (s !== i) {
        var d = t.stateNode, v = pS(), m = vw(d, a, s, i, u, v);
        t.updateQueue = m, m && Vf(t);
      }
    }, L_ = function(e, t, a, i) {
      a !== i && Vf(t);
    };
    function Gp(e, t) {
      if (!Qr())
        switch (e.tailMode) {
          case "hidden": {
            for (var a = e.tail, i = null; a !== null; )
              a.alternate !== null && (i = a), a = a.sibling;
            i === null ? e.tail = null : i.sibling = null;
            break;
          }
          case "collapsed": {
            for (var u = e.tail, s = null; u !== null; )
              u.alternate !== null && (s = u), u = u.sibling;
            s === null ? !t && e.tail !== null ? e.tail.sibling = null : e.tail = null : s.sibling = null;
            break;
          }
        }
    }
    function Xr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = Q, i = Ye;
      if (t) {
        if ((e.mode & tt) !== Ze) {
          for (var m = e.selfBaseDuration, E = e.child; E !== null; )
            a = bt(a, bt(E.lanes, E.childLanes)), i |= E.subtreeFlags & _r, i |= E.flags & _r, m += E.treeBaseDuration, E = E.sibling;
          e.treeBaseDuration = m;
        } else
          for (var b = e.child; b !== null; )
            a = bt(a, bt(b.lanes, b.childLanes)), i |= b.subtreeFlags & _r, i |= b.flags & _r, b.return = e, b = b.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & tt) !== Ze) {
          for (var u = e.actualDuration, s = e.selfBaseDuration, d = e.child; d !== null; )
            a = bt(a, bt(d.lanes, d.childLanes)), i |= d.subtreeFlags, i |= d.flags, u += d.actualDuration, s += d.treeBaseDuration, d = d.sibling;
          e.actualDuration = u, e.treeBaseDuration = s;
        } else
          for (var v = e.child; v !== null; )
            a = bt(a, bt(v.lanes, v.childLanes)), i |= v.subtreeFlags, i |= v.flags, v.return = e, v = v.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function IT(e, t, a) {
      if (OR() && (t.mode & xt) !== Ze && (t.flags & lt) === Ye)
        return sE(t), Mf(), t.flags |= An | _a | fr, !1;
      var i = nm(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (xR(t), Xr(t), (t.mode & tt) !== Ze) {
            var u = a !== null;
            if (u) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (Mf(), (t.flags & lt) === Ye && (t.memoizedState = null), t.flags |= _t, Xr(t), (t.mode & tt) !== Ze) {
            var d = a !== null;
            if (d) {
              var v = t.child;
              v !== null && (t.treeBaseDuration -= v.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return cE(), !0;
    }
    function A_(e, t, a) {
      var i = t.pendingProps;
      switch (Lg(t), t.tag) {
        case _e:
        case an:
        case nt:
        case J:
        case He:
        case ot:
        case st:
        case mt:
        case It:
        case yt:
          return Xr(t), null;
        case ie: {
          var u = t.type;
          return Xl(u) && Xh(t), Xr(t), null;
        }
        case ee: {
          var s = t.stateNode;
          if (zf(t), Og(t), gS(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var d = nm(t);
            if (d)
              Vf(t);
            else if (e !== null) {
              var v = e.memoizedState;
              (!v.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & An) !== Ye) && (t.flags |= ja, cE());
            }
          }
          return u0(e, t), Xr(t), null;
        }
        case ve: {
          vS(t);
          var m = NE(), E = t.type;
          if (e !== null && t.stateNode != null)
            N_(e, t, E, i, m), e.ref !== t.ref && k_(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Xr(t), null;
            }
            var b = pS(), z = nm(t);
            if (z)
              RR(t, m, b) && Vf(t);
            else {
              var L = fw(E, i, m, b, t);
              M_(L, t, !1, !1), t.stateNode = L, pw(L, E, i, m) && Vf(t);
            }
            t.ref !== null && k_(t);
          }
          return Xr(t), null;
        }
        case ke: {
          var B = i;
          if (e && t.stateNode != null) {
            var $ = e.memoizedProps;
            L_(e, t, $, B);
          } else {
            if (typeof B != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var W = NE(), xe = pS(), qe = nm(t);
            qe ? TR(t) && Vf(t) : t.stateNode = hw(B, W, xe, t);
          }
          return Xr(t), null;
        }
        case je: {
          Pf(t);
          var Be = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var Ut = IT(e, t, Be);
            if (!Ut)
              return t.flags & fr ? t : null;
          }
          if ((t.flags & lt) !== Ye)
            return t.lanes = a, (t.mode & tt) !== Ze && $S(t), t;
          var Mt = Be !== null, P = e !== null && e.memoizedState !== null;
          if (Mt !== P && Mt) {
            var G = t.child;
            if (G.flags |= Ll, (t.mode & xt) !== Ze) {
              var j = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !K);
              j || hS(ol.current, zE) ? Yx() : R0();
            }
          }
          var ue = t.updateQueue;
          if (ue !== null && (t.flags |= _t), Xr(t), (t.mode & tt) !== Ze && Mt) {
            var De = t.child;
            De !== null && (t.treeBaseDuration -= De.treeBaseDuration);
          }
          return null;
        }
        case de:
          return zf(t), u0(e, t), e === null && oR(t.stateNode.containerInfo), Xr(t), null;
        case $e:
          var be = t.type._context;
          return Vg(be, t), Xr(t), null;
        case Rn: {
          var at = t.type;
          return Xl(at) && Xh(t), Xr(t), null;
        }
        case jt: {
          Pf(t);
          var pt = t.memoizedState;
          if (pt === null)
            return Xr(t), null;
          var rn = (t.flags & lt) !== Ye, Gt = pt.rendering;
          if (Gt === null)
            if (rn)
              Gp(pt, !1);
            else {
              var lr = Gx() && (e === null || (e.flags & lt) === Ye);
              if (!lr)
                for (var Qt = t.child; Qt !== null; ) {
                  var Kn = Sm(Qt);
                  if (Kn !== null) {
                    rn = !0, t.flags |= lt, Gp(pt, !1);
                    var ya = Kn.updateQueue;
                    return ya !== null && (t.updateQueue = ya, t.flags |= _t), t.subtreeFlags = Ye, GR(t, a), Qo(t, mS(ol.current, Up)), t.child;
                  }
                  Qt = Qt.sibling;
                }
              pt.tail !== null && Dn() > tb() && (t.flags |= lt, rn = !0, Gp(pt, !1), t.lanes = Hd);
            }
          else {
            if (!rn) {
              var ta = Sm(Gt);
              if (ta !== null) {
                t.flags |= lt, rn = !0;
                var vi = ta.updateQueue;
                if (vi !== null && (t.updateQueue = vi, t.flags |= _t), Gp(pt, !0), pt.tail === null && pt.tailMode === "hidden" && !Gt.alternate && !Qr())
                  return Xr(t), null;
              } else
                // time we have to render. So rendering one more row would likely
                // exceed it.
                Dn() * 2 - pt.renderingStartTime > tb() && a !== da && (t.flags |= lt, rn = !0, Gp(pt, !1), t.lanes = Hd);
            }
            if (pt.isBackwards)
              Gt.sibling = t.child, t.child = Gt;
            else {
              var Ma = pt.last;
              Ma !== null ? Ma.sibling = Gt : t.child = Gt, pt.last = Gt;
            }
          }
          if (pt.tail !== null) {
            var Na = pt.tail;
            pt.rendering = Na, pt.tail = Na.sibling, pt.renderingStartTime = Dn(), Na.sibling = null;
            var ga = ol.current;
            return rn ? ga = mS(ga, Up) : ga = Uf(ga), Qo(t, ga), Na;
          }
          return Xr(t), null;
        }
        case En:
          break;
        case Xe:
        case ct: {
          w0(t);
          var Qu = t.memoizedState, Xf = Qu !== null;
          if (e !== null) {
            var sv = e.memoizedState, au = sv !== null;
            au !== Xf && !O && (t.flags |= Ll);
          }
          return !Xf || (t.mode & xt) === Ze ? Xr(t) : pa(ru, da) && (Xr(t), t.subtreeFlags & (mn | _t) && (t.flags |= Ll)), null;
        }
        case Ft:
          return null;
        case Ot:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function YT(e, t, a) {
      switch (Lg(t), t.tag) {
        case ie: {
          var i = t.type;
          Xl(i) && Xh(t);
          var u = t.flags;
          return u & fr ? (t.flags = u & ~fr | lt, (t.mode & tt) !== Ze && $S(t), t) : null;
        }
        case ee: {
          t.stateNode, zf(t), Og(t), gS();
          var s = t.flags;
          return (s & fr) !== Ye && (s & lt) === Ye ? (t.flags = s & ~fr | lt, t) : null;
        }
        case ve:
          return vS(t), null;
        case je: {
          Pf(t);
          var d = t.memoizedState;
          if (d !== null && d.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            Mf();
          }
          var v = t.flags;
          return v & fr ? (t.flags = v & ~fr | lt, (t.mode & tt) !== Ze && $S(t), t) : null;
        }
        case jt:
          return Pf(t), null;
        case de:
          return zf(t), null;
        case $e:
          var m = t.type._context;
          return Vg(m, t), null;
        case Xe:
        case ct:
          return w0(t), null;
        case Ft:
          return null;
        default:
          return null;
      }
    }
    function z_(e, t, a) {
      switch (Lg(t), t.tag) {
        case ie: {
          var i = t.type.childContextTypes;
          i != null && Xh(t);
          break;
        }
        case ee: {
          t.stateNode, zf(t), Og(t), gS();
          break;
        }
        case ve: {
          vS(t);
          break;
        }
        case de:
          zf(t);
          break;
        case je:
          Pf(t);
          break;
        case jt:
          Pf(t);
          break;
        case $e:
          var u = t.type._context;
          Vg(u, t);
          break;
        case Xe:
        case ct:
          w0(t);
          break;
      }
    }
    var U_ = null;
    U_ = /* @__PURE__ */ new Set();
    var Vm = !1, Kr = !1, WT = typeof WeakSet == "function" ? WeakSet : Set, Ae = null, $f = null, If = null;
    function GT(e) {
      hu(null, function() {
        throw e;
      }), Rd();
    }
    var QT = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & tt)
        try {
          tu(), t.componentWillUnmount();
        } finally {
          eu(e);
        }
      else
        t.componentWillUnmount();
    };
    function P_(e, t) {
      try {
        Ko(Tr, e);
      } catch (a) {
        Cn(e, t, a);
      }
    }
    function o0(e, t, a) {
      try {
        QT(e, a);
      } catch (i) {
        Cn(e, t, i);
      }
    }
    function qT(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        Cn(e, t, i);
      }
    }
    function j_(e, t) {
      try {
        H_(e);
      } catch (a) {
        Cn(e, t, a);
      }
    }
    function Yf(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (gt && wt && e.mode & tt)
              try {
                tu(), i = a(null);
              } finally {
                eu(e);
              }
            else
              i = a(null);
          } catch (u) {
            Cn(e, t, u);
          }
          typeof i == "function" && C("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", ft(e));
        } else
          a.current = null;
    }
    function $m(e, t, a) {
      try {
        a();
      } catch (i) {
        Cn(e, t, i);
      }
    }
    var F_ = !1;
    function XT(e, t) {
      sw(e.containerInfo), Ae = t, KT();
      var a = F_;
      return F_ = !1, a;
    }
    function KT() {
      for (; Ae !== null; ) {
        var e = Ae, t = e.child;
        (e.subtreeFlags & yo) !== Ye && t !== null ? (t.return = e, Ae = t) : ZT();
      }
    }
    function ZT() {
      for (; Ae !== null; ) {
        var e = Ae;
        Zt(e);
        try {
          JT(e);
        } catch (a) {
          Cn(e, e.return, a);
        }
        Ln();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Ae = t;
          return;
        }
        Ae = e.return;
      }
    }
    function JT(e) {
      var t = e.alternate, a = e.flags;
      if ((a & ja) !== Ye) {
        switch (Zt(e), e.tag) {
          case J:
          case He:
          case nt:
            break;
          case ie: {
            if (t !== null) {
              var i = t.memoizedProps, u = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !tc && (s.props !== e.memoizedProps && C("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", ft(e) || "instance"), s.state !== e.memoizedState && C("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", ft(e) || "instance"));
              var d = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : ul(e.type, i), u);
              {
                var v = U_;
                d === void 0 && !v.has(e.type) && (v.add(e.type), C("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", ft(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = d;
            }
            break;
          }
          case ee: {
            {
              var m = e.stateNode;
              Aw(m.containerInfo);
            }
            break;
          }
          case ve:
          case ke:
          case de:
          case Rn:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        Ln();
      }
    }
    function fl(e, t, a) {
      var i = t.updateQueue, u = i !== null ? i.lastEffect : null;
      if (u !== null) {
        var s = u.next, d = s;
        do {
          if ((d.tag & e) === e) {
            var v = d.destroy;
            d.destroy = void 0, v !== void 0 && ((e & qr) !== Xa ? Lc(t) : (e & Tr) !== Xa && Ac(t), (e & Kl) !== Xa && lv(!0), $m(t, a, v), (e & Kl) !== Xa && lv(!1), (e & qr) !== Xa ? th() : (e & Tr) !== Xa && go());
          }
          d = d.next;
        } while (d !== s);
      }
    }
    function Ko(e, t) {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var u = i.next, s = u;
        do {
          if ((s.tag & e) === e) {
            (e & qr) !== Xa ? eh(t) : (e & Tr) !== Xa && nh(t);
            var d = s.create;
            (e & Kl) !== Xa && lv(!0), s.destroy = d(), (e & Kl) !== Xa && lv(!1), (e & qr) !== Xa ? Pd() : (e & Tr) !== Xa && rh();
            {
              var v = s.destroy;
              if (v !== void 0 && typeof v != "function") {
                var m = void 0;
                (s.tag & Tr) !== Ye ? m = "useLayoutEffect" : (s.tag & Kl) !== Ye ? m = "useInsertionEffect" : m = "useEffect";
                var E = void 0;
                v === null ? E = " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof v.then == "function" ? E = `

It looks like you wrote ` + m + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + m + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching` : E = " You returned: " + v, C("%s must not return anything besides a function, which is used for clean-up.%s", m, E);
              }
            }
          }
          s = s.next;
        } while (s !== u);
      }
    }
    function ex(e, t) {
      if ((t.flags & _t) !== Ye)
        switch (t.tag) {
          case mt: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, u = i.id, s = i.onPostCommit, d = u_(), v = t.alternate === null ? "mount" : "update";
            l_() && (v = "nested-update"), typeof s == "function" && s(u, v, a, d);
            var m = t.return;
            e:
              for (; m !== null; ) {
                switch (m.tag) {
                  case ee:
                    var E = m.stateNode;
                    E.passiveEffectDuration += a;
                    break e;
                  case mt:
                    var b = m.stateNode;
                    b.passiveEffectDuration += a;
                    break e;
                }
                m = m.return;
              }
            break;
          }
        }
    }
    function tx(e, t, a, i) {
      if ((a.flags & Ar) !== Ye)
        switch (a.tag) {
          case J:
          case He:
          case nt: {
            if (!Kr)
              if (a.mode & tt)
                try {
                  tu(), Ko(Tr | Rr, a);
                } finally {
                  eu(a);
                }
              else
                Ko(Tr | Rr, a);
            break;
          }
          case ie: {
            var u = a.stateNode;
            if (a.flags & _t && !Kr)
              if (t === null)
                if (a.type === a.elementType && !tc && (u.props !== a.memoizedProps && C("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", ft(a) || "instance"), u.state !== a.memoizedState && C("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", ft(a) || "instance")), a.mode & tt)
                  try {
                    tu(), u.componentDidMount();
                  } finally {
                    eu(a);
                  }
                else
                  u.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : ul(a.type, t.memoizedProps), d = t.memoizedState;
                if (a.type === a.elementType && !tc && (u.props !== a.memoizedProps && C("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", ft(a) || "instance"), u.state !== a.memoizedState && C("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", ft(a) || "instance")), a.mode & tt)
                  try {
                    tu(), u.componentDidUpdate(s, d, u.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    eu(a);
                  }
                else
                  u.componentDidUpdate(s, d, u.__reactInternalSnapshotBeforeUpdate);
              }
            var v = a.updateQueue;
            v !== null && (a.type === a.elementType && !tc && (u.props !== a.memoizedProps && C("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", ft(a) || "instance"), u.state !== a.memoizedState && C("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", ft(a) || "instance")), CE(a, v, u));
            break;
          }
          case ee: {
            var m = a.updateQueue;
            if (m !== null) {
              var E = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case ve:
                    E = a.child.stateNode;
                    break;
                  case ie:
                    E = a.child.stateNode;
                    break;
                }
              CE(a, m, E);
            }
            break;
          }
          case ve: {
            var b = a.stateNode;
            if (t === null && a.flags & _t) {
              var z = a.type, L = a.memoizedProps;
              Cw(b, z, L);
            }
            break;
          }
          case ke:
            break;
          case de:
            break;
          case mt: {
            {
              var B = a.memoizedProps, $ = B.onCommit, W = B.onRender, xe = a.stateNode.effectDuration, qe = u_(), Be = t === null ? "mount" : "update";
              l_() && (Be = "nested-update"), typeof W == "function" && W(a.memoizedProps.id, Be, a.actualDuration, a.treeBaseDuration, a.actualStartTime, qe);
              {
                typeof $ == "function" && $(a.memoizedProps.id, Be, xe, qe), Zx(a);
                var Ut = a.return;
                e:
                  for (; Ut !== null; ) {
                    switch (Ut.tag) {
                      case ee:
                        var Mt = Ut.stateNode;
                        Mt.effectDuration += xe;
                        break e;
                      case mt:
                        var P = Ut.stateNode;
                        P.effectDuration += xe;
                        break e;
                    }
                    Ut = Ut.return;
                  }
              }
            }
            break;
          }
          case je: {
            sx(e, a);
            break;
          }
          case jt:
          case Rn:
          case En:
          case Xe:
          case ct:
          case Ot:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Kr || a.flags & la && H_(a);
    }
    function nx(e) {
      switch (e.tag) {
        case J:
        case He:
        case nt: {
          if (e.mode & tt)
            try {
              tu(), P_(e, e.return);
            } finally {
              eu(e);
            }
          else
            P_(e, e.return);
          break;
        }
        case ie: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && qT(e, e.return, t), j_(e, e.return);
          break;
        }
        case ve: {
          j_(e, e.return);
          break;
        }
      }
    }
    function rx(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === ve) {
          if (a === null) {
            a = i;
            try {
              var u = i.stateNode;
              t ? kw(u) : Nw(i.stateNode, i.memoizedProps);
            } catch (d) {
              Cn(e, e.return, d);
            }
          }
        } else if (i.tag === ke) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? Mw(s) : Lw(s, i.memoizedProps);
            } catch (d) {
              Cn(e, e.return, d);
            }
        } else if (!((i.tag === Xe || i.tag === ct) && i.memoizedState !== null && i !== e)) {
          if (i.child !== null) {
            i.child.return = i, i = i.child;
            continue;
          }
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          a === i && (a = null), i = i.return;
        }
        a === i && (a = null), i.sibling.return = i.return, i = i.sibling;
      }
    }
    function H_(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case ve:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var u;
          if (e.mode & tt)
            try {
              tu(), u = t(i);
            } finally {
              eu(e);
            }
          else
            u = t(i);
          typeof u == "function" && C("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", ft(e));
        } else
          t.hasOwnProperty("current") || C("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", ft(e)), t.current = i;
      }
    }
    function ax(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function B_(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, B_(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === ve) {
          var a = e.stateNode;
          a !== null && fR(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function ix(e) {
      for (var t = e.return; t !== null; ) {
        if (V_(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function V_(e) {
      return e.tag === ve || e.tag === ee || e.tag === de;
    }
    function $_(e) {
      var t = e;
      e:
        for (; ; ) {
          for (; t.sibling === null; ) {
            if (t.return === null || V_(t.return))
              return null;
            t = t.return;
          }
          for (t.sibling.return = t.return, t = t.sibling; t.tag !== ve && t.tag !== ke && t.tag !== Xt; ) {
            if (t.flags & mn || t.child === null || t.tag === de)
              continue e;
            t.child.return = t, t = t.child;
          }
          if (!(t.flags & mn))
            return t.stateNode;
        }
    }
    function lx(e) {
      var t = ix(e);
      switch (t.tag) {
        case ve: {
          var a = t.stateNode;
          t.flags & Jt && (IC(a), t.flags &= ~Jt);
          var i = $_(e);
          c0(e, i, a);
          break;
        }
        case ee:
        case de: {
          var u = t.stateNode.containerInfo, s = $_(e);
          s0(e, s, u);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function s0(e, t, a) {
      var i = e.tag, u = i === ve || i === ke;
      if (u) {
        var s = e.stateNode;
        t ? Tw(a, s, t) : ww(a, s);
      } else if (i !== de) {
        var d = e.child;
        if (d !== null) {
          s0(d, t, a);
          for (var v = d.sibling; v !== null; )
            s0(v, t, a), v = v.sibling;
        }
      }
    }
    function c0(e, t, a) {
      var i = e.tag, u = i === ve || i === ke;
      if (u) {
        var s = e.stateNode;
        t ? Rw(a, s, t) : bw(a, s);
      } else if (i !== de) {
        var d = e.child;
        if (d !== null) {
          c0(d, t, a);
          for (var v = d.sibling; v !== null; )
            c0(v, t, a), v = v.sibling;
        }
      }
    }
    var Zr = null, dl = !1;
    function ux(e, t, a) {
      {
        var i = t;
        e:
          for (; i !== null; ) {
            switch (i.tag) {
              case ve: {
                Zr = i.stateNode, dl = !1;
                break e;
              }
              case ee: {
                Zr = i.stateNode.containerInfo, dl = !0;
                break e;
              }
              case de: {
                Zr = i.stateNode.containerInfo, dl = !0;
                break e;
              }
            }
            i = i.return;
          }
        if (Zr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        I_(e, t, a), Zr = null, dl = !1;
      }
      ax(a);
    }
    function Zo(e, t, a) {
      for (var i = a.child; i !== null; )
        I_(e, t, i), i = i.sibling;
    }
    function I_(e, t, a) {
      switch (zd(a), a.tag) {
        case ve:
          Kr || Yf(a, t);
        case ke: {
          {
            var i = Zr, u = dl;
            Zr = null, Zo(e, t, a), Zr = i, dl = u, Zr !== null && (dl ? Dw(Zr, a.stateNode) : xw(Zr, a.stateNode));
          }
          return;
        }
        case Xt: {
          Zr !== null && (dl ? Ow(Zr, a.stateNode) : Eg(Zr, a.stateNode));
          return;
        }
        case de: {
          {
            var s = Zr, d = dl;
            Zr = a.stateNode.containerInfo, dl = !0, Zo(e, t, a), Zr = s, dl = d;
          }
          return;
        }
        case J:
        case He:
        case yt:
        case nt: {
          if (!Kr) {
            var v = a.updateQueue;
            if (v !== null) {
              var m = v.lastEffect;
              if (m !== null) {
                var E = m.next, b = E;
                do {
                  var z = b, L = z.destroy, B = z.tag;
                  L !== void 0 && ((B & Kl) !== Xa ? $m(a, t, L) : (B & Tr) !== Xa && (Ac(a), a.mode & tt ? (tu(), $m(a, t, L), eu(a)) : $m(a, t, L), go())), b = b.next;
                } while (b !== E);
              }
            }
          }
          Zo(e, t, a);
          return;
        }
        case ie: {
          if (!Kr) {
            Yf(a, t);
            var $ = a.stateNode;
            typeof $.componentWillUnmount == "function" && o0(a, t, $);
          }
          Zo(e, t, a);
          return;
        }
        case En: {
          Zo(e, t, a);
          return;
        }
        case Xe: {
          if (a.mode & xt) {
            var W = Kr;
            Kr = W || a.memoizedState !== null, Zo(e, t, a), Kr = W;
          } else
            Zo(e, t, a);
          break;
        }
        default: {
          Zo(e, t, a);
          return;
        }
      }
    }
    function ox(e) {
      e.memoizedState;
    }
    function sx(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var u = i.memoizedState;
          if (u !== null) {
            var s = u.dehydrated;
            s !== null && Qw(s);
          }
        }
      }
    }
    function Y_(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new WT()), t.forEach(function(i) {
          var u = iD.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), br)
              if ($f !== null && If !== null)
                iv(If, $f);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(u, u);
          }
        });
      }
    }
    function cx(e, t, a) {
      $f = a, If = e, Zt(t), W_(t, e), Zt(t), $f = null, If = null;
    }
    function pl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u];
          try {
            ux(e, t, s);
          } catch (m) {
            Cn(s, t, m);
          }
        }
      var d = fc();
      if (t.subtreeFlags & sa)
        for (var v = t.child; v !== null; )
          Zt(v), W_(v, e), v = v.sibling;
      Zt(d);
    }
    function W_(e, t, a) {
      var i = e.alternate, u = e.flags;
      switch (e.tag) {
        case J:
        case He:
        case yt:
        case nt: {
          if (pl(t, e), nu(e), u & _t) {
            try {
              fl(Kl | Rr, e, e.return), Ko(Kl | Rr, e);
            } catch (at) {
              Cn(e, e.return, at);
            }
            if (e.mode & tt) {
              try {
                tu(), fl(Tr | Rr, e, e.return);
              } catch (at) {
                Cn(e, e.return, at);
              }
              eu(e);
            } else
              try {
                fl(Tr | Rr, e, e.return);
              } catch (at) {
                Cn(e, e.return, at);
              }
          }
          return;
        }
        case ie: {
          pl(t, e), nu(e), u & la && i !== null && Yf(i, i.return);
          return;
        }
        case ve: {
          pl(t, e), nu(e), u & la && i !== null && Yf(i, i.return);
          {
            if (e.flags & Jt) {
              var s = e.stateNode;
              try {
                IC(s);
              } catch (at) {
                Cn(e, e.return, at);
              }
            }
            if (u & _t) {
              var d = e.stateNode;
              if (d != null) {
                var v = e.memoizedProps, m = i !== null ? i.memoizedProps : v, E = e.type, b = e.updateQueue;
                if (e.updateQueue = null, b !== null)
                  try {
                    Ew(d, b, E, m, v, e);
                  } catch (at) {
                    Cn(e, e.return, at);
                  }
              }
            }
          }
          return;
        }
        case ke: {
          if (pl(t, e), nu(e), u & _t) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var z = e.stateNode, L = e.memoizedProps, B = i !== null ? i.memoizedProps : L;
            try {
              _w(z, B, L);
            } catch (at) {
              Cn(e, e.return, at);
            }
          }
          return;
        }
        case ee: {
          if (pl(t, e), nu(e), u & _t && i !== null) {
            var $ = i.memoizedState;
            if ($.isDehydrated)
              try {
                Gw(t.containerInfo);
              } catch (at) {
                Cn(e, e.return, at);
              }
          }
          return;
        }
        case de: {
          pl(t, e), nu(e);
          return;
        }
        case je: {
          pl(t, e), nu(e);
          var W = e.child;
          if (W.flags & Ll) {
            var xe = W.stateNode, qe = W.memoizedState, Be = qe !== null;
            if (xe.isHidden = Be, Be) {
              var Ut = W.alternate !== null && W.alternate.memoizedState !== null;
              Ut || Ix();
            }
          }
          if (u & _t) {
            try {
              ox(e);
            } catch (at) {
              Cn(e, e.return, at);
            }
            Y_(e);
          }
          return;
        }
        case Xe: {
          var Mt = i !== null && i.memoizedState !== null;
          if (e.mode & xt) {
            var P = Kr;
            Kr = P || Mt, pl(t, e), Kr = P;
          } else
            pl(t, e);
          if (nu(e), u & Ll) {
            var G = e.stateNode, j = e.memoizedState, ue = j !== null, De = e;
            if (G.isHidden = ue, ue && !Mt && (De.mode & xt) !== Ze) {
              Ae = De;
              for (var be = De.child; be !== null; )
                Ae = be, dx(be), be = be.sibling;
            }
            rx(De, ue);
          }
          return;
        }
        case jt: {
          pl(t, e), nu(e), u & _t && Y_(e);
          return;
        }
        case En:
          return;
        default: {
          pl(t, e), nu(e);
          return;
        }
      }
    }
    function nu(e) {
      var t = e.flags;
      if (t & mn) {
        try {
          lx(e);
        } catch (a) {
          Cn(e, e.return, a);
        }
        e.flags &= ~mn;
      }
      t & Fa && (e.flags &= ~Fa);
    }
    function fx(e, t, a) {
      $f = a, If = t, Ae = e, G_(e, t, a), $f = null, If = null;
    }
    function G_(e, t, a) {
      for (var i = (e.mode & xt) !== Ze; Ae !== null; ) {
        var u = Ae, s = u.child;
        if (u.tag === Xe && i) {
          var d = u.memoizedState !== null, v = d || Vm;
          if (v) {
            f0(e, t, a);
            continue;
          } else {
            var m = u.alternate, E = m !== null && m.memoizedState !== null, b = E || Kr, z = Vm, L = Kr;
            Vm = v, Kr = b, Kr && !L && (Ae = u, px(u));
            for (var B = s; B !== null; )
              Ae = B, G_(B, t, a), B = B.sibling;
            Ae = u, Vm = z, Kr = L, f0(e, t, a);
            continue;
          }
        }
        (u.subtreeFlags & Ar) !== Ye && s !== null ? (s.return = u, Ae = s) : f0(e, t, a);
      }
    }
    function f0(e, t, a) {
      for (; Ae !== null; ) {
        var i = Ae;
        if ((i.flags & Ar) !== Ye) {
          var u = i.alternate;
          Zt(i);
          try {
            tx(t, u, i, a);
          } catch (d) {
            Cn(i, i.return, d);
          }
          Ln();
        }
        if (i === e) {
          Ae = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, Ae = s;
          return;
        }
        Ae = i.return;
      }
    }
    function dx(e) {
      for (; Ae !== null; ) {
        var t = Ae, a = t.child;
        switch (t.tag) {
          case J:
          case He:
          case yt:
          case nt: {
            if (t.mode & tt)
              try {
                tu(), fl(Tr, t, t.return);
              } finally {
                eu(t);
              }
            else
              fl(Tr, t, t.return);
            break;
          }
          case ie: {
            Yf(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && o0(t, t.return, i);
            break;
          }
          case ve: {
            Yf(t, t.return);
            break;
          }
          case Xe: {
            var u = t.memoizedState !== null;
            if (u) {
              Q_(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, Ae = a) : Q_(e);
      }
    }
    function Q_(e) {
      for (; Ae !== null; ) {
        var t = Ae;
        if (t === e) {
          Ae = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Ae = a;
          return;
        }
        Ae = t.return;
      }
    }
    function px(e) {
      for (; Ae !== null; ) {
        var t = Ae, a = t.child;
        if (t.tag === Xe) {
          var i = t.memoizedState !== null;
          if (i) {
            q_(e);
            continue;
          }
        }
        a !== null ? (a.return = t, Ae = a) : q_(e);
      }
    }
    function q_(e) {
      for (; Ae !== null; ) {
        var t = Ae;
        Zt(t);
        try {
          nx(t);
        } catch (i) {
          Cn(t, t.return, i);
        }
        if (Ln(), t === e) {
          Ae = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Ae = a;
          return;
        }
        Ae = t.return;
      }
    }
    function vx(e, t, a, i) {
      Ae = t, hx(t, e, a, i);
    }
    function hx(e, t, a, i) {
      for (; Ae !== null; ) {
        var u = Ae, s = u.child;
        (u.subtreeFlags & Ha) !== Ye && s !== null ? (s.return = u, Ae = s) : mx(e, t, a, i);
      }
    }
    function mx(e, t, a, i) {
      for (; Ae !== null; ) {
        var u = Ae;
        if ((u.flags & bn) !== Ye) {
          Zt(u);
          try {
            yx(t, u, a, i);
          } catch (d) {
            Cn(u, u.return, d);
          }
          Ln();
        }
        if (u === e) {
          Ae = null;
          return;
        }
        var s = u.sibling;
        if (s !== null) {
          s.return = u.return, Ae = s;
          return;
        }
        Ae = u.return;
      }
    }
    function yx(e, t, a, i) {
      switch (t.tag) {
        case J:
        case He:
        case nt: {
          if (t.mode & tt) {
            VS();
            try {
              Ko(qr | Rr, t);
            } finally {
              BS(t);
            }
          } else
            Ko(qr | Rr, t);
          break;
        }
      }
    }
    function gx(e) {
      Ae = e, Sx();
    }
    function Sx() {
      for (; Ae !== null; ) {
        var e = Ae, t = e.child;
        if ((Ae.flags & qt) !== Ye) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var u = a[i];
              Ae = u, _x(u, e);
            }
            {
              var s = e.alternate;
              if (s !== null) {
                var d = s.child;
                if (d !== null) {
                  s.child = null;
                  do {
                    var v = d.sibling;
                    d.sibling = null, d = v;
                  } while (d !== null);
                }
              }
            }
            Ae = e;
          }
        }
        (e.subtreeFlags & Ha) !== Ye && t !== null ? (t.return = e, Ae = t) : Cx();
      }
    }
    function Cx() {
      for (; Ae !== null; ) {
        var e = Ae;
        (e.flags & bn) !== Ye && (Zt(e), Ex(e), Ln());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Ae = t;
          return;
        }
        Ae = e.return;
      }
    }
    function Ex(e) {
      switch (e.tag) {
        case J:
        case He:
        case nt: {
          e.mode & tt ? (VS(), fl(qr | Rr, e, e.return), BS(e)) : fl(qr | Rr, e, e.return);
          break;
        }
      }
    }
    function _x(e, t) {
      for (; Ae !== null; ) {
        var a = Ae;
        Zt(a), wx(a, t), Ln();
        var i = a.child;
        i !== null ? (i.return = a, Ae = i) : bx(e);
      }
    }
    function bx(e) {
      for (; Ae !== null; ) {
        var t = Ae, a = t.sibling, i = t.return;
        if (B_(t), t === e) {
          Ae = null;
          return;
        }
        if (a !== null) {
          a.return = i, Ae = a;
          return;
        }
        Ae = i;
      }
    }
    function wx(e, t) {
      switch (e.tag) {
        case J:
        case He:
        case nt: {
          e.mode & tt ? (VS(), fl(qr, e, t), BS(e)) : fl(qr, e, t);
          break;
        }
      }
    }
    function Rx(e) {
      switch (e.tag) {
        case J:
        case He:
        case nt: {
          try {
            Ko(Tr | Rr, e);
          } catch (a) {
            Cn(e, e.return, a);
          }
          break;
        }
        case ie: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            Cn(e, e.return, a);
          }
          break;
        }
      }
    }
    function Tx(e) {
      switch (e.tag) {
        case J:
        case He:
        case nt: {
          try {
            Ko(qr | Rr, e);
          } catch (t) {
            Cn(e, e.return, t);
          }
          break;
        }
      }
    }
    function xx(e) {
      switch (e.tag) {
        case J:
        case He:
        case nt: {
          try {
            fl(Tr | Rr, e, e.return);
          } catch (a) {
            Cn(e, e.return, a);
          }
          break;
        }
        case ie: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && o0(e, e.return, t);
          break;
        }
      }
    }
    function Dx(e) {
      switch (e.tag) {
        case J:
        case He:
        case nt:
          try {
            fl(qr | Rr, e, e.return);
          } catch (t) {
            Cn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Qp = Symbol.for;
      Qp("selector.component"), Qp("selector.has_pseudo_class"), Qp("selector.role"), Qp("selector.test_id"), Qp("selector.text");
    }
    var Ox = [];
    function kx() {
      Ox.forEach(function(e) {
        return e();
      });
    }
    var Mx = h.ReactCurrentActQueue;
    function Nx(e) {
      {
        var t = typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0, a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function X_() {
      {
        var e = typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0;
        return !e && Mx.current !== null && C("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var Lx = Math.ceil, d0 = h.ReactCurrentDispatcher, p0 = h.ReactCurrentOwner, Jr = h.ReactCurrentBatchConfig, vl = h.ReactCurrentActQueue, Or = (
      /*             */
      0
    ), K_ = (
      /*               */
      1
    ), ea = (
      /*                */
      2
    ), Ui = (
      /*                */
      4
    ), Iu = 0, qp = 1, nc = 2, Im = 3, Xp = 4, Z_ = 5, v0 = 6, zt = Or, Oa = null, Vn = null, kr = Q, ru = Q, h0 = Vo(Q), Mr = Iu, Kp = null, Ym = Q, Zp = Q, Wm = Q, Jp = null, Ka = null, m0 = 0, J_ = 500, eb = 1 / 0, Ax = 500, Yu = null;
    function ev() {
      eb = Dn() + Ax;
    }
    function tb() {
      return eb;
    }
    var Gm = !1, y0 = null, Wf = null, rc = !1, Jo = null, tv = Q, g0 = [], S0 = null, zx = 50, nv = 0, C0 = null, E0 = !1, Qm = !1, Ux = 50, Gf = 0, qm = null, rv = sn, Xm = Q, nb = !1;
    function Km() {
      return Oa;
    }
    function ka() {
      return (zt & (ea | Ui)) !== Or ? Dn() : (rv !== sn || (rv = Dn()), rv);
    }
    function es(e) {
      var t = e.mode;
      if ((t & xt) === Ze)
        return rt;
      if ((zt & ea) !== Or && kr !== Q)
        return nr(kr);
      var a = NR() !== MR;
      if (a) {
        if (Jr.transition !== null) {
          var i = Jr.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Xm === At && (Xm = $d()), Xm;
      }
      var u = Ia();
      if (u !== At)
        return u;
      var s = mw();
      return s;
    }
    function Px(e) {
      var t = e.mode;
      return (t & xt) === Ze ? rt : Vy();
    }
    function Nr(e, t, a, i) {
      uD(), nb && C("useInsertionEffect must not schedule updates."), E0 && (Qm = !0), xu(e, a, i), (zt & ea) !== Q && e === Oa ? cD(t) : (br && Qd(e, t, a), fD(t), e === Oa && ((zt & ea) === Or && (Zp = bt(Zp, a)), Mr === Xp && ts(e, kr)), Za(e, i), a === rt && zt === Or && (t.mode & xt) === Ze && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !vl.isBatchingLegacy && (ev(), tE()));
    }
    function jx(e, t, a) {
      var i = e.current;
      i.lanes = t, xu(e, t, a), Za(e, a);
    }
    function Fx(e) {
      return (
        // decided not to enable it.
        (zt & ea) !== Or
      );
    }
    function Za(e, t) {
      var a = e.callbackNode;
      Fy(e, t);
      var i = Ds(e, e === Oa ? kr : Q);
      if (i === Q) {
        a !== null && gb(a), e.callbackNode = null, e.callbackPriority = At;
        return;
      }
      var u = qn(i), s = e.callbackPriority;
      if (s === u && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(vl.current !== null && a !== D0)) {
        a == null && s !== rt && C("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && gb(a);
      var d;
      if (u === rt)
        e.tag === $o ? (vl.isBatchingLegacy !== null && (vl.didScheduleLegacyUpdate = !0), vR(ib.bind(null, e))) : eE(ib.bind(null, e)), vl.current !== null ? vl.current.push(Io) : gw(function() {
          (zt & (ea | Ui)) === Or && Io();
        }), d = null;
      else {
        var v;
        switch (Ls(i)) {
          case zr:
            v = kc;
            break;
          case wr:
            v = Ra;
            break;
          case Ji:
            v = Ti;
            break;
          case Ms:
            v = zl;
            break;
          default:
            v = Ti;
            break;
        }
        d = O0(v, rb.bind(null, e));
      }
      e.callbackPriority = u, e.callbackNode = d;
    }
    function rb(e, t) {
      if (uT(), rv = sn, Xm = Q, (zt & (ea | Ui)) !== Or)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = Gu();
      if (i && e.callbackNode !== a)
        return null;
      var u = Ds(e, e === Oa ? kr : Q);
      if (u === Q)
        return null;
      var s = !ks(e, u) && !sh(e, u) && !t, d = s ? qx(e, u) : Jm(e, u);
      if (d !== Iu) {
        if (d === nc) {
          var v = Bd(e);
          v !== Q && (u = v, d = _0(e, v));
        }
        if (d === qp) {
          var m = Kp;
          throw ac(e, Q), ts(e, u), Za(e, Dn()), m;
        }
        if (d === v0)
          ts(e, u);
        else {
          var E = !ks(e, u), b = e.current.alternate;
          if (E && !Bx(b)) {
            if (d = Jm(e, u), d === nc) {
              var z = Bd(e);
              z !== Q && (u = z, d = _0(e, z));
            }
            if (d === qp) {
              var L = Kp;
              throw ac(e, Q), ts(e, u), Za(e, Dn()), L;
            }
          }
          e.finishedWork = b, e.finishedLanes = u, Hx(e, d, u);
        }
      }
      return Za(e, Dn()), e.callbackNode === a ? rb.bind(null, e) : null;
    }
    function _0(e, t) {
      var a = Jp;
      if (ar(e)) {
        var i = ac(e, t);
        i.flags |= An, uR(e.containerInfo);
      }
      var u = Jm(e, t);
      if (u !== nc) {
        var s = Ka;
        Ka = a, s !== null && ab(s);
      }
      return u;
    }
    function ab(e) {
      Ka === null ? Ka = e : Ka.push.apply(Ka, e);
    }
    function Hx(e, t, a) {
      switch (t) {
        case Iu:
        case qp:
          throw new Error("Root did not complete. This is a bug in React.");
        case nc: {
          ic(e, Ka, Yu);
          break;
        }
        case Im: {
          if (ts(e, a), ef(a) && // do not delay if we're inside an act() scope
          !Sb()) {
            var i = m0 + J_ - Dn();
            if (i > 10) {
              var u = Ds(e, Q);
              if (u !== Q)
                break;
              var s = e.suspendedLanes;
              if (!Tu(s, a)) {
                ka(), Wd(e, s);
                break;
              }
              e.timeoutHandle = Sg(ic.bind(null, e, Ka, Yu), i);
              break;
            }
          }
          ic(e, Ka, Yu);
          break;
        }
        case Xp: {
          if (ts(e, a), oh(a))
            break;
          if (!Sb()) {
            var d = uh(e, a), v = d, m = Dn() - v, E = lD(m) - m;
            if (E > 10) {
              e.timeoutHandle = Sg(ic.bind(null, e, Ka, Yu), E);
              break;
            }
          }
          ic(e, Ka, Yu);
          break;
        }
        case Z_: {
          ic(e, Ka, Yu);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function Bx(e) {
      for (var t = e; ; ) {
        if (t.flags & Es) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var u = 0; u < i.length; u++) {
                var s = i[u], d = s.getSnapshot, v = s.value;
                try {
                  if (!Le(d(), v))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var m = t.child;
        if (t.subtreeFlags & Es && m !== null) {
          m.return = t, t = m;
          continue;
        }
        if (t === e)
          return !0;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return !0;
    }
    function ts(e, t) {
      t = Ro(t, Wm), t = Ro(t, Zp), Yd(e, t);
    }
    function ib(e) {
      if (oT(), (zt & (ea | Ui)) !== Or)
        throw new Error("Should not already be working.");
      Gu();
      var t = Ds(e, Q);
      if (!pa(t, rt))
        return Za(e, Dn()), null;
      var a = Jm(e, t);
      if (e.tag !== $o && a === nc) {
        var i = Bd(e);
        i !== Q && (t = i, a = _0(e, i));
      }
      if (a === qp) {
        var u = Kp;
        throw ac(e, Q), ts(e, t), Za(e, Dn()), u;
      }
      if (a === v0)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, ic(e, Ka, Yu), Za(e, Dn()), null;
    }
    function Vx(e, t) {
      t !== Q && (To(e, bt(t, rt)), Za(e, Dn()), (zt & (ea | Ui)) === Or && (ev(), Io()));
    }
    function b0(e, t) {
      var a = zt;
      zt |= K_;
      try {
        return e(t);
      } finally {
        zt = a, zt === Or && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !vl.isBatchingLegacy && (ev(), tE());
      }
    }
    function $x(e, t, a, i, u) {
      var s = Ia(), d = Jr.transition;
      try {
        return Jr.transition = null, rr(zr), e(t, a, i, u);
      } finally {
        rr(s), Jr.transition = d, zt === Or && ev();
      }
    }
    function Wu(e) {
      Jo !== null && Jo.tag === $o && (zt & (ea | Ui)) === Or && Gu();
      var t = zt;
      zt |= K_;
      var a = Jr.transition, i = Ia();
      try {
        return Jr.transition = null, rr(zr), e ? e() : void 0;
      } finally {
        rr(i), Jr.transition = a, zt = t, (zt & (ea | Ui)) === Or && Io();
      }
    }
    function lb() {
      return (zt & (ea | Ui)) !== Or;
    }
    function Zm(e, t) {
      ha(h0, ru, e), ru = bt(ru, t);
    }
    function w0(e) {
      ru = h0.current, va(h0, e);
    }
    function ac(e, t) {
      e.finishedWork = null, e.finishedLanes = Q;
      var a = e.timeoutHandle;
      if (a !== Cg && (e.timeoutHandle = Cg, yw(a)), Vn !== null)
        for (var i = Vn.return; i !== null; ) {
          var u = i.alternate;
          z_(u, i), i = i.return;
        }
      Oa = e;
      var s = lc(e.current, null);
      return Vn = s, kr = ru = t, Mr = Iu, Kp = null, Ym = Q, Zp = Q, Wm = Q, Jp = null, Ka = null, UR(), ll.discardPendingWarnings(), s;
    }
    function ub(e, t) {
      do {
        var a = Vn;
        try {
          if (lm(), PE(), Ln(), p0.current = null, a === null || a.return === null) {
            Mr = qp, Kp = t, Vn = null;
            return;
          }
          if (gt && a.mode & tt && jm(a, !0), Ve)
            if (yu(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              ah(a, i, kr);
            } else
              zc(a, t, kr);
          pT(e, a.return, a, t, kr), fb(a);
        } catch (u) {
          t = u, Vn === a && a !== null ? (a = a.return, Vn = a) : a = Vn;
          continue;
        }
        return;
      } while (!0);
    }
    function ob() {
      var e = d0.current;
      return d0.current = Lm, e === null ? Lm : e;
    }
    function sb(e) {
      d0.current = e;
    }
    function Ix() {
      m0 = Dn();
    }
    function av(e) {
      Ym = bt(e, Ym);
    }
    function Yx() {
      Mr === Iu && (Mr = Im);
    }
    function R0() {
      (Mr === Iu || Mr === Im || Mr === nc) && (Mr = Xp), Oa !== null && (Os(Ym) || Os(Zp)) && ts(Oa, kr);
    }
    function Wx(e) {
      Mr !== Xp && (Mr = nc), Jp === null ? Jp = [
        e
      ] : Jp.push(e);
    }
    function Gx() {
      return Mr === Iu;
    }
    function Jm(e, t) {
      var a = zt;
      zt |= ea;
      var i = ob();
      if (Oa !== e || kr !== t) {
        if (br) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (iv(e, kr), u.clear()), rf(e, t);
        }
        Yu = qd(), ac(e, t);
      }
      ci(t);
      do
        try {
          Qx();
          break;
        } catch (s) {
          ub(e, s);
        }
      while (!0);
      if (lm(), zt = a, sb(i), Vn !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Co(), Oa = null, kr = Q, Mr;
    }
    function Qx() {
      for (; Vn !== null; )
        cb(Vn);
    }
    function qx(e, t) {
      var a = zt;
      zt |= ea;
      var i = ob();
      if (Oa !== e || kr !== t) {
        if (br) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (iv(e, kr), u.clear()), rf(e, t);
        }
        Yu = qd(), ev(), ac(e, t);
      }
      ci(t);
      do
        try {
          Xx();
          break;
        } catch (s) {
          ub(e, s);
        }
      while (!0);
      return lm(), sb(i), zt = a, Vn !== null ? (ws(), Iu) : (Co(), Oa = null, kr = Q, Mr);
    }
    function Xx() {
      for (; Vn !== null && !Oc(); )
        cb(Vn);
    }
    function cb(e) {
      var t = e.alternate;
      Zt(e);
      var a;
      (e.mode & tt) !== Ze ? (HS(e), a = T0(t, e, ru), jm(e, !0)) : a = T0(t, e, ru), Ln(), e.memoizedProps = e.pendingProps, a === null ? fb(e) : Vn = a, p0.current = null;
    }
    function fb(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & _a) === Ye) {
          Zt(t);
          var u = void 0;
          if ((t.mode & tt) === Ze ? u = A_(a, t, ru) : (HS(t), u = A_(a, t, ru), jm(t, !1)), Ln(), u !== null) {
            Vn = u;
            return;
          }
        } else {
          var s = YT(a, t);
          if (s !== null) {
            s.flags &= qv, Vn = s;
            return;
          }
          if ((t.mode & tt) !== Ze) {
            jm(t, !1);
            for (var d = t.actualDuration, v = t.child; v !== null; )
              d += v.actualDuration, v = v.sibling;
            t.actualDuration = d;
          }
          if (i !== null)
            i.flags |= _a, i.subtreeFlags = Ye, i.deletions = null;
          else {
            Mr = v0, Vn = null;
            return;
          }
        }
        var m = t.sibling;
        if (m !== null) {
          Vn = m;
          return;
        }
        t = i, Vn = t;
      } while (t !== null);
      Mr === Iu && (Mr = Z_);
    }
    function ic(e, t, a) {
      var i = Ia(), u = Jr.transition;
      try {
        Jr.transition = null, rr(zr), Kx(e, t, a, i);
      } finally {
        Jr.transition = u, rr(i);
      }
      return null;
    }
    function Kx(e, t, a, i) {
      do
        Gu();
      while (Jo !== null);
      if (oD(), (zt & (ea | Ui)) !== Or)
        throw new Error("Should not already be working.");
      var u = e.finishedWork, s = e.finishedLanes;
      if (Nc(s), u === null)
        return Ud(), null;
      if (s === Q && C("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = Q, u === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = At;
      var d = bt(u.lanes, u.childLanes);
      Gd(e, d), e === Oa && (Oa = null, Vn = null, kr = Q), ((u.subtreeFlags & Ha) !== Ye || (u.flags & Ha) !== Ye) && (rc || (rc = !0, S0 = a, O0(Ti, function() {
        return Gu(), null;
      })));
      var v = (u.subtreeFlags & (yo | sa | Ar | Ha)) !== Ye, m = (u.flags & (yo | sa | Ar | Ha)) !== Ye;
      if (v || m) {
        var E = Jr.transition;
        Jr.transition = null;
        var b = Ia();
        rr(zr);
        var z = zt;
        zt |= Ui, p0.current = null, XT(e, u), o_(), cx(e, u, s), cw(e.containerInfo), e.current = u, ih(s), fx(u, e, s), So(), Zv(), zt = z, rr(b), Jr.transition = E;
      } else
        e.current = u, o_();
      var L = rc;
      if (rc ? (rc = !1, Jo = e, tv = s) : (Gf = 0, qm = null), d = e.pendingLanes, d === Q && (Wf = null), L || hb(e.current, !1), Xi(u.stateNode, i), br && e.memoizedUpdaters.clear(), kx(), Za(e, Dn()), t !== null)
        for (var B = e.onRecoverableError, $ = 0; $ < t.length; $++) {
          var W = t[$], xe = W.stack, qe = W.digest;
          B(W.value, {
            componentStack: xe,
            digest: qe
          });
        }
      if (Gm) {
        Gm = !1;
        var Be = y0;
        throw y0 = null, Be;
      }
      return pa(tv, rt) && e.tag !== $o && Gu(), d = e.pendingLanes, pa(d, rt) ? (lT(), e === C0 ? nv++ : (nv = 0, C0 = e)) : nv = 0, Io(), Ud(), null;
    }
    function Gu() {
      if (Jo !== null) {
        var e = Ls(tv), t = Iy(Ji, e), a = Jr.transition, i = Ia();
        try {
          return Jr.transition = null, rr(t), Jx();
        } finally {
          rr(i), Jr.transition = a;
        }
      }
      return !1;
    }
    function Zx(e) {
      g0.push(e), rc || (rc = !0, O0(Ti, function() {
        return Gu(), null;
      }));
    }
    function Jx() {
      if (Jo === null)
        return !1;
      var e = S0;
      S0 = null;
      var t = Jo, a = tv;
      if (Jo = null, tv = Q, (zt & (ea | Ui)) !== Or)
        throw new Error("Cannot flush passive effects while already rendering.");
      E0 = !0, Qm = !1, lh(a);
      var i = zt;
      zt |= Ui, gx(t.current), vx(t, t.current, a, e);
      {
        var u = g0;
        g0 = [];
        for (var s = 0; s < u.length; s++) {
          var d = u[s];
          ex(t, d);
        }
      }
      bs(), hb(t.current, !0), zt = i, Io(), Qm ? t === qm ? Gf++ : (Gf = 0, qm = t) : Gf = 0, E0 = !1, Qm = !1, Pl(t);
      {
        var v = t.current.stateNode;
        v.effectDuration = 0, v.passiveEffectDuration = 0;
      }
      return !0;
    }
    function db(e) {
      return Wf !== null && Wf.has(e);
    }
    function eD(e) {
      Wf === null ? Wf = /* @__PURE__ */ new Set([
        e
      ]) : Wf.add(e);
    }
    function tD(e) {
      Gm || (Gm = !0, y0 = e);
    }
    var nD = tD;
    function pb(e, t, a) {
      var i = ec(a, t), u = c_(e, i, rt), s = Wo(e, u, rt), d = ka();
      s !== null && (xu(s, rt, d), Za(s, d));
    }
    function Cn(e, t, a) {
      if (GT(a), lv(!1), e.tag === ee) {
        pb(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === ee) {
          pb(i, e, a);
          return;
        } else if (i.tag === ie) {
          var u = i.type, s = i.stateNode;
          if (typeof u.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !db(s)) {
            var d = ec(a, e), v = WS(i, d, rt), m = Wo(i, v, rt), E = ka();
            m !== null && (xu(m, rt, E), Za(m, E));
            return;
          }
        }
        i = i.return;
      }
      C(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function rD(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var u = ka();
      Wd(e, a), dD(e), Oa === e && Tu(kr, a) && (Mr === Xp || Mr === Im && ef(kr) && Dn() - m0 < J_ ? ac(e, Q) : Wm = bt(Wm, a)), Za(e, u);
    }
    function vb(e, t) {
      t === At && (t = Px(e));
      var a = ka(), i = qa(e, t);
      i !== null && (xu(i, t, a), Za(i, a));
    }
    function aD(e) {
      var t = e.memoizedState, a = At;
      t !== null && (a = t.retryLane), vb(e, a);
    }
    function iD(e, t) {
      var a = At, i;
      switch (e.tag) {
        case je:
          i = e.stateNode;
          var u = e.memoizedState;
          u !== null && (a = u.retryLane);
          break;
        case jt:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), vb(e, a);
    }
    function lD(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : Lx(e / 1960) * 1960;
    }
    function uD() {
      if (nv > zx)
        throw nv = 0, C0 = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      Gf > Ux && (Gf = 0, qm = null, C("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function oD() {
      ll.flushLegacyContextWarning(), ll.flushPendingUnsafeLifecycleWarnings();
    }
    function hb(e, t) {
      Zt(e), ey(e, oa, xx), t && ey(e, mu, Dx), ey(e, oa, Rx), t && ey(e, mu, Tx), Ln();
    }
    function ey(e, t, a) {
      for (var i = e, u = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== u && i.child !== null && s !== Ye ? i = i.child : ((i.flags & t) !== Ye && a(i), i.sibling !== null ? i = i.sibling : i = u = i.return);
      }
    }
    var ty = null;
    function mb(e) {
      {
        if ((zt & ea) !== Or || !(e.mode & xt))
          return;
        var t = e.tag;
        if (t !== _e && t !== ee && t !== ie && t !== J && t !== He && t !== yt && t !== nt)
          return;
        var a = ft(e) || "ReactComponent";
        if (ty !== null) {
          if (ty.has(a))
            return;
          ty.add(a);
        } else
          ty = /* @__PURE__ */ new Set([
            a
          ]);
        var i = xn;
        try {
          Zt(e), C("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? Zt(e) : Ln();
        }
      }
    }
    var T0;
    {
      var sD = null;
      T0 = function(e, t, a) {
        var i = wb(sD, t);
        try {
          return O_(e, t, a);
        } catch (s) {
          if (_R() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (lm(), PE(), z_(e, t), wb(t, i), t.mode & tt && HS(t), hu(null, O_, null, e, t, a), Py()) {
            var u = Rd();
            typeof u == "object" && u !== null && u._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var yb = !1, x0;
    x0 = /* @__PURE__ */ new Set();
    function cD(e) {
      if (ra && !rT())
        switch (e.tag) {
          case J:
          case He:
          case nt: {
            var t = Vn && ft(Vn) || "Unknown", a = t;
            if (!x0.has(a)) {
              x0.add(a);
              var i = ft(e) || "Unknown";
              C("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case ie: {
            yb || (C("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), yb = !0);
            break;
          }
        }
    }
    function iv(e, t) {
      if (br) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          Qd(e, i, t);
        });
      }
    }
    var D0 = {};
    function O0(e, t) {
      {
        var a = vl.current;
        return a !== null ? (a.push(t), D0) : Dc(e, t);
      }
    }
    function gb(e) {
      if (e !== D0)
        return Kv(e);
    }
    function Sb() {
      return vl.current !== null;
    }
    function fD(e) {
      {
        if (e.mode & xt) {
          if (!X_())
            return;
        } else if (!Nx() || zt !== Or || e.tag !== J && e.tag !== He && e.tag !== nt)
          return;
        if (vl.current === null) {
          var t = xn;
          try {
            Zt(e), C(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, ft(e));
          } finally {
            t ? Zt(e) : Ln();
          }
        }
      }
    }
    function dD(e) {
      e.tag !== $o && X_() && vl.current === null && C(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function lv(e) {
      nb = e;
    }
    var Pi = null, Qf = null, pD = function(e) {
      Pi = e;
    };
    function qf(e) {
      {
        if (Pi === null)
          return e;
        var t = Pi(e);
        return t === void 0 ? e : t.current;
      }
    }
    function k0(e) {
      return qf(e);
    }
    function M0(e) {
      {
        if (Pi === null)
          return e;
        var t = Pi(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = qf(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: Te,
                render: a
              };
              return e.displayName !== void 0 && (i.displayName = e.displayName), i;
            }
          }
          return e;
        }
        return t.current;
      }
    }
    function Cb(e, t) {
      {
        if (Pi === null)
          return !1;
        var a = e.elementType, i = t.type, u = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case ie: {
            typeof i == "function" && (u = !0);
            break;
          }
          case J: {
            (typeof i == "function" || s === Qe) && (u = !0);
            break;
          }
          case He: {
            (s === Te || s === Qe) && (u = !0);
            break;
          }
          case yt:
          case nt: {
            (s === Et || s === Qe) && (u = !0);
            break;
          }
          default:
            return !1;
        }
        if (u) {
          var d = Pi(a);
          if (d !== void 0 && d === Pi(i))
            return !0;
        }
        return !1;
      }
    }
    function Eb(e) {
      {
        if (Pi === null || typeof WeakSet != "function")
          return;
        Qf === null && (Qf = /* @__PURE__ */ new WeakSet()), Qf.add(e);
      }
    }
    var vD = function(e, t) {
      {
        if (Pi === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        Gu(), Wu(function() {
          N0(e.current, i, a);
        });
      }
    }, hD = function(e, t) {
      {
        if (e.context !== di)
          return;
        Gu(), Wu(function() {
          uv(t, e, null, null);
        });
      }
    };
    function N0(e, t, a) {
      {
        var i = e.alternate, u = e.child, s = e.sibling, d = e.tag, v = e.type, m = null;
        switch (d) {
          case J:
          case nt:
          case ie:
            m = v;
            break;
          case He:
            m = v.render;
            break;
        }
        if (Pi === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var E = !1, b = !1;
        if (m !== null) {
          var z = Pi(m);
          z !== void 0 && (a.has(z) ? b = !0 : t.has(z) && (d === ie ? b = !0 : E = !0));
        }
        if (Qf !== null && (Qf.has(e) || i !== null && Qf.has(i)) && (b = !0), b && (e._debugNeedsRemount = !0), b || E) {
          var L = qa(e, rt);
          L !== null && Nr(L, e, rt, sn);
        }
        u !== null && !b && N0(u, t, a), s !== null && N0(s, t, a);
      }
    }
    var mD = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(u) {
          return u.current;
        }));
        return L0(e.current, i, a), a;
      }
    };
    function L0(e, t, a) {
      {
        var i = e.child, u = e.sibling, s = e.tag, d = e.type, v = null;
        switch (s) {
          case J:
          case nt:
          case ie:
            v = d;
            break;
          case He:
            v = d.render;
            break;
        }
        var m = !1;
        v !== null && t.has(v) && (m = !0), m ? yD(e, a) : i !== null && L0(i, t, a), u !== null && L0(u, t, a);
      }
    }
    function yD(e, t) {
      {
        var a = gD(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case ve:
              t.add(i.stateNode);
              return;
            case de:
              t.add(i.stateNode.containerInfo);
              return;
            case ee:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function gD(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === ve)
          i = !0, t.add(a.stateNode);
        else if (a.child !== null) {
          a.child.return = a, a = a.child;
          continue;
        }
        if (a === e)
          return i;
        for (; a.sibling === null; ) {
          if (a.return === null || a.return === e)
            return i;
          a = a.return;
        }
        a.sibling.return = a.return, a = a.sibling;
      }
      return !1;
    }
    var A0;
    {
      A0 = !1;
      try {
        var _b = Object.preventExtensions({});
      } catch {
        A0 = !0;
      }
    }
    function SD(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = Ye, this.subtreeFlags = Ye, this.deletions = null, this.lanes = Q, this.childLanes = Q, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !A0 && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var pi = function(e, t, a, i) {
      return new SD(e, t, a, i);
    };
    function z0(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function CD(e) {
      return typeof e == "function" && !z0(e) && e.defaultProps === void 0;
    }
    function ED(e) {
      if (typeof e == "function")
        return z0(e) ? ie : J;
      if (e != null) {
        var t = e.$$typeof;
        if (t === Te)
          return He;
        if (t === Et)
          return yt;
      }
      return _e;
    }
    function lc(e, t) {
      var a = e.alternate;
      a === null ? (a = pi(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = Ye, a.subtreeFlags = Ye, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & _r, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case _e:
        case J:
        case nt:
          a.type = qf(e.type);
          break;
        case ie:
          a.type = k0(e.type);
          break;
        case He:
          a.type = M0(e.type);
          break;
      }
      return a;
    }
    function _D(e, t) {
      e.flags &= _r | mn;
      var a = e.alternate;
      if (a === null)
        e.childLanes = Q, e.lanes = t, e.child = null, e.subtreeFlags = Ye, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = Ye, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function bD(e, t, a) {
      var i;
      return e === Zh ? (i = xt, t === !0 && (i |= On, i |= Va)) : i = Ze, br && (i |= tt), pi(ee, null, null, i);
    }
    function U0(e, t, a, i, u, s) {
      var d = _e, v = e;
      if (typeof e == "function")
        z0(e) ? (d = ie, v = k0(v)) : v = qf(v);
      else if (typeof e == "string")
        d = ve;
      else
        e:
          switch (e) {
            case Ea:
              return ns(a.children, u, s, t);
            case Si:
              d = st, u |= On, (u & xt) !== Ze && (u |= Va);
              break;
            case D:
              return wD(a, u, s, t);
            case ht:
              return RD(a, u, s, t);
            case Lt:
              return TD(a, u, s, t);
            case dn:
              return bb(a, u, s, t);
            case Er:
            case Gn:
            case Ci:
            case Ku:
            case fn:
            default: {
              if (typeof e == "object" && e !== null)
                switch (e.$$typeof) {
                  case ne:
                    d = $e;
                    break e;
                  case ye:
                    d = It;
                    break e;
                  case Te:
                    d = He, v = M0(v);
                    break e;
                  case Et:
                    d = yt;
                    break e;
                  case Qe:
                    d = an, v = null;
                    break e;
                }
              var m = "";
              {
                (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (m += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
                var E = i ? ft(i) : null;
                E && (m += `

Check the render method of \`` + E + "`.");
              }
              throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + m));
            }
          }
      var b = pi(d, a, t, u);
      return b.elementType = e, b.type = v, b.lanes = s, b._debugOwner = i, b;
    }
    function P0(e, t, a) {
      var i = null;
      i = e._owner;
      var u = e.type, s = e.key, d = e.props, v = U0(u, s, d, i, t, a);
      return v._debugSource = e._source, v._debugOwner = e._owner, v;
    }
    function ns(e, t, a, i) {
      var u = pi(ot, e, i, t);
      return u.lanes = a, u;
    }
    function wD(e, t, a, i) {
      typeof e.id != "string" && C('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var u = pi(mt, e, i, t | tt);
      return u.elementType = D, u.lanes = a, u.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, u;
    }
    function RD(e, t, a, i) {
      var u = pi(je, e, i, t);
      return u.elementType = ht, u.lanes = a, u;
    }
    function TD(e, t, a, i) {
      var u = pi(jt, e, i, t);
      return u.elementType = Lt, u.lanes = a, u;
    }
    function bb(e, t, a, i) {
      var u = pi(Xe, e, i, t);
      u.elementType = dn, u.lanes = a;
      var s = {
        isHidden: !1
      };
      return u.stateNode = s, u;
    }
    function j0(e, t, a) {
      var i = pi(ke, e, null, t);
      return i.lanes = a, i;
    }
    function xD() {
      var e = pi(ve, null, null, Ze);
      return e.elementType = "DELETED", e;
    }
    function DD(e) {
      var t = pi(Xt, null, null, Ze);
      return t.stateNode = e, t;
    }
    function F0(e, t, a) {
      var i = e.children !== null ? e.children : [], u = pi(de, i, e.key, t);
      return u.lanes = a, u.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, u;
    }
    function wb(e, t) {
      return e === null && (e = pi(_e, null, null, Ze)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function OD(e, t, a, i, u) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Cg, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = At, this.eventTimes = nf(Q), this.expirationTimes = nf(sn), this.pendingLanes = Q, this.suspendedLanes = Q, this.pingedLanes = Q, this.expiredLanes = Q, this.mutableReadLanes = Q, this.finishedLanes = Q, this.entangledLanes = Q, this.entanglements = nf(Q), this.identifierPrefix = i, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], d = 0; d < gn; d++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Zh:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case $o:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function Rb(e, t, a, i, u, s, d, v, m, E) {
      var b = new OD(e, t, a, v, m), z = bD(t, s);
      b.current = z, z.stateNode = b;
      {
        var L = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        z.memoizedState = L;
      }
      return Gg(z), b;
    }
    var H0 = "18.2.0";
    function kD(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return gr(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: Vr,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var B0, V0;
    B0 = !1, V0 = {};
    function Tb(e) {
      if (!e)
        return di;
      var t = Pa(e), a = pR(t);
      if (t.tag === ie) {
        var i = t.type;
        if (Xl(i))
          return ZC(t, i, a);
      }
      return a;
    }
    function MD(e, t) {
      {
        var a = Pa(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var u = Ba(a);
        if (u === null)
          return null;
        if (u.mode & On) {
          var s = ft(a) || "Component";
          if (!V0[s]) {
            V0[s] = !0;
            var d = xn;
            try {
              Zt(u), a.mode & On ? C("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : C("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              d ? Zt(d) : Ln();
            }
          }
        }
        return u.stateNode;
      }
    }
    function xb(e, t, a, i, u, s, d, v) {
      var m = !1, E = null;
      return Rb(e, t, m, E, a, i, u, s, d);
    }
    function Db(e, t, a, i, u, s, d, v, m, E) {
      var b = !0, z = Rb(a, i, b, e, u, s, d, v, m);
      z.context = Tb(null);
      var L = z.current, B = ka(), $ = es(L), W = Vu(B, $);
      return W.callback = t ?? null, Wo(L, W, $), jx(z, $, B), z;
    }
    function uv(e, t, a, i) {
      Jv(t, e);
      var u = t.current, s = ka(), d = es(u);
      gu(d);
      var v = Tb(a);
      t.context === null ? t.context = v : t.pendingContext = v, ra && xn !== null && !B0 && (B0 = !0, C(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, ft(xn) || "Unknown"));
      var m = Vu(s, d);
      m.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && C("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), m.callback = i);
      var E = Wo(u, m, d);
      return E !== null && (Nr(E, u, d, s), fm(E, u, d)), d;
    }
    function ny(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case ve:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function ND(e) {
      switch (e.tag) {
        case ee: {
          var t = e.stateNode;
          if (ar(t)) {
            var a = Hy(t);
            Vx(t, a);
          }
          break;
        }
        case je: {
          Wu(function() {
            var u = qa(e, rt);
            if (u !== null) {
              var s = ka();
              Nr(u, e, rt, s);
            }
          });
          var i = rt;
          $0(e, i);
          break;
        }
      }
    }
    function Ob(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = fh(a.retryLane, t));
    }
    function $0(e, t) {
      Ob(e, t);
      var a = e.alternate;
      a && Ob(a, t);
    }
    function LD(e) {
      if (e.tag === je) {
        var t = Eo, a = qa(e, t);
        if (a !== null) {
          var i = ka();
          Nr(a, e, t, i);
        }
        $0(e, t);
      }
    }
    function AD(e) {
      if (e.tag === je) {
        var t = es(e), a = qa(e, t);
        if (a !== null) {
          var i = ka();
          Nr(a, e, t, i);
        }
        $0(e, t);
      }
    }
    function kb(e) {
      var t = Xv(e);
      return t === null ? null : t.stateNode;
    }
    var Mb = function(e) {
      return null;
    };
    function zD(e) {
      return Mb(e);
    }
    var Nb = function(e) {
      return !1;
    };
    function UD(e) {
      return Nb(e);
    }
    var Lb = null, Ab = null, zb = null, Ub = null, Pb = null, jb = null, Fb = null, Hb = null, Bb = null;
    {
      var Vb = function(e, t, a) {
        var i = t[a], u = Nt(e) ? e.slice() : Rt({}, e);
        return a + 1 === t.length ? (Nt(u) ? u.splice(i, 1) : delete u[i], u) : (u[i] = Vb(e[i], t, a + 1), u);
      }, $b = function(e, t) {
        return Vb(e, t, 0);
      }, Ib = function(e, t, a, i) {
        var u = t[i], s = Nt(e) ? e.slice() : Rt({}, e);
        if (i + 1 === t.length) {
          var d = a[i];
          s[d] = s[u], Nt(s) ? s.splice(u, 1) : delete s[u];
        } else
          s[u] = Ib(e[u], t, a, i + 1);
        return s;
      }, Yb = function(e, t, a) {
        if (t.length !== a.length) {
          M("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              M("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return Ib(e, t, a, 0);
      }, Wb = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var u = t[a], s = Nt(e) ? e.slice() : Rt({}, e);
        return s[u] = Wb(e[u], t, a + 1, i), s;
      }, Gb = function(e, t, a) {
        return Wb(e, t, 0, a);
      }, I0 = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      Lb = function(e, t, a, i) {
        var u = I0(e, t);
        if (u !== null) {
          var s = Gb(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = Rt({}, e.memoizedProps);
          var d = qa(e, rt);
          d !== null && Nr(d, e, rt, sn);
        }
      }, Ab = function(e, t, a) {
        var i = I0(e, t);
        if (i !== null) {
          var u = $b(i.memoizedState, a);
          i.memoizedState = u, i.baseState = u, e.memoizedProps = Rt({}, e.memoizedProps);
          var s = qa(e, rt);
          s !== null && Nr(s, e, rt, sn);
        }
      }, zb = function(e, t, a, i) {
        var u = I0(e, t);
        if (u !== null) {
          var s = Yb(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = Rt({}, e.memoizedProps);
          var d = qa(e, rt);
          d !== null && Nr(d, e, rt, sn);
        }
      }, Ub = function(e, t, a) {
        e.pendingProps = Gb(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = qa(e, rt);
        i !== null && Nr(i, e, rt, sn);
      }, Pb = function(e, t) {
        e.pendingProps = $b(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = qa(e, rt);
        a !== null && Nr(a, e, rt, sn);
      }, jb = function(e, t, a) {
        e.pendingProps = Yb(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = qa(e, rt);
        i !== null && Nr(i, e, rt, sn);
      }, Fb = function(e) {
        var t = qa(e, rt);
        t !== null && Nr(t, e, rt, sn);
      }, Hb = function(e) {
        Mb = e;
      }, Bb = function(e) {
        Nb = e;
      };
    }
    function PD(e) {
      var t = Ba(e);
      return t === null ? null : t.stateNode;
    }
    function jD(e) {
      return null;
    }
    function FD() {
      return xn;
    }
    function HD(e) {
      var t = e.findFiberByHostInstance, a = h.ReactCurrentDispatcher;
      return Ad({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: Lb,
        overrideHookStateDeletePath: Ab,
        overrideHookStateRenamePath: zb,
        overrideProps: Ub,
        overridePropsDeletePath: Pb,
        overridePropsRenamePath: jb,
        setErrorHandler: Hb,
        setSuspenseHandler: Bb,
        scheduleUpdate: Fb,
        currentDispatcherRef: a,
        findHostInstanceByFiber: PD,
        findFiberByHostInstance: t || jD,
        // React Refresh
        findHostInstancesForRefresh: mD,
        scheduleRefresh: vD,
        scheduleRoot: hD,
        setRefreshHandler: pD,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: FD,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: H0
      });
    }
    var Qb = typeof reportError == "function" ? (
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function Y0(e) {
      this._internalRoot = e;
    }
    ry.prototype.render = Y0.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? C("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : ay(arguments[1]) ? C("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && C("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== Qn) {
          var i = kb(t.current);
          i && i.parentNode !== a && C("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      uv(e, t, null, null);
    }, ry.prototype.unmount = Y0.prototype.unmount = function() {
      typeof arguments[0] == "function" && C("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        lb() && C("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Wu(function() {
          uv(null, e, null, null);
        }), GC(t);
      }
    };
    function BD(e, t) {
      if (!ay(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      qb(e);
      var a = !1, i = !1, u = "", s = Qb;
      t != null && (t.hydrate ? M("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === gi && C(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var d = xb(e, Zh, null, a, i, u, s);
      Yh(d.current, e);
      var v = e.nodeType === Qn ? e.parentNode : e;
      return hp(v), new Y0(d);
    }
    function ry(e) {
      this._internalRoot = e;
    }
    function VD(e) {
      e && Sh(e);
    }
    ry.prototype.unstable_scheduleHydration = VD;
    function $D(e, t, a) {
      if (!ay(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      qb(e), t === void 0 && C("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, u = a != null && a.hydratedSources || null, s = !1, d = !1, v = "", m = Qb;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (v = a.identifierPrefix), a.onRecoverableError !== void 0 && (m = a.onRecoverableError));
      var E = Db(t, null, e, Zh, i, s, d, v, m);
      if (Yh(E.current, e), hp(e), u)
        for (var b = 0; b < u.length; b++) {
          var z = u[b];
          KR(E, z);
        }
      return new ry(E);
    }
    function ay(e) {
      return !!(e && (e.nodeType === ia || e.nodeType === ui || e.nodeType === su || !q));
    }
    function ov(e) {
      return !!(e && (e.nodeType === ia || e.nodeType === ui || e.nodeType === su || e.nodeType === Qn && e.nodeValue === " react-mount-point-unstable "));
    }
    function qb(e) {
      e.nodeType === ia && e.tagName && e.tagName.toUpperCase() === "BODY" && C("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), Tp(e) && (e._reactRootContainer ? C("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : C("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var ID = h.ReactCurrentOwner, Xb;
    Xb = function(e) {
      if (e._reactRootContainer && e.nodeType !== Qn) {
        var t = kb(e._reactRootContainer.current);
        t && t.parentNode !== e && C("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = W0(e), u = !!(i && Bo(i));
      u && !a && C("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === ia && e.tagName && e.tagName.toUpperCase() === "BODY" && C("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function W0(e) {
      return e ? e.nodeType === ui ? e.documentElement : e.firstChild : null;
    }
    function Kb() {
    }
    function YD(e, t, a, i, u) {
      if (u) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var L = ny(d);
            s.call(L);
          };
        }
        var d = Db(t, i, e, $o, null, !1, !1, "", Kb);
        e._reactRootContainer = d, Yh(d.current, e);
        var v = e.nodeType === Qn ? e.parentNode : e;
        return hp(v), Wu(), d;
      } else {
        for (var m; m = e.lastChild; )
          e.removeChild(m);
        if (typeof i == "function") {
          var E = i;
          i = function() {
            var L = ny(b);
            E.call(L);
          };
        }
        var b = xb(e, $o, null, !1, !1, "", Kb);
        e._reactRootContainer = b, Yh(b.current, e);
        var z = e.nodeType === Qn ? e.parentNode : e;
        return hp(z), Wu(function() {
          uv(t, b, a, i);
        }), b;
      }
    }
    function WD(e, t) {
      e !== null && typeof e != "function" && C("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function iy(e, t, a, i, u) {
      Xb(a), WD(u === void 0 ? null : u, "render");
      var s = a._reactRootContainer, d;
      if (!s)
        d = YD(a, t, e, u, i);
      else {
        if (d = s, typeof u == "function") {
          var v = u;
          u = function() {
            var m = ny(d);
            v.call(m);
          };
        }
        uv(t, d, e, u);
      }
      return ny(d);
    }
    function GD(e) {
      {
        var t = ID.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || C("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Bt(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === ia ? e : MD(e, "findDOMNode");
    }
    function QD(e, t, a) {
      if (C("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !ov(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = Tp(t) && t._reactRootContainer === void 0;
        i && C("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return iy(null, e, t, !0, a);
    }
    function qD(e, t, a) {
      if (C("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !ov(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = Tp(t) && t._reactRootContainer === void 0;
        i && C("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return iy(null, e, t, !1, a);
    }
    function XD(e, t, a, i) {
      if (C("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !ov(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !Cs(e))
        throw new Error("parentComponent must be a valid React Component");
      return iy(e, t, a, !1, i);
    }
    function KD(e) {
      if (!ov(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = Tp(e) && e._reactRootContainer === void 0;
        t && C("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = W0(e), i = a && !Bo(a);
          i && C("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Wu(function() {
          iy(null, null, e, !1, function() {
            e._reactRootContainer = null, GC(e);
          });
        }), !0;
      } else {
        {
          var u = W0(e), s = !!(u && Bo(u)), d = e.nodeType === ia && ov(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && C("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", d ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    Me(ND), ph(LD), zs(AD), Kd(Ia), hh(Ns), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && C("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), Gv(ew), bc(b0, $x, Wu);
    function ZD(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!ay(t))
        throw new Error("Target container is not a DOM element.");
      return kD(e, t, null, a);
    }
    function JD(e, t, a, i) {
      return XD(e, t, a, i);
    }
    var G0 = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [
        Bo,
        Tf,
        Wh,
        _c,
        ys,
        b0
      ]
    };
    function eO(e, t) {
      return G0.usingClientEntryPoint || C('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), BD(e, t);
    }
    function tO(e, t, a) {
      return G0.usingClientEntryPoint || C('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), $D(e, t, a);
    }
    function nO(e) {
      return lb() && C("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Wu(e);
    }
    var rO = HD({
      findFiberByHostInstance: Ys,
      bundleType: 1,
      version: H0,
      rendererPackageName: "react-dom"
    });
    if (!rO && cn && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var Zb = window.location.protocol;
      /^(https?|file):$/.test(Zb) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (Zb === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    ei.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = G0, ei.createPortal = ZD, ei.createRoot = eO, ei.findDOMNode = GD, ei.flushSync = nO, ei.hydrate = QD, ei.hydrateRoot = tO, ei.render = qD, ei.unmountComponentAtNode = KD, ei.unstable_batchedUpdates = b0, ei.unstable_renderSubtreeIntoContainer = JD, ei.version = H0, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), ei;
}
function S1() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(S1);
    } catch (g) {
      console.error(g);
    }
  }
}
process.env.NODE_ENV === "production" ? (S1(), Z0.exports = ik()) : Z0.exports = lk();
var uk = Z0.exports, J0, oy = uk;
if (process.env.NODE_ENV === "production")
  J0 = oy.createRoot, oy.hydrateRoot;
else {
  var p1 = oy.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  J0 = function(g, f) {
    p1.usingClientEntryPoint = !0;
    try {
      return oy.createRoot(g, f);
    } finally {
      p1.usingClientEntryPoint = !1;
    }
  };
}
var ok = Object.defineProperty, sk = Object.getOwnPropertyDescriptor, ck = (g, f, h, _) => {
  for (var w = _ > 1 ? void 0 : _ ? sk(f, h) : f, M = g.length - 1, C; M >= 0; M--)
    (C = g[M]) && (w = (_ ? C(f, h, w) : C(w)) || w);
  return _ && w && ok(f, h, w), w;
};
let hy = class {
  constructor(g, f) {
    this._logger = g, this._sceneEventBus = f;
    const h = document.getElementById("app");
    if (!h)
      throw new Error("No se encontró el tag con id app");
    this._root = J0(h);
    const _ = this._sceneEventBus.subscribeTo(ed, Xu, this.onSceneChange.bind(this));
    this._subscriptions = [
      _
    ];
    const w = Pn.get(hv);
    this.loadScene(w);
  }
  _scene = null;
  _root;
  _subscriptions;
  onSceneChange(g) {
    switch (this._logger.logInfo("Scene changed", g.payload), g.payload) {
      case Xu.Home:
        const f = Pn.get(hv);
        this.loadScene(f);
        break;
      case Xu.Map:
        const h = Pn.get(vy);
        this.loadScene(h);
        break;
      case Xu.Battle:
        const _ = Pn.get(py);
        this.loadScene(_);
        break;
      case Xu.GameOver:
        console.log("game over");
        break;
      default:
        throw new Error("Scene not found");
    }
  }
  loadScene(g) {
    this._scene && this._scene.dispose(), this._scene = g, this._scene.load(this._root), this._scene.render();
  }
  dispose() {
    this._scene && this._scene.dispose(), this._root.unmount();
    for (const g of this._subscriptions)
      g.unsubscribe();
  }
};
hy = ck([
  hi()
], hy);
const fk = () => {
  Pn.addSingleton(hy), Pn.addTransient(hv), Pn.addTransient(vy), Pn.addTransient(py);
};
var ur = /* @__PURE__ */ ((g) => (g.HighCard = "HighCard", g.Pair = "Pair", g.DoublePair = "DoublePair", g.ThreeOfAKind = "ThreeOfAKind", g.Straight = "Straight", g.Flush = "Flush", g.FullHouse = "FullHouse", g.FourOfAKind = "FourOfAKind", g.StraightFlush = "StraightFlush", g.RoyalFlush = "RoyalFlush", g))(ur || {});
class ti extends Jf {
  _points;
  _multiplier;
  _level;
  get level() {
    return this._level;
  }
  _name;
  get name() {
    return this._name;
  }
  constructor(f, h, _, w) {
    super(ji.newGuid()), this._points = h, this._multiplier = _, this._name = f, this._level = w;
  }
  addLevel() {
    this._level += 1;
  }
  play(f) {
    const h = f.reduce((_, w) => _ + w.number * this._points, 0);
    return {
      cards: f,
      points: h * this._level,
      multiplier: this._multiplier * this._level,
      play: this._name
    };
  }
}
class vC extends ti {
  static create() {
    return new vC(ur.DoublePair, 4, 2, 1);
  }
  isPlayable(f) {
    return f.length < 4 ? !1 : f.some((h) => f.sort((w, M) => M.number - w.number).filter((w) => w.number === h.number).length === 4);
  }
  play(f) {
    const h = f.sort((_, w) => w.number - _.number).filter((_, w, M) => M.filter((me) => me.number === _.number).length === 4).slice(0, 4);
    return super.play(h);
  }
}
class Sv extends ti {
  static create() {
    return new Sv(ur.Flush, 6, 6, 1);
  }
  isPlayable(f) {
    return f.length !== 5 ? !1 : f.sort((h, _) => h.number - _.number).every((h, _, w) => _ === 0 ? !0 : h.type === w[_ - 1].type);
  }
  play(f) {
    return super.play(f);
  }
}
class hC extends ti {
  static create() {
    return new hC(ur.FourOfAKind, 7, 7, 1);
  }
  isPlayable(f) {
    return f.length < 4 ? !1 : f.sort((h, _) => h.number - _.number).filter((h, _, w) => w.filter((C) => C.number === h.number).length === 4).length === 4;
  }
  play(f) {
    const h = f.sort((_, w) => w.number - _.number).filter((_, w, M) => M.filter((me) => me.number === _.number).length === 4).slice(0, 4);
    return super.play(h);
  }
}
class Ey extends ti {
  static create() {
    return new Ey(ur.HighCard, 1, 1, 1);
  }
  isPlayable(f) {
    return f.length >= 1;
  }
  play(f) {
    const h = f.sort((_, w) => w.number - _.number).slice(0, 1);
    return super.play(h);
  }
}
class _y extends ti {
  static create() {
    return new _y(ur.Pair, 2, 2, 1);
  }
  isPlayable(f) {
    return f.length < 2 ? !1 : f.some((h) => f.filter((w) => w.number === h.number).length >= 2);
  }
  play(f) {
    const h = f.sort((_, w) => w.number - _.number).filter((_, w, M) => M.filter((me) => me.number === _.number).length >= 2).slice(0, 2);
    return super.play(h);
  }
}
class Cv extends ti {
  static create() {
    return new Cv(ur.Straight, 5, 5, 1);
  }
  isPlayable(f) {
    return f.length < 5 ? !1 : f.sort((_, w) => _.number - w.number).every((_, w, M) => w === 0 ? !0 : _.number === M[w - 1].number + 1);
  }
  play(f) {
    return super.play(f);
  }
}
class mC extends ti {
  static create() {
    return new mC(ur.RoyalFlush, 10, 10, 1);
  }
  isPlayable(f) {
    return f.length !== 5 || !f.every((h) => h.number <= 12 && h.number >= 10) ? !1 : Cv.create().isPlayable(f) && Sv.create().isPlayable(f);
  }
  play(f) {
    return super.play(f);
  }
}
class yC extends ti {
  static create() {
    return new yC(ur.StraightFlush, 10, 10, 1);
  }
  isPlayable(f) {
    return f.length !== 5 ? !1 : Cv.create().isPlayable(f) && Sv.create().isPlayable(f);
  }
  play(f) {
    return super.play(f);
  }
}
class gC extends ti {
  static create() {
    return new gC(ur.ThreeOfAKind, 3, 3, 1);
  }
  isPlayable(f) {
    return f.length < 3 ? !1 : f.some((h) => f.filter((w) => w.number === h.number).length === 3);
  }
  play(f) {
    const h = f.sort((_, w) => w.number - _.number).filter((_, w, M) => M.filter((me) => me.number === _.number).length === 3).slice(0, 3);
    return super.play(h);
  }
}
class dk {
  static create(f) {
    switch (f) {
      case ur.HighCard:
        return Ey.create();
      case ur.Pair:
        return _y.create();
      case ur.DoublePair:
        return vC.create();
      case ur.ThreeOfAKind:
        return gC.create();
      case ur.FourOfAKind:
        hC.create();
      case ur.Straight:
        return Cv.create();
      case ur.Flush:
        return Sv.create();
      case ur.StraightFlush:
        return yC.create();
      case ur.RoyalFlush:
        return mC.create();
      default:
        throw new Error(`Card play type ${f} is not valid`);
    }
  }
}
var pk = Object.defineProperty, vk = Object.getOwnPropertyDescriptor, hk = (g, f, h, _) => {
  for (var w = _ > 1 ? void 0 : _ ? vk(f, h) : f, M = g.length - 1, C; M >= 0; M--)
    (C = g[M]) && (w = (_ ? C(f, h, w) : C(w)) || w);
  return _ && w && pk(f, h, w), w;
};
let eC = class {
  constructor(g) {
    this._state = g;
  }
  newRun(g) {
    const f = QO.createDeck(g);
    f.init();
    const h = sc.create();
    h.generateIsometricMap(f);
    const _ = _y.create(), w = Ey.create(), M = iu.create();
    M.setCardPlay(_), M.setCardPlay(w), this._state.set(_, ti), this._state.set(w, ti), this._state.setSingle(f, hl), this._state.setSingle(h), this._state.setSingle(M);
  }
  addCardPlay(g) {
    const f = this._state.getOrThrow(iu);
    f.setCardPlay(g), this._state.setSingle(f);
  }
};
eC = hk([
  hi()
], eC);
var mk = Object.defineProperty, yk = Object.getOwnPropertyDescriptor, gk = (g, f, h, _) => {
  for (var w = _ > 1 ? void 0 : _ ? yk(f, h) : f, M = g.length - 1, C; M >= 0; M--)
    (C = g[M]) && (w = (_ ? C(f, h, w) : C(w)) || w);
  return _ && w && mk(f, h, w), w;
};
let tC = class {
  constructor(g, f) {
    this._state = g, this._sceneEventBus = f;
  }
  goToPoint(g) {
    if (!g)
      return;
    const f = this._state.getOrThrow(sc);
    if (f.isPointAccessible(g) && (f.moveToPoint(g), this._state.setSingle(f), g.type === $n.Battle)) {
      const h = this._state.getAll(ti), _ = iu.create();
      _.init(g), h.forEach((C) => _.setCardPlay(C)), this._state.setSingle(_), this._state.getOrThrow(hl).shuffle();
      const M = ed.create(Xu.Battle);
      this._sceneEventBus.publish(M);
    }
  }
};
tC = gk([
  hi()
], tC);
var Sk = Object.defineProperty, Ck = Object.getOwnPropertyDescriptor, Ek = (g, f, h, _) => {
  for (var w = _ > 1 ? void 0 : _ ? Ck(f, h) : f, M = g.length - 1, C; M >= 0; M--)
    (C = g[M]) && (w = (_ ? C(f, h, w) : C(w)) || w);
  return _ && w && Sk(f, h, w), w;
};
let nC = class {
  constructor(g, f, h) {
    this._state = g, this._battleEventBus = f, this._sceneEventBus = h;
  }
  selectCard(g) {
    const f = this._state.getOrThrow(hl);
    f.selectCard(g), this._state.setSingle(f, hl);
  }
  discardSelectedCards() {
    const g = this._state.getOrThrow(hl);
    g.discardSelectedCards(), this._state.setSingle(g, hl);
    const f = this._state.getOrThrow(iu);
    f.downRemainingDiscards(), this._state.setSingle(f);
  }
  run() {
    const g = this._state.getOrThrow(iu), f = this._state.getOrThrow(hl), h = g.run(f.selectedCards);
    this._state.setSingle(g), f.playSelectedCards(), f.takeCardsToHand(), this._state.setSingle(f);
    const _ = my.create(h);
    if (this._battleEventBus.publish(_), g.score >= g.objetiveScore) {
      const w = gy.create({
        rewards: 0
      });
      this._battleEventBus.publish(w);
      return;
    }
    if (g.remainingActions === 0) {
      const w = yy.create({});
      this._battleEventBus.publish(w);
      return;
    }
  }
  generateRewards() {
    const f = this._state.getOrThrow(sc).currentPoint, h = Math.floor(Math.random() * (f.y * 200) + f.y * 100), w = Object.keys(ur).sort(() => Math.random() - 0.5).slice(0, 3);
    return {
      money: h,
      cardPlays: w.map((C) => ur[C])
    };
  }
  purchaseCardPlay(g) {
    let h = this._state.getAll(ti).find((w) => w.name === g);
    h && h.addLevel(), h || (h = dk.create(g)), this._state.set(h, ti);
    const _ = this._state.getOrThrow(iu);
    _.setCardPlay(h), this._state.setSingle(_);
  }
  rewardsPurchased() {
    const g = ed.create(Xu.Map);
    this._sceneEventBus.publish(g);
  }
};
nC = Ek([
  hi()
], nC);
const _k = () => {
  Pn.addSingleton(nC), Pn.addSingleton(eC), Pn.addSingleton(tC);
}, bk = () => {
  Pn.addSingleton(sy), Pn.addSingleton(cy);
}, wk = function() {
  Pn.addSingleton(pv), Pn.addSingleton(xO, CO), Pn.addSingleton(oc), fk(), _k(), bk(), Pn.build();
}, Rk = function() {
  wk(), Pn.get(pv).showLogs(!0), Pn.get(hy), Pn.get(oc);
};
Rk();
