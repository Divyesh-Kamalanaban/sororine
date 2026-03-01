import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

        // In production, we'd add viewport bounding box filtering here
        const incidents = await prisma.incident.findMany({
            orderBy: { timestamp: 'desc' },
            take: limit || 500,
        });

        return NextResponse.json(incidents);
    } catch (error) {
        console.error('Error fetching incidents:', error);
        return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { lat, lng, category, description, imageUrl, location, timestamp, userId } = body;

        // Simple validation
        if (!lat || !lng || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const incident = await prisma.incident.create({
            data: {
                lat,
                lng,
                category,
                description,
                location,
                imageUrl,
                userId, // In a real app, we'd associate this with the authenticated user
                timestamp: new Date(timestamp || Date.now()),
                
            },
        });

        return NextResponse.json(incident);
    } catch (error) {
        console.error('Error creating incident:', error);
        return NextResponse.json({ error: 'Failed to create incident' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const userId = request.headers.get('x-user-id');

        if (!id) {
            return NextResponse.json({ error: 'Incident ID is required' }, { status: 400 });
        }

        if (!userId) {
            return NextResponse.json({ error: 'User authentication required' }, { status: 401 });
        }

        // Get the incident to verify ownership
        const incident = await prisma.incident.findUnique({
            where: { id: parseInt(id) },
        });

        if (!incident) {
            return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
        }

        // Check if the current user is the incident creator
        if (incident.userId !== userId) {
            return NextResponse.json({ 
                error: 'You can only delete incidents you reported' 
            }, { status: 403 });
        }

        await prisma.incident.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting incident:', error);
        return NextResponse.json({ error: 'Failed to delete incident' }, { status: 500 });
    }
}
