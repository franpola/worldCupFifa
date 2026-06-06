const FLAG_OVERRIDES = {
  'gb-eng': 'https://flagicons.lipis.dev/flags/4x3/gb-eng.svg',
  'gb-sct': 'https://flagicons.lipis.dev/flags/4x3/gb-sct.svg',
}
export default function Flag({ cc, size = 24 }) {
  const code = cc?.toLowerCase().replace('-', '_')
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      width={size}
      height={Math.round(size * 0.75)}
      alt={cc}
      style={{ objectFit: 'cover', borderRadius: 2, display: 'inline-block', verticalAlign: 'middle' }}
      onError={(e) => { e.target.style.display = 'none' }}
    />
  )
}