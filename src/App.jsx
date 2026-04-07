import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import confetti from 'canvas-confetti'
import { supabase } from './supabaseClient'
import './App.css'

const SEED_EVENT = {
  id: 'rage-room-seed',
  name: "Rage Room Activation",
  dates: "March 30 – April 2",
  location: "Various locations Downtown and Midtown Manhattan",
  phases: [
    { label: "Hype Up", dates: "March 30 + 31", time: "9AM–5PM" },
    { label: "Activation", dates: "April 1 + 2", time: "8AM–5PM" },
  ],
  staff: [
    { role: "Producer", name: "Brett Weinstein", phone: "847-637-6049", email: "brett@capecreative.co" },
    { role: "Lead Content Producer", name: "Faith King", phone: "310-413-3381", email: "faith@capecreative.co" },
    { role: "Co Content Producer", name: "Korina Carpenter", phone: "850-351-5838", email: "korina@capecreative.co" },
    { role: "Co Producer", name: "Josh Wilson", phone: "201-316-3782", email: "josh@capecreative.co" },
    { role: "Co Producer / LY Brand Ambassador", name: "Liz Stiles", phone: "201-988-6178", email: "liz@capecreative.co" },
    { role: "Co Producer", name: "Seth Levine", phone: "438-872-1424", email: "seth@capecreative.co" },
    { role: "Production Assistant", name: "Assess if needed", phone: "", email: "" },
  ],
  days: [
    {
      id: "mon", label: "Monday, March 30", shortLabel: "Mon 3/30", subtitle: "Hype Day 1 — Downtown", phase: "hype",
      items: [
        { time: "9:30 AM", action: "Brett and Faith meet at 53 Bridge St. with truck", dri: "Brett", notes: "" },
        { time: "9:30 AM – 1:00 PM", action: "Drive around downtown activation locations, hand out business cards and generate buzz around activation + content capture", dri: "Brett and Faith", notes: "" },
        { time: "1:15 PM – 1:45 PM", action: "Lunch", dri: "Brett", notes: "" },
        { time: "1:45 – 4:30 PM", action: "Drive around downtown activation locations, hand out business cards and generate buzz around activation + content capture", dri: "Brett and Faith", notes: "" },
        { time: "4:30 – 5:00 PM", action: "Drive back to office + park truck", dri: "", notes: "" },
      ]
    },
    {
      id: "tue", label: "Tuesday, March 31", shortLabel: "Tue 3/31", subtitle: "Hype Day 2 — Midtown", phase: "hype",
      items: [
        { time: "9:30 AM", action: "Brett and Faith meet at 53 Bridge St. with truck", dri: "Brett", notes: "" },
        { time: "9:30 AM – 1:00 PM", action: "Drive around Midtown activation locations, hand out business cards and generate buzz around activation + content capture", dri: "Brett and Faith", notes: "" },
        { time: "1:15 PM – 1:45 PM", action: "Lunch", dri: "Brett", notes: "" },
        { time: "1:45 – 4:30 PM", action: "Drive around Midtown activation locations, hand out business cards and generate buzz around activation + content capture", dri: "Brett and Faith", notes: "" },
        { time: "4:30 – 5:30 PM", action: "Drive back to office — Load up all pieces of activation into truck", dri: "Brett + Office Crew", notes: "Production kit, smashable props, mini bat giveaways, release forms" },
        { time: "5:30 – 6:00 PM", action: "Park Truck", dri: "Brett", notes: "" },
      ]
    },
    {
      id: "wed", label: "Wednesday, April 1", shortLabel: "Wed 4/1", subtitle: "Activation Day 1 — Downtown", phase: "activation",
      items: [
        { time: "8:00 AM", action: "Pick up truck and drive to CC Rental", dri: "Brett", notes: "" },
        { time: "9:00 AM", action: "Team meets at CC rental (100 W. 17th St. Manhattan). Pick up rental van", dri: "Brett + Josh", notes: "" },
        { time: "9:00 – 9:15 AM", action: "Load items stored in box truck into rental van and divide teams between vehicles. Head to first location at corner of Water St. and Pine St.", dri: "Brett + Josh", notes: "" },
        { time: "9:30 AM – 11:30 AM", action: "Engage Activation at Water St. and Pine St.", dri: "Brett + Josh", notes: "Pivot to 77 Water St. if required to move" },
        { time: "11:30 AM – 1:30 PM", action: "Move to downtown location #2 at 140 Broadway St. (Broadway between Liberty and Cedar). Engage Activation", dri: "Brett + Josh", notes: "Pivot to corner of Front St. and Maiden Lane if required to move" },
        { time: "1:30 – 2:00 PM", action: "Lunch", dri: "Brett", notes: "" },
        { time: "2:00 – 3:30 PM", action: "Move to downtown location #3 (Arrie's office in Soho). Planned Activation with team from (Arrie's Company)", dri: "Brett", notes: "" },
        { time: "3:30 – 4:30 PM", action: "Load remaining items from rental van into truck. Assess wins and losses from the day to determine what can be done better for day 2. Return rental van and park truck", dri: "Brett + Josh", notes: "Pick up more smashable supplies at Big Reuse if needed." },
      ]
    },
    {
      id: "thu", label: "Thursday, April 2", shortLabel: "Thu 4/2", subtitle: "Activation Day 2 — Midtown", phase: "activation",
      items: [
        { time: "8:00 AM", action: "Pick up truck and drive to CC Rental", dri: "Brett", notes: "" },
        { time: "9:00 AM", action: "Team meets at CC rental (100 W. 17th St. Manhattan). Pick up rental van", dri: "Brett + Josh", notes: "" },
        { time: "9:00 – 9:15 AM", action: "Load items stored in box truck into rental van and divide teams between vehicles. Head to first location at Madison Ave. and 47th St.", dri: "Brett + Josh", notes: "" },
        { time: "9:30 AM – 11:30 AM", action: "Engage Activation at Madison Ave and 47th St.", dri: "Brett + Josh", notes: "Pivot to corner of 49th St. and 6th Ave if required to move" },
        { time: "11:30 AM – 1:30 PM", action: "Move to Midtown location #2 at corner of 50th St. and 6th Ave. (on 50th East of 6th Ave.)", dri: "Brett + Josh", notes: "Pivot to corner of 49th St. and 6th Ave if required to move" },
        { time: "1:30 – 2:00 PM", action: "Lunch", dri: "Brett", notes: "" },
        { time: "2:00 – 3:30 PM", action: "Move to Midtown location #3 at 777 3rd Ave.", dri: "Brett", notes: "Pivot to corner of 49th St. and 6th Ave if required to move" },
        { time: "3:30 – 4:30 PM", action: "Load remaining items from rental van into truck. Assess wins and losses from the day. Return rental van and park truck", dri: "Brett + Josh", notes: "" },
      ]
    },
  ],
}

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6) }

// ─── Supabase Data Layer ───

async function dbLoadEvents() {
  const { data, error } = await supabase.from('events').select('*').order('created_at')
  if (error) { console.error('Load events error:', error); return [SEED_EVENT] }
  if (!data || data.length === 0) return [SEED_EVENT]
  return data.map(row => ({ ...row.data, id: row.id }))
}

async function dbSaveEvent(event) {
  const { id, ...rest } = event
  const { error } = await supabase.from('events').upsert({ id, data: event, updated_at: new Date().toISOString() }, { onConflict: 'id' })
  if (error) console.error('Save event error:', error)
}

async function dbDeleteEvent(id) {
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) console.error('Delete event error:', error)
}

async function dbLoadTrash() {
  const { data, error } = await supabase.from('trash').select('*').order('deleted_at')
  if (error) { console.error('Load trash error:', error); return [] }
  return (data || []).map(row => ({ ...row.data, id: row.id }))
}

async function dbSaveToTrash(event) {
  const { id, ...rest } = event
  const { error } = await supabase.from('trash').upsert({ id, data: event, deleted_at: new Date().toISOString() }, { onConflict: 'id' })
  if (error) console.error('Save trash error:', error)
}

async function dbDeleteFromTrash(id) {
  const { error } = await supabase.from('trash').delete().eq('id', id)
  if (error) console.error('Delete trash error:', error)
}

async function dbEmptyTrash() {
  const { error } = await supabase.from('trash').delete().neq('id', '')
  if (error) console.error('Empty trash error:', error)
}

async function dbLoadArchived() {
  const { data, error } = await supabase.from('archived').select('*').order('archived_at')
  if (error) { console.error('Load archived error:', error); return [] }
  return (data || []).map(row => ({ ...row.data, id: row.id }))
}

async function dbSaveToArchive(event) {
  const { id } = event
  const { error } = await supabase.from('archived').upsert({ id, data: event, archived_at: new Date().toISOString() }, { onConflict: 'id' })
  if (error) console.error('Save archive error:', error)
}

async function dbDeleteFromArchive(id) {
  const { error } = await supabase.from('archived').delete().eq('id', id)
  if (error) console.error('Delete archive error:', error)
}

async function dbLoadCompleted(eventId) {
  const { data, error } = await supabase.from('completed').select('completed').eq('event_id', eventId).single()
  if (error && error.code !== 'PGRST116') console.error('Load completed error:', error)
  return data?.completed || {}
}

async function dbSaveCompleted(eventId, completed) {
  const { error } = await supabase.from('completed').upsert({ event_id: eventId, completed }, { onConflict: 'event_id' })
  if (error) console.error('Save completed error:', error)
}

async function dbDeleteCompleted(eventId) {
  const { error } = await supabase.from('completed').delete().eq('event_id', eventId)
  if (error) console.error('Delete completed error:', error)
}

// ─── Pencil Icon ───
const PencilIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
  </svg>
)

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
)

const RestoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
  </svg>
)

const ArchiveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
  </svg>
)

const PHASE_PRESETS = ['Pre-Production', 'Production', 'Post-Production']

function PhaseSelect({ value, onChange }) {
  const [custom, setCustom] = useState(false)
  const isCustom = custom || (value && !PHASE_PRESETS.includes(value))

  if (isCustom) {
    return (
      <div className="phase-select-row">
        <input className="form-input" value={value} onChange={e => onChange(e.target.value)} placeholder="Custom phase name" autoFocus />
        <button className="btn-small" onClick={() => { onChange(''); setCustom(false) }} title="Use preset">Presets</button>
      </div>
    )
  }

  return (
    <select className="form-input" value={value} onChange={e => {
      if (e.target.value === '__custom__') { setCustom(true); onChange('') }
      else onChange(e.target.value)
    }}>
      <option value="">Select phase...</option>
      {PHASE_PRESETS.map(p => <option key={p} value={p}>{p}</option>)}
      <option value="__custom__">+ Custom...</option>
    </select>
  )
}

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

// ─── Weather Widget ───
const WMO_CODES = {
  0: { label: 'Clear', icon: '☀️' }, 1: { label: 'Mostly Clear', icon: '🌤️' },
  2: { label: 'Partly Cloudy', icon: '⛅' }, 3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Fog', icon: '🌫️' }, 48: { label: 'Rime Fog', icon: '🌫️' },
  51: { label: 'Light Drizzle', icon: '🌦️' }, 53: { label: 'Drizzle', icon: '🌦️' },
  55: { label: 'Heavy Drizzle', icon: '🌧️' },
  61: { label: 'Light Rain', icon: '🌦️' }, 63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Heavy Rain', icon: '🌧️' },
  71: { label: 'Light Snow', icon: '🌨️' }, 73: { label: 'Snow', icon: '❄️' },
  75: { label: 'Heavy Snow', icon: '❄️' },
  80: { label: 'Rain Showers', icon: '🌧️' }, 81: { label: 'Showers', icon: '🌧️' },
  82: { label: 'Heavy Showers', icon: '⛈️' },
  95: { label: 'Thunderstorm', icon: '⛈️' }, 96: { label: 'T-Storm w/ Hail', icon: '⛈️' },
  99: { label: 'T-Storm w/ Hail', icon: '⛈️' },
}

