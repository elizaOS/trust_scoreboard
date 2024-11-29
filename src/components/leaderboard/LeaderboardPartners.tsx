import type { FC } from "react"
import Image from "next/image"
import styles from "./LeaderboardPartners.module.css"
import { useMediaQuery } from "react-responsive"
import { TUser } from "@/types/user"

const SkeletonRow = () => (
  <div className={`${styles.row1} animate-pulse`}>
    <div className={styles.rowChild}>
      <div className="h-8 w-8 rounded-full bg-[#3C3C3C]" />
    </div>
  </div>
)

const LeaderboardPartners: FC<{ users: TUser[]; isLoading: boolean }> = ({
  users,
  isLoading,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const SKELETON_ROWS = 5

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return <div className={styles.medalEmoji}>🥇</div>
      case 2:
        return <div className={styles.medalEmoji}>🥈</div>
      case 3:
        return <div className={styles.medalEmoji}>🥉</div>
      default:
        return <div className={styles.text}>#{rank}</div>
    }
  }

  const getTrustScoreClass = (rank: number): string => {
    switch (rank) {
      case 1:
        return styles.trustScoreGold
      case 2:
        return styles.trustScoreSilver
      case 3:
        return styles.trustScoreBronze
      default:
        return styles.text3
    }
  }

  const renderUserRow = (user: TUser) => (
    <div key={user.id} className={styles.row1}>
      <div className={styles.rowChild}>
        <Image
          width={34}
          height={34}
          alt="Partner avatar"
          src={user.avatarUrl || "/noname.svg"}
          className={styles.avatarImage}
        />
        <div className={styles.textParent}>
          <div className={styles.text1}>{user.name}</div>
        </div>
      </div>
      <div className="flex items-center">
        <div className={styles.textWrapper}>
          {user.score === 0 ? (
            <div className={styles.tooltipContainer}>
              <Image
                src="/null.svg"
                alt="Null trust score"
                width={20}
                height={20}
                className={`brightness-0 invert transition-all duration-300 ${styles.trustScoreImage}`}
              />
              <span className={styles.tooltip}>
                AI Marc is Calculating Trust
              </span>
            </div>
          ) : (
            <div className={getTrustScoreClass(user.rank)}>
              {user.score.toFixed(1)}
            </div>
          )}
        </div>
        {user.score ? (
          <div className={styles.rankWrapper}>{getRankDisplay(user.rank)}</div>
        ) : null}
      </div>
    </div>
  )

  return (
    <div className={styles.frameParent}>
      {isLoading ? (
        <>
          {[...Array(SKELETON_ROWS)].map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </>
      ) : !users?.length ? (
        <div className={styles.emptyMessage}>No partners found</div>
      ) : (
        <>{users.map(renderUserRow)}</>
      )}
    </div>
  )
}

export default LeaderboardPartners
