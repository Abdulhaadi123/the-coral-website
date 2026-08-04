import React from 'react';

interface LogoProps {
  className?: string;
  height?: number;
}

export const TheCoralRoomLogo: React.FC<LogoProps> = ({ className = '', height = 48 }) => {
  return (
    <div className={`flex items-center gap-3 select-none cursor-pointer ${className}`}>
      {/* Icon Box */}
      <div className="w-12 h-12 bg-[#9FE66F] rounded-xl flex items-center justify-center relative overflow-hidden shadow-sm shrink-0">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 'c' letter shape */}
          <path 
            d="M12 9.5C9.5 9.5 7.5 11.5 7.5 14C7.5 16.5 9.5 18.5 12 18.5H13.5V15.2H11.2C10.5 15.2 10 14.7 10 14C10 13.3 10.5 12.8 11.2 12.8H13.5V9.5H12Z" 
            fill="#1C1C1C" 
          />
          {/* 'r' letter shape */}
          <path 
            d="M15 9.5V18.5H17.8V14.5C17.8 13.5 18.5 12.8 19.5 12.8C20.5 12.8 21 13.5 21 14.5V18.5H23.8V14C23.8 11.5 22.2 9.5 19.8 9.5C18.2 9.5 16.8 10.3 16 11.5V9.5H15Z" 
            fill="#1C1C1C" 
          />
          {/* Dot in r */}
          <circle cx="21.5" cy="11.2" r="1.8" fill="#1C1C1C" />
        </svg>
      </div>

      {/* Text Branding */}
      <div className="flex flex-col leading-[0.95] text-[#1C1C1C] font-bold tracking-tight text-[18px]">
        <span>the</span>
        <span>coral</span>
        <span className="flex items-baseline">
          r
          {/* Overlapping 'oo' infinity style */}
          <span className="inline-flex -space-x-1.5 mx-[1px]">
            <span className="w-[11px] h-[11px] rounded-full border-[2.5px] border-[#1C1C1C] inline-block"></span>
            <span className="w-[11px] h-[11px] rounded-full border-[2.5px] border-[#1C1C1C] inline-block"></span>
          </span>
          m
          <span className="w-[4px] h-[4px] rounded-full bg-[#9FE66F] ml-[2px] inline-block self-end mb-[2px]"></span>
        </span>
      </div>
    </div>
  );
};

export default TheCoralRoomLogo;
