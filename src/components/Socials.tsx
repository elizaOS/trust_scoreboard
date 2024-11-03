import { signIn, signOut, useSession } from 'next-auth/react';
import { FC, useEffect } from 'react';
import styles from './Socials.module.css';

interface SocialButtonProps {
  provider: string;
  isActive?: boolean;
}

const SocialButton: FC<SocialButtonProps> = ({ provider }) => {
  const { data: session, status } = useSession();
  
  useEffect(() => {
    console.log('Session updated:', {
      session,
      status,
      provider,
      account: session?.user?.accounts?.[0]
    });
  }, [session, status, provider]);

  // Check if this provider is the active one
  const isThisProviderActive = session?.user?.accounts?.[0]?.provider === provider.toLowerCase();

  const handleClick = () => {
    if (session) {
      signOut();
    } else {
      signIn(provider.toLowerCase());
    }
  };

  return (
    <div 
      className={`${styles.button} ${isThisProviderActive ? styles.active : ''}`}
      onClick={handleClick}
    >
      <div className={styles.text}>
        {isThisProviderActive 
          ? `Connected to ${provider}` 
          : `Connect with ${provider}`}
      </div>
      {isThisProviderActive && session?.user?.name && (
        <span className={styles.userName}>
          ({session.user.name})
        </span>
      )}
    </div>
  );
};

export const Socials: FC = () => {
  const providers = ['GitHub', 'Discord', 'Twitter'];

  return (
    <div className={styles.socialContainer}>
      {providers.map((provider) => (
        <SocialButton
          key={provider}
          provider={provider}
        />
      ))}
    </div>
  );
};

export default Socials;