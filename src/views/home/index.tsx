import { FC, useMemo } from "react"
import styles from "./index.module.css"
import LeaderboardTotals from "../../components/leaderboard/LeaderboardTotals"
import LeaderboardMedals from "../../components/leaderboard/LeaderboardMedals"
import LeaderboardPartners from "../../components/leaderboard/LeaderboardPartners"
import { useGetUsers } from "@/services/useUsers"
import PageSwitcher from "@/components/nav-element/PageSwitcher"

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
      <PageSwitcher className="mb-6" />
      <div className={styles.content}>
        <div className="flex flex-col items-center justify-center gap-2 px-4">
          <h2 className={styles.title}>Marc’s Trust Leaderboard</h2>
          <h3 className="text-center text-lg font-normal text-white/70">
            Limited access to Marc&apos;s Cabal Chat
          </h3>
        </div>

        <LeaderboardMedals users={topUsers} isLoading={isLoadingUsers} />

        <div className={styles.leaderboardWrapper}>
          <LeaderboardPartners users={users} isLoading={isLoadingUsers} />
        </div>
      </div>
    </div>
  )
}
