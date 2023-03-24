import { Ctx } from '@yank-note/runtime-api'

const StorageKey = __EXTENSION_ID__ + '.snippets'

export interface SnippetItem {
  trigger: string
  content: string
}

export class SnippetManager {
  private static instance: SnippetManager
  private snippets: SnippetItem[] = []

  private constructor (private ctx: Ctx) {
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
