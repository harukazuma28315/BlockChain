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

/* =========================================================================
   TRANG ĐIỀU KHIỂN CUỘC BẦU CỬ — tích hợp ethers.js
   Chuyển trạng thái cuộc bầu cử hiện hành: Mở đăng ký -> Mở xác thực ->
   Mở bỏ phiếu -> Kết thúc, gọi trực tiếp changeElectionStatus() trên Smart
   Contract. Thứ tự chuyển giai đoạn được chính Smart Contract kiểm soát
   (chỉ cho phép tiến từng bước một, không cho nhảy cóc).
   ========================================================================= */
import {
  initAdminPage,
  getContract,
  getProvider,
  guardAdmin,
  shortAddr,
  fetchCurrentElection,
  fetchCandidates,
  fetchVoters,
  fetchAllTransactions,
  statusKeyFromEnum,
} from "./admin-common.js";

const BV_STAGES = [
  {
    key: "registration",
    enumValue: 1,
    label: "Mở đăng ký",
    icon: "how_to_reg",
    desc: "Cho phép cử tri và ứng viên đăng ký tham gia cuộc bầu cử.",
  },
  {
    key: "verification",
    enumValue: 2,
    label: "Mở xác thực",
    icon: "verified_user",
    desc: "Admin xác thực danh sách cử tri và ứng viên hợp lệ.",
  },
  {
    key: "voting",
    enumValue: 3,
    label: "Mở bỏ phiếu",
    icon: "how_to_vote",
    desc: "Kích hoạt hợp đồng thông minh, cho phép cử tri bỏ phiếu.",
  },
  {
    key: "ended",
    enumValue: 4,
    label: "Kết thúc bỏ phiếu",
    icon: "stop_circle",
    desc: "Đóng cổng bình chọn và chốt kết quả cuối cùng trên chuỗi.",
  },
];

function bvStageIndex(status) {
  const order = ["draft", "registration", "verification", "voting", "ended"];
  return order.indexOf(status);
}

let currentElection = null;

async function loadData() {
  const contract = getContract();
  if (!contract) {
    currentElection = null;
    return { candidates: [], voters: [] };
  }
  const [election, candidates, voters] = await Promise.all([
    fetchCurrentElection(contract),
    fetchCandidates(contract),
    fetchVoters(contract),
  ]);
  currentElection = election;
  return { candidates, voters };
}

