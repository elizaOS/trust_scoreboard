import { FC, useMemo } from "react"
import styles from "./index.module.css"
import LeaderboardTotals from "../../components/leaderboard/LeaderboardTotals"
import LeaderboardMedals from "../../components/leaderboard/LeaderboardMedals"
import LeaderboardPartners from "../../components/leaderboard/LeaderboardPartners"
import { useGetUsers } from "@/services/useUsers"

export const HomeView: FC = () => {
  const { users, isLoading: isLoadingUsers } = useGetUsers({
    cursor: 1,
    limit: 100,
  })
  const topUsers = useMemo(() => {
    return users?.filter((user) => user.rank <= 3)
  }, [users])

  const otherUsers = useMemo(() => {
    return users?.filter((user) => user.rank > 3)
  }, [users])

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Trust Leaderboard</h2>

        <LeaderboardMedals users={topUsers} isLoading={isLoadingUsers} />

        <div className={styles.leaderboardWrapper}>
          <LeaderboardPartners users={users} isLoading={isLoadingUsers} />
        </div>
      </div>
    </div>
  )
}