function getWeatherInfo(code) {
  return WMO_CODES[code] || { label: 'Unknown', icon: '🌡️' }
}

// Parse a date string from a day label like "Monday, March 30", "1/29/2026 (TRAVEL DAY)", "FRIDAY, JANUARY 30 (LOAD IN DAY 1)", "Thursday, January 29"
function parseDayDate(dateLabel) {
  if (!dateLabel) return null
  // Try mm/dd/yyyy format first (e.g. "1/29/2026 (TRAVEL DAY)")
  const slashMatch = dateLabel.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/)
  if (slashMatch) return new Date(+slashMatch[3], +slashMatch[1] - 1, +slashMatch[2])
  // Strip day name prefix and parenthetical suffixes: "FRIDAY, JANUARY 30 (LOAD IN DAY 1)" → "JANUARY 30"
  let cleaned = dateLabel.replace(/\(.*?\)/g, '').replace(/\s*-\s*EVENT.*$/i, '').replace(/\s*-\s*LOAD.*$/i, '').replace(/\s*-\s*LAST.*$/i, '').replace(/\s*-\s*DARK.*$/i, '').trim()
  cleaned = cleaned.replace(/^[A-Za-z]+,?\s*/, '') // strip leading day name
  // Try parsing what remains (e.g. "January 30" or "March 30, 2025")
  const hasYear = cleaned.match(/\d{4}/)
  const parsed = new Date(cleaned + (hasYear ? '' : ', ' + new Date().getFullYear()))
  if (!isNaN(parsed)) return parsed
  return null
}

// Extract a geocodable location from a full location string
function cleanLocation(location) {
  // "TPC Scottsdale: 17020 Hayden Rd. Scottsdale, AZ 85255 | Greenskeeper Tent" → "Scottsdale AZ"
  // "Various locations Downtown and Midtown Manhattan" → "Manhattan"
  let loc = location
  // Take part before | or after :
  if (loc.includes('|')) loc = loc.split('|')[0]
  if (loc.includes(':')) loc = loc.split(':').slice(1).join(':')
  // Remove street addresses (numbers + road words)
  loc = loc.replace(/\d{3,}[\w\s.]*(?:rd|st|ave|blvd|dr|ln|ct|way|pkwy|hwy)\b\.?/gi, '')
  // Remove zip codes
  loc = loc.replace(/\b\d{5}(-\d{4})?\b/g, '')
  // Remove filler words
  loc = loc.replace(/\b(various|locations?|downtown|midtown|uptown|and|the)\b/gi, '').trim()
  // Clean up whitespace
  loc = loc.replace(/,\s*,/g, ',').replace(/\s+/g, ' ').replace(/^[,\s]+|[,\s]+$/g, '')
  return loc || location
}

