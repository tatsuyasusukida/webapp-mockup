export default {
  data () {
    return {
      api: `/api/v1${window.location.pathname}`,
      method: 'POST',
      body: null,
    }
  },

  methods: {
    async initialize () {
      try {
        const response = await fetch(this.api + 'initialize')
        this.body = await response.json()
      } catch (err) {
        this.onError(err)
        throw err
      }
    },

    async onClickButtonSubmit () {
      try {
        const options = this.makeOptions()
        const response = await fetch(this.api + 'validate', options)
        const body = await response.json()

        this.body.validation = body.validation

        if (body.validation.ok) {
          const options = this.makeOptions()
          const response = await fetch(this.api + 'submit', options)
          const body = await response.json()

          if (body.ok) {
            window.location.assign(body.redirect)
            return
          }
        } else {
          window.location.assign('#page-top')
        }
      } catch (err) {
        this.onError(err)
        throw err
      }
    },

    makeOptions () {
      return {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({form: this.body.form}),
      }
    },

    onError (err) {
      console.error(err.message)
      console.debug(err.stack)
    },
  },
}
