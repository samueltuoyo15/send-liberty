import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import EmailTemplate, { IEmailTemplate } from "@/models/EmailTemplate";
import {
  DEFAULT_TEMPLATES,
  extractVariables,
  isValidSlug,
  slugify,
} from "@/lib/templates";
import mongoose from "mongoose";

const MAX_TEMPLATES_FREE = 20;
const MAX_TEMPLATES_PRO = 200;
const MAX_HTML_BYTES = 512 * 1024;

function formatTemplate(tpl: IEmailTemplate | Record<string, unknown>) {
  const t = tpl as IEmailTemplate;
  const id = (t._id as mongoose.Types.ObjectId).toString();
  return {
    id,
    slug: t.slug,
    name: t.name,
    category: t.category,
    description: t.description,
    subject: t.subject,
    html: t.html,
    variables: t.variables,
    isDefault: t.isDefault,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

async function seedDefaults(userId: mongoose.Types.ObjectId) {
  const count = await EmailTemplate.countDocuments({ userId });
  if (count > 0) return;
  await EmailTemplate.insertMany(
    DEFAULT_TEMPLATES.map((t) => ({
      userId,
      slug: t.slug,
      name: t.name,
      category: t.category,
      description: t.description,
      subject: t.subject,
      html: t.html,
      variables: t.variables,
      isDefault: true,
    }))
  );
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthUser(req);
    await connectDB();
    const userId = new mongoose.Types.ObjectId(user.id);
    await seedDefaults(userId);

    const templates = await EmailTemplate.find({ userId }).sort({ category: 1, name: 1 }).lean();
    return NextResponse.json({
      success: true,
      data: templates.map((t) => formatTemplate(t as unknown as IEmailTemplate)),
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("GET /api/templates error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthUser(req);
    await connectDB();
    const userId = new mongoose.Types.ObjectId(user.id);
    const body = await req.json().catch(() => ({}));

    if (body.restoreDefaults === true) {
      const existing = await EmailTemplate.find({ userId, isDefault: true }).select("slug").lean();
      const have = new Set(existing.map((t) => t.slug));
      const missing = DEFAULT_TEMPLATES.filter((t) => !have.has(t.slug));
      if (missing.length > 0) {
        await EmailTemplate.insertMany(
          missing.map((t) => ({
            userId,
            slug: t.slug,
            name: t.name,
            category: t.category,
            description: t.description,
            subject: t.subject,
            html: t.html,
            variables: t.variables,
            isDefault: true,
          }))
        );
      }
      const templates = await EmailTemplate.find({ userId }).sort({ category: 1, name: 1 }).lean();
      return NextResponse.json({
        success: true,
        restored: missing.length,
        data: templates.map((t) => formatTemplate(t as unknown as IEmailTemplate)),
      });
    }

    const name = String(body.name ?? "").trim().slice(0, 80);
    if (!name) {
      return NextResponse.json({ success: false, message: "Name is required." }, { status: 400 });
    }

    let slug = String(body.slug ?? slugify(name)).trim().toLowerCase();
    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { success: false, message: "Slug must be lowercase letters, numbers, and hyphens (e.g. password-reset)." },
        { status: 400 }
      );
    }

    const subject = String(body.subject ?? "").trim();
    const html = String(body.html ?? "");
    if (!subject) {
      return NextResponse.json({ success: false, message: "Subject is required." }, { status: 400 });
    }
    if (!html.trim()) {
      return NextResponse.json({ success: false, message: "HTML body is required." }, { status: 400 });
    }
    if (Buffer.byteLength(html, "utf8") > MAX_HTML_BYTES) {
      return NextResponse.json({ success: false, message: "HTML is too large. Keep templates under 512 KB." }, { status: 413 });
    }

    const User = (await import("@/models/User")).default;
    const dbUser = await User.findById(user.id).select("plan").lean();
    const max = dbUser?.plan === "pro" ? MAX_TEMPLATES_PRO : MAX_TEMPLATES_FREE;
    const count = await EmailTemplate.countDocuments({ userId });
    if (count >= max) {
      return NextResponse.json(
        {
          success: false,
          message: `You have reached the ${max} template limit.${dbUser?.plan === "free" ? " Upgrade to Pro for more." : ""}`,
        },
        { status: 429 }
      );
    }

    const conflict = await EmailTemplate.findOne({ userId, slug });
    if (conflict) {
      return NextResponse.json(
        { success: false, message: `Template slug '${slug}' already exists.` },
        { status: 409 }
      );
    }

    const variables = extractVariables(subject, html);
    const tpl = await EmailTemplate.create({
      userId,
      slug,
      name,
      category: "custom",
      description: String(body.description ?? "").trim().slice(0, 200),
      subject,
      html,
      variables,
      isDefault: false,
    });

    return NextResponse.json({ success: true, data: formatTemplate(tpl) }, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("POST /api/templates error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
