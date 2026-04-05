import React from 'react'

interface PageHeaderProps {
 eyebrow?: string
 title: string
 description?: string
 actions?: React.ReactNode
 align?: 'left' | 'center'
 className?: string
}

export function PageHeader({
 eyebrow,
 title,
 description,
 actions,
 align = 'center',
 className = '',
}: PageHeaderProps) {
 const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'

 return (
   <header className={`flex flex-col gap-4 ${alignClass} ${className}`}>
     {eyebrow && (
       <span className="text-primary text-label-md tracking-widest">{eyebrow}</span>
     )}
     <h1 className="text-display-lg text-text max-w-3xl">{title}</h1>
     {description && (
       <p className="text-body-lg text-text-muted max-w-2xl">{description}</p>
     )}
     {actions && <div className="flex items-center gap-3 mt-2">{actions}</div>}
   </header>
 )
}

export default PageHeader