const bindable = require('./bindable');
const { expression } = require('ober');
const { registerElementHandler } = require('./utils');
const { isObject } = require('ntils');

function compileExpr(expr) {
  return {
    get: expression(expr),
    set: expression(`$scope.${expr}=$value`)
  };
}

function elementHandler(type, props) {
  if (!type || !props) return;
  const dataBind = props['data-bind'];
  const bindOpts = dataBind && bindable.getOptions(type, props);
  if (!dataBind || !bindOpts) return;
  const dataScope = props['data-scope'] || this.model;
  const bindExpr = compileExpr(dataBind);
  const setValue = value => bindExpr.set(Object.create(dataScope, {
    $value: { value }
  }));
  const getValue = () => bindExpr.get(dataScope);
  const context = { getValue, setValue };
  const bindEvent = bindOpts.event[0];
  const initailChange = props[bindEvent];
  const bindEventHandler = (event, ...args) => {
    const handler = bindOpts.event[1];
    if (handler instanceof Function) {
      handler(context, event, ...args);
    } else if (!handler) {
      const value = isObject(event) && 'target' in event ?
        event.target.value : event;
      setValue(value);
    } else {
      setValue(expression(String(handler))(event));
    }
    if (initailChange) return initailChange(event, ...args);
  };
  const bindProp = bindOpts.prop[0];
  const bindPropHandler = bindOpts.prop[1] || (ctx => ctx.getValue());
  //--
  props[bindProp] = bindPropHandler(context, props);
  props[bindEvent] = bindEventHandler;
  props['data-scope'] = undefined;
  props['data-bind'] = undefined;
}

function binding(component) {
  if (!component) return binding;
  const proto = component.prototype;
  if (proto._contented_) {
    throw new Error('`binding` must be enabled before `model`');
  }
  registerElementHandler(proto, elementHandler);
  return component;
}

module.exports = binding;