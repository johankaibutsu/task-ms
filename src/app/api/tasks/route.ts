import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromToken } from "@/lib/api-middleware";

export async function GET(req: Request) {
  const userId = await getUserIdFromToken();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status");

  const skip = (page - 1) * limit;

  const whereClause: any = {
    userId,
    title: { contains: search, mode: "insensitive" },
  };

  if (status && status !== "ALL") {
    whereClause.status = status;
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.count({ where: whereClause }),
  ]);

  return NextResponse.json({
    tasks,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: Request) {
  const userId = await getUserIdFromToken();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description } = await req.json();
  if (!title)
    return NextResponse.json({ error: "Title required" }, { status: 400 });

  const task = await prisma.task.create({
    data: {
      title,
      description,
      userId,
      status: "PENDING",
    },
  });

  return NextResponse.json(task, { status: 201 });
}
