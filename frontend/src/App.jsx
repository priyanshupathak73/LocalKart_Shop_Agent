import React, { useState } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { Login } from './pages/auth/Login';
import { ShopkeeperRegistration } from './pages/auth/ShopkeeperRegistration';
import { DashboardLayout } from './layouts/DashboardLayout';
import { MockupShowcase } from './pages/MockupShowcase';
import logoUrl from './assets/Logo.png';

// Shopkeeper Pages
import { StatsHome as ShopkeeperStats } from './pages/shopkeeper/StatsHome';
import { Products as ShopkeeperProducts } from './pages/shopkeeper/Products';
import { Inventory as ShopkeeperInventory } from './pages/shopkeeper/Inventory';
import { Orders as ShopkeeperOrders } from './pages/shopkeeper/Orders';

// Delivery Pages
import { StatsHome as DeliveryStats } from './pages/delivery/StatsHome';
import { Deliveries as DeliveryTrips } from './pages/delivery/Deliveries';
import { Earnings as DeliveryEarnings } from './pages/delivery/Earnings';

// Icons
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Users, 
  IndianRupee, 
  Star, 
  Settings, 
  HelpCircle, 
  Truck, 
  ShieldAlert, 
  ShoppingBag, 
  User, 
  ArrowRight,
  MessageSquare,
  MapPin,
  HelpCircle as SupportIcon,
  Sparkles
} from 'lucide-react';

// Customer role completely removed per specifications

// Generic placeholder template for minor views
const PlaceholderPage = ({ title, subtitle, icon: Icon }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm text-center py-16 flex flex-col items-center justify-center space-y-3">
    <div className="p-4 bg-slate-50 text-slate-400 rounded-full">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="font-bold text-slate-800 font-heading text-lg">{title}</h3>
    <p className="text-slate-400 text-sm max-w-sm">{subtitle}</p>
  </div>
);

