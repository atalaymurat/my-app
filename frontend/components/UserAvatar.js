import React from 'react';

const getRandomColor = (str) => {
  if (!str) return 'transparent';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const h = hash % 360;
  return `hsl(${h}, 70%, 60%)`;
};

const UserAvatar = ({ 
  name = '', 
  size = 40, 
  fontSize = 11,
  textColor = '#ffffff'
}) => {
  const bgColor = name ? getRandomColor(name) : 'transparent';
  const getInitials = (nameStr) => {
    if (!nameStr) return '';
    
    const names = nameStr.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    
    return initials;
  };

  const initials = getInitials(name);

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle 
        cx={size / 2} 
        cy={size / 2} 
        r={size / 2} 
        fill={bgColor}
        fillOpacity={name ? 1 : 0} // Fully transparent if no name
      />
      {name && ( // Only render text if name exists
        <text
          x="50%"
          y="50%"
          fill={textColor}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fontWeight="700"
          fontFamily="sans-serif"
        >
          {initials}
        </text>
      )}
    </svg>
  );
};

export default UserAvatar;