const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const TELEGRAM_TOKEN = '8635077226:AAHr1KO50T4T3s8L8uZYSJHl2s-DoAGq5W4';
const DEEPSEEK_API_KEY = 'sk-d97f1e69ec23435fa2b4a72185c0c8d5';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Привет! Я бот с DeepSeek AI. Напиши мне что-нибудь!');
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Просто напиши мне сообщение, и я отвечу с помощью DeepSeek AI.');
});

bot.on('message', async (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    const chatId = msg.chat.id;
    
    bot.sendChatAction(chatId, 'typing');
    
    try {
      const response = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: msg.text }],
          max_tokens: 1024
        },
        {
          headers: {
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );
      
      const botReply = response.data.choices[0].message.content;
      bot.sendMessage(chatId, botReply);
      
    } catch (error) {
      console.error('Error:', error.message);
      bot.sendMessage(chatId, 'Извини, произошла ошибка при обращении к API.');
    }
  }
});

console.log('Bot started...');
