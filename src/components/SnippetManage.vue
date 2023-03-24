<template>
  <div class="ext-container">
    <h3>{{ i18n.$t.value('snippet_title') }}</h3>
    <span class="snippet-desc">{{ i18n.$t.value('snippet_desc') }}</span>
    <ul class="snippet-list">
      <li class="snippet-row">
        <div class="trigger description">
          {{ i18n.$t.value('trigger_desc') }}
        </div>
        <div class="content description">
          {{ i18n.$t.value('content_desc') }}
        </div>
      </li>
      <li v-for="(item, idx) in snippets" :key="idx" class="snippet-row">
        <div class="trigger">
          <input type="text" v-model="item.trigger" @change="saveSnippets">
        </div>
        <div class="content">
          <textarea v-model="item.content" @change="saveSnippets" style="resize: vertical"></textarea>
        </div>
        <div class="operation">
          <button class="del-btn" @click="delItem(idx)">✖</button>
        </div>
      </li>
    </ul>
    <div class="operation-bar">
      <button @click="addNew">{{ i18n.$t.value('btn_new') }}</button>
      <button @click="closePane">{{ i18n.$t.value('btn_close') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ctx } from '@yank-note/runtime-api'
import { SnippetItem, SnippetManager } from '@/snippet'
import i18n from '@/i18n'

const snippets = ref<SnippetItem[]>([])

const mgr = SnippetManager.getInstance(ctx)

const addNew = () => {
  snippets.value.push({
    trigger: '',
    content: '',
  })
}

const loadSnippets = () => {
  snippets.value = mgr.getSnippets().map((item) => ({ ...item }))
}

const saveSnippets = (e?: Event) => {
  console.debug('save snippets', snippets.value, e)
  setTimeout(() => {
    mgr.update(snippets.value)
  }, 500)
}

const delItem = (idx: number) => {
  snippets.value.splice(idx, 1)
  saveSnippets()
}

const closePane = () => {
  const div = document.querySelector<HTMLElement>('.snippet-pane-container')
  if (div) {
    div.style.display = 'none'
  }
}

onMounted(loadSnippets)
</script>

<style lang="scss" scoped>
.ext-container {
  padding: 10px 30px;
  width: 700px;
  background: rgba(var(--g-color-85-rgb), 0.8);
  backdrop-filter: var(--g-backdrop-filter);
  color: var(--g-color-10);
}

.snippet-list {
  list-style: none;
  max-height: 800px;
  overflow: auto;
  border-top: 2px solid var(--g-color-10);
  padding: 15px 0 0;
  margin: 10px 0 0;
}

.snippet-row {
  display: flex;
  margin-bottom: 10px;
}

.trigger {
  width: 100px;
}

.content {
  margin-left: 10px;
  flex-grow: 2;
}

.operation {
  margin-left: 10px;
}

.operation-bar {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}

.description {
  font-size: 0.8rem;
  text-align: center;
}

.snippet-desc {
  font-size: 0.8rem;
}
</style>
