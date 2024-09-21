<template>
  <div>{{ message }}</div>
</template>

<script setup lang="go">
import (
  "github.com/sgielen/vue-plugin-go/vue"
)

func setup() vue.SetupContext {
  message := vue.Ref("Hello, Go within Vue!")
  return vue.SetupContext{
    "message": message,
  }
}
</script>

<style scoped>
div {
  color: blue;
}
</style>

