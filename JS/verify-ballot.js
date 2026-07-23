
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

// ====================== VERIFY-BALLOT.JS (Trang bỏ phiếu) ======================
// Trang bỏ phiếu THẬT: đọc ứng viên từ Smart Contract, kiểm tra điều kiện bỏ
// phiếu của cử tri (đã xác thực / chưa khóa / chưa bỏ phiếu) và gửi giao dịch
// contract.vote(electionId, candidateId) qua MetaMask khi xác nhận.
import { getReadContract, connectWallet, getContract } from "./blockchain.js";
import {
  getElectionPlain,
  getCandidatesForElection,
  shortAddr,
} from "./election-utils.js";

const params = new URLSearchParams(window.location.search);
let electionId = params.has("electionId") ? BigInt(params.get("electionId")) : null;
let myAddress = null;
let canVote = false;
let selectedCandidate = null;

const voteModal = document.getElementById("voteModal");

function bvBanner(message, kind = "info") {
  const el = document.getElementById("votingStatusBanner");
  if (!el) return;
  const styles = {
    info: "bg-secondary-fixed/40 border-secondary/30 text-on-surface",
    warn: "bg-amber-50 border-amber-200 text-amber-800",
    error: "bg-error-container/30 border-error/30 text-on-error-container",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  };
  el.className = `mb-lg p-md rounded-xl border font-body-sm text-body-sm ${styles[kind]}`;
  el.innerHTML = message;
  el.classList.remove("hidden");
}

async function resolveElectionId(contract) {
  if (electionId !== null) return electionId;
  const count = await contract.electionCount();
  return count === 0n ? null : count - 1n;
}

function candidateCard(c, enabled) {
  const initials = c.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(-2)
    .join("")
    .toUpperCase();
  return `
  <div class="candidate-card bg-surface p-lg rounded-xl border border-outline-variant hover:shadow-lg transition-all group">
    <div class="flex items-start justify-between mb-md">
      <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary text-primary font-bold text-xl">
        ${initials}
      </div>
      <span class="px-sm py-xs bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
        <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>Đã xác thực
      </span>
    </div>
    <h4 class="font-headline-md text-headline-md text-on-surface mb-xs">${c.fullName}</h4>
    <p class="font-body-sm text-body-sm text-on-surface-variant mb-lg line-clamp-2">${c.description || "Không có mô tả."}</p>
    <button
      type="button"
      ${enabled ? "" : "disabled"}
      class="select-candidate-btn w-full px-md py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md group-hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:group-hover:scale-100"
      data-id="${c.id}"
      data-name="${c.fullName}"
    >
      Chọn ứng viên
    </button>
  </div>`;
}

