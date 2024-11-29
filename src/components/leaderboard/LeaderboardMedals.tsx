import { FC, useMemo } from "react"
import Image from "next/image"
import styles from "./LeaderboardMedals.module.css"
import { TUser } from "@/types/user"

const SkeletonMedal: FC<{ position: number }> = ({ position }) => {
  const isFirstPlace = position === 2
  const size = isFirstPlace ? "120px" : "80px"

  const getMedalClass = (index: number) => {
    switch (index) {
      case 2:
        return styles.gold
      case 1:
        return styles.silver
      default:
        return styles.bronze
    }
  }

  const displayPosition = position === 2 ? "1" : position === 1 ? "2" : "3"

  return (
    <div
      className={`${styles.medalHolder} ${
        isFirstPlace ? styles.firstPlace : ""
      }`}
    >
      <div
        className={`${styles.imageWrapper} ${
          isFirstPlace ? styles.firstPlaceImage : ""
        }`}
      >
        <div
          className={`${styles.medal} ${getMedalClass(position)} ${
            isFirstPlace ? styles.firstPlacemedal : ""
          }`}
        >
          {displayPosition}
        </div>
        <div
          className={`${styles.skeletonCircle}`}
          style={{
            width: size,
            height: size,
          }}
        />
      </div>
    </div>
  )
}

const LeaderboardMedals: FC<{ users: TUser[]; isLoading: boolean }> = ({
  users,
  isLoading,
}) => {
  const sortedUsers = useMemo(
    () => users?.sort((a, b) => a.rank - b.rank),
    [users]
  )

  const getMedalClass = (index: number) => {
    switch (index) {
      case 1:
        return styles.gold
      case 0:
        return styles.silver
      default:
        return styles.bronze
    }
  }

  return (
    <div className={styles.container}>
      {isLoading ? (
        [1, 2, 3].map((position) => (
          <SkeletonMedal key={position} position={position} />
        ))
      ) : (
        <>
          {sortedUsers?.[1] ? (
            <div key={sortedUsers[1]?.id} className={styles.medalHolder}>
              <div className={styles.imageWrapper}>
                <div
                  className={`${styles.medal} ${getMedalClass(sortedUsers[1]?.rank)}`}
                >
                  {sortedUsers[1]?.rank}
                </div>
                <div
                  className={`${styles.imageBorder} ${getMedalClass(sortedUsers[1]?.rank)}`}
                >
                  {sortedUsers[1]?.avatarUrl ? (
                    <Image
                      src={sortedUsers[1].avatarUrl}
                      alt={
                        sortedUsers[1] && sortedUsers[1].name
                          ? sortedUsers[1].name
                          : `Position ${sortedUsers[1]?.rank}`
                      }
                      width={80}
                      height={80}
                      className={styles.userImage}
                    />
                  ) : (
                    <div
                      className={styles.placeholderImage}
                      style={{
                        width: "64px",
                        height: "64px",
                      }}
                    />
                  )}
                </div>
              </div>
              <div className={styles.userInfo}>
                <span className={styles.name}>
                  {sortedUsers[1]?.name
                    ? sortedUsers[1].name
                    : `Position ${sortedUsers[1]?.rank}`}
                </span>
                <div
                  className={`${styles.scoreWrapper} ${getMedalClass(sortedUsers[1]?.rank)}`}
                >
                  <span className={styles.score}>
                    {sortedUsers[1]?.score
                      ? sortedUsers[1].score.toFixed(2)
                      : "0.00"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <SkeletonMedal key={1} position={1} />
          )}

          {sortedUsers?.[0] ? (
            <div
              key={sortedUsers?.[0]?.id}
              className={`${styles.medalHolder} ${styles.firstPlace}`}
            >
              <div
                className={`${styles.imageWrapper} ${styles.firstPlaceImage}`}
              >
                <div
                  className={`${styles.medal} ${styles.firstPlaceMedal} ${getMedalClass(sortedUsers[0]?.rank)}`}
                >
                  {sortedUsers?.[0]?.rank}
                </div>
                <div
                  className={`${styles.imageBorder} ${getMedalClass(sortedUsers[0]?.rank)}`}
                >
                  {sortedUsers[0]?.avatarUrl ? (
                    <Image
                      src={sortedUsers?.[0]?.avatarUrl}
                      alt={
                        sortedUsers?.[0] && sortedUsers?.[0].name
                          ? sortedUsers?.[0].name
                          : `Position ${sortedUsers?.[0]?.rank}`
                      }
                      width={120}
                      height={120}
                      className={styles.userImage}
                    />
                  ) : (
                    <div
                      className={styles.placeholderImage}
                      style={{
                        width: "80px",
                        height: "80px",
                      }}
                    />
                  )}
                </div>
              </div>
              <div className={styles.userInfo}>
                <span className={styles.name}>
                  {sortedUsers?.[0]?.name
                    ? sortedUsers?.[0].name
                    : `Position ${sortedUsers?.[0]?.rank}`}
                </span>
                <div
                  className={`${styles.scoreWrapper} ${getMedalClass(sortedUsers[0]?.rank)}`}
                >
                  <span className={`${styles.score} ${styles.firstPlaceScore}`}>
                    {sortedUsers?.[0]?.score
                      ? sortedUsers?.[0].score.toFixed(2)
                      : "0.00"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <SkeletonMedal key={2} position={2} />
          )}

          {sortedUsers?.[2] ? (
            <div key={sortedUsers?.[2]?.id} className={styles.medalHolder}>
              <div className={styles.imageWrapper}>
                <div
                  className={`${styles.medal} ${getMedalClass(sortedUsers[1]?.rank)}`}
                >
                  {sortedUsers?.[2]?.rank}
                </div>
                <div
                  className={`${styles.imageBorder} ${getMedalClass(sortedUsers[2]?.rank)}`}
                >
                  {sortedUsers?.[2]?.avatarUrl ? (
                    <Image
                      src={sortedUsers?.[2]?.avatarUrl}
                      alt={
                        sortedUsers?.[2] && sortedUsers?.[2].name
                          ? sortedUsers?.[2].name
                          : `Position ${sortedUsers?.[2]?.rank}`
                      }
                      width={80}
                      height={80}
                      className={styles.userImage}
                    />
                  ) : (
                    <div
                      className={styles.placeholderImage}
                      style={{
                        width: "64px",
                        height: "64px",
                      }}
                    />
                  )}
                </div>
              </div>
              <div className={styles.userInfo}>
                <span className={styles.name}>
                  {sortedUsers?.[2]?.name
                    ? sortedUsers?.[2].name
                    : `Position ${sortedUsers?.[2]?.rank}`}
                </span>
                <div
                  className={`${styles.scoreWrapper} ${getMedalClass(sortedUsers[2]?.rank)}`}
                >
                  <span className={styles.score}>
                    {sortedUsers?.[2]?.score
                      ? sortedUsers?.[2].score.toFixed(2)
                      : "0.00"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <SkeletonMedal key={3} position={3} />
          )}
        </>
      )}
    </div>
  )
}

export default LeaderboardMedals
