<template>
  <component :is="hideLayout ? 'div' : AppLayout">
    <v-container>
      <MdPreview v-model="markdownContent" height="400px" />
    </v-container>
  </component>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import AppLayout from './AppLayout.vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const route = useRoute()
const markdownContent = ref<string>('')

const markdownDictionary: { [key: string]: string } = {
  cr: '# 版权信息\n此论坛基于 OpenSailsea 项目，此项目为 Sailsea Forum 的开放版本，此项目开源链接可在 [Github](https://github.com/CycleBai/OpenSailsea) 找到。',
  about: `# 关于此论坛
  
  因为作者的一个想法，直接诞生了本论坛。
  此论坛完全自研，并且开源在 [Github 上的 OpenSailsea](https://github.com/CycleBai/OpenSailsea)`
  // Add more mappings here
}

const pageId = computed(() => route.params.pageId as string)
const hideLayout = computed(() => 'hideLayout' in route.query)

markdownContent.value =
  markdownDictionary[pageId.value] ||
  '# 无法查找的静态页面\n静态页面渲染器内部错误：404 Not Found\n此页面在静态页面映射表中未查询到。\n如果您是手动输入的 Url, 请检查拼写；\n如果您通过链接来到此页，请重试或反馈给我们。'
</script>
