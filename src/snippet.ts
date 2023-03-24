import { Ctx } from '@yank-note/runtime-api'

const StorageKey = __EXTENSION_ID__ + '.snippets'
const StorageFile = __EXTENSION_ID__ + '.snippets.json'

export interface SnippetItem {
  trigger: string
  content: string
}

export class SnippetManager {
  private static instance: SnippetManager
  private snippets: SnippetItem[] = []
  private userFileSupport = false

  private constructor (private ctx: Ctx) {
    this.userFileSupport = !!((this.ctx.api as any).readUserFile)
    this.readSnippets().then(snippets => {
      this.snippets = snippets
    })
  }

  static getInstance (ctx: Ctx) {
    if (!SnippetManager.instance) {
      SnippetManager.instance = new SnippetManager(ctx)
    }
    return SnippetManager.instance
  }

  private async readSnippets () {
    if (!this.userFileSupport) {
      return this.ctx.storage.get<SnippetItem[]>(StorageKey, [])
    }

    try {
      const content = await (this.ctx.api as any).readUserFile(StorageFile).then((r: any) => r.text())
      return JSON.parse(content)
    } catch (e) {
      // 文件不存在，读取本地存储并写入，迁移到新的存储方式
      if (e.message.includes('ENOENT')) {
        const snippets = this.ctx.storage.get<SnippetItem[]>(StorageKey, [])
        this.writeSnippets(snippets)
        this.ctx.storage.remove(StorageKey)
        return snippets
      }

      throw e
    }
  }

  private writeSnippets (snippets: SnippetItem[]) {
    if (this.userFileSupport) {
      (this.ctx.api as any).writeUserFile(StorageFile, JSON.stringify(snippets))
    } else {
      this.ctx.storage.set(StorageKey, snippets)
    }
  }

  getSnippets () {
    return this.snippets
  }

  update (snippets: SnippetItem[]) {
    this.snippets = snippets.map(s => ({ ...s })).filter(s => s.trigger.trim() && s.content)
    this.writeSnippets(this.snippets)
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
