<template>
  <v-app id="inspire">
    <v-app-bar flat>
      <v-container class="mx-auto d-flex align-center justify-center">
        <v-avatar class="me-4" color="grey-darken-1" size="32"></v-avatar>
        <h2>SailSea 讨论</h2>

        <v-spacer></v-spacer>

        <v-btn v-for="link in links" :key="link" :text="link" variant="text"></v-btn>

        <v-spacer></v-spacer>

        <v-responsive max-width="260">
          <v-text-field
            ref="searchField"
            density="compact"
            label="Search"
            rounded="lg"
            variant="solo-filled"
            flat
            hide-details
            single-line
            @keydown.enter="handleSearch"
          ></v-text-field>
        </v-responsive>

        <v-btn href="/auth/userLogin">登陆</v-btn>
        <v-btn min-width="50" href="/auth/userLogin?actions=register">注册</v-btn>
      </v-container>
    </v-app-bar>

    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-sheet rounded="lg">
              <v-list rounded="lg">
                <v-list-item>
                  <v-btn variant="outlined" prepend-icon="mdi-pencil" block>新帖子</v-btn>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item link>所有分类</v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col>
            <v-sheet min-height="70vh" rounded="lg">
              <slot></slot>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const links = ['Dashboard', 'Messages', 'Profile', 'Updates']
const searchField = ref<HTMLElement | null>(null)
const router = useRouter()
const route = useRoute()
const isSearching = ref(false) // 状态标志

const handleKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 'k') {
    event.preventDefault()
    searchField.value?.focus()
  }
}

const handleSearch = () => {
  if (isSearching.value) return // 防止双击回车

  isSearching.value = true
  setTimeout(() => {
    const query = (searchField.value as HTMLInputElement).value
    if (query) {
      const newPath = `/searchPost/${encodeURIComponent(query)}`
      if (route.path.startsWith('/searchPost/')) {
        // Use new URL to refresh the page
        window.location.href = newPath
      } else {
        router.replace(newPath)
      }
    }
    isSearching.value = false
  }, 100) // 延迟执行
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
