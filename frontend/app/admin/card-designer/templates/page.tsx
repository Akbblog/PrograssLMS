"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminPageLayout from "@/components/layouts/AdminPageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cardTemplateAPI } from "@/lib/api/endpoints";
import {
  Plus,
  Loader2,
  Edit,
  Trash2,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import type { CardTemplate } from "@/lib/types/cardTemplate";

export default function CardTemplatesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [entityType, setEntityType] = useState<"student" | "teacher">(
    "student"
  );

  async function fetchTemplates() {
    setLoading(true);
    try {
      await cardTemplateAPI.ensureDefault();
      const res = await cardTemplateAPI.list(entityType);
      setTemplates((res as any)?.data || res || []);
    } catch (e: any) {
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTemplates();
  }, [entityType]);

  async function handleCreate() {
    const name = prompt("Template name:");
    if (!name) return;
    try {
      await cardTemplateAPI.create({ name, entityType });
      toast.success("Template created!");
      fetchTemplates();
    } catch (e: any) {
      toast.error("Failed to create template");
    }
  }

  async function handleActivate(id: string) {
    try {
      await cardTemplateAPI.activate(id);
      toast.success("Template activated!");
      fetchTemplates();
    } catch (e: any) {
      toast.error("Failed to activate template");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
      await cardTemplateAPI.delete(id);
      toast.success("Template deleted!");
      fetchTemplates();
    } catch (e: any) {
      toast.error(
        "Failed to delete: " +
          ((e as any)?.message || "Cannot delete active template")
      );
    }
  }

  return (
    <AdminPageLayout
      title="Card Templates"
      description="Manage and organize ID card templates"
      actions={
        <Button size="sm" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-1" /> New Template
        </Button>
      }
    >
      {/* Entity Type Selector */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-fit mb-6">
        {(["student", "teacher"] as const).map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              entityType === type
                ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setEntityType(type)}
          >
            {type === "student" ? "Student Cards" : "Teacher Cards"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-500 mb-3">No templates found</p>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-1" /> Create First Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card
              key={template._id}
              className={`overflow-hidden transition-shadow hover:shadow-md ${
                template.isActive ? "ring-2 ring-green-500" : ""
              }`}
            >
              {/* Color preview header */}
              <div
                className="h-20 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${
                    template.styling?.primaryColor || "#3B82F6"
                  }, ${template.styling?.secondaryColor || "#10B981"})`,
                }}
              >
                <CreditCard className="w-10 h-10 text-white/60" />
              </div>

              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{template.name}</h3>
                    <p className="text-xs text-slate-500">
                      v{template.version} &middot;{" "}
                      {template.fields?.filter((f) => f.show).length || 0}{" "}
                      fields visible
                    </p>
                  </div>
                  {template.isActive && (
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      Active
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push("/admin/card-designer")}
                  >
                    <Edit className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  {!template.isActive && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600"
                      onClick={() => handleActivate(template._id)}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" /> Activate
                    </Button>
                  )}
                  {!template.isActive && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                      onClick={() => handleDelete(template._id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminPageLayout>
  );
}
