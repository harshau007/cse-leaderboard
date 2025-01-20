import { fetchAndUpdateUsers } from "@/lib/updateUsers";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    await fetchAndUpdateUsers();
    return NextResponse.json({
      success: true,
      message: "Users updated successfully",
    });
  } catch (error) {
    console.error("Error updating users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update users",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
