
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, AlertTriangle, History, Plus, X } from 'lucide-react';

interface VitalCardProps {
  title: string;
  value: number | null;
  unit: string;
  normalRange: { min: number; max: number };
  icon: React.ReactNode;
  history?: { date: string; value: number }[];
  onUpdate?: (value: number) => void;
  editable?: boolean;
}

export default function VitalCard({
  title,
  value,
  unit,
  normalRange,
  icon,
  history = [],
  onUpdate,
  editable = true
}: VitalCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value?.toString() || '');
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = () => {
    const parsedValue = parseFloat(newValue);
    if (!isNaN(parsedValue) && onUpdate) {
      onUpdate(parsedValue);
    }
    setIsEditing(false);
  };

  const isNormal = (val: number) => {
    return val >= normalRange.min && val <= normalRange.max;
  };

  const getStatusColor = (val: number) => {
    if (isNormal(val)) {
      return 'bg-shravan-mint text-primary-foreground';
    }
    return 'bg-shravan-peach text-secondary-foreground';
  };

  const getStatusIcon = (val: number) => {
    if (isNormal(val)) {
      return <Check className="h-4 w-4" />;
    }
    return <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 flex flex-row items-center justify-between py-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-shravan-blue">
            {icon}
          </div>
          {title}
        </CardTitle>
        {editable && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHistory(!showHistory)}
              className="h-8 w-8"
            >
              <History className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="input-shravan"
              autoFocus
            />
            <div className="flex gap-1">
              <Button size="icon" onClick={handleSubmit} className="shrink-0 bg-shravan-mint hover:bg-shravan-darkMint h-10 w-10">
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" onClick={() => setIsEditing(false)} variant="outline" className="shrink-0 h-10 w-10">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {value !== null ? (
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">
                  {value} <span className="text-sm text-muted-foreground">{unit}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor(value)}`}>
                  {getStatusIcon(value)}
                  {isNormal(value) ? 'Normal' : 'Abnormal'}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground text-center py-4">No data recorded</div>
            )}
            
            {showHistory && history.length > 0 && (
              <div className="border-t pt-3 mt-3">
                <h4 className="text-sm font-medium mb-2">History</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                  {history.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.date}</span>
                      <span className={`px-2 rounded ${isNormal(item.value) ? 'bg-shravan-mint/20 text-primary-foreground' : 'bg-shravan-peach/20 text-secondary-foreground'}`}>
                        {item.value} {unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
