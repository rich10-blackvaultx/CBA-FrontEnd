export function HomeHero() {
  return (
    <section className="relative h-[78vh] min-h-[560px] w-full overflow-hidden rounded-none">
      {/* Background */}
      <img
        src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2000&auto=format&fit=crop"
        alt="hero background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.55),rgba(0,0,0,.25)_35%,rgba(0,0,0,.35))]" />

      {/* Content */}
      <div className="container-responsive relative z-10 h-full flex flex-col items-center justify-center text-center text-white select-none">
        <div className="uppercase tracking-[0.4em] text-xs md:text-sm opacity-80 mb-4">Travel Agency</div>
        <h1 className="font-bold leading-[1.05] text-4xl md:text-6xl lg:text-7xl max-w-5xl">
          Let the World Be Your
          <br className="hidden md:block" /> Playground
        </h1>
        <p className="mt-6 max-w-3xl text-sm md:text-base opacity-90">
          Travel isn’t just about moving from place to place — it’s about discovering beauty in the unknown, and creating stories worth telling.
          Whether you’re chasing sunsets over distant mountains or relaxing by crystal‑clear waters, every journey should be personal.
        </p>

        <div className="mt-8 flex items-center gap-4">
          <a href="#featured" className="btn-primary px-5 py-2.5">Get Started</a>
          {/* Avatar stack */}
          <div className="hidden sm:flex -space-x-3">
            {['olivia','mason','ava','liam'].map((seed) => (
              <img
                key={seed}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                alt="avatar"
                className="h-8 w-8 rounded-full ring-2 ring-white/70"
              />
            ))}
            <span className="ml-4 text-sm opacity-90">25+</span>
          </div>
        </div>

        {/* Left bottom card */}
        <div className="hidden md:block absolute left-8 bottom-8">
          <div className="backdrop-blur card p-3 flex items-center gap-3 w-[260px] bg-white/75 dark:bg-gray-900/55">
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=400&auto=format&fit=crop"
              className="h-16 w-16 object-cover rounded-xl"
              alt="teaser"
            />
            <div className="text-left">
              <div className="text-sm font-medium">Lake Bled, Slovenia</div>
              <div className="text-xs opacity-80">A fairy‑tale escape tucked between the Julian</div>
            </div>
          </div>
        </div>

        {/* Right stats */}
        <div className="hidden md:flex absolute right-8 bottom-10 flex-col gap-6 text-right">
          <div>
            <div className="text-3xl font-semibold">98%</div>
            <div className="text-xs opacity-80">Our travelers consistently rate their experience</div>
          </div>
          <div>
            <div className="text-3xl font-semibold">50+</div>
            <div className="text-xs opacity-80">From tropical escapes to cultural capitals</div>
          </div>
        </div>
      </div>
    </section>
  )
}

