"use client";

import { useState } from "react";
import {
  Mountains, ForkKnife, Airplane, House, ShoppingBag, Ticket, Sun, MapPin,
  CalendarBlank, PencilSimple, Trash, ArrowLeft, Plus, Check,
} from "@phosphor-icons/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EventCategory =
  | "sightseeing"
  | "food"
  | "transport"
  | "lodging"
  | "shopping"
  | "entertainment"
  | "free"
  | "other";

interface ItineraryEvent {
  id: string;
  dayDate: string;
  title: string;
  startTime: string;
  endTime: string;
  category: EventCategory;
  location: string;
  notes: string;
  cost: string;
  confirmed: boolean;
}

interface TripDay {
  date: string;
  dayNum: number;
  destination: string;
  destColor: string;
  weekday: string;
  dayOfMonth: number;
  monthShort: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_META: Record<
  EventCategory,
  { label: string; Icon: React.ElementType; color: string }
> = {
  sightseeing:   { label: "Sightseeing",   Icon: Mountains,   color: "#FF2D8B" },
  food:          { label: "Food & Drink",  Icon: ForkKnife,   color: "#FFD600" },
  transport:     { label: "Transport",     Icon: Airplane,    color: "#00A8CC" },
  lodging:       { label: "Lodging",       Icon: House,       color: "#A855F7" },
  shopping:      { label: "Shopping",      Icon: ShoppingBag, color: "#FF8C00" },
  entertainment: { label: "Entertainment", Icon: Ticket,      color: "#00C96B" },
  free:          { label: "Free Time",     Icon: Sun,         color: "#9CA3AF" },
  other:         { label: "Other",         Icon: MapPin,      color: "#9CA3AF" },
};

const DEST_RANGES = [
  { name: "Tokyo, Japan",  color: "#FF2D8B", from: "2025-04-01", to: "2025-04-07" },
  { name: "Kyoto, Japan",  color: "#FFD600", from: "2025-04-08", to: "2025-04-11" },
  { name: "Osaka, Japan",  color: "#00C96B", from: "2025-04-12", to: "2025-04-15" },
];

const TRIP_START = "2025-04-01";
const TRIP_END   = "2025-04-15";

// ─── generateDays ─────────────────────────────────────────────────────────────

function generateDays(): TripDay[] {
  const days: TripDay[] = [];
  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const start = new Date(TRIP_START + "T12:00:00Z");
  const end   = new Date(TRIP_END   + "T12:00:00Z");

  let current = new Date(start);
  let dayNum = 1;

  while (current <= end) {
    const yyyy = current.getUTCFullYear();
    const mm   = String(current.getUTCMonth() + 1).padStart(2, "0");
    const dd   = String(current.getUTCDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const dest = DEST_RANGES.find(d => dateStr >= d.from && dateStr <= d.to)
      ?? DEST_RANGES[0];

    days.push({
      date: dateStr,
      dayNum,
      destination: dest.name,
      destColor: dest.color,
      weekday: WEEKDAYS[current.getUTCDay()],
      dayOfMonth: current.getUTCDate(),
      monthShort: MONTHS[current.getUTCMonth()],
    });

    current.setUTCDate(current.getUTCDate() + 1);
    dayNum++;
  }

  return days;
}

const TRIP_DAYS = generateDays();

// ─── Mock Events ──────────────────────────────────────────────────────────────

const MOCK_EVENTS: ItineraryEvent[] = [
  // Apr 1
  { id:"e1",  dayDate:"2025-04-01", title:"SRQ → JFK (AA2847)",          startTime:"07:15", endTime:"10:30", category:"transport",     location:"Sarasota Airport → JFK",            notes:"Window seats. Online check-in opens 24h before.",                              cost:"",       confirmed:true  },
  { id:"e2",  dayDate:"2025-04-01", title:"JFK → NRT (JL005)",           startTime:"14:00", endTime:"17:30", category:"transport",     location:"JFK → Narita Int'l, Tokyo",         notes:"Japan Airlines — business class. Arrive Apr 2 17:30 JST.",                    cost:"",       confirmed:true  },
  // Apr 2
  { id:"e3",  dayDate:"2025-04-02", title:"Arrive Narita (NRT)",         startTime:"17:30", endTime:"18:30", category:"transport",     location:"Narita International Airport",       notes:"Immigration + baggage. JR Narita Express to Shinjuku ~90 min.",              cost:"¥3,000", confirmed:true  },
  { id:"e4",  dayDate:"2025-04-02", title:"Check in — Park Hyatt Tokyo", startTime:"20:00", endTime:"21:00", category:"lodging",       location:"3-7-1-2 Nishi Shinjuku, Tokyo",      notes:"Requested high floor with city view. Confirmation: PH8823X",                 cost:"",       confirmed:true  },
  { id:"e5",  dayDate:"2025-04-02", title:"Late ramen dinner — Fuunji",  startTime:"21:30", endTime:"23:00", category:"food",          location:"Fuunji, Shinjuku, Tokyo",            notes:"Famous tsukemen ramen. Expect a short queue outside.",                         cost:"¥1,500", confirmed:false },
  // Apr 3
  { id:"e6",  dayDate:"2025-04-03", title:"Meiji Shrine",                startTime:"09:00", endTime:"11:00", category:"sightseeing",   location:"Yoyogi, Shibuya, Tokyo",             notes:"Peaceful forested walk. Arrive early to avoid crowds.",                       cost:"Free",   confirmed:true  },
  { id:"e7",  dayDate:"2025-04-03", title:"Harajuku & Takeshita Street", startTime:"11:00", endTime:"13:00", category:"shopping",      location:"Takeshita St, Harajuku, Tokyo",      notes:"Crepe shops + quirky fashion boutiques.",                                      cost:"¥3,000+",confirmed:false },
  { id:"e8",  dayDate:"2025-04-03", title:"Lunch — Afuri Ramen",         startTime:"13:00", endTime:"14:00", category:"food",          location:"Afuri, Harajuku, Tokyo",             notes:"Yuzu-shio ramen — light and fragrant. Book ahead!",                           cost:"¥1,800", confirmed:false },
  { id:"e9",  dayDate:"2025-04-03", title:"Shibuya Scramble Crossing",   startTime:"15:00", endTime:"16:30", category:"sightseeing",   location:"Shibuya Station, Tokyo",             notes:"Head to Starbucks rooftop for aerial shots. Best at rush hour (5–7pm).",     cost:"Free",   confirmed:true  },
  { id:"e10", dayDate:"2025-04-03", title:"teamLab Planets",             startTime:"19:00", endTime:"21:30", category:"entertainment", location:"Toyosu, Koto, Tokyo",                notes:"Immersive digital art — remove shoes + bags required. Book in advance!",      cost:"¥3,200", confirmed:true  },
  // Apr 4
  { id:"e11", dayDate:"2025-04-04", title:"Tsukiji Outer Market breakfast",startTime:"07:30",endTime:"09:30",category:"food",          location:"Tsukiji, Chuo, Tokyo",               notes:"Fresh sushi + tamagoyaki + grilled scallops. Arrive hungry.",                 cost:"¥2,500", confirmed:false },
  { id:"e12", dayDate:"2025-04-04", title:"Asakusa & Senso-ji Temple",   startTime:"10:00", endTime:"12:30", category:"sightseeing",   location:"Asakusa, Taito, Tokyo",              notes:"Most famous temple in Tokyo. Morning is quieter. Nakamise shopping street nearby.", cost:"Free", confirmed:true },
  { id:"e13", dayDate:"2025-04-04", title:"Standing sushi lunch",        startTime:"12:30", endTime:"13:30", category:"food",          location:"Asakusa, Tokyo",                     notes:"Fast, cheap, excellent. Look for standing sushi bars near the temple.",      cost:"¥2,000", confirmed:false },
  { id:"e14", dayDate:"2025-04-04", title:"Akihabara electronics + anime",startTime:"15:00",endTime:"18:00", category:"shopping",      location:"Akihabara, Chiyoda, Tokyo",          notes:"Multi-floor gaming + anime shops. Don't miss Yodobashi Camera.",             cost:"¥5,000+",confirmed:false },
  { id:"e15", dayDate:"2025-04-04", title:"Yakitori dinner — Yurakucho",  startTime:"20:00",endTime:"22:00", category:"food",          location:"Yurakucho under the tracks, Tokyo",  notes:"Under the train tracks — atmospheric izakayas with great grilled skewers.",  cost:"¥3,000", confirmed:false },
  // Apr 5
  { id:"e16", dayDate:"2025-04-05", title:"Shinjuku Gyoen — Cherry Blossoms",startTime:"10:00",endTime:"13:00",category:"sightseeing",location:"Shinjuku Gyoen, Tokyo",             notes:"Peak cherry blossom season. Entry ¥500. Picnic-friendly — bring snacks!",    cost:"¥500",   confirmed:true  },
  { id:"e17", dayDate:"2025-04-05", title:"Shimokitazawa vintage shopping",startTime:"15:00",endTime:"18:00",category:"shopping",      location:"Shimokitazawa, Setagaya, Tokyo",      notes:"Bohemian neighborhood — secondhand fashion, vinyl records, indie cafes.",    cost:"¥3,000+",confirmed:false },
  { id:"e18", dayDate:"2025-04-05", title:"Golden Gai bar crawl",         startTime:"21:00",endTime:"23:59", category:"entertainment", location:"Golden Gai, Shinjuku, Tokyo",        notes:"~200 tiny bars — each holds 6–8 people. Cover charges ¥500–1,000.",          cost:"¥4,000", confirmed:false },
  // Apr 6
  { id:"e19", dayDate:"2025-04-06", title:"Free / buffer day",            startTime:"10:00",endTime:"22:00", category:"free",          location:"Tokyo",                              notes:"Rest, explore on your own, revisit favorites, or day trip to Nikko.",        cost:"",       confirmed:false },
  // Apr 7
  { id:"e20", dayDate:"2025-04-07", title:"Odaiba futuristic waterfront", startTime:"10:00",endTime:"14:00", category:"sightseeing",   location:"Odaiba, Minato, Tokyo",              notes:"DiverCity Tokyo, teamLab Borderless, Gundam statue. Yurikamome line is scenic.", cost:"¥1,000", confirmed:false },
  { id:"e21", dayDate:"2025-04-07", title:"Ichiran Ramen — solo booth",   startTime:"14:30",endTime:"15:30", category:"food",          location:"Shibuya, Tokyo",                     notes:"Order on the machine, eat alone in your cubicle. An iconic Tokyo experience.",cost:"¥1,200", confirmed:false },
  { id:"e22", dayDate:"2025-04-07", title:"Final Tokyo night — Roppongi", startTime:"20:00",endTime:"23:00", category:"entertainment", location:"Roppongi, Minato, Tokyo",            notes:"Last night in Tokyo. Mori Art Museum rooftop views are stunning.",           cost:"¥5,000", confirmed:false },
  // Apr 8
  { id:"e23", dayDate:"2025-04-08", title:"Depart Tokyo by rental car",   startTime:"09:00",endTime:"09:30", category:"transport",     location:"Park Hyatt → Tomei Expressway E1",   notes:"Toyota Prius — Budget Rent-a-Car. Tomei Expressway. ~2.5h drive.",           cost:"",       confirmed:true  },
  { id:"e24", dayDate:"2025-04-08", title:"Mt. Fuji viewpoint stop",      startTime:"11:00",endTime:"12:30", category:"sightseeing",   location:"Fujikawaguchiko, Yamanashi",          notes:"Perfect spring conditions. Chureito Pagoda viewpoint if clear.",             cost:"¥300",   confirmed:false },
  { id:"e25", dayDate:"2025-04-08", title:"Arrive Kyoto — Machiya check-in",startTime:"15:30",endTime:"16:30",category:"lodging",    location:"Higashiyama-ku, Kyoto",              notes:"Traditional townhouse stay. Key in lockbox. Host contact on arrival.",        cost:"",       confirmed:false },
  { id:"e26", dayDate:"2025-04-08", title:"Gion evening walk",            startTime:"19:30",endTime:"21:30", category:"sightseeing",   location:"Gion, Higashiyama, Kyoto",           notes:"Best time to spot maiko (apprentice geisha). Stay on Hanamikoji Street.",   cost:"Free",   confirmed:false },
  // Apr 9
  { id:"e27", dayDate:"2025-04-09", title:"Fushimi Inari — dawn hike",   startTime:"05:30", endTime:"08:30", category:"sightseeing",   location:"Fushimi Inari Taisha, Kyoto",        notes:"Arrive at 5:30am to have the 10,000 torii gates almost to yourselves. Bring a light.", cost:"Free", confirmed:true },
  { id:"e28", dayDate:"2025-04-09", title:"Arashiyama Bamboo Grove",      startTime:"09:30",endTime:"11:00", category:"sightseeing",   location:"Arashiyama, Ukyo, Kyoto",            notes:"Go right after Fushimi — bamboo is striking in morning light before crowds arrive.", cost:"Free", confirmed:true },
  { id:"e29", dayDate:"2025-04-09", title:"Tenryu-ji Temple Gardens",     startTime:"11:00",endTime:"12:30", category:"sightseeing",   location:"Arashiyama, Kyoto",                  notes:"UNESCO World Heritage garden. ¥500 garden, ¥900 with interior.",             cost:"¥900",   confirmed:false },
  { id:"e30", dayDate:"2025-04-09", title:"Tofu kaiseki lunch — Shigetsu",startTime:"13:00",endTime:"14:30", category:"food",          location:"Tenryu-ji, Arashiyama, Kyoto",       notes:"Zen vegetarian cuisine inside the temple. Reserve in advance!",             cost:"¥3,500", confirmed:false },
  { id:"e31", dayDate:"2025-04-09", title:"Philosopher's Path stroll",    startTime:"15:30",endTime:"17:00", category:"sightseeing",   location:"Okazaki, Sakyo, Kyoto",              notes:"Cherry blossom canal walk. Quiet and beautiful in late afternoon light.",    cost:"Free",   confirmed:false },
  // Apr 10
  { id:"e32", dayDate:"2025-04-10", title:"Kinkaku-ji — Golden Pavilion", startTime:"09:00",endTime:"10:30", category:"sightseeing",   location:"Kinkakuji-cho, Kita, Kyoto",         notes:"¥500 entry. Go early — busiest site in Kyoto. Reflections on the pond are stunning.", cost:"¥500", confirmed:true },
  { id:"e33", dayDate:"2025-04-10", title:"Nishiki Market food walk",     startTime:"11:00",endTime:"13:00", category:"food",          location:"Nishiki Market, Nakagyo, Kyoto",     notes:"Kyoto's kitchen. Pickles, tofu, skewered food, mochi, dashi. Go hungry!",   cost:"¥2,500", confirmed:false },
  { id:"e34", dayDate:"2025-04-10", title:"Pontocho Alley browse",        startTime:"15:00",endTime:"17:00", category:"sightseeing",   location:"Pontocho, Nakagyo, Kyoto",           notes:"Narrow lantern-lit alley. Atmosphere is best at dusk — perfect for photos.",cost:"Free",   confirmed:false },
  { id:"e35", dayDate:"2025-04-10", title:"Gion Corner cultural show",    startTime:"19:00",endTime:"20:30", category:"entertainment", location:"Gion Corner, Higashiyama, Kyoto",    notes:"Traditional arts: tea ceremony, court music, geisha dance. Book in advance.",cost:"¥3,150", confirmed:false },
  // Apr 11
  { id:"e36", dayDate:"2025-04-11", title:"Rent bikes near Kyoto Station",startTime:"09:00",endTime:"09:30", category:"transport",     location:"Kyoto Station, Shimogyo",            notes:"Cogicogi or Kyoto E-Bike — day rental ¥1,500. Helmet included.",             cost:"¥1,500", confirmed:false },
  { id:"e37", dayDate:"2025-04-11", title:"Fushimi Sake District",        startTime:"10:00",endTime:"12:00", category:"sightseeing",   location:"Fushimi, Kyoto",                     notes:"White walls, canal, sake breweries. Gekkeikan Okura Museum has tastings.",   cost:"¥600",   confirmed:false },
  { id:"e38", dayDate:"2025-04-11", title:"Sake brewery lunch",           startTime:"12:30",endTime:"14:00", category:"food",          location:"Fushimi, Kyoto",                     notes:"Local restaurants near the breweries serve sake + food sets.",               cost:"¥2,000", confirmed:false },
  { id:"e39", dayDate:"2025-04-11", title:"Nijo Castle",                  startTime:"14:30",endTime:"16:30", category:"sightseeing",   location:"Nijo Castle, Nakagyo, Kyoto",        notes:"UNESCO site. Famous squeaky nightingale floors. Cherry blossom trees on grounds.", cost:"¥1,030", confirmed:false },
  { id:"e40", dayDate:"2025-04-11", title:"Kyoto farewell dinner",        startTime:"18:00",endTime:"21:00", category:"food",          location:"Kyoto Station area",                 notes:"Last dinner in Kyoto — traditional kaiseki or great ramen near the station.",cost:"¥3,500", confirmed:false },
  // Apr 12
  { id:"e41", dayDate:"2025-04-12", title:"Depart Kyoto → Osaka",        startTime:"10:00",endTime:"11:30", category:"transport",     location:"Kyoto Machiya → Osaka",              notes:"Return rental car in Osaka (Budget). ~1h drive.",                            cost:"",       confirmed:true  },
  { id:"e42", dayDate:"2025-04-12", title:"Dotonbori first look",         startTime:"15:00",endTime:"17:00", category:"sightseeing",   location:"Dotonbori, Namba, Osaka",            notes:"Glico running man, giant crab, neon signs. Looks great by day, better at night.", cost:"Free", confirmed:false },
  { id:"e43", dayDate:"2025-04-12", title:"Dotonbori street food crawl",  startTime:"19:00",endTime:"22:00", category:"food",          location:"Dotonbori, Namba, Osaka",            notes:"Takoyaki from Aizuya, gyoza, okonomiyaki, cheese dogs. Osaka eats!",         cost:"¥4,000", confirmed:false },
  // Apr 13
  { id:"e44", dayDate:"2025-04-13", title:"Osaka Castle grounds",         startTime:"09:00",endTime:"11:30", category:"sightseeing",   location:"Chuo, Osaka",                        notes:"Cherry blossom park. Castle interior is worth it for panoramic city views.", cost:"¥600",   confirmed:false },
  { id:"e45", dayDate:"2025-04-13", title:"Kuromon Ichiba Market",        startTime:"11:30",endTime:"13:30", category:"food",          location:"Nihonbashi, Namba, Osaka",           notes:"Osaka's kitchen — fresh seafood, grilled things on sticks, Wagyu. Go hungry!", cost:"¥3,000", confirmed:false },
  { id:"e46", dayDate:"2025-04-13", title:"Shinsekai retro district",     startTime:"15:00",endTime:"17:00", category:"sightseeing",   location:"Shinsekai, Naniwa, Osaka",           notes:"1920s-themed neighborhood. Tsutenkaku Tower, kushikatsu restaurants.",       cost:"Free",   confirmed:false },
  { id:"e47", dayDate:"2025-04-13", title:"Dotonbori dinner",             startTime:"19:00",endTime:"22:00", category:"food",          location:"Dotonbori, Namba, Osaka",            notes:"Osaka is the food capital of Japan. Eat everything you haven't tried yet.", cost:"¥4,000", confirmed:false },
  // Apr 14
  { id:"e48", dayDate:"2025-04-14", title:"Universal Studios Japan (optional)",startTime:"09:00",endTime:"18:00",category:"entertainment",location:"Universal City, Konohana, Osaka",notes:"Wizarding World of Harry Potter + Nintendo World. Very busy — book ahead!", cost:"¥8,600+",confirmed:false },
  // Apr 15
  { id:"e49", dayDate:"2025-04-15", title:"Farewell ramen breakfast",     startTime:"08:00",endTime:"09:00", category:"food",          location:"Dotonbori, Namba, Osaka",            notes:"Last meal in Japan. Make it count — tonkotsu or miso, your call.",           cost:"¥1,200", confirmed:false },
  { id:"e50", dayDate:"2025-04-15", title:"Depart for Narita Airport",    startTime:"11:00",endTime:"14:00", category:"transport",     location:"Osaka → Narita (Shinkansen + transfer)",notes:"Leave plenty of buffer time for international departure.",                  cost:"¥6,000", confirmed:false },
  { id:"e51", dayDate:"2025-04-15", title:"Fly NRT → JFK → SRQ (return)",startTime:"17:00",endTime:"23:59", category:"transport",     location:"Narita → JFK → Sarasota",            notes:"Japan Airlines + American Airlines. Arrive Apr 15 evening ET.",              cost:"",       confirmed:true  },
];

// ─── Primitive Components ─────────────────────────────────────────────────────

function DarkCard({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-[18px] border ${className}`}
      style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a", ...style }}
    >
      {children}
    </div>
  );
}

function FieldInput({
  className = "",
  style,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-[10px] px-3 py-2.5 text-sm font-bold text-white outline-none border transition-colors focus:border-[#00A8CC] placeholder-white/20 ${className}`}
      style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", ...style }}
    />
  );
}

// ─── AddEventForm ─────────────────────────────────────────────────────────────

interface AddEventFormProps {
  dayDate: string;
  onAdd: (ev: Omit<ItineraryEvent, "id">) => void;
  onCancel: () => void;
}

function AddEventForm({ dayDate, onAdd, onCancel }: AddEventFormProps) {
  const [title, setTitle]         = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime]     = useState("10:00");
  const [category, setCategory]   = useState<EventCategory>("sightseeing");
  const [location, setLocation]   = useState("");
  const [cost, setCost]           = useState("");
  const [notes, setNotes]         = useState("");
  const [confirmed, setConfirmed] = useState(false);

