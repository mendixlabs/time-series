define(["require", "exports"], function (require, exports) {
    "use strict";
    function includes(array, item) {
        return array.indexOf(item) >= 0;
    }
    exports.includes = includes;
    function negate(f) {
        return function () {
            return !f.apply(this, arguments);
        };
    }
    exports.negate = negate;
    function filterObject(object, keys, predicate) {
        var result = {};
        var ks = Object.keys(object);
        for (var i = 0, l = ks.length; i < l; i++) {
            var key = ks[i];
            var value = object[key];
            if (predicate(keys, key)) {
                result[key] = value;
            }
        }
        return result;
    }
    exports.filterObject = filterObject;
    function pick(object, keys) {
        return filterObject(object, keys, includes);
    }
    exports.pick = pick;
    function without(object, keys) {
        return filterObject(object, keys, negate(includes));
    }
    exports.without = without;
    function isPlainObject(obj) {
        if (typeof obj === "object" && obj !== null) {
            if (typeof Object.getPrototypeOf === "function") {
                var proto = Object.getPrototypeOf(obj);
                return proto === Object.prototype || proto === null;
            }
            return Object.prototype.toString.call(obj) === "[object Object]";
        }
        return false;
    }
    exports.isPlainObject = isPlainObject;
    function bindFunctions(originalObject, context) {
        var out;
        var v;
        var key;
        out = Array.isArray(originalObject) ? [] : {};
        for (key in originalObject) {
            if (originalObject.hasOwnProperty(key)) {
                v = originalObject[key];
                if (v == null) {
                    continue;
                }
                else if (typeof v === "object" && v !== null && v.type !== "function") {
                    out[key] = bindFunctions(v, context);
                }
                else if (v.type === "function") {
                    out[key] = context[v.name];
                }
                else {
                    out[key] = v;
                }
            }
        }
        return out;
    }
    exports.bindFunctions = bindFunctions;
    function getValueFunction(v, _default) {
        if (typeof v === "function") {
            return v;
        }
        return function (d) { return typeof d[v] !== "undefined" ? d[v] : d[_default]; };
    }
    exports.getValueFunction = getValueFunction;
    function propsByPrefix(prefix, props) {
        console.warn("Set margin with prefixes is deprecated use an object instead");
        prefix = prefix + "-";
        return Object.keys(props).reduce(function (memo, prop) {
            if (prop.substr(0, prefix.length) === prefix) {
                memo[prop.replace(prefix, "")] = props[prop];
            }
            return memo;
        }, {});
    }
    exports.propsByPrefix = propsByPrefix;
    function isCallable(value) {
        return value && typeof value === "function";
    }
    exports.isCallable = isCallable;
});
//# sourceMappingURL=utils.js.map