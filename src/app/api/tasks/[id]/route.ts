import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromToken } from "@/lib/api-middleware";

// Type definition update: params is a Promise
type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: Context) {
  const userId = await getUserIdFromToken();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Await params here
  const { id } = await params;

  const { title, description, status } = await req.json();

  const count = await prisma.task.count({ where: { id, userId } });
  if (count === 0)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.task.update({
    where: { id },
    data: { title, description, status },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: Context) {
  const userId = await getUserIdFromToken();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Await params here
  const { id } = await params;

  const count = await prisma.task.count({ where: { id, userId } });
  if (count === 0)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.task.delete({ where: { id } });

  return NextResponse.json({ message: "Deleted" });
}
