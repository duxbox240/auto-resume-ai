import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const templates = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean and traditional layout perfect for corporate roles",
    preview: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with a creative touch",
    preview: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant design that lets your content shine",
    preview: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
  },
];

export default function ResumeTemplates({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Choose a Template</h2>
      <RadioGroup value={value} onValueChange={onChange} className="grid md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div key={template.id}>
            <RadioGroupItem
              value={template.id}
              id={template.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={template.id}
              className="peer-aria-checked:ring-2 peer-aria-checked:ring-primary rounded-lg overflow-hidden block cursor-pointer"
            >
              <Card>
                <CardHeader className="p-0">
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-48 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
