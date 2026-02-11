import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ApiMode } from "@/types";

type Props = {
  value: ApiMode;
  onChange: (value: ApiMode) => void;
  disabled?: boolean;
};

export function ApiModeSwitch({ value, onChange, disabled }: Props) {
  const checked = value === ApiMode.GQL;

  return (
    <div className="flex items-center gap-3">
      <Label className={!checked ? "" : "text-muted-foreground"}>REST</Label>

      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={(next) => onChange(next ? ApiMode.GQL : ApiMode.REST)}
        aria-label="API mode"
      />

      <Label className={checked ? "" : "text-muted-foreground"}>GQL</Label>
    </div>
  );
}
