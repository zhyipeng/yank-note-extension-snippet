import { ctx } from '@yank-note/runtime-api'

export default ctx.i18n.createI18n({
  en: {
    snippet_title: 'Snippet',
    snippet_desc: 'Type / + trigger word to trigger completion',
    trigger_desc: 'Trigger word, can separate multiple with spaces',
    content_desc: 'Fill in text content',
    btn_new: 'New',
    btn_close: 'Close',
  },
  'zh-CN': {
    snippet_title: '文本片段',
    snippet_desc: '输入 / + 触发词 触发补全',
    trigger_desc: '触发词, 可用空格分隔多个',
    content_desc: '填充文本内容',
    btn_new: '新增',
    btn_close: '关闭',
  },
})
