<template>
  <Loading />
  <router-view v-slot="{ Component }" class="router-view">
    <transition :name="transitionName">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
import { reactive, toRefs, provide, computed, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Loading from '@/components/loading';
import { loadingInit } from '@/utils/loading';

export default {
  components: {
    Loading,
  },
  setup () {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      transitionName: 'slide-left'
    });

    // loading 模块
    loadingInit(useStore);
    const loading = computed(() => store.getters.loading);
    provide('loading', loading);

    router.beforeEach(async (to, from, next) => {
      next();
    });
    return {
      ...toRefs(state),
    };
  }
};
</script>

<style lang="scss">
html,
body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}
#app {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
}
.router-view {
  width: 100%;
  box-sizing: border-box;
}
</style>
