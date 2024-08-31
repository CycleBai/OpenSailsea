<template>
  <AppLayout>
    <v-container>
      <h2>{{ keyword }} 的搜索结果：</h2>
      <v-list>
        <v-list-item-group v-if="results.length">
          <v-list-item
            v-for="result in results"
            :key="result.id"
            :class="{ clicked: clickedResults.includes(result.id) }"
            @click="handleClick(result.id, result.link)"
          >
            <v-list-item-content>
              <v-list-item-title v-html="highlightKeyword(result.title)"></v-list-item-title>
              <v-list-item-subtitle
                class="description"
                v-html="highlightKeyword(result.description)"
              ></v-list-item-subtitle>
              <v-list-item-footer class="footer">
                <div class="author-date">
                  <span class="author">{{ result.author }}</span>
                  <span class="date">{{ result.date }}</span>
                </div>
              </v-list-item-footer>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-list-item v-else>
          <v-list-item-content>没有找到相关结果</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from './AppLayout.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

const keyword = route.params.keyword
const results = ref<any[]>([])
const clickedResults = ref<number[]>([])

onMounted(async () => {
  // 示例代码，实际情况下需要替换为实际的 API 调用
  results.value = await fetchSearchResults(keyword)
})

async function fetchSearchResults(keyword: string) {
  // 这里用伪代码表示从 API 获取搜索结果
  return [
    {
      id: 1,
      title: '结果 1',
      description: '这是结果 1 的描述内容。描述内容过长时会自动裁剪显示...',
      author: '作者 1',
      date: '2024-08-31'
    },
    {
      id: 2,
      title: '结果 2',
      description: '这是结果 2 的描述内容。描述内容过长时会自动裁剪显示...',
      author: '作者 2',
      date: '2024-08-30'
    },
    {
      id: 3,
      title: '结果 3',
      description: '这是结果 3 的描述内容。描述内容过长时会自动裁剪显示...',
      author: '作者 3',
      date: '2024-08-29'
    }
  ]
}

function handleClick(id: number, link: string) {
  clickedResults.value.push(id)
  router.push(link)
}

function highlightKeyword(text: string) {
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}
</script>

<style scoped>
/* 基本样式 */
.v-list-item {
  cursor: pointer;
}

/* 已点击的标题 */
.clicked .v-list-item-title {
  color: #6a0dad; /* 紫色 */
}

/* 未点击的标题 */
.v-list-item-title {
  color: #1a73e8; /* 蓝色 */
}

/* 高亮关键词 */
.highlight {
  color: #f00; /* 红色 */
}

/* 描述样式 */
.description {
  max-height: 4.5em; /* 3 行文本高度 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

/* 作者和日期样式 */
.footer {
  margin-top: 8px;
}

.author-date {
  display: flex;
  justify-content: flex-start;
  font-size: 0.875rem;
  color: #666; /* 灰色 */
}

.author-date .author {
  margin-right: 8px; /* 添加间距以分隔作者和日期 */
}
</style>