  function handleSave() {
    if (!title.trim()) return;
    onAdd({ dayDate, title, startTime, endTime, category, location, notes, cost, confirmed });
  }

  return (
    <DarkCard className="p-5">
      <p className="text-sm font-black text-white mb-4">New Event</p>
      <div className="flex flex-col gap-3">
        {/* Title */}
        <FieldInput
          placeholder="Event title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        {/* Category pills */}
        <div>
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Category</p>
          <div className="flex flex-wrap gap-1.5">
            {(Object.entries(CATEGORY_META) as [EventCategory, typeof CATEGORY_META[EventCategory]][]).map(
              ([key, meta]) => {
                const { Icon, label, color } = meta;
                const active = category === key;
                return (
                  <button
                    key={key}
                    onClick={() => setCategory(key)}
                    className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black transition-all border"
                    style={{
                      backgroundColor: active ? `${color}22` : "transparent",
                      borderColor: active ? color : "#484848",
                      color: active ? color : "rgba(255,255,255,0.5)",
                    }}
                  >
                    <Icon size={11} weight="fill" />
                    {label}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Times */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Start</p>
            <FieldInput type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">End</p>
            <FieldInput type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
          </div>
        </div>

        {/* Location */}
        <FieldInput
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />

        {/* Cost */}
        <FieldInput
          placeholder="Cost (e.g. ¥3,200)"
          value={cost}
          onChange={e => setCost(e.target.value)}
        />

        {/* Notes */}
        <textarea
          placeholder="Notes..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="w-full rounded-[10px] px-3 py-2.5 text-sm font-bold text-white outline-none border transition-colors focus:border-[#00A8CC] placeholder-white/20 resize-none"
          style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", minHeight: "60px" }}
        />

        {/* Confirmed toggle */}
        <button
          onClick={() => setConfirmed(c => !c)}
          className="flex items-center gap-2 self-start rounded-full px-3 py-1.5 border text-[11px] font-black transition-all"
          style={{
            backgroundColor: confirmed ? "rgba(0,201,107,0.15)" : "transparent",
            borderColor: confirmed ? "#00C96B" : "#484848",
            color: confirmed ? "#00C96B" : "rgba(255,255,255,0.4)",
          }}
        >
          <Check size={11} weight="bold" />
          {confirmed ? "Confirmed" : "Mark as confirmed"}
        </button>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-[10px] text-sm font-black text-white/50 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-[10px] text-sm font-black text-white transition-colors"
            style={{ backgroundColor: "#00A8CC" }}
          >
            Save
          </button>
        </div>
      </div>
    </DarkCard>
  );
}

// ─── EventCard ────────────────────────────────────────────────────────────────

interface EventCardProps {
  event: ItineraryEvent;
  onSave: (updated: ItineraryEvent) => void;
  onRemove: (id: string) => void;
}

function EventCard({ event, onSave, onRemove }: EventCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ItineraryEvent>(event);

  // Keep draft in sync if event prop changes externally
  const meta = CATEGORY_META[event.category];
  const { Icon, color, label } = meta;

  function handleSave() {
    onSave(draft);
    setIsEditing(false);
  }

  function handleCancel() {
    setDraft(event);
    setIsEditing(false);
  }

  if (isEditing) {
    const draftMeta = CATEGORY_META[draft.category];
    return (
      <DarkCard className="overflow-hidden flex-1">
        {/* Colored top strip */}
        <div style={{ height: "3px", backgroundColor: draftMeta.color }} />
        <div className="p-4 flex flex-col gap-3">
          <p className="text-sm font-black text-white">Edit Event</p>

          {/* Title */}
          <FieldInput
            placeholder="Event title"
            value={draft.title}
            onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
          />

          {/* Category */}
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Category</p>
            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(CATEGORY_META) as [EventCategory, typeof CATEGORY_META[EventCategory]][]).map(
                ([key, m]) => {
                  const active = draft.category === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setDraft(d => ({ ...d, category: key }))}
                      className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black transition-all border"
                      style={{
                        backgroundColor: active ? `${m.color}22` : "transparent",
                        borderColor: active ? m.color : "#484848",
                        color: active ? m.color : "rgba(255,255,255,0.5)",
                      }}
                    >
                      <m.Icon size={11} weight="fill" />
                      {m.label}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Start</p>
              <FieldInput
                type="time"
                value={draft.startTime}
                onChange={e => setDraft(d => ({ ...d, startTime: e.target.value }))}
              />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">End</p>
              <FieldInput
                type="time"
                value={draft.endTime}
                onChange={e => setDraft(d => ({ ...d, endTime: e.target.value }))}
              />
            </div>
          </div>

          {/* Location */}
          <FieldInput
            placeholder="Location"
            value={draft.location}
            onChange={e => setDraft(d => ({ ...d, location: e.target.value }))}
          />

          {/* Cost */}
          <FieldInput
            placeholder="Cost (e.g. ¥3,200)"
            value={draft.cost}
            onChange={e => setDraft(d => ({ ...d, cost: e.target.value }))}
          />

          {/* Notes */}
          <textarea
            placeholder="Notes..."
            value={draft.notes}
            onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
            className="w-full rounded-[10px] px-3 py-2.5 text-sm font-bold text-white outline-none border transition-colors focus:border-[#00A8CC] placeholder-white/20 resize-none"
            style={{ backgroundColor: "#1e1e1e", borderColor: "#3a3a3a", minHeight: "60px" }}
          />

          {/* Confirmed toggle */}
          <button
            onClick={() => setDraft(d => ({ ...d, confirmed: !d.confirmed }))}
            className="flex items-center gap-2 self-start rounded-full px-3 py-1.5 border text-[11px] font-black transition-all"
            style={{
              backgroundColor: draft.confirmed ? "rgba(0,201,107,0.15)" : "transparent",
              borderColor: draft.confirmed ? "#00C96B" : "#484848",
              color: draft.confirmed ? "#00C96B" : "rgba(255,255,255,0.4)",
            }}
          >
            <Check size={11} weight="bold" />
            {draft.confirmed ? "Confirmed" : "Mark as confirmed"}
          </button>

          {/* Action row */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => onRemove(event.id)}
              className="flex items-center gap-1.5 text-sm font-black transition-colors"
              style={{ color: "#ef4444" }}
            >
              <Trash size={14} weight="fill" />
              Delete
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-[10px] text-sm font-black text-white/50 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-[10px] text-sm font-black text-white transition-colors"
                style={{ backgroundColor: "#00A8CC" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </DarkCard>
    );
  }

  // Compact view
  return (
    <DarkCard className="overflow-hidden flex-1">
      {/* Colored top strip */}
      <div style={{ height: "3px", backgroundColor: color }} />
      <div className="p-3.5">
        {/* Top row: category badge + time range + confirmed + edit */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black border"
              style={{
                backgroundColor: `${color}18`,
                borderColor: `${color}40`,
                color,
              }}
            >
              <Icon size={10} weight="fill" />
              {label}
            </span>
            <span className="text-[10px] font-black" style={{ color: "rgba(255,255,255,0.35)" }}>
              {event.startTime} – {event.endTime}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {event.confirmed ? (
              <span
                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black border"
                style={{
                  backgroundColor: "rgba(0,201,107,0.12)",
                  borderColor: "rgba(0,201,107,0.3)",
                  color: "#00C96B",
                }}
              >
                <Check size={9} weight="bold" />
                Confirmed
              </span>
            ) : (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-black border"
                style={{
                  backgroundColor: "rgba(255,140,0,0.1)",
                  borderColor: "rgba(255,140,0,0.25)",
                  color: "#FF8C00",
                }}
              >
                Tentative
              </span>
            )}
            <button
              onClick={() => { setDraft(event); setIsEditing(true); }}
              className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              <PencilSimple size={13} weight="fill" />
            </button>
          </div>
        </div>

        {/* Title */}
        <p className="text-sm font-black text-white mb-1.5 leading-snug">{event.title}</p>

        {/* Location */}
        {event.location && (
          <div className="flex items-center gap-1 mb-1.5">
            <MapPin size={10} weight="fill" style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>{event.location}</span>
          </div>
        )}

        {/* Cost + notes snippet */}
        {(event.cost || event.notes) && (
          <div className="flex items-center gap-2 flex-wrap mt-1">
            {event.cost && (
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-black border"
                style={{
                  backgroundColor: "rgba(255,214,0,0.1)",
                  borderColor: "rgba(255,214,0,0.25)",
                  color: "#FFD600",
                }}
              >
                {event.cost}
              </span>
            )}
            {event.notes && (
              <span
                className="text-[10px] truncate max-w-[180px]"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {event.notes.slice(0, 60)}{event.notes.length > 60 ? "…" : ""}
              </span>
            )}
          </div>
        )}
      </div>
    </DarkCard>
  );
}

// ─── ItineraryShell ───────────────────────────────────────────────────────────

export default function ItineraryShell() {
  const [events, setEvents]             = useState<ItineraryEvent[]>(MOCK_EVENTS);
  const [activeDayDate, setActiveDayDate] = useState("2025-04-03");
  const [mobileView, setMobileView]     = useState<"list" | "detail">("list");
  const [addingEvent, setAddingEvent]   = useState(false);

  // ── Derived coverage ───────────────────────────────────────────────────────
  const daysWithEvents   = TRIP_DAYS.filter(d => events.some(e => e.dayDate === d.date)).length;
  const coveragePct      = Math.round((daysWithEvents / TRIP_DAYS.length) * 100);
  const coverageLabel    = coveragePct === 0 ? "None" : coveragePct < 50 ? "Partial" : coveragePct < 85 ? "Good" : "Complete";
  const coverageColor    = coveragePct === 0 ? "#9CA3AF" : coveragePct < 50 ? "#FF8C00" : coveragePct < 85 ? "#FFD600" : "#00C96B";
  const totalEventCount  = events.length;

  // ── Event handlers ─────────────────────────────────────────────────────────
  function addEvent(ev: Omit<ItineraryEvent, "id">) {
    setEvents(prev => [...prev, { ...ev, id: Date.now().toString() }]);
    setAddingEvent(false);
  }

  function saveEvent(updated: ItineraryEvent) {
    setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
  }

  function removeEvent(id: string) {
    setEvents(prev => prev.filter(e => e.id !== id));
  }

  // ── Active day data ────────────────────────────────────────────────────────
  const activeDay = TRIP_DAYS.find(d => d.date === activeDayDate) ?? TRIP_DAYS[0];
  const dayEvents = events
    .filter(e => e.dayDate === activeDayDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const formattedDate = new Date(activeDayDate + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  // ── Day List Panel ─────────────────────────────────────────────────────────
  const DayListPanel = (
    <div className="flex flex-col h-full">
      {/* Mini trip summary */}
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "#333333" }}>
        <p className="text-[11px] font-black" style={{ color: "rgba(255,255,255,0.4)" }}>
          Japan Spring 2025 · Apr 1–15 · 15 days
        </p>
        {/* Destination legend */}
        <div className="flex items-center gap-3 mt-2">
          {DEST_RANGES.map(dest => (
            <div key={dest.name} className="flex items-center gap-1.5">
              <div className="rounded-full w-2 h-2 flex-shrink-0" style={{ backgroundColor: dest.color }} />
              <span className="text-[10px] font-black" style={{ color: "rgba(255,255,255,0.4)" }}>
                {dest.name.split(",")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Day rows */}
      <div className="flex-1 overflow-y-auto scrollbar-dark py-2">
        {TRIP_DAYS.map(day => {
          const isActive = day.date === activeDayDate;
          const dayEventsCount = events.filter(e => e.dayDate === day.date).length;

          return (
            <button
              key={day.date}
              onClick={() => {
                setActiveDayDate(day.date);
                setMobileView("detail");
                setAddingEvent(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] mx-1 transition-all text-left"
              style={{
                width: "calc(100% - 8px)",
                backgroundColor: isActive ? "rgba(0,168,204,0.08)" : "transparent",
                border: isActive ? "1px solid rgba(0,168,204,0.2)" : "1px solid transparent",
              }}
            >
              {/* Destination color dot */}
              <div
                className="rounded-full flex-shrink-0"
                style={{ width: "8px", height: "8px", backgroundColor: day.destColor }}
              />

              {/* Day number block */}
              <div className="flex flex-col items-center leading-none flex-shrink-0" style={{ minWidth: "32px" }}>
                <span
                  className="uppercase tracking-widest leading-none"
                  style={{ fontSize: "9px", fontWeight: 900, color: "rgba(255,255,255,0.35)" }}
                >
                  {day.weekday}
                </span>
                <span
                  className="leading-tight"
                  style={{ fontSize: "20px", fontFamily: "var(--font-fredoka)", color: isActive ? "#00A8CC" : "white", lineHeight: 1 }}
                >
                  {day.dayOfMonth}
                </span>
                <span
                  className="uppercase tracking-widest leading-none"
                  style={{ fontSize: "9px", fontWeight: 900, color: "rgba(255,255,255,0.35)" }}
                >
                  {day.monthShort}
                </span>
              </div>

              {/* Destination name */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[11px] font-black truncate"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {day.destination.split(",")[0]}
                </p>
              </div>

              {/* Event count badge */}
              {dayEventsCount > 0 ? (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-black flex-shrink-0"
                  style={{
                    backgroundColor: `${day.destColor}22`,
                    color: day.destColor,
                  }}
                >
                  {dayEventsCount}
                </span>
              ) : (
                <span
                  className="text-[11px] font-black flex-shrink-0"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  —
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  // ── Day Timeline Panel ─────────────────────────────────────────────────────
  const DayTimelinePanel = (
    <div className="flex-1 overflow-y-auto scrollbar-dark">
      {/* Mobile back button */}
      <div className="md:hidden px-4 pt-4 pb-2">
        <button
          onClick={() => setMobileView("list")}
          className="flex items-center gap-2 text-sm font-black transition-colors"
          style={{ color: "#00A8CC" }}
        >
          <ArrowLeft size={16} weight="bold" />
          All Days
        </button>
      </div>

      {/* Day header */}
      <div className="px-5 pt-5 pb-4">
        <h2
          className="text-white leading-tight mb-1"
          style={{ fontSize: "26px", fontFamily: "var(--font-fredoka)" }}
        >
          {formattedDate}
        </h2>

        {/* Subtitle row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div
              className="rounded-full"
              style={{ width: "8px", height: "8px", backgroundColor: activeDay.destColor }}
            />
            <span
              className="text-sm font-black"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {activeDay.destination}
            </span>
          </div>
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-black border"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              borderColor: "#3a3a3a",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            Day {activeDay.dayNum} of {TRIP_DAYS.length}
          </span>
        </div>

        {/* Colored underline */}
        <div
          className="mt-3 rounded-full"
          style={{ height: "3px", width: "48px", backgroundColor: activeDay.destColor }}
        />
      </div>

      {/* Events or empty state */}
      <div className="px-5 pb-6">
        {dayEvents.length === 0 && !addingEvent ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div
              className="rounded-full flex items-center justify-center border-2 border-dashed"
              style={{ width: "72px", height: "72px", borderColor: "#3a3a3a" }}
            >
              <CalendarBlank size={28} weight="fill" style={{ color: "rgba(255,255,255,0.2)" }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-white/40">No events for {formattedDate}</p>
              <p className="text-xs text-white/25 mt-1">Be the first to add something</p>
            </div>
            <button
              onClick={() => setAddingEvent(true)}
              className="flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-sm font-black text-white transition-colors"
              style={{ backgroundColor: "#00A8CC" }}
            >
              <Plus size={14} weight="bold" />
              Add the first event
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {dayEvents.map(event => (
              <div key={event.id} className="flex gap-3 items-start">
                {/* Time column */}
                <div
                  className="flex flex-col items-end pt-3.5 flex-shrink-0"
                  style={{ width: "56px" }}
                >
                  <span
                    className="leading-none"
                    style={{ fontSize: "11px", fontWeight: 900, color: "rgba(255,255,255,0.4)" }}
                  >
                    {event.startTime}
                  </span>
                  <span
                    className="leading-none mt-0.5"
                    style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.25)" }}
                  >
                    {event.endTime}
                  </span>
                </div>

                {/* Event card */}
                <EventCard
                  event={event}
                  onSave={saveEvent}
                  onRemove={removeEvent}
                />
              </div>
            ))}

            {/* Add event form */}
            {addingEvent && (
              <div className="flex gap-3 items-start">
                <div style={{ width: "56px" }} className="flex-shrink-0" />
                <div className="flex-1">
                  <AddEventForm
                    dayDate={activeDayDate}
                    onAdd={addEvent}
                    onCancel={() => setAddingEvent(false)}
                  />
                </div>
              </div>
            )}

            {/* Add event button */}
            {!addingEvent && (
              <div className="flex gap-3 items-start mt-2">
                <div style={{ width: "56px" }} className="flex-shrink-0" />
                <button
                  onClick={() => setAddingEvent(true)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-[18px] py-4 border-2 border-dashed text-sm font-black transition-all hover:border-[#00A8CC]/50 hover:text-[#00A8CC]"
                  style={{ borderColor: "#3a3a3a", color: "rgba(255,255,255,0.3)" }}
                >
                  <Plus size={14} weight="bold" />
                  Add event for {formattedDate}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#1e1e1e" }}>
      {/* Page header */}
      <div
        className="sticky top-14 z-10 border-b px-5 py-4 flex items-center justify-between"
        style={{ backgroundColor: "#282828", borderColor: "#333333" }}
      >
        <div>
          <h1
            className="text-white leading-tight"
            style={{ fontSize: "clamp(24px, 4vw, 32px)", fontFamily: "var(--font-fredoka)" }}
          >
            Itinerary
          </h1>
          <p className="text-sm font-black mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            Day-by-day schedule · Anyone can suggest
          </p>
        </div>

        {/* Coverage badge */}
        <div
          className="flex flex-col items-end gap-0.5 rounded-[14px] px-4 py-2.5 border"
          style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "#3a3a3a" }}
        >
          <span className="text-[11px] font-black" style={{ color: "rgba(255,255,255,0.35)" }}>
            {totalEventCount} events
          </span>
          <span className="text-sm font-black" style={{ color: coverageColor }}>
            Coverage: {coverageLabel}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 relative">
        {/* ── Desktop: two-panel layout ── */}
        <div
          className="hidden md:flex flex-col border-r flex-shrink-0 scrollbar-dark"
          style={{
            width: "260px",
            position: "sticky",
            top: "56px",
            height: "calc(100vh - 56px)",
            overflowY: "auto",
            backgroundColor: "#252525",
            borderColor: "#333333",
          }}
        >
          {DayListPanel}
        </div>

        {/* Desktop right panel */}
        <div className="hidden md:flex flex-1 flex-col scrollbar-dark" style={{ overflowY: "auto" }}>
          {DayTimelinePanel}
        </div>

        {/* ── Mobile: single column ── */}
        <div className="md:hidden flex-1 flex flex-col">
          {mobileView === "list" ? (
            <div
              className="flex flex-col"
              style={{ backgroundColor: "#252525", minHeight: "100%" }}
            >
              {DayListPanel}
            </div>
          ) : (
            <div className="flex flex-col" style={{ backgroundColor: "#1e1e1e", minHeight: "100%" }}>
              {DayTimelinePanel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
