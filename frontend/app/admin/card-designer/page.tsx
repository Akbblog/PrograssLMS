"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminPageLayout from "@/components/layouts/AdminPageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cardTemplateAPI } from "@/lib/api/endpoints";
import {
  CreditCard,
  Save,
  Eye,
  Palette,
  Layout,
  Type,
  Plus,
  Loader2,
  CheckCircle,
} from "lucide-react";
import type {
  CardTemplate,
  CardTemplateField,
  CardTemplateStyling,
  CardTemplateLayout,
  SAMPLE_STUDENT_DATA as SampleStudent,
  SAMPLE_TEACHER_DATA as SampleTeacher,
} from "@/lib/types/cardTemplate";
import {
  SAMPLE_STUDENT_DATA,
  SAMPLE_TEACHER_DATA,
} from "@/lib/types/cardTemplate";

// ─── Color picker (simple input[type=color] wrapper) ────────────────────────
function ColorPicker({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {label && <Label className="text-xs min-w-[70px]">{label}</Label>}
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border cursor-pointer"
        />
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 h-8 text-xs font-mono"
        maxLength={7}
      />
    </div>
  );
}

// ─── Tab buttons ─────────────────────────────────────────────────────────────
function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

// ─── Live Card Preview ───────────────────────────────────────────────────────
function CardPreview({
  template,
  entityType,
}: {
  template: Partial<CardTemplate>;
  entityType: "student" | "teacher";
}) {
  const data =
    entityType === "student" ? SAMPLE_STUDENT_DATA : SAMPLE_TEACHER_DATA;
  const styling = template.styling || ({} as CardTemplateStyling);
  const layout = template.layout || ({} as CardTemplateLayout);
  const fields = (template.fields || [])
    .filter((f) => f.show)
    .sort((a, b) => a.order - b.order);

  const primaryColor = styling.primaryColor || "#3B82F6";
  const secondaryColor = styling.secondaryColor || "#10B981";
  const bgColor = styling.backgroundColor || "#FFFFFF";

  const nameField = fields.find((f) => f.fieldId === "name");
  const otherFields = fields.filter((f) => f.fieldId !== "name");

  const getFieldValue = (fieldId: string) => {
    return (data as any)[fieldId] || "";
  };

  return (
    <div
      className="w-[288px] mx-auto shadow-xl rounded-lg overflow-hidden border"
      style={{
        backgroundColor: bgColor,
        borderColor: styling.borderColor || "#E5E7EB",
        borderWidth: styling.borderWidth || 1,
        borderRadius: styling.borderRadius || 8,
      }}
    >
      {/* Header */}
      <div
        className="px-3 py-2.5 flex items-center gap-2"
        style={{ backgroundColor: primaryColor }}
      >
        {layout.showSchoolLogo !== false && (
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-bold truncate">
            {template.customText?.header || "School Name"}
          </p>
          <p className="text-white/70 text-[10px]">Student ID Card</p>
        </div>
      </div>

      {/* Accent bar */}
      <div className="h-[3px]" style={{ backgroundColor: secondaryColor }} />

      {/* Body */}
      <div className="p-3 flex gap-3" style={{ minHeight: 200 }}>
        {/* Left - fields */}
        <div className="flex-1 flex flex-col gap-1">
          {nameField && (
            <p
              className="mb-1"
              style={{
                fontSize: nameField.fontSize || 14,
                fontWeight: nameField.bold !== false ? "bold" : "normal",
                color: nameField.fontColor || "#111827",
              }}
            >
              {getFieldValue("name") || "Student Name"}
            </p>
          )}
          {otherFields.map((field) => {
            const val = getFieldValue(field.fieldId);
            if (!val) return null;
            return (
              <div key={field.fieldId} className="flex gap-1">
                <span className="text-[8px] text-slate-400 min-w-[50px]">
                  {field.label}:
                </span>
                <span
                  style={{
                    fontSize: Math.min(field.fontSize || 10, 12),
                    fontWeight: field.bold ? "bold" : "normal",
                    color: field.fontColor || "#111827",
                  }}
                >
                  {String(val)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right - photo + QR */}
        <div className="flex flex-col items-center gap-2 w-[80px]">
          {layout.showPhoto !== false && (
            <div
              className="w-[70px] h-[85px] rounded border-2 flex items-center justify-center bg-slate-50"
              style={{ borderColor: primaryColor }}
            >
              <span className="text-slate-300 text-lg font-bold">
                {(getFieldValue("name") || "NA")
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            </div>
          )}
          {layout.showQRCode !== false && (
            <div className="w-[70px] h-[70px] rounded bg-slate-100 flex items-center justify-center">
              <svg
                width="50"
                height="50"
                viewBox="0 0 50 50"
                className="text-slate-400"
              >
                <rect
                  x="5"
                  y="5"
                  width="15"
                  height="15"
                  fill="currentColor"
                />
                <rect
                  x="30"
                  y="5"
                  width="15"
                  height="15"
                  fill="currentColor"
                />
                <rect
                  x="5"
                  y="30"
                  width="15"
                  height="15"
                  fill="currentColor"
                />
                <rect
                  x="22"
                  y="22"
                  width="6"
                  height="6"
                  fill="currentColor"
                />
                <rect
                  x="32"
                  y="32"
                  width="10"
                  height="10"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-3 py-1.5 flex justify-between"
        style={{ backgroundColor: primaryColor }}
      >
        <span className="text-white/70 text-[8px]">
          {template.customText?.footer || `Issued: ${new Date().toLocaleDateString()}`}
        </span>
        <span className="text-white/70 text-[8px]">+92 XXX XXXXXXX</span>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function CardDesignerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
  const [entityType, setEntityType] = useState<"student" | "teacher">("student");
  const [activeTab, setActiveTab] = useState<"layout" | "styling" | "fields">("layout");
  const [availableFields, setAvailableFields] = useState<CardTemplateField[]>([]);

  // Editing state (working copy)
  const [editLayout, setEditLayout] = useState<CardTemplateLayout>({
    orientation: "portrait",
    width: 85.6,
    height: 53.98,
    showQRCode: true,
    qrPosition: "bottom-right",
    showPhoto: true,
    photoPosition: "top-right",
    showSignature: false,
    showSchoolLogo: true,
  });
  const [editStyling, setEditStyling] = useState<CardTemplateStyling>({
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    accentColor: "#F59E0B",
    backgroundColor: "#FFFFFF",
    backgroundImage: "",
    backgroundOpacity: 1,
    borderRadius: 8,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    headerStyle: "gradient",
  });
  const [editFields, setEditFields] = useState<CardTemplateField[]>([]);
  const [editCustomText, setEditCustomText] = useState({
    header: "",
    footer: "",
    watermark: "",
  });
  const [templateName, setTemplateName] = useState("");

  // Load templates + available fields
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Ensure default templates exist
      await cardTemplateAPI.ensureDefault();

      const [templatesRes, fieldsRes] = await Promise.all([
        cardTemplateAPI.list(entityType),
        cardTemplateAPI.getAvailableFields(entityType),
      ]);

      const templatesList = (templatesRes as any)?.data || templatesRes || [];
      setTemplates(templatesList);

      const fieldsList = (fieldsRes as any)?.data || fieldsRes || [];
      setAvailableFields(fieldsList);

      // Select active template or first one
      const active = templatesList.find((t: CardTemplate) => t.isActive) || templatesList[0];
      if (active) {
        selectTemplate(active, fieldsList);
      }
    } catch (e: any) {
      toast.error("Failed to load templates: " + (e?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [entityType]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function selectTemplate(t: CardTemplate, defaultFields?: CardTemplateField[]) {
    setSelectedTemplate(t);
    setTemplateName(t.name);
    setEditLayout(t.layout || editLayout);
    setEditStyling(t.styling || editStyling);
    setEditCustomText(t.customText || { header: "", footer: "", watermark: "" });

    // Merge template fields with available fields
    const tFields = t.fields || [];
    const defaults = defaultFields || availableFields;
    const merged = defaults.map((df) => {
      const existing = tFields.find((f) => f.fieldId === df.fieldId);
      return existing || { ...df };
    });
    setEditFields(merged);
  }

  async function handleSave() {
    if (!selectedTemplate) return;
    setSaving(true);
    try {
      await cardTemplateAPI.update(selectedTemplate._id, {
        name: templateName,
        layout: editLayout,
        styling: editStyling,
        fields: editFields,
        customText: editCustomText,
      });
      toast.success("Template saved successfully!");
      loadData();
    } catch (e: any) {
      toast.error("Failed to save: " + (e?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateTemplate() {
    const name = prompt("Template name:");
    if (!name) return;
    try {
      await cardTemplateAPI.create({ name, entityType });
      toast.success("Template created!");
      loadData();
    } catch (e: any) {
      toast.error("Failed to create template: " + (e?.message || "Unknown error"));
    }
  }

  async function handleActivate() {
    if (!selectedTemplate) return;
    try {
      await cardTemplateAPI.activate(selectedTemplate._id);
      toast.success("Template activated!");
      loadData();
    } catch (e: any) {
      toast.error("Failed to activate: " + (e?.message || "Unknown error"));
    }
  }

  function toggleField(fieldId: string, show: boolean) {
    setEditFields((prev) =>
      prev.map((f) => (f.fieldId === fieldId ? { ...f, show } : f))
    );
  }

  function updateField(fieldId: string, updates: Partial<CardTemplateField>) {
    setEditFields((prev) =>
      prev.map((f) => (f.fieldId === fieldId ? { ...f, ...updates } : f))
    );
  }

  // Build the current working template for preview
  const previewTemplate: Partial<CardTemplate> = {
    layout: editLayout,
    styling: editStyling,
    fields: editFields,
    customText: editCustomText,
  };

  if (loading) {
    return (
      <AdminPageLayout title="Card Designer" description="Design and customize ID card templates">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Card Designer"
      description="Design and customize ID card templates"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCreateTemplate}>
            <Plus className="w-4 h-4 mr-1" /> New Template
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving || !selectedTemplate}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            Save
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Editor Controls (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Entity Type & Template selector */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Entity type toggle */}
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                  {(["student", "teacher"] as const).map((type) => (
                    <button
                      key={type}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        entityType === type
                          ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                      onClick={() => setEntityType(type)}
                    >
                      {type === "student" ? "Student" : "Teacher"}
                    </button>
                  ))}
                </div>

                {/* Template selector */}
                {templates.length > 0 && (
                  <Select
                    value={selectedTemplate?._id || ""}
                    onValueChange={(val) => {
                      const t = templates.find((t) => t._id === val);
                      if (t) selectTemplate(t);
                    }}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((t) => (
                        <SelectItem key={t._id} value={t._id}>
                          {t.name} {t.isActive ? "(Active)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Template name */}
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-[200px]"
                  placeholder="Template name"
                />

                {selectedTemplate && !selectedTemplate.isActive && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleActivate}
                    className="text-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Activate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-50 dark:bg-slate-800 rounded-lg p-1">
            <TabButton
              active={activeTab === "layout"}
              onClick={() => setActiveTab("layout")}
              icon={Layout}
              label="Layout"
            />
            <TabButton
              active={activeTab === "styling"}
              onClick={() => setActiveTab("styling")}
              icon={Palette}
              label="Styling"
            />
            <TabButton
              active={activeTab === "fields"}
              onClick={() => setActiveTab("fields")}
              icon={Type}
              label="Fields"
            />
          </div>

          {/* Tab content */}
          <Card>
            <CardContent className="p-5">
              {/* LAYOUT TAB */}
              {activeTab === "layout" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Show QR Code
                      </Label>
                      <Switch
                        checked={editLayout.showQRCode}
                        onCheckedChange={(v) =>
                          setEditLayout((p) => ({ ...p, showQRCode: v }))
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        QR Position
                      </Label>
                      <Select
                        value={editLayout.qrPosition}
                        onValueChange={(v: any) =>
                          setEditLayout((p) => ({ ...p, qrPosition: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Show Photo
                      </Label>
                      <Switch
                        checked={editLayout.showPhoto}
                        onCheckedChange={(v) =>
                          setEditLayout((p) => ({ ...p, showPhoto: v }))
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Show School Logo
                      </Label>
                      <Switch
                        checked={editLayout.showSchoolLogo}
                        onCheckedChange={(v) =>
                          setEditLayout((p) => ({ ...p, showSchoolLogo: v }))
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Show Signature
                      </Label>
                      <Switch
                        checked={editLayout.showSignature}
                        onCheckedChange={(v) =>
                          setEditLayout((p) => ({ ...p, showSignature: v }))
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STYLING TAB */}
              {activeTab === "styling" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Colors</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <ColorPicker
                        label="Primary"
                        value={editStyling.primaryColor}
                        onChange={(v) =>
                          setEditStyling((p) => ({ ...p, primaryColor: v }))
                        }
                      />
                      <ColorPicker
                        label="Secondary"
                        value={editStyling.secondaryColor}
                        onChange={(v) =>
                          setEditStyling((p) => ({ ...p, secondaryColor: v }))
                        }
                      />
                      <ColorPicker
                        label="Accent"
                        value={editStyling.accentColor}
                        onChange={(v) =>
                          setEditStyling((p) => ({ ...p, accentColor: v }))
                        }
                      />
                      <ColorPicker
                        label="Background"
                        value={editStyling.backgroundColor}
                        onChange={(v) =>
                          setEditStyling((p) => ({ ...p, backgroundColor: v }))
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold mb-3">Border</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Radius (px)</Label>
                        <Input
                          type="number"
                          min={0}
                          max={24}
                          value={editStyling.borderRadius}
                          onChange={(e) =>
                            setEditStyling((p) => ({
                              ...p,
                              borderRadius: parseInt(e.target.value) || 0,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Width (px)</Label>
                        <Input
                          type="number"
                          min={0}
                          max={5}
                          value={editStyling.borderWidth}
                          onChange={(e) =>
                            setEditStyling((p) => ({
                              ...p,
                              borderWidth: parseInt(e.target.value) || 0,
                            }))
                          }
                        />
                      </div>
                      <ColorPicker
                        label="Color"
                        value={editStyling.borderColor}
                        onChange={(v) =>
                          setEditStyling((p) => ({ ...p, borderColor: v }))
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold mb-3">Header Style</h3>
                    <Select
                      value={editStyling.headerStyle}
                      onValueChange={(v: any) =>
                        setEditStyling((p) => ({ ...p, headerStyle: v }))
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gradient">Gradient</SelectItem>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* FIELDS TAB */}
              {activeTab === "fields" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-3">
                      Custom Text
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Header Text</Label>
                        <Input
                          value={editCustomText.header}
                          onChange={(e) =>
                            setEditCustomText((p) => ({
                              ...p,
                              header: e.target.value,
                            }))
                          }
                          placeholder="School name / tagline"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Footer Text</Label>
                        <Input
                          value={editCustomText.footer}
                          onChange={(e) =>
                            setEditCustomText((p) => ({
                              ...p,
                              footer: e.target.value,
                            }))
                          }
                          placeholder="Issued: date"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold mb-3">
                      Visible Fields
                    </h3>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {editFields.map((field) => (
                        <div
                          key={field.fieldId}
                          className="flex items-center gap-3 p-3 border rounded-lg bg-white dark:bg-slate-900"
                        >
                          <Switch
                            checked={field.show}
                            onCheckedChange={(v) =>
                              toggleField(field.fieldId, v)
                            }
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{field.label}</p>
                            <p className="text-xs text-slate-400">
                              {field.fieldId}
                            </p>
                          </div>
                          {field.show && (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                className="w-16 h-7 text-xs"
                                min={6}
                                max={24}
                                value={field.fontSize}
                                onChange={(e) =>
                                  updateField(field.fieldId, {
                                    fontSize: parseInt(e.target.value) || 10,
                                  })
                                }
                                title="Font size"
                              />
                              <button
                                className={`px-2 py-1 text-xs rounded ${
                                  field.bold
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                                onClick={() =>
                                  updateField(field.fieldId, {
                                    bold: !field.bold,
                                  })
                                }
                              >
                                B
                              </button>
                              <input
                                type="color"
                                value={field.fontColor || "#000000"}
                                onChange={(e) =>
                                  updateField(field.fieldId, {
                                    fontColor: e.target.value,
                                  })
                                }
                                className="w-6 h-6 rounded cursor-pointer"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Live Preview (1 col) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center py-4 bg-slate-50 dark:bg-slate-800 rounded-b-lg">
                <CardPreview
                  template={previewTemplate}
                  entityType={entityType}
                />
              </CardContent>
            </Card>

            {selectedTemplate && (
              <Card>
                <CardContent className="p-4 text-xs text-slate-500 space-y-1">
                  <p>
                    <strong>Version:</strong> {selectedTemplate.version}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {selectedTemplate.isActive ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      "Inactive"
                    )}
                  </p>
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(selectedTemplate.updatedAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}
