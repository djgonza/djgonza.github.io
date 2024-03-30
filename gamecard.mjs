const vi = () => (g) => g;
var ld = /* @__PURE__ */ ((g) => (g.Class = "class", g.Factory = "factory", g.Instance = "instance", g))(ld || {}), _l = /* @__PURE__ */ ((g) => (g.Transient = "transient", g.Request = "request", g.Singleton = "singleton", g))(_l || {});
class uO {
  constructor(d) {
    this.services = d, this.singletons = /* @__PURE__ */ new Map();
  }
  get(d) {
    return this.getService(
      d,
      /* @__PURE__ */ new Map(),
      !1
    );
  }
  findTaggedServiceIdentifiers(d) {
    return Array.from(this.services).filter(([, h]) => h.tags.indexOf(d) >= 0).map(([h]) => h);
  }
  getService(d, h, C) {
    const w = this.findServiceDataOrThrow(d, C);
    if (w.scope === _l.Singleton && this.singletons.has(d))
      return this.singletons.get(d);
    if (w.scope === _l.Request && h.has(d))
      return h.get(d);
    let A;
    if (w.type === ld.Instance)
      A = w.instance;
    else if (w.type === ld.Class) {
      const P = this.getDependencies(
        w.dependencies,
        h
      );
      A = new w.class(...P);
    } else
      A = w.factory({
        get: (P) => this.getService(P, h, !0),
        findTaggedServiceIdentifiers: (P) => this.findTaggedServiceIdentifiers(P)
      });
    return w.scope === _l.Singleton ? this.singletons.set(d, A) : w.scope === _l.Request && h.set(d, A), A;
  }
  findServiceDataOrThrow(d, h) {
    const C = this.services.get(d);
    if (!C)
      throw new Error(`Service not registered for: ${d.name}`);
    if (!h && C.isPrivate)
      throw new Error(
        `The ${d.name} service has been registered as private and can not be directly get from the container`
      );
    return C;
  }
  getDependencies(d, h) {
    const C = new Array();
    for (const w of d)
      C.push(
        this.getService(w, h, !0)
      );
    return C;
  }
}
const sO = "design:paramtypes", cO = (g, d) => {
  const h = Reflect.getMetadata(sO, g) || [];
  if (h.length < g.length)
    throw new Error(
      `Service not decorated: ${[...d, g.name].join(" -> ")}`
    );
  return h;
}, v1 = (g) => {
  const d = Object.getPrototypeOf(g.prototype).constructor;
  if (d !== Object)
    return d;
}, h1 = (g, d = []) => {
  const h = cO(
    g,
    d
  );
  if (h.length > 0)
    return h;
  const C = v1(g);
  return C ? h1(C, [...d, g.name]) : [];
}, m1 = (g) => {
  if (g.length > 0)
    return g.length;
  const d = v1(g);
  return d ? m1(d) : 0;
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
  addTag(d) {
    return this.tags = [...this.tags, d], this;
  }
  asTransient() {
    return this.scope = _l.Transient, this;
  }
  asSingleton() {
    return this.scope = _l.Singleton, this;
  }
  asInstancePerRequest() {
    return this.scope = _l.Request, this;
  }
}
class aC extends rC {
  constructor(d) {
    super(), this.newable = d, this.scope = _l.Transient, this.dependencies = [], this.autowire = !0;
  }
  withDependencies(d) {
    return this.dependencies = d, this.autowire = !1, this;
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
  setDependencyInformationIfNotExist(d, h) {
    const C = h.autowire && this.autowire;
    if (!C && m1(this.newable) > this.dependencies.length)
      throw new Error(
        `Dependencies must be provided for non autowired services. Service with missing dependencies: ${d.name}`
      );
    C && (this.dependencies = h1(this.newable));
  }
  build(d) {
    return this.setDependencyInformationIfNotExist(this.newable, d), {
      tags: this.tags,
      isPrivate: this.isPrivate,
      scope: this.scope,
      type: ld.Class,
      class: this.newable,
      dependencies: this.dependencies,
      autowire: this.autowire
    };
  }
  static createBuildable(d) {
    const h = new aC(d);
    return {
      instance: h,
      build: (C) => h.build(C)
    };
  }
}
class iC extends rC {
  constructor(d) {
    super(), this.factory = d, this.scope = _l.Transient;
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
      type: ld.Factory,
      factory: this.factory,
      dependencies: []
    };
  }
  static createBuildable(d) {
    const h = new iC(d);
    return {
      instance: h,
      build: () => h.build()
    };
  }
}
class lC extends rC {
  constructor(d) {
    super(), this.instance = d, this.scope = _l.Singleton;
  }
  build() {
    return {
      tags: this.tags,
      isPrivate: this.isPrivate,
      scope: this.scope,
      type: ld.Instance,
      instance: this.instance,
      dependencies: []
    };
  }
  static createBuildable(d) {
    const h = new lC(d);
    return {
      instance: h,
      build: () => h.build()
    };
  }
}
class oC {
  constructor(d) {
    this.identifier = d;
  }
  useClass(d) {
    const h = aC.createBuildable(d);
    return this.buildable = h, h.instance;
  }
  use(d) {
    return this.useClass(d);
  }
  useInstance(d) {
    const h = lC.createBuildable(d);
    return this.buildable = h, h.instance;
  }
  useFactory(d) {
    const h = iC.createBuildable(d);
    return this.buildable = h, h.instance;
  }
  build(d) {
    if (this.buildable === void 0)
      throw new Error(
        `Service ${this.identifier.name} registration is not completed. Use .registerAndUse(${this.identifier.name}) instead of .register(${this.identifier.name}) to use it directly or set any other registration use`
      );
    return this.buildable.build(d);
  }
  static createBuildable(d) {
    const h = new oC(d);
    return {
      instance: h,
      build: (C) => h.build(C)
    };
  }
}
const fO = (g, d, h) => {
  const C = new Array();
  for (const w of d.dependencies)
    h.has(w) || C.push(w.name);
  if (C.length > 0)
    throw new Error(
      `Service not registered for the following dependencies of ${g.name}: ${C.join(", ")}`
    );
}, y1 = (g, d, h, C = []) => {
  for (const w of d.dependencies) {
    if (g === w)
      throw new Error(
        `Circular dependency detected: ${[
          g.name,
          ...C,
          g.name
        ].join(" -> ")}`
      );
    const A = h.get(
      w
    );
    A.dependencies.length > 0 && y1(g, A, h, [
      ...C,
      w.name
    ]);
  }
}, Jb = (g, d) => {
  for (const [h, C] of g)
    d(h, C, g);
}, dO = (g) => {
  Jb(g, fO), Jb(g, y1);
};
class pO {
  constructor() {
    this.buildables = /* @__PURE__ */ new Map();
  }
  register(d) {
    if (this.buildables.has(d))
      throw new Error(
        `A service identified as ${d.name} has been already registered. You need to unregister it before you can register it again.`
      );
    const h = oC.createBuildable(d);
    return this.buildables.set(d, h), h.instance;
  }
  unregister(d) {
    if (!this.buildables.has(d))
      throw new Error(`There is no service registered as ${d.name}.`);
    this.buildables.delete(d);
  }
  isRegistered(d) {
    return this.buildables.has(d);
  }
  registerAndUse(d) {
    return this.register(d).use(d);
  }
  build({ autowire: d = !0 } = {}) {
    const h = /* @__PURE__ */ new Map();
    for (const [C, w] of this.buildables) {
      const A = w.build({ autowire: d });
      h.set(C, A);
    }
    return dO(h), new uO(h);
  }
}
var e1 = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function vO(g) {
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
  (function(d) {
    var h = typeof globalThis == "object" ? globalThis : typeof e1 == "object" ? e1 : typeof self == "object" ? self : typeof this == "object" ? this : _(), C = w(g);
    typeof h.Reflect < "u" && (C = w(h.Reflect, C)), d(C, h), typeof h.Reflect > "u" && (h.Reflect = g);
    function w(Ce, ve) {
      return function(ne, _e) {
        Object.defineProperty(Ce, ne, { configurable: !0, writable: !0, value: _e }), ve && ve(ne, _e);
      };
    }
    function A() {
      try {
        return Function("return this;")();
      } catch {
      }
    }
    function P() {
      try {
        return (0, eval)("(function() { return this; })()");
      } catch {
      }
    }
    function _() {
      return A() || P();
    }
  })(function(d, h) {
    var C = Object.prototype.hasOwnProperty, w = typeof Symbol == "function", A = w && typeof Symbol.toPrimitive < "u" ? Symbol.toPrimitive : "@@toPrimitive", P = w && typeof Symbol.iterator < "u" ? Symbol.iterator : "@@iterator", _ = typeof Object.create == "function", Ce = { __proto__: [] } instanceof Array, ve = !_ && !Ce, ne = {
      // create an object in dictionary mode (a.k.a. "slow" mode in v8)
      create: _ ? function() {
        return yr(/* @__PURE__ */ Object.create(null));
      } : Ce ? function() {
        return yr({ __proto__: null });
      } : function() {
        return yr({});
      },
      has: ve ? function(z, D) {
        return C.call(z, D);
      } : function(z, D) {
        return D in z;
      },
      get: ve ? function(z, D) {
        return C.call(z, D) ? z[D] : void 0;
      } : function(z, D) {
        return z[D];
      }
    }, _e = Object.getPrototypeOf(Function), re = typeof Map == "function" && typeof Map.prototype.entries == "function" ? Map : mr(), Ne = typeof Set == "function" && typeof Set.prototype.entries == "function" ? Set : on(), ce = typeof WeakMap == "function" ? WeakMap : jr(), be = w ? Symbol.for("@reflect-metadata:registry") : void 0, ct = Ur(), Kt = cr(ct);
    function Ct(z, D, U, q) {
      if (ee(U)) {
        if (!qn(z))
          throw new TypeError();
        if (!tr(D))
          throw new TypeError();
        return xt(z, D);
      } else {
        if (!qn(z))
          throw new TypeError();
        if (!Ve(D))
          throw new TypeError();
        if (!Ve(q) && !ee(q) && !Ge(q))
          throw new TypeError();
        return Ge(q) && (q = void 0), U = Jt(U), nn(z, D, U, q);
      }
    }
    d("decorate", Ct);
    function Xe(z, D) {
      function U(q, he) {
        if (!Ve(q))
          throw new TypeError();
        if (!ee(he) && !Sn(he))
          throw new TypeError();
        K(z, D, q, he);
      }
      return U;
    }
    d("metadata", Xe);
    function Qe(z, D, U, q) {
      if (!Ve(U))
        throw new TypeError();
      return ee(q) || (q = Jt(q)), K(z, D, U, q);
    }
    d("defineMetadata", Qe);
    function Nt(z, D, U) {
      if (!Ve(D))
        throw new TypeError();
      return ee(U) || (U = Jt(U)), nt(z, D, U);
    }
    d("hasMetadata", Nt);
    function Le(z, D, U) {
      if (!Ve(D))
        throw new TypeError();
      return ee(U) || (U = Jt(U)), ft(z, D, U);
    }
    d("hasOwnMetadata", Le);
    function wt(z, D, U) {
      if (!Ve(D))
        throw new TypeError();
      return ee(U) || (U = Jt(U)), Dt(z, D, U);
    }
    d("getMetadata", wt);
    function ot(z, D, U) {
      if (!Ve(D))
        throw new TypeError();
      return ee(U) || (U = Jt(U)), vt(z, D, U);
    }
    d("getOwnMetadata", ot);
    function En(z, D) {
      if (!Ve(z))
        throw new TypeError();
      return ee(D) || (D = Jt(D)), ke(z, D);
    }
    d("getMetadataKeys", En);
    function gn(z, D) {
      if (!Ve(z))
        throw new TypeError();
      return ee(D) || (D = Jt(D)), O(z, D);
    }
    d("getOwnMetadataKeys", gn);
    function Zt(z, D, U) {
      if (!Ve(D))
        throw new TypeError();
      if (ee(U) || (U = Jt(U)), !Ve(D))
        throw new TypeError();
      ee(U) || (U = Jt(U));
      var q = Rn(
        D,
        U,
        /*Create*/
        !1
      );
      return ee(q) ? !1 : q.OrdinaryDeleteMetadata(z, D, U);
    }
    d("deleteMetadata", Zt);
    function xt(z, D) {
      for (var U = z.length - 1; U >= 0; --U) {
        var q = z[U], he = q(D);
        if (!ee(he) && !Ge(he)) {
          if (!tr(he))
            throw new TypeError();
          D = he;
        }
      }
      return D;
    }
    function nn(z, D, U, q) {
      for (var he = z.length - 1; he >= 0; --he) {
        var Ke = z[he], Et = Ke(D, U, q);
        if (!ee(Et) && !Ge(Et)) {
          if (!Ve(Et))
            throw new TypeError();
          q = Et;
        }
      }
      return q;
    }
    function nt(z, D, U) {
      var q = ft(z, D, U);
      if (q)
        return !0;
      var he = wn(D);
      return Ge(he) ? !1 : nt(z, he, U);
    }
    function ft(z, D, U) {
      var q = Rn(
        D,
        U,
        /*Create*/
        !1
      );
      return ee(q) ? !1 : yt(q.OrdinaryHasOwnMetadata(z, D, U));
    }
    function Dt(z, D, U) {
      var q = ft(z, D, U);
      if (q)
        return vt(z, D, U);
      var he = wn(D);
      if (!Ge(he))
        return Dt(z, he, U);
    }
    function vt(z, D, U) {
      var q = Rn(
        D,
        U,
        /*Create*/
        !1
      );
      if (!ee(q))
        return q.OrdinaryGetOwnMetadata(z, D, U);
    }
    function K(z, D, U, q) {
      var he = Rn(
        U,
        q,
        /*Create*/
        !0
      );
      he.OrdinaryDefineOwnMetadata(z, D, U, q);
    }
    function ke(z, D) {
      var U = O(z, D), q = wn(z);
      if (q === null)
        return U;
      var he = ke(q, D);
      if (he.length <= 0)
        return U;
      if (U.length <= 0)
        return he;
      for (var Ke = new Ne(), Et = [], Be = 0, fe = U; Be < fe.length; Be++) {
        var ue = fe[Be], ye = Ke.has(ue);
        ye || (Ke.add(ue), Et.push(ue));
      }
      for (var se = 0, Pe = he; se < Pe.length; se++) {
        var ue = Pe[se], ye = Ke.has(ue);
        ye || (Ke.add(ue), Et.push(ue));
      }
      return Et;
    }
    function O(z, D) {
      var U = Rn(
        z,
        D,
        /*create*/
        !1
      );
      return U ? U.OrdinaryOwnMetadataKeys(z, D) : [];
    }
    function J(z) {
      if (z === null)
        return 1;
      switch (typeof z) {
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
          return z === null ? 1 : 6;
        default:
          return 6;
      }
    }
    function ee(z) {
      return z === void 0;
    }
    function Ge(z) {
      return z === null;
    }
    function tt(z) {
      return typeof z == "symbol";
    }
    function Ve(z) {
      return typeof z == "object" ? z !== null : typeof z == "function";
    }
    function gt(z, D) {
      switch (J(z)) {
        case 0:
          return z;
        case 1:
          return z;
        case 2:
          return z;
        case 3:
          return z;
        case 4:
          return z;
        case 5:
          return z;
      }
      var U = D === 3 ? "string" : D === 5 ? "number" : "default", q = Mn(z, A);
      if (q !== void 0) {
        var he = q.call(z, U);
        if (Ve(he))
          throw new TypeError();
        return he;
      }
      return Rt(z, U === "default" ? "number" : U);
    }
    function Rt(z, D) {
      if (D === "string") {
        var U = z.toString;
        if (Fn(U)) {
          var q = U.call(z);
          if (!Ve(q))
            return q;
        }
        var he = z.valueOf;
        if (Fn(he)) {
          var q = he.call(z);
          if (!Ve(q))
            return q;
        }
      } else {
        var he = z.valueOf;
        if (Fn(he)) {
          var q = he.call(z);
          if (!Ve(q))
            return q;
        }
        var Ke = z.toString;
        if (Fn(Ke)) {
          var q = Ke.call(z);
          if (!Ve(q))
            return q;
        }
      }
      throw new TypeError();
    }
    function yt(z) {
      return !!z;
    }
    function rn(z) {
      return "" + z;
    }
    function Jt(z) {
      var D = gt(
        z,
        3
        /* String */
      );
      return tt(D) ? D : rn(D);
    }
    function qn(z) {
      return Array.isArray ? Array.isArray(z) : z instanceof Object ? z instanceof Array : Object.prototype.toString.call(z) === "[object Array]";
    }
    function Fn(z) {
      return typeof z == "function";
    }
    function tr(z) {
      return typeof z == "function";
    }
    function Sn(z) {
      switch (J(z)) {
        case 3:
          return !0;
        case 4:
          return !0;
        default:
          return !1;
      }
    }
    function Hn(z, D) {
      return z === D || z !== z && D !== D;
    }
    function Mn(z, D) {
      var U = z[D];
      if (U != null) {
        if (!Fn(U))
          throw new TypeError();
        return U;
      }
    }
    function _n(z) {
      var D = Mn(z, P);
      if (!Fn(D))
        throw new TypeError();
      var U = D.call(z);
      if (!Ve(U))
        throw new TypeError();
      return U;
    }
    function bn(z) {
      return z.value;
    }
    function sr(z) {
      var D = z.next();
      return D.done ? !1 : D;
    }
    function nr(z) {
      var D = z.return;
      D && D.call(z);
    }
    function wn(z) {
      var D = Object.getPrototypeOf(z);
      if (typeof z != "function" || z === _e || D !== _e)
        return D;
      var U = z.prototype, q = U && Object.getPrototypeOf(U);
      if (q == null || q === Object.prototype)
        return D;
      var he = q.constructor;
      return typeof he != "function" || he === z ? D : he;
    }
    function zr() {
      var z;
      !ee(be) && typeof h.Reflect < "u" && !(be in h.Reflect) && typeof h.Reflect.defineMetadata == "function" && (z = Pr(h.Reflect));
      var D, U, q, he = new ce(), Ke = {
        registerProvider: Et,
        getProvider: fe,
        setProvider: ye
      };
      return Ke;
      function Et(se) {
        if (!Object.isExtensible(Ke))
          throw new Error("Cannot add provider to a frozen registry.");
        switch (!0) {
          case z === se:
            break;
          case ee(D):
            D = se;
            break;
          case D === se:
            break;
          case ee(U):
            U = se;
            break;
          case U === se:
            break;
          default:
            q === void 0 && (q = new Ne()), q.add(se);
            break;
        }
      }
      function Be(se, Pe) {
        if (!ee(D)) {
          if (D.isProviderFor(se, Pe))
            return D;
          if (!ee(U)) {
            if (U.isProviderFor(se, Pe))
              return D;
            if (!ee(q))
              for (var Ot = _n(q); ; ) {
                var jt = sr(Ot);
                if (!jt)
                  return;
                var Xn = bn(jt);
                if (Xn.isProviderFor(se, Pe))
                  return nr(Ot), Xn;
              }
          }
        }
        if (!ee(z) && z.isProviderFor(se, Pe))
          return z;
      }
      function fe(se, Pe) {
        var Ot = he.get(se), jt;
        return ee(Ot) || (jt = Ot.get(Pe)), ee(jt) && (jt = Be(se, Pe), ee(jt) || (ee(Ot) && (Ot = new re(), he.set(se, Ot)), Ot.set(Pe, jt))), jt;
      }
      function ue(se) {
        if (ee(se))
          throw new TypeError();
        return D === se || U === se || !ee(q) && q.has(se);
      }
      function ye(se, Pe, Ot) {
        if (!ue(Ot))
          throw new Error("Metadata provider not registered.");
        var jt = fe(se, Pe);
        if (jt !== Ot) {
          if (!ee(jt))
            return !1;
          var Xn = he.get(se);
          ee(Xn) && (Xn = new re(), he.set(se, Xn)), Xn.set(Pe, Ot);
        }
        return !0;
      }
    }
    function Ur() {
      var z;
      return !ee(be) && Ve(h.Reflect) && Object.isExtensible(h.Reflect) && (z = h.Reflect[be]), ee(z) && (z = zr()), !ee(be) && Ve(h.Reflect) && Object.isExtensible(h.Reflect) && Object.defineProperty(h.Reflect, be, {
        enumerable: !1,
        configurable: !1,
        writable: !1,
        value: z
      }), z;
    }
    function cr(z) {
      var D = new ce(), U = {
        isProviderFor: function(ue, ye) {
          var se = D.get(ue);
          return ee(se) ? !1 : se.has(ye);
        },
        OrdinaryDefineOwnMetadata: Et,
        OrdinaryHasOwnMetadata: he,
        OrdinaryGetOwnMetadata: Ke,
        OrdinaryOwnMetadataKeys: Be,
        OrdinaryDeleteMetadata: fe
      };
      return ct.registerProvider(U), U;
      function q(ue, ye, se) {
        var Pe = D.get(ue), Ot = !1;
        if (ee(Pe)) {
          if (!se)
            return;
          Pe = new re(), D.set(ue, Pe), Ot = !0;
        }
        var jt = Pe.get(ye);
        if (ee(jt)) {
          if (!se)
            return;
          if (jt = new re(), Pe.set(ye, jt), !z.setProvider(ue, ye, U))
            throw Pe.delete(ye), Ot && D.delete(ue), new Error("Wrong provider for target.");
        }
        return jt;
      }
      function he(ue, ye, se) {
        var Pe = q(
          ye,
          se,
          /*Create*/
          !1
        );
        return ee(Pe) ? !1 : yt(Pe.has(ue));
      }
      function Ke(ue, ye, se) {
        var Pe = q(
          ye,
          se,
          /*Create*/
          !1
        );
        if (!ee(Pe))
          return Pe.get(ue);
      }
      function Et(ue, ye, se, Pe) {
        var Ot = q(
          se,
          Pe,
          /*Create*/
          !0
        );
        Ot.set(ue, ye);
      }
      function Be(ue, ye) {
        var se = [], Pe = q(
          ue,
          ye,
          /*Create*/
          !1
        );
        if (ee(Pe))
          return se;
        for (var Ot = Pe.keys(), jt = _n(Ot), Xn = 0; ; ) {
          var hi = sr(jt);
          if (!hi)
            return se.length = Xn, se;
          var Bi = bn(hi);
          try {
            se[Xn] = Bi;
          } catch (mi) {
            try {
              nr(jt);
            } finally {
              throw mi;
            }
          }
          Xn++;
        }
      }
      function fe(ue, ye, se) {
        var Pe = q(
          ye,
          se,
          /*Create*/
          !1
        );
        if (ee(Pe) || !Pe.delete(ue))
          return !1;
        if (Pe.size === 0) {
          var Ot = D.get(ye);
          ee(Ot) || (Ot.delete(se), Ot.size === 0 && D.delete(Ot));
        }
        return !0;
      }
    }
    function Pr(z) {
      var D = z.defineMetadata, U = z.hasOwnMetadata, q = z.getOwnMetadata, he = z.getOwnMetadataKeys, Ke = z.deleteMetadata, Et = new ce(), Be = {
        isProviderFor: function(fe, ue) {
          var ye = Et.get(fe);
          return ee(ye) ? he(fe, ue).length ? (ee(ye) && (ye = new Ne(), Et.set(fe, ye)), ye.add(ue), !0) : !1 : ye.has(ue);
        },
        OrdinaryDefineOwnMetadata: D,
        OrdinaryHasOwnMetadata: U,
        OrdinaryGetOwnMetadata: q,
        OrdinaryOwnMetadataKeys: he,
        OrdinaryDeleteMetadata: Ke
      };
      return Be;
    }
    function Rn(z, D, U) {
      var q = ct.getProvider(z, D);
      if (!ee(q))
        return q;
      if (U) {
        if (ct.setProvider(z, D, Kt))
          return Kt;
        throw new Error("Illegal state.");
      }
    }
    function mr() {
      var z = {}, D = [], U = (
        /** @class */
        function() {
          function Be(fe, ue, ye) {
            this._index = 0, this._keys = fe, this._values = ue, this._selector = ye;
          }
          return Be.prototype["@@iterator"] = function() {
            return this;
          }, Be.prototype[P] = function() {
            return this;
          }, Be.prototype.next = function() {
            var fe = this._index;
            if (fe >= 0 && fe < this._keys.length) {
              var ue = this._selector(this._keys[fe], this._values[fe]);
              return fe + 1 >= this._keys.length ? (this._index = -1, this._keys = D, this._values = D) : this._index++, { value: ue, done: !1 };
            }
            return { value: void 0, done: !0 };
          }, Be.prototype.throw = function(fe) {
            throw this._index >= 0 && (this._index = -1, this._keys = D, this._values = D), fe;
          }, Be.prototype.return = function(fe) {
            return this._index >= 0 && (this._index = -1, this._keys = D, this._values = D), { value: fe, done: !0 };
          }, Be;
        }()
      ), q = (
        /** @class */
        function() {
          function Be() {
            this._keys = [], this._values = [], this._cacheKey = z, this._cacheIndex = -2;
          }
          return Object.defineProperty(Be.prototype, "size", {
            get: function() {
              return this._keys.length;
            },
            enumerable: !0,
            configurable: !0
          }), Be.prototype.has = function(fe) {
            return this._find(
              fe,
              /*insert*/
              !1
            ) >= 0;
          }, Be.prototype.get = function(fe) {
            var ue = this._find(
              fe,
              /*insert*/
              !1
            );
            return ue >= 0 ? this._values[ue] : void 0;
          }, Be.prototype.set = function(fe, ue) {
            var ye = this._find(
              fe,
              /*insert*/
              !0
            );
            return this._values[ye] = ue, this;
          }, Be.prototype.delete = function(fe) {
            var ue = this._find(
              fe,
              /*insert*/
              !1
            );
            if (ue >= 0) {
              for (var ye = this._keys.length, se = ue + 1; se < ye; se++)
                this._keys[se - 1] = this._keys[se], this._values[se - 1] = this._values[se];
              return this._keys.length--, this._values.length--, Hn(fe, this._cacheKey) && (this._cacheKey = z, this._cacheIndex = -2), !0;
            }
            return !1;
          }, Be.prototype.clear = function() {
            this._keys.length = 0, this._values.length = 0, this._cacheKey = z, this._cacheIndex = -2;
          }, Be.prototype.keys = function() {
            return new U(this._keys, this._values, he);
          }, Be.prototype.values = function() {
            return new U(this._keys, this._values, Ke);
          }, Be.prototype.entries = function() {
            return new U(this._keys, this._values, Et);
          }, Be.prototype["@@iterator"] = function() {
            return this.entries();
          }, Be.prototype[P] = function() {
            return this.entries();
          }, Be.prototype._find = function(fe, ue) {
            if (!Hn(this._cacheKey, fe)) {
              this._cacheIndex = -1;
              for (var ye = 0; ye < this._keys.length; ye++)
                if (Hn(this._keys[ye], fe)) {
                  this._cacheIndex = ye;
                  break;
                }
            }
            return this._cacheIndex < 0 && ue && (this._cacheIndex = this._keys.length, this._keys.push(fe), this._values.push(void 0)), this._cacheIndex;
          }, Be;
        }()
      );
      return q;
      function he(Be, fe) {
        return Be;
      }
      function Ke(Be, fe) {
        return fe;
      }
      function Et(Be, fe) {
        return [Be, fe];
      }
    }
    function on() {
      var z = (
        /** @class */
        function() {
          function D() {
            this._map = new re();
          }
          return Object.defineProperty(D.prototype, "size", {
            get: function() {
              return this._map.size;
            },
            enumerable: !0,
            configurable: !0
          }), D.prototype.has = function(U) {
            return this._map.has(U);
          }, D.prototype.add = function(U) {
            return this._map.set(U, U), this;
          }, D.prototype.delete = function(U) {
            return this._map.delete(U);
          }, D.prototype.clear = function() {
            this._map.clear();
          }, D.prototype.keys = function() {
            return this._map.keys();
          }, D.prototype.values = function() {
            return this._map.keys();
          }, D.prototype.entries = function() {
            return this._map.entries();
          }, D.prototype["@@iterator"] = function() {
            return this.keys();
          }, D.prototype[P] = function() {
            return this.keys();
          }, D;
        }()
      );
      return z;
    }
    function jr() {
      var z = 16, D = ne.create(), U = q();
      return (
        /** @class */
        function() {
          function fe() {
            this._key = q();
          }
          return fe.prototype.has = function(ue) {
            var ye = he(
              ue,
              /*create*/
              !1
            );
            return ye !== void 0 ? ne.has(ye, this._key) : !1;
          }, fe.prototype.get = function(ue) {
            var ye = he(
              ue,
              /*create*/
              !1
            );
            return ye !== void 0 ? ne.get(ye, this._key) : void 0;
          }, fe.prototype.set = function(ue, ye) {
            var se = he(
              ue,
              /*create*/
              !0
            );
            return se[this._key] = ye, this;
          }, fe.prototype.delete = function(ue) {
            var ye = he(
              ue,
              /*create*/
              !1
            );
            return ye !== void 0 ? delete ye[this._key] : !1;
          }, fe.prototype.clear = function() {
            this._key = q();
          }, fe;
        }()
      );
      function q() {
        var fe;
        do
          fe = "@@WeakMap@@" + Be();
        while (ne.has(D, fe));
        return D[fe] = !0, fe;
      }
      function he(fe, ue) {
        if (!C.call(fe, U)) {
          if (!ue)
            return;
          Object.defineProperty(fe, U, { value: ne.create() });
        }
        return fe[U];
      }
      function Ke(fe, ue) {
        for (var ye = 0; ye < ue; ++ye)
          fe[ye] = Math.random() * 255 | 0;
        return fe;
      }
      function Et(fe) {
        return typeof Uint8Array == "function" ? typeof crypto < "u" ? crypto.getRandomValues(new Uint8Array(fe)) : typeof msCrypto < "u" ? msCrypto.getRandomValues(new Uint8Array(fe)) : Ke(new Uint8Array(fe), fe) : Ke(new Array(fe), fe);
      }
      function Be() {
        var fe = Et(z);
        fe[6] = fe[6] & 79 | 64, fe[8] = fe[8] & 191 | 128;
        for (var ue = "", ye = 0; ye < z; ++ye) {
          var se = fe[ye];
          (ye === 4 || ye === 6 || ye === 8) && (ue += "-"), se < 16 && (ue += "0"), ue += se.toString(16).toLowerCase();
        }
        return ue;
      }
    }
    function yr(z) {
      return z.__ = void 0, delete z.__, z;
    }
  });
})(t1 || (t1 = {}));
class jn {
  static _instance;
  _builder;
  _container;
  constructor() {
    this._builder = new pO();
  }
  static get instance() {
    return (this._instance == null || this._instance == null) && (this._instance = new jn()), this._instance;
  }
  static addTransient(d, h) {
    return this.instance.addTransient(d, h);
  }
  static addScoped(d, h) {
    return this.instance.addScoped(d, h);
  }
  static addSingleton(d, h) {
    return this.instance.addSingleton(d, h);
  }
  static build() {
    this.instance.build();
  }
  addTransient(d, h) {
    if (this.isInitialized())
      throw Error("The inyector is already initialized.");
    return this.register(d, h).asTransient(), this;
  }
  addScoped(d, h) {
    if (this.isInitialized())
      throw Error("The inyector is already initialized.");
    return this.register(d, h).asInstancePerRequest(), this;
  }
  addSingleton(d, h) {
    if (this.isInitialized())
      throw Error("The inyector is already initialized.");
    return this.register(d, h).asSingleton(), this;
  }
  build() {
    if (this.isInitialized())
      throw Error("The inyector is already initialized.");
    this._container = this._builder.build();
  }
  static get(d) {
    return this._instance.get(d);
  }
  get(d) {
    if (!this.isInitialized())
      throw Error("The inyector is not initialized.");
    return this._container.get(d);
  }
  register(d, h) {
    return h == null ? this._builder.registerAndUse(d) : this._builder.register(h).use(d);
  }
  isInitialized() {
    return !(this._container == null || this._container == null);
  }
}
var hO = Object.defineProperty, mO = Object.getOwnPropertyDescriptor, yO = (g, d, h, C) => {
  for (var w = C > 1 ? void 0 : C ? mO(d, h) : d, A = g.length - 1, P; A >= 0; A--)
    (P = g[A]) && (w = (C ? P(d, h, w) : P(w)) || w);
  return C && w && hO(d, h, w), w;
};
let sv = class {
  _show = !1;
  logRed(g, ...d) {
    this.log("\x1B[31m%s\x1B[0m", g, ...d);
  }
  logGreen(g, ...d) {
    this.log("\x1B[32m%s\x1B[0m", g, ...d);
  }
  logYellow(g, ...d) {
    this.log("\x1B[33m%s\x1B[0m", g, ...d);
  }
  logBlue(g, ...d) {
    this.log("\x1B[34m%s\x1B[0m", g, ...d);
  }
  logMagenta(g, ...d) {
    this.log("\x1B[35m%s\x1B[0m", g, ...d);
  }
  logCyan(g, ...d) {
    this.log("\x1B[36m%s\x1B[0m", g, ...d);
  }
  logWhite(g, ...d) {
    this.log("\x1B[97m%s\x1B[0m", g, ...d);
  }
  logGray(g, ...d) {
    this.log("\x1B[37m%s\x1B[0m", g, ...d);
  }
  logEvent(g, ...d) {
    this.logGreen(g, d);
  }
  logValidation(g, ...d) {
    this.log("\x1B[92m%s\x1B[0m", g, ...d);
  }
  logInfo(g, ...d) {
    this.log("\x1B[34m%s\x1B[0m", g, ...d);
  }
  logError(g, ...d) {
    this.log("\x1B[31m%s\x1B[0m", g, ...d);
  }
  showLogs(g) {
    this._show = g;
  }
  log(g = "\x1B[31m%s\x1B[0m", d, ...h) {
    this._show && console.info(g, d, ...h);
  }
};
sv = yO([
  vi()
], sv);
var gO = Object.defineProperty, SO = Object.getOwnPropertyDescriptor, CO = (g, d, h, C) => {
  for (var w = C > 1 ? void 0 : C ? SO(d, h) : d, A = g.length - 1, P; A >= 0; A--)
    (P = g[A]) && (w = (C ? P(d, h, w) : P(w)) || w);
  return C && w && gO(d, h, w), w;
};
let n1 = class extends sv {
  log_OnInit(g, ...d) {
    this.logMagenta(g, d);
  }
  log_OnDestroy(g, ...d) {
    this.logYellow(g, d);
  }
  log_OnChange(g, ...d) {
    this.logBlue(g, d);
  }
  log_Render(g, ...d) {
    this.logCyan(g, d);
  }
};
n1 = CO([
  vi()
], n1);
class od {
  _id;
  get id() {
    return this._id;
  }
  constructor(d) {
    this._id = d;
  }
  equals(d) {
    return d == null ? !1 : this === d ? !0 : d instanceof this.constructor ? this.id.equals(d.id) : !1;
  }
  clone() {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}
class Hi {
  _value;
  constructor(d) {
    this._value = d;
  }
  static newGuid() {
    return new Hi(crypto.randomUUID());
  }
  static parse(d) {
    if (!d)
      throw new Error("Invalid guid");
    if (d.length !== 36)
      throw new Error("Invalid guid");
    if (d[8] !== "-" || d[13] !== "-" || d[18] !== "-" || d[23] !== "-")
      throw new Error("Invalid guid");
    return new Hi(d);
  }
  toString() {
    return this._value;
  }
  equals(d) {
    return d == null ? !1 : this._value === d._value;
  }
}
class qo {
  _entities;
  constructor() {
    this._entities = /* @__PURE__ */ new Map();
  }
  static create() {
    return new qo();
  }
  static createFrom(d) {
    const h = new qo();
    return d.forEach((C) => {
      h.set(C);
    }), h;
  }
  contains(d) {
    return this._entities.has(d.toString());
  }
  getAll() {
    return Array.from(this._entities.values()).map((d) => d.clone());
  }
  getFirst() {
    const d = this._entities.values().next().value;
    return d ? d.clone() : null;
  }
  getById(d) {
    const h = this._entities.get(d.toString());
    return h ? h.clone() : null;
  }
  getByIdOrThrow(d) {
    const h = this._entities.get(d.toString());
    if (!h)
      throw new Error(`Entity with id ${d} not found`);
    return h.clone();
  }
  find(d) {
    const h = Array.from(this._entities.values()).find(d);
    return h ? h.clone() : null;
  }
  findOrThrow(d) {
    const h = Array.from(this._entities.values()).find(d);
    if (!h)
      throw new Error("Entity not found");
    return h.clone();
  }
  filter(d) {
    return Array.from(this._entities.values()).filter(d).map((C) => C.clone());
  }
  set(d) {
    const h = this._entities.get(d.id.toString());
    return this._entities.set(d.id.toString(), d), !h;
  }
  setAll(d) {
    d.forEach((h) => {
      this.set(h);
    });
  }
  remove(d) {
    return this._entities.get(d.toString()) ? (this._entities.delete(d.toString()), !0) : !1;
  }
  clear() {
    this._entities.clear();
  }
  get size() {
    return this._entities.size;
  }
}
class EO {
  name;
  static create;
}
class dv extends EO {
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
  constructor(d) {
    super(), this._id = Hi.newGuid(), this._occurredOn = /* @__PURE__ */ new Date(), this._payload = d;
  }
}
class uC {
  _handler;
  get handler() {
    return this._handler;
  }
  _unsubscribeHandler;
  _hasUnsubscribed = !1;
  constructor(d, h) {
    this._handler = d, this._unsubscribeHandler = h;
  }
  static create(d, h) {
    return new uC(d, h);
  }
  unsubscribe() {
    this._hasUnsubscribed || (this._unsubscribeHandler(), this._hasUnsubscribed = !0);
  }
  invoke(d) {
    this._handler(d);
  }
}
class sC {
  _subscriptions;
  constructor() {
    this._subscriptions = [];
  }
  publish(d) {
    for (const h of this._subscriptions)
      h.invoke(d);
  }
  subscribe(d, h) {
    const C = (A) => A instanceof d, w = uC.create((A) => {
      C(A) && h(A);
    }, this.unsubscribe.bind(this, h));
    return this._subscriptions.push(w), w;
  }
  subscribeTo(d, h, C) {
    const w = (A) => typeof h == "string" ? A.payload === h : typeof h == "object" ? Object.hasOwn(h, A.payload) : A.payload instanceof h;
    return this.subscribe(d, (A) => {
      w(A) && C(A);
    });
  }
  subscribeToKeys(d, h, C, w) {
    const A = (P) => Object.entries(C).every(
      (_) => P.payload.hasOwnProperty(_[0]) && P.payload[_[0]] === C.get(_[0])
    );
    return this.subscribeTo(d, h, (P) => {
      A(P) && w(P);
    });
  }
  unsubscribe(d) {
    this._subscriptions = this._subscriptions.filter((h) => h.handler !== d);
  }
}
class _O {
}
class cC extends sC {
  static create() {
    return new cC();
  }
}
class Ec extends dv {
  static create(d) {
    return new Ec(d);
  }
}
var bO = Object.defineProperty, wO = Object.getOwnPropertyDescriptor, RO = (g, d, h, C) => {
  for (var w = C > 1 ? void 0 : C ? wO(d, h) : d, A = g.length - 1, P; A >= 0; A--)
    (P = g[A]) && (w = (C ? P(d, h, w) : P(w)) || w);
  return C && w && bO(d, h, w), w;
};
let X0 = class {
  constructor(g) {
    this._logger = g, this._entities = /* @__PURE__ */ new Map(), this._singlesEntities = /* @__PURE__ */ new Map(), this._eventBus = cC.create();
  }
  _entities;
  _singlesEntities;
  _eventBus;
  subscribe(g, d) {
    return this._eventBus.subscribe(g, d);
  }
  subscribeTo(g, d, h) {
    return this._eventBus.subscribeTo(g, d, h);
  }
  subscribeToKeys(g, d, h, C) {
    return this._eventBus.subscribeToKeys(g, d, h, C);
  }
  set(g, d) {
    let h = d?.name ?? g.constructor.name;
    this._entities.has(h) || this._entities.set(h, /* @__PURE__ */ new Map()), this._entities.get(h).set(g.id, g.clone());
    const C = Ec.create(g.clone());
    this._eventBus.publish(C), this._logger.logCyan("State updated (Set):", h, g);
  }
  setSingle(g, d) {
    const h = d?.name ?? g.constructor.name;
    this._singlesEntities.set(h, g.clone());
    const C = Ec.create(g.clone());
    this._eventBus.publish(C), this._logger.logCyan("State updated (SetSingle)", h, g);
  }
  get(g) {
    return this._singlesEntities.get(g.name)?.clone();
  }
  getOrThrow(g) {
    let d = this.get(g);
    if (!d)
      throw new Error(`${g.name} not found`);
    return d.clone();
  }
  getById(g, d) {
    return this._entities.get(g.name)?.get(d)?.clone();
  }
  getByIdOrThrow(g, d) {
    let h = this.getById(g, d);
    if (!h)
      throw new Error(`${g.name} not found`);
    return h.clone();
  }
  getAll(g) {
    if (!this._entities.has(g.name))
      return [];
    let d = [];
    for (let h of this._entities.get(g.name).values())
      d.push(h.clone());
    return d;
  }
  remove(g, d) {
    this._entities.has(g.name) && this._entities.get(g.name).delete(d);
  }
  find(g, d) {
    if (this._entities.has(g.name)) {
      for (let h of this._entities.get(g.name).values())
        if (d(h))
          return h.clone();
    }
  }
  findOrThrow(g, d) {
    let h = this.find(g, d);
    if (!h)
      throw new Error(`${g.name} not found`);
    return h.clone();
  }
  filter(g, d) {
    if (!this._entities.has(g.name))
      return [];
    let h = [];
    for (let C of this._entities.get(g.name).values())
      d(C) && h.push(C.clone());
    return h;
  }
  filterOrThrow(g, d) {
    let h = this.filter(g, d);
    if (h.length === 0)
      throw new Error(`${g.name} not found`);
    return h;
  }
};
X0 = RO([
  vi()
], X0);
var TO = Object.defineProperty, xO = Object.getOwnPropertyDescriptor, DO = (g, d, h, C) => {
  for (var w = C > 1 ? void 0 : C ? xO(d, h) : d, A = g.length - 1, P; A >= 0; A--)
    (P = g[A]) && (w = (C ? P(d, h, w) : P(w)) || w);
  return C && w && TO(d, h, w), w;
};
let _c = class {
  _animationsVelocity = 1;
  constructor() {
    this.setVelocity(this._animationsVelocity);
  }
  static create() {
    return new _c();
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
    const d = getComputedStyle(g).animationDuration;
    return d ? parseFloat(d.substring(0, d.length)) : void 0;
  }
};
_c = DO([
  vi()
], _c);
class OO extends X0 {
}
var K0 = { exports: {} }, lv = {}, ly = { exports: {} }, Pt = {};
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
function kO() {
  if (r1)
    return Pt;
  r1 = 1;
  var g = Symbol.for("react.element"), d = Symbol.for("react.portal"), h = Symbol.for("react.fragment"), C = Symbol.for("react.strict_mode"), w = Symbol.for("react.profiler"), A = Symbol.for("react.provider"), P = Symbol.for("react.context"), _ = Symbol.for("react.forward_ref"), Ce = Symbol.for("react.suspense"), ve = Symbol.for("react.memo"), ne = Symbol.for("react.lazy"), _e = Symbol.iterator;
  function re(O) {
    return O === null || typeof O != "object" ? null : (O = _e && O[_e] || O["@@iterator"], typeof O == "function" ? O : null);
  }
  var Ne = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, ce = Object.assign, be = {};
  function ct(O, J, ee) {
    this.props = O, this.context = J, this.refs = be, this.updater = ee || Ne;
  }
  ct.prototype.isReactComponent = {}, ct.prototype.setState = function(O, J) {
    if (typeof O != "object" && typeof O != "function" && O != null)
      throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, O, J, "setState");
  }, ct.prototype.forceUpdate = function(O) {
    this.updater.enqueueForceUpdate(this, O, "forceUpdate");
  };
  function Kt() {
  }
  Kt.prototype = ct.prototype;
  function Ct(O, J, ee) {
    this.props = O, this.context = J, this.refs = be, this.updater = ee || Ne;
  }
  var Xe = Ct.prototype = new Kt();
  Xe.constructor = Ct, ce(Xe, ct.prototype), Xe.isPureReactComponent = !0;
  var Qe = Array.isArray, Nt = Object.prototype.hasOwnProperty, Le = { current: null }, wt = { key: !0, ref: !0, __self: !0, __source: !0 };
  function ot(O, J, ee) {
    var Ge, tt = {}, Ve = null, gt = null;
    if (J != null)
      for (Ge in J.ref !== void 0 && (gt = J.ref), J.key !== void 0 && (Ve = "" + J.key), J)
        Nt.call(J, Ge) && !wt.hasOwnProperty(Ge) && (tt[Ge] = J[Ge]);
    var Rt = arguments.length - 2;
    if (Rt === 1)
      tt.children = ee;
    else if (1 < Rt) {
      for (var yt = Array(Rt), rn = 0; rn < Rt; rn++)
        yt[rn] = arguments[rn + 2];
      tt.children = yt;
    }
    if (O && O.defaultProps)
      for (Ge in Rt = O.defaultProps, Rt)
        tt[Ge] === void 0 && (tt[Ge] = Rt[Ge]);
    return { $$typeof: g, type: O, key: Ve, ref: gt, props: tt, _owner: Le.current };
  }
  function En(O, J) {
    return { $$typeof: g, type: O.type, key: J, ref: O.ref, props: O.props, _owner: O._owner };
  }
  function gn(O) {
    return typeof O == "object" && O !== null && O.$$typeof === g;
  }
  function Zt(O) {
    var J = { "=": "=0", ":": "=2" };
    return "$" + O.replace(/[=:]/g, function(ee) {
      return J[ee];
    });
  }
  var xt = /\/+/g;
  function nn(O, J) {
    return typeof O == "object" && O !== null && O.key != null ? Zt("" + O.key) : J.toString(36);
  }
  function nt(O, J, ee, Ge, tt) {
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
            case d:
              gt = !0;
          }
      }
    if (gt)
      return gt = O, tt = tt(gt), O = Ge === "" ? "." + nn(gt, 0) : Ge, Qe(tt) ? (ee = "", O != null && (ee = O.replace(xt, "$&/") + "/"), nt(tt, J, ee, "", function(rn) {
        return rn;
      })) : tt != null && (gn(tt) && (tt = En(tt, ee + (!tt.key || gt && gt.key === tt.key ? "" : ("" + tt.key).replace(xt, "$&/") + "/") + O)), J.push(tt)), 1;
    if (gt = 0, Ge = Ge === "" ? "." : Ge + ":", Qe(O))
      for (var Rt = 0; Rt < O.length; Rt++) {
        Ve = O[Rt];
        var yt = Ge + nn(Ve, Rt);
        gt += nt(Ve, J, ee, yt, tt);
      }
    else if (yt = re(O), typeof yt == "function")
      for (O = yt.call(O), Rt = 0; !(Ve = O.next()).done; )
        Ve = Ve.value, yt = Ge + nn(Ve, Rt++), gt += nt(Ve, J, ee, yt, tt);
    else if (Ve === "object")
      throw J = String(O), Error("Objects are not valid as a React child (found: " + (J === "[object Object]" ? "object with keys {" + Object.keys(O).join(", ") + "}" : J) + "). If you meant to render a collection of children, use an array instead.");
    return gt;
  }
  function ft(O, J, ee) {
    if (O == null)
      return O;
    var Ge = [], tt = 0;
    return nt(O, Ge, "", "", function(Ve) {
      return J.call(ee, Ve, tt++);
    }), Ge;
  }
  function Dt(O) {
    if (O._status === -1) {
      var J = O._result;
      J = J(), J.then(function(ee) {
        (O._status === 0 || O._status === -1) && (O._status = 1, O._result = ee);
      }, function(ee) {
        (O._status === 0 || O._status === -1) && (O._status = 2, O._result = ee);
      }), O._status === -1 && (O._status = 0, O._result = J);
    }
    if (O._status === 1)
      return O._result.default;
    throw O._result;
  }
  var vt = { current: null }, K = { transition: null }, ke = { ReactCurrentDispatcher: vt, ReactCurrentBatchConfig: K, ReactCurrentOwner: Le };
  return Pt.Children = { map: ft, forEach: function(O, J, ee) {
    ft(O, function() {
      J.apply(this, arguments);
    }, ee);
  }, count: function(O) {
    var J = 0;
    return ft(O, function() {
      J++;
    }), J;
  }, toArray: function(O) {
    return ft(O, function(J) {
      return J;
    }) || [];
  }, only: function(O) {
    if (!gn(O))
      throw Error("React.Children.only expected to receive a single React element child.");
    return O;
  } }, Pt.Component = ct, Pt.Fragment = h, Pt.Profiler = w, Pt.PureComponent = Ct, Pt.StrictMode = C, Pt.Suspense = Ce, Pt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ke, Pt.cloneElement = function(O, J, ee) {
    if (O == null)
      throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + O + ".");
    var Ge = ce({}, O.props), tt = O.key, Ve = O.ref, gt = O._owner;
    if (J != null) {
      if (J.ref !== void 0 && (Ve = J.ref, gt = Le.current), J.key !== void 0 && (tt = "" + J.key), O.type && O.type.defaultProps)
        var Rt = O.type.defaultProps;
      for (yt in J)
        Nt.call(J, yt) && !wt.hasOwnProperty(yt) && (Ge[yt] = J[yt] === void 0 && Rt !== void 0 ? Rt[yt] : J[yt]);
    }
    var yt = arguments.length - 2;
    if (yt === 1)
      Ge.children = ee;
    else if (1 < yt) {
      Rt = Array(yt);
      for (var rn = 0; rn < yt; rn++)
        Rt[rn] = arguments[rn + 2];
      Ge.children = Rt;
    }
    return { $$typeof: g, type: O.type, key: tt, ref: Ve, props: Ge, _owner: gt };
  }, Pt.createContext = function(O) {
    return O = { $$typeof: P, _currentValue: O, _currentValue2: O, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, O.Provider = { $$typeof: A, _context: O }, O.Consumer = O;
  }, Pt.createElement = ot, Pt.createFactory = function(O) {
    var J = ot.bind(null, O);
    return J.type = O, J;
  }, Pt.createRef = function() {
    return { current: null };
  }, Pt.forwardRef = function(O) {
    return { $$typeof: _, render: O };
  }, Pt.isValidElement = gn, Pt.lazy = function(O) {
    return { $$typeof: ne, _payload: { _status: -1, _result: O }, _init: Dt };
  }, Pt.memo = function(O, J) {
    return { $$typeof: ve, type: O, compare: J === void 0 ? null : J };
  }, Pt.startTransition = function(O) {
    var J = K.transition;
    K.transition = {};
    try {
      O();
    } finally {
      K.transition = J;
    }
  }, Pt.unstable_act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  }, Pt.useCallback = function(O, J) {
    return vt.current.useCallback(O, J);
  }, Pt.useContext = function(O) {
    return vt.current.useContext(O);
  }, Pt.useDebugValue = function() {
  }, Pt.useDeferredValue = function(O) {
    return vt.current.useDeferredValue(O);
  }, Pt.useEffect = function(O, J) {
    return vt.current.useEffect(O, J);
  }, Pt.useId = function() {
    return vt.current.useId();
  }, Pt.useImperativeHandle = function(O, J, ee) {
    return vt.current.useImperativeHandle(O, J, ee);
  }, Pt.useInsertionEffect = function(O, J) {
    return vt.current.useInsertionEffect(O, J);
  }, Pt.useLayoutEffect = function(O, J) {
    return vt.current.useLayoutEffect(O, J);
  }, Pt.useMemo = function(O, J) {
    return vt.current.useMemo(O, J);
  }, Pt.useReducer = function(O, J, ee) {
    return vt.current.useReducer(O, J, ee);
  }, Pt.useRef = function(O) {
    return vt.current.useRef(O);
  }, Pt.useState = function(O) {
    return vt.current.useState(O);
  }, Pt.useSyncExternalStore = function(O, J, ee) {
    return vt.current.useSyncExternalStore(O, J, ee);
  }, Pt.useTransition = function() {
    return vt.current.useTransition();
  }, Pt.version = "18.2.0", Pt;
}
var uv = { exports: {} };
uv.exports;
var a1;
function MO() {
  return a1 || (a1 = 1, function(g, d) {
    var h = {};
    /**
     * @license React
     * react.development.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    h.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var C = "18.2.0", w = Symbol.for("react.element"), A = Symbol.for("react.portal"), P = Symbol.for("react.fragment"), _ = Symbol.for("react.strict_mode"), Ce = Symbol.for("react.profiler"), ve = Symbol.for("react.provider"), ne = Symbol.for("react.context"), _e = Symbol.for("react.forward_ref"), re = Symbol.for("react.suspense"), Ne = Symbol.for("react.suspense_list"), ce = Symbol.for("react.memo"), be = Symbol.for("react.lazy"), ct = Symbol.for("react.offscreen"), Kt = Symbol.iterator, Ct = "@@iterator";
      function Xe(y) {
        if (y === null || typeof y != "object")
          return null;
        var T = Kt && y[Kt] || y[Ct];
        return typeof T == "function" ? T : null;
      }
      var Qe = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, Nt = {
        transition: null
      }, Le = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, wt = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, ot = {}, En = null;
      function gn(y) {
        En = y;
      }
      ot.setExtraStackFrame = function(y) {
        En = y;
      }, ot.getCurrentStack = null, ot.getStackAddendum = function() {
        var y = "";
        En && (y += En);
        var T = ot.getCurrentStack;
        return T && (y += T() || ""), y;
      };
      var Zt = !1, xt = !1, nn = !1, nt = !1, ft = !1, Dt = {
        ReactCurrentDispatcher: Qe,
        ReactCurrentBatchConfig: Nt,
        ReactCurrentOwner: wt
      };
      Dt.ReactDebugCurrentFrame = ot, Dt.ReactCurrentActQueue = Le;
      function vt(y) {
        {
          for (var T = arguments.length, V = new Array(T > 1 ? T - 1 : 0), W = 1; W < T; W++)
            V[W - 1] = arguments[W];
          ke("warn", y, V);
        }
      }
      function K(y) {
        {
          for (var T = arguments.length, V = new Array(T > 1 ? T - 1 : 0), W = 1; W < T; W++)
            V[W - 1] = arguments[W];
          ke("error", y, V);
        }
      }
      function ke(y, T, V) {
        {
          var W = Dt.ReactDebugCurrentFrame, de = W.getStackAddendum();
          de !== "" && (T += "%s", V = V.concat([de]));
          var je = V.map(function(xe) {
            return String(xe);
          });
          je.unshift("Warning: " + T), Function.prototype.apply.call(console[y], console, je);
        }
      }
      var O = {};
      function J(y, T) {
        {
          var V = y.constructor, W = V && (V.displayName || V.name) || "ReactClass", de = W + "." + T;
          if (O[de])
            return;
          K("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", T, W), O[de] = !0;
        }
      }
      var ee = {
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
        enqueueForceUpdate: function(y, T, V) {
          J(y, "forceUpdate");
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
        enqueueReplaceState: function(y, T, V, W) {
          J(y, "replaceState");
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
        enqueueSetState: function(y, T, V, W) {
          J(y, "setState");
        }
      }, Ge = Object.assign, tt = {};
      Object.freeze(tt);
      function Ve(y, T, V) {
        this.props = y, this.context = T, this.refs = tt, this.updater = V || ee;
      }
      Ve.prototype.isReactComponent = {}, Ve.prototype.setState = function(y, T) {
        if (typeof y != "object" && typeof y != "function" && y != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, y, T, "setState");
      }, Ve.prototype.forceUpdate = function(y) {
        this.updater.enqueueForceUpdate(this, y, "forceUpdate");
      };
      {
        var gt = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, Rt = function(y, T) {
          Object.defineProperty(Ve.prototype, y, {
            get: function() {
              vt("%s(...) is deprecated in plain JavaScript React classes. %s", T[0], T[1]);
            }
          });
        };
        for (var yt in gt)
          gt.hasOwnProperty(yt) && Rt(yt, gt[yt]);
      }
      function rn() {
      }
      rn.prototype = Ve.prototype;
      function Jt(y, T, V) {
        this.props = y, this.context = T, this.refs = tt, this.updater = V || ee;
      }
      var qn = Jt.prototype = new rn();
      qn.constructor = Jt, Ge(qn, Ve.prototype), qn.isPureReactComponent = !0;
      function Fn() {
        var y = {
          current: null
        };
        return Object.seal(y), y;
      }
      var tr = Array.isArray;
      function Sn(y) {
        return tr(y);
      }
      function Hn(y) {
        {
          var T = typeof Symbol == "function" && Symbol.toStringTag, V = T && y[Symbol.toStringTag] || y.constructor.name || "Object";
          return V;
        }
      }
      function Mn(y) {
        try {
          return _n(y), !1;
        } catch {
          return !0;
        }
      }
      function _n(y) {
        return "" + y;
      }
      function bn(y) {
        if (Mn(y))
          return K("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Hn(y)), _n(y);
      }
      function sr(y, T, V) {
        var W = y.displayName;
        if (W)
          return W;
        var de = T.displayName || T.name || "";
        return de !== "" ? V + "(" + de + ")" : V;
      }
      function nr(y) {
        return y.displayName || "Context";
      }
      function wn(y) {
        if (y == null)
          return null;
        if (typeof y.tag == "number" && K("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof y == "function")
          return y.displayName || y.name || null;
        if (typeof y == "string")
          return y;
        switch (y) {
          case P:
            return "Fragment";
          case A:
            return "Portal";
          case Ce:
            return "Profiler";
          case _:
            return "StrictMode";
          case re:
            return "Suspense";
          case Ne:
            return "SuspenseList";
        }
        if (typeof y == "object")
          switch (y.$$typeof) {
            case ne:
              var T = y;
              return nr(T) + ".Consumer";
            case ve:
              var V = y;
              return nr(V._context) + ".Provider";
            case _e:
              return sr(y, y.render, "ForwardRef");
            case ce:
              var W = y.displayName || null;
              return W !== null ? W : wn(y.type) || "Memo";
            case be: {
              var de = y, je = de._payload, xe = de._init;
              try {
                return wn(xe(je));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var zr = Object.prototype.hasOwnProperty, Ur = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, cr, Pr, Rn;
      Rn = {};
      function mr(y) {
        if (zr.call(y, "ref")) {
          var T = Object.getOwnPropertyDescriptor(y, "ref").get;
          if (T && T.isReactWarning)
            return !1;
        }
        return y.ref !== void 0;
      }
      function on(y) {
        if (zr.call(y, "key")) {
          var T = Object.getOwnPropertyDescriptor(y, "key").get;
          if (T && T.isReactWarning)
            return !1;
        }
        return y.key !== void 0;
      }
      function jr(y, T) {
        var V = function() {
          cr || (cr = !0, K("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", T));
        };
        V.isReactWarning = !0, Object.defineProperty(y, "key", {
          get: V,
          configurable: !0
        });
      }
      function yr(y, T) {
        var V = function() {
          Pr || (Pr = !0, K("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", T));
        };
        V.isReactWarning = !0, Object.defineProperty(y, "ref", {
          get: V,
          configurable: !0
        });
      }
      function z(y) {
        if (typeof y.ref == "string" && wt.current && y.__self && wt.current.stateNode !== y.__self) {
          var T = wn(wt.current.type);
          Rn[T] || (K('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', T, y.ref), Rn[T] = !0);
        }
      }
      var D = function(y, T, V, W, de, je, xe) {
        var lt = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: w,
          // Built-in properties that belong on the element
          type: y,
          key: T,
          ref: V,
          props: xe,
          // Record the component responsible for creating this element.
          _owner: je
        };
        return lt._store = {}, Object.defineProperty(lt._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(lt, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: W
        }), Object.defineProperty(lt, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: de
        }), Object.freeze && (Object.freeze(lt.props), Object.freeze(lt)), lt;
      };
      function U(y, T, V) {
        var W, de = {}, je = null, xe = null, lt = null, bt = null;
        if (T != null) {
          mr(T) && (xe = T.ref, z(T)), on(T) && (bn(T.key), je = "" + T.key), lt = T.__self === void 0 ? null : T.__self, bt = T.__source === void 0 ? null : T.__source;
          for (W in T)
            zr.call(T, W) && !Ur.hasOwnProperty(W) && (de[W] = T[W]);
        }
        var Wt = arguments.length - 2;
        if (Wt === 1)
          de.children = V;
        else if (Wt > 1) {
          for (var Qt = Array(Wt), qt = 0; qt < Wt; qt++)
            Qt[qt] = arguments[qt + 2];
          Object.freeze && Object.freeze(Qt), de.children = Qt;
        }
        if (y && y.defaultProps) {
          var Xt = y.defaultProps;
          for (W in Xt)
            de[W] === void 0 && (de[W] = Xt[W]);
        }
        if (je || xe) {
          var vn = typeof y == "function" ? y.displayName || y.name || "Unknown" : y;
          je && jr(de, vn), xe && yr(de, vn);
        }
        return D(y, je, xe, lt, bt, wt.current, de);
      }
      function q(y, T) {
        var V = D(y.type, T, y.ref, y._self, y._source, y._owner, y.props);
        return V;
      }
      function he(y, T, V) {
        if (y == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + y + ".");
        var W, de = Ge({}, y.props), je = y.key, xe = y.ref, lt = y._self, bt = y._source, Wt = y._owner;
        if (T != null) {
          mr(T) && (xe = T.ref, Wt = wt.current), on(T) && (bn(T.key), je = "" + T.key);
          var Qt;
          y.type && y.type.defaultProps && (Qt = y.type.defaultProps);
          for (W in T)
            zr.call(T, W) && !Ur.hasOwnProperty(W) && (T[W] === void 0 && Qt !== void 0 ? de[W] = Qt[W] : de[W] = T[W]);
        }
        var qt = arguments.length - 2;
        if (qt === 1)
          de.children = V;
        else if (qt > 1) {
          for (var Xt = Array(qt), vn = 0; vn < qt; vn++)
            Xt[vn] = arguments[vn + 2];
          de.children = Xt;
        }
        return D(y.type, je, xe, lt, bt, Wt, de);
      }
      function Ke(y) {
        return typeof y == "object" && y !== null && y.$$typeof === w;
      }
      var Et = ".", Be = ":";
      function fe(y) {
        var T = /[=:]/g, V = {
          "=": "=0",
          ":": "=2"
        }, W = y.replace(T, function(de) {
          return V[de];
        });
        return "$" + W;
      }
      var ue = !1, ye = /\/+/g;
      function se(y) {
        return y.replace(ye, "$&/");
      }
      function Pe(y, T) {
        return typeof y == "object" && y !== null && y.key != null ? (bn(y.key), fe("" + y.key)) : T.toString(36);
      }
      function Ot(y, T, V, W, de) {
        var je = typeof y;
        (je === "undefined" || je === "boolean") && (y = null);
        var xe = !1;
        if (y === null)
          xe = !0;
        else
          switch (je) {
            case "string":
            case "number":
              xe = !0;
              break;
            case "object":
              switch (y.$$typeof) {
                case w:
                case A:
                  xe = !0;
              }
          }
        if (xe) {
          var lt = y, bt = de(lt), Wt = W === "" ? Et + Pe(lt, 0) : W;
          if (Sn(bt)) {
            var Qt = "";
            Wt != null && (Qt = se(Wt) + "/"), Ot(bt, T, Qt, "", function(sd) {
              return sd;
            });
          } else
            bt != null && (Ke(bt) && (bt.key && (!lt || lt.key !== bt.key) && bn(bt.key), bt = q(
              bt,
              // Keep both the (mapped) and old keys if they differ, just as
              // traverseAllChildren used to do for objects as children
              V + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
              (bt.key && (!lt || lt.key !== bt.key) ? (
                // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
                // eslint-disable-next-line react-internal/safe-string-coercion
                se("" + bt.key) + "/"
              ) : "") + Wt
            )), T.push(bt));
          return 1;
        }
        var qt, Xt, vn = 0, Ht = W === "" ? Et : W + Be;
        if (Sn(y))
          for (var Ol = 0; Ol < y.length; Ol++)
            qt = y[Ol], Xt = Ht + Pe(qt, Ol), vn += Ot(qt, T, V, Xt, de);
        else {
          var iu = Xe(y);
          if (typeof iu == "function") {
            var ps = y;
            iu === ps.entries && (ue || vt("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), ue = !0);
            for (var vs = iu.call(ps), qi, hs = 0; !(qi = vs.next()).done; )
              qt = qi.value, Xt = Ht + Pe(qt, hs++), vn += Ot(qt, T, V, Xt, de);
          } else if (je === "object") {
            var ms = String(y);
            throw new Error("Objects are not valid as a React child (found: " + (ms === "[object Object]" ? "object with keys {" + Object.keys(y).join(", ") + "}" : ms) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return vn;
      }
      function jt(y, T, V) {
        if (y == null)
          return y;
        var W = [], de = 0;
        return Ot(y, W, "", "", function(je) {
          return T.call(V, je, de++);
        }), W;
      }
      function Xn(y) {
        var T = 0;
        return jt(y, function() {
          T++;
        }), T;
      }
      function hi(y, T, V) {
        jt(y, function() {
          T.apply(this, arguments);
        }, V);
      }
      function Bi(y) {
        return jt(y, function(T) {
          return T;
        }) || [];
      }
      function mi(y) {
        if (!Ke(y))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return y;
      }
      function ni(y) {
        var T = {
          $$typeof: ne,
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
        T.Provider = {
          $$typeof: ve,
          _context: T
        };
        var V = !1, W = !1, de = !1;
        {
          var je = {
            $$typeof: ne,
            _context: T
          };
          Object.defineProperties(je, {
            Provider: {
              get: function() {
                return W || (W = !0, K("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), T.Provider;
              },
              set: function(xe) {
                T.Provider = xe;
              }
            },
            _currentValue: {
              get: function() {
                return T._currentValue;
              },
              set: function(xe) {
                T._currentValue = xe;
              }
            },
            _currentValue2: {
              get: function() {
                return T._currentValue2;
              },
              set: function(xe) {
                T._currentValue2 = xe;
              }
            },
            _threadCount: {
              get: function() {
                return T._threadCount;
              },
              set: function(xe) {
                T._threadCount = xe;
              }
            },
            Consumer: {
              get: function() {
                return V || (V = !0, K("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), T.Consumer;
              }
            },
            displayName: {
              get: function() {
                return T.displayName;
              },
              set: function(xe) {
                de || (vt("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", xe), de = !0);
              }
            }
          }), T.Consumer = je;
        }
        return T._currentRenderer = null, T._currentRenderer2 = null, T;
      }
      var ri = -1, Na = 0, Vi = 1, Kr = 2;
      function Zr(y) {
        if (y._status === ri) {
          var T = y._result, V = T();
          if (V.then(function(je) {
            if (y._status === Na || y._status === ri) {
              var xe = y;
              xe._status = Vi, xe._result = je;
            }
          }, function(je) {
            if (y._status === Na || y._status === ri) {
              var xe = y;
              xe._status = Kr, xe._result = je;
            }
          }), y._status === ri) {
            var W = y;
            W._status = Na, W._result = V;
          }
        }
        if (y._status === Vi) {
          var de = y._result;
          return de === void 0 && K(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, de), "default" in de || K(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, de), de.default;
        } else
          throw y._result;
      }
      function Sa(y) {
        var T = {
          // We use these fields to store the result.
          _status: ri,
          _result: y
        }, V = {
          $$typeof: be,
          _payload: T,
          _init: Zr
        };
        {
          var W, de;
          Object.defineProperties(V, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return W;
              },
              set: function(je) {
                K("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), W = je, Object.defineProperty(V, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return de;
              },
              set: function(je) {
                K("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), de = je, Object.defineProperty(V, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return V;
      }
      function $i(y) {
        y != null && y.$$typeof === ce ? K("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof y != "function" ? K("forwardRef requires a render function but was given %s.", y === null ? "null" : typeof y) : y.length !== 0 && y.length !== 2 && K("forwardRef render functions accept exactly two parameters: props and ref. %s", y.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), y != null && (y.defaultProps != null || y.propTypes != null) && K("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var T = {
          $$typeof: _e,
          render: y
        };
        {
          var V;
          Object.defineProperty(T, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return V;
            },
            set: function(W) {
              V = W, !y.name && !y.displayName && (y.displayName = W);
            }
          });
        }
        return T;
      }
      var x;
      x = Symbol.for("react.module.reference");
      function ae(y) {
        return !!(typeof y == "string" || typeof y == "function" || y === P || y === Ce || ft || y === _ || y === re || y === Ne || nt || y === ct || Zt || xt || nn || typeof y == "object" && y !== null && (y.$$typeof === be || y.$$typeof === ce || y.$$typeof === ve || y.$$typeof === ne || y.$$typeof === _e || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        y.$$typeof === x || y.getModuleId !== void 0));
      }
      function ge(y, T) {
        ae(y) || K("memo: The first argument must be a component. Instead received: %s", y === null ? "null" : typeof y);
        var V = {
          $$typeof: ce,
          type: y,
          compare: T === void 0 ? null : T
        };
        {
          var W;
          Object.defineProperty(V, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return W;
            },
            set: function(de) {
              W = de, !y.name && !y.displayName && (y.displayName = de);
            }
          });
        }
        return V;
      }
      function Ee() {
        var y = Qe.current;
        return y === null && K(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), y;
      }
      function Tt(y) {
        var T = Ee();
        if (y._context !== void 0) {
          var V = y._context;
          V.Consumer === y ? K("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : V.Provider === y && K("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return T.useContext(y);
      }
      function At(y) {
        var T = Ee();
        return T.useState(y);
      }
      function St(y, T, V) {
        var W = Ee();
        return W.useReducer(y, T, V);
      }
      function qe(y) {
        var T = Ee();
        return T.useRef(y);
      }
      function Kn(y, T) {
        var V = Ee();
        return V.useEffect(y, T);
      }
      function un(y, T) {
        var V = Ee();
        return V.useInsertionEffect(y, T);
      }
      function sn(y, T) {
        var V = Ee();
        return V.useLayoutEffect(y, T);
      }
      function kr(y, T) {
        var V = Ee();
        return V.useCallback(y, T);
      }
      function yi(y, T) {
        var V = Ee();
        return V.useMemo(y, T);
      }
      function cn(y, T, V) {
        var W = Ee();
        return W.useImperativeHandle(y, T, V);
      }
      function Jr(y, T) {
        {
          var V = Ee();
          return V.useDebugValue(y, T);
        }
      }
      function ns() {
        var y = Ee();
        return y.useTransition();
      }
      function gi(y) {
        var T = Ee();
        return T.useDeferredValue(y);
      }
      function _t() {
        var y = Ee();
        return y.useId();
      }
      function lo(y, T, V) {
        var W = Ee();
        return W.useSyncExternalStore(y, T, V);
      }
      var Ii = 0, bl, ea, rs, Fr, as, is, ls;
      function oo() {
      }
      oo.__reactDisabledLog = !0;
      function Ko() {
        {
          if (Ii === 0) {
            bl = console.log, ea = console.info, rs = console.warn, Fr = console.error, as = console.group, is = console.groupCollapsed, ls = console.groupEnd;
            var y = {
              configurable: !0,
              enumerable: !0,
              value: oo,
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
          Ii++;
        }
      }
      function Yi() {
        {
          if (Ii--, Ii === 0) {
            var y = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: Ge({}, y, {
                value: bl
              }),
              info: Ge({}, y, {
                value: ea
              }),
              warn: Ge({}, y, {
                value: rs
              }),
              error: Ge({}, y, {
                value: Fr
              }),
              group: Ge({}, y, {
                value: as
              }),
              groupCollapsed: Ge({}, y, {
                value: is
              }),
              groupEnd: Ge({}, y, {
                value: ls
              })
            });
          }
          Ii < 0 && K("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Si = Dt.ReactCurrentDispatcher, La;
      function wl(y, T, V) {
        {
          if (La === void 0)
            try {
              throw Error();
            } catch (de) {
              var W = de.stack.trim().match(/\n( *(at )?)/);
              La = W && W[1] || "";
            }
          return `
` + La + y;
        }
      }
      var Ci = !1, uo;
      {
        var so = typeof WeakMap == "function" ? WeakMap : Map;
        uo = new so();
      }
      function Rl(y, T) {
        if (!y || Ci)
          return "";
        {
          var V = uo.get(y);
          if (V !== void 0)
            return V;
        }
        var W;
        Ci = !0;
        var de = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var je;
        je = Si.current, Si.current = null, Ko();
        try {
          if (T) {
            var xe = function() {
              throw Error();
            };
            if (Object.defineProperty(xe.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(xe, []);
              } catch (Ht) {
                W = Ht;
              }
              Reflect.construct(y, [], xe);
            } else {
              try {
                xe.call();
              } catch (Ht) {
                W = Ht;
              }
              y.call(xe.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (Ht) {
              W = Ht;
            }
            y();
          }
        } catch (Ht) {
          if (Ht && W && typeof Ht.stack == "string") {
            for (var lt = Ht.stack.split(`
`), bt = W.stack.split(`
`), Wt = lt.length - 1, Qt = bt.length - 1; Wt >= 1 && Qt >= 0 && lt[Wt] !== bt[Qt]; )
              Qt--;
            for (; Wt >= 1 && Qt >= 0; Wt--, Qt--)
              if (lt[Wt] !== bt[Qt]) {
                if (Wt !== 1 || Qt !== 1)
                  do
                    if (Wt--, Qt--, Qt < 0 || lt[Wt] !== bt[Qt]) {
                      var qt = `
` + lt[Wt].replace(" at new ", " at ");
                      return y.displayName && qt.includes("<anonymous>") && (qt = qt.replace("<anonymous>", y.displayName)), typeof y == "function" && uo.set(y, qt), qt;
                    }
                  while (Wt >= 1 && Qt >= 0);
                break;
              }
          }
        } finally {
          Ci = !1, Si.current = je, Yi(), Error.prepareStackTrace = de;
        }
        var Xt = y ? y.displayName || y.name : "", vn = Xt ? wl(Xt) : "";
        return typeof y == "function" && uo.set(y, vn), vn;
      }
      function os(y, T, V) {
        return Rl(y, !1);
      }
      function us(y) {
        var T = y.prototype;
        return !!(T && T.isReactComponent);
      }
      function Lt(y, T, V) {
        if (y == null)
          return "";
        if (typeof y == "function")
          return Rl(y, us(y));
        if (typeof y == "string")
          return wl(y);
        switch (y) {
          case re:
            return wl("Suspense");
          case Ne:
            return wl("SuspenseList");
        }
        if (typeof y == "object")
          switch (y.$$typeof) {
            case _e:
              return os(y.render);
            case ce:
              return Lt(y.type, T, V);
            case be: {
              var W = y, de = W._payload, je = W._init;
              try {
                return Lt(je(de), T, V);
              } catch {
              }
            }
          }
        return "";
      }
      var ss = {}, Zo = Dt.ReactDebugCurrentFrame;
      function Tl(y) {
        if (y) {
          var T = y._owner, V = Lt(y.type, y._source, T ? T.type : null);
          Zo.setExtraStackFrame(V);
        } else
          Zo.setExtraStackFrame(null);
      }
      function cs(y, T, V, W, de) {
        {
          var je = Function.call.bind(zr);
          for (var xe in y)
            if (je(y, xe)) {
              var lt = void 0;
              try {
                if (typeof y[xe] != "function") {
                  var bt = Error((W || "React class") + ": " + V + " type `" + xe + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof y[xe] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw bt.name = "Invariant Violation", bt;
                }
                lt = y[xe](T, xe, W, V, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (Wt) {
                lt = Wt;
              }
              lt && !(lt instanceof Error) && (Tl(de), K("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", W || "React class", V, xe, typeof lt), Tl(null)), lt instanceof Error && !(lt.message in ss) && (ss[lt.message] = !0, Tl(de), K("Failed %s type: %s", V, lt.message), Tl(null));
            }
        }
      }
      function Ft(y) {
        if (y) {
          var T = y._owner, V = Lt(y.type, y._source, T ? T.type : null);
          gn(V);
        } else
          gn(null);
      }
      var Jo;
      Jo = !1;
      function co() {
        if (wt.current) {
          var y = wn(wt.current.type);
          if (y)
            return `

Check the render method of \`` + y + "`.";
        }
        return "";
      }
      function st(y) {
        if (y !== void 0) {
          var T = y.fileName.replace(/^.*[\\\/]/, ""), V = y.lineNumber;
          return `

Check your code at ` + T + ":" + V + ".";
        }
        return "";
      }
      function ai(y) {
        return y != null ? st(y.__source) : "";
      }
      var Tn = {};
      function ta(y) {
        var T = co();
        if (!T) {
          var V = typeof y == "string" ? y : y.displayName || y.name;
          V && (T = `

Check the top-level render call using <` + V + ">.");
        }
        return T;
      }
      function Aa(y, T) {
        if (!(!y._store || y._store.validated || y.key != null)) {
          y._store.validated = !0;
          var V = ta(T);
          if (!Tn[V]) {
            Tn[V] = !0;
            var W = "";
            y && y._owner && y._owner !== wt.current && (W = " It was passed a child from " + wn(y._owner.type) + "."), Ft(y), K('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', V, W), Ft(null);
          }
        }
      }
      function xl(y, T) {
        if (typeof y == "object") {
          if (Sn(y))
            for (var V = 0; V < y.length; V++) {
              var W = y[V];
              Ke(W) && Aa(W, T);
            }
          else if (Ke(y))
            y._store && (y._store.validated = !0);
          else if (y) {
            var de = Xe(y);
            if (typeof de == "function" && de !== y.entries)
              for (var je = de.call(y), xe; !(xe = je.next()).done; )
                Ke(xe.value) && Aa(xe.value, T);
          }
        }
      }
      function pn(y) {
        {
          var T = y.type;
          if (T == null || typeof T == "string")
            return;
          var V;
          if (typeof T == "function")
            V = T.propTypes;
          else if (typeof T == "object" && (T.$$typeof === _e || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          T.$$typeof === ce))
            V = T.propTypes;
          else
            return;
          if (V) {
            var W = wn(T);
            cs(V, y.props, "prop", W, y);
          } else if (T.PropTypes !== void 0 && !Jo) {
            Jo = !0;
            var de = wn(T);
            K("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", de || "Unknown");
          }
          typeof T.getDefaultProps == "function" && !T.getDefaultProps.isReactClassApproved && K("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function xn(y) {
        {
          for (var T = Object.keys(y.props), V = 0; V < T.length; V++) {
            var W = T[V];
            if (W !== "children" && W !== "key") {
              Ft(y), K("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", W), Ft(null);
              break;
            }
          }
          y.ref !== null && (Ft(y), K("Invalid attribute `ref` supplied to `React.Fragment`."), Ft(null));
        }
      }
      function fs(y, T, V) {
        var W = ae(y);
        if (!W) {
          var de = "";
          (y === void 0 || typeof y == "object" && y !== null && Object.keys(y).length === 0) && (de += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var je = ai(T);
          je ? de += je : de += co();
          var xe;
          y === null ? xe = "null" : Sn(y) ? xe = "array" : y !== void 0 && y.$$typeof === w ? (xe = "<" + (wn(y.type) || "Unknown") + " />", de = " Did you accidentally export a JSX literal instead of a component?") : xe = typeof y, K("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", xe, de);
        }
        var lt = U.apply(this, arguments);
        if (lt == null)
          return lt;
        if (W)
          for (var bt = 2; bt < arguments.length; bt++)
            xl(arguments[bt], y);
        return y === P ? xn(lt) : pn(lt), lt;
      }
      var gr = !1;
      function na(y) {
        var T = fs.bind(null, y);
        return T.type = y, gr || (gr = !0, vt("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(T, "type", {
          enumerable: !1,
          get: function() {
            return vt("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: y
            }), y;
          }
        }), T;
      }
      function ii(y, T, V) {
        for (var W = he.apply(this, arguments), de = 2; de < arguments.length; de++)
          xl(arguments[de], W.type);
        return pn(W), W;
      }
      function eu(y, T) {
        var V = Nt.transition;
        Nt.transition = {};
        var W = Nt.transition;
        Nt.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          y();
        } finally {
          if (Nt.transition = V, V === null && W._updatedFibers) {
            var de = W._updatedFibers.size;
            de > 10 && vt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), W._updatedFibers.clear();
          }
        }
      }
      var fo = !1, po = null;
      function Dl(y) {
        if (po === null)
          try {
            var T = ("require" + Math.random()).slice(0, 7), V = g && g[T];
            po = V.call(g, "timers").setImmediate;
          } catch {
            po = function(de) {
              fo === !1 && (fo = !0, typeof MessageChannel > "u" && K("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var je = new MessageChannel();
              je.port1.onmessage = de, je.port2.postMessage(void 0);
            };
          }
        return po(y);
      }
      var za = 0, Wi = !1;
      function tu(y) {
        {
          var T = za;
          za++, Le.current === null && (Le.current = []);
          var V = Le.isBatchingLegacy, W;
          try {
            if (Le.isBatchingLegacy = !0, W = y(), !V && Le.didScheduleLegacyUpdate) {
              var de = Le.current;
              de !== null && (Le.didScheduleLegacyUpdate = !1, Qi(de));
            }
          } catch (Xt) {
            throw Gi(T), Xt;
          } finally {
            Le.isBatchingLegacy = V;
          }
          if (W !== null && typeof W == "object" && typeof W.then == "function") {
            var je = W, xe = !1, lt = {
              then: function(Xt, vn) {
                xe = !0, je.then(function(Ht) {
                  Gi(T), za === 0 ? nu(Ht, Xt, vn) : Xt(Ht);
                }, function(Ht) {
                  Gi(T), vn(Ht);
                });
              }
            };
            return !Wi && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              xe || (Wi = !0, K("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), lt;
          } else {
            var bt = W;
            if (Gi(T), za === 0) {
              var Wt = Le.current;
              Wt !== null && (Qi(Wt), Le.current = null);
              var Qt = {
                then: function(Xt, vn) {
                  Le.current === null ? (Le.current = [], nu(bt, Xt, vn)) : Xt(bt);
                }
              };
              return Qt;
            } else {
              var qt = {
                then: function(Xt, vn) {
                  Xt(bt);
                }
              };
              return qt;
            }
          }
        }
      }
      function Gi(y) {
        y !== za - 1 && K("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), za = y;
      }
      function nu(y, T, V) {
        {
          var W = Le.current;
          if (W !== null)
            try {
              Qi(W), Dl(function() {
                W.length === 0 ? (Le.current = null, T(y)) : nu(y, T, V);
              });
            } catch (de) {
              V(de);
            }
          else
            T(y);
        }
      }
      var Ei = !1;
      function Qi(y) {
        if (!Ei) {
          Ei = !0;
          var T = 0;
          try {
            for (; T < y.length; T++) {
              var V = y[T];
              do
                V = V(!0);
              while (V !== null);
            }
            y.length = 0;
          } catch (W) {
            throw y = y.slice(T + 1), W;
          } finally {
            Ei = !1;
          }
        }
      }
      var ru = fs, ds = ii, li = na, au = {
        map: jt,
        forEach: hi,
        count: Xn,
        toArray: Bi,
        only: mi
      };
      d.Children = au, d.Component = Ve, d.Fragment = P, d.Profiler = Ce, d.PureComponent = Jt, d.StrictMode = _, d.Suspense = re, d.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Dt, d.cloneElement = ds, d.createContext = ni, d.createElement = ru, d.createFactory = li, d.createRef = Fn, d.forwardRef = $i, d.isValidElement = Ke, d.lazy = Sa, d.memo = ge, d.startTransition = eu, d.unstable_act = tu, d.useCallback = kr, d.useContext = Tt, d.useDebugValue = Jr, d.useDeferredValue = gi, d.useEffect = Kn, d.useId = _t, d.useImperativeHandle = cn, d.useInsertionEffect = un, d.useLayoutEffect = sn, d.useMemo = yi, d.useReducer = St, d.useRef = qe, d.useState = At, d.useSyncExternalStore = lo, d.useTransition = ns, d.version = C, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(uv, uv.exports)), uv.exports;
}
var i1;
function pv() {
  if (i1)
    return ly.exports;
  i1 = 1;
  var g = {};
  return g.NODE_ENV === "production" ? ly.exports = kO() : ly.exports = MO(), ly.exports;
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
function NO() {
  if (l1)
    return lv;
  l1 = 1;
  var g = pv(), d = Symbol.for("react.element"), h = Symbol.for("react.fragment"), C = Object.prototype.hasOwnProperty, w = g.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, A = { key: !0, ref: !0, __self: !0, __source: !0 };
  function P(_, Ce, ve) {
    var ne, _e = {}, re = null, Ne = null;
    ve !== void 0 && (re = "" + ve), Ce.key !== void 0 && (re = "" + Ce.key), Ce.ref !== void 0 && (Ne = Ce.ref);
    for (ne in Ce)
      C.call(Ce, ne) && !A.hasOwnProperty(ne) && (_e[ne] = Ce[ne]);
    if (_ && _.defaultProps)
      for (ne in Ce = _.defaultProps, Ce)
        _e[ne] === void 0 && (_e[ne] = Ce[ne]);
    return { $$typeof: d, type: _, key: re, ref: Ne, props: _e, _owner: w.current };
  }
  return lv.Fragment = h, lv.jsx = P, lv.jsxs = P, lv;
}
var ov = {}, o1;
function LO() {
  if (o1)
    return ov;
  o1 = 1;
  var g = {};
  /**
   * @license React
   * react-jsx-runtime.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  return g.NODE_ENV !== "production" && function() {
    var d = pv(), h = Symbol.for("react.element"), C = Symbol.for("react.portal"), w = Symbol.for("react.fragment"), A = Symbol.for("react.strict_mode"), P = Symbol.for("react.profiler"), _ = Symbol.for("react.provider"), Ce = Symbol.for("react.context"), ve = Symbol.for("react.forward_ref"), ne = Symbol.for("react.suspense"), _e = Symbol.for("react.suspense_list"), re = Symbol.for("react.memo"), Ne = Symbol.for("react.lazy"), ce = Symbol.for("react.offscreen"), be = Symbol.iterator, ct = "@@iterator";
    function Kt(x) {
      if (x === null || typeof x != "object")
        return null;
      var ae = be && x[be] || x[ct];
      return typeof ae == "function" ? ae : null;
    }
    var Ct = d.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function Xe(x) {
      {
        for (var ae = arguments.length, ge = new Array(ae > 1 ? ae - 1 : 0), Ee = 1; Ee < ae; Ee++)
          ge[Ee - 1] = arguments[Ee];
        Qe("error", x, ge);
      }
    }
    function Qe(x, ae, ge) {
      {
        var Ee = Ct.ReactDebugCurrentFrame, Tt = Ee.getStackAddendum();
        Tt !== "" && (ae += "%s", ge = ge.concat([Tt]));
        var At = ge.map(function(St) {
          return String(St);
        });
        At.unshift("Warning: " + ae), Function.prototype.apply.call(console[x], console, At);
      }
    }
    var Nt = !1, Le = !1, wt = !1, ot = !1, En = !1, gn;
    gn = Symbol.for("react.module.reference");
    function Zt(x) {
      return !!(typeof x == "string" || typeof x == "function" || x === w || x === P || En || x === A || x === ne || x === _e || ot || x === ce || Nt || Le || wt || typeof x == "object" && x !== null && (x.$$typeof === Ne || x.$$typeof === re || x.$$typeof === _ || x.$$typeof === Ce || x.$$typeof === ve || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      x.$$typeof === gn || x.getModuleId !== void 0));
    }
    function xt(x, ae, ge) {
      var Ee = x.displayName;
      if (Ee)
        return Ee;
      var Tt = ae.displayName || ae.name || "";
      return Tt !== "" ? ge + "(" + Tt + ")" : ge;
    }
    function nn(x) {
      return x.displayName || "Context";
    }
    function nt(x) {
      if (x == null)
        return null;
      if (typeof x.tag == "number" && Xe("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof x == "function")
        return x.displayName || x.name || null;
      if (typeof x == "string")
        return x;
      switch (x) {
        case w:
          return "Fragment";
        case C:
          return "Portal";
        case P:
          return "Profiler";
        case A:
          return "StrictMode";
        case ne:
          return "Suspense";
        case _e:
          return "SuspenseList";
      }
      if (typeof x == "object")
        switch (x.$$typeof) {
          case Ce:
            var ae = x;
            return nn(ae) + ".Consumer";
          case _:
            var ge = x;
            return nn(ge._context) + ".Provider";
          case ve:
            return xt(x, x.render, "ForwardRef");
          case re:
            var Ee = x.displayName || null;
            return Ee !== null ? Ee : nt(x.type) || "Memo";
          case Ne: {
            var Tt = x, At = Tt._payload, St = Tt._init;
            try {
              return nt(St(At));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var ft = Object.assign, Dt = 0, vt, K, ke, O, J, ee, Ge;
    function tt() {
    }
    tt.__reactDisabledLog = !0;
    function Ve() {
      {
        if (Dt === 0) {
          vt = console.log, K = console.info, ke = console.warn, O = console.error, J = console.group, ee = console.groupCollapsed, Ge = console.groupEnd;
          var x = {
            configurable: !0,
            enumerable: !0,
            value: tt,
            writable: !0
          };
          Object.defineProperties(console, {
            info: x,
            log: x,
            warn: x,
            error: x,
            group: x,
            groupCollapsed: x,
            groupEnd: x
          });
        }
        Dt++;
      }
    }
    function gt() {
      {
        if (Dt--, Dt === 0) {
          var x = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: ft({}, x, {
              value: vt
            }),
            info: ft({}, x, {
              value: K
            }),
            warn: ft({}, x, {
              value: ke
            }),
            error: ft({}, x, {
              value: O
            }),
            group: ft({}, x, {
              value: J
            }),
            groupCollapsed: ft({}, x, {
              value: ee
            }),
            groupEnd: ft({}, x, {
              value: Ge
            })
          });
        }
        Dt < 0 && Xe("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Rt = Ct.ReactCurrentDispatcher, yt;
    function rn(x, ae, ge) {
      {
        if (yt === void 0)
          try {
            throw Error();
          } catch (Tt) {
            var Ee = Tt.stack.trim().match(/\n( *(at )?)/);
            yt = Ee && Ee[1] || "";
          }
        return `
` + yt + x;
      }
    }
    var Jt = !1, qn;
    {
      var Fn = typeof WeakMap == "function" ? WeakMap : Map;
      qn = new Fn();
    }
    function tr(x, ae) {
      if (!x || Jt)
        return "";
      {
        var ge = qn.get(x);
        if (ge !== void 0)
          return ge;
      }
      var Ee;
      Jt = !0;
      var Tt = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var At;
      At = Rt.current, Rt.current = null, Ve();
      try {
        if (ae) {
          var St = function() {
            throw Error();
          };
          if (Object.defineProperty(St.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(St, []);
            } catch (Jr) {
              Ee = Jr;
            }
            Reflect.construct(x, [], St);
          } else {
            try {
              St.call();
            } catch (Jr) {
              Ee = Jr;
            }
            x.call(St.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (Jr) {
            Ee = Jr;
          }
          x();
        }
      } catch (Jr) {
        if (Jr && Ee && typeof Jr.stack == "string") {
          for (var qe = Jr.stack.split(`
`), Kn = Ee.stack.split(`
`), un = qe.length - 1, sn = Kn.length - 1; un >= 1 && sn >= 0 && qe[un] !== Kn[sn]; )
            sn--;
          for (; un >= 1 && sn >= 0; un--, sn--)
            if (qe[un] !== Kn[sn]) {
              if (un !== 1 || sn !== 1)
                do
                  if (un--, sn--, sn < 0 || qe[un] !== Kn[sn]) {
                    var kr = `
` + qe[un].replace(" at new ", " at ");
                    return x.displayName && kr.includes("<anonymous>") && (kr = kr.replace("<anonymous>", x.displayName)), typeof x == "function" && qn.set(x, kr), kr;
                  }
                while (un >= 1 && sn >= 0);
              break;
            }
        }
      } finally {
        Jt = !1, Rt.current = At, gt(), Error.prepareStackTrace = Tt;
      }
      var yi = x ? x.displayName || x.name : "", cn = yi ? rn(yi) : "";
      return typeof x == "function" && qn.set(x, cn), cn;
    }
    function Sn(x, ae, ge) {
      return tr(x, !1);
    }
    function Hn(x) {
      var ae = x.prototype;
      return !!(ae && ae.isReactComponent);
    }
    function Mn(x, ae, ge) {
      if (x == null)
        return "";
      if (typeof x == "function")
        return tr(x, Hn(x));
      if (typeof x == "string")
        return rn(x);
      switch (x) {
        case ne:
          return rn("Suspense");
        case _e:
          return rn("SuspenseList");
      }
      if (typeof x == "object")
        switch (x.$$typeof) {
          case ve:
            return Sn(x.render);
          case re:
            return Mn(x.type, ae, ge);
          case Ne: {
            var Ee = x, Tt = Ee._payload, At = Ee._init;
            try {
              return Mn(At(Tt), ae, ge);
            } catch {
            }
          }
        }
      return "";
    }
    var _n = Object.prototype.hasOwnProperty, bn = {}, sr = Ct.ReactDebugCurrentFrame;
    function nr(x) {
      if (x) {
        var ae = x._owner, ge = Mn(x.type, x._source, ae ? ae.type : null);
        sr.setExtraStackFrame(ge);
      } else
        sr.setExtraStackFrame(null);
    }
    function wn(x, ae, ge, Ee, Tt) {
      {
        var At = Function.call.bind(_n);
        for (var St in x)
          if (At(x, St)) {
            var qe = void 0;
            try {
              if (typeof x[St] != "function") {
                var Kn = Error((Ee || "React class") + ": " + ge + " type `" + St + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof x[St] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw Kn.name = "Invariant Violation", Kn;
              }
              qe = x[St](ae, St, Ee, ge, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (un) {
              qe = un;
            }
            qe && !(qe instanceof Error) && (nr(Tt), Xe("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", Ee || "React class", ge, St, typeof qe), nr(null)), qe instanceof Error && !(qe.message in bn) && (bn[qe.message] = !0, nr(Tt), Xe("Failed %s type: %s", ge, qe.message), nr(null));
          }
      }
    }
    var zr = Array.isArray;
    function Ur(x) {
      return zr(x);
    }
    function cr(x) {
      {
        var ae = typeof Symbol == "function" && Symbol.toStringTag, ge = ae && x[Symbol.toStringTag] || x.constructor.name || "Object";
        return ge;
      }
    }
    function Pr(x) {
      try {
        return Rn(x), !1;
      } catch {
        return !0;
      }
    }
    function Rn(x) {
      return "" + x;
    }
    function mr(x) {
      if (Pr(x))
        return Xe("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", cr(x)), Rn(x);
    }
    var on = Ct.ReactCurrentOwner, jr = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, yr, z, D;
    D = {};
    function U(x) {
      if (_n.call(x, "ref")) {
        var ae = Object.getOwnPropertyDescriptor(x, "ref").get;
        if (ae && ae.isReactWarning)
          return !1;
      }
      return x.ref !== void 0;
    }
    function q(x) {
      if (_n.call(x, "key")) {
        var ae = Object.getOwnPropertyDescriptor(x, "key").get;
        if (ae && ae.isReactWarning)
          return !1;
      }
      return x.key !== void 0;
    }
    function he(x, ae) {
      if (typeof x.ref == "string" && on.current && ae && on.current.stateNode !== ae) {
        var ge = nt(on.current.type);
        D[ge] || (Xe('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', nt(on.current.type), x.ref), D[ge] = !0);
      }
    }
    function Ke(x, ae) {
      {
        var ge = function() {
          yr || (yr = !0, Xe("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", ae));
        };
        ge.isReactWarning = !0, Object.defineProperty(x, "key", {
          get: ge,
          configurable: !0
        });
      }
    }
    function Et(x, ae) {
      {
        var ge = function() {
          z || (z = !0, Xe("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", ae));
        };
        ge.isReactWarning = !0, Object.defineProperty(x, "ref", {
          get: ge,
          configurable: !0
        });
      }
    }
    var Be = function(x, ae, ge, Ee, Tt, At, St) {
      var qe = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: h,
        // Built-in properties that belong on the element
        type: x,
        key: ae,
        ref: ge,
        props: St,
        // Record the component responsible for creating this element.
        _owner: At
      };
      return qe._store = {}, Object.defineProperty(qe._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(qe, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Ee
      }), Object.defineProperty(qe, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Tt
      }), Object.freeze && (Object.freeze(qe.props), Object.freeze(qe)), qe;
    };
    function fe(x, ae, ge, Ee, Tt) {
      {
        var At, St = {}, qe = null, Kn = null;
        ge !== void 0 && (mr(ge), qe = "" + ge), q(ae) && (mr(ae.key), qe = "" + ae.key), U(ae) && (Kn = ae.ref, he(ae, Tt));
        for (At in ae)
          _n.call(ae, At) && !jr.hasOwnProperty(At) && (St[At] = ae[At]);
        if (x && x.defaultProps) {
          var un = x.defaultProps;
          for (At in un)
            St[At] === void 0 && (St[At] = un[At]);
        }
        if (qe || Kn) {
          var sn = typeof x == "function" ? x.displayName || x.name || "Unknown" : x;
          qe && Ke(St, sn), Kn && Et(St, sn);
        }
        return Be(x, qe, Kn, Tt, Ee, on.current, St);
      }
    }
    var ue = Ct.ReactCurrentOwner, ye = Ct.ReactDebugCurrentFrame;
    function se(x) {
      if (x) {
        var ae = x._owner, ge = Mn(x.type, x._source, ae ? ae.type : null);
        ye.setExtraStackFrame(ge);
      } else
        ye.setExtraStackFrame(null);
    }
    var Pe;
    Pe = !1;
    function Ot(x) {
      return typeof x == "object" && x !== null && x.$$typeof === h;
    }
    function jt() {
      {
        if (ue.current) {
          var x = nt(ue.current.type);
          if (x)
            return `

Check the render method of \`` + x + "`.";
        }
        return "";
      }
    }
    function Xn(x) {
      {
        if (x !== void 0) {
          var ae = x.fileName.replace(/^.*[\\\/]/, ""), ge = x.lineNumber;
          return `

Check your code at ` + ae + ":" + ge + ".";
        }
        return "";
      }
    }
    var hi = {};
    function Bi(x) {
      {
        var ae = jt();
        if (!ae) {
          var ge = typeof x == "string" ? x : x.displayName || x.name;
          ge && (ae = `

Check the top-level render call using <` + ge + ">.");
        }
        return ae;
      }
    }
    function mi(x, ae) {
      {
        if (!x._store || x._store.validated || x.key != null)
          return;
        x._store.validated = !0;
        var ge = Bi(ae);
        if (hi[ge])
          return;
        hi[ge] = !0;
        var Ee = "";
        x && x._owner && x._owner !== ue.current && (Ee = " It was passed a child from " + nt(x._owner.type) + "."), se(x), Xe('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', ge, Ee), se(null);
      }
    }
    function ni(x, ae) {
      {
        if (typeof x != "object")
          return;
        if (Ur(x))
          for (var ge = 0; ge < x.length; ge++) {
            var Ee = x[ge];
            Ot(Ee) && mi(Ee, ae);
          }
        else if (Ot(x))
          x._store && (x._store.validated = !0);
        else if (x) {
          var Tt = Kt(x);
          if (typeof Tt == "function" && Tt !== x.entries)
            for (var At = Tt.call(x), St; !(St = At.next()).done; )
              Ot(St.value) && mi(St.value, ae);
        }
      }
    }
    function ri(x) {
      {
        var ae = x.type;
        if (ae == null || typeof ae == "string")
          return;
        var ge;
        if (typeof ae == "function")
          ge = ae.propTypes;
        else if (typeof ae == "object" && (ae.$$typeof === ve || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        ae.$$typeof === re))
          ge = ae.propTypes;
        else
          return;
        if (ge) {
          var Ee = nt(ae);
          wn(ge, x.props, "prop", Ee, x);
        } else if (ae.PropTypes !== void 0 && !Pe) {
          Pe = !0;
          var Tt = nt(ae);
          Xe("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", Tt || "Unknown");
        }
        typeof ae.getDefaultProps == "function" && !ae.getDefaultProps.isReactClassApproved && Xe("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Na(x) {
      {
        for (var ae = Object.keys(x.props), ge = 0; ge < ae.length; ge++) {
          var Ee = ae[ge];
          if (Ee !== "children" && Ee !== "key") {
            se(x), Xe("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", Ee), se(null);
            break;
          }
        }
        x.ref !== null && (se(x), Xe("Invalid attribute `ref` supplied to `React.Fragment`."), se(null));
      }
    }
    function Vi(x, ae, ge, Ee, Tt, At) {
      {
        var St = Zt(x);
        if (!St) {
          var qe = "";
          (x === void 0 || typeof x == "object" && x !== null && Object.keys(x).length === 0) && (qe += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Kn = Xn(Tt);
          Kn ? qe += Kn : qe += jt();
          var un;
          x === null ? un = "null" : Ur(x) ? un = "array" : x !== void 0 && x.$$typeof === h ? (un = "<" + (nt(x.type) || "Unknown") + " />", qe = " Did you accidentally export a JSX literal instead of a component?") : un = typeof x, Xe("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", un, qe);
        }
        var sn = fe(x, ae, ge, Tt, At);
        if (sn == null)
          return sn;
        if (St) {
          var kr = ae.children;
          if (kr !== void 0)
            if (Ee)
              if (Ur(kr)) {
                for (var yi = 0; yi < kr.length; yi++)
                  ni(kr[yi], x);
                Object.freeze && Object.freeze(kr);
              } else
                Xe("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              ni(kr, x);
        }
        return x === w ? Na(sn) : ri(sn), sn;
      }
    }
    function Kr(x, ae, ge) {
      return Vi(x, ae, ge, !0);
    }
    function Zr(x, ae, ge) {
      return Vi(x, ae, ge, !1);
    }
    var Sa = Zr, $i = Kr;
    ov.Fragment = w, ov.jsx = Sa, ov.jsxs = $i;
  }(), ov;
}
var AO = {};
AO.NODE_ENV === "production" ? K0.exports = NO() : K0.exports = LO();
var Fe = K0.exports;
function zO(g) {
  const { card: d, selected: h, onClick: C } = g, w = `card ${d.type}-${d.number} ${h ? "selected-card" : ""}`;
  return /* @__PURE__ */ Fe.jsx(
    "div",
    {
      className: w,
      onClick: () => C?.(d)
    }
  );
}
function UO(g) {
  const { card: d, animations: h, score: C } = g, w = `card ${d.type}-${d.number} ${h?.map((A) => `${A}`).join(" ")}`;
  return /* @__PURE__ */ Fe.jsxs(Fe.Fragment, { children: [
    C && /* @__PURE__ */ Fe.jsx(
      "div",
      {
        className: w,
        "data-score": C
      }
    ),
    !C && /* @__PURE__ */ Fe.jsx(
      "div",
      {
        className: w
      }
    )
  ] });
}
function PO(g) {
  const { cards: d, selectedCards: h, onCardClick: C } = g;
  return /* @__PURE__ */ Fe.jsx("div", { className: "hand", children: d.map((w) => /* @__PURE__ */ Fe.jsx(
    zO,
    {
      card: w,
      selected: h.some((A) => A.id.equals(w.id)),
      onClick: C
    },
    w.id.toString()
  )) });
}
class ud extends dv {
  static create(d) {
    return new ud(d);
  }
}
var jO = Object.defineProperty, FO = Object.getOwnPropertyDescriptor, HO = (g, d, h, C) => {
  for (var w = C > 1 ? void 0 : C ? FO(d, h) : d, A = g.length - 1, P; A >= 0; A--)
    (P = g[A]) && (w = (C ? P(d, h, w) : P(w)) || w);
  return C && w && jO(d, h, w), w;
};
let sy = class extends sC {
  static create() {
    return new sy();
  }
};
sy = HO([
  vi()
], sy);
class my extends dv {
  static create(d) {
    return new my(d);
  }
}
class yy extends dv {
  static create(d) {
    return new yy(d);
  }
}
class gy extends dv {
  static create(d) {
    return new gy(d);
  }
}
var BO = Object.defineProperty, VO = Object.getOwnPropertyDescriptor, $O = (g, d, h, C) => {
  for (var w = C > 1 ? void 0 : C ? VO(d, h) : d, A = g.length - 1, P; A >= 0; A--)
    (P = g[A]) && (w = (C ? P(d, h, w) : P(w)) || w);
  return C && w && BO(d, h, w), w;
};
let cy = class extends sC {
  static create() {
    return new cy();
  }
};
cy = $O([
  vi()
], cy);
class Sy extends od {
  _number;
  get number() {
    return this._number;
  }
  _type;
  get type() {
    return this._type;
  }
  constructor(d, h, C) {
    super(d), this._type = h, this._number = C;
  }
  static create(d, h, C) {
    return new Sy(d, h, C);
  }
}
var fy = /* @__PURE__ */ ((g) => (g.Coins = "coins", g.Cups = "cups", g.Swords = "swords", g.Clubs = "clubs", g))(fy || {});
class El extends od {
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
    return this._handCards.getAll().filter((d) => this._selectedCards.has(d.id));
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
  constructor(d, h) {
    super(Hi.newGuid()), this._handCardsNumber = d, this._maxSelectedCardsNumber = h, this._cards = qo.create(), this._unplayedCards = qo.create(), this._playedCards = qo.create(), this._discardedCards = qo.create(), this._handCards = qo.create(), this._lastPlayedCards = qo.create();
  }
  init() {
    for (const d of Object.keys(fy))
      for (let h = 0; h < 12; h++)
        this._cards.set(Sy.create(Hi.newGuid(), fy[d], h + 1));
    this.shuffle(), this.takeCardsToHand();
  }
  shuffle() {
    this._unplayedCards.clear(), this._playedCards.clear(), this._unplayedCards.clear(), this._discardedCards.clear(), this._selectedCards.clear(), this._lastPlayedCards.clear();
    const d = this._cards.getAll();
    for (let h = d.length - 1; h > 0; h--) {
      const C = Math.floor(Math.random() * (h + 1));
      [d[h], d[C]] = [d[C], d[h]];
    }
    this._unplayedCards.setAll(d);
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
  selectCard(d) {
    if (this._handCards.size !== 0) {
      if (this._selectedCards.has(d.id)) {
        this._selectedCards.delete(d.id);
        return;
      }
      this._selectedCards.size >= this._maxSelectedCardsNumber || this._selectedCards.add(d.id);
    }
  }
  discardSelectedCards() {
    for (const d of this.selectedCards)
      this._handCards.remove(d.id), this._discardedCards.set(d);
    this._selectedCards.clear(), this.takeCardsToHand();
  }
  playSelectedCards() {
    this._lastPlayedCards.clear();
    for (const d of this.selectedCards)
      this._lastPlayedCards.set(d), this._handCards.remove(d.id), this._playedCards.set(d);
    this._selectedCards.clear(), this.takeCardsToHand();
  }
  changeHandCardsNumber(d) {
    this._handCardsNumber = d;
  }
  changeMaxSelectedCardsNumber(d) {
    this._maxSelectedCardsNumber = d;
  }
}
var Qn = /* @__PURE__ */ ((g) => (g.None = "None", g.Battle = "Battle", g.Boss = "Boss", g.Shop = "Shop", g.Rest = "Rest", g.Final = "Final", g))(Qn || {});
class vv extends od {
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
  constructor(d, h, C) {
    super(d), this._x = h, this._y = C, this._children = [], this._isUnknow = !1, this._position = {
      top: Math.floor(Math.random() * 51) + 10,
      left: Math.floor(Math.random() * 51) + 10
    }, this._type = Qn.None;
  }
  static create(d, h, C, ...w) {
    return new vv(d, h, C);
  }
  addChild(d) {
    this._children.push(d);
  }
  removeChild(d) {
    this._children = this._children.filter((h) => h !== d);
  }
  hasChild(d) {
    return this._children.some((h) => h.equals(d));
  }
  setType(d) {
    this._type = d;
  }
  setUnknow(d) {
    this._isUnknow = d;
  }
}
class Cy extends vv {
  get type() {
    return Qn.Battle;
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
  constructor(d, h, C, w, A, P, _) {
    super(d, h, C), this._playablesHands = w, this._playablesDiscards = A, this._objectiveScore = P, this._reward = _;
  }
  static create(d, h, C, w, A, P) {
    return new Cy(d, h, C, w, A, P, 0);
  }
}
class dy extends vv {
  get type() {
    return Qn.Shop;
  }
  static create(d, h, C) {
    return new dy(d, h, C);
  }
}
class IO {
  static createBattleMapPoint(d, h, C, w, A, P, _) {
    return Cy.create(d, h, C, w, A, P);
  }
  static createShopMapPoint(d, h, C) {
    return dy.create(d, h, C);
  }
  static createShopMapPointFromPoint(d) {
    const h = dy.create(d.id, d.x, d.y);
    return d.children.forEach((C) => {
      h.addChild(C);
    }), h;
  }
}
class bc extends od {
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
    return this._levels.reduce((d, h) => d.concat(h), []);
  }
  _currentPoint = void 0;
  get currentPoint() {
    return this._currentPoint;
  }
  get currentLevel() {
    return this._currentPoint?.y ?? void 0;
  }
  constructor() {
    super(Hi.newGuid()), this._levels = [];
  }
  static create() {
    return new bc();
  }
  isPointAccessible(d) {
    const h = this.points.find((C) => C.id.equals(d.id));
    return h ? !!(!this._currentPoint && h.y === 0 || this._currentPoint?.children.some((C) => C.equals(d.id))) : !1;
  }
  moveToPoint(d) {
    this.isPointAccessible(d) && (this._currentPoint = d);
  }
  generateIsometricMap(d) {
    const h = this._numberOfPotencialPoints, C = this._numberOfLevels, w = d.playablesHands, A = d.playablesDiscards;
    for (let Ce = 0; Ce < C; Ce++) {
      this.levels.push([]);
      for (let ve = 0; ve < h; ve++) {
        const ne = Cy.create(Hi.newGuid(), ve, Ce, w, A, 100 * (Ce + 1));
        ne.setType(Qn.Battle), this._levels[Ce].push(ne);
      }
    }
    const P = this.selectThreeInitialPoints();
    for (const Ce of Array.from({ length: this._numberOfPaths }))
      this.generateIsometricMapPath(0, P[this.generateRandomNumberBetween(0, P.length - 1)]);
    this.clearConexionsWithoutChildrens();
    const _ = vv.create(Hi.newGuid(), 0, C - 1);
    _.setType(Qn.Final), this._levels[C - 1] = [_], this._levels[C - 2].forEach((Ce) => {
      this.getPointParents(Ce).length !== 0 && Ce.addChild(_.id);
    }), this.assignTypeToPoints(), this.hideRandomPoints();
  }
  getPointParents(d) {
    return this.points.filter((h) => h.children.some((C) => C.equals(d.id)));
  }
  selectThreeInitialPoints() {
    const d = [];
    for (; d.length < 3; ) {
      const h = this.generateRandomNumberBetween(0, this._levels[0].length - 1), w = this._levels[0][h];
      d.some((A) => A.x === w.x) || d.some((A) => Math.abs(A.x - w.x) < 2) || w.x === 0 || w.x === this._levels[0].length - 1 || d.push(w);
    }
    return console.log("Initial points", d), d;
  }
  generateIsometricMapPath(d = 0, h) {
    if (h || (h = this._levels[d][this.generateRandomNumberBetween(0, this._levels[d].length - 1)]), d === this._levels.length - 1)
      return;
    const C = this.randomizeArray(this.getPossibleChildrens(d, h.x));
    for (let A = 0; A < C.length; A++) {
      const P = C[A];
      if (h.children.some((ve) => ve.equals(P.id)))
        continue;
      const _ = this._levels[d][h.x - 1];
      if (_ && _.children.some((ve) => {
        const ne = this.points.find((_e) => _e.id.equals(ve));
        return ne ? ne.x > P.x : !1;
      }))
        continue;
      const Ce = this._levels[d][h.x + 1];
      Ce && Ce.children.some((ve) => {
        const ne = this.points.find((_e) => _e.id.equals(ve));
        return ne ? ne.x < P.x : !1;
      }) || h.addChild(P.id);
    }
    const w = C[this.generateRandomNumberBetween(0, C.length - 1)];
    this.generateIsometricMapPath(d + 1, w);
  }
  getPossibleChildrens(d, h) {
    const C = [], w = this._levels[d + 1][h - 1], A = this._levels[d + 1][h + 1], P = this._levels[d + 1][h];
    return w && C.push(w), A && C.push(A), P && C.push(P), C;
  }
  clearConexionsWithoutChildrens() {
    for (let d = this._levels.length - 2; d >= 0; d--)
      for (let h = this._levels[d].length - 1; h >= 0; h--) {
        const C = this._levels[d][h];
        C.children.length === 0 && this.getPointParents(C).forEach((A) => {
          A.removeChild(C.id);
        });
      }
  }
  clearPointsWithoutChildrens() {
    for (let d = this._levels.length - 1; d >= 0; d--)
      for (let h = this._levels[d].length - 1; h >= 0; h--)
        this._levels[d][h].children.length === 0 && this._levels[d].splice(h, 1);
  }
  assignTypeToPoints() {
    const d = this.generateRandomNumberBetween(this._minNumberOfShopPoints, this._maxNumberOfShopPoints);
    let h = 0;
    for (; h < d; ) {
      const _ = this.generateRandomNumberBetween(this._minLevelShopPoints, this._levels.length - 3), Ce = this.generateRandomNumberBetween(0, this._levels[_].length - 1), ve = this._levels[_][Ce];
      if (ve.type === Qn.Battle && ve.children.length > 0) {
        const ne = IO.createShopMapPointFromPoint(ve);
        this._levels[_][Ce] = ne, h++;
      }
    }
    const C = this.generateRandomNumberBetween(this._minNumberOfRestPoints, this._maxNumberOfRestPoints);
    let w = 0;
    for (; w < C; ) {
      const _ = this.generateRandomNumberBetween(this._minLevelRestPoints, this._levels.length - 2), Ce = this.generateRandomNumberBetween(0, this._levels[_].length - 1), ve = this._levels[_][Ce];
      ve.type === Qn.Battle && ve.children.length > 0 && (ve.setType(Qn.Rest), w++);
    }
    const A = this.generateRandomNumberBetween(this._minNumberOfBossPoints, this._maxNumberOfBossPoints);
    let P = 0;
    for (; P < A; ) {
      const _ = this.generateRandomNumberBetween(this._minLevelBossPoints, this._levels.length - 3), Ce = this.generateRandomNumberBetween(0, this._levels[_].length - 1), ve = this._levels[_][Ce];
      ve.type === Qn.Battle && ve.children.length > 0 && (ve.setType(Qn.Boss), P++);
    }
  }
  hideRandomPoints() {
    const d = this.points.filter((P) => P.children.length > 0 && P.y > 0), h = Math.round(d.length / 5), C = Math.round(d.length / 3), w = this.generateRandomNumberBetween(h, C);
    let A = 0;
    for (; A < w; ) {
      const P = this.generateRandomNumberBetween(0, this._levels.length - 2), _ = this.generateRandomNumberBetween(0, this._levels[P].length - 1), Ce = this._levels[P][_];
      Ce.children.length !== 0 && (Ce.setUnknow(!0), A++);
    }
  }
  removeEmptyColumns() {
    for (let d = 0; d < this._levels.length; d++) {
      let h = !0;
      for (let C = 0; C < this._levels[d].length; C++)
        if (this._levels[C][d].children.length > 0) {
          h = !1;
          break;
        }
      h && this._levels.forEach((C) => {
        C.splice(d, 1);
      });
    }
  }
  generateRandomNumberBetween(d, h) {
    return Math.floor(Math.random() * (h - d + 1)) + d;
  }
  randomizeArray(d) {
    return d.sort(() => Math.random() - 0.5);
  }
}
class io extends od {
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
  constructor(d) {
    super(d), this._score = 0, this._objetiveScore = 0, this._remainingActions = 0, this._remainingDiscards = 0;
  }
  static create() {
    return new io(Hi.newGuid());
  }
  setCardPlay(d) {
    this._cardPlays.set(d.name, d);
  }
  init(d) {
    this._objetiveScore = d.objectiveScore, this._remainingActions = d.playablesHands, this._remainingDiscards = d.playablesDiscards;
  }
  run(d) {
    const h = this.findCardPlays(d), C = this.executeCardPlays(h, d);
    this._remainingActions--;
    const w = C.reduce((P, _) => P + _.points, 0), A = C.reduce((P, _) => P * _.multiplier, 1);
    return this._score += w * A, C;
  }
  downRemainingDiscards() {
    this._remainingDiscards--;
  }
  findCardPlays(d) {
    return Array.from(this._cardPlays.values()).filter((h) => h.isPlayable(d));
  }
  executeCardPlays(d, h) {
    return d.map((C) => C.play(h));
  }
}
var fC = pv();
const id = /* @__PURE__ */ vO(fC);
class YO extends id.Component {
  _animationsManager;
  constructor(d) {
    super(d), this._animationsManager = jn.get(_c), this.state = {
      currentAnimation: 0
    };
  }
  componentDidMount() {
    const { cardsScore: d } = this.props;
    if (d.length === 0)
      return;
    const h = setInterval(() => {
      if (d.length === 0) {
        clearInterval(h);
        return;
      }
      this.setState((C) => {
        if (C.currentAnimation === d.length - 1) {
          clearInterval(h), this.props.onScoreAnimationEnd();
          return;
        }
        return {
          ...C,
          currentAnimation: C.currentAnimation + 1
        };
      });
    }, this._animationsManager.getVelocity() * 1e3);
  }
  render() {
    const { cards: d, cardsScore: h } = this.props, { currentAnimation: C } = this.state;
    return /* @__PURE__ */ Fe.jsx("div", { className: "move", children: d.map((w) => /* @__PURE__ */ Fe.jsx(
      UO,
      {
        card: w,
        score: h[C]?.cards.some((A) => A.id.equals(w.id)) ? h[C].points : void 0,
        animations: h[C]?.cards.some((A) => A.id.equals(w.id)) ? ["score-animation"] : void 0
      },
      w.id.toString()
    )) });
  }
}
function WO(g) {
  const d = jn.get(_c), [h, C] = id.useState(0), [w, A] = id.useState(0), [P, _] = id.useState("");
  fC.useEffect(() => {
    if (g.cardsScore.length === 0)
      return;
    const { cardsScore: ne } = g, _e = setInterval(() => {
      if (ne.length === 0) {
        clearInterval(_e);
        return;
      }
      const re = ne[ne.length - 1];
      C((Ne) => Ne + re.points), A((Ne) => Ne + re.multiplier), _(re.play), ne.pop(), console.log("cardsScore", ne);
    }, d.getVelocity() * 1e3);
  }, [g]);
  const { currentScore: Ce, objetiveScore: ve } = g;
  return /* @__PURE__ */ Fe.jsxs("div", { className: "points", children: [
    /* @__PURE__ */ Fe.jsxs("div", { className: "current-points", children: [
      Ce,
      " / ",
      ve
    ] }),
    /* @__PURE__ */ Fe.jsxs("div", { className: "last-game", children: [
      "Última jugada: ",
      P
    ] }),
    /* @__PURE__ */ Fe.jsxs("div", { className: "last-game-points", children: [
      "Puntos: ",
      h
    ] }),
    /* @__PURE__ */ Fe.jsxs("div", { className: "last-game-multipliers", children: [
      "Multiplicador: ",
      w
    ] })
  ] });
}
function GO(g) {
  const [d, h] = id.useState();
  function C(P) {
    console.log("purchaseCardPlay", d, P), !d && (g.onPurchaseCardPlay(P), h(P));
  }
  const { rewards: w, onPurchasedRewards: A } = g;
  return /* @__PURE__ */ Fe.jsx(Fe.Fragment, { children: /* @__PURE__ */ Fe.jsx("div", { className: "battle-win-content", children: /* @__PURE__ */ Fe.jsxs("div", { className: "battle-rewards", children: [
    /* @__PURE__ */ Fe.jsx("div", { className: "battle-rewards-title", children: "Victoria" }),
    /* @__PURE__ */ Fe.jsx("div", { className: "battle-rewards-gold", children: "+ 1000$" }),
    /* @__PURE__ */ Fe.jsx("div", { className: "battle-rewards-consumables", children: /* @__PURE__ */ Fe.jsx("div", {}) }),
    /* @__PURE__ */ Fe.jsx("div", { className: "battle-rewards-card-plays", children: w.cardPlays.map((P, _) => /* @__PURE__ */ Fe.jsx(
      "div",
      {
        className: `card-plays-reward ${d === P ? "purchased" : ""}`,
        onClick: () => C(P),
        children: P
      },
      _
    )) }),
    /* @__PURE__ */ Fe.jsx("div", { className: "battle-rewards-actions", children: /* @__PURE__ */ Fe.jsx("button", { onClick: () => A(), children: "Continuar" }) })
  ] }) }) });
}
var QO = Object.defineProperty, qO = Object.getOwnPropertyDescriptor, XO = (g, d, h, C) => {
  for (var w = C > 1 ? void 0 : C ? qO(d, h) : d, A = g.length - 1, P; A >= 0; A--)
    (P = g[A]) && (w = (C ? P(d, h, w) : P(w)) || w);
  return C && w && QO(d, h, w), w;
};
let py = class {
  constructor(g, d, h, C, w, A) {
    this._logger = g, this._sceneEventBus = d, this._battleEventBus = h, this._animationsManager = C, this._state = w, this._battleContext = A;
    const P = this._state.subscribeTo(
      Ec,
      El,
      ({ payload: _e }) => {
        this._logger.logInfo("Deck updated", JSON.stringify(_e)), this._deck = _e, this.render();
      }
    );
    this._subscriptions.push(P);
    const _ = this._state.subscribeTo(
      Ec,
      io,
      ({ payload: _e }) => {
        this._logger.logInfo("BattleScoreManager updated", JSON.stringify(_e)), this._battleScoreManager = _e, this.render();
      }
    );
    this._subscriptions.push(_);
    const Ce = this._battleEventBus.subscribeTo(
      my,
      Array,
      ({ payload: _e }) => {
        this._playedCards.push(_e), this.render();
      }
    );
    this._subscriptions.push(Ce);
    const ve = this._battleEventBus.subscribe(
      gy,
      () => {
        this._battleStatus = 2, this._possibleRewards = this._battleContext.generateRewards(), this.render();
      }
    );
    this._subscriptions.push(ve);
    const ne = this._battleEventBus.subscribe(
      yy,
      () => {
        this._battleStatus = 3, this.render();
      }
    );
    this._subscriptions.push(ne);
  }
  _root = void 0;
  _deck = void 0;
  _battleScoreManager = void 0;
  _subscriptions = [];
  _playedCards = [];
  _battleStatus = 0;
  _possibleRewards = void 0;
  load(g) {
    this._root = g, this._deck = this._state.getOrThrow(El), this._battleScoreManager = this._state.getOrThrow(io), this.render();
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
    this._root && this._root.render(
      /* @__PURE__ */ Fe.jsxs(Fe.Fragment, { children: [
        /* @__PURE__ */ Fe.jsxs("div", { onClick: () => this.changeAnimationsVelocity(), children: [
          "Animation velocity (",
          this._animationsManager.getVelocity(),
          ")"
        ] }),
        /* @__PURE__ */ Fe.jsx("div", { children: this._battleScoreManager?.cardPlays.map((g, d) => /* @__PURE__ */ Fe.jsxs("div", { children: [
          g.name,
          " x",
          g.level
        ] }, d)) }),
        /* @__PURE__ */ Fe.jsxs("div", { className: "battle-scene", children: [
          /* @__PURE__ */ Fe.jsxs("div", { className: "status", children: [
            /* @__PURE__ */ Fe.jsxs("div", { className: "hands", children: [
              "Manos: ",
              this._battleScoreManager?.remainingActions
            ] }),
            /* @__PURE__ */ Fe.jsxs("div", { className: "discards", children: [
              "Descartes: ",
              this._battleScoreManager?.remainingDiscards
            ] }),
            /* @__PURE__ */ Fe.jsx("div", { className: "gold", children: "Oro: 1000$" })
          ] }),
          /* @__PURE__ */ Fe.jsx(
            WO,
            {
              cardsScore: this._playedCards || [],
              currentScore: this._battleScoreManager?.score || 0,
              objetiveScore: this._battleScoreManager?.objetiveScore || 0
            }
          ),
          (this._deck?.lastPlayedCards || []).length > 0 && /* @__PURE__ */ Fe.jsx(
            YO,
            {
              cards: this._deck?.lastPlayedCards || [],
              cardsScore: [],
              onScoreAnimationEnd: () => this.onScoreAnimationEnd()
            }
          ),
          /* @__PURE__ */ Fe.jsx("div", { className: "run", children: /* @__PURE__ */ Fe.jsx(
            "button",
            {
              className: "run-button",
              onClick: () => this.onPlayClick(),
              disabled: this._deck?.selectedCards?.length === 0 || this._battleScoreManager?.remainingActions === 0,
              children: "Jugar"
            }
          ) }),
          /* @__PURE__ */ Fe.jsx("div", { className: "discard", children: /* @__PURE__ */ Fe.jsx(
            "button",
            {
              className: "discard-button",
              onClick: () => this.onDiscardClick(),
              disabled: this._deck?.selectedCards?.length === 0 || this._battleScoreManager?.remainingDiscards === 0,
              children: "Descartar"
            }
          ) }),
          /* @__PURE__ */ Fe.jsx(
            PO,
            {
              cards: this._deck?.handCards || [],
              selectedCards: this._deck?.selectedCards || [],
              onCardClick: (g) => this.onHandCardClick(g)
            }
          ),
          /* @__PURE__ */ Fe.jsx("div", { className: "battle-win", hidden: this._battleStatus !== 2, children: /* @__PURE__ */ Fe.jsx(
            GO,
            {
              rewards: this._possibleRewards || { money: 0, cardPlays: [] },
              onPurchaseCardPlay: (g) => this.onPurchaseCardPlay(g),
              onPurchasedRewards: () => this.onRewardsPurchased()
            }
          ) }),
          /* @__PURE__ */ Fe.jsx("div", { className: "battle-lost", hidden: this._battleStatus !== 3, children: /* @__PURE__ */ Fe.jsx("div", { className: "battle-lost-content", children: "Perdiste" }) })
        ] })
      ] })
    );
  }
  dispose() {
    this._subscriptions.forEach((g) => g.unsubscribe()), this._root = void 0, this._deck = void 0, this._battleScoreManager = void 0, this._battleStatus = 0;
  }
};
py = XO([
  vi()
], py);
var Xo = /* @__PURE__ */ ((g) => (g.Home = "Home", g.Battle = "Battle", g.Map = "Map", g.GameOver = "GameOver", g))(Xo || {}), cv = /* @__PURE__ */ ((g) => (g.Original = "Original", g.Random = "Random", g))(cv || {});
class dC extends El {
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
class pC extends El {
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
    for (const d of Array.from({ length: 42 }, (h, C) => C)) {
      const h = fy[Math.floor(Math.random() * 4)], C = Math.floor(Math.random() * 12) + 1, w = Sy.create(Hi.newGuid(), h, C);
      this._cards.set(w);
    }
  }
}
class KO {
  static createDeck(d) {
    switch (d) {
      case cv.Original:
        return dC.create();
      case cv.Random:
        return pC.create();
      default:
        throw new Error("Invalid deck type");
    }
  }
}
var ZO = Object.defineProperty, JO = Object.getOwnPropertyDescriptor, ek = (g, d, h, C) => {
  for (var w = C > 1 ? void 0 : C ? JO(d, h) : d, A = g.length - 1, P; A >= 0; A--)
    (P = g[A]) && (w = (C ? P(d, h, w) : P(w)) || w);
  return C && w && ZO(d, h, w), w;
};
let fv = class {
  constructor(g, d) {
    this._sceneEventBus = g, this._gameContext = d;
  }
  _root = void 0;
  load(g) {
    this._root = g;
  }
  startGame(g) {
    this._gameContext.newRun(g);
    const d = ud.create(Xo.Map);
    this._sceneEventBus.publish(d);
  }
  render() {
    this._root && this._root.render(
      /* @__PURE__ */ Fe.jsxs("div", { className: "home-scene", children: [
        /* @__PURE__ */ Fe.jsx("div", { className: "title", children: /* @__PURE__ */ Fe.jsx("h1", { children: "Home Scene" }) }),
        /* @__PURE__ */ Fe.jsxs("div", { className: "actions", children: [
          /* @__PURE__ */ Fe.jsx("div", { className: "deck-cover", onClick: () => this.startGame(cv.Original), children: "Original" }),
          /* @__PURE__ */ Fe.jsx("div", { className: "deck-cover", onClick: () => this.startGame(cv.Random), children: "Random" })
        ] })
      ] })
    );
  }
  dispose() {
  }
};
fv = ek([
  vi()
], fv);
function tk(g) {
  return /* @__PURE__ */ Fe.jsx("div", { className: "map-level", children: g.children });
}
function nk(g) {
  const d = id.useRef(null);
  fC.useEffect(() => {
    const { mapPoint: A, points: P } = g;
    if (A.children.length === 0)
      return;
    const _ = P.filter((ne) => A.children.some((_e) => _e.equals(ne.id))), Ce = [];
    for (const ne of _) {
      const _e = ne && document.getElementById(ne.id.toString()), re = _e?.getBoundingClientRect(), Ne = d.current, ce = Ne?.getBoundingClientRect();
      if (!_e || !re || !Ne || !ce)
        return;
      const be = re.y + re.height - ce.y, ct = 0;
      let Kt, Ct;
      ce.x >= re.x ? (Kt = -(ce.x - re.x), Ct = ce.x + ce.width - re.x) : (Kt = 0, Ct = re.x + re.width - ce.x);
      let Xe, Qe;
      const Nt = ce.height / 2, Le = be - re.height / 2;
      ce.x >= re.x ? (Xe = Ct - re.width / 2, Qe = re.width - ce.width / 2) : (Xe = ce.width / 2, Qe = Ct - re.width / 2), Ce.push({ width: Ct, height: be, top: ct, left: Kt, x: Xe, y: Nt, x1: Qe, y1: Le });
    }
    const ve = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`;
    for (const { width: ne, height: _e, top: re, left: Ne, x: ce, y: be, x1: ct, y1: Kt } of Ce) {
      const Ct = document.createElement("canvas"), Xe = Ct.getContext("2d");
      Ct.width = ne, Ct.height = _e, Ct.style.width = `${ne}px`, Ct.style.height = `${_e}px`, Ct.style.top = `${re}px`, Ct.style.left = `${Ne}px`, Xe.beginPath(), Xe.lineWidth = 2, Xe.strokeStyle = ve, g.level % 2 !== 0 && Xe.setLineDash([5, 5]), Xe.moveTo(ce, be), Xe.lineTo(ct, Kt), Xe.stroke(), d.current?.appendChild(Ct);
    }
  }, []);
  function h() {
    if (C.children.length === 0 && C.type !== Qn.Final)
      return;
    let A = {};
    C.type === Qn.Final && (A.backgroundColor = "#FFEBEE", A.borderColor = "#FFCDD2"), C.type === Qn.Battle && (A.backgroundColor = "#ECEFF1", A.borderColor = "#CFD8DC"), C.type === Qn.Boss && (A.backgroundColor = "#FFEBEE", A.borderColor = "#FFCDD2"), C.type === Qn.Rest && (A.backgroundColor = "#E1F5FE", A.borderColor = "#B3E5FC"), C.type === Qn.Shop && (A.backgroundColor = "#FFF8E1", A.borderColor = "#FFECB3"), C.isUnknow && (A.backgroundColor = "#F3E5F5", A.borderColor = "#E1BEE7");
    let P = "map-point-description";
    return (w?.children.some((Ce) => Ce.equals(C.id)) || !g.currentPoint && g.mapPoint.y === 0) && (P += " map-point-visitable", A = {}), g.currentPoint?.id.equals(C.id) && (P += " map-point-current", A = {}), /* @__PURE__ */ Fe.jsx("div", { className: P, style: A, children: _() });
    function _() {
      if (C.isUnknow)
        return /* @__PURE__ */ Fe.jsx("span", { className: "material-symbols-outlined", children: "question_mark" });
      if (C.type === Qn.Final)
        return /* @__PURE__ */ Fe.jsx("span", { className: "material-symbols-outlined", children: "local_shipping" });
      if (C.type === Qn.Battle)
        return /* @__PURE__ */ Fe.jsx("span", { className: "material-symbols-outlined", children: "eject" });
      if (C.type === Qn.Boss)
        return /* @__PURE__ */ Fe.jsx("span", { className: "material-symbols-outlined", children: "dangerous" });
      if (C.type === Qn.Rest)
        return /* @__PURE__ */ Fe.jsx("span", { className: "material-symbols-outlined", children: "hotel" });
      if (C.type === Qn.Shop)
        return /* @__PURE__ */ Fe.jsx("span", { className: "material-symbols-outlined", children: "storefront" });
    }
  }
  const { mapPoint: C, currentPoint: w } = g;
  return w?.children.some((A) => A.equals(C.id)), g.currentPoint?.id.equals(C.id), /* @__PURE__ */ Fe.jsx(
    "div",
    {
      id: C.id.toString(),
      ref: d,
      className: "map-point",
      style: { marginTop: `${C.position.top}px`, marginLeft: `${C.position.left}px` },
      onClick: g.onClick,
      children: h()
    }
  );
}
var rk = Object.defineProperty, ak = Object.getOwnPropertyDescriptor, ik = (g, d, h, C) => {
  for (var w = C > 1 ? void 0 : C ? ak(d, h) : d, A = g.length - 1, P; A >= 0; A--)
    (P = g[A]) && (w = (C ? P(d, h, w) : P(w)) || w);
  return C && w && rk(d, h, w), w;
};
let vy = class {
  constructor(g, d, h) {
    this._sceneEventBus = g, this._state = d, this._mapContext = h;
    const C = this._state.subscribeTo(
      Ec,
      bc,
      ({ payload: w }) => {
        this._map = w, this.render();
      }
    );
    this._subscriptions.push(C);
  }
  _map = void 0;
  _root = void 0;
  _subscriptions = [];
  changeCurrentPoint(g) {
    this._mapContext.goToPoint(g);
  }
  load(g) {
    this._root = g, this._map = this._state.getOrThrow(bc), this.render();
  }
  render() {
    if (!this._root || !this._map)
      return;
    const g = this._map;
    this._root.render(
      /* @__PURE__ */ Fe.jsx("div", { className: "map-layout", children: this._map.levels.map((d, h) => /* @__PURE__ */ Fe.jsx(tk, { children: d.map((C) => /* @__PURE__ */ Fe.jsx(
        nk,
        {
          mapPoint: C,
          level: h,
          lastLevel: g.levels.length - 1,
          currentLevel: g.currentLevel,
          currentPoint: g.currentPoint,
          points: g.points,
          onClick: () => this.changeCurrentPoint(C)
        },
        C.id.toString()
      )) }, h)) })
    );
  }
  dispose() {
    this._subscriptions.forEach((g) => g.unsubscribe());
  }
};
vy = ik([
  vi()
], vy);
var Z0 = { exports: {} }, Ja = {}, oy = { exports: {} }, Q0 = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var u1;
function lk() {
  return u1 || (u1 = 1, function(g) {
    function d(K, ke) {
      var O = K.length;
      K.push(ke);
      e:
        for (; 0 < O; ) {
          var J = O - 1 >>> 1, ee = K[J];
          if (0 < w(ee, ke))
            K[J] = ke, K[O] = ee, O = J;
          else
            break e;
        }
    }
    function h(K) {
      return K.length === 0 ? null : K[0];
    }
    function C(K) {
      if (K.length === 0)
        return null;
      var ke = K[0], O = K.pop();
      if (O !== ke) {
        K[0] = O;
        e:
          for (var J = 0, ee = K.length, Ge = ee >>> 1; J < Ge; ) {
            var tt = 2 * (J + 1) - 1, Ve = K[tt], gt = tt + 1, Rt = K[gt];
            if (0 > w(Ve, O))
              gt < ee && 0 > w(Rt, Ve) ? (K[J] = Rt, K[gt] = O, J = gt) : (K[J] = Ve, K[tt] = O, J = tt);
            else if (gt < ee && 0 > w(Rt, O))
              K[J] = Rt, K[gt] = O, J = gt;
            else
              break e;
          }
      }
      return ke;
    }
    function w(K, ke) {
      var O = K.sortIndex - ke.sortIndex;
      return O !== 0 ? O : K.id - ke.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var A = performance;
      g.unstable_now = function() {
        return A.now();
      };
    } else {
      var P = Date, _ = P.now();
      g.unstable_now = function() {
        return P.now() - _;
      };
    }
    var Ce = [], ve = [], ne = 1, _e = null, re = 3, Ne = !1, ce = !1, be = !1, ct = typeof setTimeout == "function" ? setTimeout : null, Kt = typeof clearTimeout == "function" ? clearTimeout : null, Ct = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Xe(K) {
      for (var ke = h(ve); ke !== null; ) {
        if (ke.callback === null)
          C(ve);
        else if (ke.startTime <= K)
          C(ve), ke.sortIndex = ke.expirationTime, d(Ce, ke);
        else
          break;
        ke = h(ve);
      }
    }
    function Qe(K) {
      if (be = !1, Xe(K), !ce)
        if (h(Ce) !== null)
          ce = !0, Dt(Nt);
        else {
          var ke = h(ve);
          ke !== null && vt(Qe, ke.startTime - K);
        }
    }
    function Nt(K, ke) {
      ce = !1, be && (be = !1, Kt(ot), ot = -1), Ne = !0;
      var O = re;
      try {
        for (Xe(ke), _e = h(Ce); _e !== null && (!(_e.expirationTime > ke) || K && !Zt()); ) {
          var J = _e.callback;
          if (typeof J == "function") {
            _e.callback = null, re = _e.priorityLevel;
            var ee = J(_e.expirationTime <= ke);
            ke = g.unstable_now(), typeof ee == "function" ? _e.callback = ee : _e === h(Ce) && C(Ce), Xe(ke);
          } else
            C(Ce);
          _e = h(Ce);
        }
        if (_e !== null)
          var Ge = !0;
        else {
          var tt = h(ve);
          tt !== null && vt(Qe, tt.startTime - ke), Ge = !1;
        }
        return Ge;
      } finally {
        _e = null, re = O, Ne = !1;
      }
    }
    var Le = !1, wt = null, ot = -1, En = 5, gn = -1;
    function Zt() {
      return !(g.unstable_now() - gn < En);
    }
    function xt() {
      if (wt !== null) {
        var K = g.unstable_now();
        gn = K;
        var ke = !0;
        try {
          ke = wt(!0, K);
        } finally {
          ke ? nn() : (Le = !1, wt = null);
        }
      } else
        Le = !1;
    }
    var nn;
    if (typeof Ct == "function")
      nn = function() {
        Ct(xt);
      };
    else if (typeof MessageChannel < "u") {
      var nt = new MessageChannel(), ft = nt.port2;
      nt.port1.onmessage = xt, nn = function() {
        ft.postMessage(null);
      };
    } else
      nn = function() {
        ct(xt, 0);
      };
    function Dt(K) {
      wt = K, Le || (Le = !0, nn());
    }
    function vt(K, ke) {
      ot = ct(function() {
        K(g.unstable_now());
      }, ke);
    }
    g.unstable_IdlePriority = 5, g.unstable_ImmediatePriority = 1, g.unstable_LowPriority = 4, g.unstable_NormalPriority = 3, g.unstable_Profiling = null, g.unstable_UserBlockingPriority = 2, g.unstable_cancelCallback = function(K) {
      K.callback = null;
    }, g.unstable_continueExecution = function() {
      ce || Ne || (ce = !0, Dt(Nt));
    }, g.unstable_forceFrameRate = function(K) {
      0 > K || 125 < K ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : En = 0 < K ? Math.floor(1e3 / K) : 5;
    }, g.unstable_getCurrentPriorityLevel = function() {
      return re;
    }, g.unstable_getFirstCallbackNode = function() {
      return h(Ce);
    }, g.unstable_next = function(K) {
      switch (re) {
        case 1:
        case 2:
        case 3:
          var ke = 3;
          break;
        default:
          ke = re;
      }
      var O = re;
      re = ke;
      try {
        return K();
      } finally {
        re = O;
      }
    }, g.unstable_pauseExecution = function() {
    }, g.unstable_requestPaint = function() {
    }, g.unstable_runWithPriority = function(K, ke) {
      switch (K) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          K = 3;
      }
      var O = re;
      re = K;
      try {
        return ke();
      } finally {
        re = O;
      }
    }, g.unstable_scheduleCallback = function(K, ke, O) {
      var J = g.unstable_now();
      switch (typeof O == "object" && O !== null ? (O = O.delay, O = typeof O == "number" && 0 < O ? J + O : J) : O = J, K) {
        case 1:
          var ee = -1;
          break;
        case 2:
          ee = 250;
          break;
        case 5:
          ee = 1073741823;
          break;
        case 4:
          ee = 1e4;
          break;
        default:
          ee = 5e3;
      }
      return ee = O + ee, K = { id: ne++, callback: ke, priorityLevel: K, startTime: O, expirationTime: ee, sortIndex: -1 }, O > J ? (K.sortIndex = O, d(ve, K), h(Ce) === null && K === h(ve) && (be ? (Kt(ot), ot = -1) : be = !0, vt(Qe, O - J))) : (K.sortIndex = ee, d(Ce, K), ce || Ne || (ce = !0, Dt(Nt))), K;
    }, g.unstable_shouldYield = Zt, g.unstable_wrapCallback = function(K) {
      var ke = re;
      return function() {
        var O = re;
        re = ke;
        try {
          return K.apply(this, arguments);
        } finally {
          re = O;
        }
      };
    };
  }(Q0)), Q0;
}
var q0 = {}, s1;
function ok() {
  return s1 || (s1 = 1, function(g) {
    var d = {};
    /**
     * @license React
     * scheduler.development.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    d.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var h = !1, C = !1, w = 5;
      function A(D, U) {
        var q = D.length;
        D.push(U), Ce(D, U, q);
      }
      function P(D) {
        return D.length === 0 ? null : D[0];
      }
      function _(D) {
        if (D.length === 0)
          return null;
        var U = D[0], q = D.pop();
        return q !== U && (D[0] = q, ve(D, q, 0)), U;
      }
      function Ce(D, U, q) {
        for (var he = q; he > 0; ) {
          var Ke = he - 1 >>> 1, Et = D[Ke];
          if (ne(Et, U) > 0)
            D[Ke] = U, D[he] = Et, he = Ke;
          else
            return;
        }
      }
      function ve(D, U, q) {
        for (var he = q, Ke = D.length, Et = Ke >>> 1; he < Et; ) {
          var Be = (he + 1) * 2 - 1, fe = D[Be], ue = Be + 1, ye = D[ue];
          if (ne(fe, U) < 0)
            ue < Ke && ne(ye, fe) < 0 ? (D[he] = ye, D[ue] = U, he = ue) : (D[he] = fe, D[Be] = U, he = Be);
          else if (ue < Ke && ne(ye, U) < 0)
            D[he] = ye, D[ue] = U, he = ue;
          else
            return;
        }
      }
      function ne(D, U) {
        var q = D.sortIndex - U.sortIndex;
        return q !== 0 ? q : D.id - U.id;
      }
      var _e = 1, re = 2, Ne = 3, ce = 4, be = 5;
      function ct(D, U) {
      }
      var Kt = typeof performance == "object" && typeof performance.now == "function";
      if (Kt) {
        var Ct = performance;
        g.unstable_now = function() {
          return Ct.now();
        };
      } else {
        var Xe = Date, Qe = Xe.now();
        g.unstable_now = function() {
          return Xe.now() - Qe;
        };
      }
      var Nt = 1073741823, Le = -1, wt = 250, ot = 5e3, En = 1e4, gn = Nt, Zt = [], xt = [], nn = 1, nt = null, ft = Ne, Dt = !1, vt = !1, K = !1, ke = typeof setTimeout == "function" ? setTimeout : null, O = typeof clearTimeout == "function" ? clearTimeout : null, J = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function ee(D) {
        for (var U = P(xt); U !== null; ) {
          if (U.callback === null)
            _(xt);
          else if (U.startTime <= D)
            _(xt), U.sortIndex = U.expirationTime, A(Zt, U);
          else
            return;
          U = P(xt);
        }
      }
      function Ge(D) {
        if (K = !1, ee(D), !vt)
          if (P(Zt) !== null)
            vt = !0, mr(tt);
          else {
            var U = P(xt);
            U !== null && on(Ge, U.startTime - D);
          }
      }
      function tt(D, U) {
        vt = !1, K && (K = !1, jr()), Dt = !0;
        var q = ft;
        try {
          var he;
          if (!C)
            return Ve(D, U);
        } finally {
          nt = null, ft = q, Dt = !1;
        }
      }
      function Ve(D, U) {
        var q = U;
        for (ee(q), nt = P(Zt); nt !== null && !h && !(nt.expirationTime > q && (!D || nr())); ) {
          var he = nt.callback;
          if (typeof he == "function") {
            nt.callback = null, ft = nt.priorityLevel;
            var Ke = nt.expirationTime <= q, Et = he(Ke);
            q = g.unstable_now(), typeof Et == "function" ? nt.callback = Et : nt === P(Zt) && _(Zt), ee(q);
          } else
            _(Zt);
          nt = P(Zt);
        }
        if (nt !== null)
          return !0;
        var Be = P(xt);
        return Be !== null && on(Ge, Be.startTime - q), !1;
      }
      function gt(D, U) {
        switch (D) {
          case _e:
          case re:
          case Ne:
          case ce:
          case be:
            break;
          default:
            D = Ne;
        }
        var q = ft;
        ft = D;
        try {
          return U();
        } finally {
          ft = q;
        }
      }
      function Rt(D) {
        var U;
        switch (ft) {
          case _e:
          case re:
          case Ne:
            U = Ne;
            break;
          default:
            U = ft;
            break;
        }
        var q = ft;
        ft = U;
        try {
          return D();
        } finally {
          ft = q;
        }
      }
      function yt(D) {
        var U = ft;
        return function() {
          var q = ft;
          ft = U;
          try {
            return D.apply(this, arguments);
          } finally {
            ft = q;
          }
        };
      }
      function rn(D, U, q) {
        var he = g.unstable_now(), Ke;
        if (typeof q == "object" && q !== null) {
          var Et = q.delay;
          typeof Et == "number" && Et > 0 ? Ke = he + Et : Ke = he;
        } else
          Ke = he;
        var Be;
        switch (D) {
          case _e:
            Be = Le;
            break;
          case re:
            Be = wt;
            break;
          case be:
            Be = gn;
            break;
          case ce:
            Be = En;
            break;
          case Ne:
          default:
            Be = ot;
            break;
        }
        var fe = Ke + Be, ue = {
          id: nn++,
          callback: U,
          priorityLevel: D,
          startTime: Ke,
          expirationTime: fe,
          sortIndex: -1
        };
        return Ke > he ? (ue.sortIndex = Ke, A(xt, ue), P(Zt) === null && ue === P(xt) && (K ? jr() : K = !0, on(Ge, Ke - he))) : (ue.sortIndex = fe, A(Zt, ue), !vt && !Dt && (vt = !0, mr(tt))), ue;
      }
      function Jt() {
      }
      function qn() {
        !vt && !Dt && (vt = !0, mr(tt));
      }
      function Fn() {
        return P(Zt);
      }
      function tr(D) {
        D.callback = null;
      }
      function Sn() {
        return ft;
      }
      var Hn = !1, Mn = null, _n = -1, bn = w, sr = -1;
      function nr() {
        var D = g.unstable_now() - sr;
        return !(D < bn);
      }
      function wn() {
      }
      function zr(D) {
        if (D < 0 || D > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        D > 0 ? bn = Math.floor(1e3 / D) : bn = w;
      }
      var Ur = function() {
        if (Mn !== null) {
          var D = g.unstable_now();
          sr = D;
          var U = !0, q = !0;
          try {
            q = Mn(U, D);
          } finally {
            q ? cr() : (Hn = !1, Mn = null);
          }
        } else
          Hn = !1;
      }, cr;
      if (typeof J == "function")
        cr = function() {
          J(Ur);
        };
      else if (typeof MessageChannel < "u") {
        var Pr = new MessageChannel(), Rn = Pr.port2;
        Pr.port1.onmessage = Ur, cr = function() {
          Rn.postMessage(null);
        };
      } else
        cr = function() {
          ke(Ur, 0);
        };
      function mr(D) {
        Mn = D, Hn || (Hn = !0, cr());
      }
      function on(D, U) {
        _n = ke(function() {
          D(g.unstable_now());
        }, U);
      }
      function jr() {
        O(_n), _n = -1;
      }
      var yr = wn, z = null;
      g.unstable_IdlePriority = be, g.unstable_ImmediatePriority = _e, g.unstable_LowPriority = ce, g.unstable_NormalPriority = Ne, g.unstable_Profiling = z, g.unstable_UserBlockingPriority = re, g.unstable_cancelCallback = tr, g.unstable_continueExecution = qn, g.unstable_forceFrameRate = zr, g.unstable_getCurrentPriorityLevel = Sn, g.unstable_getFirstCallbackNode = Fn, g.unstable_next = Rt, g.unstable_pauseExecution = Jt, g.unstable_requestPaint = yr, g.unstable_runWithPriority = gt, g.unstable_scheduleCallback = rn, g.unstable_shouldYield = nr, g.unstable_wrapCallback = yt, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(q0)), q0;
}
var c1;
function g1() {
  if (c1)
    return oy.exports;
  c1 = 1;
  var g = {};
  return g.NODE_ENV === "production" ? oy.exports = lk() : oy.exports = ok(), oy.exports;
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
function uk() {
  if (f1)
    return Ja;
  f1 = 1;
  var g = pv(), d = g1();
  function h(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++)
      r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var C = /* @__PURE__ */ new Set(), w = {};
  function A(n, r) {
    P(n, r), P(n + "Capture", r);
  }
  function P(n, r) {
    for (w[n] = r, n = 0; n < r.length; n++)
      C.add(r[n]);
  }
  var _ = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Ce = Object.prototype.hasOwnProperty, ve = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, ne = {}, _e = {};
  function re(n) {
    return Ce.call(_e, n) ? !0 : Ce.call(ne, n) ? !1 : ve.test(n) ? _e[n] = !0 : (ne[n] = !0, !1);
  }
  function Ne(n, r, l, u) {
    if (l !== null && l.type === 0)
      return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return u ? !1 : l !== null ? !l.acceptsBooleans : (n = n.toLowerCase().slice(0, 5), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function ce(n, r, l, u) {
    if (r === null || typeof r > "u" || Ne(n, r, l, u))
      return !0;
    if (u)
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
  function be(n, r, l, u, c, p, S) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = u, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = p, this.removeEmptyString = S;
  }
  var ct = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    ct[n] = new be(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    ct[r] = new be(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    ct[n] = new be(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    ct[n] = new be(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    ct[n] = new be(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    ct[n] = new be(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    ct[n] = new be(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    ct[n] = new be(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    ct[n] = new be(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var Kt = /[\-:]([a-z])/g;
  function Ct(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      Kt,
      Ct
    );
    ct[r] = new be(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(Kt, Ct);
    ct[r] = new be(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(Kt, Ct);
    ct[r] = new be(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    ct[n] = new be(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), ct.xlinkHref = new be("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    ct[n] = new be(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function Xe(n, r, l, u) {
    var c = ct.hasOwnProperty(r) ? ct[r] : null;
    (c !== null ? c.type !== 0 : u || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (ce(r, l, c, u) && (l = null), u || c === null ? re(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, u = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, u ? n.setAttributeNS(u, r, l) : n.setAttribute(r, l))));
  }
  var Qe = g.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Nt = Symbol.for("react.element"), Le = Symbol.for("react.portal"), wt = Symbol.for("react.fragment"), ot = Symbol.for("react.strict_mode"), En = Symbol.for("react.profiler"), gn = Symbol.for("react.provider"), Zt = Symbol.for("react.context"), xt = Symbol.for("react.forward_ref"), nn = Symbol.for("react.suspense"), nt = Symbol.for("react.suspense_list"), ft = Symbol.for("react.memo"), Dt = Symbol.for("react.lazy"), vt = Symbol.for("react.offscreen"), K = Symbol.iterator;
  function ke(n) {
    return n === null || typeof n != "object" ? null : (n = K && n[K] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var O = Object.assign, J;
  function ee(n) {
    if (J === void 0)
      try {
        throw Error();
      } catch (l) {
        var r = l.stack.trim().match(/\n( *(at )?)/);
        J = r && r[1] || "";
      }
    return `
` + J + n;
  }
  var Ge = !1;
  function tt(n, r) {
    if (!n || Ge)
      return "";
    Ge = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (r)
        if (r = function() {
          throw Error();
        }, Object.defineProperty(r.prototype, "props", { set: function() {
          throw Error();
        } }), typeof Reflect == "object" && Reflect.construct) {
          try {
            Reflect.construct(r, []);
          } catch (Y) {
            var u = Y;
          }
          Reflect.construct(n, [], r);
        } else {
          try {
            r.call();
          } catch (Y) {
            u = Y;
          }
          n.call(r.prototype);
        }
      else {
        try {
          throw Error();
        } catch (Y) {
          u = Y;
        }
        n();
      }
    } catch (Y) {
      if (Y && u && typeof Y.stack == "string") {
        for (var c = Y.stack.split(`
`), p = u.stack.split(`
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
      Ge = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? ee(n) : "";
  }
  function Ve(n) {
    switch (n.tag) {
      case 5:
        return ee(n.type);
      case 16:
        return ee("Lazy");
      case 13:
        return ee("Suspense");
      case 19:
        return ee("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = tt(n.type, !1), n;
      case 11:
        return n = tt(n.type.render, !1), n;
      case 1:
        return n = tt(n.type, !0), n;
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
      case wt:
        return "Fragment";
      case Le:
        return "Portal";
      case En:
        return "Profiler";
      case ot:
        return "StrictMode";
      case nn:
        return "Suspense";
      case nt:
        return "SuspenseList";
    }
    if (typeof n == "object")
      switch (n.$$typeof) {
        case Zt:
          return (n.displayName || "Context") + ".Consumer";
        case gn:
          return (n._context.displayName || "Context") + ".Provider";
        case xt:
          var r = n.render;
          return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
        case ft:
          return r = n.displayName || null, r !== null ? r : gt(n.type) || "Memo";
        case Dt:
          r = n._payload, n = n._init;
          try {
            return gt(n(r));
          } catch {
          }
      }
    return null;
  }
  function Rt(n) {
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
        return r === ot ? "StrictMode" : "Mode";
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
  function yt(n) {
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
  function rn(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function Jt(n) {
    var r = rn(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), u = "" + n[r];
    if (!n.hasOwnProperty(r) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var c = l.get, p = l.set;
      return Object.defineProperty(n, r, { configurable: !0, get: function() {
        return c.call(this);
      }, set: function(S) {
        u = "" + S, p.call(this, S);
      } }), Object.defineProperty(n, r, { enumerable: l.enumerable }), { getValue: function() {
        return u;
      }, setValue: function(S) {
        u = "" + S;
      }, stopTracking: function() {
        n._valueTracker = null, delete n[r];
      } };
    }
  }
  function qn(n) {
    n._valueTracker || (n._valueTracker = Jt(n));
  }
  function Fn(n) {
    if (!n)
      return !1;
    var r = n._valueTracker;
    if (!r)
      return !0;
    var l = r.getValue(), u = "";
    return n && (u = rn(n) ? n.checked ? "true" : "false" : n.value), n = u, n !== l ? (r.setValue(n), !0) : !1;
  }
  function tr(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u")
      return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function Sn(n, r) {
    var l = r.checked;
    return O({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function Hn(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, u = r.checked != null ? r.checked : r.defaultChecked;
    l = yt(r.value != null ? r.value : l), n._wrapperState = { initialChecked: u, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function Mn(n, r) {
    r = r.checked, r != null && Xe(n, "checked", r, !1);
  }
  function _n(n, r) {
    Mn(n, r);
    var l = yt(r.value), u = r.type;
    if (l != null)
      u === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (u === "submit" || u === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? sr(n, r.type, l) : r.hasOwnProperty("defaultValue") && sr(n, r.type, yt(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function bn(n, r, l) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var u = r.type;
      if (!(u !== "submit" && u !== "reset" || r.value !== void 0 && r.value !== null))
        return;
      r = "" + n._wrapperState.initialValue, l || r === n.value || (n.value = r), n.defaultValue = r;
    }
    l = n.name, l !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, l !== "" && (n.name = l);
  }
  function sr(n, r, l) {
    (r !== "number" || tr(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var nr = Array.isArray;
  function wn(n, r, l, u) {
    if (n = n.options, r) {
      r = {};
      for (var c = 0; c < l.length; c++)
        r["$" + l[c]] = !0;
      for (l = 0; l < n.length; l++)
        c = r.hasOwnProperty("$" + n[l].value), n[l].selected !== c && (n[l].selected = c), c && u && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + yt(l), r = null, c = 0; c < n.length; c++) {
        if (n[c].value === l) {
          n[c].selected = !0, u && (n[c].defaultSelected = !0);
          return;
        }
        r !== null || n[c].disabled || (r = n[c]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function zr(n, r) {
    if (r.dangerouslySetInnerHTML != null)
      throw Error(h(91));
    return O({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function Ur(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null)
          throw Error(h(92));
        if (nr(l)) {
          if (1 < l.length)
            throw Error(h(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: yt(l) };
  }
  function cr(n, r) {
    var l = yt(r.value), u = yt(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), u != null && (n.defaultValue = "" + u);
  }
  function Pr(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function Rn(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function mr(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? Rn(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var on, jr = function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, l, u, c) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, l, u, c);
      });
    } : n;
  }(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n)
      n.innerHTML = r;
    else {
      for (on = on || document.createElement("div"), on.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = on.firstChild; n.firstChild; )
        n.removeChild(n.firstChild);
      for (; r.firstChild; )
        n.appendChild(r.firstChild);
    }
  });
  function yr(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var z = {
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
  }, D = ["Webkit", "ms", "Moz", "O"];
  Object.keys(z).forEach(function(n) {
    D.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), z[r] = z[n];
    });
  });
  function U(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || z.hasOwnProperty(n) && z[n] ? ("" + r).trim() : r + "px";
  }
  function q(n, r) {
    n = n.style;
    for (var l in r)
      if (r.hasOwnProperty(l)) {
        var u = l.indexOf("--") === 0, c = U(l, r[l], u);
        l === "float" && (l = "cssFloat"), u ? n.setProperty(l, c) : n[l] = c;
      }
  }
  var he = O({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Ke(n, r) {
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
  function Et(n, r) {
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
  var Be = null;
  function fe(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var ue = null, ye = null, se = null;
  function Pe(n) {
    if (n = bi(n)) {
      if (typeof ue != "function")
        throw Error(h(280));
      var r = n.stateNode;
      r && (r = Ac(r), ue(n.stateNode, n.type, r));
    }
  }
  function Ot(n) {
    ye ? se ? se.push(n) : se = [n] : ye = n;
  }
  function jt() {
    if (ye) {
      var n = ye, r = se;
      if (se = ye = null, Pe(n), r)
        for (n = 0; n < r.length; n++)
          Pe(r[n]);
    }
  }
  function Xn(n, r) {
    return n(r);
  }
  function hi() {
  }
  var Bi = !1;
  function mi(n, r, l) {
    if (Bi)
      return n(r, l);
    Bi = !0;
    try {
      return Xn(n, r, l);
    } finally {
      Bi = !1, (ye !== null || se !== null) && (hi(), jt());
    }
  }
  function ni(n, r) {
    var l = n.stateNode;
    if (l === null)
      return null;
    var u = Ac(l);
    if (u === null)
      return null;
    l = u[r];
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
          (u = !u.disabled) || (n = n.type, u = !(n === "button" || n === "input" || n === "select" || n === "textarea")), n = !u;
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
  var ri = !1;
  if (_)
    try {
      var Na = {};
      Object.defineProperty(Na, "passive", { get: function() {
        ri = !0;
      } }), window.addEventListener("test", Na, Na), window.removeEventListener("test", Na, Na);
    } catch {
      ri = !1;
    }
  function Vi(n, r, l, u, c, p, S, R, k) {
    var Y = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, Y);
    } catch (ie) {
      this.onError(ie);
    }
  }
  var Kr = !1, Zr = null, Sa = !1, $i = null, x = { onError: function(n) {
    Kr = !0, Zr = n;
  } };
  function ae(n, r, l, u, c, p, S, R, k) {
    Kr = !1, Zr = null, Vi.apply(x, arguments);
  }
  function ge(n, r, l, u, c, p, S, R, k) {
    if (ae.apply(this, arguments), Kr) {
      if (Kr) {
        var Y = Zr;
        Kr = !1, Zr = null;
      } else
        throw Error(h(198));
      Sa || (Sa = !0, $i = Y);
    }
  }
  function Ee(n) {
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
  function Tt(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null)
        return r.dehydrated;
    }
    return null;
  }
  function At(n) {
    if (Ee(n) !== n)
      throw Error(h(188));
  }
  function St(n) {
    var r = n.alternate;
    if (!r) {
      if (r = Ee(n), r === null)
        throw Error(h(188));
      return r !== n ? null : n;
    }
    for (var l = n, u = r; ; ) {
      var c = l.return;
      if (c === null)
        break;
      var p = c.alternate;
      if (p === null) {
        if (u = c.return, u !== null) {
          l = u;
          continue;
        }
        break;
      }
      if (c.child === p.child) {
        for (p = c.child; p; ) {
          if (p === l)
            return At(c), n;
          if (p === u)
            return At(c), r;
          p = p.sibling;
        }
        throw Error(h(188));
      }
      if (l.return !== u.return)
        l = c, u = p;
      else {
        for (var S = !1, R = c.child; R; ) {
          if (R === l) {
            S = !0, l = c, u = p;
            break;
          }
          if (R === u) {
            S = !0, u = c, l = p;
            break;
          }
          R = R.sibling;
        }
        if (!S) {
          for (R = p.child; R; ) {
            if (R === l) {
              S = !0, l = p, u = c;
              break;
            }
            if (R === u) {
              S = !0, u = p, l = c;
              break;
            }
            R = R.sibling;
          }
          if (!S)
            throw Error(h(189));
        }
      }
      if (l.alternate !== u)
        throw Error(h(190));
    }
    if (l.tag !== 3)
      throw Error(h(188));
    return l.stateNode.current === l ? n : r;
  }
  function qe(n) {
    return n = St(n), n !== null ? Kn(n) : null;
  }
  function Kn(n) {
    if (n.tag === 5 || n.tag === 6)
      return n;
    for (n = n.child; n !== null; ) {
      var r = Kn(n);
      if (r !== null)
        return r;
      n = n.sibling;
    }
    return null;
  }
  var un = d.unstable_scheduleCallback, sn = d.unstable_cancelCallback, kr = d.unstable_shouldYield, yi = d.unstable_requestPaint, cn = d.unstable_now, Jr = d.unstable_getCurrentPriorityLevel, ns = d.unstable_ImmediatePriority, gi = d.unstable_UserBlockingPriority, _t = d.unstable_NormalPriority, lo = d.unstable_LowPriority, Ii = d.unstable_IdlePriority, bl = null, ea = null;
  function rs(n) {
    if (ea && typeof ea.onCommitFiberRoot == "function")
      try {
        ea.onCommitFiberRoot(bl, n, void 0, (n.current.flags & 128) === 128);
      } catch {
      }
  }
  var Fr = Math.clz32 ? Math.clz32 : ls, as = Math.log, is = Math.LN2;
  function ls(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (as(n) / is | 0) | 0;
  }
  var oo = 64, Ko = 4194304;
  function Yi(n) {
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
  function Si(n, r) {
    var l = n.pendingLanes;
    if (l === 0)
      return 0;
    var u = 0, c = n.suspendedLanes, p = n.pingedLanes, S = l & 268435455;
    if (S !== 0) {
      var R = S & ~c;
      R !== 0 ? u = Yi(R) : (p &= S, p !== 0 && (u = Yi(p)));
    } else
      S = l & ~c, S !== 0 ? u = Yi(S) : p !== 0 && (u = Yi(p));
    if (u === 0)
      return 0;
    if (r !== 0 && r !== u && !(r & c) && (c = u & -u, p = r & -r, c >= p || c === 16 && (p & 4194240) !== 0))
      return r;
    if (u & 4 && (u |= l & 16), r = n.entangledLanes, r !== 0)
      for (n = n.entanglements, r &= u; 0 < r; )
        l = 31 - Fr(r), c = 1 << l, u |= n[l], r &= ~c;
    return u;
  }
  function La(n, r) {
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
  function wl(n, r) {
    for (var l = n.suspendedLanes, u = n.pingedLanes, c = n.expirationTimes, p = n.pendingLanes; 0 < p; ) {
      var S = 31 - Fr(p), R = 1 << S, k = c[S];
      k === -1 ? (!(R & l) || R & u) && (c[S] = La(R, r)) : k <= r && (n.expiredLanes |= R), p &= ~R;
    }
  }
  function Ci(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function uo() {
    var n = oo;
    return oo <<= 1, !(oo & 4194240) && (oo = 64), n;
  }
  function so(n) {
    for (var r = [], l = 0; 31 > l; l++)
      r.push(n);
    return r;
  }
  function Rl(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - Fr(r), n[r] = l;
  }
  function os(n, r) {
    var l = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var u = n.eventTimes;
    for (n = n.expirationTimes; 0 < l; ) {
      var c = 31 - Fr(l), p = 1 << c;
      r[c] = 0, u[c] = -1, n[c] = -1, l &= ~p;
    }
  }
  function us(n, r) {
    var l = n.entangledLanes |= r;
    for (n = n.entanglements; l; ) {
      var u = 31 - Fr(l), c = 1 << u;
      c & r | n[u] & r && (n[u] |= r), l &= ~c;
    }
  }
  var Lt = 0;
  function ss(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var Zo, Tl, cs, Ft, Jo, co = !1, st = [], ai = null, Tn = null, ta = null, Aa = /* @__PURE__ */ new Map(), xl = /* @__PURE__ */ new Map(), pn = [], xn = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function fs(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        ai = null;
        break;
      case "dragenter":
      case "dragleave":
        Tn = null;
        break;
      case "mouseover":
      case "mouseout":
        ta = null;
        break;
      case "pointerover":
      case "pointerout":
        Aa.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        xl.delete(r.pointerId);
    }
  }
  function gr(n, r, l, u, c, p) {
    return n === null || n.nativeEvent !== p ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: u, nativeEvent: p, targetContainers: [c] }, r !== null && (r = bi(r), r !== null && Tl(r)), n) : (n.eventSystemFlags |= u, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
  }
  function na(n, r, l, u, c) {
    switch (r) {
      case "focusin":
        return ai = gr(ai, n, r, l, u, c), !0;
      case "dragenter":
        return Tn = gr(Tn, n, r, l, u, c), !0;
      case "mouseover":
        return ta = gr(ta, n, r, l, u, c), !0;
      case "pointerover":
        var p = c.pointerId;
        return Aa.set(p, gr(Aa.get(p) || null, n, r, l, u, c)), !0;
      case "gotpointercapture":
        return p = c.pointerId, xl.set(p, gr(xl.get(p) || null, n, r, l, u, c)), !0;
    }
    return !1;
  }
  function ii(n) {
    var r = nl(n.target);
    if (r !== null) {
      var l = Ee(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = Tt(l), r !== null) {
            n.blockedOn = r, Jo(n.priority, function() {
              cs(l);
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
  function eu(n) {
    if (n.blockedOn !== null)
      return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var l = ru(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var u = new l.constructor(l.type, l);
        Be = u, l.target.dispatchEvent(u), Be = null;
      } else
        return r = bi(l), r !== null && Tl(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function fo(n, r, l) {
    eu(n) && l.delete(r);
  }
  function po() {
    co = !1, ai !== null && eu(ai) && (ai = null), Tn !== null && eu(Tn) && (Tn = null), ta !== null && eu(ta) && (ta = null), Aa.forEach(fo), xl.forEach(fo);
  }
  function Dl(n, r) {
    n.blockedOn === r && (n.blockedOn = null, co || (co = !0, d.unstable_scheduleCallback(d.unstable_NormalPriority, po)));
  }
  function za(n) {
    function r(c) {
      return Dl(c, n);
    }
    if (0 < st.length) {
      Dl(st[0], n);
      for (var l = 1; l < st.length; l++) {
        var u = st[l];
        u.blockedOn === n && (u.blockedOn = null);
      }
    }
    for (ai !== null && Dl(ai, n), Tn !== null && Dl(Tn, n), ta !== null && Dl(ta, n), Aa.forEach(r), xl.forEach(r), l = 0; l < pn.length; l++)
      u = pn[l], u.blockedOn === n && (u.blockedOn = null);
    for (; 0 < pn.length && (l = pn[0], l.blockedOn === null); )
      ii(l), l.blockedOn === null && pn.shift();
  }
  var Wi = Qe.ReactCurrentBatchConfig, tu = !0;
  function Gi(n, r, l, u) {
    var c = Lt, p = Wi.transition;
    Wi.transition = null;
    try {
      Lt = 1, Ei(n, r, l, u);
    } finally {
      Lt = c, Wi.transition = p;
    }
  }
  function nu(n, r, l, u) {
    var c = Lt, p = Wi.transition;
    Wi.transition = null;
    try {
      Lt = 4, Ei(n, r, l, u);
    } finally {
      Lt = c, Wi.transition = p;
    }
  }
  function Ei(n, r, l, u) {
    if (tu) {
      var c = ru(n, r, l, u);
      if (c === null)
        Ed(n, r, u, Qi, l), fs(n, u);
      else if (na(c, n, r, l, u))
        u.stopPropagation();
      else if (fs(n, u), r & 4 && -1 < xn.indexOf(n)) {
        for (; c !== null; ) {
          var p = bi(c);
          if (p !== null && Zo(p), p = ru(n, r, l, u), p === null && Ed(n, r, u, Qi, l), p === c)
            break;
          c = p;
        }
        c !== null && u.stopPropagation();
      } else
        Ed(n, r, u, null, l);
    }
  }
  var Qi = null;
  function ru(n, r, l, u) {
    if (Qi = null, n = fe(u), n = nl(n), n !== null)
      if (r = Ee(n), r === null)
        n = null;
      else if (l = r.tag, l === 13) {
        if (n = Tt(r), n !== null)
          return n;
        n = null;
      } else if (l === 3) {
        if (r.stateNode.current.memoizedState.isDehydrated)
          return r.tag === 3 ? r.stateNode.containerInfo : null;
        n = null;
      } else
        r !== n && (n = null);
    return Qi = n, null;
  }
  function ds(n) {
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
        switch (Jr()) {
          case ns:
            return 1;
          case gi:
            return 4;
          case _t:
          case lo:
            return 16;
          case Ii:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var li = null, au = null, y = null;
  function T() {
    if (y)
      return y;
    var n, r = au, l = r.length, u, c = "value" in li ? li.value : li.textContent, p = c.length;
    for (n = 0; n < l && r[n] === c[n]; n++)
      ;
    var S = l - n;
    for (u = 1; u <= S && r[l - u] === c[p - u]; u++)
      ;
    return y = c.slice(n, 1 < u ? 1 - u : void 0);
  }
  function V(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function W() {
    return !0;
  }
  function de() {
    return !1;
  }
  function je(n) {
    function r(l, u, c, p, S) {
      this._reactName = l, this._targetInst = c, this.type = u, this.nativeEvent = p, this.target = S, this.currentTarget = null;
      for (var R in n)
        n.hasOwnProperty(R) && (l = n[R], this[R] = l ? l(p) : p[R]);
      return this.isDefaultPrevented = (p.defaultPrevented != null ? p.defaultPrevented : p.returnValue === !1) ? W : de, this.isPropagationStopped = de, this;
    }
    return O(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = W);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = W);
    }, persist: function() {
    }, isPersistent: W }), r;
  }
  var xe = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, lt = je(xe), bt = O({}, xe, { view: 0, detail: 0 }), Wt = je(bt), Qt, qt, Xt, vn = O({}, bt, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: wc, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== Xt && (Xt && n.type === "mousemove" ? (Qt = n.screenX - Xt.screenX, qt = n.screenY - Xt.screenY) : qt = Qt = 0, Xt = n), Qt);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : qt;
  } }), Ht = je(vn), Ol = O({}, vn, { dataTransfer: 0 }), iu = je(Ol), ps = O({}, bt, { relatedTarget: 0 }), vs = je(ps), qi = O({}, xe, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), hs = je(qi), ms = O({}, xe, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), sd = je(ms), by = O({}, xe, { data: 0 }), yv = je(by), gv = {
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
  }, cd = {
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
  }, Sv = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Cv(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = Sv[n]) ? !!r[n] : !1;
  }
  function wc() {
    return Cv;
  }
  var wy = O({}, bt, { key: function(n) {
    if (n.key) {
      var r = gv[n.key] || n.key;
      if (r !== "Unidentified")
        return r;
    }
    return n.type === "keypress" ? (n = V(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? cd[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: wc, charCode: function(n) {
    return n.type === "keypress" ? V(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? V(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), Xi = je(wy), Ry = O({}, vn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Rc = je(Ry), fd = O({}, bt, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: wc }), dd = je(fd), Ty = O({}, xe, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Tc = je(Ty), Ev = O({}, vn, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), ra = je(Ev), Ki = [9, 13, 27, 32], Nn = _ && "CompositionEvent" in window, Ca = null;
  _ && "documentMode" in document && (Ca = document.documentMode);
  var pd = _ && "TextEvent" in window && !Ca, ys = _ && (!Nn || Ca && 8 < Ca && 11 >= Ca), _v = " ", lu = !1;
  function bv(n, r) {
    switch (n) {
      case "keyup":
        return Ki.indexOf(r.keyCode) !== -1;
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
  function wv(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var kl = !1;
  function xy(n, r) {
    switch (n) {
      case "compositionend":
        return wv(r);
      case "keypress":
        return r.which !== 32 ? null : (lu = !0, _v);
      case "textInput":
        return n = r.data, n === _v && lu ? null : n;
      default:
        return null;
    }
  }
  function Dy(n, r) {
    if (kl)
      return n === "compositionend" || !Nn && bv(n, r) ? (n = T(), y = au = li = null, kl = !1, n) : null;
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
        return ys && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var Oy = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function vd(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!Oy[n.type] : r === "textarea";
  }
  function Rv(n, r, l, u) {
    Ot(u), r = Nc(r, "onChange"), 0 < r.length && (l = new lt("onChange", "change", null, l, u), n.push({ event: l, listeners: r }));
  }
  var gs = null, Ss = null;
  function Tv(n) {
    Vv(n, 0);
  }
  function Zi(n) {
    var r = cu(n);
    if (Fn(r))
      return n;
  }
  function hd(n, r) {
    if (n === "change")
      return r;
  }
  var md = !1;
  if (_) {
    var xc;
    if (_) {
      var yd = "oninput" in document;
      if (!yd) {
        var xv = document.createElement("div");
        xv.setAttribute("oninput", "return;"), yd = typeof xv.oninput == "function";
      }
      xc = yd;
    } else
      xc = !1;
    md = xc && (!document.documentMode || 9 < document.documentMode);
  }
  function Dv() {
    gs && (gs.detachEvent("onpropertychange", Ov), Ss = gs = null);
  }
  function Ov(n) {
    if (n.propertyName === "value" && Zi(Ss)) {
      var r = [];
      Rv(r, Ss, n, fe(n)), mi(Tv, r);
    }
  }
  function ky(n, r, l) {
    n === "focusin" ? (Dv(), gs = r, Ss = l, gs.attachEvent("onpropertychange", Ov)) : n === "focusout" && Dv();
  }
  function My(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown")
      return Zi(Ss);
  }
  function Ny(n, r) {
    if (n === "click")
      return Zi(r);
  }
  function Ly(n, r) {
    if (n === "input" || n === "change")
      return Zi(r);
  }
  function kv(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var oi = typeof Object.is == "function" ? Object.is : kv;
  function ou(n, r) {
    if (oi(n, r))
      return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null)
      return !1;
    var l = Object.keys(n), u = Object.keys(r);
    if (l.length !== u.length)
      return !1;
    for (u = 0; u < l.length; u++) {
      var c = l[u];
      if (!Ce.call(r, c) || !oi(n[c], r[c]))
        return !1;
    }
    return !0;
  }
  function Mv(n) {
    for (; n && n.firstChild; )
      n = n.firstChild;
    return n;
  }
  function Nv(n, r) {
    var l = Mv(n);
    n = 0;
    for (var u; l; ) {
      if (l.nodeType === 3) {
        if (u = n + l.textContent.length, n <= r && u >= r)
          return { node: l, offset: r - n };
        n = u;
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
      l = Mv(l);
    }
  }
  function Lv(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? Lv(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function Av() {
    for (var n = window, r = tr(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l)
        n = r.contentWindow;
      else
        break;
      r = tr(n.document);
    }
    return r;
  }
  function Cs(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function vo(n) {
    var r = Av(), l = n.focusedElem, u = n.selectionRange;
    if (r !== l && l && l.ownerDocument && Lv(l.ownerDocument.documentElement, l)) {
      if (u !== null && Cs(l)) {
        if (r = u.start, n = u.end, n === void 0 && (n = r), "selectionStart" in l)
          l.selectionStart = r, l.selectionEnd = Math.min(n, l.value.length);
        else if (n = (r = l.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var c = l.textContent.length, p = Math.min(u.start, c);
          u = u.end === void 0 ? p : Math.min(u.end, c), !n.extend && p > u && (c = u, u = p, p = c), c = Nv(l, p);
          var S = Nv(
            l,
            u
          );
          c && S && (n.rangeCount !== 1 || n.anchorNode !== c.node || n.anchorOffset !== c.offset || n.focusNode !== S.node || n.focusOffset !== S.offset) && (r = r.createRange(), r.setStart(c.node, c.offset), n.removeAllRanges(), p > u ? (n.addRange(r), n.extend(S.node, S.offset)) : (r.setEnd(S.node, S.offset), n.addRange(r)));
        }
      }
      for (r = [], n = l; n = n.parentNode; )
        n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof l.focus == "function" && l.focus(), l = 0; l < r.length; l++)
        n = r[l], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var Dc = _ && "documentMode" in document && 11 >= document.documentMode, ho = null, Ml = null, Es = null, gd = !1;
  function zv(n, r, l) {
    var u = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    gd || ho == null || ho !== tr(u) || (u = ho, "selectionStart" in u && Cs(u) ? u = { start: u.selectionStart, end: u.selectionEnd } : (u = (u.ownerDocument && u.ownerDocument.defaultView || window).getSelection(), u = { anchorNode: u.anchorNode, anchorOffset: u.anchorOffset, focusNode: u.focusNode, focusOffset: u.focusOffset }), Es && ou(Es, u) || (Es = u, u = Nc(Ml, "onSelect"), 0 < u.length && (r = new lt("onSelect", "select", null, r, l), n.push({ event: r, listeners: u }), r.target = ho)));
  }
  function Oc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var uu = { animationend: Oc("Animation", "AnimationEnd"), animationiteration: Oc("Animation", "AnimationIteration"), animationstart: Oc("Animation", "AnimationStart"), transitionend: Oc("Transition", "TransitionEnd") }, kc = {}, Uv = {};
  _ && (Uv = document.createElement("div").style, "AnimationEvent" in window || (delete uu.animationend.animation, delete uu.animationiteration.animation, delete uu.animationstart.animation), "TransitionEvent" in window || delete uu.transitionend.transition);
  function _s(n) {
    if (kc[n])
      return kc[n];
    if (!uu[n])
      return n;
    var r = uu[n], l;
    for (l in r)
      if (r.hasOwnProperty(l) && l in Uv)
        return kc[n] = r[l];
    return n;
  }
  var Mr = _s("animationend"), Sd = _s("animationiteration"), Pv = _s("animationstart"), jv = _s("transitionend"), Fv = /* @__PURE__ */ new Map(), Hv = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Nl(n, r) {
    Fv.set(n, r), A(r, [n]);
  }
  for (var Mc = 0; Mc < Hv.length; Mc++) {
    var bs = Hv[Mc], ws = bs.toLowerCase(), Ay = bs[0].toUpperCase() + bs.slice(1);
    Nl(ws, "on" + Ay);
  }
  Nl(Mr, "onAnimationEnd"), Nl(Sd, "onAnimationIteration"), Nl(Pv, "onAnimationStart"), Nl("dblclick", "onDoubleClick"), Nl("focusin", "onFocus"), Nl("focusout", "onBlur"), Nl(jv, "onTransitionEnd"), P("onMouseEnter", ["mouseout", "mouseover"]), P("onMouseLeave", ["mouseout", "mouseover"]), P("onPointerEnter", ["pointerout", "pointerover"]), P("onPointerLeave", ["pointerout", "pointerover"]), A("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), A("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), A("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), A("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), A("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), A("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var Ji = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), zy = new Set("cancel close invalid load scroll toggle".split(" ").concat(Ji));
  function Bv(n, r, l) {
    var u = n.type || "unknown-event";
    n.currentTarget = l, ge(u, r, void 0, n), n.currentTarget = null;
  }
  function Vv(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var u = n[l], c = u.event;
      u = u.listeners;
      e: {
        var p = void 0;
        if (r)
          for (var S = u.length - 1; 0 <= S; S--) {
            var R = u[S], k = R.instance, Y = R.currentTarget;
            if (R = R.listener, k !== p && c.isPropagationStopped())
              break e;
            Bv(c, R, Y), p = k;
          }
        else
          for (S = 0; S < u.length; S++) {
            if (R = u[S], k = R.instance, Y = R.currentTarget, R = R.listener, k !== p && c.isPropagationStopped())
              break e;
            Bv(c, R, Y), p = k;
          }
      }
    }
    if (Sa)
      throw n = $i, Sa = !1, $i = null, n;
  }
  function an(n, r) {
    var l = r[Od];
    l === void 0 && (l = r[Od] = /* @__PURE__ */ new Set());
    var u = n + "__bubble";
    l.has(u) || (Cd(r, n, 2, !1), l.add(u));
  }
  function Rs(n, r, l) {
    var u = 0;
    r && (u |= 4), Cd(l, n, u, r);
  }
  var el = "_reactListening" + Math.random().toString(36).slice(2);
  function _i(n) {
    if (!n[el]) {
      n[el] = !0, C.forEach(function(l) {
        l !== "selectionchange" && (zy.has(l) || Rs(l, !1, n), Rs(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[el] || (r[el] = !0, Rs("selectionchange", !1, r));
    }
  }
  function Cd(n, r, l, u) {
    switch (ds(r)) {
      case 1:
        var c = Gi;
        break;
      case 4:
        c = nu;
        break;
      default:
        c = Ei;
    }
    l = c.bind(null, r, l, n), c = void 0, !ri || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (c = !0), u ? c !== void 0 ? n.addEventListener(r, l, { capture: !0, passive: c }) : n.addEventListener(r, l, !0) : c !== void 0 ? n.addEventListener(r, l, { passive: c }) : n.addEventListener(r, l, !1);
  }
  function Ed(n, r, l, u, c) {
    var p = u;
    if (!(r & 1) && !(r & 2) && u !== null)
      e:
        for (; ; ) {
          if (u === null)
            return;
          var S = u.tag;
          if (S === 3 || S === 4) {
            var R = u.stateNode.containerInfo;
            if (R === c || R.nodeType === 8 && R.parentNode === c)
              break;
            if (S === 4)
              for (S = u.return; S !== null; ) {
                var k = S.tag;
                if ((k === 3 || k === 4) && (k = S.stateNode.containerInfo, k === c || k.nodeType === 8 && k.parentNode === c))
                  return;
                S = S.return;
              }
            for (; R !== null; ) {
              if (S = nl(R), S === null)
                return;
              if (k = S.tag, k === 5 || k === 6) {
                u = p = S;
                continue e;
              }
              R = R.parentNode;
            }
          }
          u = u.return;
        }
    mi(function() {
      var Y = p, ie = fe(l), le = [];
      e: {
        var te = Fv.get(n);
        if (te !== void 0) {
          var Re = lt, Ae = n;
          switch (n) {
            case "keypress":
              if (V(l) === 0)
                break e;
            case "keydown":
            case "keyup":
              Re = Xi;
              break;
            case "focusin":
              Ae = "focus", Re = vs;
              break;
            case "focusout":
              Ae = "blur", Re = vs;
              break;
            case "beforeblur":
            case "afterblur":
              Re = vs;
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
              Re = Ht;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              Re = iu;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              Re = dd;
              break;
            case Mr:
            case Sd:
            case Pv:
              Re = hs;
              break;
            case jv:
              Re = Tc;
              break;
            case "scroll":
              Re = Wt;
              break;
            case "wheel":
              Re = ra;
              break;
            case "copy":
            case "cut":
            case "paste":
              Re = sd;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              Re = Rc;
          }
          var He = (r & 4) !== 0, Wn = !He && n === "scroll", j = He ? te !== null ? te + "Capture" : null : te;
          He = [];
          for (var N = Y, B; N !== null; ) {
            B = N;
            var pe = B.stateNode;
            if (B.tag === 5 && pe !== null && (B = pe, j !== null && (pe = ni(N, j), pe != null && He.push(su(N, pe, B)))), Wn)
              break;
            N = N.return;
          }
          0 < He.length && (te = new Re(te, Ae, null, l, ie), le.push({ event: te, listeners: He }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (te = n === "mouseover" || n === "pointerover", Re = n === "mouseout" || n === "pointerout", te && l !== Be && (Ae = l.relatedTarget || l.fromElement) && (nl(Ae) || Ae[ui]))
            break e;
          if ((Re || te) && (te = ie.window === ie ? ie : (te = ie.ownerDocument) ? te.defaultView || te.parentWindow : window, Re ? (Ae = l.relatedTarget || l.toElement, Re = Y, Ae = Ae ? nl(Ae) : null, Ae !== null && (Wn = Ee(Ae), Ae !== Wn || Ae.tag !== 5 && Ae.tag !== 6) && (Ae = null)) : (Re = null, Ae = Y), Re !== Ae)) {
            if (He = Ht, pe = "onMouseLeave", j = "onMouseEnter", N = "mouse", (n === "pointerout" || n === "pointerover") && (He = Rc, pe = "onPointerLeave", j = "onPointerEnter", N = "pointer"), Wn = Re == null ? te : cu(Re), B = Ae == null ? te : cu(Ae), te = new He(pe, N + "leave", Re, l, ie), te.target = Wn, te.relatedTarget = B, pe = null, nl(ie) === Y && (He = new He(j, N + "enter", Ae, l, ie), He.target = B, He.relatedTarget = Wn, pe = He), Wn = pe, Re && Ae)
              t: {
                for (He = Re, j = Ae, N = 0, B = He; B; B = mo(B))
                  N++;
                for (B = 0, pe = j; pe; pe = mo(pe))
                  B++;
                for (; 0 < N - B; )
                  He = mo(He), N--;
                for (; 0 < B - N; )
                  j = mo(j), B--;
                for (; N--; ) {
                  if (He === j || j !== null && He === j.alternate)
                    break t;
                  He = mo(He), j = mo(j);
                }
                He = null;
              }
            else
              He = null;
            Re !== null && _d(le, te, Re, He, !1), Ae !== null && Wn !== null && _d(le, Wn, Ae, He, !0);
          }
        }
        e: {
          if (te = Y ? cu(Y) : window, Re = te.nodeName && te.nodeName.toLowerCase(), Re === "select" || Re === "input" && te.type === "file")
            var Ie = hd;
          else if (vd(te))
            if (md)
              Ie = Ly;
            else {
              Ie = My;
              var at = ky;
            }
          else
            (Re = te.nodeName) && Re.toLowerCase() === "input" && (te.type === "checkbox" || te.type === "radio") && (Ie = Ny);
          if (Ie && (Ie = Ie(n, Y))) {
            Rv(le, Ie, l, ie);
            break e;
          }
          at && at(n, te, Y), n === "focusout" && (at = te._wrapperState) && at.controlled && te.type === "number" && sr(te, "number", te.value);
        }
        switch (at = Y ? cu(Y) : window, n) {
          case "focusin":
            (vd(at) || at.contentEditable === "true") && (ho = at, Ml = Y, Es = null);
            break;
          case "focusout":
            Es = Ml = ho = null;
            break;
          case "mousedown":
            gd = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            gd = !1, zv(le, l, ie);
            break;
          case "selectionchange":
            if (Dc)
              break;
          case "keydown":
          case "keyup":
            zv(le, l, ie);
        }
        var ze;
        if (Nn)
          e: {
            switch (n) {
              case "compositionstart":
                var it = "onCompositionStart";
                break e;
              case "compositionend":
                it = "onCompositionEnd";
                break e;
              case "compositionupdate":
                it = "onCompositionUpdate";
                break e;
            }
            it = void 0;
          }
        else
          kl ? bv(n, l) && (it = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (it = "onCompositionStart");
        it && (ys && l.locale !== "ko" && (kl || it !== "onCompositionStart" ? it === "onCompositionEnd" && kl && (ze = T()) : (li = ie, au = "value" in li ? li.value : li.textContent, kl = !0)), at = Nc(Y, it), 0 < at.length && (it = new yv(it, n, null, l, ie), le.push({ event: it, listeners: at }), ze ? it.data = ze : (ze = wv(l), ze !== null && (it.data = ze)))), (ze = pd ? xy(n, l) : Dy(n, l)) && (Y = Nc(Y, "onBeforeInput"), 0 < Y.length && (ie = new yv("onBeforeInput", "beforeinput", null, l, ie), le.push({ event: ie, listeners: Y }), ie.data = ze));
      }
      Vv(le, r);
    });
  }
  function su(n, r, l) {
    return { instance: n, listener: r, currentTarget: l };
  }
  function Nc(n, r) {
    for (var l = r + "Capture", u = []; n !== null; ) {
      var c = n, p = c.stateNode;
      c.tag === 5 && p !== null && (c = p, p = ni(n, l), p != null && u.unshift(su(n, p, c)), p = ni(n, r), p != null && u.push(su(n, p, c))), n = n.return;
    }
    return u;
  }
  function mo(n) {
    if (n === null)
      return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function _d(n, r, l, u, c) {
    for (var p = r._reactName, S = []; l !== null && l !== u; ) {
      var R = l, k = R.alternate, Y = R.stateNode;
      if (k !== null && k === u)
        break;
      R.tag === 5 && Y !== null && (R = Y, c ? (k = ni(l, p), k != null && S.unshift(su(l, k, R))) : c || (k = ni(l, p), k != null && S.push(su(l, k, R)))), l = l.return;
    }
    S.length !== 0 && n.push({ event: r, listeners: S });
  }
  var $v = /\r\n?/g, bd = /\u0000|\uFFFD/g;
  function Iv(n) {
    return (typeof n == "string" ? n : "" + n).replace($v, `
`).replace(bd, "");
  }
  function Ts(n, r, l) {
    if (r = Iv(r), Iv(n) !== r && l)
      throw Error(h(425));
  }
  function Lc() {
  }
  var wd = null, Rd = null;
  function yo(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var xs = typeof setTimeout == "function" ? setTimeout : void 0, Ds = typeof clearTimeout == "function" ? clearTimeout : void 0, Td = typeof Promise == "function" ? Promise : void 0, Yv = typeof queueMicrotask == "function" ? queueMicrotask : typeof Td < "u" ? function(n) {
    return Td.resolve(null).then(n).catch(xd);
  } : xs;
  function xd(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function Dd(n, r) {
    var l = r, u = 0;
    do {
      var c = l.nextSibling;
      if (n.removeChild(l), c && c.nodeType === 8)
        if (l = c.data, l === "/$") {
          if (u === 0) {
            n.removeChild(c), za(r);
            return;
          }
          u--;
        } else
          l !== "$" && l !== "$?" && l !== "$!" || u++;
      l = c;
    } while (l);
    za(r);
  }
  function Ea(n) {
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
  function Os(n) {
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
  var tl = Math.random().toString(36).slice(2), Ua = "__reactFiber$" + tl, ks = "__reactProps$" + tl, ui = "__reactContainer$" + tl, Od = "__reactEvents$" + tl, Uy = "__reactListeners$" + tl, Py = "__reactHandles$" + tl;
  function nl(n) {
    var r = n[Ua];
    if (r)
      return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[ui] || l[Ua]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null)
          for (n = Os(n); n !== null; ) {
            if (l = n[Ua])
              return l;
            n = Os(n);
          }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function bi(n) {
    return n = n[Ua] || n[ui], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function cu(n) {
    if (n.tag === 5 || n.tag === 6)
      return n.stateNode;
    throw Error(h(33));
  }
  function Ac(n) {
    return n[ks] || null;
  }
  var Ze = [], si = -1;
  function ln(n) {
    return { current: n };
  }
  function $e(n) {
    0 > si || (n.current = Ze[si], Ze[si] = null, si--);
  }
  function Vt(n, r) {
    si++, Ze[si] = n.current, n.current = r;
  }
  var Pa = {}, fr = ln(Pa), dt = ln(!1), Hr = Pa;
  function _a(n, r) {
    var l = n.type.contextTypes;
    if (!l)
      return Pa;
    var u = n.stateNode;
    if (u && u.__reactInternalMemoizedUnmaskedChildContext === r)
      return u.__reactInternalMemoizedMaskedChildContext;
    var c = {}, p;
    for (p in l)
      c[p] = r[p];
    return u && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = c), c;
  }
  function Zn(n) {
    return n = n.childContextTypes, n != null;
  }
  function aa() {
    $e(dt), $e(fr);
  }
  function wi(n, r, l) {
    if (fr.current !== Pa)
      throw Error(h(168));
    Vt(fr, r), Vt(dt, l);
  }
  function Ll(n, r, l) {
    var u = n.stateNode;
    if (r = r.childContextTypes, typeof u.getChildContext != "function")
      return l;
    u = u.getChildContext();
    for (var c in u)
      if (!(c in r))
        throw Error(h(108, Rt(n) || "Unknown", c));
    return O({}, l, u);
  }
  function go(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Pa, Hr = fr.current, Vt(fr, n), Vt(dt, dt.current), !0;
  }
  function Wv(n, r, l) {
    var u = n.stateNode;
    if (!u)
      throw Error(h(169));
    l ? (n = Ll(n, r, Hr), u.__reactInternalMemoizedMergedChildContext = n, $e(dt), $e(fr), Vt(fr, n)) : $e(dt), Vt(dt, l);
  }
  var rl = null, Al = !1, Sr = !1;
  function zc(n) {
    rl === null ? rl = [n] : rl.push(n);
  }
  function Gv(n) {
    Al = !0, zc(n);
  }
  function Ri() {
    if (!Sr && rl !== null) {
      Sr = !0;
      var n = 0, r = Lt;
      try {
        var l = rl;
        for (Lt = 1; n < l.length; n++) {
          var u = l[n];
          do
            u = u(!0);
          while (u !== null);
        }
        rl = null, Al = !1;
      } catch (c) {
        throw rl !== null && (rl = rl.slice(n + 1)), un(ns, Ri), c;
      } finally {
        Lt = r, Sr = !1;
      }
    }
    return null;
  }
  var ja = [], zl = 0, Fa = null, So = 0, ia = [], la = 0, ci = null, oa = 1, Cr = "";
  function Co(n, r) {
    ja[zl++] = So, ja[zl++] = Fa, Fa = n, So = r;
  }
  function Ul(n, r, l) {
    ia[la++] = oa, ia[la++] = Cr, ia[la++] = ci, ci = n;
    var u = oa;
    n = Cr;
    var c = 32 - Fr(u) - 1;
    u &= ~(1 << c), l += 1;
    var p = 32 - Fr(r) + c;
    if (30 < p) {
      var S = c - c % 5;
      p = (u & (1 << S) - 1).toString(32), u >>= S, c -= S, oa = 1 << 32 - Fr(r) + c | l << c | u, Cr = p + n;
    } else
      oa = 1 << p | l << c | u, Cr = n;
  }
  function Uc(n) {
    n.return !== null && (Co(n, 1), Ul(n, 1, 0));
  }
  function Pc(n) {
    for (; n === Fa; )
      Fa = ja[--zl], ja[zl] = null, So = ja[--zl], ja[zl] = null;
    for (; n === ci; )
      ci = ia[--la], ia[la] = null, Cr = ia[--la], ia[la] = null, oa = ia[--la], ia[la] = null;
  }
  var ba = null, wa = null, hn = !1, Ha = null;
  function kd(n, r) {
    var l = Ga(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function Md(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, ba = n, wa = Ea(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, ba = n, wa = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = ci !== null ? { id: oa, overflow: Cr } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = Ga(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, ba = n, wa = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Nd(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function jc(n) {
    if (hn) {
      var r = wa;
      if (r) {
        var l = r;
        if (!Md(n, r)) {
          if (Nd(n))
            throw Error(h(418));
          r = Ea(l.nextSibling);
          var u = ba;
          r && Md(n, r) ? kd(u, l) : (n.flags = n.flags & -4097 | 2, hn = !1, ba = n);
        }
      } else {
        if (Nd(n))
          throw Error(h(418));
        n.flags = n.flags & -4097 | 2, hn = !1, ba = n;
      }
    }
  }
  function Ld(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; )
      n = n.return;
    ba = n;
  }
  function Fc(n) {
    if (n !== ba)
      return !1;
    if (!hn)
      return Ld(n), hn = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !yo(n.type, n.memoizedProps)), r && (r = wa)) {
      if (Nd(n))
        throw Qv(), Error(h(418));
      for (; r; )
        kd(n, r), r = Ea(r.nextSibling);
    }
    if (Ld(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n)
        throw Error(h(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var l = n.data;
            if (l === "/$") {
              if (r === 0) {
                wa = Ea(n.nextSibling);
                break e;
              }
              r--;
            } else
              l !== "$" && l !== "$!" && l !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        wa = null;
      }
    } else
      wa = ba ? Ea(n.stateNode.nextSibling) : null;
    return !0;
  }
  function Qv() {
    for (var n = wa; n; )
      n = Ea(n.nextSibling);
  }
  function fu() {
    wa = ba = null, hn = !1;
  }
  function Jn(n) {
    Ha === null ? Ha = [n] : Ha.push(n);
  }
  var jy = Qe.ReactCurrentBatchConfig;
  function ua(n, r) {
    if (n && n.defaultProps) {
      r = O({}, r), n = n.defaultProps;
      for (var l in n)
        r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  var du = ln(null), Ti = null, pu = null, Ms = null;
  function Ad() {
    Ms = pu = Ti = null;
  }
  function zd(n) {
    var r = du.current;
    $e(du), n._currentValue = r;
  }
  function Pl(n, r, l) {
    for (; n !== null; ) {
      var u = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, u !== null && (u.childLanes |= r)) : u !== null && (u.childLanes & r) !== r && (u.childLanes |= r), n === l)
        break;
      n = n.return;
    }
  }
  function Bn(n, r) {
    Ti = n, Ms = pu = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (fa = !0), n.firstContext = null);
  }
  function me(n) {
    var r = n._currentValue;
    if (Ms !== n)
      if (n = { context: n, memoizedValue: r, next: null }, pu === null) {
        if (Ti === null)
          throw Error(h(308));
        pu = n, Ti.dependencies = { lanes: 0, firstContext: n };
      } else
        pu = pu.next = n;
    return r;
  }
  var Nr = null;
  function Ra(n) {
    Nr === null ? Nr = [n] : Nr.push(n);
  }
  function qv(n, r, l, u) {
    var c = r.interleaved;
    return c === null ? (l.next = l, Ra(r)) : (l.next = c.next, c.next = l), r.interleaved = l, al(n, u);
  }
  function al(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; )
      n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var jl = !1;
  function Ud(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Xv(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function fn(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Fl(n, r, l) {
    var u = n.updateQueue;
    if (u === null)
      return null;
    if (u = u.shared, kt & 2) {
      var c = u.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), u.pending = r, al(n, l);
    }
    return c = u.interleaved, c === null ? (r.next = r, Ra(u)) : (r.next = c.next, c.next = r), u.interleaved = r, al(n, l);
  }
  function Hc(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var u = r.lanes;
      u &= n.pendingLanes, l |= u, r.lanes = l, us(n, l);
    }
  }
  function Kv(n, r) {
    var l = n.updateQueue, u = n.alternate;
    if (u !== null && (u = u.updateQueue, l === u)) {
      var c = null, p = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var S = { eventTime: l.eventTime, lane: l.lane, tag: l.tag, payload: l.payload, callback: l.callback, next: null };
          p === null ? c = p = S : p = p.next = S, l = l.next;
        } while (l !== null);
        p === null ? c = p = r : p = p.next = r;
      } else
        c = p = r;
      l = { baseState: u.baseState, firstBaseUpdate: c, lastBaseUpdate: p, shared: u.shared, effects: u.effects }, n.updateQueue = l;
      return;
    }
    n = l.lastBaseUpdate, n === null ? l.firstBaseUpdate = r : n.next = r, l.lastBaseUpdate = r;
  }
  function Ns(n, r, l, u) {
    var c = n.updateQueue;
    jl = !1;
    var p = c.firstBaseUpdate, S = c.lastBaseUpdate, R = c.shared.pending;
    if (R !== null) {
      c.shared.pending = null;
      var k = R, Y = k.next;
      k.next = null, S === null ? p = Y : S.next = Y, S = k;
      var ie = n.alternate;
      ie !== null && (ie = ie.updateQueue, R = ie.lastBaseUpdate, R !== S && (R === null ? ie.firstBaseUpdate = Y : R.next = Y, ie.lastBaseUpdate = k));
    }
    if (p !== null) {
      var le = c.baseState;
      S = 0, ie = Y = k = null, R = p;
      do {
        var te = R.lane, Re = R.eventTime;
        if ((u & te) === te) {
          ie !== null && (ie = ie.next = {
            eventTime: Re,
            lane: 0,
            tag: R.tag,
            payload: R.payload,
            callback: R.callback,
            next: null
          });
          e: {
            var Ae = n, He = R;
            switch (te = r, Re = l, He.tag) {
              case 1:
                if (Ae = He.payload, typeof Ae == "function") {
                  le = Ae.call(Re, le, te);
                  break e;
                }
                le = Ae;
                break e;
              case 3:
                Ae.flags = Ae.flags & -65537 | 128;
              case 0:
                if (Ae = He.payload, te = typeof Ae == "function" ? Ae.call(Re, le, te) : Ae, te == null)
                  break e;
                le = O({}, le, te);
                break e;
              case 2:
                jl = !0;
            }
          }
          R.callback !== null && R.lane !== 0 && (n.flags |= 64, te = c.effects, te === null ? c.effects = [R] : te.push(R));
        } else
          Re = { eventTime: Re, lane: te, tag: R.tag, payload: R.payload, callback: R.callback, next: null }, ie === null ? (Y = ie = Re, k = le) : ie = ie.next = Re, S |= te;
        if (R = R.next, R === null) {
          if (R = c.shared.pending, R === null)
            break;
          te = R, R = te.next, te.next = null, c.lastBaseUpdate = te, c.shared.pending = null;
        }
      } while (!0);
      if (ie === null && (k = le), c.baseState = k, c.firstBaseUpdate = Y, c.lastBaseUpdate = ie, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          S |= c.lane, c = c.next;
        while (c !== r);
      } else
        p === null && (c.shared.lanes = 0);
      No |= S, n.lanes = S, n.memoizedState = le;
    }
  }
  function vu(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null)
      for (r = 0; r < n.length; r++) {
        var u = n[r], c = u.callback;
        if (c !== null) {
          if (u.callback = null, u = l, typeof c != "function")
            throw Error(h(191, c));
          c.call(u);
        }
      }
  }
  var Eo = new g.Component().refs;
  function Pd(n, r, l, u) {
    r = n.memoizedState, l = l(u, r), l = l == null ? r : O({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var Bc = { isMounted: function(n) {
    return (n = n._reactInternals) ? Ee(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var u = vr(), c = ul(n), p = fn(u, c);
    p.payload = r, l != null && (p.callback = l), r = Fl(n, p, c), r !== null && (On(r, n, c, u), Hc(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var u = vr(), c = ul(n), p = fn(u, c);
    p.tag = 1, p.payload = r, l != null && (p.callback = l), r = Fl(n, p, c), r !== null && (On(r, n, c, u), Hc(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = vr(), u = ul(n), c = fn(l, u);
    c.tag = 2, r != null && (c.callback = r), r = Fl(n, c, u), r !== null && (On(r, n, u, l), Hc(r, n, u));
  } };
  function Zv(n, r, l, u, c, p, S) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(u, p, S) : r.prototype && r.prototype.isPureReactComponent ? !ou(l, u) || !ou(c, p) : !0;
  }
  function Jv(n, r, l) {
    var u = !1, c = Pa, p = r.contextType;
    return typeof p == "object" && p !== null ? p = me(p) : (c = Zn(r) ? Hr : fr.current, u = r.contextTypes, p = (u = u != null) ? _a(n, c) : Pa), r = new r(l, p), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = Bc, n.stateNode = r, r._reactInternals = n, u && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = p), r;
  }
  function eh(n, r, l, u) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, u), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, u), r.state !== n && Bc.enqueueReplaceState(r, r.state, null);
  }
  function jd(n, r, l, u) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = Eo, Ud(n);
    var p = r.contextType;
    typeof p == "object" && p !== null ? c.context = me(p) : (p = Zn(r) ? Hr : fr.current, c.context = _a(n, p)), c.state = n.memoizedState, p = r.getDerivedStateFromProps, typeof p == "function" && (Pd(n, r, p, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && Bc.enqueueReplaceState(c, c.state, null), Ns(n, l, c, u), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function hu(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1)
            throw Error(h(309));
          var u = l.stateNode;
        }
        if (!u)
          throw Error(h(147, n));
        var c = u, p = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === p ? r.ref : (r = function(S) {
          var R = c.refs;
          R === Eo && (R = c.refs = {}), S === null ? delete R[p] : R[p] = S;
        }, r._stringRef = p, r);
      }
      if (typeof n != "string")
        throw Error(h(284));
      if (!l._owner)
        throw Error(h(290, n));
    }
    return n;
  }
  function Ls(n, r) {
    throw n = Object.prototype.toString.call(r), Error(h(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function th(n) {
    var r = n._init;
    return r(n._payload);
  }
  function nh(n) {
    function r(j, N) {
      if (n) {
        var B = j.deletions;
        B === null ? (j.deletions = [N], j.flags |= 16) : B.push(N);
      }
    }
    function l(j, N) {
      if (!n)
        return null;
      for (; N !== null; )
        r(j, N), N = N.sibling;
      return null;
    }
    function u(j, N) {
      for (j = /* @__PURE__ */ new Map(); N !== null; )
        N.key !== null ? j.set(N.key, N) : j.set(N.index, N), N = N.sibling;
      return j;
    }
    function c(j, N) {
      return j = Gl(j, N), j.index = 0, j.sibling = null, j;
    }
    function p(j, N, B) {
      return j.index = B, n ? (B = j.alternate, B !== null ? (B = B.index, B < N ? (j.flags |= 2, N) : B) : (j.flags |= 2, N)) : (j.flags |= 1048576, N);
    }
    function S(j) {
      return n && j.alternate === null && (j.flags |= 2), j;
    }
    function R(j, N, B, pe) {
      return N === null || N.tag !== 6 ? (N = bf(B, j.mode, pe), N.return = j, N) : (N = c(N, B), N.return = j, N);
    }
    function k(j, N, B, pe) {
      var Ie = B.type;
      return Ie === wt ? ie(j, N, B.props.children, pe, B.key) : N !== null && (N.elementType === Ie || typeof Ie == "object" && Ie !== null && Ie.$$typeof === Dt && th(Ie) === N.type) ? (pe = c(N, B.props), pe.ref = hu(j, N, B), pe.return = j, pe) : (pe = Ef(B.type, B.key, B.props, null, j.mode, pe), pe.ref = hu(j, N, B), pe.return = j, pe);
    }
    function Y(j, N, B, pe) {
      return N === null || N.tag !== 4 || N.stateNode.containerInfo !== B.containerInfo || N.stateNode.implementation !== B.implementation ? (N = Zs(B, j.mode, pe), N.return = j, N) : (N = c(N, B.children || []), N.return = j, N);
    }
    function ie(j, N, B, pe, Ie) {
      return N === null || N.tag !== 7 ? (N = Uo(B, j.mode, pe, Ie), N.return = j, N) : (N = c(N, B), N.return = j, N);
    }
    function le(j, N, B) {
      if (typeof N == "string" && N !== "" || typeof N == "number")
        return N = bf("" + N, j.mode, B), N.return = j, N;
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case Nt:
            return B = Ef(N.type, N.key, N.props, null, j.mode, B), B.ref = hu(j, null, N), B.return = j, B;
          case Le:
            return N = Zs(N, j.mode, B), N.return = j, N;
          case Dt:
            var pe = N._init;
            return le(j, pe(N._payload), B);
        }
        if (nr(N) || ke(N))
          return N = Uo(N, j.mode, B, null), N.return = j, N;
        Ls(j, N);
      }
      return null;
    }
    function te(j, N, B, pe) {
      var Ie = N !== null ? N.key : null;
      if (typeof B == "string" && B !== "" || typeof B == "number")
        return Ie !== null ? null : R(j, N, "" + B, pe);
      if (typeof B == "object" && B !== null) {
        switch (B.$$typeof) {
          case Nt:
            return B.key === Ie ? k(j, N, B, pe) : null;
          case Le:
            return B.key === Ie ? Y(j, N, B, pe) : null;
          case Dt:
            return Ie = B._init, te(
              j,
              N,
              Ie(B._payload),
              pe
            );
        }
        if (nr(B) || ke(B))
          return Ie !== null ? null : ie(j, N, B, pe, null);
        Ls(j, B);
      }
      return null;
    }
    function Re(j, N, B, pe, Ie) {
      if (typeof pe == "string" && pe !== "" || typeof pe == "number")
        return j = j.get(B) || null, R(N, j, "" + pe, Ie);
      if (typeof pe == "object" && pe !== null) {
        switch (pe.$$typeof) {
          case Nt:
            return j = j.get(pe.key === null ? B : pe.key) || null, k(N, j, pe, Ie);
          case Le:
            return j = j.get(pe.key === null ? B : pe.key) || null, Y(N, j, pe, Ie);
          case Dt:
            var at = pe._init;
            return Re(j, N, B, at(pe._payload), Ie);
        }
        if (nr(pe) || ke(pe))
          return j = j.get(B) || null, ie(N, j, pe, Ie, null);
        Ls(N, pe);
      }
      return null;
    }
    function Ae(j, N, B, pe) {
      for (var Ie = null, at = null, ze = N, it = N = 0, lr = null; ze !== null && it < B.length; it++) {
        ze.index > it ? (lr = ze, ze = null) : lr = ze.sibling;
        var $t = te(j, ze, B[it], pe);
        if ($t === null) {
          ze === null && (ze = lr);
          break;
        }
        n && ze && $t.alternate === null && r(j, ze), N = p($t, N, it), at === null ? Ie = $t : at.sibling = $t, at = $t, ze = lr;
      }
      if (it === B.length)
        return l(j, ze), hn && Co(j, it), Ie;
      if (ze === null) {
        for (; it < B.length; it++)
          ze = le(j, B[it], pe), ze !== null && (N = p(ze, N, it), at === null ? Ie = ze : at.sibling = ze, at = ze);
        return hn && Co(j, it), Ie;
      }
      for (ze = u(j, ze); it < B.length; it++)
        lr = Re(ze, j, it, B[it], pe), lr !== null && (n && lr.alternate !== null && ze.delete(lr.key === null ? it : lr.key), N = p(lr, N, it), at === null ? Ie = lr : at.sibling = lr, at = lr);
      return n && ze.forEach(function(sl) {
        return r(j, sl);
      }), hn && Co(j, it), Ie;
    }
    function He(j, N, B, pe) {
      var Ie = ke(B);
      if (typeof Ie != "function")
        throw Error(h(150));
      if (B = Ie.call(B), B == null)
        throw Error(h(151));
      for (var at = Ie = null, ze = N, it = N = 0, lr = null, $t = B.next(); ze !== null && !$t.done; it++, $t = B.next()) {
        ze.index > it ? (lr = ze, ze = null) : lr = ze.sibling;
        var sl = te(j, ze, $t.value, pe);
        if (sl === null) {
          ze === null && (ze = lr);
          break;
        }
        n && ze && sl.alternate === null && r(j, ze), N = p(sl, N, it), at === null ? Ie = sl : at.sibling = sl, at = sl, ze = lr;
      }
      if ($t.done)
        return l(
          j,
          ze
        ), hn && Co(j, it), Ie;
      if (ze === null) {
        for (; !$t.done; it++, $t = B.next())
          $t = le(j, $t.value, pe), $t !== null && (N = p($t, N, it), at === null ? Ie = $t : at.sibling = $t, at = $t);
        return hn && Co(j, it), Ie;
      }
      for (ze = u(j, ze); !$t.done; it++, $t = B.next())
        $t = Re(ze, j, it, $t.value, pe), $t !== null && (n && $t.alternate !== null && ze.delete($t.key === null ? it : $t.key), N = p($t, N, it), at === null ? Ie = $t : at.sibling = $t, at = $t);
      return n && ze.forEach(function(rg) {
        return r(j, rg);
      }), hn && Co(j, it), Ie;
    }
    function Wn(j, N, B, pe) {
      if (typeof B == "object" && B !== null && B.type === wt && B.key === null && (B = B.props.children), typeof B == "object" && B !== null) {
        switch (B.$$typeof) {
          case Nt:
            e: {
              for (var Ie = B.key, at = N; at !== null; ) {
                if (at.key === Ie) {
                  if (Ie = B.type, Ie === wt) {
                    if (at.tag === 7) {
                      l(j, at.sibling), N = c(at, B.props.children), N.return = j, j = N;
                      break e;
                    }
                  } else if (at.elementType === Ie || typeof Ie == "object" && Ie !== null && Ie.$$typeof === Dt && th(Ie) === at.type) {
                    l(j, at.sibling), N = c(at, B.props), N.ref = hu(j, at, B), N.return = j, j = N;
                    break e;
                  }
                  l(j, at);
                  break;
                } else
                  r(j, at);
                at = at.sibling;
              }
              B.type === wt ? (N = Uo(B.props.children, j.mode, pe, B.key), N.return = j, j = N) : (pe = Ef(B.type, B.key, B.props, null, j.mode, pe), pe.ref = hu(j, N, B), pe.return = j, j = pe);
            }
            return S(j);
          case Le:
            e: {
              for (at = B.key; N !== null; ) {
                if (N.key === at)
                  if (N.tag === 4 && N.stateNode.containerInfo === B.containerInfo && N.stateNode.implementation === B.implementation) {
                    l(j, N.sibling), N = c(N, B.children || []), N.return = j, j = N;
                    break e;
                  } else {
                    l(j, N);
                    break;
                  }
                else
                  r(j, N);
                N = N.sibling;
              }
              N = Zs(B, j.mode, pe), N.return = j, j = N;
            }
            return S(j);
          case Dt:
            return at = B._init, Wn(j, N, at(B._payload), pe);
        }
        if (nr(B))
          return Ae(j, N, B, pe);
        if (ke(B))
          return He(j, N, B, pe);
        Ls(j, B);
      }
      return typeof B == "string" && B !== "" || typeof B == "number" ? (B = "" + B, N !== null && N.tag === 6 ? (l(j, N.sibling), N = c(N, B), N.return = j, j = N) : (l(j, N), N = bf(B, j.mode, pe), N.return = j, j = N), S(j)) : l(j, N);
    }
    return Wn;
  }
  var mu = nh(!0), rh = nh(!1), As = {}, xi = ln(As), yu = ln(As), zs = ln(As);
  function Hl(n) {
    if (n === As)
      throw Error(h(174));
    return n;
  }
  function Fd(n, r) {
    switch (Vt(zs, r), Vt(yu, n), Vt(xi, As), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : mr(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = mr(r, n);
    }
    $e(xi), Vt(xi, r);
  }
  function gu() {
    $e(xi), $e(yu), $e(zs);
  }
  function Vc(n) {
    Hl(zs.current);
    var r = Hl(xi.current), l = mr(r, n.type);
    r !== l && (Vt(yu, n), Vt(xi, l));
  }
  function Je(n) {
    yu.current === n && ($e(xi), $e(yu));
  }
  var Ye = ln(0);
  function Bt(n) {
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
  var Ln = [];
  function Ba() {
    for (var n = 0; n < Ln.length; n++)
      Ln[n]._workInProgressVersionPrimary = null;
    Ln.length = 0;
  }
  var Us = Qe.ReactCurrentDispatcher, Hd = Qe.ReactCurrentBatchConfig, _o = 0, Dn = null, Vn = null, X = null, $n = !1, rt = !1, Di = 0, il = 0;
  function An() {
    throw Error(h(321));
  }
  function Va(n, r) {
    if (r === null)
      return !1;
    for (var l = 0; l < r.length && l < n.length; l++)
      if (!oi(n[l], r[l]))
        return !1;
    return !0;
  }
  function bo(n, r, l, u, c, p) {
    if (_o = p, Dn = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, Us.current = n === null || n.memoizedState === null ? Fy : Hy, n = l(u, c), rt) {
      p = 0;
      do {
        if (rt = !1, Di = 0, 25 <= p)
          throw Error(h(301));
        p += 1, X = Vn = null, r.updateQueue = null, Us.current = By, n = l(u, c);
      } while (rt);
    }
    if (Us.current = nf, r = Vn !== null && Vn.next !== null, _o = 0, X = Vn = Dn = null, $n = !1, r)
      throw Error(h(300));
    return n;
  }
  function Bl() {
    var n = Di !== 0;
    return Di = 0, n;
  }
  function sa() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return X === null ? Dn.memoizedState = X = n : X = X.next = n, X;
  }
  function ca() {
    if (Vn === null) {
      var n = Dn.alternate;
      n = n !== null ? n.memoizedState : null;
    } else
      n = Vn.next;
    var r = X === null ? Dn.memoizedState : X.next;
    if (r !== null)
      X = r, Vn = n;
    else {
      if (n === null)
        throw Error(h(310));
      Vn = n, n = { memoizedState: Vn.memoizedState, baseState: Vn.baseState, baseQueue: Vn.baseQueue, queue: Vn.queue, next: null }, X === null ? Dn.memoizedState = X = n : X = X.next = n;
    }
    return X;
  }
  function wo(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function Ps(n) {
    var r = ca(), l = r.queue;
    if (l === null)
      throw Error(h(311));
    l.lastRenderedReducer = n;
    var u = Vn, c = u.baseQueue, p = l.pending;
    if (p !== null) {
      if (c !== null) {
        var S = c.next;
        c.next = p.next, p.next = S;
      }
      u.baseQueue = c = p, l.pending = null;
    }
    if (c !== null) {
      p = c.next, u = u.baseState;
      var R = S = null, k = null, Y = p;
      do {
        var ie = Y.lane;
        if ((_o & ie) === ie)
          k !== null && (k = k.next = { lane: 0, action: Y.action, hasEagerState: Y.hasEagerState, eagerState: Y.eagerState, next: null }), u = Y.hasEagerState ? Y.eagerState : n(u, Y.action);
        else {
          var le = {
            lane: ie,
            action: Y.action,
            hasEagerState: Y.hasEagerState,
            eagerState: Y.eagerState,
            next: null
          };
          k === null ? (R = k = le, S = u) : k = k.next = le, Dn.lanes |= ie, No |= ie;
        }
        Y = Y.next;
      } while (Y !== null && Y !== p);
      k === null ? S = u : k.next = R, oi(u, r.memoizedState) || (fa = !0), r.memoizedState = u, r.baseState = S, r.baseQueue = k, l.lastRenderedState = u;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        p = c.lane, Dn.lanes |= p, No |= p, c = c.next;
      while (c !== n);
    } else
      c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function js(n) {
    var r = ca(), l = r.queue;
    if (l === null)
      throw Error(h(311));
    l.lastRenderedReducer = n;
    var u = l.dispatch, c = l.pending, p = r.memoizedState;
    if (c !== null) {
      l.pending = null;
      var S = c = c.next;
      do
        p = n(p, S.action), S = S.next;
      while (S !== c);
      oi(p, r.memoizedState) || (fa = !0), r.memoizedState = p, r.baseQueue === null && (r.baseState = p), l.lastRenderedState = p;
    }
    return [p, u];
  }
  function $c() {
  }
  function Ic(n, r) {
    var l = Dn, u = ca(), c = r(), p = !oi(u.memoizedState, c);
    if (p && (u.memoizedState = c, fa = !0), u = u.queue, Fs(Gc.bind(null, l, u, n), [n]), u.getSnapshot !== r || p || X !== null && X.memoizedState.tag & 1) {
      if (l.flags |= 2048, Ro(9, Wc.bind(null, l, u, c, r), void 0, null), Un === null)
        throw Error(h(349));
      _o & 30 || Yc(l, r, c);
    }
    return c;
  }
  function Yc(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = Dn.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Dn.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
  }
  function Wc(n, r, l, u) {
    r.value = l, r.getSnapshot = u, Qc(r) && qc(n);
  }
  function Gc(n, r, l) {
    return l(function() {
      Qc(r) && qc(n);
    });
  }
  function Qc(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var l = r();
      return !oi(n, l);
    } catch {
      return !0;
    }
  }
  function qc(n) {
    var r = al(n, 1);
    r !== null && On(r, n, 1, -1);
  }
  function Xc(n) {
    var r = sa();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: wo, lastRenderedState: n }, r.queue = n, n = n.dispatch = tf.bind(null, Dn, n), [r.memoizedState, n];
  }
  function Ro(n, r, l, u) {
    return n = { tag: n, create: r, destroy: l, deps: u, next: null }, r = Dn.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Dn.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (u = l.next, l.next = n, n.next = u, r.lastEffect = n)), n;
  }
  function Kc() {
    return ca().memoizedState;
  }
  function Su(n, r, l, u) {
    var c = sa();
    Dn.flags |= n, c.memoizedState = Ro(1 | r, l, void 0, u === void 0 ? null : u);
  }
  function To(n, r, l, u) {
    var c = ca();
    u = u === void 0 ? null : u;
    var p = void 0;
    if (Vn !== null) {
      var S = Vn.memoizedState;
      if (p = S.destroy, u !== null && Va(u, S.deps)) {
        c.memoizedState = Ro(r, l, p, u);
        return;
      }
    }
    Dn.flags |= n, c.memoizedState = Ro(1 | r, l, p, u);
  }
  function xo(n, r) {
    return Su(8390656, 8, n, r);
  }
  function Fs(n, r) {
    return To(2048, 8, n, r);
  }
  function Zc(n, r) {
    return To(4, 2, n, r);
  }
  function Jc(n, r) {
    return To(4, 4, n, r);
  }
  function ef(n, r) {
    if (typeof r == "function")
      return n = n(), r(n), function() {
        r(null);
      };
    if (r != null)
      return n = n(), r.current = n, function() {
        r.current = null;
      };
  }
  function Bd(n, r, l) {
    return l = l != null ? l.concat([n]) : null, To(4, 4, ef.bind(null, r, n), l);
  }
  function Do() {
  }
  function Vd(n, r) {
    var l = ca();
    r = r === void 0 ? null : r;
    var u = l.memoizedState;
    return u !== null && r !== null && Va(r, u[1]) ? u[0] : (l.memoizedState = [n, r], n);
  }
  function Cu(n, r) {
    var l = ca();
    r = r === void 0 ? null : r;
    var u = l.memoizedState;
    return u !== null && r !== null && Va(r, u[1]) ? u[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function Vl(n, r, l) {
    return _o & 21 ? (oi(l, r) || (l = uo(), Dn.lanes |= l, No |= l, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, fa = !0), n.memoizedState = l);
  }
  function Ta(n, r) {
    var l = Lt;
    Lt = l !== 0 && 4 > l ? l : 4, n(!0);
    var u = Hd.transition;
    Hd.transition = {};
    try {
      n(!1), r();
    } finally {
      Lt = l, Hd.transition = u;
    }
  }
  function ah() {
    return ca().memoizedState;
  }
  function dn(n, r, l) {
    var u = ul(n);
    if (l = { lane: u, action: l, hasEagerState: !1, eagerState: null, next: null }, Hs(n))
      Eu(r, l);
    else if (l = qv(n, r, l, u), l !== null) {
      var c = vr();
      On(l, n, u, c), Bs(l, r, u);
    }
  }
  function tf(n, r, l) {
    var u = ul(n), c = { lane: u, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (Hs(n))
      Eu(r, c);
    else {
      var p = n.alternate;
      if (n.lanes === 0 && (p === null || p.lanes === 0) && (p = r.lastRenderedReducer, p !== null))
        try {
          var S = r.lastRenderedState, R = p(S, l);
          if (c.hasEagerState = !0, c.eagerState = R, oi(R, S)) {
            var k = r.interleaved;
            k === null ? (c.next = c, Ra(r)) : (c.next = k.next, k.next = c), r.interleaved = c;
            return;
          }
        } catch {
        } finally {
        }
      l = qv(n, r, c, u), l !== null && (c = vr(), On(l, n, u, c), Bs(l, r, u));
    }
  }
  function Hs(n) {
    var r = n.alternate;
    return n === Dn || r !== null && r === Dn;
  }
  function Eu(n, r) {
    rt = $n = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function Bs(n, r, l) {
    if (l & 4194240) {
      var u = r.lanes;
      u &= n.pendingLanes, l |= u, r.lanes = l, us(n, l);
    }
  }
  var nf = { readContext: me, useCallback: An, useContext: An, useEffect: An, useImperativeHandle: An, useInsertionEffect: An, useLayoutEffect: An, useMemo: An, useReducer: An, useRef: An, useState: An, useDebugValue: An, useDeferredValue: An, useTransition: An, useMutableSource: An, useSyncExternalStore: An, useId: An, unstable_isNewReconciler: !1 }, Fy = { readContext: me, useCallback: function(n, r) {
    return sa().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: me, useEffect: xo, useImperativeHandle: function(n, r, l) {
    return l = l != null ? l.concat([n]) : null, Su(
      4194308,
      4,
      ef.bind(null, r, n),
      l
    );
  }, useLayoutEffect: function(n, r) {
    return Su(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return Su(4, 2, n, r);
  }, useMemo: function(n, r) {
    var l = sa();
    return r = r === void 0 ? null : r, n = n(), l.memoizedState = [n, r], n;
  }, useReducer: function(n, r, l) {
    var u = sa();
    return r = l !== void 0 ? l(r) : r, u.memoizedState = u.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, u.queue = n, n = n.dispatch = dn.bind(null, Dn, n), [u.memoizedState, n];
  }, useRef: function(n) {
    var r = sa();
    return n = { current: n }, r.memoizedState = n;
  }, useState: Xc, useDebugValue: Do, useDeferredValue: function(n) {
    return sa().memoizedState = n;
  }, useTransition: function() {
    var n = Xc(!1), r = n[0];
    return n = Ta.bind(null, n[1]), sa().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var u = Dn, c = sa();
    if (hn) {
      if (l === void 0)
        throw Error(h(407));
      l = l();
    } else {
      if (l = r(), Un === null)
        throw Error(h(349));
      _o & 30 || Yc(u, r, l);
    }
    c.memoizedState = l;
    var p = { value: l, getSnapshot: r };
    return c.queue = p, xo(Gc.bind(
      null,
      u,
      p,
      n
    ), [n]), u.flags |= 2048, Ro(9, Wc.bind(null, u, p, l, r), void 0, null), l;
  }, useId: function() {
    var n = sa(), r = Un.identifierPrefix;
    if (hn) {
      var l = Cr, u = oa;
      l = (u & ~(1 << 32 - Fr(u) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = Di++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else
      l = il++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, Hy = {
    readContext: me,
    useCallback: Vd,
    useContext: me,
    useEffect: Fs,
    useImperativeHandle: Bd,
    useInsertionEffect: Zc,
    useLayoutEffect: Jc,
    useMemo: Cu,
    useReducer: Ps,
    useRef: Kc,
    useState: function() {
      return Ps(wo);
    },
    useDebugValue: Do,
    useDeferredValue: function(n) {
      var r = ca();
      return Vl(r, Vn.memoizedState, n);
    },
    useTransition: function() {
      var n = Ps(wo)[0], r = ca().memoizedState;
      return [n, r];
    },
    useMutableSource: $c,
    useSyncExternalStore: Ic,
    useId: ah,
    unstable_isNewReconciler: !1
  }, By = { readContext: me, useCallback: Vd, useContext: me, useEffect: Fs, useImperativeHandle: Bd, useInsertionEffect: Zc, useLayoutEffect: Jc, useMemo: Cu, useReducer: js, useRef: Kc, useState: function() {
    return js(wo);
  }, useDebugValue: Do, useDeferredValue: function(n) {
    var r = ca();
    return Vn === null ? r.memoizedState = n : Vl(r, Vn.memoizedState, n);
  }, useTransition: function() {
    var n = js(wo)[0], r = ca().memoizedState;
    return [n, r];
  }, useMutableSource: $c, useSyncExternalStore: Ic, useId: ah, unstable_isNewReconciler: !1 };
  function $l(n, r) {
    try {
      var l = "", u = r;
      do
        l += Ve(u), u = u.return;
      while (u);
      var c = l;
    } catch (p) {
      c = `
Error generating stack: ` + p.message + `
` + p.stack;
    }
    return { value: n, source: r, stack: c, digest: null };
  }
  function $d(n, r, l) {
    return { value: n, source: null, stack: l ?? null, digest: r ?? null };
  }
  function Vs(n, r) {
    try {
      console.error(r.value);
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  var ih = typeof WeakMap == "function" ? WeakMap : Map;
  function lh(n, r, l) {
    l = fn(-1, l), l.tag = 3, l.payload = { element: null };
    var u = r.value;
    return l.callback = function() {
      hf || (hf = !0, Zd = u), Vs(n, r);
    }, l;
  }
  function oh(n, r, l) {
    l = fn(-1, l), l.tag = 3;
    var u = n.type.getDerivedStateFromError;
    if (typeof u == "function") {
      var c = r.value;
      l.payload = function() {
        return u(c);
      }, l.callback = function() {
        Vs(n, r);
      };
    }
    var p = n.stateNode;
    return p !== null && typeof p.componentDidCatch == "function" && (l.callback = function() {
      Vs(n, r), typeof u != "function" && (Ya === null ? Ya = /* @__PURE__ */ new Set([this]) : Ya.add(this));
      var S = r.stack;
      this.componentDidCatch(r.value, { componentStack: S !== null ? S : "" });
    }), l;
  }
  function $s(n, r, l) {
    var u = n.pingCache;
    if (u === null) {
      u = n.pingCache = new ih();
      var c = /* @__PURE__ */ new Set();
      u.set(r, c);
    } else
      c = u.get(r), c === void 0 && (c = /* @__PURE__ */ new Set(), u.set(r, c));
    c.has(l) || (c.add(l), n = Ky.bind(null, n, r, l), r.then(n, n));
  }
  function uh(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r)
        return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function Id(n, r, l, u, c) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = c, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = fn(-1, 1), r.tag = 2, Fl(l, r, 1))), l.lanes |= 1), n);
  }
  var sh = Qe.ReactCurrentOwner, fa = !1;
  function In(n, r, l, u) {
    r.child = n === null ? rh(r, null, l, u) : mu(r, n.child, l, u);
  }
  function _u(n, r, l, u, c) {
    l = l.render;
    var p = r.ref;
    return Bn(r, c), u = bo(n, r, l, u, p, c), l = Bl(), n !== null && !fa ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Yn(n, r, c)) : (hn && l && Uc(r), r.flags |= 1, In(n, r, u, c), r.child);
  }
  function Il(n, r, l, u, c) {
    if (n === null) {
      var p = l.type;
      return typeof p == "function" && !rp(p) && p.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = p, rf(n, r, p, u, c)) : (n = Ef(l.type, null, u, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (p = n.child, !(n.lanes & c)) {
      var S = p.memoizedProps;
      if (l = l.compare, l = l !== null ? l : ou, l(S, u) && n.ref === r.ref)
        return Yn(n, r, c);
    }
    return r.flags |= 1, n = Gl(p, u), n.ref = r.ref, n.return = r, r.child = n;
  }
  function rf(n, r, l, u, c) {
    if (n !== null) {
      var p = n.memoizedProps;
      if (ou(p, u) && n.ref === r.ref)
        if (fa = !1, r.pendingProps = u = p, (n.lanes & c) !== 0)
          n.flags & 131072 && (fa = !0);
        else
          return r.lanes = n.lanes, Yn(n, r, c);
    }
    return mt(n, r, l, u, c);
  }
  function da(n, r, l) {
    var u = r.pendingProps, c = u.children, p = n !== null ? n.memoizedState : null;
    if (u.mode === "hidden")
      if (!(r.mode & 1))
        r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Vt(Nu, pa), pa |= l;
      else {
        if (!(l & 1073741824))
          return n = p !== null ? p.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, Vt(Nu, pa), pa |= n, null;
        r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, u = p !== null ? p.baseLanes : l, Vt(Nu, pa), pa |= u;
      }
    else
      p !== null ? (u = p.baseLanes | l, r.memoizedState = null) : u = l, Vt(Nu, pa), pa |= u;
    return In(n, r, c, l), r.child;
  }
  function Oo(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function mt(n, r, l, u, c) {
    var p = Zn(l) ? Hr : fr.current;
    return p = _a(r, p), Bn(r, c), l = bo(n, r, l, u, p, c), u = Bl(), n !== null && !fa ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Yn(n, r, c)) : (hn && u && Uc(r), r.flags |= 1, In(n, r, l, c), r.child);
  }
  function Is(n, r, l, u, c) {
    if (Zn(l)) {
      var p = !0;
      go(r);
    } else
      p = !1;
    if (Bn(r, c), r.stateNode === null)
      Ws(n, r), Jv(r, l, u), jd(r, l, u, c), u = !0;
    else if (n === null) {
      var S = r.stateNode, R = r.memoizedProps;
      S.props = R;
      var k = S.context, Y = l.contextType;
      typeof Y == "object" && Y !== null ? Y = me(Y) : (Y = Zn(l) ? Hr : fr.current, Y = _a(r, Y));
      var ie = l.getDerivedStateFromProps, le = typeof ie == "function" || typeof S.getSnapshotBeforeUpdate == "function";
      le || typeof S.UNSAFE_componentWillReceiveProps != "function" && typeof S.componentWillReceiveProps != "function" || (R !== u || k !== Y) && eh(r, S, u, Y), jl = !1;
      var te = r.memoizedState;
      S.state = te, Ns(r, u, S, c), k = r.memoizedState, R !== u || te !== k || dt.current || jl ? (typeof ie == "function" && (Pd(r, l, ie, u), k = r.memoizedState), (R = jl || Zv(r, l, R, u, te, k, Y)) ? (le || typeof S.UNSAFE_componentWillMount != "function" && typeof S.componentWillMount != "function" || (typeof S.componentWillMount == "function" && S.componentWillMount(), typeof S.UNSAFE_componentWillMount == "function" && S.UNSAFE_componentWillMount()), typeof S.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof S.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = u, r.memoizedState = k), S.props = u, S.state = k, S.context = Y, u = R) : (typeof S.componentDidMount == "function" && (r.flags |= 4194308), u = !1);
    } else {
      S = r.stateNode, Xv(n, r), R = r.memoizedProps, Y = r.type === r.elementType ? R : ua(r.type, R), S.props = Y, le = r.pendingProps, te = S.context, k = l.contextType, typeof k == "object" && k !== null ? k = me(k) : (k = Zn(l) ? Hr : fr.current, k = _a(r, k));
      var Re = l.getDerivedStateFromProps;
      (ie = typeof Re == "function" || typeof S.getSnapshotBeforeUpdate == "function") || typeof S.UNSAFE_componentWillReceiveProps != "function" && typeof S.componentWillReceiveProps != "function" || (R !== le || te !== k) && eh(r, S, u, k), jl = !1, te = r.memoizedState, S.state = te, Ns(r, u, S, c);
      var Ae = r.memoizedState;
      R !== le || te !== Ae || dt.current || jl ? (typeof Re == "function" && (Pd(r, l, Re, u), Ae = r.memoizedState), (Y = jl || Zv(r, l, Y, u, te, Ae, k) || !1) ? (ie || typeof S.UNSAFE_componentWillUpdate != "function" && typeof S.componentWillUpdate != "function" || (typeof S.componentWillUpdate == "function" && S.componentWillUpdate(u, Ae, k), typeof S.UNSAFE_componentWillUpdate == "function" && S.UNSAFE_componentWillUpdate(u, Ae, k)), typeof S.componentDidUpdate == "function" && (r.flags |= 4), typeof S.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof S.componentDidUpdate != "function" || R === n.memoizedProps && te === n.memoizedState || (r.flags |= 4), typeof S.getSnapshotBeforeUpdate != "function" || R === n.memoizedProps && te === n.memoizedState || (r.flags |= 1024), r.memoizedProps = u, r.memoizedState = Ae), S.props = u, S.state = Ae, S.context = k, u = Y) : (typeof S.componentDidUpdate != "function" || R === n.memoizedProps && te === n.memoizedState || (r.flags |= 4), typeof S.getSnapshotBeforeUpdate != "function" || R === n.memoizedProps && te === n.memoizedState || (r.flags |= 1024), u = !1);
    }
    return af(n, r, l, u, p, c);
  }
  function af(n, r, l, u, c, p) {
    Oo(n, r);
    var S = (r.flags & 128) !== 0;
    if (!u && !S)
      return c && Wv(r, l, !1), Yn(n, r, p);
    u = r.stateNode, sh.current = r;
    var R = S && typeof l.getDerivedStateFromError != "function" ? null : u.render();
    return r.flags |= 1, n !== null && S ? (r.child = mu(r, n.child, null, p), r.child = mu(r, null, R, p)) : In(n, r, R, p), r.memoizedState = u.state, c && Wv(r, l, !0), r.child;
  }
  function Vy(n) {
    var r = n.stateNode;
    r.pendingContext ? wi(n, r.pendingContext, r.pendingContext !== r.context) : r.context && wi(n, r.context, !1), Fd(n, r.containerInfo);
  }
  function ch(n, r, l, u, c) {
    return fu(), Jn(c), r.flags |= 256, In(n, r, l, u), r.child;
  }
  var Ys = { dehydrated: null, treeContext: null, retryLane: 0 };
  function ko(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function fh(n, r, l) {
    var u = r.pendingProps, c = Ye.current, p = !1, S = (r.flags & 128) !== 0, R;
    if ((R = S) || (R = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), R ? (p = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), Vt(Ye, c & 1), n === null)
      return jc(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (S = u.children, n = u.fallback, p ? (u = r.mode, p = r.child, S = { mode: "hidden", children: S }, !(u & 1) && p !== null ? (p.childLanes = 0, p.pendingProps = S) : p = _f(S, u, 0, null), n = Uo(n, u, l, null), p.return = r, n.return = r, p.sibling = n, r.child = p, r.child.memoizedState = ko(l), r.memoizedState = Ys, n) : lf(r, S));
    if (c = n.memoizedState, c !== null && (R = c.dehydrated, R !== null))
      return Yd(n, r, S, u, R, c, l);
    if (p) {
      p = u.fallback, S = r.mode, c = n.child, R = c.sibling;
      var k = { mode: "hidden", children: u.children };
      return !(S & 1) && r.child !== c ? (u = r.child, u.childLanes = 0, u.pendingProps = k, r.deletions = null) : (u = Gl(c, k), u.subtreeFlags = c.subtreeFlags & 14680064), R !== null ? p = Gl(R, p) : (p = Uo(p, S, l, null), p.flags |= 2), p.return = r, u.return = r, u.sibling = p, r.child = u, u = p, p = r.child, S = n.child.memoizedState, S = S === null ? ko(l) : { baseLanes: S.baseLanes | l, cachePool: null, transitions: S.transitions }, p.memoizedState = S, p.childLanes = n.childLanes & ~l, r.memoizedState = Ys, u;
    }
    return p = n.child, n = p.sibling, u = Gl(p, { mode: "visible", children: u.children }), !(r.mode & 1) && (u.lanes = l), u.return = r, u.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = u, r.memoizedState = null, u;
  }
  function lf(n, r) {
    return r = _f({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function of(n, r, l, u) {
    return u !== null && Jn(u), mu(r, n.child, null, l), n = lf(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Yd(n, r, l, u, c, p, S) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, u = $d(Error(h(422))), of(n, r, S, u)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (p = u.fallback, c = r.mode, u = _f({ mode: "visible", children: u.children }, c, 0, null), p = Uo(p, c, S, null), p.flags |= 2, u.return = r, p.return = r, u.sibling = p, r.child = u, r.mode & 1 && mu(r, n.child, null, S), r.child.memoizedState = ko(S), r.memoizedState = Ys, p);
    if (!(r.mode & 1))
      return of(n, r, S, null);
    if (c.data === "$!") {
      if (u = c.nextSibling && c.nextSibling.dataset, u)
        var R = u.dgst;
      return u = R, p = Error(h(419)), u = $d(p, u, void 0), of(n, r, S, u);
    }
    if (R = (S & n.childLanes) !== 0, fa || R) {
      if (u = Un, u !== null) {
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
        c = c & (u.suspendedLanes | S) ? 0 : c, c !== 0 && c !== p.retryLane && (p.retryLane = c, al(n, c), On(u, n, c, -1));
      }
      return Ks(), u = $d(Error(h(421))), of(n, r, S, u);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = np.bind(null, n), c._reactRetry = r, null) : (n = p.treeContext, wa = Ea(c.nextSibling), ba = r, hn = !0, Ha = null, n !== null && (ia[la++] = oa, ia[la++] = Cr, ia[la++] = ci, oa = n.id, Cr = n.overflow, ci = r), r = lf(r, u.children), r.flags |= 4096, r);
  }
  function dh(n, r, l) {
    n.lanes |= r;
    var u = n.alternate;
    u !== null && (u.lanes |= r), Pl(n.return, r, l);
  }
  function uf(n, r, l, u, c) {
    var p = n.memoizedState;
    p === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: u, tail: l, tailMode: c } : (p.isBackwards = r, p.rendering = null, p.renderingStartTime = 0, p.last = u, p.tail = l, p.tailMode = c);
  }
  function Wd(n, r, l) {
    var u = r.pendingProps, c = u.revealOrder, p = u.tail;
    if (In(n, r, u.children, l), u = Ye.current, u & 2)
      u = u & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && n.flags & 128)
        e:
          for (n = r.child; n !== null; ) {
            if (n.tag === 13)
              n.memoizedState !== null && dh(n, l, r);
            else if (n.tag === 19)
              dh(n, l, r);
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
      u &= 1;
    }
    if (Vt(Ye, u), !(r.mode & 1))
      r.memoizedState = null;
    else
      switch (c) {
        case "forwards":
          for (l = r.child, c = null; l !== null; )
            n = l.alternate, n !== null && Bt(n) === null && (c = l), l = l.sibling;
          l = c, l === null ? (c = r.child, r.child = null) : (c = l.sibling, l.sibling = null), uf(r, !1, c, l, p);
          break;
        case "backwards":
          for (l = null, c = r.child, r.child = null; c !== null; ) {
            if (n = c.alternate, n !== null && Bt(n) === null) {
              r.child = c;
              break;
            }
            n = c.sibling, c.sibling = l, l = c, c = n;
          }
          uf(r, !0, l, null, p);
          break;
        case "together":
          uf(r, !1, null, null, void 0);
          break;
        default:
          r.memoizedState = null;
      }
    return r.child;
  }
  function Ws(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function Yn(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), No |= r.lanes, !(l & r.childLanes))
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
  function ll(n, r, l) {
    switch (r.tag) {
      case 3:
        Vy(r), fu();
        break;
      case 5:
        Vc(r);
        break;
      case 1:
        Zn(r.type) && go(r);
        break;
      case 4:
        Fd(r, r.stateNode.containerInfo);
        break;
      case 10:
        var u = r.type._context, c = r.memoizedProps.value;
        Vt(du, u._currentValue), u._currentValue = c;
        break;
      case 13:
        if (u = r.memoizedState, u !== null)
          return u.dehydrated !== null ? (Vt(Ye, Ye.current & 1), r.flags |= 128, null) : l & r.child.childLanes ? fh(n, r, l) : (Vt(Ye, Ye.current & 1), n = Yn(n, r, l), n !== null ? n.sibling : null);
        Vt(Ye, Ye.current & 1);
        break;
      case 19:
        if (u = (l & r.childLanes) !== 0, n.flags & 128) {
          if (u)
            return Wd(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), Vt(Ye, Ye.current), u)
          break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, da(n, r, l);
    }
    return Yn(n, r, l);
  }
  var Oi, bu, wu, $a;
  Oi = function(n, r) {
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
  }, bu = function() {
  }, wu = function(n, r, l, u) {
    var c = n.memoizedProps;
    if (c !== u) {
      n = r.stateNode, Hl(xi.current);
      var p = null;
      switch (l) {
        case "input":
          c = Sn(n, c), u = Sn(n, u), p = [];
          break;
        case "select":
          c = O({}, c, { value: void 0 }), u = O({}, u, { value: void 0 }), p = [];
          break;
        case "textarea":
          c = zr(n, c), u = zr(n, u), p = [];
          break;
        default:
          typeof c.onClick != "function" && typeof u.onClick == "function" && (n.onclick = Lc);
      }
      Ke(l, u);
      var S;
      l = null;
      for (Y in c)
        if (!u.hasOwnProperty(Y) && c.hasOwnProperty(Y) && c[Y] != null)
          if (Y === "style") {
            var R = c[Y];
            for (S in R)
              R.hasOwnProperty(S) && (l || (l = {}), l[S] = "");
          } else
            Y !== "dangerouslySetInnerHTML" && Y !== "children" && Y !== "suppressContentEditableWarning" && Y !== "suppressHydrationWarning" && Y !== "autoFocus" && (w.hasOwnProperty(Y) ? p || (p = []) : (p = p || []).push(Y, null));
      for (Y in u) {
        var k = u[Y];
        if (R = c?.[Y], u.hasOwnProperty(Y) && k !== R && (k != null || R != null))
          if (Y === "style")
            if (R) {
              for (S in R)
                !R.hasOwnProperty(S) || k && k.hasOwnProperty(S) || (l || (l = {}), l[S] = "");
              for (S in k)
                k.hasOwnProperty(S) && R[S] !== k[S] && (l || (l = {}), l[S] = k[S]);
            } else
              l || (p || (p = []), p.push(
                Y,
                l
              )), l = k;
          else
            Y === "dangerouslySetInnerHTML" ? (k = k ? k.__html : void 0, R = R ? R.__html : void 0, k != null && R !== k && (p = p || []).push(Y, k)) : Y === "children" ? typeof k != "string" && typeof k != "number" || (p = p || []).push(Y, "" + k) : Y !== "suppressContentEditableWarning" && Y !== "suppressHydrationWarning" && (w.hasOwnProperty(Y) ? (k != null && Y === "onScroll" && an("scroll", n), p || R === k || (p = [])) : (p = p || []).push(Y, k));
      }
      l && (p = p || []).push("style", l);
      var Y = p;
      (r.updateQueue = Y) && (r.flags |= 4);
    }
  }, $a = function(n, r, l, u) {
    l !== u && (r.flags |= 4);
  };
  function zn(n, r) {
    if (!hn)
      switch (n.tailMode) {
        case "hidden":
          r = n.tail;
          for (var l = null; r !== null; )
            r.alternate !== null && (l = r), r = r.sibling;
          l === null ? n.tail = null : l.sibling = null;
          break;
        case "collapsed":
          l = n.tail;
          for (var u = null; l !== null; )
            l.alternate !== null && (u = l), l = l.sibling;
          u === null ? r || n.tail === null ? n.tail = null : n.tail.sibling = null : u.sibling = null;
      }
  }
  function Lr(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, l = 0, u = 0;
    if (r)
      for (var c = n.child; c !== null; )
        l |= c.lanes | c.childLanes, u |= c.subtreeFlags & 14680064, u |= c.flags & 14680064, c.return = n, c = c.sibling;
    else
      for (c = n.child; c !== null; )
        l |= c.lanes | c.childLanes, u |= c.subtreeFlags, u |= c.flags, c.return = n, c = c.sibling;
    return n.subtreeFlags |= u, n.childLanes = l, r;
  }
  function $y(n, r, l) {
    var u = r.pendingProps;
    switch (Pc(r), r.tag) {
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
        return Lr(r), null;
      case 1:
        return Zn(r.type) && aa(), Lr(r), null;
      case 3:
        return u = r.stateNode, gu(), $e(dt), $e(fr), Ba(), u.pendingContext && (u.context = u.pendingContext, u.pendingContext = null), (n === null || n.child === null) && (Fc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, Ha !== null && (Jd(Ha), Ha = null))), bu(n, r), Lr(r), null;
      case 5:
        Je(r);
        var c = Hl(zs.current);
        if (l = r.type, n !== null && r.stateNode != null)
          wu(n, r, l, u, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!u) {
            if (r.stateNode === null)
              throw Error(h(166));
            return Lr(r), null;
          }
          if (n = Hl(xi.current), Fc(r)) {
            u = r.stateNode, l = r.type;
            var p = r.memoizedProps;
            switch (u[Ua] = r, u[ks] = p, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                an("cancel", u), an("close", u);
                break;
              case "iframe":
              case "object":
              case "embed":
                an("load", u);
                break;
              case "video":
              case "audio":
                for (c = 0; c < Ji.length; c++)
                  an(Ji[c], u);
                break;
              case "source":
                an("error", u);
                break;
              case "img":
              case "image":
              case "link":
                an(
                  "error",
                  u
                ), an("load", u);
                break;
              case "details":
                an("toggle", u);
                break;
              case "input":
                Hn(u, p), an("invalid", u);
                break;
              case "select":
                u._wrapperState = { wasMultiple: !!p.multiple }, an("invalid", u);
                break;
              case "textarea":
                Ur(u, p), an("invalid", u);
            }
            Ke(l, p), c = null;
            for (var S in p)
              if (p.hasOwnProperty(S)) {
                var R = p[S];
                S === "children" ? typeof R == "string" ? u.textContent !== R && (p.suppressHydrationWarning !== !0 && Ts(u.textContent, R, n), c = ["children", R]) : typeof R == "number" && u.textContent !== "" + R && (p.suppressHydrationWarning !== !0 && Ts(
                  u.textContent,
                  R,
                  n
                ), c = ["children", "" + R]) : w.hasOwnProperty(S) && R != null && S === "onScroll" && an("scroll", u);
              }
            switch (l) {
              case "input":
                qn(u), bn(u, p, !0);
                break;
              case "textarea":
                qn(u), Pr(u);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof p.onClick == "function" && (u.onclick = Lc);
            }
            u = c, r.updateQueue = u, u !== null && (r.flags |= 4);
          } else {
            S = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = Rn(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = S.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof u.is == "string" ? n = S.createElement(l, { is: u.is }) : (n = S.createElement(l), l === "select" && (S = n, u.multiple ? S.multiple = !0 : u.size && (S.size = u.size))) : n = S.createElementNS(n, l), n[Ua] = r, n[ks] = u, Oi(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (S = Et(l, u), l) {
                case "dialog":
                  an("cancel", n), an("close", n), c = u;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  an("load", n), c = u;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < Ji.length; c++)
                    an(Ji[c], n);
                  c = u;
                  break;
                case "source":
                  an("error", n), c = u;
                  break;
                case "img":
                case "image":
                case "link":
                  an(
                    "error",
                    n
                  ), an("load", n), c = u;
                  break;
                case "details":
                  an("toggle", n), c = u;
                  break;
                case "input":
                  Hn(n, u), c = Sn(n, u), an("invalid", n);
                  break;
                case "option":
                  c = u;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!u.multiple }, c = O({}, u, { value: void 0 }), an("invalid", n);
                  break;
                case "textarea":
                  Ur(n, u), c = zr(n, u), an("invalid", n);
                  break;
                default:
                  c = u;
              }
              Ke(l, c), R = c;
              for (p in R)
                if (R.hasOwnProperty(p)) {
                  var k = R[p];
                  p === "style" ? q(n, k) : p === "dangerouslySetInnerHTML" ? (k = k ? k.__html : void 0, k != null && jr(n, k)) : p === "children" ? typeof k == "string" ? (l !== "textarea" || k !== "") && yr(n, k) : typeof k == "number" && yr(n, "" + k) : p !== "suppressContentEditableWarning" && p !== "suppressHydrationWarning" && p !== "autoFocus" && (w.hasOwnProperty(p) ? k != null && p === "onScroll" && an("scroll", n) : k != null && Xe(n, p, k, S));
                }
              switch (l) {
                case "input":
                  qn(n), bn(n, u, !1);
                  break;
                case "textarea":
                  qn(n), Pr(n);
                  break;
                case "option":
                  u.value != null && n.setAttribute("value", "" + yt(u.value));
                  break;
                case "select":
                  n.multiple = !!u.multiple, p = u.value, p != null ? wn(n, !!u.multiple, p, !1) : u.defaultValue != null && wn(
                    n,
                    !!u.multiple,
                    u.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof c.onClick == "function" && (n.onclick = Lc);
              }
              switch (l) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  u = !!u.autoFocus;
                  break e;
                case "img":
                  u = !0;
                  break e;
                default:
                  u = !1;
              }
            }
            u && (r.flags |= 4);
          }
          r.ref !== null && (r.flags |= 512, r.flags |= 2097152);
        }
        return Lr(r), null;
      case 6:
        if (n && r.stateNode != null)
          $a(n, r, n.memoizedProps, u);
        else {
          if (typeof u != "string" && r.stateNode === null)
            throw Error(h(166));
          if (l = Hl(zs.current), Hl(xi.current), Fc(r)) {
            if (u = r.stateNode, l = r.memoizedProps, u[Ua] = r, (p = u.nodeValue !== l) && (n = ba, n !== null))
              switch (n.tag) {
                case 3:
                  Ts(u.nodeValue, l, (n.mode & 1) !== 0);
                  break;
                case 5:
                  n.memoizedProps.suppressHydrationWarning !== !0 && Ts(u.nodeValue, l, (n.mode & 1) !== 0);
              }
            p && (r.flags |= 4);
          } else
            u = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(u), u[Ua] = r, r.stateNode = u;
        }
        return Lr(r), null;
      case 13:
        if ($e(Ye), u = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (hn && wa !== null && r.mode & 1 && !(r.flags & 128))
            Qv(), fu(), r.flags |= 98560, p = !1;
          else if (p = Fc(r), u !== null && u.dehydrated !== null) {
            if (n === null) {
              if (!p)
                throw Error(h(318));
              if (p = r.memoizedState, p = p !== null ? p.dehydrated : null, !p)
                throw Error(h(317));
              p[Ua] = r;
            } else
              fu(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            Lr(r), p = !1;
          } else
            Ha !== null && (Jd(Ha), Ha = null), p = !0;
          if (!p)
            return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = l, r) : (u = u !== null, u !== (n !== null && n.memoizedState !== null) && u && (r.child.flags |= 8192, r.mode & 1 && (n === null || Ye.current & 1 ? ar === 0 && (ar = 3) : Ks())), r.updateQueue !== null && (r.flags |= 4), Lr(r), null);
      case 4:
        return gu(), bu(n, r), n === null && _i(r.stateNode.containerInfo), Lr(r), null;
      case 10:
        return zd(r.type._context), Lr(r), null;
      case 17:
        return Zn(r.type) && aa(), Lr(r), null;
      case 19:
        if ($e(Ye), p = r.memoizedState, p === null)
          return Lr(r), null;
        if (u = (r.flags & 128) !== 0, S = p.rendering, S === null)
          if (u)
            zn(p, !1);
          else {
            if (ar !== 0 || n !== null && n.flags & 128)
              for (n = r.child; n !== null; ) {
                if (S = Bt(n), S !== null) {
                  for (r.flags |= 128, zn(p, !1), u = S.updateQueue, u !== null && (r.updateQueue = u, r.flags |= 4), r.subtreeFlags = 0, u = l, l = r.child; l !== null; )
                    p = l, n = u, p.flags &= 14680066, S = p.alternate, S === null ? (p.childLanes = 0, p.lanes = n, p.child = null, p.subtreeFlags = 0, p.memoizedProps = null, p.memoizedState = null, p.updateQueue = null, p.dependencies = null, p.stateNode = null) : (p.childLanes = S.childLanes, p.lanes = S.lanes, p.child = S.child, p.subtreeFlags = 0, p.deletions = null, p.memoizedProps = S.memoizedProps, p.memoizedState = S.memoizedState, p.updateQueue = S.updateQueue, p.type = S.type, n = S.dependencies, p.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
                  return Vt(Ye, Ye.current & 1 | 2), r.child;
                }
                n = n.sibling;
              }
            p.tail !== null && cn() > Au && (r.flags |= 128, u = !0, zn(p, !1), r.lanes = 4194304);
          }
        else {
          if (!u)
            if (n = Bt(S), n !== null) {
              if (r.flags |= 128, u = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), zn(p, !0), p.tail === null && p.tailMode === "hidden" && !S.alternate && !hn)
                return Lr(r), null;
            } else
              2 * cn() - p.renderingStartTime > Au && l !== 1073741824 && (r.flags |= 128, u = !0, zn(p, !1), r.lanes = 4194304);
          p.isBackwards ? (S.sibling = r.child, r.child = S) : (l = p.last, l !== null ? l.sibling = S : r.child = S, p.last = S);
        }
        return p.tail !== null ? (r = p.tail, p.rendering = r, p.tail = r.sibling, p.renderingStartTime = cn(), r.sibling = null, l = Ye.current, Vt(Ye, u ? l & 1 | 2 : l & 1), r) : (Lr(r), null);
      case 22:
      case 23:
        return Sf(), u = r.memoizedState !== null, n !== null && n.memoizedState !== null !== u && (r.flags |= 8192), u && r.mode & 1 ? pa & 1073741824 && (Lr(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : Lr(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(h(156, r.tag));
  }
  function Iy(n, r) {
    switch (Pc(r), r.tag) {
      case 1:
        return Zn(r.type) && aa(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return gu(), $e(dt), $e(fr), Ba(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Je(r), null;
      case 13:
        if ($e(Ye), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null)
            throw Error(h(340));
          fu();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return $e(Ye), null;
      case 4:
        return gu(), null;
      case 10:
        return zd(r.type._context), null;
      case 22:
      case 23:
        return Sf(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Ru = !1, Er = !1, sf = typeof WeakSet == "function" ? WeakSet : Set, Me = null;
  function Tu(n, r) {
    var l = n.ref;
    if (l !== null)
      if (typeof l == "function")
        try {
          l(null);
        } catch (u) {
          Pn(n, r, u);
        }
      else
        l.current = null;
  }
  function Gd(n, r, l) {
    try {
      l();
    } catch (u) {
      Pn(n, r, u);
    }
  }
  var cf = !1;
  function Yy(n, r) {
    if (wd = tu, n = Av(), Cs(n)) {
      if ("selectionStart" in n)
        var l = { start: n.selectionStart, end: n.selectionEnd };
      else
        e: {
          l = (l = n.ownerDocument) && l.defaultView || window;
          var u = l.getSelection && l.getSelection();
          if (u && u.rangeCount !== 0) {
            l = u.anchorNode;
            var c = u.anchorOffset, p = u.focusNode;
            u = u.focusOffset;
            try {
              l.nodeType, p.nodeType;
            } catch {
              l = null;
              break e;
            }
            var S = 0, R = -1, k = -1, Y = 0, ie = 0, le = n, te = null;
            t:
              for (; ; ) {
                for (var Re; le !== l || c !== 0 && le.nodeType !== 3 || (R = S + c), le !== p || u !== 0 && le.nodeType !== 3 || (k = S + u), le.nodeType === 3 && (S += le.nodeValue.length), (Re = le.firstChild) !== null; )
                  te = le, le = Re;
                for (; ; ) {
                  if (le === n)
                    break t;
                  if (te === l && ++Y === c && (R = S), te === p && ++ie === u && (k = S), (Re = le.nextSibling) !== null)
                    break;
                  le = te, te = le.parentNode;
                }
                le = Re;
              }
            l = R === -1 || k === -1 ? null : { start: R, end: k };
          } else
            l = null;
        }
      l = l || { start: 0, end: 0 };
    } else
      l = null;
    for (Rd = { focusedElem: n, selectionRange: l }, tu = !1, Me = r; Me !== null; )
      if (r = Me, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null)
        n.return = r, Me = n;
      else
        for (; Me !== null; ) {
          r = Me;
          try {
            var Ae = r.alternate;
            if (r.flags & 1024)
              switch (r.tag) {
                case 0:
                case 11:
                case 15:
                  break;
                case 1:
                  if (Ae !== null) {
                    var He = Ae.memoizedProps, Wn = Ae.memoizedState, j = r.stateNode, N = j.getSnapshotBeforeUpdate(r.elementType === r.type ? He : ua(r.type, He), Wn);
                    j.__reactInternalSnapshotBeforeUpdate = N;
                  }
                  break;
                case 3:
                  var B = r.stateNode.containerInfo;
                  B.nodeType === 1 ? B.textContent = "" : B.nodeType === 9 && B.documentElement && B.removeChild(B.documentElement);
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
            Pn(r, r.return, pe);
          }
          if (n = r.sibling, n !== null) {
            n.return = r.return, Me = n;
            break;
          }
          Me = r.return;
        }
    return Ae = cf, cf = !1, Ae;
  }
  function xu(n, r, l) {
    var u = r.updateQueue;
    if (u = u !== null ? u.lastEffect : null, u !== null) {
      var c = u = u.next;
      do {
        if ((c.tag & n) === n) {
          var p = c.destroy;
          c.destroy = void 0, p !== void 0 && Gd(r, l, p);
        }
        c = c.next;
      } while (c !== u);
    }
  }
  function ff(n, r) {
    if (r = r.updateQueue, r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & n) === n) {
          var u = l.create;
          l.destroy = u();
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function df(n) {
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
  function ph(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, ph(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Ua], delete r[ks], delete r[Od], delete r[Uy], delete r[Py])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function Qd(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function vh(n) {
    e:
      for (; ; ) {
        for (; n.sibling === null; ) {
          if (n.return === null || Qd(n.return))
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
  function Gs(n, r, l) {
    var u = n.tag;
    if (u === 5 || u === 6)
      n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = Lc));
    else if (u !== 4 && (n = n.child, n !== null))
      for (Gs(n, r, l), n = n.sibling; n !== null; )
        Gs(n, r, l), n = n.sibling;
  }
  function Du(n, r, l) {
    var u = n.tag;
    if (u === 5 || u === 6)
      n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (u !== 4 && (n = n.child, n !== null))
      for (Du(n, r, l), n = n.sibling; n !== null; )
        Du(n, r, l), n = n.sibling;
  }
  var Cn = null, dr = !1;
  function Br(n, r, l) {
    for (l = l.child; l !== null; )
      Ou(n, r, l), l = l.sibling;
  }
  function Ou(n, r, l) {
    if (ea && typeof ea.onCommitFiberUnmount == "function")
      try {
        ea.onCommitFiberUnmount(bl, l);
      } catch {
      }
    switch (l.tag) {
      case 5:
        Er || Tu(l, r);
      case 6:
        var u = Cn, c = dr;
        Cn = null, Br(n, r, l), Cn = u, dr = c, Cn !== null && (dr ? (n = Cn, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : Cn.removeChild(l.stateNode));
        break;
      case 18:
        Cn !== null && (dr ? (n = Cn, l = l.stateNode, n.nodeType === 8 ? Dd(n.parentNode, l) : n.nodeType === 1 && Dd(n, l), za(n)) : Dd(Cn, l.stateNode));
        break;
      case 4:
        u = Cn, c = dr, Cn = l.stateNode.containerInfo, dr = !0, Br(n, r, l), Cn = u, dr = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Er && (u = l.updateQueue, u !== null && (u = u.lastEffect, u !== null))) {
          c = u = u.next;
          do {
            var p = c, S = p.destroy;
            p = p.tag, S !== void 0 && (p & 2 || p & 4) && Gd(l, r, S), c = c.next;
          } while (c !== u);
        }
        Br(n, r, l);
        break;
      case 1:
        if (!Er && (Tu(l, r), u = l.stateNode, typeof u.componentWillUnmount == "function"))
          try {
            u.props = l.memoizedProps, u.state = l.memoizedState, u.componentWillUnmount();
          } catch (R) {
            Pn(l, r, R);
          }
        Br(n, r, l);
        break;
      case 21:
        Br(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (Er = (u = Er) || l.memoizedState !== null, Br(n, r, l), Er = u) : Br(n, r, l);
        break;
      default:
        Br(n, r, l);
    }
  }
  function ku(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var l = n.stateNode;
      l === null && (l = n.stateNode = new sf()), r.forEach(function(u) {
        var c = Zy.bind(null, n, u);
        l.has(u) || (l.add(u), u.then(c, c));
      });
    }
  }
  function pr(n, r) {
    var l = r.deletions;
    if (l !== null)
      for (var u = 0; u < l.length; u++) {
        var c = l[u];
        try {
          var p = n, S = r, R = S;
          e:
            for (; R !== null; ) {
              switch (R.tag) {
                case 5:
                  Cn = R.stateNode, dr = !1;
                  break e;
                case 3:
                  Cn = R.stateNode.containerInfo, dr = !0;
                  break e;
                case 4:
                  Cn = R.stateNode.containerInfo, dr = !0;
                  break e;
              }
              R = R.return;
            }
          if (Cn === null)
            throw Error(h(160));
          Ou(p, S, c), Cn = null, dr = !1;
          var k = c.alternate;
          k !== null && (k.return = null), c.return = null;
        } catch (Y) {
          Pn(c, r, Y);
        }
      }
    if (r.subtreeFlags & 12854)
      for (r = r.child; r !== null; )
        hh(r, n), r = r.sibling;
  }
  function hh(n, r) {
    var l = n.alternate, u = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (pr(r, n), ki(n), u & 4) {
          try {
            xu(3, n, n.return), ff(3, n);
          } catch (He) {
            Pn(n, n.return, He);
          }
          try {
            xu(5, n, n.return);
          } catch (He) {
            Pn(n, n.return, He);
          }
        }
        break;
      case 1:
        pr(r, n), ki(n), u & 512 && l !== null && Tu(l, l.return);
        break;
      case 5:
        if (pr(r, n), ki(n), u & 512 && l !== null && Tu(l, l.return), n.flags & 32) {
          var c = n.stateNode;
          try {
            yr(c, "");
          } catch (He) {
            Pn(n, n.return, He);
          }
        }
        if (u & 4 && (c = n.stateNode, c != null)) {
          var p = n.memoizedProps, S = l !== null ? l.memoizedProps : p, R = n.type, k = n.updateQueue;
          if (n.updateQueue = null, k !== null)
            try {
              R === "input" && p.type === "radio" && p.name != null && Mn(c, p), Et(R, S);
              var Y = Et(R, p);
              for (S = 0; S < k.length; S += 2) {
                var ie = k[S], le = k[S + 1];
                ie === "style" ? q(c, le) : ie === "dangerouslySetInnerHTML" ? jr(c, le) : ie === "children" ? yr(c, le) : Xe(c, ie, le, Y);
              }
              switch (R) {
                case "input":
                  _n(c, p);
                  break;
                case "textarea":
                  cr(c, p);
                  break;
                case "select":
                  var te = c._wrapperState.wasMultiple;
                  c._wrapperState.wasMultiple = !!p.multiple;
                  var Re = p.value;
                  Re != null ? wn(c, !!p.multiple, Re, !1) : te !== !!p.multiple && (p.defaultValue != null ? wn(
                    c,
                    !!p.multiple,
                    p.defaultValue,
                    !0
                  ) : wn(c, !!p.multiple, p.multiple ? [] : "", !1));
              }
              c[ks] = p;
            } catch (He) {
              Pn(n, n.return, He);
            }
        }
        break;
      case 6:
        if (pr(r, n), ki(n), u & 4) {
          if (n.stateNode === null)
            throw Error(h(162));
          c = n.stateNode, p = n.memoizedProps;
          try {
            c.nodeValue = p;
          } catch (He) {
            Pn(n, n.return, He);
          }
        }
        break;
      case 3:
        if (pr(r, n), ki(n), u & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            za(r.containerInfo);
          } catch (He) {
            Pn(n, n.return, He);
          }
        break;
      case 4:
        pr(r, n), ki(n);
        break;
      case 13:
        pr(r, n), ki(n), c = n.child, c.flags & 8192 && (p = c.memoizedState !== null, c.stateNode.isHidden = p, !p || c.alternate !== null && c.alternate.memoizedState !== null || (vf = cn())), u & 4 && ku(n);
        break;
      case 22:
        if (ie = l !== null && l.memoizedState !== null, n.mode & 1 ? (Er = (Y = Er) || ie, pr(r, n), Er = Y) : pr(r, n), ki(n), u & 8192) {
          if (Y = n.memoizedState !== null, (n.stateNode.isHidden = Y) && !ie && n.mode & 1)
            for (Me = n, ie = n.child; ie !== null; ) {
              for (le = Me = ie; Me !== null; ) {
                switch (te = Me, Re = te.child, te.tag) {
                  case 0:
                  case 11:
                  case 14:
                  case 15:
                    xu(4, te, te.return);
                    break;
                  case 1:
                    Tu(te, te.return);
                    var Ae = te.stateNode;
                    if (typeof Ae.componentWillUnmount == "function") {
                      u = te, l = te.return;
                      try {
                        r = u, Ae.props = r.memoizedProps, Ae.state = r.memoizedState, Ae.componentWillUnmount();
                      } catch (He) {
                        Pn(u, l, He);
                      }
                    }
                    break;
                  case 5:
                    Tu(te, te.return);
                    break;
                  case 22:
                    if (te.memoizedState !== null) {
                      mh(le);
                      continue;
                    }
                }
                Re !== null ? (Re.return = te, Me = Re) : mh(le);
              }
              ie = ie.sibling;
            }
          e:
            for (ie = null, le = n; ; ) {
              if (le.tag === 5) {
                if (ie === null) {
                  ie = le;
                  try {
                    c = le.stateNode, Y ? (p = c.style, typeof p.setProperty == "function" ? p.setProperty("display", "none", "important") : p.display = "none") : (R = le.stateNode, k = le.memoizedProps.style, S = k != null && k.hasOwnProperty("display") ? k.display : null, R.style.display = U("display", S));
                  } catch (He) {
                    Pn(n, n.return, He);
                  }
                }
              } else if (le.tag === 6) {
                if (ie === null)
                  try {
                    le.stateNode.nodeValue = Y ? "" : le.memoizedProps;
                  } catch (He) {
                    Pn(n, n.return, He);
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
                ie === le && (ie = null), le = le.return;
              }
              ie === le && (ie = null), le.sibling.return = le.return, le = le.sibling;
            }
        }
        break;
      case 19:
        pr(r, n), ki(n), u & 4 && ku(n);
        break;
      case 21:
        break;
      default:
        pr(
          r,
          n
        ), ki(n);
    }
  }
  function ki(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var l = n.return; l !== null; ) {
            if (Qd(l)) {
              var u = l;
              break e;
            }
            l = l.return;
          }
          throw Error(h(160));
        }
        switch (u.tag) {
          case 5:
            var c = u.stateNode;
            u.flags & 32 && (yr(c, ""), u.flags &= -33);
            var p = vh(n);
            Du(n, p, c);
            break;
          case 3:
          case 4:
            var S = u.stateNode.containerInfo, R = vh(n);
            Gs(n, R, S);
            break;
          default:
            throw Error(h(161));
        }
      } catch (k) {
        Pn(n, n.return, k);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function Wy(n, r, l) {
    Me = n, qd(n);
  }
  function qd(n, r, l) {
    for (var u = (n.mode & 1) !== 0; Me !== null; ) {
      var c = Me, p = c.child;
      if (c.tag === 22 && u) {
        var S = c.memoizedState !== null || Ru;
        if (!S) {
          var R = c.alternate, k = R !== null && R.memoizedState !== null || Er;
          R = Ru;
          var Y = Er;
          if (Ru = S, (Er = k) && !Y)
            for (Me = c; Me !== null; )
              S = Me, k = S.child, S.tag === 22 && S.memoizedState !== null ? Xd(c) : k !== null ? (k.return = S, Me = k) : Xd(c);
          for (; p !== null; )
            Me = p, qd(p), p = p.sibling;
          Me = c, Ru = R, Er = Y;
        }
        Mu(n);
      } else
        c.subtreeFlags & 8772 && p !== null ? (p.return = c, Me = p) : Mu(n);
    }
  }
  function Mu(n) {
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
                Er || ff(5, r);
                break;
              case 1:
                var u = r.stateNode;
                if (r.flags & 4 && !Er)
                  if (l === null)
                    u.componentDidMount();
                  else {
                    var c = r.elementType === r.type ? l.memoizedProps : ua(r.type, l.memoizedProps);
                    u.componentDidUpdate(c, l.memoizedState, u.__reactInternalSnapshotBeforeUpdate);
                  }
                var p = r.updateQueue;
                p !== null && vu(r, p, u);
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
                  vu(r, S, l);
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
                  var Y = r.alternate;
                  if (Y !== null) {
                    var ie = Y.memoizedState;
                    if (ie !== null) {
                      var le = ie.dehydrated;
                      le !== null && za(le);
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
          Er || r.flags & 512 && df(r);
        } catch (te) {
          Pn(r, r.return, te);
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
  function mh(n) {
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
  function Xd(n) {
    for (; Me !== null; ) {
      var r = Me;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              ff(4, r);
            } catch (k) {
              Pn(r, l, k);
            }
            break;
          case 1:
            var u = r.stateNode;
            if (typeof u.componentDidMount == "function") {
              var c = r.return;
              try {
                u.componentDidMount();
              } catch (k) {
                Pn(r, c, k);
              }
            }
            var p = r.return;
            try {
              df(r);
            } catch (k) {
              Pn(r, p, k);
            }
            break;
          case 5:
            var S = r.return;
            try {
              df(r);
            } catch (k) {
              Pn(r, S, k);
            }
        }
      } catch (k) {
        Pn(r, r.return, k);
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
  var Gy = Math.ceil, Mo = Qe.ReactCurrentDispatcher, pf = Qe.ReactCurrentOwner, Ia = Qe.ReactCurrentBatchConfig, kt = 0, Un = null, mn = null, rr = 0, pa = 0, Nu = ln(0), ar = 0, Qs = null, No = 0, Lu = 0, Kd = 0, Yl = null, Ar = null, vf = 0, Au = 1 / 0, ol = null, hf = !1, Zd = null, Ya = null, zu = !1, Wa = null, mf = 0, qs = 0, yf = null, Xs = -1, Lo = 0;
  function vr() {
    return kt & 6 ? cn() : Xs !== -1 ? Xs : Xs = cn();
  }
  function ul(n) {
    return n.mode & 1 ? kt & 2 && rr !== 0 ? rr & -rr : jy.transition !== null ? (Lo === 0 && (Lo = uo()), Lo) : (n = Lt, n !== 0 || (n = window.event, n = n === void 0 ? 16 : ds(n.type)), n) : 1;
  }
  function On(n, r, l, u) {
    if (50 < qs)
      throw qs = 0, yf = null, Error(h(185));
    Rl(n, l, u), (!(kt & 2) || n !== Un) && (n === Un && (!(kt & 2) && (Lu |= l), ar === 4 && Mi(n, rr)), ir(n, u), l === 1 && kt === 0 && !(r.mode & 1) && (Au = cn() + 500, Al && Ri()));
  }
  function ir(n, r) {
    var l = n.callbackNode;
    wl(n, r);
    var u = Si(n, n === Un ? rr : 0);
    if (u === 0)
      l !== null && sn(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = u & -u, n.callbackPriority !== r) {
      if (l != null && sn(l), r === 1)
        n.tag === 0 ? Gv(Uu.bind(null, n)) : zc(Uu.bind(null, n)), Yv(function() {
          !(kt & 6) && Ri();
        }), l = null;
      else {
        switch (ss(u)) {
          case 1:
            l = ns;
            break;
          case 4:
            l = gi;
            break;
          case 16:
            l = _t;
            break;
          case 536870912:
            l = Ii;
            break;
          default:
            l = _t;
        }
        l = wh(l, gf.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function gf(n, r) {
    if (Xs = -1, Lo = 0, kt & 6)
      throw Error(h(327));
    var l = n.callbackNode;
    if (Pu() && n.callbackNode !== l)
      return null;
    var u = Si(n, n === Un ? rr : 0);
    if (u === 0)
      return null;
    if (u & 30 || u & n.expiredLanes || r)
      r = Cf(n, u);
    else {
      r = u;
      var c = kt;
      kt |= 2;
      var p = gh();
      (Un !== n || rr !== r) && (ol = null, Au = cn() + 500, zo(n, r));
      do
        try {
          qy();
          break;
        } catch (R) {
          yh(n, R);
        }
      while (!0);
      Ad(), Mo.current = p, kt = c, mn !== null ? r = 0 : (Un = null, rr = 0, r = ar);
    }
    if (r !== 0) {
      if (r === 2 && (c = Ci(n), c !== 0 && (u = c, r = Ao(n, c))), r === 1)
        throw l = Qs, zo(n, 0), Mi(n, u), ir(n, cn()), l;
      if (r === 6)
        Mi(n, u);
      else {
        if (c = n.current.alternate, !(u & 30) && !ep(c) && (r = Cf(n, u), r === 2 && (p = Ci(n), p !== 0 && (u = p, r = Ao(n, p))), r === 1))
          throw l = Qs, zo(n, 0), Mi(n, u), ir(n, cn()), l;
        switch (n.finishedWork = c, n.finishedLanes = u, r) {
          case 0:
          case 1:
            throw Error(h(345));
          case 2:
            Wl(n, Ar, ol);
            break;
          case 3:
            if (Mi(n, u), (u & 130023424) === u && (r = vf + 500 - cn(), 10 < r)) {
              if (Si(n, 0) !== 0)
                break;
              if (c = n.suspendedLanes, (c & u) !== u) {
                vr(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = xs(Wl.bind(null, n, Ar, ol), r);
              break;
            }
            Wl(n, Ar, ol);
            break;
          case 4:
            if (Mi(n, u), (u & 4194240) === u)
              break;
            for (r = n.eventTimes, c = -1; 0 < u; ) {
              var S = 31 - Fr(u);
              p = 1 << S, S = r[S], S > c && (c = S), u &= ~p;
            }
            if (u = c, u = cn() - u, u = (120 > u ? 120 : 480 > u ? 480 : 1080 > u ? 1080 : 1920 > u ? 1920 : 3e3 > u ? 3e3 : 4320 > u ? 4320 : 1960 * Gy(u / 1960)) - u, 10 < u) {
              n.timeoutHandle = xs(Wl.bind(null, n, Ar, ol), u);
              break;
            }
            Wl(n, Ar, ol);
            break;
          case 5:
            Wl(n, Ar, ol);
            break;
          default:
            throw Error(h(329));
        }
      }
    }
    return ir(n, cn()), n.callbackNode === l ? gf.bind(null, n) : null;
  }
  function Ao(n, r) {
    var l = Yl;
    return n.current.memoizedState.isDehydrated && (zo(n, r).flags |= 256), n = Cf(n, r), n !== 2 && (r = Ar, Ar = l, r !== null && Jd(r)), n;
  }
  function Jd(n) {
    Ar === null ? Ar = n : Ar.push.apply(Ar, n);
  }
  function ep(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var l = r.updateQueue;
        if (l !== null && (l = l.stores, l !== null))
          for (var u = 0; u < l.length; u++) {
            var c = l[u], p = c.getSnapshot;
            c = c.value;
            try {
              if (!oi(p(), c))
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
  function Mi(n, r) {
    for (r &= ~Kd, r &= ~Lu, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - Fr(r), u = 1 << l;
      n[l] = -1, r &= ~u;
    }
  }
  function Uu(n) {
    if (kt & 6)
      throw Error(h(327));
    Pu();
    var r = Si(n, 0);
    if (!(r & 1))
      return ir(n, cn()), null;
    var l = Cf(n, r);
    if (n.tag !== 0 && l === 2) {
      var u = Ci(n);
      u !== 0 && (r = u, l = Ao(n, u));
    }
    if (l === 1)
      throw l = Qs, zo(n, 0), Mi(n, r), ir(n, cn()), l;
    if (l === 6)
      throw Error(h(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, Wl(n, Ar, ol), ir(n, cn()), null;
  }
  function tp(n, r) {
    var l = kt;
    kt |= 1;
    try {
      return n(r);
    } finally {
      kt = l, kt === 0 && (Au = cn() + 500, Al && Ri());
    }
  }
  function Ni(n) {
    Wa !== null && Wa.tag === 0 && !(kt & 6) && Pu();
    var r = kt;
    kt |= 1;
    var l = Ia.transition, u = Lt;
    try {
      if (Ia.transition = null, Lt = 1, n)
        return n();
    } finally {
      Lt = u, Ia.transition = l, kt = r, !(kt & 6) && Ri();
    }
  }
  function Sf() {
    pa = Nu.current, $e(Nu);
  }
  function zo(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, Ds(l)), mn !== null)
      for (l = mn.return; l !== null; ) {
        var u = l;
        switch (Pc(u), u.tag) {
          case 1:
            u = u.type.childContextTypes, u != null && aa();
            break;
          case 3:
            gu(), $e(dt), $e(fr), Ba();
            break;
          case 5:
            Je(u);
            break;
          case 4:
            gu();
            break;
          case 13:
            $e(Ye);
            break;
          case 19:
            $e(Ye);
            break;
          case 10:
            zd(u.type._context);
            break;
          case 22:
          case 23:
            Sf();
        }
        l = l.return;
      }
    if (Un = n, mn = n = Gl(n.current, null), rr = pa = r, ar = 0, Qs = null, Kd = Lu = No = 0, Ar = Yl = null, Nr !== null) {
      for (r = 0; r < Nr.length; r++)
        if (l = Nr[r], u = l.interleaved, u !== null) {
          l.interleaved = null;
          var c = u.next, p = l.pending;
          if (p !== null) {
            var S = p.next;
            p.next = c, u.next = S;
          }
          l.pending = u;
        }
      Nr = null;
    }
    return n;
  }
  function yh(n, r) {
    do {
      var l = mn;
      try {
        if (Ad(), Us.current = nf, $n) {
          for (var u = Dn.memoizedState; u !== null; ) {
            var c = u.queue;
            c !== null && (c.pending = null), u = u.next;
          }
          $n = !1;
        }
        if (_o = 0, X = Vn = Dn = null, rt = !1, Di = 0, pf.current = null, l === null || l.return === null) {
          ar = 1, Qs = r, mn = null;
          break;
        }
        e: {
          var p = n, S = l.return, R = l, k = r;
          if (r = rr, R.flags |= 32768, k !== null && typeof k == "object" && typeof k.then == "function") {
            var Y = k, ie = R, le = ie.tag;
            if (!(ie.mode & 1) && (le === 0 || le === 11 || le === 15)) {
              var te = ie.alternate;
              te ? (ie.updateQueue = te.updateQueue, ie.memoizedState = te.memoizedState, ie.lanes = te.lanes) : (ie.updateQueue = null, ie.memoizedState = null);
            }
            var Re = uh(S);
            if (Re !== null) {
              Re.flags &= -257, Id(Re, S, R, p, r), Re.mode & 1 && $s(p, Y, r), r = Re, k = Y;
              var Ae = r.updateQueue;
              if (Ae === null) {
                var He = /* @__PURE__ */ new Set();
                He.add(k), r.updateQueue = He;
              } else
                Ae.add(k);
              break e;
            } else {
              if (!(r & 1)) {
                $s(p, Y, r), Ks();
                break e;
              }
              k = Error(h(426));
            }
          } else if (hn && R.mode & 1) {
            var Wn = uh(S);
            if (Wn !== null) {
              !(Wn.flags & 65536) && (Wn.flags |= 256), Id(Wn, S, R, p, r), Jn($l(k, R));
              break e;
            }
          }
          p = k = $l(k, R), ar !== 4 && (ar = 2), Yl === null ? Yl = [p] : Yl.push(p), p = S;
          do {
            switch (p.tag) {
              case 3:
                p.flags |= 65536, r &= -r, p.lanes |= r;
                var j = lh(p, k, r);
                Kv(p, j);
                break e;
              case 1:
                R = k;
                var N = p.type, B = p.stateNode;
                if (!(p.flags & 128) && (typeof N.getDerivedStateFromError == "function" || B !== null && typeof B.componentDidCatch == "function" && (Ya === null || !Ya.has(B)))) {
                  p.flags |= 65536, r &= -r, p.lanes |= r;
                  var pe = oh(p, R, r);
                  Kv(p, pe);
                  break e;
                }
            }
            p = p.return;
          } while (p !== null);
        }
        Ch(l);
      } catch (Ie) {
        r = Ie, mn === l && l !== null && (mn = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function gh() {
    var n = Mo.current;
    return Mo.current = nf, n === null ? nf : n;
  }
  function Ks() {
    (ar === 0 || ar === 3 || ar === 2) && (ar = 4), Un === null || !(No & 268435455) && !(Lu & 268435455) || Mi(Un, rr);
  }
  function Cf(n, r) {
    var l = kt;
    kt |= 2;
    var u = gh();
    (Un !== n || rr !== r) && (ol = null, zo(n, r));
    do
      try {
        Qy();
        break;
      } catch (c) {
        yh(n, c);
      }
    while (!0);
    if (Ad(), kt = l, Mo.current = u, mn !== null)
      throw Error(h(261));
    return Un = null, rr = 0, ar;
  }
  function Qy() {
    for (; mn !== null; )
      Sh(mn);
  }
  function qy() {
    for (; mn !== null && !kr(); )
      Sh(mn);
  }
  function Sh(n) {
    var r = bh(n.alternate, n, pa);
    n.memoizedProps = n.pendingProps, r === null ? Ch(n) : mn = r, pf.current = null;
  }
  function Ch(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (l = Iy(l, r), l !== null) {
          l.flags &= 32767, mn = l;
          return;
        }
        if (n !== null)
          n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          ar = 6, mn = null;
          return;
        }
      } else if (l = $y(l, r, pa), l !== null) {
        mn = l;
        return;
      }
      if (r = r.sibling, r !== null) {
        mn = r;
        return;
      }
      mn = r = n;
    } while (r !== null);
    ar === 0 && (ar = 5);
  }
  function Wl(n, r, l) {
    var u = Lt, c = Ia.transition;
    try {
      Ia.transition = null, Lt = 1, Xy(n, r, l, u);
    } finally {
      Ia.transition = c, Lt = u;
    }
    return null;
  }
  function Xy(n, r, l, u) {
    do
      Pu();
    while (Wa !== null);
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
    if (os(n, p), n === Un && (mn = Un = null, rr = 0), !(l.subtreeFlags & 2064) && !(l.flags & 2064) || zu || (zu = !0, wh(_t, function() {
      return Pu(), null;
    })), p = (l.flags & 15990) !== 0, l.subtreeFlags & 15990 || p) {
      p = Ia.transition, Ia.transition = null;
      var S = Lt;
      Lt = 1;
      var R = kt;
      kt |= 4, pf.current = null, Yy(n, l), hh(l, n), vo(Rd), tu = !!wd, Rd = wd = null, n.current = l, Wy(l), yi(), kt = R, Lt = S, Ia.transition = p;
    } else
      n.current = l;
    if (zu && (zu = !1, Wa = n, mf = c), p = n.pendingLanes, p === 0 && (Ya = null), rs(l.stateNode), ir(n, cn()), r !== null)
      for (u = n.onRecoverableError, l = 0; l < r.length; l++)
        c = r[l], u(c.value, { componentStack: c.stack, digest: c.digest });
    if (hf)
      throw hf = !1, n = Zd, Zd = null, n;
    return mf & 1 && n.tag !== 0 && Pu(), p = n.pendingLanes, p & 1 ? n === yf ? qs++ : (qs = 0, yf = n) : qs = 0, Ri(), null;
  }
  function Pu() {
    if (Wa !== null) {
      var n = ss(mf), r = Ia.transition, l = Lt;
      try {
        if (Ia.transition = null, Lt = 16 > n ? 16 : n, Wa === null)
          var u = !1;
        else {
          if (n = Wa, Wa = null, mf = 0, kt & 6)
            throw Error(h(331));
          var c = kt;
          for (kt |= 4, Me = n.current; Me !== null; ) {
            var p = Me, S = p.child;
            if (Me.flags & 16) {
              var R = p.deletions;
              if (R !== null) {
                for (var k = 0; k < R.length; k++) {
                  var Y = R[k];
                  for (Me = Y; Me !== null; ) {
                    var ie = Me;
                    switch (ie.tag) {
                      case 0:
                      case 11:
                      case 15:
                        xu(8, ie, p);
                    }
                    var le = ie.child;
                    if (le !== null)
                      le.return = ie, Me = le;
                    else
                      for (; Me !== null; ) {
                        ie = Me;
                        var te = ie.sibling, Re = ie.return;
                        if (ph(ie), ie === Y) {
                          Me = null;
                          break;
                        }
                        if (te !== null) {
                          te.return = Re, Me = te;
                          break;
                        }
                        Me = Re;
                      }
                  }
                }
                var Ae = p.alternate;
                if (Ae !== null) {
                  var He = Ae.child;
                  if (He !== null) {
                    Ae.child = null;
                    do {
                      var Wn = He.sibling;
                      He.sibling = null, He = Wn;
                    } while (He !== null);
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
                        xu(9, p, p.return);
                    }
                  var j = p.sibling;
                  if (j !== null) {
                    j.return = p.return, Me = j;
                    break e;
                  }
                  Me = p.return;
                }
          }
          var N = n.current;
          for (Me = N; Me !== null; ) {
            S = Me;
            var B = S.child;
            if (S.subtreeFlags & 2064 && B !== null)
              B.return = S, Me = B;
            else
              e:
                for (S = N; Me !== null; ) {
                  if (R = Me, R.flags & 2048)
                    try {
                      switch (R.tag) {
                        case 0:
                        case 11:
                        case 15:
                          ff(9, R);
                      }
                    } catch (Ie) {
                      Pn(R, R.return, Ie);
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
          if (kt = c, Ri(), ea && typeof ea.onPostCommitFiberRoot == "function")
            try {
              ea.onPostCommitFiberRoot(bl, n);
            } catch {
            }
          u = !0;
        }
        return u;
      } finally {
        Lt = l, Ia.transition = r;
      }
    }
    return !1;
  }
  function Eh(n, r, l) {
    r = $l(l, r), r = lh(n, r, 1), n = Fl(n, r, 1), r = vr(), n !== null && (Rl(n, 1, r), ir(n, r));
  }
  function Pn(n, r, l) {
    if (n.tag === 3)
      Eh(n, n, l);
    else
      for (; r !== null; ) {
        if (r.tag === 3) {
          Eh(r, n, l);
          break;
        } else if (r.tag === 1) {
          var u = r.stateNode;
          if (typeof r.type.getDerivedStateFromError == "function" || typeof u.componentDidCatch == "function" && (Ya === null || !Ya.has(u))) {
            n = $l(l, n), n = oh(r, n, 1), r = Fl(r, n, 1), n = vr(), r !== null && (Rl(r, 1, n), ir(r, n));
            break;
          }
        }
        r = r.return;
      }
  }
  function Ky(n, r, l) {
    var u = n.pingCache;
    u !== null && u.delete(r), r = vr(), n.pingedLanes |= n.suspendedLanes & l, Un === n && (rr & l) === l && (ar === 4 || ar === 3 && (rr & 130023424) === rr && 500 > cn() - vf ? zo(n, 0) : Kd |= l), ir(n, r);
  }
  function _h(n, r) {
    r === 0 && (n.mode & 1 ? (r = Ko, Ko <<= 1, !(Ko & 130023424) && (Ko = 4194304)) : r = 1);
    var l = vr();
    n = al(n, r), n !== null && (Rl(n, r, l), ir(n, l));
  }
  function np(n) {
    var r = n.memoizedState, l = 0;
    r !== null && (l = r.retryLane), _h(n, l);
  }
  function Zy(n, r) {
    var l = 0;
    switch (n.tag) {
      case 13:
        var u = n.stateNode, c = n.memoizedState;
        c !== null && (l = c.retryLane);
        break;
      case 19:
        u = n.stateNode;
        break;
      default:
        throw Error(h(314));
    }
    u !== null && u.delete(r), _h(n, l);
  }
  var bh;
  bh = function(n, r, l) {
    if (n !== null)
      if (n.memoizedProps !== r.pendingProps || dt.current)
        fa = !0;
      else {
        if (!(n.lanes & l) && !(r.flags & 128))
          return fa = !1, ll(n, r, l);
        fa = !!(n.flags & 131072);
      }
    else
      fa = !1, hn && r.flags & 1048576 && Ul(r, So, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var u = r.type;
        Ws(n, r), n = r.pendingProps;
        var c = _a(r, fr.current);
        Bn(r, l), c = bo(null, r, u, n, c, l);
        var p = Bl();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, Zn(u) ? (p = !0, go(r)) : p = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, Ud(r), c.updater = Bc, r.stateNode = c, c._reactInternals = r, jd(r, u, n, l), r = af(null, r, u, !0, p, l)) : (r.tag = 0, hn && p && Uc(r), In(null, r, c, l), r = r.child), r;
      case 16:
        u = r.elementType;
        e: {
          switch (Ws(n, r), n = r.pendingProps, c = u._init, u = c(u._payload), r.type = u, c = r.tag = Jy(u), n = ua(u, n), c) {
            case 0:
              r = mt(null, r, u, n, l);
              break e;
            case 1:
              r = Is(null, r, u, n, l);
              break e;
            case 11:
              r = _u(null, r, u, n, l);
              break e;
            case 14:
              r = Il(null, r, u, ua(u.type, n), l);
              break e;
          }
          throw Error(h(
            306,
            u,
            ""
          ));
        }
        return r;
      case 0:
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : ua(u, c), mt(n, r, u, c, l);
      case 1:
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : ua(u, c), Is(n, r, u, c, l);
      case 3:
        e: {
          if (Vy(r), n === null)
            throw Error(h(387));
          u = r.pendingProps, p = r.memoizedState, c = p.element, Xv(n, r), Ns(r, u, null, l);
          var S = r.memoizedState;
          if (u = S.element, p.isDehydrated)
            if (p = { element: u, isDehydrated: !1, cache: S.cache, pendingSuspenseBoundaries: S.pendingSuspenseBoundaries, transitions: S.transitions }, r.updateQueue.baseState = p, r.memoizedState = p, r.flags & 256) {
              c = $l(Error(h(423)), r), r = ch(n, r, u, l, c);
              break e;
            } else if (u !== c) {
              c = $l(Error(h(424)), r), r = ch(n, r, u, l, c);
              break e;
            } else
              for (wa = Ea(r.stateNode.containerInfo.firstChild), ba = r, hn = !0, Ha = null, l = rh(r, null, u, l), r.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (fu(), u === c) {
              r = Yn(n, r, l);
              break e;
            }
            In(n, r, u, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Vc(r), n === null && jc(r), u = r.type, c = r.pendingProps, p = n !== null ? n.memoizedProps : null, S = c.children, yo(u, c) ? S = null : p !== null && yo(u, p) && (r.flags |= 32), Oo(n, r), In(n, r, S, l), r.child;
      case 6:
        return n === null && jc(r), null;
      case 13:
        return fh(n, r, l);
      case 4:
        return Fd(r, r.stateNode.containerInfo), u = r.pendingProps, n === null ? r.child = mu(r, null, u, l) : In(n, r, u, l), r.child;
      case 11:
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : ua(u, c), _u(n, r, u, c, l);
      case 7:
        return In(n, r, r.pendingProps, l), r.child;
      case 8:
        return In(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return In(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (u = r.type._context, c = r.pendingProps, p = r.memoizedProps, S = c.value, Vt(du, u._currentValue), u._currentValue = S, p !== null)
            if (oi(p.value, S)) {
              if (p.children === c.children && !dt.current) {
                r = Yn(n, r, l);
                break e;
              }
            } else
              for (p = r.child, p !== null && (p.return = r); p !== null; ) {
                var R = p.dependencies;
                if (R !== null) {
                  S = p.child;
                  for (var k = R.firstContext; k !== null; ) {
                    if (k.context === u) {
                      if (p.tag === 1) {
                        k = fn(-1, l & -l), k.tag = 2;
                        var Y = p.updateQueue;
                        if (Y !== null) {
                          Y = Y.shared;
                          var ie = Y.pending;
                          ie === null ? k.next = k : (k.next = ie.next, ie.next = k), Y.pending = k;
                        }
                      }
                      p.lanes |= l, k = p.alternate, k !== null && (k.lanes |= l), Pl(
                        p.return,
                        l,
                        r
                      ), R.lanes |= l;
                      break;
                    }
                    k = k.next;
                  }
                } else if (p.tag === 10)
                  S = p.type === r.type ? null : p.child;
                else if (p.tag === 18) {
                  if (S = p.return, S === null)
                    throw Error(h(341));
                  S.lanes |= l, R = S.alternate, R !== null && (R.lanes |= l), Pl(S, l, r), S = p.sibling;
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
          In(n, r, c.children, l), r = r.child;
        }
        return r;
      case 9:
        return c = r.type, u = r.pendingProps.children, Bn(r, l), c = me(c), u = u(c), r.flags |= 1, In(n, r, u, l), r.child;
      case 14:
        return u = r.type, c = ua(u, r.pendingProps), c = ua(u.type, c), Il(n, r, u, c, l);
      case 15:
        return rf(n, r, r.type, r.pendingProps, l);
      case 17:
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : ua(u, c), Ws(n, r), r.tag = 1, Zn(u) ? (n = !0, go(r)) : n = !1, Bn(r, l), Jv(r, u, c), jd(r, u, c, l), af(null, r, u, !0, n, l);
      case 19:
        return Wd(n, r, l);
      case 22:
        return da(n, r, l);
    }
    throw Error(h(156, r.tag));
  };
  function wh(n, r) {
    return un(n, r);
  }
  function Rh(n, r, l, u) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = u, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ga(n, r, l, u) {
    return new Rh(n, r, l, u);
  }
  function rp(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function Jy(n) {
    if (typeof n == "function")
      return rp(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === xt)
        return 11;
      if (n === ft)
        return 14;
    }
    return 2;
  }
  function Gl(n, r) {
    var l = n.alternate;
    return l === null ? (l = Ga(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Ef(n, r, l, u, c, p) {
    var S = 2;
    if (u = n, typeof n == "function")
      rp(n) && (S = 1);
    else if (typeof n == "string")
      S = 5;
    else
      e:
        switch (n) {
          case wt:
            return Uo(l.children, c, p, r);
          case ot:
            S = 8, c |= 8;
            break;
          case En:
            return n = Ga(12, l, r, c | 2), n.elementType = En, n.lanes = p, n;
          case nn:
            return n = Ga(13, l, r, c), n.elementType = nn, n.lanes = p, n;
          case nt:
            return n = Ga(19, l, r, c), n.elementType = nt, n.lanes = p, n;
          case vt:
            return _f(l, c, p, r);
          default:
            if (typeof n == "object" && n !== null)
              switch (n.$$typeof) {
                case gn:
                  S = 10;
                  break e;
                case Zt:
                  S = 9;
                  break e;
                case xt:
                  S = 11;
                  break e;
                case ft:
                  S = 14;
                  break e;
                case Dt:
                  S = 16, u = null;
                  break e;
              }
            throw Error(h(130, n == null ? n : typeof n, ""));
        }
    return r = Ga(S, l, r, c), r.elementType = n, r.type = u, r.lanes = p, r;
  }
  function Uo(n, r, l, u) {
    return n = Ga(7, n, u, r), n.lanes = l, n;
  }
  function _f(n, r, l, u) {
    return n = Ga(22, n, u, r), n.elementType = vt, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function bf(n, r, l) {
    return n = Ga(6, n, null, r), n.lanes = l, n;
  }
  function Zs(n, r, l) {
    return r = Ga(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function Js(n, r, l, u, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = so(0), this.expirationTimes = so(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = so(0), this.identifierPrefix = u, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function ap(n, r, l, u, c, p, S, R, k) {
    return n = new Js(n, r, l, R, k), r === 1 ? (r = 1, p === !0 && (r |= 8)) : r = 0, p = Ga(3, null, null, r), n.current = p, p.stateNode = n, p.memoizedState = { element: u, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Ud(p), n;
  }
  function Th(n, r, l) {
    var u = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Le, key: u == null ? null : "" + u, children: n, containerInfo: r, implementation: l };
  }
  function ip(n) {
    if (!n)
      return Pa;
    n = n._reactInternals;
    e: {
      if (Ee(n) !== n || n.tag !== 1)
        throw Error(h(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (Zn(r.type)) {
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
      if (Zn(l))
        return Ll(n, l, r);
    }
    return r;
  }
  function lp(n, r, l, u, c, p, S, R, k) {
    return n = ap(l, u, !0, n, c, p, S, R, k), n.context = ip(null), l = n.current, u = vr(), c = ul(l), p = fn(u, c), p.callback = r ?? null, Fl(l, p, c), n.current.lanes = c, Rl(n, c, u), ir(n, u), n;
  }
  function wf(n, r, l, u) {
    var c = r.current, p = vr(), S = ul(c);
    return l = ip(l), r.context === null ? r.context = l : r.pendingContext = l, r = fn(p, S), r.payload = { element: n }, u = u === void 0 ? null : u, u !== null && (r.callback = u), n = Fl(c, r, S), n !== null && (On(n, c, S, p), Hc(n, c, S)), S;
  }
  function ec(n) {
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
  function op(n, r) {
    xh(n, r), (n = n.alternate) && xh(n, r);
  }
  function eg() {
    return null;
  }
  var up = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function Rf(n) {
    this._internalRoot = n;
  }
  tc.prototype.render = Rf.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null)
      throw Error(h(409));
    wf(n, r, null, null);
  }, tc.prototype.unmount = Rf.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Ni(function() {
        wf(null, n, null, null);
      }), r[ui] = null;
    }
  };
  function tc(n) {
    this._internalRoot = n;
  }
  tc.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = Ft();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < pn.length && r !== 0 && r < pn[l].priority; l++)
        ;
      pn.splice(l, 0, n), l === 0 && ii(n);
    }
  };
  function Ql(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function Tf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function Dh() {
  }
  function tg(n, r, l, u, c) {
    if (c) {
      if (typeof u == "function") {
        var p = u;
        u = function() {
          var Y = ec(S);
          p.call(Y);
        };
      }
      var S = lp(r, u, n, 0, null, !1, !1, "", Dh);
      return n._reactRootContainer = S, n[ui] = S.current, _i(n.nodeType === 8 ? n.parentNode : n), Ni(), S;
    }
    for (; c = n.lastChild; )
      n.removeChild(c);
    if (typeof u == "function") {
      var R = u;
      u = function() {
        var Y = ec(k);
        R.call(Y);
      };
    }
    var k = ap(n, 0, !1, null, null, !1, !1, "", Dh);
    return n._reactRootContainer = k, n[ui] = k.current, _i(n.nodeType === 8 ? n.parentNode : n), Ni(function() {
      wf(r, k, l, u);
    }), k;
  }
  function xf(n, r, l, u, c) {
    var p = l._reactRootContainer;
    if (p) {
      var S = p;
      if (typeof c == "function") {
        var R = c;
        c = function() {
          var k = ec(S);
          R.call(k);
        };
      }
      wf(r, S, n, c);
    } else
      S = tg(l, r, n, c, u);
    return ec(S);
  }
  Zo = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = Yi(r.pendingLanes);
          l !== 0 && (us(r, l | 1), ir(r, cn()), !(kt & 6) && (Au = cn() + 500, Ri()));
        }
        break;
      case 13:
        Ni(function() {
          var u = al(n, 1);
          if (u !== null) {
            var c = vr();
            On(u, n, 1, c);
          }
        }), op(n, 1);
    }
  }, Tl = function(n) {
    if (n.tag === 13) {
      var r = al(n, 134217728);
      if (r !== null) {
        var l = vr();
        On(r, n, 134217728, l);
      }
      op(n, 134217728);
    }
  }, cs = function(n) {
    if (n.tag === 13) {
      var r = ul(n), l = al(n, r);
      if (l !== null) {
        var u = vr();
        On(l, n, r, u);
      }
      op(n, r);
    }
  }, Ft = function() {
    return Lt;
  }, Jo = function(n, r) {
    var l = Lt;
    try {
      return Lt = n, r();
    } finally {
      Lt = l;
    }
  }, ue = function(n, r, l) {
    switch (r) {
      case "input":
        if (_n(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; )
            l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var u = l[r];
            if (u !== n && u.form === n.form) {
              var c = Ac(u);
              if (!c)
                throw Error(h(90));
              Fn(u), _n(u, c);
            }
          }
        }
        break;
      case "textarea":
        cr(n, l);
        break;
      case "select":
        r = l.value, r != null && wn(n, !!l.multiple, r, !1);
    }
  }, Xn = tp, hi = Ni;
  var ng = { usingClientEntryPoint: !1, Events: [bi, cu, Ac, Ot, jt, tp] }, nc = { findFiberByHostInstance: nl, bundleType: 0, version: "18.2.0", rendererPackageName: "react-dom" }, Oh = { bundleType: nc.bundleType, version: nc.version, rendererPackageName: nc.rendererPackageName, rendererConfig: nc.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Qe.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = qe(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: nc.findFiberByHostInstance || eg, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.2.0-next-9e3b772b8-20220608" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Df = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Df.isDisabled && Df.supportsFiber)
      try {
        bl = Df.inject(Oh), ea = Df;
      } catch {
      }
  }
  return Ja.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ng, Ja.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Ql(r))
      throw Error(h(200));
    return Th(n, r, null, l);
  }, Ja.createRoot = function(n, r) {
    if (!Ql(n))
      throw Error(h(299));
    var l = !1, u = "", c = up;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (u = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = ap(n, 1, !1, null, null, l, !1, u, c), n[ui] = r.current, _i(n.nodeType === 8 ? n.parentNode : n), new Rf(r);
  }, Ja.findDOMNode = function(n) {
    if (n == null)
      return null;
    if (n.nodeType === 1)
      return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(h(188)) : (n = Object.keys(n).join(","), Error(h(268, n)));
    return n = qe(r), n = n === null ? null : n.stateNode, n;
  }, Ja.flushSync = function(n) {
    return Ni(n);
  }, Ja.hydrate = function(n, r, l) {
    if (!Tf(r))
      throw Error(h(200));
    return xf(null, n, r, !0, l);
  }, Ja.hydrateRoot = function(n, r, l) {
    if (!Ql(n))
      throw Error(h(405));
    var u = l != null && l.hydratedSources || null, c = !1, p = "", S = up;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (p = l.identifierPrefix), l.onRecoverableError !== void 0 && (S = l.onRecoverableError)), r = lp(r, null, n, 1, l ?? null, c, !1, p, S), n[ui] = r.current, _i(n), u)
      for (n = 0; n < u.length; n++)
        l = u[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
          l,
          c
        );
    return new tc(r);
  }, Ja.render = function(n, r, l) {
    if (!Tf(r))
      throw Error(h(200));
    return xf(null, n, r, !1, l);
  }, Ja.unmountComponentAtNode = function(n) {
    if (!Tf(n))
      throw Error(h(40));
    return n._reactRootContainer ? (Ni(function() {
      xf(null, null, n, !1, function() {
        n._reactRootContainer = null, n[ui] = null;
      });
    }), !0) : !1;
  }, Ja.unstable_batchedUpdates = tp, Ja.unstable_renderSubtreeIntoContainer = function(n, r, l, u) {
    if (!Tf(l))
      throw Error(h(200));
    if (n == null || n._reactInternals === void 0)
      throw Error(h(38));
    return xf(n, r, l, !1, u);
  }, Ja.version = "18.2.0-next-9e3b772b8-20220608", Ja;
}
var ei = {}, d1;
function sk() {
  if (d1)
    return ei;
  d1 = 1;
  var g = {};
  /**
   * @license React
   * react-dom.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  return g.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var d = pv(), h = g1(), C = d.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, w = !1;
    function A(e) {
      w = e;
    }
    function P(e) {
      if (!w) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        Ce("warn", e, a);
      }
    }
    function _(e) {
      if (!w) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        Ce("error", e, a);
      }
    }
    function Ce(e, t, a) {
      {
        var i = C.ReactDebugCurrentFrame, o = i.getStackAddendum();
        o !== "" && (t += "%s", a = a.concat([o]));
        var s = a.map(function(f) {
          return String(f);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var ve = 0, ne = 1, _e = 2, re = 3, Ne = 4, ce = 5, be = 6, ct = 7, Kt = 8, Ct = 9, Xe = 10, Qe = 11, Nt = 12, Le = 13, wt = 14, ot = 15, En = 16, gn = 17, Zt = 18, xt = 19, nn = 21, nt = 22, ft = 23, Dt = 24, vt = 25, K = !0, ke = !1, O = !1, J = !1, ee = !1, Ge = !0, tt = !1, Ve = !1, gt = !0, Rt = !0, yt = !0, rn = /* @__PURE__ */ new Set(), Jt = {}, qn = {};
    function Fn(e, t) {
      tr(e, t), tr(e + "Capture", t);
    }
    function tr(e, t) {
      Jt[e] && _("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), Jt[e] = t;
      {
        var a = e.toLowerCase();
        qn[a] = e, e === "onDoubleClick" && (qn.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        rn.add(t[i]);
    }
    var Sn = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", Hn = Object.prototype.hasOwnProperty;
    function Mn(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function _n(e) {
      try {
        return bn(e), !1;
      } catch {
        return !0;
      }
    }
    function bn(e) {
      return "" + e;
    }
    function sr(e, t) {
      if (_n(e))
        return _("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Mn(e)), bn(e);
    }
    function nr(e) {
      if (_n(e))
        return _("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Mn(e)), bn(e);
    }
    function wn(e, t) {
      if (_n(e))
        return _("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Mn(e)), bn(e);
    }
    function zr(e, t) {
      if (_n(e))
        return _("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Mn(e)), bn(e);
    }
    function Ur(e) {
      if (_n(e))
        return _("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", Mn(e)), bn(e);
    }
    function cr(e) {
      if (_n(e))
        return _("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", Mn(e)), bn(e);
    }
    var Pr = 0, Rn = 1, mr = 2, on = 3, jr = 4, yr = 5, z = 6, D = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", U = D + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", q = new RegExp("^[" + D + "][" + U + "]*$"), he = {}, Ke = {};
    function Et(e) {
      return Hn.call(Ke, e) ? !0 : Hn.call(he, e) ? !1 : q.test(e) ? (Ke[e] = !0, !0) : (he[e] = !0, _("Invalid attribute name: `%s`", e), !1);
    }
    function Be(e, t, a) {
      return t !== null ? t.type === Pr : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function fe(e, t, a, i) {
      if (a !== null && a.type === Pr)
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
          var o = e.toLowerCase().slice(0, 5);
          return o !== "data-" && o !== "aria-";
        }
        default:
          return !1;
      }
    }
    function ue(e, t, a, i) {
      if (t === null || typeof t > "u" || fe(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case on:
            return !t;
          case jr:
            return t === !1;
          case yr:
            return isNaN(t);
          case z:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function ye(e) {
      return Pe.hasOwnProperty(e) ? Pe[e] : null;
    }
    function se(e, t, a, i, o, s, f) {
      this.acceptsBooleans = t === mr || t === on || t === jr, this.attributeName = i, this.attributeNamespace = o, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
    }
    var Pe = {}, Ot = [
      "children",
      "dangerouslySetInnerHTML",
      // TODO: This prevents the assignment of defaultValue to regular
      // elements (not just inputs). Now that ReactDOMInput assigns to the
      // defaultValue property -- do we need this?
      "defaultValue",
      "defaultChecked",
      "innerHTML",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
      "style"
    ];
    Ot.forEach(function(e) {
      Pe[e] = new se(
        e,
        Pr,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
      var t = e[0], a = e[1];
      Pe[t] = new se(
        t,
        Rn,
        !1,
        // mustUseProperty
        a,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
      Pe[e] = new se(
        e,
        mr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
      Pe[e] = new se(
        e,
        mr,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "allowFullScreen",
      "async",
      // Note: there is a special case that prevents it from being written to the DOM
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
      // Microdata
      "itemScope"
    ].forEach(function(e) {
      Pe[e] = new se(
        e,
        on,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "checked",
      // Note: `option.selected` is not updated if `select.multiple` is
      // disabled with `removeAttribute`. We have special logic for handling this.
      "multiple",
      "muted",
      "selected"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Pe[e] = new se(
        e,
        on,
        !0,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "capture",
      "download"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Pe[e] = new se(
        e,
        jr,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "cols",
      "rows",
      "size",
      "span"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Pe[e] = new se(
        e,
        z,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["rowSpan", "start"].forEach(function(e) {
      Pe[e] = new se(
        e,
        yr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var jt = /[\-\:]([a-z])/g, Xn = function(e) {
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
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(jt, Xn);
      Pe[t] = new se(
        t,
        Rn,
        !1,
        // mustUseProperty
        e,
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xlink:actuate",
      "xlink:arcrole",
      "xlink:role",
      "xlink:show",
      "xlink:title",
      "xlink:type"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(jt, Xn);
      Pe[t] = new se(
        t,
        Rn,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/1999/xlink",
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xml:base",
      "xml:lang",
      "xml:space"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(jt, Xn);
      Pe[t] = new se(
        t,
        Rn,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      Pe[e] = new se(
        e,
        Rn,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var hi = "xlinkHref";
    Pe[hi] = new se(
      "xlinkHref",
      Rn,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      Pe[e] = new se(
        e,
        Rn,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !0,
        // sanitizeURL
        !0
      );
    });
    var Bi = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, mi = !1;
    function ni(e) {
      !mi && Bi.test(e) && (mi = !0, _("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function ri(e, t, a, i) {
      if (i.mustUseProperty) {
        var o = i.propertyName;
        return e[o];
      } else {
        sr(a, t), i.sanitizeURL && ni("" + a);
        var s = i.attributeName, f = null;
        if (i.type === jr) {
          if (e.hasAttribute(s)) {
            var v = e.getAttribute(s);
            return v === "" ? !0 : ue(t, a, i, !1) ? v : v === "" + a ? a : v;
          }
        } else if (e.hasAttribute(s)) {
          if (ue(t, a, i, !1))
            return e.getAttribute(s);
          if (i.type === on)
            return a;
          f = e.getAttribute(s);
        }
        return ue(t, a, i, !1) ? f === null ? a : f : f === "" + a ? a : f;
      }
    }
    function Na(e, t, a, i) {
      {
        if (!Et(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var o = e.getAttribute(t);
        return sr(a, t), o === "" + a ? a : o;
      }
    }
    function Vi(e, t, a, i) {
      var o = ye(t);
      if (!Be(t, o, i)) {
        if (ue(t, a, o, i) && (a = null), i || o === null) {
          if (Et(t)) {
            var s = t;
            a === null ? e.removeAttribute(s) : (sr(a, t), e.setAttribute(s, "" + a));
          }
          return;
        }
        var f = o.mustUseProperty;
        if (f) {
          var v = o.propertyName;
          if (a === null) {
            var m = o.type;
            e[v] = m === on ? !1 : "";
          } else
            e[v] = a;
          return;
        }
        var E = o.attributeName, b = o.attributeNamespace;
        if (a === null)
          e.removeAttribute(E);
        else {
          var L = o.type, M;
          L === on || L === jr && a === !0 ? M = "" : (sr(a, E), M = "" + a, o.sanitizeURL && ni(M.toString())), b ? e.setAttributeNS(b, E, M) : e.setAttribute(E, M);
        }
      }
    }
    var Kr = Symbol.for("react.element"), Zr = Symbol.for("react.portal"), Sa = Symbol.for("react.fragment"), $i = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), ae = Symbol.for("react.provider"), ge = Symbol.for("react.context"), Ee = Symbol.for("react.forward_ref"), Tt = Symbol.for("react.suspense"), At = Symbol.for("react.suspense_list"), St = Symbol.for("react.memo"), qe = Symbol.for("react.lazy"), Kn = Symbol.for("react.scope"), un = Symbol.for("react.debug_trace_mode"), sn = Symbol.for("react.offscreen"), kr = Symbol.for("react.legacy_hidden"), yi = Symbol.for("react.cache"), cn = Symbol.for("react.tracing_marker"), Jr = Symbol.iterator, ns = "@@iterator";
    function gi(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Jr && e[Jr] || e[ns];
      return typeof t == "function" ? t : null;
    }
    var _t = Object.assign, lo = 0, Ii, bl, ea, rs, Fr, as, is;
    function ls() {
    }
    ls.__reactDisabledLog = !0;
    function oo() {
      {
        if (lo === 0) {
          Ii = console.log, bl = console.info, ea = console.warn, rs = console.error, Fr = console.group, as = console.groupCollapsed, is = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: ls,
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
        lo++;
      }
    }
    function Ko() {
      {
        if (lo--, lo === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: _t({}, e, {
              value: Ii
            }),
            info: _t({}, e, {
              value: bl
            }),
            warn: _t({}, e, {
              value: ea
            }),
            error: _t({}, e, {
              value: rs
            }),
            group: _t({}, e, {
              value: Fr
            }),
            groupCollapsed: _t({}, e, {
              value: as
            }),
            groupEnd: _t({}, e, {
              value: is
            })
          });
        }
        lo < 0 && _("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Yi = C.ReactCurrentDispatcher, Si;
    function La(e, t, a) {
      {
        if (Si === void 0)
          try {
            throw Error();
          } catch (o) {
            var i = o.stack.trim().match(/\n( *(at )?)/);
            Si = i && i[1] || "";
          }
        return `
` + Si + e;
      }
    }
    var wl = !1, Ci;
    {
      var uo = typeof WeakMap == "function" ? WeakMap : Map;
      Ci = new uo();
    }
    function so(e, t) {
      if (!e || wl)
        return "";
      {
        var a = Ci.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      wl = !0;
      var o = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var s;
      s = Yi.current, Yi.current = null, oo();
      try {
        if (t) {
          var f = function() {
            throw Error();
          };
          if (Object.defineProperty(f.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(f, []);
            } catch (I) {
              i = I;
            }
            Reflect.construct(e, [], f);
          } else {
            try {
              f.call();
            } catch (I) {
              i = I;
            }
            e.call(f.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (I) {
            i = I;
          }
          e();
        }
      } catch (I) {
        if (I && i && typeof I.stack == "string") {
          for (var v = I.stack.split(`
`), m = i.stack.split(`
`), E = v.length - 1, b = m.length - 1; E >= 1 && b >= 0 && v[E] !== m[b]; )
            b--;
          for (; E >= 1 && b >= 0; E--, b--)
            if (v[E] !== m[b]) {
              if (E !== 1 || b !== 1)
                do
                  if (E--, b--, b < 0 || v[E] !== m[b]) {
                    var L = `
` + v[E].replace(" at new ", " at ");
                    return e.displayName && L.includes("<anonymous>") && (L = L.replace("<anonymous>", e.displayName)), typeof e == "function" && Ci.set(e, L), L;
                  }
                while (E >= 1 && b >= 0);
              break;
            }
        }
      } finally {
        wl = !1, Yi.current = s, Ko(), Error.prepareStackTrace = o;
      }
      var M = e ? e.displayName || e.name : "", $ = M ? La(M) : "";
      return typeof e == "function" && Ci.set(e, $), $;
    }
    function Rl(e, t, a) {
      return so(e, !0);
    }
    function os(e, t, a) {
      return so(e, !1);
    }
    function us(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Lt(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return so(e, us(e));
      if (typeof e == "string")
        return La(e);
      switch (e) {
        case Tt:
          return La("Suspense");
        case At:
          return La("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case Ee:
            return os(e.render);
          case St:
            return Lt(e.type, t, a);
          case qe: {
            var i = e, o = i._payload, s = i._init;
            try {
              return Lt(s(o), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function ss(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case ce:
          return La(e.type);
        case En:
          return La("Lazy");
        case Le:
          return La("Suspense");
        case xt:
          return La("SuspenseList");
        case ve:
        case _e:
        case ot:
          return os(e.type);
        case Qe:
          return os(e.type.render);
        case ne:
          return Rl(e.type);
        default:
          return "";
      }
    }
    function Zo(e) {
      try {
        var t = "", a = e;
        do
          t += ss(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function Tl(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var o = t.displayName || t.name || "";
      return o !== "" ? a + "(" + o + ")" : a;
    }
    function cs(e) {
      return e.displayName || "Context";
    }
    function Ft(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && _("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case Sa:
          return "Fragment";
        case Zr:
          return "Portal";
        case x:
          return "Profiler";
        case $i:
          return "StrictMode";
        case Tt:
          return "Suspense";
        case At:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case ge:
            var t = e;
            return cs(t) + ".Consumer";
          case ae:
            var a = e;
            return cs(a._context) + ".Provider";
          case Ee:
            return Tl(e, e.render, "ForwardRef");
          case St:
            var i = e.displayName || null;
            return i !== null ? i : Ft(e.type) || "Memo";
          case qe: {
            var o = e, s = o._payload, f = o._init;
            try {
              return Ft(f(s));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function Jo(e, t, a) {
      var i = t.displayName || t.name || "";
      return e.displayName || (i !== "" ? a + "(" + i + ")" : a);
    }
    function co(e) {
      return e.displayName || "Context";
    }
    function st(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case Dt:
          return "Cache";
        case Ct:
          var i = a;
          return co(i) + ".Consumer";
        case Xe:
          var o = a;
          return co(o._context) + ".Provider";
        case Zt:
          return "DehydratedFragment";
        case Qe:
          return Jo(a, a.render, "ForwardRef");
        case ct:
          return "Fragment";
        case ce:
          return a;
        case Ne:
          return "Portal";
        case re:
          return "Root";
        case be:
          return "Text";
        case En:
          return Ft(a);
        case Kt:
          return a === $i ? "StrictMode" : "Mode";
        case nt:
          return "Offscreen";
        case Nt:
          return "Profiler";
        case nn:
          return "Scope";
        case Le:
          return "Suspense";
        case xt:
          return "SuspenseList";
        case vt:
          return "TracingMarker";
        case ne:
        case ve:
        case gn:
        case _e:
        case wt:
        case ot:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var ai = C.ReactDebugCurrentFrame, Tn = null, ta = !1;
    function Aa() {
      {
        if (Tn === null)
          return null;
        var e = Tn._debugOwner;
        if (e !== null && typeof e < "u")
          return st(e);
      }
      return null;
    }
    function xl() {
      return Tn === null ? "" : Zo(Tn);
    }
    function pn() {
      ai.getCurrentStack = null, Tn = null, ta = !1;
    }
    function xn(e) {
      ai.getCurrentStack = e === null ? null : xl, Tn = e, ta = !1;
    }
    function fs() {
      return Tn;
    }
    function gr(e) {
      ta = e;
    }
    function na(e) {
      return "" + e;
    }
    function ii(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return cr(e), e;
        default:
          return "";
      }
    }
    var eu = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function fo(e, t) {
      eu[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || _("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || _("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function po(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function Dl(e) {
      return e._valueTracker;
    }
    function za(e) {
      e._valueTracker = null;
    }
    function Wi(e) {
      var t = "";
      return e && (po(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function tu(e) {
      var t = po(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      cr(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var o = a.get, s = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return o.call(this);
          },
          set: function(v) {
            cr(v), i = "" + v, s.call(this, v);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var f = {
          getValue: function() {
            return i;
          },
          setValue: function(v) {
            cr(v), i = "" + v;
          },
          stopTracking: function() {
            za(e), delete e[t];
          }
        };
        return f;
      }
    }
    function Gi(e) {
      Dl(e) || (e._valueTracker = tu(e));
    }
    function nu(e) {
      if (!e)
        return !1;
      var t = Dl(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = Wi(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function Ei(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var Qi = !1, ru = !1, ds = !1, li = !1;
    function au(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function y(e, t) {
      var a = e, i = t.checked, o = _t({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return o;
    }
    function T(e, t) {
      fo("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !ru && (_("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Aa() || "A component", t.type), ru = !0), t.value !== void 0 && t.defaultValue !== void 0 && !Qi && (_("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Aa() || "A component", t.type), Qi = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: ii(t.value != null ? t.value : i),
        controlled: au(t)
      };
    }
    function V(e, t) {
      var a = e, i = t.checked;
      i != null && Vi(a, "checked", i, !1);
    }
    function W(e, t) {
      var a = e;
      {
        var i = au(t);
        !a._wrapperState.controlled && i && !li && (_("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), li = !0), a._wrapperState.controlled && !i && !ds && (_("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), ds = !0);
      }
      V(e, t);
      var o = ii(t.value), s = t.type;
      if (o != null)
        s === "number" ? (o === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != o) && (a.value = na(o)) : a.value !== na(o) && (a.value = na(o));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? lt(a, t.type, o) : t.hasOwnProperty("defaultValue") && lt(a, t.type, ii(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function de(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var o = t.type, s = o === "submit" || o === "reset";
        if (s && (t.value === void 0 || t.value === null))
          return;
        var f = na(i._wrapperState.initialValue);
        a || f !== i.value && (i.value = f), i.defaultValue = f;
      }
      var v = i.name;
      v !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, v !== "" && (i.name = v);
    }
    function je(e, t) {
      var a = e;
      W(a, t), xe(a, t);
    }
    function xe(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        sr(a, "name");
        for (var o = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), s = 0; s < o.length; s++) {
          var f = o[s];
          if (!(f === e || f.form !== e.form)) {
            var v = Wh(f);
            if (!v)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            nu(f), W(f, v);
          }
        }
      }
    }
    function lt(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || Ei(e.ownerDocument) !== e) && (a == null ? e.defaultValue = na(e._wrapperState.initialValue) : e.defaultValue !== na(a) && (e.defaultValue = na(a)));
    }
    var bt = !1, Wt = !1, Qt = !1;
    function qt(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? d.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || Wt || (Wt = !0, _("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (Qt || (Qt = !0, _("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !bt && (_("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), bt = !0);
    }
    function Xt(e, t) {
      t.value != null && e.setAttribute("value", na(ii(t.value)));
    }
    var vn = Array.isArray;
    function Ht(e) {
      return vn(e);
    }
    var Ol;
    Ol = !1;
    function iu() {
      var e = Aa();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var ps = ["value", "defaultValue"];
    function vs(e) {
      {
        fo("select", e);
        for (var t = 0; t < ps.length; t++) {
          var a = ps[t];
          if (e[a] != null) {
            var i = Ht(e[a]);
            e.multiple && !i ? _("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, iu()) : !e.multiple && i && _("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, iu());
          }
        }
      }
    }
    function qi(e, t, a, i) {
      var o = e.options;
      if (t) {
        for (var s = a, f = {}, v = 0; v < s.length; v++)
          f["$" + s[v]] = !0;
        for (var m = 0; m < o.length; m++) {
          var E = f.hasOwnProperty("$" + o[m].value);
          o[m].selected !== E && (o[m].selected = E), E && i && (o[m].defaultSelected = !0);
        }
      } else {
        for (var b = na(ii(a)), L = null, M = 0; M < o.length; M++) {
          if (o[M].value === b) {
            o[M].selected = !0, i && (o[M].defaultSelected = !0);
            return;
          }
          L === null && !o[M].disabled && (L = o[M]);
        }
        L !== null && (L.selected = !0);
      }
    }
    function hs(e, t) {
      return _t({}, t, {
        value: void 0
      });
    }
    function ms(e, t) {
      var a = e;
      vs(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !Ol && (_("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), Ol = !0);
    }
    function sd(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? qi(a, !!t.multiple, i, !1) : t.defaultValue != null && qi(a, !!t.multiple, t.defaultValue, !0);
    }
    function by(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var o = t.value;
      o != null ? qi(a, !!t.multiple, o, !1) : i !== !!t.multiple && (t.defaultValue != null ? qi(a, !!t.multiple, t.defaultValue, !0) : qi(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function yv(e, t) {
      var a = e, i = t.value;
      i != null && qi(a, !!t.multiple, i, !1);
    }
    var gv = !1;
    function cd(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = _t({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: na(a._wrapperState.initialValue)
      });
      return i;
    }
    function Sv(e, t) {
      var a = e;
      fo("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !gv && (_("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Aa() || "A component"), gv = !0);
      var i = t.value;
      if (i == null) {
        var o = t.children, s = t.defaultValue;
        if (o != null) {
          _("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (Ht(o)) {
              if (o.length > 1)
                throw new Error("<textarea> can only have at most one child.");
              o = o[0];
            }
            s = o;
          }
        }
        s == null && (s = ""), i = s;
      }
      a._wrapperState = {
        initialValue: ii(i)
      };
    }
    function Cv(e, t) {
      var a = e, i = ii(t.value), o = ii(t.defaultValue);
      if (i != null) {
        var s = na(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      o != null && (a.defaultValue = na(o));
    }
    function wc(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function wy(e, t) {
      Cv(e, t);
    }
    var Xi = "http://www.w3.org/1999/xhtml", Ry = "http://www.w3.org/1998/Math/MathML", Rc = "http://www.w3.org/2000/svg";
    function fd(e) {
      switch (e) {
        case "svg":
          return Rc;
        case "math":
          return Ry;
        default:
          return Xi;
      }
    }
    function dd(e, t) {
      return e == null || e === Xi ? fd(t) : e === Rc && t === "foreignObject" ? Xi : e;
    }
    var Ty = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, o) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, o);
        });
      } : e;
    }, Tc, Ev = Ty(function(e, t) {
      if (e.namespaceURI === Rc && !("innerHTML" in e)) {
        Tc = Tc || document.createElement("div"), Tc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = Tc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), ra = 1, Ki = 3, Nn = 8, Ca = 9, pd = 11, ys = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === Ki) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, _v = {
      animation: ["animationDelay", "animationDirection", "animationDuration", "animationFillMode", "animationIterationCount", "animationName", "animationPlayState", "animationTimingFunction"],
      background: ["backgroundAttachment", "backgroundClip", "backgroundColor", "backgroundImage", "backgroundOrigin", "backgroundPositionX", "backgroundPositionY", "backgroundRepeat", "backgroundSize"],
      backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
      border: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth", "borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth", "borderLeftColor", "borderLeftStyle", "borderLeftWidth", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderBlockEnd: ["borderBlockEndColor", "borderBlockEndStyle", "borderBlockEndWidth"],
      borderBlockStart: ["borderBlockStartColor", "borderBlockStartStyle", "borderBlockStartWidth"],
      borderBottom: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth"],
      borderColor: ["borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor"],
      borderImage: ["borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth"],
      borderInlineEnd: ["borderInlineEndColor", "borderInlineEndStyle", "borderInlineEndWidth"],
      borderInlineStart: ["borderInlineStartColor", "borderInlineStartStyle", "borderInlineStartWidth"],
      borderLeft: ["borderLeftColor", "borderLeftStyle", "borderLeftWidth"],
      borderRadius: ["borderBottomLeftRadius", "borderBottomRightRadius", "borderTopLeftRadius", "borderTopRightRadius"],
      borderRight: ["borderRightColor", "borderRightStyle", "borderRightWidth"],
      borderStyle: ["borderBottomStyle", "borderLeftStyle", "borderRightStyle", "borderTopStyle"],
      borderTop: ["borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderWidth: ["borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderTopWidth"],
      columnRule: ["columnRuleColor", "columnRuleStyle", "columnRuleWidth"],
      columns: ["columnCount", "columnWidth"],
      flex: ["flexBasis", "flexGrow", "flexShrink"],
      flexFlow: ["flexDirection", "flexWrap"],
      font: ["fontFamily", "fontFeatureSettings", "fontKerning", "fontLanguageOverride", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition", "fontWeight", "lineHeight"],
      fontVariant: ["fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition"],
      gap: ["columnGap", "rowGap"],
      grid: ["gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      gridArea: ["gridColumnEnd", "gridColumnStart", "gridRowEnd", "gridRowStart"],
      gridColumn: ["gridColumnEnd", "gridColumnStart"],
      gridColumnGap: ["columnGap"],
      gridGap: ["columnGap", "rowGap"],
      gridRow: ["gridRowEnd", "gridRowStart"],
      gridRowGap: ["rowGap"],
      gridTemplate: ["gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      listStyle: ["listStyleImage", "listStylePosition", "listStyleType"],
      margin: ["marginBottom", "marginLeft", "marginRight", "marginTop"],
      marker: ["markerEnd", "markerMid", "markerStart"],
      mask: ["maskClip", "maskComposite", "maskImage", "maskMode", "maskOrigin", "maskPositionX", "maskPositionY", "maskRepeat", "maskSize"],
      maskPosition: ["maskPositionX", "maskPositionY"],
      outline: ["outlineColor", "outlineStyle", "outlineWidth"],
      overflow: ["overflowX", "overflowY"],
      padding: ["paddingBottom", "paddingLeft", "paddingRight", "paddingTop"],
      placeContent: ["alignContent", "justifyContent"],
      placeItems: ["alignItems", "justifyItems"],
      placeSelf: ["alignSelf", "justifySelf"],
      textDecoration: ["textDecorationColor", "textDecorationLine", "textDecorationStyle"],
      textEmphasis: ["textEmphasisColor", "textEmphasisStyle"],
      transition: ["transitionDelay", "transitionDuration", "transitionProperty", "transitionTimingFunction"],
      wordWrap: ["overflowWrap"]
    }, lu = {
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
    function bv(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var wv = ["Webkit", "ms", "Moz", "O"];
    Object.keys(lu).forEach(function(e) {
      wv.forEach(function(t) {
        lu[bv(t, e)] = lu[e];
      });
    });
    function kl(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(lu.hasOwnProperty(e) && lu[e]) ? t + "px" : (zr(t, e), ("" + t).trim());
    }
    var xy = /([A-Z])/g, Dy = /^ms-/;
    function Oy(e) {
      return e.replace(xy, "-$1").toLowerCase().replace(Dy, "-ms-");
    }
    var vd = function() {
    };
    {
      var Rv = /^(?:webkit|moz|o)[A-Z]/, gs = /^-ms-/, Ss = /-(.)/g, Tv = /;\s*$/, Zi = {}, hd = {}, md = !1, xc = !1, yd = function(e) {
        return e.replace(Ss, function(t, a) {
          return a.toUpperCase();
        });
      }, xv = function(e) {
        Zi.hasOwnProperty(e) && Zi[e] || (Zi[e] = !0, _(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          yd(e.replace(gs, "ms-"))
        ));
      }, Dv = function(e) {
        Zi.hasOwnProperty(e) && Zi[e] || (Zi[e] = !0, _("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, Ov = function(e, t) {
        hd.hasOwnProperty(t) && hd[t] || (hd[t] = !0, _(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(Tv, "")));
      }, ky = function(e, t) {
        md || (md = !0, _("`NaN` is an invalid value for the `%s` css style property.", e));
      }, My = function(e, t) {
        xc || (xc = !0, _("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      vd = function(e, t) {
        e.indexOf("-") > -1 ? xv(e) : Rv.test(e) ? Dv(e) : Tv.test(t) && Ov(e, t), typeof t == "number" && (isNaN(t) ? ky(e, t) : isFinite(t) || My(e, t));
      };
    }
    var Ny = vd;
    function Ly(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var o = e[i];
            if (o != null) {
              var s = i.indexOf("--") === 0;
              t += a + (s ? i : Oy(i)) + ":", t += kl(i, o, s), a = ";";
            }
          }
        return t || null;
      }
    }
    function kv(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var o = i.indexOf("--") === 0;
          o || Ny(i, t[i]);
          var s = kl(i, t[i], o);
          i === "float" && (i = "cssFloat"), o ? a.setProperty(i, s) : a[i] = s;
        }
    }
    function oi(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function ou(e) {
      var t = {};
      for (var a in e)
        for (var i = _v[a] || [a], o = 0; o < i.length; o++)
          t[i[o]] = a;
      return t;
    }
    function Mv(e, t) {
      {
        if (!t)
          return;
        var a = ou(e), i = ou(t), o = {};
        for (var s in a) {
          var f = a[s], v = i[s];
          if (v && f !== v) {
            var m = f + "," + v;
            if (o[m])
              continue;
            o[m] = !0, _("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", oi(e[f]) ? "Removing" : "Updating", f, v);
          }
        }
      }
    }
    var Nv = {
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
    }, Lv = _t({
      menuitem: !0
    }, Nv), Av = "__html";
    function Cs(e, t) {
      if (t) {
        if (Lv[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(Av in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && _("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function vo(e, t) {
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
    var Dc = {
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
    }, ho = {
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
    }, Ml = {}, Es = new RegExp("^(aria)-[" + U + "]*$"), gd = new RegExp("^(aria)[A-Z][" + U + "]*$");
    function zv(e, t) {
      {
        if (Hn.call(Ml, t) && Ml[t])
          return !0;
        if (gd.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = ho.hasOwnProperty(a) ? a : null;
          if (i == null)
            return _("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), Ml[t] = !0, !0;
          if (t !== i)
            return _("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), Ml[t] = !0, !0;
        }
        if (Es.test(t)) {
          var o = t.toLowerCase(), s = ho.hasOwnProperty(o) ? o : null;
          if (s == null)
            return Ml[t] = !0, !1;
          if (t !== s)
            return _("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, s), Ml[t] = !0, !0;
        }
      }
      return !0;
    }
    function Oc(e, t) {
      {
        var a = [];
        for (var i in t) {
          var o = zv(e, i);
          o || a.push(i);
        }
        var s = a.map(function(f) {
          return "`" + f + "`";
        }).join(", ");
        a.length === 1 ? _("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e) : a.length > 1 && _("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e);
      }
    }
    function uu(e, t) {
      vo(e, t) || Oc(e, t);
    }
    var kc = !1;
    function Uv(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !kc && (kc = !0, e === "select" && t.multiple ? _("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : _("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var _s = function() {
    };
    {
      var Mr = {}, Sd = /^on./, Pv = /^on[^A-Z]/, jv = new RegExp("^(aria)-[" + U + "]*$"), Fv = new RegExp("^(aria)[A-Z][" + U + "]*$");
      _s = function(e, t, a, i) {
        if (Hn.call(Mr, t) && Mr[t])
          return !0;
        var o = t.toLowerCase();
        if (o === "onfocusin" || o === "onfocusout")
          return _("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), Mr[t] = !0, !0;
        if (i != null) {
          var s = i.registrationNameDependencies, f = i.possibleRegistrationNames;
          if (s.hasOwnProperty(t))
            return !0;
          var v = f.hasOwnProperty(o) ? f[o] : null;
          if (v != null)
            return _("Invalid event handler property `%s`. Did you mean `%s`?", t, v), Mr[t] = !0, !0;
          if (Sd.test(t))
            return _("Unknown event handler property `%s`. It will be ignored.", t), Mr[t] = !0, !0;
        } else if (Sd.test(t))
          return Pv.test(t) && _("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), Mr[t] = !0, !0;
        if (jv.test(t) || Fv.test(t))
          return !0;
        if (o === "innerhtml")
          return _("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), Mr[t] = !0, !0;
        if (o === "aria")
          return _("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), Mr[t] = !0, !0;
        if (o === "is" && a !== null && a !== void 0 && typeof a != "string")
          return _("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), Mr[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return _("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), Mr[t] = !0, !0;
        var m = ye(t), E = m !== null && m.type === Pr;
        if (Dc.hasOwnProperty(o)) {
          var b = Dc[o];
          if (b !== t)
            return _("Invalid DOM property `%s`. Did you mean `%s`?", t, b), Mr[t] = !0, !0;
        } else if (!E && t !== o)
          return _("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, o), Mr[t] = !0, !0;
        return typeof a == "boolean" && fe(t, a, m, !1) ? (a ? _('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : _('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), Mr[t] = !0, !0) : E ? !0 : fe(t, a, m, !1) ? (Mr[t] = !0, !1) : ((a === "false" || a === "true") && m !== null && m.type === on && (_("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), Mr[t] = !0), !0);
      };
    }
    var Hv = function(e, t, a) {
      {
        var i = [];
        for (var o in t) {
          var s = _s(e, o, t[o], a);
          s || i.push(o);
        }
        var f = i.map(function(v) {
          return "`" + v + "`";
        }).join(", ");
        i.length === 1 ? _("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e) : i.length > 1 && _("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e);
      }
    };
    function Nl(e, t, a) {
      vo(e, t) || Hv(e, t, a);
    }
    var Mc = 1, bs = 2, ws = 4, Ay = Mc | bs | ws, Ji = null;
    function zy(e) {
      Ji !== null && _("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), Ji = e;
    }
    function Bv() {
      Ji === null && _("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), Ji = null;
    }
    function Vv(e) {
      return e === Ji;
    }
    function an(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Ki ? t.parentNode : t;
    }
    var Rs = null, el = null, _i = null;
    function Cd(e) {
      var t = Hu(e);
      if (t) {
        if (typeof Rs != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = Wh(a);
          Rs(t.stateNode, t.type, i);
        }
      }
    }
    function Ed(e) {
      Rs = e;
    }
    function su(e) {
      el ? _i ? _i.push(e) : _i = [e] : el = e;
    }
    function Nc() {
      return el !== null || _i !== null;
    }
    function mo() {
      if (el) {
        var e = el, t = _i;
        if (el = null, _i = null, Cd(e), t)
          for (var a = 0; a < t.length; a++)
            Cd(t[a]);
      }
    }
    var _d = function(e, t) {
      return e(t);
    }, $v = function() {
    }, bd = !1;
    function Iv() {
      var e = Nc();
      e && ($v(), mo());
    }
    function Ts(e, t, a) {
      if (bd)
        return e(t, a);
      bd = !0;
      try {
        return _d(e, t, a);
      } finally {
        bd = !1, Iv();
      }
    }
    function Lc(e, t, a) {
      _d = e, $v = a;
    }
    function wd(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function Rd(e, t, a) {
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
          return !!(a.disabled && wd(t));
        default:
          return !1;
      }
    }
    function yo(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = Wh(a);
      if (i === null)
        return null;
      var o = i[t];
      if (Rd(t, e.type, i))
        return null;
      if (o && typeof o != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof o + "` type.");
      return o;
    }
    var xs = !1;
    if (Sn)
      try {
        var Ds = {};
        Object.defineProperty(Ds, "passive", {
          get: function() {
            xs = !0;
          }
        }), window.addEventListener("test", Ds, Ds), window.removeEventListener("test", Ds, Ds);
      } catch {
        xs = !1;
      }
    function Td(e, t, a, i, o, s, f, v, m) {
      var E = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, E);
      } catch (b) {
        this.onError(b);
      }
    }
    var Yv = Td;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var xd = document.createElement("react");
      Yv = function(t, a, i, o, s, f, v, m, E) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var b = document.createEvent("Event"), L = !1, M = !0, $ = window.event, I = Object.getOwnPropertyDescriptor(window, "event");
        function G() {
          xd.removeEventListener(Q, et, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = $);
        }
        var De = Array.prototype.slice.call(arguments, 3);
        function et() {
          L = !0, G(), a.apply(i, De), M = !1;
        }
        var We, Ut = !1, Mt = !1;
        function F(H) {
          if (We = H.error, Ut = !0, We === null && H.colno === 0 && H.lineno === 0 && (Mt = !0), H.defaultPrevented && We != null && typeof We == "object")
            try {
              We._suppressLogging = !0;
            } catch {
            }
        }
        var Q = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", F), xd.addEventListener(Q, et, !1), b.initEvent(Q, !1, !1), xd.dispatchEvent(b), I && Object.defineProperty(window, "event", I), L && M && (Ut ? Mt && (We = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : We = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(We)), window.removeEventListener("error", F), !L)
          return G(), Td.apply(this, arguments);
      };
    }
    var Dd = Yv, Ea = !1, Os = null, tl = !1, Ua = null, ks = {
      onError: function(e) {
        Ea = !0, Os = e;
      }
    };
    function ui(e, t, a, i, o, s, f, v, m) {
      Ea = !1, Os = null, Dd.apply(ks, arguments);
    }
    function Od(e, t, a, i, o, s, f, v, m) {
      if (ui.apply(this, arguments), Ea) {
        var E = nl();
        tl || (tl = !0, Ua = E);
      }
    }
    function Uy() {
      if (tl) {
        var e = Ua;
        throw tl = !1, Ua = null, e;
      }
    }
    function Py() {
      return Ea;
    }
    function nl() {
      if (Ea) {
        var e = Os;
        return Ea = !1, Os = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function bi(e) {
      return e._reactInternals;
    }
    function cu(e) {
      return e._reactInternals !== void 0;
    }
    function Ac(e, t) {
      e._reactInternals = t;
    }
    var Ze = (
      /*                      */
      0
    ), si = (
      /*                */
      1
    ), ln = (
      /*                    */
      2
    ), $e = (
      /*                       */
      4
    ), Vt = (
      /*                */
      16
    ), Pa = (
      /*                 */
      32
    ), fr = (
      /*                     */
      64
    ), dt = (
      /*                   */
      128
    ), Hr = (
      /*            */
      256
    ), _a = (
      /*                          */
      512
    ), Zn = (
      /*                     */
      1024
    ), aa = (
      /*                      */
      2048
    ), wi = (
      /*                    */
      4096
    ), Ll = (
      /*                   */
      8192
    ), go = (
      /*             */
      16384
    ), Wv = aa | $e | fr | _a | Zn | go, rl = (
      /*               */
      32767
    ), Al = (
      /*                   */
      32768
    ), Sr = (
      /*                */
      65536
    ), zc = (
      /* */
      131072
    ), Gv = (
      /*                       */
      1048576
    ), Ri = (
      /*                    */
      2097152
    ), ja = (
      /*                 */
      4194304
    ), zl = (
      /*                */
      8388608
    ), Fa = (
      /*               */
      16777216
    ), So = (
      /*              */
      33554432
    ), ia = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      $e | Zn | 0
    ), la = ln | $e | Vt | Pa | _a | wi | Ll, ci = $e | fr | _a | Ll, oa = aa | Vt, Cr = ja | zl | Ri, Co = C.ReactCurrentOwner;
    function Ul(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (ln | wi)) !== Ze && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === re ? a : null;
    }
    function Uc(e) {
      if (e.tag === Le) {
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
    function Pc(e) {
      return e.tag === re ? e.stateNode.containerInfo : null;
    }
    function ba(e) {
      return Ul(e) === e;
    }
    function wa(e) {
      {
        var t = Co.current;
        if (t !== null && t.tag === ne) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || _("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", st(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var o = bi(e);
      return o ? Ul(o) === o : !1;
    }
    function hn(e) {
      if (Ul(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function Ha(e) {
      var t = e.alternate;
      if (!t) {
        var a = Ul(e);
        if (a === null)
          throw new Error("Unable to find node on an unmounted component.");
        return a !== e ? null : e;
      }
      for (var i = e, o = t; ; ) {
        var s = i.return;
        if (s === null)
          break;
        var f = s.alternate;
        if (f === null) {
          var v = s.return;
          if (v !== null) {
            i = o = v;
            continue;
          }
          break;
        }
        if (s.child === f.child) {
          for (var m = s.child; m; ) {
            if (m === i)
              return hn(s), e;
            if (m === o)
              return hn(s), t;
            m = m.sibling;
          }
          throw new Error("Unable to find node on an unmounted component.");
        }
        if (i.return !== o.return)
          i = s, o = f;
        else {
          for (var E = !1, b = s.child; b; ) {
            if (b === i) {
              E = !0, i = s, o = f;
              break;
            }
            if (b === o) {
              E = !0, o = s, i = f;
              break;
            }
            b = b.sibling;
          }
          if (!E) {
            for (b = f.child; b; ) {
              if (b === i) {
                E = !0, i = f, o = s;
                break;
              }
              if (b === o) {
                E = !0, o = f, i = s;
                break;
              }
              b = b.sibling;
            }
            if (!E)
              throw new Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (i.alternate !== o)
          throw new Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (i.tag !== re)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function kd(e) {
      var t = Ha(e);
      return t !== null ? Md(t) : null;
    }
    function Md(e) {
      if (e.tag === ce || e.tag === be)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = Md(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function Nd(e) {
      var t = Ha(e);
      return t !== null ? jc(t) : null;
    }
    function jc(e) {
      if (e.tag === ce || e.tag === be)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== Ne) {
          var a = jc(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var Ld = h.unstable_scheduleCallback, Fc = h.unstable_cancelCallback, Qv = h.unstable_shouldYield, fu = h.unstable_requestPaint, Jn = h.unstable_now, jy = h.unstable_getCurrentPriorityLevel, ua = h.unstable_ImmediatePriority, du = h.unstable_UserBlockingPriority, Ti = h.unstable_NormalPriority, pu = h.unstable_LowPriority, Ms = h.unstable_IdlePriority, Ad = h.unstable_yieldValue, zd = h.unstable_setDisableYieldValue, Pl = null, Bn = null, me = null, Nr = !1, Ra = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function qv(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return _("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        gt && (e = _t({}, e, {
          getLaneLabelMap: Hc,
          injectProfilingHooks: Fl
        })), Pl = t.inject(e), Bn = t;
      } catch (a) {
        _("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function al(e, t) {
      if (Bn && typeof Bn.onScheduleFiberRoot == "function")
        try {
          Bn.onScheduleFiberRoot(Pl, e, t);
        } catch (a) {
          Nr || (Nr = !0, _("React instrumentation encountered an error: %s", a));
        }
    }
    function jl(e, t) {
      if (Bn && typeof Bn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & dt) === dt;
          if (Rt) {
            var i;
            switch (t) {
              case Yn:
                i = ua;
                break;
              case ll:
                i = du;
                break;
              case Oi:
                i = Ti;
                break;
              case bu:
                i = Ms;
                break;
              default:
                i = Ti;
                break;
            }
            Bn.onCommitFiberRoot(Pl, e, i, a);
          }
        } catch (o) {
          Nr || (Nr = !0, _("React instrumentation encountered an error: %s", o));
        }
    }
    function Ud(e) {
      if (Bn && typeof Bn.onPostCommitFiberRoot == "function")
        try {
          Bn.onPostCommitFiberRoot(Pl, e);
        } catch (t) {
          Nr || (Nr = !0, _("React instrumentation encountered an error: %s", t));
        }
    }
    function Xv(e) {
      if (Bn && typeof Bn.onCommitFiberUnmount == "function")
        try {
          Bn.onCommitFiberUnmount(Pl, e);
        } catch (t) {
          Nr || (Nr = !0, _("React instrumentation encountered an error: %s", t));
        }
    }
    function fn(e) {
      if (typeof Ad == "function" && (zd(e), A(e)), Bn && typeof Bn.setStrictMode == "function")
        try {
          Bn.setStrictMode(Pl, e);
        } catch (t) {
          Nr || (Nr = !0, _("React instrumentation encountered an error: %s", t));
        }
    }
    function Fl(e) {
      me = e;
    }
    function Hc() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < Vn; a++) {
          var i = ah(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function Kv(e) {
      me !== null && typeof me.markCommitStarted == "function" && me.markCommitStarted(e);
    }
    function Ns() {
      me !== null && typeof me.markCommitStopped == "function" && me.markCommitStopped();
    }
    function vu(e) {
      me !== null && typeof me.markComponentRenderStarted == "function" && me.markComponentRenderStarted(e);
    }
    function Eo() {
      me !== null && typeof me.markComponentRenderStopped == "function" && me.markComponentRenderStopped();
    }
    function Pd(e) {
      me !== null && typeof me.markComponentPassiveEffectMountStarted == "function" && me.markComponentPassiveEffectMountStarted(e);
    }
    function Bc() {
      me !== null && typeof me.markComponentPassiveEffectMountStopped == "function" && me.markComponentPassiveEffectMountStopped();
    }
    function Zv(e) {
      me !== null && typeof me.markComponentPassiveEffectUnmountStarted == "function" && me.markComponentPassiveEffectUnmountStarted(e);
    }
    function Jv() {
      me !== null && typeof me.markComponentPassiveEffectUnmountStopped == "function" && me.markComponentPassiveEffectUnmountStopped();
    }
    function eh(e) {
      me !== null && typeof me.markComponentLayoutEffectMountStarted == "function" && me.markComponentLayoutEffectMountStarted(e);
    }
    function jd() {
      me !== null && typeof me.markComponentLayoutEffectMountStopped == "function" && me.markComponentLayoutEffectMountStopped();
    }
    function hu(e) {
      me !== null && typeof me.markComponentLayoutEffectUnmountStarted == "function" && me.markComponentLayoutEffectUnmountStarted(e);
    }
    function Ls() {
      me !== null && typeof me.markComponentLayoutEffectUnmountStopped == "function" && me.markComponentLayoutEffectUnmountStopped();
    }
    function th(e, t, a) {
      me !== null && typeof me.markComponentErrored == "function" && me.markComponentErrored(e, t, a);
    }
    function nh(e, t, a) {
      me !== null && typeof me.markComponentSuspended == "function" && me.markComponentSuspended(e, t, a);
    }
    function mu(e) {
      me !== null && typeof me.markLayoutEffectsStarted == "function" && me.markLayoutEffectsStarted(e);
    }
    function rh() {
      me !== null && typeof me.markLayoutEffectsStopped == "function" && me.markLayoutEffectsStopped();
    }
    function As(e) {
      me !== null && typeof me.markPassiveEffectsStarted == "function" && me.markPassiveEffectsStarted(e);
    }
    function xi() {
      me !== null && typeof me.markPassiveEffectsStopped == "function" && me.markPassiveEffectsStopped();
    }
    function yu(e) {
      me !== null && typeof me.markRenderStarted == "function" && me.markRenderStarted(e);
    }
    function zs() {
      me !== null && typeof me.markRenderYielded == "function" && me.markRenderYielded();
    }
    function Hl() {
      me !== null && typeof me.markRenderStopped == "function" && me.markRenderStopped();
    }
    function Fd(e) {
      me !== null && typeof me.markRenderScheduled == "function" && me.markRenderScheduled(e);
    }
    function gu(e, t) {
      me !== null && typeof me.markForceUpdateScheduled == "function" && me.markForceUpdateScheduled(e, t);
    }
    function Vc(e, t) {
      me !== null && typeof me.markStateUpdateScheduled == "function" && me.markStateUpdateScheduled(e, t);
    }
    var Je = (
      /*                         */
      0
    ), Ye = (
      /*                 */
      1
    ), Bt = (
      /*                    */
      2
    ), Ln = (
      /*               */
      8
    ), Ba = (
      /*              */
      16
    ), Us = Math.clz32 ? Math.clz32 : Dn, Hd = Math.log, _o = Math.LN2;
    function Dn(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (Hd(t) / _o | 0) | 0;
    }
    var Vn = 31, X = (
      /*                        */
      0
    ), $n = (
      /*                          */
      0
    ), rt = (
      /*                        */
      1
    ), Di = (
      /*    */
      2
    ), il = (
      /*             */
      4
    ), An = (
      /*            */
      8
    ), Va = (
      /*                     */
      16
    ), bo = (
      /*                */
      32
    ), Bl = (
      /*                       */
      4194240
    ), sa = (
      /*                        */
      64
    ), ca = (
      /*                        */
      128
    ), wo = (
      /*                        */
      256
    ), Ps = (
      /*                        */
      512
    ), js = (
      /*                        */
      1024
    ), $c = (
      /*                        */
      2048
    ), Ic = (
      /*                        */
      4096
    ), Yc = (
      /*                        */
      8192
    ), Wc = (
      /*                        */
      16384
    ), Gc = (
      /*                       */
      32768
    ), Qc = (
      /*                       */
      65536
    ), qc = (
      /*                       */
      131072
    ), Xc = (
      /*                       */
      262144
    ), Ro = (
      /*                       */
      524288
    ), Kc = (
      /*                       */
      1048576
    ), Su = (
      /*                       */
      2097152
    ), To = (
      /*                            */
      130023424
    ), xo = (
      /*                             */
      4194304
    ), Fs = (
      /*                             */
      8388608
    ), Zc = (
      /*                             */
      16777216
    ), Jc = (
      /*                             */
      33554432
    ), ef = (
      /*                             */
      67108864
    ), Bd = xo, Do = (
      /*          */
      134217728
    ), Vd = (
      /*                          */
      268435455
    ), Cu = (
      /*               */
      268435456
    ), Vl = (
      /*                        */
      536870912
    ), Ta = (
      /*                   */
      1073741824
    );
    function ah(e) {
      {
        if (e & rt)
          return "Sync";
        if (e & Di)
          return "InputContinuousHydration";
        if (e & il)
          return "InputContinuous";
        if (e & An)
          return "DefaultHydration";
        if (e & Va)
          return "Default";
        if (e & bo)
          return "TransitionHydration";
        if (e & Bl)
          return "Transition";
        if (e & To)
          return "Retry";
        if (e & Do)
          return "SelectiveHydration";
        if (e & Cu)
          return "IdleHydration";
        if (e & Vl)
          return "Idle";
        if (e & Ta)
          return "Offscreen";
      }
    }
    var dn = -1, tf = sa, Hs = xo;
    function Eu(e) {
      switch (In(e)) {
        case rt:
          return rt;
        case Di:
          return Di;
        case il:
          return il;
        case An:
          return An;
        case Va:
          return Va;
        case bo:
          return bo;
        case sa:
        case ca:
        case wo:
        case Ps:
        case js:
        case $c:
        case Ic:
        case Yc:
        case Wc:
        case Gc:
        case Qc:
        case qc:
        case Xc:
        case Ro:
        case Kc:
        case Su:
          return e & Bl;
        case xo:
        case Fs:
        case Zc:
        case Jc:
        case ef:
          return e & To;
        case Do:
          return Do;
        case Cu:
          return Cu;
        case Vl:
          return Vl;
        case Ta:
          return Ta;
        default:
          return _("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function Bs(e, t) {
      var a = e.pendingLanes;
      if (a === X)
        return X;
      var i = X, o = e.suspendedLanes, s = e.pingedLanes, f = a & Vd;
      if (f !== X) {
        var v = f & ~o;
        if (v !== X)
          i = Eu(v);
        else {
          var m = f & s;
          m !== X && (i = Eu(m));
        }
      } else {
        var E = a & ~o;
        E !== X ? i = Eu(E) : s !== X && (i = Eu(s));
      }
      if (i === X)
        return X;
      if (t !== X && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & o) === X) {
        var b = In(i), L = In(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          b >= L || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          b === Va && (L & Bl) !== X
        )
          return t;
      }
      (i & il) !== X && (i |= a & Va);
      var M = e.entangledLanes;
      if (M !== X)
        for (var $ = e.entanglements, I = i & M; I > 0; ) {
          var G = Il(I), De = 1 << G;
          i |= $[G], I &= ~De;
        }
      return i;
    }
    function nf(e, t) {
      for (var a = e.eventTimes, i = dn; t > 0; ) {
        var o = Il(t), s = 1 << o, f = a[o];
        f > i && (i = f), t &= ~s;
      }
      return i;
    }
    function Fy(e, t) {
      switch (e) {
        case rt:
        case Di:
        case il:
          return t + 250;
        case An:
        case Va:
        case bo:
        case sa:
        case ca:
        case wo:
        case Ps:
        case js:
        case $c:
        case Ic:
        case Yc:
        case Wc:
        case Gc:
        case Qc:
        case qc:
        case Xc:
        case Ro:
        case Kc:
        case Su:
          return t + 5e3;
        case xo:
        case Fs:
        case Zc:
        case Jc:
        case ef:
          return dn;
        case Do:
        case Cu:
        case Vl:
        case Ta:
          return dn;
        default:
          return _("Should have found matching lanes. This is a bug in React."), dn;
      }
    }
    function Hy(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, o = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var v = Il(f), m = 1 << v, E = s[v];
        E === dn ? ((m & i) === X || (m & o) !== X) && (s[v] = Fy(m, t)) : E <= t && (e.expiredLanes |= m), f &= ~m;
      }
    }
    function By(e) {
      return Eu(e.pendingLanes);
    }
    function $l(e) {
      var t = e.pendingLanes & ~Ta;
      return t !== X ? t : t & Ta ? Ta : X;
    }
    function $d(e) {
      return (e & rt) !== X;
    }
    function Vs(e) {
      return (e & Vd) !== X;
    }
    function ih(e) {
      return (e & To) === e;
    }
    function lh(e) {
      var t = rt | il | Va;
      return (e & t) === X;
    }
    function oh(e) {
      return (e & Bl) === e;
    }
    function $s(e, t) {
      var a = Di | il | An | Va;
      return (t & a) !== X;
    }
    function uh(e, t) {
      return (t & e.expiredLanes) !== X;
    }
    function Id(e) {
      return (e & Bl) !== X;
    }
    function sh() {
      var e = tf;
      return tf <<= 1, (tf & Bl) === X && (tf = sa), e;
    }
    function fa() {
      var e = Hs;
      return Hs <<= 1, (Hs & To) === X && (Hs = xo), e;
    }
    function In(e) {
      return e & -e;
    }
    function _u(e) {
      return In(e);
    }
    function Il(e) {
      return 31 - Us(e);
    }
    function rf(e) {
      return Il(e);
    }
    function da(e, t) {
      return (e & t) !== X;
    }
    function Oo(e, t) {
      return (e & t) === t;
    }
    function mt(e, t) {
      return e | t;
    }
    function Is(e, t) {
      return e & ~t;
    }
    function af(e, t) {
      return e & t;
    }
    function Vy(e) {
      return e;
    }
    function ch(e, t) {
      return e !== $n && e < t ? e : t;
    }
    function Ys(e) {
      for (var t = [], a = 0; a < Vn; a++)
        t.push(e);
      return t;
    }
    function ko(e, t, a) {
      e.pendingLanes |= t, t !== Vl && (e.suspendedLanes = X, e.pingedLanes = X);
      var i = e.eventTimes, o = rf(t);
      i[o] = a;
    }
    function fh(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var o = Il(i), s = 1 << o;
        a[o] = dn, i &= ~s;
      }
    }
    function lf(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function of(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = X, e.pingedLanes = X, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, o = e.eventTimes, s = e.expirationTimes, f = a; f > 0; ) {
        var v = Il(f), m = 1 << v;
        i[v] = X, o[v] = dn, s[v] = dn, f &= ~m;
      }
    }
    function Yd(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, o = a; o; ) {
        var s = Il(o), f = 1 << s;
        // Is this one of the newly entangled lanes?
        f & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), o &= ~f;
      }
    }
    function dh(e, t) {
      var a = In(t), i;
      switch (a) {
        case il:
          i = Di;
          break;
        case Va:
          i = An;
          break;
        case sa:
        case ca:
        case wo:
        case Ps:
        case js:
        case $c:
        case Ic:
        case Yc:
        case Wc:
        case Gc:
        case Qc:
        case qc:
        case Xc:
        case Ro:
        case Kc:
        case Su:
        case xo:
        case Fs:
        case Zc:
        case Jc:
        case ef:
          i = bo;
          break;
        case Vl:
          i = Cu;
          break;
        default:
          i = $n;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== $n ? $n : i;
    }
    function uf(e, t, a) {
      if (Ra)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var o = rf(a), s = 1 << o, f = i[o];
          f.add(t), a &= ~s;
        }
    }
    function Wd(e, t) {
      if (Ra)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var o = rf(t), s = 1 << o, f = a[o];
          f.size > 0 && (f.forEach(function(v) {
            var m = v.alternate;
            (m === null || !i.has(m)) && i.add(v);
          }), f.clear()), t &= ~s;
        }
    }
    function Ws(e, t) {
      return null;
    }
    var Yn = rt, ll = il, Oi = Va, bu = Vl, wu = $n;
    function $a() {
      return wu;
    }
    function zn(e) {
      wu = e;
    }
    function Lr(e, t) {
      var a = wu;
      try {
        return wu = e, t();
      } finally {
        wu = a;
      }
    }
    function $y(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function Iy(e, t) {
      return e === 0 || e > t ? e : t;
    }
    function Ru(e, t) {
      return e !== 0 && e < t;
    }
    function Er(e) {
      var t = In(e);
      return Ru(Yn, t) ? Ru(ll, t) ? Vs(t) ? Oi : bu : ll : Yn;
    }
    function sf(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var Me;
    function Tu(e) {
      Me = e;
    }
    function Gd(e) {
      Me(e);
    }
    var cf;
    function Yy(e) {
      cf = e;
    }
    var xu;
    function ff(e) {
      xu = e;
    }
    var df;
    function ph(e) {
      df = e;
    }
    var Qd;
    function vh(e) {
      Qd = e;
    }
    var Gs = !1, Du = [], Cn = null, dr = null, Br = null, Ou = /* @__PURE__ */ new Map(), ku = /* @__PURE__ */ new Map(), pr = [], hh = [
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
      // Intentionally camelCase
      "copy",
      "cut",
      "paste",
      "click",
      "change",
      "contextmenu",
      "reset",
      "submit"
    ];
    function ki(e) {
      return hh.indexOf(e) > -1;
    }
    function Wy(e, t, a, i, o) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: a,
        nativeEvent: o,
        targetContainers: [i]
      };
    }
    function qd(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          Cn = null;
          break;
        case "dragenter":
        case "dragleave":
          dr = null;
          break;
        case "mouseover":
        case "mouseout":
          Br = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          Ou.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var i = t.pointerId;
          ku.delete(i);
          break;
        }
      }
    }
    function Mu(e, t, a, i, o, s) {
      if (e === null || e.nativeEvent !== s) {
        var f = Wy(t, a, i, o, s);
        if (t !== null) {
          var v = Hu(t);
          v !== null && cf(v);
        }
        return f;
      }
      e.eventSystemFlags |= i;
      var m = e.targetContainers;
      return o !== null && m.indexOf(o) === -1 && m.push(o), e;
    }
    function mh(e, t, a, i, o) {
      switch (t) {
        case "focusin": {
          var s = o;
          return Cn = Mu(Cn, e, t, a, i, s), !0;
        }
        case "dragenter": {
          var f = o;
          return dr = Mu(dr, e, t, a, i, f), !0;
        }
        case "mouseover": {
          var v = o;
          return Br = Mu(Br, e, t, a, i, v), !0;
        }
        case "pointerover": {
          var m = o, E = m.pointerId;
          return Ou.set(E, Mu(Ou.get(E) || null, e, t, a, i, m)), !0;
        }
        case "gotpointercapture": {
          var b = o, L = b.pointerId;
          return ku.set(L, Mu(ku.get(L) || null, e, t, a, i, b)), !0;
        }
      }
      return !1;
    }
    function Xd(e) {
      var t = ic(e.target);
      if (t !== null) {
        var a = Ul(t);
        if (a !== null) {
          var i = a.tag;
          if (i === Le) {
            var o = Uc(a);
            if (o !== null) {
              e.blockedOn = o, Qd(e.priority, function() {
                xu(a);
              });
              return;
            }
          } else if (i === re) {
            var s = a.stateNode;
            if (sf(s)) {
              e.blockedOn = Pc(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function Gy(e) {
      for (var t = df(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < pr.length && Ru(t, pr[i].priority); i++)
        ;
      pr.splice(i, 0, a), i === 0 && Xd(a);
    }
    function Mo(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = Ar(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var o = e.nativeEvent, s = new o.constructor(o.type, o);
          zy(s), o.target.dispatchEvent(s), Bv();
        } else {
          var f = Hu(i);
          return f !== null && cf(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function pf(e, t, a) {
      Mo(e) && a.delete(t);
    }
    function Ia() {
      Gs = !1, Cn !== null && Mo(Cn) && (Cn = null), dr !== null && Mo(dr) && (dr = null), Br !== null && Mo(Br) && (Br = null), Ou.forEach(pf), ku.forEach(pf);
    }
    function kt(e, t) {
      e.blockedOn === t && (e.blockedOn = null, Gs || (Gs = !0, h.unstable_scheduleCallback(h.unstable_NormalPriority, Ia)));
    }
    function Un(e) {
      if (Du.length > 0) {
        kt(Du[0], e);
        for (var t = 1; t < Du.length; t++) {
          var a = Du[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      Cn !== null && kt(Cn, e), dr !== null && kt(dr, e), Br !== null && kt(Br, e);
      var i = function(v) {
        return kt(v, e);
      };
      Ou.forEach(i), ku.forEach(i);
      for (var o = 0; o < pr.length; o++) {
        var s = pr[o];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; pr.length > 0; ) {
        var f = pr[0];
        if (f.blockedOn !== null)
          break;
        Xd(f), f.blockedOn === null && pr.shift();
      }
    }
    var mn = C.ReactCurrentBatchConfig, rr = !0;
    function pa(e) {
      rr = !!e;
    }
    function Nu() {
      return rr;
    }
    function ar(e, t, a) {
      var i = vf(t), o;
      switch (i) {
        case Yn:
          o = Qs;
          break;
        case ll:
          o = No;
          break;
        case Oi:
        default:
          o = Lu;
          break;
      }
      return o.bind(null, t, a, e);
    }
    function Qs(e, t, a, i) {
      var o = $a(), s = mn.transition;
      mn.transition = null;
      try {
        zn(Yn), Lu(e, t, a, i);
      } finally {
        zn(o), mn.transition = s;
      }
    }
    function No(e, t, a, i) {
      var o = $a(), s = mn.transition;
      mn.transition = null;
      try {
        zn(ll), Lu(e, t, a, i);
      } finally {
        zn(o), mn.transition = s;
      }
    }
    function Lu(e, t, a, i) {
      rr && Kd(e, t, a, i);
    }
    function Kd(e, t, a, i) {
      var o = Ar(e, t, a, i);
      if (o === null) {
        cg(e, t, i, Yl, a), qd(e, i);
        return;
      }
      if (mh(o, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (qd(e, i), t & ws && ki(e)) {
        for (; o !== null; ) {
          var s = Hu(o);
          s !== null && Gd(s);
          var f = Ar(e, t, a, i);
          if (f === null && cg(e, t, i, Yl, a), f === o)
            break;
          o = f;
        }
        o !== null && i.stopPropagation();
        return;
      }
      cg(e, t, i, null, a);
    }
    var Yl = null;
    function Ar(e, t, a, i) {
      Yl = null;
      var o = an(i), s = ic(o);
      if (s !== null) {
        var f = Ul(s);
        if (f === null)
          s = null;
        else {
          var v = f.tag;
          if (v === Le) {
            var m = Uc(f);
            if (m !== null)
              return m;
            s = null;
          } else if (v === re) {
            var E = f.stateNode;
            if (sf(E))
              return Pc(f);
            s = null;
          } else
            f !== s && (s = null);
        }
      }
      return Yl = s, null;
    }
    function vf(e) {
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
          return Yn;
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
          return ll;
        case "message": {
          var t = jy();
          switch (t) {
            case ua:
              return Yn;
            case du:
              return ll;
            case Ti:
            case pu:
              return Oi;
            case Ms:
              return bu;
            default:
              return Oi;
          }
        }
        default:
          return Oi;
      }
    }
    function Au(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function ol(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function hf(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function Zd(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var Ya = null, zu = null, Wa = null;
    function mf(e) {
      return Ya = e, zu = Xs(), !0;
    }
    function qs() {
      Ya = null, zu = null, Wa = null;
    }
    function yf() {
      if (Wa)
        return Wa;
      var e, t = zu, a = t.length, i, o = Xs(), s = o.length;
      for (e = 0; e < a && t[e] === o[e]; e++)
        ;
      var f = a - e;
      for (i = 1; i <= f && t[a - i] === o[s - i]; i++)
        ;
      var v = i > 1 ? 1 - i : void 0;
      return Wa = o.slice(e, v), Wa;
    }
    function Xs() {
      return "value" in Ya ? Ya.value : Ya.textContent;
    }
    function Lo(e) {
      var t, a = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && a === 13 && (t = 13)) : t = a, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function vr() {
      return !0;
    }
    function ul() {
      return !1;
    }
    function On(e) {
      function t(a, i, o, s, f) {
        this._reactName = a, this._targetInst = o, this.type = i, this.nativeEvent = s, this.target = f, this.currentTarget = null;
        for (var v in e)
          if (e.hasOwnProperty(v)) {
            var m = e[v];
            m ? this[v] = m(s) : this[v] = s[v];
          }
        var E = s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1;
        return E ? this.isDefaultPrevented = vr : this.isDefaultPrevented = ul, this.isPropagationStopped = ul, this;
      }
      return _t(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = vr);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = vr);
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
        isPersistent: vr
      }), t;
    }
    var ir = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, gf = On(ir), Ao = _t({}, ir, {
      view: 0,
      detail: 0
    }), Jd = On(Ao), ep, Mi, Uu;
    function tp(e) {
      e !== Uu && (Uu && e.type === "mousemove" ? (ep = e.screenX - Uu.screenX, Mi = e.screenY - Uu.screenY) : (ep = 0, Mi = 0), Uu = e);
    }
    var Ni = _t({}, Ao, {
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
      getModifierState: np,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (tp(e), ep);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Mi;
      }
    }), Sf = On(Ni), zo = _t({}, Ni, {
      dataTransfer: 0
    }), yh = On(zo), gh = _t({}, Ao, {
      relatedTarget: 0
    }), Ks = On(gh), Cf = _t({}, ir, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Qy = On(Cf), qy = _t({}, ir, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), Sh = On(qy), Ch = _t({}, ir, {
      data: 0
    }), Wl = On(Ch), Xy = Wl, Pu = {
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
    }, Eh = {
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
    function Pn(e) {
      if (e.key) {
        var t = Pu[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = Lo(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? Eh[e.keyCode] || "Unidentified" : "";
    }
    var Ky = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function _h(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = Ky[e];
      return i ? !!a[i] : !1;
    }
    function np(e) {
      return _h;
    }
    var Zy = _t({}, Ao, {
      key: Pn,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: np,
      // Legacy Interface
      charCode: function(e) {
        return e.type === "keypress" ? Lo(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? Lo(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), bh = On(Zy), wh = _t({}, Ni, {
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
    }), Rh = On(wh), Ga = _t({}, Ao, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: np
    }), rp = On(Ga), Jy = _t({}, ir, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Gl = On(Jy), Ef = _t({}, Ni, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : (
          // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
          "wheelDeltaX" in e ? -e.wheelDeltaX : 0
        );
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : (
          // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
          "wheelDeltaY" in e ? -e.wheelDeltaY : (
            // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
            "wheelDelta" in e ? -e.wheelDelta : 0
          )
        );
      },
      deltaZ: 0,
      // Browsers without "deltaMode" is reporting in raw wheel delta where one
      // notch on the scroll is always +/- 120, roughly equivalent to pixels.
      // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
      // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
      deltaMode: 0
    }), Uo = On(Ef), _f = [9, 13, 27, 32], bf = 229, Zs = Sn && "CompositionEvent" in window, Js = null;
    Sn && "documentMode" in document && (Js = document.documentMode);
    var ap = Sn && "TextEvent" in window && !Js, Th = Sn && (!Zs || Js && Js > 8 && Js <= 11), ip = 32, lp = String.fromCharCode(ip);
    function wf() {
      Fn("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), Fn("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), Fn("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), Fn("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var ec = !1;
    function xh(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function op(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function eg(e, t) {
      return e === "keydown" && t.keyCode === bf;
    }
    function up(e, t) {
      switch (e) {
        case "keyup":
          return _f.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== bf;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function Rf(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function tc(e) {
      return e.locale === "ko";
    }
    var Ql = !1;
    function Tf(e, t, a, i, o) {
      var s, f;
      if (Zs ? s = op(t) : Ql ? up(t, i) && (s = "onCompositionEnd") : eg(t, i) && (s = "onCompositionStart"), !s)
        return null;
      Th && !tc(i) && (!Ql && s === "onCompositionStart" ? Ql = mf(o) : s === "onCompositionEnd" && Ql && (f = yf()));
      var v = Lh(a, s);
      if (v.length > 0) {
        var m = new Wl(s, t, null, i, o);
        if (e.push({
          event: m,
          listeners: v
        }), f)
          m.data = f;
        else {
          var E = Rf(i);
          E !== null && (m.data = E);
        }
      }
    }
    function Dh(e, t) {
      switch (e) {
        case "compositionend":
          return Rf(t);
        case "keypress":
          var a = t.which;
          return a !== ip ? null : (ec = !0, lp);
        case "textInput":
          var i = t.data;
          return i === lp && ec ? null : i;
        default:
          return null;
      }
    }
    function tg(e, t) {
      if (Ql) {
        if (e === "compositionend" || !Zs && up(e, t)) {
          var a = yf();
          return qs(), Ql = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!xh(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return Th && !tc(t) ? null : t.data;
        default:
          return null;
      }
    }
    function xf(e, t, a, i, o) {
      var s;
      if (ap ? s = Dh(t, i) : s = tg(t, i), !s)
        return null;
      var f = Lh(a, "onBeforeInput");
      if (f.length > 0) {
        var v = new Xy("onBeforeInput", "beforeinput", null, i, o);
        e.push({
          event: v,
          listeners: f
        }), v.data = s;
      }
    }
    function ng(e, t, a, i, o, s, f) {
      Tf(e, t, a, i, o), xf(e, t, a, i, o);
    }
    var nc = {
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
    function Oh(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!nc[e.type] : t === "textarea";
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
    function Df(e) {
      if (!Sn)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function n() {
      Fn("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function r(e, t, a, i) {
      su(i);
      var o = Lh(t, "onChange");
      if (o.length > 0) {
        var s = new gf("onChange", "change", null, a, i);
        e.push({
          event: s,
          listeners: o
        });
      }
    }
    var l = null, u = null;
    function c(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function p(e) {
      var t = [];
      r(t, u, e, an(e)), Ts(S, t);
    }
    function S(e) {
      MC(e, 0);
    }
    function R(e) {
      var t = Af(e);
      if (nu(t))
        return e;
    }
    function k(e, t) {
      if (e === "change")
        return t;
    }
    var Y = !1;
    Sn && (Y = Df("input") && (!document.documentMode || document.documentMode > 9));
    function ie(e, t) {
      l = e, u = t, l.attachEvent("onpropertychange", te);
    }
    function le() {
      l && (l.detachEvent("onpropertychange", te), l = null, u = null);
    }
    function te(e) {
      e.propertyName === "value" && R(u) && p(e);
    }
    function Re(e, t, a) {
      e === "focusin" ? (le(), ie(t, a)) : e === "focusout" && le();
    }
    function Ae(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return R(u);
    }
    function He(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function Wn(e, t) {
      if (e === "click")
        return R(t);
    }
    function j(e, t) {
      if (e === "input" || e === "change")
        return R(t);
    }
    function N(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || lt(e, "number", e.value);
    }
    function B(e, t, a, i, o, s, f) {
      var v = a ? Af(a) : window, m, E;
      if (c(v) ? m = k : Oh(v) ? Y ? m = j : (m = Ae, E = Re) : He(v) && (m = Wn), m) {
        var b = m(t, a);
        if (b) {
          r(e, b, i, o);
          return;
        }
      }
      E && E(t, v, a), t === "focusout" && N(v);
    }
    function pe() {
      tr("onMouseEnter", ["mouseout", "mouseover"]), tr("onMouseLeave", ["mouseout", "mouseover"]), tr("onPointerEnter", ["pointerout", "pointerover"]), tr("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function Ie(e, t, a, i, o, s, f) {
      var v = t === "mouseover" || t === "pointerover", m = t === "mouseout" || t === "pointerout";
      if (v && !Vv(i)) {
        var E = i.relatedTarget || i.fromElement;
        if (E && (ic(E) || _p(E)))
          return;
      }
      if (!(!m && !v)) {
        var b;
        if (o.window === o)
          b = o;
        else {
          var L = o.ownerDocument;
          L ? b = L.defaultView || L.parentWindow : b = window;
        }
        var M, $;
        if (m) {
          var I = i.relatedTarget || i.toElement;
          if (M = a, $ = I ? ic(I) : null, $ !== null) {
            var G = Ul($);
            ($ !== G || $.tag !== ce && $.tag !== be) && ($ = null);
          }
        } else
          M = null, $ = a;
        if (M !== $) {
          var De = Sf, et = "onMouseLeave", We = "onMouseEnter", Ut = "mouse";
          (t === "pointerout" || t === "pointerover") && (De = Rh, et = "onPointerLeave", We = "onPointerEnter", Ut = "pointer");
          var Mt = M == null ? b : Af(M), F = $ == null ? b : Af($), Q = new De(et, Ut + "leave", M, i, o);
          Q.target = Mt, Q.relatedTarget = F;
          var H = null, oe = ic(o);
          if (oe === a) {
            var Oe = new De(We, Ut + "enter", $, i, o);
            Oe.target = F, Oe.relatedTarget = Mt, H = Oe;
          }
          B1(e, Q, H, M, $);
        }
      }
    }
    function at(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var ze = typeof Object.is == "function" ? Object.is : at;
    function it(e, t) {
      if (ze(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var o = 0; o < a.length; o++) {
        var s = a[o];
        if (!Hn.call(t, s) || !ze(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function lr(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function $t(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function sl(e, t) {
      for (var a = lr(e), i = 0, o = 0; a; ) {
        if (a.nodeType === Ki) {
          if (o = i + a.textContent.length, i <= t && o >= t)
            return {
              node: a,
              offset: t - i
            };
          i = o;
        }
        a = lr($t(a));
      }
    }
    function rg(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var o = i.anchorNode, s = i.anchorOffset, f = i.focusNode, v = i.focusOffset;
      try {
        o.nodeType, f.nodeType;
      } catch {
        return null;
      }
      return E1(e, o, s, f, v);
    }
    function E1(e, t, a, i, o) {
      var s = 0, f = -1, v = -1, m = 0, E = 0, b = e, L = null;
      e:
        for (; ; ) {
          for (var M = null; b === t && (a === 0 || b.nodeType === Ki) && (f = s + a), b === i && (o === 0 || b.nodeType === Ki) && (v = s + o), b.nodeType === Ki && (s += b.nodeValue.length), (M = b.firstChild) !== null; )
            L = b, b = M;
          for (; ; ) {
            if (b === e)
              break e;
            if (L === t && ++m === a && (f = s), L === i && ++E === o && (v = s), (M = b.nextSibling) !== null)
              break;
            b = L, L = b.parentNode;
          }
          b = M;
        }
      return f === -1 || v === -1 ? null : {
        start: f,
        end: v
      };
    }
    function _1(e, t) {
      var a = e.ownerDocument || document, i = a && a.defaultView || window;
      if (i.getSelection) {
        var o = i.getSelection(), s = e.textContent.length, f = Math.min(t.start, s), v = t.end === void 0 ? f : Math.min(t.end, s);
        if (!o.extend && f > v) {
          var m = v;
          v = f, f = m;
        }
        var E = sl(e, f), b = sl(e, v);
        if (E && b) {
          if (o.rangeCount === 1 && o.anchorNode === E.node && o.anchorOffset === E.offset && o.focusNode === b.node && o.focusOffset === b.offset)
            return;
          var L = a.createRange();
          L.setStart(E.node, E.offset), o.removeAllRanges(), f > v ? (o.addRange(L), o.extend(b.node, b.offset)) : (L.setEnd(b.node, b.offset), o.addRange(L));
        }
      }
    }
    function SC(e) {
      return e && e.nodeType === Ki;
    }
    function CC(e, t) {
      return !e || !t ? !1 : e === t ? !0 : SC(e) ? !1 : SC(t) ? CC(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function b1(e) {
      return e && e.ownerDocument && CC(e.ownerDocument.documentElement, e);
    }
    function w1(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function EC() {
      for (var e = window, t = Ei(); t instanceof e.HTMLIFrameElement; ) {
        if (w1(t))
          e = t.contentWindow;
        else
          return t;
        t = Ei(e.document);
      }
      return t;
    }
    function ag(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function R1() {
      var e = EC();
      return {
        focusedElem: e,
        selectionRange: ag(e) ? x1(e) : null
      };
    }
    function T1(e) {
      var t = EC(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && b1(a)) {
        i !== null && ag(a) && D1(a, i);
        for (var o = [], s = a; s = s.parentNode; )
          s.nodeType === ra && o.push({
            element: s,
            left: s.scrollLeft,
            top: s.scrollTop
          });
        typeof a.focus == "function" && a.focus();
        for (var f = 0; f < o.length; f++) {
          var v = o[f];
          v.element.scrollLeft = v.left, v.element.scrollTop = v.top;
        }
      }
    }
    function x1(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = rg(e), t || {
        start: 0,
        end: 0
      };
    }
    function D1(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : _1(e, t);
    }
    var O1 = Sn && "documentMode" in document && document.documentMode <= 11;
    function k1() {
      Fn("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var Of = null, ig = null, sp = null, lg = !1;
    function M1(e) {
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
    function N1(e) {
      return e.window === e ? e.document : e.nodeType === Ca ? e : e.ownerDocument;
    }
    function _C(e, t, a) {
      var i = N1(a);
      if (!(lg || Of == null || Of !== Ei(i))) {
        var o = M1(Of);
        if (!sp || !it(sp, o)) {
          sp = o;
          var s = Lh(ig, "onSelect");
          if (s.length > 0) {
            var f = new gf("onSelect", "select", null, t, a);
            e.push({
              event: f,
              listeners: s
            }), f.target = Of;
          }
        }
      }
    }
    function L1(e, t, a, i, o, s, f) {
      var v = a ? Af(a) : window;
      switch (t) {
        case "focusin":
          (Oh(v) || v.contentEditable === "true") && (Of = v, ig = a, sp = null);
          break;
        case "focusout":
          Of = null, ig = null, sp = null;
          break;
        case "mousedown":
          lg = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          lg = !1, _C(e, i, o);
          break;
        case "selectionchange":
          if (O1)
            break;
        case "keydown":
        case "keyup":
          _C(e, i, o);
      }
    }
    function kh(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var kf = {
      animationend: kh("Animation", "AnimationEnd"),
      animationiteration: kh("Animation", "AnimationIteration"),
      animationstart: kh("Animation", "AnimationStart"),
      transitionend: kh("Transition", "TransitionEnd")
    }, og = {}, bC = {};
    Sn && (bC = document.createElement("div").style, "AnimationEvent" in window || (delete kf.animationend.animation, delete kf.animationiteration.animation, delete kf.animationstart.animation), "TransitionEvent" in window || delete kf.transitionend.transition);
    function Mh(e) {
      if (og[e])
        return og[e];
      if (!kf[e])
        return e;
      var t = kf[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in bC)
          return og[e] = t[a];
      return e;
    }
    var wC = Mh("animationend"), RC = Mh("animationiteration"), TC = Mh("animationstart"), xC = Mh("transitionend"), DC = /* @__PURE__ */ new Map(), OC = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function ju(e, t) {
      DC.set(e, t), Fn(t, [e]);
    }
    function A1() {
      for (var e = 0; e < OC.length; e++) {
        var t = OC[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        ju(a, "on" + i);
      }
      ju(wC, "onAnimationEnd"), ju(RC, "onAnimationIteration"), ju(TC, "onAnimationStart"), ju("dblclick", "onDoubleClick"), ju("focusin", "onFocus"), ju("focusout", "onBlur"), ju(xC, "onTransitionEnd");
    }
    function z1(e, t, a, i, o, s, f) {
      var v = DC.get(t);
      if (v !== void 0) {
        var m = gf, E = t;
        switch (t) {
          case "keypress":
            if (Lo(i) === 0)
              return;
          case "keydown":
          case "keyup":
            m = bh;
            break;
          case "focusin":
            E = "focus", m = Ks;
            break;
          case "focusout":
            E = "blur", m = Ks;
            break;
          case "beforeblur":
          case "afterblur":
            m = Ks;
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
            m = Sf;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            m = yh;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            m = rp;
            break;
          case wC:
          case RC:
          case TC:
            m = Qy;
            break;
          case xC:
            m = Gl;
            break;
          case "scroll":
            m = Jd;
            break;
          case "wheel":
            m = Uo;
            break;
          case "copy":
          case "cut":
          case "paste":
            m = Sh;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            m = Rh;
            break;
        }
        var b = (s & ws) !== 0;
        {
          var L = !b && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", M = F1(a, v, i.type, b, L);
          if (M.length > 0) {
            var $ = new m(v, E, null, i, o);
            e.push({
              event: $,
              listeners: M
            });
          }
        }
      }
    }
    A1(), pe(), n(), k1(), wf();
    function U1(e, t, a, i, o, s, f) {
      z1(e, t, a, i, o, s);
      var v = (s & Ay) === 0;
      v && (Ie(e, t, a, i, o), B(e, t, a, i, o), L1(e, t, a, i, o), ng(e, t, a, i, o));
    }
    var cp = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], ug = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(cp));
    function kC(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Od(i, t, void 0, e), e.currentTarget = null;
    }
    function P1(e, t, a) {
      var i;
      if (a)
        for (var o = t.length - 1; o >= 0; o--) {
          var s = t[o], f = s.instance, v = s.currentTarget, m = s.listener;
          if (f !== i && e.isPropagationStopped())
            return;
          kC(e, m, v), i = f;
        }
      else
        for (var E = 0; E < t.length; E++) {
          var b = t[E], L = b.instance, M = b.currentTarget, $ = b.listener;
          if (L !== i && e.isPropagationStopped())
            return;
          kC(e, $, M), i = L;
        }
    }
    function MC(e, t) {
      for (var a = (t & ws) !== 0, i = 0; i < e.length; i++) {
        var o = e[i], s = o.event, f = o.listeners;
        P1(s, f, a);
      }
      Uy();
    }
    function j1(e, t, a, i, o) {
      var s = an(a), f = [];
      U1(f, e, i, a, s, t), MC(f, t);
    }
    function kn(e, t) {
      ug.has(e) || _('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = vR(t), o = V1(e, a);
      i.has(o) || (NC(t, e, bs, a), i.add(o));
    }
    function sg(e, t, a) {
      ug.has(e) && !t && _('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= ws), NC(a, e, i, t);
    }
    var Nh = "_reactListening" + Math.random().toString(36).slice(2);
    function fp(e) {
      if (!e[Nh]) {
        e[Nh] = !0, rn.forEach(function(a) {
          a !== "selectionchange" && (ug.has(a) || sg(a, !1, e), sg(a, !0, e));
        });
        var t = e.nodeType === Ca ? e : e.ownerDocument;
        t !== null && (t[Nh] || (t[Nh] = !0, sg("selectionchange", !1, t)));
      }
    }
    function NC(e, t, a, i, o) {
      var s = ar(e, t, a), f = void 0;
      xs && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? hf(e, t, s, f) : ol(e, t, s) : f !== void 0 ? Zd(e, t, s, f) : Au(e, t, s);
    }
    function LC(e, t) {
      return e === t || e.nodeType === Nn && e.parentNode === t;
    }
    function cg(e, t, a, i, o) {
      var s = i;
      if (!(t & Mc) && !(t & bs)) {
        var f = o;
        if (i !== null) {
          var v = i;
          e:
            for (; ; ) {
              if (v === null)
                return;
              var m = v.tag;
              if (m === re || m === Ne) {
                var E = v.stateNode.containerInfo;
                if (LC(E, f))
                  break;
                if (m === Ne)
                  for (var b = v.return; b !== null; ) {
                    var L = b.tag;
                    if (L === re || L === Ne) {
                      var M = b.stateNode.containerInfo;
                      if (LC(M, f))
                        return;
                    }
                    b = b.return;
                  }
                for (; E !== null; ) {
                  var $ = ic(E);
                  if ($ === null)
                    return;
                  var I = $.tag;
                  if (I === ce || I === be) {
                    v = s = $;
                    continue e;
                  }
                  E = E.parentNode;
                }
              }
              v = v.return;
            }
        }
      }
      Ts(function() {
        return j1(e, t, a, s);
      });
    }
    function dp(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function F1(e, t, a, i, o, s) {
      for (var f = t !== null ? t + "Capture" : null, v = i ? f : t, m = [], E = e, b = null; E !== null; ) {
        var L = E, M = L.stateNode, $ = L.tag;
        if ($ === ce && M !== null && (b = M, v !== null)) {
          var I = yo(E, v);
          I != null && m.push(dp(E, I, b));
        }
        if (o)
          break;
        E = E.return;
      }
      return m;
    }
    function Lh(e, t) {
      for (var a = t + "Capture", i = [], o = e; o !== null; ) {
        var s = o, f = s.stateNode, v = s.tag;
        if (v === ce && f !== null) {
          var m = f, E = yo(o, a);
          E != null && i.unshift(dp(o, E, m));
          var b = yo(o, t);
          b != null && i.push(dp(o, b, m));
        }
        o = o.return;
      }
      return i;
    }
    function Mf(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== ce);
      return e || null;
    }
    function H1(e, t) {
      for (var a = e, i = t, o = 0, s = a; s; s = Mf(s))
        o++;
      for (var f = 0, v = i; v; v = Mf(v))
        f++;
      for (; o - f > 0; )
        a = Mf(a), o--;
      for (; f - o > 0; )
        i = Mf(i), f--;
      for (var m = o; m--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = Mf(a), i = Mf(i);
      }
      return null;
    }
    function AC(e, t, a, i, o) {
      for (var s = t._reactName, f = [], v = a; v !== null && v !== i; ) {
        var m = v, E = m.alternate, b = m.stateNode, L = m.tag;
        if (E !== null && E === i)
          break;
        if (L === ce && b !== null) {
          var M = b;
          if (o) {
            var $ = yo(v, s);
            $ != null && f.unshift(dp(v, $, M));
          } else if (!o) {
            var I = yo(v, s);
            I != null && f.push(dp(v, I, M));
          }
        }
        v = v.return;
      }
      f.length !== 0 && e.push({
        event: t,
        listeners: f
      });
    }
    function B1(e, t, a, i, o) {
      var s = i && o ? H1(i, o) : null;
      i !== null && AC(e, t, i, s, !1), o !== null && a !== null && AC(e, a, o, s, !0);
    }
    function V1(e, t) {
      return e + "__" + (t ? "capture" : "bubble");
    }
    var Qa = !1, pp = "dangerouslySetInnerHTML", Ah = "suppressContentEditableWarning", Fu = "suppressHydrationWarning", zC = "autoFocus", rc = "children", ac = "style", zh = "__html", fg, Uh, vp, UC, Ph, PC, jC;
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
      uu(e, t), Uv(e, t), Nl(e, t, {
        registrationNameDependencies: Jt,
        possibleRegistrationNames: qn
      });
    }, PC = Sn && !document.documentMode, vp = function(e, t, a) {
      if (!Qa) {
        var i = jh(a), o = jh(t);
        o !== i && (Qa = !0, _("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(o), JSON.stringify(i)));
      }
    }, UC = function(e) {
      if (!Qa) {
        Qa = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), _("Extra attributes from the server: %s", t);
      }
    }, Ph = function(e, t) {
      t === !1 ? _("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : _("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, jC = function(e, t) {
      var a = e.namespaceURI === Xi ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var $1 = /\r\n?/g, I1 = /\u0000|\uFFFD/g;
    function jh(e) {
      Ur(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace($1, `
`).replace(I1, "");
    }
    function Fh(e, t, a, i) {
      var o = jh(t), s = jh(e);
      if (s !== o && (i && (Qa || (Qa = !0, _('Text content did not match. Server: "%s" Client: "%s"', s, o))), a && K))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function FC(e) {
      return e.nodeType === Ca ? e : e.ownerDocument;
    }
    function Y1() {
    }
    function Hh(e) {
      e.onclick = Y1;
    }
    function W1(e, t, a, i, o) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var f = i[s];
          if (s === ac)
            f && Object.freeze(f), kv(t, f);
          else if (s === pp) {
            var v = f ? f[zh] : void 0;
            v != null && Ev(t, v);
          } else if (s === rc)
            if (typeof f == "string") {
              var m = e !== "textarea" || f !== "";
              m && ys(t, f);
            } else
              typeof f == "number" && ys(t, "" + f);
          else
            s === Ah || s === Fu || s === zC || (Jt.hasOwnProperty(s) ? f != null && (typeof f != "function" && Ph(s, f), s === "onScroll" && kn("scroll", t)) : f != null && Vi(t, s, f, o));
        }
    }
    function G1(e, t, a, i) {
      for (var o = 0; o < t.length; o += 2) {
        var s = t[o], f = t[o + 1];
        s === ac ? kv(e, f) : s === pp ? Ev(e, f) : s === rc ? ys(e, f) : Vi(e, s, f, i);
      }
    }
    function Q1(e, t, a, i) {
      var o, s = FC(a), f, v = i;
      if (v === Xi && (v = fd(e)), v === Xi) {
        if (o = vo(e, t), !o && e !== e.toLowerCase() && _("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
          var m = s.createElement("div");
          m.innerHTML = "<script><\/script>";
          var E = m.firstChild;
          f = m.removeChild(E);
        } else if (typeof t.is == "string")
          f = s.createElement(e, {
            is: t.is
          });
        else if (f = s.createElement(e), e === "select") {
          var b = f;
          t.multiple ? b.multiple = !0 : t.size && (b.size = t.size);
        }
      } else
        f = s.createElementNS(v, e);
      return v === Xi && !o && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !Hn.call(fg, e) && (fg[e] = !0, _("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
    }
    function q1(e, t) {
      return FC(t).createTextNode(e);
    }
    function X1(e, t, a, i) {
      var o = vo(t, a);
      Uh(t, a);
      var s;
      switch (t) {
        case "dialog":
          kn("cancel", e), kn("close", e), s = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          kn("load", e), s = a;
          break;
        case "video":
        case "audio":
          for (var f = 0; f < cp.length; f++)
            kn(cp[f], e);
          s = a;
          break;
        case "source":
          kn("error", e), s = a;
          break;
        case "img":
        case "image":
        case "link":
          kn("error", e), kn("load", e), s = a;
          break;
        case "details":
          kn("toggle", e), s = a;
          break;
        case "input":
          T(e, a), s = y(e, a), kn("invalid", e);
          break;
        case "option":
          qt(e, a), s = a;
          break;
        case "select":
          ms(e, a), s = hs(e, a), kn("invalid", e);
          break;
        case "textarea":
          Sv(e, a), s = cd(e, a), kn("invalid", e);
          break;
        default:
          s = a;
      }
      switch (Cs(t, s), W1(t, e, i, s, o), t) {
        case "input":
          Gi(e), de(e, a, !1);
          break;
        case "textarea":
          Gi(e), wc(e);
          break;
        case "option":
          Xt(e, a);
          break;
        case "select":
          sd(e, a);
          break;
        default:
          typeof s.onClick == "function" && Hh(e);
          break;
      }
    }
    function K1(e, t, a, i, o) {
      Uh(t, i);
      var s = null, f, v;
      switch (t) {
        case "input":
          f = y(e, a), v = y(e, i), s = [];
          break;
        case "select":
          f = hs(e, a), v = hs(e, i), s = [];
          break;
        case "textarea":
          f = cd(e, a), v = cd(e, i), s = [];
          break;
        default:
          f = a, v = i, typeof f.onClick != "function" && typeof v.onClick == "function" && Hh(e);
          break;
      }
      Cs(t, v);
      var m, E, b = null;
      for (m in f)
        if (!(v.hasOwnProperty(m) || !f.hasOwnProperty(m) || f[m] == null))
          if (m === ac) {
            var L = f[m];
            for (E in L)
              L.hasOwnProperty(E) && (b || (b = {}), b[E] = "");
          } else
            m === pp || m === rc || m === Ah || m === Fu || m === zC || (Jt.hasOwnProperty(m) ? s || (s = []) : (s = s || []).push(m, null));
      for (m in v) {
        var M = v[m], $ = f?.[m];
        if (!(!v.hasOwnProperty(m) || M === $ || M == null && $ == null))
          if (m === ac)
            if (M && Object.freeze(M), $) {
              for (E in $)
                $.hasOwnProperty(E) && (!M || !M.hasOwnProperty(E)) && (b || (b = {}), b[E] = "");
              for (E in M)
                M.hasOwnProperty(E) && $[E] !== M[E] && (b || (b = {}), b[E] = M[E]);
            } else
              b || (s || (s = []), s.push(m, b)), b = M;
          else if (m === pp) {
            var I = M ? M[zh] : void 0, G = $ ? $[zh] : void 0;
            I != null && G !== I && (s = s || []).push(m, I);
          } else
            m === rc ? (typeof M == "string" || typeof M == "number") && (s = s || []).push(m, "" + M) : m === Ah || m === Fu || (Jt.hasOwnProperty(m) ? (M != null && (typeof M != "function" && Ph(m, M), m === "onScroll" && kn("scroll", e)), !s && $ !== M && (s = [])) : (s = s || []).push(m, M));
      }
      return b && (Mv(b, v[ac]), (s = s || []).push(ac, b)), s;
    }
    function Z1(e, t, a, i, o) {
      a === "input" && o.type === "radio" && o.name != null && V(e, o);
      var s = vo(a, i), f = vo(a, o);
      switch (G1(e, t, s, f), a) {
        case "input":
          W(e, o);
          break;
        case "textarea":
          Cv(e, o);
          break;
        case "select":
          by(e, o);
          break;
      }
    }
    function J1(e) {
      {
        var t = e.toLowerCase();
        return Dc.hasOwnProperty(t) && Dc[t] || null;
      }
    }
    function ew(e, t, a, i, o, s, f) {
      var v, m;
      switch (v = vo(t, a), Uh(t, a), t) {
        case "dialog":
          kn("cancel", e), kn("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          kn("load", e);
          break;
        case "video":
        case "audio":
          for (var E = 0; E < cp.length; E++)
            kn(cp[E], e);
          break;
        case "source":
          kn("error", e);
          break;
        case "img":
        case "image":
        case "link":
          kn("error", e), kn("load", e);
          break;
        case "details":
          kn("toggle", e);
          break;
        case "input":
          T(e, a), kn("invalid", e);
          break;
        case "option":
          qt(e, a);
          break;
        case "select":
          ms(e, a), kn("invalid", e);
          break;
        case "textarea":
          Sv(e, a), kn("invalid", e);
          break;
      }
      Cs(t, a);
      {
        m = /* @__PURE__ */ new Set();
        for (var b = e.attributes, L = 0; L < b.length; L++) {
          var M = b[L].name.toLowerCase();
          switch (M) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              m.add(b[L].name);
          }
        }
      }
      var $ = null;
      for (var I in a)
        if (a.hasOwnProperty(I)) {
          var G = a[I];
          if (I === rc)
            typeof G == "string" ? e.textContent !== G && (a[Fu] !== !0 && Fh(e.textContent, G, s, f), $ = [rc, G]) : typeof G == "number" && e.textContent !== "" + G && (a[Fu] !== !0 && Fh(e.textContent, G, s, f), $ = [rc, "" + G]);
          else if (Jt.hasOwnProperty(I))
            G != null && (typeof G != "function" && Ph(I, G), I === "onScroll" && kn("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof v == "boolean") {
            var De = void 0, et = v && tt ? null : ye(I);
            if (a[Fu] !== !0) {
              if (!(I === Ah || I === Fu || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              I === "value" || I === "checked" || I === "selected")) {
                if (I === pp) {
                  var We = e.innerHTML, Ut = G ? G[zh] : void 0;
                  if (Ut != null) {
                    var Mt = jC(e, Ut);
                    Mt !== We && vp(I, We, Mt);
                  }
                } else if (I === ac) {
                  if (m.delete(I), PC) {
                    var F = Ly(G);
                    De = e.getAttribute("style"), F !== De && vp(I, De, F);
                  }
                } else if (v && !tt)
                  m.delete(I.toLowerCase()), De = Na(e, I, G), G !== De && vp(I, De, G);
                else if (!Be(I, et, v) && !ue(I, G, et, v)) {
                  var Q = !1;
                  if (et !== null)
                    m.delete(et.attributeName), De = ri(e, I, G, et);
                  else {
                    var H = i;
                    if (H === Xi && (H = fd(t)), H === Xi)
                      m.delete(I.toLowerCase());
                    else {
                      var oe = J1(I);
                      oe !== null && oe !== I && (Q = !0, m.delete(oe)), m.delete(I);
                    }
                    De = Na(e, I, G);
                  }
                  var Oe = tt;
                  !Oe && G !== De && !Q && vp(I, De, G);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      m.size > 0 && a[Fu] !== !0 && UC(m), t) {
        case "input":
          Gi(e), de(e, a, !0);
          break;
        case "textarea":
          Gi(e), wc(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && Hh(e);
          break;
      }
      return $;
    }
    function tw(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function dg(e, t) {
      {
        if (Qa)
          return;
        Qa = !0, _("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function pg(e, t) {
      {
        if (Qa)
          return;
        Qa = !0, _('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function vg(e, t, a) {
      {
        if (Qa)
          return;
        Qa = !0, _("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function hg(e, t) {
      {
        if (t === "" || Qa)
          return;
        Qa = !0, _('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function nw(e, t, a) {
      switch (t) {
        case "input":
          je(e, a);
          return;
        case "textarea":
          wy(e, a);
          return;
        case "select":
          yv(e, a);
          return;
      }
    }
    var hp = function() {
    }, mp = function() {
    };
    {
      var rw = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], HC = [
        "applet",
        "caption",
        "html",
        "table",
        "td",
        "th",
        "marquee",
        "object",
        "template",
        // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
        // TODO: Distinguish by namespace here -- for <title>, including it here
        // errs on the side of fewer warnings
        "foreignObject",
        "desc",
        "title"
      ], aw = HC.concat(["button"]), iw = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], BC = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      mp = function(e, t) {
        var a = _t({}, e || BC), i = {
          tag: t
        };
        return HC.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), aw.indexOf(t) !== -1 && (a.pTagInButtonScope = null), rw.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var lw = function(e, t) {
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
            return iw.indexOf(t) === -1;
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
      }, ow = function(e, t) {
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
      hp = function(e, t, a) {
        a = a || BC;
        var i = a.current, o = i && i.tag;
        t != null && (e != null && _("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = lw(e, o) ? null : i, f = s ? null : ow(e, a), v = s || f;
        if (v) {
          var m = v.tag, E = !!s + "|" + e + "|" + m;
          if (!VC[E]) {
            VC[E] = !0;
            var b = e, L = "";
            if (e === "#text" ? /\S/.test(t) ? b = "Text nodes" : (b = "Whitespace text nodes", L = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : b = "<" + e + ">", s) {
              var M = "";
              m === "table" && e === "tr" && (M += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), _("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", b, m, L, M);
            } else
              _("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", b, m);
          }
        }
      };
    }
    var Bh = "suppressHydrationWarning", Vh = "$", $h = "/$", yp = "$?", gp = "$!", uw = "style", mg = null, yg = null;
    function sw(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case Ca:
        case pd: {
          t = i === Ca ? "#document" : "#fragment";
          var o = e.documentElement;
          a = o ? o.namespaceURI : dd(null, "");
          break;
        }
        default: {
          var s = i === Nn ? e.parentNode : e, f = s.namespaceURI || null;
          t = s.tagName, a = dd(f, t);
          break;
        }
      }
      {
        var v = t.toLowerCase(), m = mp(null, v);
        return {
          namespace: a,
          ancestorInfo: m
        };
      }
    }
    function cw(e, t, a) {
      {
        var i = e, o = dd(i.namespace, t), s = mp(i.ancestorInfo, t);
        return {
          namespace: o,
          ancestorInfo: s
        };
      }
    }
    function kk(e) {
      return e;
    }
    function fw(e) {
      mg = Nu(), yg = R1();
      var t = null;
      return pa(!1), t;
    }
    function dw(e) {
      T1(yg), pa(mg), mg = null, yg = null;
    }
    function pw(e, t, a, i, o) {
      var s;
      {
        var f = i;
        if (hp(e, null, f.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var v = "" + t.children, m = mp(f.ancestorInfo, e);
          hp(null, v, m);
        }
        s = f.namespace;
      }
      var E = Q1(e, t, a, s);
      return Ep(o, E), Rg(E, t), E;
    }
    function vw(e, t) {
      e.appendChild(t);
    }
    function hw(e, t, a, i, o) {
      switch (X1(e, t, a, i), t) {
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
    function mw(e, t, a, i, o, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var v = "" + i.children, m = mp(f.ancestorInfo, t);
          hp(null, v, m);
        }
      }
      return K1(e, t, a, i);
    }
    function gg(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function yw(e, t, a, i) {
      {
        var o = a;
        hp(null, e, o.ancestorInfo);
      }
      var s = q1(e, t);
      return Ep(i, s), s;
    }
    function gw() {
      var e = window.event;
      return e === void 0 ? Oi : vf(e.type);
    }
    var Sg = typeof setTimeout == "function" ? setTimeout : void 0, Sw = typeof clearTimeout == "function" ? clearTimeout : void 0, Cg = -1, $C = typeof Promise == "function" ? Promise : void 0, Cw = typeof queueMicrotask == "function" ? queueMicrotask : typeof $C < "u" ? function(e) {
      return $C.resolve(null).then(e).catch(Ew);
    } : Sg;
    function Ew(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function _w(e, t, a, i) {
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
    function bw(e, t, a, i, o, s) {
      Z1(e, t, a, i, o), Rg(e, o);
    }
    function IC(e) {
      ys(e, "");
    }
    function ww(e, t, a) {
      e.nodeValue = a;
    }
    function Rw(e, t) {
      e.appendChild(t);
    }
    function Tw(e, t) {
      var a;
      e.nodeType === Nn ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && Hh(a);
    }
    function xw(e, t, a) {
      e.insertBefore(t, a);
    }
    function Dw(e, t, a) {
      e.nodeType === Nn ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function Ow(e, t) {
      e.removeChild(t);
    }
    function kw(e, t) {
      e.nodeType === Nn ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function Eg(e, t) {
      var a = t, i = 0;
      do {
        var o = a.nextSibling;
        if (e.removeChild(a), o && o.nodeType === Nn) {
          var s = o.data;
          if (s === $h)
            if (i === 0) {
              e.removeChild(o), Un(t);
              return;
            } else
              i--;
          else
            (s === Vh || s === yp || s === gp) && i++;
        }
        a = o;
      } while (a);
      Un(t);
    }
    function Mw(e, t) {
      e.nodeType === Nn ? Eg(e.parentNode, t) : e.nodeType === ra && Eg(e, t), Un(e);
    }
    function Nw(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function Lw(e) {
      e.nodeValue = "";
    }
    function Aw(e, t) {
      e = e;
      var a = t[uw], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = kl("display", i);
    }
    function zw(e, t) {
      e.nodeValue = t;
    }
    function Uw(e) {
      e.nodeType === ra ? e.textContent = "" : e.nodeType === Ca && e.documentElement && e.removeChild(e.documentElement);
    }
    function Pw(e, t, a) {
      return e.nodeType !== ra || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function jw(e, t) {
      return t === "" || e.nodeType !== Ki ? null : e;
    }
    function Fw(e) {
      return e.nodeType !== Nn ? null : e;
    }
    function YC(e) {
      return e.data === yp;
    }
    function _g(e) {
      return e.data === gp;
    }
    function Hw(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, o;
      return t && (a = t.dgst, i = t.msg, o = t.stck), {
        message: i,
        digest: a,
        stack: o
      };
    }
    function Bw(e, t) {
      e._reactRetry = t;
    }
    function Ih(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === ra || t === Ki)
          break;
        if (t === Nn) {
          var a = e.data;
          if (a === Vh || a === gp || a === yp)
            break;
          if (a === $h)
            return null;
        }
      }
      return e;
    }
    function Sp(e) {
      return Ih(e.nextSibling);
    }
    function Vw(e) {
      return Ih(e.firstChild);
    }
    function $w(e) {
      return Ih(e.firstChild);
    }
    function Iw(e) {
      return Ih(e.nextSibling);
    }
    function Yw(e, t, a, i, o, s, f) {
      Ep(s, e), Rg(e, a);
      var v;
      {
        var m = o;
        v = m.namespace;
      }
      var E = (s.mode & Ye) !== Je;
      return ew(e, t, a, v, i, E, f);
    }
    function Ww(e, t, a, i) {
      return Ep(a, e), a.mode & Ye, tw(e, t);
    }
    function Gw(e, t) {
      Ep(t, e);
    }
    function Qw(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === Nn) {
          var i = t.data;
          if (i === $h) {
            if (a === 0)
              return Sp(t);
            a--;
          } else
            (i === Vh || i === gp || i === yp) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function WC(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === Nn) {
          var i = t.data;
          if (i === Vh || i === gp || i === yp) {
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
    function qw(e) {
      Un(e);
    }
    function Xw(e) {
      Un(e);
    }
    function Kw(e) {
      return e !== "head" && e !== "body";
    }
    function Zw(e, t, a, i) {
      var o = !0;
      Fh(t.nodeValue, a, i, o);
    }
    function Jw(e, t, a, i, o, s) {
      if (t[Bh] !== !0) {
        var f = !0;
        Fh(i.nodeValue, o, s, f);
      }
    }
    function eR(e, t) {
      t.nodeType === ra ? dg(e, t) : t.nodeType === Nn || pg(e, t);
    }
    function tR(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === ra ? dg(a, t) : t.nodeType === Nn || pg(a, t));
      }
    }
    function nR(e, t, a, i, o) {
      (o || t[Bh] !== !0) && (i.nodeType === ra ? dg(a, i) : i.nodeType === Nn || pg(a, i));
    }
    function rR(e, t, a) {
      vg(e, t);
    }
    function aR(e, t) {
      hg(e, t);
    }
    function iR(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && vg(i, t);
      }
    }
    function lR(e, t) {
      {
        var a = e.parentNode;
        a !== null && hg(a, t);
      }
    }
    function oR(e, t, a, i, o, s) {
      (s || t[Bh] !== !0) && vg(a, i);
    }
    function uR(e, t, a, i, o) {
      (o || t[Bh] !== !0) && hg(a, i);
    }
    function sR(e) {
      _("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function cR(e) {
      fp(e);
    }
    var Nf = Math.random().toString(36).slice(2), Lf = "__reactFiber$" + Nf, bg = "__reactProps$" + Nf, Cp = "__reactContainer$" + Nf, wg = "__reactEvents$" + Nf, fR = "__reactListeners$" + Nf, dR = "__reactHandles$" + Nf;
    function pR(e) {
      delete e[Lf], delete e[bg], delete e[wg], delete e[fR], delete e[dR];
    }
    function Ep(e, t) {
      t[Lf] = e;
    }
    function Yh(e, t) {
      t[Cp] = e;
    }
    function GC(e) {
      e[Cp] = null;
    }
    function _p(e) {
      return !!e[Cp];
    }
    function ic(e) {
      var t = e[Lf];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[Cp] || a[Lf], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var o = WC(e); o !== null; ) {
              var s = o[Lf];
              if (s)
                return s;
              o = WC(o);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function Hu(e) {
      var t = e[Lf] || e[Cp];
      return t && (t.tag === ce || t.tag === be || t.tag === Le || t.tag === re) ? t : null;
    }
    function Af(e) {
      if (e.tag === ce || e.tag === be)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function Wh(e) {
      return e[bg] || null;
    }
    function Rg(e, t) {
      e[bg] = t;
    }
    function vR(e) {
      var t = e[wg];
      return t === void 0 && (t = e[wg] = /* @__PURE__ */ new Set()), t;
    }
    var QC = {}, qC = C.ReactDebugCurrentFrame;
    function Gh(e) {
      if (e) {
        var t = e._owner, a = Lt(e.type, e._source, t ? t.type : null);
        qC.setExtraStackFrame(a);
      } else
        qC.setExtraStackFrame(null);
    }
    function cl(e, t, a, i, o) {
      {
        var s = Function.call.bind(Hn);
        for (var f in e)
          if (s(e, f)) {
            var v = void 0;
            try {
              if (typeof e[f] != "function") {
                var m = Error((i || "React class") + ": " + a + " type `" + f + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[f] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw m.name = "Invariant Violation", m;
              }
              v = e[f](t, f, i, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (E) {
              v = E;
            }
            v && !(v instanceof Error) && (Gh(o), _("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, f, typeof v), Gh(null)), v instanceof Error && !(v.message in QC) && (QC[v.message] = !0, Gh(o), _("Failed %s type: %s", a, v.message), Gh(null));
          }
      }
    }
    var Tg = [], Qh;
    Qh = [];
    var Po = -1;
    function Bu(e) {
      return {
        current: e
      };
    }
    function va(e, t) {
      if (Po < 0) {
        _("Unexpected pop.");
        return;
      }
      t !== Qh[Po] && _("Unexpected Fiber popped."), e.current = Tg[Po], Tg[Po] = null, Qh[Po] = null, Po--;
    }
    function ha(e, t, a) {
      Po++, Tg[Po] = e.current, Qh[Po] = a, e.current = t;
    }
    var xg;
    xg = {};
    var fi = {};
    Object.freeze(fi);
    var jo = Bu(fi), ql = Bu(!1), Dg = fi;
    function zf(e, t, a) {
      return a && Xl(t) ? Dg : jo.current;
    }
    function XC(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function Uf(e, t) {
      {
        var a = e.type, i = a.contextTypes;
        if (!i)
          return fi;
        var o = e.stateNode;
        if (o && o.__reactInternalMemoizedUnmaskedChildContext === t)
          return o.__reactInternalMemoizedMaskedChildContext;
        var s = {};
        for (var f in i)
          s[f] = t[f];
        {
          var v = st(e) || "Unknown";
          cl(i, s, "context", v);
        }
        return o && XC(e, t, s), s;
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
      va(ql, e), va(jo, e);
    }
    function Og(e) {
      va(ql, e), va(jo, e);
    }
    function KC(e, t, a) {
      {
        if (jo.current !== fi)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        ha(jo, t, e), ha(ql, a, e);
      }
    }
    function ZC(e, t, a) {
      {
        var i = e.stateNode, o = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = st(e) || "Unknown";
            xg[s] || (xg[s] = !0, _("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var v in f)
          if (!(v in o))
            throw new Error((st(e) || "Unknown") + '.getChildContext(): key "' + v + '" is not defined in childContextTypes.');
        {
          var m = st(e) || "Unknown";
          cl(o, f, "child context", m);
        }
        return _t({}, a, f);
      }
    }
    function Kh(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || fi;
        return Dg = jo.current, ha(jo, a, e), ha(ql, ql.current, e), !0;
      }
    }
    function JC(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var o = ZC(e, t, Dg);
          i.__reactInternalMemoizedMergedChildContext = o, va(ql, e), va(jo, e), ha(jo, o, e), ha(ql, a, e);
        } else
          va(ql, e), ha(ql, a, e);
      }
    }
    function hR(e) {
      {
        if (!ba(e) || e.tag !== ne)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case re:
              return t.stateNode.context;
            case ne: {
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
    var Vu = 0, Zh = 1, Fo = null, kg = !1, Mg = !1;
    function eE(e) {
      Fo === null ? Fo = [e] : Fo.push(e);
    }
    function mR(e) {
      kg = !0, eE(e);
    }
    function tE() {
      kg && $u();
    }
    function $u() {
      if (!Mg && Fo !== null) {
        Mg = !0;
        var e = 0, t = $a();
        try {
          var a = !0, i = Fo;
          for (zn(Yn); e < i.length; e++) {
            var o = i[e];
            do
              o = o(a);
            while (o !== null);
          }
          Fo = null, kg = !1;
        } catch (s) {
          throw Fo !== null && (Fo = Fo.slice(e + 1)), Ld(ua, $u), s;
        } finally {
          zn(t), Mg = !1;
        }
      }
      return null;
    }
    var Pf = [], jf = 0, Jh = null, em = 0, Li = [], Ai = 0, lc = null, Ho = 1, Bo = "";
    function yR(e) {
      return uc(), (e.flags & Gv) !== Ze;
    }
    function gR(e) {
      return uc(), em;
    }
    function SR() {
      var e = Bo, t = Ho, a = t & ~CR(t);
      return a.toString(32) + e;
    }
    function oc(e, t) {
      uc(), Pf[jf++] = em, Pf[jf++] = Jh, Jh = e, em = t;
    }
    function nE(e, t, a) {
      uc(), Li[Ai++] = Ho, Li[Ai++] = Bo, Li[Ai++] = lc, lc = e;
      var i = Ho, o = Bo, s = tm(i) - 1, f = i & ~(1 << s), v = a + 1, m = tm(t) + s;
      if (m > 30) {
        var E = s - s % 5, b = (1 << E) - 1, L = (f & b).toString(32), M = f >> E, $ = s - E, I = tm(t) + $, G = v << $, De = G | M, et = L + o;
        Ho = 1 << I | De, Bo = et;
      } else {
        var We = v << s, Ut = We | f, Mt = o;
        Ho = 1 << m | Ut, Bo = Mt;
      }
    }
    function Ng(e) {
      uc();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        oc(e, a), nE(e, a, i);
      }
    }
    function tm(e) {
      return 32 - Us(e);
    }
    function CR(e) {
      return 1 << tm(e) - 1;
    }
    function Lg(e) {
      for (; e === Jh; )
        Jh = Pf[--jf], Pf[jf] = null, em = Pf[--jf], Pf[jf] = null;
      for (; e === lc; )
        lc = Li[--Ai], Li[Ai] = null, Bo = Li[--Ai], Li[Ai] = null, Ho = Li[--Ai], Li[Ai] = null;
    }
    function ER() {
      return uc(), lc !== null ? {
        id: Ho,
        overflow: Bo
      } : null;
    }
    function _R(e, t) {
      uc(), Li[Ai++] = Ho, Li[Ai++] = Bo, Li[Ai++] = lc, Ho = t.id, Bo = t.overflow, lc = e;
    }
    function uc() {
      $r() || _("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Vr = null, zi = null, fl = !1, sc = !1, Iu = null;
    function bR() {
      fl && _("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function rE() {
      sc = !0;
    }
    function wR() {
      return sc;
    }
    function RR(e) {
      var t = e.stateNode.containerInfo;
      return zi = $w(t), Vr = e, fl = !0, Iu = null, sc = !1, !0;
    }
    function TR(e, t, a) {
      return zi = Iw(t), Vr = e, fl = !0, Iu = null, sc = !1, a !== null && _R(e, a), !0;
    }
    function aE(e, t) {
      switch (e.tag) {
        case re: {
          eR(e.stateNode.containerInfo, t);
          break;
        }
        case ce: {
          var a = (e.mode & Ye) !== Je;
          nR(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case Le: {
          var i = e.memoizedState;
          i.dehydrated !== null && tR(i.dehydrated, t);
          break;
        }
      }
    }
    function iE(e, t) {
      aE(e, t);
      var a = OD();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= Vt) : i.push(a);
    }
    function Ag(e, t) {
      {
        if (sc)
          return;
        switch (e.tag) {
          case re: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case ce:
                var i = t.type;
                t.pendingProps, rR(a, i);
                break;
              case be:
                var o = t.pendingProps;
                aR(a, o);
                break;
            }
            break;
          }
          case ce: {
            var s = e.type, f = e.memoizedProps, v = e.stateNode;
            switch (t.tag) {
              case ce: {
                var m = t.type, E = t.pendingProps, b = (e.mode & Ye) !== Je;
                oR(
                  s,
                  f,
                  v,
                  m,
                  E,
                  // TODO: Delete this argument when we remove the legacy root API.
                  b
                );
                break;
              }
              case be: {
                var L = t.pendingProps, M = (e.mode & Ye) !== Je;
                uR(
                  s,
                  f,
                  v,
                  L,
                  // TODO: Delete this argument when we remove the legacy root API.
                  M
                );
                break;
              }
            }
            break;
          }
          case Le: {
            var $ = e.memoizedState, I = $.dehydrated;
            if (I !== null)
              switch (t.tag) {
                case ce:
                  var G = t.type;
                  t.pendingProps, iR(I, G);
                  break;
                case be:
                  var De = t.pendingProps;
                  lR(I, De);
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
      t.flags = t.flags & ~wi | ln, Ag(e, t);
    }
    function oE(e, t) {
      switch (e.tag) {
        case ce: {
          var a = e.type;
          e.pendingProps;
          var i = Pw(t, a);
          return i !== null ? (e.stateNode = i, Vr = e, zi = Vw(i), !0) : !1;
        }
        case be: {
          var o = e.pendingProps, s = jw(t, o);
          return s !== null ? (e.stateNode = s, Vr = e, zi = null, !0) : !1;
        }
        case Le: {
          var f = Fw(t);
          if (f !== null) {
            var v = {
              dehydrated: f,
              treeContext: ER(),
              retryLane: Ta
            };
            e.memoizedState = v;
            var m = kD(f);
            return m.return = e, e.child = m, Vr = e, zi = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function zg(e) {
      return (e.mode & Ye) !== Je && (e.flags & dt) === Ze;
    }
    function Ug(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function Pg(e) {
      if (fl) {
        var t = zi;
        if (!t) {
          zg(e) && (Ag(Vr, e), Ug()), lE(Vr, e), fl = !1, Vr = e;
          return;
        }
        var a = t;
        if (!oE(e, t)) {
          zg(e) && (Ag(Vr, e), Ug()), t = Sp(a);
          var i = Vr;
          if (!t || !oE(e, t)) {
            lE(Vr, e), fl = !1, Vr = e;
            return;
          }
          iE(i, a);
        }
      }
    }
    function xR(e, t, a) {
      var i = e.stateNode, o = !sc, s = Yw(i, e.type, e.memoizedProps, t, a, e, o);
      return e.updateQueue = s, s !== null;
    }
    function DR(e) {
      var t = e.stateNode, a = e.memoizedProps, i = Ww(t, a, e);
      if (i) {
        var o = Vr;
        if (o !== null)
          switch (o.tag) {
            case re: {
              var s = o.stateNode.containerInfo, f = (o.mode & Ye) !== Je;
              Zw(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case ce: {
              var v = o.type, m = o.memoizedProps, E = o.stateNode, b = (o.mode & Ye) !== Je;
              Jw(
                v,
                m,
                E,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                b
              );
              break;
            }
          }
      }
      return i;
    }
    function OR(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      Gw(a, e);
    }
    function kR(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return Qw(a);
    }
    function uE(e) {
      for (var t = e.return; t !== null && t.tag !== ce && t.tag !== re && t.tag !== Le; )
        t = t.return;
      Vr = t;
    }
    function nm(e) {
      if (e !== Vr)
        return !1;
      if (!fl)
        return uE(e), fl = !0, !1;
      if (e.tag !== re && (e.tag !== ce || Kw(e.type) && !gg(e.type, e.memoizedProps))) {
        var t = zi;
        if (t)
          if (zg(e))
            sE(e), Ug();
          else
            for (; t; )
              iE(e, t), t = Sp(t);
      }
      return uE(e), e.tag === Le ? zi = kR(e) : zi = Vr ? Sp(e.stateNode) : null, !0;
    }
    function MR() {
      return fl && zi !== null;
    }
    function sE(e) {
      for (var t = zi; t; )
        aE(e, t), t = Sp(t);
    }
    function Ff() {
      Vr = null, zi = null, fl = !1, sc = !1;
    }
    function cE() {
      Iu !== null && (ab(Iu), Iu = null);
    }
    function $r() {
      return fl;
    }
    function jg(e) {
      Iu === null ? Iu = [e] : Iu.push(e);
    }
    var NR = C.ReactCurrentBatchConfig, LR = null;
    function AR() {
      return NR.transition;
    }
    var dl = {
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
      var zR = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & Ln && (t = a), a = a.return;
        return t;
      }, cc = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, bp = [], wp = [], Rp = [], Tp = [], xp = [], Dp = [], fc = /* @__PURE__ */ new Set();
      dl.recordUnsafeLifecycleWarnings = function(e, t) {
        fc.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && bp.push(e), e.mode & Ln && typeof t.UNSAFE_componentWillMount == "function" && wp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && Rp.push(e), e.mode & Ln && typeof t.UNSAFE_componentWillReceiveProps == "function" && Tp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && xp.push(e), e.mode & Ln && typeof t.UNSAFE_componentWillUpdate == "function" && Dp.push(e));
      }, dl.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        bp.length > 0 && (bp.forEach(function(M) {
          e.add(st(M) || "Component"), fc.add(M.type);
        }), bp = []);
        var t = /* @__PURE__ */ new Set();
        wp.length > 0 && (wp.forEach(function(M) {
          t.add(st(M) || "Component"), fc.add(M.type);
        }), wp = []);
        var a = /* @__PURE__ */ new Set();
        Rp.length > 0 && (Rp.forEach(function(M) {
          a.add(st(M) || "Component"), fc.add(M.type);
        }), Rp = []);
        var i = /* @__PURE__ */ new Set();
        Tp.length > 0 && (Tp.forEach(function(M) {
          i.add(st(M) || "Component"), fc.add(M.type);
        }), Tp = []);
        var o = /* @__PURE__ */ new Set();
        xp.length > 0 && (xp.forEach(function(M) {
          o.add(st(M) || "Component"), fc.add(M.type);
        }), xp = []);
        var s = /* @__PURE__ */ new Set();
        if (Dp.length > 0 && (Dp.forEach(function(M) {
          s.add(st(M) || "Component"), fc.add(M.type);
        }), Dp = []), t.size > 0) {
          var f = cc(t);
          _(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, f);
        }
        if (i.size > 0) {
          var v = cc(i);
          _(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, v);
        }
        if (s.size > 0) {
          var m = cc(s);
          _(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, m);
        }
        if (e.size > 0) {
          var E = cc(e);
          P(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, E);
        }
        if (a.size > 0) {
          var b = cc(a);
          P(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, b);
        }
        if (o.size > 0) {
          var L = cc(o);
          P(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, L);
        }
      };
      var rm = /* @__PURE__ */ new Map(), fE = /* @__PURE__ */ new Set();
      dl.recordLegacyContextWarning = function(e, t) {
        var a = zR(e);
        if (a === null) {
          _("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!fE.has(e.type)) {
          var i = rm.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], rm.set(a, i)), i.push(e));
        }
      }, dl.flushLegacyContextWarning = function() {
        rm.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(st(s) || "Component"), fE.add(s.type);
            });
            var o = cc(i);
            try {
              xn(a), _(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, o);
            } finally {
              pn();
            }
          }
        });
      }, dl.discardPendingWarnings = function() {
        bp = [], wp = [], Rp = [], Tp = [], xp = [], Dp = [], rm = /* @__PURE__ */ new Map();
      };
    }
    function pl(e, t) {
      if (e && e.defaultProps) {
        var a = _t({}, t), i = e.defaultProps;
        for (var o in i)
          a[o] === void 0 && (a[o] = i[o]);
        return a;
      }
      return t;
    }
    var Fg = Bu(null), Hg;
    Hg = {};
    var am = null, Hf = null, Bg = null, im = !1;
    function lm() {
      am = null, Hf = null, Bg = null, im = !1;
    }
    function dE() {
      im = !0;
    }
    function pE() {
      im = !1;
    }
    function vE(e, t, a) {
      ha(Fg, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== Hg && _("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = Hg;
    }
    function Vg(e, t) {
      var a = Fg.current;
      va(Fg, t), e._currentValue = a;
    }
    function $g(e, t, a) {
      for (var i = e; i !== null; ) {
        var o = i.alternate;
        if (Oo(i.childLanes, t) ? o !== null && !Oo(o.childLanes, t) && (o.childLanes = mt(o.childLanes, t)) : (i.childLanes = mt(i.childLanes, t), o !== null && (o.childLanes = mt(o.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && _("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function UR(e, t, a) {
      PR(e, t, a);
    }
    function PR(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var o = void 0, s = i.dependencies;
        if (s !== null) {
          o = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === ne) {
                var v = _u(a), m = Vo(dn, v);
                m.tag = um;
                var E = i.updateQueue;
                if (E !== null) {
                  var b = E.shared, L = b.pending;
                  L === null ? m.next = m : (m.next = L.next, L.next = m), b.pending = m;
                }
              }
              i.lanes = mt(i.lanes, a);
              var M = i.alternate;
              M !== null && (M.lanes = mt(M.lanes, a)), $g(i.return, a, e), s.lanes = mt(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === Xe)
          o = i.type === e.type ? null : i.child;
        else if (i.tag === Zt) {
          var $ = i.return;
          if ($ === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          $.lanes = mt($.lanes, a);
          var I = $.alternate;
          I !== null && (I.lanes = mt(I.lanes, a)), $g($, a, e), o = i.sibling;
        } else
          o = i.child;
        if (o !== null)
          o.return = i;
        else
          for (o = i; o !== null; ) {
            if (o === e) {
              o = null;
              break;
            }
            var G = o.sibling;
            if (G !== null) {
              G.return = o.return, o = G;
              break;
            }
            o = o.return;
          }
        i = o;
      }
    }
    function Bf(e, t) {
      am = e, Hf = null, Bg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (da(a.lanes, t) && Vp(), a.firstContext = null);
      }
    }
    function hr(e) {
      im && _("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (Bg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (Hf === null) {
          if (am === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          Hf = a, am.dependencies = {
            lanes: X,
            firstContext: a
          };
        } else
          Hf = Hf.next = a;
      }
      return t;
    }
    var dc = null;
    function Ig(e) {
      dc === null ? dc = [e] : dc.push(e);
    }
    function jR() {
      if (dc !== null) {
        for (var e = 0; e < dc.length; e++) {
          var t = dc[e], a = t.interleaved;
          if (a !== null) {
            t.interleaved = null;
            var i = a.next, o = t.pending;
            if (o !== null) {
              var s = o.next;
              o.next = i, a.next = s;
            }
            t.pending = a;
          }
        }
        dc = null;
      }
    }
    function hE(e, t, a, i) {
      var o = t.interleaved;
      return o === null ? (a.next = a, Ig(t)) : (a.next = o.next, o.next = a), t.interleaved = a, om(e, i);
    }
    function FR(e, t, a, i) {
      var o = t.interleaved;
      o === null ? (a.next = a, Ig(t)) : (a.next = o.next, o.next = a), t.interleaved = a;
    }
    function HR(e, t, a, i) {
      var o = t.interleaved;
      return o === null ? (a.next = a, Ig(t)) : (a.next = o.next, o.next = a), t.interleaved = a, om(e, i);
    }
    function qa(e, t) {
      return om(e, t);
    }
    var BR = om;
    function om(e, t) {
      e.lanes = mt(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = mt(a.lanes, t)), a === null && (e.flags & (ln | wi)) !== Ze && mb(e);
      for (var i = e, o = e.return; o !== null; )
        o.childLanes = mt(o.childLanes, t), a = o.alternate, a !== null ? a.childLanes = mt(a.childLanes, t) : (o.flags & (ln | wi)) !== Ze && mb(e), i = o, o = o.return;
      if (i.tag === re) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var mE = 0, yE = 1, um = 2, Yg = 3, sm = !1, Wg, cm;
    Wg = !1, cm = null;
    function Gg(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: X
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function gE(e, t) {
      var a = t.updateQueue, i = e.updateQueue;
      if (a === i) {
        var o = {
          baseState: i.baseState,
          firstBaseUpdate: i.firstBaseUpdate,
          lastBaseUpdate: i.lastBaseUpdate,
          shared: i.shared,
          effects: i.effects
        };
        t.updateQueue = o;
      }
    }
    function Vo(e, t) {
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
    function Yu(e, t, a) {
      var i = e.updateQueue;
      if (i === null)
        return null;
      var o = i.shared;
      if (cm === o && !Wg && (_("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), Wg = !0), Bx()) {
        var s = o.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), o.pending = t, BR(e, a);
      } else
        return HR(e, o, t, a);
    }
    function fm(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var o = i.shared;
        if (Id(a)) {
          var s = o.lanes;
          s = af(s, e.pendingLanes);
          var f = mt(s, a);
          o.lanes = f, Yd(e, f);
        }
      }
    }
    function Qg(e, t) {
      var a = e.updateQueue, i = e.alternate;
      if (i !== null) {
        var o = i.updateQueue;
        if (a === o) {
          var s = null, f = null, v = a.firstBaseUpdate;
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
              f === null ? s = f = E : (f.next = E, f = E), m = m.next;
            } while (m !== null);
            f === null ? s = f = t : (f.next = t, f = t);
          } else
            s = f = t;
          a = {
            baseState: o.baseState,
            firstBaseUpdate: s,
            lastBaseUpdate: f,
            shared: o.shared,
            effects: o.effects
          }, e.updateQueue = a;
          return;
        }
      }
      var b = a.lastBaseUpdate;
      b === null ? a.firstBaseUpdate = t : b.next = t, a.lastBaseUpdate = t;
    }
    function VR(e, t, a, i, o, s) {
      switch (a.tag) {
        case yE: {
          var f = a.payload;
          if (typeof f == "function") {
            dE();
            var v = f.call(s, i, o);
            {
              if (e.mode & Ln) {
                fn(!0);
                try {
                  f.call(s, i, o);
                } finally {
                  fn(!1);
                }
              }
              pE();
            }
            return v;
          }
          return f;
        }
        case Yg:
          e.flags = e.flags & ~Sr | dt;
        case mE: {
          var m = a.payload, E;
          if (typeof m == "function") {
            dE(), E = m.call(s, i, o);
            {
              if (e.mode & Ln) {
                fn(!0);
                try {
                  m.call(s, i, o);
                } finally {
                  fn(!1);
                }
              }
              pE();
            }
          } else
            E = m;
          return E == null ? i : _t({}, i, E);
        }
        case um:
          return sm = !0, i;
      }
      return i;
    }
    function dm(e, t, a, i) {
      var o = e.updateQueue;
      sm = !1, cm = o.shared;
      var s = o.firstBaseUpdate, f = o.lastBaseUpdate, v = o.shared.pending;
      if (v !== null) {
        o.shared.pending = null;
        var m = v, E = m.next;
        m.next = null, f === null ? s = E : f.next = E, f = m;
        var b = e.alternate;
        if (b !== null) {
          var L = b.updateQueue, M = L.lastBaseUpdate;
          M !== f && (M === null ? L.firstBaseUpdate = E : M.next = E, L.lastBaseUpdate = m);
        }
      }
      if (s !== null) {
        var $ = o.baseState, I = X, G = null, De = null, et = null, We = s;
        do {
          var Ut = We.lane, Mt = We.eventTime;
          if (Oo(i, Ut)) {
            if (et !== null) {
              var Q = {
                eventTime: Mt,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: $n,
                tag: We.tag,
                payload: We.payload,
                callback: We.callback,
                next: null
              };
              et = et.next = Q;
            }
            $ = VR(e, o, We, $, t, a);
            var H = We.callback;
            if (H !== null && // If the update was already committed, we should not queue its
            // callback again.
            We.lane !== $n) {
              e.flags |= fr;
              var oe = o.effects;
              oe === null ? o.effects = [We] : oe.push(We);
            }
          } else {
            var F = {
              eventTime: Mt,
              lane: Ut,
              tag: We.tag,
              payload: We.payload,
              callback: We.callback,
              next: null
            };
            et === null ? (De = et = F, G = $) : et = et.next = F, I = mt(I, Ut);
          }
          if (We = We.next, We === null) {
            if (v = o.shared.pending, v === null)
              break;
            var Oe = v, we = Oe.next;
            Oe.next = null, We = we, o.lastBaseUpdate = Oe, o.shared.pending = null;
          }
        } while (!0);
        et === null && (G = $), o.baseState = G, o.firstBaseUpdate = De, o.lastBaseUpdate = et;
        var ut = o.shared.interleaved;
        if (ut !== null) {
          var ht = ut;
          do
            I = mt(I, ht.lane), ht = ht.next;
          while (ht !== ut);
        } else
          s === null && (o.shared.lanes = X);
        ev(I), e.lanes = I, e.memoizedState = $;
      }
      cm = null;
    }
    function $R(e, t) {
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
        for (var o = 0; o < i.length; o++) {
          var s = i[o], f = s.callback;
          f !== null && (s.callback = null, $R(f, a));
        }
    }
    var qg = {}, EE = new d.Component().refs, Xg, Kg, Zg, Jg, eS, _E, vm, tS, nS, rS;
    {
      Xg = /* @__PURE__ */ new Set(), Kg = /* @__PURE__ */ new Set(), Zg = /* @__PURE__ */ new Set(), Jg = /* @__PURE__ */ new Set(), tS = /* @__PURE__ */ new Set(), eS = /* @__PURE__ */ new Set(), nS = /* @__PURE__ */ new Set(), rS = /* @__PURE__ */ new Set();
      var bE = /* @__PURE__ */ new Set();
      vm = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          bE.has(a) || (bE.add(a), _("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, _E = function(e, t) {
        if (t === void 0) {
          var a = Ft(e) || "Component";
          eS.has(a) || (eS.add(a), _("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(qg, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(qg);
    }
    function aS(e, t, a, i) {
      var o = e.memoizedState, s = a(i, o);
      {
        if (e.mode & Ln) {
          fn(!0);
          try {
            s = a(i, o);
          } finally {
            fn(!1);
          }
        }
        _E(t, s);
      }
      var f = s == null ? o : _t({}, o, s);
      if (e.memoizedState = f, e.lanes === X) {
        var v = e.updateQueue;
        v.baseState = f;
      }
    }
    var iS = {
      isMounted: wa,
      enqueueSetState: function(e, t, a) {
        var i = bi(e), o = Oa(), s = Ju(i), f = Vo(o, s);
        f.payload = t, a != null && (vm(a, "setState"), f.callback = a);
        var v = Yu(i, f, s);
        v !== null && (Or(v, i, s, o), fm(v, i, s)), Vc(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = bi(e), o = Oa(), s = Ju(i), f = Vo(o, s);
        f.tag = yE, f.payload = t, a != null && (vm(a, "replaceState"), f.callback = a);
        var v = Yu(i, f, s);
        v !== null && (Or(v, i, s, o), fm(v, i, s)), Vc(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = bi(e), i = Oa(), o = Ju(a), s = Vo(i, o);
        s.tag = um, t != null && (vm(t, "forceUpdate"), s.callback = t);
        var f = Yu(a, s, o);
        f !== null && (Or(f, a, o, i), fm(f, a, o)), gu(a, o);
      }
    };
    function wE(e, t, a, i, o, s, f) {
      var v = e.stateNode;
      if (typeof v.shouldComponentUpdate == "function") {
        var m = v.shouldComponentUpdate(i, s, f);
        {
          if (e.mode & Ln) {
            fn(!0);
            try {
              m = v.shouldComponentUpdate(i, s, f);
            } finally {
              fn(!1);
            }
          }
          m === void 0 && _("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", Ft(t) || "Component");
        }
        return m;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !it(a, i) || !it(o, s) : !0;
    }
    function IR(e, t, a) {
      var i = e.stateNode;
      {
        var o = Ft(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? _("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", o) : _("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", o)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && _("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", o), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && _("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", o), i.propTypes && _("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", o), i.contextType && _("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", o), i.contextTypes && _("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", o), t.contextType && t.contextTypes && !nS.has(t) && (nS.add(t), _("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", o)), typeof i.componentShouldUpdate == "function" && _("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", o), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && _("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", Ft(t) || "A pure component"), typeof i.componentDidUnmount == "function" && _("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", o), typeof i.componentDidReceiveProps == "function" && _("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", o), typeof i.componentWillRecieveProps == "function" && _("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", o), typeof i.UNSAFE_componentWillRecieveProps == "function" && _("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", o);
        var f = i.props !== a;
        i.props !== void 0 && f && _("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", o, o), i.defaultProps && _("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", o, o), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !Zg.has(t) && (Zg.add(t), _("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", Ft(t))), typeof i.getDerivedStateFromProps == "function" && _("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof i.getDerivedStateFromError == "function" && _("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof t.getSnapshotBeforeUpdate == "function" && _("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", o);
        var v = i.state;
        v && (typeof v != "object" || Ht(v)) && _("%s.state: must be set to an object or null", o), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && _("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", o);
      }
    }
    function RE(e, t) {
      t.updater = iS, e.stateNode = t, Ac(t, e), t._reactInternalInstance = qg;
    }
    function TE(e, t, a) {
      var i = !1, o = fi, s = fi, f = t.contextType;
      if ("contextType" in t) {
        var v = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === ge && f._context === void 0
        );
        if (!v && !rS.has(t)) {
          rS.add(t);
          var m = "";
          f === void 0 ? m = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? m = " However, it is set to a " + typeof f + "." : f.$$typeof === ae ? m = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? m = " Did you accidentally pass the Context.Consumer instead?" : m = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", _("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", Ft(t) || "Component", m);
        }
      }
      if (typeof f == "object" && f !== null)
        s = hr(f);
      else {
        o = zf(e, t, !0);
        var E = t.contextTypes;
        i = E != null, s = i ? Uf(e, o) : fi;
      }
      var b = new t(a, s);
      if (e.mode & Ln) {
        fn(!0);
        try {
          b = new t(a, s);
        } finally {
          fn(!1);
        }
      }
      var L = e.memoizedState = b.state !== null && b.state !== void 0 ? b.state : null;
      RE(e, b);
      {
        if (typeof t.getDerivedStateFromProps == "function" && L === null) {
          var M = Ft(t) || "Component";
          Kg.has(M) || (Kg.add(M), _("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", M, b.state === null ? "null" : "undefined", M));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof b.getSnapshotBeforeUpdate == "function") {
          var $ = null, I = null, G = null;
          if (typeof b.componentWillMount == "function" && b.componentWillMount.__suppressDeprecationWarning !== !0 ? $ = "componentWillMount" : typeof b.UNSAFE_componentWillMount == "function" && ($ = "UNSAFE_componentWillMount"), typeof b.componentWillReceiveProps == "function" && b.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? I = "componentWillReceiveProps" : typeof b.UNSAFE_componentWillReceiveProps == "function" && (I = "UNSAFE_componentWillReceiveProps"), typeof b.componentWillUpdate == "function" && b.componentWillUpdate.__suppressDeprecationWarning !== !0 ? G = "componentWillUpdate" : typeof b.UNSAFE_componentWillUpdate == "function" && (G = "UNSAFE_componentWillUpdate"), $ !== null || I !== null || G !== null) {
            var De = Ft(t) || "Component", et = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            Jg.has(De) || (Jg.add(De), _(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, De, et, $ !== null ? `
  ` + $ : "", I !== null ? `
  ` + I : "", G !== null ? `
  ` + G : ""));
          }
        }
      }
      return i && XC(e, o, s), b;
    }
    function YR(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (_("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", st(e) || "Component"), iS.enqueueReplaceState(t, t.state, null));
    }
    function xE(e, t, a, i) {
      var o = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== o) {
        {
          var s = st(e) || "Component";
          Xg.has(s) || (Xg.add(s), _("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        iS.enqueueReplaceState(t, t.state, null);
      }
    }
    function lS(e, t, a, i) {
      IR(e, t, a);
      var o = e.stateNode;
      o.props = a, o.state = e.memoizedState, o.refs = EE, Gg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        o.context = hr(s);
      else {
        var f = zf(e, t, !0);
        o.context = Uf(e, f);
      }
      {
        if (o.state === a) {
          var v = Ft(t) || "Component";
          tS.has(v) || (tS.add(v), _("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", v));
        }
        e.mode & Ln && dl.recordLegacyContextWarning(e, o), dl.recordUnsafeLifecycleWarnings(e, o);
      }
      o.state = e.memoizedState;
      var m = t.getDerivedStateFromProps;
      if (typeof m == "function" && (aS(e, t, m, a), o.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof o.getSnapshotBeforeUpdate != "function" && (typeof o.UNSAFE_componentWillMount == "function" || typeof o.componentWillMount == "function") && (YR(e, o), dm(e, a, o, i), o.state = e.memoizedState), typeof o.componentDidMount == "function") {
        var E = $e;
        E |= ja, (e.mode & Ba) !== Je && (E |= Fa), e.flags |= E;
      }
    }
    function WR(e, t, a, i) {
      var o = e.stateNode, s = e.memoizedProps;
      o.props = s;
      var f = o.context, v = t.contextType, m = fi;
      if (typeof v == "object" && v !== null)
        m = hr(v);
      else {
        var E = zf(e, t, !0);
        m = Uf(e, E);
      }
      var b = t.getDerivedStateFromProps, L = typeof b == "function" || typeof o.getSnapshotBeforeUpdate == "function";
      !L && (typeof o.UNSAFE_componentWillReceiveProps == "function" || typeof o.componentWillReceiveProps == "function") && (s !== a || f !== m) && xE(e, o, a, m), SE();
      var M = e.memoizedState, $ = o.state = M;
      if (dm(e, a, o, i), $ = e.memoizedState, s === a && M === $ && !qh() && !pm()) {
        if (typeof o.componentDidMount == "function") {
          var I = $e;
          I |= ja, (e.mode & Ba) !== Je && (I |= Fa), e.flags |= I;
        }
        return !1;
      }
      typeof b == "function" && (aS(e, t, b, a), $ = e.memoizedState);
      var G = pm() || wE(e, t, s, a, M, $, m);
      if (G) {
        if (!L && (typeof o.UNSAFE_componentWillMount == "function" || typeof o.componentWillMount == "function") && (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function") {
          var De = $e;
          De |= ja, (e.mode & Ba) !== Je && (De |= Fa), e.flags |= De;
        }
      } else {
        if (typeof o.componentDidMount == "function") {
          var et = $e;
          et |= ja, (e.mode & Ba) !== Je && (et |= Fa), e.flags |= et;
        }
        e.memoizedProps = a, e.memoizedState = $;
      }
      return o.props = a, o.state = $, o.context = m, G;
    }
    function GR(e, t, a, i, o) {
      var s = t.stateNode;
      gE(e, t);
      var f = t.memoizedProps, v = t.type === t.elementType ? f : pl(t.type, f);
      s.props = v;
      var m = t.pendingProps, E = s.context, b = a.contextType, L = fi;
      if (typeof b == "object" && b !== null)
        L = hr(b);
      else {
        var M = zf(t, a, !0);
        L = Uf(t, M);
      }
      var $ = a.getDerivedStateFromProps, I = typeof $ == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !I && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== m || E !== L) && xE(t, s, i, L), SE();
      var G = t.memoizedState, De = s.state = G;
      if (dm(t, i, s, o), De = t.memoizedState, f === m && G === De && !qh() && !pm() && !O)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || G !== e.memoizedState) && (t.flags |= $e), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || G !== e.memoizedState) && (t.flags |= Zn), !1;
      typeof $ == "function" && (aS(t, a, $, i), De = t.memoizedState);
      var et = pm() || wE(t, a, v, i, G, De, L) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      O;
      return et ? (!I && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, De, L), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, De, L)), typeof s.componentDidUpdate == "function" && (t.flags |= $e), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= Zn)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || G !== e.memoizedState) && (t.flags |= $e), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || G !== e.memoizedState) && (t.flags |= Zn), t.memoizedProps = i, t.memoizedState = De), s.props = i, s.state = De, s.context = L, et;
    }
    var oS, uS, sS, cS, fS, DE = function(e, t) {
    };
    oS = !1, uS = !1, sS = {}, cS = {}, fS = {}, DE = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = st(t) || "Component";
        cS[a] || (cS[a] = !0, _('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function Op(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & Ln || Ve) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self)) {
          var o = st(e) || "Component";
          sS[o] || (_('A string ref, "%s", has been found within a strict mode tree. String refs are a source of potential bugs and should be avoided. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', i), sS[o] = !0);
        }
        if (a._owner) {
          var s = a._owner, f;
          if (s) {
            var v = s;
            if (v.tag !== ne)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            f = v.stateNode;
          }
          if (!f)
            throw new Error("Missing owner for string ref " + i + ". This error is likely caused by a bug in React. Please file an issue.");
          var m = f;
          wn(i, "ref");
          var E = "" + i;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === E)
            return t.ref;
          var b = function(L) {
            var M = m.refs;
            M === EE && (M = m.refs = {}), L === null ? delete M[E] : M[E] = L;
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
        var t = st(e) || "Component";
        if (fS[t])
          return;
        fS[t] = !0, _("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function OE(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function kE(e) {
      function t(F, Q) {
        if (e) {
          var H = F.deletions;
          H === null ? (F.deletions = [Q], F.flags |= Vt) : H.push(Q);
        }
      }
      function a(F, Q) {
        if (!e)
          return null;
        for (var H = Q; H !== null; )
          t(F, H), H = H.sibling;
        return null;
      }
      function i(F, Q) {
        for (var H = /* @__PURE__ */ new Map(), oe = Q; oe !== null; )
          oe.key !== null ? H.set(oe.key, oe) : H.set(oe.index, oe), oe = oe.sibling;
        return H;
      }
      function o(F, Q) {
        var H = Cc(F, Q);
        return H.index = 0, H.sibling = null, H;
      }
      function s(F, Q, H) {
        if (F.index = H, !e)
          return F.flags |= Gv, Q;
        var oe = F.alternate;
        if (oe !== null) {
          var Oe = oe.index;
          return Oe < Q ? (F.flags |= ln, Q) : Oe;
        } else
          return F.flags |= ln, Q;
      }
      function f(F) {
        return e && F.alternate === null && (F.flags |= ln), F;
      }
      function v(F, Q, H, oe) {
        if (Q === null || Q.tag !== be) {
          var Oe = j0(H, F.mode, oe);
          return Oe.return = F, Oe;
        } else {
          var we = o(Q, H);
          return we.return = F, we;
        }
      }
      function m(F, Q, H, oe) {
        var Oe = H.type;
        if (Oe === Sa)
          return b(F, Q, H.props.children, oe, H.key);
        if (Q !== null && (Q.elementType === Oe || // Keep this check inline so it only runs on the false path:
        Cb(Q, H) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof Oe == "object" && Oe !== null && Oe.$$typeof === qe && OE(Oe) === Q.type)) {
          var we = o(Q, H.props);
          return we.ref = Op(F, Q, H), we.return = F, we._debugSource = H._source, we._debugOwner = H._owner, we;
        }
        var ut = P0(H, F.mode, oe);
        return ut.ref = Op(F, Q, H), ut.return = F, ut;
      }
      function E(F, Q, H, oe) {
        if (Q === null || Q.tag !== Ne || Q.stateNode.containerInfo !== H.containerInfo || Q.stateNode.implementation !== H.implementation) {
          var Oe = F0(H, F.mode, oe);
          return Oe.return = F, Oe;
        } else {
          var we = o(Q, H.children || []);
          return we.return = F, we;
        }
      }
      function b(F, Q, H, oe, Oe) {
        if (Q === null || Q.tag !== ct) {
          var we = ts(H, F.mode, oe, Oe);
          return we.return = F, we;
        } else {
          var ut = o(Q, H);
          return ut.return = F, ut;
        }
      }
      function L(F, Q, H) {
        if (typeof Q == "string" && Q !== "" || typeof Q == "number") {
          var oe = j0("" + Q, F.mode, H);
          return oe.return = F, oe;
        }
        if (typeof Q == "object" && Q !== null) {
          switch (Q.$$typeof) {
            case Kr: {
              var Oe = P0(Q, F.mode, H);
              return Oe.ref = Op(F, null, Q), Oe.return = F, Oe;
            }
            case Zr: {
              var we = F0(Q, F.mode, H);
              return we.return = F, we;
            }
            case qe: {
              var ut = Q._payload, ht = Q._init;
              return L(F, ht(ut), H);
            }
          }
          if (Ht(Q) || gi(Q)) {
            var tn = ts(Q, F.mode, H, null);
            return tn.return = F, tn;
          }
          hm(F, Q);
        }
        return typeof Q == "function" && mm(F), null;
      }
      function M(F, Q, H, oe) {
        var Oe = Q !== null ? Q.key : null;
        if (typeof H == "string" && H !== "" || typeof H == "number")
          return Oe !== null ? null : v(F, Q, "" + H, oe);
        if (typeof H == "object" && H !== null) {
          switch (H.$$typeof) {
            case Kr:
              return H.key === Oe ? m(F, Q, H, oe) : null;
            case Zr:
              return H.key === Oe ? E(F, Q, H, oe) : null;
            case qe: {
              var we = H._payload, ut = H._init;
              return M(F, Q, ut(we), oe);
            }
          }
          if (Ht(H) || gi(H))
            return Oe !== null ? null : b(F, Q, H, oe, null);
          hm(F, H);
        }
        return typeof H == "function" && mm(F), null;
      }
      function $(F, Q, H, oe, Oe) {
        if (typeof oe == "string" && oe !== "" || typeof oe == "number") {
          var we = F.get(H) || null;
          return v(Q, we, "" + oe, Oe);
        }
        if (typeof oe == "object" && oe !== null) {
          switch (oe.$$typeof) {
            case Kr: {
              var ut = F.get(oe.key === null ? H : oe.key) || null;
              return m(Q, ut, oe, Oe);
            }
            case Zr: {
              var ht = F.get(oe.key === null ? H : oe.key) || null;
              return E(Q, ht, oe, Oe);
            }
            case qe:
              var tn = oe._payload, It = oe._init;
              return $(F, Q, H, It(tn), Oe);
          }
          if (Ht(oe) || gi(oe)) {
            var or = F.get(H) || null;
            return b(Q, or, oe, Oe, null);
          }
          hm(Q, oe);
        }
        return typeof oe == "function" && mm(Q), null;
      }
      function I(F, Q, H) {
        {
          if (typeof F != "object" || F === null)
            return Q;
          switch (F.$$typeof) {
            case Kr:
            case Zr:
              DE(F, H);
              var oe = F.key;
              if (typeof oe != "string")
                break;
              if (Q === null) {
                Q = /* @__PURE__ */ new Set(), Q.add(oe);
                break;
              }
              if (!Q.has(oe)) {
                Q.add(oe);
                break;
              }
              _("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", oe);
              break;
            case qe:
              var Oe = F._payload, we = F._init;
              I(we(Oe), Q, H);
              break;
          }
        }
        return Q;
      }
      function G(F, Q, H, oe) {
        for (var Oe = null, we = 0; we < H.length; we++) {
          var ut = H[we];
          Oe = I(ut, Oe, F);
        }
        for (var ht = null, tn = null, It = Q, or = 0, Yt = 0, er = null; It !== null && Yt < H.length; Yt++) {
          It.index > Yt ? (er = It, It = null) : er = It.sibling;
          var ya = M(F, It, H[Yt], oe);
          if (ya === null) {
            It === null && (It = er);
            break;
          }
          e && It && ya.alternate === null && t(F, It), or = s(ya, or, Yt), tn === null ? ht = ya : tn.sibling = ya, tn = ya, It = er;
        }
        if (Yt === H.length) {
          if (a(F, It), $r()) {
            var Xr = Yt;
            oc(F, Xr);
          }
          return ht;
        }
        if (It === null) {
          for (; Yt < H.length; Yt++) {
            var pi = L(F, H[Yt], oe);
            pi !== null && (or = s(pi, or, Yt), tn === null ? ht = pi : tn.sibling = pi, tn = pi);
          }
          if ($r()) {
            var ka = Yt;
            oc(F, ka);
          }
          return ht;
        }
        for (var Ma = i(F, It); Yt < H.length; Yt++) {
          var ga = $(Ma, F, Yt, H[Yt], oe);
          ga !== null && (e && ga.alternate !== null && Ma.delete(ga.key === null ? Yt : ga.key), or = s(ga, or, Yt), tn === null ? ht = ga : tn.sibling = ga, tn = ga);
        }
        if (e && Ma.forEach(function(ad) {
          return t(F, ad);
        }), $r()) {
          var Qo = Yt;
          oc(F, Qo);
        }
        return ht;
      }
      function De(F, Q, H, oe) {
        var Oe = gi(H);
        if (typeof Oe != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          H[Symbol.toStringTag] === "Generator" && (uS || _("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), uS = !0), H.entries === Oe && (oS || _("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), oS = !0);
          var we = Oe.call(H);
          if (we)
            for (var ut = null, ht = we.next(); !ht.done; ht = we.next()) {
              var tn = ht.value;
              ut = I(tn, ut, F);
            }
        }
        var It = Oe.call(H);
        if (It == null)
          throw new Error("An iterable object provided no iterator.");
        for (var or = null, Yt = null, er = Q, ya = 0, Xr = 0, pi = null, ka = It.next(); er !== null && !ka.done; Xr++, ka = It.next()) {
          er.index > Xr ? (pi = er, er = null) : pi = er.sibling;
          var Ma = M(F, er, ka.value, oe);
          if (Ma === null) {
            er === null && (er = pi);
            break;
          }
          e && er && Ma.alternate === null && t(F, er), ya = s(Ma, ya, Xr), Yt === null ? or = Ma : Yt.sibling = Ma, Yt = Ma, er = pi;
        }
        if (ka.done) {
          if (a(F, er), $r()) {
            var ga = Xr;
            oc(F, ga);
          }
          return or;
        }
        if (er === null) {
          for (; !ka.done; Xr++, ka = It.next()) {
            var Qo = L(F, ka.value, oe);
            Qo !== null && (ya = s(Qo, ya, Xr), Yt === null ? or = Qo : Yt.sibling = Qo, Yt = Qo);
          }
          if ($r()) {
            var ad = Xr;
            oc(F, ad);
          }
          return or;
        }
        for (var iv = i(F, er); !ka.done; Xr++, ka = It.next()) {
          var ao = $(iv, F, Xr, ka.value, oe);
          ao !== null && (e && ao.alternate !== null && iv.delete(ao.key === null ? Xr : ao.key), ya = s(ao, ya, Xr), Yt === null ? or = ao : Yt.sibling = ao, Yt = ao);
        }
        if (e && iv.forEach(function(oO) {
          return t(F, oO);
        }), $r()) {
          var lO = Xr;
          oc(F, lO);
        }
        return or;
      }
      function et(F, Q, H, oe) {
        if (Q !== null && Q.tag === be) {
          a(F, Q.sibling);
          var Oe = o(Q, H);
          return Oe.return = F, Oe;
        }
        a(F, Q);
        var we = j0(H, F.mode, oe);
        return we.return = F, we;
      }
      function We(F, Q, H, oe) {
        for (var Oe = H.key, we = Q; we !== null; ) {
          if (we.key === Oe) {
            var ut = H.type;
            if (ut === Sa) {
              if (we.tag === ct) {
                a(F, we.sibling);
                var ht = o(we, H.props.children);
                return ht.return = F, ht._debugSource = H._source, ht._debugOwner = H._owner, ht;
              }
            } else if (we.elementType === ut || // Keep this check inline so it only runs on the false path:
            Cb(we, H) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof ut == "object" && ut !== null && ut.$$typeof === qe && OE(ut) === we.type) {
              a(F, we.sibling);
              var tn = o(we, H.props);
              return tn.ref = Op(F, we, H), tn.return = F, tn._debugSource = H._source, tn._debugOwner = H._owner, tn;
            }
            a(F, we);
            break;
          } else
            t(F, we);
          we = we.sibling;
        }
        if (H.type === Sa) {
          var It = ts(H.props.children, F.mode, oe, H.key);
          return It.return = F, It;
        } else {
          var or = P0(H, F.mode, oe);
          return or.ref = Op(F, Q, H), or.return = F, or;
        }
      }
      function Ut(F, Q, H, oe) {
        for (var Oe = H.key, we = Q; we !== null; ) {
          if (we.key === Oe)
            if (we.tag === Ne && we.stateNode.containerInfo === H.containerInfo && we.stateNode.implementation === H.implementation) {
              a(F, we.sibling);
              var ut = o(we, H.children || []);
              return ut.return = F, ut;
            } else {
              a(F, we);
              break;
            }
          else
            t(F, we);
          we = we.sibling;
        }
        var ht = F0(H, F.mode, oe);
        return ht.return = F, ht;
      }
      function Mt(F, Q, H, oe) {
        var Oe = typeof H == "object" && H !== null && H.type === Sa && H.key === null;
        if (Oe && (H = H.props.children), typeof H == "object" && H !== null) {
          switch (H.$$typeof) {
            case Kr:
              return f(We(F, Q, H, oe));
            case Zr:
              return f(Ut(F, Q, H, oe));
            case qe:
              var we = H._payload, ut = H._init;
              return Mt(F, Q, ut(we), oe);
          }
          if (Ht(H))
            return G(F, Q, H, oe);
          if (gi(H))
            return De(F, Q, H, oe);
          hm(F, H);
        }
        return typeof H == "string" && H !== "" || typeof H == "number" ? f(et(F, Q, "" + H, oe)) : (typeof H == "function" && mm(F), a(F, Q));
      }
      return Mt;
    }
    var Vf = kE(!0), ME = kE(!1);
    function QR(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = Cc(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = Cc(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function qR(e, t) {
      for (var a = e.child; a !== null; )
        wD(a, t), a = a.sibling;
    }
    var kp = {}, Wu = Bu(kp), Mp = Bu(kp), ym = Bu(kp);
    function gm(e) {
      if (e === kp)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function NE() {
      var e = gm(ym.current);
      return e;
    }
    function dS(e, t) {
      ha(ym, t, e), ha(Mp, e, e), ha(Wu, kp, e);
      var a = sw(t);
      va(Wu, e), ha(Wu, a, e);
    }
    function $f(e) {
      va(Wu, e), va(Mp, e), va(ym, e);
    }
    function pS() {
      var e = gm(Wu.current);
      return e;
    }
    function LE(e) {
      gm(ym.current);
      var t = gm(Wu.current), a = cw(t, e.type);
      t !== a && (ha(Mp, e, e), ha(Wu, a, e));
    }
    function vS(e) {
      Mp.current === e && (va(Wu, e), va(Mp, e));
    }
    var XR = 0, AE = 1, zE = 1, Np = 2, vl = Bu(XR);
    function hS(e, t) {
      return (e & t) !== 0;
    }
    function If(e) {
      return e & AE;
    }
    function mS(e, t) {
      return e & AE | t;
    }
    function KR(e, t) {
      return e | t;
    }
    function Gu(e, t) {
      ha(vl, t, e);
    }
    function Yf(e) {
      va(vl, e);
    }
    function ZR(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function Sm(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === Le) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || YC(i) || _g(i))
              return t;
          }
        } else if (t.tag === xt && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var o = (t.flags & dt) !== Ze;
          if (o)
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
    ), _r = (
      /* */
      1
    ), Kl = (
      /*  */
      2
    ), br = (
      /*    */
      4
    ), Ir = (
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
    function JR(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var Te = C.ReactCurrentDispatcher, Lp = C.ReactCurrentBatchConfig, SS, Wf;
    SS = /* @__PURE__ */ new Set();
    var pc = X, en = null, wr = null, Rr = null, Cm = !1, Ap = !1, zp = 0, eT = 0, tT = 25, Z = null, Ui = null, Qu = -1, CS = !1;
    function Gt() {
      {
        var e = Z;
        Ui === null ? Ui = [e] : Ui.push(e);
      }
    }
    function Se() {
      {
        var e = Z;
        Ui !== null && (Qu++, Ui[Qu] !== e && nT(e));
      }
    }
    function Gf(e) {
      e != null && !Ht(e) && _("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", Z, typeof e);
    }
    function nT(e) {
      {
        var t = st(en);
        if (!SS.has(t) && (SS.add(t), Ui !== null)) {
          for (var a = "", i = 30, o = 0; o <= Qu; o++) {
            for (var s = Ui[o], f = o === Qu ? e : s, v = o + 1 + ". " + s; v.length < i; )
              v += " ";
            v += f + `
`, a += v;
          }
          _(`React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks

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
        return _("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", Z), !1;
      e.length !== t.length && _(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, Z, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!ze(e[a], t[a]))
          return !1;
      return !0;
    }
    function Qf(e, t, a, i, o, s) {
      pc = s, en = t, Ui = e !== null ? e._debugHookTypes : null, Qu = -1, CS = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = X, e !== null && e.memoizedState !== null ? Te.current = r_ : Ui !== null ? Te.current = n_ : Te.current = t_;
      var f = a(i, o);
      if (Ap) {
        var v = 0;
        do {
          if (Ap = !1, zp = 0, v >= tT)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          v += 1, CS = !1, wr = null, Rr = null, t.updateQueue = null, Qu = -1, Te.current = a_, f = a(i, o);
        } while (Ap);
      }
      Te.current = Lm, t._debugHookTypes = Ui;
      var m = wr !== null && wr.next !== null;
      if (pc = X, en = null, wr = null, Rr = null, Z = null, Ui = null, Qu = -1, e !== null && (e.flags & Cr) !== (t.flags & Cr) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & Ye) !== Je && _("Internal React error: Expected static flag was missing. Please notify the React team."), Cm = !1, m)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function qf() {
      var e = zp !== 0;
      return zp = 0, e;
    }
    function UE(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & Ba) !== Je ? t.flags &= ~(So | Fa | aa | $e) : t.flags &= ~(aa | $e), e.lanes = Is(e.lanes, a);
    }
    function PE() {
      if (Te.current = Lm, Cm) {
        for (var e = en.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        Cm = !1;
      }
      pc = X, en = null, wr = null, Rr = null, Ui = null, Qu = -1, Z = null, XE = !1, Ap = !1, zp = 0;
    }
    function Zl() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return Rr === null ? en.memoizedState = Rr = e : Rr = Rr.next = e, Rr;
    }
    function Pi() {
      var e;
      if (wr === null) {
        var t = en.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = wr.next;
      var a;
      if (Rr === null ? a = en.memoizedState : a = Rr.next, a !== null)
        Rr = a, a = Rr.next, wr = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        wr = e;
        var i = {
          memoizedState: wr.memoizedState,
          baseState: wr.baseState,
          baseQueue: wr.baseQueue,
          queue: wr.queue,
          next: null
        };
        Rr === null ? en.memoizedState = Rr = i : Rr = Rr.next = i;
      }
      return Rr;
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
      var i = Zl(), o;
      a !== void 0 ? o = a(t) : o = t, i.memoizedState = i.baseState = o;
      var s = {
        pending: null,
        interleaved: null,
        lanes: X,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: o
      };
      i.queue = s;
      var f = s.dispatch = lT.bind(null, en, s);
      return [i.memoizedState, f];
    }
    function wS(e, t, a) {
      var i = Pi(), o = i.queue;
      if (o === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      o.lastRenderedReducer = e;
      var s = wr, f = s.baseQueue, v = o.pending;
      if (v !== null) {
        if (f !== null) {
          var m = f.next, E = v.next;
          f.next = E, v.next = m;
        }
        s.baseQueue !== f && _("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), s.baseQueue = f = v, o.pending = null;
      }
      if (f !== null) {
        var b = f.next, L = s.baseState, M = null, $ = null, I = null, G = b;
        do {
          var De = G.lane;
          if (Oo(pc, De)) {
            if (I !== null) {
              var We = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: $n,
                action: G.action,
                hasEagerState: G.hasEagerState,
                eagerState: G.eagerState,
                next: null
              };
              I = I.next = We;
            }
            if (G.hasEagerState)
              L = G.eagerState;
            else {
              var Ut = G.action;
              L = e(L, Ut);
            }
          } else {
            var et = {
              lane: De,
              action: G.action,
              hasEagerState: G.hasEagerState,
              eagerState: G.eagerState,
              next: null
            };
            I === null ? ($ = I = et, M = L) : I = I.next = et, en.lanes = mt(en.lanes, De), ev(De);
          }
          G = G.next;
        } while (G !== null && G !== b);
        I === null ? M = L : I.next = $, ze(L, i.memoizedState) || Vp(), i.memoizedState = L, i.baseState = M, i.baseQueue = I, o.lastRenderedState = L;
      }
      var Mt = o.interleaved;
      if (Mt !== null) {
        var F = Mt;
        do {
          var Q = F.lane;
          en.lanes = mt(en.lanes, Q), ev(Q), F = F.next;
        } while (F !== Mt);
      } else
        f === null && (o.lanes = X);
      var H = o.dispatch;
      return [i.memoizedState, H];
    }
    function RS(e, t, a) {
      var i = Pi(), o = i.queue;
      if (o === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      o.lastRenderedReducer = e;
      var s = o.dispatch, f = o.pending, v = i.memoizedState;
      if (f !== null) {
        o.pending = null;
        var m = f.next, E = m;
        do {
          var b = E.action;
          v = e(v, b), E = E.next;
        } while (E !== m);
        ze(v, i.memoizedState) || Vp(), i.memoizedState = v, i.baseQueue === null && (i.baseState = v), o.lastRenderedState = v;
      }
      return [v, s];
    }
    function Mk(e, t, a) {
    }
    function Nk(e, t, a) {
    }
    function TS(e, t, a) {
      var i = en, o = Zl(), s, f = $r();
      if (f) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), Wf || s !== a() && (_("The result of getServerSnapshot should be cached to avoid an infinite loop"), Wf = !0);
      } else {
        if (s = t(), !Wf) {
          var v = t();
          ze(s, v) || (_("The result of getSnapshot should be cached to avoid an infinite loop"), Wf = !0);
        }
        var m = Km();
        if (m === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        $s(m, pc) || FE(i, t, s);
      }
      o.memoizedState = s;
      var E = {
        value: s,
        getSnapshot: t
      };
      return o.queue = E, Rm(BE.bind(null, i, E, e), [e]), i.flags |= aa, Up(_r | Ir, HE.bind(null, i, E, s, t), void 0, null), s;
    }
    function Em(e, t, a) {
      var i = en, o = Pi(), s = t();
      if (!Wf) {
        var f = t();
        ze(s, f) || (_("The result of getSnapshot should be cached to avoid an infinite loop"), Wf = !0);
      }
      var v = o.memoizedState, m = !ze(v, s);
      m && (o.memoizedState = s, Vp());
      var E = o.queue;
      if (jp(BE.bind(null, i, E, e), [e]), E.getSnapshot !== t || m || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      Rr !== null && Rr.memoizedState.tag & _r) {
        i.flags |= aa, Up(_r | Ir, HE.bind(null, i, E, s, t), void 0, null);
        var b = Km();
        if (b === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        $s(b, pc) || FE(i, t, s);
      }
      return s;
    }
    function FE(e, t, a) {
      e.flags |= go;
      var i = {
        getSnapshot: t,
        value: a
      }, o = en.updateQueue;
      if (o === null)
        o = jE(), en.updateQueue = o, o.stores = [i];
      else {
        var s = o.stores;
        s === null ? o.stores = [i] : s.push(i);
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
        return !ze(a, i);
      } catch {
        return !0;
      }
    }
    function $E(e) {
      var t = qa(e, rt);
      t !== null && Or(t, e, rt, dn);
    }
    function _m(e) {
      var t = Zl();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: X,
        dispatch: null,
        lastRenderedReducer: _S,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = oT.bind(null, en, a);
      return [t.memoizedState, i];
    }
    function xS(e) {
      return wS(_S);
    }
    function DS(e) {
      return RS(_S);
    }
    function Up(e, t, a, i) {
      var o = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = en.updateQueue;
      if (s === null)
        s = jE(), en.updateQueue = s, s.lastEffect = o.next = o;
      else {
        var f = s.lastEffect;
        if (f === null)
          s.lastEffect = o.next = o;
        else {
          var v = f.next;
          f.next = o, o.next = v, s.lastEffect = o;
        }
      }
      return o;
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
      var t = Pi();
      return t.memoizedState;
    }
    function Pp(e, t, a, i) {
      var o = Zl(), s = i === void 0 ? null : i;
      en.flags |= e, o.memoizedState = Up(_r | t, a, void 0, s);
    }
    function wm(e, t, a, i) {
      var o = Pi(), s = i === void 0 ? null : i, f = void 0;
      if (wr !== null) {
        var v = wr.memoizedState;
        if (f = v.destroy, s !== null) {
          var m = v.deps;
          if (ES(s, m)) {
            o.memoizedState = Up(t, a, f, s);
            return;
          }
        }
      }
      en.flags |= e, o.memoizedState = Up(_r | t, a, f, s);
    }
    function Rm(e, t) {
      return (en.mode & Ba) !== Je ? Pp(So | aa | zl, Ir, e, t) : Pp(aa | zl, Ir, e, t);
    }
    function jp(e, t) {
      return wm(aa, Ir, e, t);
    }
    function kS(e, t) {
      return Pp($e, Kl, e, t);
    }
    function Tm(e, t) {
      return wm($e, Kl, e, t);
    }
    function MS(e, t) {
      var a = $e;
      return a |= ja, (en.mode & Ba) !== Je && (a |= Fa), Pp(a, br, e, t);
    }
    function xm(e, t) {
      return wm($e, br, e, t);
    }
    function IE(e, t) {
      if (typeof t == "function") {
        var a = t, i = e();
        return a(i), function() {
          a(null);
        };
      } else if (t != null) {
        var o = t;
        o.hasOwnProperty("current") || _("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(o).join(", ") + "}");
        var s = e();
        return o.current = s, function() {
          o.current = null;
        };
      }
    }
    function NS(e, t, a) {
      typeof t != "function" && _("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, o = $e;
      return o |= ja, (en.mode & Ba) !== Je && (o |= Fa), Pp(o, br, IE.bind(null, t, e), i);
    }
    function Dm(e, t, a) {
      typeof t != "function" && _("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return wm($e, br, IE.bind(null, t, e), i);
    }
    function rT(e, t) {
    }
    var Om = rT;
    function LS(e, t) {
      var a = Zl(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function km(e, t) {
      var a = Pi(), i = t === void 0 ? null : t, o = a.memoizedState;
      if (o !== null && i !== null) {
        var s = o[1];
        if (ES(i, s))
          return o[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function AS(e, t) {
      var a = Zl(), i = t === void 0 ? null : t, o = e();
      return a.memoizedState = [o, i], o;
    }
    function Mm(e, t) {
      var a = Pi(), i = t === void 0 ? null : t, o = a.memoizedState;
      if (o !== null && i !== null) {
        var s = o[1];
        if (ES(i, s))
          return o[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function zS(e) {
      var t = Zl();
      return t.memoizedState = e, e;
    }
    function YE(e) {
      var t = Pi(), a = wr, i = a.memoizedState;
      return GE(t, i, e);
    }
    function WE(e) {
      var t = Pi();
      if (wr === null)
        return t.memoizedState = e, e;
      var a = wr.memoizedState;
      return GE(t, a, e);
    }
    function GE(e, t, a) {
      var i = !lh(pc);
      if (i) {
        if (!ze(a, t)) {
          var o = sh();
          en.lanes = mt(en.lanes, o), ev(o), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, Vp()), e.memoizedState = a, a;
    }
    function aT(e, t, a) {
      var i = $a();
      zn($y(i, ll)), e(!0);
      var o = Lp.transition;
      Lp.transition = {};
      var s = Lp.transition;
      Lp.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (zn(i), Lp.transition = o, o === null && s._updatedFibers) {
          var f = s._updatedFibers.size;
          f > 10 && P("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function US() {
      var e = _m(!1), t = e[0], a = e[1], i = aT.bind(null, a), o = Zl();
      return o.memoizedState = i, [t, i];
    }
    function QE() {
      var e = xS(), t = e[0], a = Pi(), i = a.memoizedState;
      return [t, i];
    }
    function qE() {
      var e = DS(), t = e[0], a = Pi(), i = a.memoizedState;
      return [t, i];
    }
    var XE = !1;
    function iT() {
      return XE;
    }
    function PS() {
      var e = Zl(), t = Km(), a = t.identifierPrefix, i;
      if ($r()) {
        var o = SR();
        i = ":" + a + "R" + o;
        var s = zp++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = eT++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function Nm() {
      var e = Pi(), t = e.memoizedState;
      return t;
    }
    function lT(e, t, a) {
      typeof arguments[3] == "function" && _("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Ju(e), o = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (KE(e))
        ZE(t, o);
      else {
        var s = hE(e, t, o, i);
        if (s !== null) {
          var f = Oa();
          Or(s, e, i, f), JE(s, t, i);
        }
      }
      e_(e, i);
    }
    function oT(e, t, a) {
      typeof arguments[3] == "function" && _("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Ju(e), o = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (KE(e))
        ZE(t, o);
      else {
        var s = e.alternate;
        if (e.lanes === X && (s === null || s.lanes === X)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var v;
            v = Te.current, Te.current = hl;
            try {
              var m = t.lastRenderedState, E = f(m, a);
              if (o.hasEagerState = !0, o.eagerState = E, ze(E, m)) {
                FR(e, t, o, i);
                return;
              }
            } catch {
            } finally {
              Te.current = v;
            }
          }
        }
        var b = hE(e, t, o, i);
        if (b !== null) {
          var L = Oa();
          Or(b, e, i, L), JE(b, t, i);
        }
      }
      e_(e, i);
    }
    function KE(e) {
      var t = e.alternate;
      return e === en || t !== null && t === en;
    }
    function ZE(e, t) {
      Ap = Cm = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function JE(e, t, a) {
      if (Id(a)) {
        var i = t.lanes;
        i = af(i, e.pendingLanes);
        var o = mt(i, a);
        t.lanes = o, Yd(e, o);
      }
    }
    function e_(e, t, a) {
      Vc(e, t);
    }
    var Lm = {
      readContext: hr,
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
      unstable_isNewReconciler: ke
    }, t_ = null, n_ = null, r_ = null, a_ = null, Jl = null, hl = null, Am = null;
    {
      var jS = function() {
        _("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, pt = function() {
        _("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      t_ = {
        readContext: function(e) {
          return hr(e);
        },
        useCallback: function(e, t) {
          return Z = "useCallback", Gt(), Gf(t), LS(e, t);
        },
        useContext: function(e) {
          return Z = "useContext", Gt(), hr(e);
        },
        useEffect: function(e, t) {
          return Z = "useEffect", Gt(), Gf(t), Rm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Z = "useImperativeHandle", Gt(), Gf(a), NS(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Z = "useInsertionEffect", Gt(), Gf(t), kS(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Z = "useLayoutEffect", Gt(), Gf(t), MS(e, t);
        },
        useMemo: function(e, t) {
          Z = "useMemo", Gt(), Gf(t);
          var a = Te.current;
          Te.current = Jl;
          try {
            return AS(e, t);
          } finally {
            Te.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Z = "useReducer", Gt();
          var i = Te.current;
          Te.current = Jl;
          try {
            return bS(e, t, a);
          } finally {
            Te.current = i;
          }
        },
        useRef: function(e) {
          return Z = "useRef", Gt(), OS(e);
        },
        useState: function(e) {
          Z = "useState", Gt();
          var t = Te.current;
          Te.current = Jl;
          try {
            return _m(e);
          } finally {
            Te.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Z = "useDebugValue", Gt(), void 0;
        },
        useDeferredValue: function(e) {
          return Z = "useDeferredValue", Gt(), zS(e);
        },
        useTransition: function() {
          return Z = "useTransition", Gt(), US();
        },
        useMutableSource: function(e, t, a) {
          return Z = "useMutableSource", Gt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Z = "useSyncExternalStore", Gt(), TS(e, t, a);
        },
        useId: function() {
          return Z = "useId", Gt(), PS();
        },
        unstable_isNewReconciler: ke
      }, n_ = {
        readContext: function(e) {
          return hr(e);
        },
        useCallback: function(e, t) {
          return Z = "useCallback", Se(), LS(e, t);
        },
        useContext: function(e) {
          return Z = "useContext", Se(), hr(e);
        },
        useEffect: function(e, t) {
          return Z = "useEffect", Se(), Rm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Z = "useImperativeHandle", Se(), NS(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Z = "useInsertionEffect", Se(), kS(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Z = "useLayoutEffect", Se(), MS(e, t);
        },
        useMemo: function(e, t) {
          Z = "useMemo", Se();
          var a = Te.current;
          Te.current = Jl;
          try {
            return AS(e, t);
          } finally {
            Te.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Z = "useReducer", Se();
          var i = Te.current;
          Te.current = Jl;
          try {
            return bS(e, t, a);
          } finally {
            Te.current = i;
          }
        },
        useRef: function(e) {
          return Z = "useRef", Se(), OS(e);
        },
        useState: function(e) {
          Z = "useState", Se();
          var t = Te.current;
          Te.current = Jl;
          try {
            return _m(e);
          } finally {
            Te.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Z = "useDebugValue", Se(), void 0;
        },
        useDeferredValue: function(e) {
          return Z = "useDeferredValue", Se(), zS(e);
        },
        useTransition: function() {
          return Z = "useTransition", Se(), US();
        },
        useMutableSource: function(e, t, a) {
          return Z = "useMutableSource", Se(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Z = "useSyncExternalStore", Se(), TS(e, t, a);
        },
        useId: function() {
          return Z = "useId", Se(), PS();
        },
        unstable_isNewReconciler: ke
      }, r_ = {
        readContext: function(e) {
          return hr(e);
        },
        useCallback: function(e, t) {
          return Z = "useCallback", Se(), km(e, t);
        },
        useContext: function(e) {
          return Z = "useContext", Se(), hr(e);
        },
        useEffect: function(e, t) {
          return Z = "useEffect", Se(), jp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Z = "useImperativeHandle", Se(), Dm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Z = "useInsertionEffect", Se(), Tm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Z = "useLayoutEffect", Se(), xm(e, t);
        },
        useMemo: function(e, t) {
          Z = "useMemo", Se();
          var a = Te.current;
          Te.current = hl;
          try {
            return Mm(e, t);
          } finally {
            Te.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Z = "useReducer", Se();
          var i = Te.current;
          Te.current = hl;
          try {
            return wS(e, t, a);
          } finally {
            Te.current = i;
          }
        },
        useRef: function(e) {
          return Z = "useRef", Se(), bm();
        },
        useState: function(e) {
          Z = "useState", Se();
          var t = Te.current;
          Te.current = hl;
          try {
            return xS(e);
          } finally {
            Te.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Z = "useDebugValue", Se(), Om();
        },
        useDeferredValue: function(e) {
          return Z = "useDeferredValue", Se(), YE(e);
        },
        useTransition: function() {
          return Z = "useTransition", Se(), QE();
        },
        useMutableSource: function(e, t, a) {
          return Z = "useMutableSource", Se(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Z = "useSyncExternalStore", Se(), Em(e, t);
        },
        useId: function() {
          return Z = "useId", Se(), Nm();
        },
        unstable_isNewReconciler: ke
      }, a_ = {
        readContext: function(e) {
          return hr(e);
        },
        useCallback: function(e, t) {
          return Z = "useCallback", Se(), km(e, t);
        },
        useContext: function(e) {
          return Z = "useContext", Se(), hr(e);
        },
        useEffect: function(e, t) {
          return Z = "useEffect", Se(), jp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Z = "useImperativeHandle", Se(), Dm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Z = "useInsertionEffect", Se(), Tm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Z = "useLayoutEffect", Se(), xm(e, t);
        },
        useMemo: function(e, t) {
          Z = "useMemo", Se();
          var a = Te.current;
          Te.current = Am;
          try {
            return Mm(e, t);
          } finally {
            Te.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Z = "useReducer", Se();
          var i = Te.current;
          Te.current = Am;
          try {
            return RS(e, t, a);
          } finally {
            Te.current = i;
          }
        },
        useRef: function(e) {
          return Z = "useRef", Se(), bm();
        },
        useState: function(e) {
          Z = "useState", Se();
          var t = Te.current;
          Te.current = Am;
          try {
            return DS(e);
          } finally {
            Te.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Z = "useDebugValue", Se(), Om();
        },
        useDeferredValue: function(e) {
          return Z = "useDeferredValue", Se(), WE(e);
        },
        useTransition: function() {
          return Z = "useTransition", Se(), qE();
        },
        useMutableSource: function(e, t, a) {
          return Z = "useMutableSource", Se(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Z = "useSyncExternalStore", Se(), Em(e, t);
        },
        useId: function() {
          return Z = "useId", Se(), Nm();
        },
        unstable_isNewReconciler: ke
      }, Jl = {
        readContext: function(e) {
          return jS(), hr(e);
        },
        useCallback: function(e, t) {
          return Z = "useCallback", pt(), Gt(), LS(e, t);
        },
        useContext: function(e) {
          return Z = "useContext", pt(), Gt(), hr(e);
        },
        useEffect: function(e, t) {
          return Z = "useEffect", pt(), Gt(), Rm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Z = "useImperativeHandle", pt(), Gt(), NS(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Z = "useInsertionEffect", pt(), Gt(), kS(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Z = "useLayoutEffect", pt(), Gt(), MS(e, t);
        },
        useMemo: function(e, t) {
          Z = "useMemo", pt(), Gt();
          var a = Te.current;
          Te.current = Jl;
          try {
            return AS(e, t);
          } finally {
            Te.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Z = "useReducer", pt(), Gt();
          var i = Te.current;
          Te.current = Jl;
          try {
            return bS(e, t, a);
          } finally {
            Te.current = i;
          }
        },
        useRef: function(e) {
          return Z = "useRef", pt(), Gt(), OS(e);
        },
        useState: function(e) {
          Z = "useState", pt(), Gt();
          var t = Te.current;
          Te.current = Jl;
          try {
            return _m(e);
          } finally {
            Te.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Z = "useDebugValue", pt(), Gt(), void 0;
        },
        useDeferredValue: function(e) {
          return Z = "useDeferredValue", pt(), Gt(), zS(e);
        },
        useTransition: function() {
          return Z = "useTransition", pt(), Gt(), US();
        },
        useMutableSource: function(e, t, a) {
          return Z = "useMutableSource", pt(), Gt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Z = "useSyncExternalStore", pt(), Gt(), TS(e, t, a);
        },
        useId: function() {
          return Z = "useId", pt(), Gt(), PS();
        },
        unstable_isNewReconciler: ke
      }, hl = {
        readContext: function(e) {
          return jS(), hr(e);
        },
        useCallback: function(e, t) {
          return Z = "useCallback", pt(), Se(), km(e, t);
        },
        useContext: function(e) {
          return Z = "useContext", pt(), Se(), hr(e);
        },
        useEffect: function(e, t) {
          return Z = "useEffect", pt(), Se(), jp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Z = "useImperativeHandle", pt(), Se(), Dm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Z = "useInsertionEffect", pt(), Se(), Tm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Z = "useLayoutEffect", pt(), Se(), xm(e, t);
        },
        useMemo: function(e, t) {
          Z = "useMemo", pt(), Se();
          var a = Te.current;
          Te.current = hl;
          try {
            return Mm(e, t);
          } finally {
            Te.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Z = "useReducer", pt(), Se();
          var i = Te.current;
          Te.current = hl;
          try {
            return wS(e, t, a);
          } finally {
            Te.current = i;
          }
        },
        useRef: function(e) {
          return Z = "useRef", pt(), Se(), bm();
        },
        useState: function(e) {
          Z = "useState", pt(), Se();
          var t = Te.current;
          Te.current = hl;
          try {
            return xS(e);
          } finally {
            Te.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Z = "useDebugValue", pt(), Se(), Om();
        },
        useDeferredValue: function(e) {
          return Z = "useDeferredValue", pt(), Se(), YE(e);
        },
        useTransition: function() {
          return Z = "useTransition", pt(), Se(), QE();
        },
        useMutableSource: function(e, t, a) {
          return Z = "useMutableSource", pt(), Se(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Z = "useSyncExternalStore", pt(), Se(), Em(e, t);
        },
        useId: function() {
          return Z = "useId", pt(), Se(), Nm();
        },
        unstable_isNewReconciler: ke
      }, Am = {
        readContext: function(e) {
          return jS(), hr(e);
        },
        useCallback: function(e, t) {
          return Z = "useCallback", pt(), Se(), km(e, t);
        },
        useContext: function(e) {
          return Z = "useContext", pt(), Se(), hr(e);
        },
        useEffect: function(e, t) {
          return Z = "useEffect", pt(), Se(), jp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Z = "useImperativeHandle", pt(), Se(), Dm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Z = "useInsertionEffect", pt(), Se(), Tm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Z = "useLayoutEffect", pt(), Se(), xm(e, t);
        },
        useMemo: function(e, t) {
          Z = "useMemo", pt(), Se();
          var a = Te.current;
          Te.current = hl;
          try {
            return Mm(e, t);
          } finally {
            Te.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Z = "useReducer", pt(), Se();
          var i = Te.current;
          Te.current = hl;
          try {
            return RS(e, t, a);
          } finally {
            Te.current = i;
          }
        },
        useRef: function(e) {
          return Z = "useRef", pt(), Se(), bm();
        },
        useState: function(e) {
          Z = "useState", pt(), Se();
          var t = Te.current;
          Te.current = hl;
          try {
            return DS(e);
          } finally {
            Te.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Z = "useDebugValue", pt(), Se(), Om();
        },
        useDeferredValue: function(e) {
          return Z = "useDeferredValue", pt(), Se(), WE(e);
        },
        useTransition: function() {
          return Z = "useTransition", pt(), Se(), qE();
        },
        useMutableSource: function(e, t, a) {
          return Z = "useMutableSource", pt(), Se(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Z = "useSyncExternalStore", pt(), Se(), Em(e, t);
        },
        useId: function() {
          return Z = "useId", pt(), Se(), Nm();
        },
        unstable_isNewReconciler: ke
      };
    }
    var qu = h.unstable_now, i_ = 0, zm = -1, Fp = -1, Um = -1, FS = !1, Pm = !1;
    function l_() {
      return FS;
    }
    function uT() {
      Pm = !0;
    }
    function sT() {
      FS = !1, Pm = !1;
    }
    function cT() {
      FS = Pm, Pm = !1;
    }
    function o_() {
      return i_;
    }
    function u_() {
      i_ = qu();
    }
    function HS(e) {
      Fp = qu(), e.actualStartTime < 0 && (e.actualStartTime = qu());
    }
    function s_(e) {
      Fp = -1;
    }
    function jm(e, t) {
      if (Fp >= 0) {
        var a = qu() - Fp;
        e.actualDuration += a, t && (e.selfBaseDuration = a), Fp = -1;
      }
    }
    function eo(e) {
      if (zm >= 0) {
        var t = qu() - zm;
        zm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case re:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case Nt:
              var o = a.stateNode;
              o.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function BS(e) {
      if (Um >= 0) {
        var t = qu() - Um;
        Um = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case re:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case Nt:
              var o = a.stateNode;
              o !== null && (o.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function to() {
      zm = qu();
    }
    function VS() {
      Um = qu();
    }
    function $S(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function vc(e, t) {
      return {
        value: e,
        source: t,
        stack: Zo(t),
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
    function fT(e, t) {
      return !0;
    }
    function YS(e, t) {
      try {
        var a = fT(e, t);
        if (a === !1)
          return;
        var i = t.value, o = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === ne)
            return;
          console.error(i);
        }
        var v = o ? st(o) : null, m = v ? "The above error occurred in the <" + v + "> component:" : "The above error occurred in one of your React components:", E;
        if (e.tag === re)
          E = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var b = st(e) || "Anonymous";
          E = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + b + ".");
        }
        var L = m + `
` + f + `

` + ("" + E);
        console.error(L);
      } catch (M) {
        setTimeout(function() {
          throw M;
        });
      }
    }
    var dT = typeof WeakMap == "function" ? WeakMap : Map;
    function c_(e, t, a) {
      var i = Vo(dn, a);
      i.tag = Yg, i.payload = {
        element: null
      };
      var o = t.value;
      return i.callback = function() {
        aD(o), YS(e, t);
      }, i;
    }
    function WS(e, t, a) {
      var i = Vo(dn, a);
      i.tag = Yg;
      var o = e.type.getDerivedStateFromError;
      if (typeof o == "function") {
        var s = t.value;
        i.payload = function() {
          return o(s);
        }, i.callback = function() {
          Eb(e), YS(e, t);
        };
      }
      var f = e.stateNode;
      return f !== null && typeof f.componentDidCatch == "function" && (i.callback = function() {
        Eb(e), YS(e, t), typeof o != "function" && nD(this);
        var m = t.value, E = t.stack;
        this.componentDidCatch(m, {
          componentStack: E !== null ? E : ""
        }), typeof o != "function" && (da(e.lanes, rt) || _("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", st(e) || "Unknown"));
      }), i;
    }
    function f_(e, t, a) {
      var i = e.pingCache, o;
      if (i === null ? (i = e.pingCache = new dT(), o = /* @__PURE__ */ new Set(), i.set(t, o)) : (o = i.get(t), o === void 0 && (o = /* @__PURE__ */ new Set(), i.set(t, o))), !o.has(a)) {
        o.add(a);
        var s = iD.bind(null, e, t, a);
        Ra && tv(e, a), t.then(s, s);
      }
    }
    function pT(e, t, a, i) {
      var o = e.updateQueue;
      if (o === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        o.add(a);
    }
    function vT(e, t) {
      var a = e.tag;
      if ((e.mode & Ye) === Je && (a === ve || a === Qe || a === ot)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function d_(e) {
      var t = e;
      do {
        if (t.tag === Le && ZR(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function p_(e, t, a, i, o) {
      if ((e.mode & Ye) === Je) {
        if (e === t)
          e.flags |= Sr;
        else {
          if (e.flags |= dt, a.flags |= zc, a.flags &= ~(Wv | Al), a.tag === ne) {
            var s = a.alternate;
            if (s === null)
              a.tag = gn;
            else {
              var f = Vo(dn, rt);
              f.tag = um, Yu(a, f, rt);
            }
          }
          a.lanes = mt(a.lanes, rt);
        }
        return e;
      }
      return e.flags |= Sr, e.lanes = o, e;
    }
    function hT(e, t, a, i, o) {
      if (a.flags |= Al, Ra && tv(e, o), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        vT(a), $r() && a.mode & Ye && rE();
        var f = d_(t);
        if (f !== null) {
          f.flags &= ~Hr, p_(f, t, a, e, o), f.mode & Ye && f_(e, s, o), pT(f, e, s);
          return;
        } else {
          if (!$d(o)) {
            f_(e, s, o), R0();
            return;
          }
          var v = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = v;
        }
      } else if ($r() && a.mode & Ye) {
        rE();
        var m = d_(t);
        if (m !== null) {
          (m.flags & Sr) === Ze && (m.flags |= Hr), p_(m, t, a, e, o), jg(vc(i, a));
          return;
        }
      }
      i = vc(i, a), Qx(i);
      var E = t;
      do {
        switch (E.tag) {
          case re: {
            var b = i;
            E.flags |= Sr;
            var L = _u(o);
            E.lanes = mt(E.lanes, L);
            var M = c_(E, b, L);
            Qg(E, M);
            return;
          }
          case ne:
            var $ = i, I = E.type, G = E.stateNode;
            if ((E.flags & dt) === Ze && (typeof I.getDerivedStateFromError == "function" || G !== null && typeof G.componentDidCatch == "function" && !db(G))) {
              E.flags |= Sr;
              var De = _u(o);
              E.lanes = mt(E.lanes, De);
              var et = WS(E, $, De);
              Qg(E, et);
              return;
            }
            break;
        }
        E = E.return;
      } while (E !== null);
    }
    function mT() {
      return null;
    }
    var Hp = C.ReactCurrentOwner, ml = !1, GS, Bp, QS, qS, XS, hc, KS, Fm;
    GS = {}, Bp = {}, QS = {}, qS = {}, XS = {}, hc = !1, KS = {}, Fm = {};
    function xa(e, t, a, i) {
      e === null ? t.child = ME(t, null, a, i) : t.child = Vf(t, e.child, a, i);
    }
    function yT(e, t, a, i) {
      t.child = Vf(t, e.child, null, i), t.child = Vf(t, null, a, i);
    }
    function v_(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && cl(
          s,
          i,
          // Resolved props
          "prop",
          Ft(a)
        );
      }
      var f = a.render, v = t.ref, m, E;
      Bf(t, o), vu(t);
      {
        if (Hp.current = t, gr(!0), m = Qf(e, t, f, i, v, o), E = qf(), t.mode & Ln) {
          fn(!0);
          try {
            m = Qf(e, t, f, i, v, o), E = qf();
          } finally {
            fn(!1);
          }
        }
        gr(!1);
      }
      return Eo(), e !== null && !ml ? (UE(e, t, o), $o(e, t, o)) : ($r() && E && Ng(t), t.flags |= si, xa(e, t, m, o), t.child);
    }
    function h_(e, t, a, i, o) {
      if (e === null) {
        var s = a.type;
        if (_D(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = rd(s), t.tag = ot, t.type = f, e0(t, s), m_(e, t, f, i, o);
        }
        {
          var v = s.propTypes;
          v && cl(
            v,
            i,
            // Resolved props
            "prop",
            Ft(s)
          );
        }
        var m = U0(a.type, null, i, t, t.mode, o);
        return m.ref = t.ref, m.return = t, t.child = m, m;
      }
      {
        var E = a.type, b = E.propTypes;
        b && cl(
          b,
          i,
          // Resolved props
          "prop",
          Ft(E)
        );
      }
      var L = e.child, M = l0(e, o);
      if (!M) {
        var $ = L.memoizedProps, I = a.compare;
        if (I = I !== null ? I : it, I($, i) && e.ref === t.ref)
          return $o(e, t, o);
      }
      t.flags |= si;
      var G = Cc(L, i);
      return G.ref = t.ref, G.return = t, t.child = G, G;
    }
    function m_(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === qe) {
          var f = s, v = f._payload, m = f._init;
          try {
            s = m(v);
          } catch {
            s = null;
          }
          var E = s && s.propTypes;
          E && cl(
            E,
            i,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            Ft(s)
          );
        }
      }
      if (e !== null) {
        var b = e.memoizedProps;
        if (it(b, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (ml = !1, t.pendingProps = i = b, l0(e, o))
            (e.flags & zc) !== Ze && (ml = !0);
          else
            return t.lanes = e.lanes, $o(e, t, o);
      }
      return ZS(e, t, a, i, o);
    }
    function y_(e, t, a) {
      var i = t.pendingProps, o = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || J)
        if ((t.mode & Ye) === Je) {
          var f = {
            baseLanes: X,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, Zm(t, a);
        } else if (da(a, Ta)) {
          var L = {
            baseLanes: X,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = L;
          var M = s !== null ? s.baseLanes : a;
          Zm(t, M);
        } else {
          var v = null, m;
          if (s !== null) {
            var E = s.baseLanes;
            m = mt(E, a);
          } else
            m = a;
          t.lanes = t.childLanes = Ta;
          var b = {
            baseLanes: m,
            cachePool: v,
            transitions: null
          };
          return t.memoizedState = b, t.updateQueue = null, Zm(t, m), null;
        }
      else {
        var $;
        s !== null ? ($ = mt(s.baseLanes, a), t.memoizedState = null) : $ = a, Zm(t, $);
      }
      return xa(e, t, o, a), t.child;
    }
    function gT(e, t, a) {
      var i = t.pendingProps;
      return xa(e, t, i, a), t.child;
    }
    function ST(e, t, a) {
      var i = t.pendingProps.children;
      return xa(e, t, i, a), t.child;
    }
    function CT(e, t, a) {
      {
        t.flags |= $e;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var o = t.pendingProps, s = o.children;
      return xa(e, t, s, a), t.child;
    }
    function g_(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= _a, t.flags |= Ri);
    }
    function ZS(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && cl(
          s,
          i,
          // Resolved props
          "prop",
          Ft(a)
        );
      }
      var f;
      {
        var v = zf(t, a, !0);
        f = Uf(t, v);
      }
      var m, E;
      Bf(t, o), vu(t);
      {
        if (Hp.current = t, gr(!0), m = Qf(e, t, a, i, f, o), E = qf(), t.mode & Ln) {
          fn(!0);
          try {
            m = Qf(e, t, a, i, f, o), E = qf();
          } finally {
            fn(!1);
          }
        }
        gr(!1);
      }
      return Eo(), e !== null && !ml ? (UE(e, t, o), $o(e, t, o)) : ($r() && E && Ng(t), t.flags |= si, xa(e, t, m, o), t.child);
    }
    function S_(e, t, a, i, o) {
      {
        switch (PD(t)) {
          case !1: {
            var s = t.stateNode, f = t.type, v = new f(t.memoizedProps, s.context), m = v.state;
            s.updater.enqueueSetState(s, m, null);
            break;
          }
          case !0: {
            t.flags |= dt, t.flags |= Sr;
            var E = new Error("Simulated error coming from DevTools"), b = _u(o);
            t.lanes = mt(t.lanes, b);
            var L = WS(t, vc(E, t), b);
            Qg(t, L);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var M = a.propTypes;
          M && cl(
            M,
            i,
            // Resolved props
            "prop",
            Ft(a)
          );
        }
      }
      var $;
      Xl(a) ? ($ = !0, Kh(t)) : $ = !1, Bf(t, o);
      var I = t.stateNode, G;
      I === null ? (Bm(e, t), TE(t, a, i), lS(t, a, i, o), G = !0) : e === null ? G = WR(t, a, i, o) : G = GR(e, t, a, i, o);
      var De = JS(e, t, a, G, $, o);
      {
        var et = t.stateNode;
        G && et.props !== i && (hc || _("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", st(t) || "a component"), hc = !0);
      }
      return De;
    }
    function JS(e, t, a, i, o, s) {
      g_(e, t);
      var f = (t.flags & dt) !== Ze;
      if (!i && !f)
        return o && JC(t, a, !1), $o(e, t, s);
      var v = t.stateNode;
      Hp.current = t;
      var m;
      if (f && typeof a.getDerivedStateFromError != "function")
        m = null, s_();
      else {
        vu(t);
        {
          if (gr(!0), m = v.render(), t.mode & Ln) {
            fn(!0);
            try {
              v.render();
            } finally {
              fn(!1);
            }
          }
          gr(!1);
        }
        Eo();
      }
      return t.flags |= si, e !== null && f ? yT(e, t, m, s) : xa(e, t, m, s), t.memoizedState = v.state, o && JC(t, a, !0), t.child;
    }
    function C_(e) {
      var t = e.stateNode;
      t.pendingContext ? KC(e, t.pendingContext, t.pendingContext !== t.context) : t.context && KC(e, t.context, !1), dS(e, t.containerInfo);
    }
    function ET(e, t, a) {
      if (C_(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, o = t.memoizedState, s = o.element;
      gE(e, t), dm(t, i, null, a);
      var f = t.memoizedState;
      t.stateNode;
      var v = f.element;
      if (o.isDehydrated) {
        var m = {
          element: v,
          isDehydrated: !1,
          cache: f.cache,
          pendingSuspenseBoundaries: f.pendingSuspenseBoundaries,
          transitions: f.transitions
        }, E = t.updateQueue;
        if (E.baseState = m, t.memoizedState = m, t.flags & Hr) {
          var b = vc(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return E_(e, t, v, a, b);
        } else if (v !== s) {
          var L = vc(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return E_(e, t, v, a, L);
        } else {
          RR(t);
          var M = ME(t, null, v, a);
          t.child = M;
          for (var $ = M; $; )
            $.flags = $.flags & ~ln | wi, $ = $.sibling;
        }
      } else {
        if (Ff(), v === s)
          return $o(e, t, a);
        xa(e, t, v, a);
      }
      return t.child;
    }
    function E_(e, t, a, i, o) {
      return Ff(), jg(o), t.flags |= Hr, xa(e, t, a, i), t.child;
    }
    function _T(e, t, a) {
      LE(t), e === null && Pg(t);
      var i = t.type, o = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = o.children, v = gg(i, o);
      return v ? f = null : s !== null && gg(i, s) && (t.flags |= Pa), g_(e, t), xa(e, t, f, a), t.child;
    }
    function bT(e, t) {
      return e === null && Pg(t), null;
    }
    function wT(e, t, a, i) {
      Bm(e, t);
      var o = t.pendingProps, s = a, f = s._payload, v = s._init, m = v(f);
      t.type = m;
      var E = t.tag = bD(m), b = pl(m, o), L;
      switch (E) {
        case ve:
          return e0(t, m), t.type = m = rd(m), L = ZS(null, t, m, b, i), L;
        case ne:
          return t.type = m = k0(m), L = S_(null, t, m, b, i), L;
        case Qe:
          return t.type = m = M0(m), L = v_(null, t, m, b, i), L;
        case wt: {
          if (t.type !== t.elementType) {
            var M = m.propTypes;
            M && cl(
              M,
              b,
              // Resolved for outer only
              "prop",
              Ft(m)
            );
          }
          return L = h_(
            null,
            t,
            m,
            pl(m.type, b),
            // The inner type can have defaults too
            i
          ), L;
        }
      }
      var $ = "";
      throw m !== null && typeof m == "object" && m.$$typeof === qe && ($ = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + m + ". " + ("Lazy element type must resolve to a class or function." + $));
    }
    function RT(e, t, a, i, o) {
      Bm(e, t), t.tag = ne;
      var s;
      return Xl(a) ? (s = !0, Kh(t)) : s = !1, Bf(t, o), TE(t, a, i), lS(t, a, i, o), JS(null, t, a, !0, s, o);
    }
    function TT(e, t, a, i) {
      Bm(e, t);
      var o = t.pendingProps, s;
      {
        var f = zf(t, a, !1);
        s = Uf(t, f);
      }
      Bf(t, i);
      var v, m;
      vu(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var E = Ft(a) || "Unknown";
          GS[E] || (_("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", E, E), GS[E] = !0);
        }
        t.mode & Ln && dl.recordLegacyContextWarning(t, null), gr(!0), Hp.current = t, v = Qf(null, t, a, o, s, i), m = qf(), gr(!1);
      }
      if (Eo(), t.flags |= si, typeof v == "object" && v !== null && typeof v.render == "function" && v.$$typeof === void 0) {
        var b = Ft(a) || "Unknown";
        Bp[b] || (_("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", b, b, b), Bp[b] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof v == "object" && v !== null && typeof v.render == "function" && v.$$typeof === void 0
      ) {
        {
          var L = Ft(a) || "Unknown";
          Bp[L] || (_("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", L, L, L), Bp[L] = !0);
        }
        t.tag = ne, t.memoizedState = null, t.updateQueue = null;
        var M = !1;
        return Xl(a) ? (M = !0, Kh(t)) : M = !1, t.memoizedState = v.state !== null && v.state !== void 0 ? v.state : null, Gg(t), RE(t, v), lS(t, a, o, i), JS(null, t, a, !0, M, i);
      } else {
        if (t.tag = ve, t.mode & Ln) {
          fn(!0);
          try {
            v = Qf(null, t, a, o, s, i), m = qf();
          } finally {
            fn(!1);
          }
        }
        return $r() && m && Ng(t), xa(null, t, v, i), e0(t, a), t.child;
      }
    }
    function e0(e, t) {
      {
        if (t && t.childContextTypes && _("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Aa();
          i && (a += `

Check the render method of \`` + i + "`.");
          var o = i || "", s = e._debugSource;
          s && (o = s.fileName + ":" + s.lineNumber), XS[o] || (XS[o] = !0, _("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var f = Ft(t) || "Unknown";
          qS[f] || (_("%s: Function components do not support getDerivedStateFromProps.", f), qS[f] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var v = Ft(t) || "Unknown";
          QS[v] || (_("%s: Function components do not support contextType.", v), QS[v] = !0);
        }
      }
    }
    var t0 = {
      dehydrated: null,
      treeContext: null,
      retryLane: $n
    };
    function n0(e) {
      return {
        baseLanes: e,
        cachePool: mT(),
        transitions: null
      };
    }
    function xT(e, t) {
      var a = null;
      return {
        baseLanes: mt(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function DT(e, t, a, i) {
      if (t !== null) {
        var o = t.memoizedState;
        if (o === null)
          return !1;
      }
      return hS(e, Np);
    }
    function OT(e, t) {
      return Is(e.childLanes, t);
    }
    function __(e, t, a) {
      var i = t.pendingProps;
      jD(t) && (t.flags |= dt);
      var o = vl.current, s = !1, f = (t.flags & dt) !== Ze;
      if (f || DT(o, e) ? (s = !0, t.flags &= ~dt) : (e === null || e.memoizedState !== null) && (o = KR(o, zE)), o = If(o), Gu(t, o), e === null) {
        Pg(t);
        var v = t.memoizedState;
        if (v !== null) {
          var m = v.dehydrated;
          if (m !== null)
            return AT(t, m);
        }
        var E = i.children, b = i.fallback;
        if (s) {
          var L = kT(t, E, b, a), M = t.child;
          return M.memoizedState = n0(a), t.memoizedState = t0, L;
        } else
          return r0(t, E);
      } else {
        var $ = e.memoizedState;
        if ($ !== null) {
          var I = $.dehydrated;
          if (I !== null)
            return zT(e, t, f, i, I, $, a);
        }
        if (s) {
          var G = i.fallback, De = i.children, et = NT(e, t, De, G, a), We = t.child, Ut = e.child.memoizedState;
          return We.memoizedState = Ut === null ? n0(a) : xT(Ut, a), We.childLanes = OT(e, a), t.memoizedState = t0, et;
        } else {
          var Mt = i.children, F = MT(e, t, Mt, a);
          return t.memoizedState = null, F;
        }
      }
    }
    function r0(e, t, a) {
      var i = e.mode, o = {
        mode: "visible",
        children: t
      }, s = a0(o, i);
      return s.return = e, e.child = s, s;
    }
    function kT(e, t, a, i) {
      var o = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, v, m;
      return (o & Ye) === Je && s !== null ? (v = s, v.childLanes = X, v.pendingProps = f, e.mode & Bt && (v.actualDuration = 0, v.actualStartTime = -1, v.selfBaseDuration = 0, v.treeBaseDuration = 0), m = ts(a, o, i, null)) : (v = a0(f, o), m = ts(a, o, i, null)), v.return = e, m.return = e, v.sibling = m, e.child = v, m;
    }
    function a0(e, t, a) {
      return bb(e, t, X, null);
    }
    function b_(e, t) {
      return Cc(e, t);
    }
    function MT(e, t, a, i) {
      var o = e.child, s = o.sibling, f = b_(o, {
        mode: "visible",
        children: a
      });
      if ((t.mode & Ye) === Je && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var v = t.deletions;
        v === null ? (t.deletions = [s], t.flags |= Vt) : v.push(s);
      }
      return t.child = f, f;
    }
    function NT(e, t, a, i, o) {
      var s = t.mode, f = e.child, v = f.sibling, m = {
        mode: "hidden",
        children: a
      }, E;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & Ye) === Je && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var b = t.child;
        E = b, E.childLanes = X, E.pendingProps = m, t.mode & Bt && (E.actualDuration = 0, E.actualStartTime = -1, E.selfBaseDuration = f.selfBaseDuration, E.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        E = b_(f, m), E.subtreeFlags = f.subtreeFlags & Cr;
      var L;
      return v !== null ? L = Cc(v, i) : (L = ts(i, s, o, null), L.flags |= ln), L.return = t, E.return = t, E.sibling = L, t.child = E, L;
    }
    function Hm(e, t, a, i) {
      i !== null && jg(i), Vf(t, e.child, null, a);
      var o = t.pendingProps, s = o.children, f = r0(t, s);
      return f.flags |= ln, t.memoizedState = null, f;
    }
    function LT(e, t, a, i, o) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, v = a0(f, s), m = ts(i, s, o, null);
      return m.flags |= ln, v.return = t, m.return = t, v.sibling = m, t.child = v, (t.mode & Ye) !== Je && Vf(t, e.child, null, o), m;
    }
    function AT(e, t, a) {
      return (e.mode & Ye) === Je ? (_("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = rt) : _g(t) ? e.lanes = An : e.lanes = Ta, null;
    }
    function zT(e, t, a, i, o, s, f) {
      if (a)
        if (t.flags & Hr) {
          t.flags &= ~Hr;
          var F = IS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return Hm(e, t, f, F);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= dt, null;
          var Q = i.children, H = i.fallback, oe = LT(e, t, Q, H, f), Oe = t.child;
          return Oe.memoizedState = n0(f), t.memoizedState = t0, oe;
        }
      else {
        if (bR(), (t.mode & Ye) === Je)
          return Hm(
            e,
            t,
            f,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (_g(o)) {
          var v, m, E;
          {
            var b = Hw(o);
            v = b.digest, m = b.message, E = b.stack;
          }
          var L;
          m ? L = new Error(m) : L = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var M = IS(L, v, E);
          return Hm(e, t, f, M);
        }
        var $ = da(f, e.childLanes);
        if (ml || $) {
          var I = Km();
          if (I !== null) {
            var G = dh(I, f);
            if (G !== $n && G !== s.retryLane) {
              s.retryLane = G;
              var De = dn;
              qa(e, G), Or(I, e, G, De);
            }
          }
          R0();
          var et = IS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return Hm(e, t, f, et);
        } else if (YC(o)) {
          t.flags |= dt, t.child = e.child;
          var We = lD.bind(null, e);
          return Bw(o, We), null;
        } else {
          TR(t, o, s.treeContext);
          var Ut = i.children, Mt = r0(t, Ut);
          return Mt.flags |= wi, Mt;
        }
      }
    }
    function w_(e, t, a) {
      e.lanes = mt(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = mt(i.lanes, t)), $g(e.return, t, a);
    }
    function UT(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === Le) {
          var o = i.memoizedState;
          o !== null && w_(i, a, e);
        } else if (i.tag === xt)
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
    function PT(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && Sm(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function jT(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !KS[e])
        if (KS[e] = !0, typeof e == "string")
          switch (e.toLowerCase()) {
            case "together":
            case "forwards":
            case "backwards": {
              _('"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.', e, e.toLowerCase());
              break;
            }
            case "forward":
            case "backward": {
              _('"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.', e, e.toLowerCase());
              break;
            }
            default:
              _('"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
              break;
          }
        else
          _('%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
    }
    function FT(e, t) {
      e !== void 0 && !Fm[e] && (e !== "collapsed" && e !== "hidden" ? (Fm[e] = !0, _('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (Fm[e] = !0, _('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function R_(e, t) {
      {
        var a = Ht(e), i = !a && typeof gi(e) == "function";
        if (a || i) {
          var o = a ? "array" : "iterable";
          return _("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", o, t, o), !1;
        }
      }
      return !0;
    }
    function HT(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (Ht(e)) {
          for (var a = 0; a < e.length; a++)
            if (!R_(e[a], a))
              return;
        } else {
          var i = gi(e);
          if (typeof i == "function") {
            var o = i.call(e);
            if (o)
              for (var s = o.next(), f = 0; !s.done; s = o.next()) {
                if (!R_(s.value, f))
                  return;
                f++;
              }
          } else
            _('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function i0(e, t, a, i, o) {
      var s = e.memoizedState;
      s === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: i,
        tail: a,
        tailMode: o
      } : (s.isBackwards = t, s.rendering = null, s.renderingStartTime = 0, s.last = i, s.tail = a, s.tailMode = o);
    }
    function T_(e, t, a) {
      var i = t.pendingProps, o = i.revealOrder, s = i.tail, f = i.children;
      jT(o), FT(s, o), HT(f, o), xa(e, t, f, a);
      var v = vl.current, m = hS(v, Np);
      if (m)
        v = mS(v, Np), t.flags |= dt;
      else {
        var E = e !== null && (e.flags & dt) !== Ze;
        E && UT(t, t.child, a), v = If(v);
      }
      if (Gu(t, v), (t.mode & Ye) === Je)
        t.memoizedState = null;
      else
        switch (o) {
          case "forwards": {
            var b = PT(t.child), L;
            b === null ? (L = t.child, t.child = null) : (L = b.sibling, b.sibling = null), i0(
              t,
              !1,
              // isBackwards
              L,
              b,
              s
            );
            break;
          }
          case "backwards": {
            var M = null, $ = t.child;
            for (t.child = null; $ !== null; ) {
              var I = $.alternate;
              if (I !== null && Sm(I) === null) {
                t.child = $;
                break;
              }
              var G = $.sibling;
              $.sibling = M, M = $, $ = G;
            }
            i0(
              t,
              !0,
              // isBackwards
              M,
              null,
              // last
              s
            );
            break;
          }
          case "together": {
            i0(
              t,
              !1,
              // isBackwards
              null,
              // tail
              null,
              // last
              void 0
            );
            break;
          }
          default:
            t.memoizedState = null;
        }
      return t.child;
    }
    function BT(e, t, a) {
      dS(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = Vf(t, null, i, a) : xa(e, t, i, a), t.child;
    }
    var x_ = !1;
    function VT(e, t, a) {
      var i = t.type, o = i._context, s = t.pendingProps, f = t.memoizedProps, v = s.value;
      {
        "value" in s || x_ || (x_ = !0, _("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var m = t.type.propTypes;
        m && cl(m, s, "prop", "Context.Provider");
      }
      if (vE(t, o, v), f !== null) {
        var E = f.value;
        if (ze(E, v)) {
          if (f.children === s.children && !qh())
            return $o(e, t, a);
        } else
          UR(t, o, a);
      }
      var b = s.children;
      return xa(e, t, b, a), t.child;
    }
    var D_ = !1;
    function $T(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (D_ || (D_ = !0, _("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var o = t.pendingProps, s = o.children;
      typeof s != "function" && _("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Bf(t, a);
      var f = hr(i);
      vu(t);
      var v;
      return Hp.current = t, gr(!0), v = s(f), gr(!1), Eo(), t.flags |= si, xa(e, t, v, a), t.child;
    }
    function Vp() {
      ml = !0;
    }
    function Bm(e, t) {
      (t.mode & Ye) === Je && e !== null && (e.alternate = null, t.alternate = null, t.flags |= ln);
    }
    function $o(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), s_(), ev(t.lanes), da(a, t.childLanes) ? (QR(e, t), t.child) : null;
    }
    function IT(e, t, a) {
      {
        var i = t.return;
        if (i === null)
          throw new Error("Cannot swap the root fiber.");
        if (e.alternate = null, t.alternate = null, a.index = t.index, a.sibling = t.sibling, a.return = t.return, a.ref = t.ref, t === i.child)
          i.child = a;
        else {
          var o = i.child;
          if (o === null)
            throw new Error("Expected parent to have a child.");
          for (; o.sibling !== t; )
            if (o = o.sibling, o === null)
              throw new Error("Expected to find the previous sibling.");
          o.sibling = a;
        }
        var s = i.deletions;
        return s === null ? (i.deletions = [e], i.flags |= Vt) : s.push(e), a.flags |= ln, a;
      }
    }
    function l0(e, t) {
      var a = e.lanes;
      return !!da(a, t);
    }
    function YT(e, t, a) {
      switch (t.tag) {
        case re:
          C_(t), t.stateNode, Ff();
          break;
        case ce:
          LE(t);
          break;
        case ne: {
          var i = t.type;
          Xl(i) && Kh(t);
          break;
        }
        case Ne:
          dS(t, t.stateNode.containerInfo);
          break;
        case Xe: {
          var o = t.memoizedProps.value, s = t.type._context;
          vE(t, s, o);
          break;
        }
        case Nt:
          {
            var f = da(a, t.childLanes);
            f && (t.flags |= $e);
            {
              var v = t.stateNode;
              v.effectDuration = 0, v.passiveEffectDuration = 0;
            }
          }
          break;
        case Le: {
          var m = t.memoizedState;
          if (m !== null) {
            if (m.dehydrated !== null)
              return Gu(t, If(vl.current)), t.flags |= dt, null;
            var E = t.child, b = E.childLanes;
            if (da(a, b))
              return __(e, t, a);
            Gu(t, If(vl.current));
            var L = $o(e, t, a);
            return L !== null ? L.sibling : null;
          } else
            Gu(t, If(vl.current));
          break;
        }
        case xt: {
          var M = (e.flags & dt) !== Ze, $ = da(a, t.childLanes);
          if (M) {
            if ($)
              return T_(e, t, a);
            t.flags |= dt;
          }
          var I = t.memoizedState;
          if (I !== null && (I.rendering = null, I.tail = null, I.lastEffect = null), Gu(t, vl.current), $)
            break;
          return null;
        }
        case nt:
        case ft:
          return t.lanes = X, y_(e, t, a);
      }
      return $o(e, t, a);
    }
    function O_(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return IT(e, t, U0(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, o = t.pendingProps;
        if (i !== o || qh() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          ml = !0;
        else {
          var s = l0(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & dt) === Ze)
            return ml = !1, YT(e, t, a);
          (e.flags & zc) !== Ze ? ml = !0 : ml = !1;
        }
      } else if (ml = !1, $r() && yR(t)) {
        var f = t.index, v = gR();
        nE(t, v, f);
      }
      switch (t.lanes = X, t.tag) {
        case _e:
          return TT(e, t, t.type, a);
        case En: {
          var m = t.elementType;
          return wT(e, t, m, a);
        }
        case ve: {
          var E = t.type, b = t.pendingProps, L = t.elementType === E ? b : pl(E, b);
          return ZS(e, t, E, L, a);
        }
        case ne: {
          var M = t.type, $ = t.pendingProps, I = t.elementType === M ? $ : pl(M, $);
          return S_(e, t, M, I, a);
        }
        case re:
          return ET(e, t, a);
        case ce:
          return _T(e, t, a);
        case be:
          return bT(e, t);
        case Le:
          return __(e, t, a);
        case Ne:
          return BT(e, t, a);
        case Qe: {
          var G = t.type, De = t.pendingProps, et = t.elementType === G ? De : pl(G, De);
          return v_(e, t, G, et, a);
        }
        case ct:
          return gT(e, t, a);
        case Kt:
          return ST(e, t, a);
        case Nt:
          return CT(e, t, a);
        case Xe:
          return VT(e, t, a);
        case Ct:
          return $T(e, t, a);
        case wt: {
          var We = t.type, Ut = t.pendingProps, Mt = pl(We, Ut);
          if (t.type !== t.elementType) {
            var F = We.propTypes;
            F && cl(
              F,
              Mt,
              // Resolved for outer only
              "prop",
              Ft(We)
            );
          }
          return Mt = pl(We.type, Mt), h_(e, t, We, Mt, a);
        }
        case ot:
          return m_(e, t, t.type, t.pendingProps, a);
        case gn: {
          var Q = t.type, H = t.pendingProps, oe = t.elementType === Q ? H : pl(Q, H);
          return RT(e, t, Q, oe, a);
        }
        case xt:
          return T_(e, t, a);
        case nn:
          break;
        case nt:
          return y_(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Xf(e) {
      e.flags |= $e;
    }
    function k_(e) {
      e.flags |= _a, e.flags |= Ri;
    }
    var M_, o0, N_, L_;
    M_ = function(e, t, a, i) {
      for (var o = t.child; o !== null; ) {
        if (o.tag === ce || o.tag === be)
          vw(e, o.stateNode);
        else if (o.tag !== Ne) {
          if (o.child !== null) {
            o.child.return = o, o = o.child;
            continue;
          }
        }
        if (o === t)
          return;
        for (; o.sibling === null; ) {
          if (o.return === null || o.return === t)
            return;
          o = o.return;
        }
        o.sibling.return = o.return, o = o.sibling;
      }
    }, o0 = function(e, t) {
    }, N_ = function(e, t, a, i, o) {
      var s = e.memoizedProps;
      if (s !== i) {
        var f = t.stateNode, v = pS(), m = mw(f, a, s, i, o, v);
        t.updateQueue = m, m && Xf(t);
      }
    }, L_ = function(e, t, a, i) {
      a !== i && Xf(t);
    };
    function $p(e, t) {
      if (!$r())
        switch (e.tailMode) {
          case "hidden": {
            for (var a = e.tail, i = null; a !== null; )
              a.alternate !== null && (i = a), a = a.sibling;
            i === null ? e.tail = null : i.sibling = null;
            break;
          }
          case "collapsed": {
            for (var o = e.tail, s = null; o !== null; )
              o.alternate !== null && (s = o), o = o.sibling;
            s === null ? !t && e.tail !== null ? e.tail.sibling = null : e.tail = null : s.sibling = null;
            break;
          }
        }
    }
    function Yr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = X, i = Ze;
      if (t) {
        if ((e.mode & Bt) !== Je) {
          for (var m = e.selfBaseDuration, E = e.child; E !== null; )
            a = mt(a, mt(E.lanes, E.childLanes)), i |= E.subtreeFlags & Cr, i |= E.flags & Cr, m += E.treeBaseDuration, E = E.sibling;
          e.treeBaseDuration = m;
        } else
          for (var b = e.child; b !== null; )
            a = mt(a, mt(b.lanes, b.childLanes)), i |= b.subtreeFlags & Cr, i |= b.flags & Cr, b.return = e, b = b.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & Bt) !== Je) {
          for (var o = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = mt(a, mt(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, o += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = o, e.treeBaseDuration = s;
        } else
          for (var v = e.child; v !== null; )
            a = mt(a, mt(v.lanes, v.childLanes)), i |= v.subtreeFlags, i |= v.flags, v.return = e, v = v.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function WT(e, t, a) {
      if (MR() && (t.mode & Ye) !== Je && (t.flags & dt) === Ze)
        return sE(t), Ff(), t.flags |= Hr | Al | Sr, !1;
      var i = nm(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (OR(t), Yr(t), (t.mode & Bt) !== Je) {
            var o = a !== null;
            if (o) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (Ff(), (t.flags & dt) === Ze && (t.memoizedState = null), t.flags |= $e, Yr(t), (t.mode & Bt) !== Je) {
            var f = a !== null;
            if (f) {
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
        case En:
        case ot:
        case ve:
        case Qe:
        case ct:
        case Kt:
        case Nt:
        case Ct:
        case wt:
          return Yr(t), null;
        case ne: {
          var o = t.type;
          return Xl(o) && Xh(t), Yr(t), null;
        }
        case re: {
          var s = t.stateNode;
          if ($f(t), Og(t), gS(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = nm(t);
            if (f)
              Xf(t);
            else if (e !== null) {
              var v = e.memoizedState;
              // Check if this is a client root
              (!v.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & Hr) !== Ze) && (t.flags |= Zn, cE());
            }
          }
          return o0(e, t), Yr(t), null;
        }
        case ce: {
          vS(t);
          var m = NE(), E = t.type;
          if (e !== null && t.stateNode != null)
            N_(e, t, E, i, m), e.ref !== t.ref && k_(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Yr(t), null;
            }
            var b = pS(), L = nm(t);
            if (L)
              xR(t, m, b) && Xf(t);
            else {
              var M = pw(E, i, m, b, t);
              M_(M, t, !1, !1), t.stateNode = M, hw(M, E, i, m) && Xf(t);
            }
            t.ref !== null && k_(t);
          }
          return Yr(t), null;
        }
        case be: {
          var $ = i;
          if (e && t.stateNode != null) {
            var I = e.memoizedProps;
            L_(e, t, I, $);
          } else {
            if (typeof $ != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var G = NE(), De = pS(), et = nm(t);
            et ? DR(t) && Xf(t) : t.stateNode = yw($, G, De, t);
          }
          return Yr(t), null;
        }
        case Le: {
          Yf(t);
          var We = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var Ut = WT(e, t, We);
            if (!Ut)
              return t.flags & Sr ? t : null;
          }
          if ((t.flags & dt) !== Ze)
            return t.lanes = a, (t.mode & Bt) !== Je && $S(t), t;
          var Mt = We !== null, F = e !== null && e.memoizedState !== null;
          if (Mt !== F && Mt) {
            var Q = t.child;
            if (Q.flags |= Ll, (t.mode & Ye) !== Je) {
              var H = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !ee);
              H || hS(vl.current, zE) ? Gx() : R0();
            }
          }
          var oe = t.updateQueue;
          if (oe !== null && (t.flags |= $e), Yr(t), (t.mode & Bt) !== Je && Mt) {
            var Oe = t.child;
            Oe !== null && (t.treeBaseDuration -= Oe.treeBaseDuration);
          }
          return null;
        }
        case Ne:
          return $f(t), o0(e, t), e === null && cR(t.stateNode.containerInfo), Yr(t), null;
        case Xe:
          var we = t.type._context;
          return Vg(we, t), Yr(t), null;
        case gn: {
          var ut = t.type;
          return Xl(ut) && Xh(t), Yr(t), null;
        }
        case xt: {
          Yf(t);
          var ht = t.memoizedState;
          if (ht === null)
            return Yr(t), null;
          var tn = (t.flags & dt) !== Ze, It = ht.rendering;
          if (It === null)
            if (tn)
              $p(ht, !1);
            else {
              var or = qx() && (e === null || (e.flags & dt) === Ze);
              if (!or)
                for (var Yt = t.child; Yt !== null; ) {
                  var er = Sm(Yt);
                  if (er !== null) {
                    tn = !0, t.flags |= dt, $p(ht, !1);
                    var ya = er.updateQueue;
                    return ya !== null && (t.updateQueue = ya, t.flags |= $e), t.subtreeFlags = Ze, qR(t, a), Gu(t, mS(vl.current, Np)), t.child;
                  }
                  Yt = Yt.sibling;
                }
              ht.tail !== null && Jn() > tb() && (t.flags |= dt, tn = !0, $p(ht, !1), t.lanes = Bd);
            }
          else {
            if (!tn) {
              var Xr = Sm(It);
              if (Xr !== null) {
                t.flags |= dt, tn = !0;
                var pi = Xr.updateQueue;
                if (pi !== null && (t.updateQueue = pi, t.flags |= $e), $p(ht, !0), ht.tail === null && ht.tailMode === "hidden" && !It.alternate && !$r())
                  return Yr(t), null;
              } else
                // The time it took to render last row is greater than the remaining
                // time we have to render. So rendering one more row would likely
                // exceed it.
                Jn() * 2 - ht.renderingStartTime > tb() && a !== Ta && (t.flags |= dt, tn = !0, $p(ht, !1), t.lanes = Bd);
            }
            if (ht.isBackwards)
              It.sibling = t.child, t.child = It;
            else {
              var ka = ht.last;
              ka !== null ? ka.sibling = It : t.child = It, ht.last = It;
            }
          }
          if (ht.tail !== null) {
            var Ma = ht.tail;
            ht.rendering = Ma, ht.tail = Ma.sibling, ht.renderingStartTime = Jn(), Ma.sibling = null;
            var ga = vl.current;
            return tn ? ga = mS(ga, Np) : ga = If(ga), Gu(t, ga), Ma;
          }
          return Yr(t), null;
        }
        case nn:
          break;
        case nt:
        case ft: {
          w0(t);
          var Qo = t.memoizedState, ad = Qo !== null;
          if (e !== null) {
            var iv = e.memoizedState, ao = iv !== null;
            ao !== ad && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !J && (t.flags |= Ll);
          }
          return !ad || (t.mode & Ye) === Je ? Yr(t) : da(ro, Ta) && (Yr(t), t.subtreeFlags & (ln | $e) && (t.flags |= Ll)), null;
        }
        case Dt:
          return null;
        case vt:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function GT(e, t, a) {
      switch (Lg(t), t.tag) {
        case ne: {
          var i = t.type;
          Xl(i) && Xh(t);
          var o = t.flags;
          return o & Sr ? (t.flags = o & ~Sr | dt, (t.mode & Bt) !== Je && $S(t), t) : null;
        }
        case re: {
          t.stateNode, $f(t), Og(t), gS();
          var s = t.flags;
          return (s & Sr) !== Ze && (s & dt) === Ze ? (t.flags = s & ~Sr | dt, t) : null;
        }
        case ce:
          return vS(t), null;
        case Le: {
          Yf(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            Ff();
          }
          var v = t.flags;
          return v & Sr ? (t.flags = v & ~Sr | dt, (t.mode & Bt) !== Je && $S(t), t) : null;
        }
        case xt:
          return Yf(t), null;
        case Ne:
          return $f(t), null;
        case Xe:
          var m = t.type._context;
          return Vg(m, t), null;
        case nt:
        case ft:
          return w0(t), null;
        case Dt:
          return null;
        default:
          return null;
      }
    }
    function z_(e, t, a) {
      switch (Lg(t), t.tag) {
        case ne: {
          var i = t.type.childContextTypes;
          i != null && Xh(t);
          break;
        }
        case re: {
          t.stateNode, $f(t), Og(t), gS();
          break;
        }
        case ce: {
          vS(t);
          break;
        }
        case Ne:
          $f(t);
          break;
        case Le:
          Yf(t);
          break;
        case xt:
          Yf(t);
          break;
        case Xe:
          var o = t.type._context;
          Vg(o, t);
          break;
        case nt:
        case ft:
          w0(t);
          break;
      }
    }
    var U_ = null;
    U_ = /* @__PURE__ */ new Set();
    var Vm = !1, Wr = !1, QT = typeof WeakSet == "function" ? WeakSet : Set, Ue = null, Kf = null, Zf = null;
    function qT(e) {
      ui(null, function() {
        throw e;
      }), nl();
    }
    var XT = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & Bt)
        try {
          to(), t.componentWillUnmount();
        } finally {
          eo(e);
        }
      else
        t.componentWillUnmount();
    };
    function P_(e, t) {
      try {
        Xu(br, e);
      } catch (a) {
        yn(e, t, a);
      }
    }
    function u0(e, t, a) {
      try {
        XT(e, a);
      } catch (i) {
        yn(e, t, i);
      }
    }
    function KT(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        yn(e, t, i);
      }
    }
    function j_(e, t) {
      try {
        H_(e);
      } catch (a) {
        yn(e, t, a);
      }
    }
    function Jf(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (Rt && yt && e.mode & Bt)
              try {
                to(), i = a(null);
              } finally {
                eo(e);
              }
            else
              i = a(null);
          } catch (o) {
            yn(e, t, o);
          }
          typeof i == "function" && _("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", st(e));
        } else
          a.current = null;
    }
    function $m(e, t, a) {
      try {
        a();
      } catch (i) {
        yn(e, t, i);
      }
    }
    var F_ = !1;
    function ZT(e, t) {
      fw(e.containerInfo), Ue = t, JT();
      var a = F_;
      return F_ = !1, a;
    }
    function JT() {
      for (; Ue !== null; ) {
        var e = Ue, t = e.child;
        (e.subtreeFlags & ia) !== Ze && t !== null ? (t.return = e, Ue = t) : ex();
      }
    }
    function ex() {
      for (; Ue !== null; ) {
        var e = Ue;
        xn(e);
        try {
          tx(e);
        } catch (a) {
          yn(e, e.return, a);
        }
        pn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Ue = t;
          return;
        }
        Ue = e.return;
      }
    }
    function tx(e) {
      var t = e.alternate, a = e.flags;
      if ((a & Zn) !== Ze) {
        switch (xn(e), e.tag) {
          case ve:
          case Qe:
          case ot:
            break;
          case ne: {
            if (t !== null) {
              var i = t.memoizedProps, o = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !hc && (s.props !== e.memoizedProps && _("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", st(e) || "instance"), s.state !== e.memoizedState && _("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", st(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : pl(e.type, i), o);
              {
                var v = U_;
                f === void 0 && !v.has(e.type) && (v.add(e.type), _("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", st(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case re: {
            {
              var m = e.stateNode;
              Uw(m.containerInfo);
            }
            break;
          }
          case ce:
          case be:
          case Ne:
          case gn:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        pn();
      }
    }
    function yl(e, t, a) {
      var i = t.updateQueue, o = i !== null ? i.lastEffect : null;
      if (o !== null) {
        var s = o.next, f = s;
        do {
          if ((f.tag & e) === e) {
            var v = f.destroy;
            f.destroy = void 0, v !== void 0 && ((e & Ir) !== Xa ? Zv(t) : (e & br) !== Xa && hu(t), (e & Kl) !== Xa && nv(!0), $m(t, a, v), (e & Kl) !== Xa && nv(!1), (e & Ir) !== Xa ? Jv() : (e & br) !== Xa && Ls());
          }
          f = f.next;
        } while (f !== s);
      }
    }
    function Xu(e, t) {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var o = i.next, s = o;
        do {
          if ((s.tag & e) === e) {
            (e & Ir) !== Xa ? Pd(t) : (e & br) !== Xa && eh(t);
            var f = s.create;
            (e & Kl) !== Xa && nv(!0), s.destroy = f(), (e & Kl) !== Xa && nv(!1), (e & Ir) !== Xa ? Bc() : (e & br) !== Xa && jd();
            {
              var v = s.destroy;
              if (v !== void 0 && typeof v != "function") {
                var m = void 0;
                (s.tag & br) !== Ze ? m = "useLayoutEffect" : (s.tag & Kl) !== Ze ? m = "useInsertionEffect" : m = "useEffect";
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

Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching` : E = " You returned: " + v, _("%s must not return anything besides a function, which is used for clean-up.%s", m, E);
              }
            }
          }
          s = s.next;
        } while (s !== o);
      }
    }
    function nx(e, t) {
      if ((t.flags & $e) !== Ze)
        switch (t.tag) {
          case Nt: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, o = i.id, s = i.onPostCommit, f = o_(), v = t.alternate === null ? "mount" : "update";
            l_() && (v = "nested-update"), typeof s == "function" && s(o, v, a, f);
            var m = t.return;
            e:
              for (; m !== null; ) {
                switch (m.tag) {
                  case re:
                    var E = m.stateNode;
                    E.passiveEffectDuration += a;
                    break e;
                  case Nt:
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
    function rx(e, t, a, i) {
      if ((a.flags & ci) !== Ze)
        switch (a.tag) {
          case ve:
          case Qe:
          case ot: {
            if (!Wr)
              if (a.mode & Bt)
                try {
                  to(), Xu(br | _r, a);
                } finally {
                  eo(a);
                }
              else
                Xu(br | _r, a);
            break;
          }
          case ne: {
            var o = a.stateNode;
            if (a.flags & $e && !Wr)
              if (t === null)
                if (a.type === a.elementType && !hc && (o.props !== a.memoizedProps && _("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", st(a) || "instance"), o.state !== a.memoizedState && _("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", st(a) || "instance")), a.mode & Bt)
                  try {
                    to(), o.componentDidMount();
                  } finally {
                    eo(a);
                  }
                else
                  o.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : pl(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !hc && (o.props !== a.memoizedProps && _("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", st(a) || "instance"), o.state !== a.memoizedState && _("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", st(a) || "instance")), a.mode & Bt)
                  try {
                    to(), o.componentDidUpdate(s, f, o.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    eo(a);
                  }
                else
                  o.componentDidUpdate(s, f, o.__reactInternalSnapshotBeforeUpdate);
              }
            var v = a.updateQueue;
            v !== null && (a.type === a.elementType && !hc && (o.props !== a.memoizedProps && _("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", st(a) || "instance"), o.state !== a.memoizedState && _("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", st(a) || "instance")), CE(a, v, o));
            break;
          }
          case re: {
            var m = a.updateQueue;
            if (m !== null) {
              var E = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case ce:
                    E = a.child.stateNode;
                    break;
                  case ne:
                    E = a.child.stateNode;
                    break;
                }
              CE(a, m, E);
            }
            break;
          }
          case ce: {
            var b = a.stateNode;
            if (t === null && a.flags & $e) {
              var L = a.type, M = a.memoizedProps;
              _w(b, L, M);
            }
            break;
          }
          case be:
            break;
          case Ne:
            break;
          case Nt: {
            {
              var $ = a.memoizedProps, I = $.onCommit, G = $.onRender, De = a.stateNode.effectDuration, et = o_(), We = t === null ? "mount" : "update";
              l_() && (We = "nested-update"), typeof G == "function" && G(a.memoizedProps.id, We, a.actualDuration, a.treeBaseDuration, a.actualStartTime, et);
              {
                typeof I == "function" && I(a.memoizedProps.id, We, De, et), eD(a);
                var Ut = a.return;
                e:
                  for (; Ut !== null; ) {
                    switch (Ut.tag) {
                      case re:
                        var Mt = Ut.stateNode;
                        Mt.effectDuration += De;
                        break e;
                      case Nt:
                        var F = Ut.stateNode;
                        F.effectDuration += De;
                        break e;
                    }
                    Ut = Ut.return;
                  }
              }
            }
            break;
          }
          case Le: {
            fx(e, a);
            break;
          }
          case xt:
          case gn:
          case nn:
          case nt:
          case ft:
          case vt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Wr || a.flags & _a && H_(a);
    }
    function ax(e) {
      switch (e.tag) {
        case ve:
        case Qe:
        case ot: {
          if (e.mode & Bt)
            try {
              to(), P_(e, e.return);
            } finally {
              eo(e);
            }
          else
            P_(e, e.return);
          break;
        }
        case ne: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && KT(e, e.return, t), j_(e, e.return);
          break;
        }
        case ce: {
          j_(e, e.return);
          break;
        }
      }
    }
    function ix(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === ce) {
          if (a === null) {
            a = i;
            try {
              var o = i.stateNode;
              t ? Nw(o) : Aw(i.stateNode, i.memoizedProps);
            } catch (f) {
              yn(e, e.return, f);
            }
          }
        } else if (i.tag === be) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? Lw(s) : zw(s, i.memoizedProps);
            } catch (f) {
              yn(e, e.return, f);
            }
        } else if (!((i.tag === nt || i.tag === ft) && i.memoizedState !== null && i !== e)) {
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
          case ce:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var o;
          if (e.mode & Bt)
            try {
              to(), o = t(i);
            } finally {
              eo(e);
            }
          else
            o = t(i);
          typeof o == "function" && _("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", st(e));
        } else
          t.hasOwnProperty("current") || _("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", st(e)), t.current = i;
      }
    }
    function lx(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function B_(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, B_(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === ce) {
          var a = e.stateNode;
          a !== null && pR(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function ox(e) {
      for (var t = e.return; t !== null; ) {
        if (V_(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function V_(e) {
      return e.tag === ce || e.tag === re || e.tag === Ne;
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
          for (t.sibling.return = t.return, t = t.sibling; t.tag !== ce && t.tag !== be && t.tag !== Zt; ) {
            if (t.flags & ln || t.child === null || t.tag === Ne)
              continue e;
            t.child.return = t, t = t.child;
          }
          if (!(t.flags & ln))
            return t.stateNode;
        }
    }
    function ux(e) {
      var t = ox(e);
      switch (t.tag) {
        case ce: {
          var a = t.stateNode;
          t.flags & Pa && (IC(a), t.flags &= ~Pa);
          var i = $_(e);
          c0(e, i, a);
          break;
        }
        case re:
        case Ne: {
          var o = t.stateNode.containerInfo, s = $_(e);
          s0(e, s, o);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function s0(e, t, a) {
      var i = e.tag, o = i === ce || i === be;
      if (o) {
        var s = e.stateNode;
        t ? Dw(a, s, t) : Tw(a, s);
      } else if (i !== Ne) {
        var f = e.child;
        if (f !== null) {
          s0(f, t, a);
          for (var v = f.sibling; v !== null; )
            s0(v, t, a), v = v.sibling;
        }
      }
    }
    function c0(e, t, a) {
      var i = e.tag, o = i === ce || i === be;
      if (o) {
        var s = e.stateNode;
        t ? xw(a, s, t) : Rw(a, s);
      } else if (i !== Ne) {
        var f = e.child;
        if (f !== null) {
          c0(f, t, a);
          for (var v = f.sibling; v !== null; )
            c0(v, t, a), v = v.sibling;
        }
      }
    }
    var Gr = null, gl = !1;
    function sx(e, t, a) {
      {
        var i = t;
        e:
          for (; i !== null; ) {
            switch (i.tag) {
              case ce: {
                Gr = i.stateNode, gl = !1;
                break e;
              }
              case re: {
                Gr = i.stateNode.containerInfo, gl = !0;
                break e;
              }
              case Ne: {
                Gr = i.stateNode.containerInfo, gl = !0;
                break e;
              }
            }
            i = i.return;
          }
        if (Gr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        I_(e, t, a), Gr = null, gl = !1;
      }
      lx(a);
    }
    function Ku(e, t, a) {
      for (var i = a.child; i !== null; )
        I_(e, t, i), i = i.sibling;
    }
    function I_(e, t, a) {
      switch (Xv(a), a.tag) {
        case ce:
          Wr || Jf(a, t);
        case be: {
          {
            var i = Gr, o = gl;
            Gr = null, Ku(e, t, a), Gr = i, gl = o, Gr !== null && (gl ? kw(Gr, a.stateNode) : Ow(Gr, a.stateNode));
          }
          return;
        }
        case Zt: {
          Gr !== null && (gl ? Mw(Gr, a.stateNode) : Eg(Gr, a.stateNode));
          return;
        }
        case Ne: {
          {
            var s = Gr, f = gl;
            Gr = a.stateNode.containerInfo, gl = !0, Ku(e, t, a), Gr = s, gl = f;
          }
          return;
        }
        case ve:
        case Qe:
        case wt:
        case ot: {
          if (!Wr) {
            var v = a.updateQueue;
            if (v !== null) {
              var m = v.lastEffect;
              if (m !== null) {
                var E = m.next, b = E;
                do {
                  var L = b, M = L.destroy, $ = L.tag;
                  M !== void 0 && (($ & Kl) !== Xa ? $m(a, t, M) : ($ & br) !== Xa && (hu(a), a.mode & Bt ? (to(), $m(a, t, M), eo(a)) : $m(a, t, M), Ls())), b = b.next;
                } while (b !== E);
              }
            }
          }
          Ku(e, t, a);
          return;
        }
        case ne: {
          if (!Wr) {
            Jf(a, t);
            var I = a.stateNode;
            typeof I.componentWillUnmount == "function" && u0(a, t, I);
          }
          Ku(e, t, a);
          return;
        }
        case nn: {
          Ku(e, t, a);
          return;
        }
        case nt: {
          if (
            // TODO: Remove this dead flag
            a.mode & Ye
          ) {
            var G = Wr;
            Wr = G || a.memoizedState !== null, Ku(e, t, a), Wr = G;
          } else
            Ku(e, t, a);
          break;
        }
        default: {
          Ku(e, t, a);
          return;
        }
      }
    }
    function cx(e) {
      e.memoizedState;
    }
    function fx(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var o = i.memoizedState;
          if (o !== null) {
            var s = o.dehydrated;
            s !== null && Xw(s);
          }
        }
      }
    }
    function Y_(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new QT()), t.forEach(function(i) {
          var o = oD.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), Ra)
              if (Kf !== null && Zf !== null)
                tv(Zf, Kf);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(o, o);
          }
        });
      }
    }
    function dx(e, t, a) {
      Kf = a, Zf = e, xn(t), W_(t, e), xn(t), Kf = null, Zf = null;
    }
    function Sl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var o = 0; o < i.length; o++) {
          var s = i[o];
          try {
            sx(e, t, s);
          } catch (m) {
            yn(s, t, m);
          }
        }
      var f = fs();
      if (t.subtreeFlags & la)
        for (var v = t.child; v !== null; )
          xn(v), W_(v, e), v = v.sibling;
      xn(f);
    }
    function W_(e, t, a) {
      var i = e.alternate, o = e.flags;
      switch (e.tag) {
        case ve:
        case Qe:
        case wt:
        case ot: {
          if (Sl(t, e), no(e), o & $e) {
            try {
              yl(Kl | _r, e, e.return), Xu(Kl | _r, e);
            } catch (ut) {
              yn(e, e.return, ut);
            }
            if (e.mode & Bt) {
              try {
                to(), yl(br | _r, e, e.return);
              } catch (ut) {
                yn(e, e.return, ut);
              }
              eo(e);
            } else
              try {
                yl(br | _r, e, e.return);
              } catch (ut) {
                yn(e, e.return, ut);
              }
          }
          return;
        }
        case ne: {
          Sl(t, e), no(e), o & _a && i !== null && Jf(i, i.return);
          return;
        }
        case ce: {
          Sl(t, e), no(e), o & _a && i !== null && Jf(i, i.return);
          {
            if (e.flags & Pa) {
              var s = e.stateNode;
              try {
                IC(s);
              } catch (ut) {
                yn(e, e.return, ut);
              }
            }
            if (o & $e) {
              var f = e.stateNode;
              if (f != null) {
                var v = e.memoizedProps, m = i !== null ? i.memoizedProps : v, E = e.type, b = e.updateQueue;
                if (e.updateQueue = null, b !== null)
                  try {
                    bw(f, b, E, m, v, e);
                  } catch (ut) {
                    yn(e, e.return, ut);
                  }
              }
            }
          }
          return;
        }
        case be: {
          if (Sl(t, e), no(e), o & $e) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var L = e.stateNode, M = e.memoizedProps, $ = i !== null ? i.memoizedProps : M;
            try {
              ww(L, $, M);
            } catch (ut) {
              yn(e, e.return, ut);
            }
          }
          return;
        }
        case re: {
          if (Sl(t, e), no(e), o & $e && i !== null) {
            var I = i.memoizedState;
            if (I.isDehydrated)
              try {
                qw(t.containerInfo);
              } catch (ut) {
                yn(e, e.return, ut);
              }
          }
          return;
        }
        case Ne: {
          Sl(t, e), no(e);
          return;
        }
        case Le: {
          Sl(t, e), no(e);
          var G = e.child;
          if (G.flags & Ll) {
            var De = G.stateNode, et = G.memoizedState, We = et !== null;
            if (De.isHidden = We, We) {
              var Ut = G.alternate !== null && G.alternate.memoizedState !== null;
              Ut || Wx();
            }
          }
          if (o & $e) {
            try {
              cx(e);
            } catch (ut) {
              yn(e, e.return, ut);
            }
            Y_(e);
          }
          return;
        }
        case nt: {
          var Mt = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & Ye
          ) {
            var F = Wr;
            Wr = F || Mt, Sl(t, e), Wr = F;
          } else
            Sl(t, e);
          if (no(e), o & Ll) {
            var Q = e.stateNode, H = e.memoizedState, oe = H !== null, Oe = e;
            if (Q.isHidden = oe, oe && !Mt && (Oe.mode & Ye) !== Je) {
              Ue = Oe;
              for (var we = Oe.child; we !== null; )
                Ue = we, vx(we), we = we.sibling;
            }
            ix(Oe, oe);
          }
          return;
        }
        case xt: {
          Sl(t, e), no(e), o & $e && Y_(e);
          return;
        }
        case nn:
          return;
        default: {
          Sl(t, e), no(e);
          return;
        }
      }
    }
    function no(e) {
      var t = e.flags;
      if (t & ln) {
        try {
          ux(e);
        } catch (a) {
          yn(e, e.return, a);
        }
        e.flags &= ~ln;
      }
      t & wi && (e.flags &= ~wi);
    }
    function px(e, t, a) {
      Kf = a, Zf = t, Ue = e, G_(e, t, a), Kf = null, Zf = null;
    }
    function G_(e, t, a) {
      for (var i = (e.mode & Ye) !== Je; Ue !== null; ) {
        var o = Ue, s = o.child;
        if (o.tag === nt && i) {
          var f = o.memoizedState !== null, v = f || Vm;
          if (v) {
            f0(e, t, a);
            continue;
          } else {
            var m = o.alternate, E = m !== null && m.memoizedState !== null, b = E || Wr, L = Vm, M = Wr;
            Vm = v, Wr = b, Wr && !M && (Ue = o, hx(o));
            for (var $ = s; $ !== null; )
              Ue = $, G_(
                $,
                // New root; bubble back up to here and stop.
                t,
                a
              ), $ = $.sibling;
            Ue = o, Vm = L, Wr = M, f0(e, t, a);
            continue;
          }
        }
        (o.subtreeFlags & ci) !== Ze && s !== null ? (s.return = o, Ue = s) : f0(e, t, a);
      }
    }
    function f0(e, t, a) {
      for (; Ue !== null; ) {
        var i = Ue;
        if ((i.flags & ci) !== Ze) {
          var o = i.alternate;
          xn(i);
          try {
            rx(t, o, i, a);
          } catch (f) {
            yn(i, i.return, f);
          }
          pn();
        }
        if (i === e) {
          Ue = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, Ue = s;
          return;
        }
        Ue = i.return;
      }
    }
    function vx(e) {
      for (; Ue !== null; ) {
        var t = Ue, a = t.child;
        switch (t.tag) {
          case ve:
          case Qe:
          case wt:
          case ot: {
            if (t.mode & Bt)
              try {
                to(), yl(br, t, t.return);
              } finally {
                eo(t);
              }
            else
              yl(br, t, t.return);
            break;
          }
          case ne: {
            Jf(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && u0(t, t.return, i);
            break;
          }
          case ce: {
            Jf(t, t.return);
            break;
          }
          case nt: {
            var o = t.memoizedState !== null;
            if (o) {
              Q_(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, Ue = a) : Q_(e);
      }
    }
    function Q_(e) {
      for (; Ue !== null; ) {
        var t = Ue;
        if (t === e) {
          Ue = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Ue = a;
          return;
        }
        Ue = t.return;
      }
    }
    function hx(e) {
      for (; Ue !== null; ) {
        var t = Ue, a = t.child;
        if (t.tag === nt) {
          var i = t.memoizedState !== null;
          if (i) {
            q_(e);
            continue;
          }
        }
        a !== null ? (a.return = t, Ue = a) : q_(e);
      }
    }
    function q_(e) {
      for (; Ue !== null; ) {
        var t = Ue;
        xn(t);
        try {
          ax(t);
        } catch (i) {
          yn(t, t.return, i);
        }
        if (pn(), t === e) {
          Ue = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Ue = a;
          return;
        }
        Ue = t.return;
      }
    }
    function mx(e, t, a, i) {
      Ue = t, yx(t, e, a, i);
    }
    function yx(e, t, a, i) {
      for (; Ue !== null; ) {
        var o = Ue, s = o.child;
        (o.subtreeFlags & oa) !== Ze && s !== null ? (s.return = o, Ue = s) : gx(e, t, a, i);
      }
    }
    function gx(e, t, a, i) {
      for (; Ue !== null; ) {
        var o = Ue;
        if ((o.flags & aa) !== Ze) {
          xn(o);
          try {
            Sx(t, o, a, i);
          } catch (f) {
            yn(o, o.return, f);
          }
          pn();
        }
        if (o === e) {
          Ue = null;
          return;
        }
        var s = o.sibling;
        if (s !== null) {
          s.return = o.return, Ue = s;
          return;
        }
        Ue = o.return;
      }
    }
    function Sx(e, t, a, i) {
      switch (t.tag) {
        case ve:
        case Qe:
        case ot: {
          if (t.mode & Bt) {
            VS();
            try {
              Xu(Ir | _r, t);
            } finally {
              BS(t);
            }
          } else
            Xu(Ir | _r, t);
          break;
        }
      }
    }
    function Cx(e) {
      Ue = e, Ex();
    }
    function Ex() {
      for (; Ue !== null; ) {
        var e = Ue, t = e.child;
        if ((Ue.flags & Vt) !== Ze) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var o = a[i];
              Ue = o, wx(o, e);
            }
            {
              var s = e.alternate;
              if (s !== null) {
                var f = s.child;
                if (f !== null) {
                  s.child = null;
                  do {
                    var v = f.sibling;
                    f.sibling = null, f = v;
                  } while (f !== null);
                }
              }
            }
            Ue = e;
          }
        }
        (e.subtreeFlags & oa) !== Ze && t !== null ? (t.return = e, Ue = t) : _x();
      }
    }
    function _x() {
      for (; Ue !== null; ) {
        var e = Ue;
        (e.flags & aa) !== Ze && (xn(e), bx(e), pn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Ue = t;
          return;
        }
        Ue = e.return;
      }
    }
    function bx(e) {
      switch (e.tag) {
        case ve:
        case Qe:
        case ot: {
          e.mode & Bt ? (VS(), yl(Ir | _r, e, e.return), BS(e)) : yl(Ir | _r, e, e.return);
          break;
        }
      }
    }
    function wx(e, t) {
      for (; Ue !== null; ) {
        var a = Ue;
        xn(a), Tx(a, t), pn();
        var i = a.child;
        i !== null ? (i.return = a, Ue = i) : Rx(e);
      }
    }
    function Rx(e) {
      for (; Ue !== null; ) {
        var t = Ue, a = t.sibling, i = t.return;
        if (B_(t), t === e) {
          Ue = null;
          return;
        }
        if (a !== null) {
          a.return = i, Ue = a;
          return;
        }
        Ue = i;
      }
    }
    function Tx(e, t) {
      switch (e.tag) {
        case ve:
        case Qe:
        case ot: {
          e.mode & Bt ? (VS(), yl(Ir, e, t), BS(e)) : yl(Ir, e, t);
          break;
        }
      }
    }
    function xx(e) {
      switch (e.tag) {
        case ve:
        case Qe:
        case ot: {
          try {
            Xu(br | _r, e);
          } catch (a) {
            yn(e, e.return, a);
          }
          break;
        }
        case ne: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            yn(e, e.return, a);
          }
          break;
        }
      }
    }
    function Dx(e) {
      switch (e.tag) {
        case ve:
        case Qe:
        case ot: {
          try {
            Xu(Ir | _r, e);
          } catch (t) {
            yn(e, e.return, t);
          }
          break;
        }
      }
    }
    function Ox(e) {
      switch (e.tag) {
        case ve:
        case Qe:
        case ot: {
          try {
            yl(br | _r, e, e.return);
          } catch (a) {
            yn(e, e.return, a);
          }
          break;
        }
        case ne: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && u0(e, e.return, t);
          break;
        }
      }
    }
    function kx(e) {
      switch (e.tag) {
        case ve:
        case Qe:
        case ot:
          try {
            yl(Ir | _r, e, e.return);
          } catch (t) {
            yn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Ip = Symbol.for;
      Ip("selector.component"), Ip("selector.has_pseudo_class"), Ip("selector.role"), Ip("selector.test_id"), Ip("selector.text");
    }
    var Mx = [];
    function Nx() {
      Mx.forEach(function(e) {
        return e();
      });
    }
    var Lx = C.ReactCurrentActQueue;
    function Ax(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function X_() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && Lx.current !== null && _("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var zx = Math.ceil, d0 = C.ReactCurrentDispatcher, p0 = C.ReactCurrentOwner, Qr = C.ReactCurrentBatchConfig, Cl = C.ReactCurrentActQueue, Tr = (
      /*             */
      0
    ), K_ = (
      /*               */
      1
    ), qr = (
      /*                */
      2
    ), ji = (
      /*                */
      4
    ), Io = 0, Yp = 1, mc = 2, Im = 3, Wp = 4, Z_ = 5, v0 = 6, zt = Tr, Da = null, Gn = null, xr = X, ro = X, h0 = Bu(X), Dr = Io, Gp = null, Ym = X, Qp = X, Wm = X, qp = null, Ka = null, m0 = 0, J_ = 500, eb = 1 / 0, Ux = 500, Yo = null;
    function Xp() {
      eb = Jn() + Ux;
    }
    function tb() {
      return eb;
    }
    var Gm = !1, y0 = null, ed = null, yc = !1, Zu = null, Kp = X, g0 = [], S0 = null, Px = 50, Zp = 0, C0 = null, E0 = !1, Qm = !1, jx = 50, td = 0, qm = null, Jp = dn, Xm = X, nb = !1;
    function Km() {
      return Da;
    }
    function Oa() {
      return (zt & (qr | ji)) !== Tr ? Jn() : (Jp !== dn || (Jp = Jn()), Jp);
    }
    function Ju(e) {
      var t = e.mode;
      if ((t & Ye) === Je)
        return rt;
      if ((zt & qr) !== Tr && xr !== X)
        return _u(xr);
      var a = AR() !== LR;
      if (a) {
        if (Qr.transition !== null) {
          var i = Qr.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Xm === $n && (Xm = sh()), Xm;
      }
      var o = $a();
      if (o !== $n)
        return o;
      var s = gw();
      return s;
    }
    function Fx(e) {
      var t = e.mode;
      return (t & Ye) === Je ? rt : fa();
    }
    function Or(e, t, a, i) {
      sD(), nb && _("useInsertionEffect must not schedule updates."), E0 && (Qm = !0), ko(e, a, i), (zt & qr) !== X && e === Da ? dD(t) : (Ra && uf(e, t, a), pD(t), e === Da && ((zt & qr) === Tr && (Qp = mt(Qp, a)), Dr === Wp && es(e, xr)), Za(e, i), a === rt && zt === Tr && (t.mode & Ye) === Je && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !Cl.isBatchingLegacy && (Xp(), tE()));
    }
    function Hx(e, t, a) {
      var i = e.current;
      i.lanes = t, ko(e, t, a), Za(e, a);
    }
    function Bx(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (zt & qr) !== Tr
      );
    }
    function Za(e, t) {
      var a = e.callbackNode;
      Hy(e, t);
      var i = Bs(e, e === Da ? xr : X);
      if (i === X) {
        a !== null && gb(a), e.callbackNode = null, e.callbackPriority = $n;
        return;
      }
      var o = In(i), s = e.callbackPriority;
      if (s === o && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(Cl.current !== null && a !== D0)) {
        a == null && s !== rt && _("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && gb(a);
      var f;
      if (o === rt)
        e.tag === Vu ? (Cl.isBatchingLegacy !== null && (Cl.didScheduleLegacyUpdate = !0), mR(ib.bind(null, e))) : eE(ib.bind(null, e)), Cl.current !== null ? Cl.current.push($u) : Cw(function() {
          (zt & (qr | ji)) === Tr && $u();
        }), f = null;
      else {
        var v;
        switch (Er(i)) {
          case Yn:
            v = ua;
            break;
          case ll:
            v = du;
            break;
          case Oi:
            v = Ti;
            break;
          case bu:
            v = Ms;
            break;
          default:
            v = Ti;
            break;
        }
        f = O0(v, rb.bind(null, e));
      }
      e.callbackPriority = o, e.callbackNode = f;
    }
    function rb(e, t) {
      if (sT(), Jp = dn, Xm = X, (zt & (qr | ji)) !== Tr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = Go();
      if (i && e.callbackNode !== a)
        return null;
      var o = Bs(e, e === Da ? xr : X);
      if (o === X)
        return null;
      var s = !$s(e, o) && !uh(e, o) && !t, f = s ? Kx(e, o) : Jm(e, o);
      if (f !== Io) {
        if (f === mc) {
          var v = $l(e);
          v !== X && (o = v, f = _0(e, v));
        }
        if (f === Yp) {
          var m = Gp;
          throw gc(e, X), es(e, o), Za(e, Jn()), m;
        }
        if (f === v0)
          es(e, o);
        else {
          var E = !$s(e, o), b = e.current.alternate;
          if (E && !$x(b)) {
            if (f = Jm(e, o), f === mc) {
              var L = $l(e);
              L !== X && (o = L, f = _0(e, L));
            }
            if (f === Yp) {
              var M = Gp;
              throw gc(e, X), es(e, o), Za(e, Jn()), M;
            }
          }
          e.finishedWork = b, e.finishedLanes = o, Vx(e, f, o);
        }
      }
      return Za(e, Jn()), e.callbackNode === a ? rb.bind(null, e) : null;
    }
    function _0(e, t) {
      var a = qp;
      if (sf(e)) {
        var i = gc(e, t);
        i.flags |= Hr, sR(e.containerInfo);
      }
      var o = Jm(e, t);
      if (o !== mc) {
        var s = Ka;
        Ka = a, s !== null && ab(s);
      }
      return o;
    }
    function ab(e) {
      Ka === null ? Ka = e : Ka.push.apply(Ka, e);
    }
    function Vx(e, t, a) {
      switch (t) {
        case Io:
        case Yp:
          throw new Error("Root did not complete. This is a bug in React.");
        case mc: {
          Sc(e, Ka, Yo);
          break;
        }
        case Im: {
          if (es(e, a), ih(a) && // do not delay if we're inside an act() scope
          !Sb()) {
            var i = m0 + J_ - Jn();
            if (i > 10) {
              var o = Bs(e, X);
              if (o !== X)
                break;
              var s = e.suspendedLanes;
              if (!Oo(s, a)) {
                Oa(), lf(e, s);
                break;
              }
              e.timeoutHandle = Sg(Sc.bind(null, e, Ka, Yo), i);
              break;
            }
          }
          Sc(e, Ka, Yo);
          break;
        }
        case Wp: {
          if (es(e, a), oh(a))
            break;
          if (!Sb()) {
            var f = nf(e, a), v = f, m = Jn() - v, E = uD(m) - m;
            if (E > 10) {
              e.timeoutHandle = Sg(Sc.bind(null, e, Ka, Yo), E);
              break;
            }
          }
          Sc(e, Ka, Yo);
          break;
        }
        case Z_: {
          Sc(e, Ka, Yo);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function $x(e) {
      for (var t = e; ; ) {
        if (t.flags & go) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var o = 0; o < i.length; o++) {
                var s = i[o], f = s.getSnapshot, v = s.value;
                try {
                  if (!ze(f(), v))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var m = t.child;
        if (t.subtreeFlags & go && m !== null) {
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
    function es(e, t) {
      t = Is(t, Wm), t = Is(t, Qp), fh(e, t);
    }
    function ib(e) {
      if (cT(), (zt & (qr | ji)) !== Tr)
        throw new Error("Should not already be working.");
      Go();
      var t = Bs(e, X);
      if (!da(t, rt))
        return Za(e, Jn()), null;
      var a = Jm(e, t);
      if (e.tag !== Vu && a === mc) {
        var i = $l(e);
        i !== X && (t = i, a = _0(e, i));
      }
      if (a === Yp) {
        var o = Gp;
        throw gc(e, X), es(e, t), Za(e, Jn()), o;
      }
      if (a === v0)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, Sc(e, Ka, Yo), Za(e, Jn()), null;
    }
    function Ix(e, t) {
      t !== X && (Yd(e, mt(t, rt)), Za(e, Jn()), (zt & (qr | ji)) === Tr && (Xp(), $u()));
    }
    function b0(e, t) {
      var a = zt;
      zt |= K_;
      try {
        return e(t);
      } finally {
        zt = a, zt === Tr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !Cl.isBatchingLegacy && (Xp(), tE());
      }
    }
    function Yx(e, t, a, i, o) {
      var s = $a(), f = Qr.transition;
      try {
        return Qr.transition = null, zn(Yn), e(t, a, i, o);
      } finally {
        zn(s), Qr.transition = f, zt === Tr && Xp();
      }
    }
    function Wo(e) {
      Zu !== null && Zu.tag === Vu && (zt & (qr | ji)) === Tr && Go();
      var t = zt;
      zt |= K_;
      var a = Qr.transition, i = $a();
      try {
        return Qr.transition = null, zn(Yn), e ? e() : void 0;
      } finally {
        zn(i), Qr.transition = a, zt = t, (zt & (qr | ji)) === Tr && $u();
      }
    }
    function lb() {
      return (zt & (qr | ji)) !== Tr;
    }
    function Zm(e, t) {
      ha(h0, ro, e), ro = mt(ro, t);
    }
    function w0(e) {
      ro = h0.current, va(h0, e);
    }
    function gc(e, t) {
      e.finishedWork = null, e.finishedLanes = X;
      var a = e.timeoutHandle;
      if (a !== Cg && (e.timeoutHandle = Cg, Sw(a)), Gn !== null)
        for (var i = Gn.return; i !== null; ) {
          var o = i.alternate;
          z_(o, i), i = i.return;
        }
      Da = e;
      var s = Cc(e.current, null);
      return Gn = s, xr = ro = t, Dr = Io, Gp = null, Ym = X, Qp = X, Wm = X, qp = null, Ka = null, jR(), dl.discardPendingWarnings(), s;
    }
    function ob(e, t) {
      do {
        var a = Gn;
        try {
          if (lm(), PE(), pn(), p0.current = null, a === null || a.return === null) {
            Dr = Yp, Gp = t, Gn = null;
            return;
          }
          if (Rt && a.mode & Bt && jm(a, !0), gt)
            if (Eo(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              nh(a, i, xr);
            } else
              th(a, t, xr);
          hT(e, a.return, a, t, xr), fb(a);
        } catch (o) {
          t = o, Gn === a && a !== null ? (a = a.return, Gn = a) : a = Gn;
          continue;
        }
        return;
      } while (!0);
    }
    function ub() {
      var e = d0.current;
      return d0.current = Lm, e === null ? Lm : e;
    }
    function sb(e) {
      d0.current = e;
    }
    function Wx() {
      m0 = Jn();
    }
    function ev(e) {
      Ym = mt(e, Ym);
    }
    function Gx() {
      Dr === Io && (Dr = Im);
    }
    function R0() {
      (Dr === Io || Dr === Im || Dr === mc) && (Dr = Wp), Da !== null && (Vs(Ym) || Vs(Qp)) && es(Da, xr);
    }
    function Qx(e) {
      Dr !== Wp && (Dr = mc), qp === null ? qp = [e] : qp.push(e);
    }
    function qx() {
      return Dr === Io;
    }
    function Jm(e, t) {
      var a = zt;
      zt |= qr;
      var i = ub();
      if (Da !== e || xr !== t) {
        if (Ra) {
          var o = e.memoizedUpdaters;
          o.size > 0 && (tv(e, xr), o.clear()), Wd(e, t);
        }
        Yo = Ws(), gc(e, t);
      }
      yu(t);
      do
        try {
          Xx();
          break;
        } catch (s) {
          ob(e, s);
        }
      while (!0);
      if (lm(), zt = a, sb(i), Gn !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Hl(), Da = null, xr = X, Dr;
    }
    function Xx() {
      for (; Gn !== null; )
        cb(Gn);
    }
    function Kx(e, t) {
      var a = zt;
      zt |= qr;
      var i = ub();
      if (Da !== e || xr !== t) {
        if (Ra) {
          var o = e.memoizedUpdaters;
          o.size > 0 && (tv(e, xr), o.clear()), Wd(e, t);
        }
        Yo = Ws(), Xp(), gc(e, t);
      }
      yu(t);
      do
        try {
          Zx();
          break;
        } catch (s) {
          ob(e, s);
        }
      while (!0);
      return lm(), sb(i), zt = a, Gn !== null ? (zs(), Io) : (Hl(), Da = null, xr = X, Dr);
    }
    function Zx() {
      for (; Gn !== null && !Qv(); )
        cb(Gn);
    }
    function cb(e) {
      var t = e.alternate;
      xn(e);
      var a;
      (e.mode & Bt) !== Je ? (HS(e), a = T0(t, e, ro), jm(e, !0)) : a = T0(t, e, ro), pn(), e.memoizedProps = e.pendingProps, a === null ? fb(e) : Gn = a, p0.current = null;
    }
    function fb(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & Al) === Ze) {
          xn(t);
          var o = void 0;
          if ((t.mode & Bt) === Je ? o = A_(a, t, ro) : (HS(t), o = A_(a, t, ro), jm(t, !1)), pn(), o !== null) {
            Gn = o;
            return;
          }
        } else {
          var s = GT(a, t);
          if (s !== null) {
            s.flags &= rl, Gn = s;
            return;
          }
          if ((t.mode & Bt) !== Je) {
            jm(t, !1);
            for (var f = t.actualDuration, v = t.child; v !== null; )
              f += v.actualDuration, v = v.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= Al, i.subtreeFlags = Ze, i.deletions = null;
          else {
            Dr = v0, Gn = null;
            return;
          }
        }
        var m = t.sibling;
        if (m !== null) {
          Gn = m;
          return;
        }
        t = i, Gn = t;
      } while (t !== null);
      Dr === Io && (Dr = Z_);
    }
    function Sc(e, t, a) {
      var i = $a(), o = Qr.transition;
      try {
        Qr.transition = null, zn(Yn), Jx(e, t, a, i);
      } finally {
        Qr.transition = o, zn(i);
      }
      return null;
    }
    function Jx(e, t, a, i) {
      do
        Go();
      while (Zu !== null);
      if (cD(), (zt & (qr | ji)) !== Tr)
        throw new Error("Should not already be working.");
      var o = e.finishedWork, s = e.finishedLanes;
      if (Kv(s), o === null)
        return Ns(), null;
      if (s === X && _("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = X, o === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = $n;
      var f = mt(o.lanes, o.childLanes);
      of(e, f), e === Da && (Da = null, Gn = null, xr = X), ((o.subtreeFlags & oa) !== Ze || (o.flags & oa) !== Ze) && (yc || (yc = !0, S0 = a, O0(Ti, function() {
        return Go(), null;
      })));
      var v = (o.subtreeFlags & (ia | la | ci | oa)) !== Ze, m = (o.flags & (ia | la | ci | oa)) !== Ze;
      if (v || m) {
        var E = Qr.transition;
        Qr.transition = null;
        var b = $a();
        zn(Yn);
        var L = zt;
        zt |= ji, p0.current = null, ZT(e, o), u_(), dx(e, o, s), dw(e.containerInfo), e.current = o, mu(s), px(o, e, s), rh(), fu(), zt = L, zn(b), Qr.transition = E;
      } else
        e.current = o, u_();
      var M = yc;
      if (yc ? (yc = !1, Zu = e, Kp = s) : (td = 0, qm = null), f = e.pendingLanes, f === X && (ed = null), M || hb(e.current, !1), jl(o.stateNode, i), Ra && e.memoizedUpdaters.clear(), Nx(), Za(e, Jn()), t !== null)
        for (var $ = e.onRecoverableError, I = 0; I < t.length; I++) {
          var G = t[I], De = G.stack, et = G.digest;
          $(G.value, {
            componentStack: De,
            digest: et
          });
        }
      if (Gm) {
        Gm = !1;
        var We = y0;
        throw y0 = null, We;
      }
      return da(Kp, rt) && e.tag !== Vu && Go(), f = e.pendingLanes, da(f, rt) ? (uT(), e === C0 ? Zp++ : (Zp = 0, C0 = e)) : Zp = 0, $u(), Ns(), null;
    }
    function Go() {
      if (Zu !== null) {
        var e = Er(Kp), t = Iy(Oi, e), a = Qr.transition, i = $a();
        try {
          return Qr.transition = null, zn(t), tD();
        } finally {
          zn(i), Qr.transition = a;
        }
      }
      return !1;
    }
    function eD(e) {
      g0.push(e), yc || (yc = !0, O0(Ti, function() {
        return Go(), null;
      }));
    }
    function tD() {
      if (Zu === null)
        return !1;
      var e = S0;
      S0 = null;
      var t = Zu, a = Kp;
      if (Zu = null, Kp = X, (zt & (qr | ji)) !== Tr)
        throw new Error("Cannot flush passive effects while already rendering.");
      E0 = !0, Qm = !1, As(a);
      var i = zt;
      zt |= ji, Cx(t.current), mx(t, t.current, a, e);
      {
        var o = g0;
        g0 = [];
        for (var s = 0; s < o.length; s++) {
          var f = o[s];
          nx(t, f);
        }
      }
      xi(), hb(t.current, !0), zt = i, $u(), Qm ? t === qm ? td++ : (td = 0, qm = t) : td = 0, E0 = !1, Qm = !1, Ud(t);
      {
        var v = t.current.stateNode;
        v.effectDuration = 0, v.passiveEffectDuration = 0;
      }
      return !0;
    }
    function db(e) {
      return ed !== null && ed.has(e);
    }
    function nD(e) {
      ed === null ? ed = /* @__PURE__ */ new Set([e]) : ed.add(e);
    }
    function rD(e) {
      Gm || (Gm = !0, y0 = e);
    }
    var aD = rD;
    function pb(e, t, a) {
      var i = vc(a, t), o = c_(e, i, rt), s = Yu(e, o, rt), f = Oa();
      s !== null && (ko(s, rt, f), Za(s, f));
    }
    function yn(e, t, a) {
      if (qT(a), nv(!1), e.tag === re) {
        pb(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === re) {
          pb(i, e, a);
          return;
        } else if (i.tag === ne) {
          var o = i.type, s = i.stateNode;
          if (typeof o.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !db(s)) {
            var f = vc(a, e), v = WS(i, f, rt), m = Yu(i, v, rt), E = Oa();
            m !== null && (ko(m, rt, E), Za(m, E));
            return;
          }
        }
        i = i.return;
      }
      _(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function iD(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var o = Oa();
      lf(e, a), vD(e), Da === e && Oo(xr, a) && (Dr === Wp || Dr === Im && ih(xr) && Jn() - m0 < J_ ? gc(e, X) : Wm = mt(Wm, a)), Za(e, o);
    }
    function vb(e, t) {
      t === $n && (t = Fx(e));
      var a = Oa(), i = qa(e, t);
      i !== null && (ko(i, t, a), Za(i, a));
    }
    function lD(e) {
      var t = e.memoizedState, a = $n;
      t !== null && (a = t.retryLane), vb(e, a);
    }
    function oD(e, t) {
      var a = $n, i;
      switch (e.tag) {
        case Le:
          i = e.stateNode;
          var o = e.memoizedState;
          o !== null && (a = o.retryLane);
          break;
        case xt:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), vb(e, a);
    }
    function uD(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : zx(e / 1960) * 1960;
    }
    function sD() {
      if (Zp > Px)
        throw Zp = 0, C0 = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      td > jx && (td = 0, qm = null, _("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function cD() {
      dl.flushLegacyContextWarning(), dl.flushPendingUnsafeLifecycleWarnings();
    }
    function hb(e, t) {
      xn(e), ey(e, Fa, Ox), t && ey(e, So, kx), ey(e, Fa, xx), t && ey(e, So, Dx), pn();
    }
    function ey(e, t, a) {
      for (var i = e, o = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== o && i.child !== null && s !== Ze ? i = i.child : ((i.flags & t) !== Ze && a(i), i.sibling !== null ? i = i.sibling : i = o = i.return);
      }
    }
    var ty = null;
    function mb(e) {
      {
        if ((zt & qr) !== Tr || !(e.mode & Ye))
          return;
        var t = e.tag;
        if (t !== _e && t !== re && t !== ne && t !== ve && t !== Qe && t !== wt && t !== ot)
          return;
        var a = st(e) || "ReactComponent";
        if (ty !== null) {
          if (ty.has(a))
            return;
          ty.add(a);
        } else
          ty = /* @__PURE__ */ new Set([a]);
        var i = Tn;
        try {
          xn(e), _("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? xn(e) : pn();
        }
      }
    }
    var T0;
    {
      var fD = null;
      T0 = function(e, t, a) {
        var i = wb(fD, t);
        try {
          return O_(e, t, a);
        } catch (s) {
          if (wR() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (lm(), PE(), z_(e, t), wb(t, i), t.mode & Bt && HS(t), ui(null, O_, null, e, t, a), Py()) {
            var o = nl();
            typeof o == "object" && o !== null && o._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var yb = !1, x0;
    x0 = /* @__PURE__ */ new Set();
    function dD(e) {
      if (ta && !iT())
        switch (e.tag) {
          case ve:
          case Qe:
          case ot: {
            var t = Gn && st(Gn) || "Unknown", a = t;
            if (!x0.has(a)) {
              x0.add(a);
              var i = st(e) || "Unknown";
              _("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case ne: {
            yb || (_("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), yb = !0);
            break;
          }
        }
    }
    function tv(e, t) {
      if (Ra) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          uf(e, i, t);
        });
      }
    }
    var D0 = {};
    function O0(e, t) {
      {
        var a = Cl.current;
        return a !== null ? (a.push(t), D0) : Ld(e, t);
      }
    }
    function gb(e) {
      if (e !== D0)
        return Fc(e);
    }
    function Sb() {
      return Cl.current !== null;
    }
    function pD(e) {
      {
        if (e.mode & Ye) {
          if (!X_())
            return;
        } else if (!Ax() || zt !== Tr || e.tag !== ve && e.tag !== Qe && e.tag !== ot)
          return;
        if (Cl.current === null) {
          var t = Tn;
          try {
            xn(e), _(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, st(e));
          } finally {
            t ? xn(e) : pn();
          }
        }
      }
    }
    function vD(e) {
      e.tag !== Vu && X_() && Cl.current === null && _(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function nv(e) {
      nb = e;
    }
    var Fi = null, nd = null, hD = function(e) {
      Fi = e;
    };
    function rd(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        return t === void 0 ? e : t.current;
      }
    }
    function k0(e) {
      return rd(e);
    }
    function M0(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = rd(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: Ee,
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
        if (Fi === null)
          return !1;
        var a = e.elementType, i = t.type, o = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case ne: {
            typeof i == "function" && (o = !0);
            break;
          }
          case ve: {
            (typeof i == "function" || s === qe) && (o = !0);
            break;
          }
          case Qe: {
            (s === Ee || s === qe) && (o = !0);
            break;
          }
          case wt:
          case ot: {
            (s === St || s === qe) && (o = !0);
            break;
          }
          default:
            return !1;
        }
        if (o) {
          var f = Fi(a);
          if (f !== void 0 && f === Fi(i))
            return !0;
        }
        return !1;
      }
    }
    function Eb(e) {
      {
        if (Fi === null || typeof WeakSet != "function")
          return;
        nd === null && (nd = /* @__PURE__ */ new WeakSet()), nd.add(e);
      }
    }
    var mD = function(e, t) {
      {
        if (Fi === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        Go(), Wo(function() {
          N0(e.current, i, a);
        });
      }
    }, yD = function(e, t) {
      {
        if (e.context !== fi)
          return;
        Go(), Wo(function() {
          rv(t, e, null, null);
        });
      }
    };
    function N0(e, t, a) {
      {
        var i = e.alternate, o = e.child, s = e.sibling, f = e.tag, v = e.type, m = null;
        switch (f) {
          case ve:
          case ot:
          case ne:
            m = v;
            break;
          case Qe:
            m = v.render;
            break;
        }
        if (Fi === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var E = !1, b = !1;
        if (m !== null) {
          var L = Fi(m);
          L !== void 0 && (a.has(L) ? b = !0 : t.has(L) && (f === ne ? b = !0 : E = !0));
        }
        if (nd !== null && (nd.has(e) || i !== null && nd.has(i)) && (b = !0), b && (e._debugNeedsRemount = !0), b || E) {
          var M = qa(e, rt);
          M !== null && Or(M, e, rt, dn);
        }
        o !== null && !b && N0(o, t, a), s !== null && N0(s, t, a);
      }
    }
    var gD = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(o) {
          return o.current;
        }));
        return L0(e.current, i, a), a;
      }
    };
    function L0(e, t, a) {
      {
        var i = e.child, o = e.sibling, s = e.tag, f = e.type, v = null;
        switch (s) {
          case ve:
          case ot:
          case ne:
            v = f;
            break;
          case Qe:
            v = f.render;
            break;
        }
        var m = !1;
        v !== null && t.has(v) && (m = !0), m ? SD(e, a) : i !== null && L0(i, t, a), o !== null && L0(o, t, a);
      }
    }
    function SD(e, t) {
      {
        var a = CD(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case ce:
              t.add(i.stateNode);
              return;
            case Ne:
              t.add(i.stateNode.containerInfo);
              return;
            case re:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function CD(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === ce)
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
    function ED(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = Ze, this.subtreeFlags = Ze, this.deletions = null, this.lanes = X, this.childLanes = X, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !A0 && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var di = function(e, t, a, i) {
      return new ED(e, t, a, i);
    };
    function z0(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function _D(e) {
      return typeof e == "function" && !z0(e) && e.defaultProps === void 0;
    }
    function bD(e) {
      if (typeof e == "function")
        return z0(e) ? ne : ve;
      if (e != null) {
        var t = e.$$typeof;
        if (t === Ee)
          return Qe;
        if (t === St)
          return wt;
      }
      return _e;
    }
    function Cc(e, t) {
      var a = e.alternate;
      a === null ? (a = di(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = Ze, a.subtreeFlags = Ze, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & Cr, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case _e:
        case ve:
        case ot:
          a.type = rd(e.type);
          break;
        case ne:
          a.type = k0(e.type);
          break;
        case Qe:
          a.type = M0(e.type);
          break;
      }
      return a;
    }
    function wD(e, t) {
      e.flags &= Cr | ln;
      var a = e.alternate;
      if (a === null)
        e.childLanes = X, e.lanes = t, e.child = null, e.subtreeFlags = Ze, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = Ze, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function RD(e, t, a) {
      var i;
      return e === Zh ? (i = Ye, t === !0 && (i |= Ln, i |= Ba)) : i = Je, Ra && (i |= Bt), di(re, null, null, i);
    }
    function U0(e, t, a, i, o, s) {
      var f = _e, v = e;
      if (typeof e == "function")
        z0(e) ? (f = ne, v = k0(v)) : v = rd(v);
      else if (typeof e == "string")
        f = ce;
      else
        e:
          switch (e) {
            case Sa:
              return ts(a.children, o, s, t);
            case $i:
              f = Kt, o |= Ln, (o & Ye) !== Je && (o |= Ba);
              break;
            case x:
              return TD(a, o, s, t);
            case Tt:
              return xD(a, o, s, t);
            case At:
              return DD(a, o, s, t);
            case sn:
              return bb(a, o, s, t);
            case kr:
            case Kn:
            case yi:
            case cn:
            case un:
            default: {
              if (typeof e == "object" && e !== null)
                switch (e.$$typeof) {
                  case ae:
                    f = Xe;
                    break e;
                  case ge:
                    f = Ct;
                    break e;
                  case Ee:
                    f = Qe, v = M0(v);
                    break e;
                  case St:
                    f = wt;
                    break e;
                  case qe:
                    f = En, v = null;
                    break e;
                }
              var m = "";
              {
                (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (m += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
                var E = i ? st(i) : null;
                E && (m += `

Check the render method of \`` + E + "`.");
              }
              throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + m));
            }
          }
      var b = di(f, a, t, o);
      return b.elementType = e, b.type = v, b.lanes = s, b._debugOwner = i, b;
    }
    function P0(e, t, a) {
      var i = null;
      i = e._owner;
      var o = e.type, s = e.key, f = e.props, v = U0(o, s, f, i, t, a);
      return v._debugSource = e._source, v._debugOwner = e._owner, v;
    }
    function ts(e, t, a, i) {
      var o = di(ct, e, i, t);
      return o.lanes = a, o;
    }
    function TD(e, t, a, i) {
      typeof e.id != "string" && _('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var o = di(Nt, e, i, t | Bt);
      return o.elementType = x, o.lanes = a, o.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, o;
    }
    function xD(e, t, a, i) {
      var o = di(Le, e, i, t);
      return o.elementType = Tt, o.lanes = a, o;
    }
    function DD(e, t, a, i) {
      var o = di(xt, e, i, t);
      return o.elementType = At, o.lanes = a, o;
    }
    function bb(e, t, a, i) {
      var o = di(nt, e, i, t);
      o.elementType = sn, o.lanes = a;
      var s = {
        isHidden: !1
      };
      return o.stateNode = s, o;
    }
    function j0(e, t, a) {
      var i = di(be, e, null, t);
      return i.lanes = a, i;
    }
    function OD() {
      var e = di(ce, null, null, Je);
      return e.elementType = "DELETED", e;
    }
    function kD(e) {
      var t = di(Zt, null, null, Je);
      return t.stateNode = e, t;
    }
    function F0(e, t, a) {
      var i = e.children !== null ? e.children : [], o = di(Ne, i, e.key, t);
      return o.lanes = a, o.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, o;
    }
    function wb(e, t) {
      return e === null && (e = di(_e, null, null, Je)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function MD(e, t, a, i, o) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Cg, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = $n, this.eventTimes = Ys(X), this.expirationTimes = Ys(dn), this.pendingLanes = X, this.suspendedLanes = X, this.pingedLanes = X, this.expiredLanes = X, this.mutableReadLanes = X, this.finishedLanes = X, this.entangledLanes = X, this.entanglements = Ys(X), this.identifierPrefix = i, this.onRecoverableError = o, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], f = 0; f < Vn; f++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Zh:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case Vu:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function Rb(e, t, a, i, o, s, f, v, m, E) {
      var b = new MD(e, t, a, v, m), L = RD(t, s);
      b.current = L, L.stateNode = b;
      {
        var M = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        L.memoizedState = M;
      }
      return Gg(L), b;
    }
    var H0 = "18.2.0";
    function ND(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return nr(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: Zr,
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
        return fi;
      var t = bi(e), a = hR(t);
      if (t.tag === ne) {
        var i = t.type;
        if (Xl(i))
          return ZC(t, i, a);
      }
      return a;
    }
    function LD(e, t) {
      {
        var a = bi(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var o = kd(a);
        if (o === null)
          return null;
        if (o.mode & Ln) {
          var s = st(a) || "Component";
          if (!V0[s]) {
            V0[s] = !0;
            var f = Tn;
            try {
              xn(o), a.mode & Ln ? _("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : _("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              f ? xn(f) : pn();
            }
          }
        }
        return o.stateNode;
      }
    }
    function xb(e, t, a, i, o, s, f, v) {
      var m = !1, E = null;
      return Rb(e, t, m, E, a, i, o, s, f);
    }
    function Db(e, t, a, i, o, s, f, v, m, E) {
      var b = !0, L = Rb(a, i, b, e, o, s, f, v, m);
      L.context = Tb(null);
      var M = L.current, $ = Oa(), I = Ju(M), G = Vo($, I);
      return G.callback = t ?? null, Yu(M, G, I), Hx(L, I, $), L;
    }
    function rv(e, t, a, i) {
      al(t, e);
      var o = t.current, s = Oa(), f = Ju(o);
      Fd(f);
      var v = Tb(a);
      t.context === null ? t.context = v : t.pendingContext = v, ta && Tn !== null && !B0 && (B0 = !0, _(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, st(Tn) || "Unknown"));
      var m = Vo(s, f);
      m.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && _("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), m.callback = i);
      var E = Yu(o, m, f);
      return E !== null && (Or(E, o, f, s), fm(E, o, f)), f;
    }
    function ny(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case ce:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function AD(e) {
      switch (e.tag) {
        case re: {
          var t = e.stateNode;
          if (sf(t)) {
            var a = By(t);
            Ix(t, a);
          }
          break;
        }
        case Le: {
          Wo(function() {
            var o = qa(e, rt);
            if (o !== null) {
              var s = Oa();
              Or(o, e, rt, s);
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
      a !== null && a.dehydrated !== null && (a.retryLane = ch(a.retryLane, t));
    }
    function $0(e, t) {
      Ob(e, t);
      var a = e.alternate;
      a && Ob(a, t);
    }
    function zD(e) {
      if (e.tag === Le) {
        var t = Do, a = qa(e, t);
        if (a !== null) {
          var i = Oa();
          Or(a, e, t, i);
        }
        $0(e, t);
      }
    }
    function UD(e) {
      if (e.tag === Le) {
        var t = Ju(e), a = qa(e, t);
        if (a !== null) {
          var i = Oa();
          Or(a, e, t, i);
        }
        $0(e, t);
      }
    }
    function kb(e) {
      var t = Nd(e);
      return t === null ? null : t.stateNode;
    }
    var Mb = function(e) {
      return null;
    };
    function PD(e) {
      return Mb(e);
    }
    var Nb = function(e) {
      return !1;
    };
    function jD(e) {
      return Nb(e);
    }
    var Lb = null, Ab = null, zb = null, Ub = null, Pb = null, jb = null, Fb = null, Hb = null, Bb = null;
    {
      var Vb = function(e, t, a) {
        var i = t[a], o = Ht(e) ? e.slice() : _t({}, e);
        return a + 1 === t.length ? (Ht(o) ? o.splice(i, 1) : delete o[i], o) : (o[i] = Vb(e[i], t, a + 1), o);
      }, $b = function(e, t) {
        return Vb(e, t, 0);
      }, Ib = function(e, t, a, i) {
        var o = t[i], s = Ht(e) ? e.slice() : _t({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[o], Ht(s) ? s.splice(o, 1) : delete s[o];
        } else
          s[o] = Ib(
            // $FlowFixMe number or string is fine here
            e[o],
            t,
            a,
            i + 1
          );
        return s;
      }, Yb = function(e, t, a) {
        if (t.length !== a.length) {
          P("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              P("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return Ib(e, t, a, 0);
      }, Wb = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var o = t[a], s = Ht(e) ? e.slice() : _t({}, e);
        return s[o] = Wb(e[o], t, a + 1, i), s;
      }, Gb = function(e, t, a) {
        return Wb(e, t, 0, a);
      }, I0 = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      Lb = function(e, t, a, i) {
        var o = I0(e, t);
        if (o !== null) {
          var s = Gb(o.memoizedState, a, i);
          o.memoizedState = s, o.baseState = s, e.memoizedProps = _t({}, e.memoizedProps);
          var f = qa(e, rt);
          f !== null && Or(f, e, rt, dn);
        }
      }, Ab = function(e, t, a) {
        var i = I0(e, t);
        if (i !== null) {
          var o = $b(i.memoizedState, a);
          i.memoizedState = o, i.baseState = o, e.memoizedProps = _t({}, e.memoizedProps);
          var s = qa(e, rt);
          s !== null && Or(s, e, rt, dn);
        }
      }, zb = function(e, t, a, i) {
        var o = I0(e, t);
        if (o !== null) {
          var s = Yb(o.memoizedState, a, i);
          o.memoizedState = s, o.baseState = s, e.memoizedProps = _t({}, e.memoizedProps);
          var f = qa(e, rt);
          f !== null && Or(f, e, rt, dn);
        }
      }, Ub = function(e, t, a) {
        e.pendingProps = Gb(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = qa(e, rt);
        i !== null && Or(i, e, rt, dn);
      }, Pb = function(e, t) {
        e.pendingProps = $b(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = qa(e, rt);
        a !== null && Or(a, e, rt, dn);
      }, jb = function(e, t, a) {
        e.pendingProps = Yb(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = qa(e, rt);
        i !== null && Or(i, e, rt, dn);
      }, Fb = function(e) {
        var t = qa(e, rt);
        t !== null && Or(t, e, rt, dn);
      }, Hb = function(e) {
        Mb = e;
      }, Bb = function(e) {
        Nb = e;
      };
    }
    function FD(e) {
      var t = kd(e);
      return t === null ? null : t.stateNode;
    }
    function HD(e) {
      return null;
    }
    function BD() {
      return Tn;
    }
    function VD(e) {
      var t = e.findFiberByHostInstance, a = C.ReactCurrentDispatcher;
      return qv({
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
        findHostInstanceByFiber: FD,
        findFiberByHostInstance: t || HD,
        // React Refresh
        findHostInstancesForRefresh: gD,
        scheduleRefresh: mD,
        scheduleRoot: yD,
        setRefreshHandler: hD,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: BD,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: H0
      });
    }
    var Qb = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
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
        typeof arguments[1] == "function" ? _("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : ay(arguments[1]) ? _("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && _("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== Nn) {
          var i = kb(t.current);
          i && i.parentNode !== a && _("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      rv(e, t, null, null);
    }, ry.prototype.unmount = Y0.prototype.unmount = function() {
      typeof arguments[0] == "function" && _("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        lb() && _("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Wo(function() {
          rv(null, e, null, null);
        }), GC(t);
      }
    };
    function $D(e, t) {
      if (!ay(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      qb(e);
      var a = !1, i = !1, o = "", s = Qb;
      t != null && (t.hydrate ? P("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === Kr && _(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (o = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = xb(e, Zh, null, a, i, o, s);
      Yh(f.current, e);
      var v = e.nodeType === Nn ? e.parentNode : e;
      return fp(v), new Y0(f);
    }
    function ry(e) {
      this._internalRoot = e;
    }
    function ID(e) {
      e && Gy(e);
    }
    ry.prototype.unstable_scheduleHydration = ID;
    function YD(e, t, a) {
      if (!ay(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      qb(e), t === void 0 && _("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, o = a != null && a.hydratedSources || null, s = !1, f = !1, v = "", m = Qb;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (v = a.identifierPrefix), a.onRecoverableError !== void 0 && (m = a.onRecoverableError));
      var E = Db(t, null, e, Zh, i, s, f, v, m);
      if (Yh(E.current, e), fp(e), o)
        for (var b = 0; b < o.length; b++) {
          var L = o[b];
          JR(E, L);
        }
      return new ry(E);
    }
    function ay(e) {
      return !!(e && (e.nodeType === ra || e.nodeType === Ca || e.nodeType === pd || !Ge));
    }
    function av(e) {
      return !!(e && (e.nodeType === ra || e.nodeType === Ca || e.nodeType === pd || e.nodeType === Nn && e.nodeValue === " react-mount-point-unstable "));
    }
    function qb(e) {
      e.nodeType === ra && e.tagName && e.tagName.toUpperCase() === "BODY" && _("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), _p(e) && (e._reactRootContainer ? _("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : _("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var WD = C.ReactCurrentOwner, Xb;
    Xb = function(e) {
      if (e._reactRootContainer && e.nodeType !== Nn) {
        var t = kb(e._reactRootContainer.current);
        t && t.parentNode !== e && _("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = W0(e), o = !!(i && Hu(i));
      o && !a && _("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === ra && e.tagName && e.tagName.toUpperCase() === "BODY" && _("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function W0(e) {
      return e ? e.nodeType === Ca ? e.documentElement : e.firstChild : null;
    }
    function Kb() {
    }
    function GD(e, t, a, i, o) {
      if (o) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var M = ny(f);
            s.call(M);
          };
        }
        var f = Db(
          t,
          i,
          e,
          Vu,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          Kb
        );
        e._reactRootContainer = f, Yh(f.current, e);
        var v = e.nodeType === Nn ? e.parentNode : e;
        return fp(v), Wo(), f;
      } else {
        for (var m; m = e.lastChild; )
          e.removeChild(m);
        if (typeof i == "function") {
          var E = i;
          i = function() {
            var M = ny(b);
            E.call(M);
          };
        }
        var b = xb(
          e,
          Vu,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          Kb
        );
        e._reactRootContainer = b, Yh(b.current, e);
        var L = e.nodeType === Nn ? e.parentNode : e;
        return fp(L), Wo(function() {
          rv(t, b, a, i);
        }), b;
      }
    }
    function QD(e, t) {
      e !== null && typeof e != "function" && _("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function iy(e, t, a, i, o) {
      Xb(a), QD(o === void 0 ? null : o, "render");
      var s = a._reactRootContainer, f;
      if (!s)
        f = GD(a, t, e, o, i);
      else {
        if (f = s, typeof o == "function") {
          var v = o;
          o = function() {
            var m = ny(f);
            v.call(m);
          };
        }
        rv(t, f, e, o);
      }
      return ny(f);
    }
    function qD(e) {
      {
        var t = WD.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || _("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Ft(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === ra ? e : LD(e, "findDOMNode");
    }
    function XD(e, t, a) {
      if (_("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !av(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = _p(t) && t._reactRootContainer === void 0;
        i && _("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return iy(null, e, t, !0, a);
    }
    function KD(e, t, a) {
      if (_("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !av(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = _p(t) && t._reactRootContainer === void 0;
        i && _("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return iy(null, e, t, !1, a);
    }
    function ZD(e, t, a, i) {
      if (_("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !av(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !cu(e))
        throw new Error("parentComponent must be a valid React Component");
      return iy(e, t, a, !1, i);
    }
    function JD(e) {
      if (!av(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = _p(e) && e._reactRootContainer === void 0;
        t && _("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = W0(e), i = a && !Hu(a);
          i && _("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Wo(function() {
          iy(null, null, e, !1, function() {
            e._reactRootContainer = null, GC(e);
          });
        }), !0;
      } else {
        {
          var o = W0(e), s = !!(o && Hu(o)), f = e.nodeType === ra && av(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && _("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    Tu(AD), Yy(zD), ff(UD), ph($a), vh(Lr), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && _("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), Ed(nw), Lc(b0, Yx, Wo);
    function eO(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!ay(t))
        throw new Error("Target container is not a DOM element.");
      return ND(e, t, null, a);
    }
    function tO(e, t, a, i) {
      return ZD(e, t, a, i);
    }
    var G0 = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [Hu, Af, Wh, su, mo, b0]
    };
    function nO(e, t) {
      return G0.usingClientEntryPoint || _('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), $D(e, t);
    }
    function rO(e, t, a) {
      return G0.usingClientEntryPoint || _('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), YD(e, t, a);
    }
    function aO(e) {
      return lb() && _("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Wo(e);
    }
    var iO = VD({
      findFiberByHostInstance: ic,
      bundleType: 1,
      version: H0,
      rendererPackageName: "react-dom"
    });
    if (!iO && Sn && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var Zb = window.location.protocol;
      /^(https?|file):$/.test(Zb) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (Zb === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    ei.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = G0, ei.createPortal = eO, ei.createRoot = nO, ei.findDOMNode = qD, ei.flushSync = aO, ei.hydrate = XD, ei.hydrateRoot = rO, ei.render = KD, ei.unmountComponentAtNode = JD, ei.unstable_batchedUpdates = b0, ei.unstable_renderSubtreeIntoContainer = tO, ei.version = H0, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }(), ei;
}
var S1 = {};
function C1() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (S1.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(C1);
    } catch (g) {
      console.error(g);
    }
  }
}
S1.NODE_ENV === "production" ? (C1(), Z0.exports = uk()) : Z0.exports = sk();
var ck = Z0.exports, J0, fk = {}, uy = ck;
if (fk.NODE_ENV === "production")
  J0 = uy.createRoot, uy.hydrateRoot;
else {
  var p1 = uy.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  J0 = function(g, d) {
    p1.usingClientEntryPoint = !0;
    try {
      return uy.createRoot(g, d);
    } finally {
      p1.usingClientEntryPoint = !1;
    }
  };
}
var dk = Object.defineProperty, pk = Object.getOwnPropertyDescriptor, vk = (g, d, h, C) => {
  for (var w = C > 1 ? void 0 : C ? pk(d, h) : d, A = g.length - 1, P; A >= 0; A--)
    (P = g[A]) && (w = (C ? P(d, h, w) : P(w)) || w);
  return C && w && dk(d, h, w), w;
};
let hy = class {
  constructor(g, d) {
    this._logger = g, this._sceneEventBus = d;
    const h = document.getElementById("app");
    if (!h)
      throw new Error("No se encontró el tag con id app");
    this._root = J0(h);
    const C = this._sceneEventBus.subscribeTo(
      ud,
      Xo,
      this.onSceneChange.bind(this)
    );
    this._subscriptions = [C];
    const w = jn.get(fv);
    this.loadScene(w);
  }
  _scene = null;
  _root;
  _subscriptions;
  onSceneChange(g) {
    switch (this._logger.logInfo("Scene changed", g.payload), g.payload) {
      case Xo.Home:
        const d = jn.get(fv);
        this.loadScene(d);
        break;
      case Xo.Map:
        const h = jn.get(vy);
        this.loadScene(h);
        break;
      case Xo.Battle:
        const C = jn.get(py);
        this.loadScene(C);
        break;
      case Xo.GameOver:
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
hy = vk([
  vi()
], hy);
const hk = () => {
  jn.addSingleton(hy), jn.addTransient(fv), jn.addTransient(vy), jn.addTransient(py);
};
var ur = /* @__PURE__ */ ((g) => (g.HighCard = "HighCard", g.Pair = "Pair", g.DoublePair = "DoublePair", g.ThreeOfAKind = "ThreeOfAKind", g.Straight = "Straight", g.Flush = "Flush", g.FullHouse = "FullHouse", g.FourOfAKind = "FourOfAKind", g.StraightFlush = "StraightFlush", g.RoyalFlush = "RoyalFlush", g))(ur || {});
class ti extends od {
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
  constructor(d, h, C, w) {
    super(Hi.newGuid()), this._points = h, this._multiplier = C, this._name = d, this._level = w;
  }
  addLevel() {
    this._level += 1;
  }
  play(d) {
    const h = d.reduce((C, w) => C + w.number * this._points, 0);
    return {
      cards: d,
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
  isPlayable(d) {
    return d.length < 4 ? !1 : d.some((h) => d.sort((w, A) => A.number - w.number).filter((w) => w.number === h.number).length === 4);
  }
  play(d) {
    const h = d.sort((C, w) => w.number - C.number).filter((C, w, A) => A.filter((_) => _.number === C.number).length === 4).slice(0, 4);
    return super.play(h);
  }
}
class hv extends ti {
  static create() {
    return new hv(ur.Flush, 6, 6, 1);
  }
  isPlayable(d) {
    return d.length !== 5 ? !1 : d.sort((h, C) => h.number - C.number).every((h, C, w) => C === 0 ? !0 : h.type === w[C - 1].type);
  }
  play(d) {
    return super.play(d);
  }
}
class hC extends ti {
  static create() {
    return new hC(ur.FourOfAKind, 7, 7, 1);
  }
  isPlayable(d) {
    return d.length < 4 ? !1 : d.sort((h, C) => h.number - C.number).filter((h, C, w) => w.filter((P) => P.number === h.number).length === 4).length === 4;
  }
  play(d) {
    const h = d.sort((C, w) => w.number - C.number).filter((C, w, A) => A.filter((_) => _.number === C.number).length === 4).slice(0, 4);
    return super.play(h);
  }
}
class Ey extends ti {
  static create() {
    return new Ey(ur.HighCard, 1, 1, 1);
  }
  isPlayable(d) {
    return d.length >= 1;
  }
  play(d) {
    const h = d.sort((C, w) => w.number - C.number).slice(0, 1);
    return super.play(h);
  }
}
class _y extends ti {
  static create() {
    return new _y(ur.Pair, 2, 2, 1);
  }
  isPlayable(d) {
    return d.length < 2 ? !1 : d.some((h) => d.filter((w) => w.number === h.number).length >= 2);
  }
  play(d) {
    const h = d.sort((C, w) => w.number - C.number).filter((C, w, A) => A.filter((_) => _.number === C.number).length >= 2).slice(0, 2);
    return super.play(h);
  }
}
class mv extends ti {
  static create() {
    return new mv(ur.Straight, 5, 5, 1);
  }
  isPlayable(d) {
    return d.length < 5 ? !1 : d.sort((C, w) => C.number - w.number).every((C, w, A) => w === 0 ? !0 : C.number === A[w - 1].number + 1);
  }
  play(d) {
    return super.play(d);
  }
}
class mC extends ti {
  static create() {
    return new mC(ur.RoyalFlush, 10, 10, 1);
  }
  isPlayable(d) {
    return d.length !== 5 || !d.every((h) => h.number <= 12 && h.number >= 10) ? !1 : mv.create().isPlayable(d) && hv.create().isPlayable(d);
  }
  play(d) {
    return super.play(d);
  }
}
class yC extends ti {
  static create() {
    return new yC(ur.StraightFlush, 10, 10, 1);
  }
  isPlayable(d) {
    return d.length !== 5 ? !1 : mv.create().isPlayable(d) && hv.create().isPlayable(d);
  }
  play(d) {
    return super.play(d);
  }
}
class gC extends ti {
  static create() {
    return new gC(ur.ThreeOfAKind, 3, 3, 1);
  }
  isPlayable(d) {
    return d.length < 3 ? !1 : d.some((h) => d.filter((w) => w.number === h.number).length === 3);
  }
  play(d) {
    const h = d.sort((C, w) => w.number - C.number).filter((C, w, A) => A.filter((_) => _.number === C.number).length === 3).slice(0, 3);
    return super.play(h);
  }
}
class mk {
  static create(d) {
    switch (d) {
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
        return mv.create();
      case ur.Flush:
        return hv.create();
      case ur.StraightFlush:
        return yC.create();
      case ur.RoyalFlush:
        return mC.create();
      default:
        throw new Error(`Card play type ${d} is not valid`);
    }
  }
}
var yk = Object.defineProperty, gk = Object.getOwnPropertyDescriptor, Sk = (g, d, h, C) => {
  for (var w = C > 1 ? void 0 : C ? gk(d, h) : d, A = g.length - 1, P; A >= 0; A--)
    (P = g[A]) && (w = (C ? P(d, h, w) : P(w)) || w);
  return C && w && yk(d, h, w), w;
};
let eC = class {
  constructor(g) {
    this._state = g;
  }
  newRun(g) {
    const d = KO.createDeck(g);
    d.init();
    const h = bc.create();
    h.generateIsometricMap(d);
    const C = _y.create(), w = Ey.create(), A = io.create();
    A.setCardPlay(C), A.setCardPlay(w), this._state.set(C, ti), this._state.set(w, ti), this._state.setSingle(d, El), this._state.setSingle(h), this._state.setSingle(A);
  }
  addCardPlay(g) {
    const d = this._state.getOrThrow(io);
    d.setCardPlay(g), this._state.setSingle(d);
  }
};
eC = Sk([
  vi()
], eC);
var Ck = Object.defineProperty, Ek = Object.getOwnPropertyDescriptor, _k = (g, d, h, C) => {
  for (var w = C > 1 ? void 0 : C ? Ek(d, h) : d, A = g.length - 1, P; A >= 0; A--)
    (P = g[A]) && (w = (C ? P(d, h, w) : P(w)) || w);
  return C && w && Ck(d, h, w), w;
};
let tC = class {
  constructor(g, d) {
    this._state = g, this._sceneEventBus = d;
  }
  goToPoint(g) {
    if (!g)
      return;
    const d = this._state.getOrThrow(bc);
    if (d.isPointAccessible(g) && (d.moveToPoint(g), this._state.setSingle(d), g.type === Qn.Battle)) {
      const h = this._state.getAll(ti), C = io.create();
      C.init(g), h.forEach((P) => C.setCardPlay(P)), this._state.setSingle(C), this._state.getOrThrow(El).shuffle();
      const A = ud.create(Xo.Battle);
      this._sceneEventBus.publish(A);
    }
  }
};
tC = _k([
  vi()
], tC);
var bk = Object.defineProperty, wk = Object.getOwnPropertyDescriptor, Rk = (g, d, h, C) => {
  for (var w = C > 1 ? void 0 : C ? wk(d, h) : d, A = g.length - 1, P; A >= 0; A--)
    (P = g[A]) && (w = (C ? P(d, h, w) : P(w)) || w);
  return C && w && bk(d, h, w), w;
};
let nC = class {
  constructor(g, d, h) {
    this._state = g, this._battleEventBus = d, this._sceneEventBus = h;
  }
  selectCard(g) {
    const d = this._state.getOrThrow(El);
    d.selectCard(g), this._state.setSingle(d, El);
  }
  discardSelectedCards() {
    const g = this._state.getOrThrow(El);
    g.discardSelectedCards(), this._state.setSingle(g, El);
    const d = this._state.getOrThrow(io);
    d.downRemainingDiscards(), this._state.setSingle(d);
  }
  run() {
    const g = this._state.getOrThrow(io), d = this._state.getOrThrow(El), h = g.run(d.selectedCards);
    this._state.setSingle(g), d.playSelectedCards(), d.takeCardsToHand(), this._state.setSingle(d);
    const C = my.create(h);
    if (this._battleEventBus.publish(C), g.score >= g.objetiveScore) {
      const w = gy.create({ rewards: 0 });
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
    const d = this._state.getOrThrow(bc).currentPoint, h = Math.floor(Math.random() * (d.y * 200) + d.y * 100), w = Object.keys(ur).sort(() => Math.random() - 0.5).slice(0, 3);
    return {
      money: h,
      cardPlays: w.map((P) => ur[P])
    };
  }
  purchaseCardPlay(g) {
    let h = this._state.getAll(ti).find((w) => w.name === g);
    h && h.addLevel(), h || (h = mk.create(g)), this._state.set(h, ti);
    const C = this._state.getOrThrow(io);
    C.setCardPlay(h), this._state.setSingle(C);
  }
  rewardsPurchased() {
    const g = ud.create(Xo.Map);
    this._sceneEventBus.publish(g);
  }
};
nC = Rk([
  vi()
], nC);
const Tk = () => {
  jn.addSingleton(nC), jn.addSingleton(eC), jn.addSingleton(tC);
}, xk = () => {
  jn.addSingleton(sy), jn.addSingleton(cy);
}, Dk = function() {
  jn.addSingleton(sv), jn.addSingleton(OO, _O), jn.addSingleton(_c), hk(), Tk(), xk(), jn.build();
}, Ok = function() {
  Dk(), jn.get(sv).showLogs(!0), jn.get(hy), jn.get(_c);
};
Ok();
