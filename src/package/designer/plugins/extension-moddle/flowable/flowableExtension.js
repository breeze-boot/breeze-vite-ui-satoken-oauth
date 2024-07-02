'use strict'

import { some } from '@/utils/min-dash.js'

let ALLOWED_TYPES = {
  FailedJobRetryTimeCycle: ['bpmn:StartEvent', 'bpmn:BoundaryEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:Activity'],
  Connector: ['bpmn:EndEvent', 'bpmn:IntermediateThrowEvent'],
  Field: ['bpmn:EndEvent', 'bpmn:IntermediateThrowEvent'],
}

function is(element, type) {
  return element && typeof element.$instanceOf === 'function' && element.$instanceOf(type)
}

function exists(element) {
  return element && element.length
}

function includesType(collection, type) {
  return (
    exists(collection) &&
    some(collection, function (element) {
      return is(element, type)
    })
  )
}

function anyType(element, types) {
  return some(types, function (type) {
    return is(element, type)
  })
}

function isAllowed(propName, propDescriptor, newElement) {
  let name = propDescriptor.name
  let types = ALLOWED_TYPES[name.replace(/flowable:/, '')]

  return name === propName && anyType(newElement, types)
}

export default function FlowableModdleExtension(eventBus) {
  eventBus.on(
    'property.clone',
    function (context) {
      let newElement = context.newElement
      let propDescriptor = context.propertyDescriptor

      this.canCloneProperty(newElement, propDescriptor)
    },
    this,
  )
}

FlowableModdleExtension.$inject = ['eventBus']

FlowableModdleExtension.prototype.canCloneProperty = function (newElement, propDescriptor) {
  if (isAllowed('flowable:FailedJobRetryTimeCycle', propDescriptor, newElement)) {
    return (
      includesType(newElement.eventDefinitions, 'bpmn:TimerEventDefinition') ||
      includesType(newElement.eventDefinitions, 'bpmn:SignalEventDefinition') ||
      is(newElement.loopCharacteristics, 'bpmn:MultiInstanceLoopCharacteristics')
    )
  }

  if (isAllowed('flowable:Connector', propDescriptor, newElement)) {
    return includesType(newElement.eventDefinitions, 'bpmn:MessageEventDefinition')
  }

  if (isAllowed('flowable:Field', propDescriptor, newElement)) {
    return includesType(newElement.eventDefinitions, 'bpmn:MessageEventDefinition')
  }
}
