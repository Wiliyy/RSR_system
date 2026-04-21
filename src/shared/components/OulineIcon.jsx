export default function Icon({name , size = 24 , className = ''}) {
  return (
  <svg
   width={size}
   height={size}
   fill="currentColor"
   className={className}
   >
      <use href={`/icons.svg#${name}`} />
    </svg>
  )
}
