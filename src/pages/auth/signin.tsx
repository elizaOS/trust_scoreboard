import { signIn } from 'next-auth/react';
import Image from 'next/image';
import styles from './signin.module.css';
import { useEffect } from 'react';

export default function SignIn() {
  const handleDiscordSignIn = () => {
    signIn('discord', { callbackUrl: '/' });
  };

  useEffect(() => {
    // Create and inject the Telegram login button
    const telegramContainer = document.getElementById('telegram-login-container');
    if (telegramContainer && !telegramContainer.hasChildNodes()) {
      const script = document.createElement('script');
      script.async = true;
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute('data-telegram-login', 'AI16ZBot');
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-radius', '14');
      script.setAttribute('data-onauth', 'window.onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      telegramContainer.appendChild(script);
    }

    // Define the auth callback
    window.onTelegramAuth = (user: any) => {
      console.log('Telegram auth:', user);
      signIn('credentials', {
        id: user.id,
        username: user.username,
        hash: user.hash,
        callbackUrl: '/',
      });
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Connect your profile</h1>
      
      <div className={styles.buttonContainer}>
        <button 
          onClick={handleDiscordSignIn}
          className={styles.discordButton}
        >
          <Image 
            src="/discord-mark-white.svg" 
            alt="Discord" 
            width={24} 
            height={24} 
          />
          Connect to Discord
        </button>

        <div id="telegram-login-container" className={styles.telegramContainer} />
      </div>
    </div>
  );
}

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}
