"use client"

import Image from "next/image"
import { useState } from "react"
import { useLazyImage } from "@/hooks/use-optimized-data"

interface OptimizedImageProps<P extends "blur" | "empty" = "empty"> {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: P
  blurDataURL?: P extends "blur" ? string : never
}

export function OptimizedImage({
  src,
  alt,
  width = 200,
  height = 200,
  className = "",
  priority = false,
  placeholder = "empty",
  blurDataURL
}: OptimizedImageProps) {
  const { loaded, error, imageSrc } = useLazyImage(src)
  const [imgError, setImgError] = useState(false)

  if (error || imgError) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted text-muted-foreground ${className}`}
        style={{ width, height }}
      >
        <span className="text-xs">Image not available</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          onError={() => setImgError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
    </div>
  )
}
