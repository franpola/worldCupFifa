export default function Flag({ cc, size = 24 }) {
  const code = cc?.toLowerCase()
  return (
    <img
      src={`https://flagcdn.com/${size}x${Math.round(size * 0.75)}/${code}.png`}
      srcSet={`https://flagcdn.com/${size * 2}x${Math.round(size * 0.75 * 2)}/${code}.png 2x`}
      width={size}
      height={Math.round(size * 0.75)}
      alt={cc}
      style={{ objectFit: 'cover', borderRadius: 2, display: 'inline-block', verticalAlign: 'middle' }}
    />
  )
}
