import { useState, type FormEvent, type CSSProperties } from "react";

type Device = {
  id: number;
  name: string;
  room: string;
  type: "Light" | "Fan" | "AC" | "Plug";
  watts: number;
  on: boolean;
};

type Page =
  | "Overview"
  | "Devices"
  | "Automations"
  | "Energy analytics"
  | "AI optimizer"
  | "Settings";

const initialDevices: Device[] = [
  { id: 1, name: "Living room light", room: "Living Room", type: "Light", watts: 9, on: true },
  { id: 2, name: "Bedroom fan", room: "Bedroom", type: "Fan", watts: 65, on: true },
  { id: 3, name: "Air conditioner", room: "Living Room", type: "AC", watts: 1200, on: false },
  { id: 4, name: "Kitchen plug", room: "Kitchen", type: "Plug", watts: 45, on: false },
  { id: 5, name: "Study lamp", room: "Study", type: "Light", watts: 7, on: false },
  { id: 6, name: "Hallway light", room: "Hallway", type: "Light", watts: 12, on: true },
];

const navItems: Page[] = [
  "Overview",
  "Devices",
  "Automations",
  "Energy analytics",
  "AI optimizer",
  "Settings",
];

const navSymbols: Record<Page, string> = {
  Overview: "⌂",
  Devices: "◉",
  Automations: "⌘",
  "Energy analytics": "▥",
  "AI optimizer": "✦",
  Settings: "⚙",
};

const descriptions: Record<Page, string> = {
  Overview: "Monitor devices, automate routines, and make energy work smarter.",
  Devices: "Manage your connected devices and their current state.",
  Automations: "Create and test routines for your simulated home.",
  "Energy analytics": "Explore estimated energy usage and device consumption.",
  "AI optimizer": "Review sample recommendations for smarter energy use.",
  Settings: "Manage your demo workspace and local data.",
};

const cardStyle: CSSProperties = {
  background: "#111b2e",
  border: "1px solid #26344d",
  borderRadius: 16,
  padding: 22,
};

