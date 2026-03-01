
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { id, active } = await request.json();
        console.log(`[API] Help route called. ID: ${id}, Active: ${active}`);

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        if (active) {
            // Use upsert to ensure user exists even if location hasn't been posted yet
            await prisma.userLocation.upsert({
                where: { id },
                update: { helpRequestedAt: new Date() },
                create: {
                    id,
                    lat: 0, // Default to 0 if unknown, or maybe handle this better?
                    lng: 0,
                    helpRequestedAt: new Date()
                }
            });
        } else {
            console.log(`[API] Deactivating help for ID: ${id}. Removing offers...`);
            // Deactivate help request AND resolve all associated offers
            const result = await prisma.$transaction([
                prisma.userLocation.update({
                    where: { id },
                    data: { helpRequestedAt: null }
                }),
                prisma.helpOffer.deleteMany({
                    where: { requesterId: id }
                }),
                // Delete messages involving this user (both sent and received)
                prisma.message.deleteMany({
                    where: {
                        OR: [
                            { senderId: id },
                            { receiverId: id }
                        ]
                    }
                })
            ]);
            console.log(`[API] Help ended. Offers deleted: ${result[1].count}, Messages deleted: ${result[2].count}`);
        }

        return NextResponse.json({ success: true, status: active ? 'active' : 'inactive' });

    } catch (error) {
        console.error('Error updating help status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const userLoc = await prisma.userLocation.findUnique({
            where: { id },
            select: { helpRequestedAt: true }
        });

        const isActive = !!(userLoc?.helpRequestedAt && (Date.now() - new Date(userLoc.helpRequestedAt).getTime() < 15 * 60 * 1000));
        return NextResponse.json({ active: isActive });

    } catch (error) {
        return NextResponse.json({ error: 'Error' }, { status: 500 });
    }
}