function App() {
  const { user, isAuthenticated, logout } = useAuthStore();
  
  // Tabs active states
  const [shopkeeperTab, setShopkeeperTab] = useState('dashboard');
  const [deliveryTab, setDeliveryTab] = useState('dashboard');
  const [showMockup, setShowMockup] = useState(false);
  const [authView, setAuthView] = useState('login'); // 'login' | 'register-shopkeeper'

  // Shopkeeper menu
  const shopkeeperMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: ClipboardList },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'earnings', label: 'Earnings', icon: IndianRupee },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Delivery partner menu
  const deliveryMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'deliveries', label: 'Deliveries', icon: Truck },
    { id: 'earnings', label: 'Earnings', icon: IndianRupee },
    { id: 'support', label: 'Support', icon: SupportIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderShopkeeperView = () => {
    switch (shopkeeperTab) {
      case 'dashboard':
        return <ShopkeeperStats setActiveTab={setShopkeeperTab} />;
      case 'products':
        return <ShopkeeperProducts />;
      case 'inventory':
        return <ShopkeeperInventory />;
      case 'orders':
        return <ShopkeeperOrders />;
      case 'customers':
        return (
          <PlaceholderPage 
            title="Customers Roster" 
            subtitle="View buyer statistics and order frequency. Features currently under active development." 
            icon={Users} 
          />
        );
      case 'earnings':
        return (
          <PlaceholderPage 
            title="Financial Center" 
            subtitle="Audit payout periods, transaction statements, and taxation invoices." 
            icon={IndianRupee} 
          />
        );
      case 'reviews':
        return (
          <PlaceholderPage 
            title="Feedback Panel" 
            subtitle="Browse user comments, respond to complaints, and analyze rating indices." 
            icon={Star} 
          />
        );
      case 'settings':
        return (
          <PlaceholderPage 
            title="Store Configuration" 
            subtitle="Adjust operational timings, store radius limits, and basic notifications profiles." 
            icon={Settings} 
          />
        );
      default:
        return <ShopkeeperStats setActiveTab={setShopkeeperTab} />;
    }
  };

  const renderDeliveryView = () => {
    switch (deliveryTab) {
      case 'dashboard':
        return <DeliveryStats setActiveTab={setDeliveryTab} />;
      case 'deliveries':
        return <DeliveryTrips />;
      case 'earnings':
        return <DeliveryEarnings />;
      case 'support':
        return (
          <PlaceholderPage 
            title="Agent Support Helpdesk" 
            subtitle="Connect to logistics dispatch agents or call emergency customer hotlines." 
            icon={SupportIcon} 
          />
        );
      case 'settings':
        return (
          <PlaceholderPage 
            title="Courier Configuration" 
            subtitle="Manage driver licensing files, vehicle registries, and weekly deposit details." 
            icon={Settings} 
          />
        );
      default:
        return <DeliveryStats setActiveTab={setDeliveryTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-body">
      {showMockup ? (
        <MockupShowcase onClose={() => setShowMockup(false)} />
      ) : !isAuthenticated ? (
        authView === 'register-shopkeeper' ? (
          <ShopkeeperRegistration 
            onBack={() => setAuthView('login')}
            onRegisterSuccess={() => {
              setAuthView('login');
            }}
          />
        ) : (
          <div className="min-h-screen flex flex-col justify-between">
            {/* Top Navbar */}
            <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/60 px-6 py-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={logoUrl} className="h-9 w-auto" alt="e-LocalKart Logo" />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMockup(true)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Interactive UI Mockups
                  </button>
                </div>
              </div>
            </nav>

            {/* Landing Value Prop & Login form */}
            <main className="max-w-7xl mx-auto px-6 py-12 flex-1 flex items-center">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
                {/* Left Column Text */}
                <div className="lg:col-span-7 space-y-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                    <MapPin className="w-3.5 h-3.5" /> Empowering Neighborhood Commerce
                  </span>
                  <h1 className="text-4xl sm:text-5xl font-black text-slate-800 leading-[1.15] tracking-tight font-heading">
                    Your Offline Store <br />
                    <span className="text-[#10B981]">Digitally Orchestrated</span>
                  </h1>
                  <p className="text-slate-500 text-sm max-w-xl font-body">
                    LocalKart connects offline shopkeepers directly with neighborhood delivery partners and buyers, streamlining logistics and saving time.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 font-heading">For Shopkeepers</h3>
                        <p className="text-xs text-slate-450 mt-1">Digitize your inventory, manage stock, and request instant deliveries.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 font-heading">For Delivery Partners</h3>
                        <p className="text-xs text-slate-405 mt-1">Accept local orders, earn per delivery, and plan routes with ease.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Login Form Widget */}
                <div className="lg:col-span-5 flex justify-center">
                  <Login onRegisterShopkeeper={() => setAuthView('register-shopkeeper')} />
                </div>
              </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white/50 py-6 text-center text-xs text-slate-400">
              <p>© {new Date().getFullYear()} LocalKart MERN Starter Pack. Designed for localized hyper-commerce.</p>
            </footer>
          </div>
        )
      ) : (
        /* Authenticated Protected Dashboards */
        <div>
          {user?.role === 'shopkeeper' && (
            <DashboardLayout 
              sidebarItems={shopkeeperMenu} 
              activeTab={shopkeeperTab} 
              setActiveTab={setShopkeeperTab} 
              user={user} 
              logout={logout}
            >
              {renderShopkeeperView()}
            </DashboardLayout>
          )}

          {user?.role === 'delivery' && (
            <DashboardLayout 
              sidebarItems={deliveryMenu} 
              activeTab={deliveryTab} 
              setActiveTab={setDeliveryTab} 
              user={user} 
              logout={logout}
            >
              {renderDeliveryView()}
            </DashboardLayout>
          )}

          {/* Customer role completely removed */}
        </div>
      )}
    </div>
  );
}

export default App;
