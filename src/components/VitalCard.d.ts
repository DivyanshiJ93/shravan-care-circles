
export interface VitalCardProps {
  title: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  onClick: () => void;
  isSelected?: boolean;
  normalRange?: { min: number; max: number };
  icon?: React.ReactNode;
  history?: { date: string; value: number }[];
  onUpdate?: (value: number) => void;
  editable?: boolean;
}
