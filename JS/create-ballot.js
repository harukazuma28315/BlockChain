
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
                {
                  lineHeight: "16px",
                  letterSpacing: "0.02em",
                  fontWeight: "500",
                },
              ],
              "label-md": [
                "14px",
                {
                  lineHeight: "20px",
                  letterSpacing: "0.05em",
                  fontWeight: "600",
                },
              ],
              "headline-lg": [
                "32px",
                {
                  lineHeight: "40px",
                  letterSpacing: "-0.01em",
                  fontWeight: "600",
                },
              ],
              "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
              "headline-lg-mobile": [
                "24px",
                { lineHeight: "32px", fontWeight: "600" },
              ],
              "display-lg": [
                "48px",
                {
                  lineHeight: "56px",
                  letterSpacing: "-0.02em",
                  fontWeight: "700",
                },
              ],
              "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
              "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
              "headline-md": [
                "24px",
                { lineHeight: "32px", fontWeight: "600" },
              ],
            },
          },
        },
      };

// ====================== CREATE-BALLOT.JS (Danh sách bầu cử) ======================
// Đọc TOÀN BỘ danh sách cuộc bầu cử THẬT từ Smart Contract (không cần kết nối
// ví, chỉ cần đọc dữ liệu công khai on-chain) và hiển thị dạng card.
import { getReadContract, connectWallet } from "./blockchain.js";
import {
  getAllElectionsPlain,
  getAllCandidatesPlain,
  STATUS_LABELS,
  shortAddr,
} from "./election-utils.js";

const STATUS_UI = {
  draft: { tab: "upcoming", badge: "bg-surface-container text-on-surface-variant", dot: "bg-outline" },
  registration: { tab: "upcoming", badge: "bg-tertiary-fixed text-tertiary", dot: "bg-tertiary" },
  verification: { tab: "upcoming", badge: "bg-secondary-fixed text-secondary", dot: "bg-secondary" },
  voting: { tab: "active", badge: "bg-primary-fixed text-primary", dot: "bg-primary animate-pulse" },
  ended: { tab: "ended", badge: "bg-surface-container-high text-on-surface-variant", dot: "bg-outline" },
};

function bvCard(election, candidateCount) {
  const ui = STATUS_UI[election.statusKey] || STATUS_UI.draft;
  const isVoting = election.statusKey === "voting";
  const isEnded = election.statusKey === "ended";
  const primaryLink = isVoting
    ? `verify-ballot.html?electionId=${election.id}`
    : isEnded
      ? `vote-results.html?electionId=${election.id}`
      : null;
  const primaryLabel = isVoting
    ? "Xem ứng viên &amp; Bỏ phiếu"
    : isEnded
      ? "Xem kết quả"
      : "Chưa mở bỏ phiếu";

  return `
  <div class="election-card bg-surface-container-low border border-outline-variant rounded-xl p-lg flex flex-col gap-md hover:shadow-lg transition-shadow"
       data-status="${ui.tab}" data-name="${election.title.toLowerCase()}">
    <div class="flex items-start justify-between">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${ui.badge} font-label-md text-[12px]">
        <span class="w-1.5 h-1.5 rounded-full ${ui.dot}"></span>${STATUS_LABELS[election.statusKey]}
      </span>
      <span class="font-mono-label text-mono-label text-on-surface-variant">#${election.id}</span>
    </div>
    <div>
      <h3 class="font-headline-md text-headline-md text-on-surface mb-xs">${election.title}</h3>
      <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">${election.description || "Không có mô tả."}</p>
    </div>
    <div class="flex items-center gap-md text-on-surface-variant font-body-sm text-body-sm">
      <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">groups</span>${candidateCount} ứng viên</span>
    </div>
    ${
      primaryLink
        ? `<a href="${primaryLink}" class="mt-auto w-full text-center py-sm bg-primary text-on-primary font-label-md text-label-md rounded-xl hover:opacity-90 transition-opacity">${primaryLabel}</a>`
        : `<button disabled class="mt-auto w-full py-sm bg-surface-container text-on-surface-variant font-label-md text-label-md rounded-xl cursor-not-allowed">${primaryLabel}</button>`
    }
  </div>`;
}

async function loadElections() {
  const grid = document.getElementById("electionGrid");
  const emptyState = document.getElementById("emptyState");
  if (!grid) return;
  grid.innerHTML = `<p class="col-span-full text-center py-xl text-on-surface-variant">Đang tải danh sách bầu cử từ Smart Contract...</p>`;

  try {
    const contract = getReadContract();
    const [elections, candidates] = await Promise.all([
      getAllElectionsPlain(contract),
      getAllCandidatesPlain(contract),
    ]);

    if (!elections.length) {
      grid.innerHTML = "";
      if (emptyState) emptyState.classList.remove("hidden");
      return;
    }

    const withCounts = await Promise.all(
      elections
        .slice()
        .reverse()
        .map(async (e) => {
          const flags = await Promise.all(
            candidates.map((c) => contract.isCandidateInElection(e.id, c.id)),
          );
          return { election: e, count: flags.filter(Boolean).length };
        }),
    );

    grid.innerHTML = withCounts
      .map(({ election, count }) => bvCard(election, count))
      .join("");
    bvInitFilters();
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p class="col-span-full text-center py-xl text-error">Không tải được danh sách bầu cử. Kiểm tra kết nối MetaMask/mạng Sepolia.</p>`;
  }
}

function bvInitFilters() {
  const filterTabs = document.querySelectorAll(".filter-tab");
  const searchInput = document.getElementById("electionSearchInput");
  const electionCards = document.querySelectorAll(".election-card");
  const emptyState = document.getElementById("emptyState");
  let currentFilter = "all";

  function applyFilters() {
    const keyword = (searchInput?.value || "").trim().toLowerCase();
    let visibleCount = 0;
    electionCards.forEach((card) => {
      const matchesStatus =
        currentFilter === "all" || card.dataset.status === currentFilter;
      const matchesKeyword =
        keyword === "" || card.dataset.name.includes(keyword);
      const isVisible = matchesStatus && matchesKeyword;
      card.classList.toggle("hidden", !isVisible);
      if (isVisible) visibleCount += 1;
    });
    if (emptyState) emptyState.classList.toggle("hidden", visibleCount > 0);
  }

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      filterTabs.forEach((t) => {
        t.classList.remove("bg-primary", "text-on-primary");
        t.classList.add("bg-surface-container", "text-on-surface-variant");
      });
      this.classList.remove("bg-surface-container", "text-on-surface-variant");
      this.classList.add("bg-primary", "text-on-primary");
      currentFilter = this.dataset.filter;
      applyFilters();
    });
  });

  if (searchInput) searchInput.addEventListener("input", applyFilters);
}

async function bvRenderWalletHeader() {
  const addrEl = document.getElementById("headerWalletAddress");
  if (!addrEl) return;
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts && accounts.length > 0) {
        addrEl.textContent = shortAddr(accounts[0]);
        return;
      }
    } catch (e) {
      /* ignore */
    }
  }
  addrEl.textContent = "Chưa kết nối";
}

document.addEventListener("DOMContentLoaded", () => {
  loadElections();
  bvRenderWalletHeader();
});
