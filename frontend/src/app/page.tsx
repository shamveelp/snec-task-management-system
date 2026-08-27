import Link from 'next/link';

const NavLink = ({ title, hasDropdown }: { title: string, hasDropdown?: boolean }) => (
  <div className="flex items-center gap-1 text-gray-300 hover:text-white cursor-pointer transition-colors text-sm font-medium">
    {title}
    {hasDropdown && (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
    )}
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      
      {/* Radial Gradient overlay to fade edges of grid */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#050505_70%)] pointer-events-none"></div>

      {/* Navbar */}
      <header className="relative z-50 flex items-center justify-between px-6 py-5 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3">
          {/* Logo Icon */}
          <div className="flex">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.5 6.5C15.5 6.5 17.5 7 17.5 9.5C17.5 12 15 13 13 13H11C9 13 6.5 14 6.5 16.5C6.5 19 8.5 19.5 9.5 19.5" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round"/>
              <path d="M9.5 17.5C8.5 17.5 6.5 17 6.5 14.5C6.5 12 9 11 11 11H13C15 11 17.5 10 17.5 7.5C17.5 5 15.5 4.5 14.5 4.5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">SNEC TASK</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink title="Product" hasDropdown />
          <NavLink title="Solutions" hasDropdown />
          <NavLink title="Pricing" />
          <NavLink title="Partner" />
          <NavLink title="Resources" hasDropdown />
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#333] text-white px-5 py-2 rounded-full text-sm font-medium transition-colors">
            Sign up
          </Link>
          <Link href="/register" className="bg-white hover:bg-gray-100 text-black px-5 py-2 rounded-full text-sm font-medium transition-colors">
            Start Free
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-16 pb-32 lg:pt-28 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div className="max-w-xl">
          <h1 className="text-5xl lg:text-[4.5rem] font-bold tracking-tight leading-[1.05] mb-4">
            Never miss<br />another deadline.
          </h1>
          
          <h2 className="text-2xl lg:text-3xl font-semibold mb-6 flex items-center gap-2">
            Your smart agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">tracks 24/7</span>
          </h2>
          
          <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-[28rem]">
            Teams get instant clarity on their projects, tasks, and sprints. You get the delivery, the focus, and the results. Live in 5 minutes, no code.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Link href="/register" className="relative group p-[2px] rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
              <div className="bg-white text-black px-6 py-3 rounded-full font-semibold flex items-center gap-2 text-sm">
                Start Free <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </Link>
            
            <Link href="/demo" className="bg-[#0a0a0a] hover:bg-[#1f1f1f] border border-gray-800 text-white px-6 py-[14px] rounded-full font-semibold text-sm transition-colors">
              Book a Demo
            </Link>
          </div>
          
          <p className="text-gray-500 text-sm mb-6 font-medium">
            Free to start · No credit card required
          </p>
          
          {/* Partner Badges */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#0f0f0f] border border-gray-800 rounded-full px-4 py-2 text-xs font-semibold text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              GitHub Partner
            </div>
            <div className="flex items-center gap-2 bg-[#0f0f0f] border border-gray-800 rounded-full px-4 py-2 text-xs font-semibold text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-green-500"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM5.042 8.835a2.528 2.528 0 0 1-2.52-2.521A2.528 2.528 0 0 1 0 8.834a2.527 2.527 0 0 1 2.522-2.521h2.52v2.522zM6.313 8.834a2.527 2.527 0 0 1 2.521-2.521 2.527 2.527 0 0 1 2.521 2.521v-6.314A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1-2.521 2.522v6.312zM15.165 5.042a2.528 2.528 0 0 1 2.523-2.52A2.528 2.528 0 0 1 15.165 0a2.527 2.527 0 0 1 2.52 2.522v2.52h-2.52zM15.165 6.313a2.527 2.527 0 0 1-2.52 2.521 2.527 2.527 0 0 1 2.52 2.521h6.313A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522-2.521h-6.313zM18.835 5.042a2.528 2.528 0 0 1 2.521-2.52A2.528 2.528 0 0 1 24 5.042a2.527 2.527 0 0 1-2.522 2.52v-2.52h-2.52zM18.834 6.313a2.527 2.527 0 0 1 2.521-2.521 2.527 2.527 0 0 1 2.521 2.521v6.314A2.528 2.528 0 0 1 21.356 24a2.528 2.528 0 0 1-2.522-2.522v-6.312z"/></svg>
              Slack Partner
            </div>
          </div>
        </div>

        {/* Right Illustration (3D Isometric mock) */}
        <div className="relative h-[450px] w-full flex items-center justify-center mt-12 lg:mt-0">
          
          {/* Base purple glow beneath everything */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-purple-600/20 blur-[60px] rounded-full"></div>

          {/* Central Cube / Platform */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 border border-gray-800 rounded-xl transform rotate-45 scale-y-50 bg-[#080808] shadow-[0_0_50px_rgba(168,85,247,0.15)] flex items-center justify-center">
             {/* Inner Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(#1a1a1a_1px,transparent_1px),linear-gradient(90deg,#1a1a1a_1px,transparent_1px)] bg-[size:15px_15px] opacity-70 rounded-xl"></div>
          </div>
          
          {/* Glowing Box on Platform */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[65%] transform rotate-45 scale-y-50">
            {/* Box Body */}
            <div className="relative w-28 h-28 border border-purple-500/30 bg-purple-900/10 backdrop-blur-md rounded shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center justify-center">
               <div className="w-[90%] h-[90%] border border-purple-400/20"></div>
            </div>
          </div>

          {/* Floating Logo above box */}
          <div className="absolute top-[42%] left-[49%] -translate-x-1/2 -translate-y-1/2 z-20 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.5 6.5C15.5 6.5 17.5 7 17.5 9.5C17.5 12 15 13 13 13H11C9 13 6.5 14 6.5 16.5C6.5 19 8.5 19.5 9.5 19.5" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M9.5 17.5C8.5 17.5 6.5 17 6.5 14.5C6.5 12 9 11 11 11H13C15 11 17.5 10 17.5 7.5C17.5 5 15.5 4.5 14.5 4.5" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Connecting Curved Lines (Approximated with SVG paths) */}
          <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 500 500">
            {/* Line 1 (Far Left) */}
            <path d="M 230 250 Q 140 180 120 200" fill="none" stroke="#333" strokeWidth="1.5" strokeDasharray="4 4" />
            {/* Line 2 (Mid Left) */}
            <path d="M 240 250 Q 180 140 180 150" fill="none" stroke="#333" strokeWidth="1.5" strokeDasharray="4 4" />
            {/* Line 3 (Top Center) */}
            <path d="M 250 250 Q 250 120 260 130" fill="none" stroke="#333" strokeWidth="1.5" strokeDasharray="4 4" />
            {/* Line 4 (Mid Right) */}
            <path d="M 260 250 Q 320 140 330 160" fill="none" stroke="#333" strokeWidth="1.5" strokeDasharray="4 4" />
            {/* Line 5 (Far Right) */}
            <path d="M 270 250 Q 380 180 390 220" fill="none" stroke="#333" strokeWidth="1.5" strokeDasharray="4 4" />
          </svg>

          {/* Floating Platform Icons */}
          {/* Platform Icon Component */}
          {/* WhatsApp / Slack */}
          <div className="absolute top-[39%] left-[17%] w-[42px] h-[42px] border border-gray-800 rounded transform rotate-45 scale-y-50 bg-[#111] shadow-2xl flex items-center justify-center z-10">
            <div className="transform -rotate-45 scale-y-200">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-green-500"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            </div>
          </div>
          
          {/* Instagram / Figma */}
          <div className="absolute top-[28%] left-[34%] w-[42px] h-[42px] border border-gray-800 rounded transform rotate-45 scale-y-50 bg-[#111] shadow-2xl flex items-center justify-center z-10">
            <div className="transform -rotate-45 scale-y-200">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-pink-500"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.869a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </div>
          </div>
          
          {/* Shopify / Jira */}
          <div className="absolute top-[23%] left-[52%] -translate-x-1/2 w-[42px] h-[42px] border border-gray-800 rounded transform rotate-45 scale-y-50 bg-[#111] shadow-2xl flex items-center justify-center z-10">
            <div className="transform -rotate-45 scale-y-200">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-green-400"><path d="M21 7L12 1 3 7v10l9 6 9-6V7zm-9 11L5 13V9l7 4 7-4v4l-7 5z"/></svg>
            </div>
          </div>
          
          {/* Slack / Notion */}
          <div className="absolute top-[28%] left-[68%] w-[42px] h-[42px] border border-gray-800 rounded transform rotate-45 scale-y-50 bg-[#111] shadow-2xl flex items-center justify-center z-10">
            <div className="transform -rotate-45 scale-y-200">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-blue-300"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM5.042 8.835a2.528 2.528 0 0 1-2.52-2.521A2.528 2.528 0 0 1 0 8.834a2.527 2.527 0 0 1 2.522-2.521h2.52v2.522zM6.313 8.834a2.527 2.527 0 0 1 2.521-2.521 2.527 2.527 0 0 1 2.521 2.521v-6.314A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1-2.521 2.522v6.312zM15.165 5.042a2.528 2.528 0 0 1 2.523-2.52A2.528 2.528 0 0 1 15.165 0a2.527 2.527 0 0 1 2.52 2.522v2.52h-2.52zM15.165 6.313a2.527 2.527 0 0 1-2.52 2.521 2.527 2.527 0 0 1 2.52 2.521h6.313A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522-2.521h-6.313zM18.835 5.042a2.528 2.528 0 0 1 2.521-2.52A2.528 2.528 0 0 1 24 5.042a2.527 2.527 0 0 1-2.522 2.52v-2.52h-2.52zM18.834 6.313a2.527 2.527 0 0 1 2.521-2.521 2.527 2.527 0 0 1 2.521 2.521v6.314A2.528 2.528 0 0 1 21.356 24a2.528 2.528 0 0 1-2.522-2.522v-6.312z"/></svg>
            </div>
          </div>
          
          {/* Facebook / Teams */}
          <div className="absolute top-[39%] left-[78%] w-[42px] h-[42px] border border-gray-800 rounded transform rotate-45 scale-y-50 bg-[#111] shadow-2xl flex items-center justify-center z-10">
             <div className="transform -rotate-45 scale-y-200">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
