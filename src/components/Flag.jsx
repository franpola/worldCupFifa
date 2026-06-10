const FLAG_OVERRIDES = {
  'gb-eng': 'https://flagicons.lipis.dev/flags/4x3/gb-eng.svg',
  'gb-sct': 'https://flagicons.lipis.dev/flags/4x3/gb-sct.svg',
  'cz': 'https://flagicons.lipis.dev/flags/4x3/cz.svg',
  'cw': 'https://flagicons.lipis.dev/flags/4x3/cw.svg',
  'ba': 'https://flagicons.lipis.dev/flags/4x3/ba.svg',
}

export default function Flag({ cc, size = 24 }) {
  const code = cc?.toLowerCase()
  const src = FLAG_OVERRIDES[code]
    || `https://flagicons.lipis.dev/flags/4x3/${code}.svg`

  return (
    <img
      src={src}
      width={size}
      height={Math.round(size * 0.75)}
      alt={cc}
      style={{ objectFit: 'cover', borderRadius: 2, display: 'inline-block', verticalAlign: 'middle' }}
      onError={(e) => { e.target.style.display = 'none' }}
    />
  )
}