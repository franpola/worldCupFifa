const SPECIAL_FLAGS = {
  'gb-eng': 'https://upload.wikimedia.org/wikipedia/en/thumb/b/be/Flag_of_England.svg/40px-Flag_of_England.svg.png',
  'gb-sct': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Flag_of_Scotland.svg/40px-Flag_of_Scotland.svg.png',
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