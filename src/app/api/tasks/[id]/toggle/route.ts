import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromToken } from "@/lib/api-middleware";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: Context) {
  const userId = await getUserIdFromToken();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Await params here
  const { id } = await params;

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task || task.userId !== userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const newStatus = task.status === "PENDING" ? "COMPLETED" : "PENDING";

  const updated = await prisma.task.update({
    where: { id },
    data: { status: newStatus },
  });

  return NextResponse.json(updated);
}
