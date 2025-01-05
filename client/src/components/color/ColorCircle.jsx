
export default function ColorCircle({ color, children, onClick = () => { }, className = "" }) {
  const rgbaToString = (rgba) => `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a || 255})`;

  const style = {
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    border: '1px solid black',
    cursor: 'pointer',
    backgroundColor: color ? rgbaToString(color) : 'transparent'
  };

  return (
    <div
      className={`color-circle ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}