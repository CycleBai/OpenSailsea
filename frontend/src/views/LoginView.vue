<template>
  <AppLayout>
    <v-container>
      <v-row class="d-flex justify-center align-center" style="height: 100vh">
        <v-col cols="12" sm="8" md="6">
          <v-card>
            <v-tabs v-model="tab" background-color="primary" dark slider-color="white">
              <v-tab>登录</v-tab>
              <v-tab>注册</v-tab>
            </v-tabs>

            <v-card-subtitle>
              <!-- 登录表单 -->
              <v-form ref="loginForm" v-model="loginFormValid" v-if="tab === 0">
                <v-text-field
                  v-model="loginEmail"
                  label="电子邮件"
                  prepend-icon="mdi-email"
                  type="email"
                  :rules="[emailRule]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="loginPassword"
                  label="密码"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="[passwordRule]"
                  required
                ></v-text-field>
                <v-btn @click="login" :disabled="!loginFormValid" color="primary" block>登录</v-btn>
              </v-form>

              <!-- 注册表单 -->
              <v-form ref="registerForm" v-model="registerFormValid" v-if="tab === 1">
                <v-text-field
                  v-model="registerName"
                  label="用户名"
                  prepend-icon="mdi-account"
                  :rules="[nameRule]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="registerEmail"
                  label="电子邮件"
                  prepend-icon="mdi-email"
                  type="email"
                  :rules="[emailRule]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="registerPassword"
                  label="密码"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="[passwordRule]"
                  required
                ></v-text-field>
                <v-btn @click="register" :disabled="!registerFormValid" color="primary" block
                  >注册</v-btn
                >
              </v-form>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Vuetify Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" top right>
      {{ snackbar.message }}
      <template v-slot:bottom>
        <v-progress-linear
          :value="progress"
          height="3"
          color="white"
          class="ma-0"
          style="opacity: 0.3"
        ></v-progress-linear>
      </template>
    </v-snackbar>
  </AppLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AppLayout from './AppLayout.vue'

// 配置提示字典
const messageDict: Record<string, string> = {
  '401': '您访问的页面需要登录后访问。',
  default: '发生错误，请稍后重试。'
}

const tab = ref(0) // 0 表示登录标签页，1 表示注册标签页

const loginEmail = ref('')
const loginPassword = ref('')
const registerName = ref('')
const registerEmail = ref('')
const registerPassword = ref('')

// 验证状态
const loginFormValid = ref(false)
const registerFormValid = ref(false)

// 验证规则
const emailRule = (value: string) => {
  return /.+@.+\..+/.test(value) || '请输入有效的电子邮件地址'
}

const passwordRule = (value: string) => {
  return value.length >= 6 || '密码长度至少为6个字符'
}

const nameRule = (value: string) => {
  return value.length > 0 || '用户名不能为空'
}

// 路由和认证存储
const router = useRouter()
const authStore = useAuthStore()

// Snackbar 状态
const snackbar = ref({
  show: false,
  message: '',
  color: 'success' // 默认颜色，可根据需要调整
})

const progress = ref(100) // 进度条初始值

// 显示提示消息
const showMessage = (code: string) => {
  snackbar.value.message = messageDict[code] || messageDict['default']
  snackbar.value.color = code === '401' ? 'error' : 'success' // 根据 code 设置颜色
  snackbar.value.show = true

  // 进度条自动关闭
  progress.value = 100
  const interval = setInterval(() => {
    progress.value -= 100 / 3
    if (progress.value <= 0) {
      clearInterval(interval)
      snackbar.value.show = false
    }
  }, 1000)
}

// 处理登录
const login = async () => {
  if (loginFormValid.value) {
    authStore.login()
    const { redirect } = router.currentRoute.value.query
    router.push(redirect || '/')
  }
}

// 处理注册
const register = async () => {
  if (registerFormValid.value) {
    authStore.login() // 你可以在这里调用注册 API
    const { redirect } = router.currentRoute.value.query
    router.push(redirect || '/')
  }
}

// 页面加载时检查用户是否已登录
onMounted(() => {
  const { code, actions } = router.currentRoute.value.query
  const redirect = router.currentRoute.value.query.redirect as string

  if (actions === 'register') {
    tab.value = 1
  } else {
    tab.value = 0
  }

  if (authStore.isAuthenticated) {
    // 如果已经登录且有指定的跳转位置，则跳转到该位置
    if (redirect) {
      router.push(redirect)
    }
    // 如果没有指定的跳转位置，则不进行跳转
  } else {
    if (code) {
      showMessage(code as string)
    }
  }
})
</script>

<style scoped>
.v-card {
  padding: 20px;
}
</style>
