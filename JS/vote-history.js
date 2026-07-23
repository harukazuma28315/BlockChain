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
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
      },
    },
  },
};
// ====================== VOTE-HISTORY.JS ======================
// Lịch sử bỏ phiếu thật của ví đang kết nối
// Đọc event VoteCast từ Smart Contract

import { getReadContract } from "./blockchain.js";

import {
  getElectionPlain,
  shortAddr,
  fetchVoteEvents,
} from "./election-utils.js";

let myAddress = null;

function renderRow(row) {
  return `
  <tr class="hover:bg-surface-container-low transition-colors">
    <td class="px-lg py-lg">
      <p class="font-label-md text-label-md text-on-surface">
        ${row.electionTitle}
      </p>
      <p class="font-body-sm text-body-sm text-on-surface-variant">
        #${row.electionId}
      </p>
    </td>

    <td class="px-lg py-lg font-label-md text-label-md">
      ${row.candidateName}
    </td>

    <td class="px-lg py-lg font-body-sm text-body-sm text-on-surface-variant">
      ${row.time}
    </td>

    <td class="px-lg py-lg">
      <div class="flex items-center gap-xs">
        <span class="font-mono-label text-mono-label text-on-surface">
          ${shortAddr(row.hash)}
        </span>

        <button
          type="button"
          class="copy-hash-btn text-primary hover:bg-primary/10 p-xs rounded transition-all"
          data-hash="${row.hash}"
        >
          <span class="material-symbols-outlined text-[16px]">
            content_copy
          </span>
        </button>
      </div>
    </td>

    <td class="px-lg py-lg">
      <span class="px-md py-xs bg-emerald-100 text-emerald-700 text-xs rounded-full font-bold uppercase">
        Đã ghi nhận
      </span>
    </td>

    <td class="px-lg py-lg">
      ${
        row.isEnded
          ? `
            <a
              href="vote-results.html?electionId=${row.electionId}"
              class="px-md py-xs bg-primary-container text-on-primary-container text-xs rounded-full font-bold uppercase inline-flex items-center gap-1 hover:bg-primary-container/90 transition-colors"
            >
              <span class="material-symbols-outlined text-[14px]">
                leaderboard
              </span>
              Xem kết quả
            </a>
          `
          : `
            <span class="px-md py-xs bg-surface-container text-on-surface-variant text-xs rounded-full font-bold uppercase inline-flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">
                hourglass_top
              </span>
              Chờ kết thúc
            </span>
          `
      }
    </td>
  </tr>`;
}

async function loadHistory() {
  const tbody = document.getElementById("historyTableBody");
  const emptyState = document.getElementById("historyEmptyState");
  const headerAddr = document.getElementById("headerWalletAddress");

  // Lấy ví đang kết nối
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts && accounts.length > 0) {
        myAddress = accounts[0];
      }
    } catch (e) {
      console.error("Không lấy được địa chỉ ví:", e);
    }
  }

  if (headerAddr) {
    headerAddr.textContent = myAddress ? shortAddr(myAddress) : "Chưa kết nối";
  }

  if (!myAddress) {
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="px-lg py-xl text-center text-on-surface-variant">
            Kết nối ví MetaMask để xem lịch sử bỏ phiếu của bạn.
          </td>
        </tr>
      `;
    }

    return;
  }

  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-lg py-xl text-center text-on-surface-variant">
          Đang tải lịch sử bỏ phiếu từ blockchain...
        </td>
      </tr>
    `;
  }

  try {
    const contract = getReadContract();

    // Đọc event VoteCast theo từng khoảng block,
    // tránh lỗi RPC giới hạn 10.000 block
    const allVoteEvents = await fetchVoteEvents(contract);

    // Chỉ giữ các phiếu của ví hiện tại
    const myEvents = allVoteEvents.filter(
      (ev) => ev.args.voter.toLowerCase() === myAddress.toLowerCase(),
    );

    // Mới nhất trước
    myEvents.sort((a, b) => b.blockNumber - a.blockNumber);

    const provider = contract.provider ?? contract.runner?.provider;

    const rows = await Promise.all(
      myEvents.map(async (ev) => {
        const electionId = ev.args.electionId;
        const candidateId = ev.args.candidateId;

        const [election, candidate, block] = await Promise.all([
          getElectionPlain(contract, electionId),

          contract.getCandidate(candidateId),

          provider.getBlock(ev.blockNumber),
        ]);

        return {
          electionId: electionId.toString(),

          electionTitle: election.title,

          isEnded: election.statusKey === "ended",

          candidateName: candidate.fullName,

          hash: ev.transactionHash,

          time: block
            ? new Date(Number(block.timestamp) * 1000).toLocaleString("vi-VN")
            : "",

          timestamp: block ? Number(block.timestamp) : 0,
        };
      }),
    );

    if (tbody) {
      tbody.innerHTML = rows.length ? rows.map(renderRow).join("") : "";
    }

    if (emptyState) {
      emptyState.classList.toggle("hidden", rows.length > 0);
    }

    const set = (id, val) => {
      const el = document.getElementById(id);

      if (el) {
        el.textContent = val;
      }
    };

    set("histTotalVotes", rows.length.toString());

    set("histConfirmed", `${rows.length}/${rows.length}`);

    set("histLastTime", rows.length ? rows[0].time : "--");

    // Nút copy transaction hash
    document.querySelectorAll(".copy-hash-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const fullHash = this.dataset.hash;

        const icon = this.querySelector(".material-symbols-outlined");

        navigator.clipboard.writeText(fullHash).then(() => {
          icon.textContent = "check";

          setTimeout(() => {
            icon.textContent = "content_copy";
          }, 2000);
        });
      });
    });
  } catch (err) {
    console.error("Lỗi tải lịch sử bỏ phiếu:", err);

    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="px-lg py-xl text-center text-error">
            Không tải được lịch sử bỏ phiếu.
          </td>
        </tr>
      `;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadHistory();
});
