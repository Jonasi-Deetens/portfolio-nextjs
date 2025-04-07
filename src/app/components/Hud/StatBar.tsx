import { FC, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ResourceType } from "../../types/types";
interface StatBarProps {
  label: string;
  value: number;
  max: number;
  type: ResourceType;
  height?: number;
  showNumbers?: boolean;
  icon?: React.ReactNode;
  tooltip?: string;
}

const StatBar: FC<StatBarProps> = ({
  label,
  value,
  max,
  type,
  height = 16,
  showNumbers = true,
  icon,
  tooltip,
}) => {
  const [flash, setFlash] = useState(false);
  const prevValue = useRef(value);

  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  useEffect(() => {
    if (value < prevValue.current) {
      setFlash(true);
      const timeout = setTimeout(() => setFlash(false), 300);
      return () => clearTimeout(timeout);
    }
    prevValue.current = value;
  }, [value]);

  const colorMap: Record<string, string> = {
    hp: "bg-green-500",
    mana: "bg-blue-500",
    energy: "bg-yellow-400",
    rage: "bg-red-600",
    xp: "bg-purple-500",
  };

  const glowMap: Record<string, string> = {
    hp: "shadow-[0_0_10px_rgba(34,197,94,0.6)]",
    mana: "shadow-[0_0_10px_rgba(59,130,246,0.6)]",
    energy: "shadow-[0_0_10px_rgba(250,204,21,0.6)]",
    rage: "shadow-[0_0_10px_rgba(220,38,38,0.6)]",
    xp: "shadow-[0_0_10px_rgba(168,85,247,0.6)]",
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        {icon && <div className="w-4 h-4">{icon}</div>}
        <label className="text-xs text-white/70" title={tooltip || label}>
          {label}
        </label>
      </div>
      <div
        className={`relative w-full bg-white/10 rounded-md overflow-hidden border border-white/20`}
        style={{ height }}
      >
        <motion.div
          key={type}
          className={`h-full ${colorMap[type]} transition-all duration-300 ease-out ${glowMap[type]} ${flash ? "animate-pulse" : ""}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "tween", duration: 0.3 }}
        />
      </div>
      {showNumbers && (
        <p className="text-xs mt-1 text-white/80">
          {value} / {max}
        </p>
      )}
    </div>
  );
};

export default StatBar;
