import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const authUser = await requireAuthUser(req);
    await connectDB();

    const user = await User.findById(authUser.id).select("-__v").lean();
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await requireAuthUser(req);
    await connectDB();

    const { displayName } = await req.json();
    const user = await User.findByIdAndUpdate(
      authUser.id,
      { displayName },
      { new: true }
    ).select("-__v").lean();

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = await requireAuthUser(req);
    await connectDB();

    await User.findByIdAndDelete(authUser.id);
    const response = NextResponse.json({ success: true, message: "Account deleted" });
    response.cookies.set("access_token", "", { maxAge: 0, path: "/" });
    return response;
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
