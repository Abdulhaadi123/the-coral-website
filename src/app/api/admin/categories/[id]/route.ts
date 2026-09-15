import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

// PUT update category (rename / reorder)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const existingCategory = await prisma.category.findUnique({ where: { id: params.id } });
    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    let name: string | undefined;
    if (data.name !== undefined) {
      name = data.name.trim();
      if (!name) {
        return NextResponse.json({ error: 'Category name cannot be empty' }, { status: 400 });
      }
      if (name !== existingCategory.name) {
        const clash = await prisma.category.findUnique({
          where: { name_type: { name, type: existingCategory.type } },
        });
        if (clash) {
          return NextResponse.json({ error: 'A category with this name already exists' }, { status: 400 });
        }
      }
    }

    // Renaming a category needs every project/post currently tagged with the
    // old name moved over too, or they'd silently fall out of that filter.
    const updated = await prisma.$transaction(async (tx) => {
      const category = await tx.category.update({
        where: { id: params.id },
        data: {
          ...(name !== undefined && { name }),
          ...(data.order !== undefined && { order: Number(data.order) }),
        },
      });

      if (name !== undefined && name !== existingCategory.name) {
        if (existingCategory.type === 'blog') {
          await tx.blogPost.updateMany({
            where: { category: existingCategory.name },
            data: { category: name },
          });
        } else {
          await tx.project.updateMany({
            where: { category: existingCategory.name },
            data: { category: name },
          });
        }
      }

      return category;
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: error.message || 'Failed to update category' }, { status: 500 });
  }
}

// DELETE category — blocked while any project/post still uses it
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const category = await prisma.category.findUnique({ where: { id: params.id } });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const inUseCount = category.type === 'blog'
      ? await prisma.blogPost.count({ where: { category: category.name } })
      : await prisma.project.count({ where: { category: category.name } });

    if (inUseCount > 0) {
      const noun = category.type === 'blog' ? 'post' : 'project';
      return NextResponse.json(
        {
          error: `"${category.name}" is used by ${inUseCount} ${noun}${inUseCount === 1 ? '' : 's'}. Change their category first, then delete.`,
        },
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
