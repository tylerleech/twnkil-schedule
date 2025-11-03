import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import { Mail, Bell, Users, Palette } from "lucide-react";

export default function Settings() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [notificationDay, setNotificationDay] = useState("Monday");
  const [theme, setTheme] = useState<"light" | "soft" | "dark">("light");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "soft" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme changes
  const handleThemeChange = (newTheme: "light" | "soft" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Remove all theme classes
    document.documentElement.classList.remove("dark", "soft");
    
    // Add the appropriate class
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "soft") {
      document.documentElement.classList.add("soft");
    }
  };

  // todo: remove mock functionality
  const employees = ["tyler", "nalleli", "claudia", "ana"];

  const handleSave = () => {
    console.log("Settings saved");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure appearance, email notifications and employee information
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Theme Selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>
              Choose your preferred color theme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Theme</Label>
              <RadioGroup value={theme} onValueChange={(value) => handleThemeChange(value as "light" | "soft" | "dark")}>
                <div className="flex items-center space-x-3 p-3 rounded-md border hover-elevate">
                  <RadioGroupItem value="light" id="light" data-testid="radio-theme-light" />
                  <Label htmlFor="light" className="flex-1 cursor-pointer">
                    <div className="font-medium">Light</div>
                    <p className="text-sm text-muted-foreground">Bright and clean with pure white backgrounds</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-md border hover-elevate">
                  <RadioGroupItem value="soft" id="soft" data-testid="radio-theme-soft" />
                  <Label htmlFor="soft" className="flex-1 cursor-pointer">
                    <div className="font-medium">Soft</div>
                    <p className="text-sm text-muted-foreground">Muted off-white with warm tones, easy on the eyes</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-md border hover-elevate">
                  <RadioGroupItem value="dark" id="dark" data-testid="radio-theme-dark" />
                  <Label htmlFor="dark" className="flex-1 cursor-pointer">
                    <div className="font-medium">Dark</div>
                    <p className="text-sm text-muted-foreground">Dark mode for reduced eye strain</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <CardTitle>Email Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure automated email reminders for task assignments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-toggle">Enable Email Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Send weekly reminders to assigned employees
                </p>
              </div>
              <Switch
                id="email-toggle"
                checked={emailEnabled}
                onCheckedChange={setEmailEnabled}
                data-testid="switch-email-notifications"
              />
            </div>

            {emailEnabled && (
              <div className="space-y-3 pt-4 border-t">
                <Label htmlFor="notification-day">Notification Day</Label>
                <Input
                  id="notification-day"
                  value={notificationDay}
                  onChange={(e) => setNotificationDay(e.target.value)}
                  placeholder="e.g., Monday"
                  data-testid="input-notification-day"
                />
                <p className="text-xs text-muted-foreground">
                  Day of the week to send assignment reminders
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employee Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Employee Information</CardTitle>
            </div>
            <CardDescription>
              Manage employee email addresses for notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {employees.map((employee) => (
              <div key={employee} className="space-y-2">
                <Label htmlFor={`email-${employee}`} className="capitalize">
                  {employee}
                </Label>
                <Input
                  id={`email-${employee}`}
                  type="email"
                  placeholder={`${employee}@company.com`}
                  data-testid={`input-email-${employee}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} data-testid="button-save-settings">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
