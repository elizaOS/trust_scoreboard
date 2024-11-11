import { FC, useState } from 'react';
import Image from 'next/image';
import styles from './index.module.css';

const ElizaView: FC = () => {
  const [characterName, setCharacterName] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState('Manager');
  const [selectedSkills, setSelectedSkills] = useState(['Post']);

  return (
    <div className={styles.container}>
      <div className={styles.createSection}>
        <h1 className={styles.title}>Create an NPC</h1>
        <p className={styles.subtitle}>Deploy and run your own NPC for your community</p>
        
        <div className={styles.avatarUpload}>
          <div className={styles.uploadButton}>
            <span>+</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Name</label>
          <input 
            type="text" 
            placeholder="Character Name"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Personality</label>
          <div className={styles.buttonGroup}>
            <button 
              className={`${styles.button} ${selectedPersonality === 'Manager' ? styles.selected : ''}`}
              onClick={() => setSelectedPersonality('Manager')}
            >
              Manager
            </button>
            <button className={styles.button} disabled>Member</button>
            <button className={styles.button} disabled>Moderator</button>
          </div>
          <span className={styles.helperText}>Custom personalities coming soon.</span>
        </div>

        <div className={styles.formGroup}>
          <label>X/Twitter Skills</label>
          <div className={styles.buttonGroup}>
            <button 
              className={`${styles.button} ${selectedSkills.includes('Post') ? styles.selected : ''}`}
              onClick={() => setSelectedSkills(['Post'])}
            >
              Post
            </button>
            <button className={styles.button} disabled>Generate Images</button>
            <button className={styles.button} disabled>Reply</button>
            <button className={styles.button} disabled>Direct Message</button>
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.button} disabled>Follow/Unfollow</button>
            <button className={styles.button} disabled>Block</button>
          </div>
          <div className={styles.accountSection}>
            <button className={styles.disconnectButton}>Disconnect</button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Telegram Skills</label>
          <button className={styles.connectButton}>Connect Account</button>
        </div>

        <button className={styles.publishButton}>
          Publish (1 SOL)
        </button>
      </div>

      <div className={styles.previewSection}>
        <div className={styles.previewCard}>
          <div className={styles.previewAvatar}>
            <Image 
              src="/default-profile.png" 
              alt="NPC Avatar" 
              width={80} 
              height={80}
            />
          </div>
          <h2 className={styles.previewTitle}>Default NPC</h2>
          <p className={styles.previewDescription}>
            I will manage your community, and respond to questions.
          </p>
          
          <div className={styles.previewSocials}>
            <h3>Socials</h3>
            <div className={styles.socialButtons}>
              <button className={styles.socialButton}>
                <Image src="/twitter.svg" alt="Twitter" width={16} height={16} />
                @npc
              </button>
              <button className={styles.socialButton}>
                <Image src="/twitter.svg" alt="Twitter" width={16} height={16} />
                @npc
              </button>
              <button className={styles.socialButton}>
                <Image src="/twitter.svg" alt="Twitter" width={16} height={16} />
                @npc
              </button>
            </div>
          </div>

          <div className={styles.previewSkills}>
            <h3>Skills</h3>
            <div className={styles.skillButtons}>
              <button className={styles.skillButton}>Respond</button>
              <button className={styles.skillButton}>Generate Images</button>
              <button className={styles.skillButton}>Post</button>
              <button className={styles.skillButton}>Manage Wallet</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElizaView; 