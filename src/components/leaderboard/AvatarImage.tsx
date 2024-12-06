import Image from "next/image"
import { useState } from "react"

interface AvatarProps {
  src?: string
  name: string
  size?: number
  className?: string
}

export const AvatarWithFallback = ({
  src,
  name,
  size = 34,
  className,
}: AvatarProps) => {
  const [error, setError] = useState(false)
  const initial = name?.[0]?.toUpperCase() || "?"
  const fontSize = size / 2

  const proxiedSrc = src
    ? `/api/proxy/imageProxy?url=${encodeURIComponent(src)}`
    : undefined

  return (
    <>
      {!error && proxiedSrc && (
        <Image
          width={size}
          height={size}
          alt={`${name}'s avatar`}
          src={proxiedSrc}
          className={`${className} rounded-full`}
          onError={() => setError(true)}
        />
      )}
      <div
        className={`${className} inline-flex grow items-center justify-center rounded-full bg-blue-500 font-medium text-white`}
        style={{
          fontSize: `${fontSize}px`,
          display: !proxiedSrc || error ? "flex" : "none",
        }}
      >
        {initial}
      </div>
    </>
  )
}
