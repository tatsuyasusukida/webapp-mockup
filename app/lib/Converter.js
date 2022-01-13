class Converter {
  async convertTodo (todo) {
    return {
      id: todo.id,
      content: todo.content,
      contentLines: this.splitText(todo.content),
      date: todo.date,
      dateText: this.convertDate(todo.date),
    }
  }

  splitText (str) {
    return str.split('\n')
  }

  convertDate (date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const dayOfTheWeek = '日月火水木金土'[date.getDay()]
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [
      `${year}年${month}月${day}日(${dayOfTheWeek}曜日)`,
      `${hour}時${minute}分${second}秒`,
    ].join(' ')
  }
}

module.exports.Converter = Converter
