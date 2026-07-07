// Обёртка над Tabler webfont (в проде можно заменить на @tabler/icons-react).
export function Icon({ name, size = 16, color, style }: { name: string; size?: number; color?: string; style?: React.CSSProperties }) {
  return <i className={`ti ti-${name}`} style={{ fontSize: size, color, ...style }} aria-hidden />
}

// Аватар с инициалами
export function Avatar({ mono, bg, fg, size = 28, font }: { mono: string; bg: string; fg: string; size?: number; font?: number }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%', background: bg, color: fg,
      fontSize: font ?? Math.round(size * 0.36), fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
    }}>{mono}</span>
  )
}
