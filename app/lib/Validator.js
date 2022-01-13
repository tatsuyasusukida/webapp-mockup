class Validator {
  makeValidationTodo () {
    return {
      ok: null,
      content: this.makeValidationFieldNotEmpty()
    }
  }

  async validateTodo (req) {
    const validation = this.makeValidationTodo()

    validation.content = this.validateFieldNotEmpty(req.body.form.content)
    validation.ok = this.isValidRequest(validation)

    return validation
  }

  makeValidationFieldNotEmpty () {
    return {
      ok: null,
      isNotEmpty: null,
    }
  }

  validateFieldNotEmpty (value) {
    const validationField = this.makeValidationFieldNotEmpty()

    validationField.isNotEmpty = value !== ''
    validationField.ok = this.isValidField(validationField)

    return validationField
  }

  isValidField (validationField) {
    return Object.keys(validationField).every(key => {
      return key === 'ok' || validationField[key]
    })
  }

  isValidRequest (validation) {
    return Object.keys(validation).every(key => {
      return key === 'ok' || validation[key].ok
    })
  }
}

module.exports.Validator = Validator
