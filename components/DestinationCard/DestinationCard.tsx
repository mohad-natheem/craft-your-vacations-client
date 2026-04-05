//Destination Card

import React from 'react'
import type { DestinationCardData } from '@/app/types'

interface DestinationCardProps extends DestinationCardData {
 className?: string
}

export function DestinationCard({
 imageUrl,
 imageAlt,
 region,
 title,
 description,
 href,
 className = '',
}: DestinationCardProps) {
 const content = (
   <div className={`group relative overflow-hidden rounded-2xl cursor-pointer ${className}`}>
     {/* Image */}
     <div className="aspect-[3/4] overflow-hidden">
       <img
         src={imageUrl}
         alt={imageAlt}
         className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
       />
     </div>

     {/* Gradient overlay */}
     <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/40 to-transparent" />

     {/* Content */}
     <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col gap-2">
       <span className="self-start px-2.5 py-1 rounded-full text-label-sm border border-primary/20 bg-primary/20 text-primary">
         {region}
       </span>
       <h3 className="text-headline-md text-text">{title}</h3>
       <p className="text-body-sm text-text-muted line-clamp-2">{description}</p>
     </div>
   </div>
 )

 if (href) {
   return <a href={href} className="block">{content}</a>
 }

 return content
}

export default DestinationCard