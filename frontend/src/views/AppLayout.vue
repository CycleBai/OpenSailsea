<template>
  <a-layout id="inspire">
    <a-layout-header
      :style="{
        backgroundColor: '#fff',
        padding: '0 50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }"
    >
      <div :style="{ display: 'flex', alignItems: 'center' }">
        <a-avatar :style="{ backgroundColor: '#757575', marginRight: '16px' }" size="32"></a-avatar>
        <h2
          @click="() => router.push('/')"
          :style="{ margin: 0, display: 'flex', alignItems: 'center' }"
        >
          SailSea 讨论
        </h2>
      </div>

      <div :style="{ flex: 1, display: 'flex', justifyContent: 'center' }">
        <a-button v-for="link in links" :key="link" type="link">{{ link }}</a-button>
      </div>

      <div :style="{ display: 'flex', alignItems: 'center', maxWidth: '260px' }">
        <a-input
          ref="searchInput"
          v-model:value="searchQuery"
          placeholder="Search"
          size="large"
          @pressEnter="handleSearch"
        />
      </div>

      <!-- 根据 isAuthenticated 状态渲染不同的内容 -->
      <div v-if="isAuthenticated">
        <a-avatar size="40" :style="{ marginLeft: '16px' }">
          <a-avatar
            :style="{ backgroundColor: '#757575', marginRight: '16px' }"
            size="32"
          ></a-avatar>
        </a-avatar>
      </div>
      <div v-else>
        <a-button type="text" :href="loginLink">登陆</a-button>
        <a-button type="primary" :href="registerLink">注册</a-button>
      </div>
    </a-layout-header>

    <a-layout-content :style="{ backgroundColor: '#f5f5f5', padding: '24px' }">
      <a-row gutter="16">
        <a-col :span="4">
          <a-card :style="{ borderRadius: '8px' }">
            <a-list :bordered="false">
              <a-list-item>
                <a-button type="default" block @click="handleNewPostClick"
                  ><EditOutlined /> 新帖子</a-button
                >
              </a-list-item>

              <a-divider style="margin: 16px 0"></a-divider>

              <a-list-item>
                <a-button type="link">所有分类</a-button>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>

        <a-col :span="20">
          <a-card :style="{ minHeight: '70vh', borderRadius: '8px' }">
            <slot></slot>
          </a-card>
        </a-col>
      </a-row>
    </a-layout-content>

    <!-- NewPost Drawer -->
    <a-drawer
      v-model:visible="drawerVisible"
      title="新帖子"
      placement="bottom"
      :height="drawerHeight"
      :closable="false"
      @close="handleCloseDrawer"
      class="custom-drawer"
    >
      <NewPost :hideLayout="true" />
      <template #extra>
        <a-button @click="openInNewWindow"> 在新窗口打开 </a-button>
        <a-button @click="toggleFullscreen" style="margin-left: 8px">
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </a-button>
      </template>
    </a-drawer>
  </a-layout>
</template>

<script setup lang="ts">
import { EditOutlined } from '@ant-design/icons-vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import NewPost from './NewPost.vue'

const authStore = useAuthStore()
const isAuthenticated = ref(authStore.isAuthenticated)

const links = ['Dashboard', 'Messages', 'Profile', 'Updates']
const router = useRouter()
const route = useRoute()

const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

const loginLink = '/auth/userLogin'
const registerLink = '/auth/userLogin?actions=register'

const drawerVisible = ref(false)
const isFullscreen = ref(false)
const drawerHeight = ref('50%')

const handleSearch = () => {
  const query = searchQuery.value.trim()
  if (query) {
    router.push(`/searchPost/${encodeURIComponent(query)}`)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 'k') {
    event.preventDefault()
    if (searchInput.value) {
      searchInput.value.focus()
    }
  }
}

const handleNewPostClick = () => {
  if (authStore.isAuthenticated) {
    drawerVisible.value = true
  } else {
    router.push(loginLink)
  }
}

const handleCloseDrawer = () => {
  drawerVisible.value = false
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  drawerHeight.value = isFullscreen.value ? '100vh' : '50%'
}

const openInNewWindow = () => {
  window.open('/post/create', '_blank')
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.custom-drawer .ant-drawer-body {
  overflow: hidden;
}

.custom-drawer {
  .ant-drawer-content {
    position: fixed;
    bottom: 0;
    width: 100%;
    border-radius: 0;
  }
}
</style>