async function loadPage() {
  const contract = getReadContract();
  electionId = await resolveElectionId(contract);

  if (electionId === null) {
    document.getElementById("electionTitle").textContent = "Chưa có cuộc bầu cử nào";
    bvBanner("Hiện chưa có cuộc bầu cử nào được Admin tạo.", "warn");
    return;
  }

  const election = await getElectionPlain(contract, electionId);
  document.getElementById("electionTitle").textContent = election.title;
  document.getElementById("electionDesc").textContent =
    election.description || "Không có mô tả.";

  const candidates = (await getCandidatesForElection(contract, electionId)).filter(
    (c) => c.verified,
  );

  // Kiểm tra điều kiện bỏ phiếu của ví hiện tại (nếu đã kết nối)
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts && accounts.length > 0) myAddress = accounts[0];
    } catch (e) {
      /* ignore */
    }
  }

  canVote = false;
  if (election.statusKey !== "voting") {
    bvBanner(
      `Cuộc bầu cử hiện đang ở giai đoạn "<b>${election.statusKey === "ended" ? "Đã kết thúc" : "chưa mở bỏ phiếu"}</b>". Bạn chưa thể bỏ phiếu lúc này.`,
      "warn",
    );
  } else if (!myAddress) {
    bvBanner(
      `Bạn cần <button id="bvConnectBtn" class="underline font-bold">kết nối ví MetaMask</button> để bỏ phiếu.`,
      "info",
    );
  } else {
    const voter = await contract.getVoter(myAddress).catch(() => null);
    const hasVotedAlready = await contract.hasVoted(electionId, myAddress);
    if (!voter || voter.wallet === "0x0000000000000000000000000000000000000000") {
      bvBanner(
        `Ví <code>${shortAddr(myAddress)}</code> chưa được đăng ký làm cử tri. Vui lòng liên hệ Admin.`,
        "error",
      );
    } else if (!voter.verified) {
      bvBanner(`Cử tri <code>${shortAddr(myAddress)}</code> chưa được Admin xác thực.`, "warn");
    } else if (!voter.active) {
      bvBanner(`Quyền bỏ phiếu của ví <code>${shortAddr(myAddress)}</code> đã bị khóa.`, "error");
    } else if (hasVotedAlready) {
      bvBanner(`Bạn (<code>${shortAddr(myAddress)}</code>) đã bỏ phiếu trong cuộc bầu cử này rồi.`, "success");
    } else {
      bvBanner(`Đã kết nối ví <code>${shortAddr(myAddress)}</code>. Bạn có thể chọn 01 ứng viên để bỏ phiếu.`, "success");
      canVote = true;
    }
  }

  const grid = document.getElementById("candidateGrid");
  grid.innerHTML = candidates.length
    ? candidates.map((c) => candidateCard(c, canVote)).join("")
    : `<p class="col-span-full text-center py-xl text-on-surface-variant">Chưa có ứng viên nào được xác thực trong cuộc bầu cử này.</p>`;

  grid.querySelectorAll(".select-candidate-btn").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn));
  });

  const connectBtn = document.getElementById("bvConnectBtn");
  if (connectBtn) {
    connectBtn.addEventListener("click", async () => {
      const data = await connectWallet();
      if (data) {
        myAddress = data.address;
        await loadPage();
      }
    });
  }

  const headerAddr = document.getElementById("headerWalletAddress");
  if (headerAddr) headerAddr.textContent = myAddress ? shortAddr(myAddress) : "Chưa kết nối";
}

function openModal(button) {
  selectedCandidate = { id: button.dataset.id, name: button.dataset.name };
  document.getElementById("modalCandidateName").textContent = selectedCandidate.name;
  document.getElementById("modalCandidateRole").textContent = "Ứng viên";
  document.getElementById("modalCandidatePhoto").src =
    "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(selectedCandidate.name);
  document.getElementById("modalWalletAddress").textContent = myAddress ? shortAddr(myAddress) : "--";
  voteModal.classList.remove("hidden");
  voteModal.classList.add("flex");
}
window.openModal = openModal;

function closeModal() {
  voteModal.style.opacity = "0";
  voteModal.style.transition = "opacity 0.2s ease-out";
  setTimeout(() => {
    voteModal.classList.add("hidden");
    voteModal.classList.remove("flex");
    voteModal.style.opacity = "";
    voteModal.style.transition = "";
  }, 200);
}
window.closeModal = closeModal;

async function confirmVote() {
  if (!selectedCandidate) return;
  const btn = document.getElementById("confirmVoteBtn");
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `
        <div class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang chờ MetaMask xác nhận...
        </div>
    `;

  try {
    const data = await connectWallet();
    if (!data) throw new Error("Không thể kết nối ví MetaMask.");
    const contract = data.contract;
    const tx = await contract.vote(electionId, selectedCandidate.id);
    const receipt = await tx.wait();

    sessionStorage.setItem("lastVotedCandidate", selectedCandidate.name);
    sessionStorage.setItem("lastVoteTxHash", receipt.hash);
    sessionStorage.setItem("lastVoteBlock", String(receipt.blockNumber));
    window.location.href = "vote-success.html";
  } catch (err) {
    console.error(err);
    const reason = err?.reason || err?.shortMessage || err?.message || "Giao dịch thất bại.";
    alert("Lỗi bỏ phiếu: " + reason);
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}
window.confirmVote = confirmVote;

document.addEventListener("DOMContentLoaded", function () {
  loadPage();

  voteModal.addEventListener("click", function (e) {
    if (e.target === this) closeModal();
  });
});
