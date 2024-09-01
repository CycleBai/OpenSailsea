<template>
  <AppLayout>
    <a-row justify="center" align="middle" style="height: 100vh">
      <a-col :span="24" :md="12" :lg="8">
        <a-card>
          <a-tabs v-model:activeKey="tab" type="card">
            <a-tab-pane key="0" tab="登录">
              <!-- 登录表单 -->
              <a-form :form="loginForm" @finish="handleLogin" :validateMessages="validateMessages">
                <a-form-item name="email" label="电子邮件" :rules="emailRules">
                  <a-input v-model:value="loginEmail">
                    <template #prefix>
                      <a-icon type="mail" />
                    </template>
                  </a-input>
                </a-form-item>
                <a-form-item name="password" label="密码" :rules="passwordRules">
                  <a-input-password v-model:value="loginPassword">
                    <template #prefix>
                      <a-icon type="lock" />
                    </template>
                  </a-input-password>
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" html-type="submit" block>登录</a-button>
                </a-form-item>
              </a-form>
            </a-tab-pane>
            <a-tab-pane key="1" tab="注册">
              <!-- 注册表单 -->
              <a-form
                :form="registerForm"
                @finish="handleRegister"
                :validateMessages="validateMessages"
              >
                <a-form-item name="name" label="用户名" :rules="nameRules">
                  <a-input v-model:value="registerName">
                    <template #prefix>
                      <a-icon type="user" />
                    </template>
                  </a-input>
                </a-form-item>
                <a-form-item name="email" label="电子邮件" :rules="emailRules">
                  <a-input v-model:value="registerEmail">
                    <template #prefix>
                      <a-icon type="mail" />
                    </template>
                  </a-input>
                </a-form-item>
                <a-form-item name="password" label="密码" :rules="passwordRules">
                  <a-input-password v-model:value="registerPassword">
                    <template #prefix>
                      <a-icon type="lock" />
                    </template>
                  </a-input-password>
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" html-type="submit" block>注册</a-button>
                </a-form-item>
              </a-form>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>

    <!-- Ant Design Vue Notification -->
    <a-notification
      v-if="snackbar.show"
      :message="snackbar.message"
      :type="snackbar.color"
      placement="topRight"
      @close="snackbar.show = false"
    >
      <a-progress :percent="progress" show-info="false" stroke-color="white" style="opacity: 0.3" />
    </a-notification>
  </AppLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AppLayout from './AppLayout.vue'
import { Form } from 'ant-design-vue'

// 配置提示字典
const messageDict: Record<string, string> = {
  '401': '您访问的页面需要登录后访问。',
  default: '发生错误，请稍后重试。'
}

const tab = ref('0') // 0 表示登录标签页，1 表示注册标签页

const loginEmail = ref('')
const loginPassword = ref('')
const registerName = ref('')
const registerEmail = ref('')
const registerPassword = ref('')

// 验证状态
const loginForm = Form.useForm()[0]
const registerForm = Form.useForm()[0]

// 验证规则
const emailRules = [{ required: true, message: '请输入有效的电子邮件地址' }, { type: 'email' }]

const passwordRules = [{ required: true, message: '密码长度至少为6个字符' }, { min: 6 }]

const nameRules = [{ required: true, message: '用户名不能为空' }]

const validateMessages = {
  required: '${label} 是必填项!',
  types: {
    email: '${label} 不是有效的电子邮件!'
  },
  string: {
    min: '${label} 长度至少为 ${min} 个字符!'
  }
}

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
const handleLogin = async (values: any) => {
  if (loginForm.validateFields()) {
    const authStore = useAuthStore()
    authStore.login()
    const { redirect } = useRouter().currentRoute.value.query
    useRouter().push(redirect || '/')
  }
}

// 处理注册
const handleRegister = async (values: any) => {
  if (registerForm.validateFields()) {
    const authStore = useAuthStore()
    authStore.login() // 你可以在这里调用注册 API
    const { redirect } = useRouter().currentRoute.value.query
    useRouter().push(redirect || '/')
  }
}

// 页面加载时检查用户是否已登录
onMounted(() => {
  const { code, actions } = useRouter().currentRoute.value.query
  const redirect = useRouter().currentRoute.value.query.redirect as string

  if (actions === 'register') {
    tab.value = '1'
  } else {
    tab.value = '0'
  }

  if (useAuthStore().isAuthenticated) {
    // 如果已经登录且有指定的跳转位置，则跳转到该位置
    if (redirect) {
      useRouter().push(redirect)
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
.a-card {
  padding: 20px;
}
</style>
