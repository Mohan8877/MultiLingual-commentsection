interface CommentAvatarProps {
  username: string
  size?: "sm" | "md" | "lg"
}

export function CommentAvatar({ username, size = "md" }: CommentAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-teal-500",
    ]

    const hash = name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)

    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div
      className={`
      ${sizeClasses[size]} 
      ${getAvatarColor(username)}
      rounded-full 
      flex 
      items-center 
      justify-center 
      text-white 
      font-semibold 
      shadow-sm
    `}
    >
      {getInitials(username)}
    </div>
  )
}
