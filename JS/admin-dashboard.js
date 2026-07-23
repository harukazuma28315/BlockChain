tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-primary-fixed-variant": "#3323cc",
        "surface-dim": "#d3daea",
        "surface-container-lowest": "#ffffff",
        "on-tertiary-fixed-variant": "#7b2f00",
        secondary: "#0058be",
        "on-primary-fixed": "#0f0069",
        "surface-container-highest": "#dce2f3",
        "outline-variant": "#c7c4d8",
        "surface-container-low": "#f0f3ff",
        "inverse-on-surface": "#ebf1ff",
        error: "#ba1a1a",
        "on-error-container": "#93000a",
        "inverse-primary": "#c3c0ff",
        "secondary-fixed-dim": "#adc6ff",
        "surface-container-high": "#e2e8f8",
        "on-secondary": "#ffffff",
        primary: "#3525cd",
        "on-primary": "#ffffff",
        "on-tertiary-fixed": "#351000",
        "tertiary-fixed": "#ffdbcc",
        "on-secondary-container": "#fefcff",
        "primary-fixed": "#e2dfff",
        "surface-bright": "#f9f9ff",
        "secondary-container": "#2170e4",
        "surface-container": "#e7eefe",
        "on-primary-container": "#dad7ff",
        "on-tertiary": "#ffffff",
        "error-container": "#ffdad6",
        outline: "#777587",
        "on-secondary-fixed": "#001a42",
        "surface-variant": "#dce2f3",
        "primary-container": "#4f46e5",
        "inverse-surface": "#2a313d",
        "tertiary-fixed-dim": "#ffb695",
        "primary-fixed-dim": "#c3c0ff",
        tertiary: "#7e3000",
        background: "#f9f9ff",
        "on-tertiary-container": "#ffd2be",
        "secondary-fixed": "#d8e2ff",
        surface: "#f9f9ff",
        "on-error": "#ffffff",
        "on-background": "#151c27",
        "tertiary-container": "#a44100",
        "on-secondary-fixed-variant": "#004395",
        "on-surface": "#151c27",
        "surface-tint": "#4d44e3",
        "on-surface-variant": "#464555",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        md: "16px",
        xs: "4px",
        lg: "24px",
        gutter: "20px",
        "container-max": "1200px",
        sm: "8px",
        base: "4px",
        xl: "40px",
      },
      fontFamily: {
        "mono-label": ["Inter"],
        "label-md": ["Inter"],
        "headline-lg": ["Inter"],
        "body-md": ["Inter"],
        "headline-lg-mobile": ["Inter"],
        "display-lg": ["Inter"],
        "body-sm": ["Inter"],
        "body-lg": ["Inter"],
        "headline-md": ["Inter"],
      },
      fontSize: {
        "mono-label": [
          "13px",
          { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "500" },
        ],
        "label-md": [
          "14px",
          { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "600" },
        ],
        "headline-lg": [
          "32px",
          { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-lg-mobile": [
          "24px",
          { lineHeight: "32px", fontWeight: "600" },
        ],
        "display-lg": [
          "48px",
          { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
      },
    },
  },
};

// ====================== ADMIN-DASHBOARD.JS ======================
// Trang Tổng quan — tích hợp THẬT với Smart Contract qua ethers.js.
// Toàn bộ số liệu đọc trực tiếp on-chain: tổng cử tri/ứng viên, trạng thái
// cuộc bầu cử hiện hành, tổng số phiếu, và 5 hoạt động on-chain gần nhất.
import { getContract, getReadContract } from "./blockchain.js";
import { initAdminWallet } from "./admin-common.js";
import {
  getActiveElectionId,
  getElectionPlain,
  getAllCandidatesPlain,
  getAllVotersPlain,
  fetchAllEvents,
  describeEvent,
  shortAddr,
  STATUS_LABELS,
} from "./election-utils.js";

function bvCreateNewElection() {
  window.location.href = "admin-ballot-management.html";
}

async function bvRenderDashboard() {
  const contract = getContract();
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  if (!contract) {
    set("stat-system-status", "—");
    return;
  }

  const [voters, candidates, activeElectionId] = await Promise.all([
    getAllVotersPlain(contract),
    getAllCandidatesPlain(contract),
    getActiveElectionId(contract),
  ]);

  const verifiedVoters = voters.filter((v) => v.verified).length;
  const verifiedCandidates = candidates.filter((c) => c.verified).length;

  let totalVotes = 0;
  let statusKey = "draft";
  if (activeElectionId !== null) {
    totalVotes = Number(await contract.totalVotes(activeElectionId));
    const election = await getElectionPlain(contract, activeElectionId);
    statusKey = election.statusKey;
  }
  const turnout = voters.length
    ? ((totalVotes / voters.length) * 100).toFixed(1)
    : "0.0";

  set("stat-total-voters", voters.length.toLocaleString("vi-VN"));
  set("stat-verified-voters", `${verifiedVoters} đã xác thực`);
  set("stat-total-candidates", candidates.length.toLocaleString("vi-VN"));
  set("stat-verified-candidates", `${verifiedCandidates} đã xác thực`);
  set("stat-total-votes", totalVotes.toLocaleString("vi-VN"));
  set("stat-turnout", `${turnout}% tỷ lệ tham gia`);
  set("stat-system-status", STATUS_LABELS[statusKey]);

  const dot = document.getElementById("system-status-dot");
  if (dot) {
    dot.className =
      statusKey === "voting"
        ? "absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white pulse-dot"
        : statusKey === "ended"
          ? "absolute -top-1 -right-1 w-3 h-3 rounded-full bg-outline border-2 border-white"
          : "absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-white pulse-dot";
  }

  const logsEl = document.getElementById("recent-activity-list");
  if (logsEl) {
    logsEl.innerHTML = `<p class="font-body-sm text-body-sm text-on-surface-variant">Đang tải hoạt động on-chain...</p>`;
    try {
      const readContract = getReadContract();
      const events = await fetchAllEvents(readContract, 5);
      const readProvider = readContract.provider ?? readContract.runner?.provider;
      const recent = await Promise.all(
        events.map((ev) => describeEvent(ev, readProvider)),
      );
      logsEl.innerHTML = recent.length
        ? recent
            .map(
              (tx) => `
        <div class="flex gap-md">
          <div class="w-2 h-10 rounded-full mt-1 bg-emerald-500"></div>
          <div>
            <p class="font-label-md text-label-md text-on-surface">${tx.type}</p>
            <p class="font-body-sm text-body-sm text-on-surface-variant">Ví: ${shortAddr(tx.wallet)}</p>
            <p class="text-[10px] text-outline font-bold mt-1">${tx.time}</p>
          </div>
        </div>`,
            )
            .join("")
        : `<p class="font-body-sm text-body-sm text-on-surface-variant">Chưa có hoạt động nào trên blockchain.</p>`;
    } catch (err) {
      console.error(err);
      logsEl.innerHTML = `<p class="font-body-sm text-body-sm text-on-surface-variant">Không tải được hoạt động on-chain.</p>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await initAdminWallet();
  await bvRenderDashboard();

  const createBtn = document.getElementById("create-election-btn");
  if (createBtn) createBtn.addEventListener("click", bvCreateNewElection);

  document.querySelectorAll(".glass-card").forEach((card) => {
    card.style.transition = "all 0.3s ease";
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-4px)";
      card.style.boxShadow = "0 25px 50px -12px rgba(79, 70, 229, 0.08)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "0 15px 35px -5px rgba(79, 70, 229, 0.04)";
    });
  });

  window.addEventListener("bv:wallet-ready", bvRenderDashboard);
});
