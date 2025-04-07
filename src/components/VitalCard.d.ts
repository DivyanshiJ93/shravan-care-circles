
export interface VitalCardProps {
  title: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  onClick: () => void;
  isSelected?: boolean;
}