function WeatherBadge({ location, dateLabel }) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!location || !dateLabel) return
    const parsed = parseDayDate(dateLabel)
    if (!parsed) return

    const dateStr = parsed.toISOString().split('T')[0]
    const cacheKey = `poncho-weather-${location}-${dateStr}`
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) { setWeather(JSON.parse(cached)); return }

    setLoading(true)
    const searchLoc = cleanLocation(location)
    const isPast = parsed < new Date(new Date().toDateString())
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchLoc)}&count=1`)
      .then(r => r.json())
      .then(geo => {
        if (!geo.results?.length) { setLoading(false); return }
        const { latitude, longitude } = geo.results[0]
        const apiUrl = isPast
          ? `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&start_date=${dateStr}&end_date=${dateStr}&timezone=auto`
          : `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&start_date=${dateStr}&end_date=${dateStr}&timezone=auto`
        return fetch(apiUrl)
      })
      .then(r => r?.json())
      .then(data => {
        if (!data?.daily) { setLoading(false); return }
        const w = {
          code: data.daily.weather_code[0],
          high: Math.round(data.daily.temperature_2m_max[0]),
          low: Math.round(data.daily.temperature_2m_min[0]),
          precip: data.daily.precipitation_probability_max?.[0] ?? null,
        }
        sessionStorage.setItem(cacheKey, JSON.stringify(w))
        setWeather(w)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [location, dateLabel])

  if (loading) return <span className="weather-badge loading">☁️ Loading weather…</span>
  if (!weather) return null

  const info = getWeatherInfo(weather.code)
  return (
    <div className="weather-badge" title="Forecast for event location on this day">
      <span className="weather-heading">Weather:</span>
      <span className="weather-icon">{info.icon}</span>
      <span className="weather-temp">{weather.high}°/{weather.low}°F</span>
      <span className="weather-label">{info.label}</span>
      {weather.precip != null && weather.precip > 0 && <span className="weather-precip">💧 {weather.precip}%</span>}
    </div>
  )
}

// ─── Weather Backup Plan ───
function WeatherPlan({ day, onUpdate, viewOnly }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(day.weatherPlan || '')

  useEffect(() => { setText(day.weatherPlan || '') }, [day.weatherPlan])

  const save = () => { onUpdate(text); setEditing(false) }

  if (!day.weatherPlan && viewOnly) return null

  return (
    <div className="weather-plan">
      <div className="weather-plan-header">
        <span className="weather-plan-icon">⛈️</span>
        <span className="weather-plan-label">Weather Backup Plan</span>
        {!viewOnly && !editing && (
          <button className="icon-btn" onClick={() => setEditing(true)} title="Edit weather plan"><PencilIcon /></button>
        )}
      </div>
      {editing ? (
        <div className="weather-plan-edit">
          <textarea
            className="weather-plan-input"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Describe the backup plan if weather is bad (e.g. move indoors, tent setup, delay schedule, rain gear distribution...)"
            rows={3}
            autoFocus
          />
          <div className="weather-plan-btns">
            <button className="btn-small" onClick={save}>Save</button>
            <button className="btn-small" onClick={() => { setText(day.weatherPlan || ''); setEditing(false) }}>Cancel</button>
          </div>
        </div>
      ) : day.weatherPlan ? (
        <p className="weather-plan-text">{day.weatherPlan}</p>
      ) : !viewOnly ? (
        <button className="weather-plan-add" onClick={() => setEditing(true)}>+ Add a weather backup plan for this day</button>
      ) : null}
    </div>
  )
}

// ─── Date Range Picker ───
function formatDateRange(start, end) {
  if (!start) return ''
  const opts = { month: 'long', day: 'numeric' }
  const s = start.toLocaleDateString('en-US', opts)
  if (!end || start.getTime() === end.getTime()) return s
  const e = end.toLocaleDateString('en-US', opts)
  if (start.getMonth() === end.getMonth()) {
    return `${s} – ${end.getDate()}`
  }
  return `${s} – ${e}`
}

function parseDateRange(str) {
  if (!str) return [null, null]
  const year = new Date().getFullYear()
  const parts = str.split(/\s*[–-]\s*/)
  if (parts.length === 0) return [null, null]
  const start = new Date(parts[0] + ', ' + year)
  if (isNaN(start)) return [null, null]
  if (parts.length === 1) return [start, start]
  let end = new Date(parts[1] + ', ' + year)
  if (isNaN(end)) {
    const day = parseInt(parts[1])
    if (!isNaN(day)) {
      end = new Date(start)
      end.setDate(day)
    } else {
      return [start, start]
    }
  }
  return [start, end]
}

function DateRangeInput({ value, onChange }) {
  const parsed = parseDateRange(value)
  const [startDate, setStartDate] = useState(parsed[0])
  const [endDate, setEndDate] = useState(parsed[1])

  useEffect(() => {
    const [s, e] = parseDateRange(value)
    setStartDate(s)
    setEndDate(e)
  }, [value])

  const handleChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    if (start && end) {
      onChange(formatDateRange(start, end))
    }
  }

  return (
    <DatePicker
      selectsRange
      startDate={startDate}
      endDate={endDate}
      onChange={handleChange}
      placeholderText="Select date range"
      className="form-input"
      dateFormat="MMMM d"
    />
  )
}

// ─── Time Range Picker ───
const TIME_OPTIONS = []
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
    const ampm = h < 12 ? 'AM' : 'PM'
    const label = `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`
    TIME_OPTIONS.push(label)
  }
}

function parseTimeRange(str) {
  if (!str) return ['', '']
  const parts = str.split(/\s*[–-]\s*/)
  return [parts[0]?.trim() || '', parts[1]?.trim() || '']
}

function TimeRangeInput({ value, onChange }) {
  const [start, end] = parseTimeRange(value)
  const [startTime, setStartTime] = useState(start)
  const [endTime, setEndTime] = useState(end)

  const update = (s, e) => {
    setStartTime(s)
    setEndTime(e)
    if (s && e) onChange(`${s}–${e}`)
    else if (s) onChange(s)
  }

  return (
    <div className="time-range-row">
      <select className="form-input time-select" value={startTime} onChange={e => update(e.target.value, endTime)}>
        <option value="">Start</option>
        {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <span className="time-dash">–</span>
      <select className="form-input time-select" value={endTime} onChange={e => update(startTime, e.target.value)}>
        <option value="">End</option>
        {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
  )
}

function Logo({ onClick = null, variant = 'blue' }) {
  const src = variant === 'white' ? '/cape-logo-white-sm.png' : '/cape-logo-blue-sm.png'
  const imgClass = variant === 'white' ? 'signin-logo' : 'logo-img'
  const textStyle = variant === 'white' ? { color: 'white', fontSize: '28px' } : undefined
  const sepStyle = variant === 'white' ? { color: 'rgba(255,255,255,0.3)' } : undefined
  const wrapStyle = variant === 'white' ? { justifyContent: 'center', marginBottom: '12px' } : undefined
  const Tag = onClick || variant === 'white' ? 'div' : 'h1'
  return (
    <Tag className={`logo${onClick ? ' clickable' : ''}`} style={wrapStyle} onClick={onClick || undefined} title={onClick ? 'Back to Dashboard' : undefined}>
      <img src={src} alt="Cape" className={imgClass} />
      <span className="logo-separator" style={sepStyle}>&times;</span>
      <span className="logo-text" style={textStyle}>Poncho</span>
    </Tag>
  )
}

function Dashboard({ events, trash, archived, user, onOpenEvent, onCreateEvent, onDeleteEvent, onDuplicateEvent, onRestoreEvent, onPermanentDelete, onEmptyTrash, onArchiveEvent, onUnarchiveEvent, onPermanentDeleteArchived, onSignOut }) {
  const [showTrash, setShowTrash] = useState(false)
  const [showArchived, setShowArchived] = useState(false)

  // Build DRI scorecard across all events (async from Supabase)
  const [driScores, setDriScores] = useState([])
  useEffect(() => {
    const buildScores = async () => {
      const scores = {}
      const completedMaps = await Promise.all(events.map(ev => dbLoadCompleted(ev.id)))
      events.forEach((ev, evIdx) => {
        const completed = completedMaps[evIdx]
        ev.days?.forEach(day => {
          day.items?.forEach((item, i) => {
            if (!item.dri) return
            const dris = item.dri.split(/\s*(?:and|&|\+|,)\s*/i).map(n => n.trim()).filter(Boolean)
            dris.forEach(name => {
              if (!scores[name]) scores[name] = { total: 0, done: 0 }
              scores[name].total++
              if (completed[`${day.id}-${i}`]) scores[name].done++
            })
          })
        })
      })
      setDriScores(
        Object.entries(scores)
          .map(([name, { total, done }]) => ({ name, total, done }))
          .sort((a, b) => b.done - a.done || a.name.localeCompare(b.name))
      )
    }
    if (events.length) buildScores()
  }, [events])

  const topDone = driScores[0]?.done || 0

  return (
    <div className="dashboard">
      <div className="dash-header">
        <Logo />
        <p className="dash-tagline">Event Management Made by Pros</p>
        <div className="dash-user-bar">
          <span className="dash-user-name">
            {user?.admin ? 'Admin' : `Welcome, ${user?.name}`}
            {user?.role && !user?.admin && <span className="dash-user-role"> — {user.role}</span>}
            {user?.access === 'view' && <span className="view-only-badge">View Only</span>}
          </span>
          <button className="btn-small" onClick={onSignOut}>Sign Out</button>
        </div>
      </div>
      {user?.access !== 'view' && (
        <div className="dash-actions">
          <button className="btn-primary" onClick={onCreateEvent}>
            <PlusIcon /> New Event
          </button>
          {archived.length > 0 && (
            <button className="btn-secondary" onClick={() => setShowArchived(!showArchived)}>
              <ArchiveIcon /> Archived ({archived.length})
            </button>
          )}
          {trash.length > 0 && (
            <button className="btn-secondary trash-toggle" onClick={() => setShowTrash(!showTrash)}>
              <TrashIcon /> Recently Deleted ({trash.length})
            </button>
          )}
        </div>
      )}
      <div className="dash-grid">
        {events.map(ev => (
          <div key={ev.id} className="dash-card" onClick={() => onOpenEvent(ev.id)}>
            <div className="dash-card-top">
              <div className="dash-card-title">
                {ev.logo && <img src={ev.logo} alt="" className="event-logo-sm" />}
                <h3>{ev.name || 'Untitled Event'}</h3>
              </div>
              <div className="dash-card-actions">
                <button className="icon-btn" onClick={e => { e.stopPropagation(); onDuplicateEvent(ev.id) }} title="Duplicate event">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
                {user?.access !== 'view' && (
                  <button className="icon-btn" onClick={e => { e.stopPropagation(); onArchiveEvent(ev.id) }} title="Archive event">
                    <ArchiveIcon />
                  </button>
                )}
                {user?.access !== 'view' && (
                  <button className="icon-btn danger" onClick={e => { e.stopPropagation(); onDeleteEvent(ev.id) }} title="Delete event">
                    <TrashIcon />
                  </button>
                )}
              </div>
            </div>
            <div className="dash-card-meta">
              {ev.dates && <span>{ev.dates}</span>}
              {ev.location && <span>{ev.location}</span>}
            </div>
            <div className="dash-card-stats">
              <span>{ev.days?.length || 0} days</span>
              <span>{ev.staff?.length || 0} staff</span>
              <span>{ev.days?.reduce((a, d) => a + (d.items?.length || 0), 0) || 0} tasks</span>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="dash-empty">
            <p>No events yet. Create your first Run of Show!</p>
          </div>
        )}
      </div>

      {user?.admin && driScores.length > 0 && driScores.some(d => d.done > 0) && (
        <div className="dri-scorecard">
          <h3 className="section-title">DRI Scorecard</h3>
          <div className="dri-list">
            {driScores.filter(d => d.done > 0 || d.total > 0).map((d, i) => {
              const pct = d.total > 0 ? Math.round((d.done / d.total) * 100) : 0
              const isTop = d.done > 0 && d.done === topDone
              return (
                <div key={d.name} className={`dri-row ${isTop ? 'dri-top' : ''}`}>
                  <div className="dri-rank">{i + 1}</div>
                  <div className="dri-info">
                    <div className="dri-name-row">
                      <span className="dri-name">{d.name}</span>
                      {isTop && <span className="dri-medal" title="Most Productive DRI">🥇</span>}
                    </div>
                    <div className="dri-bar-wrap">
                      <div className="dri-bar" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="dri-score">{d.done}/{d.total}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {showArchived && archived.length > 0 && (
        <div className="trash-section">
          <div className="trash-header">
            <h3 className="section-title">Archived</h3>
          </div>
          <div className="dash-grid">
            {archived.map(ev => (
              <div key={ev.id} className="dash-card archived">
                <div className="dash-card-top">
                  <div className="dash-card-title">
                    {ev.logo && <img src={ev.logo} alt="" className="event-logo-sm" />}
                    <h3>{ev.name || 'Untitled Event'}</h3>
                  </div>
                  <div className="trash-card-actions">
                    <button className="icon-btn restore" onClick={() => onUnarchiveEvent(ev.id)} title="Restore to active">
                      <RestoreIcon />
                    </button>
                    <button className="icon-btn danger" onClick={() => onPermanentDeleteArchived(ev.id)} title="Delete permanently">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
                <div className="dash-card-meta">
                  {ev.dates && <span>{ev.dates}</span>}
                  {ev.location && <span>{ev.location}</span>}
                  {ev.archivedAt && <span className="deleted-date">Archived {new Date(ev.archivedAt).toLocaleDateString()}</span>}
                </div>
                <div className="dash-card-stats">
                  <span>{ev.days?.length || 0} days</span>
                  <span>{ev.staff?.length || 0} staff</span>
                  <span>{ev.days?.reduce((a, d) => a + (d.items?.length || 0), 0) || 0} tasks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showTrash && trash.length > 0 && (
        <div className="trash-section">
          <div className="trash-header">
            <h3 className="section-title">Recently Deleted</h3>
            <button className="btn-small danger-text" onClick={onEmptyTrash}>Empty Trash</button>
          </div>
          <div className="dash-grid">
            {trash.map(ev => (
              <div key={ev.id} className="dash-card trashed">
                <div className="dash-card-top">
                  <h3>{ev.name || 'Untitled Event'}</h3>
                  <div className="trash-card-actions">
                    <button className="icon-btn restore" onClick={() => onRestoreEvent(ev.id)} title="Restore event">
                      <RestoreIcon />
                    </button>
                    <button className="icon-btn danger" onClick={() => onPermanentDelete(ev.id)} title="Delete permanently">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
                <div className="dash-card-meta">
                  {ev.dates && <span>{ev.dates}</span>}
                  {ev.deletedAt && <span className="deleted-date">Deleted {new Date(ev.deletedAt).toLocaleDateString()}</span>}
                </div>
                <div className="dash-card-stats">
                  <span>{ev.days?.length || 0} days</span>
                  <span>{ev.staff?.length || 0} staff</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <footer className="app-footer">
        <img src="/cape-logo-blue-sm.png" alt="" className="footer-mark" />
        EVENT MANAGEMENT BY CAPE
      </footer>
    </div>
  )
}

function EventForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { name: '', dates: '', location: '', phases: [{ label: '', dates: '', time: '' }] })
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))
  const setPhase = (i, k, v) => {
    const phases = [...form.phases]
    phases[i] = { ...phases[i], [k]: v }
    set('phases', phases)
  }
  const addPhase = () => set('phases', [...form.phases, { label: '', dates: '', time: '' }])
  const removePhase = (i) => set('phases', form.phases.filter((_, j) => j !== i))

  return (
    <div className="edit-form">
      <label className="form-label">Event Name
        <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Rage Room Activation" />
      </label>
      <label className="form-label">Date Range
        <DateRangeInput value={form.dates} onChange={(v) => set('dates', v)} />
      </label>
      <label className="form-label">Location
        <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Downtown Manhattan" />
      </label>
      <div className="form-section">
        <div className="form-section-header">
          <span className="form-label">Phases</span>
          <button className="btn-small" onClick={addPhase}><PlusIcon /> Add Phase</button>
        </div>
        {form.phases.map((p, i) => (
          <div key={i} className="phase-form-block">
            <div className="form-row">
              <PhaseSelect value={p.label} onChange={v => setPhase(i, 'label', v)} />
              {form.phases.length > 1 && <button className="icon-btn danger" onClick={() => removePhase(i)}><TrashIcon /></button>}
            </div>
            <div className="form-row">
              <label className="form-label">Dates<DateRangeInput value={p.dates} onChange={v => setPhase(i, 'dates', v)} /></label>
              <label className="form-label">Time<TimeRangeInput value={p.time} onChange={v => setPhase(i, 'time', v)} /></label>
            </div>
          </div>
        ))}
      </div>
      <div className="form-actions">
        <button className="btn-primary" onClick={() => onSave(form)}>Save</button>
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

function StaffCard({ staff, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(staff)
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  if (editing) {
    return (
      <div className="staff-card editing">
        <div className="staff-edit-form">
          <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Name" />
          <input className="form-input" value={form.role} onChange={e => set('role', e.target.value)} placeholder="Role" />
          <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="Phone" />
          <input className="form-input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="Email" />
          <div className="form-actions-inline">
            <button className="btn-small primary" onClick={() => { onUpdate(form); setEditing(false) }}>Save</button>
            <button className="btn-small" onClick={() => { setForm(staff); setEditing(false) }}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="staff-card">
      <div className="staff-avatar">{staff.name.split(' ').map(n => n[0]).join('')}</div>
      <div className="staff-info">
        <div className="staff-name">{staff.name}</div>
        <div className="staff-role">{staff.role}</div>
        {staff.phone && <a className="staff-link" href={`tel:${staff.phone}`}>{staff.phone}</a>}
        {staff.email && <a className="staff-link" href={`mailto:${staff.email}`}>{staff.email}</a>}
      </div>
      {(onUpdate && onDelete) && (
        <div className="card-actions">
          <button className="icon-btn" onClick={() => setEditing(true)} title="Edit"><PencilIcon /></button>
          <button className="icon-btn danger" onClick={onDelete} title="Delete"><TrashIcon /></button>
        </div>
      )}
    </div>
  )
}

function ClientCard({ client, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(client)
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  if (editing) {
    return (
      <div className="staff-card editing">
        <div className="staff-edit-form">
          <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Name" />
          <input className="form-input" value={form.company} onChange={e => set('company', e.target.value)} placeholder="Company" />
          <input className="form-input" value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="Phone" />
          <input className="form-input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="Email" />
          <div className="form-actions-inline">
            <button className="btn-small primary" onClick={() => { onUpdate(form); setEditing(false) }}>Save</button>
            <button className="btn-small" onClick={() => { setForm(client); setEditing(false) }}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="staff-card">
      <div className="staff-avatar client-avatar">{client.name.split(' ').map(n => n[0]).join('')}</div>
      <div className="staff-info">
        <div className="staff-name">{client.name}</div>
        <div className="staff-role">{client.company || 'Client'}</div>
        {client.phone && <a className="staff-link" href={`tel:${client.phone}`}>{client.phone}</a>}
        {client.email && <a className="staff-link" href={`mailto:${client.email}`}>{client.email}</a>}
      </div>
      <div className="card-actions">
        <button className="icon-btn" onClick={() => setEditing(true)} title="Edit"><PencilIcon /></button>
        <button className="icon-btn danger" onClick={onDelete} title="Remove"><TrashIcon /></button>
      </div>
    </div>
  )
}

const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
)

function TimelineItem({ item, done, isLast, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [form, setForm] = useState(item)
  const [viewMedia, setViewMedia] = useState(null)
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const mediaItem = { url: ev.target.result, type: file.type.startsWith('video') ? 'video' : 'image', name: file.name, addedAt: Date.now() }
        onUpdate({ ...item, media: [...(item.media || []), mediaItem] })
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const removeMedia = (idx) => {
    onUpdate({ ...item, media: (item.media || []).filter((_, i) => i !== idx) })
  }

  if (editing) {
    return (
      <div className="tl-row">
        <div className="tl-left">
          <div className="tl-check" />
          {!isLast && <div className="tl-connector" />}
        </div>
        <div className="tl-card editing">
          <div className="tl-edit-grid">
            <label className="form-label">Time
              <input className="form-input" value={form.time} onChange={e => set('time', e.target.value)} />
            </label>
            <label className="form-label">DRI
              <input className="form-input" value={form.dri} onChange={e => set('dri', e.target.value)} />
            </label>
          </div>
          <label className="form-label">Action
            <textarea className="form-textarea" value={form.action} onChange={e => set('action', e.target.value)} rows={2} />
          </label>
          <label className="form-label">Notes
            <input className="form-input" value={form.notes} onChange={e => set('notes', e.target.value)} />
          </label>
          <div className="form-actions-inline">
            <button className="btn-small primary" onClick={() => { onUpdate(form); setEditing(false) }}>Save</button>
            <button className="btn-small" onClick={() => { setForm(item); setEditing(false) }}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`tl-row ${done ? 'tl-done' : ''}`}>
      <div className="tl-left">
        <button
          className={`tl-check ${done ? 'checked' : ''} ${!onToggle ? 'disabled' : ''}`}
          onClick={onToggle || undefined}
          aria-label={done ? 'Mark incomplete' : 'Mark complete'}
          disabled={!onToggle}
        >
          {done && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
        </button>
        {!isLast && <div className="tl-connector" />}
      </div>
      <div className="tl-card" onClick={() => setExpanded(!expanded)}>
        <div className="tl-card-header">
          <div className="tl-time">{item.time}</div>
          {onDelete && (
            <div className="tl-card-btns" onClick={e => e.stopPropagation()}>
              <label className="icon-btn" title="Add photo/video">
                <CameraIcon />
                <input type="file" accept="image/*,video/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
              <button className="icon-btn" onClick={() => setEditing(true)} title="Edit"><PencilIcon /></button>
              <button className="icon-btn danger" onClick={onDelete} title="Delete"><TrashIcon /></button>
            </div>
          )}
        </div>
        <div className="tl-action">{item.action}</div>
        {item.dri && <span className="dri-chip">{item.dri}</span>}
        {item.media?.length > 0 && (
          <div className="tl-media-row" onClick={e => e.stopPropagation()}>
            {item.media.map((m, idx) => (
              <div key={idx} className="tl-media-thumb" onClick={() => setViewMedia(m)}>
                {m.type === 'video' ? (
                  <video src={m.url} className="tl-media-img" />
                ) : (
                  <img src={m.url} alt={m.name} className="tl-media-img" />
                )}
                <button className="media-remove" onClick={e => { e.stopPropagation(); removeMedia(idx) }}>&times;</button>
                {m.type === 'video' && <span className="media-play-badge">&#9654;</span>}
              </div>
            ))}
          </div>
        )}
        {item.notes && (
          <div className={`tl-details ${expanded ? 'expanded' : ''}`}>
            <span className="tl-notes">{item.notes}</span>
          </div>
        )}
      </div>
      {viewMedia && (
        <div className="modal-overlay" onClick={() => setViewMedia(null)}>
          <div className="media-viewer" onClick={e => e.stopPropagation()}>
            <button className="media-viewer-close" onClick={() => setViewMedia(null)}>&times;</button>
            {viewMedia.type === 'video' ? (
              <video src={viewMedia.url} controls autoPlay className="media-viewer-content" />
            ) : (
              <img src={viewMedia.url} alt={viewMedia.name} className="media-viewer-content" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function DayEditForm({ day, onSave, onCancel }) {
  const [form, setForm] = useState(day)
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleDatePick = (date) => {
    if (!date) return
    const label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    const shortLabel = date.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })
    setForm(prev => ({ ...prev, label, shortLabel }))
  }

  // Parse existing label back to a Date for the picker's default value
  const pickerDate = parseDayDate(form.label)

  return (
    <div className="edit-form compact">
      <div className="form-row">
        <label className="form-label">Date
          <DatePicker
            selected={pickerDate}
            onChange={handleDatePick}
            placeholderText="Pick a date"
            className="form-input"
            dateFormat="EEEE, MMMM d"
          />
        </label>
        <label className="form-label">Subtitle <input className="form-input" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="e.g. Load In — Downtown" /></label>
      </div>
      <div className="form-row">
        <label className="form-label">Tag <input className="form-input" value={form.phase} onChange={e => set('phase', e.target.value)} placeholder="e.g. Production" /></label>
      </div>
      <div className="form-actions-inline">
        <button className="btn-small primary" onClick={() => onSave(form)}>Save</button>
        <button className="btn-small" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

function ImportStaffModal({ currentEvent, allEvents, onImport, onClose }) {
  const [selected, setSelected] = useState({})

  // Collect unique staff from other events by name+email key
  const otherStaff = []
  const seen = new Set()
  const currentNames = new Set((currentEvent.staff || []).map(s => s.name + s.email))
  for (const ev of allEvents) {
    if (ev.id === currentEvent.id) continue
    for (const s of (ev.staff || [])) {
      const key = s.name + s.email
      if (!seen.has(key) && !currentNames.has(key)) {
        seen.add(key)
        otherStaff.push({ ...s, _from: ev.name, _key: key })
      }
    }
  }

  const toggle = (key) => setSelected(prev => ({ ...prev, [key]: !prev[key] }))
  const selectedStaff = otherStaff.filter(s => selected[s._key])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Import Team Members</h3>
          <button className="icon-btn" onClick={onClose}>&times;</button>
        </div>
        {otherStaff.length === 0 ? (
          <div className="modal-empty">No team members found in other events.</div>
        ) : (
          <>
            <div className="import-list">
              {otherStaff.map(s => (
                <label key={s._key} className={`import-row ${selected[s._key] ? 'selected' : ''}`}>
                  <input type="checkbox" checked={!!selected[s._key]} onChange={() => toggle(s._key)} />
                  <div className="import-info">
                    <span className="import-name">{s.name}</span>
                    <span className="import-role">{s.role}</span>
                    <span className="import-from">from {s._from}</span>
                  </div>
                </label>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn-primary" disabled={selectedStaff.length === 0} onClick={() => {
                onImport(selectedStaff.map(({ _from, _key, ...rest }) => rest))
                onClose()
              }}>
                Import {selectedStaff.length > 0 ? `(${selectedStaff.length})` : ''}
              </button>
              <button className="btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

async function fetchWeatherForDay(location, dateLabel) {
  if (!location || !dateLabel) return null
  const parsed = parseDayDate(dateLabel)
  if (!parsed) return null
  const dateStr = parsed.toISOString().split('T')[0]
  const cacheKey = `poncho-weather-${location}-${dateStr}`
  const cached = sessionStorage.getItem(cacheKey)
  if (cached) return JSON.parse(cached)
  try {
    const searchLoc = cleanLocation(location)
    const isPast = parsed < new Date(new Date().toDateString())
    const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchLoc)}&count=1`).then(r => r.json())
    if (!geo.results?.length) return null
    const { latitude, longitude } = geo.results[0]
    const apiUrl = isPast
      ? `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&start_date=${dateStr}&end_date=${dateStr}&timezone=auto`
      : `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&start_date=${dateStr}&end_date=${dateStr}&timezone=auto`
    const data = await fetch(apiUrl).then(r => r.json())
    if (!data?.daily) return null
    const w = { code: data.daily.weather_code[0], high: Math.round(data.daily.temperature_2m_max[0]), low: Math.round(data.daily.temperature_2m_min[0]), precip: data.daily.precipitation_probability_max?.[0] ?? null }
    sessionStorage.setItem(cacheKey, JSON.stringify(w))
    return w
  } catch { return null }
}

