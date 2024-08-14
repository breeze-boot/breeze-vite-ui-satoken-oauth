<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->

<!-- 测试bpmnViewer -->
<script setup lang="ts">
import { ref } from 'vue'
import ProcessViewer from '@/components/ProcessViewer/index.vue'

defineOptions({
  name: 'bpmnViewer',
  inheritAttrs: false,
})

// do not use same name with ref
const xmlStr = ref<string>(
  '<?xml version="1.0" encoding="UTF-8"?>\n<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:flowable="http://flowable.org/bpmn" id="diagram_Leave" targetNamespace="http://flowable.org/bpmn">\n  <bpmn2:process id="Leave" name="请假" isExecutable="true">\n    <bpmn2:startEvent id="Event_0t5ufq4">\n      <bpmn2:extensionElements>\n        <flowable:formData />\n      </bpmn2:extensionElements>\n      <bpmn2:outgoing>Flow_1w7b586</bpmn2:outgoing>\n    </bpmn2:startEvent>\n    <bpmn2:userTask id="Activity_0ejs02v" name="部门" flowable:formKey="formKey" flowable:assignee="user2">\n      <bpmn2:extensionElements>\n        <flowable:formData />\n      </bpmn2:extensionElements>\n      <bpmn2:incoming>Flow_1w7b586</bpmn2:incoming>\n      <bpmn2:outgoing>Flow_1moq0fm</bpmn2:outgoing>\n    </bpmn2:userTask>\n    <bpmn2:sequenceFlow id="Flow_1w7b586" sourceRef="Event_0t5ufq4" targetRef="Activity_0ejs02v" />\n    <bpmn2:userTask id="Activity_164iv1i" name="人力" flowable:formKey="formKey" flowable:assignee="user1">\n      <bpmn2:extensionElements>\n        <flowable:formData />\n      </bpmn2:extensionElements>\n      <bpmn2:incoming>Flow_1moq0fm</bpmn2:incoming>\n      <bpmn2:outgoing>Flow_1ftru1p</bpmn2:outgoing>\n    </bpmn2:userTask>\n    <bpmn2:sequenceFlow id="Flow_1moq0fm" sourceRef="Activity_0ejs02v" targetRef="Activity_164iv1i" />\n    <bpmn2:endEvent id="Event_0qsgp0o">\n      <bpmn2:incoming>Flow_1ftru1p</bpmn2:incoming>\n    </bpmn2:endEvent>\n    <bpmn2:sequenceFlow id="Flow_1ftru1p" sourceRef="Activity_164iv1i" targetRef="Event_0qsgp0o" />\n  </bpmn2:process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Leave">\n      <bpmndi:BPMNEdge id="Flow_1w7b586_di" bpmnElement="Flow_1w7b586">\n        <di:waypoint x="-322" y="-140" />\n        <di:waypoint x="-270" y="-140" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="Flow_1moq0fm_di" bpmnElement="Flow_1moq0fm">\n        <di:waypoint x="-170" y="-140" />\n        <di:waypoint x="-110" y="-140" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="Flow_1ftru1p_di" bpmnElement="Flow_1ftru1p">\n        <di:waypoint x="-10" y="-140" />\n        <di:waypoint x="52" y="-140" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="Event_0t5ufq4_di" bpmnElement="Event_0t5ufq4">\n        <dc:Bounds x="-358" y="-158" width="36" height="36" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Activity_0ejs02v_di" bpmnElement="Activity_0ejs02v">\n        <dc:Bounds x="-270" y="-180" width="100" height="80" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Activity_164iv1i_di" bpmnElement="Activity_164iv1i">\n        <dc:Bounds x="-110" y="-180" width="100" height="80" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Event_0qsgp0o_di" bpmnElement="Event_0qsgp0o">\n        <dc:Bounds x="52" y="-158" width="36" height="36" />\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn2:definitions>\n',
)
</script>

<template>
  <process-viewer :xml="xmlStr" xml-nodes="{}" />
</template>

<style lang="scss" scoped></style>
