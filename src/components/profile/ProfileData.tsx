import { FC } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import styles from './ProfileData.module.css';

export const ProfileData: FC = () => {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        {session?.user?.image && (
          <div className={styles.imageContainer}>
            <Image
              src={session.user.image}
              alt="Profile"
              width={68}
              height={68}
              className={styles.profileImage}
              priority
              unoptimized
            />
          </div>
        )}
        <div className={styles.userInfo}>
          <h1 className={styles.userName}>
            {session?.user?.name || 'Anonymous'}
          </h1>
          <span className={styles.userRole}>Partner</span>
        </div>
        <button 
          onClick={handleSignOut}
          className={styles.signOutButton}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileData; 