async function generateEventPDF(event) {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  // Event logo + Title
  let titleX = pageWidth / 2
  if (event.logo) {
    try {
      doc.addImage(event.logo, 'PNG', 14, 10, 24, 24)
      titleX = (pageWidth + 38) / 2 // offset for logo
    } catch (e) { /* skip if image fails */ }
  }
  doc.setFontSize(22)
  doc.setTextColor(30, 30, 30)
  doc.text(event.name || 'Untitled Event', titleX, 22, { align: 'center' })

  // Timestamp
  const now = new Date()
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text(`Generated: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, pageWidth / 2, 30, { align: 'center' })

  doc.setFontSize(11)
  doc.setTextColor(100, 100, 100)
  let y = 40
  if (event.dates) { doc.text(event.dates, pageWidth / 2, y, { align: 'center' }); y += 6 }
  if (event.location) { doc.text(event.location, pageWidth / 2, y, { align: 'center' }); y += 6 }

  // Phases
  if (event.phases?.length > 0) {
    y += 4
    event.phases.forEach(p => {
      if (p.label) {
        doc.text(`${p.label}: ${p.dates || ''} ${p.time ? '(' + p.time + ')' : ''}`, pageWidth / 2, y, { align: 'center' })
        y += 5
      }
    })
  }

  // Staff Directory
  if (event.staff?.length > 0) {
    y += 6
    doc.setFontSize(14)
    doc.setTextColor(30, 30, 30)
    doc.text('Team Directory', 14, y)
    y += 2
    autoTable(doc, {
      startY: y,
      head: [['Name', 'Role', 'Phone', 'Email']],
      body: event.staff.map(s => [s.name, s.role, s.phone, s.email]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 0, 155] },
      margin: { left: 14, right: 14 },
    })
    y = doc.lastAutoTable.finalY + 8
  }

  // Days & Tasks
  for (const day of (event.days || [])) {
    if (y > 250) { doc.addPage(); y = 20 }
    doc.setFontSize(13)
    doc.setTextColor(30, 30, 30)
    doc.text(day.label || 'Day', 14, y)
    if (day.subtitle) {
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text(day.subtitle, 14, y + 5)
    }
    // Weather for this day
    const weather = await fetchWeatherForDay(event.location, day.label)
    if (weather) {
      const info = getWeatherInfo(weather.code)
      doc.setFontSize(9)
      doc.setTextColor(50, 50, 50)
      const weatherText = `${info.label} — ${weather.high}°/${weather.low}°F${weather.precip > 0 ? ` | ${weather.precip}% rain` : ''}`
      doc.text(weatherText, pageWidth - 14, y, { align: 'right' })
    }
    y += 8

    if (day.items?.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Time', 'Action', 'DRI', 'Notes']],
        body: day.items.map(it => [it.time, it.action, it.dri, it.notes]),
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [0, 0, 155] },
        columnStyles: { 0: { cellWidth: 28 }, 2: { cellWidth: 25 }, 3: { cellWidth: 35 } },
        margin: { left: 14, right: 14 },
      })
      y = doc.lastAutoTable.finalY + 8
    }
  }

  // Photo Gallery
  const allPhotos = []
  for (const day of (event.days || [])) {
    for (const item of (day.items || [])) {
      for (const m of (item.media || [])) {
        if (m.type === 'image') {
          allPhotos.push({ ...m, dayLabel: day.shortLabel || day.label, taskTime: item.time })
        }
      }
    }
  }

  if (allPhotos.length > 0) {
    doc.addPage()
    y = 20
    doc.setFontSize(14)
    doc.setTextColor(30, 30, 30)
    doc.text('Event Photos', 14, y)
    y += 10

    const imgSize = 50
    const gap = 6
    const cols = Math.floor((pageWidth - 28) / (imgSize + gap))
    let col = 0

    for (const photo of allPhotos) {
      if (y + imgSize + 12 > 280) { doc.addPage(); y = 20; col = 0 }
      const x = 14 + col * (imgSize + gap)
      try {
        doc.addImage(photo.url, 'JPEG', x, y, imgSize, imgSize)
        doc.setFontSize(6)
        doc.setTextColor(100, 100, 100)
        doc.text(`${photo.dayLabel} ${photo.taskTime}`, x, y + imgSize + 4)
      } catch (e) { /* skip failed images */ }
      col++
      if (col >= cols) { col = 0; y += imgSize + 12 }
    }
  }

  return doc
}

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
)

function ShareModal({ event, onClose }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    const doc = await generateEventPDF(event)
    const ts = new Date().toISOString().slice(0, 16).replace('T', '-').replace(':', '')
    doc.save(`${(event.name || 'event').replace(/\s+/g, '-')}-ROS-${ts}.pdf`)
    setLoading(false)
    setDone(true)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Download Event PDF</h3>
          <button className="icon-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="share-body">
          <p className="share-desc">Download the full Run of Show as a PDF including weather reports and photos.</p>
          <button className="btn-primary share-download" onClick={handleDownload} disabled={loading}>
            {loading ? 'Generating...' : 'Download PDF'}
          </button>
          {done && <p className="share-sent">PDF downloaded!</p>}
        </div>
      </div>
    </div>
  )
}

function ROSView({ event, allEvents, onUpdate, onBack, viewOnly }) {
  const [activeDay, setActiveDay] = useState(event.days?.[0]?.id || '')
  const [completedItems, setCompletedItems] = useState({})
  const [showStaff, setShowStaff] = useState(false)
  const [now, setNow] = useState(new Date())
  const [editingHeader, setEditingHeader] = useState(false)
  const [editingDayId, setEditingDayId] = useState(null)
  const [showImport, setShowImport] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [driAlerts, setDriAlerts] = useState([])
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set())
  const [importingROS, setImportingROS] = useState(false)
  const completedLoadedRef = useRef(false)

  // Load completed items from Supabase on mount
  useEffect(() => {
    dbLoadCompleted(event.id).then(data => {
      setCompletedItems(data)
      completedLoadedRef.current = true
    })
  }, [event.id])

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Request browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // DRI notification system — check every 30s for tasks due in ~30 minutes
  useEffect(() => {
    const notifiedKeys = new Set()

    const parseTimeStart = (timeStr) => {
      if (!timeStr) return null
      // Get just the start time: "9:30 AM", "9:30 AM – 1:00 PM" => "9:30 AM"
      const clean = timeStr.split(/[–—-]/)[0].trim()
      const m = clean.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)/i)
      if (!m) return null
      let hours = parseInt(m[1])
      const minutes = parseInt(m[2] || '0')
      const ampm = m[3].toLowerCase()
      if (ampm === 'pm' && hours < 12) hours += 12
      if (ampm === 'am' && hours === 12) hours = 0
      return { hours, minutes }
    }

    const checkAlerts = () => {
      const now = new Date()
      const upcoming = []

      for (const day of (event.days || [])) {
        const dayDate = parseDayDate(day.label)
        if (!dayDate) continue

        for (let i = 0; i < (day.items?.length || 0); i++) {
          const item = day.items[i]
          if (!item.dri || completedItems[`${day.id}-${i}`]) continue

          const timeParts = parseTimeStart(item.time)
          if (!timeParts) continue

          const taskDate = new Date(dayDate)
          taskDate.setHours(timeParts.hours, timeParts.minutes, 0, 0)

          const diffMs = taskDate - now
          const diffMin = diffMs / 60000

          // Alert if task is 15-35 minutes away (window around 30 min)
          if (diffMin > 0 && diffMin <= 35) {
            const key = `${event.id}-${day.id}-${i}`
            upcoming.push({
              key,
              dri: item.dri,
              action: item.action,
              time: item.time,
              dayLabel: day.shortLabel || day.label,
              minutesUntil: Math.round(diffMin)
            })

            // Browser notification (only once per task)
            if (!notifiedKeys.has(key) && 'Notification' in window && Notification.permission === 'granted') {
              notifiedKeys.add(key)
              new Notification(`⏰ Task in ~${Math.round(diffMin)} min`, {
                body: `${item.dri}: ${item.action}\n${item.time} — ${day.shortLabel || day.label}`,
                icon: '/favicon.png',
                tag: key
              })
            }
          }
        }
      }
      setDriAlerts(prev => {
        const prevKeys = prev.map(a => a.key).join(',')
        const nextKeys = upcoming.map(a => a.key).join(',')
        return prevKeys === nextKeys ? prev : upcoming
      })
    }

    checkAlerts()
    const interval = setInterval(checkAlerts, 30000)
    return () => clearInterval(interval)
  }, [event, completedItems])

  useEffect(() => {
    if (completedLoadedRef.current) {
      dbSaveCompleted(event.id, completedItems)
    }
  }, [completedItems, event.id])

  const updateEvent = useCallback((updates) => {
    onUpdate({ ...event, ...updates })
  }, [event, onUpdate])

  const toggleItem = (dayId, idx) => {
    const key = `${dayId}-${idx}`
    setCompletedItems(prev => {
      const next = { ...prev, [key]: !prev[key] }
      // Check if this day is now 100% complete
      const day = event.days?.find(d => d.id === dayId)
      if (day?.items?.length > 0 && next[key]) {
        const allDone = day.items.every((_, i) => next[`${dayId}-${i}`])
        if (allDone) {
          const metallic = ['#C0C0C0', '#E8E8E8', '#FFFFFF', '#D4AF37', '#FFD700', '#B8B8B8', '#F0F0F0']
          const burst = (opts) => confetti({ ...opts, colors: metallic, ticks: 300, gravity: 0.8, decay: 0.92 })
          burst({ particleCount: 150, spread: 70, origin: { y: 0.6 }, scalar: 1.3, shapes: ['circle'] })
          burst({ particleCount: 100, spread: 100, origin: { y: 0.6 }, scalar: 0.6, shapes: ['circle'] })
          setTimeout(() => {
            burst({ particleCount: 80, spread: 120, origin: { y: 0.5, x: 0.3 }, scalar: 1.1, shapes: ['circle'] })
            burst({ particleCount: 80, spread: 120, origin: { y: 0.5, x: 0.7 }, scalar: 1.1, shapes: ['circle'] })
          }, 250)
          setTimeout(() => burst({ particleCount: 60, spread: 160, origin: { y: 0.4 }, scalar: 0.5, shapes: ['circle'] }), 500)
        }
      }
      return next
    })
  }

  const currentDay = event.days?.find(d => d.id === activeDay) || event.days?.[0]
  const hasDays = !!currentDay

  const totalItems = hasDays ? (currentDay.items?.length || 0) : 0
  const doneItems = hasDays ? (currentDay.items?.filter((_, i) => completedItems[`${currentDay.id}-${i}`]).length || 0) : 0
  const progress = totalItems > 0 ? (doneItems / totalItems) * 100 : 0

  const resetDay = () => {
    const updated = { ...completedItems }
    currentDay.items?.forEach((_, i) => { delete updated[`${currentDay.id}-${i}`] })
    setCompletedItems(updated)
  }

  // --- Mutations ---
  const updateStaff = (idx, data) => {
    const staff = [...event.staff]; staff[idx] = data; updateEvent({ staff })
  }
  const deleteStaff = (idx) => { updateEvent({ staff: event.staff.filter((_, i) => i !== idx) }) }
  const addStaff = () => { updateEvent({ staff: [...(event.staff || []), { name: 'New Person', role: 'Role', phone: '', email: '' }] }) }
  const importStaff = (people) => { updateEvent({ staff: [...(event.staff || []), ...people] }) }

  const addClient = () => { updateEvent({ clients: [...(event.clients || []), { name: 'New Client', company: '', phone: '', email: '' }] }) }
  const updateClient = (idx, data) => { const clients = [...(event.clients || [])]; clients[idx] = data; updateEvent({ clients }) }
  const deleteClient = (idx) => { updateEvent({ clients: (event.clients || []).filter((_, i) => i !== idx) }) }

  const updateDay = (dayId, data) => {
    updateEvent({ days: event.days.map(d => d.id === dayId ? { ...d, ...data } : d) })
    setEditingDayId(null)
  }
  const deleteDay = (dayId) => {
    const newDays = event.days.filter(d => d.id !== dayId)
    updateEvent({ days: newDays })
    if (activeDay === dayId && newDays.length > 0) setActiveDay(newDays[0].id)
  }
  const addDay = () => {
    const newDay = { id: genId(), label: 'New Day', shortLabel: 'New', subtitle: '', phase: 'hype', items: [] }
    updateEvent({ days: [...(event.days || []), newDay] })
    setActiveDay(newDay.id)
    setEditingDayId(newDay.id)
  }

  const updateItem = (dayId, idx, data) => {
    updateEvent({ days: event.days.map(d => d.id === dayId ? { ...d, items: d.items.map((it, i) => i === idx ? data : it) } : d) })
  }
  const deleteItem = (dayId, idx) => {
    updateEvent({ days: event.days.map(d => d.id === dayId ? { ...d, items: d.items.filter((_, i) => i !== idx) } : d) })
  }
  const addItem = (dayId) => {
    const newItem = { time: '', action: 'New task', dri: '', notes: '' }
    updateEvent({ days: event.days.map(d => d.id === dayId ? { ...d, items: [...d.items, newItem] } : d) })
  }

  const saveHeader = (form) => {
    updateEvent({ name: form.name, dates: form.dates, location: form.location, phases: form.phases })
    setEditingHeader(false)
  }

  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => updateEvent({ logo: ev.target.result })
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [updateEvent])

  const handleROSImport = useCallback(async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImportingROS(true)
    const parsed = await parseSpreadsheet(file)
    // Merge imported days/staff into existing event (append, don't overwrite)
    const mergedStaff = [...(event.staff || [])]
    const existingNames = new Set(mergedStaff.map(s => s.name.toLowerCase()))
    for (const s of (parsed.staff || [])) {
      if (!existingNames.has(s.name.toLowerCase())) mergedStaff.push(s)
    }
    const mergedDays = [...(event.days || []), ...(parsed.days || [])]
    updateEvent({
      name: event.name || parsed.name,
      dates: event.dates || parsed.dates,
      location: event.location || parsed.location,
      staff: mergedStaff,
      days: mergedDays,
    })
    setImportingROS(false)
    e.target.value = ''
  }, [event, updateEvent])

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <Logo onClick={onBack} />
          <div className="header-right">
            <span className="live-clock">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {editingHeader ? (
          <EventForm initial={{ name: event.name, dates: event.dates, location: event.location, phases: event.phases || [] }} onSave={saveHeader} onCancel={() => setEditingHeader(false)} />
        ) : (
          <>
            <div className="event-banner">
              <label className={event.logo ? undefined : 'event-logo-placeholder'} title={event.logo ? 'Change logo' : 'Add event logo'} style={event.logo ? { cursor: 'pointer' } : undefined}>
                {event.logo ? <img src={event.logo} alt="" className="event-logo" /> : <CameraIcon />}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
              </label>
              <h2 className="event-name">{event.name}</h2>
              <span className="event-dates">{event.dates}</span>
              {!viewOnly && <button className="icon-btn" onClick={() => setEditingHeader(true)} title="Edit event details"><PencilIcon /></button>}
            </div>
            <div className="event-meta">
              <div className="meta-pill">
                <span className="meta-icon">&#x1f4cd;</span>
                {event.location}
              </div>
            </div>
            {event.phases?.length > 0 && (
              <div className="phase-row">
                {event.phases.map((p, i) => (
                  <div key={i} className={`phase-chip ${i === 0 ? 'hype' : 'activation'}`}>
                    <span className="phase-dot"></span>
                    {p.label}: {p.dates} ({p.time})
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="header-actions-row">
          <button className="staff-btn" onClick={() => setShowStaff(!showStaff)}>
            <span className="staff-btn-icon">&#x1f465;</span>
            {showStaff ? 'Hide Team' : 'Team Directory'}
          </button>
          {!viewOnly && (
            <label className="staff-btn" title="Import a spreadsheet into this event">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {importingROS ? ' Importing…' : ' Import Spreadsheet'}
              <input type="file" accept=".xlsx,.xls,.csv" onChange={handleROSImport} style={{ display: 'none' }} />
            </label>
          )}
          <button className="staff-btn" onClick={() => setShowShare(true)}>
            <ShareIcon /> Download PDF
          </button>
        </div>
      </header>

      {showShare && <ShareModal event={event} onClose={() => setShowShare(false)} />}

      {showStaff && (
        <section className="staff-panel">
          <div className="section-header-row">
            <h3 className="section-title">Team Directory</h3>
            {!viewOnly && (
              <div className="section-header-actions">
                {allEvents.length > 1 && (
                  <button className="btn-small" onClick={() => setShowImport(true)}>Import from Directory</button>
                )}
                <button className="btn-small" onClick={addStaff}><PlusIcon /> Add Staff</button>
              </div>
            )}
          </div>
          {showImport && <ImportStaffModal currentEvent={event} allEvents={allEvents} onImport={importStaff} onClose={() => setShowImport(false)} />}
          <div className="staff-grid">
            {event.staff?.map((s, i) => (
              <StaffCard key={i} staff={s} onUpdate={viewOnly ? null : (data) => updateStaff(i, data)} onDelete={viewOnly ? null : () => deleteStaff(i)} />
            ))}
          </div>

          {!viewOnly && (
            <>
              <div className="section-header-row" style={{ marginTop: 20 }}>
                <h3 className="section-title">Clients (View Only)</h3>
                <button className="btn-small" onClick={addClient}><PlusIcon /> Add Client</button>
              </div>
              <div className="staff-grid">
                {(event.clients || []).map((c, i) => (
                  <ClientCard key={i} client={c} onUpdate={(data) => updateClient(i, data)} onDelete={() => deleteClient(i)} />
                ))}
                {(event.clients || []).length === 0 && <p style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5 }}>No clients added. Add a client to give them view-only access — they can sign in with their name or email and will only see events they are invited to.</p>}
              </div>
            </>
          )}
        </section>
      )}

      <nav className="day-nav">
        {event.days?.map(d => {
          const dayDone = d.items?.filter((_, i) => completedItems[`${d.id}-${i}`]).length || 0
          const dayTotal = d.items?.length || 0
          return (
            <button key={d.id} className={`day-tab ${activeDay === d.id ? 'active' : ''} phase-${d.phase}`} onClick={() => setActiveDay(d.id)}>
              <span className="tab-label">{d.shortLabel}</span>
              {d.phase && <span className="tab-phase">{d.phase}</span>}
              <span className="tab-progress">{dayDone}/{dayTotal}</span>
            </button>
          )
        })}
        {!viewOnly && (
          <button className="day-tab add-day-tab" onClick={addDay}>
            <PlusIcon /> <span className="tab-label">Add Day</span>
          </button>
        )}
      </nav>

      <section className="day-view">
        {!hasDays ? (
          <div className="empty-state">
            <p>No days added yet.</p>
            <button className="btn-primary" onClick={addDay} style={{ marginTop: 16 }}>
              <PlusIcon /> Add Your First Day
            </button>
          </div>
        ) : (
          <>
            {editingDayId === currentDay.id ? (
              <DayEditForm day={currentDay} onSave={(d) => updateDay(currentDay.id, d)} onCancel={() => setEditingDayId(null)} />
            ) : (
              <>
                <div className="day-title-row">
                  <div>
                    <h3 className="day-title">{currentDay.label}</h3>
                    <p className="day-subtitle">{currentDay.subtitle}</p>
                    <WeatherBadge location={event.location} dateLabel={currentDay.label} />
                  </div>
                  {!viewOnly && (
                    <div className="day-title-actions">
                      <button className="icon-btn" onClick={() => setEditingDayId(currentDay.id)} title="Edit day"><PencilIcon /></button>
                      <button className="icon-btn danger" onClick={() => deleteDay(currentDay.id)} title="Delete day"><TrashIcon /></button>
                      {doneItems > 0 && <button className="reset-btn" onClick={resetDay}>Reset</button>}
                    </div>
                  )}
                </div>
                <WeatherPlan day={currentDay} onUpdate={(text) => updateDay(currentDay.id, { weatherPlan: text })} viewOnly={viewOnly} />
              </>
            )}

            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-label">{doneItems} of {totalItems} tasks complete</div>

            {driAlerts.filter(a => !dismissedAlerts.has(a.key)).length > 0 && (
              <div className="dri-alerts-banner">
                <div className="dri-alerts-title">⏰ Upcoming Tasks</div>
                {driAlerts.filter(a => !dismissedAlerts.has(a.key)).map(a => (
                  <div key={a.key} className="dri-alert-item">
                    <div className="dri-alert-info">
                      <span className="dri-alert-time">In ~{a.minutesUntil} min</span>
                      <span className="dri-alert-who">{a.dri}</span>
                      <span className="dri-alert-what">{a.action}</span>
                    </div>
                    <button className="dri-alert-dismiss" onClick={() => setDismissedAlerts(prev => new Set([...prev, a.key]))}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="timeline">
              {currentDay.items?.map((item, i) => (
                <TimelineItem
                  key={`${currentDay.id}-${i}`}
                  item={item}
                  done={!!completedItems[`${currentDay.id}-${i}`]}
                  isLast={i === currentDay.items.length - 1}
                  onToggle={viewOnly ? null : () => toggleItem(currentDay.id, i)}
                  onUpdate={viewOnly ? null : (data) => updateItem(currentDay.id, i, data)}
                  onDelete={viewOnly ? null : () => deleteItem(currentDay.id, i)}
                />
              ))}
            </div>
            {!viewOnly && (
              <button className="btn-add-item" onClick={() => addItem(currentDay.id)}>
                <PlusIcon /> Add Task
              </button>
            )}
          </>
        )}
      </section>

      <EventGallery event={event} />

      <footer className="app-footer">
        <img src="/cape-logo-blue-sm.png" alt="" className="footer-mark" />
        EVENT MANAGEMENT BY CAPE
      </footer>
    </div>
  )
}

function EventGallery({ event }) {
  const [viewMedia, setViewMedia] = useState(null)
  const [filter, setFilter] = useState('all')

  const { allMedia, photoCount, videoCount } = useMemo(() => {
    const media = []
    for (const day of (event.days || [])) {
      for (const item of (day.items || [])) {
        for (const m of (item.media || [])) {
          media.push({ ...m, dayLabel: day.shortLabel || day.label, taskAction: item.action, taskTime: item.time })
        }
      }
    }
    return {
      allMedia: media,
      photoCount: media.filter(m => m.type === 'image').length,
      videoCount: media.filter(m => m.type === 'video').length,
    }
  }, [event.days])

  if (allMedia.length === 0) return null

  const filtered = filter === 'all' ? allMedia
    : filter === 'photos' ? allMedia.filter(m => m.type === 'image')
    : allMedia.filter(m => m.type === 'video')

  return (
    <section className="gallery-section">
      <div className="gallery-header">
        <h3 className="section-title">Event Gallery</h3>
        <div className="gallery-actions">
          <div className="gallery-filters">
            <button className={`gallery-filter ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All ({allMedia.length})</button>
            {photoCount > 0 && <button className={`gallery-filter ${filter === 'photos' ? 'active' : ''}`} onClick={() => setFilter('photos')}>Photos ({photoCount})</button>}
            {videoCount > 0 && <button className={`gallery-filter ${filter === 'videos' ? 'active' : ''}`} onClick={() => setFilter('videos')}>Videos ({videoCount})</button>}
          </div>
          <button className="btn-small" onClick={() => {
            filtered.forEach((m, i) => {
              const link = document.createElement('a')
              link.href = m.url
              const eventSlug = (event.name || 'event').replace(/\s+/g, '-')
              link.download = `${eventSlug}-${String(i + 1).padStart(2, '0')}.${m.type === 'video' ? 'mp4' : 'jpg'}`
              setTimeout(() => link.click(), i * 200)
            })
          }}>Download All ({filtered.length})</button>
        </div>
      </div>
      <div className="gallery-grid">
        {filtered.map((m, i) => (
          <div key={i} className="gallery-item" onClick={() => setViewMedia(m)}>
            {m.type === 'video' ? (
              <video src={m.url} className="gallery-img" />
            ) : (
              <img src={m.url} alt={m.name} className="gallery-img" />
            )}
            {m.type === 'video' && <span className="gallery-play">&#9654;</span>}
            <div className="gallery-caption">
              <span className="gallery-day">{m.dayLabel}</span>
              <span className="gallery-task">{m.taskTime}</span>
            </div>
          </div>
        ))}
      </div>
      {viewMedia && (
        <div className="modal-overlay" onClick={() => setViewMedia(null)}>
          <div className="media-viewer" onClick={e => e.stopPropagation()}>
            <button className="media-viewer-close" onClick={() => setViewMedia(null)}>&times;</button>
            {viewMedia.type === 'video' ? (
              <video src={viewMedia.url} controls autoPlay className="media-viewer-content" />
            ) : (
              <img src={viewMedia.url} alt={viewMedia.name} className="media-viewer-content" />
            )}
            <div className="media-viewer-info">
              <span>{viewMedia.dayLabel} &middot; {viewMedia.taskTime}</span>
              <span className="media-viewer-task">{viewMedia.taskAction}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

// ═══════════════════════════════════════
// SPREADSHEET IMPORT
// ═══════════════════════════════════════
async function parseSpreadsheet(file) {
  const XLSX = await import('xlsx')
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const wb = XLSX.read(e.target.result, { type: 'array', cellDates: true })
      const event = { name: '', dates: '', location: '', phases: [], staff: [], days: [], clients: [] }

      // Helper: check if a formatted string looks like a time (e.g. "11:00 AM", "9:30 pm")
      const isTimeStr = (str) => {
        if (!str) return false
        return !!(str.match(/^\d{1,2}:\d{2}\s*(AM|PM|am|pm)?$/i) || str.match(/^\d{1,2}\s*(AM|PM|am|pm)$/i))
      }

      for (const sheetName of wb.SheetNames) {
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, defval: '', raw: false })
        let section = null
        let currentDay = null
        let colMap = null
        let staffColMap = null

        for (let r = 0; r < rows.length; r++) {
          const cells = rows[r].map(c => String(c || '').trim())
          const allText = cells.join(' ').toLowerCase()
          const nonEmpty = cells.filter(c => c)

          if (nonEmpty.length === 0) continue

          // ── Section detection ──
          if (allText.match(/^\s*details?\s*$/) && nonEmpty.length <= 1) { section = 'details'; continue }
          if (allText.match(/\bstaffing\b/) && nonEmpty.length <= 3) { section = 'staffing'; continue }
          if (allText.match(/\brun\s*of\s*show\b/) && nonEmpty.length <= 2) { section = 'ros'; continue }

          // ── ROS column header row (DATE, TIME, ACTION, VENDOR, DRI, NOTES) ──
          const lowerCells = cells.map(c => c.toLowerCase())
          if (lowerCells.includes('action') && (lowerCells.includes('time') || lowerCells.includes('date'))) {
            colMap = {}
            lowerCells.forEach((c, i) => {
              if (c === 'time') colMap.time = i
              if (c === 'action') colMap.action = i
              if (c === 'dri' || c === 'owner' || c === 'lead') colMap.dri = i
              if (c === 'notes' || c === 'note') colMap.notes = i
              if (c === 'vendor') colMap.vendor = i
              if (c === 'date') colMap.date = i
            })
            section = 'ros'
            continue
          }

          // ── Staff header detection ──
          if (allText.match(/\broles?\b/) && allText.match(/\bname\b/)) {
            section = 'staffing'
            staffColMap = {}
            lowerCells.forEach((c, i) => {
              if (c === 'name') staffColMap.name = i
              if (c === 'role' || c === 'roles') staffColMap.role = i
              if (c === 'phone' || c === 'mobile' || c === 'cell') staffColMap.phone = i
              if (c === 'email') staffColMap.email = i
            })
            continue
          }

          // ── Details: key-value rows like CLIENT=Gemini, EVENT=..., DATE=..., LOCATION=... ──
          if (section === 'details') {
            const key = cells[0].toLowerCase().replace(/[:\s]+$/, '')
            const val = cells[1] || ''
            if (!val) continue
            if (key.match(/\bevent\b/) || key.match(/\bproject\b/)) { event.name = val }
            else if (key.match(/\bclient\b/)) { if (!event.name) event.name = val }
            else if (key.match(/\bdate\b/)) { event.dates = val }
            else if (key.match(/\blocation\b|\bvenue\b/)) { event.location = val }
            else if (key.match(/\btime\b/)) {
              event.phases.push({ label: '', dates: event.dates, time: val })
            }
            continue
          }

          // ── Details: multi-column header format (EVENT | DATES | TIME | LOCATION in one row) ──
          if (!section && allText.match(/\bevent\b/) && allText.match(/\bdate|time|location/i) && !allText.match(/\baction\b/)) {
            section = 'details-row'
            continue
          }
          if (section === 'details-row') {
            for (const c of cells) {
              if (!c) continue
              if (c.match(/\blocation\b|\bevent\b|\bdate\b|\btime\b/i)) continue
              if (c.match(/\d{1,2}(am|pm)/i) || c.match(/\d{1,2}\s*:\s*\d{2}/)) {
                event.phases.push({ label: '', dates: '', time: c })
              } else if (c.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i)) {
                const phaseMatch = c.match(/\(([^)]+)\)/)?.[1] || ''
                const dateStr = c.replace(/\([^)]*\)/, '').trim()
                if (event.phases.length && !event.phases[event.phases.length - 1].dates) {
                  event.phases[event.phases.length - 1].dates = dateStr
                  if (phaseMatch) event.phases[event.phases.length - 1].label = phaseMatch
                } else {
                  event.phases.push({ label: phaseMatch, dates: dateStr, time: '' })
                }
                if (!event.dates) event.dates = dateStr
              } else if (c.length > 15) {
                event.location = event.location || c
              } else if (c.length > 3 && !event.name) {
                event.name = c
              }
            }
            section = null
            continue
          }

          // ── Staff rows: role, name, phone, email ──
          if (section === 'staffing') {
            const hasPhone = cells.some(c => c.match(/\d{3}.*\d{3}/))
            const hasEmail = cells.some(c => c.includes('@'))
            const hasName = cells.some(c => c.match(/[A-Z][a-z]+\s+[A-Z]/))
            if (hasPhone || hasEmail || hasName) {
              let name = '', role = '', phone = '', email = ''
              if (staffColMap && Object.keys(staffColMap).length > 0) {
                // Use detected column positions from header row
                name = staffColMap.name != null ? cells[staffColMap.name] || '' : ''
                role = staffColMap.role != null ? cells[staffColMap.role] || '' : ''
                phone = staffColMap.phone != null ? cells[staffColMap.phone] || '' : (cells.find(c => c.match(/\d{3}.*\d{4}/)) || '')
                email = staffColMap.email != null ? cells[staffColMap.email] || '' : (cells.find(c => c.includes('@')) || '')
              } else {
                // Fallback: detect from content
                phone = cells.find(c => c.match(/\d{3}.*\d{4}/)) || ''
                email = cells.find(c => c.includes('@')) || ''
                const textCells = cells.filter(c => c && !c.match(/\d{3}.*\d{4}/) && !c.includes('@'))
                role = textCells[0] || ''
                name = textCells[1] || textCells[0] || ''
                // Swap if first cell looks like a name (two proper-case words) instead of a role
                if (role && name && role.match(/[A-Z][a-z]+\s+[A-Z]/) && !name.match(/[A-Z][a-z]+\s+[A-Z]/)) {
                  [role, name] = [name, role]
                }
              }
              if (name) event.staff.push({ role, name, phone, email })
              continue
            }
          }

          // ── Day headers: detect day-name or date-only rows that start a new day ──
          const dayPattern = /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i
          const slashDate = /^\d{1,2}\/\d{1,2}\/\d{2,4}/
          const firstCell = cells[0]
          // A day header is a row where col A has a date/day name and there's no time in col B
          // (task rows have times in col B like "11:00 AM")
          const hasTimeInB = cells.length > 1 && isTimeStr(cells[1])
          const isDayHeader = firstCell && !hasTimeInB && (
            (firstCell.match(dayPattern) && !isTimeStr(firstCell)) ||
            firstCell.match(slashDate) ||
            (firstCell.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\.?\s+\d/i) && firstCell.length > 5 && !isTimeStr(firstCell))
          )

          if (isDayHeader) {
            const label = firstCell
            // Normalize to title case for dedup comparison
            const normalizedLabel = label.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()).replace(/\s+/g, ' ').trim()
            // Skip if we already have this day (dedup)
            const existing = event.days.find(d => d.label.toLowerCase().trim() === label.toLowerCase().trim())
            if (existing) { currentDay = existing; section = 'ros'; continue }
            const shortParts = label.match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\w*,?\s*([\w.]+\s+\d+)/i)
            let shortLabel
            if (shortParts) {
              shortLabel = (shortParts[1].slice(0, 3) + ' ' + shortParts[2]).slice(0, 12)
            } else {
              shortLabel = normalizedLabel.replace(/\(.*?\)/g, '').trim().slice(0, 12)
            }
            const subtitle = cells.find((c, i) => i > 0 && c.length > 3) || ''
            const isActivation = allText.match(/\bevent\s*is\s*live\b|\bactivation\b/i)
            const isLoadIn = allText.match(/\bload[\s-]*in\b/i)
            const isLoadOut = allText.match(/\bload[\s-]*out\b|\bbreakdown\b/i)
            const phase = isActivation ? 'Activation' : isLoadIn ? 'Load In' : isLoadOut ? 'Load Out' : 'Production'
            currentDay = { id: genId(), label: normalizedLabel, shortLabel, subtitle, phase, items: [] }
            event.days.push(currentDay)
            section = 'ros'
            continue
          }

          // ── ROS task rows ──
          if (section === 'ros' && currentDay) {
            let time = '', action = '', dri = '', notes = '', vendor = ''
            if (colMap) {
              // Use detected column mapping
              time = colMap.time != null ? cells[colMap.time] : ''
              action = colMap.action != null ? cells[colMap.action] : ''
              dri = colMap.dri != null ? cells[colMap.dri] : ''
              notes = colMap.notes != null ? cells[colMap.notes] : ''
              vendor = colMap.vendor != null ? cells[colMap.vendor] : ''
              // If time column is empty, check if date column has a time-like value
              if (!time && colMap.date != null) {
                const dateCell = cells[colMap.date]
                if (isTimeStr(dateCell)) time = dateCell
              }
            } else {
              // Fallback: find time in first few columns, then action after it
              let timeIdx = -1
              for (let i = 0; i < Math.min(cells.length, 3); i++) {
                if (isTimeStr(cells[i])) { timeIdx = i; break }
              }
              if (timeIdx >= 0) {
                time = cells[timeIdx]
                action = cells[timeIdx + 1] || ''
                dri = cells[timeIdx + 2] || ''
                notes = cells[timeIdx + 3] || ''
              } else if (cells[0] && cells[1] && cells[1].length > 3) {
                time = cells[0]; action = cells[1]; dri = cells[2] || ''; notes = cells[3] || ''
              }
            }
            // Also grab action from next column if colMap action is empty but there's content nearby
            if (!action && nonEmpty.length > 0) {
              // Find first non-empty non-time cell as action
              for (let i = 0; i < cells.length; i++) {
                if (cells[i] && !isTimeStr(cells[i]) && cells[i] !== time && cells[i] !== '-') {
                  action = cells[i]; break
                }
              }
            }
            if (vendor && action) action = action + (vendor ? ` [${vendor}]` : '')
            if (action && action !== '-') {
              currentDay.items.push({ time, action, dri, notes, media: [] })
            }
          }
        }
      }

      // Generate dates string from phases if not set
      if (!event.dates && event.phases.length > 0) {
        event.dates = event.phases.map(p => p.dates).filter(Boolean).join(' – ')
      }
      // If name is just the client and we have a better name from event field, use it
      if (!event.name && event.days.length > 0) {
        event.name = 'Imported Event'
      }

      resolve(event)
    }
    reader.readAsArrayBuffer(file)
  })
}

