import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    if (!userEmail || userEmail !== 'admin@peboli.store') {
      return NextResponse.json(
        { error: 'Only admin@peboli.store can access users.', success: false },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';

    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Role filter
    if (role && role !== 'All Users') {
      const roleMap: Record<string, string> = {
        'Buyers': 'BUYER',
        'Vendors': 'VENDOR',
        'Admins': 'ADMIN',
      };
      if (roleMap[role]) {
        where.role = roleMap[role];
      }
    }

    // Status filter (based on vendor status or user account status)
    // For now, we'll consider all users as "Active" unless they're vendors with PENDING status
    if (status && status !== 'All') {
      if (status === 'Pending') {
        where.vendor = {
          status: 'PENDING',
        };
      } else if (status === 'Suspended') {
        // You can add a suspended field to User model later
        // For now, we'll skip this filter
      }
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        vendor: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform to match the frontend format
    const formattedUsers = users.map((user) => {
      const roleMap: Record<string, string> = {
        'BUYER': 'Buyer',
        'VENDOR': 'Vendor',
        'ADMIN': 'Admin',
      };

      // Determine status
      let userStatus: 'Active' | 'Suspended' | 'Pending' = 'Active';
      if (user.vendor) {
        if (user.vendor.status === 'PENDING') {
          userStatus = 'Pending';
        } else if (user.vendor.status === 'REJECTED') {
          userStatus = 'Suspended';
        }
      }

      // Generate avatar initials
      const avatar = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleMap[user.role] || 'Buyer',
        status: userStatus,
        joined: new Date(user.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
        avatar,
      };
    });

    return NextResponse.json({
      success: true,
      users: formattedUsers,
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching users.', success: false },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    if (!userEmail || userEmail !== 'admin@peboli.store') {
      return NextResponse.json(
        { error: 'Only admin@peboli.store can update users.', success: false },
        { status: 403 }
      );
    }

    const { id, name, email, role, status } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required.', success: false },
        { status: 400 }
      );
    }

    const roleMap: Record<string, string> = {
      'Buyer': 'BUYER',
      'Vendor': 'VENDOR',
      'Admin': 'ADMIN',
    };

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && roleMap[role] && { role: roleMap[role] as any }),
      },
      include: {
        vendor: true,
      },
    });

    // Update vendor status if applicable
    if (status && updatedUser.vendor) {
      const statusMap: Record<string, string> = {
        'Pending': 'PENDING',
        'Active': 'APPROVED',
        'Suspended': 'REJECTED',
      };

      if (statusMap[status]) {
        await prisma.vendor.update({
          where: { id: updatedUser.vendor.id },
          data: {
            status: statusMap[status] as any,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully.',
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating user.', success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    if (!userEmail || userEmail !== 'admin@peboli.store') {
      return NextResponse.json(
        { error: 'Only admin@peboli.store can delete users.', success: false },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required.', success: false },
        { status: 400 }
      );
    }

    // Prevent deleting admin users
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true, email: true },
    });

    if (user?.role === 'ADMIN' || user?.email === 'admin@peboli.store') {
      return NextResponse.json(
        { error: 'Cannot delete admin users.', success: false },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting user.', success: false },
      { status: 500 }
    );
  }
}

