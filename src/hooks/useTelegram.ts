import WebApp from '@twa-dev/sdk';

export const telegram = WebApp;

export function useTelegram() {
  return {
    tg: telegram,
    user: telegram.initDataUnsafe.user,
    colorScheme: telegram.colorScheme,
  };
}
