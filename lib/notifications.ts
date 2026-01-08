import { prisma } from './prisma';

export type NotificationType = 'sale' | 'stock' | 'system' | 'order' | 'deal' | 'vendor' | 'user';

export interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
}

/**
 * Create a notification for a user
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        title: params.title,
        message: params.message,
        type: params.type,
        link: params.link,
      },
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * Create a notification for all admin users
 */
export async function notifyAdmins(params: Omit<CreateNotificationParams, 'userId'>) {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true },
    });

    const notifications = await Promise.all(
      admins.map(admin =>
        prisma.notification.create({
          data: {
            userId: admin.id,
            title: params.title,
            message: params.message,
            type: params.type,
            link: params.link,
          },
        })
      )
    );

    return notifications;
  } catch (error) {
    console.error('Error notifying admins:', error);
    throw error;
  }
}

/**
 * Create a notification for a vendor
 */
export async function notifyVendor(
  vendorId: string,
  params: Omit<CreateNotificationParams, 'userId'>
) {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      select: { userId: true },
    });

    if (!vendor) {
      throw new Error(`Vendor with id ${vendorId} not found`);
    }

    return await createNotification({
      ...params,
      userId: vendor.userId,
    });
  } catch (error) {
    console.error('Error notifying vendor:', error);
    throw error;
  }
}

