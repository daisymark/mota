const React = require('react');
const { Component, PureComponent } = React;
const { final, isObject } = require('ntils');

function registerMountHandler(proto, handler) {
  if (!proto._mountHandlers_) final(proto, '_mountHandlers_', []);
  proto._mountHandlers_.push(handler);
}

function registerUnmountHandler(proto, handler) {
  if (!proto._unmountHandlers_) final(proto, '_unmountHandlers_', []);
  proto._unmountHandlers_.push(handler);
}

function registerDidUpdateHandler(proto, handler) {
  if (!proto._didUpdateHandlers_) final(proto, '_didUpdateHandlers_', []);
  proto._didUpdateHandlers_.push(handler);
}

function registerElementHandler(proto, handler) {
  if (!proto._elementHandlers_) final(proto, '_elementHandlers_', []);
  proto._elementHandlers_.push(handler);
}

function registerRenderHandler(proto, handler) {
  if (!proto._renderHandlers_) final(proto, '_renderHandlers_', []);
  proto._renderHandlers_.push(handler);
}

function registerModelHandler(proto, handler) {
  if (!proto._modelHandlers_) final(proto, '_modelHandlers_', []);
  proto._modelHandlers_.push(handler);
}

function isComponentInstance(instance) {
  if (!instance || !isObject(instance)) return false;
  return (instance instanceof Component) ||
    (instance instanceof PureComponent) ||
    ('render' in instance && '__reactAutoBindPairs' in instance);
}

function isComponentClass(com) {
  if (!com) return false;
  return isComponentInstance(com.prototype);
}

function markAsDeep(target, name) {
  if (!target._deep_) final(target, '_deep_', {});
  if (name) target._deep_[name] = true;
}

function markAsWatch(target, name) {
  if (!target._watch_) final(target, '_watch_', {});
  if (name) target._watch_[name] = true;
}

function markAsAutorun(target, name) {
  if (!target._autorun_) final(target, '_autorun_', {});
  if (name) target._autorun_[name] = true;
}

module.exports = {
  isComponentClass,
  isComponentInstance,
  markAsDeep,
  markAsAutorun,
  markAsWatch,
  registerElementHandler,
  registerMountHandler,
  registerUnmountHandler,
  registerDidUpdateHandler,
  registerRenderHandler,
  registerModelHandler
};