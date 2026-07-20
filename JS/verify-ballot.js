
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
    

      var voteModal = document.getElementById("voteModal");
      var selectedCandidateName = "";

      /**
       * Mo modal xac nhan va do du lieu ung vien vua duoc chon vao modal,
       * thay vi hien thi co dinh "Nguyen Van A" cho moi lan chon.
       */
      function openModal(candidateButton) {
        selectedCandidateName = candidateButton.dataset.name;

        document.getElementById("modalCandidateName").textContent =
          candidateButton.dataset.name;
        document.getElementById("modalCandidateRole").textContent =
          candidateButton.dataset.role;
        document.getElementById("modalCandidatePhoto").src =
          candidateButton.dataset.photo;

        voteModal.classList.remove("hidden");
        voteModal.classList.add("flex");
      }

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

      function confirmVote() {
        const btn = document.getElementById("confirmVoteBtn");
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

        // Luu lai ung vien da chon de trang Bo phieu thanh cong co the hien thi lai,
        // mo phong buoc Smart Contract ghi nhan giao dich va tra ve Transaction Hash.
        sessionStorage.setItem("lastVotedCandidate", selectedCandidateName);

        setTimeout(() => {
          window.location.href = "vote-success.html";
        }, 2000);
      }

      document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".select-candidate-btn").forEach((btn) => {
          btn.addEventListener("click", function () {
            openModal(this);
          });
        });

        // Dong modal khi bam ra vung nen mo (overlay)
        voteModal.addEventListener("click", function (e) {
          if (e.target === this) closeModal();
        });
      });
    
