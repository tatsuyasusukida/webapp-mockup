<template lang="pug">
  include ./partial/form-content

  main
    .container
      h1 ToDoの修正
      nav.mt-3(aria-label='メニュー')
        .d-flex.flex-wrap.gap-2
          a.btn.btn-outline-secondary(href='../') 戻る
      form.mt-3(role='form')
        +form-content
        .d-grid
          button.btn.btn-primary(type='submit' v-on:click.prevent='onClickButtonSubmit') 修正
</template>

<script>
  import FormMixin from '../mixin/form'

  export default {
    mixins: [FormMixin],
    data () {
      return {
        method: 'PUT',
      }
    }
  }
</script>
