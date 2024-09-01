<template>
  <component :is="hideLayout ? 'div' : AppLayout">
    <v-container>
      <h2>创建新文章</h2>
      <v-form>
        <v-row>
          <!-- 标题部分，占 7/10 -->
          <v-col cols="12" md="8">
            <v-text-field v-model="title" label="文章标题" required density="compact" />
          </v-col>
          <!-- 类别部分，占 3/10 -->
          <v-col cols="12" md="4">
            <v-select
              v-model="category"
              :items="categories"
              label="选择类别"
              required
              density="compact"
              chips
              multiple
              clearable
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <MdEditor v-model="text" :style="{ marginBottom: '1em' }" />
          </v-col>
        </v-row>
        <v-btn type="submit" min-width="100px" variant="outlined">发布</v-btn>
        <v-btn :style="{ margin: '1em' }" variant="text">存为云草稿</v-btn>
        <v-btn variant="text">存为本地草稿</v-btn>
      </v-form>
    </v-container>
  </component>
</template>

<script setup lang="ts">
import AppLayout from './AppLayout.vue'
import { ref, computed, defineProps } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const props = defineProps<{
  hideLayout?: boolean
}>()

// 文章标题
const title = ref('')

// 文章类别
const category = ref('')

// 可选的类别
const categories = ref(['技术', '生活', '娱乐', '其他'])

// 编辑器内容
const text = ref(`# 欢迎在 SailSea 发帖！
  
  SailSea 原生支持 Markdown 语法，这让您能够更容易的进行格式排版。
  
  欢迎来到 SailSea！
  删除所有内容，然后开始写作您的文章吧！
  
  !!! note 温馨提示
  您不需要单独写一个 # 大标题，您在上方填写的标题会自动显示在页面顶端。
  !!!`)
</script>
