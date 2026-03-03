"use client";

import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import GlobalFilters from '@/components/GlobalFilters';
import KPICard from '@/components/KPICard';
import AnalyticsWidget from '@/components/AnalyticsWidget';
import MapSearch from '@/components/MapSearch';
import Chat from '@/components/Chat';
import HelpModal from '@/components/HelpModal';
import OfferHelpModal from '@/components/OfferHelpModal';
import {
  Users,
  ShieldAlert,
  Map as MapIcon,
  Bell,
  HandHelping,
  ShieldCheck,
  Clock,
  Loader2,
  MapPin
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ReportIncidentModal from '@/components/ReportIncidentModal';
import IncidentDetailsModal from '@/components/IncidentDetailsModal';
import { useLocation } from '@/hooks/useLocation';

import RiskLevelWidget from '@/components/RiskLevelWidget';
import ActiveAlertsWidget from '@/components/ActiveAlertsWidget';
import RecentActivityWidget from '@/components/RecentActivityWidget';
import { calculateRiskScore } from '@/lib/risk';

// Dynamic import for Map to avoid SSR issues
const SafetyMap = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#050509] flex items-center justify-center text-gray-500">Loading Map...</div>
});

export default function Dashboard() {
  const router = useRouter();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [currentRisk, setCurrentRisk] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);

  // Location & Users
  const { location: userLocation, isLoading: isLocating, error: locationError, retry: retryLocation, setLocation: setUserLocation } = useLocation();

  const [nearbyUsers, setNearbyUsers] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Help System State
  const [isHelpActive, setIsHelpActive] = useState(false);
  const [acceptedHelperId, setAcceptedHelperId] = useState<string | null>(null);
  const [activeChatPartner, setActiveChatPartner] = useState<{ id: string, name: string } | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isOfferHelpModalOpen, setIsOfferHelpModalOpen] = useState(false);
  const [pendingOffers, setPendingOffers] = useState<any[]>([]);

  // 1. Check Authentication on Mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          setIsAuthenticated(false);
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (data.user) {
          setUserId(data.user.id);
          localStorage.setItem('sororine_user_id', data.user.id);
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  // 2. Get User Location & Identity on Mount
  useEffect(() => {
    if (!isAuthenticated) return;
    let storedId = localStorage.getItem('sororine_user_id');
    if (!storedId) {
      storedId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sororine_user_id', storedId);
    }
    setUserId(storedId);

    if (userId && userLocation) {
      fetch('/api/users/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, ...userLocation, userId })
      }).catch(console.error);
    }
  }, [userId, userLocation, isAuthenticated]);

  // 3. Fetch Data (Polled)
  const fetchData = useCallback(async () => {
    try {
      const incidentsRes = await fetch('/api/incidents?limit=100');
      if (incidentsRes.ok) {
        const data = await incidentsRes.json();
        const parsedIncidents = data.map((inc: any) => ({
          ...inc,
          timestamp: new Date(inc.timestamp),
          createdAt: new Date(inc.createdAt)
        }));
        setIncidents(parsedIncidents);

        // Use local calculateRiskScore for immediate UI feedback
        const risk = calculateRiskScore(parsedIncidents);
        setCurrentRisk(risk);

        // Prep analytics data (mock distribution for now or use risk factors)
        const chartData = [
          { name: 'Morning', alerts: risk.factors.timeDistribution.day || 0 },
          { name: 'Afternoon', alerts: Math.floor(incidents.length * 0.2) },
          { name: 'Evening', alerts: Math.floor(incidents.length * 0.3) },
          { name: 'Night', alerts: risk.factors.timeDistribution.night || 0 },
        ];
        setAnalyticsData(chartData);
      }

      if (userId) {
        const usersRes = await fetch('/api/users/nearby', {
          headers: { 'x-user-id': userId }
        });
        if (usersRes.ok) {
          const users = await usersRes.json();
          setNearbyUsers(users);
        }

        const myHelpRes = await fetch(`/api/users/help?id=${userId}`);
        if (myHelpRes.ok) {
          const data = await myHelpRes.json();
          setIsHelpActive(data.active);
        }

        if (isHelpActive) {
          const offersRes = await fetch(`/api/users/help/offer?requesterId=${userId}`);
          if (offersRes.ok) {
            const data = await offersRes.json();
            const acceptedOffers = data.offers.filter((o: any) => o.status === 'ACCEPTED');
            if (acceptedOffers.length > 0 && !activeChatPartner) {
              setAcceptedHelperId(acceptedOffers[0].helperId);
              setActiveChatPartner({
                id: acceptedOffers[0].helperId,
                name: `Helper #${acceptedOffers[0].helperId.slice(0, 8)}`
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, isHelpActive, activeChatPartner, incidents.length]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData, isAuthenticated]);

  // Handlers
  const toggleHelp = async () => {
    if (!userId) return;
    const newStatus = !isHelpActive;
    setIsHelpActive(newStatus);
    try {
      await fetch('/api/users/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, active: newStatus })
      });
      if (!newStatus) {
        setActiveChatPartner(null);
        setAcceptedHelperId(null);
      } else {
        setIsHelpModalOpen(true);
      }
    } catch (e) {
      setIsHelpActive(!newStatus);
    }
  };

  const handleOfferHelp = async (targetUserId: string) => {
    if (!userId) return;
    try {
      const res = await fetch('/api/users/help/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'OFFER', requesterId: targetUserId, helperId: userId })
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen bg-[#050509] text-white items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex bg-transparent text-white h-screen overflow-hidden overflow-x-hidden relative">
      <Sidebar />

      <main className="flex-1 transition-all duration-300 relative h-full pt-16 md:pt-0">
        {/* Full-screen Map Background */}
        <div className="absolute inset-0 z-0">
          <SafetyMap
            incidents={incidents}
            userLocation={userLocation}
            nearbyUsers={nearbyUsers}
            onOfferHelp={handleOfferHelp}
            onIncidentClick={setSelectedIncident}
          />
        </div>

        {/* Global UI Overlay Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none p-4 md:p-8 flex flex-col justify-between">

          {/* Top Layer: Navigation & Status */}
          <div className="flex flex-col md:flex-row justify-between items-start w-full gap-4">
            {/* Search: Primary on mobile top */}
            <div className="w-full md:w-80 pl-16 md:pl-0 order-1 md:order-2 pointer-events-auto animate-fade-in delay-200">
              <MapSearch onLocationSelect={(lat, lng) => {
                if (userLocation) setUserLocation({ lat, lng });
              }} />
            </div>

            {/* KPIs: Below search on mobile, Left on desktop */}
            <div className="w-full md:w-auto flex flex-row md:flex-col justify-center md:justify-start gap-2 md:gap-4 order-2 md:order-1 pointer-events-auto animate-fade-in">
              <div className="flex flex-row md:flex-col gap-2 md:gap-4">
                {/* Risk Widget - Double instance for responsive layout control */}
                <div className="md:hidden">
                  <RiskLevelWidget
                    level={currentRisk?.level || 'LOW'}
                    score={currentRisk?.score || 0}
                    compact
                  />
                </div>
                <div className="hidden md:block">
                  <RiskLevelWidget
                    level={currentRisk?.level || 'LOW'}
                    score={currentRisk?.score || 0}
                  />
                </div>

                {/* Alerts Widget - Double instance for responsive layout control */}
                <div className="md:hidden">
                  <ActiveAlertsWidget
                    count={currentRisk?.factors.recentIncidents || 0}
                    compact
                  />
                </div>
                <div className="hidden md:block">
                  <ActiveAlertsWidget
                    count={currentRisk?.factors.recentIncidents || 0}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Actions & Metrics */}
          <div className="flex flex-col gap-6">
            {/* Center Actions */}
            <div className="flex flex-col items-center gap-4 w-full">
              <button
                onClick={toggleHelp}
                className={`pointer-events-auto px-10 py-4 rounded-full text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-2xl ${isHelpActive
                  ? 'bg-white text-red-600 animate-pulse'
                  : 'bg-red-600 text-white hover:bg-red-500 hover:scale-105 active:scale-95 shadow-red-600/40'
                  }`}
              >
                <HandHelping size={20} />
                {isHelpActive ? "Request Active" : "Request Help"}
              </button>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="pointer-events-auto flex items-center gap-2 px-6 py-2.5 bg-[#0A0A10]/80 backdrop-blur-md border border-white/10 hover:bg-white/5 text-white/70 hover:text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
              >
                <ShieldAlert size={14} />
                Report Incident
              </button>
            </div>

            {/* Bottom Row: Activity & Trends */}
            <div className="flex justify-between items-end w-full">
              <div className="pointer-events-auto animate-fade-in delay-400">
                <RecentActivityWidget incidents={incidents} />
              </div>

              <div className="hidden lg:block w-96 pointer-events-auto animate-fade-in delay-600">
                <AnalyticsWidget data={analyticsData} />
              </div>
            </div>
          </div>
        </div>

        {/* Loading/Calibrating Overlay */}
        {isLocating && !userLocation && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#050509]/80 backdrop-blur-sm animate-fade-in">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-t-2 border-blue-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                </div>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-500/80 animate-pulse">Calibrating Satellite Feed...</p>
            </div>
          </div>
        )}
      </main>

      {/* Modals & Overlays */}
      <ReportIncidentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        currentLocation={userLocation}
        onSuccess={fetchData}
      />

      <IncidentDetailsModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onDelete={() => {
          setSelectedIncident(null);
          fetchData();
        }}
        currentUserId={userId || undefined}
      />

      {activeChatPartner && userId && (
        <Chat
          myId={userId}
          partnerId={activeChatPartner.id}
          partnerName={activeChatPartner.name}
          onClose={() => setActiveChatPartner(null)}
        />
      )}
    </div>
  );
}
