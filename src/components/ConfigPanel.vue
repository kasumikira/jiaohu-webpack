<template>
  <div class="config-panel">
    <div class="config-item">
      <label>
        <input type="checkbox" v-model="asyncInput">
        异步输入
      </label>
    </div>
    
    <div class="config-item">
      <label>
        <input type="checkbox" v-model="autoSubmit">
        自动提交
      </label>
    </div>
    
    <div class="config-item">
      <label>
        <input type="checkbox" v-model="autoFill">
        自动填充
      </label>
    </div>

    <div class="config-item">
      <label>
        DeepSeek API Key
        <input type="password" v-model="api">
      </label>
    </div>

    <div class="config-item" v-show="aiWorking">
      AI正在生成数据......
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { initDeepSeek } from '../exercises/utils.js'

export default {
  name: 'ConfigPanel',
  setup() {
    // 创建响应式数据
    const asyncInput = ref(false)
    const autoSubmit = ref(false)
    const autoFill = ref(false)
    const api = ref(window.DEEPSEEK_KEY)
    const aiWorking = ref(false)
    window.isAI = ref(false)
    
    // 从 localStorage 加载保存的设置
    const loadFromStorage = () => {
      if (localStorage.getItem('async_input') !== null) {
        asyncInput.value = localStorage.getItem('async_input') === 'true'
        window.async_input = asyncInput.value
      }
      if (localStorage.getItem('auto_submit') !== null) {
        autoSubmit.value = localStorage.getItem('auto_submit') === 'true'
        window.auto_submit = autoSubmit.value
      }
      if (localStorage.getItem('auto_fill') !== null) {
        autoFill.value = localStorage.getItem('auto_fill') === 'true'
        window.auto_fill = autoFill.value
      }
      if (localStorage.getItem('api') !== null) {
        api.value = localStorage.getItem('api')
        initDeepSeek(api.value)
      }
    }

    // 监听变化并更新配置
    watch(asyncInput, (value) => {
      localStorage.setItem('async_input', value.toString())
      window.async_input = value
    })

    watch(autoSubmit, (value) => {
      localStorage.setItem('auto_submit', value.toString())
      window.auto_submit = value
    })

    watch(autoFill, (value) => {
      localStorage.setItem('auto_fill', value.toString())
      window.auto_fill = value
    })

    watch(api, (value) => {
      initDeepSeek(value)
      localStorage.setItem('api', value)
    })

    watch(window.isAI, (value) => {
      aiWorking.value = value
    })

    // 初始加载保存的设置
    loadFromStorage()

    return {
      asyncInput,
      autoSubmit,
      autoFill,
      api,
      aiWorking
    }
  }
}
</script>

<style scoped>
.config-panel {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: white;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 9999;
}

.config-item {
  margin-bottom: 8px;
}

.config-item label {
  display: block;
  margin-bottom: 4px;
}

.config-item input[type="password"] {
  width: 100px;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.config-item input[type="checkbox"] {
  margin-right: 8px;
}
</style>
