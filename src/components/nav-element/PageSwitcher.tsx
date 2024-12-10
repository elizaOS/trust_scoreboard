import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/", label: "Leaderboard" },
  { href: "/trades", label: "Trades" },
]

export default function PageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="mx-auto inline-flex h-[46px] items-start justify-start rounded-[100px] bg-[#393939] p-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex h-[38px] w-[150px] items-center justify-center gap-3.5 rounded-[100px] p-2 ${
              pathname === item.href
                ? "bg-[#232323] text-white"
                : "bg-transparent text-white/50"
            }`}
          >
            <span className="text-center text-base font-semibold leading-snug">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