function CreateEventView({ onSave, onCancel }) {
  const [form, setForm] = useState({ name: '', dates: '', location: '', phases: [{ label: '', dates: '', time: '' }] })
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))
  const setPhase = (i, k, v) => {
    const phases = [...form.phases]
    phases[i] = { ...phases[i], [k]: v }
    set('phases', phases)
  }
  const addPhase = () => set('phases', [...form.phases, { label: '', dates: '', time: '' }])
  const removePhase = (i) => set('phases', form.phases.filter((_, j) => j !== i))
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImporting(true)
    const parsed = await parseSpreadsheet(file)
    // Merge parsed data into form
    setForm(prev => ({
      ...prev,
      name: parsed.name || prev.name,
      dates: parsed.dates || prev.dates,
      location: parsed.location || prev.location,
      phases: parsed.phases?.length > 0 ? parsed.phases : prev.phases,
    }))
    setImportResult(parsed)
    setImporting(false)
    e.target.value = ''
  }

  const handleSave = () => {
    const newEvent = {
      id: genId(),
      ...form,
      staff: importResult?.staff || [],
      days: importResult?.days || [],
      clients: [],
    }
    onSave(newEvent)
  }

  return (
    <div className="create-view">
      <div className="create-header">
        <Logo onClick={onCancel} />
        <h2>Create New Event</h2>
      </div>

      <div className="import-spreadsheet">
        <label className="btn-secondary import-btn">
          {importing ? 'Importing...' : 'Import from Spreadsheet'}
          <input type="file" accept=".xlsx,.xls,.csv" onChange={handleImport} style={{ display: 'none' }} />
        </label>
        <span className="import-note">Upload an .xlsx, .xls, or .csv file to auto-populate</span>
        {importResult && (
          <div className="import-summary">
            Imported: {importResult.staff?.length || 0} staff, {importResult.days?.length || 0} days, {importResult.days?.reduce((a, d) => a + (d.items?.length || 0), 0) || 0} tasks
          </div>
        )}
      </div>

      <div className="create-form">
        <label className="form-label">Event Name
          <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Product Launch Party" autoFocus />
        </label>
        <label className="form-label">Date Range
          <DateRangeInput value={form.dates} onChange={(v) => set('dates', v)} />
        </label>
        <label className="form-label">Location
          <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Brooklyn Navy Yard" />
        </label>
        <div className="form-section">
          <div className="form-section-header">
            <span className="form-label">Phases</span>
            <button className="btn-small" onClick={addPhase}><PlusIcon /> Add Phase</button>
          </div>
          {form.phases.map((p, i) => (
            <div key={i} className="phase-form-block">
              <div className="form-row">
                <PhaseSelect value={p.label} onChange={v => setPhase(i, 'label', v)} />
                {form.phases.length > 1 && <button className="icon-btn danger" onClick={() => removePhase(i)}><TrashIcon /></button>}
              </div>
              <div className="form-row">
                <label className="form-label">Dates<DateRangeInput value={p.dates} onChange={v => setPhase(i, 'dates', v)} /></label>
                <label className="form-label">Time<TimeRangeInput value={p.time} onChange={v => setPhase(i, 'time', v)} /></label>
              </div>
            </div>
          ))}
        </div>
        <div className="form-actions">
          <button className="btn-primary" onClick={handleSave}>Create Event</button>
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
      <footer className="app-footer">
        <img src="/cape-logo-blue-sm.png" alt="" className="footer-mark" />
        EVENT MANAGEMENT BY CAPE
      </footer>
    </div>
  )
}

