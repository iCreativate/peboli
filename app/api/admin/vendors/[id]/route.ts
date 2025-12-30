import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { VendorStatus } from '@prisma/client';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, rejectionReason } = body;

        if (!status || !['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Update vendor status
        const vendor = await prisma.vendor.update({
            where: { id },
            data: {
                status: status as VendorStatus,
                rejectionReason: status === 'REJECTED' ? rejectionReason : null,
                isVerified: status === 'APPROVED', // Auto-verify if approved
            },
            include: { user: true }
        });

        // Sync User role
        if (status === 'APPROVED') {
            await prisma.user.update({
                where: { id: vendor.userId },
                data: { role: 'VENDOR' }
            });
        } else if (status === 'REJECTED' || status === 'PENDING') {
             // Optional: Downgrade back to BUYER if they were VENDOR?
             // Only if they are currently VENDOR.
             if (vendor.user.role === 'VENDOR') {
                 await prisma.user.update({
                     where: { id: vendor.userId },
                     data: { role: 'BUYER' }
                 });
             }
        }

        return NextResponse.json(vendor);
    } catch (error) {
        console.error('Error updating vendor:', error);
        return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 });
    }
}
