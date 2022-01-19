export default {
  data () {
    return {
      api: `/api/v1${window.location.pathname}`,
      method: 'POST',
    }
  },

  methods: {
    async onClickButtonSubmit () {
      try {
        const options = this.makeOptions()
        const response = await fetch(this.api + 'submit', options)
        const body = await response.json()

        if (body.ok) {
          window.location.assign(body.redirect)
          return
        }
      } catch (err) {
        this.onError(err)
        throw err
      }
    },

    makeOptions () {
      return {
        method: 'DELETE',
      }
    },

    onError (err) {
      console.error(err.message)
      console.debug(err.stack)
    },
  },
}
