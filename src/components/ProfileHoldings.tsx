import type { NextPage } from 'next';
import Image from "next/image";
import styles from './ProfileHoldings.module.css';


const ProfileHoldings:NextPage = () => {
  	return (
    		<div className={styles.frameParent}>
      			<div className={styles.headingParent}>
        				<div className={styles.heading}>Holding</div>
        				<div className={styles.heading1}>Allocation</div>
        				<div className={styles.heading2}>Value</div>
      			</div>
      			<div className={styles.row}>
        				<div className={styles.text}>1</div>
						<Image className={styles.image} width={34} height={34} alt="" src="IMG_9028.png" />
        				<div className={styles.textParent}>
          					<div className={styles.text1}>ai16z</div>
          					<div className={styles.text2}>14,923</div>
        				</div>
        				<div className={styles.instanceParent}>
          					<div className={styles.textWrapper}>
            						<div className={styles.text3}>13%</div>
          					</div>
          					<div className={styles.textWrapper}>
            						<div className={styles.text3}>$26.45m</div>
          					</div>
        				</div>
      			</div>
      			<div className={styles.row1}>
        				<div className={styles.text}>1</div>
						<Image className={styles.image} width={34} height={34} alt="" src="image.png" />
        				<div className={styles.textParent}>
          					<div className={styles.text1}>degenai</div>
          					<div className={styles.text2}>14,923</div>
        				</div>
        				<div className={styles.instanceParent}>
          					<div className={styles.textWrapper}>
            						<div className={styles.text3}>12%</div>
          					</div>
          					<div className={styles.textWrapper}>
            						<div className={styles.text3}>$26.45m</div>
          					</div>
        				</div>
      			</div>
    		</div>);
};

export default ProfileHoldings;