async function renderControl() {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  const { candidates, voters } = await loadData();

  set(
    "election-name-display",
    currentElection ? currentElection.title : "Chưa có cuộc bầu cử",
  );

  const statusIcon = {
    draft: "⚪",
    registration: "🟠",
    verification: "🔵",
    voting: "🟢",
    ended: "⚫",
  };
  const statusText = {
    draft: "Chưa khởi tạo",
    registration: "Đang mở đăng ký",
    verification: "Đang xác thực",
    voting: "Đang bỏ phiếu",
    ended: "Đã kết thúc",
  };
  const currentStatus = currentElection ? currentElection.status : "draft";
  set(
    "current-status-label",
    `${statusIcon[currentStatus]} ${statusText[currentStatus]}`,
  );

  const totalVotes = candidates.reduce((s, c) => s + (c.votes || 0), 0);
  const turnout = voters.length
    ? ((totalVotes / voters.length) * 100).toFixed(1)
    : "0.0";
  set("rt-total-votes", totalVotes.toLocaleString("vi-VN"));
  set("rt-turnout", `${turnout}%`);

  const provider = getProvider();
  if (provider) {
    try {
      const blockNumber = await provider.getBlockNumber();
      set("rt-block", "#" + blockNumber.toLocaleString("vi-VN"));
    } catch (e) {
      set("rt-block", "—");
    }
  }

  const progressMap = { draft: 5, registration: 30, verification: 55, voting: 80, ended: 100 };
  const progressEl = document.getElementById("stage-progress-bar");
  const progressLabel = document.getElementById("stage-progress-label");
  const pct = progressMap[currentStatus] ?? 5;
  if (progressEl) progressEl.style.width = pct + "%";
  if (progressLabel) progressLabel.textContent = pct + "% hoàn thành";

  const stagesEl = document.getElementById("stage-controls");
  const currentIdx = bvStageIndex(currentStatus);
  if (stagesEl) {
    if (!currentElection) {
      stagesEl.innerHTML = `<p class="col-span-full text-center text-on-surface-variant font-body-sm text-body-sm p-lg">Chưa có cuộc bầu cử nào được tạo. Vui lòng tạo cuộc bầu cử ở trang "Quản lý bầu cử" trước.</p>`;
    } else {
      stagesEl.innerHTML = BV_STAGES.map((stage, i) => {
        const stageIdx = i + 1;
        const isDone = stageIdx < currentIdx;
        const isCurrent = stageIdx === currentIdx;
        const isNext = stageIdx === currentIdx + 1;
        const isLocked = !isNext && !isCurrent && !isDone;
        const isEndedStage = stage.key === "ended";

        let btnHtml;
        if ((isDone || isCurrent) && !isNext) {
          btnHtml = `<button disabled class="w-full py-md bg-primary-fixed text-primary font-label-md text-label-md rounded-xl flex items-center justify-center gap-sm cursor-default">
              <span class="material-symbols-outlined">check_circle</span> Đã hoàn tất</button>`;
        } else if (isNext) {
          btnHtml = `<button data-admin-only onclick="bvSetStage(${stage.enumValue})" class="w-full py-md ${isEndedStage ? "bg-error text-on-error hover:bg-[#a11717]" : "bg-primary text-on-primary hover:bg-on-primary-fixed-variant"} font-label-md text-label-md rounded-xl active:scale-95 transition-all shadow-md flex items-center justify-center gap-sm">
              <span class="material-symbols-outlined">${stage.icon}</span> ${stage.label}</button>`;
        } else {
          btnHtml = `<button disabled class="w-full py-md bg-outline-variant text-on-surface-variant font-label-md text-label-md rounded-xl cursor-not-allowed flex items-center justify-center gap-sm">
              <span class="material-symbols-outlined">${stage.icon}</span> ${stage.label}</button>`;
        }

        return `
        <div class="p-lg ${isEndedStage ? "bg-surface border-2 border-error-container" : "bg-surface-container-low border border-outline-variant"} rounded-xl flex flex-col justify-between ${isLocked ? "opacity-60" : ""}">
          <div>
            <div class="flex justify-between items-start mb-xs">
              <h3 class="font-label-md text-label-md">Giai đoạn ${stageIdx}: ${stage.label}</h3>
              ${isEndedStage ? '<span class="px-sm py-[2px] bg-error-container text-on-error-container text-[10px] font-bold rounded-full uppercase tracking-wider">Khẩn cấp</span>' : ""}
            </div>
            <p class="font-body-sm text-body-sm text-on-surface-variant mb-lg">${stage.desc}</p>
          </div>
          ${btnHtml}
        </div>`;
      }).join("");
    }
  }

  const logEl = document.getElementById("control-log-list");
  if (logEl) {
    logEl.innerHTML = `<p class="font-body-sm text-body-sm text-on-surface-variant p-lg">Đang tải nhật ký on-chain...</p>`;
    const contract = getContract();
    const provider = getProvider();
    const logs = contract && provider ? await fetchAllTransactions(contract, provider, 6) : [];
    logEl.innerHTML = logs.length
      ? logs
          .map(
            (tx, i) => `
      <div class="flex gap-md group">
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary border border-secondary/20">
            <span class="material-symbols-outlined text-[18px]">history</span>
          </div>
          ${i < logs.length - 1 ? '<div class="w-[2px] h-full bg-outline-variant mt-sm"></div>' : ""}
        </div>
        <div class="pb-md">
          <div class="flex items-center gap-sm mb-xs">
            <span class="font-label-md text-label-md">${tx.type}</span>
            <span class="font-body-sm text-body-sm text-on-surface-variant">${tx.time}</span>
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Ví: <code class="bg-surface-container px-sm py-[2px] rounded text-primary">${shortAddr(tx.wallet)}</code></p>
        </div>
      </div>`,
          )
          .join("")
      : `<p class="font-body-sm text-body-sm text-on-surface-variant p-lg">Chưa có thao tác nào được ghi nhận.</p>`;
  }

  guardAdmin();
}

window.bvSetStage = async function (enumValue) {
  const contract = getContract();
  if (!guardAdmin() || !contract || !currentElection) {
    alert("Bạn cần kết nối ví Admin và có cuộc bầu cử hợp lệ để thực hiện thao tác này.");
    return;
  }
  if (
    enumValue === 4 &&
    !confirm(
      "Kết thúc bầu cử sẽ chốt kết quả vĩnh viễn trên blockchain và không thể hoàn tác. Tiếp tục?",
    )
  ) {
    return;
  }
  try {
    const tx = await contract.changeElectionStatus(currentElection.id, enumValue);
    await tx.wait();
    await renderControl();
  } catch (err) {
    console.error(err);
    alert("Giao dịch thất bại: " + (err.reason || err.message || "Không xác định"));
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await initAdminPage((state) => {
    if (state.connected) renderControl();
  });

  document.querySelectorAll(".group").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const icon = item.querySelector(".material-symbols-outlined");
      if (icon) icon.style.transform = "scale(1.1)";
    });
    item.addEventListener("mouseleave", () => {
      const icon = item.querySelector(".material-symbols-outlined");
      if (icon) icon.style.transform = "scale(1)";
    });
  });
});
