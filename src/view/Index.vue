<template>
  <Suspense>
    <template #default>
      <Index></Index>
    </template>

    <!-- 加载完成前的载入动画 -->
    <template #fallback>
      <div class="window">
        <Loading class="winLoad"></Loading>
      </div>
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import Loading from "@/components/loading/loading.vue";
//Suspense要异步引入组件
const Index = defineAsyncComponent(
  () => import("@/components/index/Index.vue")
);
</script>

<style scoped lang="less">
//让加载动画居中显示
.window {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
