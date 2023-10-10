var __defProp = Object.defineProperty,
  __defProps = Object.defineProperties,
  __getOwnPropDescs = Object.getOwnPropertyDescriptors,
  __getOwnPropSymbols = Object.getOwnPropertySymbols,
  __hasOwnProp = Object.prototype.hasOwnProperty,
  __propIsEnum = Object.prototype.propertyIsEnumerable,
  __defNormalProp = (e, t, o) =>
    t in e
      ? __defProp(e, t, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: o,
        })
      : (e[t] = o),
  __spreadValues = (e, t) => {
    for (var o in t || (t = {}))
      __hasOwnProp.call(t, o) && __defNormalProp(e, o, t[o]);
    if (__getOwnPropSymbols)
      for (var o of __getOwnPropSymbols(t))
        __propIsEnum.call(t, o) && __defNormalProp(e, o, t[o]);
    return e;
  },
  __spreadProps = (e, t) => __defProps(e, __getOwnPropDescs(t));
!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t(exports, require("vue"))
    : "function" == typeof define && define.amd
    ? define(["exports", "vue"], t)
    : t(
        ((e = "undefined" != typeof globalThis ? globalThis : e || self)[
          "mosha-vue-toastify"
        ] = {}),
        e.Vue
      );
})(this, function (e, t) {
  "use strict";
  const o = {
    type: "default",
    timeout: 5e3,
    showCloseButton: !0,
    position: "top-right",
    transition: "bounce",
    hideProgressBar: !1,
    swipeClose: !0,
  };
  var n;
  (e.ToastContentType = void 0),
    ((n = e.ToastContentType || (e.ToastContentType = {}))[(n.TITLE_ONLY = 0)] =
      "TITLE_ONLY"),
    (n[(n.TITLE_DESCRIPTION = 1)] = "TITLE_DESCRIPTION"),
    (n[(n.COMPONENT = 2)] = "COMPONENT"),
    (n[(n.VNODE = 3)] = "VNODE");
  const s = {
      "top-left": {
        bounce: "mosha__bounceInLeft",
        zoom: "mosha__zoomIn",
        slide: "mosha__slideInLeft",
      },
      "top-right": {
        bounce: "mosha__bounceInRight",
        zoom: "mosha__zoomIn",
        slide: "mosha__slideInRight",
      },
      "top-center": {
        bounce: "mosha__bounceInDown",
        zoom: "mosha__zoomIn",
        slide: "mosha__slideInDown",
      },
      "bottom-center": {
        bounce: "mosha__bounceInUp",
        zoom: "mosha__zoomIn",
        slide: "mosha__slideInUp",
      },
      "bottom-right": {
        bounce: "mosha__bounceInRight",
        zoom: "mosha__zoomIn",
        slide: "mosha__slideInRight",
      },
      "bottom-left": {
        bounce: "mosha__bounceInLeft",
        zoom: "mosha__zoomIn",
        slide: "mosha__slideInLeft",
      },
    },
    r = (e, t = 300) => {
      let o;
      return (...n) => {
        o && (clearTimeout(o), (o = void 0)),
          (o = setTimeout(() => e(...n), t));
      };
    },
    a = (e, o, n) => {
      const s = t.ref(),
        r = t.ref(void 0),
        a = t.ref(),
        i = (e) => e instanceof MouseEvent,
        l = (t) => {
          !1 !== n &&
            s.value &&
            (i(t)
              ? (r.value = s.value.clientX - t.clientX)
              : (r.value = s.value.touches[0].clientX - t.touches[0].clientX),
            (a.value = __spreadProps(__spreadValues({}, a.value), {
              transition: "none",
            })),
            e.endsWith("left")
              ? (a.value.left = -r.value + "px !important")
              : e.endsWith("right")
              ? (a.value.right = `${r.value}px !important`)
              : r.value > 0
              ? (a.value.left = -r.value + "px !important")
              : (a.value.right = `${r.value}px !important`),
            Math.abs(r.value) > 200 && o());
        },
        p = (e) => {
          !1 !== n &&
            (s.value && (s.value = void 0),
            r.value && (r.value = void 0),
            removeEventListener(e, l));
        };
      return (
        t.onUnmounted(() => {
          !1 !== n && (p("mousemove"), p("touchmove"));
        }),
        {
          swipedDiff: r,
          swipeStart: s,
          swipeStyle: a,
          swipeHandler: l,
          startSwipeHandler: (t) => {
            if (!1 === n) return;
            s.value = t;
            const o = i(t) ? "mousemove" : "touchmove",
              p = i(t) ? "mouseup" : "touchend";
            addEventListener(o, l),
              addEventListener(p, () =>
                ((t) => {
                  const o = { transition: "left .3s ease-out", left: 0 },
                    n = { transition: "right .3s ease-out", right: 0 },
                    i = { transition: "all .3s ease-out", left: 0, right: 0 };
                  e.endsWith("left")
                    ? (a.value = __spreadValues(__spreadValues({}, a.value), o))
                    : e.endsWith("right")
                    ? (a.value = __spreadValues(__spreadValues({}, a.value), n))
                    : (a.value = __spreadValues(
                        __spreadValues({}, a.value),
                        i
                      )),
                    (s.value = void 0),
                    (r.value = void 0),
                    removeEventListener(t, l);
                })(o)
              );
          },
          cleanUpMove: p,
        }
      );
    };
  var i = t.defineComponent({
    props: { type: { type: String, default: "default" } },
  });
  const l = { class: "mosha__icon" },
    p = {
      key: 0,
      xmlns: "http://www.w3.org/2000/svg",
      height: "200px",
      viewBox: "0 0 24 24",
      width: "200px",
      fill: "#ffffff",
    },
    c = t.createVNode(
      "path",
      {
        d: "M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3zM12 14c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z",
      },
      null,
      -1
    ),
    u = {
      key: 1,
      xmlns: "http://www.w3.org/2000/svg",
      height: "200px",
      viewBox: "0 0 24 24",
      width: "200px",
      fill: "#ffffff",
    },
    d = t.createVNode(
      "path",
      {
        d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 11c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z",
      },
      null,
      -1
    ),
    m = {
      key: 2,
      xmlns: "http://www.w3.org/2000/svg",
      height: "200px",
      viewBox: "0 0 24 24",
      width: "200px",
      fill: "#ffffff",
    },
    h = t.createVNode("path", { d: "M0 0h24v24H0V0z", fill: "none" }, null, -1),
    f = t.createVNode(
      "path",
      {
        d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29L5.7 12.7c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L10 14.17l6.88-6.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-7.59 7.59c-.38.39-1.02.39-1.41 0z",
      },
      null,
      -1
    ),
    _ = {
      key: 3,
      xmlns: "http://www.w3.org/2000/svg",
      height: "200px",
      viewBox: "0 0 24 24",
      width: "200px",
      fill: "#616161",
    },
    v = t.createVNode("path", { d: "M0 0h24v24H0z", fill: "none" }, null, -1),
    g = t.createVNode(
      "path",
      {
        d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
      },
      null,
      -1
    ),
    w = {
      key: 4,
      xmlns: "http://www.w3.org/2000/svg",
      height: "200px",
      viewBox: "0 0 24 24",
      width: "200px",
      fill: "#ffffff",
    },
    y = t.createVNode("path", { d: "M0 0h24v24H0z", fill: "none" }, null, -1),
    T = t.createVNode(
      "path",
      {
        d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
      },
      null,
      -1
    );
  i.render = function (e, o, n, s, r, a) {
    return (
      t.openBlock(),
      t.createBlock("span", l, [
        "warning" === e.type
          ? (t.openBlock(), t.createBlock("svg", p, [c]))
          : "danger" === e.type
          ? (t.openBlock(), t.createBlock("svg", u, [d]))
          : "success" === e.type
          ? (t.openBlock(), t.createBlock("svg", m, [h, f]))
          : "default" === e.type
          ? (t.openBlock(), t.createBlock("svg", _, [v, g]))
          : (t.openBlock(), t.createBlock("svg", w, [y, T])),
      ])
    );
  };
  var b = t.defineComponent({
    name: "MToast",
    components: { MIcon: i },
    props: {
      visible: Boolean,
      text: { type: String, default: "" },
      description: { type: String, default: "" },
      toastBackgroundColor: { type: String, default: "" },
      type: { type: String, default: "default" },
      onClose: { type: Function, default: () => null },
      onCloseHandler: { type: Function, required: !0 },
      offset: { type: Number, required: !0 },
      id: { type: Number, required: !0 },
      timeout: { type: Number, default: 5e3 },
      position: { type: String, required: !0 },
      showCloseButton: { type: Boolean, default: !0 },
      swipeClose: { type: Boolean, default: !0 },
      hideProgressBar: { type: Boolean, default: !1 },
      showIcon: { type: Boolean, default: !1 },
      transition: { type: String, default: "bounce" },
    },
    setup(e, o) {
      const n = t.ref(),
        { width: i } = (() => {
          const e = t.ref(-1),
            o = t.ref(-1),
            n = (t) => {
              null !== t &&
                null !== t.currentTarget &&
                ((e.value = t.currentTarget.innerWidth),
                (o.value = t.currentTarget.innerHeight));
            };
          return (
            t.onMounted(() => {
              window.innerWidth > 0 &&
                ((e.value = window.innerWidth), (o.value = window.innerHeight)),
                window.addEventListener("resize", r(n));
            }),
            t.onUnmounted(() => {
              window.removeEventListener("resize", r(n));
            }),
            { width: e, height: o }
          );
        })(),
        {
          swipedDiff: l,
          startSwipeHandler: p,
          swipeStyle: c,
          cleanUpMove: u,
        } = a(e.position, e.onCloseHandler, e.swipeClose),
        { transitionType: d } =
          ((m = e.position),
          (h = e.transition),
          (f = l),
          {
            transitionType: t.computed(() =>
              f.value > 200
                ? "mosha__fadeOutLeft"
                : f.value < -200
                ? "mosha__fadeOutRight"
                : s[m][h]
            ),
          });
      var m, h, f;
      const {
          start: _,
          stop: v,
          progress: g,
        } = ((e, o) => {
          const n = t.ref(),
            s = t.ref(0),
            r = t.ref(o),
            a = t.ref(),
            i = t.ref(100),
            l = () => {
              clearInterval(a.value), clearTimeout(n.value);
            };
          return (
            t.onMounted(() => {}),
            t.onUnmounted(() => {
              l();
            }),
            {
              start: () => {
                (s.value = Date.now()),
                  clearTimeout(n.value),
                  (a.value = setInterval(() => {
                    i.value--;
                  }, o / 100 - 5)),
                  (n.value = setTimeout(e, r.value));
              },
              stop: () => {
                clearInterval(a.value),
                  clearTimeout(n.value),
                  (r.value -= Date.now() - s.value);
              },
              clear: l,
              progress: i,
            }
          );
        })(() => {
          e.onCloseHandler();
        }, e.timeout),
        w = t.computed(() => o.slots.default),
        y = t.computed(() => /<\/?[a-z][\s\S]*>/i.test(e.description)),
        T = () => {
          e.timeout > 0 && _();
        };
      return (
        t.watchEffect(() => {
          const { customStyle: o } = ((e, o, n) => {
            const s = t.computed(() => {
              switch (e) {
                case "top-left":
                  return { left: "0", top: `${o}px` };
                case "bottom-left":
                  return { left: "0", bottom: `${o}px` };
                case "bottom-right":
                  return { right: "0", bottom: `${o}px` };
                case "top-center":
                  return {
                    top: `${o}px`,
                    left: "0",
                    right: "0",
                    marginRight: "auto",
                    marginLeft: "auto",
                  };
                case "bottom-center":
                  return {
                    bottom: `${o}px`,
                    left: "0",
                    right: "0",
                    marginRight: "auto",
                    marginLeft: "auto",
                  };
                default:
                  return { right: "0", top: `${o}px` };
              }
            });
            return (
              n.length > 0 && (s.value.backgroundColor = n), { customStyle: s }
            );
          })(e.position, e.offset, e.toastBackgroundColor);
          n.value = o.value;
        }),
        t.onMounted(() => {
          T();
        }),
        {
          style: n,
          transitionType: d,
          startTimer: T,
          progress: g,
          onTouchStart: (e) => {
            p(e);
          },
          onMouseLeave: () => {
            u("mousemove"), T();
          },
          onMouseDown: (e) => {
            p(e);
          },
          swipeStyle: c,
          isSlotPassed: w,
          isDescriptionHtml: y,
          onMouseEnter: () => {
            e.timeout > 0 && i.value > 425 && v();
          },
        }
      );
    },
  });
  const C = { class: "mosha__toast__content-wrapper" },
    B = { class: "mosha__toast__content" },
    N = { class: "mosha__toast__content__text" },
    V = { key: 1, class: "mosha__toast__content__description" },
    I = { key: 0, class: "mosha__toast__slot-wrapper" };
  b.render = function (e, o, n, s, r, a) {
    const i = t.resolveComponent("MIcon");
    return (
      t.openBlock(),
      t.createBlock(
        t.Transition,
        { name: e.transitionType, type: "animation" },
        {
          default: t.withCtx(() => [
            e.visible
              ? (t.openBlock(),
                t.createBlock(
                  "div",
                  {
                    key: 0,
                    class: [
                      "mosha__toast",
                      e.toastBackgroundColor ? null : e.type,
                    ],
                    style: [e.style, e.swipeStyle],
                    onMouseenter:
                      o[2] ||
                      (o[2] = (...t) => e.onMouseEnter && e.onMouseEnter(...t)),
                    onMouseleave:
                      o[3] ||
                      (o[3] = (...t) => e.onMouseLeave && e.onMouseLeave(...t)),
                    onTouchstartPassive:
                      o[4] ||
                      (o[4] = (...t) => e.onTouchStart && e.onTouchStart(...t)),
                    onMousedown:
                      o[5] ||
                      (o[5] = (...t) => e.onMouseDown && e.onMouseDown(...t)),
                  },
                  [
                    t.createVNode("div", C, [
                      e.showIcon
                        ? (t.openBlock(),
                          t.createBlock(i, { key: 0, type: e.type }, null, 8, [
                            "type",
                          ]))
                        : t.createCommentVNode("", !0),
                      t.createVNode("div", B, [
                        t.createVNode("div", N, t.toDisplayString(e.text), 1),
                        e.description.length > 0 && e.isDescriptionHtml
                          ? (t.openBlock(),
                            t.createBlock(
                              "div",
                              {
                                key: 0,
                                class: "mosha__toast__content__description",
                                innerHTML: e.description,
                              },
                              null,
                              8,
                              ["innerHTML"]
                            ))
                          : t.createCommentVNode("", !0),
                        e.description.length > 0 && !e.isDescriptionHtml
                          ? (t.openBlock(),
                            t.createBlock(
                              "div",
                              V,
                              t.toDisplayString(e.description),
                              1
                            ))
                          : t.createCommentVNode("", !0),
                      ]),
                    ]),
                    e.isSlotPassed
                      ? (t.openBlock(),
                        t.createBlock("div", I, [
                          t.renderSlot(e.$slots, "default"),
                        ]))
                      : t.createCommentVNode("", !0),
                    e.showCloseButton
                      ? (t.openBlock(),
                        t.createBlock("div", {
                          key: 1,
                          class: "mosha__toast__close-icon",
                          onClick:
                            o[1] ||
                            (o[1] = (...t) =>
                              e.onCloseHandler && e.onCloseHandler(...t)),
                        }))
                      : t.createCommentVNode("", !0),
                    e.hideProgressBar
                      ? t.createCommentVNode("", !0)
                      : (t.openBlock(),
                        t.createBlock(
                          "div",
                          {
                            key: 2,
                            class: "mosha__toast__progress",
                            style: { width: `${e.progress}%` },
                          },
                          null,
                          4
                        )),
                  ],
                  38
                ))
              : t.createCommentVNode("", !0),
          ]),
          _: 3,
        },
        8,
        ["name"]
      )
    );
  };
  const k = {
    "top-left": [],
    "top-right": [],
    "bottom-left": [],
    "bottom-right": [],
    "top-center": [],
    "bottom-center": [],
  };
  let P = 0;
  const x = (t, n) => {
      const s = P++,
        r = n ? O(n) : o;
      if (t.__v_isVNode)
        return (
          M(s, e.ToastContentType.VNODE, r, t),
          { close: () => L(s, r.position) }
        );
      if (t.hasOwnProperty("render"))
        return (
          M(s, e.ToastContentType.COMPONENT, r, t),
          { close: () => L(s, r.position) }
        );
      const a = E(t);
      return (
        M(s, e.ToastContentType.TITLE_DESCRIPTION, r, a),
        { close: () => L(s, r.position) }
      );
    },
    M = (o, n, s, r) => {
      setTimeout(() => {
        const a = z(s, k, 12),
          i = document.createElement("div");
        let l;
        document.body.appendChild(i),
          (l =
            n === e.ToastContentType.VNODE
              ? t.createVNode(b, S(s, o, a, L), () => [r])
              : n === e.ToastContentType.TITLE_DESCRIPTION
              ? t.createVNode(b, S(s, o, a, L, r))
              : t.createVNode(b, S(s, o, a, L), () => [t.createVNode(r)])),
          t.render(l, i),
          k[s.position].push({ toastVNode: l, container: i }),
          l.component && (l.component.props.visible = !0);
      }, 1);
    },
    S = (e, t, o, n, s) =>
      __spreadProps(__spreadValues(__spreadValues({}, e), s), {
        id: t,
        offset: o,
        visible: !1,
        onCloseHandler: () => {
          n(t, e.position ? e.position : "top-right");
        },
      }),
    O = (e) => {
      const t = __spreadProps(__spreadValues({}, e), {
        type: e.type || o.type,
        timeout: e.timeout || o.timeout,
        showCloseButton: e.showCloseButton,
        position: e.position || o.position,
        showIcon: e.showIcon,
        swipeClose: e.swipeClose,
        transition: e.transition || o.transition,
      });
      return (
        (t.hideProgressBar = void 0 !== t.timeout && t.timeout <= 0),
        void 0 !== e.hideProgressBar && (t.hideProgressBar = e.hideProgressBar),
        t
      );
    },
    E = (e) => ({
      text: "string" == typeof e ? e : e.title,
      description: "string" == typeof e ? void 0 : e.description,
    }),
    z = (e, t, o) => {
      let n = o;
      if (!e.position) throw new Error("no position");
      return (
        t[e.position].forEach(({ toastVNode: e }) => {
          const t = e.el.offsetHeight + o;
          n += t || 0;
        }),
        n
      );
    },
    L = (e, o) => {
      const n = k[o],
        s = n.findIndex(({ toastVNode: t }) => t.props && e === t.props.id);
      if (-1 === s) return;
      const { container: r, toastVNode: a } = n[s];
      if (!a.el) return;
      const i = a.el.offsetHeight;
      k[o].splice(s, 1),
        ((e, t, o, n) => {
          for (let s = e; s < t.length; s++) {
            const { toastVNode: e } = t[s];
            if (!e.el) return;
            const r = o.split("-")[0] || "top",
              a = parseInt(e.el.style[r], 10) - n - 12;
            if (!e.component) return;
            e.component.props.offset = a;
          }
        })(s, n, o, i),
        a.component &&
          ((a.component.props.visible = !1),
          a.component.props.onClose && a.component.props.onClose(),
          setTimeout(() => {
            t.render(null, r), document.body.removeChild(r);
          }, 1e3));
    };
  var D = {
    install: (e) => {
      (e.config.globalProperties.$moshaToast = x), e.provide("moshaToast", x);
    },
  };
  (e.clearToasts = () => {
    Object.entries(k).forEach(([e, t]) => {
      if (t.length > 0) {
        t.map((e) => e.toastVNode.props.id).forEach((t) => {
          L(t, e);
        });
      }
    });
  }),
    (e.createToast = x),
    (e.default = D),
    (e.withProps = (e, o) => t.createVNode(e, o)),
    Object.defineProperty(e, "__esModule", { value: !0 }),
    (e[Symbol.toStringTag] = "Module");
});