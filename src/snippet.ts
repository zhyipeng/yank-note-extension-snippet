import { Ctx } from '@yank-note/runtime-api'

const StorageKey = 'plugin.snippet'

export interface SnippetItem {
  trigger: string
  content: string
}

export class SnippetManager {
  private static instance: SnippetManager
  private snippets: SnippetItem[] = []
  private ctx: Ctx

  private constructor (private ctx: Ctx) {
    this.ctx = ctx
    this.snippets = ctx.storage.get<SnippetItem[]>(StorageKey, [])
  }

  static getInstance (ctx: Ctx) {
    if (!SnippetManager.instance) {
      SnippetManager.instance = new SnippetManager(ctx)
    }
    return SnippetManager.instance
  }

  getSnippets () {
    return this.snippets
  }

  update (snippets: SnippetItem[]) {
    this.ctx.editor.tapSimpleCompletionItems(items => {
      const keys = {}
      this.snippets.forEach((item) => {
        item.trigger.split(' ').forEach((t) => {
          keys[`/ ${t}`] = true
        })
      })
      const idx = []
      items.forEach((item, i) => {
        if (keys[item.label]) {
          idx.push(i)
        }
      })
      idx.reverse().forEach(i => {
        items.splice(i, 1)
      })
      snippets.forEach((s) => {
        s.trigger.split(' ').forEach((t) => {
          items.push({
            label: `/ ${t}`,
            insertText: s.content,
          })
        })
      })
    })
    this.snippets = snippets.map(s => ({ ...s }))
    this.ctx.storage.set(StorageKey, this.snippets)
  }

  load () {
    this.ctx.editor.tapSimpleCompletionItems(items => {
      this.snippets.forEach((s) => {
        s.trigger.split(' ').forEach((t) => {
          items.push({
            label: `/ ${t}`,
            insertText: s.content,
          })
        })
      })
    })
  }
}
