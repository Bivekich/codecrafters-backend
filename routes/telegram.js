const express = require('express')

const TELEGRAM_BOT_TOKEN = '7397475236:AAGQRPZyTNq2zcOFW6HNII2ugFNGOcaVj7s'
const TELEGRAM_CHAT_ID = '5379725422'

const createTelegramRoutes = (db) => {
  const router = express.Router()

  router.post('/', async (req, res) => {
    const { userName } = req.body

    if (!userName) {
      return res.status(400).send('Не заполнено поле: Имя пользователя')
    }

    const text = `Новая заявка\n\nИмя пользователя: ${userName}`

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    const params = {
      chat_id: TELEGRAM_CHAT_ID,
      text: text
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })

      if (response.ok) {
        res.status(200).send('Сообщение отправлено успешно')
      } else {
        const errorData = await response.json()
        res.status(response.status).send(`Ошибка при отправлении сообщения: ${errorData.description}`)
      }
    } catch (error) {
      res.status(500).send(`Ошибка: ${error.message}`)
    }

  })

  return router
}

module.exports = createTelegramRoutes