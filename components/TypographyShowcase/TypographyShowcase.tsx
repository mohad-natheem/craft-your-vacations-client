
import type { TypographyVariant } from '@/app/types'

interface TypographyShowcaseProps {
 variants?: TypographyVariant[]
 className?: string
}

const defaultVariants: TypographyVariant[] = [
 { label: 'Display LG', className: 'text-display-lg', sampleText: 'Craft Your Journey', meta: '56px / 800 / −0.02em' },
 { label: 'Display MD', className: 'text-display-md', sampleText: 'Nocturnal Voyager', meta: '44px / 800 / −0.02em' },
 { label: 'Display SM', className: 'text-display-sm', sampleText: 'Explore The World', meta: '32px / 700 / −0.02em' },
 { label: 'Headline LG', className: 'text-headline-lg', sampleText: 'Featured Destinations', meta: '28px / 700' },
 { label: 'Headline MD', className: 'text-headline-md', sampleText: 'Premium Packages', meta: '22px / 600' },
 { label: 'Headline SM', className: 'text-headline-sm', sampleText: 'Travel Essentials', meta: '18px / 600' },
 { label: 'Body LG', className: 'text-body-lg', sampleText: 'Discover handcrafted itineraries tailored for the modern explorer.', meta: '16px / 400 / lh 1.6' },
 { label: 'Body MD', className: 'text-body-md', sampleText: 'Every journey begins with a single step into the unknown.', meta: '15px / 400 / lh 1.6' },
 { label: 'Body SM', className: 'text-body-sm', sampleText: 'Prices include taxes, transfers, and expert local guides.', meta: '14px / 400 / lh 1.55' },
 { label: 'Label MD', className: 'text-label-md', sampleText: 'Best Seller', meta: '12px / 600 / uppercase / 0.05em' },
 { label: 'Label SM', className: 'text-label-sm', sampleText: 'New Arrival', meta: '11px / 600 / uppercase / 0.05em' },
]

export function TypographyShowcase({ variants = defaultVariants, className = '' }: TypographyShowcaseProps) {
 return (
   <div className={`divide-y divide-surface-high ${className}`}>
     {variants.map((v) => (
       <div key={v.label} className="flex flex-col sm:flex-row sm:items-baseline gap-2 py-5">
         <div className="w-40 shrink-0">
           <span className="text-label-sm text-text-subtle">{v.label}</span>
           {v.meta && (
             <p className="text-label-sm text-text-subtle font-mono mt-0.5">{v.meta}</p>
           )}
         </div>
         <p className={`${v.className} text-text`}>{v.sampleText}</p>
       </div>
     ))}
   </div>
 )
}

export default TypographyShowcase