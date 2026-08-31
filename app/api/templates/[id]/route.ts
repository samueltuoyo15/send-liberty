import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import EmailTemplate from "@/models/EmailTemplate";
import { DEFAULT_TEMPLATES, extractVariables, isValidSlug } from "@/lib/templates";
import mongoose from "mongoose";

const MAX_HTML_BYTES = 512 * 1024;

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    const user = await requireAuthUser(req);
    const { id } = await ctx.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid template id." }, { status: 400 });
    }
    await connectDB();
    const tpl = await EmailTemplate.findOne({
      _id: id,
      userId: new mongoose.Types.ObjectId(user.id),
    });
    if (!tpl) {
      return NextResponse.json({ success: false, message: "Template not found." }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      data: {
        id: tpl._id.toString(),
        slug: tpl.slug,
        name: tpl.name,
        category: tpl.category,
        description: tpl.description,
        subject: tpl.subject,
        html: tpl.html,
        variables: tpl.variables,
        isDefault: tpl.isDefault,
        createdAt: tpl.createdAt,
        updatedAt: tpl.updatedAt,
      },
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("GET /api/templates/[id] error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const user = await requireAuthUser(req);
    const { id } = await ctx.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid template id." }, { status: 400 });
    }
    await connectDB();
    const userId = new mongoose.Types.ObjectId(user.id);
    const tpl = await EmailTemplate.findOne({ _id: id, userId });
    if (!tpl) {
      return NextResponse.json({ success: false, message: "Template not found." }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));

    if (body.reset === true) {
      const def = DEFAULT_TEMPLATES.find((t) => t.slug === tpl.slug);
      if (!def || !tpl.isDefault) {
        return NextResponse.json(
          { success: false, message: "Only starter templates can be reset." },
          { status: 400 }
        );
      }
      tpl.name = def.name;
      tpl.description = def.description;
      tpl.subject = def.subject;
      tpl.html = def.html;
      tpl.variables = def.variables;
      tpl.category = def.category;
      await tpl.save();
    } else {
      if (typeof body.name === "string") {
        const name = body.name.trim().slice(0, 80);
        if (!name) return NextResponse.json({ success: false, message: "Name cannot be empty." }, { status: 400 });
        tpl.name = name;
      }
      if (typeof body.slug === "string") {
        const slug = body.slug.trim().toLowerCase();
        if (!isValidSlug(slug)) {
          return NextResponse.json(
            { success: false, message: "Slug must be lowercase letters, numbers, and hyphens." },
            { status: 400 }
          );
        }
        if (slug !== tpl.slug) {
          const clash = await EmailTemplate.findOne({ userId, slug });
          if (clash) {
            return NextResponse.json({ success: false, message: `Slug '${slug}' is already used.` }, { status: 409 });
          }
          tpl.slug = slug;
        }
      }
      if (typeof body.description === "string") {
        tpl.description = body.description.trim().slice(0, 200);
      }
      if (typeof body.subject === "string") {
        const subject = body.subject.trim();
        if (!subject) return NextResponse.json({ success: false, message: "Subject cannot be empty." }, { status: 400 });
        tpl.subject = subject;
      }
      if (typeof body.html === "string") {
        if (!body.html.trim()) {
          return NextResponse.json({ success: false, message: "HTML cannot be empty." }, { status: 400 });
        }
        if (Buffer.byteLength(body.html, "utf8") > MAX_HTML_BYTES) {
          return NextResponse.json({ success: false, message: "HTML is too large. Keep templates under 512 KB." }, { status: 413 });
        }
        tpl.html = body.html;
      }
      tpl.variables = extractVariables(tpl.subject, tpl.html);
      await tpl.save();
    }

    return NextResponse.json({
      success: true,
      data: {
        id: tpl._id.toString(),
        slug: tpl.slug,
        name: tpl.name,
        category: tpl.category,
        description: tpl.description,
        subject: tpl.subject,
        html: tpl.html,
        variables: tpl.variables,
        isDefault: tpl.isDefault,
        createdAt: tpl.createdAt,
        updatedAt: tpl.updatedAt,
      },
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("PATCH /api/templates/[id] error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  try {
    const user = await requireAuthUser(req);
    const { id } = await ctx.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid template id." }, { status: 400 });
    }
    await connectDB();
    const tpl = await EmailTemplate.findOneAndDelete({
      _id: id,
      userId: new mongoose.Types.ObjectId(user.id),
    });
    if (!tpl) {
      return NextResponse.json({ success: false, message: "Template not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("DELETE /api/templates/[id] error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
