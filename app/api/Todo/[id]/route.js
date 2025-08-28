import connectDB from "@/lib/database";
import Todo from "@/model/Todo.model";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const todo = await Todo.findById(id);
    
    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    
    return NextResponse.json({ todo });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch todo" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const deletedTodo = await Todo.findByIdAndDelete(id);
    
    if (!deletedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { title, description } = await request.json();
    await connectDB();
    
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    
    if (!updatedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    
    return NextResponse.json({
      message: "Todo updated successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}
