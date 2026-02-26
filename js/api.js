/* ==================== API MODULE ==================== */
/* Отвечает за все HTTP-запросы к внешним системам */

const API = {
  /**
   * Авторизация через хук
   * @param {Object} userData - Данные пользователя из Telegram
   * @returns {Promise<Array|null>} Массив пользователей или null
   */
  async authorize(userData) {
    const hookUrl = 'https://quumahienot.beget.app/webhook/lk-ps';
    const payload = {
      date: "auth",
      user_id: userData?.id || null,
      username: userData?.username || null,
      first_name: userData?.first_name || null,
      last_name: userData?.last_name || null
    };

    try {
      console.log('📤 [API] Отправляем запрос авторизации:', payload);
      
      const response = await fetch(hookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ [API] Ответ от хука:', result);
      return result;

    } catch (error) {
      console.error('❌ [API] Ошибка авторизации:', error);
      return null;
    }
  },

  /**
   * Отправка данных QR-кода в вебхук
   * @param {string} qrData - Строка из QR-кода (обычно URL)
   * @param {Object} userData - Данные пользователя из Telegram
   * @returns {Promise<boolean>}
   */
  async sendQrData(qrData, userData) {
    const hookUrl = 'https://quumahienot.beget.app/webhook/lk-ps';
    const userDataWithoutPhoto = Object.fromEntries(
      Object.entries(userData || {}).filter(
        ([key]) => !['photo_url', 'photo', 'avatar', 'avatar_url'].includes(key)
      )
    );

    const payload = {
      date: "qr",
      qr_data: qrData,
      user_id: userData?.id || null,
      username: userData?.username || null,
      first_name: userData?.first_name || null,
      last_name: userData?.last_name || null,
      tg_user: userDataWithoutPhoto
    };

    try {
      console.log('📤 [API] Отправляем QR в вебхук:', payload);
      
      const response = await fetch(hookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('✅ [API] QR успешно отправлен');
      return true;

    } catch (error) {
      console.error('❌ [API] Ошибка отправки QR:', error);
      return false;
    }
  }
};

// Экспортируем модуль
window.API = API;
