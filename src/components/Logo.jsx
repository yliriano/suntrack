const Logo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19" fill="url(#outerGlow)" opacity="0.15" />
    <circle cx="20" cy="20" r="16" fill="url(#bgGradient)" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 20 + Math.cos(rad) * 10; const y1 = 20 + Math.sin(rad) * 10;
      const x2 = 20 + Math.cos(rad) * 14.5; const y2 = 20 + Math.sin(rad) * 14.5;
      return (<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#rayGradient)" strokeWidth={angle % 90 === 0 ? 2.2 : 1.5} strokeLinecap="round" />);
    })}
    <circle cx="20" cy="20" r="8" fill="url(#coreGradient)" />
    <line x1="12.5" y1="17.5" x2="27.5" y2="17.5" stroke="rgba(255,200,50,0.5)" strokeWidth="0.8" />
    <line x1="12.5" y1="20" x2="27.5" y2="20" stroke="rgba(255,200,50,0.5)" strokeWidth="0.8" />
    <line x1="12.5" y1="22.5" x2="27.5" y2="22.5" stroke="rgba(255,200,50,0.5)" strokeWidth="0.8" />
    <line x1="17" y1="12.5" x2="17" y2="27.5" stroke="rgba(255,200,50,0.5)" strokeWidth="0.8" />
    <line x1="20" y1="12.5" x2="20" y2="27.5" stroke="rgba(255,200,50,0.5)" strokeWidth="0.8" />
    <line x1="23" y1="12.5" x2="23" y2="27.5" stroke="rgba(255,200,50,0.5)" strokeWidth="0.8" />
    <path d="M13.5 23.5 L17.5 19.5 L20.5 21.5 L24.5 16.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    <circle cx="24.5" cy="16.5" r="1.4" fill="white" opacity="0.9" />
    <defs>
      <radialGradient id="outerGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FCD34D" /><stop offset="100%" stopColor="#F59E0B" stopOpacity="0" /></radialGradient>
      <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F59E0B" /><stop offset="100%" stopColor="#D97706" /></linearGradient>
      <linearGradient id="coreGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FCD34D" /><stop offset="100%" stopColor="#F59E0B" /></linearGradient>
      <linearGradient id="rayGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FDE68A" /><stop offset="100%" stopColor="#F59E0B" /></linearGradient>
    </defs>
  </svg>
);
export default Logo;