const buttonStyle: CSSProperties = {
  border: 0,
  borderRadius: 9,
  padding: "11px 15px",
  background: "#6178f7",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

export default function App() {
  const [page, setPage] = useState<Page>("Overview");
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(46);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceRoom, setDeviceRoom] = useState("Living Room");
  const [deviceType, setDeviceType] = useState<Device["type"]>("Light");
  const [deviceWatts, setDeviceWatts] = useState(10);
  const [toast, setToast] = useState("");

  const activeDevices = devices.filter((device) => device.on).length;
  const currentWatts = devices
    .filter((device) => device.on)
    .reduce((total, device) => total + device.watts, 0);
  const dailyEnergy = ((currentWatts * 6) / 1000).toFixed(2);
  const dailyCost = (Number(dailyEnergy) * 7.5).toFixed(2);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const toggleDevice = (id: number) => {
    setDevices((current) =>
      current.map((device) =>
        device.id === id ? { ...device, on: !device.on } : device,
      ),
    );
  };

  const addDevice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newDevice: Device = {
      id: Date.now(),
      name: deviceName.trim(),
      room: deviceRoom.trim() || "Unassigned",
      type: deviceType,
      watts: Math.max(1, deviceWatts),
      on: false,
    };

    setDevices((current) => [...current, newDevice]);
    setDeviceName("");
    setDeviceRoom("Living Room");
    setDeviceType("Light");
    setDeviceWatts(10);
    setShowAddDevice(false);
    notify("Device added to your demo home");
  };

  const resetDemo = () => {
    setDevices(initialDevices);
    setTemperature(25);
    setHumidity(46);
    setSearch("");
    setFilter("All");
    notify("Demo data has been reset");
  };

  const filteredDevices = devices.filter((device) => {
    const matchesSearch = device.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filter === "All" || device.type === filter;
    return matchesSearch && matchesType;
  });

  const runSimulation = () => {
    if (temperature > 30) {
      setDevices((current) =>
        current.map((device) =>
          device.type === "Fan" ? { ...device, on: true } : device,
        ),
      );
      notify("Temperature threshold reached — fan turned on");
    } else {
      notify("Simulation complete — no automation triggered");
    }
  };

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>⌂</div>
          <div>
            <strong style={{ fontSize: 16 }}>SmartNest</strong>
            <div style={styles.brandSub}>HOME INTELLIGENCE</div>
          </div>
        </div>

        <div style={styles.navLabel}>WORKSPACE</div>

        <nav style={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPage(item)}
              style={{
                ...styles.navButton,
                ...(page === item ? styles.navButtonActive : {}),
              }}
            >
              <span style={styles.navSymbol}>{navSymbols[item]}</span>
              {item}
            </button>
          ))}
        </nav>

        <div style={styles.sidebarBottom}>
          <div style={styles.privacy}>◇ &nbsp; Local &amp; private</div>
          <div style={styles.privacySub}>Demo data stays in this browser</div>
          <div style={styles.profile}>
            <div style={styles.avatar}>SN</div>
            <div>
              <strong>SmartNest Demo</strong>
              <div style={styles.profileSub}>Local workspace</div>
            </div>
          </div>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.topbar}>
          <div style={styles.breadcrumb}>
            Workspace <span style={{ color: "#52617a" }}>/</span>{" "}
            <strong>{page}</strong>
          </div>
          <div style={styles.topRight}>
            <span style={styles.simulationDot} />
            <span style={styles.simulationText}>Simulation mode</span>
            <button type="button" style={styles.bell} aria-label="Notifications">
              ♧
            </button>
            <div style={styles.avatar}>SN</div>
          </div>
        </header>

        <section style={styles.pageHeader}>
          <div>
            <div style={styles.eyebrow}>SMART HOME / {page.toUpperCase()}</div>
            <h1 style={styles.heading}>
              {page === "Overview" ? "Your home, in control." : page}
            </h1>
            <p style={styles.subtitle}>{descriptions[page]}</p>
          </div>
          <button type="button" style={styles.secondaryButton} onClick={resetDemo}>
            ↻ &nbsp; Reset demo
          </button>
        </section>

        {toast && <div style={styles.toast}>✓ &nbsp; {toast}</div>}

        {page === "Overview" && (
          <>
            <Metrics
              deviceCount={devices.length}
              activeCount={activeDevices}
              watts={currentWatts}
              energy={dailyEnergy}
            />

            <section style={styles.panel}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>Device control</h2>
                  <p style={styles.sectionDescription}>
                    Manage your connected home devices.
                  </p>
                </div>
                <button
                  type="button"
                  style={buttonStyle}
                  onClick={() => setShowAddDevice(true)}
                >
                  + Add device
                </button>
              </div>

              <div style={styles.deviceGrid}>
                {devices.slice(0, 4).map((device) => (
                  <DeviceCard
                    key={device.id}
                    device={device}
                    onToggle={() => toggleDevice(device.id)}
                  />
                ))}
              </div>

              <button
                type="button"
                style={styles.textButton}
                onClick={() => setPage("Devices")}
              >
                View all devices →
              </button>
            </section>

            <AutomationPanel
              temperature={temperature}
              setTemperature={setTemperature}
              humidity={humidity}
              setHumidity={setHumidity}
              onRun={runSimulation}
            />

            <ActivityPanel />
          </>
        )}

        {page === "Devices" && (
          <section style={styles.panel}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>All devices</h2>
                <p style={styles.sectionDescription}>
                  {devices.length} devices in your simulated home
                </p>
              </div>
              <button
                type="button"
                style={buttonStyle}
                onClick={() => setShowAddDevice(true)}
              >
                + Add device
              </button>
            </div>

            <div style={styles.toolbar}>
              <input
                style={styles.input}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search devices..."
              />
              <select
                style={styles.select}
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                {["All", "Light", "Fan", "AC", "Plug"].map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            <div style={styles.deviceGrid}>
              {filteredDevices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onToggle={() => toggleDevice(device.id)}
                />
              ))}
            </div>

            {filteredDevices.length === 0 && (
              <p style={styles.empty}>No matching devices found.</p>
            )}
          </section>
        )}

        {page === "Automations" && (
          <AutomationPanel
            temperature={temperature}
            setTemperature={setTemperature}
            humidity={humidity}
            setHumidity={setHumidity}
            onRun={runSimulation}
          />
        )}

        {page === "Energy analytics" && (
          <>
            <Metrics
              deviceCount={devices.length}
              activeCount={activeDevices}
              watts={currentWatts}
              energy={dailyEnergy}
            />
            <section style={styles.panel}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>Energy overview</h2>
                  <p style={styles.sectionDescription}>
                    Simulated usage and cost estimates
                  </p>
                </div>
              </div>
              <div style={styles.energySummary}>
                <div>
                  <span style={styles.metricLabel}>Estimated daily energy</span>
                  <strong style={styles.energyValue}>{dailyEnergy} kWh</strong>
                </div>
                <div>
                  <span style={styles.metricLabel}>Estimated daily cost</span>
                  <strong style={styles.energyValue}>₹{dailyCost}</strong>
                </div>
              </div>
              <div style={styles.barChart}>
                {[35, 48, 30, 65, 50, 80, 58, 92, 72, 54, 38, 26].map(
                  (height, index) => (
                    <div key={index} style={styles.barColumn}>
                      <div style={{ ...styles.bar, height: `${height}%` }} />
                      <small>{index * 2 + 6}:00</small>
                    </div>
                  ),
                )}
              </div>
              <p style={styles.note}>
                These figures are illustrative estimates based on virtual device
                power ratings and six hours of usage.
              </p>
            </section>
          </>
        )}

        {page === "AI optimizer" && (
          <section style={styles.panel}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Energy optimization lab</h2>
                <p style={styles.sectionDescription}>
                  Sample recommendations based on current device states.
                </p>
              </div>
              <span style={styles.pill}>DEMO MODE</span>
            </div>
            {devices
              .filter((device) => device.on && device.watts > 40)
              .map((device) => (
                <div key={device.id} style={styles.recommendation}>
                  <div style={styles.recommendationIcon}>✦</div>
                  <div>
                    <strong>Review {device.name}</strong>
                    <p style={styles.sectionDescription}>
                      Uses {device.watts} W while switched on. Consider turning it
                      off when the room is unoccupied.
                    </p>
                  </div>
                </div>
              ))}
            <p style={styles.note}>
              This is a demonstration interface with sample suggestions. It does
              not use a trained AI model.
            </p>
          </section>
        )}

        {page === "Settings" && (
          <section style={styles.panel}>
            <h2 style={styles.sectionTitle}>Workspace settings</h2>
            <p style={styles.sectionDescription}>
              Manage your local demo workspace.
            </p>
            <div style={styles.settingRow}>
              <div>
                <strong>Demo data</strong>
                <p style={styles.sectionDescription}>
                  This prototype stores data in the current page session.
                </p>
              </div>
              <button style={styles.secondaryButton} onClick={resetDemo}>
                Reset demo
              </button>
            </div>
          </section>
        )}

        <footer style={styles.footer}>
          <span>● SmartNest · software simulation</span>
          <span>React · TypeScript · Vite · Demo data</span>
        </footer>
      </main>

      {showAddDevice && (
        <div style={styles.modalBackdrop} onClick={() => setShowAddDevice(false)}>
          <form
            style={styles.modal}
            onSubmit={addDevice}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Add virtual device</h2>
                <p style={styles.sectionDescription}>
                  Add an appliance to your simulated home.
                </p>
              </div>
              <button
                type="button"
                style={styles.closeButton}
                onClick={() => setShowAddDevice(false)}
              >
                ×
              </button>
            </div>

            <label style={styles.formLabel}>Device name</label>
            <input
              style={styles.formInput}
              required
              value={deviceName}
              onChange={(event) => setDeviceName(event.target.value)}
              placeholder="e.g. Study room light"
            />

            <label style={styles.formLabel}>Device type</label>
            <select
              style={styles.formInput}
              value={deviceType}
              onChange={(event) =>
                setDeviceType(event.target.value as Device["type"])
              }
            >
              {["Light", "Fan", "AC", "Plug"].map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <label style={styles.formLabel}>Room</label>
            <input
              style={styles.formInput}
              value={deviceRoom}
              onChange={(event) => setDeviceRoom(event.target.value)}
            />

            <label style={styles.formLabel}>Power rating (W)</label>
            <input
              style={styles.formInput}
              type="number"
              min="1"
              value={deviceWatts}
              onChange={(event) => setDeviceWatts(Number(event.target.value))}
            />

            <button style={{ ...buttonStyle, width: "100%", marginTop: 20 }}>
              Create device
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function Metrics({
  deviceCount,
  activeCount,
  watts,
  energy,
}: {
  deviceCount: number;
  activeCount: number;
  watts: number;
  energy: string;
}) {
  return (
    <section style={styles.metrics}>
      <Metric title="Connected devices" value={deviceCount} detail="Virtual device fleet" symbol="◉" />
      <Metric title="Devices active" value={activeCount} detail={`${deviceCount - activeCount} currently idle`} symbol="⌁" />
      <Metric title="Live power load" value={`${watts.toLocaleString()} W`} detail="Estimated connected load" symbol="ϟ" />
      <Metric title="Daily energy estimate" value={`${energy} kWh`} detail="Based on 6-hour usage" symbol="▥" />
    </section>
  );
}

function Metric({
  title,
  value,
  detail,
  symbol,
}: {
  title: string;
  value: string | number;
  detail: string;
  symbol: string;
}) {
  return (
    <div style={styles.metric}>
      <div style={styles.metricSymbol}>{symbol}</div>
      <span style={styles.metricLabel}>{title}</span>
      <strong style={styles.metricValue}>{value}</strong>
      <small style={styles.metricDetail}>{detail}</small>
    </div>
  );
}

function DeviceCard({
  device,
  onToggle,
}: {
  device: Device;
  onToggle: () => void;
}) {
  const symbol =
    device.type === "Light" ? "☼" : device.type === "Fan" ? "✣" : device.type === "AC" ? "❄" : "⏚";

  return (
    <article style={styles.deviceCard}>
      <div style={styles.deviceTop}>
        <div style={styles.deviceSymbol}>{symbol}</div>
        <span
          style={{
            ...styles.status,
            color: device.on ? "#56d6ae" : "#8b9ab4",
            background: device.on ? "#12372f" : "#202c40",
          }}
        >
          ● {device.on ? "ON" : "OFF"}
        </span>
      </div>
      <h3 style={styles.deviceName}>{device.name}</h3>
      <p style={styles.deviceInfo}>
        {device.room} <span>·</span> {device.watts} W
      </p>
      <button
        type="button"
        onClick={onToggle}
        style={{
          ...styles.deviceToggle,
          borderColor: device.on ? "#225c52" : "#34425b",
          color: device.on ? "#65dfbb" : "#c0cbe0",
          background: device.on ? "#142e32" : "#17243a",
        }}
      >
        {device.on ? "Turn off" : "Turn on"}
        <span>⏻</span>
      </button>
    </article>
  );
}

function AutomationPanel({
  temperature,
  setTemperature,
  humidity,
  setHumidity,
  onRun,
}: {
  temperature: number;
  setTemperature: (value: number) => void;
  humidity: number;
  setHumidity: (value: number) => void;
  onRun: () => void;
}) {
  return (
    <section style={{ ...styles.panel, marginTop: 18 }}>
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>Automation lab</h2>
          <p style={styles.sectionDescription}>
            Test a simple rule using simulated sensor readings.
          </p>
        </div>
        <span style={styles.pill}>RULE ENGINE</span>
      </div>

      <div style={styles.ruleCard}>
        <div style={styles.ruleIcon}>⌘</div>
        <div>
          <strong>Hot room → fan on</strong>
          <p style={styles.sectionDescription}>
            If temperature exceeds 30°C, turn on the fan.
          </p>
        </div>
      </div>

      <div style={styles.simulator}>
        <div style={styles.simulatorHeader}>
          <strong>Sensor simulator</strong>
          <strong style={{ color: "#92a8ff" }}>{temperature}°C</strong>
        </div>
        <label style={styles.formLabel}>Room temperature</label>
        <input
          style={styles.range}
          type="range"
          min="15"
          max="40"
          value={temperature}
          onChange={(event) => setTemperature(Number(event.target.value))}
        />
        <div style={styles.rangeLabels}>
          <span>15°C</span>
          <span>40°C</span>
        </div>

        <div style={styles.humidityRow}>
          <span>Humidity</span>
          <div style={styles.humidityControls}>
            <button type="button" onClick={() => setHumidity(Math.max(20, humidity - 1))}>−</button>
            <strong>{humidity}%</strong>
            <button type="button" onClick={() => setHumidity(Math.min(90, humidity + 1))}>+</button>
          </div>
        </div>

        <button type="button" style={buttonStyle} onClick={onRun}>
          Run simulation　↗
        </button>
      </div>
    </section>
  );
}

function ActivityPanel() {
  const events = [
    "Simulation initialized with 6 virtual devices",
    "Bedroom fan switched on",
    "Energy usage summary calculated",
  ];

  return (
    <section style={{ ...styles.panel, marginTop: 18 }}>
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>Recent activity</h2>
          <p style={styles.sectionDescription}>Latest demo workspace events.</p>
        </div>
        <span style={styles.pill}>LATEST EVENTS</span>
      </div>
      {events.map((event, index) => (
        <div key={event} style={styles.activityRow}>
          <span style={styles.activityDot}>⌁</span>
          <span>{event}</span>
          <time style={styles.activityTime}>{["09:41:12", "09:38:05", "09:30:00"][index]}</time>
        </div>
      ))}
    </section>
  );
}

const styles: Record<string, CSSProperties> = {
  app: {
    minHeight: "100vh",
    display: "flex",
    background: "#0a1020",
    color: "#e7edf9",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    fontSize: 14,
  },
  sidebar: {
    width: 236,
    minWidth: 236,
    background: "#0d1526",
    borderRight: "1px solid #202b40",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  brand: { display: "flex", alignItems: "center", gap: 12, padding: "0 8px 38px" },
  brandIcon: { width: 40, height: 40, borderRadius: 13, background: "#6379f6", display: "grid", placeItems: "center", fontSize: 25, color: "white" },
  brandSub: { color: "#8492ad", fontSize: 9, letterSpacing: 1.3, marginTop: 5 },
  navLabel: { color: "#697b99", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, padding: "0 10px 12px" },
  nav: { display: "grid", gap: 5 },
  navButton: { display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 13px", color: "#9baac3", background: "transparent", border: "1px solid transparent", borderRadius: 10, textAlign: "left", cursor: "pointer", fontSize: 13 },
  navButtonActive: { color: "#eef2ff", background: "#1a2744", borderColor: "#34476d" },
  navSymbol: { width: 20, textAlign: "center", fontSize: 18 },
  sidebarBottom: { marginTop: "auto", padding: "24px 8px 0" },
  privacy: { color: "#b3bfd2", fontSize: 12 },
  privacySub: { color: "#71809a", fontSize: 11, paddingLeft: 22, marginTop: 4 },
  profile: { display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid #263249", marginTop: 20, paddingTop: 18, fontSize: 12 },
  avatar: { width: 32, height: 32, borderRadius: 50, display: "grid", placeItems: "center", background: "#27365b", color: "#bfcaff", fontSize: 11, fontWeight: 700 },
  profileSub: { color: "#71809a", fontSize: 11, marginTop: 3 },
  main: { flex: 1, minWidth: 0, padding: "0 38px 24px", maxWidth: 1800, margin: "0 auto", width: "100%", boxSizing: "border-box" },
  topbar: { minHeight: 76, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1b2639" },
  breadcrumb: { color: "#8d9bb4", fontSize: 13, display: "flex", gap: 10 },
  topRight: { display: "flex", alignItems: "center", gap: 12 },
  simulationDot: { width: 7, height: 7, background: "#4bd4a5", borderRadius: "50%" },
  simulationText: { color: "#a7b5cd", fontSize: 12 },
  bell: { background: "#121d31", border: "1px solid #283750", color: "#b7c4d9", borderRadius: 10, width: 36, height: 36, cursor: "pointer" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, padding: "32px 0 24px" },
  eyebrow: { color: "#8d9cb8", fontSize: 10, fontWeight: 700, letterSpacing: 1.6, marginBottom: 12 },
  heading: { fontSize: "clamp(25px, 3vw, 34px)", letterSpacing: -1, margin: 0, fontWeight: 700 },
  subtitle: { color: "#9ba9c1", margin: "10px 0 0", fontSize: 14 },
  secondaryButton: { background: "#111b2e", color: "#c6d1e4", border: "1px solid #2b3952", borderRadius: 9, padding: "10px 13px", cursor: "pointer", whiteSpace: "nowrap" },
  toast: { background: "#16372f", color: "#7ce0bb", border: "1px solid #245b4d", borderRadius: 10, padding: "12px 16px", marginBottom: 16 },
  metrics: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 14, marginBottom: 18 },
  metric: { ...cardStyle, padding: 18, minWidth: 0 },
  metricSymbol: { width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: 10, background: "#202f51", color: "#8fa5ff", fontSize: 20, marginBottom: 15 },
  metricLabel: { display: "block", color: "#9aaac4", fontSize: 12, marginBottom: 8 },
  metricValue: { display: "block", fontSize: 25, letterSpacing: -0.5, color: "#edf2ff" },
  metricDetail: { display: "block", color: "#73839f", fontSize: 11, marginTop: 8 },
  panel: { ...cardStyle, marginBottom: 18 },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 19, margin: 0, letterSpacing: -0.3 },
  sectionDescription: { color: "#91a1bb", fontSize: 12, margin: "7px 0 0", lineHeight: 1.6 },
  deviceGrid: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 },
  deviceCard: { background: "#151f33", border: "1px solid #2b3952", borderRadius: 13, padding: 15, minWidth: 0 },
  deviceTop: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 },
  deviceSymbol: { display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: 10, background: "#243354", color: "#9db0ff", fontSize: 20 },
  status: { fontSize: 9, borderRadius: 20, padding: "5px 7px", whiteSpace: "nowrap" },
  deviceName: { fontSize: 13, margin: "17px 0 6px", fontWeight: 650 },
  deviceInfo: { fontSize: 11, color: "#8798b3", margin: "0 0 14px" },
  deviceToggle: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", border: "1px solid", borderRadius: 8, padding: "9px 10px", fontSize: 11, cursor: "pointer" },
  textButton: { color: "#a8b8ff", background: "transparent", border: 0, padding: "18px 0 0", cursor: "pointer", fontSize: 12, fontWeight: 600 },
  ruleCard: { display: "flex", alignItems: "center", gap: 12, background: "#151f33", border: "1px solid #2b3952", borderRadius: 12, padding: 14, marginBottom: 12 },
  ruleIcon: { width: 36, height: 36, display: "grid", placeItems: "center", borderRadius: 10, background: "#253459", color: "#9eb1ff", fontSize: 19 },
  simulator: { background: "#0d1729", border: "1px solid #26354e", borderRadius: 12, padding: 16, marginTop: 14 },
  simulatorHeader: { display: "flex", justifyContent: "space-between", marginBottom: 18 },
  formLabel: { display: "block", color: "#9aaac3", fontSize: 12, margin: "14px 0 8px" },
  range: { width: "100%", accentColor: "#647cf7", cursor: "pointer" },
  rangeLabels: { display: "flex", justifyContent: "space-between", color: "#73839e", fontSize: 10 },
  humidityRow: { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "18px 0", color: "#aab8ce", fontSize: 12 },
  humidityControls: { display: "flex", alignItems: "center", gap: 12 },
  activityRow: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: "1px solid #253249", color: "#aebbd0", fontSize: 12 },
  activityDot: { color: "#91a6ff" },
  activityTime: { marginLeft: "auto", color: "#73839e", fontSize: 11 },
  toolbar: { display: "flex", gap: 12, marginBottom: 18 },
  input: { flex: 1, minWidth: 0, background: "#0d1729", border: "1px solid #2b3952", color: "#e7edf9", padding: 12, borderRadius: 9 },
  select: { background: "#0d1729", border: "1px solid #2b3952", color: "#e7edf9", padding: "10px 12px", borderRadius: 9 },
  empty: { color: "#91a1bb", padding: 20, textAlign: "center" },
  energySummary: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "20px 0" },
  energyValue: { display: "block", fontSize: 27, marginTop: 8 },
  barChart: { height: 220, display: "flex", alignItems: "flex-end", gap: 12, borderBottom: "1px solid #34425a", padding: "20px 8px 0" },
  barColumn: { flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: 10, minWidth: 0 },
  bar: { width: "70%", maxWidth: 38, background: "linear-gradient(180deg, #8090ff, #4c61d6)", borderRadius: "6px 6px 0 0" },
  note: { color: "#7f90ab", fontSize: 11, lineHeight: 1.6, marginTop: 18 },
  pill: { color: "#a6b5ff", background: "#202d4d", border: "1px solid #35466e", borderRadius: 20, padding: "6px 9px", fontSize: 9, letterSpacing: 0.6, whiteSpace: "nowrap" },
  recommendation: { display: "flex", alignItems: "center", gap: 14, padding: "15px 0", borderTop: "1px solid #26344b" },
  recommendationIcon: { width: 36, height: 36, display: "grid", placeItems: "center", borderRadius: 10, background: "#302a4b", color: "#c1a7ff" },
  settingRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, borderTop: "1px solid #28364d", padding: "18px 0" },
  footer: { display: "flex", justifyContent: "space-between", gap: 12, color: "#667793", fontSize: 10, padding: "16px 2px" },
  modalBackdrop: { position: "fixed", inset: 0, background: "rgba(3, 8, 18, .75)", display: "grid", placeItems: "center", padding: 20, zIndex: 10 },
  modal: { width: "100%", maxWidth: 440, background: "#111b2e", border: "1px solid #34425b", borderRadius: 16, padding: 24, boxSizing: "border-box", boxShadow: "0 25px 80px #0008" },
  closeButton: { background: "transparent", border: 0, color: "#9baac2", fontSize: 25, cursor: "pointer" },
  formInput: { display: "block", width: "100%", boxSizing: "border-box", background: "#0b1425", border: "1px solid #2c3a53", color: "#e7edf9", borderRadius: 9, padding: 12, marginBottom: 12 },
};