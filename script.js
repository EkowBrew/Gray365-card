
/* =========================================
   GRAY365 STUDIO — DIGITAL BUSINESS CARD
   ========================================= */

const GRAY365 = {
  name: "Gray365 Studio",
  organization: "Gray365 Studio",
  jobTitle: "Nail Technician & Nail Artist",

  phoneDisplay: "0555262368",
  phoneInternational: "+233555262368",

  website: "https://www.gray365studio.com/",
  whatsapp: "https://wa.me/233555262368",

  socials: {
    Instagram: "https://www.instagram.com/gray365.studio/",
    TikTok: "https://www.tiktok.com/@gray365.studio",
    Snapchat: "https://www.snapchat.com/add/gray365.studio"
  }
};


/* =========================================
   TOAST MESSAGE
   ========================================= */

const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}


/* =========================================
   SOCIAL MEDIA LINKS
   ========================================= */

document.querySelectorAll("[data-placeholder]").forEach(link => {
  const platform = link.dataset.placeholder;
  const url = GRAY365.socials[platform];

  if (url) {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.href = "#";

    link.addEventListener("click", event => {
      event.preventDefault();
      showToast(`The ${platform} link has not been configured.`);
    });
  }
});


/* =========================================
   SHARE DIGITAL CARD
   ========================================= */

const shareButton = document.getElementById("shareBtn");

if (shareButton) {
  shareButton.addEventListener("click", async () => {
    const shareData = {
      title: GRAY365.name,
      text:
        "Gray365 Studio — Nail Technician & Nail Artist. " +
        "Book your nail appointment with us.",
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== "AbortError") {
          showToast("Unable to share right now. Please copy the page link.");
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Digital card link copied. You can now share it.");
      } catch (error) {
        showToast(
          "Copy the digital card address from your browser to share it."
        );
      }
    }
  });
}


/* =========================================
   CREATE VCARD CONTACT FILE
   ========================================= */

function escapeVCard(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function createVCard() {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",

    `FN:${escapeVCard(GRAY365.name)}`,
    `ORG:${escapeVCard(GRAY365.organization)}`,
    `TITLE:${escapeVCard(GRAY365.jobTitle)}`,

    `TEL;TYPE=CELL,VOICE:${GRAY365.phoneInternational}`,
    `URL:${GRAY365.website}`,

    `URL;TYPE=WhatsApp:${GRAY365.whatsapp}`,

    `X-SOCIALPROFILE;TYPE=instagram:${GRAY365.socials.Instagram}`,
    `X-SOCIALPROFILE;TYPE=tiktok:${GRAY365.socials.TikTok}`,
    `X-SOCIALPROFILE;TYPE=snapchat:${GRAY365.socials.Snapchat}`,

    "NOTE:Nail artistry, beauty and detail",

    "END:VCARD"
  ];

  return lines.join("\r\n") + "\r\n";
}


/* =========================================
   SAVE CONTACT BUTTON
   ========================================= */

const saveContactButton = document.getElementById("saveContactBtn");

if (saveContactButton) {
  saveContactButton.addEventListener("click", async () => {
    const vcardContent = createVCard();

    const contactFile = new File(
      [vcardContent],
      "Gray365-Studio.vcf",
      {
        type: "text/vcard;charset=utf-8"
      }
    );

    /*
      On supported devices, open the native sharing
      workflow so the customer can choose a compatible
      Contacts/import option.
    */

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [contactFile] })
    ) {
      try {
        await navigator.share({
          title: "Save Gray365 Studio",
          files: [contactFile]
        });

        return;
      } catch (error) {
        // Do not download another file if the customer
        // deliberately cancelled the sharing window.
        if (error.name === "AbortError") {
          return;
        }
      }
    }

    /*
      Fallback for browsers that cannot share files.
      The customer opens the downloaded file and saves
      Gray365 Studio to their Contacts.
    */

    const fileURL = URL.createObjectURL(contactFile);
    const downloadLink = document.createElement("a");

    downloadLink.href = fileURL;
    downloadLink.download = "Gray365-Studio.vcf";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    setTimeout(() => {
      URL.revokeObjectURL(fileURL);
    }, 10000);

    showToast(
      "Contact downloaded. Open Gray365-Studio.vcf and choose Save Contact."
    );
  });
}