function SignInView({ error, loading }) {
  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  return (
    <div className="signin-view">
      <div className="signin-card">
        <Logo variant="white" />
        <p className="signin-tagline">Sign in to see your projects</p>
        <button className="btn-primary signin-btn signin-google" onClick={handleGoogle} disabled={loading}>
          <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: 8, flexShrink: 0 }}>
            <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="rgba(255,255,255,0.8)" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="rgba(255,255,255,0.6)" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="rgba(255,255,255,0.9)" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Signing in…' : 'Sign in with Google'}
        </button>
        {error && <p className="signin-error">{error}</p>}
        <p className="signin-hint">Cape Creative staff sign in with @capecreative.co · Clients use their invited email</p>
      </div>
      <footer className="app-footer">
        <img src="/cape-logo-blue-sm.png" alt="" className="footer-mark" />
        EVENT MANAGEMENT BY CAPE
      </footer>
    </div>
  )
}

function App() {
  // ─── Synchronous init from localStorage — zero-flash load ───
  const _cachedUser     = JSON.parse(localStorage.getItem('poncho-user')           || 'null')
  const _cachedEvents   = JSON.parse(localStorage.getItem('poncho-events-cache')   || '[]')
  const _cachedTrash    = JSON.parse(localStorage.getItem('poncho-trash-cache')    || '[]')
  const _cachedArchived = JSON.parse(localStorage.getItem('poncho-archived-cache') || '[]')

  const [events, setEvents] = useState(_cachedEvents)
  const [trash, setTrash] = useState(_cachedTrash)
  const [archived, setArchived] = useState(_cachedArchived)
  const [user, setUser] = useState(_cachedUser)
  const [view, setView] = useState(_cachedUser ? 'dashboard' : 'signin')
  const [activeEventId, setActiveEventId] = useState(null)
  const [pendingEvent, setPendingEvent] = useState(null)
  const prevEventsRef = useRef(_cachedEvents)
  const prevTrashRef = useRef(null)

  // ─── Check for existing Supabase session on mount ───
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  // Resolve a Supabase session into a Poncho user object (all 3 DB queries in parallel)
  const resolveSession = useCallback(async (session) => {
    const userEmail = session.user.email.toLowerCase()
    const isCapeCo = userEmail.endsWith('@capecreative.co')
    // Load all data in parallel
    const [eventsData, trashData, archivedData] = await Promise.all([dbLoadEvents(), dbLoadTrash(), dbLoadArchived()])
    let access = isCapeCo ? 'edit' : null
    let userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email
    let userRole = isCapeCo ? 'Team Member' : null
    for (const ev of eventsData) {
      for (const s of (ev.staff || [])) {
        if (s.email?.toLowerCase() === userEmail) { userName = s.name; userRole = s.role; access = 'edit'; break }
      }
      for (const c of (ev.clients || [])) {
        if (c.email?.toLowerCase() === userEmail) { userName = c.name; userRole = c.company || 'Client'; access = 'view'; break }
      }
    }
    if (!access) {
      // Email not recognized — deny access
      await supabase.auth.signOut()
      setAuthError('Your email isn\'t associated with any Poncho events. Contact your Cape Creative producer to be added.')
      setAuthLoading(false)
      setView('signin')
      return
    }
    const userData = { name: userName, email: session.user.email, role: userRole, access, admin: isCapeCo }
    setUser(userData)
    localStorage.setItem('poncho-user', JSON.stringify(userData))
    setEvents(eventsData)
    setTrash(trashData)
    setArchived(archivedData)
    prevEventsRef.current = eventsData
    localStorage.setItem('poncho-events-cache',   JSON.stringify(eventsData))
    localStorage.setItem('poncho-trash-cache',    JSON.stringify(trashData))
    localStorage.setItem('poncho-archived-cache', JSON.stringify(archivedData))
    setView('dashboard')
    setAuthLoading(false)
  }, [])

  useEffect(() => {
    const init = async () => {
      // If we already have a cached user, the UI is already showing — just verify session & refresh in background
      if (_cachedUser) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (!session) {
            // Session expired — sign out
            supabase.auth.signOut()
          } else {
            // Silently refresh data from Supabase
            Promise.all([dbLoadEvents(), dbLoadTrash(), dbLoadArchived()]).then(([eventsData, trashData, archivedData]) => {
              setEvents(eventsData); setTrash(trashData); setArchived(archivedData)
              prevEventsRef.current = eventsData
              localStorage.setItem('poncho-events-cache',   JSON.stringify(eventsData))
              localStorage.setItem('poncho-trash-cache',    JSON.stringify(trashData))
              localStorage.setItem('poncho-archived-cache', JSON.stringify(archivedData))
            })
          }
        })
        return
      }
      // No cache — check for session, then load or show sign-in
      setAuthLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await resolveSession(session)
      } else {
        setView('signin')
        setAuthLoading(false)
      }
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setAuthLoading(true)
        setAuthError('')
        await resolveSession(session)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setEvents([])
        setTrash([])
        setArchived([])
        setView('signin')
        localStorage.removeItem('poncho-user')
        localStorage.removeItem('poncho-events-cache')
        localStorage.removeItem('poncho-trash-cache')
        localStorage.removeItem('poncho-archived-cache')
      }
    })
    return () => subscription.unsubscribe()
  }, [resolveSession])

  // Data is loaded inside resolveSession / init — no separate load effect needed

  // ─── Sync events to Supabase when they change ───
  useEffect(() => {
    if (!user || prevEventsRef.current === null) return
    // Find which events changed and save them
    const prev = prevEventsRef.current
    events.forEach(ev => {
      const prevEv = prev.find(p => p.id === ev.id)
      if (!prevEv || JSON.stringify(prevEv) !== JSON.stringify(ev)) {
        dbSaveEvent(ev)
      }
    })
    // Find deleted events
    prev.forEach(p => {
      if (!events.find(ev => ev.id === p.id)) {
        dbDeleteEvent(p.id)
      }
    })
    prevEventsRef.current = events
  }, [events, user])

  const signOut = () => {
    // Clear UI immediately — don't block on network
    setUser(null)
    setEvents([])
    setTrash([])
    setArchived([])
    setView('signin')
    localStorage.removeItem('poncho-user')
    localStorage.removeItem('poncho-events-cache')
    localStorage.removeItem('poncho-trash-cache')
    localStorage.removeItem('poncho-archived-cache')
    supabase.auth.signOut() // fire and forget
  }

  const openEvent = (id) => { setActiveEventId(id); setView('ros') }
  const goHome = () => { setView('dashboard'); setActiveEventId(null) }

  const updateEvent = (updated) => {
    setEvents(prev => prev.map(ev => ev.id === updated.id ? updated : ev))
  }

  const deleteEvent = (id) => {
    const event = events.find(ev => ev.id === id)
    if (event) {
      const trashEvent = { ...event, deletedAt: Date.now() }
      setTrash(prev => [...prev, trashEvent])
      dbSaveToTrash(trashEvent)
    }
    setEvents(prev => prev.filter(ev => ev.id !== id))
  }

  const restoreEvent = (id) => {
    const event = trash.find(ev => ev.id === id)
    if (event) {
      const { deletedAt, ...restored } = event
      setEvents(prev => [...prev, restored])
      dbSaveEvent(restored)
    }
    setTrash(prev => prev.filter(ev => ev.id !== id))
    dbDeleteFromTrash(id)
  }

  const permanentDelete = (id) => {
    setTrash(prev => prev.filter(ev => ev.id !== id))
    dbDeleteFromTrash(id)
    dbDeleteCompleted(id)
  }

  const archiveEvent = (id) => {
    const event = events.find(ev => ev.id === id)
    if (event) {
      const archivedEvent = { ...event, archivedAt: Date.now() }
      setArchived(prev => [...prev, archivedEvent])
      dbSaveToArchive(archivedEvent)
    }
    setEvents(prev => prev.filter(ev => ev.id !== id))
  }

  const unarchiveEvent = (id) => {
    const event = archived.find(ev => ev.id === id)
    if (event) {
      const { archivedAt, ...restored } = event
      setEvents(prev => [...prev, restored])
      dbSaveEvent(restored)
    }
    setArchived(prev => prev.filter(ev => ev.id !== id))
    dbDeleteFromArchive(id)
  }

  const permanentDeleteArchived = (id) => {
    setArchived(prev => prev.filter(ev => ev.id !== id))
    dbDeleteFromArchive(id)
    dbDeleteCompleted(id)
  }

  const emptyTrash = () => {
    trash.forEach(ev => dbDeleteCompleted(ev.id))
    dbEmptyTrash()
    setTrash([])
  }

  const duplicateEvent = (id) => {
    const source = events.find(ev => ev.id === id)
    if (!source) return
    const newId = genId()
    const dupe = {
      ...JSON.parse(JSON.stringify(source)),
      id: newId,
      name: `${source.name} (Copy)`,
      days: source.days.map(d => ({ ...JSON.parse(JSON.stringify(d)), id: genId() })),
    }
    delete dupe.logo
    setEvents(prev => [...prev, dupe])
    dbSaveEvent(dupe)
  }

  const createEvent = (newEvent) => {
    setEvents(prev => [...prev, newEvent])
    dbSaveEvent(newEvent)
    setPendingEvent(newEvent)
    setActiveEventId(newEvent.id)
    setView('ros')
  }

  // Clear pending event once it appears in the events array
  useEffect(() => {
    if (pendingEvent && events.find(ev => ev.id === pendingEvent.id)) {
      setPendingEvent(null)
    }
  }, [events, pendingEvent])

  if (view === 'signin' || !user) {
    return <SignInView error={authError} loading={authLoading} />
  }

  // Filter events for non-admin users
  const visibleEvents = user.admin ? events : events.filter(ev =>
    (ev.staff || []).some(s =>
      s.name.toLowerCase() === user.name?.toLowerCase() ||
      s.email.toLowerCase() === user.email?.toLowerCase()
    ) ||
    (ev.clients || []).some(c =>
      c.name.toLowerCase() === user.name?.toLowerCase() ||
      c.email.toLowerCase() === user.email?.toLowerCase()
    )
  )
  const isViewOnly = user.access === 'view'

  if (view === 'create') {
    return <CreateEventView onSave={createEvent} onCancel={goHome} />
  }

  if (view === 'ros' && activeEventId) {
    const event = events.find(ev => ev.id === activeEventId) || pendingEvent
    if (!event) { setView('dashboard'); return null }
    return <ROSView event={event} allEvents={events} onUpdate={updateEvent} onBack={goHome} viewOnly={isViewOnly} />
  }

  return <Dashboard events={visibleEvents} trash={trash} archived={archived} user={user} onOpenEvent={openEvent} onCreateEvent={() => setView('create')} onDeleteEvent={deleteEvent} onDuplicateEvent={duplicateEvent} onRestoreEvent={restoreEvent} onPermanentDelete={permanentDelete} onEmptyTrash={emptyTrash} onArchiveEvent={archiveEvent} onUnarchiveEvent={unarchiveEvent} onPermanentDeleteArchived={permanentDeleteArchived} onSignOut={signOut} />
}

export default App
