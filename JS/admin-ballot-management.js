/* =========================================================================
   TRANG QUẢN LÝ CUỘC BẦU CỬ — tích hợp ethers.js
   Tạo cuộc bầu cử (createElection). Việc chuyển trạng thái được thực hiện
   tại trang "Điều khiển" (admin-system-control.html).
   Lưu ý: Smart Contract không lưu ngày bắt đầu/kết thúc do người dùng nhập —
   startTime/endTime được contract tự ghi nhận khi chuyển sang giai đoạn
   Voting/Ended. Các trường ngày trên form chỉ mang tính tham khảo hiển thị.
   ========================================================================= */
import {
  initAdminPage,
  getContract,
  guardAdmin,
  fetchElections,
  statusLabel,
} from "./admin-common.js";

let cachedElections = [];

function bvStatusBadge(status) {
  const map = {
    draft: {
      text: "Chưa khởi tạo",
      cls: "bg-surface-container-high text-on-surface-variant",
    },
    registration: {
      text: "Đang mở đăng ký",
      cls: "bg-tertiary-fixed text-tertiary",
    },
    verification: {
      text: "Đang xác thực",
      cls: "bg-secondary-fixed text-secondary",
    },
    voting: { text: "Đang bỏ phiếu", cls: "bg-primary-fixed text-primary" },
    ended: {
      text: "Đã kết thúc",
      cls: "bg-surface-container-high text-on-surface-variant",
    },
  };
  const s = map[status] || map.draft;
  return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${s.cls} font-label-md text-[12px]"><span class="w-1.5 h-1.5 rounded-full bg-current"></span>${s.text}</span>`;
}

function fmtTime(unixSeconds) {
  if (!unixSeconds) return "—";
  return new Date(unixSeconds * 1000).toLocaleString("vi-VN");
}

async function loadElections() {
  const contract = getContract();
  cachedElections = contract ? await fetchElections(contract) : [];
}

function renderBallot() {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  const latest = cachedElections[cachedElections.length - 1] || null;

  set("bs-total-elections", cachedElections.length.toLocaleString("vi-VN"));
  set("bs-total-candidates", latest ? "—" : "0");
  set("bs-total-voters", "—");

  const row = document.getElementById("election-row");
  if (row) {
    if (!latest) {
      row.innerHTML = `<td colspan="4" class="px-lg py-lg text-center text-on-surface-variant font-body-sm text-body-sm">Chưa có cuộc bầu cử nào được tạo trên blockchain.</td>`;
      return;
    }
    row.innerHTML = `
      <td class="px-lg py-lg">
        <p class="font-label-md text-label-md text-on-surface">${latest.title}</p>
        <p class="font-body-sm text-body-sm text-on-surface-variant max-w-md line-clamp-2">${latest.description}</p>
      </td>
      <td class="px-lg py-lg">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-[16px]">play_circle</span>
            <span class="font-mono-label text-mono-label">${fmtTime(latest.startTime)}</span>
          </div>
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-[16px]">stop_circle</span>
            <span class="font-mono-label text-mono-label">${fmtTime(latest.endTime)}</span>
          </div>
        </div>
      </td>
      <td class="px-lg py-lg text-center">${bvStatusBadge(latest.status)}</td>
      <td class="px-lg py-lg text-right">
        <a href="admin-system-control.html" class="p-2 hover:bg-primary-fixed rounded-lg transition-colors text-primary inline-flex" title="Điều khiển cuộc bầu cử">
          <span class="material-symbols-outlined">settings_input_component</span>
        </a>
      </td>`;
  }
}

async function refreshAndRender() {
  if (!guardAdmin()) return;

  await loadElections();
  renderBallot();
}
function bvToggleModal() {
  const modal = document.getElementById("createModal");
  if (!modal) return;
  modal.classList.toggle("hidden");
  document.body.style.overflow = modal.classList.contains("hidden")
    ? "auto"
    : "hidden";
}
window.bvToggleModal = bvToggleModal;

async function bvCreateElection(event) {
  event.preventDefault();
  const contract = getContract();
  if (!contract) {
    alert("Bạn cần kết nối ví Admin.");
    return;
  }
  const name = document.getElementById("election-name-input").value.trim();
  const desc = document.getElementById("election-desc-input").value.trim();
  if (!name) {
    alert("Vui lòng nhập tên cuộc bầu cử.");
    return;
  }
  try {
    const tx = await contract.createElection(name, desc);
    await tx.wait();
    bvToggleModal();
    document.getElementById("create-election-form")?.reset();
    await refreshAndRender();
  } catch (err) {
    console.error(err);
    alert(
      "Giao dịch thất bại: " + (err.reason || err.message || "Không xác định"),
    );
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await initAdminPage((state) => {
    if (state.connected) refreshAndRender();
    else renderBallot();
  });

  const form = document.getElementById("create-election-form");
  if (form) form.addEventListener("submit", bvCreateElection);
  const openBtn = document.getElementById("open-create-modal-btn");
  if (openBtn) openBtn.addEventListener("click", bvToggleModal);
});
