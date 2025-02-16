import { connectDB } from "@/lib/db";
import { Todo } from "@/models/Todo";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const todos = await Todo.find();
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
    try {
      await connectDB();
      console.log("✅ Connected to MongoDB");
  
      const { title } = await req.json();
      console.log("Received Data:", title);
  
      if (!title) {
        console.error("❌ Title is missing");
        return NextResponse.json({ error: "Title is required" }, { status: 400 });
      }
  
      const newTodo = new Todo({ title });
      await newTodo.save();
      console.log("✅ Todo saved successfully:", newTodo);
  
      return NextResponse.json({ message: "Todo added successfully", todo: newTodo }, { status: 201 });
    } catch (error) {
      console.error("❌ Error adding todo:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  

export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();
  await Todo.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted successfully" });
}
