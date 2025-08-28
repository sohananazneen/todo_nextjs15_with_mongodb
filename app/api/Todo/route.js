import connectDB from "@/lib/database";
import Todo from "@/model/Todo.model";
import { NextResponse } from "next/server";

// create todos
export async function POST(request) {
  try {
    const { title, description } = await request.json();
    
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }
    
    await connectDB();
    const todo = await Todo.create({ title, description });
    return NextResponse.json({
      message: "Todo created successfully",
      todo: todo,
    });
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}

// read todos
export async function GET() {
  try {
    await connectDB();
    const todos = await Todo.find();
    return NextResponse.json({
      todos: todos,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

// delete todos
export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Todo ID is required" },
        { status: 400 }
      );
    }
    
    await connectDB();
    const deletedTodo = await Todo.findByIdAndDelete(id);
    
    if (!deletedTodo) {
      return NextResponse.json(
        { error: "Todo not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}

// edit todos
export async function PUT(request) {
  try {
    const { id, title, description } = await request.json();
    
    if (!id || !title || !description) {
      return NextResponse.json(
        { error: "ID, title, and description are required" },
        { status: 400 }
      );
    }
    
    await connectDB();
    const updateTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    
    if (!updateTodo) {
      return NextResponse.json(
        { error: "Todo not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: "Todo updated successfully",
      todo: updateTodo,
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}
