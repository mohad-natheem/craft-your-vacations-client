

import React from 'react'
import type { ColorSwatch } from '@/app/types'

interface ColorPaletteProps {
 swatches?: ColorSwatch[]
 className?: string
}

const defaultSwatches: ColorSwatch[] = [
 { name: 'Base', hex: '#060e20', bgClass: 'bg-base' },
 { name: 'Background', hex: '#0b1326', bgClass: 'bg-bg' },
 { name: 'Surface Low', hex: '#131b2e', bgClass: 'bg-surface-low' },
 { name: 'Surface', hex: '#171f33', bgClass: 'bg-surface' },
 { name: 'Surface High', hex: '#222a3d', bgClass: 'bg-surface-high' },
 { name: 'Surface Highest', hex: '#2a3349', bgClass: 'bg-surface-highest' },
 { name: 'Primary', hex: '#75d2f7', bgClass: 'bg-primary' },
 { name: 'Primary Dark', hex: '#3a9fc2', bgClass: 'bg-primary-dark' },
 { name: 'Primary Muted', hex: '#1a4a5e', bgClass: 'bg-primary-muted' },
 { name: 'Text', hex: '#dae2fd', bgClass: 'bg-text' },
 { name: 'Text Muted', hex: '#8a99c2', bgClass: 'bg-text-muted' },
 { name: 'Text Subtle', hex: '#4a5880', bgClass: 'bg-text-subtle' },
]

export function ColorPalette({ swatches = defaultSwatches, className = '' }: ColorPaletteProps) {
 return (
   <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${className}`}>
     {swatches.map((swatch) => (
       <div key={swatch.name} className="flex flex-col gap-2">
         <div
           className={`${swatch.bgClass} h-16 rounded-xl border border-outline`}
         />
         <div>
           <p className="text-body-sm text-text">{swatch.name}</p>
           <p className="text-label-sm text-text-muted font-mono">{swatch.hex}</p>
         </div>
       </div>
     ))}
   </div>
 )
}

export default ColorPalette