import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { VendorStatus } from '@prisma/client';
import { createNotification, notifyAdmins } from '@/lib/notifications';

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

            // Notify vendor about approval
            try {
                await createNotification({
                    userId: vendor.userId,
                    title: 'Vendor Application Approved!',
                    message: `Congratulations! Your vendor application has been approved. You can now start selling on Peboli.`,
                    type: 'vendor',
                    link: '/vendor/dashboard',
                });
            } catch (error) {
                console.error('Error notifying vendor about approval:', error);
            }

            // Notify admins
            try {
                await notifyAdmins({
                    title: 'Vendor Application Approved',
                    message: `${vendor.name} (${vendor.email}) has been approved as a vendor.`,
                    type: 'vendor',
                    link: `/admin/vendors`,
                });
            } catch (error) {
                console.error('Error notifying admins about vendor approval:', error);
            }
        } else if (status === 'REJECTED') {
             // Optional: Downgrade back to BUYER if they were VENDOR?
             // Only if they are currently VENDOR.
             if (vendor.user.role === 'VENDOR') {
                 await prisma.user.update({
                     where: { id: vendor.userId },
                     data: { role: 'BUYER' }
                 });
             }

            // Notify vendor about rejection
            try {
                await createNotification({
                    userId: vendor.userId,
                    title: 'Vendor Application Status',
                    message: `Your vendor application has been rejected.${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`,
                    type: 'vendor',
                    link: '/sell/apply',
                });
            } catch (error) {
                console.error('Error notifying vendor about rejection:', error);
            }

            // Notify admins
            try {
                await notifyAdmins({
                    title: 'Vendor Application Rejected',
                    message: `${vendor.name} (${vendor.email}) vendor application has been rejected.`,
                    type: 'vendor',
                    link: `/admin/vendors`,
                });
            } catch (error) {
                console.error('Error notifying admins about vendor rejection:', error);
            }
        }

        return NextResponse.json(vendor);
    } catch (error) {
        console.error('Error updating vendor:', error);
        return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 });
    }
}
