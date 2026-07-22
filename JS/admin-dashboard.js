/* =========================================================================
   TRANG TỔNG QUAN (ADMIN DASHBOARD) — tích hợp ethers.js
   Đọc dữ liệu thật từ Smart Contract VotingSystem (không còn localStorage).
   ========================================================================= */
import {
  initAdminPage,
  getContract,
  getProvider,
  fetchVoters,
  fetchCandidates,
  fetchCurrentElection,
  fetchAllTransactions,
  statusLabel,
  shortAddr,
  getState,
} from "./admin-common.js";

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

async function renderDashboard() {
  const contract = getContract();
  const provider = getProvider();
  if (!contract) return;

  try {
    const [voters, candidates, election] = await Promise.all([
      fetchVoters(contract),
      fetchCandidates(contract),
      fetchCurrentElection(contract),
    ]);

    const totalVoters = voters.length;
    const verifiedVoters = voters.filter((v) => v.verified).length;
    const totalCandidates = candidates.length;
    const verifiedCandidates = candidates.filter((c) => c.verified).length;
    const totalVotes = candidates.reduce((s, c) => s + (c.votes || 0), 0);
    const turnout =
      totalVoters > 0 ? ((totalVotes / totalVoters) * 100).toFixed(1) : "0.0";

    setText("stat-total-voters", totalVoters.toLocaleString("vi-VN"));
    setText("stat-verified-voters", `${verifiedVoters} đã xác thực`);
    setText("stat-total-candidates", totalCandidates.toLocaleString("vi-VN"));
    setText("stat-verified-candidates", `${verifiedCandidates} đã xác thực`);
    setText("stat-total-votes", totalVotes.toLocaleString("vi-VN"));
    setText("stat-turnout", `${turnout}% tỷ lệ tham gia`);
    setText(
      "stat-system-status",
      election ? statusLabel(election.status) : "Chưa khởi tạo",
    );

    const dot = document.getElementById("system-status-dot");
    if (dot) {
      const key = election ? election.status : "draft";
      dot.className =
        key === "voting"
          ? "absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white pulse-dot"
          : key === "ended"
            ? "absolute -top-1 -right-1 w-3 h-3 rounded-full bg-outline border-2 border-white"
            : "absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-white pulse-dot";
    }

    // Hoạt động on-chain gần đây (5 sự kiện mới nhất từ event log)
    const logsEl = document.getElementById("recent-activity-list");
    if (logsEl) {
      logsEl.innerHTML = `<p class="font-body-sm text-body-sm text-on-surface-variant">Đang tải hoạt động on-chain...</p>`;
      const txs = await fetchAllTransactions(contract, provider, 5);
      logsEl.innerHTML = txs.length
        ? txs
            .map(
              (tx) => `
        <div class="flex gap-md">
          <div class="w-2 h-10 rounded-full mt-1 ${tx.status === "success" ? "bg-emerald-500" : "bg-error"}"></div>
          <div>
            <p class="font-label-md text-label-md text-on-surface">${tx.type}</p>
            <p class="font-body-sm text-body-sm text-on-surface-variant">Ví: ${shortAddr(tx.wallet)}</p>
            <p class="text-[10px] text-outline font-bold mt-1">${tx.time}</p>
          </div>
        </div>`,
            )
            .join("")
        : `<p class="font-body-sm text-body-sm text-on-surface-variant">Chưa có hoạt động nào trên blockchain.</p>`;
    }
  } catch (err) {
    console.error("Lỗi tải dữ liệu Dashboard:", err);
  }
}

function goToCreateElection() {
  const state = getState();

  if (!state.connected) {
    alert("Hãy kết nối MetaMask.");
    return;
  }

  if (!state.isAdmin) {
    alert("Chỉ Admin mới được phép.");
    return;
  }

  window.location.href = "admin-ballot-management.html";
}

document.addEventListener("DOMContentLoaded", async () => {
  await initAdminPage((state) => {
    // chưa kết nối
    if (!state.connected) return;

    // không phải admin
    if (!state.isAdmin) {
      alert("Ví hiện tại không có quyền Admin.");
      window.location.href = "../auth/connect-wallet.html";
      return;
    }

    renderDashboard();
  });

  const createBtn = document.getElementById("create-election-btn");
  if (createBtn) createBtn.addEventListener("click", goToCreateElection);

  // Hiệu ứng nổi nhẹ cho thẻ bento
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
});
