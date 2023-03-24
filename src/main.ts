import { registerPlugin } from '@yank-note/runtime-api'
import SnippetManage from '@/components/SnippetManage.vue'

import { App, createApp } from 'vue'
import { SnippetManager } from '@/snippet'
import i18n from '@/i18n'

const extensionName = __EXTENSION_ID__

registerPlugin({
  name: extensionName,
  register (ctx) {
    const mgr = SnippetManager.getInstance(ctx)
    mgr.load()

    const div = document.createElement('div')
    div.className = 'snippet-pane-container'
    div.style.position = 'absolute'
    div.style.right = '30%'
    div.style.top = '80px'
    div.style.zIndex = '2048'
    div.style.maxWidth = '85%'
    document.querySelector('.content')!.appendChild(div)

    let panel: App | null = null

    function openSnippetManage () {
      div.style.display = 'block'
      if (!panel) {
        panel = createApp(SnippetManage)
        panel.mount(div)
      }
    }

    ctx.statusBar.tapMenus(menus => {
      menus['status-bar-tool']?.list?.push({
        id: extensionName,
        type: 'normal',
        title: i18n.$$t('snippet_title'),
        onClick: openSnippetManage,
      })
    })
  }
})
