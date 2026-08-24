import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 lg:p-10 font-sans selection:bg-[#03362a] selection:text-white">
      
      {/* Floating Navbar */}
      <div className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 z-50 transition-all duration-300">
        <header className="bg-white/80 backdrop-blur-xl shadow-lg border border-white/40 rounded-full flex justify-between items-center py-3 px-6 mx-auto w-full">
          <button className="rounded-full border border-gray-300 px-6 py-2.5 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase hover:bg-gray-50 transition-colors">
            Menu
          </button>
          <div className="text-xl sm:text-2xl font-black tracking-[0.2em] uppercase text-[#1a1a1a]">
            Snec Task
          </div>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="text-xs font-semibold tracking-[0.2em] uppercase hover:underline underline-offset-4 hidden sm:block text-gray-800">
              Contact
            </Link>
            <div className="relative">
              <button className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors bg-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </button>
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-[2.5px] border-white"></span>
            </div>
          </div>
        </header>
      </div>

      {/* Main Containerized Content */}
      <main className="max-w-[1400px] mx-auto bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden relative text-[#111] mt-24 md:mt-28">
        
        {/* Hero Section */}
        <section className="relative pt-16 pb-32 px-4 sm:px-8">
          
          {/* Title */}
          <div className="text-center relative z-10 mb-8 sm:mb-0">
            <h1 className="text-[12vw] sm:text-[90px] md:text-[100px] lg:text-[130px] font-black leading-[0.85] tracking-tighter uppercase text-[#1a1a1a]">
              EFFICIENT &
              <br />
              <span className="ml-[10vw] sm:ml-32 md:ml-48">ORGANIZED</span>
            </h1>
          </div>

          {/* Decorative Left Card */}
          <div className="hidden lg:block absolute left-8 top-48 w-64 z-20">
            <div className="bg-[#ffdee6] rounded-[2rem] p-6 aspect-square relative mb-6 shadow-sm flex flex-col items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform">
               <div className="text-7xl drop-shadow-xl">🐥</div>
            </div>
            <h3 className="font-black text-2xl mb-1 uppercase tracking-tight text-[#1a1a1a]">Save 25%</h3>
            <p className="text-[10px] text-gray-500 mb-6 uppercase tracking-[0.2em] font-medium">On Daily Tasks</p>
            <button className="bg-[#03362a] text-white rounded-full pl-6 pr-2 py-2 text-[10px] font-bold flex items-center gap-4 hover:bg-black transition-colors tracking-[0.1em]">
              EXPLORE MORE 
              <span className="bg-white text-black rounded-full w-7 h-7 flex items-center justify-center text-xs">→</span>
            </button>
            
            <p className="mt-12 text-[9px] text-gray-400 uppercase tracking-[0.2em] leading-relaxed max-w-[200px] font-medium">
              A JOURNEY OF DISCOVERY AS WE HELP YOU CREATE THE BEAUTY, HARMONY AND DELICIOUSNESS OF PROJECTS FROM AROUND THE WORLD.
            </p>
          </div>

          {/* Decorative Right Elements */}
          <div className="hidden lg:block absolute right-8 top-48 w-64 z-20">
             <div className="flex gap-4 justify-end mb-8 items-center">
                <div className="w-12 h-12 rounded-full bg-[#ffdee6] flex items-center justify-center shadow-sm text-xl">🎯</div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shadow-sm text-xl">⚡</div>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center shadow-sm text-xl">💡</div>
             </div>
             <div className="flex justify-end mb-16 mr-2">
               <div className="w-24 h-px bg-gray-300"></div>
             </div>
             <div className="bg-[#e3f4db] rounded-[2rem] p-6 aspect-square relative shadow-sm flex flex-col items-center justify-center transform rotate-6 hover:rotate-0 transition-transform ml-auto w-48">
               <div className="text-6xl drop-shadow-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">🐘</div>
             </div>
          </div>

          {/* Center Main Element */}
          <div className="relative mx-auto mt-12 sm:mt-[-40px] z-0 flex flex-col items-center w-full max-w-[380px] lg:max-w-[420px]">
            <div className="bg-[#fff1d0] rounded-[3rem] w-full aspect-[3/4] relative flex items-center justify-center shadow-sm overflow-visible">
               {/* Character / Main illustration mock */}
               <div className="text-[200px] lg:text-[240px] drop-shadow-2xl z-10 leading-none relative -top-12">🍍</div>
               
               {/* Funny Glasses */}
               <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-[120%] flex justify-center gap-1 z-20">
                  <div className="w-24 h-24 lg:w-28 lg:h-28 bg-white rounded-full border-[8px] border-[#d4a017] flex items-center justify-center shadow-2xl relative">
                    <div className="w-10 h-10 bg-[#03362a] rounded-full absolute bottom-4 right-4">
                      <div className="w-3 h-3 bg-white rounded-full absolute top-1.5 left-1.5"></div>
                    </div>
                  </div>
                  <div className="w-24 h-24 lg:w-28 lg:h-28 bg-white rounded-full border-[8px] border-[#d4a017] flex items-center justify-center shadow-2xl relative">
                    <div className="w-10 h-10 bg-[#03362a] rounded-full absolute bottom-4 left-4">
                       <div className="w-3 h-3 bg-white rounded-full absolute top-1.5 left-1.5"></div>
                    </div>
                  </div>
               </div>
               {/* Funny Mouth */}
               <div className="absolute top-[65%] left-1/2 -translate-x-1/2 z-20">
                  <div className="w-16 h-12 bg-red-600 rounded-b-full shadow-inner border-t-[6px] border-white overflow-hidden relative">
                     <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-pink-400 rounded-full"></div>
                  </div>
               </div>
            </div>
            
            <button className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-28 h-28 bg-[#03362a] border-[8px] border-white text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 z-30 shadow-xl group">
              <svg className="w-10 h-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 19L19 5M19 5v10M19 5H9" />
              </svg>
            </button>
          </div>
        </section>

        {/* Marquee Banner */}
        <div className="relative -mt-20 sm:-mt-32 z-20 transform -rotate-6 sm:-rotate-6 bg-[#03362a] py-4 sm:py-6 shadow-2xl border-y-[6px] border-yellow-400 -mx-10 w-[120%]">
          <div className="flex whitespace-nowrap animate-[marquee_15s_linear_infinite]">
            {Array(10).fill(0).map((_, i) => (
               <span key={i} className="text-white font-black text-3xl sm:text-5xl mx-6 uppercase tracking-widest outline-text drop-shadow-md">
                 ENJOY ORGANIZED WORKFLOWS
               </span>
            ))}
          </div>
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .outline-text {
            color: transparent;
            -webkit-text-stroke: 1.5px white;
          }
        `}} />

        {/* Why Choose Us Section */}
        <section className="pt-40 pb-20 px-4 sm:px-12 md:px-20 lg:px-24">
          <div className="grid lg:grid-cols-2 gap-12 mb-20 items-end">
            <div className="hidden lg:block relative">
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] leading-relaxed max-w-[300px] font-medium">
                WE CONTINUE TO COOPERATE CLOSELY WITH FARMERS, TOP QUALITY OF THE FRUIT BEFORE DO THAT IT REMAINS FRESH AND FULL OF VIT.
              </p>
            </div>
            <div className="flex lg:justify-end">
               <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.9] lg:text-left max-w-xl text-[#1a1a1a]">
                 WHY CHOOSE US FOR YOUR HEALTHY TEAMS
               </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16 items-center">
            {/* Card 1 */}
            <div className="bg-[#f9f9f9] rounded-[2rem] p-8 lg:p-10 shadow-sm group hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#fff1d0] rounded-full flex items-center justify-center mb-8 shadow-sm">
                <span className="text-2xl">🍓</span>
              </div>
              <h3 className="font-black text-xl lg:text-2xl uppercase tracking-tight mb-4 text-[#1a1a1a]">Own Workspace</h3>
              <p className="text-[10px] lg:text-[11px] text-gray-500 mb-10 uppercase tracking-[0.15em] leading-loose font-medium">
                 Imagine a world where you can pick your features, it matters what you do at any time of your career to help them.
              </p>
              <button className="rounded-full border-[1.5px] border-gray-300 px-6 py-2.5 lg:px-8 lg:py-3 text-[10px] font-bold tracking-[0.2em] uppercase group-hover:bg-[#03362a] group-hover:text-white group-hover:border-[#03362a] transition-all">
                Read More
              </button>
            </div>

            {/* Card 2 (Dark & Tilted) */}
            <div className="bg-[#fff1d0] rounded-[2.5rem] relative p-5 aspect-[4/5] shadow-lg transform -rotate-6 md:hover:rotate-0 transition-transform duration-500 group overflow-visible z-10">
              <div className="absolute -top-16 lg:-top-20 left-1/2 -translate-x-1/2 w-32 h-32 lg:w-40 lg:h-40 z-20">
                <div className="text-[100px] lg:text-[120px] drop-shadow-2xl text-center leading-none">🐒</div>
              </div>
              <div className="bg-[#03362a] text-white rounded-[2rem] p-8 lg:p-10 h-full flex flex-col justify-end relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                
                <div className="w-12 h-12 bg-[#fff1d0] rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <span className="text-xl">🍍</span>
                </div>
                <h3 className="font-black text-xl lg:text-2xl uppercase tracking-tight mb-4 leading-tight">Productivity Recipes</h3>
                <p className="text-[9px] lg:text-[10px] text-gray-300 mb-8 uppercase tracking-[0.15em] leading-loose">
                   Juicy guarantee is high priority. Please explain your daily life features, get completely fresh everything.
                </p>
                <button className="rounded-full border-[1.5px] border-white/30 px-6 py-2.5 lg:px-8 lg:py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-[#03362a] transition-colors self-start">
                  Read More
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#f9f9f9] rounded-[2rem] p-8 lg:p-10 shadow-sm group hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#fff1d0] rounded-full flex items-center justify-center mb-8 shadow-sm">
                <span className="text-2xl">🥝</span>
              </div>
              <h3 className="font-black text-xl lg:text-2xl uppercase tracking-tight mb-4 text-[#1a1a1a]">Top 100 Teams</h3>
              <p className="text-[10px] lg:text-[11px] text-gray-500 mb-10 uppercase tracking-[0.15em] leading-loose font-medium">
                 List there were in your magical app, generated. If it has a powerful timeline you can achieve whatever you accomplish.
              </p>
              <button className="rounded-full border-[1.5px] border-gray-300 px-6 py-2.5 lg:px-8 lg:py-3 text-[10px] font-bold tracking-[0.2em] uppercase group-hover:bg-[#03362a] group-hover:text-white group-hover:border-[#03362a] transition-all">
                Read More
              </button>
            </div>
          </div>
        </section>

        {/* Top Selling Products */}
        <section className="py-24 px-4 sm:px-12 md:px-20 lg:px-24 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] max-w-2xl text-[#1a1a1a]">
              TOP-SELLING WORKFLOW TEMPLATES
            </h2>
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-8">
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] leading-relaxed max-w-[280px] text-right sm:text-left font-medium">
                WHETHER YOU'RE SEEKING A LIGHT AND REFRESHING SIDE DISH FOR A SUMMER PICNIC OR A VIBRANT CENTERPIECE.
              </p>
              <div className="flex gap-3 shrink-0">
                <button className="w-12 h-12 rounded-full border-[1.5px] border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button className="w-12 h-12 rounded-full bg-[#03362a] text-white flex items-center justify-center hover:bg-black transition-colors shadow-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
             <div className="bg-[#e3f4db] rounded-[2.5rem] aspect-[4/3.5] flex items-end justify-center overflow-hidden relative shadow-sm group">
                <div className="text-[200px] lg:text-[240px] absolute -bottom-12 lg:-bottom-16 group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-500 drop-shadow-xl">🥝</div>
             </div>
             <div className="bg-[#fff1d0] rounded-[2.5rem] aspect-[4/3.5] flex items-end justify-center overflow-hidden relative shadow-sm group">
                <div className="text-[200px] lg:text-[240px] absolute -bottom-12 lg:-bottom-16 group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-500 drop-shadow-xl">🥥</div>
             </div>
             <div className="bg-[#ffdee6] rounded-[2.5rem] aspect-[4/3.5] flex items-end justify-center overflow-hidden relative shadow-sm group hidden lg:flex">
                <div className="text-[200px] lg:text-[240px] absolute -bottom-12 lg:-bottom-16 group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-500 drop-shadow-xl">🍓</div>
             </div>
          </div>
        </section>

      </main>
    </div>
  );
}
