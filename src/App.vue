<template>
  <div id="app" style="min-height:100%">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods:{
      mask_hide(){
        this.$store.dispatch('IsWxShare',false);
      }
  }
}
</script>


<style lang="scss">
</style>
