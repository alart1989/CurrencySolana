This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

# Token Transfer DApp

## Описание
Этот проект представляет собой децентрализованное приложение (DApp) для отправки токенов и SOL в сети Solana. Поддерживает работу с обычными токенами SPL и SOL. Предположительно разработан для офлайн обмена токенов

## Функционал
- Подключение Solana-кошелька через `@solana/wallet-adapter-react` 
- Отправка SOL
- Отправка токенов SPL
- Автоматическое создание ATA (Associated Token Account) для получателя, если его нет
- Уведомления о статусе транзакции через `react-toastify`

## Установка и запуск
### 1. Клонирование репозитория
```sh
git https://github.com/web3dev86/swapSol.git
cd swapSol


### 2. Установка зависимостей
```sh
npm install
```
или
```sh
yarn install
```

### 3. Настройка переменных окружения
Создайте `.env.local` файл и добавьте:
```
Тестовая сеть
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com 
Основная сеть
Регистрируемся на https://www.quicknode.com/ создаем подключение к солана сети и указываем АПИ
Пример
NEXT_PUBLIC_SOLANA_RPC_URL=https://powerful-floral-dew.solana-mainnet.quiknode.pro/Ваш_токен/ 
```
 
### 4. Запуск проекта
```sh
npm run dev
```
или
```sh
yarn dev
```

## Использование
1. \app\contracts\wallet.ts укажите адрес получателя токенов
2. Подключите кошелек (например, Phantom, Solflare)
3. Введите адрес токена (или выберете из селектора), сумму для отправки и нажмите кнопку "Отправить"
4. Токен прийдет на Ваш кошелек


## Разработка
Основные технологии:
- `Next.js 15`
- `TypeScript`
- `@solana/web3.js`
- `@solana/spl-token`
- `@solana/wallet-adapter-react`


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
