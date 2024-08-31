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
              <v-form ref="form" v-model="formValid">
                <!-- 登录表单 -->
                <v-form v-if="tab === 0">
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
                  <v-btn @click="login" :disabled="!formValid" color="primary" block>登录</v-btn>
                </v-form>

                <!-- 注册表单 -->
                <v-form v-if="tab === 1">
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
                  <v-btn @click="register" :disabled="!formValid" color="primary" block>注册</v-btn>
                </v-form>
              </v-form>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </AppLayout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import AppLayout from './AppLayout.vue'

const tab = ref(0) // 0 表示登录标签页，1 表示注册标签页

const loginEmail = ref('')
const loginPassword = ref('')
const registerName = ref('')
const registerEmail = ref('')
const registerPassword = ref('')

const formValid = ref(false)

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

// 处理登录
const login = () => {
  if (formValid.value) {
    console.log('Logging in with:', loginEmail.value, loginPassword.value)
  }
}

// 处理注册
const register = () => {
  if (formValid.value) {
    console.log(
      'Registering with:',
      registerName.value,
      registerEmail.value,
      registerPassword.value
    )
  }
}
</script>

<style scoped>
.v-card {
  padding: 20px;
}
</style>
