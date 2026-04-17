"use client";

import {
  Mountains, ForkKnife, Airplane, House, ShoppingBag, Ticket, Sun, MapPin,
} from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EventCategory =
  | "sightseeing"
  | "food"
  | "transport"
  | "lodging"
  | "shopping"
  | "entertainment"
  | "free"
  | "other";

export interface ScheduleEvent {
  id: string;
  dayDate: string;       // "2025-04-01"
  title: string;
  startTime: string;     // "09:00"
  endTime?: string;      // optional
  category: EventCategory;
  location: string;
  notes: string;
  cost: string;          // "¥3,000", "Free", or ""
  confirmed: boolean;
}

export interface TripDay {
  date: string;
  dayNum: number;
  destination: string;   // full name: "Tokyo, Japan"
  destColor: string;
  weekday: string;
  dayOfMonth: number;
  monthShort: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const CATEGORY_META: Record<
  EventCategory,
  { label: string; Icon: PhosphorIcon; color: string }
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

// short: used in Vacation Days left panel labels and day metadata
export const DEST_RANGES = [
  { name: "Tokyo, Japan",  short: "Tokyo",  color: "#FF2D8B", from: "2025-04-01", to: "2025-04-07" },
  { name: "Kyoto, Japan",  short: "Kyoto",  color: "#FFD600", from: "2025-04-08", to: "2025-04-11" },
  { name: "Osaka, Japan",  short: "Osaka",  color: "#00C96B", from: "2025-04-12", to: "2025-04-15" },
];

// Dates that are travel/transit days — excluded from Vacation Days list
export const TRAVEL_DATES = new Set(["2025-04-01", "2025-04-08", "2025-04-15"]);

// ─── Trip Days ────────────────────────────────────────────────────────────────

const TRIP_START = "2025-04-01";
const TRIP_END   = "2025-04-15";

export function generateTripDays(): TripDay[] {
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

    const dest = DEST_RANGES.find(d => dateStr >= d.from && dateStr <= d.to) ?? DEST_RANGES[0];

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

export const TRIP_DAYS = generateTripDays();

// ─── Mock Events (single source of truth for both Itinerary and Vacation Days) ─

export const MOCK_EVENTS: ScheduleEvent[] = [
  // Apr 1 — Travel Day
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
  // Apr 8 — Travel Day (Kyoto)
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
  // Apr 15 — Travel Day (return)
  { id:"e49", dayDate:"2025-04-15", title:"Farewell ramen breakfast",     startTime:"08:00",endTime:"09:00", category:"food",          location:"Dotonbori, Namba, Osaka",            notes:"Last meal in Japan. Make it count — tonkotsu or miso, your call.",           cost:"¥1,200", confirmed:false },
  { id:"e50", dayDate:"2025-04-15", title:"Depart for Narita Airport",    startTime:"11:00",endTime:"14:00", category:"transport",     location:"Osaka → Narita (Shinkansen + transfer)",notes:"Leave plenty of buffer time for international departure.",                  cost:"¥6,000", confirmed:false },
  { id:"e51", dayDate:"2025-04-15", title:"Fly NRT → JFK → SRQ (return)",startTime:"17:00",endTime:"23:59", category:"transport",     location:"Narita → JFK → Sarasota",            notes:"Japan Airlines + American Airlines. Arrive Apr 15 evening ET.",              cost:"",       confirmed:true  },
];
