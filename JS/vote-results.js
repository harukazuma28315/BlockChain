
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

// ====================== VOTE-RESULTS.JS (Trang kết quả) ======================
// Đọc kết quả THẬT từ Smart Contract: số phiếu từng ứng viên, người dẫn đầu
// (getWinner), tổng số phiếu (totalVotes) và tỷ lệ tham gia.
import { getReadContract } from "./blockchain.js";
import {
  getElectionPlain,
  getCandidatesForElection,
  getAllVotersPlain,
  STATUS_LABELS,
  shortAddr,
} from "./election-utils.js";

const params = new URLSearchParams(window.location.search);
let electionId = params.has("electionId") ? BigInt(params.get("electionId")) : null;

async function resolveElectionId(contract) {
  if (electionId !== null) return electionId;
  const count = await contract.electionCount();
  return count === 0n ? null : count - 1n;
}

function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = val;
}

async function loadResults() {
  const contract = getReadContract();
  electionId = await resolveElectionId(contract);

  if (electionId === null) {
    set("rsElectionTitle", "Chưa có cuộc bầu cử nào được tạo.");
    return;
  }

  const [election, candidates, voters] = await Promise.all([
    getElectionPlain(contract, electionId),
    getCandidatesForElection(contract, electionId),
    getAllVotersPlain(contract),
  ]);

  set("rsElectionTitle", `${election.title} — ${STATUS_LABELS[election.statusKey]}`);

  const badgeEl = document.getElementById("rsStatusBadge");
  if (badgeEl) {
    const isEnded = election.statusKey === "ended";
    badgeEl.innerHTML = `<span class="w-2 h-2 rounded-full ${isEnded ? "bg-outline" : "bg-emerald-500 animate-pulse"}"></span><span class="font-label-md text-label-md">${isEnded ? "Đã kết thúc" : "Đang cập nhật trực tiếp"}</span>`;
  }

  const verified = candidates.filter((c) => c.verified);
  const totalVotes = verified.reduce((s, c) => s + c.voteCount, 0);
  const sorted = verified.slice().sort((a, b) => b.voteCount - a.voteCount);
  const winner = sorted[0];

  set("rsTotalVotes", totalVotes.toLocaleString("vi-VN"));
  set("rsTotalVoters", voters.length.toLocaleString("vi-VN"));
  set(
    "rsTurnout",
    voters.length ? `${((totalVotes / voters.length) * 100).toFixed(1)}%` : "0%",
  );

  const winnerCard = document.getElementById("rsWinnerCard");
  if (winner && winner.voteCount > 0) {
    if (winnerCard) winnerCard.classList.remove("hidden");
    set("rsWinnerName", winner.fullName);
    set("rsWinnerDesc", winner.description || "Không có mô tả.");
    set("rsWinnerVotes", winner.voteCount.toLocaleString("vi-VN"));
    set(
      "rsWinnerPct",
      totalVotes ? `${((winner.voteCount / totalVotes) * 100).toFixed(1)}%` : "0%",
    );
  } else if (winnerCard) {
    winnerCard.classList.add("hidden");
  }

  const list = document.getElementById("rsRankingList");
  if (list) {
    list.innerHTML = sorted.length
      ? sorted
          .map((c, i) => {
            const pct = totalVotes ? (c.voteCount / totalVotes) * 100 : 0;
            return `
        <div class="px-lg py-md flex items-center gap-md">
          <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"}">${i + 1}</div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center mb-1">
              <p class="font-label-md text-label-md text-on-surface truncate">${c.fullName}</p>
              <p class="font-label-md text-label-md text-on-surface-variant">${c.voteCount.toLocaleString("vi-VN")} phiếu (${pct.toFixed(1)}%)</p>
            </div>
            <div class="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div class="${i === 0 ? "bg-primary" : "bg-secondary-container"} h-full rounded-full" style="width:${pct}%"></div>
            </div>
          </div>
        </div>`;
          })
          .join("")
      : `<p class="p-lg text-center text-on-surface-variant">Chưa có ứng viên nào.</p>`;
  }
}

async function bvRenderWalletHeader() {
  const addrEl = document.getElementById("headerWalletAddress");
  if (!addrEl || !window.ethereum) return;
  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts && accounts.length > 0) addrEl.textContent = shortAddr(accounts[0]);
  } catch (e) {
    /* ignore */
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadResults();
  bvRenderWalletHeader();

  const winnerCard = document.querySelector(".winner-gradient");
  if (winnerCard) {
    winnerCard.addEventListener("mousemove", (e) => {
      const rect = winnerCard.getBoundingClientRect();
      winnerCard.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      winnerCard.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    });
  }
});
