<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef } from 'vue'
import useSettingStore from '@/store/modules/setting.ts'
import { uploadMinioS3 } from '@/api/system/file'
import { FileParam } from '@/api/system/file/type.ts'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IDomEditor } from '@wangeditor/editor'
import { i18nChangeLanguage } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'

defineOptions({
  name: 'WangEditor',
  inheritAttrs: false,
})

const props = defineProps({
  modelValue: {
    type: [String],
    default: '',
  },
  bizType: {
    type: String,
    default: 'wangEditor',
  },
})

/**
 * 当前语言
 */
const language = computed(() => {
  return useSettingStore().settings.language === 'zhCn' ? 'zh-CN' : 'en'
})

/**
 * 切换语言 - 'en' 或者 'zh-CN'
 */
i18nChangeLanguage(language.value)

// 创建编辑器...
// const $emit = defineEmits(['update:modelValue'])

const editorRef = shallowRef() // 编辑器实例，必须用 shallowRef
const mode = ref('default') // 编辑器模式
const toolbarConfig = ref({}) // 工具条配置
// 编辑器配置
const editorConfig = ref({
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      // 自定义图片上传
      async customUpload(file: any, insertFn: any) {
        const fileParam: FileParam = {
          bizType: props.bizType,
          title: '富文本',
        }
        uploadMinioS3(file, fileParam).then((response: any) => {
          const url = response.data.url
          insertFn(url)
        })
      },
    },
  },
})

// 编辑器回调函数
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
const handleChange = (editor: IDomEditor) => {
  console.log('change:', editor.getHtml())
}
const handleDestroyed = (editor: IDomEditor) => {
  console.log('destroyed', editor)
}
const handleFocus = (editor: IDomEditor) => {
  console.log('focus', editor)
}
const handleBlur = (editor: IDomEditor) => {
  console.log('blur', editor)
}
const customAlert = (info: string, type: string) => {
  alert(`【自定义提示】${type} - ${info}`)
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<template>
  <div>
    <div style="border: 1px solid #ccc; margin-top: 10px">
      <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" style="border-bottom: 1px solid #ccc" />
      <Editor
        :defaultConfig="editorConfig"
        :mode="mode"
        v-model="props.modelValue"
        style="height: 400px; overflow-y: hidden"
        @onCreated="handleCreated"
        @onChange="handleChange"
        @onDestroyed="handleDestroyed"
        @onFocus="handleFocus"
        @onBlur="handleBlur"
        @customAlert="customAlert"
      />
    </div>
    <div style="margin-top: 10px">
      <textarea v-model="props.modelValue" readonly style="width: 100%; height: 200px; outline: none"></textarea>
    </div>
  </div>
</template>
