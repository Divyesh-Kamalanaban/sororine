import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { id, lat, lng, userId } = await request.json();

        if (!id || typeof lat !== 'number' || typeof lng !== 'number') {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        // If userId is provided (authenticated user), link it. 
        // If id is the user ID, we can set userId = id.
        const updateData: any = { lat, lng, lastUpdated: new Date() };
        if (userId) updateData.userId = userId;
        else if (id.startsWith('user_') === false) {
            // If ID doesn't look like a generated one, assume it might be a predictable user ID? 
            // Better to rely on explicit userId passed from client.
        }

        const location = await prisma.userLocation.upsert({
            where: { id },
            update: updateData,
            create: {
                id,
                lat,
                lng,
                lastUpdated: new Date(),
                userId: userId || undefined // Only set if provided
            },
        });

        return NextResponse.json(location);
    } catch (error) {
        console.error('Error updating location:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
