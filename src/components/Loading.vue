<template>
  <div class="h-screen flex items-center justify-center">
    <vue-loading
      type="spiningDubbles"
      color="#3ED598"
      :size="{ width: '100px', height: '100px' }"
    />
  </div>
</template>

<script>
import { VueLoading } from "vue-loading-template"

export default {
  components: {
    VueLoading,
  },
}
</script>
