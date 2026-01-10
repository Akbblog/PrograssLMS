"use strict";
"use client";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all3) => {
    for (var name in all3)
      __defProp(target, name, { get: all3[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/react/cjs/react.development.js
  var require_react_development = __commonJS({
    "node_modules/react/cjs/react.development.js"(exports, module) {
      "use strict";
      (function() {
        function defineDeprecationWarning(methodName, info) {
          Object.defineProperty(Component.prototype, methodName, {
            get: function() {
              console.warn(
                "%s(...) is deprecated in plain JavaScript React classes. %s",
                info[0],
                info[1]
              );
            }
          });
        }
        function getIteratorFn(maybeIterable) {
          if (null === maybeIterable || "object" !== typeof maybeIterable)
            return null;
          maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
          return "function" === typeof maybeIterable ? maybeIterable : null;
        }
        function warnNoop(publicInstance, callerName) {
          publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
          var warningKey = publicInstance + "." + callerName;
          didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
            "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
            callerName,
            publicInstance
          ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
        }
        function Component(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        function ComponentDummy() {
        }
        function PureComponent(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        function noop4() {
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          try {
            testStringCoercion(value);
            var JSCompiler_inline_result = false;
          } catch (e) {
            JSCompiler_inline_result = true;
          }
          if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(
              JSCompiler_inline_result,
              "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
              JSCompiler_inline_result$jscomp$0
            );
            return testStringCoercion(value);
          }
        }
        function getComponentNameFromType(type) {
          if (null == type) return null;
          if ("function" === typeof type)
            return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
          if ("string" === typeof type) return type;
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
              return "Activity";
          }
          if ("object" === typeof type)
            switch ("number" === typeof type.tag && console.error(
              "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
            ), type.$$typeof) {
              case REACT_PORTAL_TYPE:
                return "Portal";
              case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
              case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
              case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
              case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE2:
                innerType = type._payload;
                type = type._init;
                try {
                  return getComponentNameFromType(type(innerType));
                } catch (x) {
                }
            }
          return null;
        }
        function getTaskName(type) {
          if (type === REACT_FRAGMENT_TYPE) return "<>";
          if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE2)
            return "<...>";
          try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
          } catch (x) {
            return "<...>";
          }
        }
        function getOwner() {
          var dispatcher = ReactSharedInternals.A;
          return null === dispatcher ? null : dispatcher.getOwner();
        }
        function UnknownOwner() {
          return Error("react-stack-top-frame");
        }
        function hasValidKey(config) {
          if (hasOwnProperty2.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return false;
          }
          return void 0 !== config.key;
        }
        function defineKeyPropWarningGetter(props, displayName) {
          function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
              "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
              displayName
            ));
          }
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
        function elementRefGetterWithDeprecationWarning() {
          var componentName = getComponentNameFromType(this.type);
          didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
            "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
          ));
          componentName = this.props.ref;
          return void 0 !== componentName ? componentName : null;
        }
        function ReactElement(type, key, props, owner, debugStack, debugTask) {
          var refProp = props.ref;
          type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type,
            key,
            props,
            _owner: owner
          };
          null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: false,
            get: elementRefGetterWithDeprecationWarning
          }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
          type._store = {};
          Object.defineProperty(type._store, "validated", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: 0
          });
          Object.defineProperty(type, "_debugInfo", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: null
          });
          Object.defineProperty(type, "_debugStack", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugStack
          });
          Object.defineProperty(type, "_debugTask", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugTask
          });
          Object.freeze && (Object.freeze(type.props), Object.freeze(type));
          return type;
        }
        function cloneAndReplaceKey(oldElement, newKey) {
          newKey = ReactElement(
            oldElement.type,
            newKey,
            oldElement.props,
            oldElement._owner,
            oldElement._debugStack,
            oldElement._debugTask
          );
          oldElement._store && (newKey._store.validated = oldElement._store.validated);
          return newKey;
        }
        function validateChildKeys(node) {
          isValidElement5(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE2 && ("fulfilled" === node._payload.status ? isValidElement5(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
        }
        function isValidElement5(object) {
          return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        function escape(key) {
          var escaperLookup = { "=": "=0", ":": "=2" };
          return "$" + key.replace(/[=:]/g, function(match) {
            return escaperLookup[match];
          });
        }
        function getElementKey(element, index2) {
          return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index2.toString(36);
        }
        function resolveThenable(thenable) {
          switch (thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
            default:
              switch ("string" === typeof thenable.status ? thenable.then(noop4, noop4) : (thenable.status = "pending", thenable.then(
                function(fulfilledValue) {
                  "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
                },
                function(error) {
                  "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
                }
              )), thenable.status) {
                case "fulfilled":
                  return thenable.value;
                case "rejected":
                  throw thenable.reason;
              }
          }
          throw thenable;
        }
        function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
          var type = typeof children;
          if ("undefined" === type || "boolean" === type) children = null;
          var invokeCallback = false;
          if (null === children) invokeCallback = true;
          else
            switch (type) {
              case "bigint":
              case "string":
              case "number":
                invokeCallback = true;
                break;
              case "object":
                switch (children.$$typeof) {
                  case REACT_ELEMENT_TYPE:
                  case REACT_PORTAL_TYPE:
                    invokeCallback = true;
                    break;
                  case REACT_LAZY_TYPE2:
                    return invokeCallback = children._init, mapIntoArray(
                      invokeCallback(children._payload),
                      array,
                      escapedPrefix,
                      nameSoFar,
                      callback
                    );
                }
            }
          if (invokeCallback) {
            invokeCallback = children;
            callback = callback(invokeCallback);
            var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
            isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
              return c;
            })) : null != callback && (isValidElement5(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
              callback,
              escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
                userProvidedKeyEscapeRegex,
                "$&/"
              ) + "/") + childKey
            ), "" !== nameSoFar && null != invokeCallback && isValidElement5(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
            return 1;
          }
          invokeCallback = 0;
          childKey = "" === nameSoFar ? "." : nameSoFar + ":";
          if (isArrayImpl(children))
            for (var i = 0; i < children.length; i++)
              nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
                nameSoFar,
                array,
                escapedPrefix,
                type,
                callback
              );
          else if (i = getIteratorFn(children), "function" === typeof i)
            for (i === children.entries && (didWarnAboutMaps || console.warn(
              "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
            ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
              nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
                nameSoFar,
                array,
                escapedPrefix,
                type,
                callback
              );
          else if ("object" === type) {
            if ("function" === typeof children.then)
              return mapIntoArray(
                resolveThenable(children),
                array,
                escapedPrefix,
                nameSoFar,
                callback
              );
            array = String(children);
            throw Error(
              "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
            );
          }
          return invokeCallback;
        }
        function mapChildren(children, func, context) {
          if (null == children) return children;
          var result = [], count3 = 0;
          mapIntoArray(children, result, "", "", function(child) {
            return func.call(context, child, count3++);
          });
          return result;
        }
        function lazyInitializer(payload) {
          if (-1 === payload._status) {
            var ioInfo = payload._ioInfo;
            null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
            ioInfo = payload._result;
            var thenable = ioInfo();
            thenable.then(
              function(moduleObject) {
                if (0 === payload._status || -1 === payload._status) {
                  payload._status = 1;
                  payload._result = moduleObject;
                  var _ioInfo = payload._ioInfo;
                  null != _ioInfo && (_ioInfo.end = performance.now());
                  void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
                }
              },
              function(error) {
                if (0 === payload._status || -1 === payload._status) {
                  payload._status = 2;
                  payload._result = error;
                  var _ioInfo2 = payload._ioInfo;
                  null != _ioInfo2 && (_ioInfo2.end = performance.now());
                  void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
                }
              }
            );
            ioInfo = payload._ioInfo;
            if (null != ioInfo) {
              ioInfo.value = thenable;
              var displayName = thenable.displayName;
              "string" === typeof displayName && (ioInfo.name = displayName);
            }
            -1 === payload._status && (payload._status = 0, payload._result = thenable);
          }
          if (1 === payload._status)
            return ioInfo = payload._result, void 0 === ioInfo && console.error(
              "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
              ioInfo
            ), "default" in ioInfo || console.error(
              "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
              ioInfo
            ), ioInfo.default;
          throw payload._result;
        }
        function resolveDispatcher() {
          var dispatcher = ReactSharedInternals.H;
          null === dispatcher && console.error(
            "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
          );
          return dispatcher;
        }
        function releaseAsyncTransition() {
          ReactSharedInternals.asyncTransitions--;
        }
        function enqueueTask(task) {
          if (null === enqueueTaskImpl)
            try {
              var requireString = ("require" + Math.random()).slice(0, 7);
              enqueueTaskImpl = (module && module[requireString]).call(
                module,
                "timers"
              ).setImmediate;
            } catch (_err) {
              enqueueTaskImpl = function(callback) {
                false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                  "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
                ));
                var channel = new MessageChannel();
                channel.port1.onmessage = callback;
                channel.port2.postMessage(void 0);
              };
            }
          return enqueueTaskImpl(task);
        }
        function aggregateErrors(errors) {
          return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
        }
        function popActScope(prevActQueue, prevActScopeDepth) {
          prevActScopeDepth !== actScopeDepth - 1 && console.error(
            "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
          );
          actScopeDepth = prevActScopeDepth;
        }
        function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
          var queue = ReactSharedInternals.actQueue;
          if (null !== queue)
            if (0 !== queue.length)
              try {
                flushActQueue(queue);
                enqueueTask(function() {
                  return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                });
                return;
              } catch (error) {
                ReactSharedInternals.thrownErrors.push(error);
              }
            else ReactSharedInternals.actQueue = null;
          0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
        }
        function flushActQueue(queue) {
          if (!isFlushing) {
            isFlushing = true;
            var i = 0;
            try {
              for (; i < queue.length; i++) {
                var callback = queue[i];
                do {
                  ReactSharedInternals.didUsePromise = false;
                  var continuation = callback(false);
                  if (null !== continuation) {
                    if (ReactSharedInternals.didUsePromise) {
                      queue[i] = callback;
                      queue.splice(0, i);
                      return;
                    }
                    callback = continuation;
                  } else break;
                } while (1);
              }
              queue.length = 0;
            } catch (error) {
              queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
            } finally {
              isFlushing = false;
            }
          }
        }
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
        var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE2 = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
          isMounted: function() {
            return false;
          },
          enqueueForceUpdate: function(publicInstance) {
            warnNoop(publicInstance, "forceUpdate");
          },
          enqueueReplaceState: function(publicInstance) {
            warnNoop(publicInstance, "replaceState");
          },
          enqueueSetState: function(publicInstance) {
            warnNoop(publicInstance, "setState");
          }
        }, assign = Object.assign, emptyObject = {};
        Object.freeze(emptyObject);
        Component.prototype.isReactComponent = {};
        Component.prototype.setState = function(partialState, callback) {
          if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
            throw Error(
              "takes an object of state variables to update or a function which returns an object of state variables."
            );
          this.updater.enqueueSetState(this, partialState, callback, "setState");
        };
        Component.prototype.forceUpdate = function(callback) {
          this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
        };
        var deprecatedAPIs = {
          isMounted: [
            "isMounted",
            "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
          ],
          replaceState: [
            "replaceState",
            "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
          ]
        };
        for (fnName in deprecatedAPIs)
          deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
        ComponentDummy.prototype = Component.prototype;
        deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
        deprecatedAPIs.constructor = PureComponent;
        assign(deprecatedAPIs, Component.prototype);
        deprecatedAPIs.isPureReactComponent = true;
        var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = {
          H: null,
          A: null,
          T: null,
          S: null,
          actQueue: null,
          asyncTransitions: 0,
          isBatchingLegacy: false,
          didScheduleLegacyUpdate: false,
          didUsePromise: false,
          thrownErrors: [],
          getCurrentStack: null,
          recentlyCreatedOwnerStacks: 0
        }, hasOwnProperty2 = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
          return null;
        };
        deprecatedAPIs = {
          react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
          }
        };
        var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
        var didWarnAboutElementRef = {};
        var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
          deprecatedAPIs,
          UnknownOwner
        )();
        var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
        var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
          if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
            var event = new window.ErrorEvent("error", {
              bubbles: true,
              cancelable: true,
              message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
              error
            });
            if (!window.dispatchEvent(event)) return;
          } else if ("object" === typeof process && "function" === typeof process.emit) {
            process.emit("uncaughtException", error);
            return;
          }
          console.error(error);
        }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
          queueMicrotask(function() {
            return queueMicrotask(callback);
          });
        } : enqueueTask;
        deprecatedAPIs = Object.freeze({
          __proto__: null,
          c: function(size4) {
            return resolveDispatcher().useMemoCache(size4);
          }
        });
        var fnName = {
          map: mapChildren,
          forEach: function(children, forEachFunc, forEachContext) {
            mapChildren(
              children,
              function() {
                forEachFunc.apply(this, arguments);
              },
              forEachContext
            );
          },
          count: function(children) {
            var n = 0;
            mapChildren(children, function() {
              n++;
            });
            return n;
          },
          toArray: function(children) {
            return mapChildren(children, function(child) {
              return child;
            }) || [];
          },
          only: function(children) {
            if (!isValidElement5(children))
              throw Error(
                "React.Children.only expected to receive a single React element child."
              );
            return children;
          }
        };
        exports.Activity = REACT_ACTIVITY_TYPE;
        exports.Children = fnName;
        exports.Component = Component;
        exports.Fragment = REACT_FRAGMENT_TYPE;
        exports.Profiler = REACT_PROFILER_TYPE;
        exports.PureComponent = PureComponent;
        exports.StrictMode = REACT_STRICT_MODE_TYPE;
        exports.Suspense = REACT_SUSPENSE_TYPE;
        exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
        exports.__COMPILER_RUNTIME = deprecatedAPIs;
        exports.act = function(callback) {
          var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
          actScopeDepth++;
          var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
          try {
            var result = callback();
          } catch (error) {
            ReactSharedInternals.thrownErrors.push(error);
          }
          if (0 < ReactSharedInternals.thrownErrors.length)
            throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
          if (null !== result && "object" === typeof result && "function" === typeof result.then) {
            var thenable = result;
            queueSeveralMicrotasks(function() {
              didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
                "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
              ));
            });
            return {
              then: function(resolve, reject) {
                didAwaitActCall = true;
                thenable.then(
                  function(returnValue) {
                    popActScope(prevActQueue, prevActScopeDepth);
                    if (0 === prevActScopeDepth) {
                      try {
                        flushActQueue(queue), enqueueTask(function() {
                          return recursivelyFlushAsyncActWork(
                            returnValue,
                            resolve,
                            reject
                          );
                        });
                      } catch (error$0) {
                        ReactSharedInternals.thrownErrors.push(error$0);
                      }
                      if (0 < ReactSharedInternals.thrownErrors.length) {
                        var _thrownError = aggregateErrors(
                          ReactSharedInternals.thrownErrors
                        );
                        ReactSharedInternals.thrownErrors.length = 0;
                        reject(_thrownError);
                      }
                    } else resolve(returnValue);
                  },
                  function(error) {
                    popActScope(prevActQueue, prevActScopeDepth);
                    0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                      ReactSharedInternals.thrownErrors
                    ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                  }
                );
              }
            };
          }
          var returnValue$jscomp$0 = result;
          popActScope(prevActQueue, prevActScopeDepth);
          0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
            ));
          }), ReactSharedInternals.actQueue = null);
          if (0 < ReactSharedInternals.thrownErrors.length)
            throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
                return recursivelyFlushAsyncActWork(
                  returnValue$jscomp$0,
                  resolve,
                  reject
                );
              })) : resolve(returnValue$jscomp$0);
            }
          };
        };
        exports.cache = function(fn) {
          return function() {
            return fn.apply(null, arguments);
          };
        };
        exports.cacheSignal = function() {
          return null;
        };
        exports.captureOwnerStack = function() {
          var getCurrentStack = ReactSharedInternals.getCurrentStack;
          return null === getCurrentStack ? null : getCurrentStack();
        };
        exports.cloneElement = function(element, config, children) {
          if (null === element || void 0 === element)
            throw Error(
              "The argument must be a React element, but you passed " + element + "."
            );
          var props = assign({}, element.props), key = element.key, owner = element._owner;
          if (null != config) {
            var JSCompiler_inline_result;
            a: {
              if (hasOwnProperty2.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
                config,
                "ref"
              ).get) && JSCompiler_inline_result.isReactWarning) {
                JSCompiler_inline_result = false;
                break a;
              }
              JSCompiler_inline_result = void 0 !== config.ref;
            }
            JSCompiler_inline_result && (owner = getOwner());
            hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
            for (propName in config)
              !hasOwnProperty2.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
          }
          var propName = arguments.length - 2;
          if (1 === propName) props.children = children;
          else if (1 < propName) {
            JSCompiler_inline_result = Array(propName);
            for (var i = 0; i < propName; i++)
              JSCompiler_inline_result[i] = arguments[i + 2];
            props.children = JSCompiler_inline_result;
          }
          props = ReactElement(
            element.type,
            key,
            props,
            owner,
            element._debugStack,
            element._debugTask
          );
          for (key = 2; key < arguments.length; key++)
            validateChildKeys(arguments[key]);
          return props;
        };
        exports.createContext = function(defaultValue) {
          defaultValue = {
            $$typeof: REACT_CONTEXT_TYPE,
            _currentValue: defaultValue,
            _currentValue2: defaultValue,
            _threadCount: 0,
            Provider: null,
            Consumer: null
          };
          defaultValue.Provider = defaultValue;
          defaultValue.Consumer = {
            $$typeof: REACT_CONSUMER_TYPE,
            _context: defaultValue
          };
          defaultValue._currentRenderer = null;
          defaultValue._currentRenderer2 = null;
          return defaultValue;
        };
        exports.createElement = function(type, config, children) {
          for (var i = 2; i < arguments.length; i++)
            validateChildKeys(arguments[i]);
          i = {};
          var key = null;
          if (null != config)
            for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
              "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
            )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
              hasOwnProperty2.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
          var childrenLength = arguments.length - 2;
          if (1 === childrenLength) i.children = children;
          else if (1 < childrenLength) {
            for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
              childArray[_i] = arguments[_i + 2];
            Object.freeze && Object.freeze(childArray);
            i.children = childArray;
          }
          if (type && type.defaultProps)
            for (propName in childrenLength = type.defaultProps, childrenLength)
              void 0 === i[propName] && (i[propName] = childrenLength[propName]);
          key && defineKeyPropWarningGetter(
            i,
            "function" === typeof type ? type.displayName || type.name || "Unknown" : type
          );
          var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
          return ReactElement(
            type,
            key,
            i,
            getOwner(),
            propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
            propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
          );
        };
        exports.createRef = function() {
          var refObject = { current: null };
          Object.seal(refObject);
          return refObject;
        };
        exports.forwardRef = function(render) {
          null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
            "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
          ) : "function" !== typeof render ? console.error(
            "forwardRef requires a render function but was given %s.",
            null === render ? "null" : typeof render
          ) : 0 !== render.length && 2 !== render.length && console.error(
            "forwardRef render functions accept exactly two parameters: props and ref. %s",
            1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
          );
          null != render && null != render.defaultProps && console.error(
            "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
          );
          var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
          Object.defineProperty(elementType, "displayName", {
            enumerable: false,
            configurable: true,
            get: function() {
              return ownName;
            },
            set: function(name) {
              ownName = name;
              render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
            }
          });
          return elementType;
        };
        exports.isValidElement = isValidElement5;
        exports.lazy = function(ctor) {
          ctor = { _status: -1, _result: ctor };
          var lazyType = {
            $$typeof: REACT_LAZY_TYPE2,
            _payload: ctor,
            _init: lazyInitializer
          }, ioInfo = {
            name: "lazy",
            start: -1,
            end: -1,
            value: null,
            owner: null,
            debugStack: Error("react-stack-top-frame"),
            debugTask: console.createTask ? console.createTask("lazy()") : null
          };
          ctor._ioInfo = ioInfo;
          lazyType._debugInfo = [{ awaited: ioInfo }];
          return lazyType;
        };
        exports.memo = function(type, compare) {
          null == type && console.error(
            "memo: The first argument must be a component. Instead received: %s",
            null === type ? "null" : typeof type
          );
          compare = {
            $$typeof: REACT_MEMO_TYPE,
            type,
            compare: void 0 === compare ? null : compare
          };
          var ownName;
          Object.defineProperty(compare, "displayName", {
            enumerable: false,
            configurable: true,
            get: function() {
              return ownName;
            },
            set: function(name) {
              ownName = name;
              type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
            }
          });
          return compare;
        };
        exports.startTransition = function(scope) {
          var prevTransition = ReactSharedInternals.T, currentTransition = {};
          currentTransition._updatedFibers = /* @__PURE__ */ new Set();
          ReactSharedInternals.T = currentTransition;
          try {
            var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
            null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
            "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop4, reportGlobalError));
          } catch (error) {
            reportGlobalError(error);
          } finally {
            null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
              "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
            )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
              "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
            ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
          }
        };
        exports.unstable_useCacheRefresh = function() {
          return resolveDispatcher().useCacheRefresh();
        };
        exports.use = function(usable) {
          return resolveDispatcher().use(usable);
        };
        exports.useActionState = function(action, initialState, permalink) {
          return resolveDispatcher().useActionState(
            action,
            initialState,
            permalink
          );
        };
        exports.useCallback = function(callback, deps) {
          return resolveDispatcher().useCallback(callback, deps);
        };
        exports.useContext = function(Context) {
          var dispatcher = resolveDispatcher();
          Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
            "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
          );
          return dispatcher.useContext(Context);
        };
        exports.useDebugValue = function(value, formatterFn) {
          return resolveDispatcher().useDebugValue(value, formatterFn);
        };
        exports.useDeferredValue = function(value, initialValue) {
          return resolveDispatcher().useDeferredValue(value, initialValue);
        };
        exports.useEffect = function(create2, deps) {
          null == create2 && console.warn(
            "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useEffect(create2, deps);
        };
        exports.useEffectEvent = function(callback) {
          return resolveDispatcher().useEffectEvent(callback);
        };
        exports.useId = function() {
          return resolveDispatcher().useId();
        };
        exports.useImperativeHandle = function(ref, create2, deps) {
          return resolveDispatcher().useImperativeHandle(ref, create2, deps);
        };
        exports.useInsertionEffect = function(create2, deps) {
          null == create2 && console.warn(
            "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useInsertionEffect(create2, deps);
        };
        exports.useLayoutEffect = function(create2, deps) {
          null == create2 && console.warn(
            "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useLayoutEffect(create2, deps);
        };
        exports.useMemo = function(create2, deps) {
          return resolveDispatcher().useMemo(create2, deps);
        };
        exports.useOptimistic = function(passthrough, reducer) {
          return resolveDispatcher().useOptimistic(passthrough, reducer);
        };
        exports.useReducer = function(reducer, initialArg, init) {
          return resolveDispatcher().useReducer(reducer, initialArg, init);
        };
        exports.useRef = function(initialValue) {
          return resolveDispatcher().useRef(initialValue);
        };
        exports.useState = function(initialState) {
          return resolveDispatcher().useState(initialState);
        };
        exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
          return resolveDispatcher().useSyncExternalStore(
            subscribe,
            getSnapshot,
            getServerSnapshot
          );
        };
        exports.useTransition = function() {
          return resolveDispatcher().useTransition();
        };
        exports.version = "19.2.0";
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
      })();
    }
  });

  // node_modules/react/index.js
  var require_react = __commonJS({
    "node_modules/react/index.js"(exports, module) {
      "use strict";
      if (false) {
        module.exports = null;
      } else {
        module.exports = require_react_development();
      }
    }
  });

  // node_modules/next/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs
  var require_interop_require_wildcard = __commonJS({
    "node_modules/next/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs"(exports) {
      "use strict";
      function _getRequireWildcardCache(nodeInterop) {
        if (typeof WeakMap !== "function") return null;
        var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
        var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
        return (_getRequireWildcardCache = function(nodeInterop2) {
          return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
        })(nodeInterop);
      }
      function _interop_require_wildcard(obj, nodeInterop) {
        if (!nodeInterop && obj && obj.__esModule) return obj;
        if (obj === null || typeof obj !== "object" && typeof obj !== "function") return { default: obj };
        var cache = _getRequireWildcardCache(nodeInterop);
        if (cache && cache.has(obj)) return cache.get(obj);
        var newObj = { __proto__: null };
        var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
            else newObj[key] = obj[key];
          }
        }
        newObj.default = obj;
        if (cache) cache.set(obj, newObj);
        return newObj;
      }
      exports._ = _interop_require_wildcard;
    }
  });

  // node_modules/next/node_modules/@swc/helpers/cjs/_interop_require_default.cjs
  var require_interop_require_default = __commonJS({
    "node_modules/next/node_modules/@swc/helpers/cjs/_interop_require_default.cjs"(exports) {
      "use strict";
      function _interop_require_default(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      exports._ = _interop_require_default;
    }
  });

  // node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js
  var require_app_router_context_shared_runtime = __commonJS({
    "node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js"(exports) {
      "use client";
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        AppRouterContext: function() {
          return AppRouterContext;
        },
        GlobalLayoutRouterContext: function() {
          return GlobalLayoutRouterContext;
        },
        LayoutRouterContext: function() {
          return LayoutRouterContext;
        },
        MissingSlotContext: function() {
          return MissingSlotContext;
        },
        TemplateContext: function() {
          return TemplateContext;
        }
      });
      var _interop_require_default = require_interop_require_default();
      var _react = /* @__PURE__ */ _interop_require_default._(require_react());
      var AppRouterContext = _react.default.createContext(null);
      var LayoutRouterContext = _react.default.createContext(null);
      var GlobalLayoutRouterContext = _react.default.createContext(null);
      var TemplateContext = _react.default.createContext(null);
      if (true) {
        AppRouterContext.displayName = "AppRouterContext";
        LayoutRouterContext.displayName = "LayoutRouterContext";
        GlobalLayoutRouterContext.displayName = "GlobalLayoutRouterContext";
        TemplateContext.displayName = "TemplateContext";
      }
      var MissingSlotContext = _react.default.createContext(/* @__PURE__ */ new Set());
    }
  });

  // node_modules/next/dist/client/components/readonly-url-search-params.js
  var require_readonly_url_search_params = __commonJS({
    "node_modules/next/dist/client/components/readonly-url-search-params.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "ReadonlyURLSearchParams", {
        enumerable: true,
        get: function() {
          return ReadonlyURLSearchParams;
        }
      });
      var ReadonlyURLSearchParamsError = class extends Error {
        constructor() {
          super("Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams");
        }
      };
      var ReadonlyURLSearchParams = class extends URLSearchParams {
        /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */
        append() {
          throw new ReadonlyURLSearchParamsError();
        }
        /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */
        delete() {
          throw new ReadonlyURLSearchParamsError();
        }
        /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */
        set() {
          throw new ReadonlyURLSearchParamsError();
        }
        /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */
        sort() {
          throw new ReadonlyURLSearchParamsError();
        }
      };
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/shared/lib/hooks-client-context.shared-runtime.js
  var require_hooks_client_context_shared_runtime = __commonJS({
    "node_modules/next/dist/shared/lib/hooks-client-context.shared-runtime.js"(exports) {
      "use client";
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        NavigationPromisesContext: function() {
          return NavigationPromisesContext;
        },
        PathParamsContext: function() {
          return PathParamsContext;
        },
        PathnameContext: function() {
          return PathnameContext;
        },
        ReadonlyURLSearchParams: function() {
          return _readonlyurlsearchparams.ReadonlyURLSearchParams;
        },
        SearchParamsContext: function() {
          return SearchParamsContext;
        },
        createDevToolsInstrumentedPromise: function() {
          return createDevToolsInstrumentedPromise;
        }
      });
      var _react = require_react();
      var _readonlyurlsearchparams = require_readonly_url_search_params();
      var SearchParamsContext = (0, _react.createContext)(null);
      var PathnameContext = (0, _react.createContext)(null);
      var PathParamsContext = (0, _react.createContext)(null);
      var NavigationPromisesContext = (0, _react.createContext)(null);
      function createDevToolsInstrumentedPromise(displayName, value) {
        const promise = Promise.resolve(value);
        promise.status = "fulfilled";
        promise.value = value;
        promise.displayName = `${displayName} (SSR)`;
        return promise;
      }
      if (true) {
        SearchParamsContext.displayName = "SearchParamsContext";
        PathnameContext.displayName = "PathnameContext";
        PathParamsContext.displayName = "PathParamsContext";
        NavigationPromisesContext.displayName = "NavigationPromisesContext";
      }
    }
  });

  // node_modules/next/dist/shared/lib/segment.js
  var require_segment = __commonJS({
    "node_modules/next/dist/shared/lib/segment.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        DEFAULT_SEGMENT_KEY: function() {
          return DEFAULT_SEGMENT_KEY;
        },
        NOT_FOUND_SEGMENT_KEY: function() {
          return NOT_FOUND_SEGMENT_KEY;
        },
        PAGE_SEGMENT_KEY: function() {
          return PAGE_SEGMENT_KEY;
        },
        addSearchParamsIfPageSegment: function() {
          return addSearchParamsIfPageSegment;
        },
        computeSelectedLayoutSegment: function() {
          return computeSelectedLayoutSegment;
        },
        getSegmentValue: function() {
          return getSegmentValue;
        },
        getSelectedLayoutSegmentPath: function() {
          return getSelectedLayoutSegmentPath;
        },
        isGroupSegment: function() {
          return isGroupSegment;
        },
        isParallelRouteSegment: function() {
          return isParallelRouteSegment;
        }
      });
      function getSegmentValue(segment) {
        return Array.isArray(segment) ? segment[1] : segment;
      }
      function isGroupSegment(segment) {
        return segment[0] === "(" && segment.endsWith(")");
      }
      function isParallelRouteSegment(segment) {
        return segment.startsWith("@") && segment !== "@children";
      }
      function addSearchParamsIfPageSegment(segment, searchParams) {
        const isPageSegment = segment.includes(PAGE_SEGMENT_KEY);
        if (isPageSegment) {
          const stringifiedQuery = JSON.stringify(searchParams);
          return stringifiedQuery !== "{}" ? PAGE_SEGMENT_KEY + "?" + stringifiedQuery : PAGE_SEGMENT_KEY;
        }
        return segment;
      }
      function computeSelectedLayoutSegment(segments, parallelRouteKey) {
        if (!segments || segments.length === 0) {
          return null;
        }
        const rawSegment = parallelRouteKey === "children" ? segments[0] : segments[segments.length - 1];
        return rawSegment === DEFAULT_SEGMENT_KEY ? null : rawSegment;
      }
      function getSelectedLayoutSegmentPath(tree, parallelRouteKey, first = true, segmentPath = []) {
        let node;
        if (first) {
          node = tree[1][parallelRouteKey];
        } else {
          const parallelRoutes = tree[1];
          node = parallelRoutes.children ?? Object.values(parallelRoutes)[0];
        }
        if (!node) return segmentPath;
        const segment = node[0];
        let segmentValue = getSegmentValue(segment);
        if (!segmentValue || segmentValue.startsWith(PAGE_SEGMENT_KEY)) {
          return segmentPath;
        }
        segmentPath.push(segmentValue);
        return getSelectedLayoutSegmentPath(node, parallelRouteKey, false, segmentPath);
      }
      var PAGE_SEGMENT_KEY = "__PAGE__";
      var DEFAULT_SEGMENT_KEY = "__DEFAULT__";
      var NOT_FOUND_SEGMENT_KEY = "/_not-found";
    }
  });

  // node_modules/next/dist/shared/lib/server-inserted-html.shared-runtime.js
  var require_server_inserted_html_shared_runtime = __commonJS({
    "node_modules/next/dist/shared/lib/server-inserted-html.shared-runtime.js"(exports) {
      "use client";
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        ServerInsertedHTMLContext: function() {
          return ServerInsertedHTMLContext;
        },
        useServerInsertedHTML: function() {
          return useServerInsertedHTML;
        }
      });
      var _interop_require_wildcard = require_interop_require_wildcard();
      var _react = /* @__PURE__ */ _interop_require_wildcard._(require_react());
      var ServerInsertedHTMLContext = /* @__PURE__ */ _react.default.createContext(null);
      function useServerInsertedHTML(callback) {
        const addInsertedServerHTMLCallback = (0, _react.useContext)(ServerInsertedHTMLContext);
        if (addInsertedServerHTMLCallback) {
          addInsertedServerHTMLCallback(callback);
        }
      }
    }
  });

  // node_modules/next/dist/client/components/unrecognized-action-error.js
  var require_unrecognized_action_error = __commonJS({
    "node_modules/next/dist/client/components/unrecognized-action-error.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        UnrecognizedActionError: function() {
          return UnrecognizedActionError;
        },
        unstable_isUnrecognizedActionError: function() {
          return unstable_isUnrecognizedActionError;
        }
      });
      var UnrecognizedActionError = class extends Error {
        constructor(...args) {
          super(...args);
          this.name = "UnrecognizedActionError";
        }
      };
      function unstable_isUnrecognizedActionError(error) {
        return !!(error && typeof error === "object" && error instanceof UnrecognizedActionError);
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/client/components/redirect-status-code.js
  var require_redirect_status_code = __commonJS({
    "node_modules/next/dist/client/components/redirect-status-code.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "RedirectStatusCode", {
        enumerable: true,
        get: function() {
          return RedirectStatusCode;
        }
      });
      var RedirectStatusCode = /* @__PURE__ */ (function(RedirectStatusCode2) {
        RedirectStatusCode2[RedirectStatusCode2["SeeOther"] = 303] = "SeeOther";
        RedirectStatusCode2[RedirectStatusCode2["TemporaryRedirect"] = 307] = "TemporaryRedirect";
        RedirectStatusCode2[RedirectStatusCode2["PermanentRedirect"] = 308] = "PermanentRedirect";
        return RedirectStatusCode2;
      })({});
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/client/components/redirect-error.js
  var require_redirect_error = __commonJS({
    "node_modules/next/dist/client/components/redirect-error.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        REDIRECT_ERROR_CODE: function() {
          return REDIRECT_ERROR_CODE;
        },
        RedirectType: function() {
          return RedirectType;
        },
        isRedirectError: function() {
          return isRedirectError;
        }
      });
      var _redirectstatuscode = require_redirect_status_code();
      var REDIRECT_ERROR_CODE = "NEXT_REDIRECT";
      var RedirectType = /* @__PURE__ */ (function(RedirectType2) {
        RedirectType2["push"] = "push";
        RedirectType2["replace"] = "replace";
        return RedirectType2;
      })({});
      function isRedirectError(error) {
        if (typeof error !== "object" || error === null || !("digest" in error) || typeof error.digest !== "string") {
          return false;
        }
        const digest = error.digest.split(";");
        const [errorCode, type] = digest;
        const destination = digest.slice(2, -2).join(";");
        const status = digest.at(-2);
        const statusCode = Number(status);
        return errorCode === REDIRECT_ERROR_CODE && (type === "replace" || type === "push") && typeof destination === "string" && !isNaN(statusCode) && statusCode in _redirectstatuscode.RedirectStatusCode;
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/server/app-render/async-local-storage.js
  var require_async_local_storage = __commonJS({
    "node_modules/next/dist/server/app-render/async-local-storage.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        bindSnapshot: function() {
          return bindSnapshot;
        },
        createAsyncLocalStorage: function() {
          return createAsyncLocalStorage;
        },
        createSnapshot: function() {
          return createSnapshot;
        }
      });
      var sharedAsyncLocalStorageNotAvailableError = Object.defineProperty(new Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", {
        value: "E504",
        enumerable: false,
        configurable: true
      });
      var FakeAsyncLocalStorage = class {
        disable() {
          throw sharedAsyncLocalStorageNotAvailableError;
        }
        getStore() {
          return void 0;
        }
        run() {
          throw sharedAsyncLocalStorageNotAvailableError;
        }
        exit() {
          throw sharedAsyncLocalStorageNotAvailableError;
        }
        enterWith() {
          throw sharedAsyncLocalStorageNotAvailableError;
        }
        static bind(fn) {
          return fn;
        }
      };
      var maybeGlobalAsyncLocalStorage = typeof globalThis !== "undefined" && globalThis.AsyncLocalStorage;
      function createAsyncLocalStorage() {
        if (maybeGlobalAsyncLocalStorage) {
          return new maybeGlobalAsyncLocalStorage();
        }
        return new FakeAsyncLocalStorage();
      }
      function bindSnapshot(fn) {
        if (maybeGlobalAsyncLocalStorage) {
          return maybeGlobalAsyncLocalStorage.bind(fn);
        }
        return FakeAsyncLocalStorage.bind(fn);
      }
      function createSnapshot() {
        if (maybeGlobalAsyncLocalStorage) {
          return maybeGlobalAsyncLocalStorage.snapshot();
        }
        return function(fn, ...args) {
          return fn(...args);
        };
      }
    }
  });

  // node_modules/next/dist/server/app-render/action-async-storage-instance.js
  var require_action_async_storage_instance = __commonJS({
    "node_modules/next/dist/server/app-render/action-async-storage-instance.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "actionAsyncStorageInstance", {
        enumerable: true,
        get: function() {
          return actionAsyncStorageInstance;
        }
      });
      var _asynclocalstorage = require_async_local_storage();
      var actionAsyncStorageInstance = (0, _asynclocalstorage.createAsyncLocalStorage)();
    }
  });

  // node_modules/next/dist/server/app-render/action-async-storage.external.js
  var require_action_async_storage_external = __commonJS({
    "node_modules/next/dist/server/app-render/action-async-storage.external.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "actionAsyncStorage", {
        enumerable: true,
        get: function() {
          return _actionasyncstorageinstance.actionAsyncStorageInstance;
        }
      });
      var _actionasyncstorageinstance = require_action_async_storage_instance();
    }
  });

  // node_modules/next/dist/client/components/redirect.js
  var require_redirect = __commonJS({
    "node_modules/next/dist/client/components/redirect.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        getRedirectError: function() {
          return getRedirectError;
        },
        getRedirectStatusCodeFromError: function() {
          return getRedirectStatusCodeFromError;
        },
        getRedirectTypeFromError: function() {
          return getRedirectTypeFromError;
        },
        getURLFromRedirectError: function() {
          return getURLFromRedirectError;
        },
        permanentRedirect: function() {
          return permanentRedirect;
        },
        redirect: function() {
          return redirect;
        }
      });
      var _redirectstatuscode = require_redirect_status_code();
      var _redirecterror = require_redirect_error();
      var actionAsyncStorage = typeof window === "undefined" ? require_action_async_storage_external().actionAsyncStorage : void 0;
      function getRedirectError(url, type, statusCode = _redirectstatuscode.RedirectStatusCode.TemporaryRedirect) {
        const error = Object.defineProperty(new Error(_redirecterror.REDIRECT_ERROR_CODE), "__NEXT_ERROR_CODE", {
          value: "E394",
          enumerable: false,
          configurable: true
        });
        error.digest = `${_redirecterror.REDIRECT_ERROR_CODE};${type};${url};${statusCode};`;
        return error;
      }
      function redirect(url, type) {
        type ??= actionAsyncStorage?.getStore()?.isAction ? _redirecterror.RedirectType.push : _redirecterror.RedirectType.replace;
        throw getRedirectError(url, type, _redirectstatuscode.RedirectStatusCode.TemporaryRedirect);
      }
      function permanentRedirect(url, type = _redirecterror.RedirectType.replace) {
        throw getRedirectError(url, type, _redirectstatuscode.RedirectStatusCode.PermanentRedirect);
      }
      function getURLFromRedirectError(error) {
        if (!(0, _redirecterror.isRedirectError)(error)) return null;
        return error.digest.split(";").slice(2, -2).join(";");
      }
      function getRedirectTypeFromError(error) {
        if (!(0, _redirecterror.isRedirectError)(error)) {
          throw Object.defineProperty(new Error("Not a redirect error"), "__NEXT_ERROR_CODE", {
            value: "E260",
            enumerable: false,
            configurable: true
          });
        }
        return error.digest.split(";", 2)[1];
      }
      function getRedirectStatusCodeFromError(error) {
        if (!(0, _redirecterror.isRedirectError)(error)) {
          throw Object.defineProperty(new Error("Not a redirect error"), "__NEXT_ERROR_CODE", {
            value: "E260",
            enumerable: false,
            configurable: true
          });
        }
        return Number(error.digest.split(";").at(-2));
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js
  var require_http_access_fallback = __commonJS({
    "node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        HTTPAccessErrorStatus: function() {
          return HTTPAccessErrorStatus;
        },
        HTTP_ERROR_FALLBACK_ERROR_CODE: function() {
          return HTTP_ERROR_FALLBACK_ERROR_CODE;
        },
        getAccessFallbackErrorTypeByStatus: function() {
          return getAccessFallbackErrorTypeByStatus;
        },
        getAccessFallbackHTTPStatus: function() {
          return getAccessFallbackHTTPStatus;
        },
        isHTTPAccessFallbackError: function() {
          return isHTTPAccessFallbackError;
        }
      });
      var HTTPAccessErrorStatus = {
        NOT_FOUND: 404,
        FORBIDDEN: 403,
        UNAUTHORIZED: 401
      };
      var ALLOWED_CODES = new Set(Object.values(HTTPAccessErrorStatus));
      var HTTP_ERROR_FALLBACK_ERROR_CODE = "NEXT_HTTP_ERROR_FALLBACK";
      function isHTTPAccessFallbackError(error) {
        if (typeof error !== "object" || error === null || !("digest" in error) || typeof error.digest !== "string") {
          return false;
        }
        const [prefix, httpStatus] = error.digest.split(";");
        return prefix === HTTP_ERROR_FALLBACK_ERROR_CODE && ALLOWED_CODES.has(Number(httpStatus));
      }
      function getAccessFallbackHTTPStatus(error) {
        const httpStatus = error.digest.split(";")[1];
        return Number(httpStatus);
      }
      function getAccessFallbackErrorTypeByStatus(status) {
        switch (status) {
          case 401:
            return "unauthorized";
          case 403:
            return "forbidden";
          case 404:
            return "not-found";
          default:
            return;
        }
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/client/components/not-found.js
  var require_not_found = __commonJS({
    "node_modules/next/dist/client/components/not-found.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "notFound", {
        enumerable: true,
        get: function() {
          return notFound;
        }
      });
      var _httpaccessfallback = require_http_access_fallback();
      var DIGEST = `${_httpaccessfallback.HTTP_ERROR_FALLBACK_ERROR_CODE};404`;
      function notFound() {
        const error = Object.defineProperty(new Error(DIGEST), "__NEXT_ERROR_CODE", {
          value: "E394",
          enumerable: false,
          configurable: true
        });
        error.digest = DIGEST;
        throw error;
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/client/components/forbidden.js
  var require_forbidden = __commonJS({
    "node_modules/next/dist/client/components/forbidden.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "forbidden", {
        enumerable: true,
        get: function() {
          return forbidden;
        }
      });
      var _httpaccessfallback = require_http_access_fallback();
      var DIGEST = `${_httpaccessfallback.HTTP_ERROR_FALLBACK_ERROR_CODE};403`;
      function forbidden() {
        if (!process.env.__NEXT_EXPERIMENTAL_AUTH_INTERRUPTS) {
          throw Object.defineProperty(new Error(`\`forbidden()\` is experimental and only allowed to be enabled when \`experimental.authInterrupts\` is enabled.`), "__NEXT_ERROR_CODE", {
            value: "E488",
            enumerable: false,
            configurable: true
          });
        }
        const error = Object.defineProperty(new Error(DIGEST), "__NEXT_ERROR_CODE", {
          value: "E394",
          enumerable: false,
          configurable: true
        });
        error.digest = DIGEST;
        throw error;
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/client/components/unauthorized.js
  var require_unauthorized = __commonJS({
    "node_modules/next/dist/client/components/unauthorized.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "unauthorized", {
        enumerable: true,
        get: function() {
          return unauthorized;
        }
      });
      var _httpaccessfallback = require_http_access_fallback();
      var DIGEST = `${_httpaccessfallback.HTTP_ERROR_FALLBACK_ERROR_CODE};401`;
      function unauthorized() {
        if (!process.env.__NEXT_EXPERIMENTAL_AUTH_INTERRUPTS) {
          throw Object.defineProperty(new Error(`\`unauthorized()\` is experimental and only allowed to be used when \`experimental.authInterrupts\` is enabled.`), "__NEXT_ERROR_CODE", {
            value: "E411",
            enumerable: false,
            configurable: true
          });
        }
        const error = Object.defineProperty(new Error(DIGEST), "__NEXT_ERROR_CODE", {
          value: "E394",
          enumerable: false,
          configurable: true
        });
        error.digest = DIGEST;
        throw error;
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/server/dynamic-rendering-utils.js
  var require_dynamic_rendering_utils = __commonJS({
    "node_modules/next/dist/server/dynamic-rendering-utils.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        isHangingPromiseRejectionError: function() {
          return isHangingPromiseRejectionError;
        },
        makeDevtoolsIOAwarePromise: function() {
          return makeDevtoolsIOAwarePromise;
        },
        makeHangingPromise: function() {
          return makeHangingPromise;
        }
      });
      function isHangingPromiseRejectionError(err) {
        if (typeof err !== "object" || err === null || !("digest" in err)) {
          return false;
        }
        return err.digest === HANGING_PROMISE_REJECTION;
      }
      var HANGING_PROMISE_REJECTION = "HANGING_PROMISE_REJECTION";
      var HangingPromiseRejectionError = class extends Error {
        constructor(route, expression) {
          super(`During prerendering, ${expression} rejects when the prerender is complete. Typically these errors are handled by React but if you move ${expression} to a different context by using \`setTimeout\`, \`after\`, or similar functions you may observe this error and you should handle it in that context. This occurred at route "${route}".`), this.route = route, this.expression = expression, this.digest = HANGING_PROMISE_REJECTION;
        }
      };
      var abortListenersBySignal = /* @__PURE__ */ new WeakMap();
      function makeHangingPromise(signal, route, expression) {
        if (signal.aborted) {
          return Promise.reject(new HangingPromiseRejectionError(route, expression));
        } else {
          const hangingPromise = new Promise((_, reject) => {
            const boundRejection = reject.bind(null, new HangingPromiseRejectionError(route, expression));
            let currentListeners = abortListenersBySignal.get(signal);
            if (currentListeners) {
              currentListeners.push(boundRejection);
            } else {
              const listeners = [
                boundRejection
              ];
              abortListenersBySignal.set(signal, listeners);
              signal.addEventListener("abort", () => {
                for (let i = 0; i < listeners.length; i++) {
                  listeners[i]();
                }
              }, {
                once: true
              });
            }
          });
          hangingPromise.catch(ignoreReject);
          return hangingPromise;
        }
      }
      function ignoreReject() {
      }
      function makeDevtoolsIOAwarePromise(underlying, requestStore, stage) {
        if (requestStore.stagedRendering) {
          return requestStore.stagedRendering.delayUntilStage(stage, void 0, underlying);
        }
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(underlying);
          }, 0);
        });
      }
    }
  });

  // node_modules/next/dist/server/lib/router-utils/is-postpone.js
  var require_is_postpone = __commonJS({
    "node_modules/next/dist/server/lib/router-utils/is-postpone.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "isPostpone", {
        enumerable: true,
        get: function() {
          return isPostpone;
        }
      });
      var REACT_POSTPONE_TYPE = /* @__PURE__ */ Symbol.for("react.postpone");
      function isPostpone(error) {
        return typeof error === "object" && error !== null && error.$$typeof === REACT_POSTPONE_TYPE;
      }
    }
  });

  // node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js
  var require_bailout_to_csr = __commonJS({
    "node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        BailoutToCSRError: function() {
          return BailoutToCSRError;
        },
        isBailoutToCSRError: function() {
          return isBailoutToCSRError;
        }
      });
      var BAILOUT_TO_CSR = "BAILOUT_TO_CLIENT_SIDE_RENDERING";
      var BailoutToCSRError = class extends Error {
        constructor(reason) {
          super(`Bail out to client-side rendering: ${reason}`), this.reason = reason, this.digest = BAILOUT_TO_CSR;
        }
      };
      function isBailoutToCSRError(err) {
        if (typeof err !== "object" || err === null || !("digest" in err)) {
          return false;
        }
        return err.digest === BAILOUT_TO_CSR;
      }
    }
  });

  // node_modules/next/dist/client/components/is-next-router-error.js
  var require_is_next_router_error = __commonJS({
    "node_modules/next/dist/client/components/is-next-router-error.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "isNextRouterError", {
        enumerable: true,
        get: function() {
          return isNextRouterError;
        }
      });
      var _httpaccessfallback = require_http_access_fallback();
      var _redirecterror = require_redirect_error();
      function isNextRouterError(error) {
        return (0, _redirecterror.isRedirectError)(error) || (0, _httpaccessfallback.isHTTPAccessFallbackError)(error);
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/client/components/hooks-server-context.js
  var require_hooks_server_context = __commonJS({
    "node_modules/next/dist/client/components/hooks-server-context.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        DynamicServerError: function() {
          return DynamicServerError;
        },
        isDynamicServerError: function() {
          return isDynamicServerError;
        }
      });
      var DYNAMIC_ERROR_CODE = "DYNAMIC_SERVER_USAGE";
      var DynamicServerError = class extends Error {
        constructor(description) {
          super(`Dynamic server usage: ${description}`), this.description = description, this.digest = DYNAMIC_ERROR_CODE;
        }
      };
      function isDynamicServerError(err) {
        if (typeof err !== "object" || err === null || !("digest" in err) || typeof err.digest !== "string") {
          return false;
        }
        return err.digest === DYNAMIC_ERROR_CODE;
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/client/components/static-generation-bailout.js
  var require_static_generation_bailout = __commonJS({
    "node_modules/next/dist/client/components/static-generation-bailout.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        StaticGenBailoutError: function() {
          return StaticGenBailoutError;
        },
        isStaticGenBailoutError: function() {
          return isStaticGenBailoutError;
        }
      });
      var NEXT_STATIC_GEN_BAILOUT = "NEXT_STATIC_GEN_BAILOUT";
      var StaticGenBailoutError = class extends Error {
        constructor(...args) {
          super(...args), this.code = NEXT_STATIC_GEN_BAILOUT;
        }
      };
      function isStaticGenBailoutError(error) {
        if (typeof error !== "object" || error === null || !("code" in error)) {
          return false;
        }
        return error.code === NEXT_STATIC_GEN_BAILOUT;
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/server/app-render/work-unit-async-storage-instance.js
  var require_work_unit_async_storage_instance = __commonJS({
    "node_modules/next/dist/server/app-render/work-unit-async-storage-instance.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "workUnitAsyncStorageInstance", {
        enumerable: true,
        get: function() {
          return workUnitAsyncStorageInstance;
        }
      });
      var _asynclocalstorage = require_async_local_storage();
      var workUnitAsyncStorageInstance = (0, _asynclocalstorage.createAsyncLocalStorage)();
    }
  });

  // node_modules/next/dist/client/components/app-router-headers.js
  var require_app_router_headers = __commonJS({
    "node_modules/next/dist/client/components/app-router-headers.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        ACTION_HEADER: function() {
          return ACTION_HEADER;
        },
        FLIGHT_HEADERS: function() {
          return FLIGHT_HEADERS;
        },
        NEXT_ACTION_NOT_FOUND_HEADER: function() {
          return NEXT_ACTION_NOT_FOUND_HEADER;
        },
        NEXT_ACTION_REVALIDATED_HEADER: function() {
          return NEXT_ACTION_REVALIDATED_HEADER;
        },
        NEXT_DID_POSTPONE_HEADER: function() {
          return NEXT_DID_POSTPONE_HEADER;
        },
        NEXT_HMR_REFRESH_HASH_COOKIE: function() {
          return NEXT_HMR_REFRESH_HASH_COOKIE;
        },
        NEXT_HMR_REFRESH_HEADER: function() {
          return NEXT_HMR_REFRESH_HEADER;
        },
        NEXT_HTML_REQUEST_ID_HEADER: function() {
          return NEXT_HTML_REQUEST_ID_HEADER;
        },
        NEXT_IS_PRERENDER_HEADER: function() {
          return NEXT_IS_PRERENDER_HEADER;
        },
        NEXT_REQUEST_ID_HEADER: function() {
          return NEXT_REQUEST_ID_HEADER;
        },
        NEXT_REWRITTEN_PATH_HEADER: function() {
          return NEXT_REWRITTEN_PATH_HEADER;
        },
        NEXT_REWRITTEN_QUERY_HEADER: function() {
          return NEXT_REWRITTEN_QUERY_HEADER;
        },
        NEXT_ROUTER_PREFETCH_HEADER: function() {
          return NEXT_ROUTER_PREFETCH_HEADER;
        },
        NEXT_ROUTER_SEGMENT_PREFETCH_HEADER: function() {
          return NEXT_ROUTER_SEGMENT_PREFETCH_HEADER;
        },
        NEXT_ROUTER_STALE_TIME_HEADER: function() {
          return NEXT_ROUTER_STALE_TIME_HEADER;
        },
        NEXT_ROUTER_STATE_TREE_HEADER: function() {
          return NEXT_ROUTER_STATE_TREE_HEADER;
        },
        NEXT_RSC_UNION_QUERY: function() {
          return NEXT_RSC_UNION_QUERY;
        },
        NEXT_URL: function() {
          return NEXT_URL;
        },
        RSC_CONTENT_TYPE_HEADER: function() {
          return RSC_CONTENT_TYPE_HEADER;
        },
        RSC_HEADER: function() {
          return RSC_HEADER;
        }
      });
      var RSC_HEADER = "rsc";
      var ACTION_HEADER = "next-action";
      var NEXT_ROUTER_STATE_TREE_HEADER = "next-router-state-tree";
      var NEXT_ROUTER_PREFETCH_HEADER = "next-router-prefetch";
      var NEXT_ROUTER_SEGMENT_PREFETCH_HEADER = "next-router-segment-prefetch";
      var NEXT_HMR_REFRESH_HEADER = "next-hmr-refresh";
      var NEXT_HMR_REFRESH_HASH_COOKIE = "__next_hmr_refresh_hash__";
      var NEXT_URL = "next-url";
      var RSC_CONTENT_TYPE_HEADER = "text/x-component";
      var FLIGHT_HEADERS = [
        RSC_HEADER,
        NEXT_ROUTER_STATE_TREE_HEADER,
        NEXT_ROUTER_PREFETCH_HEADER,
        NEXT_HMR_REFRESH_HEADER,
        NEXT_ROUTER_SEGMENT_PREFETCH_HEADER
      ];
      var NEXT_RSC_UNION_QUERY = "_rsc";
      var NEXT_ROUTER_STALE_TIME_HEADER = "x-nextjs-stale-time";
      var NEXT_DID_POSTPONE_HEADER = "x-nextjs-postponed";
      var NEXT_REWRITTEN_PATH_HEADER = "x-nextjs-rewritten-path";
      var NEXT_REWRITTEN_QUERY_HEADER = "x-nextjs-rewritten-query";
      var NEXT_IS_PRERENDER_HEADER = "x-nextjs-prerender";
      var NEXT_ACTION_NOT_FOUND_HEADER = "x-nextjs-action-not-found";
      var NEXT_REQUEST_ID_HEADER = "x-nextjs-request-id";
      var NEXT_HTML_REQUEST_ID_HEADER = "x-nextjs-html-request-id";
      var NEXT_ACTION_REVALIDATED_HEADER = "x-action-revalidated";
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/shared/lib/invariant-error.js
  var require_invariant_error = __commonJS({
    "node_modules/next/dist/shared/lib/invariant-error.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "InvariantError", {
        enumerable: true,
        get: function() {
          return InvariantError;
        }
      });
      var InvariantError = class extends Error {
        constructor(message, options) {
          super(`Invariant: ${message.endsWith(".") ? message : message + "."} This is a bug in Next.js.`, options);
          this.name = "InvariantError";
        }
      };
    }
  });

  // node_modules/next/dist/server/app-render/work-unit-async-storage.external.js
  var require_work_unit_async_storage_external = __commonJS({
    "node_modules/next/dist/server/app-render/work-unit-async-storage.external.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        getCacheSignal: function() {
          return getCacheSignal;
        },
        getDraftModeProviderForCacheScope: function() {
          return getDraftModeProviderForCacheScope;
        },
        getHmrRefreshHash: function() {
          return getHmrRefreshHash;
        },
        getPrerenderResumeDataCache: function() {
          return getPrerenderResumeDataCache;
        },
        getRenderResumeDataCache: function() {
          return getRenderResumeDataCache;
        },
        getRuntimeStagePromise: function() {
          return getRuntimeStagePromise;
        },
        getServerComponentsHmrCache: function() {
          return getServerComponentsHmrCache;
        },
        isHmrRefresh: function() {
          return isHmrRefresh;
        },
        throwForMissingRequestStore: function() {
          return throwForMissingRequestStore;
        },
        throwInvariantForMissingStore: function() {
          return throwInvariantForMissingStore;
        },
        workUnitAsyncStorage: function() {
          return _workunitasyncstorageinstance.workUnitAsyncStorageInstance;
        }
      });
      var _workunitasyncstorageinstance = require_work_unit_async_storage_instance();
      var _approuterheaders = require_app_router_headers();
      var _invarianterror = require_invariant_error();
      function throwForMissingRequestStore(callingExpression) {
        throw Object.defineProperty(new Error(`\`${callingExpression}\` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`), "__NEXT_ERROR_CODE", {
          value: "E251",
          enumerable: false,
          configurable: true
        });
      }
      function throwInvariantForMissingStore() {
        throw Object.defineProperty(new _invarianterror.InvariantError("Expected workUnitAsyncStorage to have a store."), "__NEXT_ERROR_CODE", {
          value: "E696",
          enumerable: false,
          configurable: true
        });
      }
      function getPrerenderResumeDataCache(workUnitStore) {
        switch (workUnitStore.type) {
          case "prerender":
          case "prerender-runtime":
          case "prerender-ppr":
            return workUnitStore.prerenderResumeDataCache;
          case "prerender-client":
            return workUnitStore.prerenderResumeDataCache;
          case "request": {
            if (workUnitStore.prerenderResumeDataCache) {
              return workUnitStore.prerenderResumeDataCache;
            }
          }
          case "prerender-legacy":
          case "cache":
          case "private-cache":
          case "unstable-cache":
            return null;
          default:
            return workUnitStore;
        }
      }
      function getRenderResumeDataCache(workUnitStore) {
        switch (workUnitStore.type) {
          case "request":
          case "prerender":
          case "prerender-runtime":
          case "prerender-client":
            if (workUnitStore.renderResumeDataCache) {
              return workUnitStore.renderResumeDataCache;
            }
          // fallthrough
          case "prerender-ppr":
            return workUnitStore.prerenderResumeDataCache ?? null;
          case "cache":
          case "private-cache":
          case "unstable-cache":
          case "prerender-legacy":
            return null;
          default:
            return workUnitStore;
        }
      }
      function getHmrRefreshHash(workStore, workUnitStore) {
        if (workStore.dev) {
          switch (workUnitStore.type) {
            case "cache":
            case "private-cache":
            case "prerender":
            case "prerender-runtime":
              return workUnitStore.hmrRefreshHash;
            case "request":
              var _workUnitStore_cookies_get;
              return (_workUnitStore_cookies_get = workUnitStore.cookies.get(_approuterheaders.NEXT_HMR_REFRESH_HASH_COOKIE)) == null ? void 0 : _workUnitStore_cookies_get.value;
            case "prerender-client":
            case "prerender-ppr":
            case "prerender-legacy":
            case "unstable-cache":
              break;
            default:
              workUnitStore;
          }
        }
        return void 0;
      }
      function isHmrRefresh(workStore, workUnitStore) {
        if (workStore.dev) {
          switch (workUnitStore.type) {
            case "cache":
            case "private-cache":
            case "request":
              return workUnitStore.isHmrRefresh ?? false;
            case "prerender":
            case "prerender-client":
            case "prerender-runtime":
            case "prerender-ppr":
            case "prerender-legacy":
            case "unstable-cache":
              break;
            default:
              workUnitStore;
          }
        }
        return false;
      }
      function getServerComponentsHmrCache(workStore, workUnitStore) {
        if (workStore.dev) {
          switch (workUnitStore.type) {
            case "cache":
            case "private-cache":
            case "request":
              return workUnitStore.serverComponentsHmrCache;
            case "prerender":
            case "prerender-client":
            case "prerender-runtime":
            case "prerender-ppr":
            case "prerender-legacy":
            case "unstable-cache":
              break;
            default:
              workUnitStore;
          }
        }
        return void 0;
      }
      function getDraftModeProviderForCacheScope(workStore, workUnitStore) {
        if (workStore.isDraftMode) {
          switch (workUnitStore.type) {
            case "cache":
            case "private-cache":
            case "unstable-cache":
            case "prerender-runtime":
            case "request":
              return workUnitStore.draftMode;
            case "prerender":
            case "prerender-client":
            case "prerender-ppr":
            case "prerender-legacy":
              break;
            default:
              workUnitStore;
          }
        }
        return void 0;
      }
      function getCacheSignal(workUnitStore) {
        switch (workUnitStore.type) {
          case "prerender":
          case "prerender-client":
          case "prerender-runtime":
            return workUnitStore.cacheSignal;
          case "request": {
            if (workUnitStore.cacheSignal) {
              return workUnitStore.cacheSignal;
            }
          }
          case "prerender-ppr":
          case "prerender-legacy":
          case "cache":
          case "private-cache":
          case "unstable-cache":
            return null;
          default:
            return workUnitStore;
        }
      }
      function getRuntimeStagePromise(workUnitStore) {
        switch (workUnitStore.type) {
          case "prerender-runtime":
          case "private-cache":
            return workUnitStore.runtimeStagePromise;
          case "prerender":
          case "prerender-client":
          case "prerender-ppr":
          case "prerender-legacy":
          case "request":
          case "cache":
          case "unstable-cache":
            return null;
          default:
            return workUnitStore;
        }
      }
    }
  });

  // node_modules/next/dist/server/app-render/work-async-storage-instance.js
  var require_work_async_storage_instance = __commonJS({
    "node_modules/next/dist/server/app-render/work-async-storage-instance.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "workAsyncStorageInstance", {
        enumerable: true,
        get: function() {
          return workAsyncStorageInstance;
        }
      });
      var _asynclocalstorage = require_async_local_storage();
      var workAsyncStorageInstance = (0, _asynclocalstorage.createAsyncLocalStorage)();
    }
  });

  // node_modules/next/dist/server/app-render/work-async-storage.external.js
  var require_work_async_storage_external = __commonJS({
    "node_modules/next/dist/server/app-render/work-async-storage.external.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "workAsyncStorage", {
        enumerable: true,
        get: function() {
          return _workasyncstorageinstance.workAsyncStorageInstance;
        }
      });
      var _workasyncstorageinstance = require_work_async_storage_instance();
    }
  });

  // node_modules/next/dist/lib/framework/boundary-constants.js
  var require_boundary_constants = __commonJS({
    "node_modules/next/dist/lib/framework/boundary-constants.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        METADATA_BOUNDARY_NAME: function() {
          return METADATA_BOUNDARY_NAME;
        },
        OUTLET_BOUNDARY_NAME: function() {
          return OUTLET_BOUNDARY_NAME;
        },
        ROOT_LAYOUT_BOUNDARY_NAME: function() {
          return ROOT_LAYOUT_BOUNDARY_NAME;
        },
        VIEWPORT_BOUNDARY_NAME: function() {
          return VIEWPORT_BOUNDARY_NAME;
        }
      });
      var METADATA_BOUNDARY_NAME = "__next_metadata_boundary__";
      var VIEWPORT_BOUNDARY_NAME = "__next_viewport_boundary__";
      var OUTLET_BOUNDARY_NAME = "__next_outlet_boundary__";
      var ROOT_LAYOUT_BOUNDARY_NAME = "__next_root_layout_boundary__";
    }
  });

  // node_modules/next/dist/lib/scheduler.js
  var require_scheduler = __commonJS({
    "node_modules/next/dist/lib/scheduler.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        atLeastOneTask: function() {
          return atLeastOneTask;
        },
        scheduleImmediate: function() {
          return scheduleImmediate;
        },
        scheduleOnNextTick: function() {
          return scheduleOnNextTick;
        },
        waitAtLeastOneReactRenderTask: function() {
          return waitAtLeastOneReactRenderTask;
        }
      });
      var scheduleOnNextTick = (cb) => {
        Promise.resolve().then(() => {
          if (process.env.NEXT_RUNTIME === "edge") {
            setTimeout(cb, 0);
          } else {
            process.nextTick(cb);
          }
        });
      };
      var scheduleImmediate = (cb) => {
        if (process.env.NEXT_RUNTIME === "edge") {
          setTimeout(cb, 0);
        } else {
          setImmediate(cb);
        }
      };
      function atLeastOneTask() {
        return new Promise((resolve) => scheduleImmediate(resolve));
      }
      function waitAtLeastOneReactRenderTask() {
        if (process.env.NEXT_RUNTIME === "edge") {
          return new Promise((r2) => setTimeout(r2, 0));
        } else {
          return new Promise((r2) => setImmediate(r2));
        }
      }
    }
  });

  // node_modules/next/dist/server/app-render/dynamic-rendering.js
  var require_dynamic_rendering = __commonJS({
    "node_modules/next/dist/server/app-render/dynamic-rendering.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        Postpone: function() {
          return Postpone;
        },
        PreludeState: function() {
          return PreludeState;
        },
        abortAndThrowOnSynchronousRequestDataAccess: function() {
          return abortAndThrowOnSynchronousRequestDataAccess;
        },
        abortOnSynchronousPlatformIOAccess: function() {
          return abortOnSynchronousPlatformIOAccess;
        },
        accessedDynamicData: function() {
          return accessedDynamicData;
        },
        annotateDynamicAccess: function() {
          return annotateDynamicAccess;
        },
        consumeDynamicAccess: function() {
          return consumeDynamicAccess;
        },
        createDynamicTrackingState: function() {
          return createDynamicTrackingState;
        },
        createDynamicValidationState: function() {
          return createDynamicValidationState;
        },
        createHangingInputAbortSignal: function() {
          return createHangingInputAbortSignal;
        },
        createRenderInBrowserAbortSignal: function() {
          return createRenderInBrowserAbortSignal;
        },
        delayUntilRuntimeStage: function() {
          return delayUntilRuntimeStage;
        },
        formatDynamicAPIAccesses: function() {
          return formatDynamicAPIAccesses;
        },
        getFirstDynamicReason: function() {
          return getFirstDynamicReason;
        },
        getStaticShellDisallowedDynamicReasons: function() {
          return getStaticShellDisallowedDynamicReasons;
        },
        isDynamicPostpone: function() {
          return isDynamicPostpone;
        },
        isPrerenderInterruptedError: function() {
          return isPrerenderInterruptedError;
        },
        logDisallowedDynamicError: function() {
          return logDisallowedDynamicError;
        },
        markCurrentScopeAsDynamic: function() {
          return markCurrentScopeAsDynamic;
        },
        postponeWithTracking: function() {
          return postponeWithTracking;
        },
        throwIfDisallowedDynamic: function() {
          return throwIfDisallowedDynamic;
        },
        throwToInterruptStaticGeneration: function() {
          return throwToInterruptStaticGeneration;
        },
        trackAllowedDynamicAccess: function() {
          return trackAllowedDynamicAccess;
        },
        trackDynamicDataInDynamicRender: function() {
          return trackDynamicDataInDynamicRender;
        },
        trackDynamicHoleInRuntimeShell: function() {
          return trackDynamicHoleInRuntimeShell;
        },
        trackDynamicHoleInStaticShell: function() {
          return trackDynamicHoleInStaticShell;
        },
        useDynamicRouteParams: function() {
          return useDynamicRouteParams;
        },
        useDynamicSearchParams: function() {
          return useDynamicSearchParams;
        }
      });
      var _react = /* @__PURE__ */ _interop_require_default(require_react());
      var _hooksservercontext = require_hooks_server_context();
      var _staticgenerationbailout = require_static_generation_bailout();
      var _workunitasyncstorageexternal = require_work_unit_async_storage_external();
      var _workasyncstorageexternal = require_work_async_storage_external();
      var _dynamicrenderingutils = require_dynamic_rendering_utils();
      var _boundaryconstants = require_boundary_constants();
      var _scheduler = require_scheduler();
      var _bailouttocsr = require_bailout_to_csr();
      var _invarianterror = require_invariant_error();
      function _interop_require_default(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }
      var hasPostpone = typeof _react.default.unstable_postpone === "function";
      function createDynamicTrackingState(isDebugDynamicAccesses) {
        return {
          isDebugDynamicAccesses,
          dynamicAccesses: [],
          syncDynamicErrorWithStack: null
        };
      }
      function createDynamicValidationState() {
        return {
          hasSuspenseAboveBody: false,
          hasDynamicMetadata: false,
          dynamicMetadata: null,
          hasDynamicViewport: false,
          hasAllowedDynamic: false,
          dynamicErrors: []
        };
      }
      function getFirstDynamicReason(trackingState) {
        var _trackingState_dynamicAccesses_;
        return (_trackingState_dynamicAccesses_ = trackingState.dynamicAccesses[0]) == null ? void 0 : _trackingState_dynamicAccesses_.expression;
      }
      function markCurrentScopeAsDynamic(store, workUnitStore, expression) {
        if (workUnitStore) {
          switch (workUnitStore.type) {
            case "cache":
            case "unstable-cache":
              return;
            case "private-cache":
              return;
            case "prerender-legacy":
            case "prerender-ppr":
            case "request":
              break;
            default:
              workUnitStore;
          }
        }
        if (store.forceDynamic || store.forceStatic) return;
        if (store.dynamicShouldError) {
          throw Object.defineProperty(new _staticgenerationbailout.StaticGenBailoutError(`Route ${store.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", {
            value: "E553",
            enumerable: false,
            configurable: true
          });
        }
        if (workUnitStore) {
          switch (workUnitStore.type) {
            case "prerender-ppr":
              return postponeWithTracking(store.route, expression, workUnitStore.dynamicTracking);
            case "prerender-legacy":
              workUnitStore.revalidate = 0;
              const err = Object.defineProperty(new _hooksservercontext.DynamicServerError(`Route ${store.route} couldn't be rendered statically because it used ${expression}. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", {
                value: "E550",
                enumerable: false,
                configurable: true
              });
              store.dynamicUsageDescription = expression;
              store.dynamicUsageStack = err.stack;
              throw err;
            case "request":
              if (true) {
                workUnitStore.usedDynamic = true;
              }
              break;
            default:
              workUnitStore;
          }
        }
      }
      function throwToInterruptStaticGeneration(expression, store, prerenderStore) {
        const err = Object.defineProperty(new _hooksservercontext.DynamicServerError(`Route ${store.route} couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", {
          value: "E558",
          enumerable: false,
          configurable: true
        });
        prerenderStore.revalidate = 0;
        store.dynamicUsageDescription = expression;
        store.dynamicUsageStack = err.stack;
        throw err;
      }
      function trackDynamicDataInDynamicRender(workUnitStore) {
        switch (workUnitStore.type) {
          case "cache":
          case "unstable-cache":
            return;
          case "private-cache":
            return;
          case "prerender":
          case "prerender-runtime":
          case "prerender-legacy":
          case "prerender-ppr":
          case "prerender-client":
            break;
          case "request":
            if (true) {
              workUnitStore.usedDynamic = true;
            }
            break;
          default:
            workUnitStore;
        }
      }
      function abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore) {
        const reason = `Route ${route} needs to bail out of prerendering at this point because it used ${expression}.`;
        const error = createPrerenderInterruptedError(reason);
        prerenderStore.controller.abort(error);
        const dynamicTracking = prerenderStore.dynamicTracking;
        if (dynamicTracking) {
          dynamicTracking.dynamicAccesses.push({
            // When we aren't debugging, we don't need to create another error for the
            // stack trace.
            stack: dynamicTracking.isDebugDynamicAccesses ? new Error().stack : void 0,
            expression
          });
        }
      }
      function abortOnSynchronousPlatformIOAccess(route, expression, errorWithStack, prerenderStore) {
        const dynamicTracking = prerenderStore.dynamicTracking;
        abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore);
        if (dynamicTracking) {
          if (dynamicTracking.syncDynamicErrorWithStack === null) {
            dynamicTracking.syncDynamicErrorWithStack = errorWithStack;
          }
        }
      }
      function abortAndThrowOnSynchronousRequestDataAccess(route, expression, errorWithStack, prerenderStore) {
        const prerenderSignal = prerenderStore.controller.signal;
        if (prerenderSignal.aborted === false) {
          abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore);
          const dynamicTracking = prerenderStore.dynamicTracking;
          if (dynamicTracking) {
            if (dynamicTracking.syncDynamicErrorWithStack === null) {
              dynamicTracking.syncDynamicErrorWithStack = errorWithStack;
            }
          }
        }
        throw createPrerenderInterruptedError(`Route ${route} needs to bail out of prerendering at this point because it used ${expression}.`);
      }
      function Postpone({ reason, route }) {
        const prerenderStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
        const dynamicTracking = prerenderStore && prerenderStore.type === "prerender-ppr" ? prerenderStore.dynamicTracking : null;
        postponeWithTracking(route, reason, dynamicTracking);
      }
      function postponeWithTracking(route, expression, dynamicTracking) {
        assertPostpone();
        if (dynamicTracking) {
          dynamicTracking.dynamicAccesses.push({
            // When we aren't debugging, we don't need to create another error for the
            // stack trace.
            stack: dynamicTracking.isDebugDynamicAccesses ? new Error().stack : void 0,
            expression
          });
        }
        _react.default.unstable_postpone(createPostponeReason(route, expression));
      }
      function createPostponeReason(route, expression) {
        return `Route ${route} needs to bail out of prerendering at this point because it used ${expression}. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error`;
      }
      function isDynamicPostpone(err) {
        if (typeof err === "object" && err !== null && typeof err.message === "string") {
          return isDynamicPostponeReason(err.message);
        }
        return false;
      }
      function isDynamicPostponeReason(reason) {
        return reason.includes("needs to bail out of prerendering at this point because it used") && reason.includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error");
      }
      if (isDynamicPostponeReason(createPostponeReason("%%%", "^^^")) === false) {
        throw Object.defineProperty(new Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", {
          value: "E296",
          enumerable: false,
          configurable: true
        });
      }
      var NEXT_PRERENDER_INTERRUPTED = "NEXT_PRERENDER_INTERRUPTED";
      function createPrerenderInterruptedError(message) {
        const error = Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
          value: "E394",
          enumerable: false,
          configurable: true
        });
        error.digest = NEXT_PRERENDER_INTERRUPTED;
        return error;
      }
      function isPrerenderInterruptedError(error) {
        return typeof error === "object" && error !== null && error.digest === NEXT_PRERENDER_INTERRUPTED && "name" in error && "message" in error && error instanceof Error;
      }
      function accessedDynamicData(dynamicAccesses) {
        return dynamicAccesses.length > 0;
      }
      function consumeDynamicAccess(serverDynamic, clientDynamic) {
        serverDynamic.dynamicAccesses.push(...clientDynamic.dynamicAccesses);
        return serverDynamic.dynamicAccesses;
      }
      function formatDynamicAPIAccesses(dynamicAccesses) {
        return dynamicAccesses.filter((access) => typeof access.stack === "string" && access.stack.length > 0).map(({ expression, stack }) => {
          stack = stack.split("\n").slice(4).filter((line) => {
            if (line.includes("node_modules/next/")) {
              return false;
            }
            if (line.includes(" (<anonymous>)")) {
              return false;
            }
            if (line.includes(" (node:")) {
              return false;
            }
            return true;
          }).join("\n");
          return `Dynamic API Usage Debug - ${expression}:
${stack}`;
        });
      }
      function assertPostpone() {
        if (!hasPostpone) {
          throw Object.defineProperty(new Error(`Invariant: React.unstable_postpone is not defined. This suggests the wrong version of React was loaded. This is a bug in Next.js`), "__NEXT_ERROR_CODE", {
            value: "E224",
            enumerable: false,
            configurable: true
          });
        }
      }
      function createRenderInBrowserAbortSignal() {
        const controller = new AbortController();
        controller.abort(Object.defineProperty(new _bailouttocsr.BailoutToCSRError("Render in Browser"), "__NEXT_ERROR_CODE", {
          value: "E721",
          enumerable: false,
          configurable: true
        }));
        return controller.signal;
      }
      function createHangingInputAbortSignal(workUnitStore) {
        switch (workUnitStore.type) {
          case "prerender":
          case "prerender-runtime":
            const controller = new AbortController();
            if (workUnitStore.cacheSignal) {
              workUnitStore.cacheSignal.inputReady().then(() => {
                controller.abort();
              });
            } else {
              const runtimeStagePromise = (0, _workunitasyncstorageexternal.getRuntimeStagePromise)(workUnitStore);
              if (runtimeStagePromise) {
                runtimeStagePromise.then(() => (0, _scheduler.scheduleOnNextTick)(() => controller.abort()));
              } else {
                (0, _scheduler.scheduleOnNextTick)(() => controller.abort());
              }
            }
            return controller.signal;
          case "prerender-client":
          case "prerender-ppr":
          case "prerender-legacy":
          case "request":
          case "cache":
          case "private-cache":
          case "unstable-cache":
            return void 0;
          default:
            workUnitStore;
        }
      }
      function annotateDynamicAccess(expression, prerenderStore) {
        const dynamicTracking = prerenderStore.dynamicTracking;
        if (dynamicTracking) {
          dynamicTracking.dynamicAccesses.push({
            stack: dynamicTracking.isDebugDynamicAccesses ? new Error().stack : void 0,
            expression
          });
        }
      }
      function useDynamicRouteParams(expression) {
        const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
        const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
        if (workStore && workUnitStore) {
          switch (workUnitStore.type) {
            case "prerender-client":
            case "prerender": {
              const fallbackParams = workUnitStore.fallbackRouteParams;
              if (fallbackParams && fallbackParams.size > 0) {
                _react.default.use((0, _dynamicrenderingutils.makeHangingPromise)(workUnitStore.renderSignal, workStore.route, expression));
              }
              break;
            }
            case "prerender-ppr": {
              const fallbackParams = workUnitStore.fallbackRouteParams;
              if (fallbackParams && fallbackParams.size > 0) {
                return postponeWithTracking(workStore.route, expression, workUnitStore.dynamicTracking);
              }
              break;
            }
            case "prerender-runtime":
              throw Object.defineProperty(new _invarianterror.InvariantError(`\`${expression}\` was called during a runtime prerender. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                value: "E771",
                enumerable: false,
                configurable: true
              });
            case "cache":
            case "private-cache":
              throw Object.defineProperty(new _invarianterror.InvariantError(`\`${expression}\` was called inside a cache scope. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                value: "E745",
                enumerable: false,
                configurable: true
              });
            case "prerender-legacy":
            case "request":
            case "unstable-cache":
              break;
            default:
              workUnitStore;
          }
        }
      }
      function useDynamicSearchParams(expression) {
        const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
        const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
        if (!workStore) {
          return;
        }
        if (!workUnitStore) {
          (0, _workunitasyncstorageexternal.throwForMissingRequestStore)(expression);
        }
        switch (workUnitStore.type) {
          case "prerender-client": {
            _react.default.use((0, _dynamicrenderingutils.makeHangingPromise)(workUnitStore.renderSignal, workStore.route, expression));
            break;
          }
          case "prerender-legacy":
          case "prerender-ppr": {
            if (workStore.forceStatic) {
              return;
            }
            throw Object.defineProperty(new _bailouttocsr.BailoutToCSRError(expression), "__NEXT_ERROR_CODE", {
              value: "E394",
              enumerable: false,
              configurable: true
            });
          }
          case "prerender":
          case "prerender-runtime":
            throw Object.defineProperty(new _invarianterror.InvariantError(`\`${expression}\` was called from a Server Component. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
              value: "E795",
              enumerable: false,
              configurable: true
            });
          case "cache":
          case "unstable-cache":
          case "private-cache":
            throw Object.defineProperty(new _invarianterror.InvariantError(`\`${expression}\` was called inside a cache scope. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
              value: "E745",
              enumerable: false,
              configurable: true
            });
          case "request":
            return;
          default:
            workUnitStore;
        }
      }
      var hasSuspenseRegex = /\n\s+at Suspense \(<anonymous>\)/;
      var bodyAndImplicitTags = "body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6";
      var hasSuspenseBeforeRootLayoutWithoutBodyOrImplicitBodyRegex = new RegExp(`\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:${bodyAndImplicitTags}) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at ${_boundaryconstants.ROOT_LAYOUT_BOUNDARY_NAME} \\([^\\n]*\\)`);
      var hasMetadataRegex = new RegExp(`\\n\\s+at ${_boundaryconstants.METADATA_BOUNDARY_NAME}[\\n\\s]`);
      var hasViewportRegex = new RegExp(`\\n\\s+at ${_boundaryconstants.VIEWPORT_BOUNDARY_NAME}[\\n\\s]`);
      var hasOutletRegex = new RegExp(`\\n\\s+at ${_boundaryconstants.OUTLET_BOUNDARY_NAME}[\\n\\s]`);
      function trackAllowedDynamicAccess(workStore, componentStack, dynamicValidation, clientDynamic) {
        if (hasOutletRegex.test(componentStack)) {
          return;
        } else if (hasMetadataRegex.test(componentStack)) {
          dynamicValidation.hasDynamicMetadata = true;
          return;
        } else if (hasViewportRegex.test(componentStack)) {
          dynamicValidation.hasDynamicViewport = true;
          return;
        } else if (hasSuspenseBeforeRootLayoutWithoutBodyOrImplicitBodyRegex.test(componentStack)) {
          dynamicValidation.hasAllowedDynamic = true;
          dynamicValidation.hasSuspenseAboveBody = true;
          return;
        } else if (hasSuspenseRegex.test(componentStack)) {
          dynamicValidation.hasAllowedDynamic = true;
          return;
        } else if (clientDynamic.syncDynamicErrorWithStack) {
          dynamicValidation.dynamicErrors.push(clientDynamic.syncDynamicErrorWithStack);
          return;
        } else {
          const message = `Route "${workStore.route}": Uncached data was accessed outside of <Suspense>. This delays the entire page from rendering, resulting in a slow user experience. Learn more: https://nextjs.org/docs/messages/blocking-route`;
          const error = createErrorWithComponentOrOwnerStack(message, componentStack);
          dynamicValidation.dynamicErrors.push(error);
          return;
        }
      }
      function trackDynamicHoleInRuntimeShell(workStore, componentStack, dynamicValidation, clientDynamic) {
        if (hasOutletRegex.test(componentStack)) {
          return;
        } else if (hasMetadataRegex.test(componentStack)) {
          const message = `Route "${workStore.route}": Uncached data or \`connection()\` was accessed inside \`generateMetadata\`. Except for this instance, the page would have been entirely prerenderable which may have been the intended behavior. See more info here: https://nextjs.org/docs/messages/next-prerender-dynamic-metadata`;
          const error = createErrorWithComponentOrOwnerStack(message, componentStack);
          dynamicValidation.dynamicMetadata = error;
          return;
        } else if (hasViewportRegex.test(componentStack)) {
          const message = `Route "${workStore.route}": Uncached data or \`connection()\` was accessed inside \`generateViewport\`. This delays the entire page from rendering, resulting in a slow user experience. Learn more: https://nextjs.org/docs/messages/next-prerender-dynamic-viewport`;
          const error = createErrorWithComponentOrOwnerStack(message, componentStack);
          dynamicValidation.dynamicErrors.push(error);
          return;
        } else if (hasSuspenseBeforeRootLayoutWithoutBodyOrImplicitBodyRegex.test(componentStack)) {
          dynamicValidation.hasAllowedDynamic = true;
          dynamicValidation.hasSuspenseAboveBody = true;
          return;
        } else if (hasSuspenseRegex.test(componentStack)) {
          dynamicValidation.hasAllowedDynamic = true;
          return;
        } else if (clientDynamic.syncDynamicErrorWithStack) {
          dynamicValidation.dynamicErrors.push(clientDynamic.syncDynamicErrorWithStack);
          return;
        } else {
          const message = `Route "${workStore.route}": Uncached data or \`connection()\` was accessed outside of \`<Suspense>\`. This delays the entire page from rendering, resulting in a slow user experience. Learn more: https://nextjs.org/docs/messages/blocking-route`;
          const error = createErrorWithComponentOrOwnerStack(message, componentStack);
          dynamicValidation.dynamicErrors.push(error);
          return;
        }
      }
      function trackDynamicHoleInStaticShell(workStore, componentStack, dynamicValidation, clientDynamic) {
        if (hasOutletRegex.test(componentStack)) {
          return;
        } else if (hasMetadataRegex.test(componentStack)) {
          const message = `Route "${workStore.route}": Runtime data such as \`cookies()\`, \`headers()\`, \`params\`, or \`searchParams\` was accessed inside \`generateMetadata\` or you have file-based metadata such as icons that depend on dynamic params segments. Except for this instance, the page would have been entirely prerenderable which may have been the intended behavior. See more info here: https://nextjs.org/docs/messages/next-prerender-dynamic-metadata`;
          const error = createErrorWithComponentOrOwnerStack(message, componentStack);
          dynamicValidation.dynamicMetadata = error;
          return;
        } else if (hasViewportRegex.test(componentStack)) {
          const message = `Route "${workStore.route}": Runtime data such as \`cookies()\`, \`headers()\`, \`params\`, or \`searchParams\` was accessed inside \`generateViewport\`. This delays the entire page from rendering, resulting in a slow user experience. Learn more: https://nextjs.org/docs/messages/next-prerender-dynamic-viewport`;
          const error = createErrorWithComponentOrOwnerStack(message, componentStack);
          dynamicValidation.dynamicErrors.push(error);
          return;
        } else if (hasSuspenseBeforeRootLayoutWithoutBodyOrImplicitBodyRegex.test(componentStack)) {
          dynamicValidation.hasAllowedDynamic = true;
          dynamicValidation.hasSuspenseAboveBody = true;
          return;
        } else if (hasSuspenseRegex.test(componentStack)) {
          dynamicValidation.hasAllowedDynamic = true;
          return;
        } else if (clientDynamic.syncDynamicErrorWithStack) {
          dynamicValidation.dynamicErrors.push(clientDynamic.syncDynamicErrorWithStack);
          return;
        } else {
          const message = `Route "${workStore.route}": Runtime data such as \`cookies()\`, \`headers()\`, \`params\`, or \`searchParams\` was accessed outside of \`<Suspense>\`. This delays the entire page from rendering, resulting in a slow user experience. Learn more: https://nextjs.org/docs/messages/blocking-route`;
          const error = createErrorWithComponentOrOwnerStack(message, componentStack);
          dynamicValidation.dynamicErrors.push(error);
          return;
        }
      }
      function createErrorWithComponentOrOwnerStack(message, componentStack) {
        const ownerStack = _react.default.captureOwnerStack ? _react.default.captureOwnerStack() : null;
        const error = Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
          value: "E394",
          enumerable: false,
          configurable: true
        });
        error.stack = error.name + ": " + message + (ownerStack || componentStack);
        return error;
      }
      var PreludeState = /* @__PURE__ */ (function(PreludeState2) {
        PreludeState2[PreludeState2["Full"] = 0] = "Full";
        PreludeState2[PreludeState2["Empty"] = 1] = "Empty";
        PreludeState2[PreludeState2["Errored"] = 2] = "Errored";
        return PreludeState2;
      })({});
      function logDisallowedDynamicError(workStore, error) {
        console.error(error);
        if (!workStore.dev) {
          if (workStore.hasReadableErrorStacks) {
            console.error(`To get a more detailed stack trace and pinpoint the issue, start the app in development mode by running \`next dev\`, then open "${workStore.route}" in your browser to investigate the error.`);
          } else {
            console.error(`To get a more detailed stack trace and pinpoint the issue, try one of the following:
  - Start the app in development mode by running \`next dev\`, then open "${workStore.route}" in your browser to investigate the error.
  - Rerun the production build with \`next build --debug-prerender\` to generate better stack traces.`);
          }
        }
      }
      function throwIfDisallowedDynamic(workStore, prelude, dynamicValidation, serverDynamic) {
        if (serverDynamic.syncDynamicErrorWithStack) {
          logDisallowedDynamicError(workStore, serverDynamic.syncDynamicErrorWithStack);
          throw new _staticgenerationbailout.StaticGenBailoutError();
        }
        if (prelude !== 0) {
          if (dynamicValidation.hasSuspenseAboveBody) {
            return;
          }
          const dynamicErrors = dynamicValidation.dynamicErrors;
          if (dynamicErrors.length > 0) {
            for (let i = 0; i < dynamicErrors.length; i++) {
              logDisallowedDynamicError(workStore, dynamicErrors[i]);
            }
            throw new _staticgenerationbailout.StaticGenBailoutError();
          }
          if (dynamicValidation.hasDynamicViewport) {
            console.error(`Route "${workStore.route}" has a \`generateViewport\` that depends on Request data (\`cookies()\`, etc...) or uncached external data (\`fetch(...)\`, etc...) without explicitly allowing fully dynamic rendering. See more info here: https://nextjs.org/docs/messages/next-prerender-dynamic-viewport`);
            throw new _staticgenerationbailout.StaticGenBailoutError();
          }
          if (prelude === 1) {
            console.error(`Route "${workStore.route}" did not produce a static shell and Next.js was unable to determine a reason. This is a bug in Next.js.`);
            throw new _staticgenerationbailout.StaticGenBailoutError();
          }
        } else {
          if (dynamicValidation.hasAllowedDynamic === false && dynamicValidation.hasDynamicMetadata) {
            console.error(`Route "${workStore.route}" has a \`generateMetadata\` that depends on Request data (\`cookies()\`, etc...) or uncached external data (\`fetch(...)\`, etc...) when the rest of the route does not. See more info here: https://nextjs.org/docs/messages/next-prerender-dynamic-metadata`);
            throw new _staticgenerationbailout.StaticGenBailoutError();
          }
        }
      }
      function getStaticShellDisallowedDynamicReasons(workStore, prelude, dynamicValidation) {
        if (dynamicValidation.hasSuspenseAboveBody) {
          return [];
        }
        if (prelude !== 0) {
          const dynamicErrors = dynamicValidation.dynamicErrors;
          if (dynamicErrors.length > 0) {
            return dynamicErrors;
          }
          if (prelude === 1) {
            return [
              Object.defineProperty(new _invarianterror.InvariantError(`Route "${workStore.route}" did not produce a static shell and Next.js was unable to determine a reason.`), "__NEXT_ERROR_CODE", {
                value: "E936",
                enumerable: false,
                configurable: true
              })
            ];
          }
        } else {
          if (dynamicValidation.hasAllowedDynamic === false && dynamicValidation.dynamicErrors.length === 0 && dynamicValidation.dynamicMetadata) {
            return [
              dynamicValidation.dynamicMetadata
            ];
          }
        }
        return [];
      }
      function delayUntilRuntimeStage(prerenderStore, result) {
        if (prerenderStore.runtimeStagePromise) {
          return prerenderStore.runtimeStagePromise.then(() => result);
        }
        return result;
      }
    }
  });

  // node_modules/next/dist/client/components/unstable-rethrow.server.js
  var require_unstable_rethrow_server = __commonJS({
    "node_modules/next/dist/client/components/unstable-rethrow.server.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "unstable_rethrow", {
        enumerable: true,
        get: function() {
          return unstable_rethrow;
        }
      });
      var _dynamicrenderingutils = require_dynamic_rendering_utils();
      var _ispostpone = require_is_postpone();
      var _bailouttocsr = require_bailout_to_csr();
      var _isnextroutererror = require_is_next_router_error();
      var _dynamicrendering = require_dynamic_rendering();
      var _hooksservercontext = require_hooks_server_context();
      function unstable_rethrow(error) {
        if ((0, _isnextroutererror.isNextRouterError)(error) || (0, _bailouttocsr.isBailoutToCSRError)(error) || (0, _hooksservercontext.isDynamicServerError)(error) || (0, _dynamicrendering.isDynamicPostpone)(error) || (0, _ispostpone.isPostpone)(error) || (0, _dynamicrenderingutils.isHangingPromiseRejectionError)(error) || (0, _dynamicrendering.isPrerenderInterruptedError)(error)) {
          throw error;
        }
        if (error instanceof Error && "cause" in error) {
          unstable_rethrow(error.cause);
        }
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/client/components/unstable-rethrow.browser.js
  var require_unstable_rethrow_browser = __commonJS({
    "node_modules/next/dist/client/components/unstable-rethrow.browser.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "unstable_rethrow", {
        enumerable: true,
        get: function() {
          return unstable_rethrow;
        }
      });
      var _bailouttocsr = require_bailout_to_csr();
      var _isnextroutererror = require_is_next_router_error();
      function unstable_rethrow(error) {
        if ((0, _isnextroutererror.isNextRouterError)(error) || (0, _bailouttocsr.isBailoutToCSRError)(error)) {
          throw error;
        }
        if (error instanceof Error && "cause" in error) {
          unstable_rethrow(error.cause);
        }
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/client/components/unstable-rethrow.js
  var require_unstable_rethrow = __commonJS({
    "node_modules/next/dist/client/components/unstable-rethrow.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "unstable_rethrow", {
        enumerable: true,
        get: function() {
          return unstable_rethrow;
        }
      });
      var unstable_rethrow = typeof window === "undefined" ? require_unstable_rethrow_server().unstable_rethrow : require_unstable_rethrow_browser().unstable_rethrow;
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/client/components/navigation.react-server.js
  var require_navigation_react_server = __commonJS({
    "node_modules/next/dist/client/components/navigation.react-server.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        ReadonlyURLSearchParams: function() {
          return _readonlyurlsearchparams.ReadonlyURLSearchParams;
        },
        RedirectType: function() {
          return _redirecterror.RedirectType;
        },
        forbidden: function() {
          return _forbidden.forbidden;
        },
        notFound: function() {
          return _notfound.notFound;
        },
        permanentRedirect: function() {
          return _redirect.permanentRedirect;
        },
        redirect: function() {
          return _redirect.redirect;
        },
        unauthorized: function() {
          return _unauthorized.unauthorized;
        },
        unstable_isUnrecognizedActionError: function() {
          return unstable_isUnrecognizedActionError;
        },
        unstable_rethrow: function() {
          return _unstablerethrow.unstable_rethrow;
        }
      });
      var _readonlyurlsearchparams = require_readonly_url_search_params();
      var _redirect = require_redirect();
      var _redirecterror = require_redirect_error();
      var _notfound = require_not_found();
      var _forbidden = require_forbidden();
      var _unauthorized = require_unauthorized();
      var _unstablerethrow = require_unstable_rethrow();
      function unstable_isUnrecognizedActionError() {
        throw Object.defineProperty(new Error("`unstable_isUnrecognizedActionError` can only be used on the client."), "__NEXT_ERROR_CODE", {
          value: "E776",
          enumerable: false,
          configurable: true
        });
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/client/components/navigation.js
  var require_navigation = __commonJS({
    "node_modules/next/dist/client/components/navigation.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        // We need the same class that was used to instantiate the context value
        // Otherwise instanceof checks will fail in usercode
        ReadonlyURLSearchParams: function() {
          return _hooksclientcontextsharedruntime.ReadonlyURLSearchParams;
        },
        RedirectType: function() {
          return _navigationreactserver.RedirectType;
        },
        ServerInsertedHTMLContext: function() {
          return _serverinsertedhtmlsharedruntime.ServerInsertedHTMLContext;
        },
        forbidden: function() {
          return _navigationreactserver.forbidden;
        },
        notFound: function() {
          return _navigationreactserver.notFound;
        },
        permanentRedirect: function() {
          return _navigationreactserver.permanentRedirect;
        },
        redirect: function() {
          return _navigationreactserver.redirect;
        },
        unauthorized: function() {
          return _navigationreactserver.unauthorized;
        },
        unstable_isUnrecognizedActionError: function() {
          return _unrecognizedactionerror.unstable_isUnrecognizedActionError;
        },
        unstable_rethrow: function() {
          return _navigationreactserver.unstable_rethrow;
        },
        useParams: function() {
          return useParams;
        },
        usePathname: function() {
          return usePathname2;
        },
        useRouter: function() {
          return useRouter;
        },
        useSearchParams: function() {
          return useSearchParams;
        },
        useSelectedLayoutSegment: function() {
          return useSelectedLayoutSegment;
        },
        useSelectedLayoutSegments: function() {
          return useSelectedLayoutSegments;
        },
        useServerInsertedHTML: function() {
          return _serverinsertedhtmlsharedruntime.useServerInsertedHTML;
        }
      });
      var _interop_require_wildcard = require_interop_require_wildcard();
      var _react = /* @__PURE__ */ _interop_require_wildcard._(require_react());
      var _approutercontextsharedruntime = require_app_router_context_shared_runtime();
      var _hooksclientcontextsharedruntime = require_hooks_client_context_shared_runtime();
      var _segment = require_segment();
      var _serverinsertedhtmlsharedruntime = require_server_inserted_html_shared_runtime();
      var _unrecognizedactionerror = require_unrecognized_action_error();
      var _navigationreactserver = require_navigation_react_server();
      var useDynamicRouteParams = typeof window === "undefined" ? require_dynamic_rendering().useDynamicRouteParams : void 0;
      var useDynamicSearchParams = typeof window === "undefined" ? require_dynamic_rendering().useDynamicSearchParams : void 0;
      function useSearchParams() {
        useDynamicSearchParams?.("useSearchParams()");
        const searchParams = (0, _react.useContext)(_hooksclientcontextsharedruntime.SearchParamsContext);
        const readonlySearchParams = (0, _react.useMemo)(() => {
          if (!searchParams) {
            return null;
          }
          return new _hooksclientcontextsharedruntime.ReadonlyURLSearchParams(searchParams);
        }, [
          searchParams
        ]);
        if ("use" in _react.default) {
          const navigationPromises = (0, _react.use)(_hooksclientcontextsharedruntime.NavigationPromisesContext);
          if (navigationPromises) {
            return (0, _react.use)(navigationPromises.searchParams);
          }
        }
        return readonlySearchParams;
      }
      function usePathname2() {
        useDynamicRouteParams?.("usePathname()");
        const pathname = (0, _react.useContext)(_hooksclientcontextsharedruntime.PathnameContext);
        if ("use" in _react.default) {
          const navigationPromises = (0, _react.use)(_hooksclientcontextsharedruntime.NavigationPromisesContext);
          if (navigationPromises) {
            return (0, _react.use)(navigationPromises.pathname);
          }
        }
        return pathname;
      }
      function useRouter() {
        const router = (0, _react.useContext)(_approutercontextsharedruntime.AppRouterContext);
        if (router === null) {
          throw Object.defineProperty(new Error("invariant expected app router to be mounted"), "__NEXT_ERROR_CODE", {
            value: "E238",
            enumerable: false,
            configurable: true
          });
        }
        return router;
      }
      function useParams() {
        useDynamicRouteParams?.("useParams()");
        const params = (0, _react.useContext)(_hooksclientcontextsharedruntime.PathParamsContext);
        if ("use" in _react.default) {
          const navigationPromises = (0, _react.use)(_hooksclientcontextsharedruntime.NavigationPromisesContext);
          if (navigationPromises) {
            return (0, _react.use)(navigationPromises.params);
          }
        }
        return params;
      }
      function useSelectedLayoutSegments(parallelRouteKey = "children") {
        useDynamicRouteParams?.("useSelectedLayoutSegments()");
        const context = (0, _react.useContext)(_approutercontextsharedruntime.LayoutRouterContext);
        if (!context) return null;
        if ("use" in _react.default) {
          const navigationPromises = (0, _react.use)(_hooksclientcontextsharedruntime.NavigationPromisesContext);
          if (navigationPromises) {
            const promise = navigationPromises.selectedLayoutSegmentsPromises?.get(parallelRouteKey);
            if (promise) {
              return (0, _react.use)(promise);
            }
          }
        }
        return (0, _segment.getSelectedLayoutSegmentPath)(context.parentTree, parallelRouteKey);
      }
      function useSelectedLayoutSegment(parallelRouteKey = "children") {
        useDynamicRouteParams?.("useSelectedLayoutSegment()");
        const navigationPromises = (0, _react.useContext)(_hooksclientcontextsharedruntime.NavigationPromisesContext);
        const selectedLayoutSegments = useSelectedLayoutSegments(parallelRouteKey);
        if (navigationPromises && "use" in _react.default) {
          const promise = navigationPromises.selectedLayoutSegmentPromises?.get(parallelRouteKey);
          if (promise) {
            return (0, _react.use)(promise);
          }
        }
        return (0, _segment.computeSelectedLayoutSegment)(selectedLayoutSegments, parallelRouteKey);
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/navigation.js
  var require_navigation2 = __commonJS({
    "node_modules/next/navigation.js"(exports, module) {
      module.exports = require_navigation();
    }
  });

  // node_modules/react/cjs/react-jsx-runtime.development.js
  var require_react_jsx_runtime_development = __commonJS({
    "node_modules/react/cjs/react-jsx-runtime.development.js"(exports) {
      "use strict";
      (function() {
        function getComponentNameFromType(type) {
          if (null == type) return null;
          if ("function" === typeof type)
            return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
          if ("string" === typeof type) return type;
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
              return "Activity";
          }
          if ("object" === typeof type)
            switch ("number" === typeof type.tag && console.error(
              "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
            ), type.$$typeof) {
              case REACT_PORTAL_TYPE:
                return "Portal";
              case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
              case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
              case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
              case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE2:
                innerType = type._payload;
                type = type._init;
                try {
                  return getComponentNameFromType(type(innerType));
                } catch (x) {
                }
            }
          return null;
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          try {
            testStringCoercion(value);
            var JSCompiler_inline_result = false;
          } catch (e) {
            JSCompiler_inline_result = true;
          }
          if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(
              JSCompiler_inline_result,
              "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
              JSCompiler_inline_result$jscomp$0
            );
            return testStringCoercion(value);
          }
        }
        function getTaskName(type) {
          if (type === REACT_FRAGMENT_TYPE) return "<>";
          if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE2)
            return "<...>";
          try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
          } catch (x) {
            return "<...>";
          }
        }
        function getOwner() {
          var dispatcher = ReactSharedInternals.A;
          return null === dispatcher ? null : dispatcher.getOwner();
        }
        function UnknownOwner() {
          return Error("react-stack-top-frame");
        }
        function hasValidKey(config) {
          if (hasOwnProperty2.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return false;
          }
          return void 0 !== config.key;
        }
        function defineKeyPropWarningGetter(props, displayName) {
          function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
              "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
              displayName
            ));
          }
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
        function elementRefGetterWithDeprecationWarning() {
          var componentName = getComponentNameFromType(this.type);
          didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
            "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
          ));
          componentName = this.props.ref;
          return void 0 !== componentName ? componentName : null;
        }
        function ReactElement(type, key, props, owner, debugStack, debugTask) {
          var refProp = props.ref;
          type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type,
            key,
            props,
            _owner: owner
          };
          null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: false,
            get: elementRefGetterWithDeprecationWarning
          }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
          type._store = {};
          Object.defineProperty(type._store, "validated", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: 0
          });
          Object.defineProperty(type, "_debugInfo", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: null
          });
          Object.defineProperty(type, "_debugStack", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugStack
          });
          Object.defineProperty(type, "_debugTask", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugTask
          });
          Object.freeze && (Object.freeze(type.props), Object.freeze(type));
          return type;
        }
        function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
          var children = config.children;
          if (void 0 !== children)
            if (isStaticChildren)
              if (isArrayImpl(children)) {
                for (isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)
                  validateChildKeys(children[isStaticChildren]);
                Object.freeze && Object.freeze(children);
              } else
                console.error(
                  "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
                );
            else validateChildKeys(children);
          if (hasOwnProperty2.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
              return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error(
              'A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />',
              isStaticChildren,
              children,
              keys,
              children
            ), didWarnAboutKeySpread[children + isStaticChildren] = true);
          }
          children = null;
          void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
          hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
          if ("key" in config) {
            maybeKey = {};
            for (var propName in config)
              "key" !== propName && (maybeKey[propName] = config[propName]);
          } else maybeKey = config;
          children && defineKeyPropWarningGetter(
            maybeKey,
            "function" === typeof type ? type.displayName || type.name || "Unknown" : type
          );
          return ReactElement(
            type,
            children,
            maybeKey,
            getOwner(),
            debugStack,
            debugTask
          );
        }
        function validateChildKeys(node) {
          isValidElement5(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE2 && ("fulfilled" === node._payload.status ? isValidElement5(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
        }
        function isValidElement5(object) {
          return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        var React36 = require_react(), REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE2 = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = React36.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty2 = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
          return null;
        };
        React36 = {
          react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
          }
        };
        var specialPropKeyWarningShown;
        var didWarnAboutElementRef = {};
        var unknownOwnerDebugStack = React36.react_stack_bottom_frame.bind(
          React36,
          UnknownOwner
        )();
        var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
        var didWarnAboutKeySpread = {};
        exports.Fragment = REACT_FRAGMENT_TYPE;
        exports.jsx = function(type, config, maybeKey) {
          var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
          return jsxDEVImpl(
            type,
            config,
            maybeKey,
            false,
            trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
            trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
          );
        };
        exports.jsxs = function(type, config, maybeKey) {
          var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
          return jsxDEVImpl(
            type,
            config,
            maybeKey,
            true,
            trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
            trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
          );
        };
      })();
    }
  });

  // node_modules/react/jsx-runtime.js
  var require_jsx_runtime = __commonJS({
    "node_modules/react/jsx-runtime.js"(exports, module) {
      "use strict";
      if (false) {
        module.exports = null;
      } else {
        module.exports = require_react_jsx_runtime_development();
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/querystring.js
  var require_querystring = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/querystring.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        assign: function() {
          return assign;
        },
        searchParamsToUrlQuery: function() {
          return searchParamsToUrlQuery;
        },
        urlQueryToSearchParams: function() {
          return urlQueryToSearchParams;
        }
      });
      function searchParamsToUrlQuery(searchParams) {
        const query = {};
        for (const [key, value] of searchParams.entries()) {
          const existing = query[key];
          if (typeof existing === "undefined") {
            query[key] = value;
          } else if (Array.isArray(existing)) {
            existing.push(value);
          } else {
            query[key] = [
              existing,
              value
            ];
          }
        }
        return query;
      }
      function stringifyUrlQueryParam(param) {
        if (typeof param === "string") {
          return param;
        }
        if (typeof param === "number" && !isNaN(param) || typeof param === "boolean") {
          return String(param);
        } else {
          return "";
        }
      }
      function urlQueryToSearchParams(query) {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(query)) {
          if (Array.isArray(value)) {
            for (const item of value) {
              searchParams.append(key, stringifyUrlQueryParam(item));
            }
          } else {
            searchParams.set(key, stringifyUrlQueryParam(value));
          }
        }
        return searchParams;
      }
      function assign(target, ...searchParamsList) {
        for (const searchParams of searchParamsList) {
          for (const key of searchParams.keys()) {
            target.delete(key);
          }
          for (const [key, value] of searchParams.entries()) {
            target.append(key, value);
          }
        }
        return target;
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/format-url.js
  var require_format_url = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/format-url.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        formatUrl: function() {
          return formatUrl;
        },
        formatWithValidation: function() {
          return formatWithValidation;
        },
        urlObjectKeys: function() {
          return urlObjectKeys;
        }
      });
      var _interop_require_wildcard = require_interop_require_wildcard();
      var _querystring = /* @__PURE__ */ _interop_require_wildcard._(require_querystring());
      var slashedProtocols = /https?|ftp|gopher|file/;
      function formatUrl(urlObj) {
        let { auth, hostname } = urlObj;
        let protocol = urlObj.protocol || "";
        let pathname = urlObj.pathname || "";
        let hash = urlObj.hash || "";
        let query = urlObj.query || "";
        let host = false;
        auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ":") + "@" : "";
        if (urlObj.host) {
          host = auth + urlObj.host;
        } else if (hostname) {
          host = auth + (~hostname.indexOf(":") ? `[${hostname}]` : hostname);
          if (urlObj.port) {
            host += ":" + urlObj.port;
          }
        }
        if (query && typeof query === "object") {
          query = String(_querystring.urlQueryToSearchParams(query));
        }
        let search = urlObj.search || query && `?${query}` || "";
        if (protocol && !protocol.endsWith(":")) protocol += ":";
        if (urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && host !== false) {
          host = "//" + (host || "");
          if (pathname && pathname[0] !== "/") pathname = "/" + pathname;
        } else if (!host) {
          host = "";
        }
        if (hash && hash[0] !== "#") hash = "#" + hash;
        if (search && search[0] !== "?") search = "?" + search;
        pathname = pathname.replace(/[?#]/g, encodeURIComponent);
        search = search.replace("#", "%23");
        return `${protocol}${host}${pathname}${search}${hash}`;
      }
      var urlObjectKeys = [
        "auth",
        "hash",
        "host",
        "hostname",
        "href",
        "path",
        "pathname",
        "port",
        "protocol",
        "query",
        "search",
        "slashes"
      ];
      function formatWithValidation(url) {
        if (true) {
          if (url !== null && typeof url === "object") {
            Object.keys(url).forEach((key) => {
              if (!urlObjectKeys.includes(key)) {
                console.warn(`Unknown key passed via urlObject into url.format: ${key}`);
              }
            });
          }
        }
        return formatUrl(url);
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/omit.js
  var require_omit = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/omit.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "omit", {
        enumerable: true,
        get: function() {
          return omit;
        }
      });
      function omit(object, keys) {
        const omitted = {};
        Object.keys(object).forEach((key) => {
          if (!keys.includes(key)) {
            omitted[key] = object[key];
          }
        });
        return omitted;
      }
    }
  });

  // node_modules/next/dist/shared/lib/utils.js
  var require_utils = __commonJS({
    "node_modules/next/dist/shared/lib/utils.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        DecodeError: function() {
          return DecodeError;
        },
        MiddlewareNotFoundError: function() {
          return MiddlewareNotFoundError;
        },
        MissingStaticPage: function() {
          return MissingStaticPage;
        },
        NormalizeError: function() {
          return NormalizeError;
        },
        PageNotFoundError: function() {
          return PageNotFoundError;
        },
        SP: function() {
          return SP;
        },
        ST: function() {
          return ST;
        },
        WEB_VITALS: function() {
          return WEB_VITALS;
        },
        execOnce: function() {
          return execOnce;
        },
        getDisplayName: function() {
          return getDisplayName;
        },
        getLocationOrigin: function() {
          return getLocationOrigin;
        },
        getURL: function() {
          return getURL;
        },
        isAbsoluteUrl: function() {
          return isAbsoluteUrl;
        },
        isResSent: function() {
          return isResSent;
        },
        loadGetInitialProps: function() {
          return loadGetInitialProps;
        },
        normalizeRepeatedSlashes: function() {
          return normalizeRepeatedSlashes;
        },
        stringifyError: function() {
          return stringifyError;
        }
      });
      var WEB_VITALS = [
        "CLS",
        "FCP",
        "FID",
        "INP",
        "LCP",
        "TTFB"
      ];
      function execOnce(fn) {
        let used = false;
        let result;
        return (...args) => {
          if (!used) {
            used = true;
            result = fn(...args);
          }
          return result;
        };
      }
      var ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
      var isAbsoluteUrl = (url) => ABSOLUTE_URL_REGEX.test(url);
      function getLocationOrigin() {
        const { protocol, hostname, port } = window.location;
        return `${protocol}//${hostname}${port ? ":" + port : ""}`;
      }
      function getURL() {
        const { href } = window.location;
        const origin2 = getLocationOrigin();
        return href.substring(origin2.length);
      }
      function getDisplayName(Component) {
        return typeof Component === "string" ? Component : Component.displayName || Component.name || "Unknown";
      }
      function isResSent(res) {
        return res.finished || res.headersSent;
      }
      function normalizeRepeatedSlashes(url) {
        const urlParts = url.split("?");
        const urlNoQuery = urlParts[0];
        return urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/") + (urlParts[1] ? `?${urlParts.slice(1).join("?")}` : "");
      }
      async function loadGetInitialProps(App, ctx) {
        if (true) {
          if (App.prototype?.getInitialProps) {
            const message = `"${getDisplayName(App)}.getInitialProps()" is defined as an instance method - visit https://nextjs.org/docs/messages/get-initial-props-as-an-instance-method for more information.`;
            throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
              value: "E394",
              enumerable: false,
              configurable: true
            });
          }
        }
        const res = ctx.res || ctx.ctx && ctx.ctx.res;
        if (!App.getInitialProps) {
          if (ctx.ctx && ctx.Component) {
            return {
              pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx)
            };
          }
          return {};
        }
        const props = await App.getInitialProps(ctx);
        if (res && isResSent(res)) {
          return props;
        }
        if (!props) {
          const message = `"${getDisplayName(App)}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
          throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
            value: "E394",
            enumerable: false,
            configurable: true
          });
        }
        if (true) {
          if (Object.keys(props).length === 0 && !ctx.ctx) {
            console.warn(`${getDisplayName(App)} returned an empty object from \`getInitialProps\`. This de-optimizes and prevents automatic static optimization. https://nextjs.org/docs/messages/empty-object-getInitialProps`);
          }
        }
        return props;
      }
      var SP = typeof performance !== "undefined";
      var ST = SP && [
        "mark",
        "measure",
        "getEntriesByName"
      ].every((method) => typeof performance[method] === "function");
      var DecodeError = class extends Error {
      };
      var NormalizeError = class extends Error {
      };
      var PageNotFoundError = class extends Error {
        constructor(page) {
          super();
          this.code = "ENOENT";
          this.name = "PageNotFoundError";
          this.message = `Cannot find module for page: ${page}`;
        }
      };
      var MissingStaticPage = class extends Error {
        constructor(page, message) {
          super();
          this.message = `Failed to load static file for page: ${page} ${message}`;
        }
      };
      var MiddlewareNotFoundError = class extends Error {
        constructor() {
          super();
          this.code = "ENOENT";
          this.message = `Cannot find the middleware module`;
        }
      };
      function stringifyError(error) {
        return JSON.stringify({
          message: error.message,
          stack: error.stack
        });
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/remove-trailing-slash.js
  var require_remove_trailing_slash = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/remove-trailing-slash.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "removeTrailingSlash", {
        enumerable: true,
        get: function() {
          return removeTrailingSlash;
        }
      });
      function removeTrailingSlash(route) {
        return route.replace(/\/$/, "") || "/";
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/parse-path.js
  var require_parse_path = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/parse-path.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "parsePath", {
        enumerable: true,
        get: function() {
          return parsePath;
        }
      });
      function parsePath(path) {
        const hashIndex = path.indexOf("#");
        const queryIndex = path.indexOf("?");
        const hasQuery = queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex);
        if (hasQuery || hashIndex > -1) {
          return {
            pathname: path.substring(0, hasQuery ? queryIndex : hashIndex),
            query: hasQuery ? path.substring(queryIndex, hashIndex > -1 ? hashIndex : void 0) : "",
            hash: hashIndex > -1 ? path.slice(hashIndex) : ""
          };
        }
        return {
          pathname: path,
          query: "",
          hash: ""
        };
      }
    }
  });

  // node_modules/next/dist/client/normalize-trailing-slash.js
  var require_normalize_trailing_slash = __commonJS({
    "node_modules/next/dist/client/normalize-trailing-slash.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "normalizePathTrailingSlash", {
        enumerable: true,
        get: function() {
          return normalizePathTrailingSlash;
        }
      });
      var _removetrailingslash = require_remove_trailing_slash();
      var _parsepath = require_parse_path();
      var normalizePathTrailingSlash = (path) => {
        if (!path.startsWith("/") || process.env.__NEXT_MANUAL_TRAILING_SLASH) {
          return path;
        }
        const { pathname, query, hash } = (0, _parsepath.parsePath)(path);
        if (process.env.__NEXT_TRAILING_SLASH) {
          if (/\.[^/]+\/?$/.test(pathname)) {
            return `${(0, _removetrailingslash.removeTrailingSlash)(pathname)}${query}${hash}`;
          } else if (pathname.endsWith("/")) {
            return `${pathname}${query}${hash}`;
          } else {
            return `${pathname}/${query}${hash}`;
          }
        }
        return `${(0, _removetrailingslash.removeTrailingSlash)(pathname)}${query}${hash}`;
      };
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/path-has-prefix.js
  var require_path_has_prefix = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/path-has-prefix.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "pathHasPrefix", {
        enumerable: true,
        get: function() {
          return pathHasPrefix;
        }
      });
      var _parsepath = require_parse_path();
      function pathHasPrefix(path, prefix) {
        if (typeof path !== "string") {
          return false;
        }
        const { pathname } = (0, _parsepath.parsePath)(path);
        return pathname === prefix || pathname.startsWith(prefix + "/");
      }
    }
  });

  // node_modules/next/dist/client/has-base-path.js
  var require_has_base_path = __commonJS({
    "node_modules/next/dist/client/has-base-path.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "hasBasePath", {
        enumerable: true,
        get: function() {
          return hasBasePath;
        }
      });
      var _pathhasprefix = require_path_has_prefix();
      var basePath = process.env.__NEXT_ROUTER_BASEPATH || "";
      function hasBasePath(path) {
        return (0, _pathhasprefix.pathHasPrefix)(path, basePath);
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/is-local-url.js
  var require_is_local_url = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/is-local-url.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "isLocalURL", {
        enumerable: true,
        get: function() {
          return isLocalURL;
        }
      });
      var _utils = require_utils();
      var _hasbasepath = require_has_base_path();
      function isLocalURL(url) {
        if (!(0, _utils.isAbsoluteUrl)(url)) return true;
        try {
          const locationOrigin = (0, _utils.getLocationOrigin)();
          const resolved = new URL(url, locationOrigin);
          return resolved.origin === locationOrigin && (0, _hasbasepath.hasBasePath)(resolved.pathname);
        } catch (_) {
          return false;
        }
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/sorted-routes.js
  var require_sorted_routes = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/sorted-routes.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        getSortedRouteObjects: function() {
          return getSortedRouteObjects;
        },
        getSortedRoutes: function() {
          return getSortedRoutes;
        }
      });
      var UrlNode = class _UrlNode {
        insert(urlPath) {
          this._insert(urlPath.split("/").filter(Boolean), [], false);
        }
        smoosh() {
          return this._smoosh();
        }
        _smoosh(prefix = "/") {
          const childrenPaths = [
            ...this.children.keys()
          ].sort();
          if (this.slugName !== null) {
            childrenPaths.splice(childrenPaths.indexOf("[]"), 1);
          }
          if (this.restSlugName !== null) {
            childrenPaths.splice(childrenPaths.indexOf("[...]"), 1);
          }
          if (this.optionalRestSlugName !== null) {
            childrenPaths.splice(childrenPaths.indexOf("[[...]]"), 1);
          }
          const routes = childrenPaths.map((c) => this.children.get(c)._smoosh(`${prefix}${c}/`)).reduce((prev, curr) => [
            ...prev,
            ...curr
          ], []);
          if (this.slugName !== null) {
            routes.push(...this.children.get("[]")._smoosh(`${prefix}[${this.slugName}]/`));
          }
          if (!this.placeholder) {
            const r2 = prefix === "/" ? "/" : prefix.slice(0, -1);
            if (this.optionalRestSlugName != null) {
              throw Object.defineProperty(new Error(`You cannot define a route with the same specificity as a optional catch-all route ("${r2}" and "${r2}[[...${this.optionalRestSlugName}]]").`), "__NEXT_ERROR_CODE", {
                value: "E458",
                enumerable: false,
                configurable: true
              });
            }
            routes.unshift(r2);
          }
          if (this.restSlugName !== null) {
            routes.push(...this.children.get("[...]")._smoosh(`${prefix}[...${this.restSlugName}]/`));
          }
          if (this.optionalRestSlugName !== null) {
            routes.push(...this.children.get("[[...]]")._smoosh(`${prefix}[[...${this.optionalRestSlugName}]]/`));
          }
          return routes;
        }
        _insert(urlPaths, slugNames, isCatchAll) {
          if (urlPaths.length === 0) {
            this.placeholder = false;
            return;
          }
          if (isCatchAll) {
            throw Object.defineProperty(new Error(`Catch-all must be the last part of the URL.`), "__NEXT_ERROR_CODE", {
              value: "E392",
              enumerable: false,
              configurable: true
            });
          }
          let nextSegment = urlPaths[0];
          if (nextSegment.startsWith("[") && nextSegment.endsWith("]")) {
            let handleSlug = function(previousSlug, nextSlug) {
              if (previousSlug !== null) {
                if (previousSlug !== nextSlug) {
                  throw Object.defineProperty(new Error(`You cannot use different slug names for the same dynamic path ('${previousSlug}' !== '${nextSlug}').`), "__NEXT_ERROR_CODE", {
                    value: "E337",
                    enumerable: false,
                    configurable: true
                  });
                }
              }
              slugNames.forEach((slug) => {
                if (slug === nextSlug) {
                  throw Object.defineProperty(new Error(`You cannot have the same slug name "${nextSlug}" repeat within a single dynamic path`), "__NEXT_ERROR_CODE", {
                    value: "E247",
                    enumerable: false,
                    configurable: true
                  });
                }
                if (slug.replace(/\W/g, "") === nextSegment.replace(/\W/g, "")) {
                  throw Object.defineProperty(new Error(`You cannot have the slug names "${slug}" and "${nextSlug}" differ only by non-word symbols within a single dynamic path`), "__NEXT_ERROR_CODE", {
                    value: "E499",
                    enumerable: false,
                    configurable: true
                  });
                }
              });
              slugNames.push(nextSlug);
            };
            let segmentName = nextSegment.slice(1, -1);
            let isOptional = false;
            if (segmentName.startsWith("[") && segmentName.endsWith("]")) {
              segmentName = segmentName.slice(1, -1);
              isOptional = true;
            }
            if (segmentName.startsWith("\u2026")) {
              throw Object.defineProperty(new Error(`Detected a three-dot character ('\u2026') at ('${segmentName}'). Did you mean ('...')?`), "__NEXT_ERROR_CODE", {
                value: "E147",
                enumerable: false,
                configurable: true
              });
            }
            if (segmentName.startsWith("...")) {
              segmentName = segmentName.substring(3);
              isCatchAll = true;
            }
            if (segmentName.startsWith("[") || segmentName.endsWith("]")) {
              throw Object.defineProperty(new Error(`Segment names may not start or end with extra brackets ('${segmentName}').`), "__NEXT_ERROR_CODE", {
                value: "E421",
                enumerable: false,
                configurable: true
              });
            }
            if (segmentName.startsWith(".")) {
              throw Object.defineProperty(new Error(`Segment names may not start with erroneous periods ('${segmentName}').`), "__NEXT_ERROR_CODE", {
                value: "E288",
                enumerable: false,
                configurable: true
              });
            }
            if (isCatchAll) {
              if (isOptional) {
                if (this.restSlugName != null) {
                  throw Object.defineProperty(new Error(`You cannot use both an required and optional catch-all route at the same level ("[...${this.restSlugName}]" and "${urlPaths[0]}" ).`), "__NEXT_ERROR_CODE", {
                    value: "E299",
                    enumerable: false,
                    configurable: true
                  });
                }
                handleSlug(this.optionalRestSlugName, segmentName);
                this.optionalRestSlugName = segmentName;
                nextSegment = "[[...]]";
              } else {
                if (this.optionalRestSlugName != null) {
                  throw Object.defineProperty(new Error(`You cannot use both an optional and required catch-all route at the same level ("[[...${this.optionalRestSlugName}]]" and "${urlPaths[0]}").`), "__NEXT_ERROR_CODE", {
                    value: "E300",
                    enumerable: false,
                    configurable: true
                  });
                }
                handleSlug(this.restSlugName, segmentName);
                this.restSlugName = segmentName;
                nextSegment = "[...]";
              }
            } else {
              if (isOptional) {
                throw Object.defineProperty(new Error(`Optional route parameters are not yet supported ("${urlPaths[0]}").`), "__NEXT_ERROR_CODE", {
                  value: "E435",
                  enumerable: false,
                  configurable: true
                });
              }
              handleSlug(this.slugName, segmentName);
              this.slugName = segmentName;
              nextSegment = "[]";
            }
          }
          if (!this.children.has(nextSegment)) {
            this.children.set(nextSegment, new _UrlNode());
          }
          this.children.get(nextSegment)._insert(urlPaths.slice(1), slugNames, isCatchAll);
        }
        constructor() {
          this.placeholder = true;
          this.children = /* @__PURE__ */ new Map();
          this.slugName = null;
          this.restSlugName = null;
          this.optionalRestSlugName = null;
        }
      };
      function getSortedRoutes(normalizedPages) {
        const root = new UrlNode();
        normalizedPages.forEach((pagePath) => root.insert(pagePath));
        return root.smoosh();
      }
      function getSortedRouteObjects(objects, getter) {
        const indexes = {};
        const pathnames = [];
        for (let i = 0; i < objects.length; i++) {
          const pathname = getter(objects[i]);
          indexes[pathname] = i;
          pathnames[i] = pathname;
        }
        const sorted = getSortedRoutes(pathnames);
        return sorted.map((pathname) => objects[indexes[pathname]]);
      }
    }
  });

  // node_modules/next/dist/shared/lib/page-path/ensure-leading-slash.js
  var require_ensure_leading_slash = __commonJS({
    "node_modules/next/dist/shared/lib/page-path/ensure-leading-slash.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "ensureLeadingSlash", {
        enumerable: true,
        get: function() {
          return ensureLeadingSlash;
        }
      });
      function ensureLeadingSlash(path) {
        return path.startsWith("/") ? path : `/${path}`;
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/app-paths.js
  var require_app_paths = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/app-paths.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        normalizeAppPath: function() {
          return normalizeAppPath;
        },
        normalizeRscURL: function() {
          return normalizeRscURL;
        }
      });
      var _ensureleadingslash = require_ensure_leading_slash();
      var _segment = require_segment();
      function normalizeAppPath(route) {
        return (0, _ensureleadingslash.ensureLeadingSlash)(route.split("/").reduce((pathname, segment, index2, segments) => {
          if (!segment) {
            return pathname;
          }
          if ((0, _segment.isGroupSegment)(segment)) {
            return pathname;
          }
          if (segment[0] === "@") {
            return pathname;
          }
          if ((segment === "page" || segment === "route") && index2 === segments.length - 1) {
            return pathname;
          }
          return `${pathname}/${segment}`;
        }, ""));
      }
      function normalizeRscURL(url) {
        return url.replace(
          /\.rsc($|\?)/,
          // $1 ensures `?` is preserved
          "$1"
        );
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/interception-routes.js
  var require_interception_routes = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/interception-routes.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        INTERCEPTION_ROUTE_MARKERS: function() {
          return INTERCEPTION_ROUTE_MARKERS;
        },
        extractInterceptionRouteInformation: function() {
          return extractInterceptionRouteInformation;
        },
        isInterceptionRouteAppPath: function() {
          return isInterceptionRouteAppPath;
        }
      });
      var _apppaths = require_app_paths();
      var INTERCEPTION_ROUTE_MARKERS = [
        "(..)(..)",
        "(.)",
        "(..)",
        "(...)"
      ];
      function isInterceptionRouteAppPath(path) {
        return path.split("/").find((segment) => INTERCEPTION_ROUTE_MARKERS.find((m) => segment.startsWith(m))) !== void 0;
      }
      function extractInterceptionRouteInformation(path) {
        let interceptingRoute;
        let marker;
        let interceptedRoute;
        for (const segment of path.split("/")) {
          marker = INTERCEPTION_ROUTE_MARKERS.find((m) => segment.startsWith(m));
          if (marker) {
            ;
            [interceptingRoute, interceptedRoute] = path.split(marker, 2);
            break;
          }
        }
        if (!interceptingRoute || !marker || !interceptedRoute) {
          throw Object.defineProperty(new Error(`Invalid interception route: ${path}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`), "__NEXT_ERROR_CODE", {
            value: "E269",
            enumerable: false,
            configurable: true
          });
        }
        interceptingRoute = (0, _apppaths.normalizeAppPath)(interceptingRoute);
        switch (marker) {
          case "(.)":
            if (interceptingRoute === "/") {
              interceptedRoute = `/${interceptedRoute}`;
            } else {
              interceptedRoute = interceptingRoute + "/" + interceptedRoute;
            }
            break;
          case "(..)":
            if (interceptingRoute === "/") {
              throw Object.defineProperty(new Error(`Invalid interception route: ${path}. Cannot use (..) marker at the root level, use (.) instead.`), "__NEXT_ERROR_CODE", {
                value: "E207",
                enumerable: false,
                configurable: true
              });
            }
            interceptedRoute = interceptingRoute.split("/").slice(0, -1).concat(interceptedRoute).join("/");
            break;
          case "(...)":
            interceptedRoute = "/" + interceptedRoute;
            break;
          case "(..)(..)":
            const splitInterceptingRoute = interceptingRoute.split("/");
            if (splitInterceptingRoute.length <= 2) {
              throw Object.defineProperty(new Error(`Invalid interception route: ${path}. Cannot use (..)(..) marker at the root level or one level up.`), "__NEXT_ERROR_CODE", {
                value: "E486",
                enumerable: false,
                configurable: true
              });
            }
            interceptedRoute = splitInterceptingRoute.slice(0, -2).concat(interceptedRoute).join("/");
            break;
          default:
            throw Object.defineProperty(new Error("Invariant: unexpected marker"), "__NEXT_ERROR_CODE", {
              value: "E112",
              enumerable: false,
              configurable: true
            });
        }
        return {
          interceptingRoute,
          interceptedRoute
        };
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/is-dynamic.js
  var require_is_dynamic = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/is-dynamic.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "isDynamicRoute", {
        enumerable: true,
        get: function() {
          return isDynamicRoute;
        }
      });
      var _interceptionroutes = require_interception_routes();
      var TEST_ROUTE = /\/[^/]*\[[^/]+\][^/]*(?=\/|$)/;
      var TEST_STRICT_ROUTE = /\/\[[^/]+\](?=\/|$)/;
      function isDynamicRoute(route, strict = true) {
        if ((0, _interceptionroutes.isInterceptionRouteAppPath)(route)) {
          route = (0, _interceptionroutes.extractInterceptionRouteInformation)(route).interceptedRoute;
        }
        if (strict) {
          return TEST_STRICT_ROUTE.test(route);
        }
        return TEST_ROUTE.test(route);
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/index.js
  var require_utils2 = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        getSortedRouteObjects: function() {
          return _sortedroutes.getSortedRouteObjects;
        },
        getSortedRoutes: function() {
          return _sortedroutes.getSortedRoutes;
        },
        isDynamicRoute: function() {
          return _isdynamic.isDynamicRoute;
        }
      });
      var _sortedroutes = require_sorted_routes();
      var _isdynamic = require_is_dynamic();
    }
  });

  // node_modules/next/dist/compiled/path-to-regexp/index.js
  var require_path_to_regexp = __commonJS({
    "node_modules/next/dist/compiled/path-to-regexp/index.js"(exports, module) {
      (() => {
        "use strict";
        if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
        var e = {};
        (() => {
          var n = e;
          Object.defineProperty(n, "__esModule", { value: true });
          n.pathToRegexp = n.tokensToRegexp = n.regexpToFunction = n.match = n.tokensToFunction = n.compile = n.parse = void 0;
          function lexer(e2) {
            var n2 = [];
            var r2 = 0;
            while (r2 < e2.length) {
              var t = e2[r2];
              if (t === "*" || t === "+" || t === "?") {
                n2.push({ type: "MODIFIER", index: r2, value: e2[r2++] });
                continue;
              }
              if (t === "\\") {
                n2.push({ type: "ESCAPED_CHAR", index: r2++, value: e2[r2++] });
                continue;
              }
              if (t === "{") {
                n2.push({ type: "OPEN", index: r2, value: e2[r2++] });
                continue;
              }
              if (t === "}") {
                n2.push({ type: "CLOSE", index: r2, value: e2[r2++] });
                continue;
              }
              if (t === ":") {
                var a = "";
                var i = r2 + 1;
                while (i < e2.length) {
                  var o = e2.charCodeAt(i);
                  if (o >= 48 && o <= 57 || o >= 65 && o <= 90 || o >= 97 && o <= 122 || o === 95) {
                    a += e2[i++];
                    continue;
                  }
                  break;
                }
                if (!a) throw new TypeError("Missing parameter name at ".concat(r2));
                n2.push({ type: "NAME", index: r2, value: a });
                r2 = i;
                continue;
              }
              if (t === "(") {
                var c = 1;
                var f = "";
                var i = r2 + 1;
                if (e2[i] === "?") {
                  throw new TypeError('Pattern cannot start with "?" at '.concat(i));
                }
                while (i < e2.length) {
                  if (e2[i] === "\\") {
                    f += e2[i++] + e2[i++];
                    continue;
                  }
                  if (e2[i] === ")") {
                    c--;
                    if (c === 0) {
                      i++;
                      break;
                    }
                  } else if (e2[i] === "(") {
                    c++;
                    if (e2[i + 1] !== "?") {
                      throw new TypeError("Capturing groups are not allowed at ".concat(i));
                    }
                  }
                  f += e2[i++];
                }
                if (c) throw new TypeError("Unbalanced pattern at ".concat(r2));
                if (!f) throw new TypeError("Missing pattern at ".concat(r2));
                n2.push({ type: "PATTERN", index: r2, value: f });
                r2 = i;
                continue;
              }
              n2.push({ type: "CHAR", index: r2, value: e2[r2++] });
            }
            n2.push({ type: "END", index: r2, value: "" });
            return n2;
          }
          function parse2(e2, n2) {
            if (n2 === void 0) {
              n2 = {};
            }
            var r2 = lexer(e2);
            var t = n2.prefixes, a = t === void 0 ? "./" : t, i = n2.delimiter, o = i === void 0 ? "/#?" : i;
            var c = [];
            var f = 0;
            var u = 0;
            var p = "";
            var tryConsume = function(e3) {
              if (u < r2.length && r2[u].type === e3) return r2[u++].value;
            };
            var mustConsume = function(e3) {
              var n3 = tryConsume(e3);
              if (n3 !== void 0) return n3;
              var t2 = r2[u], a2 = t2.type, i2 = t2.index;
              throw new TypeError("Unexpected ".concat(a2, " at ").concat(i2, ", expected ").concat(e3));
            };
            var consumeText = function() {
              var e3 = "";
              var n3;
              while (n3 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
                e3 += n3;
              }
              return e3;
            };
            var isSafe = function(e3) {
              for (var n3 = 0, r3 = o; n3 < r3.length; n3++) {
                var t2 = r3[n3];
                if (e3.indexOf(t2) > -1) return true;
              }
              return false;
            };
            var safePattern = function(e3) {
              var n3 = c[c.length - 1];
              var r3 = e3 || (n3 && typeof n3 === "string" ? n3 : "");
              if (n3 && !r3) {
                throw new TypeError('Must have text between two parameters, missing text after "'.concat(n3.name, '"'));
              }
              if (!r3 || isSafe(r3)) return "[^".concat(escapeString(o), "]+?");
              return "(?:(?!".concat(escapeString(r3), ")[^").concat(escapeString(o), "])+?");
            };
            while (u < r2.length) {
              var v = tryConsume("CHAR");
              var s = tryConsume("NAME");
              var d = tryConsume("PATTERN");
              if (s || d) {
                var g = v || "";
                if (a.indexOf(g) === -1) {
                  p += g;
                  g = "";
                }
                if (p) {
                  c.push(p);
                  p = "";
                }
                c.push({ name: s || f++, prefix: g, suffix: "", pattern: d || safePattern(g), modifier: tryConsume("MODIFIER") || "" });
                continue;
              }
              var x = v || tryConsume("ESCAPED_CHAR");
              if (x) {
                p += x;
                continue;
              }
              if (p) {
                c.push(p);
                p = "";
              }
              var h = tryConsume("OPEN");
              if (h) {
                var g = consumeText();
                var l = tryConsume("NAME") || "";
                var m = tryConsume("PATTERN") || "";
                var T = consumeText();
                mustConsume("CLOSE");
                c.push({ name: l || (m ? f++ : ""), pattern: l && !m ? safePattern(g) : m, prefix: g, suffix: T, modifier: tryConsume("MODIFIER") || "" });
                continue;
              }
              mustConsume("END");
            }
            return c;
          }
          n.parse = parse2;
          function compile(e2, n2) {
            return tokensToFunction(parse2(e2, n2), n2);
          }
          n.compile = compile;
          function tokensToFunction(e2, n2) {
            if (n2 === void 0) {
              n2 = {};
            }
            var r2 = flags(n2);
            var t = n2.encode, a = t === void 0 ? function(e3) {
              return e3;
            } : t, i = n2.validate, o = i === void 0 ? true : i;
            var c = e2.map((function(e3) {
              if (typeof e3 === "object") {
                return new RegExp("^(?:".concat(e3.pattern, ")$"), r2);
              }
            }));
            return function(n3) {
              var r3 = "";
              for (var t2 = 0; t2 < e2.length; t2++) {
                var i2 = e2[t2];
                if (typeof i2 === "string") {
                  r3 += i2;
                  continue;
                }
                var f = n3 ? n3[i2.name] : void 0;
                var u = i2.modifier === "?" || i2.modifier === "*";
                var p = i2.modifier === "*" || i2.modifier === "+";
                if (Array.isArray(f)) {
                  if (!p) {
                    throw new TypeError('Expected "'.concat(i2.name, '" to not repeat, but got an array'));
                  }
                  if (f.length === 0) {
                    if (u) continue;
                    throw new TypeError('Expected "'.concat(i2.name, '" to not be empty'));
                  }
                  for (var v = 0; v < f.length; v++) {
                    var s = a(f[v], i2);
                    if (o && !c[t2].test(s)) {
                      throw new TypeError('Expected all "'.concat(i2.name, '" to match "').concat(i2.pattern, '", but got "').concat(s, '"'));
                    }
                    r3 += i2.prefix + s + i2.suffix;
                  }
                  continue;
                }
                if (typeof f === "string" || typeof f === "number") {
                  var s = a(String(f), i2);
                  if (o && !c[t2].test(s)) {
                    throw new TypeError('Expected "'.concat(i2.name, '" to match "').concat(i2.pattern, '", but got "').concat(s, '"'));
                  }
                  r3 += i2.prefix + s + i2.suffix;
                  continue;
                }
                if (u) continue;
                var d = p ? "an array" : "a string";
                throw new TypeError('Expected "'.concat(i2.name, '" to be ').concat(d));
              }
              return r3;
            };
          }
          n.tokensToFunction = tokensToFunction;
          function match(e2, n2) {
            var r2 = [];
            var t = pathToRegexp(e2, r2, n2);
            return regexpToFunction(t, r2, n2);
          }
          n.match = match;
          function regexpToFunction(e2, n2, r2) {
            if (r2 === void 0) {
              r2 = {};
            }
            var t = r2.decode, a = t === void 0 ? function(e3) {
              return e3;
            } : t;
            return function(r3) {
              var t2 = e2.exec(r3);
              if (!t2) return false;
              var i = t2[0], o = t2.index;
              var c = /* @__PURE__ */ Object.create(null);
              var _loop_1 = function(e3) {
                if (t2[e3] === void 0) return "continue";
                var r4 = n2[e3 - 1];
                if (r4.modifier === "*" || r4.modifier === "+") {
                  c[r4.name] = t2[e3].split(r4.prefix + r4.suffix).map((function(e4) {
                    return a(e4, r4);
                  }));
                } else {
                  c[r4.name] = a(t2[e3], r4);
                }
              };
              for (var f = 1; f < t2.length; f++) {
                _loop_1(f);
              }
              return { path: i, index: o, params: c };
            };
          }
          n.regexpToFunction = regexpToFunction;
          function escapeString(e2) {
            return e2.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
          }
          function flags(e2) {
            return e2 && e2.sensitive ? "" : "i";
          }
          function regexpToRegexp(e2, n2) {
            if (!n2) return e2;
            var r2 = /\((?:\?<(.*?)>)?(?!\?)/g;
            var t = 0;
            var a = r2.exec(e2.source);
            while (a) {
              n2.push({ name: a[1] || t++, prefix: "", suffix: "", modifier: "", pattern: "" });
              a = r2.exec(e2.source);
            }
            return e2;
          }
          function arrayToRegexp(e2, n2, r2) {
            var t = e2.map((function(e3) {
              return pathToRegexp(e3, n2, r2).source;
            }));
            return new RegExp("(?:".concat(t.join("|"), ")"), flags(r2));
          }
          function stringToRegexp(e2, n2, r2) {
            return tokensToRegexp(parse2(e2, r2), n2, r2);
          }
          function tokensToRegexp(e2, n2, r2) {
            if (r2 === void 0) {
              r2 = {};
            }
            var t = r2.strict, a = t === void 0 ? false : t, i = r2.start, o = i === void 0 ? true : i, c = r2.end, f = c === void 0 ? true : c, u = r2.encode, p = u === void 0 ? function(e3) {
              return e3;
            } : u, v = r2.delimiter, s = v === void 0 ? "/#?" : v, d = r2.endsWith, g = d === void 0 ? "" : d;
            var x = "[".concat(escapeString(g), "]|$");
            var h = "[".concat(escapeString(s), "]");
            var l = o ? "^" : "";
            for (var m = 0, T = e2; m < T.length; m++) {
              var E = T[m];
              if (typeof E === "string") {
                l += escapeString(p(E));
              } else {
                var w = escapeString(p(E.prefix));
                var y = escapeString(p(E.suffix));
                if (E.pattern) {
                  if (n2) n2.push(E);
                  if (w || y) {
                    if (E.modifier === "+" || E.modifier === "*") {
                      var R = E.modifier === "*" ? "?" : "";
                      l += "(?:".concat(w, "((?:").concat(E.pattern, ")(?:").concat(y).concat(w, "(?:").concat(E.pattern, "))*)").concat(y, ")").concat(R);
                    } else {
                      l += "(?:".concat(w, "(").concat(E.pattern, ")").concat(y, ")").concat(E.modifier);
                    }
                  } else {
                    if (E.modifier === "+" || E.modifier === "*") {
                      throw new TypeError('Can not repeat "'.concat(E.name, '" without a prefix and suffix'));
                    }
                    l += "(".concat(E.pattern, ")").concat(E.modifier);
                  }
                } else {
                  l += "(?:".concat(w).concat(y, ")").concat(E.modifier);
                }
              }
            }
            if (f) {
              if (!a) l += "".concat(h, "?");
              l += !r2.endsWith ? "$" : "(?=".concat(x, ")");
            } else {
              var A = e2[e2.length - 1];
              var _ = typeof A === "string" ? h.indexOf(A[A.length - 1]) > -1 : A === void 0;
              if (!a) {
                l += "(?:".concat(h, "(?=").concat(x, "))?");
              }
              if (!_) {
                l += "(?=".concat(h, "|").concat(x, ")");
              }
            }
            return new RegExp(l, flags(r2));
          }
          n.tokensToRegexp = tokensToRegexp;
          function pathToRegexp(e2, n2, r2) {
            if (e2 instanceof RegExp) return regexpToRegexp(e2, n2);
            if (Array.isArray(e2)) return arrayToRegexp(e2, n2, r2);
            return stringToRegexp(e2, n2, r2);
          }
          n.pathToRegexp = pathToRegexp;
        })();
        module.exports = e;
      })();
    }
  });

  // node_modules/next/dist/lib/route-pattern-normalizer.js
  var require_route_pattern_normalizer = __commonJS({
    "node_modules/next/dist/lib/route-pattern-normalizer.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        PARAM_SEPARATOR: function() {
          return PARAM_SEPARATOR;
        },
        hasAdjacentParameterIssues: function() {
          return hasAdjacentParameterIssues;
        },
        normalizeAdjacentParameters: function() {
          return normalizeAdjacentParameters;
        },
        normalizeTokensForRegexp: function() {
          return normalizeTokensForRegexp;
        },
        stripNormalizedSeparators: function() {
          return stripNormalizedSeparators;
        },
        stripParameterSeparators: function() {
          return stripParameterSeparators;
        }
      });
      var PARAM_SEPARATOR = "_NEXTSEP_";
      function hasAdjacentParameterIssues(route) {
        if (typeof route !== "string") return false;
        if (/\/\(\.{1,3}\):[^/\s]+/.test(route)) {
          return true;
        }
        if (/:[a-zA-Z_][a-zA-Z0-9_]*:[a-zA-Z_][a-zA-Z0-9_]*/.test(route)) {
          return true;
        }
        return false;
      }
      function normalizeAdjacentParameters(route) {
        let normalized = route;
        normalized = normalized.replace(/(\([^)]*\)):([^/\s]+)/g, `$1${PARAM_SEPARATOR}:$2`);
        normalized = normalized.replace(/:([^:/\s)]+)(?=:)/g, `:$1${PARAM_SEPARATOR}`);
        return normalized;
      }
      function normalizeTokensForRegexp(tokens) {
        return tokens.map((token) => {
          if (typeof token === "object" && token !== null && // Not all token objects have 'modifier' property (e.g., simple text tokens)
          "modifier" in token && // Only repeating modifiers (* or +) cause the validation error
          // Other modifiers like '?' (optional) are fine
          (token.modifier === "*" || token.modifier === "+") && // Token objects can have different shapes depending on route pattern
          "prefix" in token && "suffix" in token && // Both prefix and suffix must be empty strings
          // This is what causes the validation error in path-to-regexp
          token.prefix === "" && token.suffix === "") {
            return {
              ...token,
              prefix: "/"
            };
          }
          return token;
        });
      }
      function stripNormalizedSeparators(pathname) {
        return pathname.replace(new RegExp(`\\)${PARAM_SEPARATOR}`, "g"), ")");
      }
      function stripParameterSeparators(params) {
        const cleaned = {};
        for (const [key, value] of Object.entries(params)) {
          if (typeof value === "string") {
            cleaned[key] = value.replace(new RegExp(`^${PARAM_SEPARATOR}`), "");
          } else if (Array.isArray(value)) {
            cleaned[key] = value.map((item) => typeof item === "string" ? item.replace(new RegExp(`^${PARAM_SEPARATOR}`), "") : item);
          } else {
            cleaned[key] = value;
          }
        }
        return cleaned;
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/route-match-utils.js
  var require_route_match_utils = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/route-match-utils.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        safeCompile: function() {
          return safeCompile;
        },
        safePathToRegexp: function() {
          return safePathToRegexp;
        },
        safeRegexpToFunction: function() {
          return safeRegexpToFunction;
        },
        safeRouteMatcher: function() {
          return safeRouteMatcher;
        }
      });
      var _pathtoregexp = require_path_to_regexp();
      var _routepatternnormalizer = require_route_pattern_normalizer();
      function safePathToRegexp(route, keys, options) {
        if (typeof route !== "string") {
          return (0, _pathtoregexp.pathToRegexp)(route, keys, options);
        }
        const needsNormalization = (0, _routepatternnormalizer.hasAdjacentParameterIssues)(route);
        const routeToUse = needsNormalization ? (0, _routepatternnormalizer.normalizeAdjacentParameters)(route) : route;
        try {
          return (0, _pathtoregexp.pathToRegexp)(routeToUse, keys, options);
        } catch (error) {
          if (!needsNormalization) {
            try {
              const normalizedRoute = (0, _routepatternnormalizer.normalizeAdjacentParameters)(route);
              return (0, _pathtoregexp.pathToRegexp)(normalizedRoute, keys, options);
            } catch (retryError) {
              throw error;
            }
          }
          throw error;
        }
      }
      function safeCompile(route, options) {
        const needsNormalization = (0, _routepatternnormalizer.hasAdjacentParameterIssues)(route);
        const routeToUse = needsNormalization ? (0, _routepatternnormalizer.normalizeAdjacentParameters)(route) : route;
        try {
          const compiler = (0, _pathtoregexp.compile)(routeToUse, options);
          if (needsNormalization) {
            return (params) => {
              return (0, _routepatternnormalizer.stripNormalizedSeparators)(compiler(params));
            };
          }
          return compiler;
        } catch (error) {
          if (!needsNormalization) {
            try {
              const normalizedRoute = (0, _routepatternnormalizer.normalizeAdjacentParameters)(route);
              const compiler = (0, _pathtoregexp.compile)(normalizedRoute, options);
              return (params) => {
                return (0, _routepatternnormalizer.stripNormalizedSeparators)(compiler(params));
              };
            } catch (retryError) {
              throw error;
            }
          }
          throw error;
        }
      }
      function safeRegexpToFunction(regexp, keys) {
        const originalMatcher = (0, _pathtoregexp.regexpToFunction)(regexp, keys || []);
        return (pathname) => {
          const result = originalMatcher(pathname);
          if (!result) return false;
          return {
            ...result,
            params: (0, _routepatternnormalizer.stripParameterSeparators)(result.params)
          };
        };
      }
      function safeRouteMatcher(matcherFn) {
        return (pathname) => {
          const result = matcherFn(pathname);
          if (!result) return false;
          return (0, _routepatternnormalizer.stripParameterSeparators)(result);
        };
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/route-matcher.js
  var require_route_matcher = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/route-matcher.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "getRouteMatcher", {
        enumerable: true,
        get: function() {
          return getRouteMatcher;
        }
      });
      var _utils = require_utils();
      var _routematchutils = require_route_match_utils();
      function getRouteMatcher({ re, groups }) {
        const rawMatcher = (pathname) => {
          const routeMatch = re.exec(pathname);
          if (!routeMatch) return false;
          const decode = (param) => {
            try {
              return decodeURIComponent(param);
            } catch {
              throw Object.defineProperty(new _utils.DecodeError("failed to decode param"), "__NEXT_ERROR_CODE", {
                value: "E528",
                enumerable: false,
                configurable: true
              });
            }
          };
          const params = {};
          for (const [key, group] of Object.entries(groups)) {
            const match = routeMatch[group.pos];
            if (match !== void 0) {
              if (group.repeat) {
                params[key] = match.split("/").map((entry) => decode(entry));
              } else {
                params[key] = decode(match);
              }
            }
          }
          return params;
        };
        return (0, _routematchutils.safeRouteMatcher)(rawMatcher);
      }
    }
  });

  // node_modules/next/dist/lib/constants.js
  var require_constants = __commonJS({
    "node_modules/next/dist/lib/constants.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        ACTION_SUFFIX: function() {
          return ACTION_SUFFIX;
        },
        APP_DIR_ALIAS: function() {
          return APP_DIR_ALIAS;
        },
        CACHE_ONE_YEAR: function() {
          return CACHE_ONE_YEAR;
        },
        DOT_NEXT_ALIAS: function() {
          return DOT_NEXT_ALIAS;
        },
        ESLINT_DEFAULT_DIRS: function() {
          return ESLINT_DEFAULT_DIRS;
        },
        GSP_NO_RETURNED_VALUE: function() {
          return GSP_NO_RETURNED_VALUE;
        },
        GSSP_COMPONENT_MEMBER_ERROR: function() {
          return GSSP_COMPONENT_MEMBER_ERROR;
        },
        GSSP_NO_RETURNED_VALUE: function() {
          return GSSP_NO_RETURNED_VALUE;
        },
        HTML_CONTENT_TYPE_HEADER: function() {
          return HTML_CONTENT_TYPE_HEADER;
        },
        INFINITE_CACHE: function() {
          return INFINITE_CACHE;
        },
        INSTRUMENTATION_HOOK_FILENAME: function() {
          return INSTRUMENTATION_HOOK_FILENAME;
        },
        JSON_CONTENT_TYPE_HEADER: function() {
          return JSON_CONTENT_TYPE_HEADER;
        },
        MATCHED_PATH_HEADER: function() {
          return MATCHED_PATH_HEADER;
        },
        MIDDLEWARE_FILENAME: function() {
          return MIDDLEWARE_FILENAME;
        },
        MIDDLEWARE_LOCATION_REGEXP: function() {
          return MIDDLEWARE_LOCATION_REGEXP;
        },
        NEXT_BODY_SUFFIX: function() {
          return NEXT_BODY_SUFFIX;
        },
        NEXT_CACHE_IMPLICIT_TAG_ID: function() {
          return NEXT_CACHE_IMPLICIT_TAG_ID;
        },
        NEXT_CACHE_REVALIDATED_TAGS_HEADER: function() {
          return NEXT_CACHE_REVALIDATED_TAGS_HEADER;
        },
        NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER: function() {
          return NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER;
        },
        NEXT_CACHE_SOFT_TAG_MAX_LENGTH: function() {
          return NEXT_CACHE_SOFT_TAG_MAX_LENGTH;
        },
        NEXT_CACHE_TAGS_HEADER: function() {
          return NEXT_CACHE_TAGS_HEADER;
        },
        NEXT_CACHE_TAG_MAX_ITEMS: function() {
          return NEXT_CACHE_TAG_MAX_ITEMS;
        },
        NEXT_CACHE_TAG_MAX_LENGTH: function() {
          return NEXT_CACHE_TAG_MAX_LENGTH;
        },
        NEXT_DATA_SUFFIX: function() {
          return NEXT_DATA_SUFFIX;
        },
        NEXT_INTERCEPTION_MARKER_PREFIX: function() {
          return NEXT_INTERCEPTION_MARKER_PREFIX;
        },
        NEXT_META_SUFFIX: function() {
          return NEXT_META_SUFFIX;
        },
        NEXT_QUERY_PARAM_PREFIX: function() {
          return NEXT_QUERY_PARAM_PREFIX;
        },
        NEXT_RESUME_HEADER: function() {
          return NEXT_RESUME_HEADER;
        },
        NON_STANDARD_NODE_ENV: function() {
          return NON_STANDARD_NODE_ENV;
        },
        PAGES_DIR_ALIAS: function() {
          return PAGES_DIR_ALIAS;
        },
        PRERENDER_REVALIDATE_HEADER: function() {
          return PRERENDER_REVALIDATE_HEADER;
        },
        PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER: function() {
          return PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER;
        },
        PROXY_FILENAME: function() {
          return PROXY_FILENAME;
        },
        PROXY_LOCATION_REGEXP: function() {
          return PROXY_LOCATION_REGEXP;
        },
        PUBLIC_DIR_MIDDLEWARE_CONFLICT: function() {
          return PUBLIC_DIR_MIDDLEWARE_CONFLICT;
        },
        ROOT_DIR_ALIAS: function() {
          return ROOT_DIR_ALIAS;
        },
        RSC_ACTION_CLIENT_WRAPPER_ALIAS: function() {
          return RSC_ACTION_CLIENT_WRAPPER_ALIAS;
        },
        RSC_ACTION_ENCRYPTION_ALIAS: function() {
          return RSC_ACTION_ENCRYPTION_ALIAS;
        },
        RSC_ACTION_PROXY_ALIAS: function() {
          return RSC_ACTION_PROXY_ALIAS;
        },
        RSC_ACTION_VALIDATE_ALIAS: function() {
          return RSC_ACTION_VALIDATE_ALIAS;
        },
        RSC_CACHE_WRAPPER_ALIAS: function() {
          return RSC_CACHE_WRAPPER_ALIAS;
        },
        RSC_DYNAMIC_IMPORT_WRAPPER_ALIAS: function() {
          return RSC_DYNAMIC_IMPORT_WRAPPER_ALIAS;
        },
        RSC_MOD_REF_PROXY_ALIAS: function() {
          return RSC_MOD_REF_PROXY_ALIAS;
        },
        RSC_SEGMENTS_DIR_SUFFIX: function() {
          return RSC_SEGMENTS_DIR_SUFFIX;
        },
        RSC_SEGMENT_SUFFIX: function() {
          return RSC_SEGMENT_SUFFIX;
        },
        RSC_SUFFIX: function() {
          return RSC_SUFFIX;
        },
        SERVER_PROPS_EXPORT_ERROR: function() {
          return SERVER_PROPS_EXPORT_ERROR;
        },
        SERVER_PROPS_GET_INIT_PROPS_CONFLICT: function() {
          return SERVER_PROPS_GET_INIT_PROPS_CONFLICT;
        },
        SERVER_PROPS_SSG_CONFLICT: function() {
          return SERVER_PROPS_SSG_CONFLICT;
        },
        SERVER_RUNTIME: function() {
          return SERVER_RUNTIME;
        },
        SSG_FALLBACK_EXPORT_ERROR: function() {
          return SSG_FALLBACK_EXPORT_ERROR;
        },
        SSG_GET_INITIAL_PROPS_CONFLICT: function() {
          return SSG_GET_INITIAL_PROPS_CONFLICT;
        },
        STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR: function() {
          return STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR;
        },
        TEXT_PLAIN_CONTENT_TYPE_HEADER: function() {
          return TEXT_PLAIN_CONTENT_TYPE_HEADER;
        },
        UNSTABLE_REVALIDATE_RENAME_ERROR: function() {
          return UNSTABLE_REVALIDATE_RENAME_ERROR;
        },
        WEBPACK_LAYERS: function() {
          return WEBPACK_LAYERS;
        },
        WEBPACK_RESOURCE_QUERIES: function() {
          return WEBPACK_RESOURCE_QUERIES;
        },
        WEB_SOCKET_MAX_RECONNECTIONS: function() {
          return WEB_SOCKET_MAX_RECONNECTIONS;
        }
      });
      var TEXT_PLAIN_CONTENT_TYPE_HEADER = "text/plain";
      var HTML_CONTENT_TYPE_HEADER = "text/html; charset=utf-8";
      var JSON_CONTENT_TYPE_HEADER = "application/json; charset=utf-8";
      var NEXT_QUERY_PARAM_PREFIX = "nxtP";
      var NEXT_INTERCEPTION_MARKER_PREFIX = "nxtI";
      var MATCHED_PATH_HEADER = "x-matched-path";
      var PRERENDER_REVALIDATE_HEADER = "x-prerender-revalidate";
      var PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER = "x-prerender-revalidate-if-generated";
      var RSC_SEGMENTS_DIR_SUFFIX = ".segments";
      var RSC_SEGMENT_SUFFIX = ".segment.rsc";
      var RSC_SUFFIX = ".rsc";
      var ACTION_SUFFIX = ".action";
      var NEXT_DATA_SUFFIX = ".json";
      var NEXT_META_SUFFIX = ".meta";
      var NEXT_BODY_SUFFIX = ".body";
      var NEXT_CACHE_TAGS_HEADER = "x-next-cache-tags";
      var NEXT_CACHE_REVALIDATED_TAGS_HEADER = "x-next-revalidated-tags";
      var NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER = "x-next-revalidate-tag-token";
      var NEXT_RESUME_HEADER = "next-resume";
      var NEXT_CACHE_TAG_MAX_ITEMS = 128;
      var NEXT_CACHE_TAG_MAX_LENGTH = 256;
      var NEXT_CACHE_SOFT_TAG_MAX_LENGTH = 1024;
      var NEXT_CACHE_IMPLICIT_TAG_ID = "_N_T_";
      var CACHE_ONE_YEAR = 31536e3;
      var INFINITE_CACHE = 4294967294;
      var MIDDLEWARE_FILENAME = "middleware";
      var MIDDLEWARE_LOCATION_REGEXP = `(?:src/)?${MIDDLEWARE_FILENAME}`;
      var PROXY_FILENAME = "proxy";
      var PROXY_LOCATION_REGEXP = `(?:src/)?${PROXY_FILENAME}`;
      var INSTRUMENTATION_HOOK_FILENAME = "instrumentation";
      var PAGES_DIR_ALIAS = "private-next-pages";
      var DOT_NEXT_ALIAS = "private-dot-next";
      var ROOT_DIR_ALIAS = "private-next-root-dir";
      var APP_DIR_ALIAS = "private-next-app-dir";
      var RSC_MOD_REF_PROXY_ALIAS = "private-next-rsc-mod-ref-proxy";
      var RSC_ACTION_VALIDATE_ALIAS = "private-next-rsc-action-validate";
      var RSC_ACTION_PROXY_ALIAS = "private-next-rsc-server-reference";
      var RSC_CACHE_WRAPPER_ALIAS = "private-next-rsc-cache-wrapper";
      var RSC_DYNAMIC_IMPORT_WRAPPER_ALIAS = "private-next-rsc-track-dynamic-import";
      var RSC_ACTION_ENCRYPTION_ALIAS = "private-next-rsc-action-encryption";
      var RSC_ACTION_CLIENT_WRAPPER_ALIAS = "private-next-rsc-action-client-wrapper";
      var PUBLIC_DIR_MIDDLEWARE_CONFLICT = `You can not have a '_next' folder inside of your public folder. This conflicts with the internal '/_next' route. https://nextjs.org/docs/messages/public-next-folder-conflict`;
      var SSG_GET_INITIAL_PROPS_CONFLICT = `You can not use getInitialProps with getStaticProps. To use SSG, please remove your getInitialProps`;
      var SERVER_PROPS_GET_INIT_PROPS_CONFLICT = `You can not use getInitialProps with getServerSideProps. Please remove getInitialProps.`;
      var SERVER_PROPS_SSG_CONFLICT = `You can not use getStaticProps or getStaticPaths with getServerSideProps. To use SSG, please remove getServerSideProps`;
      var STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR = `can not have getInitialProps/getServerSideProps, https://nextjs.org/docs/messages/404-get-initial-props`;
      var SERVER_PROPS_EXPORT_ERROR = `pages with \`getServerSideProps\` can not be exported. See more info here: https://nextjs.org/docs/messages/gssp-export`;
      var GSP_NO_RETURNED_VALUE = "Your `getStaticProps` function did not return an object. Did you forget to add a `return`?";
      var GSSP_NO_RETURNED_VALUE = "Your `getServerSideProps` function did not return an object. Did you forget to add a `return`?";
      var UNSTABLE_REVALIDATE_RENAME_ERROR = "The `unstable_revalidate` property is available for general use.\nPlease use `revalidate` instead.";
      var GSSP_COMPONENT_MEMBER_ERROR = `can not be attached to a page's component and must be exported from the page. See more info here: https://nextjs.org/docs/messages/gssp-component-member`;
      var NON_STANDARD_NODE_ENV = `You are using a non-standard "NODE_ENV" value in your environment. This creates inconsistencies in the project and is strongly advised against. Read more: https://nextjs.org/docs/messages/non-standard-node-env`;
      var SSG_FALLBACK_EXPORT_ERROR = `Pages with \`fallback\` enabled in \`getStaticPaths\` can not be exported. See more info here: https://nextjs.org/docs/messages/ssg-fallback-true-export`;
      var ESLINT_DEFAULT_DIRS = [
        "app",
        "pages",
        "components",
        "lib",
        "src"
      ];
      var SERVER_RUNTIME = {
        edge: "edge",
        experimentalEdge: "experimental-edge",
        nodejs: "nodejs"
      };
      var WEB_SOCKET_MAX_RECONNECTIONS = 12;
      var WEBPACK_LAYERS_NAMES = {
        /**
        * The layer for the shared code between the client and server bundles.
        */
        shared: "shared",
        /**
        * The layer for server-only runtime and picking up `react-server` export conditions.
        * Including app router RSC pages and app router custom routes and metadata routes.
        */
        reactServerComponents: "rsc",
        /**
        * Server Side Rendering layer for app (ssr).
        */
        serverSideRendering: "ssr",
        /**
        * The browser client bundle layer for actions.
        */
        actionBrowser: "action-browser",
        /**
        * The Node.js bundle layer for the API routes.
        */
        apiNode: "api-node",
        /**
        * The Edge Lite bundle layer for the API routes.
        */
        apiEdge: "api-edge",
        /**
        * The layer for the middleware code.
        */
        middleware: "middleware",
        /**
        * The layer for the instrumentation hooks.
        */
        instrument: "instrument",
        /**
        * The layer for assets on the edge.
        */
        edgeAsset: "edge-asset",
        /**
        * The browser client bundle layer for App directory.
        */
        appPagesBrowser: "app-pages-browser",
        /**
        * The browser client bundle layer for Pages directory.
        */
        pagesDirBrowser: "pages-dir-browser",
        /**
        * The Edge Lite bundle layer for Pages directory.
        */
        pagesDirEdge: "pages-dir-edge",
        /**
        * The Node.js bundle layer for Pages directory.
        */
        pagesDirNode: "pages-dir-node"
      };
      var WEBPACK_LAYERS = {
        ...WEBPACK_LAYERS_NAMES,
        GROUP: {
          builtinReact: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser
          ],
          serverOnly: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser,
            WEBPACK_LAYERS_NAMES.instrument,
            WEBPACK_LAYERS_NAMES.middleware
          ],
          neutralTarget: [
            // pages api
            WEBPACK_LAYERS_NAMES.apiNode,
            WEBPACK_LAYERS_NAMES.apiEdge
          ],
          clientOnly: [
            WEBPACK_LAYERS_NAMES.serverSideRendering,
            WEBPACK_LAYERS_NAMES.appPagesBrowser
          ],
          bundled: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser,
            WEBPACK_LAYERS_NAMES.serverSideRendering,
            WEBPACK_LAYERS_NAMES.appPagesBrowser,
            WEBPACK_LAYERS_NAMES.shared,
            WEBPACK_LAYERS_NAMES.instrument,
            WEBPACK_LAYERS_NAMES.middleware
          ],
          appPages: [
            // app router pages and layouts
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.serverSideRendering,
            WEBPACK_LAYERS_NAMES.appPagesBrowser,
            WEBPACK_LAYERS_NAMES.actionBrowser
          ]
        }
      };
      var WEBPACK_RESOURCE_QUERIES = {
        edgeSSREntry: "__next_edge_ssr_entry__",
        metadata: "__next_metadata__",
        metadataRoute: "__next_metadata_route__",
        metadataImageMeta: "__next_metadata_image_meta__"
      };
    }
  });

  // node_modules/next/dist/shared/lib/escape-regexp.js
  var require_escape_regexp = __commonJS({
    "node_modules/next/dist/shared/lib/escape-regexp.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "escapeStringRegexp", {
        enumerable: true,
        get: function() {
          return escapeStringRegexp;
        }
      });
      var reHasRegExp = /[|\\{}()[\]^$+*?.-]/;
      var reReplaceRegExp = /[|\\{}()[\]^$+*?.-]/g;
      function escapeStringRegexp(str) {
        if (reHasRegExp.test(str)) {
          return str.replace(reReplaceRegExp, "\\$&");
        }
        return str;
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/parse-loader-tree.js
  var require_parse_loader_tree = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/parse-loader-tree.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "parseLoaderTree", {
        enumerable: true,
        get: function() {
          return parseLoaderTree;
        }
      });
      var _segment = require_segment();
      function parseLoaderTree(tree) {
        const [segment, parallelRoutes, modules] = tree;
        const { layout, template } = modules;
        let { page } = modules;
        page = segment === _segment.DEFAULT_SEGMENT_KEY ? modules.defaultPage : page;
        const conventionPath = layout?.[1] || template?.[1] || page?.[1];
        return {
          page,
          segment,
          modules,
          /* it can be either layout / template / page */
          conventionPath,
          parallelRoutes
        };
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/get-segment-param.js
  var require_get_segment_param = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/get-segment-param.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        getParamProperties: function() {
          return getParamProperties;
        },
        getSegmentParam: function() {
          return getSegmentParam;
        },
        isCatchAll: function() {
          return isCatchAll;
        }
      });
      var _interceptionroutes = require_interception_routes();
      function getSegmentParam(segment) {
        const interceptionMarker = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.find((marker) => segment.startsWith(marker));
        if (interceptionMarker) {
          segment = segment.slice(interceptionMarker.length);
        }
        if (segment.startsWith("[[...") && segment.endsWith("]]")) {
          return {
            // TODO-APP: Optional catchall does not currently work with parallel routes,
            // so for now aren't handling a potential interception marker.
            paramType: "optional-catchall",
            paramName: segment.slice(5, -2)
          };
        }
        if (segment.startsWith("[...") && segment.endsWith("]")) {
          return {
            paramType: interceptionMarker ? `catchall-intercepted-${interceptionMarker}` : "catchall",
            paramName: segment.slice(4, -1)
          };
        }
        if (segment.startsWith("[") && segment.endsWith("]")) {
          return {
            paramType: interceptionMarker ? `dynamic-intercepted-${interceptionMarker}` : "dynamic",
            paramName: segment.slice(1, -1)
          };
        }
        return null;
      }
      function isCatchAll(type) {
        return type === "catchall" || type === "catchall-intercepted-(..)(..)" || type === "catchall-intercepted-(.)" || type === "catchall-intercepted-(..)" || type === "catchall-intercepted-(...)" || type === "optional-catchall";
      }
      function getParamProperties(paramType) {
        let repeat = false;
        let optional = false;
        switch (paramType) {
          case "catchall":
          case "catchall-intercepted-(..)(..)":
          case "catchall-intercepted-(.)":
          case "catchall-intercepted-(..)":
          case "catchall-intercepted-(...)":
            repeat = true;
            break;
          case "optional-catchall":
            repeat = true;
            optional = true;
            break;
          case "dynamic":
          case "dynamic-intercepted-(..)(..)":
          case "dynamic-intercepted-(.)":
          case "dynamic-intercepted-(..)":
          case "dynamic-intercepted-(...)":
            break;
          default:
            paramType;
        }
        return {
          repeat,
          optional
        };
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/routes/app.js
  var require_app = __commonJS({
    "node_modules/next/dist/shared/lib/router/routes/app.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        isInterceptionAppRoute: function() {
          return isInterceptionAppRoute;
        },
        isNormalizedAppRoute: function() {
          return isNormalizedAppRoute;
        },
        parseAppRoute: function() {
          return parseAppRoute;
        },
        parseAppRouteSegment: function() {
          return parseAppRouteSegment;
        }
      });
      var _invarianterror = require_invariant_error();
      var _getsegmentparam = require_get_segment_param();
      var _interceptionroutes = require_interception_routes();
      function parseAppRouteSegment(segment) {
        if (segment === "") {
          return null;
        }
        const interceptionMarker = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.find((m) => segment.startsWith(m));
        const param = (0, _getsegmentparam.getSegmentParam)(segment);
        if (param) {
          return {
            type: "dynamic",
            name: segment,
            param,
            interceptionMarker
          };
        } else if (segment.startsWith("(") && segment.endsWith(")")) {
          return {
            type: "route-group",
            name: segment,
            interceptionMarker
          };
        } else if (segment.startsWith("@")) {
          return {
            type: "parallel-route",
            name: segment,
            interceptionMarker
          };
        } else {
          return {
            type: "static",
            name: segment,
            interceptionMarker
          };
        }
      }
      function isNormalizedAppRoute(route) {
        return route.normalized;
      }
      function isInterceptionAppRoute(route) {
        return route.interceptionMarker !== void 0 && route.interceptingRoute !== void 0 && route.interceptedRoute !== void 0;
      }
      function parseAppRoute(pathname, normalized) {
        const pathnameSegments = pathname.split("/").filter(Boolean);
        const segments = [];
        let interceptionMarker;
        let interceptingRoute;
        let interceptedRoute;
        for (const segment of pathnameSegments) {
          const appSegment = parseAppRouteSegment(segment);
          if (!appSegment) {
            continue;
          }
          if (normalized && (appSegment.type === "route-group" || appSegment.type === "parallel-route")) {
            throw Object.defineProperty(new _invarianterror.InvariantError(`${pathname} is being parsed as a normalized route, but it has a route group or parallel route segment.`), "__NEXT_ERROR_CODE", {
              value: "E923",
              enumerable: false,
              configurable: true
            });
          }
          segments.push(appSegment);
          if (appSegment.interceptionMarker) {
            const parts = pathname.split(appSegment.interceptionMarker);
            if (parts.length !== 2) {
              throw Object.defineProperty(new Error(`Invalid interception route: ${pathname}`), "__NEXT_ERROR_CODE", {
                value: "E924",
                enumerable: false,
                configurable: true
              });
            }
            interceptingRoute = normalized ? parseAppRoute(parts[0], true) : parseAppRoute(parts[0], false);
            interceptedRoute = normalized ? parseAppRoute(parts[1], true) : parseAppRoute(parts[1], false);
            interceptionMarker = appSegment.interceptionMarker;
          }
        }
        const dynamicSegments = segments.filter((segment) => segment.type === "dynamic");
        return {
          normalized,
          pathname,
          segments,
          dynamicSegments,
          interceptionMarker,
          interceptingRoute,
          interceptedRoute
        };
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/interception-prefix-from-param-type.js
  var require_interception_prefix_from_param_type = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/interception-prefix-from-param-type.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "interceptionPrefixFromParamType", {
        enumerable: true,
        get: function() {
          return interceptionPrefixFromParamType;
        }
      });
      function interceptionPrefixFromParamType(paramType) {
        switch (paramType) {
          case "catchall-intercepted-(..)(..)":
          case "dynamic-intercepted-(..)(..)":
            return "(..)(..)";
          case "catchall-intercepted-(.)":
          case "dynamic-intercepted-(.)":
            return "(.)";
          case "catchall-intercepted-(..)":
          case "dynamic-intercepted-(..)":
            return "(..)";
          case "catchall-intercepted-(...)":
          case "dynamic-intercepted-(...)":
            return "(...)";
          case "catchall":
          case "dynamic":
          case "optional-catchall":
          default:
            return null;
        }
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/resolve-param-value.js
  var require_resolve_param_value = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/resolve-param-value.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "resolveParamValue", {
        enumerable: true,
        get: function() {
          return resolveParamValue;
        }
      });
      var _invarianterror = require_invariant_error();
      var _interceptionprefixfromparamtype = require_interception_prefix_from_param_type();
      function getParamValueFromSegment(pathSegment, params, paramType) {
        if (pathSegment.type === "dynamic") {
          return params[pathSegment.param.paramName];
        }
        const interceptionPrefix = (0, _interceptionprefixfromparamtype.interceptionPrefixFromParamType)(paramType);
        if (interceptionPrefix === pathSegment.interceptionMarker) {
          return pathSegment.name.replace(pathSegment.interceptionMarker, "");
        }
        return pathSegment.name;
      }
      function resolveParamValue(paramName, paramType, depth, route, params) {
        switch (paramType) {
          case "catchall":
          case "optional-catchall":
          case "catchall-intercepted-(..)(..)":
          case "catchall-intercepted-(.)":
          case "catchall-intercepted-(..)":
          case "catchall-intercepted-(...)":
            const processedSegments = [];
            for (let index2 = depth; index2 < route.segments.length; index2++) {
              const pathSegment = route.segments[index2];
              if (pathSegment.type === "static") {
                let value = pathSegment.name;
                const interceptionPrefix = (0, _interceptionprefixfromparamtype.interceptionPrefixFromParamType)(paramType);
                if (interceptionPrefix && index2 === depth && interceptionPrefix === pathSegment.interceptionMarker) {
                  value = value.replace(pathSegment.interceptionMarker, "");
                }
                processedSegments.push(value);
              } else {
                if (!params.hasOwnProperty(pathSegment.param.paramName)) {
                  if (pathSegment.param.paramType === "optional-catchall") {
                    break;
                  }
                  return void 0;
                }
                const paramValue = params[pathSegment.param.paramName];
                if (Array.isArray(paramValue)) {
                  processedSegments.push(...paramValue);
                } else {
                  processedSegments.push(paramValue);
                }
              }
            }
            if (processedSegments.length > 0) {
              return processedSegments;
            } else if (paramType === "optional-catchall") {
              return void 0;
            } else {
              throw Object.defineProperty(new _invarianterror.InvariantError(`Unexpected empty path segments match for a route "${route.pathname}" with param "${paramName}" of type "${paramType}"`), "__NEXT_ERROR_CODE", {
                value: "E931",
                enumerable: false,
                configurable: true
              });
            }
          case "dynamic":
          case "dynamic-intercepted-(..)(..)":
          case "dynamic-intercepted-(.)":
          case "dynamic-intercepted-(..)":
          case "dynamic-intercepted-(...)":
            if (depth < route.segments.length) {
              const pathSegment = route.segments[depth];
              if (pathSegment.type === "dynamic" && !params.hasOwnProperty(pathSegment.param.paramName)) {
                return void 0;
              }
              return getParamValueFromSegment(pathSegment, params, paramType);
            }
            return void 0;
          default:
            paramType;
        }
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/get-dynamic-param.js
  var require_get_dynamic_param = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/get-dynamic-param.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        PARAMETER_PATTERN: function() {
          return PARAMETER_PATTERN;
        },
        getDynamicParam: function() {
          return getDynamicParam;
        },
        interpolateParallelRouteParams: function() {
          return interpolateParallelRouteParams;
        },
        parseMatchedParameter: function() {
          return parseMatchedParameter;
        },
        parseParameter: function() {
          return parseParameter;
        }
      });
      var _invarianterror = require_invariant_error();
      var _parseloadertree = require_parse_loader_tree();
      var _app = require_app();
      var _resolveparamvalue = require_resolve_param_value();
      function getParamValue(interpolatedParams, segmentKey, fallbackRouteParams) {
        let value = interpolatedParams[segmentKey];
        if (fallbackRouteParams?.has(segmentKey)) {
          const [searchValue] = fallbackRouteParams.get(segmentKey);
          value = searchValue;
        } else if (Array.isArray(value)) {
          value = value.map((i) => encodeURIComponent(i));
        } else if (typeof value === "string") {
          value = encodeURIComponent(value);
        }
        return value;
      }
      function interpolateParallelRouteParams(loaderTree, params, pagePath, fallbackRouteParams) {
        const interpolated = structuredClone(params);
        const stack = [
          {
            tree: loaderTree,
            depth: 0
          }
        ];
        const route = (0, _app.parseAppRoute)(pagePath, true);
        while (stack.length > 0) {
          const { tree, depth } = stack.pop();
          const { segment, parallelRoutes } = (0, _parseloadertree.parseLoaderTree)(tree);
          const appSegment = (0, _app.parseAppRouteSegment)(segment);
          if (appSegment?.type === "dynamic" && !interpolated.hasOwnProperty(appSegment.param.paramName) && // If the param is in the fallback route params, we don't need to
          // interpolate it because it's already marked as being unknown.
          !fallbackRouteParams?.has(appSegment.param.paramName)) {
            const { paramName, paramType } = appSegment.param;
            const paramValue = (0, _resolveparamvalue.resolveParamValue)(paramName, paramType, depth, route, interpolated);
            if (paramValue !== void 0) {
              interpolated[paramName] = paramValue;
            } else if (paramType !== "optional-catchall") {
              throw Object.defineProperty(new _invarianterror.InvariantError(`Could not resolve param value for segment: ${paramName}`), "__NEXT_ERROR_CODE", {
                value: "E932",
                enumerable: false,
                configurable: true
              });
            }
          }
          let nextDepth = depth;
          if (appSegment && appSegment.type !== "route-group" && appSegment.type !== "parallel-route") {
            nextDepth++;
          }
          for (const parallelRoute of Object.values(parallelRoutes)) {
            stack.push({
              tree: parallelRoute,
              depth: nextDepth
            });
          }
        }
        return interpolated;
      }
      function getDynamicParam(interpolatedParams, segmentKey, dynamicParamType, fallbackRouteParams) {
        let value = getParamValue(interpolatedParams, segmentKey, fallbackRouteParams);
        if (!value || value.length === 0) {
          if (dynamicParamType === "oc") {
            return {
              param: segmentKey,
              value: null,
              type: dynamicParamType,
              treeSegment: [
                segmentKey,
                "",
                dynamicParamType
              ]
            };
          }
          throw Object.defineProperty(new _invarianterror.InvariantError(`Missing value for segment key: "${segmentKey}" with dynamic param type: ${dynamicParamType}`), "__NEXT_ERROR_CODE", {
            value: "E864",
            enumerable: false,
            configurable: true
          });
        }
        return {
          param: segmentKey,
          // The value that is passed to user code.
          value,
          // The value that is rendered in the router tree.
          treeSegment: [
            segmentKey,
            Array.isArray(value) ? value.join("/") : value,
            dynamicParamType
          ],
          type: dynamicParamType
        };
      }
      var PARAMETER_PATTERN = /^([^[]*)\[((?:\[[^\]]*\])|[^\]]+)\](.*)$/;
      function parseParameter(param) {
        const match = param.match(PARAMETER_PATTERN);
        if (!match) {
          return parseMatchedParameter(param);
        }
        return parseMatchedParameter(match[2]);
      }
      function parseMatchedParameter(param) {
        const optional = param.startsWith("[") && param.endsWith("]");
        if (optional) {
          param = param.slice(1, -1);
        }
        const repeat = param.startsWith("...");
        if (repeat) {
          param = param.slice(3);
        }
        return {
          key: param,
          repeat,
          optional
        };
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/route-regex.js
  var require_route_regex = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/route-regex.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        getNamedMiddlewareRegex: function() {
          return getNamedMiddlewareRegex;
        },
        getNamedRouteRegex: function() {
          return getNamedRouteRegex;
        },
        getRouteRegex: function() {
          return getRouteRegex;
        }
      });
      var _constants = require_constants();
      var _interceptionroutes = require_interception_routes();
      var _escaperegexp = require_escape_regexp();
      var _removetrailingslash = require_remove_trailing_slash();
      var _getdynamicparam = require_get_dynamic_param();
      function getParametrizedRoute(route, includeSuffix, includePrefix) {
        const groups = {};
        let groupIndex = 1;
        const segments = [];
        for (const segment of (0, _removetrailingslash.removeTrailingSlash)(route).slice(1).split("/")) {
          const markerMatch = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.find((m) => segment.startsWith(m));
          const paramMatches = segment.match(_getdynamicparam.PARAMETER_PATTERN);
          if (markerMatch && paramMatches && paramMatches[2]) {
            const { key, optional, repeat } = (0, _getdynamicparam.parseMatchedParameter)(paramMatches[2]);
            groups[key] = {
              pos: groupIndex++,
              repeat,
              optional
            };
            segments.push(`/${(0, _escaperegexp.escapeStringRegexp)(markerMatch)}([^/]+?)`);
          } else if (paramMatches && paramMatches[2]) {
            const { key, repeat, optional } = (0, _getdynamicparam.parseMatchedParameter)(paramMatches[2]);
            groups[key] = {
              pos: groupIndex++,
              repeat,
              optional
            };
            if (includePrefix && paramMatches[1]) {
              segments.push(`/${(0, _escaperegexp.escapeStringRegexp)(paramMatches[1])}`);
            }
            let s = repeat ? optional ? "(?:/(.+?))?" : "/(.+?)" : "/([^/]+?)";
            if (includePrefix && paramMatches[1]) {
              s = s.substring(1);
            }
            segments.push(s);
          } else {
            segments.push(`/${(0, _escaperegexp.escapeStringRegexp)(segment)}`);
          }
          if (includeSuffix && paramMatches && paramMatches[3]) {
            segments.push((0, _escaperegexp.escapeStringRegexp)(paramMatches[3]));
          }
        }
        return {
          parameterizedRoute: segments.join(""),
          groups
        };
      }
      function getRouteRegex(normalizedRoute, { includeSuffix = false, includePrefix = false, excludeOptionalTrailingSlash = false } = {}) {
        const { parameterizedRoute, groups } = getParametrizedRoute(normalizedRoute, includeSuffix, includePrefix);
        let re = parameterizedRoute;
        if (!excludeOptionalTrailingSlash) {
          re += "(?:/)?";
        }
        return {
          re: new RegExp(`^${re}$`),
          groups
        };
      }
      function buildGetSafeRouteKey() {
        let i = 0;
        return () => {
          let routeKey = "";
          let j = ++i;
          while (j > 0) {
            routeKey += String.fromCharCode(97 + (j - 1) % 26);
            j = Math.floor((j - 1) / 26);
          }
          return routeKey;
        };
      }
      function getSafeKeyFromSegment({ interceptionMarker, getSafeRouteKey, segment, routeKeys, keyPrefix, backreferenceDuplicateKeys }) {
        const { key, optional, repeat } = (0, _getdynamicparam.parseMatchedParameter)(segment);
        let cleanedKey = key.replace(/\W/g, "");
        if (keyPrefix) {
          cleanedKey = `${keyPrefix}${cleanedKey}`;
        }
        let invalidKey = false;
        if (cleanedKey.length === 0 || cleanedKey.length > 30) {
          invalidKey = true;
        }
        if (!isNaN(parseInt(cleanedKey.slice(0, 1)))) {
          invalidKey = true;
        }
        if (invalidKey) {
          cleanedKey = getSafeRouteKey();
        }
        const duplicateKey = cleanedKey in routeKeys;
        if (keyPrefix) {
          routeKeys[cleanedKey] = `${keyPrefix}${key}`;
        } else {
          routeKeys[cleanedKey] = key;
        }
        const interceptionPrefix = interceptionMarker ? (0, _escaperegexp.escapeStringRegexp)(interceptionMarker) : "";
        let pattern;
        if (duplicateKey && backreferenceDuplicateKeys) {
          pattern = `\\k<${cleanedKey}>`;
        } else if (repeat) {
          pattern = `(?<${cleanedKey}>.+?)`;
        } else {
          pattern = `(?<${cleanedKey}>[^/]+?)`;
        }
        return {
          key,
          pattern: optional ? `(?:/${interceptionPrefix}${pattern})?` : `/${interceptionPrefix}${pattern}`,
          cleanedKey,
          optional,
          repeat
        };
      }
      function getNamedParametrizedRoute(route, prefixRouteKeys, includeSuffix, includePrefix, backreferenceDuplicateKeys, reference = {
        names: {},
        intercepted: {}
      }) {
        const getSafeRouteKey = buildGetSafeRouteKey();
        const routeKeys = {};
        const segments = [];
        const inverseParts = [];
        reference = structuredClone(reference);
        for (const segment of (0, _removetrailingslash.removeTrailingSlash)(route).slice(1).split("/")) {
          const hasInterceptionMarker = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.some((m) => segment.startsWith(m));
          const paramMatches = segment.match(_getdynamicparam.PARAMETER_PATTERN);
          const interceptionMarker = hasInterceptionMarker ? paramMatches?.[1] : void 0;
          let keyPrefix;
          if (interceptionMarker && paramMatches?.[2]) {
            keyPrefix = prefixRouteKeys ? _constants.NEXT_INTERCEPTION_MARKER_PREFIX : void 0;
            reference.intercepted[paramMatches[2]] = interceptionMarker;
          } else if (paramMatches?.[2] && reference.intercepted[paramMatches[2]]) {
            keyPrefix = prefixRouteKeys ? _constants.NEXT_INTERCEPTION_MARKER_PREFIX : void 0;
          } else {
            keyPrefix = prefixRouteKeys ? _constants.NEXT_QUERY_PARAM_PREFIX : void 0;
          }
          if (interceptionMarker && paramMatches && paramMatches[2]) {
            const { key, pattern, cleanedKey, repeat, optional } = getSafeKeyFromSegment({
              getSafeRouteKey,
              interceptionMarker,
              segment: paramMatches[2],
              routeKeys,
              keyPrefix,
              backreferenceDuplicateKeys
            });
            segments.push(pattern);
            inverseParts.push(`/${paramMatches[1]}:${reference.names[key] ?? cleanedKey}${repeat ? optional ? "*" : "+" : ""}`);
            reference.names[key] ??= cleanedKey;
          } else if (paramMatches && paramMatches[2]) {
            if (includePrefix && paramMatches[1]) {
              segments.push(`/${(0, _escaperegexp.escapeStringRegexp)(paramMatches[1])}`);
              inverseParts.push(`/${paramMatches[1]}`);
            }
            const { key, pattern, cleanedKey, repeat, optional } = getSafeKeyFromSegment({
              getSafeRouteKey,
              segment: paramMatches[2],
              routeKeys,
              keyPrefix,
              backreferenceDuplicateKeys
            });
            let s = pattern;
            if (includePrefix && paramMatches[1]) {
              s = s.substring(1);
            }
            segments.push(s);
            inverseParts.push(`/:${reference.names[key] ?? cleanedKey}${repeat ? optional ? "*" : "+" : ""}`);
            reference.names[key] ??= cleanedKey;
          } else {
            segments.push(`/${(0, _escaperegexp.escapeStringRegexp)(segment)}`);
            inverseParts.push(`/${segment}`);
          }
          if (includeSuffix && paramMatches && paramMatches[3]) {
            segments.push((0, _escaperegexp.escapeStringRegexp)(paramMatches[3]));
            inverseParts.push(paramMatches[3]);
          }
        }
        return {
          namedParameterizedRoute: segments.join(""),
          routeKeys,
          pathToRegexpPattern: inverseParts.join(""),
          reference
        };
      }
      function getNamedRouteRegex(normalizedRoute, options) {
        const result = getNamedParametrizedRoute(normalizedRoute, options.prefixRouteKeys, options.includeSuffix ?? false, options.includePrefix ?? false, options.backreferenceDuplicateKeys ?? false, options.reference);
        let namedRegex = result.namedParameterizedRoute;
        if (!options.excludeOptionalTrailingSlash) {
          namedRegex += "(?:/)?";
        }
        return {
          ...getRouteRegex(normalizedRoute, options),
          namedRegex: `^${namedRegex}$`,
          routeKeys: result.routeKeys,
          pathToRegexpPattern: result.pathToRegexpPattern,
          reference: result.reference
        };
      }
      function getNamedMiddlewareRegex(normalizedRoute, options) {
        const { parameterizedRoute } = getParametrizedRoute(normalizedRoute, false, false);
        const { catchAll = true } = options;
        if (parameterizedRoute === "/") {
          let catchAllRegex = catchAll ? ".*" : "";
          return {
            namedRegex: `^/${catchAllRegex}$`
          };
        }
        const { namedParameterizedRoute } = getNamedParametrizedRoute(normalizedRoute, false, false, false, false, void 0);
        let catchAllGroupedRegex = catchAll ? "(?:(/.*)?)" : "";
        return {
          namedRegex: `^${namedParameterizedRoute}${catchAllGroupedRegex}$`
        };
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/interpolate-as.js
  var require_interpolate_as = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/interpolate-as.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "interpolateAs", {
        enumerable: true,
        get: function() {
          return interpolateAs;
        }
      });
      var _routematcher = require_route_matcher();
      var _routeregex = require_route_regex();
      function interpolateAs(route, asPathname, query) {
        let interpolatedRoute = "";
        const dynamicRegex = (0, _routeregex.getRouteRegex)(route);
        const dynamicGroups = dynamicRegex.groups;
        const dynamicMatches = (
          // Try to match the dynamic route against the asPath
          (asPathname !== route ? (0, _routematcher.getRouteMatcher)(dynamicRegex)(asPathname) : "") || // Fall back to reading the values from the href
          // TODO: should this take priority; also need to change in the router.
          query
        );
        interpolatedRoute = route;
        const params = Object.keys(dynamicGroups);
        if (!params.every((param) => {
          let value = dynamicMatches[param] || "";
          const { repeat, optional } = dynamicGroups[param];
          let replaced = `[${repeat ? "..." : ""}${param}]`;
          if (optional) {
            replaced = `${!value ? "/" : ""}[${replaced}]`;
          }
          if (repeat && !Array.isArray(value)) value = [
            value
          ];
          return (optional || param in dynamicMatches) && // Interpolate group into data URL if present
          (interpolatedRoute = interpolatedRoute.replace(replaced, repeat ? value.map(
            // these values should be fully encoded instead of just
            // path delimiter escaped since they are being inserted
            // into the URL and we expect URL encoded segments
            // when parsing dynamic route params
            (segment) => encodeURIComponent(segment)
          ).join("/") : encodeURIComponent(value)) || "/");
        })) {
          interpolatedRoute = "";
        }
        return {
          params,
          result: interpolatedRoute
        };
      }
    }
  });

  // node_modules/next/dist/client/resolve-href.js
  var require_resolve_href = __commonJS({
    "node_modules/next/dist/client/resolve-href.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "resolveHref", {
        enumerable: true,
        get: function() {
          return resolveHref;
        }
      });
      var _querystring = require_querystring();
      var _formaturl = require_format_url();
      var _omit = require_omit();
      var _utils = require_utils();
      var _normalizetrailingslash = require_normalize_trailing_slash();
      var _islocalurl = require_is_local_url();
      var _utils1 = require_utils2();
      var _interpolateas = require_interpolate_as();
      var _routeregex = require_route_regex();
      var _routematcher = require_route_matcher();
      function resolveHref(router, href, resolveAs) {
        let base;
        let urlAsString = typeof href === "string" ? href : (0, _formaturl.formatWithValidation)(href);
        const urlProtoMatch = urlAsString.match(/^[a-z][a-z0-9+.-]*:\/\//i);
        const urlAsStringNoProto = urlProtoMatch ? urlAsString.slice(urlProtoMatch[0].length) : urlAsString;
        const urlParts = urlAsStringNoProto.split("?", 1);
        if ((urlParts[0] || "").match(/(\/\/|\\)/)) {
          console.error(`Invalid href '${urlAsString}' passed to next/router in page: '${router.pathname}'. Repeated forward-slashes (//) or backslashes \\ are not valid in the href.`);
          const normalizedUrl = (0, _utils.normalizeRepeatedSlashes)(urlAsStringNoProto);
          urlAsString = (urlProtoMatch ? urlProtoMatch[0] : "") + normalizedUrl;
        }
        if (!(0, _islocalurl.isLocalURL)(urlAsString)) {
          return resolveAs ? [
            urlAsString
          ] : urlAsString;
        }
        try {
          let baseBase = urlAsString.startsWith("#") ? router.asPath : router.pathname;
          if (urlAsString.startsWith("?")) {
            baseBase = router.asPath;
            if ((0, _utils1.isDynamicRoute)(router.pathname)) {
              baseBase = router.pathname;
              const routeRegex = (0, _routeregex.getRouteRegex)(router.pathname);
              const match = (0, _routematcher.getRouteMatcher)(routeRegex)(router.asPath);
              if (!match) {
                baseBase = router.asPath;
              }
            }
          }
          base = new URL(baseBase, "http://n");
        } catch (_) {
          base = new URL("/", "http://n");
        }
        try {
          const finalUrl = new URL(urlAsString, base);
          finalUrl.pathname = (0, _normalizetrailingslash.normalizePathTrailingSlash)(finalUrl.pathname);
          let interpolatedAs = "";
          if ((0, _utils1.isDynamicRoute)(finalUrl.pathname) && finalUrl.searchParams && resolveAs) {
            const query = (0, _querystring.searchParamsToUrlQuery)(finalUrl.searchParams);
            const { result, params } = (0, _interpolateas.interpolateAs)(finalUrl.pathname, finalUrl.pathname, query);
            if (result) {
              interpolatedAs = (0, _formaturl.formatWithValidation)({
                pathname: result,
                hash: finalUrl.hash,
                query: (0, _omit.omit)(query, params)
              });
            }
          }
          const resolvedHref = finalUrl.origin === base.origin ? finalUrl.href.slice(finalUrl.origin.length) : finalUrl.href;
          return resolveAs ? [
            resolvedHref,
            interpolatedAs || resolvedHref
          ] : resolvedHref;
        } catch (_) {
          return resolveAs ? [
            urlAsString
          ] : urlAsString;
        }
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/add-path-prefix.js
  var require_add_path_prefix = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/add-path-prefix.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "addPathPrefix", {
        enumerable: true,
        get: function() {
          return addPathPrefix;
        }
      });
      var _parsepath = require_parse_path();
      function addPathPrefix(path, prefix) {
        if (!path.startsWith("/") || !prefix) {
          return path;
        }
        const { pathname, query, hash } = (0, _parsepath.parsePath)(path);
        return `${prefix}${pathname}${query}${hash}`;
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/add-locale.js
  var require_add_locale = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/add-locale.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "addLocale", {
        enumerable: true,
        get: function() {
          return addLocale;
        }
      });
      var _addpathprefix = require_add_path_prefix();
      var _pathhasprefix = require_path_has_prefix();
      function addLocale(path, locale, defaultLocale, ignorePrefix) {
        if (!locale || locale === defaultLocale) return path;
        const lower = path.toLowerCase();
        if (!ignorePrefix) {
          if ((0, _pathhasprefix.pathHasPrefix)(lower, "/api")) return path;
          if ((0, _pathhasprefix.pathHasPrefix)(lower, `/${locale.toLowerCase()}`)) return path;
        }
        return (0, _addpathprefix.addPathPrefix)(path, `/${locale}`);
      }
    }
  });

  // node_modules/next/dist/client/add-locale.js
  var require_add_locale2 = __commonJS({
    "node_modules/next/dist/client/add-locale.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "addLocale", {
        enumerable: true,
        get: function() {
          return addLocale;
        }
      });
      var _normalizetrailingslash = require_normalize_trailing_slash();
      var addLocale = (path, ...args) => {
        if (process.env.__NEXT_I18N_SUPPORT) {
          return (0, _normalizetrailingslash.normalizePathTrailingSlash)(require_add_locale().addLocale(path, ...args));
        }
        return path;
      };
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/shared/lib/router-context.shared-runtime.js
  var require_router_context_shared_runtime = __commonJS({
    "node_modules/next/dist/shared/lib/router-context.shared-runtime.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "RouterContext", {
        enumerable: true,
        get: function() {
          return RouterContext;
        }
      });
      var _interop_require_default = require_interop_require_default();
      var _react = /* @__PURE__ */ _interop_require_default._(require_react());
      var RouterContext = _react.default.createContext(null);
      if (true) {
        RouterContext.displayName = "RouterContext";
      }
    }
  });

  // node_modules/next/dist/client/request-idle-callback.js
  var require_request_idle_callback = __commonJS({
    "node_modules/next/dist/client/request-idle-callback.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        cancelIdleCallback: function() {
          return cancelIdleCallback;
        },
        requestIdleCallback: function() {
          return requestIdleCallback;
        }
      });
      var requestIdleCallback = typeof self !== "undefined" && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function(cb) {
        let start = Date.now();
        return self.setTimeout(function() {
          cb({
            didTimeout: false,
            timeRemaining: function() {
              return Math.max(0, 50 - (Date.now() - start));
            }
          });
        }, 1);
      };
      var cancelIdleCallback = typeof self !== "undefined" && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function(id) {
        return clearTimeout(id);
      };
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/client/use-intersection.js
  var require_use_intersection = __commonJS({
    "node_modules/next/dist/client/use-intersection.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "useIntersection", {
        enumerable: true,
        get: function() {
          return useIntersection;
        }
      });
      var _react = require_react();
      var _requestidlecallback = require_request_idle_callback();
      var hasIntersectionObserver = typeof IntersectionObserver === "function";
      var observers = /* @__PURE__ */ new Map();
      var idList = [];
      function createObserver(options) {
        const id = {
          root: options.root || null,
          margin: options.rootMargin || ""
        };
        const existing = idList.find((obj) => obj.root === id.root && obj.margin === id.margin);
        let instance;
        if (existing) {
          instance = observers.get(existing);
          if (instance) {
            return instance;
          }
        }
        const elements = /* @__PURE__ */ new Map();
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const callback = elements.get(entry.target);
            const isVisible = entry.isIntersecting || entry.intersectionRatio > 0;
            if (callback && isVisible) {
              callback(isVisible);
            }
          });
        }, options);
        instance = {
          id,
          observer,
          elements
        };
        idList.push(id);
        observers.set(id, instance);
        return instance;
      }
      function observe(element, callback, options) {
        const { id, observer, elements } = createObserver(options);
        elements.set(element, callback);
        observer.observe(element);
        return function unobserve() {
          elements.delete(element);
          observer.unobserve(element);
          if (elements.size === 0) {
            observer.disconnect();
            observers.delete(id);
            const index2 = idList.findIndex((obj) => obj.root === id.root && obj.margin === id.margin);
            if (index2 > -1) {
              idList.splice(index2, 1);
            }
          }
        };
      }
      function useIntersection({ rootRef, rootMargin, disabled }) {
        const isDisabled = disabled || !hasIntersectionObserver;
        const [visible, setVisible] = (0, _react.useState)(false);
        const elementRef = (0, _react.useRef)(null);
        const setElement = (0, _react.useCallback)((element) => {
          elementRef.current = element;
        }, []);
        (0, _react.useEffect)(() => {
          if (hasIntersectionObserver) {
            if (isDisabled || visible) return;
            const element = elementRef.current;
            if (element && element.tagName) {
              const unobserve = observe(element, (isVisible) => isVisible && setVisible(isVisible), {
                root: rootRef?.current,
                rootMargin
              });
              return unobserve;
            }
          } else {
            if (!visible) {
              const idleCallback = (0, _requestidlecallback.requestIdleCallback)(() => setVisible(true));
              return () => (0, _requestidlecallback.cancelIdleCallback)(idleCallback);
            }
          }
        }, [
          isDisabled,
          rootMargin,
          rootRef,
          visible,
          elementRef.current
        ]);
        const resetVisible = (0, _react.useCallback)(() => {
          setVisible(false);
        }, []);
        return [
          setElement,
          visible,
          resetVisible
        ];
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/shared/lib/i18n/normalize-locale-path.js
  var require_normalize_locale_path = __commonJS({
    "node_modules/next/dist/shared/lib/i18n/normalize-locale-path.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "normalizeLocalePath", {
        enumerable: true,
        get: function() {
          return normalizeLocalePath;
        }
      });
      var cache = /* @__PURE__ */ new WeakMap();
      function normalizeLocalePath(pathname, locales) {
        if (!locales) return {
          pathname
        };
        let lowercasedLocales = cache.get(locales);
        if (!lowercasedLocales) {
          lowercasedLocales = locales.map((locale) => locale.toLowerCase());
          cache.set(locales, lowercasedLocales);
        }
        let detectedLocale;
        const segments = pathname.split("/", 2);
        if (!segments[1]) return {
          pathname
        };
        const segment = segments[1].toLowerCase();
        const index2 = lowercasedLocales.indexOf(segment);
        if (index2 < 0) return {
          pathname
        };
        detectedLocale = locales[index2];
        pathname = pathname.slice(detectedLocale.length + 1) || "/";
        return {
          pathname,
          detectedLocale
        };
      }
    }
  });

  // node_modules/next/dist/client/normalize-locale-path.js
  var require_normalize_locale_path2 = __commonJS({
    "node_modules/next/dist/client/normalize-locale-path.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "normalizeLocalePath", {
        enumerable: true,
        get: function() {
          return normalizeLocalePath;
        }
      });
      var normalizeLocalePath = (pathname, locales) => {
        if (process.env.__NEXT_I18N_SUPPORT) {
          return require_normalize_locale_path().normalizeLocalePath(pathname, locales);
        }
        return {
          pathname,
          detectedLocale: void 0
        };
      };
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/shared/lib/i18n/detect-domain-locale.js
  var require_detect_domain_locale = __commonJS({
    "node_modules/next/dist/shared/lib/i18n/detect-domain-locale.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "detectDomainLocale", {
        enumerable: true,
        get: function() {
          return detectDomainLocale;
        }
      });
      function detectDomainLocale(domainItems, hostname, detectedLocale) {
        if (!domainItems) return;
        if (detectedLocale) {
          detectedLocale = detectedLocale.toLowerCase();
        }
        for (const item of domainItems) {
          const domainHostname = item.domain?.split(":", 1)[0].toLowerCase();
          if (hostname === domainHostname || detectedLocale === item.defaultLocale.toLowerCase() || item.locales?.some((locale) => locale.toLowerCase() === detectedLocale)) {
            return item;
          }
        }
      }
    }
  });

  // node_modules/next/dist/client/detect-domain-locale.js
  var require_detect_domain_locale2 = __commonJS({
    "node_modules/next/dist/client/detect-domain-locale.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "detectDomainLocale", {
        enumerable: true,
        get: function() {
          return detectDomainLocale;
        }
      });
      var detectDomainLocale = (...args) => {
        if (process.env.__NEXT_I18N_SUPPORT) {
          return require_detect_domain_locale().detectDomainLocale(...args);
        }
      };
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/client/get-domain-locale.js
  var require_get_domain_locale = __commonJS({
    "node_modules/next/dist/client/get-domain-locale.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "getDomainLocale", {
        enumerable: true,
        get: function() {
          return getDomainLocale;
        }
      });
      var _normalizetrailingslash = require_normalize_trailing_slash();
      var basePath = process.env.__NEXT_ROUTER_BASEPATH || "";
      function getDomainLocale(path, locale, locales, domainLocales) {
        if (process.env.__NEXT_I18N_SUPPORT) {
          const normalizeLocalePath = require_normalize_locale_path2().normalizeLocalePath;
          const detectDomainLocale = require_detect_domain_locale2().detectDomainLocale;
          const target = locale || normalizeLocalePath(path, locales).detectedLocale;
          const domain = detectDomainLocale(domainLocales, void 0, target);
          if (domain) {
            const proto = `http${domain.http ? "" : "s"}://`;
            const finalLocale = target === domain.defaultLocale ? "" : `/${target}`;
            return `${proto}${domain.domain}${(0, _normalizetrailingslash.normalizePathTrailingSlash)(`${basePath}${finalLocale}${path}`)}`;
          }
          return false;
        } else {
          return false;
        }
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/client/add-base-path.js
  var require_add_base_path = __commonJS({
    "node_modules/next/dist/client/add-base-path.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "addBasePath", {
        enumerable: true,
        get: function() {
          return addBasePath;
        }
      });
      var _addpathprefix = require_add_path_prefix();
      var _normalizetrailingslash = require_normalize_trailing_slash();
      var basePath = process.env.__NEXT_ROUTER_BASEPATH || "";
      function addBasePath(path, required) {
        return (0, _normalizetrailingslash.normalizePathTrailingSlash)(process.env.__NEXT_MANUAL_CLIENT_BASE_PATH && !required ? path : (0, _addpathprefix.addPathPrefix)(path, basePath));
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/client/use-merged-ref.js
  var require_use_merged_ref = __commonJS({
    "node_modules/next/dist/client/use-merged-ref.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "useMergedRef", {
        enumerable: true,
        get: function() {
          return useMergedRef;
        }
      });
      var _react = require_react();
      function useMergedRef(refA, refB) {
        const cleanupA = (0, _react.useRef)(null);
        const cleanupB = (0, _react.useRef)(null);
        return (0, _react.useCallback)((current) => {
          if (current === null) {
            const cleanupFnA = cleanupA.current;
            if (cleanupFnA) {
              cleanupA.current = null;
              cleanupFnA();
            }
            const cleanupFnB = cleanupB.current;
            if (cleanupFnB) {
              cleanupB.current = null;
              cleanupFnB();
            }
          } else {
            if (refA) {
              cleanupA.current = applyRef(refA, current);
            }
            if (refB) {
              cleanupB.current = applyRef(refB, current);
            }
          }
        }, [
          refA,
          refB
        ]);
      }
      function applyRef(refA, current) {
        if (typeof refA === "function") {
          const cleanup = refA(current);
          if (typeof cleanup === "function") {
            return cleanup;
          } else {
            return () => refA(null);
          }
        } else {
          refA.current = current;
          return () => {
            refA.current = null;
          };
        }
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/shared/lib/utils/error-once.js
  var require_error_once = __commonJS({
    "node_modules/next/dist/shared/lib/utils/error-once.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "errorOnce", {
        enumerable: true,
        get: function() {
          return errorOnce;
        }
      });
      var errorOnce = (_) => {
      };
      if (true) {
        const errors = /* @__PURE__ */ new Set();
        errorOnce = (msg) => {
          if (!errors.has(msg)) {
            console.error(msg);
          }
          errors.add(msg);
        };
      }
    }
  });

  // node_modules/next/dist/client/link.js
  var require_link = __commonJS({
    "node_modules/next/dist/client/link.js"(exports, module) {
      "use client";
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all3) {
        for (var name in all3) Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name]
        });
      }
      _export(exports, {
        default: function() {
          return _default;
        },
        useLinkStatus: function() {
          return useLinkStatus;
        }
      });
      var _interop_require_wildcard = require_interop_require_wildcard();
      var _jsxruntime = require_jsx_runtime();
      var _react = /* @__PURE__ */ _interop_require_wildcard._(require_react());
      var _resolvehref = require_resolve_href();
      var _islocalurl = require_is_local_url();
      var _formaturl = require_format_url();
      var _utils = require_utils();
      var _addlocale = require_add_locale2();
      var _routercontextsharedruntime = require_router_context_shared_runtime();
      var _useintersection = require_use_intersection();
      var _getdomainlocale = require_get_domain_locale();
      var _addbasepath = require_add_base_path();
      var _usemergedref = require_use_merged_ref();
      var _erroronce = require_error_once();
      var prefetched = /* @__PURE__ */ new Set();
      function prefetch(router, href, as, options) {
        if (typeof window === "undefined") {
          return;
        }
        if (!(0, _islocalurl.isLocalURL)(href)) {
          return;
        }
        if (!options.bypassPrefetchedCheck) {
          const locale = (
            // Let the link's locale prop override the default router locale.
            typeof options.locale !== "undefined" ? options.locale : "locale" in router ? router.locale : void 0
          );
          const prefetchedKey = href + "%" + as + "%" + locale;
          if (prefetched.has(prefetchedKey)) {
            return;
          }
          prefetched.add(prefetchedKey);
        }
        router.prefetch(href, as, options).catch((err) => {
          if (true) {
            throw err;
          }
        });
      }
      function isModifiedEvent(event) {
        const eventTarget = event.currentTarget;
        const target = eventTarget.getAttribute("target");
        return target && target !== "_self" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || // triggers resource download
        event.nativeEvent && event.nativeEvent.which === 2;
      }
      function linkClicked(e, router, href, as, replace, shallow, scroll, locale, onNavigate) {
        const { nodeName } = e.currentTarget;
        const isAnchorNodeName = nodeName.toUpperCase() === "A";
        if (isAnchorNodeName && isModifiedEvent(e) || e.currentTarget.hasAttribute("download")) {
          return;
        }
        if (!(0, _islocalurl.isLocalURL)(href)) {
          if (replace) {
            e.preventDefault();
            location.replace(href);
          }
          return;
        }
        e.preventDefault();
        const navigate = () => {
          if (onNavigate) {
            let isDefaultPrevented = false;
            onNavigate({
              preventDefault: () => {
                isDefaultPrevented = true;
              }
            });
            if (isDefaultPrevented) {
              return;
            }
          }
          const routerScroll = scroll ?? true;
          if ("beforePopState" in router) {
            router[replace ? "replace" : "push"](href, as, {
              shallow,
              locale,
              scroll: routerScroll
            });
          } else {
            router[replace ? "replace" : "push"](as || href, {
              scroll: routerScroll
            });
          }
        };
        navigate();
      }
      function formatStringOrUrl(urlObjOrString) {
        if (typeof urlObjOrString === "string") {
          return urlObjOrString;
        }
        return (0, _formaturl.formatUrl)(urlObjOrString);
      }
      var Link2 = /* @__PURE__ */ _react.default.forwardRef(function LinkComponent(props, forwardedRef) {
        let children;
        const { href: hrefProp, as: asProp, children: childrenProp, prefetch: prefetchProp = null, passHref, replace, shallow, scroll, locale, onClick, onNavigate, onMouseEnter: onMouseEnterProp, onTouchStart: onTouchStartProp, legacyBehavior = false, ...restProps } = props;
        children = childrenProp;
        if (legacyBehavior && (typeof children === "string" || typeof children === "number")) {
          children = /* @__PURE__ */ (0, _jsxruntime.jsx)("a", {
            children
          });
        }
        const router = _react.default.useContext(_routercontextsharedruntime.RouterContext);
        const prefetchEnabled = prefetchProp !== false;
        if (true) {
          let createPropError = function(args) {
            return Object.defineProperty(new Error(`Failed prop type: The prop \`${args.key}\` expects a ${args.expected} in \`<Link>\`, but got \`${args.actual}\` instead.` + (typeof window !== "undefined" ? "\nOpen your browser's console to view the Component stack trace." : "")), "__NEXT_ERROR_CODE", {
              value: "E319",
              enumerable: false,
              configurable: true
            });
          };
          const requiredPropsGuard = {
            href: true
          };
          const requiredProps = Object.keys(requiredPropsGuard);
          requiredProps.forEach((key) => {
            if (key === "href") {
              if (props[key] == null || typeof props[key] !== "string" && typeof props[key] !== "object") {
                throw createPropError({
                  key,
                  expected: "`string` or `object`",
                  actual: props[key] === null ? "null" : typeof props[key]
                });
              }
            } else {
              const _ = key;
            }
          });
          const optionalPropsGuard = {
            as: true,
            replace: true,
            scroll: true,
            shallow: true,
            passHref: true,
            prefetch: true,
            locale: true,
            onClick: true,
            onMouseEnter: true,
            onTouchStart: true,
            legacyBehavior: true,
            onNavigate: true
          };
          const optionalProps = Object.keys(optionalPropsGuard);
          optionalProps.forEach((key) => {
            const valType = typeof props[key];
            if (key === "as") {
              if (props[key] && valType !== "string" && valType !== "object") {
                throw createPropError({
                  key,
                  expected: "`string` or `object`",
                  actual: valType
                });
              }
            } else if (key === "locale") {
              if (props[key] && valType !== "string") {
                throw createPropError({
                  key,
                  expected: "`string`",
                  actual: valType
                });
              }
            } else if (key === "onClick" || key === "onMouseEnter" || key === "onTouchStart" || key === "onNavigate") {
              if (props[key] && valType !== "function") {
                throw createPropError({
                  key,
                  expected: "`function`",
                  actual: valType
                });
              }
            } else if (key === "replace" || key === "scroll" || key === "shallow" || key === "passHref" || key === "legacyBehavior") {
              if (props[key] != null && valType !== "boolean") {
                throw createPropError({
                  key,
                  expected: "`boolean`",
                  actual: valType
                });
              }
            } else if (key === "prefetch") {
              if (props[key] != null && valType !== "boolean" && props[key] !== "auto") {
                throw createPropError({
                  key,
                  expected: '`boolean | "auto"`',
                  actual: valType
                });
              }
            } else {
              const _ = key;
            }
          });
        }
        const { href, as } = _react.default.useMemo(() => {
          if (!router) {
            const resolvedHref2 = formatStringOrUrl(hrefProp);
            return {
              href: resolvedHref2,
              as: asProp ? formatStringOrUrl(asProp) : resolvedHref2
            };
          }
          const [resolvedHref, resolvedAs] = (0, _resolvehref.resolveHref)(router, hrefProp, true);
          return {
            href: resolvedHref,
            as: asProp ? (0, _resolvehref.resolveHref)(router, asProp) : resolvedAs || resolvedHref
          };
        }, [
          router,
          hrefProp,
          asProp
        ]);
        const previousHref = _react.default.useRef(href);
        const previousAs = _react.default.useRef(as);
        let child;
        if (legacyBehavior) {
          if (true) {
            if (onClick) {
              console.warn(`"onClick" was passed to <Link> with \`href\` of \`${hrefProp}\` but "legacyBehavior" was set. The legacy behavior requires onClick be set on the child of next/link`);
            }
            if (onMouseEnterProp) {
              console.warn(`"onMouseEnter" was passed to <Link> with \`href\` of \`${hrefProp}\` but "legacyBehavior" was set. The legacy behavior requires onMouseEnter be set on the child of next/link`);
            }
            try {
              child = _react.default.Children.only(children);
            } catch (err) {
              if (!children) {
                throw Object.defineProperty(new Error(`No children were passed to <Link> with \`href\` of \`${hrefProp}\` but one child is required https://nextjs.org/docs/messages/link-no-children`), "__NEXT_ERROR_CODE", {
                  value: "E320",
                  enumerable: false,
                  configurable: true
                });
              }
              throw Object.defineProperty(new Error(`Multiple children were passed to <Link> with \`href\` of \`${hrefProp}\` but only one child is supported https://nextjs.org/docs/messages/link-multiple-children` + (typeof window !== "undefined" ? " \nOpen your browser's console to view the Component stack trace." : "")), "__NEXT_ERROR_CODE", {
                value: "E266",
                enumerable: false,
                configurable: true
              });
            }
          } else {
            child = _react.default.Children.only(children);
          }
        } else {
          if (true) {
            if (children?.type === "a") {
              throw Object.defineProperty(new Error("Invalid <Link> with <a> child. Please remove <a> or use <Link legacyBehavior>.\nLearn more: https://nextjs.org/docs/messages/invalid-new-link-with-extra-anchor"), "__NEXT_ERROR_CODE", {
                value: "E209",
                enumerable: false,
                configurable: true
              });
            }
          }
        }
        const childRef = legacyBehavior ? child && typeof child === "object" && child.ref : forwardedRef;
        const [setIntersectionRef, isVisible, resetVisible] = (0, _useintersection.useIntersection)({
          rootMargin: "200px"
        });
        const setIntersectionWithResetRef = _react.default.useCallback((el) => {
          if (previousAs.current !== as || previousHref.current !== href) {
            resetVisible();
            previousAs.current = as;
            previousHref.current = href;
          }
          setIntersectionRef(el);
        }, [
          as,
          href,
          resetVisible,
          setIntersectionRef
        ]);
        const setRef2 = (0, _usemergedref.useMergedRef)(setIntersectionWithResetRef, childRef);
        _react.default.useEffect(() => {
          if (true) {
            return;
          }
          if (!router) {
            return;
          }
          if (!isVisible || !prefetchEnabled) {
            return;
          }
          prefetch(router, href, as, {
            locale
          });
        }, [
          as,
          href,
          isVisible,
          locale,
          prefetchEnabled,
          router?.locale,
          router
        ]);
        const childProps = {
          ref: setRef2,
          onClick(e) {
            if (true) {
              if (!e) {
                throw Object.defineProperty(new Error(`Component rendered inside next/link has to pass click event to "onClick" prop.`), "__NEXT_ERROR_CODE", {
                  value: "E312",
                  enumerable: false,
                  configurable: true
                });
              }
            }
            if (!legacyBehavior && typeof onClick === "function") {
              onClick(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onClick === "function") {
              child.props.onClick(e);
            }
            if (!router) {
              return;
            }
            if (e.defaultPrevented) {
              return;
            }
            linkClicked(e, router, href, as, replace, shallow, scroll, locale, onNavigate);
          },
          onMouseEnter(e) {
            if (!legacyBehavior && typeof onMouseEnterProp === "function") {
              onMouseEnterProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onMouseEnter === "function") {
              child.props.onMouseEnter(e);
            }
            if (!router) {
              return;
            }
            prefetch(router, href, as, {
              locale,
              priority: true,
              // @see {https://github.com/vercel/next.js/discussions/40268?sort=top#discussioncomment-3572642}
              bypassPrefetchedCheck: true
            });
          },
          onTouchStart: process.env.__NEXT_LINK_NO_TOUCH_START ? void 0 : function onTouchStart(e) {
            if (!legacyBehavior && typeof onTouchStartProp === "function") {
              onTouchStartProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onTouchStart === "function") {
              child.props.onTouchStart(e);
            }
            if (!router) {
              return;
            }
            prefetch(router, href, as, {
              locale,
              priority: true,
              // @see {https://github.com/vercel/next.js/discussions/40268?sort=top#discussioncomment-3572642}
              bypassPrefetchedCheck: true
            });
          }
        };
        if ((0, _utils.isAbsoluteUrl)(as)) {
          childProps.href = as;
        } else if (!legacyBehavior || passHref || child.type === "a" && !("href" in child.props)) {
          const curLocale = typeof locale !== "undefined" ? locale : router?.locale;
          const localeDomain = router?.isLocaleDomain && (0, _getdomainlocale.getDomainLocale)(as, curLocale, router?.locales, router?.domainLocales);
          childProps.href = localeDomain || (0, _addbasepath.addBasePath)((0, _addlocale.addLocale)(as, curLocale, router?.defaultLocale));
        }
        if (legacyBehavior) {
          if (true) {
            (0, _erroronce.errorOnce)("`legacyBehavior` is deprecated and will be removed in a future release. A codemod is available to upgrade your components:\n\nnpx @next/codemod@latest new-link .\n\nLearn more: https://nextjs.org/docs/app/building-your-application/upgrading/codemods#remove-a-tags-from-link-components");
          }
          return /* @__PURE__ */ _react.default.cloneElement(child, childProps);
        }
        return /* @__PURE__ */ (0, _jsxruntime.jsx)("a", {
          ...restProps,
          ...childProps,
          children
        });
      });
      var LinkStatusContext = /* @__PURE__ */ (0, _react.createContext)({
        // We do not support link status in the Pages Router, so we always return false
        pending: false
      });
      var useLinkStatus = () => {
        return (0, _react.useContext)(LinkStatusContext);
      };
      var _default = Link2;
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/link.js
  var require_link2 = __commonJS({
    "node_modules/next/link.js"(exports, module) {
      module.exports = require_link();
    }
  });

  // node_modules/react-dom/cjs/react-dom.development.js
  var require_react_dom_development = __commonJS({
    "node_modules/react-dom/cjs/react-dom.development.js"(exports) {
      "use strict";
      (function() {
        function noop4() {
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function createPortal$1(children, containerInfo, implementation) {
          var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
          try {
            testStringCoercion(key);
            var JSCompiler_inline_result = false;
          } catch (e) {
            JSCompiler_inline_result = true;
          }
          JSCompiler_inline_result && (console.error(
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            "function" === typeof Symbol && Symbol.toStringTag && key[Symbol.toStringTag] || key.constructor.name || "Object"
          ), testStringCoercion(key));
          return {
            $$typeof: REACT_PORTAL_TYPE,
            key: null == key ? null : "" + key,
            children,
            containerInfo,
            implementation
          };
        }
        function getCrossOriginStringAs(as, input) {
          if ("font" === as) return "";
          if ("string" === typeof input)
            return "use-credentials" === input ? input : "";
        }
        function getValueDescriptorExpectingObjectForWarning(thing) {
          return null === thing ? "`null`" : void 0 === thing ? "`undefined`" : "" === thing ? "an empty string" : 'something with type "' + typeof thing + '"';
        }
        function getValueDescriptorExpectingEnumForWarning(thing) {
          return null === thing ? "`null`" : void 0 === thing ? "`undefined`" : "" === thing ? "an empty string" : "string" === typeof thing ? JSON.stringify(thing) : "number" === typeof thing ? "`" + thing + "`" : 'something with type "' + typeof thing + '"';
        }
        function resolveDispatcher() {
          var dispatcher = ReactSharedInternals.H;
          null === dispatcher && console.error(
            "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
          );
          return dispatcher;
        }
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
        var React36 = require_react(), Internals = {
          d: {
            f: noop4,
            r: function() {
              throw Error(
                "Invalid form element. requestFormReset must be passed a form that was rendered by React."
              );
            },
            D: noop4,
            C: noop4,
            L: noop4,
            m: noop4,
            X: noop4,
            S: noop4,
            M: noop4
          },
          p: 0,
          findDOMNode: null
        }, REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), ReactSharedInternals = React36.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
        "function" === typeof Map && null != Map.prototype && "function" === typeof Map.prototype.forEach && "function" === typeof Set && null != Set.prototype && "function" === typeof Set.prototype.clear && "function" === typeof Set.prototype.forEach || console.error(
          "React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"
        );
        exports.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
        exports.createPortal = function(children, container) {
          var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
          if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType)
            throw Error("Target container is not a DOM element.");
          return createPortal$1(children, container, null, key);
        };
        exports.flushSync = function(fn) {
          var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
          try {
            if (ReactSharedInternals.T = null, Internals.p = 2, fn)
              return fn();
          } finally {
            ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f() && console.error(
              "flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."
            );
          }
        };
        exports.preconnect = function(href, options) {
          "string" === typeof href && href ? null != options && "object" !== typeof options ? console.error(
            "ReactDOM.preconnect(): Expected the `options` argument (second) to be an object but encountered %s instead. The only supported option at this time is `crossOrigin` which accepts a string.",
            getValueDescriptorExpectingEnumForWarning(options)
          ) : null != options && "string" !== typeof options.crossOrigin && console.error(
            "ReactDOM.preconnect(): Expected the `crossOrigin` option (second argument) to be a string but encountered %s instead. Try removing this option or passing a string value instead.",
            getValueDescriptorExpectingObjectForWarning(options.crossOrigin)
          ) : console.error(
            "ReactDOM.preconnect(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
            getValueDescriptorExpectingObjectForWarning(href)
          );
          "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
        };
        exports.prefetchDNS = function(href) {
          if ("string" !== typeof href || !href)
            console.error(
              "ReactDOM.prefetchDNS(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
              getValueDescriptorExpectingObjectForWarning(href)
            );
          else if (1 < arguments.length) {
            var options = arguments[1];
            "object" === typeof options && options.hasOwnProperty("crossOrigin") ? console.error(
              "ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. It looks like the you are attempting to set a crossOrigin property for this DNS lookup hint. Browsers do not perform DNS queries using CORS and setting this attribute on the resource hint has no effect. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.",
              getValueDescriptorExpectingEnumForWarning(options)
            ) : console.error(
              "ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.",
              getValueDescriptorExpectingEnumForWarning(options)
            );
          }
          "string" === typeof href && Internals.d.D(href);
        };
        exports.preinit = function(href, options) {
          "string" === typeof href && href ? null == options || "object" !== typeof options ? console.error(
            "ReactDOM.preinit(): Expected the `options` argument (second) to be an object with an `as` property describing the type of resource to be preinitialized but encountered %s instead.",
            getValueDescriptorExpectingEnumForWarning(options)
          ) : "style" !== options.as && "script" !== options.as && console.error(
            'ReactDOM.preinit(): Expected the `as` property in the `options` argument (second) to contain a valid value describing the type of resource to be preinitialized but encountered %s instead. Valid values for `as` are "style" and "script".',
            getValueDescriptorExpectingEnumForWarning(options.as)
          ) : console.error(
            "ReactDOM.preinit(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
            getValueDescriptorExpectingObjectForWarning(href)
          );
          if ("string" === typeof href && options && "string" === typeof options.as) {
            var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
            "style" === as ? Internals.d.S(
              href,
              "string" === typeof options.precedence ? options.precedence : void 0,
              {
                crossOrigin,
                integrity,
                fetchPriority
              }
            ) : "script" === as && Internals.d.X(href, {
              crossOrigin,
              integrity,
              fetchPriority,
              nonce: "string" === typeof options.nonce ? options.nonce : void 0
            });
          }
        };
        exports.preinitModule = function(href, options) {
          var encountered = "";
          "string" === typeof href && href || (encountered += " The `href` argument encountered was " + getValueDescriptorExpectingObjectForWarning(href) + ".");
          void 0 !== options && "object" !== typeof options ? encountered += " The `options` argument encountered was " + getValueDescriptorExpectingObjectForWarning(options) + "." : options && "as" in options && "script" !== options.as && (encountered += " The `as` option encountered was " + getValueDescriptorExpectingEnumForWarning(options.as) + ".");
          if (encountered)
            console.error(
              "ReactDOM.preinitModule(): Expected up to two arguments, a non-empty `href` string and, optionally, an `options` object with a valid `as` property.%s",
              encountered
            );
          else
            switch (encountered = options && "string" === typeof options.as ? options.as : "script", encountered) {
              case "script":
                break;
              default:
                encountered = getValueDescriptorExpectingEnumForWarning(encountered), console.error(
                  'ReactDOM.preinitModule(): Currently the only supported "as" type for this function is "script" but received "%s" instead. This warning was generated for `href` "%s". In the future other module types will be supported, aligning with the import-attributes proposal. Learn more here: (https://github.com/tc39/proposal-import-attributes)',
                  encountered,
                  href
                );
            }
          if ("string" === typeof href)
            if ("object" === typeof options && null !== options) {
              if (null == options.as || "script" === options.as)
                encountered = getCrossOriginStringAs(
                  options.as,
                  options.crossOrigin
                ), Internals.d.M(href, {
                  crossOrigin: encountered,
                  integrity: "string" === typeof options.integrity ? options.integrity : void 0,
                  nonce: "string" === typeof options.nonce ? options.nonce : void 0
                });
            } else null == options && Internals.d.M(href);
        };
        exports.preload = function(href, options) {
          var encountered = "";
          "string" === typeof href && href || (encountered += " The `href` argument encountered was " + getValueDescriptorExpectingObjectForWarning(href) + ".");
          null == options || "object" !== typeof options ? encountered += " The `options` argument encountered was " + getValueDescriptorExpectingObjectForWarning(options) + "." : "string" === typeof options.as && options.as || (encountered += " The `as` option encountered was " + getValueDescriptorExpectingObjectForWarning(options.as) + ".");
          encountered && console.error(
            'ReactDOM.preload(): Expected two arguments, a non-empty `href` string and an `options` object with an `as` property valid for a `<link rel="preload" as="..." />` tag.%s',
            encountered
          );
          if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
            encountered = options.as;
            var crossOrigin = getCrossOriginStringAs(
              encountered,
              options.crossOrigin
            );
            Internals.d.L(href, encountered, {
              crossOrigin,
              integrity: "string" === typeof options.integrity ? options.integrity : void 0,
              nonce: "string" === typeof options.nonce ? options.nonce : void 0,
              type: "string" === typeof options.type ? options.type : void 0,
              fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
              referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
              imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
              imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
              media: "string" === typeof options.media ? options.media : void 0
            });
          }
        };
        exports.preloadModule = function(href, options) {
          var encountered = "";
          "string" === typeof href && href || (encountered += " The `href` argument encountered was " + getValueDescriptorExpectingObjectForWarning(href) + ".");
          void 0 !== options && "object" !== typeof options ? encountered += " The `options` argument encountered was " + getValueDescriptorExpectingObjectForWarning(options) + "." : options && "as" in options && "string" !== typeof options.as && (encountered += " The `as` option encountered was " + getValueDescriptorExpectingObjectForWarning(options.as) + ".");
          encountered && console.error(
            'ReactDOM.preloadModule(): Expected two arguments, a non-empty `href` string and, optionally, an `options` object with an `as` property valid for a `<link rel="modulepreload" as="..." />` tag.%s',
            encountered
          );
          "string" === typeof href && (options ? (encountered = getCrossOriginStringAs(
            options.as,
            options.crossOrigin
          ), Internals.d.m(href, {
            as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
            crossOrigin: encountered,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0
          })) : Internals.d.m(href));
        };
        exports.requestFormReset = function(form) {
          Internals.d.r(form);
        };
        exports.unstable_batchedUpdates = function(fn, a) {
          return fn(a);
        };
        exports.useFormState = function(action, initialState, permalink) {
          return resolveDispatcher().useFormState(action, initialState, permalink);
        };
        exports.useFormStatus = function() {
          return resolveDispatcher().useHostTransitionStatus();
        };
        exports.version = "19.2.0";
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
      })();
    }
  });

  // node_modules/react-dom/index.js
  var require_react_dom = __commonJS({
    "node_modules/react-dom/index.js"(exports, module) {
      "use strict";
      if (false) {
        checkDCE();
        module.exports = null;
      } else {
        module.exports = require_react_dom_development();
      }
    }
  });

  // components/layouts/Sidebar.tsx
  var import_react6 = __toESM(require_react());
  var import_navigation = __toESM(require_navigation2());
  var import_link = __toESM(require_link2());

  // node_modules/@tanstack/react-query/build/lib/QueryClientProvider.mjs
  var React = __toESM(require_react(), 1);
  var defaultContext = /* @__PURE__ */ React.createContext(void 0);
  var QueryClientSharingContext = /* @__PURE__ */ React.createContext(false);
  function getQueryClientContext(context, contextSharing) {
    if (context) {
      return context;
    }
    if (contextSharing && typeof window !== "undefined") {
      if (!window.ReactQueryClientContext) {
        window.ReactQueryClientContext = defaultContext;
      }
      return window.ReactQueryClientContext;
    }
    return defaultContext;
  }
  var useQueryClient = ({
    context
  } = {}) => {
    const queryClient = React.useContext(getQueryClientContext(context, React.useContext(QueryClientSharingContext)));
    if (!queryClient) {
      throw new Error("No QueryClient set, use QueryClientProvider to set one");
    }
    return queryClient;
  };

  // node_modules/axios/lib/helpers/bind.js
  function bind(fn, thisArg) {
    return function wrap() {
      return fn.apply(thisArg, arguments);
    };
  }

  // node_modules/axios/lib/utils.js
  var { toString } = Object.prototype;
  var { getPrototypeOf } = Object;
  var { iterator, toStringTag } = Symbol;
  var kindOf = /* @__PURE__ */ ((cache) => (thing) => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })(/* @__PURE__ */ Object.create(null));
  var kindOfTest = (type) => {
    type = type.toLowerCase();
    return (thing) => kindOf(thing) === type;
  };
  var typeOfTest = (type) => (thing) => typeof thing === type;
  var { isArray } = Array;
  var isUndefined = typeOfTest("undefined");
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }
  var isArrayBuffer = kindOfTest("ArrayBuffer");
  function isArrayBufferView(val) {
    let result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
  }
  var isString = typeOfTest("string");
  var isFunction = typeOfTest("function");
  var isNumber = typeOfTest("number");
  var isObject = (thing) => thing !== null && typeof thing === "object";
  var isBoolean = (thing) => thing === true || thing === false;
  var isPlainObject = (val) => {
    if (kindOf(val) !== "object") {
      return false;
    }
    const prototype3 = getPrototypeOf(val);
    return (prototype3 === null || prototype3 === Object.prototype || Object.getPrototypeOf(prototype3) === null) && !(toStringTag in val) && !(iterator in val);
  };
  var isEmptyObject = (val) => {
    if (!isObject(val) || isBuffer(val)) {
      return false;
    }
    try {
      return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
    } catch (e) {
      return false;
    }
  };
  var isDate = kindOfTest("Date");
  var isFile = kindOfTest("File");
  var isBlob = kindOfTest("Blob");
  var isFileList = kindOfTest("FileList");
  var isStream = (val) => isObject(val) && isFunction(val.pipe);
  var isFormData = (thing) => {
    let kind;
    return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
    kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
  };
  var isURLSearchParams = kindOfTest("URLSearchParams");
  var [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
  var trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  function forEach(obj, fn, { allOwnKeys = false } = {}) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    let i;
    let l;
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      if (isBuffer(obj)) {
        return;
      }
      const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        fn.call(null, obj[key], key, obj);
      }
    }
  }
  function findKey(obj, key) {
    if (isBuffer(obj)) {
      return null;
    }
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while (i-- > 0) {
      _key = keys[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }
  var _global = (() => {
    if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  })();
  var isContextDefined = (context) => !isUndefined(context) && context !== _global;
  function merge() {
    const { caseless, skipUndefined } = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key) => {
      const targetKey = caseless && findKey(result, key) || key;
      if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
        result[targetKey] = merge(result[targetKey], val);
      } else if (isPlainObject(val)) {
        result[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result[targetKey] = val.slice();
      } else if (!skipUndefined || !isUndefined(val)) {
        result[targetKey] = val;
      }
    };
    for (let i = 0, l = arguments.length; i < l; i++) {
      arguments[i] && forEach(arguments[i], assignValue);
    }
    return result;
  }
  var extend = (a, b, thisArg, { allOwnKeys } = {}) => {
    forEach(b, (val, key) => {
      if (thisArg && isFunction(val)) {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    }, { allOwnKeys });
    return a;
  };
  var stripBOM = (content) => {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  };
  var inherits = (constructor, superConstructor, props, descriptors2) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, "super", {
      value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
  };
  var toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
    let props;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    if (sourceObj == null) return destObj;
    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  };
  var endsWith = (str, searchString, position) => {
    str = String(str);
    if (position === void 0 || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
  var toArray = (thing) => {
    if (!thing) return null;
    if (isArray(thing)) return thing;
    let i = thing.length;
    if (!isNumber(i)) return null;
    const arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };
  var isTypedArray = /* @__PURE__ */ ((TypedArray) => {
    return (thing) => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
  var forEachEntry = (obj, fn) => {
    const generator = obj && obj[iterator];
    const _iterator = generator.call(obj);
    let result;
    while ((result = _iterator.next()) && !result.done) {
      const pair = result.value;
      fn.call(obj, pair[0], pair[1]);
    }
  };
  var matchAll = (regExp, str) => {
    let matches;
    const arr = [];
    while ((matches = regExp.exec(str)) !== null) {
      arr.push(matches);
    }
    return arr;
  };
  var isHTMLForm = kindOfTest("HTMLFormElement");
  var toCamelCase = (str) => {
    return str.toLowerCase().replace(
      /[-_\s]([a-z\d])(\w*)/g,
      function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
      }
    );
  };
  var hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
  var isRegExp = kindOfTest("RegExp");
  var reduceDescriptors = (obj, reducer) => {
    const descriptors2 = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors2, (descriptor, name) => {
      let ret;
      if ((ret = reducer(descriptor, name, obj)) !== false) {
        reducedDescriptors[name] = ret || descriptor;
      }
    });
    Object.defineProperties(obj, reducedDescriptors);
  };
  var freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name) => {
      if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
        return false;
      }
      const value = obj[name];
      if (!isFunction(value)) return;
      descriptor.enumerable = false;
      if ("writable" in descriptor) {
        descriptor.writable = false;
        return;
      }
      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error("Can not rewrite read-only method '" + name + "'");
        };
      }
    });
  };
  var toObjectSet = (arrayOrString, delimiter) => {
    const obj = {};
    const define = (arr) => {
      arr.forEach((value) => {
        obj[value] = true;
      });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
  };
  var noop = () => {
  };
  var toFiniteNumber = (value, defaultValue) => {
    return value != null && Number.isFinite(value = +value) ? value : defaultValue;
  };
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
  }
  var toJSONObject = (obj) => {
    const stack = new Array(10);
    const visit = (source, i) => {
      if (isObject(source)) {
        if (stack.indexOf(source) >= 0) {
          return;
        }
        if (isBuffer(source)) {
          return source;
        }
        if (!("toJSON" in source)) {
          stack[i] = source;
          const target = isArray(source) ? [] : {};
          forEach(source, (value, key) => {
            const reducedValue = visit(value, i + 1);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });
          stack[i] = void 0;
          return target;
        }
      }
      return source;
    };
    return visit(obj, 0);
  };
  var isAsyncFn = kindOfTest("AsyncFunction");
  var isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
  var _setImmediate = ((setImmediateSupported, postMessageSupported) => {
    if (setImmediateSupported) {
      return setImmediate;
    }
    return postMessageSupported ? ((token, callbacks) => {
      _global.addEventListener("message", ({ source, data }) => {
        if (source === _global && data === token) {
          callbacks.length && callbacks.shift()();
        }
      }, false);
      return (cb) => {
        callbacks.push(cb);
        _global.postMessage(token, "*");
      };
    })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
  })(
    typeof setImmediate === "function",
    isFunction(_global.postMessage)
  );
  var asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
  var isIterable = (thing) => thing != null && isFunction(thing[iterator]);
  var utils_default = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isEmptyObject,
    isReadableStream,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty,
    // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable,
    setImmediate: _setImmediate,
    asap,
    isIterable
  };

  // node_modules/axios/lib/core/AxiosError.js
  function AxiosError(message, code, config, request, response) {
    Error.call(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    this.message = message;
    this.name = "AxiosError";
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    if (response) {
      this.response = response;
      this.status = response.status ? response.status : null;
    }
  }
  utils_default.inherits(AxiosError, Error, {
    toJSON: function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: utils_default.toJSONObject(this.config),
        code: this.code,
        status: this.status
      };
    }
  });
  var prototype = AxiosError.prototype;
  var descriptors = {};
  [
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL"
    // eslint-disable-next-line func-names
  ].forEach((code) => {
    descriptors[code] = { value: code };
  });
  Object.defineProperties(AxiosError, descriptors);
  Object.defineProperty(prototype, "isAxiosError", { value: true });
  AxiosError.from = (error, code, config, request, response, customProps) => {
    const axiosError = Object.create(prototype);
    utils_default.toFlatObject(error, axiosError, function filter2(obj) {
      return obj !== Error.prototype;
    }, (prop) => {
      return prop !== "isAxiosError";
    });
    const msg = error && error.message ? error.message : "Error";
    const errCode = code == null && error ? error.code : code;
    AxiosError.call(axiosError, msg, errCode, config, request, response);
    if (error && axiosError.cause == null) {
      Object.defineProperty(axiosError, "cause", { value: error, configurable: true });
    }
    axiosError.name = error && error.name || "Error";
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  };
  var AxiosError_default = AxiosError;

  // node_modules/axios/lib/helpers/null.js
  var null_default = null;

  // node_modules/axios/lib/helpers/toFormData.js
  function isVisitable(thing) {
    return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
  }
  function removeBrackets(key) {
    return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
  }
  function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token, i) {
      token = removeBrackets(token);
      return !dots && i ? "[" + token + "]" : token;
    }).join(dots ? "." : "");
  }
  function isFlatArray(arr) {
    return utils_default.isArray(arr) && !arr.some(isVisitable);
  }
  var predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });
  function toFormData(obj, formData, options) {
    if (!utils_default.isObject(obj)) {
      throw new TypeError("target must be an object");
    }
    formData = formData || new (null_default || FormData)();
    options = utils_default.toFlatObject(options, {
      metaTokens: true,
      dots: false,
      indexes: false
    }, false, function defined(option, source) {
      return !utils_default.isUndefined(source[option]);
    });
    const metaTokens = options.metaTokens;
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
    if (!utils_default.isFunction(visitor)) {
      throw new TypeError("visitor must be a function");
    }
    function convertValue(value) {
      if (value === null) return "";
      if (utils_default.isDate(value)) {
        return value.toISOString();
      }
      if (utils_default.isBoolean(value)) {
        return value.toString();
      }
      if (!useBlob && utils_default.isBlob(value)) {
        throw new AxiosError_default("Blob is not supported. Use a Buffer instead.");
      }
      if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) {
        return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function defaultVisitor(value, key, path) {
      let arr = value;
      if (value && !path && typeof value === "object") {
        if (utils_default.endsWith(key, "{}")) {
          key = metaTokens ? key : key.slice(0, -2);
          value = JSON.stringify(value);
        } else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
          key = removeBrackets(key);
          arr.forEach(function each(el, index2) {
            !(utils_default.isUndefined(el) || el === null) && formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true ? renderKey([key], index2, dots) : indexes === null ? key : key + "[]",
              convertValue(el)
            );
          });
          return false;
        }
      }
      if (isVisitable(value)) {
        return true;
      }
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }
    const stack = [];
    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });
    function build(value, path) {
      if (utils_default.isUndefined(value)) return;
      if (stack.indexOf(value) !== -1) {
        throw Error("Circular reference detected in " + path.join("."));
      }
      stack.push(value);
      utils_default.forEach(value, function each(el, key) {
        const result = !(utils_default.isUndefined(el) || el === null) && visitor.call(
          formData,
          el,
          utils_default.isString(key) ? key.trim() : key,
          path,
          exposedHelpers
        );
        if (result === true) {
          build(el, path ? path.concat(key) : [key]);
        }
      });
      stack.pop();
    }
    if (!utils_default.isObject(obj)) {
      throw new TypeError("data must be an object");
    }
    build(obj);
    return formData;
  }
  var toFormData_default = toFormData;

  // node_modules/axios/lib/helpers/AxiosURLSearchParams.js
  function encode(str) {
    const charMap = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
      return charMap[match];
    });
  }
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && toFormData_default(params, this, options);
  }
  var prototype2 = AxiosURLSearchParams.prototype;
  prototype2.append = function append(name, value) {
    this._pairs.push([name, value]);
  };
  prototype2.toString = function toString2(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode);
    } : encode;
    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
  };
  var AxiosURLSearchParams_default = AxiosURLSearchParams;

  // node_modules/axios/lib/helpers/buildURL.js
  function encode2(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
  }
  function buildURL(url, params, options) {
    if (!params) {
      return url;
    }
    const _encode = options && options.encode || encode2;
    if (utils_default.isFunction(options)) {
      options = {
        serialize: options
      };
    }
    const serializeFn = options && options.serialize;
    let serializedParams;
    if (serializeFn) {
      serializedParams = serializeFn(params, options);
    } else {
      serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams_default(params, options).toString(_encode);
    }
    if (serializedParams) {
      const hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  }

  // node_modules/axios/lib/core/InterceptorManager.js
  var InterceptorManager = class {
    constructor() {
      this.handlers = [];
    }
    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    }
    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {void}
     */
    eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }
    /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */
    clear() {
      if (this.handlers) {
        this.handlers = [];
      }
    }
    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */
    forEach(fn) {
      utils_default.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    }
  };
  var InterceptorManager_default = InterceptorManager;

  // node_modules/axios/lib/defaults/transitional.js
  var transitional_default = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };

  // node_modules/axios/lib/platform/browser/classes/URLSearchParams.js
  var URLSearchParams_default = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams_default;

  // node_modules/axios/lib/platform/browser/classes/FormData.js
  var FormData_default = typeof FormData !== "undefined" ? FormData : null;

  // node_modules/axios/lib/platform/browser/classes/Blob.js
  var Blob_default = typeof Blob !== "undefined" ? Blob : null;

  // node_modules/axios/lib/platform/browser/index.js
  var browser_default = {
    isBrowser: true,
    classes: {
      URLSearchParams: URLSearchParams_default,
      FormData: FormData_default,
      Blob: Blob_default
    },
    protocols: ["http", "https", "file", "blob", "url", "data"]
  };

  // node_modules/axios/lib/platform/common/utils.js
  var utils_exports = {};
  __export(utils_exports, {
    hasBrowserEnv: () => hasBrowserEnv,
    hasStandardBrowserEnv: () => hasStandardBrowserEnv,
    hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv,
    navigator: () => _navigator,
    origin: () => origin
  });
  var hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
  var _navigator = typeof navigator === "object" && navigator || void 0;
  var hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
  var hasStandardBrowserWebWorkerEnv = (() => {
    return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
  })();
  var origin = hasBrowserEnv && window.location.href || "http://localhost";

  // node_modules/axios/lib/platform/index.js
  var platform_default = {
    ...utils_exports,
    ...browser_default
  };

  // node_modules/axios/lib/helpers/toURLEncodedForm.js
  function toURLEncodedForm(data, options) {
    return toFormData_default(data, new platform_default.classes.URLSearchParams(), {
      visitor: function(value, key, path, helpers) {
        if (platform_default.isNode && utils_default.isBuffer(value)) {
          this.append(key, value.toString("base64"));
          return false;
        }
        return helpers.defaultVisitor.apply(this, arguments);
      },
      ...options
    });
  }

  // node_modules/axios/lib/helpers/formDataToJSON.js
  function parsePropPath(name) {
    return utils_default.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
      return match[0] === "[]" ? "" : match[1] || match[0];
    });
  }
  function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = arr[key];
    }
    return obj;
  }
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index2) {
      let name = path[index2++];
      if (name === "__proto__") return true;
      const isNumericKey = Number.isFinite(+name);
      const isLast = index2 >= path.length;
      name = !name && utils_default.isArray(target) ? target.length : name;
      if (isLast) {
        if (utils_default.hasOwnProp(target, name)) {
          target[name] = [target[name], value];
        } else {
          target[name] = value;
        }
        return !isNumericKey;
      }
      if (!target[name] || !utils_default.isObject(target[name])) {
        target[name] = [];
      }
      const result = buildPath(path, value, target[name], index2);
      if (result && utils_default.isArray(target[name])) {
        target[name] = arrayToObject(target[name]);
      }
      return !isNumericKey;
    }
    if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
      const obj = {};
      utils_default.forEachEntry(formData, (name, value) => {
        buildPath(parsePropPath(name), value, obj, 0);
      });
      return obj;
    }
    return null;
  }
  var formDataToJSON_default = formDataToJSON;

  // node_modules/axios/lib/defaults/index.js
  function stringifySafely(rawValue, parser, encoder) {
    if (utils_default.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils_default.trim(rawValue);
      } catch (e) {
        if (e.name !== "SyntaxError") {
          throw e;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  var defaults = {
    transitional: transitional_default,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [function transformRequest(data, headers) {
      const contentType = headers.getContentType() || "";
      const hasJSONContentType = contentType.indexOf("application/json") > -1;
      const isObjectPayload = utils_default.isObject(data);
      if (isObjectPayload && utils_default.isHTMLForm(data)) {
        data = new FormData(data);
      }
      const isFormData2 = utils_default.isFormData(data);
      if (isFormData2) {
        return hasJSONContentType ? JSON.stringify(formDataToJSON_default(data)) : data;
      }
      if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data) || utils_default.isReadableStream(data)) {
        return data;
      }
      if (utils_default.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils_default.isURLSearchParams(data)) {
        headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
        return data.toString();
      }
      let isFileList2;
      if (isObjectPayload) {
        if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
          return toURLEncodedForm(data, this.formSerializer).toString();
        }
        if ((isFileList2 = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
          const _FormData = this.env && this.env.FormData;
          return toFormData_default(
            isFileList2 ? { "files[]": data } : data,
            _FormData && new _FormData(),
            this.formSerializer
          );
        }
      }
      if (isObjectPayload || hasJSONContentType) {
        headers.setContentType("application/json", false);
        return stringifySafely(data);
      }
      return data;
    }],
    transformResponse: [function transformResponse(data) {
      const transitional2 = this.transitional || defaults.transitional;
      const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
      const JSONRequested = this.responseType === "json";
      if (utils_default.isResponse(data) || utils_default.isReadableStream(data)) {
        return data;
      }
      if (data && utils_default.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
        const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;
        try {
          return JSON.parse(data, this.parseReviver);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw AxiosError_default.from(e, AxiosError_default.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
        }
      }
      return data;
    }],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: platform_default.classes.FormData,
      Blob: platform_default.classes.Blob
    },
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": void 0
      }
    }
  };
  utils_default.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
    defaults.headers[method] = {};
  });
  var defaults_default = defaults;

  // node_modules/axios/lib/helpers/parseHeaders.js
  var ignoreDuplicateOf = utils_default.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ]);
  var parseHeaders_default = (rawHeaders) => {
    const parsed = {};
    let key;
    let val;
    let i;
    rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
      i = line.indexOf(":");
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();
      if (!key || parsed[key] && ignoreDuplicateOf[key]) {
        return;
      }
      if (key === "set-cookie") {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    });
    return parsed;
  };

  // node_modules/axios/lib/core/AxiosHeaders.js
  var $internals = /* @__PURE__ */ Symbol("internals");
  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }
  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }
    return utils_default.isArray(value) ? value.map(normalizeValue) : String(value);
  }
  function parseTokens(str) {
    const tokens = /* @__PURE__ */ Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while (match = tokensRE.exec(str)) {
      tokens[match[1]] = match[2];
    }
    return tokens;
  }
  var isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
  function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
    if (utils_default.isFunction(filter2)) {
      return filter2.call(this, value, header);
    }
    if (isHeaderNameFilter) {
      value = header;
    }
    if (!utils_default.isString(value)) return;
    if (utils_default.isString(filter2)) {
      return value.indexOf(filter2) !== -1;
    }
    if (utils_default.isRegExp(filter2)) {
      return filter2.test(value);
    }
  }
  function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
  }
  function buildAccessors(obj, header) {
    const accessorName = utils_default.toCamelCase(" " + header);
    ["get", "set", "has"].forEach((methodName) => {
      Object.defineProperty(obj, methodName + accessorName, {
        value: function(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }
  var AxiosHeaders = class {
    constructor(headers) {
      headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
      const self2 = this;
      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);
        if (!lHeader) {
          throw new Error("header name must be a non-empty string");
        }
        const key = utils_default.findKey(self2, lHeader);
        if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
          self2[key || _header] = normalizeValue(_value);
        }
      }
      const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
      if (utils_default.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders_default(header), valueOrRewrite);
      } else if (utils_default.isObject(header) && utils_default.isIterable(header)) {
        let obj = {}, dest, key;
        for (const entry of header) {
          if (!utils_default.isArray(entry)) {
            throw TypeError("Object iterator must return a key-value pair");
          }
          obj[key = entry[0]] = (dest = obj[key]) ? utils_default.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
        }
        setHeaders(obj, valueOrRewrite);
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }
      return this;
    }
    get(header, parser) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils_default.findKey(this, header);
        if (key) {
          const value = this[key];
          if (!parser) {
            return value;
          }
          if (parser === true) {
            return parseTokens(value);
          }
          if (utils_default.isFunction(parser)) {
            return parser.call(this, value, key);
          }
          if (utils_default.isRegExp(parser)) {
            return parser.exec(value);
          }
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(header, matcher) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils_default.findKey(this, header);
        return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }
      return false;
    }
    delete(header, matcher) {
      const self2 = this;
      let deleted = false;
      function deleteHeader(_header) {
        _header = normalizeHeader(_header);
        if (_header) {
          const key = utils_default.findKey(self2, _header);
          if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
            delete self2[key];
            deleted = true;
          }
        }
      }
      if (utils_default.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }
      return deleted;
    }
    clear(matcher) {
      const keys = Object.keys(this);
      let i = keys.length;
      let deleted = false;
      while (i--) {
        const key = keys[i];
        if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }
      return deleted;
    }
    normalize(format) {
      const self2 = this;
      const headers = {};
      utils_default.forEach(this, (value, header) => {
        const key = utils_default.findKey(headers, header);
        if (key) {
          self2[key] = normalizeValue(value);
          delete self2[header];
          return;
        }
        const normalized = format ? formatHeader(header) : String(header).trim();
        if (normalized !== header) {
          delete self2[header];
        }
        self2[normalized] = normalizeValue(value);
        headers[normalized] = true;
      });
      return this;
    }
    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
      const obj = /* @__PURE__ */ Object.create(null);
      utils_default.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
      });
      return obj;
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
    }
    getSetCookie() {
      return this.get("set-cookie") || [];
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
      const computed = new this(first);
      targets.forEach((target) => computed.set(target));
      return computed;
    }
    static accessor(header) {
      const internals = this[$internals] = this[$internals] = {
        accessors: {}
      };
      const accessors = internals.accessors;
      const prototype3 = this.prototype;
      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);
        if (!accessors[lHeader]) {
          buildAccessors(prototype3, _header);
          accessors[lHeader] = true;
        }
      }
      utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
      return this;
    }
  };
  AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
  utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1);
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    };
  });
  utils_default.freezeMethods(AxiosHeaders);
  var AxiosHeaders_default = AxiosHeaders;

  // node_modules/axios/lib/core/transformData.js
  function transformData(fns, response) {
    const config = this || defaults_default;
    const context = response || config;
    const headers = AxiosHeaders_default.from(context.headers);
    let data = context.data;
    utils_default.forEach(fns, function transform(fn) {
      data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
    });
    headers.normalize();
    return data;
  }

  // node_modules/axios/lib/cancel/isCancel.js
  function isCancel(value) {
    return !!(value && value.__CANCEL__);
  }

  // node_modules/axios/lib/cancel/CanceledError.js
  function CanceledError(message, config, request) {
    AxiosError_default.call(this, message == null ? "canceled" : message, AxiosError_default.ERR_CANCELED, config, request);
    this.name = "CanceledError";
  }
  utils_default.inherits(CanceledError, AxiosError_default, {
    __CANCEL__: true
  });
  var CanceledError_default = CanceledError;

  // node_modules/axios/lib/core/settle.js
  function settle(resolve, reject, response) {
    const validateStatus2 = response.config.validateStatus;
    if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError_default(
        "Request failed with status code " + response.status,
        [AxiosError_default.ERR_BAD_REQUEST, AxiosError_default.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  }

  // node_modules/axios/lib/helpers/parseProtocol.js
  function parseProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || "";
  }

  // node_modules/axios/lib/helpers/speedometer.js
  function speedometer(samplesCount, min2) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min2 = min2 !== void 0 ? min2 : 1e3;
    return function push(chunkLength) {
      const now = Date.now();
      const startedAt = timestamps[tail];
      if (!firstSampleTS) {
        firstSampleTS = now;
      }
      bytes[head] = chunkLength;
      timestamps[head] = now;
      let i = tail;
      let bytesCount = 0;
      while (i !== head) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }
      head = (head + 1) % samplesCount;
      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }
      if (now - firstSampleTS < min2) {
        return;
      }
      const passed = startedAt && now - startedAt;
      return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
    };
  }
  var speedometer_default = speedometer;

  // node_modules/axios/lib/helpers/throttle.js
  function throttle(fn, freq) {
    let timestamp = 0;
    let threshold = 1e3 / freq;
    let lastArgs;
    let timer;
    const invoke = (args, now = Date.now()) => {
      timestamp = now;
      lastArgs = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn(...args);
    };
    const throttled = (...args) => {
      const now = Date.now();
      const passed = now - timestamp;
      if (passed >= threshold) {
        invoke(args, now);
      } else {
        lastArgs = args;
        if (!timer) {
          timer = setTimeout(() => {
            timer = null;
            invoke(lastArgs);
          }, threshold - passed);
        }
      }
    };
    const flush = () => lastArgs && invoke(lastArgs);
    return [throttled, flush];
  }
  var throttle_default = throttle;

  // node_modules/axios/lib/helpers/progressEventReducer.js
  var progressEventReducer = (listener, isDownloadStream, freq = 3) => {
    let bytesNotified = 0;
    const _speedometer = speedometer_default(50, 250);
    return throttle_default((e) => {
      const loaded = e.loaded;
      const total = e.lengthComputable ? e.total : void 0;
      const progressBytes = loaded - bytesNotified;
      const rate = _speedometer(progressBytes);
      const inRange = loaded <= total;
      bytesNotified = loaded;
      const data = {
        loaded,
        total,
        progress: total ? loaded / total : void 0,
        bytes: progressBytes,
        rate: rate ? rate : void 0,
        estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
        event: e,
        lengthComputable: total != null,
        [isDownloadStream ? "download" : "upload"]: true
      };
      listener(data);
    }, freq);
  };
  var progressEventDecorator = (total, throttled) => {
    const lengthComputable = total != null;
    return [(loaded) => throttled[0]({
      lengthComputable,
      total,
      loaded
    }), throttled[1]];
  };
  var asyncDecorator = (fn) => (...args) => utils_default.asap(() => fn(...args));

  // node_modules/axios/lib/helpers/isURLSameOrigin.js
  var isURLSameOrigin_default = platform_default.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url) => {
    url = new URL(url, platform_default.origin);
    return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
  })(
    new URL(platform_default.origin),
    platform_default.navigator && /(msie|trident)/i.test(platform_default.navigator.userAgent)
  ) : () => true;

  // node_modules/axios/lib/helpers/cookies.js
  var cookies_default = platform_default.hasStandardBrowserEnv ? (
    // Standard browser envs support document.cookie
    {
      write(name, value, expires, path, domain, secure, sameSite) {
        if (typeof document === "undefined") return;
        const cookie = [`${name}=${encodeURIComponent(value)}`];
        if (utils_default.isNumber(expires)) {
          cookie.push(`expires=${new Date(expires).toUTCString()}`);
        }
        if (utils_default.isString(path)) {
          cookie.push(`path=${path}`);
        }
        if (utils_default.isString(domain)) {
          cookie.push(`domain=${domain}`);
        }
        if (secure === true) {
          cookie.push("secure");
        }
        if (utils_default.isString(sameSite)) {
          cookie.push(`SameSite=${sameSite}`);
        }
        document.cookie = cookie.join("; ");
      },
      read(name) {
        if (typeof document === "undefined") return null;
        const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
        return match ? decodeURIComponent(match[1]) : null;
      },
      remove(name) {
        this.write(name, "", Date.now() - 864e5, "/");
      }
    }
  ) : (
    // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {
      },
      read() {
        return null;
      },
      remove() {
      }
    }
  );

  // node_modules/axios/lib/helpers/isAbsoluteURL.js
  function isAbsoluteURL(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }

  // node_modules/axios/lib/helpers/combineURLs.js
  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  }

  // node_modules/axios/lib/core/buildFullPath.js
  function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
    let isRelativeUrl = !isAbsoluteURL(requestedURL);
    if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }

  // node_modules/axios/lib/core/mergeConfig.js
  var headersToObject = (thing) => thing instanceof AxiosHeaders_default ? { ...thing } : thing;
  function mergeConfig(config1, config2) {
    config2 = config2 || {};
    const config = {};
    function getMergedValue(target, source, prop, caseless) {
      if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) {
        return utils_default.merge.call({ caseless }, target, source);
      } else if (utils_default.isPlainObject(source)) {
        return utils_default.merge({}, source);
      } else if (utils_default.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(a, b, prop, caseless) {
      if (!utils_default.isUndefined(b)) {
        return getMergedValue(a, b, prop, caseless);
      } else if (!utils_default.isUndefined(a)) {
        return getMergedValue(void 0, a, prop, caseless);
      }
    }
    function valueFromConfig2(a, b) {
      if (!utils_default.isUndefined(b)) {
        return getMergedValue(void 0, b);
      }
    }
    function defaultToConfig2(a, b) {
      if (!utils_default.isUndefined(b)) {
        return getMergedValue(void 0, b);
      } else if (!utils_default.isUndefined(a)) {
        return getMergedValue(void 0, a);
      }
    }
    function mergeDirectKeys(a, b, prop) {
      if (prop in config2) {
        return getMergedValue(a, b);
      } else if (prop in config1) {
        return getMergedValue(void 0, a);
      }
    }
    const mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      withXSRFToken: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
    };
    utils_default.forEach(Object.keys({ ...config1, ...config2 }), function computeConfigValue(prop) {
      const merge2 = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge2(config1[prop], config2[prop], prop);
      utils_default.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
  }

  // node_modules/axios/lib/helpers/resolveConfig.js
  var resolveConfig_default = (config) => {
    const newConfig = mergeConfig({}, config);
    let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
    newConfig.headers = headers = AxiosHeaders_default.from(headers);
    newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
    if (auth) {
      headers.set(
        "Authorization",
        "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
      );
    }
    if (utils_default.isFormData(data)) {
      if (platform_default.hasStandardBrowserEnv || platform_default.hasStandardBrowserWebWorkerEnv) {
        headers.setContentType(void 0);
      } else if (utils_default.isFunction(data.getHeaders)) {
        const formHeaders = data.getHeaders();
        const allowedHeaders = ["content-type", "content-length"];
        Object.entries(formHeaders).forEach(([key, val]) => {
          if (allowedHeaders.includes(key.toLowerCase())) {
            headers.set(key, val);
          }
        });
      }
    }
    if (platform_default.hasStandardBrowserEnv) {
      withXSRFToken && utils_default.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
      if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin_default(newConfig.url)) {
        const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies_default.read(xsrfCookieName);
        if (xsrfValue) {
          headers.set(xsrfHeaderName, xsrfValue);
        }
      }
    }
    return newConfig;
  };

  // node_modules/axios/lib/adapters/xhr.js
  var isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
  var xhr_default = isXHRAdapterSupported && function(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      const _config = resolveConfig_default(config);
      let requestData = _config.data;
      const requestHeaders = AxiosHeaders_default.from(_config.headers).normalize();
      let { responseType, onUploadProgress, onDownloadProgress } = _config;
      let onCanceled;
      let uploadThrottled, downloadThrottled;
      let flushUpload, flushDownload;
      function done() {
        flushUpload && flushUpload();
        flushDownload && flushDownload();
        _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
        _config.signal && _config.signal.removeEventListener("abort", onCanceled);
      }
      let request = new XMLHttpRequest();
      request.open(_config.method.toUpperCase(), _config.url, true);
      request.timeout = _config.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        const responseHeaders = AxiosHeaders_default.from(
          "getAllResponseHeaders" in request && request.getAllResponseHeaders()
        );
        const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        };
        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);
        request = null;
      }
      if ("onloadend" in request) {
        request.onloadend = onloadend;
      } else {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(new AxiosError_default("Request aborted", AxiosError_default.ECONNABORTED, config, request));
        request = null;
      };
      request.onerror = function handleError(event) {
        const msg = event && event.message ? event.message : "Network Error";
        const err = new AxiosError_default(msg, AxiosError_default.ERR_NETWORK, config, request);
        err.event = event || null;
        reject(err);
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
        const transitional2 = _config.transitional || transitional_default;
        if (_config.timeoutErrorMessage) {
          timeoutErrorMessage = _config.timeoutErrorMessage;
        }
        reject(new AxiosError_default(
          timeoutErrorMessage,
          transitional2.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED,
          config,
          request
        ));
        request = null;
      };
      requestData === void 0 && requestHeaders.setContentType(null);
      if ("setRequestHeader" in request) {
        utils_default.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }
      if (!utils_default.isUndefined(_config.withCredentials)) {
        request.withCredentials = !!_config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = _config.responseType;
      }
      if (onDownloadProgress) {
        [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
        request.addEventListener("progress", downloadThrottled);
      }
      if (onUploadProgress && request.upload) {
        [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
        request.upload.addEventListener("progress", uploadThrottled);
        request.upload.addEventListener("loadend", flushUpload);
      }
      if (_config.cancelToken || _config.signal) {
        onCanceled = (cancel) => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError_default(null, config, request) : cancel);
          request.abort();
          request = null;
        };
        _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
        if (_config.signal) {
          _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
        }
      }
      const protocol = parseProtocol(_config.url);
      if (protocol && platform_default.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError_default("Unsupported protocol " + protocol + ":", AxiosError_default.ERR_BAD_REQUEST, config));
        return;
      }
      request.send(requestData || null);
    });
  };

  // node_modules/axios/lib/helpers/composeSignals.js
  var composeSignals = (signals, timeout) => {
    const { length } = signals = signals ? signals.filter(Boolean) : [];
    if (timeout || length) {
      let controller = new AbortController();
      let aborted;
      const onabort = function(reason) {
        if (!aborted) {
          aborted = true;
          unsubscribe();
          const err = reason instanceof Error ? reason : this.reason;
          controller.abort(err instanceof AxiosError_default ? err : new CanceledError_default(err instanceof Error ? err.message : err));
        }
      };
      let timer = timeout && setTimeout(() => {
        timer = null;
        onabort(new AxiosError_default(`timeout ${timeout} of ms exceeded`, AxiosError_default.ETIMEDOUT));
      }, timeout);
      const unsubscribe = () => {
        if (signals) {
          timer && clearTimeout(timer);
          timer = null;
          signals.forEach((signal2) => {
            signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
          });
          signals = null;
        }
      };
      signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
      const { signal } = controller;
      signal.unsubscribe = () => utils_default.asap(unsubscribe);
      return signal;
    }
  };
  var composeSignals_default = composeSignals;

  // node_modules/axios/lib/helpers/trackStream.js
  var streamChunk = function* (chunk, chunkSize) {
    let len = chunk.byteLength;
    if (!chunkSize || len < chunkSize) {
      yield chunk;
      return;
    }
    let pos = 0;
    let end;
    while (pos < len) {
      end = pos + chunkSize;
      yield chunk.slice(pos, end);
      pos = end;
    }
  };
  var readBytes = async function* (iterable, chunkSize) {
    for await (const chunk of readStream(iterable)) {
      yield* streamChunk(chunk, chunkSize);
    }
  };
  var readStream = async function* (stream) {
    if (stream[Symbol.asyncIterator]) {
      yield* stream;
      return;
    }
    const reader = stream.getReader();
    try {
      for (; ; ) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        yield value;
      }
    } finally {
      await reader.cancel();
    }
  };
  var trackStream = (stream, chunkSize, onProgress, onFinish) => {
    const iterator2 = readBytes(stream, chunkSize);
    let bytes = 0;
    let done;
    let _onFinish = (e) => {
      if (!done) {
        done = true;
        onFinish && onFinish(e);
      }
    };
    return new ReadableStream({
      async pull(controller) {
        try {
          const { done: done2, value } = await iterator2.next();
          if (done2) {
            _onFinish();
            controller.close();
            return;
          }
          let len = value.byteLength;
          if (onProgress) {
            let loadedBytes = bytes += len;
            onProgress(loadedBytes);
          }
          controller.enqueue(new Uint8Array(value));
        } catch (err) {
          _onFinish(err);
          throw err;
        }
      },
      cancel(reason) {
        _onFinish(reason);
        return iterator2.return();
      }
    }, {
      highWaterMark: 2
    });
  };

  // node_modules/axios/lib/adapters/fetch.js
  var DEFAULT_CHUNK_SIZE = 64 * 1024;
  var { isFunction: isFunction2 } = utils_default;
  var globalFetchAPI = (({ Request, Response }) => ({
    Request,
    Response
  }))(utils_default.global);
  var {
    ReadableStream: ReadableStream2,
    TextEncoder
  } = utils_default.global;
  var test = (fn, ...args) => {
    try {
      return !!fn(...args);
    } catch (e) {
      return false;
    }
  };
  var factory = (env) => {
    env = utils_default.merge.call({
      skipUndefined: true
    }, globalFetchAPI, env);
    const { fetch: envFetch, Request, Response } = env;
    const isFetchSupported = envFetch ? isFunction2(envFetch) : typeof fetch === "function";
    const isRequestSupported = isFunction2(Request);
    const isResponseSupported = isFunction2(Response);
    if (!isFetchSupported) {
      return false;
    }
    const isReadableStreamSupported = isFetchSupported && isFunction2(ReadableStream2);
    const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));
    const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
      let duplexAccessed = false;
      const hasContentType = new Request(platform_default.origin, {
        body: new ReadableStream2(),
        method: "POST",
        get duplex() {
          duplexAccessed = true;
          return "half";
        }
      }).headers.has("Content-Type");
      return duplexAccessed && !hasContentType;
    });
    const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils_default.isReadableStream(new Response("").body));
    const resolvers = {
      stream: supportsResponseStream && ((res) => res.body)
    };
    isFetchSupported && (() => {
      ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
        !resolvers[type] && (resolvers[type] = (res, config) => {
          let method = res && res[type];
          if (method) {
            return method.call(res);
          }
          throw new AxiosError_default(`Response type '${type}' is not supported`, AxiosError_default.ERR_NOT_SUPPORT, config);
        });
      });
    })();
    const getBodyLength = async (body) => {
      if (body == null) {
        return 0;
      }
      if (utils_default.isBlob(body)) {
        return body.size;
      }
      if (utils_default.isSpecCompliantForm(body)) {
        const _request = new Request(platform_default.origin, {
          method: "POST",
          body
        });
        return (await _request.arrayBuffer()).byteLength;
      }
      if (utils_default.isArrayBufferView(body) || utils_default.isArrayBuffer(body)) {
        return body.byteLength;
      }
      if (utils_default.isURLSearchParams(body)) {
        body = body + "";
      }
      if (utils_default.isString(body)) {
        return (await encodeText(body)).byteLength;
      }
    };
    const resolveBodyLength = async (headers, body) => {
      const length = utils_default.toFiniteNumber(headers.getContentLength());
      return length == null ? getBodyLength(body) : length;
    };
    return async (config) => {
      let {
        url,
        method,
        data,
        signal,
        cancelToken,
        timeout,
        onDownloadProgress,
        onUploadProgress,
        responseType,
        headers,
        withCredentials = "same-origin",
        fetchOptions
      } = resolveConfig_default(config);
      let _fetch = envFetch || fetch;
      responseType = responseType ? (responseType + "").toLowerCase() : "text";
      let composedSignal = composeSignals_default([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
      let request = null;
      const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
        composedSignal.unsubscribe();
      });
      let requestContentLength;
      try {
        if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
          let _request = new Request(url, {
            method: "POST",
            body: data,
            duplex: "half"
          });
          let contentTypeHeader;
          if (utils_default.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
            headers.setContentType(contentTypeHeader);
          }
          if (_request.body) {
            const [onProgress, flush] = progressEventDecorator(
              requestContentLength,
              progressEventReducer(asyncDecorator(onUploadProgress))
            );
            data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
          }
        }
        if (!utils_default.isString(withCredentials)) {
          withCredentials = withCredentials ? "include" : "omit";
        }
        const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
        const resolvedOptions = {
          ...fetchOptions,
          signal: composedSignal,
          method: method.toUpperCase(),
          headers: headers.normalize().toJSON(),
          body: data,
          duplex: "half",
          credentials: isCredentialsSupported ? withCredentials : void 0
        };
        request = isRequestSupported && new Request(url, resolvedOptions);
        let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions));
        const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
        if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
          const options = {};
          ["status", "statusText", "headers"].forEach((prop) => {
            options[prop] = response[prop];
          });
          const responseContentLength = utils_default.toFiniteNumber(response.headers.get("content-length"));
          const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
            responseContentLength,
            progressEventReducer(asyncDecorator(onDownloadProgress), true)
          ) || [];
          response = new Response(
            trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
              flush && flush();
              unsubscribe && unsubscribe();
            }),
            options
          );
        }
        responseType = responseType || "text";
        let responseData = await resolvers[utils_default.findKey(resolvers, responseType) || "text"](response, config);
        !isStreamResponse && unsubscribe && unsubscribe();
        return await new Promise((resolve, reject) => {
          settle(resolve, reject, {
            data: responseData,
            headers: AxiosHeaders_default.from(response.headers),
            status: response.status,
            statusText: response.statusText,
            config,
            request
          });
        });
      } catch (err) {
        unsubscribe && unsubscribe();
        if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
          throw Object.assign(
            new AxiosError_default("Network Error", AxiosError_default.ERR_NETWORK, config, request),
            {
              cause: err.cause || err
            }
          );
        }
        throw AxiosError_default.from(err, err && err.code, config, request);
      }
    };
  };
  var seedCache = /* @__PURE__ */ new Map();
  var getFetch = (config) => {
    let env = config && config.env || {};
    const { fetch: fetch2, Request, Response } = env;
    const seeds = [
      Request,
      Response,
      fetch2
    ];
    let len = seeds.length, i = len, seed, target, map = seedCache;
    while (i--) {
      seed = seeds[i];
      target = map.get(seed);
      target === void 0 && map.set(seed, target = i ? /* @__PURE__ */ new Map() : factory(env));
      map = target;
    }
    return target;
  };
  var adapter = getFetch();

  // node_modules/axios/lib/adapters/adapters.js
  var knownAdapters = {
    http: null_default,
    xhr: xhr_default,
    fetch: {
      get: getFetch
    }
  };
  utils_default.forEach(knownAdapters, (fn, value) => {
    if (fn) {
      try {
        Object.defineProperty(fn, "name", { value });
      } catch (e) {
      }
      Object.defineProperty(fn, "adapterName", { value });
    }
  });
  var renderReason = (reason) => `- ${reason}`;
  var isResolvedHandle = (adapter2) => utils_default.isFunction(adapter2) || adapter2 === null || adapter2 === false;
  function getAdapter(adapters, config) {
    adapters = utils_default.isArray(adapters) ? adapters : [adapters];
    const { length } = adapters;
    let nameOrAdapter;
    let adapter2;
    const rejectedReasons = {};
    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;
      adapter2 = nameOrAdapter;
      if (!isResolvedHandle(nameOrAdapter)) {
        adapter2 = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
        if (adapter2 === void 0) {
          throw new AxiosError_default(`Unknown adapter '${id}'`);
        }
      }
      if (adapter2 && (utils_default.isFunction(adapter2) || (adapter2 = adapter2.get(config)))) {
        break;
      }
      rejectedReasons[id || "#" + i] = adapter2;
    }
    if (!adapter2) {
      const reasons = Object.entries(rejectedReasons).map(
        ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
      );
      let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
      throw new AxiosError_default(
        `There is no suitable adapter to dispatch the request ` + s,
        "ERR_NOT_SUPPORT"
      );
    }
    return adapter2;
  }
  var adapters_default = {
    /**
     * Resolve an adapter from a list of adapter names or functions.
     * @type {Function}
     */
    getAdapter,
    /**
     * Exposes all known adapters
     * @type {Object<string, Function|Object>}
     */
    adapters: knownAdapters
  };

  // node_modules/axios/lib/core/dispatchRequest.js
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
      throw new CanceledError_default(null, config);
    }
  }
  function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    config.headers = AxiosHeaders_default.from(config.headers);
    config.data = transformData.call(
      config,
      config.transformRequest
    );
    if (["post", "put", "patch"].indexOf(config.method) !== -1) {
      config.headers.setContentType("application/x-www-form-urlencoded", false);
    }
    const adapter2 = adapters_default.getAdapter(config.adapter || defaults_default.adapter, config);
    return adapter2(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      response.data = transformData.call(
        config,
        config.transformResponse,
        response
      );
      response.headers = AxiosHeaders_default.from(response.headers);
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            config.transformResponse,
            reason.response
          );
          reason.response.headers = AxiosHeaders_default.from(reason.response.headers);
        }
      }
      return Promise.reject(reason);
    });
  }

  // node_modules/axios/lib/env/data.js
  var VERSION = "1.13.2";

  // node_modules/axios/lib/helpers/validator.js
  var validators = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
    validators[type] = function validator(thing) {
      return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
  });
  var deprecatedWarnings = {};
  validators.transitional = function transitional(validator, version, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return (value, opt, opts) => {
      if (validator === false) {
        throw new AxiosError_default(
          formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
          AxiosError_default.ERR_DEPRECATED
        );
      }
      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(
          formatMessage(
            opt,
            " has been deprecated since v" + version + " and will be removed in the near future"
          )
        );
      }
      return validator ? validator(value, opt, opts) : true;
    };
  };
  validators.spelling = function spelling(correctSpelling) {
    return (value, opt) => {
      console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
      return true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new AxiosError_default("options must be an object", AxiosError_default.ERR_BAD_OPTION_VALUE);
    }
    const keys = Object.keys(options);
    let i = keys.length;
    while (i-- > 0) {
      const opt = keys[i];
      const validator = schema[opt];
      if (validator) {
        const value = options[opt];
        const result = value === void 0 || validator(value, opt, options);
        if (result !== true) {
          throw new AxiosError_default("option " + opt + " must be " + result, AxiosError_default.ERR_BAD_OPTION_VALUE);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError_default("Unknown option " + opt, AxiosError_default.ERR_BAD_OPTION);
      }
    }
  }
  var validator_default = {
    assertOptions,
    validators
  };

  // node_modules/axios/lib/core/Axios.js
  var validators2 = validator_default.validators;
  var Axios = class {
    constructor(instanceConfig) {
      this.defaults = instanceConfig || {};
      this.interceptors = {
        request: new InterceptorManager_default(),
        response: new InterceptorManager_default()
      };
    }
    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    async request(configOrUrl, config) {
      try {
        return await this._request(configOrUrl, config);
      } catch (err) {
        if (err instanceof Error) {
          let dummy = {};
          Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
          const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
          try {
            if (!err.stack) {
              err.stack = stack;
            } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
              err.stack += "\n" + stack;
            }
          } catch (e) {
          }
        }
        throw err;
      }
    }
    _request(configOrUrl, config) {
      if (typeof configOrUrl === "string") {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }
      config = mergeConfig(this.defaults, config);
      const { transitional: transitional2, paramsSerializer, headers } = config;
      if (transitional2 !== void 0) {
        validator_default.assertOptions(transitional2, {
          silentJSONParsing: validators2.transitional(validators2.boolean),
          forcedJSONParsing: validators2.transitional(validators2.boolean),
          clarifyTimeoutError: validators2.transitional(validators2.boolean)
        }, false);
      }
      if (paramsSerializer != null) {
        if (utils_default.isFunction(paramsSerializer)) {
          config.paramsSerializer = {
            serialize: paramsSerializer
          };
        } else {
          validator_default.assertOptions(paramsSerializer, {
            encode: validators2.function,
            serialize: validators2.function
          }, true);
        }
      }
      if (config.allowAbsoluteUrls !== void 0) {
      } else if (this.defaults.allowAbsoluteUrls !== void 0) {
        config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
      } else {
        config.allowAbsoluteUrls = true;
      }
      validator_default.assertOptions(config, {
        baseUrl: validators2.spelling("baseURL"),
        withXsrfToken: validators2.spelling("withXSRFToken")
      }, true);
      config.method = (config.method || this.defaults.method || "get").toLowerCase();
      let contextHeaders = headers && utils_default.merge(
        headers.common,
        headers[config.method]
      );
      headers && utils_default.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (method) => {
          delete headers[method];
        }
      );
      config.headers = AxiosHeaders_default.concat(contextHeaders, headers);
      const requestInterceptorChain = [];
      let synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      const responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      let promise;
      let i = 0;
      let len;
      if (!synchronousRequestInterceptors) {
        const chain = [dispatchRequest.bind(this), void 0];
        chain.unshift(...requestInterceptorChain);
        chain.push(...responseInterceptorChain);
        len = chain.length;
        promise = Promise.resolve(config);
        while (i < len) {
          promise = promise.then(chain[i++], chain[i++]);
        }
        return promise;
      }
      len = requestInterceptorChain.length;
      let newConfig = config;
      while (i < len) {
        const onFulfilled = requestInterceptorChain[i++];
        const onRejected = requestInterceptorChain[i++];
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected.call(this, error);
          break;
        }
      }
      try {
        promise = dispatchRequest.call(this, newConfig);
      } catch (error) {
        return Promise.reject(error);
      }
      i = 0;
      len = responseInterceptorChain.length;
      while (i < len) {
        promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
      }
      return promise;
    }
    getUri(config) {
      config = mergeConfig(this.defaults, config);
      const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    }
  };
  utils_default.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios.prototype[method] = function(url, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });
  utils_default.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          headers: isForm ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url,
          data
        }));
      };
    }
    Axios.prototype[method] = generateHTTPMethod();
    Axios.prototype[method + "Form"] = generateHTTPMethod(true);
  });
  var Axios_default = Axios;

  // node_modules/axios/lib/cancel/CancelToken.js
  var CancelToken = class _CancelToken {
    constructor(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      let resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      const token = this;
      this.promise.then((cancel) => {
        if (!token._listeners) return;
        let i = token._listeners.length;
        while (i-- > 0) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = (onfulfilled) => {
        let _resolve;
        const promise = new Promise((resolve) => {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message, config, request) {
        if (token.reason) {
          return;
        }
        token.reason = new CanceledError_default(message, config, request);
        resolvePromise(token.reason);
      });
    }
    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    }
    /**
     * Subscribe to the cancel signal
     */
    subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    }
    /**
     * Unsubscribe from the cancel signal
     */
    unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      const index2 = this._listeners.indexOf(listener);
      if (index2 !== -1) {
        this._listeners.splice(index2, 1);
      }
    }
    toAbortSignal() {
      const controller = new AbortController();
      const abort = (err) => {
        controller.abort(err);
      };
      this.subscribe(abort);
      controller.signal.unsubscribe = () => this.unsubscribe(abort);
      return controller.signal;
    }
    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source() {
      let cancel;
      const token = new _CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    }
  };
  var CancelToken_default = CancelToken;

  // node_modules/axios/lib/helpers/spread.js
  function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }

  // node_modules/axios/lib/helpers/isAxiosError.js
  function isAxiosError(payload) {
    return utils_default.isObject(payload) && payload.isAxiosError === true;
  }

  // node_modules/axios/lib/helpers/HttpStatusCode.js
  var HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
    WebServerIsDown: 521,
    ConnectionTimedOut: 522,
    OriginIsUnreachable: 523,
    TimeoutOccurred: 524,
    SslHandshakeFailed: 525,
    InvalidSslCertificate: 526
  };
  Object.entries(HttpStatusCode).forEach(([key, value]) => {
    HttpStatusCode[value] = key;
  });
  var HttpStatusCode_default = HttpStatusCode;

  // node_modules/axios/lib/axios.js
  function createInstance(defaultConfig) {
    const context = new Axios_default(defaultConfig);
    const instance = bind(Axios_default.prototype.request, context);
    utils_default.extend(instance, Axios_default.prototype, context, { allOwnKeys: true });
    utils_default.extend(instance, context, null, { allOwnKeys: true });
    instance.create = function create2(instanceConfig) {
      return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };
    return instance;
  }
  var axios = createInstance(defaults_default);
  axios.Axios = Axios_default;
  axios.CanceledError = CanceledError_default;
  axios.CancelToken = CancelToken_default;
  axios.isCancel = isCancel;
  axios.VERSION = VERSION;
  axios.toFormData = toFormData_default;
  axios.AxiosError = AxiosError_default;
  axios.Cancel = axios.CanceledError;
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread;
  axios.isAxiosError = isAxiosError;
  axios.mergeConfig = mergeConfig;
  axios.AxiosHeaders = AxiosHeaders_default;
  axios.formToJSON = (thing) => formDataToJSON_default(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
  axios.getAdapter = adapters_default.getAdapter;
  axios.HttpStatusCode = HttpStatusCode_default;
  axios.default = axios;
  var axios_default = axios;

  // node_modules/axios/index.js
  var {
    Axios: Axios2,
    AxiosError: AxiosError2,
    CanceledError: CanceledError2,
    isCancel: isCancel2,
    CancelToken: CancelToken2,
    VERSION: VERSION2,
    all: all2,
    Cancel,
    isAxiosError: isAxiosError2,
    spread: spread2,
    toFormData: toFormData2,
    AxiosHeaders: AxiosHeaders2,
    HttpStatusCode: HttpStatusCode2,
    formToJSON,
    getAdapter: getAdapter2,
    mergeConfig: mergeConfig2
  } = axios_default;

  // node_modules/zustand/esm/vanilla.mjs
  var createStoreImpl = (createState) => {
    let state;
    const listeners = /* @__PURE__ */ new Set();
    const setState = (partial, replace) => {
      const nextState = typeof partial === "function" ? partial(state) : partial;
      if (!Object.is(nextState, state)) {
        const previousState = state;
        state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
        listeners.forEach((listener) => listener(state, previousState));
      }
    };
    const getState2 = () => state;
    const getInitialState = () => initialState;
    const subscribe = (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    };
    const api2 = { setState, getState: getState2, getInitialState, subscribe };
    const initialState = state = createState(setState, getState2, api2);
    return api2;
  };
  var createStore = ((createState) => createState ? createStoreImpl(createState) : createStoreImpl);

  // node_modules/zustand/esm/react.mjs
  var import_react = __toESM(require_react(), 1);
  var identity = (arg) => arg;
  function useStore(api2, selector = identity) {
    const slice = import_react.default.useSyncExternalStore(
      api2.subscribe,
      import_react.default.useCallback(() => selector(api2.getState()), [api2, selector]),
      import_react.default.useCallback(() => selector(api2.getInitialState()), [api2, selector])
    );
    import_react.default.useDebugValue(slice);
    return slice;
  }
  var createImpl = (createState) => {
    const api2 = createStore(createState);
    const useBoundStore = (selector) => useStore(api2, selector);
    Object.assign(useBoundStore, api2);
    return useBoundStore;
  };
  var create = ((createState) => createState ? createImpl(createState) : createImpl);

  // node_modules/zustand/esm/middleware.mjs
  function createJSONStorage(getStorage, options) {
    let storage;
    try {
      storage = getStorage();
    } catch (e) {
      return;
    }
    const persistStorage = {
      getItem: (name) => {
        var _a;
        const parse2 = (str2) => {
          if (str2 === null) {
            return null;
          }
          return JSON.parse(str2, options == null ? void 0 : options.reviver);
        };
        const str = (_a = storage.getItem(name)) != null ? _a : null;
        if (str instanceof Promise) {
          return str.then(parse2);
        }
        return parse2(str);
      },
      setItem: (name, newValue) => storage.setItem(name, JSON.stringify(newValue, options == null ? void 0 : options.replacer)),
      removeItem: (name) => storage.removeItem(name)
    };
    return persistStorage;
  }
  var toThenable = (fn) => (input) => {
    try {
      const result = fn(input);
      if (result instanceof Promise) {
        return result;
      }
      return {
        then(onFulfilled) {
          return toThenable(onFulfilled)(result);
        },
        catch(_onRejected) {
          return this;
        }
      };
    } catch (e) {
      return {
        then(_onFulfilled) {
          return this;
        },
        catch(onRejected) {
          return toThenable(onRejected)(e);
        }
      };
    }
  };
  var persistImpl = (config, baseOptions) => (set, get, api2) => {
    let options = {
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => state,
      version: 0,
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState
      }),
      ...baseOptions
    };
    let hasHydrated = false;
    const hydrationListeners = /* @__PURE__ */ new Set();
    const finishHydrationListeners = /* @__PURE__ */ new Set();
    let storage = options.storage;
    if (!storage) {
      return config(
        (...args) => {
          console.warn(
            `[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`
          );
          set(...args);
        },
        get,
        api2
      );
    }
    const setItem = () => {
      const state = options.partialize({ ...get() });
      return storage.setItem(options.name, {
        state,
        version: options.version
      });
    };
    const savedSetState = api2.setState;
    api2.setState = (state, replace) => {
      savedSetState(state, replace);
      return setItem();
    };
    const configResult = config(
      (...args) => {
        set(...args);
        return setItem();
      },
      get,
      api2
    );
    api2.getInitialState = () => configResult;
    let stateFromStorage;
    const hydrate = () => {
      var _a, _b;
      if (!storage) return;
      hasHydrated = false;
      hydrationListeners.forEach((cb) => {
        var _a2;
        return cb((_a2 = get()) != null ? _a2 : configResult);
      });
      const postRehydrationCallback = ((_b = options.onRehydrateStorage) == null ? void 0 : _b.call(options, (_a = get()) != null ? _a : configResult)) || void 0;
      return toThenable(storage.getItem.bind(storage))(options.name).then((deserializedStorageValue) => {
        if (deserializedStorageValue) {
          if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
            if (options.migrate) {
              const migration = options.migrate(
                deserializedStorageValue.state,
                deserializedStorageValue.version
              );
              if (migration instanceof Promise) {
                return migration.then((result) => [true, result]);
              }
              return [true, migration];
            }
            console.error(
              `State loaded from storage couldn't be migrated since no migrate function was provided`
            );
          } else {
            return [false, deserializedStorageValue.state];
          }
        }
        return [false, void 0];
      }).then((migrationResult) => {
        var _a2;
        const [migrated, migratedState] = migrationResult;
        stateFromStorage = options.merge(
          migratedState,
          (_a2 = get()) != null ? _a2 : configResult
        );
        set(stateFromStorage, true);
        if (migrated) {
          return setItem();
        }
      }).then(() => {
        postRehydrationCallback == null ? void 0 : postRehydrationCallback(stateFromStorage, void 0);
        stateFromStorage = get();
        hasHydrated = true;
        finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
      }).catch((e) => {
        postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
      });
    };
    api2.persist = {
      setOptions: (newOptions) => {
        options = {
          ...options,
          ...newOptions
        };
        if (newOptions.storage) {
          storage = newOptions.storage;
        }
      },
      clearStorage: () => {
        storage == null ? void 0 : storage.removeItem(options.name);
      },
      getOptions: () => options,
      rehydrate: () => hydrate(),
      hasHydrated: () => hasHydrated,
      onHydrate: (cb) => {
        hydrationListeners.add(cb);
        return () => {
          hydrationListeners.delete(cb);
        };
      },
      onFinishHydration: (cb) => {
        finishHydrationListeners.add(cb);
        return () => {
          finishHydrationListeners.delete(cb);
        };
      }
    };
    if (!options.skipHydration) {
      hydrate();
    }
    return stateFromStorage || configResult;
  };
  var persist = persistImpl;

  // store/authStore.ts
  var useAuthStore = create()(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        _hasHydrated: false,
        setHasHydrated: (state) => {
          set({ _hasHydrated: state });
        },
        login: (user, token) => {
          set({ user, token, isAuthenticated: true });
          if (typeof window !== "undefined" && window.localStorage) {
            try {
              localStorage.setItem("token", token || "");
              localStorage.setItem("user", JSON.stringify(user || {}));
            } catch (e) {
              console.warn("Failed to persist auth to localStorage", e);
            }
          }
        },
        logout: () => {
          set({ user: null, token: null, isAuthenticated: false });
          if (typeof window !== "undefined" && window.localStorage) {
            try {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              localStorage.removeItem("auth-storage");
            } catch (e) {
            }
          }
        },
        updateUser: (updates) => {
          const current = get().user;
          if (current) {
            const updated = { ...current, ...updates };
            set({ user: updated });
            if (typeof window !== "undefined" && window.localStorage) {
              try {
                localStorage.setItem("user", JSON.stringify(updated));
              } catch (e) {
              }
            }
          }
        },
        hasRole: (roles) => {
          const userRole = get().user?.role;
          if (!userRole) return false;
          if (typeof roles === "string") {
            return userRole === roles;
          }
          return roles.includes(userRole);
        }
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => {
          try {
            if (typeof window !== "undefined" && window.localStorage) {
              return localStorage;
            }
            if (typeof window !== "undefined" && window.sessionStorage) {
              return sessionStorage;
            }
            return {
              getItem: (_) => null,
              setItem: (_, __) => {
              },
              removeItem: (_) => {
              }
            };
          } catch (e) {
            console.warn("AuthStore: LocalStorage access blocked, falling back to memory storage", e);
            return {
              getItem: (_) => null,
              setItem: (_, __) => {
              },
              removeItem: (_) => {
              }
            };
          }
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
          try {
            if (typeof window !== "undefined" && window.localStorage) {
              const storedToken = localStorage.getItem("token");
              if (state && storedToken && state.token !== storedToken) {
                state.token = storedToken;
              }
            }
          } catch (e) {
          }
        },
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated
        })
      }
    )
  );

  // lib/api/endpoints.ts
  var API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";
  var api = axios_default.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json"
    }
  });
  api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      let token = null;
      try {
        token = localStorage.getItem("token");
      } catch (e) {
        console.warn("\u26A0\uFE0F endpoints.ts: LocalStorage access failed:", e);
      }
      if (!token) {
        try {
          const authState = useAuthStore.getState();
          if (authState.token) {
            token = authState.token;
            console.log("\u{1F510} endpoints.ts: recovered token from AuthStore");
          }
        } catch (e) {
          console.warn("\u26A0\uFE0F endpoints.ts: Failed to access AuthStore state:", e);
        }
      }
      const isAuthRequest = config.url?.includes("/login") || config.url?.includes("/register");
      if (token && token !== "undefined" && token !== "null" && !isAuthRequest) {
        if (true) {
          console.log("\u{1F510} endpoints.ts: Attaching token:", token.substring(0, 10) + "...");
        }
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        if (!isAuthRequest) {
          console.warn("\u26A0\uFE0F endpoints.ts: Invalid or missing token in localStorage/store:", token);
        }
      }
    }
    return config;
  });
  api.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response?.status === 401) {
        const url = error.config?.url || "";
        console.warn(`\u26A0\uFE0F 401 Unauthorized on ${url} - letting component handle error`);
        const errorMsg = error.response?.data?.message || "";
        const isSessionCheck = url.includes("/admin/profile") || url.includes("/teacher/profile") || url.includes("/students/profile");
        const isInvalidUser = errorMsg.includes("User not found") || errorMsg.includes("Unauthorized: User not found");
        if (isSessionCheck || isInvalidUser) {
          console.warn("\u26A0\uFE0F Session validation failed or User not found - clearing credentials");
          try {
            if (typeof window !== "undefined") {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
            }
          } catch (e) {
            console.error("Failed to clear local storage:", e);
          }
          if (typeof window !== "undefined" && isInvalidUser) {
            window.location.href = "/login";
          }
        }
      }
      return Promise.reject(error.response?.data || error);
    }
  );
  var adminSchoolAPI = {
    getSchool: (id) => api.get(`/admin/schools/${id}`),
    updateSchool: (id, data) => api.put(`/admin/schools/${id}`, data)
  };
  var adminAPI = {
    getStudents: (params) => api.get("/students", { params }),
    getStudent: (id) => api.get(`/students/${id}`),
    createStudent: (data) => api.post("/students", data),
    updateStudent: (id, data) => api.patch(`/students/${id}`, data),
    deleteStudent: (id) => api.delete(`/students/${id}`),
    getTeachers: (params) => api.get("/teachers", { params }),
    createTeacher: (data) => api.post("/teachers", data),
    updateTeacher: (id, data) => api.patch(`/teachers/${id}`, data),
    deleteTeacher: (id) => api.delete(`/teachers/${id}`),
    getAdmins: () => api.get("/admins"),
    withdrawTeacher: (id) => api.put(`/admins/withdraw/teacher/${id}`),
    restoreTeacher: (id) => api.put(`/admins/unwithdraw/teacher/${id}`),
    getClasses: () => api.get("/class-levels"),
    getAcademicYears: () => api.get("/academic-years"),
    createAcademicYear: (data) => api.post("/academic-years", data),
    updateAcademicYear: (id, data) => api.patch(`/academic-years/${id}`, data),
    deleteAcademicYear: (id) => api.delete(`/academic-years/${id}`),
    getAcademicTerms: () => api.get("/academic-term"),
    createAcademicTerm: (data) => api.post("/academic-term", data),
    updateAcademicTerm: (id, data) => api.patch(`/academic-term/${id}`, data),
    deleteAcademicTerm: (id) => api.delete(`/academic-term/${id}`),
    getDashboardStats: () => api.get("/admin/stats"),
    // Student dashboard
    getStudentDashboard: () => api.get("/students/dashboard"),
    // Documents
    getDocumentTemplates: () => api.get("/documents/templates"),
    createDocumentTemplate: (data) => api.post("/documents/templates", data),
    updateDocumentTemplate: (id, data) => api.put(`/documents/templates/${id}`, data),
    deleteDocumentTemplate: (id) => api.delete(`/documents/templates/${id}`),
    // Export utilities
    exportStudents: () => api.get("/admin/export/students", { responseType: "blob" }),
    exportTeachers: () => api.get("/admin/export/teachers", { responseType: "blob" }),
    bulkDownloadCards: (data) => api.post("/admin/cards/bulk-download", data, { responseType: "blob" })
  };
  var academicAPI = {
    getClasses: () => api.get("/class-levels"),
    createClass: (data) => api.post("/class-levels", data),
    getClass: (id) => api.get(`/class-levels/${id}`),
    updateClass: (id, data) => api.patch(`/class-levels/${id}`, data),
    deleteClass: (id) => api.delete(`/class-levels/${id}`),
    getPrograms: () => api.get("/programs"),
    createProgram: (data) => api.post("/programs", data),
    updateProgram: (id, data) => api.patch(`/programs/${id}`, data),
    deleteProgram: (id) => api.delete(`/programs/${id}`),
    getSubjects: () => api.get("/subject"),
    createSubject: (programId, data) => api.post(`/create-subject/${programId}`, data),
    createSimpleSubject: (data) => api.post("/subjects", data),
    updateSubject: (id, data) => api.patch(`/subject/${id}`, data),
    deleteSubject: (id) => api.delete(`/subject/${id}`),
    getStudentsByClass: (classId) => api.get(`/admin/students?currentClassLevel=${classId}`),
    getSubjectsByClass: (classId) => api.get(`/admin/subjects-by-class/${classId}`),
    getTeachersByClass: (classId) => api.get(`/admin/teachers-by-class/${classId}`),
    assignSubjectToClass: (classId, subjectId) => api.post(`/class-levels/${classId}/subjects/${subjectId}`),
    removeSubjectFromClass: (classId, subjectId) => api.delete(`/class-levels/${classId}/subjects/${subjectId}`),
    getAcademicYears: () => api.get("/academic-years"),
    getAcademicTerms: () => api.get("/academic-term")
  };
  var examAPI = {
    getAll: () => api.get("/exams"),
    getById: (id) => api.get(`/exams/${id}`),
    create: (data) => api.post("/exams", data),
    update: (id, data) => api.patch(`/exams/${id}`, data)
  };
  var hrAPI = {
    // Staff
    getStaff: (params) => api.get("/hr/staff", { params }),
    getStaffById: (id) => api.get(`/hr/staff/${id}`),
    createStaff: (data) => api.post("/hr/staff", data),
    updateStaff: (id, data) => api.put(`/hr/staff/${id}`, data),
    deleteStaff: (id) => api.delete(`/hr/staff/${id}`),
    // Leaves
    getLeaves: (params) => api.get("/hr/leaves", { params }),
    applyLeave: (data) => api.post("/hr/leaves", data),
    approveLeave: (id) => api.put(`/hr/leaves/${id}/approve`),
    rejectLeave: (id, reason) => api.put(`/hr/leaves/${id}/reject`, { reason }),
    getLeaveBalance: (staffId) => api.get(`/hr/leaves/balance/${staffId}`),
    // Payroll
    getPayrolls: (params) => api.get("/hr/payroll", { params }),
    generatePayroll: (data) => api.post("/hr/payroll/generate", data),
    processPayroll: (id) => api.post(`/hr/payroll/${id}/process`),
    getPayslip: (id) => api.get(`/hr/payroll/${id}/payslip`, { responseType: "blob" }),
    // Appraisals
    getAppraisals: (params) => api.get("/hr/appraisals", { params }),
    createAppraisal: (data) => api.post("/hr/appraisals", data),
    updateAppraisal: (id, data) => api.put(`/hr/appraisals/${id}`, data),
    deleteAppraisal: (id) => api.delete(`/hr/appraisals/${id}`)
  };
  var libraryAPI = {
    // Books
    getBooks: (params) => api.get("/library/books", { params }),
    getBookById: (id) => api.get(`/library/books/${id}`),
    createBook: (data) => api.post("/library/books", data),
    updateBook: (id, data) => api.put(`/library/books/${id}`, data),
    deleteBook: (id) => api.delete(`/library/books/${id}`),
    // Issues
    getIssues: (params) => api.get("/library/issues", { params }),
    issueBook: (data) => api.post("/library/issue", data),
    returnBook: (issueId, data) => api.post(`/library/return/${issueId}`, data),
    renewBook: (issueId) => api.post(`/library/renew/${issueId}`),
    getOverdue: () => api.get("/library/overdue"),
    getBorrowerHistory: (borrowerId) => api.get(`/library/borrower/${borrowerId}`),
    // Settings & Stats
    getSettings: () => api.get("/library/settings"),
    updateSettings: (data) => api.put("/library/settings", data),
    getStats: () => api.get("/library/stats")
  };
  var transportAPI = {
    // Vehicles
    getVehicles: (params) => api.get("/transport/vehicles", { params }),
    getVehicleById: (id) => api.get(`/transport/vehicles/${id}`),
    createVehicle: (data) => api.post("/transport/vehicles", data),
    updateVehicle: (id, data) => api.put(`/transport/vehicles/${id}`, data),
    deleteVehicle: (id) => api.delete(`/transport/vehicles/${id}`),
    // Routes
    getRoutes: (params) => api.get("/transport/routes", { params }),
    getRouteById: (id) => api.get(`/transport/routes/${id}`),
    createRoute: (data) => api.post("/transport/routes", data),
    updateRoute: (id, data) => api.put(`/transport/routes/${id}`, data),
    deleteRoute: (id) => api.delete(`/transport/routes/${id}`),
    // Allocations
    getAllocations: (params) => api.get("/transport/allocations", { params }),
    createAllocation: (data) => api.post("/transport/allocations", data),
    updateAllocation: (id, data) => api.put(`/transport/allocations/${id}`, data),
    deleteAllocation: (id) => api.delete(`/transport/allocations/${id}`),
    getStudentAllocation: (studentId) => api.get(`/transport/allocations/student/${studentId}`),
    getRouteAllocations: (routeId) => api.get(`/transport/allocations/route/${routeId}`),
    // Stats
    getStats: () => api.get("/transport/stats")
  };

  // store/sidebarStore.ts
  var serverSideStorage = /* @__PURE__ */ (() => {
    let store = {};
    return {
      getItem: (key) => {
        return store[key] ?? null;
      },
      setItem: (key, value) => {
        store[key] = value;
      },
      removeItem: (key) => {
        delete store[key];
      }
    };
  })();
  var useSidebarStore = create()(
    persist(
      (set, get) => ({
        isCollapsed: false,
        isMobileOpen: false,
        toggleCollapse: () => {
          set((state) => ({ isCollapsed: !state.isCollapsed }));
        },
        setCollapsed: (value) => {
          set({ isCollapsed: value });
        },
        toggleMobile: () => {
          set((state) => ({ isMobileOpen: !state.isMobileOpen }));
        },
        closeMobile: () => {
          set({ isMobileOpen: false });
        }
      }),
      {
        name: "sidebar-storage",
        storage: typeof window !== "undefined" ? createJSONStorage(() => localStorage) : serverSideStorage,
        partialize: (state) => ({ isCollapsed: state.isCollapsed })
      }
    )
  );

  // node_modules/@radix-ui/react-slot/dist/index.mjs
  var React4 = __toESM(require_react(), 1);

  // node_modules/@radix-ui/react-compose-refs/dist/index.mjs
  var React3 = __toESM(require_react(), 1);
  function setRef(ref, value) {
    if (typeof ref === "function") {
      return ref(value);
    } else if (ref !== null && ref !== void 0) {
      ref.current = value;
    }
  }
  function composeRefs(...refs) {
    return (node) => {
      let hasCleanup = false;
      const cleanups = refs.map((ref) => {
        const cleanup = setRef(ref, node);
        if (!hasCleanup && typeof cleanup == "function") {
          hasCleanup = true;
        }
        return cleanup;
      });
      if (hasCleanup) {
        return () => {
          for (let i = 0; i < cleanups.length; i++) {
            const cleanup = cleanups[i];
            if (typeof cleanup == "function") {
              cleanup();
            } else {
              setRef(refs[i], null);
            }
          }
        };
      }
    };
  }
  function useComposedRefs(...refs) {
    return React3.useCallback(composeRefs(...refs), refs);
  }

  // node_modules/@radix-ui/react-slot/dist/index.mjs
  var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
  var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
  var use = React4[" use ".trim().toString()];
  function isPromiseLike(value) {
    return typeof value === "object" && value !== null && "then" in value;
  }
  function isLazyComponent(element) {
    return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
  }
  // @__NO_SIDE_EFFECTS__
  function createSlot(ownerName) {
    const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
    const Slot22 = React4.forwardRef((props, forwardedRef) => {
      let { children, ...slotProps } = props;
      if (isLazyComponent(children) && typeof use === "function") {
        children = use(children._payload);
      }
      const childrenArray = React4.Children.toArray(children);
      const slottable = childrenArray.find(isSlottable);
      if (slottable) {
        const newElement = slottable.props.children;
        const newChildren = childrenArray.map((child) => {
          if (child === slottable) {
            if (React4.Children.count(newElement) > 1) return React4.Children.only(null);
            return React4.isValidElement(newElement) ? newElement.props.children : null;
          } else {
            return child;
          }
        });
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children: React4.isValidElement(newElement) ? React4.cloneElement(newElement, void 0, newChildren) : null });
      }
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children });
    });
    Slot22.displayName = `${ownerName}.Slot`;
    return Slot22;
  }
  var Slot = /* @__PURE__ */ createSlot("Slot");
  // @__NO_SIDE_EFFECTS__
  function createSlotClone(ownerName) {
    const SlotClone = React4.forwardRef((props, forwardedRef) => {
      let { children, ...slotProps } = props;
      if (isLazyComponent(children) && typeof use === "function") {
        children = use(children._payload);
      }
      if (React4.isValidElement(children)) {
        const childrenRef = getElementRef(children);
        const props2 = mergeProps(slotProps, children.props);
        if (children.type !== React4.Fragment) {
          props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
        }
        return React4.cloneElement(children, props2);
      }
      return React4.Children.count(children) > 1 ? React4.Children.only(null) : null;
    });
    SlotClone.displayName = `${ownerName}.SlotClone`;
    return SlotClone;
  }
  var SLOTTABLE_IDENTIFIER = /* @__PURE__ */ Symbol("radix.slottable");
  function isSlottable(child) {
    return React4.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
  }
  function mergeProps(slotProps, childProps) {
    const overrideProps = { ...childProps };
    for (const propName in childProps) {
      const slotPropValue = slotProps[propName];
      const childPropValue = childProps[propName];
      const isHandler = /^on[A-Z]/.test(propName);
      if (isHandler) {
        if (slotPropValue && childPropValue) {
          overrideProps[propName] = (...args) => {
            const result = childPropValue(...args);
            slotPropValue(...args);
            return result;
          };
        } else if (slotPropValue) {
          overrideProps[propName] = slotPropValue;
        }
      } else if (propName === "style") {
        overrideProps[propName] = { ...slotPropValue, ...childPropValue };
      } else if (propName === "className") {
        overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
      }
    }
    return { ...slotProps, ...overrideProps };
  }
  function getElementRef(element) {
    let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
    let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.ref;
    }
    getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
    mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.props.ref;
    }
    return element.props.ref || element.ref;
  }

  // node_modules/clsx/dist/clsx.mjs
  function r(e) {
    var t, f, n = "";
    if ("string" == typeof e || "number" == typeof e) n += e;
    else if ("object" == typeof e) if (Array.isArray(e)) {
      var o = e.length;
      for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
    } else for (f in e) e[f] && (n && (n += " "), n += f);
    return n;
  }
  function clsx() {
    for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
    return n;
  }

  // node_modules/class-variance-authority/dist/index.mjs
  var falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
  var cx = clsx;
  var cva = (base, config) => (props) => {
    var _config_compoundVariants;
    if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
    const { variants, defaultVariants } = config;
    const getVariantClassNames = Object.keys(variants).map((variant) => {
      const variantProp = props === null || props === void 0 ? void 0 : props[variant];
      const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
      if (variantProp === null) return null;
      const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
      return variants[variant][variantKey];
    });
    const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
      let [key, value] = param;
      if (value === void 0) {
        return acc;
      }
      acc[key] = value;
      return acc;
    }, {});
    const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
      let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
      return Object.entries(compoundVariantOptions).every((param2) => {
        let [key, value] = param2;
        return Array.isArray(value) ? value.includes({
          ...defaultVariants,
          ...propsWithoutUndefined
        }[key]) : {
          ...defaultVariants,
          ...propsWithoutUndefined
        }[key] === value;
      }) ? [
        ...acc,
        cvClass,
        cvClassName
      ] : acc;
    }, []);
    return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
  };

  // node_modules/tailwind-merge/dist/bundle-mjs.mjs
  var concatArrays = (array1, array2) => {
    const combinedArray = new Array(array1.length + array2.length);
    for (let i = 0; i < array1.length; i++) {
      combinedArray[i] = array1[i];
    }
    for (let i = 0; i < array2.length; i++) {
      combinedArray[array1.length + i] = array2[i];
    }
    return combinedArray;
  };
  var createClassValidatorObject = (classGroupId, validator) => ({
    classGroupId,
    validator
  });
  var createClassPartObject = (nextPart = /* @__PURE__ */ new Map(), validators3 = null, classGroupId) => ({
    nextPart,
    validators: validators3,
    classGroupId
  });
  var CLASS_PART_SEPARATOR = "-";
  var EMPTY_CONFLICTS = [];
  var ARBITRARY_PROPERTY_PREFIX = "arbitrary..";
  var createClassGroupUtils = (config) => {
    const classMap = createClassMap(config);
    const {
      conflictingClassGroups,
      conflictingClassGroupModifiers
    } = config;
    const getClassGroupId = (className) => {
      if (className.startsWith("[") && className.endsWith("]")) {
        return getGroupIdForArbitraryProperty(className);
      }
      const classParts = className.split(CLASS_PART_SEPARATOR);
      const startIndex = classParts[0] === "" && classParts.length > 1 ? 1 : 0;
      return getGroupRecursive(classParts, startIndex, classMap);
    };
    const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
      if (hasPostfixModifier) {
        const modifierConflicts = conflictingClassGroupModifiers[classGroupId];
        const baseConflicts = conflictingClassGroups[classGroupId];
        if (modifierConflicts) {
          if (baseConflicts) {
            return concatArrays(baseConflicts, modifierConflicts);
          }
          return modifierConflicts;
        }
        return baseConflicts || EMPTY_CONFLICTS;
      }
      return conflictingClassGroups[classGroupId] || EMPTY_CONFLICTS;
    };
    return {
      getClassGroupId,
      getConflictingClassGroupIds
    };
  };
  var getGroupRecursive = (classParts, startIndex, classPartObject) => {
    const classPathsLength = classParts.length - startIndex;
    if (classPathsLength === 0) {
      return classPartObject.classGroupId;
    }
    const currentClassPart = classParts[startIndex];
    const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
    if (nextClassPartObject) {
      const result = getGroupRecursive(classParts, startIndex + 1, nextClassPartObject);
      if (result) return result;
    }
    const validators3 = classPartObject.validators;
    if (validators3 === null) {
      return void 0;
    }
    const classRest = startIndex === 0 ? classParts.join(CLASS_PART_SEPARATOR) : classParts.slice(startIndex).join(CLASS_PART_SEPARATOR);
    const validatorsLength = validators3.length;
    for (let i = 0; i < validatorsLength; i++) {
      const validatorObj = validators3[i];
      if (validatorObj.validator(classRest)) {
        return validatorObj.classGroupId;
      }
    }
    return void 0;
  };
  var getGroupIdForArbitraryProperty = (className) => className.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
    const content = className.slice(1, -1);
    const colonIndex = content.indexOf(":");
    const property = content.slice(0, colonIndex);
    return property ? ARBITRARY_PROPERTY_PREFIX + property : void 0;
  })();
  var createClassMap = (config) => {
    const {
      theme,
      classGroups
    } = config;
    return processClassGroups(classGroups, theme);
  };
  var processClassGroups = (classGroups, theme) => {
    const classMap = createClassPartObject();
    for (const classGroupId in classGroups) {
      const group = classGroups[classGroupId];
      processClassesRecursively(group, classMap, classGroupId, theme);
    }
    return classMap;
  };
  var processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
    const len = classGroup.length;
    for (let i = 0; i < len; i++) {
      const classDefinition = classGroup[i];
      processClassDefinition(classDefinition, classPartObject, classGroupId, theme);
    }
  };
  var processClassDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
    if (typeof classDefinition === "string") {
      processStringDefinition(classDefinition, classPartObject, classGroupId);
      return;
    }
    if (typeof classDefinition === "function") {
      processFunctionDefinition(classDefinition, classPartObject, classGroupId, theme);
      return;
    }
    processObjectDefinition(classDefinition, classPartObject, classGroupId, theme);
  };
  var processStringDefinition = (classDefinition, classPartObject, classGroupId) => {
    const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
    classPartObjectToEdit.classGroupId = classGroupId;
  };
  var processFunctionDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
    if (isThemeGetter(classDefinition)) {
      processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
      return;
    }
    if (classPartObject.validators === null) {
      classPartObject.validators = [];
    }
    classPartObject.validators.push(createClassValidatorObject(classGroupId, classDefinition));
  };
  var processObjectDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
    const entries = Object.entries(classDefinition);
    const len = entries.length;
    for (let i = 0; i < len; i++) {
      const [key, value] = entries[i];
      processClassesRecursively(value, getPart(classPartObject, key), classGroupId, theme);
    }
  };
  var getPart = (classPartObject, path) => {
    let current = classPartObject;
    const parts = path.split(CLASS_PART_SEPARATOR);
    const len = parts.length;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      let next = current.nextPart.get(part);
      if (!next) {
        next = createClassPartObject();
        current.nextPart.set(part, next);
      }
      current = next;
    }
    return current;
  };
  var isThemeGetter = (func) => "isThemeGetter" in func && func.isThemeGetter === true;
  var createLruCache = (maxCacheSize) => {
    if (maxCacheSize < 1) {
      return {
        get: () => void 0,
        set: () => {
        }
      };
    }
    let cacheSize = 0;
    let cache = /* @__PURE__ */ Object.create(null);
    let previousCache = /* @__PURE__ */ Object.create(null);
    const update = (key, value) => {
      cache[key] = value;
      cacheSize++;
      if (cacheSize > maxCacheSize) {
        cacheSize = 0;
        previousCache = cache;
        cache = /* @__PURE__ */ Object.create(null);
      }
    };
    return {
      get(key) {
        let value = cache[key];
        if (value !== void 0) {
          return value;
        }
        if ((value = previousCache[key]) !== void 0) {
          update(key, value);
          return value;
        }
      },
      set(key, value) {
        if (key in cache) {
          cache[key] = value;
        } else {
          update(key, value);
        }
      }
    };
  };
  var IMPORTANT_MODIFIER = "!";
  var MODIFIER_SEPARATOR = ":";
  var EMPTY_MODIFIERS = [];
  var createResultObject = (modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition, isExternal) => ({
    modifiers,
    hasImportantModifier,
    baseClassName,
    maybePostfixModifierPosition,
    isExternal
  });
  var createParseClassName = (config) => {
    const {
      prefix,
      experimentalParseClassName
    } = config;
    let parseClassName = (className) => {
      const modifiers = [];
      let bracketDepth = 0;
      let parenDepth = 0;
      let modifierStart = 0;
      let postfixModifierPosition;
      const len = className.length;
      for (let index2 = 0; index2 < len; index2++) {
        const currentCharacter = className[index2];
        if (bracketDepth === 0 && parenDepth === 0) {
          if (currentCharacter === MODIFIER_SEPARATOR) {
            modifiers.push(className.slice(modifierStart, index2));
            modifierStart = index2 + 1;
            continue;
          }
          if (currentCharacter === "/") {
            postfixModifierPosition = index2;
            continue;
          }
        }
        if (currentCharacter === "[") bracketDepth++;
        else if (currentCharacter === "]") bracketDepth--;
        else if (currentCharacter === "(") parenDepth++;
        else if (currentCharacter === ")") parenDepth--;
      }
      const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.slice(modifierStart);
      let baseClassName = baseClassNameWithImportantModifier;
      let hasImportantModifier = false;
      if (baseClassNameWithImportantModifier.endsWith(IMPORTANT_MODIFIER)) {
        baseClassName = baseClassNameWithImportantModifier.slice(0, -1);
        hasImportantModifier = true;
      } else if (
        /**
         * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
         * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
         */
        baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER)
      ) {
        baseClassName = baseClassNameWithImportantModifier.slice(1);
        hasImportantModifier = true;
      }
      const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
      return createResultObject(modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition);
    };
    if (prefix) {
      const fullPrefix = prefix + MODIFIER_SEPARATOR;
      const parseClassNameOriginal = parseClassName;
      parseClassName = (className) => className.startsWith(fullPrefix) ? parseClassNameOriginal(className.slice(fullPrefix.length)) : createResultObject(EMPTY_MODIFIERS, false, className, void 0, true);
    }
    if (experimentalParseClassName) {
      const parseClassNameOriginal = parseClassName;
      parseClassName = (className) => experimentalParseClassName({
        className,
        parseClassName: parseClassNameOriginal
      });
    }
    return parseClassName;
  };
  var createSortModifiers = (config) => {
    const modifierWeights = /* @__PURE__ */ new Map();
    config.orderSensitiveModifiers.forEach((mod, index2) => {
      modifierWeights.set(mod, 1e6 + index2);
    });
    return (modifiers) => {
      const result = [];
      let currentSegment = [];
      for (let i = 0; i < modifiers.length; i++) {
        const modifier = modifiers[i];
        const isArbitrary = modifier[0] === "[";
        const isOrderSensitive = modifierWeights.has(modifier);
        if (isArbitrary || isOrderSensitive) {
          if (currentSegment.length > 0) {
            currentSegment.sort();
            result.push(...currentSegment);
            currentSegment = [];
          }
          result.push(modifier);
        } else {
          currentSegment.push(modifier);
        }
      }
      if (currentSegment.length > 0) {
        currentSegment.sort();
        result.push(...currentSegment);
      }
      return result;
    };
  };
  var createConfigUtils = (config) => ({
    cache: createLruCache(config.cacheSize),
    parseClassName: createParseClassName(config),
    sortModifiers: createSortModifiers(config),
    ...createClassGroupUtils(config)
  });
  var SPLIT_CLASSES_REGEX = /\s+/;
  var mergeClassList = (classList, configUtils) => {
    const {
      parseClassName,
      getClassGroupId,
      getConflictingClassGroupIds,
      sortModifiers
    } = configUtils;
    const classGroupsInConflict = [];
    const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
    let result = "";
    for (let index2 = classNames.length - 1; index2 >= 0; index2 -= 1) {
      const originalClassName = classNames[index2];
      const {
        isExternal,
        modifiers,
        hasImportantModifier,
        baseClassName,
        maybePostfixModifierPosition
      } = parseClassName(originalClassName);
      if (isExternal) {
        result = originalClassName + (result.length > 0 ? " " + result : result);
        continue;
      }
      let hasPostfixModifier = !!maybePostfixModifierPosition;
      let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
      if (!classGroupId) {
        if (!hasPostfixModifier) {
          result = originalClassName + (result.length > 0 ? " " + result : result);
          continue;
        }
        classGroupId = getClassGroupId(baseClassName);
        if (!classGroupId) {
          result = originalClassName + (result.length > 0 ? " " + result : result);
          continue;
        }
        hasPostfixModifier = false;
      }
      const variantModifier = modifiers.length === 0 ? "" : modifiers.length === 1 ? modifiers[0] : sortModifiers(modifiers).join(":");
      const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
      const classId = modifierId + classGroupId;
      if (classGroupsInConflict.indexOf(classId) > -1) {
        continue;
      }
      classGroupsInConflict.push(classId);
      const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
      for (let i = 0; i < conflictGroups.length; ++i) {
        const group = conflictGroups[i];
        classGroupsInConflict.push(modifierId + group);
      }
      result = originalClassName + (result.length > 0 ? " " + result : result);
    }
    return result;
  };
  var twJoin = (...classLists) => {
    let index2 = 0;
    let argument;
    let resolvedValue;
    let string = "";
    while (index2 < classLists.length) {
      if (argument = classLists[index2++]) {
        if (resolvedValue = toValue(argument)) {
          string && (string += " ");
          string += resolvedValue;
        }
      }
    }
    return string;
  };
  var toValue = (mix) => {
    if (typeof mix === "string") {
      return mix;
    }
    let resolvedValue;
    let string = "";
    for (let k = 0; k < mix.length; k++) {
      if (mix[k]) {
        if (resolvedValue = toValue(mix[k])) {
          string && (string += " ");
          string += resolvedValue;
        }
      }
    }
    return string;
  };
  var createTailwindMerge = (createConfigFirst, ...createConfigRest) => {
    let configUtils;
    let cacheGet;
    let cacheSet;
    let functionToCall;
    const initTailwindMerge = (classList) => {
      const config = createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst());
      configUtils = createConfigUtils(config);
      cacheGet = configUtils.cache.get;
      cacheSet = configUtils.cache.set;
      functionToCall = tailwindMerge;
      return tailwindMerge(classList);
    };
    const tailwindMerge = (classList) => {
      const cachedResult = cacheGet(classList);
      if (cachedResult) {
        return cachedResult;
      }
      const result = mergeClassList(classList, configUtils);
      cacheSet(classList, result);
      return result;
    };
    functionToCall = initTailwindMerge;
    return (...args) => functionToCall(twJoin(...args));
  };
  var fallbackThemeArr = [];
  var fromTheme = (key) => {
    const themeGetter = (theme) => theme[key] || fallbackThemeArr;
    themeGetter.isThemeGetter = true;
    return themeGetter;
  };
  var arbitraryValueRegex = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
  var arbitraryVariableRegex = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
  var fractionRegex = /^\d+\/\d+$/;
  var tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
  var lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
  var colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
  var shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
  var imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
  var isFraction = (value) => fractionRegex.test(value);
  var isNumber2 = (value) => !!value && !Number.isNaN(Number(value));
  var isInteger = (value) => !!value && Number.isInteger(Number(value));
  var isPercent = (value) => value.endsWith("%") && isNumber2(value.slice(0, -1));
  var isTshirtSize = (value) => tshirtUnitRegex.test(value);
  var isAny = () => true;
  var isLengthOnly = (value) => (
    // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
    // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
    // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
    lengthUnitRegex.test(value) && !colorFunctionRegex.test(value)
  );
  var isNever = () => false;
  var isShadow = (value) => shadowRegex.test(value);
  var isImage = (value) => imageRegex.test(value);
  var isAnyNonArbitrary = (value) => !isArbitraryValue(value) && !isArbitraryVariable(value);
  var isArbitrarySize = (value) => getIsArbitraryValue(value, isLabelSize, isNever);
  var isArbitraryValue = (value) => arbitraryValueRegex.test(value);
  var isArbitraryLength = (value) => getIsArbitraryValue(value, isLabelLength, isLengthOnly);
  var isArbitraryNumber = (value) => getIsArbitraryValue(value, isLabelNumber, isNumber2);
  var isArbitraryPosition = (value) => getIsArbitraryValue(value, isLabelPosition, isNever);
  var isArbitraryImage = (value) => getIsArbitraryValue(value, isLabelImage, isImage);
  var isArbitraryShadow = (value) => getIsArbitraryValue(value, isLabelShadow, isShadow);
  var isArbitraryVariable = (value) => arbitraryVariableRegex.test(value);
  var isArbitraryVariableLength = (value) => getIsArbitraryVariable(value, isLabelLength);
  var isArbitraryVariableFamilyName = (value) => getIsArbitraryVariable(value, isLabelFamilyName);
  var isArbitraryVariablePosition = (value) => getIsArbitraryVariable(value, isLabelPosition);
  var isArbitraryVariableSize = (value) => getIsArbitraryVariable(value, isLabelSize);
  var isArbitraryVariableImage = (value) => getIsArbitraryVariable(value, isLabelImage);
  var isArbitraryVariableShadow = (value) => getIsArbitraryVariable(value, isLabelShadow, true);
  var getIsArbitraryValue = (value, testLabel, testValue) => {
    const result = arbitraryValueRegex.exec(value);
    if (result) {
      if (result[1]) {
        return testLabel(result[1]);
      }
      return testValue(result[2]);
    }
    return false;
  };
  var getIsArbitraryVariable = (value, testLabel, shouldMatchNoLabel = false) => {
    const result = arbitraryVariableRegex.exec(value);
    if (result) {
      if (result[1]) {
        return testLabel(result[1]);
      }
      return shouldMatchNoLabel;
    }
    return false;
  };
  var isLabelPosition = (label) => label === "position" || label === "percentage";
  var isLabelImage = (label) => label === "image" || label === "url";
  var isLabelSize = (label) => label === "length" || label === "size" || label === "bg-size";
  var isLabelLength = (label) => label === "length";
  var isLabelNumber = (label) => label === "number";
  var isLabelFamilyName = (label) => label === "family-name";
  var isLabelShadow = (label) => label === "shadow";
  var getDefaultConfig = () => {
    const themeColor = fromTheme("color");
    const themeFont = fromTheme("font");
    const themeText = fromTheme("text");
    const themeFontWeight = fromTheme("font-weight");
    const themeTracking = fromTheme("tracking");
    const themeLeading = fromTheme("leading");
    const themeBreakpoint = fromTheme("breakpoint");
    const themeContainer = fromTheme("container");
    const themeSpacing = fromTheme("spacing");
    const themeRadius = fromTheme("radius");
    const themeShadow = fromTheme("shadow");
    const themeInsetShadow = fromTheme("inset-shadow");
    const themeTextShadow = fromTheme("text-shadow");
    const themeDropShadow = fromTheme("drop-shadow");
    const themeBlur = fromTheme("blur");
    const themePerspective = fromTheme("perspective");
    const themeAspect = fromTheme("aspect");
    const themeEase = fromTheme("ease");
    const themeAnimate = fromTheme("animate");
    const scaleBreak = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"];
    const scalePosition = () => [
      "center",
      "top",
      "bottom",
      "left",
      "right",
      "top-left",
      // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
      "left-top",
      "top-right",
      // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
      "right-top",
      "bottom-right",
      // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
      "right-bottom",
      "bottom-left",
      // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
      "left-bottom"
    ];
    const scalePositionWithArbitrary = () => [...scalePosition(), isArbitraryVariable, isArbitraryValue];
    const scaleOverflow = () => ["auto", "hidden", "clip", "visible", "scroll"];
    const scaleOverscroll = () => ["auto", "contain", "none"];
    const scaleUnambiguousSpacing = () => [isArbitraryVariable, isArbitraryValue, themeSpacing];
    const scaleInset = () => [isFraction, "full", "auto", ...scaleUnambiguousSpacing()];
    const scaleGridTemplateColsRows = () => [isInteger, "none", "subgrid", isArbitraryVariable, isArbitraryValue];
    const scaleGridColRowStartAndEnd = () => ["auto", {
      span: ["full", isInteger, isArbitraryVariable, isArbitraryValue]
    }, isInteger, isArbitraryVariable, isArbitraryValue];
    const scaleGridColRowStartOrEnd = () => [isInteger, "auto", isArbitraryVariable, isArbitraryValue];
    const scaleGridAutoColsRows = () => ["auto", "min", "max", "fr", isArbitraryVariable, isArbitraryValue];
    const scaleAlignPrimaryAxis = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"];
    const scaleAlignSecondaryAxis = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"];
    const scaleMargin = () => ["auto", ...scaleUnambiguousSpacing()];
    const scaleSizing = () => [isFraction, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...scaleUnambiguousSpacing()];
    const scaleColor = () => [themeColor, isArbitraryVariable, isArbitraryValue];
    const scaleBgPosition = () => [...scalePosition(), isArbitraryVariablePosition, isArbitraryPosition, {
      position: [isArbitraryVariable, isArbitraryValue]
    }];
    const scaleBgRepeat = () => ["no-repeat", {
      repeat: ["", "x", "y", "space", "round"]
    }];
    const scaleBgSize = () => ["auto", "cover", "contain", isArbitraryVariableSize, isArbitrarySize, {
      size: [isArbitraryVariable, isArbitraryValue]
    }];
    const scaleGradientStopPosition = () => [isPercent, isArbitraryVariableLength, isArbitraryLength];
    const scaleRadius = () => [
      // Deprecated since Tailwind CSS v4.0.0
      "",
      "none",
      "full",
      themeRadius,
      isArbitraryVariable,
      isArbitraryValue
    ];
    const scaleBorderWidth = () => ["", isNumber2, isArbitraryVariableLength, isArbitraryLength];
    const scaleLineStyle = () => ["solid", "dashed", "dotted", "double"];
    const scaleBlendMode = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
    const scaleMaskImagePosition = () => [isNumber2, isPercent, isArbitraryVariablePosition, isArbitraryPosition];
    const scaleBlur = () => [
      // Deprecated since Tailwind CSS v4.0.0
      "",
      "none",
      themeBlur,
      isArbitraryVariable,
      isArbitraryValue
    ];
    const scaleRotate = () => ["none", isNumber2, isArbitraryVariable, isArbitraryValue];
    const scaleScale = () => ["none", isNumber2, isArbitraryVariable, isArbitraryValue];
    const scaleSkew = () => [isNumber2, isArbitraryVariable, isArbitraryValue];
    const scaleTranslate = () => [isFraction, "full", ...scaleUnambiguousSpacing()];
    return {
      cacheSize: 500,
      theme: {
        animate: ["spin", "ping", "pulse", "bounce"],
        aspect: ["video"],
        blur: [isTshirtSize],
        breakpoint: [isTshirtSize],
        color: [isAny],
        container: [isTshirtSize],
        "drop-shadow": [isTshirtSize],
        ease: ["in", "out", "in-out"],
        font: [isAnyNonArbitrary],
        "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
        "inset-shadow": [isTshirtSize],
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
        perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
        radius: [isTshirtSize],
        shadow: [isTshirtSize],
        spacing: ["px", isNumber2],
        text: [isTshirtSize],
        "text-shadow": [isTshirtSize],
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
      },
      classGroups: {
        // --------------
        // --- Layout ---
        // --------------
        /**
         * Aspect Ratio
         * @see https://tailwindcss.com/docs/aspect-ratio
         */
        aspect: [{
          aspect: ["auto", "square", isFraction, isArbitraryValue, isArbitraryVariable, themeAspect]
        }],
        /**
         * Container
         * @see https://tailwindcss.com/docs/container
         * @deprecated since Tailwind CSS v4.0.0
         */
        container: ["container"],
        /**
         * Columns
         * @see https://tailwindcss.com/docs/columns
         */
        columns: [{
          columns: [isNumber2, isArbitraryValue, isArbitraryVariable, themeContainer]
        }],
        /**
         * Break After
         * @see https://tailwindcss.com/docs/break-after
         */
        "break-after": [{
          "break-after": scaleBreak()
        }],
        /**
         * Break Before
         * @see https://tailwindcss.com/docs/break-before
         */
        "break-before": [{
          "break-before": scaleBreak()
        }],
        /**
         * Break Inside
         * @see https://tailwindcss.com/docs/break-inside
         */
        "break-inside": [{
          "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
        }],
        /**
         * Box Decoration Break
         * @see https://tailwindcss.com/docs/box-decoration-break
         */
        "box-decoration": [{
          "box-decoration": ["slice", "clone"]
        }],
        /**
         * Box Sizing
         * @see https://tailwindcss.com/docs/box-sizing
         */
        box: [{
          box: ["border", "content"]
        }],
        /**
         * Display
         * @see https://tailwindcss.com/docs/display
         */
        display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
        /**
         * Screen Reader Only
         * @see https://tailwindcss.com/docs/display#screen-reader-only
         */
        sr: ["sr-only", "not-sr-only"],
        /**
         * Floats
         * @see https://tailwindcss.com/docs/float
         */
        float: [{
          float: ["right", "left", "none", "start", "end"]
        }],
        /**
         * Clear
         * @see https://tailwindcss.com/docs/clear
         */
        clear: [{
          clear: ["left", "right", "both", "none", "start", "end"]
        }],
        /**
         * Isolation
         * @see https://tailwindcss.com/docs/isolation
         */
        isolation: ["isolate", "isolation-auto"],
        /**
         * Object Fit
         * @see https://tailwindcss.com/docs/object-fit
         */
        "object-fit": [{
          object: ["contain", "cover", "fill", "none", "scale-down"]
        }],
        /**
         * Object Position
         * @see https://tailwindcss.com/docs/object-position
         */
        "object-position": [{
          object: scalePositionWithArbitrary()
        }],
        /**
         * Overflow
         * @see https://tailwindcss.com/docs/overflow
         */
        overflow: [{
          overflow: scaleOverflow()
        }],
        /**
         * Overflow X
         * @see https://tailwindcss.com/docs/overflow
         */
        "overflow-x": [{
          "overflow-x": scaleOverflow()
        }],
        /**
         * Overflow Y
         * @see https://tailwindcss.com/docs/overflow
         */
        "overflow-y": [{
          "overflow-y": scaleOverflow()
        }],
        /**
         * Overscroll Behavior
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        overscroll: [{
          overscroll: scaleOverscroll()
        }],
        /**
         * Overscroll Behavior X
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        "overscroll-x": [{
          "overscroll-x": scaleOverscroll()
        }],
        /**
         * Overscroll Behavior Y
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        "overscroll-y": [{
          "overscroll-y": scaleOverscroll()
        }],
        /**
         * Position
         * @see https://tailwindcss.com/docs/position
         */
        position: ["static", "fixed", "absolute", "relative", "sticky"],
        /**
         * Top / Right / Bottom / Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        inset: [{
          inset: scaleInset()
        }],
        /**
         * Right / Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        "inset-x": [{
          "inset-x": scaleInset()
        }],
        /**
         * Top / Bottom
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        "inset-y": [{
          "inset-y": scaleInset()
        }],
        /**
         * Start
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        start: [{
          start: scaleInset()
        }],
        /**
         * End
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        end: [{
          end: scaleInset()
        }],
        /**
         * Top
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        top: [{
          top: scaleInset()
        }],
        /**
         * Right
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        right: [{
          right: scaleInset()
        }],
        /**
         * Bottom
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        bottom: [{
          bottom: scaleInset()
        }],
        /**
         * Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        left: [{
          left: scaleInset()
        }],
        /**
         * Visibility
         * @see https://tailwindcss.com/docs/visibility
         */
        visibility: ["visible", "invisible", "collapse"],
        /**
         * Z-Index
         * @see https://tailwindcss.com/docs/z-index
         */
        z: [{
          z: [isInteger, "auto", isArbitraryVariable, isArbitraryValue]
        }],
        // ------------------------
        // --- Flexbox and Grid ---
        // ------------------------
        /**
         * Flex Basis
         * @see https://tailwindcss.com/docs/flex-basis
         */
        basis: [{
          basis: [isFraction, "full", "auto", themeContainer, ...scaleUnambiguousSpacing()]
        }],
        /**
         * Flex Direction
         * @see https://tailwindcss.com/docs/flex-direction
         */
        "flex-direction": [{
          flex: ["row", "row-reverse", "col", "col-reverse"]
        }],
        /**
         * Flex Wrap
         * @see https://tailwindcss.com/docs/flex-wrap
         */
        "flex-wrap": [{
          flex: ["nowrap", "wrap", "wrap-reverse"]
        }],
        /**
         * Flex
         * @see https://tailwindcss.com/docs/flex
         */
        flex: [{
          flex: [isNumber2, isFraction, "auto", "initial", "none", isArbitraryValue]
        }],
        /**
         * Flex Grow
         * @see https://tailwindcss.com/docs/flex-grow
         */
        grow: [{
          grow: ["", isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Flex Shrink
         * @see https://tailwindcss.com/docs/flex-shrink
         */
        shrink: [{
          shrink: ["", isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Order
         * @see https://tailwindcss.com/docs/order
         */
        order: [{
          order: [isInteger, "first", "last", "none", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Grid Template Columns
         * @see https://tailwindcss.com/docs/grid-template-columns
         */
        "grid-cols": [{
          "grid-cols": scaleGridTemplateColsRows()
        }],
        /**
         * Grid Column Start / End
         * @see https://tailwindcss.com/docs/grid-column
         */
        "col-start-end": [{
          col: scaleGridColRowStartAndEnd()
        }],
        /**
         * Grid Column Start
         * @see https://tailwindcss.com/docs/grid-column
         */
        "col-start": [{
          "col-start": scaleGridColRowStartOrEnd()
        }],
        /**
         * Grid Column End
         * @see https://tailwindcss.com/docs/grid-column
         */
        "col-end": [{
          "col-end": scaleGridColRowStartOrEnd()
        }],
        /**
         * Grid Template Rows
         * @see https://tailwindcss.com/docs/grid-template-rows
         */
        "grid-rows": [{
          "grid-rows": scaleGridTemplateColsRows()
        }],
        /**
         * Grid Row Start / End
         * @see https://tailwindcss.com/docs/grid-row
         */
        "row-start-end": [{
          row: scaleGridColRowStartAndEnd()
        }],
        /**
         * Grid Row Start
         * @see https://tailwindcss.com/docs/grid-row
         */
        "row-start": [{
          "row-start": scaleGridColRowStartOrEnd()
        }],
        /**
         * Grid Row End
         * @see https://tailwindcss.com/docs/grid-row
         */
        "row-end": [{
          "row-end": scaleGridColRowStartOrEnd()
        }],
        /**
         * Grid Auto Flow
         * @see https://tailwindcss.com/docs/grid-auto-flow
         */
        "grid-flow": [{
          "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
        }],
        /**
         * Grid Auto Columns
         * @see https://tailwindcss.com/docs/grid-auto-columns
         */
        "auto-cols": [{
          "auto-cols": scaleGridAutoColsRows()
        }],
        /**
         * Grid Auto Rows
         * @see https://tailwindcss.com/docs/grid-auto-rows
         */
        "auto-rows": [{
          "auto-rows": scaleGridAutoColsRows()
        }],
        /**
         * Gap
         * @see https://tailwindcss.com/docs/gap
         */
        gap: [{
          gap: scaleUnambiguousSpacing()
        }],
        /**
         * Gap X
         * @see https://tailwindcss.com/docs/gap
         */
        "gap-x": [{
          "gap-x": scaleUnambiguousSpacing()
        }],
        /**
         * Gap Y
         * @see https://tailwindcss.com/docs/gap
         */
        "gap-y": [{
          "gap-y": scaleUnambiguousSpacing()
        }],
        /**
         * Justify Content
         * @see https://tailwindcss.com/docs/justify-content
         */
        "justify-content": [{
          justify: [...scaleAlignPrimaryAxis(), "normal"]
        }],
        /**
         * Justify Items
         * @see https://tailwindcss.com/docs/justify-items
         */
        "justify-items": [{
          "justify-items": [...scaleAlignSecondaryAxis(), "normal"]
        }],
        /**
         * Justify Self
         * @see https://tailwindcss.com/docs/justify-self
         */
        "justify-self": [{
          "justify-self": ["auto", ...scaleAlignSecondaryAxis()]
        }],
        /**
         * Align Content
         * @see https://tailwindcss.com/docs/align-content
         */
        "align-content": [{
          content: ["normal", ...scaleAlignPrimaryAxis()]
        }],
        /**
         * Align Items
         * @see https://tailwindcss.com/docs/align-items
         */
        "align-items": [{
          items: [...scaleAlignSecondaryAxis(), {
            baseline: ["", "last"]
          }]
        }],
        /**
         * Align Self
         * @see https://tailwindcss.com/docs/align-self
         */
        "align-self": [{
          self: ["auto", ...scaleAlignSecondaryAxis(), {
            baseline: ["", "last"]
          }]
        }],
        /**
         * Place Content
         * @see https://tailwindcss.com/docs/place-content
         */
        "place-content": [{
          "place-content": scaleAlignPrimaryAxis()
        }],
        /**
         * Place Items
         * @see https://tailwindcss.com/docs/place-items
         */
        "place-items": [{
          "place-items": [...scaleAlignSecondaryAxis(), "baseline"]
        }],
        /**
         * Place Self
         * @see https://tailwindcss.com/docs/place-self
         */
        "place-self": [{
          "place-self": ["auto", ...scaleAlignSecondaryAxis()]
        }],
        // Spacing
        /**
         * Padding
         * @see https://tailwindcss.com/docs/padding
         */
        p: [{
          p: scaleUnambiguousSpacing()
        }],
        /**
         * Padding X
         * @see https://tailwindcss.com/docs/padding
         */
        px: [{
          px: scaleUnambiguousSpacing()
        }],
        /**
         * Padding Y
         * @see https://tailwindcss.com/docs/padding
         */
        py: [{
          py: scaleUnambiguousSpacing()
        }],
        /**
         * Padding Start
         * @see https://tailwindcss.com/docs/padding
         */
        ps: [{
          ps: scaleUnambiguousSpacing()
        }],
        /**
         * Padding End
         * @see https://tailwindcss.com/docs/padding
         */
        pe: [{
          pe: scaleUnambiguousSpacing()
        }],
        /**
         * Padding Top
         * @see https://tailwindcss.com/docs/padding
         */
        pt: [{
          pt: scaleUnambiguousSpacing()
        }],
        /**
         * Padding Right
         * @see https://tailwindcss.com/docs/padding
         */
        pr: [{
          pr: scaleUnambiguousSpacing()
        }],
        /**
         * Padding Bottom
         * @see https://tailwindcss.com/docs/padding
         */
        pb: [{
          pb: scaleUnambiguousSpacing()
        }],
        /**
         * Padding Left
         * @see https://tailwindcss.com/docs/padding
         */
        pl: [{
          pl: scaleUnambiguousSpacing()
        }],
        /**
         * Margin
         * @see https://tailwindcss.com/docs/margin
         */
        m: [{
          m: scaleMargin()
        }],
        /**
         * Margin X
         * @see https://tailwindcss.com/docs/margin
         */
        mx: [{
          mx: scaleMargin()
        }],
        /**
         * Margin Y
         * @see https://tailwindcss.com/docs/margin
         */
        my: [{
          my: scaleMargin()
        }],
        /**
         * Margin Start
         * @see https://tailwindcss.com/docs/margin
         */
        ms: [{
          ms: scaleMargin()
        }],
        /**
         * Margin End
         * @see https://tailwindcss.com/docs/margin
         */
        me: [{
          me: scaleMargin()
        }],
        /**
         * Margin Top
         * @see https://tailwindcss.com/docs/margin
         */
        mt: [{
          mt: scaleMargin()
        }],
        /**
         * Margin Right
         * @see https://tailwindcss.com/docs/margin
         */
        mr: [{
          mr: scaleMargin()
        }],
        /**
         * Margin Bottom
         * @see https://tailwindcss.com/docs/margin
         */
        mb: [{
          mb: scaleMargin()
        }],
        /**
         * Margin Left
         * @see https://tailwindcss.com/docs/margin
         */
        ml: [{
          ml: scaleMargin()
        }],
        /**
         * Space Between X
         * @see https://tailwindcss.com/docs/margin#adding-space-between-children
         */
        "space-x": [{
          "space-x": scaleUnambiguousSpacing()
        }],
        /**
         * Space Between X Reverse
         * @see https://tailwindcss.com/docs/margin#adding-space-between-children
         */
        "space-x-reverse": ["space-x-reverse"],
        /**
         * Space Between Y
         * @see https://tailwindcss.com/docs/margin#adding-space-between-children
         */
        "space-y": [{
          "space-y": scaleUnambiguousSpacing()
        }],
        /**
         * Space Between Y Reverse
         * @see https://tailwindcss.com/docs/margin#adding-space-between-children
         */
        "space-y-reverse": ["space-y-reverse"],
        // --------------
        // --- Sizing ---
        // --------------
        /**
         * Size
         * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
         */
        size: [{
          size: scaleSizing()
        }],
        /**
         * Width
         * @see https://tailwindcss.com/docs/width
         */
        w: [{
          w: [themeContainer, "screen", ...scaleSizing()]
        }],
        /**
         * Min-Width
         * @see https://tailwindcss.com/docs/min-width
         */
        "min-w": [{
          "min-w": [
            themeContainer,
            "screen",
            /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
            "none",
            ...scaleSizing()
          ]
        }],
        /**
         * Max-Width
         * @see https://tailwindcss.com/docs/max-width
         */
        "max-w": [{
          "max-w": [
            themeContainer,
            "screen",
            "none",
            /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
            "prose",
            /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
            {
              screen: [themeBreakpoint]
            },
            ...scaleSizing()
          ]
        }],
        /**
         * Height
         * @see https://tailwindcss.com/docs/height
         */
        h: [{
          h: ["screen", "lh", ...scaleSizing()]
        }],
        /**
         * Min-Height
         * @see https://tailwindcss.com/docs/min-height
         */
        "min-h": [{
          "min-h": ["screen", "lh", "none", ...scaleSizing()]
        }],
        /**
         * Max-Height
         * @see https://tailwindcss.com/docs/max-height
         */
        "max-h": [{
          "max-h": ["screen", "lh", ...scaleSizing()]
        }],
        // ------------------
        // --- Typography ---
        // ------------------
        /**
         * Font Size
         * @see https://tailwindcss.com/docs/font-size
         */
        "font-size": [{
          text: ["base", themeText, isArbitraryVariableLength, isArbitraryLength]
        }],
        /**
         * Font Smoothing
         * @see https://tailwindcss.com/docs/font-smoothing
         */
        "font-smoothing": ["antialiased", "subpixel-antialiased"],
        /**
         * Font Style
         * @see https://tailwindcss.com/docs/font-style
         */
        "font-style": ["italic", "not-italic"],
        /**
         * Font Weight
         * @see https://tailwindcss.com/docs/font-weight
         */
        "font-weight": [{
          font: [themeFontWeight, isArbitraryVariable, isArbitraryNumber]
        }],
        /**
         * Font Stretch
         * @see https://tailwindcss.com/docs/font-stretch
         */
        "font-stretch": [{
          "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", isPercent, isArbitraryValue]
        }],
        /**
         * Font Family
         * @see https://tailwindcss.com/docs/font-family
         */
        "font-family": [{
          font: [isArbitraryVariableFamilyName, isArbitraryValue, themeFont]
        }],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-normal": ["normal-nums"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-ordinal": ["ordinal"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-slashed-zero": ["slashed-zero"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-figure": ["lining-nums", "oldstyle-nums"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-spacing": ["proportional-nums", "tabular-nums"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
        /**
         * Letter Spacing
         * @see https://tailwindcss.com/docs/letter-spacing
         */
        tracking: [{
          tracking: [themeTracking, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Line Clamp
         * @see https://tailwindcss.com/docs/line-clamp
         */
        "line-clamp": [{
          "line-clamp": [isNumber2, "none", isArbitraryVariable, isArbitraryNumber]
        }],
        /**
         * Line Height
         * @see https://tailwindcss.com/docs/line-height
         */
        leading: [{
          leading: [
            /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
            themeLeading,
            ...scaleUnambiguousSpacing()
          ]
        }],
        /**
         * List Style Image
         * @see https://tailwindcss.com/docs/list-style-image
         */
        "list-image": [{
          "list-image": ["none", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * List Style Position
         * @see https://tailwindcss.com/docs/list-style-position
         */
        "list-style-position": [{
          list: ["inside", "outside"]
        }],
        /**
         * List Style Type
         * @see https://tailwindcss.com/docs/list-style-type
         */
        "list-style-type": [{
          list: ["disc", "decimal", "none", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Text Alignment
         * @see https://tailwindcss.com/docs/text-align
         */
        "text-alignment": [{
          text: ["left", "center", "right", "justify", "start", "end"]
        }],
        /**
         * Placeholder Color
         * @deprecated since Tailwind CSS v3.0.0
         * @see https://v3.tailwindcss.com/docs/placeholder-color
         */
        "placeholder-color": [{
          placeholder: scaleColor()
        }],
        /**
         * Text Color
         * @see https://tailwindcss.com/docs/text-color
         */
        "text-color": [{
          text: scaleColor()
        }],
        /**
         * Text Decoration
         * @see https://tailwindcss.com/docs/text-decoration
         */
        "text-decoration": ["underline", "overline", "line-through", "no-underline"],
        /**
         * Text Decoration Style
         * @see https://tailwindcss.com/docs/text-decoration-style
         */
        "text-decoration-style": [{
          decoration: [...scaleLineStyle(), "wavy"]
        }],
        /**
         * Text Decoration Thickness
         * @see https://tailwindcss.com/docs/text-decoration-thickness
         */
        "text-decoration-thickness": [{
          decoration: [isNumber2, "from-font", "auto", isArbitraryVariable, isArbitraryLength]
        }],
        /**
         * Text Decoration Color
         * @see https://tailwindcss.com/docs/text-decoration-color
         */
        "text-decoration-color": [{
          decoration: scaleColor()
        }],
        /**
         * Text Underline Offset
         * @see https://tailwindcss.com/docs/text-underline-offset
         */
        "underline-offset": [{
          "underline-offset": [isNumber2, "auto", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Text Transform
         * @see https://tailwindcss.com/docs/text-transform
         */
        "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
        /**
         * Text Overflow
         * @see https://tailwindcss.com/docs/text-overflow
         */
        "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
        /**
         * Text Wrap
         * @see https://tailwindcss.com/docs/text-wrap
         */
        "text-wrap": [{
          text: ["wrap", "nowrap", "balance", "pretty"]
        }],
        /**
         * Text Indent
         * @see https://tailwindcss.com/docs/text-indent
         */
        indent: [{
          indent: scaleUnambiguousSpacing()
        }],
        /**
         * Vertical Alignment
         * @see https://tailwindcss.com/docs/vertical-align
         */
        "vertical-align": [{
          align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Whitespace
         * @see https://tailwindcss.com/docs/whitespace
         */
        whitespace: [{
          whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
        }],
        /**
         * Word Break
         * @see https://tailwindcss.com/docs/word-break
         */
        break: [{
          break: ["normal", "words", "all", "keep"]
        }],
        /**
         * Overflow Wrap
         * @see https://tailwindcss.com/docs/overflow-wrap
         */
        wrap: [{
          wrap: ["break-word", "anywhere", "normal"]
        }],
        /**
         * Hyphens
         * @see https://tailwindcss.com/docs/hyphens
         */
        hyphens: [{
          hyphens: ["none", "manual", "auto"]
        }],
        /**
         * Content
         * @see https://tailwindcss.com/docs/content
         */
        content: [{
          content: ["none", isArbitraryVariable, isArbitraryValue]
        }],
        // -------------------
        // --- Backgrounds ---
        // -------------------
        /**
         * Background Attachment
         * @see https://tailwindcss.com/docs/background-attachment
         */
        "bg-attachment": [{
          bg: ["fixed", "local", "scroll"]
        }],
        /**
         * Background Clip
         * @see https://tailwindcss.com/docs/background-clip
         */
        "bg-clip": [{
          "bg-clip": ["border", "padding", "content", "text"]
        }],
        /**
         * Background Origin
         * @see https://tailwindcss.com/docs/background-origin
         */
        "bg-origin": [{
          "bg-origin": ["border", "padding", "content"]
        }],
        /**
         * Background Position
         * @see https://tailwindcss.com/docs/background-position
         */
        "bg-position": [{
          bg: scaleBgPosition()
        }],
        /**
         * Background Repeat
         * @see https://tailwindcss.com/docs/background-repeat
         */
        "bg-repeat": [{
          bg: scaleBgRepeat()
        }],
        /**
         * Background Size
         * @see https://tailwindcss.com/docs/background-size
         */
        "bg-size": [{
          bg: scaleBgSize()
        }],
        /**
         * Background Image
         * @see https://tailwindcss.com/docs/background-image
         */
        "bg-image": [{
          bg: ["none", {
            linear: [{
              to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
            }, isInteger, isArbitraryVariable, isArbitraryValue],
            radial: ["", isArbitraryVariable, isArbitraryValue],
            conic: [isInteger, isArbitraryVariable, isArbitraryValue]
          }, isArbitraryVariableImage, isArbitraryImage]
        }],
        /**
         * Background Color
         * @see https://tailwindcss.com/docs/background-color
         */
        "bg-color": [{
          bg: scaleColor()
        }],
        /**
         * Gradient Color Stops From Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-from-pos": [{
          from: scaleGradientStopPosition()
        }],
        /**
         * Gradient Color Stops Via Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-via-pos": [{
          via: scaleGradientStopPosition()
        }],
        /**
         * Gradient Color Stops To Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-to-pos": [{
          to: scaleGradientStopPosition()
        }],
        /**
         * Gradient Color Stops From
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-from": [{
          from: scaleColor()
        }],
        /**
         * Gradient Color Stops Via
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-via": [{
          via: scaleColor()
        }],
        /**
         * Gradient Color Stops To
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-to": [{
          to: scaleColor()
        }],
        // ---------------
        // --- Borders ---
        // ---------------
        /**
         * Border Radius
         * @see https://tailwindcss.com/docs/border-radius
         */
        rounded: [{
          rounded: scaleRadius()
        }],
        /**
         * Border Radius Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-s": [{
          "rounded-s": scaleRadius()
        }],
        /**
         * Border Radius End
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-e": [{
          "rounded-e": scaleRadius()
        }],
        /**
         * Border Radius Top
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-t": [{
          "rounded-t": scaleRadius()
        }],
        /**
         * Border Radius Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-r": [{
          "rounded-r": scaleRadius()
        }],
        /**
         * Border Radius Bottom
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-b": [{
          "rounded-b": scaleRadius()
        }],
        /**
         * Border Radius Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-l": [{
          "rounded-l": scaleRadius()
        }],
        /**
         * Border Radius Start Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-ss": [{
          "rounded-ss": scaleRadius()
        }],
        /**
         * Border Radius Start End
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-se": [{
          "rounded-se": scaleRadius()
        }],
        /**
         * Border Radius End End
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-ee": [{
          "rounded-ee": scaleRadius()
        }],
        /**
         * Border Radius End Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-es": [{
          "rounded-es": scaleRadius()
        }],
        /**
         * Border Radius Top Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-tl": [{
          "rounded-tl": scaleRadius()
        }],
        /**
         * Border Radius Top Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-tr": [{
          "rounded-tr": scaleRadius()
        }],
        /**
         * Border Radius Bottom Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-br": [{
          "rounded-br": scaleRadius()
        }],
        /**
         * Border Radius Bottom Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-bl": [{
          "rounded-bl": scaleRadius()
        }],
        /**
         * Border Width
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w": [{
          border: scaleBorderWidth()
        }],
        /**
         * Border Width X
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-x": [{
          "border-x": scaleBorderWidth()
        }],
        /**
         * Border Width Y
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-y": [{
          "border-y": scaleBorderWidth()
        }],
        /**
         * Border Width Start
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-s": [{
          "border-s": scaleBorderWidth()
        }],
        /**
         * Border Width End
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-e": [{
          "border-e": scaleBorderWidth()
        }],
        /**
         * Border Width Top
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-t": [{
          "border-t": scaleBorderWidth()
        }],
        /**
         * Border Width Right
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-r": [{
          "border-r": scaleBorderWidth()
        }],
        /**
         * Border Width Bottom
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-b": [{
          "border-b": scaleBorderWidth()
        }],
        /**
         * Border Width Left
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-l": [{
          "border-l": scaleBorderWidth()
        }],
        /**
         * Divide Width X
         * @see https://tailwindcss.com/docs/border-width#between-children
         */
        "divide-x": [{
          "divide-x": scaleBorderWidth()
        }],
        /**
         * Divide Width X Reverse
         * @see https://tailwindcss.com/docs/border-width#between-children
         */
        "divide-x-reverse": ["divide-x-reverse"],
        /**
         * Divide Width Y
         * @see https://tailwindcss.com/docs/border-width#between-children
         */
        "divide-y": [{
          "divide-y": scaleBorderWidth()
        }],
        /**
         * Divide Width Y Reverse
         * @see https://tailwindcss.com/docs/border-width#between-children
         */
        "divide-y-reverse": ["divide-y-reverse"],
        /**
         * Border Style
         * @see https://tailwindcss.com/docs/border-style
         */
        "border-style": [{
          border: [...scaleLineStyle(), "hidden", "none"]
        }],
        /**
         * Divide Style
         * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
         */
        "divide-style": [{
          divide: [...scaleLineStyle(), "hidden", "none"]
        }],
        /**
         * Border Color
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color": [{
          border: scaleColor()
        }],
        /**
         * Border Color X
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-x": [{
          "border-x": scaleColor()
        }],
        /**
         * Border Color Y
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-y": [{
          "border-y": scaleColor()
        }],
        /**
         * Border Color S
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-s": [{
          "border-s": scaleColor()
        }],
        /**
         * Border Color E
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-e": [{
          "border-e": scaleColor()
        }],
        /**
         * Border Color Top
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-t": [{
          "border-t": scaleColor()
        }],
        /**
         * Border Color Right
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-r": [{
          "border-r": scaleColor()
        }],
        /**
         * Border Color Bottom
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-b": [{
          "border-b": scaleColor()
        }],
        /**
         * Border Color Left
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-l": [{
          "border-l": scaleColor()
        }],
        /**
         * Divide Color
         * @see https://tailwindcss.com/docs/divide-color
         */
        "divide-color": [{
          divide: scaleColor()
        }],
        /**
         * Outline Style
         * @see https://tailwindcss.com/docs/outline-style
         */
        "outline-style": [{
          outline: [...scaleLineStyle(), "none", "hidden"]
        }],
        /**
         * Outline Offset
         * @see https://tailwindcss.com/docs/outline-offset
         */
        "outline-offset": [{
          "outline-offset": [isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Outline Width
         * @see https://tailwindcss.com/docs/outline-width
         */
        "outline-w": [{
          outline: ["", isNumber2, isArbitraryVariableLength, isArbitraryLength]
        }],
        /**
         * Outline Color
         * @see https://tailwindcss.com/docs/outline-color
         */
        "outline-color": [{
          outline: scaleColor()
        }],
        // ---------------
        // --- Effects ---
        // ---------------
        /**
         * Box Shadow
         * @see https://tailwindcss.com/docs/box-shadow
         */
        shadow: [{
          shadow: [
            // Deprecated since Tailwind CSS v4.0.0
            "",
            "none",
            themeShadow,
            isArbitraryVariableShadow,
            isArbitraryShadow
          ]
        }],
        /**
         * Box Shadow Color
         * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
         */
        "shadow-color": [{
          shadow: scaleColor()
        }],
        /**
         * Inset Box Shadow
         * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
         */
        "inset-shadow": [{
          "inset-shadow": ["none", themeInsetShadow, isArbitraryVariableShadow, isArbitraryShadow]
        }],
        /**
         * Inset Box Shadow Color
         * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
         */
        "inset-shadow-color": [{
          "inset-shadow": scaleColor()
        }],
        /**
         * Ring Width
         * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
         */
        "ring-w": [{
          ring: scaleBorderWidth()
        }],
        /**
         * Ring Width Inset
         * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
         * @deprecated since Tailwind CSS v4.0.0
         * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
         */
        "ring-w-inset": ["ring-inset"],
        /**
         * Ring Color
         * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
         */
        "ring-color": [{
          ring: scaleColor()
        }],
        /**
         * Ring Offset Width
         * @see https://v3.tailwindcss.com/docs/ring-offset-width
         * @deprecated since Tailwind CSS v4.0.0
         * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
         */
        "ring-offset-w": [{
          "ring-offset": [isNumber2, isArbitraryLength]
        }],
        /**
         * Ring Offset Color
         * @see https://v3.tailwindcss.com/docs/ring-offset-color
         * @deprecated since Tailwind CSS v4.0.0
         * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
         */
        "ring-offset-color": [{
          "ring-offset": scaleColor()
        }],
        /**
         * Inset Ring Width
         * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
         */
        "inset-ring-w": [{
          "inset-ring": scaleBorderWidth()
        }],
        /**
         * Inset Ring Color
         * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
         */
        "inset-ring-color": [{
          "inset-ring": scaleColor()
        }],
        /**
         * Text Shadow
         * @see https://tailwindcss.com/docs/text-shadow
         */
        "text-shadow": [{
          "text-shadow": ["none", themeTextShadow, isArbitraryVariableShadow, isArbitraryShadow]
        }],
        /**
         * Text Shadow Color
         * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
         */
        "text-shadow-color": [{
          "text-shadow": scaleColor()
        }],
        /**
         * Opacity
         * @see https://tailwindcss.com/docs/opacity
         */
        opacity: [{
          opacity: [isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Mix Blend Mode
         * @see https://tailwindcss.com/docs/mix-blend-mode
         */
        "mix-blend": [{
          "mix-blend": [...scaleBlendMode(), "plus-darker", "plus-lighter"]
        }],
        /**
         * Background Blend Mode
         * @see https://tailwindcss.com/docs/background-blend-mode
         */
        "bg-blend": [{
          "bg-blend": scaleBlendMode()
        }],
        /**
         * Mask Clip
         * @see https://tailwindcss.com/docs/mask-clip
         */
        "mask-clip": [{
          "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
        }, "mask-no-clip"],
        /**
         * Mask Composite
         * @see https://tailwindcss.com/docs/mask-composite
         */
        "mask-composite": [{
          mask: ["add", "subtract", "intersect", "exclude"]
        }],
        /**
         * Mask Image
         * @see https://tailwindcss.com/docs/mask-image
         */
        "mask-image-linear-pos": [{
          "mask-linear": [isNumber2]
        }],
        "mask-image-linear-from-pos": [{
          "mask-linear-from": scaleMaskImagePosition()
        }],
        "mask-image-linear-to-pos": [{
          "mask-linear-to": scaleMaskImagePosition()
        }],
        "mask-image-linear-from-color": [{
          "mask-linear-from": scaleColor()
        }],
        "mask-image-linear-to-color": [{
          "mask-linear-to": scaleColor()
        }],
        "mask-image-t-from-pos": [{
          "mask-t-from": scaleMaskImagePosition()
        }],
        "mask-image-t-to-pos": [{
          "mask-t-to": scaleMaskImagePosition()
        }],
        "mask-image-t-from-color": [{
          "mask-t-from": scaleColor()
        }],
        "mask-image-t-to-color": [{
          "mask-t-to": scaleColor()
        }],
        "mask-image-r-from-pos": [{
          "mask-r-from": scaleMaskImagePosition()
        }],
        "mask-image-r-to-pos": [{
          "mask-r-to": scaleMaskImagePosition()
        }],
        "mask-image-r-from-color": [{
          "mask-r-from": scaleColor()
        }],
        "mask-image-r-to-color": [{
          "mask-r-to": scaleColor()
        }],
        "mask-image-b-from-pos": [{
          "mask-b-from": scaleMaskImagePosition()
        }],
        "mask-image-b-to-pos": [{
          "mask-b-to": scaleMaskImagePosition()
        }],
        "mask-image-b-from-color": [{
          "mask-b-from": scaleColor()
        }],
        "mask-image-b-to-color": [{
          "mask-b-to": scaleColor()
        }],
        "mask-image-l-from-pos": [{
          "mask-l-from": scaleMaskImagePosition()
        }],
        "mask-image-l-to-pos": [{
          "mask-l-to": scaleMaskImagePosition()
        }],
        "mask-image-l-from-color": [{
          "mask-l-from": scaleColor()
        }],
        "mask-image-l-to-color": [{
          "mask-l-to": scaleColor()
        }],
        "mask-image-x-from-pos": [{
          "mask-x-from": scaleMaskImagePosition()
        }],
        "mask-image-x-to-pos": [{
          "mask-x-to": scaleMaskImagePosition()
        }],
        "mask-image-x-from-color": [{
          "mask-x-from": scaleColor()
        }],
        "mask-image-x-to-color": [{
          "mask-x-to": scaleColor()
        }],
        "mask-image-y-from-pos": [{
          "mask-y-from": scaleMaskImagePosition()
        }],
        "mask-image-y-to-pos": [{
          "mask-y-to": scaleMaskImagePosition()
        }],
        "mask-image-y-from-color": [{
          "mask-y-from": scaleColor()
        }],
        "mask-image-y-to-color": [{
          "mask-y-to": scaleColor()
        }],
        "mask-image-radial": [{
          "mask-radial": [isArbitraryVariable, isArbitraryValue]
        }],
        "mask-image-radial-from-pos": [{
          "mask-radial-from": scaleMaskImagePosition()
        }],
        "mask-image-radial-to-pos": [{
          "mask-radial-to": scaleMaskImagePosition()
        }],
        "mask-image-radial-from-color": [{
          "mask-radial-from": scaleColor()
        }],
        "mask-image-radial-to-color": [{
          "mask-radial-to": scaleColor()
        }],
        "mask-image-radial-shape": [{
          "mask-radial": ["circle", "ellipse"]
        }],
        "mask-image-radial-size": [{
          "mask-radial": [{
            closest: ["side", "corner"],
            farthest: ["side", "corner"]
          }]
        }],
        "mask-image-radial-pos": [{
          "mask-radial-at": scalePosition()
        }],
        "mask-image-conic-pos": [{
          "mask-conic": [isNumber2]
        }],
        "mask-image-conic-from-pos": [{
          "mask-conic-from": scaleMaskImagePosition()
        }],
        "mask-image-conic-to-pos": [{
          "mask-conic-to": scaleMaskImagePosition()
        }],
        "mask-image-conic-from-color": [{
          "mask-conic-from": scaleColor()
        }],
        "mask-image-conic-to-color": [{
          "mask-conic-to": scaleColor()
        }],
        /**
         * Mask Mode
         * @see https://tailwindcss.com/docs/mask-mode
         */
        "mask-mode": [{
          mask: ["alpha", "luminance", "match"]
        }],
        /**
         * Mask Origin
         * @see https://tailwindcss.com/docs/mask-origin
         */
        "mask-origin": [{
          "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
        }],
        /**
         * Mask Position
         * @see https://tailwindcss.com/docs/mask-position
         */
        "mask-position": [{
          mask: scaleBgPosition()
        }],
        /**
         * Mask Repeat
         * @see https://tailwindcss.com/docs/mask-repeat
         */
        "mask-repeat": [{
          mask: scaleBgRepeat()
        }],
        /**
         * Mask Size
         * @see https://tailwindcss.com/docs/mask-size
         */
        "mask-size": [{
          mask: scaleBgSize()
        }],
        /**
         * Mask Type
         * @see https://tailwindcss.com/docs/mask-type
         */
        "mask-type": [{
          "mask-type": ["alpha", "luminance"]
        }],
        /**
         * Mask Image
         * @see https://tailwindcss.com/docs/mask-image
         */
        "mask-image": [{
          mask: ["none", isArbitraryVariable, isArbitraryValue]
        }],
        // ---------------
        // --- Filters ---
        // ---------------
        /**
         * Filter
         * @see https://tailwindcss.com/docs/filter
         */
        filter: [{
          filter: [
            // Deprecated since Tailwind CSS v3.0.0
            "",
            "none",
            isArbitraryVariable,
            isArbitraryValue
          ]
        }],
        /**
         * Blur
         * @see https://tailwindcss.com/docs/blur
         */
        blur: [{
          blur: scaleBlur()
        }],
        /**
         * Brightness
         * @see https://tailwindcss.com/docs/brightness
         */
        brightness: [{
          brightness: [isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Contrast
         * @see https://tailwindcss.com/docs/contrast
         */
        contrast: [{
          contrast: [isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Drop Shadow
         * @see https://tailwindcss.com/docs/drop-shadow
         */
        "drop-shadow": [{
          "drop-shadow": [
            // Deprecated since Tailwind CSS v4.0.0
            "",
            "none",
            themeDropShadow,
            isArbitraryVariableShadow,
            isArbitraryShadow
          ]
        }],
        /**
         * Drop Shadow Color
         * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
         */
        "drop-shadow-color": [{
          "drop-shadow": scaleColor()
        }],
        /**
         * Grayscale
         * @see https://tailwindcss.com/docs/grayscale
         */
        grayscale: [{
          grayscale: ["", isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Hue Rotate
         * @see https://tailwindcss.com/docs/hue-rotate
         */
        "hue-rotate": [{
          "hue-rotate": [isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Invert
         * @see https://tailwindcss.com/docs/invert
         */
        invert: [{
          invert: ["", isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Saturate
         * @see https://tailwindcss.com/docs/saturate
         */
        saturate: [{
          saturate: [isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Sepia
         * @see https://tailwindcss.com/docs/sepia
         */
        sepia: [{
          sepia: ["", isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Filter
         * @see https://tailwindcss.com/docs/backdrop-filter
         */
        "backdrop-filter": [{
          "backdrop-filter": [
            // Deprecated since Tailwind CSS v3.0.0
            "",
            "none",
            isArbitraryVariable,
            isArbitraryValue
          ]
        }],
        /**
         * Backdrop Blur
         * @see https://tailwindcss.com/docs/backdrop-blur
         */
        "backdrop-blur": [{
          "backdrop-blur": scaleBlur()
        }],
        /**
         * Backdrop Brightness
         * @see https://tailwindcss.com/docs/backdrop-brightness
         */
        "backdrop-brightness": [{
          "backdrop-brightness": [isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Contrast
         * @see https://tailwindcss.com/docs/backdrop-contrast
         */
        "backdrop-contrast": [{
          "backdrop-contrast": [isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Grayscale
         * @see https://tailwindcss.com/docs/backdrop-grayscale
         */
        "backdrop-grayscale": [{
          "backdrop-grayscale": ["", isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Hue Rotate
         * @see https://tailwindcss.com/docs/backdrop-hue-rotate
         */
        "backdrop-hue-rotate": [{
          "backdrop-hue-rotate": [isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Invert
         * @see https://tailwindcss.com/docs/backdrop-invert
         */
        "backdrop-invert": [{
          "backdrop-invert": ["", isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Opacity
         * @see https://tailwindcss.com/docs/backdrop-opacity
         */
        "backdrop-opacity": [{
          "backdrop-opacity": [isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Saturate
         * @see https://tailwindcss.com/docs/backdrop-saturate
         */
        "backdrop-saturate": [{
          "backdrop-saturate": [isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Sepia
         * @see https://tailwindcss.com/docs/backdrop-sepia
         */
        "backdrop-sepia": [{
          "backdrop-sepia": ["", isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        // --------------
        // --- Tables ---
        // --------------
        /**
         * Border Collapse
         * @see https://tailwindcss.com/docs/border-collapse
         */
        "border-collapse": [{
          border: ["collapse", "separate"]
        }],
        /**
         * Border Spacing
         * @see https://tailwindcss.com/docs/border-spacing
         */
        "border-spacing": [{
          "border-spacing": scaleUnambiguousSpacing()
        }],
        /**
         * Border Spacing X
         * @see https://tailwindcss.com/docs/border-spacing
         */
        "border-spacing-x": [{
          "border-spacing-x": scaleUnambiguousSpacing()
        }],
        /**
         * Border Spacing Y
         * @see https://tailwindcss.com/docs/border-spacing
         */
        "border-spacing-y": [{
          "border-spacing-y": scaleUnambiguousSpacing()
        }],
        /**
         * Table Layout
         * @see https://tailwindcss.com/docs/table-layout
         */
        "table-layout": [{
          table: ["auto", "fixed"]
        }],
        /**
         * Caption Side
         * @see https://tailwindcss.com/docs/caption-side
         */
        caption: [{
          caption: ["top", "bottom"]
        }],
        // ---------------------------------
        // --- Transitions and Animation ---
        // ---------------------------------
        /**
         * Transition Property
         * @see https://tailwindcss.com/docs/transition-property
         */
        transition: [{
          transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Transition Behavior
         * @see https://tailwindcss.com/docs/transition-behavior
         */
        "transition-behavior": [{
          transition: ["normal", "discrete"]
        }],
        /**
         * Transition Duration
         * @see https://tailwindcss.com/docs/transition-duration
         */
        duration: [{
          duration: [isNumber2, "initial", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Transition Timing Function
         * @see https://tailwindcss.com/docs/transition-timing-function
         */
        ease: [{
          ease: ["linear", "initial", themeEase, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Transition Delay
         * @see https://tailwindcss.com/docs/transition-delay
         */
        delay: [{
          delay: [isNumber2, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Animation
         * @see https://tailwindcss.com/docs/animation
         */
        animate: [{
          animate: ["none", themeAnimate, isArbitraryVariable, isArbitraryValue]
        }],
        // ------------------
        // --- Transforms ---
        // ------------------
        /**
         * Backface Visibility
         * @see https://tailwindcss.com/docs/backface-visibility
         */
        backface: [{
          backface: ["hidden", "visible"]
        }],
        /**
         * Perspective
         * @see https://tailwindcss.com/docs/perspective
         */
        perspective: [{
          perspective: [themePerspective, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Perspective Origin
         * @see https://tailwindcss.com/docs/perspective-origin
         */
        "perspective-origin": [{
          "perspective-origin": scalePositionWithArbitrary()
        }],
        /**
         * Rotate
         * @see https://tailwindcss.com/docs/rotate
         */
        rotate: [{
          rotate: scaleRotate()
        }],
        /**
         * Rotate X
         * @see https://tailwindcss.com/docs/rotate
         */
        "rotate-x": [{
          "rotate-x": scaleRotate()
        }],
        /**
         * Rotate Y
         * @see https://tailwindcss.com/docs/rotate
         */
        "rotate-y": [{
          "rotate-y": scaleRotate()
        }],
        /**
         * Rotate Z
         * @see https://tailwindcss.com/docs/rotate
         */
        "rotate-z": [{
          "rotate-z": scaleRotate()
        }],
        /**
         * Scale
         * @see https://tailwindcss.com/docs/scale
         */
        scale: [{
          scale: scaleScale()
        }],
        /**
         * Scale X
         * @see https://tailwindcss.com/docs/scale
         */
        "scale-x": [{
          "scale-x": scaleScale()
        }],
        /**
         * Scale Y
         * @see https://tailwindcss.com/docs/scale
         */
        "scale-y": [{
          "scale-y": scaleScale()
        }],
        /**
         * Scale Z
         * @see https://tailwindcss.com/docs/scale
         */
        "scale-z": [{
          "scale-z": scaleScale()
        }],
        /**
         * Scale 3D
         * @see https://tailwindcss.com/docs/scale
         */
        "scale-3d": ["scale-3d"],
        /**
         * Skew
         * @see https://tailwindcss.com/docs/skew
         */
        skew: [{
          skew: scaleSkew()
        }],
        /**
         * Skew X
         * @see https://tailwindcss.com/docs/skew
         */
        "skew-x": [{
          "skew-x": scaleSkew()
        }],
        /**
         * Skew Y
         * @see https://tailwindcss.com/docs/skew
         */
        "skew-y": [{
          "skew-y": scaleSkew()
        }],
        /**
         * Transform
         * @see https://tailwindcss.com/docs/transform
         */
        transform: [{
          transform: [isArbitraryVariable, isArbitraryValue, "", "none", "gpu", "cpu"]
        }],
        /**
         * Transform Origin
         * @see https://tailwindcss.com/docs/transform-origin
         */
        "transform-origin": [{
          origin: scalePositionWithArbitrary()
        }],
        /**
         * Transform Style
         * @see https://tailwindcss.com/docs/transform-style
         */
        "transform-style": [{
          transform: ["3d", "flat"]
        }],
        /**
         * Translate
         * @see https://tailwindcss.com/docs/translate
         */
        translate: [{
          translate: scaleTranslate()
        }],
        /**
         * Translate X
         * @see https://tailwindcss.com/docs/translate
         */
        "translate-x": [{
          "translate-x": scaleTranslate()
        }],
        /**
         * Translate Y
         * @see https://tailwindcss.com/docs/translate
         */
        "translate-y": [{
          "translate-y": scaleTranslate()
        }],
        /**
         * Translate Z
         * @see https://tailwindcss.com/docs/translate
         */
        "translate-z": [{
          "translate-z": scaleTranslate()
        }],
        /**
         * Translate None
         * @see https://tailwindcss.com/docs/translate
         */
        "translate-none": ["translate-none"],
        // ---------------------
        // --- Interactivity ---
        // ---------------------
        /**
         * Accent Color
         * @see https://tailwindcss.com/docs/accent-color
         */
        accent: [{
          accent: scaleColor()
        }],
        /**
         * Appearance
         * @see https://tailwindcss.com/docs/appearance
         */
        appearance: [{
          appearance: ["none", "auto"]
        }],
        /**
         * Caret Color
         * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
         */
        "caret-color": [{
          caret: scaleColor()
        }],
        /**
         * Color Scheme
         * @see https://tailwindcss.com/docs/color-scheme
         */
        "color-scheme": [{
          scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
        }],
        /**
         * Cursor
         * @see https://tailwindcss.com/docs/cursor
         */
        cursor: [{
          cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Field Sizing
         * @see https://tailwindcss.com/docs/field-sizing
         */
        "field-sizing": [{
          "field-sizing": ["fixed", "content"]
        }],
        /**
         * Pointer Events
         * @see https://tailwindcss.com/docs/pointer-events
         */
        "pointer-events": [{
          "pointer-events": ["auto", "none"]
        }],
        /**
         * Resize
         * @see https://tailwindcss.com/docs/resize
         */
        resize: [{
          resize: ["none", "", "y", "x"]
        }],
        /**
         * Scroll Behavior
         * @see https://tailwindcss.com/docs/scroll-behavior
         */
        "scroll-behavior": [{
          scroll: ["auto", "smooth"]
        }],
        /**
         * Scroll Margin
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-m": [{
          "scroll-m": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin X
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mx": [{
          "scroll-mx": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin Y
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-my": [{
          "scroll-my": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin Start
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-ms": [{
          "scroll-ms": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin End
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-me": [{
          "scroll-me": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin Top
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mt": [{
          "scroll-mt": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin Right
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mr": [{
          "scroll-mr": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin Bottom
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mb": [{
          "scroll-mb": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin Left
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-ml": [{
          "scroll-ml": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-p": [{
          "scroll-p": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding X
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-px": [{
          "scroll-px": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding Y
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-py": [{
          "scroll-py": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding Start
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-ps": [{
          "scroll-ps": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding End
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pe": [{
          "scroll-pe": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding Top
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pt": [{
          "scroll-pt": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding Right
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pr": [{
          "scroll-pr": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding Bottom
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pb": [{
          "scroll-pb": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding Left
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pl": [{
          "scroll-pl": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Snap Align
         * @see https://tailwindcss.com/docs/scroll-snap-align
         */
        "snap-align": [{
          snap: ["start", "end", "center", "align-none"]
        }],
        /**
         * Scroll Snap Stop
         * @see https://tailwindcss.com/docs/scroll-snap-stop
         */
        "snap-stop": [{
          snap: ["normal", "always"]
        }],
        /**
         * Scroll Snap Type
         * @see https://tailwindcss.com/docs/scroll-snap-type
         */
        "snap-type": [{
          snap: ["none", "x", "y", "both"]
        }],
        /**
         * Scroll Snap Type Strictness
         * @see https://tailwindcss.com/docs/scroll-snap-type
         */
        "snap-strictness": [{
          snap: ["mandatory", "proximity"]
        }],
        /**
         * Touch Action
         * @see https://tailwindcss.com/docs/touch-action
         */
        touch: [{
          touch: ["auto", "none", "manipulation"]
        }],
        /**
         * Touch Action X
         * @see https://tailwindcss.com/docs/touch-action
         */
        "touch-x": [{
          "touch-pan": ["x", "left", "right"]
        }],
        /**
         * Touch Action Y
         * @see https://tailwindcss.com/docs/touch-action
         */
        "touch-y": [{
          "touch-pan": ["y", "up", "down"]
        }],
        /**
         * Touch Action Pinch Zoom
         * @see https://tailwindcss.com/docs/touch-action
         */
        "touch-pz": ["touch-pinch-zoom"],
        /**
         * User Select
         * @see https://tailwindcss.com/docs/user-select
         */
        select: [{
          select: ["none", "text", "all", "auto"]
        }],
        /**
         * Will Change
         * @see https://tailwindcss.com/docs/will-change
         */
        "will-change": [{
          "will-change": ["auto", "scroll", "contents", "transform", isArbitraryVariable, isArbitraryValue]
        }],
        // -----------
        // --- SVG ---
        // -----------
        /**
         * Fill
         * @see https://tailwindcss.com/docs/fill
         */
        fill: [{
          fill: ["none", ...scaleColor()]
        }],
        /**
         * Stroke Width
         * @see https://tailwindcss.com/docs/stroke-width
         */
        "stroke-w": [{
          stroke: [isNumber2, isArbitraryVariableLength, isArbitraryLength, isArbitraryNumber]
        }],
        /**
         * Stroke
         * @see https://tailwindcss.com/docs/stroke
         */
        stroke: [{
          stroke: ["none", ...scaleColor()]
        }],
        // ---------------------
        // --- Accessibility ---
        // ---------------------
        /**
         * Forced Color Adjust
         * @see https://tailwindcss.com/docs/forced-color-adjust
         */
        "forced-color-adjust": [{
          "forced-color-adjust": ["auto", "none"]
        }]
      },
      conflictingClassGroups: {
        overflow: ["overflow-x", "overflow-y"],
        overscroll: ["overscroll-x", "overscroll-y"],
        inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
        "inset-x": ["right", "left"],
        "inset-y": ["top", "bottom"],
        flex: ["basis", "grow", "shrink"],
        gap: ["gap-x", "gap-y"],
        p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
        px: ["pr", "pl"],
        py: ["pt", "pb"],
        m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
        mx: ["mr", "ml"],
        my: ["mt", "mb"],
        size: ["w", "h"],
        "font-size": ["leading"],
        "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
        "fvn-ordinal": ["fvn-normal"],
        "fvn-slashed-zero": ["fvn-normal"],
        "fvn-figure": ["fvn-normal"],
        "fvn-spacing": ["fvn-normal"],
        "fvn-fraction": ["fvn-normal"],
        "line-clamp": ["display", "overflow"],
        rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
        "rounded-s": ["rounded-ss", "rounded-es"],
        "rounded-e": ["rounded-se", "rounded-ee"],
        "rounded-t": ["rounded-tl", "rounded-tr"],
        "rounded-r": ["rounded-tr", "rounded-br"],
        "rounded-b": ["rounded-br", "rounded-bl"],
        "rounded-l": ["rounded-tl", "rounded-bl"],
        "border-spacing": ["border-spacing-x", "border-spacing-y"],
        "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
        "border-w-x": ["border-w-r", "border-w-l"],
        "border-w-y": ["border-w-t", "border-w-b"],
        "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
        "border-color-x": ["border-color-r", "border-color-l"],
        "border-color-y": ["border-color-t", "border-color-b"],
        translate: ["translate-x", "translate-y", "translate-none"],
        "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
        "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
        "scroll-mx": ["scroll-mr", "scroll-ml"],
        "scroll-my": ["scroll-mt", "scroll-mb"],
        "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
        "scroll-px": ["scroll-pr", "scroll-pl"],
        "scroll-py": ["scroll-pt", "scroll-pb"],
        touch: ["touch-x", "touch-y", "touch-pz"],
        "touch-x": ["touch"],
        "touch-y": ["touch"],
        "touch-pz": ["touch"]
      },
      conflictingClassGroupModifiers: {
        "font-size": ["leading"]
      },
      orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
    };
  };
  var twMerge = /* @__PURE__ */ createTailwindMerge(getDefaultConfig);

  // lib/utils.ts
  function cn(...inputs) {
    return twMerge(clsx(inputs));
  }

  // components/ui/button.tsx
  var import_jsx_runtime2 = __toESM(require_jsx_runtime());
  var buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.98]",
    {
      variants: {
        variant: {
          default: "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30",
          destructive: "bg-destructive text-white shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
          outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
          secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
          ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
          link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
          default: "h-10 px-4 py-2 has-[>svg]:px-3",
          sm: "h-8 rounded-md gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
          lg: "h-12 rounded-xl px-6 text-base has-[>svg]:px-4",
          icon: "size-10 rounded-xl",
          "icon-sm": "size-8 rounded-lg",
          "icon-lg": "size-12 rounded-2xl"
        }
      },
      defaultVariants: {
        variant: "default",
        size: "default"
      }
    }
  );
  function Button({
    className,
    variant,
    size: size4,
    asChild = false,
    ...props
  }) {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      Comp,
      {
        "data-slot": "button",
        className: cn(buttonVariants({ variant, size: size4, className })),
        ...props
      }
    );
  }

  // node_modules/@radix-ui/react-tooltip/dist/index.mjs
  var React24 = __toESM(require_react(), 1);

  // node_modules/@radix-ui/primitive/dist/index.mjs
  var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
  function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
    return function handleEvent(event) {
      originalEventHandler?.(event);
      if (checkForDefaultPrevented === false || !event.defaultPrevented) {
        return ourEventHandler?.(event);
      }
    };
  }

  // node_modules/@radix-ui/react-context/dist/index.mjs
  var React5 = __toESM(require_react(), 1);
  var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
  function createContextScope(scopeName, createContextScopeDeps = []) {
    let defaultContexts = [];
    function createContext32(rootComponentName, defaultContext2) {
      const BaseContext = React5.createContext(defaultContext2);
      const index2 = defaultContexts.length;
      defaultContexts = [...defaultContexts, defaultContext2];
      const Provider2 = (props) => {
        const { scope, children, ...context } = props;
        const Context = scope?.[scopeName]?.[index2] || BaseContext;
        const value = React5.useMemo(() => context, Object.values(context));
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Context.Provider, { value, children });
      };
      Provider2.displayName = rootComponentName + "Provider";
      function useContext22(consumerName, scope) {
        const Context = scope?.[scopeName]?.[index2] || BaseContext;
        const context = React5.useContext(Context);
        if (context) return context;
        if (defaultContext2 !== void 0) return defaultContext2;
        throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
      }
      return [Provider2, useContext22];
    }
    const createScope = () => {
      const scopeContexts = defaultContexts.map((defaultContext2) => {
        return React5.createContext(defaultContext2);
      });
      return function useScope(scope) {
        const contexts = scope?.[scopeName] || scopeContexts;
        return React5.useMemo(
          () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
          [scope, contexts]
        );
      };
    };
    createScope.scopeName = scopeName;
    return [createContext32, composeContextScopes(createScope, ...createContextScopeDeps)];
  }
  function composeContextScopes(...scopes) {
    const baseScope = scopes[0];
    if (scopes.length === 1) return baseScope;
    const createScope = () => {
      const scopeHooks = scopes.map((createScope2) => ({
        useScope: createScope2(),
        scopeName: createScope2.scopeName
      }));
      return function useComposedScopes(overrideScopes) {
        const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
          const scopeProps = useScope(overrideScopes);
          const currentScope = scopeProps[`__scope${scopeName}`];
          return { ...nextScopes2, ...currentScope };
        }, {});
        return React5.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
      };
    };
    createScope.scopeName = baseScope.scopeName;
    return createScope;
  }

  // node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs
  var React10 = __toESM(require_react(), 1);

  // node_modules/@radix-ui/react-primitive/dist/index.mjs
  var React7 = __toESM(require_react(), 1);
  var ReactDOM = __toESM(require_react_dom(), 1);

  // node_modules/@radix-ui/react-primitive/node_modules/@radix-ui/react-slot/dist/index.mjs
  var React6 = __toESM(require_react(), 1);
  var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
  // @__NO_SIDE_EFFECTS__
  function createSlot2(ownerName) {
    const SlotClone = /* @__PURE__ */ createSlotClone2(ownerName);
    const Slot22 = React6.forwardRef((props, forwardedRef) => {
      const { children, ...slotProps } = props;
      const childrenArray = React6.Children.toArray(children);
      const slottable = childrenArray.find(isSlottable2);
      if (slottable) {
        const newElement = slottable.props.children;
        const newChildren = childrenArray.map((child) => {
          if (child === slottable) {
            if (React6.Children.count(newElement) > 1) return React6.Children.only(null);
            return React6.isValidElement(newElement) ? newElement.props.children : null;
          } else {
            return child;
          }
        });
        return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children: React6.isValidElement(newElement) ? React6.cloneElement(newElement, void 0, newChildren) : null });
      }
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children });
    });
    Slot22.displayName = `${ownerName}.Slot`;
    return Slot22;
  }
  // @__NO_SIDE_EFFECTS__
  function createSlotClone2(ownerName) {
    const SlotClone = React6.forwardRef((props, forwardedRef) => {
      const { children, ...slotProps } = props;
      if (React6.isValidElement(children)) {
        const childrenRef = getElementRef2(children);
        const props2 = mergeProps2(slotProps, children.props);
        if (children.type !== React6.Fragment) {
          props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
        }
        return React6.cloneElement(children, props2);
      }
      return React6.Children.count(children) > 1 ? React6.Children.only(null) : null;
    });
    SlotClone.displayName = `${ownerName}.SlotClone`;
    return SlotClone;
  }
  var SLOTTABLE_IDENTIFIER2 = /* @__PURE__ */ Symbol("radix.slottable");
  function isSlottable2(child) {
    return React6.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER2;
  }
  function mergeProps2(slotProps, childProps) {
    const overrideProps = { ...childProps };
    for (const propName in childProps) {
      const slotPropValue = slotProps[propName];
      const childPropValue = childProps[propName];
      const isHandler = /^on[A-Z]/.test(propName);
      if (isHandler) {
        if (slotPropValue && childPropValue) {
          overrideProps[propName] = (...args) => {
            const result = childPropValue(...args);
            slotPropValue(...args);
            return result;
          };
        } else if (slotPropValue) {
          overrideProps[propName] = slotPropValue;
        }
      } else if (propName === "style") {
        overrideProps[propName] = { ...slotPropValue, ...childPropValue };
      } else if (propName === "className") {
        overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
      }
    }
    return { ...slotProps, ...overrideProps };
  }
  function getElementRef2(element) {
    let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
    let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.ref;
    }
    getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
    mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.props.ref;
    }
    return element.props.ref || element.ref;
  }

  // node_modules/@radix-ui/react-primitive/dist/index.mjs
  var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
  var NODES = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul"
  ];
  var Primitive = NODES.reduce((primitive, node) => {
    const Slot3 = createSlot2(`Primitive.${node}`);
    const Node2 = React7.forwardRef((props, forwardedRef) => {
      const { asChild, ...primitiveProps } = props;
      const Comp = asChild ? Slot3 : node;
      if (typeof window !== "undefined") {
        window[/* @__PURE__ */ Symbol.for("radix-ui")] = true;
      }
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Comp, { ...primitiveProps, ref: forwardedRef });
    });
    Node2.displayName = `Primitive.${node}`;
    return { ...primitive, [node]: Node2 };
  }, {});
  function dispatchDiscreteCustomEvent(target, event) {
    if (target) ReactDOM.flushSync(() => target.dispatchEvent(event));
  }

  // node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
  var React8 = __toESM(require_react(), 1);
  function useCallbackRef(callback) {
    const callbackRef = React8.useRef(callback);
    React8.useEffect(() => {
      callbackRef.current = callback;
    });
    return React8.useMemo(() => (...args) => callbackRef.current?.(...args), []);
  }

  // node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs
  var React9 = __toESM(require_react(), 1);
  function useEscapeKeydown(onEscapeKeyDownProp, ownerDocument = globalThis?.document) {
    const onEscapeKeyDown = useCallbackRef(onEscapeKeyDownProp);
    React9.useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          onEscapeKeyDown(event);
        }
      };
      ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
      return () => ownerDocument.removeEventListener("keydown", handleKeyDown, { capture: true });
    }, [onEscapeKeyDown, ownerDocument]);
  }

  // node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs
  var import_jsx_runtime6 = __toESM(require_jsx_runtime(), 1);
  var DISMISSABLE_LAYER_NAME = "DismissableLayer";
  var CONTEXT_UPDATE = "dismissableLayer.update";
  var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
  var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
  var originalBodyPointerEvents;
  var DismissableLayerContext = React10.createContext({
    layers: /* @__PURE__ */ new Set(),
    layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
    branches: /* @__PURE__ */ new Set()
  });
  var DismissableLayer = React10.forwardRef(
    (props, forwardedRef) => {
      const {
        disableOutsidePointerEvents = false,
        onEscapeKeyDown,
        onPointerDownOutside,
        onFocusOutside,
        onInteractOutside,
        onDismiss,
        ...layerProps
      } = props;
      const context = React10.useContext(DismissableLayerContext);
      const [node, setNode] = React10.useState(null);
      const ownerDocument = node?.ownerDocument ?? globalThis?.document;
      const [, force] = React10.useState({});
      const composedRefs = useComposedRefs(forwardedRef, (node2) => setNode(node2));
      const layers = Array.from(context.layers);
      const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
      const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
      const index2 = node ? layers.indexOf(node) : -1;
      const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
      const isPointerEventsEnabled = index2 >= highestLayerWithOutsidePointerEventsDisabledIndex;
      const pointerDownOutside = usePointerDownOutside((event) => {
        const target = event.target;
        const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
        if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
        onPointerDownOutside?.(event);
        onInteractOutside?.(event);
        if (!event.defaultPrevented) onDismiss?.();
      }, ownerDocument);
      const focusOutside = useFocusOutside((event) => {
        const target = event.target;
        const isFocusInBranch = [...context.branches].some((branch) => branch.contains(target));
        if (isFocusInBranch) return;
        onFocusOutside?.(event);
        onInteractOutside?.(event);
        if (!event.defaultPrevented) onDismiss?.();
      }, ownerDocument);
      useEscapeKeydown((event) => {
        const isHighestLayer = index2 === context.layers.size - 1;
        if (!isHighestLayer) return;
        onEscapeKeyDown?.(event);
        if (!event.defaultPrevented && onDismiss) {
          event.preventDefault();
          onDismiss();
        }
      }, ownerDocument);
      React10.useEffect(() => {
        if (!node) return;
        if (disableOutsidePointerEvents) {
          if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
            originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
            ownerDocument.body.style.pointerEvents = "none";
          }
          context.layersWithOutsidePointerEventsDisabled.add(node);
        }
        context.layers.add(node);
        dispatchUpdate();
        return () => {
          if (disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1) {
            ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
          }
        };
      }, [node, ownerDocument, disableOutsidePointerEvents, context]);
      React10.useEffect(() => {
        return () => {
          if (!node) return;
          context.layers.delete(node);
          context.layersWithOutsidePointerEventsDisabled.delete(node);
          dispatchUpdate();
        };
      }, [node, context]);
      React10.useEffect(() => {
        const handleUpdate = () => force({});
        document.addEventListener(CONTEXT_UPDATE, handleUpdate);
        return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
      }, []);
      return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        Primitive.div,
        {
          ...layerProps,
          ref: composedRefs,
          style: {
            pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
            ...props.style
          },
          onFocusCapture: composeEventHandlers(props.onFocusCapture, focusOutside.onFocusCapture),
          onBlurCapture: composeEventHandlers(props.onBlurCapture, focusOutside.onBlurCapture),
          onPointerDownCapture: composeEventHandlers(
            props.onPointerDownCapture,
            pointerDownOutside.onPointerDownCapture
          )
        }
      );
    }
  );
  DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;
  var BRANCH_NAME = "DismissableLayerBranch";
  var DismissableLayerBranch = React10.forwardRef((props, forwardedRef) => {
    const context = React10.useContext(DismissableLayerContext);
    const ref = React10.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    React10.useEffect(() => {
      const node = ref.current;
      if (node) {
        context.branches.add(node);
        return () => {
          context.branches.delete(node);
        };
      }
    }, [context.branches]);
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Primitive.div, { ...props, ref: composedRefs });
  });
  DismissableLayerBranch.displayName = BRANCH_NAME;
  function usePointerDownOutside(onPointerDownOutside, ownerDocument = globalThis?.document) {
    const handlePointerDownOutside = useCallbackRef(onPointerDownOutside);
    const isPointerInsideReactTreeRef = React10.useRef(false);
    const handleClickRef = React10.useRef(() => {
    });
    React10.useEffect(() => {
      const handlePointerDown = (event) => {
        if (event.target && !isPointerInsideReactTreeRef.current) {
          let handleAndDispatchPointerDownOutsideEvent2 = function() {
            handleAndDispatchCustomEvent(
              POINTER_DOWN_OUTSIDE,
              handlePointerDownOutside,
              eventDetail,
              { discrete: true }
            );
          };
          var handleAndDispatchPointerDownOutsideEvent = handleAndDispatchPointerDownOutsideEvent2;
          const eventDetail = { originalEvent: event };
          if (event.pointerType === "touch") {
            ownerDocument.removeEventListener("click", handleClickRef.current);
            handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
            ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
          } else {
            handleAndDispatchPointerDownOutsideEvent2();
          }
        } else {
          ownerDocument.removeEventListener("click", handleClickRef.current);
        }
        isPointerInsideReactTreeRef.current = false;
      };
      const timerId = window.setTimeout(() => {
        ownerDocument.addEventListener("pointerdown", handlePointerDown);
      }, 0);
      return () => {
        window.clearTimeout(timerId);
        ownerDocument.removeEventListener("pointerdown", handlePointerDown);
        ownerDocument.removeEventListener("click", handleClickRef.current);
      };
    }, [ownerDocument, handlePointerDownOutside]);
    return {
      // ensures we check React component tree (not just DOM tree)
      onPointerDownCapture: () => isPointerInsideReactTreeRef.current = true
    };
  }
  function useFocusOutside(onFocusOutside, ownerDocument = globalThis?.document) {
    const handleFocusOutside = useCallbackRef(onFocusOutside);
    const isFocusInsideReactTreeRef = React10.useRef(false);
    React10.useEffect(() => {
      const handleFocus = (event) => {
        if (event.target && !isFocusInsideReactTreeRef.current) {
          const eventDetail = { originalEvent: event };
          handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, eventDetail, {
            discrete: false
          });
        }
      };
      ownerDocument.addEventListener("focusin", handleFocus);
      return () => ownerDocument.removeEventListener("focusin", handleFocus);
    }, [ownerDocument, handleFocusOutside]);
    return {
      onFocusCapture: () => isFocusInsideReactTreeRef.current = true,
      onBlurCapture: () => isFocusInsideReactTreeRef.current = false
    };
  }
  function dispatchUpdate() {
    const event = new CustomEvent(CONTEXT_UPDATE);
    document.dispatchEvent(event);
  }
  function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
    const target = detail.originalEvent.target;
    const event = new CustomEvent(name, { bubbles: false, cancelable: true, detail });
    if (handler) target.addEventListener(name, handler, { once: true });
    if (discrete) {
      dispatchDiscreteCustomEvent(target, event);
    } else {
      target.dispatchEvent(event);
    }
  }

  // node_modules/@radix-ui/react-id/dist/index.mjs
  var React12 = __toESM(require_react(), 1);

  // node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
  var React11 = __toESM(require_react(), 1);
  var useLayoutEffect2 = globalThis?.document ? React11.useLayoutEffect : () => {
  };

  // node_modules/@radix-ui/react-id/dist/index.mjs
  var useReactId = React12[" useId ".trim().toString()] || (() => void 0);
  var count = 0;
  function useId(deterministicId) {
    const [id, setId] = React12.useState(useReactId());
    useLayoutEffect2(() => {
      if (!deterministicId) setId((reactId) => reactId ?? String(count++));
    }, [deterministicId]);
    return deterministicId || (id ? `radix-${id}` : "");
  }

  // node_modules/@radix-ui/react-popper/dist/index.mjs
  var React16 = __toESM(require_react(), 1);

  // node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
  var sides = ["top", "right", "bottom", "left"];
  var min = Math.min;
  var max = Math.max;
  var round = Math.round;
  var floor = Math.floor;
  var createCoords = (v) => ({
    x: v,
    y: v
  });
  var oppositeSideMap = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
  };
  var oppositeAlignmentMap = {
    start: "end",
    end: "start"
  };
  function clamp(start, value, end) {
    return max(start, min(value, end));
  }
  function evaluate(value, param) {
    return typeof value === "function" ? value(param) : value;
  }
  function getSide(placement) {
    return placement.split("-")[0];
  }
  function getAlignment(placement) {
    return placement.split("-")[1];
  }
  function getOppositeAxis(axis) {
    return axis === "x" ? "y" : "x";
  }
  function getAxisLength(axis) {
    return axis === "y" ? "height" : "width";
  }
  var yAxisSides = /* @__PURE__ */ new Set(["top", "bottom"]);
  function getSideAxis(placement) {
    return yAxisSides.has(getSide(placement)) ? "y" : "x";
  }
  function getAlignmentAxis(placement) {
    return getOppositeAxis(getSideAxis(placement));
  }
  function getAlignmentSides(placement, rects, rtl) {
    if (rtl === void 0) {
      rtl = false;
    }
    const alignment = getAlignment(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const length = getAxisLength(alignmentAxis);
    let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
    if (rects.reference[length] > rects.floating[length]) {
      mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
    }
    return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
  }
  function getExpandedPlacements(placement) {
    const oppositePlacement = getOppositePlacement(placement);
    return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
  }
  function getOppositeAlignmentPlacement(placement) {
    return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
  }
  var lrPlacement = ["left", "right"];
  var rlPlacement = ["right", "left"];
  var tbPlacement = ["top", "bottom"];
  var btPlacement = ["bottom", "top"];
  function getSideList(side, isStart, rtl) {
    switch (side) {
      case "top":
      case "bottom":
        if (rtl) return isStart ? rlPlacement : lrPlacement;
        return isStart ? lrPlacement : rlPlacement;
      case "left":
      case "right":
        return isStart ? tbPlacement : btPlacement;
      default:
        return [];
    }
  }
  function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
    const alignment = getAlignment(placement);
    let list = getSideList(getSide(placement), direction === "start", rtl);
    if (alignment) {
      list = list.map((side) => side + "-" + alignment);
      if (flipAlignment) {
        list = list.concat(list.map(getOppositeAlignmentPlacement));
      }
    }
    return list;
  }
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
  }
  function expandPaddingObject(padding) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...padding
    };
  }
  function getPaddingObject(padding) {
    return typeof padding !== "number" ? expandPaddingObject(padding) : {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
  }
  function rectToClientRect(rect) {
    const {
      x,
      y,
      width,
      height
    } = rect;
    return {
      width,
      height,
      top: y,
      left: x,
      right: x + width,
      bottom: y + height,
      x,
      y
    };
  }

  // node_modules/@floating-ui/core/dist/floating-ui.core.mjs
  function computeCoordsFromPlacement(_ref, placement, rtl) {
    let {
      reference,
      floating
    } = _ref;
    const sideAxis = getSideAxis(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const alignLength = getAxisLength(alignmentAxis);
    const side = getSide(placement);
    const isVertical = sideAxis === "y";
    const commonX = reference.x + reference.width / 2 - floating.width / 2;
    const commonY = reference.y + reference.height / 2 - floating.height / 2;
    const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
    let coords;
    switch (side) {
      case "top":
        coords = {
          x: commonX,
          y: reference.y - floating.height
        };
        break;
      case "bottom":
        coords = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;
      case "right":
        coords = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;
      case "left":
        coords = {
          x: reference.x - floating.width,
          y: commonY
        };
        break;
      default:
        coords = {
          x: reference.x,
          y: reference.y
        };
    }
    switch (getAlignment(placement)) {
      case "start":
        coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
        break;
      case "end":
        coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
        break;
    }
    return coords;
  }
  var computePosition = async (reference, floating, config) => {
    const {
      placement = "bottom",
      strategy = "absolute",
      middleware = [],
      platform: platform2
    } = config;
    const validMiddleware = middleware.filter(Boolean);
    const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
    let rects = await platform2.getElementRects({
      reference,
      floating,
      strategy
    });
    let {
      x,
      y
    } = computeCoordsFromPlacement(rects, placement, rtl);
    let statefulPlacement = placement;
    let middlewareData = {};
    let resetCount = 0;
    for (let i = 0; i < validMiddleware.length; i++) {
      const {
        name,
        fn
      } = validMiddleware[i];
      const {
        x: nextX,
        y: nextY,
        data,
        reset
      } = await fn({
        x,
        y,
        initialPlacement: placement,
        placement: statefulPlacement,
        strategy,
        middlewareData,
        rects,
        platform: platform2,
        elements: {
          reference,
          floating
        }
      });
      x = nextX != null ? nextX : x;
      y = nextY != null ? nextY : y;
      middlewareData = {
        ...middlewareData,
        [name]: {
          ...middlewareData[name],
          ...data
        }
      };
      if (reset && resetCount <= 50) {
        resetCount++;
        if (typeof reset === "object") {
          if (reset.placement) {
            statefulPlacement = reset.placement;
          }
          if (reset.rects) {
            rects = reset.rects === true ? await platform2.getElementRects({
              reference,
              floating,
              strategy
            }) : reset.rects;
          }
          ({
            x,
            y
          } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
        }
        i = -1;
      }
    }
    return {
      x,
      y,
      placement: statefulPlacement,
      strategy,
      middlewareData
    };
  };
  async function detectOverflow(state, options) {
    var _await$platform$isEle;
    if (options === void 0) {
      options = {};
    }
    const {
      x,
      y,
      platform: platform2,
      rects,
      elements,
      strategy
    } = state;
    const {
      boundary = "clippingAncestors",
      rootBoundary = "viewport",
      elementContext = "floating",
      altBoundary = false,
      padding = 0
    } = evaluate(options, state);
    const paddingObject = getPaddingObject(padding);
    const altContext = elementContext === "floating" ? "reference" : "floating";
    const element = elements[altBoundary ? altContext : elementContext];
    const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
      element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
      boundary,
      rootBoundary,
      strategy
    }));
    const rect = elementContext === "floating" ? {
      x,
      y,
      width: rects.floating.width,
      height: rects.floating.height
    } : rects.reference;
    const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
    const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
      x: 1,
      y: 1
    } : {
      x: 1,
      y: 1
    };
    const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
      elements,
      rect,
      offsetParent,
      strategy
    }) : rect);
    return {
      top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
      bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
      left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
      right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
    };
  }
  var arrow = (options) => ({
    name: "arrow",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        platform: platform2,
        elements,
        middlewareData
      } = state;
      const {
        element,
        padding = 0
      } = evaluate(options, state) || {};
      if (element == null) {
        return {};
      }
      const paddingObject = getPaddingObject(padding);
      const coords = {
        x,
        y
      };
      const axis = getAlignmentAxis(placement);
      const length = getAxisLength(axis);
      const arrowDimensions = await platform2.getDimensions(element);
      const isYAxis = axis === "y";
      const minProp = isYAxis ? "top" : "left";
      const maxProp = isYAxis ? "bottom" : "right";
      const clientProp = isYAxis ? "clientHeight" : "clientWidth";
      const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
      const startDiff = coords[axis] - rects.reference[axis];
      const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
      let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
      if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
        clientSize = elements.floating[clientProp] || rects.floating[length];
      }
      const centerToReference = endDiff / 2 - startDiff / 2;
      const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
      const minPadding = min(paddingObject[minProp], largestPossiblePadding);
      const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
      const min$1 = minPadding;
      const max2 = clientSize - arrowDimensions[length] - maxPadding;
      const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
      const offset4 = clamp(min$1, center, max2);
      const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset4 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
      const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
      return {
        [axis]: coords[axis] + alignmentOffset,
        data: {
          [axis]: offset4,
          centerOffset: center - offset4 - alignmentOffset,
          ...shouldAddOffset && {
            alignmentOffset
          }
        },
        reset: shouldAddOffset
      };
    }
  });
  var flip = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "flip",
      options,
      async fn(state) {
        var _middlewareData$arrow, _middlewareData$flip;
        const {
          placement,
          middlewareData,
          rects,
          initialPlacement,
          platform: platform2,
          elements
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true,
          fallbackPlacements: specifiedFallbackPlacements,
          fallbackStrategy = "bestFit",
          fallbackAxisSideDirection = "none",
          flipAlignment = true,
          ...detectOverflowOptions
        } = evaluate(options, state);
        if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        const side = getSide(placement);
        const initialSideAxis = getSideAxis(initialPlacement);
        const isBasePlacement = getSide(initialPlacement) === initialPlacement;
        const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
        const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
        const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
        if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
          fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
        }
        const placements2 = [initialPlacement, ...fallbackPlacements];
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const overflows = [];
        let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
        if (checkMainAxis) {
          overflows.push(overflow[side]);
        }
        if (checkCrossAxis) {
          const sides2 = getAlignmentSides(placement, rects, rtl);
          overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
        }
        overflowsData = [...overflowsData, {
          placement,
          overflows
        }];
        if (!overflows.every((side2) => side2 <= 0)) {
          var _middlewareData$flip2, _overflowsData$filter;
          const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
          const nextPlacement = placements2[nextIndex];
          if (nextPlacement) {
            const ignoreCrossAxisOverflow = checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false;
            if (!ignoreCrossAxisOverflow || // We leave the current main axis only if every placement on that axis
            // overflows the main axis.
            overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) {
              return {
                data: {
                  index: nextIndex,
                  overflows: overflowsData
                },
                reset: {
                  placement: nextPlacement
                }
              };
            }
          }
          let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
          if (!resetPlacement) {
            switch (fallbackStrategy) {
              case "bestFit": {
                var _overflowsData$filter2;
                const placement2 = (_overflowsData$filter2 = overflowsData.filter((d) => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = getSideAxis(d.placement);
                    return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === "y";
                  }
                  return true;
                }).map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement2) {
                  resetPlacement = placement2;
                }
                break;
              }
              case "initialPlacement":
                resetPlacement = initialPlacement;
                break;
            }
          }
          if (placement !== resetPlacement) {
            return {
              reset: {
                placement: resetPlacement
              }
            };
          }
        }
        return {};
      }
    };
  };
  function getSideOffsets(overflow, rect) {
    return {
      top: overflow.top - rect.height,
      right: overflow.right - rect.width,
      bottom: overflow.bottom - rect.height,
      left: overflow.left - rect.width
    };
  }
  function isAnySideFullyClipped(overflow) {
    return sides.some((side) => overflow[side] >= 0);
  }
  var hide = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "hide",
      options,
      async fn(state) {
        const {
          rects
        } = state;
        const {
          strategy = "referenceHidden",
          ...detectOverflowOptions
        } = evaluate(options, state);
        switch (strategy) {
          case "referenceHidden": {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: "reference"
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
          case "escaped": {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
          default: {
            return {};
          }
        }
      }
    };
  };
  var originSides = /* @__PURE__ */ new Set(["left", "top"]);
  async function convertValueToCoords(state, options) {
    const {
      placement,
      platform: platform2,
      elements
    } = state;
    const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
    const side = getSide(placement);
    const alignment = getAlignment(placement);
    const isVertical = getSideAxis(placement) === "y";
    const mainAxisMulti = originSides.has(side) ? -1 : 1;
    const crossAxisMulti = rtl && isVertical ? -1 : 1;
    const rawValue = evaluate(options, state);
    let {
      mainAxis,
      crossAxis,
      alignmentAxis
    } = typeof rawValue === "number" ? {
      mainAxis: rawValue,
      crossAxis: 0,
      alignmentAxis: null
    } : {
      mainAxis: rawValue.mainAxis || 0,
      crossAxis: rawValue.crossAxis || 0,
      alignmentAxis: rawValue.alignmentAxis
    };
    if (alignment && typeof alignmentAxis === "number") {
      crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
    }
    return isVertical ? {
      x: crossAxis * crossAxisMulti,
      y: mainAxis * mainAxisMulti
    } : {
      x: mainAxis * mainAxisMulti,
      y: crossAxis * crossAxisMulti
    };
  }
  var offset = function(options) {
    if (options === void 0) {
      options = 0;
    }
    return {
      name: "offset",
      options,
      async fn(state) {
        var _middlewareData$offse, _middlewareData$arrow;
        const {
          x,
          y,
          placement,
          middlewareData
        } = state;
        const diffCoords = await convertValueToCoords(state, options);
        if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        return {
          x: x + diffCoords.x,
          y: y + diffCoords.y,
          data: {
            ...diffCoords,
            placement
          }
        };
      }
    };
  };
  var shift = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "shift",
      options,
      async fn(state) {
        const {
          x,
          y,
          placement
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = false,
          limiter = {
            fn: (_ref) => {
              let {
                x: x2,
                y: y2
              } = _ref;
              return {
                x: x2,
                y: y2
              };
            }
          },
          ...detectOverflowOptions
        } = evaluate(options, state);
        const coords = {
          x,
          y
        };
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const crossAxis = getSideAxis(getSide(placement));
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        if (checkMainAxis) {
          const minSide = mainAxis === "y" ? "top" : "left";
          const maxSide = mainAxis === "y" ? "bottom" : "right";
          const min2 = mainAxisCoord + overflow[minSide];
          const max2 = mainAxisCoord - overflow[maxSide];
          mainAxisCoord = clamp(min2, mainAxisCoord, max2);
        }
        if (checkCrossAxis) {
          const minSide = crossAxis === "y" ? "top" : "left";
          const maxSide = crossAxis === "y" ? "bottom" : "right";
          const min2 = crossAxisCoord + overflow[minSide];
          const max2 = crossAxisCoord - overflow[maxSide];
          crossAxisCoord = clamp(min2, crossAxisCoord, max2);
        }
        const limitedCoords = limiter.fn({
          ...state,
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        });
        return {
          ...limitedCoords,
          data: {
            x: limitedCoords.x - x,
            y: limitedCoords.y - y,
            enabled: {
              [mainAxis]: checkMainAxis,
              [crossAxis]: checkCrossAxis
            }
          }
        };
      }
    };
  };
  var limitShift = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      options,
      fn(state) {
        const {
          x,
          y,
          placement,
          rects,
          middlewareData
        } = state;
        const {
          offset: offset4 = 0,
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true
        } = evaluate(options, state);
        const coords = {
          x,
          y
        };
        const crossAxis = getSideAxis(placement);
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        const rawOffset = evaluate(offset4, state);
        const computedOffset = typeof rawOffset === "number" ? {
          mainAxis: rawOffset,
          crossAxis: 0
        } : {
          mainAxis: 0,
          crossAxis: 0,
          ...rawOffset
        };
        if (checkMainAxis) {
          const len = mainAxis === "y" ? "height" : "width";
          const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
          const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
          if (mainAxisCoord < limitMin) {
            mainAxisCoord = limitMin;
          } else if (mainAxisCoord > limitMax) {
            mainAxisCoord = limitMax;
          }
        }
        if (checkCrossAxis) {
          var _middlewareData$offse, _middlewareData$offse2;
          const len = mainAxis === "y" ? "width" : "height";
          const isOriginSide = originSides.has(getSide(placement));
          const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
          const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
          if (crossAxisCoord < limitMin) {
            crossAxisCoord = limitMin;
          } else if (crossAxisCoord > limitMax) {
            crossAxisCoord = limitMax;
          }
        }
        return {
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        };
      }
    };
  };
  var size = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "size",
      options,
      async fn(state) {
        var _state$middlewareData, _state$middlewareData2;
        const {
          placement,
          rects,
          platform: platform2,
          elements
        } = state;
        const {
          apply = () => {
          },
          ...detectOverflowOptions
        } = evaluate(options, state);
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const side = getSide(placement);
        const alignment = getAlignment(placement);
        const isYAxis = getSideAxis(placement) === "y";
        const {
          width,
          height
        } = rects.floating;
        let heightSide;
        let widthSide;
        if (side === "top" || side === "bottom") {
          heightSide = side;
          widthSide = alignment === (await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
        } else {
          widthSide = side;
          heightSide = alignment === "end" ? "top" : "bottom";
        }
        const maximumClippingHeight = height - overflow.top - overflow.bottom;
        const maximumClippingWidth = width - overflow.left - overflow.right;
        const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
        const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
        const noShift = !state.middlewareData.shift;
        let availableHeight = overflowAvailableHeight;
        let availableWidth = overflowAvailableWidth;
        if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
          availableWidth = maximumClippingWidth;
        }
        if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
          availableHeight = maximumClippingHeight;
        }
        if (noShift && !alignment) {
          const xMin = max(overflow.left, 0);
          const xMax = max(overflow.right, 0);
          const yMin = max(overflow.top, 0);
          const yMax = max(overflow.bottom, 0);
          if (isYAxis) {
            availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
          } else {
            availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
          }
        }
        await apply({
          ...state,
          availableWidth,
          availableHeight
        });
        const nextDimensions = await platform2.getDimensions(elements.floating);
        if (width !== nextDimensions.width || height !== nextDimensions.height) {
          return {
            reset: {
              rects: true
            }
          };
        }
        return {};
      }
    };
  };

  // node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
  function hasWindow() {
    return typeof window !== "undefined";
  }
  function getNodeName(node) {
    if (isNode(node)) {
      return (node.nodeName || "").toLowerCase();
    }
    return "#document";
  }
  function getWindow(node) {
    var _node$ownerDocument;
    return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
  }
  function getDocumentElement(node) {
    var _ref;
    return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
  }
  function isNode(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Node || value instanceof getWindow(value).Node;
  }
  function isElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Element || value instanceof getWindow(value).Element;
  }
  function isHTMLElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
  }
  function isShadowRoot(value) {
    if (!hasWindow() || typeof ShadowRoot === "undefined") {
      return false;
    }
    return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
  }
  var invalidOverflowDisplayValues = /* @__PURE__ */ new Set(["inline", "contents"]);
  function isOverflowElement(element) {
    const {
      overflow,
      overflowX,
      overflowY,
      display
    } = getComputedStyle2(element);
    return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !invalidOverflowDisplayValues.has(display);
  }
  var tableElements = /* @__PURE__ */ new Set(["table", "td", "th"]);
  function isTableElement(element) {
    return tableElements.has(getNodeName(element));
  }
  var topLayerSelectors = [":popover-open", ":modal"];
  function isTopLayer(element) {
    return topLayerSelectors.some((selector) => {
      try {
        return element.matches(selector);
      } catch (_e) {
        return false;
      }
    });
  }
  var transformProperties = ["transform", "translate", "scale", "rotate", "perspective"];
  var willChangeValues = ["transform", "translate", "scale", "rotate", "perspective", "filter"];
  var containValues = ["paint", "layout", "strict", "content"];
  function isContainingBlock(elementOrCss) {
    const webkit = isWebKit();
    const css = isElement(elementOrCss) ? getComputedStyle2(elementOrCss) : elementOrCss;
    return transformProperties.some((value) => css[value] ? css[value] !== "none" : false) || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || willChangeValues.some((value) => (css.willChange || "").includes(value)) || containValues.some((value) => (css.contain || "").includes(value));
  }
  function getContainingBlock(element) {
    let currentNode = getParentNode(element);
    while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
      if (isContainingBlock(currentNode)) {
        return currentNode;
      } else if (isTopLayer(currentNode)) {
        return null;
      }
      currentNode = getParentNode(currentNode);
    }
    return null;
  }
  function isWebKit() {
    if (typeof CSS === "undefined" || !CSS.supports) return false;
    return CSS.supports("-webkit-backdrop-filter", "none");
  }
  var lastTraversableNodeNames = /* @__PURE__ */ new Set(["html", "body", "#document"]);
  function isLastTraversableNode(node) {
    return lastTraversableNodeNames.has(getNodeName(node));
  }
  function getComputedStyle2(element) {
    return getWindow(element).getComputedStyle(element);
  }
  function getNodeScroll(element) {
    if (isElement(element)) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }
    return {
      scrollLeft: element.scrollX,
      scrollTop: element.scrollY
    };
  }
  function getParentNode(node) {
    if (getNodeName(node) === "html") {
      return node;
    }
    const result = (
      // Step into the shadow DOM of the parent of a slotted node.
      node.assignedSlot || // DOM Element detected.
      node.parentNode || // ShadowRoot detected.
      isShadowRoot(node) && node.host || // Fallback.
      getDocumentElement(node)
    );
    return isShadowRoot(result) ? result.host : result;
  }
  function getNearestOverflowAncestor(node) {
    const parentNode = getParentNode(node);
    if (isLastTraversableNode(parentNode)) {
      return node.ownerDocument ? node.ownerDocument.body : node.body;
    }
    if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
      return parentNode;
    }
    return getNearestOverflowAncestor(parentNode);
  }
  function getOverflowAncestors(node, list, traverseIframes) {
    var _node$ownerDocument2;
    if (list === void 0) {
      list = [];
    }
    if (traverseIframes === void 0) {
      traverseIframes = true;
    }
    const scrollableAncestor = getNearestOverflowAncestor(node);
    const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
    const win = getWindow(scrollableAncestor);
    if (isBody) {
      const frameElement = getFrameElement(win);
      return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
    }
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
  function getFrameElement(win) {
    return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
  }

  // node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
  function getCssDimensions(element) {
    const css = getComputedStyle2(element);
    let width = parseFloat(css.width) || 0;
    let height = parseFloat(css.height) || 0;
    const hasOffset = isHTMLElement(element);
    const offsetWidth = hasOffset ? element.offsetWidth : width;
    const offsetHeight = hasOffset ? element.offsetHeight : height;
    const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
    if (shouldFallback) {
      width = offsetWidth;
      height = offsetHeight;
    }
    return {
      width,
      height,
      $: shouldFallback
    };
  }
  function unwrapElement(element) {
    return !isElement(element) ? element.contextElement : element;
  }
  function getScale(element) {
    const domElement = unwrapElement(element);
    if (!isHTMLElement(domElement)) {
      return createCoords(1);
    }
    const rect = domElement.getBoundingClientRect();
    const {
      width,
      height,
      $
    } = getCssDimensions(domElement);
    let x = ($ ? round(rect.width) : rect.width) / width;
    let y = ($ ? round(rect.height) : rect.height) / height;
    if (!x || !Number.isFinite(x)) {
      x = 1;
    }
    if (!y || !Number.isFinite(y)) {
      y = 1;
    }
    return {
      x,
      y
    };
  }
  var noOffsets = /* @__PURE__ */ createCoords(0);
  function getVisualOffsets(element) {
    const win = getWindow(element);
    if (!isWebKit() || !win.visualViewport) {
      return noOffsets;
    }
    return {
      x: win.visualViewport.offsetLeft,
      y: win.visualViewport.offsetTop
    };
  }
  function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
      return false;
    }
    return isFixed;
  }
  function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    const clientRect = element.getBoundingClientRect();
    const domElement = unwrapElement(element);
    let scale = createCoords(1);
    if (includeScale) {
      if (offsetParent) {
        if (isElement(offsetParent)) {
          scale = getScale(offsetParent);
        }
      } else {
        scale = getScale(element);
      }
    }
    const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
    let x = (clientRect.left + visualOffsets.x) / scale.x;
    let y = (clientRect.top + visualOffsets.y) / scale.y;
    let width = clientRect.width / scale.x;
    let height = clientRect.height / scale.y;
    if (domElement) {
      const win = getWindow(domElement);
      const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
      let currentWin = win;
      let currentIFrame = getFrameElement(currentWin);
      while (currentIFrame && offsetParent && offsetWin !== currentWin) {
        const iframeScale = getScale(currentIFrame);
        const iframeRect = currentIFrame.getBoundingClientRect();
        const css = getComputedStyle2(currentIFrame);
        const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
        const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
        x *= iframeScale.x;
        y *= iframeScale.y;
        width *= iframeScale.x;
        height *= iframeScale.y;
        x += left;
        y += top;
        currentWin = getWindow(currentIFrame);
        currentIFrame = getFrameElement(currentWin);
      }
    }
    return rectToClientRect({
      width,
      height,
      x,
      y
    });
  }
  function getWindowScrollBarX(element, rect) {
    const leftScroll = getNodeScroll(element).scrollLeft;
    if (!rect) {
      return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
    }
    return rect.left + leftScroll;
  }
  function getHTMLOffset(documentElement, scroll) {
    const htmlRect = documentElement.getBoundingClientRect();
    const x = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
    const y = htmlRect.top + scroll.scrollTop;
    return {
      x,
      y
    };
  }
  function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
    let {
      elements,
      rect,
      offsetParent,
      strategy
    } = _ref;
    const isFixed = strategy === "fixed";
    const documentElement = getDocumentElement(offsetParent);
    const topLayer = elements ? isTopLayer(elements.floating) : false;
    if (offsetParent === documentElement || topLayer && isFixed) {
      return rect;
    }
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    let scale = createCoords(1);
    const offsets = createCoords(0);
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isHTMLElement(offsetParent)) {
        const offsetRect = getBoundingClientRect(offsetParent);
        scale = getScale(offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      }
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
    return {
      width: rect.width * scale.x,
      height: rect.height * scale.y,
      x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
      y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
    };
  }
  function getClientRects(element) {
    return Array.from(element.getClientRects());
  }
  function getDocumentRect(element) {
    const html = getDocumentElement(element);
    const scroll = getNodeScroll(element);
    const body = element.ownerDocument.body;
    const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
    const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
    let x = -scroll.scrollLeft + getWindowScrollBarX(element);
    const y = -scroll.scrollTop;
    if (getComputedStyle2(body).direction === "rtl") {
      x += max(html.clientWidth, body.clientWidth) - width;
    }
    return {
      width,
      height,
      x,
      y
    };
  }
  var SCROLLBAR_MAX = 25;
  function getViewportRect(element, strategy) {
    const win = getWindow(element);
    const html = getDocumentElement(element);
    const visualViewport = win.visualViewport;
    let width = html.clientWidth;
    let height = html.clientHeight;
    let x = 0;
    let y = 0;
    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      const visualViewportBased = isWebKit();
      if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
    const windowScrollbarX = getWindowScrollBarX(html);
    if (windowScrollbarX <= 0) {
      const doc = html.ownerDocument;
      const body = doc.body;
      const bodyStyles = getComputedStyle(body);
      const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
      const clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
      if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) {
        width -= clippingStableScrollbarWidth;
      }
    } else if (windowScrollbarX <= SCROLLBAR_MAX) {
      width += windowScrollbarX;
    }
    return {
      width,
      height,
      x,
      y
    };
  }
  var absoluteOrFixed = /* @__PURE__ */ new Set(["absolute", "fixed"]);
  function getInnerBoundingClientRect(element, strategy) {
    const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
    const top = clientRect.top + element.clientTop;
    const left = clientRect.left + element.clientLeft;
    const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
    const width = element.clientWidth * scale.x;
    const height = element.clientHeight * scale.y;
    const x = left * scale.x;
    const y = top * scale.y;
    return {
      width,
      height,
      x,
      y
    };
  }
  function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
    let rect;
    if (clippingAncestor === "viewport") {
      rect = getViewportRect(element, strategy);
    } else if (clippingAncestor === "document") {
      rect = getDocumentRect(getDocumentElement(element));
    } else if (isElement(clippingAncestor)) {
      rect = getInnerBoundingClientRect(clippingAncestor, strategy);
    } else {
      const visualOffsets = getVisualOffsets(element);
      rect = {
        x: clippingAncestor.x - visualOffsets.x,
        y: clippingAncestor.y - visualOffsets.y,
        width: clippingAncestor.width,
        height: clippingAncestor.height
      };
    }
    return rectToClientRect(rect);
  }
  function hasFixedPositionAncestor(element, stopNode) {
    const parentNode = getParentNode(element);
    if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
      return false;
    }
    return getComputedStyle2(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
  }
  function getClippingElementAncestors(element, cache) {
    const cachedResult = cache.get(element);
    if (cachedResult) {
      return cachedResult;
    }
    let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
    let currentContainingBlockComputedStyle = null;
    const elementIsFixed = getComputedStyle2(element).position === "fixed";
    let currentNode = elementIsFixed ? getParentNode(element) : element;
    while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
      const computedStyle = getComputedStyle2(currentNode);
      const currentNodeIsContaining = isContainingBlock(currentNode);
      if (!currentNodeIsContaining && computedStyle.position === "fixed") {
        currentContainingBlockComputedStyle = null;
      }
      const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && absoluteOrFixed.has(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
      if (shouldDropCurrentNode) {
        result = result.filter((ancestor) => ancestor !== currentNode);
      } else {
        currentContainingBlockComputedStyle = computedStyle;
      }
      currentNode = getParentNode(currentNode);
    }
    cache.set(element, result);
    return result;
  }
  function getClippingRect(_ref) {
    let {
      element,
      boundary,
      rootBoundary,
      strategy
    } = _ref;
    const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
    const clippingAncestors = [...elementClippingAncestors, rootBoundary];
    const firstClippingAncestor = clippingAncestors[0];
    const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
      const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
    return {
      width: clippingRect.right - clippingRect.left,
      height: clippingRect.bottom - clippingRect.top,
      x: clippingRect.left,
      y: clippingRect.top
    };
  }
  function getDimensions(element) {
    const {
      width,
      height
    } = getCssDimensions(element);
    return {
      width,
      height
    };
  }
  function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    const documentElement = getDocumentElement(offsetParent);
    const isFixed = strategy === "fixed";
    const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    const offsets = createCoords(0);
    function setLeftRTLScrollbarOffset() {
      offsets.x = getWindowScrollBarX(documentElement);
    }
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isOffsetParentAnElement) {
        const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      } else if (documentElement) {
        setLeftRTLScrollbarOffset();
      }
    }
    if (isFixed && !isOffsetParentAnElement && documentElement) {
      setLeftRTLScrollbarOffset();
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
    const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
    const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
    return {
      x,
      y,
      width: rect.width,
      height: rect.height
    };
  }
  function isStaticPositioned(element) {
    return getComputedStyle2(element).position === "static";
  }
  function getTrueOffsetParent(element, polyfill) {
    if (!isHTMLElement(element) || getComputedStyle2(element).position === "fixed") {
      return null;
    }
    if (polyfill) {
      return polyfill(element);
    }
    let rawOffsetParent = element.offsetParent;
    if (getDocumentElement(element) === rawOffsetParent) {
      rawOffsetParent = rawOffsetParent.ownerDocument.body;
    }
    return rawOffsetParent;
  }
  function getOffsetParent(element, polyfill) {
    const win = getWindow(element);
    if (isTopLayer(element)) {
      return win;
    }
    if (!isHTMLElement(element)) {
      let svgOffsetParent = getParentNode(element);
      while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
        if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
          return svgOffsetParent;
        }
        svgOffsetParent = getParentNode(svgOffsetParent);
      }
      return win;
    }
    let offsetParent = getTrueOffsetParent(element, polyfill);
    while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
      offsetParent = getTrueOffsetParent(offsetParent, polyfill);
    }
    if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
      return win;
    }
    return offsetParent || getContainingBlock(element) || win;
  }
  var getElementRects = async function(data) {
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    const floatingDimensions = await getDimensionsFn(data.floating);
    return {
      reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
      floating: {
        x: 0,
        y: 0,
        width: floatingDimensions.width,
        height: floatingDimensions.height
      }
    };
  };
  function isRTL(element) {
    return getComputedStyle2(element).direction === "rtl";
  }
  var platform = {
    convertOffsetParentRelativeRectToViewportRelativeRect,
    getDocumentElement,
    getClippingRect,
    getOffsetParent,
    getElementRects,
    getClientRects,
    getDimensions,
    getScale,
    isElement,
    isRTL
  };
  function rectsAreEqual(a, b) {
    return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
  }
  function observeMove(element, onMove) {
    let io = null;
    let timeoutId;
    const root = getDocumentElement(element);
    function cleanup() {
      var _io;
      clearTimeout(timeoutId);
      (_io = io) == null || _io.disconnect();
      io = null;
    }
    function refresh(skip, threshold) {
      if (skip === void 0) {
        skip = false;
      }
      if (threshold === void 0) {
        threshold = 1;
      }
      cleanup();
      const elementRectForRootMargin = element.getBoundingClientRect();
      const {
        left,
        top,
        width,
        height
      } = elementRectForRootMargin;
      if (!skip) {
        onMove();
      }
      if (!width || !height) {
        return;
      }
      const insetTop = floor(top);
      const insetRight = floor(root.clientWidth - (left + width));
      const insetBottom = floor(root.clientHeight - (top + height));
      const insetLeft = floor(left);
      const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
      const options = {
        rootMargin,
        threshold: max(0, min(1, threshold)) || 1
      };
      let isFirstUpdate = true;
      function handleObserve(entries) {
        const ratio = entries[0].intersectionRatio;
        if (ratio !== threshold) {
          if (!isFirstUpdate) {
            return refresh();
          }
          if (!ratio) {
            timeoutId = setTimeout(() => {
              refresh(false, 1e-7);
            }, 1e3);
          } else {
            refresh(false, ratio);
          }
        }
        if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
          refresh();
        }
        isFirstUpdate = false;
      }
      try {
        io = new IntersectionObserver(handleObserve, {
          ...options,
          // Handle <iframe>s
          root: root.ownerDocument
        });
      } catch (_e) {
        io = new IntersectionObserver(handleObserve, options);
      }
      io.observe(element);
    }
    refresh(true);
    return cleanup;
  }
  function autoUpdate(reference, floating, update, options) {
    if (options === void 0) {
      options = {};
    }
    const {
      ancestorScroll = true,
      ancestorResize = true,
      elementResize = typeof ResizeObserver === "function",
      layoutShift = typeof IntersectionObserver === "function",
      animationFrame = false
    } = options;
    const referenceEl = unwrapElement(reference);
    const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.addEventListener("scroll", update, {
        passive: true
      });
      ancestorResize && ancestor.addEventListener("resize", update);
    });
    const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
    let reobserveFrame = -1;
    let resizeObserver = null;
    if (elementResize) {
      resizeObserver = new ResizeObserver((_ref) => {
        let [firstEntry] = _ref;
        if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
          resizeObserver.unobserve(floating);
          cancelAnimationFrame(reobserveFrame);
          reobserveFrame = requestAnimationFrame(() => {
            var _resizeObserver;
            (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
          });
        }
        update();
      });
      if (referenceEl && !animationFrame) {
        resizeObserver.observe(referenceEl);
      }
      resizeObserver.observe(floating);
    }
    let frameId;
    let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
    if (animationFrame) {
      frameLoop();
    }
    function frameLoop() {
      const nextRefRect = getBoundingClientRect(reference);
      if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
        update();
      }
      prevRefRect = nextRefRect;
      frameId = requestAnimationFrame(frameLoop);
    }
    update();
    return () => {
      var _resizeObserver2;
      ancestors.forEach((ancestor) => {
        ancestorScroll && ancestor.removeEventListener("scroll", update);
        ancestorResize && ancestor.removeEventListener("resize", update);
      });
      cleanupIo == null || cleanupIo();
      (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
      resizeObserver = null;
      if (animationFrame) {
        cancelAnimationFrame(frameId);
      }
    };
  }
  var offset2 = offset;
  var shift2 = shift;
  var flip2 = flip;
  var size2 = size;
  var hide2 = hide;
  var arrow2 = arrow;
  var limitShift2 = limitShift;
  var computePosition2 = (reference, floating, options) => {
    const cache = /* @__PURE__ */ new Map();
    const mergedOptions = {
      platform,
      ...options
    };
    const platformWithCache = {
      ...mergedOptions.platform,
      _c: cache
    };
    return computePosition(reference, floating, {
      ...mergedOptions,
      platform: platformWithCache
    });
  };

  // node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs
  var React13 = __toESM(require_react(), 1);
  var import_react2 = __toESM(require_react(), 1);
  var ReactDOM2 = __toESM(require_react_dom(), 1);
  var isClient = typeof document !== "undefined";
  var noop2 = function noop3() {
  };
  var index = isClient ? import_react2.useLayoutEffect : noop2;
  function deepEqual(a, b) {
    if (a === b) {
      return true;
    }
    if (typeof a !== typeof b) {
      return false;
    }
    if (typeof a === "function" && a.toString() === b.toString()) {
      return true;
    }
    let length;
    let i;
    let keys;
    if (a && b && typeof a === "object") {
      if (Array.isArray(a)) {
        length = a.length;
        if (length !== b.length) return false;
        for (i = length; i-- !== 0; ) {
          if (!deepEqual(a[i], b[i])) {
            return false;
          }
        }
        return true;
      }
      keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length) {
        return false;
      }
      for (i = length; i-- !== 0; ) {
        if (!{}.hasOwnProperty.call(b, keys[i])) {
          return false;
        }
      }
      for (i = length; i-- !== 0; ) {
        const key = keys[i];
        if (key === "_owner" && a.$$typeof) {
          continue;
        }
        if (!deepEqual(a[key], b[key])) {
          return false;
        }
      }
      return true;
    }
    return a !== a && b !== b;
  }
  function getDPR(element) {
    if (typeof window === "undefined") {
      return 1;
    }
    const win = element.ownerDocument.defaultView || window;
    return win.devicePixelRatio || 1;
  }
  function roundByDPR(element, value) {
    const dpr = getDPR(element);
    return Math.round(value * dpr) / dpr;
  }
  function useLatestRef(value) {
    const ref = React13.useRef(value);
    index(() => {
      ref.current = value;
    });
    return ref;
  }
  function useFloating(options) {
    if (options === void 0) {
      options = {};
    }
    const {
      placement = "bottom",
      strategy = "absolute",
      middleware = [],
      platform: platform2,
      elements: {
        reference: externalReference,
        floating: externalFloating
      } = {},
      transform = true,
      whileElementsMounted,
      open
    } = options;
    const [data, setData] = React13.useState({
      x: 0,
      y: 0,
      strategy,
      placement,
      middlewareData: {},
      isPositioned: false
    });
    const [latestMiddleware, setLatestMiddleware] = React13.useState(middleware);
    if (!deepEqual(latestMiddleware, middleware)) {
      setLatestMiddleware(middleware);
    }
    const [_reference, _setReference] = React13.useState(null);
    const [_floating, _setFloating] = React13.useState(null);
    const setReference = React13.useCallback((node) => {
      if (node !== referenceRef.current) {
        referenceRef.current = node;
        _setReference(node);
      }
    }, []);
    const setFloating = React13.useCallback((node) => {
      if (node !== floatingRef.current) {
        floatingRef.current = node;
        _setFloating(node);
      }
    }, []);
    const referenceEl = externalReference || _reference;
    const floatingEl = externalFloating || _floating;
    const referenceRef = React13.useRef(null);
    const floatingRef = React13.useRef(null);
    const dataRef = React13.useRef(data);
    const hasWhileElementsMounted = whileElementsMounted != null;
    const whileElementsMountedRef = useLatestRef(whileElementsMounted);
    const platformRef = useLatestRef(platform2);
    const openRef = useLatestRef(open);
    const update = React13.useCallback(() => {
      if (!referenceRef.current || !floatingRef.current) {
        return;
      }
      const config = {
        placement,
        strategy,
        middleware: latestMiddleware
      };
      if (platformRef.current) {
        config.platform = platformRef.current;
      }
      computePosition2(referenceRef.current, floatingRef.current, config).then((data2) => {
        const fullData = {
          ...data2,
          // The floating element's position may be recomputed while it's closed
          // but still mounted (such as when transitioning out). To ensure
          // `isPositioned` will be `false` initially on the next open, avoid
          // setting it to `true` when `open === false` (must be specified).
          isPositioned: openRef.current !== false
        };
        if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
          dataRef.current = fullData;
          ReactDOM2.flushSync(() => {
            setData(fullData);
          });
        }
      });
    }, [latestMiddleware, placement, strategy, platformRef, openRef]);
    index(() => {
      if (open === false && dataRef.current.isPositioned) {
        dataRef.current.isPositioned = false;
        setData((data2) => ({
          ...data2,
          isPositioned: false
        }));
      }
    }, [open]);
    const isMountedRef = React13.useRef(false);
    index(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);
    index(() => {
      if (referenceEl) referenceRef.current = referenceEl;
      if (floatingEl) floatingRef.current = floatingEl;
      if (referenceEl && floatingEl) {
        if (whileElementsMountedRef.current) {
          return whileElementsMountedRef.current(referenceEl, floatingEl, update);
        }
        update();
      }
    }, [referenceEl, floatingEl, update, whileElementsMountedRef, hasWhileElementsMounted]);
    const refs = React13.useMemo(() => ({
      reference: referenceRef,
      floating: floatingRef,
      setReference,
      setFloating
    }), [setReference, setFloating]);
    const elements = React13.useMemo(() => ({
      reference: referenceEl,
      floating: floatingEl
    }), [referenceEl, floatingEl]);
    const floatingStyles = React13.useMemo(() => {
      const initialStyles = {
        position: strategy,
        left: 0,
        top: 0
      };
      if (!elements.floating) {
        return initialStyles;
      }
      const x = roundByDPR(elements.floating, data.x);
      const y = roundByDPR(elements.floating, data.y);
      if (transform) {
        return {
          ...initialStyles,
          transform: "translate(" + x + "px, " + y + "px)",
          ...getDPR(elements.floating) >= 1.5 && {
            willChange: "transform"
          }
        };
      }
      return {
        position: strategy,
        left: x,
        top: y
      };
    }, [strategy, transform, elements.floating, data.x, data.y]);
    return React13.useMemo(() => ({
      ...data,
      update,
      refs,
      elements,
      floatingStyles
    }), [data, update, refs, elements, floatingStyles]);
  }
  var arrow$1 = (options) => {
    function isRef(value) {
      return {}.hasOwnProperty.call(value, "current");
    }
    return {
      name: "arrow",
      options,
      fn(state) {
        const {
          element,
          padding
        } = typeof options === "function" ? options(state) : options;
        if (element && isRef(element)) {
          if (element.current != null) {
            return arrow2({
              element: element.current,
              padding
            }).fn(state);
          }
          return {};
        }
        if (element) {
          return arrow2({
            element,
            padding
          }).fn(state);
        }
        return {};
      }
    };
  };
  var offset3 = (options, deps) => ({
    ...offset2(options),
    options: [options, deps]
  });
  var shift3 = (options, deps) => ({
    ...shift2(options),
    options: [options, deps]
  });
  var limitShift3 = (options, deps) => ({
    ...limitShift2(options),
    options: [options, deps]
  });
  var flip3 = (options, deps) => ({
    ...flip2(options),
    options: [options, deps]
  });
  var size3 = (options, deps) => ({
    ...size2(options),
    options: [options, deps]
  });
  var hide3 = (options, deps) => ({
    ...hide2(options),
    options: [options, deps]
  });
  var arrow3 = (options, deps) => ({
    ...arrow$1(options),
    options: [options, deps]
  });

  // node_modules/@radix-ui/react-arrow/dist/index.mjs
  var React14 = __toESM(require_react(), 1);
  var import_jsx_runtime7 = __toESM(require_jsx_runtime(), 1);
  var NAME = "Arrow";
  var Arrow = React14.forwardRef((props, forwardedRef) => {
    const { children, width = 10, height = 5, ...arrowProps } = props;
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      Primitive.svg,
      {
        ...arrowProps,
        ref: forwardedRef,
        width,
        height,
        viewBox: "0 0 30 10",
        preserveAspectRatio: "none",
        children: props.asChild ? children : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("polygon", { points: "0,0 30,0 15,10" })
      }
    );
  });
  Arrow.displayName = NAME;
  var Root = Arrow;

  // node_modules/@radix-ui/react-use-size/dist/index.mjs
  var React15 = __toESM(require_react(), 1);
  function useSize(element) {
    const [size4, setSize] = React15.useState(void 0);
    useLayoutEffect2(() => {
      if (element) {
        setSize({ width: element.offsetWidth, height: element.offsetHeight });
        const resizeObserver = new ResizeObserver((entries) => {
          if (!Array.isArray(entries)) {
            return;
          }
          if (!entries.length) {
            return;
          }
          const entry = entries[0];
          let width;
          let height;
          if ("borderBoxSize" in entry) {
            const borderSizeEntry = entry["borderBoxSize"];
            const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
            width = borderSize["inlineSize"];
            height = borderSize["blockSize"];
          } else {
            width = element.offsetWidth;
            height = element.offsetHeight;
          }
          setSize({ width, height });
        });
        resizeObserver.observe(element, { box: "border-box" });
        return () => resizeObserver.unobserve(element);
      } else {
        setSize(void 0);
      }
    }, [element]);
    return size4;
  }

  // node_modules/@radix-ui/react-popper/dist/index.mjs
  var import_jsx_runtime8 = __toESM(require_jsx_runtime(), 1);
  var POPPER_NAME = "Popper";
  var [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME);
  var [PopperProvider, usePopperContext] = createPopperContext(POPPER_NAME);
  var Popper = (props) => {
    const { __scopePopper, children } = props;
    const [anchor, setAnchor] = React16.useState(null);
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(PopperProvider, { scope: __scopePopper, anchor, onAnchorChange: setAnchor, children });
  };
  Popper.displayName = POPPER_NAME;
  var ANCHOR_NAME = "PopperAnchor";
  var PopperAnchor = React16.forwardRef(
    (props, forwardedRef) => {
      const { __scopePopper, virtualRef, ...anchorProps } = props;
      const context = usePopperContext(ANCHOR_NAME, __scopePopper);
      const ref = React16.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      const anchorRef = React16.useRef(null);
      React16.useEffect(() => {
        const previousAnchor = anchorRef.current;
        anchorRef.current = virtualRef?.current || ref.current;
        if (previousAnchor !== anchorRef.current) {
          context.onAnchorChange(anchorRef.current);
        }
      });
      return virtualRef ? null : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Primitive.div, { ...anchorProps, ref: composedRefs });
    }
  );
  PopperAnchor.displayName = ANCHOR_NAME;
  var CONTENT_NAME = "PopperContent";
  var [PopperContentProvider, useContentContext] = createPopperContext(CONTENT_NAME);
  var PopperContent = React16.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopePopper,
        side = "bottom",
        sideOffset = 0,
        align = "center",
        alignOffset = 0,
        arrowPadding = 0,
        avoidCollisions = true,
        collisionBoundary = [],
        collisionPadding: collisionPaddingProp = 0,
        sticky = "partial",
        hideWhenDetached = false,
        updatePositionStrategy = "optimized",
        onPlaced,
        ...contentProps
      } = props;
      const context = usePopperContext(CONTENT_NAME, __scopePopper);
      const [content, setContent] = React16.useState(null);
      const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
      const [arrow4, setArrow] = React16.useState(null);
      const arrowSize = useSize(arrow4);
      const arrowWidth = arrowSize?.width ?? 0;
      const arrowHeight = arrowSize?.height ?? 0;
      const desiredPlacement = side + (align !== "center" ? "-" + align : "");
      const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp };
      const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
      const hasExplicitBoundaries = boundary.length > 0;
      const detectOverflowOptions = {
        padding: collisionPadding,
        boundary: boundary.filter(isNotNull),
        // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
        altBoundary: hasExplicitBoundaries
      };
      const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
        // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
        strategy: "fixed",
        placement: desiredPlacement,
        whileElementsMounted: (...args) => {
          const cleanup = autoUpdate(...args, {
            animationFrame: updatePositionStrategy === "always"
          });
          return cleanup;
        },
        elements: {
          reference: context.anchor
        },
        middleware: [
          offset3({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
          avoidCollisions && shift3({
            mainAxis: true,
            crossAxis: false,
            limiter: sticky === "partial" ? limitShift3() : void 0,
            ...detectOverflowOptions
          }),
          avoidCollisions && flip3({ ...detectOverflowOptions }),
          size3({
            ...detectOverflowOptions,
            apply: ({ elements, rects, availableWidth, availableHeight }) => {
              const { width: anchorWidth, height: anchorHeight } = rects.reference;
              const contentStyle = elements.floating.style;
              contentStyle.setProperty("--radix-popper-available-width", `${availableWidth}px`);
              contentStyle.setProperty("--radix-popper-available-height", `${availableHeight}px`);
              contentStyle.setProperty("--radix-popper-anchor-width", `${anchorWidth}px`);
              contentStyle.setProperty("--radix-popper-anchor-height", `${anchorHeight}px`);
            }
          }),
          arrow4 && arrow3({ element: arrow4, padding: arrowPadding }),
          transformOrigin({ arrowWidth, arrowHeight }),
          hideWhenDetached && hide3({ strategy: "referenceHidden", ...detectOverflowOptions })
        ]
      });
      const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
      const handlePlaced = useCallbackRef(onPlaced);
      useLayoutEffect2(() => {
        if (isPositioned) {
          handlePlaced?.();
        }
      }, [isPositioned, handlePlaced]);
      const arrowX = middlewareData.arrow?.x;
      const arrowY = middlewareData.arrow?.y;
      const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
      const [contentZIndex, setContentZIndex] = React16.useState();
      useLayoutEffect2(() => {
        if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
      }, [content]);
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "div",
        {
          ref: refs.setFloating,
          "data-radix-popper-content-wrapper": "",
          style: {
            ...floatingStyles,
            transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)",
            // keep off the page when measuring
            minWidth: "max-content",
            zIndex: contentZIndex,
            ["--radix-popper-transform-origin"]: [
              middlewareData.transformOrigin?.x,
              middlewareData.transformOrigin?.y
            ].join(" "),
            // hide the content if using the hide middleware and should be hidden
            // set visibility to hidden and disable pointer events so the UI behaves
            // as if the PopperContent isn't there at all
            ...middlewareData.hide?.referenceHidden && {
              visibility: "hidden",
              pointerEvents: "none"
            }
          },
          dir: props.dir,
          children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            PopperContentProvider,
            {
              scope: __scopePopper,
              placedSide,
              onArrowChange: setArrow,
              arrowX,
              arrowY,
              shouldHideArrow: cannotCenterArrow,
              children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                Primitive.div,
                {
                  "data-side": placedSide,
                  "data-align": placedAlign,
                  ...contentProps,
                  ref: composedRefs,
                  style: {
                    ...contentProps.style,
                    // if the PopperContent hasn't been placed yet (not all measurements done)
                    // we prevent animations so that users's animation don't kick in too early referring wrong sides
                    animation: !isPositioned ? "none" : void 0
                  }
                }
              )
            }
          )
        }
      );
    }
  );
  PopperContent.displayName = CONTENT_NAME;
  var ARROW_NAME = "PopperArrow";
  var OPPOSITE_SIDE = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right"
  };
  var PopperArrow = React16.forwardRef(function PopperArrow2(props, forwardedRef) {
    const { __scopePopper, ...arrowProps } = props;
    const contentContext = useContentContext(ARROW_NAME, __scopePopper);
    const baseSide = OPPOSITE_SIDE[contentContext.placedSide];
    return (
      // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
      // doesn't report size as we'd expect on SVG elements.
      // it reports their bounding box which is effectively the largest path inside the SVG.
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "span",
        {
          ref: contentContext.onArrowChange,
          style: {
            position: "absolute",
            left: contentContext.arrowX,
            top: contentContext.arrowY,
            [baseSide]: 0,
            transformOrigin: {
              top: "",
              right: "0 0",
              bottom: "center 0",
              left: "100% 0"
            }[contentContext.placedSide],
            transform: {
              top: "translateY(100%)",
              right: "translateY(50%) rotate(90deg) translateX(-50%)",
              bottom: `rotate(180deg)`,
              left: "translateY(50%) rotate(-90deg) translateX(50%)"
            }[contentContext.placedSide],
            visibility: contentContext.shouldHideArrow ? "hidden" : void 0
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            Root,
            {
              ...arrowProps,
              ref: forwardedRef,
              style: {
                ...arrowProps.style,
                // ensures the element can be measured correctly (mostly for if SVG)
                display: "block"
              }
            }
          )
        }
      )
    );
  });
  PopperArrow.displayName = ARROW_NAME;
  function isNotNull(value) {
    return value !== null;
  }
  var transformOrigin = (options) => ({
    name: "transformOrigin",
    options,
    fn(data) {
      const { placement, rects, middlewareData } = data;
      const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
      const isArrowHidden = cannotCenterArrow;
      const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
      const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
      const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
      const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign];
      const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
      const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
      let x = "";
      let y = "";
      if (placedSide === "bottom") {
        x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${-arrowHeight}px`;
      } else if (placedSide === "top") {
        x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${rects.floating.height + arrowHeight}px`;
      } else if (placedSide === "right") {
        x = `${-arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      } else if (placedSide === "left") {
        x = `${rects.floating.width + arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      }
      return { data: { x, y } };
    }
  });
  function getSideAndAlignFromPlacement(placement) {
    const [side, align = "center"] = placement.split("-");
    return [side, align];
  }
  var Root2 = Popper;
  var Anchor = PopperAnchor;
  var Content = PopperContent;
  var Arrow2 = PopperArrow;

  // node_modules/@radix-ui/react-portal/dist/index.mjs
  var React17 = __toESM(require_react(), 1);
  var import_react_dom2 = __toESM(require_react_dom(), 1);
  var import_jsx_runtime9 = __toESM(require_jsx_runtime(), 1);
  var PORTAL_NAME = "Portal";
  var Portal = React17.forwardRef((props, forwardedRef) => {
    const { container: containerProp, ...portalProps } = props;
    const [mounted, setMounted] = React17.useState(false);
    useLayoutEffect2(() => setMounted(true), []);
    const container = containerProp || mounted && globalThis?.document?.body;
    return container ? import_react_dom2.default.createPortal(/* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Primitive.div, { ...portalProps, ref: forwardedRef }), container) : null;
  });
  Portal.displayName = PORTAL_NAME;

  // node_modules/@radix-ui/react-presence/dist/index.mjs
  var React22 = __toESM(require_react(), 1);
  var React18 = __toESM(require_react(), 1);
  function useStateMachine(initialState, machine) {
    return React18.useReducer((state, event) => {
      const nextState = machine[state][event];
      return nextState ?? state;
    }, initialState);
  }
  var Presence = (props) => {
    const { present, children } = props;
    const presence = usePresence(present);
    const child = typeof children === "function" ? children({ present: presence.isPresent }) : React22.Children.only(children);
    const ref = useComposedRefs(presence.ref, getElementRef3(child));
    const forceMount = typeof children === "function";
    return forceMount || presence.isPresent ? React22.cloneElement(child, { ref }) : null;
  };
  Presence.displayName = "Presence";
  function usePresence(present) {
    const [node, setNode] = React22.useState();
    const stylesRef = React22.useRef(null);
    const prevPresentRef = React22.useRef(present);
    const prevAnimationNameRef = React22.useRef("none");
    const initialState = present ? "mounted" : "unmounted";
    const [state, send] = useStateMachine(initialState, {
      mounted: {
        UNMOUNT: "unmounted",
        ANIMATION_OUT: "unmountSuspended"
      },
      unmountSuspended: {
        MOUNT: "mounted",
        ANIMATION_END: "unmounted"
      },
      unmounted: {
        MOUNT: "mounted"
      }
    });
    React22.useEffect(() => {
      const currentAnimationName = getAnimationName(stylesRef.current);
      prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
    }, [state]);
    useLayoutEffect2(() => {
      const styles = stylesRef.current;
      const wasPresent = prevPresentRef.current;
      const hasPresentChanged = wasPresent !== present;
      if (hasPresentChanged) {
        const prevAnimationName = prevAnimationNameRef.current;
        const currentAnimationName = getAnimationName(styles);
        if (present) {
          send("MOUNT");
        } else if (currentAnimationName === "none" || styles?.display === "none") {
          send("UNMOUNT");
        } else {
          const isAnimating = prevAnimationName !== currentAnimationName;
          if (wasPresent && isAnimating) {
            send("ANIMATION_OUT");
          } else {
            send("UNMOUNT");
          }
        }
        prevPresentRef.current = present;
      }
    }, [present, send]);
    useLayoutEffect2(() => {
      if (node) {
        let timeoutId;
        const ownerWindow = node.ownerDocument.defaultView ?? window;
        const handleAnimationEnd = (event) => {
          const currentAnimationName = getAnimationName(stylesRef.current);
          const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));
          if (event.target === node && isCurrentAnimation) {
            send("ANIMATION_END");
            if (!prevPresentRef.current) {
              const currentFillMode = node.style.animationFillMode;
              node.style.animationFillMode = "forwards";
              timeoutId = ownerWindow.setTimeout(() => {
                if (node.style.animationFillMode === "forwards") {
                  node.style.animationFillMode = currentFillMode;
                }
              });
            }
          }
        };
        const handleAnimationStart = (event) => {
          if (event.target === node) {
            prevAnimationNameRef.current = getAnimationName(stylesRef.current);
          }
        };
        node.addEventListener("animationstart", handleAnimationStart);
        node.addEventListener("animationcancel", handleAnimationEnd);
        node.addEventListener("animationend", handleAnimationEnd);
        return () => {
          ownerWindow.clearTimeout(timeoutId);
          node.removeEventListener("animationstart", handleAnimationStart);
          node.removeEventListener("animationcancel", handleAnimationEnd);
          node.removeEventListener("animationend", handleAnimationEnd);
        };
      } else {
        send("ANIMATION_END");
      }
    }, [node, send]);
    return {
      isPresent: ["mounted", "unmountSuspended"].includes(state),
      ref: React22.useCallback((node2) => {
        stylesRef.current = node2 ? getComputedStyle(node2) : null;
        setNode(node2);
      }, [])
    };
  }
  function getAnimationName(styles) {
    return styles?.animationName || "none";
  }
  function getElementRef3(element) {
    let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
    let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.ref;
    }
    getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
    mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.props.ref;
    }
    return element.props.ref || element.ref;
  }

  // node_modules/@radix-ui/react-tooltip/node_modules/@radix-ui/react-slot/dist/index.mjs
  var React19 = __toESM(require_react(), 1);
  var import_jsx_runtime10 = __toESM(require_jsx_runtime(), 1);
  var SLOTTABLE_IDENTIFIER3 = /* @__PURE__ */ Symbol("radix.slottable");
  // @__NO_SIDE_EFFECTS__
  function createSlottable(ownerName) {
    const Slottable2 = ({ children }) => {
      return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_jsx_runtime10.Fragment, { children });
    };
    Slottable2.displayName = `${ownerName}.Slottable`;
    Slottable2.__radixId = SLOTTABLE_IDENTIFIER3;
    return Slottable2;
  }

  // node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
  var React20 = __toESM(require_react(), 1);
  var React23 = __toESM(require_react(), 1);
  var useInsertionEffect = React20[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
  function useControllableState({
    prop,
    defaultProp,
    onChange = () => {
    },
    caller
  }) {
    const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
      defaultProp,
      onChange
    });
    const isControlled = prop !== void 0;
    const value = isControlled ? prop : uncontrolledProp;
    if (true) {
      const isControlledRef = React20.useRef(prop !== void 0);
      React20.useEffect(() => {
        const wasControlled = isControlledRef.current;
        if (wasControlled !== isControlled) {
          const from = wasControlled ? "controlled" : "uncontrolled";
          const to = isControlled ? "controlled" : "uncontrolled";
          console.warn(
            `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
          );
        }
        isControlledRef.current = isControlled;
      }, [isControlled, caller]);
    }
    const setValue = React20.useCallback(
      (nextValue) => {
        if (isControlled) {
          const value2 = isFunction3(nextValue) ? nextValue(prop) : nextValue;
          if (value2 !== prop) {
            onChangeRef.current?.(value2);
          }
        } else {
          setUncontrolledProp(nextValue);
        }
      },
      [isControlled, prop, setUncontrolledProp, onChangeRef]
    );
    return [value, setValue];
  }
  function useUncontrolledState({
    defaultProp,
    onChange
  }) {
    const [value, setValue] = React20.useState(defaultProp);
    const prevValueRef = React20.useRef(value);
    const onChangeRef = React20.useRef(onChange);
    useInsertionEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);
    React20.useEffect(() => {
      if (prevValueRef.current !== value) {
        onChangeRef.current?.(value);
        prevValueRef.current = value;
      }
    }, [value, prevValueRef]);
    return [value, setValue, onChangeRef];
  }
  function isFunction3(value) {
    return typeof value === "function";
  }

  // node_modules/@radix-ui/react-visually-hidden/dist/index.mjs
  var React21 = __toESM(require_react(), 1);
  var import_jsx_runtime11 = __toESM(require_jsx_runtime(), 1);
  var VISUALLY_HIDDEN_STYLES = Object.freeze({
    // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
    position: "absolute",
    border: 0,
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    wordWrap: "normal"
  });
  var NAME2 = "VisuallyHidden";
  var VisuallyHidden = React21.forwardRef(
    (props, forwardedRef) => {
      return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        Primitive.span,
        {
          ...props,
          ref: forwardedRef,
          style: { ...VISUALLY_HIDDEN_STYLES, ...props.style }
        }
      );
    }
  );
  VisuallyHidden.displayName = NAME2;
  var Root3 = VisuallyHidden;

  // node_modules/@radix-ui/react-tooltip/dist/index.mjs
  var import_jsx_runtime12 = __toESM(require_jsx_runtime(), 1);
  var [createTooltipContext, createTooltipScope] = createContextScope("Tooltip", [
    createPopperScope
  ]);
  var usePopperScope = createPopperScope();
  var PROVIDER_NAME = "TooltipProvider";
  var DEFAULT_DELAY_DURATION = 700;
  var TOOLTIP_OPEN = "tooltip.open";
  var [TooltipProviderContextProvider, useTooltipProviderContext] = createTooltipContext(PROVIDER_NAME);
  var TooltipProvider = (props) => {
    const {
      __scopeTooltip,
      delayDuration = DEFAULT_DELAY_DURATION,
      skipDelayDuration = 300,
      disableHoverableContent = false,
      children
    } = props;
    const isOpenDelayedRef = React24.useRef(true);
    const isPointerInTransitRef = React24.useRef(false);
    const skipDelayTimerRef = React24.useRef(0);
    React24.useEffect(() => {
      const skipDelayTimer = skipDelayTimerRef.current;
      return () => window.clearTimeout(skipDelayTimer);
    }, []);
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      TooltipProviderContextProvider,
      {
        scope: __scopeTooltip,
        isOpenDelayedRef,
        delayDuration,
        onOpen: React24.useCallback(() => {
          window.clearTimeout(skipDelayTimerRef.current);
          isOpenDelayedRef.current = false;
        }, []),
        onClose: React24.useCallback(() => {
          window.clearTimeout(skipDelayTimerRef.current);
          skipDelayTimerRef.current = window.setTimeout(
            () => isOpenDelayedRef.current = true,
            skipDelayDuration
          );
        }, [skipDelayDuration]),
        isPointerInTransitRef,
        onPointerInTransitChange: React24.useCallback((inTransit) => {
          isPointerInTransitRef.current = inTransit;
        }, []),
        disableHoverableContent,
        children
      }
    );
  };
  TooltipProvider.displayName = PROVIDER_NAME;
  var TOOLTIP_NAME = "Tooltip";
  var [TooltipContextProvider, useTooltipContext] = createTooltipContext(TOOLTIP_NAME);
  var Tooltip = (props) => {
    const {
      __scopeTooltip,
      children,
      open: openProp,
      defaultOpen,
      onOpenChange,
      disableHoverableContent: disableHoverableContentProp,
      delayDuration: delayDurationProp
    } = props;
    const providerContext = useTooltipProviderContext(TOOLTIP_NAME, props.__scopeTooltip);
    const popperScope = usePopperScope(__scopeTooltip);
    const [trigger, setTrigger] = React24.useState(null);
    const contentId = useId();
    const openTimerRef = React24.useRef(0);
    const disableHoverableContent = disableHoverableContentProp ?? providerContext.disableHoverableContent;
    const delayDuration = delayDurationProp ?? providerContext.delayDuration;
    const wasOpenDelayedRef = React24.useRef(false);
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? false,
      onChange: (open2) => {
        if (open2) {
          providerContext.onOpen();
          document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
        } else {
          providerContext.onClose();
        }
        onOpenChange?.(open2);
      },
      caller: TOOLTIP_NAME
    });
    const stateAttribute = React24.useMemo(() => {
      return open ? wasOpenDelayedRef.current ? "delayed-open" : "instant-open" : "closed";
    }, [open]);
    const handleOpen = React24.useCallback(() => {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = 0;
      wasOpenDelayedRef.current = false;
      setOpen(true);
    }, [setOpen]);
    const handleClose = React24.useCallback(() => {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = 0;
      setOpen(false);
    }, [setOpen]);
    const handleDelayedOpen = React24.useCallback(() => {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = window.setTimeout(() => {
        wasOpenDelayedRef.current = true;
        setOpen(true);
        openTimerRef.current = 0;
      }, delayDuration);
    }, [delayDuration, setOpen]);
    React24.useEffect(() => {
      return () => {
        if (openTimerRef.current) {
          window.clearTimeout(openTimerRef.current);
          openTimerRef.current = 0;
        }
      };
    }, []);
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Root2, { ...popperScope, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      TooltipContextProvider,
      {
        scope: __scopeTooltip,
        contentId,
        open,
        stateAttribute,
        trigger,
        onTriggerChange: setTrigger,
        onTriggerEnter: React24.useCallback(() => {
          if (providerContext.isOpenDelayedRef.current) handleDelayedOpen();
          else handleOpen();
        }, [providerContext.isOpenDelayedRef, handleDelayedOpen, handleOpen]),
        onTriggerLeave: React24.useCallback(() => {
          if (disableHoverableContent) {
            handleClose();
          } else {
            window.clearTimeout(openTimerRef.current);
            openTimerRef.current = 0;
          }
        }, [handleClose, disableHoverableContent]),
        onOpen: handleOpen,
        onClose: handleClose,
        disableHoverableContent,
        children
      }
    ) });
  };
  Tooltip.displayName = TOOLTIP_NAME;
  var TRIGGER_NAME = "TooltipTrigger";
  var TooltipTrigger = React24.forwardRef(
    (props, forwardedRef) => {
      const { __scopeTooltip, ...triggerProps } = props;
      const context = useTooltipContext(TRIGGER_NAME, __scopeTooltip);
      const providerContext = useTooltipProviderContext(TRIGGER_NAME, __scopeTooltip);
      const popperScope = usePopperScope(__scopeTooltip);
      const ref = React24.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref, context.onTriggerChange);
      const isPointerDownRef = React24.useRef(false);
      const hasPointerMoveOpenedRef = React24.useRef(false);
      const handlePointerUp = React24.useCallback(() => isPointerDownRef.current = false, []);
      React24.useEffect(() => {
        return () => document.removeEventListener("pointerup", handlePointerUp);
      }, [handlePointerUp]);
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Anchor, { asChild: true, ...popperScope, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        Primitive.button,
        {
          "aria-describedby": context.open ? context.contentId : void 0,
          "data-state": context.stateAttribute,
          ...triggerProps,
          ref: composedRefs,
          onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
            if (event.pointerType === "touch") return;
            if (!hasPointerMoveOpenedRef.current && !providerContext.isPointerInTransitRef.current) {
              context.onTriggerEnter();
              hasPointerMoveOpenedRef.current = true;
            }
          }),
          onPointerLeave: composeEventHandlers(props.onPointerLeave, () => {
            context.onTriggerLeave();
            hasPointerMoveOpenedRef.current = false;
          }),
          onPointerDown: composeEventHandlers(props.onPointerDown, () => {
            if (context.open) {
              context.onClose();
            }
            isPointerDownRef.current = true;
            document.addEventListener("pointerup", handlePointerUp, { once: true });
          }),
          onFocus: composeEventHandlers(props.onFocus, () => {
            if (!isPointerDownRef.current) context.onOpen();
          }),
          onBlur: composeEventHandlers(props.onBlur, context.onClose),
          onClick: composeEventHandlers(props.onClick, context.onClose)
        }
      ) });
    }
  );
  TooltipTrigger.displayName = TRIGGER_NAME;
  var PORTAL_NAME2 = "TooltipPortal";
  var [PortalProvider, usePortalContext] = createTooltipContext(PORTAL_NAME2, {
    forceMount: void 0
  });
  var TooltipPortal = (props) => {
    const { __scopeTooltip, forceMount, children, container } = props;
    const context = useTooltipContext(PORTAL_NAME2, __scopeTooltip);
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(PortalProvider, { scope: __scopeTooltip, forceMount, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Portal, { asChild: true, container, children }) }) });
  };
  TooltipPortal.displayName = PORTAL_NAME2;
  var CONTENT_NAME2 = "TooltipContent";
  var TooltipContent = React24.forwardRef(
    (props, forwardedRef) => {
      const portalContext = usePortalContext(CONTENT_NAME2, props.__scopeTooltip);
      const { forceMount = portalContext.forceMount, side = "top", ...contentProps } = props;
      const context = useTooltipContext(CONTENT_NAME2, props.__scopeTooltip);
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Presence, { present: forceMount || context.open, children: context.disableHoverableContent ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(TooltipContentImpl, { side, ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(TooltipContentHoverable, { side, ...contentProps, ref: forwardedRef }) });
    }
  );
  var TooltipContentHoverable = React24.forwardRef((props, forwardedRef) => {
    const context = useTooltipContext(CONTENT_NAME2, props.__scopeTooltip);
    const providerContext = useTooltipProviderContext(CONTENT_NAME2, props.__scopeTooltip);
    const ref = React24.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const [pointerGraceArea, setPointerGraceArea] = React24.useState(null);
    const { trigger, onClose } = context;
    const content = ref.current;
    const { onPointerInTransitChange } = providerContext;
    const handleRemoveGraceArea = React24.useCallback(() => {
      setPointerGraceArea(null);
      onPointerInTransitChange(false);
    }, [onPointerInTransitChange]);
    const handleCreateGraceArea = React24.useCallback(
      (event, hoverTarget) => {
        const currentTarget = event.currentTarget;
        const exitPoint = { x: event.clientX, y: event.clientY };
        const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
        const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide);
        const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
        const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
        setPointerGraceArea(graceArea);
        onPointerInTransitChange(true);
      },
      [onPointerInTransitChange]
    );
    React24.useEffect(() => {
      return () => handleRemoveGraceArea();
    }, [handleRemoveGraceArea]);
    React24.useEffect(() => {
      if (trigger && content) {
        const handleTriggerLeave = (event) => handleCreateGraceArea(event, content);
        const handleContentLeave = (event) => handleCreateGraceArea(event, trigger);
        trigger.addEventListener("pointerleave", handleTriggerLeave);
        content.addEventListener("pointerleave", handleContentLeave);
        return () => {
          trigger.removeEventListener("pointerleave", handleTriggerLeave);
          content.removeEventListener("pointerleave", handleContentLeave);
        };
      }
    }, [trigger, content, handleCreateGraceArea, handleRemoveGraceArea]);
    React24.useEffect(() => {
      if (pointerGraceArea) {
        const handleTrackPointerGrace = (event) => {
          const target = event.target;
          const pointerPosition = { x: event.clientX, y: event.clientY };
          const hasEnteredTarget = trigger?.contains(target) || content?.contains(target);
          const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea);
          if (hasEnteredTarget) {
            handleRemoveGraceArea();
          } else if (isPointerOutsideGraceArea) {
            handleRemoveGraceArea();
            onClose();
          }
        };
        document.addEventListener("pointermove", handleTrackPointerGrace);
        return () => document.removeEventListener("pointermove", handleTrackPointerGrace);
      }
    }, [trigger, content, pointerGraceArea, onClose, handleRemoveGraceArea]);
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(TooltipContentImpl, { ...props, ref: composedRefs });
  });
  var [VisuallyHiddenContentContextProvider, useVisuallyHiddenContentContext] = createTooltipContext(TOOLTIP_NAME, { isInside: false });
  var Slottable = createSlottable("TooltipContent");
  var TooltipContentImpl = React24.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeTooltip,
        children,
        "aria-label": ariaLabel,
        onEscapeKeyDown,
        onPointerDownOutside,
        ...contentProps
      } = props;
      const context = useTooltipContext(CONTENT_NAME2, __scopeTooltip);
      const popperScope = usePopperScope(__scopeTooltip);
      const { onClose } = context;
      React24.useEffect(() => {
        document.addEventListener(TOOLTIP_OPEN, onClose);
        return () => document.removeEventListener(TOOLTIP_OPEN, onClose);
      }, [onClose]);
      React24.useEffect(() => {
        if (context.trigger) {
          const handleScroll2 = (event) => {
            const target = event.target;
            if (target?.contains(context.trigger)) onClose();
          };
          window.addEventListener("scroll", handleScroll2, { capture: true });
          return () => window.removeEventListener("scroll", handleScroll2, { capture: true });
        }
      }, [context.trigger, onClose]);
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        DismissableLayer,
        {
          asChild: true,
          disableOutsidePointerEvents: false,
          onEscapeKeyDown,
          onPointerDownOutside,
          onFocusOutside: (event) => event.preventDefault(),
          onDismiss: onClose,
          children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
            Content,
            {
              "data-state": context.stateAttribute,
              ...popperScope,
              ...contentProps,
              ref: forwardedRef,
              style: {
                ...contentProps.style,
                // re-namespace exposed content custom properties
                ...{
                  "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
                  "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
                  "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
                  "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
                  "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
                }
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Slottable, { children }),
                /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(VisuallyHiddenContentContextProvider, { scope: __scopeTooltip, isInside: true, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Root3, { id: context.contentId, role: "tooltip", children: ariaLabel || children }) })
              ]
            }
          )
        }
      );
    }
  );
  TooltipContent.displayName = CONTENT_NAME2;
  var ARROW_NAME2 = "TooltipArrow";
  var TooltipArrow = React24.forwardRef(
    (props, forwardedRef) => {
      const { __scopeTooltip, ...arrowProps } = props;
      const popperScope = usePopperScope(__scopeTooltip);
      const visuallyHiddenContentContext = useVisuallyHiddenContentContext(
        ARROW_NAME2,
        __scopeTooltip
      );
      return visuallyHiddenContentContext.isInside ? null : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Arrow2, { ...popperScope, ...arrowProps, ref: forwardedRef });
    }
  );
  TooltipArrow.displayName = ARROW_NAME2;
  function getExitSideFromRect(point, rect) {
    const top = Math.abs(rect.top - point.y);
    const bottom = Math.abs(rect.bottom - point.y);
    const right = Math.abs(rect.right - point.x);
    const left = Math.abs(rect.left - point.x);
    switch (Math.min(top, bottom, right, left)) {
      case left:
        return "left";
      case right:
        return "right";
      case top:
        return "top";
      case bottom:
        return "bottom";
      default:
        throw new Error("unreachable");
    }
  }
  function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
    const paddedExitPoints = [];
    switch (exitSide) {
      case "top":
        paddedExitPoints.push(
          { x: exitPoint.x - padding, y: exitPoint.y + padding },
          { x: exitPoint.x + padding, y: exitPoint.y + padding }
        );
        break;
      case "bottom":
        paddedExitPoints.push(
          { x: exitPoint.x - padding, y: exitPoint.y - padding },
          { x: exitPoint.x + padding, y: exitPoint.y - padding }
        );
        break;
      case "left":
        paddedExitPoints.push(
          { x: exitPoint.x + padding, y: exitPoint.y - padding },
          { x: exitPoint.x + padding, y: exitPoint.y + padding }
        );
        break;
      case "right":
        paddedExitPoints.push(
          { x: exitPoint.x - padding, y: exitPoint.y - padding },
          { x: exitPoint.x - padding, y: exitPoint.y + padding }
        );
        break;
    }
    return paddedExitPoints;
  }
  function getPointsFromRect(rect) {
    const { top, right, bottom, left } = rect;
    return [
      { x: left, y: top },
      { x: right, y: top },
      { x: right, y: bottom },
      { x: left, y: bottom }
    ];
  }
  function isPointInPolygon(point, polygon) {
    const { x, y } = point;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const ii = polygon[i];
      const jj = polygon[j];
      const xi = ii.x;
      const yi = ii.y;
      const xj = jj.x;
      const yj = jj.y;
      const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }
  function getHull(points) {
    const newPoints = points.slice();
    newPoints.sort((a, b) => {
      if (a.x < b.x) return -1;
      else if (a.x > b.x) return 1;
      else if (a.y < b.y) return -1;
      else if (a.y > b.y) return 1;
      else return 0;
    });
    return getHullPresorted(newPoints);
  }
  function getHullPresorted(points) {
    if (points.length <= 1) return points.slice();
    const upperHull = [];
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      while (upperHull.length >= 2) {
        const q = upperHull[upperHull.length - 1];
        const r2 = upperHull[upperHull.length - 2];
        if ((q.x - r2.x) * (p.y - r2.y) >= (q.y - r2.y) * (p.x - r2.x)) upperHull.pop();
        else break;
      }
      upperHull.push(p);
    }
    upperHull.pop();
    const lowerHull = [];
    for (let i = points.length - 1; i >= 0; i--) {
      const p = points[i];
      while (lowerHull.length >= 2) {
        const q = lowerHull[lowerHull.length - 1];
        const r2 = lowerHull[lowerHull.length - 2];
        if ((q.x - r2.x) * (p.y - r2.y) >= (q.y - r2.y) * (p.x - r2.x)) lowerHull.pop();
        else break;
      }
      lowerHull.push(p);
    }
    lowerHull.pop();
    if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) {
      return upperHull;
    } else {
      return upperHull.concat(lowerHull);
    }
  }
  var Provider = TooltipProvider;
  var Root32 = Tooltip;
  var Trigger = TooltipTrigger;
  var Portal2 = TooltipPortal;
  var Content2 = TooltipContent;
  var Arrow22 = TooltipArrow;

  // components/ui/tooltip.tsx
  var import_jsx_runtime13 = __toESM(require_jsx_runtime());
  function TooltipProvider2({
    delayDuration = 0,
    ...props
  }) {
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      Provider,
      {
        "data-slot": "tooltip-provider",
        delayDuration,
        ...props
      }
    );
  }
  function Tooltip2({
    ...props
  }) {
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(TooltipProvider2, { children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Root32, { "data-slot": "tooltip", ...props }) });
  }
  function TooltipTrigger2({
    ...props
  }) {
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Trigger, { "data-slot": "tooltip-trigger", ...props });
  }
  function TooltipContent2({
    className,
    sideOffset = 0,
    children,
    ...props
  }) {
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
      Content2,
      {
        "data-slot": "tooltip-content",
        sideOffset,
        className: cn(
          "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Arrow22, { className: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
        ]
      }
    ) });
  }

  // node_modules/@radix-ui/react-popover/dist/index.mjs
  var React35 = __toESM(require_react(), 1);

  // node_modules/@radix-ui/react-focus-guards/dist/index.mjs
  var React25 = __toESM(require_react(), 1);
  var count2 = 0;
  function useFocusGuards() {
    React25.useEffect(() => {
      const edgeGuards = document.querySelectorAll("[data-radix-focus-guard]");
      document.body.insertAdjacentElement("afterbegin", edgeGuards[0] ?? createFocusGuard());
      document.body.insertAdjacentElement("beforeend", edgeGuards[1] ?? createFocusGuard());
      count2++;
      return () => {
        if (count2 === 1) {
          document.querySelectorAll("[data-radix-focus-guard]").forEach((node) => node.remove());
        }
        count2--;
      };
    }, []);
  }
  function createFocusGuard() {
    const element = document.createElement("span");
    element.setAttribute("data-radix-focus-guard", "");
    element.tabIndex = 0;
    element.style.outline = "none";
    element.style.opacity = "0";
    element.style.position = "fixed";
    element.style.pointerEvents = "none";
    return element;
  }

  // node_modules/@radix-ui/react-focus-scope/dist/index.mjs
  var React26 = __toESM(require_react(), 1);
  var import_jsx_runtime14 = __toESM(require_jsx_runtime(), 1);
  var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
  var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
  var EVENT_OPTIONS = { bubbles: false, cancelable: true };
  var FOCUS_SCOPE_NAME = "FocusScope";
  var FocusScope = React26.forwardRef((props, forwardedRef) => {
    const {
      loop = false,
      trapped = false,
      onMountAutoFocus: onMountAutoFocusProp,
      onUnmountAutoFocus: onUnmountAutoFocusProp,
      ...scopeProps
    } = props;
    const [container, setContainer] = React26.useState(null);
    const onMountAutoFocus = useCallbackRef(onMountAutoFocusProp);
    const onUnmountAutoFocus = useCallbackRef(onUnmountAutoFocusProp);
    const lastFocusedElementRef = React26.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setContainer(node));
    const focusScope = React26.useRef({
      paused: false,
      pause() {
        this.paused = true;
      },
      resume() {
        this.paused = false;
      }
    }).current;
    React26.useEffect(() => {
      if (trapped) {
        let handleFocusIn2 = function(event) {
          if (focusScope.paused || !container) return;
          const target = event.target;
          if (container.contains(target)) {
            lastFocusedElementRef.current = target;
          } else {
            focus(lastFocusedElementRef.current, { select: true });
          }
        }, handleFocusOut2 = function(event) {
          if (focusScope.paused || !container) return;
          const relatedTarget = event.relatedTarget;
          if (relatedTarget === null) return;
          if (!container.contains(relatedTarget)) {
            focus(lastFocusedElementRef.current, { select: true });
          }
        }, handleMutations2 = function(mutations) {
          const focusedElement = document.activeElement;
          if (focusedElement !== document.body) return;
          for (const mutation of mutations) {
            if (mutation.removedNodes.length > 0) focus(container);
          }
        };
        var handleFocusIn = handleFocusIn2, handleFocusOut = handleFocusOut2, handleMutations = handleMutations2;
        document.addEventListener("focusin", handleFocusIn2);
        document.addEventListener("focusout", handleFocusOut2);
        const mutationObserver = new MutationObserver(handleMutations2);
        if (container) mutationObserver.observe(container, { childList: true, subtree: true });
        return () => {
          document.removeEventListener("focusin", handleFocusIn2);
          document.removeEventListener("focusout", handleFocusOut2);
          mutationObserver.disconnect();
        };
      }
    }, [trapped, container, focusScope.paused]);
    React26.useEffect(() => {
      if (container) {
        focusScopesStack.add(focusScope);
        const previouslyFocusedElement = document.activeElement;
        const hasFocusedCandidate = container.contains(previouslyFocusedElement);
        if (!hasFocusedCandidate) {
          const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
          container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
          container.dispatchEvent(mountEvent);
          if (!mountEvent.defaultPrevented) {
            focusFirst(removeLinks(getTabbableCandidates(container)), { select: true });
            if (document.activeElement === previouslyFocusedElement) {
              focus(container);
            }
          }
        }
        return () => {
          container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
          setTimeout(() => {
            const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
            container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
            container.dispatchEvent(unmountEvent);
            if (!unmountEvent.defaultPrevented) {
              focus(previouslyFocusedElement ?? document.body, { select: true });
            }
            container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
            focusScopesStack.remove(focusScope);
          }, 0);
        };
      }
    }, [container, onMountAutoFocus, onUnmountAutoFocus, focusScope]);
    const handleKeyDown = React26.useCallback(
      (event) => {
        if (!loop && !trapped) return;
        if (focusScope.paused) return;
        const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
        const focusedElement = document.activeElement;
        if (isTabKey && focusedElement) {
          const container2 = event.currentTarget;
          const [first, last] = getTabbableEdges(container2);
          const hasTabbableElementsInside = first && last;
          if (!hasTabbableElementsInside) {
            if (focusedElement === container2) event.preventDefault();
          } else {
            if (!event.shiftKey && focusedElement === last) {
              event.preventDefault();
              if (loop) focus(first, { select: true });
            } else if (event.shiftKey && focusedElement === first) {
              event.preventDefault();
              if (loop) focus(last, { select: true });
            }
          }
        }
      },
      [loop, trapped, focusScope.paused]
    );
    return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Primitive.div, { tabIndex: -1, ...scopeProps, ref: composedRefs, onKeyDown: handleKeyDown });
  });
  FocusScope.displayName = FOCUS_SCOPE_NAME;
  function focusFirst(candidates, { select = false } = {}) {
    const previouslyFocusedElement = document.activeElement;
    for (const candidate of candidates) {
      focus(candidate, { select });
      if (document.activeElement !== previouslyFocusedElement) return;
    }
  }
  function getTabbableEdges(container) {
    const candidates = getTabbableCandidates(container);
    const first = findVisible(candidates, container);
    const last = findVisible(candidates.reverse(), container);
    return [first, last];
  }
  function getTabbableCandidates(container) {
    const nodes = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) => {
        const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
        if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
        return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }
  function findVisible(elements, container) {
    for (const element of elements) {
      if (!isHidden(element, { upTo: container })) return element;
    }
  }
  function isHidden(node, { upTo }) {
    if (getComputedStyle(node).visibility === "hidden") return true;
    while (node) {
      if (upTo !== void 0 && node === upTo) return false;
      if (getComputedStyle(node).display === "none") return true;
      node = node.parentElement;
    }
    return false;
  }
  function isSelectableInput(element) {
    return element instanceof HTMLInputElement && "select" in element;
  }
  function focus(element, { select = false } = {}) {
    if (element && element.focus) {
      const previouslyFocusedElement = document.activeElement;
      element.focus({ preventScroll: true });
      if (element !== previouslyFocusedElement && isSelectableInput(element) && select)
        element.select();
    }
  }
  var focusScopesStack = createFocusScopesStack();
  function createFocusScopesStack() {
    let stack = [];
    return {
      add(focusScope) {
        const activeFocusScope = stack[0];
        if (focusScope !== activeFocusScope) {
          activeFocusScope?.pause();
        }
        stack = arrayRemove(stack, focusScope);
        stack.unshift(focusScope);
      },
      remove(focusScope) {
        stack = arrayRemove(stack, focusScope);
        stack[0]?.resume();
      }
    };
  }
  function arrayRemove(array, item) {
    const updatedArray = [...array];
    const index2 = updatedArray.indexOf(item);
    if (index2 !== -1) {
      updatedArray.splice(index2, 1);
    }
    return updatedArray;
  }
  function removeLinks(items) {
    return items.filter((item) => item.tagName !== "A");
  }

  // node_modules/@radix-ui/react-popover/node_modules/@radix-ui/react-slot/dist/index.mjs
  var React27 = __toESM(require_react(), 1);
  var import_jsx_runtime15 = __toESM(require_jsx_runtime(), 1);
  // @__NO_SIDE_EFFECTS__
  function createSlot3(ownerName) {
    const SlotClone = /* @__PURE__ */ createSlotClone3(ownerName);
    const Slot22 = React27.forwardRef((props, forwardedRef) => {
      const { children, ...slotProps } = props;
      const childrenArray = React27.Children.toArray(children);
      const slottable = childrenArray.find(isSlottable3);
      if (slottable) {
        const newElement = slottable.props.children;
        const newChildren = childrenArray.map((child) => {
          if (child === slottable) {
            if (React27.Children.count(newElement) > 1) return React27.Children.only(null);
            return React27.isValidElement(newElement) ? newElement.props.children : null;
          } else {
            return child;
          }
        });
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children: React27.isValidElement(newElement) ? React27.cloneElement(newElement, void 0, newChildren) : null });
      }
      return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children });
    });
    Slot22.displayName = `${ownerName}.Slot`;
    return Slot22;
  }
  // @__NO_SIDE_EFFECTS__
  function createSlotClone3(ownerName) {
    const SlotClone = React27.forwardRef((props, forwardedRef) => {
      const { children, ...slotProps } = props;
      if (React27.isValidElement(children)) {
        const childrenRef = getElementRef4(children);
        const props2 = mergeProps3(slotProps, children.props);
        if (children.type !== React27.Fragment) {
          props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
        }
        return React27.cloneElement(children, props2);
      }
      return React27.Children.count(children) > 1 ? React27.Children.only(null) : null;
    });
    SlotClone.displayName = `${ownerName}.SlotClone`;
    return SlotClone;
  }
  var SLOTTABLE_IDENTIFIER4 = /* @__PURE__ */ Symbol("radix.slottable");
  function isSlottable3(child) {
    return React27.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER4;
  }
  function mergeProps3(slotProps, childProps) {
    const overrideProps = { ...childProps };
    for (const propName in childProps) {
      const slotPropValue = slotProps[propName];
      const childPropValue = childProps[propName];
      const isHandler = /^on[A-Z]/.test(propName);
      if (isHandler) {
        if (slotPropValue && childPropValue) {
          overrideProps[propName] = (...args) => {
            const result = childPropValue(...args);
            slotPropValue(...args);
            return result;
          };
        } else if (slotPropValue) {
          overrideProps[propName] = slotPropValue;
        }
      } else if (propName === "style") {
        overrideProps[propName] = { ...slotPropValue, ...childPropValue };
      } else if (propName === "className") {
        overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
      }
    }
    return { ...slotProps, ...overrideProps };
  }
  function getElementRef4(element) {
    let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
    let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.ref;
    }
    getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
    mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.props.ref;
    }
    return element.props.ref || element.ref;
  }

  // node_modules/aria-hidden/dist/es2015/index.js
  var getDefaultParent = function(originalTarget) {
    if (typeof document === "undefined") {
      return null;
    }
    var sampleTarget = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
    return sampleTarget.ownerDocument.body;
  };
  var counterMap = /* @__PURE__ */ new WeakMap();
  var uncontrolledNodes = /* @__PURE__ */ new WeakMap();
  var markerMap = {};
  var lockCount = 0;
  var unwrapHost = function(node) {
    return node && (node.host || unwrapHost(node.parentNode));
  };
  var correctTargets = function(parent, targets) {
    return targets.map(function(target) {
      if (parent.contains(target)) {
        return target;
      }
      var correctedTarget = unwrapHost(target);
      if (correctedTarget && parent.contains(correctedTarget)) {
        return correctedTarget;
      }
      console.error("aria-hidden", target, "in not contained inside", parent, ". Doing nothing");
      return null;
    }).filter(function(x) {
      return Boolean(x);
    });
  };
  var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
    var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    if (!markerMap[markerName]) {
      markerMap[markerName] = /* @__PURE__ */ new WeakMap();
    }
    var markerCounter = markerMap[markerName];
    var hiddenNodes = [];
    var elementsToKeep = /* @__PURE__ */ new Set();
    var elementsToStop = new Set(targets);
    var keep = function(el) {
      if (!el || elementsToKeep.has(el)) {
        return;
      }
      elementsToKeep.add(el);
      keep(el.parentNode);
    };
    targets.forEach(keep);
    var deep = function(parent) {
      if (!parent || elementsToStop.has(parent)) {
        return;
      }
      Array.prototype.forEach.call(parent.children, function(node) {
        if (elementsToKeep.has(node)) {
          deep(node);
        } else {
          try {
            var attr = node.getAttribute(controlAttribute);
            var alreadyHidden = attr !== null && attr !== "false";
            var counterValue = (counterMap.get(node) || 0) + 1;
            var markerValue = (markerCounter.get(node) || 0) + 1;
            counterMap.set(node, counterValue);
            markerCounter.set(node, markerValue);
            hiddenNodes.push(node);
            if (counterValue === 1 && alreadyHidden) {
              uncontrolledNodes.set(node, true);
            }
            if (markerValue === 1) {
              node.setAttribute(markerName, "true");
            }
            if (!alreadyHidden) {
              node.setAttribute(controlAttribute, "true");
            }
          } catch (e) {
            console.error("aria-hidden: cannot operate on ", node, e);
          }
        }
      });
    };
    deep(parentNode);
    elementsToKeep.clear();
    lockCount++;
    return function() {
      hiddenNodes.forEach(function(node) {
        var counterValue = counterMap.get(node) - 1;
        var markerValue = markerCounter.get(node) - 1;
        counterMap.set(node, counterValue);
        markerCounter.set(node, markerValue);
        if (!counterValue) {
          if (!uncontrolledNodes.has(node)) {
            node.removeAttribute(controlAttribute);
          }
          uncontrolledNodes.delete(node);
        }
        if (!markerValue) {
          node.removeAttribute(markerName);
        }
      });
      lockCount--;
      if (!lockCount) {
        counterMap = /* @__PURE__ */ new WeakMap();
        counterMap = /* @__PURE__ */ new WeakMap();
        uncontrolledNodes = /* @__PURE__ */ new WeakMap();
        markerMap = {};
      }
    };
  };
  var hideOthers = function(originalTarget, parentNode, markerName) {
    if (markerName === void 0) {
      markerName = "data-aria-hidden";
    }
    var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    var activeParentNode = parentNode || getDefaultParent(originalTarget);
    if (!activeParentNode) {
      return function() {
        return null;
      };
    }
    targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live], script")));
    return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
  };

  // node_modules/tslib/tslib.es6.mjs
  var __assign = function() {
    __assign = Object.assign || function __assign2(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  }
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  }

  // node_modules/react-remove-scroll/dist/es2015/Combination.js
  var React34 = __toESM(require_react());

  // node_modules/react-remove-scroll/dist/es2015/UI.js
  var React30 = __toESM(require_react());

  // node_modules/react-remove-scroll-bar/dist/es2015/constants.js
  var zeroRightClassName = "right-scroll-bar-position";
  var fullWidthClassName = "width-before-scroll-bar";
  var noScrollbarsClassName = "with-scroll-bars-hidden";
  var removedBarSizeVariable = "--removed-body-scroll-bar-size";

  // node_modules/use-callback-ref/dist/es2015/assignRef.js
  function assignRef(ref, value) {
    if (typeof ref === "function") {
      ref(value);
    } else if (ref) {
      ref.current = value;
    }
    return ref;
  }

  // node_modules/use-callback-ref/dist/es2015/useRef.js
  var import_react3 = __toESM(require_react());
  function useCallbackRef2(initialValue, callback) {
    var ref = (0, import_react3.useState)(function() {
      return {
        // value
        value: initialValue,
        // last callback
        callback,
        // "memoized" public interface
        facade: {
          get current() {
            return ref.value;
          },
          set current(value) {
            var last = ref.value;
            if (last !== value) {
              ref.value = value;
              ref.callback(value, last);
            }
          }
        }
      };
    })[0];
    ref.callback = callback;
    return ref.facade;
  }

  // node_modules/use-callback-ref/dist/es2015/useMergeRef.js
  var React28 = __toESM(require_react());
  var useIsomorphicLayoutEffect = typeof window !== "undefined" ? React28.useLayoutEffect : React28.useEffect;
  var currentValues = /* @__PURE__ */ new WeakMap();
  function useMergeRefs(refs, defaultValue) {
    var callbackRef = useCallbackRef2(defaultValue || null, function(newValue) {
      return refs.forEach(function(ref) {
        return assignRef(ref, newValue);
      });
    });
    useIsomorphicLayoutEffect(function() {
      var oldValue = currentValues.get(callbackRef);
      if (oldValue) {
        var prevRefs_1 = new Set(oldValue);
        var nextRefs_1 = new Set(refs);
        var current_1 = callbackRef.current;
        prevRefs_1.forEach(function(ref) {
          if (!nextRefs_1.has(ref)) {
            assignRef(ref, null);
          }
        });
        nextRefs_1.forEach(function(ref) {
          if (!prevRefs_1.has(ref)) {
            assignRef(ref, current_1);
          }
        });
      }
      currentValues.set(callbackRef, refs);
    }, [refs]);
    return callbackRef;
  }

  // node_modules/use-sidecar/dist/es2015/medium.js
  function ItoI(a) {
    return a;
  }
  function innerCreateMedium(defaults2, middleware) {
    if (middleware === void 0) {
      middleware = ItoI;
    }
    var buffer = [];
    var assigned = false;
    var medium = {
      read: function() {
        if (assigned) {
          throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
        }
        if (buffer.length) {
          return buffer[buffer.length - 1];
        }
        return defaults2;
      },
      useMedium: function(data) {
        var item = middleware(data, assigned);
        buffer.push(item);
        return function() {
          buffer = buffer.filter(function(x) {
            return x !== item;
          });
        };
      },
      assignSyncMedium: function(cb) {
        assigned = true;
        while (buffer.length) {
          var cbs = buffer;
          buffer = [];
          cbs.forEach(cb);
        }
        buffer = {
          push: function(x) {
            return cb(x);
          },
          filter: function() {
            return buffer;
          }
        };
      },
      assignMedium: function(cb) {
        assigned = true;
        var pendingQueue = [];
        if (buffer.length) {
          var cbs = buffer;
          buffer = [];
          cbs.forEach(cb);
          pendingQueue = buffer;
        }
        var executeQueue = function() {
          var cbs2 = pendingQueue;
          pendingQueue = [];
          cbs2.forEach(cb);
        };
        var cycle = function() {
          return Promise.resolve().then(executeQueue);
        };
        cycle();
        buffer = {
          push: function(x) {
            pendingQueue.push(x);
            cycle();
          },
          filter: function(filter2) {
            pendingQueue = pendingQueue.filter(filter2);
            return buffer;
          }
        };
      }
    };
    return medium;
  }
  function createSidecarMedium(options) {
    if (options === void 0) {
      options = {};
    }
    var medium = innerCreateMedium(null);
    medium.options = __assign({ async: true, ssr: false }, options);
    return medium;
  }

  // node_modules/use-sidecar/dist/es2015/exports.js
  var React29 = __toESM(require_react());
  var SideCar = function(_a) {
    var sideCar = _a.sideCar, rest = __rest(_a, ["sideCar"]);
    if (!sideCar) {
      throw new Error("Sidecar: please provide `sideCar` property to import the right car");
    }
    var Target = sideCar.read();
    if (!Target) {
      throw new Error("Sidecar medium not found");
    }
    return React29.createElement(Target, __assign({}, rest));
  };
  SideCar.isSideCarExport = true;
  function exportSidecar(medium, exported) {
    medium.useMedium(exported);
    return SideCar;
  }

  // node_modules/react-remove-scroll/dist/es2015/medium.js
  var effectCar = createSidecarMedium();

  // node_modules/react-remove-scroll/dist/es2015/UI.js
  var nothing = function() {
    return;
  };
  var RemoveScroll = React30.forwardRef(function(props, parentRef) {
    var ref = React30.useRef(null);
    var _a = React30.useState({
      onScrollCapture: nothing,
      onWheelCapture: nothing,
      onTouchMoveCapture: nothing
    }), callbacks = _a[0], setCallbacks = _a[1];
    var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noRelative = props.noRelative, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? "div" : _b, gapMode = props.gapMode, rest = __rest(props, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]);
    var SideCar2 = sideCar;
    var containerRef = useMergeRefs([ref, parentRef]);
    var containerProps = __assign(__assign({}, rest), callbacks);
    return React30.createElement(
      React30.Fragment,
      null,
      enabled && React30.createElement(SideCar2, { sideCar: effectCar, removeScrollBar, shards, noRelative, noIsolation, inert, setCallbacks, allowPinchZoom: !!allowPinchZoom, lockRef: ref, gapMode }),
      forwardProps ? React30.cloneElement(React30.Children.only(children), __assign(__assign({}, containerProps), { ref: containerRef })) : React30.createElement(Container, __assign({}, containerProps, { className, ref: containerRef }), children)
    );
  });
  RemoveScroll.defaultProps = {
    enabled: true,
    removeScrollBar: true,
    inert: false
  };
  RemoveScroll.classNames = {
    fullWidth: fullWidthClassName,
    zeroRight: zeroRightClassName
  };

  // node_modules/react-remove-scroll/dist/es2015/SideEffect.js
  var React33 = __toESM(require_react());

  // node_modules/react-remove-scroll-bar/dist/es2015/component.js
  var React32 = __toESM(require_react());

  // node_modules/react-style-singleton/dist/es2015/hook.js
  var React31 = __toESM(require_react());

  // node_modules/get-nonce/dist/es2015/index.js
  var currentNonce;
  var getNonce = function() {
    if (currentNonce) {
      return currentNonce;
    }
    if (typeof __webpack_nonce__ !== "undefined") {
      return __webpack_nonce__;
    }
    return void 0;
  };

  // node_modules/react-style-singleton/dist/es2015/singleton.js
  function makeStyleTag() {
    if (!document)
      return null;
    var tag = document.createElement("style");
    tag.type = "text/css";
    var nonce = getNonce();
    if (nonce) {
      tag.setAttribute("nonce", nonce);
    }
    return tag;
  }
  function injectStyles(tag, css) {
    if (tag.styleSheet) {
      tag.styleSheet.cssText = css;
    } else {
      tag.appendChild(document.createTextNode(css));
    }
  }
  function insertStyleTag(tag) {
    var head = document.head || document.getElementsByTagName("head")[0];
    head.appendChild(tag);
  }
  var stylesheetSingleton = function() {
    var counter = 0;
    var stylesheet = null;
    return {
      add: function(style) {
        if (counter == 0) {
          if (stylesheet = makeStyleTag()) {
            injectStyles(stylesheet, style);
            insertStyleTag(stylesheet);
          }
        }
        counter++;
      },
      remove: function() {
        counter--;
        if (!counter && stylesheet) {
          stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
          stylesheet = null;
        }
      }
    };
  };

  // node_modules/react-style-singleton/dist/es2015/hook.js
  var styleHookSingleton = function() {
    var sheet = stylesheetSingleton();
    return function(styles, isDynamic) {
      React31.useEffect(function() {
        sheet.add(styles);
        return function() {
          sheet.remove();
        };
      }, [styles && isDynamic]);
    };
  };

  // node_modules/react-style-singleton/dist/es2015/component.js
  var styleSingleton = function() {
    var useStyle = styleHookSingleton();
    var Sheet = function(_a) {
      var styles = _a.styles, dynamic = _a.dynamic;
      useStyle(styles, dynamic);
      return null;
    };
    return Sheet;
  };

  // node_modules/react-remove-scroll-bar/dist/es2015/utils.js
  var zeroGap = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0
  };
  var parse = function(x) {
    return parseInt(x || "", 10) || 0;
  };
  var getOffset = function(gapMode) {
    var cs = window.getComputedStyle(document.body);
    var left = cs[gapMode === "padding" ? "paddingLeft" : "marginLeft"];
    var top = cs[gapMode === "padding" ? "paddingTop" : "marginTop"];
    var right = cs[gapMode === "padding" ? "paddingRight" : "marginRight"];
    return [parse(left), parse(top), parse(right)];
  };
  var getGapWidth = function(gapMode) {
    if (gapMode === void 0) {
      gapMode = "margin";
    }
    if (typeof window === "undefined") {
      return zeroGap;
    }
    var offsets = getOffset(gapMode);
    var documentWidth = document.documentElement.clientWidth;
    var windowWidth = window.innerWidth;
    return {
      left: offsets[0],
      top: offsets[1],
      right: offsets[2],
      gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0])
    };
  };

  // node_modules/react-remove-scroll-bar/dist/es2015/component.js
  var Style = styleSingleton();
  var lockAttribute = "data-scroll-locked";
  var getStyles = function(_a, allowRelative, gapMode, important) {
    var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
    if (gapMode === void 0) {
      gapMode = "margin";
    }
    return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
      allowRelative && "position: relative ".concat(important, ";"),
      gapMode === "margin" && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
      gapMode === "padding" && "padding-right: ".concat(gap, "px ").concat(important, ";")
    ].filter(Boolean).join(""), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
  };
  var getCurrentUseCounter = function() {
    var counter = parseInt(document.body.getAttribute(lockAttribute) || "0", 10);
    return isFinite(counter) ? counter : 0;
  };
  var useLockAttribute = function() {
    React32.useEffect(function() {
      document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
      return function() {
        var newCounter = getCurrentUseCounter() - 1;
        if (newCounter <= 0) {
          document.body.removeAttribute(lockAttribute);
        } else {
          document.body.setAttribute(lockAttribute, newCounter.toString());
        }
      };
    }, []);
  };
  var RemoveScrollBar = function(_a) {
    var noRelative = _a.noRelative, noImportant = _a.noImportant, _b = _a.gapMode, gapMode = _b === void 0 ? "margin" : _b;
    useLockAttribute();
    var gap = React32.useMemo(function() {
      return getGapWidth(gapMode);
    }, [gapMode]);
    return React32.createElement(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? "!important" : "") });
  };

  // node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js
  var passiveSupported = false;
  if (typeof window !== "undefined") {
    try {
      options = Object.defineProperty({}, "passive", {
        get: function() {
          passiveSupported = true;
          return true;
        }
      });
      window.addEventListener("test", options, options);
      window.removeEventListener("test", options, options);
    } catch (err) {
      passiveSupported = false;
    }
  }
  var options;
  var nonPassive = passiveSupported ? { passive: false } : false;

  // node_modules/react-remove-scroll/dist/es2015/handleScroll.js
  var alwaysContainsScroll = function(node) {
    return node.tagName === "TEXTAREA";
  };
  var elementCanBeScrolled = function(node, overflow) {
    if (!(node instanceof Element)) {
      return false;
    }
    var styles = window.getComputedStyle(node);
    return (
      // not-not-scrollable
      styles[overflow] !== "hidden" && // contains scroll inside self
      !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === "visible")
    );
  };
  var elementCouldBeVScrolled = function(node) {
    return elementCanBeScrolled(node, "overflowY");
  };
  var elementCouldBeHScrolled = function(node) {
    return elementCanBeScrolled(node, "overflowX");
  };
  var locationCouldBeScrolled = function(axis, node) {
    var ownerDocument = node.ownerDocument;
    var current = node;
    do {
      if (typeof ShadowRoot !== "undefined" && current instanceof ShadowRoot) {
        current = current.host;
      }
      var isScrollable = elementCouldBeScrolled(axis, current);
      if (isScrollable) {
        var _a = getScrollVariables(axis, current), scrollHeight = _a[1], clientHeight = _a[2];
        if (scrollHeight > clientHeight) {
          return true;
        }
      }
      current = current.parentNode;
    } while (current && current !== ownerDocument.body);
    return false;
  };
  var getVScrollVariables = function(_a) {
    var scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
    return [
      scrollTop,
      scrollHeight,
      clientHeight
    ];
  };
  var getHScrollVariables = function(_a) {
    var scrollLeft = _a.scrollLeft, scrollWidth = _a.scrollWidth, clientWidth = _a.clientWidth;
    return [
      scrollLeft,
      scrollWidth,
      clientWidth
    ];
  };
  var elementCouldBeScrolled = function(axis, node) {
    return axis === "v" ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
  };
  var getScrollVariables = function(axis, node) {
    return axis === "v" ? getVScrollVariables(node) : getHScrollVariables(node);
  };
  var getDirectionFactor = function(axis, direction) {
    return axis === "h" && direction === "rtl" ? -1 : 1;
  };
  var handleScroll = function(axis, endTarget, event, sourceDelta, noOverscroll) {
    var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
    var delta = directionFactor * sourceDelta;
    var target = event.target;
    var targetInLock = endTarget.contains(target);
    var shouldCancelScroll = false;
    var isDeltaPositive = delta > 0;
    var availableScroll = 0;
    var availableScrollTop = 0;
    do {
      if (!target) {
        break;
      }
      var _a = getScrollVariables(axis, target), position = _a[0], scroll_1 = _a[1], capacity = _a[2];
      var elementScroll = scroll_1 - capacity - directionFactor * position;
      if (position || elementScroll) {
        if (elementCouldBeScrolled(axis, target)) {
          availableScroll += elementScroll;
          availableScrollTop += position;
        }
      }
      var parent_1 = target.parentNode;
      target = parent_1 && parent_1.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? parent_1.host : parent_1;
    } while (
      // portaled content
      !targetInLock && target !== document.body || // self content
      targetInLock && (endTarget.contains(target) || endTarget === target)
    );
    if (isDeltaPositive && (noOverscroll && Math.abs(availableScroll) < 1 || !noOverscroll && delta > availableScroll)) {
      shouldCancelScroll = true;
    } else if (!isDeltaPositive && (noOverscroll && Math.abs(availableScrollTop) < 1 || !noOverscroll && -delta > availableScrollTop)) {
      shouldCancelScroll = true;
    }
    return shouldCancelScroll;
  };

  // node_modules/react-remove-scroll/dist/es2015/SideEffect.js
  var getTouchXY = function(event) {
    return "changedTouches" in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
  };
  var getDeltaXY = function(event) {
    return [event.deltaX, event.deltaY];
  };
  var extractRef = function(ref) {
    return ref && "current" in ref ? ref.current : ref;
  };
  var deltaCompare = function(x, y) {
    return x[0] === y[0] && x[1] === y[1];
  };
  var generateStyle = function(id) {
    return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n");
  };
  var idCounter = 0;
  var lockStack = [];
  function RemoveScrollSideCar(props) {
    var shouldPreventQueue = React33.useRef([]);
    var touchStartRef = React33.useRef([0, 0]);
    var activeAxis = React33.useRef();
    var id = React33.useState(idCounter++)[0];
    var Style2 = React33.useState(styleSingleton)[0];
    var lastProps = React33.useRef(props);
    React33.useEffect(function() {
      lastProps.current = props;
    }, [props]);
    React33.useEffect(function() {
      if (props.inert) {
        document.body.classList.add("block-interactivity-".concat(id));
        var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef), true).filter(Boolean);
        allow_1.forEach(function(el) {
          return el.classList.add("allow-interactivity-".concat(id));
        });
        return function() {
          document.body.classList.remove("block-interactivity-".concat(id));
          allow_1.forEach(function(el) {
            return el.classList.remove("allow-interactivity-".concat(id));
          });
        };
      }
      return;
    }, [props.inert, props.lockRef.current, props.shards]);
    var shouldCancelEvent = React33.useCallback(function(event, parent) {
      if ("touches" in event && event.touches.length === 2 || event.type === "wheel" && event.ctrlKey) {
        return !lastProps.current.allowPinchZoom;
      }
      var touch = getTouchXY(event);
      var touchStart = touchStartRef.current;
      var deltaX = "deltaX" in event ? event.deltaX : touchStart[0] - touch[0];
      var deltaY = "deltaY" in event ? event.deltaY : touchStart[1] - touch[1];
      var currentAxis;
      var target = event.target;
      var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? "h" : "v";
      if ("touches" in event && moveDirection === "h" && target.type === "range") {
        return false;
      }
      var selection = window.getSelection();
      var anchorNode = selection && selection.anchorNode;
      var isTouchingSelection = anchorNode ? anchorNode === target || anchorNode.contains(target) : false;
      if (isTouchingSelection) {
        return false;
      }
      var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
      if (!canBeScrolledInMainDirection) {
        return true;
      }
      if (canBeScrolledInMainDirection) {
        currentAxis = moveDirection;
      } else {
        currentAxis = moveDirection === "v" ? "h" : "v";
        canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
      }
      if (!canBeScrolledInMainDirection) {
        return false;
      }
      if (!activeAxis.current && "changedTouches" in event && (deltaX || deltaY)) {
        activeAxis.current = currentAxis;
      }
      if (!currentAxis) {
        return true;
      }
      var cancelingAxis = activeAxis.current || currentAxis;
      return handleScroll(cancelingAxis, parent, event, cancelingAxis === "h" ? deltaX : deltaY, true);
    }, []);
    var shouldPrevent = React33.useCallback(function(_event) {
      var event = _event;
      if (!lockStack.length || lockStack[lockStack.length - 1] !== Style2) {
        return;
      }
      var delta = "deltaY" in event ? getDeltaXY(event) : getTouchXY(event);
      var sourceEvent = shouldPreventQueue.current.filter(function(e) {
        return e.name === event.type && (e.target === event.target || event.target === e.shadowParent) && deltaCompare(e.delta, delta);
      })[0];
      if (sourceEvent && sourceEvent.should) {
        if (event.cancelable) {
          event.preventDefault();
        }
        return;
      }
      if (!sourceEvent) {
        var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter(function(node) {
          return node.contains(event.target);
        });
        var shouldStop = shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation;
        if (shouldStop) {
          if (event.cancelable) {
            event.preventDefault();
          }
        }
      }
    }, []);
    var shouldCancel = React33.useCallback(function(name, delta, target, should) {
      var event = { name, delta, target, should, shadowParent: getOutermostShadowParent(target) };
      shouldPreventQueue.current.push(event);
      setTimeout(function() {
        shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e) {
          return e !== event;
        });
      }, 1);
    }, []);
    var scrollTouchStart = React33.useCallback(function(event) {
      touchStartRef.current = getTouchXY(event);
      activeAxis.current = void 0;
    }, []);
    var scrollWheel = React33.useCallback(function(event) {
      shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    var scrollTouchMove = React33.useCallback(function(event) {
      shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    React33.useEffect(function() {
      lockStack.push(Style2);
      props.setCallbacks({
        onScrollCapture: scrollWheel,
        onWheelCapture: scrollWheel,
        onTouchMoveCapture: scrollTouchMove
      });
      document.addEventListener("wheel", shouldPrevent, nonPassive);
      document.addEventListener("touchmove", shouldPrevent, nonPassive);
      document.addEventListener("touchstart", scrollTouchStart, nonPassive);
      return function() {
        lockStack = lockStack.filter(function(inst) {
          return inst !== Style2;
        });
        document.removeEventListener("wheel", shouldPrevent, nonPassive);
        document.removeEventListener("touchmove", shouldPrevent, nonPassive);
        document.removeEventListener("touchstart", scrollTouchStart, nonPassive);
      };
    }, []);
    var removeScrollBar = props.removeScrollBar, inert = props.inert;
    return React33.createElement(
      React33.Fragment,
      null,
      inert ? React33.createElement(Style2, { styles: generateStyle(id) }) : null,
      removeScrollBar ? React33.createElement(RemoveScrollBar, { noRelative: props.noRelative, gapMode: props.gapMode }) : null
    );
  }
  function getOutermostShadowParent(node) {
    var shadowParent = null;
    while (node !== null) {
      if (node instanceof ShadowRoot) {
        shadowParent = node.host;
        node = node.host;
      }
      node = node.parentNode;
    }
    return shadowParent;
  }

  // node_modules/react-remove-scroll/dist/es2015/sidecar.js
  var sidecar_default = exportSidecar(effectCar, RemoveScrollSideCar);

  // node_modules/react-remove-scroll/dist/es2015/Combination.js
  var ReactRemoveScroll = React34.forwardRef(function(props, ref) {
    return React34.createElement(RemoveScroll, __assign({}, props, { ref, sideCar: sidecar_default }));
  });
  ReactRemoveScroll.classNames = RemoveScroll.classNames;
  var Combination_default = ReactRemoveScroll;

  // node_modules/@radix-ui/react-popover/dist/index.mjs
  var import_jsx_runtime16 = __toESM(require_jsx_runtime(), 1);
  var POPOVER_NAME = "Popover";
  var [createPopoverContext, createPopoverScope] = createContextScope(POPOVER_NAME, [
    createPopperScope
  ]);
  var usePopperScope2 = createPopperScope();
  var [PopoverProvider, usePopoverContext] = createPopoverContext(POPOVER_NAME);
  var Popover = (props) => {
    const {
      __scopePopover,
      children,
      open: openProp,
      defaultOpen,
      onOpenChange,
      modal = false
    } = props;
    const popperScope = usePopperScope2(__scopePopover);
    const triggerRef = React35.useRef(null);
    const [hasCustomAnchor, setHasCustomAnchor] = React35.useState(false);
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? false,
      onChange: onOpenChange,
      caller: POPOVER_NAME
    });
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Root2, { ...popperScope, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      PopoverProvider,
      {
        scope: __scopePopover,
        contentId: useId(),
        triggerRef,
        open,
        onOpenChange: setOpen,
        onOpenToggle: React35.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
        hasCustomAnchor,
        onCustomAnchorAdd: React35.useCallback(() => setHasCustomAnchor(true), []),
        onCustomAnchorRemove: React35.useCallback(() => setHasCustomAnchor(false), []),
        modal,
        children
      }
    ) });
  };
  Popover.displayName = POPOVER_NAME;
  var ANCHOR_NAME2 = "PopoverAnchor";
  var PopoverAnchor = React35.forwardRef(
    (props, forwardedRef) => {
      const { __scopePopover, ...anchorProps } = props;
      const context = usePopoverContext(ANCHOR_NAME2, __scopePopover);
      const popperScope = usePopperScope2(__scopePopover);
      const { onCustomAnchorAdd, onCustomAnchorRemove } = context;
      React35.useEffect(() => {
        onCustomAnchorAdd();
        return () => onCustomAnchorRemove();
      }, [onCustomAnchorAdd, onCustomAnchorRemove]);
      return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Anchor, { ...popperScope, ...anchorProps, ref: forwardedRef });
    }
  );
  PopoverAnchor.displayName = ANCHOR_NAME2;
  var TRIGGER_NAME2 = "PopoverTrigger";
  var PopoverTrigger = React35.forwardRef(
    (props, forwardedRef) => {
      const { __scopePopover, ...triggerProps } = props;
      const context = usePopoverContext(TRIGGER_NAME2, __scopePopover);
      const popperScope = usePopperScope2(__scopePopover);
      const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
      const trigger = /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
        Primitive.button,
        {
          type: "button",
          "aria-haspopup": "dialog",
          "aria-expanded": context.open,
          "aria-controls": context.contentId,
          "data-state": getState(context.open),
          ...triggerProps,
          ref: composedTriggerRef,
          onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
        }
      );
      return context.hasCustomAnchor ? trigger : /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Anchor, { asChild: true, ...popperScope, children: trigger });
    }
  );
  PopoverTrigger.displayName = TRIGGER_NAME2;
  var PORTAL_NAME3 = "PopoverPortal";
  var [PortalProvider2, usePortalContext2] = createPopoverContext(PORTAL_NAME3, {
    forceMount: void 0
  });
  var PopoverPortal = (props) => {
    const { __scopePopover, forceMount, children, container } = props;
    const context = usePopoverContext(PORTAL_NAME3, __scopePopover);
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(PortalProvider2, { scope: __scopePopover, forceMount, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Portal, { asChild: true, container, children }) }) });
  };
  PopoverPortal.displayName = PORTAL_NAME3;
  var CONTENT_NAME3 = "PopoverContent";
  var PopoverContent = React35.forwardRef(
    (props, forwardedRef) => {
      const portalContext = usePortalContext2(CONTENT_NAME3, props.__scopePopover);
      const { forceMount = portalContext.forceMount, ...contentProps } = props;
      const context = usePopoverContext(CONTENT_NAME3, props.__scopePopover);
      return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Presence, { present: forceMount || context.open, children: context.modal ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(PopoverContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(PopoverContentNonModal, { ...contentProps, ref: forwardedRef }) });
    }
  );
  PopoverContent.displayName = CONTENT_NAME3;
  var Slot2 = createSlot3("PopoverContent.RemoveScroll");
  var PopoverContentModal = React35.forwardRef(
    (props, forwardedRef) => {
      const context = usePopoverContext(CONTENT_NAME3, props.__scopePopover);
      const contentRef = React35.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, contentRef);
      const isRightClickOutsideRef = React35.useRef(false);
      React35.useEffect(() => {
        const content = contentRef.current;
        if (content) return hideOthers(content);
      }, []);
      return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Combination_default, { as: Slot2, allowPinchZoom: true, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
        PopoverContentImpl,
        {
          ...props,
          ref: composedRefs,
          trapFocus: context.open,
          disableOutsidePointerEvents: true,
          onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
            event.preventDefault();
            if (!isRightClickOutsideRef.current) context.triggerRef.current?.focus();
          }),
          onPointerDownOutside: composeEventHandlers(
            props.onPointerDownOutside,
            (event) => {
              const originalEvent = event.detail.originalEvent;
              const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
              const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
              isRightClickOutsideRef.current = isRightClick;
            },
            { checkForDefaultPrevented: false }
          ),
          onFocusOutside: composeEventHandlers(
            props.onFocusOutside,
            (event) => event.preventDefault(),
            { checkForDefaultPrevented: false }
          )
        }
      ) });
    }
  );
  var PopoverContentNonModal = React35.forwardRef(
    (props, forwardedRef) => {
      const context = usePopoverContext(CONTENT_NAME3, props.__scopePopover);
      const hasInteractedOutsideRef = React35.useRef(false);
      const hasPointerDownOutsideRef = React35.useRef(false);
      return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
        PopoverContentImpl,
        {
          ...props,
          ref: forwardedRef,
          trapFocus: false,
          disableOutsidePointerEvents: false,
          onCloseAutoFocus: (event) => {
            props.onCloseAutoFocus?.(event);
            if (!event.defaultPrevented) {
              if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
              event.preventDefault();
            }
            hasInteractedOutsideRef.current = false;
            hasPointerDownOutsideRef.current = false;
          },
          onInteractOutside: (event) => {
            props.onInteractOutside?.(event);
            if (!event.defaultPrevented) {
              hasInteractedOutsideRef.current = true;
              if (event.detail.originalEvent.type === "pointerdown") {
                hasPointerDownOutsideRef.current = true;
              }
            }
            const target = event.target;
            const targetIsTrigger = context.triggerRef.current?.contains(target);
            if (targetIsTrigger) event.preventDefault();
            if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
              event.preventDefault();
            }
          }
        }
      );
    }
  );
  var PopoverContentImpl = React35.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopePopover,
        trapFocus,
        onOpenAutoFocus,
        onCloseAutoFocus,
        disableOutsidePointerEvents,
        onEscapeKeyDown,
        onPointerDownOutside,
        onFocusOutside,
        onInteractOutside,
        ...contentProps
      } = props;
      const context = usePopoverContext(CONTENT_NAME3, __scopePopover);
      const popperScope = usePopperScope2(__scopePopover);
      useFocusGuards();
      return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
        FocusScope,
        {
          asChild: true,
          loop: true,
          trapped: trapFocus,
          onMountAutoFocus: onOpenAutoFocus,
          onUnmountAutoFocus: onCloseAutoFocus,
          children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
            DismissableLayer,
            {
              asChild: true,
              disableOutsidePointerEvents,
              onInteractOutside,
              onEscapeKeyDown,
              onPointerDownOutside,
              onFocusOutside,
              onDismiss: () => context.onOpenChange(false),
              children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
                Content,
                {
                  "data-state": getState(context.open),
                  role: "dialog",
                  id: context.contentId,
                  ...popperScope,
                  ...contentProps,
                  ref: forwardedRef,
                  style: {
                    ...contentProps.style,
                    // re-namespace exposed content custom properties
                    ...{
                      "--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
                      "--radix-popover-content-available-width": "var(--radix-popper-available-width)",
                      "--radix-popover-content-available-height": "var(--radix-popper-available-height)",
                      "--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
                      "--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
                    }
                  }
                }
              )
            }
          )
        }
      );
    }
  );
  var CLOSE_NAME = "PopoverClose";
  var PopoverClose = React35.forwardRef(
    (props, forwardedRef) => {
      const { __scopePopover, ...closeProps } = props;
      const context = usePopoverContext(CLOSE_NAME, __scopePopover);
      return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
        Primitive.button,
        {
          type: "button",
          ...closeProps,
          ref: forwardedRef,
          onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
        }
      );
    }
  );
  PopoverClose.displayName = CLOSE_NAME;
  var ARROW_NAME3 = "PopoverArrow";
  var PopoverArrow = React35.forwardRef(
    (props, forwardedRef) => {
      const { __scopePopover, ...arrowProps } = props;
      const popperScope = usePopperScope2(__scopePopover);
      return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Arrow2, { ...popperScope, ...arrowProps, ref: forwardedRef });
    }
  );
  PopoverArrow.displayName = ARROW_NAME3;
  function getState(open) {
    return open ? "open" : "closed";
  }
  var Root22 = Popover;
  var Trigger2 = PopoverTrigger;
  var Portal3 = PopoverPortal;
  var Content22 = PopoverContent;

  // components/ui/popover.tsx
  var import_jsx_runtime17 = __toESM(require_jsx_runtime());
  function Popover2({
    ...props
  }) {
    return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Root22, { "data-slot": "popover", ...props });
  }
  function PopoverTrigger2({
    ...props
  }) {
    return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Trigger2, { "data-slot": "popover-trigger", ...props });
  }
  function PopoverContent2({
    className,
    align = "center",
    sideOffset = 4,
    ...props
  }) {
    return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Portal3, { children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
      Content22,
      {
        "data-slot": "popover-content",
        align,
        sideOffset,
        className: cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        ),
        ...props
      }
    ) });
  }

  // node_modules/lucide-react/dist/esm/createLucideIcon.js
  var import_react5 = __toESM(require_react());

  // node_modules/lucide-react/dist/esm/shared/src/utils.js
  var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  var toCamelCase2 = (string) => string.replace(
    /^([A-Z])|[\s-_]+(\w)/g,
    (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
  );
  var toPascalCase = (string) => {
    const camelCase = toCamelCase2(string);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  };
  var mergeClasses = (...classes) => classes.filter((className, index2, array) => {
    return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index2;
  }).join(" ").trim();
  var hasA11yProp = (props) => {
    for (const prop in props) {
      if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
        return true;
      }
    }
  };

  // node_modules/lucide-react/dist/esm/Icon.js
  var import_react4 = __toESM(require_react());

  // node_modules/lucide-react/dist/esm/defaultAttributes.js
  var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  // node_modules/lucide-react/dist/esm/Icon.js
  var Icon = (0, import_react4.forwardRef)(
    ({
      color = "currentColor",
      size: size4 = 24,
      strokeWidth = 2,
      absoluteStrokeWidth,
      className = "",
      children,
      iconNode,
      ...rest
    }, ref) => (0, import_react4.createElement)(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size4,
        height: size4,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size4) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => (0, import_react4.createElement)(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    )
  );

  // node_modules/lucide-react/dist/esm/createLucideIcon.js
  var createLucideIcon = (iconName, iconNode) => {
    const Component = (0, import_react5.forwardRef)(
      ({ className, ...props }, ref) => (0, import_react5.createElement)(Icon, {
        ref,
        iconNode,
        className: mergeClasses(
          `lucide-${toKebabCase(toPascalCase(iconName))}`,
          `lucide-${iconName}`,
          className
        ),
        ...props
      })
    );
    Component.displayName = toPascalCase(iconName);
    return Component;
  };

  // node_modules/lucide-react/dist/esm/icons/book-open.js
  var __iconNode = [
    ["path", { d: "M12 7v14", key: "1akyts" }],
    [
      "path",
      {
        d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
        key: "ruj8y"
      }
    ]
  ];
  var BookOpen = createLucideIcon("book-open", __iconNode);

  // node_modules/lucide-react/dist/esm/icons/bus.js
  var __iconNode2 = [
    ["path", { d: "M8 6v6", key: "18i7km" }],
    ["path", { d: "M15 6v6", key: "1sg6z9" }],
    ["path", { d: "M2 12h19.6", key: "de5uta" }],
    [
      "path",
      {
        d: "M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3",
        key: "1wwztk"
      }
    ],
    ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }],
    ["path", { d: "M9 18h5", key: "lrx6i" }],
    ["circle", { cx: "16", cy: "18", r: "2", key: "1v4tcr" }]
  ];
  var Bus = createLucideIcon("bus", __iconNode2);

  // node_modules/lucide-react/dist/esm/icons/calendar.js
  var __iconNode3 = [
    ["path", { d: "M8 2v4", key: "1cmpym" }],
    ["path", { d: "M16 2v4", key: "4m81vk" }],
    ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
    ["path", { d: "M3 10h18", key: "8toen8" }]
  ];
  var Calendar = createLucideIcon("calendar", __iconNode3);

  // node_modules/lucide-react/dist/esm/icons/chevron-right.js
  var __iconNode4 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
  var ChevronRight = createLucideIcon("chevron-right", __iconNode4);

  // node_modules/lucide-react/dist/esm/icons/chevron-left.js
  var __iconNode5 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
  var ChevronLeft = createLucideIcon("chevron-left", __iconNode5);

  // node_modules/lucide-react/dist/esm/icons/credit-card.js
  var __iconNode6 = [
    ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
    ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
  ];
  var CreditCard = createLucideIcon("credit-card", __iconNode6);

  // node_modules/lucide-react/dist/esm/icons/file-text.js
  var __iconNode7 = [
    [
      "path",
      {
        d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
        key: "1oefj6"
      }
    ],
    ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
    ["path", { d: "M10 9H8", key: "b1mrlr" }],
    ["path", { d: "M16 13H8", key: "t4e002" }],
    ["path", { d: "M16 17H8", key: "z1uh3a" }]
  ];
  var FileText = createLucideIcon("file-text", __iconNode7);

  // node_modules/lucide-react/dist/esm/icons/layout-dashboard.js
  var __iconNode8 = [
    ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
    ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
    ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
    ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
  ];
  var LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode8);

  // node_modules/lucide-react/dist/esm/icons/log-out.js
  var __iconNode9 = [
    ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
    ["path", { d: "M21 12H9", key: "dn1m92" }],
    ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
  ];
  var LogOut = createLucideIcon("log-out", __iconNode9);

  // node_modules/lucide-react/dist/esm/icons/message-square.js
  var __iconNode10 = [
    [
      "path",
      {
        d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
        key: "18887p"
      }
    ]
  ];
  var MessageSquare = createLucideIcon("message-square", __iconNode10);

  // node_modules/lucide-react/dist/esm/icons/settings.js
  var __iconNode11 = [
    [
      "path",
      {
        d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
        key: "1i5ecw"
      }
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
  ];
  var Settings = createLucideIcon("settings", __iconNode11);

  // node_modules/lucide-react/dist/esm/icons/user-cog.js
  var __iconNode12 = [
    ["path", { d: "M10 15H6a4 4 0 0 0-4 4v2", key: "1nfge6" }],
    ["path", { d: "m14.305 16.53.923-.382", key: "1itpsq" }],
    ["path", { d: "m15.228 13.852-.923-.383", key: "eplpkm" }],
    ["path", { d: "m16.852 12.228-.383-.923", key: "13v3q0" }],
    ["path", { d: "m16.852 17.772-.383.924", key: "1i8mnm" }],
    ["path", { d: "m19.148 12.228.383-.923", key: "1q8j1v" }],
    ["path", { d: "m19.53 18.696-.382-.924", key: "vk1qj3" }],
    ["path", { d: "m20.772 13.852.924-.383", key: "n880s0" }],
    ["path", { d: "m20.772 16.148.924.383", key: "1g6xey" }],
    ["circle", { cx: "18", cy: "15", r: "3", key: "gjjjvw" }],
    ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
  ];
  var UserCog = createLucideIcon("user-cog", __iconNode12);

  // node_modules/lucide-react/dist/esm/icons/users.js
  var __iconNode13 = [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
    ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
    ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
    ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
  ];
  var Users = createLucideIcon("users", __iconNode13);

  // node_modules/lucide-react/dist/esm/icons/x.js
  var __iconNode14 = [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
  ];
  var X = createLucideIcon("x", __iconNode14);

  // components/layouts/Sidebar.tsx
  var import_jsx_runtime18 = __toESM(require_jsx_runtime());
  var sidebarItems = [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    {
      title: "Academic",
      href: "/admin/academic",
      icon: BookOpen,
      subItems: [
        { title: "Classes", href: "/admin/academic/classes" },
        { title: "Subjects", href: "/admin/academic/subjects" },
        { title: "Academic Years", href: "/admin/academic/years" },
        { title: "Academic Terms", href: "/admin/academic/terms" },
        { title: "Grading Policy", href: "/admin/academic/grading-policy" },
        { title: "Question Bank", href: "/admin/academic/questions" },
        { title: "Assessment Types", href: "/admin/academic/assessments" },
        { title: "Learning Courses", href: "/admin/academic/learning-courses" },
        { title: "Behavior Tracking", href: "/admin/academic/behavior" }
      ]
    },
    { title: "Teachers", href: "/admin/teachers", icon: Users },
    { title: "Students", href: "/admin/students", icon: Users },
    {
      title: "Attendance",
      href: "/admin/attendance",
      icon: Calendar,
      subItems: [
        { title: "Overview", href: "/admin/attendance" },
        { title: "QR Scanner", href: "/admin/attendance/qr-scanner" },
        { title: "Live Attendance", href: "/admin/attendance/live" },
        { title: "Attendance Reports", href: "/admin/attendance/reports" }
      ]
    },
    {
      title: "HR",
      href: "/admin/hr",
      icon: Users,
      subItems: [
        { title: "Staff Directory", href: "/admin/hr/staff-directory" },
        { title: "Payroll", href: "/admin/hr/payroll" },
        { title: "Performance Reviews", href: "/admin/hr/performance" },
        { title: "Leave Management", href: "/admin/hr/leave" }
      ]
    },
    {
      title: "Library",
      href: "/admin/library",
      icon: BookOpen,
      subItems: [
        { title: "Books Catalog", href: "/admin/library/books" },
        { title: "Issue / Return", href: "/admin/library/transactions" },
        { title: "Reports", href: "/admin/library/reports" }
      ]
    },
    {
      title: "Transport",
      href: "/admin/transport",
      icon: Bus,
      subItems: [
        { title: "Routes", href: "/admin/transport/routes" },
        { title: "Vehicles", href: "/admin/transport/vehicles" },
        { title: "Allocations", href: "/admin/transport/allocations" },
        { title: "Reports", href: "/admin/transport/reports" }
      ]
    },
    { title: "Communication", href: "/admin/communication", icon: MessageSquare },
    { title: "Exams", href: "/admin/exams", icon: FileText },
    { title: "Finance", href: "/admin/finance", icon: CreditCard },
    { title: "Reports", href: "/admin/reports", icon: FileText },
    { title: "Roles & Permissions", href: "/admin/roles", icon: UserCog },
    { title: "Settings", href: "/admin/settings", icon: Settings }
  ];
  function Sidebar({ className }) {
    const pathname = (0, import_navigation.usePathname)();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const { isCollapsed, isMobileOpen, toggleCollapse, toggleMobile, closeMobile } = useSidebarStore();
    const [expandedItems, setExpandedItems] = (0, import_react6.useState)(["Academic"]);
    const [hoveredItem, setHoveredItem] = (0, import_react6.useState)(null);
    (0, import_react6.useEffect)(() => {
      closeMobile();
    }, [pathname, closeMobile]);
    (0, import_react6.useEffect)(() => {
      const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key === "b") {
          e.preventDefault();
          toggleCollapse();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleCollapse]);
    const qc = useQueryClient();
    const isActive = (href) => {
      if (href === "/admin/dashboard") return pathname === href;
      return pathname.startsWith(href.split("?")[0]);
    };
    const handleMouseEnter = (href) => {
      if (href === "/admin/students") {
        qc.prefetchQuery({ queryKey: ["students", { page: 1, search: "", classId: "" }], queryFn: () => adminAPI.getStudents({ page: 1 }) });
      } else if (href === "/admin/teachers") {
        qc.prefetchQuery({ queryKey: ["teachers", { page: 1, search: "" }], queryFn: () => adminAPI.getTeachers({ page: 1 }) });
      } else if (href === "/admin/academic/classes" || href.startsWith("/admin/academic")) {
        qc.prefetchQuery({ queryKey: ["classes"], queryFn: () => academicAPI.getClasses() });
        qc.prefetchQuery({ queryKey: ["subjects"], queryFn: () => academicAPI.getSubjects() });
        qc.prefetchQuery({ queryKey: ["academicYears"], queryFn: () => adminAPI.getAcademicYears() });
        qc.prefetchQuery({ queryKey: ["academicTerms"], queryFn: () => adminAPI.getAcademicTerms() });
      } else if (href.startsWith("/admin/attendance")) {
        qc.prefetchQuery({ queryKey: ["attendance", { classLevel: "", date: "" }], queryFn: () => Promise.resolve([]) });
      } else if (href === "/admin/dashboard") {
        qc.prefetchQuery({ queryKey: ["dashboardStats"], queryFn: () => adminAPI.getDashboardStats() });
      } else if (href.startsWith("/admin/exams")) {
        qc.prefetchQuery({ queryKey: ["exams", { page: 1 }], queryFn: () => examAPI.getAll() });
      } else if (href.startsWith("/admin/hr")) {
        qc.prefetchQuery({ queryKey: ["staff", { page: 1 }], queryFn: () => hrAPI.getStaff({ page: 1 }) });
        qc.prefetchQuery({ queryKey: ["payroll"], queryFn: () => hrAPI.getPayrolls() });
        qc.prefetchQuery({ queryKey: ["appraisals", { page: 1 }], queryFn: () => hrAPI.getAppraisals({ page: 1 }) });
      } else if (href.startsWith("/admin/library")) {
        qc.prefetchQuery({ queryKey: ["books", { page: 1 }], queryFn: () => libraryAPI.getBooks({ page: 1 }) });
      } else if (href.startsWith("/admin/documents")) {
        qc.prefetchQuery({ queryKey: ["documents", "templates"], queryFn: () => adminAPI.getDocumentTemplates() });
      } else if (href === "/admin/settings") {
        const user2 = useAuthStore.getState().user;
        if (user2?.schoolId) {
          qc.prefetchQuery({ queryKey: ["school", user2.schoolId], queryFn: () => adminSchoolAPI.getSchool(user2.schoolId) });
        }
      } else if (href.startsWith("/admin/transport")) {
        qc.prefetchQuery({ queryKey: ["routes", { page: 1 }], queryFn: () => transportAPI.getRoutes({ page: 1 }) });
        qc.prefetchQuery({ queryKey: ["vehicles"], queryFn: () => transportAPI.getVehicles() });
      }
    };
    const toggleExpanded = (title) => {
      setExpandedItems(
        (prev) => prev.includes(title) ? prev.filter((i) => i !== title) : [...prev, title]
      );
    };
    const handleLogout = () => {
      logout();
    };
    return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(TooltipProvider2, { children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: cn(
      "fixed inset-y-0 left-0 z-50 bg-white text-slate-700 border-r border-slate-100 flex flex-col transform transition-all duration-300 ease-in-out",
      isCollapsed ? "w-[72px]" : "w-[280px]",
      isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      className
    ), children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "h-20 flex items-center relative px-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: cn(
          "flex items-center transition-all duration-300 w-full",
          isCollapsed ? "justify-center" : "justify-start px-2"
        ), children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(import_link.default, { href: "/admin/dashboard", className: "flex items-center gap-3 min-w-0", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(GraduationCap, { className: "h-6 w-6 text-white" }) }),
          !isCollapsed && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("span", { className: "font-bold text-xl text-slate-900 tracking-tight truncate", children: [
            "Progress ",
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "text-violet-500", children: "LMS" })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          "button",
          {
            onClick: toggleCollapse,
            className: cn(
              "hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200",
              isCollapsed ? "absolute -right-3 top-7 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center shadow-sm z-50" : ""
            ),
            title: isCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)",
            children: isCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(ChevronRight, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(ChevronLeft, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          "button",
          {
            onClick: closeMobile,
            className: "lg:hidden p-2 rounded-lg hover:bg-slate-100 flex-shrink-0 transition-colors",
            children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(X, { className: "w-5 h-5 text-slate-500" })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("nav", { className: "flex-1 px-4 pb-4 space-y-1 overflow-y-auto", children: sidebarItems.map((item) => {
        if (item.title === "Teachers" && user?.features?.canManageTeachers === false) return null;
        if (item.title === "Students" && user?.features?.canManageStudents === false) return null;
        if (item.title === "Academic" && user?.features?.canManageAcademics === false) return null;
        if (item.title === "Attendance" && user?.features?.canManageAttendance === false) return null;
        if (item.title === "Exams" && user?.features?.canManageExams === false) return null;
        if (item.title === "Finance" && user?.features?.canManageFinance === false) return null;
        if (item.title === "Communication" && user?.features?.canManageCommunication === false) return null;
        if (item.title === "Reports" && user?.features?.canViewReports === false) return null;
        if (item.title === "Roles & Permissions" && user?.features?.canManageRoles === false) return null;
        const active = isActive(item.href);
        if (isCollapsed) {
          return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "relative", children: item.subItems ? /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(Popover2, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(PopoverTrigger2, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
              "button",
              {
                className: cn(
                  "w-full group flex items-center justify-center px-3 py-3 rounded-lg transition-all duration-200",
                  active ? "bg-violet-50 text-violet-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                ),
                onMouseEnter: () => {
                  setHoveredItem(item.title);
                  handleMouseEnter(item.href);
                },
                onMouseLeave: () => setHoveredItem(null),
                children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(item.icon, { className: cn(
                  "h-[22px] w-[22px] flex-shrink-0 transition-transform",
                  active ? "text-violet-600" : "text-slate-500 group-hover:text-slate-700"
                ) })
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(PopoverContent2, { side: "right", align: "start", className: "w-56 p-2 ml-2", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "px-3 py-2 text-sm font-medium text-slate-900 border-b border-slate-100", children: item.title }),
              item.subItems.map((subItem) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                import_link.default,
                {
                  href: subItem.href,
                  onMouseEnter: () => handleMouseEnter(subItem.href),
                  className: cn(
                    "block px-3 py-2 text-sm rounded-md transition-all",
                    pathname === subItem.href.split("?")[0] ? "text-blue-600 font-medium bg-slate-100" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  ),
                  children: subItem.title
                },
                subItem.href
              ))
            ] }) })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(Tooltip2, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(TooltipTrigger2, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
              import_link.default,
              {
                href: item.href,
                className: cn(
                  "group flex items-center justify-center px-3 py-3 rounded-lg transition-all duration-200",
                  active ? "bg-violet-50 text-violet-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                ),
                children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(item.icon, { className: cn(
                  "h-[22px] w-[22px] flex-shrink-0 transition-transform",
                  active ? "text-violet-600" : "text-slate-500 group-hover:text-slate-700"
                ) })
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(TooltipContent2, { side: "right", className: "ml-2", children: item.title })
          ] }) }, item.href);
        }
        return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { children: item.subItems ? /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(import_jsx_runtime18.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
            "button",
            {
              onClick: () => toggleExpanded(item.title),
              className: cn(
                "w-full group flex items-center justify-between gap-3 px-3.5 py-3 rounded-lg transition-all duration-200",
                active ? "bg-violet-50 text-violet-600 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              ),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "flex items-center gap-3 min-w-0", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(item.icon, { className: cn(
                    "h-[22px] w-[22px] flex-shrink-0 transition-transform",
                    active ? "text-violet-600" : "text-slate-500 group-hover:text-slate-700"
                  ) }),
                  /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "text-sm font-medium truncate", children: item.title })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(ChevronRight, { className: cn(
                  "h-4 w-4 transition-transform flex-shrink-0 opacity-70",
                  expandedItems.includes(item.title) && "rotate-90"
                ) })
              ]
            }
          ),
          expandedItems.includes(item.title) && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "ml-4 mt-1 space-y-1 pl-4 border-l border-slate-100", children: item.subItems.map((subItem) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
            import_link.default,
            {
              href: subItem.href,
              onMouseEnter: () => handleMouseEnter(subItem.href),
              className: cn(
                "block py-2 px-3 text-sm rounded-md transition-all",
                pathname === subItem.href.split("?")[0] ? "text-blue-600 font-medium bg-slate-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              ),
              children: subItem.title
            },
            subItem.href
          )) })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
          import_link.default,
          {
            href: item.href,
            onMouseEnter: () => handleMouseEnter(item.href),
            className: cn(
              "group flex items-center gap-3 px-3.5 py-3 rounded-lg transition-all duration-200",
              active ? "bg-violet-50 text-violet-600 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            ),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(item.icon, { className: cn(
                "h-[22px] w-[22px] flex-shrink-0 transition-transform",
                active ? "text-violet-600" : "text-slate-500 group-hover:text-slate-700"
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "text-sm font-medium truncate", children: item.title })
            ]
          }
        ) }, item.href);
      }) }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: cn(
        "p-4 m-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all duration-300",
        isCollapsed ? "mx-2" : "mx-4"
      ), children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: cn(
          "flex items-center gap-3 mb-3",
          isCollapsed ? "justify-center" : ""
        ), children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold flex-shrink-0", children: user?.name?.charAt(0) || "A" }),
          !isCollapsed && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { className: "text-sm font-bold text-slate-900 truncate", children: user?.name || "Admin" }),
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { className: "text-xs font-medium text-slate-500", children: "School Admin" })
          ] })
        ] }),
        !isCollapsed && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
          Button,
          {
            onClick: handleLogout,
            variant: "ghost",
            className: "w-full justify-center text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg h-9 text-sm font-medium",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(LogOut, { className: "w-4 h-4 mr-2" }),
              "Logout"
            ]
          }
        ),
        isCollapsed && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(Tooltip2, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(TooltipTrigger2, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
            Button,
            {
              onClick: handleLogout,
              variant: "ghost",
              size: "sm",
              className: "w-full p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg",
              children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(LogOut, { className: "w-4 h-4" })
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(TooltipContent2, { side: "right", className: "ml-2", children: "Logout" })
        ] })
      ] })
    ] }) });
  }
})();
/*! Bundled license information:

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.development.js:
  (**
   * @license React
   * react-jsx-runtime.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.development.js:
  (**
   * @license React
   * react-dom.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/utils.js:
lucide-react/dist/esm/defaultAttributes.js:
lucide-react/dist/esm/Icon.js:
lucide-react/dist/esm/createLucideIcon.js:
lucide-react/dist/esm/icons/book-open.js:
lucide-react/dist/esm/icons/bus.js:
lucide-react/dist/esm/icons/calendar.js:
lucide-react/dist/esm/icons/chevron-right.js:
lucide-react/dist/esm/icons/chevron-left.js:
lucide-react/dist/esm/icons/credit-card.js:
lucide-react/dist/esm/icons/file-text.js:
lucide-react/dist/esm/icons/layout-dashboard.js:
lucide-react/dist/esm/icons/log-out.js:
lucide-react/dist/esm/icons/message-square.js:
lucide-react/dist/esm/icons/settings.js:
lucide-react/dist/esm/icons/user-cog.js:
lucide-react/dist/esm/icons/users.js:
lucide-react/dist/esm/icons/x.js:
lucide-react/dist/esm/lucide-react.js:
  (**
   * @license lucide-react v0.555.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
